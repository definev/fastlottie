import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/main.dart';
import 'package:fastlottie_example/tgs/clock.dart';
import 'package:fastlottie_example/tgs/cupertino_chat.dart';
import 'package:fastlottie_example/tgs/emoji_posters.dart';
import 'package:fastlottie_example/tgs/network_server.dart';
import 'package:fastlottie_example/tgs/network_store.dart';
import 'package:fastlottie_example/tgs/pack_assets.dart';
import 'package:fastlottie_example/tgs/sheet.dart';
import 'package:fastlottie_example/tgs/store.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.

import 'package:cupertino_ui/cupertino_ui.dart';
import 'package:flutter/foundation.dart'
    show debugDefaultTargetPlatformOverride;
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../tool/pack_server.dart';

class _PassthroughHttpOverrides extends HttpOverrides {}

class _CountingBundle extends CachingAssetBundle {
  final pageLoads = <String, int>{};

  @override
  Future<ByteData> load(String key) {
    if (key.endsWith('.bin')) {
      pageLoads.update(key, (count) => count + 1, ifAbsent: () => 1);
    }
    return rootBundle.load(key);
  }
}

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
  testWidgets('opening All reads each visible poster page once', (
    tester,
  ) async {
    final bundle = _CountingBundle();
    final assets = PackAssets(bundle: bundle);
    addTearDown(assets.dispose);
    await tester.runAsync(() async {
      final catalog = await assets.catalog(PackAssets.bundleOrigin);
      for (final item in catalog.stickers.take(20)) {
        await assets.fetch(item.poster!.uri);
      }
    });
    expect(bundle.pageLoads, isNotEmpty);
    expect(bundle.pageLoads.values, everyElement(1));
  });

  test(
    'Pack server provides immutable assets and a reusable offline catalog',
    () async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);
      final server = await PackServer.start(
        Directory('assets'),
        port: 0,
        animationDelay: const Duration(seconds: 2),
      );
      final directory = await Directory.systemTemp.createTemp(
        'fastlottie_pack_',
      );
      final assets = PackAssets()..cacheDirectory = directory.path;
      final client = HttpClient();
      addTearDown(() async {
        client.close(force: true);
        assets.dispose();
        await server.close();
        await directory.delete(recursive: true);
      });
      final endpoint = server.baseUri.resolve('/v1/catalog');
      final first = await (await client.getUrl(endpoint)).close();
      final etag = first.headers.value(HttpHeaders.etagHeader);
      await first.drain<void>();
      expect(etag, isNotNull);
      final conditional = await client.getUrl(endpoint);
      conditional.headers.set(HttpHeaders.ifNoneMatchHeader, etag!);
      final unchanged = await conditional.close();
      expect(unchanged.statusCode, HttpStatus.notModified);
      await unchanged.drain<void>();
      final catalog = await assets.catalog(server.baseUri);
      expect(catalog.stickerPacks.length, 5);
      expect(catalog.emojiPacks.length, 1);
      expect(
        catalog.stickerPacks.map((p) => p.id),
        contains('Topics-1794247486249'),
      );
      expect(catalog.emojiPacks.single.id, 'NotoEmoji');
      expect(catalog.packs.every((pack) => pack.revision != null), isTrue);
      final emoji = catalog.emojis.first;
      final sticker = catalog.stickers.first;
      final head = await (await client.headUrl(sticker.largePoster!.uri))
          .close();
      expect(
        head.headers.value(HttpHeaders.cacheControlHeader),
        contains('immutable'),
      );
      expect(head.headers.contentType?.mimeType, 'image/png');
      await head.drain<void>();

      var animationReady = false;
      final animation = assets.fetch(emoji.uri).then((result) {
        animationReady = true;
        return result;
      });
      final image = await assets.fetch(emoji.poster!.uri);
      expect(image.bytes.take(8), [137, 80, 78, 71, 13, 10, 26, 10]);
      expect(animationReady, isFalse);
      expect((await animation).bytes, isNotEmpty);
      final cached = await assets.cachedCatalog(server.baseUri);
      expect(cached!.emojis.first.revision, emoji.revision);
      for (var i = 0; i < 100; i++) {
        final copy = await assets.fetch(emoji.poster!.uri);
        if (copy.fromDiskCache) break;
        await Future<void>.delayed(const Duration(milliseconds: 2));
      }
      await server.close();
      expect(
        (await assets.catalog(server.baseUri)).emojis.first.revision,
        emoji.revision,
      );
      expect((await assets.fetch(emoji.poster!.uri)).fromDiskCache, isTrue);
    },
  );

  test('LocalTgsServer serves catalog, TGS binary payloads, ETag 304, and failure states', () async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
    addTearDown(() => server.close(force: true));

    final catalog = await fetchRemoteTgsCatalog(server.baseUri);
    expect(catalog.packs.length, 6);
    expect(catalog.stickers.length, 182);
    expect(catalog.emojis.length, 881);
    expect(catalog.shortcodeMap.length, 881);
    expect(
      catalog.stickerPacks.map((p) => p.id),
      contains('Topics-1794247486249'),
    );
    expect(catalog.emojiPacks.map((p) => p.id), ['NotoEmoji']);
    expect(catalog.shortcodeMap.containsKey(':studio_microphone:'), isFalse);
    expect(catalog.shortcodeMap.containsKey(':cool_1f192:'), isTrue);
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
      expect(emoji.unicode, isNotNull);
    }

    final client = HttpClient();
    addTearDown(() => client.close(force: true));

    final healthReq = await client.getUrl(server.baseUri.resolve('/health'));
    final healthResp = await healthReq.close();
    expect(healthResp.statusCode, HttpStatus.ok);
    final healthJson =
        jsonDecode(await utf8.decodeStream(healthResp)) as Map<String, dynamic>;
    expect(healthJson['ok'], isTrue);
    expect(healthJson['stickers'], 182);
    expect(healthJson['emojis'], 881);

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

      // The stress history is reachable immediately and uses actual chat
      // sticker widgets, including twelve distinct emoji in one message.
      final stressEmoji = find.byWidgetPredicate((widget) {
        final key = widget.key;
        return key is ValueKey<String> && key.value.startsWith('stress_emoji_');
      }).first;
      final stressIcons = tester.widgetList<InlineNetworkSticker>(
        find.descendant(
          of: stressEmoji,
          matching: find.byType(InlineNetworkSticker),
        ),
      );
      expect(
        stressIcons.map((icon) => icon.item.urlString).toSet(),
        hasLength(12),
      );
      expect(
        find.byWidgetPredicate((widget) {
          final key = widget.key;
          return widget is HeroNetworkSticker &&
              key is ValueKey<String> &&
              key.value.startsWith('sent-sticker-stress_sticker_');
        }),
        findsWidgets,
      );

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
      final tabScrollable = find.descendant(
        of: find.byKey(const ValueKey('sticker-picker-panel')),
        matching: find.byWidgetPredicate(
          (w) => w is Scrollable && w.axisDirection == AxisDirection.right,
        ),
      );
      await tester.scrollUntilVisible(
        find.byKey(const ValueKey('picker-tab-Topics-1794247486249')),
        120,
        scrollable: tabScrollable,
      );
      expect(
        find.byKey(const ValueKey('picker-tab-Topics-1794247486249')),
        findsOneWidget,
      );
      tester.state<ScrollableState>(tabScrollable).position.jumpTo(0);
      await tester.pump();

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
      expect(composerCtrl.toShortcodeText(), contains(':cool_1f192:'));

      // The animated InlineNetworkSticker is mounted directly inside the CupertinoTextField!
      expect(
        find.descendant(
          of: find.byKey(const ValueKey('chat-composer-field')),
          matching: find.byType(InlineNetworkSticker),
        ),
        findsOneWidget,
      );

      // Typing a typed shortcode (e.g. `:nail_care:`) automatically collapses into
      // a second inline animated sticker in the composer!
      await tester.enterText(
        find.byKey(const ValueKey('chat-composer-field')),
        '${composerCtrl.text} :nail_care: Cupertino Network!',
      );
      await tester.pump();

      expect(
        find.descendant(
          of: find.byKey(const ValueKey('chat-composer-field')),
          matching: find.byType(InlineNetworkSticker),
        ),
        findsNWidgets(2),
      );
      expect(composerCtrl.toShortcodeText(), contains(':cool_1f192:'));
      expect(composerCtrl.toShortcodeText(), contains(':nail_care:'));

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

      // Check the strip size toggle and telemetry.
      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(find.byType(CupertinoActionSheet), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('toggle-strip-size-action')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(tester.takeException(), isNull);

      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(
        find.textContaining(
          RegExp(r'Use (adaptive strips|6 frames per strip)'),
        ),
        findsOneWidget,
      );
      await tester.tap(find.byKey(const ValueKey('toggle-strip-size-action')));
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
          matching: find.textContaining(
            RegExp(r'Buffering: (Adaptive strips|Frames per strip: 6)'),
          ),
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

  testWidgets('Android All picker animates every sticker at the bottom', (
    tester,
  ) async {
    debugDefaultTargetPlatformOverride = TargetPlatform.android;
    addTearDown(() => debugDefaultTargetPlatformOverride = null);
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.5;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final assets = PackAssets();
    addTearDown(assets.dispose);
    final catalog = (await tester.runAsync(
      () => assets.catalog(PackAssets.bundleOrigin),
    ))!;
    final bottomItems = catalog.stickers
        .skip(catalog.stickers.length - 14)
        .toList();
    // Keep rootBundle futures out of fake time when other tests reuse them.
    await tester.runAsync(
      () => Future.wait([
        for (final item in bottomItems) assets.fetch(item.poster!.uri),
      ]),
    );
    final store = NetworkTgsStore(framePaced: false, fetcher: assets.fetch);
    addTearDown(store.dispose);
    await tester.pumpWidget(
      CupertinoApp(
        home: CupertinoChatScreen(
          initialCatalog: Future.value(catalog),
          store: store,
        ),
      ),
    );

    Future<void> advance() async {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump(const Duration(microseconds: 33334));
    }

    final toggle = find.byKey(const ValueKey('composer-picker-toggle'));
    for (var i = 0; i < 80 && toggle.evaluate().isEmpty; i++) {
      await advance();
    }
    await tester.tap(toggle);
    await tester.pump();

    final grid = find.byKey(const ValueKey('sticker-picker-grid'));
    final position = tester
        .state<ScrollableState>(
          find.descendant(of: grid, matching: find.byType(Scrollable)),
        )
        .position;
    position.jumpTo(position.maxScrollExtent);
    await tester.pump();

    final cells = tester
        .widgetList<InlineNetworkSticker>(
          find.descendant(
            of: grid,
            matching: find.byType(InlineNetworkSticker),
          ),
        )
        .toList();
    expect(cells.map((cell) => cell.item), containsAll(bottomItems));
    final sheet = cells.first.sheet;
    final missingRaster = {for (final item in bottomItems) item.urlString};
    for (var i = 0; i < 150 && missingRaster.isNotEmpty; i++) {
      await advance();
      missingRaster.removeWhere(
        (url) => (sheet.playerFor(url)?.rasterBytes ?? 0) > 0,
      );
    }
    expect(sheet.errors, isEmpty);
    expect(sheet.activePlayers, cells.length);
    expect(missingRaster, isEmpty);
    expect(sheet.rasterCache.maximumBytes, 8 * 1024 * 1024);
    expect(
      sheet.rasterCache.reservedBytes,
      lessThanOrEqualTo(sheet.rasterCache.maximumBytes),
    );
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('Android chat and picker keep playing the same sent emoji', (
    tester,
  ) async {
    debugDefaultTargetPlatformOverride = TargetPlatform.android;
    addTearDown(() => debugDefaultTargetPlatformOverride = null);
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.5;

    final assets = PackAssets();
    addTearDown(assets.dispose);
    const id = 'NotoEmoji/emoji_u1f331.tgs';
    final bundle = (await tester.runAsync(
      () => assets.catalog(PackAssets.bundleOrigin),
    ))!;
    final item = bundle.emojis.firstWhere((item) => item.id == id);
    // Preload the bundled poster page outside the widget test's fake clock.
    await tester.runAsync(() => assets.fetch(item.poster!.uri));
    final source = (await tester.runAsync(
      () => rootBundle.load('assets/tgs/$id'),
    ))!;
    final store = NetworkTgsStore(
      framePaced: false,
      fetcher: (_, {cancelToken, sourceCacheDirectory}) async =>
          FastLottieNetworkFetchResult(
            Uint8List.sublistView(source),
            fromDiskCache: false,
          ),
    );
    addTearDown(store.dispose);
    final catalog = TgsRemoteCatalog(
      baseUri: bundle.baseUri,
      packs: const [],
      stickers: const [],
      emojis: [item],
    );
    await tester.pumpWidget(
      CupertinoApp(
        home: CupertinoChatScreen(
          initialCatalog: Future.value(catalog),
          store: store,
        ),
      ),
    );

    Future<void> advance() async {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump(const Duration(microseconds: 33334));
    }

    final toggle = find.byKey(const ValueKey('composer-picker-toggle'));
    for (var i = 0; i < 80 && toggle.evaluate().isEmpty; i++) {
      await advance();
    }
    await tester.tap(toggle);
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('picker-tab-__emoji__')));
    await tester.pump();

    final tile = find.byKey(const ValueKey('picker-emoji-0'));
    await tester.tap(tile);
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('composer-send-button')));
    await tester.pump();

    final sentRow = find.byWidgetPredicate((widget) {
      final key = widget.key;
      return key is ValueKey<String> && key.value.startsWith('msg_');
    });
    final messageEmoji = find.descendant(
      of: sentRow,
      matching: find.byType(InlineNetworkSticker),
    );
    final pickerEmoji = find.descendant(
      of: tile,
      matching: find.byType(InlineNetworkSticker),
    );
    expect(pickerEmoji, findsOneWidget);
    expect(messageEmoji, findsOneWidget);

    FastLottiePlayer? playerFor(Finder emoji) => tester
        .widget<InlineNetworkSticker>(emoji)
        .sheet
        .playerFor(item.urlString);

    for (
      var i = 0;
      i < 60 && (playerFor(pickerEmoji)?.rasterBytes ?? 0) == 0;
      i++
    ) {
      await advance();
    }
    final messagePlayer = playerFor(messageEmoji)!;
    final pickerPlayer = playerFor(pickerEmoji)!;
    expect(messagePlayer.composition, same(pickerPlayer.composition));
    expect(messagePlayer.rasterSize, const Size.square(64));
    expect(pickerPlayer.rasterSize, const Size.square(96));
    for (var i = 0; i < 60 && messagePlayer.rasterBytes == 0; i++) {
      await advance();
    }
    expect(messagePlayer.rasterBytes, greaterThan(0));
    expect(pickerPlayer.rasterBytes, greaterThan(0));

    double progress(Finder emoji) {
      final widget = tester.widget<InlineNetworkSticker>(emoji);
      return widget.sheet.progressFor(
        item.urlString,
        widget.clock,
        poster: item.poster,
      );
    }

    final messageProgress = progress(messageEmoji);
    final pickerProgress = progress(pickerEmoji);
    for (var i = 0; i < 8; i++) {
      await advance();
      expect(messagePlayer.rasterSize, const Size.square(64));
      expect(pickerPlayer.rasterSize, const Size.square(96));
      expect(messagePlayer.rasterBytes, greaterThan(0));
      expect(pickerPlayer.rasterBytes, greaterThan(0));
    }
    expect(progress(messageEmoji), isNot(messageProgress));
    expect(progress(pickerEmoji), isNot(pickerProgress));
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('Inline emoji paints its bundled pose before TGS is available', (
    tester,
  ) async {
    const id = 'NotoEmoji/emoji_u1f331.tgs';
    final uri = Uri.parse('http://localhost/tgs/$id');
    final assets = PackAssets();
    final posters = PackPosterCache(assets);
    final catalog = (await tester.runAsync(
      () => assets.catalog(PackAssets.bundleOrigin),
    ))!;
    final poster = catalog.emojis.firstWhere((item) => item.id == id).poster!;
    final item = TgsRemoteItem(
      id: id,
      packId: 'NotoEmoji',
      packTitle: 'Noto Tags',
      fileName: 'emoji_u1f331.tgs',
      kind: TgsItemKind.emoji,
      relativePath: uri.path,
      uri: uri,
      bytes: 0,
      label: 'Seedling',
      poster: poster,
    );
    await tester.runAsync(() => assets.fetch(poster.uri));
    expect(poster.progress, greaterThan(0));
    final fetch = Completer<FastLottieNetworkFetchResult>();
    var fetchCount = 0;
    final store = NetworkTgsStore(
      framePaced: false,
      fetcher: (_, {cancelToken, sourceCacheDirectory}) {
        fetchCount++;
        return fetch.future;
      },
    );
    final raster = FastLottieRasterCache(
      maximumFrameRate: 30,
      maximumDiskBytes: 0,
      framesPerStrip: 3,
      progressiveFirstFrame: false,
    );
    final sheet = StickerSheet(
      assets: [item.urlString],
      pixelSize: 96,
      store: store,
      rasterCache: raster,
      posterCache: posters,
    );
    final clock = StickerClock();
    addTearDown(() {
      clock.dispose();
      sheet.dispose();
      raster.dispose();
      store.dispose();
      posters.dispose();
      assets.dispose();
    });

    const key = ValueKey('poster-test-sticker');
    await tester.pumpWidget(
      CupertinoApp(
        home: Center(
          child: InlineNetworkSticker(
            key: key,
            item: item,
            sheet: sheet,
            clock: clock,
            store: store,
            renderer: ChatRendererMode.fastlottie,
            still: false,
            size: 96,
            placeholderColor: CupertinoColors.transparent,
          ),
        ),
      ),
    );
    final lease = posters.acquire(poster);
    addTearDown(lease.release);
    for (var i = 0; i < 100 && lease.value == null; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 5)),
      );
      await tester.pump();
    }
    expect(lease.value, isNotNull);
    await tester.pump();
    expect(fetchCount, 1);
    expect(sheet.playerFor(item.urlString), isNull);
    expect(raster.workerDispatches, 0);
    expect(identical(posters.acquire(poster), lease), isTrue);
    lease.release();

    Future<Uint8List> paintEmoji() async {
      final paint = tester.widget<CustomPaint>(
        find.descendant(
          of: find.byKey(key),
          matching: find.byType(CustomPaint),
        ),
      );
      return (await tester.runAsync(() async {
        final recorder = ui.PictureRecorder();
        paint.painter!.paint(Canvas(recorder), const Size.square(96));
        final picture = recorder.endRecording();
        final image = await picture.toImage(96, 96);
        try {
          return Uint8List.sublistView((await image.toByteData())!);
        } finally {
          image.dispose();
          picture.dispose();
        }
      }))!;
    }

    final firstPaint = await paintEmoji();
    expect(
      firstPaint.indexWhere((byte) => byte != 0),
      isNot(-1),
      reason: 'the emoji is visible with the TGS request still pending',
    );

    final tgs = (await tester.runAsync(
      () => rootBundle.load('assets/tgs/$id'),
    ))!;
    fetch.complete(
      FastLottieNetworkFetchResult(
        Uint8List.sublistView(tgs),
        fromDiskCache: false,
      ),
    );
    for (var i = 0; i < 60 && raster.renderedFrames == 0; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(raster.renderedFrames, greaterThan(0));
    expect(
      sheet.progressFor(item.urlString, clock, poster: poster),
      closeTo(poster.progress, .0001),
    );
    final firstRaster = await paintEmoji();
    final largestChannelDelta = Iterable<int>.generate(
      firstPaint.length,
      (i) => (firstRaster[i] - firstPaint[i]).abs(),
    ).reduce((a, b) => a > b ? a : b);
    expect(largestChannelDelta, lessThanOrEqualTo(2));

    // A loaded model can temporarily lose its raster image on eviction.
    raster.clear();
    expect(raster.gpuBytes, 0);
    final coldPaint = await paintEmoji();
    expect(sheet.playerFor(item.urlString)!.debugHasScene, isFalse);
    expect(coldPaint, firstPaint);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('Remote pack chat shows the sticker poster before animation', (
    tester,
  ) async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);
    final server = (await tester.runAsync(
      () => PackServer.start(
        Directory('assets'),
        port: 0,
        animationDelay: const Duration(seconds: 2),
      ),
    ))!;
    addTearDown(server.close);
    await tester.pumpWidget(
      CupertinoApp(
        home: CupertinoChatScreen(externalServerUri: server.baseUri),
      ),
    );
    final hero = find.byType(HeroNetworkSticker);
    final poster = find.descendant(of: hero, matching: find.byType(RawImage));
    for (var i = 0; i < 100 && poster.evaluate().isEmpty; i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 5)),
      );
      await tester.pump(const Duration(milliseconds: 16));
    }
    expect(poster, findsWidgets);
    expect(tester.widget<RawImage>(poster.first).image, isNotNull);
    expect(
      find.descendant(of: hero, matching: find.byType(FastLottie)),
      findsNothing,
    );
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });

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
      final rasterCache = FastLottieRasterCache(
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
      expect(rasterCache.framesPerStrip, isNull);
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
      final rasterCache = FastLottieRasterCache(
        framesPerStrip: 1,
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
      expect(catalog.emojis.length, 881);
      for (var i = 0; i < catalog.emojis.length; i++) {
        final char = controller.charForEmoji(catalog.emojis[i])!;
        expect(char.length, 1);
        expect(char.codeUnitAt(0), EmojiComposerController.puaBase + i);
      }

      // Roundtrip test: text with mixed shortcodes -> PUA -> shortcode
      const original = 'Xin chào :smile: và :nail_care: nhé!';
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

      // Verify toEmojiText converts PUA tokens to real Unicode emoji (never tofu boxes!)
      final puaWithNoto = controller.decodeShortcodes('Hello 😀');
      expect(
        puaWithNoto.codeUnits.any((c) => c >= 0xE000 && c <= 0xF8FF),
        isTrue,
      );
      final copiedEmoji = controller.toEmojiText(puaWithNoto);
      expect(copiedEmoji, 'Hello 😀');
      expect(
        copiedEmoji.codeUnits.any((c) => c >= 0xE000 && c <= 0xF8FF),
        isFalse,
      );

      // Verify toEmojiText with a custom emoji without Unicode falls back to shortcode
      final customCatalog = TgsRemoteCatalog(
        baseUri: Uri.parse('http://127.0.0.1:8080/'),
        packs: const [],
        stickers: const [],
        emojis: [
          TgsRemoteItem(
            id: 'custom/0.tgs',
            packId: 'custom',
            packTitle: 'Custom',
            fileName: '0.tgs',
            kind: TgsItemKind.emoji,
            relativePath: 'tgs/0.tgs',
            label: 'Studio Microphone',
            bytes: 100,
            uri: Uri.parse('http://127.0.0.1:8080/tgs/0.tgs'),
            shortcode: ':studio_microphone:',
          ),
        ],
      );
      expect(
        customCatalog.toEmojiText('Music \uE000'),
        'Music :studio_microphone:',
      );

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
        final rasterCache = FastLottieRasterCache(
          framesPerStrip: 1,
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
          'Static :smile:',
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

  test('Noto Emoji mapping covers all 881 bundled files bidirectionally', () {
    final assetsDir = Directory('assets/tgs/NotoEmoji');
    final diskFiles =
        assetsDir
            .listSync()
            .whereType<File>()
            .map((file) => file.uri.pathSegments.last)
            .where((name) => name.endsWith('.tgs'))
            .toList()
          ..sort();

    expect(diskFiles.length, 881);
    expect(bundledNotoEmojiFileNames.length, diskFiles.length);
    expect(notoEmojiMetadataByFile.length, diskFiles.length);
    expect(notoEmojiUnicodeByFile.length, diskFiles.length);
    expect(notoEmojiFileByUnicode.length, diskFiles.length);

    for (final fileName in diskFiles) {
      final unicode = findNotoEmojiUnicode(fileName);
      expect(unicode, isNotNull, reason: 'Missing unicode for $fileName');
      expect(unicode, isNotEmpty);
      expect(
        findNotoEmojiFileName(unicode!),
        fileName,
        reason: 'Round-trip failed for $fileName ($unicode)',
      );

      final item = TgsRemoteItem(
        id: 'NotoEmoji/$fileName',
        packId: 'NotoEmoji',
        packTitle: 'Noto Emoji',
        fileName: fileName,
        kind: TgsItemKind.emoji,
        relativePath: '/tgs/NotoEmoji/$fileName',
        uri: Uri.parse('http://localhost/tgs/NotoEmoji/$fileName'),
        bytes: 0,
        label: notoEmojiMetadataByFile[fileName]!.label,
        shortcode: notoEmojiMetadataByFile[fileName]!.shortcode,
      );
      expect(item.unicode, unicode);
    }

    // Variation-selector normalization checks (U+FE0F optional)
    expect(findNotoEmojiFileName('❤️'), 'emoji_u2764_fe0f.tgs');
    expect(findNotoEmojiFileName('❤'), 'emoji_u2764_fe0f.tgs');
    expect(findNotoEmojiFileName('✌️'), 'emoji_u270c_fe0f.tgs');
    expect(findNotoEmojiFileName('✌'), 'emoji_u270c_fe0f.tgs');
    expect(findNotoEmojiFileName('🐦\u200D🔥'), 'emoji_u1f426_200d_1f525.tgs');

    final jsonMap = jsonDecode(
      File('../docs/noto-emoji-mapping.json').readAsStringSync(),
    ) as Map<String, dynamic>;
    final entries = jsonMap['emojis'] as List<dynamic>;
    expect(jsonMap['count'], diskFiles.length);
    expect(entries.length, diskFiles.length);
    for (final raw in entries) {
      final entry = raw as Map<String, dynamic>;
      final fileName = entry['fileName'] as String;
      expect(entry['unicode'], notoEmojiUnicodeByFile[fileName]);
      expect(entry['shortcode'], notoEmojiMetadataByFile[fileName]!.shortcode);
      expect(entry['label'], notoEmojiMetadataByFile[fileName]!.label);
    }
  });

  testWidgets(
    'Telegram-style static emoji fallback & normalized sizing in composer and chat',
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
      final rasterCache = FastLottieRasterCache(
        framesPerStrip: 1,
        maximumBytes: 4 << 20,
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

      // 1. Compound missing ZWJ / tag emojis starting with a Noto prefix
      // must NOT be torn apart into prefix animated emoji + ZWJ tail.
      final controller = EmojiComposerController(
        catalog: catalog,
        sheet: sheet,
        clock: clock,
        store: store,
      );
      addTearDown(controller.dispose);

      const compoundInput = 'Bear 🐻\u200D❄️ Lime 🍋\u200D🟩 Flag 🏳️\u200D🌈';
      expect(controller.decodeShortcodes(compoundInput), compoundInput);
      expect(controller.toShortcodeText(compoundInput), compoundInput);
      expect(
        ChatMessage.text(
          id: 'm1',
          text: compoundInput,
          isOutgoing: true,
          timestamp: DateTime(2026),
        ).resolveInlineItems(catalog),
        isEmpty,
      );

      // 2. Composer normalizes static OS emojis without breaking UTF-16 length.
      final mixedDecoded = controller.decodeShortcodes('Hi 😀 ☠️!');
      controller.value = TextEditingValue(
        text: mixedDecoded,
        selection: TextSelection.collapsed(offset: mixedDecoded.length),
      );
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
      final composerSpan = controller.buildTextSpan(
        context: capturedContext,
        style: const TextStyle(fontSize: 15),
        withComposing: false,
      );
      expect(composerSpan.toPlainText().length, controller.text.length);
      final children = composerSpan.children!;
      expect((children[0] as TextSpan).text, 'Hi ');
      expect(children[1], isA<WidgetSpan>());
      final composerSticker =
          ((children[1] as WidgetSpan).child as Padding).child
              as InlineNetworkSticker;
      expect(composerSticker.size, 21);
      final staticComposerSpan = children.whereType<TextSpan>().firstWhere(
        (s) => s.text == '☠️',
      );
      expect(staticComposerSpan.style?.fontSize, closeTo(21 * 0.86, 0.01));

      // 3. Full chat app: verify inline parity and 1/2/3 jumbo emoji sizing.
      final dir = Directory.systemTemp.createTempSync('fastlottie_tele_');
      addTearDown(() => dir.deleteSync(recursive: true));
      final cacheStore = NetworkTgsStore(
        framePaced: true,
        sourceCacheDirectory: dir.path,
      );
      addTearDown(cacheStore.dispose);

      await tester.pumpWidget(
        CupertinoApp(
          home: CupertinoChatScreen(
            externalServerUri: server.baseUri,
            store: cacheStore,
          ),
        ),
      );
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
      expect(
        find.byKey(const ValueKey('cupertino-message-list')),
        findsOneWidget,
      );

      Future<void> sendText(String msg) async {
        await tester.enterText(
          find.byKey(const ValueKey('chat-composer-field')),
          msg,
        );
        await tester.pump();
        await tester.tap(find.byKey(const ValueKey('composer-send-button')));
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 260));
      }

      // 1 static emoji -> jumbo 48.0
      await sendText('☠️');
      final skullText = tester.widget<Text>(find.text('☠️').last);
      final skullBox = tester.widget<SizedBox>(
        find
            .ancestor(of: find.text('☠️').last, matching: find.byType(SizedBox))
            .first,
      );
      expect(skullBox.width, 48.0);
      expect(skullBox.height, 48.0);
      expect(skullText.style?.fontSize, closeTo(48.0 * 0.86, 0.01));

      // 2 mixed emojis (1 animated + 1 static) -> both 42.0
      await sendText('😀 🐻\u200D❄️');
      final bearBox = tester.widget<SizedBox>(
        find
            .ancestor(
              of: find.text('🐻\u200D❄️').last,
              matching: find.byType(SizedBox),
            )
            .first,
      );
      expect(bearBox.width, 42.0);
      final jumboPairStickers = tester
          .widgetList<InlineNetworkSticker>(find.byType(InlineNetworkSticker))
          .where((w) => w.size == 42.0);
      expect(jumboPairStickers, isNotEmpty);

      // 3 mixed emojis -> all 36.0
      await sendText('😀 ☠️ 🍋\u200D🟩');
      final limeBox = tester.widget<SizedBox>(
        find
            .ancestor(
              of: find.text('🍋\u200D🟩').last,
              matching: find.byType(SizedBox),
            )
            .first,
      );
      expect(limeBox.width, 36.0);
      final jumboTripleStickers = tester
          .widgetList<InlineNetworkSticker>(find.byType(InlineNetworkSticker))
          .where((w) => w.size == 36.0);
      expect(jumboTripleStickers, isNotEmpty);

      // Mixed with text -> normalized inline 23.2 (16 * 1.45)
      await sendText('Static fallback 🏳️\u200D🌈 inline');
      final flagBox = tester.widget<SizedBox>(
        find
            .ancestor(
              of: find.text('🏳️\u200D🌈').last,
              matching: find.byType(SizedBox),
            )
            .first,
      );
      expect(flagBox.width, closeTo(23.2, 0.01));
      expect(flagBox.height, closeTo(23.2, 0.01));
      final inlineStickers = tester
          .widgetList<InlineNetworkSticker>(find.byType(InlineNetworkSticker))
          .where((w) => (w.size - 23.2).abs() < 0.01);
      expect(inlineStickers, isNotEmpty);

      await tester.pumpWidget(const SizedBox());
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 50)),
      );
      await tester.pump();
    },
  );

  testWidgets(
    'InlineNetworkSticker and HeroNetworkSticker defer uncached loads and pause hero animation during fastFling',
    (tester) async {
      var fetchCount = 0;
      final store = NetworkTgsStore(
        framePaced: false,
        fetcher: (uri, {cancelToken, sourceCacheDirectory}) async {
          fetchCount++;
          return FastLottieNetworkFetchResult(
            Uint8List(4),
            fromDiskCache: true,
          );
        },
        decoder: (_, _) async => _dummyModel(),
      );
      final rasterCache = FastLottieRasterCache(
        framesPerStrip: 1,
        maximumBytes: 1 << 20,
      );
      final emojiItem = TgsRemoteItem(
        id: 'NotoEmoji/fling_emoji.tgs',
        packId: 'NotoEmoji',
        packTitle: 'Noto Emoji',
        fileName: 'fling_emoji.tgs',
        kind: TgsItemKind.emoji,
        relativePath: '/tgs/NotoEmoji/fling_emoji.tgs',
        uri: Uri.parse('http://localhost/tgs/NotoEmoji/fling_emoji.tgs'),
        bytes: 16,
        label: 'Fling Emoji',
      );
      final heroItem = TgsRemoteItem(
        id: 'Pack/fling_hero.tgs',
        packId: 'Pack',
        packTitle: 'Pack',
        fileName: 'fling_hero.tgs',
        kind: TgsItemKind.sticker,
        relativePath: '/tgs/Pack/fling_hero.tgs',
        uri: Uri.parse('http://localhost/tgs/Pack/fling_hero.tgs'),
        bytes: 32,
        label: 'Fling Hero',
      );
      final sheet = StickerSheet(
        assets: [emojiItem.urlString],
        pixelSize: 64,
        store: store,
        rasterCache: rasterCache,
        frameRate: 30,
      );
      final clock = StickerClock()
        ..configure(playing: true, reducedMotion: false, maximumFrameRate: 30);
      final fastFling = ValueNotifier<bool>(true);
      addTearDown(() {
        fastFling.dispose();
        clock.dispose();
        sheet.dispose();
        rasterCache.dispose();
        store.dispose();
      });

      await tester.pumpWidget(
        CupertinoApp(
          home: Column(
            children: [
              InlineNetworkSticker(
                item: emojiItem,
                sheet: sheet,
                clock: clock,
                store: store,
                renderer: ChatRendererMode.fastlottie,
                still: false,
                fastFling: fastFling,
              ),
              HeroNetworkSticker(
                item: heroItem,
                store: store,
                renderer: ChatRendererMode.fastlottie,
                placeholderColor: CupertinoColors.systemGrey,
                borderColor: CupertinoColors.systemGrey2,
                accentColor: CupertinoColors.activeBlue,
                secondaryTextColor: CupertinoColors.secondaryLabel,
                fastFling: fastFling,
              ),
            ],
          ),
        ),
      );
      await tester.pump();

      // While fastFling is active, newly entering uncached items do not start store fetches.
      expect(fetchCount, 0);
      expect(sheet.playerFor(emojiItem.urlString), isNull);
      expect(find.byType(FastLottie), findsNothing);

      // Settling the fling immediately triggers pin + hero load.
      fastFling.value = false;
      await tester.pump();
      await tester.runAsync(() => Future<void>.delayed(Duration.zero));
      await tester.pump();
      await tester.runAsync(() => Future<void>.delayed(Duration.zero));
      await tester.pump();

      expect(fetchCount, 2);
      expect(sheet.playerFor(emojiItem.urlString), isNotNull);
      expect(find.byType(FastLottie), findsOneWidget);
      expect(
        tester.widget<FastLottie>(find.byType(FastLottie)).animate,
        isTrue,
      );

      // Starting another fast fling keeps existing pins and mounted FastLottie intact,
      // pausing Hero animation without unmounting it.
      fastFling.value = true;
      await tester.pump();

      expect(sheet.playerFor(emojiItem.urlString), isNotNull);
      expect(find.byType(FastLottie), findsOneWidget);
      expect(
        tester.widget<FastLottie>(find.byType(FastLottie)).animate,
        isFalse,
      );

      // Settling again resumes Hero playback.
      fastFling.value = false;
      await tester.pump();

      expect(find.byType(FastLottie), findsOneWidget);
      expect(
        tester.widget<FastLottie>(find.byType(FastLottie)).animate,
        isTrue,
      );

      await tester.pumpWidget(const SizedBox());
    },
  );

  test('TgsRemoteCatalog fast paths preserve ASCII, PUA, shortcode, uncovered BMP, and ZWJ emoji matching', () async {
    final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
    addTearDown(() => server.close(force: true));
    final catalog = server.catalog;

    // Pure ASCII skips regex and resolves nothing.
    expect(TgsRemoteCatalog.containsNonAscii('Plain ASCII 123!'), isFalse);
    expect(catalog.extractInlineItems('Plain ASCII 123!'), isEmpty);

    // Pure PUA + ASCII resolves exact offsets via O(N) linear scan.
    final puaText = 'A\uE000 \uE005B';
    final puaItems = catalog.extractInlineItems(puaText);
    expect(puaItems.keys.toList(), [1, 3]);
    expect(puaItems[1], (1, catalog.emojis[0]));
    expect(puaItems[3], (1, catalog.emojis[5]));

    // Mixed shortcodes & PUA + ASCII.
    final scItems = catalog.extractInlineItems('Hi :smile: and \uE002!');
    expect(scItems.length, 2);
    expect(scItems[3]?.$2, catalog.shortcodeMap[':smile:']);
    expect(scItems[15]?.$2, catalog.emojis[2]);

    // Uncovered BMP symbols (without U+FE0F), ZWJ sequences, and standard emojis.
    const bmpSample = '❤ ❤‍🔥 ✌ © ® ‼ 😀 ❤️‍🔥';
    final bmpItems = catalog.extractInlineItems(bmpSample);
    final resolvedEmojis = bmpItems.values.map((e) => e.$2.unicode).toList();
    expect(resolvedEmojis, [
      '❤️',
      '❤️\u200D🔥',
      '✌️',
      '©️',
      '®️',
      '‼️',
      '😀',
      '❤️\u200D🔥',
    ]);

    // Missing compound ZWJ/tag emojis must still not split on their Noto prefix.
    expect(
      catalog.extractInlineItems('🐻\u200D❄️ 🏳️\u200D🌈 🍋\u200D🟩'),
      isEmpty,
    );
    expect(catalog.toShortcodeText('Plain ASCII 123!'), 'Plain ASCII 123!');
    expect(catalog.toShortcodeText('Hi :smile:'), 'Hi :smile:');
    expect(catalog.toShortcodeText('A❤B'), 'A:red_heart:B');
  });
}
