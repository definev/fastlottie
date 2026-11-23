/// A small Lottie renderer with compiled geometry and bounded caches.
library;

export 'decoding.dart';
export 'src/flutter/composition.dart'
    show
        FastLottieComposition,
        debugDecodeCompiledComposition,
        debugEncodeCompiledComposition,
        debugForkRasterScene,
        debugTakePreparedRasterScene;
export 'src/flutter/player.dart'
    show
        FastLottieCache,
        FastLottieFallbackPainter,
        FastLottiePlayer,
        FastLottieRasterCache,
        FastLottieRasterMode;
export 'src/flutter/software_session.dart'
    show FastLottieSoftwareSession, debugRenderSoftwareFrame;
export 'src/flutter/widget.dart'
    show
        FastLottie,
        FastLottieAsset,
        FastLottieBytes,
        FastLottieErrorBuilder,
        FastLottieNetwork,
        FastLottiePlayback,
        FastLottiePlaybackScope,
        FastLottieView;
export 'src/network/network_types.dart';
export 'src/platform/simd_stub.dart'
    if (dart.library.ffi) 'src/platform/simd_io.dart'
    if (dart.library.js_interop) 'src/platform/simd_web.dart'
    show isSimdSupported, ensureSimdReady;
export 'src/scene/options.dart';
