import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show compare, render;
import 'path_ops_test.dart' show animated, constant, fill;

Map<String, dynamic> maskPathRect(
  double x,
  double y,
  double w,
  double h, {
  bool closed = true,
}) => {
  'c': closed,
  'v': [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
  'i': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  'o': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

Map<String, dynamic> maskObject({
  required Map<String, dynamic> pt,
  String mode = 'a',
  bool inv = false,
  dynamic o,
  dynamic x,
}) => {'inv': inv, 'mode': mode, 'pt': pt, 'o': o ?? constant(100), 'x': ?x};

Map<String, dynamic> solidSceneWithMask({
  required List<Map<String, dynamic>> masks,
  double sw = 256,
  double sh = 256,
  String sc = '#FF0000',
}) => {
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': 256,
  'h': 256,
  'layers': [
    {
      'ty': 1,
      'sw': sw,
      'sh': sh,
      'sc': sc,
      'ip': 0,
      'op': 60,
      'st': 0,
      'ks': {
        'o': constant(100),
        'r': constant(0),
        'p': constant([0, 0, 0]),
        'a': constant([0, 0, 0]),
        's': constant([100, 100, 100]),
      },
      'hasMask': masks.isNotEmpty,
      'masksProperties': masks,
    },
  ],
};

Map<String, dynamic> shapeSceneWithMask({
  required List<Map<String, dynamic>> masks,
  required Map<String, dynamic> shape,
  required Map<String, dynamic> paint,
}) => {
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': 256,
  'h': 256,
  'layers': [
    {
      'ty': 4,
      'ip': 0,
      'op': 60,
      'st': 0,
      'ks': {
        'o': constant(100),
        'r': constant(0),
        'p': constant([0, 0, 0]),
        'a': constant([0, 0, 0]),
        's': constant([100, 100, 100]),
      },
      'hasMask': masks.isNotEmpty,
      'masksProperties': masks,
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            shape,
            paint,
            {
              'ty': 'tr',
              'p': constant([0, 0]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          ],
        },
      ],
    },
  ],
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('static Add mask on solid layer matches reference', () async {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(50, 50, 100, 100)), mode: 'a'),
      ],
      sc: '#00AAFF',
    );
    await compare(doc, [0.0, 30.0]);
  });

  test('static Add mask on shape layer matches reference', () async {
    final doc = shapeSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(60, 60, 80, 80)), mode: 'a'),
      ],
      shape: {
        'ty': 'rc',
        'p': constant([128, 128]),
        's': constant([200, 200]),
        'r': constant(0),
      },
      paint: fill([1.0, 0.5, 0.0]),
    );
    await compare(doc, [0.0, 15.0]);
  });

  test('animated Add mask matches reference across keyframes', () async {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(
          pt: animated(
            maskPathRect(20, 20, 60, 60),
            maskPathRect(100, 100, 120, 120),
          ),
          mode: 'a',
        ),
      ],
      sc: '#22CC44',
    );
    await compare(doc, [0.0, 15.0, 30.0, 45.0, 59.0]);
  });

  test('None mask (mode: n) does not clip layer content', () async {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(50, 50, 50, 50)), mode: 'n'),
      ],
      sc: '#EE3322',
    );
    await compare(doc, [0.0, 30.0]);
  });

  test('mask on precomposition layer clips child layers', () async {
    final doc = {
      'v': '5.5.2',
      'fr': 60,
      'ip': 0,
      'op': 60,
      'w': 256,
      'h': 256,
      'assets': [
        {
          'id': 'sub_comp',
          'layers': [
            {
              'ty': 1,
              'sw': 256,
              'sh': 256,
              'sc': '#FF8800',
              'ip': 0,
              'op': 60,
              'st': 0,
              'ks': {
                'o': constant(100),
                'r': constant(0),
                'p': constant([0, 0, 0]),
                'a': constant([0, 0, 0]),
                's': constant([100, 100, 100]),
              },
            },
          ],
        },
      ],
      'layers': [
        {
          'ty': 0,
          'refId': 'sub_comp',
          'ip': 0,
          'op': 60,
          'st': 0,
          'w': 256,
          'h': 256,
          'ks': {
            'o': constant(100),
            'r': constant(0),
            'p': constant([0, 0, 0]),
            'a': constant([0, 0, 0]),
            's': constant([100, 100, 100]),
          },
          'hasMask': true,
          'masksProperties': [
            maskObject(pt: constant(maskPathRect(40, 40, 120, 120)), mode: 'a'),
          ],
        },
      ],
    };
    await compare(doc, [0.0, 30.0]);
  });

  test('Software RLE rasterizer renders masked layers correctly', () {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(50, 50, 100, 100)), mode: 'a'),
      ],
      sc: '#0000FF',
    );
    final comp = FastLottieComposition.fromJson(doc);
    final buf = debugRenderSoftwareFrame(
      comp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    expect(buf.length, 256 * 256 * 4);

    // Pixel at (100, 100) is inside mask (50..150, 50..150) -> should be colored.
    final insideIdx = (100 * 256 + 100) * 4;
    // BGRA format: B, G, R, A
    expect(buf[insideIdx + 0], greaterThan(200)); // Blue
    expect(buf[insideIdx + 3], greaterThan(200)); // Alpha

    // Pixel at (10, 10) is outside mask -> should be completely transparent (0).
    final outsideIdx = (10 * 256 + 10) * 4;
    expect(buf[outsideIdx + 3], 0);

    // Pixel at (200, 200) is outside mask -> should be completely transparent (0).
    final outsideIdx2 = (200 * 256 + 200) * 4;
    expect(buf[outsideIdx2 + 3], 0);
  });

  test('software difference and subtract masks compose in authoring order', () {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(20, 20, 100, 100))),
        maskObject(pt: constant(maskPathRect(60, 20, 100, 100)), mode: 'f'),
        maskObject(
          pt: constant(maskPathRect(130, 20, 20, 100)),
          mode: 's',
          o: constant(50),
        ),
      ],
    );
    final composition = FastLottieComposition.fromJson(doc);
    final session = FastLottieSoftwareSession(
      composition,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(session.dispose);
    final pixels = session.renderFrame(0);
    int alpha(int x) => pixels[60 * 256 + x] >>> 24;
    expect(
      [alpha(30), alpha(80), alpha(125), alpha(155), alpha(170)],
      [255, 0, 255, 255, 0],
    );
    expect(alpha(140), closeTo(128, 1));
  });

  test('single mask opacity scales the composite of overlapping paints', () {
    final doc = shapeSceneWithMask(
      masks: [
        maskObject(
          pt: constant(maskPathRect(35, 35, 100, 100)),
          o: animated([50], [0]),
        ),
      ],
      shape: {
        'ty': 'rc',
        'p': constant([85, 85]),
        's': constant([200, 200]),
      },
      paint: fill([1, 0, 0]),
    );
    final items = doc['layers'][0]['shapes'][0]['it'] as List;
    items.insert(2, fill([0, 0, 1]));
    final session = FastLottieSoftwareSession(
      FastLottieComposition.fromJson(doc),
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(session.dispose);
    for (final (frame, alpha) in [(0.0, 128), (59.0, 0), (0.0, 128)]) {
      final pixels = session.renderFrame(frame);
      expect(pixels[85 * 256 + 85] >>> 24, alpha);
      expect(pixels[85 * 256 + 20], 0);
    }
  });

  test('mask expansion animates across positive and negative distances', () {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(
          pt: constant(maskPathRect(50, 50, 100, 100)),
          x: animated([12], [-60]),
        ),
      ],
    );
    // Blended layers use mask bounds to size their software render region.
    doc['layers'][0]['bm'] = 1;
    final session = FastLottieSoftwareSession(
      FastLottieComposition.fromJson(doc),
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(session.dispose);
    for (final (frame, outside, inside, center) in [
      (0.0, 255, 255, 255),
      (20.0, 0, 0, 255),
      (59.0, 0, 0, 0),
      (0.0, 255, 255, 255),
    ]) {
      final pixels = session.renderFrame(frame);
      int alpha(int x) => pixels[100 * 256 + x] >>> 24;
      expect(
        [alpha(32), alpha(44), alpha(56), alpha(100)],
        [0, outside, inside, center],
      );
    }
  });

  test('retained mask coverage matches uncached output across seeks', () {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(10.5, 25.5, 100, 80))),
        maskObject(pt: constant(maskPathRect(30.5, 40.5, 45, 40)), mode: 'f'),
      ],
    );
    final layer = doc['layers'][0] as Map<String, dynamic>;
    layer['ks']['o'] = animated([50], [100]);
    final comp = FastLottieComposition.fromJson(doc);
    final cached = FastLottieSoftwareSession(
      comp,
      pixelWidth: 191,
      pixelHeight: 163,
    );
    final uncached = FastLottieSoftwareSession(
      comp,
      pixelWidth: 191,
      pixelHeight: 163,
      retainCoverage: false,
    );
    try {
      int? retainedBytes;
      for (final frame in [0.0, 30.0, 59.0, 0.0]) {
        expect(
          cached.renderFrame(frame),
          orderedEquals(uncached.renderFrame(frame)),
        );
        retainedBytes ??= cached.retainedCoverageBytes;
        expect(cached.retainedCoverageBytes, retainedBytes);
      }
      expect(retainedBytes, greaterThan(0));
      expect(retainedBytes, lessThanOrEqualTo(1024 * 1024));
      expect(uncached.retainedCoverageBytes, 0);
    } finally {
      cached.dispose();
      uncached.dispose();
    }
  });

  test('multiple Add masks on solid layer combine correctly', () async {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(pt: constant(maskPathRect(30, 30, 60, 60)), mode: 'a'),
        maskObject(pt: constant(maskPathRect(120, 120, 80, 80)), mode: 'a'),
      ],
      sc: '#AA00FF',
    );
    await compare(doc, [0.0, 30.0]);
  });

  test('mask with 50% opacity attenuates layer alpha', () async {
    final doc = solidSceneWithMask(
      masks: [
        maskObject(
          pt: constant(maskPathRect(50, 50, 100, 100)),
          mode: 'a',
          o: constant(50),
        ),
      ],
      sc: '#00FF00',
    );
    await compare(doc, [0.0, 30.0]);
  });

  test('mask with 50% opacity on transformed layer uses local saveLayer bounds', () async {
    final doc = {
      'v': '5.5.2',
      'fr': 60,
      'ip': 0,
      'op': 60,
      'w': 256,
      'h': 256,
      'layers': [
        {
          'ty': 4,
          'ip': 0,
          'op': 60,
          'st': 0,
          'ks': {
            'o': constant(100),
            'r': constant(25),
            'p': constant([135, 125]),
            'a': constant([40, 40]),
            's': constant([120, 120]),
          },
          'hasMask': true,
          'masksProperties': [
            maskObject(
              pt: constant(maskPathRect(10, 10, 60, 60)),
              mode: 'a',
              o: constant(55),
            ),
          ],
          'shapes': [
            {
              'ty': 'rc',
              'p': constant([40, 40]),
              's': constant([80, 80]),
              'r': constant(8),
            },
            fill([0.2, 0.6, 0.9]),
          ],
        },
      ],
    };
    await compare(doc, [0.0, 15.0, 30.0]);
  });

  test('cached static combined masks match reference across animated layer frames', () async {
    final doc = shapeSceneWithMask(
      masks: [
        maskObject(
          pt: constant(maskPathRect(40, 40, 160, 160)),
          mode: 'a',
        ),
        maskObject(
          pt: constant(maskPathRect(95, 95, 60, 60)),
          mode: 's',
        ),
      ],
      shape: {
        'ty': 'rc',
        'p': animated([110, 128], [146, 128]),
        's': constant([160, 160]),
        'r': constant(12),
      },
      paint: fill([0.9, 0.4, 0.1]),
    );
    await compare(doc, [0.0, 15.0, 45.0, 15.0]);
  });

  test('cached static expanded mask on Canvas matches software rasterizer across frames', () async {
    final doc = shapeSceneWithMask(
      masks: [
        maskObject(
          pt: constant(maskPathRect(50, 50, 140, 140)),
          mode: 'a',
          x: constant(8),
          o: constant(60),
        ),
      ],
      shape: {
        'ty': 'rc',
        'p': animated([110, 128], [146, 128]),
        's': constant([180, 180]),
        'r': constant(10),
      },
      paint: fill([0.9, 0.4, 0.1]),
    );
    final comp = FastLottieComposition.fromJson(doc);
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final session = FastLottieSoftwareSession(
      comp,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    addTearDown(player.dispose);
    addTearDown(session.dispose);
    for (final frame in [0.0, 15.0, 45.0, 15.0]) {
      final canvasRgba = await render(
        (c) => player.draw(
          c,
          const Rect.fromLTWH(0, 0, 256, 256),
          frame / 60.0,
          useFrameRate: false,
        ),
      );
      final swPixels = session.renderFrame(frame);
      var diffSum = 0;
      for (var p = 0; p < 256 * 256; p++) {
        // Both ImageByteFormat.rawRgba and software output are premultiplied.
        final cr = canvasRgba[p * 4 + 0];
        final cg = canvasRgba[p * 4 + 1];
        final cb = canvasRgba[p * 4 + 2];
        final ca = canvasRgba[p * 4 + 3];
        final sp = swPixels[p];
        diffSum += (ca - (sp >>> 24)).abs() +
            (cr - ((sp >>> 16) & 0xff)).abs() +
            (cg - ((sp >>> 8) & 0xff)).abs() +
            (cb - (sp & 0xff)).abs();
      }
      expect(
        diffSum / (256 * 256 * 4),
        lessThan(0.65),
        reason: 'expanded mask mismatch at frame=$frame',
      );
    }
  });

  test('real TGS masked stickers match reference', () async {
    for (final name in [
      'emoji_u1f308',
      'emoji_u1f31b',
      'emoji_u1f37e',
      'emoji_u1f483',
    ]) {
      final file = File('example/assets/tgs/NotoEmoji/$name.tgs');
      if (file.existsSync()) {
        final raw = decodeLottieBytes(file.readAsBytesSync());
        final doc = jsonDecode(utf8.decode(raw)) as Map<String, dynamic>;
        await compare(doc, [0.0, 15.0, 30.0]);
      }
    }
  });
}
