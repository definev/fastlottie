part of '../fastlottie.dart';

/// Coordinates Telegram-style Double-Buffered Ping-Pong GPU textures (`ui.Image`),
/// persistent worker Isolate decoding, LZ4 disk/RAM caching, and UI repaint hints.
final class _PingPongCoordinator implements _RasterWorkerListener {
  _PingPongCoordinator(
    this.cache, {
    String? diskCacheDirectory,
    int? workerCount,
  }) {
    workerPool = _RasterWorkerPool(
      listener: this,
      workerCount: defaultWorkerCount(workerCount),
      maximumCompressedMemoryBytes: cache.maximumCompressedMemoryBytes,
      maximumDiskBytes: cache.maximumDiskBytes,
      diskCacheDirectory: diskCacheDirectory,
    );
  }

  final FastLottieRasterCache cache;
  late final _RasterWorkerPool workerPool;

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
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
    }
    for (final entry in _lowPriorityQueue) {
      entry.queuedForPingPong = false;
      entry.queuedHighPriority = false;
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
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
    entry.pendingStripStart = -1;
    entry.pendingStripCount = 0;
  }

  void onEntryDemoted(_RasterEntry entry) {
    if (entry.pendingStripStart >= 0) {
      if (entry.desiredFrameIndex >= 0 &&
          (entry.queuedHighPriority || entry.renderingImage == null)) {
        final start = _stripStartFor(entry, entry.desiredFrameIndex);
        entry.pendingStripStart = start;
        entry.pendingStripCount = _stripCountFor(entry, start, entry.totalFrames);
        if (entry.queuedForPingPong && !entry.queuedHighPriority) {
          _lowPriorityQueue.remove(entry);
          entry.queuedHighPriority = true;
          _highPriorityQueue.add(entry);
        }
      } else {
        final start = _stripStartFor(entry, entry.pendingStripStart);
        entry.pendingStripStart = start;
        entry.pendingStripCount = _stripCountFor(entry, start, entry.totalFrames);
      }
    }
    if (entry.renderingImage == null &&
        entry.inFlightStripStart < 0 &&
        !entry.queuedForPingPong &&
        entry.desiredFrameIndex >= 0 &&
        cache._enabled &&
        cache.lastError == null &&
        !entry.retired &&
        entry.users.isNotEmpty) {
      final start = _stripStartFor(entry, entry.desiredFrameIndex);
      final count = _stripCountFor(entry, start, entry.totalFrames);
      _requestStrip(entry, start, count, highPriority: true);
    }
  }

  static bool _stripContains(int stripStart, int stripCount, int frameIndex) =>
      stripCount > 0 &&
      frameIndex >= stripStart &&
      frameIndex < stripStart + stripCount;

  int _stripStartFor(_RasterEntry entry, int frameIndex) {
    if (entry.stripFrames <= 1 || entry.poster || entry.totalFrames <= 1) {
      return frameIndex;
    }
    return (frameIndex ~/ entry.stripFrames) * entry.stripFrames;
  }

  int _stripCountFor(_RasterEntry entry, int stripStart, int total) {
    if (entry.stripFrames <= 1 || entry.poster || total <= 1) {
      return 1;
    }
    return math.min(entry.stripFrames, total - stripStart);
  }

  int _nextStripStart(
    _RasterEntry entry,
    int currentStart,
    int currentCount,
    int total,
  ) {
    if (entry.stripFrames <= 1 || entry.poster || total <= 1) {
      return (currentStart + 1) % total;
    }
    return (currentStart + currentCount) % total;
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
        return (null, null, 0);
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
      return (null, null, 0);
    }

    final total = entry.totalFrames;
    final index = c.isStatic || entry.poster || total <= 1
        ? 0
        : (relative / entry.frameStep + 1e-7).floor().clamp(0, total - 1);

    workerPool.touchDiskEntry(entry.entryKey);

    int offsetYForSlot(int slot) => entry!.stripFrames <= 1 ? 0 : slot * (ph + 1);

    // 1. Exact front-buffer hit.
    if (entry.renderingImage != null &&
        _stripContains(entry.renderingStripStart, entry.renderingStripCount, index)) {
      if (entry.desiredFrameIndex >= 0 && index != entry.desiredFrameIndex) {
        entry.hasPlayedAdvance = true;
      }
      entry.desiredFrameIndex = index;
      final slot = index - entry.renderingStripStart;
      entry.lastRenderingSlot = slot;
      cache.hits++;
      if (!entry.poster &&
          total > entry.renderingStripCount &&
          entry.hasPlayedAdvance) {
        final nextStart = _nextStripStart(
          entry,
          entry.renderingStripStart,
          entry.renderingStripCount,
          total,
        );
        _ensurePrefetch(entry, nextStart);
      }
      return (entry.renderingImage, entry, offsetYForSlot(slot));
    }

    // 2. O(1) Back-buffer pointer swap when lookahead strip matches.
    if (entry.backgroundImage != null &&
        _stripContains(entry.backgroundStripStart, entry.backgroundStripCount, index)) {
      final promoted = entry.backgroundImage!;
      final displaced = entry.renderingImage;
      entry.renderingImage = promoted;
      entry.renderingStripStart = entry.backgroundStripStart;
      entry.renderingStripCount = entry.backgroundStripCount;
      entry.backgroundImage = null;
      entry.backgroundStripStart = -1;
      entry.backgroundStripCount = 0;
      entry.desiredFrameIndex = index;
      final slot = index - entry.renderingStripStart;
      entry.lastRenderingSlot = slot;
      entry.hasPlayedAdvance = true;
      cache._pingPongSwaps++;
      cache.hits++;

      if (displaced != null) {
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      if (!entry.poster && total > entry.renderingStripCount) {
        final nextStart = _nextStripStart(
          entry,
          entry.renderingStripStart,
          entry.renderingStripCount,
          total,
        );
        _ensurePrefetch(entry, nextStart);
      }
      return (promoted, entry, offsetYForSlot(slot));
    }

    // 3. Miss on exact index (seek, startup, or worker still in flight).
    cache.misses++;
    if (entry.renderingImage != null &&
        !_stripContains(entry.renderingStripStart, entry.renderingStripCount, index)) {
      entry.hasPlayedAdvance = true;
    }
    if (entry.backgroundImage != null &&
        !_stripContains(entry.backgroundStripStart, entry.backgroundStripCount, index)) {
      final stale = entry.backgroundImage!;
      entry.backgroundImage = null;
      entry.backgroundStripStart = -1;
      entry.backgroundStripCount = 0;
      final sBytes = stale.width * stale.height * 4;
      cache._bytes -= sBytes;
      cache._enqueueDisposal(stale, sBytes);
    }

    entry.desiredFrameIndex = index;
    if (cache._enabled && cache.lastError == null && !entry.retired) {
      final stripStart = _stripStartFor(entry, index);
      final stripCount = _stripCountFor(entry, stripStart, total);
      _requestStrip(entry, stripStart, stripCount, highPriority: true);
    }

    // Once front buffer is valid, never block UI thread falling back to vectors.
    final fallbackSlot = entry.renderingImage != null && entry.renderingStripCount > 0
        ? entry.lastRenderingSlot.clamp(0, entry.renderingStripCount - 1)
        : 0;
    return (entry.renderingImage, entry, offsetYForSlot(fallbackSlot));
  }

  void _ensurePrefetch(_RasterEntry entry, int nextStart) {
    if (!cache._enabled ||
        cache.lastError != null ||
        entry.retired ||
        entry.users.isEmpty) {
      return;
    }
    if (entry.backgroundImage != null &&
        _stripContains(entry.backgroundStripStart, entry.backgroundStripCount, nextStart)) {
      return;
    }
    if (entry.inFlightStripStart == nextStart) return;
    final nextCount = _stripCountFor(entry, nextStart, entry.totalFrames);
    _requestStrip(entry, nextStart, nextCount, highPriority: false);
  }

  void _requestStrip(
    _RasterEntry entry,
    int stripStart,
    int stripCount, {
    required bool highPriority,
  }) {
    if (entry.inFlightStripStart == stripStart) {
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
      return;
    }
    if (entry.inFlightStripStart >= 0) {
      // Latest desire wins without growing a request backlog.
      entry.pendingStripStart = stripStart;
      entry.pendingStripCount = stripCount;
      if (highPriority) entry.queuedHighPriority = true;
      return;
    }
    if (_activeJobs >= cache.maximumInFlight) {
      entry.pendingStripStart = stripStart;
      entry.pendingStripCount = stripCount;
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
          oldest.pendingStripStart = -1;
          oldest.pendingStripCount = 0;
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
    _dispatchEntryStrip(entry, stripStart, stripCount);
  }

  void _dispatchEntryStrip(_RasterEntry entry, int stripStart, int stripCount) {
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
    final effectiveStep =
        entry.poster || c.isStatic || entry.sourceFrames <= 1
            ? 0.0
            : entry.frameStep;

    entry.inFlightStripStart = stripStart;
    entry.inFlightStripCount = stripCount;
    final dispatchedGen = entry.stripGeneration;
    _activeJobs++;

    workerPool.dispatchStrip(
      entry: entry,
      dispatchedGen: dispatchedGen,
      composition: c,
      entryKey: entry.entryKey,
      stripStart: stripStart,
      stripCount: stripCount,
      startFrame: c.startFrame,
      frameStep: effectiveStep,
      width: pw,
      height: ph,
      totalFrames: entry.sourceFrames,
      poster: false,
    );
  }

  @override
  void onStripReady(
    _RasterEntry entry,
    int dispatchedGen, {
    required String entryKey,
    required int stripStart,
    required int stripCount,
    required int stripWidth,
    required int stripHeight,
    required Uint8List bgraBytes,
    required bool vectorRendered,
    required int vectorCount,
    required bool compressedHit,
    required int compressedCount,
    required int entryDiskBytes,
  }) {
    if (_disposed ||
        entry.retired ||
        entry.users.isEmpty ||
        cache.lastError != null) {
      _finishJob(entry, scheduleFollowup: false);
      return;
    }
    if (vectorRendered) {
      cache._vectorRasterizedFrames += vectorCount;
    }
    if (compressedHit) {
      cache._compressedCacheHits += compressedCount;
    }
    if (entryDiskBytes > 0 && workerPool.needsDiskBudgetEnforcement) {
      _activeDiskKeys.clear();
      for (final e in cache._entries.values) {
        if (e.users.isNotEmpty) {
          _activeDiskKeys.add(e.entryKey);
        }
      }
      workerPool.enforceDiskBudget(_activeDiskKeys);
    }

    // If the entry was demoted to a smaller strip size while in flight,
    // skip GPU upload of the oversized texture (worker LZ4/disk cache
    // already recorded the rendered frames) and schedule the new strip.
    if (dispatchedGen != entry.stripGeneration) {
      if (entry.pendingStripStart < 0 && entry.desiredFrameIndex >= 0) {
        final desired = entry.desiredFrameIndex;
        if (entry.renderingImage == null ||
            !_stripContains(
              entry.renderingStripStart,
              entry.renderingStripCount,
              desired,
            )) {
          final start = _stripStartFor(entry, desired);
          entry.pendingStripStart = start;
          entry.pendingStripCount =
              _stripCountFor(entry, start, entry.totalFrames);
          entry.queuedHighPriority = true;
        }
      }
      _finishJob(entry, scheduleFollowup: true);
      return;
    }

    // Skip expensive GPU upload if a front buffer already exists and
    // caller moved past this strip (unless it matches next lookahead).
    final total = entry.totalFrames;
    final expectedLookahead = entry.renderingImage != null &&
            !entry.poster &&
            total > entry.renderingStripCount
        ? _nextStripStart(
            entry,
            entry.renderingStripStart,
            entry.renderingStripCount,
            total,
          )
        : -1;
    final wantedNow = _stripContains(
      stripStart,
      stripCount,
      entry.desiredFrameIndex,
    );
    final queuedOverride = entry.pendingStripStart >= 0 &&
        entry.pendingStripStart != stripStart &&
        stripStart != expectedLookahead;
    if (entry.renderingImage != null && queuedOverride && !wantedNow) {
      _finishJob(entry, scheduleFollowup: true);
      return;
    }

    try {
      ui.decodeImageFromPixels(
        bgraBytes,
        stripWidth,
        stripHeight,
        ui.PixelFormat.bgra8888,
        (image) => _onImageDecoded(
          entry,
          stripStart,
          stripCount,
          dispatchedGen,
          image,
        ),
      );
    } catch (error) {
      _finishJob(entry, scheduleFollowup: false);
      cache._failed(error);
    }
  }

  @override
  void onStripError(_RasterEntry entry, Object error) {
    _finishJob(entry, scheduleFollowup: false);
    if (!_disposed && cache.lastError == null) {
      cache._failed(error);
    }
  }

  void _onImageDecoded(
    _RasterEntry entry,
    int stripStart,
    int stripCount,
    int dispatchedGen,
    ui.Image image,
  ) {
    if (_disposed ||
        entry.retired ||
        entry.users.isEmpty ||
        cache.lastError != null ||
        dispatchedGen != entry.stripGeneration) {
      image.dispose();
      final active = !_disposed &&
          !entry.retired &&
          entry.users.isNotEmpty &&
          cache.lastError == null;
      if (active &&
          dispatchedGen != entry.stripGeneration &&
          entry.pendingStripStart < 0 &&
          entry.desiredFrameIndex >= 0 &&
          (entry.renderingImage == null ||
              !_stripContains(
                entry.renderingStripStart,
                entry.renderingStripCount,
                entry.desiredFrameIndex,
              ))) {
        final start = _stripStartFor(entry, entry.desiredFrameIndex);
        entry.pendingStripStart = start;
        entry.pendingStripCount = _stripCountFor(entry, start, entry.totalFrames);
        entry.queuedHighPriority = true;
      }
      _finishJob(entry, scheduleFollowup: active);
      return;
    }

    final imgBytes = image.width * image.height * 4;
    final total = entry.totalFrames;
    final wantedNow = _stripContains(
      stripStart,
      stripCount,
      entry.desiredFrameIndex,
    );
    final isEmptyFront = entry.renderingImage == null;
    final expectedNext = entry.renderingImage != null &&
            !entry.poster &&
            total > entry.renderingStripCount
        ? _nextStripStart(
            entry,
            entry.renderingStripStart,
            entry.renderingStripCount,
            total,
          )
        : -1;
    final isLookahead = !entry.poster &&
        total > 1 &&
        entry.renderingImage != null &&
        stripStart == expectedNext &&
        !wantedNow;

    if (isEmptyFront || wantedNow) {
      final displaced = entry.renderingImage;
      entry.renderingImage = image;
      entry.renderingStripStart = stripStart;
      entry.renderingStripCount = stripCount;
      if (wantedNow) {
        entry.lastRenderingSlot =
            (entry.desiredFrameIndex - stripStart).clamp(0, stripCount - 1);
      } else {
        entry.lastRenderingSlot = 0;
      }
      cache._bytes += imgBytes;
      cache.renderedFrames += stripCount;
      if (displaced != null) {
        cache._pingPongSwaps++;
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      _notifyUsers(entry);

      if (!entry.poster &&
          total > entry.renderingStripCount &&
          entry.hasPlayedAdvance &&
          entry.pendingStripStart < 0) {
        final nextStart = _nextStripStart(entry, stripStart, stripCount, total);
        if (entry.backgroundImage == null ||
            !_stripContains(
              entry.backgroundStripStart,
              entry.backgroundStripCount,
              nextStart,
            )) {
          entry.pendingStripStart = nextStart;
          entry.pendingStripCount = _stripCountFor(entry, nextStart, total);
        }
      }
    } else if (isLookahead) {
      final oldBack = entry.backgroundImage;
      entry.backgroundImage = image;
      entry.backgroundStripStart = stripStart;
      entry.backgroundStripCount = stripCount;
      cache._bytes += imgBytes;
      cache.renderedFrames += stripCount;
      if (oldBack != null) {
        final oBytes = oldBack.width * oldBack.height * 4;
        cache._bytes -= oBytes;
        cache._enqueueDisposal(oldBack, oBytes);
      }
    } else if (entry.pendingStripStart < 0 ||
        entry.pendingStripStart == stripStart) {
      final displaced = entry.renderingImage;
      entry.renderingImage = image;
      entry.renderingStripStart = stripStart;
      entry.renderingStripCount = stripCount;
      entry.lastRenderingSlot = 0;
      cache._bytes += imgBytes;
      cache.renderedFrames += stripCount;
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
    entry.inFlightStripStart = -1;
    entry.inFlightStripCount = 0;
    final nextPending = entry.pendingStripStart;
    final nextPendingCount = entry.pendingStripCount;
    final wasHigh = entry.queuedHighPriority;
    entry.pendingStripStart = -1;
    entry.pendingStripCount = 0;
    entry.queuedHighPriority = false;

    if (scheduleFollowup &&
        !_disposed &&
        cache._enabled &&
        cache.lastError == null &&
        !entry.retired &&
        entry.users.isNotEmpty &&
        nextPending >= 0 &&
        !_stripContains(
          entry.renderingStripStart,
          entry.renderingStripCount,
          nextPending,
        ) &&
        !(entry.backgroundImage != null &&
            _stripContains(
              entry.backgroundStripStart,
              entry.backgroundStripCount,
              nextPending,
            ))) {
      final resolvedCount = nextPendingCount > 0
          ? nextPendingCount
          : _stripCountFor(entry, nextPending, entry.totalFrames);
      _requestStrip(
        entry,
        nextPending,
        resolvedCount,
        highPriority:
            wasHigh ||
            entry.renderingImage == null ||
            _stripContains(nextPending, resolvedCount, entry.desiredFrameIndex),
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
        final idx = entry.pendingStripStart >= 0
            ? entry.pendingStripStart
            : _stripStartFor(entry, entry.desiredFrameIndex);
        final count = entry.pendingStripCount > 0
            ? entry.pendingStripCount
            : _stripCountFor(entry, idx, entry.totalFrames);
        entry.pendingStripStart = -1;
        entry.pendingStripCount = 0;
        if (idx < 0 ||
            _stripContains(
              entry.renderingStripStart,
              entry.renderingStripCount,
              idx,
            ) ||
            (entry.backgroundImage != null &&
                _stripContains(
                  entry.backgroundStripStart,
                  entry.backgroundStripCount,
                  idx,
                ))) {
          continue;
        }
        _dispatchEntryStrip(entry, idx, count);
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
