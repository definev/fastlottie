import 'dart:async';
import 'dart:isolate';
import 'dart:typed_data';

bool get isIsolatePoolSupported => true;

Object packBytesForIsolate(Uint8List bytes) =>
    TransferableTypedData.fromList([bytes]);

Uint8List unpackBytesFromIsolate(Object payload) {
  if (payload is TransferableTypedData) {
    return payload.materialize().asUint8List();
  }
  return payload as Uint8List;
}

abstract interface class WorkerEndpoint {
  void send(Object? message);
  Stream<Object?> get messages;
  void close();
}

abstract interface class WorkerHandle {
  Stream<Object?> get messages;
  void send(Object? message);
  void dispose();
}

final class _IoWorkerEndpoint implements WorkerEndpoint {
  _IoWorkerEndpoint(this._receive, this._replyPort);

  final ReceivePort _receive;
  final SendPort _replyPort;

  @override
  void send(Object? message) => _replyPort.send(message);

  @override
  Stream<Object?> get messages => _receive;

  @override
  void close() => _receive.close();
}

final class _IoBootstrapArgs {
  const _IoBootstrapArgs(this.hostPort, this.entry);
  final SendPort hostPort;
  final void Function(WorkerEndpoint) entry;
}

void _ioWorkerBootstrap(_IoBootstrapArgs args) {
  final receive = ReceivePort();
  args.hostPort.send(receive.sendPort);
  args.entry(_IoWorkerEndpoint(receive, args.hostPort));
}

final class _IoWorkerHandle implements WorkerHandle {
  _IoWorkerHandle(
    void Function(WorkerEndpoint) entry, {
    String debugName = 'fastlottie.worker',
  }) {
    final hostReceive = ReceivePort();
    _hostReceive = hostReceive;
    _hostSub = hostReceive.listen((msg) {
      if (_disposed) return;
      if (_workerSendPort == null && msg is SendPort) {
        _workerSendPort = msg;
        for (final queued in _pendingPreHandshake) {
          msg.send(queued);
        }
        _pendingPreHandshake.clear();
        return;
      }
      _messagesController.add(msg);
    });
    Isolate.spawn(
          _ioWorkerBootstrap,
          _IoBootstrapArgs(hostReceive.sendPort, entry),
          debugName: debugName,
        )
        .then((isolate) {
          if (_disposed) {
            isolate.kill(priority: Isolate.immediate);
          } else {
            _isolate = isolate;
          }
        })
        .catchError((Object error, StackTrace stack) {
          if (!_disposed && !_messagesController.isClosed) {
            _messagesController.addError(error, stack);
          }
        });
  }

  late final ReceivePort _hostReceive;
  late final StreamSubscription<Object?> _hostSub;
  final _messagesController = StreamController<Object?>();
  final _pendingPreHandshake = <Object?>[];
  SendPort? _workerSendPort;
  Isolate? _isolate;
  bool _disposed = false;

  @override
  void send(Object? message) {
    if (_disposed) return;
    final port = _workerSendPort;
    if (port != null) {
      port.send(message);
    } else {
      _pendingPreHandshake.add(message);
    }
  }

  @override
  Stream<Object?> get messages => _messagesController.stream;

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _pendingPreHandshake.clear();
    try {
      _workerSendPort?.send(null);
    } catch (_) {}
    _isolate?.kill(priority: Isolate.immediate);
    _isolate = null;
    _hostSub.cancel();
    _hostReceive.close();
    _messagesController.close();
  }
}

WorkerHandle startWorkerHandle(
  void Function(WorkerEndpoint) entry, {
  String debugName = 'fastlottie.worker',
}) => _IoWorkerHandle(entry, debugName: debugName);
