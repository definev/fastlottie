part of 'raster_core.dart';

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
  PolyPath out,
  RasterWorkspace ws, [
  int trimDepth = 0,
  int groupDepth = 0,
]) {
  while (src is _Shape) {
    src = src.content;
  }
  if (src is _Group) {
    var ga = ma, gb = mb, gc = mc, gd = md, gtx = mtx, gty = mty;
    if (!src.transform.isSpatialIdentity) {
      final m = ws._groupMatrix(groupDepth);
      _composeAffine(src.transform, frame, ma, mb, mc, md, mtx, mty, m);
      ga = m[0];
      gb = m[1];
      gc = m[2];
      gd = m[3];
      gtx = m[4];
      gty = m[5];
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
      _localFlatnessSq(ma, mb, mc, md, flatnessSq),
      ws,
      trimDepth,
      groupDepth,
    );
    if (trimmed != null && trimmed.contourCount > 0) {
      out.appendTransformed(trimmed, ma, mb, mc, md, mtx, mty);
    }
    return;
  }

  if (src is _MergePathSource) {
    if (src.sources.isEmpty) return;
    if (src.mode == 1) {
      for (var i = 0; i < src.sources.length; i++) {
        _appendSourceLocal(
          src.sources[i],
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
      }
      return;
    }
    if (src.sources.length == 1) {
      if (src.mode == 3 || src.mode == 4) return;
      _appendSourceLocal(
        src.sources[0],
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
    final PolyPath merged;
    if (src.isPathStatic) {
      merged = ws._staticMergePolyline(src, frame, trimDepth, groupDepth);
    } else {
      merged = ws._acquireMergeAccPoly(groupDepth);
      _appendMergeBoolean(
        src,
        frame,
        _localFlatnessSq(ma, mb, mc, md, flatnessSq),
        merged,
        ws,
        trimDepth,
        groupDepth,
      );
    }
    if (merged.contourCount > 0) {
      out.appendTransformed(merged, ma, mb, mc, md, mtx, mty);
    }
    return;
  }

  if (src.isPathStatic) {
    out.appendTransformed(
      ws._staticPolyline(src, frame),
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
    );
    return;
  }

  final isIdentity =
      ma == 1.0 &&
      mb == 0.0 &&
      mc == 0.0 &&
      md == 1.0 &&
      mtx == 0.0 &&
      mty == 0.0;
  if (isIdentity) {
    _flattenLeaf(src, frame, flatnessSq, out);
  } else {
    final local = ws._flattenLeafPoly..clear();
    _flattenLeaf(
      src,
      frame,
      _localFlatnessSq(ma, mb, mc, md, flatnessSq),
      local,
    );
    out.appendTransformed(local, ma, mb, mc, md, mtx, mty);
  }
}

double _localFlatnessSq(
  double a,
  double b,
  double c,
  double d,
  double flatnessSq,
) {
  final scaleSq = math.max(a * a + b * b, c * c + d * d);
  return scaleSq <= 1e-12 ? flatnessSq : flatnessSq / scaleSq;
}

void _flattenBezier(
  _BezierGeometry src,
  double frame,
  double flatnessSq,
  PolyPath out, {
  (double, double, double, double, double, double)? transform,
}) {
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
      final (startClosed, endClosed) = src.closures[src.track.segmentIndex];
      closed = startClosed;
      closingCurve = startClosed && endClosed;
    }
  }
  out.beginContour(closed);
  final reverse = src.reverse;
  if (_useNativeBezier && !reverse) {
    final start = out.vertexCount;
    while (true) {
      final countAfter = flattenBezierNative(
        pts,
        count,
        closingCurve,
        out.vx,
        out.vy,
        start,
        flatnessSq,
        transform,
      );
      if (countAfter >= 0) {
        out.vertexCount = countAfter;
        out.endContour();
        return;
      }
      if (countAfter != -1 || out.vx.length - start >= 8192) break;
      out.ensureVertexCapacity(out.vx.length + 1);
    }
  }
  final limit = closingCurve ? count : count - 1;
  final startIdx = (reverse && !closingCurve) ? count - 1 : 0;
  final outOff = reverse ? 2 : 4;
  final inOff = reverse ? 4 : 2;
  if (transform != null) {
    final (ma, mb, mc, md, mtx, mty) = transform;
    var lx = pts[startIdx * 6], ly = pts[startIdx * 6 + 1];
    out.addVertex(ma * lx + mc * ly + mtx, mb * lx + md * ly + mty);
    for (var step = 1; step <= limit; step++) {
      final int pIdx, cIdx;
      if (!reverse) {
        pIdx = step - 1;
        cIdx = step == count ? 0 : step;
      } else if (closingCurve) {
        pIdx = (count - step + 1) % count;
        cIdx = (count - step) % count;
      } else {
        pIdx = count - step;
        cIdx = count - step - 1;
      }
      final p = pIdx * 6;
      final c = cIdx * 6;
      final ox = pts[p + outOff], oy = pts[p + outOff + 1];
      final ix = pts[c + inOff], iy = pts[c + inOff + 1];
      final nx = pts[c], ny = pts[c + 1];
      if (ox.abs() <= 1e-4 &&
          oy.abs() <= 1e-4 &&
          ix.abs() <= 1e-4 &&
          iy.abs() <= 1e-4) {
        out.addVertex(ma * nx + mc * ny + mtx, mb * nx + md * ny + mty);
      } else {
        final x1 = pts[p] + ox, y1 = pts[p + 1] + oy;
        final x2 = nx + ix, y2 = ny + iy;
        out.addCubic(
          ma * lx + mc * ly + mtx,
          mb * lx + md * ly + mty,
          ma * x1 + mc * y1 + mtx,
          mb * x1 + md * y1 + mty,
          ma * x2 + mc * y2 + mtx,
          mb * x2 + md * y2 + mty,
          ma * nx + mc * ny + mtx,
          mb * nx + md * ny + mty,
          flatnessSq,
        );
      }
      lx = nx;
      ly = ny;
    }
  } else {
    var lx = pts[startIdx * 6], ly = pts[startIdx * 6 + 1];
    out.addVertex(lx, ly);
    for (var step = 1; step <= limit; step++) {
      final int pIdx, cIdx;
      if (!reverse) {
        pIdx = step - 1;
        cIdx = step == count ? 0 : step;
      } else if (closingCurve) {
        pIdx = (count - step + 1) % count;
        cIdx = (count - step) % count;
      } else {
        pIdx = count - step;
        cIdx = count - step - 1;
      }
      final p = pIdx * 6;
      final c = cIdx * 6;
      final ox = pts[p + outOff], oy = pts[p + outOff + 1];
      final ix = pts[c + inOff], iy = pts[c + inOff + 1];
      final nx = pts[c], ny = pts[c + 1];
      if (ox.abs() <= 1e-4 &&
          oy.abs() <= 1e-4 &&
          ix.abs() <= 1e-4 &&
          iy.abs() <= 1e-4) {
        out.addVertex(nx, ny);
      } else {
        out.addCubic(
          lx,
          ly,
          pts[p] + ox,
          pts[p + 1] + oy,
          nx + ix,
          ny + iy,
          nx,
          ny,
          flatnessSq,
        );
      }
      lx = nx;
      ly = ny;
    }
  }
  out.endContour();
}

void _appendMergeBoolean(
  _MergePathSource src,
  double frame,
  double flatnessSq,
  PolyPath out,
  RasterWorkspace ws,
  int trimDepth,
  int groupDepth,
) {
  out.clear();
  if (src.sources.isEmpty) return;
  _appendSourceLocal(
    src.sources[0],
    frame,
    1,
    0,
    0,
    1,
    0,
    0,
    flatnessSq,
    out,
    ws,
    trimDepth,
    groupDepth + 1,
  );
  if (src.sources.length == 1) {
    if (src.mode == 3 || src.mode == 4) out.clear();
    return;
  }

  final rhs = ws._acquireMergeCutPoly(groupDepth);
  final tmpOut = ws._acquireMergeOutPoly(groupDepth);
  final scratch = ws._polygonBooleanScratch;
  for (var i = 1; i < src.sources.length; i++) {
    if (out.contourCount == 0 && (src.mode == 3 || src.mode == 4)) {
      break;
    }
    rhs.clear();
    _appendSourceLocal(
      src.sources[i],
      frame,
      1,
      0,
      0,
      1,
      0,
      0,
      flatnessSq,
      rhs,
      ws,
      trimDepth,
      groupDepth + 1,
    );
    tmpOut.clear();
    final ok = booleanPolyPaths(out, rhs, src.mode, tmpOut, scratch);
    if (!ok) {
      if (src.mode == 2 || src.mode == 5) {
        out.appendTransformed(rhs, 1, 0, 0, 1, 0, 0);
      }
      continue;
    }
    out.clear();
    out.appendTransformed(tmpOut, 1, 0, 0, 1, 0, 0);
  }
}

void _flattenLeaf(
  _PathSource src,
  double frame,
  double flatnessSq,
  PolyPath out,
) {
  if (src is _BezierGeometry) {
    _flattenBezier(src, frame, flatnessSq, out);
    return;
  }
  if (src is _PolyStarGeometry) {
    out.beginContour(true);
    src._generatePolyStar(frame, out.addVertex, out.addVertex, (
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      prevX,
      prevY,
    ) {
      out.addCubic(prevX, prevY, x1, y1, x2, y2, x3, y3, flatnessSq);
    }, out.endContour);
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
        out.addCubic(
          x,
          y - h,
          x + kw,
          y - h,
          x + w,
          y - kh,
          x + w,
          y,
          flatnessSq,
        );
        out.addCubic(
          x + w,
          y,
          x + w,
          y + kh,
          x + kw,
          y + h,
          x,
          y + h,
          flatnessSq,
        );
        out.addCubic(
          x,
          y + h,
          x - kw,
          y + h,
          x - w,
          y + kh,
          x - w,
          y,
          flatnessSq,
        );
        out.addCubic(
          x - w,
          y,
          x - w,
          y - kh,
          x - kw,
          y - h,
          x,
          y - h,
          flatnessSq,
        );
      } else {
        out.addCubic(
          x,
          y - h,
          x - kw,
          y - h,
          x - w,
          y - kh,
          x - w,
          y,
          flatnessSq,
        );
        out.addCubic(
          x - w,
          y,
          x - w,
          y + kh,
          x - kw,
          y + h,
          x,
          y + h,
          flatnessSq,
        );
        out.addCubic(
          x,
          y + h,
          x + kw,
          y + h,
          x + w,
          y + kh,
          x + w,
          y,
          flatnessSq,
        );
        out.addCubic(
          x + w,
          y,
          x + w,
          y - kh,
          x + kw,
          y - h,
          x,
          y - h,
          flatnessSq,
        );
      }
      out.endContour();
      return;
    }
    final r = src.radius.scalar(frame).clamp(0.0, math.min(w.abs(), h.abs()));
    if (r <= 1e-4) {
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
      out.addCubic(
        x + w,
        y + h - r,
        x + w,
        y + h - r + rk,
        x + w - r + rk,
        y + h,
        x + w - r,
        y + h,
        flatnessSq,
      );
      out.addVertex(x - w + r, y + h);
      out.addCubic(
        x - w + r,
        y + h,
        x - w + r - rk,
        y + h,
        x - w,
        y + h - r + rk,
        x - w,
        y + h - r,
        flatnessSq,
      );
      out.addVertex(x - w, y - h + r);
      out.addCubic(
        x - w,
        y - h + r,
        x - w,
        y - h + r - rk,
        x - w + r - rk,
        y - h,
        x - w + r,
        y - h,
        flatnessSq,
      );
      out.addVertex(x + w - r, y - h);
      out.addCubic(
        x + w - r,
        y - h,
        x + w - r + rk,
        y - h,
        x + w,
        y - h + r - rk,
        x + w,
        y - h + r,
        flatnessSq,
      );
    } else {
      out.addCubic(
        x + w,
        y - h + r,
        x + w,
        y - h + r - rk,
        x + w - r + rk,
        y - h,
        x + w - r,
        y - h,
        flatnessSq,
      );
      out.addVertex(x - w + r, y - h);
      out.addCubic(
        x - w + r,
        y - h,
        x - w + r - rk,
        y - h,
        x - w,
        y - h + r - rk,
        x - w,
        y - h + r,
        flatnessSq,
      );
      out.addVertex(x - w, y + h - r);
      out.addCubic(
        x - w,
        y + h - r,
        x - w,
        y + h - r + rk,
        x - w + r - rk,
        y + h,
        x - w + r,
        y + h,
        flatnessSq,
      );
      out.addVertex(x + w - r, y + h);
      out.addCubic(
        x + w - r,
        y + h,
        x + w - r + rk,
        y + h,
        x + w,
        y + h - r + rk,
        x + w,
        y + h - r,
        flatnessSq,
      );
    }
    out.endContour();
  }
}

PolyPath? _evalTrimPart(
  _Trim trim,
  int index,
  double frame,
  double flatnessSq,
  RasterWorkspace ws,
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

  final double length;
  final double effOrigin;
  if (!trim.individual) {
    // Simultaneous mode trims each input independently by its own length.
    length = _measureSourceLength(
      input,
      frame,
      flatnessSq,
      ws,
      inputPoly,
      trimDepth + 1,
      groupDepth,
    );
    effOrigin = 0.0;
  } else {
    // Sequential mode caches cumulative input lengths for the current trim/frame.
    var prefix = ws._getCachedTrimPrefix(trimDepth, trim, frame, flatnessSq);
    if (prefix == null) {
      prefix = ws._acquireTrimLengths(trimDepth, count + 1);
      var total = 0.0;
      prefix[0] = 0.0;
      for (var i = 0; i < count; i++) {
        total += _measureSourceLength(
          trim.inputs[i],
          frame,
          flatnessSq,
          ws,
          i == index ? inputPoly : null,
          trimDepth + 1,
          groupDepth,
        );
        prefix[i + 1] = total;
      }
      ws._putCachedTrimPrefix(trimDepth, trim, frame, flatnessSq);
    }
    length = prefix[count];
    effOrigin = prefix[index];
  }

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
  RasterWorkspace ws,
  PolyPath? alreadyFlattened,
  int trimDepth,
  int groupDepth,
) {
  if (src.isPathStatic) {
    final cached = ws._getStaticTrimMetric(src);
    if (cached != null) return cached;
  }
  late final PolyPath poly;
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
    ws._putStaticTrimMetric(src, total);
  }
  return total;
}

void _extractTrimPoly(
  PolyPath src,
  double fromDist,
  double toDist,
  PolyPath out,
  Float64Scratch cumScratch,
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
      cum[s + 1] =
          cum[s] + _hypot(src.vx[i1] - src.vx[i0], src.vy[i1] - src.vy[i0]);
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
  PolyPath src,
  int start,
  int count,
  bool closed,
  Float64List cum,
  int segCount,
  double d0,
  double d1,
  PolyPath out,
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
  PolyPath src,
  _Dash dash,
  double frame,
  PolyPath dst,
  Float64Scratch cumScratch,
) {
  final count = dash.intervals.length;
  final values = dash._values;
  var cycle = 0.0;
  for (var i = 0; i < count; i++) {
    final v = math.max(i.isEven ? 0.01 : .1, dash.intervals[i].scalar(frame));
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
      cum[s + 1] =
          cum[s] + _hypot(src.vx[i1] - src.vx[i0], src.vy[i1] - src.vy[i0]);
    }
    final mLen = cum[segCount];
    if (mLen <= 1e-7) continue;

    var index = first;
    var distance = 0.0;
    var remaining = values[first] - consumed;
    while (distance < mLen - 1e-7) {
      final segEnd = math.min(mLen, distance + remaining);
      if (index.isEven && segEnd > distance + 1e-7) {
        _extractSubsegment(
          src,
          start,
          ptsCount,
          closed,
          cum,
          segCount,
          distance,
          segEnd,
          dst,
        );
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
  _StrokeScratch([this.nativeStroke = false]);

  final bool nativeStroke;
  final Float64Scratch x = Float64Scratch();
  final Float64Scratch y = Float64Scratch();
  final Float64Scratch tx = Float64Scratch();
  final Float64Scratch ty = Float64Scratch();
  Float64Scratch? _native;

  void trimIfOversized() {
    x.trimIfOversized();
    y.trimIfOversized();
    tx.trimIfOversized();
    ty.trimIfOversized();
    _native?.trimIfOversized();
  }

  bool expandNative(
    PolyPath src,
    double hw,
    int cap,
    int join,
    double miter,
    double flatness,
    PolyPath dst,
  ) {
    // Native builds into empty scratch; it only publishes counts on success.
    if (!dst.isEmpty ||
        src.vertexCount == 0 ||
        src.vertexCount > nativeStrokePointLimit ||
        src.contourCount == 0 ||
        src.contourCount > nativeStrokeContourLimit) {
      return false;
    }
    final scratch = (_native ??= Float64Scratch()).ensure(src.vertexCount * 4);
    dst.ensureContourCapacity(src.contourCount * 2);
    while (true) {
      final result = expandStrokeNative(
        src.vx,
        src.vy,
        src.vertexCount,
        src.contourStart,
        src.contourEnd,
        src.contourClosed,
        src.contourCount,
        hw,
        cap,
        join,
        miter,
        flatness,
        scratch,
        dst.vx,
        dst.vy,
        dst.contourStart,
        dst.contourEnd,
      );
      if (result >= 0) {
        dst.vertexCount = result & 0xffffffff;
        dst.contourCount = result >>> 32;
        dst.contourClosed.fillRange(0, dst.contourCount, 1);
        return true;
      }
      if (result != -1 || dst.vx.length >= nativeStrokeOutputLimit) {
        return false;
      }
      dst.ensureVertexCapacity(dst.vx.length + 1);
    }
  }
}

// Trigonometry-free recursive unit-normal bisection for round joins and caps.
// Bisects the arc from unit normal (nx0, ny0) to (nx1, ny1) (< 180 degrees)
// around (cx, cy) with radius hw without calling atan2, acos, cos, or sin.
void _strokeNormalArc(
  PolyPath dst,
  double hw,
  double sagittaTol,
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
      _strokeNormalArc(
        dst,
        hw,
        sagittaTol,
        cx,
        cy,
        nx0,
        ny0,
        mx,
        my,
        depth + 1,
      );
      dst.addVertex(cx + hw * mx, cy + hw * my);
      _strokeNormalArc(
        dst,
        hw,
        sagittaTol,
        cx,
        cy,
        mx,
        my,
        nx1,
        ny1,
        depth + 1,
      );
      return;
    }
  }
  if (depth == 0) {
    dst.addVertex(cx + hw * nx1, cy + hw * ny1);
  }
}

void _strokeEmitNormalArc(
  PolyPath dst,
  double hw,
  double sagittaTol,
  double cx,
  double cy,
  double nx0,
  double ny0,
  double nx1,
  double ny1,
) {
  _strokeNormalArc(dst, hw, sagittaTol, cx, cy, nx0, ny0, nx1, ny1, 0);
  dst.addVertex(cx + hw * nx1, cy + hw * ny1);
}

void _strokeAddJoin(
  PolyPath dst,
  Float64List tx,
  Float64List ty,
  double hw,
  double miterSq,
  double sagittaTol,
  int join,
  int s0,
  int s1,
  double vx,
  double vy,
  bool reversed,
) {
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

  // Outer bend on the right-hand side occurs when turning counter-clockwise
  // (cross < 0) or on a 180-degree fold-back (|cross| < 1e-4, dot < -0.999).
  if (cross >= 0 && !(cross < 1e-4 && dot < -0.999)) {
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
      _strokeEmitNormalArc(dst, hw, sagittaTol, vx, vy, n0x, n0y, u0x, u0y);
      _strokeEmitNormalArc(dst, hw, sagittaTol, vx, vy, u0x, u0y, n1x, n1y);
    } else {
      _strokeEmitNormalArc(dst, hw, sagittaTol, vx, vy, n0x, n0y, n1x, n1y);
    }
  } else {
    dst.addVertex(oaX, oaY);
    dst.addVertex(obX, obY);
  }
}

void _expandStroke(
  PolyPath src,
  double hw,
  int cap,
  int join,
  double miterLimit,
  double flatness,
  PolyPath dst,
  _StrokeScratch scratch,
) {
  if (hw <= 0) return;
  if (scratch.nativeStroke &&
      scratch.expandNative(src, hw, cap, join, miterLimit, flatness, dst)) {
    return;
  }
  final miterSq = miterLimit * miterLimit;
  final sagittaTol = math.max(0.12, flatness * 0.5);

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
      if (n == 0 ||
          (px - ptsX[n - 1]).abs() + (py - ptsY[n - 1]).abs() >= 1e-6) {
        ptsX[n] = px;
        ptsY[n++] = py;
      }
    }
    if (closed &&
        n > 1 &&
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
        _strokeEmitNormalArc(dst, hw, sagittaTol, cx, cy, 1.0, 0.0, 0.0, 1.0);
        _strokeEmitNormalArc(dst, hw, sagittaTol, cx, cy, 0.0, 1.0, -1.0, 0.0);
        _strokeEmitNormalArc(dst, hw, sagittaTol, cx, cy, -1.0, 0.0, 0.0, -1.0);
        _strokeEmitNormalArc(dst, hw, sagittaTol, cx, cy, 0.0, -1.0, 1.0, 0.0);
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
      final sNext = s + 1 == n ? 0 : s + 1;
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

    if (closed) {
      // Closed contour: outer (+N forward) + inner (-N reversed) contours.
      dst.beginContour(true);
      for (var v = 0; v < n; v++) {
        final prevSeg = v == 0 ? segCount - 1 : v - 1;
        _strokeAddJoin(
          dst,
          tx,
          ty,
          hw,
          miterSq,
          sagittaTol,
          join,
          prevSeg,
          v,
          ptsX[v],
          ptsY[v],
          false,
        );
      }
      dst.endContour();

      dst.beginContour(true);
      for (var v = n - 1; v >= 0; v--) {
        final nextSeg = v == 0 ? segCount - 1 : v - 1;
        _strokeAddJoin(
          dst,
          tx,
          ty,
          hw,
          miterSq,
          sagittaTol,
          join,
          v,
          nextSeg,
          ptsX[v],
          ptsY[v],
          true,
        );
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
        _strokeAddJoin(
          dst,
          tx,
          ty,
          hw,
          miterSq,
          sagittaTol,
          join,
          v - 1,
          v,
          ptsX[v],
          ptsY[v],
          false,
        );
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
        _strokeEmitNormalArc(
          dst,
          hw,
          sagittaTol,
          ex,
          ey,
          -utyLast,
          utxLast,
          utxLast,
          utyLast,
        );
        _strokeEmitNormalArc(
          dst,
          hw,
          sagittaTol,
          ex,
          ey,
          utxLast,
          utyLast,
          utyLast,
          -utxLast,
        );
      } else {
        dst.addVertex(ePlusX, ePlusY);
        dst.addVertex(eMinusX, eMinusY);
      }
      // Interior joins backward on -N side.
      for (var v = n - 2; v >= 1; v--) {
        _strokeAddJoin(
          dst,
          tx,
          ty,
          hw,
          miterSq,
          sagittaTol,
          join,
          v,
          v - 1,
          ptsX[v],
          ptsY[v],
          true,
        );
      }
      // Start cap at vertex 0.
      final sx = ptsX[0], sy = ptsY[0];
      final utx0 = tx[0], uty0 = ty[0];
      final sMinusX = sx - hw * (-uty0), sMinusY = sy - hw * utx0;
      if (cap == 3) {
        dst.addVertex(sMinusX - hw * utx0, sMinusY - hw * uty0);
      } else if (cap == 2) {
        dst.addVertex(sMinusX, sMinusY);
        _strokeEmitNormalArc(
          dst,
          hw,
          sagittaTol,
          sx,
          sy,
          uty0,
          -utx0,
          -utx0,
          -uty0,
        );
        _strokeEmitNormalArc(
          dst,
          hw,
          sagittaTol,
          sx,
          sy,
          -utx0,
          -uty0,
          -uty0,
          utx0,
        );
      } else {
        dst.addVertex(sMinusX, sMinusY);
      }
      dst.endContour();
    }
  }
}
