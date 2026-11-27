import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'network_types.dart';

bool get isNetworkFetchSupported => true;

HttpClient? _sharedHttpClient;
int _tmpSeq = 0;
final _createdCacheDirs = <String>{};

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

String _hashCacheKey(String key) {
  final bytes = utf8.encode(key);
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

String _cacheFilePath(
  String directoryPath,
  Uri uri,
  Map<String, String>? headers,
) {
  final sep = Platform.pathSeparator;
  final clean = directoryPath.endsWith('/') || directoryPath.endsWith('\\')
      ? directoryPath.substring(0, directoryPath.length - 1)
      : directoryPath;
  var key = uri.toString();
  if (headers != null && headers.isNotEmpty) {
    final normalized = {
      for (final entry in headers.entries) entry.key.toLowerCase(): entry.value,
    };
    final names = normalized.keys.toList()..sort();
    key = jsonEncode([
      key,
      for (final name in names) [name, normalized[name]],
    ]);
  }
  return '$clean$sep${_hashCacheKey(key)}.tgsbin';
}

Future<FastLottieNetworkFetchResult> platformFetchLottieBytes(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
  int maximumBytes = 16 * 1024 * 1024,
  bool cacheDownloadedBytes = true,
  Duration responseTimeout = const Duration(seconds: 30),
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
      ? _cacheFilePath(sourceCacheDirectory, uri, headers)
      : null;
  if (cachePath != null) {
    try {
      final cachedFile = File(cachePath);
      final stat = await cachedFile.stat();
      if (cancelToken?.isCancelled ?? false) {
        throw const FastLottieNetworkCancelledException();
      }
      if (stat.type == FileSystemEntityType.file &&
          stat.size > 0 &&
          stat.size <= maximumBytes) {
        final bytes = await cachedFile.readAsBytes();
        if (cancelToken?.isCancelled ?? false) {
          throw const FastLottieNetworkCancelledException();
        }
        if (bytes.isNotEmpty && bytes.length <= maximumBytes) {
          return FastLottieNetworkFetchResult(bytes, fromDiskCache: true);
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

    final response = await request.close().timeout(
      responseTimeout,
      onTimeout: () {
        const message = 'Timed out waiting for response headers';
        final error = FastLottieNetworkException(uri, message);
        req.abort(error);
        throw error;
      },
    );
    if (aborted || (cancelToken?.isCancelled ?? false)) {
      await response.listen(null, onError: (Object _) {}).cancel();
      throw const FastLottieNetworkCancelledException();
    }
    final status = response.statusCode;
    if (status < 200 || status >= 300) {
      await response.listen(null, onError: (Object _) {}).cancel();
      throw FastLottieNetworkException(
        uri,
        'Unexpected HTTP status $status',
        statusCode: status,
      );
    }
    if (response.contentLength > maximumBytes) {
      await response.listen(null, onError: (Object _) {}).cancel();
      throw FastLottieNetworkException(
        uri,
        'Response Content-Length (${response.contentLength}) exceeds $maximumBytes bytes',
        statusCode: status,
      );
    }

    final builder = BytesBuilder(copy: false);
    var total = 0;
    final done = responseBody = Completer<Uint8List>();
    subscription = response
        .timeout(responseTimeout)
        .listen(
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
            } else if (error is TimeoutException) {
              done.completeError(
                FastLottieNetworkException(
                  uri,
                  'Timed out waiting for response data',
                  statusCode: status,
                ),
                stack,
              );
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
    if (cacheDownloadedBytes && cachePath != null) {
      await _writeSourceCache(
        cachePath,
        sourceCacheDirectory!,
        bytes,
        cancelToken,
      );
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

Future<void> platformCacheNetworkBytes(
  Uri uri,
  Uint8List bytes, {
  required String directoryPath,
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
}) {
  if (directoryPath.isEmpty) return Future<void>.value();
  return _writeSourceCache(
    _cacheFilePath(directoryPath, uri, headers),
    directoryPath,
    bytes,
    cancelToken,
  );
}

Future<void> _writeSourceCache(
  String path,
  String directoryPath,
  Uint8List bytes,
  FastLottieCancelToken? cancelToken,
) async {
  if (bytes.isEmpty || (cancelToken?.isCancelled ?? false)) return;
  final tmpFile = File('$path.tmp.$pid.${++_tmpSeq}');
  var published = false;
  try {
    if (_createdCacheDirs.add(directoryPath)) {
      await Directory(directoryPath).create(recursive: true);
    }
    try {
      await tmpFile.writeAsBytes(bytes);
    } on PathNotFoundException {
      await Directory(directoryPath).create(recursive: true);
      await tmpFile.writeAsBytes(bytes);
    }
    if (cancelToken?.isCancelled ?? false) return;
    await tmpFile.rename(path);
    published = true;
  } on FileSystemException {
    _createdCacheDirs.remove(directoryPath);
  } finally {
    if (!published) {
      try {
        await tmpFile.delete();
      } on FileSystemException {
        // The failed write may have left no temp file.
      }
    }
  }
}

Future<void> platformClearNetworkCacheDirectory(String directoryPath) async {
  if (directoryPath.isEmpty) return;
  _createdCacheDirs.remove(directoryPath);
  try {
    final dir = Directory(directoryPath);
    if (!await dir.exists()) return;
    await for (final entity in dir.list(followLinks: false)) {
      if (entity is File &&
          (entity.path.endsWith('.tgsbin') || entity.path.contains('.tmp.'))) {
        try {
          await entity.delete();
        } on FileSystemException {
          // Ignore files already deleted concurrently.
        }
      }
    }
  } on FileSystemException {
    // Ignore non-fatal cleanup errors when clearing network disk cache.
  }
}
