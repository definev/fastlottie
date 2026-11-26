import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/platform/geometry_kernel_io.dart' as geometry;
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;
import 'path_ops_test.dart' show animated, constant, matteScene, scene, stroke;

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
        for (final size in [73, 112, 256, 512]) {
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
        for (final size in [73, 112, 256, 512]) {
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

  test('default native common paths are active and preserve exact pixels', () {
    final composition = FastLottieComposition.fromJson(fixture('features'));
    final candidate = FastLottieSoftwareSession(
      composition,
      pixelWidth: 112,
      pixelHeight: 112,
    );
    final reference = FastLottieSoftwareSession(
      composition,
      pixelWidth: 112,
      pixelHeight: 112,
      preferNative: false,
      retainCoverage: false,
    );
    try {
      for (final frame in [0.0, 14.0, 28.5, 59.0]) {
        expect(
          candidate.renderFrame(frame),
          orderedEquals(reference.renderFrame(frame)),
        );
      }
      expect(candidate.borrowedCoverageDraws, greaterThan(0));
      expect(candidate.fusedNativeSolidDraws, greaterThan(0));
    } finally {
      candidate.dispose();
      reference.dispose();
    }
  }, skip: !isSimdSupported);

  test(
    'default native matte composite and inner draws preserve exact pixels',
    () {
      final composition = FastLottieComposition.fromJson(matteScene(1));
      final candidate = FastLottieSoftwareSession(
        composition,
        pixelWidth: 112,
        pixelHeight: 112,
      );
      final reference = FastLottieSoftwareSession(
        composition,
        pixelWidth: 112,
        pixelHeight: 112,
        preferNative: false,
        retainCoverage: false,
      );
      try {
        expect(
          candidate.renderFrame(0),
          orderedEquals(reference.renderFrame(0)),
        );
        expect(candidate.nativeMatteComposites, greaterThan(0));
        expect(candidate.fusedNativeSolidDraws, greaterThan(0));
      } finally {
        candidate.dispose();
        reference.dispose();
      }
    },
    skip: !isSimdSupported,
  );

  test('rotated precomp uses native path and preserves exact pixels', () {
    final precompDoc = {
      'v': '5.7.4',
      'fr': 60,
      'ip': 0,
      'op': 60,
      'w': 200,
      'h': 200,
      'assets': [
        {
          'id': 'pre_0',
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
                'p': constant([50, 50]),
                'a': constant([0, 0]),
                's': constant([100, 100]),
              },
              'shapes': [
                {
                  'ty': 'rc',
                  'p': constant([0, 0]),
                  's': constant([60, 40]),
                  'r': constant(8),
                },
                {
                  'ty': 'fl',
                  'c': constant([0.9, 0.2, 0.3]),
                  'o': constant(100),
                },
              ],
            },
          ],
        },
      ],
      'layers': [
        {
          'ty': 0,
          'ind': 1,
          'refId': 'pre_0',
          'w': 100,
          'h': 100,
          'ip': 0,
          'op': 60,
          'st': 0,
          'ks': {
            'o': constant(100),
            'r': animated(15, 75),
            'p': constant([100, 100]),
            'a': constant([50, 50]),
            's': constant([100, 100]),
          },
        },
      ],
    };
    final composition = FastLottieComposition.fromJson(precompDoc);
    final candidate = FastLottieSoftwareSession(
      composition,
      pixelWidth: 112,
      pixelHeight: 112,
    );
    final reference = FastLottieSoftwareSession(
      composition,
      pixelWidth: 112,
      pixelHeight: 112,
      preferNative: false,
      retainCoverage: false,
    );
    try {
      for (final frame in [0.0, 15.0, 45.0, 15.0]) {
        expect(
          candidate.renderFrame(frame),
          orderedEquals(reference.renderFrame(frame)),
          reason: 'rotated precomp frame=$frame',
        );
      }
      expect(candidate.fusedNativeSolidDraws, greaterThan(0));
    } finally {
      candidate.dispose();
      reference.dispose();
    }
  }, skip: !isSimdSupported);

  test(
    'multi-shape simultaneous and sequential animated trims match across seeks',
    () {
      for (final trimMode in [1, 2]) {
        final shapes = <Map<String, dynamic>>[
          for (var i = 0; i < 6; i++)
            {
              'ty': 'rc',
              'p': animated([40 + i * 20, 60 + i * 10], [60 + i * 15, 110]),
              's': animated([30 + i * 6, 40], [50, 30 + i * 4]),
              'r': constant(4),
            },
          {
            'ty': 'tm',
            's': animated(0, 45),
            'e': animated(85, 100),
            'o': animated(0, 270),
            'm': trimMode,
          },
          stroke()..['w'] = constant(6),
        ];
        final composition = FastLottieComposition.fromJson(scene(shapes));
        final candidate = FastLottieSoftwareSession(
          composition,
          pixelWidth: 128,
          pixelHeight: 128,
        );
        final reference = FastLottieSoftwareSession(
          composition,
          pixelWidth: 128,
          pixelHeight: 128,
          preferNative: false,
          retainCoverage: false,
        );
        try {
          for (final frame in [0.0, 10.0, 35.0, 59.0, 10.0, 35.0]) {
            expect(
              candidate.renderFrame(frame),
              orderedEquals(reference.renderFrame(frame)),
              reason: 'trimMode=$trimMode frame=$frame',
            );
          }
        } finally {
          candidate.dispose();
          reference.dispose();
        }
      }
    },
    skip: !isSimdSupported,
  );

  test(
    'downward edges clipped above clip top match native coverage bit-for-bit',
    () {
      // Slanted triangle extending above the top clip boundary (y < 0) so
      // downward edges trigger top-clipping (ey1 < _minEy) in both native
      // fl_edge and Dart FtScanlineRasterizer._renderLine.
      final doc = scene([
        {
          'ty': 'sh',
          'ks': constant({
            'v': [
              [31.3, -47.7],
              [167.9, 143.2],
              [12.4, 151.8],
            ],
            'i': [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
            'o': [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
            'c': true,
          }),
        },
        {
          'ty': 'fl',
          'c': constant([0.85, 0.42, 0.25, 1.0]),
          'o': constant(100),
          'r': 1,
        },
      ]);
      final composition = FastLottieComposition.fromJson(doc);
      final native = FastLottieSoftwareSession(
        composition,
        pixelWidth: 128,
        pixelHeight: 128,
        preferNative: true,
      );
      final dartRef = FastLottieSoftwareSession(
        composition,
        pixelWidth: 128,
        pixelHeight: 128,
        preferNative: false,
        retainCoverage: false,
      );
      try {
        expect(native.renderFrame(0), orderedEquals(dartRef.renderFrame(0)));
      } finally {
        native.dispose();
        dartRef.dispose();
      }
    },
    skip: !isSimdSupported,
  );

  test('SIMD gradients (linear/radial, opaque/translucent, clamped, blend modes) match Dart bit-for-bit', () {
    for (final gradType in [1, 2]) {
      for (final blendMode in [0, 1, 2]) {
        for (final opacity in [100, 65]) {
          for (final translucent in [false, true]) {
            final stops = translucent
                ? [
                    0,
                    0.95,
                    0.25,
                    0.1,
                    0.5,
                    0.15,
                    0.7,
                    0.9,
                    1,
                    0.1,
                    0.85,
                    0.35,
                    0,
                    0.0,
                    0.5,
                    0.72,
                    1,
                    0.95,
                  ]
                : [0, 0.95, 0.25, 0.1, 0.5, 0.15, 0.7, 0.9, 1, 0.1, 0.85, 0.35];
            final doc = {
              'v': '5.5.2',
              'fr': 60,
              'ip': 0,
              'op': 60,
              'w': 128,
              'h': 128,
              'layers': [
                {
                  'ty': 4,
                  'ip': 0,
                  'op': 60,
                  'st': 0,
                  'bm': blendMode,
                  'ks': {
                    'o': constant(100),
                    'r': constant(0),
                    'p': constant([0, 0]),
                    'a': constant([0, 0]),
                    's': constant([100, 100]),
                  },
                  'shapes': [
                    {
                      'ty': 'rc',
                      'p': constant([64, 64]),
                      's': constant([103, 97]),
                      'r': constant(11),
                    },
                    {
                      'ty': 'gf',
                      't': gradType,
                      'o': constant(opacity),
                      'r': 1,
                      's': animated([30, 30], [70, 50]),
                      'e': animated([90, 90], [70, 50]),
                      'g': {'p': 3, 'k': constant(stops)},
                    },
                  ],
                },
                {
                  'ty': 1,
                  'sw': 128,
                  'sh': 128,
                  'sc': '#305070',
                  'ip': 0,
                  'op': 60,
                  'st': 0,
                  'ks': {
                    'o': constant(80),
                    'r': constant(0),
                    'p': constant([0, 0]),
                    'a': constant([0, 0]),
                    's': constant([100, 100]),
                  },
                },
              ],
            };
            final comp = FastLottieComposition.fromJson(doc);
            final native = FastLottieSoftwareSession(
              comp,
              pixelWidth: 113,
              pixelHeight: 113,
              preferNative: true,
            );
            final dartRef = FastLottieSoftwareSession(
              comp,
              pixelWidth: 113,
              pixelHeight: 113,
              preferNative: false,
              retainCoverage: false,
            );
            try {
              // frame 59 tests degenerate zero-length gradient (s == e) too
              for (final f in [0.0, 29.5, 59.0]) {
                expect(
                  native.renderFrame(f),
                  orderedEquals(dartRef.renderFrame(f)),
                  reason:
                      'gradType=$gradType bm=$blendMode op=$opacity trans=$translucent f=$f',
                );
              }
            } finally {
              native.dispose();
              dartRef.dispose();
            }
          }
        }
      }
    }
  }, skip: !isSimdSupported);

  test('SIMD alpha and luma mattes (in/out) match Dart bit-for-bit across odd widths', () {
    for (final tt in [1, 2, 3, 4]) {
      final doc = {
        'v': '5.5.2',
        'fr': 60,
        'ip': 0,
        'op': 60,
        'w': 128,
        'h': 128,
        'layers': [
          {
            'ty': 4,
            'ind': 1,
            'td': 1,
            'ip': 0,
            'op': 60,
            'st': 0,
            'ks': {
              'o': constant(77),
              'r': constant(0),
              'p': animated([58, 64], [70, 64]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
            },
            'shapes': [
              {
                'ty': 'el',
                'p': constant([0, 0]),
                's': constant([79, 73]),
              },
              {
                'ty': 'fl',
                'c': constant([0.8, 0.5, 0.3, 1.0]),
                'o': constant(100),
                'r': 1,
              },
            ],
          },
          {
            'ty': 4,
            'ind': 2,
            'tt': tt,
            'ip': 0,
            'op': 60,
            'st': 0,
            'ks': {
              'o': constant(85),
              'r': constant(0),
              'p': constant([64, 64]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
            },
            'shapes': [
              {
                'ty': 'rc',
                'p': constant([0, 0]),
                's': constant([95, 89]),
                'r': constant(9),
              },
              {
                'ty': 'fl',
                'c': constant([0.9, 0.3, 0.2, 1.0]),
                'o': constant(100),
                'r': 1,
              },
            ],
          },
          {
            'ty': 1,
            'ind': 3,
            'sw': 128,
            'sh': 128,
            'sc': '#224466',
            'ip': 0,
            'op': 60,
            'st': 0,
            'ks': {
              'o': constant(90),
              'r': constant(0),
              'p': constant([0, 0]),
              'a': constant([0, 0]),
              's': constant([100, 100]),
            },
          },
        ],
      };
      final comp = FastLottieComposition.fromJson(doc);
      for (final size in [65, 97, 114]) {
        final native = FastLottieSoftwareSession(
          comp,
          pixelWidth: size,
          pixelHeight: size,
          preferNative: true,
        );
        final dartRef = FastLottieSoftwareSession(
          comp,
          pixelWidth: size,
          pixelHeight: size,
          preferNative: false,
          retainCoverage: false,
        );
        try {
          for (final f in [0.0, 29.5]) {
            expect(
              native.renderFrame(f),
              orderedEquals(dartRef.renderFrame(f)),
              reason: 'tt=$tt size=$size f=$f',
            );
          }
        } finally {
          native.dispose();
          dartRef.dispose();
        }
      }
    }
  }, skip: !isSimdSupported);
}
