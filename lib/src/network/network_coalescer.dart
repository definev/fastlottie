import 'dart:async';
import 'dart:convert';

import 'network_types.dart';

/// Builds a deterministic key for a `(uri, headers)` pair with case-insensitive
/// sorted header names.
String canonicalNetworkRequestKey(Uri uri, Map<String, String>? headers) {
  final base = uri.toString();
  if (headers == null || headers.isEmpty) return base;
  final normalized = <String, String>{
    for (final entry in headers.entries) entry.key.toLowerCase(): entry.value,
  };
  final names = normalized.keys.toList()..sort();
  return jsonEncode([
    base,
    for (final name in names) [name, normalized[name]],
  ]);
}

/// Coalesces concurrent asynchronous requests sharing an identical key onto one
/// underlying execution with reference-counted cancellation.
///
/// Cancelling one waiter immediately rejects that waiter with
/// [FastLottieNetworkCancelledException] while keeping the shared task alive
/// for remaining waiters. Only when all waiters cancel is the shared
/// [FastLottieCancelToken] cancelled.
final class NetworkRequestCoalescer<T> {
  final _inFlight = <Object, _CoalescedCall<T>>{};

  /// Number of distinct in-flight operations currently tracked.
  int get inFlightCount => _inFlight.length;

  Future<T> run(
    Object key, {
    FastLottieCancelToken? cancelToken,
    required Future<T> Function(FastLottieCancelToken sharedToken) start,
  }) {
    if (cancelToken?.isCancelled ?? false) {
      return Future<T>.error(const FastLottieNetworkCancelledException());
    }
    var call = _inFlight[key];
    if (call == null) {
      call = _CoalescedCall<T>(key, _inFlight);
      _inFlight[key] = call;
      final future = call.addWaiter(cancelToken);
      call.launch(start);
      return future;
    }
    return call.addWaiter(cancelToken);
  }
}

final class _CoalescedWaiter<T> {
  _CoalescedWaiter(this.completer, this.cancelToken);

  final Completer<T> completer;
  final FastLottieCancelToken? cancelToken;
  void Function()? onCancel;

  void detach() {
    final listener = onCancel;
    if (listener != null) {
      onCancel = null;
      cancelToken?.removeCancelListener(listener);
    }
  }
}

final class _CoalescedCall<T> {
  _CoalescedCall(this.key, this.registry);

  final Object key;
  final Map<Object, _CoalescedCall<T>> registry;
  final sharedToken = FastLottieCancelToken();
  final _waiters = <_CoalescedWaiter<T>>[];
  bool _settled = false;

  void launch(Future<T> Function(FastLottieCancelToken sharedToken) start) {
    unawaited(
      Future<T>.sync(
        () => start(sharedToken),
      ).then<void>(_completeValue, onError: _completeError),
    );
  }

  Future<T> addWaiter(FastLottieCancelToken? cancelToken) {
    final completer = Completer<T>();
    final waiter = _CoalescedWaiter<T>(completer, cancelToken);
    void onCancel() {
      if (!_waiters.remove(waiter)) return;
      waiter.detach();
      if (!completer.isCompleted) {
        completer.completeError(const FastLottieNetworkCancelledException());
      }
      if (_waiters.isEmpty && !_settled) {
        _detachFromRegistry();
        sharedToken.cancel();
      }
    }

    waiter.onCancel = onCancel;
    _waiters.add(waiter);
    cancelToken?.addCancelListener(onCancel);
    return completer.future;
  }

  void _detachFromRegistry() {
    if (identical(registry[key], this)) {
      registry.remove(key);
    }
  }

  void _completeValue(T value) {
    if (_settled) return;
    _settled = true;
    _detachFromRegistry();
    final snapshot = List<_CoalescedWaiter<T>>.of(_waiters, growable: false);
    _waiters.clear();
    for (final waiter in snapshot) {
      waiter.detach();
      if (!waiter.completer.isCompleted) {
        if (waiter.cancelToken?.isCancelled ?? false) {
          waiter.completer.completeError(
            const FastLottieNetworkCancelledException(),
          );
        } else {
          waiter.completer.complete(value);
        }
      }
    }
  }

  void _completeError(Object error, StackTrace stack) {
    if (_settled) return;
    _settled = true;
    _detachFromRegistry();
    final snapshot = List<_CoalescedWaiter<T>>.of(_waiters, growable: false);
    _waiters.clear();
    for (final waiter in snapshot) {
      waiter.detach();
      if (!waiter.completer.isCompleted) {
        waiter.completer.completeError(error, stack);
      }
    }
  }
}
