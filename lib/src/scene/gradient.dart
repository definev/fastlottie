part of '../raster/raster_core.dart';

class _GradientSpec {
  _GradientSpec(
    this.count,
    this.stops,
    this.start,
    this.end,
    this.radial,
    this.highlightLength,
    this.highlightAngle,
  ) : _alphaCount = math.max(0, (stops.valueCount - count * 4) ~/ 2),
      _rgb = Float32List(count * 3),
      _scratchOffsets = Float64List(
        math.max(2, count + math.max(0, (stops.valueCount - count * 4) ~/ 2)),
      );
  final int count;
  final int _alphaCount;
  final Track stops, start, end;
  final Track? highlightLength, highlightAngle;
  bool get hasFocalPoint =>
      radial &&
      highlightLength != null &&
      (!highlightLength!.isStatic || highlightLength!.scalar(0) != 0);
  final bool radial;
  final Float32List _rgb;
  final Float64List _scratchOffsets;
  List<Color>? _cachedColors;
  List<double>? _cachedOffsets;
  bool get isStatic =>
      stops.isStatic &&
      start.isStatic &&
      end.isStatic &&
      (!radial ||
          ((highlightLength?.isStatic ?? true) &&
              (highlightAngle?.isStatic ?? true)));
  Shader? _cached;
  double _last = double.nan;

  // Focal point relative to the center, in units of the radius.
  (double, double)? focalOffset(double frame, double dx, double dy) {
    final length = (highlightLength?.scalar(frame) ?? 0) * .01;
    if (length == 0) return null;
    final fraction = length <= -1 ? -.99 : (length >= 1 ? .99 : length);
    final angle =
        math.atan2(dy, dx) +
        (highlightAngle?.scalar(frame) ?? 0) * math.pi / 180;
    return (math.cos(angle) * fraction, math.sin(angle) * fraction);
  }

  double _alphaAt(Float32List values, double p) {
    if (_alphaCount == 0) return 1;
    final first = count * 4;
    if (p <= values[first]) return values[first + 1];
    for (var i = first + 2; i < values.length; i += 2) {
      if (p <= values[i]) {
        final span = values[i] - values[i - 2];
        final t = span == 0 ? 0.0 : (p - values[i - 2]) / span;
        return values[i - 1] + (values[i + 1] - values[i - 1]) * t;
      }
    }
    return values.last;
  }

  Shader shader(double frame) {
    if (_cached != null && (isStatic || frame == _last)) return _cached!;
    _last = frame;
    final values = stops.at(frame), s = start.at(frame), e = end.at(frame);
    for (var i = 0; i < count; i++) {
      final base = 4 * i;
      final outBase = 3 * i;
      _rgb[outBase] = Track.linearToSrgb(values[base + 1]);
      _rgb[outBase + 1] = Track.linearToSrgb(values[base + 2]);
      _rgb[outBase + 2] = Track.linearToSrgb(values[base + 3]);
    }
    final rawLen = count + _alphaCount;
    for (var i = 0; i < count; i++) {
      _scratchOffsets[i] = values[4 * i];
    }
    var write = count;
    for (var i = count * 4; i < values.length; i += 2) {
      _scratchOffsets[write++] = values[i];
    }
    // Insertion sort on small stop array followed by in-place deduplication.
    for (var i = 1; i < rawLen; i++) {
      final key = _scratchOffsets[i];
      var j = i - 1;
      while (j >= 0 && _scratchOffsets[j] > key) {
        _scratchOffsets[j + 1] = _scratchOffsets[j];
        j--;
      }
      _scratchOffsets[j + 1] = key;
    }
    var unique = 0;
    for (var i = 0; i < rawLen; i++) {
      final v = _scratchOffsets[i].clamp(0.0, 1.0);
      if (unique == 0 || (v - _scratchOffsets[unique - 1]).abs() > 1e-6) {
        _scratchOffsets[unique++] = v;
      }
    }
    final len = unique == 1 ? 2 : unique;
    var colors = _cachedColors;
    var offsets = _cachedOffsets;
    if (colors == null || colors.length != len) {
      colors = _cachedColors = List<Color>.filled(len, const Color(0x00000000));
      offsets = _cachedOffsets = List<double>.filled(len, 0);
    } else {
      offsets!;
    }
    var left = 0;
    for (var k = 0; k < unique; k++) {
      final p = _scratchOffsets[k];
      offsets[k] = p;
      while (left < count - 1 && values[(left + 1) * 4] < p) {
        left++;
      }
      final right = math.min(left + 1, count - 1);
      final span = values[right * 4] - values[left * 4];
      final t = span == 0
          ? 0.0
          : ((p - values[left * 4]) / span).clamp(0.0, 1.0);
      final l3 = left * 3;
      final r3 = right * 3;
      final r = ((_rgb[l3] + (_rgb[r3] - _rgb[l3]) * t) * 255).round().clamp(
        0,
        255,
      );
      final g = ((_rgb[l3 + 1] + (_rgb[r3 + 1] - _rgb[l3 + 1]) * t) * 255)
          .round()
          .clamp(0, 255);
      final b = ((_rgb[l3 + 2] + (_rgb[r3 + 2] - _rgb[l3 + 2]) * t) * 255)
          .round()
          .clamp(0, 255);
      colors[k] = Color.fromARGB(
        (_alphaAt(values, p) * 255).round().clamp(0, 255),
        r,
        g,
        b,
      );
    }
    if (unique == 1) {
      colors[1] = colors[0];
      offsets[1] = 1;
    }
    final a = Offset(s[0], s[1]), b = Offset(e[0], e[1]);
    if (!radial) return _cached = Gradient.linear(a, b, colors, offsets);
    final radius = math.max(.001, (b - a).distance);
    final focus = focalOffset(frame, b.dx - a.dx, b.dy - a.dy);
    return _cached = Gradient.radial(
      a,
      radius,
      colors,
      offsets,
      TileMode.clamp,
      null,
      focus == null ? null : a + Offset(focus.$1, focus.$2) * radius,
    );
  }
}
