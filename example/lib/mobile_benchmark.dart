import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'package:material_ui/material_ui.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

import 'tgs/cache_dir.dart';
import 'tgs/gallery.dart';
import 'tgs/store.dart';
import 'tgs_benchmark.dart' show stats;

int? cpuTicks() {
  if (!Platform.isAndroid && !Platform.isLinux) return null;
  final value = File('/proc/self/stat').readAsStringSync();
  final fields = value
      .substring(value.lastIndexOf(')') + 2)
      .trim()
      .split(RegExp(r'\s+'));
  return int.parse(fields[11]) + int.parse(fields[12]);
}

Map<String, dynamic> cacheStats(FastLottieRasterCache cache) => {
  'bytes': cache.bytes,
  'gpu_bytes': cache.gpuBytes,
  'compressed_ram_bytes': cache.compressedRamBytes,
  'disk_bytes': cache.diskBytes,
  'reserved_bytes': cache.reservedBytes,
  'maximum_bytes': cache.maximumBytes,
  'entries': cache.entries,
  'hits': cache.hits,
  'misses': cache.misses,
  'rendered_frames': cache.renderedFrames,
  'vector_rasterized_frames': cache.vectorRasterizedFrames,
  'compressed_cache_hits': cache.compressedCacheHits,
  'ping_pong_swaps': cache.bufferSwaps,
  'worker_dispatches': cache.workerDispatches,
  'pending': cache.pendingFrames,
  'error': cache.lastError?.toString(),
  'resolution_scale': cache.resolutionScale,
  'strip_frames': cache.framesPerStrip,
};

Future<Map<String, dynamic>> profile(
  ScrollController scroll, {
  bool scrolling = false,
  bool forceVsync = true,
}) async {
  for (var i = 0; i < 30 && !scroll.hasClients; i++) {
    WidgetsBinding.instance.scheduleFrame();
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 10));
  }
  if (!scroll.hasClients) return {'unavailable': 'Grid viewport was detached'};
  final done = Completer<Map<String, dynamic>>();
  final build = <double>[],
      raster = <double>[],
      total = <double>[],
      vsync = <int>[];
  final watch = Stopwatch()..start();
  final startCpu = cpuTicks();
  var observed = 0;
  void timings(List<FrameTiming> batch) {
    if (done.isCompleted) return;
    for (final timing in batch) {
      if (observed++ < 30) continue;
      build.add(timing.buildDuration.inMicroseconds.toDouble());
      raster.add(timing.rasterDuration.inMicroseconds.toDouble());
      total.add(timing.totalSpan.inMicroseconds.toDouble());
      vsync.add(timing.timestampInMicroseconds(FramePhase.vsyncStart));
      if (vsync.length == 90) {
        done.complete({
          'samples': 90,
          'warmup_frames': 30,
          'build': stats(build),
          'raster': stats(raster),
          'total': stats(total),
          'submitted_frames_per_second':
              (vsync.length - 1) * 1000000 / (vsync.last - vsync.first),
          'cpu_ticks_including_warmup': startCpu == null
              ? null
              : cpuTicks()! - startCpu,
          'wall_us_including_warmup': watch.elapsedMicroseconds,
        });
        return;
      }
    }
  }

  SchedulerBinding.instance.addTimingsCallback(timings);
  final drag = scrolling
      ? scroll.position.drag(
          DragStartDetails(globalPosition: Offset.zero),
          () {},
        )
      : null;
  final ticker = Ticker((_) {
    if (drag != null) {
      drag.update(
        DragUpdateDetails(
          globalPosition: Offset.zero,
          delta: const Offset(0, -24),
          primaryDelta: -24,
        ),
      );
    } else if (forceVsync) {
      WidgetsBinding.instance.scheduleFrame();
    }
  });
  if (forceVsync) ticker.start();
  try {
    return await done.future.timeout(
      const Duration(seconds: 20),
      onTimeout: () => {'timeout': true, 'observed': observed},
    );
  } finally {
    ticker.dispose();
    drag?.cancel();
    SchedulerBinding.instance.removeTimingsCallback(timings);
  }
}

Future<Map<String, dynamic>> benchmark() async {
  await clearExampleDiskCache();
  final assets = await loadTgsCatalog(rootBundle);
  final store = TgsStore();
  final leases = [for (final asset in assets) store.acquire(asset)];
  await Future.wait(leases.map((l) => l.future));
  for (final lease in leases) {
    lease.release();
  }
  final view = WidgetsBinding.instance.platformDispatcher.views.first;
  final result = <String, dynamic>{
    'schema': 1,
    'release': kReleaseMode,
    'date_utc': DateTime.now().toUtc().toIso8601String(),
    'os': Platform.operatingSystemVersion,
    'dart': Platform.version,
    'assets': assets.length,
    'preloaded_models': store.cached,
    'viewport_logical': {
      'width': view.physicalSize.width / view.devicePixelRatio,
      'height': view.physicalSize.height / view.devicePixelRatio,
      'dpr': view.devicePixelRatio,
    },
    'warm_seconds': 12,
    'force_vsync_probe': true,
  };
  final modes = <String, dynamic>{};
  for (final entry in [
    ('vector', TgsWorkload.full, null),
    ('lod', TgsWorkload.lod, null),
    ('lod_pingpong', TgsWorkload.lod, 1),
  ]) {
    final scroll = ScrollController();
    late FastLottieRasterCache cache;
    final ready = Completer<void>();
    runApp(
      MaterialApp(
        key: ValueKey('benchmark-${entry.$1}'),
        debugShowCheckedModeBanner: false,
        home: AbsorbPointer(
          child: TgsGallery(
            key: ValueKey(entry.$1),
            store: store,
            catalog: Future.value(assets),
            initialWorkload: entry.$2,
            framesPerStrip: entry.$3,
            scrollController: scroll,
            onRasterCacheCreated: (created) {
              cache = created;
              if (!ready.isCompleted) ready.complete();
            },
          ),
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    await ready.future.timeout(const Duration(seconds: 5));
    await Future<void>.delayed(const Duration(milliseconds: 100));
    if (cache.resolutionScale !=
            (entry.$2 == TgsWorkload.lod ? tgsLodScale : 1) ||
        cache.maximumFrameRate != tgsRasterFrameRate) {
      throw StateError('Benchmark workload changed before measurement');
    }
    final data = <String, dynamic>{
      'max_active': entry.$2 == TgsWorkload.mobile ? 8 : null,
      'max_animation_fps': entry.$2 == TgsWorkload.mobile ? 30 : null,
      'cold_idle': await profile(scroll),
    };
    if (entry.$2 != TgsWorkload.full) {
      await Future<void>.delayed(const Duration(seconds: 12));
      final before = cacheStats(cache);
      data['warm_idle'] = await profile(scroll);
      data['cache_before_warm_measurement'] = before;
      data['cache_after_warm_measurement'] = cacheStats(cache);
      if (cache.resolutionScale != before['resolution_scale']) {
        throw StateError('Benchmark workload changed during measurement');
      }
      data['natural_idle'] = await profile(scroll, forceVsync: false);
      data['scrolling'] = await profile(scroll, scrolling: true);
    }
    modes[entry.$1] = data;
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    scroll.dispose();
  }
  result['modes'] = modes;
  result['warm_extra_decodes'] = store.decodes - assets.length;
  store.dispose();
  return result;
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Use --release');
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('Preparing mobile benchmark…')),
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
