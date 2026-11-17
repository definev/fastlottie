import 'dart:ffi';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/raster_core.dart';
import 'package:fastlottie/src/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/simd_io.dart';
import 'package:ffi/ffi.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'borrowed padded output matches packed pixels including masks and blend',
    () {
      const width = 73, height = 59, stride = 96, guard = 0x12345678;
      final pointer = calloc<Uint32>(stride * height + 1);
      final words = pointer.asTypedList(stride * height + 1);
      final packed = NativePixelBuffer(width * height);
      final borrowed = NativePixelBuffer.borrowed(pointer, stride * height);
      try {
        for (final native in [false, true]) {
          final ws = RasterWorkspace(preferNative: native);
          try {
            for (final name in ['features', 'many_shapes', 'morph']) {
              final scene = RasterScene.compile(
                fixture(name),
                const FastLottieOptions(),
              );
              for (final frame in [0.0, 13.0, 34.0, 0.0]) {
                words.fillRange(0, words.length, guard);
                renderSceneSoftware(scene, frame, packed, width, height, ws);
                renderSceneSoftware(
                  scene,
                  frame,
                  borrowed,
                  width,
                  height,
                  ws,
                  rowStride: stride,
                );
                for (var y = 0; y < height; y++) {
                  expect(
                    words.sublist(y * stride, y * stride + width),
                    packed.typedList.sublist(y * width, (y + 1) * width),
                  );
                }
                expect(words.last, guard);
              }
              ws.releaseScene(scene);
            }
          } finally {
            ws.dispose();
          }
        }
        borrowed.dispose();
        expect(words.last, guard); // Must not release the caller's allocation.
      } finally {
        packed.dispose();
        calloc.free(pointer);
      }
    },
  );
}
