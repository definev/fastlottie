import 'dart:convert';
import 'dart:io';

import 'package:flutter/widgets.dart';

import 'benchmark/frame_sampler.dart';
import 'benchmark/runner.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final surface = GlobalKey();
  final sampler = FrameSampler();
  runApp(
    Directionality(
      textDirection: TextDirection.ltr,
      child: ColoredBox(
        color: const Color(0xffeeeeee),
        child: Center(
          child: SizedBox(
            width: 420,
            height: 420,
            child: CustomPaint(
              key: surface,
              painter: BenchmarkPainter(sampler),
            ),
          ),
        ),
      ),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      final result = await runBenchmarks(
        renderBox: surface.currentContext!.findRenderObject()! as RenderBox,
        measureFrames: sampler.measure,
      );
      // ignore: avoid_print
      final payload = jsonEncode(result);
      for (var i = 0; i < payload.length; i += 500) {
        final end = i + 500 < payload.length ? i + 500 : payload.length;
        // ignore: avoid_print
        print('FASTLOTTIE_CHUNK:${payload.substring(i, end)}');
      }
      // ignore: avoid_print
      print('FASTLOTTIE_DONE');
      exit(0);
    } catch (error, stack) {
      // ignore: avoid_print
      print('FASTLOTTIE_ERROR:$error\n$stack');
      exit(1);
    }
  });
}
