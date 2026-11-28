import 'dart:async';
import 'dart:math' as math;
import 'dart:typed_data';

import '../platform/isolate_stub.dart'
    if (dart.library.isolate) '../platform/isolate_io.dart';
import '../platform/platform_stub.dart'
    if (dart.library.io) '../platform/platform_io.dart';
import '../platform/simd_stub.dart'
    if (dart.library.ffi) '../platform/simd_io.dart'
    if (dart.library.js_interop) '../platform/simd_wasm.dart';
import '../raster/raster_core.dart' show RasterScene;
import 'raster_browser_stub.dart'
    if (dart.library.js_interop) 'raster_browser.dart';
import 'raster_worker.dart';
import 'worker_messages.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');

int _shardForKey(String entryKey, int shardCount) {
  if (shardCount <= 1) return 0;
  if (_isWeb) {
    // Mix the whole key before using a low bit for a two-worker pool. Two
    // identical dimensions in a square raster key otherwise cancel that bit.
    var hash = 0;
    for (var i = 0; i < entryKey.length; i++) {
      hash += entryKey.codeUnitAt(i);
      hash = (hash + (hash << 10)) & 0x7fffffff;
      hash ^= hash >>> 6;
    }
    hash = (hash + (hash << 3)) & 0x7fffffff;
    hash ^= hash >>> 11;
    hash = (hash + (hash << 15)) & 0x7fffffff;
    return hash % shardCount;
  }
  var h = 0x811c9dc5;
  for (var i = 0; i < entryKey.length; i++) {
    h ^= entryKey.codeUnitAt(i);
    h = (h * 0x01000193) & 0x7FFFFFFF;
  }
  return h % shardCount;
}

abstract interface class RasterWorkerListener<T> {
  void onStripReady(
    T context,
    int dispatchedGen, {
    required String entryKey,
    required int stripStart,
    required int stripCount,
    required int stripWidth,
    required int stripHeight,
    required Uint8List bgraBytes,
    required bool vectorRendered,
    required int vectorCount,
    required bool compressedHit,
    required int compressedCount,
    required int entryDiskBytes,
    required int renderMicros,
    required int kernelCalls,
    required int geometryCopyBytes,
    required int transferBytes,
    required int fpHi,
    required int fpLo,
  });

  void onStripError(T context, Object error);

  void onStripCancelled(T context, int dispatchedGen);

  void onWorkerInterrupted(T context, Object error);
}

final class _PendingRequest<T> {
  _PendingRequest({
    required this.reqId,
    required this.shard,
    required this.context,
    required this.dispatchedGen,
    required this.entryKey,
    required this.contentKey,
    required this.scene,
    required this.sourceBytes,
    required this.stripStart,
    required this.stripCount,
    required this.startFrame,
    required this.frameStep,
    required this.width,
    required this.height,
    required this.totalFrames,
    required this.poster,
    this.cancelSlot = -1,
  });

  final int reqId;
  final int shard;
  final T context;
  final int dispatchedGen;
  final String entryKey;
  final String contentKey;
  final RasterScene scene;
  final Uint8List? sourceBytes;
  final int stripStart;
  final int stripCount;
  final double startFrame;
  final double frameStep;
  final int width;
  final int height;
  final int totalFrames;
  final bool poster;
  final int cancelSlot;
  bool retried = false;
}

/// Shards requests and owns transport, scene registration, and disk-cache LRU.
/// The caller's context is returned with replies so it can validate and present
/// results without the pool depending on Flutter's image cache.
final class RasterWorkerPool<T> {
  RasterWorkerPool({
    required this.listener,
    required this.maximumCompressedMemoryBytes,
    required this.maximumDiskBytes,
    this.deduplicateImageUploads = true,
    int? workerCount,
    String? diskCacheDirectory,
  }) : _workerCount = _isWeb
           ? browserRasterWorkerCount(workerCount)
           : defaultWorkerCount(workerCount),
       _diskDir = (diskCacheDirectory == null || diskCacheDirectory.isEmpty)
           ? null
           : diskCacheDirectory {
    if (_diskDir != null && isDiskCacheSupported) {
      _startAsyncDiskScan(_diskDir!);
    }
  }

  final RasterWorkerListener<T> listener;
  final int _workerCount;
  final int maximumCompressedMemoryBytes;
  final int maximumDiskBytes;
  final bool deduplicateImageUploads;
  String? _diskDir;

  final _handles = <WorkerHandle>[];
  final _subs = <StreamSubscription<Object?>>[];
  final _failedShards = <int>{};
  final _registeredScenes = <Set<String>>[];
  final _workerRamBytes = <int>[];
  final _workerRamLimits = <int>[];
  final _shardActiveWeight = <int>[];
  final _shardEntryCounts = <int>[];
  final _entryShard = <String, int>{};
  final _entryWeight = <String, int>{};
  final _entryShardRefs = <String, int>{};
  final _pendingByContext = Map<T, _PendingRequest<T>>.identity();
  final _pendingRequests = <int, _PendingRequest<T>>{};

  static int _globalNextSlot = 0;
  static const int _claimedCancelToken = 1;
  static const int _cancelledToken = 2;

  // Host-tracked disk cache LRU across all shards.
  final _diskLru = <String, int>{};
  final _pendingDiskDeletes = <String, int>{};
  final _deletedDuringDiskScan = <String>{};
  String? _lastTouchedDiskKey;
  int _diskBytes = 0;
  int _diskScanGen = 0;
  bool _diskScanInProgress = false;
  Future<void>? _diskScanFuture;
  int _compressedRamBytes = 0;
  int _nextReqId = 1;
  int debugDispatchCount = 0;
  bool _started = false;
  bool _disposed = false;

  bool get isStarted => _started;
  Future<void> get debugDiskScanReady =>
      _diskScanFuture ?? Future<void>.value();

  int get workerCount => _handles.isNotEmpty ? _handles.length : _workerCount;
  int get registeredSceneCount =>
      _registeredScenes.fold(0, (count, shard) => count + shard.length);
  int get diskBytes => _diskBytes;
  int get compressedRamBytes => _compressedRamBytes;
  String? get diskCacheDirectory => _diskDir;
  bool get needsDiskBudgetEnforcement =>
      _diskDir != null && maximumDiskBytes > 0 && _diskBytes > maximumDiskBytes;

  void _ensureStarted() {
    if (_started || _disposed) return;
    _started = true;
    for (var i = 0; i < _workerCount; i++) {
      final browser = startBrowserRasterWorker('fastlottie.raster.$i');
      if (_isWeb && browser == null) {
        // No browser workers (disabled or blocked by the host). Keep a
        // single inline workspace with the full cache budget.
        for (final handle in _handles) {
          handle.dispose();
        }
        _handles
          ..clear()
          ..add(_inlineOrNativeHandle(0));
        break;
      }
      _handles.add(browser ?? _inlineOrNativeHandle(i));
    }
    final perWorkerRam = maximumCompressedMemoryBytes ~/ _handles.length;
    final effectiveDiskDir = maximumDiskBytes > 0 ? _diskDir : null;
    for (var shard = 0; shard < _handles.length; shard++) {
      final handle = _handles[shard];
      _registeredScenes.add(<String>{});
      _workerRamBytes.add(0);
      _workerRamLimits.add(perWorkerRam);
      _shardActiveWeight.add(0);
      _shardEntryCounts.add(0);
      _subs.add(_listen(shard, handle));
      handle.send((
        opConfigure,
        diskDirectory: effectiveDiskDir,
        maximumDiskBytes: maximumDiskBytes,
        maximumRamBytes: perWorkerRam,
        deduplicateUploads: deduplicateImageUploads,
      ));
    }
  }

  /// Dynamically assigns a cold [entryKey] to the least-loaded shard (weighted
  /// by active pixel*frame footprint) and pins that assignment for the session
  /// so compressed RAM and `.flcache` files stay shard-local without FNV skew.
  int shardForKey(String entryKey, {int weight = 1}) {
    _ensureStarted();
    final existing = _entryShard[entryKey];
    _entryShardRefs.update(entryKey, (count) => count + 1, ifAbsent: () => 1);
    if (existing != null && existing < _handles.length) {
      if (!_entryWeight.containsKey(entryKey)) {
        _entryWeight[entryKey] = weight;
        _shardActiveWeight[existing] += weight;
        _shardEntryCounts[existing]++;
      }
      return existing;
    }
    final count = _handles.length;
    if (count <= 1) {
      _entryShard[entryKey] = 0;
      _entryWeight[entryKey] = weight;
      _shardActiveWeight[0] += weight;
      _shardEntryCounts[0]++;
      return 0;
    }
    final hashStart = _shardForKey(entryKey, count);
    var best = hashStart;
    var bestWeight = _shardActiveWeight[best];
    var bestEntries = _shardEntryCounts[best];
    for (var i = 1; i < count; i++) {
      final candidate = (hashStart + i) % count;
      final w = _shardActiveWeight[candidate];
      final e = _shardEntryCounts[candidate];
      if (w < bestWeight || (w == bestWeight && e < bestEntries)) {
        best = candidate;
        bestWeight = w;
        bestEntries = e;
      }
    }
    _entryShard[entryKey] = best;
    _entryWeight[entryKey] = weight;
    _shardActiveWeight[best] += weight;
    _shardEntryCounts[best]++;
    return best;
  }

  void releaseEntryShard(String entryKey) {
    final refs = _entryShardRefs[entryKey];
    if (refs == null) return;
    if (refs > 1) {
      _entryShardRefs[entryKey] = refs - 1;
      return;
    }
    _entryShardRefs.remove(entryKey);
    final shard = _entryShard[entryKey];
    final weight = _entryWeight.remove(entryKey);
    if (shard != null && weight != null && shard < _shardActiveWeight.length) {
      _shardActiveWeight[shard] = math.max(
        0,
        _shardActiveWeight[shard] - weight,
      );
      _shardEntryCounts[shard] = math.max(0, _shardEntryCounts[shard] - 1);
    }
    _forgetIdleShard(entryKey);
  }

  void _forgetIdleShard(String key) {
    if (_entryShardRefs.containsKey(key) ||
        _diskLru.containsKey(key) ||
        _pendingDiskDeletes.containsKey(key) ||
        _pendingRequests.values.any((request) => request.entryKey == key)) {
      return;
    }
    _entryShard.remove(key);
  }

  int _claimCancelSlot() {
    final start = _globalNextSlot++ & 255;
    for (var offset = 0; offset < 256 && isNativeCancelSupported; offset++) {
      final slot = (start + offset) & 255;
      if (nativeCancelSlotClaim(slot)) return slot;
    }
    return -1;
  }

  /// Atomically invalidates the in-flight native strip for [context] so the
  /// worker aborts remaining frames instead of burning CPU/LZ4 on stale pixels.
  void cancelInFlight(T context) {
    final slot = _pendingByContext[context]?.cancelSlot ?? -1;
    if (slot >= 0) nativeCancelSlotStore(slot, _cancelledToken);
  }

  _PendingRequest<T>? _takeRequest(int id) {
    final request = _pendingRequests.remove(id);
    if (request == null) return null;
    if (identical(_pendingByContext[request.context], request)) {
      _pendingByContext.remove(request.context);
    }
    if (request.cancelSlot >= 0) nativeCancelSlotStore(request.cancelSlot, 0);
    return request;
  }

  bool isInlineShard(int shard) => !isBrowserRasterWorker(_handles[shard]);

  int get browserWorkers => _handles.where(isBrowserRasterWorker).length;
  int get browserWasmWorkers =>
      _handles.where(browserRasterWorkerUsesWasm).length;

  WorkerHandle _inlineOrNativeHandle(int shard) => startWorkerHandle(
    softwareWorkerEntry,
    debugName: 'fastlottie.raster.$shard',
  );

  StreamSubscription<Object?> _listen(int shard, WorkerHandle handle) =>
      handle.messages.listen(
        (message) => _handleWorkerMessage(shard, message),
        onError: (Object error) => _replaceWorker(shard, handle, error),
      );

  void _replaceWorker(int shard, WorkerHandle failed, Object error) {
    if (_disposed || !identical(_handles[shard], failed)) return;
    final browserFallback = isBrowserRasterWorker(failed);
    unawaited(_subs[shard].cancel());
    failed.dispose();
    _registeredScenes[shard].clear();
    _compressedRamBytes -= _workerRamBytes[shard];
    _workerRamBytes[shard] = 0;
    if (browserFallback) {
      _restartShard(shard);
    } else {
      // A persistent startup failure must not cause an idle respawn loop.
      _failedShards.add(shard);
      final missedDeletes = _pendingDiskDeletes.entries
          .where((entry) => entry.value == shard)
          .map((entry) => entry.key)
          .toList();
      for (final key in missedDeletes) {
        _evictKeyOnShard(key);
      }
    }
    final interrupted = _pendingRequests.values
        .where((request) => request.shard == shard)
        .toList();
    for (final request in interrupted) {
      _takeRequest(request.reqId);
      _forgetIdleShard(request.entryKey);
      listener.onWorkerInterrupted(request.context, error);
    }
  }

  void _restartShard(int shard) {
    final handle = _inlineOrNativeHandle(shard);
    _handles[shard] = handle;
    _subs[shard] = _listen(shard, handle);
    handle.send((
      opConfigure,
      diskDirectory: maximumDiskBytes > 0 ? _diskDir : null,
      maximumDiskBytes: maximumDiskBytes,
      maximumRamBytes: _workerRamLimits[shard],
      deduplicateUploads: deduplicateImageUploads,
    ));
  }

  void _registerScene(_PendingRequest<T> request) {
    final handle = _handles[request.shard];
    if (isBrowserRasterWorker(handle)) {
      final bytes = request.sourceBytes;
      if (bytes == null) {
        throw StateError(
          'Browser raster worker requires composition source bytes',
        );
      }
      handle.send((
        opRegisterScene,
        contentKey: request.contentKey,
        bytes: bytes,
        useSimd: request.scene.options.useSimd,
      ));
    } else {
      handle.send((
        opRegisterScene,
        contentKey: request.contentKey,
        scene: isIsolatePoolSupported ? request.scene : request.scene.fork(),
      ));
    }
    final scenes = _registeredScenes[request.shard];
    scenes.remove(request.contentKey);
    if (scenes.length >= maxWorkerScenes) scenes.remove(scenes.first);
    scenes.add(request.contentKey);
  }

  void _sendRequest(_PendingRequest<T> request) {
    final shard = request.shard;
    final scenes = _registeredScenes[shard];
    if (scenes.remove(request.contentKey)) {
      scenes.add(request.contentKey);
    }
    final handle = _handles[shard];
    if (request.stripCount > 1) {
      if (!isBrowserRasterWorker(handle) && request.cancelSlot >= 0) {
        handle.send((
          opRenderStripNative,
          requestId: request.reqId,
          entryKey: request.entryKey,
          contentKey: request.contentKey,
          stripStart: request.stripStart,
          stripCount: request.stripCount,
          startFrame: request.startFrame,
          frameStep: request.frameStep,
          width: request.width,
          height: request.height,
          totalFrames: request.totalFrames,
          poster: request.poster,
          cancelSlot: request.cancelSlot,
          cancelToken: _claimedCancelToken,
        ));
      } else {
        handle.send((
          opRenderStrip,
          requestId: request.reqId,
          entryKey: request.entryKey,
          contentKey: request.contentKey,
          stripStart: request.stripStart,
          stripCount: request.stripCount,
          startFrame: request.startFrame,
          frameStep: request.frameStep,
          width: request.width,
          height: request.height,
          totalFrames: request.totalFrames,
          poster: request.poster,
        ));
      }
    } else {
      final index = resolveWorkerSourceIndex(
        request.stripStart,
        request.totalFrames,
        request.frameStep,
      );
      handle.send((
        opRenderFrame,
        requestId: request.reqId,
        entryKey: request.entryKey,
        contentKey: request.contentKey,
        frame: request.startFrame + index,
        frameIndex: index,
        width: request.width,
        height: request.height,
        totalFrames: request.totalFrames,
        poster: request.poster,
      ));
    }
  }

  void attachDiskDirectory(String? directory) {
    if (_disposed) return;
    final next = (directory == null || directory.isEmpty) ? null : directory;
    if (next == _diskDir) return;
    _diskDir = next;
    _diskScanGen++;
    _diskScanInProgress = false;
    _diskScanFuture = null;
    _diskLru.clear();
    _diskBytes = 0;
    _lastTouchedDiskKey = null;
    _pendingDiskDeletes.clear();
    for (final key in _entryShard.keys.toList()) {
      _forgetIdleShard(key);
    }
    if (next != null && isDiskCacheSupported) {
      _startAsyncDiskScan(next);
    }
    if (_started) {
      final effective = maximumDiskBytes > 0 ? _diskDir : null;
      for (var i = 0; i < _handles.length; i++) {
        _handles[i].send((
          opConfigure,
          diskDirectory: effective,
          maximumDiskBytes: maximumDiskBytes,
          maximumRamBytes: _workerRamLimits[i],
          deduplicateUploads: deduplicateImageUploads,
        ));
      }
    }
  }

  void _startAsyncDiskScan(String dir) {
    final scanGen = ++_diskScanGen;
    _diskScanInProgress = true;
    _deletedDuringDiskScan.clear();
    _lastTouchedDiskKey = null;
    // Run disk scan I/O in Zone.root so real dart:io futures never deadlock if
    // a cache is created inside a FakeAsync widget test zone.
    final future = Zone.root.run(() async {
      final entries = await PlatformDiskFs.listFilesAsync(
        dir,
        suffix: '.flcache',
      );
      if (_disposed || scanGen != _diskScanGen || _diskDir != dir) return;
      final deletedWhileScanning = Set<String>.of(_deletedDuringDiskScan);
      _deletedDuringDiskScan.clear();
      _diskScanInProgress = false;
      if (maximumDiskBytes <= 0) {
        _diskLru.clear();
        _diskBytes = 0;
        for (final file in entries) {
          if (_disposed || scanGen != _diskScanGen || _diskDir != dir) return;
          final name = file.name;
          if (!name.endsWith('.flcache')) continue;
          final stem = name.substring(0, name.length - '.flcache'.length);
          if (_started) {
            _evictKeyOnShard(stem);
          } else {
            _pendingDiskDeletes[stem] = -1;
            try {
              await PlatformDiskFs.deleteFileAsync(file.path);
            } finally {
              if (_pendingDiskDeletes[stem] == -1) {
                _pendingDiskDeletes.remove(stem);
              }
            }
          }
        }
        return;
      }
      entries.sort((a, b) => a.modifiedMs.compareTo(b.modifiedMs));
      final merged = <String, int>{};
      var totalBytes = 0;
      for (final file in entries) {
        final name = file.name;
        if (!name.endsWith('.flcache')) continue;
        final stem = name.substring(0, name.length - '.flcache'.length);
        if (_pendingDiskDeletes.containsKey(stem) ||
            deletedWhileScanning.contains(stem) ||
            _diskLru.containsKey(stem)) {
          continue;
        }
        merged[stem] = file.size;
        totalBytes += file.size;
      }
      for (final live in _diskLru.entries) {
        merged[live.key] = live.value;
        totalBytes += live.value;
      }
      _diskLru
        ..clear()
        ..addAll(merged);
      _diskBytes = totalBytes;
      if (_diskBytes > maximumDiskBytes) {
        final activeKeys = <String>{
          ..._entryShardRefs.keys,
          for (final req in _pendingRequests.values) req.entryKey,
        };
        if (_started) {
          enforceDiskBudget(activeKeys);
        } else {
          // Await host-side deletions sequentially while workers are idle so
          // a subsequent worker startup cannot race with an unawaited unlink.
          while (!_disposed &&
              scanGen == _diskScanGen &&
              _diskDir == dir &&
              _diskBytes > maximumDiskBytes &&
              _diskLru.isNotEmpty) {
            if (_started) {
              enforceDiskBudget(activeKeys);
              break;
            }
            String? victim;
            for (final candidate in _diskLru.keys) {
              if (!activeKeys.contains(candidate)) {
                victim = candidate;
                break;
              }
            }
            victim ??= _diskLru.keys.first;
            final sz = _diskLru.remove(victim)!;
            _diskBytes -= sz;
            if (_lastTouchedDiskKey == victim) _lastTouchedDiskKey = null;
            _pendingDiskDeletes[victim] = -1;
            try {
              await PlatformDiskFs.deleteFileAsync(
                joinPath(dir, '$victim.flcache'),
              );
            } finally {
              if (_pendingDiskDeletes[victim] == -1) {
                _pendingDiskDeletes.remove(victim);
              }
              _forgetIdleShard(victim);
            }
          }
        }
      }
    });
    _diskScanFuture = future;
    unawaited(future);
  }

  void touchDiskEntry(String entryKey) {
    if (_diskDir == null ||
        maximumDiskBytes <= 0 ||
        _diskLru.length <= 1 ||
        entryKey == _lastTouchedDiskKey) {
      return;
    }
    final sz = _diskLru.remove(entryKey);
    if (sz != null) {
      _diskLru[entryKey] = sz;
      _lastTouchedDiskKey = entryKey;
    }
  }

  void _handleWorkerMessage(int shard, Object? raw) {
    if (_disposed) return;
    switch (raw) {
      case (
        repFrameReady,
        requestId: final int reqId,
        entryKey: final String entryKey,
        pixels: final Object packed,
        vectorRendered: final bool vectorRendered,
        entryDiskBytes: final int entryDiskBytes,
        workerRamBytes: final int workerRam,
        renderMicros: final int renderMicros,
        kernelCalls: final int kernelCalls,
        geometryCopyBytes: final int geometryCopyBytes,
        transferBytes: final int transferBytes,
        fpHi: final int fpHi,
        fpLo: final int fpLo,
      ):
        final pending = _takeRequest(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          if (!_pendingDiskDeletes.containsKey(entryKey)) {
            _recordDiskWrite(entryKey, entryDiskBytes);
          }
        } else if (!_pendingDiskDeletes.containsKey(entryKey)) {
          touchDiskEntry(entryKey);
        }
        _forgetIdleShard(entryKey);
        listener.onStripReady(
          pending.context,
          pending.dispatchedGen,
          entryKey: entryKey,
          stripStart: pending.stripStart,
          stripCount: 1,
          stripWidth: pending.width,
          stripHeight: pending.height,
          bgraBytes: bgra,
          vectorRendered: vectorRendered,
          vectorCount: vectorRendered ? 1 : 0,
          compressedHit: !vectorRendered,
          compressedCount: vectorRendered ? 0 : 1,
          entryDiskBytes: entryDiskBytes > 0 ? entryDiskBytes : 0,
          renderMicros: renderMicros,
          kernelCalls: kernelCalls,
          geometryCopyBytes: geometryCopyBytes,
          transferBytes: transferBytes,
          fpHi: fpHi,
          fpLo: fpLo,
        );
      case (
        repStripReady,
        requestId: final int reqId,
        entryKey: final String entryKey,
        stripStart: final int stripStart,
        stripCount: final int stripCount,
        pixels: final Object packed,
        vectorCount: final int vectorCount,
        compressedCount: final int compressedCount,
        entryDiskBytes: final int entryDiskBytes,
        workerRamBytes: final int workerRam,
        stripWidth: final int stripWidth,
        stripHeight: final int stripHeight,
        renderMicros: final int renderMicros,
        kernelCalls: final int kernelCalls,
        geometryCopyBytes: final int geometryCopyBytes,
        transferBytes: final int transferBytes,
        fpHi: final int fpHi,
        fpLo: final int fpLo,
      ):
        final pending = _takeRequest(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          if (!_pendingDiskDeletes.containsKey(entryKey)) {
            _recordDiskWrite(entryKey, entryDiskBytes);
          }
        } else if (!_pendingDiskDeletes.containsKey(entryKey)) {
          touchDiskEntry(entryKey);
        }
        _forgetIdleShard(entryKey);
        listener.onStripReady(
          pending.context,
          pending.dispatchedGen,
          entryKey: entryKey,
          stripStart: stripStart,
          stripCount: stripCount,
          stripWidth: stripWidth,
          stripHeight: stripHeight,
          bgraBytes: bgra,
          vectorRendered: vectorCount > 0,
          vectorCount: vectorCount,
          compressedHit: compressedCount > 0,
          compressedCount: compressedCount,
          entryDiskBytes: entryDiskBytes > 0 ? entryDiskBytes : 0,
          renderMicros: renderMicros,
          kernelCalls: kernelCalls,
          geometryCopyBytes: geometryCopyBytes,
          transferBytes: transferBytes,
          fpHi: fpHi,
          fpLo: fpLo,
        );
      case (
        repFrameError,
        requestId: final int reqId,
        message: final String message,
      ):
        final pending = _takeRequest(reqId);
        if (pending == null) return;
        _forgetIdleShard(pending.entryKey);
        listener.onStripError(pending.context, StateError(message));
      case (
        repSceneMissing,
        requestId: final int reqId,
        contentKey: final String contentKey,
      ):
        final pending = _pendingRequests[reqId];
        if (pending == null) return;
        if (pending.retried) {
          _takeRequest(reqId);
          _forgetIdleShard(pending.entryKey);
          listener.onStripError(
            pending.context,
            StateError('Missing worker scene for $contentKey'),
          );
          return;
        }
        pending.retried = true;
        try {
          _registerScene(pending);
          _sendRequest(pending);
        } catch (error) {
          _takeRequest(reqId);
          _forgetIdleShard(pending.entryKey);
          listener.onStripError(pending.context, error);
        }
      case (
        repStripCancelled,
        requestId: final int reqId,
        workerRamBytes: final int workerRam,
      ):
        final pending = _takeRequest(reqId);
        _updateWorkerRam(shard, workerRam);
        if (pending == null) return;
        _forgetIdleShard(pending.entryKey);
        listener.onStripCancelled(pending.context, pending.dispatchedGen);
      case (
        repDeleted,
        entryKey: final String entryKey,
        workerRamBytes: final int workerRam,
      ):
        _updateWorkerRam(shard, workerRam);
        if (entryKey.isNotEmpty) {
          if (_diskScanInProgress) _deletedDuringDiskScan.add(entryKey);
          _pendingDiskDeletes.remove(entryKey);
          _forgetIdleShard(entryKey);
        }
    }
  }

  void _updateWorkerRam(int shard, int nextBytes) {
    if (shard >= _workerRamBytes.length) return;
    _compressedRamBytes += nextBytes - _workerRamBytes[shard];
    _workerRamBytes[shard] = nextBytes;
    _maybeRebalanceShardRam(shard);
  }

  // Shift unused compressed-RAM headroom from under-utilized shards to a
  // saturated shard while strictly keeping sum(_workerRamLimits) <= global cap.
  void _maybeRebalanceShardRam(int hotShard) {
    final count = _handles.length;
    if (count <= 1 || maximumCompressedMemoryBytes <= 0) return;
    final currentLimit = _workerRamLimits[hotShard];
    final hotUsed = _workerRamBytes[hotShard];
    if (currentLimit <= 0 || hotUsed * 10 < currentLimit * 8) return;
    if (_compressedRamBytes * 10 >= maximumCompressedMemoryBytes * 9) return;

    final floorPerShard = math.min(
      maximumCompressedMemoryBytes ~/ (count * 2),
      512 * 1024,
    );
    final maxForOne = (maximumCompressedMemoryBytes * 3) ~/ 4;
    if (currentLimit >= maxForOne) return;

    var donor = -1;
    var bestSpare = 0;
    for (var i = 0; i < count; i++) {
      if (i == hotShard) continue;
      final minKeep = math.max(floorPerShard, (_workerRamBytes[i] * 5) ~/ 4);
      final spare = _workerRamLimits[i] - minKeep;
      if (spare > bestSpare) {
        bestSpare = spare;
        donor = i;
      }
    }
    const minTransfer = 256 * 1024;
    if (donor < 0 || bestSpare < minTransfer) return;
    final transfer = math.min(bestSpare ~/ 2, maxForOne - currentLimit);
    if (transfer < minTransfer) return;

    _workerRamLimits[donor] -= transfer;
    _workerRamLimits[hotShard] += transfer;
    final effectiveDiskDir = maximumDiskBytes > 0 ? _diskDir : null;
    _handles[donor].send((
      opConfigure,
      diskDirectory: effectiveDiskDir,
      maximumDiskBytes: maximumDiskBytes,
      maximumRamBytes: _workerRamLimits[donor],
      deduplicateUploads: deduplicateImageUploads,
    ));
    _handles[hotShard].send((
      opConfigure,
      diskDirectory: effectiveDiskDir,
      maximumDiskBytes: maximumDiskBytes,
      maximumRamBytes: _workerRamLimits[hotShard],
      deduplicateUploads: deduplicateImageUploads,
    ));
  }

  void _recordDiskWrite(String entryKey, int newSize) {
    if (_diskDir == null || maximumDiskBytes <= 0) return;
    final prev = _diskLru.remove(entryKey) ?? 0;
    _diskBytes += newSize - prev;
    if (newSize > maximumDiskBytes) {
      // Single file exceeds entire disk cap: delete rather than blowing budget.
      _diskBytes -= newSize;
      _lastTouchedDiskKey = null;
      _evictKeyOnShard(entryKey);
      return;
    }
    _diskLru[entryKey] = newSize;
    _lastTouchedDiskKey = entryKey;
  }

  void enforceDiskBudget(Set<String> activeKeys) {
    if (_diskDir == null || maximumDiskBytes <= 0) return;
    while (_diskBytes > maximumDiskBytes && _diskLru.isNotEmpty) {
      String? victim;
      for (final candidate in _diskLru.keys) {
        if (!activeKeys.contains(candidate)) {
          victim = candidate;
          break;
        }
      }
      victim ??= _diskLru.keys.first;
      final sz = _diskLru.remove(victim)!;
      _diskBytes -= sz;
      if (_lastTouchedDiskKey == victim) {
        _lastTouchedDiskKey = null;
      }
      _evictKeyOnShard(victim);
    }
  }

  void _evictKeyOnShard(String entryKey) {
    if (_diskScanInProgress) _deletedDuringDiskScan.add(entryKey);
    if (_started) {
      final shard =
          _entryShard[entryKey] ?? _shardForKey(entryKey, _handles.length);
      if (!_failedShards.contains(shard)) {
        _pendingDiskDeletes[entryKey] = shard;
        _handles[shard].send((opDeleteDisk, entryKey: entryKey));
        return;
      }
    }
    if (_diskDir != null && isDiskCacheSupported) {
      final path = joinPath(_diskDir!, '$entryKey.flcache');
      _pendingDiskDeletes[entryKey] = -1;
      unawaited(
        PlatformDiskFs.deleteFileAsync(path).whenComplete(() {
          if (_pendingDiskDeletes[entryKey] == -1) {
            _pendingDiskDeletes.remove(entryKey);
          }
          _forgetIdleShard(entryKey);
        }),
      );
    }
  }

  void dispatchStrip({
    required T context,
    required int shard,
    required int dispatchedGen,
    required RasterScene scene,
    required Uint8List? sourceBytes,
    required String contentKey,
    required String entryKey,
    required int stripStart,
    required int stripCount,
    required double startFrame,
    required double frameStep,
    required int width,
    required int height,
    required int totalFrames,
    required bool poster,
  }) {
    if (_disposed) return;
    if (_failedShards.remove(shard)) _restartShard(shard);
    final reqId = _nextReqId++;
    debugDispatchCount++;
    final cancelSlot = stripCount > 1 && isIsolatePoolSupported
        ? _claimCancelSlot()
        : -1;
    final request = _pendingRequests[reqId] = _PendingRequest<T>(
      reqId: reqId,
      shard: shard,
      context: context,
      dispatchedGen: dispatchedGen,
      entryKey: entryKey,
      contentKey: contentKey,
      scene: scene,
      sourceBytes: sourceBytes,
      stripStart: stripStart,
      stripCount: stripCount,
      startFrame: startFrame,
      frameStep: frameStep,
      width: width,
      height: height,
      totalFrames: totalFrames,
      poster: poster,
      cancelSlot: cancelSlot,
    );
    _pendingByContext[context] = request;
    // A cold entry (or any entry when disk caching is disabled) needs vector
    // pixels, so send its scene with the first request to avoid a round trip.
    // For existing disk files, let the worker check its pixels first.
    final mayHitDisk =
        maximumDiskBytes > 0 &&
        _diskDir != null &&
        (_diskScanInProgress || _diskLru.containsKey(entryKey));
    try {
      if (!mayHitDisk && !_registeredScenes[shard].contains(contentKey)) {
        _registerScene(request);
      }
      _sendRequest(request);
    } catch (_) {
      _takeRequest(reqId);
      rethrow;
    }
  }

  void clearMemoryCaches() {
    if (!_started || _disposed) return;
    for (var i = 0; i < _handles.length; i++) {
      _handles[i].send(const (opClearMem,));
      _registeredScenes[i].clear();
      _workerRamBytes[i] = 0;
    }
    _compressedRamBytes = 0;
  }

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _diskScanGen++;
    _diskScanInProgress = false;
    _diskScanFuture = null;
    for (final request in _pendingRequests.values) {
      if (request.cancelSlot < 0) continue;
      final slot = request.cancelSlot;
      nativeCancelSlotStore(slot, _cancelledToken);
      unawaited(
        workerHandleExited(_handles[request.shard]).then((_) {
          nativeCancelSlotStore(slot, 0);
        }),
      );
    }
    _pendingRequests.clear();
    _pendingByContext.clear();
    _lastTouchedDiskKey = null;
    for (final sub in _subs) {
      sub.cancel();
    }
    _subs.clear();
    for (final h in _handles) {
      h.dispose();
    }
    _handles.clear();
    _registeredScenes.clear();
    _workerRamBytes.clear();
    _workerRamLimits.clear();
    _shardActiveWeight.clear();
    _shardEntryCounts.clear();
    _entryShard.clear();
    _entryWeight.clear();
    _entryShardRefs.clear();
    _compressedRamBytes = 0;

    final dir = _diskDir;
    if (dir != null && isDiskCacheSupported && _pendingDiskDeletes.isNotEmpty) {
      for (final victim in _pendingDiskDeletes.keys) {
        PlatformDiskFs.deleteFile(joinPath(dir, '$victim.flcache'));
      }
      _pendingDiskDeletes.clear();
    }
  }
}
