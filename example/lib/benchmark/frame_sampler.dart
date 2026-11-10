import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'runner.dart';

/// Actual compositor timings for nine visible instances; recording tests are separate.
class FrameSampler extends ChangeNotifier {
  FrameSampler() {
    _ticker = Ticker((_) {
      frame++;
      notifyListeners();
    });
  }
  late final Ticker _ticker;
  BenchMode? mode;
  int frame = 0;

  Future<Map<String, dynamic>> measure(BenchMode next) async {
    final done = Completer<Map<String, dynamic>>();
    final build = <double>[], raster = <double>[], total = <double>[];
    var observed = 0;
    final refresh =
        ui.PlatformDispatcher.instance.views.first.display.refreshRate;
    final budget = 1000000 / refresh;
    void onTimings(List<ui.FrameTiming> timings) {
      for (final timing in timings) {
        if (observed++ < 45) continue;
        build.add(timing.buildDuration.inMicroseconds.toDouble());
        raster.add(timing.rasterDuration.inMicroseconds.toDouble());
        total.add(timing.totalSpan.inMicroseconds.toDouble());
        if (total.length >= 90 && !done.isCompleted) {
          done.complete({
            'instances': 9,
            'samples': total.length,
            'refresh_hz': refresh,
            'build': distribution(build),
            'raster': distribution(raster),
            'total': distribution(total),
            'over_budget_fraction':
                total.where((v) => v > budget).length / total.length,
          });
          return;
        }
      }
    }

    mode = next;
    frame = 0;
    SchedulerBinding.instance.addTimingsCallback(onTimings);
    _ticker.start();
    notifyListeners();
    try {
      return await done.future.timeout(
        const Duration(seconds: 12),
        onTimeout: () => {
          'unavailable': 'FrameTiming timeout; the surface may be occluded or display inactive',
          'observed_timings': observed,
          'samples_after_warmup': total.length,
        },
      );
    } finally {
      _ticker.stop();
      mode = null;
      notifyListeners();
      SchedulerBinding.instance.removeTimingsCallback(onTimings);
    }
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }
}

class BenchmarkPainter extends CustomPainter {
  BenchmarkPainter(this.sampler) : super(repaint: sampler);
  final FrameSampler sampler;
  @override
  void paint(Canvas canvas, Size size) {
    final mode = sampler.mode;
    if (mode == null) return;
    final cell = size.shortestSide / 3;
    for (var i = 0; i < 9; i++) {
      canvas.save();
      canvas.translate((i % 3) * cell, (i ~/ 3) * cell);
      canvas.scale(cell / 256);
      mode.paint(canvas, sampler.frame % 60);
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(BenchmarkPainter old) => old.sampler != sampler;
}
