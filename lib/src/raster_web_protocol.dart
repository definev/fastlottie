import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:typed_data';

import 'raster_core.dart';

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
      (opConfigure, final String? dir, final int limit) => [
        opConfigure,
        dir,
        limit,
      ],
      (
        opRegisterScene,
        final String key,
        final Uint8List bytes,
        final bool simd,
      ) =>
        [opRegisterScene, key, Uint8List.fromList(bytes), simd],
      (
        opRenderFrame,
        final int id,
        final String entry,
        final String scene,
        final double frame,
        final int index,
        final int width,
        final int height,
        final int total,
        final bool poster,
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
        final int id,
        final String entry,
        final String scene,
        final int start,
        final int count,
        final double frame,
        final double step,
        final int width,
        final int height,
        final int total,
        final bool poster,
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

(JSArray<JSAny?>, JSArray<JSAny?>) encodeReply(Object? reply) =>
    encodeWorkerMessage(switch (reply) {
      (
        repFrameReady,
        final int id,
        final String entry,
        final Uint8List bytes,
        final bool rendered,
        final int disk,
        final int ram,
        final int renderMicros,
        final int kernelCalls,
        final int geometryCopyBytes,
        final int transferBytes,
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
        final int id,
        final String entry,
        final int start,
        final int count,
        final Uint8List bytes,
        final int rendered,
        final int hits,
        final int disk,
        final int ram,
        final int width,
        final int height,
        final int renderMicros,
        final int kernelCalls,
        final int geometryCopyBytes,
        final int transferBytes,
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
      (repFrameError, final int id, final String error) => [
        repFrameError,
        id,
        error,
      ],
      (repSceneMissing, final int id, final String key) => [
        repSceneMissing,
        id,
        key,
      ],
      (repDeleted, final String entry, final int ram) => [
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
    opConfigure => (opConfigure, _fields[1] == null ? null : s(1), i(2)),
    opRegisterScene => (opRegisterScene, s(1), bytes(2), b(3)),
    opRenderFrame => (
      opRenderFrame,
      i(1),
      s(2),
      s(3),
      d(4),
      i(5),
      i(6),
      i(7),
      i(8),
      b(9),
    ),
    opRenderStrip => (
      opRenderStrip,
      i(1),
      s(2),
      s(3),
      i(4),
      i(5),
      d(6),
      d(7),
      i(8),
      i(9),
      i(10),
      b(11),
    ),
    opClearMem => (opClearMem,),
    _ => throw const FormatException('Invalid raster worker request'),
  };

  Object decodeReply() => switch (op) {
    repFrameReady => (
      repFrameReady,
      i(1),
      s(2),
      bytes(3),
      b(4),
      i(5),
      i(6),
      i(7),
      i(8),
      i(9),
      i(10),
    ),
    repStripReady => (
      repStripReady,
      i(1),
      s(2),
      i(3),
      i(4),
      bytes(5),
      i(6),
      i(7),
      i(8),
      i(9),
      i(10),
      i(11),
      i(12),
      i(13),
      i(14),
      i(15),
    ),
    repFrameError => (repFrameError, i(1), s(2)),
    repSceneMissing => (repSceneMissing, i(1), s(2)),
    repDeleted => (repDeleted, s(1), i(2)),
    _ => throw const FormatException('Invalid raster worker reply'),
  };
}
