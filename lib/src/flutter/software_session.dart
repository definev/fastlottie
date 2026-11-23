import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart' show visibleForTesting;

import '../platform/simd_stub.dart'
    if (dart.library.ffi) '../platform/simd_io.dart'
    if (dart.library.js_interop) '../platform/simd_wasm.dart'
    show NativePixelBuffer;
import '../raster/raster_core.dart';
import 'composition.dart';

/// A reusable session for software rasterization of [FastLottieComposition]
/// across frames without per-frame allocations.
@visibleForTesting
class FastLottieSoftwareSession {
  /// Creates a reusable software raster workspace for the given dimensions.
  FastLottieSoftwareSession(
    FastLottieComposition composition, {
    required this.pixelWidth,
    required this.pixelHeight,
    bool preferNative = true,
    bool retainCoverage = true,
    bool fuseFillTransforms = defaultFuseFillTransforms,
    bool borrowGeometry = true,
    bool nativeStroke = true,
    bool usePreparedScene = false,
  }) : _ws = RasterWorkspace(
         initialHeight: pixelHeight,
         preferNative: preferNative,
         retainCoverage: retainCoverage,
         fuseFillTransforms: fuseFillTransforms,
         borrowGeometry: borrowGeometry,
         nativeStroke: nativeStroke,
       ),
       _scene = usePreparedScene
           ? composition.takeScene()
           : composition.sceneTemplate.fork(),
       _pixelBuffer = NativePixelBuffer(pixelWidth * pixelHeight);

  /// Width of the output buffer in pixels.
  final int pixelWidth;

  /// Height of the output buffer in pixels.
  final int pixelHeight;
  final RasterWorkspace _ws;
  final RasterScene _scene;
  final NativePixelBuffer _pixelBuffer;

  /// Retained mask and draw coverage, including per-entry overhead estimates.
  int get retainedCoverageBytes => _ws.retainedCoverageBytes;

  /// Allocated temporary pixel planes, excluding the output and span buffers.
  int get scratchPixelBytes => _ws.scratchPixelBytes;

  /// Number of fills using device-space path flattening.
  int get fusedFillDraws => _ws.fusedFillDraws;

  /// Number of native coverage calls borrowing geometry buffers.
  int get borrowedCoverageDraws => _ws.borrowedCoverageDraws;

  /// Number of native coverage calls copying geometry into scratch buffers.
  int get copiedCoverageDraws => _ws.copiedCoverageDraws;

  /// Number of solid draws fused into native rasterization.
  int get fusedNativeSolidDraws => _ws.fusedNativeSolidDraws;

  /// Number of mattes composited by a native kernel.
  int get nativeMatteComposites => _ws.nativeMatteComposites;

  /// Borrowed output buffer, valid until the session is disposed.
  Uint32List get pixels => _pixelBuffer.typedList;

  /// Releases the output buffer and raster workspace.
  void dispose() {
    _ws.dispose();
    _pixelBuffer.dispose();
  }

  /// Renders the source frame into [pixels], overwriting the previous result.
  Uint32List renderFrame(double frame) {
    renderSceneSoftware(
      _scene,
      frame,
      _pixelBuffer,
      pixelWidth,
      pixelHeight,
      _ws,
    );
    return _pixelBuffer.typedList;
  }
}

/// Renders a single [composition] [frame] using the software rasterizer
/// into a premultiplied BGRA8888 pixel buffer `[w * h * 4]`
/// compatible with [ui.PixelFormat.bgra8888].
@visibleForTesting
Uint8List debugRenderSoftwareFrame(
  FastLottieComposition composition,
  double frame, {
  required int pixelWidth,
  required int pixelHeight,
}) {
  final session = FastLottieSoftwareSession(
    composition,
    pixelWidth: pixelWidth,
    pixelHeight: pixelHeight,
  );
  try {
    session.renderFrame(frame);
    return Uint8List.fromList(Uint8List.sublistView(session.pixels));
  } finally {
    session.dispose();
  }
}
