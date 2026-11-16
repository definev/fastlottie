import 'dart:typed_data';

bool get isSimdSupported => false;
Future<void> ensureSimdReady({bool enableOnDartWasm = false}) async {}

class NativeSpansBuffer {
  NativeSpansBuffer(int count) : typedList = Int32List(count);
  Int32List typedList;
  void reallocate(int newCount, int copyCount) {
    final next = Int32List(newCount)..setRange(0, copyCount, typedList);
    typedList = next;
  }

  void dispose() {}
}

class NativePixelBuffer {
  NativePixelBuffer(int count) : typedList = Uint32List(count);
  NativePixelBuffer._view(this.typedList);
  Uint32List typedList;

  NativePixelBuffer slice(int start, int count) => NativePixelBuffer._view(
    Uint32List.sublistView(typedList, start, start + count),
  );
  void reallocate(int newCount, int copyCount) {
    final next = Uint32List(newCount)..setRange(0, copyCount, typedList);
    typedList = next;
  }

  void dispose() {}
}

void simdClearPixels(NativePixelBuffer dst, int count) {
  dst.typedList.fillRange(0, count, 0);
}

bool simdFillSolidSpans(
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int stride,
  NativeSpansBuffer spans,
  int spanCount,
  int srcPremul,
) => false;

bool nativeBlendRect(
  NativePixelBuffer dst,
  int offset,
  int stride,
  NativePixelBuffer src,
  int width,
  int height,
  int mode,
) => false;

bool nativeBlendSolid(
  NativePixelBuffer dst,
  int originX,
  int originY,
  int stride,
  NativeSpansBuffer spans,
  int count,
  int color,
  int mode,
) => false;

bool get isNativeGradientSupported => false;

bool nativeInnerShadow(
  NativePixelBuffer dst,
  int offset,
  int stride,
  NativePixelBuffer src,
  int sw,
  int sh,
  int x0,
  int y0,
  int w,
  int h,
  int stepX,
  int stepY,
  int wx,
  int wy,
  int tint,
  int opacity,
) => false;

bool nativeGradientSpans(
  NativePixelBuffer dst,
  int ox,
  int oy,
  int stride,
  NativeSpansBuffer spans,
  int count,
  NativePixelBuffer lut,
  int opacity,
  int mode,
  bool radial,
  double ia,
  double ib,
  double ic,
  double id,
  double itx,
  double ity,
  double sx,
  double sy,
  double ex,
  double ey,
) => false;

abstract class NativeCoverageWorkspace {
  static NativeCoverageWorkspace? tryCreate() => null;
  static NativeCoverageWorkspace? acquire() => null;
  Int32List get bounds;
  bool get hasOversizedScratch;
  int get borrowedDraws => 0;
  int get copiedDraws => 0;
  void trimIfOversized() {}
  void release() {}
  int raster(
    Float64List vx,
    Float64List vy,
    Int32List s,
    Int32List e,
    int nv,
    int nc,
    bool odd,
    int x0,
    int y0,
    int x1,
    int y1,
    NativeSpansBuffer out, {
    bool borrowGeometry = false,
  });
  void dispose();
}
