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

  void onBrowserWorkerFallback(T context);
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
    this.cancelToken = 0,
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
  final int cancelToken;
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
      _scanExistingDiskFiles(_diskDir!);
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
  final _registeredScenes = <Set<String>>[];
  final _workerRamBytes = <int>[];
  final _workerRamLimits = <int>[];
  final _shardActiveWeight = <int>[];
  final _shardEntryCounts = <int>[];
  final _entryShard = <String, int>{};
  final _entryWeight = <String, int>{};
  final _entryCancelSlot = <String, int>{};
  final _entryCancelToken = <String, int>{};
  final _pendingRequests = <int, _PendingRequest<T>>{};

  static int _globalNextSlot = 0;
  static int _globalNextToken = 1;

  // Host-tracked disk cache LRU across all shards.
  final _diskLru = <String, int>{};
  final _pendingDiskDeletes = <String>{};
  String? _lastTouchedDiskKey;
  int _diskBytes = 0;
  int _compressedRamBytes = 0;
  int _nextReqId = 1;
  int debugDispatchCount = 0;
  bool _started = false;
  bool _disposed = false;

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
    if (existing != null && existing < _handles.length) {
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
    final shard = _entryShard[entryKey];
    final weight = _entryWeight.remove(entryKey);
    if (shard != null && weight != null && shard < _shardActiveWeight.length) {
      _shardActiveWeight[shard] = math.max(
        0,
        _shardActiveWeight[shard] - weight,
      );
      _shardEntryCounts[shard] = math.max(0, _shardEntryCounts[shard] - 1);
    }
  }

  int _cancelSlotFor(String entryKey) =>
      _entryCancelSlot.putIfAbsent(entryKey, () => (_globalNextSlot++) & 255);

  /// Atomically invalidates any in-flight native strip for [entryKey] so the
  /// worker aborts remaining frames instead of burning CPU/LZ4 on stale pixels.
  void cancelInFlight(String entryKey) {
    if (!isNativeCancelSupported || !isIsolatePoolSupported) return;
    final slot = _entryCancelSlot[entryKey];
    if (slot == null) return;
    var token = (_globalNextToken++) & 0x7fffffff;
    if (token == 0) token = (_globalNextToken++) & 0x7fffffff;
    _entryCancelToken[entryKey] = token;
    nativeCancelSlotStore(slot, token);
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
        onError: (Object error) {
          if (isBrowserRasterWorker(handle)) {
            _fallbackFromBrowser(shard, handle);
          }
        },
      );

  void _fallbackFromBrowser(int shard, WorkerHandle failed) {
    if (_disposed || !identical(_handles[shard], failed)) return;
    unawaited(_subs[shard].cancel());
    failed.dispose();
    final handle = _inlineOrNativeHandle(shard);
    _handles[shard] = handle;
    _subs[shard] = _listen(shard, handle);
    _registeredScenes[shard].clear();
    _updateWorkerRam(shard, 0);
    handle.send((
      opConfigure,
      diskDirectory: null,
      maximumRamBytes: maximumCompressedMemoryBytes ~/ _handles.length,
      deduplicateUploads: deduplicateImageUploads,
    ));
    final interrupted = _pendingRequests.values
        .where((request) => request.shard == shard)
        .toList();
    for (final request in interrupted) {
      _pendingRequests.remove(request.reqId);
      listener.onBrowserWorkerFallback(request.context);
    }
  }

  void _registerScene(_PendingRequest<T> request) {
    final scenes = _registeredScenes[request.shard];
    scenes.remove(request.contentKey);
    if (scenes.length >= maxWorkerScenes) scenes.remove(scenes.first);
    scenes.add(request.contentKey);
    final handle = _handles[request.shard];
    if (isBrowserRasterWorker(handle)) {
      handle.send((
        opRegisterScene,
        contentKey: request.contentKey,
        bytes: request.sourceBytes!,
        useSimd: request.scene.options.useSimd,
      ));
    } else {
      handle.send((
        opRegisterScene,
        contentKey: request.contentKey,
        scene: isIsolatePoolSupported ? request.scene : request.scene.fork(),
      ));
    }
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
          cancelToken: request.cancelToken,
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
    _diskLru.clear();
    _diskBytes = 0;
    _lastTouchedDiskKey = null;
    _pendingDiskDeletes.clear();
    if (next != null && isDiskCacheSupported) {
      _scanExistingDiskFiles(next);
    }
    if (_started) {
      final effective = maximumDiskBytes > 0 ? _diskDir : null;
      for (var i = 0; i < _handles.length; i++) {
        _handles[i].send((
          opConfigure,
          diskDirectory: effective,
          maximumRamBytes: _workerRamLimits[i],
          deduplicateUploads: deduplicateImageUploads,
        ));
      }
    }
  }

  void _scanExistingDiskFiles(String dir) {
    _lastTouchedDiskKey = null;
    PlatformDiskFs.ensureDirectory(dir);
    final entries = PlatformDiskFs.listFiles(dir, suffix: '.flcache');
    entries.sort((a, b) => a.modifiedMs.compareTo(b.modifiedMs));
    for (final file in entries) {
      final name = file.name;
      if (!name.endsWith('.flcache')) continue;
      final stem = name.substring(0, name.length - '.flcache'.length);
      _diskLru[stem] = file.size;
      _diskBytes += file.size;
    }
    if (maximumDiskBytes <= 0) {
      for (final file in entries) {
        PlatformDiskFs.deleteFile(file.path);
      }
      _diskLru.clear();
      _diskBytes = 0;
      return;
    }
    while (_diskBytes > maximumDiskBytes && _diskLru.isNotEmpty) {
      final victim = _diskLru.keys.first;
      final sz = _diskLru.remove(victim)!;
      _diskBytes -= sz;
      PlatformDiskFs.deleteFile(joinPath(dir, '$victim.flcache'));
    }
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
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          if (!_pendingDiskDeletes.contains(entryKey)) {
            _recordDiskWrite(entryKey, entryDiskBytes);
          }
        } else if (!_pendingDiskDeletes.contains(entryKey)) {
          touchDiskEntry(entryKey);
        }
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
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          if (!_pendingDiskDeletes.contains(entryKey)) {
            _recordDiskWrite(entryKey, entryDiskBytes);
          }
        } else if (!_pendingDiskDeletes.contains(entryKey)) {
          touchDiskEntry(entryKey);
        }
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
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        listener.onStripError(pending.context, StateError(message));
      case (
        repSceneMissing,
        requestId: final int reqId,
        contentKey: final String contentKey,
      ):
        final pending = _pendingRequests[reqId];
        if (pending == null) return;
        if (pending.retried) {
          _pendingRequests.remove(reqId);
          listener.onStripError(
            pending.context,
            StateError('Missing worker scene for $contentKey'),
          );
          return;
        }
        pending.retried = true;
        _registerScene(pending);
        _sendRequest(pending);
      case (
        repStripCancelled,
        requestId: final int reqId,
        workerRamBytes: final int workerRam,
      ):
        final pending = _pendingRequests.remove(reqId);
        _updateWorkerRam(shard, workerRam);
        if (pending == null) return;
        listener.onStripCancelled(pending.context, pending.dispatchedGen);
      case (
        repDeleted,
        entryKey: final String entryKey,
        workerRamBytes: final int workerRam,
      ):
        _updateWorkerRam(shard, workerRam);
        if (entryKey.isNotEmpty) {
          _pendingDiskDeletes.remove(entryKey);
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
      maximumRamBytes: _workerRamLimits[donor],
      deduplicateUploads: deduplicateImageUploads,
    ));
    _handles[hotShard].send((
      opConfigure,
      diskDirectory: effectiveDiskDir,
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
    _pendingDiskDeletes.add(entryKey);
    if (_started) {
      final shard = _entryShard[entryKey] ?? _shardForKey(entryKey, _handles.length);
      _handles[shard].send((opDeleteDisk, entryKey: entryKey));
    } else if (_diskDir != null && isDiskCacheSupported) {
      PlatformDiskFs.deleteFile(joinPath(_diskDir!, '$entryKey.flcache'));
      _pendingDiskDeletes.remove(entryKey);
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
    final reqId = _nextReqId++;
    debugDispatchCount++;
    var cancelSlot = -1;
    var cancelToken = 0;
    if (stripCount > 1 && isNativeCancelSupported && isIsolatePoolSupported) {
      cancelSlot = _cancelSlotFor(entryKey);
      var nextToken = (_globalNextToken++) & 0x7fffffff;
      if (nextToken == 0) nextToken = (_globalNextToken++) & 0x7fffffff;
      cancelToken = nextToken;
      _entryCancelToken[entryKey] = cancelToken;
      nativeCancelSlotStore(cancelSlot, cancelToken);
    }
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
      cancelToken: cancelToken,
    );
    // A cold entry (or any entry when disk caching is disabled) needs vector
    // pixels, so send its scene with the first request to avoid a round trip.
    // For existing disk files, let the worker check its pixels first.
    final mayHitDisk =
        maximumDiskBytes > 0 &&
        _diskDir != null &&
        _diskLru.containsKey(entryKey);
    if (!mayHitDisk && !_registeredScenes[shard].contains(contentKey)) {
      _registerScene(request);
    }
    _sendRequest(request);
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
    _pendingRequests.clear();
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
    _entryCancelSlot.clear();
    _entryCancelToken.clear();
    _compressedRamBytes = 0;

    final dir = _diskDir;
    if (dir != null && isDiskCacheSupported && _pendingDiskDeletes.isNotEmpty) {
      for (final victim in _pendingDiskDeletes) {
        PlatformDiskFs.deleteFile(joinPath(dir, '$victim.flcache'));
      }
      _pendingDiskDeletes.clear();
    }
  }
}
