part of '../fastlottie.dart';

/// Coordinates Telegram-style Double-Buffered Ping-Pong GPU textures (`ui.Image`),
/// persistent worker Isolate decoding, LZ4 disk/RAM caching, and UI repaint hints.
final class _PingPongCoordinator {
  _PingPongCoordinator(
    this.cache, {
    String? diskCacheDirectory,
    int? workerCount,
  }) : workerPool = _RasterWorkerPool(
         workerCount: defaultWorkerCount(workerCount),
         maximumCompressedMemoryBytes: cache.maximumCompressedMemoryBytes,
         maximumDiskBytes: cache.maximumDiskBytes,
         diskCacheDirectory: diskCacheDirectory,
       );

  final FastLottieRasterCache cache;
  final _RasterWorkerPool workerPool;

  final _highPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _lowPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _activeDiskKeys = <String>{};
  int _activeJobs = 0;
  bool _disposed = false;
  bool _pumpScheduled = false;

  int get activeJobCount => _activeJobs;
  int get pendingCount =>
      _activeJobs + _highPriorityQueue.length + _lowPriorityQueue.length;

  void clearPending() {
    for (final entry in _highPriorityQueue) {
      entry.queuedForPingPong = false;
      entry.queuedHighPriority = false;
      entry.pendingFrameIndex = -1;
    }
    for (final entry in _lowPriorityQueue) {
      entry.queuedForPingPong = false;
      entry.queuedHighPriority = false;
      entry.pendingFrameIndex = -1;
    }
    _highPriorityQueue.clear();
    _lowPriorityQueue.clear();
  }

  void onEntryReleased(_RasterEntry entry) {
    if (entry.queuedForPingPong) {
      _highPriorityQueue.remove(entry);
      _lowPriorityQueue.remove(entry);
      entry.queuedForPingPong = false;
      entry.queuedHighPriority = false;
    }
    entry.pendingFrameIndex = -1;
  }

  (ui.Image?, _RasterEntry?, int) lookup(
    FastLottiePlayer player,
    Size rawPixels,
    double relative,
  ) {
    final pw = math.max(1, (rawPixels.width - 1e-4).ceil());
    final ph = math.max(1, (rawPixels.height - 1e-4).ceil());
    final keySize = Size(pw.toDouble(), ph.toDouble());
    final c = player.composition;
    final poster = player.rasterMode == FastLottieRasterMode.poster;
    final rateKey = poster || c.isStatic
        ? 0
        : cache._rateKey(c, player.maximumFrameRate);

    var entry = player._rasterEntry;
    if (entry == null ||
        entry.retired ||
        entry.key.$2 != keySize ||
        entry.key.$3 != poster ||
        entry.key.$4 != rateKey) {
      if (entry == null &&
          player._rasterRejectedKey == (keySize, rateKey) &&
          player._rasterRejectedGeneration == cache._admissionGeneration) {
        cache.misses++;
        return (null, null, -1);
      }
      cache._release(player);
      entry = cache._acquire(player, keySize);
      player._rasterEntry = entry;
      if (entry == null) {
        player._rasterRejectedKey = (keySize, rateKey);
        player._rasterRejectedGeneration = cache._admissionGeneration;
      } else {
        player._rasterRejectedKey = null;
      }
    }
    if (entry == null) {
      cache.misses++;
      return (null, null, -1);
    }

    final total = entry.totalFrames;
    final index = c.isStatic || entry.poster || total <= 1
        ? 0
        : (relative / entry.frameStep + 1e-7).floor().clamp(0, total - 1);

    workerPool.touchDiskEntry(entry.entryKey);

    // 1. Exact front-buffer hit.
    if (entry.renderingImage != null && entry.renderingFrameIndex == index) {
      entry.desiredFrameIndex = index;
      cache.hits++;
      if (!entry.poster && total > 1 && entry.hasPlayedAdvance) {
        _ensurePrefetch(entry, (index + 1) % total);
      }
      return (entry.renderingImage, entry, index);
    }

    // 2. O(1) Back-buffer pointer swap when lookahead frame matches.
    if (entry.backgroundImage != null && entry.backgroundFrameIndex == index) {
      final promoted = entry.backgroundImage!;
      final displaced = entry.renderingImage;
      entry.renderingImage = promoted;
      entry.renderingFrameIndex = index;
      entry.backgroundImage = null;
      entry.backgroundFrameIndex = -1;
      entry.desiredFrameIndex = index;
      entry.hasPlayedAdvance = true;
      cache._pingPongSwaps++;
      cache.hits++;

      if (displaced != null) {
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      if (!entry.poster && total > 1) {
        _ensurePrefetch(entry, (index + 1) % total);
      }
      return (promoted, entry, index);
    }

    // 3. Miss on exact index (seek, startup, or worker still in flight).
    cache.misses++;
    if (entry.renderingImage != null && entry.renderingFrameIndex != index) {
      entry.hasPlayedAdvance = true;
    }
    if (entry.backgroundImage != null && entry.backgroundFrameIndex != index) {
      final stale = entry.backgroundImage!;
      entry.backgroundImage = null;
      entry.backgroundFrameIndex = -1;
      final sBytes = stale.width * stale.height * 4;
      cache._bytes -= sBytes;
      cache._enqueueDisposal(stale, sBytes);
    }

    entry.desiredFrameIndex = index;
    if (cache._enabled && cache.lastError == null && !entry.retired) {
      _requestFrame(entry, index, highPriority: true);
    }

    // Once front buffer is valid, never block UI thread falling back to vectors.
    return (entry.renderingImage, entry, index);
  }

  void _ensurePrefetch(_RasterEntry entry, int nextIndex) {
    if (!cache._enabled ||
        cache.lastError != null ||
        entry.retired ||
        entry.users.isEmpty) {
      return;
    }
    if (entry.backgroundImage != null && entry.backgroundFrameIndex == nextIndex) {
      return;
    }
    if (entry.inFlightFrameIndex == nextIndex) return;
    _requestFrame(entry, nextIndex, highPriority: false);
  }

  void _requestFrame(
    _RasterEntry entry,
    int frameIndex, {
    required bool highPriority,
  }) {
    if (entry.inFlightFrameIndex == frameIndex) {
      entry.pendingFrameIndex = -1;
      return;
    }
    if (entry.inFlightFrameIndex >= 0) {
      // Latest desire wins without growing a request backlog.
      entry.pendingFrameIndex = frameIndex;
      if (highPriority) entry.queuedHighPriority = true;
      return;
    }
    if (_activeJobs >= cache.maximumInFlight) {
      entry.pendingFrameIndex = frameIndex;
      if (!entry.queuedForPingPong) {
        final totalQueued =
            _highPriorityQueue.length + _lowPriorityQueue.length;
        if (totalQueued >= cache.maximumPendingFrames) {
          // Prefer dropping a speculative lookahead prefetch before a cold/active entry.
          final victimQueue = _lowPriorityQueue.isNotEmpty
              ? _lowPriorityQueue
              : _highPriorityQueue;
          final oldest = victimQueue.first;
          victimQueue.remove(oldest);
          oldest.queuedForPingPong = false;
          oldest.queuedHighPriority = false;
          oldest.pendingFrameIndex = -1;
        }
        entry.queuedForPingPong = true;
        entry.queuedHighPriority = highPriority;
        (highPriority ? _highPriorityQueue : _lowPriorityQueue).add(entry);
      } else if (highPriority && !entry.queuedHighPriority) {
        // Promote a previously queued lookahead entry to the high-priority lane.
        _lowPriorityQueue.remove(entry);
        entry.queuedHighPriority = true;
        _highPriorityQueue.add(entry);
      }
      return;
    }
    _dispatchEntryFrame(entry, frameIndex);
  }

  void _dispatchEntryFrame(_RasterEntry entry, int frameIndex) {
    if (_disposed ||
        !cache._enabled ||
        cache.lastError != null ||
        entry.retired ||
        entry.users.isEmpty) {
      return;
    }
    final c = entry.composition;
    final pw = entry.key.$2.width.toInt();
    final ph = entry.key.$2.height.toInt();
    final sourceIndex = _sourceIndexForSample(entry, frameIndex);
    final sceneFrame = c.startFrame + sourceIndex;

    entry.inFlightFrameIndex = frameIndex;
    _activeJobs++;

    unawaited(
      workerPool
          .renderFrame(
            composition: c,
            entryKey: entry.entryKey,
            frame: sceneFrame,
            frameIndex: sourceIndex,
            width: pw,
            height: ph,
            totalFrames: entry.sourceFrames,
            poster: false,
          )
          .then<void>(
            (result) {
              if (_disposed ||
                  result == null ||
                  entry.retired ||
                  entry.users.isEmpty ||
                  cache.lastError != null) {
                _finishJob(entry, scheduleFollowup: false);
                return;
              }
              if (result.vectorRendered) cache._vectorRasterizedFrames++;
              if (result.compressedHit) cache._compressedCacheHits++;
              if (result.entryDiskBytes > 0) {
                _activeDiskKeys.clear();
                for (final e in cache._entries.values) {
                  if (e.users.isNotEmpty) {
                    _activeDiskKeys.add(e.entryKey);
                  }
                }
                workerPool.enforceDiskBudget(_activeDiskKeys);
              }

              // Skip expensive GPU upload if a front buffer already exists and
              // caller moved past this frame (unless it matches next lookahead).
              final total = entry.totalFrames;
              final expectedLookahead = entry.renderingImage != null &&
                      !entry.poster &&
                      total > 1
                  ? (entry.renderingFrameIndex + 1) % total
                  : -1;
              final wantedNow = frameIndex == entry.desiredFrameIndex;
              final queuedOverride = entry.pendingFrameIndex >= 0 &&
                  entry.pendingFrameIndex != frameIndex &&
                  frameIndex != expectedLookahead;
              if (entry.renderingImage != null && queuedOverride && !wantedNow) {
                _finishJob(entry, scheduleFollowup: true);
                return;
              }

              try {
                ui.decodeImageFromPixels(
                  result.bgraBytes,
                  pw,
                  ph,
                  ui.PixelFormat.bgra8888,
                  (image) => _onImageDecoded(entry, frameIndex, image),
                );
              } catch (error) {
                _finishJob(entry, scheduleFollowup: false);
                cache._failed(error);
              }
            },
            onError: (Object error, StackTrace _) {
              _finishJob(entry, scheduleFollowup: false);
              if (!_disposed && cache.lastError == null) {
                cache._failed(error);
              }
            },
          ),
    );
  }

  void _onImageDecoded(_RasterEntry entry, int frameIndex, ui.Image image) {
    if (_disposed ||
        entry.retired ||
        entry.users.isEmpty ||
        cache.lastError != null) {
      image.dispose();
      _finishJob(entry, scheduleFollowup: false);
      return;
    }

    final imgBytes = image.width * image.height * 4;
    final total = entry.totalFrames;
    final wantedNow = frameIndex == entry.desiredFrameIndex;
    final isEmptyFront = entry.renderingImage == null;
    final isLookahead = !entry.poster &&
        total > 1 &&
        entry.renderingImage != null &&
        frameIndex == (entry.renderingFrameIndex + 1) % total &&
        !wantedNow;

    if (isEmptyFront || wantedNow) {
      final displaced = entry.renderingImage;
      entry.renderingImage = image;
      entry.renderingFrameIndex = frameIndex;
      cache._bytes += imgBytes;
      cache.renderedFrames++;
      if (displaced != null) {
        cache._pingPongSwaps++;
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      _notifyUsers(entry);

      if (!entry.poster &&
          total > 1 &&
          entry.hasPlayedAdvance &&
          entry.pendingFrameIndex < 0 &&
          (entry.backgroundImage == null ||
              entry.backgroundFrameIndex != (frameIndex + 1) % total)) {
        entry.pendingFrameIndex = (frameIndex + 1) % total;
      }
    } else if (isLookahead) {
      final oldBack = entry.backgroundImage;
      entry.backgroundImage = image;
      entry.backgroundFrameIndex = frameIndex;
      cache._bytes += imgBytes;
      cache.renderedFrames++;
      if (oldBack != null) {
        final oBytes = oldBack.width * oldBack.height * 4;
        cache._bytes -= oBytes;
        cache._enqueueDisposal(oldBack, oBytes);
      }
    } else if (entry.pendingFrameIndex < 0 ||
        entry.pendingFrameIndex == frameIndex) {
      final displaced = entry.renderingImage;
      entry.renderingImage = image;
      entry.renderingFrameIndex = frameIndex;
      cache._bytes += imgBytes;
      cache.renderedFrames++;
      if (displaced != null) {
        cache._pingPongSwaps++;
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      _notifyUsers(entry);
    } else {
      image.dispose();
    }

    _finishJob(entry, scheduleFollowup: true);
  }

  void _finishJob(_RasterEntry entry, {required bool scheduleFollowup}) {
    if (_activeJobs > 0) _activeJobs--;
    entry.inFlightFrameIndex = -1;
    final nextPending = entry.pendingFrameIndex;
    final wasHigh = entry.queuedHighPriority;
    entry.pendingFrameIndex = -1;
    entry.queuedHighPriority = false;

    if (scheduleFollowup &&
        !_disposed &&
        cache._enabled &&
        cache.lastError == null &&
        !entry.retired &&
        entry.users.isNotEmpty &&
        nextPending >= 0 &&
        nextPending != entry.renderingFrameIndex &&
        !(entry.backgroundImage != null &&
            entry.backgroundFrameIndex == nextPending)) {
      _requestFrame(
        entry,
        nextPending,
        highPriority:
            wasHigh ||
            entry.renderingImage == null ||
            nextPending == entry.desiredFrameIndex,
      );
    }
    _pumpPending();
  }

  void _pumpPending() {
    if (_disposed ||
        !cache._enabled ||
        cache.lastError != null ||
        (_highPriorityQueue.isEmpty && _lowPriorityQueue.isEmpty) ||
        _activeJobs >= cache.maximumInFlight) {
      return;
    }
    if (_pumpScheduled) return;
    _pumpScheduled = true;
    scheduleMicrotask(() {
      _pumpScheduled = false;
      if (_disposed || !cache._enabled || cache.lastError != null) return;
      while ((_highPriorityQueue.isNotEmpty || _lowPriorityQueue.isNotEmpty) &&
          _activeJobs < cache.maximumInFlight) {
        final queue = _highPriorityQueue.isNotEmpty
            ? _highPriorityQueue
            : _lowPriorityQueue;
        final entry = queue.first;
        queue.remove(entry);
        entry.queuedForPingPong = false;
        entry.queuedHighPriority = false;
        if (entry.retired || entry.users.isEmpty) continue;
        final idx = entry.pendingFrameIndex >= 0
            ? entry.pendingFrameIndex
            : entry.desiredFrameIndex;
        entry.pendingFrameIndex = -1;
        if (idx < 0 ||
            idx == entry.renderingFrameIndex ||
            (entry.backgroundImage != null &&
                entry.backgroundFrameIndex == idx)) {
          continue;
        }
        _dispatchEntryFrame(entry, idx);
      }
    });
  }

  void _notifyUsers(_RasterEntry entry) {
    if (entry.users.length == 1) {
      entry.users.first._rasterReady();
    } else {
      for (final user in entry.users.toList(growable: false)) {
        user._rasterReady();
      }
    }
  }

  int _sourceIndexForSample(_RasterEntry entry, int index) {
    final c = entry.composition;
    if (entry.poster || c.isStatic || entry.sourceFrames <= 1) return 0;
    return math
        .min(
          index * entry.frameStep,
          math.max(0.0, entry.sourceFrames - 1.0),
        )
        .floor()
        .clamp(0, entry.sourceFrames - 1);
  }

  void clear({bool clearWorkerMemory = false}) {
    clearPending();
    if (clearWorkerMemory) {
      workerPool.clearMemoryCaches();
    }
  }

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    clearPending();
    workerPool.dispose();
  }
}
