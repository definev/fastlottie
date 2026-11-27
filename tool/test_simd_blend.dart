// ignore_for_file: avoid_print, unused_import
import 'dart:ffi' as ffi;
import 'dart:io';
import 'dart:typed_data';

import 'package:ffi/ffi.dart';

typedef NativeFillSolidSpans = ffi.Void Function(
  ffi.Pointer<ffi.Uint32> dst,
  ffi.Int32 dstLen,
  ffi.Int32 dstOriginX,
  ffi.Int32 dstOriginY,
  ffi.Int32 stride,
  ffi.Pointer<ffi.Int32> data,
  ffi.Int32 spanCount,
  ffi.Uint32 srcPremul,
);

typedef DartFillSolidSpans = void Function(
  ffi.Pointer<ffi.Uint32> dst,
  int dstLen,
  int dstOriginX,
  int dstOriginY,
  int stride,
  ffi.Pointer<ffi.Int32> data,
  int spanCount,
  int srcPremul,
);

void main() {
  final dylibPath = File('build/libfastlottie_simd.dylib').absolute.path;
  print('Loading $dylibPath...');
  final dylib = ffi.DynamicLibrary.open(dylibPath);
  final nativeFill = dylib
      .lookupFunction<NativeFillSolidSpans, DartFillSolidSpans>(
        'fastlottie_fill_solid_spans',
      );

  const width = 512;
  const height = 512;
  const numSpans = 2000;

  // Allocate native memory for spans
  final spansPtr = calloc<ffi.Int32>(numSpans * 2);
  final spansData = spansPtr.asTypedList(numSpans * 2);

  // Generate synthetic spans
  for (var i = 0; i < numSpans; i++) {
    final y = i % height;
    final x = (i * 7) % (width - 100);
    final len = 20 + (i % 60);
    final cov = 50 + (i % 206);
    spansData[i * 2] = (y << 16) | x;
    spansData[i * 2 + 1] = (len << 8) | (cov - 1);
  }

  // Allocate native buffers for Dart and C outputs
  final dstPtrDart = calloc<ffi.Uint32>(width * height);
  final dstDart = dstPtrDart.asTypedList(width * height);

  final dstPtrNative = calloc<ffi.Uint32>(width * height);
  final dstNative = dstPtrNative.asTypedList(width * height);

  const testColor = 0xC03060A0; // Premultiplied BGRA

  // 1. Run Dart scalar version
  final swDart = Stopwatch()..start();
  for (var loop = 0; loop < 100; loop++) {
    dstDart.fillRange(0, width * height, 0);
    for (var i = 0; i < numSpans * 2; i += 2) {
      final w0 = spansData[i];
      final w1 = spansData[i + 1];
      final y = (w0 >>> 16);
      final x = (w0 & 0xFFFF);
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final effSrc = cov == 256 ? testColor : scalePremulDart(testColor, cov);
      if (effSrc == 0) continue;
      final sa = effSrc >>> 24;
      final row = y * width + x;
      final end = row + len;
      if (sa == 255) {
        for (var p = row; p < end; p++) {
          dstDart[p] = effSrc;
        }
      } else {
        final ia = 255 - sa;
        for (var p = row; p < end; p++) {
          final d = dstDart[p];
          dstDart[p] = d == 0 ? effSrc : srcOverIaDart(effSrc, d, ia);
        }
      }
    }
  }
  swDart.stop();
  final timeDartUs = swDart.elapsedMicroseconds / 100.0;

  // 2. Run C SIMD version
  final swNative = Stopwatch()..start();
  for (var loop = 0; loop < 100; loop++) {
    dstNative.fillRange(0, width * height, 0);
    nativeFill(
      dstPtrNative,
      width * height,
      0,
      0,
      width,
      spansPtr,
      numSpans,
      testColor,
    );
  }
  swNative.stop();
  final timeNativeUs = swNative.elapsedMicroseconds / 100.0;

  // 3. Verify pixel match
  var mismatches = 0;
  for (var i = 0; i < width * height; i++) {
    if (dstDart[i] != dstNative[i]) {
      if (mismatches < 5) {
        print(
          'Mismatch at $i: Dart=0x${dstDart[i].toRadixString(16)}, Native=0x${dstNative[i].toRadixString(16)}',
        );
      }
      mismatches++;
    }
  }

  print('Mismatches: $mismatches / ${width * height}');
  print('Dart SWAR time: ${timeDartUs.toStringAsFixed(1)} us/frame');
  print('C SIMD time:   ${timeNativeUs.toStringAsFixed(1)} us/frame');
  print('Speedup:       ${(timeDartUs / timeNativeUs).toStringAsFixed(2)}x');

  calloc.free(spansPtr);
  calloc.free(dstPtrDart);
  calloc.free(dstPtrNative);
}

int scalePremulDart(int premul, int factor256) {
  if (factor256 >= 256) return premul;
  if (factor256 <= 0 || premul == 0) return 0;
  final rb =
      ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
  final ag =
      ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
  return rb | ag;
}

int srcOverIaDart(int s, int d, int ia) {
  final rb0 = (d & 0x00FF00FF) * ia + 0x00800080;
  final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
  final ag0 = ((d >> 8) & 0x00FF00FF) * ia + 0x00800080;
  final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
  return s + (rb | ag);
}
