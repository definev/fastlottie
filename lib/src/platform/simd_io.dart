import 'dart:ffi' as ffi;
import 'dart:io';
import 'dart:typed_data';

import 'package:ffi/ffi.dart';

int _kernelCalls = 0;
int _geometryCopyBytes = 0;
({int calls, int copiedBytes}) readNativeKernelTelemetry() =>
    (calls: _kernelCalls, copiedBytes: _geometryCopyBytes);

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
  int,
  ffi.Pointer<ffi.Int32>,
  int,
  int,
);

@ffi.Native<ffi.Void Function(ffi.Pointer<ffi.Uint32>, ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_clear_pixels',
  isLeaf: true,
)
external void _nativeClearPixelsAsset(ffi.Pointer<ffi.Uint32> dst, int count);

@ffi.Native<
  ffi.Void Function(
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
    ffi.Int32,
    ffi.Uint32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_fill_solid_spans_v2',
  isLeaf: true,
)
external void _nativeFillSolidSpansAsset(
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int dstOriginX,
  int dstOriginY,
  int stride,
  ffi.Pointer<ffi.Int32> data,
  int spanCount,
  int srcPremul,
);

@ffi.Native<
  ffi.Void Function(
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_blend_rect',
  isLeaf: true,
)
external void _blendRect(
  ffi.Pointer<ffi.Uint32> dst,
  int offset,
  int stride,
  ffi.Pointer<ffi.Uint32> src,
  int width,
  int height,
  int mode,
);

@ffi.Native<
  ffi.Void Function(
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
    ffi.Int32,
    ffi.Uint32,
    ffi.Int32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_blend_solid_v2',
  isLeaf: true,
)
external void _blendSolid(
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int originX,
  int originY,
  int stride,
  ffi.Pointer<ffi.Int32> spans,
  int count,
  int color,
  int mode,
);

@ffi.Native<
  ffi.Void Function(
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Pointer<ffi.Uint32>,
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_composite_matte',
  isLeaf: true,
)
external void _compositeMatte(
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  ffi.Pointer<ffi.Uint32> layer,
  ffi.Pointer<ffi.Uint32> matte,
  int width,
  int height,
  int boxX,
  int boxY,
  int dstOut,
  int luma,
);

@ffi.Native<
  ffi.Void Function(
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
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
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_gradient_spans_v2',
  isLeaf: true,
)
external void _gradientSpans(
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int ox,
  int oy,
  int stride,
  ffi.Pointer<ffi.Int32> spans,
  int count,
  ffi.Pointer<ffi.Uint32> lut,
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

final bool isNativeGradientSupported = () {
  if (!isSimdSupported) return false;
  try {
    // A zero-span call probes the symbol without reading any buffers.
    _gradientSpans(
      ffi.nullptr,
      0,
      0,
      0,
      0,
      ffi.nullptr,
      0,
      ffi.nullptr,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    );
    return true;
  } on ArgumentError {
    return false;
  }
}();

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
      stride <= 0 ||
      count < 0 ||
      count * 2 > spans.typedList.length ||
      lut.typedList.length < 1024) {
    return false;
  }
  if (count == 0) return true;
  _gradientSpans(
    dst.ptr!,
    dst.typedList.length,
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
  _kernelCalls++;
  return true;
}

// Older native libraries can still provide coverage and solid fill.
bool _hasBlendRect = true;
bool _hasBlendSolid = true;
bool _hasInnerShadow = true;
bool _hasCompositeMatte = true;

@ffi.Native<
  ffi.Void Function(
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
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_inner_shadow',
  isLeaf: true,
)
external void _innerShadow(
  ffi.Pointer<ffi.Uint32> dst,
  int offset,
  int stride,
  ffi.Pointer<ffi.Uint32> src,
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
  if (!_hasInnerShadow ||
      d == null ||
      s == null ||
      sw <= 0 ||
      sh <= 0 ||
      w <= 0 ||
      h <= 0 ||
      stride <= 0 ||
      offset < 0 ||
      x0 < 0 ||
      y0 < 0 ||
      x0 + w > sw ||
      y0 + h > sh ||
      src.typedList.length < sw * sh ||
      offset + (h - 1) * stride + w > dst.typedList.length) {
    return false;
  }
  try {
    _innerShadow(
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
    _kernelCalls++;
    return true;
  } on ArgumentError {
    _hasInnerShadow = false;
    return false;
  }
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
  if (!_hasBlendRect ||
      d == null ||
      s == null ||
      width <= 0 ||
      height <= 0 ||
      stride <= 0 ||
      offset < 0 ||
      src.typedList.length < width * height ||
      offset + (height - 1) * stride + width > dst.typedList.length) {
    return false;
  }
  try {
    _blendRect(d, offset, stride, s, width, height, mode);
    _kernelCalls++;
    return true;
  } on ArgumentError {
    _hasBlendRect = false;
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
  if (!_hasBlendSolid ||
      d == null ||
      s == null ||
      stride <= 0 ||
      count < 0 ||
      count * 2 > spans.typedList.length) {
    return false;
  }
  if (count == 0) return true;
  try {
    _blendSolid(
      d,
      dst.typedList.length,
      originX,
      originY,
      stride,
      s,
      count,
      color,
      mode,
    );
    _kernelCalls++;
    return true;
  } on ArgumentError {
    _hasBlendSolid = false;
    return false;
  }
}

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
) {
  final d = dst.ptr, target = layer.ptr, mask = matte.ptr;
  if (!_hasCompositeMatte ||
      d == null ||
      target == null ||
      mask == null ||
      width <= 0 ||
      height <= 0 ||
      dstStride <= 0 ||
      boxX < dstOriginX ||
      boxY < dstOriginY ||
      layer.typedList.length < width * height ||
      matte.typedList.length < width * height ||
      (boxY + height - 1 - dstOriginY) * dstStride +
              (boxX - dstOriginX) +
              width >
          dst.typedList.length) {
    return false;
  }
  try {
    _compositeMatte(
      d,
      dst.typedList.length,
      dstOriginX,
      dstOriginY,
      dstStride,
      target,
      mask,
      width,
      height,
      boxX,
      boxY,
      dstOut ? 1 : 0,
      luma ? 1 : 0,
    );
    _kernelCalls++;
    return true;
  } on ArgumentError {
    _hasCompositeMatte = false;
    return false;
  }
}

bool _useAssetClearFill = false;
_DartClearPixels? _nativeClearPixels;
_DartFillSolidSpans? _nativeFillSolidSpans;

bool _initLib() {
  try {
    // 1. Try Native Assets first (Dart build hook automatically bundles on Android, iOS, Windows, Linux, macOS):
    try {
      _nativeClearPixelsAsset(ffi.nullptr, 0);

      _useAssetClearFill = true;
      _nativeClearPixels = _nativeClearPixelsAsset;
      _nativeFillSolidSpans = _nativeFillSolidSpansAsset;
      return true;
    } catch (_) {
      // Native asset hook not active in this run; fall back to dynamic library paths
    }

    // 2. Dynamic Library fallback for custom builds / standalone binaries:
    ffi.DynamicLibrary? lib;
    if (Platform.isMacOS) {
      final execDir = File(Platform.resolvedExecutable).parent.path;
      final candidates = [
        '$execDir/libfastlottie_simd.dylib',
        '$execDir/../Frameworks/libfastlottie_simd.dylib',
      ];
      for (final c in candidates) {
        if (File(c).existsSync()) {
          lib = ffi.DynamicLibrary.open(File(c).absolute.path);
          break;
        }
      }
    } else if (Platform.isAndroid || Platform.isLinux) {
      try {
        lib = ffi.DynamicLibrary.open('libfastlottie_simd.so');
      } catch (_) {
        final execDir = File(Platform.resolvedExecutable).parent.path;
        final candidate = '$execDir/libfastlottie_simd.so';
        if (File(candidate).existsSync()) {
          lib = ffi.DynamicLibrary.open(candidate);
        }
      }
    } else if (Platform.isIOS) {
      try {
        lib = ffi.DynamicLibrary.process();
      } catch (_) {
        lib = ffi.DynamicLibrary.executable();
      }
    } else if (Platform.isWindows) {
      try {
        lib = ffi.DynamicLibrary.open('fastlottie_simd.dll');
      } catch (_) {
        final execDir = File(Platform.resolvedExecutable).parent.path;
        final candidate = '$execDir/fastlottie_simd.dll';
        if (File(candidate).existsSync()) {
          lib = ffi.DynamicLibrary.open(candidate);
        }
      }
    }

    if (lib == null) return false;

    _nativeClearPixels = lib
        .lookupFunction<_NativeClearPixels, _DartClearPixels>(
          'fastlottie_clear_pixels',
          isLeaf: true,
        );
    _nativeFillSolidSpans = lib
        .lookupFunction<_NativeFillSolidSpans, _DartFillSolidSpans>(
          'fastlottie_fill_solid_spans_v2',
          isLeaf: true,
        );
    return true;
  } catch (_) {
    return false;
  }
}

final bool isSimdSupported = _initLib();
bool get isNativeAdvancedBlendSupported => isSimdSupported;

@ffi.Native<ffi.Void Function(ffi.Int32, ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_cancel_store',
  isLeaf: true,
)
external void _cancelStore(int slot, int token);

@ffi.Native<ffi.Int32 Function(ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_cancel_load',
  isLeaf: true,
)
external int _cancelLoad(int slot);

bool _hasCancelAtomic = true;
bool get isNativeCancelSupported => isSimdSupported && _hasCancelAtomic;

@ffi.Native<ffi.Int32 Function(ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_cancel_claim',
  isLeaf: true,
)
external int _cancelClaim(int slot);

bool nativeCancelSlotClaim(int slot) {
  if (!isNativeCancelSupported) return false;
  try {
    return _cancelClaim(slot) != 0;
  } on ArgumentError {
    _hasCancelAtomic = false;
    return false;
  }
}

void nativeCancelSlotStore(int slot, int token) {
  if (!isNativeCancelSupported) return;
  try {
    _cancelStore(slot, token);
  } on ArgumentError {
    _hasCancelAtomic = false;
  }
}

int nativeCancelSlotLoad(int slot) {
  if (!isNativeCancelSupported) return 0;
  try {
    return _cancelLoad(slot);
  } on ArgumentError {
    _hasCancelAtomic = false;
    return 0;
  }
}

Future<void> ensureSimdReady({bool enableOnDartWasm = false}) async {}

class NativeSpansBuffer {
  NativeSpansBuffer(int count) {
    if (isSimdSupported) {
      ptr = malloc<ffi.Int32>(count);
      typedList = ptr!.asTypedList(count);
    } else {
      typedList = Int32List(count);
    }
  }

  ffi.Pointer<ffi.Int32>? ptr;
  late Int32List typedList;

  void reallocate(int newCount, int copyCount) {
    if (ptr != null) {
      final nextPtr = malloc<ffi.Int32>(newCount);
      final nextList = nextPtr.asTypedList(newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      malloc.free(ptr!);
      ptr = nextPtr;
      typedList = nextList;
    } else {
      final next = Int32List(newCount);
      if (copyCount > 0) next.setRange(0, copyCount, typedList);
      typedList = next;
    }
  }

  void dispose() {
    if (ptr != null) {
      malloc.free(ptr!);
      ptr = null;
    }
  }
}

class NativePixelBuffer {
  NativePixelBuffer(int count) : _owned = true {
    if (isSimdSupported) {
      ptr = calloc<ffi.Uint32>(count);
      typedList = ptr!.asTypedList(count);
    } else {
      typedList = Uint32List(count);
    }
  }

  NativePixelBuffer._view(this.ptr, this.typedList) : _owned = false;

  /// Views caller-owned memory. The caller keeps it valid for the entire draw.
  NativePixelBuffer.borrowed(ffi.Pointer<ffi.Uint32> pixels, int count)
    : this._view(pixels, pixels.asTypedList(count));

  final bool _owned;
  ffi.Pointer<ffi.Uint32>? ptr;
  late Uint32List typedList;

  /// Borrowed until the owner is resized or disposed.
  NativePixelBuffer slice(int start, int count) => NativePixelBuffer._view(
    ptr == null ? null : ptr! + start,
    Uint32List.sublistView(typedList, start, start + count),
  );

  void reallocate(int newCount, int copyCount) {
    if (!_owned) throw StateError('Cannot resize a borrowed pixel buffer');
    if (ptr != null) {
      final nextPtr = calloc<ffi.Uint32>(newCount);
      final nextList = nextPtr.asTypedList(newCount);
      if (copyCount > 0) nextList.setRange(0, copyCount, typedList);
      calloc.free(ptr!);
      ptr = nextPtr;
      typedList = nextList;
    } else {
      final next = Uint32List(newCount);
      if (copyCount > 0) next.setRange(0, copyCount, typedList);
      typedList = next;
    }
  }

  void dispose() {
    if (_owned && ptr != null) {
      calloc.free(ptr!);
      ptr = null;
    }
  }
}

void simdClearPixels(NativePixelBuffer dst, int count) {
  if (count <= 0) return;
  if (count > dst.typedList.length) {
    throw RangeError.range(count, 0, dst.typedList.length, 'count');
  }
  final p = dst.ptr;
  if (p != null) {
    if (_useAssetClearFill) {
      _nativeClearPixelsAsset(p, count);
      _kernelCalls++;
      return;
    }
    final fn = _nativeClearPixels;
    if (fn != null) {
      fn(p, count);
      _kernelCalls++;
      return;
    }
  }
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
) {
  final d = dst.ptr, s = spans.ptr;
  if (d != null &&
      s != null &&
      stride > 0 &&
      spanCount >= 0 &&
      spanCount * 2 <= spans.typedList.length) {
    if (spanCount == 0) return true;
    final dstLen = dst.typedList.length;
    if (_useAssetClearFill) {
      _nativeFillSolidSpansAsset(
        d,
        dstLen,
        dstOriginX,
        dstOriginY,
        stride,
        s,
        spanCount,
        srcPremul,
      );
      _kernelCalls++;
      return true;
    }
    final fn = _nativeFillSolidSpans;
    if (fn != null) {
      fn(d, dstLen, dstOriginX, dstOriginY, stride, s, spanCount, srcPremul);
      _kernelCalls++;
      return true;
    }
  }
  return false;
}

@ffi.Native<ffi.Pointer<ffi.Void> Function()>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_new',
)
external ffi.Pointer<ffi.Void> _denseNew();

@ffi.Native<ffi.Void Function(ffi.Pointer<ffi.Void>)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_free',
)
external void _denseFree(ffi.Pointer<ffi.Void> p);

@ffi.Native<ffi.Void Function(ffi.Pointer<ffi.Void>, ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_trim',
  isLeaf: true,
)
external void _denseTrim(ffi.Pointer<ffi.Void> p, int maxCells);

@ffi.Native<ffi.Int32 Function(ffi.Pointer<ffi.Void>, ffi.Int32, ffi.Int32)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_reserve',
  isLeaf: true,
)
external int _denseReserve(ffi.Pointer<ffi.Void> state, int width, int height);

@ffi.Native<
  ffi.Int32 Function(
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
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_raster_borrowed',
  isLeaf: true,
)
external int _denseBorrowed(
  ffi.Pointer<ffi.Void> state,
  ffi.Pointer<ffi.Double> x,
  ffi.Pointer<ffi.Double> y,
  ffi.Pointer<ffi.Int32> starts,
  ffi.Pointer<ffi.Int32> ends,
  int nv,
  int nc,
  int x0,
  int y0,
  int x1,
  int y1,
  int odd,
  ffi.Pointer<ffi.Int32> dst,
  int cap,
  ffi.Pointer<ffi.Int32> bounds,
);

@ffi.Native<
  ffi.Int32 Function(
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
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
    ffi.Int32,
    ffi.Pointer<ffi.Int32>,
    ffi.Pointer<ffi.Uint32>,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Int32,
    ffi.Uint32,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_raster_solid_borrowed',
  isLeaf: true,
)
external int _denseSolidBorrowed(
  ffi.Pointer<ffi.Void> state,
  ffi.Pointer<ffi.Double> x,
  ffi.Pointer<ffi.Double> y,
  ffi.Pointer<ffi.Int32> starts,
  ffi.Pointer<ffi.Int32> ends,
  int nv,
  int nc,
  int x0,
  int y0,
  int x1,
  int y1,
  int odd,
  ffi.Pointer<ffi.Int32> spans,
  int capacity,
  ffi.Pointer<ffi.Int32> bounds,
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int originX,
  int originY,
  int stride,
  int color,
);

@ffi.Native<
  ffi.Int32 Function(
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
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fl_dense_raster',
  isLeaf: true,
)
external int _denseRaster(
  ffi.Pointer<ffi.Void> state,
  ffi.Pointer<ffi.Double> vx,
  ffi.Pointer<ffi.Double> vy,
  ffi.Pointer<ffi.Int32> starts,
  ffi.Pointer<ffi.Int32> ends,
  int nc,
  int x0,
  int y0,
  int x1,
  int y1,
  int odd,
  ffi.Pointer<ffi.Int32> dst,
  int cap,
  ffi.Pointer<ffi.Int32> bounds,
);

class NativeCoverageWorkspace {
  NativeCoverageWorkspace._(this._state);

  static bool _missing = false;
  static NativeCoverageWorkspace? _shared;
  static int _users = 0;

  static NativeCoverageWorkspace? tryCreate() {
    if (!isSimdSupported || _missing) return null;
    try {
      final state = _denseNew();
      if (state != ffi.nullptr) return NativeCoverageWorkspace._(state);
    } on ArgumentError {
      // The standalone blend library may predate the coverage kernel.
      _missing = true;
    }
    return null;
  }

  /// One cell plane per isolate. Sessions rasterize one at a time.
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
  final _bounds = calloc<ffi.Int32>(4);
  late final bounds = _bounds.asTypedList(4);
  int _points = 0, _contours = 0, _peakCells = 0;
  int borrowedDraws = 0, copiedDraws = 0;
  bool _borrowedUnavailable = false;
  int _borrowedCells = 0, _borrowedWords = 0;
  bool get hasOversizedScratch =>
      _peakCells > 256 * 256 || _points > 8192 || _contours > 512;

  ffi.Pointer<ffi.Double> _x = ffi.nullptr, _y = ffi.nullptr;
  ffi.Pointer<ffi.Int32> _s = ffi.nullptr, _e = ffi.nullptr;
  late Float64List _xs, _ys;
  late Int32List _ss, _es;
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
    if (nv < 2 ||
        nc <= 0 ||
        nv > vx.length ||
        nv > vy.length ||
        nc > s.length ||
        nc > e.length ||
        x0 < 0 ||
        y0 < 0 ||
        x0 >= x1 ||
        y0 >= y1 ||
        x1 > 65535 ||
        y1 > 65535 ||
        out.ptr == null) {
      return -2;
    }
    final cells = (x1 - x0) * (y1 - y0);
    if (cells > 262144) {
      return -2;
    }
    if (cells > _peakCells) _peakCells = cells;
    if (borrowGeometry &&
        !_borrowedUnavailable &&
        nv <= 1024 &&
        nc <= 128 &&
        x1 - x0 <= 384 &&
        y1 - y0 <= 384 &&
        nv * (x1 - x0 + y1 - y0 + 4) + cells <= 196608) {
      try {
        final words = ((x1 - x0 + 63) ~/ 64) * (y1 - y0);
        final reserved = cells <= _borrowedCells && words <= _borrowedWords;
        if (reserved || _denseReserve(_state, x1 - x0, y1 - y0) != 0) {
          if (!reserved) _kernelCalls++;
          if (!reserved) {
            if (cells > _borrowedCells) _borrowedCells = cells;
            if (words > _borrowedWords) _borrowedWords = words;
          }
          int run() => _denseBorrowed(
            _state,
            vx.address,
            vy.address,
            s.address,
            e.address,
            nv,
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
          _kernelCalls++;
          while (n == -1) {
            out.reallocate(out.typedList.length * 2, 0);
            n = run();
            _kernelCalls++;
          }
          if (n >= 0) {
            borrowedDraws++;
            return n;
          }
        }
      } on ArgumentError {
        _borrowedUnavailable = true;
      }
    }
    copiedDraws++;
    if (nv > _points) {
      if (_points > 0) {
        malloc.free(_x);
        malloc.free(_y);
      }
      _points = nv * 2;
      _x = malloc<ffi.Double>(_points);
      _y = malloc<ffi.Double>(_points);
      _xs = _x.asTypedList(_points);
      _ys = _y.asTypedList(_points);
    }
    if (nc > _contours) {
      if (_contours > 0) {
        malloc.free(_s);
        malloc.free(_e);
      }
      _contours = nc * 2;
      _s = malloc<ffi.Int32>(_contours);
      _e = malloc<ffi.Int32>(_contours);
      _ss = _s.asTypedList(_contours);
      _es = _e.asTypedList(_contours);
    }
    _xs.setRange(0, nv, vx);
    _ys.setRange(0, nv, vy);
    _ss.setRange(0, nc, s);
    _es.setRange(0, nc, e);
    _geometryCopyBytes += nv * 16 + nc * 8;
    int run() => _denseRaster(
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
    _kernelCalls++;
    while (n == -1) {
      out.reallocate(out.typedList.length * 2, 0);
      n = run();
      _kernelCalls++;
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
  ) {
    final target = dst.ptr;
    if (_borrowedUnavailable ||
        target == null ||
        nv < 2 ||
        nc <= 0 ||
        nv > vx.length ||
        nv > vy.length ||
        nc > s.length ||
        nc > e.length ||
        x0 < 0 ||
        y0 < 0 ||
        x0 >= x1 ||
        y0 >= y1 ||
        x1 > 65535 ||
        y1 > 65535 ||
        stride <= 0 ||
        x0 < originX ||
        y0 < originY ||
        out.ptr == null) {
      return -2;
    }
    final dstLen = dst.typedList.length;
    final cells = (x1 - x0) * (y1 - y0);
    if (cells > 262144 ||
        nv > 1024 ||
        nc > 128 ||
        x1 - x0 > 384 ||
        y1 - y0 > 384 ||
        nv * (x1 - x0 + y1 - y0 + 4) + cells > 196608 ||
        (y1 - 1 - originY) * stride + (x1 - originX) > dstLen) {
      return -2;
    }
    try {
      final words = ((x1 - x0 + 63) ~/ 64) * (y1 - y0);
      final reserved = cells <= _borrowedCells && words <= _borrowedWords;
      if (!reserved && _denseReserve(_state, x1 - x0, y1 - y0) == 0) {
        _kernelCalls++;
        return -2;
      }
      if (!reserved) _kernelCalls++;
      if (!reserved) {
        if (cells > _borrowedCells) _borrowedCells = cells;
        if (words > _borrowedWords) _borrowedWords = words;
      }
      int run() => _denseSolidBorrowed(
        _state,
        vx.address,
        vy.address,
        s.address,
        e.address,
        nv,
        nc,
        x0,
        y0,
        x1,
        y1,
        odd ? 1 : 0,
        out.ptr!,
        out.typedList.length ~/ 2,
        _bounds,
        target,
        dstLen,
        originX,
        originY,
        stride,
        color,
      );
      var n = run();
      _kernelCalls++;
      while (n == -1) {
        out.reallocate(out.typedList.length * 2, 0);
        n = run();
        _kernelCalls++;
      }
      if (n >= 0) borrowedDraws++;
      return n;
    } on ArgumentError {
      _borrowedUnavailable = true;
      return -2;
    }
  }

  void trimIfOversized() {
    const softCells = 256 * 256;
    if (_peakCells > softCells) {
      _denseTrim(_state, softCells);
      _peakCells = 0;
      _borrowedCells = _borrowedWords = 0;
    }
    const softPoints = 8192;
    if (_points > softPoints) {
      malloc.free(_x);
      malloc.free(_y);
      _points = 0;
      _x = ffi.nullptr;
      _y = ffi.nullptr;
    }
    const softContours = 512;
    if (_contours > softContours) {
      malloc.free(_s);
      malloc.free(_e);
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
    _denseFree(_state);
    calloc.free(_bounds);
    if (_points > 0) {
      malloc.free(_x);
      malloc.free(_y);
    }
    if (_contours > 0) {
      malloc.free(_s);
      malloc.free(_e);
    }
  }
}
