part of '../fastlottie.dart';

/// New per-player state, sharing immutable compiled keyframes instead of parsing
/// JSON again. The template never receives native Path/Paint/cache objects.
class _Fork {
  _Fork({this.warm = false});
  final bool warm;
  final _memo = Map<Object, Object>.identity();
  T _copy<T extends Object>(T source, T Function() create) {
    final result = _memo.putIfAbsent(source, create) as T;
    if (warm) _prime(result);
    return result;
  }

  bool _prime(Object value) => switch (value) {
    _Group g => g.isPathStatic == g.isStatic,
    _PathSource s => s.isPathStatic == s.isStatic,
    _Draw d => d.isStatic,
    _Layer l => l.isStatic == l.hasAnySpatialTransform,
    _Transform t => t.isStatic,
    _Compiler c => c.isStatic,
    _ => false,
  };
  _Track track(_Track value) => _copy(value, () => _Track.fork(value));
  _Transform transform(_Transform v) => _copy(
    v,
    () => _Transform(
      track(v.anchor),
      track(v.position),
      track(v.scale),
      track(v.rotation),
      track(v.opacity),
      v.x == null ? null : track(v.x!),
      v.y == null ? null : track(v.y!),
      v.skew == null ? null : track(v.skew!),
      v.skewAxis == null ? null : track(v.skewAxis!),
    ),
  );
  _PathSource source(_PathSource v) {
    if (v is _Group) return group(v);
    if (v is _Shape) return _copy(v, () => _Shape(source(v.content)));
    if (v is _TrimPart) return _copy(v, () => _TrimPart(trim(v.trim), v.index));
    if (v is _BezierGeometry) {
      return _copy(
        v,
        () => _BezierGeometry(track(v.track), v.closed, v.closures),
      );
    }
    if (v is _Primitive) {
      return _copy(
        v,
        () => _Primitive(
          v.ellipse,
          track(v.position),
          track(v.size),
          track(v.radius),
          v.reverse,
        ),
      );
    }
    if (v is _PolyStarGeometry) {
      return _copy(
        v,
        () => _PolyStarGeometry(
          v.isStar,
          track(v.points),
          track(v.position),
          track(v.rotation),
          track(v.outerRadius),
          track(v.outerRoundness),
          v.innerRadius == null ? null : track(v.innerRadius!),
          v.innerRoundness == null ? null : track(v.innerRoundness!),
          v.reverse,
        ),
      );
    }
    throw StateError('Unknown compiled geometry');
  }

  _Draw draw(_Draw v) {
    if (v is _Group) return group(v);
    if (v is _Style) {
      return _copy(
        v,
        () => _Style(
          v.sources.map(source).toList(),
          track(v.color),
          track(v.opacity),
          track(v.width),
          v.stroke,
          v.evenOdd,
          v.cap,
          v.join,
          v.miter,
          gradient: v.gradient == null ? null : gradient(v.gradient!),
          dash: v.dash == null ? null : dash(v.dash!),
        ),
      );
    }
    throw StateError('Unknown compiled paint');
  }

  _Group group(_Group v) => _copy(
    v,
    () => _Group(
      v.sources.map(source).toList(),
      v.draws.map(draw).toList(),
      transform(v.transform),
    ),
  );
  _GradientSpec gradient(_GradientSpec v) => _copy(
    v,
    () => _GradientSpec(
      v.count,
      track(v.stops),
      track(v.start),
      track(v.end),
      v.radial,
    ),
  );
  _Trim trim(_Trim v) => _copy(
    v,
    () => _Trim(
      v.inputs.map(source).toList(),
      track(v.start),
      track(v.end),
      track(v.offset),
      v.individual,
    ),
  );
  _Dash dash(_Dash v) =>
      _copy(v, () => _Dash(v.intervals.map(track).toList(), track(v.offset)));
  _Layer layer(_Layer v) => _copy(
    v,
    () =>
        _Layer(
            transform(v.transform),
            v.group == null ? null : group(v.group!),
            v.ip,
            v.op,
            v.hidden,
            child: v.child == null ? null : scene(v.child!),
            offset: v.offset,
            stretch: v.stretch,
            timeRemap: v.timeRemap == null ? null : track(v.timeRemap!),
            matteType: v.matteType,
          )
          ..parent = v.parent == null ? null : layer(v.parent!)
          ..isMatteSource = v.isMatteSource,
  );
  _Compiler scene(_Compiler v) => _copy(v, () {
    final result = _Compiler(v.options)
      ..width = v.width
      ..height = v.height
      ..start = v.start
      ..end = v.end
      ..fps = v.fps
      ..commands = v.commands
      ..hasStroke = v.hasStroke
      ..layers.addAll(v.layers.map(layer));
    for (var i = 0; i < v.layers.length; i++) {
      final matte = v.layers[i].matte;
      if (matte != null) result.layers[i].matte = layer(matte);
    }
    return result;
  });
}
