// ignore_for_file: avoid_print, invalid_use_of_visible_for_testing_member
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

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
  'pt': pt ?? {'a': 0, 'k': 5},
  'p': p ?? {'a': 0, 'k': [0, 0]},
  'r': r ?? {'a': 0, 'k': 0},
  'or': or ?? {'a': 0, 'k': 80},
  'os': os ?? {'a': 0, 'k': 0},
  if (sy == 1) 'ir': ir ?? {'a': 0, 'k': 40},
  if (sy == 1) 'is': isR ?? {'a': 0, 'k': 0},
};

Map<String, dynamic> createPolyStarScene({
  required Map<String, dynamic> star,
  List<double> color = const [0.2, 0.6, 1.0],
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
        'o': {'a': 0, 'k': 100},
        'r': {'a': 0, 'k': 0},
        'p': {'a': 0, 'k': [128, 128, 0]},
        'a': {'a': 0, 'k': [0, 0, 0]},
        's': {'a': 0, 'k': [100, 100, 100]},
      },
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            star,
            {
              'ty': 'fl',
              'c': {'a': 0, 'k': color},
              'o': {'a': 0, 'k': 100},
              'r': 1,
            },
            {
              'ty': 'tr',
              'p': {'a': 0, 'k': [0, 0]},
              'a': {'a': 0, 'k': [0, 0]},
              's': {'a': 0, 'k': [100, 100]},
              'r': {'a': 0, 'k': 0},
              'o': {'a': 0, 'k': 100},
            },
          ],
        },
      ],
    },
  ],
};

Map<String, num> stats(List<double> values) {
  values.sort();
  double p(double f) => values[math.min(values.length - 1, (values.length * f).floor())];
  final sum = values.reduce((a, b) => a + b);
  final mean = sum / values.length;
  return {
    'min_us': values.first,
    'median_us': p(0.5),
    'p95_us': p(0.95),
    'mean_us': mean,
    'fps': mean > 0 ? 1000000.0 / mean : 0.0,
  };
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('run polystar benchmarks', () {

  final fixtures = <String, Map<String, dynamic>>{
    'star_static_5pt': createPolyStarScene(
      star: polyStarShape(sy: 1, pt: {'a': 0, 'k': 5}, or: {'a': 0, 'k': 80}, ir: {'a': 0, 'k': 40}),
    ),
    'star_rounded_5pt': createPolyStarScene(
      star: polyStarShape(
        sy: 1,
        pt: {'a': 0, 'k': 5},
        or: {'a': 0, 'k': 80},
        os: {'a': 0, 'k': 25},
        ir: {'a': 0, 'k': 40},
        isR: {'a': 0, 'k': 25},
      ),
    ),
    'polygon_static_6pt': createPolyStarScene(
      star: polyStarShape(sy: 2, pt: {'a': 0, 'k': 6}, or: {'a': 0, 'k': 80}),
    ),
    'polygon_rounded_6pt': createPolyStarScene(
      star: polyStarShape(sy: 2, pt: {'a': 0, 'k': 6}, or: {'a': 0, 'k': 80}, os: {'a': 0, 'k': 25}),
    ),
    'star_animated': createPolyStarScene(
      star: polyStarShape(
        sy: 1,
        pt: {
          'a': 1,
          'k': [
            {'t': 0, 's': [5], 'e': [8]},
            {'t': 60, 's': [8]},
          ],
        },
        r: {
          'a': 1,
          'k': [
            {'t': 0, 's': [0], 'e': [360]},
            {'t': 60, 's': [360]},
          ],
        },
        or: {'a': 0, 'k': 85},
        ir: {'a': 0, 'k': 42},
      ),
    ),
  };

  print('=== FASTLOTTIE POLYSTAR BENCHMARK REPORT ===\n');

  final output = <String, dynamic>{};

  for (final entry in fixtures.entries) {
    final name = entry.key;
    final json = entry.value;

    // 1. Benchmark Parse / Compile
    final parseTimes = <double>[];
    for (var i = 0; i < 50; i++) {
      final sw = Stopwatch()..start();
      FastLottieComposition.fromJson(json);
      sw.stop();
      if (i >= 5) parseTimes.add(sw.elapsedMicroseconds.toDouble());
    }
    final parseStats = stats(parseTimes);

    // 2. Benchmark Canvas Vector Recording
    final comp = FastLottieComposition.fromJson(json);
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final recorder = ui.PictureRecorder();
    final canvas = ui.Canvas(recorder);

    // Warm up
    for (var f = 0; f < 60; f++) {
      player.draw(canvas, const ui.Rect.fromLTWH(0, 0, 256, 256), f / 60.0, useFrameRate: false);
    }

    final canvasRecordTimes = <double>[];
    for (var loop = 0; loop < 10; loop++) {
      for (var f = 0; f < 60; f++) {
        final rec = ui.PictureRecorder();
        final c = ui.Canvas(rec);
        final sw = Stopwatch()..start();
        player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), f / 60.0, useFrameRate: false);
        sw.stop();
        final pic = rec.endRecording();
        pic.dispose();
        canvasRecordTimes.add(sw.elapsedMicroseconds.toDouble());
      }
    }
    final canvasStats = stats(canvasRecordTimes);

    // 3. Benchmark Pure CPU Software RLE Rasterizer
    // Warm up
    for (var f = 0; f < 30; f++) {
      debugRenderSoftwareFrame(comp, f.toDouble(), pixelWidth: 256, pixelHeight: 256);
    }
    final swRleTimes = <double>[];
    for (var loop = 0; loop < 5; loop++) {
      for (var f = 0; f < 60; f++) {
        final sw = Stopwatch()..start();
        debugRenderSoftwareFrame(comp, f.toDouble(), pixelWidth: 256, pixelHeight: 256);
        sw.stop();
        swRleTimes.add(sw.elapsedMicroseconds.toDouble());
      }
    }
    final swStats = stats(swRleTimes);

    player.dispose();

    output[name] = {
      'parse_compile': parseStats,
      'canvas_record': canvasStats,
      'sw_rle_rasterizer': swStats,
    };

    print('Fixture: $name (256x256)');
    print('  - Parse/Compile : median ${parseStats['median_us']} µs, p95 ${parseStats['p95_us']} µs');
    print('  - Canvas Record : median ${canvasStats['median_us']} µs, mean ${canvasStats['mean_us']!.toStringAsFixed(2)} µs (~${canvasStats['fps']!.toInt()} FPS)');
    print('  - SW Rasterizer : median ${swStats['median_us']} µs, mean ${swStats['mean_us']!.toStringAsFixed(2)} µs (~${swStats['fps']!.toInt()} FPS)');
    print('');
  }

  final reportFile = File('docs/polystar-benchmark.json');
  reportFile.writeAsStringSync(const JsonEncoder.withIndent('  ').convert(output));
  print('Benchmark data written to: ${reportFile.path}');
  });
}
