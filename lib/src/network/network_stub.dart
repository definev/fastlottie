import 'dart:typed_data';

import 'network_types.dart';

bool get isNetworkFetchSupported => false;

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
  if (cancelToken?.isCancelled ?? false) {
    return Future<FastLottieNetworkFetchResult>.error(
      const FastLottieNetworkCancelledException(),
    );
  }
  return Future<FastLottieNetworkFetchResult>.error(
    UnsupportedError(
      'Direct network loading requires dart:io, Flutter Web, or a custom network loader.',
    ),
  );
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
