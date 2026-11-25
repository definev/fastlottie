# FastLottie example

Add FastLottie to a Flutter app and declare an animation you own as an asset.

```yaml
flutter:
  assets:
    - assets/animation.json
```

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';

void main() {
  runApp(
    Directionality(
      textDirection: TextDirection.ltr,
      child: Center(
        child: FastLottie.asset('assets/animation.json', width: 160, height: 160),
      ),
    ),
  );
}
```

See the [package README](../README.md) for bytes, network loading, and shared
compositions.
