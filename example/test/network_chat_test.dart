import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/main.dart';
import 'package:fastlottie_example/tgs/clock.dart';
import 'package:fastlottie_example/tgs/cupertino_chat.dart';
import 'package:fastlottie_example/tgs/network_server.dart';
import 'package:fastlottie_example/tgs/network_store.dart';
import 'package:fastlottie_example/tgs/sheet.dart';
import 'package:fastlottie_example/tgs/store.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';
import 'package:flutter_test/flutter_test.dart';

class _PassthroughHttpOverrides extends HttpOverrides {}

TgsModel _dummyModel([int sourceBytes = 10]) => TgsModel(
  fast: FastLottieComposition.fromJson({
    'w': 16,
    'h': 16,
    'fr': 30,
    'ip': 0,
    'op': 60,
    'layers': [],
  }),
  sourceBytes: sourceBytes,
  inflateUs: 0,
  parseUs: 0,
);

void main() {
  test('LocalTgsServer serves catalog, TGS binary payloads, ETag 304, and failure states', () async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
    addTearDown(() => server.close(force: true));

    final catalog = await fetchRemoteTgsCatalog(server.baseUri);
    expect(catalog.packs.length, 6);
    expect(catalog.stickers.length, 94);
    expect(catalog.emojis.length, 969);
    expect(catalog.shortcodeMap.length, 969);
    expect(
      catalog.emojiPacks.map((p) => p.id),
      containsAll(['NotoEmoji', 'Topics-1794247486249']),
    );
    expect(catalog.shortcodeMap.containsKey(':studio_microphone:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':nail_polish:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':writing_hand:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':brain:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':cat2:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':smile:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':heart_eyes:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':partying_face:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':thumbs_up:'), isTrue);
    expect(catalog.shortcodeMap.containsKey(':heart_on_fire:'), isTrue);
    expect(catalog.unicodeMap.containsKey('😀'), isTrue);
    expect(catalog.unicodeMap.containsKey('❤️'), isTrue);
    expect(catalog.unicodeMap.containsKey('❤'), isTrue);
    expect(catalog.unicodeMap.containsKey('🐦\u200D🔥'), isTrue);
    expect(catalog.findItem('😀')?.shortcode, ':smile:');
    expect(catalog.findItem('❤️')?.shortcode, ':red_heart:');
    expect(catalog.findItem(':smile:')?.unicode, '😀');
    for (final emoji in catalog.emojis) {
      expect(emoji.shortcode, matches(RegExp(r'^:[a-z0-9_]+:$')));
    }

    final client = HttpClient();
    addTearDown(() => client.close(force: true));

    final healthReq = await client.getUrl(server.baseUri.resolve('/health'));
    final healthResp = await healthReq.close();
    expect(healthResp.statusCode, HttpStatus.ok);
    final healthJson =
        jsonDecode(await utf8.decodeStream(healthResp)) as Map<String, dynamic>;
    expect(healthJson['ok'], isTrue);
    expect(healthJson['stickers'], 94);
    expect(healthJson['emojis'], 969);

    final firstUri = catalog.stickers.first.uri;
    final tgsReq = await client.getUrl(firstUri);
    final tgsResp = await tgsReq.close();
    expect(tgsResp.statusCode, HttpStatus.ok);
    expect(tgsResp.headers.contentType?.mimeType, 'application/x-tgsticker');
    final etag = tgsResp.headers.value(HttpHeaders.etagHeader);
    expect(etag, isNotNull);
    final payload = await tgsResp.fold<List<int>>(
      <int>[],
      (buf, chunk) => buf..addAll(chunk),
    );
    expect(payload.length, catalog.stickers.first.bytes);

    // Verify ETag -> 304 Not Modified.
    final revalReq = await client.getUrl(firstUri);
    revalReq.headers.set(HttpHeaders.ifNoneMatchHeader, etag!);
    final revalResp = await revalReq.close();
    await revalResp.drain<void>();
    expect(revalResp.statusCode, HttpStatus.notModified);
    expect(server.stats.value.notModifiedResponses, 1);

    // Verify 404 & simulated 503 failure toggle.
    final missingReq = await client.getUrl(
      server.baseUri.resolve('/tgs/nope.tgs'),
    );
    final missingResp = await missingReq.close();
    await missingResp.drain<void>();
    expect(missingResp.statusCode, HttpStatus.notFound);

    server.simulateFailure = true;
    final failReq = await client.getUrl(firstUri);
    final failResp = await failReq.close();
    await failResp.drain<void>();
    expect(failResp.statusCode, HttpStatus.serviceUnavailable);
  });

  test('NetworkTgsStore reuses URL disk cache, aborts offscreen sockets, and jumps priority queue', () async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
    addTearDown(() => server.close(force: true));

    final cacheDir = Directory.systemTemp.createTempSync('net_tgs_store_');
    addTearDown(() => cacheDir.deleteSync(recursive: true));

    final firstUrl = server.catalog.stickers.first.urlString;

    // 1. Cold HTTP download writes URL `.tgsbin` disk cache.
    final store1 = NetworkTgsStore(
      framePaced: false,
      sourceCacheDirectory: cacheDir.path,
    );
    final l1 = store1.acquire(firstUrl);
    final model1 = await l1.future;
    expect(model1.fast, isNotNull);
    expect(store1.networkDownloads, 1);
    expect(store1.diskSourceHits, 0);
    expect(server.stats.value.tgsRequests, 1);
    l1.release();
    store1.dispose();

    // 2. Fresh store hits `.tgsbin` disk cache with zero HTTP traffic.
    final store2 = NetworkTgsStore(
      framePaced: false,
      sourceCacheDirectory: cacheDir.path,
    );
    final l2 = store2.acquire(firstUrl);
    final model2 = await l2.future;
    expect(model2.fast!.contentKey, model1.fast!.contentKey);
    expect(store2.networkDownloads, 0);
    expect(store2.diskSourceHits, 1);
    expect(server.stats.value.tgsRequests, 1);
    l2.release();

    // Clearing cache forces fresh HTTP fetch next time.
    await store2.clearMemoryAndUrlDiskCache();
    final l3 = store2.acquire(firstUrl);
    await l3.future;
    expect(store2.networkDownloads, 1);
    expect(server.stats.value.tgsRequests, 2);
    l3.release();
    store2.dispose();

    // 3. Offscreen socket abort skips decode stage + priority jump runs first.
    final fetchOrder = <String>[];
    final gates = <String, Completer<FastLottieNetworkFetchResult>>{};
    var decodeCalls = 0;

    final prioritizedStore = NetworkTgsStore(
      httpConcurrency: 1,
      decodeConcurrency: 1,
      batchSize: 1,
      framePaced: false,
      fetcher: (uri, {cancelToken, sourceCacheDirectory}) {
        final name = uri.path;
        fetchOrder.add(name);
        final c = Completer<FastLottieNetworkFetchResult>();
        gates[name] = c;
        cancelToken?.addCancelListener(() {
          if (!c.isCompleted) {
            c.completeError(const FastLottieNetworkCancelledException());
          }
        });
        return c.future;
      },
      decoder: (_, _) async {
        decodeCalls++;
        return _dummyModel();
      },
    );
    addTearDown(prioritizedStore.dispose);

    final a = prioritizedStore.acquire('http://local/a.tgs');
    await Future<void>.delayed(Duration.zero);
    final b = prioritizedStore.acquire('http://local/b.tgs');
    final c = prioritizedStore.acquire('http://local/c.tgs');
    final d = prioritizedStore.acquire('http://local/d.tgs', priority: true);

    // Release `a` while its socket is active -> aborts without decoding!
    // Release `b` while queued -> cancelled without opening socket!
    a.release();
    b.release();
    await expectLater(a.future, throwsA(isA<TgsLoadCancelled>()));
    await expectLater(b.future, throwsA(isA<TgsLoadCancelled>()));
    expect(prioritizedStore.cancelledFetches, 1);

    await Future<void>.delayed(Duration.zero);
    // With `httpConcurrency: 1`, priority entry `/d.tgs` starts immediately after `/a.tgs` aborts.
    expect(gates['/d.tgs'], isNotNull);
    expect(gates['/c.tgs'], isNull);
    gates['/d.tgs']!.complete(
      FastLottieNetworkFetchResult(Uint8List(4), fromDiskCache: false),
    );
    await d.future;

    for (var i = 0; i < 20 && gates['/c.tgs'] == null; i++) {
      await Future<void>.delayed(Duration.zero);
    }
    expect(gates['/c.tgs'], isNotNull);
    gates['/c.tgs']!.complete(
      FastLottieNetworkFetchResult(Uint8List(4), fromDiskCache: false),
    );
    await c.future;

    // `d` jumped ahead of queued `c` (excluding aborted `/a.tgs` & unstarted `/b.tgs`).
    expect(fetchOrder, ['/a.tgs', '/d.tgs', '/c.tgs']);
    expect(decodeCalls, 2);
    c.release();
    d.release();
  });

  testWidgets(
    'CupertinoChatScreen runs purely in CupertinoApp without Material, sends emojis & direct-vector stickers over HTTP',
    (tester) async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);

      tester.view.physicalSize = const Size(412, 900);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      late LocalTgsServer server;
      await tester.runAsync(() async {
        server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
      });
      addTearDown(() async {
        await tester.runAsync(() => server.close(force: true));
      });

      final cacheDir = Directory.systemTemp.createTempSync('cupertino_chat_');
      addTearDown(() => cacheDir.deleteSync(recursive: true));

      final netStore = NetworkTgsStore(
        framePaced: true,
        sourceCacheDirectory: cacheDir.path,
      );
      addTearDown(netStore.dispose);

      await tester.pumpWidget(
        CupertinoApp(
          home: CupertinoChatScreen(
            externalServerUri: server.baseUri,
            store: netStore,
          ),
        ),
      );

      for (
        var i = 0;
        i < 80 &&
            find
                .byKey(const ValueKey('cupertino-message-list'))
                .evaluate()
                .isEmpty;
        i++
      ) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }

      expect(find.byType(CupertinoPageScaffold), findsOneWidget);
      expect(
        find.byKey(const ValueKey('cupertino-message-list')),
        findsOneWidget,
      );
      expect(tester.takeException(), isNull);

      // Seeded chat contains animated inline network emojis and a received hero vector sticker.
      expect(find.byType(InlineNetworkSticker), findsWidgets);
      expect(find.byType(HeroNetworkSticker), findsWidgets);

      // Wait briefly for initial seed hero sticker to decode over HTTP + isolate.
      for (var i = 0; i < 80; i++) {
        final heroes = tester.widgetList<FastLottie>(
          find.descendant(
            of: find.byType(HeroNetworkSticker),
            matching: find.byType(FastLottie),
          ),
        );
        if (heroes.isNotEmpty) break;
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }

      // Open sticker/emoji drawer via composer button.
      await tester.tap(find.byKey(const ValueKey('composer-picker-toggle')));
      await tester.pump();
      expect(
        find.byKey(const ValueKey('sticker-picker-panel')),
        findsOneWidget,
      );
      expect(find.byKey(const ValueKey('sticker-picker-grid')), findsOneWidget);
      expect(
        find.byKey(const ValueKey('picker-tab-NotoEmoji')),
        findsOneWidget,
      );

      // Switch to Emoji tab, tap first emoji to insert 1-char PUA token with inline animated sticker.
      await tester.tap(find.byKey(const ValueKey('picker-tab-__emoji__')));
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('picker-emoji-0')));
      await tester.pump();

      final field = tester.widget<CupertinoTextField>(
        find.byKey(const ValueKey('chat-composer-field')),
      );
      final composerCtrl = field.controller! as EmojiComposerController;
      // Exactly 1 UTF-16 code unit in composer text (BMP PUA base 0xE000).
      expect(composerCtrl.text.length, 1);
      expect(composerCtrl.text.codeUnitAt(0), EmojiComposerController.puaBase);
      expect(composerCtrl.toShortcodeText(), contains(':studio_microphone:'));

      // The animated InlineNetworkSticker is mounted directly inside the CupertinoTextField!
      expect(
        find.descendant(
          of: find.byKey(const ValueKey('chat-composer-field')),
          matching: find.byType(InlineNetworkSticker),
        ),
        findsOneWidget,
      );

      // Typing a typed shortcode (e.g. `:nail_polish:`) automatically collapses into
      // a second inline animated sticker in the composer!
      await tester.enterText(
        find.byKey(const ValueKey('chat-composer-field')),
        '${composerCtrl.text} :nail_polish: Cupertino Network!',
      );
      await tester.pump();

      expect(
        find.descendant(
          of: find.byKey(const ValueKey('chat-composer-field')),
          matching: find.byType(InlineNetworkSticker),
        ),
        findsNWidgets(2),
      );
      expect(composerCtrl.toShortcodeText(), contains(':studio_microphone:'));
      expect(composerCtrl.toShortcodeText(), contains(':nail_polish:'));

      await tester.tap(find.byKey(const ValueKey('composer-send-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 260));

      expect(find.textContaining('Cupertino Network!'), findsOneWidget);

      // Typing or pasting native Unicode emojis (e.g. `😀` and `🔥`) automatically
      // collapses into animated Noto Emoji stickers in the composer!
      await tester.enterText(
        find.byKey(const ValueKey('chat-composer-field')),
        'Testing native emoji 😀 and 🔥!',
      );
      await tester.pump();
      expect(
        find.descendant(
          of: find.byKey(const ValueKey('chat-composer-field')),
          matching: find.byType(InlineNetworkSticker),
        ),
        findsNWidgets(2),
      );
      expect(composerCtrl.toShortcodeText(), contains(':smile:'));
      expect(composerCtrl.toShortcodeText(), contains(':burn:'));

      await tester.tap(find.byKey(const ValueKey('composer-send-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 260));
      expect(find.textContaining('Testing native emoji'), findsOneWidget);

      // `enterText` focuses the field, which dismisses the drawer just like a soft keyboard;
      // re-open the drawer, switch to All stickers, and send a hero TGS sticker.
      expect(find.byKey(const ValueKey('sticker-picker-panel')), findsNothing);
      await tester.tap(find.byKey(const ValueKey('composer-picker-toggle')));
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('picker-tab-__all__')));
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('send-sticker-0')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 260));

      // Dismiss the drawer so the full message list shows both the newly sent and seeded hero stickers.
      await tester.tap(find.byKey(const ValueKey('composer-picker-toggle')));
      await tester.pump();

      for (var i = 0; i < 80; i++) {
        final heroes = tester
            .widgetList<FastLottie>(
              find.descendant(
                of: find.byType(HeroNetworkSticker),
                matching: find.byType(FastLottie),
              ),
            )
            .toList();
        if (heroes.length >= 2) break;
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }

      final heroFastWidgets = tester
          .widgetList<FastLottie>(
            find.descendant(
              of: find.byType(HeroNetworkSticker),
              matching: find.byType(FastLottie),
            ),
          )
          .toList();
      expect(heroFastWidgets.length, greaterThanOrEqualTo(2));
      for (final hero in heroFastWidgets) {
        expect(hero.usePipeline, isFalse);
        expect(hero.rasterCache, isNull);
        expect(hero.useFrameRate, isTrue);
        expect(
          hero.cache.maximumFrames,
          FastLottieCache.unbounded.maximumFrames,
        );
      }

      // Open CupertinoActionSheet options & verify Mini-Strip -> Ping-Pong toggle & telemetry.
      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(find.byType(CupertinoActionSheet), findsOneWidget);
      await tester.tap(
        find.byKey(const ValueKey('toggle-raster-strategy-action')),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(tester.takeException(), isNull);

      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(
        find.text('Raster Strategy: Ping-Pong K=1 (Switch to Mini-Strip)'),
        findsOneWidget,
      );
      await tester.tap(
        find.byKey(const ValueKey('toggle-raster-strategy-action')),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));

      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      await tester.tap(find.text('View Server & Cache Telemetry'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(
        find.descendant(
          of: find.byType(CupertinoAlertDialog),
          matching: find.textContaining('Strategy: Mini-Strip (Adaptive K)'),
        ),
        findsOneWidget,
      );
      expect(find.textContaining('Worker Dispatches (IPC):'), findsOneWidget);
      await tester.tap(find.text('OK'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));

      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      await tester.tap(find.text('Switch to Light Mode'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(tester.takeException(), isNull);

      await tester.pumpWidget(const SizedBox());
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 50)),
      );
      await tester.pump();
    },
  );

  testWidgets('FastLottieCupertinoApp mounts main entry cleanly', (
    tester,
  ) async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    await tester.pumpWidget(const FastLottieCupertinoApp());
    for (
      var i = 0;
      i < 120 &&
          find
              .byKey(const ValueKey('cupertino-message-list'))
              .evaluate()
              .isEmpty;
      i++
    ) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump();
    }
    expect(find.byType(CupertinoApp), findsOneWidget);
    expect(
      find.byKey(const ValueKey('cupertino-message-list')),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 50)),
    );
    await tester.pump();
  });

  testWidgets(
    'InlineNetworkSticker locks raster keySize across header/bubble/grid sizes without thrashing',
    (tester) async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);

      tester.view.physicalSize = const Size(412 * 2.625, 915 * 2.625);
      tester.view.devicePixelRatio = 2.625;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      late LocalTgsServer server;
      await tester.runAsync(() async {
        server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
      });
      addTearDown(() async {
        await tester.runAsync(() => server.close(force: true));
      });

      final store = NetworkTgsStore(framePaced: false);
      final rasterCache = FastLottieRasterCache.miniStrip(
        maximumBytes: 16 * 1024 * 1024,
        maximumFrameRate: 30,
      );
      final item = server.catalog.emojis.first;
      final sheet = StickerSheet(
        assets: [item.urlString],
        pixelSize: 96,
        store: store,
        rasterCache: rasterCache,
        frameRate: 30,
      );
      final clock = StickerClock()
        ..configure(playing: true, reducedMotion: false, maximumFrameRate: 30);

      addTearDown(() {
        clock.dispose();
        sheet.dispose();
        rasterCache.dispose();
        store.dispose();
      });

      await tester.pumpWidget(
        CupertinoApp(
          home: CupertinoPageScaffold(
            child: Column(
              children: [
                InlineNetworkSticker(
                  item: item,
                  sheet: sheet,
                  clock: clock,
                  store: store,
                  renderer: ChatRendererMode.fastlottie,
                  still: false,
                  size: 24,
                ),
                InlineNetworkSticker(
                  item: item,
                  sheet: sheet,
                  clock: clock,
                  store: store,
                  renderer: ChatRendererMode.fastlottie,
                  still: false,
                  size: 23.2,
                ),
                InlineNetworkSticker(
                  item: item,
                  sheet: sheet,
                  clock: clock,
                  store: store,
                  renderer: ChatRendererMode.fastlottie,
                  still: false,
                  size: 80,
                ),
              ],
            ),
          ),
        ),
      );

      for (var i = 0; i < 80 && rasterCache.renderedFrames == 0; i++) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 15)),
        );
        await tester.pump(const Duration(milliseconds: 33));
      }

      expect(sheet.activePlayers, 1);
      expect(rasterCache.strategy, FastLottieRasterStrategy.miniStrip);
      expect(rasterCache.entries, 1);
      expect(rasterCache.debugAdmissionAttempts, 1);
      expect(rasterCache.renderedFrames, greaterThan(0));
      expect(rasterCache.workerDispatches, greaterThanOrEqualTo(1));

      await tester.pumpWidget(const SizedBox());
    },
  );

  group('EmojiComposerController & EmojiShortcodeTextInputFormatter', () {
    test('1-character UTF-16 code unit rule, shortcode roundtrip, and single-tap backspace', () async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);

      final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
      addTearDown(() => server.close(force: true));

      final catalog = server.catalog;
      final store = NetworkTgsStore(framePaced: false);
      final rasterCache = FastLottieRasterCache.pingPong(
        maximumBytes: 8 * 1024 * 1024,
      );
      final sheet = StickerSheet(
        assets: [for (final e in catalog.emojis) e.urlString],
        pixelSize: 96,
        store: store,
        rasterCache: rasterCache,
        frameRate: 30,
      );
      final clock = StickerClock()
        ..configure(playing: true, reducedMotion: false, maximumFrameRate: 30);
      addTearDown(() {
        clock.dispose();
        sheet.dispose();
        rasterCache.dispose();
        store.dispose();
      });

      final controller = EmojiComposerController(
        catalog: catalog,
        sheet: sheet,
        clock: clock,
        store: store,
      );
      addTearDown(controller.dispose);

      // Verify charForEmoji maps each emoji deterministically to exactly 1 UTF-16 code unit
      expect(catalog.emojis.length, 969);
      for (var i = 0; i < catalog.emojis.length; i++) {
        final char = controller.charForEmoji(catalog.emojis[i])!;
        expect(char.length, 1);
        expect(char.codeUnitAt(0), EmojiComposerController.puaBase + i);
      }

      // Roundtrip test: text with mixed shortcodes -> PUA -> shortcode
      const original = 'Xin chào :studio_microphone: và :nail_polish: nhé!';
      final decoded = controller.decodeShortcodes(original);
      expect(decoded.length, 'Xin chào \uE000 và \uE001 nhé!'.length);
      expect(controller.toShortcodeText(decoded), original);

      // Unicode emoji -> PUA -> shortcode roundtrip
      final decodedUnicode = controller.decodeShortcodes('Chào 😀 và ❤️ nhé!');
      expect(decodedUnicode.contains('😀'), isFalse);
      expect(decodedUnicode.contains('❤️'), isFalse);
      final asShortcode = controller.toShortcodeText(decodedUnicode);
      expect(asShortcode, contains(':smile:'));
      expect(asShortcode, contains(':red_heart:'));

      // Raw Unicode emoji passed to toShortcodeText directly converts to shortcode
      final rawConverted = controller.toShortcodeText('Gặp nhau 😀 và ❤️‍🔥');
      expect(rawConverted, 'Gặp nhau :smile: và :heart_on_fire:');

      // Verify single-tap backspace behavior:
      // When text is 'Hi \uE000', cursor at index 4 (right after emoji).
      controller.value = TextEditingValue(
        text: 'Hi ${String.fromCharCode(EmojiComposerController.puaBase)}',
        selection: const TextSelection.collapsed(offset: 4),
      );
      expect(controller.text.length, 4);

      // Simulate Backspace: delete 1 code unit before caret
      final textBefore = controller.value.selection.textBefore(controller.text);
      final textAfter = controller.value.selection.textAfter(controller.text);
      final backspaced =
          textBefore.substring(0, textBefore.length - 1) + textAfter;
      controller.value = TextEditingValue(
        text: backspaced,
        selection: TextSelection.collapsed(offset: textBefore.length - 1),
      );
      expect(controller.text, 'Hi ');
      expect(controller.text.length, 3);
      expect(
        controller.text.contains(
          String.fromCharCode(EmojiComposerController.puaBase),
        ),
        isFalse,
      );
    });

    test('EmojiShortcodeTextInputFormatter auto-collapses typed :shortcode: on closing colon', () {
      final catalog = TgsRemoteCatalog(
        baseUri: Uri.parse('http://127.0.0.1:8080/'),
        packs: [],
        stickers: [],
        emojis: [
          TgsRemoteItem(
            id: 'e0',
            packId: 'pack_emoji',
            packTitle: 'Topics',
            fileName: '0.tgs',
            kind: TgsItemKind.emoji,
            relativePath: 'tgs/0.tgs',
            label: 'Studio Microphone',
            bytes: 100,
            uri: Uri.parse('http://127.0.0.1:8080/tgs/0.tgs'),
            shortcode: ':studio_microphone:',
          ),
          TgsRemoteItem(
            id: 'e1',
            packId: 'pack_emoji',
            packTitle: 'Topics',
            fileName: '1.tgs',
            kind: TgsItemKind.emoji,
            relativePath: 'tgs/1.tgs',
            label: 'High Voltage',
            bytes: 100,
            uri: Uri.parse('http://127.0.0.1:8080/tgs/1.tgs'),
            shortcode: ':zap:',
          ),
          TgsRemoteItem(
            id: 'e2',
            packId: 'NotoEmoji',
            packTitle: 'Noto Emoji',
            fileName: 'emoji_u1f600.tgs',
            kind: TgsItemKind.emoji,
            relativePath: 'tgs/NotoEmoji/emoji_u1f600.tgs',
            label: 'Grinning Face',
            bytes: 100,
            uri: Uri.parse(
              'http://127.0.0.1:8080/tgs/NotoEmoji/emoji_u1f600.tgs',
            ),
            shortcode: ':smile:',
          ),
          TgsRemoteItem(
            id: 'e3',
            packId: 'NotoEmoji',
            packTitle: 'Noto Emoji',
            fileName: 'emoji_u1f426_200d_1f525.tgs',
            kind: TgsItemKind.emoji,
            relativePath: 'tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
            label: 'Phoenix',
            bytes: 100,
            uri: Uri.parse(
              'http://127.0.0.1:8080/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
            ),
            shortcode: ':phoenix:',
          ),
        ],
      );

      final formatter = EmojiShortcodeTextInputFormatter(() => catalog);

      // Typing normal text without closing colon does not change text
      final v1 = formatter.formatEditUpdate(
        const TextEditingValue(
          text: 'Hello :studi',
          selection: TextSelection.collapsed(offset: 12),
        ),
        const TextEditingValue(
          text: 'Hello :studio',
          selection: TextSelection.collapsed(offset: 13),
        ),
      );
      expect(v1.text, 'Hello :studio');

      // Typing closing colon finishes shortcode -> converts to 1-char PUA token!
      final v2 = formatter.formatEditUpdate(
        const TextEditingValue(
          text: 'Hello :studio_microphone',
          selection: TextSelection.collapsed(offset: 24),
        ),
        const TextEditingValue(
          text: 'Hello :studio_microphone:',
          selection: TextSelection.collapsed(offset: 25),
        ),
      );
      expect(v2.text, 'Hello \uE000');
      expect(v2.text.length, 7); // 'Hello ' (6) + '\uE000' (1)
      expect(
        v2.selection.baseOffset,
        7,
      ); // Caret is positioned cleanly right after the emoji

      // Unknown shortcode is not collapsed
      final v3 = formatter.formatEditUpdate(
        const TextEditingValue(
          text: ':not_real',
          selection: TextSelection.collapsed(offset: 9),
        ),
        const TextEditingValue(
          text: ':not_real:',
          selection: TextSelection.collapsed(offset: 10),
        ),
      );
      expect(v3.text, ':not_real:');

      // Active IME composing range is respected and untouched
      final v4 = formatter.formatEditUpdate(
        const TextEditingValue(
          text: 'đang gõ',
          composing: TextRange(start: 5, end: 7),
        ),
        const TextEditingValue(
          text: 'đang gõ :zap:',
          composing: TextRange(start: 5, end: 13),
        ),
      );
      expect(v4.text, 'đang gõ :zap:');

      // Typing or pasting Unicode emoji collapses immediately to 1-char PUA token!
      final vEmoji = formatter.formatEditUpdate(
        const TextEditingValue(
          text: 'Hello ',
          selection: TextSelection.collapsed(offset: 6),
        ),
        const TextEditingValue(
          text: 'Hello 😀',
          selection: TextSelection.collapsed(
            offset: 8,
          ), // 6 + 2 UTF-16 code units
        ),
      );
      expect(vEmoji.text, 'Hello \uE002');
      expect(vEmoji.text.length, 7);
      expect(vEmoji.selection.baseOffset, 7);

      // Pasting ZWJ sequence emoji (5 UTF-16 code units) collapses cleanly to 1 PUA char
      final vZwj = formatter.formatEditUpdate(
        const TextEditingValue(
          text: '',
          selection: TextSelection.collapsed(offset: 0),
        ),
        const TextEditingValue(
          text: '🐦\u200D🔥',
          selection: TextSelection.collapsed(offset: 5),
        ),
      );
      expect(vZwj.text, '\uE003');
      expect(vZwj.text.length, 1);
      expect(vZwj.selection.baseOffset, 1);

      // Mixed text containing both typed shortcode and Unicode emoji
      final vMixed = formatter.formatEditUpdate(
        const TextEditingValue(
          text: '',
          selection: TextSelection.collapsed(offset: 0),
        ),
        const TextEditingValue(
          text: 'Hi :zap: and 😀 now',
          selection: TextSelection.collapsed(offset: 18),
        ),
      );
      expect(vMixed.text, 'Hi \uE001 and \uE002 now');
    });

    testWidgets(
      'EmojiComposerController.buildTextSpan emits WidgetSpan with InlineNetworkSticker',
      (tester) async {
        final previous = HttpOverrides.current;
        HttpOverrides.global = _PassthroughHttpOverrides();
        addTearDown(() => HttpOverrides.global = previous);

        late LocalTgsServer server;
        await tester.runAsync(() async {
          server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
        });
        addTearDown(() async {
          await tester.runAsync(() => server.close(force: true));
        });

        final catalog = server.catalog;
        final store = NetworkTgsStore(framePaced: false);
        final rasterCache = FastLottieRasterCache.pingPong(
          maximumBytes: 16 * 1024 * 1024,
          maximumFrameRate: 30,
        );
        final sheet = StickerSheet(
          assets: [for (final e in catalog.emojis) e.urlString],
          pixelSize: 96,
          store: store,
          rasterCache: rasterCache,
          frameRate: 30,
        );
        final clock = StickerClock()
          ..configure(
            playing: true,
            reducedMotion: false,
            maximumFrameRate: 30,
          );

        final controller = EmojiComposerController(
          catalog: catalog,
          sheet: sheet,
          clock: clock,
          store: store,
        );
        addTearDown(() {
          controller.dispose();
          clock.dispose();
          sheet.dispose();
          rasterCache.dispose();
          store.dispose();
        });

        controller.text = 'A\uE000B';

        late BuildContext capturedContext;
        await tester.pumpWidget(
          CupertinoApp(
            home: Builder(
              builder: (ctx) {
                capturedContext = ctx;
                return const SizedBox();
              },
            ),
          ),
        );

        final span = controller.buildTextSpan(
          context: capturedContext,
          withComposing: false,
        );

        expect(span.children, isNotNull);
        expect(span.children!.length, 3);
        expect((span.children![0] as TextSpan).text, 'A');
        expect(span.children![1], isA<WidgetSpan>());
        final widgetSpan = span.children![1] as WidgetSpan;
        expect(widgetSpan.alignment, PlaceholderAlignment.middle);
        expect(widgetSpan.child, isA<Padding>());
        final padding = widgetSpan.child as Padding;
        expect(padding.child, isA<InlineNetworkSticker>());
        final sticker = padding.child as InlineNetworkSticker;
        expect(sticker.size, 21);
        expect(sticker.repaintBoundary, isTrue);
        expect((span.children![2] as TextSpan).text, 'B');
      },
    );

    testWidgets(
      'Reduce Motion freezes clock & hero animations while still loading HTTP models and rendering static frame 0',
      (tester) async {
        final previous = HttpOverrides.current;
        HttpOverrides.global = _PassthroughHttpOverrides();
        addTearDown(() => HttpOverrides.global = previous);

        late LocalTgsServer server;
        await tester.runAsync(() async {
          server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
        });
        addTearDown(() async {
          await tester.runAsync(() => server.close(force: true));
        });

        await tester.pumpWidget(
          CupertinoApp(
            builder: (ctx, child) => MediaQuery(
              data: MediaQuery.of(ctx).copyWith(disableAnimations: true),
              child: child!,
            ),
            home: CupertinoChatScreen(externalServerUri: server.baseUri),
          ),
        );

        for (
          var i = 0;
          i < 80 &&
              find
                  .byKey(const ValueKey('cupertino-message-list'))
                  .evaluate()
                  .isEmpty;
          i++
        ) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 10)),
          );
          await tester.pump();
        }

        // Wait for seeded hero sticker to finish HTTP download even under Reduce Motion.
        for (var i = 0; i < 80; i++) {
          final heroes = tester.widgetList<FastLottie>(
            find.descendant(
              of: find.byType(HeroNetworkSticker),
              matching: find.byType(FastLottie),
            ),
          );
          if (heroes.isNotEmpty) break;
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 10)),
          );
          await tester.pump();
        }

        final heroFast = tester.widget<FastLottie>(
          find
              .descendant(
                of: find.byType(HeroNetworkSticker),
                matching: find.byType(FastLottie),
              )
              .first,
        );
        expect(heroFast.animate, isFalse);

        // Insert an emoji into the composer under Reduce Motion; it must still
        // mount InlineNetworkSticker with `still: true`.
        await tester.enterText(
          find.byKey(const ValueKey('chat-composer-field')),
          'Static :studio_microphone:',
        );
        await tester.pump();

        final inlineInComposer = tester.widget<InlineNetworkSticker>(
          find.descendant(
            of: find.byKey(const ValueKey('chat-composer-field')),
            matching: find.byType(InlineNetworkSticker),
          ),
        );
        expect(inlineInComposer.still, isTrue);

        await tester.pumpWidget(const SizedBox());
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 50)),
        );
        await tester.pump();
      },
    );
  });
}
