import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/main.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

FastLottieComposition composition() => FastLottieComposition.fromJson(
  jsonDecode(File('assets/icon.json').readAsStringSync())
      as Map<String, dynamic>,
);

Widget preview(
  FastLottieComposition composition, {
  double dpr = 1,
  double size = 32,
  int maximumBytes = 64 * 1024 * 1024,
}) => Directionality(
  textDirection: TextDirection.ltr,
  child: MediaQuery(
    data: MediaQueryData(devicePixelRatio: dpr),
    child: Center(
      child: RasterPreview(
        composition: composition,
        controller: const AlwaysStoppedAnimation(.25),
        width: size,
        height: size,
        maximumRasterBytes: maximumBytes,
      ),
    ),
  ),
);

Future<FastLottiePlayer> settledPlayer(WidgetTester tester) async {
  await tester.pump();
  final view = tester.widget<FastLottieView>(find.byType(FastLottieView));
  final cache = view.player.rasterCache;
  if (cache != null) {
    for (var i = 0; i < 200 && cache.pendingFrames > 0; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 5)),
      );
      await tester.pump();
    }
    expect(cache.pendingFrames, 0);
    expect(cache.lastError, isNull);
  }
  expect(tester.takeException(), isNull);
  return tester.widget<FastLottieView>(find.byType(FastLottieView)).player;
}

void main() {
  testWidgets('preview re-prepares for DPR, layout and composition changes', (
    tester,
  ) async {
    final first = composition();
    await tester.pumpWidget(preview(first));
    final dpr1 = await settledPlayer(tester);
    expect(dpr1.rasterCache?.strategy, FastLottieRasterStrategy.pingPong);
    expect(dpr1.rasterSize, const Size(32, 32));
    expect(dpr1.rasterBytes, 32 * 32 * 4);

    await tester.pumpWidget(preview(first, dpr: 2));
    final dpr2 = await settledPlayer(tester);
    expect(dpr2.rasterSize, const Size(64, 64));
    expect(dpr2.rasterBytes, 64 * 64 * 4);
    expect(dpr1.rasterBytes, 0);

    await tester.pumpWidget(preview(first, dpr: 2, size: 48));
    final resized = await settledPlayer(tester);
    expect(resized.rasterSize, const Size(96, 96));
    expect(dpr2.rasterBytes, 0);

    final second = composition();
    await tester.pumpWidget(preview(second, dpr: 2, size: 48));
    final replaced = await settledPlayer(tester);
    expect(replaced.composition, same(second));
    expect(resized.rasterBytes, 0);
    await tester.pumpWidget(const SizedBox());
    await tester.pump();
    expect(replaced.rasterBytes, 0);
  });

  testWidgets(
    'over budget uses sharp vectors and recovers when DPR decreases',
    (tester) async {
      final animation = composition();
      const budget = 2 * 32 * 32 * 4;
      await tester.pumpWidget(preview(animation, maximumBytes: budget));
      final dpr1 = await settledPlayer(tester);
      expect(dpr1.rasterSize, const Size(32, 32));
      expect(find.textContaining('ping-pong raster cache'), findsOneWidget);

      await tester.pumpWidget(preview(animation, dpr: 2, maximumBytes: budget));
      final fallback = await settledPlayer(tester);
      expect(fallback.rasterSize, isNull);
      expect(fallback.rasterBytes, 0);
      expect(find.textContaining('raster budget exceeded'), findsOneWidget);
      expect(dpr1.rasterBytes, 0);

      await tester.pumpWidget(preview(animation, maximumBytes: budget));
      final recovered = await settledPlayer(tester);
      expect(recovered.rasterSize, const Size(32, 32));
      await tester.pumpWidget(const SizedBox());
      await tester.pump();
    },
  );

  testWidgets('rapid changes and unmount cancel obsolete ping-pong workers', (
    tester,
  ) async {
    final animation = composition();
    await tester.pumpWidget(preview(animation));
    await tester.pumpWidget(preview(animation, dpr: 2, size: 48));
    await tester.pumpWidget(const SizedBox());
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 20)),
    );
    await tester.pump();
    expect(tester.takeException(), isNull);
  });
}
