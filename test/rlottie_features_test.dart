import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
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

Map<String, dynamic> closureMorph(bool startClosed) {
  Map<String, dynamic> shape(bool closed) => {
    'v': [
      [50, 60],
      [200, 80],
      [150, 200],
    ],
    'i': [
      [-50, 70],
      [0, 0],
      [0, 0],
    ],
    'o': [
      [0, 0],
      [0, 0],
      [-70, 30],
    ],
    'c': closed,
  };
  return scene([
    {
      'ty': 'sh',
      'ks': {
        'a': 1,
        'k': [
          {
            't': 0,
            's': [shape(startClosed)],
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
            't': 30,
            's': [shape(!startClosed)],
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
            's': [shape(!startClosed)],
          },
        ],
      },
    },
    stroke(),
  ]);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('closure-changing morph preserves source segment closure', () async {
    // Pixel probes distinguish the straight closing edge from the curved edge
    // and the open contour. The triangle's closing line crosses (100, 130).
    for (final startClosed in [false, true]) {
      final comp = FastLottieComposition.fromJson(closureMorph(startClosed));
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      Future<List<int>> frame(int n) => render(
        (c) => player.draw(
          c,
          const ui.Rect.fromLTWH(0, 0, 256, 256),
          n / 60,
          useFrameRate: false,
        ),
      );
      final midway = await frame(15), after = await frame(40);
      expect(midway[(130 * 256 + 100) * 4 + 3] > 200, startClosed);
      // Closing cubic follows different control points after an open->closed key.
      final first = await frame(0);
      expect(await frame(0), first);
      expect(midway, isNot(equals(after)));
      player.dispose();
    }
  });

  final oracle = Platform.environment['RLOTTIE_RENDERER'];
  test(
    'native rlottie oracle: trim, dash, matte, reverse rectangles, morph closure',
    () async {
      final directory = Directory.systemTemp.createTempSync(
        'fastlottie-oracle-',
      );
      addTearDown(() => directory.deleteSync(recursive: true));
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
      };
      final nested = matteScene(1);
      final precomp = fixture('static')['layers'][0] as Map<String, dynamic>;
      precomp.remove('shapes');
      precomp.addAll({'ty': 0, 'refId': 'nested', 'st': 5});
      cases['precomp-before-start'] = {
        ...nested,
        'assets': [
          {'id': 'nested', 'layers': nested['layers']},
        ],
        'layers': [precomp],
      };
      final failures = <String>[];
      for (final entry in cases.entries) {
        final input = File('${directory.path}/${entry.key}.json')
          ..writeAsStringSync(jsonEncode(entry.value));
        final output = File('${directory.path}/output.rgba');
        final player = FastLottiePlayer(
          FastLottieComposition.fromJson(entry.value),
          cache: FastLottieCache.none,
        );
        for (final n in [0, 1, 15, 29, 30, 40, 59, 5, 0]) {
          final process = await Process.run(oracle!, [
            input.path,
            '$n',
            '256',
            '256',
            output.path,
          ]);
          expect(process.exitCode, 0, reason: '${process.stderr}');
          final expected = output.readAsBytesSync();
          final actual = await render(
            (c) => player.draw(
              c,
              const ui.Rect.fromLTWH(0, 0, 256, 256),
              n / 60,
              useFrameRate: false,
            ),
          );
          var error = 0, bad = 0;
          for (var i = 0; i < actual.length; i++) {
            final delta = (actual[i] - expected[i]).abs();
            error += delta;
            if (delta > 12) bad++;
          }
          final mae = error / actual.length, ratio = bad / actual.length;
          // rlottie's RLE/bitmap compositing loses up to 6/255 through repeated
          // integer coverage multiplication. Geometry still uses the tight gate;
          // composites must retain the same <0.6% large-channel-error gate.
          final composite =
              entry.key.startsWith('matte-') ||
              entry.key.startsWith('precomp-');
          if (mae >= (composite ? 1.2 : .65) || ratio >= .006) {
            failures.add('${entry.key} frame $n MAE=$mae bad=$ratio');
            if (Platform.environment['RLOTTIE_DIFF_IMAGES'] == '1' && n == 15) {
              File('/tmp/rlottie_actual_${entry.key}.rgba')
                  .writeAsBytesSync(actual);
              File('/tmp/rlottie_expected_${entry.key}.rgba')
                  .writeAsBytesSync(expected);
            }
          }
        }
        player.dispose();
      }
      // ignore: avoid_print
      print('RLOTTIE_DIFF ${failures.join('\n')}');
      expect(failures, isEmpty);
    },
    skip: oracle == null
        ? 'Set RLOTTIE_RENDERER to the locally built oracle.'
        : false,
  );

  test(
    'native rlottie oracle: spatial Bézier curve keyframes (Topics cart OSNOVA)',
    () async {
      final raw = decodeLottieBytes(
        File(
          'example/assets/tgs/Topics-1794247486249/file_4798713.tgs',
        ).readAsBytesSync(),
      );
      final doc = jsonDecode(utf8.decode(raw)) as Map<String, dynamic>;
      final layers = (doc['layers'] as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final byName = {for (final l in layers) l['nm']: l};
      final spatialDoc = <String, dynamic>{
        'v': doc['v'],
        'fr': doc['fr'],
        'ip': doc['ip'],
        'op': doc['op'],
        'w': doc['w'],
        'h': doc['h'],
        'layers': [byName['OSNOVA']!],
      };
      final directory = Directory.systemTemp.createTempSync(
        'fastlottie-spatial-oracle-',
      );
      addTearDown(() => directory.deleteSync(recursive: true));
      final input = File('${directory.path}/osnova.json')
        ..writeAsStringSync(jsonEncode(spatialDoc));
      final output = File('${directory.path}/output.rgba');
      final comp = FastLottieComposition.fromJson(spatialDoc);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(player.dispose);
      final span = comp.endFrame - comp.startFrame;
      for (final n in [0, 18, 45, 72, 134, 135, 161, 179]) {
        final process = await Process.run(oracle!, [
          input.path,
          '$n',
          '256',
          '256',
          output.path,
        ]);
        expect(process.exitCode, 0, reason: '${process.stderr}');
        final expected = output.readAsBytesSync();
        final actual = await render(
          (c) => player.draw(
            c,
            const ui.Rect.fromLTWH(0, 0, 256, 256),
            n / span,
            useFrameRate: false,
          ),
        );
        var error = 0, bad = 0;
        for (var i = 0; i < actual.length; i++) {
          final delta = (actual[i] - expected[i]).abs();
          error += delta;
          if (delta > 12) bad++;
        }
        final mae = error / actual.length;
        final ratio = bad / actual.length;
        expect(mae, lessThan(.65), reason: 'OSNOVA frame $n MAE=$mae');
        expect(ratio, lessThan(.006), reason: 'OSNOVA frame $n bad=$ratio');
      }
    },
    skip: oracle == null
        ? 'Set RLOTTIE_RENDERER to the locally built oracle.'
        : false,
  );
}
