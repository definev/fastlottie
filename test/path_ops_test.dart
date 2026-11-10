import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, compare, fixture, render;

Map<String, dynamic> constant(dynamic value) => {'a': 0, 'k': value};
Map<String, dynamic> animated(dynamic a, dynamic b) => {
  'a': 1,
  'k': [
    {
      't': 0,
      's': a is List ? a : [a],
      'i': {
        'x': [1],
        'y': [1],
      },
      'o': {
        'x': [0],
        'y': [0],
      },
    },
    {
      't': 59,
      's': b is List ? b : [b],
    },
  ],
};
Map<String, dynamic> line(double y, {double length = 180}) => {
  'ty': 'sh',
  'ks': constant({
    'v': [
      [30, y],
      [30 + length, y],
    ],
    'i': [
      [0, 0],
      [0, 0],
    ],
    'o': [
      [0, 0],
      [0, 0],
    ],
    'c': false,
  }),
};
Map<String, dynamic> stroke({bool gradient = false}) => {
  'ty': gradient ? 'gs' : 'st',
  'c': constant([.1, .6, .9]),
  'o': constant(100),
  'w': constant(7),
  'lc': 2,
  'lj': 2,
  if (gradient) ...{
    'g': {
      'p': 2,
      'k': constant([0, 1, 0, 0, 1, 0, 0, 1]),
    },
    's': constant([20, 60]),
    'e': constant([230, 160]),
    't': 1,
  },
};
Map<String, dynamic> trim(
  dynamic start,
  dynamic end,
  dynamic offset, {
  int mode = 1,
}) => {'ty': 'tm', 's': start, 'e': end, 'o': offset, 'm': mode};
Map<String, dynamic> scene(List<Map<String, dynamic>> shapes) {
  final json = fixture('static');
  json['layers'][0]['shapes'] = shapes;
  return json;
}

Map<String, dynamic> rectangle(double x, double y, double w, double h) => {
  'ty': 'rc',
  'p': constant([x, y]),
  's': constant([w, h]),
  'r': constant(0),
};
Map<String, dynamic> fill(List<double> color) => {
  'ty': 'fl',
  'c': constant(color),
  'o': constant(100),
  'r': 1,
};

Map<String, dynamic> matteScene(int type) {
  final json = scene([
    rectangle(128, 128, 180, 160),
    fill([.1, .7, .9]),
  ]);
  final target = json['layers'][0] as Map<String, dynamic>;
  target['tt'] = type;
  target['ind'] = 2;
  final source = fixture('static')['layers'][0] as Map<String, dynamic>;
  source['ind'] = 1;
  source['td'] = 1;
  source['shapes'] = [
    rectangle(100, 128, 100, 210),
    fill([1, 1, 1]),
  ];
  json['layers'] = [source, target];
  return json;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'simultaneous trim, swapped endpoints, wrap, empty/full and reverse seek',
    () async {
      for (final ends in [(0, 100), (30, 30), (80, 20)]) {
        final json = scene([
          line(80),
          line(150),
          stroke(),
          trim(constant(ends.$1), constant(ends.$2), animated(-400, 540)),
        ]);
        await compare(json, [0, 14.5, 30, 59, 5, 0]);
      }
      await compare(
        scene([
          line(80),
          stroke(),
          trim(animated(0, 80), animated(80, 100), constant(0)),
        ]),
        [0, 15, 39.5, 59, 0],
      );
    },
  );

  test('individual trim spans unequal paths in source order', () async {
    await compare(
      scene([
        line(60, length: 80),
        line(140),
        stroke(),
        trim(constant(0), animated(0, 100), constant(0), mode: 2),
      ]),
      [0, 10, 25, 45, 59, 12],
    );
  });

  test(
    'trim reaches nested geometry and paints declared before the modifier',
    () async {
      final group =
          fixture('static')['layers'][0]['shapes'][0] as Map<String, dynamic>;
      group['it'].removeAt(1); // Only the stroke, with a rounded rectangle.
      group['it'].last['p'] = constant([10, 5]);
      final json = scene([
        group,
        trim(constant(0), animated(5, 95), constant(-90)),
      ]);
      await compare(json, [0, 20, 50, 59, 5]);
      expect(FastLottieComposition.fromJson(json).isStatic, isFalse);
    },
  );

  test(
    'closed trim keeps full contours closed and partial contours open',
    () async {
      for (final end in [45, 100]) {
        await compare(
          scene([
            rectangle(128, 128, 120, 150),
            stroke(),
            trim(constant(0), constant(end), constant(50)),
          ]),
          [0],
        );
      }
    },
  );

  test(
    'dash supports animated offsets, omitted gap, gradients and trim',
    () async {
      for (final gradient in [false, true]) {
        final paint = stroke(gradient: gradient);
        paint['d'] = [
          {'n': 'd', 'v': animated(4, 15)},
          {'n': 'o', 'v': animated(-70, 60)},
        ];
        await compare(
          scene([
            line(80),
            line(160),
            paint,
            trim(constant(0), animated(30, 100), constant(0)),
          ]),
          [0, 14.5, 40, 59, 5],
        );
      }
    },
  );

  test(
    'dash preserves alternating gaps and resets phase per contour',
    () async {
      final paint = stroke()
        ..['d'] = [
          {'n': 'd', 'v': constant(15)},
          {'n': 'g', 'v': constant(4)},
          {'n': 'd', 'v': constant(6)},
          {'n': 'g', 'v': constant(9)},
          {'n': 'o', 'v': animated(100, -500)},
        ];
      await compare(scene([line(80), line(150), paint]), [0, 20, 59, 7]);
    },
  );

  for (final type in [1, 2]) {
    test(
      'alpha matte $type: source hidden from stacking, opacity and timing',
      () async {
        final json = matteScene(type);
        json['layers'][0]['ks']['p'] = animated([-40, 0], [60, 0]);
        json['layers'][0]['ks']['o'] = constant(65);
        json['layers'][0]['op'] = 45;
        json['layers'][1]['ks']['o'] = constant(80);
        await compare(json, [0, 12, 29.5, 44, 45, 59, 0]);
      },
    );
  }

  test(
    'mattes work inside precomps with offset and parent transform',
    () async {
      final json = matteScene(1);
      final nested = json['layers'];
      // A matte may be parented to its target; player forking must not recurse
      // through the matte reference while constructing the parenting graph.
      nested[0]['parent'] = 2;
      nested[1]['ks']['p'] = animated([0, 0], [25, 0]);
      final precomp = fixture('static')['layers'][0] as Map<String, dynamic>;
      precomp.remove('shapes');
      precomp['ty'] = 0;
      precomp['refId'] = 'nested';
      precomp['st'] = 5;
      precomp['ks']['s'] = constant([80, 80]);
      json['assets'] = [
        {'id': 'nested', 'layers': nested},
      ];
      json['layers'] = [precomp];
      await compare(json, [5, 20, 50, 5]);
      // Before st, rlottie evaluates child visibility at negative time, whereas
      // lottie clamps its visibility animation to frame zero.
      final player = FastLottiePlayer(FastLottieComposition.fromJson(json));
      final before = await render(
        (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
      );
      expect(before.every((b) => b == 0), isTrue);
      player.dispose();
    },
  );

  test(
    'luma mattes use rlottie RGB weights, including inverse and opacity',
    () async {
      for (final type in [3, 4]) {
        for (final color in [
          [1.0, 0.0, 0.0],
          [0.0, 1.0, 0.0],
          [0.0, 0.0, 1.0],
          [0.0, 0.0, 0.0],
          [1.0, 1.0, 1.0],
        ]) {
          final json = matteScene(type);
          json['layers'][0]['shapes'][1]['c'] = constant(color);
          json['layers'][0]['ks']['o'] = constant(50);
          final player = FastLottiePlayer(FastLottieComposition.fromJson(json));
          final image = await render(
            (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
          );
          final luma =
              (255 * (.299 * color[0] + .587 * color[1] + .114 * color[2]))
                  .round();
          // rlottie's updateLuma unpremultiplies RGB before replacing alpha.
          expect(
            image[(128 * 256 + 100) * 4 + 3],
            closeTo(type == 3 ? luma : 255 - luma, 1),
          );
          expect(image[(128 * 256 + 200) * 4 + 3], type == 3 ? 0 : 255);
          player.dispose();
        }
      }
    },
  );

  test('modifier and matte models transfer from workers and fork independent state', () async {
    final json = matteScene(1);
    json['layers'][1]['shapes'].add(
      trim(constant(0), animated(10, 90), constant(0)),
    );
    final comp = await FastLottieComposition.fromBytesAsync(bytes(json));
    final a = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final b = FastLottiePlayer(comp, cache: FastLottieCache.none);
    Future<List<int>> draw(FastLottiePlayer p, double t) =>
        render((c) => p.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), t));
    final expected = await draw(a, .1);
    await draw(b, .9);
    expect(await draw(a, .1), expected);
    a.dispose();
    b.dispose();
  });

  test('reverse rectangles retain direction for holes and strokes', () async {
    for (final radius in [0, 20]) {
      final outer = rectangle(128, 128, 200, 180)..['r'] = constant(radius);
      final inner = rectangle(128, 128, 100, 80)
        ..['r'] = constant(radius)
        ..['d'] = 3;
      // lottie ignores rc.d. Verify its winding-dependent hole directly.
      final player = FastLottiePlayer(
        FastLottieComposition.fromJson(
          scene([
            outer,
            inner,
            fill([.2, .7, .9]),
            stroke(),
          ]),
        ),
      );
      final image = await render(
        (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
      );
      expect(image[(128 * 256 + 128) * 4 + 3], 0);
      expect(image[(128 * 256 + 50) * 4 + 3], 255);
      player.dispose();
      await compare(
        scene([
          inner,
          fill([.2, .7, .9]),
          stroke(),
        ]),
        [0],
      );
    }
  });

  test('invalid matte links, trim mode and dash names fail explicitly', () {
    final invalid = [
      matteScene(1)..['layers'][0]['tt'] = 1,
      matteScene(1)..['layers'][1]['tt'] = 5,
      scene([
        line(80),
        stroke(),
        trim(constant(0), constant(50), constant(0), mode: 3),
      ]),
      scene([
        line(80),
        stroke()
          ..['d'] = [
            {'n': 'g', 'v': constant(5)},
          ],
      ]),
    ];
    for (final json in invalid) {
      expect(
        () => FastLottieComposition.fromJson(json),
        throwsA(isA<UnsupportedLottieException>()),
      );
    }
  });
}
