import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:typed_data';

import 'worker_messages.dart';

const webWorkerAsset = 'packages/fastlottie/lib/src/wasm/fastlottie_worker.js';
// Reject cached worker assets that rasterize with the old fill algorithm.
const webWorkerVersion = 3;
const workerInit = -1;
const workerReady = -2;
const workerFailed = -3;

// The wire format carries only numbers, strings, and transferable byte buffers.
// The Dart records stay private to the scheduler and raster worker.
(JSArray<JSAny?>, JSArray<JSAny?>) encodeWorkerMessage(List<Object?> values) {
  final transfer = <JSAny?>[];
  final message = [
    for (final value in values)
      switch (value) {
        final Uint8List bytes => _transferBytes(bytes, transfer),
        final int n => n.toJS,
        final double n => n.toJS,
        final String s => s.toJS,
        final bool b => b.toJS,
        null => null,
        _ => throw ArgumentError('Unsupported raster worker field'),
      },
  ];
  return (message.toJS, transfer.toJS);
}

JSUint8Array _transferBytes(Uint8List bytes, List<JSAny?> transfer) {
  // Output is already a private copy of the raster heap. Scene registration
  // passes a private copy too, leaving the host free to replay it on eviction.
  final array = bytes.toJS;
  transfer.add(array.getProperty<JSArrayBuffer>('buffer'.toJS));
  return array;
}

(JSArray<JSAny?>, JSArray<JSAny?>) encodeRequest(Object? request) =>
    encodeWorkerMessage(switch (request) {
      (
        opConfigure,
        diskDirectory: final String? dir,
        maximumRamBytes: final int limit,
      ) =>
        [opConfigure, dir, limit],
      (
        opRegisterScene,
        contentKey: final String key,
        bytes: final Uint8List bytes,
        useSimd: final bool simd,
      ) =>
        [opRegisterScene, key, Uint8List.fromList(bytes), simd],
      (
        opRenderFrame,
        requestId: final int id,
        entryKey: final String entry,
        contentKey: final String scene,
        frame: final double frame,
        frameIndex: final int index,
        width: final int width,
        height: final int height,
        totalFrames: final int total,
        poster: final bool poster,
      ) =>
        [
          opRenderFrame,
          id,
          entry,
          scene,
          frame,
          index,
          width,
          height,
          total,
          poster,
        ],
      (
        opRenderStrip,
        requestId: final int id,
        entryKey: final String entry,
        contentKey: final String scene,
        stripStart: final int start,
        stripCount: final int count,
        startFrame: final double frame,
        frameStep: final double step,
        width: final int width,
        height: final int height,
        totalFrames: final int total,
        poster: final bool poster,
      ) =>
        [
          opRenderStrip,
          id,
          entry,
          scene,
          start,
          count,
          frame,
          step,
          width,
          height,
          total,
          poster,
        ],
      (opClearMem,) => [opClearMem],
      _ => throw ArgumentError('Unsupported raster worker request'),
    });

(JSArray<JSAny?>, JSArray<JSAny?>) encodeReply(
  Object? reply,
) => encodeWorkerMessage(switch (reply) {
  (
    repFrameReady,
    requestId: final int id,
    entryKey: final String entry,
    pixels: final Uint8List bytes,
    vectorRendered: final bool rendered,
    entryDiskBytes: final int disk,
    workerRamBytes: final int ram,
    renderMicros: final int renderMicros,
    kernelCalls: final int kernelCalls,
    geometryCopyBytes: final int geometryCopyBytes,
    transferBytes: final int transferBytes,
  ) =>
    [
      repFrameReady,
      id,
      entry,
      bytes,
      rendered,
      disk,
      ram,
      renderMicros,
      kernelCalls,
      geometryCopyBytes,
      transferBytes,
    ],
  (
    repStripReady,
    requestId: final int id,
    entryKey: final String entry,
    stripStart: final int start,
    stripCount: final int count,
    pixels: final Uint8List bytes,
    vectorCount: final int rendered,
    compressedCount: final int hits,
    entryDiskBytes: final int disk,
    workerRamBytes: final int ram,
    stripWidth: final int width,
    stripHeight: final int height,
    renderMicros: final int renderMicros,
    kernelCalls: final int kernelCalls,
    geometryCopyBytes: final int geometryCopyBytes,
    transferBytes: final int transferBytes,
  ) =>
    [
      repStripReady,
      id,
      entry,
      start,
      count,
      bytes,
      rendered,
      hits,
      disk,
      ram,
      width,
      height,
      renderMicros,
      kernelCalls,
      geometryCopyBytes,
      transferBytes,
    ],
  (repFrameError, requestId: final int id, message: final String error) => [
    repFrameError,
    id,
    error,
  ],
  (repSceneMissing, requestId: final int id, contentKey: final String key) => [
    repSceneMissing,
    id,
    key,
  ],
  (repDeleted, entryKey: final String entry, workerRamBytes: final int ram) => [
    repDeleted,
    entry,
    ram,
  ],
  _ => throw ArgumentError('Unsupported raster worker reply'),
});

final class WorkerMessage {
  WorkerMessage(JSAny? data) : _fields = (data as JSArray<JSAny?>).toDart;
  final List<JSAny?> _fields;
  int i(int index) => (_fields[index] as JSNumber).toDartInt;
  double d(int index) => (_fields[index] as JSNumber).toDartDouble;
  String s(int index) => (_fields[index] as JSString).toDart;
  bool b(int index) => (_fields[index] as JSBoolean).toDart;
  Uint8List bytes(int index) => (_fields[index] as JSUint8Array).toDart;
  int get op => i(0);

  Object decodeRequest() => switch (op) {
    opConfigure => (
      opConfigure,
      diskDirectory: _fields[1] == null ? null : s(1),
      maximumRamBytes: i(2),
    ),
    opRegisterScene => (
      opRegisterScene,
      contentKey: s(1),
      bytes: bytes(2),
      useSimd: b(3),
    ),
    opRenderFrame => (
      opRenderFrame,
      requestId: i(1),
      entryKey: s(2),
      contentKey: s(3),
      frame: d(4),
      frameIndex: i(5),
      width: i(6),
      height: i(7),
      totalFrames: i(8),
      poster: b(9),
    ),
    opRenderStrip => (
      opRenderStrip,
      requestId: i(1),
      entryKey: s(2),
      contentKey: s(3),
      stripStart: i(4),
      stripCount: i(5),
      startFrame: d(6),
      frameStep: d(7),
      width: i(8),
      height: i(9),
      totalFrames: i(10),
      poster: b(11),
    ),
    opClearMem => (opClearMem,),
    _ => throw const FormatException('Invalid raster worker request'),
  };

  Object decodeReply() => switch (op) {
    repFrameReady => (
      repFrameReady,
      requestId: i(1),
      entryKey: s(2),
      pixels: bytes(3),
      vectorRendered: b(4),
      entryDiskBytes: i(5),
      workerRamBytes: i(6),
      renderMicros: i(7),
      kernelCalls: i(8),
      geometryCopyBytes: i(9),
      transferBytes: i(10),
    ),
    repStripReady => (
      repStripReady,
      requestId: i(1),
      entryKey: s(2),
      stripStart: i(3),
      stripCount: i(4),
      pixels: bytes(5),
      vectorCount: i(6),
      compressedCount: i(7),
      entryDiskBytes: i(8),
      workerRamBytes: i(9),
      stripWidth: i(10),
      stripHeight: i(11),
      renderMicros: i(12),
      kernelCalls: i(13),
      geometryCopyBytes: i(14),
      transferBytes: i(15),
    ),
    repFrameError => (repFrameError, requestId: i(1), message: s(2)),
    repSceneMissing => (repSceneMissing, requestId: i(1), contentKey: s(2)),
    repDeleted => (repDeleted, entryKey: s(1), workerRamBytes: i(2)),
    _ => throw const FormatException('Invalid raster worker reply'),
  };
}
