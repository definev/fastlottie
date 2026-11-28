import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/platform/simd_wasm.dart';
import 'package:fastlottie/src/raster/raster_geometry.dart';
import 'package:fastlottie/src/scene/lottie_json_reader.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture, render;
import 'path_ops_test.dart'
    show animated, constant, fill, matteScene, rectangle, scene;

Map<String, dynamic> _docWithLayers(
  List<Map<String, dynamic>> layers, {
  List<Map<String, dynamic>> assets = const [],
  double op = 60,
  double fr = 60,
}) => {
  'v': '5.7.0',
  'fr': fr,
  'ip': 0,
  'op': op,
  'w': 256,
  'h': 256,
  'assets': assets,
  'layers': layers,
};

Map<String, dynamic> _shapeLayer(
  int ind,
  List<Map<String, dynamic>> shapes, {
  Map<String, dynamic>? ks,
  int tt = 0,
  int td = 0,
  int bm = 0,
  List<Map<String, dynamic>>? sy,
}) => {
  'ty': 4,
  'ind': ind,
  if (tt != 0) 'tt': tt,
  if (td != 0) 'td': td,
  if (bm != 0) 'bm': bm,
  'ip': 0,
  'op': 60,
  'st': 0,
  'ks':
      ks ??
      {
        'a': constant([0, 0]),
        'p': constant([0, 0]),
        's': constant([100, 100]),
        'r': constant(0),
        'o': constant(100),
      },
  'shapes': shapes,
  'sy': ?sy,
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('P0.1 prefix-free contentKey', () {
    test('distinguishes group draw tree boundaries', () {
      final subTransform = {
        'ty': 'tr',
        'a': constant([0, 0]),
        'p': constant([50, 0]),
        's': constant([100, 100]),
        'r': constant(0),
        'o': constant(100),
      };
      final style1 = <Map<String, dynamic>>[
        rectangle(64, 64, 40, 40),
        fill([1, 0, 0]),
      ];
      final style2 = <Map<String, dynamic>>[
        rectangle(128, 128, 40, 40),
        fill([0, 0, 1]),
      ];
      // Tree A: Root([Group(T, [Style1]), Style2])
      final docA = scene([
        {
          'ty': 'gr',
          'it': [...style1, subTransform],
        },
        ...style2,
      ]);
      // Tree B: Root([Group(T, [Style1, Style2])])
      final docB = scene([
        {
          'ty': 'gr',
          'it': [...style1, ...style2, subTransform],
        },
      ]);
      final keyA = FastLottieComposition.fromJson(docA).contentKey;
      final keyB = FastLottieComposition.fromJson(docB).contentKey;
      expect(keyA, isNot(keyB));
    });

    test(
      'distinguishes optional transform fields (split position vs skew)',
      () {
        final docSplitPos = _docWithLayers([
          _shapeLayer(
            1,
            [
              rectangle(64, 64, 40, 40),
              fill([1, 0, 0]),
            ],
            ks: {
              'a': constant([0, 0]),
              'p': {'s': true, 'x': constant(25), 'y': constant(10)},
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          ),
        ]);
        final docSkew = _docWithLayers([
          _shapeLayer(
            1,
            [
              rectangle(64, 64, 40, 40),
              fill([1, 0, 0]),
            ],
            ks: {
              'a': constant([0, 0]),
              'p': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
              'sk': constant(25),
              'sa': constant(10),
            },
          ),
        ]);
        expect(
          FastLottieComposition.fromJson(docSplitPos).contentKey,
          isNot(FastLottieComposition.fromJson(docSkew).contentKey),
        );
      },
    );

    test('distinguishes constant track vs single-keyframe animated track', () {
      final docConst = scene([
        rectangle(100, 100, 80, 80),
        {
          'ty': 'fl',
          'c': constant([1, 0, 0]),
          'o': constant(50),
          'r': 1,
        },
      ]);
      final docKeyed = scene([
        rectangle(100, 100, 80, 80),
        {
          'ty': 'fl',
          'c': constant([1, 0, 0]),
          'o': animated(50, 50),
          'r': 1,
        },
      ]);
      expect(
        FastLottieComposition.fromJson(docConst).contentKey,
        isNot(FastLottieComposition.fromJson(docKeyed).contentKey),
      );
    });
  });

  group('P0.2 premultiplied Luma Matte & positive-offset Inner Shadow', () {
    test('luma matte preserves circle anti-aliasing and matte opacity on Dart, C, and Canvas', () async {
      for (final tt in [3, 4]) {
        final doc = _docWithLayers([
          _shapeLayer(
            1,
            [
              {
                'ty': 'el',
                'p': constant([128, 128]),
                's': constant([120, 120]),
              },
              fill([1, 1, 1]),
            ],
            td: 1,
            ks: {
              'a': constant([0, 0]),
              'p': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(50),
            },
          ),
          _shapeLayer(2, [
            rectangle(128, 128, 220, 220),
            fill([0.2, 0.6, 0.9]),
          ], tt: tt),
        ]);
        final comp = FastLottieComposition.fromJson(doc);
        final native = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: true,
        );
        final dart = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: false,
        );
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(() {
          native.dispose();
          dart.dispose();
          player.dispose();
        });

        final nativePx = native.renderFrame(0);
        final dartPx = dart.renderFrame(0);
        expect(nativePx, orderedEquals(dartPx), reason: 'tt=$tt C vs Dart');

        final canvasRgba = await render(
          (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
        );

        // Center pixel inside 50%-opacity white circle matte -> ~50% alpha (~128).
        final centerIdx = 128 * 256 + 128;
        final centerAlpha = dartPx[centerIdx] >>> 24;
        expect(centerAlpha, closeTo(128, 2), reason: 'tt=$tt center alpha');
        expect(
          canvasRgba[centerIdx * 4 + 3],
          closeTo(centerAlpha, 2),
          reason: 'tt=$tt Canvas center alpha',
        );

        // Scan across the circle perimeter (y=100, x=60..110) and confirm smooth
        // anti-aliased intermediate alpha values exist between interior and outside.
        var intermediateCount = 0;
        for (var x = 60; x < 110; x++) {
          final a = dartPx[100 * 256 + x] >>> 24;
          if (tt == 3) {
            if (a > 10 && a < 115) intermediateCount++;
          } else {
            if (a > 140 && a < 245) intermediateCount++;
          }
        }
        expect(
          intermediateCount,
          greaterThan(0),
          reason: 'tt=$tt must preserve smooth AA on curved luma matte edge',
        );
      }
    });

    test('inner shadow with positive and negative offsets matches across C, Dart, and Canvas', () async {
      for (final angle in [0, 45, 135, 225, 315]) {
        final doc = _docWithLayers([
          _shapeLayer(
            1,
            [
              rectangle(128, 128, 120, 120),
              fill([1, 1, 1]),
            ],
            sy: [
              {
                'ty': 2,
                'c': constant([0, 0, 0, 1]),
                'a': constant(angle),
                'd': constant(12),
                'bm': constant(1),
              },
            ],
          ),
        ]);
        final comp = FastLottieComposition.fromJson(doc);
        final native = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: true,
        );
        final dart = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: false,
        );
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(() {
          native.dispose();
          dart.dispose();
          player.dispose();
        });

        final nativePx = native.renderFrame(0);
        final dartPx = dart.renderFrame(0);
        expect(nativePx, orderedEquals(dartPx), reason: 'angle=$angle');

        final canvas = await render(
          (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
        );
        // Center of 120x120 box (distance 12) must remain bright white (unshadowed).
        final center = 128 * 256 + 128;
        expect(dartPx[center] & 0xFF, 255, reason: 'angle=$angle center');
        expect(canvas[center * 4], 255, reason: 'angle=$angle canvas center');
      }
    });
  });

  group('P0.3 DoS, NaN, dimension, and FFI bounds hardening', () {
    test('rejects deeply nested JSON without StackOverflowError', () {
      const depth = 300;
      final deepArray = utf8.encode('${'[' * depth}0${']' * depth}');
      expect(
        () => parseLottieJsonBytes(Uint8List.fromList(deepArray)),
        throwsFormatException,
      );

      final deepObj = utf8.encode('${'{"a":' * depth}0${'}' * depth}');
      expect(
        () => parseLottieJsonBytes(Uint8List.fromList(deepObj)),
        throwsFormatException,
      );

      // FastLottieComposition.fromJson deep copy also guards recursion depth.
      Map<String, dynamic> nested = {'leaf': 1};
      for (var i = 0; i < 300; i++) {
        nested = {'a': nested};
      }
      expect(
        () => FastLottieComposition.fromJson(nested),
        throwsFormatException,
      );
    });

    test('rejects deeply nested shape groups', () {
      Map<String, dynamic> group = {
        'ty': 'gr',
        'it': [
          rectangle(64, 64, 20, 20),
          fill([1, 0, 0]),
        ],
      };
      for (var i = 0; i < 66; i++) {
        group = {
          'ty': 'gr',
          'it': [group],
        };
      }
      expect(
        () => FastLottieComposition.fromJson(scene([group])),
        throwsA(isA<UnsupportedLottieException>()),
      );
    });

    test('rejects excessive frameSpan and extreme fps values', () {
      expect(
        () => FastLottieComposition.fromJson(
          _docWithLayers([
            _shapeLayer(1, [
              rectangle(64, 64, 20, 20),
              fill([1, 0, 0]),
            ]),
          ], op: 1000000),
        ),
        throwsA(isA<UnsupportedLottieException>()),
      );
      expect(
        () => FastLottieComposition.fromJson(
          _docWithLayers([
            _shapeLayer(1, [
              rectangle(64, 64, 20, 20),
              fill([1, 0, 0]),
            ]),
          ], fr: 1e-6),
        ),
        throwsA(isA<UnsupportedLottieException>()),
      );
    });

    test('fails fast on exponential diamond precomp DAG without OOM', () {
      const levels = 25;
      final assets = <Map<String, dynamic>>[];
      for (var i = 0; i < levels; i++) {
        if (i == levels - 1) {
          assets.add({
            'id': 'p$i',
            'layers': [
              _shapeLayer(1, [
                rectangle(32, 32, 16, 16),
                fill([1, 0, 0]),
              ]),
            ],
          });
        } else {
          assets.add({
            'id': 'p$i',
            'layers': [
              {
                'ty': 0,
                'ind': 1,
                'refId': 'p${i + 1}',
                'w': 256,
                'h': 256,
                'ip': 0,
                'op': 60,
                'st': 0,
                'ks': {},
              },
              {
                'ty': 0,
                'ind': 2,
                'refId': 'p${i + 1}',
                'w': 256,
                'h': 256,
                'ip': 0,
                'op': 60,
                'st': 0,
                'ks': {},
              },
            ],
          });
        }
      }
      final doc = _docWithLayers([
        {
          'ty': 0,
          'ind': 1,
          'refId': 'p0',
          'w': 256,
          'h': 256,
          'ip': 0,
          'op': 60,
          'st': 0,
          'ks': {},
        },
      ], assets: assets);
      final sw = Stopwatch()..start();
      expect(
        () => FastLottieComposition.fromJson(doc),
        throwsA(isA<UnsupportedLottieException>()),
      );
      expect(sw.elapsedMilliseconds, lessThan(2000));
    });

    test(
      'BitstreamStore.hasAllFrames returns false in O(1) for huge totalFrames',
      () {
        final store = BitstreamStore();
        final frame = Uint8List(4 * 4 * 4);
        store.storeFrame(
          entryKey: 'huge_entry',
          width: 4,
          height: 4,
          totalFrames: 2000000000,
          poster: false,
          frameIndex: 0,
          srcBgra: frame,
          scratch: Lz4Scratch(),
        );
        final sw = Stopwatch()..start();
        expect(store.hasAllFrames('huge_entry', 2000000000), isFalse);
        expect(sw.elapsedMilliseconds, lessThan(100));
        store.closeOpenFiles();
      },
    );

    test(
      'rejects dimensions > 65535 or negative in FastLottieSoftwareSession',
      () {
        final comp = FastLottieComposition.fromJson(fixture('static'));
        expect(
          () => FastLottieSoftwareSession(
            comp,
            pixelWidth: 65536,
            pixelHeight: 16,
          ),
          throwsArgumentError,
        );
        expect(
          () => FastLottieSoftwareSession(
            comp,
            pixelWidth: 16,
            pixelHeight: 70000,
          ),
          throwsArgumentError,
        );
        expect(
          () =>
              FastLottieSoftwareSession(comp, pixelWidth: -1, pixelHeight: 16),
          throwsArgumentError,
        );
      },
    );

    test('PolyPath.addCubic handles NaN/Inf without 1024-leaf explosion', () {
      final path = PolyPath();
      path.beginContour(false);
      path.addCubic(
        0,
        0,
        double.nan,
        10,
        20,
        double.infinity,
        double.nan,
        double.nan,
        0.01,
      );
      path.endContour();
      expect(path.vertexCount, 0);
    });

    test('FFI native entrypoints reject out-of-bounds lengths safely', () {
      final dst = NativePixelBuffer(16);
      final spans = NativeSpansBuffer(2);
      final lut = NativePixelBuffer(4);
      final cov = NativeCoverageWorkspace.tryCreate();
      addTearDown(() {
        dst.dispose();
        spans.dispose();
        lut.dispose();
        cov?.dispose();
      });

      expect(() => simdClearPixels(dst, 32), throwsRangeError);
      expect(simdFillSolidSpans(dst, 0, 0, 4, spans, 100, 0xFFFFFFFF), isFalse);
      expect(
        nativeBlendSolid(dst, 0, 0, 4, spans, 100, 0xFFFFFFFF, 1),
        isFalse,
      );
      expect(
        nativeGradientSpans(
          dst,
          0,
          0,
          4,
          spans,
          1,
          lut,
          255,
          0,
          false,
          1,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          10,
          0,
        ),
        isFalse,
      );
      if (cov != null) {
        final vx = Float64List(2);
        final vy = Float64List(2);
        final s = Int32List.fromList([0]);
        final e = Int32List.fromList([2]);
        expect(cov.raster(vx, vy, s, e, 100, 1, false, 0, 0, 8, 8, spans), -2);
        expect(cov.raster(vx, vy, s, e, 2, 10, false, 0, 0, 8, 8, spans), -2);
        expect(cov.raster(vx, vy, s, e, 2, 1, false, 8, 8, 4, 4, spans), -2);
        expect(
          cov.rasterSolid(
            vx,
            vy,
            s,
            e,
            2,
            1,
            false,
            0,
            0,
            8,
            8,
            spans,
            dst,
            0,
            0,
            4,
            0xFFFFFFFF,
          ),
          -2,
        );
      }

      // Corrupt span coordinates exceeding dst length must be safely ignored in C.
      spans.typedList[0] = (100 << 16) | 100;
      spans.typedList[1] = (50 << 8) | 255;
      simdFillSolidSpans(dst, 0, 0, 4, spans, 1, 0xFFFFFFFF);
      expect(dst.typedList.every((p) => p == 0), isTrue);
    });
  });

  group('P0.4 Flutter disposal queue & widget lifecycle', () {
    testWidgets(
      'disposal queue drains by bytes after paint and flushes on app pause',
      (tester) async {
        final comps = List.generate(4, (i) {
          final json = fixture('static');
          json['layers'][0]['shapes'][0]['it'][0]['p'] = constant([
            10 + i * 5,
            10,
          ]);
          return FastLottieComposition.fromJson(json);
        });
        // maximumBytes = 16 MiB => _disposalByteCap = min(4 MiB, 16 MiB ~/ 8) = 2 MiB.
        final cache = FastLottieRasterCache(
          framesPerStrip: 1,
          maximumBytes: 16 * 1024 * 1024,
          disposalBatchSize: 1,
          workerCount: 1,
        );
        addTearDown(cache.dispose);

        // Populate 4 static 1024x1024 entries (4 MiB each = 16 MiB total).
        final players = <FastLottiePlayer>[];
        for (var i = 0; i < comps.length; i++) {
          final p = FastLottiePlayer(comps[i], rasterCache: cache);
          players.add(p);
          final rec = ui.PictureRecorder();
          final canvas = ui.Canvas(rec);
          p.draw(canvas, const ui.Rect.fromLTWH(0, 0, 1024, 1024), 0);
          rec.endRecording().dispose();
        }
        final deadline = DateTime.now().add(const Duration(seconds: 10));
        while (cache.pendingFrames > 0 && DateTime.now().isBefore(deadline)) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 10)),
          );
          await tester.pump();
        }
        expect(cache.pendingFrames, 0);
        expect(cache.bytes, 16 * 1024 * 1024);

        // Release all players so entries become unpinned.
        for (final p in players) {
          p.dispose();
        }
        // Admit 2 more 1024x1024 compositions (8 MiB) in the same frame to
        // force LRU eviction of 2 large images (8 MiB > 2 MiB disposal cap).
        final extra1 = FastLottieComposition.fromJson(matteScene(1));
        final extra2 = FastLottieComposition.fromJson(matteScene(2));
        final pExtra1 = FastLottiePlayer(extra1, rasterCache: cache);
        final pExtra2 = FastLottiePlayer(extra2, rasterCache: cache);
        addTearDown(() {
          pExtra1.dispose();
          pExtra2.dispose();
        });
        for (final p in [pExtra1, pExtra2]) {
          final rec = ui.PictureRecorder();
          p.draw(ui.Canvas(rec), const ui.Rect.fromLTWH(0, 0, 1024, 1024), 0);
          rec.endRecording().dispose();
        }

        // Retired images are NOT disposed synchronously mid-paint!
        expect(cache.debugPendingDisposals, 2);
        expect(cache.debugDeadBytes, 8 * 1024 * 1024);

        // Pumping 1 post-frame callback drains by byte target (<= 2 MiB cap),
        // even though disposalBatchSize is 1!
        await tester.pump();
        expect(cache.debugDeadBytes, lessThanOrEqualTo(2 * 1024 * 1024));
        expect(cache.debugPendingDisposals, 0);

        // Drain newly requested strips, then verify background pause flushes queued disposals.
        while (cache.pendingFrames > 0 && DateTime.now().isBefore(deadline)) {
          await tester.runAsync(
            () => Future<void>.delayed(const Duration(milliseconds: 10)),
          );
          await tester.pump();
        }
        final extra3 = FastLottieComposition.fromJson(matteScene(3));
        final pExtra3 = FastLottiePlayer(extra3, rasterCache: cache);
        addTearDown(pExtra3.dispose);
        final rec = ui.PictureRecorder();
        pExtra3.draw(
          ui.Canvas(rec),
          const ui.Rect.fromLTWH(0, 0, 1024, 1024),
          0,
        );
        rec.endRecording().dispose();
        expect(cache.debugPendingDisposals, greaterThan(0));

        // Backgrounding the app flushes remaining queued disposals immediately without needing vsync.
        tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
        expect(cache.debugPendingDisposals, 0);
        expect(cache.debugDeadBytes, 0);
      },
    );

    testWidgets(
      'FastLottie widget does not throw LateInitializationError or leak DefaultRasterCacheScope on invalid params',
      (tester) async {
        final comp = FastLottieComposition.fromJson(fixture('static'));
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);

        await tester.pumpWidget(
          Directionality(
            textDirection: TextDirection.ltr,
            child: FastLottie(
              composition: comp,
              resolutionScale: 2.0, // Invalid: > 1.0 throws in FastLottiePlayer
            ),
          ),
        );
        final err = tester.takeException();
        expect(err, isA<RangeError>());

        // Unmounting must not throw LateInitializationError and must release refcount.
        await tester.pumpWidget(const SizedBox.shrink());
        expect(tester.takeException(), isNull);
        expect(FastLottieRasterCache.debugSharedDefaultCache, isNull);
      },
    );
  });

  group('PR #3 review regressions', () {
    test('luma matte with multiply blend mode (bm: 1) preserves white matte on Canvas and software', () async {
      for (final (tt, opacity, expectedAlpha) in [
        (3, 100, 255),
        (4, 100, 0),
        (3, 50, 128),
      ]) {
        final doc = _docWithLayers([
          _shapeLayer(
            1,
            [
              rectangle(128, 128, 200, 200),
              fill([1, 1, 1]),
            ],
            td: 1,
            bm: 1, // Multiply
            ks: {
              'a': constant([0, 0]),
              'p': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(opacity),
            },
          ),
          _shapeLayer(2, [
            rectangle(128, 128, 200, 200),
            fill([0.2, 0.7, 0.4]),
          ], tt: tt),
        ]);
        final comp = FastLottieComposition.fromJson(doc);
        final native = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: true,
        );
        final dart = FastLottieSoftwareSession(
          comp,
          pixelWidth: 256,
          pixelHeight: 256,
          preferNative: false,
        );
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(() {
          native.dispose();
          dart.dispose();
          player.dispose();
        });

        final nativePx = native.renderFrame(0);
        final dartPx = dart.renderFrame(0);
        expect(nativePx, orderedEquals(dartPx));

        final canvasRgba = await render(
          (c) => player.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
        );
        final center = 128 * 256 + 128;
        expect(
          dartPx[center] >>> 24,
          closeTo(expectedAlpha, 2),
          reason: 'software tt=$tt o=$opacity',
        );
        expect(
          canvasRgba[center * 4 + 3],
          closeTo(expectedAlpha, 2),
          reason: 'Canvas tt=$tt o=$opacity',
        );
      }

      // Precomp luma matte whose internal child layer uses bm: 1 (multiply).
      final precompDoc = _docWithLayers(
        [
          {
            'ty': 0,
            'ind': 1,
            'refId': 'matte_comp',
            'td': 1,
            'w': 256,
            'h': 256,
            'ip': 0,
            'op': 60,
            'st': 0,
            'ks': {
              'a': constant([0, 0]),
              'p': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          },
          _shapeLayer(2, [
            rectangle(128, 128, 200, 200),
            fill([0.9, 0.2, 0.2]),
          ], tt: 3),
        ],
        assets: [
          {
            'id': 'matte_comp',
            'layers': [
              _shapeLayer(1, [
                rectangle(128, 128, 200, 200),
                fill([1, 1, 1]),
              ], bm: 1),
            ],
          },
        ],
      );
      final precomp = FastLottieComposition.fromJson(precompDoc);
      final prePlayer = FastLottiePlayer(precomp, cache: FastLottieCache.none);
      addTearDown(prePlayer.dispose);
      final preCanvas = await render(
        (c) => prePlayer.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
      );
      expect(preCanvas[(128 * 256 + 128) * 4 + 3], 255);
    });

    test('contentKey distinguishes Trim Paths mode 2 when an unstroked sibling path changes length', () async {
      Map<String, dynamic> trimMode2Doc(double secondLineLen, {bool swap = false}) {
        Map<String, dynamic> line(double y, double len) => {
          'ty': 'sh',
          'ks': constant({
            'c': false,
            'v': [
              [20.0, y],
              [20.0 + len, y],
            ],
            'i': [
              [0.0, 0.0],
              [0.0, 0.0],
            ],
            'o': [
              [0.0, 0.0],
              [0.0, 0.0],
            ],
          }),
        };
        final stroke = {
          'ty': 'st',
          'c': constant([1, 0, 0]),
          'o': constant(100),
          'w': constant(12),
          'lc': 1,
          'lj': 1,
        };
        final trim = {
          'ty': 'tm',
          's': constant(0),
          'e': constant(25),
          'o': constant(0),
          'm': 2,
        };
        final shapes = swap
            ? <Map<String, dynamic>>[
                line(120, secondLineLen),
                stroke,
                line(60, 100),
                trim,
              ]
            : <Map<String, dynamic>>[
                line(60, 100),
                stroke,
                line(120, secondLineLen),
                trim,
              ];
        return scene(shapes);
      }

      final compShort = FastLottieComposition.fromJson(trimMode2Doc(100));
      final compLong = FastLottieComposition.fromJson(trimMode2Doc(300));
      final compSwapped = FastLottieComposition.fromJson(
        trimMode2Doc(100, swap: true),
      );

      expect(compShort.contentKey, isNot(compLong.contentKey));
      expect(compShort.contentKey, isNot(compSwapped.contentKey));

      // Confirm rendered pixels genuinely differ between compShort and compLong
      // on both software renderer and Canvas (25% of 200px = 50px vs 25% of 400px = 100px).
      final softShort = FastLottieSoftwareSession(
        compShort,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final softLong = FastLottieSoftwareSession(
        compLong,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final playerShort = FastLottiePlayer(compShort, cache: FastLottieCache.none);
      final playerLong = FastLottiePlayer(compLong, cache: FastLottieCache.none);
      addTearDown(() {
        softShort.dispose();
        softLong.dispose();
        playerShort.dispose();
        playerLong.dispose();
      });
      final shortPx = softShort.renderFrame(0);
      final longPx = softLong.renderFrame(0);
      expect(shortPx.any((p) => p != 0), isTrue);
      expect(shortPx, isNot(orderedEquals(longPx)));
      final shortCanvas = await render(
        (c) => playerShort.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
      );
      final longCanvas = await render(
        (c) => playerLong.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256), 0),
      );
      expect(shortCanvas, isNot(orderedEquals(longCanvas)));
    });

    test('compiler budget accounts for quadratic List.of(sources) reference copies', () {
      // 1,000 shapes + 250 fills = 1,250 items (< 200k), yet 1,000 * 250 = 250,000
      // source references would otherwise be allocated unchecked.
      final shapes = <Map<String, dynamic>>[
        for (var i = 0; i < 1000; i++) rectangle(10, 10, 10, 10),
        for (var i = 0; i < 250; i++) fill([1, 0, 0]),
      ];
      expect(
        () => FastLottieComposition.fromJson(scene(shapes)),
        throwsA(isA<UnsupportedLottieException>()),
      );

      // Same for repeated Trim Paths walking all accumulated shapes.
      final trimBomb = <Map<String, dynamic>>[
        for (var i = 0; i < 500; i++) rectangle(10, 10, 10, 10),
        for (var i = 0; i < 500; i++)
          {
            'ty': 'tm',
            's': constant(0),
            'e': constant(50),
            'o': constant(0),
            'm': 1,
          },
      ];
      expect(
        () => FastLottieComposition.fromJson(scene(trimBomb)),
        throwsA(isA<UnsupportedLottieException>()),
      );
    });
  });
}
