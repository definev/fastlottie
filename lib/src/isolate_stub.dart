import 'dart:async';
import 'dart:typed_data';

bool get isIsolatePoolSupported => false;

Object packBytesForIsolate(Uint8List bytes) => Uint8List.fromList(bytes);

Uint8List unpackBytesFromIsolate(Object payload) => payload as Uint8List;

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

final class _StubWorkerEndpoint implements WorkerEndpoint {
  _StubWorkerEndpoint(this._toWorker, this._toHost);

  final StreamController<Object?> _toWorker;
  final StreamController<Object?> _toHost;

  @override
  void send(Object? message) {
    if (!_toHost.isClosed) _toHost.add(message);
  }

  @override
  Stream<Object?> get messages => _toWorker.stream;

  @override
  void close() {
    if (!_toWorker.isClosed) _toWorker.close();
    if (!_toHost.isClosed) _toHost.close();
  }
}

final class _StubWorkerHandle implements WorkerHandle {
  _StubWorkerHandle(void Function(WorkerEndpoint) entry) {
    _endpoint = _StubWorkerEndpoint(_toWorker, _toHost);
    entry(_endpoint);
  }

  final _toWorker = StreamController<Object?>();
  final _toHost = StreamController<Object?>();
  late final _StubWorkerEndpoint _endpoint;
  bool _disposed = false;

  @override
  void send(Object? message) {
    if (_disposed || _toWorker.isClosed) return;
    _toWorker.add(message);
  }

  @override
  Stream<Object?> get messages => _toHost.stream;

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _endpoint.close();
  }
}

WorkerHandle startWorkerHandle(
  void Function(WorkerEndpoint) entry, {
  String debugName = 'fastlottie.worker',
}) => _StubWorkerHandle(entry);
