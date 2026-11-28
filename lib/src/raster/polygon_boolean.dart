part of 'raster_core.dart';

/// Reusable scratch storage for Pure-Dart 2D polygon boolean operations.
/// Kept off the UI thread and trimmed via [RasterWorkspace.trimScratch].
class PolygonBooleanScratch {
  static const int maxInputSegments = 8192;
  static const int maxSubSegments = 32768;
  static const double _snapEps = 2.5e-6;
  static const double _splitProximityEps = 6.0e-6;
  static const double _maxCoord = 1e7;
  static const int _softEdgeCap = 2048;

  // Input segments stored in canonical endpoint order: (ax < bx || ax == bx && ay < by).
  Float64List _ax = Float64List(256);
  Float64List _ay = Float64List(256);
  Float64List _bx = Float64List(256);
  Float64List _by = Float64List(256);
  Float64List _minY = Float64List(256);
  Float64List _maxY = Float64List(256);
  Float64List _startRank = Float64List(256);
  Float64List _endRank = Float64List(256);
  Int8List _dir = Int8List(256);
  Uint8List _isSubj = Uint8List(256);
  Int32List _order = Int32List(256);
  final _active = <int>[];
  final _splitT = <List<double>>[];

  // Canonical snapped vertices and elementary non-overlapping segments.
  final _vxList = <double>[];
  final _vyList = <double>[];
  final _vRankList = <double>[];
  final _grid = <int, List<int>>{};

  final _eu = <int>[];
  final _ev = <int>[];
  final _ewSubj = <int>[];
  final _ewClip = <int>[];
  final _eOrder = <int>[];
  final _yOrder = <int>[];
  final _qX = <int>[];
  final _qY = <int>[];
  final _xAct = <int>[];
  final _yAct = <int>[];
  final _edgeMap = <int, List<int>>{};
  final _vOrder = <int>[];
  final _postEdgeOrder = <int>[];
  final _postActive = <int>[];
  final _postSplits = <int, List<int>>{};
  final _tmpEu = <int>[];
  final _tmpEv = <int>[];
  final _tmpEwSubj = <int>[];
  final _tmpEwClip = <int>[];

  // Directed kept half-edges for ring chaining.
  final _hu = <int>[];
  final _hv = <int>[];
  final _hVisited = <bool>[];
  final _outAdj = <List<int>>[];
  final _ringVerts = <int>[];
  final _allRingVerts = <int>[];
  final _ringStart = <int>[];
  final _ringEnd = <int>[];
  final _ringBest = <int>[];
  final _ringMinRank = <double>[];
  final _ringMinX = <double>[];
  final _ringMinY = <double>[];
  final _ringOrder = <int>[];

  void _ensureEdgeCapacity(int n) {
    if (_ax.length >= n) return;
    var cap = _ax.length;
    while (cap < n) {
      cap *= 2;
    }
    _ax = Float64List(cap)..setRange(0, _ax.length, _ax);
    _ay = Float64List(cap)..setRange(0, _ay.length, _ay);
    _bx = Float64List(cap)..setRange(0, _bx.length, _bx);
    _by = Float64List(cap)..setRange(0, _by.length, _by);
    _minY = Float64List(cap)..setRange(0, _minY.length, _minY);
    _maxY = Float64List(cap)..setRange(0, _maxY.length, _maxY);
    _startRank = Float64List(cap)..setRange(0, _startRank.length, _startRank);
    _endRank = Float64List(cap)..setRange(0, _endRank.length, _endRank);
    _dir = Int8List(cap)..setRange(0, _dir.length, _dir);
    _isSubj = Uint8List(cap)..setRange(0, _isSubj.length, _isSubj);
    _order = Int32List(cap)..setRange(0, _order.length, _order);
  }

  void trimIfOversized({bool aggressive = false}) {
    _active.clear();
    _vxList.clear();
    _vyList.clear();
    _vRankList.clear();
    _grid.clear();
    _eu.clear();
    _ev.clear();
    _ewSubj.clear();
    _ewClip.clear();
    _eOrder.clear();
    _yOrder.clear();
    _qX.clear();
    _qY.clear();
    _xAct.clear();
    _yAct.clear();
    _edgeMap.clear();
    _vOrder.clear();
    _postEdgeOrder.clear();
    _postActive.clear();
    _postSplits.clear();
    _tmpEu.clear();
    _tmpEv.clear();
    _tmpEwSubj.clear();
    _tmpEwClip.clear();
    _hu.clear();
    _hv.clear();
    _hVisited.clear();
    _ringVerts.clear();
    _allRingVerts.clear();
    _ringStart.clear();
    _ringEnd.clear();
    _ringBest.clear();
    _ringMinRank.clear();
    _ringMinX.clear();
    _ringMinY.clear();
    _ringOrder.clear();
    if (aggressive || _ax.length > _softEdgeCap) {
      _ax = Float64List(256);
      _ay = Float64List(256);
      _bx = Float64List(256);
      _by = Float64List(256);
      _minY = Float64List(256);
      _maxY = Float64List(256);
      _startRank = Float64List(256);
      _endRank = Float64List(256);
      _dir = Int8List(256);
      _isSubj = Uint8List(256);
      _order = Int32List(256);
      _splitT.clear();
    } else {
      for (final list in _splitT) {
        list.clear();
      }
    }
    if (aggressive || _outAdj.length > _softEdgeCap) {
      _outAdj.clear();
    } else {
      for (final list in _outAdj) {
        list.clear();
      }
    }
  }
}

/// Evaluates a 2D polygon boolean operation (`mode`: 1 Merge, 2 Union,
/// 3 Subtract `lhs \ rhs`, 4 Intersect, 5 XOR) on flattened [PolyPath] contours
/// and writes oriented closed boundary rings (`CW` outer, `CCW` holes in
/// Y-down screen coordinates) into [out].
///
/// [lhs], [rhs], and [out] must be disjoint. Returns false only when the
/// segment budget is exceeded.
bool booleanPolyPaths(
  PolyPath lhs,
  PolyPath rhs,
  int mode,
  PolyPath out,
  PolygonBooleanScratch s,
) {
  out.clear();
  if (mode == 1) {
    out.appendTransformed(lhs, 1, 0, 0, 1, 0, 0);
    out.appendTransformed(rhs, 1, 0, 0, 1, 0, 0);
    return true;
  }

  final lhsBounds = _polyAreaBounds(lhs);
  if (lhsBounds != null && !lhsBounds.$1.isFinite) return false;
  final rhsBounds = _polyAreaBounds(rhs);
  if (rhsBounds != null && !rhsBounds.$1.isFinite) return false;
  if (lhsBounds == null) {
    if (mode == 3 || mode == 4 || rhsBounds == null) return true;
    return _solvePlanarBoolean(lhs, rhs, mode, out, s);
  }
  if (rhsBounds == null) {
    if (mode == 4) return true;
    return _solvePlanarBoolean(lhs, rhs, mode, out, s);
  }

  const eps = PolygonBooleanScratch._splitProximityEps;
  final disjoint =
      lhsBounds.$3 < rhsBounds.$1 - eps ||
      rhsBounds.$3 < lhsBounds.$1 - eps ||
      lhsBounds.$4 < rhsBounds.$2 - eps ||
      rhsBounds.$4 < lhsBounds.$2 - eps;
  if (disjoint && mode == 4) {
    return true;
  }

  return _solvePlanarBoolean(lhs, rhs, mode, out, s);
}

(double, double, double, double)? _polyAreaBounds(PolyPath poly) {
  var minX = double.infinity;
  var minY = double.infinity;
  var maxX = double.negativeInfinity;
  var maxY = double.negativeInfinity;
  var validContours = 0;
  const maxCoord = PolygonBooleanScratch._maxCoord;
  for (var k = 0; k < poly.contourCount; k++) {
    final start = poly.contourStart[k];
    final end = poly.contourEnd[k];
    if (end - start < 3) continue;
    validContours++;
    for (var i = start; i < end; i++) {
      final x = poly.vx[i], y = poly.vy[i];
      if (!x.isFinite ||
          !y.isFinite ||
          x.abs() > maxCoord ||
          y.abs() > maxCoord) {
        return (double.nan, double.nan, double.nan, double.nan);
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (validContours == 0 || !minX.isFinite) return null;
  return (minX, minY, maxX, maxY);
}

bool _solvePlanarBoolean(
  PolyPath lhs,
  PolyPath rhs,
  int mode,
  PolyPath out,
  PolygonBooleanScratch s,
) {
  var edgeCount = 0;
  var rankCursor = 0.0;

  bool addPoly(PolyPath poly, int isSubj) {
    const maxCoord = PolygonBooleanScratch._maxCoord;
    for (var k = 0; k < poly.contourCount; k++) {
      final start = poly.contourStart[k];
      final end = poly.contourEnd[k];
      final len = end - start;
      if (len < 3) continue;
      for (var i = start; i < end; i++) {
        final x = poly.vx[i], y = poly.vy[i];
        if (!x.isFinite ||
            !y.isFinite ||
            x.abs() > maxCoord ||
            y.abs() > maxCoord) {
          return false;
        }
      }
      final firstEdge = edgeCount;
      final contourBase = rankCursor;
      var localSeq = 0;
      for (var i = 0; i < len; i++) {
        final i0 = start + i;
        final i1 = start + ((i + 1) % len);
        final x0 = poly.vx[i0], y0 = poly.vy[i0];
        final x1 = poly.vx[i1], y1 = poly.vy[i1];
        final dx = x1 - x0, dy = y1 - y0;
        if (dx * dx + dy * dy <= 1e-14) continue;
        if (edgeCount >= PolygonBooleanScratch.maxInputSegments) return false;
        s._ensureEdgeCapacity(edgeCount + 1);
        final forward = x0 < x1 || (x0 == x1 && y0 < y1);
        if (forward) {
          s._ax[edgeCount] = x0;
          s._ay[edgeCount] = y0;
          s._bx[edgeCount] = x1;
          s._by[edgeCount] = y1;
          s._dir[edgeCount] = 1;
        } else {
          s._ax[edgeCount] = x1;
          s._ay[edgeCount] = y1;
          s._bx[edgeCount] = x0;
          s._by[edgeCount] = y0;
          s._dir[edgeCount] = -1;
        }
        s._minY[edgeCount] = y0 < y1 ? y0 : y1;
        s._maxY[edgeCount] = y0 > y1 ? y0 : y1;
        s._startRank[edgeCount] = contourBase + localSeq;
        s._endRank[edgeCount] = contourBase + localSeq + 1;
        localSeq++;
        s._isSubj[edgeCount] = isSubj;
        if (s._splitT.length <= edgeCount) {
          s._splitT.add(<double>[]);
        } else {
          s._splitT[edgeCount].clear();
        }
        s._order[edgeCount] = edgeCount;
        edgeCount++;
      }
      if (edgeCount > firstEdge) {
        s._endRank[edgeCount - 1] = contourBase;
        rankCursor += localSeq + 1;
      }
    }
    return true;
  }

  if (!addPoly(lhs, 1) || !addPoly(rhs, 0)) {
    return false;
  }
  if (edgeCount == 0) return true;

  // Step 1: Sort input segments by canonical minX and sweep active X intervals
  // to collect every pairwise intersection and collinear/T-junction split.
  // In-place sort avoids allocating an Int32List view (keeping Int32List
  // monomorphic in dart2wasm TFA).
  final order = s._order;
  _sortEdgeOrder(order, s._ax, s._ay, edgeCount);

  final active = s._active..clear();
  const proxEps = PolygonBooleanScratch._splitProximityEps;
  const proxEpsSq = proxEps * proxEps;
  var splitOps = 0;

  for (var oi = 0; oi < edgeCount; oi++) {
    final i = order[oi];
    final a1x = s._ax[i], a1y = s._ay[i];
    final b1x = s._bx[i], b1y = s._by[i];
    final minY1 = s._minY[i], maxY1 = s._maxY[i];
    final dx1 = b1x - a1x, dy1 = b1y - a1y;
    final len1Sq = dx1 * dx1 + dy1 * dy1;
    final len1 = math.sqrt(len1Sq);
    final invLen1 = 1.0 / len1;
    final tEps1 = (PolygonBooleanScratch._snapEps * invLen1).clamp(1e-12, 0.49);

    var write = 0;
    for (var ai = 0; ai < active.length; ai++) {
      final j = active[ai];
      final b2x = s._bx[j];
      if (b2x < a1x - proxEps) continue;
      active[write++] = j;

      final maxY2 = s._maxY[j], minY2 = s._minY[j];
      if (maxY2 < minY1 - proxEps || maxY1 < minY2 - proxEps) continue;

      final a2x = s._ax[j], a2y = s._ay[j];
      final b2y = s._by[j];
      final dx2 = b2x - a2x, dy2 = b2y - a2y;
      final len2Sq = dx2 * dx2 + dy2 * dy2;
      final len2 = math.sqrt(len2Sq);
      final invLen2 = 1.0 / len2;
      final tEps2 = (PolygonBooleanScratch._snapEps * invLen2).clamp(
        1e-12,
        0.49,
      );

      final cross = dx1 * dy2 - dy1 * dx2;
      final crossSin = cross * invLen1 * invLen2;

      if (crossSin.abs() <= 1e-6) {
        // Near-parallel pair: check endpoint perpendicular distances for collinear overlap.
        final d2a = ((a2x - a1x) * dy1 - (a2y - a1y) * dx1).abs() * invLen1;
        final d2b = ((b2x - a1x) * dy1 - (b2y - a1y) * dx1).abs() * invLen1;
        final d1a = ((a1x - a2x) * dy2 - (a1y - a2y) * dx2).abs() * invLen2;
        final d1b = ((b1x - a2x) * dy2 - (b1y - a2y) * dx2).abs() * invLen2;
        if (d2a <= proxEps ||
            d2b <= proxEps ||
            d1a <= proxEps ||
            d1b <= proxEps) {
          final invL1Sq = 1.0 / len1Sq;
          final invL2Sq = 1.0 / len2Sq;
          if (d2a <= proxEps) {
            final t = ((a2x - a1x) * dx1 + (a2y - a1y) * dy1) * invL1Sq;
            if (t > tEps1 && t < 1.0 - tEps1) {
              if (++splitOps > PolygonBooleanScratch.maxSubSegments)
                return false;
              s._splitT[i].add(t);
            }
          }
          if (d2b <= proxEps) {
            final t = ((b2x - a1x) * dx1 + (b2y - a1y) * dy1) * invL1Sq;
            if (t > tEps1 && t < 1.0 - tEps1) {
              if (++splitOps > PolygonBooleanScratch.maxSubSegments)
                return false;
              s._splitT[i].add(t);
            }
          }
          if (d1a <= proxEps) {
            final u = ((a1x - a2x) * dx2 + (a1y - a2y) * dy2) * invL2Sq;
            if (u > tEps2 && u < 1.0 - tEps2) {
              if (++splitOps > PolygonBooleanScratch.maxSubSegments)
                return false;
              s._splitT[j].add(u);
            }
          }
          if (d1b <= proxEps) {
            final u = ((b1x - a2x) * dx2 + (b1y - a2y) * dy2) * invL2Sq;
            if (u > tEps2 && u < 1.0 - tEps2) {
              if (++splitOps > PolygonBooleanScratch.maxSubSegments)
                return false;
              s._splitT[j].add(u);
            }
          }
        }
        // Only skip intersection when the pair is genuinely collinear within proxEps
        // or parallel down to machine tolerance; shallow crossings still split cleanly below.
        final allCollinear =
            (d2a <= proxEps && d2b <= proxEps) ||
            (d1a <= proxEps && d1b <= proxEps);
        if (allCollinear || crossSin.abs() <= 1e-13) continue;
      }

      final vx = a2x - a1x, vy = a2y - a1y;
      final invCross = 1.0 / cross;
      final t = (vx * dy2 - vy * dx2) * invCross;
      final u = (vx * dy1 - vy * dx1) * invCross;
      final pEps1 = proxEps * invLen1;
      final pEps2 = proxEps * invLen2;
      if (t >= -pEps1 && t <= 1.0 + pEps1 && u >= -pEps2 && u <= 1.0 + pEps2) {
        // Compute intersection point and project cleanly onto segments for T-junction splits.
        final tc = t.clamp(0.0, 1.0);
        final uc = u.clamp(0.0, 1.0);
        final ix = a1x + tc * dx1, iy = a1y + tc * dy1;
        final jx = a2x + uc * dx2, jy = a2y + uc * dy2;
        final distSq = (ix - jx) * (ix - jx) + (iy - jy) * (iy - jy);
        if (distSq <= proxEpsSq * 4) {
          if (tc > tEps1 && tc < 1.0 - tEps1) {
            if (++splitOps > PolygonBooleanScratch.maxSubSegments) return false;
            s._splitT[i].add(tc);
          }
          if (uc > tEps2 && uc < 1.0 - tEps2) {
            if (++splitOps > PolygonBooleanScratch.maxSubSegments) return false;
            s._splitT[j].add(uc);
          }
        }
      }
    }
    active.length = write;
    active.add(i);
  }

  // Step 2: Cluster-snap coordinates within _snapEps and merge coinciding
  // elementary segments with signed winding weights (wSubj, wClip).
  final vxList = s._vxList..clear();
  final vyList = s._vyList..clear();
  final vRankList = s._vRankList..clear();
  final grid = s._grid..clear();
  const invCell = 1.0 / PolygonBooleanScratch._snapEps;
  const snapSq =
      PolygonBooleanScratch._snapEps * PolygonBooleanScratch._snapEps;

  int internVertex(double x, double y, double originRank) {
    final gx = (x * invCell).round();
    final gy = (y * invCell).round();
    for (var ox = -1; ox <= 1; ox++) {
      final cx = gx + ox;
      for (var oy = -1; oy <= 1; oy++) {
        final cy = gy + oy;
        final key = _hashGridPair(cx, cy);
        final bucket = grid[key];
        if (bucket == null) continue;
        for (var bi = 0; bi < bucket.length; bi++) {
          final vid = bucket[bi];
          final dx = vxList[vid] - x, dy = vyList[vid] - y;
          if (dx * dx + dy * dy <= snapSq) {
            if (originRank < vRankList[vid]) {
              vRankList[vid] = originRank;
            }
            return vid;
          }
        }
      }
    }
    final vid = vxList.length;
    vxList.add(x);
    vyList.add(y);
    vRankList.add(originRank);
    final homeKey = _hashGridPair(gx, gy);
    (grid[homeKey] ??= <int>[]).add(vid);
    return vid;
  }

  final eu = s._eu..clear();
  final ev = s._ev..clear();
  final ewSubj = s._ewSubj..clear();
  final ewClip = s._ewClip..clear();
  final edgeMap = s._edgeMap..clear();

  for (var i = 0; i < edgeCount; i++) {
    final ax = s._ax[i], ay = s._ay[i], bx = s._bx[i], by = s._by[i];
    final dir = s._dir[i];
    final sRank = s._startRank[i];
    final eRank = s._endRank[i];
    final startRank = dir == 1 ? sRank : eRank;
    final endRank = dir == 1 ? eRank : sRank;
    final isSubj = s._isSubj[i] != 0;
    final splits = s._splitT[i];
    var prevVid = internVertex(ax, ay, startRank);
    if (splits.isNotEmpty) {
      splits.sort();
      var prevT = 0.0;
      for (var si = 0; si < splits.length; si++) {
        final t = splits[si];
        if (t - prevT <= 1e-9 || 1.0 - t <= 1e-9) continue;
        final tAuth = dir == 1 ? t : 1.0 - t;
        final vid = internVertex(
          ax + (bx - ax) * t,
          ay + (by - ay) * t,
          sRank + tAuth,
        );
        if (vid != prevVid) {
          if (!_addElementarySegment(
            prevVid,
            vid,
            dir,
            isSubj,
            vxList,
            vyList,
            eu,
            ev,
            ewSubj,
            ewClip,
            edgeMap,
          )) {
            return false;
          }
          prevVid = vid;
          prevT = t;
        }
      }
    }
    final endVid = internVertex(bx, by, endRank);
    if (endVid != prevVid) {
      if (!_addElementarySegment(
        prevVid,
        endVid,
        dir,
        isSubj,
        vxList,
        vyList,
        eu,
        ev,
        ewSubj,
        ewClip,
        edgeMap,
      )) {
        return false;
      }
    }
  }

  // Step 2b: Post-snap vertex-on-edge splitting ensures snapped vertices never
  // sit unsplit on the interior of another elementary edge before Step 3.
  if (eu.isNotEmpty &&
      !_splitPostSnapVertices(
        vxList,
        vyList,
        eu,
        ev,
        ewSubj,
        ewClip,
        edgeMap,
        s,
      )) {
    return false;
  }

  // Step 3: Classify each elementary edge via midpoint vertical/horizontal raycast.
  final kCount = eu.length;
  if (kCount == 0) return true;

  // eOrder holds non-vertical intervals [ux, vx) sorted by ux;
  // qX holds shallow edges (|dx| >= |dy|) sorted by midpoint mx for vertical raycast.
  // yOrder holds non-horizontal intervals [minY, maxY) sorted by minY;
  // qY holds steep/vertical edges (|dy| > |dx|) sorted by midpoint my for horizontal raycast.
  final eOrder = s._eOrder..clear();
  final yOrder = s._yOrder..clear();
  final qX = s._qX..clear();
  final qY = s._qY..clear();
  for (var e = 0; e < kCount; e++) {
    if (ewSubj[e] == 0 && ewClip[e] == 0) continue;
    final u = eu[e], v = ev[e];
    final dx = vxList[v] - vxList[u];
    final dyAbs = (vyList[v] - vyList[u]).abs();
    if (dx >= dyAbs) {
      qX.add(e);
    } else {
      qY.add(e);
    }
    if (dx > 0.0) {
      eOrder.add(e);
    }
    if (vyList[u] != vyList[v]) {
      yOrder.add(e);
    }
  }
  if (qX.isEmpty && qY.isEmpty) return true;

  eOrder.sort((a, b) => vxList[eu[a]].compareTo(vxList[eu[b]]));
  qX.sort(
    (a, b) => (vxList[eu[a]] + vxList[ev[a]]).compareTo(
      vxList[eu[b]] + vxList[ev[b]],
    ),
  );
  yOrder.sort((a, b) {
    final ya = math.min(vyList[eu[a]], vyList[ev[a]]);
    final yb = math.min(vyList[eu[b]], vyList[ev[b]]);
    return ya.compareTo(yb);
  });
  qY.sort(
    (a, b) => (vyList[eu[a]] + vyList[ev[a]]).compareTo(
      vyList[eu[b]] + vyList[ev[b]],
    ),
  );

  final hu = s._hu..clear();
  final hv = s._hv..clear();
  final hVisited = s._hVisited..clear();
  final outAdj = s._outAdj;
  while (outAdj.length < vxList.length) {
    outAdj.add(<int>[]);
  }
  for (var i = 0; i < vxList.length; i++) {
    outAdj[i].clear();
  }

  void addDirectedEdge(int u, int v) {
    final hi = hu.length;
    hu.add(u);
    hv.add(v);
    hVisited.add(false);
    outAdj[u].add(hi);
  }

  // Sweep active X intervals with monotonically non-decreasing mx.
  final xAct = s._xAct..clear();
  var xTail = 0;
  final xIntervalCount = eOrder.length;
  for (var oi = 0; oi < qX.length; oi++) {
    final e = qX[oi];
    final u = eu[e], v = ev[e];
    final ux = vxList[u], vx = vxList[v];
    final uy = vyList[u], vy = vyList[v];
    final mx = 0.5 * (ux + vx);
    final my = 0.5 * (uy + vy);

    while (xTail < xIntervalCount) {
      final cand = eOrder[xTail];
      if (vxList[eu[cand]] > mx) break;
      xAct.add(cand);
      xTail++;
    }

    var subjAbove = 0, clipAbove = 0;
    var write = 0;
    for (var ai = 0; ai < xAct.length; ai++) {
      final g = xAct[ai];
      final gux = vxList[eu[g]], gvx = vxList[ev[g]];
      if (gvx <= mx)
        continue; // Half-open [gux, gvx) drops segments ending at <= mx.
      xAct[write++] = g;
      if (g == e) continue;
      final guy = vyList[eu[g]], gvy = vyList[ev[g]];
      // Division-free comparison equivalent to yg < my (since gvx - gux > 0).
      if ((mx - gux) * (gvy - guy) < (my - guy) * (gvx - gux)) {
        subjAbove += ewSubj[g];
        clipAbove += ewClip[g];
      }
    }
    xAct.length = write;

    final subjBelow = subjAbove + ewSubj[e];
    final clipBelow = clipAbove + ewClip[e];
    final inAbove = _evalBool(subjAbove != 0, clipAbove != 0, mode);
    final inBelow = _evalBool(subjBelow != 0, clipBelow != 0, mode);
    if (inAbove == inBelow) continue;

    // Keep interior on the RIGHT in Y-down screen coordinates.
    if (inBelow) {
      addDirectedEdge(u, v);
    } else {
      addDirectedEdge(v, u);
    }
  }

  // Sweep active Y intervals with monotonically non-decreasing my.
  final yAct = s._yAct..clear();
  var yTail = 0;
  final yIntervalCount = yOrder.length;
  for (var oi = 0; oi < qY.length; oi++) {
    final e = qY[oi];
    final u = eu[e], v = ev[e];
    final ux = vxList[u], vx = vxList[v];
    final uy = vyList[u], vy = vyList[v];
    final mx = 0.5 * (ux + vx);
    final my = 0.5 * (uy + vy);

    while (yTail < yIntervalCount) {
      final cand = yOrder[yTail];
      final cu = eu[cand], cv = ev[cand];
      final minYc = math.min(vyList[cu], vyList[cv]);
      if (minYc > my) break;
      yAct.add(cand);
      yTail++;
    }

    var subjLeft = 0, clipLeft = 0;
    var write = 0;
    for (var ai = 0; ai < yAct.length; ai++) {
      final g = yAct[ai];
      final gu = eu[g], gv = ev[g];
      final guy = vyList[gu], gvy = vyList[gv];
      final gMaxY = guy > gvy ? guy : gvy;
      if (gMaxY <= my)
        continue; // Half-open [gMinY, gMaxY) drops segments ending at <= my.
      yAct[write++] = g;
      if (g == e) continue;
      final gux = vxList[gu], gvx = vxList[gv];
      final signY = guy < gvy ? 1 : -1;
      // Division-free comparison equivalent to xg < mx.
      final lhsDet = (my - guy) * (gvx - gux);
      final rhsDet = (mx - gux) * (gvy - guy);
      if (signY == 1 ? lhsDet < rhsDet : lhsDet > rhsDet) {
        subjLeft -= ewSubj[g] * signY;
        clipLeft -= ewClip[g] * signY;
      }
    }
    yAct.length = write;

    final signYe = uy < vy ? 1 : -1;
    final subjRight = subjLeft - ewSubj[e] * signYe;
    final clipRight = clipLeft - ewClip[e] * signYe;
    final inLeft = _evalBool(subjLeft != 0, clipLeft != 0, mode);
    final inRight = _evalBool(subjRight != 0, clipRight != 0, mode);
    if (inLeft == inRight) continue;

    // Traversing downward along e keeps LEFT side on the RIGHT in Y-down space.
    if (inLeft == (signYe == 1)) {
      addDirectedEdge(u, v);
    } else {
      addDirectedEdge(v, u);
    }
  }

  // Step 4: Chain directed boundary half-edges into simple closed contours,
  // choosing minimal right-interior wedge turn at pinch junctions, then sort
  // rings by (minY, minX) so outer contours deterministically precede holes.
  final halfCount = hu.length;
  final ringVerts = s._ringVerts;
  final allRingVerts = s._allRingVerts..clear();
  final ringStart = s._ringStart..clear();
  final ringEnd = s._ringEnd..clear();
  final ringBest = s._ringBest..clear();
  final ringMinRank = s._ringMinRank..clear();
  final ringMinX = s._ringMinX..clear();
  final ringMinY = s._ringMinY..clear();
  final ringOrder = s._ringOrder..clear();
  for (var startEdge = 0; startEdge < halfCount; startEdge++) {
    if (hVisited[startEdge]) continue;
    ringVerts.clear();
    final startVert = hu[startEdge];
    var currEdge = startEdge;
    var guardSteps = halfCount + 1;
    var closedRing = false;

    while (guardSteps-- > 0) {
      hVisited[currEdge] = true;
      final u = hu[currEdge];
      final v = hv[currEdge];
      ringVerts.add(u);
      if (v == startVert) {
        closedRing = true;
        break;
      }
      final candidates = outAdj[v];
      var nextEdge = -1;
      var unvisitedCount = 0;
      for (var ci = 0; ci < candidates.length; ci++) {
        final cand = candidates[ci];
        if (!hVisited[cand]) {
          unvisitedCount++;
          nextEdge = cand;
        }
      }
      if (unvisitedCount == 0) break;
      if (unvisitedCount > 1) {
        // Pick outgoing edge making minimal CCW sweep from backward vector (V -> U)
        // in Y-down coordinates so interior on RIGHT never crosses itself at pinch points.
        final backAngle = math.atan2(
          vyList[u] - vyList[v],
          vxList[u] - vxList[v],
        );
        var bestSweep = double.infinity;
        for (var ci = 0; ci < candidates.length; ci++) {
          final cand = candidates[ci];
          if (hVisited[cand]) continue;
          final w = hv[cand];
          final outAngle = math.atan2(
            vyList[w] - vyList[v],
            vxList[w] - vxList[v],
          );
          var sweep = backAngle - outAngle;
          while (sweep <= 0.0) {
            sweep += 2.0 * math.pi;
          }
          if (sweep < bestSweep) {
            bestSweep = sweep;
            nextEdge = cand;
          }
        }
      }
      currEdge = nextEdge;
    }

    if (!closedRing || ringVerts.length < 3) {
      out.clear();
      return false;
    }
    final n = ringVerts.length;
    var best = 0;
    var bestRank = vRankList[ringVerts[0]];
    var bestX = vxList[ringVerts[0]];
    var bestY = vyList[ringVerts[0]];
    for (var i = 1; i < n; i++) {
      final vi = ringVerts[i];
      final rank = vRankList[vi];
      final x = vxList[vi], y = vyList[vi];
      if (rank < bestRank ||
          (rank == bestRank && (y < bestY || (y == bestY && x < bestX)))) {
        best = i;
        bestRank = rank;
        bestX = x;
        bestY = y;
      }
    }
    final rIdx = ringOrder.length;
    ringOrder.add(rIdx);
    ringStart.add(allRingVerts.length);
    allRingVerts.addAll(ringVerts);
    ringEnd.add(allRingVerts.length);
    ringBest.add(best);
    ringMinRank.add(bestRank);
    ringMinX.add(bestX);
    ringMinY.add(bestY);
  }

  ringOrder.sort((a, b) {
    final rankCmp = ringMinRank[a].compareTo(ringMinRank[b]);
    if (rankCmp != 0) return rankCmp;
    final cmp = ringMinY[a].compareTo(ringMinY[b]);
    if (cmp != 0) return cmp;
    return ringMinX[a].compareTo(ringMinX[b]);
  });
  for (var ri = 0; ri < ringOrder.length; ri++) {
    final r = ringOrder[ri];
    _emitCanonicalRingSlice(
      allRingVerts,
      ringStart[r],
      ringEnd[r],
      ringBest[r],
      vxList,
      vyList,
      out,
    );
  }

  return true;
}

bool _evalBool(bool a, bool b, int mode) => switch (mode) {
  2 => a || b,
  3 => a && !b,
  4 => a && b,
  5 => a != b,
  _ => a || b,
};

@pragma('vm:prefer-inline')
int _mul32Hash(int a, int b) {
  final u = a & 0xFFFFFFFF;
  final lo = (u & 0xFFFF) * b;
  final hi = ((u >>> 16) * b) & 0xFFFF;
  return (lo + (hi << 16)) & 0xFFFFFFFF;
}

@pragma('vm:prefer-inline')
int _hashGridPair(int gx, int gy) {
  final ax = (gx & 0xFFFFFFFF) ^ ((gx ~/ 0x100000000) & 0xFFFFFFFF);
  final ay = (gy & 0xFFFFFFFF) ^ ((gy ~/ 0x100000000) & 0xFFFFFFFF);
  return (_mul32Hash(ax, 73856093) ^ _mul32Hash(ay, 19349663)) & 0x7fffffff;
}

bool _splitPostSnapVertices(
  List<double> vxList,
  List<double> vyList,
  List<int> eu,
  List<int> ev,
  List<int> ewSubj,
  List<int> ewClip,
  Map<int, List<int>> edgeMap,
  PolygonBooleanScratch s,
) {
  const snap = PolygonBooleanScratch._snapEps;
  const snapSq = snap * snap;
  final kCount = eu.length;
  final postEdgeOrder = s._postEdgeOrder..clear();
  for (var e = 0; e < kCount; e++) {
    if (ewSubj[e] != 0 || ewClip[e] != 0) {
      postEdgeOrder.add(e);
    }
  }
  if (postEdgeOrder.isEmpty) return true;
  postEdgeOrder.sort((a, b) => vxList[eu[a]].compareTo(vxList[eu[b]]));

  final vCount = vxList.length;
  final vOrder = s._vOrder..clear();
  for (var v = 0; v < vCount; v++) {
    vOrder.add(v);
  }
  vOrder.sort((a, b) => vxList[a].compareTo(vxList[b]));

  final postActive = s._postActive..clear();
  final postSplits = s._postSplits..clear();
  var eTail = 0;
  final eLen = postEdgeOrder.length;
  for (var vi = 0; vi < vCount; vi++) {
    final w = vOrder[vi];
    final wx = vxList[w], wy = vyList[w];
    while (eTail < eLen) {
      final cand = postEdgeOrder[eTail];
      if (vxList[eu[cand]] > wx + snap) break;
      postActive.add(cand);
      eTail++;
    }
    var write = 0;
    for (var ai = 0; ai < postActive.length; ai++) {
      final e = postActive[ai];
      final u = eu[e], v = ev[e];
      final vx = vxList[v];
      if (vx < wx - snap) continue;
      postActive[write++] = e;
      if (w == u || w == v) continue;
      final uy = vyList[u], vy = vyList[v];
      final minY = uy < vy ? uy : vy;
      final maxY = uy > vy ? uy : vy;
      if (wy < minY - snap || wy > maxY + snap) continue;
      final ux = vxList[u];
      final dx = vx - ux, dy = vy - uy;
      final lenSq = dx * dx + dy * dy;
      if (lenSq <= 1e-24) continue;
      final dot = (wx - ux) * dx + (wy - uy) * dy;
      if (dot <= 0.0 || dot >= lenSq) continue;
      final cross = (wx - ux) * dy - (wy - uy) * dx;
      if (cross * cross <= snapSq * lenSq) {
        (postSplits[e] ??= <int>[]).add(w);
      }
    }
    postActive.length = write;
  }

  if (postSplits.isEmpty) return true;

  final tmpEu = s._tmpEu
    ..clear()
    ..addAll(eu);
  final tmpEv = s._tmpEv
    ..clear()
    ..addAll(ev);
  final tmpSubj = s._tmpEwSubj
    ..clear()
    ..addAll(ewSubj);
  final tmpClip = s._tmpEwClip
    ..clear()
    ..addAll(ewClip);
  eu.clear();
  ev.clear();
  ewSubj.clear();
  ewClip.clear();
  edgeMap.clear();

  for (var e = 0; e < kCount; e++) {
    final ws = tmpSubj[e], wc = tmpClip[e];
    if (ws == 0 && wc == 0) continue;
    final u = tmpEu[e], v = tmpEv[e];
    final verts = postSplits[e];
    if (verts == null) {
      if (!_addElementarySegmentWeights(
        u,
        v,
        ws,
        wc,
        vxList,
        vyList,
        eu,
        ev,
        ewSubj,
        ewClip,
        edgeMap,
      )) {
        return false;
      }
      continue;
    }
    final ux = vxList[u], uy = vyList[u];
    final dx = vxList[v] - ux, dy = vyList[v] - uy;
    if (verts.length > 1) {
      verts.sort((a, b) {
        final da = (vxList[a] - ux) * dx + (vyList[a] - uy) * dy;
        final db = (vxList[b] - ux) * dx + (vyList[b] - uy) * dy;
        return da.compareTo(db);
      });
    }
    var prev = u;
    for (var i = 0; i < verts.length; i++) {
      final mid = verts[i];
      if (mid == prev || mid == v) continue;
      if (!_addElementarySegmentWeights(
        prev,
        mid,
        ws,
        wc,
        vxList,
        vyList,
        eu,
        ev,
        ewSubj,
        ewClip,
        edgeMap,
      )) {
        return false;
      }
      prev = mid;
    }
    if (prev != v) {
      if (!_addElementarySegmentWeights(
        prev,
        v,
        ws,
        wc,
        vxList,
        vyList,
        eu,
        ev,
        ewSubj,
        ewClip,
        edgeMap,
      )) {
        return false;
      }
    }
  }
  return true;
}

bool _addElementarySegment(
  int a,
  int b,
  int dir,
  bool isSubj,
  List<double> vxList,
  List<double> vyList,
  List<int> eu,
  List<int> ev,
  List<int> ewSubj,
  List<int> ewClip,
  Map<int, List<int>> edgeMap,
) => _addElementarySegmentWeights(
  a,
  b,
  isSubj ? dir : 0,
  isSubj ? 0 : dir,
  vxList,
  vyList,
  eu,
  ev,
  ewSubj,
  ewClip,
  edgeMap,
);

bool _addElementarySegmentWeights(
  int a,
  int b,
  int wSubjIn,
  int wClipIn,
  List<double> vxList,
  List<double> vyList,
  List<int> eu,
  List<int> ev,
  List<int> ewSubj,
  List<int> ewClip,
  Map<int, List<int>> edgeMap,
) {
  final int u, v, wSubj, wClip;
  final ax = vxList[a], ay = vyList[a], bx = vxList[b], by = vyList[b];
  if (ax < bx || (ax == bx && ay < by)) {
    u = a;
    v = b;
    wSubj = wSubjIn;
    wClip = wClipIn;
  } else {
    u = b;
    v = a;
    wSubj = -wSubjIn;
    wClip = -wClipIn;
  }
  final key = _hashGridPair(u, v);
  final bucket = edgeMap[key];
  if (bucket != null) {
    for (var i = 0; i < bucket.length; i++) {
      final idx = bucket[i];
      if (eu[idx] == u && ev[idx] == v) {
        ewSubj[idx] += wSubj;
        ewClip[idx] += wClip;
        return true;
      }
    }
  }
  if (eu.length >= PolygonBooleanScratch.maxSubSegments) return false;
  final idx = eu.length;
  eu.add(u);
  ev.add(v);
  ewSubj.add(wSubj);
  ewClip.add(wClip);
  (edgeMap[key] ??= <int>[]).add(idx);
  return true;
}

void _emitCanonicalRingSlice(
  List<int> allVerts,
  int start,
  int end,
  int best,
  List<double> vxList,
  List<double> vyList,
  PolyPath out,
) {
  final n = end - start;
  out.beginContour(true);
  var prevX = 0.0, prevY = 0.0;
  var emitted = 0;
  for (var step = 0; step < n; step++) {
    final vi = allVerts[start + ((best + step) % n)];
    final x = vxList[vi], y = vyList[vi];
    final nextVi = allVerts[start + ((best + step + 1) % n)];
    final nx = vxList[nextVi], ny = vyList[nextVi];
    if (emitted > 0) {
      // Collapse intermediate 180-degree collinear vertices cleanly so miter
      // joins and Trim Paths lengths see unbroken straight edges.
      final dx1 = x - prevX, dy1 = y - prevY;
      final dx2 = nx - x, dy2 = ny - y;
      final l1 = math.sqrt(dx1 * dx1 + dy1 * dy1);
      final l2 = math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (l1 > 0 && l2 > 0) {
        final dot = (dx1 * dx2 + dy1 * dy2) / (l1 * l2);
        final cross = (dx1 * dy2 - dy1 * dx2).abs() / (l1 * l2);
        if (dot > 0.999999 && cross <= 1e-6) continue;
      }
    }
    out.addVertex(x, y);
    prevX = x;
    prevY = y;
    emitted++;
  }
  out.endContour();
}

/// Allocation-free in-place introsort (quicksort + insertion sort + heapsort
/// fallback) on `order[0 .. count)` ordered by `(ax[i], ay[i], i)`.
/// Avoids `Int32List.sublistView` so `Int32List` stays monomorphic on dart2wasm.
void _sortEdgeOrder(
  Int32List order,
  Float64List ax,
  Float64List ay,
  int count,
) {
  if (count <= 1) return;
  var depthLimit = 0;
  for (var n = count; n > 1; n >>>= 1) {
    depthLimit += 2;
  }
  _introsortEdgeOrder(order, ax, ay, 0, count - 1, depthLimit);
}

@pragma('vm:prefer-inline')
bool _edgeOrderLess(int a, int b, Float64List ax, Float64List ay) {
  final axA = ax[a], axB = ax[b];
  if (axA != axB) return axA < axB;
  final ayA = ay[a], ayB = ay[b];
  if (ayA != ayB) return ayA < ayB;
  return a < b;
}

void _insertionSortEdgeOrder(
  Int32List order,
  Float64List ax,
  Float64List ay,
  int lo,
  int hi,
) {
  for (var i = lo + 1; i <= hi; i++) {
    final key = order[i];
    var j = i - 1;
    while (j >= lo && _edgeOrderLess(key, order[j], ax, ay)) {
      order[j + 1] = order[j];
      j--;
    }
    order[j + 1] = key;
  }
}

void _heapsortEdgeOrder(
  Int32List order,
  Float64List ax,
  Float64List ay,
  int lo,
  int hi,
) {
  final len = hi - lo + 1;
  void siftDown(int root, int end) {
    var r = root;
    while (true) {
      final child = (r << 1) + 1;
      if (child > end) break;
      var swap = r;
      if (_edgeOrderLess(order[lo + swap], order[lo + child], ax, ay)) {
        swap = child;
      }
      if (child + 1 <= end &&
          _edgeOrderLess(order[lo + swap], order[lo + child + 1], ax, ay)) {
        swap = child + 1;
      }
      if (swap == r) break;
      final tmp = order[lo + r];
      order[lo + r] = order[lo + swap];
      order[lo + swap] = tmp;
      r = swap;
    }
  }

  for (var start = (len - 2) >> 1; start >= 0; start--) {
    siftDown(start, len - 1);
  }
  for (var end = len - 1; end > 0; end--) {
    final tmp = order[lo + end];
    order[lo + end] = order[lo];
    order[lo] = tmp;
    siftDown(0, end - 1);
  }
}

void _introsortEdgeOrder(
  Int32List order,
  Float64List ax,
  Float64List ay,
  int lo,
  int hi,
  int depthLimit,
) {
  while (hi - lo > 16) {
    if (depthLimit == 0) {
      _heapsortEdgeOrder(order, ax, ay, lo, hi);
      return;
    }
    depthLimit--;
    final mid = lo + ((hi - lo) >> 1);
    if (_edgeOrderLess(order[mid], order[lo], ax, ay)) {
      final t = order[lo];
      order[lo] = order[mid];
      order[mid] = t;
    }
    if (_edgeOrderLess(order[hi], order[lo], ax, ay)) {
      final t = order[lo];
      order[lo] = order[hi];
      order[hi] = t;
    }
    if (_edgeOrderLess(order[hi], order[mid], ax, ay)) {
      final t = order[mid];
      order[mid] = order[hi];
      order[hi] = t;
    }
    final pivot = order[mid];
    var i = lo - 1;
    var j = hi + 1;
    while (true) {
      do {
        i++;
      } while (_edgeOrderLess(order[i], pivot, ax, ay));
      do {
        j--;
      } while (_edgeOrderLess(pivot, order[j], ax, ay));
      if (i >= j) break;
      final t = order[i];
      order[i] = order[j];
      order[j] = t;
    }
    if (j - lo < hi - j) {
      _introsortEdgeOrder(order, ax, ay, lo, j, depthLimit);
      lo = j + 1;
    } else {
      _introsortEdgeOrder(order, ax, ay, j + 1, hi, depthLimit);
      hi = j;
    }
  }
  _insertionSortEdgeOrder(order, ax, ay, lo, hi);
}
