import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, render;
import 'path_ops_test.dart' show animated, constant, fill, rectangle;
import 'tgs_fixtures.dart';

const _bounds = ui.Rect.fromLTWH(0, 0, 256, 256);

Map<String, dynamic> _effect(
  int type,
  String name,
  List<int> types,
  List<Object> values,
) => {
  'ty': type,
  'mn': name,
  'en': 1,
  'ef': [
    for (var i = 0; i < types.length; i++) {'ty': types[i], 'v': values[i]},
  ],
};

Map<String, dynamic> _matte(int id) => _effect(
  28,
  'ADBE Set Matte3',
  [10, 7, 7, 7, 7, 7],
  [
    for (final v in [id, 4, 0, 1, 1, 1]) constant(v),
  ],
);

Map<String, dynamic> _fill(Object color, Object opacity) => _effect(
  21,
  'ADBE Fill',
  [10, 7, 2, 7, 0, 0, 0],
  [
    constant(0),
    constant(0),
    color,
    constant(0),
    constant(0),
    constant(0),
    opacity,
  ],
);

Map<String, dynamic> _shape(
  int id,
  double x,
  double width,
  List<double> color, {
  double opacity = 100,
}) {
  final l = fixture('static')['layers'][0] as Map<String, dynamic>;
  l['ks']['o'] = constant(opacity);
  return l
    ..['ind'] = id
    ..['shapes'] = [rectangle(x, 80, width, 80), fill(color)];
}

Map<String, dynamic> _scene(List<Map<String, dynamic>> layers) =>
    fixture('static')..['layers'] = layers;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('Set Matte clips by index without hiding the source layer', () async {
    final upper = _shape(10, 65, 70, [1, 0, 0])..['ef'] = [_matte(42)];
    final lower = _shape(25, 125, 70, [0, 0, 1])..['ef'] = [_matte(42)];
    final source = _shape(42, 110, 100, [0, 1, 0]);
    final comp = FastLottieComposition.fromJson(_scene([upper, lower, source]));
    final sw = FastLottieSoftwareSession(
      comp,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    addTearDown(sw.dispose);
    addTearDown(player.dispose);
    final pixels = sw.renderFrame(0);
    final canvas = await render((c) => player.draw(c, _bounds, 0));
    for (final (x, argb) in [
      (40, 0),
      (75, 0xffff0000),
      (120, 0xff0000ff),
      (155, 0xff0000ff),
      (165, 0),
    ]) {
      final i = 80 * 256 + x;
      expect(pixels[i], argb, reason: 'software at x=$x');
      expect(canvas.sublist(i * 4, i * 4 + 4), [
        for (final shift in [16, 8, 0, 24]) (argb >>> shift) & 255,
      ], reason: 'Canvas at x=$x');
    }
    // Remove one target from that end of the matte so the base is visible.
    lower['op'] = 20;
    final later = FastLottieSoftwareSession(
      FastLottieComposition.fromJson(_scene([upper, lower, source])),
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(later.dispose);
    expect(later.renderFrame(30)[80 * 256 + 120], 0xff00ff00);
  });

  test('self Set Matte samples the unmasked layer once', () {
    final layer = _shape(13, 80, 80, [1, 0, 0], opacity: 50)
      ..['ef'] = [_matte(13)];
    final sw = FastLottieSoftwareSession(
      FastLottieComposition.fromJson(_scene([layer])),
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(sw.dispose);
    expect(sw.renderFrame(0)[80 * 256 + 80], 0x3f3f0000);
  });

  test(
    'Fill animates color and scales the alpha of the combined layer',
    () async {
      final layer = _shape(1, 80, 80, [0, 1, 0], opacity: 50);
      layer['ef'] = [
        _fill(animated([1, 0, 0], [0, 0, 1]), constant(.5)),
      ];
      final comp = FastLottieComposition.fromJson(_scene([layer]));
      expect(comp.isStatic, isFalse);
      final sw = FastLottieSoftwareSession(
        comp,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(sw.dispose);
      addTearDown(player.dispose);
      for (final (frame, argb) in [
        (0.0, 0x40400000),
        (59.0, 0x40000040),
        (0.0, 0x40400000),
      ]) {
        final pixels = sw.renderFrame(frame);
        const i = 80 * 256 + 80;
        expect(pixels[i], argb);
        expect(pixels[0], 0);
        final canvas = await render(
          (c) => player.draw(c, _bounds, frame / 60, useFrameRate: false),
        );
        for (final (channel, shift) in [(0, 16), (1, 8), (2, 0), (3, 24)]) {
          expect(canvas[i * 4 + channel], closeTo((argb >>> shift) & 255, 1));
        }
      }
    },
  );

  test('rejects a missing Set Matte source and unsupported Fill feather', () {
    final layer = _shape(1, 80, 80, [1, 0, 0])..['ef'] = [_matte(42)];
    void check(String path) => expect(
      () => FastLottieComposition.fromJson(_scene([layer])),
      throwsA(
        isA<UnsupportedLottieException>().having(
          (e) => e.jsonPath,
          'path',
          endsWith(path),
        ),
      ),
    );
    check('.ef[0].ef[0].v');
    final effect = _fill(constant([1, 1, 1]), constant(1));
    effect['ef'][4]['v'] = constant(3);
    layer['ef'] = [effect];
    check('.ef[0].ef[4].v');
  });

  for (final (code, frames) in [
    ('1f32a_fe0f', [0, 10, 20, 32, 60, 90]),
    ('1f41b', [0, 16, 35, 66, 100, 160, 220]),
    ('1f4bb', [0, 14, 20, 45, 92, 94, 120, 145]),
  ]) {
    test('Canvas and software render original sticker $code', () async {
      final bytes = File('$tgsCorpusPath/NotoEmoji/emoji_u$code.tgs')
          .readAsBytesSync();
      final comp = await FastLottieComposition.fromBytesAsync(bytes);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      final sw = FastLottieSoftwareSession(
        comp,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      addTearDown(sw.dispose);
      addTearDown(player.dispose);
      final duration = comp.endFrame - comp.startFrame;
      for (final frame in [
        ...frames.where((f) => f < duration),
        frames.first,
      ]) {
        final pixels = sw.renderFrame(comp.startFrame + frame);
        final canvas = await render(
          (c) => player.draw(c, _bounds, frame / duration, useFrameRate: false),
        );
        var diff = 0;
        for (var i = 0; i < pixels.length; i++) {
          for (final (channel, shift) in [(0, 16), (1, 8), (2, 0), (3, 24)]) {
            diff += (((pixels[i] >>> shift) & 255) - canvas[i * 4 + channel])
                .abs();
          }
        }
        expect(
          pixels.any((p) => p >>> 24 != 0),
          isTrue,
          reason: 'frame $frame',
        );
        expect(diff / canvas.length, lessThan(2), reason: 'frame $frame');
      }
    });
  }
}
