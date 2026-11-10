import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';
// Pinned baseline exposes its low-level cache context only through src.
// ignore: implementation_imports
import 'package:lottie/src/lottie_drawable.dart' show RenderCacheContext;

Map<String, num> distribution(List<double> values) {
  values.sort();
  double p(double f) =>
      values[math.min(values.length - 1, (values.length * f).floor())];
  return {'median_us': p(.5), 'p95_us': p(.95), 'min_us': values.first};
}

class BenchMode {
  BenchMode(this.name, this.paint, this.dispose, {this.prepare, this.memory});
  final String name;
  final void Function(ui.Canvas, int) paint;
  final void Function() dispose;
  final Future<void> Function()? prepare;
  final int Function()? memory;
}

Future<Map<String, dynamic>> runBenchmarks({
  required RenderBox renderBox,
  required Future<Map<String, dynamic>> Function(BenchMode) measureFrames,
}) async {
  final fixtures = const ['static', 'icon', 'many_shapes', 'morph'];
  final result = <String, dynamic>{
    'schema': 1,
    'date_utc': DateTime.now().toUtc().toIso8601String(),
    'release': kReleaseMode,
    'os': Platform.operatingSystemVersion,
    'dart': Platform.version,
    'lottie': '3.8.2',
    'size_px': 256,
    'warm_loops': 12,
    'source_frames': 60,
    'fixtures': <String, dynamic>{},
  };
  if (!kReleaseMode) throw StateError('Benchmark must run in --release');
  for (final name in fixtures) {
    final data = await rootBundle.load('assets/$name.json');
    final bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    final parseFast = <double>[], parseLottie = <double>[];
    // Alternate order to reduce systematic GC/thermal bias.
    for (var i = 0; i < 14; i++) {
      void fast() {
        final sw = Stopwatch()..start();
        FastLottieComposition.fromBytes(bytes);
        sw.stop();
        if (i >= 2) parseFast.add(sw.elapsedMicroseconds.toDouble());
      }

      void baseline() {
        final sw = Stopwatch()..start();
        LottieComposition.parseJsonBytes(bytes);
        sw.stop();
        if (i >= 2) parseLottie.add(sw.elapsedMicroseconds.toDouble());
      }

      if (i.isEven) {
        fast();
        baseline();
      } else {
        baseline();
        fast();
      }
    }
    final fastComposition = FastLottieComposition.fromBytes(bytes);
    final lottieComposition = LottieComposition.parseJsonBytes(bytes);
    final modes = <BenchMode>[];
    for (final kind in ['uncached', 'picture', 'raster']) {
      final player = FastLottiePlayer(
        fastComposition,
        cache: kind == 'picture'
            ? const FastLottieCache()
            : FastLottieCache.none,
      );
      modes.add(
        BenchMode(
          'fast_$kind',
          (c, f) =>
              player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), f / 60),
          player.dispose,
          prepare: kind == 'raster'
              ? () => player.prepareRaster(width: 256, height: 256)
              : null,
          memory: () => player.rasterBytes,
        ),
      );
      final drawable = LottieDrawable(
        lottieComposition,
        frameRate: FrameRate.composition,
      );
      final user = Object();
      final config = kind == 'uncached'
          ? null
          : kind == 'raster'
          ? RenderCache.raster
          : RenderCache.drawingCommands;
      final handle = config?.acquire(user);
      final context = handle == null
          ? null
          : RenderCacheContext(
              cache: handle,
              renderBox: renderBox,
              devicePixelRatio: 1,
            );
      modes.add(
        BenchMode('lottie_$kind', (c, f) {
          drawable.setProgress(f / lottieComposition.durationFrames);
          drawable.draw(
            c,
            const ui.Rect.fromLTWH(0, 0, 256, 256),
            fit: BoxFit.contain,
            renderCache: context,
          );
        }, () => config?.release(user)),
      );
    }
    if (name == 'morph') {
      final simd = FastLottiePlayer(
        FastLottieComposition.fromBytes(
          bytes,
          options: const FastLottieOptions(useSimd: true),
        ),
        cache: FastLottieCache.none,
      );
      modes.add(
        BenchMode(
          'fast_simd_uncached',
          (c, f) =>
              simd.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), f / 60),
          simd.dispose,
        ),
      );
    }
    final rows = <String, dynamic>{};
    for (final mode in modes) {
      final preparation = Stopwatch()..start();
      await mode.prepare?.call();
      preparation.stop();
      final cold = <double>[], warm = <double>[];
      for (var i = 0; i < 60 * (1 + 12); i++) {
        final recorder = ui.PictureRecorder();
        final canvas = ui.Canvas(recorder);
        final sw = Stopwatch()..start();
        mode.paint(canvas, i % 60);
        final picture = recorder.endRecording();
        sw.stop();
        (i < 60 ? cold : warm).add(sw.elapsedTicks * 1000000 / sw.frequency);
        picture.dispose();
        if (i % 60 == 59) await Future<void>.delayed(Duration.zero);
      }
      // Raster wall latency includes scheduling + GPU + readback; report separately.
      final raster = <double>[];
      for (var i = 0; i < 24; i++) {
        final recorder = ui.PictureRecorder();
        mode.paint(ui.Canvas(recorder), (i * 7) % 60);
        final picture = recorder.endRecording();
        final sw = Stopwatch()..start();
        final image = await picture.toImage(256, 256);
        final pixels = await image.toByteData(
          format: ui.ImageByteFormat.rawRgba,
        );
        sw.stop();
        if (pixels == null) throw StateError('No raster output');
        if (i >= 4) raster.add(sw.elapsedTicks * 1000000 / sw.frequency);
        image.dispose();
        picture.dispose();
        // Give async render caches time to finish pending raster images.
        await Future<void>.delayed(const Duration(milliseconds: 2));
      }
      // Remeasure after the readback phase to expose clock/thermal variation.
      final settled = <double>[];
      for (var i = 0; i < 240; i++) {
        final recorder = ui.PictureRecorder();
        final canvas = ui.Canvas(recorder);
        final sw = Stopwatch()..start();
        mode.paint(canvas, i % 60);
        final picture = recorder.endRecording();
        sw.stop();
        picture.dispose();
        settled.add(sw.elapsedTicks * 1000000 / sw.frequency);
      }
      rows[mode.name] = {
        'prepare_us': preparation.elapsedMicroseconds,
        'cold_record': distribution(cold),
        'warm_record': distribution(warm),
        'settled_record': distribution(settled),
        'raster_readback_wall': distribution(raster),
        'rgba_bytes': mode.memory?.call(),
      };
      if (name == 'many_shapes' || name == 'morph') {
        rows[mode.name]['visible_frames'] = await measureFrames(mode);
      }
      // ignore: avoid_print
      print('BENCH $name ${mode.name}: ${jsonEncode(rows[mode.name])}');
      mode.dispose();
    }
    result['fixtures'][name] = {
      'bytes': bytes.length,
      'parse_compile_fast': distribution(parseFast),
      'parse_lottie': distribution(parseLottie),
      'modes': rows,
    };
  }
  return result;
}
