import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('audit bundled rlottie corpus without silently dropping features', () {
    var accepted = 0, rejected = 0;
    for (final file in Directory(
      'rlottie-master/example/resource',
    ).listSync().whereType<File>().where((f) => f.path.endsWith('.json'))) {
      try {
        final composition = FastLottieComposition.fromBytes(
          file.readAsBytesSync(),
        );
        final player = FastLottiePlayer(composition);
        player.dispose();
        accepted++;
        // ignore: avoid_print
        print('ACCEPT ${file.uri.pathSegments.last}');
      } on UnsupportedLottieException catch (e) {
        rejected++;
        // ignore: avoid_print
        print('REJECT ${file.uri.pathSegments.last}: ${e.message}');
      }
    }
    expect(accepted, greaterThan(0));
    expect(rejected, greaterThan(0));
  });
}
