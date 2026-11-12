part of '../fastlottie.dart';

const int _opConfigure = 0;
const int _opRegisterScene = 1;
const int _opRenderFrame = 2;
const int _opDeleteDisk = 3;
const int _opClearMem = 4;
const int _opRenderStrip = 5;

const int _repFrameReady = 0;
const int _repFrameError = 1;
const int _repDeleted = 2;
const int _repSceneMissing = 3;
const int _repStripReady = 4;

const int _maxWorkerScenes = 64;

int _shardForKey(String entryKey, int shardCount) {
  if (shardCount <= 1) return 0;
  var h = 0x811c9dc5;
  for (var i = 0; i < entryKey.length; i++) {
    h ^= entryKey.codeUnitAt(i);
    h = (h * 0x01000193) & 0x7FFFFFFF;
  }
  return h % shardCount;
}

int _resolveWorkerSourceIndex(
  int sampleIdx,
  int totalFrames,
  double frameStep,
) {
  if (frameStep <= 0.0 || totalFrames <= 1) return 0;
  return math
      .min(sampleIdx * frameStep, totalFrames - 1.0)
      .floor()
      .clamp(0, totalFrames - 1);
}

void _softwareWorkerEntry(WorkerEndpoint endpoint) {
  final ws = _RasterWorkspace();
  final store = BitstreamStore();
  final lz4 = Lz4Scratch();
  final playback = TilePlaybackCursor();
  final scenes = <String, _Compiler>{};
  const defaultPixelCap = 256 * 256;
  const softPixelCap = 512 * 512;
  final pixels = NativePixelBuffer(defaultPixelCap);
  var smallPixelStreak = 0;

  Uint32List ensurePixels(int count) {
    if (pixels.typedList.length < count) {
      var cap = math.max(defaultPixelCap, pixels.typedList.length);
      while (cap < count) {
        cap *= 2;
      }
      smallPixelStreak = 0;
      playback.invalidate();
      pixels.reallocate(cap, 0);
    }
    return pixels.typedList;
  }

  void recordPixelUse(int pxCount) {
    if (pixels.typedList.length <= softPixelCap) {
      smallPixelStreak = 0;
      return;
    }
    if (pxCount <= defaultPixelCap) {
      if (++smallPixelStreak >= 16) {
        smallPixelStreak = 0;
        playback.invalidate();
        pixels.reallocate(defaultPixelCap, 0);
      }
    } else {
      smallPixelStreak = 0;
    }
  }

  endpoint.messages.listen((Object? raw) {
    switch (raw) {
      case null:
        store.dispose();
        scenes.clear();
        ws.dispose();
        pixels.dispose();
        endpoint.close();
        return;
      case (_opConfigure, final String? diskDir, final int ramLimit):
        store.maximumRamBytes = ramLimit;
        store.setDiskDirectory(diskDir);
      case (_opRegisterScene, final String contentKey, final _Compiler scene):
        scenes.remove(contentKey);
        while (scenes.length >= _maxWorkerScenes) {
          scenes.remove(scenes.keys.first);
          ws.resetCaches();
        }
        scenes[contentKey] = scene;
      case (
        _opRenderFrame,
        final int reqId,
        final String entryKey,
        final String contentKey,
        final double frame,
        final int frameIndex,
        final int width,
        final int height,
        final int totalFrames,
        final bool poster,
      ):
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
            cursor: playback,
          );

          if (cacheHit) {
            final packed = packBytesForIsolate(dstBytes);
            endpoint.send((
              _repFrameReady,
              reqId,
              entryKey,
              packed,
              false, // vectorRendered
              -1, // unchanged diskBytes
              store.ramBytes,
            ));
            recordPixelUse(pxCount);
            if (!poster) {
              store.preparePlaybackPage(
                entryKey: entryKey,
                width: width,
                height: height,
                totalFrames: totalFrames,
                frameIndex: frameIndex,
              );
            }
            return;
          }

          final scene = scenes.remove(contentKey);
          if (scene == null) {
            endpoint.send((_repSceneMissing, reqId, contentKey));
            return;
          }
          scenes[contentKey] = scene;

          _renderSceneSoftware(scene, frame, px, width, height, ws, pixels);
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
          endpoint.send((
            _repFrameReady,
            reqId,
            entryKey,
            packed,
            true, // vectorRendered
            stored.entryDiskBytes,
            store.ramBytes,
          ));
          recordPixelUse(pxCount);
        } catch (error) {
          endpoint.send((_repFrameError, reqId, error.toString()));
        }
      case (
        _opRenderStrip,
        final int reqId,
        final String entryKey,
        final String contentKey,
        final int stripStart,
        final int stripCount,
        final double startFrame,
        final double frameStep,
        final int width,
        final int height,
        final int totalFrames,
        final bool poster,
      ):
        try {
          playback
              .invalidate(); // This request overwrites the single-frame buffer.
          final padY = stripCount > 1 ? 1 : 0;
          final stripHeight = stripCount * height + (stripCount - 1) * padY;
          final pxCount = width * stripHeight;
          final byteLen = pxCount * 4;
          final px = ensurePixels(pxCount);
          if (padY > 0) {
            px.fillRange(0, pxCount, 0);
          }
          final dstBytes = px.buffer.asUint8List(0, byteLen);

          final singleFramePx = width * height;
          final singleFrameByteLen = singleFramePx * 4;
          var vectorRenderedCount = 0;
          var compressedHitCount = 0;
          var latestDiskBytes = -1;
          int? warmPage;

          _Compiler? scene;

          for (var j = 0; j < stripCount; j++) {
            final srcIdx = _resolveWorkerSourceIndex(
              stripStart + j,
              totalFrames,
              frameStep,
            );
            final scnFrame = startFrame + srcIdx;
            final slotY = j * (height + padY);
            final slotPxOffset = slotY * width;
            final slotByteOffset = slotPxOffset * 4;

            final slotBytes = Uint8List.sublistView(
              dstBytes,
              slotByteOffset,
              slotByteOffset + singleFrameByteLen,
            );

            final cacheHit = store.tryReadFrame(
              entryKey: entryKey,
              width: width,
              height: height,
              totalFrames: totalFrames,
              poster: poster,
              frameIndex: srcIdx,
              dstBgra: slotBytes,
            );

            if (cacheHit) {
              compressedHitCount++;
              warmPage ??= srcIdx;
              continue;
            }

            scene ??= scenes.remove(contentKey);
            if (scene == null) {
              endpoint.send((_repSceneMissing, reqId, contentKey));
              return;
            }
            scenes[contentKey] = scene;

            final slot = pixels.slice(slotPxOffset, singleFramePx);
            _renderSceneSoftware(
              scene,
              scnFrame,
              slot.typedList,
              width,
              height,
              ws,
              slot,
            );
            vectorRenderedCount++;

            final stored = store.storeFrame(
              entryKey: entryKey,
              width: width,
              height: height,
              totalFrames: totalFrames,
              poster: poster,
              frameIndex: srcIdx,
              srcBgra: slotBytes,
              scratch: lz4,
            );
            if (stored.entryDiskBytes > 0) {
              latestDiskBytes = stored.entryDiskBytes;
            }
          }

          final packed = packBytesForIsolate(dstBytes);
          endpoint.send((
            _repStripReady,
            reqId,
            entryKey,
            stripStart,
            stripCount,
            packed,
            vectorRenderedCount,
            compressedHitCount,
            latestDiskBytes,
            store.ramBytes,
            width,
            stripHeight,
          ));
          recordPixelUse(pxCount);
          if (!poster && warmPage != null) {
            store.preparePlaybackPage(
              entryKey: entryKey,
              width: width,
              height: height,
              totalFrames: totalFrames,
              frameIndex: warmPage,
            );
          }
        } catch (error) {
          endpoint.send((_repFrameError, reqId, error.toString()));
        }
      case (_opDeleteDisk, final String entryKey):
        store.deleteDiskEntry(entryKey);
        store.evictEntryRam(entryKey);
        endpoint.send((_repDeleted, entryKey, store.ramBytes));
      case (_opClearMem,):
        playback.invalidate();
        store.clearRam();
        store.closeOpenFiles();
        store.shrinkScratch();
        scenes.clear();
        ws.resetCaches();
        ws.trimScratch(aggressive: true);
        lz4.shrinkScratch();
        smallPixelStreak = 0;
        if (pixels.typedList.length > defaultPixelCap) {
          pixels.reallocate(defaultPixelCap, 0);
        }
        endpoint.send((_repDeleted, '', store.ramBytes));
    }
  });
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
    if (scenes.length >= _maxWorkerScenes) scenes.remove(scenes.first);
    scenes.add(contentKey);
    return known;
  }

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
      handle.send((_opConfigure, effectiveDiskDir, perWorkerRam));
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
      final perWorkerRam = workerCount <= 0
          ? maximumCompressedMemoryBytes
          : maximumCompressedMemoryBytes ~/ workerCount;
      for (final h in _handles) {
        h.send((_opConfigure, effective, perWorkerRam));
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
        _repFrameReady,
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
        _repStripReady,
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
      case (_repFrameError, final int reqId, final String message):
        final pending = _pendingRequests.remove(reqId);
        if (pending == null) return;
        listener.onStripError(pending.entry, StateError(message));
      case (_repSceneMissing, final int reqId, final String contentKey):
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
        _rememberScene(shard, contentKey);
        _handles[shard].send((
          _opRegisterScene,
          contentKey,
          isIsolatePoolSupported
              ? pending.composition._template
              : _Fork().scene(pending.composition._template),
        ));
        if (pending.stripCount > 1) {
          _handles[shard].send((
            _opRenderStrip,
            pending.reqId,
            pending.entryKey,
            pending.contentKey,
            pending.stripStart,
            pending.stripCount,
            pending.startFrame,
            pending.frameStep,
            pending.width,
            pending.height,
            pending.totalFrames,
            pending.poster,
          ));
        } else {
          final srcIdx = _resolveWorkerSourceIndex(
            pending.stripStart,
            pending.totalFrames,
            pending.frameStep,
          );
          _handles[shard].send((
            _opRenderFrame,
            pending.reqId,
            pending.entryKey,
            pending.contentKey,
            pending.startFrame + srcIdx,
            srcIdx,
            pending.width,
            pending.height,
            pending.totalFrames,
            pending.poster,
          ));
        }
      case (_repDeleted, final String entryKey, final int workerRam):
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
      final shard = _shardForKey(entryKey, workerCount);
      _handles[shard].send((_opDeleteDisk, entryKey));
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
    _ensureStarted();
    final shard = _shardForKey(entryKey, workerCount);
    final contentKey = composition.contentKey;
    if (!_rememberScene(shard, contentKey)) {
      _handles[shard].send((
        _opRegisterScene,
        contentKey,
        isIsolatePoolSupported
            ? composition._template
            : _Fork().scene(composition._template),
      ));
    }
    final reqId = _nextReqId++;
    debugDispatchCount++;
    _pendingRequests[reqId] = _PendingWorkerRequest(
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
    if (stripCount > 1) {
      _handles[shard].send((
        _opRenderStrip,
        reqId,
        entryKey,
        contentKey,
        stripStart,
        stripCount,
        startFrame,
        frameStep,
        width,
        height,
        totalFrames,
        poster,
      ));
    } else {
      final srcIdx = _resolveWorkerSourceIndex(
        stripStart,
        totalFrames,
        frameStep,
      );
      _handles[shard].send((
        _opRenderFrame,
        reqId,
        entryKey,
        contentKey,
        startFrame + srcIdx,
        srcIdx,
        width,
        height,
        totalFrames,
        poster,
      ));
    }
  }

  void clearMemoryCaches() {
    if (!_started || _disposed) return;
    for (var i = 0; i < _handles.length; i++) {
      _handles[i].send(const (_opClearMem,));
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
