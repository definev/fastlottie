part of '../raster/raster_core.dart';

// A compile-time alias lets a modifier affect paths already captured by paints,
// including paths in nested groups. Inputs are frozen before replacing aliases,
// so the compiled modifier graph is acyclic and contains no native UI objects.
class _Shape implements _PathSource {
  _Shape(this.content);
  _PathSource content;
  @override
  bool get isStatic => content.isStatic;
  @override
  bool get isPathStatic => content.isPathStatic;
  @override
  Path path(double frame) => content.path(frame);
  @override
  Rect? pathBounds(double frame) => content.pathBounds(frame);
}

class _TrimPart implements _PathSource {
  _TrimPart(this.trim, this.index);
  final _Trim trim;
  final int index;
  @override
  bool get isStatic => trim.isStatic;
  @override
  bool get isPathStatic => trim.isStatic;
  @override
  Path path(double frame) => trim.paths(frame)[index];
  @override
  Rect? pathBounds(double frame) => trim.inputs[index].pathBounds(frame);
}

class _Trim {
  _Trim(this.inputs, this.start, this.end, this.offset, this.individual);
  final List<_PathSource> inputs;
  final Track start, end, offset;
  final bool individual;
  late final bool isStatic =
      start.isStatic &&
      end.isStatic &&
      offset.isStatic &&
      inputs.every((p) => p.isPathStatic);
  List<Path>? _paths;
  List<Path>? _rawScratch;
  List<Path>? _ownedScratch;
  List<List<PathMetric>>? _measuredScratch;
  Float64List? _lengthsScratch;
  double _frame = double.nan;
  // A static shape with animated trim reuses its arc-length measurements.
  final _metrics = <int, List<PathMetric>>{};

  List<Path> paths(double frame) {
    if (_paths != null && (isStatic || frame == _frame)) return _paths!;
    _frame = frame;
    final count = inputs.length;
    if (count == 0) return const [];
    final raw = _rawScratch ??= [
      for (var i = 0; i < count; i++) inputs[i].path(frame),
    ];
    if (!identical(raw[0], inputs[0].path(frame)) || count > 1) {
      for (var i = 0; i < count; i++) {
        raw[i] = inputs[i].path(frame);
      }
    }
    final a = start.scalar(frame).clamp(0.0, 100.0) / 100;
    final b = end.scalar(frame).clamp(0.0, 100.0) / 100;
    final span = (b - a).abs();
    if (span >= 1 - 1e-6) return _paths = raw;
    final owned = _ownedScratch ??= [for (var i = 0; i < count; i++) Path()];
    if (span < 1e-6) {
      for (var i = 0; i < count; i++) {
        owned[i]
          ..reset()
          ..fillType = raw[i].fillType;
      }
      return _paths = owned;
    }
    final from = (math.min(a, b) + offset.scalar(frame) / 360) % 1;
    final to = from + span;
    final measured = _measuredScratch ??= List<List<PathMetric>>.filled(
      count,
      const [],
    );
    final lengths = _lengthsScratch ??= Float64List(count);
    var total = 0.0;
    for (var i = 0; i < count; i++) {
      final metrics = inputs[i].isPathStatic
          ? _metrics.putIfAbsent(i, () => raw[i].computeMetrics().toList())
          : raw[i].computeMetrics().toList();
      measured[i] = metrics;
      var len = 0.0;
      for (var m = 0; m < metrics.length; m++) {
        len += metrics[m].length;
      }
      lengths[i] = len;
      total += len;
    }
    var position = 0.0;
    for (var i = 0; i < count; i++) {
      final length = individual ? total : lengths[i];
      final origin = individual ? position : 0.0;
      final path = owned[i]
        ..reset()
        ..fillType = raw[i].fillType;
      _extract(
        path,
        measured[i],
        from * length - origin,
        math.min(to, 1) * length - origin,
      );
      if (to > 1) {
        _extract(path, measured[i], -origin, (to - 1) * length - origin);
      }
      position += lengths[i];
    }
    return _paths = owned;
  }

  void _extract(Path target, List<PathMetric> metrics, double from, double to) {
    var position = 0.0;
    for (var i = 0; i < metrics.length; i++) {
      final metric = metrics[i];
      final mLen = metric.length;
      final a = math.max(0.0, from - position);
      final b = math.min(mLen, to - position);
      if (b > a) {
        final part = metric.extractPath(a, b);
        if (metric.isClosed && a <= 1e-4 && (b - mLen).abs() <= 1e-4) {
          part.close();
        }
        target.addPath(part, Offset.zero);
      }
      position += mLen;
      if (position >= to) break;
    }
  }
}

class _Dash {
  _Dash(this.intervals, this.offset) : _values = Float64List(intervals.length);
  final List<Track> intervals;
  final Track offset;
  final Float64List _values;
  List<PathMetric>? _staticMetrics;
  late final bool isStatic =
      offset.isStatic && intervals.every((p) => p.isStatic);

  void applyInto(
    Path source,
    double frame,
    Path target, {
    required bool staticSource,
  }) {
    final count = intervals.length;
    var cycle = 0.0;
    for (var i = 0; i < count; i++) {
      final v = math.max(i.isEven ? 0.01 : .1, intervals[i].scalar(frame));
      _values[i] = v;
      cycle += v;
    }
    final phase = offset.scalar(frame) % cycle;
    var first = 0, consumed = phase;
    while (consumed >= _values[first] && first < count - 1) {
      consumed -= _values[first++];
    }
    target
      ..reset()
      ..fillType = source.fillType;
    final metrics = staticSource
        ? (_staticMetrics ??= source.computeMetrics().toList())
        : source.computeMetrics();
    for (final metric in metrics) {
      final mLen = metric.length;
      var index = first, distance = 0.0, remaining = _values[first] - consumed;
      while (distance < mLen) {
        final end = math.min(mLen, distance + remaining);
        if (index.isEven && end > distance) {
          target.addPath(metric.extractPath(distance, end), Offset.zero);
        }
        distance = end;
        index = (index + 1) % count;
        remaining = _values[index];
      }
    }
  }
}
