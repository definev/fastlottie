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

const _isWasm = bool.fromEnvironment('dart.tool.dart2wasm');

void _unpackU32ToU8(Uint32List src, int pxCount, Uint8List dst) {
  var i = 0;
  var bp = 0;
  final end4 = pxCount - 3;
  while (i < end4) {
    final v0 = src[i];
    dst[bp] = v0;
    dst[bp + 1] = v0 >>> 8;
    dst[bp + 2] = v0 >>> 16;
    dst[bp + 3] = v0 >>> 24;
    final v1 = src[i + 1];
    dst[bp + 4] = v1;
    dst[bp + 5] = v1 >>> 8;
    dst[bp + 6] = v1 >>> 16;
    dst[bp + 7] = v1 >>> 24;
    final v2 = src[i + 2];
    dst[bp + 8] = v2;
    dst[bp + 9] = v2 >>> 8;
    dst[bp + 10] = v2 >>> 16;
    dst[bp + 11] = v2 >>> 24;
    final v3 = src[i + 3];
    dst[bp + 12] = v3;
    dst[bp + 13] = v3 >>> 8;
    dst[bp + 14] = v3 >>> 16;
    dst[bp + 15] = v3 >>> 24;
    i += 4;
    bp += 16;
  }
  while (i < pxCount) {
    final v = src[i++];
    dst[bp] = v;
    dst[bp + 1] = v >>> 8;
    dst[bp + 2] = v >>> 16;
    dst[bp + 3] = v >>> 24;
    bp += 4;
  }
}

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
  // Reusable concrete WasmGC byte/pixel scratch buffers so dart2wasm avoids
  // cross-type Uint8List.sublistView(Uint32List) (6x-40x slower) and
  // NativePixelBuffer.slice Uint32List views (TFA polymorphism).
  var wasmFrameBytes = Uint8List(0);
  var wasmStripBytes = Uint8List(0);
  NativePixelBuffer? wasmSlotPixels;

  Uint8List ensureWasmFrameBytes(int byteCount) {
    if (wasmFrameBytes.length < byteCount) {
      var cap = math.max(defaultPixelCap * 4, wasmFrameBytes.length);
      while (cap < byteCount) {
        cap *= 2;
      }
      playback.invalidate();
      wasmFrameBytes = Uint8List(cap);
    }
    return wasmFrameBytes;
  }

  Uint8List ensureWasmStripBytes(int byteCount) {
    if (wasmStripBytes.length < byteCount) {
      var cap = math.max(defaultPixelCap * 4, wasmStripBytes.length);
      while (cap < byteCount) {
        cap *= 2;
      }
      wasmStripBytes = Uint8List(cap);
    }
    return wasmStripBytes;
  }

  NativePixelBuffer ensureWasmSlotPixels(int count) {
    var slot = wasmSlotPixels;
    if (slot == null) {
      return wasmSlotPixels = NativePixelBuffer(math.max(defaultPixelCap, count));
    }
    if (slot.typedList.length < count) {
      var cap = math.max(defaultPixelCap, slot.typedList.length);
      while (cap < count) {
        cap *= 2;
      }
      slot.reallocate(cap, 0);
    }
    return slot;
  }

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
    final oversizedPixels = pixels.typedList.length > softPixelCap;
    final oversizedWasm =
        _isWasm &&
        (wasmFrameBytes.length > softPixelCap * 4 ||
            wasmStripBytes.length > softPixelCap * 4 ||
            (wasmSlotPixels?.typedList.length ?? 0) > softPixelCap);
    if (!oversizedPixels && !oversizedWasm) {
      smallPixelStreak = 0;
      return;
    }
    if (pxCount <= defaultPixelCap) {
      if (++smallPixelStreak >= 16) {
        smallPixelStreak = 0;
        playback.invalidate();
        if (oversizedPixels) pixels.reallocate(defaultPixelCap, 0);
        if (_isWasm) {
          if (wasmFrameBytes.length > softPixelCap * 4) {
            wasmFrameBytes = Uint8List(defaultPixelCap * 4);
          }
          if (wasmStripBytes.length > softPixelCap * 4) {
            wasmStripBytes = Uint8List(defaultPixelCap * 4);
          }
          if ((wasmSlotPixels?.typedList.length ?? 0) > softPixelCap) {
            wasmSlotPixels!.reallocate(defaultPixelCap, 0);
          }
        }
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

  void renderStripJob({
    required int reqId,
    required String entryKey,
    required String contentKey,
    required int stripStart,
    required int stripCount,
    required double startFrame,
    required double frameStep,
    required int width,
    required int height,
    required int totalFrames,
    required bool poster,
    required int cancelSlot,
    required int cancelToken,
  }) {
    try {
      if (cancelSlot >= 0 && nativeCancelSlotLoad(cancelSlot) != cancelToken) {
        endpoint.send((
          repStripCancelled,
          requestId: reqId,
          workerRamBytes: store.ramBytes,
        ));
        return;
      }
      playback.invalidate(); // This request overwrites the single-frame buffer.
      final padY = stripCount > 1 ? 1 : 0;
      final stripHeight = stripCount * height + (stripCount - 1) * padY;
      final pxCount = width * stripHeight;
      final singleFramePx = width * height;
      final Uint8List? wasmStripOut;
      final Uint8List? wasmSlotByteBuf;
      if (_isWasm) {
        wasmStripOut = ensureWasmStripBytes(pxCount * 4);
        wasmSlotByteBuf = ensureWasmFrameBytes(singleFramePx * 4);
        if (padY > 0) {
          for (var j = 1; j < stripCount; j++) {
            final padByteStart = ((j * (height + padY) - 1) * width) << 2;
            wasmStripOut.fillRange(
              padByteStart,
              padByteStart + (width << 2),
              0,
            );
          }
        }
      } else {
        wasmStripOut = null;
        wasmSlotByteBuf = null;
        ensurePixels(pxCount);
        if (padY > 0) {
          for (var j = 1; j < stripCount; j++) {
            final padStart = (j * (height + padY) - 1) * width;
            pixels.typedList.fillRange(padStart, padStart + width, 0);
          }
        }
      }

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
        if (cancelSlot >= 0 &&
            nativeCancelSlotLoad(cancelSlot) != cancelToken) {
          endpoint.send((
            repStripCancelled,
            requestId: reqId,
            workerRamBytes: store.ramBytes,
          ));
          recordPixelUse(pxCount);
          return;
        }
        final srcIdx = resolveWorkerSourceIndex(
          stripStart + j,
          totalFrames,
          frameStep,
        );
        final scnFrame = startFrame + srcIdx;
        final slotY = j * (height + padY);
        final slotPxOffset = slotY * width;
        final NativePixelBuffer? slot = _isWasm
            ? null
            : pixels.slice(slotPxOffset, singleFramePx);
        final Uint8List slotDstBytes = _isWasm
            ? wasmSlotByteBuf!
            : Uint8List.sublistView(slot!.typedList);

        final cacheHit = store.tryReadFrame(
          entryKey: entryKey,
          width: width,
          height: height,
          totalFrames: totalFrames,
          poster: poster,
          frameIndex: srcIdx,
          dstBgra: slotDstBytes,
        );

        if (cacheHit) {
          if (_isWasm) {
            final byteOff = slotPxOffset << 2;
            wasmStripOut!.setRange(
              byteOff,
              byteOff + (singleFramePx << 2),
              slotDstBytes,
            );
          }
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

        final renderTarget = _isWasm
            ? ensureWasmSlotPixels(singleFramePx)
            : slot!;
        final startedMicros = telemetryClock.elapsedMicroseconds;
        final beforeNative = readNativeKernelTelemetry();
        final beforeGeometryCalls = nativeGeometryKernelCalls;
        renderSceneSoftware(scene, scnFrame, renderTarget, width, height, ws);
        final telemetry = frameTelemetry(
          startedMicros,
          beforeNative,
          beforeGeometryCalls,
        );
        renderMicros += telemetry.$1;
        kernelCalls += telemetry.$2;
        geometryCopyBytes += telemetry.$3;
        vectorRenderedCount++;

        final Uint8List renderedSlotBytes;
        if (_isWasm) {
          _unpackU32ToU8(renderTarget.typedList, singleFramePx, slotDstBytes);
          renderedSlotBytes = slotDstBytes;
        } else {
          renderedSlotBytes = Uint8List.sublistView(slot!.typedList);
        }
        final stored = store.storeFrame(
          entryKey: entryKey,
          width: width,
          height: height,
          totalFrames: totalFrames,
          poster: poster,
          frameIndex: srcIdx,
          srcBgra: renderedSlotBytes,
          scratch: lz4,
        );
        if (_isWasm) {
          final byteOff = slotPxOffset << 2;
          wasmStripOut!.setRange(
            byteOff,
            byteOff + (singleFramePx << 2),
            renderedSlotBytes,
          );
        }
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

      final Object packed;
      if (_isWasm) {
        final stripByteLen = pxCount << 2;
        packed = Uint8List(stripByteLen)
          ..setRange(0, stripByteLen, wasmStripOut!);
      } else {
        final stripBytes = pixelBytes(pxCount);
        packed = packBytesForIsolate(stripBytes);
      }
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
  }

  endpoint.messages.listen((Object? raw) {
    switch (raw) {
      case null:
        store.dispose();
        scenes.clear();
        ws.dispose();
        pixels.dispose();
        wasmSlotPixels?.dispose();
        wasmSlotPixels = null;
        endpoint.close();
        return;
      case (
        opConfigure,
        diskDirectory: final String? diskDir,
        maximumDiskBytes: final int diskLimit,
        maximumRamBytes: final int ramLimit,
        deduplicateUploads: final bool deduplicateUploads,
      ):
        store.maximumRamBytes = ramLimit;
        store.maximumDiskBytes = diskLimit;
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
          register(
            contentKey,
            RasterScene.compileBytes(
              decodeLottieBytes(bytes),
              FastLottieOptions(useSimd: simd),
            ),
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
          final frameByteLen = pxCount << 2;
          final Uint8List dstBytes;
          if (_isWasm) {
            dstBytes = ensureWasmFrameBytes(frameByteLen);
          } else {
            ensurePixels(pxCount);
            dstBytes = pixelBytes(pxCount);
          }

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
            final packed = _isWasm
                ? (Uint8List(frameByteLen)
                    ..setRange(0, frameByteLen, dstBytes))
                : packBytesForIsolate(dstBytes);
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
              transferBytes: frameByteLen,
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

          if (_isWasm) ensurePixels(pxCount);
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
          final Uint8List renderedBytes;
          if (_isWasm) {
            _unpackU32ToU8(pixels.typedList, pxCount, dstBytes);
            renderedBytes = dstBytes;
          } else {
            renderedBytes = pixelBytes(pxCount);
          }
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
          final packed = _isWasm
              ? (Uint8List(frameByteLen)
                  ..setRange(0, frameByteLen, renderedBytes))
              : packBytesForIsolate(renderedBytes);
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
            transferBytes: frameByteLen,
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
        renderStripJob(
          reqId: reqId,
          entryKey: entryKey,
          contentKey: contentKey,
          stripStart: stripStart,
          stripCount: stripCount,
          startFrame: startFrame,
          frameStep: frameStep,
          width: width,
          height: height,
          totalFrames: totalFrames,
          poster: poster,
          cancelSlot: -1,
          cancelToken: 0,
        );
      case (
        opRenderStripNative,
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
        cancelSlot: final int cancelSlot,
        cancelToken: final int cancelToken,
      ):
        renderStripJob(
          reqId: reqId,
          entryKey: entryKey,
          contentKey: contentKey,
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
        if (_isWasm) {
          wasmFrameBytes = Uint8List(0);
          wasmStripBytes = Uint8List(0);
          wasmSlotPixels?.dispose();
          wasmSlotPixels = null;
        }
        endpoint.send((
          repDeleted,
          entryKey: '',
          workerRamBytes: store.ramBytes,
        ));
    }
  });
}
