import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show render;
import 'path_ops_test.dart' show animated, constant, fill;

Map<String, dynamic> rectShape({
  required double x,
  required double y,
  required double w,
  required double h,
}) => {
  'ty': 'rc',
  'p': constant([x, y]),
  's': constant([w, h]),
  'r': constant(0),
};

Map<String, dynamic> circleShape({
  required double x,
  required double y,
  required double r,
}) => {
  'ty': 'el',
  'p': constant([x, y]),
  's': constant([r * 2, r * 2]),
};

Map<String, dynamic> mergeOp(int mode, {bool hidden = false}) => {
  'ty': 'mm',
  'mm': mode,
  'hd': hidden,
};

Map<String, dynamic> mergeScene({
  required List<Map<String, dynamic>> items,
  int width = 256,
  int height = 256,
}) => {
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': width,
  'h': height,
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
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            ...items,
            fill(const [1, 0, 0]),
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

Future<void> compareAgainstPath(
  Map<String, dynamic> json,
  ui.Path expectedPath, {
  double maxMae = 0.1,
  double maxBadRatio = 0.01,
}) async {
  final fast = FastLottiePlayer(
    FastLottieComposition.fromJson(json),
    cache: FastLottieCache.none,
  );
  addTearDown(fast.dispose);
  final actual = await render(
    (c) => fast.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
  );
  final expected = await render((c) {
    c.drawPath(
      expectedPath,
      ui.Paint()
        ..color = const ui.Color(0xFFFF0000)
        ..isAntiAlias = true,
    );
  });
  var error = 0, bad = 0;
  for (var i = 0; i < actual.length; i++) {
    final delta = (actual[i] - expected[i]).abs();
    error += delta;
    if (delta > 12) bad++;
  }
  final mae = error / actual.length;
  final badRatio = bad / (256 * 256);
  expect(mae, lessThan(maxMae), reason: 'MAE $mae exceeds $maxMae');
  expect(
    badRatio,
    lessThan(maxBadRatio),
    reason: 'Bad ratio $badRatio exceeds $maxBadRatio',
  );
}

void main() {
  test('mode 1 (Merge) preserves both shapes', () async {
    final json = mergeScene(
      items: [
        rectShape(x: 50, y: 50, w: 40, h: 40),
        rectShape(x: 100, y: 50, w: 40, h: 40),
        mergeOp(1),
      ],
    );
    final expected = ui.Path()
      ..addRect(
        ui.Rect.fromCenter(
          center: const ui.Offset(50, 50),
          width: 40,
          height: 40,
        ),
      )
      ..addRect(
        ui.Rect.fromCenter(
          center: const ui.Offset(100, 50),
          width: 40,
          height: 40,
        ),
      );
    await compareAgainstPath(json, expected);
  });

  test('mode 2 (Add / Union) merges overlapping shapes', () async {
    final json = mergeScene(
      items: [
        rectShape(x: 80, y: 80, w: 80, h: 80),
        circleShape(x: 100, y: 80, r: 40),
        mergeOp(2),
      ],
    );
    final r = ui.Path()
      ..addRect(
        ui.Rect.fromCenter(
          center: const ui.Offset(80, 80),
          width: 80,
          height: 80,
        ),
      );
    final c = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(100, 80), radius: 40),
      );
    final expected = ui.Path.combine(ui.PathOperation.union, c, r);
    await compareAgainstPath(json, expected);
  });

  test('mode 3 (Subtract) carves hole out of base shape', () async {
    final json = mergeScene(
      items: [
        rectShape(x: 100, y: 100, w: 100, h: 100),
        circleShape(x: 100, y: 100, r: 25),
        mergeOp(3),
      ],
    );
    final r = ui.Path()
      ..addRect(
        ui.Rect.fromCenter(
          center: const ui.Offset(100, 100),
          width: 100,
          height: 100,
        ),
      );
    final c = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(100, 100), radius: 25),
      );
    final expected = ui.Path.combine(ui.PathOperation.reverseDifference, c, r);
    await compareAgainstPath(json, expected);
  });

  test('mode 4 (Intersect) keeps only overlapping region', () async {
    final json = mergeScene(
      items: [
        circleShape(x: 90, y: 100, r: 40),
        circleShape(x: 110, y: 100, r: 40),
        mergeOp(4),
      ],
    );
    final c1 = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(90, 100), radius: 40),
      );
    final c2 = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(110, 100), radius: 40),
      );
    final expected = ui.Path.combine(ui.PathOperation.intersect, c2, c1);
    await compareAgainstPath(json, expected);
  });

  test('mode 5 (Exclude / XOR) excludes intersection', () async {
    final json = mergeScene(
      items: [
        circleShape(x: 90, y: 100, r: 40),
        circleShape(x: 110, y: 100, r: 40),
        mergeOp(5),
      ],
    );
    final c1 = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(90, 100), radius: 40),
      );
    final c2 = ui.Path()
      ..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(110, 100), radius: 40),
      );
    final expected = ui.Path.combine(ui.PathOperation.xor, c2, c1);
    await compareAgainstPath(json, expected);
  });

  test('software booleans combine nested operands with their own winding', () {
    final right = rectShape(x: 130, y: 100, w: 100, h: 100)..['d'] = 3;
    final left = rectShape(x: 90, y: 100, w: 100, h: 100);
    for (final (mode, expected) in [
      (1, [255, 0, 255, 0]),
      (2, [255, 255, 255, 0]),
      (3, [255, 0, 0, 0]),
      (4, [0, 255, 0, 0]),
      (5, [255, 0, 255, 0]),
    ]) {
      final comp = FastLottieComposition.fromJson(
        mergeScene(
          items: [
            left,
            mergeOp(1),
            {
              'ty': 'gr',
              'it': [right],
            },
            mergeOp(mode),
          ],
        ),
      );
      for (final preferNative in [true, false]) {
        final session = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: preferNative,
        );
        addTearDown(session.dispose);
        final pixels = session.renderFrame(0);
        expect(
          [
            for (final x in [60, 110, 160, 200]) pixels[100 * 256 + x] >>> 24,
          ],
          expected,
          reason: 'mode $mode, preferNative=$preferNative',
        );
      }
    }
  });

  test('Intersect with one operand preserves the outline', () async {
    final json = mergeScene(
      items: [circleShape(x: 100, y: 100, r: 40), mergeOp(4)],
    );
    await compareAgainstPath(
      json,
      ui.Path()..addOval(
        ui.Rect.fromCircle(center: const ui.Offset(100, 100), radius: 40),
      ),
    );
    final comp = FastLottieComposition.fromJson(json);
    final plain = FastLottieComposition.fromJson(
      mergeScene(items: [circleShape(x: 100, y: 100, r: 40)]),
    );
    // Lowering to the original shape also gives the corrected frame a new
    // cache identity relative to the old, empty boolean result.
    expect(comp.contentKey, plain.contentKey);
  });

  test('software rasterizer renders merge paths accurately', () async {
    final json = mergeScene(
      items: [
        rectShape(x: 100, y: 100, w: 80, h: 80),
        circleShape(x: 100, y: 100, r: 25),
        mergeOp(3), // hole cut out
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final swPixels = debugRenderSoftwareFrame(
      comp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    var nonZero = 0;
    for (var i = 0; i < swPixels.length; i += 4) {
      if (swPixels[i + 3] > 0) nonZero++;
    }
    expect(nonZero, greaterThan(1000));
    expect(nonZero, lessThan(80 * 80)); // Hole is carved out!
  });

  test('animated shapes with merge paths in software rasterizer', () async {
    final json = mergeScene(
      items: [
        rectShape(x: 100, y: 100, w: 100, h: 100),
        {
          'ty': 'el',
          'p': animated([50.0, 100.0], [150.0, 100.0]),
          's': constant([50, 50]),
        },
        mergeOp(3),
      ],
    );
    final comp = FastLottieComposition.fromJson(json);
    final sw0 = debugRenderSoftwareFrame(
      comp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    final sw30 = debugRenderSoftwareFrame(
      comp,
      30,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    expect(sw0, isNot(equals(sw30)));
  });

  test('real TGS stickers with merge paths compile and render', () async {
    final sampleStickers = [
      'example/assets/tgs/NotoEmoji/emoji_u1f192.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f30b.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f345.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f60a.tgs',
      'example/assets/tgs/NotoEmoji/emoji_u1f614.tgs',
    ];
    for (final path in sampleStickers) {
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
    }
  });

  testWidgets(
    'background worker isolate rasterizes merge path stickers without UI isolate error',
    (tester) async {
      final file = File('example/assets/tgs/NotoEmoji/emoji_u1f345.tgs');
      if (!file.existsSync()) return;
      final comp = FastLottieComposition.fromBytes(file.readAsBytesSync());

      final cache = FastLottieRasterCache(
        maximumBytes: 16 * 1024 * 1024,
        maximumFrameRate: 30.0,
        workerCount: 1,
      );
      try {
        final player = FastLottiePlayer(
          comp,
          rasterCache: cache,
          cache: FastLottieCache.none,
        );
        final rec = ui.PictureRecorder();
        player.draw(ui.Canvas(rec), const ui.Rect.fromLTWH(0, 0, 96, 96), 0.0);
        rec.endRecording().dispose();

        for (var i = 0; i < 50 && cache.pendingFrames > 0; i++) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 20)),
          );
          await tester.pump();
        }
        expect(cache.lastError, isNull);
        expect(cache.renderedFrames, greaterThan(0));
        player.dispose();
      } finally {
        cache.dispose();
      }
    },
  );
}
