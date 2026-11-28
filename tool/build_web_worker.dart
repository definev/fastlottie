import 'dart:io';

Future<void> main(List<String> args) async {
  var check = false;
  String? outputPath;
  for (var i = 0; i < args.length; i++) {
    final arg = args[i];
    if (arg == '--check') {
      check = true;
    } else if (arg == '--output' || arg == '-o') {
      if (i + 1 >= args.length) {
        _printUsage();
        exitCode = 64;
        return;
      }
      outputPath = args[++i];
    } else {
      _printUsage();
      exitCode = 64;
      return;
    }
  }
  if (check && outputPath != null) {
    _printUsage();
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
    if (check) {
      if (!bundled.existsSync() ||
          bundled.readAsStringSync() != generated.readAsStringSync()) {
        stderr.writeln(
          'Bundled worker is stale. Run dart run tool/build_web_worker.dart.',
        );
        exitCode = 1;
      }
    } else if (outputPath != null) {
      final target = File(outputPath);
      await target.parent.create(recursive: true);
      await generated.copy(target.path);
    } else {
      await generated.copy(bundled.path);
    }
  } finally {
    await scratch.delete(recursive: true);
  }
}

void _printUsage() {
  stderr.writeln(
    'Usage: dart run tool/build_web_worker.dart [--check | --output <path>]',
  );
}
