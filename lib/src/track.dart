part of '../fastlottie.dart';

class _Ease {
  _Ease(this.x1, this.y1, this.x2, this.y2) : isLinear = x1 == y1 && x2 == y2;
  final double x1, y1, x2, y2;
  final bool isLinear;
  double _bezier(double t, double a, double b) =>
      ((1 - 3 * b + 3 * a) * t + 3 * b - 6 * a) * t * t + 3 * a * t;
  double transform(double x) {
    if (isLinear) return x;
    var lo = 0.0, hi = 1.0, t = x;
    // Bracketed Newton: converges even for flat endpoint slopes.
    for (var i = 0; i < 16; i++) {
      final error = _bezier(t, x1, x2) - x;
      if (error.abs() < 1e-7) break;
      if (error > 0) {
        hi = t;
      } else {
        lo = t;
      }
      final slope =
          3 * (1 - 3 * x2 + 3 * x1) * t * t +
          2 * (3 * x2 - 6 * x1) * t +
          3 * x1;
      final candidate = slope.abs() > 1e-7 ? t - error / slope : -1.0;
      t = candidate > lo && candidate < hi ? candidate : (lo + hi) * .5;
    }
    return _bezier(t, y1, y2);
  }
}

class _Key {
  _Key(
    this.time,
    this.start,
    this.end,
    this.hold,
    this.eases, {
    this.to,
    this.ti,
  });
  final double time;
  final Float32List start;
  Float32List? end;
  Float32x4List? _startSimd;
  Float32x4List? _endSimd;
  final bool hold;
  final List<_Ease> eases;
  final Float32List? to, ti;
  _SpatialCurve? spatial;
  Float32x4List get startSimd =>
      _startSimd ??= start.buffer.asFloat32x4List(0, start.length ~/ 4);
  Float32x4List? get endSimd =>
      end == null ? null : (_endSimd ??= end!.buffer.asFloat32x4List(0, end!.length ~/ 4));
}

class _Track {
  _Track.fork(_Track source)
    : constant = source.constant,
      keys = source.keys,
      simd = source.simd,
      output = Float32List(source.output.length),
      gamma = source.gamma;
  _Track.constant(List<double> value)
    : constant = Float32List.fromList(value),
      keys = const [],
      simd = false,
      output = Float32List(0);
  _Track.animated(this.keys, this.simd)
    : constant = null,
      output = Float32List(keys.first.start.length);

  static final Float32List _srgbToLinear = _buildSrgbToLinear();
  static const int _lutSize = 4096;
  static final Float32List _linearToSrgb = _buildLinearToSrgb();

  static Float32List _buildSrgbToLinear() {
    final lut = Float32List(256);
    for (var i = 0; i < 256; i++) {
      final v = i / 255.0;
      lut[i] = v <= .04045
          ? v / 12.92
          : math.pow((v + .055) / 1.055, 2.4).toDouble();
    }
    return lut;
  }

  static Float32List _buildLinearToSrgb() {
    final lut = Float32List(_lutSize + 1);
    for (var i = 0; i <= _lutSize; i++) {
      final v = i / _lutSize;
      lut[i] = v <= .0031308
          ? v * 12.92
          : math.pow(v, 1 / 2.4) * 1.055 - .055;
    }
    return lut;
  }

  static double srgbToLinear(double v) =>
      _srgbToLinear[(v * 255).round().clamp(0, 255)];

  static double linearToSrgb(double v) {
    if (v <= 0) return 0;
    if (v >= 1) return 1;
    if (v <= .0031308) return v * 12.92;
    final scaled = v * _lutSize;
    final idx = scaled.floor();
    if (idx >= _lutSize) return 1;
    final frac = scaled - idx;
    final a = _linearToSrgb[idx];
    return a + (_linearToSrgb[idx + 1] - a) * frac;
  }

  final Float32List? constant;
  final List<_Key> keys;
  final bool simd;
  final Float32List output;
  Float32x4List? _outputSimd;
  bool gamma = false;
  var _cursor = 0;
  double _last = double.nan;
  bool get isStatic => constant != null;

  Float32List at(double frame) {
    if (constant != null) return constant!;
    if (frame == _last) return output;
    _last = frame;
    if (frame < keys.first.time) {
      output.setAll(0, keys.first.start);
      return output;
    }
    if (frame >= keys.last.time) {
      output.setAll(0, keys.last.start);
      return output;
    }
    if (_cursor >= keys.length - 1 ||
        frame < keys[_cursor].time ||
        frame >= keys[_cursor + 1].time) {
      var lo = 0, hi = keys.length - 1;
      while (lo + 1 < hi) {
        final mid = (lo + hi) >> 1;
        if (keys[mid].time <= frame) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      _cursor = lo;
    }
    final k = keys[_cursor];
    final nextKey = keys[_cursor + 1];
    final b = k.end ?? nextKey.start;
    if (k.hold) {
      output.setAll(0, k.start);
      return output;
    }
    final fraction = (frame - k.time) / (nextKey.time - k.time);
    if (k.spatial != null) {
      final t = k.eases.isEmpty ? fraction : k.eases[0].transform(fraction);
      k.spatial!.sample(t.clamp(0.0, 1.0), output);
    } else if (simd && output.length >= 32 && k.eases.length <= 1) {
      final t = Float32x4.splat(
        k.eases.isEmpty ? fraction : k.eases[0].transform(fraction),
      );
      final av = k.startSimd;
      final bv = k.end != null ? k.endSimd! : nextKey.startSimd;
      final ov = _outputSimd ??= output.buffer.asFloat32x4List(
        0,
        output.length ~/ 4,
      );
      for (var i = 0; i < ov.length; i++) {
        ov[i] = av[i] + (bv[i] - av[i]) * t;
      }
      final scalarT = t.x;
      for (var i = ov.length * 4; i < output.length; i++) {
        output[i] = k.start[i] + (b[i] - k.start[i]) * scalarT;
      }
    } else {
      final t = k.eases.isEmpty ? fraction : k.eases[0].transform(fraction);
      final len = output.length;
      if (gamma) {
        final multiEase = k.eases.length > 1;
        for (var i = 0; i < len; i++) {
          final p = multiEase
              ? k.eases[i % k.eases.length].transform(fraction)
              : t;
          final aLin = srgbToLinear(k.start[i]);
          final bLin = srgbToLinear(b[i]);
          final value = aLin + (bLin - aLin) * p.clamp(0.0, 1.0);
          output[i] = linearToSrgb(value);
        }
      } else if (k.eases.length <= 1) {
        final starts = k.start;
        for (var i = 0; i < len; i++) {
          output[i] = starts[i] + (b[i] - starts[i]) * t;
        }
      } else {
        final starts = k.start;
        final easeLen = k.eases.length;
        for (var i = 0; i < len; i++) {
          final p = k.eases[i % easeLen].transform(fraction);
          output[i] = starts[i] + (b[i] - starts[i]) * p;
        }
      }
    }
    return output;
  }

  double scalar(double frame) => at(frame)[0];
}

/// Arc-length lookup for spatial position keyframes, built without native Path.
class _SpatialCurve {
  _SpatialCurve(Float32List a, Float32List b, Float32List out, Float32List inc)
    : points = Float64List.fromList([
        a[0],
        a[1],
        a[0] + out[0],
        a[1] + out[1],
        b[0] + inc[0],
        b[1] + inc[1],
        b[0],
        b[1],
      ]) {
    var x = points[0], y = points[1];
    for (var i = 1; i < lengths.length; i++) {
      final t = i / (lengths.length - 1);
      final nx = _coordinate(t, 0), ny = _coordinate(t, 1);
      lengths[i] =
          lengths[i - 1] + math.sqrt((nx - x) * (nx - x) + (ny - y) * (ny - y));
      x = nx;
      y = ny;
    }
  }
  final Float64List points;
  final lengths = Float64List(129);
  double _coordinate(double t, int axis) {
    final u = 1 - t;
    return u * u * u * points[axis] +
        3 * u * u * t * points[2 + axis] +
        3 * u * t * t * points[4 + axis] +
        t * t * t * points[6 + axis];
  }

  void sample(double fraction, Float32List output) {
    final distance = lengths.last * fraction;
    var lo = 0, hi = lengths.length - 1;
    while (lo + 1 < hi) {
      final mid = (lo + hi) >> 1;
      if (lengths[mid] <= distance) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    final span = lengths[hi] - lengths[lo];
    final t =
        (lo + (span == 0 ? 0 : (distance - lengths[lo]) / span)) /
        (lengths.length - 1);
    output[0] = _coordinate(t, 0);
    output[1] = _coordinate(t, 1);
  }
}
