import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:typed_data';

// Bind the fixed C ABI directly. A generic FFI marshaller can exceed
// Chromium's WasmGC subtype-depth limit when Flutter builds in debug mode.
@JS('WebAssembly.instantiate')
external JSPromise<_WasmResult> _instantiate(JSUint8Array bytes);

extension type _WasmResult(JSObject _) implements JSObject {
  external _WasmInstance get instance;
}

extension type _WasmInstance(JSObject _) implements JSObject {
  external _WasmExports get exports;
}

extension type _WasmMemory(JSObject _) implements JSObject {
  external JSArrayBuffer get buffer;
}

extension type _WasmExports(JSObject _) implements JSObject {
  external _WasmMemory get memory;
  @JS('_initialize')
  external void initialize();
  external int malloc(int bytes);
  external void free(int address);

  @JS('fastlottie_clear_pixels')
  external void clearPixels(int dst, int count);

  @JS('fastlottie_fill_solid_spans')
  external void fillSolidSpans(
    int dst,
    int originX,
    int originY,
    int stride,
    int spans,
    int count,
    int color,
  );

  @JS('fastlottie_blend_rect')
  external void blendRect(
    int dst,
    int offset,
    int stride,
    int src,
    int width,
    int height,
    int mode,
  );

  @JS('fastlottie_blend_solid')
  external void blendSolid(
    int dst,
    int originX,
    int originY,
    int stride,
    int spans,
    int count,
    int color,
    int mode,
  );

  @JS('fastlottie_inner_shadow')
  external void innerShadow(
    int dst,
    int offset,
    int stride,
    int src,
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
  );

  @JS('fastlottie_gradient_spans')
  external void gradientSpans(
    int dst,
    int ox,
    int oy,
    int stride,
    int spans,
    int count,
    int lut,
    int opacity,
    int mode,
    int radial,
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
  );

  @JS('fl_dense_new')
  external int denseNew();

  @JS('fl_dense_free')
  external void denseFree(int state);

  @JS('fl_dense_trim')
  external void denseTrim(int state, int maxCells);

  @JS('fl_dense_raster')
  external int denseRaster(
    int state,
    int x,
    int y,
    int s,
    int e,
    int contours,
    int x0,
    int y0,
    int x1,
    int y1,
    int odd,
    int out,
    int cap,
    int bounds,
  );
}

_WasmExports? _kernels;
bool get isSimdSupported => _kernels != null;
bool get isNativeGradientSupported => isSimdSupported;
({int calls, int copiedBytes}) readNativeKernelTelemetry() =>
    (calls: 0, copiedBytes: 0);

Future<void> initializeWasmKernels(Uint8List bytes) async {
  final result = await _instantiate(bytes.toJS).toDart;
  final exports = result.instance.exports;
  for (final name in const [
    '_initialize',
    'malloc',
    'free',
    'fastlottie_clear_pixels',
    'fastlottie_fill_solid_spans',
    'fastlottie_blend_rect',
    'fastlottie_blend_solid',
    'fastlottie_inner_shadow',
    'fastlottie_gradient_spans',
    'fl_dense_new',
    'fl_dense_free',
    'fl_dense_trim',
    'fl_dense_raster',
  ]) {
    if (!exports.getProperty<JSAny?>(name.toJS).typeofEquals('function')) {
      throw StateError('Missing FastLottie Wasm function: $name');
    }
  }
  exports.initialize();
  // Confirm the module exports readable memory before enabling the backend.
  if (exports.memory.buffer.toDart.lengthInBytes == 0) {
    throw StateError('FastLottie Wasm memory is empty');
  }

  _kernels = exports;
}

ByteBuffer get _heap => _kernels!.memory.buffer.toDart;

int _allocate(int bytes) {
  final address = _kernels!.malloc(bytes == 0 ? 1 : bytes);
  if (address <= 0) throw StateError('Could not allocate $bytes Wasm bytes');
  _heap.asUint8List(address, bytes).fillRange(0, bytes, 0);
  return address;
}

class NativeSpansBuffer {
  NativeSpansBuffer(int count) : _count = count {
    if (isSimdSupported) {
      ptr = _allocate(count * 4);
    } else {
      _fallbackList = Int32List(count);
    }
  }

  int _count;
  int? ptr;
  Int32List? _fallbackList;

  // Wasm memory can grow during any allocation; fetch the current view.
  Int32List get typedList =>
      ptr != null ? _heap.asInt32List(ptr!, _count) : _fallbackList!;

  void reallocate(int newCount, int copyCount) {
    if (ptr != null) {
      final nextPtr = _allocate(newCount * 4);
      final nextList = _heap.asInt32List(nextPtr, newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      _kernels!.free(ptr!);
      ptr = nextPtr;
      _count = newCount;
    } else {
      final next = Int32List(newCount);
      if (copyCount > 0) next.setRange(0, copyCount, _fallbackList!);
      _fallbackList = next;
      _count = newCount;
    }
  }

  void dispose() {
    if (ptr != null) {
      _kernels!.free(ptr!);
      ptr = null;
    }
  }
}

class NativePixelBuffer {
  NativePixelBuffer(int count) : _owned = true, _count = count {
    if (isSimdSupported) {
      ptr = _allocate(count * 4);
    } else {
      _fallbackList = Uint32List(count);
    }
  }

  NativePixelBuffer._view(this.ptr, this._count, this._fallbackList)
    : _owned = false;

  final bool _owned;
  int _count;
  int? ptr;
  Uint32List? _fallbackList;

  // Wasm memory can grow during any allocation; fetch the current view.
  Uint32List get typedList =>
      ptr != null ? _heap.asUint32List(ptr!, _count) : _fallbackList!;

  NativePixelBuffer slice(int start, int count) {
    RangeError.checkValidRange(start, start + count, _count);
    final pointer = ptr;
    return NativePixelBuffer._view(
      pointer == null ? null : pointer + start * 4,
      count,
      pointer == null
          ? Uint32List.sublistView(_fallbackList!, start, start + count)
          : null,
    );
  }

  void reallocate(int newCount, int copyCount) {
    if (!_owned) throw StateError('Cannot resize a borrowed pixel buffer');
    if (ptr != null) {
      final nextPtr = _allocate(newCount * 4);
      final nextList = _heap.asUint32List(nextPtr, newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      _kernels!.free(ptr!);
      ptr = nextPtr;
      _count = newCount;
    } else {
      final next = Uint32List(newCount);
      if (copyCount > 0) next.setRange(0, copyCount, _fallbackList!);
      _fallbackList = next;
      _count = newCount;
    }
  }

  void dispose() {
    if (_owned && ptr != null) {
      _kernels!.free(ptr!);
      ptr = null;
    }
  }
}

void simdClearPixels(NativePixelBuffer dst, int count) {
  if (dst.ptr != null) {
    _kernels!.clearPixels(dst.ptr!, count);
  } else {
    dst.typedList.fillRange(0, count, 0);
  }
}

bool simdFillSolidSpans(
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int stride,
  NativeSpansBuffer spans,
  int spanCount,
  int srcPremul,
) {
  if (dst.ptr != null && spans.ptr != null) {
    _kernels!.fillSolidSpans(
      dst.ptr!,
      dstOriginX,
      dstOriginY,
      stride,
      spans.ptr!,
      spanCount,
      srcPremul,
    );
    return true;
  }
  return false;
}

bool nativeBlendRect(
  NativePixelBuffer dst,
  int offset,
  int stride,
  NativePixelBuffer src,
  int width,
  int height,
  int mode,
) {
  final d = dst.ptr, s = src.ptr;
  if (d == null || s == null) return false;
  try {
    _kernels!.blendRect(d, offset, stride, s, width, height, mode);
    return true;
  } catch (_) {
    return false;
  }
}

bool nativeBlendSolid(
  NativePixelBuffer dst,
  int originX,
  int originY,
  int stride,
  NativeSpansBuffer spans,
  int count,
  int color,
  int mode,
) {
  final d = dst.ptr, s = spans.ptr;
  if (d == null || s == null) return false;
  try {
    _kernels!.blendSolid(d, originX, originY, stride, s, count, color, mode);
    return true;
  } catch (_) {
    return false;
  }
}

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
) {
  final d = dst.ptr, s = src.ptr;
  if (d == null || s == null) return false;
  try {
    _kernels!.innerShadow(
      d,
      offset,
      stride,
      s,
      sw,
      sh,
      x0,
      y0,
      w,
      h,
      stepX,
      stepY,
      wx,
      wy,
      tint,
      opacity,
    );
    return true;
  } catch (_) {
    return false;
  }
}

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
) {
  if (dst.ptr == null || spans.ptr == null || lut.ptr == null) {
    return false;
  }
  _kernels!.gradientSpans(
    dst.ptr!,
    ox,
    oy,
    stride,
    spans.ptr!,
    count,
    lut.ptr!,
    opacity,
    mode,
    radial ? 1 : 0,
    ia,
    ib,
    ic,
    id,
    itx,
    ity,
    sx,
    sy,
    ex,
    ey,
  );
  return true;
}

// The mobile native asset exposes the matte and fused coverage kernels. Web
// keeps its existing Wasm ABI until the generated worker asset is regenerated.
bool nativeCompositeMatte(
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  NativePixelBuffer layer,
  NativePixelBuffer matte,
  int width,
  int height,
  int boxX,
  int boxY,
  bool dstOut,
  bool luma,
  NativePixelBuffer inverseAlpha,
) => false;

class NativeCoverageWorkspace {
  NativeCoverageWorkspace._(this._state);

  static NativeCoverageWorkspace? _shared;
  static int _users = 0;

  static NativeCoverageWorkspace? tryCreate() {
    if (!isSimdSupported) return null;
    try {
      final state = _kernels!.denseNew();
      if (state != 0) {
        return NativeCoverageWorkspace._(state);
      }
    } catch (_) {}
    return null;
  }

  static NativeCoverageWorkspace? acquire() {
    final existing = _shared;
    if (existing != null) {
      _users++;
      return existing;
    }
    final created = tryCreate();
    if (created == null) return null;
    _shared = created;
    _users = 1;
    return created;
  }

  final int _state;
  final int _bounds = _allocate(4 * 4);

  Int32List get bounds => _heap.asInt32List(_bounds, 4);

  int _points = 0, _contours = 0, _peakCells = 0;
  int get borrowedDraws => 0;
  int copiedDraws = 0;
  bool get hasOversizedScratch =>
      _peakCells > 256 * 256 || _points > 8192 || _contours > 512;

  int _x = 0, _y = 0;
  int _s = 0, _e = 0;

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
    bool borrowGeometry = true,
  }) {
    copiedDraws++;
    final cells = (x1 - x0) * (y1 - y0);
    if (nv < 2 || nc == 0 || out.ptr == null || cells > 262144) {
      return -2;
    }
    if (cells > _peakCells) _peakCells = cells;
    if (nv > _points) {
      if (_points > 0) {
        _kernels!.free(_x);
        _kernels!.free(_y);
      }
      _points = nv * 2;
      _x = _allocate(_points * 8);
      _y = _allocate(_points * 8);
    }
    if (nc > _contours) {
      if (_contours > 0) {
        _kernels!.free(_s);
        _kernels!.free(_e);
      }
      _contours = nc * 2;
      _s = _allocate(_contours * 4);
      _e = _allocate(_contours * 4);
    }
    _heap.asFloat64List(_x, _points).setRange(0, nv, vx);
    _heap.asFloat64List(_y, _points).setRange(0, nv, vy);
    _heap.asInt32List(_s, _contours).setRange(0, nc, s);
    _heap.asInt32List(_e, _contours).setRange(0, nc, e);

    int run() => _kernels!.denseRaster(
      _state,
      _x,
      _y,
      _s,
      _e,
      nc,
      x0,
      y0,
      x1,
      y1,
      odd ? 1 : 0,
      out.ptr!,
      out.typedList.length ~/ 2,
      _bounds,
    );

    var n = run();
    while (n == -1) {
      out.reallocate(out.typedList.length * 2, 0);
      n = run();
    }
    return n;
  }

  int rasterSolid(
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
    NativePixelBuffer dst,
    int originX,
    int originY,
    int stride,
    int color,
  ) => -2;

  void trimIfOversized() {
    const softCells = 256 * 256;
    if (_peakCells > softCells) {
      _kernels!.denseTrim(_state, softCells);
      _peakCells = 0;
    }
    const softPoints = 8192;
    if (_points > softPoints) {
      _kernels!.free(_x);
      _kernels!.free(_y);
      _points = 0;
      _x = 0;
      _y = 0;
    }
    const softContours = 512;
    if (_contours > softContours) {
      _kernels!.free(_s);
      _kernels!.free(_e);
      _contours = 0;
      _s = 0;
      _e = 0;
    }
  }

  void release() {
    if (!identical(_shared, this)) {
      dispose();
      return;
    }
    _users--;
    if (_users > 0) return;
    _users = 0;
    _shared = null;
    dispose();
  }

  void dispose() {
    if (_state != 0) {
      _kernels!.denseFree(_state);
    }
    _kernels!.free(_bounds);
    if (_points > 0) {
      _kernels!.free(_x);
      _kernels!.free(_y);
      _points = 0;
      _x = 0;
      _y = 0;
    }
    if (_contours > 0) {
      _kernels!.free(_s);
      _kernels!.free(_e);
      _contours = 0;
      _s = 0;
      _e = 0;
    }
  }
}
