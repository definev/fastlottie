import 'dart:async';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'clock.dart';
import 'emoji_posters.dart';
import 'network_server_types.dart';
import 'store.dart';

// Spatial and temporal quality caps for inline emojis and 5-column picker cells.
const stickerThumbnailPixels = 112;
const stickerThumbnailFrameRate = 30.0;
const stickerSheetBytes = 64 * 1024 * 1024;

/// Shares the requested playback quality across sheets backed by the same
/// raster pipeline. Density is exposed for telemetry; it never silently lowers
/// frame rate. Applications that prefer power savings can set [qualityScale].
class StickerPlaybackBudget extends ChangeNotifier {
  StickerPlaybackBudget({
    this.maximumFrameRate = stickerThumbnailFrameRate,
    double qualityScale = 1,
  }) : _qualityScale = qualityScale {
    if (!qualityScale.isFinite || qualityScale <= 0 || qualityScale > 1) {
      throw ArgumentError.value(qualityScale, 'qualityScale');
    }
  }

  final double maximumFrameRate;
  final _pins = <Object, int>{};
  double _qualityScale;
  bool _disposed = false;

  int get activeAssets => _pins.length;
  double get frameRate => maximumFrameRate * _qualityScale;
  double get qualityScale => _qualityScale;
  set qualityScale(double value) {
    if (!value.isFinite || value <= 0 || value > 1) {
      throw ArgumentError.value(value, 'qualityScale');
    }
    if (_qualityScale == value) return;
    _qualityScale = value;
    notifyListeners();
  }

  void acquire(Object asset) {
    if (_disposed) return;
    _pins[asset] = (_pins[asset] ?? 0) + 1;
  }

  void release(Object asset) {
    if (_disposed) return;
    final count = _pins[asset];
    if (count == null) return;
    if (count <= 1) {
      _pins.remove(asset);
    } else {
      _pins[asset] = count - 1;
    }
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _pins.clear();
    super.dispose();
  }
}

/// Coordinates ping-pong / Mini-Strip players and lazy TGS model acquisition
/// per unique asset. All animations sharing the same asset/size deduplicate to
/// a single double-buffered GPU entry (`renderingImage` + `backgroundImage`,
/// packed as Mini-Strips by default) and LZ4 `.flcache` disk stream.
class StickerSheet extends ChangeNotifier {
  StickerSheet({
    required this.assets,
    required this.pixelSize,
    TgsStoreBase? store,
    FastLottieRasterCache? rasterCache,
    this.maximumBytes = stickerSheetBytes,
    this.frameRate = stickerThumbnailFrameRate,
    this.framesPerStrip,
    this.posterCache,
    StickerPlaybackBudget? playbackBudget,
  }) : store =
           store ??
           TgsStore(concurrency: 1, maximumEntries: 64, framePaced: true),
       _ownsStore = store == null,
       rasterCache =
           rasterCache ??
           FastLottieRasterCache(
             maximumBytes: maximumBytes,
             maximumFrameRate: frameRate,
             framesPerStrip: framesPerStrip,
           ),
       _ownsCache = rasterCache == null,
       playbackBudget =
           playbackBudget ?? StickerPlaybackBudget(maximumFrameRate: frameRate),
       _ownsPlaybackBudget = playbackBudget == null {
    this.playbackBudget.addListener(_onPlaybackBudgetChanged);
  }

  final List<String> assets;
  final int pixelSize, maximumBytes;
  final double frameRate;
  final int? framesPerStrip;
  final PackPosterCache? posterCache;
  final TgsStoreBase store;
  final bool _ownsStore;
  final FastLottieRasterCache rasterCache;
  final bool _ownsCache;
  final StickerPlaybackBudget playbackBudget;
  final bool _ownsPlaybackBudget;

  final _entries = <String, _SheetAsset>{};
  final _pendingNotifyAssets = <_SheetAsset>{};
  final errors = <String, Object>{};
  bool constrained = false;
  bool _disposed = false, _active = true, _notifyScheduled = false;

  late final Map<String, int> _assetOrdinals = {
    for (var i = 0; i < assets.length; i++) assets[i]: i,
  };

  _SheetAsset _entryFor(String asset) => _entries.putIfAbsent(
    asset,
    () => _SheetAsset(
      asset,
      playbackRate: frameRate,
      phaseSample: _phaseSampleFor(asset),
    ),
  );

  int _phaseSampleFor(String asset) {
    final width = math.max(1, rasterCache.framesPerStrip ?? 4);
    return (_assetOrdinals[asset] ?? asset.hashCode).abs() % width;
  }

  void _onPlaybackBudgetChanged() {
    if (_disposed) return;
    final rate = playbackBudget.frameRate;
    var changed = false;
    for (final entry in _entries.values) {
      if (entry.pins == 0 || entry.playbackRate == rate) continue;
      entry.configurePlayback(rate, entry.phaseSample);
      if (entry.player != null) {
        entry.detachPlayer();
        _attachPlayer(entry);
      }
      entry.notifyAssetChanged();
      changed = true;
    }
    if (changed) notifyListeners();
  }

  bool get active => _active;
  set active(bool value) {
    if (_active == value) return;
    _active = value;
    if (_ownsCache) {
      rasterCache.enabled = value;
    }
    if (value && !constrained) {
      resumePreparation();
    }
  }

  /// Active pinned player count (one per visible distinct asset at most).
  int get activePlayers {
    var count = 0;
    for (final e in _entries.values) {
      if (e.player != null) count++;
    }
    return count;
  }

  FastLottiePlayer? playerFor(String asset) => _entries[asset]?.player;

  Object? errorFor(String asset) => _entries[asset]?.error;

  ValueListenable<Object?> errorListenableFor(String asset) =>
      _entryFor(asset).errorNotifier;

  void retryAsset(String asset) {
    if (_disposed) return;
    final entry = _entries[asset];
    if (entry == null) return;
    entry.error = null;
    entry.errorNotifier.value = null;
    errors.remove(asset);
    if (entry.pins > 0 &&
        entry.composition == null &&
        entry.lease == null &&
        _active &&
        !constrained) {
      _startLoad(entry);
    }
    entry.notifyAssetChanged();
    notifyListeners();
  }

  void clearLoadedModels() {
    if (_disposed) return;
    for (final entry in _entries.values) {
      entry.detachPlayer();
      final pendingLease = entry.lease;
      entry.lease = null;
      pendingLease?.release();
      entry.composition = null;
      entry.error = null;
      entry.errorNotifier.value = null;
      entry.notifyAssetChanged();
    }
    errors.clear();
    notifyListeners();
  }

  /// Returns a merged listenable for [asset] + [clock] so only widgets showing
  /// [asset] repaint when its model or ping-pong frame arrives.
  Listenable listenableFor(String asset, StickerClock clock) => _entries
      .putIfAbsent(
        asset,
        () => _SheetAsset(
          asset,
          playbackRate: frameRate,
          phaseSample: _phaseSampleFor(asset),
        ),
      )
      .listenableWith(clock);

  /// Returns the phased, density-budgeted timeline position for one thumbnail.
  double progressFor(
    String asset,
    StickerClock clock, {
    bool still = false,
    PackPoster? poster,
  }) {
    if (still) return poster?.progress ?? 0;
    final entry = _entries[asset];
    final player = entry?.player;
    if (entry == null || player == null) return 0;
    final c = player.composition;
    final span = c.endFrame - c.startFrame;
    if (c.isStatic || span <= 0) return 0;
    final rate = math.min(c.frameRate, entry.playbackRate);
    final sourceStep = math.max(1.0, c.frameRate / rate);
    final sample = entry.clockSample(clock);
    final double phaseFrames;
    final int elapsedSamples;
    if (poster == null) {
      phaseFrames = entry.phaseSample * sourceStep;
      elapsedSamples = sample;
    } else {
      if (entry.playbackStartSample == null && player.rasterBytes == 0) {
        return poster.progress;
      }
      // Start on the shared sample grid even if the image arrived between ticks.
      entry.playbackStartSample ??= sample;
      phaseFrames = poster.progress * span;
      elapsedSamples = sample - entry.playbackStartSample!;
    }
    final frame = ((elapsedSamples * sourceStep + phaseFrames) % span)
        .clamp(0.0, span > 1 ? span - 1 : 0.0)
        .toDouble();
    return frame / span;
  }

  void acquirePin(String asset) {
    if (_disposed) return;
    final entry = _entryFor(asset);
    entry.pins++;
    if (entry.pins == 1) playbackBudget.acquire((asset, pixelSize));
    if (entry.pins == 1 && entry.composition != null && entry.player == null) {
      _attachPlayer(entry);
    } else if (entry.composition == null &&
        entry.lease == null &&
        entry.error == null &&
        _active &&
        !constrained) {
      _startLoad(entry);
    }
  }

  void releasePin(String asset) {
    if (_disposed) return;
    final entry = _entries[asset];
    if (entry == null) return;
    if (entry.pins == 0 || --entry.pins != 0) return;
    entry.detachPlayer();
    playbackBudget.release((asset, pixelSize));
    // Only the bounded store should retain an offscreen model.
    entry.composition = null;
    final lease = entry.lease;
    entry.lease = null;
    lease?.release();
  }

  void resumePreparation() {
    if (_disposed || !_active || constrained) return;
    for (final entry in _entries.values) {
      if (entry.pins > 0 &&
          entry.composition == null &&
          entry.lease == null &&
          entry.error == null) {
        _startLoad(entry);
      }
    }
  }

  Future<void> prepare() async {
    // Models load on demand per pinned cell and render via background ping-pong workers.
  }

  void _startLoad(_SheetAsset entry) {
    if (_disposed || entry.lease != null || entry.composition != null) return;
    final lease = store.acquire(entry.asset);
    entry.lease = lease;
    final ready = lease.ready;
    if (ready != null) {
      _onLoaded(entry, lease, ready, deferNotify: true);
      return;
    }
    lease.future.then(
      (model) => _onLoaded(entry, lease, model),
      onError: (Object error, StackTrace _) {
        if (_disposed || !identical(entry.lease, lease)) return;
        entry.lease = null;
        lease.release();
        if (error is! TgsLoadCancelled) {
          entry.error = error;
          entry.errorNotifier.value = error;
          errors[entry.asset] = error;
          entry.notifyAssetChanged();
          notifyListeners();
        }
      },
    );
  }

  void _scheduleDeferredNotify(_SheetAsset entry) {
    _pendingNotifyAssets.add(entry);
    if (_notifyScheduled) return;
    _notifyScheduled = true;
    scheduleMicrotask(() {
      _notifyScheduled = false;
      if (_disposed) {
        _pendingNotifyAssets.clear();
        return;
      }
      final batch = _pendingNotifyAssets.toList(growable: false);
      _pendingNotifyAssets.clear();
      for (final assetEntry in batch) {
        if (!assetEntry.disposed) {
          assetEntry.notifyAssetChanged();
        }
      }
      notifyListeners();
    });
  }

  void _onLoaded(
    _SheetAsset entry,
    TgsLease lease,
    TgsModel model, {
    bool deferNotify = false,
  }) {
    if (_disposed || entry.pins == 0 || !identical(entry.lease, lease)) {
      lease.release();
      return;
    }
    final comp = model.fast;
    if (comp == null) {
      entry.lease = null;
      lease.release();
      return;
    }
    // Keep the lease while visible so store accounting includes this model.
    entry.composition = comp;
    if (entry.pins > 0 && entry.player == null) {
      _attachPlayer(entry);
      if (deferNotify) {
        _scheduleDeferredNotify(entry);
      } else {
        entry.notifyAssetChanged();
        notifyListeners();
      }
    }
  }

  void _attachPlayer(_SheetAsset entry) {
    final comp = entry.composition;
    if (comp == null || _disposed) return;
    entry.configurePlayback(playbackBudget.frameRate, entry.phaseSample);
    final player = FastLottiePlayer(
      comp,
      cache: FastLottieCache.none,
      rasterCache: rasterCache,
      maximumFrameRate: entry.playbackRate,
    );
    entry.attachPlayer(player);
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    playbackBudget.removeListener(_onPlaybackBudgetChanged);
    _pendingNotifyAssets.clear();
    for (final entry in _entries.values) {
      if (entry.pins > 0) playbackBudget.release((entry.asset, pixelSize));
      entry.dispose();
    }
    _entries.clear();
    if (_ownsCache) rasterCache.dispose();
    if (_ownsStore && store is TgsStore) (store as TgsStore).dispose();
    if (_ownsPlaybackBudget) playbackBudget.dispose();
    super.dispose();
  }
}

final class _SheetAsset {
  _SheetAsset(
    this.asset, {
    required this.playbackRate,
    required this.phaseSample,
  });
  final String asset;
  final ChangeNotifier notifier = ChangeNotifier();
  final ValueNotifier<Object?> errorNotifier = ValueNotifier<Object?>(null);
  final _clockMerges = <StickerClock, _MergedAssetClock>{};

  TgsLease? lease;
  FastLottieComposition? composition;
  FastLottiePlayer? player;
  Object? error;
  int pins = 0;
  double playbackRate;
  int phaseSample;
  int? playbackStartSample;
  bool disposed = false;

  int clockSample(StickerClock clock) {
    final sourceRate = composition?.frameRate ?? playbackRate;
    final rate = math.min(sourceRate, playbackRate);
    return ((clock.microseconds + 1) * rate / 1000000).floor();
  }

  void configurePlayback(double rate, int phase) {
    if (playbackRate == rate && phaseSample == phase) return;
    playbackRate = rate;
    phaseSample = phase;
    for (final merge in _clockMerges.values) {
      merge.resetClockBucket();
    }
  }

  void _onPlayerFrame() => notifyAssetChanged();

  void notifyAssetChanged() {
    if (disposed) return;
    // ignore: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member
    notifier.notifyListeners();
  }

  void attachPlayer(FastLottiePlayer next) {
    if (identical(player, next)) return;
    detachPlayer();
    player = next;
    next.addListener(_onPlayerFrame);
  }

  void detachPlayer() {
    final p = player;
    if (p == null) return;
    player = null;
    playbackStartSample = null;
    p.removeListener(_onPlayerFrame);
    p.dispose();
  }

  Listenable listenableWith(StickerClock clock) => _clockMerges.putIfAbsent(
    clock,
    () => _MergedAssetClock(notifier, clock, this),
  );

  void dispose() {
    if (disposed) return;
    disposed = true;
    detachPlayer();
    composition = null;
    final pendingLease = lease;
    lease = null;
    pendingLease?.release();
    for (final merge in _clockMerges.values) {
      merge.dispose();
    }
    _clockMerges.clear();
    errorNotifier.dispose();
    notifier.dispose();
  }
}

class _MergedAssetClock extends ChangeNotifier {
  _MergedAssetClock(this.assetNotifier, this.clock, this.asset);
  final ChangeNotifier assetNotifier;
  final StickerClock clock;
  final _SheetAsset asset;
  bool _subscribed = false;
  bool _disposed = false;
  int _clockBucket = -1;

  void _forwardAsset() {
    if (!_disposed) notifyListeners();
  }

  void _forwardClock() {
    final composition = asset.player?.composition;
    if (_disposed || composition == null || composition.isStatic) return;
    final bucket = asset.clockSample(clock);
    if (bucket == _clockBucket) return;
    _clockBucket = bucket;
    notifyListeners();
  }

  void resetClockBucket() => _clockBucket = -1;

  void _unsubscribe() {
    if (!_subscribed) return;
    _subscribed = false;
    assetNotifier.removeListener(_forwardAsset);
    clock.removeListener(_forwardClock);
  }

  @override
  void addListener(VoidCallback listener) {
    if (_disposed) return;
    super.addListener(listener);
    if (!_subscribed && hasListeners) {
      _subscribed = true;
      assetNotifier.addListener(_forwardAsset);
      clock.addListener(_forwardClock);
    }
  }

  @override
  void removeListener(VoidCallback listener) {
    if (_disposed) return;
    super.removeListener(listener);
    if (_subscribed && !hasListeners) {
      _unsubscribe();
    }
  }

  @override
  void dispose() {
    if (_disposed) return;
    _unsubscribe();
    _disposed = true;
    super.dispose();
  }
}
