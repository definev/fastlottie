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

class _Layer {
  _Layer(
    this.transform,
    this.group,
    this.ip,
    this.op,
    this.hidden, {
    this.child,
    this.offset = 0,
    this.matteType = 0,
  });
  final _Transform transform;
  final _Group? group;
  final double ip, op;
  final bool hidden;
  final _Compiler? child;
  final double offset;
  final int matteType;
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
      (group?.isStatic ?? true) &&
      (child?.isStatic ?? true) &&
      (parent?.isStatic ?? true);
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
      bounds = _unionRect(bounds, child!.worldBounds(frame - offset));
    }
    if (bounds == null) return _cachedWorldBounds = null;
    for (_Layer? p = this; p != null; p = p.parent) {
      bounds = p.transform.transformRect(bounds!, frame);
    }
    return _cachedWorldBounds = bounds;
  }

  bool visible(double frame) =>
      !hidden && (group != null || child != null) && frame >= ip && frame < op;

  int effectiveAlpha(double frame, int parentAlpha) =>
      (parentAlpha * transform.opacity.scalar(frame).round() / 100)
          .toInt()
          .clamp(0, 255);

  void draw(Canvas canvas, double frame, int parentAlpha) {
    if (!visible(frame)) return;
    final alpha = effectiveAlpha(frame, parentAlpha);
    if (alpha == 0) return;
    if (!hasAnySpatialTransform) {
      group?.draw(canvas, frame, alpha);
      child?.draw(canvas, frame - offset, alpha);
      return;
    }
    canvas.save();
    applyParents(canvas, frame);
    group?.draw(canvas, frame, alpha);
    child?.draw(canvas, frame - offset, alpha);
    canvas.restore();
  }
}

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
    if (frame <= track.keys.first.time) {
      return _contour(points, closures.first.$1, target: target);
    }
    if (frame >= track.keys.last.time) {
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
    Rect? acc;
    for (final s in sources) {
      acc = _unionRect(acc, s.pathBounds(frame));
    }
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
        final r = prim.radius.scalar(frame).clamp(0.0, math.min(hw, hh)).toDouble();
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
