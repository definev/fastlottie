// ignore_for_file: avoid_print, invalid_use_of_visible_for_testing_member
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

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
}) => {
  'inv': inv,
  'mode': mode,
  'pt': pt,
  'o': o ?? {'a': 0, 'k': 100},
};

Map<String, dynamic> createSolidSceneWithMask({
  required List<Map<String, dynamic>> masks,
  double sw = 256,
  double sh = 256,
  String sc = '#0088FF',
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
        'o': {'a': 0, 'k': 100},
        'r': {'a': 0, 'k': 0},
        'p': {
          'a': 0,
          'k': [0, 0, 0],
        },
        'a': {
          'a': 0,
          'k': [0, 0, 0],
        },
        's': {
          'a': 0,
          'k': [100, 100, 100],
        },
      },
      'hasMask': masks.isNotEmpty,
      'masksProperties': masks,
    },
  ],
};

Map<String, dynamic> createShapeSceneWithMask({
  required List<Map<String, dynamic>> masks,
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
        'p': {
          'a': 0,
          'k': [0, 0, 0],
        },
        'a': {
          'a': 0,
          'k': [0, 0, 0],
        },
        's': {
          'a': 0,
          'k': [100, 100, 100],
        },
      },
      'hasMask': masks.isNotEmpty,
      'masksProperties': masks,
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            {
              'ty': 'rc',
              'p': {
                'a': 0,
                'k': [128, 128],
              },
              's': {
                'a': 0,
                'k': [200, 200],
              },
              'r': {'a': 0, 'k': 0},
            },
            {
              'ty': 'fl',
              'c': {
                'a': 0,
                'k': [1.0, 0.4, 0.1],
              },
              'o': {'a': 0, 'k': 100},
              'r': 1,
            },
            {
              'ty': 'tr',
              'p': {
                'a': 0,
                'k': [0, 0],
              },
              'a': {
                'a': 0,
                'k': [0, 0],
              },
              's': {
                'a': 0,
                'k': [100, 100],
              },
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
  double p(double f) =>
      values[math.min(values.length - 1, (values.length * f).floor())];
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

  test('run layer masks benchmarks', () {
    final targets = <String, Map<String, dynamic>>{
      'Masked Solid Layer (Static)': createSolidSceneWithMask(
        masks: [
          maskObject(
            pt: {'a': 0, 'k': maskPathRect(50, 50, 100, 100)},
            mode: 'a',
          ),
        ],
      ),
      'Masked Shape Layer (Static)': createShapeSceneWithMask(
        masks: [
          maskObject(
            pt: {'a': 0, 'k': maskPathRect(60, 60, 80, 80)},
            mode: 'a',
          ),
        ],
      ),
      'Masked Solid Layer (Animated Mask)': createSolidSceneWithMask(
        masks: [
          maskObject(
            pt: {
              'a': 1,
              'k': [
                {
                  't': 0,
                  's': [maskPathRect(30, 30, 80, 80)],
                  'i': {
                    'x': [0.4],
                    'y': [1.0],
                  },
                  'o': {
                    'x': [0.6],
                    'y': [0.0],
                  },
                },
                {
                  't': 59,
                  's': [maskPathRect(80, 80, 140, 140)],
                },
              ],
            },
            mode: 'a',
          ),
        ],
      ),
    };

    // Add real TGS fixtures if available
    for (final name in ['emoji_u1f308', 'emoji_u1f483']) {
      final file = File('example/assets/tgs/NotoEmoji/$name.tgs');
      if (file.existsSync()) {
        final raw = decodeLottieBytes(file.readAsBytesSync());
        final doc = jsonDecode(utf8.decode(raw)) as Map<String, dynamic>;
        targets['Real TGS: $name'] = doc;
      }
    }

    final benchmarkResults = <String, dynamic>{};

    for (final entry in targets.entries) {
      final name = entry.key;
      final json = entry.value;

      // 1. Benchmark JSON Compile Time
      final compileTimes = <double>[];
      // Warm up
      for (var i = 0; i < 20; i++) {
        FastLottieComposition.fromJson(json);
      }
      for (var i = 0; i < 200; i++) {
        final sw = Stopwatch()..start();
        FastLottieComposition.fromJson(json);
        sw.stop();
        compileTimes.add(sw.elapsedMicroseconds.toDouble());
      }

      final comp = FastLottieComposition.fromJson(json);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(player.dispose);

      // 2. Benchmark Vector Canvas Recording (ui.PictureRecorder)
      final recordTimes = <double>[];
      final bounds = const ui.Rect.fromLTWH(0, 0, 256, 256);
      // Warm up
      for (var i = 0; i < 50; i++) {
        final rec = ui.PictureRecorder();
        final canvas = ui.Canvas(rec);
        player.draw(canvas, bounds, (i % 60) / 60.0, useFrameRate: false);
        rec.endRecording().dispose();
      }
      for (var i = 0; i < 1000; i++) {
        final frameFraction = (i % 60) / 60.0;
        final rec = ui.PictureRecorder();
        final canvas = ui.Canvas(rec);
        final sw = Stopwatch()..start();
        player.draw(canvas, bounds, frameFraction, useFrameRate: false);
        final pic = rec.endRecording();
        sw.stop();
        pic.dispose();
        recordTimes.add(sw.elapsedMicroseconds.toDouble());
      }

      // 3. Benchmark CPU Software RLE Rasterizer
      final rasterTimes = <double>[];
      // Warm up
      for (var i = 0; i < 10; i++) {
        debugRenderSoftwareFrame(
          comp,
          (i % 60).toDouble(),
          pixelWidth: 256,
          pixelHeight: 256,
        );
      }
      for (var i = 0; i < 100; i++) {
        final frame = (i % 60).toDouble();
        final sw = Stopwatch()..start();
        debugRenderSoftwareFrame(
          comp,
          frame,
          pixelWidth: 256,
          pixelHeight: 256,
        );
        sw.stop();
        rasterTimes.add(sw.elapsedMicroseconds.toDouble());
      }

      final res = {
        'compile': stats(compileTimes),
        'vector_canvas_record': stats(recordTimes),
        'software_rle_rasterizer': stats(rasterTimes),
      };
      benchmarkResults[name] = res;

      print('=== $name ===');
      print(
        'Compile:      mean=${res['compile']!['mean_us']!.toStringAsFixed(1)} µs, median=${res['compile']!['median_us']!.toStringAsFixed(1)} µs',
      );
      print(
        'Canvas Rec:   mean=${res['vector_canvas_record']!['mean_us']!.toStringAsFixed(1)} µs, FPS=${res['vector_canvas_record']!['fps']!.toStringAsFixed(0)}',
      );
      print(
        'SW Rasterize: mean=${res['software_rle_rasterizer']!['mean_us']!.toStringAsFixed(1)} µs, FPS=${res['software_rle_rasterizer']!['fps']!.toStringAsFixed(0)}',
      );
    }

    final outPath = 'docs/masks-benchmark.json';
    File(outPath).writeAsStringSync(
      const JsonEncoder.withIndent('  ').convert(benchmarkResults),
    );
    print('Benchmark results saved to $outPath');
  });
}
