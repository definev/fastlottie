import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
// ignore: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

import 'tgs/gallery.dart';
import 'tgs/store.dart';

Map<String, num> stats(List<double> values) {
  final sorted = values.toList()..sort();
  double p(double f) =>
      sorted[math.min(sorted.length - 1, (sorted.length * f).floor())];
  return {'median_us': p(.5), 'p95_us': p(.95), 'max_us': sorted.last};
}

Future<Map<String, dynamic>> frameProfile(
  ScrollController scroll, {
  required bool scrolling,
}) async {
  final done = Completer<Map<String, dynamic>>();
  final build = <double>[], raster = <double>[], total = <double>[];
  var observed = 0;
  void timings(List<FrameTiming> batch) {
    for (final frame in batch) {
      if (observed++ < 30) continue;
      build.add(frame.buildDuration.inMicroseconds.toDouble());
      raster.add(frame.rasterDuration.inMicroseconds.toDouble());
      total.add(frame.totalSpan.inMicroseconds.toDouble());
      if (total.length == 90) {
        done.complete({
          'samples': 90,
          'build': stats(build),
          'raster': stats(raster),
          'total': stats(total),
        });
        return;
      }
    }
  }

  SchedulerBinding.instance.addTimingsCallback(timings);
  final ticker = Ticker((_) {
    if (scrolling && scroll.hasClients) scroll.jumpTo(scroll.offset + 24);
  })..start();
  try {
    return await done.future.timeout(
      const Duration(seconds: 15),
      onTimeout: () => {
        'unavailable': 'FrameTiming timeout',
        'observed': observed,
      },
    );
  } finally {
    ticker.dispose();
    SchedulerBinding.instance.removeTimingsCallback(timings);
  }
}

Future<Map<String, dynamic>> benchmark() async {
  final assets = await loadTgsCatalog(rootBundle);
  // Benchmark retains both engines so switching doesn't implicitly evict one.
  final store = TgsStore(
    maximumEntries: 256,
    maximumSourceBytes: 64 * 1024 * 1024,
  );
  final result = <String, dynamic>{
    'schema': 1,
    'release': kReleaseMode,
    'date_utc': DateTime.now().toUtc().toIso8601String(),
    'os': Platform.operatingSystemVersion,
    'dart': Platform.version,
    'assets': assets.length,
    'concurrency': store.concurrency,
  };
  final loop = Stopwatch()..start();
  var last = 0;
  final gaps = <double>[];
  final timer = Timer.periodic(const Duration(milliseconds: 2), (_) {
    final now = loop.elapsedMicroseconds;
    gaps.add((now - last).toDouble());
    last = now;
  });
  final cold = Stopwatch()..start();
  final leases = [for (final asset in assets) store.acquire(asset)];
  final models = await Future.wait(leases.map((l) => l.future));
  cold.stop();
  timer.cancel();
  for (final lease in leases) {
    lease.release();
  }
  result['fastlottie_cold_wall_us'] = cold.elapsedMicroseconds;
  result['ui_timer_gap'] = stats(gaps);
  result['native'] = models.where((m) => m.fast != null).length;
  result['fallback'] = models.where((m) => m.fast == null).length;
  result['inflate'] = stats([for (final m in models) m.inflateUs.toDouble()]);
  result['fastlottie_parse_compile'] = stats([
    for (final m in models) m.parseUs.toDouble(),
  ]);
  result['source_bytes'] = models.fold<int>(0, (n, m) => n + m.sourceBytes);
  final before = store.decodes;
  final warm = Stopwatch()..start();
  final warmLeases = [for (final asset in assets) store.acquire(asset)];
  await Future.wait(warmLeases.map((l) => l.future));
  warm.stop();
  for (final lease in warmLeases) {
    lease.release();
  }
  result['warm_catalog_wall_us'] = warm.elapsedMicroseconds;
  result['warm_extra_decodes'] = store.decodes - before;
  result['cached_after_fastlottie'] = store.cached;
  final forks = <double>[];
  for (final model in models.where((m) => m.fast != null)) {
    final sw = Stopwatch()..start();
    final player = FastLottiePlayer(model.fast!);
    sw.stop();
    forks.add(sw.elapsedTicks * 1000000 / sw.frequency);
    player.dispose();
  }
  result['player_fork'] = stats(forks);

  final fused = <double>[], string = <double>[];
  final jsonBytesCodec = json.fuse(utf8);
  for (final asset in assets.take(12)) {
    final data = await rootBundle.load(asset);
    final raw = decodeLottieBytes(
      data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
    );
    for (var i = 0; i < 6; i++) {
      void decode(bool direct) {
        final sw = Stopwatch()..start();
        final value = direct
            ? jsonBytesCodec.decode(raw)
            : jsonDecode(utf8.decode(raw));
        if (value is! Map || value['layers'] is! List) {
          throw StateError('Invalid benchmark JSON');
        }
        sw.stop();
        if (i > 0) {
          (direct ? fused : string).add(
            sw.elapsedTicks * 1000000 / sw.frequency,
          );
        }
      }

      if (i.isEven) {
        decode(true);
        decode(false);
      } else {
        decode(false);
        decode(true);
      }
    }
  }
  result['json_fused'] = stats(fused);
  result['json_via_string'] = stats(string);

  final baselineWall = Stopwatch()..start();
  final refs = [
    for (final asset in assets) store.acquire(asset, reference: true),
  ];
  final baseline = await Future.wait(refs.map((l) => l.future));
  baselineWall.stop();
  for (final lease in refs) {
    lease.release();
  }
  result['lottie_cold_wall_us'] = baselineWall.elapsedMicroseconds;
  result['lottie_parse'] = stats([
    for (final m in baseline) m.parseUs.toDouble(),
  ]);
  result['sticker_timings'] = [
    for (var i = 0; i < assets.length; i++)
      {
        'asset': assets[i],
        'backend': models[i].fast != null ? 'fastlottie' : 'lottie',
        'json_bytes': models[i].sourceBytes,
        'inflate_us': models[i].inflateUs,
        'fastlottie_parse_us': models[i].parseUs,
        'lottie_parse_us': baseline[i].parseUs,
      },
  ];

  final profiles = <String, dynamic>{};
  for (final renderer in [TgsRenderer.fastlottie, TgsRenderer.lottie]) {
    final scroll = ScrollController();
    runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: TgsGallery(
          key: ValueKey(renderer),
          store: store,
          catalog: Future.value(assets),
          initialRenderer: renderer,
          initialWorkload: TgsWorkload.full,
          scrollController: scroll,
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    final view = WidgetsBinding.instance.platformDispatcher.views.first;
    result['viewport_logical'] = {
      'width': view.physicalSize.width / view.devicePixelRatio,
      'height': view.physicalSize.height / view.devicePixelRatio,
      'dpr': view.devicePixelRatio,
    };
    profiles[renderer.name] = {
      'idle': await frameProfile(scroll, scrolling: false),
      'scrolling': await frameProfile(scroll, scrolling: true),
    };
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    scroll.dispose();
  }
  result['grid_frame_timings'] = profiles;
  store.dispose();
  return result;
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Use --release');
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('Preparing TGS benchmark…')),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      final payload = jsonEncode(await benchmark());
      for (var i = 0; i < payload.length; i += 512) {
        // ignore: avoid_print
        print(
          'FASTLOTTIE_CHUNK:${payload.substring(i, math.min(i + 512, payload.length))}',
        );
      }
      // ignore: avoid_print
      print('FASTLOTTIE_DONE');
      exit(0);
    } catch (error, stack) {
      // ignore: avoid_print
      print('FASTLOTTIE_ERROR:$error\n$stack');
      exit(1);
    }
  });
}
