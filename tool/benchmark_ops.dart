// ignore_for_file: avoid_print, invalid_use_of_visible_for_testing_member
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

Map<String, dynamic> constant(dynamic value) => {'a': 0, 'k': value};

Map<String, dynamic> createMergeScene(int mode) => {
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
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            {
              'ty': 'rc',
              'p': constant([100, 100]),
              's': constant([100, 100]),
              'r': constant(0),
            },
            {
              'ty': 'el',
              'p': constant([100, 100]),
              's': constant([60, 60]),
            },
            {'ty': 'mm', 'mm': mode, 'hd': false},
            {
              'ty': 'fl',
              'c': constant([0.2, 0.6, 1.0]),
              'o': constant(100),
              'r': 1,
            },
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

Map<String, dynamic> createBlendScene(int blendMode) => {
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': 256,
  'h': 256,
  'layers': [
    {
      'ind': 1,
      'ty': 4,
      'ip': 0,
      'op': 60,
      'st': 0,
      'bm': blendMode,
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
              'p': constant([128, 128]),
              's': constant([128, 128]),
              'r': constant(0),
            },
            {
              'ty': 'fl',
              'c': constant([0.0, 1.0, 0.0]),
              'o': constant(100),
              'r': 1,
            },
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
    {
      'ind': 2,
      'ty': 4,
      'ip': 0,
      'op': 60,
      'st': 0,
      'bm': 0,
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
              'p': constant([128, 128]),
              's': constant([256, 256]),
              'r': constant(0),
            },
            {
              'ty': 'fl',
              'c': constant([1.0, 0.0, 0.0]),
              'o': constant(100),
              'r': 1,
            },
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

class BenchmarkResult {
  BenchmarkResult({
    required this.name,
    required this.compileTimeUs,
    required this.canvasDrawUs,
    required this.softwareRenderUs,
  });

  final String name;
  final double compileTimeUs;
  final double canvasDrawUs;
  final double softwareRenderUs;

  Map<String, dynamic> toJson() => {
    'name': name,
    'compile_us': compileTimeUs,
    'canvas_draw_us': canvasDrawUs,
    'software_render_us': softwareRenderUs,
    'canvas_fps': (1000000.0 / canvasDrawUs).round(),
    'software_fps': (1000000.0 / softwareRenderUs).round(),
  };
}

BenchmarkResult benchScene(String name, Map<String, dynamic> json) {
  const warmup = 20;
  const iterations = 500;

  // 1. Compile benchmark
  for (var i = 0; i < warmup; i++) {
    FastLottieComposition.fromJson(json);
  }
  final swCompile = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    FastLottieComposition.fromJson(json);
  }
  swCompile.stop();
  final compileUs = swCompile.elapsedMicroseconds / iterations;

  final comp = FastLottieComposition.fromJson(json);
  final player = FastLottiePlayer(comp, cache: FastLottieCache.none);

  // 2. Vector Canvas benchmark
  final recorder = ui.PictureRecorder();
  final canvas = ui.Canvas(recorder);
  const dest = ui.Rect.fromLTWH(0, 0, 256, 256);

  for (var i = 0; i < warmup; i++) {
    player.draw(canvas, dest, (i % 60) / 60.0);
  }
  final swCanvas = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    player.draw(canvas, dest, (i % 60) / 60.0);
  }
  swCanvas.stop();
  final canvasUs = swCanvas.elapsedMicroseconds / iterations;
  player.dispose();

  // 3. Software RLE Rasterizer benchmark
  for (var i = 0; i < warmup; i++) {
    debugRenderSoftwareFrame(
      comp,
      (i % 60).toDouble(),
      pixelWidth: 256,
      pixelHeight: 256,
    );
  }
  final swRle = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    debugRenderSoftwareFrame(
      comp,
      (i % 60).toDouble(),
      pixelWidth: 256,
      pixelHeight: 256,
    );
  }
  swRle.stop();
  final softwareUs = swRle.elapsedMicroseconds / iterations;

  return BenchmarkResult(
    name: name,
    compileTimeUs: compileUs,
    canvasDrawUs: canvasUs,
    softwareRenderUs: softwareUs,
  );
}

BenchmarkResult benchTgs(String name, String path) {
  const warmup = 10;
  const iterations = 200;
  final file = File(path);
  final bytes = file.readAsBytesSync();

  for (var i = 0; i < warmup; i++) {
    FastLottieComposition.fromBytes(bytes);
  }
  final swCompile = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    FastLottieComposition.fromBytes(bytes);
  }
  swCompile.stop();
  final compileUs = swCompile.elapsedMicroseconds / iterations;

  final comp = FastLottieComposition.fromBytes(bytes);
  final player = FastLottiePlayer(comp, cache: FastLottieCache.none);

  final recorder = ui.PictureRecorder();
  final canvas = ui.Canvas(recorder);
  const dest = ui.Rect.fromLTWH(0, 0, 256, 256);

  for (var i = 0; i < warmup; i++) {
    player.draw(canvas, dest, (i % 60) / 60.0);
  }
  final swCanvas = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    player.draw(canvas, dest, (i % 60) / 60.0);
  }
  swCanvas.stop();
  final canvasUs = swCanvas.elapsedMicroseconds / iterations;
  player.dispose();

  for (var i = 0; i < warmup; i++) {
    debugRenderSoftwareFrame(
      comp,
      (i % 60).toDouble(),
      pixelWidth: 256,
      pixelHeight: 256,
    );
  }
  final swRle = Stopwatch()..start();
  for (var i = 0; i < iterations; i++) {
    debugRenderSoftwareFrame(
      comp,
      (i % 60).toDouble(),
      pixelWidth: 256,
      pixelHeight: 256,
    );
  }
  swRle.stop();
  final softwareUs = swRle.elapsedMicroseconds / iterations;

  return BenchmarkResult(
    name: name,
    compileTimeUs: compileUs,
    canvasDrawUs: canvasUs,
    softwareRenderUs: softwareUs,
  );
}

void main() {
  test('Run Ops Benchmarks (Merge Paths & Blend Modes)', () {
    final results = <BenchmarkResult>[];

    print('\n=== 1. MERGE PATHS BENCHMARKS ===');
    final mergeModes = {
      'Merge Paths Mode 1 (Merge)': 1,
      'Merge Paths Mode 2 (Add / Union)': 2,
      'Merge Paths Mode 3 (Subtract)': 3,
      'Merge Paths Mode 4 (Intersect)': 4,
      'Merge Paths Mode 5 (Exclude / XOR)': 5,
    };
    for (final entry in mergeModes.entries) {
      final res = benchScene(entry.key, createMergeScene(entry.value));
      results.add(res);
      print(
        '${res.name.padRight(36)} | Compile: ${res.compileTimeUs.toStringAsFixed(1)}µs | Canvas: ${res.canvasDrawUs.toStringAsFixed(1)}µs (${(1000000.0 / res.canvasDrawUs).round()} fps) | SW RLE: ${res.softwareRenderUs.toStringAsFixed(1)}µs (${(1000000.0 / res.softwareRenderUs).round()} fps)',
      );
    }

    print('\n=== 2. BLEND MODES BENCHMARKS ===');
    final blendModes = {
      'Blend Mode Normal (bm=0)': 0,
      'Blend Mode Multiply (bm=1)': 1,
      'Blend Mode Screen (bm=2)': 2,
      'Blend Mode Overlay (bm=3)': 3,
      'Blend Mode Difference (bm=10)': 10,
    };
    for (final entry in blendModes.entries) {
      final res = benchScene(entry.key, createBlendScene(entry.value));
      results.add(res);
      print(
        '${res.name.padRight(36)} | Compile: ${res.compileTimeUs.toStringAsFixed(1)}µs | Canvas: ${res.canvasDrawUs.toStringAsFixed(1)}µs (${(1000000.0 / res.canvasDrawUs).round()} fps) | SW RLE: ${res.softwareRenderUs.toStringAsFixed(1)}µs (${(1000000.0 / res.softwareRenderUs).round()} fps)',
      );
    }

    print('\n=== 3. REAL TELEGRAM TGS STICKERS ===');
    final tgsFiles = [
      (
        'TGS emoji_u1f30b (Volcano - mm:2)',
        'example/assets/tgs/NotoEmoji/emoji_u1f30b.tgs',
      ),
      (
        'TGS emoji_u1f345 (Tomato - mm:4)',
        'example/assets/tgs/NotoEmoji/emoji_u1f345.tgs',
      ),
      (
        'TGS emoji_u1f60a (Smile - mm:4)',
        'example/assets/tgs/NotoEmoji/emoji_u1f60a.tgs',
      ),
      (
        'TGS emoji_u1f389 (Party Popper - bm:10)',
        'example/assets/tgs/NotoEmoji/emoji_u1f389.tgs',
      ),
      (
        'TGS emoji_u1f393 (Graduation - bm:1)',
        'example/assets/tgs/NotoEmoji/emoji_u1f393.tgs',
      ),
      (
        'TGS emoji_u1f426_200d_1f525 (Phoenix - bm:1)',
        'example/assets/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
      ),
    ];

    for (final (label, path) in tgsFiles) {
      if (File(path).existsSync()) {
        final res = benchTgs(label, path);
        results.add(res);
        print(
          '${res.name.padRight(42)} | Compile: ${res.compileTimeUs.toStringAsFixed(1)}µs | Canvas: ${res.canvasDrawUs.toStringAsFixed(1)}µs (${(1000000.0 / res.canvasDrawUs).round()} fps) | SW RLE: ${res.softwareRenderUs.toStringAsFixed(1)}µs (${(1000000.0 / res.softwareRenderUs).round()} fps)',
        );
      }
    }

    // Save results to json
    final jsonOut = results.map((r) => r.toJson()).toList();
    File('docs/ops-benchmark.json')
        .writeAsStringSync(const JsonEncoder.withIndent('  ').convert(jsonOut));
    print('\nWrote benchmark data to docs/ops-benchmark.json');
  });
}
