import 'network_types.dart';

bool get isNetworkFetchSupported => false;

Future<FastLottieNetworkFetchResult> platformFetchLottieBytes(
  Uri uri, {
  Map<String, String>? headers,
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
  int maximumBytes = 16 * 1024 * 1024,
}) {
  if (cancelToken?.isCancelled ?? false) {
    return Future<FastLottieNetworkFetchResult>.error(
      const FastLottieNetworkCancelledException(),
    );
  }
  return Future<FastLottieNetworkFetchResult>.error(
    UnsupportedError(
      'Direct network loading requires dart:io or a custom network loader.',
    ),
  );
}

Future<void> platformClearNetworkCacheDirectory(String directoryPath) async {}
