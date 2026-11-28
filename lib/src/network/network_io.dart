import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'network_coalescer.dart';
import 'network_types.dart';

bool get isNetworkFetchSupported => true;

HttpClient? _sharedHttpClient;
int _tmpSeq = 0;
final _createdCacheDirs = <String>{};
final _diskDirLrus = <String, _NetworkDiskDirLru>{};
final _ioFetchCoalescer =
    NetworkRequestCoalescer<FastLottieNetworkFetchResult>();

String _cleanDirectoryPath(String directoryPath) {
  var end = directoryPath.length;
  while (end > 1 &&
      (directoryPath.codeUnitAt(end - 1) == 47 ||
          directoryPath.codeUnitAt(end - 1) == 92)) {
    end--;
  }
  return end == directoryPath.length
      ? directoryPath
      : directoryPath.substring(0, end);
}

String _fileNameFromPath(String path) {
  final slash = path.lastIndexOf('/');
  final backslash = path.lastIndexOf('\\');
  final cut = slash > backslash ? slash : backslash;
  return cut >= 0 ? path.substring(cut + 1) : path;
}

final class _NetworkDiskDirLru {
  final entries = <String, int>{};
  int totalBytes = 0;
  bool _scanned = false;
  String? _lastMtimeTouchFile;
  Future<void> _serial = Future<void>.value();

  /// Serializes directory writes, scans, evictions, and clears per cache
  /// directory so concurrent fetches cannot mutually evict fresh writes or
  /// leave ghost bytes in LRU accounting.
  Future<T> runSerialized<T>(Future<T> Function() action) {
    final prev = _serial;
    final done = Completer<void>();
    _serial = done.future;
    return prev.whenComplete(() {}).then((_) async {
      try {
        return await action();
      } finally {
        done.complete();
      }
    });
  }

  Future<void> ensureScanned(String directoryPath) async {
    if (_scanned) return;
    try {
      final dir = Directory(directoryPath);
      if (!await dir.exists()) return;
      final found = <(String name, int size, int modifiedMs)>[];
      final now = DateTime.now();
      await for (final entity in dir.list(followLinks: false)) {
        if (entity is! File) continue;
        final name = _fileNameFromPath(entity.path);
        if (name.endsWith('.tgsbin')) {
          try {
            final stat = await entity.stat();
            found.add((name, stat.size, stat.modified.millisecondsSinceEpoch));
          } on FileSystemException {
            // Skip files removed concurrently.
          }
        } else if (name.contains('.tgsbin.tmp.')) {
          try {
            final stat = await entity.stat();
            if (now.difference(stat.modified) > const Duration(minutes: 5)) {
              await entity.delete();
            }
          } on FileSystemException {
            // Ignore cleanup races.
          }
        }
      }
      found.sort((a, b) => a.$3.compareTo(b.$3));
      final merged = <String, int>{};
      var total = 0;
      for (final (name, size, _) in found) {
        if (entries.containsKey(name)) continue;
        merged[name] = size;
        total += size;
      }
      for (final live in entries.entries) {
        merged[live.key] = live.value;
        total += live.value;
      }
      entries
        ..clear()
        ..addAll(merged);
      totalBytes = total;
      _scanned = true;
    } on FileSystemException {
      // Directory unavailable; _scanned stays false so subsequent writes retry.
    }
  }

  void resetState() {
    entries.clear();
    totalBytes = 0;
    _scanned = false;
    _lastMtimeTouchFile = null;
  }

  void touch(String fileName, int size) {
    final previous = entries.remove(fileName);
    if (previous != null) {
      totalBytes -= previous;
    }
    entries[fileName] = size;
    totalBytes += size;
  }

  void recordWrite(String fileName, int size) => touch(fileName, size);

  void remove(String fileName) {
    final previous = entries.remove(fileName);
    if (previous != null) {
      totalBytes -= previous;
    }
    if (_lastMtimeTouchFile == fileName) {
      _lastMtimeTouchFile = null;
    }
  }

  Future<void> evictToBudget(
    String directoryPath,
    int maximumCacheBytes, {
    String? keepFile,
  }) async {
    final cleanDir = _cleanDirectoryPath(directoryPath);
    final sep = Platform.pathSeparator;
    while (totalBytes > maximumCacheBytes && entries.isNotEmpty) {
      String? victim;
      for (final candidate in entries.keys) {
        if (candidate != keepFile) {
          victim = candidate;
          break;
        }
      }
      if (victim == null) break;
      final size = entries.remove(victim)!;
      totalBytes -= size;
      if (_lastMtimeTouchFile == victim) {
        _lastMtimeTouchFile = null;
      }
      try {
        await File('$cleanDir$sep$victim').delete();
      } on FileSystemException {
        // Ignore files already deleted concurrently.
      }
    }
  }
}

_NetworkDiskDirLru _dirLru(String directoryPath) => _diskDirLrus.putIfAbsent(
  _cleanDirectoryPath(directoryPath),
  _NetworkDiskDirLru.new,
);

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
  final clean = _cleanDirectoryPath(directoryPath);
  final key = canonicalNetworkRequestKey(uri, headers);
  return '$clean$sep${_hashCacheKey(key)}.tgsbin';
}

Future<FastLottieNetworkFetchResult> platformFetchLottieBytes(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
  int maximumBytes = 16 * 1024 * 1024,
  int maximumCacheBytes = defaultMaximumNetworkDiskBytes,
  bool cacheDownloadedBytes = true,
  Duration responseTimeout = const Duration(seconds: 30),
}) async {
  if (maximumBytes <= 0) {
    throw ArgumentError.value(maximumBytes, 'maximumBytes');
  }
  RangeError.checkNotNegative(maximumCacheBytes, 'maximumCacheBytes');
  if (cancelToken?.isCancelled ?? false) {
    throw const FastLottieNetworkCancelledException();
  }

  final initialHeaders = headers == null ? null : Map.of(headers);
  final hasDiskDir =
      sourceCacheDirectory != null && sourceCacheDirectory.isNotEmpty;
  final cleanDir = hasDiskDir ? _cleanDirectoryPath(sourceCacheDirectory) : null;
  final cachePath = hasDiskDir
      ? _cacheFilePath(sourceCacheDirectory, uri, initialHeaders)
      : null;
  if (cachePath != null && cleanDir != null) {
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
          final lru = _dirLru(cleanDir);
          final fileName = _fileNameFromPath(cachePath);
          lru.touch(fileName, bytes.length);
          if (lru._lastMtimeTouchFile != fileName) {
            lru._lastMtimeTouchFile = fileName;
            unawaited(
              cachedFile
                  .setLastModified(DateTime.now())
                  .catchError((Object _) => cachedFile),
            );
          }
          return FastLottieNetworkFetchResult(bytes, fromDiskCache: true);
        }
      }
    } on FileSystemException {
      // Cache miss/race: fall back cleanly to HTTP download.
    }
  }

  final coalesceKey = (
    canonicalNetworkRequestKey(uri, initialHeaders),
    cleanDir,
    maximumBytes,
    cleanDir != null && cacheDownloadedBytes,
    cleanDir != null ? maximumCacheBytes : 0,
    responseTimeout,
  );
  return _ioFetchCoalescer.run(
    coalesceKey,
    cancelToken: cancelToken,
    start: (sharedToken) => _fetchNetworkIo(
      uri,
      initialHeaders: initialHeaders,
      cancelToken: sharedToken,
      sourceCacheDirectory: cleanDir,
      cachePath: cachePath,
      maximumBytes: maximumBytes,
      maximumCacheBytes: maximumCacheBytes,
      cacheDownloadedBytes: cacheDownloadedBytes,
      responseTimeout: responseTimeout,
    ),
  );
}

Future<FastLottieNetworkFetchResult> _fetchNetworkIo(
  Uri uri, {
  required Map<String, String>? initialHeaders,
  required FastLottieCancelToken cancelToken,
  required String? sourceCacheDirectory,
  required String? cachePath,
  required int maximumBytes,
  required int maximumCacheBytes,
  required bool cacheDownloadedBytes,
  required Duration responseTimeout,
}) async {
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

  cancelToken.addCancelListener(abort);
  try {
    if (cancelToken.isCancelled) {
      throw const FastLottieNetworkCancelledException();
    }
    var url = uri;
    var redirects = 0;
    var requestHeaders = initialHeaders;
    final visited = <Uri>{uri.removeFragment()};
    HttpClientResponse response;
    while (true) {
      final req = request = await client.getUrl(url);
      if (aborted) {
        // Observe the error from an abort before headers were requested.
        req.done.ignore();
        req.abort();
        throw const FastLottieNetworkCancelledException();
      }
      req.followRedirects = false;
      if (!usesShared) {
        req.headers.set(HttpHeaders.connectionHeader, 'close');
      }
      req.headers.set(
        HttpHeaders.acceptHeader,
        'application/x-tgsticker, application/json, */*',
      );
      requestHeaders?.forEach(req.headers.set);
      response = await req.close().timeout(
        responseTimeout,
        onTimeout: () {
          final error = FastLottieNetworkException(
            uri,
            'Timed out waiting for response headers',
          );
          req.abort(error);
          throw error;
        },
      );
      if (aborted) {
        await _cancelResponse(response);
        throw const FastLottieNetworkCancelledException();
      }
      if (!response.isRedirect) break;
      final location = response.headers.value(HttpHeaders.locationHeader);
      final status = response.statusCode;
      await _cancelResponse(response);
      if (aborted || cancelToken.isCancelled) {
        throw const FastLottieNetworkCancelledException();
      }
      if (location == null) {
        throw FastLottieNetworkException(
          uri,
          'Redirect has no location',
          statusCode: status,
        );
      }
      final next = url.resolve(location);
      if ((!next.isScheme('http') && !next.isScheme('https')) ||
          (url.isScheme('https') && !next.isScheme('https'))) {
        throw FastLottieNetworkException(
          uri,
          'Disallowed redirect scheme',
          statusCode: status,
        );
      }
      if (++redirects > req.maxRedirects ||
          !visited.add(next.removeFragment())) {
        throw FastLottieNetworkException(
          uri,
          'Redirect limit exceeded',
          statusCode: status,
        );
      }
      final crossOrigin =
          (!url.isScheme('http') && !url.isScheme('https')) ||
          url.origin != next.origin;
      if (crossOrigin && requestHeaders != null) {
        requestHeaders = Map.of(requestHeaders)
          ..removeWhere(
            (name, _) => _sensitiveRedirectHeaders.contains(name.toLowerCase()),
          );
      }
      url = next;
    }
    final status = response.statusCode;
    if (status < 200 || status >= 300) {
      await _cancelResponse(response);
      if (aborted || cancelToken.isCancelled) {
        throw const FastLottieNetworkCancelledException();
      }
      throw FastLottieNetworkException(
        uri,
        'Unexpected HTTP status $status',
        statusCode: status,
      );
    }
    if (response.contentLength > maximumBytes) {
      await _cancelResponse(response);
      if (aborted || cancelToken.isCancelled) {
        throw const FastLottieNetworkCancelledException();
      }
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
            if (aborted || cancelToken.isCancelled) {
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
            if (aborted || cancelToken.isCancelled) {
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
            if (aborted || cancelToken.isCancelled) {
              done.completeError(const FastLottieNetworkCancelledException());
            } else {
              done.complete(builder.takeBytes());
            }
          },
          cancelOnError: true,
        );

    final bytes = await done.future;
    if (cacheDownloadedBytes &&
        cachePath != null &&
        sourceCacheDirectory != null) {
      await _writeSourceCache(
        cachePath,
        sourceCacheDirectory,
        bytes,
        cancelToken,
        maximumCacheBytes: maximumCacheBytes,
      );
    }
    if (aborted || cancelToken.isCancelled) {
      throw const FastLottieNetworkCancelledException();
    }
    return FastLottieNetworkFetchResult(bytes, fromDiskCache: false);
  } on FastLottieNetworkCancelledException {
    rethrow;
  } on FastLottieNetworkException {
    rethrow;
  } catch (error) {
    if (aborted || cancelToken.isCancelled) {
      throw const FastLottieNetworkCancelledException();
    }
    throw FastLottieNetworkException(uri, error.toString());
  } finally {
    cancelToken.removeCancelListener(abort);
    if (!usesShared) {
      client.close(force: true);
    }
  }
}

const _sensitiveRedirectHeaders = {
  HttpHeaders.authorizationHeader,
  HttpHeaders.wwwAuthenticateHeader,
  HttpHeaders.proxyAuthorizationHeader,
  HttpHeaders.proxyAuthenticateHeader,
  HttpHeaders.cookieHeader,
  'cookie2',
  HttpHeaders.hostHeader,
};

Future<void> _cancelResponse(HttpClientResponse response) =>
    response.listen(null, onError: (Object _) {}).cancel();

Future<void> platformCacheNetworkBytes(
  Uri uri,
  Uint8List bytes, {
  required String directoryPath,
  Map<String, String>? headers,
  int maximumCacheBytes = defaultMaximumNetworkDiskBytes,
  FastLottieCancelToken? cancelToken,
}) {
  RangeError.checkNotNegative(maximumCacheBytes, 'maximumCacheBytes');
  if (directoryPath.isEmpty) return Future<void>.value();
  final cleanDir = _cleanDirectoryPath(directoryPath);
  return _writeSourceCache(
    _cacheFilePath(cleanDir, uri, headers),
    cleanDir,
    bytes,
    cancelToken,
    maximumCacheBytes: maximumCacheBytes,
  );
}

Future<void> _writeSourceCache(
  String path,
  String directoryPath,
  Uint8List bytes,
  FastLottieCancelToken? cancelToken, {
  required int maximumCacheBytes,
}) {
  if (bytes.isEmpty || (cancelToken?.isCancelled ?? false)) {
    return Future<void>.value();
  }
  final cleanDir = _cleanDirectoryPath(directoryPath);
  final fileName = _fileNameFromPath(path);
  final lru = _dirLru(cleanDir);
  return lru.runSerialized(() async {
    if (cancelToken?.isCancelled ?? false) return;
    if (maximumCacheBytes <= 0 || bytes.length > maximumCacheBytes) {
      // Do not write entries that exceed the disk budget; remove any stale copy.
      lru.remove(fileName);
      try {
        final stale = File(path);
        if (await stale.exists()) await stale.delete();
      } on FileSystemException {
        // Ignore concurrent deletion.
      }
      return;
    }
    final tmpFile = File('$path.tmp.$pid.${++_tmpSeq}');
    var published = false;
    try {
      if (_createdCacheDirs.add(cleanDir)) {
        await Directory(cleanDir).create(recursive: true);
      }
      try {
        await tmpFile.writeAsBytes(bytes);
      } on PathNotFoundException {
        lru.resetState();
        await Directory(cleanDir).create(recursive: true);
        await tmpFile.writeAsBytes(bytes);
      }
      if (cancelToken?.isCancelled ?? false) return;
      await tmpFile.rename(path);
      published = true;
      await lru.ensureScanned(cleanDir);
      lru.recordWrite(fileName, bytes.length);
      await lru.evictToBudget(cleanDir, maximumCacheBytes, keepFile: fileName);
    } on FileSystemException {
      _createdCacheDirs.remove(cleanDir);
    } finally {
      if (!published) {
        try {
          await tmpFile.delete();
        } on FileSystemException {
          // The failed write may have left no temp file.
        }
      }
    }
  });
}

Future<void> platformClearNetworkCacheDirectory(String directoryPath) {
  if (directoryPath.isEmpty) return Future<void>.value();
  final cleanDir = _cleanDirectoryPath(directoryPath);
  final lru = _dirLru(cleanDir);
  return lru.runSerialized(() async {
    _createdCacheDirs.remove(cleanDir);
    lru.resetState();
    try {
      final dir = Directory(cleanDir);
      if (!await dir.exists()) return;
      await for (final entity in dir.list(followLinks: false)) {
        if (entity is! File) continue;
        final name = _fileNameFromPath(entity.path);
        if (name.endsWith('.tgsbin') || name.contains('.tgsbin.tmp.')) {
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
  });
}
