import 'dart:async';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/simd_stub.dart' as stub;
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, fixture;
import 'raster_cache_test.dart' show drain, record;

class _TrackedProgress extends AlwaysStoppedAnimation<double> {
  _TrackedProgress(super.value);

  int listeners = 0;

  @override
  void addListener(VoidCallback listener) => listeners++;

  @override
  void removeListener(VoidCallback listener) => listeners--;
}

class _TrackedPlayer extends FastLottiePlayer {
  _TrackedPlayer(super.composition);

  bool get isObserved => hasListeners;
}

Widget _host(Widget child) => MediaQuery(
  data: const MediaQueryData(),
  child: Directionality(
    textDirection: TextDirection.ltr,
    child: Center(child: child),
  ),
);

void main() {
  test('cache and compile options compare by value and work as map keys', () {
    final first = FastLottieCache(maximumFrames: 7, maximumCommands: 100);
    final equal = FastLottieCache(maximumFrames: 7, maximumCommands: 100);
    expect(identical(first, equal), isFalse);
    expect(first, equal);
    expect({first: 'cached'}[equal], 'cached');
    expect(
      first,
      isNot(const FastLottieCache(maximumFrames: 8, maximumCommands: 100)),
    );
    expect(
      first,
      isNot(const FastLottieCache(maximumFrames: 7, maximumCommands: 101)),
    );
    final options = FastLottieOptions(useSimd: false);
    final sameOptions = FastLottieOptions(useSimd: false);
    expect(identical(options, sameOptions), isFalse);
    expect({options: 'compiled'}[sameOptions], 'compiled');
    expect(options, isNot(const FastLottieOptions()));
  });

  test(
    'native borrowed constructor is present but unsupported in the stub',
    () {
      expect(
        () => stub.NativePixelBuffer.borrowed(Object(), 1),
        throwsUnsupportedError,
      );
    },
  );

  testWidgets(
    'equal inline cache settings preserve player and vector pictures',
    (tester) async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      Widget view(int limit) => _host(
        FastLottie(
          composition: composition,
          animate: false,
          usePipeline: false,
          cache: FastLottieCache(maximumFrames: limit),
        ),
      );
      await tester.pumpWidget(view(5));
      CustomPainter painter() =>
          tester.widget<CustomPaint>(find.byType(CustomPaint)).painter!;
      final before = painter();
      await tester.pumpWidget(view(5));
      expect(painter().shouldRepaint(before), isFalse);
      await tester.pumpWidget(view(6));
      expect(painter().shouldRepaint(before), isTrue);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'frames per strip selects adaptive, single-frame or fixed-size buffers',
    (tester) async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      final cases = <(FastLottieRasterCache, int?, bool)>[
        (FastLottieRasterCache(), null, true),
        (FastLottieRasterCache(framesPerStrip: null), null, true),
        (FastLottieRasterCache(framesPerStrip: 1), 1, false),
        (FastLottieRasterCache(framesPerStrip: 3), 3, true),
      ];
      for (final (cache, configured, usesStrips) in cases) {
        final player = FastLottiePlayer(composition, rasterCache: cache);
        try {
          expect(cache.framesPerStrip, configured);
          record(player, 0);
          expect(
            cache.debugEntryFramesPerStrip(player),
            usesStrips ? greaterThan(1) : 1,
          );
          await drain(tester, cache);
        } finally {
          player.dispose();
          cache.dispose();
        }
      }
      expect(
        () => FastLottieRasterCache(framesPerStrip: 0),
        throwsArgumentError,
      );
    },
  );

  testWidgets(
    'view keeps its repaint notifier and rewires only current owners',
    (tester) async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      final first = _TrackedPlayer(composition);
      final second = _TrackedPlayer(composition);
      final progress = _TrackedProgress(.2);
      final replacement = _TrackedProgress(.4);
      Widget view(
        FastLottiePlayer player,
        Animation<double> animation, {
        bool frames = true,
      }) => _host(
        FastLottieView(
          player: player,
          progress: animation,
          useFrameRate: frames,
        ),
      );
      await tester.pumpWidget(view(first, progress));
      final viewState = tester.state(find.byType(FastLottieView));
      final painter = tester
          .widget<CustomPaint>(find.byType(CustomPaint))
          .painter!;
      expect(progress.listeners, 1);
      expect(first.isObserved, isTrue);
      await tester.pumpWidget(view(first, progress));
      expect(progress.listeners, 1);
      final nextPainter = tester
          .widget<CustomPaint>(find.byType(CustomPaint))
          .painter!;
      expect(tester.state(find.byType(FastLottieView)), same(viewState));
      expect(nextPainter.shouldRepaint(painter), isFalse);
      await tester.pumpWidget(view(second, replacement, frames: false));
      expect(first.isObserved, isFalse);
      expect(progress.listeners, 0);
      expect(second.isObserved, isTrue);
      expect(replacement.listeners, 1);
      expect(
        tester
            .widget<CustomPaint>(find.byType(CustomPaint))
            .painter!
            .shouldRepaint(nextPainter),
        isTrue,
      );
      await tester.pumpWidget(const SizedBox());
      expect(second.isObserved, isFalse);
      expect(replacement.listeners, 0);
      // The view never disposes caller-owned players.
      record(first, 0);
      record(second, 0);
      first.dispose();
      second.dispose();
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'network replacements reset UI, cancel stale loads and use current settings',
    (tester) async {
      final requests = <Completer<Uint8List>>[];
      final tokens = <FastLottieCancelToken>[];
      Future<Uint8List> loader(
        Uri uri, {
        Map<String, String>? headers,
        FastLottieCancelToken? cancelToken,
      }) {
        tokens.add(cancelToken!);
        final pending = Completer<Uint8List>();
        requests.add(pending);
        return pending.future;
      }

      Widget view(String uri, {int limit = 1024, bool simd = true}) => _host(
        FastLottieNetwork(
          uri: Uri.parse(uri),
          loader: loader,
          options: FastLottieOptions(useSimd: simd),
          maximumNetworkBytes: limit,
          animate: false,
          usePipeline: false,
          placeholderBuilder: (_) => const SizedBox(key: ValueKey('loading')),
          errorBuilder: (_, error, retry) =>
              const SizedBox(key: ValueKey('error')),
        ),
      );
      Future<void> complete(int index) async {
        await tester.runAsync(() async {
          requests[index].complete(Uint8List.fromList(bytes(fixture('icon'))));
          // Wait for the real decoding isolate, without advancing animation time.
          for (var i = 0; i < 100; i++) {
            await Future<void>.delayed(const Duration(milliseconds: 5));
            await tester.pump();
            if (find.byType(FastLottie).evaluate().isNotEmpty) return;
          }
        });
        await tester.pump();
        expect(find.byType(FastLottie), findsOneWidget);
      }

      await tester.pumpWidget(view('https://example.com/a'));
      await complete(0);
      await tester.pumpWidget(view('https://example.com/a'));
      expect(requests, hasLength(1)); // Equal options don't reload.
      await tester.pumpWidget(view('https://example.com/b'));
      expect(tokens[0].isCancelled, isTrue);
      expect(find.byKey(const ValueKey('loading')), findsOneWidget);
      expect(find.byType(FastLottie), findsNothing);
      await tester.pumpWidget(view('https://example.com/c'));
      expect(tokens[1].isCancelled, isTrue);
      await tester.runAsync(() async {
        requests[1].completeError(StateError('stale failure'));
        await Future<void>.delayed(Duration.zero);
      });
      await tester.pump();
      expect(find.byKey(const ValueKey('error')), findsNothing);
      await complete(2);
      await tester.pumpWidget(view('https://example.com/c', limit: 2048));
      expect(requests, hasLength(4));
      expect(find.byKey(const ValueKey('loading')), findsOneWidget);
      await tester.pumpWidget(
        view('https://example.com/c', limit: 2048, simd: false),
      );
      expect(requests, hasLength(5));
      expect(tokens[3].isCancelled, isTrue);
      await complete(4);
      expect(
        tester
            .widget<FastLottie>(find.byType(FastLottie))
            .composition
            .options
            .useSimd,
        isFalse,
      );
      await tester.pumpWidget(const SizedBox());
      expect(tokens.last.isCancelled, isTrue);
      expect(tester.takeException(), isNull);
    },
  );
}
