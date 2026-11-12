import 'dart:async';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

class _PassthroughHttpOverrides extends HttpOverrides {}

void main() {
  test('FastLottieComposition.loadNetwork fetches TGS, caches raw payload on disk, and cancels sockets cleanly', () async {
    final previous = HttpOverrides.current;
    HttpOverrides.global = _PassthroughHttpOverrides();
    addTearDown(() => HttpOverrides.global = previous);

    final tgsBytes = File(
      'example/assets/tgs/Topics-1794247486249/file_4798662.tgs',
    ).readAsBytesSync();

    var httpHits = 0;
    Completer<void>? releaseSlowRequest;
    var serverSawSlowHit = Completer<void>();

    final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
    addTearDown(() => server.close(force: true));

    server.listen((request) async {
      httpHits++;
      if (request.uri.path == '/sticker.tgs') {
        request.response.headers.contentType = ContentType(
          'application',
          'x-tgsticker',
        );
        request.response.contentLength = tgsBytes.length;
        request.response.add(tgsBytes);
        await request.response.close();
      } else if (request.uri.path == '/slow.tgs') {
        if (!serverSawSlowHit.isCompleted) serverSawSlowHit.complete();
        final gate = releaseSlowRequest;
        if (gate != null) {
          await gate.future.timeout(
            const Duration(seconds: 2),
            onTimeout: () {},
          );
        }
        try {
          request.response.add(tgsBytes);
          await request.response.close();
        } catch (_) {
          // Expected when client aborts socket early.
        }
      } else {
        request.response.statusCode = HttpStatus.notFound;
        await request.response.close();
      }
    });

    final tempDir = Directory.systemTemp.createTempSync('fastlottie_net_');
    addTearDown(() => tempDir.deleteSync(recursive: true));

    final uri = Uri.parse(
      'http://${server.address.address}:${server.port}/sticker.tgs',
    );
    final comp = await FastLottieComposition.loadNetwork(
      uri,
      sourceCacheDirectory: tempDir.path,
    );
    expect(comp.isStatic, isFalse);
    expect(comp.frameCount, greaterThan(0));
    expect(httpHits, 1);

    // Second load hits raw URL disk cache without touching HTTP server.
    final cachedComp = await FastLottieComposition.loadNetwork(
      uri,
      sourceCacheDirectory: tempDir.path,
    );
    expect(cachedComp.contentKey, comp.contentKey);
    expect(httpHits, 1);

    // Clearing URL disk cache forces a fresh HTTP download next time.
    await FastLottieComposition.clearNetworkDiskCache(tempDir.path);
    await FastLottieComposition.loadNetwork(
      uri,
      sourceCacheDirectory: tempDir.path,
    );
    expect(httpHits, 2);

    // HTTP 404 propagates descriptive FastLottieNetworkException.
    final missingUri = Uri.parse(
      'http://${server.address.address}:${server.port}/missing.tgs',
    );
    await expectLater(
      FastLottieComposition.loadNetwork(missingUri),
      throwsA(
        isA<FastLottieNetworkException>().having(
          (e) => e.statusCode,
          'statusCode',
          HttpStatus.notFound,
        ),
      ),
    );

    // In-flight cancelToken aborts active HTTP socket cleanly.
    releaseSlowRequest = Completer<void>();
    final token = FastLottieCancelToken();
    final slowUri = Uri.parse(
      'http://${server.address.address}:${server.port}/slow.tgs',
    );
    final slowFuture = FastLottieComposition.loadNetwork(
      slowUri,
      cancelToken: token,
    );
    await serverSawSlowHit.future;
    token.cancel();
    await expectLater(
      slowFuture,
      throwsA(isA<FastLottieNetworkCancelledException>()),
    );
    releaseSlowRequest.complete();
  });

  testWidgets(
    'FastLottie.network displays placeholder, retries failures, cancels on unmount, and plays on load',
    (tester) async {
      final previous = HttpOverrides.current;
      HttpOverrides.global = _PassthroughHttpOverrides();
      addTearDown(() => HttpOverrides.global = previous);

      final tgsBytes = File(
        'example/assets/tgs/Topics-1794247486249/file_4798662.tgs',
      ).readAsBytesSync();

      var failFirst = true;
      Completer<void>? slowGate;
      late HttpServer server;

      await tester.runAsync(() async {
        server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
        server.listen((request) async {
          if (request.uri.path == '/flaky.tgs') {
            if (failFirst) {
              failFirst = false;
              request.response.statusCode = HttpStatus.serviceUnavailable;
              await request.response.close();
              return;
            }
            request.response.contentLength = tgsBytes.length;
            request.response.add(tgsBytes);
            await request.response.close();
            return;
          }
          if (request.uri.path == '/hang.tgs') {
            await slowGate?.future;
            try {
              request.response.add(tgsBytes);
              await request.response.close();
            } catch (_) {}
            return;
          }
        });
      });
      addTearDown(() async {
        await tester.runAsync(() => server.close(force: true));
      });

      final flakyUri = Uri.parse(
        'http://${server.address.address}:${server.port}/flaky.tgs',
      );
      VoidCallback? capturedRetry;

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: FastLottie.network(
            flakyUri,
            width: 80,
            height: 80,
            placeholderBuilder: (_) =>
                const SizedBox(key: ValueKey('net-placeholder')),
            errorBuilder: (_, error, retry) {
              capturedRetry = retry;
              return const SizedBox(key: ValueKey('net-error'));
            },
          ),
        ),
      );
      expect(find.byKey(const ValueKey('net-placeholder')), findsOneWidget);

      for (
        var i = 0;
        i < 50 && find.byKey(const ValueKey('net-error')).evaluate().isEmpty;
        i++
      ) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }
      expect(find.byKey(const ValueKey('net-error')), findsOneWidget);
      expect(capturedRetry, isNotNull);

      capturedRetry!();
      await tester.pump();
      for (
        var i = 0;
        i < 100 && find.byType(FastLottie).evaluate().isEmpty;
        i++
      ) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }

      expect(find.byType(FastLottie), findsOneWidget);
      expect(tester.takeException(), isNull);

      // Unmounting while a request hangs cancels cleanly with zero leaked exceptions.
      slowGate = Completer<void>();
      final hangUri = Uri.parse(
        'http://${server.address.address}:${server.port}/hang.tgs',
      );
      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: FastLottie.network(hangUri, width: 64, height: 64),
        ),
      );
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 20)),
      );
      await tester.pumpWidget(const SizedBox());
      slowGate.complete();
      await tester.pump();
      expect(tester.takeException(), isNull);
    },
  );
}
