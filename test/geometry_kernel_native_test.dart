import 'dart:math' as math;
import 'dart:typed_data';

import 'package:fastlottie/src/platform/geometry_kernel_io.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('native stroke respects sliced arrays and output guards', () {
    final sourceX = Float64List.fromList([-261, 0, 10, -261]);
    final sourceY = Float64List.fromList([-261, 0, 0, -261]);
    final starts = Int32List.fromList([-261, 0, -261]);
    final ends = Int32List.fromList([-261, 2, -261]);
    final closed = Uint8List.fromList([26, 0, 26]);
    for (final cap in [1, 2, 3]) {
      final x = Float64List(130)..fillRange(0, 130, -261);
      final y = Float64List(130)..fillRange(0, 130, -261);
      final outputStarts = Int32List(4)..fillRange(0, 4, -261);
      final outputEnds = Int32List(4)..fillRange(0, 4, -261);
      final scratch = Float64List(10)..fillRange(0, 10, -261);
      int run(int capacity) => expandStrokeNative(
        Float64List.sublistView(sourceX, 1, 3),
        Float64List.sublistView(sourceY, 1, 3),
        2,
        Int32List.sublistView(starts, 1, 2),
        Int32List.sublistView(ends, 1, 2),
        Uint8List.sublistView(closed, 1, 2),
        1,
        1,
        cap,
        2,
        4,
        .25,
        Float64List.sublistView(scratch, 1, 9),
        Float64List.sublistView(x, 1, capacity + 1),
        Float64List.sublistView(y, 1, capacity + 1),
        Int32List.sublistView(outputStarts, 1, 3),
        Int32List.sublistView(outputEnds, 1, 3),
      );
      expect(run(0), -1);
      final result = run(128), n = result & 0xffffffff;
      expect(result >>> 32, 1);
      expect(outputStarts[1], 0);
      expect(outputEnds[1], n);
      if (cap != 2) {
        final extra = cap == 3 ? 1.0 : 0.0;
        expect(x.sublist(1, n + 1), [-extra, 10 + extra, 10 + extra, -extra]);
        expect(y.sublist(1, n + 1), [1, 1, -1, -1]);
      }
      expect(x.first, -261);
      expect(x.last, -261);
      expect(y.first, -261);
      expect(y.last, -261);
      expect(scratch.first, -261);
      expect(scratch.last, -261);
      expect(outputStarts.first, -261);
      expect(outputStarts.last, -261);
      expect(outputEnds.first, -261);
      expect(outputEnds.last, -261);
      expect(sourceX, [-261, 0, 10, -261]);
      sourceX[1] = double.infinity;
      expect(run(128), -2);
      sourceX[1] = 0;
      ends[1] = 3;
      expect(run(128), -2);
      ends[1] = 2;
    }
  });

  test(
    'native flatten matches scalar vertices with sliced input and output',
    () {
      final rng = math.Random(261);
      for (var sample = 0; sample < 250; sample++) {
        final n = 1 + rng.nextInt(24);
        final source = Float32List(3 + n * 6 + 7);
        final pts = Float32List.sublistView(source, 3, 3 + n * 6);
        for (var i = 0; i < pts.length; i++) {
          pts[i] = (rng.nextDouble() - .5) * 100;
        }
        if (sample.isEven) {
          for (var i = 0; i < n; i++) {
            pts.fillRange(i * 6 + 2, i * 6 + 6, 0);
          }
        }
        final closed = sample % 3 != 0;
        final transform = sample % 4 == 0
            ? null
            : (rng.nextDouble(), -.3, .6, rng.nextDouble(), 12.0, -7.0);
        final expected = <(double, double)>[];
        void vertex(double x, double y) {
          if (expected.isNotEmpty) {
            final (px, py) = expected.last;
            if ((x - px).abs() + (y - py).abs() < 1e-7) return;
          }
          expected.add((x, y));
        }

        void cubic(
          double x0,
          double y0,
          double x1,
          double y1,
          double x2,
          double y2,
          double x3,
          double y3,
          int depth,
        ) {
          if (depth >= 10) {
            vertex(x3, y3);
            return;
          }
          final dx1 = x1 - (2.0 * x0 + x3) / 3.0;
          final dy1 = y1 - (2.0 * y0 + y3) / 3.0;
          final dx2 = x2 - (x0 + 2.0 * x3) / 3.0;
          final dy2 = y2 - (y0 + 2.0 * y3) / 3.0;
          final d = math.max(dx1 * dx1 + dy1 * dy1, dx2 * dx2 + dy2 * dy2);
          if (d * .5625 <= .0625) {
            vertex(x3, y3);
            return;
          }
          final x01 = (x0 + x1) * .5, y01 = (y0 + y1) * .5;
          final x12 = (x1 + x2) * .5, y12 = (y1 + y2) * .5;
          final x23 = (x2 + x3) * .5, y23 = (y2 + y3) * .5;
          final x012 = (x01 + x12) * .5, y012 = (y01 + y12) * .5;
          final x123 = (x12 + x23) * .5, y123 = (y12 + y23) * .5;
          final mx = (x012 + x123) * .5, my = (y012 + y123) * .5;
          cubic(x0, y0, x01, y01, x012, y012, mx, my, depth + 1);
          cubic(mx, my, x123, y123, x23, y23, x3, y3, depth + 1);
        }

        (double, double) point(double x, double y) {
          if (transform == null) return (x, y);
          final (a, b, c, d, tx, ty) = transform;
          return (a * x + c * y + tx, b * x + d * y + ty);
        }

        final first = point(pts[0], pts[1]);
        vertex(first.$1, first.$2);
        for (var step = 1; step <= (closed ? n : n - 1); step++) {
          final p = (step - 1) * 6, k = (step % n) * 6;
          final ox = pts[p + 4],
              oy = pts[p + 5],
              ix = pts[k + 2],
              iy = pts[k + 3];
          final end = point(pts[k], pts[k + 1]);
          if (ox.abs() <= 1e-4 &&
              oy.abs() <= 1e-4 &&
              ix.abs() <= 1e-4 &&
              iy.abs() <= 1e-4) {
            vertex(end.$1, end.$2);
          } else {
            final start = point(pts[p], pts[p + 1]);
            final c1 = point(pts[p] + ox, pts[p + 1] + oy);
            final c2 = point(pts[k] + ix, pts[k + 1] + iy);
            cubic(
              start.$1,
              start.$2,
              c1.$1,
              c1.$2,
              c2.$1,
              c2.$2,
              end.$1,
              end.$2,
              0,
            );
          }
        }
        final x = Float64List(4103)..fillRange(0, 4103, -261);
        final y = Float64List(4105)..fillRange(0, 4105, -261);
        final ex = Float64List.fromList(x), ey = Float64List.fromList(y);
        final outputX = Float64List.sublistView(x, 2, 4101);
        final outputY = Float64List.sublistView(y, 4, 4103);
        final after = flattenBezierNative(
          pts,
          n,
          closed,
          outputX,
          outputY,
          3,
          .0625,
          transform,
        );
        expect(after, expected.length + 3);
        for (var i = 0; i < expected.length; i++) {
          ex[i + 5] = expected[i].$1;
          ey[i + 7] = expected[i].$2;
        }
        expect(Uint8List.sublistView(x), Uint8List.sublistView(ex));
        expect(Uint8List.sublistView(y), Uint8List.sublistView(ey));
      }
    },
  );

  test('capacity and work limits preserve guards and permit fallback', () {
    final pts = Float32List.fromList([0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0]);
    final x = Float64List(4)..fillRange(0, 4, -261);
    final y = Float64List(4)..fillRange(0, 4, -261);
    expect(flattenBezierNative(pts, 2, false, x, y, 3, .0625, null), -1);
    expect(x.sublist(0, 3), everyElement(-261));
    expect(flattenBezierNative(pts, 129, false, x, y, 0, .0625, null), -2);
    expect(flattenBezierNative(pts, 2, false, x, y, -1, .0625, null), -2);
    pts[4] = double.infinity;
    expect(
      flattenBezierNative(pts, 2, false, x, y, 0, .0625, (0, 0, 0, 0, 0, 0)),
      -2,
    );
    final large = Float32List(128 * 6);
    for (var i = 0; i < 128; i++) {
      large[i * 6] = i.toDouble();
      large[i * 6 + 3] = 1e8;
      large[i * 6 + 5] = -1e8;
    }
    final a = Float64List(8194)..fillRange(0, 8194, -261);
    final b = Float64List(8194)..fillRange(0, 8194, -261);
    expect(flattenBezierNative(large, 128, true, a, b, 1, 0, null), -2);
    expect(a.first, -261);
    expect(a.last, -261);
    expect(b.first, -261);
    expect(b.last, -261);
  });
}
