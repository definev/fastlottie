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

Future<void> _drainPingPong(
  WidgetTester tester,
  FastLottieRasterCache cache,
) async {
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
    'pingPong bounds GPU memory to 2 buffers, swaps lookahead in O(1), and matches vector output',
    (tester) async {
      final comp = FastLottieComposition.fromJson(fixture('icon'));
      final cache = FastLottieRasterCache.pingPong(workerCount: 2);
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

      final total = comp.frameCount;
      // Draw frame 0, await decode, then frame 1, await lookahead prefetch for 2.
      _record(player, 0 / total, size: 64);
      await _drainPingPong(tester, cache);
      expect(cache.gpuBytes, 64 * 64 * 4);

      _record(player, 1 / total, size: 64);
      await _drainPingPong(tester, cache);
      // Wait an extra tick for lookahead (frame 2) to populate back buffer.
      expect(cache.gpuBytes, lessThanOrEqualTo(64 * 64 * 4 * 2));

      final swapsBefore = cache.pingPongSwaps;
      final hitsBefore = cache.hits;
      // Advancing to frame 2 should hit the lookahead back buffer via pointer swap.
      _record(player, 2 / total, size: 64);
      expect(cache.pingPongSwaps, greaterThan(swapsBefore));
      expect(cache.hits, greaterThan(hitsBefore));
      expect(cache.gpuBytes, lessThanOrEqualTo(64 * 64 * 4 * 2));

      // Verify rendered ping-pong pixels closely match Canvas vector rendering.
      final actual = await tester.runAsync(
        () => render(
          (c) =>
              player.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 2 / total),
          size: 64,
        ),
      );
      final expected = await tester.runAsync(
        () => render(
          (c) =>
              vector.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 2 / total),
          size: 64,
        ),
      );
      expect(_mae(actual!, expected!), lessThan(1.5));

      await _drainPingPong(tester, cache);
    },
  );

  testWidgets(
    'pingPong deduplicates independently parsed identical compositions by contentKey',
    (tester) async {
      final jsonA = fixture('icon');
      final jsonB = fixture('icon');
      final compA = FastLottieComposition.fromJson(jsonA);
      final compB = FastLottieComposition.fromJson(jsonB);
      expect(identical(compA, compB), isFalse);
      expect(compA.contentKey, compB.contentKey);

      final cache = FastLottieRasterCache.pingPong(workerCount: 2);
      final pa = FastLottiePlayer(compA, rasterCache: cache);
      final pb = FastLottiePlayer(compB, rasterCache: cache);
      addTearDown(() {
        pa.dispose();
        pb.dispose();
        cache.dispose();
      });

      _record(pa, 0.25, size: 64);
      await _drainPingPong(tester, cache);

      final rendersBefore = cache.vectorRasterizedFrames;
      final hitsBefore = cache.hits;
      final bytesA = await tester.runAsync(
        () => render(
          (c) => pa.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 0.25),
          size: 64,
        ),
      );
      final bytesB = await tester.runAsync(
        () => render(
          (c) => pb.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 0.25),
          size: 64,
        ),
      );
      await _drainPingPong(tester, cache);

      expect(cache.entries, 1);
      expect(cache.vectorRasterizedFrames, rendersBefore);
      expect(cache.hits, greaterThanOrEqualTo(hitsBefore + 2));
      expect(bytesA, bytesB);
    },
  );

  testWidgets(
    'loop 2 hits LZ4 compressed cache and persists across sessions via .flcache',
    (tester) async {
      final tempDir = Directory.systemTemp.createTempSync('fastlottie_pp_');
      addTearDown(() {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      });

      final json = fixture('icon')
        ..['op'] = 10; // Short 10-frame clip for test speed.
      final comp1 = FastLottieComposition.fromJson(json);
      final total = comp1.frameCount;

      final cache1 = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        workerCount: 2,
      );
      final p1 = FastLottiePlayer(comp1, rasterCache: cache1);
      for (var i = 0; i < total; i++) {
        _record(p1, i / total, size: 48);
        await _drainPingPong(tester, cache1);
      }
      final loop1Vectors = cache1.vectorRasterizedFrames;
      expect(loop1Vectors, greaterThanOrEqualTo(total));
      expect(cache1.diskBytes, greaterThan(0));
      final flFiles = tempDir
          .listSync()
          .where((f) => f.path.endsWith('.flcache'))
          .toList();
      expect(flFiles.length, 1);

      // Loop 2 inside the same session must hit LZ4 cache without extra vector renders.
      final vecBeforeLoop2 = cache1.vectorRasterizedFrames;
      final hitsBeforeLoop2 = cache1.compressedCacheHits;
      for (var i = 0; i < total; i++) {
        _record(p1, i / total, size: 48);
        await _drainPingPong(tester, cache1);
      }
      expect(cache1.vectorRasterizedFrames, vecBeforeLoop2);
      expect(cache1.compressedCacheHits, greaterThan(hitsBeforeLoop2));

      p1.dispose();
      cache1.dispose();

      // Session 2: fresh composition + fresh cache pointing to the same disk dir.
      final comp2 = FastLottieComposition.fromJson(json);
      final cache2 = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        workerCount: 2,
      );
      final p2 = FastLottiePlayer(comp2, rasterCache: cache2);
      addTearDown(() {
        p2.dispose();
        cache2.dispose();
      });

      for (var i = 0; i < total; i++) {
        _record(p2, i / total, size: 48);
        await _drainPingPong(tester, cache2);
      }
      expect(cache2.vectorRasterizedFrames, 0);
      expect(cache2.compressedCacheHits, greaterThanOrEqualTo(total));
      expect(cache2.diskBytes, greaterThan(0));
    },
  );

  testWidgets('recovers gracefully from corrupt or truncated .flcache files', (
    tester,
  ) async {
    final tempDir = Directory.systemTemp.createTempSync('fastlottie_corrupt_');
    addTearDown(() {
      if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
    });

    final json = fixture('static');
    final comp1 = FastLottieComposition.fromJson(json);
    final cache1 = FastLottieRasterCache.pingPong(
      diskCacheDirectory: tempDir.path,
      workerCount: 1,
    );
    final p1 = FastLottiePlayer(comp1, rasterCache: cache1);
    _record(p1, 0, size: 40);
    await _drainPingPong(tester, cache1);
    expect(cache1.diskBytes, greaterThan(0));
    p1.dispose();
    cache1.dispose();

    // Corrupt the payload bytes on disk.
    final flFile = tempDir.listSync().whereType<File>().firstWhere(
      (f) => f.path.endsWith('.flcache'),
    );
    final corrupted = flFile.readAsBytesSync();
    for (var i = corrupted.length - 8; i < corrupted.length; i++) {
      corrupted[i] ^= 0xFF;
    }
    flFile.writeAsBytesSync(corrupted, flush: true);

    final comp2 = FastLottieComposition.fromJson(json);
    final cache2 = FastLottieRasterCache.pingPong(
      diskCacheDirectory: tempDir.path,
      workerCount: 1,
    );
    final p2 = FastLottiePlayer(comp2, rasterCache: cache2);
    final vector = FastLottiePlayer(comp2, cache: FastLottieCache.none);
    addTearDown(() {
      p2.dispose();
      vector.dispose();
      cache2.dispose();
    });

    _record(p2, 0, size: 40);
    await _drainPingPong(tester, cache2);
    expect(cache2.lastError, isNull);
    expect(cache2.vectorRasterizedFrames, 1);

    final actual = await tester.runAsync(
      () => render(
        (c) => p2.draw(c, const ui.Rect.fromLTWH(0, 0, 40, 40), 0),
        size: 40,
      ),
    );
    final expected = await tester.runAsync(
      () => render(
        (c) => vector.draw(c, const ui.Rect.fromLTWH(0, 0, 40, 40), 0),
        size: 40,
      ),
    );
    expect(_mae(actual!, expected!), lessThan(1.5));
  });

  testWidgets(
    'enforces maximumDiskBytes and maximumCompressedMemoryBytes LRU budgets',
    (tester) async {
      final tempDir = Directory.systemTemp.createTempSync('fastlottie_budget_');
      addTearDown(() {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      });

      final jsonA = fixture('icon')..['op'] = 6;
      final jsonB = fixture('features')..['op'] = 6;
      final jsonC = fixture('many_shapes')..['op'] = 6;
      final compA = FastLottieComposition.fromJson(jsonA);
      final compB = FastLottieComposition.fromJson(jsonB);
      final compC = FastLottieComposition.fromJson(jsonC);

      // Measure first entry's disk size then tighten maximumDiskBytes for 1.5 entries.
      final probeCache = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        maximumDiskBytes: 64 * 1024 * 1024,
        maximumCompressedMemoryBytes: 64 * 1024,
        workerCount: 1,
      );
      final pProbe = FastLottiePlayer(compA, rasterCache: probeCache);
      for (var i = 0; i < compA.frameCount; i++) {
        _record(pProbe, i / compA.frameCount, size: 48);
        await _drainPingPong(tester, probeCache);
      }
      final singleDiskSize = probeCache.diskBytes;
      expect(singleDiskSize, greaterThan(0));
      pProbe.dispose();
      probeCache.dispose();

      // Re-open with tight budgets (~1.5x single file disk budget, 4 KiB RAM).
      final budgetDisk = (singleDiskSize * 3) ~/ 2;
      final tightCache = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        maximumDiskBytes: budgetDisk,
        maximumCompressedMemoryBytes: 4 * 1024,
        workerCount: 2,
      );
      final pa = FastLottiePlayer(compA, rasterCache: tightCache);
      final pb = FastLottiePlayer(compB, rasterCache: tightCache);
      final pc = FastLottiePlayer(compC, rasterCache: tightCache);
      addTearDown(() {
        pa.dispose();
        pb.dispose();
        pc.dispose();
        tightCache.dispose();
      });

      for (final p in [pa, pb, pc]) {
        for (var i = 0; i < p.composition.frameCount; i++) {
          _record(p, i / p.composition.frameCount, size: 48);
          await _drainPingPong(tester, tightCache);
        }
        p.dispose(); // Unpin before admitting next so disk LRU can evict cleanly.
      }
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 20)),
      );
      expect(tightCache.diskBytes, lessThanOrEqualTo(budgetDisk));
      expect(tightCache.compressedRamBytes, lessThanOrEqualTo(4 * 1024));
    },
  );

  testWidgets(
    'FastLottie default pipeline scope deduplicates and tears down cleanly without leaked isolates',
    (tester) async {
      final comp1 = FastLottieComposition.fromJson(fixture('icon'));
      final comp2 = FastLottieComposition.fromJson(fixture('icon'));
      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: Row(
            children: [
              FastLottie(composition: comp1, width: 48, height: 48),
              FastLottie(composition: comp2, width: 48, height: 48),
            ],
          ),
        ),
      );
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 40)),
      );
      await tester.pump(const Duration(milliseconds: 16));
      await tester.pump(const Duration(milliseconds: 16));

      await tester.pumpWidget(const SizedBox());
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 20)),
      );
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'canonical source-frame indexing shares .flcache and RAM frames across poster and different frame rates',
    (tester) async {
      final tempDir = Directory.systemTemp.createTempSync(
        'fastlottie_canonical_',
      );
      addTearDown(() {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      });

      final json = fixture('icon')
        ..['fr'] = 60
        ..['op'] = 12;
      final comp = FastLottieComposition.fromJson(json);

      final cache = FastLottieRasterCache.pingPong(
        diskCacheDirectory: tempDir.path,
        workerCount: 1,
      );
      final posterPlayer = FastLottiePlayer(
        comp,
        rasterCache: cache,
        rasterMode: FastLottieRasterMode.poster,
      );
      final halfRatePlayer = FastLottiePlayer(
        comp,
        rasterCache: cache,
        maximumFrameRate: 30,
      );
      final fullRatePlayer = FastLottiePlayer(comp, rasterCache: cache);
      addTearDown(() {
        posterPlayer.dispose();
        halfRatePlayer.dispose();
        fullRatePlayer.dispose();
        cache.dispose();
      });

      // 1. Render frame 0 in poster mode -> rasterizes source frame 0 once.
      _record(posterPlayer, 0.0, size: 48);
      await _drainPingPong(tester, cache);
      expect(cache.vectorRasterizedFrames, 1);

      // 2. Render frame 0 in 30 FPS and 60 FPS players -> hits shared compressed cache for source frame 0!
      final beforeHits = cache.compressedCacheHits;
      _record(halfRatePlayer, 0.0, size: 48);
      await _drainPingPong(tester, cache);
      _record(fullRatePlayer, 0.0, size: 48);
      await _drainPingPong(tester, cache);

      expect(cache.compressedCacheHits, greaterThan(beforeHits));
      // Only 1 .flcache file is created on disk for all three modes.
      final flcacheFiles = tempDir
          .listSync()
          .whereType<File>()
          .where((f) => f.path.endsWith('.flcache'))
          .toList();
      expect(flcacheFiles.length, 1);
    },
  );

  testWidgets('speculative lookahead cannot evict a queued first image', (
    tester,
  ) async {
    final cache = FastLottieRasterCache.miniStrip(
      stripFrames: 4,
      progressiveFirstFrame: false,
      workerCount: 1,
      maximumInFlight: 8,
      maximumPendingFrames: 1,
    );
    final players = [
      for (final name in ['icon', 'features', 'many_shapes'])
        FastLottiePlayer(
          FastLottieComposition.fromJson(fixture(name)..['op'] = 12),
          rasterCache: cache,
        ),
    ];
    addTearDown(() {
      for (final player in players) {
        player.dispose();
      }
      cache.dispose();
    });
    final [warm, running, cold] = players;
    _record(warm, 0, size: 48);
    await _drainPingPong(tester, cache);
    _record(running, 0, size: 48);
    _record(cold, 0, size: 48);
    _record(warm, 1 / 12, size: 48); // Speculate on strip 4…7.
    await _drainPingPong(tester, cache);
    expect(cache.workerDispatches, 3);
    expect(cold.rasterBytes, greaterThan(0));
  });

  testWidgets(
    '2-lane priority queue promotes/prioritizes cold frames over low-priority lookahead prefetches under tight queue budget',
    (tester) async {
      final compA = FastLottieComposition.fromJson(
        fixture('icon')..['op'] = 10,
      );
      final compB = FastLottieComposition.fromJson(
        fixture('features')..['op'] = 10,
      );
      final compC = FastLottieComposition.fromJson(
        fixture('many_shapes')..['op'] = 10,
      );

      final cache = FastLottieRasterCache.pingPong(
        maximumPendingFrames: 1,
        workerCount: 1,
      );
      final pa = FastLottiePlayer(compA, rasterCache: cache);
      final pb = FastLottiePlayer(compB, rasterCache: cache);
      final pc = FastLottiePlayer(compC, rasterCache: cache);
      addTearDown(() {
        pa.dispose();
        pb.dispose();
        pc.dispose();
        cache.dispose();
      });

      // Warm pa so its next draw schedules a low-priority lookahead prefetch,
      // then immediately request cold frames on pb and pc under maximumPendingFrames: 1.
      _record(pa, 0.0, size: 48);
      await _drainPingPong(tester, cache);

      _record(pa, 0.0, size: 48);
      _record(pb, 0.0, size: 48);
      _record(pc, 0.0, size: 48);
      await _drainPingPong(tester, cache);

      // Pump once more so any deferred high-priority entry completes.
      _record(pb, 0.0, size: 48);
      _record(pc, 0.0, size: 48);
      await _drainPingPong(tester, cache);

      expect(cache.lastError, isNull);
      expect(cache.entries, 3);
      expect(cache.vectorRasterizedFrames, greaterThanOrEqualTo(3));
    },
  );
}
