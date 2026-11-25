import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, fixture, render;
import 'mask_test.dart' show maskPathRect;
import 'path_ops_test.dart' show animated, constant, fill;
import 'tgs_fixtures.dart';

const _size = 256;
const _rect = ui.Rect.fromLTWH(0, 0, 256, 256);

Map<String, dynamic> _reference(String layer, {String path = 'Outline'}) => {
  ...constant(maskPathRect(180, 180, 20, 20)),
  'x':
      "var \$bm_rt;\n\$bm_rt = thisComp.layer('$layer')"
      ".content('Group').content('$path').path;",
};

Map<String, dynamic> _layer(
  int id,
  String name,
  Map<String, dynamic> path, {
  bool hidden = false,
}) {
  final layer = fixture('static')['layers'][0] as Map<String, dynamic>;
  return layer
    ..['ind'] = id
    ..['nm'] = name
    ..['hd'] = hidden
    ..['shapes'] = [
      {
        'ty': 'gr',
        'nm': 'Group',
        'it': [
          {'ty': 'sh', 'nm': 'Outline', 'ks': path},
          fill([1, 0, 0]),
        ],
      },
    ];
}

Map<String, dynamic> _scene(List<Map<String, dynamic>> layers) =>
    fixture('static')..['layers'] = layers;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'forward and chained references sample only source path geometry',
    () async {
      final track = animated(
        maskPathRect(20, 20, 40, 40),
        maskPathRect(100, 20, 40, 40),
      );
      final source = _layer(3, 'Source ', track, hidden: true);
      source['ks']['p'] = constant([130, 130]);
      source['st'] = 15;
      final referenced = await FastLottieComposition.fromBytesAsync(
        bytes(
          _scene([
            _layer(1, 'Draw', _reference('Alias')),
            _layer(2, 'Alias', _reference('Source '), hidden: true),
            source,
          ]),
        ),
      );
      final baked = FastLottieComposition.fromJson(
        _scene([
          _layer(1, 'Draw', track),
          _layer(2, 'Alias', track, hidden: true),
          source,
        ]),
      );
      expect(referenced.contentKey, baked.contentKey);
      final software = FastLottieSoftwareSession(
        referenced,
        pixelWidth: _size,
        pixelHeight: _size,
      );
      final expected = FastLottieSoftwareSession(
        baked,
        pixelWidth: _size,
        pixelHeight: _size,
      );
      final player = FastLottiePlayer(referenced, cache: FastLottieCache.none);
      addTearDown(software.dispose);
      addTearDown(expected.dispose);
      addTearDown(player.dispose);
      for (final (frame, inside, outside) in [
        (0.0, 40, 120),
        (59.0, 120, 40),
        (0.0, 40, 120),
      ]) {
        final pixels = software.renderFrame(frame);
        expect(pixels, orderedEquals(expected.renderFrame(frame)));
        expect(pixels[40 * _size + inside], 0xffff0000);
        expect(pixels[40 * _size + outside], 0);
        final canvas = await render(
          (c) => player.draw(c, _rect, frame / 60, useFrameRate: false),
        );
        expect(canvas[(40 * _size + inside) * 4 + 3], 255);
        expect(canvas[(40 * _size + outside) * 4 + 3], 0);
      }
    },
  );

  for (final (description, target, sources, message) in [
    (
      'missing layer',
      _reference('Missing'),
      <Map<String, dynamic>>[],
      'Missing layer',
    ),
    (
      'missing path',
      _reference('Source', path: 'Missing'),
      [_layer(2, 'Source', constant(maskPathRect(20, 20, 40, 40)))],
      'Missing content',
    ),
    (
      'ambiguous layer',
      _reference('Source'),
      [
        _layer(2, 'Source', constant(maskPathRect(20, 20, 40, 40))),
        _layer(3, 'Source', constant(maskPathRect(20, 20, 40, 40))),
      ],
      'Ambiguous layer',
    ),
    (
      'cycle',
      _reference('Source'),
      [_layer(2, 'Source', _reference('Draw'))],
      'Cyclic path',
    ),
  ]) {
    test('rejects $description with an expression JSON path', () {
      expect(
        () => FastLottieComposition.fromJson(
          _scene([_layer(1, 'Draw', target), ...sources]),
        ),
        throwsA(
          isA<UnsupportedLottieException>()
              .having((e) => e.jsonPath, 'path', endsWith('.ks.x'))
              .having((e) => e.message, 'message', contains(message)),
        ),
      );
    });
  }

  test('thisComp resolves inside a stretched precomp, not the root', () {
    final precomp = _layer(1, 'Precomp', _reference('Source'))
      ..remove('shapes')
      ..addAll({'ty': 0, 'refId': 'nested', 'w': 256, 'h': 256, 'sr': 2});
    final doc =
        _scene([
            precomp,
            _layer(
              2,
              'Source',
              constant(maskPathRect(180, 180, 20, 20)),
              hidden: true,
            ),
          ])
          ..['assets'] = [
            {
              'id': 'nested',
              'layers': [
                _layer(1, 'Draw', _reference('Source')),
                _layer(
                  2,
                  'Source',
                  animated(
                    maskPathRect(20, 20, 20, 20),
                    maskPathRect(138, 20, 20, 20),
                  ),
                  hidden: true,
                ),
              ],
            },
          ];
    final session = FastLottieSoftwareSession(
      FastLottieComposition.fromJson(doc),
      pixelWidth: _size,
      pixelHeight: _size,
    );
    addTearDown(session.dispose);
    for (final (frame, inside, outside) in [(0.0, 30, 60), (30.0, 60, 30)]) {
      final pixels = session.renderFrame(frame);
      expect(pixels[30 * _size + inside], 0xffff0000);
      expect(pixels[30 * _size + outside], 0);
      expect(pixels[190 * _size + 190], 0);
    }
  });

  test('renders all 27 newly supported TGS assets in software', () {
    final codes = [
      '1fa84',
      '1fa8f',
      '1fadc',
      '1fadf',
      '1f35d',
      '1f426',
      '1f426_200d_2b1b',
      '1f54a_fe0f',
      '1f916',
      '1f90c',
      for (final base in ['261d', '1f590', '1f90c'])
        for (final tone in ['1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff'])
          '${base}_$tone',
      '261d_fe0f',
      '1f590_fe0f',
    ];
    for (final code in codes) {
      final file = File('$tgsCorpusPath/NotoEmoji/emoji_u$code.tgs');
      final comp = FastLottieComposition.fromBytes(file.readAsBytesSync());
      final session = FastLottieSoftwareSession(
        comp,
        pixelWidth: 96,
        pixelHeight: 96,
      );
      try {
        final duration = comp.endFrame - comp.startFrame - 1;
        for (final fraction in [0.0, .25, .75, .95, 0.0]) {
          final frame = comp.startFrame + duration * fraction;
          final pixels = session.renderFrame(frame);
          expect(
            pixels.any((p) => p >>> 24 > 0),
            isTrue,
            reason: '$code @ $frame',
          );
        }
      } finally {
        session.dispose();
      }
    }
  });
}
