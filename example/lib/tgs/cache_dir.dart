import 'package:fastlottie/fastlottie.dart';

import 'cache_dir_stub.dart' if (dart.library.io) 'cache_dir_io.dart';

Future<void> ensureDefaultExampleDiskCache() async {
  final dir = await resolveExampleDiskCacheDirectory();
  if (dir != null) {
    FastLottieRasterCache.defaultDiskDirectory ??= dir;
  }
}

Future<void> attachExampleDiskCache(FastLottieRasterCache cache) async {
  final dir = await resolveExampleDiskCacheDirectory();
  if (dir != null) {
    cache.attachDiskDirectory(dir);
    FastLottieRasterCache.defaultDiskDirectory ??= dir;
  }
}

Future<String?> resolveUrlDiskCacheDirectory() =>
    resolveExampleUrlDiskCacheDirectory();

Future<void> clearExampleDiskCache() => clearExampleDiskCacheDirectory();

Future<void> clearExampleUrlDiskCache() => clearExampleUrlDiskCacheDirectory();
