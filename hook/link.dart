import 'package:code_assets/code_assets.dart';
import 'package:fastlottie/src/c_library.dart';
import 'package:hooks/hooks.dart';

void main(List<String> args) async {
  await link(args, (input, output) async {
    if (input.config.buildCodeAssets) {
      await cLibrary.link(input: input, output: output);
    }
  });
}
