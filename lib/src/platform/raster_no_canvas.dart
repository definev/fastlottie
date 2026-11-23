// Only bounds math is used by the headless rasterizer. The Canvas types
// satisfy the shared scene's vector methods, which are unreachable in workers.
import 'dart:math' as math;
import 'dart:typed_data';

Never _noCanvas() =>
    throw UnsupportedError('Canvas is only available in Flutter');

final class Rect {
  const Rect.fromLTRB(this.left, this.top, this.right, this.bottom);
  const Rect.fromLTWH(double x, double y, double w, double h)
    : this.fromLTRB(x, y, x + w, y + h);
  static const zero = Rect.fromLTRB(0, 0, 0, 0);
  static const largest = Rect.fromLTRB(-1e9, -1e9, 1e9, 1e9);
  final double left, top, right, bottom;
  double get width => right - left;
  double get height => bottom - top;
  bool get isEmpty => left >= right || top >= bottom;
  Rect shift(Offset delta) => Rect.fromLTRB(
    left + delta.dx,
    top + delta.dy,
    right + delta.dx,
    bottom + delta.dy,
  );
  Rect inflate(double d) =>
      Rect.fromLTRB(left - d, top - d, right + d, bottom + d);
  Rect intersect(Rect other) => Rect.fromLTRB(
    math.max(left, other.left),
    math.max(top, other.top),
    math.min(right, other.right),
    math.min(bottom, other.bottom),
  );
  bool overlaps(Rect other) =>
      left < other.right &&
      top < other.bottom &&
      right > other.left &&
      bottom > other.top;
}

final class Offset {
  const Offset(this.dx, this.dy);
  static const zero = Offset(0, 0);
  final double dx, dy;
  double get distance => math.sqrt(dx * dx + dy * dy);
  Offset operator +(Offset other) => Offset(dx + other.dx, dy + other.dy);
  Offset operator -(Offset other) => Offset(dx - other.dx, dy - other.dy);
  Offset operator *(double factor) => Offset(dx * factor, dy * factor);
}

final class Canvas {
  Canvas([PictureRecorder? recorder]);
  void save() => _noCanvas();
  void restore() => _noCanvas();
  void clipRect(Rect rect) => _noCanvas();
  void clipPath(Path path) => _noCanvas();
  void saveLayer(Rect? bounds, Paint paint) => _noCanvas();
  void translate(double dx, double dy) => _noCanvas();
  void transform(Float64List matrix) => _noCanvas();
  void drawRect(Rect rect, Paint paint) => _noCanvas();
  void drawRRect(RRect rect, Paint paint) => _noCanvas();
  void drawPath(Path path, Paint paint) => _noCanvas();
  void drawPicture(Picture picture) => _noCanvas();
}

final class Picture {
  void dispose() => _noCanvas();
}

final class PictureRecorder {
  Picture endRecording() => _noCanvas();
}

final class Path {
  Path() {
    _noCanvas();
  }
  PathFillType get fillType => _noCanvas();
  set fillType(PathFillType value) => _noCanvas();
  static Path combine(PathOperation op, Path a, Path b) => _noCanvas();
  void addRect(Rect rect) => _noCanvas();
  void addPath(Path path, Offset offset, {Float64List? matrix4}) => _noCanvas();
  void arcTo(Rect rect, double start, double sweep, bool forceMoveTo) =>
      _noCanvas();
  void moveTo(double x, double y) => _noCanvas();
  void lineTo(double x, double y) => _noCanvas();
  void cubicTo(
    double x1,
    double y1,
    double x2,
    double y2,
    double x3,
    double y3,
  ) => _noCanvas();
  void close() => _noCanvas();
  void reset() => _noCanvas();
  Iterable<PathMetric> computeMetrics() => _noCanvas();
}

abstract interface class PathMetric {
  double get length;
  bool get isClosed;
  Path extractPath(double start, double end);
}

enum PathFillType { evenOdd, nonZero }

enum PathOperation { union, difference, reverseDifference, intersect, xor }

enum BlendMode {
  srcOver,
  srcIn,
  dstOut,
  dstIn,
  modulate,
  multiply,
  screen,
  overlay,
  darken,
  lighten,
  colorDodge,
  colorBurn,
  hardLight,
  softLight,
  difference,
  exclusion,
  hue,
  saturation,
  color,
  luminosity,
  plus,
}

enum PaintingStyle { stroke, fill }

enum StrokeCap { butt, round, square }

enum StrokeJoin { miter, round, bevel }

enum TileMode { clamp }

final class Paint {
  Paint() {
    _noCanvas();
  }
  set blendMode(BlendMode mode) => _noCanvas();
  set colorFilter(ColorFilter? filter) => _noCanvas();
  set color(Color color) => _noCanvas();
  set isAntiAlias(bool value) => _noCanvas();
  set style(PaintingStyle style) => _noCanvas();
  set strokeCap(StrokeCap cap) => _noCanvas();
  set strokeJoin(StrokeJoin join) => _noCanvas();
  set strokeMiterLimit(double limit) => _noCanvas();
  set strokeWidth(double width) => _noCanvas();
  set shader(Shader? shader) => _noCanvas();
}

final class Color {
  const Color(int value);
  const Color.fromARGB(int a, int r, int g, int b);
}

final class ColorFilter {
  const ColorFilter.mode(Color color, BlendMode mode);
  const ColorFilter.matrix(List<double> matrix);
}

final class RRect {
  RRect.fromRectAndRadius(Rect rect, Radius radius) {
    _noCanvas();
  }
}

final class Radius {
  Radius.circular(double radius) {
    _noCanvas();
  }
}

abstract interface class Shader {}

abstract final class Gradient {
  static Shader linear(
    Offset a,
    Offset b,
    List<Color> colors,
    List<double> offsets,
  ) => _noCanvas();
  static Shader radial(
    Offset center,
    double radius,
    List<Color> colors,
    List<double> offsets,
    TileMode tile,
    Float64List? matrix,
    Offset? focus,
  ) => _noCanvas();
}
