import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:path_provider/path_provider.dart';

import 'main.dart';
import 'tgs/cupertino_chat.dart';

/// Release-only, self-driving iPhone workload with Instruments signposts.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Instruments benchmark requires release');
  await ensureSimdReady();
  const channel = MethodChannel('fastlottie/instruments');
  final configuration = (await channel.invokeMapMethod<String, dynamic>(
    'configuration',
  ))!;
  final mode = configuration['mode'] as String;
  final dwell = configuration['dwell_seconds'] as int;
  final startup = configuration['startup_seconds'] as int;
  if (!['mini-strip', 'ping-pong', 'lottie'].contains(mode)) {
    throw ArgumentError('Unknown renderer $mode');
  }
  if (dwell < 1 || startup < 0) throw ArgumentError('Invalid benchmark timing');
  final documents = await getApplicationDocumentsDirectory();
  final output = File('${documents.path}/instruments-$mode.json');
  final cache = await (await getTemporaryDirectory()).createTemp(
    'instruments_',
  );
  final raster = await Directory('${cache.path}/raster').create();
  final source = await Directory('${cache.path}/source').create();
  final clock = Stopwatch()..start();
  final records = <Map<String, dynamic>>[];
  ChatMemoryWorkload? workload;
  Future<void> record(String event, String phase) async {
    final state = await channel.invokeMapMethod<String, dynamic>('state');
    records.add({
      'event': event,
      'phase': phase,
      'elapsed_seconds': clock.elapsedMicroseconds / 1e6,
      'utc': DateTime.now().toUtc().toIso8601String(),
      ...?state,
      if (event != 'sample') 'telemetry': workload?.snapshot?.call(),
    });
    await output.writeAsString(
      jsonEncode({'configuration': configuration, 'records': records}),
    );
    if (event != 'sample') debugPrint('INSTRUMENTS $event $phase');
  }

  var scrollNumber = 0;
  var scrollPhase = '';
  workload = ChatMemoryWorkload(
    mode: mode,
    rasterCachePath: raster.path,
    urlCachePath: source.path,
    onScroll: (active) async {
      if (active) {
        scrollPhase = 'scroll_${++scrollNumber}';
        await channel.invokeMethod<void>('begin', scrollPhase);
        await record('begin', scrollPhase);
      } else {
        await record('end', scrollPhase);
        await channel.invokeMethod<void>('end', scrollPhase);
      }
    },
    checkpoint: (phase) async {
      await channel.invokeMethod<void>('begin', phase);
      await record('begin', phase);
      for (var i = 0; i < dwell; i++) {
        await Future<void>.delayed(const Duration(seconds: 1));
        await record('sample', phase);
      }
      await record('end', phase);
      await channel.invokeMethod<void>('end', phase);
    },
    onError: (error) {
      unawaited(
        record(
          'error',
          error.toString(),
        ).whenComplete(() => channel.invokeMethod<void>('finished')),
      );
    },
    onComplete: () async {
      await record('complete', 'workload');
      await cache.delete(recursive: true);
      await channel.invokeMethod<void>('finished');
    },
  );
  runApp(const SizedBox.shrink());
  await record('ready', 'startup');
  await Future<void>.delayed(Duration(seconds: startup));
  runApp(FastLottieCupertinoApp(memoryWorkload: workload));
}
