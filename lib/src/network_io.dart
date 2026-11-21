import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'network_types.dart';

bool get isNetworkFetchSupported => true;

HttpClient? _sharedHttpClient;
int _tmpSeq = 0;

HttpClient _borrowHttpClient() {
  if (HttpOverrides.current == null) {
    return _sharedHttpClient ??= (HttpClient()
      ..idleTimeout = const Duration(seconds: 15)
      ..connectionTimeout = const Duration(seconds: 10)
      ..maxConnectionsPerHost = 8);
  }
  return HttpClient()
    ..idleTimeout = const Duration(seconds: 15)
    ..connectionTimeout = const Duration(seconds: 10)
    ..maxConnectionsPerHost = 8;
}

int _mul32(int a, int b) {
  final lo = (a & 0xFFFF) * b;
  final hi = ((a >>> 16) * b) & 0xFFFF;
  return (lo + (hi << 16)) & 0xFFFFFFFF;
}

String _hashUriKey(Uri uri) {
  final bytes = utf8.encode(uri.toString());
  var h1 = 0x811C9DC5;
  var h2 = 0x9E3779B9;
  var h3 = 0x85EBCA6B;
  var h4 = 0xC2B2AE35;
  for (final x in bytes) {
    h1 = _mul32(h1 ^ x, 0x01000193);
    h2 = _mul32((h2 + x) & 0xFFFFFFFF, 0x85EBCA6B);
    h2 ^= h2 >>> 16;
    h3 = _mul32(h3 ^ x, 0xC2B2AE35);
    h3 ^= h3 >>> 13;
    h4 = _mul32((h4 + h1 + x) & 0xFFFFFFFF, 0x27D4EB2F);
  }
  String hex32(int v) => (v & 0xFFFFFFFF).toRadixString(16).padLeft(8, '0');
  return '${hex32(h1)}${hex32(h2)}${hex32(h3)}${hex32(h4)}';
}

String _cacheFilePath(String directoryPath, Uri uri) {
  final sep = Platform.pathSeparator;
  final clean = directoryPath.endsWith('/') || directoryPath.endsWith('\\')
      ? directoryPath.substring(0, directoryPath.length - 1)
      : directoryPath;
  return '$clean$sep${_hashUriKey(uri)}.tgsbin';
}

Future<FastLottieNetworkFetchResult> platformFetchLottieBytes(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
  int maximumBytes = 16 * 1024 * 1024,
}) async {
  if (maximumBytes <= 0) {
    throw ArgumentError.value(maximumBytes, 'maximumBytes');
  }
  if (cancelToken?.isCancelled ?? false) {
    throw const FastLottieNetworkCancelledException();
  }

  final hasDiskDir =
      sourceCacheDirectory != null && sourceCacheDirectory.isNotEmpty;
  final cachePath = hasDiskDir
      ? _cacheFilePath(sourceCacheDirectory, uri)
      : null;
  if (cachePath != null) {
    try {
      final cachedFile = File(cachePath);
      if (cachedFile.existsSync()) {
        final len = cachedFile.lengthSync();
        if (len > 0 && len <= maximumBytes) {
          final bytes = await cachedFile.readAsBytes();
          if (cancelToken?.isCancelled ?? false) {
            throw const FastLottieNetworkCancelledException();
          }
          if (bytes.isNotEmpty && bytes.length <= maximumBytes) {
            return FastLottieNetworkFetchResult(bytes, fromDiskCache: true);
          }
        }
      }
    } on FileSystemException {
      // Cache miss/race: fall back cleanly to HTTP download.
    }
  }

  final usesShared = HttpOverrides.current == null;
  final client = _borrowHttpClient();
  HttpClientRequest? request;
  StreamSubscription<List<int>>? subscription;
  Completer<Uint8List>? responseBody;
  var aborted = false;

  void abort() {
    aborted = true;
    try {
      request?.abort();
    } catch (_) {}
    final body = responseBody;
    if (body != null && !body.isCompleted) {
      body.completeError(const FastLottieNetworkCancelledException());
    }
    unawaited(subscription?.cancel());
  }

  cancelToken?.addCancelListener(abort);
  try {
    if (cancelToken?.isCancelled ?? false) {
      throw const FastLottieNetworkCancelledException();
    }
    request = await client.getUrl(uri);
    if (aborted || (cancelToken?.isCancelled ?? false)) {
      request.abort();
      throw const FastLottieNetworkCancelledException();
    }
    if (!usesShared) {
      request.headers.set(HttpHeaders.connectionHeader, 'close');
    }
    request.headers.set(
      HttpHeaders.acceptHeader,
      'application/x-tgsticker, application/json, */*',
    );
    final req = request;
    headers?.forEach(req.headers.set);

    final response = await request.close();
    if (aborted || (cancelToken?.isCancelled ?? false)) {
      unawaited(response.drain<void>().catchError((Object _) {}));
      throw const FastLottieNetworkCancelledException();
    }
    final status = response.statusCode;
    if (status < 200 || status >= 300) {
      unawaited(response.drain<void>().catchError((Object _) {}));
      throw FastLottieNetworkException(
        uri,
        'Unexpected HTTP status $status',
        statusCode: status,
      );
    }
    if (response.contentLength > maximumBytes) {
      unawaited(response.drain<void>().catchError((Object _) {}));
      throw FastLottieNetworkException(
        uri,
        'Response Content-Length (${response.contentLength}) exceeds $maximumBytes bytes',
        statusCode: status,
      );
    }

    final builder = BytesBuilder(copy: false);
    var total = 0;
    final done = responseBody = Completer<Uint8List>();
    subscription = response.listen(
      (chunk) {
        if (done.isCompleted) return;
        if (aborted || (cancelToken?.isCancelled ?? false)) {
          done.completeError(const FastLottieNetworkCancelledException());
          unawaited(subscription?.cancel());
          return;
        }
        total += chunk.length;
        if (total > maximumBytes) {
          done.completeError(
            FastLottieNetworkException(
              uri,
              'Downloaded payload exceeds $maximumBytes bytes',
              statusCode: status,
            ),
          );
          unawaited(subscription?.cancel());
          return;
        }
        builder.add(chunk);
      },
      onError: (Object error, StackTrace stack) {
        if (done.isCompleted) return;
        if (aborted || (cancelToken?.isCancelled ?? false)) {
          done.completeError(const FastLottieNetworkCancelledException());
        } else {
          done.completeError(error, stack);
        }
      },
      onDone: () {
        if (done.isCompleted) return;
        if (aborted || (cancelToken?.isCancelled ?? false)) {
          done.completeError(const FastLottieNetworkCancelledException());
        } else {
          done.complete(builder.takeBytes());
        }
      },
      cancelOnError: true,
    );

    final bytes = await done.future;
    if (cachePath != null && bytes.isNotEmpty) {
      try {
        final dir = Directory(sourceCacheDirectory!);
        if (!dir.existsSync()) dir.createSync(recursive: true);
        final tmpPath = '$cachePath.tmp.$pid.${++_tmpSeq}';
        final tmpFile = File(tmpPath);
        await tmpFile.writeAsBytes(bytes, flush: false);
        try {
          tmpFile.renameSync(cachePath);
        } on FileSystemException {
          if (tmpFile.existsSync()) {
            try {
              tmpFile.deleteSync();
            } catch (_) {}
          }
        }
      } on FileSystemException {
        // Ignore non-fatal cache write errors.
      }
    }
    return FastLottieNetworkFetchResult(bytes, fromDiskCache: false);
  } on FastLottieNetworkCancelledException {
    rethrow;
  } on FastLottieNetworkException {
    rethrow;
  } catch (error) {
    if (aborted || (cancelToken?.isCancelled ?? false)) {
      throw const FastLottieNetworkCancelledException();
    }
    throw FastLottieNetworkException(uri, error.toString());
  } finally {
    cancelToken?.removeCancelListener(abort);
    if (!usesShared) {
      client.close(force: true);
    }
  }
}

Future<void> platformClearNetworkCacheDirectory(String directoryPath) async {
  if (directoryPath.isEmpty) return;
  try {
    final dir = Directory(directoryPath);
    if (!dir.existsSync()) return;
    for (final entity in dir.listSync(followLinks: false)) {
      if (entity is File &&
          (entity.path.endsWith('.tgsbin') || entity.path.contains('.tmp.'))) {
        try {
          entity.deleteSync();
        } catch (_) {}
      }
    }
  } on FileSystemException {
    // Ignore non-fatal cleanup errors when clearing network disk cache.
  }
}
