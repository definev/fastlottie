import 'package:fastlottie/fastlottie.dart';

import 'network_server_types.dart';

Future<FastLottieNetworkFetchResult> Function(
  Uri uri, {
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
})?
get networkByteFetcher => null;

Future<TgsRemoteCatalog> loadBundledTgsCatalog() =>
    Future<TgsRemoteCatalog>.error(
      UnsupportedError('Bundled web catalog is only available in a browser'),
    );
