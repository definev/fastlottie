import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;
import 'raster_cache_test.dart' show distinctIcon, record;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('FastLottiePictureCache shares recorded pictures across players without constructing a second scene', () {
    final comp = FastLottieComposition.fromJson(fixture('icon'));
    final cache = FastLottiePictureCache(maximumCompositions: 4);
    addTearDown(cache.dispose);

    final first = FastLottiePlayer(
      comp,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    record(first, 0.0);
    expect(first.debugHasScene, isTrue);
    expect(first.cacheMisses, 1);
    expect(cache.misses, 1);
    expect(cache.cachedFrames, 1);
    first.dispose();
    // Disposing a vector player recycles its scene for future misses.
    expect(comp.debugHasPreparedScene, isTrue);
    expect(cache.entries, 1);
    expect(cache.cachedFrames, 1);

    final second = FastLottiePlayer(
      comp,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    addTearDown(second.dispose);
    record(second, 0.0);
    expect(second.cacheHits, 1);
    expect(cache.hits, 1);
    // Warm picture hit never even forks or takes the scene.
    expect(second.debugHasScene, isFalse);
    expect(comp.debugHasPreparedScene, isTrue);
  });

  test('FastLottiePictureCache evicts oldest unpinned compositions while preserving active players', () {
    final c1 = distinctIcon(1);
    final c2 = distinctIcon(2);
    final c3 = distinctIcon(3);
    final c4 = distinctIcon(4);
    final cache = FastLottiePictureCache(maximumCompositions: 2);
    addTearDown(cache.dispose);

    final p1 = FastLottiePlayer(
      c1,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    final p2 = FastLottiePlayer(
      c2,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    record(p1, 0.0);
    record(p2, 0.0);
    expect(cache.entries, 2);

    // Release p1 so c1 becomes the oldest unpinned entry; keep p2 pinned.
    p1.dispose();

    final p3 = FastLottiePlayer(
      c3,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    record(p3, 0.0);
    // Pinned players do not starve the unpinned warm LRU (1 unpinned <= 2).
    expect(cache.entries, 3);
    p3.dispose();
    expect(cache.entries, 3); // 1 pinned (c2) + 2 unpinned (c1, c3).

    final p4 = FastLottiePlayer(
      c4,
      cache: FastLottieCache.unbounded,
      pictureCache: cache,
    );
    record(p4, 0.0);
    p4.dispose();
    // 3rd unpinned composition evicts oldest unpinned (c1): 1 pinned + 2 unpinned.
    expect(cache.entries, 3);

    cache.evictUnpinned();
    // Only pinned p2 remains.
    expect(cache.entries, 1);
    expect(cache.cachedFrames, 1);

    cache.clear();
    expect(cache.cachedFrames, 0);
    p2.dispose();
    expect(cache.entries, 0);
  });

  testWidgets('FastLottie widget forwards pictureCache to its vector player', (
    tester,
  ) async {
    final comp = FastLottieComposition.fromJson(fixture('icon'));
    final cache = FastLottiePictureCache(maximumCompositions: 4);
    addTearDown(cache.dispose);

    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: FastLottie(
            composition: comp,
            width: 64,
            height: 64,
            animate: false,
            usePipeline: false,
            cache: FastLottieCache.unbounded,
            pictureCache: cache,
          ),
        ),
      ),
    );
    expect(cache.misses, 1);
    expect(cache.cachedFrames, 1);

    // Unmount and remount a fresh widget for the same composition.
    await tester.pumpWidget(const SizedBox.shrink());
    expect(cache.entries, 1);
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: FastLottie(
            composition: comp,
            width: 64,
            height: 64,
            animate: false,
            usePipeline: false,
            cache: FastLottieCache.unbounded,
            pictureCache: cache,
          ),
        ),
      ),
    );
    expect(cache.hits, greaterThanOrEqualTo(1));
    expect(cache.misses, 1);
    await tester.pumpWidget(const SizedBox.shrink());
  });
}
