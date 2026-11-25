import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import '../../decoding.dart';
import '../cache/bitstream_cache.dart';
import '../cache/lz4.dart';
import '../cache/tile_playback.dart';
import '../platform/geometry_kernel_stub.dart'
    if (dart.library.ffi) '../platform/geometry_kernel_io.dart'
    show nativeGeometryKernelCalls;
import '../platform/isolate_stub.dart'
    if (dart.library.isolate) '../platform/isolate_io.dart';
import '../platform/simd_stub.dart'
    if (dart.library.ffi) '../platform/simd_io.dart'
    if (dart.library.js_interop) '../platform/simd_wasm.dart';
import '../raster/raster_core.dart';
import '../scene/options.dart';
import 'worker_messages.dart';

// A scene is only needed while a vector miss is in flight or a clip is still
// warming frames. Twenty-four covers a full picker/chat viewport per shard
// without thrashing; a finished entry is dropped once every frame is cached.
const int maxWorkerScenes = 24;

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
  final telemetryClock = Stopwatch()..start();
  const defaultPixelCap = 256 * 256;
  const softPixelCap = 512 * 512;
  final pixels = NativePixelBuffer(defaultPixelCap);
  var smallPixelStreak = 0;

  (int, int, int) frameTelemetry(
    int startedMicros,
    ({int calls, int copiedBytes}) beforeNative,
    int beforeGeometryCalls,
  ) {
    final afterNative = readNativeKernelTelemetry();
    return (
      telemetryClock.elapsedMicroseconds - startedMicros,
      afterNative.calls -
          beforeNative.calls +
          nativeGeometryKernelCalls -
          beforeGeometryCalls,
      afterNative.copiedBytes - beforeNative.copiedBytes,
    );
  }

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
    final scene = scenes.remove(contentKey);
    if (scene == null) return;
    // Coverage entries keep compiled draws and masked layers alive after
    // the scene map drops them.
    ws.releaseScene(scene);
  }

  void register(String key, RasterScene scene) {
    final previous = scenes.remove(key);
    if (previous != null) ws.releaseScene(previous);
    failedScenes.remove(key);
    while (scenes.length >= maxWorkerScenes) {
      final oldest = scenes.remove(scenes.keys.first)!;
      ws.releaseScene(oldest);
    }
    scenes[key] = scene;
  }

  void reportMissing(int id, String key) {
    final error = failedScenes[key];
    endpoint.send(
      error == null
          ? (repSceneMissing, requestId: id, contentKey: key)
          : (repFrameError, requestId: id, message: error),
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
      case (
        opConfigure,
        diskDirectory: final String? diskDir,
        maximumRamBytes: final int ramLimit,
        deduplicateUploads: final bool deduplicateUploads,
      ):
        store.maximumRamBytes = ramLimit;
        store.computeFingerprints = deduplicateUploads;
        store.setDiskDirectory(diskDir);
      case (
        opRegisterScene,
        contentKey: final String contentKey,
        scene: final RasterScene scene,
      ):
        register(contentKey, scene);
      case (
        opRegisterScene,
        contentKey: final String contentKey,
        bytes: final Uint8List bytes,
        useSimd: final bool simd,
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
        requestId: final int reqId,
        entryKey: final String entryKey,
        contentKey: final String contentKey,
        frame: final double frame,
        frameIndex: final int frameIndex,
        width: final int width,
        height: final int height,
        totalFrames: final int totalFrames,
        poster: final bool poster,
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
              requestId: reqId,
              entryKey: entryKey,
              pixels: packed,
              vectorRendered: false,
              entryDiskBytes: -1,
              workerRamBytes: store.ramBytes,
              renderMicros: 0,
              kernelCalls: 0,
              geometryCopyBytes: 0,
              transferBytes: dstBytes.lengthInBytes,
              fpHi: store.lastFrameFpHi,
              fpLo: store.lastFrameFpLo,
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
          final startedMicros = telemetryClock.elapsedMicroseconds;
          final beforeNative = readNativeKernelTelemetry();
          final beforeGeometryCalls = nativeGeometryKernelCalls;
          renderSceneSoftware(scene, frame, pixels, width, height, ws);
          final telemetry = frameTelemetry(
            startedMicros,
            beforeNative,
            beforeGeometryCalls,
          );
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
            requestId: reqId,
            entryKey: entryKey,
            pixels: packed,
            vectorRendered: true,
            entryDiskBytes: stored.entryDiskBytes,
            workerRamBytes: store.ramBytes,
            renderMicros: telemetry.$1,
            kernelCalls: telemetry.$2,
            geometryCopyBytes: telemetry.$3,
            transferBytes: renderedBytes.lengthInBytes,
            fpHi: stored.fpHi,
            fpLo: stored.fpLo,
          ));
          recordPixelUse(pxCount);
          releaseSceneIfCached(contentKey, entryKey, totalFrames);
        } catch (error) {
          endpoint.send((
            repFrameError,
            requestId: reqId,
            message: error.toString(),
          ));
        }
      case (
        opRenderStrip,
        requestId: final int reqId,
        entryKey: final String entryKey,
        contentKey: final String contentKey,
        stripStart: final int stripStart,
        stripCount: final int stripCount,
        startFrame: final double startFrame,
        frameStep: final double frameStep,
        width: final int width,
        height: final int height,
        totalFrames: final int totalFrames,
        poster: final bool poster,
      ):
        try {
          playback
              .invalidate(); // This request overwrites the single-frame buffer.
          final padY = stripCount > 1 ? 1 : 0;
          final stripHeight = stripCount * height + (stripCount - 1) * padY;
          final pxCount = width * stripHeight;
          ensurePixels(pxCount);
          if (padY > 0) {
            // Every slot is fully written by tryReadFrame or renderSceneSoftware;
            // only clear the 1px transparent gutter rows between adjacent slots.
            for (var j = 1; j < stripCount; j++) {
              final padStart = (j * (height + padY) - 1) * width;
              pixels.typedList.fillRange(padStart, padStart + width, 0);
            }
          }

          final singleFramePx = width * height;
          var vectorRenderedCount = 0;
          var compressedHitCount = 0;
          var latestDiskBytes = -1;
          var renderMicros = 0;
          var kernelCalls = 0;
          var geometryCopyBytes = 0;
          var hasStripFp = store.computeFingerprints;
          var stripFpHi = 0x9E3779B9;
          var stripFpLo = 0x85EBCA6B;
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
              if (hasStripFp) {
                final slotHi = store.lastFrameFpHi;
                final slotLo = store.lastFrameFpLo;
                if (stripCount == 1) {
                  stripFpHi = slotHi;
                  stripFpLo = slotLo;
                } else if (slotHi == 0 && slotLo == 0) {
                  hasStripFp = false;
                } else {
                  (stripFpHi, stripFpLo) = BitstreamStore.mixStripFingerprint(
                    stripFpHi,
                    stripFpLo,
                    slotHi,
                    slotLo,
                  );
                }
              }
              continue;
            }

            scene ??= scenes.remove(contentKey);
            if (scene == null) {
              reportMissing(reqId, contentKey);
              return;
            }
            scenes[contentKey] = scene;

            final startedMicros = telemetryClock.elapsedMicroseconds;
            final beforeNative = readNativeKernelTelemetry();
            final beforeGeometryCalls = nativeGeometryKernelCalls;
            renderSceneSoftware(scene, scnFrame, slot, width, height, ws);
            final telemetry = frameTelemetry(
              startedMicros,
              beforeNative,
              beforeGeometryCalls,
            );
            renderMicros += telemetry.$1;
            kernelCalls += telemetry.$2;
            geometryCopyBytes += telemetry.$3;
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
            if (hasStripFp) {
              final slotHi = stored.fpHi;
              final slotLo = stored.fpLo;
              if (stripCount == 1) {
                stripFpHi = slotHi;
                stripFpLo = slotLo;
              } else if (slotHi == 0 && slotLo == 0) {
                hasStripFp = false;
              } else {
                (stripFpHi, stripFpLo) = BitstreamStore.mixStripFingerprint(
                  stripFpHi,
                  stripFpLo,
                  slotHi,
                  slotLo,
                );
              }
            }
          }

          final stripBytes = pixelBytes(pxCount);
          final packed = packBytesForIsolate(stripBytes);
          final int fpHi;
          final int fpLo;
          if (!hasStripFp) {
            fpHi = 0;
            fpLo = 0;
          } else if (stripCount == 1) {
            fpHi = stripFpHi;
            fpLo = stripFpLo;
          } else {
            (fpHi, fpLo) = BitstreamStore.finalizeStripFingerprint(
              stripFpHi,
              stripFpLo,
              stripCount,
            );
          }
          endpoint.send((
            repStripReady,
            requestId: reqId,
            entryKey: entryKey,
            stripStart: stripStart,
            stripCount: stripCount,
            pixels: packed,
            vectorCount: vectorRenderedCount,
            compressedCount: compressedHitCount,
            entryDiskBytes: latestDiskBytes,
            workerRamBytes: store.ramBytes,
            stripWidth: width,
            stripHeight: stripHeight,
            renderMicros: renderMicros,
            kernelCalls: kernelCalls,
            geometryCopyBytes: geometryCopyBytes,
            transferBytes: pxCount * 4,
            fpHi: fpHi,
            fpLo: fpLo,
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
          endpoint.send((
            repFrameError,
            requestId: reqId,
            message: error.toString(),
          ));
        }
      case (opDeleteDisk, entryKey: final String entryKey):
        store.deleteDiskEntry(entryKey);
        store.evictEntryRam(entryKey);
        endpoint.send((
          repDeleted,
          entryKey: entryKey,
          workerRamBytes: store.ramBytes,
        ));
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
        endpoint.send((
          repDeleted,
          entryKey: '',
          workerRamBytes: store.ramBytes,
        ));
    }
  });
}
