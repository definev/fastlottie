import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final corpus = Directory('rlottie-master/example/resource');
  test(
    'audit external rlottie corpus without silently dropping features',
    () {
      var accepted = 0, rejected = 0;
      for (final file in corpus.listSync().whereType<File>().where(
        (f) => f.path.endsWith('.json'),
      )) {
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
    },
    skip: corpus.existsSync()
        ? null
        : 'Check out the rlottie reference corpus.',
  );
}
