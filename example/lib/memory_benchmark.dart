import 'dart:convert';
import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart' show kReleaseMode;
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

// The parent samples this process while it is paused at each checkpoint.
Future<void> checkpoint(String phase, int cycle, [int? visiblePixels]) async {
  stdout.writeln(
    'FASTLOTTIE_RAM ${jsonEncode({'phase': phase, 'cycle': cycle, 'visible_pixels': ?visiblePixels})}',
  );
  await stdout.flush();
  if (stdin.readLineSync() != 'continue') {
    throw StateError('Missing acknowledgement');
  }
}

Future<void> runCycle(
  Uint8List bytes,
  int count,
  int size,
  int frames,
  int cycle,
) async {
  final models = [
    for (var i = 0; i < count; i++) FastLottieComposition.fromBytes(bytes),
  ];
  if (models.any((m) => m.endFrame - m.startFrame < frames)) {
    throw StateError('Fixture has fewer than $frames frames');
  }
  await checkpoint('loaded', cycle);
  // This release benchmark exercises the software renderer directly.
  // ignore: invalid_use_of_visible_for_testing_member
  final sessions = <FastLottieSoftwareSession>[];
  try {
    for (final model in models) {
      // ignore: invalid_use_of_visible_for_testing_member
      final session = FastLottieSoftwareSession(
        model,
        pixelWidth: size,
        pixelHeight: size,
      );
      sessions.add(session);
      // Make the destination resident before measuring the bound session.
      final pixels = session.pixels;
      for (var p = 0; p < pixels.length; p += 1024) {
        pixels[p] = 0xff000000;
      }
    }
    await checkpoint('bound', cycle);
    for (var i = 0; i < count; i++) {
      sessions[i].renderFrame(models[i].startFrame);
    }
    await checkpoint('first_frame', cycle);
    for (var loop = 0; loop < 2; loop++) {
      for (var f = 0; f < frames; f++) {
        for (var i = 0; i < count; i++) {
          sessions[i].renderFrame(models[i].startFrame + f);
        }
      }
    }
    final pixels = sessions.first.renderFrame(
      models.first.startFrame + frames ~/ 2,
    );
    var visible = 0;
    for (final pixel in pixels) {
      if (pixel >>> 24 != 0) visible++;
    }
    await checkpoint('warm', cycle, visible);
  } finally {
    for (final session in sessions) {
      session.dispose();
    }
    sessions.clear();
    models.clear();
  }
}

Future<void> main(List<String> args) async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    if (!kReleaseMode || !isSimdSupported) {
      throw StateError(
        'Build Flutter release with the native software kernels',
      );
    }
    if (args.length != 5) {
      throw ArgumentError('Expected fixture, instances, size, frames, cycles');
    }
    final count = int.parse(args[1]);
    final size = int.parse(args[2]);
    final frames = int.parse(args[3]);
    final cycles = int.parse(args[4]);
    if ([count, size, frames, cycles].any((n) => n < 1)) {
      throw ArgumentError(
        'Instances, size, frames and cycles must be positive',
      );
    }
    final data = await rootBundle.load('assets/${args[0]}.json');
    final bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    await checkpoint('baseline', 0);
    for (var cycle = 1; cycle <= cycles; cycle++) {
      await runCycle(bytes, count, size, frames, cycle);
      await checkpoint('released', cycle);
    }
    await checkpoint('settled', cycles);
    exit(0);
  } catch (error, stack) {
    stderr.writeln('$error\n$stack');
    exit(1);
  }
}
