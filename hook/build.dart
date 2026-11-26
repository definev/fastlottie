import 'package:code_assets/code_assets.dart';
import 'package:data_assets/data_assets.dart';
import 'package:fastlottie/src/platform/c_library.dart';
import 'package:fastlottie/src/platform/wasm_builder.dart';
import 'package:hooks/hooks.dart';

void main(List<String> args) async {
  await build(args, (input, output) async {
    if (input.config.buildCodeAssets) {
      await cLibrary.build(
        input: input,
        output: output,
        defines: {
          if (input.config.code.targetOS == OS.windows)
            'FL_EXPORT': '__declspec(dllexport)',
        },
      );
    } else if (input.config.buildDataAssets) {
      await buildWasmAsset(input, output);
    }
  });
}
