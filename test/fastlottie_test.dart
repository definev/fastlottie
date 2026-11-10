import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

Map<String, dynamic> fixture(String name) =>
    jsonDecode(File('example/assets/$name.json').readAsStringSync())
        as Map<String, dynamic>;
List<int> bytes(Map<String, dynamic> json) => utf8.encode(jsonEncode(json));
Future<Uint8List> render(void Function(Canvas) draw, {int size = 256}) async {
  final recorder = ui.PictureRecorder();
  draw(Canvas(recorder));
  final picture = recorder.endRecording();
  final image = await picture.toImage(size, size);
  final data = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
  image.dispose();
  picture.dispose();
  return data!.buffer.asUint8List();
}

Future<void> compare(
  Map<String, dynamic> json,
  List<double> frames, {
  bool simd = false,
  BoxFit fit = BoxFit.contain,
  Alignment alignment = Alignment.center,
  Rect destination = const Rect.fromLTWH(0, 0, 256, 256),
}) async {
  final fast = FastLottiePlayer(
    FastLottieComposition.fromJson(
      json,
      options: FastLottieOptions(useSimd: simd),
    ),
    cache: FastLottieCache.none,
  );
  final reference = LottieDrawable(
    LottieComposition.parseJsonBytes(bytes(json)),
    frameRate: FrameRate.max,
  );
  addTearDown(fast.dispose);
  for (final frame in frames) {
    final progress = frame / ((json['op'] as num) - (json['ip'] as num));
    final actual = await render(
      (c) => fast.draw(
        c,
        destination,
        progress,
        fit: fit,
        alignment: alignment,
        useFrameRate: false,
      ),
    );
    reference.setProgress(frame / reference.composition.durationFrames);
    final expected = await render(
      (c) => reference.draw(c, destination, fit: fit, alignment: alignment),
    );
    var error = 0, bad = 0;
    for (var i = 0; i < actual.length; i++) {
      final delta = (actual[i] - expected[i]).abs();
      error += delta;
      if (delta > 12) bad++;
    }
    final mae = error / actual.length;
    final badFraction = bad / actual.length;
    // Arc/cubic representation and integer alpha rounding differ at AA edges.
    expect(
      mae,
      lessThan(.65),
      reason: 'MAE at frame $frame: $mae; bad=$badFraction',
    );
    expect(
      badFraction,
      lessThan(.006),
      reason: 'Large pixel differences at frame $frame',
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  for (final name in ['static', 'icon', 'features', 'many_shapes', 'morph']) {
    test('matches lottie: $name, including backwards seeks', () async {
      await compare(fixture(name), [0, 1, 15, 29.5, 45, 59, 12, 0]);
    });
  }
  for (final name in [
    'gears',
    'tile_grid_loading_animation',
    'movie_loading',
    'glow_loading',
    'loading_animation',
  ]) {
    test('real rlottie resource: $name', () async {
      final json = jsonDecode(
        File('rlottie-master/example/resource/$name.json').readAsStringSync(),
      ) as Map<String, dynamic>;
      final span = (json['op'] as num) - (json['ip'] as num);
      await compare(json, [
        0,
        span * .25,
        span * .5,
        span * .75,
        span - 1,
        span * .1,
      ]);
    });
  }
  test(
    'SIMD morph matches lottie',
    () async => compare(fixture('morph'), [.1, 15.5, 40, 1], simd: true),
  );
  test('RGB byte encoding matches baseline', () async {
    final json = fixture('static');
    json['layers'][0]['shapes'][0]['it'][1]['c'] = {
      'a': 0,
      'k': [128, 64, 8, 255],
    };
    await compare(json, [0]);
  });
  test(
    'last animated segment uses composition end when terminal key is omitted',
    () async {
      final json = fixture('icon');
      json['layers'][0]['shapes'][0]['it'].last['r']['k'].removeLast();
      await compare(json, [0, 15, 30, 59, 1]);
    },
  );
  test(
    'hold, eased transform, animated color/opacity and split position',
    () async {
      final json = fixture('icon');
      final t = json['layers'][0]['shapes'][0]['it'].last;
      t['p'] = {
        's': true,
        'x': {
          'a': 1,
          'k': [
            {
              't': 0,
              's': [90],
              'h': 1,
            },
            {
              't': 30,
              's': [160],
            },
          ],
        },
        'y': {'a': 0, 'k': 128},
      };
      t['o'] = {'a': 0, 'k': 60};
      json['layers'][0]['ks']['o'] = {'a': 0, 'k': 80};
      final fill = json['layers'][0]['shapes'][0]['it'][1];
      fill['c'] = {
        'a': 1,
        'k': [
          {
            't': 0,
            's': [1, 0, 0],
            'e': [0, 0, 1],
            'o': {
              'x': [.42],
              'y': [0],
            },
            'i': {
              'x': [.58],
              'y': [1],
            },
          },
          {
            't': 60,
            's': [0, 0, 1],
          },
        ],
      };
      await compare(json, [0, 15, 29, 30, 45, 59]);
    },
  );
  test('nonzero in point and layer visibility', () async {
    final json = fixture('icon');
    json['ip'] = 10;
    json['op'] = 50;
    json['layers'][0]['ip'] = 15;
    json['layers'][0]['op'] = 40;
    await compare(json, [0, 4, 5, 20, 29, 30, 39]);
  });
  for (final fit in [BoxFit.contain, BoxFit.cover, BoxFit.none]) {
    test(
      'sizing and clipping: $fit',
      () async => compare(
        fixture('features'),
        [0],
        fit: fit,
        alignment: Alignment.topRight,
        destination: const Rect.fromLTWH(20, 30, 200, 120),
      ),
    );
  }
  test('LRU bounds, replay, separate players and disposal', () async {
    final composition = FastLottieComposition.fromJson(fixture('icon'));
    final player = FastLottiePlayer(
      composition,
      cache: const FastLottieCache(maximumFrames: 2),
    );
    final other = FastLottiePlayer(composition, cache: FastLottieCache.none);
    for (final p in [0.0, .25, 0.0, .5]) {
      final a = await render(
        (c) => player.draw(c, const Rect.fromLTWH(0, 0, 256, 256), p),
      );
      final b = await render(
        (c) => other.draw(c, const Rect.fromLTWH(0, 0, 256, 256), p),
      );
      expect(a, b);
    }
    expect(player.cachedFrames, 2);
    expect(player.cacheHits, 1);
    expect(player.cacheMisses, 3);
    player.clearCache();
    expect(player.cachedFrames, 0);
    player.dispose();
    player.dispose();
    other.dispose();
    expect(
      () => player.draw(Canvas(ui.PictureRecorder()), Rect.zero, 0),
      throwsStateError,
    );
  });
  test(
    'static composition reuses one frame and command budget disables caching',
    () async {
      final composition = FastLottieComposition.fromJson(fixture('static'));
      final a = FastLottiePlayer(composition);
      final b = FastLottiePlayer(
        composition,
        cache: const FastLottieCache(maximumCommands: 1),
      );
      for (final p in [0.0, .5, 1.0]) {
        await render((c) {
          a.draw(c, const Rect.fromLTWH(0, 0, 256, 256), p);
          b.draw(c, const Rect.fromLTWH(0, 0, 256, 256), p);
        });
      }
      expect(a.cachedFrames, 1);
      expect(a.cacheHits, 2);
      expect(b.cachedFrames, 0);
      a.dispose();
      b.dispose();
    },
  );
  test('rejects unsupported operations with JSON paths', () {
    final changes = <void Function(Map<String, dynamic>)>[
      (j) => j['layers'][0]['shapes'].add({'ty': 'mm'}),
      (j) => j['layers'][0]['ddd'] = 1,
      (j) => j['layers'][0]['tt'] = 1,
      (j) => j['layers'][0]['ty'] = 0,
      (j) => j['layers'][0]['ef'] = [{}],
      (j) => j['layers'][0]['shapes'][0]['it'][1]['ty'] = 'gf',
      (j) => j['layers'][0]['ks']['p'] = {
        'a': 1,
        'k': [
          {
            't': 0,
            's': [0, 0],
            'to': [10, 0],
          },
          {
            't': 20,
            's': [100, 100],
          },
        ],
      },
      (j) => j['layers'][0]['parent'] = 1,
      (j) => j['layers'][0]['shapes'][0]['it'][2]['d'] = [{}],
    ];
    for (final change in changes) {
      final j = fixture('icon');
      change(j);
      expect(
        () => FastLottieComposition.fromJson(j),
        throwsA(
          isA<UnsupportedLottieException>().having(
            (e) => e.jsonPath,
            'path',
            startsWith(r'$'),
          ),
        ),
      );
    }
  });
  test(
    'raster cache matches vectors, enforces budget and cancels safely',
    () async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      final player = FastLottiePlayer(composition);
      final vector = FastLottiePlayer(composition, cache: FastLottieCache.none);
      await player.prepareRaster(
        width: 64,
        height: 64,
        maximumBytes: 60 * 64 * 64 * 4,
      );
      expect(player.rasterBytes, 60 * 64 * 64 * 4);
      for (final progress in [0.0, .25, .75, 1.0]) {
        final actual = await render(
          (c) => player.draw(c, const Rect.fromLTWH(0, 0, 64, 64), progress),
          size: 64,
        );
        final expected = await render(
          (c) => vector.draw(c, const Rect.fromLTWH(0, 0, 64, 64), progress),
          size: 64,
        );
        expect(actual, expected);
      }
      await expectLater(
        player.prepareRaster(width: 64, height: 64, maximumBytes: 1),
        throwsArgumentError,
      );
      expect(player.rasterBytes, 60 * 64 * 64 * 4);
      player.clearCache();
      expect(player.rasterBytes, 0);
      final pending = player.prepareRaster(width: 64, height: 64);
      player.dispose();
      await expectLater(pending, throwsStateError);
      vector.dispose();
    },
  );
  test(
    'raster cache renders at the physical resolution for each DPR',
    () async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      final player = FastLottiePlayer(composition);
      final vector = FastLottiePlayer(composition, cache: FastLottieCache.none);
      addTearDown(player.dispose);
      addTearDown(vector.dispose);
      for (final dpr in [1.5, 2.0, 3.0]) {
        final pixels = (64 * dpr).ceil();
        await player.prepareRaster(
          width: 64,
          height: 64,
          devicePixelRatio: dpr,
        );
        expect(player.rasterSize, Size(pixels.toDouble(), pixels.toDouble()));
        expect(player.rasterBytes, 60 * pixels * pixels * 4);
        for (final progress in [0.0, .25, .75]) {
          final actual = await render((c) {
            c.scale(dpr);
            player.draw(c, const Rect.fromLTWH(0, 0, 64, 64), progress);
          }, size: pixels);
          final expected = await render((c) {
            c.scale(dpr);
            vector.draw(c, const Rect.fromLTWH(0, 0, 64, 64), progress);
          }, size: pixels);
          expect(actual, expected, reason: 'DPR $dpr, progress $progress');
        }
      }
    },
  );
  test(
    'fractional raster extents preserve geometry and account for padding',
    () async {
      final composition = FastLottieComposition.fromJson(fixture('icon'));
      final player = FastLottiePlayer(composition);
      final vector = FastLottiePlayer(composition, cache: FastLottieCache.none);
      addTearDown(player.dispose);
      addTearDown(vector.dispose);
      await player.prepareRaster(
        width: 63.5,
        height: 63.5,
        devicePixelRatio: 1.25,
      );
      expect(player.rasterSize, const Size(80, 80));
      expect(player.rasterBytes, 60 * 80 * 80 * 4);
      final actual = await render((c) {
        c.scale(1.25);
        player.draw(c, const Rect.fromLTWH(0, 0, 63.5, 63.5), .25);
      }, size: 80);
      final expected = await render((c) {
        c.scale(1.25);
        vector.draw(c, const Rect.fromLTWH(0, 0, 63.5, 63.5), .25);
      }, size: 80);
      expect(actual, expected);
    },
  );
  test(
    'DPR memory budget and invalid input leave the existing cache intact',
    () async {
      final player = FastLottiePlayer(
        FastLottieComposition.fromJson(fixture('icon')),
      );
      addTearDown(player.dispose);
      const bytesAtDpr1 = 60 * 64 * 64 * 4;
      await player.prepareRaster(width: 64, height: 64);
      await expectLater(
        player.prepareRaster(
          width: 64,
          height: 64,
          devicePixelRatio: 2,
          maximumBytes: bytesAtDpr1,
        ),
        throwsArgumentError,
      );
      for (final dpr in [0.0, -1.0, double.nan, double.infinity]) {
        await expectLater(
          player.prepareRaster(width: 64, height: 64, devicePixelRatio: dpr),
          throwsArgumentError,
        );
      }
      for (final width in [0.0, -1.0, double.nan, double.infinity]) {
        await expectLater(
          player.prepareRaster(width: width, height: 64),
          throwsArgumentError,
        );
      }
      expect(player.rasterBytes, bytesAtDpr1);
      expect(player.rasterSize, const Size(64, 64));
      player.clearCache();
      expect(player.rasterSize, isNull);
    },
  );
  test('nonuniform fill and stroke scaling match baseline', () async {
    final json = fixture('static');
    json['layers'][0]['shapes'][0]['it'].removeWhere(
      (dynamic it) => it['ty'] == 'st',
    );
    json['layers'][0]['ks']['s'] = {
      'a': 0,
      'k': [80, 60],
    };
    await compare(
      json,
      [0],
      fit: BoxFit.fill,
      destination: const Rect.fromLTWH(0, 0, 200, 120),
    );
    final stroked = fixture('icon');
    stroked['layers'][0]['ks']['s'] = {
      'a': 0,
      'k': [80, 60],
    };
    await compare(
      stroked,
      [0, 15, 40],
      fit: BoxFit.fill,
      destination: const Rect.fromLTWH(0, 0, 200, 120),
    );
  });
  testWidgets('autoplay, external controller, reduced motion and replacement', (
    tester,
  ) async {
    final a = FastLottieComposition.fromJson(fixture('icon'));
    final b = FastLottieComposition.fromJson(fixture('static'));
    expect(b.isStatic, isTrue);
    expect(a.isStatic, isFalse);
    await tester.pumpWidget(FastLottie(composition: b));
    await tester.pump(const Duration(milliseconds: 500));
    expect(tester.hasRunningAnimations, isFalse);
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: FastLottie(composition: a),
      ),
    );
    await tester.pump(const Duration(milliseconds: 40));
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(disableAnimations: true),
        child: FastLottie(composition: b),
      ),
    );
    await tester.pump(const Duration(seconds: 3));
    expect(tester.hasRunningAnimations, isFalse);
    final controller = AnimationController(vsync: tester, duration: a.duration);
    await tester.pumpWidget(FastLottie(composition: a, controller: controller));
    controller.value = .5;
    await tester.pump();
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    controller.dispose();
  });

  test('FastLottieCache.unbounded retains more than default 120 frames without eviction', () async {
    final json = fixture('icon')..['op'] = 180;
    final comp = FastLottieComposition.fromJson(json);
    final player = FastLottiePlayer(comp, cache: FastLottieCache.unbounded);
    addTearDown(player.dispose);

    final total = comp.frameCount;
    expect(total, 180);
    for (var i = 0; i < total; i++) {
      await render(
        (c) => player.draw(c, const Rect.fromLTWH(0, 0, 64, 64), i / total),
        size: 64,
      );
    }
    expect(player.cachedFrames, total);
    expect(player.cacheMisses, total);
    // Replaying frames hits retained display lists without re-recording.
    await render(
      (c) => player.draw(c, const Rect.fromLTWH(0, 0, 64, 64), 0),
      size: 64,
    );
    expect(player.cacheHits, 1);
  });

  testWidgets(
    'FastLottie preserves and cleanly detaches repaint listeners across config and controller swaps',
    (tester) async {
      final a = FastLottieComposition.fromJson(fixture('icon'));
      final b = FastLottieComposition.fromJson(fixture('morph'));
      final c1 = AnimationController(vsync: tester, duration: a.duration);
      final c2 = AnimationController(vsync: tester, duration: b.duration);

      Widget host({
        required FastLottieComposition comp,
        Animation<double>? controller,
        bool usePipeline = false,
        bool reducedMotion = false,
        bool useFrameRate = true,
      }) => MediaQuery(
        data: MediaQueryData(disableAnimations: reducedMotion),
        child: Directionality(
          textDirection: TextDirection.ltr,
          child: FastLottie(
            composition: comp,
            controller: controller,
            usePipeline: usePipeline,
            useFrameRate: useFrameRate,
            cache: FastLottieCache.unbounded,
          ),
        ),
      );

      // Build with external controller + direct vector mode.
      await tester.pumpWidget(host(comp: a, controller: c1));
      c1.value = 0.25;
      await tester.pump();
      expect(tester.takeException(), isNull);

      // Swap composition, controller, useFrameRate, and toggle pipeline.
      await tester.pumpWidget(
        host(comp: b, controller: c2, useFrameRate: false, usePipeline: true),
      );
      c2.value = 0.4;
      await tester.pump();
      // Mutating detached old controller c1 must not fail or require mount.
      c1.value = 0.75;
      await tester.pump();
      expect(tester.takeException(), isNull);

      // Switch to internal controller + reduced motion toggle.
      await tester.pumpWidget(
        host(comp: b, controller: null, reducedMotion: true, usePipeline: false),
      );
      await tester.pump(const Duration(milliseconds: 50));
      expect(tester.hasRunningAnimations, isFalse);
      await tester.pumpWidget(
        host(comp: b, controller: null, reducedMotion: false, usePipeline: false),
      );
      expect(tester.hasRunningAnimations, isTrue);
      await tester.pump(const Duration(milliseconds: 50));

      // Unmount and pump old controllers to verify no dangling listener assertions.
      await tester.pumpWidget(const SizedBox());
      expect(tester.hasRunningAnimations, isFalse);
      c1.value = 0.1;
      c2.value = 0.9;
      await tester.pump();
      expect(tester.takeException(), isNull);
      c1.dispose();
      c2.dispose();
    },
  );
}
