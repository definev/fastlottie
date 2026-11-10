import 'dart:async';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/clock.dart';
import 'package:fastlottie_example/tgs/gallery.dart';
import 'package:fastlottie_example/tgs/posters.dart';
import 'package:fastlottie_example/tgs/rich_messages.dart';
import 'package:fastlottie_example/tgs/sheet.dart';
import 'package:fastlottie_example/tgs/store.dart';
import 'package:fastlottie_example/tgs/telegram_demo.dart';
import 'package:flutter/material.dart'; // ignore: deprecated_member_use
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

class _EmptyBundle extends CachingAssetBundle {
  @override
  Future<ByteData> load(String key) async => ByteData(1);
}

void main() {
  test('demo has 60 distinct message contents', () {
    expect(demoMessageTexts.length + 2, demoMessageCount);
    expect(demoMessageTexts.toSet().length, demoMessageTexts.length);
  });
  test('40 animated Topics compile and fit the ping-pong budget under 1 MiB', () {
    var bytes = 0;
    for (final asset in topicEmojiAssets) {
      final c = FastLottieComposition.fromBytes(File(asset).readAsBytesSync());
      expect(c.isStatic, isFalse);
      bytes += 48 * 48 * 4 * (c.isStatic ? 1 : 2);
    }
    expect(bytes, lessThanOrEqualTo(1024 * 1024));
  });
  for (final scale in [1.0, 1.6]) {
    testWidgets(
      'inline stickers wrap with text at scale $scale, static state detaches clock',
      (tester) async {
        tester.view.physicalSize = const Size(340, 760);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        final posters = (await tester.runAsync(StickerPosters.load))!;
        final sheet = StickerSheet(assets: topicEmojiAssets, pixelSize: 48);
        final store = TgsStore();
        final clock = StickerClock()
          ..configure(
            playing: true,
            reducedMotion: false,
            maximumFrameRate: 30,
          );
        final sent = <String>[];
        Future<void> mount(bool still) => tester.pumpWidget(
          MaterialApp(
            home: MediaQuery(
              data: MediaQueryData(textScaler: TextScaler.linear(scale)),
              child: Scaffold(
                body: RichMessageList(
                  sheet: sheet,
                  posters: posters,
                  clock: clock,
                  store: store,
                  renderer: TgsRenderer.fastlottie,
                  still: still,
                  sentStickers: sent,
                ),
              ),
            ),
          ),
        );
        await mount(false);
        final list = tester.widget<ListView>(
          find.byKey(const ValueKey('rich-message-list')),
        );
        expect(list.reverse, isTrue);
        expect(
          (list.childrenDelegate as SliverChildBuilderDelegate).childCount,
          60,
        );
        expect(find.byType(InlineSticker), findsWidgets);
        expect(clock.hasConsumers, isTrue);
        final before = tester.getRect(find.byType(InlineSticker).first);
        await tester.pump(const Duration(milliseconds: 100));
        expect(tester.getRect(find.byType(InlineSticker).first), before);
        expect(tester.takeException(), isNull);
        await mount(true);
        expect(clock.hasConsumers, isFalse);
        await tester.drag(
          find.byKey(const ValueKey('rich-message-list')),
          const Offset(0, -240),
        );
        await tester.pump();
        expect(tester.takeException(), isNull);
        sent.addAll([topicEmojiAssets.first, topicEmojiAssets.first]);
        await mount(true);
        final appended = tester.widget<ListView>(
          find.byKey(const ValueKey('rich-message-list')),
        );
        expect(
          (appended.childrenDelegate as SliverChildBuilderDelegate).childCount,
          62,
        );
        expect(find.byKey(const ValueKey('sent-sticker-1')), findsOneWidget);
        expect(find.byKey(const ValueKey('sent-sticker-0')), findsOneWidget);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
        sheet.dispose();
        store.dispose();
        clock.dispose();
        posters.dispose();
      },
    );
  }

  testWidgets(
    'SentSticker renders hero vector without pipeline or pressure throttling',
    (tester) async {
      final posters = (await tester.runAsync(StickerPosters.load))!;
      final asset = topicEmojiAssets.first;
      final tgsBytes = File(asset).readAsBytesSync();
      final decodedFast = FastLottieComposition.fromBytes(tgsBytes);
      final decodedRef = LottieComposition.parseJsonBytes(
        decodeLottieBytes(tgsBytes),
      );
      final gate = Completer<TgsModel>();
      final store = TgsStore(
        bundle: _EmptyBundle(),
        decoder: (_, ref) => ref
            ? Future.value(
                TgsModel(
                  reference: decodedRef,
                  sourceBytes: tgsBytes.length,
                  inflateUs: 0,
                  parseUs: 0,
                ),
              )
            : gate.future,
      );
      final sheet = StickerSheet(
        assets: topicEmojiAssets,
        pixelSize: 48,
        store: store,
      );
      final clock = StickerClock()
        ..configure(
          playing: true,
          reducedMotion: false,
          maximumFrameRate: 30,
        );
      addTearDown(() {
        sheet.dispose();
        store.dispose();
        clock.dispose();
        posters.dispose();
      });

      Future<void> mount(
        TgsRenderer renderer, {
        required bool still,
        bool? animateSent,
      }) => tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: RichMessageList(
              sheet: sheet,
              posters: posters,
              clock: clock,
              store: store,
              renderer: renderer,
              still: still,
              animateSent: animateSent,
              sentStickers: [asset],
            ),
          ),
        ),
      );

      // Cold state paints poster fallback while waiting on TgsStore.
      await mount(TgsRenderer.fastlottie, still: true, animateSent: true);
      final sentFinder = find.byKey(const ValueKey('sent-sticker-0'));
      expect(sentFinder, findsOneWidget);
      expect(
        find.descendant(of: sentFinder, matching: find.byType(FastLottie)),
        findsNothing,
      );
      expect(
        find.descendant(of: sentFinder, matching: find.byType(CustomPaint)),
        findsWidgets,
      );

      // Resolve model: FastLottie mounts directly at full vector quality, bypassing ping-pong pipeline and still/pressure.
      gate.complete(
        TgsModel(
          fast: decodedFast,
          sourceBytes: tgsBytes.length,
          inflateUs: 0,
          parseUs: 0,
        ),
      );
      await tester.pump();
      await tester.pump();

      final heroFast = tester.widget<FastLottie>(
        find.descendant(of: sentFinder, matching: find.byType(FastLottie)),
      );
      expect(heroFast.usePipeline, isFalse);
      expect(heroFast.rasterCache, isNull);
      expect(heroFast.controller, isNull);
      expect(heroFast.useFrameRate, isTrue);
      expect(heroFast.animate, isTrue);
      expect(heroFast.cache.maximumFrames, FastLottieCache.unbounded.maximumFrames);
      expect(
        heroFast.cache.maximumCommands,
        FastLottieCache.unbounded.maximumCommands,
      );
      expect(heroFast.width, 320);
      expect(heroFast.height, 320);

      // animateSent: false (reduced motion) stops hero animation cleanly.
      await mount(TgsRenderer.fastlottie, still: true, animateSent: false);
      expect(
        tester
            .widget<FastLottie>(
              find.descendant(of: sentFinder, matching: find.byType(FastLottie)),
            )
            .animate,
        isFalse,
      );

      // Switching renderer swaps cleanly to baseline Lottie at source composition FPS.
      await mount(TgsRenderer.lottie, still: false, animateSent: true);
      await tester.pump();
      await tester.pump();
      final heroLottie = tester.widget<Lottie>(
        find.descendant(of: sentFinder, matching: find.byType(Lottie)),
      );
      expect(heroLottie.frameRate, FrameRate.composition);
      expect(heroLottie.animate, isTrue);

      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'TelegramStickerDemo sends direct-vector stickers while keeping 30 FPS thumbnail clock',
    (tester) async {
      final bytes = File(topicEmojiAssets.first).readAsBytesSync();
      final fast = FastLottieComposition.fromBytes(bytes);
      final store = TgsStore(
        bundle: _EmptyBundle(),
        decoder: (_, _) async => TgsModel(
          fast: fast,
          sourceBytes: bytes.length,
          inflateUs: 0,
          parseUs: 0,
        ),
      );
      addTearDown(store.dispose);

      await tester.pumpWidget(
        MaterialApp(
          home: TelegramStickerDemo(
            catalog: Future.value([topicEmojiAssets.first]),
            store: store,
          ),
        ),
      );
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 30)));
      await tester.pump();
      await tester.pump();

      final listFinder = find.byType(RichMessageList);
      final initialList = tester.widget<RichMessageList>(listFinder);
      expect(initialList.clock.effectiveFrameRate, 30);

      await tester.tap(find.byKey(const ValueKey('send-sticker-0')));
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 30)));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 250));

      final sent = find.byKey(const ValueKey('sent-sticker-0'));
      expect(sent, findsOneWidget);
      final hero = tester.widget<FastLottie>(
        find.descendant(of: sent, matching: find.byType(FastLottie)),
      );
      expect(hero.usePipeline, isFalse);
      expect(hero.rasterCache, isNull);
      expect(hero.cache.maximumFrames, FastLottieCache.unbounded.maximumFrames);
      expect(tester.widget<RichMessageList>(listFinder).clock.effectiveFrameRate, 30);

      await tester.pumpWidget(const SizedBox());
    },
  );
}
