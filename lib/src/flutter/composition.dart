import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import '../../decoding.dart';
import '../network/network_coalescer.dart';
import '../network/network_stub.dart'
    if (dart.library.io) '../network/network_io.dart'
    if (dart.library.js_interop) '../network/network_web.dart';
import '../network/network_types.dart';
import '../platform/compile_pool_stub.dart'
    if (dart.library.isolate) '../platform/compile_pool_io.dart';
import '../raster/raster_core.dart';
import '../scene/options.dart';

Future<Uint8List> loadAssetBytes(AssetBundle bundle, String name) async {
  final data = await bundle.load(name);
  return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
}

final _jsonBytesCodec = json.fuse(utf8);
const _initialMaximumNetworkDiskBytes = defaultMaximumNetworkDiskBytes;

FastLottieComposition _compileLottie(
  List<int> bytes,
  FastLottieOptions options,
  bool prepareForVector,
) {
  final comp = FastLottieComposition.fromBytes(bytes, options: options);
  comp.contentKey;
  if (prepareForVector) {
    comp.prepareForPlayback();
  }
  return comp;
}

/// Compiled, reusable composition. Each player owns its mutable render state.
class FastLottieComposition {
  FastLottieComposition._(
    this.width,
    this.height,
    this.startFrame,
    this.endFrame,
    this.frameRate,
    this._template,
    this.options,
    this.isStatic,
    this._workerSource,
  );

  /// Compiles an owned copy of a JSON document synchronously.
  /// On web, also retains encoded source bytes for browser worker compilation.
  factory FastLottieComposition.fromJson(
    Map<String, dynamic> json, {
    FastLottieOptions options = const FastLottieOptions(),
  }) {
    const maxDepth = 256;
    dynamic copy(dynamic value, int depth) {
      if (depth > maxDepth) {
        throw const FormatException('JSON nesting depth exceeds $maxDepth');
      }
      if (value is Map<String, dynamic>) {
        return value.map((k, v) => MapEntry(k, copy(v, depth + 1)));
      }
      if (value is List) {
        return value.map((v) => copy(v, depth + 1)).toList();
      }
      return value;
    }

    return FastLottieComposition._fromOwned(
      copy(json, 0) as Map<String, dynamic>,
      options,
      sourceBytes: kIsWeb
          ? Uint8List.fromList(_jsonBytesCodec.encode(json))
          : null,
    );
  }

  static FastLottieComposition _fromOwned(
    Map<String, dynamic> owned,
    FastLottieOptions options, {
    Uint8List? sourceBytes,
  }) {
    final compiler = RasterScene.compile(owned, options);
    return FastLottieComposition._(
      compiler.width,
      compiler.height,
      compiler.start,
      compiler.end,
      compiler.fps,
      compiler,
      options,
      compiler.isStatic,
      sourceBytes,
    );
  }

  /// Decodes JSON or gzip/TGS bytes and compiles synchronously.
  /// Use [fromBytesAsync] to move native compilation off the UI isolate.
  factory FastLottieComposition.fromBytes(
    List<int> bytes, {
    FastLottieOptions options = const FastLottieOptions(),
  }) {
    final source = kIsWeb ? Uint8List.fromList(bytes) : null;
    final compiler = RasterScene.compileBytes(
      decodeLottieBytes(source ?? bytes),
      options,
    );
    return FastLottieComposition._(
      compiler.width,
      compiler.height,
      compiler.start,
      compiler.end,
      compiler.fps,
      compiler,
      options,
      compiler.isStatic,
      source,
    );
  }

  /// Decode gzip/TGS, parse UTF-8 JSON and compile the model off the UI isolate
  /// using a reusable persistent compile worker pool.
  ///
  /// Set [prepareForVector] true to eagerly pre-fork the first Tier-C vector
  /// scene on the compile worker; default `false` avoids wasted forks when
  /// using the Tier-B raster pipeline.
  static Future<FastLottieComposition> fromBytesAsync(
    List<int> bytes, {
    FastLottieOptions options = const FastLottieOptions(),
    bool prepareForVector = false,
  }) => runInCompilePool(bytes, options, prepareForVector, _compileLottie);

  /// Loads a declared Flutter asset and compiles it via [fromBytesAsync].
  static Future<FastLottieComposition> loadAsset(
    String name, {
    AssetBundle? bundle,
    FastLottieOptions options = const FastLottieOptions(),
    bool prepareForVector = false,
  }) async {
    final bytes = await loadAssetBytes(bundle ?? rootBundle, name);
    return FastLottieComposition.fromBytesAsync(
      bytes,
      options: options,
      prepareForVector: prepareForVector,
    );
  }

  static int _defaultMaximumNetworkDiskBytes = _initialMaximumNetworkDiskBytes;
  static final _loadNetworkCoalescer =
      NetworkRequestCoalescer<FastLottieComposition>();

  /// Default byte cap for raw `.tgsbin` network disk caches on native
  /// platforms (defaults to 64 MiB; set 0 to disable raw disk writes).
  static int get defaultMaximumNetworkDiskBytes =>
      _defaultMaximumNetworkDiskBytes;
  static set defaultMaximumNetworkDiskBytes(int value) {
    RangeError.checkNotNegative(value, 'defaultMaximumNetworkDiskBytes');
    _defaultMaximumNetworkDiskBytes = value;
  }

  /// Fetches raw bytes (`.tgs` or `.json`) over HTTP/HTTPS or from [sourceCacheDirectory],
  /// supporting immediate abort via [cancelToken] and bounded LRU disk caching.
  static Future<FastLottieNetworkFetchResult> fetchNetworkBytes(
    Uri uri, {
    Map<String, String>? headers,
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
    int maximumBytes = 16 * 1024 * 1024,
    int? maximumSourceCacheBytes,
  }) async {
    final diskCap = maximumSourceCacheBytes ?? _defaultMaximumNetworkDiskBytes;
    RangeError.checkNotNegative(diskCap, 'maximumSourceCacheBytes');
    return platformFetchLottieBytes(
      uri,
      headers: headers,
      cancelToken: cancelToken,
      sourceCacheDirectory: sourceCacheDirectory,
      maximumBytes: maximumBytes,
      maximumCacheBytes: diskCap,
    );
  }

  /// Clears cached raw network payloads from [directoryPath].
  static Future<void> clearNetworkDiskCache(String directoryPath) =>
      platformClearNetworkCacheDirectory(directoryPath);

  /// Downloads (or reads from [sourceCacheDirectory]) and compiles a remote
  /// `.tgs` or Lottie JSON composition off the UI isolate, coalescing
  /// concurrent requests for the same resource.
  static Future<FastLottieComposition> loadNetwork(
    Uri uri, {
    Map<String, String>? headers,
    FastLottieOptions options = const FastLottieOptions(),
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
    int maximumBytes = 16 * 1024 * 1024,
    int? maximumSourceCacheBytes,
    FastLottieNetworkByteLoader? loader,
  }) async {
    final diskCap = maximumSourceCacheBytes ?? _defaultMaximumNetworkDiskBytes;
    RangeError.checkNotNegative(diskCap, 'maximumSourceCacheBytes');

    void checkCancelled(FastLottieCancelToken? token) {
      if (token?.isCancelled ?? false) {
        throw const FastLottieNetworkCancelledException();
      }
    }

    Future<FastLottieComposition> compile(
      Uint8List bytes,
      FastLottieCancelToken? token,
    ) async {
      checkCancelled(token);
      final composition = await FastLottieComposition.fromBytesAsync(
        bytes,
        options: options,
      );
      checkCancelled(token);
      return composition;
    }

    if (loader != null) {
      checkCancelled(cancelToken);
      return compile(
        await loader(uri, headers: headers, cancelToken: cancelToken),
        cancelToken,
      );
    }

    String? normalizedCacheDir;
    if (sourceCacheDirectory != null && sourceCacheDirectory.isNotEmpty) {
      var end = sourceCacheDirectory.length;
      while (end > 1 &&
          (sourceCacheDirectory.codeUnitAt(end - 1) == 47 ||
              sourceCacheDirectory.codeUnitAt(end - 1) == 92)) {
        end--;
      }
      normalizedCacheDir = end == sourceCacheDirectory.length
          ? sourceCacheDirectory
          : sourceCacheDirectory.substring(0, end);
    }
    final requestHeaders = headers == null ? null : Map.of(headers);
    final coalesceKey = (
      canonicalNetworkRequestKey(uri, requestHeaders),
      options,
      normalizedCacheDir,
      maximumBytes,
      normalizedCacheDir != null ? diskCap : 0,
    );
    return _loadNetworkCoalescer.run(
      coalesceKey,
      cancelToken: cancelToken,
      start: (sharedToken) async {
        Future<FastLottieNetworkFetchResult> fetch(String? directory) =>
            platformFetchLottieBytes(
              uri,
              headers: requestHeaders,
              cancelToken: sharedToken,
              sourceCacheDirectory: directory,
              maximumBytes: maximumBytes,
              maximumCacheBytes: diskCap,
              cacheDownloadedBytes: false,
            );
        var result = await fetch(sourceCacheDirectory);
        if (result.fromDiskCache) {
          try {
            return await compile(result.bytes, sharedToken);
          } on FormatException {
            // A raw cache entry may predate validation or come from a raw fetch.
            result = await fetch(null);
          }
        }
        final composition = await compile(result.bytes, sharedToken);
        if (sourceCacheDirectory != null) {
          await platformCacheNetworkBytes(
            uri,
            result.bytes,
            directoryPath: sourceCacheDirectory,
            headers: requestHeaders,
            maximumCacheBytes: diskCap,
            cancelToken: sharedToken,
          );
          checkCancelled(sharedToken);
        }
        return composition;
      },
    );
  }

  /// Authored canvas width.
  final double width;

  /// Authored canvas height.
  final double height;

  /// Inclusive first frame of playback.
  final double startFrame;

  /// Exclusive end frame of playback.
  final double endFrame;

  /// Authored frames per second.
  final double frameRate;

  /// Options used when compiling this composition.
  final FastLottieOptions options;

  /// Whether every visible value and layer visibility is constant over playback.
  final bool isStatic;
  final RasterScene _template;
  RasterScene? _preparedScene;
  // The compiler can normalize the JSON it consumes. Keep the original input
  // for independent compilation in a Web Worker, compressed for TGS files.
  final Uint8List? _workerSource;

  String? _contentKey;

  /// Deterministic hash identifying identical compiled animation content
  /// across instances, Isolates, and disk `.cache` sessions.
  String get contentKey => _contentKey ??= _template.contentKey;

  /// Prepares the first player's pure Dart state. Call on the decoding worker;
  /// this allocates no Path/Paint/Shader. Later players initialize lazily.
  void prepareForPlayback() {
    contentKey;
    _preparedScene ??= _template.fork(warm: true);
  }

  /// Discards any pre-forked scene instance to free memory when using raster playback.
  /// Subsequent vector playback requests will fork lazily from the immutable template.
  void discardPreparedScene() {
    _preparedScene = null;
  }

  @visibleForTesting
  /// Whether first-player state has already been prepared.
  bool get debugHasPreparedScene => _preparedScene != null;

  /// Authored composition dimensions in logical units.
  Size get size => Size(width, height);

  /// Playback duration of the authored frame interval.
  Duration get duration => Duration(
    microseconds: ((endFrame - startFrame) / frameRate * 1000000).round(),
  );

  /// Number of source frame samples in the authored interval.
  int get frameCount => (endFrame - startFrame).ceil();

  RasterScene _takeScene() {
    final prepared = _preparedScene;
    _preparedScene = null;
    return prepared ?? _template.fork();
  }

  void _recycleScene(RasterScene scene) {
    _preparedScene ??= scene;
  }
}

// The player and worker pool use distinct scene ownership paths.
extension CompositionPlayback on FastLottieComposition {
  RasterScene get sceneTemplate => _template;
  Uint8List? get workerSource => _workerSource;

  RasterScene takeScene() => _takeScene();
  void recycleScene(RasterScene scene) => _recycleScene(scene);
}

/// Experimental trusted cache/build data; not a public interchange format.
@visibleForTesting
Uint8List debugEncodeCompiledComposition(
  FastLottieComposition composition, {
  int sourceBytes = 0,
}) => composition._template.snapshot(composition.contentKey, sourceBytes);

/// Restores fresh playback state while retaining immutable samples as views.
/// The caller gives up ownership of [bytes] and must not mutate it afterward.
@visibleForTesting
({FastLottieComposition composition, int sourceBytes})
debugDecodeCompiledComposition(
  Uint8List bytes, {
  bool directPlayback = false,
  bool deferPlayback = false,
}) {
  final data = deferPlayback
      ? RasterScene.deferSnapshot(bytes)
      : RasterScene.restoreSnapshot(bytes, warm: directPlayback);
  final scene = data.scene;
  return (
    composition:
        FastLottieComposition._(
            scene.width,
            scene.height,
            scene.start,
            scene.end,
            scene.fps,
            directPlayback && !deferPlayback
                ? scene.snapshotTemplate(bytes, data.key, data.sourceBytes)
                : scene,
            scene.options,
            scene.isStatic,
            null,
          )
          .._contentKey = data.key
          .._preparedScene = deferPlayback
              ? scene.fork()
              : directPlayback
              ? scene
              : null,
    sourceBytes: data.sourceBytes,
  );
}

/// A detached compiled scene for experimental raster benchmarks.
@visibleForTesting
RasterScene debugForkRasterScene(FastLottieComposition composition) =>
    composition._template.fork(warm: true);

/// Takes the prepared scene, if still available, for a single raster owner.
/// A later player can still fork its own state from the immutable template.
@visibleForTesting
RasterScene? debugTakePreparedRasterScene(FastLottieComposition composition) {
  final prepared = composition._preparedScene;
  composition._preparedScene = null;
  return prepared;
}
