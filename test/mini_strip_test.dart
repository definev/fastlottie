import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, render;

void _record(
  FastLottiePlayer player,
  double progress, {
  double size = 64,
  double dpr = 1,
}) {
  final recorder = ui.PictureRecorder();
  player.draw(
    ui.Canvas(recorder),
    ui.Rect.fromLTWH(0, 0, size, size),
    progress,
    devicePixelRatio: dpr,
  );
  recorder.endRecording().dispose();
}

Future<void> _drain(WidgetTester tester, FastLottieRasterCache cache) async {
  for (var i = 0; i < 200 && cache.pendingFrames > 0; i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 5)),
    );
    await tester.pump();
  }
  expect(cache.pendingFrames, 0);
  expect(cache.lastError, isNull);
}

double _mae(Uint8List a, Uint8List b) {
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]).abs();
  }
  return sum / a.length;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets(
    'miniStrip (K=4) reduces IPC/uploads 4x, isolates slots with 1px gutters, swaps O(1) at boundaries, and matches vector output',
    (tester) async {
      final json = fixture('icon')
        ..['op'] = 10; // 10 frames -> 3 strips (4, 4, 2)
      final comp = FastLottieComposition.fromJson(json);
      final total = comp.frameCount;
      expect(total, 10);

      final cache = FastLottieRasterCache.miniStrip(
        stripFrames: 4,
        workerCount: 2,
      );
      expect(cache.strategy, FastLottieRasterStrategy.miniStrip);
      final player = FastLottiePlayer(
        comp,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final vector = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(() {
        player.dispose();
        vector.dispose();
        cache.dispose();
      });

      // Draw frame 0 -> Strip 0 (4 frames: 0..3) rendered in a single IPC dispatch.
      _record(player, 0 / total, size: 64);
      expect(cache.debugWorkerDispatches, 1);
      await _drain(tester, cache);
      expect(cache.debugEntryStripFrames(player), 4);
      // 1 strip height = 4 * 64 + 3 (1px gutters between 4 slots) = 259px.
      expect(cache.gpuBytes, 64 * 259 * 4);
      expect(cache.vectorRasterizedFrames, 4);

      // Draw frame 1 -> intra-strip hit! Triggers lookahead prefetch for Strip 1 (4..7).
      final hitsBefore1 = cache.hits;
      _record(player, 1 / total, size: 64);
      expect(cache.hits, hitsBefore1 + 1);
      await _drain(tester, cache);
      expect(cache.debugWorkerDispatches, 2); // Strip 0 + Strip 1

      // Frames 2 and 3 inside Strip 0 hit directly with 0 extra worker IPC dispatches.
      _record(player, 2 / total, size: 64);
      _record(player, 3 / total, size: 64);
      expect(cache.debugWorkerDispatches, 2);
      expect(cache.hits, hitsBefore1 + 3);

      // Verify visual accuracy for slots inside Strip 0 BEFORE advancing to Strip 1.
      for (final f in [1, 3]) {
        final actual = await tester.runAsync(
          () => render(
            (c) =>
                player.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), f / total),
            size: 64,
          ),
        );
        final expected = await tester.runAsync(
          () => render(
            (c) =>
                vector.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), f / total),
            size: 64,
          ),
        );
        expect(_mae(actual!, expected!), lessThan(1.5));
      }

      // Frame 4 crosses strip boundary -> O(1) swap promotes Strip 1, prefetches Strip 2 (8..9).
      final swapsBefore = cache.pingPongSwaps;
      _record(player, 4 / total, size: 64);
      expect(cache.pingPongSwaps, swapsBefore + 1);
      await _drain(tester, cache);
      expect(cache.debugWorkerDispatches, 3); // Strip 2 prefetched

      // Verify slots inside Strip 1 (5, 7) and Strip 2 (8) match vector output.
      for (final f in [5, 7, 8]) {
        if (f == 8) {
          _record(player, 8 / total, size: 64);
          await _drain(tester, cache);
        }
        final actual = await tester.runAsync(
          () => render(
            (c) =>
                player.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), f / total),
            size: 64,
          ),
        );
        final expected = await tester.runAsync(
          () => render(
            (c) =>
                vector.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), f / total),
            size: 64,
          ),
        );
        expect(_mae(actual!, expected!), lessThan(1.5));
      }

      // Backward seek to frame 1 hits canonical cache, re-populates Strip 0, and renders accurately.
      _record(player, 1 / total, size: 64);
      await _drain(tester, cache);
      final actualSeek = await tester.runAsync(
        () => render(
          (c) =>
              player.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 1 / total),
          size: 64,
        ),
      );
      final expectedSeek = await tester.runAsync(
        () => render(
          (c) =>
              vector.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 1 / total),
          size: 64,
        ),
      );
      expect(_mae(actualSeek!, expectedSeek!), lessThan(1.5));
    },
  );

  testWidgets(
    'miniStrip 1px transparent gutter prevents bilinear FilterQuality.low texture bleeding when scaled',
    (tester) async {
      final json = fixture('many_shapes')..['op'] = 8;
      final comp = FastLottieComposition.fromJson(json);
      final total = comp.frameCount;

      final cache = FastLottieRasterCache.miniStrip(
        stripFrames: 4,
        resolutionScale: .5,
        workerCount: 1,
      );
      final player = FastLottiePlayer(
        comp,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final vector = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(() {
        player.dispose();
        vector.dispose();
        cache.dispose();
      });

      // Warm Strip 0 (0..3) at 64x64 physical (128 logical * 0.5 resolutionScale).
      _record(player, 0 / total, size: 128);
      await _drain(tester, cache);

      for (final f in [0, 1, 2, 3]) {
        final actual = await tester.runAsync(
          () => render(
            (c) => player.draw(
              c,
              const ui.Rect.fromLTWH(0, 0, 128, 128),
              f / total,
            ),
            size: 128,
          ),
        );
        final recorder = ui.PictureRecorder();
        vector.draw(
          ui.Canvas(recorder),
          const ui.Rect.fromLTWH(0, 0, 64, 64),
          f / total,
        );
        final pic = recorder.endRecording();
        final img = (await tester.runAsync(() => pic.toImage(64, 64)))!;
        final expected = await tester.runAsync(
          () => render(
            (c) => c.drawImageRect(
              img,
              const ui.Rect.fromLTWH(0, 0, 64, 64),
              const ui.Rect.fromLTWH(0, 0, 128, 128),
              ui.Paint()..filterQuality = ui.FilterQuality.low,
            ),
            size: 128,
          ),
        );
        img.dispose();
        pic.dispose();
        expect(_mae(actual!, expected!), lessThan(1.5));
      }
    },
  );

  testWidgets(
    'short animation fitting within 1 strip uses 1 VRAM buffer and 0 swaps/IPC across loops',
    (tester) async {
      final json = fixture('icon')..['op'] = 4; // 4 frames <= stripFrames 4
      final comp = FastLottieComposition.fromJson(json);
      final cache = FastLottieRasterCache.miniStrip(
        stripFrames: 4,
        workerCount: 1,
      );
      final player = FastLottiePlayer(comp, rasterCache: cache);
      addTearDown(() {
        player.dispose();
        cache.dispose();
      });

      _record(player, 0, size: 48);
      await _drain(tester, cache);

      final stripBytes = 48 * (4 * 48 + 3) * 4;
      expect(cache.reservedBytes, stripBytes);
      expect(cache.gpuBytes, stripBytes);
      final dispatchesAfterWarm = cache.debugWorkerDispatches;

      // Loop 3 full cycles -> 0 swaps, 0 extra worker dispatches, 100% cache hits.
      for (var loop = 0; loop < 3; loop++) {
        for (var f = 0; f < comp.frameCount; f++) {
          _record(player, f / comp.frameCount, size: 48);
          await _drain(tester, cache);
        }
      }
      expect(cache.debugWorkerDispatches, dispatchesAfterWarm);
      expect(cache.pingPongSwaps, 0);
    },
  );

  testWidgets(
    'adaptive miniStrip chooses K by resolution and shrinks K cleanly to fit tight VRAM budgets',
    (tester) async {
      final json = fixture('icon')..['op'] = 12;
      final comp = FastLottieComposition.fromJson(json);

      // Generous budget at 64x64 -> picks adaptive K = 4.
      final generous = FastLottieRasterCache.miniStrip(workerCount: 1);
      final p1 = FastLottiePlayer(comp, rasterCache: generous);
      _record(p1, 0, size: 64);
      expect(generous.debugEntryStripFrames(p1), 4);
      await _drain(tester, generous);
      p1.dispose();
      generous.dispose();

      // Tight budget (enough for 2 strips of K=2, not K=4) -> scales down to K = 2 instead of rejecting.
      const single64 = 64 * 64 * 4;
      const twoStrip2Bytes = 64 * (2 * 64 + 1) * 4 * 2;
      final tight = FastLottieRasterCache.miniStrip(
        maximumBytes: twoStrip2Bytes + single64,
        workerCount: 1,
      );
      final p2 = FastLottiePlayer(comp, rasterCache: tight);
      _record(p2, 0, size: 64);
      expect(tight.debugEntryStripFrames(p2), 2);
      await _drain(tester, tight);
      p2.dispose();
      tight.dispose();
    },
  );

  testWidgets(
    'miniStrip shares canonical .flcache slots with single-frame pingPong across sessions',
    (tester) async {
      final tempDir = Directory.systemTemp.createTempSync(
        'fastlottie_strip_disk_',
      );
      addTearDown(() {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      });

      final json = fixture('icon')..['op'] = 8;
      final comp1 = FastLottieComposition.fromJson(json);

      // Session 1: Mini-Strip renders all 8 frames in 2 strips -> writes 8 slots to .flcache.
      final cache1 = FastLottieRasterCache.miniStrip(
        stripFrames: 4,
        diskCacheDirectory: tempDir.path,
        workerCount: 1,
      );
      final p1 = FastLottiePlayer(comp1, rasterCache: cache1);
      for (var f = 0; f < comp1.frameCount; f++) {
        _record(p1, f / comp1.frameCount, size: 48);
        await _drain(tester, cache1);
      }
      expect(cache1.diskBytes, greaterThan(0));
      p1.dispose();
      cache1.dispose();

      // Session 2: classic pingPong (K=1) reads from the same .flcache with 0 vector renders.
      final comp2 = FastLottieComposition.fromJson(json);
      final cache2 = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        workerCount: 1,
      );
      final p2 = FastLottiePlayer(comp2, rasterCache: cache2);
      addTearDown(() {
        p2.dispose();
        cache2.dispose();
      });

      for (var f = 0; f < comp2.frameCount; f++) {
        _record(p2, f / comp2.frameCount, size: 48);
        await _drain(tester, cache2);
      }
      expect(cache2.vectorRasterizedFrames, 0);
      expect(
        cache2.compressedCacheHits,
        greaterThanOrEqualTo(comp2.frameCount),
      );
    },
  );

  testWidgets(
    'tight budget dynamically demotes active K=4 strips (both warm and in-flight) to fit concurrent working set',
    (tester) async {
      // 12 distinct 12+ frame clips at 32x32:
      // - At K=1 (ping-pong): 2 * 32*32*4 = 8 KiB per entry -> 12 entries = 96 KiB.
      // - At K=4 (mini-strip): 2 * 32*(4*32+3)*4 = 33,536 B -> only 3 fit in 104 KiB without demotion.
      const k1Weight = 32 * 32 * 4 * 2;
      const budget = k1Weight * 13;

      List<FastLottiePlayer> makePlayers(FastLottieRasterCache c) => [
        for (var i = 0; i < 12; i++)
          FastLottiePlayer(
            FastLottieComposition.fromJson(
              fixture('icon')
                ..['op'] = 12 + i
                ..['layers'][0]['shapes'][0]['it'][1]['c'] = {
                  'a': 0,
                  'k': [(i % 5) / 5.0, i / 12.0, 0.85, 1.0],
                },
            ),
            rasterCache: c,
            cache: FastLottieCache.none,
          ),
      ];

      // Scenario A: Warm first 3 at K=4, then 9 more pinned players force warm demotion.
      final warmCache = FastLottieRasterCache.miniStrip(
        maximumBytes: budget,
        workerCount: 2,
      );
      final warmPlayers = makePlayers(warmCache);
      addTearDown(() {
        for (final p in warmPlayers) {
          p.dispose();
        }
        warmCache.dispose();
      });

      for (var i = 0; i < 3; i++) {
        _record(warmPlayers[i], 0, size: 32);
      }
      await _drain(tester, warmCache);
      for (var i = 0; i < 3; i++) {
        expect(warmCache.debugEntryStripFrames(warmPlayers[i]), 4);
      }
      expect(warmCache.gpuBytes, lessThanOrEqualTo(warmCache.reservedBytes));
      expect(warmCache.reservedBytes, lessThanOrEqualTo(budget));

      for (var i = 3; i < 12; i++) {
        _record(warmPlayers[i], 0, size: 32);
        expect(warmCache.gpuBytes, lessThanOrEqualTo(warmCache.reservedBytes));
        expect(warmCache.reservedBytes, lessThanOrEqualTo(budget));
      }
      await _drain(tester, warmCache);
      expect(warmCache.lastError, isNull);
      expect(warmCache.entries, 12);
      expect(warmCache.gpuBytes, lessThanOrEqualTo(warmCache.reservedBytes));
      expect(warmCache.reservedBytes, lessThanOrEqualTo(budget));

      // Every player renders accurate pixels after demotion.
      for (var i = 0; i < 12; i++) {
        final p = warmPlayers[i];
        final frame = 1 / p.composition.frameCount;
        _record(p, frame, size: 32);
        await _drain(tester, warmCache);
        final vector = FastLottiePlayer(
          p.composition,
          cache: FastLottieCache.none,
        );
        final actual = await tester.runAsync(
          () => render(
            (c) => p.draw(c, const ui.Rect.fromLTWH(0, 0, 32, 32), frame),
            size: 32,
          ),
        );
        final expected = await tester.runAsync(
          () => render(
            (c) => vector.draw(c, const ui.Rect.fromLTWH(0, 0, 32, 32), frame),
            size: 32,
          ),
        );
        vector.dispose();
        expect(_mae(actual!, expected!), lessThan(1.5));
      }

      // Scenario B: All 12 players burst synchronously in Frame 0 while strips are still in flight.
      final burstCache = FastLottieRasterCache.miniStrip(
        maximumBytes: budget,
        workerCount: 2,
      );
      final burstPlayers = makePlayers(burstCache);
      addTearDown(() {
        for (final p in burstPlayers) {
          p.dispose();
        }
        burstCache.dispose();
      });

      for (final p in burstPlayers) {
        _record(p, 0, size: 32);
        expect(
          burstCache.gpuBytes,
          lessThanOrEqualTo(burstCache.reservedBytes),
        );
        expect(burstCache.reservedBytes, lessThanOrEqualTo(budget));
      }
      await _drain(tester, burstCache);
      expect(burstCache.lastError, isNull);
      expect(burstCache.entries, 12);
      expect(burstCache.gpuBytes, lessThanOrEqualTo(burstCache.reservedBytes));
      expect(burstCache.reservedBytes, lessThanOrEqualTo(budget));
    },
  );

  testWidgets('demoting a partial front strip leaves room for the next strip', (
    tester,
  ) async {
    // One K=4 entry fits initially. Three pinned entries can fit only after
    // the first entry drops to K=2 and the others use K=1.
    const budget = 32 * (4 * 32 + 3) * 4 * 2;
    final cache = FastLottieRasterCache.miniStrip(
      maximumBytes: budget,
      workerCount: 1,
    );
    final players = [
      for (final frames in [11, 12, 13])
        FastLottiePlayer(
          FastLottieComposition.fromJson(fixture('icon')..['op'] = frames),
          rasterCache: cache,
        ),
    ];
    addTearDown(() {
      for (final player in players) {
        player.dispose();
      }
      cache.dispose();
    });
    final first = players.first;

    // Warm the three-frame tail (8–10) before admitting the other clips.
    _record(first, 8 / 11, size: 32);
    await _drain(tester, cache);
    expect(cache.debugEntryStripFrames(first), 4);

    for (final player in players.skip(1)) {
      _record(player, 0, size: 32);
    }
    await _drain(tester, cache);
    expect(cache.entries, 3);
    expect(cache.debugEntryStripFrames(first), 2);

    // Advance each clip so both buffers are used.
    _record(first, 9 / 11, size: 32);
    for (final player in players.skip(1)) {
      _record(player, 1 / player.composition.frameCount, size: 32);
    }
    await _drain(tester, cache);
    expect(cache.gpuBytes, lessThanOrEqualTo(cache.reservedBytes));
    expect(cache.reservedBytes, lessThanOrEqualTo(budget));
  });

  testWidgets('FastLottie default pipeline uses adaptive miniStrip strategy', (
    tester,
  ) async {
    final comp = FastLottieComposition.fromJson(fixture('icon'));
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: FastLottie(composition: comp, width: 64, height: 64),
      ),
    );

    final shared = FastLottieRasterCache.debugSharedDefaultCache;
    expect(shared, isNotNull);
    expect(shared!.strategy, FastLottieRasterStrategy.miniStrip);

    await tester.pump(const Duration(milliseconds: 16));
    await tester.pumpWidget(const SizedBox());
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 20)),
    );
    expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'worker survives large-to-small resolution transitions, scene-limit eviction retry, and cache.clear()',
    (tester) async {
      // Render one large animation with dynamic gradient + trim/matte paths ('features' at 512x512),
      // then drive >64 distinct compositions on 1 worker so maxWorkerScenes (64) evicts and
      // re-registers cleanly via _repSceneMissing, plus >16 small 48x48 dispatches to exercise trimming.
      final cache = FastLottieRasterCache.miniStrip(
        maximumBytes: 64 * 1024 * 1024,
        workerCount: 1,
      );
      addTearDown(cache.dispose);

      final features = FastLottieComposition.fromJson(
        fixture('features')..['op'] = 12,
      );
      final largePlayer = FastLottiePlayer(
        features,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      _record(largePlayer, 0.25, size: 512);
      await _drain(tester, cache);
      largePlayer.dispose();

      final smallPlayers = <FastLottiePlayer>[];
      for (var i = 0; i < 70; i++) {
        final json = fixture('icon')
          ..['op'] = 8
          ..['layers'][0]['shapes'][0]['it'][1]['c'] = {
            'a': 0,
            'k': [(i % 10) / 10.0, ((i ~/ 10) % 10) / 10.0, 0.75, 1.0],
          };
        final p = FastLottiePlayer(
          FastLottieComposition.fromJson(json),
          rasterCache: cache,
          cache: FastLottieCache.none,
        );
        smallPlayers.add(p);
        _record(p, 0.0, size: 48);
        await _drain(tester, cache);
      }
      addTearDown(() {
        for (final p in smallPlayers) {
          p.dispose();
        }
      });

      expect(cache.debugRegisteredWorkerScenes, lessThanOrEqualTo(64));

      // The first small player was evicted. Revisiting it must re-register
      // the scene and render without growing the host's registration table.
      _record(smallPlayers.first, 4 / 8, size: 48);
      await _drain(tester, cache);
      expect(cache.lastError, isNull);

      // Verify features accuracy matches vector after scratch shrinking & gradient reuse.
      final featuresCheck = FastLottiePlayer(
        features,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final vector = FastLottiePlayer(features, cache: FastLottieCache.none);
      addTearDown(() {
        featuresCheck.dispose();
        vector.dispose();
      });

      _record(featuresCheck, 0.25, size: 48);
      await _drain(tester, cache);
      final actual = await tester.runAsync(
        () => render(
          (c) =>
              featuresCheck.draw(c, const ui.Rect.fromLTWH(0, 0, 48, 48), 0.25),
          size: 48,
        ),
      );
      final expected = await tester.runAsync(
        () => render(
          (c) => vector.draw(c, const ui.Rect.fromLTWH(0, 0, 48, 48), 0.25),
          size: 48,
        ),
      );
      expect(_mae(actual!, expected!), lessThan(1.5));

      // clear() triggers _opClearMem (clearing worker RAM, open files, scenes, scratch)
      // and subsequent draw cleanly re-registers and renders.
      cache.clear();
      _record(featuresCheck, 0.5, size: 48);
      await _drain(tester, cache);
      expect(cache.lastError, isNull);
      expect(cache.bytes, greaterThan(0));
    },
  );
}
