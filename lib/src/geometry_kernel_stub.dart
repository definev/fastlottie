import 'dart:typed_data';

int get nativeBezierCalls => 0;
int get nativeBezierFallbacks => 0;
int flattenBezierNative(
  Float32List pts,
  int count,
  bool closingCurve,
  Float64List x,
  Float64List y,
  int start,
  double flatnessSq,
  (double, double, double, double, double, double)? transform,
) => -2;

const nativeStrokePointLimit = 1024, nativeStrokeContourLimit = 128;
const nativeStrokeOutputLimit = 8192;

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
) => -2;
