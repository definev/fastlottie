import 'dart:async';
import 'dart:collection';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../cache/bitstream_cache.dart' show formatBitstreamEntryKey;
import '../raster/raster_core.dart' show RasterScene;
import '../worker/worker_pool.dart';
import 'composition.dart';

part 'raster_cache.dart';
part 'raster_coordinator.dart';

void _checkPositiveFinite(num value, String name) {
  if (!value.isFinite || value <= 0) {
    throw ArgumentError.value(
      value,
      name,
      'Must be finite and greater than zero',
    );
  }
}

void _checkResolutionScale(double scale) {
  _checkPositiveFinite(scale, 'resolutionScale');
  if (scale > 1) {
    throw RangeError.value(scale, 'resolutionScale', 'Must be at most 1');
  }
}

/// Per-player frame cache limits. Pictures retain vectors, not raster pixels.
@immutable
class FastLottieCache {
  /// Creates per-player vector picture limits.
  const FastLottieCache({
    this.maximumFrames = 120,
    this.maximumCommands = 100000,
  }) : assert(maximumFrames >= 0),
       assert(maximumCommands >= 0);

  /// Disables retention of vector pictures.
  static const none = FastLottieCache(maximumFrames: 0, maximumCommands: 0);

  /// Retains every drawn source frame as a resolution-independent [ui.Picture]
  /// display list without frame or command-count eviction.
  static const unbounded = FastLottieCache(
    maximumFrames: 1 << 20,
    maximumCommands: 1 << 30,
  );

  /// Maximum number of retained vector pictures.
  final int maximumFrames;

  /// Scene-complexity budget; this is not a native byte count.
  final int maximumCommands;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FastLottieCache &&
          other.runtimeType == runtimeType &&
          other.maximumFrames == maximumFrames &&
          other.maximumCommands == maximumCommands;

  @override
  int get hashCode => Object.hash(runtimeType, maximumFrames, maximumCommands);
}

/// Paints a temporary fallback while a shared raster frame is unavailable.
typedef FastLottieFallbackPainter = void Function(Canvas canvas, Rect target);

/// Stateful renderer; do not share a player between simultaneous animations.
/// Call [dispose] when its owner is removed.
class FastLottiePlayer extends ChangeNotifier {
  /// Creates independent playback state for [composition].
  FastLottiePlayer(
    this.composition, {
    this.cache = const FastLottieCache(),
    this.rasterCache,
    this.rasterMode = FastLottieRasterMode.animation,
    this.resolutionScale,
    this.maximumFrameRate,
  }) {
    RangeError.checkNotNegative(cache.maximumFrames, 'cache.maximumFrames');
    RangeError.checkNotNegative(cache.maximumCommands, 'cache.maximumCommands');
    if (resolutionScale case final scale?) _checkResolutionScale(scale);
    if (maximumFrameRate case final rate?) {
      _checkPositiveFinite(rate, 'maximumFrameRate');
    }
  }

  /// Shared compiled model rendered by this player.
  final FastLottieComposition composition;

  /// Limits for this player's vector picture cache.
  final FastLottieCache cache;

  /// Optional caller-owned cache shared with other players.
  final FastLottieRasterCache? rasterCache;

  /// Whether shared raster playback animates or holds its first frame.
  final FastLottieRasterMode rasterMode;

  /// Per-player physical resolution override; null uses the shared cache setting.
  final double? resolutionScale;

  /// Per-player sample rate cap; null uses the shared cache setting.
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

  RasterScene? _sceneState;
  RasterScene get _scene => _sceneState ??= composition.takeScene();
  @visibleForTesting
  /// Whether this player has constructed its mutable vector scene.
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
      return Size(
        frames.first.width.toDouble(),
        frames.first.height.toDouble(),
      );
    }
    final entry = _rasterEntry;
    if (entry != null && !entry.retired) return entry.key.$2;
    return null;
  }

  /// Retained raster payload bytes, excluding engine and GPU overhead.
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
    _checkPositiveFinite(width, 'width');
    _checkPositiveFinite(height, 'height');
    _checkPositiveFinite(devicePixelRatio, 'devicePixelRatio');
    RangeError.checkNotNegative(maximumBytes, 'maximumBytes');
    final contentSize = Size(
      width * devicePixelRatio,
      height * devicePixelRatio,
    );
    if (!contentSize.isFinite || contentSize.isEmpty) {
      final invalidWidth =
          !contentSize.width.isFinite || contentSize.width <= 0;
      throw ArgumentError.value(
        invalidWidth ? width : height,
        invalidWidth ? 'width' : 'height',
        'Must be positive and finite after scaling by devicePixelRatio ($devicePixelRatio)',
      );
    }
    final pixelWidth = contentSize.width.ceil();
    final pixelHeight = contentSize.height.ceil();
    final count = composition.isStatic ? 1 : composition.frameCount;
    // Divide before multiplying so an oversized request cannot wrap an int.
    if (pixelWidth > maximumBytes ~/ 4 ~/ count ~/ pixelHeight) {
      throw ArgumentError.value(
        maximumBytes,
        'maximumBytes',
        'Too small for $count RGBA frames at $pixelWidth × $pixelHeight pixels',
      );
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

  /// Number of retained vector pictures.
  int get cachedFrames => _pictures.length;

  /// Cumulative hits in this player's picture or prepared raster cache.
  int get cacheHits => _hits;

  /// Cumulative vector draws without a retained picture.
  int get cacheMisses => _misses;

  /// Estimated vector command count across retained pictures.
  int get estimatedCachedCommands => _pictures.isEmpty
      ? 0
      : _pictures.length * composition.sceneTemplate.commands;

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
      _checkPositiveFinite(devicePixelRatio, 'devicePixelRatio');
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

  /// Releases this player's pictures, prepared images and shared cache lease.
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

// Widget repaint filtering and drawing must use the same sample.
extension PlaybackSampling on FastLottiePlayer {
  double sampleForRepaint(double progress, bool useFrameRate) =>
      _relativeSample(progress, useFrameRate);
}
