import 'dart:async';
import 'dart:js_interop';

import 'package:fastlottie/src/isolate_stub.dart';
import 'package:fastlottie/src/raster_core.dart';
import 'package:fastlottie/src/raster_web_protocol.dart';
import 'package:fastlottie/src/simd_wasm.dart';
import 'package:web/web.dart' as web;

@JS('self')
external web.DedicatedWorkerGlobalScope get _scope;

void main() {
  final endpoint = _Endpoint();
  var ready = false;
  _scope.onmessage = ((web.MessageEvent event) async {
    try {
      final message = WorkerMessage(event.data);
      if (!ready) {
        if (message.op != workerInit || message.i(1) != webWorkerVersion) {
          throw const FormatException('Incompatible FastLottie worker host');
        }
        try {
          final response = await _scope.fetch(message.s(2).toJS).toDart;
          if (response.ok) {
            await initializeWasmKernels(
              (await response.arrayBuffer().toDart).toDart.asUint8List(),
            );
          }
        } catch (_) {
          // The worker can still rasterize in Dart without the C module.
        }
        softwareWorkerEntry(endpoint);
        ready = true;
        final (data, transfer) = encodeWorkerMessage([
          workerReady,
          webWorkerVersion,
          isSimdSupported,
        ]);
        _scope.postMessage(data, transfer);
      } else {
        endpoint.inbox.add(message.decodeRequest());
      }
    } catch (error) {
      final (data, transfer) = encodeWorkerMessage([workerFailed, '$error']);
      _scope.postMessage(data, transfer);
    }
  }).toJS;
}

final class _Endpoint implements WorkerEndpoint {
  final inbox = StreamController<Object?>();

  @override
  Stream<Object?> get messages => inbox.stream;

  @override
  void send(Object? reply) {
    final (message, transfer) = encodeReply(reply);
    _scope.postMessage(message, transfer);
  }

  @override
  void close() {
    unawaited(inbox.close());
    _scope.close();
  }
}
