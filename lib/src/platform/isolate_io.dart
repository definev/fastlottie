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
      if (msg == null) {
        _onExit();
        return;
      }
      if (msg case [final String error, final String stack]) {
        _failure = RemoteError(error, stack);
        return;
      }
      if (_workerSendPort == null && msg is SendPort) {
        _workerSendPort = msg;
        if (_disposed) {
          msg.send(null);
          return;
        }
        try {
          for (final queued in _pendingPreHandshake) {
            msg.send(queued);
          }
        } catch (error) {
          _failure = error;
          msg.send(null);
        }
        _pendingPreHandshake.clear();
        return;
      }
      if (!_disposed) _messagesController.add(msg);
    });
    Isolate.spawn(
      _ioWorkerBootstrap,
      _IoBootstrapArgs(hostReceive.sendPort, entry),
      debugName: debugName,
      errorsAreFatal: true,
      onError: hostReceive.sendPort,
      onExit: hostReceive.sendPort,
    ).then<void>(
      (_) {},
      onError: (Object error, StackTrace stack) {
        _failure = error;
        _onExit();
      },
    );
  }

  late final ReceivePort _hostReceive;
  late final StreamSubscription<Object?> _hostSub;
  final _messagesController = StreamController<Object?>();
  final _exited = Completer<void>();
  final _pendingPreHandshake = <Object?>[];
  SendPort? _workerSendPort;
  Object? _failure;
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

  void _onExit() {
    _hostSub.cancel();
    _hostReceive.close();
    _pendingPreHandshake.clear();
    _workerSendPort = null;
    if (!_exited.isCompleted) _exited.complete();
    if (!_messagesController.isClosed) {
      _messagesController.addError(
        _failure ?? StateError('Raster isolate exited'),
      );
      unawaited(_messagesController.close());
    }
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _pendingPreHandshake.clear();
    // Let the worker dispose its native workspace and file handles. If the
    // handshake is still pending, the listener delivers the stop signal then.
    final port = _workerSendPort;
    port?.send(null);
    unawaited(_messagesController.close());
  }
}

Future<void> workerHandleExited(WorkerHandle handle) =>
    (handle as _IoWorkerHandle)._exited.future;

WorkerHandle startWorkerHandle(
  void Function(WorkerEndpoint) entry, {
  String debugName = 'fastlottie.worker',
}) => _IoWorkerHandle(entry, debugName: debugName);
