import 'dart:math' as math;
import 'dart:typed_data';

import '../platform/simd_stub.dart'
    if (dart.library.ffi) '../platform/simd_io.dart'
    if (dart.library.js_interop) '../platform/simd_wasm.dart'
    show NativeSpansBuffer;
import 'raster_geometry.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');
const _isWasm = bool.fromEnvironment('dart.tool.dart2wasm');
const _isJs = _isWeb && !_isWasm;

/// Compact packed RLE span list:
/// word0 = (y << 16) | x
/// word1 = (len << 8) | (coverage - 1), with coverage in 1..256.
class RleSpans {
  static const int defaultSpans = 1024;
  static const int softMaxSpans = 16384;

  RleSpans({int initialSpans = defaultSpans})
    : _buf = NativeSpansBuffer(initialSpans * 2);

  NativeSpansBuffer _buf;
  NativeSpansBuffer get buffer => _buf;
  Int32List get data => _buf.typedList;
  int spanCount = 0;
  int minX = 0x7FFFFFFF;
  int minY = 0x7FFFFFFF;
  int maxX = 0;
  int maxY = 0;

  void dispose() {
    _buf.dispose();
  }

  void clear() {
    spanCount = 0;
    minX = 0x7FFFFFFF;
    minY = 0x7FFFFFFF;
    maxX = 0;
    maxY = 0;
  }

  void swap(RleSpans other) {
    final (oldBuf, oldSpanCount, oldMinX, oldMinY, oldMaxX, oldMaxY) = (
      _buf,
      spanCount,
      minX,
      minY,
      maxX,
      maxY,
    );
    _buf = other._buf;
    other._buf = oldBuf;
    spanCount = other.spanCount;
    other.spanCount = oldSpanCount;
    minX = other.minX;
    other.minX = oldMinX;
    minY = other.minY;
    other.minY = oldMinY;
    maxX = other.maxX;
    other.maxX = oldMaxX;
    maxY = other.maxY;
    other.maxY = oldMaxY;
  }

  void trimIfOversized({bool aggressive = false}) {
    clear();
    final limitWords = (aggressive ? defaultSpans : softMaxSpans) * 2;
    if (_buf.typedList.length > limitWords) {
      _buf.reallocate(defaultSpans * 2, 0);
    }
  }

  void _grow() {
    _buf.reallocate(_buf.typedList.length * 2, spanCount * 2);
  }

  RleSpans copy() =>
      RleSpans(initialSpans: math.max(1, spanCount))..copyFrom(this);

  void copyFrom(RleSpans source) {
    final words = source.spanCount * 2;
    if (data.length < words) _buf.reallocate(words, 0);
    data.setRange(0, words, source.data);
    spanCount = source.spanCount;
    minX = source.minX;
    minY = source.minY;
    maxX = source.maxX;
    maxY = source.maxY;
  }

  // True when growing the output may have invalidated other Wasm views.
  bool addSpan(int y, int x, int len, int cov) {
    if (len <= 0 || cov <= 0) return false;
    if (cov > 256) cov = 256;
    final packedCov = cov - 1;
    final d = _buf.typedList;
    // Merge adjacent horizontal span on same scanline with identical coverage.
    if (spanCount > 0) {
      final lastIdx = (spanCount - 1) * 2;
      final w0 = d[lastIdx];
      final ly = w0 >>> 16;
      if (ly == y) {
        final w1 = d[lastIdx + 1];
        if ((w1 & 0xFF) == packedCov) {
          final lx = w0 & 0xFFFF;
          final llen = w1 >>> 8;
          if (lx + llen == x) {
            d[lastIdx + 1] = ((llen + len) << 8) | packedCov;
            final x2 = x + len;
            if (x2 > maxX) maxX = x2;
            return false;
          }
        }
      }
    }
    final idx = spanCount * 2;
    final grow = idx + 2 > d.length;
    if (grow) _grow();
    final target = _buf.typedList;
    target[idx] = (y << 16) | (x & 0xFFFF);
    target[idx + 1] = (len << 8) | packedCov;
    spanCount++;
    if (x < minX) minX = x;
    if (x + len > maxX) maxX = x + len;
    if (y < minY) minY = y;
    if (y + 1 > maxY) maxY = y + 1;
    return grow;
  }

  void scaleCoverage(int opacity) {
    if (opacity == 0) {
      clear();
      return;
    }
    final d = data;
    var write = 0;
    for (var read = 0; read < spanCount * 2; read += 2) {
      final w = d[read + 1];
      final coverage = (((w & 255) + 1) * opacity + 128) >> 8;
      if (coverage == 0) continue;
      d[write++] = d[read];
      d[write++] = (w & ~255) | (coverage - 1);
    }
    spanCount = write ~/ 2;
  }

  bool overlaps(RleSpans other) =>
      minX < other.maxX &&
      other.minX < maxX &&
      minY < other.maxY &&
      other.minY < maxY;

  /// Combine two coverage masks by sweeping their span boundaries.
  /// Even wide opaque interiors take one step.
  static void combine(RleSpans a, RleSpans b, RleSpans out, int mode) {
    if (mode == 4) {
      intersect(a, b, out);
      return;
    }
    out.clear();
    var da = a.data, db = b.data;
    final na = a.spanCount * 2, nb = b.spanCount * 2;
    var ia = 0, ib = 0;
    while (ia < na || ib < nb) {
      final wa = ia < na ? da[ia] : 0;
      final wb = ib < nb ? db[ib] : 0;
      final ay = ia < na ? wa >>> 16 : 0x10000;
      final by = ib < nb ? wb >>> 16 : 0x10000;
      final y = math.min(ay, by);
      var ax = ay == y ? wa & 65535 : 0x10000;
      var bx = by == y ? wb & 65535 : 0x10000;
      var x = math.min(ax, bx);
      while (x < 0x10000) {
        var ac = 0, bc = 0;
        int end;
        if (ax <= x) {
          final w = da[ia + 1];
          ac = (w & 255) + 1;
          end = ax + (w >>> 8);
        } else {
          end = ax;
        }
        if (bx <= x) {
          final w = db[ib + 1];
          bc = (w & 255) + 1;
          end = math.min(end, bx + (w >>> 8));
        } else {
          end = math.min(end, bx);
        }
        final overlap = (ac * bc + 128) >> 8;
        final coverage = switch (mode) {
          2 => ac + bc - overlap,
          3 => ac - overlap,
          _ => ac + bc - 2 * overlap,
        };
        if (out.addSpan(y, x, end - x, coverage)) {
          da = a.data;
          db = b.data;
        }
        if (ac != 0 && ax + (da[ia + 1] >>> 8) == end) {
          ia += 2;
          final w = ia < na ? da[ia] : 0;
          ax = ia < na && w >>> 16 == y ? w & 65535 : 0x10000;
        }
        if (bc != 0 && bx + (db[ib + 1] >>> 8) == end) {
          ib += 2;
          final w = ib < nb ? db[ib] : 0;
          bx = ib < nb && w >>> 16 == y ? w & 65535 : 0x10000;
        }
        x = ac != 0 || bc != 0 ? end : math.min(ax, bx);
        if (ax == 0x10000 && bx == 0x10000) break;
      }
    }
  }

  /// Intersects [a] and [clip] sorted RLE spans into [out], multiplying coverage.
  static void intersect(RleSpans a, RleSpans clip, RleSpans out) {
    out.clear();
    if (a.spanCount == 0 || clip.spanCount == 0) return;
    if (!a.overlaps(clip)) return;
    var ia = 0;
    var ic = 0;
    final na = a.spanCount * 2;
    final nc = clip.spanCount * 2;
    var da = a.data;
    var dc = clip.data;
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
        if (cov > 0 && out.addSpan(ay, x0, x1 - x0, cov)) {
          da = a.data;
          dc = clip.data;
        }
      }
      if (axEnd <= cxEnd) ia += 2;
      if (cxEnd <= axEnd) ic += 2;
    }
  }
}

/// FreeType-derived integer fixed-point (256 subpixels/pixel) scanline gray rasterizer.
class FtScanlineRasterizer {
  FtScanlineRasterizer(int initialHeight)
    : _initialRows = math.max(64, initialHeight),
      _rowHead = Int32List(math.max(64, initialHeight))
        ..fillRange(0, math.max(64, initialHeight), -1);

  static const int _coordLimit = 1 << 20; // +/- 1,048,576 px
  static const double _coordLimitD = 1048576.0;
  static const int _defaultCells = 8192;
  static const int _softMaxCells = 32768;
  static const int _softMaxRows = 2048;
  static const int _maxDenseCells = 262144;
  static const int _softDenseCells = 256 * 256;

  static const int _debruijn64 = (0x03F79D71 << 32) | 0xB4CB0A89;
  static final Uint8List _ctz64 = () {
    final t = Uint8List(64);
    for (var bit = 0; bit < 64; bit++) {
      t[((1 << bit) * _debruijn64) >>> 58] = bit;
    }
    return t;
  }();
  static final Uint64List _zeroUsedChunk = Uint64List(2048);

  final int _initialRows;
  Int32List _rowHead;
  Int32List _cellX = Int32List(_defaultCells);
  Int32List _cellCover = Int32List(_defaultCells);
  Int32List _cellArea = Int32List(_defaultCells);
  Int32List _cellNext = Int32List(_defaultCells);
  int _cellCount = 0;

  // Direct-indexed dense cell plane + 64-bit sparse row bitset (same model as
  // native FLDense) used for clips <= 262,144 cells on native Dart VM.
  // Kept nullable so Web/JS (which lacks Uint64List) never instantiates it.
  Int32List _denseCells = Int32List(0);
  Uint64List? _denseUsed;
  int _denseW = 0;
  int _denseWords = 0;
  int _denseUsedDirtyLen = 0;
  bool _denseNeedsClear = false;
  Uint32List? _cachedDst;
  Int32x4List? _cachedDst4;
  Uint64List? _cachedDst64;

  void trimIfOversized({bool aggressive = false}) {
    _cellCount = 0;
    _valid = false;
    _dirtyMaxY = -1;
    _dirtyMinY = 0;
    _cachedDst = null;
    _cachedDst4 = null;
    _cachedDst64 = null;
    final rowCap = aggressive
        ? _initialRows
        : math.max(_initialRows, _softMaxRows);
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
    final denseLimit = aggressive ? 0 : _softDenseCells;
    if (_denseCells.length > denseLimit * 2) {
      _denseCells = Int32List(0);
      _denseUsed = null;
      _denseUsedDirtyLen = 0;
      _denseNeedsClear = false;
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
    if (_isJs) {
      _minBoundX = clipX0 * 256;
      _minBoundY = clipY0 * 256;
      _maxBoundX = clipX1 * 256;
      _maxBoundY = clipY1 * 256;
    } else {
      _minBoundX = clipX0 << 8;
      _minBoundY = clipY0 << 8;
      _maxBoundX = clipX1 << 8;
      _maxBoundY = clipY1 << 8;
    }
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

  static int _toFixed(double v) {
    if (v >= -_coordLimitD && v <= _coordLimitD) {
      return (v * 256.0).round();
    }
    if (!v.isFinite) return 0;
    return v > 0 ? (_coordLimit << 8) : -(_coordLimit << 8);
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

  void rasterizePolyPath(
    PolyPath path,
    bool evenOdd,
    RleSpans out,
    int clipX0,
    int clipY0,
    int clipX1,
    int clipY1,
  ) {
    out.clear();
    if (clipX0 >= clipX1 || clipY0 >= clipY1 || path.contourCount == 0) return;
    if (!_isJs &&
        clipX0 >= 0 &&
        clipY0 >= 0 &&
        clipX1 <= 65535 &&
        clipY1 <= 65535 &&
        (clipX1 - clipX0) * (clipY1 - clipY0) <= _maxDenseCells) {
      _rasterizeDenseToSpans(
        path,
        evenOdd,
        out,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
      );
      return;
    }
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

  /// Fused dense scanline rasterization + solid premultiplied BGRA8888 fill
  /// without allocating or round-tripping through [RleSpans]. Returns `true`
  /// when handled directly; returns `false` when the caller should fall back.
  bool rasterizePolyPathSolid(
    PolyPath path,
    bool evenOdd,
    int clipX0,
    int clipY0,
    int clipX1,
    int clipY1,
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int dstStride,
    int srcPremul,
  ) {
    if (srcPremul == 0 ||
        clipX0 >= clipX1 ||
        clipY0 >= clipY1 ||
        path.contourCount == 0) {
      return true;
    }
    if (_isJs ||
        clipX0 < 0 ||
        clipY0 < 0 ||
        clipX1 > 65535 ||
        clipY1 > 65535 ||
        (clipX1 - clipX0) * (clipY1 - clipY0) > _maxDenseCells) {
      return false;
    }
    _prepareDense(clipX0, clipY0, clipX1, clipY1);
    _rasterizeDenseEdges(path);
    _sweepDenseSolid(
      evenOdd,
      dst,
      dstOriginX,
      dstOriginY,
      dstStride,
      srcPremul,
    );
    return true;
  }

  void _prepareDense(int clipX0, int clipY0, int clipX1, int clipY1) {
    final w = clipX1 - clipX0;
    final h = clipY1 - clipY0;
    final words = (w + 63) >>> 6;
    final needCells = w * h * 2;
    final needUsed = words * h;
    if (_denseCells.length < needCells) {
      var cap = _denseCells.isEmpty ? 4096 * 2 : _denseCells.length;
      while (cap < needCells) {
        cap *= 2;
      }
      if (cap > _maxDenseCells * 2) cap = _maxDenseCells * 2;
      _denseCells = Int32List(cap);
    }
    var used = _denseUsed;
    if (used == null || used.length < needUsed) {
      var cap = (used == null || used.isEmpty) ? 128 : used.length;
      while (cap < needUsed) {
        cap *= 2;
      }
      _denseUsed = Uint64List(cap);
      _denseUsedDirtyLen = 0;
      _denseNeedsClear = false;
    } else if (_denseNeedsClear) {
      final clearEnd = _denseUsedDirtyLen < used.length
          ? _denseUsedDirtyLen
          : used.length;
      var off = 0;
      while (off < clearEnd) {
        final end = off + _zeroUsedChunk.length;
        used.setRange(off, end < clearEnd ? end : clearEnd, _zeroUsedChunk);
        off = end;
      }
      _denseNeedsClear = false;
    }
    _minEx = clipX0;
    _minEy = clipY0;
    _maxEx = clipX1;
    _maxEy = clipY1;
    _minBoundX = clipX0 << 8;
    _minBoundY = clipY0 << 8;
    _maxBoundX = clipX1 << 8;
    _maxBoundY = clipY1 << 8;
    _denseW = w;
    _denseWords = words;
    _denseUsedDirtyLen = needUsed;
    _dirtyMinY = clipY1;
    _dirtyMaxY = clipY0 - 1;
    _denseNeedsClear = true;
  }

  void _rasterizeDenseEdges(PolyPath path) {
    final vx = path.vx;
    final vy = path.vy;
    final starts = path.contourStart;
    final ends = path.contourEnd;
    final contours = path.contourCount;
    for (var k = 0; k < contours; k++) {
      final start = starts[k];
      final end = ends[k];
      if (end - start < 2) continue;
      final sx = _toFixed(vx[start]);
      final sy = _toFixed(vy[start]);
      var ax = sx;
      var ay = sy;
      for (var i = start + 1; i < end; i++) {
        final bx = _toFixed(vx[i]);
        final by = _toFixed(vy[i]);
        _edgeDense(ax, ay, bx, by);
        ax = bx;
        ay = by;
      }
      _edgeDense(ax, ay, sx, sy);
    }
  }

  static void _markCellAt(
    Uint64List used,
    Int32List cells,
    int rowWordBase,
    int rowCellBase,
    int i,
    int f1,
    int f2,
    int d,
  ) {
    if (d == 0) return;
    final wordIdx = rowWordBase + (i >>> 6);
    final bit = 1 << (i & 63);
    final cellIdx = rowCellBase + (i << 1);
    final area = (f1 + f2) * d;
    final w = used[wordIdx];
    if ((w & bit) != 0) {
      cells[cellIdx] += d;
      cells[cellIdx + 1] += area;
    } else {
      used[wordIdx] = w | bit;
      cells[cellIdx] = d;
      cells[cellIdx + 1] = area;
    }
  }

  void _rowDense(int ey, int x1, int y1, int x2, int y2) {
    final delta = y2 - y1;
    if (delta == 0 || ey < _minEy || ey >= _maxEy) return;
    var ex1 = x1 >> 8;
    final ex2 = x2 >> 8;
    final minEx = _minEx;
    final maxEx = _maxEx;
    final j = ey - _minEy;
    final rowWordBase = j * _denseWords;
    final rowCellBase = (j * _denseW) << 1;
    final used = _denseUsed!;
    final cells = _denseCells;

    if (ex1 == ex2) {
      if (ex1 >= maxEx) return;
      if (ey < _dirtyMinY) _dirtyMinY = ey;
      if (ey > _dirtyMaxY) _dirtyMaxY = ey;
      if (ex1 < minEx) {
        _markCellAt(used, cells, rowWordBase, rowCellBase, 0, 0, 0, delta);
      } else {
        _markCellAt(
          used,
          cells,
          rowWordBase,
          rowCellBase,
          ex1 - minEx,
          x1 - (ex1 << 8),
          x2 - (ex1 << 8),
          delta,
        );
      }
      return;
    }
    final dx = x2 - x1;
    var curFx = x1 - (ex1 << 8);
    var curFy = y1;
    if (x2 > x1) {
      if (ex1 >= maxEx) return;
      if (ey < _dirtyMinY) _dirtyMinY = ey;
      if (ey > _dirtyMaxY) _dirtyMaxY = ey;
      if (ex1 < minEx) {
        if (ex2 < minEx) {
          _markCellAt(used, cells, rowWordBase, rowCellBase, 0, 0, 0, delta);
          return;
        }
        final crossFy = y1 + ((_minBoundX - x1) * delta) ~/ dx;
        _markCellAt(
          used,
          cells,
          rowWordBase,
          rowCellBase,
          0,
          0,
          0,
          crossFy - curFy,
        );
        curFy = crossFy;
        ex1 = minEx;
        curFx = 0;
      }
      final limit = ex2 < maxEx ? ex2 : maxEx;
      if (limit - ex1 >= 5) {
        final absDelta = delta < 0 ? -delta : delta;
        final sign = delta < 0 ? -1 : 1;
        final firstNum = (((ex1 + 1) << 8) - x1) * absDelta;
        final stepNum = absDelta << 8;
        var q = firstNum ~/ dx;
        var rem = firstNum - q * dx;
        final stepQ = stepNum ~/ dx;
        final stepR = stepNum - stepQ * dx;
        while (ex1 < limit) {
          final nextFy = y1 + sign * q;
          _markCellAt(
            used,
            cells,
            rowWordBase,
            rowCellBase,
            ex1 - minEx,
            curFx,
            256,
            nextFy - curFy,
          );
          q += stepQ;
          rem += stepR;
          if (rem >= dx) {
            rem -= dx;
            q++;
          }
          curFy = nextFy;
          curFx = 0;
          ex1++;
        }
      } else {
        while (ex1 < limit) {
          final nextX = (ex1 + 1) << 8;
          final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
          _markCellAt(
            used,
            cells,
            rowWordBase,
            rowCellBase,
            ex1 - minEx,
            curFx,
            256,
            nextFy - curFy,
          );
          curFy = nextFy;
          curFx = 0;
          ex1++;
        }
      }
      if (ex1 < maxEx) {
        _markCellAt(
          used,
          cells,
          rowWordBase,
          rowCellBase,
          ex1 - minEx,
          curFx,
          x2 - (ex2 << 8),
          y2 - curFy,
        );
      }
    } else {
      if (ex2 >= maxEx) return;
      if (ey < _dirtyMinY) _dirtyMinY = ey;
      if (ey > _dirtyMaxY) _dirtyMaxY = ey;
      if (ex1 >= maxEx) {
        curFy = y1 + ((_maxBoundX - x1) * delta) ~/ dx;
        ex1 = maxEx - 1;
        curFx = 256;
      }
      final limit = ex2 > minEx - 1 ? ex2 : minEx - 1;
      if (ex1 - limit >= 5) {
        final absDx = -dx;
        final absDelta = delta < 0 ? -delta : delta;
        final sign = delta < 0 ? -1 : 1;
        final firstNum = (x1 - (ex1 << 8)) * absDelta;
        final stepNum = absDelta << 8;
        var q = firstNum ~/ absDx;
        var rem = firstNum - q * absDx;
        final stepQ = stepNum ~/ absDx;
        final stepR = stepNum - stepQ * absDx;
        while (ex1 > limit) {
          final nextFy = y1 + sign * q;
          _markCellAt(
            used,
            cells,
            rowWordBase,
            rowCellBase,
            ex1 - minEx,
            curFx,
            0,
            nextFy - curFy,
          );
          q += stepQ;
          rem += stepR;
          if (rem >= absDx) {
            rem -= absDx;
            q++;
          }
          curFy = nextFy;
          curFx = 256;
          ex1--;
        }
      } else {
        while (ex1 > limit) {
          final nextX = ex1 << 8;
          final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
          _markCellAt(
            used,
            cells,
            rowWordBase,
            rowCellBase,
            ex1 - minEx,
            curFx,
            0,
            nextFy - curFy,
          );
          curFy = nextFy;
          curFx = 256;
          ex1--;
        }
      }
      if (ex1 < minEx) {
        _markCellAt(used, cells, rowWordBase, rowCellBase, 0, 0, 0, y2 - curFy);
      } else {
        _markCellAt(
          used,
          cells,
          rowWordBase,
          rowCellBase,
          ex1 - minEx,
          curFx,
          x2 - (ex2 << 8),
          y2 - curFy,
        );
      }
    }
  }

  void _edgeDense(int x1, int y1, int x2, int y2) {
    final dy = y2 - y1;
    if (dy == 0) return;
    var ey1 = y1 >> 8;
    final ey2 = y2 >> 8;
    if ((ey1 < _minEy && ey2 < _minEy) || (ey1 >= _maxEy && ey2 >= _maxEy)) {
      return;
    }
    if (ey1 == ey2) {
      _rowDense(ey1, x1, y1 - (ey1 << 8), x2, y2 - (ey1 << 8));
      return;
    }
    final dx = x2 - x1;
    var curX = x1;
    var curY = y1;
    if (dy > 0) {
      if (ey1 < _minEy) {
        curY = _minBoundY;
        curX = x1 + ((curY - y1) * dx) ~/ dy;
        ey1 = _minEy;
      }
      final limit = ey2 < _maxEy ? ey2 : _maxEy;
      if (dx == 0) {
        final rawEx = x1 >> 8;
        if (rawEx < _maxEx && ey1 < limit) {
          final clamped = rawEx < _minEx;
          final i = clamped ? 0 : rawEx - _minEx;
          final fx2 = clamped ? 0 : (x1 - (rawEx << 8)) << 1;
          final words = _denseWords;
          final w2 = _denseW << 1;
          final used = _denseUsed!;
          final cells = _denseCells;
          final bit = 1 << (i & 63);
          final j0 = ey1 - _minEy;
          var wordIdx = j0 * words + (i >>> 6);
          var cellIdx = (j0 * _denseW + i) << 1;
          if (ey1 < _dirtyMinY) _dirtyMinY = ey1;
          if (limit - 1 > _dirtyMaxY) _dirtyMaxY = limit - 1;
          while (ey1 < limit) {
            final ny = (ey1 + 1) << 8;
            final d = ny - curY;
            final area = fx2 * d;
            final w = used[wordIdx];
            if ((w & bit) != 0) {
              cells[cellIdx] += d;
              cells[cellIdx + 1] += area;
            } else {
              used[wordIdx] = w | bit;
              cells[cellIdx] = d;
              cells[cellIdx + 1] = area;
            }
            curY = ny;
            wordIdx += words;
            cellIdx += w2;
            ey1++;
          }
        } else {
          ey1 = limit;
          curY = limit << 8;
        }
      } else if (limit - ey1 >= 5) {
        final mag = dx < 0 ? -dx : dx;
        final sign = dx < 0 ? -1 : 1;
        final firstNum = (((ey1 + 1) << 8) - y1) * mag;
        final stepNum = mag << 8;
        var q = firstNum ~/ dy;
        var rem = firstNum - q * dy;
        final stepQ = stepNum ~/ dy;
        final stepR = stepNum - stepQ * dy;
        while (ey1 < limit) {
          final ny = (ey1 + 1) << 8;
          final nx = x1 + sign * q;
          _rowDense(ey1, curX, curY - (ey1 << 8), nx, 256);
          q += stepQ;
          rem += stepR;
          if (rem >= dy) {
            rem -= dy;
            q++;
          }
          curX = nx;
          curY = ny;
          ey1++;
        }
      } else {
        while (ey1 < limit) {
          final ny = (ey1 + 1) << 8;
          final nx = x1 + ((ny - y1) * dx) ~/ dy;
          _rowDense(ey1, curX, curY - (ey1 << 8), nx, 256);
          curX = nx;
          curY = ny;
          ey1++;
        }
      }
      if (ey1 < _maxEy) {
        _rowDense(ey1, curX, curY - (ey1 << 8), x2, y2 - (ey1 << 8));
      }
    } else {
      if (ey1 >= _maxEy) {
        curY = _maxBoundY;
        curX = x1 + ((curY - y1) * dx) ~/ dy;
        ey1 = _maxEy - 1;
      }
      if (ey1 == ey2) {
        if (ey1 >= _minEy) {
          _rowDense(ey1, curX, curY - (ey1 << 8), x2, y2 - (ey1 << 8));
        }
        return;
      }
      final firstRowY = ey1 << 8;
      var nx = x1 + ((firstRowY - y1) * dx) ~/ dy;
      if (ey1 >= _minEy) {
        _rowDense(ey1, curX, curY - firstRowY, nx, 0);
      }
      curX = nx;
      ey1--;
      final limit = ey2 > _minEy - 1 ? ey2 : _minEy - 1;
      if (dx == 0) {
        final rawEx = x1 >> 8;
        if (rawEx < _maxEx && ey1 > limit) {
          final clamped = rawEx < _minEx;
          final i = clamped ? 0 : rawEx - _minEx;
          final area = clamped ? 0 : -((x1 - (rawEx << 8)) << 9);
          final words = _denseWords;
          final w2 = _denseW << 1;
          final used = _denseUsed!;
          final cells = _denseCells;
          final bit = 1 << (i & 63);
          final j0 = ey1 - _minEy;
          var wordIdx = j0 * words + (i >>> 6);
          var cellIdx = (j0 * _denseW + i) << 1;
          if (ey1 > _dirtyMaxY) _dirtyMaxY = ey1;
          if (limit + 1 < _dirtyMinY) _dirtyMinY = limit + 1;
          while (ey1 > limit) {
            final w = used[wordIdx];
            if ((w & bit) != 0) {
              cells[cellIdx] -= 256;
              cells[cellIdx + 1] += area;
            } else {
              used[wordIdx] = w | bit;
              cells[cellIdx] = -256;
              cells[cellIdx + 1] = area;
            }
            wordIdx -= words;
            cellIdx -= w2;
            ey1--;
          }
        } else {
          ey1 = limit;
        }
      } else if (ey1 - limit >= 5) {
        final mag = dx < 0 ? -dx : dx;
        final sign = dx < 0 ? -1 : 1;
        final absDy = -dy;
        final firstNum = (y1 - (ey1 << 8)) * mag;
        final stepNum = mag << 8;
        var q = firstNum ~/ absDy;
        var rem = firstNum - q * absDy;
        final stepQ = stepNum ~/ absDy;
        final stepR = stepNum - stepQ * absDy;
        while (ey1 > limit) {
          nx = x1 + sign * q;
          _rowDense(ey1, curX, 256, nx, 0);
          q += stepQ;
          rem += stepR;
          if (rem >= absDy) {
            rem -= absDy;
            q++;
          }
          curX = nx;
          ey1--;
        }
      } else {
        while (ey1 > limit) {
          nx = x1 + (((ey1 << 8) - y1) * dx) ~/ dy;
          _rowDense(ey1, curX, 256, nx, 0);
          curX = nx;
          ey1--;
        }
      }
      if (ey1 >= _minEy) {
        _rowDense(ey1, curX, 256, x2, y2 - (ey1 << 8));
      }
    }
  }

  void _rasterizeDenseToSpans(
    PolyPath path,
    bool evenOdd,
    RleSpans out,
    int clipX0,
    int clipY0,
    int clipX1,
    int clipY1,
  ) {
    _prepareDense(clipX0, clipY0, clipX1, clipY1);
    _rasterizeDenseEdges(path);
    if (_dirtyMaxY < _dirtyMinY) {
      _denseNeedsClear = false;
      return;
    }
    final x0 = _minEx;
    final y0 = _minEy;
    final x1 = _maxEx;
    final w = _denseW;
    final words = _denseWords;
    final used = _denseUsed!;
    final cells = _denseCells;
    final ctz = _ctz64;
    final startY = _dirtyMinY;
    final endY = _dirtyMaxY;

    var d = out.data;
    var capWords = d.length;
    var spanCount = 0;
    var minX = 0x7FFFFFFF;
    var minY = 0x7FFFFFFF;
    var maxX = 0;
    var maxY = 0;
    var lastY = -1;
    var lastXEnd = -1;
    var lastPackedCov = -1;

    for (var cy = startY; cy <= endY; cy++) {
      final j = cy - y0;
      final rowWordOff = j * words;
      final rowCellOff = (j * w) << 1;
      var cover = 0;
      var col = x0;
      for (var wi = 0; wi < words; wi++) {
        var word = used[rowWordOff + wi];
        if (word == 0) continue;
        used[rowWordOff + wi] = 0;
        final xBase = x0 + (wi << 6);
        final cellBase = rowCellOff + (wi << 7);
        while (word != 0) {
          final lsb = word & -word;
          final bitIdx = ctz[(lsb * _debruijn64) >>> 58];
          word ^= lsb;
          final cx = xBase + bitIdx;
          if (cx > col && cover != 0) {
            final cov = _calcCoverage(cover << 9, evenOdd);
            if (cov > 0) {
              final len = cx - col;
              final packedCov = cov >= 256 ? 255 : cov - 1;
              if (cy == lastY &&
                  col == lastXEnd &&
                  packedCov == lastPackedCov) {
                final prevIdx = (spanCount - 1) * 2 + 1;
                d[prevIdx] = (((d[prevIdx] >>> 8) + len) << 8) | packedCov;
                lastXEnd = cx;
                if (cx > maxX) maxX = cx;
              } else {
                final idx = spanCount * 2;
                if (idx + 2 > capWords) {
                  out.spanCount = spanCount;
                  out._grow();
                  d = out.data;
                  capWords = d.length;
                }
                d[idx] = (cy << 16) | col;
                d[idx + 1] = (len << 8) | packedCov;
                spanCount++;
                lastY = cy;
                lastXEnd = cx;
                lastPackedCov = packedCov;
                if (col < minX) minX = col;
                if (cx > maxX) maxX = cx;
                if (cy < minY) minY = cy;
                if (cy + 1 > maxY) maxY = cy + 1;
              }
            }
          }
          final cIdx = cellBase + (bitIdx << 1);
          cover += cells[cIdx];
          final cov = _calcCoverage((cover << 9) - cells[cIdx + 1], evenOdd);
          if (cov > 0) {
            final packedCov = cov >= 256 ? 255 : cov - 1;
            if (cy == lastY && cx == lastXEnd && packedCov == lastPackedCov) {
              final prevIdx = (spanCount - 1) * 2 + 1;
              d[prevIdx] = (((d[prevIdx] >>> 8) + 1) << 8) | packedCov;
              lastXEnd = cx + 1;
              if (lastXEnd > maxX) maxX = lastXEnd;
            } else {
              final idx = spanCount * 2;
              if (idx + 2 > capWords) {
                out.spanCount = spanCount;
                out._grow();
                d = out.data;
                capWords = d.length;
              }
              d[idx] = (cy << 16) | cx;
              d[idx + 1] = 256 | packedCov;
              spanCount++;
              lastY = cy;
              lastXEnd = cx + 1;
              lastPackedCov = packedCov;
              if (cx < minX) minX = cx;
              if (lastXEnd > maxX) maxX = lastXEnd;
              if (cy < minY) minY = cy;
              if (cy + 1 > maxY) maxY = cy + 1;
            }
          }
          col = cx + 1;
        }
      }
      if (cover != 0 && col < x1) {
        final cov = _calcCoverage(cover << 9, evenOdd);
        if (cov > 0) {
          final len = x1 - col;
          final packedCov = cov >= 256 ? 255 : cov - 1;
          if (cy == lastY && col == lastXEnd && packedCov == lastPackedCov) {
            final prevIdx = (spanCount - 1) * 2 + 1;
            d[prevIdx] = (((d[prevIdx] >>> 8) + len) << 8) | packedCov;
            lastXEnd = x1;
            if (x1 > maxX) maxX = x1;
          } else {
            final idx = spanCount * 2;
            if (idx + 2 > capWords) {
              out.spanCount = spanCount;
              out._grow();
              d = out.data;
              capWords = d.length;
            }
            d[idx] = (cy << 16) | col;
            d[idx + 1] = (len << 8) | packedCov;
            spanCount++;
            lastY = cy;
            lastXEnd = x1;
            lastPackedCov = packedCov;
            if (col < minX) minX = col;
            if (x1 > maxX) maxX = x1;
            if (cy < minY) minY = cy;
            if (cy + 1 > maxY) maxY = cy + 1;
          }
        }
      }
    }
    _denseNeedsClear = false;
    out
      ..spanCount = spanCount
      ..minX = minX
      ..minY = minY
      ..maxX = maxX
      ..maxY = maxY;
  }

  static int _scalePremul(int premul, int factor256) {
    if (factor256 >= 256) return premul;
    if (factor256 <= 0 || premul == 0) return 0;
    final rb =
        ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
    final ag =
        ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
    return rb | ag;
  }

  static int _srcOverWithIa(int s, int d, int ia) {
    final rb0 = (d & 0x00FF00FF) * ia + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((d >> 8) & 0x00FF00FF) * ia + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return s + (rb | ag);
  }

  void _sweepDenseSolid(
    bool evenOdd,
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int dstStride,
    int srcPremul,
  ) {
    if (_dirtyMaxY < _dirtyMinY) {
      _denseNeedsClear = false;
      return;
    }
    final x0 = _minEx;
    final y0 = _minEy;
    final x1 = _maxEx;
    final w = _denseW;
    final words = _denseWords;
    final used = _denseUsed!;
    final cells = _denseCells;
    final ctz = _ctz64;
    final startY = _dirtyMinY;
    final endY = _dirtyMaxY;

    final fullSa = srcPremul >>> 24;
    if (!_isWeb && !identical(dst, _cachedDst)) {
      _cachedDst = dst;
      _cachedDst4 = (dst.offsetInBytes & 15) == 0
          ? Int32x4List.view(dst.buffer, dst.offsetInBytes, dst.length >>> 2)
          : null;
      _cachedDst64 = (dst.offsetInBytes & 7) == 0
          ? Uint64List.view(dst.buffer, dst.offsetInBytes, dst.length >>> 1)
          : null;
    }

    if (fullSa == 255) {
      final dst4 = _isWeb ? null : _cachedDst4;
      final dst64 = _isWeb ? null : _cachedDst64;
      for (var cy = startY; cy <= endY; cy++) {
        final j = cy - y0;
        final rowWordOff = j * words;
        final rowCellOff = (j * w) << 1;
        final rowBase = (cy - dstOriginY) * dstStride - dstOriginX;
        var cover = 0;
        var col = x0;
        for (var wi = 0; wi < words; wi++) {
          var word = used[rowWordOff + wi];
          if (word == 0) continue;
          used[rowWordOff + wi] = 0;
          final xBase = x0 + (wi << 6);
          final cellBase = rowCellOff + (wi << 7);
          while (word != 0) {
            final lsb = word & -word;
            final bitIdx = ctz[(lsb * _debruijn64) >>> 58];
            word ^= lsb;
            final cx = xBase + bitIdx;
            if (cx > col && cover != 0) {
              final cov = _calcCoverage(cover << 9, evenOdd);
              if (cov == 256) {
                final start = rowBase + col;
                final end = rowBase + cx;
                if (!_isWeb && dst4 != null && end - start >= 8) {
                  _fillOpaqueSimd4(dst, dst4, start, end, srcPremul);
                } else {
                  var p = start;
                  final end4 = end - 3;
                  while (p < end4) {
                    dst[p] = srcPremul;
                    dst[p + 1] = srcPremul;
                    dst[p + 2] = srcPremul;
                    dst[p + 3] = srcPremul;
                    p += 4;
                  }
                  while (p < end) {
                    dst[p++] = srcPremul;
                  }
                }
              } else if (cov > 0) {
                final effSrc = _scalePremul(srcPremul, cov);
                if (effSrc != 0) {
                  _blendDenseTranslucentRun(
                    dst,
                    dst64,
                    rowBase + col,
                    rowBase + cx,
                    effSrc,
                    255 - (effSrc >>> 24),
                  );
                }
              }
            }
            final cIdx = cellBase + (bitIdx << 1);
            cover += cells[cIdx];
            final cov = _calcCoverage((cover << 9) - cells[cIdx + 1], evenOdd);
            if (cov == 256) {
              dst[rowBase + cx] = srcPremul;
            } else if (cov > 0) {
              final effSrc = _scalePremul(srcPremul, cov);
              if (effSrc != 0) {
                final idx = rowBase + cx;
                final d = dst[idx];
                dst[idx] = d == 0
                    ? effSrc
                    : _srcOverWithIa(effSrc, d, 255 - (effSrc >>> 24));
              }
            }
            col = cx + 1;
          }
        }
        if (cover != 0 && col < x1) {
          final cov = _calcCoverage(cover << 9, evenOdd);
          if (cov == 256) {
            final start = rowBase + col;
            final end = rowBase + x1;
            if (!_isWeb && dst4 != null && end - start >= 8) {
              _fillOpaqueSimd4(dst, dst4, start, end, srcPremul);
            } else {
              var p = start;
              final end4 = end - 3;
              while (p < end4) {
                dst[p] = srcPremul;
                dst[p + 1] = srcPremul;
                dst[p + 2] = srcPremul;
                dst[p + 3] = srcPremul;
                p += 4;
              }
              while (p < end) {
                dst[p++] = srcPremul;
              }
            }
          } else if (cov > 0) {
            final effSrc = _scalePremul(srcPremul, cov);
            if (effSrc != 0) {
              _blendDenseTranslucentRun(
                dst,
                dst64,
                rowBase + col,
                rowBase + x1,
                effSrc,
                255 - (effSrc >>> 24),
              );
            }
          }
        }
      }
      _denseNeedsClear = false;
      return;
    }

    // Translucent solid sweep (fullSa < 255).
    final fullIa = 255 - fullSa;
    final dst64 = _isWeb ? null : _cachedDst64;
    for (var cy = startY; cy <= endY; cy++) {
      final j = cy - y0;
      final rowWordOff = j * words;
      final rowCellOff = (j * w) << 1;
      final rowBase = (cy - dstOriginY) * dstStride - dstOriginX;
      var cover = 0;
      var col = x0;
      for (var wi = 0; wi < words; wi++) {
        var word = used[rowWordOff + wi];
        if (word == 0) continue;
        used[rowWordOff + wi] = 0;
        final xBase = x0 + (wi << 6);
        final cellBase = rowCellOff + (wi << 7);
        while (word != 0) {
          final lsb = word & -word;
          final bitIdx = ctz[(lsb * _debruijn64) >>> 58];
          word ^= lsb;
          final cx = xBase + bitIdx;
          if (cx > col && cover != 0) {
            final cov = _calcCoverage(cover << 9, evenOdd);
            if (cov == 256) {
              _blendDenseTranslucentRun(
                dst,
                dst64,
                rowBase + col,
                rowBase + cx,
                srcPremul,
                fullIa,
              );
            } else if (cov > 0) {
              final effSrc = _scalePremul(srcPremul, cov);
              if (effSrc != 0) {
                _blendDenseTranslucentRun(
                  dst,
                  dst64,
                  rowBase + col,
                  rowBase + cx,
                  effSrc,
                  255 - (effSrc >>> 24),
                );
              }
            }
          }
          final cIdx = cellBase + (bitIdx << 1);
          cover += cells[cIdx];
          final cov = _calcCoverage((cover << 9) - cells[cIdx + 1], evenOdd);
          if (cov > 0) {
            final effSrc = cov == 256
                ? srcPremul
                : _scalePremul(srcPremul, cov);
            if (effSrc != 0) {
              final idx = rowBase + cx;
              final d = dst[idx];
              dst[idx] = d == 0
                  ? effSrc
                  : _srcOverWithIa(
                      effSrc,
                      d,
                      cov == 256 ? fullIa : 255 - (effSrc >>> 24),
                    );
            }
          }
          col = cx + 1;
        }
      }
      if (cover != 0 && col < x1) {
        final cov = _calcCoverage(cover << 9, evenOdd);
        if (cov == 256) {
          _blendDenseTranslucentRun(
            dst,
            dst64,
            rowBase + col,
            rowBase + x1,
            srcPremul,
            fullIa,
          );
        } else if (cov > 0) {
          final effSrc = _scalePremul(srcPremul, cov);
          if (effSrc != 0) {
            _blendDenseTranslucentRun(
              dst,
              dst64,
              rowBase + col,
              rowBase + x1,
              effSrc,
              255 - (effSrc >>> 24),
            );
          }
        }
      }
    }
    _denseNeedsClear = false;
  }

  @pragma('vm:prefer-inline')
  static void _fillOpaqueSimd4(
    Uint32List dst,
    Int32x4List dst4,
    int start,
    int end,
    int srcPremul,
  ) {
    final fill4 = Int32x4(srcPremul, srcPremul, srcPremul, srcPremul);
    var p = start;
    final alignEnd = (p + 3) & ~3;
    while (p < alignEnd) {
      dst[p++] = srcPremul;
    }
    var q = p >>> 2;
    final qEnd = end >>> 2;
    while (q < qEnd) {
      dst4[q++] = fill4;
    }
    p = q << 2;
    while (p < end) {
      dst[p++] = srcPremul;
    }
  }

  static void _blendDenseTranslucentRun(
    Uint32List dst,
    Uint64List? dst64,
    int start,
    int end,
    int effSrc,
    int ia,
  ) {
    if (!_isWeb && dst64 != null && end - start >= 4) {
      var p = start;
      if ((p & 1) != 0) {
        final d = dst[p];
        dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
        p++;
      }
      var q = p >>> 1;
      final qEnd = end >>> 1;
      final effSrc64 = (effSrc << 32) | effSrc;
      const mask = (0x00FF00FF << 32) | 0x00FF00FF;
      const bias = (0x00800080 << 32) | 0x00800080;
      const agMask = (0xFF00FF00 << 32) | 0xFF00FF00;
      final qEnd2 = qEnd - 1;
      while (q < qEnd2) {
        final d0 = dst64[q];
        final d1 = dst64[q + 1];
        if ((d0 | d1) == 0) {
          dst64[q] = effSrc64;
          dst64[q + 1] = effSrc64;
          q += 2;
          continue;
        }
        final rb0 = (d0 & mask) * ia + bias;
        final rb1 = (d1 & mask) * ia + bias;
        final ag0 = ((d0 >>> 8) & mask) * ia + bias;
        final ag1 = ((d1 >>> 8) & mask) * ia + bias;
        final r0 = ((rb0 + ((rb0 >>> 8) & mask)) >>> 8) & mask;
        final r1 = ((rb1 + ((rb1 >>> 8) & mask)) >>> 8) & mask;
        final a0 = (ag0 + ((ag0 >>> 8) & mask)) & agMask;
        final a1 = (ag1 + ((ag1 >>> 8) & mask)) & agMask;
        dst64[q] = effSrc64 + (r0 | a0);
        dst64[q + 1] = effSrc64 + (r1 | a1);
        q += 2;
      }
      while (q < qEnd) {
        final d0 = dst64[q];
        if (d0 == 0) {
          dst64[q++] = effSrc64;
        } else {
          final rb0 = (d0 & mask) * ia + bias;
          final rb = ((rb0 + ((rb0 >>> 8) & mask)) >>> 8) & mask;
          final ag0 = ((d0 >>> 8) & mask) * ia + bias;
          final ag = (ag0 + ((ag0 >>> 8) & mask)) & agMask;
          dst64[q++] = effSrc64 + (rb | ag);
        }
      }
      p = q << 1;
      if (p < end) {
        final d = dst[p];
        dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
      }
      return;
    }
    if (_isWasm && end - start >= 4) {
      final effSrc64 = (effSrc << 32) | effSrc;
      const mask = (0x00FF00FF << 32) | 0x00FF00FF;
      const bias = (0x00800080 << 32) | 0x00800080;
      const agMask = (0xFF00FF00 << 32) | 0xFF00FF00;
      var p = start;
      final end2 = end - 1;
      while (p < end2) {
        final d0 = dst[p];
        final d1 = dst[p + 1];
        if ((d0 | d1) == 0) {
          dst[p] = effSrc;
          dst[p + 1] = effSrc;
        } else {
          final d = (d1 << 32) | d0;
          final rb0 = (d & mask) * ia + bias;
          final rb = ((rb0 + ((rb0 >>> 8) & mask)) >>> 8) & mask;
          final ag0 = ((d >>> 8) & mask) * ia + bias;
          final ag = (ag0 + ((ag0 >>> 8) & mask)) & agMask;
          final out = effSrc64 + (rb | ag);
          dst[p] = out & 0xFFFFFFFF;
          dst[p + 1] = out >>> 32;
        }
        p += 2;
      }
      if (p < end) {
        final d = dst[p];
        dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
      }
      return;
    }
    for (var p = start; p < end; p++) {
      final d = dst[p];
      dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
    }
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
    if (_isJs) {
      _renderScanlineWeb(ey, x1, y1, x2, y2);
      return;
    }
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

  void _renderScanlineWeb(int ey, int x1, int y1, int x2, int y2) {
    final delta = y2 - y1;
    if (delta == 0 || ey < _minEy || ey >= _maxEy) return;
    var ex1 = (x1 >> 8).toSigned(32);
    var ex2 = (x2 >> 8).toSigned(32);
    final ex1Base = ex1 * 256;
    final ex2Base = ex2 * 256;
    if (ex1 == ex2) {
      _recordSegment(ey, ex1, x1 - ex1Base, x2 - ex1Base, delta);
      return;
    }
    final dx = x2 - x1;
    var curFx = x1 - ex1Base;
    var curFy = y1;
    if (x2 > x1) {
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
        final nextX = (ex1 + 1) * 256;
        final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
        _recordSegment(ey, ex1, curFx, 256, nextFy - curFy);
        curFy = nextFy;
        curFx = 0;
        ex1++;
      }
      if (ex1 < _maxEx) {
        _recordSegment(ey, ex1, curFx, x2 - ex2Base, y2 - curFy);
      }
    } else {
      if (ex1 >= _maxEx) {
        if (ex2 >= _maxEx) return;
        final crossFy = y1 + ((_maxBoundX - x1) * delta) ~/ dx;
        curFy = crossFy;
        ex1 = _maxEx - 1;
        curFx = 256;
      }
      while (ex1 > ex2 && ex1 >= _minEx) {
        final nextX = ex1 * 256;
        final nextFy = y1 + ((nextX - x1) * delta) ~/ dx;
        _recordSegment(ey, ex1, curFx, 0, nextFy - curFy);
        curFy = nextFy;
        curFx = 256;
        ex1--;
      }
      if (ex1 < _minEx) {
        _recordSegment(ey, _minEx, 0, 0, y2 - curFy);
      } else {
        _recordSegment(ey, ex1, curFx, x2 - ex2Base, y2 - curFy);
      }
    }
  }

  void _renderLine(int toX, int toY) {
    if (_isJs) {
      _renderLineWeb(toX, toY);
      return;
    }
    final x1 = _curX;
    final y1 = _curY;
    _curX = toX;
    _curY = toY;

    final dx = toX - x1;
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

    if (dy > 0) {
      // Downward edge.
      var curX = x1;
      var curY = y1;
      if (ey1 < _minEy) {
        final crossY = _minBoundY;
        curX = x1 + ((crossY - y1) * dx) ~/ dy;
        curY = crossY;
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
      var curX = x1;
      var curY = y1;
      if (ey1 >= _maxEy) {
        final crossY = _maxBoundY;
        curX += ((crossY - y1) * dx) ~/ dy;
        curY = crossY;
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

  void _renderLineWeb(int toX, int toY) {
    final x1 = _curX;
    final y1 = _curY;
    _curX = toX;
    _curY = toY;
    final dy = toY - y1;
    if (dy == 0) return;

    var ey1 = (y1 >> 8).toSigned(32);
    var ey2 = (toY >> 8).toSigned(32);
    if (ey1 < _minEy && ey2 < _minEy) return;
    if (ey1 >= _maxEy && ey2 >= _maxEy) return;

    if (ey1 == ey2) {
      final base = ey1 * 256;
      _renderScanlineWeb(ey1, x1, y1 - base, toX, toY - base);
      return;
    }

    final dx = toX - x1;
    var curX = x1;
    var curY = y1;
    if (dy > 0) {
      if (ey1 < _minEy) {
        curX = x1 + ((_minBoundY - y1) * dx) ~/ dy;
        curY = _minBoundY;
        ey1 = _minEy;
      }
      while (ey1 < ey2 && ey1 < _maxEy) {
        final nextY = (ey1 + 1) * 256;
        final nextX = x1 + ((nextY - y1) * dx) ~/ dy;
        _renderScanlineWeb(ey1, curX, curY - ey1 * 256, nextX, 256);
        curX = nextX;
        curY = nextY;
        ey1++;
      }
      if (ey1 < _maxEy) {
        _renderScanlineWeb(ey1, curX, curY - ey1 * 256, toX, toY - ey1 * 256);
      }
    } else {
      if (ey1 >= _maxEy) {
        curX = x1 + ((_maxBoundY - y1) * dx) ~/ dy;
        curY = _maxBoundY;
        ey1 = _maxEy - 1;
      }
      if (ey1 == ey2) {
        if (ey1 >= _minEy) {
          final base = ey1 * 256;
          _renderScanlineWeb(ey1, curX, curY - base, toX, toY - base);
        }
        return;
      }
      final firstRowY = ey1 * 256;
      final firstNextX = x1 + ((firstRowY - y1) * dx) ~/ dy;
      if (ey1 >= _minEy) {
        _renderScanlineWeb(ey1, curX, curY - firstRowY, firstNextX, 0);
      }
      curX = firstNextX;
      ey1--;
      while (ey1 > ey2 && ey1 >= _minEy) {
        final rowBottomY = ey1 * 256;
        final nextX = x1 + ((rowBottomY - y1) * dx) ~/ dy;
        _renderScanlineWeb(ey1, curX, 256, nextX, 0);
        curX = nextX;
        ey1--;
      }
      if (ey1 >= _minEy) {
        _renderScanlineWeb(ey1, curX, 256, toX, toY - ey1 * 256);
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

  static int _calcCoverageWeb(int area, bool evenOdd) {
    var cov = (area >> 9).toSigned(32);
    if (cov < 0) cov = -cov;
    if (!evenOdd) {
      return cov >= 256 ? 256 : cov;
    }
    cov &= 511;
    if (cov > 256) cov = 512 - cov;
    return cov;
  }

  void sweep(bool evenOdd, RleSpans out) {
    if (_isJs) {
      _sweepWeb(evenOdd, out);
      return;
    }
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

  void _sweepWeb(bool evenOdd, RleSpans out) {
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
          final cov = _calcCoverageWeb(cover * 512, evenOdd);
          if (cov > 0) out.addSpan(y, x, cx - x, cov);
        }
        cover += _cellCover[cell];
        final cov = _calcCoverageWeb((cover * 512) - _cellArea[cell], evenOdd);
        if (cov > 0) out.addSpan(y, cx, 1, cov);
        x = cx + 1;
        cell = _cellNext[cell];
      }
      if (cover != 0 && x < _maxEx) {
        final cov = _calcCoverageWeb(cover * 512, evenOdd);
        if (cov > 0) out.addSpan(y, x, _maxEx - x, cov);
      }
    }
    _dirtyMaxY = _minEy - 1;
    _dirtyMinY = _maxEy;
  }
}
