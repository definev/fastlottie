import 'dart:ffi';
import 'dart:typed_data';

@Native<
  Int32 Function(
    Pointer<Float>,
    Int32,
    Int32,
    Pointer<Double>,
    Pointer<Double>,
    Int32,
    Int32,
    Double,
    Int32,
    Double,
    Double,
    Double,
    Double,
    Double,
    Double,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_flatten_bezier',
  isLeaf: true,
)
external int _flatten(
  Pointer<Float> points,
  int count,
  int closed,
  Pointer<Double> x,
  Pointer<Double> y,
  int start,
  int capacity,
  double flatnessSq,
  int transform,
  double a,
  double b,
  double c,
  double d,
  double tx,
  double ty,
);

bool _unavailable = false;
int nativeBezierCalls = 0, nativeBezierFallbacks = 0;

/// Returns the new vertex count, -1 for output growth, or -2 for Dart fallback.
/// The caller owns disjoint input/output, and ignores partial writes on failure.
int flattenBezierNative(
  Float32List pts,
  int count,
  bool closingCurve,
  Float64List x,
  Float64List y,
  int start,
  double flatnessSq,
  (double, double, double, double, double, double)? transform,
) {
  if (_unavailable ||
      count <= 0 ||
      count > 128 ||
      count > pts.length ~/ 6 ||
      start < 0 ||
      start > 0x7fffffff - 8192 ||
      start > x.length ||
      start > y.length ||
      flatnessSq < 0 ||
      !flatnessSq.isFinite) {
    nativeBezierFallbacks++;
    return -2;
  }
  final available = x.length < y.length ? x.length : y.length;
  final capacity = available - start > 8192 ? start + 8192 : available;
  final (a, b, c, d, tx, ty) = transform ?? (1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
  try {
    final result = _flatten(
      pts.address,
      count,
      closingCurve ? 1 : 0,
      x.address,
      y.address,
      start,
      capacity,
      flatnessSq,
      transform == null ? 0 : 1,
      a,
      b,
      c,
      d,
      tx,
      ty,
    );
    if (result >= 0) {
      nativeBezierCalls++;
    } else if (result == -2) {
      nativeBezierFallbacks++;
    }
    return result;
  } on ArgumentError {
    _unavailable = true;
    nativeBezierFallbacks++;
    return -2;
  }
}

@Native<
  Int64 Function(
    Pointer<Double>,
    Pointer<Double>,
    Int32,
    Pointer<Int32>,
    Pointer<Int32>,
    Pointer<Uint8>,
    Int32,
    Double,
    Int32,
    Int32,
    Double,
    Double,
    Pointer<Double>,
    Pointer<Double>,
    Pointer<Double>,
    Int32,
    Pointer<Int32>,
    Pointer<Int32>,
    Int32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_expand_stroke',
  isLeaf: true,
)
external int _stroke(
  Pointer<Double> sourceX,
  Pointer<Double> sourceY,
  int vertices,
  Pointer<Int32> starts,
  Pointer<Int32> ends,
  Pointer<Uint8> closed,
  int contours,
  double halfWidth,
  int cap,
  int join,
  double miter,
  double flatness,
  Pointer<Double> scratch,
  Pointer<Double> outputX,
  Pointer<Double> outputY,
  int outputVertices,
  Pointer<Int32> outputStarts,
  Pointer<Int32> outputEnds,
  int outputContours,
);

const nativeStrokePointLimit = 1024, nativeStrokeContourLimit = 128;
const nativeStrokeOutputLimit = 8192;
bool _strokeUnavailable = false;
int nativeStrokeCalls = 0;

/// Returns packed contour and vertex counts, -1 for growth, or -2 for Dart.
/// All input, output and scratch arrays must be disjoint. Ignore partial
/// writes on failure; the caller commits geometry only on success.
int expandStrokeNative(
  Float64List sourceX,
  Float64List sourceY,
  int vertices,
  Int32List starts,
  Int32List ends,
  Uint8List closed,
  int contours,
  double halfWidth,
  int cap,
  int join,
  double miter,
  double flatness,
  Float64List scratch,
  Float64List outputX,
  Float64List outputY,
  Int32List outputStarts,
  Int32List outputEnds,
) {
  if (_strokeUnavailable ||
      vertices <= 0 ||
      vertices > nativeStrokePointLimit ||
      vertices > sourceX.length ||
      vertices > sourceY.length ||
      scratch.length < vertices * 4 ||
      contours <= 0 ||
      contours > nativeStrokeContourLimit ||
      contours > starts.length ||
      contours > ends.length ||
      contours > closed.length) {
    return -2;
  }
  final outputVertices = outputX.length
      .clamp(0, outputY.length)
      .clamp(0, nativeStrokeOutputLimit);
  final outputContours = outputStarts.length
      .clamp(0, outputEnds.length)
      .clamp(0, nativeStrokeContourLimit * 2);
  try {
    final result = _stroke(
      sourceX.address,
      sourceY.address,
      vertices,
      starts.address,
      ends.address,
      closed.address,
      contours,
      halfWidth,
      cap,
      join,
      miter,
      flatness,
      scratch.address,
      outputX.address,
      outputY.address,
      outputVertices,
      outputStarts.address,
      outputEnds.address,
      outputContours,
    );
    if (result >= 0) nativeStrokeCalls++;
    return result;
  } on ArgumentError {
    _strokeUnavailable = true;
    return -2;
  }
}
