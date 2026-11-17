import 'dart:async';
import 'dart:collection';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';

import 'compiled_pack.dart';
import 'store.dart';
import 'web_support_stub.dart'
    if (dart.library.js_interop) 'web_support.dart'
    as web_support;

enum _NetStage {
  queuedFetch,
  fetching,
  queuedDecode,
  decoding,
  pendingPublish,
  ready,
  failed,
}

final class _NetEntry {
  _NetEntry(this.url, this.reference) {
    completer.future.ignore();
  }

  final String url;
  final bool reference;
  final Completer<TgsModel> completer = Completer<TgsModel>();
  _NetStage stage = _NetStage.queuedFetch;
  FastLottieCancelToken? cancelToken;
  Uint8List? bytes;
  TgsModel? decoded;
  TgsModel? model;
  int users = 0;
  bool evicted = false;
}

typedef NetworkUrlByteFetcher = Future<FastLottieNetworkFetchResult> Function(
  Uri uri, {
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
});

enum ModelCacheEvent { pin, unpin, ready }

/// Optional benchmark observer. `ready` carries the decoded source bytes.
typedef ModelCacheObserver = void Function(
  ModelCacheEvent event,
  (String, bool) key,
  int sourceBytes,
);

/// Stage-separated network TGS loader & bounded LRU store:
///   Stage 0: In-memory compiled [TgsModel] LRU cache (hits are synchronous)
///   Stage 1: Raw URL `.tgsbin` disk cache -> bounded HTTP fetch queue
///            (`httpConcurrency`, default 6) with immediate socket abort on release
///   Stage 2: Bounded CPU isolate `decodeTgsBatch` pool (`decodeConcurrency`,
///            default 2) decoupled from network stalls, optional 1-per-frame
///            UI publication pacing, and `priority: true` queue-jumping in both stages.
class NetworkTgsStore extends ChangeNotifier implements TgsStoreBase {
  NetworkTgsStore({
    this.httpConcurrency = 6,
    this.decodeConcurrency = 2,
    int batchSize = 2,
    this.framePaced = true,
    this.maximumEntries = 180,
    this.maximumSourceBytes = 48 * 1024 * 1024,
    this.sourceCacheDirectory,
    this.modelCacheObserver,
    this.maximumCompiledBytes = 0,
    this.compiledPack,
    this.directPackPlayback = false,
    this.deferredPackPlayback = false,
    NetworkUrlByteFetcher? fetcher,
    TgsDecoder? decoder,
    TgsBatchDecoder? batchDecoder,
  }) : batchSize = decoder == null ? batchSize : 1,
       _fetcher = fetcher ?? web_support.networkByteFetcher ?? _defaultFetcher,
       _decodeBatch =
           batchDecoder ??
           (decoder == null ? decodeTgsBatch : _singleDecoder(decoder)) {
    if (httpConcurrency < 1 ||
        decodeConcurrency < 1 ||
        batchSize < 1 ||
        maximumEntries < 0 ||
        maximumSourceBytes < 0 ||
        maximumCompiledBytes < 0 ||
        (maximumCompiledBytes > 0 &&
            (decoder != null || batchDecoder != null || kIsWeb)) ||
        (compiledPack != null &&
            (maximumCompiledBytes > 0 ||
                decoder != null ||
                batchDecoder != null ||
                kIsWeb)) ||
        (directPackPlayback && compiledPack == null) ||
        (deferredPackPlayback && !directPackPlayback) ||
        (decoder != null && batchDecoder != null)) {
      throw ArgumentError('Invalid NetworkTgsStore configuration');
    }
  }

  static Future<FastLottieNetworkFetchResult> _defaultFetcher(
    Uri uri, {
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
  }) => FastLottieComposition.fetchNetworkBytes(
    uri,
    cancelToken: cancelToken,
    sourceCacheDirectory: sourceCacheDirectory,
  );

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

  final int httpConcurrency;
  final int decodeConcurrency;
  final int batchSize;
  final int maximumEntries;
  final int maximumSourceBytes;
  final int maximumCompiledBytes;
  final CompiledModelPack? compiledPack;
  final bool directPackPlayback, deferredPackPlayback;
  final bool framePaced;
  final ModelCacheObserver? modelCacheObserver;
  String? sourceCacheDirectory;
  final NetworkUrlByteFetcher _fetcher;
  final TgsBatchDecoder _decodeBatch;
  final _snapshots = <(String, bool), (Uint8List source, Uint8List blob)>{};
  int compiledBytes = 0,
      snapshotHits = 0,
      snapshotEncodes = 0,
      snapshotEncodeUs = 0;
  int snapshotEvictions = 0;
  int _snapshotGeneration = 0;

  Uint8List? _snapshot(_NetEntry entry) {
    final key = (entry.url, entry.reference);
    final cached = _snapshots.remove(key);
    if (cached == null) return null;
    if (!listEquals(cached.$1, entry.bytes)) {
      compiledBytes -= cached.$1.length + cached.$2.length;
      return null;
    }
    _snapshots[key] = cached;
    return cached.$2;
  }

  void _rememberSnapshot(_NetEntry entry, Uint8List source, Uint8List blob) {
    final bytes = source.length + blob.length;
    if (bytes > maximumCompiledBytes) return;
    final key = (entry.url, entry.reference);
    final old = _snapshots.remove(key);
    if (old != null) compiledBytes -= old.$1.length + old.$2.length;
    while (_snapshots.isNotEmpty &&
        compiledBytes + bytes > maximumCompiledBytes) {
      final old = _snapshots.remove(_snapshots.keys.first)!;
      compiledBytes -= old.$1.length + old.$2.length;
      snapshotEvictions++;
    }
    _snapshots[key] = (source, blob);
    compiledBytes += bytes;
  }

  /// Drops only the optional compiled snapshots in response to memory pressure.
  /// Decodes already in flight can publish their models but not cache blobs.
  void evictCompiledSnapshots() {
    if (maximumCompiledBytes == 0) return;
    _snapshotGeneration++;
    _snapshots.clear();
    compiledBytes = 0;
  }

  final _entries = <(String, bool), _NetEntry>{};
  final _fetchQueue = LinkedHashSet<_NetEntry>.identity();
  final _decodeQueue = LinkedHashSet<_NetEntry>.identity();
  final _publications = LinkedHashSet<_NetEntry>.identity();
  final _unpinned = LinkedHashSet<_NetEntry>.identity();

  int? _publicationCallback;
  bool _disposed = false;
  bool _notificationPending = false;
  bool _fetchPumpScheduled = false;
  bool _decodePumpScheduled = false;

  int _runningFetches = 0;
  int _runningDecodes = 0;
  int _cached = 0;
  int _sourceBytes = 0;

  // Live telemetry counters.
  int hits = 0;
  int coalesced = 0;
  int networkDownloads = 0;
  int diskSourceHits = 0;
  int cancelledFetches = 0;
  int downloadedBytes = 0;
  int decodes = 0;
  int decodedModels = 0, inflateUs = 0, compileUs = 0, prepareUs = 0;
  int packHits = 0, packFallbacks = 0, packReadBytes = 0, packReadUs = 0;
  int directPlaybackModels = 0, deferredPlaybackModels = 0;
  int fetchErrors = 0;

  int get cached => _cached;
  int get sourceBytes => _sourceBytes;
  int get inFlightDownloads => _runningFetches;
  int get queuedDownloads => _fetchQueue.length;
  int get runningDecodes => _runningDecodes;
  int get queuedDecodes => _decodeQueue.length;
  int get pendingPublications => _publications.length;
  bool get isBusy =>
      _runningFetches > 0 ||
      _fetchQueue.isNotEmpty ||
      _runningDecodes > 0 ||
      _decodeQueue.isNotEmpty;

  void attachSourceCacheDirectory(String? directoryPath) {
    sourceCacheDirectory = (directoryPath == null || directoryPath.isEmpty)
        ? null
        : directoryPath;
  }

  void _enqueueFront(LinkedHashSet<_NetEntry> queue, _NetEntry entry) {
    if (queue.isEmpty) {
      queue.add(entry);
      return;
    }
    queue.remove(entry);
    final rest = queue.toList(growable: false);
    queue
      ..clear()
      ..add(entry)
      ..addAll(rest);
  }

  @override
  TgsLease acquire(
    String url, {
    bool reference = false,
    bool priority = false,
  }) {
    if (_disposed) throw StateError('NetworkTgsStore disposed');
    final key = (url, reference);
    var entry = _entries[key];
    if (entry != null) {
      if (entry.users == 0 && entry.model != null) {
        _unpinned.remove(entry);
      }
      if (entry.model != null) {
        hits++;
      } else {
        coalesced++;
        if (priority) {
          if (entry.stage == _NetStage.queuedFetch &&
              _fetchQueue.contains(entry)) {
            _enqueueFront(_fetchQueue, entry);
          } else if (entry.stage == _NetStage.queuedDecode &&
              _decodeQueue.contains(entry)) {
            _enqueueFront(_decodeQueue, entry);
          }
        }
      }
    } else {
      entry = _NetEntry(url, reference);
      _entries[key] = entry;
      if (priority) {
        _enqueueFront(_fetchQueue, entry);
      } else {
        _fetchQueue.add(entry);
      }
    }
    entry.users++;
    modelCacheObserver?.call(ModelCacheEvent.pin, key, 0);
    _scheduleFetchPump();
    _changed();
    return TgsLease.custom(
      future: entry.completer.future,
      readyGetter: () => entry!.model,
      onRelease: () => _release(entry!),
    );
  }

  void _release(_NetEntry entry) {
    entry.users--;
    if (_disposed || entry.evicted) return;
    modelCacheObserver?.call(ModelCacheEvent.unpin, (
      entry.url,
      entry.reference,
    ), 0);
    if (entry.users == 0) {
      switch (entry.stage) {
        case _NetStage.queuedFetch:
          _fetchQueue.remove(entry);
          _fail(entry, const TgsLoadCancelled());
        case _NetStage.fetching:
          // Abort the HTTP socket immediately when the sticker scrolls offscreen.
          cancelledFetches++;
          entry.cancelToken?.cancel();
          _fail(entry, const TgsLoadCancelled());
        case _NetStage.queuedDecode:
          _decodeQueue.remove(entry);
          entry.bytes = null;
          _fail(entry, const TgsLoadCancelled());
        case _NetStage.decoding:
          // Worker is already running; if it finishes while users == 0 it will cache cleanly.
          break;
        case _NetStage.pendingPublish:
          _publications.remove(entry);
          _commit(entry);
          _schedulePublication();
          _scheduleDecodePump();
        case _NetStage.ready:
          _unpinned.add(entry);
        case _NetStage.failed:
          break;
      }
    }
    _trim();
    _changed();
  }

  void _scheduleFetchPump() {
    if (_disposed || _fetchPumpScheduled || _fetchQueue.isEmpty) return;
    _fetchPumpScheduled = true;
    scheduleMicrotask(() {
      _fetchPumpScheduled = false;
      _pumpFetches();
    });
  }

  void _pumpFetches() {
    while (!_disposed &&
        _runningFetches < httpConcurrency &&
        _fetchQueue.isNotEmpty) {
      final entry = _fetchQueue.first;
      _fetchQueue.remove(entry);
      if (entry.users <= 0) {
        _fail(entry, const TgsLoadCancelled());
        continue;
      }
      entry.stage = _NetStage.fetching;
      final token = FastLottieCancelToken();
      entry.cancelToken = token;
      _runningFetches++;
      unawaited(_runFetch(entry, token));
    }
  }

  Future<void> _runFetch(_NetEntry entry, FastLottieCancelToken token) async {
    try {
      final uri = Uri.parse(entry.url);
      final result = await _fetcher(
        uri,
        cancelToken: token,
        sourceCacheDirectory: sourceCacheDirectory,
      );
      if (_disposed || entry.users <= 0 || token.isCancelled) {
        _fail(entry, const TgsLoadCancelled());
        return;
      }
      if (result.fromDiskCache) {
        diskSourceHits++;
      } else {
        networkDownloads++;
        downloadedBytes += result.bytes.length;
      }
      entry.cancelToken = null;
      entry.bytes = result.bytes;
      entry.stage = _NetStage.queuedDecode;
      _decodeQueue.add(entry);
      _scheduleDecodePump();
    } on FastLottieNetworkCancelledException {
      _fail(entry, const TgsLoadCancelled());
    } catch (error, stack) {
      fetchErrors++;
      _fail(entry, error, stack);
    } finally {
      entry.cancelToken = null;
      _runningFetches--;
      _pumpFetches();
      _changed();
    }
  }

  void _scheduleDecodePump() {
    if (_disposed || _decodePumpScheduled || _decodeQueue.isEmpty) return;
    _decodePumpScheduled = true;
    scheduleMicrotask(() {
      _decodePumpScheduled = false;
      _pumpDecodes();
    });
  }

  void _pumpDecodes() {
    final capacity = 2 * decodeConcurrency * batchSize;
    while (!_disposed &&
        _runningDecodes < decodeConcurrency &&
        _decodeQueue.isNotEmpty) {
      final free =
          capacity - _publications.length - _runningDecodes * batchSize;
      final count = _decodeQueue.length < batchSize
          ? _decodeQueue.length
          : batchSize;
      if (free < count) break;
      final batch = <_NetEntry>[];
      while (batch.length < count && _decodeQueue.isNotEmpty) {
        final entry = _decodeQueue.first;
        _decodeQueue.remove(entry);
        if (entry.users <= 0 || entry.bytes == null) {
          entry.bytes = null;
          _fail(entry, const TgsLoadCancelled());
          continue;
        }
        entry.stage = _NetStage.decoding;
        batch.add(entry);
      }
      if (batch.isEmpty) continue;
      _runningDecodes++;
      unawaited(_runDecodeBatch(batch));
    }
  }

  Future<void> _runDecodeBatch(List<_NetEntry> batch) async {
    final live = <_NetEntry>[];
    try {
      for (final entry in batch) {
        if (_disposed || entry.users <= 0 || entry.bytes == null) {
          entry.bytes = null;
          _fail(entry, const TgsLoadCancelled());
        } else {
          live.add(entry);
        }
      }
      if (live.isEmpty) return;
      decodes += live.length;
      final generation = _snapshotGeneration;
      final sourceBytes = maximumCompiledBytes == 0
          ? null
          : [for (final entry in live) entry.bytes!];
      final results = compiledPack != null
          ? await decodeTgsPackedBatch([
              for (final entry in live)
                (
                  entry.bytes!,
                  entry.reference,
                  compiledPack!.lookup(entry.url),
                  directPackPlayback,
                  deferredPackPlayback,
                ),
            ])
          : maximumCompiledBytes == 0
          ? await _decodeBatch([
              for (final entry in live) (entry.bytes!, entry.reference),
            ])
          : await decodeTgsSnapshotBatch([
              for (final entry in live)
                (entry.bytes!, entry.reference, _snapshot(entry)),
            ]);
      if (results.length != live.length) {
        throw StateError('TGS decoder returned an incomplete batch');
      }
      for (var i = 0; i < live.length; i++) {
        final entry = live[i];
        final result = results[i];
        entry.bytes = null;
        packReadBytes += result.packReadBytes;
        packReadUs += result.packReadUs;
        if (_disposed) {
          _fail(entry, const TgsLoadCancelled());
        } else if (result.error != null) {
          _fail(entry, result.error!, result.stackTrace);
        } else {
          final model = result.model!;
          if (model.directPlayback) directPlaybackModels++;
          if (model.deferredPlayback) deferredPlaybackModels++;
          if (result.snapshotHit) snapshotHits++;
          if (result.packHit) packHits++;
          if (result.packFallback) packFallbacks++;
          if (result.compiledSnapshot case final snapshot?) {
            snapshotEncodes++;
            snapshotEncodeUs += result.snapshotEncodeUs;
            if (generation == _snapshotGeneration) {
              _rememberSnapshot(entry, sourceBytes![i], snapshot);
            }
          }
          decodedModels++;
          inflateUs += model.inflateUs;
          compileUs += model.parseUs - model.prepareUs;
          prepareUs += model.prepareUs;
          entry.decoded = model;
          if (framePaced && entry.users > 0) {
            entry.stage = _NetStage.pendingPublish;
            _publications.add(entry);
          } else {
            _commit(entry);
          }
        }
      }
      _schedulePublication();
    } catch (error, stack) {
      for (final entry in live) {
        entry.bytes = null;
        if (!entry.completer.isCompleted) {
          _fail(entry, error, stack);
        }
      }
    } finally {
      _runningDecodes--;
      _pumpDecodes();
      _changed();
    }
  }

  void _commit(_NetEntry entry) {
    final model = entry.decoded!;
    entry.decoded = null;
    entry.bytes = null;
    entry.model = model;
    entry.stage = _NetStage.ready;
    _cached++;
    _sourceBytes += model.sourceBytes;
    modelCacheObserver?.call(ModelCacheEvent.ready, (
      entry.url,
      entry.reference,
    ), model.sourceBytes);
    if (entry.users <= 0) _unpinned.add(entry);
    if (!entry.completer.isCompleted) {
      entry.completer.complete(model);
    }
    _trim();
  }

  void _fail(_NetEntry entry, Object error, [StackTrace? stack]) {
    entry.stage = _NetStage.failed;
    if (identical(_entries[(entry.url, entry.reference)], entry)) {
      _entries.remove((entry.url, entry.reference));
    }
    _unpinned.remove(entry);
    entry.bytes = null;
    entry.decoded = null;
    if (!entry.completer.isCompleted) {
      entry.completer.completeError(error, stack);
    }
  }

  void _schedulePublication() {
    if (_publications.isEmpty || _disposed) {
      final cb = _publicationCallback;
      if (cb != null) {
        SchedulerBinding.instance.cancelFrameCallbackWithId(cb);
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
      _pumpDecodes();
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
      _entries.remove((entry.url, entry.reference));
    }
  }

  /// Drops cached models and clears the URL raw `.tgsbin` disk cache.
  Future<void> clearMemoryAndUrlDiskCache() async {
    if (_disposed) return;
    evictCompiledSnapshots();
    for (final entry in _entries.values.toList(growable: false)) {
      if (entry.stage == _NetStage.ready && entry.model != null) {
        entry.evicted = true;
        _unpinned.remove(entry);
        _cached--;
        _sourceBytes -= entry.model!.sourceBytes;
        _entries.remove((entry.url, entry.reference));
      }
    }
    final dir = sourceCacheDirectory;
    if (dir != null && dir.isNotEmpty) {
      await FastLottieComposition.clearNetworkDiskCache(dir);
    }
    _changed();
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
    final cb = _publicationCallback;
    if (cb != null) {
      SchedulerBinding.instance.cancelFrameCallbackWithId(cb);
    }
    _publicationCallback = null;
    for (final entry in _entries.values) {
      entry.cancelToken?.cancel();
      entry.cancelToken = null;
      entry.bytes = null;
      entry.decoded = null;
      if (!entry.completer.isCompleted) {
        entry.completer.completeError(const TgsLoadCancelled());
      }
    }
    _fetchQueue.clear();
    _decodeQueue.clear();
    _publications.clear();
    _unpinned.clear();
    _entries.clear();
    evictCompiledSnapshots();
    _cached = _sourceBytes = 0;
    super.dispose();
  }
}
