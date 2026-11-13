// Run from example/: flutter run -d macos --release -t lib/inner_shadow_benchmark.dart
import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  for (final (name, code) in [
    ('halo', '1f607'),
    ('scrunched_eyes', '1f623'),
    ('scream', '1f631'),
  ]) {
    final asset = await rootBundle.load(
      'assets/tgs/NotoEmoji/emoji_u$code.tgs',
    );
    final raw = asset.buffer.asUint8List(
      asset.offsetInBytes,
      asset.lengthInBytes,
    );
    final withShadow = FastLottieComposition.fromBytes(raw);
    final doc =
        jsonDecode(utf8.decode(decodeLottieBytes(raw))) as Map<String, dynamic>;
    for (final layer in doc['layers'] as List) {
      (layer as Map).remove('sy');
    }
    final without = FastLottieComposition.fromJson(doc);
    final frames = (withShadow.endFrame - withShadow.startFrame).round();
    for (final size in [96, 256]) {
      final sessions = [
        for (final comp in [without, withShadow])
          FastLottieSoftwareSession(comp, pixelWidth: size, pixelHeight: size),
      ];
      final elapsed = [<int>[], <int>[]];
      final scratch = [0, 0];
      final clock = Stopwatch();
      for (var lap = 0; lap < 24; lap++) {
        for (var j = 0; j < 2; j++) {
          final variant = (j + lap) % 2;
          final session = sessions[variant];
          clock
            ..reset()
            ..start();
          for (var frame = 0; frame < frames; frame++) {
            session.renderFrame(withShadow.startFrame + frame);
          }
          clock.stop();
          if (lap >= 4) elapsed[variant].add(clock.elapsedMicroseconds);
          final retained = session.scratchPixelBytes;
          if (retained > scratch[variant]) scratch[variant] = retained;
        }
      }
      double median(int variant) {
        final values = elapsed[variant]..sort();
        final mid = values.length ~/ 2;
        return (values[mid - 1] + values[mid]) / (2 * frames);
      }

      stdout.writeln(
        jsonEncode({
          'sticker': name,
          'size': size,
          'native': isSimdSupported,
          'noShadowUsPerFrame': median(0),
          'innerShadowUsPerFrame': median(1),
          'noShadowScratchBytes': scratch[0],
          'innerShadowScratchBytes': scratch[1],
        }),
      );
      for (final session in sessions) {
        session.dispose();
      }
    }
  }
  exit(0);
}
