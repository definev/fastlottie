// ignore_for_file: avoid_print, invalid_use_of_visible_for_testing_member
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'benchmark_ops.dart' show createBlendScene, createMergeScene;
import 'benchmark_polystar.dart' show createPolyStarScene, polyStarShape;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('warm software renderer operators at 256 × 256', () {
    void measure(String name, FastLottieComposition composition) {
      final session = FastLottieSoftwareSession(
        composition,
        pixelWidth: 256,
        pixelHeight: 256,
      );
      final samples = <double>[];
      const iterations = 600;
      for (var batch = 0; batch < 8; batch++) {
        final watch = Stopwatch()..start();
        for (var i = 0; i < iterations; i++) {
          session.renderFrame(
            composition.startFrame + i % composition.frameCount,
          );
        }
        if (batch != 0) samples.add(watch.elapsedMicroseconds / iterations);
      }
      session.dispose();
      samples.sort();
      print('$name ${samples[3].toStringAsFixed(1)} µs/frame');
    }

    for (var mode = 1; mode <= 5; mode++) {
      measure(
        'mm=$mode',
        FastLottieComposition.fromJson(createMergeScene(mode)),
      );
    }
    for (final mode in [0, 1, 2, 3, 10]) {
      measure(
        'bm=$mode',
        FastLottieComposition.fromJson(createBlendScene(mode)),
      );
    }
    measure(
      'rounded PolyStar',
      FastLottieComposition.fromJson(
        createPolyStarScene(
          star: polyStarShape(
            sy: 1,
            pt: {'a': 0, 'k': 20},
            os: {'a': 0, 'k': 35},
            isR: {'a': 0, 'k': 35},
            r: {
              'a': 1,
              'k': [
                {
                  't': 0,
                  's': [0],
                  'e': [90],
                },
                {
                  't': 59,
                  's': [90],
                },
              ],
            },
          ),
        ),
      ),
    );
    for (final id in [
      '1f9cb',
      '1f41c',
      '1f30b',
      '1f345',
      '1f60a',
      '1f389',
      '1f426_200d_1f525',
    ]) {
      final file = File('example/assets/tgs/NotoEmoji/emoji_u$id.tgs');
      measure(id, FastLottieComposition.fromBytes(file.readAsBytesSync()));
    }
  });
}
