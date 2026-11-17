// ignore_for_file: avoid_print
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

const _variant = String.fromEnvironment(
  'QUEUE_VARIANT',
  defaultValue: 'candidate',
);
const _denseOnly = bool.fromEnvironment('DENSE_ONLY');
const _denseWorkers = int.fromEnvironment('DENSE_WORKERS', defaultValue: 4);
const _denseInFlight = int.fromEnvironment('DENSE_IN_FLIGHT', defaultValue: 8);
const _denseStripFrames = int.fromEnvironment(
  'DENSE_STRIP_FRAMES',
  defaultValue: 4,
);
const _denseProgressive = bool.fromEnvironment(
  'DENSE_PROGRESSIVE',
  defaultValue: true,
);
const _ids = [
  '1f9cb',
  '1f41c',
  '1f426_200d_1f525',
  '1f393',
  '1f30b',
  '1f345',
  '1f389',
  '1f52e',
  '1f525',
  '1f305',
  '1f31f',
  '1f342',
  '1f388',
  '1f426',
  '1f32a_fe0f',
  '1f30e',
  '1f60a',
  '1f680',
  '1f600',
  '1f602',
  '1f604',
  '1f60d',
  '1f618',
  '1f970',
];

int? _cpuTicks() {
  if (!Platform.isAndroid && !Platform.isLinux) return null;
  final stat = File('/proc/self/stat')
      .readAsStringSync()
      .split(') ')
      .last
      .split(' ');
  return int.parse(stat[11]) + int.parse(stat[12]);
}

void _draw(FastLottiePlayer player, double progress) {
  final recorder = ui.PictureRecorder();
  player.draw(
    ui.Canvas(recorder),
    const ui.Rect.fromLTWH(0, 0, 128, 128),
    progress,
    coldFallback: (_, _) {},
  );
  recorder.endRecording().dispose();
}

Future<void> _drain(FastLottieRasterCache cache) async {
  final deadline = Stopwatch()..start();
  while (cache.pendingFrames > 0 && deadline.elapsed.inSeconds < 20) {
    await Future<void>.delayed(const Duration(milliseconds: 1));
  }
  if (cache.lastError != null) throw StateError('${cache.lastError}');
  if (cache.pendingFrames > 0) throw StateError('Worker queue timed out');
}

double _percentile(List<int> samples, double percentile) {
  final sorted = samples.toList()..sort();
  return sorted[(sorted.length * percentile).ceil() - 1] / 1000;
}

Future<Map<String, Object>> _burst(
  List<FastLottieComposition> compositions,
) async {
  final cache = FastLottieRasterCache.miniStrip(
    workerCount: 4,
    maximumInFlight: 8,
    stripFrames: 4,
    progressiveFirstFrame: const bool.fromEnvironment(
      'PROGRESSIVE_FIRST_FRAME',
    ),
    maximumBytes: 48 * 1024 * 1024,
    maximumDiskBytes: 0,
  );
  final players = [
    for (final composition in compositions)
      FastLottiePlayer(
        composition,
        rasterCache: cache,
        cache: FastLottieCache.none,
      ),
  ];
  try {
    final rssBefore = ProcessInfo.currentRss;
    final cpuBefore = _cpuTicks();
    final watch = Stopwatch()..start();
    final firstImages = <int>[];
    final firstRequests = <FastLottiePlayer, int>{};
    final ready = <FastLottiePlayer>{};
    for (final player in players) {
      player.addListener(() {
        final started = firstRequests[player];
        if (started != null && player.rasterBytes > 0 && ready.add(player)) {
          firstImages.add(watch.elapsedMicroseconds - started);
        }
      });
      firstRequests[player] = watch.elapsedMicroseconds;
      _draw(player, 0);
    }
    final initialDispatches = cache.workerDispatches;
    // Simulate a viewport change before workers have returned any results.
    for (final player in players.take(16)) {
      firstRequests.remove(player);
      player.dispose();
    }
    await _drain(cache);
    if (firstImages.length != 8) {
      throw StateError('Only ${firstImages.length}/8 images ready');
    }
    return {
      'first_image_p50_ms': _percentile(firstImages, .5),
      'first_image_p95_ms': _percentile(firstImages, .95),
      'drain_ms': watch.elapsedMicroseconds / 1000,
      'initial_dispatches': initialDispatches,
      'dispatches': cache.workerDispatches,
      'vector_frames': cache.vectorRasterizedFrames,
      'compressed_hits': cache.compressedCacheHits,
      'first_image_samples_us': firstImages,
      'rss_before_bytes': rssBefore,
      'rss_after_bytes': ProcessInfo.currentRss,
      if (cpuBefore != null) 'cpu_ticks': _cpuTicks()! - cpuBefore,
    };
  } finally {
    for (final player in players) {
      player.dispose();
    }
    cache.dispose();
  }
}

// These eight tiles are mounted together and fit in the visible benchmark
// viewport. Start at layout and stop after the first successful raster draw
// into the on-screen canvas. This is not a GPU presentation timestamp.
Future<Map<String, Object>> _visibleBurst(
  List<FastLottieComposition> scenes,
  bool progressive,
) async {
  final cache = FastLottieRasterCache.miniStrip(
    stripFrames: 4,
    workerCount: 4,
    maximumDiskBytes: 0,
    progressiveFirstFrame: progressive,
  );
  final players = [
    for (final scene in scenes.take(8))
      FastLottiePlayer(scene, rasterCache: cache),
  ];
  final clock = Stopwatch()..start();
  final painted = Completer<void>();
  final samples = <int>[];
  final cpuBefore = _cpuTicks();
  final starts = <FastLottiePlayer, int>{};
  final reported = <FastLottiePlayer>{};
  try {
    runApp(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: SizedBox(
            width: 192,
            height: 96,
            child: Wrap(
              children: [
                for (final player in players)
                  SizedBox(
                    width: 48,
                    height: 48,
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        starts.putIfAbsent(
                          player,
                          () => clock.elapsedMicroseconds,
                        );
                        return CustomPaint(
                          painter: _FirstRasterPaint(player, () {
                            if (!reported.add(player)) return;
                            samples.add(
                              clock.elapsedMicroseconds - starts[player]!,
                            );
                            if (samples.length == players.length) {
                              painted.complete();
                            }
                          }),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
    await painted.future.timeout(const Duration(seconds: 30));
    return {
      'first_raster_paint_p95_ms': _percentile(samples, .95),
      'paint_samples_us': samples,
      'vector_frames': cache.vectorRasterizedFrames,
      'gpu_bytes': cache.gpuBytes,
      'progressive': progressive,
      if (cpuBefore != null) 'cpu_ticks': _cpuTicks()! - cpuBefore,
    };
  } finally {
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    for (final player in players) {
      player.dispose();
    }
    cache.dispose();
  }
}

class _FirstRasterPaint extends CustomPainter {
  _FirstRasterPaint(this.player, this.report) : super(repaint: player);
  final FastLottiePlayer player;
  final VoidCallback report;
  @override
  void paint(Canvas canvas, Size size) {
    var fallback = false;
    player.draw(
      canvas,
      Offset.zero & size,
      0,
      devicePixelRatio: 2,
      coldFallback: (_, _) {
        fallback = true;
      },
    );
    if (!fallback && player.rasterBytes > 0) report();
  }

  @override
  bool shouldRepaint(_FirstRasterPaint old) => old.player != player;
}

Future<Map<String, Object>> _playback(
  List<FastLottieComposition> compositions, {
  required bool progressive,
}) async {
  final cache = FastLottieRasterCache.miniStrip(
    workerCount: 4,
    maximumInFlight: 8,
    stripFrames: 4,
    progressiveFirstFrame: progressive,
    maximumBytes: 48 * 1024 * 1024,
    maximumDiskBytes: 0,
    maximumFrameRate: 30,
  );
  final players = [
    for (final composition in compositions.take(16))
      FastLottiePlayer(
        composition,
        rasterCache: cache,
        cache: FastLottieCache.none,
      ),
  ];
  try {
    for (final player in players) {
      _draw(player, 0);
    }
    await _drain(cache);
    final cpuBefore = _cpuTicks();
    final watch = Stopwatch()..start();
    var lateTicks = 0, hits = cache.hits, misses = cache.misses;
    // Absolute deadlines avoid reducing offered load when the pipeline is slow.
    for (var tick = 1; tick <= 180; tick++) {
      final due = tick * 1000000 ~/ 30;
      final remaining = due - watch.elapsedMicroseconds;
      if (remaining > 0) {
        await Future<void>.delayed(Duration(microseconds: remaining));
      }
      if (watch.elapsedMicroseconds - due > 16000) lateTicks++;
      for (final player in players) {
        final duration =
            (player.composition.endFrame - player.composition.startFrame) /
            player.composition.frameRate;
        _draw(player, (tick / 30 % duration) / duration);
      }
    }
    hits = cache.hits - hits;
    misses = cache.misses - misses;
    await _drain(cache);
    return {
      'progressive': progressive,
      'duration_ms': watch.elapsedMicroseconds / 1000,
      'lookups': hits + misses,
      'hits': hits,
      'misses': misses,
      'hit_fraction': hits / math.max(1, hits + misses),
      'dispatches': cache.workerDispatches,
      'vector_frames': cache.vectorRasterizedFrames,
      'compressed_hits': cache.compressedCacheHits,
      'late_ticks': lateTicks,
      if (cpuBefore != null) 'cpu_ticks': _cpuTicks()! - cpuBefore,
    };
  } finally {
    for (final player in players) {
      player.dispose();
    }
    cache.dispose();
  }
}

// Reproduces a dense sticker sheet without involving widget layout. Sixty
// independent loops share one worker pool, start in staggered strip phases and
// request the wall-clock sample at 30 FPS. This records draws into an offscreen
// PictureRecorder, not physical display presentation timestamps.
Future<Map<String, Object>> _densePlayback(
  List<FastLottieComposition> compositions,
) async {
  const playerCount = 60, sampleHz = 30, seconds = 6;
  final cache = FastLottieRasterCache.miniStrip(
    workerCount: _denseWorkers,
    maximumInFlight: _denseInFlight,
    stripFrames: _denseStripFrames,
    progressiveFirstFrame: _denseProgressive,
    maximumBytes: 48 * 1024 * 1024,
    maximumDiskBytes: 0,
    maximumFrameRate: sampleHz.toDouble(),
  );
  final players = [
    for (var i = 0; i < playerCount; i++)
      FastLottiePlayer(
        compositions[i % compositions.length],
        rasterCache: cache,
        cache: FastLottieCache.none,
        maximumFrameRate: sampleHz.toDouble(),
      ),
  ];
  try {
    for (var i = 0; i < players.length; i++) {
      final player = players[i];
      final total = player.composition.frameCount;
      final sourceStep = math.max(1.0, player.composition.frameRate / sampleHz);
      _draw(player, (i % _denseStripFrames) * sourceStep / total);
    }
    await _drain(cache);
    final cpuBefore = _cpuTicks();
    final renderMicrosBefore = cache.workerRenderMicros;
    final transferBytesBefore = cache.isolateTransferBytes;
    final watch = Stopwatch()..start();
    var lateTicks = 0, hits = cache.hits, misses = cache.misses;
    for (var tick = 1; tick <= sampleHz * seconds; tick++) {
      final due = tick * 1000000 ~/ sampleHz;
      final remaining = due - watch.elapsedMicroseconds;
      if (remaining > 0) {
        await Future<void>.delayed(Duration(microseconds: remaining));
      }
      if (watch.elapsedMicroseconds - due > 16000) lateTicks++;
      final elapsedSeconds = watch.elapsedMicroseconds / 1000000;
      for (var i = 0; i < players.length; i++) {
        final player = players[i];
        final duration =
            (player.composition.endFrame - player.composition.startFrame) /
            player.composition.frameRate;
        _draw(
          player,
          ((elapsedSeconds + (i % _denseStripFrames) / sampleHz) % duration) /
              duration,
        );
      }
    }
    hits = cache.hits - hits;
    misses = cache.misses - misses;
    await _drain(cache);
    return {
      'players': playerCount,
      'unique_entries': cache.entries,
      'sample_rate': sampleHz,
      'workers': _denseWorkers,
      'maximum_in_flight': _denseInFlight,
      'strip_frames': _denseStripFrames,
      'progressive': _denseProgressive,
      'duration_ms': watch.elapsedMicroseconds / 1000,
      'lookups': hits + misses,
      'hits': hits,
      'misses': misses,
      'hit_fraction': hits / math.max(1, hits + misses),
      'dispatches': cache.workerDispatches,
      'vector_frames': cache.vectorRasterizedFrames,
      'late_ticks': lateTicks,
      'worker_render_us': cache.workerRenderMicros - renderMicrosBefore,
      'isolate_transfer_bytes':
          cache.isolateTransferBytes - transferBytesBefore,
      'decode_image_p95_us': cache.decodeImageP95Micros,
      if (cpuBefore != null) 'cpu_ticks': _cpuTicks()! - cpuBefore,
    };
  } finally {
    for (final player in players) {
      player.dispose();
    }
    cache.dispose();
  }
}

Future<List<FastLottieComposition>> _loadDenseCompositions() async {
  final paths = (await AssetManifest.loadFromAssetBundle(rootBundle))
      .listAssets()
      .where(
        (asset) =>
            asset.startsWith('assets/tgs/NotoEmoji/') && asset.endsWith('.tgs'),
      );
  final compositions = <FastLottieComposition>[];
  final contentKeys = <String>{};
  for (final asset in paths) {
    final data = await rootBundle.load(asset);
    final composition = FastLottieComposition.fromBytes(
      data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
    );
    if (!contentKeys.add(composition.contentKey)) continue;
    compositions.add(composition);
    if (compositions.length == 60) return compositions;
  }
  throw StateError('Dense benchmark needs 60 unique compositions');
}

Future<void> _run() async {
  if (_denseOnly) {
    print(
      'FASTLOTTIE_QUEUE_SAMPLE:${jsonEncode({'variant': _variant, 'kind': 'dense_playback', ...await _densePlayback(await _loadDenseCompositions())})}',
    );
    return;
  }
  final compositions = <FastLottieComposition>[];
  final assetPaths = _ids.map((id) => 'assets/tgs/NotoEmoji/emoji_u$id.tgs');
  for (final asset in assetPaths) {
    final data = await rootBundle.load(asset);
    compositions.add(
      FastLottieComposition.fromBytes(
        data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
      ),
    );
  }
  for (var pass = 0; pass < 4; pass++) {
    for (final progressive in pass.isEven ? [false, true] : [true, false]) {
      final sample = await _visibleBurst(compositions, progressive);
      print(
        'FASTLOTTIE_VISIBLE_SAMPLE:${jsonEncode({'pass': pass, ...sample})}',
      );
    }
  }
  for (var pass = 0; pass < 6; pass++) {
    print(
      'FASTLOTTIE_QUEUE_SAMPLE:${jsonEncode({'variant': _variant, 'kind': 'burst', 'pass': pass + 1, ...await _burst(compositions)})}',
    );
  }
  for (final progressive in [false, true, true, false]) {
    print(
      'FASTLOTTIE_QUEUE_SAMPLE:${jsonEncode({'variant': _variant, 'kind': 'playback', ...await _playback(compositions, progressive: progressive)})}',
    );
  }
  print(
    'FASTLOTTIE_QUEUE_SAMPLE:${jsonEncode({'variant': _variant, 'kind': 'dense_playback', ...await _densePlayback(await _loadDenseCompositions())})}',
  );
  print(
    'FASTLOTTIE_QUEUE_DONE:${jsonEncode({'variant': _variant, 'release': kReleaseMode, 'native': isSimdSupported})}',
  );
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('FastLottie worker queue benchmark')),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      await _run();
    } catch (error, stack) {
      print('FASTLOTTIE_QUEUE_ERROR:$error\n$stack');
    }
  });
}
