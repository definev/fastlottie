import 'dart:async' show unawaited;
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show bytes, fixture;
import 'raster_cache_test.dart' show distinctIcon, drain, record;

/// Wraps a real [ui.Canvas] to observe or inject failures in `drawImageRect`.
class _InterceptCanvas implements Canvas {
  _InterceptCanvas(this._inner, {this.throwOnDrawImageRect = false});

  final Canvas _inner;
  final bool throwOnDrawImageRect;
  Paint? lastImagePaint;
  int drawImageRectCalls = 0;

  @override
  void drawImageRect(ui.Image image, Rect src, Rect dst, Paint paint) {
    drawImageRectCalls++;
    lastImagePaint = paint;
    if (throwOnDrawImageRect) {
      throw StateError('Simulated GPU image draw failure');
    }
    _inner.drawImageRect(image, src, dst, paint);
  }

  @override
  dynamic noSuchMethod(Invocation invocation) {
    // Forward all vector drawing commands cleanly to the underlying canvas.
    switch (invocation.memberName) {
      case #save:
        return _inner.save();
      case #restore:
        return _inner.restore();
      case #translate:
        return _inner.translate(
          invocation.positionalArguments[0] as double,
          invocation.positionalArguments[1] as double,
        );
      case #scale:
        return _inner.scale(
          invocation.positionalArguments[0] as double,
          invocation.positionalArguments.length > 1
              ? invocation.positionalArguments[1] as double?
              : null,
        );
      case #clipRect:
        return _inner.clipRect(invocation.positionalArguments[0] as Rect);
      case #transform:
        return _inner.transform(
          invocation.positionalArguments[0] as Float64List,
        );
      case #drawPath:
        return _inner.drawPath(
          invocation.positionalArguments[0] as Path,
          invocation.positionalArguments[1] as Paint,
        );
      case #drawPicture:
        return _inner.drawPicture(
          invocation.positionalArguments[0] as ui.Picture,
        );
      case #drawRect:
        return _inner.drawRect(
          invocation.positionalArguments[0] as Rect,
          invocation.positionalArguments[1] as Paint,
        );
      case #drawRRect:
        return _inner.drawRRect(
          invocation.positionalArguments[0] as RRect,
          invocation.positionalArguments[1] as Paint,
        );
      case #drawOval:
        return _inner.drawOval(
          invocation.positionalArguments[0] as Rect,
          invocation.positionalArguments[1] as Paint,
        );
      case #drawCircle:
        return _inner.drawCircle(
          invocation.positionalArguments[0] as Offset,
          invocation.positionalArguments[1] as double,
          invocation.positionalArguments[2] as Paint,
        );
      case #saveLayer:
        return _inner.saveLayer(
          invocation.positionalArguments[0] as Rect?,
          invocation.positionalArguments[1] as Paint,
        );
      case #clipPath:
        return _inner.clipPath(invocation.positionalArguments[0] as Path);
      default:
        return super.noSuchMethod(invocation);
    }
  }
}

Widget _host(Widget child) => MediaQuery(
  data: const MediaQueryData(),
  child: Directionality(
    textDirection: TextDirection.ltr,
    child: Center(child: child),
  ),
);

FastLottieComposition _nonSquareComposition({
  required double width,
  required double height,
  bool animated = false,
}) {
  final doc = fixture(animated ? 'icon' : 'static')
    ..['w'] = width
    ..['h'] = height;
  return FastLottieComposition.fromJson(doc);
}

void main() {
  group('DefaultRasterCacheScope grace period', () {
    tearDown(() {
      FastLottieRasterCache.debugResetDefaultIdleGracePeriod();
      FastLottieRasterCache.disposeIdleDefaultCache();
    });

    testWidgets(
      'keeps shared cache warm across route transitions and disposes after grace period',
      (tester) async {
        FastLottieRasterCache.defaultIdleGracePeriod = const Duration(
          seconds: 5,
        );
        final comp = FastLottieComposition.fromJson(fixture('icon'));

        await tester.pumpWidget(
          _host(FastLottie(composition: comp, width: 48, height: 48)),
        );
        final firstShared = FastLottieRasterCache.debugSharedDefaultCache;
        expect(firstShared, isNotNull);

        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 20)),
        );
        await tester.pump();

        // Unmount last widget: cache stays alive during the 5s grace window.
        await tester.pumpWidget(const SizedBox.shrink());
        await tester.pump(const Duration(seconds: 2));
        expect(
          FastLottieRasterCache.debugSharedDefaultCache,
          same(firstShared),
        );

        // Remount within grace window: reuses exact same cache instance.
        await tester.pumpWidget(
          _host(FastLottie(composition: comp, width: 48, height: 48)),
        );
        expect(
          FastLottieRasterCache.debugSharedDefaultCache,
          same(firstShared),
        );

        // Unmount again and let the full 5s grace window elapse cleanly.
        await tester.pumpWidget(const SizedBox.shrink());
        await tester.pump(const Duration(seconds: 4));
        expect(
          FastLottieRasterCache.debugSharedDefaultCache,
          same(firstShared),
        );
        await tester.pump(const Duration(seconds: 2));
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);
        expect(tester.takeException(), isNull);
      },
    );

    testWidgets(
      'backgrounding or memory pressure disposes idle default cache immediately',
      (tester) async {
        FastLottieRasterCache.defaultIdleGracePeriod = const Duration(
          seconds: 5,
        );
        final comp = FastLottieComposition.fromJson(fixture('icon'));

        // 1. Backgrounding while idle disposes immediately.
        await tester.pumpWidget(
          _host(FastLottie(composition: comp, width: 48, height: 48)),
        );
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 20)),
        );
        await tester.pump();
        await tester.pumpWidget(const SizedBox.shrink());
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNotNull);

        tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);

        // 2. Memory pressure while idle disposes immediately.
        tester.binding.handleAppLifecycleStateChanged(
          AppLifecycleState.resumed,
        );
        await tester.pumpWidget(
          _host(FastLottie(composition: comp, width: 48, height: 48)),
        );
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 20)),
        );
        await tester.pump();
        await tester.pumpWidget(const SizedBox.shrink());
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNotNull);

        tester.binding.handleMemoryPressure();
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);
      },
    );
  });

  group('Async disk scan & multi-entry scene tracking', () {
    testWidgets(
      'async disk scan populates diskBytes, enforces budget, and discards stale scans',
      (tester) async {
        final dirA = Directory.systemTemp.createTempSync('fastlottie_scan_a_');
        final dirB = Directory.systemTemp.createTempSync('fastlottie_scan_b_');
        addTearDown(() {
          if (dirA.existsSync()) dirA.deleteSync(recursive: true);
          if (dirB.existsSync()) dirB.deleteSync(recursive: true);
        });

        // Seed two .flcache files in dirA via a writer cache.
        final c1 = distinctIcon(1);
        final c2 = distinctIcon(2);
        final writer = FastLottieRasterCache(
          framesPerStrip: 1,
          diskCacheDirectory: dirA.path,
          workerCount: 1,
        );
        final p1 = FastLottiePlayer(c1, rasterCache: writer);
        final p2 = FastLottiePlayer(c2, rasterCache: writer);
        record(p1, 0, size: 48);
        await drain(tester, writer);
        record(p2, 0, size: 48);
        await drain(tester, writer);
        final totalWritten = writer.diskBytes;
        expect(totalWritten, greaterThan(0));
        p1.dispose();
        p2.dispose();
        writer.dispose();

        // Reader cache scans asynchronously (non-blocking constructor).
        final reader = FastLottieRasterCache(
          framesPerStrip: 1,
          diskCacheDirectory: dirA.path,
          maximumDiskBytes: totalWritten ~/ 2 + 1,
          workerCount: 1,
        );
        addTearDown(reader.dispose);
        await tester.runAsync(() => reader.debugDiskScanReady);
        expect(reader.diskBytes, greaterThan(0));
        expect(reader.diskBytes, lessThanOrEqualTo(totalWritten ~/ 2 + 1));

        // Switching directory immediately invalidates prior directory and scans empty dirB.
        reader.attachDiskDirectory(dirB.path);
        await tester.runAsync(() => reader.debugDiskScanReady);
        expect(reader.diskBytes, 0);
      },
    );

    testWidgets(
      'multi-resolution entries sharing contentKey do not thrash worker scene release',
      (tester) async {
        final doc = fixture('icon')..['op'] = 6;
        final comp = FastLottieComposition.fromJson(doc);
        final cache = FastLottieRasterCache(framesPerStrip: 1, workerCount: 1);
        final small = FastLottiePlayer(comp, rasterCache: cache);
        final large = FastLottiePlayer(comp, rasterCache: cache);
        addTearDown(() {
          small.dispose();
          large.dispose();
          cache.dispose();
        });

        // Interleave small (32x32) finishing all 6 frames while large (96x96) warms.
        for (var i = 0; i < comp.frameCount; i++) {
          record(small, i / comp.frameCount, size: 32);
          await drain(tester, cache);
          if (i < 2) {
            record(large, i / comp.frameCount, size: 96);
            await drain(tester, cache);
          }
        }
        // Small now has all frames cached; re-reading small while large warms remaining
        // frames must not evict the shared scene and cause errors or redundant renders.
        for (var i = 2; i < comp.frameCount; i++) {
          record(small, 0, size: 32);
          await drain(tester, cache);
          record(large, i / comp.frameCount, size: 96);
          await drain(tester, cache);
        }
        expect(cache.lastError, isNull);
        expect(cache.debugRegisteredWorkerScenes, 1);
      },
    );
  });

  group('Per-entry error isolation & prewarmCache / prepareRaster', () {
    testWidgets(
      'drawImageRect error isolates only the failing entry without wiping sibling entries',
      (tester) async {
        final compA = distinctIcon(1);
        final compB = distinctIcon(2);
        final cache = FastLottieRasterCache(framesPerStrip: 1, workerCount: 1);
        final playerA = FastLottiePlayer(compA, rasterCache: cache);
        final playerB = FastLottiePlayer(compB, rasterCache: cache);
        addTearDown(() {
          playerA.dispose();
          playerB.dispose();
          cache.dispose();
        });

        record(playerA, 0, size: 48);
        record(playerB, 0, size: 48);
        await drain(tester, cache);
        expect(cache.entries, 2);

        // Trigger a drawImageRect failure on playerA only.
        final rec = ui.PictureRecorder();
        final failingCanvas = _InterceptCanvas(
          ui.Canvas(rec),
          throwOnDrawImageRect: true,
        );
        playerA.draw(failingCanvas, const Rect.fromLTWH(0, 0, 48, 48), 0);
        rec.endRecording().dispose();

        expect(failingCanvas.drawImageRectCalls, 1);
        expect(cache.lastError, isA<StateError>());

        // Flush post-frame eviction for playerA.
        await tester.pump();
        expect(cache.entries, 1);

        // PlayerB remains intact and continues hitting the raster cache!
        final hitsBefore = cache.hits;
        final recB = ui.PictureRecorder();
        final okCanvas = _InterceptCanvas(ui.Canvas(recB));
        playerB.draw(okCanvas, const Rect.fromLTWH(0, 0, 48, 48), 0);
        recB.endRecording().dispose();
        expect(okCanvas.drawImageRectCalls, 1);
        expect(cache.hits, hitsBefore + 1);
      },
    );

    testWidgets(
      'FilterQuality.high override is passed through without downgrading to medium',
      (tester) async {
        final comp = FastLottieComposition.fromJson(fixture('static'));
        final cache = FastLottieRasterCache(framesPerStrip: 1, workerCount: 1);
        final player = FastLottiePlayer(comp, rasterCache: cache);
        addTearDown(() {
          player.dispose();
          cache.dispose();
        });

        record(player, 0, size: 48);
        await drain(tester, cache);

        final rec = ui.PictureRecorder();
        final spy = _InterceptCanvas(ui.Canvas(rec));
        player.draw(
          spy,
          const Rect.fromLTWH(0, 0, 48, 48),
          0,
          filterQuality: FilterQuality.high,
        );
        rec.endRecording().dispose();
        expect(spy.drawImageRectCalls, 1);
        expect(spy.lastImagePaint?.filterQuality, FilterQuality.high);
      },
    );

    testWidgets(
      'prewarmCache completes cleanly on disable, queue eviction, clearCache, and dispose',
      (tester) async {
        Future<void> expectCompletes(Future<void> future) async {
          var done = false;
          Object? err;
          unawaited(
            future.then(
              (_) => done = true,
              onError: (Object e) {
                err = e;
                done = true;
              },
            ),
          );
          for (var i = 0; i < 400 && !done; i++) {
            await tester.runAsync(
              () => Future<void>.delayed(const Duration(milliseconds: 5)),
            );
            await tester.pump();
          }
          expect(done, isTrue, reason: 'prewarmCache future hung');
          expect(err, isNull);
        }

        // 1. Disabling cache while in-flight and queued completes prewarmCache.
        final cache1 = FastLottieRasterCache(
          workerCount: 1,
          maximumInFlight: 1,
          maximumPendingFrames: 2,
          framesPerStrip: 1,
        );
        final p1 = FastLottiePlayer(distinctIcon(1), rasterCache: cache1);
        final p2 = FastLottiePlayer(distinctIcon(2), rasterCache: cache1);
        addTearDown(() {
          p1.dispose();
          p2.dispose();
          cache1.dispose();
        });
        final f1 = p1.prewarmCache(destinationSize: const Size(48, 48));
        final f2 = p2.prewarmCache(destinationSize: const Size(48, 48));
        cache1.enabled = false;
        await expectCompletes(f2);
        await expectCompletes(f1);

        // 2. Queue eviction completes evicted prewarmCache waiter.
        final cache2 = FastLottieRasterCache(
          workerCount: 1,
          maximumInFlight: 1,
          maximumPendingFrames: 1,
          framesPerStrip: 1,
        );
        final a = FastLottiePlayer(distinctIcon(1), rasterCache: cache2);
        final b = FastLottiePlayer(distinctIcon(2), rasterCache: cache2);
        final c = FastLottiePlayer(distinctIcon(3), rasterCache: cache2);
        addTearDown(() {
          a.dispose();
          b.dispose();
          c.dispose();
          cache2.dispose();
        });
        // `a` occupies the 1 in-flight slot; `b` occupies the 1 pending slot; `c` evicts `b`.
        final fa = a.prewarmCache(destinationSize: const Size(48, 48));
        final fb = b.prewarmCache(destinationSize: const Size(48, 48));
        final fc = c.prewarmCache(destinationSize: const Size(48, 48));
        await expectCompletes(fb);
        await expectCompletes(fa);
        await expectCompletes(fc);

        // 3. clearCache() and dispose() complete pending prewarmCache waiters.
        final cache3 = FastLottieRasterCache(
          workerCount: 1,
          maximumInFlight: 1,
          framesPerStrip: 1,
        );
        final pClear = FastLottiePlayer(distinctIcon(1), rasterCache: cache3);
        final pDispose = FastLottiePlayer(distinctIcon(2), rasterCache: cache3);
        addTearDown(() {
          pClear.dispose();
          cache3.dispose();
        });
        final fClear = pClear.prewarmCache(destinationSize: const Size(48, 48));
        final fDispose = pDispose.prewarmCache(
          destinationSize: const Size(48, 48),
        );
        pClear.clearCache();
        pDispose.dispose();
        await expectCompletes(fClear);
        await expectCompletes(fDispose);
      },
    );

    testWidgets(
      'prepareRaster notifies listeners and tolerates concurrent draw() calls',
      (tester) async {
        final doc = fixture('icon')..['op'] = 6;
        final comp = FastLottieComposition.fromJson(doc);
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(player.dispose);

        var notifications = 0;
        player.addListener(() => notifications++);

        await tester.pumpWidget(
          _host(
            FastLottieView(
              player: player,
              progress: const AlwaysStoppedAnimation<double>(0),
              width: 48,
              height: 48,
            ),
          ),
        );

        await tester.runAsync(() async {
          final preparing = player.prepareRaster(width: 48, height: 48);
          // Interleave vector draws while prepareRaster awaits toImage().
          record(player, 0.5, size: 48);
          record(player, 0.8, size: 48);
          await preparing;
        });

        expect(notifications, greaterThanOrEqualTo(1));
        expect(player.rasterBytes, greaterThan(0));
        expect(tester.takeException(), isNull);
      },
    );
  });

  group('FastLottiePictureCache multi-user limits', () {
    test('tight-budget sibling player does not clobber frames cached for unbounded sibling', () {
      final doc = fixture('icon')..['op'] = 10;
      final comp = FastLottieComposition.fromJson(doc);
      final cache = FastLottiePictureCache(
        maximumCompositions: 4,
        bypassOversizedLoops: false,
      );
      addTearDown(cache.dispose);

      final wide = FastLottiePlayer(
        comp,
        cache: FastLottieCache.unbounded,
        pictureCache: cache,
      );
      final tight = FastLottiePlayer(
        comp,
        cache: const FastLottieCache(
          maximumFrames: 2,
          maximumCommands: 1 << 20,
        ),
        pictureCache: cache,
      );
      addTearDown(() {
        wide.dispose();
        tight.dispose();
      });

      for (var i = 0; i < 5; i++) {
        record(wide, i / 10);
      }
      expect(cache.cachedFrames, 5);

      // Tight player records a 6th frame; wide player's 5 frames must stay intact.
      record(tight, 5 / 10);
      expect(cache.cachedFrames, 6);

      // Once wide leaves, entry trims down to tight's limit (2).
      wide.dispose();
      expect(cache.cachedFrames, 2);
    });
  });

  group('Widget layout, shared clock, Semantics & bytes', () {
    testWidgets(
      'single-axis width or height preserves composition aspect ratio',
      (tester) async {
        final comp = _nonSquareComposition(width: 200, height: 100);
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(player.dispose);

        // FastLottie active: width-only -> 80x40.
        await tester.pumpWidget(
          _host(FastLottie(composition: comp, width: 80, usePipeline: false)),
        );
        expect(tester.getSize(find.byType(FastLottie)), const Size(80, 40));

        // FastLottie active: height-only -> 60x30.
        await tester.pumpWidget(
          _host(FastLottie(composition: comp, height: 30, usePipeline: false)),
        );
        expect(tester.getSize(find.byType(FastLottie)), const Size(60, 30));

        // FastLottie hidden: width-only -> 80x40.
        await tester.pumpWidget(
          _host(
            FastLottiePlaybackScope(
              playback: FastLottiePlayback.hidden,
              child: FastLottie(
                composition: comp,
                width: 80,
                usePipeline: false,
              ),
            ),
          ),
        );
        expect(tester.getSize(find.byType(FastLottie)), const Size(80, 40));

        // FastLottieView: width-only -> 80x40, height-only -> 60x30.
        await tester.pumpWidget(
          _host(
            FastLottieView(
              player: player,
              progress: const AlwaysStoppedAnimation<double>(0),
              width: 80,
            ),
          ),
        );
        expect(tester.getSize(find.byType(FastLottieView)), const Size(80, 40));

        await tester.pumpWidget(
          _host(
            FastLottieView(
              player: player,
              progress: const AlwaysStoppedAnimation<double>(0),
              height: 30,
            ),
          ),
        );
        expect(tester.getSize(find.byType(FastLottieView)), const Size(60, 30));
      },
    );

    testWidgets(
      'toggling repeat preserves progress between shared clock and AnimationController',
      (tester) async {
        final comp = FastLottieComposition.fromJson(fixture('icon'));
        Widget buildWidget({required bool repeat}) => _host(
          FastLottie(
            composition: comp,
            width: 48,
            height: 48,
            repeat: repeat,
            usePipeline: false,
            cache: FastLottieCache.none,
          ),
        );

        final half = comp.duration ~/ 2;
        await tester.pumpWidget(buildWidget(repeat: true));
        // First tick anchors Ticker._startTime at elapsed=0; second advances to half.
        await tester.pump(const Duration(milliseconds: 16));
        await tester.pump(half);
        expect(tester.hasRunningAnimations, isTrue);

        // Toggle repeat -> false: progress continues forward from ~0.5, not reset to 0.
        await tester.pumpWidget(buildWidget(repeat: false));
        expect(tester.hasRunningAnimations, isTrue);
        // Anchor AnimationController ticker, then advance just past the remaining half
        // (would still be running if progress had snapped back to 0.0!).
        await tester.pump(const Duration(milliseconds: 16));
        await tester.pump(half + const Duration(milliseconds: 50));
        expect(tester.hasRunningAnimations, isFalse);

        // Toggle repeat -> true resumes cleanly on shared clock.
        await tester.pumpWidget(buildWidget(repeat: true));
        await tester.pump(const Duration(milliseconds: 50));
        expect(tester.hasRunningAnimations, isTrue);

        await tester.pumpWidget(const SizedBox.shrink());
        expect(tester.hasRunningAnimations, isFalse);
      },
    );

    testWidgets(
      'GlobalKey reparenting (deactivate/activate) pauses and resumes shared clock cleanly',
      (tester) async {
        final comp = FastLottieComposition.fromJson(fixture('icon'));
        final key = GlobalKey();

        await tester.pumpWidget(
          _host(
            Container(
              key: const ValueKey('slot-a'),
              child: FastLottie(
                key: key,
                composition: comp,
                width: 48,
                height: 48,
                usePipeline: false,
                cache: FastLottieCache.none,
              ),
            ),
          ),
        );
        await tester.pump(const Duration(milliseconds: 50));
        expect(tester.hasRunningAnimations, isTrue);

        // Reparent under a new slot to trigger deactivate() -> activate().
        await tester.pumpWidget(
          _host(
            Row(
              children: [
                const SizedBox(width: 10),
                Container(
                  key: const ValueKey('slot-b'),
                  child: FastLottie(
                    key: key,
                    composition: comp,
                    width: 48,
                    height: 48,
                    usePipeline: false,
                    cache: FastLottieCache.none,
                  ),
                ),
              ],
            ),
          ),
        );
        await tester.pump(const Duration(milliseconds: 50));
        expect(tester.hasRunningAnimations, isTrue);
        expect(tester.takeException(), isNull);

        await tester.pumpWidget(const SizedBox.shrink());
        expect(tester.hasRunningAnimations, isFalse);
      },
    );

    testWidgets(
      'semanticLabel and excludeFromSemantics configure semantics cleanly',
      (tester) async {
        final staticComp = FastLottieComposition.fromJson(fixture('static'));
        final player = FastLottiePlayer(
          staticComp,
          cache: FastLottieCache.none,
        );
        addTearDown(player.dispose);

        await tester.pumpWidget(
          _host(
            FastLottie(
              composition: staticComp,
              width: 48,
              height: 48,
              usePipeline: false,
              semanticLabel: 'Checkmark icon',
            ),
          ),
        );
        final semantics = tester.getSemantics(find.byType(FastLottie));
        expect(semantics.label, 'Checkmark icon');
        expect(semantics.flagsCollection.isImage, isTrue);
        expect(
          find.descendant(
            of: find.byType(FastLottie),
            matching: find.byType(RepaintBoundary),
          ),
          findsNothing,
        );

        await tester.pumpWidget(
          _host(
            FastLottie(
              composition: staticComp,
              width: 48,
              height: 48,
              usePipeline: false,
              excludeFromSemantics: true,
            ),
          ),
        );
        expect(
          find.descendant(
            of: find.byType(FastLottie),
            matching: find.byType(ExcludeSemantics),
          ),
          findsOneWidget,
        );

        await tester.pumpWidget(
          _host(
            FastLottieView(
              player: player,
              progress: const AlwaysStoppedAnimation<double>(0),
              width: 48,
              height: 48,
              semanticLabel: 'View checkmark',
            ),
          ),
        );
        final viewSemantics = tester.getSemantics(find.byType(FastLottieView));
        expect(viewSemantics.label, 'View checkmark');
        expect(viewSemantics.flagsCollection.isImage, isTrue);
        expect(
          find.descendant(
            of: find.byType(FastLottieView),
            matching: find.byType(RepaintBoundary),
          ),
          findsNothing,
        );

        await tester.pumpWidget(const SizedBox.shrink());
      },
    );

    testWidgets(
      'FastLottie.bytes reuses decoded composition when rebuilt with a fresh equal byte copy',
      (tester) async {
        final raw1 = Uint8List.fromList(bytes(fixture('static')));
        final raw2 = Uint8List.fromList(raw1);
        expect(identical(raw1, raw2), isFalse);

        Widget buildBytes(Uint8List data) => _host(
          FastLottie.bytes(
            data,
            width: 48,
            height: 48,
            animate: false,
            usePipeline: false,
            placeholderBuilder: (_) => const SizedBox(key: ValueKey('loading')),
          ),
        );

        await tester.runAsync(() => tester.pumpWidget(buildBytes(raw1)));
        for (
          var i = 0;
          i < 200 && find.byType(FastLottie).evaluate().isEmpty;
          i++
        ) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 5)),
          );
          await tester.pump();
        }
        expect(find.byType(FastLottie), findsOneWidget);
        final original = tester
            .widget<FastLottie>(find.byType(FastLottie))
            .composition;

        // Rebuild with distinct Uint8List containing identical bytes.
        await tester.pumpWidget(buildBytes(raw2));
        expect(find.byKey(const ValueKey('loading')), findsNothing);
        expect(
          tester.widget<FastLottie>(find.byType(FastLottie)).composition,
          same(original),
        );
      },
    );

    testWidgets(
      'PR #7 review fixes: width double.infinity / 0 do not crash, prewarmCache resolves on entry switch, clock handoff keeps progress across PlaybackScope toggle',
      (tester) async {
        final comp = FastLottieComposition.fromJson(fixture('icon'));
        final cache = FastLottieRasterCache(maximumBytes: 32 * 1024 * 1024);
        addTearDown(cache.dispose);

        // 1. width: double.infinity and width: 0 must not crash on mount/prewarm.
        await tester.pumpWidget(
          _host(
            SizedBox(
              width: 200,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  FastLottie(
                    composition: comp,
                    width: double.infinity,
                    rasterCache: cache,
                    animate: false,
                  ),
                  FastLottie(
                    composition: comp,
                    width: 0,
                    rasterCache: cache,
                    animate: false,
                  ),
                ],
              ),
            ),
          ),
        );
        await tester.pump();
        expect(find.byType(FastLottie), findsNWidgets(2));

        // 2. prewarmCache() resolves promptly when player switches to another entry mid-await.
        final player = FastLottiePlayer(comp, rasterCache: cache);
        addTearDown(player.dispose);
        var firstDone = false;
        var secondDone = false;
        final first = player
            .prewarmCache(destinationSize: const Size(64, 64))
            .then((_) => firstDone = true);
        // Switch to another size immediately; first future must complete without hanging.
        final second = player
            .prewarmCache(destinationSize: const Size(96, 96))
            .then((_) => secondDone = true);
        await tester.pump();
        expect(firstDone, isTrue);
        for (var i = 0; i < 200 && !secondDone; i++) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 5)),
          );
          await tester.pump();
        }
        await first;
        await second;
        expect(secondDone, isTrue);

        // 3. Toggling FastLottiePlaybackScope after repeat: false -> true must not rewind shared clock.
        Widget buildClockTree({
          required bool repeat,
          required FastLottiePlayback playback,
        }) => _host(
          FastLottiePlaybackScope(
            playback: playback,
            child: FastLottie(
              composition: comp,
              width: 64,
              height: 64,
              repeat: repeat,
              animate: true,
              usePipeline: false,
            ),
          ),
        );

        await tester.pumpWidget(
          buildClockTree(repeat: false, playback: FastLottiePlayback.active),
        );
        // Advance controller slightly (~0.25).
        await tester.pump(const Duration(milliseconds: 16));
        await tester.pump(comp.duration ~/ 4);
        final state = tester.state<State<FastLottie>>(find.byType(FastLottie));
        final anim1 = (state as dynamic).animation as Animation<double>;
        final p1 = anim1.value;
        expect(p1, greaterThan(0.1));

        // Switch to repeat: true (hands off to shared clock) and advance further.
        await tester.pumpWidget(
          buildClockTree(repeat: true, playback: FastLottiePlayback.active),
        );
        await tester.pump(const Duration(milliseconds: 16));
        await tester.pump(comp.duration ~/ 3);
        final anim2 = (state as dynamic).animation as Animation<double>;
        final p2 = anim2.value;
        expect(p2, greaterThan(p1 + 0.1));

        // Pause via FastLottiePlaybackScope.hidden, then return to active.
        await tester.pumpWidget(
          buildClockTree(repeat: true, playback: FastLottiePlayback.hidden),
        );
        await tester.pumpWidget(
          buildClockTree(repeat: true, playback: FastLottiePlayback.active),
        );
        final anim3 = (state as dynamic).animation as Animation<double>;
        expect(anim3.value, greaterThanOrEqualTo(p2 - 0.02));
      },
    );
  });
}
