import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'clock.dart';
import 'store.dart';

// Spatial and temporal quality caps for inline emojis and 5-column picker cells.
final stickerThumbnailPixels = (56 * 2).toInt();
const stickerThumbnailFrameRate = 30.0;
const stickerSheetBytes = 64 * 1024 * 1024;
const stickerSheetCount = 100;

/// Coordinates ping-pong players and lazy TGS model acquisition per unique asset.
/// All animations sharing the same asset/size deduplicate to a single double-buffered
/// GPU entry (`renderingImage` + `backgroundImage`) and LZ4 `.flcache` disk stream.
class StickerSheet extends ChangeNotifier {
  StickerSheet({
    required this.assets,
    required this.pixelSize,
    TgsStoreBase? store,
    FastLottieRasterCache? rasterCache,
    this.maximumBytes = stickerSheetBytes,
    this.frameRate = stickerThumbnailFrameRate,
  }) : store =
           store ??
           TgsStore(concurrency: 1, maximumEntries: 64, framePaced: true),
       _ownsStore = store == null,
       rasterCache =
           rasterCache ??
           FastLottieRasterCache.pingPong(
             maximumBytes: maximumBytes,
             maximumFrameRate: frameRate,
           ),
       _ownsCache = rasterCache == null;

  final List<String> assets;
  final int pixelSize, maximumBytes;
  final double frameRate;
  final TgsStoreBase store;
  final bool _ownsStore;
  final FastLottieRasterCache rasterCache;
  final bool _ownsCache;

  final _entries = <String, _SheetAsset>{};
  final errors = <String, Object>{};
  bool constrained = false;
  bool _disposed = false, _active = true;

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

  void retryAsset(String asset) {
    if (_disposed) return;
    final entry = _entries[asset];
    if (entry == null) return;
    entry.error = null;
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
      _onLoaded(entry, lease, ready);
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
          errors[entry.asset] = error;
          entry.notifyAssetChanged();
          notifyListeners();
        }
      },
    );
  }

  void _onLoaded(_SheetAsset entry, TgsLease lease, TgsModel model) {
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
      entry.notifyAssetChanged();
      notifyListeners();
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
  final _clockMerges = <StickerClock, _MergedAssetClock>{};

  TgsLease? lease;
  FastLottieComposition? composition;
  FastLottiePlayer? player;
  Object? error;
  int pins = 0;

  void _onPlayerFrame() => notifyAssetChanged();

  void notifyAssetChanged() {
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
    detachPlayer();
    final pendingLease = lease;
    lease = null;
    pendingLease?.release();
    for (final merge in _clockMerges.values) {
      merge.dispose();
    }
    _clockMerges.clear();
    notifier.dispose();
  }
}

class _MergedAssetClock extends ChangeNotifier {
  _MergedAssetClock(this.assetNotifier, this.clock);
  final ChangeNotifier assetNotifier;
  final StickerClock clock;
  void _forward() => notifyListeners();

  @override
  void addListener(VoidCallback listener) {
    final first = !hasListeners;
    super.addListener(listener);
    if (first) {
      assetNotifier.addListener(_forward);
      clock.addListener(_forward);
    }
  }

  @override
  void removeListener(VoidCallback listener) {
    super.removeListener(listener);
    if (!hasListeners) {
      assetNotifier.removeListener(_forward);
      clock.removeListener(_forward);
    }
  }
}
