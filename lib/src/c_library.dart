import 'package:native_toolchain_c/native_toolchain_c.dart';

/// Central C library specification for fastlottie software raster and blend kernels.
final cLibrary = CLibrary(
  name: 'fastlottie_simd',
  assetName: 'fastlottie_simd.dart',
  sources: ['native/fastlottie_simd.c', 'native/fastlottie_coverage.c'],
  optimizationLevel: OptimizationLevel.o3,
);
