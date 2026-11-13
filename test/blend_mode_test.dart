import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show render;
import 'path_ops_test.dart' show constant, fill;

Map<String, dynamic> solidLayer({
  required int index,
  required List<double> color,
  required int bm,
  int width = 256,
  int height = 256,
  double opacity = 100,
}) => {
  'ind': index,
  'ty': 1,
  'ip': 0,
  'op': 60,
  'st': 0,
  'bm': bm,
  'sw': width,
  'sh': height,
  'sc': '#${((color[0] * 255).round().toRadixString(16).padLeft(2, '0'))}${((color[1] * 255).round().toRadixString(16).padLeft(2, '0'))}${((color[2] * 255).round().toRadixString(16).padLeft(2, '0'))}',
  'ks': {
    'o': constant(opacity),
    'r': constant(0),
    'p': constant([width / 2, height / 2, 0]),
    'a': constant([width / 2, height / 2, 0]),
    's': constant([100, 100, 100]),
  },
};

Map<String, dynamic> shapeLayer({
  required int index,
  required int bm,
  required List<double> color,
  required double x,
  required double y,
  required double w,
  required double h,
}) => {
  'ind': index,
  'ty': 4,
  'ip': 0,
  'op': 60,
  'st': 0,
  'bm': bm,
  'ks': {
    'o': constant(100),
    'r': constant(0),
    'p': constant([0, 0, 0]),
    'a': constant([0, 0, 0]),
    's': constant([100, 100, 100]),
  },
  'shapes': [
    {
      'ty': 'gr',
      'it': [
        {
          'ty': 'rc',
          'p': constant([x, y]),
          's': constant([w, h]),
          'r': constant(0),
        },
        fill(color),
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
};

Map<String, dynamic> blendScene({
  required List<Map<String, dynamic>> layers,
  int width = 256,
  int height = 256,
}) => {
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': width,
  'h': height,
  'layers': layers,
};

void main() {
  test('Multiply blend mode (bm=1) darkens overlapping region', () async {
    final json = blendScene(
      layers: [
        // Top layer: Multiply green on red
        shapeLayer(
          index: 1,
          bm: 1,
          color: [0, 1, 0],
          x: 128,
          y: 128,
          w: 128,
          h: 128,
        ),
        // Base layer: solid Red
        shapeLayer(
          index: 2,
          bm: 0,
          color: [1, 0, 0],
          x: 128,
          y: 128,
          w: 256,
          h: 256,
        ),
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final p = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final pixels = await render(
      (c) => p.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
    );
    // Green (0, 255, 0) multiplied with Red (255, 0, 0) gives Black (0, 0, 0)!
    // Inside the 128x128 center:
    final centerIdx = (128 * 256 + 128) * 4;
    final r = pixels[centerIdx];
    final g = pixels[centerIdx + 1];
    final b = pixels[centerIdx + 2];
    final a = pixels[centerIdx + 3];
    expect(r, lessThan(10));
    expect(g, lessThan(10));
    expect(b, lessThan(10));
    expect(a, 255);
  });

  test('Screen blend mode (bm=2) brightens overlapping region', () async {
    final json = blendScene(
      layers: [
        shapeLayer(
          index: 1,
          bm: 2,
          color: [0, 1, 0],
          x: 128,
          y: 128,
          w: 128,
          h: 128,
        ),
        shapeLayer(
          index: 2,
          bm: 0,
          color: [1, 0, 0],
          x: 128,
          y: 128,
          w: 256,
          h: 256,
        ),
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final p = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final pixels = await render(
      (c) => p.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
    );
    // Screen of Red and Green gives Yellow (255, 255, 0)!
    final centerIdx = (128 * 256 + 128) * 4;
    final r = pixels[centerIdx];
    final g = pixels[centerIdx + 1];
    final b = pixels[centerIdx + 2];
    expect(r, greaterThan(240));
    expect(g, greaterThan(240));
    expect(b, lessThan(10));
  });

  test('Difference blend mode (bm=10) subtracts colors', () async {
    final json = blendScene(
      layers: [
        shapeLayer(
          index: 1,
          bm: 10,
          color: [1, 1, 1], // White
          x: 128,
          y: 128,
          w: 128,
          h: 128,
        ),
        shapeLayer(
          index: 2,
          bm: 0,
          color: [1, 0, 0], // Red
          x: 128,
          y: 128,
          w: 256,
          h: 256,
        ),
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final p = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final pixels = await render(
      (c) => p.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
    );
    // Difference between White (255, 255, 255) and Red (255, 0, 0) gives Cyan (0, 255, 255)!
    final centerIdx = (128 * 256 + 128) * 4;
    final r = pixels[centerIdx];
    final g = pixels[centerIdx + 1];
    final b = pixels[centerIdx + 2];
    expect(r, lessThan(10));
    expect(g, greaterThan(240));
    expect(b, greaterThan(240));
  });

  test('Software rasterizer renders blend modes accurately', () async {
    final json = blendScene(
      layers: [
        shapeLayer(
          index: 1,
          bm: 2, // Screen: Red + Green = Yellow
          color: [0, 1, 0],
          x: 128,
          y: 128,
          w: 128,
          h: 128,
        ),
        shapeLayer(
          index: 2,
          bm: 0,
          color: [1, 0, 0],
          x: 128,
          y: 128,
          w: 256,
          h: 256,
        ),
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final swPixels = debugRenderSoftwareFrame(
      comp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    // BGRA format: byte 0 is B, byte 1 is G, byte 2 is R, byte 3 is A
    final centerIdx = (128 * 256 + 128) * 4;
    final b = swPixels[centerIdx];
    final g = swPixels[centerIdx + 1];
    final r = swPixels[centerIdx + 2];
    final a = swPixels[centerIdx + 3];
    expect(r, greaterThan(240));
    expect(g, greaterThan(240));
    expect(b, lessThan(10));
    expect(a, 255);
  });

  test('All newly supported TGS stickers with blend modes compile and render', () async {
    final bmStickers = [
      'example/assets/tgs/NotoEmoji/emoji_u1f389.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f393.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f3c1.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f3f3_fe0f.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f3f4.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u26ce.tgs',
    ];
    for (final path in bmStickers) {
      final file = File(path);
      if (!file.existsSync()) continue;
      final bytes = file.readAsBytesSync();
      final comp = FastLottieComposition.fromBytes(bytes);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      final pixels = await render(
        (canvas) =>
            player.draw(canvas, const ui.Rect.fromLTWH(0, 0, 256, 256), 0.5),
      );
      expect(pixels.length, 256 * 256 * 4);
      player.dispose();

      // Also render in software rasterizer:
      final swPixels = debugRenderSoftwareFrame(comp, 0, pixelWidth: 256, pixelHeight: 256);
      expect(swPixels.length, 256 * 256 * 4);
    }
  });
}
