import 'dart:io';

Future<void> main(List<String> args) async {
  if (args.any((arg) => arg != '--check')) {
    stderr.writeln('Usage: dart run tool/build_web_worker.dart [--check]');
    exitCode = 64;
    return;
  }
  final root = Platform.script.resolve('../');
  final bundled = File.fromUri(
    root.resolve('lib/src/wasm/fastlottie_worker.js'),
  );
  final scratch = await Directory.systemTemp.createTemp('fastlottie-worker-');
  try {
    final output = scratch.uri.resolve('worker.js').toFilePath();
    final result = await Process.run(Platform.resolvedExecutable, [
      'compile',
      'js',
      '-O2',
      '--no-source-maps',
      '-o',
      output,
      'tool/web_worker_main.dart',
    ], workingDirectory: root.toFilePath());
    stdout.write(result.stdout);
    stderr.write(result.stderr);
    if (result.exitCode != 0) {
      exitCode = result.exitCode;
      return;
    }
    final generated = File(output);
    if (args.contains('--check')) {
      if (!bundled.existsSync() ||
          bundled.readAsStringSync() != generated.readAsStringSync()) {
        stderr.writeln(
          'Bundled worker is stale. Run dart run tool/build_web_worker.dart.',
        );
        exitCode = 1;
      }
    } else {
      await generated.copy(bundled.path);
    }
  } finally {
    await scratch.delete(recursive: true);
  }
}
