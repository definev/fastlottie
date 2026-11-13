// ignore_for_file: avoid_print
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

Object _constant(Object value) => {'a': 0, 'k': value};

Map<String, Object> _rectangle(double x, double y, double w, double h) => {
  'ty': 'rc',
  'p': _constant([x, y]),
  's': _constant([w, h]),
  'r': _constant(0),
};

Map<String, Object> _shapeLayer(int id, int mode, List<Object> shapes) => {
  'ind': id,
  'ty': 4,
  'bm': mode,
  'ip': 0,
  'op': 60,
  'shapes': shapes,
};

Object _paint(bool gradient, bool top) => gradient
    ? {
        'ty': 'gf',
        'o': _constant(85),
        'r': 1,
        'g': {
          'p': 2,
          'k': _constant([0, 0.1, 0.3, 0.9, 1, 1, 0.6, 0.2]),
        },
        's': _constant(top ? [0, 0] : [512, 0]),
        'e': _constant(top ? [512, 317] : [0, 512]),
        't': 1,
      }
    : {
        'ty': 'fl',
        'o': _constant(85),
        'r': 1,
        'c': _constant(top ? [0.2, 0.6, 1] : [1, 0.2, 0.4]),
      };

FastLottieComposition _blendScene({
  bool sparse = false,
  bool gradient = false,
  int mode = 1,
}) => FastLottieComposition.fromJson({
  'v': '5.5.2',
  'fr': 60,
  'ip': 0,
  'op': 60,
  'w': 512,
  'h': 512,
  'layers': [
    _shapeLayer(1, mode, [
      if (sparse)
        for (var i = 0; i < 8; i++) _rectangle(24 + i * 66, 24 + i * 66, 18, 18)
      else
        _rectangle(256, 256, 506, 506),
      _paint(gradient, true),
    ]),
    _shapeLayer(2, 0, [
      _rectangle(256, 256, 512, 512),
      _paint(gradient, false),
    ]),
  ],
});

FastLottieComposition _gradientScene({
  required bool radial,
  required int mode,
  required bool moving,
}) {
  final paint = _paint(true, true) as Map<String, Object>;
  paint['t'] = radial ? 2 : 1;
  if (radial) paint['s'] = _constant([224, 238]);
  if (moving) {
    paint['e'] = {
      'a': 1,
      'k': [
        {
          't': 0,
          's': [512, 317],
        },
        {
          't': 59,
          's': [390, 422],
        },
      ],
    };
  }
  return FastLottieComposition.fromJson({
    'v': '5.5.2',
    'fr': 60,
    'ip': 0,
    'op': 60,
    'w': 512,
    'h': 512,
    'layers': [
      _shapeLayer(1, mode, [_rectangle(256, 256, 506, 506), paint]),
      if (mode != 0)
        _shapeLayer(2, 0, [
          _rectangle(256, 256, 512, 512),
          _paint(true, false),
        ]),
    ],
  });
}

FastLottieComposition _nestedGroups(int depth) {
  // Each variant draws the same 64 rectangles. Only the number of enclosing
  // identity groups changes.
  Object group(List<Object> items) => {'ty': 'gr', 'it': items};
  Object tile(int i) {
    var draw = group([
      _rectangle(10 + 14.0 * (i % 8), 10 + 14.0 * (i ~/ 8), 8, 8),
      _paint(false, i.isOdd),
    ]);
    for (var level = 1; level < depth; level++) {
      draw = group([draw]);
    }
    return draw;
  }

  return FastLottieComposition.fromJson({
    'v': '5.5.2',
    'fr': 60,
    'ip': 0,
    'op': 60,
    'w': 128,
    'h': 128,
    'layers': [
      _shapeLayer(1, 0, [for (var i = 0; i < 64; i++) tile(i)]),
    ],
  });
}

FastLottieComposition _staticMasks() {
  // Curved masks with overlapping edges, fixed spatial transform, and dynamic
  // layer opacity. Avoid making the whole composition a static poster.
  Map<String, Object> circle(double x, double y, double radius, String mode) {
    final k = radius * 0.5522847498;
    return {
      'mode': mode,
      'o': _constant(100),
      'pt': _constant({
        'c': true,
        'v': [
          [x + radius, y],
          [x, y + radius],
          [x - radius, y],
          [x, y - radius],
        ],
        'i': [
          [0, -k],
          [k, 0],
          [0, k],
          [-k, 0],
        ],
        'o': [
          [0, k],
          [-k, 0],
          [0, -k],
          [k, 0],
        ],
      }),
    };
  }

  return FastLottieComposition.fromJson({
    'v': '5.5.2',
    'fr': 60,
    'ip': 0,
    'op': 60,
    'w': 512,
    'h': 512,
    'layers': [
      {
        ..._shapeLayer(1, 0, [
          _rectangle(256, 256, 512, 512),
          _paint(false, true),
        ]),
        'ks': {
          'o': {
            'a': 1,
            'k': [
              {
                't': 0,
                's': [70],
              },
              {
                't': 59,
                's': [100],
              },
            ],
          },
        },
        'hasMask': true,
        'masksProperties': [
          for (var i = 0; i < 8; i++)
            circle(
              176 + (i % 4) * 56,
              182 + (i ~/ 4) * 148,
              90,
              i.isOdd ? 'f' : 'a',
            ),
        ],
      },
    ],
  });
}

Future<void> _run() async {
  Future<FastLottieComposition> emoji(String code) async {
    final data = await rootBundle.load('assets/tgs/NotoEmoji/emoji_u$code.tgs');
    return FastLottieComposition.fromBytes(
      data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
    );
  }

  final animations = [
    await emoji('1f9cb'),
    await emoji('1f41c'),
    await emoji('1f426_200d_1f525'),
    await emoji('1f393'),
  ];
  final results = <String, Object>{};

  void measure(String name, List<FastLottieComposition> comps, int size) {
    final sessions = [
      for (final comp in comps)
        FastLottieSoftwareSession(comp, pixelWidth: size, pixelHeight: size),
    ];
    try {
      final watch = Stopwatch();
      final samples = <int>[];
      const warmup = 128;
      const count = 384;
      for (var tick = -warmup; tick < count; tick++) {
        watch
          ..reset()
          ..start();
        for (var i = 0; i < sessions.length; i++) {
          final comp = comps[i];
          sessions[i].renderFrame(
            comp.startFrame + (tick + i * 13) % comp.frameCount,
          );
        }
        watch.stop();
        if (tick >= 0) samples.add(watch.elapsedTicks);
      }
      samples.sort();
      double percentile(double p) =>
          samples[math.min(count - 1, (count * p).ceil() - 1)] *
          1e6 /
          watch.frequency;
      results[name] = {
        'size': size,
        'sessions': comps.length,
        'samples': count,
        'median_us': percentile(.5),
        'p95_us': percentile(.95),
        'coverage_bytes': sessions.fold<int>(
          0,
          (sum, s) => sum + s.retainedCoverageBytes,
        ),
        'scratch_bytes': sessions.fold<int>(
          0,
          (sum, s) => sum + s.scratchPixelBytes,
        ),
      };
    } finally {
      for (final session in sessions) {
        session.dispose();
      }
    }
  }

  if (const bool.fromEnvironment('FASTLOTTIE_GROUP_BENCH')) {
    for (final depth in [1, 8, 32]) {
      measure('group_depth_$depth', [_nestedGroups(depth)], 128);
    }
  }
  if (const bool.fromEnvironment('FASTLOTTIE_GRADIENT_BENCH')) {
    for (final radial in [false, true]) {
      for (final moving in [false, true]) {
        for (final mode in moving ? [0, 1, 2] : [0]) {
          measure(
            '${radial ? 'radial' : 'linear'}_${moving ? 'moving' : 'static'}_bm$mode',
            [_gradientScene(radial: radial, mode: mode, moving: moving)],
            512,
          );
        }
      }
    }
  } else if (!const bool.fromEnvironment('FASTLOTTIE_GROUP_BENCH')) {
    measure('static_masks', [_staticMasks()], 256);
    measure('multiply_dense', [_blendScene()], 512);
    measure('multiply_sparse', [_blendScene(sparse: true)], 512);
    measure('multiply_gradient', [_blendScene(gradient: true)], 512);
    measure('screen_gradient', [_blendScene(gradient: true, mode: 2)], 512);
    measure(
      'emoji_16',
      List.generate(16, (i) => animations[i % animations.length]),
      128,
    );
  }
  for (final entry in results.entries) {
    print(
      'FASTLOTTIE_OPS ${jsonEncode({'workload': entry.key, 'release': kReleaseMode, 'native': isSimdSupported, 'result': entry.value})}',
    );
  }
  print('FASTLOTTIE_OPS_DONE');
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('FastLottie software ops benchmark')),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      await _run();
      exit(0);
    } catch (error, stack) {
      print('FASTLOTTIE_OPS_ERROR $error\n$stack');
      exit(1);
    }
  });
}
