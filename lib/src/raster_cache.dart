part of '../fastlottie.dart';

enum FastLottieRasterMode { animation, poster }

enum FastLottieRasterStrategy { pingPong }

/// Shared ping-pong software raster cache for looping animations.
///
/// Renders frames off the UI isolate on persistent worker Isolates using a
/// FreeType-style analytic scanline RLE rasterizer, maintains double-buffered
/// GPU textures (`ui.Image`) per deduplicated `(contentKey, size, poster, rate)`,
/// and stores LZ4-compressed BGRA8888 bitstreams in bounded RAM and `.flcache`
/// disk files. [maximumBytes] bounds retained GPU RGBA payload/reservations.
class FastLottieRasterCache {
  FastLottieRasterCache({
    this.maximumBytes = 32 * 1024 * 1024,
    this.maximumFrameRate,
    this.maximumPendingFrames = 64,
    this.reservedPosterBytes = 0,
    this.resolutionScale = 1,
    this.strategy = FastLottieRasterStrategy.pingPong,
    this.maximumInFlight = 8,
    this.disposalBatchSize = 8,
    this.maximumCompressedMemoryBytes = 16 * 1024 * 1024,
    this.maximumDiskBytes = 128 * 1024 * 1024,
    String? diskCacheDirectory,
    int? workerCount,
  }) : assert(maximumCompressedMemoryBytes >= 0),
       assert(maximumDiskBytes >= 0) {
    if (!resolutionScale.isFinite ||
        resolutionScale <= 0 ||
        resolutionScale > 1 ||
        maximumBytes < 0 ||
        reservedPosterBytes < 0 ||
        reservedPosterBytes > maximumBytes ||
        maximumPendingFrames < 1 ||
        maximumInFlight < 1 ||
        disposalBatchSize < 1 ||
        maximumCompressedMemoryBytes < 0 ||
        maximumDiskBytes < 0 ||
        (workerCount != null && workerCount < 1) ||
        (maximumFrameRate != null &&
            (!maximumFrameRate!.isFinite || maximumFrameRate! <= 0))) {
      throw ArgumentError('Invalid raster cache limits');
    }
    _pingPong = _PingPongCoordinator(
      this,
      diskCacheDirectory: diskCacheDirectory,
      workerCount: workerCount,
    );
  }

  /// Creates a Telegram-style double-buffered ping-pong software raster cache
  /// backed by worker Isolates, LZ4 compressed RAM, and append-only `.flcache`
  /// disk storage.
  factory FastLottieRasterCache.pingPong({
    int maximumBytes = 32 * 1024 * 1024,
    double? maximumFrameRate,
    int maximumPendingFrames = 64,
    int reservedPosterBytes = 0,
    double resolutionScale = 1,
    int maximumInFlight = 8,
    int disposalBatchSize = 8,
    int maximumCompressedMemoryBytes = 16 * 1024 * 1024,
    int maximumDiskBytes = 128 * 1024 * 1024,
    String? diskCacheDirectory,
    int? workerCount,
  }) => FastLottieRasterCache(
    maximumBytes: maximumBytes,
    maximumFrameRate: maximumFrameRate,
    maximumPendingFrames: maximumPendingFrames,
    reservedPosterBytes: reservedPosterBytes,
    resolutionScale: resolutionScale,
    maximumInFlight: maximumInFlight,
    disposalBatchSize: disposalBatchSize,
    maximumCompressedMemoryBytes: maximumCompressedMemoryBytes,
    maximumDiskBytes: maximumDiskBytes,
    diskCacheDirectory: diskCacheDirectory,
    workerCount: workerCount,
  );

  final int maximumBytes,
      maximumPendingFrames,
      maximumInFlight,
      disposalBatchSize,
      maximumCompressedMemoryBytes,
      maximumDiskBytes;

  /// Keeps space available for one-frame posters while animated clips are pinned.
  final int reservedPosterBytes;

  /// Fixed scale relative to the fitted physical size, including DPR.
  final double resolutionScale;
  final FastLottieRasterStrategy strategy;

  static final Paint _paintNone = Paint()..filterQuality = FilterQuality.none;
  static final Paint _paintLow = Paint()..filterQuality = FilterQuality.low;
  static final Paint _paintMedium = Paint()..filterQuality = FilterQuality.medium;

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

  late final _PingPongCoordinator _pingPong;

  /// Optional temporal quality limit. Null preserves source FPS.
  final double? maximumFrameRate;
  final _entries = <(String, Size, bool, int), _RasterEntry>{};
  final _unpinnedAnims = LinkedHashSet<_RasterEntry>.identity();
  final _unpinnedPosters = LinkedHashSet<_RasterEntry>.identity();
  final _disposalQueue = <ui.Image>[];
  int _disposalHead = 0, _deadBytes = 0;
  bool _disposed = false, _disposalScheduled = false;
  int _touchSeq = 0;
  bool _enabled = true;
  bool get enabled => _enabled;
  set enabled(bool value) {
    _enabled = value;
    if (!value) {
      _pingPong.clearPending();
    }
  }

  /// Attaches or replaces the `.flcache` directory for ping-pong disk caching.
  void attachDiskDirectory(String? directoryPath) {
    _pingPong.workerPool.attachDiskDirectory(directoryPath);
  }

  static String? _defaultDiskDirectory;

  /// Optional directory for widgets using the default shared ping-pong pipeline.
  static String? get defaultDiskDirectory => _defaultDiskDirectory;
  static set defaultDiskDirectory(String? value) {
    _defaultDiskDirectory = value;
    _DefaultPingPongScope._shared?.attachDiskDirectory(value);
  }

  int _reserved = 0, _bytes = 0, hits = 0, misses = 0, renderedFrames = 0;
  int _vectorRasterizedFrames = 0,
      _compressedCacheHits = 0,
      _pingPongSwaps = 0;
  int _posterWeight = 0, _unpinnedAnimBytes = 0, _unpinnedPosterBytes = 0;
  int _admissionGeneration = 0, _admissionAttempts = 0;
  @visibleForTesting
  int get debugAdmissionAttempts => _admissionAttempts;
  @visibleForTesting
  int get debugPendingDisposals => _disposalQueue.length - _disposalHead;
  @visibleForTesting
  int get debugInFlightCaptures => _pingPong.activeJobCount;
  Object? lastError;
  int get reservedBytes => _reserved;
  int get bytes => _bytes;
  int get gpuBytes => _bytes;
  int get compressedRamBytes => _pingPong.workerPool.compressedRamBytes;
  int get diskBytes => _pingPong.workerPool.diskBytes;
  int get vectorRasterizedFrames => _vectorRasterizedFrames;
  int get compressedCacheHits => _compressedCacheHits;
  int get pingPongSwaps => _pingPongSwaps;
  int get entries => _entries.length;
  int get pendingFrames => _pingPong.pendingCount;
  bool get isPingPong => true;

  double _step(FastLottieComposition c, [double? playerMaxFrameRate]) {
    final limit = playerMaxFrameRate ?? maximumFrameRate;
    return limit == null ? 1 : math.max(1.0, c.frameRate / limit);
  }

  int _rateKey(FastLottieComposition c, double? playerMaxFrameRate) {
    final limit = playerMaxFrameRate ?? maximumFrameRate;
    if (limit == null || limit >= c.frameRate) return 0;
    return (limit * 1000).round();
  }

  _RasterEntry? _acquire(FastLottiePlayer player, Size size) {
    if (_disposed || lastError != null) return null;
    _admissionAttempts++;
    final c = player.composition;
    final poster = player.rasterMode == FastLottieRasterMode.poster;
    final step = poster || c.isStatic
        ? 1.0
        : _step(c, player.maximumFrameRate);
    final rateKey = poster || c.isStatic
        ? 0
        : _rateKey(c, player.maximumFrameRate);
    final key = (c.contentKey, size, poster, rateKey);
    var entry = _entries[key];
    if (entry != null) {
      if (entry.users.isEmpty) {
        if (poster) {
          if (_unpinnedPosters.remove(entry)) _unpinnedPosterBytes -= entry.weight;
        } else {
          if (_unpinnedAnims.remove(entry)) _unpinnedAnimBytes -= entry.weight;
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
    final weight = pw * ph * 4 * (c.isStatic || poster || count <= 1 ? 1 : 2);
    if (weight > maximumBytes) return null;

    bool fits() =>
        _reserved + weight <=
        maximumBytes -
            (poster ? 0 : math.max(0, reservedPosterBytes - _posterWeight));

    if (!fits()) {
      // O(1) feasibility check before touching any unpinned entry.
      if (poster) {
        if (_reserved - _unpinnedAnimBytes - _unpinnedPosterBytes + weight >
            maximumBytes) {
          return null;
        }
      } else {
        final animReserved = _reserved - _posterWeight - _unpinnedAnimBytes;
        final minPosterReserved = math.max(
          _posterWeight - _unpinnedPosterBytes,
          reservedPosterBytes,
        );
        if (animReserved + minPosterReserved + weight > maximumBytes) {
          return null;
        }
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
    }
    if (!fits()) return null;
    final sourceFrames = c.isStatic ? 1 : math.max(1, c.frameCount);
    entry = _RasterEntry(
      key,
      weight,
      poster,
      totalFrames: count,
      sourceFrames: sourceFrames,
      frameStep: step,
      entryKey: formatBitstreamEntryKey(c.contentKey, pw, ph, sourceFrames),
      composition: c,
    )..lastTouched = ++_touchSeq;
    _entries[key] = entry;
    _reserved += weight;
    if (poster) _posterWeight += weight;
    entry.users.add(player);
    return entry;
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
        if (_unpinnedAnims.add(entry)) _unpinnedAnimBytes += entry.weight;
      }
      _pingPong.onEntryReleased(entry);
    }
    player._rasterEntry = null;
  }

  (ui.Image?, _RasterEntry?, int) _lookup(
    FastLottiePlayer player,
    Size size,
    double relative,
  ) => _pingPong.lookup(player, size, relative);

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
    final cap = math.max(8 * 1024 * 1024, maximumBytes ~/ 4);
    if (_deadBytes > cap &&
        (_disposalQueue.length - _disposalHead) > disposalBatchSize) {
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
    } else if (_disposalHead > 64 && _disposalHead * 2 >= _disposalQueue.length) {
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
    if (entry.users.isEmpty) {
      if (entry.poster) {
        if (_unpinnedPosters.remove(entry)) _unpinnedPosterBytes -= entry.weight;
      } else {
        if (_unpinnedAnims.remove(entry)) _unpinnedAnimBytes -= entry.weight;
      }
    }
    _pingPong.onEntryReleased(entry);

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
    entry.renderingFrameIndex = -1;
    disposeImage(entry.backgroundImage);
    entry.backgroundImage = null;
    entry.backgroundFrameIndex = -1;

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

  /// Releases all images, including active entries; players reacquire on draw.
  void clear() {
    _admissionGeneration++;
    for (final entry in _entries.values.toList(growable: false)) {
      _evict(entry, immediateDispose: true);
    }
    _flushAllDisposals();
    _pingPong.clear(clearWorkerMemory: true);
    _unpinnedAnims.clear();
    _unpinnedPosters.clear();
    _unpinnedAnimBytes = 0;
    _unpinnedPosterBytes = 0;
  }

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    clear();
    _pingPong.dispose();
  }
}

class _RasterEntry {
  _RasterEntry(
    this.key,
    this.weight,
    this.poster, {
    required this.totalFrames,
    required this.sourceFrames,
    required this.frameStep,
    required this.entryKey,
    required this.composition,
  });

  final (String, Size, bool, int) key;
  final int weight;
  final bool poster;
  final int totalFrames;
  final int sourceFrames;
  final double frameStep;
  final String entryKey;
  final FastLottieComposition composition;

  final users = <FastLottiePlayer>{};
  bool retired = false;
  int lastTouched = 0;

  // Ping-pong double-buffer state.
  ui.Image? renderingImage;
  int renderingFrameIndex = -1;
  ui.Image? backgroundImage;
  int backgroundFrameIndex = -1;
  int inFlightFrameIndex = -1;
  int desiredFrameIndex = -1;
  int pendingFrameIndex = -1;
  bool hasPlayedAdvance = false;
  bool queuedForPingPong = false;
  bool queuedHighPriority = false;
}
