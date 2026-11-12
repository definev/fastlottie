import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/gallery.dart';
import 'package:fastlottie_example/tgs/sheet.dart';
import 'package:fastlottie_example/tgs/store.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'ping-pong thumbnail settings fit entire 94-sticker catalog under 10 MiB GPU',
    () async {
      final catalog = await loadTgsCatalog(rootBundle);
      var bytes = 0;
      for (final asset in catalog) {
        final c = FastLottieComposition.fromBytes(
          File(asset).readAsBytesSync(),
        );
        bytes +=
            stickerThumbnailPixels *
            stickerThumbnailPixels *
            4 *
            (c.isStatic ? 1 : 2);
      }
      expect(catalog.length, 94);
      expect(bytes, lessThanOrEqualTo(10 * 1024 * 1024));
      expect(bytes, lessThanOrEqualTo(stickerSheetBytes));
    },
  );

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
}
