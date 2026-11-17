import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, render;
import 'path_ops_test.dart'
    show
        animated,
        constant,
        fill,
        line,
        matteScene,
        rectangle,
        scene,
        stroke,
        trim;
import 'rlottie_features_test.dart' show closureMorph;
import 'tgs_test.dart' show isBundledTgs;

Future<Uint8List> _decodeBgraToCanvasRgba(
  Uint8List bgraBytes,
  int width,
  int height,
) async {
  final completer = Completer<ui.Image>();
  ui.decodeImageFromPixels(
    bgraBytes,
    width,
    height,
    ui.PixelFormat.bgra8888,
    completer.complete,
  );
  final image = await completer.future;
  try {
    return await render((canvas) {
      canvas.drawImage(
        image,
        Offset.zero,
        Paint()..filterQuality = FilterQuality.none,
      );
    }, size: width);
  } finally {
    image.dispose();
  }
}

(double mae, double badFraction, double interiorMae) _diffMetrics(
  Uint8List actual,
  Uint8List expected,
  int size,
) {
  var error = 0;
  var bad = 0;
  for (var i = 0; i < actual.length; i++) {
    final delta = (actual[i] - expected[i]).abs();
    error += delta;
    if (delta > 12) bad++;
  }
  var interiorError = 0;
  var interiorChannels = 0;
  for (var y = 1; y < size - 1; y++) {
    for (var x = 1; x < size - 1; x++) {
      final pos = (y * size + x) * 4;
      var flat = true;
      for (var dy = -1; dy <= 1 && flat; dy++) {
        for (var dx = -1; dx <= 1 && flat; dx++) {
          for (var c = 0; c < 4; c++) {
            if ((expected[pos + c] -
                        expected[((y + dy) * size + x + dx) * 4 + c])
                    .abs() >
                2) {
              flat = false;
              break;
            }
          }
        }
      }
      if (flat) {
        for (var c = 0; c < 4; c++) {
          interiorError += (actual[pos + c] - expected[pos + c]).abs();
          interiorChannels++;
        }
      }
    }
  }
  return (
    error / actual.length,
    bad / actual.length,
    interiorChannels == 0 ? 0.0 : interiorError / interiorChannels,
  );
}

Future<void> _compareAgainstVectorCanvas(
  String name,
  Map<String, dynamic> json,
  List<double> frames, {
  double maxMae = 0.85,
  double maxBad = 0.015,
  double maxInteriorMae = 0.5,
  int size = 256,
}) async {
  final comp = FastLottieComposition.fromJson(json);
  final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
  addTearDown(player.dispose);

  final span = comp.endFrame - comp.startFrame;
  final fitted = applyBoxFit(
    BoxFit.contain,
    comp.size,
    Size(size.toDouble(), size.toDouble()),
  );
  final swW = fitted.destination.width.ceil().clamp(1, size);
  final swH = fitted.destination.height.ceil().clamp(1, size);
  final target = Alignment.center.inscribe(
    fitted.destination,
    Rect.fromLTWH(0, 0, size.toDouble(), size.toDouble()),
  );
  for (final frame in frames) {
    final progress = (frame / span).clamp(0.0, 1.0);
    final bgra = debugRenderSoftwareFrame(
      comp,
      comp.startFrame + frame,
      pixelWidth: swW,
      pixelHeight: swH,
    );
    final completer = Completer<ui.Image>();
    ui.decodeImageFromPixels(
      bgra,
      swW,
      swH,
      ui.PixelFormat.bgra8888,
      completer.complete,
    );
    final swImg = await completer.future;
    late Uint8List swRgba;
    try {
      swRgba = await render(
        (c) => c.drawImageRect(
          swImg,
          Rect.fromLTWH(0, 0, swW.toDouble(), swH.toDouble()),
          target,
          Paint()..filterQuality = FilterQuality.none,
        ),
        size: size,
      );
    } finally {
      swImg.dispose();
    }
    final canvasRgba = await render(
      (c) => player.draw(
        c,
        Rect.fromLTWH(0, 0, size.toDouble(), size.toDouble()),
        progress,
        useFrameRate: false,
      ),
      size: size,
    );
    final (mae, bad, interior) = _diffMetrics(swRgba, canvasRgba, size);
    expect(
      mae,
      lessThan(maxMae),
      reason: '$name frame $frame MAE=$mae bad=$bad interior=$interior',
    );
    expect(
      bad,
      lessThan(maxBad),
      reason: '$name frame $frame bad=$bad MAE=$mae interior=$interior',
    );
    expect(
      interior,
      lessThan(maxInteriorMae),
      reason: '$name frame $frame interior=$interior MAE=$mae bad=$bad',
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'animated radial focal point matches Canvas and moves the highlight',
    () async {
      final doc = scene([
        rectangle(128, 128, 256, 256),
        {
          'ty': 'gf',
          't': 2,
          's': constant([128.5, 128.5]),
          'e': constant([208.5, 128.5]),
          'h': animated([50], [-50]),
          'a': constant(90),
          'g': {
            'p': 2,
            'k': constant([0, 1, 1, 1, 1, 0, 0, 0]),
          },
        },
      ]);
      final composition = FastLottieComposition.fromJson(doc);
      final player = FastLottiePlayer(composition, cache: FastLottieCache.none);
      final session = FastLottieSoftwareSession(
        composition,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      addTearDown(player.dispose);
      addTearDown(session.dispose);
      for (final (frame, focusY) in [(0.0, 168), (59.0, 88), (0.0, 168)]) {
        final pixels = session.renderFrame(frame);
        expect(pixels[focusY * 256 + 128] & 255, 255);
        expect(pixels[128 * 256 + 128] & 255, closeTo(170, 1));
        expect(pixels[128 * 256 + 230] & 255, 0);
        final canvas = await render(
          (c) => player.draw(
            c,
            const Rect.fromLTWH(0, 0, 256, 256),
            frame / 60,
            useFrameRate: false,
          ),
        );
        for (final (x, y) in [
          (128, focusY),
          (128, 128),
          (150, 145),
          (160, 90),
        ]) {
          final i = y * 256 + x;
          expect(pixels[i] & 255, closeTo(canvas[i * 4], 2));
        }
      }
    },
  );
  for (final id in ['305', '525', '52e', '96d', '976']) {
    test('software focal gradients match Canvas on emoji u1f$id', () async {
      final file = File('example/assets/tgs/NotoEmoji/emoji_u1f$id.tgs');
      final doc = jsonDecode(
        utf8.decode(decodeLottieBytes(file.readAsBytesSync())),
      ) as Map<String, dynamic>;
      final span = (doc['op'] as num) - (doc['ip'] as num);
      await _compareAgainstVectorCanvas(
        'emoji u1f$id',
        doc,
        [0, (span - 1) * .45, (span - 1) * .9],
        maxMae: 1.0,
        maxBad: .02,
        maxInteriorMae: .75,
      );
    });
  }

  test('transformed subtract masks match Canvas on checkered flag', () async {
    final file = File('example/assets/tgs/NotoEmoji/emoji_u1f3c1.tgs');
    final doc = jsonDecode(
      utf8.decode(decodeLottieBytes(file.readAsBytesSync())),
    ) as Map<String, dynamic>;
    await _compareAgainstVectorCanvas(
      'emoji u1f3c1',
      doc,
      [0, 203],
      maxMae: 1.0,
      maxBad: .02,
      maxInteriorMae: .75,
    );
  });

  test('identity groups preserve paint order and animated parent opacity', () {
    Map<String, dynamic> wrap(List<Map<String, dynamic>> items) => {
      'ty': 'gr',
      'it': items,
    };
    Map<String, dynamic> transform() => {
      'ty': 'tr',
      'p': animated([0, 0], [28, 16]),
      'o': animated([37], [84]),
    };
    List<Map<String, dynamic>> front() => [
      rectangle(80, 92, 100, 96),
      fill([1, 0, 0]),
    ];
    List<Map<String, dynamic>> back() => [
      rectangle(115, 104, 108, 94),
      fill([0, 0, 1]),
    ];
    final nested = FastLottieComposition.fromJson(
      scene([
        wrap([
          wrap([
            wrap(front()),
            wrap([wrap(back())]),
          ]),
          transform(),
        ]),
      ]),
    );
    final flat = FastLottieComposition.fromJson(
      scene([
        wrap([wrap(front()), wrap(back()), transform()]),
      ]),
    );
    final nestedSession = FastLottieSoftwareSession(
      nested,
      pixelWidth: 173,
      pixelHeight: 169,
    );
    final flatSession = FastLottieSoftwareSession(
      flat,
      pixelWidth: 173,
      pixelHeight: 169,
    );
    addTearDown(nestedSession.dispose);
    addTearDown(flatSession.dispose);
    for (final frame in [0.0, 29.5, 59.0, 0.0]) {
      expect(
        nestedSession.renderFrame(frame),
        orderedEquals(flatSession.renderFrame(frame)),
        reason: 'frame $frame',
      );
    }
  });

  for (final name in ['static', 'icon', 'features', 'many_shapes', 'morph']) {
    test('software RLE matches canvas vector: $name', () async {
      await _compareAgainstVectorCanvas(
        name,
        fixture(name),
        [0, 1, 15, 29.5, 45, 59],
        // 100 rotated 16x16 shapes pack dense perimeter edges where FreeType
        // analytic AA and Skia RRect AA differ slightly while interior == 0.
        maxMae: name == 'many_shapes' ? 1.05 : 0.85,
        maxBad: name == 'many_shapes' ? 0.035 : 0.015,
        maxInteriorMae: name == 'many_shapes' ? 0.05 : 0.5,
      );
    });
  }

  for (final name in [
    'gears',
    'tile_grid_loading_animation',
    'movie_loading',
    'glow_loading',
    'loading_animation',
  ]) {
    test('software RLE matches canvas vector: rlottie/$name', () async {
      final json = jsonDecode(
        File('rlottie-master/example/resource/$name.json').readAsStringSync(),
      ) as Map<String, dynamic>;
      final span =
          (json['op'] as num).toDouble() - (json['ip'] as num).toDouble();
      await _compareAgainstVectorCanvas(name, json, [
        0,
        span * 0.25,
        span * 0.5,
        span * 0.75,
        span - 1,
      ]);
    });
  }

  test('software RLE matches canvas vector: path ops, mattes, precomps, gradients, strokes', () async {
    final nested = matteScene(1);
    final precomp = fixture('static')['layers'][0] as Map<String, dynamic>;
    precomp.remove('shapes');
    precomp.addAll({'ty': 0, 'refId': 'nested', 'st': 5});

    final cases = <String, Map<String, dynamic>>{
      'trim-simultaneous': scene([
        line(60),
        line(150),
        stroke(),
        trim(constant(20), constant(80), animated(-180, 300)),
      ]),
      'trim-individual': scene([
        line(60, length: 80),
        line(150),
        stroke(),
        trim(constant(0), animated(0, 100), constant(0), mode: 2),
      ]),
      'dash': scene([
        line(80),
        stroke()
          ..['d'] = [
            {'n': 'd', 'v': constant(15)},
            {'n': 'g', 'v': constant(8)},
            {'n': 'o', 'v': animated(-20, 60)},
          ],
      ]),
      for (var i = 1; i <= 4; i++)
        'matte-$i': matteScene(i)..['layers'][0]['ks']['o'] = constant(60),
      'reverse-rect': scene([
        rectangle(128, 128, 200, 180),
        rectangle(128, 128, 100, 80)..['d'] = 3,
        fill([.2, .7, .9]),
        stroke(),
      ]),
      'reverse-round-rect': scene([
        rectangle(128, 128, 200, 180)..['r'] = constant(20),
        rectangle(128, 128, 100, 80)
          ..['r'] = constant(20)
          ..['d'] = 3,
        fill([.2, .7, .9]),
        stroke(),
      ]),
      'closure-open': closureMorph(false),
      'closure-closed': closureMorph(true),
      'precomp-before-start': {
        ...nested,
        'assets': [
          {'id': 'nested', 'layers': nested['layers']},
        ],
        'layers': [precomp],
      },
      'nonuniform-stroke': {
        'v': '5.7.0',
        'fr': 60,
        'ip': 0,
        'op': 60,
        'w': 256,
        'h': 256,
        'layers': [
          {
            'ty': 4,
            'ind': 1,
            'ip': 0,
            'op': 60,
            'ks': {
              'a': constant([0, 0]),
              'p': constant([128, 128]),
              's': constant([220, 70]),
              'r': constant(20),
              'o': constant(100),
            },
            'shapes': [line(-40, length: 80), stroke()..['w'] = constant(12)],
          },
        ],
      },
      'linear-radial-gradients': scene([
        rectangle(96, 128, 120, 120),
        {
          'ty': 'gf',
          'o': constant(85),
          'r': 1,
          'g': {
            'p': 2,
            'k': constant([0, 1, 0, 0, 1, 0, 0, 1]),
          },
          's': constant([36, 68]),
          'e': constant([156, 188]),
          't': 1,
        },
        rectangle(176, 128, 100, 100),
        {
          'ty': 'gf',
          'o': constant(100),
          'r': 1,
          'g': {
            'p': 2,
            'k': constant([0, 1, 1, 0, 1, 0, 1, 1]),
          },
          's': constant([176, 128]),
          'e': constant([226, 178]),
          't': 2,
        },
      ]),
    };

    for (final entry in cases.entries) {
      await _compareAgainstVectorCanvas(
        entry.key,
        entry.value,
        [0, 1, 15, 29, 30, 40, 59],
        maxMae:
            entry.key.startsWith('matte-') || entry.key.startsWith('precomp-')
            ? 1.3
            : 0.9,
      );
    }
  });

  test('software RLE matches canvas vector across bundled TGS stickers', () async {
    final files =
        Directory('example/assets/tgs')
            .listSync(recursive: true)
            .whereType<File>()
            .where(
              (f) =>
                  f.path.endsWith('.tgs') &&
                  isBundledTgs(f) &&
                  !f.path.contains('NotoEmoji'),
            )
            .toList()
          ..sort((a, b) => a.path.compareTo(b.path));

    expect(files.length, greaterThan(100));
    final failures = <String>[];
    var tested = 0;

    for (final file in files) {
      final raw = decodeLottieBytes(file.readAsBytesSync());
      final comp = FastLottieComposition.fromBytes(raw);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      final span = comp.endFrame - comp.startFrame;
      for (final fraction in [0.0, 0.25, 0.5, 0.85]) {
        final frame = (span - 1) * fraction;
        final bgra = debugRenderSoftwareFrame(
          comp,
          comp.startFrame + frame,
          pixelWidth: 160,
          pixelHeight: 160,
        );
        final swRgba = await _decodeBgraToCanvasRgba(bgra, 160, 160);
        final canvasRgba = await render(
          (c) => player.draw(
            c,
            const Rect.fromLTWH(0, 0, 160, 160),
            frame / span,
            useFrameRate: false,
          ),
          size: 160,
        );
        final (mae, bad, interior) = _diffMetrics(swRgba, canvasRgba, 160);
        // FreeType 256-level analytic scanline AA matches rlottie directly and
        // differs mildly on thin sub-pixel strokes / curved edges vs Skia GPU/CPU AA,
        // while solid interiors remain exact (<= 0.4 out of 255).
        if (mae >= 2.0 || bad >= 0.04 || interior >= 0.4) {
          failures.add(
            '${file.path} @ $fraction MAE=$mae bad=$bad interior=$interior',
          );
        }
      }
      player.dispose();
      tested++;
    }
    expect(tested, files.length);
    expect(failures, isEmpty);
  });

  test('software RLE matches canvas vector: poultry leg (rotated precomp with matte)', () async {
    final file = File('example/assets/tgs/NotoEmoji/emoji_u1f357.tgs');
    final raw = decodeLottieBytes(file.readAsBytesSync());
    final comp = FastLottieComposition.fromBytes(raw);
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final span = comp.endFrame - comp.startFrame;
    for (final fraction in [0.0, 0.16, 0.25, 0.5, 0.75, 1.0]) {
      final frame = (span - 1) * fraction;
      final bgra = debugRenderSoftwareFrame(
        comp,
        comp.startFrame + frame,
        pixelWidth: 160,
        pixelHeight: 160,
      );
      final swRgba = await _decodeBgraToCanvasRgba(bgra, 160, 160);
      final canvasRgba = await render(
        (c) => player.draw(
          c,
          const Rect.fromLTWH(0, 0, 160, 160),
          frame / span,
          useFrameRate: false,
        ),
        size: 160,
      );
      final (mae, bad, _) = _diffMetrics(swRgba, canvasRgba, 160);
      expect(mae, lessThan(1.0), reason: 'MAE failed at fraction $fraction');
      expect(
        bad,
        lessThan(0.02),
        reason: 'Bad fraction failed at fraction $fraction',
      );
    }
    player.dispose();
  });
}
