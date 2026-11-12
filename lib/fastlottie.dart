/// A deliberately small Lottie renderer with compiled geometry and bounded caches.
library;

import 'dart:convert';
import 'dart:async';
import 'dart:collection';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import 'decoding.dart';
import 'src/bitstream_cache.dart';
import 'src/isolate_stub.dart' if (dart.library.isolate) 'src/isolate_io.dart';
import 'src/lz4.dart';
import 'src/network_stub.dart' if (dart.library.io) 'src/network_io.dart';
import 'src/network_types.dart';
import 'src/platform_stub.dart' if (dart.library.io) 'src/platform_io.dart';

export 'decoding.dart';
export 'src/network_types.dart';

part 'src/compiler.dart';
part 'src/track.dart';
part 'src/scene.dart';
part 'src/widget.dart';
part 'src/fork.dart';
part 'src/gradient.dart';
part 'src/path_ops.dart';
part 'src/raster_cache.dart';
part 'src/rle_rasterizer.dart';
part 'src/worker_pool.dart';
part 'src/ping_pong.dart';

final _jsonBytesCodec = json.fuse(utf8);

FastLottieComposition _compileLottie((List<int>, FastLottieOptions) request) =>
    FastLottieComposition.fromBytes(request.$1, options: request.$2)
      ..prepareForPlayback();

/// A feature outside fastlottie's supported subset, with its JSON location.
class UnsupportedLottieException extends FormatException {
  UnsupportedLottieException(this.jsonPath, String feature)
    : super('$feature at $jsonPath');
  final String jsonPath;
}

/// Compile-time controls. SIMD is opt-out.
@immutable
class FastLottieOptions {
  const FastLottieOptions({this.useSimd = true});
  final bool useSimd;
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
  );

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
    );
  }

  static FastLottieComposition _fromOwned(
    Map<String, dynamic> owned,
    FastLottieOptions options,
  ) {
    final compiler = _Compiler(options);
    compiler.compile(owned); // Validate the complete tree before returning it.
    return FastLottieComposition._(
      compiler.width,
      compiler.height,
      compiler.start,
      compiler.end,
      compiler.fps,
      compiler,
      options,
      compiler.isStatic,
    );
  }

  factory FastLottieComposition.fromBytes(
    List<int> bytes, {
    FastLottieOptions options = const FastLottieOptions(),
  }) => FastLottieComposition._fromOwned(
    _jsonBytesCodec.decode(decodeLottieBytes(bytes)) as Map<String, dynamic>,
    options,
  );

  /// Decode gzip/TGS, parse UTF-8 JSON and compile the model off the UI isolate.
  /// Native compute returns the compiled Dart graph via Isolate.exit (no JSON
  /// round-trip). Web compute executes inline; rendering objects remain lazy.
  static Future<FastLottieComposition> fromBytesAsync(
    List<int> bytes, {
    FastLottieOptions options = const FastLottieOptions(),
  }) =>
      compute(_compileLottie, (bytes, options), debugLabel: 'fastlottie.parse');

  static Future<FastLottieComposition> loadAsset(
    String name, {
    AssetBundle? bundle,
    FastLottieOptions options = const FastLottieOptions(),
  }) async {
    final data = await (bundle ?? rootBundle).load(name);
    return FastLottieComposition.fromBytesAsync(
      data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
      options: options,
    );
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
      bytes = await loader(
        uri,
        headers: headers,
        cancelToken: cancelToken,
      );
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

  final double width, height, startFrame, endFrame, frameRate;
  final FastLottieOptions options;

  /// Whether every visible value and layer visibility is constant over playback.
  final bool isStatic;
  final _Compiler _template;
  _Compiler? _preparedScene;

  String? _contentKey;

  /// Deterministic hash identifying identical compiled animation content
  /// across instances, Isolates, and disk `.cache` sessions.
  String get contentKey =>
      _contentKey ??= _computeCompositionContentKey(_template);

  /// Prepares the first player's pure Dart state. Call on the decoding worker;
  /// this allocates no Path/Paint/Shader. Later players initialize lazily.
  void prepareForPlayback() {
    contentKey;
    _preparedScene ??= _Fork(warm: true).scene(_template);
  }

  @visibleForTesting
  bool get debugHasPreparedScene => _preparedScene != null;
  Size get size => Size(width, height);
  Duration get duration => Duration(
    microseconds: ((endFrame - startFrame) / frameRate * 1000000).round(),
  );
  int get frameCount => (endFrame - startFrame).ceil();

  _Compiler _takeScene() {
    final prepared = _preparedScene;
    _preparedScene = null;
    return prepared ?? _Fork().scene(_template);
  }
}

/// Per-player frame cache limits. Pictures retain vectors, not raster pixels.
@immutable
class FastLottieCache {
  const FastLottieCache({
    this.maximumFrames = 120,
    this.maximumCommands = 100000,
  }) : assert(maximumFrames >= 0),
       assert(maximumCommands >= 0);
  static const none = FastLottieCache(maximumFrames: 0, maximumCommands: 0);

  /// Retains every drawn source frame as a resolution-independent [ui.Picture]
  /// display list without frame or command-count eviction.
  static const unbounded = FastLottieCache(
    maximumFrames: 1 << 20,
    maximumCommands: 1 << 30,
  );
  final int maximumFrames;

  /// Scene-complexity budget; this is not a native byte count.
  final int maximumCommands;
}

typedef FastLottieFallbackPainter = void Function(Canvas canvas, Rect target);

/// Stateful renderer; do not share a player between simultaneous animations.
/// Call [dispose] when its owner is removed.
class FastLottiePlayer extends ChangeNotifier {
  FastLottiePlayer(
    this.composition, {
    this.cache = const FastLottieCache(),
    this.rasterCache,
    this.rasterMode = FastLottieRasterMode.animation,
    this.resolutionScale,
    this.maximumFrameRate,
  }) {
    if (cache.maximumFrames < 0 || cache.maximumCommands < 0) {
      throw ArgumentError('Cache limits must be nonnegative');
    }
    if (resolutionScale != null &&
        (!resolutionScale!.isFinite ||
            resolutionScale! <= 0 ||
            resolutionScale! > 1)) {
      throw ArgumentError.value(resolutionScale, 'resolutionScale');
    }
    if (maximumFrameRate != null &&
        (!maximumFrameRate!.isFinite || maximumFrameRate! <= 0)) {
      throw ArgumentError.value(maximumFrameRate, 'maximumFrameRate');
    }
  }

  final FastLottieComposition composition;
  final FastLottieCache cache;
  final FastLottieRasterCache? rasterCache;
  final FastLottieRasterMode rasterMode;
  final double? resolutionScale;
  final double? maximumFrameRate;
  _RasterEntry? _rasterEntry;
  (Size, int)? _rasterRejectedKey;
  int _rasterRejectedGeneration = -1;
  void _rasterReady() {
    if (!_disposed) {
      notifyListeners();
    }
  }

  void _rasterInvalidated(_RasterEntry entry) {
    if (_rasterEntry == entry) {
      _rasterEntry = null;
      if (!_disposed) notifyListeners();
    }
  }

  _Compiler? _sceneState;
  _Compiler get _scene => _sceneState ??= composition._takeScene();
  @visibleForTesting
  bool get debugHasScene => _sceneState != null;
  final _pictures = <double, ui.Picture>{};
  bool _disposed = false;
  int _hits = 0, _misses = 0;
  List<ui.Image>? _rasterFrames;
  Size? _rasterSize;
  int _rasterGeneration = 0;
  final _rasterPaint = Paint()..filterQuality = FilterQuality.none;

  /// Allocated raster resolution in physical pixels, or null before preparation/admission.
  Size? get rasterSize {
    final frames = _rasterFrames;
    if (frames != null) {
      return Size(frames.first.width.toDouble(), frames.first.height.toDouble());
    }
    final entry = _rasterEntry;
    if (entry != null && !entry.retired) return entry.key.$2;
    return null;
  }

  int get rasterBytes {
    final frames = _rasterFrames;
    if (frames != null) {
      return frames.length * frames.first.width * frames.first.height * 4;
    }
    final entry = _rasterEntry;
    if (entry != null && !entry.retired) {
      var total = 0;
      final front = entry.renderingImage;
      if (front != null) total += front.width * front.height * 4;
      final back = entry.backgroundImage;
      if (back != null) total += back.width * back.height * 4;
      return total;
    }
    return 0;
  }

  /// Pre-render every source frame for a [width] × [height] logical viewport.
  /// Physical dimensions are ceil(logical dimensions × [devicePixelRatio]).
  /// Pass the current view's DPR and prepare again if it or the viewport changes.
  /// The default DPR of 1 preserves calls specifying physical pixels directly.
  /// Throws before allocating if the RGBA payload exceeds [maximumBytes].
  /// This trades startup work and memory for the cheapest repeated playback.
  /// GPU/engine overhead is additional to this RGBA payload budget.
  Future<void> prepareRaster({
    required num width,
    required num height,
    double devicePixelRatio = 1,
    int maximumBytes = 32 * 1024 * 1024,
  }) async {
    if (_disposed) throw StateError('FastLottiePlayer has been disposed');
    if (!width.isFinite ||
        !height.isFinite ||
        width <= 0 ||
        height <= 0 ||
        !devicePixelRatio.isFinite ||
        devicePixelRatio <= 0 ||
        maximumBytes < 0) {
      throw ArgumentError('Invalid raster dimensions/budget');
    }
    final contentSize = Size(
      width * devicePixelRatio,
      height * devicePixelRatio,
    );
    if (!contentSize.width.isFinite || !contentSize.height.isFinite) {
      throw ArgumentError('Invalid raster pixel dimensions');
    }
    final pixelWidth = contentSize.width.ceil();
    final pixelHeight = contentSize.height.ceil();
    final count = composition.isStatic ? 1 : composition.frameCount;
    if (pixelWidth * pixelHeight * 4 * count > maximumBytes) {
      throw ArgumentError('Raster frames exceed the RGBA memory budget');
    }
    final generation = ++_rasterGeneration;
    final images = <ui.Image>[];
    try {
      for (var i = 0; i < count; i++) {
        if (_disposed || generation != _rasterGeneration) {
          throw StateError('Raster preparation cancelled');
        }
        final recorder = ui.PictureRecorder();
        final canvas = Canvas(recorder)
          ..scale(
            contentSize.width / composition.width,
            contentSize.height / composition.height,
          );
        _scene.draw(
          canvas,
          composition.startFrame +
              math.min(
                i.toDouble(),
                math.max(
                  0.0,
                  composition.endFrame - composition.startFrame - 1,
                ),
              ),
        );
        final picture = recorder.endRecording();
        try {
          images.add(await picture.toImage(pixelWidth, pixelHeight));
        } finally {
          picture.dispose();
        }
      }
      if (_disposed || generation != _rasterGeneration) {
        throw StateError('Raster preparation cancelled');
      }
      for (final image in _rasterFrames ?? <ui.Image>[]) {
        image.dispose();
      }
      _rasterFrames = List.of(images);
      rasterCache?._release(this);
      // Keep the exact content extent separate from integer image allocation.
      // Fractional DPR/size can leave a padded final pixel; don't stretch it.
      _rasterSize = contentSize;
      images.clear();
      for (final picture in _pictures.values) {
        picture.dispose();
      }
      _pictures.clear();
      if (_pictures.isEmpty) {
        _sceneState = null;
      }
    } finally {
      for (final image in images) {
        image.dispose();
      }
    }
  }

  int get cachedFrames => _pictures.length;
  int get cacheHits => _hits;
  int get cacheMisses => _misses;
  int get estimatedCachedCommands =>
      _pictures.isEmpty ? 0 : _pictures.length * composition._template.commands;

  // Shared by drawing and repaint filtering so a 60 Hz controller driving a
  // 30 FPS raster cache cannot repaint the same image twice per sample.
  double _relativeSample(double progress, bool useFrameRate) {
    final span = composition.endFrame - composition.startFrame;
    var relative = (progress.clamp(0.0, 1.0) * span)
        .clamp(0.0, math.max(0.0, span - 1.0))
        .toDouble();
    final shared = rasterCache;
    if (shared != null && rasterMode == FastLottieRasterMode.poster) return 0;
    if (!useFrameRate) return relative;
    if (shared != null && _rasterFrames == null) {
      final step = shared._step(composition, maximumFrameRate);
      relative = (relative / step + 1e-7).floor() * step;
    } else {
      relative = (relative + 1e-7).floorToDouble();
    }
    return relative;
  }

  /// Paint progress in [0,1]. By default, quantize to the composition frame rate.
  /// Set [useFrameRate] false for subframe rendering (subframes are not cached).
  void draw(
    Canvas canvas,
    Rect destination,
    double progress, {
    BoxFit fit = BoxFit.contain,
    Alignment alignment = Alignment.center,
    bool useFrameRate = true,
    double devicePixelRatio = 1,
    FilterQuality? filterQuality,
    FastLottieFallbackPainter? coldFallback,
  }) {
    if (_disposed) throw StateError('FastLottiePlayer has been disposed');
    if (!progress.isFinite) throw ArgumentError.value(progress, 'progress');
    if (destination.isEmpty) return;
    final c = composition;
    // op is exclusive; progress=1 displays the last source frame.
    final rasterRelative = _relativeSample(progress, useFrameRate);
    final relative = useFrameRate
        ? rasterRelative.floorToDouble()
        : rasterRelative;
    final shared = rasterCache;
    final frame = c.startFrame + relative;
    final fitted = applyBoxFit(fit, c.size, destination.size);
    final source = alignment.inscribe(fitted.source, Offset.zero & c.size);
    final target = alignment.inscribe(fitted.destination, destination);
    final raster = _rasterFrames;
    if (raster != null && useFrameRate) {
      final index = c.isStatic ? 0 : relative.toInt();
      final sx = _rasterSize!.width / c.width,
          sy = _rasterSize!.height / c.height;
      canvas.drawImageRect(
        raster[index],
        Rect.fromLTRB(
          source.left * sx,
          source.top * sy,
          source.right * sx,
          source.bottom * sy,
        ),
        target,
        _rasterPaint,
      );
      _hits++;
      return;
    }
    if (shared != null && useFrameRate) {
      if (!devicePixelRatio.isFinite || devicePixelRatio <= 0) {
        throw ArgumentError.value(devicePixelRatio, 'devicePixelRatio');
      }
      final scale = resolutionScale ?? shared.resolutionScale;
      final pixels = Size(
        c.width * target.width / source.width * devicePixelRatio * scale,
        c.height * target.height / source.height * devicePixelRatio * scale,
      );
      final (image, entry, slotOffsetY) = shared._lookup(
        this,
        pixels,
        rasterRelative,
      );
      if (image != null) {
        final pw = entry?.key.$2.width ?? image.width.toDouble();
        final ph = entry?.key.$2.height ?? image.height.toDouble();
        final sx = pw / c.width;
        final sy = ph / c.height;
        try {
          canvas.drawImageRect(
            image,
            Rect.fromLTRB(
              source.left * sx,
              slotOffsetY + source.top * sy,
              source.right * sx,
              slotOffsetY + source.bottom * sy,
            ),
            target,
            shared._paintForScale(scale, filterQuality),
          );
          if (_pictures.isEmpty) {
            _sceneState = null;
          }
          return;
        } catch (error) {
          shared._failed(error);
        }
      } else if (coldFallback != null) {
        coldFallback(canvas, target);
        return;
      }
    }
    canvas.save();
    if (fitted.source != c.size) canvas.clipRect(destination);
    canvas.translate(target.left, target.top);
    canvas.scale(target.width / source.width, target.height / source.height);
    canvas.translate(-source.left, -source.top);
    final key = c.isStatic ? c.startFrame : frame;
    var picture = _pictures.remove(key);
    if (picture != null) {
      _hits++;
      _pictures[key] = picture;
      canvas.drawPicture(picture);
    } else {
      _misses++;
      if (useFrameRate &&
          shared == null &&
          cache.maximumFrames > 0 &&
          _scene.commands <= cache.maximumCommands) {
        final recorder = ui.PictureRecorder();
        _scene.draw(Canvas(recorder), frame);
        picture = recorder.endRecording();
        _pictures[key] = picture;
        while (_pictures.length > cache.maximumFrames ||
            estimatedCachedCommands > cache.maximumCommands) {
          _pictures.remove(_pictures.keys.first)!.dispose();
        }
        canvas.drawPicture(picture);
      } else {
        _scene.draw(canvas, frame);
      }
    }
    canvas.restore();
  }

  void clearCache() {
    rasterCache?._release(this);
    _rasterRejectedKey = null;
    _rasterRejectedGeneration = -1;
    _rasterGeneration++;
    for (final image in _rasterFrames ?? <ui.Image>[]) {
      image.dispose();
    }
    _rasterFrames = null;
    _rasterSize = null;
    for (final picture in _pictures.values) {
      picture.dispose();
    }
    _pictures.clear();
  }

  @override
  void dispose() {
    if (_disposed) return;
    clearCache();
    _sceneState = null;
    _disposed = true;
    super.dispose();
  }
}
