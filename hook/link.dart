import 'package:fastlottie/src/c_library.dart';
import 'package:hooks/hooks.dart';

void main(List<String> args) async {
  await link(args, (input, output) async {
    await cLibrary.link(input: input, output: output);
  });
}
