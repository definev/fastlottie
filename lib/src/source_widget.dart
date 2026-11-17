part of '../fastlottie.dart';

/// Builds an error state and receives a callback that reloads the source.
typedef FastLottieErrorBuilder = Widget Function(
  BuildContext context,
  Object error,
  VoidCallback retry,
);

abstract class _FastLottieSource extends _FastLottieWidget {
  const _FastLottieSource({
    super.key,
    super.controller,
    super.width,
    super.height,
    super.fit,
    super.alignment,
    super.repeat,
    super.animate,
    super.useFrameRate,
    super.cache,
    super.rasterCache,
    super.rasterMode,
    super.resolutionScale,
    super.maximumFrameRate,
    super.usePipeline,
    this.options = const FastLottieOptions(),
    this.placeholderBuilder,
    this.errorBuilder,
  });

  /// Options used to compile the source.
  final FastLottieOptions options;

  /// Builds the content displayed while the source loads.
  final WidgetBuilder? placeholderBuilder;

  /// Builds the error state with a callback to retry loading.
  final FastLottieErrorBuilder? errorBuilder;

  Future<FastLottieComposition> _load(
    AssetBundle bundle,
    FastLottieCancelToken token,
  );
  bool _hasSameSource(_FastLottieSource other);
  bool get _usesDefaultBundle => false;

  @override
  State<_FastLottieSource> createState() => _FastLottieSourceState();
}

/// Loads and plays a declared Flutter asset containing JSON or gzip/TGS.
class FastLottieAsset extends _FastLottieSource {
  /// Loads [name] from [bundle] or the nearest [DefaultAssetBundle].
  const FastLottieAsset(
    this.name, {
    super.key,
    super.controller,
    super.width,
    super.height,
    super.fit,
    super.alignment,
    super.repeat,
    super.animate,
    super.useFrameRate,
    super.cache,
    super.rasterCache,
    super.rasterMode,
    super.resolutionScale,
    super.maximumFrameRate,
    super.usePipeline,
    this.bundle,
    super.options,
    super.placeholderBuilder,
    super.errorBuilder,
  });

  /// Asset key declared in the application's pubspec.
  final String name;

  /// Optional bundle override; null uses the ambient bundle.
  final AssetBundle? bundle;

  @override
  bool get _usesDefaultBundle => bundle == null;

  @override
  Future<FastLottieComposition> _load(
    AssetBundle ambientBundle,
    FastLottieCancelToken token,
  ) async {
    final bytes = await _loadAssetBytes(bundle ?? ambientBundle, name);
    if (token.isCancelled) throw const _SourceLoadCancelled();
    return FastLottieComposition.fromBytesAsync(bytes, options: options);
  }

  @override
  bool _hasSameSource(_FastLottieSource other) =>
      other is FastLottieAsset && other.name == name && other.bundle == bundle;
}

/// Decodes and plays caller-supplied JSON or gzip/TGS bytes.
class FastLottieBytes extends _FastLottieSource {
  /// Compiles [bytes] asynchronously on native platforms.
  /// Keep the list immutable and supply a new list when replacing the source.
  const FastLottieBytes(
    this.bytes, {
    super.key,
    super.controller,
    super.width,
    super.height,
    super.fit,
    super.alignment,
    super.repeat,
    super.animate,
    super.useFrameRate,
    super.cache,
    super.rasterCache,
    super.rasterMode,
    super.resolutionScale,
    super.maximumFrameRate,
    super.usePipeline,
    super.options,
    super.placeholderBuilder,
    super.errorBuilder,
  });

  /// Encoded JSON or gzip/TGS source, treated as immutable.
  final List<int> bytes;

  @override
  Future<FastLottieComposition> _load(
    AssetBundle bundle,
    FastLottieCancelToken token,
  ) => FastLottieComposition.fromBytesAsync(
    Uint8List.fromList(bytes),
    options: options,
  );

  @override
  bool _hasSameSource(_FastLottieSource other) =>
      other is FastLottieBytes && identical(other.bytes, bytes);
}

/// Fetches and plays a remote JSON or gzip/TGS composition.
/// Cancels an active request when removed or when its source changes.
class FastLottieNetwork extends _FastLottieSource {
  /// Creates a player that loads its composition from an HTTP(S) source.
  const FastLottieNetwork({
    required this.uri,
    this.headers,
    this.sourceCacheDirectory,
    this.maximumNetworkBytes = 16 * 1024 * 1024,
    this.loader,
    super.key,
    super.controller,
    super.width,
    super.height,
    super.fit,
    super.alignment,
    super.repeat,
    super.animate,
    super.useFrameRate,
    super.cache,
    super.rasterCache,
    super.rasterMode,
    super.resolutionScale,
    super.maximumFrameRate,
    super.usePipeline,
    super.options,
    super.placeholderBuilder,
    super.errorBuilder,
  });

  /// Location of the remote animation.
  final Uri uri;

  /// Optional headers sent with the request.
  final Map<String, String>? headers;

  /// Optional native directory for caching raw response bytes.
  final String? sourceCacheDirectory;

  /// Maximum response size for the default network loader.
  final int maximumNetworkBytes;

  /// Optional alternate loader for raw animation bytes.
  final FastLottieNetworkByteLoader? loader;

  @override
  Future<FastLottieComposition> _load(
    AssetBundle bundle,
    FastLottieCancelToken token,
  ) => FastLottieComposition.loadNetwork(
    uri,
    headers: headers,
    options: options,
    cancelToken: token,
    sourceCacheDirectory: sourceCacheDirectory,
    maximumBytes: maximumNetworkBytes,
    loader: loader,
  );

  @override
  bool _hasSameSource(_FastLottieSource other) =>
      other is FastLottieNetwork &&
      other.uri == uri &&
      mapEquals(other.headers, headers) &&
      other.sourceCacheDirectory == sourceCacheDirectory &&
      other.maximumNetworkBytes == maximumNetworkBytes &&
      other.loader == loader;
}

class _SourceLoadCancelled implements Exception {
  const _SourceLoadCancelled();
}

class _FastLottieSourceState extends State<_FastLottieSource> {
  FastLottieCancelToken? _cancelToken;
  FastLottieComposition? _composition;
  Object? _error;
  AssetBundle? _bundle;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final nextBundle = widget._usesDefaultBundle
        ? DefaultAssetBundle.of(context)
        : rootBundle;
    if (_bundle == null || nextBundle != _bundle) {
      _bundle = nextBundle;
      _startLoad();
    }
  }

  @override
  void didUpdateWidget(_FastLottieSource oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.options != widget.options ||
        !widget._hasSameSource(oldWidget)) {
      // Build follows didUpdateWidget, so loading state is visible immediately.
      // A newly ambient asset source must establish its inherited dependency.
      _bundle = widget._usesDefaultBundle
          ? DefaultAssetBundle.of(context)
          : rootBundle;
      _startLoad();
    }
  }

  void _startLoad() {
    _cancelToken?.cancel();
    final token = _cancelToken = FastLottieCancelToken();
    _composition = null;
    _error = null;
    unawaited(
      Future<FastLottieComposition>.sync(() => widget._load(_bundle!, token))
          .then<void>(
            (composition) {
              if (!mounted || token.isCancelled) return;
              setState(() => _composition = composition);
            },
            onError: (Object error, StackTrace stack) {
              if (!mounted || token.isCancelled) return;
              setState(() => _error = error);
            },
          ),
    );
  }

  void _retry() {
    if (mounted) setState(_startLoad);
  }

  @override
  void dispose() {
    _cancelToken?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final composition = _composition;
    if (composition != null) {
      return FastLottie(
        composition: composition,
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
    final error = _error;
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: error == null
          ? widget.placeholderBuilder?.call(context)
          : widget.errorBuilder?.call(context, error, _retry),
    );
  }
}
