import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show render;
import 'mask_test.dart' show solidSceneWithMask;
import 'path_ops_test.dart' show constant, fill, rectangle, scene;
import 'tgs_fixtures.dart';

const _rect = ui.Rect.fromLTWH(0, 0, 256, 256);

Map<String, Object> _shadow() => {
  'ty': 2,
  'c': constant([0, 0, 0, 1]),
  'a': constant(180),
  'd': constant(10),
  'bm': constant(1),
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'shadow follows the composited silhouette and preserves alpha',
    () async {
      final json = scene([
        rectangle(80, 80, 80, 80),
        fill([1, 1, 1]),
        rectangle(100, 80, 80, 80),
        fill([1, 1, 1]),
      ]);
      final layer = json['layers'][0] as Map<String, dynamic>;
      layer['ks']['o'] = constant(50);
      final without = FastLottieComposition.fromJson(json);
      layer['sy'] = [_shadow()];
      final withShadow = FastLottieComposition.fromJson(json);
      expect(withShadow.contentKey, isNot(without.contentKey));
      final software = FastLottieSoftwareSession(
        withShadow,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final player = FastLottiePlayer(withShadow, cache: FastLottieCache.none);
      addTearDown(software.dispose);
      addTearDown(player.dispose);
      final sw = software.renderFrame(0);
      final canvas = await render((c) => player.draw(c, _rect, 0));
      for (final (x, gray, alpha) in [
        (30, 0, 0),
        (45, 0, 127),
        (63, 127, 127),
        (80, 127, 127),
        (138, 127, 127),
        (145, 0, 0),
      ]) {
        final i = 80 * 256 + x;
        expect(sw[i] >>> 24, alpha, reason: 'alpha at x=$x');
        expect(sw[i] & 255, gray, reason: 'blue at x=$x');
        expect(
          canvas[4 * i + 3],
          closeTo(alpha, 1),
          reason: 'Canvas alpha at x=$x',
        );
        expect(canvas[4 * i], closeTo(gray, 1), reason: 'Canvas red at x=$x');
      }
    },
  );

  test('rejects blur, choke, and noise at the style parameter', () {
    for (final key in ['s', 'ch', 'no']) {
      final json = solidSceneWithMask(masks: []);
      json['layers'][0]['sy'] = [_shadow()..[key] = constant(1)];
      expect(
        () => FastLottieComposition.fromJson(json),
        throwsA(
          isA<UnsupportedLottieException>().having(
            (e) => e.jsonPath,
            'path',
            endsWith('.sy[0].$key'),
          ),
        ),
      );
    }
  });

  for (final code in ['1f607', '1f623', '1f631']) {
    test('renders original Noto sticker $code', () async {
      final bytes = File('$tgsCorpusPath/NotoEmoji/emoji_u$code.tgs')
          .readAsBytesSync();
      final comp = await FastLottieComposition.fromBytesAsync(bytes);
      final software = FastLottieSoftwareSession(
        comp,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final dart = FastLottieSoftwareSession(
        comp,
        pixelWidth: 256,
        pixelHeight: 256,
        preferNative: false,
      );
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(software.dispose);
      addTearDown(dart.dispose);
      addTearDown(player.dispose);
      for (final frame in [0.0, 15.0, 35.0, 80.0, 0.0]) {
        final sw = software.renderFrame(frame);
        expect(
          sw,
          orderedEquals(dart.renderFrame(frame)),
          reason: 'frame $frame',
        );
        final canvas = await render(
          (c) => player.draw(
            c,
            _rect,
            frame / (comp.endFrame - comp.startFrame),
            useFrameRate: false,
          ),
        );
        var sum = 0;
        for (var i = 0; i < sw.length; i++) {
          for (final (channel, shift) in [(0, 16), (1, 8), (2, 0), (3, 24)]) {
            sum += (((sw[i] >>> shift) & 255) - canvas[4 * i + channel]).abs();
          }
        }
        expect(sw.any((p) => p >>> 24 != 0), isTrue);
        expect(sum / canvas.length, lessThan(2.0), reason: 'frame $frame');
      }
    });
  }
}
