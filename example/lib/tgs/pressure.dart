import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';

/// Sustained expensive frames trigger a static first-frame silhouette. Recovery
/// is timed, since a static canvas intentionally stops generating timing samples.
class StickerPressure extends ChangeNotifier {
  StickerPressure() {
    SchedulerBinding.instance.addTimingsCallback(_timings);
  }
  bool constrained = false;
  int _slow = 0;
  Timer? _recovery;
  void _timings(List<FrameTiming> frames) {
    for (final frame in frames) {
      observe(
        frame.buildDuration > const Duration(milliseconds: 24) ||
            frame.rasterDuration > const Duration(milliseconds: 24),
      );
    }
  }

  @visibleForTesting
  void observe(bool slow) {
    if (constrained) return;
    _slow = slow ? _slow + 1 : (_slow - 1).clamp(0, 8);
    if (_slow < 6) return;
    constrained = true;
    _slow = 0;
    notifyListeners();
    _recovery = Timer(const Duration(seconds: 5), () {
      constrained = false;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    SchedulerBinding.instance.removeTimingsCallback(_timings);
    _recovery?.cancel();
    super.dispose();
  }
}
