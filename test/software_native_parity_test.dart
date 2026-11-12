import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

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
