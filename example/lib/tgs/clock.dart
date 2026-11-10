import 'dart:async';

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

/// One vsync source for the entire grid; consumers only notify on source frames.
class StickerClock extends ChangeNotifier {
  StickerClock() {
    _ticker = _GalleryTicker((elapsed) {
      _elapsed = _carried + elapsed;
      final bucket = _effectiveFrameRate == null
          ? _elapsed.inMicroseconds
          : ((_elapsed.inMicroseconds + 1) * _effectiveFrameRate! / 1000000)
                .floor();
      if (bucket != _bucket) {
        _bucket = bucket;
        notifyListeners();
      }
    });
  }
  late final _GalleryTicker _ticker;
  Duration _elapsed = Duration.zero, _carried = Duration.zero;
  bool _reduced = false;
  bool _playing = false;
  double? _maximumFrameRate;
  double? _effectiveFrameRate;
  final _consumerRates = <VoidCallback, double>{};
  int _bucket = -1;
  bool get hasConsumers => hasListeners;
  int get microseconds => _reduced ? 0 : _elapsed.inMicroseconds;
  double? get effectiveFrameRate => _effectiveFrameRate;
  void configure({
    required bool playing,
    required bool reducedMotion,
    double? maximumFrameRate,
  }) {
    final changed = _reduced != reducedMotion;
    _reduced = reducedMotion;
    _playing = playing;
    _maximumFrameRate = maximumFrameRate;
    _sync();
    if (changed) notifyListeners();
  }

  void _sync() {
    var rate = _maximumFrameRate;
    if (_consumerRates.isNotEmpty) {
      var fastest = 0.0;
      for (final value in _consumerRates.values) {
        if (value > fastest) fastest = value;
      }
      if (rate == null || fastest < rate) rate = fastest;
    }
    if (_effectiveFrameRate != rate) {
      _effectiveFrameRate = rate;
      _bucket = -1;
      _ticker.frameLimit = rate;
    }
    if (_playing && !_reduced && hasListeners) {
      if (!_ticker.isActive) _ticker.start();
    } else {
      _ticker.stop();
      _carried = _elapsed;
    }
  }

  void _attachProgress(VoidCallback listener, double rate) {
    _consumerRates[listener] = rate;
    addListener(listener);
  }

  void _detachProgress(VoidCallback listener) {
    _consumerRates.remove(listener);
    removeListener(listener);
  }

  @override
  void addListener(VoidCallback listener) {
    super.addListener(listener);
    _sync();
  }

  @override
  void removeListener(VoidCallback listener) {
    super.removeListener(listener);
    _sync();
  }

  @override
  void dispose() {
    _ticker.dispose();
    _consumerRates.clear();
    super.dispose();
  }
}

// Delays scheduling the next engine frame, instead of only suppressing listener
// notifications while a normal Ticker still asks Impeller to rasterize at vsync.
class _GalleryTicker extends Ticker {
  _GalleryTicker(super.onTick);
  double? _limit;
  Timer? _timer;
  Duration? _deadline;
  set frameLimit(double? value) {
    if (_limit == value) return;
    _limit = value;
    _timer?.cancel();
    _timer = null;
    _deadline = null;
    if (shouldScheduleTick) scheduleTick();
  }

  @override
  bool get shouldScheduleTick => super.shouldScheduleTick && _timer == null;
  @override
  void scheduleTick({bool rescheduling = false}) {
    final limit = _limit;
    if (!rescheduling || limit == null) {
      super.scheduleTick(rescheduling: rescheduling);
      return;
    }
    final now = SchedulerBinding.instance.currentFrameTimeStamp;
    final period = Duration(microseconds: (1000000 / limit).round());
    var target = (_deadline ?? now) + period;
    if (target <= now || target > now + period) target = now + period;
    _deadline = target;
    final refresh =
        WidgetsBinding
            .instance
            .platformDispatcher
            .implicitView
            ?.display
            .refreshRate ??
        60;
    final vsyncUs = (1000000 / refresh).round();
    final remainingUs = ((target - now).inMicroseconds * timeDilation).ceil();
    final intervals = (remainingUs - 1) ~/ vsyncUs;
    if (intervals <= 0) {
      super.scheduleTick(rescheduling: rescheduling);
    } else {
      _timer = Timer(
        // Wake just after the preceding vsync, so the requested frame cannot
        // arrive before its sample boundary (especially 24 FPS on 60 Hz).
        Duration(microseconds: intervals * vsyncUs + 1),
        () {
          _timer = null;
          if (shouldScheduleTick) super.scheduleTick();
        },
      );
    }
  }

  @override
  void unscheduleTick() {
    _timer?.cancel();
    _timer = null;
    _deadline = null;
    super.unscheduleTick();
  }
}

class StickerProgress extends Animation<double> with ChangeNotifier {
  StickerProgress(this.clock, this.frames, this.fps, {this.maximumFrameRate}) {
    _frame = _currentSample;
    clock._attachProgress(
      _tick,
      maximumFrameRate != null && maximumFrameRate! < fps
          ? maximumFrameRate!
          : fps,
    );
  }
  final StickerClock clock;
  final double frames, fps;
  final double? maximumFrameRate;
  late double _frame;
  double get _currentSample {
    // Frame timestamps truncate to microseconds: 33333 us is the 30 FPS
    // boundary rounded down. Tolerate that truncation instead of missing it.
    final relative = (((clock.microseconds + 1) / 1000000 * fps) % frames)
        .clamp(0.0, frames > 1 ? frames - 1 : 0.0)
        .toDouble();
    final rate = maximumFrameRate;
    final step = rate != null && rate < fps ? fps / rate : 1.0;
    return (relative / step + 1e-7).floor() * step;
  }

  int get currentFrame => _currentSample.floor();

  void _tick() {
    final frame = _currentSample;
    if (frame != _frame) {
      _frame = frame;
      notifyListeners();
    }
  }

  @override
  double get value => _frame / frames;
  @override
  AnimationStatus get status => AnimationStatus.forward;
  @override
  void addStatusListener(AnimationStatusListener listener) {}
  @override
  void removeStatusListener(AnimationStatusListener listener) {}
  @override
  void dispose() {
    clock._detachProgress(_tick);
    super.dispose();
  }
}
