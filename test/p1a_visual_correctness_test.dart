import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/platform/geometry_kernel_io.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/raster/raster_geometry.dart';
import 'package:fastlottie/src/raster/scanline_rasterizer.dart';
import 'package:fastlottie/src/raster/swar_blender.dart';
import 'package:fastlottie/testing.dart';
import 'package:ffi/ffi.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

import 'fastlottie_test.dart' show bytes, render;
import 'path_ops_test.dart'
    show animated, constant, fill, rectangle, stroke, trim;

Map<String, dynamic> _doc(
  List<Map<String, dynamic>> layers, {
  List<Map<String, dynamic>> assets = const [],
  double ip = 0,
  double op = 60,
  double fr = 60,
  int w = 256,
  int h = 256,
}) => {
  'v': '5.7.0',
  'fr': fr,
  'ip': ip,
  'op': op,
  'w': w,
  'h': h,
  'assets': assets,
  'layers': layers,
};

Map<String, dynamic> _shapeLayer(
  int ind,
  List<Map<String, dynamic>> shapes, {
  Map<String, dynamic>? ks,
  double ip = 0,
  double op = 60,
  double st = 0,
  double sr = 1,
  int tt = 0,
  int td = 0,
  int bm = 0,
  List<Map<String, dynamic>>? masks,
  List<Map<String, dynamic>>? sy,
}) => {
  'ty': 4,
  'ind': ind,
  if (tt != 0) 'tt': tt,
  if (td != 0) 'td': td,
  if (bm != 0) 'bm': bm,
  'ip': ip,
  'op': op,
  'st': st,
  'sr': sr,
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
  'masksProperties': ?masks,
  'sy': ?sy,
};

Map<String, dynamic> _precompLayer(
  int ind,
  String refId, {
  double ip = 0,
  double op = 60,
  double st = 0,
  double sr = 1,
  Map<String, dynamic>? tm,
  int? w,
  int? h,
  Map<String, dynamic>? ks,
  List<Map<String, dynamic>>? masks,
}) => {
  'ty': 0,
  'ind': ind,
  'refId': refId,
  'ip': ip,
  'op': op,
  'st': st,
  'sr': sr,
  'w': ?w,
  'h': ?h,
  'tm': ?tm,
  'ks':
      ks ??
      {
        'a': constant([0, 0]),
        'p': constant([0, 0]),
        's': constant([100, 100]),
        'r': constant(0),
        'o': constant(100),
      },
  'masksProperties': ?masks,
};

Map<String, dynamic> _rectMask(
  double x0,
  double y0,
  double x1,
  double y1, {
  String mode = 'a',
  bool inv = false,
  int opacity = 100,
}) => {
  'mode': mode,
  'inv': inv,
  'o': constant(opacity),
  'pt': constant({
    'c': true,
    'v': [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ],
    'i': [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    'o': [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  }),
};

Map<String, dynamic> _bezierShape(
  List<List<double>> v,
  List<List<double>> i,
  List<List<double>> o, {
  bool closed = true,
  int? d,
}) => {
  'ty': 'sh',
  'd': ?d,
  'ks': constant({'c': closed, 'v': v, 'i': i, 'o': o}),
};

int _bgraAlpha(Uint32List bgra, int x, int y, {int width = 256}) =>
    bgra[y * width + x] >>> 24;

(int r, int g, int b, int a) _bgraPixel(
  Uint32List bgra,
  int x,
  int y, {
  int width = 256,
}) {
  final w = bgra[y * width + x];
  return ((w >> 16) & 0xff, (w >> 8) & 0xff, w & 0xff, (w >>> 24) & 0xff);
}

(int r, int g, int b, int a) _rgbaPixel(
  Uint8List rgba,
  int x,
  int y, {
  int width = 256,
}) {
  final idx = (y * width + x) * 4;
  return (rgba[idx], rgba[idx + 1], rgba[idx + 2], rgba[idx + 3]);
}

Future<({Uint32List nativePx, Uint32List dartPx, Uint8List canvasRgba})>
_renderAllBackends(
  Map<String, dynamic> doc, {
  double frame = 0,
  int size = 256,
  int maxChannelDiff = 3,
  bool exactNativeDart = true,
}) async {
  final comp = FastLottieComposition.fromJson(doc);
  final native = FastLottieSoftwareSession(
    comp,
    pixelWidth: size,
    pixelHeight: size,
    preferNative: true,
  );
  final dart = FastLottieSoftwareSession(
    comp,
    pixelWidth: size,
    pixelHeight: size,
    preferNative: false,
  );
  final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
  try {
    final nativePx = Uint32List.fromList(native.renderFrame(frame));
    final dartPx = Uint32List.fromList(dart.renderFrame(frame));
    if (exactNativeDart) {
      expect(nativePx, orderedEquals(dartPx), reason: 'Native C != Dart');
    } else {
      for (var i = 0; i < nativePx.length; i++) {
        final nw = nativePx[i], dw = dartPx[i];
        expect(
          ((nw >> 16) & 0xff) - ((dw >> 16) & 0xff),
          inInclusiveRange(-1, 1),
        );
        expect(
          ((nw >> 8) & 0xff) - ((dw >> 8) & 0xff),
          inInclusiveRange(-1, 1),
        );
        expect((nw & 0xff) - (dw & 0xff), inInclusiveRange(-1, 1));
        expect(
          ((nw >>> 24) & 0xff) - ((dw >>> 24) & 0xff),
          inInclusiveRange(-1, 1),
        );
      }
    }
    final span = comp.endFrame - comp.startFrame;
    final progress = span > 0 ? (frame - comp.startFrame) / span : 0.0;
    final canvasRgba = await render(
      (c) => player.draw(
        c,
        ui.Rect.fromLTWH(0, 0, size.toDouble(), size.toDouble()),
        progress,
        useFrameRate: false,
      ),
      size: size,
    );
    var bad = 0;
    for (var i = 0; i < dartPx.length; i++) {
      final w = dartPx[i];
      final idx = i * 4;
      final dr = ((w >> 16) & 0xff) - canvasRgba[idx];
      final dg = ((w >> 8) & 0xff) - canvasRgba[idx + 1];
      final db = (w & 0xff) - canvasRgba[idx + 2];
      final da = ((w >>> 24) & 0xff) - canvasRgba[idx + 3];
      if (dr.abs() > maxChannelDiff ||
          dg.abs() > maxChannelDiff ||
          db.abs() > maxChannelDiff ||
          da.abs() > maxChannelDiff) {
        bad++;
      }
    }
    // Allow tiny AA perimeter rasterization variance while catching fill/compositing bugs.
    expect(
      bad / dartPx.length,
      lessThan(0.015),
      reason: 'Canvas diverged from Software at $bad/${dartPx.length} pixels',
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

  group('P1-A.1 Track Matte + parent clipMask single-pass coverage', () {
    test('50% opacity precomp mask applies once across two overlapping target paints under matte', () async {
      final doc = _doc(
        [
          _precompLayer(
            1,
            'comp_matte',
            masks: [_rectMask(64, 64, 192, 192, opacity: 50)],
          ),
        ],
        assets: [
          {
            'id': 'comp_matte',
            'layers': [
              // Matte source: opaque circle/rect covering whole masked area.
              _shapeLayer(1, [
                rectangle(128, 128, 220, 220),
                fill([1, 1, 1]),
              ], td: 1),
              // Matte target with two overlapping opaque paints.
              _shapeLayer(2, [
                rectangle(128, 128, 200, 200),
                fill([1, 0, 0]),
                rectangle(128, 128, 180, 180),
                fill([0, 0, 1]),
              ], tt: 1),
            ],
          },
        ],
      );
      final res = await _renderAllBackends(doc);
      // Single-pass 50% mask gives ~128 alpha (double application would give ~192).
      expect(_bgraAlpha(res.dartPx, 128, 128), closeTo(128, 2));
      expect(_rgbaPixel(res.canvasRgba, 128, 128).$4, closeTo(128, 2));
      expect(_bgraAlpha(res.dartPx, 40, 128), 0);
      expect(_rgbaPixel(res.canvasRgba, 40, 128).$4, 0);
    });

    test(
      'dstOut non-overlapping matte still respects 50% parent clipMask',
      () async {
        final doc = _doc(
          [
            _precompLayer(
              1,
              'comp_dstout',
              masks: [_rectMask(64, 64, 192, 192, opacity: 50)],
            ),
          ],
          assets: [
            {
              'id': 'comp_dstout',
              'layers': [
                // Non-overlapping matte source tucked in top-left outside [64..192].
                _shapeLayer(1, [
                  rectangle(20, 20, 20, 20),
                  fill([1, 1, 1]),
                ], td: 1),
                // Inverted alpha matte target with overlapping paints inside [100..220].
                _shapeLayer(2, [
                  rectangle(160, 160, 120, 120),
                  fill([0, 1, 0]),
                  rectangle(160, 160, 100, 100),
                  fill([0, 0, 1]),
                ], tt: 2),
              ],
            },
          ],
        );
        final res = await _renderAllBackends(doc);
        // Inside mask and target [100..192]: alpha ~ 128 (NOT 192 and NOT 255).
        expect(_bgraAlpha(res.dartPx, 150, 150), closeTo(128, 2));
        expect(_rgbaPixel(res.canvasRgba, 150, 150).$4, closeTo(128, 2));
        // Outside mask but inside target (210, 160): clipped to 0!
        expect(_bgraAlpha(res.dartPx, 210, 160), 0);
        expect(_rgbaPixel(res.canvasRgba, 210, 160).$4, 0);
      },
    );
  });

  group('P1-A.2 Inner Shadow mask isolation, overflow lookahead & stride', () {
    test('inner shadow inside masked precomp uses unclipped silhouette with no fake border', () async {
      final doc = _doc(
        [
          _precompLayer(
            1,
            'comp_ishadow',
            masks: [_rectMask(48, 48, 208, 208)],
          ),
        ],
        assets: [
          {
            'id': 'comp_ishadow',
            'layers': [
              _shapeLayer(
                1,
                [
                  rectangle(128, 128, 220, 220),
                  fill([1, 1, 1]),
                ],
                sy: [
                  {
                    'ty': 2,
                    'c': constant([0, 0, 0, 1]),
                    'a': constant(135),
                    'd': constant(16),
                    'bm': constant(1),
                  },
                ],
              ),
            ],
          },
        ],
      );
      final res = await _renderAllBackends(doc);
      // Right inside the mask edge (52, 128): unclipped rect edge is at x=18,
      // far outside, so NO fake inner shadow tint appears at the mask boundary.
      expect(_bgraPixel(res.dartPx, 52, 128), (255, 255, 255, 255));
      expect(_rgbaPixel(res.canvasRgba, 52, 128), (255, 255, 255, 255));
      expect(_bgraAlpha(res.dartPx, 40, 128), 0);
    });

    test('negative x/y silhouette overflow + padded dstStride preserves shadow and guard', () async {
      for (final angle in [45, 135, 225, 315]) {
        final doc = _doc(
          [
            _shapeLayer(
              1,
              [
                // Left/top edges are at -20, -20 outside viewport; bottom/right at +70, +70.
                rectangle(25, 25, 90, 90),
                fill([1, 1, 1]),
              ],
              sy: [
                {
                  'ty': 2,
                  'c': constant([0, 0, 0, 1]),
                  'a': constant(angle),
                  'd': constant(28),
                  'bm': constant(1),
                },
              ],
            ),
          ],
          w: 96,
          h: 96,
        );
        final baseline = await _renderAllBackends(doc, size: 96);

        const stride = 128;
        const guard = 0x55AA33CC;
        final scene = RasterScene.compile(doc, const FastLottieOptions());
        final ptr = calloc<Uint32>(stride * 96 + 4);
        final words = ptr.asTypedList(stride * 96 + 4);
        final borrowed = NativePixelBuffer.borrowed(ptr, stride * 96);
        try {
          for (final native in [false, true]) {
            final ws = RasterWorkspace(preferNative: native);
            try {
              words.fillRange(0, words.length, guard);
              renderSceneSoftware(
                scene,
                0,
                borrowed,
                96,
                96,
                ws,
                rowStride: stride,
              );
              for (var y = 0; y < 96; y++) {
                expect(
                  words.sublist(y * stride, y * stride + 96),
                  baseline.dartPx.sublist(y * 96, (y + 1) * 96),
                  reason: 'angle=$angle native=$native row=$y stride mismatch',
                );
              }
              for (var i = stride * 96; i < words.length; i++) {
                expect(words[i], guard);
              }
            } finally {
              ws.dispose();
            }
          }
        } finally {
          wsCleanup(scene);
          borrowed.dispose();
          calloc.free(ptr);
        }
      }
    });
  });

  group('P1-A.3 Color gamma, gradient stops & radial math parity', () {
    test(
      '#000000 -> #FFFFFF at t=0.5 gives #BCBCBC matching package:lottie',
      () async {
        final doc = _doc([
          _shapeLayer(1, [
            rectangle(128, 128, 200, 200),
            {
              'ty': 'fl',
              'c': {
                'a': 1,
                'k': [
                  {
                    't': 0,
                    's': [0, 0, 0],
                    'o': {
                      'x': [0],
                      'y': [0],
                    },
                    'i': {
                      'x': [1],
                      'y': [1],
                    },
                  },
                  {
                    't': 60,
                    's': [1, 1, 1],
                  },
                ],
              },
              'o': constant(100),
              'r': 1,
            },
          ]),
        ]);
        final res = await _renderAllBackends(doc, frame: 30, maxChannelDiff: 2);
        final dartPx = _bgraPixel(res.dartPx, 128, 128);
        expect(dartPx, (0xBC, 0xBC, 0xBC, 255));
        expect(_rgbaPixel(res.canvasRgba, 128, 128).$1, closeTo(0xBC, 1));

        final lottie = LottieDrawable(
          LottieComposition.parseJsonBytes(bytes(doc)),
          frameRate: FrameRate.max,
        )..setProgress(0.5);
        final lottieRgba = await render(
          (c) => lottie.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256)),
        );
        expect(_rgbaPixel(lottieRgba, 128, 128).$1, closeTo(0xBC, 1));
      },
    );

    test('opaque white -> transparent black gradient midpoint gives premul [64,64,64,128]', () async {
      final doc = _doc([
        _shapeLayer(1, [
          rectangle(128, 128, 256, 256),
          {
            'ty': 'gf',
            't': 1,
            's': constant([0, 128]),
            'e': constant([256, 128]),
            'g': {
              'p': 2,
              // White at 0 (alpha 1), black at 1 (alpha 0) -> offset midpoint at 0.5
              'k': constant([0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0]),
            },
            'o': constant(100),
            'r': 1,
          },
        ]),
      ]);
      final res = await _renderAllBackends(doc, maxChannelDiff: 2);
      final px = _bgraPixel(res.dartPx, 128, 128);
      expect(px.$1, closeTo(64, 2));
      expect(px.$2, closeTo(64, 2));
      expect(px.$3, closeTo(64, 2));
      expect(px.$4, closeTo(128, 2));
    });

    test(
      'hard-step gradient [0.5: Red, 0.5: Blue] preserves crisp transition',
      () async {
        final doc = _doc([
          _shapeLayer(1, [
            rectangle(128, 128, 256, 256),
            {
              'ty': 'gf',
              't': 1,
              's': constant([0, 128]),
              'e': constant([256, 128]),
              'g': {
                'p': 4,
                'k': constant([
                  0,
                  1,
                  0,
                  0,
                  0.5,
                  1,
                  0,
                  0,
                  0.5,
                  0,
                  0,
                  1,
                  1,
                  0,
                  0,
                  1,
                ]),
              },
              'o': constant(100),
              'r': 1,
            },
          ]),
        ]);
        final res = await _renderAllBackends(doc, maxChannelDiff: 2);
        // Right next to 0.5 boundary: pure Red on left, pure Blue on right.
        expect(_bgraPixel(res.dartPx, 124, 128), (255, 0, 0, 255));
        expect(_bgraPixel(res.dartPx, 132, 128), (0, 0, 255, 255));
        expect(_rgbaPixel(res.canvasRgba, 124, 128), (255, 0, 0, 255));
        expect(_rgbaPixel(res.canvasRgba, 132, 128), (0, 0, 255, 255));
      },
    );

    test(
      'tight-radius radial gradient (r=2px on 256px span) matches C == Dart',
      () async {
        final doc = _doc([
          _shapeLayer(1, [
            rectangle(128, 128, 256, 256),
            {
              'ty': 'gf',
              't': 2,
              's': constant([128, 128]),
              'e': constant([130, 128]),
              'g': {
                'p': 2,
                'k': constant([0, 1, 0, 0, 1, 0, 0, 1]),
              },
              'o': constant(100),
              'r': 1,
            },
          ]),
        ]);
        await _renderAllBackends(
          doc,
          exactNativeDart: false,
          maxChannelDiff: 2,
        );
      },
    );

    test('focal radial gradient honors layer bm=1 Multiply and degenerate bounds safely', () async {
      final doc = _doc([
        // Top layer renders second with layer-level bm=1 Multiply, directly exercising
        // _renderLayerInto -> _renderStyleInto -> _fillFocalGradientSpans(blendMode).
        _shapeLayer(1, [
          rectangle(128, 128, 200, 200),
          {
            'ty': 'gf',
            't': 2,
            'h': constant(60),
            'a': constant(0),
            's': constant([128, 128]),
            'e': constant([208, 128]),
            'g': {
              'p': 2,
              'k': constant([0, 1, 1, 1, 1, 1, 0, 0]),
            },
            'o': constant(100),
            'r': 1,
          },
        ], bm: 1),
        _shapeLayer(2, [
          rectangle(128, 128, 256, 256),
          fill([0, 1, 1]),
        ]),
      ]);
      final res = await _renderAllBackends(
        doc,
        exactNativeDart: false,
        maxChannelDiff: 3,
      );
      // At the focal point (176, 128 = 128 + 0.6*80), gradient is white ->
      // multiplied by cyan [0,255,255] stays cyan (allowing 1px LUT step).
      expect(_bgraPixel(res.dartPx, 176, 128).$1, closeTo(0, 8));
      expect(_bgraPixel(res.dartPx, 176, 128).$2, greaterThan(240));
      expect(_rgbaPixel(res.canvasRgba, 176, 128).$1, closeTo(0, 8));
      // Outer red [1,0,0] at (36, 128) multiplied by cyan [0,1,1] -> black [0,0,0].
      expect(_bgraPixel(res.dartPx, 36, 128).$2, closeTo(0, 4));
      expect(_bgraPixel(res.dartPx, 36, 128).$3, closeTo(0, 4));
      expect(_rgbaPixel(res.canvasRgba, 36, 128).$2, closeTo(0, 4));

      // Zero-radius + h=100 extreme focus must not throw or NaN.
      final deg = _doc([
        _shapeLayer(1, [
          rectangle(128, 128, 128, 128),
          {
            'ty': 'gf',
            't': 2,
            'h': constant(100),
            'a': constant(45),
            's': constant([128, 128]),
            'e': constant([128, 128]),
            'g': {
              'p': 2,
              'k': constant([0, 1, 0, 0, 1, 0, 1, 0]),
            },
            'o': constant(100),
            'r': 1,
          },
        ]),
      ]);
      await _renderAllBackends(deg);
    });
  });

  group('P1-A.4 Fold-back join, Bezier flatness C/Dart parity & dash dots', () {
    test('180-degree fold-back round join draws cap on horizontal and diagonal lines', () async {
      for (final pts in [
        [
          [40.0, 128.0],
          [180.0, 128.0],
          [40.0, 128.0],
        ],
        [
          [40.0, 40.0],
          [180.0, 180.0],
          [40.0, 40.0],
        ],
      ]) {
        final doc = _doc([
          _shapeLayer(1, [
            _bezierShape(
              pts,
              [
                for (final _ in pts) [0, 0],
              ],
              [
                for (final _ in pts) [0, 0],
              ],
              closed: false,
            ),
            stroke()
              ..['lc'] =
                  1 // Butt cap so ONLY round join paints past fold vertex.
              ..['lj'] = 2
              ..['w'] = constant(24),
          ]),
        ]);
        final res = await _renderAllBackends(doc);
        final tx = pts[1][0].toInt() + 5;
        final ty = pts[1][1].toInt() + (pts[1][1] == 128.0 ? 0 : 5);
        expect(_bgraAlpha(res.dartPx, tx, ty), 255);
        expect(_rgbaPixel(res.canvasRgba, tx, ty).$4, 255);
      }
    });

    test('fl_flatten_bezier C kernel matches PolyPath.addCubic on flatness boundary & guards NaN', () {
      const flatnessSq = 0.0625;
      final samples = <List<double>>[
        // Exact boundary near d1 * 0.0625 == 0.0625 -> |3*dy| == 1.0 (c1 at x=10).
        [0, 0, 0, 0, 10, 1.0 / 3.0 + 0.001, 30, 0, -10, 0, 0, 0],
        [0, 0, 0, 0, 10, 1.0 / 3.0 - 0.001, 30, 0, -10, 0, 0, 0],
        [10, 20, 0, 0, 12.5, -31.25, 110, 85, -18.75, 22.1, 0, 0],
      ];
      final transforms = <(double, double, double, double, double, double)?>[
        null,
        (0.75, -0.25, 0.4, 1.2, 13.5, -9.25),
      ];
      for (final raw in samples) {
        final pts = Float32List.fromList(raw);
        for (final closed in [false, true]) {
          for (final t in transforms) {
            final poly = PolyPath();
            poly.beginContour(closed);
            double px(double x, double y) =>
                t == null ? x : t.$1 * x + t.$3 * y + t.$5;
            double py(double x, double y) =>
                t == null ? y : t.$2 * x + t.$4 * y + t.$6;
            poly.addVertex(px(pts[0], pts[1]), py(pts[0], pts[1]));
            for (var step = 1; step <= (closed ? 2 : 1); step++) {
              final p = (step - 1) * 6, k = (step % 2) * 6;
              final ox = pts[p + 4], oy = pts[p + 5];
              final ix = pts[k + 2], iy = pts[k + 3];
              final ex = px(pts[k], pts[k + 1]), ey = py(pts[k], pts[k + 1]);
              if (ox.abs() <= 1e-4 &&
                  oy.abs() <= 1e-4 &&
                  ix.abs() <= 1e-4 &&
                  iy.abs() <= 1e-4) {
                poly.addVertex(ex, ey);
              } else {
                poly.addCubic(
                  px(pts[p], pts[p + 1]),
                  py(pts[p], pts[p + 1]),
                  px(pts[p] + ox, pts[p + 1] + oy),
                  py(pts[p] + ox, pts[p + 1] + oy),
                  px(pts[k] + ix, pts[k + 1] + iy),
                  py(pts[k] + ix, pts[k + 1] + iy),
                  ex,
                  ey,
                  flatnessSq,
                );
              }
            }
            final x = Float64List(4096)..fillRange(0, 4096, -999);
            final y = Float64List(4096)..fillRange(0, 4096, -999);
            final n = flattenBezierNative(
              pts,
              2,
              closed,
              x,
              y,
              0,
              flatnessSq,
              t,
            );
            // Compare raw emitted vertices before PolyPath.endContour() trims a closing duplicate.
            expect(n, poly.vertexCount);
            expect(
              x.sublist(0, n),
              orderedEquals(poly.vx.sublist(0, poly.vertexCount)),
            );
            expect(
              y.sublist(0, n),
              orderedEquals(poly.vy.sublist(0, poly.vertexCount)),
            );
            expect(x[n], -999);
            poly.endContour();
          }
        }
      }

      // Non-finite coords on curved segment must fail cleanly (-2) so caller falls back to Dart.
      final bad = Float32List.fromList([
        0,
        0,
        0,
        0,
        5,
        0,
        10,
        0,
        double.nan,
        0,
        0,
        0,
      ]);
      final gx = Float64List(16)..fillRange(0, 16, -777);
      final gy = Float64List(16)..fillRange(0, 16, -777);
      expect(
        flattenBezierNative(bad, 2, false, gx, gy, 0, flatnessSq, null),
        -2,
      );
      expect(gx.sublist(1), everyElement(-777));
      expect(gy.sublist(1), everyElement(-777));
    });

    test(
      'zero-length dash d=[0, 18] with round cap draws crisp circular dots',
      () async {
        final doc = _doc([
          _shapeLayer(1, [
            _bezierShape(
              [
                [40, 128],
                [216, 128],
              ],
              [
                [0, 0],
                [0, 0],
              ],
              [
                [0, 0],
                [0, 0],
              ],
              closed: false,
            ),
            stroke()
              ..['lc'] = 2
              ..['lj'] = 2
              ..['w'] = constant(8)
              ..['d'] = [
                {'n': 'd', 'v': constant(0)},
                {'n': 'g', 'v': constant(18)},
              ],
          ]),
        ]);
        final res = await _renderAllBackends(doc, maxChannelDiff: 4);
        expect(_bgraAlpha(res.dartPx, 40, 128), 255);
        expect(_bgraAlpha(res.dartPx, 49, 128), 0);
        expect(_bgraAlpha(res.dartPx, 58, 128), 255);
        expect(_rgbaPixel(res.canvasRgba, 49, 128).$4, 0);
        expect(_rgbaPixel(res.canvasRgba, 58, 128).$4, 255);
      },
    );
  });

  group('P1-A.5 Precomp unified timing, negative-stretch bounds & dual-FPS sticker', () {
    test('delayed st=20 precomp stays hidden before frame 20 and samples child at frame-st', () async {
      final doc = _doc(
        [_precompLayer(1, 'comp_delay', ip: 20, op: 50, st: 20)],
        assets: [
          {
            'id': 'comp_delay',
            'layers': [
              _shapeLayer(
                1,
                [
                  rectangle(128, 128, 80, 80),
                  fill([1, 0, 0]),
                ],
                ks: {
                  'a': constant([0, 0]),
                  'p': animated([0, 0], [100, 0]),
                  's': constant([100, 100]),
                  'r': constant(0),
                  'o': constant(100),
                },
              ),
            ],
          },
        ],
      );
      final before = await _renderAllBackends(doc, frame: 10);
      expect(_bgraAlpha(before.dartPx, 128, 128), 0);
      expect(_rgbaPixel(before.canvasRgba, 128, 128).$4, 0);

      // At root frame 35, child frame is 35 - 20 = 15 (~25% of [0, 59] -> x ~ +25).
      final active = await _renderAllBackends(doc, frame: 35);
      expect(_bgraAlpha(active.dartPx, 153, 128), 255);
    });

    test(
      'tm + sr + st replaces sr (Option B, matching package:lottie)',
      () async {
        final doc = _doc(
          [
            _precompLayer(
              1,
              'comp_tm',
              ip: 0,
              op: 60,
              st: 12,
              sr: 2,
              tm: animated(0.0, 0.99),
            ),
          ],
          assets: [
            {
              'id': 'comp_tm',
              'layers': [
                _shapeLayer(
                  1,
                  [
                    rectangle(60, 128, 50, 50),
                    fill([0.1, 0.8, 0.3]),
                  ],
                  ip: 0,
                  op: 60,
                  ks: {
                    'a': constant([0, 0]),
                    'p': animated([0, 0], [120, 0]),
                    's': constant([100, 100]),
                    'r': constant(0),
                    'o': constant(100),
                  },
                ),
              ],
            },
          ],
        );
        final res = await _renderAllBackends(doc, frame: 30);
        final lottie = LottieDrawable(
          LottieComposition.parseJsonBytes(bytes(doc)),
          frameRate: FrameRate.max,
        )..setProgress(0.5);
        final lottieRgba = await render(
          (c) => lottie.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256)),
        );
        var diff = 0;
        for (var i = 0; i < lottieRgba.length; i++) {
          diff += (res.canvasRgba[i] - lottieRgba[i]).abs();
        }
        expect(diff / lottieRgba.length, lessThan(0.5));
      },
    );

    test('non-zero asset.ip offsets precomp timeline consistently across C, Dart, and Canvas', () async {
      final doc = _doc(
        [_precompLayer(1, 'comp_ip', ip: 0, op: 60, st: 0)],
        assets: [
          {
            'id': 'comp_ip',
            'ip': 10,
            'op': 70,
            'layers': [
              _shapeLayer(
                1,
                [
                  rectangle(60, 128, 40, 40),
                  fill([0.9, 0.2, 0.5]),
                ],
                ip: 10,
                op: 70,
                ks: {
                  'a': constant([0, 0]),
                  'p': {
                    'a': 1,
                    'k': [
                      {
                        't': 10,
                        's': [0, 0],
                        'o': {
                          'x': [0],
                          'y': [0],
                        },
                        'i': {
                          'x': [1],
                          'y': [1],
                        },
                      },
                      {
                        't': 70,
                        's': [120, 0],
                      },
                    ],
                  },
                  's': constant([100, 100]),
                  'r': constant(0),
                  'o': constant(100),
                },
              ),
            ],
          },
        ],
      );
      final res = await _renderAllBackends(doc, frame: 30);
      // Child frame = 30 (one-third across [10..70]) -> x offset ~ 40, center ~ 100.
      expect(_bgraAlpha(res.dartPx, 100, 128), 255);
      expect(_bgraAlpha(res.dartPx, 60, 128), 0);
    });

    test(
      'negative stretch=-1 half-open boundary checks isStatic accurately',
      () async {
        // Root [10, 30), precomp [10, 30) with st=30, sr=-1 -> child image is (0, 20].
        Map<String, dynamic> negDoc(double childOp) => _doc(
          [_precompLayer(1, 'comp_neg', ip: 10, op: 30, st: 30, sr: -1)],
          ip: 10,
          op: 30,
          assets: [
            {
              'id': 'comp_neg',
              'layers': [
                _shapeLayer(
                  1,
                  [
                    rectangle(128, 128, 120, 120),
                    fill([0.2, 0.4, 1.0]),
                  ],
                  ip: 0,
                  op: childOp,
                ),
              ],
            },
          ],
        );

        // Child [0, 20): at frame=10, cf=20 which is OUTSIDE half-open [0, 20)!
        final unstableComp = FastLottieComposition.fromJson(negDoc(20));
        expect(unstableComp.isStatic, isFalse);
        final f10 = await _renderAllBackends(negDoc(20), frame: 10);
        final f11 = await _renderAllBackends(negDoc(20), frame: 11);
        expect(_bgraAlpha(f10.dartPx, 128, 128), 0);
        expect(_bgraAlpha(f11.dartPx, 128, 128), 255);

        // Child [0, 21): strictly contains (0, 20], so composition IS static.
        final stableComp = FastLottieComposition.fromJson(negDoc(21));
        expect(stableComp.isStatic, isTrue);
        final s10 = await _renderAllBackends(negDoc(21), frame: 10);
        final s29 = await _renderAllBackends(negDoc(21), frame: 29);
        expect(s10.dartPx, orderedEquals(s29.dartPx));
      },
    );

    test(
      'dual-FPS NotoEmoji emoji_u1f460.tgs matches across C, Dart, and Canvas',
      () async {
        final gz = File('test/fixtures/tgs/NotoEmoji/emoji_u1f460.tgs')
            .readAsBytesSync();
        final doc = jsonDecode(
          utf8.decode(decodeLottieBytes(gz)),
        ) as Map<String, dynamic>;
        for (final f in [8.0, 32.0, 64.0]) {
          await _renderAllBackends(doc, frame: f, maxChannelDiff: 12);
        }
      },
    );
  });

  group('P1-A.6 MergePaths >= 3 left-fold evaluation', () {
    test('discriminating Intersect (A disjoint B, C subset B) produces empty result', () async {
      final doc = _doc([
        _shapeLayer(1, [
          rectangle(60, 128, 60, 120), // A: x=[30..90]
          rectangle(180, 128, 80, 120), // B: x=[140..220] (disjoint from A)
          rectangle(180, 128, 40, 60), // C: x=[160..200] (strictly inside B)
          {'ty': 'mm', 'mm': 4},
          fill([1, 0, 0]),
        ]),
      ]);
      final res = await _renderAllBackends(doc);
      for (final px in res.dartPx) {
        expect(px >>> 24, 0);
      }
      for (var i = 3; i < res.canvasRgba.length; i += 4) {
        expect(res.canvasRgba[i], 0);
      }
    });

    test(
      'asymmetric Subtract (A \\ B \\ C) preserves exact left-fold geometry',
      () async {
        final doc = _doc([
          _shapeLayer(1, [
            rectangle(128, 128, 160, 160), // A: [48..208] x [48..208]
            rectangle(168, 88, 100, 100), // B: [118..218] x [38..138]
            rectangle(88, 168, 100, 100), // C: [38..138] x [118..218]
            {'ty': 'mm', 'mm': 3},
            fill([0, 0.6, 1]),
          ]),
        ]);
        final res = await _renderAllBackends(doc);
        // In A only -> opaque.
        expect(_bgraAlpha(res.dartPx, 70, 70), 255);
        expect(_rgbaPixel(res.canvasRgba, 70, 70).$4, 255);
        // Inside B -> cut out.
        expect(_bgraAlpha(res.dartPx, 170, 80), 0);
        expect(_rgbaPixel(res.canvasRgba, 170, 80).$4, 0);
        // Inside C -> cut out.
        expect(_bgraAlpha(res.dartPx, 80, 170), 0);
        expect(_rgbaPixel(res.canvasRgba, 80, 170).$4, 0);
      },
    );
  });

  group('P1-A.7 Reverse Bezier, Transform p split easing, Canvas multi-mask & spatial loop', () {
    test(
      'open and closed Reverse Bezier (sh.d=3) reverses Trim Paths progression',
      () async {
        for (final closed in [false, true]) {
          final doc = _doc([
            _shapeLayer(1, [
              _bezierShape(
                [
                  [40, 40],
                  [216, 40],
                  [216, 216],
                ],
                [
                  [0, 0],
                  [-20, 0],
                  [0, -20],
                ],
                [
                  [20, 0],
                  [0, 20],
                  [-20, 0],
                ],
                closed: closed,
                d: 3,
              ),
              trim(constant(0), constant(45), constant(0)),
              stroke()..['w'] = constant(10),
            ]),
          ]);
          final res = await _renderAllBackends(doc, maxChannelDiff: 4);
          // Reversed open/closed starts from last vertex (216, 216) rather than (40, 40).
          expect(_bgraAlpha(res.dartPx, 216, 216), 255);
          expect(_rgbaPixel(res.canvasRgba, 216, 216).$4, 255);
          if (!closed) {
            expect(_bgraAlpha(res.dartPx, 40, 40), 0);
            expect(_rgbaPixel(res.canvasRgba, 40, 40).$4, 0);
          }
        }
      },
    );

    test(
      'transform p split easing applies distinct X and Y timing curves',
      () async {
        final doc = _doc([
          _shapeLayer(
            1,
            [
              rectangle(0, 0, 30, 30),
              fill([1, 0.2, 0.2]),
            ],
            ks: {
              'a': constant([0, 0]),
              'p': {
                'a': 1,
                'k': [
                  {
                    't': 0,
                    's': [40, 40],
                    'o': {
                      'x': [0.05, 0.95],
                      'y': [1.0, 0.0],
                    },
                    'i': {
                      'x': [0.2, 0.99],
                      'y': [1.0, 0.05],
                    },
                  },
                  {
                    't': 60,
                    's': [200, 200],
                  },
                ],
              },
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          ),
        ]);
        // At frame 30 (midpoint): X jumped near 200 while Y stayed near 40.
        final res = await _renderAllBackends(doc, frame: 30);
        expect(_bgraAlpha(res.dartPx, 195, 45), 255);
        expect(_rgbaPixel(res.canvasRgba, 195, 45).$4, 255);
        expect(_bgraAlpha(res.dartPx, 120, 120), 0);
      },
    );

    test('Canvas multi-mask handles inverted + intersect and fractional mask opacity', () async {
      final invIntersectDoc = _doc([
        _shapeLayer(
          1,
          [
            rectangle(128, 128, 256, 256),
            fill([0.2, 0.7, 1.0]),
          ],
          masks: [
            _rectMask(80, 80, 176, 176, mode: 'a', inv: true),
            _rectMask(40, 40, 216, 216, mode: 'i'),
          ],
        ),
      ]);
      final r1 = await _renderAllBackends(invIntersectDoc);
      expect(_bgraAlpha(r1.dartPx, 128, 128), 0);
      expect(_rgbaPixel(r1.canvasRgba, 128, 128).$4, 0);
      expect(_bgraAlpha(r1.dartPx, 60, 128), 255);
      expect(_rgbaPixel(r1.canvasRgba, 60, 128).$4, 255);
      expect(_bgraAlpha(r1.dartPx, 20, 128), 0);

      final opacityDoc = _doc([
        _shapeLayer(
          1,
          [
            rectangle(128, 128, 256, 256),
            fill([1, 0.5, 0]),
          ],
          masks: [
            _rectMask(40, 40, 160, 216, mode: 'a', opacity: 50),
            _rectMask(100, 40, 220, 216, mode: 'i', opacity: 50),
          ],
        ),
      ]);
      final r2 = await _renderAllBackends(opacityDoc);
      // Overlap of two 50% intersect masks -> 25% coverage (~64 alpha).
      expect(_bgraAlpha(r2.dartPx, 130, 128), closeTo(64, 2));
      expect(_rgbaPixel(r2.canvasRgba, 130, 128).$4, closeTo(64, 2));
      expect(_bgraAlpha(r2.dartPx, 70, 128), 0);
      expect(_rgbaPixel(r2.canvasRgba, 70, 128).$4, 0);
    });

    test('closed spatial position loop (s == e with non-zero to/ti) animates along curve', () async {
      final doc = _doc([
        _shapeLayer(
          1,
          [
            rectangle(0, 0, 30, 30),
            fill([0, 1, 0]),
          ],
          ks: {
            'a': constant([0, 0]),
            'p': {
              'a': 1,
              'k': [
                {
                  't': 0,
                  's': [100, 128],
                  'o': {'x': 0, 'y': 0},
                  'i': {'x': 1, 'y': 1},
                  'to': [140, -60],
                  'ti': [140, 60],
                },
                {
                  't': 60,
                  's': [100, 128],
                },
              ],
            },
            's': constant([100, 100]),
            'r': constant(0),
            'o': constant(100),
          },
        ),
      ]);
      final res = await _renderAllBackends(doc, frame: 30);
      // Midpoint of cubic loop extends past x = 200; start (100, 128) is empty.
      expect(_bgraAlpha(res.dartPx, 200, 128), 255);
      expect(_rgbaPixel(res.canvasRgba, 200, 128).$4, 255);
      expect(_bgraAlpha(res.dartPx, 100, 128), 0);
    });

    test('PR #4 review fixes: non-monotonic & hard-step alpha gradients, tm+asset.ip, multi-paint complex mask, snapshot v3, extreme radial/shadow', () async {
      // 1. Non-monotonic color stops [0.6 Red, 0.4 Green, 1.0 Blue] must not stall colorCursor on Canvas.
      final nonMonoDoc = _doc([
        _shapeLayer(1, [
          rectangle(128, 128, 256, 256),
          {
            'ty': 'gf',
            'o': constant(100),
            'r': 1,
            't': 1,
            's': constant([0, 128]),
            'e': constant([256, 128]),
            'g': {
              'p': 3,
              'k': constant([
                0.6,
                1.0,
                0.0,
                0.0,
                0.4,
                0.0,
                1.0,
                0.0,
                1.0,
                0.0,
                0.0,
                1.0,
              ]),
            },
          },
        ]),
      ]);
      final nonMono = await _renderAllBackends(nonMonoDoc);
      // At x = 250 (t ~ 0.97), both Software and Canvas should be strongly blue, not stalled on red.
      expect(_bgraPixel(nonMono.dartPx, 250, 128).$3, greaterThan(220));
      expect(_rgbaPixel(nonMono.canvasRgba, 250, 128).$3, greaterThan(220));
      expect(_rgbaPixel(nonMono.canvasRgba, 250, 128).$1, lessThan(20));

      // 2. Hard-step alpha stops [0:1, 0.5:1, 0.5:0, 1:0] must match between Software and Canvas.
      final hardAlphaDoc = _doc([
        _shapeLayer(1, [
          rectangle(128, 128, 256, 256),
          {
            'ty': 'gf',
            'o': constant(100),
            'r': 1,
            't': 1,
            's': constant([0, 128]),
            'e': constant([256, 128]),
            'g': {
              'p': 2,
              'k': constant([
                0.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                1.0,
                0.0,
                1.0,
                0.5,
                1.0,
                0.5,
                0.0,
                1.0,
                0.0,
              ]),
            },
          },
        ]),
      ]);
      final hardAlpha = await _renderAllBackends(hardAlphaDoc);
      expect(_bgraAlpha(hardAlpha.dartPx, 100, 128), 255);
      expect(_rgbaPixel(hardAlpha.canvasRgba, 100, 128).$4, 255);
      expect(_bgraAlpha(hardAlpha.dartPx, 140, 128), 0);
      expect(_rgbaPixel(hardAlpha.canvasRgba, 140, 128).$4, 0);

      // 3. Precomp asset['ip'] != 0 combined with tm (timeRemap) must evaluate tm * fps (not minus asset.ip).
      final tmIpDoc = _doc(
        [
          {
            'ty': 0,
            'ind': 1,
            'refId': 'pre_ip_tm',
            'ip': 0,
            'op': 60,
            'st': 0,
            'w': 256,
            'h': 256,
            'tm': constant(
              15 / 60,
            ), // 0.25s -> frame 15 inside precomp [10, 70)
            'ks': {
              'a': constant([0, 0]),
              'p': constant([0, 0]),
              's': constant([100, 100]),
              'r': constant(0),
              'o': constant(100),
            },
          },
        ],
        assets: [
          {
            'id': 'pre_ip_tm',
            'ip': 10,
            'op': 70,
            'fr': 60,
            'layers': [
              {
                ..._shapeLayer(1, [
                  rectangle(128, 128, 100, 100),
                  fill([0, 1, 0]),
                ]),
                'ip': 10,
                'op': 70,
              },
            ],
          },
        ],
      );
      final tmIp = await _renderAllBackends(tmIpDoc, frame: 0);
      expect(_bgraAlpha(tmIp.dartPx, 128, 128), 255);
      expect(_rgbaPixel(tmIp.canvasRgba, 128, 128).$4, 255);

      // 4. Multi-paint shape layer under fractional-opacity complex mask must isolate once (Blue @ 25%, not Purple).
      final multiPaintComplexMaskDoc = _doc([
        _shapeLayer(
          1,
          [
            {
              'ty': 'gr',
              'it': [
                rectangle(128, 128, 256, 256),
                fill([1, 0, 0]),
              ],
            },
            {
              'ty': 'gr',
              'it': [
                rectangle(128, 128, 256, 256),
                fill([0, 0, 1]),
              ],
            },
          ],
          masks: [
            _rectMask(40, 40, 180, 216, mode: 'a', opacity: 50),
            _rectMask(80, 40, 220, 216, mode: 'i', opacity: 50),
          ],
        ),
      ]);
      final mp = await _renderAllBackends(multiPaintComplexMaskDoc);
      final dartPx = _bgraPixel(mp.dartPx, 130, 128);
      final canvasPx = _rgbaPixel(mp.canvasRgba, 130, 128);
      // Lottie paints shapes[0] (Red) on top of shapes[1] (Blue):
      // isolated once -> pure Red @ 25%, zero Blue bleed-through.
      expect(dartPx.$3, 0);
      expect(canvasPx.$3, 0);
      expect(dartPx.$4, closeTo(64, 2));
      expect(canvasPx.$4, closeTo(64, 2));
      expect(dartPx.$1, closeTo(canvasPx.$1, 2));

      // 5. Extreme innerShadow offset must not wrap or trigger UB/crash.
      final extremeShadowDoc = _doc([
        {
          ..._shapeLayer(1, [
            rectangle(128, 128, 120, 120),
            fill([0.2, 0.8, 0.3]),
          ]),
          'sy': [
            {
              'ty': 2,
              'c': constant([0, 0, 0, 1]),
              'o': constant(80),
              'a': constant(0),
              'd': constant(1e12),
              's': constant(0),
            },
          ],
        },
      ]);
      final extremeShadow = await _renderAllBackends(extremeShadowDoc);
      expect(_bgraAlpha(extremeShadow.dartPx, 128, 128), 255);
      expect(extremeShadow.nativePx, extremeShadow.dartPx);

      // 6. Snapshot v3 preserves reversed Bezier and rejects legacy version 2.
      final revDoc = _doc([
        _shapeLayer(1, [
          {
            'ty': 'sh',
            'd': 3,
            'ks': {
              'a': 0,
              'k': {
                'c': false,
                'v': [
                  [40, 128],
                  [216, 128],
                ],
                'i': [
                  [0, 0],
                  [0, 0],
                ],
                'o': [
                  [0, 0],
                  [0, 0],
                ],
              },
            },
          },
          stroke()..['w'] = constant(12),
        ]),
      ]);
      final revComp = FastLottieComposition.fromJson(revDoc);
      final snap = debugEncodeCompiledComposition(revComp);
      expect(snap[4], 3);
      final legacyV2 = Uint8List.fromList(snap)..[4] = 2;
      expect(
        () => debugDecodeCompiledComposition(legacyV2, deferPlayback: true),
        throwsFormatException,
      );
      final restoredRev = debugDecodeCompiledComposition(
        snap,
        deferPlayback: true,
      ).composition;
      expect(restoredRev.contentKey, revComp.contentKey);

      // 7. Native C radial gradient_index_f32 must handle NaN identically to Dart (lut[1023], no UB/OOB).
      final dstC = NativePixelBuffer(16);
      final dstDart = Uint32List(16);
      final lut = NativePixelBuffer(1024);
      final rle = RleSpans(initialSpans: 2);
      try {
        lut.typedList.fillRange(0, 1024, 0xFF112233);
        lut.typedList[0] = 0xFF0000FF;
        lut.typedList[1023] = 0xFF00FF00;
        // Single span at y=0, x=0, len=8 (exercises 4-wide gradient_sqrt4 + gradient_index_f32), cov=255.
        rle.data[0] = 0;
        rle.data[1] = (8 << 8) | 255;
        rle.spanCount = 1;
        final ran = nativeGradientSpans(
          dstC,
          0,
          0,
          8,
          rle.buffer,
          1,
          lut,
          255,
          0,
          true,
          1,
          0,
          0,
          1,
          double.nan,
          0,
          0,
          0,
          10,
          0,
        );
        expect(ran, isTrue);
        SwarBlender.fillRadialGradientSpans(
          dstDart,
          0,
          0,
          8,
          rle,
          lut.typedList,
          255,
          1,
          0,
          0,
          1,
          double.nan,
          0,
          0,
          0,
          10,
          0,
        );
        expect(dstC.typedList.sublist(0, 8), dstDart.sublist(0, 8));
        expect(dstC.typedList.sublist(0, 8), everyElement(0xFF00FF00));
      } finally {
        dstC.dispose();
        lut.dispose();
        rle.dispose();
      }
    });
  });
}

void wsCleanup(RasterScene scene) {
  scene.dispose();
}
