import 'dart:developer' as developer;

import 'package:flutter/services.dart';

import 'simd_wasm.dart';

export 'simd_wasm.dart' show isSimdSupported;

const generatedWasmAsset = 'packages/fastlottie/fastlottie_simd.wasm';
const bundledWasmAsset =
    'packages/fastlottie/lib/src/wasm/fastlottie_simd.wasm';

Future<void>? _wasmInitFuture;

/// Loads the optional Wasm raster kernels. Call after initializing Flutter's
/// binding, before creating raster caches, to use them from the first frame.
Future<void> ensureSimdReady({bool enableOnDartWasm = false}) async {
  // Dart2Wasm's typed lists in the C module's JS-backed heap cross the JS
  // boundary on element access. Keep the rasterizer in Dart memory by default.
  if (const bool.fromEnvironment('dart.tool.dart2wasm') && !enableOnDartWasm) {
    return;
  }
  return _wasmInitFuture ??= _initWasm();
}

Future<void> _initWasm() async {
  try {
    final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
    final asset = await rootBundle.load(
      manifest.listAssets().contains(generatedWasmAsset)
          ? generatedWasmAsset
          : bundledWasmAsset,
    );
    await initializeWasmKernels(Uint8List.sublistView(asset));
  } catch (error, stackTrace) {
    developer.log(
      'Could not initialize FastLottie Wasm; using the Dart renderer.',
      name: 'fastlottie',
      error: error,
      stackTrace: stackTrace,
    );
  }
}
