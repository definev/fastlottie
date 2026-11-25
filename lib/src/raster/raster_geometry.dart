import 'dart:math' as math;
import 'dart:typed_data';

class Float64Scratch {
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
class PolyPath {
  static const int defaultVertices = 512;
  static const int defaultContours = 32;
  static const int softMaxVertices = 8192;
  static const int softMaxContours = 512;

  PolyPath({
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

  /// Whether a native kernel can write a fresh set of contours.
  bool get isEmpty => vertexCount == 0 && contourCount == 0 && !_inContour;

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

  PolyPath cloneImmutable() {
    final copy = PolyPath(
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

  /// Ensures capacity before a kernel borrows the coordinate columns.
  void ensureVertexCapacity(int minimum) {
    while (vx.length < minimum) {
      _growVertices();
    }
  }

  void _growVertices() {
    final nextCap = vx.length * 2;
    final nx = Float64List(nextCap)..setRange(0, vertexCount, vx);
    final ny = Float64List(nextCap)..setRange(0, vertexCount, vy);
    vx = nx;
    vy = ny;
  }

  void ensureContourCapacity(int minimum) {
    while (contourStart.length < minimum) {
      _growContours();
    }
  }

  void _growContours() {
    final nextCap = contourStart.length * 2;
    contourStart = Int32List(nextCap)..setRange(0, contourCount, contourStart);
    contourEnd = Int32List(nextCap)..setRange(0, contourCount, contourEnd);
    contourClosed = Uint8List(nextCap)
      ..setRange(0, contourCount, contourClosed);
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
    final dx1 = 3.0 * x1 - (2.0 * x0 + x3);
    final dy1 = 3.0 * y1 - (2.0 * y0 + y3);
    final dx2 = 3.0 * x2 - (x0 + 2.0 * x3);
    final dy2 = 3.0 * y2 - (y0 + 2.0 * y3);
    final d1 = dx1 * dx1 + dy1 * dy1;
    final d2 = dx2 * dx2 + dy2 * dy2;
    if (d1 * 0.0625 <= flatnessSq && d2 * 0.0625 <= flatnessSq) {
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

  void appendTransformed(
    PolyPath src,
    double a,
    double b,
    double c,
    double d,
    double tx,
    double ty,
  ) {
    final srcContours = src.contourCount;
    if (srcContours == 0 || src.vertexCount == 0) return;
    ensureVertexCapacity(vertexCount + src.vertexCount);
    ensureContourCapacity(contourCount + srcContours);
    final dstX = vx, dstY = vy;
    final srcX = src.vx, srcY = src.vy;
    final srcStarts = src.contourStart, srcEnds = src.contourEnd;
    final srcClosed = src.contourClosed;
    final isScaleTranslate = b == 0.0 && c == 0.0;
    final isIdentity =
        isScaleTranslate && a == 1.0 && d == 1.0 && tx == 0.0 && ty == 0.0;
    for (var k = 0; k < srcContours; k++) {
      final start = srcStarts[k];
      final end = srcEnds[k];
      final len = end - start;
      if (len <= 0) continue;
      beginContour(srcClosed[k] == 1);
      var dstIdx = vertexCount;
      if (isIdentity) {
        dstX.setRange(dstIdx, dstIdx + len, srcX, start);
        dstY.setRange(dstIdx, dstIdx + len, srcY, start);
        dstIdx += len;
      } else if (isScaleTranslate) {
        for (var i = start; i < end; i++) {
          dstX[dstIdx] = a * srcX[i] + tx;
          dstY[dstIdx] = d * srcY[i] + ty;
          dstIdx++;
        }
      } else {
        for (var i = start; i < end; i++) {
          final sx = srcX[i], sy = srcY[i];
          dstX[dstIdx] = a * sx + c * sy + tx;
          dstY[dstIdx] = b * sx + d * sy + ty;
          dstIdx++;
        }
      }
      vertexCount = dstIdx;
      endContour();
    }
  }

  void appendReversed(PolyPath src) {
    final srcContours = src.contourCount;
    if (srcContours == 0 || src.vertexCount == 0) return;
    ensureVertexCapacity(vertexCount + src.vertexCount);
    ensureContourCapacity(contourCount + srcContours);
    final dstX = vx, dstY = vy;
    final srcX = src.vx, srcY = src.vy;
    final srcStarts = src.contourStart, srcEnds = src.contourEnd;
    final srcClosed = src.contourClosed;
    for (var k = 0; k < srcContours; k++) {
      final start = srcStarts[k];
      final end = srcEnds[k];
      if (end <= start) continue;
      beginContour(srcClosed[k] == 1);
      var dstIdx = vertexCount;
      for (var i = end - 1; i >= start; i--) {
        dstX[dstIdx] = srcX[i];
        dstY[dstIdx] = srcY[i];
        dstIdx++;
      }
      vertexCount = dstIdx;
      endContour();
    }
  }
}
