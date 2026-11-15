import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, render;

FastLottieComposition distinctIcon(int variant) {
  final json = fixture('icon');
  json['layers'][0]['shapes'][0]['it'][1]['c'] = {
    'a': 0,
    'k': [(variant % 5) / 5.0, 0.35, 0.85, 1.0],
  };
  return FastLottieComposition.fromJson(json);
}

Future<void> drain(WidgetTester tester, FastLottieRasterCache cache) async {
  for (var i = 0; i < 200 && cache.pendingFrames > 0; i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 5)),
    );
    await tester.pump();
  }
  expect(cache.pendingFrames, 0);
  expect(cache.lastError, isNull);
}

void record(
  FastLottiePlayer player,
  double progress, {
  double size = 32,
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

double mae(Uint8List a, Uint8List b) {
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]).abs();
  }
  return sum / a.length;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets(
    'an entry beyond the 2-buffer ping-pong budget is rejected without reducing LoD',
    (tester) async {
      final comp = FastLottieComposition.fromJson(fixture('icon'));
      final cache = FastLottieRasterCache(
        maximumBytes: 16 * 16 * 4 * 2 - 1,
        resolutionScale: .5,
        workerCount: 1,
      );
      expect(cache.strategy, FastLottieRasterStrategy.pingPong);
      expect(cache.isPingPong, isTrue);
      final p = FastLottiePlayer(comp, rasterCache: cache);
      record(p, .5);
      expect(cache.entries, 0);
      expect(cache.reservedBytes, 0);
      expect(cache.bytes, 0);
      expect(cache.pendingFrames, 0);
      p.dispose();
      cache.dispose();
      await tester.pump();
    },
  );

  testWidgets(
    'LoD uses size times DPR times fixed scale, preserving timeline and bilinear output',
    (tester) async {
      final comp = FastLottieComposition.fromJson(fixture('icon'));
      final cache = FastLottieRasterCache(resolutionScale: .5, workerCount: 2);
      final p = FastLottiePlayer(
        comp,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final vector = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(() {
        p.dispose();
        vector.dispose();
        cache.dispose();
      });
      record(p, .25, size: 64, dpr: 2);
      expect(cache.pendingFrames, 1);
      expect(cache.renderedFrames, 0);
      expect(cache.reservedBytes, 64 * 64 * 4 * 2);

      await drain(tester, cache);
      expect(cache.renderedFrames, 1);
      expect(cache.bytes, 64 * 64 * 4);

      final hitsBefore = cache.hits;
      final actual = await tester.runAsync(
        () => render((c) {
          c.scale(2);
          p.draw(
            c,
            const ui.Rect.fromLTWH(0, 0, 64, 64),
            .25,
            devicePixelRatio: 2,
          );
        }, size: 128),
      );
      final recorder = ui.PictureRecorder();
      vector.draw(
        ui.Canvas(recorder),
        const ui.Rect.fromLTWH(0, 0, 64, 64),
        .25,
      );
      final picture = recorder.endRecording();
      final image = (await tester.runAsync(() => picture.toImage(64, 64)))!;
      final expected = await tester.runAsync(
        () => render(
          (c) => c.drawImageRect(
            image,
            const ui.Rect.fromLTWH(0, 0, 64, 64),
            const ui.Rect.fromLTWH(0, 0, 128, 128),
            ui.Paint()..filterQuality = ui.FilterQuality.low,
          ),
          size: 128,
        ),
      );
      image.dispose();
      picture.dispose();
      expect(mae(actual!, expected!), lessThan(1.5));
      expect(cache.hits, hitsBefore + 1);
      expect(cache.lastError, isNull);
    },
  );

  testWidgets(
    'poster stores only frame zero (1-buffer weight), with protected space beside an active animation',
    (tester) async {
      final c = FastLottieComposition.fromJson(fixture('icon'));
      final frameBytes = 32 * 32 * 4;
      final cache = FastLottieRasterCache(
        maximumBytes: frameBytes * 3,
        reservedPosterBytes: frameBytes,
        workerCount: 2,
      );
      final animation = FastLottiePlayer(c, rasterCache: cache);
      final poster = FastLottiePlayer(
        c,
        rasterCache: cache,
        rasterMode: FastLottieRasterMode.poster,
      );
      final vector = FastLottiePlayer(c, cache: FastLottieCache.none);
      addTearDown(() {
        animation.dispose();
        poster.dispose();
        vector.dispose();
        cache.dispose();
      });
      record(animation, .3);
      record(poster, .9);
      await drain(tester, cache);
      expect(cache.entries, 2);
      expect(cache.reservedBytes, frameBytes * 3);
      expect(cache.bytes, frameBytes * 2);
      final actual = await tester.runAsync(
        () => render(
          (canvas) =>
              poster.draw(canvas, const ui.Rect.fromLTWH(0, 0, 32, 32), .9),
          size: 32,
        ),
      );
      final expected = await tester.runAsync(
        () => render(
          (canvas) =>
              vector.draw(canvas, const ui.Rect.fromLTWH(0, 0, 32, 32), 0),
          size: 32,
        ),
      );
      expect(mae(actual!, expected!), lessThan(1.5));
      expect(cache.pendingFrames, 0);
    },
  );

  testWidgets(
    'cache swaps lookahead in 2 buffers, reuses across players and preserves DPR pixels',
    (tester) async {
      final comp = FastLottieComposition.fromJson(fixture('icon'));
      final cache = FastLottieRasterCache(workerCount: 2);
      final a = FastLottiePlayer(
        comp,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final b = FastLottiePlayer(
        comp,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final vector = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(() {
        a.dispose();
        b.dispose();
        vector.dispose();
        cache.dispose();
      });

      final total = comp.frameCount;
      record(a, 0 / total, size: 64, dpr: 2);
      await drain(tester, cache);
      expect(cache.entries, 1);
      expect(cache.bytes, 128 * 128 * 4);

      record(a, 1 / total, size: 64, dpr: 2);
      await drain(tester, cache);
      expect(cache.bytes, lessThanOrEqualTo(128 * 128 * 4 * 2));

      record(a, 2 / total, size: 64, dpr: 2);
      await drain(tester, cache);
      expect(cache.pingPongSwaps, greaterThanOrEqualTo(1));
      expect(cache.bytes, lessThanOrEqualTo(128 * 128 * 4 * 2));

      final before = cache.hits;
      final vectorsBefore = cache.vectorRasterizedFrames;
      final actual = await tester.runAsync(
        () => render((c) {
          c.scale(2);
          b.draw(
            c,
            const ui.Rect.fromLTWH(0, 0, 64, 64),
            2 / total,
            devicePixelRatio: 2,
          );
        }, size: 128),
      );
      final expected = await tester.runAsync(
        () => render((c) {
          c.scale(2);
          vector.draw(c, const ui.Rect.fromLTWH(0, 0, 64, 64), 2 / total);
        }, size: 128),
      );
      expect(mae(actual!, expected!), lessThan(1.5));
      expect(cache.hits, greaterThanOrEqualTo(before + 1));
      expect(cache.vectorRasterizedFrames, vectorsBefore);
      await drain(tester, cache);
    },
  );

  testWidgets(
    'whole-cycle 2-buffer reservations pin active entries and evict released clips',
    (tester) async {
      final c = distinctIcon(1);
      final other = distinctIcon(2);
      const weight = 32 * 32 * 4 * 2;
      final cache = FastLottieRasterCache(maximumBytes: weight, workerCount: 1);
      final a = FastLottiePlayer(c, rasterCache: cache);
      final b = FastLottiePlayer(other, rasterCache: cache);
      addTearDown(() {
        a.dispose();
        b.dispose();
        cache.dispose();
      });
      record(a, 0);
      record(b, 0);
      expect(cache.entries, 1);
      expect(cache.reservedBytes, weight);
      expect(cache.debugAdmissionAttempts, 2);
      record(b, .1);
      record(b, .2);
      expect(cache.debugAdmissionAttempts, 2);
      a.dispose();
      await drain(tester, cache);
      expect(cache.pendingFrames, 0);
      record(b, .2);
      expect(cache.debugAdmissionAttempts, 3);
      await drain(tester, cache);
      expect(cache.entries, 1);
      expect(cache.reservedBytes, weight);
      expect(cache.bytes, 32 * 32 * 4);
      expect(cache.bytes, lessThanOrEqualTo(cache.reservedBytes));
    },
  );

  testWidgets(
    'size/DPR/player overrides, fractional sample steps and clear invalidate correctly',
    (tester) async {
      final json = fixture('icon')..['fr'] = 60;
      final c = FastLottieComposition.fromJson(json);
      final cache = FastLottieRasterCache(maximumFrameRate: 24, workerCount: 2);
      final p = FastLottiePlayer(
        c,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      final custom = FastLottiePlayer(
        c,
        rasterCache: cache,
        cache: FastLottieCache.none,
        resolutionScale: .5,
        maximumFrameRate: 60,
      );
      final vector = FastLottiePlayer(c, cache: FastLottieCache.none);
      addTearDown(() {
        p.dispose();
        custom.dispose();
        vector.dispose();
        cache.dispose();
      });
      // At source frame 3, sample index 1 represents source frame floor(2.5)=2.
      record(p, 3 / 60);
      await drain(tester, cache);
      final actual = await tester.runAsync(
        () => render(
          (canvas) =>
              p.draw(canvas, const ui.Rect.fromLTWH(0, 0, 32, 32), 3 / 60),
          size: 32,
        ),
      );
      final expected = await tester.runAsync(
        () => render(
          (canvas) =>
              vector.draw(canvas, const ui.Rect.fromLTWH(0, 0, 32, 32), 2 / 60),
          size: 32,
        ),
      );
      expect(mae(actual!, expected!), lessThan(1.5));
      record(p, .2, dpr: 2);
      record(custom, .2, dpr: 2);
      await drain(tester, cache);
      expect(cache.entries, 3);
      cache.clear();
      expect(cache.bytes, 0);
      expect(cache.reservedBytes, 0);
      expect(cache.entries, 0);
      record(p, .2);
      await drain(tester, cache);
      expect(cache.bytes, 32 * 32 * 4);
    },
  );

  testWidgets(
    'a busy native worker never receives raster jobs for entries canceled in its queue',
    (tester) async {
      final cache = FastLottieRasterCache.miniStrip(
        workerCount: 1,
        maximumInFlight: 8,
      );
      final players = [
        for (var i = 0; i < 4; i++)
          FastLottiePlayer(distinctIcon(i), rasterCache: cache),
      ];
      addTearDown(() {
        for (final player in players) {
          player.dispose();
        }
        cache.dispose();
      });
      for (final player in players) {
        record(player, 0);
      }
      expect(cache.workerDispatches, 1);
      expect(cache.pendingFrames, 4);

      // Two queued tiles leave before the worker finishes. The last moves to
      // a different strip while waiting and must only draw the latest request.
      players[1].dispose();
      players[2].dispose();
      record(players.last, .8);
      expect(cache.pendingFrames, 2);
      await drain(tester, cache);
      expect(cache.workerDispatches, 2);
      expect(players.last.rasterBytes, greaterThan(0));
      record(players.last, .8);
      await drain(tester, cache);
      expect(cache.workerDispatches, 2);
    },
  );

  testWidgets(
    'suspension and disposal cancel queued work, bounded pending queue cannot grow',
    (tester) async {
      final cache = FastLottieRasterCache(
        maximumInFlight: 1,
        maximumPendingFrames: 2,
        workerCount: 1,
      );
      final players = [
        for (var i = 0; i < 4; i++)
          FastLottiePlayer(distinctIcon(i), rasterCache: cache),
      ];
      for (final p in players) {
        record(p, .1);
      }
      // 1 job in-flight + at most maximumPendingFrames (2) queued entries.
      expect(cache.debugInFlightCaptures, 1);
      expect(cache.pendingFrames, lessThanOrEqualTo(3));

      cache.enabled = false;
      expect(cache.pendingFrames, lessThanOrEqualTo(1));
      record(players.last, .8);
      expect(cache.pendingFrames, lessThanOrEqualTo(1));

      cache.enabled = true;
      record(players.last, .8);
      for (final p in players) {
        p.dispose();
      }
      await drain(tester, cache);
      expect(cache.pendingFrames, 0);
      cache.dispose();
      cache.dispose();
      await tester.pump();
      expect(cache.bytes, 0);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'completion repaints a static player and disposing during worker work releases images',
    (tester) async {
      final cache = FastLottieRasterCache(workerCount: 1);
      final p = FastLottiePlayer(
        FastLottieComposition.fromJson(fixture('static')),
        rasterCache: cache,
      );
      var repaints = 0;
      p.addListener(() => repaints++);
      record(p, 0);
      await drain(tester, cache);
      expect(repaints, 1);
      expect(cache.reservedBytes, 32 * 32 * 4);
      cache.clear();
      record(p, 0);
      await tester.pump();
      p.dispose();
      cache.dispose();
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      expect(cache.bytes, 0);
      expect(cache.lastError, isNull);
    },
  );

  testWidgets(
    'O(1) LRU skips infeasible evictions and amortizes image disposal after paint',
    (tester) async {
      final a = distinctIcon(0);
      final b = distinctIcon(1);
      final c = distinctIcon(2);
      final big = distinctIcon(3);
      const frameBytes = 32 * 32 * 4;
      const weight = frameBytes * 2;
      final cache = FastLottieRasterCache(
        maximumBytes: weight * 2 + frameBytes,
        reservedPosterBytes: frameBytes,
        disposalBatchSize: 1,
        workerCount: 2,
      );
      final pa = FastLottiePlayer(a, rasterCache: cache);
      final pb = FastLottiePlayer(b, rasterCache: cache);
      final pc = FastLottiePlayer(c, rasterCache: cache);
      final pBig = FastLottiePlayer(big, rasterCache: cache);
      addTearDown(() {
        pa.dispose();
        pb.dispose();
        pc.dispose();
        pBig.dispose();
        cache.dispose();
      });

      // Populate both front + back buffers of entry A before releasing it.
      record(pa, 0);
      await drain(tester, cache);
      record(pa, 1 / a.frameCount);
      await drain(tester, cache);
      pa.dispose();

      record(pb, 0);
      await drain(tester, cache);
      pb.dispose();
      expect(cache.entries, 2);

      // Infeasible 128x128 ping-pong entry (128 KiB) cannot fit even after
      // evicting A and B: keep both intact.
      record(pBig, 0, size: 128);
      expect(cache.entries, 2);
      expect(cache.debugPendingDisposals, 0);

      // Admitting C requires evicting unpinned LRU (A), queuing A's 2 images.
      record(pc, 0);
      expect(cache.entries, 2);
      expect(cache.debugPendingDisposals, 2);

      await tester.pump();
      expect(cache.debugPendingDisposals, 1);

      cache.clear();
      expect(cache.debugPendingDisposals, 0);
      expect(cache.bytes, 0);
      await drain(tester, cache);
    },
  );
}
