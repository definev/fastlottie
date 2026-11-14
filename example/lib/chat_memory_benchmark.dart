import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/scheduler.dart';
import 'package:path_provider/path_provider.dart';

import 'main.dart';
import 'tgs/cupertino_chat.dart';

/// Local control channel works on macOS and through `adb forward` on Android.
/// Only this separate release target opens the channel.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Memory benchmark requires release/AOT');
  await ensureSimdReady();
  final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 18787);
  final configured = Completer<String>();
  var heroPolicy = 'unbounded';
  final timings = <FrameTiming>[];
  WidgetsBinding.instance.addTimingsCallback(timings.addAll);
  Map<String, Object?> timingSummary() {
    final build = timings.map((t) => t.buildDuration.inMicroseconds).toList()
      ..sort();
    final raster = timings.map((t) => t.rasterDuration.inMicroseconds).toList()
      ..sort();
    final total = timings.map((t) => t.totalSpan.inMicroseconds).toList()
      ..sort();
    int? percentile(List<int> values, double p) =>
        values.isEmpty ? null : values[((values.length - 1) * p).ceil()];
    final budget =
        1000000 /
        WidgetsBinding
            .instance
            .platformDispatcher
            .views
            .first
            .display
            .refreshRate;
    return {
      'frames': timings.length,
      'build_p50_us': percentile(build, .5),
      'build_p95_us': percentile(build, .95),
      'raster_p50_us': percentile(raster, .5),
      'raster_p95_us': percentile(raster, .95),
      'total_span_p95_us': percentile(total, .95),
      'budget_us': budget,
      'over_budget': timings
          .where(
            (t) =>
                t.buildDuration.inMicroseconds > budget ||
                t.rasterDuration.inMicroseconds > budget,
          )
          .length,
    };
  }

  Map<String, Object?>? phaseTiming;
  Completer<void>? acknowledgement;
  String? phase;
  String? error;
  var sequence = 0;
  var done = false;
  ChatMemoryWorkload? workload;
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    error = details.toString();
  };
  PlatformDispatcher.instance.onError = (exception, stack) {
    error = '$exception\n$stack';
    return true;
  };
  server.listen((request) async {
    try {
      if (request.uri.path == '/configure' && !configured.isCompleted) {
        final mode = request.uri.queryParameters['mode'];
        if (!const ['mini-strip', 'ping-pong', 'lottie'].contains(mode)) {
          throw ArgumentError('Unknown mode: $mode');
        }
        heroPolicy = request.uri.queryParameters['hero_cache'] ?? 'unbounded';
        if (!const ['unbounded', 'bounded-12'].contains(heroPolicy)) {
          throw ArgumentError('Unknown hero cache policy: $heroPolicy');
        }
        configured.complete(mode);
      } else if (request.uri.path == '/continue') {
        if (request.uri.queryParameters['sequence'] == '$sequence') {
          final pending = acknowledgement;
          acknowledgement = null;
          pending?.complete();
        }
      }
      request.response.headers.contentType = ContentType.json;
      request.response.write(
        jsonEncode({
          'pid': pid,
          'phase': phase,
          'sequence': sequence,
          'done': done,
          'error': error,
          'telemetry': workload?.snapshot?.call(),
          'hero_cache': heroPolicy,
          'frame_timing': phaseTiming,
        }),
      );
      await request.response.close();
    } catch (exception, stack) {
      error = '$exception\n$stack';
      request.response.statusCode = 500;
      request.response.write(error);
      await request.response.close();
    }
  });
  final mode = await configured.future;
  final temp = await getTemporaryDirectory();
  await temp.create(recursive: true);
  final cache = await temp.createTemp('fastlottie_chat_ram_');
  final raster = await Directory('${cache.path}/raster').create();
  final url = await Directory('${cache.path}/url').create();
  workload = ChatMemoryWorkload(
    mode: mode,
    rasterCachePath: raster.path,
    urlCachePath: url.path,
    checkpoint: (next) async {
      phaseTiming = timingSummary();
      phase = next;
      sequence++;
      final pending = Completer<void>();
      acknowledgement = pending;
      await pending.future.timeout(const Duration(minutes: 2));
      timings.clear();
    },
    onError: (exception) => error = exception.toString(),
    onComplete: () async {
      await cache.delete(recursive: true);
      done = true;
    },
  );
  runApp(
    HeroStickerCacheScope(
      cache: heroPolicy == 'bounded-12'
          ? const FastLottieCache(maximumFrames: 12, maximumCommands: 100000)
          : FastLottieCache.unbounded,
      child: FastLottieCupertinoApp(memoryWorkload: workload),
    ),
  );
}
