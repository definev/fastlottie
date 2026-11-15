part of '../fastlottie.dart';

int _shardForKey(String entryKey, int shardCount) {
  if (shardCount <= 1) return 0;
  if (kIsWeb) {
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

abstract interface class _RasterWorkerListener {
  void onStripReady(
    _RasterEntry entry,
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
  });

  void onStripError(_RasterEntry entry, Object error);

  void onBrowserWorkerFallback(_RasterEntry entry);
}

final class _PendingWorkerRequest {
  _PendingWorkerRequest({
    required this.reqId,
    required this.shard,
    required this.entry,
    required this.dispatchedGen,
    required this.entryKey,
    required this.contentKey,
    required this.composition,
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
  final _RasterEntry entry;
  final int dispatchedGen;
  final String entryKey;
  final String contentKey;
  final FastLottieComposition composition;
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

final class _RasterWorkerPool {
  _RasterWorkerPool({
    required this.listener,
    required this.workerCount,
    required this.maximumCompressedMemoryBytes,
    required this.maximumDiskBytes,
    String? diskCacheDirectory,
  }) : _diskDir = (diskCacheDirectory == null || diskCacheDirectory.isEmpty)
           ? null
           : diskCacheDirectory {
    if (_diskDir != null && isDiskCacheSupported) {
      _scanExistingDiskFiles(_diskDir!);
    }
  }

  final _RasterWorkerListener listener;
  final int workerCount;
  final int maximumCompressedMemoryBytes;
  final int maximumDiskBytes;
  String? _diskDir;

  final _handles = <WorkerHandle>[];
  final _subs = <StreamSubscription<Object?>>[];
  final _registeredScenes = <Set<String>>[];
  final _workerRamBytes = <int>[];
  final _pendingRequests = <int, _PendingWorkerRequest>{};

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

  bool _rememberScene(int shard, String contentKey) {
    final scenes = _registeredScenes[shard];
    final known = scenes.remove(contentKey);
    if (scenes.length >= maxWorkerScenes) scenes.remove(scenes.first);
    scenes.add(contentKey);
    return known;
  }

  void _ensureStarted() {
    if (_started || _disposed) return;
    _started = true;
    for (var i = 0; i < workerCount; i++) {
      final browser = startBrowserRasterWorker('fastlottie.raster.$i');
      if (kIsWeb && browser == null) {
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
      handle.send((opConfigure, effectiveDiskDir, perWorkerRam));
    }
  }

  int shardForEntry(_RasterEntry entry) {
    _ensureStarted();
    return entry.workerShard ??= _shardForKey(entry.entryKey, _handles.length);
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
      null,
      maximumCompressedMemoryBytes ~/ _handles.length,
    ));
    final interrupted = _pendingRequests.values
        .where((request) => request.shard == shard)
        .toList();
    for (final request in interrupted) {
      _pendingRequests.remove(request.reqId);
      listener.onBrowserWorkerFallback(request.entry);
    }
  }

  void _registerScene(
    int shard,
    String key,
    FastLottieComposition composition,
  ) {
    final handle = _handles[shard];
    if (isBrowserRasterWorker(handle)) {
      handle.send((
        opRegisterScene,
        key,
        composition._workerSource!,
        composition.options.useSimd,
      ));
    } else {
      handle.send((
        opRegisterScene,
        key,
        isIsolatePoolSupported
            ? composition._template
            : composition._template.fork(),
      ));
    }
  }

  void _sendRequest(_PendingWorkerRequest request, {bool register = false}) {
    final shard = request.shard;
    if (!_rememberScene(shard, request.contentKey) || register) {
      _registerScene(shard, request.contentKey, request.composition);
    }
    final handle = _handles[shard];
    if (request.stripCount > 1) {
      handle.send((
        opRenderStrip,
        request.reqId,
        request.entryKey,
        request.contentKey,
        request.stripStart,
        request.stripCount,
        request.startFrame,
        request.frameStep,
        request.width,
        request.height,
        request.totalFrames,
        request.poster,
      ));
    } else {
      final index = resolveWorkerSourceIndex(
        request.stripStart,
        request.totalFrames,
        request.frameStep,
      );
      handle.send((
        opRenderFrame,
        request.reqId,
        request.entryKey,
        request.contentKey,
        request.startFrame + index,
        index,
        request.width,
        request.height,
        request.totalFrames,
        request.poster,
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
        h.send((opConfigure, effective, perWorkerRam));
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
        final int reqId,
        final String entryKey,
        final Object packed,
        final bool vectorRendered,
        final int entryDiskBytes,
        final int workerRam,
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
          pending.entry,
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
        );
      case (
        repStripReady,
        final int reqId,
        final String entryKey,
        final int stripStart,
        final int stripCount,
        final Object packed,
        final int vectorCount,
        final int compressedCount,
        final int entryDiskBytes,
        final int workerRam,
        final int stripWidth,
        final int stripHeight,
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
          pending.entry,
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
        );
      case (repFrameError, final int reqId, final String message):
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        listener.onStripError(pending.entry, StateError(message));
      case (repSceneMissing, final int reqId, final String contentKey):
        final pending = _pendingRequests[reqId];
        if (pending == null) return;
        if (pending.retried) {
          _pendingRequests.remove(reqId);
          listener.onStripError(
            pending.entry,
            StateError('Missing worker scene for $contentKey'),
          );
          return;
        }
        pending.retried = true;
        _sendRequest(pending, register: true);
      case (repDeleted, final String entryKey, final int workerRam):
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
      _handles[shard].send((opDeleteDisk, entryKey));
    } else if (_diskDir != null && isDiskCacheSupported) {
      PlatformDiskFs.deleteFile(joinPath(_diskDir!, '$entryKey.flcache'));
      _pendingDiskDeletes.remove(entryKey);
    }
  }

  void dispatchStrip({
    required _RasterEntry entry,
    required int dispatchedGen,
    required FastLottieComposition composition,
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
    final shard = shardForEntry(entry);
    final contentKey = composition.contentKey;
    final reqId = _nextReqId++;
    debugDispatchCount++;
    final request = _pendingRequests[reqId] = _PendingWorkerRequest(
      reqId: reqId,
      shard: shard,
      entry: entry,
      dispatchedGen: dispatchedGen,
      entryKey: entryKey,
      contentKey: contentKey,
      composition: composition,
      stripStart: stripStart,
      stripCount: stripCount,
      startFrame: startFrame,
      frameStep: frameStep,
      width: width,
      height: height,
      totalFrames: totalFrames,
      poster: poster,
    );
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
