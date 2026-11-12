import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

Map<String, dynamic> calcStats(List<double> times) {
  if (times.isEmpty) {
    return {
      'min_us': 0.0,
      'median_us': 0.0,
      'p95_us': 0.0,
      'max_us': 0.0,
      'mean_us': 0.0,
      'fps': 0.0,
      'samples': 0,
    };
  }
  times.sort();
  final sum = times.reduce((a, b) => a + b);
  final mean = sum / times.length;
  final minV = times.first;
  final maxV = times.last;
  final med = times[times.length ~/ 2];
  final p95Idx = math.min(times.length - 1, (times.length * 0.95).floor());
  final p95 = times[p95Idx];
  final fps = mean > 0 ? 1000000.0 / mean : 0.0;
  return {
    'min_us': minV,
    'median_us': med,
    'p95_us': p95,
    'max_us': maxV,
    'mean_us': mean,
    'fps': fps,
    'samples': times.length,
  };
}

class FixtureSpec {
  const FixtureSpec({
    required this.key,
    required this.assetPath,
    required this.width,
    required this.height,
    required this.warmLoops,
  });

  final String key;
  final String assetPath;
  final int width;
  final int height;
  final int warmLoops;
}

const fixtures = [
  FixtureSpec(
    key: 'thorvg_segment',
    assetPath: 'assets/thorvg_segment.json',
    width: 256,
    height: 256,
    warmLoops: 8,
  ),
  FixtureSpec(
    key: 'thorvg_tween',
    assetPath: 'assets/thorvg_tween.json',
    width: 512,
    height: 512,
    warmLoops: 6,
  ),
  FixtureSpec(
    key: 'static',
    assetPath: 'assets/static.json',
    width: 256,
    height: 256,
    warmLoops: 12,
  ),
  FixtureSpec(
    key: 'icon',
    assetPath: 'assets/icon.json',
    width: 256,
    height: 256,
    warmLoops: 12,
  ),
  FixtureSpec(
    key: 'many_shapes',
    assetPath: 'assets/many_shapes.json',
    width: 256,
    height: 256,
    warmLoops: 8,
  ),
  FixtureSpec(
    key: 'morph',
    assetPath: 'assets/morph.json',
    width: 256,
    height: 256,
    warmLoops: 8,
  ),
  FixtureSpec(
    key: 'rlottie_gears',
    assetPath: 'assets/rlottie_gears.json',
    width: 128,
    height: 128,
    warmLoops: 10,
  ),
  FixtureSpec(
    key: 'rlottie_tile_grid',
    assetPath: 'assets/rlottie_tile_grid.json',
    width: 256,
    height: 256,
    warmLoops: 8,
  ),
  FixtureSpec(
    key: 'rlottie_material_wave',
    assetPath: 'assets/rlottie_material_wave.json',
    width: 256,
    height: 256,
    warmLoops: 10,
  ),
];

Future<void> runSoftwareBenchmarks() async {
  final results = <String, dynamic>{};

  for (final fix in fixtures) {
    // ignore: avoid_print
    print(
      'Benchmarking fastlottie software rasterizer on ${fix.key} (${fix.width}x${fix.height})...',
    );

    final data = await rootBundle.load(fix.assetPath);
    final bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );

    // 1. Measure parse/compile time
    final parseTimes = <double>[];
    for (var i = 0; i < 10; i++) {
      final sw = Stopwatch()..start();
      FastLottieComposition.fromBytes(bytes);
      sw.stop();
      parseTimes.add(sw.elapsedMicroseconds.toDouble());
    }
    final parseStats = calcStats(parseTimes);

    // 2. Setup session
    final comp = FastLottieComposition.fromBytes(bytes);
    final totalFrames = (comp.endFrame - comp.startFrame).ceil().clamp(
      1,
      10000,
    );
    final session = FastLottieSoftwareSession(
      comp,
      pixelWidth: fix.width,
      pixelHeight: fix.height,
    );

    // 3. Cold run
    final coldSw = Stopwatch()..start();
    for (var f = 0; f < totalFrames; f++) {
      session.renderFrame(comp.startFrame + f);
    }
    coldSw.stop();
    final coldFrameAvgUs = coldSw.elapsedMicroseconds / totalFrames;

    // 4. Warm runs
    final warmTimes = <double>[];
    for (var loop = 0; loop < fix.warmLoops; loop++) {
      for (var f = 0; f < totalFrames; f++) {
        final frameNum = comp.startFrame + f;
        final sw = Stopwatch()..start();
        session.renderFrame(frameNum);
        sw.stop();
        warmTimes.add(sw.elapsedMicroseconds.toDouble());
      }
    }
    session.dispose();
    final warmStats = calcStats(warmTimes);

    // ignore: avoid_print
    print(
      '  fastlottie (SIMD: $isSimdSupported): warm median = ${warmStats['median_us']} us/frame (${(warmStats['fps'] as double).toStringAsFixed(1)} FPS)',
    );

    results[fix.key] = {
      'width': fix.width,
      'height': fix.height,
      'total_frames': totalFrames,
      'warm_loops': fix.warmLoops,
      'fastlottie': {
        'parse_median_us': parseStats['median_us'],
        'cold_frame_avg_us': coldFrameAvgUs,
        'warm_median_us': warmStats['median_us'],
        'warm_min_us': warmStats['min_us'],
        'warm_p95_us': warmStats['p95_us'],
        'warm_mean_us': warmStats['mean_us'],
        'fps': warmStats['fps'],
        'samples': warmStats['samples'],
      },
    };
  }

  final finalOutput = {
    'engine': 'fastlottie_software',
    'release': kReleaseMode,
    'results': results,
  };

  final payload = jsonEncode(finalOutput);
  for (var i = 0; i < payload.length; i += 2000) {
    final end = i + 2000 < payload.length ? i + 2000 : payload.length;
    // ignore: avoid_print
    print('FASTLOTTIE_SW_CHUNK:${payload.substring(i, end)}');
  }
  // ignore: avoid_print
  print('FASTLOTTIE_SW_DONE');
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(
        child: Text(
          'Fastlottie Software Benchmark',
          style: TextStyle(fontSize: 24),
        ),
      ),
    ),
  );

  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      await runSoftwareBenchmarks();
      exit(0);
    } catch (e, st) {
      // ignore: avoid_print
      print('FASTLOTTIE_SW_ERROR: $e\n$st');
      exit(1);
    }
  });
}
