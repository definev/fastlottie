import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import '../../decoding.dart';
import '../network/network_stub.dart'
    if (dart.library.io) '../network/network_io.dart';
import '../network/network_types.dart';
import '../raster/raster_core.dart';
import '../scene/options.dart';

Future<Uint8List> loadAssetBytes(AssetBundle bundle, String name) async {
  final data = await bundle.load(name);
  return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
}

final _jsonBytesCodec = json.fuse(utf8);

FastLottieComposition _compileLottie((List<int>, FastLottieOptions) request) =>
    FastLottieComposition.fromBytes(request.$1, options: request.$2)
      ..prepareForPlayback();

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
    dynamic copy(dynamic value) {
      if (value is Map<String, dynamic>) {
        return value.map((k, v) => MapEntry(k, copy(v)));
      }
      if (value is List) return value.map(copy).toList();
      return value;
    }

    return FastLottieComposition._fromOwned(
      copy(json) as Map<String, dynamic>,
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
    return FastLottieComposition._fromOwned(
      _jsonBytesCodec.decode(decodeLottieBytes(source ?? bytes))
          as Map<String, dynamic>,
      options,
      sourceBytes: source,
    );
  }

  /// Decode gzip/TGS, parse UTF-8 JSON and compile the model off the UI isolate.
  /// Native compute returns the compiled Dart graph via Isolate.exit (no JSON
  /// round-trip). Web compute executes inline; rendering objects remain lazy.
  static Future<FastLottieComposition> fromBytesAsync(
    List<int> bytes, {
    FastLottieOptions options = const FastLottieOptions(),
  }) =>
      compute(_compileLottie, (bytes, options), debugLabel: 'fastlottie.parse');

  /// Loads a declared Flutter asset and compiles it via [fromBytesAsync].
  static Future<FastLottieComposition> loadAsset(
    String name, {
    AssetBundle? bundle,
    FastLottieOptions options = const FastLottieOptions(),
  }) async {
    final bytes = await loadAssetBytes(bundle ?? rootBundle, name);
    return FastLottieComposition.fromBytesAsync(bytes, options: options);
  }

  /// Fetches raw bytes (`.tgs` or `.json`) over HTTP/HTTPS or from [sourceCacheDirectory],
  /// supporting immediate socket abort via [cancelToken].
  static Future<FastLottieNetworkFetchResult> fetchNetworkBytes(
    Uri uri, {
    Map<String, String>? headers,
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
    int maximumBytes = 16 * 1024 * 1024,
  }) => platformFetchLottieBytes(
    uri,
    headers: headers,
    cancelToken: cancelToken,
    sourceCacheDirectory: sourceCacheDirectory,
    maximumBytes: maximumBytes,
  );

  /// Clears cached raw network payloads from [directoryPath].
  static Future<void> clearNetworkDiskCache(String directoryPath) =>
      platformClearNetworkCacheDirectory(directoryPath);

  /// Downloads (or reads from [sourceCacheDirectory]) and compiles a remote
  /// `.tgs` or Lottie JSON composition off the UI isolate.
  static Future<FastLottieComposition> loadNetwork(
    Uri uri, {
    Map<String, String>? headers,
    FastLottieOptions options = const FastLottieOptions(),
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
    int maximumBytes = 16 * 1024 * 1024,
    FastLottieNetworkByteLoader? loader,
  }) async {
    final Uint8List bytes;
    if (loader != null) {
      bytes = await loader(uri, headers: headers, cancelToken: cancelToken);
    } else {
      final result = await platformFetchLottieBytes(
        uri,
        headers: headers,
        cancelToken: cancelToken,
        sourceCacheDirectory: sourceCacheDirectory,
        maximumBytes: maximumBytes,
      );
      bytes = result.bytes;
    }
    if (cancelToken?.isCancelled ?? false) {
      throw const FastLottieNetworkCancelledException();
    }
    return FastLottieComposition.fromBytesAsync(bytes, options: options);
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
