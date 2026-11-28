import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/network/network_coalescer.dart';
import 'package:fastlottie/src/worker/web_worker_url.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, fixture;

class _PassthroughHttpOverrides extends HttpOverrides {}

void main() {
  group('Cross-origin Web Worker URL & Blob shim helpers', () {
    test('detects same-origin vs cross-origin CDN URLs safely', () {
      final page = Uri.parse('https://app.example.com/chat/index.html');
      final sameOrigin = resolveBrowserAssetUri(
        page.toString(),
        'assets/packages/fastlottie/lib/src/wasm/fastlottie_worker.js',
      );
      expect(
        sameOrigin.toString(),
        'https://app.example.com/chat/assets/packages/fastlottie/lib/src/wasm/fastlottie_worker.js',
      );
      expect(isCrossOriginWorkerUri(page, sameOrigin), isFalse);

      final cdnWorker = resolveBrowserAssetUri(
        page.toString(),
        'https://cdn.example.com/static/fastlottie_worker.js',
      );
      expect(isCrossOriginWorkerUri(page, cdnWorker), isTrue);

      final differentPort = Uri.parse('http://localhost:9000/worker.js');
      expect(
        isCrossOriginWorkerUri(
          Uri.parse('http://localhost:8080/'),
          differentPort,
        ),
        isTrue,
      );

      final differentScheme = Uri.parse('http://app.example.com/worker.js');
      expect(isCrossOriginWorkerUri(page, differentScheme), isTrue);

      // Opaque / non-HTTP schemes must never throw StateError from Uri.origin.
      expect(
        isCrossOriginWorkerUri(
          Uri.parse('file:///tmp/index.html'),
          Uri.parse('file:///tmp/worker.js'),
        ),
        isFalse,
      );
      expect(
        isCrossOriginWorkerUri(Uri.parse('data:text/html,hi'), cdnWorker),
        isFalse,
      );
    });

    test('buildCrossOriginWorkerShim escapes special characters via JSON', () {
      const url = 'https://cdn.example.com/a"b\\c\nworker.js';
      expect(
        buildCrossOriginWorkerShim(url),
        'importScripts("https://cdn.example.com/a\\"b\\\\c\\nworker.js");',
      );
    });
  });

  group('NetworkRequestCoalescer', () {
    test('canonicalNetworkRequestKey normalizes header casing and order', () {
      final uri = Uri.parse('https://cdn.example.com/a.tgs');
      expect(
        canonicalNetworkRequestKey(uri, const {'X-B': '2', 'x-a': '1'}),
        canonicalNetworkRequestKey(uri, const {'X-A': '1', 'x-b': '2'}),
      );
      expect(
        canonicalNetworkRequestKey(uri, null),
        canonicalNetworkRequestKey(uri, const {}),
      );
    });

    test('coalesces concurrent callers and supports partial and full cancel', () async {
      final coalescer = NetworkRequestCoalescer<String>();
      var starts = 0;
      late Completer<String> gate;
      late FastLottieCancelToken observedSharedToken;

      Future<String> launch(String key, FastLottieCancelToken token) =>
          coalescer.run(
            key,
            cancelToken: token,
            start: (sharedToken) {
              starts++;
              observedSharedToken = sharedToken;
              gate = Completer<String>();
              return gate.future;
            },
          );

      // 1. Partial cancel: cancelling t1 rejects only f1 while f2 succeeds.
      final t1 = FastLottieCancelToken();
      final t2 = FastLottieCancelToken();
      final f1 = launch('k1', t1);
      final f2 = launch('k1', t2);
      expect(starts, 1);
      expect(coalescer.inFlightCount, 1);

      t1.cancel();
      await expectLater(
        f1,
        throwsA(isA<FastLottieNetworkCancelledException>()),
      );
      expect(observedSharedToken.isCancelled, isFalse);

      gate.complete('ok');
      expect(await f2, 'ok');
      expect(coalescer.inFlightCount, 0);

      // 2. Full cancel: cancelling all waiters aborts sharedToken immediately.
      final t3 = FastLottieCancelToken();
      final t4 = FastLottieCancelToken();
      final f3 = launch('k2', t3);
      final f4 = launch('k2', t4);
      expect(starts, 2);
      final shared2 = observedSharedToken;

      t3.cancel();
      expect(shared2.isCancelled, isFalse);
      t4.cancel();
      expect(shared2.isCancelled, isTrue);
      expect(coalescer.inFlightCount, 0);
      await expectLater(
        f3,
        throwsA(isA<FastLottieNetworkCancelledException>()),
      );
      await expectLater(
        f4,
        throwsA(isA<FastLottieNetworkCancelledException>()),
      );
      // Settling the aborted underlying future must not leak unhandled errors.
      gate.completeError(const FastLottieNetworkCancelledException());
      await Future<void>.delayed(Duration.zero);

      // 3. Error clears registry so an immediate retry starts fresh.
      final t5 = FastLottieCancelToken();
      final f5 = launch('k3', t5);
      gate.completeError(StateError('boom'));
      await expectLater(f5, throwsStateError);
      expect(coalescer.inFlightCount, 0);

      final t6 = FastLottieCancelToken();
      final f6 = launch('k3', t6);
      gate.complete('recovered');
      expect(await f6, 'recovered');
      expect(starts, 4);
    });
  });

  group('HTTP coalescing & bounded .flbin disk LRU', () {
    setUp(() {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);
    });

    test(
      'concurrent loadNetwork and fetchNetworkBytes coalesce onto one HTTP GET',
      () async {
        final tgsBytes = const GZipEncoder().encode(bytes(fixture('icon')));
        final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
        addTearDown(() => server.close(force: true));

        var loadHits = 0;
        var fetchHits = 0;
        final loadGate = Completer<void>();
        final loadArrived = Completer<void>();
        final fetchGate = Completer<void>();
        final fetchArrived = Completer<void>();

        server.listen((request) async {
          if (request.uri.path == '/shared.tgs') {
            loadHits++;
            if (!loadArrived.isCompleted) loadArrived.complete();
            await loadGate.future;
            request.response.contentLength = tgsBytes.length;
            request.response.add(tgsBytes);
            await request.response.close();
          } else if (request.uri.path == '/raw.tgs') {
            fetchHits++;
            if (!fetchArrived.isCompleted) fetchArrived.complete();
            await fetchGate.future;
            request.response.contentLength = tgsBytes.length;
            request.response.add(tgsBytes);
            await request.response.close();
          }
        });

        // 4 concurrent loadNetwork calls -> 1 HTTP download & 1 shared composition.
        final sharedUri = Uri.parse(
          'http://127.0.0.1:${server.port}/shared.tgs',
        );
        final loads = List.generate(
          4,
          (_) => FastLottieComposition.loadNetwork(sharedUri),
        );
        await loadArrived.future;
        loadGate.complete();
        final comps = await Future.wait(loads);
        expect(loadHits, 1);
        for (var i = 1; i < comps.length; i++) {
          expect(comps[i], same(comps.first));
        }

        // 2 concurrent fetchNetworkBytes calls: cancel 1, 2nd still succeeds on same GET.
        final rawUri = Uri.parse('http://127.0.0.1:${server.port}/raw.tgs');
        final tokenA = FastLottieCancelToken();
        final tokenB = FastLottieCancelToken();
        final fetchA = FastLottieComposition.fetchNetworkBytes(
          rawUri,
          cancelToken: tokenA,
        );
        final fetchB = FastLottieComposition.fetchNetworkBytes(
          rawUri,
          cancelToken: tokenB,
        );
        await fetchArrived.future;
        tokenA.cancel();
        await expectLater(
          fetchA,
          throwsA(isA<FastLottieNetworkCancelledException>()),
        );
        fetchGate.complete();
        final resultB = await fetchB;
        expect(resultB.bytes, tgsBytes);
        expect(fetchHits, 1);
      },
    );

    test('raw .flbin disk cache enforces maximumSourceCacheBytes with LRU eviction', () async {
      final payloadA = Uint8List.fromList(
        const GZipEncoder().encode(bytes(fixture('static')..['w'] = 100)),
      );
      final payloadB = Uint8List.fromList(
        const GZipEncoder().encode(bytes(fixture('static')..['w'] = 200)),
      );
      final payloadC = Uint8List.fromList(
        const GZipEncoder().encode(bytes(fixture('static')..['w'] = 300)),
      );
      final maxEntrySize = [
        payloadA.length,
        payloadB.length,
        payloadC.length,
      ].reduce((a, b) => a > b ? a : b);
      // Fits 2 files cleanly, forces eviction on 3rd file.
      final cap = maxEntrySize * 2 + 8;

      final hits = <String, int>{};
      final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      addTearDown(() => server.close(force: true));
      server.listen((request) async {
        final path = request.uri.path;
        hits[path] = (hits[path] ?? 0) + 1;
        final data = switch (path) {
          '/a.tgs' => payloadA,
          '/b.tgs' => payloadB,
          '/c.tgs' => payloadC,
          _ => payloadA,
        };
        request.response.contentLength = data.length;
        request.response.add(data);
        await request.response.close();
      });

      final tempDir = Directory.systemTemp.createTempSync('fastlottie_lru_');
      addTearDown(() {
        if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
      });
      Uri u(String path) => Uri.parse('http://127.0.0.1:${server.port}$path');

      // Write A then B -> both fit inside cap.
      final rA1 = await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rA1.fromDiskCache, isFalse);
      final rB1 = await FastLottieComposition.fetchNetworkBytes(
        u('/b.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rB1.fromDiskCache, isFalse);

      // Touch A via disk hit -> promotes A to MRU so B becomes oldest LRU victim.
      final rA2 = await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rA2.fromDiskCache, isTrue);
      expect(hits['/a.tgs'], 1);

      // Fetch C -> exceeds cap -> evicts B, retaining A and C.
      final rC1 = await FastLottieComposition.fetchNetworkBytes(
        u('/c.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rC1.fromDiskCache, isFalse);

      final flbinFiles = tempDir
          .listSync()
          .whereType<File>()
          .where((f) => f.path.endsWith('.flbin'))
          .toList();
      expect(flbinFiles, hasLength(2));

      // A is still warm on disk; B was evicted and must re-fetch over HTTP.
      final rA3 = await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rA3.fromDiskCache, isTrue);
      expect(hits['/a.tgs'], 1);

      final rB2 = await FastLottieComposition.fetchNetworkBytes(
        u('/b.tgs'),
        sourceCacheDirectory: tempDir.path,
        maximumSourceCacheBytes: cap,
      );
      expect(rB2.fromDiskCache, isFalse);
      expect(hits['/b.tgs'], 2);

      // maximumSourceCacheBytes: 0 disables raw disk writes completely.
      final zeroDir = Directory.systemTemp.createTempSync('fastlottie_zero_');
      addTearDown(() {
        if (zeroDir.existsSync()) zeroDir.deleteSync(recursive: true);
      });
      await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: zeroDir.path,
        maximumSourceCacheBytes: 0,
      );
      expect(zeroDir.listSync(), isEmpty);

      // Single payload larger than cap still downloads cleanly without caching.
      final tinyDir = Directory.systemTemp.createTempSync('fastlottie_tiny_');
      addTearDown(() {
        if (tinyDir.existsSync()) tinyDir.deleteSync(recursive: true);
      });
      final rTiny = await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: tinyDir.path,
        maximumSourceCacheBytes: payloadA.length - 1,
      );
      expect(rTiny.bytes, payloadA);
      expect(tinyDir.listSync(), isEmpty);

      // Negative disk cap rejected cleanly (and fetchNetworkBytes rejects asynchronously).
      expect(
        () => FastLottieComposition.defaultMaximumNetworkDiskBytes = -1,
        throwsRangeError,
      );
      var syncThrew = false;
      Future<FastLottieNetworkFetchResult>? negFuture;
      try {
        negFuture = FastLottieComposition.fetchNetworkBytes(
          u('/a.tgs'),
          maximumSourceCacheBytes: -1,
        );
      } catch (_) {
        syncThrew = true;
      }
      expect(syncThrew, isFalse);
      await expectLater(negFuture, throwsRangeError);

      // Concurrent dual-write race: cap fits 1 file (~1.5x payload), 2 concurrent fetches
      // must serialize eviction cleanly so 1 file survives (never mutual-evicted to 0).
      final raceDir = Directory.systemTemp.createTempSync('fastlottie_race_');
      addTearDown(() {
        if (raceDir.existsSync()) raceDir.deleteSync(recursive: true);
      });
      final raceCap = payloadA.length + (payloadA.length ~/ 2);
      await Future.wait([
        FastLottieComposition.fetchNetworkBytes(
          u('/a.tgs'),
          sourceCacheDirectory: raceDir.path,
          maximumSourceCacheBytes: raceCap,
        ),
        FastLottieComposition.fetchNetworkBytes(
          u('/b.tgs'),
          sourceCacheDirectory: raceDir.path,
          maximumSourceCacheBytes: raceCap,
        ),
      ]);
      final survivors = raceDir
          .listSync()
          .whereType<File>()
          .where((f) => f.path.endsWith('.flbin'))
          .toList();
      expect(survivors, hasLength(1));

      // clearNetworkDiskCache inside a path whose parent contains '.tmp.' must NOT wipe
      // unrelated files or sibling libraries' '.tmp.' files.
      final parentTmpRoot = Directory.systemTemp.createTempSync(
        'fastlottie.tmp.parent_',
      );
      addTearDown(() {
        if (parentTmpRoot.existsSync()) {
          parentTmpRoot.deleteSync(recursive: true);
        }
      });
      final cacheSubdir = Directory('${parentTmpRoot.path}/cache')
        ..createSync(recursive: true);
      final keepDb = File('${cacheSubdir.path}/unrelated.db')
        ..writeAsStringSync('keep-me');
      final keepSiblingTmp = File('${cacheSubdir.path}/other.tmp.lock')
        ..writeAsStringSync('keep-lock');
      final fastlottieTmp = File('${cacheSubdir.path}/abc.flbin.tmp.1.1')
        ..writeAsStringSync('stale-temp');
      await FastLottieComposition.fetchNetworkBytes(
        u('/a.tgs'),
        sourceCacheDirectory: cacheSubdir.path,
        maximumSourceCacheBytes: cap,
      );
      await FastLottieComposition.clearNetworkDiskCache(cacheSubdir.path);
      expect(keepDb.existsSync(), isTrue);
      expect(keepSiblingTmp.existsSync(), isTrue);
      expect(fastlottieTmp.existsSync(), isFalse);
      expect(
        cacheSubdir.listSync().where((e) => e.path.endsWith('.flbin')),
        isEmpty,
      );
    });
  });

  group('Internal testing.dart entrypoint', () {
    test('exports debug snapshot, software session, and hostless URI guard cleanly', () {
      expect(
        isCrossOriginWorkerUri(
          Uri.parse('https://app.example.com/index.html'),
          Uri.parse('http:worker.js'),
        ),
        isFalse,
      );
      expect(
        isCrossOriginWorkerUri(
          Uri.parse('https:///index.html'),
          Uri.parse('https://cdn.example.com/worker.js'),
        ),
        isFalse,
      );
      final comp = FastLottieComposition.fromJson(fixture('static'));
      final encoded = debugEncodeCompiledComposition(comp);
      final decoded = debugDecodeCompiledComposition(encoded).composition;
      expect(decoded.contentKey, comp.contentKey);
      expect(debugForkRasterScene(decoded).contentKey, comp.contentKey);
      final session = FastLottieSoftwareSession(
        decoded,
        pixelWidth: 16,
        pixelHeight: 16,
      );
      try {
        expect(session.renderFrame(0).length, 16 * 16);
      } finally {
        session.dispose();
      }
      final bgra = debugRenderSoftwareFrame(
        decoded,
        0,
        pixelWidth: 16,
        pixelHeight: 16,
      );
      expect(bgra.length, 16 * 16 * 4);
    });
  });
}
