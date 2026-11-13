// Run with: flutter test --no-pub tool/benchmark_compiler.dart
// ignore_for_file: avoid_print
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('decode and compile benchmark', () {
    final paths = [
      for (final name in ['static', 'many_shapes', 'morph'])
        'example/assets/$name.json',
      for (final id in ['1f426', '1f32a_fe0f', '1f9cb', '1f30e'])
        'example/assets/tgs/NotoEmoji/emoji_u$id.tgs',
    ];
    for (final path in paths) {
      final bytes = File(path).readAsBytesSync();
      final sample = FastLottieComposition.fromBytes(bytes);
      final samples = <double>[];
      FastLottieComposition? result;
      const iterations = 150;
      for (var batch = 0; batch < 12; batch++) {
        final watch = Stopwatch()..start();
        for (var i = 0; i < iterations; i++) {
          result = FastLottieComposition.fromBytes(bytes);
        }
        watch.stop();
        if (batch >= 3) samples.add(watch.elapsedMicroseconds / iterations);
      }
      samples.sort();
      expect(result!.frameCount, sample.frameCount);
      print(
        'COMPILER ${path.split('/').last} '
        'median=${samples[4].toStringAsFixed(1)}us '
        'key=${sample.contentKey}',
      );
    }
  });
}
