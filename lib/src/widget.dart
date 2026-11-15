part of '../fastlottie.dart';

final class _DefaultPingPongScope {
  static FastLottieRasterCache? _shared;
  static int _refCount = 0;

  static FastLottieRasterCache acquire() {
    _refCount++;
    return _shared ??= FastLottieRasterCache.miniStrip(
      diskCacheDirectory: FastLottieRasterCache.defaultDiskDirectory,
    );
  }

  static void release() {
    if (_refCount > 0) _refCount--;
    if (_refCount == 0) {
      _shared?.dispose();
      _shared = null;
    }
  }
}

/// Playback policy supplied by the owning viewport or screen.
enum FastLottiePlayback { active, prewarm, hidden }

/// Controls descendants without polling layout on every animation tick.
///
/// The owner determines visibility (including occlusion). [FastLottiePlayback.prewarm]
/// prepares a poster; [FastLottiePlayback.hidden] keeps layout but stops painting,
/// detaches animation listeners and releases the widget's cache lease. External
/// controllers remain owned by their callers and are never stopped by this scope.
class FastLottiePlaybackScope extends InheritedWidget {
  const FastLottiePlaybackScope({
    super.key,
    required this.playback,
    required super.child,
  });

  final FastLottiePlayback playback;

  static FastLottiePlayback of(BuildContext context) =>
      context
          .dependOnInheritedWidgetOfExactType<FastLottiePlaybackScope>()
          ?.playback ??
      FastLottiePlayback.active;

  @override
  bool updateShouldNotify(FastLottiePlaybackScope oldWidget) =>
      playback != oldWidget.playback;
}

/// Plays a compiled composition. Animation ticks only repaint the canvas.
class FastLottie extends StatefulWidget {
  const FastLottie({
    super.key,
    required this.composition,
    this.controller,
    this.width,
    this.height,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.repeat = true,
    this.animate = true,
    this.useFrameRate = true,
    this.cache = const FastLottieCache(),
    this.rasterCache,
    this.rasterMode = FastLottieRasterMode.animation,
    this.resolutionScale,
    this.maximumFrameRate,
    this.usePipeline = true,
  });
  final FastLottieComposition composition;
  final Animation<double>? controller;
  final double? width, height;
  final BoxFit fit;
  final Alignment alignment;
  final bool repeat, animate, useFrameRate;
  final FastLottieCache cache;
  final FastLottieRasterCache? rasterCache;
  final FastLottieRasterMode rasterMode;
  final double? resolutionScale;
  final double? maximumFrameRate;

  /// Enables the shared Telegram-style worker + double-buffered ping-pong pipeline
  /// when [rasterCache] is omitted and [cache] allows caching.
  final bool usePipeline;

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
    FastLottieRasterCache? rasterCache,
    FastLottieRasterMode rasterMode = FastLottieRasterMode.animation,
    double? resolutionScale,
    double? maximumFrameRate,
    bool usePipeline = true,
    WidgetBuilder? placeholderBuilder,
    Widget Function(BuildContext context, Object error, VoidCallback retry)?
    errorBuilder,
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
    rasterCache: rasterCache,
    rasterMode: rasterMode,
    resolutionScale: resolutionScale,
    maximumFrameRate: maximumFrameRate,
    usePipeline: usePipeline,
    placeholderBuilder: placeholderBuilder,
    errorBuilder: errorBuilder,
  );

  @override
  State<FastLottie> createState() => _FastLottieState();
}

class _FastLottieState extends State<FastLottie>
    with SingleTickerProviderStateMixin {
  late FastLottiePlayer _player;
  late final AnimationController _controller;
  late final _FrameRepaint _repaint;
  bool _reducedMotion = false;
  FastLottiePlayback _playback = FastLottiePlayback.active;
  FastLottieRasterMode get _rasterMode =>
      _playback == FastLottiePlayback.prewarm
      ? FastLottieRasterMode.poster
      : widget.rasterMode;
  Animation<double> get _paintAnimation =>
      _playback == FastLottiePlayback.active
      ? animation
      : const AlwaysStoppedAnimation<double>(0);
  bool _repeating = false;
  bool _usesDefaultPipeline = false;
  Animation<double> get animation => widget.controller ?? _controller;

  FastLottieRasterCache? _resolveRasterCache() {
    if (widget.rasterCache != null) {
      if (_usesDefaultPipeline) {
        _usesDefaultPipeline = false;
        _DefaultPingPongScope.release();
      }
      return widget.rasterCache;
    }
    if (widget.usePipeline && widget.cache.maximumFrames > 0) {
      if (!_usesDefaultPipeline) {
        _usesDefaultPipeline = true;
        return _DefaultPingPongScope.acquire();
      }
      return _DefaultPingPongScope._shared;
    }
    if (_usesDefaultPipeline) {
      _usesDefaultPipeline = false;
      _DefaultPingPongScope.release();
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
    final effectiveRaster = _resolveRasterCache();
    _player = FastLottiePlayer(
      widget.composition,
      cache: widget.cache,
      rasterCache: effectiveRaster,
      rasterMode: _rasterMode,
      resolutionScale: widget.resolutionScale,
      maximumFrameRate: widget.maximumFrameRate,
    );
    _controller = AnimationController(
      vsync: this,
      duration: widget.composition.duration,
    );
    _repaint = _FrameRepaint(_player, animation, widget.useFrameRate, false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _reducedMotion = MediaQuery.disableAnimationsOf(context);
    final nextPlayback = FastLottiePlaybackScope.of(context);
    if (nextPlayback != _playback) {
      final previous = _player;
      _playback = nextPlayback;
      _player = FastLottiePlayer(
        widget.composition,
        cache: widget.cache,
        rasterCache: previous.rasterCache,
        rasterMode: _rasterMode,
        resolutionScale: widget.resolutionScale,
        maximumFrameRate: widget.maximumFrameRate,
      );
      _repaint.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
      previous.dispose();
    }
    _repaint.update(
      _player,
      _paintAnimation,
      widget.useFrameRate,
      widget.controller == null && _reducedMotion,
    );
    _play();
  }

  void _play() {
    if (_playback != FastLottiePlayback.active ||
        widget.controller != null ||
        !widget.animate ||
        _reducedMotion ||
        widget.composition.isStatic) {
      _controller.stop();
    } else if (widget.repeat) {
      if (!_controller.isAnimating || !_repeating) _controller.repeat();
    } else if (!_controller.isCompleted) {
      if (!_controller.isAnimating || _repeating) _controller.forward();
    }
    _repeating = widget.repeat;
  }

  @override
  void didUpdateWidget(FastLottie oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.composition != widget.composition ||
        oldWidget.cache != widget.cache ||
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
      if (widget.rasterCache != null) {
        nextRaster = widget.rasterCache;
        _usesDefaultPipeline = false;
      } else if (wantsDefault) {
        nextRaster = wasUsingDefault
            ? _DefaultPingPongScope._shared
            : _DefaultPingPongScope.acquire();
        _usesDefaultPipeline = true;
      } else {
        nextRaster = null;
        _usesDefaultPipeline = false;
      }

      final previousPlayer = _player;
      _player = FastLottiePlayer(
        widget.composition,
        cache: widget.cache,
        rasterCache: nextRaster,
        rasterMode: _rasterMode,
        resolutionScale: widget.resolutionScale,
        maximumFrameRate: widget.maximumFrameRate,
      );
      _repaint.update(
        _player,
        _paintAnimation,
        widget.useFrameRate,
        widget.controller == null && _reducedMotion,
      );
      previousPlayer.dispose();
      if (wasUsingDefault && !_usesDefaultPipeline) {
        _DefaultPingPongScope.release();
      }
      if (oldWidget.composition != widget.composition) {
        _controller.stop();
        _controller.duration = widget.composition.duration;
        _controller.value = 0;
      }
    } else {
      _repaint.update(
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
    _repaint.detachListeners();
    _player.dispose();
    _controller.dispose();
    if (_usesDefaultPipeline) {
      _usesDefaultPipeline = false;
      _DefaultPingPongScope.release();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: _playback == FastLottiePlayback.hidden
        ? SizedBox(
            width: widget.width ?? widget.composition.width,
            height: widget.height ?? widget.composition.height,
          )
        : CustomPaint(
            size: Size(
              widget.width ?? widget.composition.width,
              widget.height ?? widget.composition.height,
            ),
            painter: _FastPainter(
              _player,
              _paintAnimation,
              widget.fit,
              widget.alignment,
              widget.useFrameRate,
              widget.controller == null && _reducedMotion,
              MediaQuery.devicePixelRatioOf(context),
              repaint: _repaint,
            ),
          ),
  );
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
    _FrameRepaint? repaint,
  }) : super(
         repaint:
             repaint ??
             _FrameRepaint(player, animation, useFrameRate, reducedMotion),
       );
  final FastLottiePlayer player;
  final Animation<double> animation;
  final BoxFit fit;
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
      _animated ? player._relativeSample(animation.value, useFrameRate) : 0;

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

/// Paints a caller-owned player, including a prepared raster cache.
/// The caller must dispose [player] and own the animation's lifecycle.
class FastLottieView extends StatelessWidget {
  const FastLottieView({
    super.key,
    required this.player,
    required this.progress,
    this.width,
    this.height,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.useFrameRate = true,
  });
  final FastLottiePlayer player;
  final Animation<double> progress;
  final double? width, height;
  final BoxFit fit;
  final Alignment alignment;
  final bool useFrameRate;
  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: CustomPaint(
      size: Size(
        width ?? player.composition.width,
        height ?? player.composition.height,
      ),
      painter: _FastPainter(
        player,
        progress,
        fit,
        alignment,
        useFrameRate,
        false,
        MediaQuery.devicePixelRatioOf(context),
      ),
    ),
  );
}

/// Fetches, compiles off-isolate, and plays a remote `.tgs` / Lottie asset.
/// Cancels any active HTTP request cleanly if unmounted or if [uri] changes.
class FastLottieNetwork extends StatefulWidget {
  const FastLottieNetwork({
    super.key,
    required this.uri,
    this.headers,
    this.options = const FastLottieOptions(),
    this.sourceCacheDirectory,
    this.maximumNetworkBytes = 16 * 1024 * 1024,
    this.loader,
    this.controller,
    this.width,
    this.height,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.repeat = true,
    this.animate = true,
    this.useFrameRate = true,
    this.cache = const FastLottieCache(),
    this.rasterCache,
    this.rasterMode = FastLottieRasterMode.animation,
    this.resolutionScale,
    this.maximumFrameRate,
    this.usePipeline = true,
    this.placeholderBuilder,
    this.errorBuilder,
  });

  final Uri uri;
  final Map<String, String>? headers;
  final FastLottieOptions options;
  final String? sourceCacheDirectory;
  final int maximumNetworkBytes;
  final FastLottieNetworkByteLoader? loader;
  final Animation<double>? controller;
  final double? width, height;
  final BoxFit fit;
  final Alignment alignment;
  final bool repeat, animate, useFrameRate;
  final FastLottieCache cache;
  final FastLottieRasterCache? rasterCache;
  final FastLottieRasterMode rasterMode;
  final double? resolutionScale;
  final double? maximumFrameRate;
  final bool usePipeline;
  final WidgetBuilder? placeholderBuilder;
  final Widget Function(BuildContext context, Object error, VoidCallback retry)?
  errorBuilder;

  @override
  State<FastLottieNetwork> createState() => _FastLottieNetworkState();
}

class _FastLottieNetworkState extends State<FastLottieNetwork> {
  FastLottieCancelToken? _cancelToken;
  FastLottieComposition? _composition;
  Object? _error;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    _startLoad();
  }

  @override
  void didUpdateWidget(FastLottieNetwork oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.uri != widget.uri ||
        !mapEquals(oldWidget.headers, widget.headers) ||
        oldWidget.options.useSimd != widget.options.useSimd ||
        oldWidget.sourceCacheDirectory != widget.sourceCacheDirectory ||
        oldWidget.loader != widget.loader) {
      _startLoad();
    }
  }

  void _startLoad() {
    _cancelToken?.cancel();
    final token = FastLottieCancelToken();
    _cancelToken = token;
    final gen = ++_generation;
    _composition = null;
    _error = null;

    unawaited(
      FastLottieComposition.loadNetwork(
        widget.uri,
        headers: widget.headers,
        options: widget.options,
        cancelToken: token,
        sourceCacheDirectory: widget.sourceCacheDirectory,
        maximumBytes: widget.maximumNetworkBytes,
        loader: widget.loader,
      ).then<void>(
        (comp) {
          if (!mounted || gen != _generation || token.isCancelled) return;
          setState(() {
            _composition = comp;
            _error = null;
          });
        },
        onError: (Object error, StackTrace _) {
          if (!mounted || gen != _generation || token.isCancelled) return;
          if (error is FastLottieNetworkCancelledException) return;
          setState(() {
            _error = error;
          });
        },
      ),
    );
  }

  void _retry() {
    if (!mounted) return;
    setState(_startLoad);
  }

  @override
  void dispose() {
    _cancelToken?.cancel();
    _cancelToken = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final comp = _composition;
    if (comp != null) {
      return FastLottie(
        composition: comp,
        controller: widget.controller,
        width: widget.width,
        height: widget.height,
        fit: widget.fit,
        alignment: widget.alignment,
        repeat: widget.repeat,
        animate: widget.animate,
        useFrameRate: widget.useFrameRate,
        cache: widget.cache,
        rasterCache: widget.rasterCache,
        rasterMode: widget.rasterMode,
        resolutionScale: widget.resolutionScale,
        maximumFrameRate: widget.maximumFrameRate,
        usePipeline: widget.usePipeline,
      );
    }
    final err = _error;
    if (err != null) {
      final errBuilder = widget.errorBuilder;
      if (errBuilder != null) {
        return SizedBox(
          width: widget.width,
          height: widget.height,
          child: errBuilder(context, err, _retry),
        );
      }
      return SizedBox(width: widget.width, height: widget.height);
    }
    final placeholder = widget.placeholderBuilder;
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: placeholder?.call(context),
    );
  }
}
