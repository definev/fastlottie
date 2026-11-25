import 'dart:async';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'network_server_types.dart';
import 'pack_assets.dart';

const _maximumIdleBytes = 2 * 1024 * 1024;
const _maximumConcurrentDecodes = 2;

/// Shares one decoded poster and in-flight decode per media URL.
///
/// Visible cells lease their images. Only a small LRU of released images is
/// kept around, so scrolling the full picker doesn't retain its full catalog.
class PackPosterCache {
  PackPosterCache(this._assets);

  final PackAssets _assets;
  final _entries = <Uri, EmojiPosterLease>{};
  final _retiring = <EmojiPosterLease>{};
  final _pending = <EmojiPosterLease>{};
  final _pendingPrewarm = <EmojiPosterLease>{};
  final _idle = <EmojiPosterLease>{};
  int _decoding = 0;
  int _idleBytes = 0;
  bool _disposed = false;

  EmojiPosterLease acquire(PackPoster poster) {
    final entry = _entries.putIfAbsent(
      poster.uri,
      () => EmojiPosterLease._(this, poster.uri),
    );
    if (entry._users++ == 0 && _idle.remove(entry)) {
      _idleBytes -= entry._bytes;
    }
    if (!entry._started) {
      entry._prewarm = false;
      _pendingPrewarm.remove(entry);
      _pending.add(entry);
      _pump();
    }
    return entry;
  }

  void prewarm(Iterable<PackPoster> posters) {
    if (_disposed) return;
    if (_pendingPrewarm.length >= 12) {
      for (final entry in _pendingPrewarm) {
        _discard(entry);
      }
      _pendingPrewarm.clear();
    }
    for (final poster in posters) {
      if (_entries.containsKey(poster.uri)) continue;
      final entry = _entries[poster.uri] = EmojiPosterLease._(this, poster.uri);
      entry._prewarm = true;
      _pendingPrewarm.add(entry);
    }
    _pump();
  }

  void _release(EmojiPosterLease entry) {
    if (_disposed || --entry._users != 0) return;
    if (_pending.remove(entry) || (entry._finished && entry.value == null)) {
      _discard(entry);
    } else if (entry.value != null) {
      _keepIdle(entry);
    } else if (!entry._prewarm) {
      _entries.remove(entry.uri);
      _retiring.add(entry);
      entry._cancel.cancel();
    }
  }

  void _pump() {
    while (!_disposed &&
        _decoding < _maximumConcurrentDecodes &&
        (_pending.isNotEmpty || _pendingPrewarm.isNotEmpty)) {
      final queue = _pending.isNotEmpty ? _pending : _pendingPrewarm;
      final entry = queue.first;
      queue.remove(entry);
      entry._started = true;
      _decoding++;
      unawaited(_decode(entry));
    }
  }

  Future<void> _decode(EmojiPosterLease entry) async {
    try {
      final data = await _assets.fetch(entry.uri, cancelToken: entry._cancel);
      if (_disposed || entry._cancel.isCancelled) return;
      final codec = await ui.instantiateImageCodec(data.bytes);
      try {
        if (_disposed || entry._cancel.isCancelled) return;
        final frame = await codec.getNextFrame();
        if (_disposed || entry._cancel.isCancelled) {
          frame.image.dispose();
        } else {
          entry.value = frame.image;
        }
      } finally {
        codec.dispose();
      }
    } on Exception {
      // The normal TGS path can still paint when a poster is unavailable.
    } on FlutterError {
      // Flutter reports an unreadable bundle asset as a FlutterError.
    } on RangeError {
      // A stale index can point outside a bundled page.
    } finally {
      _decoding--;
      entry._finished = true;
      if (!_disposed && entry._users > 0 && entry.value == null) {
        entry._notifyFinished();
      }
      if (_retiring.remove(entry)) {
        entry.dispose();
      } else if (!_disposed && entry._users == 0) {
        if (entry.value == null) {
          _discard(entry);
        } else {
          _keepIdle(entry);
        }
      }
      _pump();
    }
  }

  void _keepIdle(EmojiPosterLease entry) {
    _idle.add(entry);
    _idleBytes += entry._bytes;
    while (_idleBytes > _maximumIdleBytes) {
      final oldest = _idle.first;
      _idleBytes -= oldest._bytes;
      _idle.remove(oldest);
      _discard(oldest);
    }
  }

  void _discard(EmojiPosterLease entry) {
    _entries.remove(entry.uri);
    entry._cancel.cancel();
    entry.dispose();
  }

  void clearIdle() {
    for (final entry in _pendingPrewarm) {
      _discard(entry);
    }
    _pendingPrewarm.clear();
    for (final entry in _idle) {
      _discard(entry);
    }
    _idle.clear();
    _idleBytes = 0;
    _assets.clearIdle();
  }

  void dispose() {
    _disposed = true;
    _pending.clear();
    _pendingPrewarm.clear();
    _idle.clear();
    for (final entry in _entries.values) {
      entry._cancel.cancel();
      entry.dispose();
    }
    for (final entry in _retiring) {
      entry.dispose();
    }
    _retiring.clear();
    _entries.clear();
  }
}

class EmojiPosterLease extends ValueNotifier<ui.Image?> {
  EmojiPosterLease._(this._cache, this.uri) : super(null);

  final PackPosterCache _cache;
  final Uri uri;
  final _cancel = FastLottieCancelToken();
  int _users = 0;
  bool _started = false;
  bool _prewarm = false;
  bool _finished = false;
  bool get finished => _finished;
  void _notifyFinished() => notifyListeners();

  int get _bytes => value == null ? 0 : value!.width * value!.height * 4;

  void release() => _cache._release(this);

  @override
  void dispose() {
    value?.dispose();
    super.dispose();
  }
}
