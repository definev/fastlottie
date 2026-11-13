part of '../fastlottie.dart';

abstract class _Draw {
  bool get isStatic;
  void draw(Canvas canvas, double frame, int alpha);
  Rect? drawBounds(double frame);
}

abstract class _PathSource {
  bool get isStatic;
  bool get isPathStatic;
  Path path(double frame);
  Rect? pathBounds(double frame);
}

Rect? _unionRect(Rect? a, Rect? b) {
  if (a == null) return b;
  if (b == null) return a;
  return Rect.fromLTRB(
    a.left < b.left ? a.left : b.left,
    a.top < b.top ? a.top : b.top,
    a.right > b.right ? a.right : b.right,
    a.bottom > b.bottom ? a.bottom : b.bottom,
  );
}

class _Transform {
  _Transform(
    this.anchor,
    this.position,
    this.scale,
    this.rotation,
    this.opacity,
    this.x,
    this.y, [
    this.skew,
    this.skewAxis,
  ]);
  factory _Transform.identity() => _Transform(
    _Track.constant([0, 0]),
    _Track.constant([0, 0]),
    _Track.constant([100, 100]),
    _Track.constant([0]),
    _Track.constant([100]),
    null,
    null,
  );
  final _Track anchor, position, scale, rotation, opacity;
  final _Track? x, y;
  final _Track? skew, skewAxis;
  Float64List? _matrixData;
  Float64List get _matrix => _matrixData ??= (Float64List(16)
    ..[10] = 1
    ..[15] = 1);
  double _dx = 0, _dy = 0;
  double _lastFrame = double.nan;

  static bool _isConst2(_Track t, double a, double b) =>
      t.isStatic && t.constant![0] == a && t.constant![1] == b;
  static bool _isConst1(_Track? t, double v) =>
      t == null || (t.isStatic && t.constant![0] == v);

  late final bool isSpatialStatic =
      anchor.isStatic &&
      position.isStatic &&
      scale.isStatic &&
      rotation.isStatic &&
      (skew?.isStatic ?? true) &&
      (skewAxis?.isStatic ?? true) &&
      (x?.isStatic ?? true) &&
      (y?.isStatic ?? true);
  late final bool isTranslationOnly =
      _isConst2(scale, 100, 100) &&
      _isConst1(rotation, 0) &&
      _isConst1(skew, 0);
  late final bool isSpatialIdentity =
      isTranslationOnly &&
      _isConst2(anchor, 0, 0) &&
      (x == null && y == null
          ? _isConst2(position, 0, 0)
          : (_isConst1(x, 0) && _isConst1(y, 0)));
  late final bool isStatic = isSpatialStatic && opacity.isStatic;

  void _evalTranslation(double frame) {
    if (_lastFrame == frame || (isSpatialStatic && !_lastFrame.isNaN)) return;
    _lastFrame = frame;
    final a = anchor.at(frame);
    final p = (x == null || y == null) ? position.at(frame) : null;
    _dx = (x?.scalar(frame) ?? p![0]) - a[0];
    _dy = (y?.scalar(frame) ?? p![1]) - a[1];
  }

  Float64List matrix(double frame) {
    if (_lastFrame == frame || (isSpatialStatic && !_lastFrame.isNaN)) {
      return _matrix;
    }
    _lastFrame = frame;
    final m = _matrix;
    final a = anchor.at(frame), p = position.at(frame), s = scale.at(frame);
    final rotDeg = rotation.scalar(frame);
    final cos = rotDeg == 0 ? 1.0 : math.cos(rotDeg * math.pi / 180);
    final sin = rotDeg == 0 ? 0.0 : math.sin(rotDeg * math.pi / 180);
    final sx = s[0] / 100, sy = s[1] / 100;
    m[0] = cos * sx;
    m[1] = sin * sx;
    m[4] = -sin * sy;
    m[5] = cos * sy;
    final k = skew?.scalar(frame) ?? 0;
    if (k != 0) {
      final axis = (90 - (skewAxis?.scalar(frame) ?? 0)) * math.pi / 180;
      final c = math.cos(axis),
          sn = math.sin(axis),
          t = math.tan(k * math.pi / 180);
      final ma = 1 + t * c * sn,
          mb = -t * sn * sn,
          md = t * c * c,
          me = 1 - t * c * sn;
      m[0] = (cos * ma - sin * mb) * sx;
      m[1] = (sin * ma + cos * mb) * sx;
      m[4] = (cos * md - sin * me) * sy;
      m[5] = (sin * md + cos * me) * sy;
    }
    m[12] = (x?.scalar(frame) ?? p[0]) - m[0] * a[0] - m[4] * a[1];
    m[13] = (y?.scalar(frame) ?? p[1]) - m[1] * a[0] - m[5] * a[1];
    return m;
  }

  Rect transformRect(Rect r, double frame) {
    if (isSpatialIdentity) return r;
    if (isTranslationOnly) {
      _evalTranslation(frame);
      return (_dx == 0 && _dy == 0) ? r : r.shift(Offset(_dx, _dy));
    }
    final m = matrix(frame);
    final a = m[0], b = m[1], c = m[4], d = m[5], tx = m[12], ty = m[13];
    final cx = (r.left + r.right) * 0.5;
    final cy = (r.top + r.bottom) * 0.5;
    final hw = (r.right - r.left) * 0.5;
    final hh = (r.bottom - r.top) * 0.5;
    final ncx = a * cx + c * cy + tx;
    final ncy = b * cx + d * cy + ty;
    final nhw = a.abs() * hw + c.abs() * hh;
    final nhh = b.abs() * hw + d.abs() * hh;
    return Rect.fromLTRB(ncx - nhw, ncy - nhh, ncx + nhw, ncy + nhh);
  }
}

class _Mask {
  _Mask(
    this.geometry,
    this.mode,
    this.opacity,
    this.inverted, {
    this.expand,
  });
  final _BezierGeometry geometry;
  final String mode; // 'a', 's', 'i', 'f', 'n'
  final _Track opacity;
  final bool inverted;
  final _Track? expand;

  late final bool isStatic =
      geometry.isStatic &&
      opacity.isStatic &&
      (expand?.isStatic ?? true);

  Path path(double frame) => geometry.path(frame);
}

class _Layer {
  _Layer(
    this.transform,
    this.group,
    this.ip,
    this.op,
    this.hidden, {
    this.child,
    this.offset = 0,
    this.stretch = 1,
    this.timeRemap,
    this.matteType = 0,
    this.masks,
    this.blendMode = 0,
  });
  final _Transform transform;
  final _Group? group;
  final double ip, op;
  final bool hidden;
  final _Compiler? child;
  final double offset, stretch;
  final _Track? timeRemap;
  final int matteType;
  final List<_Mask>? masks;
  final int blendMode;
  _Layer? matte;
  bool isMatteSource = false;
  late final Paint contentPaint = Paint();
  late final Paint mattePaint = Paint()
    ..blendMode = (matteType == 2 || matteType == 4)
        ? BlendMode.dstOut
        : BlendMode.dstIn
    ..colorFilter = matteType >= 3
        ? const ColorFilter.matrix([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            .299,
            .587,
            .114,
            0,
            0,
          ])
        : null;
  _Layer? parent;
  late final bool isStatic =
      transform.isStatic &&
      (timeRemap?.isStatic ?? true) &&
      (group?.isStatic ?? true) &&
      (child?.isStatic ?? true) &&
      (parent?.isStatic ?? true) &&
      (masks?.every((m) => m.isStatic) ?? true);
  late final bool hasStaticSpatialChain =
      transform.isSpatialStatic && (parent?.hasStaticSpatialChain ?? true);

  late final bool hasAnySpatialTransform =
      !transform.isSpatialIdentity || (parent?.hasAnySpatialTransform ?? false);

  Rect? _cachedWorldBounds;
  double _lastWorldBoundsFrame = double.nan;

  void applyParents(Canvas canvas, double frame) {
    parent?.applyParents(canvas, frame);
    if (!transform.isSpatialIdentity) {
      if (transform.isTranslationOnly) {
        transform._evalTranslation(frame);
        if (transform._dx != 0 || transform._dy != 0) {
          canvas.translate(transform._dx, transform._dy);
        }
      } else {
        canvas.transform(transform.matrix(frame));
      }
    }
  }

  Rect? worldBounds(double frame) {
    if (!visible(frame)) return null;
    if (child == null && isStatic && !_lastWorldBoundsFrame.isNaN) {
      return _cachedWorldBounds;
    }
    if (_lastWorldBoundsFrame == frame) return _cachedWorldBounds;
    _lastWorldBoundsFrame = frame;
    var bounds = group?.drawBounds(frame);
    if (child != null) {
      final childFrame = timeRemap != null
          ? timeRemap!.scalar(frame) * child!.fps - child!.start
          : (frame - offset) / stretch;
      bounds = _unionRect(bounds, child!.worldBounds(childFrame));
    }
    if (bounds == null) return _cachedWorldBounds = null;
    if (masks != null && masks!.isNotEmpty) {
      Rect? maskBounds;
      for (var i = 0; i < masks!.length; i++) {
        final m = masks![i];
        if (m.mode == 'a' && !m.inverted) {
          final mb = m.geometry.pathBounds(frame);
          if (mb != null) maskBounds = _unionRect(maskBounds, mb);
        }
      }
      if (maskBounds != null) {
        bounds = bounds.intersect(maskBounds);
        if (bounds.isEmpty) return _cachedWorldBounds = null;
      }
    }
    for (_Layer? p = this; p != null; p = p.parent) {
      bounds = p.transform.transformRect(bounds!, frame);
    }
    return _cachedWorldBounds = bounds;
  }

  bool visible(double frame) =>
      !hidden && (group != null || child != null) && frame >= ip && frame < op;

  int effectiveAlpha(double frame, int parentAlpha) {
    var a = (parentAlpha * transform.opacity.scalar(frame).round() / 100)
        .toInt()
        .clamp(0, 255);
    final ms = masks;
    if (ms != null && ms.length == 1 && ms[0].mode == 'a') {
      final mo = ms[0].opacity.scalar(frame);
      if (mo < 100) {
        a = (a * mo / 100).round().clamp(0, 255);
      }
    }
    return a;
  }

  void draw(Canvas canvas, double frame, int parentAlpha) {
    if (!visible(frame)) return;
    final alpha = effectiveAlpha(frame, parentAlpha);
    if (alpha == 0) return;
    final childFrame = timeRemap != null
        ? timeRemap!.scalar(frame) * child!.fps - child!.start
        : (frame - offset) / stretch;
    final hasActiveMasks = masks != null && masks!.any((m) => m.mode != 'n');
    final uiBlendMode = _resolveBlendMode(blendMode);
    if (!hasAnySpatialTransform && !hasActiveMasks && uiBlendMode == null) {
      group?.draw(canvas, frame, alpha);
      child?.draw(canvas, childFrame, alpha);
      return;
    }
    if (uiBlendMode != null) {
      final bounds = worldBounds(frame) ?? Rect.largest;
      canvas.saveLayer(bounds, contentPaint..blendMode = uiBlendMode);
    } else {
      canvas.save();
    }
    applyParents(canvas, frame);
    if (hasActiveMasks) {
      _applyCanvasMasks(canvas, frame);
    }
    group?.draw(canvas, frame, alpha);
    child?.draw(canvas, childFrame, alpha);
    canvas.restore();
  }

  void _applyCanvasMasks(Canvas canvas, double frame) {
    final list = masks;
    if (list == null || list.isEmpty) return;
    if (list.length == 1) {
      final m = list[0];
      if (m.mode == 'a' && !m.inverted) {
        canvas.clipPath(m.path(frame));
        return;
      }
      if (m.mode == 'n') return;
    }
    Path? combined;
    for (var i = 0; i < list.length; i++) {
      final m = list[i];
      if (m.mode == 'n') continue;
      final p = m.path(frame);
      if (m.mode == 'a' && !m.inverted) {
        combined = combined == null
            ? p
            : Path.combine(PathOperation.union, combined, p);
      } else if (m.mode == 's' && !m.inverted) {
        final b = worldBounds(frame) ?? Rect.largest;
        final base = combined ?? (Path()..addRect(b));
        combined = Path.combine(PathOperation.difference, base, p);
      } else if (m.mode == 'i' && !m.inverted) {
        if (combined != null) {
          combined = Path.combine(PathOperation.intersect, combined, p);
        }
      } else if (m.mode == 'f' && !m.inverted) {
        combined = combined == null
            ? p
            : Path.combine(PathOperation.xor, combined, p);
      } else if (m.inverted) {
        final b = worldBounds(frame) ?? Rect.largest;
        final invPath = Path.combine(
          PathOperation.difference,
          Path()..addRect(b),
          p,
        );
        combined = combined == null
            ? invPath
            : Path.combine(PathOperation.union, combined, invPath);
      }
    }
    if (combined != null) {
      canvas.clipPath(combined);
    }
  }
}

BlendMode? _resolveBlendMode(int bm) => switch (bm) {
  1 => BlendMode.multiply,
  2 => BlendMode.screen,
  3 => BlendMode.overlay,
  4 => BlendMode.darken,
  5 => BlendMode.lighten,
  6 => BlendMode.colorDodge,
  7 => BlendMode.colorBurn,
  8 => BlendMode.hardLight,
  9 => BlendMode.softLight,
  10 => BlendMode.difference,
  11 => BlendMode.exclusion,
  12 => BlendMode.hue,
  13 => BlendMode.saturation,
  14 => BlendMode.color,
  15 => BlendMode.luminosity,
  16 => BlendMode.plus,
  _ => null,
};

class _Group implements _PathSource, _Draw {
  _Group(this.sources, this.draws, this.transform);
  final List<_PathSource> sources;
  final List<_Draw> draws;
  final _Transform transform;
  Path? _cachedPath;
  Path? _ownedPath;
  double _lastFrame = double.nan;
  Rect? _cachedPathBounds, _cachedDrawBounds;
  double _lastPathBoundsFrame = double.nan, _lastDrawBoundsFrame = double.nan;

  @override
  late final bool isStatic =
      transform.isStatic &&
      sources.every((s) => s.isStatic) &&
      draws.every((d) => d.isStatic);
  @override
  late final bool isPathStatic =
      transform.isSpatialStatic && sources.every((s) => s.isPathStatic);

  @override
  Path path(double frame) {
    if (_cachedPath != null && (isPathStatic || _lastFrame == frame)) {
      return _cachedPath!;
    }
    _lastFrame = frame;
    if (transform.isSpatialIdentity && sources.length == 1) {
      return _cachedPath = sources[0].path(frame);
    }
    final path = (_ownedPath ??= Path())..reset();
    if (transform.isSpatialIdentity) {
      for (final source in sources.reversed) {
        path.addPath(source.path(frame), Offset.zero);
      }
    } else if (transform.isTranslationOnly) {
      transform._evalTranslation(frame);
      final offset = Offset(transform._dx, transform._dy);
      for (final source in sources.reversed) {
        path.addPath(source.path(frame), offset);
      }
    } else {
      final matrix = transform.matrix(frame);
      for (final source in sources.reversed) {
        path.addPath(source.path(frame), Offset.zero, matrix4: matrix);
      }
    }
    return _cachedPath = path;
  }

  @override
  Rect? pathBounds(double frame) {
    if (isPathStatic && !_lastPathBoundsFrame.isNaN) return _cachedPathBounds;
    if (_lastPathBoundsFrame == frame) return _cachedPathBounds;
    _lastPathBoundsFrame = frame;
    Rect? acc;
    for (final s in sources) {
      acc = _unionRect(acc, s.pathBounds(frame));
    }
    if (acc == null) return _cachedPathBounds = null;
    return _cachedPathBounds = transform.transformRect(acc, frame);
  }

  @override
  Rect? drawBounds(double frame) {
    if (isStatic && !_lastDrawBoundsFrame.isNaN) return _cachedDrawBounds;
    if (_lastDrawBoundsFrame == frame) return _cachedDrawBounds;
    _lastDrawBoundsFrame = frame;
    if (transform.opacity.scalar(frame).round() <= 0) {
      return _cachedDrawBounds = null;
    }
    Rect? acc;
    for (final d in draws) {
      acc = _unionRect(acc, d.drawBounds(frame));
    }
    if (acc == null) return _cachedDrawBounds = null;
    return _cachedDrawBounds = transform.transformRect(acc, frame);
  }

  @override
  void draw(Canvas canvas, double frame, int alpha) {
    alpha = (alpha * transform.opacity.scalar(frame).round() / 100)
        .round()
        .clamp(0, 255);
    if (alpha == 0) return;
    if (transform.isSpatialIdentity) {
      for (final d in draws.reversed) {
        d.draw(canvas, frame, alpha);
      }
      return;
    }
    if (transform.isTranslationOnly) {
      transform._evalTranslation(frame);
      if (transform._dx == 0 && transform._dy == 0) {
        for (final d in draws.reversed) {
          d.draw(canvas, frame, alpha);
        }
        return;
      }
      canvas.save();
      canvas.translate(transform._dx, transform._dy);
      for (final d in draws.reversed) {
        d.draw(canvas, frame, alpha);
      }
      canvas.restore();
      return;
    }
    canvas.save();
    canvas.transform(transform.matrix(frame));
    for (final d in draws.reversed) {
      d.draw(canvas, frame, alpha);
    }
    canvas.restore();
  }
}

class _MergePathSource implements _PathSource {
  _MergePathSource(this.sources, this.mode);
  final List<_PathSource> sources;
  final int mode;

  @override
  late final bool isStatic = sources.every((s) => s.isStatic);
  @override
  late final bool isPathStatic = sources.every((s) => s.isPathStatic);

  Path? _cached;
  double _last = double.nan;
  Rect? _cachedBounds;
  double _lastBoundsFrame = double.nan;

  @override
  Path path(double frame) {
    if (_cached != null && (isPathStatic || _last == frame)) {
      return _cached!;
    }
    _last = frame;
    if (sources.isEmpty) {
      return _cached = Path();
    }
    if (sources.length == 1) {
      final p = sources[0].path(frame);
      if (mode == 1 || mode == 2 || mode == 5) {
        return _cached = p;
      }
      final op = mode == 3
          ? PathOperation.reverseDifference
          : PathOperation.intersect;
      return _cached = Path.combine(op, p, Path());
    }

    if (mode == 1) {
      final p = Path();
      for (var i = 0; i < sources.length; i++) {
        p.addPath(sources[i].path(frame), Offset.zero);
      }
      return _cached = p;
    }

    final op = switch (mode) {
      2 => PathOperation.union,
      3 => PathOperation.reverseDifference,
      4 => PathOperation.intersect,
      5 => PathOperation.xor,
      _ => PathOperation.union,
    };

    final remainder = Path();
    for (var i = 0; i < sources.length - 1; i++) {
      remainder.addPath(sources[i].path(frame), Offset.zero);
    }
    final first = sources.last.path(frame);
    return _cached = Path.combine(op, first, remainder);
  }

  @override
  Rect? pathBounds(double frame) {
    if (isPathStatic && !_lastBoundsFrame.isNaN) return _cachedBounds;
    if (_lastBoundsFrame == frame) return _cachedBounds;
    _lastBoundsFrame = frame;
    if (sources.isEmpty) return _cachedBounds = null;
    if (sources.length == 1) return _cachedBounds = sources[0].pathBounds(frame);

    if (mode == 4) {
      final b1 = sources.last.pathBounds(frame);
      if (b1 == null) return _cachedBounds = null;
      Rect? b2;
      for (var i = 0; i < sources.length - 1; i++) {
        b2 = _unionRect(b2, sources[i].pathBounds(frame));
      }
      if (b2 == null) return _cachedBounds = null;
      final inter = b1.intersect(b2);
      return _cachedBounds = inter.isEmpty ? null : inter;
    }

    Rect? acc;
    for (var i = 0; i < sources.length; i++) {
      acc = _unionRect(acc, sources[i].pathBounds(frame));
    }
    return _cachedBounds = acc;
  }
}

abstract class _Geometry implements _PathSource {
  @override
  bool get isPathStatic => isStatic;
  Path? _cached;
  double _last = double.nan;
  Rect? _cachedBounds;
  double _lastBoundsFrame = double.nan;
  Path build(double frame);
  Rect computeBounds(double frame);

  @override
  Path path(double frame) {
    if (_cached != null && (isStatic || frame == _last)) return _cached!;
    _last = frame;
    return _cached = build(frame);
  }

  @override
  Rect? pathBounds(double frame) {
    if (isStatic && !_lastBoundsFrame.isNaN) return _cachedBounds;
    if (_lastBoundsFrame == frame) return _cachedBounds;
    _lastBoundsFrame = frame;
    return _cachedBounds = computeBounds(frame);
  }
}

Path _contour(
  List<double> points,
  bool closed, {
  Path? target,
  bool reverse = false,
  bool? closingCurve,
}) {
  final path = target != null ? (target..reset()) : Path();
  final count = points.length ~/ 6;
  if (count == 0) return path;
  path.moveTo(points[0], points[1]);
  final limit = (closingCurve ?? closed) ? count : count - 1;
  for (var step = 1; step <= limit; step++) {
    final previous = reverse ? (count - step + 1) % count : step - 1;
    final current = reverse ? (count - step) % count : step % count;
    final p = previous * 6, c = current * 6;
    final out = reverse ? 2 : 4, inc = reverse ? 4 : 2;
    if (points[p + out] == 0 &&
        points[p + out + 1] == 0 &&
        points[c + inc] == 0 &&
        points[c + inc + 1] == 0) {
      path.lineTo(points[c], points[c + 1]);
      continue;
    }
    path.cubicTo(
      points[p] + points[p + out],
      points[p + 1] + points[p + out + 1],
      points[c] + points[c + inc],
      points[c + 1] + points[c + inc + 1],
      points[c],
      points[c + 1],
    );
  }
  if (closed) path.close();
  return path;
}

class _BezierGeometry extends _Geometry {
  _BezierGeometry(this.track, this.closed, [this.closures = const []]);
  final _Track track;
  final bool closed;
  final List<(bool, bool)> closures;
  @override
  bool get isStatic => track.isStatic;

  @override
  Rect computeBounds(double frame) {
    final pts = track.at(frame);
    if (pts.isEmpty) return Rect.zero;
    var minX = pts[0], maxX = pts[0], minY = pts[1], maxY = pts[1];
    for (var i = 0; i < pts.length; i += 6) {
      final vx = pts[i], vy = pts[i + 1];
      final ix = vx + pts[i + 2], iy = vy + pts[i + 3];
      final ox = vx + pts[i + 4], oy = vy + pts[i + 5];
      if (vx < minX) minX = vx;
      if (vx > maxX) maxX = vx;
      if (vy < minY) minY = vy;
      if (vy > maxY) maxY = vy;
      if (ix < minX) minX = ix;
      if (ix > maxX) maxX = ix;
      if (iy < minY) minY = iy;
      if (iy > maxY) maxY = iy;
      if (ox < minX) minX = ox;
      if (ox > maxX) maxX = ox;
      if (oy < minY) minY = oy;
      if (oy > maxY) maxY = oy;
    }
    return Rect.fromLTRB(minX, minY, maxX, maxY);
  }

  @override
  Path build(double frame) {
    final target = _cached ??= Path();
    final points = track.at(frame);
    if (closures.isEmpty) return _contour(points, closed, target: target);
    if (frame <= track.keyframes!.times.first) {
      return _contour(points, closures.first.$1, target: target);
    }
    if (frame >= track.keyframes!.times.last) {
      return _contour(points, closures.last.$1, target: target);
    }
    final (startClosed, endClosed) = closures[track._cursor];
    // rlottie interpolates the common cubic segments, then closes according to
    // the segment's start shape. A missing closing cubic becomes a straight
    // close; closure changes at the next key, without interpolating a bool.
    return _contour(
      points,
      startClosed,
      target: target,
      closingCurve: startClosed && endClosed,
    );
  }
}

class _Primitive extends _Geometry {
  _Primitive(this.ellipse, this.position, this.size, this.radius, this.reverse);
  final bool ellipse, reverse;
  final _Track position, size, radius;
  @override
  bool get isStatic => position.isStatic && size.isStatic && radius.isStatic;

  @override
  Rect computeBounds(double frame) {
    final p = position.at(frame), s = size.at(frame);
    final hw = (s[0] * 0.5).abs(), hh = (s[1] * 0.5).abs();
    return Rect.fromLTRB(p[0] - hw, p[1] - hh, p[0] + hw, p[1] + hh);
  }

  @override
  Path build(double frame) {
    final path = (_cached ??= Path())..reset();
    final p = position.at(frame), s = size.at(frame);
    final x = p[0], y = p[1], w = s[0] * 0.5, h = s[1] * 0.5;
    const k = .5522847498307936;
    if (ellipse) {
      final kw = w * k, kh = h * k;
      path.moveTo(x, y - h);
      if (!reverse) {
        path.cubicTo(x + kw, y - h, x + w, y - kh, x + w, y);
        path.cubicTo(x + w, y + kh, x + kw, y + h, x, y + h);
        path.cubicTo(x - kw, y + h, x - w, y + kh, x - w, y);
        path.cubicTo(x - w, y - kh, x - kw, y - h, x, y - h);
      } else {
        path.cubicTo(x - kw, y - h, x - w, y - kh, x - w, y);
        path.cubicTo(x - w, y + kh, x - kw, y + h, x, y + h);
        path.cubicTo(x + kw, y + h, x + w, y + kh, x + w, y);
        path.cubicTo(x + w, y - kh, x + kw, y - h, x, y - h);
      }
      path.close();
      return path;
    }
    final r = radius.scalar(frame).clamp(0.0, math.min(w.abs(), h.abs()));
    if (r == 0) {
      path.moveTo(x + w, y - h);
      if (!reverse) {
        path.lineTo(x + w, y + h);
        path.lineTo(x - w, y + h);
        path.lineTo(x - w, y - h);
      } else {
        path.lineTo(x - w, y - h);
        path.lineTo(x - w, y + h);
        path.lineTo(x + w, y + h);
      }
      path.close();
      return path;
    }
    if (!reverse) {
      path
        ..moveTo(x + w, y - h + r)
        ..lineTo(x + w, y + h - r)
        ..arcTo(
          Rect.fromLTRB(x + w - 2 * r, y + h - 2 * r, x + w, y + h),
          0,
          math.pi / 2,
          false,
        )
        ..lineTo(x - w + r, y + h)
        ..arcTo(
          Rect.fromLTRB(x - w, y + h - 2 * r, x - w + 2 * r, y + h),
          math.pi / 2,
          math.pi / 2,
          false,
        )
        ..lineTo(x - w, y - h + r)
        ..arcTo(
          Rect.fromLTRB(x - w, y - h, x - w + 2 * r, y - h + 2 * r),
          math.pi,
          math.pi / 2,
          false,
        )
        ..lineTo(x + w - r, y - h)
        ..arcTo(
          Rect.fromLTRB(x + w - 2 * r, y - h, x + w, y - h + 2 * r),
          3 * math.pi / 2,
          math.pi / 2,
          false,
        )
        ..close();
      return path;
    }
    final rk = r * k;
    path
      ..moveTo(x + w, y - h + r)
      ..cubicTo(x + w, y - h + r - rk, x + w - r + rk, y - h, x + w - r, y - h)
      ..lineTo(x - w + r, y - h)
      ..cubicTo(x - w + r - rk, y - h, x - w, y - h + r - rk, x - w, y - h + r)
      ..lineTo(x - w, y + h - r)
      ..cubicTo(x - w, y + h - r + rk, x - w + r - rk, y + h, x - w + r, y + h)
      ..lineTo(x + w - r, y + h)
      ..cubicTo(x + w - r + rk, y + h, x + w, y + h - r + rk, x + w, y + h - r)
      ..close();
    return path;
  }
}

class _PolyStarGeometry extends _Geometry {
  _PolyStarGeometry(
    this.isStar,
    this.points,
    this.position,
    this.rotation,
    this.outerRadius,
    this.outerRoundness,
    this.innerRadius,
    this.innerRoundness,
    this.reverse,
  );

  final bool isStar, reverse;
  final _Track points, position, rotation, outerRadius, outerRoundness;
  final _Track? innerRadius, innerRoundness;

  @override
  bool get isStatic =>
      points.isStatic &&
      position.isStatic &&
      rotation.isStatic &&
      outerRadius.isStatic &&
      outerRoundness.isStatic &&
      (innerRadius?.isStatic ?? true) &&
      (innerRoundness?.isStatic ?? true);

  @override
  Rect computeBounds(double frame) {
    final p = position.at(frame);
    final r = outerRadius.scalar(frame).abs();
    final roundness = (outerRoundness.scalar(frame) * 0.01).abs();
    final maxR = r * (1.0 + roundness * 0.5);
    return Rect.fromLTRB(p[0] - maxR, p[1] - maxR, p[0] + maxR, p[1] + maxR);
  }

  @override
  Path build(double frame) {
    final path = (_cached ??= Path())..reset();
    _generatePolyStar(
      frame,
      path.moveTo,
      path.lineTo,
      (x1, y1, x2, y2, x3, y3, px, py) => path.cubicTo(x1, y1, x2, y2, x3, y3),
      path.close,
    );
    return path;
  }

  void _generatePolyStar(
    double frame,
    void Function(double x, double y) moveTo,
    void Function(double x, double y) lineTo,
    void Function(
      double x1,
      double y1,
      double x2,
      double y2,
      double x3,
      double y3,
      double prevX,
      double prevY,
    )
    cubicTo,
    void Function() close,
  ) {
    final pos = position.at(frame);
    final px = pos[0], py = pos[1];
    final rot = rotation.scalar(frame);
    final or = outerRadius.scalar(frame);
    final os = outerRoundness.scalar(frame);
    final rawPts = points.scalar(frame);

    if (isStar) {
      final pts = math.max(1.0, rawPts);
      final ir = innerRadius?.scalar(frame) ?? 0.0;
      final isR = innerRoundness?.scalar(frame) ?? 0.0;
      var currentAngle = (rot - 90.0) * math.pi / 180.0;
      var anglePerPoint = 2.0 * math.pi / pts;
      if (reverse) anglePerPoint *= -1.0;
      final halfAnglePerPoint = anglePerPoint / 2.0;
      final partialPointAmount = pts - pts.floorToDouble();
      if (partialPointAmount != 0.0) {
        currentAngle += halfAnglePerPoint * (1.0 - partialPointAmount);
      }
      final innerRoundedness = isR / 100.0;
      final outerRoundedness = os / 100.0;

      double x, y;
      double previousX, previousY;
      var partialPointRadius = 0.0;
      if (partialPointAmount != 0.0) {
        partialPointRadius = ir + partialPointAmount * (or - ir);
        x = px + partialPointRadius * math.cos(currentAngle);
        y = py + partialPointRadius * math.sin(currentAngle);
        moveTo(x, y);
        currentAngle += anglePerPoint * partialPointAmount / 2.0;
      } else {
        x = px + or * math.cos(currentAngle);
        y = py + or * math.sin(currentAngle);
        moveTo(x, y);
        currentAngle += halfAnglePerPoint;
      }

      var longSegment = false;
      final numPoints = (pts.ceil() * 2);
      for (var i = 0; i < numPoints; i++) {
        var radius = longSegment ? or : ir;
        var dTheta = halfAnglePerPoint;
        if (partialPointRadius != 0.0 && i == numPoints - 2) {
          dTheta = anglePerPoint * partialPointAmount / 2.0;
        }
        if (partialPointRadius != 0.0 && i == numPoints - 1) {
          radius = partialPointRadius;
        }
        previousX = x;
        previousY = y;
        x = px + radius * math.cos(currentAngle);
        y = py + radius * math.sin(currentAngle);

        if (innerRoundedness == 0.0 && outerRoundedness == 0.0) {
          lineTo(x, y);
        } else {
          final cp1Theta =
              math.atan2(previousY - py, previousX - px) - math.pi / 2.0;
          final cp1Dx = math.cos(cp1Theta);
          final cp1Dy = math.sin(cp1Theta);

          final cp2Theta = math.atan2(y - py, x - px) - math.pi / 2.0;
          final cp2Dx = math.cos(cp2Theta);
          final cp2Dy = math.sin(cp2Theta);

          final cp1Roundedness = longSegment
              ? innerRoundedness
              : outerRoundedness;
          final cp2Roundedness = longSegment
              ? outerRoundedness
              : innerRoundedness;
          final cp1Radius = longSegment ? ir : or;
          final cp2Radius = longSegment ? or : ir;

          var cp1x = cp1Radius * cp1Roundedness * 0.47829 * cp1Dx;
          var cp1y = cp1Radius * cp1Roundedness * 0.47829 * cp1Dy;
          var cp2x = cp2Radius * cp2Roundedness * 0.47829 * cp2Dx;
          var cp2y = cp2Radius * cp2Roundedness * 0.47829 * cp2Dy;

          if (partialPointAmount != 0.0) {
            if (i == 0) {
              cp1x *= partialPointAmount;
              cp1y *= partialPointAmount;
            } else if (i == numPoints - 1) {
              cp2x *= partialPointAmount;
              cp2y *= partialPointAmount;
            }
          }
          cubicTo(
            previousX - cp1x,
            previousY - cp1y,
            x + cp2x,
            y + cp2y,
            x,
            y,
            previousX,
            previousY,
          );
        }
        currentAngle += dTheta;
        longSegment = !longSegment;
      }
      close();
    } else {
      final pts = math.max(1, rawPts.floor());
      var currentAngle = (rot - 90.0) * math.pi / 180.0;
      var anglePerPoint = 2.0 * math.pi / pts;
      if (reverse) anglePerPoint *= -1.0;
      final roundedness = os / 100.0;

      double previousX, previousY;
      var x = px + or * math.cos(currentAngle);
      var y = py + or * math.sin(currentAngle);
      moveTo(x, y);
      currentAngle += anglePerPoint;

      for (var i = 0; i < pts; i++) {
        previousX = x;
        previousY = y;
        x = px + or * math.cos(currentAngle);
        y = py + or * math.sin(currentAngle);

        if (roundedness != 0.0) {
          final cp1Theta =
              math.atan2(previousY - py, previousX - px) - math.pi / 2.0;
          final cp1Dx = math.cos(cp1Theta);
          final cp1Dy = math.sin(cp1Theta);

          final cp2Theta = math.atan2(y - py, x - px) - math.pi / 2.0;
          final cp2Dx = math.cos(cp2Theta);
          final cp2Dy = math.sin(cp2Theta);

          final cp1x = or * roundedness * 0.25 * cp1Dx;
          final cp1y = or * roundedness * 0.25 * cp1Dy;
          final cp2x = or * roundedness * 0.25 * cp2Dx;
          final cp2y = or * roundedness * 0.25 * cp2Dy;

          cubicTo(
            previousX - cp1x,
            previousY - cp1y,
            x + cp2x,
            y + cp2y,
            x,
            y,
            previousX,
            previousY,
          );
        } else {
          lineTo(x, y);
        }
        currentAngle += anglePerPoint;
      }
      close();
    }
  }
}

class _Style implements _Draw {
  _Style(
    this.sources,
    this.color,
    this.opacity,
    this.width,
    this.stroke,
    this.evenOdd,
    this.cap,
    this.join,
    this.miter, {
    this.gradient,
    this.dash,
  });
  final List<_PathSource> sources;
  final _Track color, opacity, width;
  final bool stroke, evenOdd;
  final int cap, join;
  final double miter;
  final _GradientSpec? gradient;
  final _Dash? dash;
  // Native UI objects are created only by a player on its rendering isolate.
  late final Paint paint = Paint()
    ..isAntiAlias = true
    ..style = stroke ? PaintingStyle.stroke : PaintingStyle.fill
    ..strokeCap = [StrokeCap.butt, StrokeCap.round, StrokeCap.square][cap - 1]
    ..strokeJoin = [
      StrokeJoin.miter,
      StrokeJoin.round,
      StrokeJoin.bevel,
    ][join - 1]
    ..strokeMiterLimit = miter;
  Path? _path;
  Path? _dashedPath;
  bool _hasPath = false;
  bool _hasDashed = false;
  bool _checkedPrimitive = false;
  _Primitive? _singlePrimitive;
  double _dashFrame = double.nan;
  double _last = double.nan;
  int? _lastArgb;
  ui.Shader? _lastShader;
  double _lastStrokeWidth = double.nan;
  late final bool _staticPath = sources.every((s) => s.isPathStatic);
  late final Rect? _staticGeometryBounds = _geometryBounds(0);
  late final _PathSource? staticFillLeaf = _resolveStaticFillLeaf();

  _PathSource? _resolveStaticFillLeaf() {
    if (stroke || dash != null || sources.length != 1) return null;
    var source = sources.single;
    while (source is _Shape) {
      source = source.content;
    }
    if ((source is _Primitive ||
            source is _BezierGeometry ||
            source is _PolyStarGeometry) &&
        source.isPathStatic) {
      return source;
    }
    return null;
  }

  Rect? _geometryBounds(double frame) {
    Rect? bounds;
    for (final source in sources) {
      bounds = _unionRect(bounds, source.pathBounds(frame));
    }
    return bounds;
  }

  late final bool hasStaticCoverage =
      _staticPath && (!stroke || width.isStatic) && (dash?.isStatic ?? true);
  @override
  bool get isStatic =>
      _staticPath &&
      color.isStatic &&
      opacity.isStatic &&
      width.isStatic &&
      (gradient?.isStatic ?? true) &&
      (dash?.isStatic ?? true);

  @override
  Rect? drawBounds(double frame) {
    if (opacity.scalar(frame).round() <= 0) return null;
    double pad = 0;
    if (stroke) {
      final w = width.scalar(frame);
      if (w <= 0) return null;
      final factor = join == 1 ? math.max(1.42, miter) : 1.42;
      pad = w * 0.5 * factor + 1.0;
    }
    final acc = _staticPath ? _staticGeometryBounds : _geometryBounds(frame);
    if (acc == null) return null;
    return pad == 0 ? acc : acc.inflate(pad);
  }

  _Primitive? _resolvePrimitive() {
    if (_checkedPrimitive) return _singlePrimitive;
    _checkedPrimitive = true;
    if (dash == null && sources.length == 1) {
      final s = sources[0];
      if (s is _Shape && s.content is _Primitive) {
        final p = s.content as _Primitive;
        if (!p.ellipse) _singlePrimitive = p;
      }
    }
    return _singlePrimitive;
  }

  @override
  void draw(Canvas canvas, double frame, int alpha) {
    final c = color.at(frame);
    final a = (alpha * opacity.scalar(frame).round() / 100).round().clamp(
      0,
      255,
    );
    if (a == 0) return;
    final r = (c[0] * 255).round().clamp(0, 255);
    final g = (c[1] * 255).round().clamp(0, 255);
    final b = (c[2] * 255).round().clamp(0, 255);
    final argb = (a << 24) | (r << 16) | (g << 8) | b;
    if (_lastArgb != argb) {
      _lastArgb = argb;
      paint.color = Color.fromARGB(a, r, g, b);
    }
    if (gradient != null) {
      final s = gradient!.shader(frame);
      if (!identical(_lastShader, s)) {
        _lastShader = s;
        paint.shader = s;
      }
    } else if (_lastShader != null) {
      _lastShader = null;
      paint.shader = null;
    }
    if (stroke) {
      final w = width.scalar(frame);
      if (w <= 0) return;
      if (_lastStrokeWidth != w) {
        _lastStrokeWidth = w;
        paint.strokeWidth = w;
      }
    }
    final prim = _resolvePrimitive();
    if (prim != null) {
      final p = prim.position.at(frame), sz = prim.size.at(frame);
      final hw = (sz[0] * 0.5).abs(), hh = (sz[1] * 0.5).abs();
      if (hw > 0 && hh > 0) {
        final rect = Rect.fromLTRB(p[0] - hw, p[1] - hh, p[0] + hw, p[1] + hh);
        final r = prim.radius
            .scalar(frame)
            .clamp(0.0, math.min(hw, hh))
            .toDouble();
        if (r == 0) {
          canvas.drawRect(rect, paint);
        } else {
          canvas.drawRRect(
            RRect.fromRectAndRadius(rect, Radius.circular(r)),
            paint,
          );
        }
        return;
      }
    }
    late Path path;
    var pathChanged = false;
    if (sources.length == 1 && (stroke || !evenOdd)) {
      path = sources[0].path(frame);
      if (!_hasPath || (!_staticPath && frame != _last)) {
        _hasPath = true;
        _last = frame;
        pathChanged = true;
      }
    } else {
      if (!_hasPath || (!_staticPath && frame != _last)) {
        _hasPath = true;
        _last = frame;
        pathChanged = true;
        final p = (_path ??= Path())
          ..reset()
          ..fillType = evenOdd ? PathFillType.evenOdd : PathFillType.nonZero;
        for (final source in sources.reversed) {
          p.addPath(source.path(frame), Offset.zero);
        }
      }
      path = _path!;
    }
    final pattern = dash;
    if (pattern != null) {
      if (!_hasDashed ||
          pathChanged ||
          (!pattern.isStatic && frame != _dashFrame)) {
        _hasDashed = true;
        _dashFrame = frame;
        pattern.applyInto(
          path,
          frame,
          _dashedPath ??= Path(),
          staticSource: _staticPath,
        );
      }
      path = _dashedPath!;
    }
    canvas.drawPath(path, paint);
  }
}
