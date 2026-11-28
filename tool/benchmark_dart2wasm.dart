// ignore_for_file: avoid_print
// Realistic Dart WasmGC (dart2wasm) benchmark entry point.
// Compiled via `dart compile wasm tool/benchmark_dart2wasm.dart` and driven by
// `tool/benchmark_web_targets.mjs` in Node (v26+ or --experimental-wasm-exnref).
//
// Deliberately links scene snapshots, RasterWorkspace, NativePixelBuffer,
// BitstreamStore, Lz4Codec, TilePlaybackPage, and MergePaths so TFA sees the
// same typed-data class hierarchy as a real Flutter Web Wasm application.
import 'dart:convert';
import 'dart:js_interop';
import 'dart:typed_data';

import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/cache/tile_playback.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/platform/simd_wasm.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/scene/options.dart';

const bool _isWasm = bool.fromEnvironment('dart.tool.dart2wasm');

@JS('globalThis._benchPayload')
external JSString get _benchPayload;

int _fnv32U32(Uint32List data, int len) {
  var h = 0x811C9DC5;
  for (var i = 0; i < len; i++) {
    h = ((h ^ data[i]) * 0x01000193) & 0xFFFFFFFF;
  }
  return h;
}

int _fnv32Bytes(Uint8List bytes, int len) {
  var h = 0x811C9DC5;
  for (var i = 0; i < len; i += 4) {
    final v =
        bytes[i] |
        (bytes[i + 1] << 8) |
        (bytes[i + 2] << 16) |
        (bytes[i + 3] << 24);
    h = ((h ^ v) * 0x01000193) & 0xFFFFFFFF;
  }
  return h;
}

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

void main() {
  final payload = jsonDecode(_benchPayload.toDart) as Map<String, dynamic>;
  final fixtures = (payload['fixtures'] as List<dynamic>)
      .cast<Map<String, dynamic>>();
  final width = payload['width'] as int;
  final height = payload['height'] as int;
  final frames = payload['frames'] as int;
  final rounds = payload['rounds'] as int;
  final cacheIters = payload['cacheIters'] as int;

  final pxCount = width * height;
  final byteCount = pxCount * 4;
  final ws = RasterWorkspace(initialHeight: height, preferNative: false);
  final pixels = NativePixelBuffer(pxCount);
  final monoBytes = Uint8List(byteCount);
  final store = BitstreamStore(maximumRamBytes: 16 * 1024 * 1024);
  final lz4 = Lz4Scratch();
  final cursor = TilePlaybackCursor();

  // Keep NativePixelBuffer.slice reachable so TFA mirrors a real app.
  final activeBuf = pixels.slice(0, pxCount);

  final results = <Map<String, Object>>[];
  for (final fx in fixtures) {
    final name = fx['name'] as String;
    final jsonStr = fx['json'] as String;
    final jsonBytes = Uint8List.fromList(utf8.encode(jsonStr));
    final compiled = RasterScene.compileBytes(
      jsonBytes,
      const FastLottieOptions(),
    );
    // Exercise snapshot encode + restore just like Flutter app startup.
    final snap = compiled.snapshot(compiled.contentKey, jsonBytes.length);
    final scene = RasterScene.restoreSnapshot(snap, warm: true).scene;

    final span = (scene.end - scene.start).round();
    final frameCount = span > 0 ? (span < frames ? span : frames) : 1;

    // Warmup 1 pass.
    for (var f = 0; f < frameCount; f++) {
      renderSceneSoftware(scene, scene.start + f, activeBuf, width, height, ws);
    }

    // Capture reference frame checksums (frame 0 and last sampled frame).
    renderSceneSoftware(scene, scene.start, activeBuf, width, height, ws);
    final hash0 = _fnv32U32(activeBuf.typedList, pxCount);
    final lastFrame = scene.start + (frameCount - 1);
    renderSceneSoftware(scene, lastFrame, activeBuf, width, height, ws);
    final hashLast = _fnv32U32(activeBuf.typedList, pxCount);

    // 1. Pure vector rasterization benchmark.
    final swRender = Stopwatch()..start();
    for (var r = 0; r < rounds; r++) {
      for (var f = 0; f < frameCount; f++) {
        renderSceneSoftware(
          scene,
          scene.start + f,
          activeBuf,
          width,
          height,
          ws,
        );
      }
    }
    swRender.stop();
    final renderTotal = rounds * frameCount;

    // 2. Cache store (unpack + LZ4 compress + CRC31 + fingerprint) and
    //    cache hit (LZ4 decompress + CRC31) benchmark using the exact
    //    monomorphic worker byte path.
    renderSceneSoftware(scene, lastFrame, activeBuf, width, height, ws);
    _unpackU32ToU8(activeBuf.typedList, pxCount, monoBytes);

    // Warm cache + verify TilePlaybackPage links into TFA.
    for (var f = 0; f < 4; f++) {
      store.storeFrame(
        entryKey: 'tp_$name',
        width: width,
        height: height,
        totalFrames: 4,
        poster: false,
        frameIndex: f,
        srcBgra: monoBytes,
        scratch: lz4,
      );
    }
    store.preparePlaybackPage(
      entryKey: 'tp_$name',
      width: width,
      height: height,
      totalFrames: 4,
      frameIndex: 0,
    );
    store.tryReadFrame(
      entryKey: 'tp_$name',
      width: width,
      height: height,
      totalFrames: 4,
      poster: false,
      frameIndex: 0,
      dstBgra: monoBytes,
      cursor: cursor,
    );
    store.evictEntryRam('tp_$name');

    // Measure storeFrame (including Uint32 -> Uint8 unpack).
    var compressedBytes = 0;
    final swStore = Stopwatch()..start();
    for (var i = 0; i < cacheIters; i++) {
      _unpackU32ToU8(activeBuf.typedList, pxCount, monoBytes);
      final stored = store.storeFrame(
        entryKey: 'c_$name',
        width: width,
        height: height,
        totalFrames: 4,
        poster: false,
        frameIndex: 0,
        srcBgra: monoBytes,
        scratch: lz4,
      );
      compressedBytes = stored.compressedBytes;
    }
    swStore.stop();

    // Measure tryReadFrame (LZ4 RAM cache hit).
    final swRead = Stopwatch()..start();
    for (var i = 0; i < cacheIters; i++) {
      final ok = store.tryReadFrame(
        entryKey: 'c_$name',
        width: width,
        height: height,
        totalFrames: 4,
        poster: false,
        frameIndex: 0,
        dstBgra: monoBytes,
      );
      if (!ok) throw StateError('Cache hit missed on $name');
    }
    swRead.stop();

    final decodedHash = _fnv32Bytes(monoBytes, byteCount);
    if (decodedHash != hashLast) {
      throw StateError(
        'Cache roundtrip hash mismatch on $name: '
        '0x${decodedHash.toRadixString(16)} != 0x${hashLast.toRadixString(16)}',
      );
    }
    store.evictEntryRam('c_$name');

    results.add({
      'name': name,
      'frames': frameCount,
      'renderUsPerFrame': swRender.elapsedMicroseconds / renderTotal,
      'storeUsPerFrame': swStore.elapsedMicroseconds / cacheIters,
      'readUsPerFrame': swRead.elapsedMicroseconds / cacheIters,
      'compressedBytes': compressedBytes,
      'hash0': hash0.toRadixString(16).padLeft(8, '0'),
      'hashLast': hashLast.toRadixString(16).padLeft(8, '0'),
      'contentKey': scene.contentKey,
    });
  }

  print(
    jsonEncode({
      'runtime': 'dart2wasm',
      'isWasm': _isWasm,
      'isSimd': isSimdSupported,
      'results': results,
    }),
  );
}
