import 'dart:async';
import 'dart:typed_data';

import '../platform/isolate_stub.dart'
    if (dart.library.isolate) '../platform/isolate_io.dart';
import '../platform/platform_stub.dart'
    if (dart.library.io) '../platform/platform_io.dart';
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
    int? frameCrc,
  });

  void onStripError(T context, Object error);

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
  String? _diskDir;

  final _handles = <WorkerHandle>[];
  final _subs = <StreamSubscription<Object?>>[];
  final _registeredScenes = <Set<String>>[];
  final _workerRamBytes = <int>[];
  final _pendingRequests = <int, _PendingRequest<T>>{};

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
      _subs.add(_listen(shard, handle));
      handle.send((
        opConfigure,
        diskDirectory: effectiveDiskDir,
        maximumRamBytes: perWorkerRam,
      ));
    }
  }

  int shardForKey(String entryKey) {
    _ensureStarted();
    return _shardForKey(entryKey, _handles.length);
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
    final handle = _handles[shard];
    if (request.stripCount > 1) {
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
      final perWorkerRam = maximumCompressedMemoryBytes ~/ _handles.length;
      for (final h in _handles) {
        h.send((
          opConfigure,
          diskDirectory: effective,
          maximumRamBytes: perWorkerRam,
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
        frameCrc: final int frameCrc,
      ):
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          _recordDiskWrite(entryKey, entryDiskBytes);
        } else {
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
          frameCrc: frameCrc,
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
        frameCrc: final int frameCrc,
      ):
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        final bgra = unpackBytesFromIsolate(packed);
        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          _recordDiskWrite(entryKey, entryDiskBytes);
        } else {
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
          frameCrc: frameCrc,
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
      final shard = _shardForKey(entryKey, _handles.length);
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
    );
    // A new disk entry needs vector pixels. Send its first scene with the
    // request to avoid a round trip. For existing files (including partial
    // ones), let the worker check its pixels before copying a scene.
    if (maximumDiskBytes > 0 &&
        _diskDir != null &&
        !_diskLru.containsKey(entryKey) &&
        !_registeredScenes[shard].contains(contentKey)) {
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
