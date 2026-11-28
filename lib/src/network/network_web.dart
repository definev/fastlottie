import 'dart:async';
import 'dart:js_interop';
import 'dart:typed_data';

import 'package:web/web.dart' as web;

import 'network_coalescer.dart';
import 'network_types.dart';

bool get isNetworkFetchSupported => true;

final _webFetchCoalescer =
    NetworkRequestCoalescer<FastLottieNetworkFetchResult>();

Future<FastLottieNetworkFetchResult> platformFetchLottieBytes(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
  int maximumBytes = 16 * 1024 * 1024,
  int maximumCacheBytes = defaultMaximumNetworkDiskBytes,
  bool cacheDownloadedBytes = true,
  Duration responseTimeout = const Duration(seconds: 30),
}) {
  if (maximumBytes <= 0) {
    return Future<FastLottieNetworkFetchResult>.error(
      ArgumentError.value(maximumBytes, 'maximumBytes'),
    );
  }
  if (maximumCacheBytes < 0) {
    return Future<FastLottieNetworkFetchResult>.error(
      RangeError.value(maximumCacheBytes, 'maximumCacheBytes'),
    );
  }
  if (cancelToken?.isCancelled ?? false) {
    return Future<FastLottieNetworkFetchResult>.error(
      const FastLottieNetworkCancelledException(),
    );
  }

  final initialHeaders = headers == null ? null : Map.of(headers);
  final resolved = Uri.parse(web.document.baseURI).resolveUri(uri);
  if (!resolved.isScheme('http') && !resolved.isScheme('https')) {
    return Future<FastLottieNetworkFetchResult>.error(
      FastLottieNetworkException(uri, 'Disallowed URI scheme'),
    );
  }
  final key = (
    canonicalNetworkRequestKey(resolved, initialHeaders),
    maximumBytes,
    responseTimeout,
  );
  return _webFetchCoalescer.run(
    key,
    cancelToken: cancelToken,
    start: (sharedToken) => _fetchOnce(
      uri,
      resolved,
      headers: initialHeaders,
      cancelToken: sharedToken,
      maximumBytes: maximumBytes,
      responseTimeout: responseTimeout,
    ),
  );
}

Future<FastLottieNetworkFetchResult> _fetchOnce(
  Uri originalUri,
  Uri resolvedUri, {
  required Map<String, String>? headers,
  required FastLottieCancelToken cancelToken,
  required int maximumBytes,
  required Duration responseTimeout,
}) async {
  final controller = web.AbortController();
  var aborted = false;
  var timedOut = false;
  var timeoutPhase = 'headers';
  Timer? timeoutTimer;

  void resetTimeout(String phase) {
    if (timedOut || aborted) return;
    timeoutPhase = phase;
    timeoutTimer?.cancel();
    timeoutTimer = Timer(responseTimeout, () {
      timedOut = true;
      controller.abort();
    });
  }

  void onCancel() {
    aborted = true;
    controller.abort();
  }

  cancelToken.addCancelListener(onCancel);
  web.ReadableStreamDefaultReader? reader;
  var streamDone = false;
  int? statusCode;
  try {
    if (aborted || cancelToken.isCancelled) {
      throw const FastLottieNetworkCancelledException();
    }
    web.Headers? jsHeaders;
    if (headers != null && headers.isNotEmpty) {
      jsHeaders = web.Headers();
      headers.forEach((k, v) => jsHeaders!.set(k, v));
    }
    final init = jsHeaders == null
        ? web.RequestInit(method: 'GET', signal: controller.signal)
        : web.RequestInit(
            method: 'GET',
            signal: controller.signal,
            headers: jsHeaders,
          );
    resetTimeout('headers');
    final response = await web.window
        .fetch(resolvedUri.toString().toJS, init)
        .toDart;
    if (aborted || cancelToken.isCancelled) {
      unawaited(_cancelBody(response.body));
      throw const FastLottieNetworkCancelledException();
    }
    final status = statusCode = response.status;
    if (timedOut) {
      unawaited(_cancelBody(response.body));
      throw FastLottieNetworkException(
        originalUri,
        'Timed out waiting for response $timeoutPhase',
        statusCode: status,
      );
    }
    if (status < 200 || status >= 300) {
      unawaited(_cancelBody(response.body));
      throw FastLottieNetworkException(
        originalUri,
        'Unexpected HTTP status $status',
        statusCode: status,
      );
    }
    final lengthHeader = response.headers.get('content-length');
    final declaredLength = lengthHeader == null
        ? null
        : int.tryParse(lengthHeader.trim());
    if (declaredLength != null && declaredLength > maximumBytes) {
      unawaited(_cancelBody(response.body));
      throw FastLottieNetworkException(
        originalUri,
        'Response Content-Length ($declaredLength) exceeds $maximumBytes bytes',
        statusCode: status,
      );
    }

    final body = response.body;
    final Uint8List bytes;
    if (body != null) {
      reader = body.getReader() as web.ReadableStreamDefaultReader;
      final builder = BytesBuilder(copy: false);
      var total = 0;
      while (true) {
        resetTimeout('data');
        final chunk = await reader.read().toDart;
        if (aborted || cancelToken.isCancelled) {
          throw const FastLottieNetworkCancelledException();
        }
        if (timedOut) {
          throw FastLottieNetworkException(
            originalUri,
            'Timed out waiting for response $timeoutPhase',
            statusCode: status,
          );
        }
        if (chunk.done) {
          streamDone = true;
          break;
        }
        final value = chunk.value;
        if (value == null) continue;
        final slice = (value as JSUint8Array).toDart;
        total += slice.length;
        if (total > maximumBytes) {
          controller.abort();
          throw FastLottieNetworkException(
            originalUri,
            'Downloaded payload exceeds $maximumBytes bytes',
            statusCode: status,
          );
        }
        builder.add(slice);
      }
      bytes = builder.takeBytes();
    } else {
      resetTimeout('data');
      final buffer = await response.arrayBuffer().toDart;
      if (aborted || cancelToken.isCancelled) {
        throw const FastLottieNetworkCancelledException();
      }
      if (timedOut) {
        throw FastLottieNetworkException(
          originalUri,
          'Timed out waiting for response $timeoutPhase',
          statusCode: status,
        );
      }
      bytes = buffer.toDart.asUint8List();
      if (bytes.length > maximumBytes) {
        throw FastLottieNetworkException(
          originalUri,
          'Downloaded payload exceeds $maximumBytes bytes',
          statusCode: status,
        );
      }
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
    if (timedOut) {
      throw FastLottieNetworkException(
        originalUri,
        'Timed out waiting for response $timeoutPhase',
        statusCode: statusCode,
      );
    }
    throw FastLottieNetworkException(
      originalUri,
      error.toString(),
      statusCode: statusCode,
    );
  } finally {
    timeoutTimer?.cancel();
    cancelToken.removeCancelListener(onCancel);
    if (reader != null && !streamDone) {
      try {
        unawaited(reader.cancel().toDart.catchError((Object _) => null));
      } catch (_) {}
    }
  }
}

Future<void> _cancelBody(web.ReadableStream? body) async {
  if (body == null) return;
  try {
    await body.cancel().toDart;
  } catch (_) {}
}

Future<void> platformCacheNetworkBytes(
  Uri uri,
  Uint8List bytes, {
  required String directoryPath,
  Map<String, String>? headers,
  int maximumCacheBytes = defaultMaximumNetworkDiskBytes,
  FastLottieCancelToken? cancelToken,
}) async {}

Future<void> platformClearNetworkCacheDirectory(String directoryPath) async {}
