import 'dart:typed_data';

import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/platform/simd_wasm.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/scene/options.dart';
import 'package:flutter_test/flutter_test.dart';

import 'path_ops_test.dart' show animated, constant, line, scene, stroke, trim;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  for (final preferNative in [false, true]) {
    for (final precomp in [false, true]) {
      test('scene caches: native=$preferNative precomp=$precomp', () {
        final document = scene([
          {
            'ty': 'gr',
            'it': [line(48), stroke(gradient: true)],
          },
          {
            'ty': 'gr',
            'it': [
              line(128),
              line(192),
              stroke(),
              trim(constant(0), animated(40, 90), constant(0), mode: 2),
            ],
          },
        ]);
        if (precomp) {
          final layers = document['layers'];
          document['assets'] = [
            {'id': 'child', 'layers': layers},
          ];
          document['layers'] = [
            {
              'ty': 0,
              'refId': 'child',
              'ind': 1,
              'ip': 0,
              'op': 60,
              'w': 256,
              'h': 256,
            },
          ];
        }
        final first = RasterScene.compile(document, const FastLottieOptions());
        final second = first.fork();
        final workspace = RasterWorkspace(preferNative: preferNative);
        final pixels = NativePixelBuffer(128 * 128);
        addTearDown(workspace.dispose);
        addTearDown(pixels.dispose);

        void render(RasterScene scene, double frame) =>
            renderSceneSoftware(scene, frame, pixels, 128, 128, workspace);

        render(first, 29);
        final one = workspace.retainedCacheEntries;
        final coverageBytes = workspace.retainedCoverageBytes;
        expect(one.coverage, greaterThan(0));
        expect(one.paths, greaterThan(0));
        expect(one.trimMetrics, greaterThan(0));
        expect(one.gradientLuts, greaterThan(0));

        render(second, 29);
        final expected = Uint32List.fromList(pixels.typedList);
        expect(workspace.retainedCacheEntries, (
          coverage: one.coverage * 2,
          paths: one.paths * 2,
          trimMetrics: one.trimMetrics * 2,
          gradientLuts: one.gradientLuts * 2,
        ));

        workspace.releaseScene(first);
        expect(workspace.retainedCacheEntries, one);
        expect(workspace.retainedCoverageBytes, coverageBytes);
        render(second, 29);
        expect(pixels.typedList, expected);

        // A newly registered instance can restore its own cache independently.
        final replacement = first.fork();
        render(replacement, 29);
        expect(pixels.typedList, expected);
        workspace.releaseScene(second);
        expect(workspace.retainedCacheEntries, one);
        workspace.releaseScene(replacement);
        workspace.releaseScene(replacement);
        expect(workspace.retainedCoverageBytes, 0);
        expect(workspace.retainedCacheEntries, (
          coverage: 0,
          paths: 0,
          trimMetrics: 0,
          gradientLuts: 0,
        ));
        render(replacement, 29);
        expect(pixels.typedList, expected);
        expect(workspace.retainedCacheEntries, one);
        workspace.resetCaches();
        expect(workspace.retainedCoverageBytes, 0);
        expect(workspace.retainedCacheEntries, (
          coverage: 0,
          paths: 0,
          trimMetrics: 0,
          gradientLuts: 0,
        ));
      });
    }
  }
}
