import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/main.dart';
import 'package:fastlottie_example/tgs/cupertino_chat.dart';
import 'package:fastlottie_example/tgs/network_server.dart';
import 'package:fastlottie_example/tgs/network_store.dart';
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
  test(
    'LocalTgsServer serves catalog, TGS binary payloads, ETag 304, and failure states',
    () async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);

      final server = await LocalTgsServer.startFromDirectoryPath('assets/tgs');
      addTearDown(() => server.close(force: true));

      final catalog = await fetchRemoteTgsCatalog(server.baseUri);
      expect(catalog.packs.length, 5);
      expect(catalog.stickers.length, 94);
      expect(catalog.emojis.length, 40);
      expect(catalog.shortcodeMap.length, 40);
      expect(catalog.shortcodeMap.containsKey(':sparkles:'), isTrue);

      final client = HttpClient();
      addTearDown(() => client.close(force: true));

      final healthReq = await client.getUrl(server.baseUri.resolve('/health'));
      final healthResp = await healthReq.close();
      expect(healthResp.statusCode, HttpStatus.ok);
      final healthJson =
          jsonDecode(await utf8.decodeStream(healthResp)) as Map<String, dynamic>;
      expect(healthJson['ok'], isTrue);
      expect(healthJson['stickers'], 94);
      expect(healthJson['emojis'], 40);

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
      final missingReq = await client.getUrl(server.baseUri.resolve('/tgs/nope.tgs'));
      final missingResp = await missingReq.close();
      await missingResp.drain<void>();
      expect(missingResp.statusCode, HttpStatus.notFound);

      server.simulateFailure = true;
      final failReq = await client.getUrl(firstUri);
      final failResp = await failReq.close();
      await failResp.drain<void>();
      expect(failResp.statusCode, HttpStatus.serviceUnavailable);
    },
  );

  test(
    'NetworkTgsStore reuses URL disk cache, aborts offscreen sockets, and jumps priority queue',
    () async {
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
    },
  );

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

      for (var i = 0;
          i < 80 &&
              find
                  .byKey(const ValueKey('cupertino-message-list'))
                  .evaluate()
                  .isEmpty;
          i++) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }

      expect(find.byType(CupertinoPageScaffold), findsOneWidget);
      expect(find.byKey(const ValueKey('cupertino-message-list')), findsOneWidget);
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
      expect(find.byKey(const ValueKey('sticker-picker-panel')), findsOneWidget);
      expect(find.byKey(const ValueKey('sticker-picker-grid')), findsOneWidget);

      // Switch to Emoji tab, tap first emoji to insert `:sparkles:`, type message, send.
      await tester.tap(find.byKey(const ValueKey('picker-tab-__emoji__')));
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('picker-emoji-0')));
      await tester.pump();

      final field = tester.widget<CupertinoTextField>(
        find.byKey(const ValueKey('chat-composer-field')),
      );
      expect(field.controller!.text, contains(':sparkles:'));

      await tester.enterText(
        find.byKey(const ValueKey('chat-composer-field')),
        '${field.controller!.text}Cupertino Network!',
      );
      await tester.pump();
      await tester.tap(find.byKey(const ValueKey('composer-send-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 260));

      expect(find.textContaining('Cupertino Network!'), findsOneWidget);

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
        expect(hero.cache.maximumFrames, FastLottieCache.unbounded.maximumFrames);
      }

      // Open CupertinoActionSheet options & verify theme toggle renders cleanly.
      await tester.tap(find.byKey(const ValueKey('chat-options-button')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));
      expect(find.byType(CupertinoActionSheet), findsOneWidget);
      await tester.tap(find.text('Chuyển sang Giao diện Sáng'));
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

  testWidgets('FastLottieCupertinoApp mounts main entry cleanly', (tester) async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    await tester.pumpWidget(const FastLottieCupertinoApp());
    for (var i = 0;
        i < 120 &&
            find
                .byKey(const ValueKey('cupertino-message-list'))
                .evaluate()
                .isEmpty;
        i++) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump();
    }
    expect(find.byType(CupertinoApp), findsOneWidget);
    expect(find.byKey(const ValueKey('cupertino-message-list')), findsOneWidget);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 50)),
    );
    await tester.pump();
  });
}
