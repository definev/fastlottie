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
      deduplicateImageUploads: cache.deduplicateImageUploads,
      diskCacheDirectory: diskCacheDirectory,
    );
  }

  final FastLottieRasterCache cache;
  late final RasterWorkerPool<_RasterEntry> workerPool;

  final _highPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _lowPriorityQueue = LinkedHashSet<_RasterEntry>.identity();
  final _activeDiskKeys = <String>{};
  final _activeWorkerShards = <int, int>{};
  final _inFlightShards = Map<_RasterEntry, int>.identity();
  final _awaitingImages = <_RasterEntry>{};
  // Non-owning 64-bit fingerprint `(fpHi, fpLo, image)` for each entry's last
  // accepted buffer. Reused only while `image` is still a front/back buffer;
  // independent clone handles keep normal disposal intact.
  final _duplicateFrames = <_RasterEntry, (int, int, ui.Image)>{};
  final _decodeStarts = <_RasterEntry, int>{};
  final _telemetryClock = Stopwatch()..start();
  int skippedImageUploads = 0;

  void _forgetDuplicate(_RasterEntry entry) {
    _duplicateFrames.remove(entry);
  }

  void _rememberDuplicate(
    _RasterEntry entry,
    int fpHi,
    int fpLo,
    ui.Image image,
  ) {
    if (!cache.deduplicateImageUploads || (fpHi == 0 && fpLo == 0)) {
      _duplicateFrames.remove(entry);
      return;
    }
    _duplicateFrames[entry] = (fpHi, fpLo, image);
  }

  int _activeJobs = 0;
  bool _disposed = false;
  bool _pumpScheduled = false;

  // Cap the total of worker jobs and images being decoded. Browser uploads
  // also have a limit relative to the number of live workers.
  int get _maximumInFlight {
    final limit = cache._inFlightLimit ?? cache.maximumInFlight;
    return kIsWeb
        ? math.min(limit, math.max(1, workerPool.browserWorkers * 2))
        : limit;
  }

  int _workerShard(_RasterEntry entry) =>
      entry.workerShard ??= workerPool.shardForKey(
        entry.entryKey,
        weight: math.max(
          1,
          entry.key.$2.width.toInt() *
              entry.key.$2.height.toInt() *
              entry.sourceFrames,
        ),
      );

  bool _canDispatch(_RasterEntry entry) {
    if (_activeJobs >= _maximumInFlight) return false;
    final shard = _workerShard(entry);
    // Keep first-image work cancelable during viewport churn. Once an entry
    // has an image, one queued lookahead keeps the native shard fed.
    final shardLimit = kIsWeb || entry.renderingImage == null ? 1 : 2;
    if ((_activeWorkerShards[shard] ?? 0) >= shardLimit) return false;
    if (!kIsWeb) return true;
    // Multiple browser workers can fail asynchronously. Keep new inline
    // work on a single slot even when more than one shard fell back.
    return !workerPool.isInlineShard(shard) ||
        !_activeWorkerShards.keys.any(workerPool.isInlineShard);
  }

  int get activeJobCount => _activeJobs;
  int get pendingCount =>
      _activeJobs + _highPriorityQueue.length + _lowPriorityQueue.length;

  void clearPending({bool notifyInFlight = false}) {
    final cleared = Set<_RasterEntry>.identity();
    for (final entry in _highPriorityQueue) {
      entry.queuedForRaster = false;
      entry.queuedHighPriority = false;
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
      if (!entry.retired && entry.users.isNotEmpty) cleared.add(entry);
    }
    for (final entry in _lowPriorityQueue) {
      entry.queuedForRaster = false;
      entry.queuedHighPriority = false;
      entry.pendingStripStart = -1;
      entry.pendingStripCount = 0;
      if (!entry.retired && entry.users.isNotEmpty) cleared.add(entry);
    }
    _highPriorityQueue.clear();
    _lowPriorityQueue.clear();
    if (notifyInFlight) {
      for (final entry in _inFlightShards.keys) {
        if (!entry.retired &&
            entry.renderingImage == null &&
            entry.users.isNotEmpty) {
          cleared.add(entry);
        }
      }
      for (final entry in _awaitingImages) {
        if (!entry.retired &&
            entry.renderingImage == null &&
            entry.users.isNotEmpty) {
          cleared.add(entry);
        }
      }
    }
    if (cleared.isNotEmpty) {
      scheduleMicrotask(() {
        if (_disposed) return;
        for (final entry in cleared) {
          if (!entry.retired && entry.users.isNotEmpty) {
            _notifyUsers(entry);
          }
        }
      });
    }
  }

  void onEntryReleased(_RasterEntry entry) {
    _forgetDuplicate(entry);
    if (entry.inFlightStripStart >= 0) {
      workerPool.cancelInFlight(entry);
    }
    if (entry.retired && entry.workerShard != null) {
      workerPool.releaseEntryShard(entry.entryKey);
    }
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
    if (entry.inFlightStripStart >= 0) {
      workerPool.cancelInFlight(entry);
    }
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
        !entry.retired &&
        entry.rasterError == null &&
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
    if (!cache._enabled || player.isDisposed) return;
    final keySize = FastLottieRasterCache._rasterPixelSize(rawPixels);
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
    if (entry.renderingImage != null ||
        entry.retired ||
        entry.rasterError != null) {
      return;
    }
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
    double relative, {
    required bool requestRaster,
  }) {
    final keySize = FastLottieRasterCache._rasterPixelSize(rawPixels);
    final ph = keySize.height.toInt();
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
      if (!requestRaster) return (null, null, 0);
      if (entry == null &&
          player._rasterRejectedKey == (keySize, rateKey) &&
          player._rasterRejectedGeneration == cache._admissionGeneration) {
        cache._misses++;
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
      cache._misses++;
      return (null, null, 0);
    }
    if (entry.rasterError != null) {
      cache._misses++;
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
      cache._hits++;
      if (requestRaster &&
          !entry.poster &&
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
      cache._hits++;

      if (displaced != null) {
        final dBytes = displaced.width * displaced.height * 4;
        cache._bytes -= dBytes;
        cache._enqueueDisposal(displaced, dBytes);
      }
      if (requestRaster && !entry.poster && total > entry.renderingStripCount) {
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
    cache._misses++;
    if (entry.renderingImage != null &&
        !_stripContains(
          entry.renderingStripStart,
          entry.renderingStripCount,
          index,
        )) {
      entry.hasPlayedAdvance = true;
    }
    if (requestRaster &&
        entry.backgroundImage != null &&
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
    if (requestRaster && cache._enabled) {
      final stripStart = _stripStartFor(entry, index);
      final stripCount = _stripCountFor(entry, stripStart, total);
      _requestStrip(entry, stripStart, stripCount, highPriority: true);
    }

    // If a valid front buffer already exists, hold the last rendered slot
    // to avoid stalling the UI thread with costly vector rasterization.
    if (entry.renderingImage != null && entry.renderingStripCount > 0) {
      final fallbackSlot = entry.lastRenderingSlot.clamp(
        0,
        entry.renderingStripCount - 1,
      );
      return (entry.renderingImage, entry, offsetYForSlot(fallbackSlot));
    }

    if (cache.allowUiVectorFallback) {
      return (null, null, 0);
    }

    return (entry.renderingImage, entry, 0);
  }

  void _ensurePrefetch(_RasterEntry entry, int nextStart) {
    if (!cache._enabled ||
        entry.retired ||
        entry.rasterError != null ||
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
      // Once a front buffer exists, cancel an in-flight multi-frame strip if
      // an urgent miss supersedes it (e.g. seek or fast scroll); on cold start
      // let the initial strip finish rather than starving first-frame delivery.
      if (highPriority &&
          entry.renderingImage != null &&
          entry.inFlightStripCount > 1 &&
          !_stripContains(
            entry.inFlightStripStart,
            entry.inFlightStripCount,
            stripStart,
          )) {
        workerPool.cancelInFlight(entry);
      }
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
          final victim = victimQueue.first;
          onEntryReleased(victim);
          if (!victim.retired && victim.users.isNotEmpty) {
            scheduleMicrotask(() {
              if (!_disposed && !victim.retired && victim.users.isNotEmpty) {
                _notifyUsers(victim);
              }
            });
          }
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

  int _shardForStrip(_RasterEntry entry, int stripStart) {
    final baseShard = _workerShard(entry);
    final workers = workerPool.workerCount;
    // Fan out strips of a single/dual hero animation across idle worker shards
    // when disk caching is inactive (avoids multi-isolate writes to one .flcache).
    if (!kIsWeb &&
        workers > 1 &&
        workerPool.diskCacheDirectory == null &&
        cache._entries.length <= 2 &&
        entry.framesPerStrip > 1 &&
        entry.totalFrames > entry.framesPerStrip) {
      return (baseShard + (stripStart ~/ entry.framesPerStrip)) % workers;
    }
    return baseShard;
  }

  void _dispatchEntryStrip(_RasterEntry entry, int stripStart, int stripCount) {
    if (_disposed ||
        !cache._enabled ||
        entry.retired ||
        entry.rasterError != null ||
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
    final shard = _shardForStrip(entry, stripStart);
    _inFlightShards[entry] = shard;
    _activeWorkerShards[shard] = (_activeWorkerShards[shard] ?? 0) + 1;
    _activeJobs++;

    try {
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
        poster: entry.poster,
      );
    } catch (error) {
      onStripError(entry, error);
    }
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
    required int fpHi,
    required int fpLo,
  }) {
    entry.retriedWorkerFailure = false;
    cache
      .._workerRenderMicros += renderMicros
      .._nativeKernelCalls += kernelCalls
      .._geometryCopyBytes += geometryCopyBytes
      .._isolateTransferBytes += transferBytes;
    if (_disposed || entry.retired || entry.users.isEmpty) {
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
        (entry.queuedHighPriority || stripStart != expectedLookahead);
    if (entry.renderingImage != null && queuedOverride && !wantedNow) {
      _finishJob(entry, scheduleFollowup: true);
      return;
    }

    try {
      final hasFingerprint =
          cache.deduplicateImageUploads && (fpHi != 0 || fpLo != 0);
      final previous = hasFingerprint ? _duplicateFrames[entry] : null;
      if (previous != null &&
          (identical(previous.$3, entry.renderingImage) ||
              identical(previous.$3, entry.backgroundImage)) &&
          previous.$3.width == stripWidth &&
          previous.$3.height == stripHeight &&
          previous.$1 == fpHi &&
          previous.$2 == fpLo) {
        final image = previous.$3.clone();
        skippedImageUploads++;
        _onImageDecoded(
          entry,
          stripStart,
          stripCount,
          dispatchedGen,
          image,
          fpHi: fpHi,
          fpLo: fpLo,
        );
        return;
      }
      final shard = _inFlightShards.remove(entry) ?? _workerShard(entry);
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
          fpHi: hasFingerprint ? fpHi : 0,
          fpLo: hasFingerprint ? fpLo : 0,
        ),
      );
    } catch (error) {
      onStripError(entry, error);
    }
  }

  @override
  void onWorkerInterrupted(_RasterEntry entry, Object error) {
    if (entry.retriedWorkerFailure) {
      onStripError(entry, error);
      return;
    }
    entry.retriedWorkerFailure = true;
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
    cache._lastError = error;
    final active = !_disposed && !entry.retired;
    if (active) {
      entry.rasterError = error;
      cache._releaseFailedEntryResources(entry);
    }
    _finishJob(entry, scheduleFollowup: false);
    if (!active) return;
    if (entry.users.isEmpty) {
      cache._evict(entry);
      return;
    }
    scheduleMicrotask(() {
      if (!_disposed && !entry.retired) _notifyUsers(entry);
    });
  }

  @override
  void onStripCancelled(_RasterEntry entry, int dispatchedGen) {
    final active = !_disposed && !entry.retired && entry.users.isNotEmpty;
    _finishJob(entry, scheduleFollowup: active);
  }

  void _onImageDecoded(
    _RasterEntry entry,
    int stripStart,
    int stripCount,
    int dispatchedGen,
    ui.Image image, {
    int fpHi = 0,
    int fpLo = 0,
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
        dispatchedGen != entry.stripGeneration) {
      image.dispose();
      final active = !_disposed && !entry.retired && entry.users.isNotEmpty;
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
      cache._renderedFrames += stripCount;
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
      cache._renderedFrames += stripCount;
      if (oldBack != null) {
        final oBytes = oldBack.width * oldBack.height * 4;
        cache._bytes -= oBytes;
        cache._enqueueDisposal(oldBack, oBytes);
      }
    } else if (!(_stripContains(
          entry.renderingStripStart,
          entry.renderingStripCount,
          entry.desiredFrameIndex,
        )) &&
        (entry.pendingStripStart < 0 ||
            entry.pendingStripStart == stripStart)) {
      final displaced = entry.renderingImage;
      entry.renderingImage = image;
      entry.renderingStripStart = stripStart;
      entry.renderingStripCount = stripCount;
      entry.lastRenderingSlot = 0;
      cache._bytes += imgBytes;
      cache._renderedFrames += stripCount;
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

    if ((fpHi != 0 || fpLo != 0) &&
        !_disposed &&
        !entry.retired &&
        entry.users.isNotEmpty &&
        (identical(image, entry.renderingImage) ||
            identical(image, entry.backgroundImage))) {
      _rememberDuplicate(entry, fpHi, fpLo, image);
    } else {
      final current = _duplicateFrames[entry];
      if (current != null &&
          !identical(current.$3, entry.renderingImage) &&
          !identical(current.$3, entry.backgroundImage)) {
        _forgetDuplicate(entry);
      }
    }
    _finishJob(entry, scheduleFollowup: true);
  }

  void _finishJob(_RasterEntry entry, {required bool scheduleFollowup}) {
    _decodeStarts.remove(entry);
    final activeShard = _inFlightShards.remove(entry);
    if (!_disposed && !_awaitingImages.remove(entry)) {
      _releaseWorker(activeShard ?? _workerShard(entry));
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
        !entry.retired &&
        entry.rasterError == null &&
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
    if (!_disposed &&
        !entry.retired &&
        entry.rasterError == null &&
        entry.users.isNotEmpty &&
        entry.renderingImage == null &&
        entry.inFlightStripStart < 0 &&
        !entry.queuedForRaster) {
      scheduleMicrotask(() {
        if (!_disposed && !entry.retired && entry.users.isNotEmpty) {
          _notifyUsers(entry);
        }
      });
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
        (_highPriorityQueue.isEmpty && _lowPriorityQueue.isEmpty) ||
        _activeJobs >= _maximumInFlight) {
      return;
    }
    if (_pumpScheduled) return;
    _pumpScheduled = true;
    scheduleMicrotask(() {
      _pumpScheduled = false;
      if (_disposed || !cache._enabled) return;
      while ((_highPriorityQueue.isNotEmpty || _lowPriorityQueue.isNotEmpty) &&
          _activeJobs < _maximumInFlight) {
        final high = _firstDispatchable(_highPriorityQueue);
        final queue = high != null ? _highPriorityQueue : _lowPriorityQueue;
        final entry = high ?? _firstDispatchable(_lowPriorityQueue);
        if (entry == null) break;
        queue.remove(entry);
        entry.queuedForRaster = false;
        entry.queuedHighPriority = false;
        if (entry.retired ||
            entry.rasterError != null ||
            entry.users.isEmpty) {
          continue;
        }
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
    clearPending();
    _activeWorkerShards.clear();
    _awaitingImages.clear();
    workerPool.dispose();
  }
}
