import 'package:flutter/foundation.dart';

/// Default byte ceiling for the native raw `.flbin` network disk cache (64 MiB).
const int defaultMaximumNetworkDiskBytes = 64 * 1024 * 1024;

/// Thrown when an in-flight network fetch is aborted via [FastLottieCancelToken].
class FastLottieNetworkCancelledException implements Exception {
  const FastLottieNetworkCancelledException();

  @override
  String toString() => 'FastLottie network load cancelled';
}

/// Thrown when fetching a remote Lottie/TGS resource fails.
class FastLottieNetworkException implements Exception {
  const FastLottieNetworkException(this.uri, this.message, {this.statusCode});

  final Uri uri;
  final String message;
  final int? statusCode;

  @override
  String toString() => statusCode == null
      ? 'FastLottieNetworkException($uri): $message'
      : 'FastLottieNetworkException($uri, HTTP $statusCode): $message';
}

/// Coordinates aborting in-flight network requests when widgets unmount or
/// scroll offscreen.
final class FastLottieCancelToken {
  bool _cancelled = false;
  final List<VoidCallback> _listeners = <VoidCallback>[];

  bool get isCancelled => _cancelled;

  void addCancelListener(VoidCallback listener) {
    if (_cancelled) {
      listener();
      return;
    }
    _listeners.add(listener);
  }

  void removeCancelListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

  void cancel() {
    if (_cancelled) return;
    _cancelled = true;
    final snapshot = List<VoidCallback>.of(_listeners, growable: false);
    _listeners.clear();
    for (final listener in snapshot) {
      try {
        listener();
      } catch (_) {}
    }
  }
}

/// Result of a platform byte fetch, indicating whether bytes came from the raw
/// local URL cache instead of an HTTP round-trip.
final class FastLottieNetworkFetchResult {
  const FastLottieNetworkFetchResult(this.bytes, {required this.fromDiskCache});

  final Uint8List bytes;
  final bool fromDiskCache;
}

typedef FastLottieNetworkByteLoader = Future<Uint8List> Function(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
});
