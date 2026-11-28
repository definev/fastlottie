import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show compare, render;
import 'path_ops_test.dart' show animated, constant, fill, stroke;

Map<String, dynamic> polyStarShape({
  required int sy,
  dynamic pt,
  dynamic p,
  dynamic r,
  dynamic or,
  dynamic os,
  dynamic ir,
  dynamic isR,
  int d = 1,
}) => {
  'ty': 'sr',
  'sy': sy,
  'd': d,
  'pt': pt ?? constant(5),
  'p': p ?? constant([0, 0]),
  'r': r ?? constant(0),
  'or': or ?? constant(100),
  'os': os ?? constant(0),
  if (sy == 1) 'ir': ir ?? constant(50),
  if (sy == 1) 'is': isR ?? constant(0),
};

Map<String, dynamic> starScene({
  required Map<String, dynamic> star,
  Map<String, dynamic>? paint,
  List<double> position = const [128, 128],
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
        'p': constant([position[0], position[1], 0]),
        'a': constant([0, 0, 0]),
        's': constant([100, 100, 100]),
      },
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            star,
            paint ?? fill([1, 0.5, 0]),
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

  test('static 5-point star matches baseline', () async {
    final json = starScene(
      star: polyStarShape(
        sy: 1,
        pt: constant(5),
        or: constant(80),
        ir: constant(40),
      ),
      paint: fill([0.2, 0.6, 1.0]),
    );
    await compare(json, [0]);
  });

  test('static regular polygon (hexagon) matches baseline', () async {
    final json = starScene(
      star: polyStarShape(sy: 2, pt: constant(6), or: constant(70)),
      paint: fill([0.8, 0.2, 0.4]),
    );
    await compare(json, [0]);
  });

  test('star with stroke and rotation matches baseline', () async {
    final json = starScene(
      star: polyStarShape(
        sy: 1,
        pt: constant(6),
        or: constant(75),
        ir: constant(35),
        r: constant(30),
      ),
      paint: stroke(),
    );
    await compare(json, [0]);
  });

  test('star with inner and outer roundness matches baseline', () async {
    final json = starScene(
      star: polyStarShape(
        sy: 1,
        pt: constant(5),
        or: constant(80),
        os: constant(20),
        ir: constant(40),
        isR: constant(30),
      ),
      paint: fill([1.0, 0.7, 0.1]),
    );
    await compare(json, [0]);
  });

  test('polygon with rounded corners matches baseline', () async {
    final json = starScene(
      star: polyStarShape(
        sy: 2,
        pt: constant(5),
        or: constant(70),
        os: constant(25),
      ),
      paint: fill([0.4, 0.4, 0.9]),
    );
    await compare(json, [0]);
  });

  test(
    'animated star (points, rotation, outerRadius) matches baseline',
    () async {
      final json = starScene(
        star: polyStarShape(
          sy: 1,
          pt: animated(5, 8),
          or: animated(50, 90),
          ir: animated(25, 45),
          r: animated(0, 180),
        ),
        paint: fill([0.9, 0.1, 0.5]),
      );
      await compare(json, [0, 15, 30, 45, 59]);
    },
  );

  test('polystar_anim fixture from rlottie matches baseline', () async {
    final file = File('rlottie-master/example/resource/polystar_anim.json');
    if (file.existsSync()) {
      final json = jsonDecode(file.readAsStringSync()) as Map<String, dynamic>;
      final span = (json['op'] as num) - (json['ip'] as num);
      await compare(json, [0, span * 0.25, span * 0.5, span * 0.75, span - 1]);
    }
  });

  test(
    'polystar_line_clockwise_trim fixture from rlottie compiles and runs',
    () async {
      final file = File(
        'rlottie-master/example/resource/polystar_line_clockwise_trim.json',
      );
      if (file.existsSync()) {
        final json =
            jsonDecode(file.readAsStringSync()) as Map<String, dynamic>;
        final comp = FastLottieComposition.fromJson(json);
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(player.dispose);
        final rendered = await render(
          (canvas) => player.draw(
            canvas,
            const ui.Rect.fromLTWH(0, 0, 300, 300),
            0.5,
            useFrameRate: false,
          ),
          size: 300,
        );
        expect(rendered, isNotEmpty);
      }
    },
  );

  test('software RLE rasterizer renders star and polygon correctly', () {
    final starJson = starScene(
      star: polyStarShape(
        sy: 1,
        pt: constant(5),
        or: constant(80),
        ir: constant(40),
      ),
      paint: fill([1.0, 0.0, 0.0]),
    );
    final comp = FastLottieComposition.fromJson(starJson);
    final bgra = debugRenderSoftwareFrame(
      comp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    expect(bgra.length, 256 * 256 * 4);
    // Ensure red pixels were rasterized in the center
    final centerPixel = (128 * 256 + 128) * 4;
    expect(bgra[centerPixel + 2], greaterThan(200)); // R in BGRA
    expect(bgra[centerPixel + 3], 255); // Alpha

    final polyJson = starScene(
      star: polyStarShape(sy: 2, pt: constant(6), or: constant(80)),
      paint: fill([0.0, 1.0, 0.0]),
    );
    final polyComp = FastLottieComposition.fromJson(polyJson);
    final polyBgra = debugRenderSoftwareFrame(
      polyComp,
      0,
      pixelWidth: 256,
      pixelHeight: 256,
    );
    expect(polyBgra[centerPixel + 1], greaterThan(200)); // G in BGRA
    expect(polyBgra[centerPixel + 3], 255); // Alpha
  });
}
