import 'dart:io';

import 'package:data_assets/data_assets.dart';
import 'package:fastlottie/src/platform/c_library.dart';
import 'package:hooks/hooks.dart';

const wasmFileName = 'fastlottie_simd.wasm';

Future<void> buildWasmAsset(BuildInput input, BuildOutputBuilder output) async {
  final zig = input.userDefines.path('zig') ?? findZig();
  if (zig == null) return; // Flutter can use the prebuilt package asset.

  final asset = input.outputDirectory.resolve(wasmFileName);
  final sources = wasmSources(input.packageRoot);
  output.dependencies.addAll([zig, ...sources]);
  await compileWasm(zig, sources, asset);
  output.assets.data.add(
    DataAsset(package: input.packageName, name: wasmFileName, file: asset),
  );
}

List<Uri> wasmSources(Uri root) => cSources.map(root.resolve).toList();

Uri? findZig() {
  final executable = Platform.isWindows ? 'zig.exe' : 'zig';
  final path = Platform.environment['PATH'] ?? '';
  for (final dir in path.split(Platform.isWindows ? ';' : ':')) {
    if (dir.isEmpty) continue;
    final file = File.fromUri(Directory(dir).absolute.uri.resolve(executable));
    if (file.existsSync()) return file.uri;
  }
  return null;
}

Future<void> compileWasm(Uri zig, List<Uri> sources, Uri output) async {
  await Directory.fromUri(output.resolve('.')).create(recursive: true);
  final result = await Process.run(zig.toFilePath(), [
    'cc',
    '-target',
    'wasm32-wasi',
    '-O3',
    '-fno-sanitize=all',
    '-msimd128',
    '-mexec-model=reactor',
    '-Wl,--export-dynamic',
    '-Wl,--strip-all',
    '-Wl,--export=malloc',
    '-Wl,--export=free',
    ...sources.map((source) => source.toFilePath()),
    '-o',
    output.toFilePath(),
  ]);
  if (result.exitCode != 0) {
    throw StateError(
      'Could not compile FastLottie Wasm with Zig:\n${result.stderr}',
    );
  }
}
