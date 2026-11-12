import 'dart:typed_data';

bool get isSimdSupported => false;

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

void simdFillSolidSpans(
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int stride,
  NativeSpansBuffer spans,
  int spanCount,
  int srcPremul,
) {}

abstract class NativeCoverageWorkspace {
  static NativeCoverageWorkspace? tryCreate() => null;
  static NativeCoverageWorkspace? acquire() => null;
  Int32List get bounds;
  bool get hasOversizedScratch;
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
    NativeSpansBuffer out,
  );
  void dispose();
}
