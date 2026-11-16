import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/geometry_kernel_io.dart' as geometry;
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;
import 'path_ops_test.dart' show animated, constant, scene, stroke;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'native stroke matches caps, joins, degenerate contours and animated width',
    () {
      for (final points in [
        [
          [40.0, 80.0],
        ],
        [
          [40.0, 80.0],
          [40.0, 80.0],
        ],
        [
          [40.0, 80.0],
          [180.0, 80.0],
          [40.01, 80.001],
          [90.0, 190.0],
        ],
      ]) {
        for (final closed in [false, true]) {
          for (final cap in [1, 2, 3]) {
            for (final join in [1, 2, 3]) {
              final source = scene([
                {
                  'ty': 'sh',
                  'ks': constant({
                    'v': points,
                    'i': [
                      for (final _ in points) [0, 0],
                    ],
                    'o': [
                      for (final _ in points) [0, 0],
                    ],
                    'c': closed,
                  }),
                },
                stroke()
                  ..['lc'] = cap
                  ..['lj'] = join
                  ..['ml'] = 1.1
                  ..['w'] = animated(2, 17),
              ]);
              final composition = FastLottieComposition.fromJson(source);
              final candidate = FastLottieSoftwareSession(
                composition,
                pixelWidth: 96,
                pixelHeight: 96,
                nativeStroke: true,
              );
              final control = FastLottieSoftwareSession(
                composition,
                pixelWidth: 96,
                pixelHeight: 96,
              );
              try {
                for (final frame in [0.0, 29.5, 59.0, 0.0]) {
                  expect(
                    candidate.renderFrame(frame),
                    orderedEquals(control.renderFrame(frame)),
                    reason: 'cap=$cap join=$join closed=$closed frame=$frame',
                  );
                }
              } finally {
                candidate.dispose();
                control.dispose();
              }
            }
          }
        }
      }
    },
  );

  test(
    'native stroke preserves rendered pixels across sizes and reverse seeks',
    () {
      final before = geometry.nativeStrokeCalls;
      for (final name in [
        'static',
        'icon',
        'features',
        'many_shapes',
        'morph',
      ]) {
        final composition = FastLottieComposition.fromJson(fixture(name));
        for (final size in [73, 112, 256]) {
          final candidate = FastLottieSoftwareSession(
            composition,
            pixelWidth: size,
            pixelHeight: size,
            nativeStroke: true,
          );
          final control = FastLottieSoftwareSession(
            composition,
            pixelWidth: size,
            pixelHeight: size,
          );
          try {
            for (final frame in [0.0, 28.5, 14.0, 59.0, 0.0]) {
              expect(
                candidate.renderFrame(frame),
                orderedEquals(control.renderFrame(frame)),
                reason: '$name at $size frame $frame',
              );
            }
          } finally {
            candidate.dispose();
            control.dispose();
          }
        }
      }
      expect(geometry.nativeStrokeCalls, greaterThan(before));
    },
  );

  test(
    'borrowed geometry preserves exact pixels and falls back for larger clips',
    () {
      var borrowed = 0, copied = 0;
      for (final name in [
        'static',
        'icon',
        'features',
        'many_shapes',
        'morph',
      ]) {
        final composition = FastLottieComposition.fromJson(fixture(name));
        for (final size in [73, 112, 256]) {
          final candidate = FastLottieSoftwareSession(
            composition,
            pixelWidth: size,
            pixelHeight: size,
            borrowGeometry: true,
          );
          final control = FastLottieSoftwareSession(
            composition,
            pixelWidth: size,
            pixelHeight: size,
          );
          try {
            for (final frame in [0.0, 28.5, 14.0, 59.0, 0.0]) {
              final a = candidate.renderFrame(frame),
                  b = control.renderFrame(frame);
              expect(
                a,
                orderedEquals(b),
                reason: '$name at $size frame $frame',
              );
            }
            borrowed += candidate.borrowedCoverageDraws;
            copied += candidate.copiedCoverageDraws;
          } finally {
            candidate.dispose();
            control.dispose();
          }
        }
      }
      expect(borrowed, greaterThan(0));
      expect(copied, greaterThan(0));
    },
  );

  test(
    'native coverage and retained spans match Dart across seeks and sizes',
    () {
      for (final name in [
        'static',
        'icon',
        'features',
        'many_shapes',
        'morph',
      ]) {
        final composition = FastLottieComposition.fromJson(fixture(name));
        for (final (width, height) in [(127, 105), (256, 256), (513, 513)]) {
          final native = FastLottieSoftwareSession(
            composition,
            pixelWidth: width,
            pixelHeight: height,
          );
          final reference = FastLottieSoftwareSession(
            composition,
            pixelWidth: width,
            pixelHeight: height,
            preferNative: false,
            retainCoverage: false,
          );
          try {
            for (final frame in [0.0, 28.5, 14.0, 59.0, 0.0, 59.0]) {
              final a = native.renderFrame(frame);
              final b = reference.renderFrame(frame);
              for (var i = 0; i < a.length; i++) {
                if (a[i] != b[i]) {
                  fail(
                    '$name ${width}x$height frame $frame pixel $i: '
                    '${a[i].toRadixString(16)} != ${b[i].toRadixString(16)}',
                  );
                }
              }
            }
          } finally {
            native.dispose();
            reference.dispose();
          }
        }
      }
    },
    skip: !isSimdSupported,
  );
}
