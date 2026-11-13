import 'package:meta/meta.dart';

/// A feature outside fastlottie's supported subset, with its JSON location.
class UnsupportedLottieException extends FormatException {
  UnsupportedLottieException(this.jsonPath, String feature)
    : super('$feature at $jsonPath');
  final String jsonPath;
}

/// Compile-time controls. SIMD is opt-out.
@immutable
class FastLottieOptions {
  const FastLottieOptions({this.useSimd = true});
  final bool useSimd;
}
