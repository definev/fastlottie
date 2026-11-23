import 'package:native_toolchain_c/native_toolchain_c.dart';

const cSources = ['native/fastlottie_coverage.c', 'native/fastlottie_simd.c'];

/// Central C library specification for fastlottie software raster and blend kernels.
/// Cache and geometry leaf calls are outside the Wasm source list.
final cLibrary = CLibrary(
  name: 'fastlottie_simd',
  assetName: 'fastlottie_simd.dart',
  sources: [
    ...cSources,
    'native/fastlottie_cache.c',
    'native/fastlottie_geometry.c',
  ],
  optimizationLevel: OptimizationLevel.o3,
);
