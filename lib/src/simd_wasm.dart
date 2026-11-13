import 'dart:developer' as developer;
import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'package:wasm_ffi/ffi.dart' as ffi;

class _AssetModuleLoader with ffi.ModuleLoader {
  @override
  Future<bool> exists(String modulePath) async {
    final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
    return manifest.listAssets().contains(modulePath);
  }

  @override
  Future<Uint8List> load(String modulePath) async {
    final asset = await rootBundle.load(modulePath);
    return Uint8List.sublistView(asset);
  }
}

typedef _NativeClearPixels = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
);
typedef _DartClearPixels = void Function(ffi.Pointer<ffi.Uint32>, int);

typedef _NativeFillSolidSpans = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Int32>,
  ffi.Int32,
  ffi.Uint32,
);
typedef _DartFillSolidSpans = void Function(
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
  ffi.Pointer<ffi.Int32>,
  int,
  int,
);

typedef _NativeBlendRect = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
);
typedef _DartBlendRect = void Function(
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
);

typedef _NativeBlendSolid = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Int32>,
  ffi.Int32,
  ffi.Uint32,
  ffi.Int32,
);
typedef _DartBlendSolid = void Function(
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
  ffi.Pointer<ffi.Int32>,
  int,
  int,
  int,
);

typedef _NativeInnerShadow = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Uint32,
  ffi.Uint32,
);
typedef _DartInnerShadow = void Function(
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
  int,
);

typedef _NativeGradientSpans = ffi.Void Function(
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Int32>,
  ffi.Int32,
  ffi.Pointer<ffi.Uint32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
  ffi.Double,
);
typedef _DartGradientSpans = void Function(
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
  ffi.Pointer<ffi.Int32>,
  int,
  ffi.Pointer<ffi.Uint32>,
  int,
  int,
  int,
  double,
  double,
  double,
  double,
  double,
  double,
  double,
  double,
  double,
  double,
);

typedef _NativeDenseNew = ffi.Pointer<ffi.Void> Function();
typedef _DartDenseNew = ffi.Pointer<ffi.Void> Function();

typedef _NativeDenseFree = ffi.Void Function(ffi.Pointer<ffi.Void>);
typedef _DartDenseFree = void Function(ffi.Pointer<ffi.Void>);

typedef _NativeDenseTrim = ffi.Void Function(ffi.Pointer<ffi.Void>, ffi.Int32);
typedef _DartDenseTrim = void Function(ffi.Pointer<ffi.Void>, int);

typedef _NativeDenseRaster = ffi.Int32 Function(
  ffi.Pointer<ffi.Void>,
  ffi.Pointer<ffi.Double>,
  ffi.Pointer<ffi.Double>,
  ffi.Pointer<ffi.Int32>,
  ffi.Pointer<ffi.Int32>,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Int32,
  ffi.Pointer<ffi.Int32>,
  ffi.Int32,
  ffi.Pointer<ffi.Int32>,
);
typedef _DartDenseRaster = int Function(
  ffi.Pointer<ffi.Void>,
  ffi.Pointer<ffi.Double>,
  ffi.Pointer<ffi.Double>,
  ffi.Pointer<ffi.Int32>,
  ffi.Pointer<ffi.Int32>,
  int,
  int,
  int,
  int,
  int,
  int,
  ffi.Pointer<ffi.Int32>,
  int,
  ffi.Pointer<ffi.Int32>,
);

_DartClearPixels? _nativeClearPixels;
_DartFillSolidSpans? _nativeFillSolidSpans;
_DartBlendRect? _nativeBlendRect;
_DartBlendSolid? _nativeBlendSolid;
_DartInnerShadow? _nativeInnerShadow;
_DartGradientSpans? _nativeGradientSpans;
_DartDenseNew? _denseNew;
_DartDenseFree? _denseFree;
_DartDenseTrim? _denseTrim;
_DartDenseRaster? _denseRaster;

ffi.Allocator? _allocator;
bool get isSimdSupported => _allocator != null;
bool get isNativeGradientSupported =>
    isSimdSupported && _nativeGradientSpans != null;

Future<void>? _wasmInitFuture;

/// Loads the optional Wasm raster kernels. Call after initializing Flutter's
/// binding, before creating raster caches, to use them from the first frame.
Future<void> ensureSimdReady() {
  return _wasmInitFuture ??= _initWasm();
}

Future<void> _initWasm() async {
  try {
    const generated = 'packages/fastlottie/fastlottie_simd.wasm';
    const prebuilt = 'packages/fastlottie/lib/src/wasm/fastlottie_simd.wasm';
    final loader = _AssetModuleLoader();
    final dylib = await ffi.DynamicLibrary.open(
      await loader.exists(generated) ? generated : prebuilt,
      moduleLoader: loader,
      wasmType: ffi.WasmType.wasm32Standalone,
      useAsGlobal: ffi.GlobalMemory.no,
    );

    _nativeClearPixels = dylib
        .lookupFunction<_NativeClearPixels, _DartClearPixels>(
          'fastlottie_clear_pixels',
        );
    _nativeFillSolidSpans = dylib
        .lookupFunction<_NativeFillSolidSpans, _DartFillSolidSpans>(
          'fastlottie_fill_solid_spans',
        );
    _nativeBlendRect = dylib.lookupFunction<_NativeBlendRect, _DartBlendRect>(
      'fastlottie_blend_rect',
    );
    _nativeBlendSolid = dylib
        .lookupFunction<_NativeBlendSolid, _DartBlendSolid>(
          'fastlottie_blend_solid',
        );
    _nativeInnerShadow = dylib
        .lookupFunction<_NativeInnerShadow, _DartInnerShadow>(
          'fastlottie_inner_shadow',
        );
    _nativeGradientSpans = dylib
        .lookupFunction<_NativeGradientSpans, _DartGradientSpans>(
          'fastlottie_gradient_spans',
        );
    _denseNew = dylib.lookupFunction<_NativeDenseNew, _DartDenseNew>(
      'fl_dense_new',
    );
    _denseFree = dylib.lookupFunction<_NativeDenseFree, _DartDenseFree>(
      'fl_dense_free',
    );
    _denseTrim = dylib.lookupFunction<_NativeDenseTrim, _DartDenseTrim>(
      'fl_dense_trim',
    );
    _denseRaster = dylib.lookupFunction<_NativeDenseRaster, _DartDenseRaster>(
      'fl_dense_raster',
    );

    _allocator = dylib.allocator;
  } catch (error, stackTrace) {
    developer.log(
      'Could not initialize FastLottie Wasm; using the Dart renderer.',
      name: 'fastlottie',
      error: error,
      stackTrace: stackTrace,
    );
  }
}

ffi.Pointer<T> _allocate<T extends ffi.NativeType>(int count) {
  final bytes = count * ffi.sizeOf<T>();
  final ptr = _allocator!.allocate<T>(bytes == 0 ? 1 : bytes);
  if (ptr.address <= 0) {
    throw StateError('Could not allocate $bytes Wasm bytes');
  }
  ptr.cast<ffi.Uint8>().asTypedList(bytes).fillRange(0, bytes, 0);
  return ptr;
}

class NativeSpansBuffer {
  NativeSpansBuffer(int count) : _count = count {
    if (isSimdSupported) {
      ptr = _allocate<ffi.Int32>(count);
    } else {
      _fallbackList = Int32List(count);
    }
  }

  int _count;
  ffi.Pointer<ffi.Int32>? ptr;
  Int32List? _fallbackList;

  // Wasm memory can grow during any allocation; fetch the current view.
  Int32List get typedList =>
      ptr != null ? ptr!.asTypedList(_count) : _fallbackList!;

  void reallocate(int newCount, int copyCount) {
    if (ptr != null) {
      final nextPtr = _allocate<ffi.Int32>(newCount);
      final nextList = nextPtr.asTypedList(newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      _allocator!.free(ptr!);
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
      _allocator!.free(ptr!);
      ptr = null;
    }
  }
}

class NativePixelBuffer {
  NativePixelBuffer(int count) : _owned = true, _count = count {
    if (isSimdSupported) {
      ptr = _allocate<ffi.Uint32>(count);
    } else {
      _fallbackList = Uint32List(count);
    }
  }

  NativePixelBuffer._view(this.ptr, this._count, this._fallbackList)
    : _owned = false;

  final bool _owned;
  int _count;
  ffi.Pointer<ffi.Uint32>? ptr;
  Uint32List? _fallbackList;

  // Wasm memory can grow during any allocation; fetch the current view.
  Uint32List get typedList =>
      ptr != null ? ptr!.asTypedList(_count) : _fallbackList!;

  NativePixelBuffer slice(int start, int count) {
    RangeError.checkValidRange(start, start + count, _count);
    final pointer = ptr;
    return NativePixelBuffer._view(
      pointer?.elementAt(start),
      count,
      pointer == null
          ? Uint32List.sublistView(_fallbackList!, start, start + count)
          : null,
    );
  }

  void reallocate(int newCount, int copyCount) {
    if (!_owned) throw StateError('Cannot resize a borrowed pixel buffer');
    if (ptr != null) {
      final nextPtr = _allocate<ffi.Uint32>(newCount);
      final nextList = nextPtr.asTypedList(newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      _allocator!.free(ptr!);
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
      _allocator!.free(ptr!);
      ptr = null;
    }
  }
}

void simdClearPixels(NativePixelBuffer dst, int count) {
  if (dst.ptr != null && _nativeClearPixels != null) {
    _nativeClearPixels!(dst.ptr!, count);
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
  if (dst.ptr != null && spans.ptr != null && _nativeFillSolidSpans != null) {
    _nativeFillSolidSpans!(
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
  if (_nativeBlendRect == null || d == null || s == null) return false;
  try {
    _nativeBlendRect!(d, offset, stride, s, width, height, mode);
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
  if (_nativeBlendSolid == null || d == null || s == null) return false;
  try {
    _nativeBlendSolid!(d, originX, originY, stride, s, count, color, mode);
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
  if (_nativeInnerShadow == null || d == null || s == null) return false;
  try {
    _nativeInnerShadow!(
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
  if (dst.ptr == null ||
      spans.ptr == null ||
      lut.ptr == null ||
      _nativeGradientSpans == null) {
    return false;
  }
  _nativeGradientSpans!(
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

class NativeCoverageWorkspace {
  NativeCoverageWorkspace._(this._state);

  static NativeCoverageWorkspace? _shared;
  static int _users = 0;

  static NativeCoverageWorkspace? tryCreate() {
    if (!isSimdSupported || _denseNew == null) return null;
    try {
      final state = _denseNew!();
      if (state != ffi.nullptr && state.address != 0) {
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

  final ffi.Pointer<ffi.Void> _state;
  final ffi.Pointer<ffi.Int32> _bounds = _allocate<ffi.Int32>(4);

  Int32List get bounds => _bounds.asTypedList(4);

  int _points = 0, _contours = 0, _peakCells = 0;
  bool get hasOversizedScratch =>
      _peakCells > 256 * 256 || _points > 8192 || _contours > 512;

  ffi.Pointer<ffi.Double> _x = ffi.nullptr, _y = ffi.nullptr;
  ffi.Pointer<ffi.Int32> _s = ffi.nullptr, _e = ffi.nullptr;

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
  ) {
    final cells = (x1 - x0) * (y1 - y0);
    if (nv < 2 ||
        nc == 0 ||
        out.ptr == null ||
        cells > 262144 ||
        _denseRaster == null) {
      return -2;
    }
    if (cells > _peakCells) _peakCells = cells;
    if (nv > _points) {
      if (_points > 0) {
        _allocator!.free(_x);
        _allocator!.free(_y);
      }
      _points = nv * 2;
      _x = _allocate<ffi.Double>(_points);
      _y = _allocate<ffi.Double>(_points);
    }
    if (nc > _contours) {
      if (_contours > 0) {
        _allocator!.free(_s);
        _allocator!.free(_e);
      }
      _contours = nc * 2;
      _s = _allocate<ffi.Int32>(_contours);
      _e = _allocate<ffi.Int32>(_contours);
    }
    _x.asTypedList(_points).setRange(0, nv, vx);
    _y.asTypedList(_points).setRange(0, nv, vy);
    _s.asTypedList(_contours).setRange(0, nc, s);
    _e.asTypedList(_contours).setRange(0, nc, e);

    int run() => _denseRaster!(
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

  void trimIfOversized() {
    const softCells = 256 * 256;
    if (_peakCells > softCells && _denseTrim != null) {
      _denseTrim!(_state, softCells);
      _peakCells = 0;
    }
    const softPoints = 8192;
    if (_points > softPoints) {
      _allocator!.free(_x);
      _allocator!.free(_y);
      _points = 0;
      _x = ffi.nullptr;
      _y = ffi.nullptr;
    }
    const softContours = 512;
    if (_contours > softContours) {
      _allocator!.free(_s);
      _allocator!.free(_e);
      _contours = 0;
      _s = ffi.nullptr;
      _e = ffi.nullptr;
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
    if (_state != ffi.nullptr && _denseFree != null) {
      _denseFree!(_state);
    }
    _allocator!.free(_bounds);
    if (_points > 0) {
      _allocator!.free(_x);
      _allocator!.free(_y);
      _points = 0;
      _x = ffi.nullptr;
      _y = ffi.nullptr;
    }
    if (_contours > 0) {
      _allocator!.free(_s);
      _allocator!.free(_e);
      _contours = 0;
      _s = ffi.nullptr;
      _e = ffi.nullptr;
    }
  }
}
