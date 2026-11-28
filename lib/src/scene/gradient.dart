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
      _colorOffsets = Float64List(count),
      _alphaOffsets = Float64List(
        math.max(0, (stops.valueCount - count * 4) ~/ 2),
      ),
      _scratchOffsets = Float64List(
        math.max(2, count + math.max(0, (stops.valueCount - count * 4) ~/ 2)),
      ),
      _scratchArgb = Uint32List(
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
  final Float64List _colorOffsets;
  final Float64List _alphaOffsets;
  final Float64List _scratchOffsets;
  final Uint32List _scratchArgb;
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
      final v = values[base].clamp(0.0, 1.0);
      _colorOffsets[i] = i > 0 && v < _colorOffsets[i - 1]
          ? _colorOffsets[i - 1]
          : v;
    }
    final alphaBase = count * 4;
    for (var i = 0; i < _alphaCount; i++) {
      final v = values[alphaBase + 2 * i].clamp(0.0, 1.0);
      _alphaOffsets[i] = i > 0 && v < _alphaOffsets[i - 1]
          ? _alphaOffsets[i - 1]
          : v;
    }
    // Two-pointer merge of monotonically clamped color & alpha stops.
    // Preserves duplicate stop offsets (hard-step color and hard-step alpha
    // transitions) in exact authoring order to match Skia and Tier B.
    var merged = 0;
    var cIdx = 0;
    var aIdx = 0;
    while (cIdx < count || aIdx < _alphaCount) {
      final double p;
      if (cIdx < count && aIdx < _alphaCount) {
        final cp = _colorOffsets[cIdx];
        final ap = _alphaOffsets[aIdx];
        p = cp <= ap ? cp : ap;
      } else if (cIdx < count) {
        p = _colorOffsets[cIdx];
      } else {
        p = _alphaOffsets[aIdx];
      }
      final cStart = cIdx;
      while (cIdx < count && (_colorOffsets[cIdx] - p).abs() <= 1e-6) {
        cIdx++;
      }
      final aStart = aIdx;
      while (aIdx < _alphaCount && (_alphaOffsets[aIdx] - p).abs() <= 1e-6) {
        aIdx++;
      }
      final cRun = cIdx - cStart;
      final aRun = aIdx - aStart;
      final steps = cRun >= aRun ? cRun : aRun;
      for (var step = 0; step < steps; step++) {
        final double rf, gf, bf;
        if (cRun > 0) {
          final ci = cStart + (step < cRun ? step : cRun - 1);
          final c3 = ci * 3;
          rf = _rgb[c3];
          gf = _rgb[c3 + 1];
          bf = _rgb[c3 + 2];
        } else {
          final right = cStart < count ? cStart : count - 1;
          final left = right > 0 ? right - 1 : 0;
          final pL = _colorOffsets[left];
          final pR = _colorOffsets[right];
          final span = pR - pL;
          final t = span <= 1e-12 ? 0.0 : ((p - pL) / span).clamp(0.0, 1.0);
          final l3 = left * 3;
          final r3 = right * 3;
          rf = _rgb[l3] + (_rgb[r3] - _rgb[l3]) * t;
          gf = _rgb[l3 + 1] + (_rgb[r3 + 1] - _rgb[l3 + 1]) * t;
          bf = _rgb[l3 + 2] + (_rgb[r3 + 2] - _rgb[l3 + 2]) * t;
        }
        final double af;
        if (_alphaCount == 0) {
          af = 1.0;
        } else if (aRun > 0) {
          final ai = aStart + (step < aRun ? step : aRun - 1);
          af = values[alphaBase + 2 * ai + 1];
        } else {
          final right = aStart < _alphaCount ? aStart : _alphaCount - 1;
          final left = right > 0 ? right - 1 : 0;
          final pL = _alphaOffsets[left];
          final pR = _alphaOffsets[right];
          final span = pR - pL;
          final t = span <= 1e-12 ? 0.0 : ((p - pL) / span).clamp(0.0, 1.0);
          final aL = values[alphaBase + 2 * left + 1];
          final aR = values[alphaBase + 2 * right + 1];
          af = aL + (aR - aL) * t;
        }
        _scratchOffsets[merged] = p;
        _scratchArgb[merged] =
            ((af * 255).round().clamp(0, 255) << 24) |
            ((rf * 255).round().clamp(0, 255) << 16) |
            ((gf * 255).round().clamp(0, 255) << 8) |
            (bf * 255).round().clamp(0, 255);
        merged++;
      }
    }
    final len = merged == 1 ? 2 : merged;
    var colors = _cachedColors;
    var offsets = _cachedOffsets;
    if (colors == null || colors.length != len) {
      colors = _cachedColors = List<Color>.filled(len, const Color(0x00000000));
      offsets = _cachedOffsets = List<double>.filled(len, 0);
    } else {
      offsets!;
    }
    for (var k = 0; k < merged; k++) {
      offsets[k] = _scratchOffsets[k];
      colors[k] = Color(_scratchArgb[k]);
    }
    if (merged == 1) {
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
