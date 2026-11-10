import 'package:fastlottie_example/tgs/clock.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('rounded vsync timestamps do not repeat the preceding sample', (
    tester,
  ) async {
    final clock = StickerClock()
      ..configure(playing: true, reducedMotion: false);
    final progress = StickerProgress(clock, 120, 60, maximumFrameRate: 30);
    await tester.pump();
    await tester.pump(const Duration(microseconds: 33333));
    expect(progress.value * 120, 2);
    await tester.pump(const Duration(microseconds: 33333));
    expect(progress.value * 120, 4);
    progress.dispose();
    clock.dispose();
  });
  testWidgets('fractional raster steps survive progress normalization', (
    tester,
  ) async {
    final clock = StickerClock()
      ..configure(playing: true, reducedMotion: false);
    final progress = StickerProgress(clock, 120, 60, maximumFrameRate: 24);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(progress.value * 120, closeTo(2.5, 1e-7));
    expect(progress.currentFrame, 2);
    progress.dispose();
    clock.dispose();
  });
  testWidgets('clock follows visible sample rates and releases faster demand', (
    tester,
  ) async {
    final clock = StickerClock()
      ..configure(playing: true, reducedMotion: false);
    final slow = StickerProgress(clock, 120, 60, maximumFrameRate: 30);
    var updates = 0;
    slow.addListener(() => updates++);
    expect(clock.effectiveFrameRate, 30);
    for (var i = 0; i < 61; i++) {
      await tester.pump(const Duration(microseconds: 16667));
    }
    expect(updates, inInclusiveRange(29, 31));
    expect(slow.value, closeTo(.5, .02));
    final fast = StickerProgress(clock, 120, 60);
    expect(clock.effectiveFrameRate, 60);
    fast.dispose();
    expect(clock.effectiveFrameRate, 30);
    slow.dispose();
    expect(tester.hasRunningAnimations, isFalse);
    clock.dispose();
  });
  testWidgets(
    'mobile clock limits updates to 30 FPS while preserving source timeline',
    (tester) async {
      final clock = StickerClock()
        ..configure(playing: true, reducedMotion: false, maximumFrameRate: 30);
      final progress = StickerProgress(clock, 120, 60, maximumFrameRate: 30);
      var notifications = 0;
      progress.addListener(() => notifications++);
      for (var i = 0; i < 61; i++) {
        await tester.pump(const Duration(microseconds: 16667));
        expect((progress.value * 120).round().isEven, isTrue);
      }
      expect(notifications, inInclusiveRange(29, 31));
      expect(progress.value, closeTo(.5, .02));
      clock.configure(
        playing: false,
        reducedMotion: false,
        maximumFrameRate: 30,
      );
      final paused = clock.microseconds;
      await tester.pump(const Duration(seconds: 2));
      expect(clock.microseconds, paused);
      progress.dispose();
      clock.dispose();
    },
  );

  testWidgets(
    'no ticker runs without consumers, time resumes without a background jump',
    (tester) async {
      final clock = StickerClock()
        ..configure(playing: true, reducedMotion: false);
      expect(tester.hasRunningAnimations, isFalse);
      var progress = StickerProgress(clock, 120, 60);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      progress.dispose();
      expect(tester.hasRunningAnimations, isFalse);
      final saved = clock.microseconds;
      await tester.pump(const Duration(seconds: 2));
      progress = StickerProgress(clock, 120, 60);
      await tester.pump();
      expect(clock.microseconds, saved);
      progress.dispose();
      clock.dispose();
    },
  );
}
