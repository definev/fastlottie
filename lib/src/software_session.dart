part of '../fastlottie.dart';

/// Experimental trusted cache/build data; not a public interchange format.
@visibleForTesting
Uint8List debugEncodeCompiledComposition(
  FastLottieComposition composition, {
  int sourceBytes = 0,
}) => composition._template.snapshot(composition.contentKey, sourceBytes);

/// Restores fresh playback state while retaining immutable samples as views.
/// The caller gives up ownership of [bytes] and must not mutate it afterward.
@visibleForTesting
({FastLottieComposition composition, int sourceBytes})
debugDecodeCompiledComposition(
  Uint8List bytes, {
  bool directPlayback = false,
  bool deferPlayback = false,
}) {
  final data = deferPlayback
      ? RasterScene.deferSnapshot(bytes)
      : RasterScene.restoreSnapshot(bytes, warm: directPlayback);
  final scene = data.scene;
  return (
    composition:
        FastLottieComposition._(
            scene.width,
            scene.height,
            scene.start,
            scene.end,
            scene.fps,
            directPlayback && !deferPlayback
                ? scene.snapshotTemplate(bytes, data.key, data.sourceBytes)
                : scene,
            scene.options,
            scene.isStatic,
            null,
          )
          .._contentKey = data.key
          .._preparedScene = deferPlayback
              ? scene.fork()
              : directPlayback
              ? scene
              : null,
    sourceBytes: data.sourceBytes,
  );
}

/// A detached compiled scene for experimental raster benchmarks.
@visibleForTesting
RasterScene debugForkRasterScene(FastLottieComposition composition) =>
    composition._template.fork(warm: true);

/// Takes the prepared scene, if still available, for a single raster owner.
/// A later player can still fork its own state from the immutable template.
@visibleForTesting
RasterScene? debugTakePreparedRasterScene(FastLottieComposition composition) {
  final prepared = composition._preparedScene;
  composition._preparedScene = null;
  return prepared;
}

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
    bool borrowGeometry = false,
    bool nativeStroke = false,
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
           ? composition._takeScene()
           : composition._template.fork(),
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
  int get borrowedCoverageDraws => _ws.borrowedCoverageDraws;
  int get copiedCoverageDraws => _ws.copiedCoverageDraws;

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
