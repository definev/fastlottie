part of '../fastlottie.dart';

/// Shared compiled keyframes. Search touches only [times]; interpolation reads
/// one contiguous vector pair. Metadata is stored in three Int32 columns:
/// flags/ease counts, resolved end offsets, and easing offsets.
/// Values stay component-interleaved because consumers use the whole vector.
class _Keyframes {
  _Keyframes(
    this.times,
    this.width,
    this.stride,
    this.metadata,
    this.values,
    this.easing,
    this.tangents,
    bool simd,
  ) : simdValues = simd && width >= 32 ? values.buffer.asFloat32x4List() : null,
      spatial = tangents == null
          ? null
          : List<_SpatialCurve?>.filled(times.length, null) {
    final t = tangents;
    if (t == null || width < 2) return;
    for (var i = 0; i < count - 1; i++) {
      if (isHold(i) || !hasTangents(i)) continue;
      final a = i * stride, b = endOffset(i), j = i * 4;
      if ((values[a] != values[b] || values[a + 1] != values[b + 1]) &&
          (t[j] != 0 || t[j + 1] != 0 || t[j + 2] != 0 || t[j + 3] != 0)) {
        spatial![i] = _SpatialCurve(values, a, b, t, j);
      }
    }
  }

  static const holdFlag = 1, endFlag = 2, tangentFlag = 4, linearFlag = 8;

  final Float64List times;
  final int width, stride;
  final Int32List metadata;
  final Float32List values;
  final Float64List easing;
  final Float32List? tangents;
  final List<_SpatialCurve?>? spatial;
  final Float32x4List? simdValues;
  int get count => times.length;
  bool isHold(int key) => metadata[key] & holdFlag != 0;
  bool hasEnd(int key) => metadata[key] & endFlag != 0;
  bool hasTangents(int key) => metadata[key] & tangentFlag != 0;
  int endOffset(int key) => metadata[count + key];
  int easeOffset(int key) => metadata[2 * count + key];
  int easeCount(int key) => metadata[key] >> 4;

  double ease(int index, double x) {
    final controls = easing;
    final x1 = controls[index], y1 = controls[index + 1];
    final x2 = controls[index + 2], y2 = controls[index + 3];
    if (x1 == y1 && x2 == y2) return x;
    double bezier(double t, double a, double b) =>
        ((1 - 3 * b + 3 * a) * t + 3 * b - 6 * a) * t * t + 3 * a * t;
    var lo = 0.0, hi = 1.0, t = x;
    // Bracketed Newton: converges even for flat endpoint slopes.
    for (var i = 0; i < 16; i++) {
      final error = bezier(t, x1, x2) - x;
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
    return bezier(t, y1, y2);
  }
}

class _Track {
  _Track.fork(_Track source)
    : constant = source.constant,
      keyframes = source.keyframes,
      simd = source.simd,
      output = Float32List(source.output.length),
      gamma = source.gamma;
  _Track.constant(List<double> value)
    : this.constantValues(Float32List.fromList(value));
  _Track.constantValues(this.constant)
    : keyframes = null,
      simd = false,
      output = Float32List(0);
  _Track.animated(_Keyframes data, this.simd)
    : constant = null,
      keyframes = data,
      output = Float32List(data.width);

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
      lut[i] = v <= .0031308 ? v * 12.92 : math.pow(v, 1 / 2.4) * 1.055 - .055;
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
  final _Keyframes? keyframes;
  int get valueCount => constant?.length ?? output.length;
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
    final data = keyframes!;
    final times = data.times;
    final values = data.values;
    final stride = data.stride;
    final len = output.length;
    if (frame < times.first) {
      output.setRange(0, len, values);
      return output;
    }
    if (frame >= times.last) {
      output.setRange(0, len, values, (times.length - 1) * stride);
      return output;
    }
    if (_cursor >= times.length - 1 ||
        frame < times[_cursor] ||
        frame >= times[_cursor + 1]) {
      var lo = 0, hi = times.length - 1;
      while (lo + 1 < hi) {
        final mid = (lo + hi) >> 1;
        if (times[mid] <= frame) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      _cursor = lo;
    }
    final key = _cursor;
    final a = key * stride;
    final flags = data.metadata[key];
    if (flags & _Keyframes.holdFlag != 0) {
      output.setRange(0, len, values, a);
      return output;
    }
    final b = data.endOffset(key);
    final fraction = (frame - times[key]) / (times[key + 1] - times[key]);
    final easeOffset = data.easeOffset(key);
    final easeCount = flags >> 4;
    final linear = flags & _Keyframes.linearFlag != 0;
    final t = linear ? fraction : data.ease(easeOffset, fraction);
    final spatial = data.spatial?[key];
    if (spatial != null) {
      spatial.sample(t.clamp(0.0, 1.0), output);
    } else if (simd && len >= 32 && easeCount <= 1) {
      final tv = Float32x4.splat(t);
      final vectors = data.simdValues!;
      final av = a ~/ 4, bv = b ~/ 4;
      final ov = _outputSimd ??= output.buffer.asFloat32x4List(0, len ~/ 4);
      for (var i = 0; i < ov.length; i++) {
        ov[i] = vectors[av + i] + (vectors[bv + i] - vectors[av + i]) * tv;
      }
      for (var i = ov.length * 4; i < len; i++) {
        output[i] = values[a + i] + (values[b + i] - values[a + i]) * tv.x;
      }
    } else if (gamma) {
      for (var i = 0; i < len; i++) {
        final p = easeCount > 1 && !linear
            ? data.ease(easeOffset + 4 * (i % easeCount), fraction)
            : t;
        final aLin = srgbToLinear(values[a + i]);
        final bLin = srgbToLinear(values[b + i]);
        output[i] = linearToSrgb(aLin + (bLin - aLin) * p.clamp(0.0, 1.0));
      }
    } else if (easeCount <= 1 || linear) {
      for (var i = 0, ai = a, bi = b; i < len; i++, ai++, bi++) {
        final start = values[ai];
        output[i] = start + (values[bi] - start) * t;
      }
    } else {
      for (var i = 0; i < len; i++) {
        final p = data.ease(easeOffset + 4 * (i % easeCount), fraction);
        output[i] = values[a + i] + (values[b + i] - values[a + i]) * p;
      }
    }
    return output;
  }

  double scalar(double frame) => at(frame)[0];
}

/// Arc-length lookup for spatial position keyframes, built without native Path.
class _SpatialCurve {
  _SpatialCurve(Float32List values, int a, int b, Float32List tangents, int t)
    : points = Float64List.fromList([
        values[a],
        values[a + 1],
        values[a] + tangents[t],
        values[a + 1] + tangents[t + 1],
        values[b] + tangents[t + 2],
        values[b + 1] + tangents[t + 3],
        values[b],
        values[b + 1],
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
