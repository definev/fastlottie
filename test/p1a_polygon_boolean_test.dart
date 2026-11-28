import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/flutter/composition.dart' show CompositionPlayback;
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/platform/simd_wasm.dart'
    show NativePixelBuffer;
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/raster/raster_geometry.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show render;
import 'merge_paths_test.dart' show circleShape, mergeOp, rectShape;
import 'path_ops_test.dart' show animated, constant, fill, stroke, trim;

Map<String, dynamic> _doc(List<Map<String, dynamic>> items) => {
  'v': '5.7.0',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': 256,
  'h': 256,
  'layers': [
    {
      'ty': 4,
      'ind': 1,
      'ip': 0,
      'op': 60,
      'st': 0,
      'ks': {
        'o': constant(100),
        'r': constant(0),
        'p': constant([0, 0, 0]),
        'a': constant([0, 0, 0]),
        's': constant([100, 100, 100]),
      },
      'shapes': [
        {
          'ty': 'gr',
          'it': [
            ...items,
            {
              'ty': 'tr',
              'p': constant([0, 0]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          ],
        },
      ],
    },
  ],
};

PolyPath _rectPoly(
  double x0,
  double y0,
  double x1,
  double y1, {
  bool ccw = false,
}) {
  final p = PolyPath();
  p.beginContour(true);
  if (!ccw) {
    p.addVertex(x0, y0);
    p.addVertex(x1, y0);
    p.addVertex(x1, y1);
    p.addVertex(x0, y1);
  } else {
    p.addVertex(x0, y0);
    p.addVertex(x0, y1);
    p.addVertex(x1, y1);
    p.addVertex(x1, y0);
  }
  p.endContour();
  return p;
}

double _signedArea(PolyPath poly, int contourIndex) {
  final s = poly.contourStart[contourIndex];
  final e = poly.contourEnd[contourIndex];
  final len = e - s;
  var area = 0.0;
  for (var i = 0; i < len; i++) {
    final i0 = s + i;
    final i1 = s + ((i + 1) % len);
    area += poly.vx[i0] * poly.vy[i1] - poly.vx[i1] * poly.vy[i0];
  }
  return area * 0.5;
}

int _bgraAlpha(Uint32List bgra, int x, int y) => bgra[y * 256 + x] >>> 24;

Future<({Uint32List nativePx, Uint32List dartPx, Uint8List canvasRgba})>
_compareBackends(
  Map<String, dynamic> doc, {
  double frame = 0,
  int maxChannelDiff = 14,
  double maxBadRatio = 0.02,
}) async {
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
  try {
    final nativePx = Uint32List.fromList(native.renderFrame(frame));
    final dartPx = Uint32List.fromList(dart.renderFrame(frame));
    expect(nativePx, orderedEquals(dartPx), reason: 'Native C != Dart');

    final canvasRgba = await render(
      (c) => player.draw(
        c,
        const ui.Rect.fromLTWH(0, 0, 256, 256),
        frame / 60.0,
        useFrameRate: false,
      ),
    );
    var bad = 0;
    final sampleDiffs = <String>[];
    int swMinX = 256, swMaxX = -1, swMinY = 256, swMaxY = -1;
    int cvMinX = 256, cvMaxX = -1, cvMinY = 256, cvMaxY = -1;
    for (var i = 0; i < dartPx.length; i++) {
      final w = dartPx[i];
      final idx = i * 4;
      final x = i % 256, y = i ~/ 256;
      final sr = (w >> 16) & 0xff, sg = (w >> 8) & 0xff, sb = w & 0xff, sa = (w >>> 24) & 0xff;
      final cr = canvasRgba[idx], cg = canvasRgba[idx + 1], cb = canvasRgba[idx + 2], ca = canvasRgba[idx + 3];
      if (sa > 0) {
        if (x < swMinX) swMinX = x; if (x > swMaxX) swMaxX = x;
        if (y < swMinY) swMinY = y; if (y > swMaxY) swMaxY = y;
      }
      if (ca > 0) {
        if (x < cvMinX) cvMinX = x; if (x > cvMaxX) cvMaxX = x;
        if (y < cvMinY) cvMinY = y; if (y > cvMaxY) cvMaxY = y;
      }
      final dr = (sr - cr).abs();
      final dg = (sg - cg).abs();
      final db = (sb - cb).abs();
      final da = (sa - ca).abs();
      if (dr > maxChannelDiff ||
          dg > maxChannelDiff ||
          db > maxChannelDiff ||
          da > maxChannelDiff) {
        bad++;
        if (sampleDiffs.length < 6) {
          sampleDiffs.add('($x,$y):sw=($sr,$sg,$sb,$sa),cv=($cr,$cg,$cb,$ca)');
        }
      }
    }
    expect(
      bad / dartPx.length,
      lessThan(maxBadRatio),
      reason: 'Canvas vs Software diverged at $bad/${dartPx.length} px (sw=[$swMinX..$swMaxX,$swMinY..$swMaxY], cv=[$cvMinX..$cvMaxX,$cvMinY..$cvMaxY]): $sampleDiffs',
    );
    return (nativePx: nativePx, dartPx: dartPx, canvasRgba: canvasRgba);
  } finally {
    native.dispose();
    dart.dispose();
    player.dispose();
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('PR #5.1 PolygonBoolean kernel unit & topology checks', () {
    test('collinear shared edge merges cleanly across Add/Subtract/Intersect/XOR', () {
      final scratch = PolygonBooleanScratch();
      final left = _rectPoly(20, 40, 100, 140);
      final right = _rectPoly(100, 40, 180, 140);
      final out = PolyPath();

      // Union of flush adjacent rects collapses collinear seam into 1 4-vertex rect [20..180].
      expect(booleanPolyPaths(left, right, 2, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(out.vertexCount, 4);
      expect(_signedArea(out, 0), closeTo(160 * 100, 1e-3));

      // Intersect of flush adjacent rects is zero-area empty.
      expect(booleanPolyPaths(left, right, 4, out, scratch), isTrue);
      expect(out.contourCount, 0);

      // Subtract leaves left unchanged (no sliver along x=100).
      expect(booleanPolyPaths(left, right, 3, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(_signedArea(out, 0), closeTo(80 * 100, 1e-3));

      // XOR of flush adjacent rects removes shared seam just like Union.
      expect(booleanPolyPaths(left, right, 5, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(_signedArea(out, 0), closeTo(160 * 100, 1e-3));
    });

    test('pinch-touching corners emit two simple non-crossing contours', () {
      final scratch = PolygonBooleanScratch();
      final a = _rectPoly(20, 20, 100, 100);
      final b = _rectPoly(100, 100, 180, 180);
      final out = PolyPath();

      expect(booleanPolyPaths(a, b, 2, out, scratch), isTrue);
      expect(out.contourCount, 2);
      expect(_signedArea(out, 0), closeTo(6400, 1e-3));
      expect(_signedArea(out, 1), closeTo(6400, 1e-3));
    });

    test('nested hole and island normalize winding consistently (outer CW, hole CCW)', () {
      final scratch = PolygonBooleanScratch();
      final outer = _rectPoly(20, 20, 220, 220);
      final hole = _rectPoly(60, 60, 180, 180);
      final island = _rectPoly(90, 90, 150, 150, ccw: true);
      final donut = PolyPath();
      final out = PolyPath();

      expect(booleanPolyPaths(outer, hole, 3, donut, scratch), isTrue);
      expect(donut.contourCount, 2);
      final a0 = _signedArea(donut, 0);
      final a1 = _signedArea(donut, 1);
      // Outer positive area in Y-down, hole negative area -> sum == donut ring area.
      expect(a0 + a1, closeTo(200 * 200 - 120 * 120, 1e-3));
      expect(a0 * a1, lessThan(0));

      expect(booleanPolyPaths(donut, island, 2, out, scratch), isTrue);
      expect(out.contourCount, 3);
      var totalArea = 0.0;
      for (var i = 0; i < out.contourCount; i++) {
        totalArea += _signedArea(out, i);
      }
      expect(totalArea, closeTo(200 * 200 - 120 * 120 + 60 * 60, 1e-3));
    });

    test('self-intersecting bowtie resolves cleanly and huge input respects budget cap', () {
      final scratch = PolygonBooleanScratch();
      final bowtie = PolyPath()
        ..beginContour(true)
        ..addVertex(20, 20)
        ..addVertex(120, 120)
        ..addVertex(120, 20)
        ..addVertex(20, 120)
        ..endContour();
      final out = PolyPath();
      expect(booleanPolyPaths(bowtie, PolyPath(), 2, out, scratch), isTrue);
      expect(out.contourCount, 2);

      // Exceed maxInputSegments -> safe false return without crashing.
      final huge = PolyPath()..beginContour(true);
      for (var i = 0; i < PolygonBooleanScratch.maxInputSegments + 10; i++) {
        huge.addVertex(i * 0.1, i.isEven ? 10 : 50);
      }
      huge.endContour();
      expect(booleanPolyPaths(huge, PolyPath(), 2, out, scratch), isFalse);

      // Exceed maxSubSegments intersection budget on dense orthogonal grid -> safe false return.
      final gridA = PolyPath();
      final gridB = PolyPath();
      for (var i = 0; i < 200; i++) {
        final y0 = 10.0 + i * 2.0;
        gridA
          ..beginContour(true)
          ..addVertex(10, y0)
          ..addVertex(410, y0)
          ..addVertex(410, y0 + 1.0)
          ..addVertex(10, y0 + 1.0)
          ..endContour();
        final x0 = 10.0 + i * 2.0;
        gridB
          ..beginContour(true)
          ..addVertex(x0, 10)
          ..addVertex(x0 + 1.0, 10)
          ..addVertex(x0 + 1.0, 410)
          ..addVertex(x0, 410)
          ..endContour();
      }
      expect(booleanPolyPaths(gridA, gridB, 4, out, scratch), isFalse);
      scratch.trimIfOversized(aggressive: true);
    });

    test('asymmetric Subtract and sequential 3-operand Intersect lock operand order', () {
      final scratch = PolygonBooleanScratch();
      final a = _rectPoly(20, 20, 120, 120); // area = 10000, [20..120]
      final b = _rectPoly(60, 20, 160, 120); // overlaps [60..120]
      final c = _rectPoly(80, 40, 140, 100); // strictly inside b

      // Left-associative ((a \ b) \ c) != a \ (b \ c):
      final tmp = PolyPath();
      final leftAssoc = PolyPath();
      expect(booleanPolyPaths(a, b, 3, tmp, scratch), isTrue);
      expect(booleanPolyPaths(tmp, c, 3, leftAssoc, scratch), isTrue);
      expect(_signedArea(leftAssoc, 0), closeTo(40 * 100, 1e-3));

      // Reversed order b \ a != a \ b:
      final bMinusA = PolyPath();
      expect(booleanPolyPaths(b, a, 3, bMinusA, scratch), isTrue);
      expect(_signedArea(bMinusA, 0), closeTo(40 * 100, 1e-3));
      expect(bMinusA.vx[0], closeTo(120, 1e-3)); // [120..160] vs [20..60]
      expect(leftAssoc.vx[0], closeTo(20, 1e-3));

      // Disjoint d, e with f inside e under left-associative (d ∩ e) ∩ f -> empty:
      final d = _rectPoly(10, 10, 50, 50);
      final e = _rectPoly(100, 10, 180, 90);
      final f = _rectPoly(120, 30, 160, 70);
      expect(booleanPolyPaths(d, e, 4, tmp, scratch), isTrue);
      expect(booleanPolyPaths(tmp, f, 4, leftAssoc, scratch), isTrue);
      expect(leftAssoc.contourCount, 0);
    });

    test('edge buffer growth past 256 preserves all _order indices', () {
      final scratch = PolygonBooleanScratch();
      PolyPath makeNgon(double cx, double cy, double r, int n) {
        final p = PolyPath()..beginContour(true);
        for (var i = 0; i < n; i++) {
          final theta = (2 * math.pi * i) / n;
          p.addVertex(cx + r * math.cos(theta), cy + r * math.sin(theta));
        }
        p.endContour();
        return p;
      }

      // 180 + 180 = 360 edges > initial 256 buffer capacity -> triggers _ensureEdgeCapacity(512).
      final a = makeNgon(110, 128, 60, 180);
      final b = makeNgon(150, 128, 60, 180);
      final out = PolyPath();
      expect(booleanPolyPaths(a, b, 2, out, scratch), isTrue);
      expect(out.contourCount, 1);
      final unionArea = _signedArea(out, 0);

      expect(booleanPolyPaths(a, b, 4, out, scratch), isTrue);
      expect(out.contourCount, 1);
      final interArea = _signedArea(out, 0);

      final rectAreaA = math.pi * 60 * 60 * 0.999; // regular 180-gon ~ circle area
      expect(unionArea, greaterThan(rectAreaA * 1.4));
      expect(interArea, greaterThan(rectAreaA * 0.4));
      expect(unionArea + interArea, closeTo(2 * math.pi * 60 * 60, 40.0));
    });

    test('nearly vertical edges (both upward & downward) classify accurately', () {
      final scratch = PolygonBooleanScratch();
      // Nearly-vertical parallelogram slanted slightly right-upward (dx=1e-4, dy=-80 => signYe = -1)
      // and slanted slightly right-downward (dx=1e-4, dy=+80) crossed by a wide horizontal bar.
      final nearVert = PolyPath()
        ..beginContour(true)
        ..addVertex(100.0, 20.0)
        ..addVertex(100.0001, 120.0)
        ..addVertex(140.0001, 120.0)
        ..addVertex(140.0, 20.0)
        ..endContour();
      final crossBar = PolyPath()
        ..beginContour(true)
        ..addVertex(60.0, 50.0)
        ..addVertex(180.0, 50.0)
        ..addVertex(180.0, 90.0)
        ..addVertex(60.0, 90.0)
        ..endContour();
      final out = PolyPath();

      // Intersect -> exact [100..140] x [50..90] box (area 1600).
      expect(booleanPolyPaths(nearVert, crossBar, 4, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(_signedArea(out, 0), closeTo(40 * 40, 1e-1));

      // Subtract vertical from horizontal -> 2 clean left/right bars (each area 40*40 = 1600).
      expect(booleanPolyPaths(crossBar, nearVert, 3, out, scratch), isTrue);
      expect(out.contourCount, 2);
      expect(_signedArea(out, 0) + _signedArea(out, 1), closeTo(3200, 1e-1));

      // Slanted upward vertical edge (bottom-left (100, 120) -> top-right (100.0002, 20)).
      final ccwNearVert = PolyPath()
        ..beginContour(true)
        ..addVertex(100.0, 120.0)
        ..addVertex(100.0002, 20.0)
        ..addVertex(140.0002, 20.0)
        ..addVertex(140.0, 120.0)
        ..endContour();
      expect(booleanPolyPaths(ccwNearVert, crossBar, 2, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(_signedArea(out, 0), closeTo(40 * 100 + 80 * 40, 1e-1));
    });

    test('shallow X-crossing between nearly parallel edges splits cleanly', () {
      final scratch = PolygonBooleanScratch();
      // Top edge of a spans (0, 100)->(1000, 100); bottom edge of b crosses it at (500, 100)
      // with slope 2e-7 (crossSin ~ 2e-7 <= 1e-6) and endpoint distance ~ 1e-4 >> proxEps (1e-6).
      final a = PolyPath()
        ..beginContour(true)
        ..addVertex(0, 100.0)
        ..addVertex(1000, 100.0)
        ..addVertex(1000, 110.0)
        ..addVertex(0, 110.0)
        ..endContour();
      final b = PolyPath()
        ..beginContour(true)
        ..addVertex(0, 99.9999)
        ..addVertex(1000, 100.0001)
        ..addVertex(1000, 120.0)
        ..addVertex(0, 120.0)
        ..endContour();
      final out = PolyPath();

      // Intersect of a and b has 4 corners (500,100), (1000,100.0001), (1000,110), (0,110), (0,100)
      // Wait: for x in [0..500], a top edge (100) < b top edge (99.9999 + ... -> b is HIGHER on [0..500]!).
      // Actually [0..500]: b y in [99.9999..120], a y in [100..110] -> a inside b (height 10).
      // [500..1000]: a y in [100..110], b top edge dips below 100..100.0001 -> ~1000 * 10 = 10000 area!
      expect(booleanPolyPaths(a, b, 4, out, scratch), isTrue);
      expect(out.contourCount, 1);
      expect(_signedArea(out, 0), closeTo(10000, 0.1));

      // Subtract (b \ a) covers [110..120] strip (~10000) + tiny left wedge; must stay valid single loop.
      expect(booleanPolyPaths(b, a, 3, out, scratch), isTrue);
      expect(out.contourCount, greaterThanOrEqualTo(1));
      var sumArea = 0.0;
      for (var i = 0; i < out.contourCount; i++) {
        sumArea += _signedArea(out, i);
      }
      expect(sumArea, closeTo(10000, 0.2));
    });
  });

  group('PR #5.2 Stroked MergePaths (Dart == C == Canvas)', () {
    test('all modes 1..5 stroked match across C, Dart, and Canvas with no cut-seam stroke', () async {
      for (final mode in [1, 2, 3, 4, 5]) {
        final doc = _doc([
          rectShape(x: 96, y: 128, w: 96, h: 96),
          rectShape(x: 156, y: 128, w: 96, h: 96),
          mergeOp(mode),
          stroke()
            ..['w'] = constant(8)
            ..['lj'] = 2,
        ]);
        final res = await _compareBackends(doc, maxChannelDiff: 12);
        // Interior overlap vertical seam x=108 (mode 2 removes left seam; mode 1 keeps both!).
        if (mode == 2 || mode == 4) {
          // Overlap midpoint (128, 128) is strictly inside Union/Intersect -> NOT stroked!
          expect(_bgraAlpha(res.dartPx, 128, 128), 0, reason: 'mode=$mode seam leak');
        }
        if (mode == 1) {
          // Mode 1 (Merge) preserves individual outlines -> left rect right edge (144, 128) IS stroked.
          expect(_bgraAlpha(res.dartPx, 144, 128), 255);
        } else if (mode == 2) {
          // Mode 2 (Add) removes internal x=144 edge of left rect cleanly.
          expect(_bgraAlpha(res.dartPx, 144, 128), 0);
        }
      }
    });

    test('multi-operand (>=3), curved circles, gradient stroke & dashed MergePaths match Canvas', () async {
      final subtract3Doc = _doc([
        rectShape(x: 128, y: 128, w: 140, h: 140),
        circleShape(x: 168, y: 100, r: 42),
        circleShape(x: 92, y: 156, r: 42),
        mergeOp(3),
        stroke(gradient: true)
          ..['w'] = constant(6)
          ..['d'] = [
            {'n': 'd', 'v': constant(10)},
            {'n': 'g', 'v': constant(6)},
          ],
      ]);
      await _compareBackends(subtract3Doc, maxBadRatio: 0.025);

      // Disjoint A, B with C inside B under Intersect -> empty stroked output.
      final emptyIntersect = _doc([
        rectShape(x: 50, y: 128, w: 40, h: 80),
        rectShape(x: 180, y: 128, w: 80, h: 100),
        circleShape(x: 180, y: 128, r: 20),
        mergeOp(4),
        stroke()..['w'] = constant(8),
      ]);
      final emptyRes = await _compareBackends(emptyIntersect);
      expect(emptyRes.dartPx, everyElement(0));

      // Asymmetric Subtract order: (smallCircle \ largeRect) == empty,
      // while (largeRect \ smallCircle) renders carved ring boundary.
      final smallMinusLarge = _doc([
        circleShape(x: 128, y: 128, r: 24),
        rectShape(x: 128, y: 128, w: 120, h: 120),
        mergeOp(3),
        stroke()..['w'] = constant(6),
      ]);
      final emptySubRes = await _compareBackends(smallMinusLarge);
      expect(emptySubRes.dartPx, everyElement(0));

      // Single-operand Subtract (mm=3) matches Canvas (empty) and software fill parity.
      final singleSub = _doc([
        rectShape(x: 128, y: 128, w: 80, h: 80),
        mergeOp(3),
        stroke()..['w'] = constant(6),
      ]);
      final singleSubRes = await _compareBackends(singleSub);
      expect(singleSubRes.dartPx, everyElement(0));

      // High-segment >256-edge curved boolean (two dense rounded rects + large circles) matches Canvas.
      final denseDoc = _doc([
        {
          'ty': 'el',
          'p': constant([112, 128]),
          's': constant([140, 140]),
        },
        {
          'ty': 'el',
          'p': constant([152, 128]),
          's': constant([140, 140]),
        },
        {
          'ty': 'rc',
          'p': constant([128, 128]),
          's': constant([150, 90]),
          'r': constant(30),
        },
        mergeOp(2),
        stroke()..['w'] = constant(6),
      ]);
      await _compareBackends(denseDoc);

      // Rotated nearly-vertical thin bar + circle in stroked MergePaths.
      final rotatedBar = _doc([
        {
          'ty': 'gr',
          'it': [
            rectShape(x: 0, y: 0, w: 20, h: 140),
            {
              'ty': 'tr',
              'p': constant([128, 128]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0.02),
              'o': constant(100),
            },
          ],
        },
        circleShape(x: 128, y: 128, r: 40),
        mergeOp(2),
        stroke()..['w'] = constant(6),
      ]);
      await _compareBackends(rotatedBar);
    });

    test('MergePaths respects nested and outer group transforms cleanly', () async {
      final doc = _doc([
        {
          'ty': 'gr',
          'it': [
            {
              'ty': 'gr',
              'it': [
                rectShape(x: 0, y: 0, w: 60, h: 60),
                {
                  'ty': 'tr',
                  'p': constant([20, 0]),
                  'a': constant([0, 0]),
                  's': constant([100, 100]),
                  'r': constant(0),
                  'o': constant(100),
                },
              ],
            },
            circleShape(x: 45, y: 0, r: 30),
            mergeOp(2),
            {
              'ty': 'tr',
              'p': constant([90, 128]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          ],
        },
        stroke()..['w'] = constant(6),
      ]);
      await _compareBackends(doc);
    });
  });

  group('PR #5.3 MergePaths -> Trim Paths (mm -> tm) & caching', () {
    test('stroked mm -> tm renders trimmed boolean boundary across C, Dart, and Canvas', () async {
      final unionTrim = _doc([
        rectShape(x: 100, y: 128, w: 80, h: 80),
        rectShape(x: 156, y: 128, w: 80, h: 80),
        mergeOp(2),
        trim(constant(0), constant(45), constant(0)),
        stroke()..['w'] = constant(8),
      ]);
      final res = await _compareBackends(unionTrim, maxBadRatio: 0.01);
      // Authored lhs origin is (140, 88) CW -> 45% reaches right/bottom-right (196, 168),
      // leaving bottom-left (60, 168) undrawn, matching Canvas tightly.
      expect(res.dartPx.where((p) => (p >>> 24) > 0).length, greaterThan(400));
      expect(_bgraAlpha(res.dartPx, 196, 168), 255);
      expect(_bgraAlpha(res.dartPx, 60, 168), 0);

      // Post-style tm order ([mm, st, tm]) with non-zero offset also trims cleanly.
      final postStyleTrim = _doc([
        rectShape(x: 100, y: 128, w: 80, h: 80),
        rectShape(x: 156, y: 128, w: 80, h: 80),
        mergeOp(2),
        stroke()..['w'] = constant(8),
        trim(constant(15), constant(65), constant(45)),
      ]);
      final offsetRes = await _compareBackends(postStyleTrim, maxBadRatio: 0.01);
      expect(offsetRes.dartPx.where((p) => (p >>> 24) > 0).length, greaterThan(400));

      // Identical range between pre-style [mm, tm, st] and post-style [mm, st, tm].
      final sameOrderDoc = _doc([
        rectShape(x: 100, y: 128, w: 80, h: 80),
        rectShape(x: 156, y: 128, w: 80, h: 80),
        mergeOp(2),
        trim(constant(15), constant(65), constant(45)),
        stroke()..['w'] = constant(8),
      ]);
      final sameOrderRes = await _compareBackends(sameOrderDoc, maxBadRatio: 0.01);
      expect(offsetRes.dartPx, orderedEquals(sameOrderRes.dartPx));

      // Subtracting a disjoint shape preserves rect origin (168, 88) so 0..25% draws right edge.
      final rectMinusDisjointTrim = _doc([
        rectShape(x: 128, y: 128, w: 80, h: 80),
        circleShape(x: 20, y: 20, r: 10),
        mergeOp(3),
        trim(constant(0), constant(25), constant(0)),
        stroke()..['w'] = constant(8),
      ]);
      final disjointTrimRes = await _compareBackends(rectMinusDisjointTrim, maxBadRatio: 0.012);
      expect(_bgraAlpha(disjointTrimRes.dartPx, 168, 128), 255);
      expect(_bgraAlpha(disjointTrimRes.dartPx, 128, 88), 0);

      // Authored operand order is preserved across disjoint contours regardless of Y coordinate.
      final disjointOrderTrim = _doc([
        rectShape(x: 128, y: 190, w: 60, h: 60),
        rectShape(x: 128, y: 60, w: 60, h: 60),
        mergeOp(2),
        trim(constant(0), constant(40), constant(0)),
        stroke()..['w'] = constant(6),
      ]);
      final orderSession = FastLottieSoftwareSession(
        FastLottieComposition.fromJson(disjointOrderTrim),
        pixelWidth: 256,
        pixelHeight: 256,
        preferNative: false,
      );
      addTearDown(orderSession.dispose);
      final orderPx = Uint32List.fromList(orderSession.renderFrame(0));
      // Lower rect (y=190, rhs origin (158, 160)) draws first; upper rect (y=60) untouched.
      expect(_bgraAlpha(orderPx, 158, 190), 255);
      expect(_bgraAlpha(orderPx, 158, 60), 0);
    });

    test('filled mm -> tm + animated mm/tm cache reuse & trimScratch leave workspace healthy', () async {
      // Near-full trimmed boolean fill (forces polygon boolean + trim pipeline, not RLE)
      // matches Dart, Native C, and ui.Canvas accurately.
      final unionFill99 = _doc([
        rectShape(x: 110, y: 128, w: 80, h: 80),
        circleShape(x: 145, y: 128, r: 35),
        mergeOp(2),
        trim(constant(0), constant(99.5), constant(0)),
        fill([0.2, 0.7, 0.9]),
      ]);
      final fillRes = await _compareBackends(unionFill99, maxBadRatio: 0.02);
      expect(fillRes.dartPx.where((p) => (p >>> 24) > 0).length, greaterThan(4500));

      // Animated Trim Paths on static boolean donut: Native C and Dart agree across frames
      // (partial filled boolean start/winding differs across Skia vs polygon engines).
      final staticMmAnimTm = _doc([
        rectShape(x: 128, y: 128, w: 120, h: 120),
        circleShape(x: 128, y: 128, r: 40),
        mergeOp(3),
        trim(constant(0), animated(10, 90), constant(0)),
        fill([0.2, 0.7, 0.9]),
      ]);
      final comp = FastLottieComposition.fromJson(staticMmAnimTm);
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
      addTearDown(() {
        native.dispose();
        dart.dispose();
      });

      final f10 = Uint32List.fromList(dart.renderFrame(10));
      final f30 = Uint32List.fromList(dart.renderFrame(30));
      final f45 = Uint32List.fromList(dart.renderFrame(45));
      expect(Uint32List.fromList(native.renderFrame(30)), orderedEquals(f30));
      expect(f10, isNot(equals(f30)));
      expect(f30, isNot(equals(f45)));

      // Animated operand inside stroked MergePaths with round caps & gradient stroke.
      final animMm = _doc([
        rectShape(x: 100, y: 128, w: 80, h: 80),
        {
          'ty': 'el',
          'p': animated([110, 128], [180, 128]),
          's': constant([60, 60]),
        },
        mergeOp(2),
        stroke(gradient: true)
          ..['w'] = constant(6)
          ..['lc'] = 2,
      ]);
      await _compareBackends(animMm, frame: 15);
      await _compareBackends(animMm, frame: 45);

      // Verify aggressive scratch trimming resets workspace cleanly after complex booleans.
      final ws = RasterWorkspace(initialHeight: 256, preferNative: false);
      final buf = NativePixelBuffer(256 * 256);
      final scene = comp.sceneTemplate.fork();
      renderSceneSoftware(scene, 0, buf, 256, 256, ws);
      ws.trimScratch(aggressive: true);
      renderSceneSoftware(scene, 30, buf, 256, 256, ws);
      final afterTrim = Uint32List.fromList(buf.typedList);
      buf.dispose();
      ws.dispose();
      expect(afterTrim, orderedEquals(f30));

      // _staticMergePolyline enforces maxStaticPaths after child static leaf caching.
      final manyMerges = <Map<String, dynamic>>[
        for (var i = 0; i < 300; i++)
          {
            'ty': 'gr',
            'it': [
              rectShape(x: 40 + (i % 10) * 16.0, y: 40 + (i ~/ 10) * 6.0, w: 12, h: 12),
              circleShape(x: 44 + (i % 10) * 16.0, y: 40 + (i ~/ 10) * 6.0, r: 6),
              mergeOp(2),
              stroke()..['w'] = constant(2),
              {
                'ty': 'tr',
                'p': constant([0, 0]),
                'a': constant([0, 0]),
                's': constant([100, 100]),
                'r': constant(0),
                'o': constant(100),
              },
            ],
          },
      ];
      final cacheDoc = {
        'v': '5.7.0',
        'fr': 60,
        'ip': 0,
        'op': 60,
        'w': 256,
        'h': 256,
        'layers': [
          {
            'ty': 4,
            'ind': 1,
            'ip': 0,
            'op': 60,
            'st': 0,
            'ks': {
              'o': constant(100),
              'r': constant(0),
              'p': constant([0, 0, 0]),
              'a': constant([0, 0, 0]),
              's': constant([100, 100, 100]),
            },
            'shapes': manyMerges,
          },
        ],
      };
      final cacheComp = FastLottieComposition.fromJson(cacheDoc);
      final cacheWs = RasterWorkspace(initialHeight: 256, preferNative: false);
      final cacheBuf = NativePixelBuffer(256 * 256);
      renderSceneSoftware(cacheComp.sceneTemplate.fork(), 0, cacheBuf, 256, 256, cacheWs);
      expect(cacheWs.debugStaticPathCount, lessThanOrEqualTo(RasterWorkspace.maxStaticPaths));
      cacheBuf.dispose();
      cacheWs.dispose();
    });

    test('PR #5 review fixes: near-snap subdivided chain union, non-finite/huge coords, and _outAdj trim', () {
      final scratch = PolygonBooleanScratch();
      final lhs = PolyPath();
      final rhs = PolyPath();
      final out = PolyPath();

      // 1. Subdivided bottom edge [0..100] with midpoint (50, 100) vs rhs triangle
      // offset by d = 1.8e-6 (previously fell between _splitProximityEps=1e-6 and _snapEps=2.5e-6).
      lhs
        ..beginContour(true)
        ..addVertex(0, 0)
        ..addVertex(100, 0)
        ..addVertex(100, 100)
        ..addVertex(50, 100)
        ..addVertex(0, 100)
        ..endContour();
      rhs
        ..beginContour(true)
        ..addVertex(0, 100.0000018)
        ..addVertex(100, 100.0000018)
        ..addVertex(50, 200)
        ..endContour();
      expect(booleanPolyPaths(lhs, rhs, 2, out, scratch), isTrue);
      // Merged pentagon has area = 100*100 + 0.5*100*100 = 15000.
      var area2 = 0.0;
      for (var c = 0; c < out.contourCount; c++) {
        final s = out.contourStart[c], e = out.contourEnd[c];
        for (var i = s; i < e; i++) {
          final j = i + 1 == e ? s : i + 1;
          area2 += out.vx[i] * out.vy[j] - out.vx[j] * out.vy[i];
        }
      }
      expect(area2.abs() * 0.5, closeTo(15000.0, 1.0));

      // 2. Non-finite or huge (> 1e7) coordinates reject cleanly without throwing.
      final bad = PolyPath()
        ..beginContour(true)
        ..addVertex(0, 0)
        ..addVertex(1e160, 0)
        ..addVertex(0, 10)
        ..endContour();
      expect(booleanPolyPaths(bad, rhs, 2, out, scratch), isFalse);

      // 3. Normal 512x512 coordinates (> 305) union cleanly with JS-safe 32-bit grid hash.
      lhs
        ..clear()
        ..beginContour(true)
        ..addVertex(320, 320)
        ..addVertex(460, 320)
        ..addVertex(460, 460)
        ..addVertex(320, 460)
        ..endContour();
      rhs
        ..clear()
        ..beginContour(true)
        ..addVertex(380, 380)
        ..addVertex(512, 380)
        ..addVertex(512, 512)
        ..addVertex(380, 512)
        ..endContour();
      expect(booleanPolyPaths(lhs, rhs, 2, out, scratch), isTrue);
      expect(out.contourCount, 1);

      // 4. Non-aggressive trim clears oversized _outAdj even when input edge count <= 2048.
      scratch.trimIfOversized(aggressive: false);
    });
  });
}
