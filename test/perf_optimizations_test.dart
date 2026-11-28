import 'dart:convert';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/scene/lottie_json_reader.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('parseLottieJsonBytes matches jsonDecode across fixtures and escapes', () {
    for (final name in ['static', 'icon', 'features', 'many_shapes', 'morph']) {
      final map = fixture(name);
      final utf8Bytes = Uint8List.fromList(utf8.encode(jsonEncode(map)));
      final fromDom = RasterScene.compile(map, const FastLottieOptions());
      final fromBytes = RasterScene.compileBytes(
        utf8Bytes,
        const FastLottieOptions(),
      );
      expect(fromBytes.contentKey, fromDom.contentKey, reason: name);
      expect(fromBytes.commands, fromDom.commands, reason: name);

      // Verify exact pixel output parity.
      final a = FastLottieSoftwareSession(
        FastLottieComposition.fromJson(map),
        pixelWidth: 96,
        pixelHeight: 96,
      );
      final b = FastLottieSoftwareSession(
        FastLottieComposition.fromBytes(utf8Bytes),
        pixelWidth: 96,
        pixelHeight: 96,
      );
      try {
        expect(b.renderFrame(0), orderedEquals(a.renderFrame(0)), reason: name);
        expect(
          b.renderFrame(29.5),
          orderedEquals(a.renderFrame(29.5)),
          reason: name,
        );
      } finally {
        a.dispose();
        b.dispose();
      }
    }

    // Verify escaped strings, BOM, scientific notation, empty arrays.
    final tricky = Uint8List.fromList([
      0xEF, 0xBB, 0xBF,
      ...utf8.encode(
        '{"nm":"line\\n\\u0041","e":1.5e-2,"neg":-2.5E+1,"empty":[]}',
      ),
    ]);
    final parsed = parseLottieJsonBytes(tricky);
    expect(parsed['nm'], 'line\nA');
    expect(parsed['e'], closeTo(0.015, 1e-9));
    expect(parsed['neg'], -25.0);
    expect(parsed['empty'], isEmpty);
  });

  test('prepareRaster fitBudget scales down gracefully on 3x DPR budgets', () async {
    final comp = FastLottieComposition.fromJson(fixture('many_shapes'));
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    addTearDown(player.dispose);

    // 256pt @ 3x = 768x768x4x60 = ~135 MiB > 16 MiB budget.
    await expectLater(
      player.prepareRaster(
        width: 256,
        height: 256,
        devicePixelRatio: 3,
        maximumBytes: 16 * 1024 * 1024,
      ),
      throwsArgumentError,
    );

    await player.prepareRaster(
      width: 256,
      height: 256,
      devicePixelRatio: 3,
      maximumBytes: 16 * 1024 * 1024,
      fitBudget: true,
    );
    expect(player.rasterBytes, greaterThan(0));
    expect(player.rasterBytes, lessThanOrEqualTo(16 * 1024 * 1024));
  });

  test('FastLottiePictureCache bypasses uncacheable loops instead of thrashing', () {
    final comp = FastLottieComposition.fromJson(fixture('many_shapes'));
    final cache = FastLottiePictureCache(maximumCompositions: 4);
    addTearDown(cache.dispose);

    // Default FastLottieCache has maximumCommands = 100k; many_shapes has 60
    // frames * ~1001 commands, so tight budget below loop total must bypass.
    final player = FastLottiePlayer(
      comp,
      cache: const FastLottieCache(maximumFrames: 10, maximumCommands: 5000),
      pictureCache: cache,
    );
    addTearDown(player.dispose);

    final rec = ui.PictureRecorder();
    player.draw(ui.Canvas(rec), const ui.Rect.fromLTWH(0, 0, 128, 128), 0.2);
    rec.endRecording().dispose();

    // Bypassed recording so cache holds 0 thrashing pictures.
    expect(cache.cachedFrames, 0);
    expect(player.cacheMisses, 1);
  });

  test('BitstreamStore scan-resistant eviction protects short complete loops', () {
    final scratch = Lz4Scratch();
    // 16x16 frame = 1024 bytes raw; structured data compresses to ~50-150 bytes.
    final store = BitstreamStore(maximumRamBytes: 1600);
    addTearDown(store.dispose);

    Uint8List patternFrame(int seed) {
      final b = Uint8List(16 * 16 * 4);
      // Compressible solid bands with a unique per-frame header (~60-90B LZ4).
      for (var y = 0; y < 16; y++) {
        final v = (y == (seed & 15)) ? (seed & 0xFF) : ((y * 17) & 0xFF);
        b.fillRange(y * 64, (y + 1) * 64, v);
      }
      return b;
    }

    // Fill a complete 4-frame short loop (~400-800 bytes total).
    for (var f = 0; f < 4; f++) {
      store.storeFrame(
        entryKey: 'short_loop',
        width: 16,
        height: 16,
        totalFrames: 4,
        poster: false,
        frameIndex: f,
        srcBgra: patternFrame(f + 1),
        scratch: scratch,
      );
    }
    expect(store.hasAllFrames('short_loop', 4), isTrue);

    // Stream an oversized 200-frame clip that cannot fit in 1600 bytes.
    for (var f = 0; f < 24; f++) {
      store.storeFrame(
        entryKey: 'giant_clip',
        width: 16,
        height: 16,
        totalFrames: 200,
        poster: false,
        frameIndex: f,
        srcBgra: patternFrame(100 + f),
        scratch: scratch,
      );
    }

    // Short loop must still be intact despite giant_clip streaming past budget.
    expect(store.hasAllFrames('short_loop', 4), isTrue);
  });

  testWidgets('shared playback clock drives multiple repeating FastLottie widgets cleanly', (
    tester,
  ) async {
    final comp = FastLottieComposition.fromJson(fixture('icon'));
    await tester.pumpWidget(
      Directionality(
        textDirection: TextDirection.ltr,
        child: Row(
          children: List.generate(
            8,
            (_) => FastLottie(
              composition: comp,
              width: 32,
              height: 32,
              usePipeline: false,
              cache: FastLottieCache.none,
            ),
          ),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 50));
    await tester.pump(const Duration(milliseconds: 50));
    // Cleanly stops shared ticker on unmount (no lingering Ticker assertion).
    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pump();
  });

  test('lazy spatial curve sentinel stays valid after cross-isolate transfer', () async {
    final raw = File(
      'test/fixtures/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
    ).readAsBytesSync();
    final scene = RasterScene.compileBytes(
      decodeLottieBytes(raw),
      const FastLottieOptions(),
    );
    // Warm spatial table in the host isolate (populates _noSpatial sentinels).
    final hostWs = RasterWorkspace();
    final hostPx = NativePixelBuffer(64 * 64);
    renderSceneSoftware(scene, scene.start + 5, hostPx, 64, 64, hostWs);
    renderSceneSoftware(scene, scene.start + 30, hostPx, 64, 64, hostWs);
    final hostCopy = Uint32List.fromList(hostPx.typedList);
    hostPx.dispose();
    hostWs.dispose();

    // Send the already-warmed scene to a separate isolate and render again.
    final workerOut = await Isolate.run(() {
      final ws = RasterWorkspace();
      final px = NativePixelBuffer(64 * 64);
      renderSceneSoftware(scene, scene.start + 5, px, 64, 64, ws);
      renderSceneSoftware(scene, scene.start + 30, px, 64, 64, ws);
      final out = Uint32List.fromList(px.typedList);
      px.dispose();
      ws.dispose();
      return out;
    });
    expect(workerOut, hostCopy);
  });
}
