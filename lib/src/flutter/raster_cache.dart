part of 'player.dart';

final class DefaultRasterCacheScope {
  static FastLottieRasterCache? _shared;
  static int _refCount = 0;

  static FastLottieRasterCache? get current => _shared;

  static FastLottieRasterCache acquire() {
    _refCount++;
    return _shared ??= FastLottieRasterCache(
      diskCacheDirectory: FastLottieRasterCache.defaultDiskDirectory,
    );
  }

  static void release() {
    if (_refCount > 0) _refCount--;
    if (_refCount == 0) {
      _shared?.dispose();
      _shared = null;
    }
  }
}

/// Determines which frames a raster cache supplies to a player.
enum FastLottieRasterMode {
  /// Samples frames throughout the animation.
  animation,

  /// Holds the first source frame.
  poster,
}

/// Shared double-buffered raster cache for looping animations.
///
/// Renders frames on persistent native isolates or browser workers using a
/// FreeType-style analytic scanline RLE rasterizer, maintains double-buffered
/// GPU textures (`ui.Image`) per deduplicated `(contentKey, size, poster, rate)`,
/// and stores LZ4-compressed BGRA8888 bitstreams in bounded RAM and `.flcache`
/// disk files. [maximumBytes] bounds retained GPU RGBA payload/reservations.
class FastLottieRasterCache {
  /// Creates a shared raster cache with adaptive frames per strip by default.
  /// Set [framesPerStrip] to 1 for one frame per buffer, or a larger value for
  /// fixed-size strips. [adaptiveStripBudget] lets those strips shrink under
  /// budget pressure. Null adapts to resolution and budget.
  FastLottieRasterCache({
    this.maximumBytes = 32 * 1024 * 1024,
    this.maximumFrameRate,
    this.maximumPendingFrames = 64,
    this.reservedPosterBytes = 0,
    this.resolutionScale = 1,
    this.maximumInFlight = 8,
    this.disposalBatchSize = 8,
    this.maximumCompressedMemoryBytes = 16 * 1024 * 1024,
    this.maximumDiskBytes = 128 * 1024 * 1024,
    this.framesPerStrip,
    this.adaptiveStripBudget = false,
    this.progressiveFirstFrame = true,
    this.deduplicateImageUploads = true,
    this.allowUiVectorFallback = true,
    String? diskCacheDirectory,
    int? workerCount,
  }) {
    _checkResolutionScale(resolutionScale);
    if (maximumFrameRate case final rate?) {
      _checkPositiveFinite(rate, 'maximumFrameRate');
    }
    RangeError.checkNotNegative(maximumBytes, 'maximumBytes');
    RangeError.checkNotNegative(
      maximumCompressedMemoryBytes,
      'maximumCompressedMemoryBytes',
    );
    RangeError.checkNotNegative(maximumDiskBytes, 'maximumDiskBytes');
    RangeError.checkValueInInterval(
      reservedPosterBytes,
      0,
      maximumBytes,
      'reservedPosterBytes',
    );
    _checkPositiveFinite(maximumPendingFrames, 'maximumPendingFrames');
    _checkPositiveFinite(maximumInFlight, 'maximumInFlight');
    _checkPositiveFinite(disposalBatchSize, 'disposalBatchSize');
    if (framesPerStrip case final frames?) {
      _checkPositiveFinite(frames, 'framesPerStrip');
    }
    if (workerCount != null) _checkPositiveFinite(workerCount, 'workerCount');
    _coordinator = _RasterCoordinator(
      this,
      diskCacheDirectory: diskCacheDirectory,
      workerCount: workerCount,
    );
  }

  /// Budget for retained raster bytes and reserved buffer space.
  final int maximumBytes;

  /// Maximum number of raster requests waiting in the queue.
  final int maximumPendingFrames;

  /// Maximum number of outstanding render and image decode jobs.
  final int maximumInFlight;
  int? _inFlightLimit;

  /// Temporarily caps new jobs while the caller is busy, leaving in-flight
  /// work intact. Pass null to restore [maximumInFlight].
  set inFlightLimit(int? value) {
    if (value != null) {
      RangeError.checkValueInInterval(value, 1, maximumInFlight);
    }
    if (_inFlightLimit == value) return;
    _inFlightLimit = value;
    _coordinator._pumpPending();
  }

  /// Base number of retired images disposed in one batch.
  final int disposalBatchSize;

  /// Total compressed frame memory budget across worker shards.
  final int maximumCompressedMemoryBytes;

  /// Maximum retained disk cache size in bytes; zero disables disk storage.
  final int maximumDiskBytes;

  /// Maximum frames packed vertically into each buffer.
  /// One uses a single frame; null adapts to resolution and memory budget.
  final int? framesPerStrip;

  /// Allows configured strips to shrink to fit more active animations.
  /// Has no effect when [framesPerStrip] is null or one.
  final bool adaptiveStripBudget;

  /// Render only the requested sample before starting normal strip playback.
  /// Enabled by default. Set false for full-strip startup. Clips fitting in a
  /// single strip keep their one-upload full-loop path.
  final bool progressiveFirstFrame;

  /// Reuses an entry's current front or back GPU texture via `ui.Image.clone()`
  /// when a worker delivers an identical 64-bit content fingerprint.
  ///
  /// Retains no pixel buffers on the UI isolate; matching is probabilistic
  /// (~2^-64 collision rate per strip transition), not byte-for-byte.
  /// Set false to disable fingerprinting and always upload decoded buffers.
  final bool deduplicateImageUploads;

  /// When false, cold frames waiting for worker delivery do not fall back to
  /// synchronous vector rasterization on the Flutter UI thread.
  final bool allowUiVectorFallback;

  /// Number of image uploads avoided by reusing a texture with a matching
  /// 64-bit content fingerprint.
  int get skippedImageUploads => _coordinator.skippedImageUploads;

  /// Keeps space available for one-frame posters while animated clips are pinned.
  final int reservedPosterBytes;

  /// Fixed scale relative to the fitted physical size, including DPR.
  final double resolutionScale;

  static final Paint _paintNone = Paint()..filterQuality = FilterQuality.none;
  static final Paint _paintLow = Paint()..filterQuality = FilterQuality.low;
  static final Paint _paintMedium = Paint()
    ..filterQuality = FilterQuality.medium;

  Paint _paintForScale(double effectiveScale, [FilterQuality? override]) {
    if (override != null) {
      return switch (override) {
        FilterQuality.none => _paintNone,
        FilterQuality.low => _paintLow,
        FilterQuality.medium || FilterQuality.high => _paintMedium,
      };
    }
    return effectiveScale < 1 ? _paintLow : _paintNone;
  }

  late final _RasterCoordinator _coordinator;

  /// Optional temporal quality limit. Null preserves source FPS.
  final double? maximumFrameRate;
  final _entries = <(String, Size, bool, int), _RasterEntry>{};
  final _unpinnedAnims = LinkedHashSet<_RasterEntry>.identity();
  final _unpinnedPosters = LinkedHashSet<_RasterEntry>.identity();
  final _demotableEntries = LinkedHashSet<_RasterEntry>.identity();
  final _disposalQueue = <ui.Image>[];
  int _disposalHead = 0, _deadBytes = 0;
  bool _disposed = false, _disposalScheduled = false;
  int _touchSeq = 0;
  bool _enabled = true;

  /// Whether the cache accepts raster requests.
  bool get enabled => _enabled;

  /// Enables request handling or drops pending work when disabled.
  set enabled(bool value) {
    _enabled = value;
    if (!value) {
      _coordinator.clearPending();
    }
  }

  /// Attaches or replaces the `.flcache` directory for raster disk caching.
  void attachDiskDirectory(String? directoryPath) {
    _coordinator.workerPool.attachDiskDirectory(directoryPath);
  }

  static String? _defaultDiskDirectory;

  /// Optional directory for widgets using the default shared raster pipeline.
  static String? get defaultDiskDirectory => _defaultDiskDirectory;
  static set defaultDiskDirectory(String? value) {
    _defaultDiskDirectory = value;
    DefaultRasterCacheScope.current?.attachDiskDirectory(value);
  }

  int _reserved = 0, _bytes = 0;

  /// Number of lookups that found the requested raster sample.
  int hits = 0;

  /// Number of lookups without the requested sample, including admission misses.
  int misses = 0;

  /// Number of frames installed in the retained image buffers.
  int renderedFrames = 0;
  int _vectorRasterizedFrames = 0, _compressedCacheHits = 0, _bufferSwaps = 0;
  int _workerRenderMicros = 0,
      _nativeKernelCalls = 0,
      _geometryCopyBytes = 0,
      _isolateTransferBytes = 0;
  final _decodeMicros = <int>[];
  int _posterWeight = 0,
      _unpinnedAnimBytes = 0,
      _unpinnedPosterBytes = 0,
      _totalDemotableBytes = 0,
      _unpinnedAnimDemotableBytes = 0;
  int _admissionGeneration = 0, _admissionAttempts = 0;
  @visibleForTesting
  /// Number of attempts to admit new or existing entries.
  int get debugAdmissionAttempts => _admissionAttempts;
  @visibleForTesting
  /// Number of unpinned cached entries (entries without active players).
  int get debugUnpinnedEntries =>
      _unpinnedAnims.length + _unpinnedPosters.length;
  @visibleForTesting
  /// Number of retired images waiting for disposal.
  int get debugPendingDisposals => _disposalQueue.length - _disposalHead;
  @visibleForTesting
  /// Number of currently active raster jobs.
  int get debugInFlightCaptures => _coordinator.activeJobCount;
  @visibleForTesting
  /// Number of requests dispatched to workers.
  int get debugWorkerDispatches => workerDispatches;
  @visibleForTesting
  /// Number of scene registrations tracked across workers.
  int get debugRegisteredWorkerScenes =>
      _coordinator.workerPool.registeredSceneCount;
  @visibleForTesting
  /// Current strip size for the player's raster entry, if admitted.
  int? debugEntryFramesPerStrip(FastLottiePlayer player) =>
      player._rasterEntry?.framesPerStrip;
  @visibleForTesting
  /// The currently shared default widget cache, if acquired.
  static FastLottieRasterCache? get debugSharedDefaultCache =>
      DefaultRasterCacheScope.current;

  /// The most recent raster pipeline error, if any.
  Object? lastError;

  /// Total raster buffer bytes reserved for admitted entries.
  int get reservedBytes => _reserved;

  /// Estimated bytes of raster pixel payload retained by live entries.
  int get bytes => _bytes;

  /// Alias for [bytes]; engine and GPU overhead are excluded.
  int get gpuBytes => _bytes;

  /// Reported compressed frame bytes retained by the workers.
  int get compressedRamBytes => _coordinator.workerPool.compressedRamBytes;

  /// Bytes tracked in the disk raster cache.
  int get diskBytes => _coordinator.workerPool.diskBytes;

  /// Number of browser workers handling raster jobs for this cache.
  int get browserWorkers => _coordinator.workerPool.browserWorkers;

  /// Browser workers that loaded the standalone C Wasm kernels.
  int get browserWasmWorkers => _coordinator.workerPool.browserWasmWorkers;

  /// Total raster requests dispatched to worker shards.
  int get workerDispatches => _coordinator.workerPool.debugDispatchCount;

  /// Frames rasterized by workers from their scene geometry.
  int get vectorRasterizedFrames => _vectorRasterizedFrames;

  /// Frames served from the worker frame cache.
  int get compressedCacheHits => _compressedCacheHits;

  /// Number of front buffer replacements or swaps.
  int get bufferSwaps => _bufferSwaps;

  /// Cumulative software scene-render time measured inside worker isolates.
  int get workerRenderMicros => _workerRenderMicros;

  /// Native/Wasm kernel transitions made by vector-rendered frames.
  int get nativeKernelCalls => _nativeKernelCalls;

  /// Geometry bytes copied into native coverage scratch buffers.
  int get geometryCopyBytes => _geometryCopyBytes;

  /// BGRA bytes transferred from raster workers to the UI isolate.
  int get isolateTransferBytes => _isolateTransferBytes;

  /// Rolling p95 latency of the latest 128 `decodeImageFromPixels` uploads.
  int get decodeImageP95Micros {
    if (_decodeMicros.isEmpty) return 0;
    final sorted = List<int>.from(_decodeMicros)..sort();
    return sorted[((sorted.length * 95 + 99) ~/ 100 - 1).clamp(
      0,
      sorted.length - 1,
    )];
  }

  void _recordDecodeMicros(int micros) {
    if (_decodeMicros.length == 128) _decodeMicros.removeAt(0);
    _decodeMicros.add(micros);
  }

  /// Number of admitted raster cache entries.
  int get entries => _entries.length;

  /// Number of queued and active raster jobs.
  int get pendingFrames => _coordinator.pendingCount;

  double _step(FastLottieComposition c, [double? playerMaxFrameRate]) {
    final limit = playerMaxFrameRate ?? maximumFrameRate;
    return limit == null ? 1 : math.max(1.0, c.frameRate / limit);
  }

  int _rateKey(FastLottieComposition c, double? playerMaxFrameRate) {
    final limit = playerMaxFrameRate ?? maximumFrameRate;
    if (limit == null || limit >= c.frameRate) return 0;
    return (limit * 1000).round();
  }

  static int _stripBufferBytes(int pw, int ph, int k) =>
      pw * (k * ph + k - 1) * 4;

  static int _entryWeightForStrip(int pw, int ph, int count, int k) {
    final buffers = count <= k ? 1 : 2;
    return _stripBufferBytes(pw, ph, k) * buffers;
  }

  static int _stepDownFramesPerStrip(int pw, int ph, int count, int currentK) {
    if (currentK <= 1) return 1;
    final currentWeight = _entryWeightForStrip(pw, ph, count, currentK);
    var next = math.max(1, currentK ~/ 2);
    // Avoid stepping from a 1-buffer full-clip strip (e.g. K=4, count<=4) to
    // a 2-buffer smaller strip (K=2) that frees only 1px gutter row (~4*pw B).
    if (next > 1 &&
        currentWeight - _entryWeightForStrip(pw, ph, count, next) <
            pw * ph * 4) {
      next = math.max(1, next ~/ 2);
    }
    return next;
  }

  int _resolveFramesPerStrip(int pw, int ph, int count, {int? entryBudget}) {
    if (count <= 1) return 1;
    final maxByHeight = ph > 0 ? math.max(1, (4096 + 1) ~/ (ph + 1)) : 1;
    final configured = framesPerStrip;
    final frameBytes = pw * ph * 4;
    var targetK =
        configured ??
        switch (frameBytes) {
          <= 64 * 1024 => count <= 6 ? count : 4,
          <= 256 * 1024 => 4,
          <= 1024 * 1024 => 2,
          _ => 1,
        };
    targetK = math.min(targetK, math.min(count, maxByHeight));
    if (configured != null && !adaptiveStripBudget) return targetK;
    final budget = entryBudget != null
        ? math.min(maximumBytes, math.max(0, entryBudget))
        : maximumBytes;
    while (targetK > 1) {
      if (_entryWeightForStrip(pw, ph, count, targetK) <= budget) break;
      targetK = _stepDownFramesPerStrip(pw, ph, count, targetK);
    }
    return targetK;
  }

  _RasterEntry? _acquire(FastLottiePlayer player, Size size) {
    if (_disposed || lastError != null) return null;
    _admissionAttempts++;
    final c = player.composition;
    final poster = player.rasterMode == FastLottieRasterMode.poster;
    final step = poster || c.isStatic ? 1.0 : _step(c, player.maximumFrameRate);
    final rateKey = poster || c.isStatic
        ? 0
        : _rateKey(c, player.maximumFrameRate);
    final key = (c.contentKey, size, poster, rateKey);
    var entry = _entries[key];
    if (entry != null) {
      if (entry.users.isEmpty) {
        if (poster) {
          if (_unpinnedPosters.remove(entry)) {
            _unpinnedPosterBytes -= entry.weight;
          }
        } else {
          if (_unpinnedAnims.remove(entry)) {
            _unpinnedAnimBytes -= entry.weight;
            _unpinnedAnimDemotableBytes -= entry.demotableBytes;
          }
        }
      }
      entry.lastTouched = ++_touchSeq;
      entry.users.add(player);
      return entry;
    }

    final count = c.isStatic || poster
        ? 1
        : math.max(1, ((c.endFrame - c.startFrame) / step).ceil());
    final pw = size.width.ceil();
    final ph = size.height.ceil();
    final minWeight = c.isStatic || poster || count <= 1
        ? pw * ph * 4
        : _entryWeightForStrip(pw, ph, count, 1);
    if (minWeight > maximumBytes) return null;

    final int pinnedAnimBytes = _reserved - _posterWeight - _unpinnedAnimBytes;
    final int pinnedPosterBytes = _posterWeight - _unpinnedPosterBytes;
    final int pinnedTotal = poster
        ? pinnedAnimBytes + pinnedPosterBytes
        : pinnedAnimBytes +
              math.max<int>(pinnedPosterBytes, reservedPosterBytes);
    final int pinnedHeadroom = math.max<int>(0, maximumBytes - pinnedTotal);
    final int pinnedCount =
        _entries.length - _unpinnedAnims.length - _unpinnedPosters.length;
    var entryBudget = pinnedHeadroom;
    if (pinnedCount >= 4 && pinnedTotal >= maximumBytes ~/ 2) {
      final nonPosterCeiling = math.max<int>(
        0,
        maximumBytes - (poster ? 0 : reservedPosterBytes),
      );
      final fairShare = nonPosterCeiling ~/ (pinnedCount + 1);
      if (fairShare < entryBudget) entryBudget = fairShare;
    }

    final effectiveStrip = c.isStatic || poster || count <= 1
        ? 1
        : _resolveFramesPerStrip(
            pw,
            ph,
            count,
            entryBudget: math.max<int>(minWeight, entryBudget),
          );
    final weight = c.isStatic || poster || count <= 1
        ? minWeight
        : _entryWeightForStrip(pw, ph, count, effectiveStrip);
    if (weight > maximumBytes) return null;

    bool fits() =>
        _reserved + weight <=
        maximumBytes -
            (poster ? 0 : math.max(0, reservedPosterBytes - _posterWeight));

    if (!fits()) {
      // O(1) feasibility check accounting for both unpinned eviction and
      // adaptive strip demotion (K -> K~/2 -> 1) before modifying any entry.
      final pinnedDemotableBytes =
          _totalDemotableBytes - _unpinnedAnimDemotableBytes;
      if (pinnedTotal - pinnedDemotableBytes + weight > maximumBytes) {
        return null;
      }
      while (!fits()) {
        final anim = _unpinnedAnims.isNotEmpty ? _unpinnedAnims.first : null;
        final post =
            (poster || _posterWeight > reservedPosterBytes) &&
                _unpinnedPosters.isNotEmpty
            ? _unpinnedPosters.first
            : null;
        late final _RasterEntry victim;
        if (anim != null && post != null) {
          victim = anim.lastTouched <= post.lastTouched ? anim : post;
        } else if (anim != null) {
          victim = anim;
        } else if (post != null) {
          victim = post;
        } else {
          break;
        }
        _evict(victim);
      }
      while (!fits() && _demotableEntries.isNotEmpty) {
        _demoteEntry(_demotableEntries.first);
      }
    }
    if (!fits()) return null;
    final sourceFrames = c.isStatic ? 1 : math.max(1, c.frameCount);
    final entryMinWeight = framesPerStrip == null || adaptiveStripBudget
        ? math.min(weight, minWeight)
        : weight;
    entry = _RasterEntry(
      key,
      weight,
      entryMinWeight,
      poster,
      totalFrames: count,
      sourceFrames: sourceFrames,
      framesPerStrip: effectiveStrip,
      frameStep: step,
      entryKey: formatBitstreamEntryKey(c.contentKey, pw, ph, sourceFrames),
    )..lastTouched = ++_touchSeq;
    _entries[key] = entry;
    _reserved += weight;
    if (poster) _posterWeight += weight;
    final demotable = entry.demotableBytes;
    if (demotable > 0) {
      _demotableEntries.add(entry);
      _totalDemotableBytes += demotable;
    }
    entry.users.add(player);
    return entry;
  }

  void _demoteEntry(_RasterEntry entry) {
    final pw = entry.key.$2.width.toInt();
    final ph = entry.key.$2.height.toInt();
    final oldK = entry.framesPerStrip;
    final newK = _stepDownFramesPerStrip(pw, ph, entry.totalFrames, oldK);
    final newWeight = newK == 1
        ? entry.minWeight
        : _entryWeightForStrip(pw, ph, entry.totalFrames, newK);

    final oldDemotable = entry.demotableBytes;
    final newDemotable = newK > 1
        ? math.max(0, newWeight - entry.minWeight)
        : 0;
    final diffWeight = entry.weight - newWeight;
    final diffDemotable = oldDemotable - newDemotable;

    entry.stripGeneration++;
    entry.weight = newWeight;
    entry.framesPerStrip = newK;
    _reserved -= diffWeight;
    _totalDemotableBytes -= diffDemotable;
    if (entry.users.isEmpty && !entry.poster) {
      _unpinnedAnimBytes -= diffWeight;
      _unpinnedAnimDemotableBytes -= diffDemotable;
    }

    _demotableEntries.remove(entry);
    if (newK > 1 && newDemotable > 0) {
      _demotableEntries.add(entry);
    }

    final bg = entry.backgroundImage;
    if (bg != null) {
      final bBytes = bg.width * bg.height * 4;
      _bytes -= bBytes;
      _enqueueDisposal(bg, bBytes);
      entry.backgroundImage = null;
      entry.backgroundStripStart = -1;
      entry.backgroundStripCount = 0;
    }

    final front = entry.renderingImage;
    if (front != null) {
      final fBytes = front.width * front.height * 4;
      // The retained front must fit in one buffer so lookahead can use the other.
      if (fBytes > _stripBufferBytes(pw, ph, newK)) {
        _bytes -= fBytes;
        _enqueueDisposal(front, fBytes);
        entry.renderingImage = null;
        entry.renderingStripStart = -1;
        entry.renderingStripCount = 0;
        entry.lastRenderingSlot = 0;
      }
    }

    _coordinator.onEntryDemoted(entry);
  }

  void _release(FastLottiePlayer player) {
    final entry = player._rasterEntry;
    if (entry == null) return;
    entry.users.remove(player);
    if (entry.users.isEmpty && !entry.retired) {
      _admissionGeneration++;
      entry.lastTouched = ++_touchSeq;
      if (entry.poster) {
        if (_unpinnedPosters.add(entry)) _unpinnedPosterBytes += entry.weight;
      } else {
        if (_unpinnedAnims.add(entry)) {
          _unpinnedAnimBytes += entry.weight;
          _unpinnedAnimDemotableBytes += entry.demotableBytes;
        }
      }
      _coordinator.onEntryReleased(entry);
    }
    player._rasterEntry = null;
  }

  (ui.Image?, _RasterEntry?, int) _lookup(
    FastLottiePlayer player,
    Size size,
    double relative, {
    required bool requestRaster,
  }) =>
      _coordinator.lookup(player, size, relative, requestRaster: requestRaster);

  static Size _rasterPixelSize(Size rawPixels) => Size(
    math.max(1, (rawPixels.width - 1e-4).ceil()).toDouble(),
    math.max(1, (rawPixels.height - 1e-4).ceil()).toDouble(),
  );

  void _prewarm(FastLottiePlayer player, Size size) {
    if (_disposed || !_enabled || lastError != null) return;
    _coordinator.prewarm(player, size);
  }

  void _failed(Object error) {
    lastError = error;
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (!_disposed) clear();
    });
    SchedulerBinding.instance.ensureVisualUpdate();
  }

  void _enqueueDisposal(ui.Image image, int imgBytes) {
    _disposalQueue.add(image);
    _deadBytes += imgBytes;
    final cap = math.max(
      1024 * 1024,
      math.min(4 * 1024 * 1024, maximumBytes ~/ 8),
    );
    if (_deadBytes > cap) {
      _drainDisposalBatch(disposalBatchSize);
    }
    _scheduleDisposal();
  }

  void _drainDisposalBatch(int count) {
    var drained = 0;
    while (_disposalHead < _disposalQueue.length && drained < count) {
      final image = _disposalQueue[_disposalHead++];
      _deadBytes -= image.width * image.height * 4;
      image.dispose();
      drained++;
    }
    if (_disposalHead >= _disposalQueue.length) {
      _disposalQueue.clear();
      _disposalHead = 0;
      _deadBytes = 0;
    } else if (_disposalHead > 64 &&
        _disposalHead * 2 >= _disposalQueue.length) {
      _disposalQueue.removeRange(0, _disposalHead);
      _disposalHead = 0;
    }
  }

  void _scheduleDisposal() {
    if (_disposed ||
        _disposalScheduled ||
        _disposalHead >= _disposalQueue.length) {
      return;
    }
    _disposalScheduled = true;
    SchedulerBinding.instance.addPostFrameCallback((_) {
      _disposalScheduled = false;
      if (_disposed) return;
      final remaining = _disposalQueue.length - _disposalHead;
      if (remaining <= 0) return;
      final batch = math.min(
        disposalBatchSize * 4,
        math.max(disposalBatchSize, (remaining + 7) ~/ 8),
      );
      _drainDisposalBatch(batch);
      if (_disposalHead < _disposalQueue.length) _scheduleDisposal();
    });
    SchedulerBinding.instance.ensureVisualUpdate();
  }

  void _flushAllDisposals() {
    while (_disposalHead < _disposalQueue.length) {
      _disposalQueue[_disposalHead++].dispose();
    }
    _disposalQueue.clear();
    _disposalHead = 0;
    _deadBytes = 0;
  }

  void _evict(_RasterEntry entry, {bool immediateDispose = false}) {
    _admissionGeneration++;
    _entries.remove(entry.key);
    entry.retired = true;
    _reserved -= entry.weight;
    if (entry.poster) _posterWeight -= entry.weight;
    if (_demotableEntries.remove(entry)) {
      _totalDemotableBytes -= entry.demotableBytes;
    }
    if (entry.users.isEmpty) {
      if (entry.poster) {
        if (_unpinnedPosters.remove(entry)) {
          _unpinnedPosterBytes -= entry.weight;
        }
      } else {
        if (_unpinnedAnims.remove(entry)) {
          _unpinnedAnimBytes -= entry.weight;
          _unpinnedAnimDemotableBytes -= entry.demotableBytes;
        }
      }
    }
    _coordinator.onEntryReleased(entry);

    void disposeImage(ui.Image? img) {
      if (img == null) return;
      final imgBytes = img.width * img.height * 4;
      _bytes -= imgBytes;
      if (immediateDispose || _disposed) {
        img.dispose();
      } else {
        _enqueueDisposal(img, imgBytes);
      }
    }

    disposeImage(entry.renderingImage);
    entry.renderingImage = null;
    entry.renderingStripStart = -1;
    entry.renderingStripCount = 0;
    disposeImage(entry.backgroundImage);
    entry.backgroundImage = null;
    entry.backgroundStripStart = -1;
    entry.backgroundStripCount = 0;

    if (entry.users.isNotEmpty) {
      if (entry.users.length == 1) {
        entry.users.first._rasterInvalidated(entry);
      } else {
        for (final player in entry.users.toList(growable: false)) {
          player._rasterInvalidated(entry);
        }
      }
      entry.users.clear();
    }
  }

  /// Evicts all unpinned entries (entries with no active players/widgets) to free GPU textures.
  void evictUnpinned() {
    _admissionGeneration++;
    while (_unpinnedAnims.isNotEmpty) {
      _evict(_unpinnedAnims.first, immediateDispose: true);
    }
    while (_unpinnedPosters.isNotEmpty) {
      _evict(_unpinnedPosters.first, immediateDispose: true);
    }
    _flushAllDisposals();
  }

  /// Releases all images, including active entries; players reacquire on draw.
  void clear() {
    lastError = null;
    _admissionGeneration++;
    for (final entry in _entries.values.toList(growable: false)) {
      _evict(entry, immediateDispose: true);
    }
    _flushAllDisposals();
    _coordinator.clear(clearWorkerMemory: true);
    _unpinnedAnims.clear();
    _unpinnedPosters.clear();
    _demotableEntries.clear();
    _unpinnedAnimBytes = 0;
    _unpinnedPosterBytes = 0;
    _totalDemotableBytes = 0;
    _unpinnedAnimDemotableBytes = 0;
  }

  /// Releases all retained images and stops this cache's workers.
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    clear();
    _coordinator.dispose();
  }
}

class _RasterEntry {
  _RasterEntry(
    this.key,
    this.weight,
    this.minWeight,
    this.poster, {
    required this.totalFrames,
    required this.sourceFrames,
    required this.framesPerStrip,
    required this.frameStep,
    required this.entryKey,
  });

  final (String, Size, bool, int) key;
  int weight;
  final int minWeight;
  final bool poster;
  final int totalFrames;
  final int sourceFrames;
  int framesPerStrip;
  int stripGeneration = 0;
  int get demotableBytes =>
      framesPerStrip > 1 ? math.max(0, weight - minWeight) : 0;
  final double frameStep;
  final String entryKey;
  int? workerShard;

  final users = <FastLottiePlayer>{};
  bool retired = false;
  int lastTouched = 0;

  // Ping-pong double-buffer strip state.
  ui.Image? renderingImage;
  int renderingStripStart = -1;
  int renderingStripCount = 0;
  int lastRenderingSlot = 0;
  ui.Image? backgroundImage;
  int backgroundStripStart = -1;
  int backgroundStripCount = 0;
  int inFlightStripStart = -1;
  int inFlightStripCount = 0;
  int desiredFrameIndex = -1;
  int pendingStripStart = -1;
  int pendingStripCount = 0;
  bool hasPlayedAdvance = false;
  bool queuedForRaster = false;
  bool queuedHighPriority = false;
}
