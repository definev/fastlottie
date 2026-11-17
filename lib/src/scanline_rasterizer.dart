part of 'raster_core.dart';

/// Compact packed RLE span list:
/// word0 = (y << 16) | x
/// word1 = (len << 8) | (coverage - 1), with coverage in 1..256.
class _RleSpans {
  static const int defaultSpans = 1024;
  static const int softMaxSpans = 16384;

  _RleSpans({int initialSpans = defaultSpans})
    : _buf = NativeSpansBuffer(initialSpans * 2);

  NativeSpansBuffer _buf;
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

  void swap(_RleSpans other) {
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

  _RleSpans _copy() =>
      _RleSpans(initialSpans: math.max(1, spanCount))..copyFrom(this);

  void copyFrom(_RleSpans source) {
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

  bool overlaps(_RleSpans other) =>
      minX < other.maxX &&
      other.minX < maxX &&
      minY < other.maxY &&
      other.minY < maxY;

  /// Combine two coverage masks by sweeping their span boundaries.
  /// Even wide opaque interiors take one step.
  static void combine(_RleSpans a, _RleSpans b, _RleSpans out, int mode) {
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
  static void intersect(_RleSpans a, _RleSpans clip, _RleSpans out) {
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
    if (_isWeb) {
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

  void rasterizePolyPath(
    _PolyPath path,
    bool evenOdd,
    _RleSpans out,
    int clipX0,
    int clipY0,
    int clipX1,
    int clipY1,
  ) {
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
    if (_isWeb) {
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
    if (_isWeb) {
      _renderLineWeb(toX, toY);
      return;
    }
    var x1 = _curX;
    var y1 = _curY;
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
      if (ey1 < _minEy) {
        final crossY = _minBoundY;
        x1 += ((crossY - y1) * dx) ~/ dy;
        y1 = crossY;
        ey1 = _minEy;
      }
      var curX = x1;
      var curY = y1;
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

  void sweep(bool evenOdd, _RleSpans out) {
    if (_isWeb) {
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

  void _sweepWeb(bool evenOdd, _RleSpans out) {
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
