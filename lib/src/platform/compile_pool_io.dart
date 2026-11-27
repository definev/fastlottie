import 'dart:async';
import 'dart:collection';
import 'dart:io';
import 'dart:isolate';
import 'dart:math' as math;
import 'dart:typed_data';

import '../scene/options.dart';

const int _opCompile = 1;
const int _repResult = 1;
const int _repError = 2;
const int _repIdleExit = 3;

final class _CompileJob {
  _CompileJob(
    this.id,
    this.bytes,
    this.options,
    this.prepareForVector,
    this.compile,
    this.completer,
  );

  final int id;
  final List<int> bytes;
  final FastLottieOptions options;
  final bool prepareForVector;
  final Object? Function(List<int>, FastLottieOptions, bool) compile;
  final Completer<Object?> completer;
}

final class _CompileWorker {
  _CompileWorker(this.id, this.pool) {
    final hostReceive = ReceivePort();
    _hostReceive = hostReceive;
    _sub = hostReceive.listen(_onMessage);
    Isolate.spawn(
      _compileWorkerMain,
      hostReceive.sendPort,
      debugName: 'fastlottie.compile.$id',
      errorsAreFatal: true,
      onError: hostReceive.sendPort,
      onExit: hostReceive.sendPort,
    ).then<void>(
      (_) {},
      onError: (Object error, StackTrace stack) => _failAndClose(error, stack),
    );
  }

  final int id;
  final _CompilePool pool;
  late final ReceivePort _hostReceive;
  late final StreamSubscription<Object?> _sub;
  SendPort? _sendPort;
  _CompileJob? _activeJob;
  RemoteError? _remoteError;
  bool _closed = false;

  bool get isBusy => _activeJob != null;
  bool get isReady => _sendPort != null && !_closed;

  void dispatch(_CompileJob job) {
    _activeJob = job;
    final port = _sendPort;
    if (port != null) {
      _sendJob(port, job);
    }
  }

  void _sendJob(SendPort port, _CompileJob job) {
    try {
      final payload = job.bytes is Uint8List
          ? TransferableTypedData.fromList([job.bytes as Uint8List])
          : TransferableTypedData.fromList([Uint8List.fromList(job.bytes)]);
      port.send((
        _opCompile,
        job.id,
        payload,
        job.options,
        job.prepareForVector,
        job.compile,
      ));
    } catch (error, stack) {
      _activeJob = null;
      job.completer.completeError(error, stack);
    }
  }

  void _onMessage(Object? message) {
    if (_closed) return;
    if (message == null) {
      final error = _remoteError;
      _failAndClose(
        error ?? StateError('Compile isolate exited'),
        error?.stackTrace ?? StackTrace.current,
      );
      return;
    }
    if (message case [final String error, final String stack]) {
      _remoteError = RemoteError(error, stack);
      return;
    }
    if (_sendPort == null && message is SendPort) {
      _sendPort = message;
      final job = _activeJob;
      if (job != null) {
        _sendJob(message, job);
      }
      pool._pump();
      return;
    }
    switch (message) {
      case (_repResult, final int id, final Object? result):
        final job = _activeJob;
        if (job != null && job.id == id) {
          _activeJob = null;
          job.completer.complete(result);
        }
        pool._pump();
      case (_repError, final int id, final Object error, final String stack):
        final job = _activeJob;
        if (job != null && job.id == id) {
          _activeJob = null;
          job.completer.completeError(error, StackTrace.fromString(stack));
        }
        pool._pump();
      case (_repIdleExit,):
        final stranded = _activeJob;
        _activeJob = null;
        _close();
        if (stranded != null) {
          pool._queue.addFirst(stranded);
        }
        pool._onWorkerClosed(this);
    }
  }

  void _failAndClose(Object error, StackTrace stack) {
    final job = _activeJob;
    _activeJob = null;
    _close();
    pool._onWorkerClosed(this);
    if (job != null && !job.completer.isCompleted) {
      job.completer.completeError(error, stack);
    }
  }

  void _close() {
    if (_closed) return;
    _closed = true;
    _sendPort = null;
    _sub.cancel();
    _hostReceive.close();
  }
}

void _compileWorkerMain(SendPort hostPort) {
  final receive = ReceivePort();
  hostPort.send(receive.sendPort);

  Timer? idleTimer;
  void armIdleTimer() {
    idleTimer?.cancel();
    // Self-terminate inside the worker isolate so zero timers exist in the
    // host isolate's zone (keeping Flutter widget tests FakeAsync-clean).
    idleTimer = Timer(const Duration(seconds: 4), () {
      hostPort.send(const (_repIdleExit,));
      receive.close();
    });
  }

  armIdleTimer();

  receive.listen((Object? raw) {
    switch (raw) {
      case (
        _opCompile,
        final int id,
        final TransferableTypedData payload,
        final FastLottieOptions options,
        final bool prepareForVector,
        final Object? Function(List<int>, FastLottieOptions, bool) compile,
      ):
        idleTimer?.cancel();
        try {
          final bytes = payload.materialize().asUint8List();
          final result = compile(bytes, options, prepareForVector);
          hostPort.send((_repResult, id, result));
        } catch (error, stack) {
          final trace = stack.toString();
          try {
            hostPort.send((_repError, id, error, trace));
          } on ArgumentError {
            hostPort.send((
              _repError,
              id,
              RemoteError(error.toString(), trace),
              trace,
            ));
          }
        } finally {
          armIdleTimer();
        }
    }
  });
}

final class _CompilePool {
  static final _CompilePool instance = _CompilePool._();
  _CompilePool._();

  final int _maxWorkers = math.max(
    1,
    math.min(2, Platform.numberOfProcessors ~/ 2),
  );
  final _workers = <_CompileWorker>[];
  final _queue = Queue<_CompileJob>();
  int _nextJobId = 1;
  int _nextWorkerId = 1;

  Future<T> run<T>(
    List<int> bytes,
    FastLottieOptions options,
    bool prepareForVector,
    T Function(List<int>, FastLottieOptions, bool) compile,
  ) {
    final completer = Completer<Object?>();
    _queue.add(
      _CompileJob(
        _nextJobId++,
        bytes,
        options,
        prepareForVector,
        compile,
        completer,
      ),
    );
    _pump();
    return completer.future.then((value) => value as T);
  }

  void _pump() {
    while (_queue.isNotEmpty) {
      _CompileWorker? idle;
      for (final w in _workers) {
        if (!w.isBusy && w.isReady) {
          idle = w;
          break;
        }
      }
      if (idle == null) {
        if (_workers.length < _maxWorkers) {
          idle = _CompileWorker(_nextWorkerId++, this);
          _workers.add(idle);
        } else {
          // Check for a newly spawned worker that hasn't finished handshake yet
          // and has no job assigned.
          for (final w in _workers) {
            if (!w.isBusy) {
              idle = w;
              break;
            }
          }
          if (idle == null) return;
        }
      }
      idle.dispatch(_queue.removeFirst());
    }
  }

  void _onWorkerClosed(_CompileWorker worker) {
    _workers.remove(worker);
    if (_queue.isNotEmpty) _pump();
  }
}

/// Compiles Lottie/TGS bytes on a small reusable persistent isolate pool
/// instead of spawning a fresh isolate per asset.
Future<T> runInCompilePool<T>(
  List<int> bytes,
  FastLottieOptions options,
  bool prepareForVector,
  T Function(List<int>, FastLottieOptions, bool) compile,
) => _CompilePool.instance.run(bytes, options, prepareForVector, compile);
