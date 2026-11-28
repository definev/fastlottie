import 'dart:async';

import 'package:flutter/foundation.dart' show mapEquals;
import 'package:flutter/scheduler.dart' show Ticker;
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../network/network_types.dart';
import '../scene/options.dart';
import 'composition.dart';
import 'player.dart';

part 'source_widget.dart';

/// Playback policy supplied by the owning viewport or screen.
enum FastLottiePlayback {
  /// Plays normally according to the widget's controller and playback settings.
  active,

  /// Prepares and displays a poster frame.
  prewarm,

  /// Keeps the layout while suspending painting and releasing the cache lease.
  hidden,
}

/// Controls descendants without polling layout on every animation tick.
///
/// The owner determines visibility (including occlusion). [FastLottiePlayback.prewarm]
/// prepares a poster; [FastLottiePlayback.hidden] keeps layout but stops painting,
/// detaches animation listeners and releases the widget's cache lease. External
/// controllers remain owned by their callers and are never stopped by this scope.
class FastLottiePlaybackScope extends InheritedWidget {
  /// Supplies a playback policy to descendant [FastLottie] widgets.
  const FastLottiePlaybackScope({
    super.key,
    required this.playback,
    required super.child,
  });

  /// Policy applied to descendants.
  final FastLottiePlayback playback;

  /// Returns the nearest scope policy, defaulting to active playback.
  static FastLottiePlayback of(BuildContext context) =>
      context
          .dependOnInheritedWidgetOfExactType<FastLottiePlaybackScope>()
          ?.playback ??
      FastLottiePlayback.active;

  @override
  bool updateShouldNotify(FastLottiePlaybackScope oldWidget) =>
      playback != oldWidget.playback;
}

enum _InternalClock { none, shared, controller }

Size _resolveCompositionSize(
  double? width,
  double? height,
  FastLottieComposition composition,
) {
  if (width != null && height != null) return Size(width, height);
  if (width != null) {
    final h = width.isFinite && composition.width > 0
        ? width * composition.height / composition.width
        : composition.height;
    return Size(width, h);
  }
  if (height != null) {
    final w = height.isFinite && composition.height > 0
        ? height * composition.width / composition.height
        : composition.width;
    return Size(w, height);
  }
  return Size(composition.width, composition.height);
}

Widget _wrapSemantics(
  Widget child, {
  required String? semanticLabel,
  required bool excludeFromSemantics,
}) {
  if (excludeFromSemantics) {
    return ExcludeSemantics(child: child);
  }
  if (semanticLabel != null) {
    return Semantics(label: semanticLabel, image: true, child: child);
  }
  return child;
}

/// Shared playback and layout configuration for compiled and loading widgets.
abstract class _FastLottieWidget extends StatefulWidget {
  const _FastLottieWidget({
    super.key,
    this.controller,
    this.width,
    this.height,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.repeat = true,
    this.animate = true,
    this.useFrameRate = true,
    this.cache = const FastLottieCache(),
    this.pictureCache,
    this.rasterCache,
    this.rasterMode = FastLottieRasterMode.animation,
    this.resolutionScale,
    this.maximumFrameRate,
    this.usePipeline = true,
    this.semanticLabel,
    this.excludeFromSemantics = false,
  });

  /// Optional caller-owned animation supplying progress from zero to one.
  final Animation<double>? controller;

  /// Requested width in logical pixels, subject to parent constraints.
  final double? width;

  /// Requested height in logical pixels, subject to parent constraints.
  final double? height;

  /// How to fit the composition inside the available space.
  final BoxFit fit;

  /// How to align the fitted composition inside the widget.
  final Alignment alignment;

  /// Whether internally driven playback loops.
  final bool repeat;

  /// Whether to start the internal controller automatically.
  final bool animate;

  /// Whether to sample authored frames; false allows vector subframes.
  final bool useFrameRate;

  /// Limits for retained vector pictures.
  final FastLottieCache cache;

  /// Optional caller-owned vector picture cache shared across players when
  /// rendering directly without a raster pipeline.
  final FastLottiePictureCache? pictureCache;

  /// Optional caller-owned raster cache to use for this widget.
  final FastLottieRasterCache? rasterCache;

  /// Whether the shared raster cache supplies an animation or a poster.
  final FastLottieRasterMode rasterMode;

  /// Overrides the shared cache's raster resolution scale when provided.
  final double? resolutionScale;

  /// Overrides the shared cache's frame rate cap when provided.
  final double? maximumFrameRate;

  /// Enables the shared worker and double-buffered raster pipeline
  /// when [rasterCache] is omitted and [cache] allows caching.
  final bool usePipeline;

  /// Optional accessibility label exposed via [Semantics] with `image: true`.
  final String? semanticLabel;

  /// Whether to exclude this animation from the semantics tree.
  final bool excludeFromSemantics;
}

/// Plays a compiled composition. Animation ticks only repaint the canvas.
class FastLottie extends _FastLottieWidget {
  /// Creates a widget that plays a compiled composition.
  const FastLottie({
    super.key,
    required this.composition,
    super.controller,
    super.width,
    super.height,
    super.fit,
    super.alignment,
    super.repeat,
    super.animate,
    super.useFrameRate,
    super.cache,
    super.pictureCache,
    super.rasterCache,
    super.rasterMode,
    super.resolutionScale,
    super.maximumFrameRate,
    super.usePipeline,
    super.semanticLabel,
    super.excludeFromSemantics,
  });

  /// Compiled animation to play.
  final FastLottieComposition composition;

  /// Loads a declared Flutter asset and plays it with loading/error builders.
  /// Uses the nearest [DefaultAssetBundle] unless a bundle is supplied.
  static const asset = FastLottieAsset.new;

  /// Decodes JSON or gzip/TGS bytes and plays the resulting composition.
  /// Equal byte contents reuse the existing decoded composition across rebuilds.
  static const bytes = FastLottieBytes.new;

  /// Loads and plays a remote `.tgs` or Lottie `.json` resource with automatic
  /// in-flight request cancellation on disposal or URI change.
  static Widget network(
    Uri uri, {
    Key? key,
    Map<String, String>? headers,
    FastLottieOptions options = const FastLottieOptions(),
    String? sourceCacheDirectory,
    int maximumNetworkBytes = 16 * 1024 * 1024,
    FastLottieNetworkByteLoader? loader,
    Animation<double>? controller,
    double? width,
    double? height,
    BoxFit fit = BoxFit.contain,
    Alignment alignment = Alignment.center,
    bool repeat = true,
    bool animate = true,
    bool useFrameRate = true,
    FastLottieCache cache = const FastLottieCache(),
    FastLottiePictureCache? pictureCache,
    FastLottieRasterCache? rasterCache,
    FastLottieRasterMode rasterMode = FastLottieRasterMode.animation,
    double? resolutionScale,
    double? maximumFrameRate,
    bool usePipeline = true,
    String? semanticLabel,
    bool excludeFromSemantics = false,
    WidgetBuilder? placeholderBuilder,
    FastLottieErrorBuilder? errorBuilder,
  }) => FastLottieNetwork(
    key: key,
    uri: uri,
    headers: headers,
    options: options,
    sourceCacheDirectory: sourceCacheDirectory,
    maximumNetworkBytes: maximumNetworkBytes,
    loader: loader,
    controller: controller,
    width: width,
    height: height,
    fit: fit,
    alignment: alignment,
    repeat: repeat,
    animate: animate,
    useFrameRate: useFrameRate,
    cache: cache,
    pictureCache: pictureCache,
    rasterCache: rasterCache,
    rasterMode: rasterMode,
    resolutionScale: resolutionScale,
    maximumFrameRate: maximumFrameRate,
    usePipeline: usePipeline,
    semanticLabel: semanticLabel,
    excludeFromSemantics: excludeFromSemantics,
    placeholderBuilder: placeholderBuilder,
    errorBuilder: errorBuilder,
  );

  @override
  State<FastLottie> createState() => _FastLottieState();
}

class _FastLottieState extends State<FastLottie>
    with SingleTickerProviderStateMixin {
  FastLottiePlayer? _playerInstance;
  FastLottiePlayer get _player => _playerInstance!;
  AnimationController? _controllerInstance;
  AnimationController get _controller => _controllerInstance ??=
      AnimationController(vsync: this, duration: widget.composition.duration);
  _SharedClockAnimation? _sharedAnimation;
  _FrameRepaint? _repaint;
  bool _reducedMotion = false;
  bool _tickerEnabled = true;
  FastLottiePlayback _playback = FastLottiePlayback.active;
  FastLottieRasterMode get _rasterMode =>
      _playback == FastLottiePlayback.prewarm
      ? FastLottieRasterMode.poster
      : widget.rasterMode;
  bool get _useSharedClock =>
      widget.controller == null &&
      widget.repeat &&
      widget.animate &&
      !_reducedMotion &&
      !widget.composition.isStatic &&
      _playback == FastLottiePlayback.active &&
      widget.composition.duration.inMicroseconds > 0;
  Animation<double> get _activeAnimation {
    if (widget.controller != null) return widget.controller!;
    if (_useSharedClock) {
      return _sharedAnimation ??= _SharedClockAnimation(
        widget.composition.duration,
      );
    }
    return _controller;
  }

  Animation<double> get _paintAnimation =>
      _playback == FastLottiePlayback.active
      ? _activeAnimation
      : const AlwaysStoppedAnimation<double>(0);
  bool _repeating = false;
  bool _usesDefaultPipeline = false;
  bool _deactivated = false;
  _InternalClock _activeInternalClock = _InternalClock.none;
  Animation<double> get animation => _activeAnimation;

  void _syncClockHandoff() {
    if (widget.controller != null ||
        _playback != FastLottiePlayback.active ||
        _reducedMotion ||
        widget.composition.isStatic) {
      return;
    }
    final nextClock = _useSharedClock
        ? _InternalClock.shared
        : _InternalClock.controller;
    if (nextClock == _activeInternalClock) return;
    if (nextClock == _InternalClock.shared) {
      if (_activeInternalClock == _InternalClock.controller &&
          _controllerInstance != null) {
        final shared = _sharedAnimation ??= _SharedClockAnimation(
          widget.composition.duration,
        );
        shared.setDuration(widget.composition.duration);
        shared.setProgress(_controllerInstance!.value);
      }
    } else if (_activeInternalClock == _InternalClock.shared &&
        _sharedAnimation != null) {
      _controller.duration = widget.composition.duration;
      _controller.value = _sharedAnimation!.value;
    }
    _activeInternalClock = nextClock;
  }

  FastLottieRasterCache? _resolveRasterCache() {
    if (widget.rasterCache != null) {
      if (_usesDefaultPipeline) {
        _usesDefaultPipeline = false;
        DefaultRasterCacheScope.release();
      }
      return widget.rasterCache;
    }
    if (widget.usePipeline && widget.cache.maximumFrames > 0) {
      if (!_usesDefaultPipeline) {
        _usesDefaultPipeline = true;
        return DefaultRasterCacheScope.acquire();
      }
      return DefaultRasterCacheScope.current;
    }
    if (_usesDefaultPipeline) {
      _usesDefaultPipeline = false;
      DefaultRasterCacheScope.release();
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _reducedMotion = MediaQuery.disableAnimationsOf(context);
    _tickerEnabled = TickerMode.valuesOf(context).enabled;
    final nextPlayback = FastLottiePlaybackScope.of(context);
    if (_playerInstance == null) {
      _playback = nextPlayback;
      final effectiveRaster = _resolveRasterCache();
      try {
        _playerInstance = FastLottiePlayer(
          widget.composition,
          cache: widget.cache,
          pictureCache: widget.pictureCache,
          rasterCache: effectiveRaster,
          rasterMode: _rasterMode,
          resolutionScale: widget.resolutionScale,
          maximumFrameRate: widget.maximumFrameRate,
        );
      } catch (_) {
        if (_usesDefaultPipeline) {
          _usesDefaultPipeline = false;
          DefaultRasterCacheScope.release();
        }
        rethrow;
      }
      _syncClockHandoff();
      _repaint = _FrameRepaint(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
    } else if (nextPlayback != _playback) {
      final previous = _playerInstance!;
      _playback = nextPlayback;
      _syncClockHandoff();
      _playerInstance = FastLottiePlayer(
        widget.composition,
        cache: widget.cache,
        pictureCache: widget.pictureCache,
        rasterCache: previous.rasterCache,
        rasterMode: _rasterMode,
        resolutionScale: widget.resolutionScale,
        maximumFrameRate: widget.maximumFrameRate,
      );
      _repaint?.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
      previous.dispose();
    } else {
      _syncClockHandoff();
      _repaint?.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
    }
    if (_playback != FastLottiePlayback.hidden &&
        _player.rasterCache != null &&
        (widget.width != null || widget.height != null)) {
      final target = _resolveCompositionSize(
        widget.width,
        widget.height,
        widget.composition,
      );
      if (target.isFinite && !target.isEmpty) {
        _player.prewarm(
          destinationSize: target,
          fit: widget.fit,
          alignment: widget.alignment,
          devicePixelRatio: MediaQuery.devicePixelRatioOf(context),
        );
      }
    }
    _play();
  }

  void _play() {
    if (_deactivated) {
      _sharedAnimation?.setActive(false);
      _controllerInstance?.stop();
      return;
    }
    _syncClockHandoff();
    if (_useSharedClock) {
      _controllerInstance?.stop();
      final shared = _sharedAnimation ??= _SharedClockAnimation(
        widget.composition.duration,
      );
      shared.setDuration(widget.composition.duration);
      shared.setActive(_tickerEnabled);
      _repeating = true;
      return;
    }
    _sharedAnimation?.setActive(false);
    if (_playback != FastLottiePlayback.active ||
        widget.controller != null ||
        !widget.animate ||
        _reducedMotion ||
        widget.composition.isStatic) {
      _controllerInstance?.stop();
    } else if (widget.repeat) {
      if (!_controller.isAnimating || !_repeating) _controller.repeat();
    } else if (!_controller.isCompleted) {
      if (!_controller.isAnimating || _repeating) _controller.forward();
    }
    _repeating = widget.repeat;
  }

  @override
  void deactivate() {
    _deactivated = true;
    _sharedAnimation?.setActive(false);
    _controllerInstance?.stop();
    super.deactivate();
  }

  @override
  void activate() {
    super.activate();
    _deactivated = false;
    _play();
  }

  @override
  void didUpdateWidget(FastLottie oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.composition != widget.composition ||
        oldWidget.cache != widget.cache ||
        oldWidget.pictureCache != widget.pictureCache ||
        oldWidget.rasterCache != widget.rasterCache ||
        oldWidget.rasterMode != widget.rasterMode ||
        oldWidget.resolutionScale != widget.resolutionScale ||
        oldWidget.maximumFrameRate != widget.maximumFrameRate ||
        oldWidget.usePipeline != widget.usePipeline) {
      final wasUsingDefault = _usesDefaultPipeline;
      final wantsDefault =
          widget.rasterCache == null &&
          widget.usePipeline &&
          widget.cache.maximumFrames > 0;
      FastLottieRasterCache? nextRaster;
      var acquiredDefault = false;
      if (widget.rasterCache != null) {
        nextRaster = widget.rasterCache;
        _usesDefaultPipeline = false;
      } else if (wantsDefault) {
        if (wasUsingDefault) {
          nextRaster = DefaultRasterCacheScope.current;
        } else {
          nextRaster = DefaultRasterCacheScope.acquire();
          acquiredDefault = true;
        }
        _usesDefaultPipeline = true;
      } else {
        nextRaster = null;
        _usesDefaultPipeline = false;
      }

      final previousPlayer = _player;
      try {
        _playerInstance = FastLottiePlayer(
          widget.composition,
          cache: widget.cache,
          pictureCache: widget.pictureCache,
          rasterCache: nextRaster,
          rasterMode: _rasterMode,
          resolutionScale: widget.resolutionScale,
          maximumFrameRate: widget.maximumFrameRate,
        );
      } catch (_) {
        _usesDefaultPipeline = wasUsingDefault;
        if (acquiredDefault) {
          DefaultRasterCacheScope.release();
        }
        rethrow;
      }
      if (oldWidget.composition != widget.composition) {
        _sharedAnimation?.reset(widget.composition.duration);
        if (_controllerInstance != null) {
          _controllerInstance!.stop();
          _controllerInstance!.duration = widget.composition.duration;
          _controllerInstance!.value = 0;
        }
      }
      _syncClockHandoff();
      _repaint?.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
      previousPlayer.dispose();
      if (wasUsingDefault && !_usesDefaultPipeline) {
        DefaultRasterCacheScope.release();
      }
    } else {
      _syncClockHandoff();
      _repaint?.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
    }
    _play();
  }

  @override
  void dispose() {
    _repaint?.dispose();
    _playerInstance?.dispose();
    _sharedAnimation?.dispose();
    _controllerInstance?.dispose();
    if (_usesDefaultPipeline) {
      _usesDefaultPipeline = false;
      DefaultRasterCacheScope.release();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = _resolveCompositionSize(
      widget.width,
      widget.height,
      widget.composition,
    );
    final child = _playback == FastLottiePlayback.hidden
        ? SizedBox(width: size.width, height: size.height)
        : CustomPaint(
            size: size,
            painter: _FastPainter(
              _player,
              _paintAnimation,
              widget.fit,
              widget.alignment,
              widget.useFrameRate,
              widget.controller == null && _reducedMotion,
              MediaQuery.devicePixelRatioOf(context),
              repaint: _repaint!,
            ),
          );
    return _wrapSemantics(
      child,
      semanticLabel: widget.semanticLabel,
      excludeFromSemantics: widget.excludeFromSemantics,
    );
  }
}

class _FastPainter extends CustomPainter {
  _FastPainter(
    this.player,
    this.animation,
    this.fit,
    this.alignment,
    this.useFrameRate,
    this.reducedMotion,
    this.devicePixelRatio, {
    required _FrameRepaint repaint,
  }) : super(repaint: repaint);

  /// Player owned and disposed by the caller.
  final FastLottiePlayer player;
  final Animation<double> animation;

  /// How to fit the composition inside the available space.
  final BoxFit fit;

  /// How to align the fitted composition inside the widget.
  final Alignment alignment;
  final bool useFrameRate, reducedMotion;
  final double devicePixelRatio;
  @override
  void paint(Canvas canvas, Size size) => player.draw(
    canvas,
    Offset.zero & size,
    reducedMotion ? 0 : animation.value,
    fit: fit,
    alignment: alignment,
    useFrameRate: useFrameRate,
    devicePixelRatio: devicePixelRatio,
  );
  @override
  bool shouldRepaint(_FastPainter old) =>
      player != old.player ||
      animation != old.animation ||
      fit != old.fit ||
      alignment != old.alignment ||
      useFrameRate != old.useFrameRate ||
      reducedMotion != old.reducedMotion ||
      devicePixelRatio != old.devicePixelRatio;
}

/// Attaches only while CustomPaint uses this delegate. Cache invalidation still
/// repaints immediately; animation ticks repaint only when the sampled frame
/// changes. External animation controllers keep their own scheduling policy.
class _FrameRepaint extends ChangeNotifier {
  _FrameRepaint(
    this.player,
    this.animation,
    this.useFrameRate,
    this.reducedMotion,
  );
  FastLottiePlayer player;
  Animation<double> animation;
  bool useFrameRate, reducedMotion;
  double? _last;
  bool _attached = false;
  bool get _animated => !player.composition.isStatic && !reducedMotion;
  double get _sample =>
      _animated ? player.sampleForRepaint(animation.value, useFrameRate) : 0;

  void update(
    FastLottiePlayer nextPlayer,
    Animation<double> nextAnimation,
    bool nextUseFrameRate,
    bool nextReducedMotion,
  ) {
    final wasAnimated = _animated;
    final oldPlayer = player;
    final oldAnimation = animation;
    final nextAnimated = !nextPlayer.composition.isStatic && !nextReducedMotion;
    final needsRewire =
        !identical(oldPlayer, nextPlayer) ||
        !identical(oldAnimation, nextAnimation) ||
        wasAnimated != nextAnimated;
    if (_attached && needsRewire) {
      oldPlayer.removeListener(_invalidate);
      if (wasAnimated) oldAnimation.removeListener(_tick);
    }
    player = nextPlayer;
    animation = nextAnimation;
    useFrameRate = nextUseFrameRate;
    reducedMotion = nextReducedMotion;
    _last = _sample;
    if (_attached && needsRewire) {
      player.addListener(_invalidate);
      if (_animated) animation.addListener(_tick);
    }
  }

  void detachListeners() {
    if (!_attached) return;
    _attached = false;
    player.removeListener(_invalidate);
    if (_animated) animation.removeListener(_tick);
  }

  void _tick() {
    final sample = _sample;
    if (sample == _last) return;
    _last = sample;
    notifyListeners();
  }

  void _invalidate() {
    _last = _sample;
    notifyListeners();
  }

  @override
  void dispose() {
    detachListeners();
    super.dispose();
  }

  @override
  void addListener(VoidCallback listener) {
    final attach = !hasListeners;
    super.addListener(listener);
    if (attach && !_attached) {
      _attached = true;
      _last = _sample;
      player.addListener(_invalidate);
      if (_animated) animation.addListener(_tick);
    }
  }

  @override
  void removeListener(VoidCallback listener) {
    super.removeListener(listener);
    if (!hasListeners) {
      detachListeners();
    }
  }
}

/// Coalesces repeating [FastLottie] widgets onto a single vsync [Ticker]
/// instead of registering one [AnimationController] ticker per widget.
final class _SharedPlaybackClock {
  static final _SharedPlaybackClock instance = _SharedPlaybackClock._();
  _SharedPlaybackClock._();

  final _active = <_SharedClockAnimation>[];
  final _tickSnapshot = <_SharedClockAnimation>[];
  Ticker? _ticker;
  int _lastElapsedUs = 0;
  bool _ticking = false;

  void attach(_SharedClockAnimation animation) {
    if (_active.contains(animation)) return;
    _active.add(animation);
    animation._anchorUs = _lastElapsedUs - animation._offsetUs;
    if (_ticker == null) {
      _lastElapsedUs = 0;
      animation._anchorUs = -animation._offsetUs;
      _ticker = Ticker(_onTick, debugLabel: 'fastlottie.sharedClock')..start();
    }
  }

  void detach(_SharedClockAnimation animation) {
    if (!_active.remove(animation)) return;
    if (_active.isEmpty) {
      _ticker?.stop();
      _ticker?.dispose();
      _ticker = null;
      _lastElapsedUs = 0;
    }
  }

  void _onTick(Duration elapsed) {
    final nowUs = elapsed.inMicroseconds;
    _lastElapsedUs = nowUs;
    if (_active.isEmpty) return;
    final List<_SharedClockAnimation> snapshot;
    final useScratch = !_ticking;
    if (useScratch) {
      _ticking = true;
      _tickSnapshot
        ..clear()
        ..addAll(_active);
      snapshot = _tickSnapshot;
    } else {
      snapshot = List.of(_active, growable: false);
    }
    try {
      for (var i = 0; i < snapshot.length; i++) {
        snapshot[i]._advance(nowUs);
      }
    } finally {
      if (useScratch) {
        _tickSnapshot.clear();
        _ticking = false;
      }
    }
  }
}

final class _SharedClockAnimation extends Animation<double>
    with
        AnimationEagerListenerMixin,
        AnimationLocalListenersMixin,
        AnimationLocalStatusListenersMixin {
  _SharedClockAnimation(Duration duration)
    : _periodUs = duration.inMicroseconds > 0 ? duration.inMicroseconds : 1;

  int _periodUs;
  int _offsetUs = 0;
  int _anchorUs = 0;
  double _value = 0.0;
  bool _desiredActive = false;
  bool _clockAttached = false;
  int _listenerCount = 0;
  bool _disposed = false;

  @override
  double get value => _value;

  @override
  AnimationStatus get status =>
      _desiredActive ? AnimationStatus.forward : AnimationStatus.dismissed;

  @override
  void didRegisterListener() {
    _listenerCount++;
    _syncClock();
  }

  @override
  void didUnregisterListener() {
    if (_listenerCount > 0) _listenerCount--;
    _syncClock();
  }

  void _syncClock() {
    final shouldRun = !_disposed && _desiredActive && _listenerCount > 0;
    if (shouldRun == _clockAttached) return;
    _clockAttached = shouldRun;
    if (shouldRun) {
      _SharedPlaybackClock.instance.attach(this);
    } else {
      _offsetUs = (_value * _periodUs).round();
      _SharedPlaybackClock.instance.detach(this);
    }
  }

  void setDuration(Duration duration) {
    final next = duration.inMicroseconds > 0 ? duration.inMicroseconds : 1;
    if (next == _periodUs) return;
    _periodUs = next;
    _offsetUs = (_value * _periodUs).round();
    if (_clockAttached) {
      _anchorUs = _SharedPlaybackClock.instance._lastElapsedUs - _offsetUs;
    }
  }

  void setProgress(double value) {
    if (_disposed) return;
    _value = value.clamp(0.0, 1.0);
    _offsetUs = (_value * _periodUs).round();
    if (_clockAttached) {
      _anchorUs = _SharedPlaybackClock.instance._lastElapsedUs - _offsetUs;
    }
  }

  void reset(Duration duration) {
    _periodUs = duration.inMicroseconds > 0 ? duration.inMicroseconds : 1;
    _value = 0.0;
    _offsetUs = 0;
    if (_clockAttached) {
      _anchorUs = _SharedPlaybackClock.instance._lastElapsedUs;
    }
    notifyListeners();
  }

  void setActive(bool active) {
    if (_disposed || _desiredActive == active) return;
    _desiredActive = active;
    _syncClock();
  }

  void _advance(int nowUs) {
    if (_disposed || !_clockAttached) return;
    final elapsed = nowUs - _anchorUs;
    final mod = elapsed >= 0 ? elapsed % _periodUs : 0;
    final next = mod / _periodUs;
    if (next != _value) {
      _value = next;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _desiredActive = false;
    _listenerCount = 0;
    if (_clockAttached) {
      _clockAttached = false;
      _SharedPlaybackClock.instance.detach(this);
    }
    clearListeners();
    clearStatusListeners();
    super.dispose();
  }
}

/// Paints a caller-owned player, including a prepared raster cache.
/// The caller must dispose [player] and own the animation's lifecycle.
class FastLottieView extends StatefulWidget {
  /// Displays an existing player at the supplied progress.
  const FastLottieView({
    super.key,
    required this.player,
    required this.progress,
    this.width,
    this.height,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.useFrameRate = true,
    this.semanticLabel,
    this.excludeFromSemantics = false,
  });

  /// Player owned and disposed by the caller.
  final FastLottiePlayer player;

  /// Caller-owned animation supplying progress from zero to one.
  final Animation<double> progress;

  /// Requested width in logical pixels, subject to parent constraints.
  final double? width;

  /// Requested height in logical pixels, subject to parent constraints.
  final double? height;

  /// How to fit the composition inside the available space.
  final BoxFit fit;

  /// How to align the fitted composition inside the widget.
  final Alignment alignment;

  /// Whether to sample authored frames; false allows vector subframes.
  final bool useFrameRate;

  /// Optional accessibility label exposed via [Semantics] with `image: true`.
  final String? semanticLabel;

  /// Whether to exclude this animation from the semantics tree.
  final bool excludeFromSemantics;

  @override
  State<FastLottieView> createState() => _FastLottieViewState();
}

class _FastLottieViewState extends State<FastLottieView> {
  late final _FrameRepaint _repaint;

  @override
  void initState() {
    super.initState();
    _repaint = _FrameRepaint(
      widget.player,
      widget.progress,
      widget.useFrameRate,
      false,
    );
  }

  @override
  void didUpdateWidget(FastLottieView oldWidget) {
    super.didUpdateWidget(oldWidget);
    _repaint.update(widget.player, widget.progress, widget.useFrameRate, false);
  }

  @override
  void dispose() {
    _repaint.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = _resolveCompositionSize(
      widget.width,
      widget.height,
      widget.player.composition,
    );
    return _wrapSemantics(
      CustomPaint(
        size: size,
        painter: _FastPainter(
          widget.player,
          widget.progress,
          widget.fit,
          widget.alignment,
          widget.useFrameRate,
          false,
          MediaQuery.devicePixelRatioOf(context),
          repaint: _repaint,
        ),
      ),
      semanticLabel: widget.semanticLabel,
      excludeFromSemantics: widget.excludeFromSemantics,
    );
  }
}
