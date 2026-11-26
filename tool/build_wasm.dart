import 'dart:io';

import 'package:fastlottie/src/platform/wasm_builder.dart';

Future<void> main() async {
  final zig = findZig();
  if (zig == null) {
    stderr.writeln('Zig is required to regenerate the prebuilt Wasm asset.');
    exitCode = 1;
    return;
  }
  final root = Platform.script.resolve('../');
  final output = root.resolve('lib/src/wasm/$wasmFileName');
  await compileWasm(zig, wasmSources(root), output);
  stdout.writeln('Generated ${output.toFilePath()}');
}
