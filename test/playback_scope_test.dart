import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  testWidgets(
    'hiding a pending raster consumer releases its lease and can remount',
    (tester) async {
      final cache = FastLottieRasterCache(
        workerCount: 1,
        maximumInFlight: 1,
        progressiveFirstFrame: true,
      );
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      addTearDown(cache.dispose);
      Widget host(FastLottiePlayback playback) => MediaQuery(
        data: const MediaQueryData(),
        child: FastLottiePlaybackScope(
          playback: playback,
          child: FastLottie(
            composition: composition,
            width: 64,
            height: 64,
            rasterCache: cache,
          ),
        ),
      );
      await tester.pumpWidget(host(FastLottiePlayback.active));
      await tester.pumpWidget(host(FastLottiePlayback.hidden));
      for (var i = 0; i < 100 && cache.pendingFrames > 0; i++) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 5)),
        );
        await tester.pump();
      }
      expect(cache.pendingFrames, 0);
      expect(cache.lastError, isNull);
      final dispatches = cache.workerDispatches;
      await tester.pump(const Duration(seconds: 1));
      expect(cache.workerDispatches, dispatches);
      await tester.pumpWidget(host(FastLottiePlayback.prewarm));
      expect(tester.hasRunningAnimations, isFalse);
      await tester.pumpWidget(host(FastLottiePlayback.active));
      expect(tester.hasRunningAnimations, isTrue);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets('scope stops owned ticker and resumes without losing layout', (
    tester,
  ) async {
    final composition = FastLottieComposition.fromJson(fixture('icon'));
    Widget host(FastLottiePlayback playback) => MediaQuery(
      data: const MediaQueryData(),
      child: Directionality(
        textDirection: TextDirection.ltr,
        child: Center(
          child: FastLottiePlaybackScope(
            playback: playback,
            child: FastLottie(
              composition: composition,
              width: 64,
              height: 64,
              usePipeline: false,
            ),
          ),
        ),
      ),
    );
    await tester.pumpWidget(host(FastLottiePlayback.active));
    expect(tester.hasRunningAnimations, isTrue);
    await tester.pumpWidget(host(FastLottiePlayback.hidden));
    expect(tester.hasRunningAnimations, isFalse);
    expect(tester.getSize(find.byType(FastLottie)), const Size(64, 64));
    expect(
      find.descendant(
        of: find.byType(FastLottie),
        matching: find.byType(CustomPaint),
      ),
      findsNothing,
    );
    await tester.pumpWidget(host(FastLottiePlayback.prewarm));
    expect(tester.hasRunningAnimations, isFalse);
    await tester.pumpWidget(host(FastLottiePlayback.active));
    expect(tester.hasRunningAnimations, isTrue);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('hidden and prewarm detach external ticks; active reattaches', (
    tester,
  ) async {
    final composition = FastLottieComposition.fromJson(fixture('icon'));
    final controller = AnimationController(
      vsync: tester,
      duration: composition.duration,
    );
    addTearDown(controller.dispose);
    Widget host(FastLottiePlayback playback) => MediaQuery(
      data: const MediaQueryData(),
      child: FastLottiePlaybackScope(
        playback: playback,
        child: FastLottie(
          composition: composition,
          controller: controller,
          usePipeline: false,
        ),
      ),
    );
    await tester.pumpWidget(host(FastLottiePlayback.active));
    controller.value = .2;
    expect(tester.binding.hasScheduledFrame, isTrue);
    await tester.pump();
    for (final state in [
      FastLottiePlayback.hidden,
      FastLottiePlayback.prewarm,
    ]) {
      await tester.pumpWidget(host(state));
      await tester.pump();
      controller.value += .1;
      expect(tester.binding.hasScheduledFrame, isFalse);
    }
    await tester.pumpWidget(host(FastLottiePlayback.active));
    await tester.pump();
    controller.value = .8;
    expect(tester.binding.hasScheduledFrame, isTrue);
    await tester.pumpWidget(const SizedBox());
  });
}
