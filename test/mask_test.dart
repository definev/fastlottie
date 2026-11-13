import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show compare;
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
