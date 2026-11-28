import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/cache/tile_playback.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/platform/simd_wasm.dart'
    show NativePixelBuffer;
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/raster/raster_geometry.dart';
import 'package:fastlottie/src/raster/scanline_rasterizer.dart';
import 'package:fastlottie/src/raster/swar_blender.dart';
import 'package:fastlottie/src/scene/options.dart';
import 'package:flutter_test/flutter_test.dart';

int _fnv32(Uint32List data) {
  var h = 0x811C9DC5;
  for (var i = 0; i < data.length; i++) {
    h = ((h ^ data[i]) * 0x01000193) & 0xFFFFFFFF;
  }
  return h;
}

PolyPath _rectPoly(double x0, double y0, double x1, double y1) {
  final p = PolyPath();
  p.beginContour(true);
  p.addVertex(x0, y0);
  p.addVertex(x1, y0);
  p.addVertex(x1, y1);
  p.addVertex(x0, y1);
  p.endContour();
  return p;
}

void main() {
  group('PR #6 Web/Wasm correctness & parity', () {
    test('SwarBlender.blendRunPacked64 matches scalar blendSrcOver bit-for-bit', () {
      final alphas = <int>[1, 2, 17, 63, 127, 128, 191, 253, 254];
      final dstSeeds = <int>[
        0x00000000,
        0x01010001,
        0x40201030,
        0x7F7F3F1F,
        0x80408020,
        0xC0906030,
        0xFF000000,
        0xFFFFFFFF,
        0xFF123456,
        0xFEFE7F01,
      ];
      for (final sa in alphas) {
        final src = SwarBlender.premulBgra(sa, 211, 137, 59);
        final ia = 255 - (src >>> 24);
        for (final start in const [0, 1, 2, 3]) {
          for (final len in const [1, 2, 3, 4, 5, 7, 8, 15, 16, 33]) {
            final actual = Uint32List(start + len + 4);
            final expected = Uint32List(start + len + 4);
            for (var i = 0; i < actual.length; i++) {
              final px = dstSeeds[(i * 7 + sa) % dstSeeds.length];
              actual[i] = px;
              expected[i] = px;
            }
            SwarBlender.blendRunPacked64(actual, start, start + len, src, ia);
            for (var p = start; p < start + len; p++) {
              expected[p] = SwarBlender.blendSrcOver(src, expected[p]);
            }
            expect(
              actual,
              orderedEquals(expected),
              reason: 'sa=$sa start=$start len=$len',
            );
          }
        }
      }
    });

    test('FtScanlineRasterizer._prepareDense dirty-slice clear leaves no stale bits', () {
      final reuse = FtScanlineRasterizer(256);
      final cases = <(PolyPath, int, int, int, int, int)>[
        (_rectPoly(10, 10, 240, 240), 0, 0, 256, 256, 0xFF224466),
        (PolyPath(), 0, 0, 256, 256, 0xFF112233),
        (_rectPoly(110, 110, 130, 130), 100, 100, 140, 140, 0x80AA5522),
        (_rectPoly(2, 2, 18, 250), 0, 0, 256, 256, 0xCC3399CC),
        (_rectPoly(200, 200, 254, 254), 192, 192, 256, 256, 0xFF00FF88),
        (_rectPoly(40, 50, 210, 190), 0, 0, 256, 256, 0x99EE7733),
      ];

      for (var i = 0; i < cases.length; i++) {
        final (poly, x0, y0, x1, y1, color) = cases[i];
        final actual = Uint32List(256 * 256);
        final expected = Uint32List(256 * 256);
        final fresh = FtScanlineRasterizer(256);
        final okA = reuse.rasterizePolyPathSolid(
          poly,
          false,
          x0,
          y0,
          x1,
          y1,
          actual,
          0,
          0,
          256,
          color,
        );
        final okB = fresh.rasterizePolyPathSolid(
          poly,
          false,
          x0,
          y0,
          x1,
          y1,
          expected,
          0,
          0,
          256,
          color,
        );
        expect(okA, okB, reason: 'case $i');
        expect(actual, orderedEquals(expected), reason: 'case $i pixels');

        final spansA = RleSpans();
        final spansB = RleSpans();
        reuse.rasterizePolyPath(poly, false, spansA, x0, y0, x1, y1);
        fresh.rasterizePolyPath(poly, false, spansB, x0, y0, x1, y1);
        expect(spansA.spanCount, spansB.spanCount, reason: 'case $i spans');
        expect(
          spansA.data.sublist(0, spansA.spanCount * 2),
          orderedEquals(spansB.data.sublist(0, spansB.spanCount * 2)),
          reason: 'case $i span words',
        );
        spansA.dispose();
        spansB.dispose();
      }

      // Simulate an aborted dense draw (RangeError on undersized dst) followed
      // by a sparse draw (> 262,144 cells) that overwrites _dirtyMinY/_dirtyMaxY,
      // then another dense draw: _prepareDense must clear stale dense bits cleanly.
      final tinyDst = Uint32List(4);
      expect(
        () => reuse.rasterizePolyPathSolid(
          _rectPoly(10, 10, 240, 240),
          false,
          0,
          0,
          256,
          256,
          tinyDst,
          0,
          0,
          256,
          0xFF112233,
        ),
        throwsRangeError,
      );
      final sparseSpans = RleSpans();
      reuse.rasterizePolyPath(
        _rectPoly(5, 5, 20, 20),
        false,
        sparseSpans,
        0,
        0,
        600,
        600, // 360,000 cells > _maxDenseCells -> forces sparse path
      );
      sparseSpans.dispose();

      final recovered = Uint32List(256 * 256);
      final freshDst = Uint32List(256 * 256);
      final fresh = FtScanlineRasterizer(256);
      reuse.rasterizePolyPathSolid(
        _rectPoly(180, 180, 210, 210),
        false,
        0,
        0,
        256,
        256,
        recovered,
        0,
        0,
        256,
        0xFF4488CC,
      );
      fresh.rasterizePolyPathSolid(
        _rectPoly(180, 180, 210, 210),
        false,
        0,
        0,
        256,
        256,
        freshDst,
        0,
        0,
        256,
        0xFF4488CC,
      );
      expect(recovered, orderedEquals(freshDst));
    });

    test('In-place MergePaths edge sorting is deterministic across 40+ overlapping rects', () {
      // Builds a stroked MergePaths (Union) with 24 overlapping rects (96 edges),
      // exercising introsort recursion + insertion sort + tie-breaking on equal ax.
      final shapes = <Map<String, dynamic>>[];
      for (var i = 0; i < 24; i++) {
        final col = i % 4;
        final row = i ~/ 4;
        shapes.add({
          'ty': 'rc',
          'p': {'a': 0, 'k': [40.0 + col * 18.0, 30.0 + row * 16.0]},
          's': {'a': 0, 'k': [30.0, 26.0]},
          'r': {'a': 0, 'k': 0},
        });
      }
      shapes.add({'ty': 'mm', 'mm': 2}); // Union
      shapes.add({
        'ty': 'st',
        'c': {'a': 0, 'k': [0.1, 0.7, 0.9, 1.0]},
        'o': {'a': 0, 'k': 100},
        'w': {'a': 0, 'k': 3},
      });
      final doc = <String, dynamic>{
        'v': '5.7.0',
        'fr': 30,
        'ip': 0,
        'op': 10,
        'w': 160,
        'h': 160,
        'layers': <Map<String, dynamic>>[
          <String, dynamic>{
            'ty': 4,
            'ind': 1,
            'ip': 0,
            'op': 10,
            'st': 0,
            'ks': <String, dynamic>{},
            'shapes': <Map<String, dynamic>>[
              <String, dynamic>{'ty': 'gr', 'it': shapes},
            ],
          },
        ],
      };
      final scene = RasterScene.compile(doc, const FastLottieOptions());
      final ws = RasterWorkspace(initialHeight: 160, preferNative: false);
      final bufA = NativePixelBuffer(160 * 160);
      final bufB = NativePixelBuffer(160 * 160);
      renderSceneSoftware(scene, 0, bufA, 160, 160, ws);
      renderSceneSoftware(scene, 0, bufB, 160, 160, ws);
      expect(bufA.typedList.any((px) => px != 0), isTrue);
      expect(bufA.typedList, orderedEquals(bufB.typedList));
      bufA.dispose();
      bufB.dispose();
      ws.dispose();
    });

    test('Lz4Codec roundtrip, boundary lengths, abort cutoff, and shrinkWasmScratch', () {
      final scratch = Lz4Scratch();
      final lengths = <int>[0, 1, 4, 5, 11, 12, 13, 15, 16, 17, 31, 32, 33, 64, 128, 4096, 65536];
      for (final len in lengths) {
        final input = Uint8List(len);
        for (var i = 0; i < len; i++) {
          // Mix repeating 4-byte pixels, 1-byte runs, and varying bytes.
          if (i < len ~/ 3) {
            input[i] = (i & 3) == 3 ? 0xFF : (i & 3) * 40;
          } else if (i < (len * 2) ~/ 3) {
            input[i] = 0x5A;
          } else {
            input[i] = (i * 31 + 17) & 0xFF;
          }
        }
        final comp = Lz4Codec.compress(input, scratch: scratch);
        final dec = Lz4Codec.decompress(comp, len);
        expect(dec, orderedEquals(input), reason: 'len=$len');
      }

      // Abort cutoff returns -1 when incompressible exceeds limit.
      final noisy = Uint8List(512);
      var x = 0x12345678;
      for (var i = 0; i < noisy.length; i++) {
        x = (x * 1664525 + 1013904223) & 0xFFFFFFFF;
        noisy[i] = (x >>> 16) & 0xFF;
      }
      final out = Uint8List(Lz4Codec.maxCompressedLength(noisy.length));
      final aborted = Lz4Codec.compressInto(
        noisy,
        noisy.length,
        out,
        scratch.hashTable,
        abortAtLength: 64,
      );
      expect(aborted, -1);

      scratch.shrinkScratch();
      Lz4Codec.shrinkWasmScratch();
    });

    test('Snapshot decode, Track unroll4, and TilePlaybackPage keep exact pixel parity', () {
      for (final name in const [
        'icon.json',
        'features.json',
        'many_shapes.json',
        'morph.json',
      ]) {
        final bytes = File('test/fixtures/$name').readAsBytesSync();
        final simdScene = RasterScene.compileBytes(
          bytes,
          const FastLottieOptions(useSimd: true),
        );
        final scalarScene = RasterScene.compileBytes(
          bytes,
          const FastLottieOptions(useSimd: false),
        );
        final snap = simdScene.snapshot(simdScene.contentKey, bytes.length);
        final restored = RasterScene.restoreSnapshot(snap, warm: true).scene;

        const w = 128, h = 128;
        final ws1 = RasterWorkspace(initialHeight: h, preferNative: false);
        final ws2 = RasterWorkspace(initialHeight: h, preferNative: false);
        final px1 = NativePixelBuffer(w * h);
        final px2 = NativePixelBuffer(w * h);
        final midFrame = (simdScene.start + simdScene.end) * 0.5;
        renderSceneSoftware(restored, midFrame, px1, w, h, ws1);
        renderSceneSoftware(scalarScene, midFrame, px2, w, h, ws2);
        expect(
          _fnv32(px1.typedList),
          _fnv32(px2.typedList),
          reason: '$name snapshot vs scalar parity',
        );

        // Exercise BitstreamStore + TilePlaybackPage roundtrip.
        final store = BitstreamStore(maximumRamBytes: 4 * 1024 * 1024);
        final lz4 = Lz4Scratch();
        final rawBytes = Uint8List.fromList(Uint8List.sublistView(px1.typedList));
        for (var f = 0; f < 4; f++) {
          store.storeFrame(
            entryKey: name,
            width: w,
            height: h,
            totalFrames: 4,
            poster: false,
            frameIndex: f,
            srcBgra: rawBytes,
            scratch: lz4,
          );
        }
        store.preparePlaybackPage(
          entryKey: name,
          width: w,
          height: h,
          totalFrames: 4,
          frameIndex: 0,
        );
        final decoded = Uint8List(w * h * 4);
        final cursor = TilePlaybackCursor();
        expect(
          store.tryReadFrame(
            entryKey: name,
            width: w,
            height: h,
            totalFrames: 4,
            poster: false,
            frameIndex: 2,
            dstBgra: decoded,
            cursor: cursor,
          ),
          isTrue,
        );
        expect(decoded, orderedEquals(rawBytes), reason: '$name tile playback');
        store.shrinkScratch();
        store.dispose();
        px1.dispose();
        px2.dispose();
        ws1.dispose();
        ws2.dispose();
      }
    });

    test('contentKey is deterministic for compiled JSON', () {
      final raw = utf8.encode(File('test/fixtures/morph.json').readAsStringSync());
      final a = RasterScene.compileBytes(
        Uint8List.fromList(raw),
        const FastLottieOptions(),
      );
      final b = RasterScene.compileBytes(
        Uint8List.fromList(raw),
        const FastLottieOptions(),
      );
      expect(a.contentKey, b.contentKey);
      expect(a.contentKey.isNotEmpty, isTrue);
    });
  });
}
