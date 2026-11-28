import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, bytes;
import 'raster_cache_test.dart' show drain, record;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('external controller repaints only changed raster samples', (
    tester,
  ) async {
    final comp = FastLottieComposition.fromJson(fixture('icon')..['fr'] = 60);
    final cache = FastLottieRasterCache(
      framesPerStrip: 1,
      maximumFrameRate: 30,
      workerCount: 2,
    );
    final player = FastLottiePlayer(
      comp,
      rasterCache: cache,
      cache: FastLottieCache.none,
    );
    final controller = AnimationController(
      vsync: tester,
      duration: comp.duration,
    );
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: SizedBox(
            width: 32,
            height: 32,
            child: FastLottieView(player: player, progress: controller),
          ),
        ),
      ),
    );
    await drain(tester, cache);
    expect(cache.renderedFrames, 1);
    final hitsAfterWarm = cache.hits;
    final missesAfterWarm = cache.misses;

    controller.value = 1 / comp.frameCount;
    await tester.pump();
    expect(
      cache.hits,
      hitsAfterWarm,
    ); // Same 30fps sample did not repaint or lookup.
    expect(cache.misses, missesAfterWarm);
    expect(cache.renderedFrames, 1);

    controller.value = 2 / comp.frameCount;
    await tester.pump();
    await drain(tester, cache);
    final renderedAfterStep = cache.renderedFrames;
    expect(renderedAfterStep, greaterThanOrEqualTo(2));

    controller.value = 3 / comp.frameCount;
    await tester.pump();
    expect(cache.renderedFrames, renderedAfterStep);

    cache.clear(); // Invalidation must repaint even at unchanged progress.
    await tester.pump();
    await drain(tester, cache);
    expect(cache.renderedFrames, greaterThan(renderedAfterStep));
    await tester.pumpWidget(const SizedBox());
    controller.value = .5;
    expect(tester.takeException(), isNull);
    controller.dispose();
    player.dispose();
    cache.dispose();
  });
  testWidgets('subframe rendering still repaints within a source frame', (
    tester,
  ) async {
    final comp = FastLottieComposition.fromJson(fixture('icon'));
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final controller = AnimationController(
      vsync: tester,
      duration: comp.duration,
    );
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: FastLottieView(
          player: player,
          progress: controller,
          useFrameRate: false,
        ),
      ),
    );
    final before = player.cacheMisses;
    controller.value = .1 / comp.frameCount;
    await tester.pump();
    expect(player.cacheMisses, before + 1);
    await tester.pumpWidget(const SizedBox());
    controller.dispose();
    player.dispose();
  });
  test(
    'worker compiles lazily by default and prepares vector scene when requested',
    () async {
      final lazy = await FastLottieComposition.fromBytesAsync(
        bytes(fixture('icon')),
      );
      expect(lazy.debugHasPreparedScene, isFalse);

      final c = await FastLottieComposition.fromBytesAsync(
        bytes(fixture('icon')),
        prepareForVector: true,
      );
      expect(c.debugHasPreparedScene, isTrue);
      final discarded = FastLottiePlayer(c);
      expect(discarded.debugHasScene, isFalse);
      discarded.dispose();
      expect(c.debugHasPreparedScene, isTrue);
      final player = FastLottiePlayer(c);
      record(player, .2);
      expect(player.debugHasScene, isTrue);
      expect(c.debugHasPreparedScene, isFalse);
      player.dispose();
    },
  );
  test('taking a prepared raster scene leaves later players independent', () {
    final composition = FastLottieComposition.fromJson(fixture('icon'))
      ..prepareForPlayback();
    final scene = debugTakePreparedRasterScene(composition);
    expect(scene, isNotNull);
    expect(debugTakePreparedRasterScene(composition), isNull);
    final player = FastLottiePlayer(composition);
    expect(player.debugHasScene, isFalse);
    record(player, .2);
    expect(player.debugHasScene, isTrue);
    player.dispose();
  });
  test('interleaved raster sessions keep animation tracks independent', () {
    final composition = FastLottieComposition.fromJson(fixture('morph'))
      ..prepareForPlayback();
    final firstScene = debugTakePreparedRasterScene(composition)!;
    final key = composition.contentKey;
    expect(firstScene.contentKey, key);
    final first = FastLottieSoftwareSession(
      composition,
      pixelWidth: 96,
      pixelHeight: 96,
    );
    final second = FastLottieSoftwareSession(
      composition,
      pixelWidth: 96,
      pixelHeight: 96,
    );
    addTearDown(first.dispose);
    addTearDown(second.dispose);
    for (final (a, b) in [
      (0.0, 59.0),
      (28.5, 15.0),
      (59.0, 0.0),
      (0.0, 42.0),
    ]) {
      final snapshot = first.renderFrame(a).toList();
      second.renderFrame(b);
      expect(first.renderFrame(a), snapshot);
      expect(second.renderFrame(a), snapshot);
      expect(composition.contentKey, key);
    }
  });
  testWidgets('a shared texture hit never constructs a replacement scene', (
    tester,
  ) async {
    final c = await tester.runAsync(
      () => FastLottieComposition.fromBytesAsync(bytes(fixture('icon'))),
    );
    final cache = FastLottieRasterCache(framesPerStrip: 1, workerCount: 2);
    final first = FastLottiePlayer(
      c!,
      rasterCache: cache,
      cache: FastLottieCache.none,
    );
    record(first, .2);
    expect(first.debugHasScene, isTrue);
    await drain(tester, cache);
    first.dispose();
    final next = FastLottiePlayer(
      c,
      rasterCache: cache,
      cache: FastLottieCache.none,
    );
    final hitsBefore = cache.hits;
    record(next, .2);
    expect(cache.hits, hitsBefore + 1);
    expect(next.debugHasScene, isFalse);
    next.dispose();
    cache.dispose();
    await tester.pump();
  });

  testWidgets(
    'player releases vector scene state after drawing from warm rasterCache',
    (tester) async {
      final c = await tester.runAsync(
        () => FastLottieComposition.fromBytesAsync(bytes(fixture('icon'))),
      );
      final cache = FastLottieRasterCache(workerCount: 2);
      final player = FastLottiePlayer(
        c!,
        rasterCache: cache,
        cache: FastLottieCache.none,
      );
      addTearDown(() {
        player.dispose();
        cache.dispose();
      });

      // Cold draw without fallback builds _sceneState so the frame paints immediately.
      record(player, .2);
      expect(player.debugHasScene, isTrue);

      // Once worker finishes and a warm frame draws from rasterCache, _sceneState releases.
      await drain(tester, cache);
      record(player, .2);
      expect(cache.hits, greaterThanOrEqualTo(1));
      expect(player.debugHasScene, isFalse);
    },
  );
}
