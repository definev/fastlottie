/// Internal testing and benchmark utilities for `fastlottie`.
///
/// These symbols are not part of the stable public rendering API exported by
/// `package:fastlottie/fastlottie.dart`.
library;

export 'src/flutter/composition.dart'
    show
        debugDecodeCompiledComposition,
        debugEncodeCompiledComposition,
        debugForkRasterScene,
        debugTakePreparedRasterScene;
export 'src/flutter/software_session.dart'
    show FastLottieSoftwareSession, debugRenderSoftwareFrame;
