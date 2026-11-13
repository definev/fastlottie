part of 'raster_core.dart';

const int opConfigure = 0;
const int opRegisterScene = 1;
const int opRenderFrame = 2;
const int opDeleteDisk = 3;
const int opClearMem = 4;
const int opRenderStrip = 5;

const int repFrameReady = 0;
const int repFrameError = 1;
const int repDeleted = 2;
const int repSceneMissing = 3;
const int repStripReady = 4;

// A scene is only needed while a vector miss is in flight. Eight covers the
// jobs one worker can overlap; a finished entry is dropped once every frame
// is in the compressed cache.
const int maxWorkerScenes = 8;

int resolveWorkerSourceIndex(int sampleIdx, int totalFrames, double frameStep) {
  if (frameStep <= 0.0 || totalFrames <= 1) return 0;
  return math
      .min(sampleIdx * frameStep, totalFrames - 1.0)
      .floor()
      .clamp(0, totalFrames - 1);
}

void softwareWorkerEntry(WorkerEndpoint endpoint) {
  final ws = RasterWorkspace();
  final failedScenes = <String, String>{};
  final store = BitstreamStore();
  final lz4 = Lz4Scratch();
  final playback = TilePlaybackCursor();
  final scenes = <String, RasterScene>{};
  const defaultPixelCap = 256 * 256;
  const softPixelCap = 512 * 512;
  final pixels = NativePixelBuffer(defaultPixelCap);
  var smallPixelStreak = 0;

  void ensurePixels(int count) {
    if (pixels.typedList.length < count) {
      var cap = math.max(defaultPixelCap, pixels.typedList.length);
      while (cap < count) {
        cap *= 2;
      }
      smallPixelStreak = 0;
      playback.invalidate();
      pixels.reallocate(cap, 0);
    }
  }

  Uint8List pixelBytes(int count) =>
      Uint8List.sublistView(pixels.typedList, 0, count);

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

  void releaseSceneIfCached(
    String contentKey,
    String entryKey,
    int totalFrames,
  ) {
    if (!store.hasAllFrames(entryKey, totalFrames)) return;
    if (scenes.remove(contentKey) == null) return;
    // Coverage entries keep compiled draws and masked layers alive after
    // the scene map drops them.
    ws.resetCaches();
  }

  void register(String key, RasterScene scene) {
    scenes.remove(key);
    failedScenes.remove(key);
    while (scenes.length >= maxWorkerScenes) {
      scenes.remove(scenes.keys.first);
      ws.resetCaches();
    }
    scenes[key] = scene;
  }

  void reportMissing(int id, String key) {
    final error = failedScenes[key];
    endpoint.send(
      error == null ? (repSceneMissing, id, key) : (repFrameError, id, error),
    );
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
      case (opConfigure, final String? diskDir, final int ramLimit):
        store.maximumRamBytes = ramLimit;
        store.setDiskDirectory(diskDir);
      case (opRegisterScene, final String contentKey, final RasterScene scene):
        register(contentKey, scene);
      case (
        opRegisterScene,
        final String contentKey,
        final Uint8List bytes,
        final bool simd,
      ):
        try {
          final document = jsonDecode(
            utf8.decode(decodeLottieBytes(bytes)),
          ) as Map<String, dynamic>;
          register(
            contentKey,
            RasterScene.compile(document, FastLottieOptions(useSimd: simd)),
          );
        } catch (error) {
          if (failedScenes.length >= maxWorkerScenes) {
            failedScenes.remove(failedScenes.keys.first);
          }
          failedScenes[contentKey] = error.toString();
        }
      case (
        opRenderFrame,
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
          ensurePixels(pxCount);
          final dstBytes = pixelBytes(pxCount);

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
            releaseSceneIfCached(contentKey, entryKey, totalFrames);
            final packed = packBytesForIsolate(dstBytes);
            endpoint.send((
              repFrameReady,
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
            reportMissing(reqId, contentKey);
            return;
          }
          scenes[contentKey] = scene;

          playback.invalidate();
          renderSceneSoftware(scene, frame, pixels, width, height, ws);
          final renderedBytes = pixelBytes(pxCount);
          final stored = store.storeFrame(
            entryKey: entryKey,
            width: width,
            height: height,
            totalFrames: totalFrames,
            poster: poster,
            frameIndex: frameIndex,
            srcBgra: renderedBytes,
            scratch: lz4,
          );
          final packed = packBytesForIsolate(renderedBytes);
          endpoint.send((
            repFrameReady,
            reqId,
            entryKey,
            packed,
            true, // vectorRendered
            stored.entryDiskBytes,
            store.ramBytes,
          ));
          recordPixelUse(pxCount);
          releaseSceneIfCached(contentKey, entryKey, totalFrames);
        } catch (error) {
          endpoint.send((repFrameError, reqId, error.toString()));
        }
      case (
        opRenderStrip,
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
          ensurePixels(pxCount);
          if (padY > 0) {
            pixels.typedList.fillRange(0, pxCount, 0);
          }

          final singleFramePx = width * height;
          var vectorRenderedCount = 0;
          var compressedHitCount = 0;
          var latestDiskBytes = -1;
          int? warmPage;

          RasterScene? scene;

          for (var j = 0; j < stripCount; j++) {
            final srcIdx = resolveWorkerSourceIndex(
              stripStart + j,
              totalFrames,
              frameStep,
            );
            final scnFrame = startFrame + srcIdx;
            final slotY = j * (height + padY);
            final slotPxOffset = slotY * width;
            final slot = pixels.slice(slotPxOffset, singleFramePx);

            final cacheHit = store.tryReadFrame(
              entryKey: entryKey,
              width: width,
              height: height,
              totalFrames: totalFrames,
              poster: poster,
              frameIndex: srcIdx,
              dstBgra: Uint8List.sublistView(slot.typedList),
            );

            if (cacheHit) {
              compressedHitCount++;
              warmPage ??= srcIdx;
              continue;
            }

            scene ??= scenes.remove(contentKey);
            if (scene == null) {
              reportMissing(reqId, contentKey);
              return;
            }
            scenes[contentKey] = scene;

            renderSceneSoftware(scene, scnFrame, slot, width, height, ws);
            vectorRenderedCount++;

            final stored = store.storeFrame(
              entryKey: entryKey,
              width: width,
              height: height,
              totalFrames: totalFrames,
              poster: poster,
              frameIndex: srcIdx,
              srcBgra: Uint8List.sublistView(slot.typedList),
              scratch: lz4,
            );
            if (stored.entryDiskBytes > 0) {
              latestDiskBytes = stored.entryDiskBytes;
            }
          }

          final packed = packBytesForIsolate(pixelBytes(pxCount));
          endpoint.send((
            repStripReady,
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
          releaseSceneIfCached(contentKey, entryKey, totalFrames);
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
          endpoint.send((repFrameError, reqId, error.toString()));
        }
      case (opDeleteDisk, final String entryKey):
        store.deleteDiskEntry(entryKey);
        store.evictEntryRam(entryKey);
        endpoint.send((repDeleted, entryKey, store.ramBytes));
      case (opClearMem,):
        playback.invalidate();
        store.clearRam();
        store.closeOpenFiles();
        store.shrinkScratch();
        scenes.clear();
        failedScenes.clear();
        ws.resetCaches();
        ws.trimScratch(aggressive: true);
        lz4.shrinkScratch();
        smallPixelStreak = 0;
        if (pixels.typedList.length > defaultPixelCap) {
          pixels.reallocate(defaultPixelCap, 0);
        }
        endpoint.send((repDeleted, '', store.ramBytes));
    }
  });
}
