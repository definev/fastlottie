part of '../fastlottie.dart';

/// Pure-Dart FreeType-style analytic scanline RLE software rasterizer and
/// 64-bit SWAR/SIMD premultiplied BGRA8888 compositor.
///
/// Zero `dart:ui` native engine objects (`Canvas`/`Path`/`Paint`/`Shader`/`Image`)
/// are created or invoked here, allowing execution on background worker Isolates.
class _RasterWorkspace {
  _RasterWorkspace({int initialWidth = 256, int initialHeight = 256})
    : _scanline = _FtScanlineRasterizer(initialHeight),
      _scratchLayer = Uint32List(initialWidth * initialHeight),
      _scratchMatte = Uint32List(initialWidth * initialHeight),
      _scratchPrecomp = Uint32List(initialWidth * initialHeight);

  static const int maxStaticPaths = 512;
  static const int maxStaticMetrics = 256;
  static const int maxStaticLuts = 256;
  static const int _smallFramePixels = 256 * 256;
  static const int _softScratchPixels = 512 * 512;

  final _FtScanlineRasterizer _scanline;
  final _RleSpans _spans = _RleSpans();
  final _RleSpans _clipSpans = _RleSpans();
  final _RleSpans _intersectSpans = _RleSpans();
  final _PolyPath _polyPath = _PolyPath();
  final _PolyPath _workPolyA = _PolyPath();
  final _PolyPath _workPolyB = _PolyPath();
  final _PolyPath _strokePoly = _PolyPath();
  final _PolyPath _flattenLeafPoly = _PolyPath();
  final _trimPolyPool = <_PolyPath>[];
  final _trimOutPool = <_PolyPath>[];
  final _measurePolyPool = <_PolyPath>[];
  final _groupMatrixPool = <Float64List>[];
  final _layerChain = <_Layer?>[];
  final _trimLengthsPool = <Float64List>[];
  final _Float64Scratch _cumLengths = _Float64Scratch();
  _StrokeScratch? _strokeScratchState;
  _StrokeScratch get _strokeScratch =>
      _strokeScratchState ??= _StrokeScratch();

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

  _PolyPath _acquireTrimPoly(int depth) {
    while (_trimPolyPool.length <= depth) {
      _trimPolyPool.add(_PolyPath());
    }
    return _trimPolyPool[depth]..clear();
  }

  _PolyPath _acquireTrimOut(int depth) {
    while (_trimOutPool.length <= depth) {
      _trimOutPool.add(_PolyPath());
    }
    return _trimOutPool[depth]..clear();
  }

  _PolyPath _acquireMeasurePoly(int depth) {
    while (_measurePolyPool.length <= depth) {
      _measurePolyPool.add(_PolyPath());
    }
    return _measurePolyPool[depth]..clear();
  }

  Float64List _groupMatrix(int depth) {
    while (_groupMatrixPool.length <= depth) {
      _groupMatrixPool.add(Float64List(6));
    }
    return _groupMatrixPool[depth];
  }

  Uint32List _scratchLayer;
  Uint32List _scratchMatte;
  Uint32List _scratchPrecomp;
  final _scratchDepthBuffers = <Uint32List>[];
  int _framePeakScratchPixels = 0;
  int _smallFrameStreak = 0;

  // Cached static geometry / gradient tables owned by this single-threaded
  // worker workspace so repeated frames never re-flatten static paths.
  final Map<Object, _PolyPath> staticPaths = Map<Object, _PolyPath>.identity();
  final Map<Object, double> staticTrimMetrics = Map<Object, double>.identity();
  final Map<_GradientSpec, Uint32List> staticGradientLuts =
      Map<_GradientSpec, Uint32List>.identity();
  final Uint32List scratchGradientLut = Uint32List(1024);
  final _matrixStack = <Float64List>[];

  void resetCaches() {
    staticPaths.clear();
    staticTrimMetrics.clear();
    staticGradientLuts.clear();
  }

  void trimScratch({bool aggressive = false}) {
    _framePeakScratchPixels = 0;
    if (aggressive) {
      _smallFrameStreak = 0;
    }
    final cap = aggressive ? _smallFramePixels : _softScratchPixels;
    if (_scratchLayer.length > cap) {
      _scratchLayer = Uint32List(_smallFramePixels);
    }
    if (_scratchMatte.length > cap) {
      _scratchMatte = Uint32List(_smallFramePixels);
    }
    if (_scratchPrecomp.length > cap) {
      _scratchPrecomp = Uint32List(_smallFramePixels);
    }
    if (aggressive) {
      _scratchDepthBuffers.clear();
      _trimPolyPool.clear();
      _trimOutPool.clear();
      _measurePolyPool.clear();
      _trimLengthsPool.clear();
      _groupMatrixPool.clear();
      _layerChain.clear();
      _matrixStack.clear();
      _strokeScratchState = null;
    } else {
      if (_scratchDepthBuffers.length > 2) {
        _scratchDepthBuffers.length = 2;
      }
      for (var i = 0; i < _scratchDepthBuffers.length; i++) {
        if (_scratchDepthBuffers[i].length > cap) {
          _scratchDepthBuffers[i] = Uint32List(_smallFramePixels);
        }
      }
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
    _spans.trimIfOversized(aggressive: aggressive);
    _clipSpans.trimIfOversized(aggressive: aggressive);
    _intersectSpans.trimIfOversized(aggressive: aggressive);
    _scanline.trimIfOversized(aggressive: aggressive);
    _cumLengths.trimIfOversized(aggressive: aggressive);
  }

  void maybeTrimAfterFrame(int framePixels) {
    final peak = math.max(framePixels, _framePeakScratchPixels);
    _framePeakScratchPixels = 0;
    if (peak <= _smallFramePixels) {
      if (++_smallFrameStreak >= 16) {
        _smallFrameStreak = 0;
        trimScratch();
      }
    } else {
      _smallFrameStreak = 0;
    }
  }

  Uint32List _acquireScratch(int depth, int pixelsNeeded) {
    if (pixelsNeeded > _framePeakScratchPixels) {
      _framePeakScratchPixels = pixelsNeeded;
    }
    if (depth == 0) {
      if (_scratchLayer.length < pixelsNeeded) {
        _scratchLayer = Uint32List(pixelsNeeded);
      }
      return _scratchLayer;
    }
    if (depth == 1) {
      if (_scratchMatte.length < pixelsNeeded) {
        _scratchMatte = Uint32List(pixelsNeeded);
      }
      return _scratchMatte;
    }
    if (depth == 2) {
      if (_scratchPrecomp.length < pixelsNeeded) {
        _scratchPrecomp = Uint32List(pixelsNeeded);
      }
      return _scratchPrecomp;
    }
    final idx = depth - 3;
    while (_scratchDepthBuffers.length <= idx) {
      _scratchDepthBuffers.add(Uint32List(pixelsNeeded));
    }
    var buf = _scratchDepthBuffers[idx];
    if (buf.length < pixelsNeeded) {
      buf = _scratchDepthBuffers[idx] = Uint32List(pixelsNeeded);
    }
    return buf;
  }

  Float64List _stackMatrix(int depth) {
    while (_matrixStack.length <= depth) {
      _matrixStack.add(Float64List(6));
    }
    return _matrixStack[depth];
  }
}

class _Float64Scratch {
  static const int defaultCapacity = 256;
  static const int softLimit = 4096;

  Float64List data = Float64List(defaultCapacity);
  Float64List ensure(int n) {
    if (data.length >= n) return data;
    var next = data.length;
    while (next < n) {
      next *= 2;
    }
    return data = Float64List(next);
  }

  void trimIfOversized({bool aggressive = false}) {
    final limit = aggressive ? defaultCapacity : softLimit;
    if (data.length > limit) {
      data = Float64List(defaultCapacity);
    }
  }
}

/// Struct-of-arrays polyline contour container with zero per-frame allocations.
class _PolyPath {
  static const int defaultVertices = 512;
  static const int defaultContours = 32;
  static const int softMaxVertices = 8192;
  static const int softMaxContours = 512;

  _PolyPath({
    int initialVertices = defaultVertices,
    int initialContours = defaultContours,
  }) : vx = Float64List(initialVertices),
       vy = Float64List(initialVertices),
       contourStart = Int32List(initialContours),
       contourEnd = Int32List(initialContours),
       contourClosed = Uint8List(initialContours);

  Float64List vx;
  Float64List vy;
  Int32List contourStart;
  Int32List contourEnd;
  Uint8List contourClosed;
  int vertexCount = 0;
  int contourCount = 0;
  int _activeStart = 0;
  bool _inContour = false;

  void clear() {
    vertexCount = 0;
    contourCount = 0;
    _activeStart = 0;
    _inContour = false;
  }

  void trimIfOversized({bool aggressive = false}) {
    clear();
    final vLimit = aggressive ? defaultVertices : softMaxVertices;
    if (vx.length > vLimit) {
      vx = Float64List(defaultVertices);
      vy = Float64List(defaultVertices);
    }
    final cLimit = aggressive ? defaultContours : softMaxContours;
    if (contourStart.length > cLimit) {
      contourStart = Int32List(defaultContours);
      contourEnd = Int32List(defaultContours);
      contourClosed = Uint8List(defaultContours);
    }
  }

  _PolyPath cloneImmutable() {
    final copy = _PolyPath(
      initialVertices: math.max(1, vertexCount),
      initialContours: math.max(1, contourCount),
    );
    copy.vx.setRange(0, vertexCount, vx);
    copy.vy.setRange(0, vertexCount, vy);
    copy.contourStart.setRange(0, contourCount, contourStart);
    copy.contourEnd.setRange(0, contourCount, contourEnd);
    copy.contourClosed.setRange(0, contourCount, contourClosed);
    copy.vertexCount = vertexCount;
    copy.contourCount = contourCount;
    return copy;
  }

  void _growVertices() {
    final nextCap = vx.length * 2;
    final nx = Float64List(nextCap)..setRange(0, vertexCount, vx);
    final ny = Float64List(nextCap)..setRange(0, vertexCount, vy);
    vx = nx;
    vy = ny;
  }

  void _growContours() {
    final nextCap = contourStart.length * 2;
    contourStart = Int32List(nextCap)..setRange(0, contourCount, contourStart);
    contourEnd = Int32List(nextCap)..setRange(0, contourCount, contourEnd);
    contourClosed = Uint8List(nextCap)..setRange(0, contourCount, contourClosed);
  }

  void beginContour(bool closed) {
    if (_inContour) endContour();
    _inContour = true;
    _activeStart = vertexCount;
    if (contourCount == contourStart.length) _growContours();
    contourStart[contourCount] = _activeStart;
    contourClosed[contourCount] = closed ? 1 : 0;
  }

  void addVertex(double x, double y) {
    if (vertexCount > _activeStart) {
      final px = vx[vertexCount - 1];
      final py = vy[vertexCount - 1];
      if ((x - px).abs() + (y - py).abs() < 1e-7) return;
    }
    if (vertexCount == vx.length) _growVertices();
    vx[vertexCount] = x;
    vy[vertexCount] = y;
    vertexCount++;
  }

  void addCubic(
    double x0,
    double y0,
    double x1,
    double y1,
    double x2,
    double y2,
    double x3,
    double y3,
    double flatnessSq, [
    int depth = 0,
  ]) {
    if (depth >= 10) {
      addVertex(x3, y3);
      return;
    }
    final dx1 = x1 - (2.0 * x0 + x3) / 3.0;
    final dy1 = y1 - (2.0 * y0 + y3) / 3.0;
    final dx2 = x2 - (x0 + 2.0 * x3) / 3.0;
    final dy2 = y2 - (y0 + 2.0 * y3) / 3.0;
    final d = math.max(dx1 * dx1 + dy1 * dy1, dx2 * dx2 + dy2 * dy2);
    if (d * 0.5625 <= flatnessSq) {
      addVertex(x3, y3);
      return;
    }
    final x01 = (x0 + x1) * 0.5;
    final y01 = (y0 + y1) * 0.5;
    final x12 = (x1 + x2) * 0.5;
    final y12 = (y1 + y2) * 0.5;
    final x23 = (x2 + x3) * 0.5;
    final y23 = (y2 + y3) * 0.5;
    final x012 = (x01 + x12) * 0.5;
    final y012 = (y01 + y12) * 0.5;
    final x123 = (x12 + x23) * 0.5;
    final y123 = (y12 + y23) * 0.5;
    final mx = (x012 + x123) * 0.5;
    final my = (y012 + y123) * 0.5;
    addCubic(x0, y0, x01, y01, x012, y012, mx, my, flatnessSq, depth + 1);
    addCubic(mx, my, x123, y123, x23, y23, x3, y3, flatnessSq, depth + 1);
  }

  void endContour() {
    if (!_inContour) return;
    _inContour = false;
    var end = vertexCount;
    // Remove trailing vertex equal to start on closed contours cleanly.
    if (contourClosed[contourCount] == 1 && end - _activeStart > 1) {
      final sx = vx[_activeStart], sy = vy[_activeStart];
      final ex = vx[end - 1], ey = vy[end - 1];
      if ((ex - sx).abs() + (ey - sy).abs() < 1e-7) {
        end--;
        vertexCount = end;
      }
    }
    if (end <= _activeStart) return;
    contourEnd[contourCount] = end;
    contourCount++;
  }

  void appendTransformed(_PolyPath src, double a, double b, double c, double d, double tx, double ty) {
    final isIdentity = a == 1.0 && b == 0.0 && c == 0.0 && d == 1.0 && tx == 0.0 && ty == 0.0;
    for (var k = 0; k < src.contourCount; k++) {
      final start = src.contourStart[k];
      final end = src.contourEnd[k];
      if (end <= start) continue;
      beginContour(src.contourClosed[k] == 1);
      if (isIdentity) {
        for (var i = start; i < end; i++) {
          if (vertexCount == vx.length) _growVertices();
          vx[vertexCount] = src.vx[i];
          vy[vertexCount] = src.vy[i];
          vertexCount++;
        }
      } else {
        for (var i = start; i < end; i++) {
          final sx = src.vx[i], sy = src.vy[i];
          if (vertexCount == vx.length) _growVertices();
          vx[vertexCount] = a * sx + c * sy + tx;
          vy[vertexCount] = b * sx + d * sy + ty;
          vertexCount++;
        }
      }
      endContour();
    }
  }
}

/// Compact packed RLE span list:
/// word0 = (y << 16) | x
/// word1 = (len << 8) | (coverage - 1), with coverage in 1..256.
class _RleSpans {
  static const int defaultSpans = 1024;
  static const int softMaxSpans = 16384;

  _RleSpans({int initialSpans = defaultSpans})
    : data = Int32List(initialSpans * 2);

  Int32List data;
  int spanCount = 0;
  int minX = 0x7FFFFFFF;
  int minY = 0x7FFFFFFF;
  int maxX = 0;
  int maxY = 0;

  void clear() {
    spanCount = 0;
    minX = 0x7FFFFFFF;
    minY = 0x7FFFFFFF;
    maxX = 0;
    maxY = 0;
  }

  void trimIfOversized({bool aggressive = false}) {
    clear();
    final limitWords = (aggressive ? defaultSpans : softMaxSpans) * 2;
    if (data.length > limitWords) {
      data = Int32List(defaultSpans * 2);
    }
  }

  void _grow() {
    final next = Int32List(data.length * 2)..setRange(0, spanCount * 2, data);
    data = next;
  }

  void addSpan(int y, int x, int len, int cov) {
    if (len <= 0 || cov <= 0) return;
    if (cov > 256) cov = 256;
    final packedCov = cov - 1;
    // Merge adjacent horizontal span on same scanline with identical coverage.
    if (spanCount > 0) {
      final lastIdx = (spanCount - 1) * 2;
      final w0 = data[lastIdx];
      final ly = w0 >>> 16;
      if (ly == y) {
        final w1 = data[lastIdx + 1];
        if ((w1 & 0xFF) == packedCov) {
          final lx = w0 & 0xFFFF;
          final llen = w1 >>> 8;
          if (lx + llen == x) {
            data[lastIdx + 1] = ((llen + len) << 8) | packedCov;
            final x2 = x + len;
            if (x2 > maxX) maxX = x2;
            return;
          }
        }
      }
    }
    final idx = spanCount * 2;
    if (idx + 2 > data.length) _grow();
    data[idx] = (y << 16) | (x & 0xFFFF);
    data[idx + 1] = (len << 8) | packedCov;
    spanCount++;
    if (x < minX) minX = x;
    if (x + len > maxX) maxX = x + len;
    if (y < minY) minY = y;
    if (y + 1 > maxY) maxY = y + 1;
  }

  /// Intersects [a] and [clip] sorted RLE spans into [out], multiplying coverage.
  static void intersect(_RleSpans a, _RleSpans clip, _RleSpans out) {
    out.clear();
    if (a.spanCount == 0 || clip.spanCount == 0) return;
    if (a.maxX <= clip.minX ||
        clip.maxX <= a.minX ||
        a.maxY <= clip.minY ||
        clip.maxY <= a.minY) {
      return;
    }
    var ia = 0;
    var ic = 0;
    final na = a.spanCount * 2;
    final nc = clip.spanCount * 2;
    final da = a.data;
    final dc = clip.data;
    while (ia < na && ic < nc) {
      final a0 = da[ia], c0 = dc[ic];
      final ay = a0 >>> 16, cy = c0 >>> 16;
      if (ay < cy) {
        ia += 2;
        continue;
      }
      if (cy < ay) {
        ic += 2;
        continue;
      }
      final ax = a0 & 0xFFFF, cx = c0 & 0xFFFF;
      final a1 = da[ia + 1], c1 = dc[ic + 1];
      final axEnd = ax + (a1 >>> 8), cxEnd = cx + (c1 >>> 8);
      final x0 = ax > cx ? ax : cx;
      final x1 = axEnd < cxEnd ? axEnd : cxEnd;
      if (x1 > x0) {
        final acov = (a1 & 0xFF) + 1;
        final ccov = (c1 & 0xFF) + 1;
        final cov = (acov * ccov + 128) >> 8;
        if (cov > 0) out.addSpan(ay, x0, x1 - x0, cov);
      }
      if (axEnd <= cxEnd) ia += 2;
      if (cxEnd <= axEnd) ic += 2;
    }
  }
}

/// FreeType-derived integer fixed-point (256 subpixels/pixel) scanline gray rasterizer.
class _FtScanlineRasterizer {
  _FtScanlineRasterizer(int initialHeight)
    : _initialRows = math.max(64, initialHeight),
      _rowHead = Int32List(math.max(64, initialHeight))
        ..fillRange(0, math.max(64, initialHeight), -1);

  static const int _coordLimit = 1 << 20; // +/- 1,048,576 px
  static const int _defaultCells = 8192;
  static const int _softMaxCells = 32768;
  static const int _softMaxRows = 2048;

  final int _initialRows;
  Int32List _rowHead;
  Int32List _cellX = Int32List(_defaultCells);
  Int32List _cellCover = Int32List(_defaultCells);
  Int32List _cellArea = Int32List(_defaultCells);
  Int32List _cellNext = Int32List(_defaultCells);
  int _cellCount = 0;

  void trimIfOversized({bool aggressive = false}) {
    _cellCount = 0;
    _valid = false;
    _dirtyMaxY = -1;
    _dirtyMinY = 0;
    final rowCap = aggressive ? _initialRows : math.max(_initialRows, _softMaxRows);
    if (_rowHead.length > rowCap) {
      _rowHead = Int32List(_initialRows)..fillRange(0, _initialRows, -1);
    }
    final cellCap = aggressive ? _defaultCells : _softMaxCells;
    if (_cellX.length > cellCap) {
      _cellX = Int32List(_defaultCells);
      _cellCover = Int32List(_defaultCells);
      _cellArea = Int32List(_defaultCells);
      _cellNext = Int32List(_defaultCells);
    }
  }

  int _minEx = 0, _minEy = 0, _maxEx = 0, _maxEy = 0;
  int _minBoundX = 0, _minBoundY = 0, _maxBoundX = 0, _maxBoundY = 0;
  int _dirtyMinY = 0, _dirtyMaxY = -1;
  int _curX = 0, _curY = 0;
  int _ex = 0, _ey = 0, _cover = 0, _area = 0;
  bool _valid = false;

  void begin(int clipX0, int clipY0, int clipX1, int clipY1) {
    if (clipY1 > _rowHead.length) {
      final len = math.max(clipY1, _rowHead.length * 2);
      _rowHead = Int32List(len)..fillRange(0, len, -1);
    } else if (_dirtyMaxY >= _dirtyMinY) {
      final clearStart = math.max(0, _dirtyMinY);
      final clearEnd = math.min(_rowHead.length, _dirtyMaxY + 1);
      if (clearEnd > clearStart) _rowHead.fillRange(clearStart, clearEnd, -1);
    }
    _minEx = clipX0;
    _minEy = clipY0;
    _maxEx = clipX1;
    _maxEy = clipY1;
    _minBoundX = clipX0 << 8;
    _minBoundY = clipY0 << 8;
    _maxBoundX = clipX1 << 8;
    _maxBoundY = clipY1 << 8;
    _dirtyMinY = clipY1;
    _dirtyMaxY = clipY0 - 1;
    _cellCount = 0;
    _valid = false;
    _curX = 0;
    _curY = 0;
  }

  void _growCells() {
    final next = _cellX.length * 2;
    _cellX = Int32List(next)..setRange(0, _cellCount, _cellX);
    _cellCover = Int32List(next)..setRange(0, _cellCount, _cellCover);
    _cellArea = Int32List(next)..setRange(0, _cellCount, _cellArea);
    _cellNext = Int32List(next)..setRange(0, _cellCount, _cellNext);
  }

  int _toFixed(double v) {
    if (!v.isFinite) return 0;
    if (v > _coordLimit) v = _coordLimit.toDouble();
    if (v < -_coordLimit) v = -_coordLimit.toDouble();
    return (v * 256.0).round();
  }

  void moveTo(double x, double y) {
    _flushCell();
    _curX = _toFixed(x);
    _curY = _toFixed(y);
  }

  void lineTo(double x, double y) {
    final tx = _toFixed(x);
    final ty = _toFixed(y);
    _renderLine(tx, ty);
  }

  void rasterizePolyPath(_PolyPath path, bool evenOdd, _RleSpans out,
      int clipX0, int clipY0, int clipX1, int clipY1) {
    out.clear();
    if (clipX0 >= clipX1 || clipY0 >= clipY1 || path.contourCount == 0) return;
    begin(clipX0, clipY0, clipX1, clipY1);
    final vx = path.vx;
    final vy = path.vy;
    for (var k = 0; k < path.contourCount; k++) {
      final start = path.contourStart[k];
      final end = path.contourEnd[k];
      if (end - start < 2) continue;
      final sx = vx[start], sy = vy[start];
      moveTo(sx, sy);
      for (var i = start + 1; i < end; i++) {
        lineTo(vx[i], vy[i]);
      }
      // Scanline polygon fill always requires closed contours (Skia implicitly
      // closes open contours on fills; strokes are already closed by _expandStroke).
      lineTo(sx, sy);
    }
    sweep(evenOdd, out);
  }

  void _flushCell() {
    if (!_valid) return;
    _valid = false;
    final cover = _cover, area = _area;
    if (cover == 0 && area == 0) return;
    final ey = _ey;
    if (ey < _minEy || ey >= _maxEy) return;
    var ex = _ex;
    var effectiveArea = area;
    if (ex < _minEx) {
      if (cover == 0) return;
      ex = _minEx;
      effectiveArea = 0;
    } else if (ex >= _maxEx) {
      return;
    }
    if (ey < _dirtyMinY) _dirtyMinY = ey;
    if (ey > _dirtyMaxY) _dirtyMaxY = ey;

    var prev = -1;
    var cur = _rowHead[ey];
    while (cur != -1) {
      final cx = _cellX[cur];
      if (cx == ex) {
        _cellCover[cur] += cover;
        _cellArea[cur] += effectiveArea;
        return;
      }
      if (cx > ex) break;
      prev = cur;
      cur = _cellNext[cur];
    }
    if (_cellCount == _cellX.length) _growCells();
    final idx = _cellCount++;
    _cellX[idx] = ex;
    _cellCover[idx] = cover;
    _cellArea[idx] = effectiveArea;
    _cellNext[idx] = cur;
    if (prev == -1) {
      _rowHead[ey] = idx;
    } else {
      _cellNext[prev] = idx;
    }
  }

  void _setCell(int ex, int ey) {
    if (_valid) {
      if (_ex == ex && _ey == ey) return;
      _flushCell();
    }
    _ex = ex;
    _ey = ey;
    _cover = 0;
    _area = 0;
    _valid = true;
  }

  void _recordSegment(int ey, int ex, int fx1, int fx2, int delta) {
    if (delta == 0) return;
    if (ex < _minEx) {
      _setCell(_minEx, ey);
      _cover += delta;
      return;
    }
    if (ex >= _maxEx) return;
    _setCell(ex, ey);
    _cover += delta;
    _area += (fx1 + fx2) * delta;
  }

  void _renderScanline(int ey, int x1, int y1, int x2, int y2) {
    final delta = y2 - y1;
    if (delta == 0 || ey < _minEy || ey >= _maxEy) return;
    var ex1 = x1 >> 8;
    var ex2 = x2 >> 8;
    if (ex1 == ex2) {
      _recordSegment(ey, ex1, x1 - (ex1 << 8), x2 - (ex1 << 8), delta);
      return;
    }
    final dx = x2 - x1;
    var curFx = x1 - (ex1 << 8);
    var curFy = y1;
    if (x2 > x1) {
      // Stepping right. Fast-skip completely left-of-viewport subsegments.
      if (ex1 < _minEx) {
        if (ex2 < _minEx) {
          _recordSegment(ey, _minEx, 0, 0, delta);
          return;
        }
        final crossFy = y1 + ((_minBoundX - x1) * delta) ~/ dx;
        _recordSegment(ey, _minEx, 0, 0, crossFy - curFy);
        curFy = crossFy;
        ex1 = _minEx;
        curFx = 0;
      }
      while (ex1 < ex2 && ex1 < _maxEx) {
        final nextX = (ex1 + 1) << 8;
        final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
        _recordSegment(ey, ex1, curFx, 256, nextFy - curFy);
        curFy = nextFy;
        curFx = 0;
        ex1++;
      }
      if (ex1 < _maxEx) {
        _recordSegment(ey, ex1, curFx, x2 - (ex2 << 8), y2 - curFy);
      }
    } else {
      // Stepping left.
      // When starting inside pixel ex1 right on left boundary, normalize start fx=0 edge.
      if (ex1 >= _maxEx) {
        if (ex2 >= _maxEx) return;
        final crossFy = y1 + ((_maxBoundX - x1) * delta) ~/ dx;
        curFy = crossFy;
        ex1 = _maxEx - 1;
        curFx = 256;
      }
      while (ex1 > ex2 && ex1 >= _minEx) {
        final nextX = ex1 << 8;
        final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
        _recordSegment(ey, ex1, curFx, 0, nextFy - curFy);
        curFy = nextFy;
        curFx = 256;
        ex1--;
      }
      if (ex1 < _minEx) {
        _recordSegment(ey, _minEx, 0, 0, y2 - curFy);
      } else {
        _recordSegment(ey, ex1, curFx, x2 - (ex2 << 8), y2 - curFy);
      }
    }
  }

  void _renderLine(int toX, int toY) {
    final x1 = _curX;
    final y1 = _curY;
    _curX = toX;
    _curY = toY;
    final dy = toY - y1;
    if (dy == 0) return;

    var ey1 = y1 >> 8;
    var ey2 = toY >> 8;
    if (ey1 < _minEy && ey2 < _minEy) return;
    if (ey1 >= _maxEy && ey2 >= _maxEy) return;

    if (ey1 == ey2) {
      _renderScanline(ey1, x1, y1 - (ey1 << 8), toX, toY - (ey1 << 8));
      return;
    }

    final dx = toX - x1;
    var curX = x1;
    var curY = y1;
    if (dy > 0) {
      // Downward edge.
      if (ey1 < _minEy) {
        curX = x1 + ((_minBoundY - y1) * dx) ~/ dy;
        curY = _minBoundY;
        ey1 = _minEy;
      }
      while (ey1 < ey2 && ey1 < _maxEy) {
        final nextY = (ey1 + 1) << 8;
        final nextX = x1 + ((nextY - y1) * dx) ~/ dy;
        _renderScanline(ey1, curX, curY - (ey1 << 8), nextX, 256);
        curX = nextX;
        curY = nextY;
        ey1++;
      }
      if (ey1 < _maxEy) {
        _renderScanline(ey1, curX, curY - (ey1 << 8), toX, toY - (ey1 << 8));
      }
    } else {
      // Upward edge.
      if (ey1 >= _maxEy) {
        curX = x1 + ((_maxBoundY - y1) * dx) ~/ dy;
        curY = _maxBoundY;
        ey1 = _maxEy - 1;
      }
      if (ey1 == ey2) {
        if (ey1 >= _minEy) {
          _renderScanline(ey1, curX, curY - (ey1 << 8), toX, toY - (ey1 << 8));
        }
        return;
      }
      final firstRowY = ey1 << 8;
      final firstNextX = x1 + ((firstRowY - y1) * dx) ~/ dy;
      if (ey1 >= _minEy) {
        _renderScanline(ey1, curX, curY - firstRowY, firstNextX, 0);
      }
      curX = firstNextX;
      ey1--;
      while (ey1 > ey2 && ey1 >= _minEy) {
        final rowBottomY = ey1 << 8;
        final nextX = x1 + ((rowBottomY - y1) * dx) ~/ dy;
        _renderScanline(ey1, curX, 256, nextX, 0);
        curX = nextX;
        ey1--;
      }
      if (ey1 >= _minEy) {
        _renderScanline(ey1, curX, 256, toX, toY - (ey1 << 8));
      }
    }
  }

  static int _calcCoverage(int area, bool evenOdd) {
    var cov = area >> 9;
    if (cov < 0) cov = -cov;
    if (!evenOdd) {
      return cov >= 256 ? 256 : cov;
    }
    cov &= 511;
    if (cov > 256) cov = 512 - cov;
    return cov;
  }

  void sweep(bool evenOdd, _RleSpans out) {
    _flushCell();
    if (_dirtyMaxY < _dirtyMinY) return;
    final startY = math.max(_minEy, _dirtyMinY);
    final endY = math.min(_maxEy - 1, _dirtyMaxY);
    for (var y = startY; y <= endY; y++) {
      var cell = _rowHead[y];
      _rowHead[y] = -1;
      if (cell == -1) continue;
      var cover = 0;
      var x = _minEx;
      while (cell != -1) {
        final cx = _cellX[cell];
        if (cx > x && cover != 0) {
          final cov = _calcCoverage(cover << 9, evenOdd);
          if (cov > 0) out.addSpan(y, x, cx - x, cov);
        }
        cover += _cellCover[cell];
        final cov = _calcCoverage((cover << 9) - _cellArea[cell], evenOdd);
        if (cov > 0) out.addSpan(y, cx, 1, cov);
        x = cx + 1;
        cell = _cellNext[cell];
      }
      if (cover != 0 && x < _maxEx) {
        final cov = _calcCoverage(cover << 9, evenOdd);
        if (cov > 0) out.addSpan(y, x, _maxEx - x, cov);
      }
    }
    _dirtyMaxY = _minEy - 1;
    _dirtyMinY = _maxEy;
  }
}

/// 64-bit SWAR premultiplied BGRA8888 (`(A << 24) | (R << 16) | (G << 8) | B`) blenders.
abstract final class _SwarBlender {
  /// Exact 16.16 fixed-point reciprocal table for un-premultiplying `0..255`
  /// channels by `alpha` (`1..255`): `((c * _invAlphaLut[a]) >> 16) == (c * 255) ~/ a`.
  static final Uint32List _invAlphaLut = () {
    final lut = Uint32List(256);
    for (var a = 1; a < 256; a++) {
      lut[a] = ((255 << 16) + a - 1) ~/ a;
    }
    return lut;
  }();

  static int premulBgra(int a, int r, int g, int b) {
    if (a == 0) return 0;
    if (a == 255) return (0xFF << 24) | (r << 16) | (g << 8) | b;
    final pr = (r * a + 127) ~/ 255;
    final pg = (g * a + 127) ~/ 255;
    final pb = (b * a + 127) ~/ 255;
    return (a << 24) | (pr << 16) | (pg << 8) | pb;
  }

  static int scalePremul(int premul, int factor256) {
    if (factor256 >= 256) return premul;
    if (factor256 <= 0 || premul == 0) return 0;
    final rb = ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
    final ag = ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
    return rb | ag;
  }

  static int blendSrcOver(int srcPremul, int dstPremul) {
    if (srcPremul == 0) return dstPremul;
    final sa = srcPremul >>> 24;
    if (sa == 255 || dstPremul == 0) return srcPremul;
    final ia = 255 - sa;
    final rb0 = (dstPremul & 0x00FF00FF) * ia + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((dstPremul >> 8) & 0x00FF00FF) * ia + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return srcPremul + (rb | ag);
  }

  static int scalePremul255(int premul, int factor255) {
    if (factor255 >= 255) return premul;
    if (factor255 <= 0 || premul == 0) return 0;
    final rb0 = (premul & 0x00FF00FF) * factor255 + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((premul >> 8) & 0x00FF00FF) * factor255 + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return rb | ag;
  }

  static void fillSolidSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    _RleSpans spans,
    int srcPremul,
  ) {
    if (srcPremul == 0 || spans.spanCount == 0) return;
    final count = spans.spanCount * 2;
    final data = spans.data;
    final fullSa = srcPremul >>> 24;
    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final y = (w0 >>> 16) - dstOriginY;
      final x = (w0 & 0xFFFF) - dstOriginX;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final effSrc = cov == 256 ? srcPremul : scalePremul(srcPremul, cov);
      if (effSrc == 0) continue;
      final sa = effSrc >>> 24;
      final row = y * stride + x;
      final end = row + len;
      if (sa == 255) {
        if (len >= 8) {
          dst.fillRange(row, end, effSrc);
        } else {
          for (var p = row; p < end; p++) {
            dst[p] = effSrc;
          }
        }
      } else {
        final ia = 255 - sa;
        if (fullSa == 255 && len == 1) {
          final d = dst[row];
          dst[row] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
        } else {
          for (var p = row; p < end; p++) {
            final d = dst[p];
            dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
          }
        }
      }
    }
  }

  static int _srcOverWithIa(int s, int d, int ia) {
    final rb0 = (d & 0x00FF00FF) * ia + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((d >> 8) & 0x00FF00FF) * ia + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return s + (rb | ag);
  }

  static void fillLinearGradientSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    _RleSpans spans,
    Uint32List lut1024,
    int opacity255,
    double ia,
    double ib,
    double ic,
    double id,
    double itx,
    double ity,
    double sx,
    double sy,
    double ex,
    double ey,
  ) {
    if (opacity255 == 0 || spans.spanCount == 0) return;
    final gx = ex - sx;
    final gy = ey - sy;
    final lenSq = gx * gx + gy * gy;
    if (lenSq <= 1e-12) {
      var c = lut1024[0];
      if (opacity255 < 255) c = scalePremul255(c, opacity255);
      fillSolidSpans(dst, dstOriginX, dstOriginY, stride, spans, c);
      return;
    }
    final invLenSq = 1.0 / lenSq;
    final dtx = (ia * gx + ib * gy) * invLenSq;
    final count = spans.spanCount * 2;
    final data = spans.data;
    final modulateAlpha = opacity255 < 255;

    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final wy = w0 >>> 16;
      final wx = w0 & 0xFFFF;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final py = wy + 0.5;
      final px = wx + 0.5;
      final lx = ia * px + ic * py + itx;
      final ly = ib * px + id * py + ity;
      var t = ((lx - sx) * gx + (ly - sy) * gy) * invLenSq;
      final row = (wy - dstOriginY) * stride + (wx - dstOriginX);
      final end = row + len;
      if (cov == 256 && !modulateAlpha) {
        for (var p = row; p < end; p++) {
          final clamped = t <= 0.0 ? 0 : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          dst[p] = blendSrcOver(lut1024[clamped], dst[p]);
          t += dtx;
        }
      } else {
        for (var p = row; p < end; p++) {
          final clamped = t <= 0.0 ? 0 : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          var c = lut1024[clamped];
          if (modulateAlpha) c = scalePremul255(c, opacity255);
          if (cov < 256) c = scalePremul(c, cov);
          dst[p] = blendSrcOver(c, dst[p]);
          t += dtx;
        }
      }
    }
  }

  static void fillRadialGradientSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    _RleSpans spans,
    Uint32List lut1024,
    int opacity255,
    double ia,
    double ib,
    double ic,
    double id,
    double itx,
    double ity,
    double sx,
    double sy,
    double ex,
    double ey,
  ) {
    if (opacity255 == 0 || spans.spanCount == 0) return;
    final rx = ex - sx;
    final ry = ey - sy;
    final radius = math.max(0.001, math.sqrt(rx * rx + ry * ry));
    final invRadius = 1.0 / radius;
    // Normalize affine step into unit-radius space so t = sqrt(dSq) directly.
    final nia = ia * invRadius;
    final nib = ib * invRadius;
    final nic = ic * invRadius;
    final nid = id * invRadius;
    final nitx = (itx - sx) * invRadius;
    final nity = (ity - sy) * invRadius;
    final stepSq = nia * nia + nib * nib;
    final step2 = 2.0 * stepSq;
    final count = spans.spanCount * 2;
    final data = spans.data;
    final modulateAlpha = opacity255 < 255;

    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final wy = w0 >>> 16;
      final wx = w0 & 0xFFFF;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final py = wy + 0.5;
      final px = wx + 0.5;
      final dx0 = nia * px + nic * py + nitx;
      final dy0 = nib * px + nid * py + nity;
      // 2nd-order forward differencing of D^2(k) = (dx0 + k*nia)^2 + (dy0 + k*nib)^2.
      var dSq = dx0 * dx0 + dy0 * dy0;
      var step1 = 2.0 * (dx0 * nia + dy0 * nib) + stepSq;
      final row = (wy - dstOriginY) * stride + (wx - dstOriginX);
      final end = row + len;
      var p = row;
      if (cov == 256 && !modulateAlpha) {
        final simdEnd = end - 3;
        while (p < simdEnd) {
          final s0 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s1 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s2 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s3 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final t4 = Float32x4(s0, s1, s2, s3).sqrt();
          final t0 = t4.x, t1 = t4.y, t2 = t4.z, t3 = t4.w;
          final c0 = t0 >= 1.0 ? 1023 : (t0 * 1023.0 + 0.5).toInt();
          final c1 = t1 >= 1.0 ? 1023 : (t1 * 1023.0 + 0.5).toInt();
          final c2 = t2 >= 1.0 ? 1023 : (t2 * 1023.0 + 0.5).toInt();
          final c3 = t3 >= 1.0 ? 1023 : (t3 * 1023.0 + 0.5).toInt();
          dst[p] = blendSrcOver(lut1024[c0], dst[p]);
          dst[p + 1] = blendSrcOver(lut1024[c1], dst[p + 1]);
          dst[p + 2] = blendSrcOver(lut1024[c2], dst[p + 2]);
          dst[p + 3] = blendSrcOver(lut1024[c3], dst[p + 3]);
          p += 4;
        }
        while (p < end) {
          final t = math.sqrt(dSq > 0.0 ? dSq : 0.0);
          final clamped = t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt();
          dst[p] = blendSrcOver(lut1024[clamped], dst[p]);
          dSq += step1;
          step1 += step2;
          p++;
        }
      } else {
        final simdEnd = end - 3;
        while (p < simdEnd) {
          final s0 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s1 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s2 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s3 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final t4 = Float32x4(s0, s1, s2, s3).sqrt();
          final t0 = t4.x, t1 = t4.y, t2 = t4.z, t3 = t4.w;
          var c0 = lut1024[t0 >= 1.0 ? 1023 : (t0 * 1023.0 + 0.5).toInt()];
          var c1 = lut1024[t1 >= 1.0 ? 1023 : (t1 * 1023.0 + 0.5).toInt()];
          var c2 = lut1024[t2 >= 1.0 ? 1023 : (t2 * 1023.0 + 0.5).toInt()];
          var c3 = lut1024[t3 >= 1.0 ? 1023 : (t3 * 1023.0 + 0.5).toInt()];
          if (modulateAlpha) {
            c0 = scalePremul255(c0, opacity255);
            c1 = scalePremul255(c1, opacity255);
            c2 = scalePremul255(c2, opacity255);
            c3 = scalePremul255(c3, opacity255);
          }
          if (cov < 256) {
            c0 = scalePremul(c0, cov);
            c1 = scalePremul(c1, cov);
            c2 = scalePremul(c2, cov);
            c3 = scalePremul(c3, cov);
          }
          dst[p] = blendSrcOver(c0, dst[p]);
          dst[p + 1] = blendSrcOver(c1, dst[p + 1]);
          dst[p + 2] = blendSrcOver(c2, dst[p + 2]);
          dst[p + 3] = blendSrcOver(c3, dst[p + 3]);
          p += 4;
        }
        while (p < end) {
          final t = math.sqrt(dSq > 0.0 ? dSq : 0.0);
          final clamped = t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt();
          var c = lut1024[clamped];
          if (modulateAlpha) c = scalePremul255(c, opacity255);
          if (cov < 256) c = scalePremul(c, cov);
          dst[p] = blendSrcOver(c, dst[p]);
          dSq += step1;
          step1 += step2;
          p++;
        }
      }
    }
  }
}

/// Renders [scene] at [frame] directly into [outBgra8888] (`pixelWidth * pixelHeight`
/// premultiplied BGRA8888 words). Thread/Isolate-safe: uses zero `dart:ui` native calls.
void _renderSceneSoftware(
  _Compiler scene,
  double frame,
  Uint32List outBgra8888,
  int pixelWidth,
  int pixelHeight,
  _RasterWorkspace ws,
) {
  final total = pixelWidth * pixelHeight;
  outBgra8888.fillRange(0, total, 0);
  if (pixelWidth <= 0 || pixelHeight <= 0 || scene.width <= 0 || scene.height <= 0) {
    return;
  }
  final sx = pixelWidth / scene.width;
  final sy = pixelHeight / scene.height;
  _renderCompilerInto(
    scene,
    frame,
    255,
    outBgra8888,
    0,
    0,
    pixelWidth,
    0,
    0,
    pixelWidth,
    pixelHeight,
    sx,
    0.0,
    0.0,
    sy,
    0.0,
    0.0,
    null,
    ws,
    0,
  );
  ws.maybeTrimAfterFrame(total);
}

void _renderCompilerInto(
  _Compiler comp,
  double frame,
  int alpha,
  Uint32List dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  _RleSpans? clipMask,
  _RasterWorkspace ws,
  int depth,
) {
  if (clipX0 >= clipX1 || clipY0 >= clipY1 || alpha <= 0) return;

  final layers = comp.layers;
  for (var i = layers.length - 1; i >= 0; i--) {
    final layer = layers[i];
    if (layer.isMatteSource || !layer.visible(frame)) continue;
    final layerAlpha = layer.effectiveAlpha(frame, alpha);
    if (layerAlpha == 0) continue;

    final matte = layer.matte;
    if (matte == null) {
      _renderLayerInto(
        layer,
        frame,
        alpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ma,
        mb,
        mc,
        md,
        mtx,
        mty,
        clipMask,
        ws,
        depth,
      );
      continue;
    }

    final isDstOut = layer.matteType == 2 || layer.matteType == 4;
    final isLuma = layer.matteType == 3 || layer.matteType == 4;
    final matteAlpha = matte.visible(frame)
        ? matte.effectiveAlpha(frame, alpha)
        : 0;
    if (matteAlpha == 0) {
      if (isDstOut) {
        _renderLayerInto(
          layer,
          frame,
          alpha,
          dst,
          dstOriginX,
          dstOriginY,
          dstStride,
          clipX0,
          clipY0,
          clipX1,
          clipY1,
          ma,
          mb,
          mc,
          md,
          mtx,
          mty,
          clipMask,
          ws,
          depth,
        );
      }
      continue;
    }

    // Tight world-to-device pixel box for target layer (+ 1px padding for AA).
    final targetBounds = layer.worldBounds(frame);
    if (targetBounds == null) continue;
    var tx0 = _transformedMinX(targetBounds, ma, mc, mtx).floor() - 1;
    var ty0 = _transformedMinY(targetBounds, mb, md, mty).floor() - 1;
    var tx1 = _transformedMaxX(targetBounds, ma, mc, mtx).ceil() + 1;
    var ty1 = _transformedMaxY(targetBounds, mb, md, mty).ceil() + 1;
    if (tx0 < clipX0) tx0 = clipX0;
    if (ty0 < clipY0) ty0 = clipY0;
    if (tx1 > clipX1) tx1 = clipX1;
    if (ty1 > clipY1) ty1 = clipY1;
    if (tx0 >= tx1 || ty0 >= ty1) continue;

    final matteBounds = matte.worldBounds(frame);
    var mx0 = clipX0, my0 = clipY0, mx1 = clipX0, my1 = clipY0;
    if (matteBounds != null) {
      mx0 = math.max(tx0, _transformedMinX(matteBounds, ma, mc, mtx).floor() - 1);
      my0 = math.max(ty0, _transformedMinY(matteBounds, mb, md, mty).floor() - 1);
      mx1 = math.min(tx1, _transformedMaxX(matteBounds, ma, mc, mtx).ceil() + 1);
      my1 = math.min(ty1, _transformedMaxY(matteBounds, mb, md, mty).ceil() + 1);
    }
    final overlap = mx0 < mx1 && my0 < my1;
    if (!isDstOut && !overlap) continue;
    if (isDstOut && !overlap) {
      _renderLayerInto(
        layer,
        frame,
        alpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        tx0,
        ty0,
        tx1,
        ty1,
        ma,
        mb,
        mc,
        md,
        mtx,
        mty,
        clipMask,
        ws,
        depth,
      );
      continue;
    }

    // For dstIn: only rasterize target within overlap bbox!
    final bx0 = isDstOut ? tx0 : mx0;
    final by0 = isDstOut ? ty0 : my0;
    final bx1 = isDstOut ? tx1 : mx1;
    final by1 = isDstOut ? ty1 : my1;
    final bw = bx1 - bx0;
    final bh = by1 - by0;
    final boxPixels = bw * bh;

    final layerBuf = ws._acquireScratch(depth * 3, boxPixels);
    layerBuf.fillRange(0, boxPixels, 0);
    _renderLayerInto(
      layer,
      frame,
      alpha,
      layerBuf,
      bx0,
      by0,
      bw,
      bx0,
      by0,
      bx1,
      by1,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
      null,
      ws,
      depth + 1,
    );

    final matteBuf = ws._acquireScratch(depth * 3 + 1, boxPixels);
    matteBuf.fillRange(0, boxPixels, 0);
    _renderLayerInto(
      matte,
      frame,
      alpha,
      matteBuf,
      bx0,
      by0,
      bw,
      mx0,
      my0,
      mx1,
      my1,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
      null,
      ws,
      depth + 1,
    );

    // Composite matte into layerBuf, and blend layerBuf onto dst.
    for (var row = 0; row < bh; row++) {
      final srcRow = row * bw;
      final dstRow = (by0 + row - dstOriginY) * dstStride + (bx0 - dstOriginX);
      for (var col = 0; col < bw; col++) {
        final tPx = layerBuf[srcRow + col];
        if (tPx == 0) continue;
        final mPx = matteBuf[srcRow + col];
        final mAlpha = mPx >>> 24;
        int factor;
        if (!isLuma) {
          factor = isDstOut ? (255 - mAlpha) : mAlpha;
        } else {
          if (mAlpha == 0) {
            factor = isDstOut ? 255 : 0;
          } else {
            var r = (mPx >>> 16) & 0xFF;
            var g = (mPx >>> 8) & 0xFF;
            var b = mPx & 0xFF;
            if (mAlpha != 255) {
              final inv = _SwarBlender._invAlphaLut[mAlpha];
              r = (r * inv) >>> 16;
              g = (g * inv) >>> 16;
              b = (b * inv) >>> 16;
            }
            // Division-free BT.601 integer luminance: 0.299*65536=19595, 0.587*65536=38470, 0.114*65536=7471.
            final lum = ((19595 * r + 38470 * g + 7471 * b) >>> 16).clamp(0, 255);
            factor = isDstOut ? (255 - lum) : lum;
          }
        }
        if (factor == 0) continue;
        final masked = factor == 255 ? tPx : _SwarBlender.scalePremul255(tPx, factor);
        dst[dstRow + col] = _SwarBlender.blendSrcOver(masked, dst[dstRow + col]);
      }
    }
  }
}

double _transformedMinX(Rect r, double ma, double mc, double mtx) =>
    (ma * (ma >= 0 ? r.left : r.right)) + (mc * (mc >= 0 ? r.top : r.bottom)) + mtx;
double _transformedMaxX(Rect r, double ma, double mc, double mtx) =>
    (ma * (ma >= 0 ? r.right : r.left)) + (mc * (mc >= 0 ? r.bottom : r.top)) + mtx;
double _transformedMinY(Rect r, double mb, double md, double mty) =>
    (mb * (mb >= 0 ? r.left : r.right)) + (md * (md >= 0 ? r.top : r.bottom)) + mty;
double _transformedMaxY(Rect r, double mb, double md, double mty) =>
    (mb * (mb >= 0 ? r.right : r.left)) + (md * (md >= 0 ? r.bottom : r.top)) + mty;

void _composeAffine(
  _Transform t,
  double frame,
  double pa,
  double pb,
  double pc,
  double pd,
  double ptx,
  double pty,
  Float64List out,
) {
  if (t.isSpatialIdentity) {
    out[0] = pa;
    out[1] = pb;
    out[2] = pc;
    out[3] = pd;
    out[4] = ptx;
    out[5] = pty;
    return;
  }
  if (t.isTranslationOnly) {
    t._evalTranslation(frame);
    final dx = t._dx, dy = t._dy;
    out[0] = pa;
    out[1] = pb;
    out[2] = pc;
    out[3] = pd;
    out[4] = ptx + pa * dx + pc * dy;
    out[5] = pty + pb * dx + pd * dy;
    return;
  }
  final m = t.matrix(frame);
  final la = m[0], lb = m[1], lc = m[4], ld = m[5], ltx = m[12], lty = m[13];
  out[0] = pa * la + pc * lb;
  out[1] = pb * la + pd * lb;
  out[2] = pa * lc + pc * ld;
  out[3] = pb * lc + pd * ld;
  out[4] = pa * ltx + pc * lty + ptx;
  out[5] = pb * ltx + pd * lty + pty;
}

void _renderLayerInto(
  _Layer layer,
  double frame,
  int parentAlpha,
  Uint32List dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  _RleSpans? clipMask,
  _RasterWorkspace ws,
  int depth,
) {
  if (!layer.visible(frame)) return;
  final alpha = layer.effectiveAlpha(frame, parentAlpha);
  if (alpha == 0) return;

  // Build parent->child transform chain iteratively into affine matrix.
  var ca = ma, cb = mb, cc = mc, cd = md, ctx = mtx, cty = mty;
  if (layer.hasAnySpatialTransform) {
    // Collect ancestors top-down without allocating a list: check depth.
    var chainLen = 0;
    for (_Layer? p = layer; p != null; p = p.parent) {
      chainLen++;
    }
    if (chainLen == 1) {
      final m = ws._stackMatrix(depth);
      _composeAffine(layer.transform, frame, ca, cb, cc, cd, ctx, cty, m);
      ca = m[0]; cb = m[1]; cc = m[2]; cd = m[3]; ctx = m[4]; cty = m[5];
    } else {
      final chain = ws._layerChain;
      while (chain.length < chainLen) {
        chain.add(null);
      }
      var k = chainLen - 1;
      for (_Layer? p = layer; p != null; p = p.parent) {
        chain[k--] = p;
      }
      final m = ws._stackMatrix(depth);
      for (var i = 0; i < chainLen; i++) {
        _composeAffine(chain[i]!.transform, frame, ca, cb, cc, cd, ctx, cty, m);
        chain[i] = null;
        ca = m[0]; cb = m[1]; cc = m[2]; cd = m[3]; ctx = m[4]; cty = m[5];
      }
    }
  }

  final group = layer.group;
  if (group != null) {
    _renderGroupInto(
      group,
      frame,
      alpha,
      dst,
      dstOriginX,
      dstOriginY,
      dstStride,
      clipX0,
      clipY0,
      clipX1,
      clipY1,
      ca,
      cb,
      cc,
      cd,
      ctx,
      cty,
      clipMask,
      ws,
      depth + 1,
    );
  }

  final child = layer.child;
  if (child != null) {
    final childFrame = layer.timeRemap != null
        ? layer.timeRemap!.scalar(frame) * child.fps - child.start
        : (frame - layer.offset) / layer.stretch;
    final cw = child.width, ch = child.height;
    // Axis-aligned clip rect when no rotation/skew (cb == 0 && cc == 0), else precomp scratch.
    if (cb.abs() < 1e-9 && cc.abs() < 1e-9) {
      final x0 = (ctx + (ca >= 0 ? 0.0 : ca * cw)).floor();
      final x1 = (ctx + (ca >= 0 ? ca * cw : 0.0)).ceil();
      final y0 = (cty + (cd >= 0 ? 0.0 : cd * ch)).floor();
      final y1 = (cty + (cd >= 0 ? cd * ch : 0.0)).ceil();
      final nx0 = math.max(clipX0, x0);
      final ny0 = math.max(clipY0, y0);
      final nx1 = math.min(clipX1, x1);
      final ny1 = math.min(clipY1, y1);
      if (nx0 < nx1 && ny0 < ny1) {
        _renderCompilerInto(
          child,
          childFrame,
          alpha,
          dst,
          dstOriginX,
          dstOriginY,
          dstStride,
          nx0,
          ny0,
          nx1,
          ny1,
          ca,
          cb,
          cc,
          cd,
          ctx,
          cty,
          clipMask,
          ws,
          depth + 1,
        );
      }
    } else {
      // Rotated/skewed precomp clip quad via bounded scratch buffer masked by clip quad RLE.
      final rx0 = math.max(clipX0, _transformedMinX(Rect.fromLTWH(0, 0, cw, ch), ca, cc, ctx).floor() - 1);
      final ry0 = math.max(clipY0, _transformedMinY(Rect.fromLTWH(0, 0, cw, ch), cb, cd, cty).floor() - 1);
      final rx1 = math.min(clipX1, _transformedMaxX(Rect.fromLTWH(0, 0, cw, ch), ca, cc, ctx).ceil() + 1);
      final ry1 = math.min(clipY1, _transformedMaxY(Rect.fromLTWH(0, 0, cw, ch), cb, cd, cty).ceil() + 1);
      if (rx0 < rx1 && ry0 < ry1) {
        final bw = rx1 - rx0, bh = ry1 - ry0;
        final preBuf = ws._acquireScratch(depth * 3 + 2, bw * bh);
        preBuf.fillRange(0, bw * bh, 0);
        _renderCompilerInto(
          child,
          childFrame,
          alpha,
          preBuf,
          rx0,
          ry0,
          bw,
          rx0,
          ry0,
          rx1,
          ry1,
          ca,
          cb,
          cc,
          cd,
          ctx,
          cty,
          null,
          ws,
          depth + 1,
        );
        // Rasterize transformed precomp clip rect into ws._clipSpans.
        ws._polyPath
          ..clear()
          ..beginContour(true)
          ..addVertex(ctx, cty)
          ..addVertex(ca * cw + ctx, cb * cw + cty)
          ..addVertex(ca * cw + cc * ch + ctx, cb * cw + cd * ch + cty)
          ..addVertex(cc * ch + ctx, cd * ch + cty)
          ..endContour();
        ws._scanline.rasterizePolyPath(ws._polyPath, false, ws._clipSpans, rx0, ry0, rx1, ry1);
        final count = ws._clipSpans.spanCount * 2;
        final sdata = ws._clipSpans.data;
        for (var k = 0; k < count; k += 2) {
          final w0 = sdata[k], w1 = sdata[k + 1];
          final y = w0 >>> 16, x = w0 & 0xFFFF, len = w1 >>> 8, cov = (w1 & 0xFF) + 1;
          final sRow = (y - ry0) * bw + (x - rx0);
          final dRow = (y - dstOriginY) * dstStride + (x - dstOriginX);
          for (var c = 0; c < len; c++) {
            final p = preBuf[sRow + c];
            if (p != 0) {
              final scaled = cov == 256 ? p : _SwarBlender.scalePremul(p, cov);
              dst[dRow + c] = _SwarBlender.blendSrcOver(scaled, dst[dRow + c]);
            }
          }
        }
      }
    }
  }
}

void _renderGroupInto(
  _Group group,
  double frame,
  int alpha,
  Uint32List dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  _RleSpans? clipMask,
  _RasterWorkspace ws,
  int depth,
) {
  final nextAlpha = (alpha * group.transform.opacity.scalar(frame).round() / 100)
      .round()
      .clamp(0, 255);
  if (nextAlpha == 0) return;

  final m = ws._stackMatrix(depth);
  _composeAffine(group.transform, frame, ma, mb, mc, md, mtx, mty, m);
  final ga = m[0], gb = m[1], gc = m[2], gd = m[3], gtx = m[4], gty = m[5];

  final draws = group.draws;
  for (var i = draws.length - 1; i >= 0; i--) {
    final d = draws[i];
    if (d is _Group) {
      _renderGroupInto(
        d,
        frame,
        nextAlpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ga,
        gb,
        gc,
        gd,
        gtx,
        gty,
        clipMask,
        ws,
        depth + 1,
      );
    } else if (d is _Style) {
      _renderStyleInto(
        d,
        frame,
        nextAlpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ga,
        gb,
        gc,
        gd,
        gtx,
        gty,
        clipMask,
        ws,
      );
    }
  }
}

void _renderStyleInto(
  _Style style,
  double frame,
  int alpha,
  Uint32List dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  _RleSpans? clipMask,
  _RasterWorkspace ws,
) {
  final a = (alpha * style.opacity.scalar(frame).round() / 100).round().clamp(0, 255);
  if (a == 0) return;
  double strokeWidth = 0;
  if (style.stroke) {
    strokeWidth = style.width.scalar(frame);
    if (strokeWidth <= 0) return;
  }

  // Early bounding-box clip culling before Bézier flattening, dash, or stroke expansion.
  final localBounds = style.drawBounds(frame);
  if (localBounds == null) return;
  final bx0 = _transformedMinX(localBounds, ma, mc, mtx).floor() - 2;
  final by0 = _transformedMinY(localBounds, mb, md, mty).floor() - 2;
  final bx1 = _transformedMaxX(localBounds, ma, mc, mtx).ceil() + 2;
  final by1 = _transformedMaxY(localBounds, mb, md, mty).ceil() + 2;
  final effClipX0 = math.max(clipX0, bx0);
  final effClipY0 = math.max(clipY0, by0);
  final effClipX1 = math.min(clipX1, bx1);
  final effClipY1 = math.min(clipY1, by1);
  if (effClipX0 >= effClipX1 || effClipY0 >= effClipY1) return;

  // Determine screen-aware curve flatness tolerance in local units.
  final scaleX = math.sqrt(ma * ma + mb * mb);
  final scaleY = math.sqrt(mc * mc + md * md);
  final maxScale = math.max(scaleX, scaleY);
  final localFlatness = maxScale <= 1e-6 ? 0.25 : (0.25 / maxScale).clamp(0.005, 1.5);
  final flatnessSq = localFlatness * localFlatness;

  // Build local polyline path (or transformed polyline path).
  final targetPoly = ws._polyPath..clear();
  final sources = style.sources;
  for (var i = sources.length - 1; i >= 0; i--) {
    _appendSourceLocal(
      sources[i],
      frame,
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      flatnessSq,
      targetPoly,
      ws,
    );
  }
  if (targetPoly.contourCount == 0) return;

  _PolyPath finalLocalPoly = targetPoly;
  final dash = style.dash;
  if (dash != null) {
    final dashed = ws._workPolyA..clear();
    _applyDash(targetPoly, dash, frame, dashed, ws._cumLengths);
    finalLocalPoly = dashed;
    if (finalLocalPoly.contourCount == 0) return;
  }

  if (style.stroke) {
    final expanded = ws._strokePoly..clear();
    _expandStroke(
      finalLocalPoly,
      strokeWidth * 0.5,
      style.cap,
      style.join,
      style.miter,
      localFlatness,
      expanded,
      ws._strokeScratch,
    );
    finalLocalPoly = expanded;
    if (finalLocalPoly.contourCount == 0) return;
  }

  // Transform final local contour to device pixel coordinates and rasterize.
  final devicePoly = ws._workPolyB..clear();
  devicePoly.appendTransformed(finalLocalPoly, ma, mb, mc, md, mtx, mty);

  final evenOdd = !style.stroke && style.evenOdd;
  ws._scanline.rasterizePolyPath(
    devicePoly,
    evenOdd,
    ws._spans,
    effClipX0,
    effClipY0,
    effClipX1,
    effClipY1,
  );
  var spans = ws._spans;
  if (clipMask != null) {
    _RleSpans.intersect(spans, clipMask, ws._intersectSpans);
    spans = ws._intersectSpans;
  }
  if (spans.spanCount == 0) return;

  final grad = style.gradient;
  if (grad == null) {
    final c = style.color.at(frame);
    final r = (c[0] * 255).round().clamp(0, 255);
    final g = (c[1] * 255).round().clamp(0, 255);
    final b = (c[2] * 255).round().clamp(0, 255);
    final premul = _SwarBlender.premulBgra(a, r, g, b);
    _SwarBlender.fillSolidSpans(dst, dstOriginX, dstOriginY, dstStride, spans, premul);
  } else {
    final det = ma * md - mb * mc;
    if (det.abs() <= 1e-12) return;
    final invDet = 1.0 / det;
    final ia = md * invDet;
    final ib = -mb * invDet;
    final ic = -mc * invDet;
    final id = ma * invDet;
    final itx = (mc * mty - md * mtx) * invDet;
    final ity = (mb * mtx - ma * mty) * invDet;
    final lut = _evalGradientLut(grad, frame, ws);
    final s = grad.start.at(frame);
    final e = grad.end.at(frame);
    if (grad.radial) {
      _SwarBlender.fillRadialGradientSpans(
        dst, dstOriginX, dstOriginY, dstStride, spans, lut, a,
        ia, ib, ic, id, itx, ity, s[0], s[1], e[0], e[1],
      );
    } else {
      _SwarBlender.fillLinearGradientSpans(
        dst, dstOriginX, dstOriginY, dstStride, spans, lut, a,
        ia, ib, ic, id, itx, ity, s[0], s[1], e[0], e[1],
      );
    }
  }
}

Uint32List _evalGradientLut(_GradientSpec grad, double frame, _RasterWorkspace ws) {
  if (grad.isStatic) {
    final cached = ws.staticGradientLuts[grad];
    if (cached != null) return cached;
    if (ws.staticGradientLuts.length >= _RasterWorkspace.maxStaticLuts) {
      ws.staticGradientLuts.clear();
    }
    final lut = ws.staticGradientLuts[grad] = Uint32List(1024);
    _fillGradientLut(grad, frame, lut);
    return lut;
  }
  _fillGradientLut(grad, frame, ws.scratchGradientLut);
  return ws.scratchGradientLut;
}

void _fillGradientLut(_GradientSpec grad, double frame, Uint32List lut) {

  final values = grad.stops.at(frame);
  final count = grad.count;
  final rgb = grad._rgb;
  for (var i = 0; i < count; i++) {
    final base = 4 * i;
    final outBase = 3 * i;
    rgb[outBase] = _Track.linearToSrgb(values[base + 1]);
    rgb[outBase + 1] = _Track.linearToSrgb(values[base + 2]);
    rgb[outBase + 2] = _Track.linearToSrgb(values[base + 3]);
  }
  var left = 0;
  for (var k = 0; k < 1024; k++) {
    final p = k / 1023.0;
    while (left < count - 1 && values[(left + 1) * 4] <= p) {
      left++;
    }
    final prev = math.max(0, left - (p < values[left * 4] ? 1 : 0));
    final right = math.min(count - 1, prev + 1);
    final pL = values[prev * 4];
    final pR = values[right * 4];
    final span = pR - pL;
    final t = span <= 1e-12 ? 0.0 : ((p - pL) / span).clamp(0.0, 1.0);
    final l3 = prev * 3;
    final r3 = right * 3;
    final rf = (rgb[l3] + (rgb[r3] - rgb[l3]) * t) * 255.0;
    final gf = (rgb[l3 + 1] + (rgb[r3 + 1] - rgb[l3 + 1]) * t) * 255.0;
    final bf = (rgb[l3 + 2] + (rgb[r3 + 2] - rgb[l3 + 2]) * t) * 255.0;
    final af = grad._alphaAt(values, p) * 255.0;
    lut[k] = _SwarBlender.premulBgra(
      af.round().clamp(0, 255),
      rf.round().clamp(0, 255),
      gf.round().clamp(0, 255),
      bf.round().clamp(0, 255),
    );
  }
}

void _appendSourceLocal(
  _PathSource src,
  double frame,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  double flatnessSq,
  _PolyPath out,
  _RasterWorkspace ws, [
  int trimDepth = 0,
  int groupDepth = 0,
]) {
  final effectiveFlatSq = () {
    final scale = math.max(math.sqrt(ma * ma + mb * mb), math.sqrt(mc * mc + md * md));
    return scale <= 1e-6 ? flatnessSq : flatnessSq / (scale * scale);
  }();

  if (src is _Shape) {
    _appendSourceLocal(
      src.content,
      frame,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
      flatnessSq,
      out,
      ws,
      trimDepth,
      groupDepth,
    );
    return;
  }
  if (src is _Group) {
    var ga = ma, gb = mb, gc = mc, gd = md, gtx = mtx, gty = mty;
    if (!src.transform.isSpatialIdentity) {
      final m = ws._groupMatrix(groupDepth);
      _composeAffine(src.transform, frame, ma, mb, mc, md, mtx, mty, m);
      ga = m[0]; gb = m[1]; gc = m[2]; gd = m[3]; gtx = m[4]; gty = m[5];
    }
    for (var i = src.sources.length - 1; i >= 0; i--) {
      _appendSourceLocal(
        src.sources[i],
        frame,
        ga,
        gb,
        gc,
        gd,
        gtx,
        gty,
        flatnessSq,
        out,
        ws,
        trimDepth,
        groupDepth + 1,
      );
    }
    return;
  }
  if (src is _TrimPart) {
    final trimmed = _evalTrimPart(
      src.trim,
      src.index,
      frame,
      effectiveFlatSq,
      ws,
      trimDepth,
      groupDepth,
    );
    if (trimmed != null && trimmed.contourCount > 0) {
      out.appendTransformed(trimmed, ma, mb, mc, md, mtx, mty);
    }
    return;
  }

  if (src.isPathStatic) {
    var cached = ws.staticPaths[src];
    if (cached == null) {
      if (ws.staticPaths.length >= _RasterWorkspace.maxStaticPaths) {
        ws.staticPaths.clear();
      }
      final local = ws._flattenLeafPoly..clear();
      _flattenLeaf(src, frame, 0.01, local);
      cached = ws.staticPaths[src] = local.cloneImmutable();
    }
    out.appendTransformed(cached, ma, mb, mc, md, mtx, mty);
    return;
  }

  final isIdentity = ma == 1.0 && mb == 0.0 && mc == 0.0 && md == 1.0 && mtx == 0.0 && mty == 0.0;
  if (isIdentity) {
    _flattenLeaf(src, frame, effectiveFlatSq, out);
  } else {
    final local = ws._flattenLeafPoly..clear();
    _flattenLeaf(src, frame, effectiveFlatSq, local);
    out.appendTransformed(local, ma, mb, mc, md, mtx, mty);
  }
}

void _flattenLeaf(_PathSource src, double frame, double flatnessSq, _PolyPath out) {
  if (src is _BezierGeometry) {
    final pts = src.track.at(frame);
    final count = pts.length ~/ 6;
    if (count == 0) return;
    var closed = src.closed;
    var closingCurve = src.closed;
    if (src.closures.isNotEmpty) {
      if (frame <= src.track.keyframes!.times.first) {
        closed = closingCurve = src.closures.first.$1;
      } else if (frame >= src.track.keyframes!.times.last) {
        closed = closingCurve = src.closures.last.$1;
      } else {
        final (startClosed, endClosed) = src.closures[src.track._cursor];
        closed = startClosed;
        closingCurve = startClosed && endClosed;
      }
    }
    out.beginContour(closed);
    out.addVertex(pts[0], pts[1]);
    var lx = pts[0], ly = pts[1];
    final limit = closingCurve ? count : count - 1;
    for (var step = 1; step <= limit; step++) {
      final prev = step - 1;
      final curr = step % count;
      final p = prev * 6, c = curr * 6;
      final ox = pts[p + 4], oy = pts[p + 5];
      final ix = pts[c + 2], iy = pts[c + 3];
      final nx = pts[c], ny = pts[c + 1];
      if (ox == 0 && oy == 0 && ix == 0 && iy == 0) {
        out.addVertex(nx, ny);
      } else {
        out.addCubic(lx, ly, pts[p] + ox, pts[p + 1] + oy, nx + ix, ny + iy, nx, ny, flatnessSq);
      }
      lx = nx;
      ly = ny;
    }
    out.endContour();
    return;
  }
  if (src is _Primitive) {
    final p = src.position.at(frame);
    final s = src.size.at(frame);
    final x = p[0], y = p[1], w = s[0] * 0.5, h = s[1] * 0.5;
    const k = .5522847498307936;
    if (src.ellipse) {
      final kw = w * k, kh = h * k;
      out.beginContour(true);
      out.addVertex(x, y - h);
      if (!src.reverse) {
        out.addCubic(x, y - h, x + kw, y - h, x + w, y - kh, x + w, y, flatnessSq);
        out.addCubic(x + w, y, x + w, y + kh, x + kw, y + h, x, y + h, flatnessSq);
        out.addCubic(x, y + h, x - kw, y + h, x - w, y + kh, x - w, y, flatnessSq);
        out.addCubic(x - w, y, x - w, y - kh, x - kw, y - h, x, y - h, flatnessSq);
      } else {
        out.addCubic(x, y - h, x - kw, y - h, x - w, y - kh, x - w, y, flatnessSq);
        out.addCubic(x - w, y, x - w, y + kh, x - kw, y + h, x, y + h, flatnessSq);
        out.addCubic(x, y + h, x + kw, y + h, x + w, y + kh, x + w, y, flatnessSq);
        out.addCubic(x + w, y, x + w, y - kh, x + kw, y - h, x, y - h, flatnessSq);
      }
      out.endContour();
      return;
    }
    final r = src.radius.scalar(frame).clamp(0.0, math.min(w.abs(), h.abs()));
    if (r == 0) {
      out.beginContour(true);
      out.addVertex(x + w, y - h);
      if (!src.reverse) {
        out.addVertex(x + w, y + h);
        out.addVertex(x - w, y + h);
        out.addVertex(x - w, y - h);
      } else {
        out.addVertex(x - w, y - h);
        out.addVertex(x - w, y + h);
        out.addVertex(x + w, y + h);
      }
      out.endContour();
      return;
    }
    final rk = r * k;
    out.beginContour(true);
    out.addVertex(x + w, y - h + r);
    if (!src.reverse) {
      out.addVertex(x + w, y + h - r);
      out.addCubic(x + w, y + h - r, x + w, y + h - r + rk, x + w - r + rk, y + h, x + w - r, y + h, flatnessSq);
      out.addVertex(x - w + r, y + h);
      out.addCubic(x - w + r, y + h, x - w + r - rk, y + h, x - w, y + h - r + rk, x - w, y + h - r, flatnessSq);
      out.addVertex(x - w, y - h + r);
      out.addCubic(x - w, y - h + r, x - w, y - h + r - rk, x - w + r - rk, y - h, x - w + r, y - h, flatnessSq);
      out.addVertex(x + w - r, y - h);
      out.addCubic(x + w - r, y - h, x + w - r + rk, y - h, x + w, y - h + r - rk, x + w, y - h + r, flatnessSq);
    } else {
      out.addCubic(x + w, y - h + r, x + w, y - h + r - rk, x + w - r + rk, y - h, x + w - r, y - h, flatnessSq);
      out.addVertex(x - w + r, y - h);
      out.addCubic(x - w + r, y - h, x - w + r - rk, y - h, x - w, y - h + r - rk, x - w, y - h + r, flatnessSq);
      out.addVertex(x - w, y + h - r);
      out.addCubic(x - w, y + h - r, x - w, y + h - r + rk, x - w + r - rk, y + h, x - w + r, y + h, flatnessSq);
      out.addVertex(x + w - r, y + h);
      out.addCubic(x + w - r, y + h, x + w - r + rk, y + h, x + w, y + h - r + rk, x + w, y + h - r, flatnessSq);
    }
    out.endContour();
  }
}

_PolyPath? _evalTrimPart(
  _Trim trim,
  int index,
  double frame,
  double flatnessSq,
  _RasterWorkspace ws,
  int trimDepth,
  int groupDepth,
) {
  final count = trim.inputs.length;
  if (index < 0 || index >= count) return null;
  final a = trim.start.scalar(frame).clamp(0.0, 100.0) / 100.0;
  final b = trim.end.scalar(frame).clamp(0.0, 100.0) / 100.0;
  final span = (b - a).abs();
  if (span < 1e-6) return null;

  final input = trim.inputs[index];
  final inputPoly = ws._acquireTrimPoly(trimDepth);
  _appendSourceLocal(
    input,
    frame,
    1,
    0,
    0,
    1,
    0,
    0,
    flatnessSq,
    inputPoly,
    ws,
    trimDepth + 1,
    groupDepth,
  );
  if (span >= 1.0 - 1e-6) return inputPoly;

  final from = (math.min(a, b) + trim.offset.scalar(frame) / 360.0) % 1.0;
  final to = from + span;

  // Measure inputs.
  final lens = ws._acquireTrimLengths(trimDepth, count);
  var total = 0.0;
  var origin = 0.0;
  for (var i = 0; i < count; i++) {
    final len = _measureSourceLength(
      trim.inputs[i],
      frame,
      flatnessSq,
      ws,
      i == index ? inputPoly : null,
      trimDepth + 1,
      groupDepth,
    );
    lens[i] = len;
    if (i < index) origin += len;
    total += len;
  }
  final length = trim.individual ? total : lens[index];
  final effOrigin = trim.individual ? origin : 0.0;

  final out = ws._acquireTrimOut(trimDepth);
  _extractTrimPoly(
    inputPoly,
    from * length - effOrigin,
    math.min(to, 1.0) * length - effOrigin,
    out,
    ws._cumLengths,
  );
  if (to > 1.0) {
    _extractTrimPoly(
      inputPoly,
      -effOrigin,
      (to - 1.0) * length - effOrigin,
      out,
      ws._cumLengths,
    );
  }
  return out;
}

double _hypot(double dx, double dy) => math.sqrt(dx * dx + dy * dy);

double _measureSourceLength(
  _PathSource src,
  double frame,
  double flatnessSq,
  _RasterWorkspace ws,
  _PolyPath? alreadyFlattened,
  int trimDepth,
  int groupDepth,
) {
  if (src.isPathStatic) {
    final cached = ws.staticTrimMetrics[src];
    if (cached != null) return cached;
  }
  late final _PolyPath poly;
  if (alreadyFlattened != null) {
    poly = alreadyFlattened;
  } else {
    poly = ws._acquireMeasurePoly(trimDepth);
    _appendSourceLocal(
      src,
      frame,
      1,
      0,
      0,
      1,
      0,
      0,
      flatnessSq,
      poly,
      ws,
      trimDepth,
      groupDepth,
    );
  }
  var total = 0.0;
  for (var k = 0; k < poly.contourCount; k++) {
    final s = poly.contourStart[k], e = poly.contourEnd[k];
    if (e - s < 2) continue;
    for (var i = s + 1; i < e; i++) {
      total += _hypot(poly.vx[i] - poly.vx[i - 1], poly.vy[i] - poly.vy[i - 1]);
    }
    if (poly.contourClosed[k] == 1) {
      total += _hypot(poly.vx[s] - poly.vx[e - 1], poly.vy[s] - poly.vy[e - 1]);
    }
  }
  if (src.isPathStatic) {
    if (ws.staticTrimMetrics.length >= _RasterWorkspace.maxStaticMetrics) {
      ws.staticTrimMetrics.clear();
    }
    ws.staticTrimMetrics[src] = total;
  }
  return total;
}

void _extractTrimPoly(
  _PolyPath src,
  double fromDist,
  double toDist,
  _PolyPath out,
  _Float64Scratch cumScratch,
) {
  var pos = 0.0;
  for (var k = 0; k < src.contourCount; k++) {
    final start = src.contourStart[k];
    final end = src.contourEnd[k];
    final count = end - start;
    if (count < 2) continue;
    final closed = src.contourClosed[k] == 1;
    final segCount = closed ? count : count - 1;
    final cum = cumScratch.ensure(segCount + 1);
    cum[0] = 0.0;
    for (var s = 0; s < segCount; s++) {
      final i0 = start + s;
      final i1 = start + ((s + 1) % count);
      cum[s + 1] = cum[s] + _hypot(src.vx[i1] - src.vx[i0], src.vy[i1] - src.vy[i0]);
    }
    final mLen = cum[segCount];
    final a = math.max(0.0, fromDist - pos);
    final b = math.min(mLen, toDist - pos);
    if (b > a + 1e-7) {
      if (closed && a <= 1e-7 && b >= mLen - 1e-7) {
        out.beginContour(true);
        for (var i = start; i < end; i++) {
          out.addVertex(src.vx[i], src.vy[i]);
        }
        out.endContour();
      } else {
        _extractSubsegment(src, start, count, closed, cum, segCount, a, b, out);
      }
    }
    pos += mLen;
    if (pos >= toDist) break;
  }
}

void _extractSubsegment(
  _PolyPath src,
  int start,
  int count,
  bool closed,
  Float64List cum,
  int segCount,
  double d0,
  double d1,
  _PolyPath out,
) {
  // Binary search start segment.
  var lo = 0, hi = segCount - 1;
  while (lo < hi) {
    final mid = (lo + hi) >> 1;
    if (cum[mid + 1] <= d0) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  out.beginContour(false);
  var s = lo;
  // Emit start point.
  final i0 = start + s;
  final i1 = start + ((s + 1) % count);
  final segLen0 = cum[s + 1] - cum[s];
  final t0 = segLen0 <= 1e-12 ? 0.0 : (d0 - cum[s]) / segLen0;
  out.addVertex(
    src.vx[i0] + (src.vx[i1] - src.vx[i0]) * t0,
    src.vy[i0] + (src.vy[i1] - src.vy[i0]) * t0,
  );
  // Emit interior vertices and final point.
  while (s < segCount) {
    final endD = cum[s + 1];
    final p0 = start + s;
    final p1 = start + ((s + 1) % count);
    if (d1 <= endD + 1e-9) {
      final sl = endD - cum[s];
      final t1 = sl <= 1e-12 ? 0.0 : ((d1 - cum[s]) / sl).clamp(0.0, 1.0);
      out.addVertex(
        src.vx[p0] + (src.vx[p1] - src.vx[p0]) * t1,
        src.vy[p0] + (src.vy[p1] - src.vy[p0]) * t1,
      );
      break;
    }
    out.addVertex(src.vx[p1], src.vy[p1]);
    s++;
  }
  out.endContour();
}

void _applyDash(
  _PolyPath src,
  _Dash dash,
  double frame,
  _PolyPath dst,
  _Float64Scratch cumScratch,
) {
  final count = dash.intervals.length;
  final values = dash._values;
  var cycle = 0.0;
  for (var i = 0; i < count; i++) {
    final v = math.max(i.isEven ? 1.0 : .1, dash.intervals[i].scalar(frame));
    values[i] = v;
    cycle += v;
  }
  if (cycle <= 0) return;
  final phase = dash.offset.scalar(frame) % cycle;
  var first = 0;
  var consumed = phase;
  while (consumed >= values[first] && first < count - 1) {
    consumed -= values[first++];
  }

  for (var k = 0; k < src.contourCount; k++) {
    final start = src.contourStart[k];
    final end = src.contourEnd[k];
    final ptsCount = end - start;
    if (ptsCount < 2) continue;
    final closed = src.contourClosed[k] == 1;
    final segCount = closed ? ptsCount : ptsCount - 1;
    final cum = cumScratch.ensure(segCount + 1);
    cum[0] = 0.0;
    for (var s = 0; s < segCount; s++) {
      final i0 = start + s;
      final i1 = start + ((s + 1) % ptsCount);
      cum[s + 1] = cum[s] + _hypot(src.vx[i1] - src.vx[i0], src.vy[i1] - src.vy[i0]);
    }
    final mLen = cum[segCount];
    if (mLen <= 1e-7) continue;

    var index = first;
    var distance = 0.0;
    var remaining = values[first] - consumed;
    while (distance < mLen - 1e-7) {
      final segEnd = math.min(mLen, distance + remaining);
      if (index.isEven && segEnd > distance + 1e-7) {
        _extractSubsegment(src, start, ptsCount, closed, cum, segCount, distance, segEnd, dst);
      }
      distance = segEnd;
      index = (index + 1) % count;
      remaining = values[index];
    }
  }
}

/// One growable SoA scratch set per worker. Contours are expanded sequentially,
/// so neither point buffers nor tangent buffers need to survive the call.
class _StrokeScratch {
  final _Float64Scratch x = _Float64Scratch();
  final _Float64Scratch y = _Float64Scratch();
  final _Float64Scratch tx = _Float64Scratch();
  final _Float64Scratch ty = _Float64Scratch();

  void trimIfOversized() {
    x.trimIfOversized();
    y.trimIfOversized();
    tx.trimIfOversized();
    ty.trimIfOversized();
  }
}

void _expandStroke(
  _PolyPath src,
  double hw,
  int cap,
  int join,
  double miterLimit,
  double flatness,
  _PolyPath dst,
  _StrokeScratch scratch,
) {
  if (hw <= 0) return;
  final miterSq = miterLimit * miterLimit;
  final sagittaTol = math.max(0.12, flatness * 0.5);

  // Trigonometry-free recursive unit-normal bisection for round joins and caps.
  // Bisects the arc from unit normal (nx0, ny0) to (nx1, ny1) (< 180 degrees)
  // around (cx, cy) with radius hw without calling atan2, acos, cos, or sin.
  void addNormalArc(
    double cx,
    double cy,
    double nx0,
    double ny0,
    double nx1,
    double ny1,
    int depth,
  ) {
    var mx = nx0 + nx1;
    var my = ny0 + ny1;
    final lenSq = mx * mx + my * my;
    if (lenSq > 1e-12 && depth < 5) {
      final invLen = 1.0 / math.sqrt(lenSq);
      mx *= invLen;
      my *= invLen;
      final sagitta = hw * (1.0 - (nx0 * mx + ny0 * my));
      if (depth < 2 || sagitta > sagittaTol) {
        addNormalArc(cx, cy, nx0, ny0, mx, my, depth + 1);
        dst.addVertex(cx + hw * mx, cy + hw * my);
        addNormalArc(cx, cy, mx, my, nx1, ny1, depth + 1);
        return;
      }
    }
    if (depth == 0) {
      dst.addVertex(cx + hw * nx1, cy + hw * ny1);
    }
  }

  void emitNormalArc(
    double cx,
    double cy,
    double nx0,
    double ny0,
    double nx1,
    double ny1,
  ) {
    addNormalArc(cx, cy, nx0, ny0, nx1, ny1, 0);
    dst.addVertex(cx + hw * nx1, cy + hw * ny1);
  }

  for (var k = 0; k < src.contourCount; k++) {
    final start = src.contourStart[k];
    final end = src.contourEnd[k];
    final nPts = end - start;
    if (nPts <= 0) continue;
    final closed = src.contourClosed[k] == 1;

    // Compact adjacent duplicate vertices into reusable typed columns.
    final ptsX = scratch.x.ensure(nPts);
    final ptsY = scratch.y.ensure(nPts);
    var n = 0;
    for (var i = start; i < end; i++) {
      final px = src.vx[i], py = src.vy[i];
      if (n == 0 || (px - ptsX[n - 1]).abs() + (py - ptsY[n - 1]).abs() >= 1e-6) {
        ptsX[n] = px;
        ptsY[n++] = py;
      }
    }
    if (closed && n > 1 &&
        (ptsX[0] - ptsX[n - 1]).abs() + (ptsY[0] - ptsY[n - 1]).abs() < 1e-6) {
      n--;
    }
    if (n == 0) continue;
    if (n == 1) {
      final cx = ptsX[0], cy = ptsY[0];
      if (cap == 2) {
        // Round dot via 4 quadrant normal-bisection arcs (zero trig calls).
        dst.beginContour(true);
        dst.addVertex(cx + hw, cy);
        emitNormalArc(cx, cy, 1.0, 0.0, 0.0, 1.0);
        emitNormalArc(cx, cy, 0.0, 1.0, -1.0, 0.0);
        emitNormalArc(cx, cy, -1.0, 0.0, 0.0, -1.0);
        emitNormalArc(cx, cy, 0.0, -1.0, 1.0, 0.0);
        dst.endContour();
      } else if (cap == 3) {
        dst.beginContour(true);
        dst.addVertex(cx - hw, cy - hw);
        dst.addVertex(cx + hw, cy - hw);
        dst.addVertex(cx + hw, cy + hw);
        dst.addVertex(cx - hw, cy + hw);
        dst.endContour();
      }
      continue;
    }

    final segCount = closed ? n : n - 1;
    final tx = scratch.tx.ensure(segCount);
    final ty = scratch.ty.ensure(segCount);
    for (var s = 0; s < segCount; s++) {
      final sNext = (s + 1) % n;
      final dx = ptsX[sNext] - ptsX[s];
      final dy = ptsY[sNext] - ptsY[s];
      final len = _hypot(dx, dy);
      if (len > 1e-9) {
        final utx = dx / len, uty = dy / len;
        tx[s] = utx;
        ty[s] = uty;
      } else {
        tx[s] = 0;
        ty[s] = 0;
      }
    }

    void addJoin(int s0, int s1, double vx, double vy, bool reversed) {
      final sign = reversed ? -1.0 : 1.0;
      final u0x = tx[s0] * sign, u0y = ty[s0] * sign;
      final u1x = tx[s1] * sign, u1y = ty[s1] * sign;
      // Right-hand normal of (ux, uy) in Y-down coordinates: (-uy, ux) = N * sign.
      final n0x = -u0y, n0y = u0x;
      final n1x = -u1y, n1y = u1x;
      final dot = u0x * u1x + u0y * u1y;
      final cross = u0x * u1y - u0y * u1x;

      final oaX = vx + hw * n0x, oaY = vy + hw * n0y;
      final obX = vx + hw * n1x, obY = vy + hw * n1y;

      if (cross.abs() < 1e-4 && dot > 0) {
        dst.addVertex((oaX + obX) * 0.5, (oaY + obY) * 0.5);
        return;
      }

      // Outer bend on the right-hand side occurs when turning counter-clockwise (cross < 0).
      if (cross >= 0) {
        // Inner crease: route cleanly through joint center so NonZero fill has zero notch.
        dst.addVertex(oaX, oaY);
        dst.addVertex(vx, vy);
        dst.addVertex(obX, obY);
        return;
      }

      if (join == 1 && (1.0 + dot) > 1e-6 && 2.0 <= miterSq * (1.0 + dot)) {
        final scale = hw / (1.0 + dot);
        dst.addVertex(vx + (n0x + n1x) * scale, vy + (n0y + n1y) * scale);
      } else if (join == 2) {
        dst.addVertex(oaX, oaY);
        if (dot < -0.999) {
          // Near-180 degree U-turn: split into two 90-degree normal arcs via tangent u0.
          emitNormalArc(vx, vy, n0x, n0y, u0x, u0y);
          emitNormalArc(vx, vy, u0x, u0y, n1x, n1y);
        } else {
          emitNormalArc(vx, vy, n0x, n0y, n1x, n1y);
        }
      } else {
        dst.addVertex(oaX, oaY);
        dst.addVertex(obX, obY);
      }
    }

    if (closed) {
      // Closed contour: outer (+N forward) + inner (-N reversed) contours.
      dst.beginContour(true);
      for (var v = 0; v < n; v++) {
        final prevSeg = (v - 1 + segCount) % segCount;
        final nextSeg = v;
        addJoin(prevSeg, nextSeg, ptsX[v], ptsY[v], false);
      }
      dst.endContour();

      dst.beginContour(true);
      for (var v = n - 1; v >= 0; v--) {
        final nextSeg = (v - 1 + segCount) % segCount;
        final prevSeg = v;
        addJoin(prevSeg, nextSeg, ptsX[v], ptsY[v], true);
      }
      dst.endContour();
    } else {
      // Open contour: +N forward side -> end cap -> -N reverse side -> start cap.
      dst.beginContour(true);
      // Start point on +N side.
      final s0x = ptsX[0] + hw * (-ty[0]), s0y = ptsY[0] + hw * tx[0];
      if (cap == 3) {
        dst.addVertex(s0x - hw * tx[0], s0y - hw * ty[0]);
      } else {
        dst.addVertex(s0x, s0y);
      }
      // Interior joins forward.
      for (var v = 1; v < n - 1; v++) {
        addJoin(v - 1, v, ptsX[v], ptsY[v], false);
      }
      // End cap at vertex n-1.
      final lastS = segCount - 1;
      final ex = ptsX[n - 1], ey = ptsY[n - 1];
      final utxLast = tx[lastS], utyLast = ty[lastS];
      final ePlusX = ex + hw * (-utyLast), ePlusY = ey + hw * utxLast;
      final eMinusX = ex - hw * (-utyLast), eMinusY = ey - hw * utxLast;
      if (cap == 3) {
        dst.addVertex(ePlusX + hw * utxLast, ePlusY + hw * utyLast);
        dst.addVertex(eMinusX + hw * utxLast, eMinusY + hw * utyLast);
      } else if (cap == 2) {
        dst.addVertex(ePlusX, ePlusY);
        // Round semicircle via two quarter-turn normal bisections through tip.
        emitNormalArc(ex, ey, -utyLast, utxLast, utxLast, utyLast);
        emitNormalArc(ex, ey, utxLast, utyLast, utyLast, -utxLast);
      } else {
        dst.addVertex(ePlusX, ePlusY);
        dst.addVertex(eMinusX, eMinusY);
      }
      // Interior joins backward on -N side.
      for (var v = n - 2; v >= 1; v--) {
        addJoin(v, v - 1, ptsX[v], ptsY[v], true);
      }
      // Start cap at vertex 0.
      final sx = ptsX[0], sy = ptsY[0];
      final utx0 = tx[0], uty0 = ty[0];
      final sMinusX = sx - hw * (-uty0), sMinusY = sy - hw * utx0;
      if (cap == 3) {
        dst.addVertex(sMinusX - hw * utx0, sMinusY - hw * uty0);
      } else if (cap == 2) {
        dst.addVertex(sMinusX, sMinusY);
        emitNormalArc(sx, sy, uty0, -utx0, -utx0, -uty0);
        emitNormalArc(sx, sy, -utx0, -uty0, -uty0, utx0);
      } else {
        dst.addVertex(sMinusX, sMinusY);
      }
      dst.endContour();
    }
  }
}

/// Deterministic content key for a compiled composition across isolates/sessions/web.
String _computeCompositionContentKey(_Compiler c) {
  final seen = Map<_Compiler, (int, int, int, int)>.identity();
  final (h1, h2, h3, h4) = _ContentKeyHasher.hash(c, seen);
  String hex32(int v) => (v & 0xFFFFFFFF).toRadixString(16).padLeft(8, '0');
  return '${hex32(h1)}${hex32(h2)}${hex32(h3)}${hex32(h4)}';
}

final class _ContentKeyHasher {
  _ContentKeyHasher(this._seen);

  final Map<_Compiler, (int, int, int, int)> _seen;
  final ByteData _floatBuf = ByteData(8);
  int _h1 = 0x811C9DC5;
  int _h2 = 0x9E3779B9;
  int _h3 = 0x85EBCA6B;
  int _h4 = 0xC2B2AE35;

  static (int, int, int, int) hash(
    _Compiler c,
    Map<_Compiler, (int, int, int, int)> seen,
  ) {
    final cached = seen[c];
    if (cached != null) return cached;
    final hasher = _ContentKeyHasher(seen);
    hasher._mixCompiler(c);
    final digest = (hasher._h1, hasher._h2, hasher._h3, hasher._h4);
    seen[c] = digest;
    return digest;
  }

  static int _mul32(int a, int b) {
    final lo = (a & 0xFFFF) * b;
    final hi = ((a >>> 16) * b) & 0xFFFF;
    return (lo + (hi << 16)) & 0xFFFFFFFF;
  }

  void _mixInt(int v) {
    final x = v & 0xFFFFFFFF;
    _h1 = _mul32(_h1 ^ x, 0x01000193);
    _h2 = _mul32((_h2 + x) & 0xFFFFFFFF, 0x85EBCA6B);
    _h2 ^= _h2 >>> 16;
    _h3 = _mul32(_h3 ^ x, 0xC2B2AE35);
    _h3 ^= _h3 >>> 13;
    _h4 = _mul32((_h4 + _h1 + x) & 0xFFFFFFFF, 0x27D4EB2F);
  }

  void _mixDouble(double d) {
    _floatBuf.setFloat64(0, d == 0.0 ? 0.0 : d, Endian.little);
    _mixInt(_floatBuf.getUint32(0, Endian.little));
    _mixInt(_floatBuf.getUint32(4, Endian.little));
  }

  void _mixTrack(_Track t) {
    _mixInt(t.gamma ? 1 : 0);
    final cnst = t.constant;
    if (cnst != null) {
      _mixInt(cnst.length);
      for (var i = 0; i < cnst.length; i++) {
        _mixDouble(cnst[i]);
      }
      return;
    }
    final data = t.keyframes!;
    _mixInt(data.count);
    final values = data.values;
    final controls = data.easing;
    for (var key = 0; key < data.count; key++) {
      _mixDouble(data.times[key]);
      _mixInt(data.isHold(key) ? 1 : 0);
      _mixInt(data.width);
      final start = key * data.stride;
      for (var i = 0; i < data.width; i++) {
        _mixDouble(values[start + i]);
      }
      if (data.hasEnd(key)) {
        _mixInt(data.width);
        final end = data.endOffset(key);
        for (var i = 0; i < data.width; i++) {
          _mixDouble(values[end + i]);
        }
      }
      final easeCount = data.easeCount(key);
      _mixInt(easeCount);
      final easeStart = data.easeOffset(key);
      for (var i = easeStart; i < easeStart + 4 * easeCount; i++) {
        _mixDouble(controls[i]);
      }
      if (data.hasTangents(key)) {
        for (var i = 0; i < 4; i++) {
          _mixDouble(data.tangents![key * 4 + i]);
        }
      }
    }
  }

  void _mixTransform(_Transform t) {
    _mixTrack(t.anchor);
    _mixTrack(t.position);
    _mixTrack(t.scale);
    _mixTrack(t.rotation);
    _mixTrack(t.opacity);
    if (t.x != null) _mixTrack(t.x!);
    if (t.y != null) _mixTrack(t.y!);
    if (t.skew != null) _mixTrack(t.skew!);
    if (t.skewAxis != null) _mixTrack(t.skewAxis!);
  }

  void _mixSource(_PathSource s) {
    if (s is _Shape) {
      _mixSource(s.content);
    } else if (s is _BezierGeometry) {
      _mixInt(s.closed ? 1 : 2);
      _mixInt(s.closures.length);
      for (final cl in s.closures) {
        _mixInt((cl.$1 ? 1 : 0) | (cl.$2 ? 2 : 0));
      }
      _mixTrack(s.track);
    } else if (s is _Primitive) {
      _mixInt(s.ellipse ? 3 : 4);
      _mixInt(s.reverse ? 1 : 0);
      _mixTrack(s.position);
      _mixTrack(s.size);
      _mixTrack(s.radius);
    } else if (s is _TrimPart) {
      _mixInt(5 + s.index);
      _mixTrack(s.trim.start);
      _mixTrack(s.trim.end);
      _mixTrack(s.trim.offset);
      _mixInt(s.trim.individual ? 1 : 0);
    } else if (s is _Group) {
      _mixInt(6);
      _mixTransform(s.transform);
      for (final sub in s.sources) {
        _mixSource(sub);
      }
    }
  }

  void _mixDraw(_Draw d) {
    if (d is _Group) {
      _mixInt(7);
      _mixTransform(d.transform);
      for (final sub in d.draws) {
        _mixDraw(sub);
      }
    } else if (d is _Style) {
      _mixInt(8);
      _mixInt((d.stroke ? 1 : 0) | (d.evenOdd ? 2 : 0) | (d.cap << 4) | (d.join << 8));
      _mixDouble(d.miter);
      _mixTrack(d.color);
      _mixTrack(d.opacity);
      _mixTrack(d.width);
      for (final s in d.sources) {
        _mixSource(s);
      }
      final g = d.gradient;
      if (g != null) {
        _mixInt(g.count);
        _mixInt(g.radial ? 1 : 0);
        _mixTrack(g.stops);
        _mixTrack(g.start);
        _mixTrack(g.end);
      }
      final dash = d.dash;
      if (dash != null) {
        _mixTrack(dash.offset);
        for (final iv in dash.intervals) {
          _mixTrack(iv);
        }
      }
    }
  }

  void _mixCompiler(_Compiler comp) {
    _mixDouble(comp.width);
    _mixDouble(comp.height);
    _mixDouble(comp.start);
    _mixDouble(comp.end);
    _mixDouble(comp.fps);
    _mixInt(comp.layers.length);
    for (final l in comp.layers) {
      _mixDouble(l.ip);
      _mixDouble(l.op);
      _mixDouble(l.offset);
      _mixInt((l.hidden ? 1 : 0) | (l.matteType << 2));
      _mixTransform(l.transform);
      final g = l.group;
      if (g != null) _mixDraw(g);
      final ch = l.child;
      if (ch != null) {
        final (c1, c2, c3, c4) = _ContentKeyHasher.hash(ch, _seen);
        _mixInt(c1);
        _mixInt(c2);
        _mixInt(c3);
        _mixInt(c4);
      }
    }
  }
}

/// Renders a single [composition] [frame] using the pure-Dart FreeType scanline RLE
/// software rasterizer into a premultiplied BGRA8888 pixel buffer `[w * h * 4]`
/// compatible with [ui.PixelFormat.bgra8888].
@visibleForTesting
Uint8List debugRenderSoftwareFrame(
  FastLottieComposition composition,
  double frame, {
  required int pixelWidth,
  required int pixelHeight,
}) {
  final ws = _RasterWorkspace(initialWidth: pixelWidth, initialHeight: pixelHeight);
  final scene = _Fork().scene(composition._template);
  final pixels = Uint32List(pixelWidth * pixelHeight);
  _renderSceneSoftware(scene, frame, pixels, pixelWidth, pixelHeight, ws);
  return pixels.buffer.asUint8List();
}
