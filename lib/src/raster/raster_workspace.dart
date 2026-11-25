part of 'raster_core.dart';

/// Fixed-point coverage, retained spans, and a premultiplied BGRA compositor.
/// Dart prepares draws; native platforms use a bounded coverage workspace.
/// Dart coverage remains the reference implementation and fallback.
///
/// Zero `dart:ui` native engine objects (`Canvas`/`Path`/`Paint`/`Shader`/`Image`)
/// are created or invoked here, allowing execution on background worker Isolates.
class RasterWorkspace {
  RasterWorkspace({
    this.initialHeight = 256,
    bool preferNative = true,
    this.retainCoverage = true,
    this.fuseFillTransforms = defaultFuseFillTransforms,
    this.borrowGeometry = true,
    bool nativeStroke = true,
  }) : preferNative = preferNative && isSimdSupported,
       _nativeStroke = nativeStroke && preferNative && !_isWeb;

  int get retainedCoverageBytes => _coverageBytes;

  /// Retained entries across all scenes sharing this workspace.
  ({int coverage, int paths, int trimMetrics, int gradientLuts})
  get retainedCacheEntries => (
    coverage: _coverage.length,
    paths: _staticPaths.length,
    trimMetrics: _staticTrimMetrics.length,
    gradientLuts: _staticGradientLuts.length,
  );
  int get scratchPixelBytes => _scratchLayers.fold(
    0,
    (bytes, plane) => bytes + (plane?.typedList.lengthInBytes ?? 0),
  );

  final int initialHeight;
  final bool preferNative;
  final bool retainCoverage;
  final bool fuseFillTransforms;
  final bool borrowGeometry;
  int borrowedCoverageDraws = 0, copiedCoverageDraws = 0;
  int fusedFillDraws = 0;
  int fusedNativeSolidDraws = 0;
  int nativeMatteComposites = 0;
  NativeCoverageWorkspace? _nativeCoverage;
  bool _triedNative = false;
  bool _usedLargeNativeGeometry = false;
  static const _coverageByteBudget = 1024 * 1024;
  static const _coverageEntryLimit = 256;
  final _coverage = Map<Object, _CoverageEntry>.identity();
  int _coverageBytes = 0;
  _Compiler? _renderingScene;

  NativeCoverageWorkspace? get _native {
    if (!_triedNative && preferNative) {
      _triedNative = true;
      _nativeCoverage = NativeCoverageWorkspace.acquire();
    }
    return _nativeCoverage;
  }

  void _rasterize(
    PolyPath path,
    bool evenOdd,
    RleSpans out,
    int x0,
    int y0,
    int x1,
    int y1,
  ) {
    final native = _native;
    if (native != null) {
      if (path.vertexCount > 4096 || path.contourCount > 256) {
        _usedLargeNativeGeometry = true;
      }
      final borrowed = native.borrowedDraws, copied = native.copiedDraws;
      final n = native.raster(
        path.vx,
        path.vy,
        path.contourStart,
        path.contourEnd,
        path.vertexCount,
        path.contourCount,
        evenOdd,
        x0,
        y0,
        x1,
        y1,
        out.buffer,
        borrowGeometry: borrowGeometry,
      );
      borrowedCoverageDraws += native.borrowedDraws - borrowed;
      copiedCoverageDraws += native.copiedDraws - copied;
      if (n >= 0) {
        final bounds = native.bounds;
        out
          ..spanCount = n
          ..minX = bounds[0]
          ..minY = bounds[1]
          ..maxX = bounds[2]
          ..maxY = bounds[3];
        return;
      }
    }
    (_scanline ??= FtScanlineRasterizer(
      initialHeight,
    )).rasterizePolyPath(path, evenOdd, out, x0, y0, x1, y1);
  }

  bool _rasterizeSolid(
    PolyPath path,
    bool evenOdd,
    RleSpans out,
    int x0,
    int y0,
    int x1,
    int y1,
    NativePixelBuffer dst,
    int originX,
    int originY,
    int stride,
    int color,
  ) {
    final native = _native;
    if (native == null || !borrowGeometry || color == 0) return false;
    final borrowed = native.borrowedDraws;
    final n = native.rasterSolid(
      path.vx,
      path.vy,
      path.contourStart,
      path.contourEnd,
      path.vertexCount,
      path.contourCount,
      evenOdd,
      x0,
      y0,
      x1,
      y1,
      out.buffer,
      dst,
      originX,
      originY,
      stride,
      color,
    );
    borrowedCoverageDraws += native.borrowedDraws - borrowed;
    if (n < 0) return false;
    final bounds = native.bounds;
    out
      ..spanCount = n
      ..minX = bounds[0]
      ..minY = bounds[1]
      ..maxX = bounds[2]
      ..maxY = bounds[3];
    fusedNativeSolidDraws++;
    return true;
  }

  bool _rasterizeSolidDart(
    PolyPath path,
    bool evenOdd,
    int x0,
    int y0,
    int x1,
    int y1,
    Uint32List dst,
    int originX,
    int originY,
    int stride,
    int color,
  ) => (_scanline ??= FtScanlineRasterizer(initialHeight))
      .rasterizePolyPathSolid(
        path,
        evenOdd,
        x0,
        y0,
        x1,
        y1,
        dst,
        originX,
        originY,
        stride,
        color,
      );

  RleSpans? _retained(Object owner, _CoverageKey key) {
    final entry = _coverage.remove(owner);
    if (entry == null) return null;
    if (entry.key == key) {
      _coverage[owner] = entry;
      return entry.spans;
    }
    _coverageBytes -= entry.bytes;
    entry.spans.dispose();
    return null;
  }

  void _retain(Object owner, _CoverageKey key, RleSpans spans) {
    final bytes = 96 + spans.spanCount * 8;
    if (bytes > _coverageByteBudget ~/ 8) return;
    while (_coverageBytes + bytes > _coverageByteBudget ||
        _coverage.length >= _coverageEntryLimit) {
      final old = _coverage.remove(_coverage.keys.first)!;
      _coverageBytes -= old.bytes;
      old.spans.dispose();
    }
    _coverage[owner] = _CoverageEntry(
      _renderingScene!,
      key,
      spans.copy(),
      bytes,
    );
    _coverageBytes += bytes;
  }

  PolyPath _staticPolyline(_PathSource source, double frame) {
    final cached = _staticPaths.remove(source);
    if (cached != null) {
      _staticPaths[source] = cached;
      return cached.value;
    }
    if (_staticPaths.length >= maxStaticPaths) {
      _staticPaths.remove(_staticPaths.keys.first);
    }
    final local = _flattenLeafPoly..clear();
    _flattenLeaf(source, frame, 0.01, local);
    final path = local.cloneImmutable();
    _staticPaths[source] = _SceneCacheEntry(_renderingScene!, path);
    return path;
  }

  double? _getStaticTrimMetric(_PathSource source) {
    final cached = _staticTrimMetrics.remove(source);
    if (cached == null) return null;
    _staticTrimMetrics[source] = cached;
    return cached.value;
  }

  void _putStaticTrimMetric(_PathSource source, double length) {
    _staticTrimMetrics.remove(source);
    if (_staticTrimMetrics.length >= maxStaticMetrics) {
      _staticTrimMetrics.remove(_staticTrimMetrics.keys.first);
    }
    _staticTrimMetrics[source] = _SceneCacheEntry(_renderingScene!, length);
  }

  static const int maxStaticPaths = 512;
  static const int maxStaticMetrics = 256;
  static const int maxStaticLuts = 256;
  static const int _smallFramePixels = 256 * 256;
  static const int _softScratchPixels = 512 * 512;

  FtScanlineRasterizer? _scanline;
  RleSpans? _rasterSpans, _precompClipSpans, _maskedSpans;
  RleSpans get _spans => _rasterSpans ??= RleSpans();
  RleSpans get _clipSpans => _precompClipSpans ??= RleSpans();
  RleSpans get _intersectSpans => _maskedSpans ??= RleSpans();
  final PolyPath _polyPath = PolyPath();
  final PolyPath _workPolyA = PolyPath();
  final PolyPath _workPolyB = PolyPath();
  final PolyPath _strokePoly = PolyPath();
  final PolyPath _flattenLeafPoly = PolyPath();
  final _trimPolyPool = <PolyPath>[];
  final _trimOutPool = <PolyPath>[];
  final _mergeCutPolyPool = <PolyPath>[];
  final _measurePolyPool = <PolyPath>[];
  final _groupMatrixPool = <Float64List>[];
  final _layerChain = <_Layer?>[];
  final _trimLengthsPool = <Float64List>[];
  final _trimCacheOwners = <_Trim?>[];
  final _trimCacheFrames = <double>[];
  final _trimCacheFlatness = <double>[];
  final Float64Scratch _cumLengths = Float64Scratch();
  final bool _nativeStroke;
  _StrokeScratch? _strokeScratchState;
  _StrokeScratch get _strokeScratch =>
      _strokeScratchState ??= _StrokeScratch(_nativeStroke);

  Float64List? _getCachedTrimPrefix(
    int depth,
    _Trim trim,
    double frame,
    double flatnessSq,
  ) {
    if (depth < _trimCacheOwners.length &&
        identical(_trimCacheOwners[depth], trim) &&
        _trimCacheFrames[depth] == frame &&
        _trimCacheFlatness[depth] == flatnessSq) {
      return _trimLengthsPool[depth];
    }
    return null;
  }

  void _putCachedTrimPrefix(
    int depth,
    _Trim trim,
    double frame,
    double flatnessSq,
  ) {
    while (_trimCacheOwners.length <= depth) {
      _trimCacheOwners.add(null);
      _trimCacheFrames.add(double.nan);
      _trimCacheFlatness.add(double.nan);
    }
    _trimCacheOwners[depth] = trim;
    _trimCacheFrames[depth] = frame;
    _trimCacheFlatness[depth] = flatnessSq;
  }

  void _clearTrimPrefixCache() {
    _trimCacheOwners.fillRange(0, _trimCacheOwners.length, null);
  }

  Float64List _acquireTrimLengths(int depth, int count) {
    while (_trimLengthsPool.length <= depth) {
      _trimLengthsPool.add(Float64List(math.max(16, count)));
    }
    var arr = _trimLengthsPool[depth];
    if (arr.length < count) {
      var cap = arr.length;
      while (cap < count) {
        cap *= 2;
      }
      arr = _trimLengthsPool[depth] = Float64List(cap);
    }
    return arr;
  }

  PolyPath _acquireTrimPoly(int depth) {
    while (_trimPolyPool.length <= depth) {
      _trimPolyPool.add(PolyPath());
    }
    return _trimPolyPool[depth]..clear();
  }

  PolyPath _acquireTrimOut(int depth) {
    while (_trimOutPool.length <= depth) {
      _trimOutPool.add(PolyPath());
    }
    return _trimOutPool[depth]..clear();
  }

  final _booleanSpans = <RleSpans>[];

  RleSpans _acquireBooleanSpans(int slot) {
    while (_booleanSpans.length <= slot) {
      _booleanSpans.add(RleSpans());
    }
    return _booleanSpans[slot]..clear();
  }

  PolyPath _acquireMergeCutPoly(int depth) {
    while (_mergeCutPolyPool.length <= depth) {
      _mergeCutPolyPool.add(PolyPath());
    }
    return _mergeCutPolyPool[depth]..clear();
  }

  PolyPath _acquireMeasurePoly(int depth) {
    while (_measurePolyPool.length <= depth) {
      _measurePolyPool.add(PolyPath());
    }
    return _measurePolyPool[depth]..clear();
  }

  Float64List _groupMatrix(int depth) {
    while (_groupMatrixPool.length <= depth) {
      _groupMatrixPool.add(Float64List(6));
    }
    return _groupMatrixPool[depth];
  }

  final _maskPolyPool = <PolyPath>[];
  final _maskLocalPolyPool = <PolyPath>[];
  final _maskSpansPool = <RleSpans>[];
  final _maskIntersectSpansPool = <RleSpans>[];

  PolyPath _acquireMaskPoly(int depth) {
    while (_maskPolyPool.length <= depth) {
      _maskPolyPool.add(PolyPath());
    }
    return _maskPolyPool[depth]..clear();
  }

  PolyPath _acquireMaskLocalPoly(int depth) {
    while (_maskLocalPolyPool.length <= depth) {
      _maskLocalPolyPool.add(PolyPath());
    }
    return _maskLocalPolyPool[depth]..clear();
  }

  RleSpans _acquireMaskSpans(int depth) {
    while (_maskSpansPool.length <= depth) {
      _maskSpansPool.add(RleSpans());
    }
    return _maskSpansPool[depth];
  }

  RleSpans _acquireIntersectMaskSpans(int depth) {
    while (_maskIntersectSpansPool.length <= depth) {
      _maskIntersectSpansPool.add(RleSpans());
    }
    return _maskIntersectSpansPool[depth];
  }

  // Mattes, blend modes and rotated precomps need scratch planes. Allocate each
  // nesting slot on first use, sized to the affected bounds rather than the frame.
  final _scratchLayers = <NativePixelBuffer?>[];
  int _framePeakScratchPixels = 0;
  int _smallFrameStreak = 0;

  // Cached static geometry / gradient tables owned by this single-threaded
  // worker workspace so repeated frames never re-flatten static paths.
  final _staticPaths = Map<Object, _SceneCacheEntry<PolyPath>>.identity();
  final _staticTrimMetrics = Map<Object, _SceneCacheEntry<double>>.identity();
  final _staticGradientLuts =
      Map<_GradientSpec, _SceneCacheEntry<NativePixelBuffer>>.identity();
  NativePixelBuffer? _scratchGradientLut;
  NativePixelBuffer? _nativeInverseAlphaLut;

  NativePixelBuffer get _inverseAlphaLut =>
      _nativeInverseAlphaLut ??= SwarBlender.allocateInverseAlphaTable();

  void _releaseGradientLuts() {
    for (final lut in _staticGradientLuts.values) {
      lut.value.dispose();
    }
    _staticGradientLuts.clear();
  }

  final _matrixStack = <Float64List>[];

  /// Releases only caches owned by this exact compiled scene, including its
  /// precompositions. Other scenes keep their warm geometry and paint tables.
  /// Ownership lives on bounded cache entries so eviction leaves no side index.
  void releaseScene(RasterScene scene) {
    final compiler = scene._compilerState;
    if (compiler == null) return;
    _clearTrimPrefixCache();
    _coverage.removeWhere((_, entry) {
      if (!identical(entry.scene, compiler)) return false;
      _coverageBytes -= entry.bytes;
      entry.spans.dispose();
      return true;
    });
    _staticPaths.removeWhere((_, entry) => identical(entry.scene, compiler));
    _staticTrimMetrics.removeWhere(
      (_, entry) => identical(entry.scene, compiler),
    );
    _staticGradientLuts.removeWhere((_, entry) {
      if (!identical(entry.scene, compiler)) return false;
      entry.value.dispose();
      return true;
    });
  }

  void resetCaches() {
    _clearTrimPrefixCache();
    for (final entry in _coverage.values) {
      entry.spans.dispose();
    }
    _coverage.clear();
    _coverageBytes = 0;
    _staticPaths.clear();
    _staticTrimMetrics.clear();
    _releaseGradientLuts();
  }

  void dispose() {
    resetCaches();
    _scratchGradientLut?.dispose();
    _scratchGradientLut = null;
    _nativeInverseAlphaLut?.dispose();
    _nativeInverseAlphaLut = null;
    _nativeCoverage?.release();
    _nativeCoverage = null;
    _rasterSpans?.dispose();
    _precompClipSpans?.dispose();
    _maskedSpans?.dispose();
    _rasterSpans = _precompClipSpans = _maskedSpans = null;
    for (final s in _maskSpansPool) {
      s.dispose();
    }
    for (final s in _maskIntersectSpansPool) {
      s.dispose();
    }
    _maskSpansPool.clear();
    _maskIntersectSpansPool.clear();
    _maskPolyPool.clear();
    _maskLocalPolyPool.clear();
    for (final spans in _booleanSpans) {
      spans.dispose();
    }
    _booleanSpans.clear();
    _releaseScratchLayers();
    _scanline = null;
  }

  void trimScratch({bool aggressive = false}) {
    _framePeakScratchPixels = 0;
    if (aggressive) {
      _smallFrameStreak = 0;
      _usedLargeNativeGeometry = false;
    }
    final native = _nativeCoverage;
    if (native != null && (aggressive || native.hasOversizedScratch)) {
      native.trimIfOversized();
    }
    if (aggressive) {
      _scratchGradientLut?.dispose();
      _scratchGradientLut = null;
      _releaseScratchLayers();
      _trimPolyPool.clear();
      _trimOutPool.clear();
      _mergeCutPolyPool.clear();
      _measurePolyPool.clear();
      _trimLengthsPool.clear();
      _trimCacheOwners.clear();
      _trimCacheFrames.clear();
      _trimCacheFlatness.clear();
      _groupMatrixPool.clear();
      _layerChain.clear();
      _matrixStack.clear();
      _strokeScratchState = null;
    } else {
      for (var i = 0; i < _scratchLayers.length; i++) {
        final plane = _scratchLayers[i];
        if (plane != null &&
            (i >= 5 || plane.typedList.length > _softScratchPixels)) {
          plane.dispose();
          _scratchLayers[i] = null;
        }
      }
      if (_scratchLayers.length > 5) _scratchLayers.length = 5;
      _trimPolyPool.removeRange(
        math.min(2, _trimPolyPool.length),
        _trimPolyPool.length,
      );
      for (final p in _trimPolyPool) {
        p.trimIfOversized();
      }
      _trimOutPool.removeRange(
        math.min(2, _trimOutPool.length),
        _trimOutPool.length,
      );
      for (final p in _trimOutPool) {
        p.trimIfOversized();
      }
      _mergeCutPolyPool.removeRange(
        math.min(2, _mergeCutPolyPool.length),
        _mergeCutPolyPool.length,
      );
      _measurePolyPool.removeRange(
        math.min(2, _measurePolyPool.length),
        _measurePolyPool.length,
      );
      for (final p in _measurePolyPool) {
        p.trimIfOversized();
      }
      _trimLengthsPool.removeRange(
        math.min(2, _trimLengthsPool.length),
        _trimLengthsPool.length,
      );
      _clearTrimPrefixCache();
      for (var i = 0; i < _trimLengthsPool.length; i++) {
        if (_trimLengthsPool[i].length > 4096) {
          _trimLengthsPool[i] = Float64List(64);
        }
      }
      _strokeScratchState?.trimIfOversized();
    }
    _polyPath.trimIfOversized(aggressive: aggressive);
    _workPolyA.trimIfOversized(aggressive: aggressive);
    _workPolyB.trimIfOversized(aggressive: aggressive);
    _strokePoly.trimIfOversized(aggressive: aggressive);
    _flattenLeafPoly.trimIfOversized(aggressive: aggressive);
    for (var i = 0; i < _mergeCutPolyPool.length; i++) {
      _mergeCutPolyPool[i].trimIfOversized(aggressive: aggressive);
    }
    if (aggressive) {
      for (final spans in _booleanSpans) {
        spans.dispose();
      }
      _booleanSpans.clear();
    } else {
      for (final spans in _booleanSpans) {
        spans.trimIfOversized();
      }
    }
    _rasterSpans?.trimIfOversized(aggressive: aggressive);
    _precompClipSpans?.trimIfOversized(aggressive: aggressive);
    _maskedSpans?.trimIfOversized(aggressive: aggressive);
    for (var i = 0; i < _maskPolyPool.length; i++) {
      _maskPolyPool[i].trimIfOversized(aggressive: aggressive);
    }
    for (var i = 0; i < _maskLocalPolyPool.length; i++) {
      _maskLocalPolyPool[i].trimIfOversized(aggressive: aggressive);
    }
    for (var i = 0; i < _maskSpansPool.length; i++) {
      _maskSpansPool[i].trimIfOversized(aggressive: aggressive);
    }
    for (var i = 0; i < _maskIntersectSpansPool.length; i++) {
      _maskIntersectSpansPool[i].trimIfOversized(aggressive: aggressive);
    }
    if (aggressive) {
      _scanline = null;
    } else {
      _scanline?.trimIfOversized();
    }
    _cumLengths.trimIfOversized(aggressive: aggressive);
  }

  void maybeTrimAfterFrame(int framePixels) {
    final peak = math.max(framePixels, _framePeakScratchPixels);
    _framePeakScratchPixels = 0;
    final small = peak <= _smallFramePixels && !_usedLargeNativeGeometry;
    _usedLargeNativeGeometry = false;
    if (small) {
      if (++_smallFrameStreak >= 16) {
        _smallFrameStreak = 0;
        trimScratch();
      }
    } else {
      _smallFrameStreak = 0;
    }
  }

  void _releaseScratchLayers() {
    for (final plane in _scratchLayers) {
      plane?.dispose();
    }
    _scratchLayers.clear();
  }

  NativePixelBuffer _acquireScratch(int depth, int pixelsNeeded) {
    if (pixelsNeeded > _framePeakScratchPixels) {
      _framePeakScratchPixels = pixelsNeeded;
    }
    if (_scratchLayers.length <= depth) _scratchLayers.length = depth + 1;
    final buffer = _scratchLayers[depth];
    if (buffer == null) {
      return _scratchLayers[depth] = NativePixelBuffer(pixelsNeeded);
    }
    if (buffer.typedList.length < pixelsNeeded) {
      buffer.reallocate(pixelsNeeded, 0);
    }
    return buffer;
  }

  Float64List _stackMatrix(int depth) {
    while (_matrixStack.length <= depth) {
      _matrixStack.add(Float64List(6));
    }
    return _matrixStack[depth];
  }
}

typedef _CoverageKey = (
  double,
  double,
  double,
  double,
  double,
  double,
  int,
  int,
  int,
  int,
);

final class _SceneCacheEntry<T> {
  _SceneCacheEntry(this.scene, this.value);
  final _Compiler scene;
  final T value;
}

final class _CoverageEntry {
  _CoverageEntry(this.scene, this.key, this.spans, this.bytes);
  final _Compiler scene;
  final _CoverageKey key;
  final RleSpans spans;
  final int bytes;
}
