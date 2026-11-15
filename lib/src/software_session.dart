part of '../fastlottie.dart';

/// A reusable session for software rasterization of [FastLottieComposition]
/// across frames without per-frame allocations.
@visibleForTesting
class FastLottieSoftwareSession {
  FastLottieSoftwareSession(
    FastLottieComposition composition, {
    required this.pixelWidth,
    required this.pixelHeight,
    bool preferNative = true,
    bool retainCoverage = true,
    bool fuseFillTransforms = defaultFuseFillTransforms,
  }) : _ws = RasterWorkspace(
         initialHeight: pixelHeight,
         preferNative: preferNative,
         retainCoverage: retainCoverage,
         fuseFillTransforms: fuseFillTransforms,
       ),
       _scene = composition._template.fork(),
       _pixelBuffer = NativePixelBuffer(pixelWidth * pixelHeight);

  final int pixelWidth;
  final int pixelHeight;
  final RasterWorkspace _ws;
  final RasterScene _scene;
  final NativePixelBuffer _pixelBuffer;

  /// Retained mask and draw coverage, including per-entry overhead estimates.
  int get retainedCoverageBytes => _ws.retainedCoverageBytes;

  /// Allocated temporary pixel planes, excluding the output and span buffers.
  int get scratchPixelBytes => _ws.scratchPixelBytes;

  int get fusedFillDraws => _ws.fusedFillDraws;

  Uint32List get pixels => _pixelBuffer.typedList;

  void dispose() {
    _ws.dispose();
    _pixelBuffer.dispose();
  }

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
