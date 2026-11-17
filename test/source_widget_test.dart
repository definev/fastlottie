import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, fixture;

class _Bundle extends CachingAssetBundle {
  final requests = <(String, Completer<ByteData>)>[];

  @override
  Future<ByteData> load(String key) {
    final result = Completer<ByteData>();
    requests.add((key, result));
    return result.future;
  }
}

const _loading = ValueKey('loading');
const _failed = ValueKey('failed');

Widget _host(Widget child) => Center(child: child);
Widget _placeholder(BuildContext context) => const SizedBox(key: _loading);

ByteData _data(double width) {
  final payload = bytes(fixture('static')..['w'] = width);
  final buffer = Uint8List.fromList([0, ...payload, 0]);
  return ByteData.sublistView(buffer, 1, buffer.length - 1);
}

Future<void> _waitFor(WidgetTester tester, Finder finder) async {
  for (var i = 0; i < 200 && finder.evaluate().isEmpty; i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 5)),
    );
    await tester.pump();
  }
  expect(finder, findsOneWidget);
}

void main() {
  testWidgets(
    'asset follows the ambient bundle and ignores superseded results',
    (tester) async {
      final oldBundle = _Bundle();
      final newBundle = _Bundle();
      Widget view(
        AssetBundle bundle, {
        String name = 'sticker.tgs',
        double width = 40,
      }) => _host(
        DefaultAssetBundle(
          bundle: bundle,
          child: FastLottie.asset(
            name,
            width: width,
            height: 30,
            animate: false,
            usePipeline: false,
            placeholderBuilder: _placeholder,
          ),
        ),
      );
      await tester.pumpWidget(view(oldBundle));
      expect(find.byKey(_loading), findsOneWidget);
      expect(tester.getSize(find.byKey(_loading)), const Size(40, 30));
      await tester.pumpWidget(view(oldBundle, width: 50));
      expect(oldBundle.requests, hasLength(1));
      await tester.pumpWidget(view(newBundle, width: 50));
      await tester.pumpWidget(
        view(newBundle, name: 'replacement.tgs', width: 50),
      );
      expect(newBundle.requests.map((request) => request.$1), [
        'sticker.tgs',
        'replacement.tgs',
      ]);
      await tester.runAsync(() async {
        oldBundle.requests.single.$2.completeError(StateError('stale failure'));
        newBundle.requests.first.$2.complete(_data(80));
        newBundle.requests.last.$2.complete(_data(120));
        await Future<void>.delayed(Duration.zero);
      });
      await _waitFor(tester, find.byType(FastLottie));
      final widget = tester.widget<FastLottie>(find.byType(FastLottie));
      expect(widget.composition.width, 120);
      expect(widget.width, 50);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'asset override stays independent of ambient bundle and supports retry',
    (tester) async {
      final override = _Bundle();
      final ambient = _Bundle();
      VoidCallback? retry;
      await tester.pumpWidget(
        _host(
          DefaultAssetBundle(
            bundle: ambient,
            child: FastLottie.asset(
              'sticker.tgs',
              bundle: override,
              animate: false,
              usePipeline: false,
              placeholderBuilder: _placeholder,
              errorBuilder: (context, error, reload) {
                retry = reload;
                return const SizedBox(key: _failed);
              },
            ),
          ),
        ),
      );
      expect(ambient.requests, isEmpty);
      override.requests.single.$2.completeError(StateError('not found'));
      await _waitFor(tester, find.byKey(_failed));
      retry!();
      await tester.pump();
      expect(find.byKey(_loading), findsOneWidget);
      await tester.runAsync(() async {
        override.requests.last.$2.complete(_data(64));
        await Future<void>.delayed(Duration.zero);
      });
      await _waitFor(tester, find.byType(FastLottie));
      expect(
        tester.widget<FastLottie>(find.byType(FastLottie)).composition.width,
        64,
      );
      await tester.pumpWidget(const SizedBox());
      retry!(); // Retained callbacks are harmless after unmount.
      expect(override.requests, hasLength(2));
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('bytes shows decode errors and replaces a loaded composition', (
    tester,
  ) async {
    Widget view(List<int> source, {double width = 40}) => _host(
      FastLottie.bytes(
        source,
        width: width,
        animate: false,
        usePipeline: false,
        placeholderBuilder: _placeholder,
        errorBuilder: (context, error, retry) => const SizedBox(key: _failed),
      ),
    );
    await tester.runAsync(() => tester.pumpWidget(view([1])));
    await _waitFor(tester, find.byKey(_failed));
    final initial = bytes(fixture('static'));
    await tester.runAsync(() => tester.pumpWidget(view(initial)));
    await _waitFor(tester, find.byType(FastLottie));
    final original = tester
        .widget<FastLottie>(find.byType(FastLottie))
        .composition;
    await tester.pumpWidget(view(initial, width: 60));
    expect(
      tester.widget<FastLottie>(find.byType(FastLottie)).composition,
      same(original),
    );
    await tester.runAsync(
      () => tester.pumpWidget(view(bytes(fixture('static')..['w'] = 999))),
    );
    await _waitFor(tester, find.byType(FastLottie));
    expect(
      tester.widget<FastLottie>(find.byType(FastLottie)).composition.width,
      999,
    );
  });

  test(
    'raster validation identifies the invalid parameter before allocating',
    () async {
      Matcher invalid(String name) =>
          isA<ArgumentError>().having((error) => error.name, 'name', name);
      expect(
        () => FastLottieRasterCache(maximumDiskBytes: -1),
        throwsA(invalid('maximumDiskBytes')),
      );
      expect(
        () => FastLottieRasterCache(maximumBytes: 0, reservedPosterBytes: 1),
        throwsA(invalid('reservedPosterBytes')),
      );
      expect(
        () => FastLottieRasterCache(workerCount: 0),
        throwsA(invalid('workerCount')),
      );
      final player = FastLottiePlayer(
        FastLottieComposition.fromJson(fixture('static')),
      );
      addTearDown(player.dispose);
      await expectLater(
        player.prepareRaster(width: 10, height: 0),
        throwsA(invalid('height')),
      );
      await expectLater(
        player.prepareRaster(width: 10, height: 10, maximumBytes: 399),
        throwsA(invalid('maximumBytes')),
      );
      await expectLater(
        player.prepareRaster(width: 1e19, height: 1e19),
        throwsA(invalid('maximumBytes')),
      );
    },
  );
}
