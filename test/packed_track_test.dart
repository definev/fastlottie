import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show compare, fixture, render;
import 'path_ops_test.dart' show constant, fill, scene;

Map<String, dynamic> _morphShape(double offset) => {
  'c': true,
  'v': [
    [30 + offset, 40],
    [100, 25 + offset],
    [180, 40 + offset],
    [220 - offset, 100],
    [190, 200 - offset],
    [100 + offset, 220],
    [40, 170],
  ],
  'i': List.generate(7, (_) => [0, 0]),
  'o': List.generate(7, (_) => [0, 0]),
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'packed SIMD strides handle 42 floats, implicit ends and holds',
    () async {
      final json = scene([
        {
          'ty': 'sh',
          'ks': {
            'a': 1,
            'k': [
              {
                't': 5,
                's': [_morphShape(0)],
              },
              {
                't': 20,
                's': [_morphShape(12)],
                'h': 1,
              },
              {
                't': 35,
                's': [_morphShape(25)],
              },
              {
                't': 55,
                's': [_morphShape(4)],
              },
            ],
          },
        },
        fill([.1, .6, .9]),
      ]);
      for (final simd in [false, true]) {
        await compare(json, [
          0,
          5,
          12.25,
          20,
          34.9,
          35,
          47.5,
          59,
          7,
        ], simd: simd);
      }
      final scalar = FastLottieComposition.fromJson(
        json,
        options: const FastLottieOptions(useSimd: false),
      );
      final simd = FastLottieComposition.fromJson(json);
      expect(simd.contentKey, scalar.contentKey);
    },
  );

  test('packed keyframes preserve deterministic prefix-free content keys', () {
    // Recorded with prefix-free AST hashing (FLK2) + premultiplied luma matte.
    // Includes eased transforms, explicit endpoints and wide SIMD morphs.
    const expected = {
      'icon': '710667ca9648cb6e3e2cf7f49c3a1360',
      'many_shapes': '5ed4f76c28edea8112b3b12740efdd06',
      'morph': '1752c3d18b2c84ca39fc6d825a015cd8',
    };
    const fused = bool.fromEnvironment(
      'FASTLOTTIE_FUSED_FILL',
      defaultValue: true,
    );
    expect(
      {
        for (final key in expected.keys)
          key: FastLottieComposition.fromJson(fixture(key)).contentKey,
      },
      {
        for (final entry in expected.entries)
          entry.key: fused ? '${entry.value}_fused1' : entry.value,
      },
    );
  });

  test('packed RGB values normalize each key independently', () async {
    Map<String, dynamic> document(bool byteColor) {
      final json = fixture('icon');
      final paint = json['layers'][0]['shapes'][0]['it'][1];
      paint['c'] = {
        'a': 1,
        'k': [
          {
            't': 0,
            's': byteColor ? [128, 64, 8] : [128 / 255, 64 / 255, 8 / 255],
            'e': [.1, .8, .6],
          },
          {
            't': 30,
            's': [.1, .8, .6],
          },
          {
            't': 59,
            's': [.8, .2, .1],
          },
        ],
      };
      return json;
    }

    final actual = FastLottiePlayer(
      FastLottieComposition.fromJson(document(true)),
      cache: FastLottieCache.none,
    );
    final expected = FastLottiePlayer(
      FastLottieComposition.fromJson(document(false)),
      cache: FastLottieCache.none,
    );
    addTearDown(actual.dispose);
    addTearDown(expected.dispose);
    for (final progress in [0.0, .2, .5, .9, .1]) {
      final a = await render(
        (c) => actual.draw(c, const Rect.fromLTWH(0, 0, 256, 256), progress),
      );
      final b = await render(
        (c) => expected.draw(c, const Rect.fromLTWH(0, 0, 256, 256), progress),
      );
      expect(a, b);
    }
  });

  test('reports the exact JSON path of a malformed keyframe component', () {
    final json = fixture('static');
    json['layers'][0]['ks']['p'] = {
      'a': 1,
      'k': [
        {
          't': 0,
          's': [0, 0],
        },
        {
          't': 59,
          's': [30, 'bad coordinate'],
        },
      ],
    };
    expect(
      () => FastLottieComposition.fromJson(json),
      throwsA(
        isA<UnsupportedLottieException>().having(
          (e) => e.jsonPath,
          'path',
          r'$.layers[0].ks.p.k[1].s[1]',
        ),
      ),
    );
  });

  test('empty animated paths retain zero-width packed tracks', () async {
    final empty = {'c': true, 'v': [], 'i': [], 'o': []};
    final json = scene([
      {
        'ty': 'sh',
        'ks': {
          'a': 1,
          'k': [
            {
              't': 0,
              's': [empty],
            },
            {
              't': 59,
              's': [empty],
            },
          ],
        },
      },
      fill([.1, .6, .9]),
    ]);
    final player = FastLottiePlayer(
      FastLottieComposition.fromJson(json),
      cache: FastLottieCache.none,
    );
    addTearDown(player.dispose);
    final blank = await render((_) {});
    for (final progress in [0.0, .5, 1.0, .1]) {
      expect(
        await render(
          (c) => player.draw(c, const Rect.fromLTWH(0, 0, 256, 256), progress),
        ),
        blank,
      );
    }
    // Constant empty paths use the same geometry consumer.
    json['layers'][0]['shapes'][0]['ks'] = constant(empty);
    expect(FastLottieComposition.fromJson(json).isStatic, isTrue);
  });
}
