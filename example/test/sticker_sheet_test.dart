import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/clock.dart';
import 'package:fastlottie_example/tgs/gallery.dart';
import 'package:fastlottie_example/tgs/sheet.dart';
import 'package:fastlottie_example/tgs/store.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

class _ReadyStore extends ChangeNotifier implements TgsStoreBase {
  _ReadyStore(this.model);

  final TgsModel model;

  @override
  TgsLease acquire(
    String asset, {
    bool reference = false,
    bool priority = false,
  }) => TgsLease.custom(
    future: Future.value(model),
    readyGetter: () => model,
    onRelease: () {},
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('ping-pong thumbnail settings fit entire 94-sticker catalog under 10 MiB GPU', () async {
    final catalog = await loadTgsCatalog(rootBundle);
    var bytes = 0;
    for (final asset in catalog) {
      final c = FastLottieComposition.fromBytes(File(asset).readAsBytesSync());
      bytes +=
          stickerThumbnailPixels *
          stickerThumbnailPixels *
          4 *
          (c.isStatic ? 1 : 2);
    }
    expect(catalog.length, 94);
    expect(bytes, lessThanOrEqualTo(10 * 1024 * 1024));
    expect(bytes, lessThanOrEqualTo(stickerSheetBytes));
  });

  testWidgets(
    'StickerSheet shares one ping-pong player per duplicate asset and unpins at zero pins',
    (tester) async {
      final asset = (await tester.runAsync(() => loadTgsCatalog(rootBundle)))!
          .first;
      final store = TgsStore();
      final sheet = StickerSheet(
        assets: [asset, asset],
        pixelSize: 56,
        store: store,
      );
      addTearDown(() {
        sheet.dispose();
        store.dispose();
      });

      expect(sheet.rasterCache.strategy, FastLottieRasterStrategy.miniStrip);

      sheet.acquirePin(asset);
      sheet.acquirePin(asset);
      for (var i = 0; i < 40 && sheet.activePlayers == 0; i++) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 5)),
        );
        await tester.pump();
      }
      expect(sheet.activePlayers, 1);
      expect(sheet.playerFor(asset), isNotNull);

      sheet.releasePin(asset);
      expect(sheet.activePlayers, 1);
      sheet.releasePin(asset);
      expect(sheet.activePlayers, 0);
      expect(sheet.playerFor(asset), isNull);
    },
  );

  testWidgets(
    'StickerSheet phases mini-strips without silently reducing frame rate',
    (tester) async {
      final source = (await tester.runAsync(() => loadTgsCatalog(rootBundle)))!
          .first;
      final composition = FastLottieComposition.fromBytes(
        File(source).readAsBytesSync(),
      );
      final store = _ReadyStore(
        TgsModel(fast: composition, sourceBytes: 0, inflateUs: 0, parseUs: 0),
      );
      final assets = [for (var i = 0; i < 41; i++) 'sticker-$i'];
      final sheet = StickerSheet(
        assets: assets,
        pixelSize: 56,
        store: store,
        frameRate: 30,
        stripFrames: 4,
      );
      final clock = StickerClock();
      addTearDown(() {
        clock.dispose();
        sheet.dispose();
        store.dispose();
      });

      for (final asset in assets) {
        sheet.acquirePin(asset);
      }
      await tester.pump();
      expect(sheet.activePlayers, 41);
      expect([
        for (final asset in assets) sheet.playerFor(asset)!.maximumFrameRate,
      ], everyElement(30));
      expect({
        for (final asset in assets.take(4)) sheet.progressFor(asset, clock),
      }, hasLength(4));

      for (final asset in assets.take(9)) {
        sheet.releasePin(asset);
      }
      await tester.pump();
      expect(sheet.playerFor(assets[9])!.maximumFrameRate, 30);

      for (final asset in assets.skip(9).take(20)) {
        sheet.releasePin(asset);
      }
      await tester.pump();
      expect(sheet.playerFor(assets[29])!.maximumFrameRate, 30);
    },
  );

  testWidgets('shared playback budget counts distinct assets across sheets', (
    tester,
  ) async {
    final source = (await tester.runAsync(() => loadTgsCatalog(rootBundle)))!
        .first;
    final composition = FastLottieComposition.fromBytes(
      File(source).readAsBytesSync(),
    );
    final store = _ReadyStore(
      TgsModel(fast: composition, sourceBytes: 0, inflateUs: 0, parseUs: 0),
    );
    final budget = StickerPlaybackBudget();
    final a = [for (var i = 0; i < 30; i++) 'a-$i'];
    final b = [for (var i = 0; i < 30; i++) 'b-$i'];
    final first = StickerSheet(
      assets: a,
      pixelSize: 56,
      store: store,
      playbackBudget: budget,
    );
    final second = StickerSheet(
      assets: b,
      pixelSize: 56,
      store: store,
      playbackBudget: budget,
    );
    addTearDown(() {
      first.dispose();
      second.dispose();
      budget.dispose();
      store.dispose();
    });

    for (final asset in a) {
      first.acquirePin(asset);
    }
    for (final asset in b) {
      second.acquirePin(asset);
    }
    await tester.pump();
    expect(budget.activeAssets, 60);
    expect(first.playerFor(a.first)!.maximumFrameRate, 30);
    expect(second.playerFor(b.first)!.maximumFrameRate, 30);

    // Power saving is explicit; density alone never changes quality.
    budget.qualityScale = .5;
    expect(first.playerFor(a.first)!.maximumFrameRate, 15);
    expect(second.playerFor(b.first)!.maximumFrameRate, 15);
  });

  testWidgets('scrolling offscreen lets the store evict a compiled sticker', (
    tester,
  ) async {
    final catalog = (await tester.runAsync(() => loadTgsCatalog(rootBundle)))!;
    final first = catalog[0], second = catalog[1];
    final store = TgsStore(maximumEntries: 1);
    final sheet = StickerSheet(
      assets: [first, second],
      pixelSize: 56,
      store: store,
    );
    addTearDown(() {
      sheet.dispose();
      store.dispose();
    });

    Future<void> pinAndWait(String asset) async {
      sheet.acquirePin(asset);
      for (var i = 0; i < 50 && sheet.playerFor(asset) == null; i++) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 5)),
        );
        await tester.pump();
      }
      expect(sheet.playerFor(asset), isNotNull);
    }

    await pinAndWait(first);
    sheet.releasePin(first);
    await pinAndWait(second);
    sheet.releasePin(second);
    expect(store.cached, 1);
    expect(store.decodes, 2);

    await pinAndWait(first);
    expect(store.decodes, 3, reason: 'the sheet must honor the store eviction');
    sheet.releasePin(first);
  });
}
