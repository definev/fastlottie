import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'clock.dart';
import 'store.dart';

// Spatial and temporal quality caps for inline emojis and 5-column picker cells.
const stickerThumbnailPixels = 112;
const stickerThumbnailFrameRate = 30.0;
const stickerSheetBytes = 64 * 1024 * 1024;

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
    this.rasterStrategy = FastLottieRasterStrategy.miniStrip,
    this.stripFrames,
  }) : store =
           store ??
           TgsStore(concurrency: 1, maximumEntries: 64, framePaced: true),
       _ownsStore = store == null,
       rasterCache =
           rasterCache ??
           switch (rasterStrategy) {
             FastLottieRasterStrategy.miniStrip =>
               FastLottieRasterCache.miniStrip(
                 maximumBytes: maximumBytes,
                 maximumFrameRate: frameRate,
                 stripFrames: stripFrames,
               ),
             FastLottieRasterStrategy.pingPong =>
               FastLottieRasterCache.pingPong(
                 maximumBytes: maximumBytes,
                 maximumFrameRate: frameRate,
               ),
           },
       _ownsCache = rasterCache == null;

  final List<String> assets;
  final int pixelSize, maximumBytes;
  final double frameRate;
  final FastLottieRasterStrategy rasterStrategy;
  final int? stripFrames;
  final TgsStoreBase store;
  final bool _ownsStore;
  final FastLottieRasterCache rasterCache;
  final bool _ownsCache;

  final _entries = <String, _SheetAsset>{};
  final _pendingNotifyAssets = <_SheetAsset>{};
  final errors = <String, Object>{};
  bool constrained = false;
  bool _disposed = false, _active = true, _notifyScheduled = false;

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
      _entries.putIfAbsent(asset, () => _SheetAsset(asset)).errorNotifier;

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
  Listenable listenableFor(String asset, StickerClock clock) =>
      _entries.putIfAbsent(asset, () => _SheetAsset(asset)).listenableWith(clock);

  void acquirePin(String asset) {
    if (_disposed) return;
    final entry = _entries.putIfAbsent(asset, () => _SheetAsset(asset));
    entry.pins++;
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
    if (entry.pins > 0) entry.pins--;
    if (entry.pins == 0) {
      entry.detachPlayer();
      final lease = entry.lease;
      if (lease != null && entry.composition == null) {
        entry.lease = null;
        lease.release();
      }
    }
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
        if (_disposed) return;
        if (identical(entry.lease, lease)) {
          entry.lease = null;
          lease.release();
        }
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
    if (_disposed) {
      lease.release();
      return;
    }
    if (identical(entry.lease, lease)) {
      entry.lease = null;
    }
    lease.release();
    final comp = model.fast;
    if (comp == null) return;
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
    final player = FastLottiePlayer(
      comp,
      cache: FastLottieCache.none,
      rasterCache: rasterCache,
      maximumFrameRate: frameRate,
    );
    entry.attachPlayer(player);
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _pendingNotifyAssets.clear();
    for (final entry in _entries.values) {
      entry.dispose();
    }
    _entries.clear();
    if (_ownsCache) rasterCache.dispose();
    if (_ownsStore && store is TgsStore) (store as TgsStore).dispose();
    super.dispose();
  }
}

final class _SheetAsset {
  _SheetAsset(this.asset);
  final String asset;
  final ChangeNotifier notifier = ChangeNotifier();
  final ValueNotifier<Object?> errorNotifier = ValueNotifier<Object?>(null);
  final _clockMerges = <StickerClock, _MergedAssetClock>{};

  TgsLease? lease;
  FastLottieComposition? composition;
  FastLottiePlayer? player;
  Object? error;
  int pins = 0;
  bool disposed = false;

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
    p.removeListener(_onPlayerFrame);
    p.dispose();
  }

  Listenable listenableWith(StickerClock clock) => _clockMerges.putIfAbsent(
    clock,
    () => _MergedAssetClock(notifier, clock),
  );

  void dispose() {
    if (disposed) return;
    disposed = true;
    detachPlayer();
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
  _MergedAssetClock(this.assetNotifier, this.clock);
  final ChangeNotifier assetNotifier;
  final StickerClock clock;
  bool _subscribed = false;
  bool _disposed = false;

  void _forward() {
    if (!_disposed) notifyListeners();
  }

  void _unsubscribe() {
    if (!_subscribed) return;
    _subscribed = false;
    assetNotifier.removeListener(_forward);
    clock.removeListener(_forward);
  }

  @override
  void addListener(VoidCallback listener) {
    if (_disposed) return;
    super.addListener(listener);
    if (!_subscribed && hasListeners) {
      _subscribed = true;
      assetNotifier.addListener(_forward);
      clock.addListener(_forward);
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
