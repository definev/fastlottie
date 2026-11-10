part of '../fastlottie.dart';

const int _opConfigure = 0;
const int _opRegisterScene = 1;
const int _opRenderFrame = 2;
const int _opDeleteDisk = 3;
const int _opClearMem = 4;

const int _repFrameReady = 0;
const int _repFrameError = 1;
const int _repDeleted = 2;
const int _repSceneMissing = 3;

int _shardForKey(String entryKey, int shardCount) {
  if (shardCount <= 1) return 0;
  var h = 0x811c9dc5;
  for (var i = 0; i < entryKey.length; i++) {
    h ^= entryKey.codeUnitAt(i);
    h = (h * 0x01000193) & 0x7FFFFFFF;
  }
  return h % shardCount;
}

void _softwareWorkerEntry(WorkerEndpoint endpoint) {
  final ws = _RasterWorkspace();
  final store = BitstreamStore();
  final lz4 = Lz4Scratch();
  final scenes = <String, _Compiler>{};
  const maxWorkerScenes = 256;
  var pixels = Uint32List(256 * 256);

  Uint32List ensurePixels(int count) {
    if (pixels.length < count) {
      var cap = math.max(256 * 256, pixels.length);
      while (cap < count) {
        cap *= 2;
      }
      pixels = Uint32List(cap);
    }
    return pixels;
  }

  endpoint.messages.listen((Object? raw) {
    if (raw == null) {
      store.dispose();
      scenes.clear();
      ws.resetCaches();
      endpoint.close();
      return;
    }
    if (raw is! List || raw.isEmpty) return;
    final op = raw[0] as int;
    switch (op) {
      case _opConfigure:
        final diskDir = raw[1] as String?;
        final ramLimit = raw[2] as int;
        store.maximumRamBytes = ramLimit;
        store.setDiskDirectory(diskDir);
      case _opRegisterScene:
        final contentKey = raw[1] as String;
        final scene = raw[2] as _Compiler;
        scenes.remove(contentKey);
        while (scenes.length >= maxWorkerScenes) {
          scenes.remove(scenes.keys.first);
          ws.resetCaches();
        }
        scenes[contentKey] = scene;
      case _opRenderFrame:
        final reqId = raw[1] as int;
        final entryKey = raw[2] as String;
        final contentKey = raw[3] as String;
        final frame = (raw[4] as num).toDouble();
        final frameIndex = raw[5] as int;
        final width = raw[6] as int;
        final height = raw[7] as int;
        final totalFrames = raw[8] as int;
        final poster = raw[9] as bool;

        try {
          final pxCount = width * height;
          final byteLen = pxCount * 4;
          final px = ensurePixels(pxCount);
          final dstBytes = px.buffer.asUint8List(0, byteLen);

          final cacheHit = store.tryReadFrame(
            entryKey: entryKey,
            width: width,
            height: height,
            totalFrames: totalFrames,
            poster: poster,
            frameIndex: frameIndex,
            dstBgra: dstBytes,
          );

          if (cacheHit) {
            final packed = packBytesForIsolate(dstBytes);
            endpoint.send(<Object?>[
              _repFrameReady,
              reqId,
              entryKey,
              frameIndex,
              packed,
              false, // vectorRendered
              true, // compressedHit
              0, // newly written compressedBytes
              -1, // unchanged diskBytes (-1 = unchanged)
              store.ramBytes,
            ]);
            return;
          }

          final scene = scenes.remove(contentKey);
          if (scene == null) {
            endpoint.send(<Object?>[_repSceneMissing, reqId, contentKey]);
            return;
          }
          scenes[contentKey] = scene;

          _renderSceneSoftware(scene, frame, px, width, height, ws);
          final stored = store.storeFrame(
            entryKey: entryKey,
            width: width,
            height: height,
            totalFrames: totalFrames,
            poster: poster,
            frameIndex: frameIndex,
            srcBgra: dstBytes,
            scratch: lz4,
          );
          final packed = packBytesForIsolate(dstBytes);
          endpoint.send(<Object?>[
            _repFrameReady,
            reqId,
            entryKey,
            frameIndex,
            packed,
            true, // vectorRendered
            false, // compressedHit
            stored.compressedBytes,
            stored.entryDiskBytes,
            store.ramBytes,
          ]);
        } catch (error) {
          endpoint.send(<Object?>[_repFrameError, reqId, error.toString()]);
        }
      case _opDeleteDisk:
        final entryKey = raw[1] as String;
        final deleted = store.deleteDiskEntry(entryKey);
        store.evictEntryRam(entryKey);
        endpoint.send(<Object?>[_repDeleted, entryKey, deleted, store.ramBytes]);
      case _opClearMem:
        store.clearRam();
        store.closeOpenFiles();
        endpoint.send(<Object?>[_repDeleted, '', true, store.ramBytes]);
    }
  });
}

final class _WorkerFrameResult {
  const _WorkerFrameResult({
    required this.entryKey,
    required this.frameIndex,
    required this.bgraBytes,
    required this.vectorRendered,
    required this.compressedHit,
    required this.compressedBytes,
    required this.entryDiskBytes,
  });

  final String entryKey;
  final int frameIndex;
  final Uint8List bgraBytes;
  final bool vectorRendered;
  final bool compressedHit;
  final int compressedBytes;
  final int entryDiskBytes;
}

final class _PendingWorkerRequest {
  _PendingWorkerRequest({
    required this.reqId,
    required this.shard,
    required this.entryKey,
    required this.contentKey,
    required this.composition,
    required this.frame,
    required this.frameIndex,
    required this.width,
    required this.height,
    required this.totalFrames,
    required this.poster,
    required this.completer,
  });

  final int reqId;
  final int shard;
  final String entryKey;
  final String contentKey;
  final FastLottieComposition composition;
  final double frame;
  final int frameIndex;
  final int width;
  final int height;
  final int totalFrames;
  final bool poster;
  final Completer<_WorkerFrameResult?> completer;
  bool retried = false;
}

final class _RasterWorkerPool {
  _RasterWorkerPool({
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
  int _diskBytes = 0;
  int _compressedRamBytes = 0;
  int _nextReqId = 1;
  bool _started = false;
  bool _disposed = false;

  int get diskBytes => _diskBytes;
  int get compressedRamBytes => _compressedRamBytes;
  String? get diskCacheDirectory => _diskDir;

  void _ensureStarted() {
    if (_started || _disposed) return;
    _started = true;
    final perWorkerRam = workerCount <= 0
        ? maximumCompressedMemoryBytes
        : maximumCompressedMemoryBytes ~/ workerCount;
    final effectiveDiskDir = maximumDiskBytes > 0 ? _diskDir : null;
    for (var i = 0; i < workerCount; i++) {
      final shard = i;
      _registeredScenes.add(<String>{});
      _workerRamBytes.add(0);
      final handle = startWorkerHandle(
        _softwareWorkerEntry,
        debugName: 'fastlottie.raster.$i',
      );
      _handles.add(handle);
      _subs.add(
        handle.messages.listen(
          (msg) => _handleWorkerMessage(shard, msg),
          onError: (_) {},
        ),
      );
      handle.send(<Object?>[_opConfigure, effectiveDiskDir, perWorkerRam]);
    }
  }

  void attachDiskDirectory(String? directory) {
    if (_disposed) return;
    final next = (directory == null || directory.isEmpty) ? null : directory;
    if (next == _diskDir) return;
    _diskDir = next;
    _diskLru.clear();
    _diskBytes = 0;
    _pendingDiskDeletes.clear();
    if (next != null && isDiskCacheSupported) {
      _scanExistingDiskFiles(next);
    }
    if (_started) {
      final effective = maximumDiskBytes > 0 ? _diskDir : null;
      final perWorkerRam = workerCount <= 0
          ? maximumCompressedMemoryBytes
          : maximumCompressedMemoryBytes ~/ workerCount;
      for (final h in _handles) {
        h.send(<Object?>[_opConfigure, effective, perWorkerRam]);
      }
    }
  }

  void _scanExistingDiskFiles(String dir) {
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
    final sz = _diskLru.remove(entryKey);
    if (sz != null) _diskLru[entryKey] = sz;
  }

  void _handleWorkerMessage(int shard, Object? raw) {
    if (_disposed || raw is! List || raw.isEmpty) return;
    final kind = raw[0] as int;
    switch (kind) {
      case _repFrameReady:
        final reqId = raw[1] as int;
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        final entryKey = raw[2] as String;
        final frameIndex = raw[3] as int;
        final bgra = unpackBytesFromIsolate(raw[4]!);
        final vectorRendered = raw[5] as bool;
        final compressedHit = raw[6] as bool;
        final compressedBytes = raw[7] as int;
        final entryDiskBytes = raw[8] as int;
        final workerRam = raw[9] as int;

        _updateWorkerRam(shard, workerRam);
        if (entryDiskBytes > 0) {
          _recordDiskWrite(entryKey, entryDiskBytes);
        } else {
          touchDiskEntry(entryKey);
        }

        if (!pending.completer.isCompleted) {
          pending.completer.complete(
            _WorkerFrameResult(
              entryKey: entryKey,
              frameIndex: frameIndex,
              bgraBytes: bgra,
              vectorRendered: vectorRendered,
              compressedHit: compressedHit,
              compressedBytes: compressedBytes,
              entryDiskBytes: entryDiskBytes > 0 ? entryDiskBytes : 0,
            ),
          );
        }
      case _repFrameError:
        final reqId = raw[1] as int;
        final pending = _pendingRequests.remove(reqId);
        if (pending == null || pending.completer.isCompleted) return;
        pending.completer.completeError(StateError(raw[2] as String));
      case _repSceneMissing:
        final reqId = raw[1] as int;
        final contentKey = raw[2] as String;
        final pending = _pendingRequests[reqId];
        if (pending == null) return;
        if (pending.retried) {
          _pendingRequests.remove(reqId);
          if (!pending.completer.isCompleted) {
            pending.completer.completeError(
              StateError('Missing worker scene for $contentKey'),
            );
          }
          return;
        }
        pending.retried = true;
        _registeredScenes[shard].add(contentKey);
        _handles[shard].send(<Object?>[
          _opRegisterScene,
          contentKey,
          isIsolatePoolSupported
              ? pending.composition._template
              : _Fork().scene(pending.composition._template),
        ]);
        _handles[shard].send(<Object?>[
          _opRenderFrame,
          pending.reqId,
          pending.entryKey,
          pending.contentKey,
          pending.frame,
          pending.frameIndex,
          pending.width,
          pending.height,
          pending.totalFrames,
          pending.poster,
        ]);
      case _repDeleted:
        final entryKey = raw[1] as String;
        final workerRam = raw[3] as int;
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
      _evictKeyOnShard(entryKey);
      return;
    }
    _diskLru[entryKey] = newSize;
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
      _evictKeyOnShard(victim);
    }
  }

  void _evictKeyOnShard(String entryKey) {
    _pendingDiskDeletes.add(entryKey);
    if (_started) {
      final shard = _shardForKey(entryKey, workerCount);
      _handles[shard].send(<Object?>[_opDeleteDisk, entryKey]);
    } else if (_diskDir != null && isDiskCacheSupported) {
      PlatformDiskFs.deleteFile(joinPath(_diskDir!, '$entryKey.flcache'));
      _pendingDiskDeletes.remove(entryKey);
    }
  }

  Future<_WorkerFrameResult?> renderFrame({
    required FastLottieComposition composition,
    required String entryKey,
    required double frame,
    required int frameIndex,
    required int width,
    required int height,
    required int totalFrames,
    required bool poster,
  }) {
    if (_disposed) return Future<_WorkerFrameResult?>.value(null);
    _ensureStarted();
    final shard = _shardForKey(entryKey, workerCount);
    final contentKey = composition.contentKey;
    if (_registeredScenes[shard].add(contentKey)) {
      _handles[shard].send(<Object?>[
        _opRegisterScene,
        contentKey,
        isIsolatePoolSupported
            ? composition._template
            : _Fork().scene(composition._template),
      ]);
    }
    final reqId = _nextReqId++;
    final completer = Completer<_WorkerFrameResult?>();
    _pendingRequests[reqId] = _PendingWorkerRequest(
      reqId: reqId,
      shard: shard,
      entryKey: entryKey,
      contentKey: contentKey,
      composition: composition,
      frame: frame,
      frameIndex: frameIndex,
      width: width,
      height: height,
      totalFrames: totalFrames,
      poster: poster,
      completer: completer,
    );
    _handles[shard].send(<Object?>[
      _opRenderFrame,
      reqId,
      entryKey,
      contentKey,
      frame,
      frameIndex,
      width,
      height,
      totalFrames,
      poster,
    ]);
    return completer.future;
  }

  void clearMemoryCaches() {
    if (!_started || _disposed) return;
    for (var i = 0; i < _handles.length; i++) {
      _handles[i].send(const <Object?>[_opClearMem]);
      _registeredScenes[i].clear();
      _workerRamBytes[i] = 0;
    }
    _compressedRamBytes = 0;
  }

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    for (final req in _pendingRequests.values) {
      if (!req.completer.isCompleted) req.completer.complete(null);
    }
    _pendingRequests.clear();
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
