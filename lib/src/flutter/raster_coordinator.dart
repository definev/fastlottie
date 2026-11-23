part of 'player.dart';

/// Coordinates double-buffered textures, raster workers, and repaint hints.
final class _RasterCoordinator implements RasterWorkerListener<_RasterEntry> {
  _RasterCoordinator(
    this.cache, {
    String? diskCacheDirectory,
    int? workerCount,
  }) {
    workerPool = RasterWorkerPool<_RasterEntry>(
      listener: this,
      workerCount: workerCount,
      maximumCompressedMemoryBytes: cache.maximumCompressedMemoryBytes,
      maximumDiskBytes: cache.maximumDiskBytes,
      diskCacheDirectory: diskCacheDirectory,
    );
  }

  final FastLottieRasterCache cache;
  late final RasterWorkerPool<_RasterEntry> workerPool;

  final _highPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _lowPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _activeDiskKeys = <String>{};
  final _activeWorkerShards = <int, int>{};
  final _awaitingImages = <_RasterEntry>{};
  // A non-owning image reference: reuse only while it is still a front/back
  // buffer. Independent clone handles let the normal disposal path stay intact.
  final _duplicateFrames = <_RasterEntry, (int, ui.Image)>{};
  final _decodeStarts = <_RasterEntry, int>{};
  final _telemetryClock = Stopwatch()..start();
  int duplicateFrameBytes = 0;
  int skippedImageUploads = 0;

  void _forgetDuplicate(_RasterEntry entry) {
    final previous = _duplicateFrames.remove(entry);
    if (previous != null) {
      final img = previous.$2;
      duplicateFrameBytes -= img.width * img.height * 4;
    }
  }

  void _rememberDuplicate(_RasterEntry entry, int crc, ui.Image image) {
    _forgetDuplicate(entry);
    if (crc == 0 || cache.maximumDuplicateFrameBytes <= 0) return;
    final imgBytes = image.width * image.height * 4;
    if (imgBytes > cache.maximumDuplicateFrameBytes) return;
    while (_duplicateFrames.isNotEmpty &&
        duplicateFrameBytes + imgBytes > cache.maximumDuplicateFrameBytes) {
      _forgetDuplicate(_duplicateFrames.keys.first);
    }
    _duplicateFrames[entry] = (crc, image);
    duplicateFrameBytes += imgBytes;
  }

  int _activeJobs = 0;
  bool _disposed = false;
  bool _pumpScheduled = false;

  // Cap the total of worker jobs and images being decoded. Browser uploads
  // also have a limit relative to the number of live workers.
  int get _maximumInFlight => kIsWeb
      ? math.min(
          cache.maximumInFlight,
          math.max(1, workerPool.browserWorkers * 2),
        )
      : cache.maximumInFlight;

  int _workerShard(_RasterEntry entry) =>
      entry.workerShard ??= workerPool.shardForKey(entry.entryKey);

  bool _canDispatch(_RasterEntry entry) {
    if (_activeJobs >= _maximumInFlight) return false;
    final shard = _workerShard(entry);
    // Keep first-image work cancelable during viewport churn. Once an entry
    // has an image, native workers retain their playback lookahead throughput.
    if ((kIsWeb || entry.renderingImage == null) &&
        (_activeWorkerShards[shard] ?? 0) > 0) {
      return false;
    }
    if (!kIsWeb) return true;
    // Multiple browser workers can fail asynchronously. Keep new inline
    // work on a single slot even when more than one shard fell back.
    return !workerPool.isInlineShard(shard) ||
        !_activeWorkerShards.keys.any(workerPool.isInlineShard);
  }

  int get activeJobCount => _activeJobs;
  int get pendingCount =>
      _activeJobs + _highPriorityQueue.length + _lowPriorityQueue.length;

  void clearPending() {
    for (final entry in _highPriorityQueue) {
      entry.queuedForRaster = false;
      entry.queuedHighPriority = false;
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
    }
    for (final entry in _lowPriorityQueue) {
      entry.queuedForRaster = false;
      entry.queuedHighPriority = false;
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
    }
    _highPriorityQueue.clear();
    _lowPriorityQueue.clear();
  }

  void onEntryReleased(_RasterEntry entry) {
    _forgetDuplicate(entry);
    if (entry.queuedForRaster) {
      _highPriorityQueue.remove(entry);
      _lowPriorityQueue.remove(entry);
      entry.queuedForRaster = false;
    }
    entry.queuedHighPriority = false;
    entry.pendingStripStart = -1;
    entry.pendingStripCount = 0;
  }

  void onEntryDemoted(_RasterEntry entry) {
    _forgetDuplicate(entry);
    if (entry.pendingStripStart >= 0) {
      if (entry.desiredFrameIndex >= 0 &&
          (entry.queuedHighPriority || entry.renderingImage == null)) {
        final start = _stripStartFor(entry, entry.desiredFrameIndex);
        entry.pendingStripStart = start;
        entry.pendingStripCount = _stripCountFor(
          entry,
          start,
          entry.totalFrames,
        );
        if (entry.queuedForRaster && !entry.queuedHighPriority) {
          _lowPriorityQueue.remove(entry);
          entry.queuedHighPriority = true;
          _highPriorityQueue.add(entry);
        }
      } else {
        final start = _stripStartFor(entry, entry.pendingStripStart);
        entry.pendingStripStart = start;
        entry.pendingStripCount = _stripCountFor(
          entry,
          start,
          entry.totalFrames,
        );
      }
    }
    if (entry.renderingImage == null &&
        entry.inFlightStripStart < 0 &&
        !entry.queuedForRaster &&
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

  bool _needsFirstFrame(_RasterEntry entry) =>
      cache.progressiveFirstFrame &&
      entry.renderingImage == null &&
      entry.framesPerStrip > 1 &&
      entry.totalFrames > entry.framesPerStrip;

  // A bootstrap frame can overlap a requested strip without satisfying it.
  static bool _coversStrip(int start, int count, int wanted, int wantedCount) =>
      count > 0 && wanted >= start && wanted + wantedCount <= start + count;

  int _stripStartFor(_RasterEntry entry, int frameIndex) {
    if (_needsFirstFrame(entry)) return frameIndex;
    if (entry.framesPerStrip <= 1 || entry.poster || entry.totalFrames <= 1) {
      return frameIndex;
    }
    return (frameIndex ~/ entry.framesPerStrip) * entry.framesPerStrip;
  }

  int _stripCountFor(_RasterEntry entry, int stripStart, int total) {
    if (_needsFirstFrame(entry)) return 1;
    if (entry.framesPerStrip <= 1 || entry.poster || total <= 1) {
      return 1;
    }
    return math.min(entry.framesPerStrip, total - stripStart);
  }

  int _nextStripStart(
    _RasterEntry entry,
    int currentStart,
    int currentCount,
    int total,
  ) {
    if (entry.framesPerStrip <= 1 || entry.poster || total <= 1) {
      return (currentStart + 1) % total;
    }
    final next = (currentStart + currentCount) % total;
    // A bootstrap may start anywhere inside the regular strip grid.
    return _stripStartFor(entry, next);
  }

  void prewarm(FastLottiePlayer player, Size rawPixels) {
    if (!cache._enabled || cache.lastError != null || player.isDisposed) return;
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
        return;
      }
      cache._release(player);
      entry = cache._acquire(player, keySize);
      player._rasterEntry = entry;
      if (entry == null) {
        player._rasterRejectedKey = (keySize, rateKey);
        player._rasterRejectedGeneration = cache._admissionGeneration;
        return;
      } else {
        player._rasterRejectedKey = null;
      }
    }
    if (entry.renderingImage != null || entry.retired) return;
    workerPool.touchDiskEntry(entry.entryKey);
    if (entry.inFlightStripStart < 0) {
      final total = entry.totalFrames;
      final stripStart = _stripStartFor(entry, 0);
      final stripCount = _stripCountFor(entry, stripStart, total);
      _requestStrip(entry, stripStart, stripCount, highPriority: false);
    }
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

    int offsetYForSlot(int slot) =>
        entry!.framesPerStrip <= 1 ? 0 : slot * (ph + 1);

    // 1. Exact front-buffer hit.
    if (entry.renderingImage != null &&
        _stripContains(
          entry.renderingStripStart,
          entry.renderingStripCount,
          index,
        )) {
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
        _stripContains(
          entry.backgroundStripStart,
          entry.backgroundStripCount,
          index,
        )) {
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
      cache._bufferSwaps++;
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
        !_stripContains(
          entry.renderingStripStart,
          entry.renderingStripCount,
          index,
        )) {
      entry.hasPlayedAdvance = true;
    }
    if (entry.backgroundImage != null &&
        !_stripContains(
          entry.backgroundStripStart,
          entry.backgroundStripCount,
          index,
        )) {
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

    if (cache.allowUiVectorFallback) {
      return (null, null, 0);
    }

    // Once front buffer is valid and vector fallback is disabled, avoid blocking UI thread.
    final fallbackSlot =
        entry.renderingImage != null && entry.renderingStripCount > 0
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
        _stripContains(
          entry.backgroundStripStart,
          entry.backgroundStripCount,
          nextStart,
        )) {
      return;
    }
    if (entry.inFlightStripStart == nextStart &&
        entry.inFlightStripCount >=
            _stripCountFor(entry, nextStart, entry.totalFrames)) {
      return;
    }
    final nextCount = _stripCountFor(entry, nextStart, entry.totalFrames);
    _requestStrip(entry, nextStart, nextCount, highPriority: false);
  }

  void _requestStrip(
    _RasterEntry entry,
    int stripStart,
    int stripCount, {
    required bool highPriority,
  }) {
    if (entry.inFlightStripStart == stripStart &&
        entry.inFlightStripCount >= stripCount) {
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
      entry.queuedHighPriority = false;
      return;
    }
    if (entry.inFlightStripStart >= 0) {
      // Latest desire wins without growing a request backlog.
      entry.pendingStripStart = stripStart;
      entry.pendingStripCount = stripCount;
      entry.queuedHighPriority = highPriority;
      return;
    }
    final canDispatch = _canDispatch(entry);
    if (!canDispatch ||
        entry.queuedForRaster ||
        _highPriorityQueue.isNotEmpty ||
        (!highPriority && _lowPriorityQueue.isNotEmpty)) {
      if (!entry.queuedForRaster) {
        final totalQueued =
            _highPriorityQueue.length + _lowPriorityQueue.length;
        if (totalQueued >= cache.maximumPendingFrames) {
          // A speculative strip must not displace a frame needed now.
          if (!highPriority && _lowPriorityQueue.isEmpty) return;
          final victimQueue = _lowPriorityQueue.isNotEmpty
              ? _lowPriorityQueue
              : _highPriorityQueue;
          onEntryReleased(victimQueue.first);
        }
        entry.queuedForRaster = true;
        entry.queuedHighPriority = highPriority;
        (highPriority ? _highPriorityQueue : _lowPriorityQueue).add(entry);
      } else if (highPriority && !entry.queuedHighPriority) {
        // Promote a previously queued lookahead entry to the high-priority lane.
        _lowPriorityQueue.remove(entry);
        entry.queuedHighPriority = true;
        _highPriorityQueue.add(entry);
      } else if (!highPriority && entry.queuedHighPriority) {
        // A seek back to the front buffer can replace an urgent miss with
        // lookahead. The replacement should not inherit the old priority.
        _highPriorityQueue.remove(entry);
        entry.queuedHighPriority = false;
        _lowPriorityQueue.add(entry);
      }
      entry.pendingStripStart = stripStart;
      entry.pendingStripCount = stripCount;
      if (canDispatch) _pumpPending();
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
    // Unpinned texture entries do not keep a compiled composition alive.
    final c = entry.users.first.composition;
    final pw = entry.key.$2.width.toInt();
    final ph = entry.key.$2.height.toInt();
    final effectiveStep = entry.poster || c.isStatic || entry.sourceFrames <= 1
        ? 0.0
        : entry.frameStep;

    entry.inFlightStripStart = stripStart;
    entry.inFlightStripCount = stripCount;
    final dispatchedGen = entry.stripGeneration;
    final shard = _workerShard(entry);
    _activeWorkerShards[shard] = (_activeWorkerShards[shard] ?? 0) + 1;
    _activeJobs++;

    workerPool.dispatchStrip(
      context: entry,
      shard: shard,
      dispatchedGen: dispatchedGen,
      scene: c.sceneTemplate,
      sourceBytes: c.workerSource,
      contentKey: c.contentKey,
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
    required int renderMicros,
    required int kernelCalls,
    required int geometryCopyBytes,
    required int transferBytes,
    int? frameCrc,
  }) {
    cache
      .._workerRenderMicros += renderMicros
      .._nativeKernelCalls += kernelCalls
      .._geometryCopyBytes += geometryCopyBytes
      .._isolateTransferBytes += transferBytes;
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
          entry.pendingStripCount = _stripCountFor(
            entry,
            start,
            entry.totalFrames,
          );
          entry.queuedHighPriority = true;
        }
      }
      _finishJob(entry, scheduleFollowup: true);
      return;
    }

    // Skip expensive GPU upload if a front buffer already exists and
    // caller moved past this strip (unless it matches next lookahead).
    final total = entry.totalFrames;
    final expectedLookahead =
        entry.renderingImage != null &&
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
    final queuedOverride =
        entry.pendingStripStart >= 0 &&
        entry.pendingStripStart != stripStart &&
        stripStart != expectedLookahead;
    if (entry.renderingImage != null && queuedOverride && !wantedNow) {
      _finishJob(entry, scheduleFollowup: true);
      return;
    }

    try {
      final int crc = frameCrc ?? 0;
      final previous = _duplicateFrames[entry];
      if (crc != 0 &&
          previous != null &&
          (identical(previous.$2, entry.renderingImage) ||
              identical(previous.$2, entry.backgroundImage)) &&
          previous.$2.width == stripWidth &&
          previous.$2.height == stripHeight &&
          previous.$1 == crc) {
        final image = previous.$2.clone();
        skippedImageUploads++;
        _onImageDecoded(
          entry,
          stripStart,
          stripCount,
          dispatchedGen,
          image,
          frameCrc: crc,
        );
        return;
      }
      final shard = _workerShard(entry);
      if (!kIsWeb || !workerPool.isInlineShard(shard)) {
        _releaseWorker(shard);
        _awaitingImages.add(entry);
        _pumpPending();
      }
      _decodeStarts[entry] = _telemetryClock.elapsedMicroseconds;
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
          frameCrc: bgraBytes.lengthInBytes <= cache.maximumDuplicateFrameBytes
              ? crc
              : null,
        ),
      );
    } catch (error) {
      _finishJob(entry, scheduleFollowup: false);
      cache._failed(error);
    }
  }

  @override
  void onBrowserWorkerFallback(_RasterEntry entry) {
    if (entry.pendingStripStart < 0) {
      final desired = entry.desiredFrameIndex;
      final start =
          desired >= 0 &&
              !_stripContains(
                entry.renderingStripStart,
                entry.renderingStripCount,
                desired,
              )
          ? _stripStartFor(entry, desired)
          : _stripStartFor(entry, entry.inFlightStripStart);
      entry.pendingStripStart = start;
      entry.pendingStripCount = _stripCountFor(entry, start, entry.totalFrames);
    }
    _finishJob(entry, scheduleFollowup: true);
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
    ui.Image image, {
    int? frameCrc,
  }) {
    final decodeStartedMicros = _decodeStarts.remove(entry);
    if (decodeStartedMicros != null) {
      cache._recordDecodeMicros(
        _telemetryClock.elapsedMicroseconds - decodeStartedMicros,
      );
    }
    if (_disposed ||
        entry.retired ||
        entry.users.isEmpty ||
        cache.lastError != null ||
        dispatchedGen != entry.stripGeneration) {
      image.dispose();
      final active =
          !_disposed &&
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
        entry.pendingStripCount = _stripCountFor(
          entry,
          start,
          entry.totalFrames,
        );
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
    final expectedNext =
        entry.renderingImage != null &&
            !entry.poster &&
            total > entry.renderingStripCount
        ? _nextStripStart(
            entry,
            entry.renderingStripStart,
            entry.renderingStripCount,
            total,
          )
        : -1;
    final isLookahead =
        !entry.poster &&
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
        entry.lastRenderingSlot = (entry.desiredFrameIndex - stripStart).clamp(
          0,
          stripCount - 1,
        );
      } else {
        entry.lastRenderingSlot = 0;
      }
      cache._bytes += imgBytes;
      cache.renderedFrames += stripCount;
      if (displaced != null) {
        cache._bufferSwaps++;
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
        cache._bufferSwaps++;
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      _notifyUsers(entry);
    } else {
      image.dispose();
    }

    if (frameCrc != null &&
        !_disposed &&
        !entry.retired &&
        entry.users.isNotEmpty &&
        (identical(image, entry.renderingImage) ||
            identical(image, entry.backgroundImage))) {
      _rememberDuplicate(entry, frameCrc, image);
    } else {
      final current = _duplicateFrames[entry];
      if (current != null &&
          !identical(current.$2, entry.renderingImage) &&
          !identical(current.$2, entry.backgroundImage)) {
        _forgetDuplicate(entry);
      }
    }
    _finishJob(entry, scheduleFollowup: true);
  }

  void _finishJob(_RasterEntry entry, {required bool scheduleFollowup}) {
    if (!_disposed && !_awaitingImages.remove(entry)) {
      _releaseWorker(_workerShard(entry));
    }
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
        !_coversStrip(
          entry.renderingStripStart,
          entry.renderingStripCount,
          nextPending,
          nextPendingCount,
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

  void _releaseWorker(int shard) {
    final remaining = (_activeWorkerShards[shard] ?? 1) - 1;
    if (remaining == 0) {
      _activeWorkerShards.remove(shard);
    } else {
      _activeWorkerShards[shard] = remaining;
    }
  }

  void _pumpPending() {
    if (_disposed ||
        !cache._enabled ||
        cache.lastError != null ||
        (_highPriorityQueue.isEmpty && _lowPriorityQueue.isEmpty) ||
        _activeJobs >= _maximumInFlight) {
      return;
    }
    if (_pumpScheduled) return;
    _pumpScheduled = true;
    scheduleMicrotask(() {
      _pumpScheduled = false;
      if (_disposed || !cache._enabled || cache.lastError != null) return;
      while ((_highPriorityQueue.isNotEmpty || _lowPriorityQueue.isNotEmpty) &&
          _activeJobs < _maximumInFlight) {
        final high = _firstDispatchable(_highPriorityQueue);
        final queue = high != null ? _highPriorityQueue : _lowPriorityQueue;
        final entry = high ?? _firstDispatchable(_lowPriorityQueue);
        if (entry == null) break;
        queue.remove(entry);
        entry.queuedForRaster = false;
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
            _coversStrip(
              entry.renderingStripStart,
              entry.renderingStripCount,
              idx,
              count,
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

  _RasterEntry? _firstDispatchable(Set<_RasterEntry> queue) {
    for (final entry in queue) {
      if (_canDispatch(entry)) return entry;
    }
    return null;
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
    _duplicateFrames.clear();
    duplicateFrameBytes = 0;
    clearPending();
    _activeWorkerShards.clear();
    _awaitingImages.clear();
    workerPool.dispose();
  }
}
