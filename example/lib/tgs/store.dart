import 'dart:async';
import 'dart:collection';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/scheduler.dart';

import 'decoder.dart';

export 'decoder.dart';

class TgsLoadCancelled implements Exception {
  const TgsLoadCancelled();
  @override
  String toString() => 'TGS load no longer needed';
}

class _Entry {
  _Entry(this.asset, this.reference) {
    completer.future.ignore();
  }
  final String asset;
  final bool reference;
  final completer = Completer<TgsModel>();
  TgsModel? model, decoded;
  int users = 0;
  bool started = false;
}

abstract interface class TgsStoreBase implements Listenable {
  TgsLease acquire(
    String asset, {
    bool reference = false,
    bool priority = false,
  });
}

class TgsLease {
  TgsLease._(this._store, this._entry)
    : _customFuture = null,
      _customReady = null,
      _customRelease = null;

  TgsLease.custom({
    required Future<TgsModel> future,
    required TgsModel? Function() readyGetter,
    required VoidCallback onRelease,
  }) : _store = null,
       _entry = null,
       _customFuture = future,
       _customReady = readyGetter,
       _customRelease = onRelease;

  final TgsStore? _store;
  final _Entry? _entry;
  final Future<TgsModel>? _customFuture;
  final TgsModel? Function()? _customReady;
  final VoidCallback? _customRelease;
  bool _released = false;

  Future<TgsModel> get future => _customFuture ?? _entry!.completer.future;
  TgsModel? get ready => _customReady != null ? _customReady() : _entry!.model;

  void release() {
    if (_released) return;
    _released = true;
    final onRelease = _customRelease;
    if (onRelease != null) {
      onRelease();
    } else {
      _store!._release(_entry!);
    }
  }
}

/// Deduplicates leases, micro-batches worker jobs and bounds retained models.
/// Decoding and one-model-per-frame UI publication are separate bounded stages.
class TgsStore extends ChangeNotifier implements TgsStoreBase {
  TgsStore({
    AssetBundle? bundle,
    TgsDecoder? decoder,
    TgsBatchDecoder? batchDecoder,
    this.maximumEntries = 128,
    this.maximumSourceBytes = 32 * 1024 * 1024,
    this.concurrency = 2,
    int batchSize = 2,
    this.framePaced = false,
  }) : bundle = bundle ?? rootBundle,
       batchSize = decoder == null ? batchSize : 1,
       _decodeBatch =
           batchDecoder ??
           (decoder == null ? decodeTgsBatch : _singleDecoder(decoder)) {
    if (maximumEntries < 0 ||
        maximumSourceBytes < 0 ||
        concurrency < 1 ||
        batchSize < 1 ||
        (decoder != null && batchDecoder != null)) {
      throw ArgumentError('Invalid TGS store limits or decoder');
    }
  }

  // Preserve concurrency semantics for callers injecting a single-file decoder.
  static TgsBatchDecoder _singleDecoder(TgsDecoder decode) => (requests) async {
    final results = <TgsDecodeResult>[];
    for (final request in requests) {
      try {
        results.add(
          TgsDecodeResult.success(await decode(request.$1, request.$2)),
        );
      } catch (error, stack) {
        results.add(TgsDecodeResult.failure(error, stack));
      }
    }
    return results;
  };

  final AssetBundle bundle;
  final TgsBatchDecoder _decodeBatch;

  /// Concurrency counts worker batches, not individual files in a batch.
  final int maximumEntries, maximumSourceBytes, concurrency, batchSize;
  final bool framePaced;
  final _entries = <(String, bool), _Entry>{};
  final _queue = LinkedHashSet<_Entry>.identity();
  final _publications = LinkedHashSet<_Entry>.identity();
  final _unpinned = LinkedHashSet<_Entry>.identity();
  int? _publicationCallback;
  bool _disposed = false, _notificationPending = false, _pumpPending = false;
  int _running = 0, _cached = 0, _sourceBytes = 0;
  int hits = 0, coalesced = 0, decodes = 0;
  int get running => _running;
  int get queued => _queue.length;
  int get cached => _cached;
  int get sourceBytes => _sourceBytes;
  int get pendingPublications => _publications.length;

  void _enqueueFront(_Entry entry) {
    if (_queue.isEmpty) {
      _queue.add(entry);
      return;
    }
    _queue.remove(entry);
    final rest = _queue.toList(growable: false);
    _queue
      ..clear()
      ..add(entry)
      ..addAll(rest);
  }

  @override
  TgsLease acquire(
    String asset, {
    bool reference = false,
    bool priority = false,
  }) {
    if (_disposed) throw StateError('TgsStore disposed');
    final key = (asset, reference);
    var entry = _entries[key];
    if (entry != null) {
      if (entry.users == 0 && entry.model != null) {
        _unpinned.remove(entry);
      }
      if (entry.model != null) {
        hits++;
      } else {
        coalesced++;
        if (priority && !entry.started && _queue.contains(entry)) {
          _enqueueFront(entry);
        }
      }
    } else {
      entry = _Entry(asset, reference);
      _entries[key] = entry;
      if (priority) {
        _enqueueFront(entry);
      } else {
        _queue.add(entry);
      }
    }
    entry.users++;
    // Collect requests built synchronously by the same grid layout before
    // choosing a batch. No timer or extra display frame is required.
    _schedulePump();
    _changed();
    return TgsLease._(this, entry);
  }

  void _release(_Entry entry) {
    entry.users--;
    if (_disposed) return;
    if (entry.users == 0) {
      if (!entry.started && entry.model == null) {
        _queue.remove(entry);
        _fail(entry, const TgsLoadCancelled());
      } else if (entry.decoded != null) {
        // An offscreen result can enter the model cache without rebuilding UI.
        _publications.remove(entry);
        _commit(entry);
        _schedulePublication();
        _schedulePump();
      } else if (entry.model != null) {
        _unpinned.add(entry);
      }
    }
    _trim();
    _changed();
  }

  void _schedulePump() {
    if (_disposed || _pumpPending || _queue.isEmpty) return;
    _pumpPending = true;
    scheduleMicrotask(() {
      _pumpPending = false;
      _pump();
    });
  }

  void _pump() {
    // At most two batches per worker may be decoding or awaiting publication.
    // Slow/disabled display frames cannot build an unbounded compiled backlog.
    final capacity = 2 * concurrency * batchSize;
    while (!_disposed && _running < concurrency && _queue.isNotEmpty) {
      final free = capacity - _publications.length - _running * batchSize;
      final count = _queue.length < batchSize ? _queue.length : batchSize;
      if (free < count) break;
      final batch = <_Entry>[];
      while (batch.length < count) {
        final entry = _queue.first;
        _queue.remove(entry);
        entry.started = true;
        batch.add(entry);
      }
      _running++;
      unawaited(_runBatch(batch));
    }
  }

  Future<(_Entry, Uint8List)?> _load(_Entry entry) async {
    try {
      final bytes = await bundle.load(entry.asset);
      if (_disposed || entry.users == 0) throw const TgsLoadCancelled();
      return (
        entry,
        bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes),
      );
    } catch (error, stack) {
      _fail(entry, error, stack);
      return null;
    }
  }

  Future<void> _runBatch(List<_Entry> batch) async {
    var live = <(_Entry, Uint8List)>[];
    try {
      final loaded = await Future.wait(batch.map(_load));
      for (final item in loaded) {
        if (item == null) continue;
        if (_disposed || item.$1.users == 0) {
          _fail(item.$1, const TgsLoadCancelled());
        } else {
          live.add(item);
        }
      }
      if (live.isEmpty) return;
      decodes += live.length;
      final results = await _decodeBatch([
        for (final item in live) (item.$2, item.$1.reference),
      ]);
      if (results.length != live.length) {
        throw StateError('TGS decoder returned an incomplete batch');
      }
      for (var i = 0; i < live.length; i++) {
        final entry = live[i].$1, result = results[i];
        if (_disposed) {
          _fail(entry, const TgsLoadCancelled());
        } else if (result.error != null) {
          _fail(entry, result.error!, result.stackTrace);
        } else {
          entry.decoded = result.model!;
          if (framePaced && entry.users > 0) {
            _publications.add(entry);
          } else {
            _commit(entry);
          }
        }
      }
      _schedulePublication();
    } catch (error, stack) {
      for (final item in live) {
        if (!item.$1.completer.isCompleted) _fail(item.$1, error, stack);
      }
    } finally {
      _running--;
      _pump();
      _changed();
    }
  }

  void _commit(_Entry entry) {
    final model = entry.decoded!;
    entry.decoded = null;
    entry.model = model;
    _cached++;
    _sourceBytes += model.sourceBytes;
    if (entry.users == 0) _unpinned.add(entry);
    entry.completer.complete(model);
    _trim();
  }

  void _fail(_Entry entry, Object error, [StackTrace? stack]) {
    if (identical(_entries[(entry.asset, entry.reference)], entry)) {
      _entries.remove((entry.asset, entry.reference));
    }
    _unpinned.remove(entry);
    entry.decoded = null;
    if (!entry.completer.isCompleted) {
      entry.completer.completeError(error, stack);
    }
  }

  void _schedulePublication() {
    if (_publications.isEmpty || _disposed) {
      final callback = _publicationCallback;
      if (callback != null) {
        SchedulerBinding.instance.cancelFrameCallbackWithId(callback);
      }
      _publicationCallback = null;
      return;
    }
    if (_publicationCallback != null) return;
    _publicationCallback = SchedulerBinding.instance.scheduleFrameCallback((_) {
      _publicationCallback = null;
      if (_disposed) return;
      if (_publications.isNotEmpty) {
        final entry = _publications.first;
        _publications.remove(entry);
        _commit(entry);
      }
      _pump();
      _schedulePublication();
      _changed();
    });
  }

  void _trim() {
    while ((_cached > maximumEntries || _sourceBytes > maximumSourceBytes) &&
        _unpinned.isNotEmpty) {
      final entry = _unpinned.first;
      _unpinned.remove(entry);
      _cached--;
      _sourceBytes -= entry.model!.sourceBytes;
      _entries.remove((entry.asset, entry.reference));
    }
  }

  void _changed() {
    if (_disposed || _notificationPending || !hasListeners) return;
    _notificationPending = true;
    scheduleMicrotask(() {
      _notificationPending = false;
      if (!_disposed && hasListeners) notifyListeners();
    });
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    final callback = _publicationCallback;
    if (callback != null) {
      SchedulerBinding.instance.cancelFrameCallbackWithId(callback);
    }
    _publicationCallback = null;
    // Complete every lease promptly, including asset IO or a paused worker.
    for (final entry in _entries.values) {
      if (!entry.completer.isCompleted) {
        entry.completer.completeError(const TgsLoadCancelled());
      }
      entry.decoded = null;
    }
    _publications.clear();
    _queue.clear();
    _unpinned.clear();
    _entries.clear();
    _cached = _sourceBytes = 0;
    super.dispose();
  }
}
