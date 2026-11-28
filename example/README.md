# FastLottie Examples

Practical, copy-paste-ready Flutter examples for loading, controlling, sharing, and optimizing 2D Lottie (`.json`) and Telegram sticker (`.tgs`) animations with `fastlottie`.

## Setup

Add `fastlottie` to your `pubspec.yaml` and declare any local animations you want to bundle:

```yaml
dependencies:
  flutter:
    sdk: flutter
  fastlottie: ^1.0.0

flutter:
  assets:
    - assets/animation.json
    - assets/sticker.tgs
```

---

## 1. Minimal App (Asset)

Load and loop a local `.json` or `.tgs` asset with placeholder and retryable error handling:

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: MinimalExample()));

class MinimalExample extends StatelessWidget {
  const MinimalExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: FastLottie.asset(
          'assets/animation.json',
          width: 160,
          height: 160,
          placeholderBuilder: (context) => const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          errorBuilder: (context, error, retry) => TextButton(
            onPressed: retry,
            child: Text(
              error is UnsupportedLottieException
                  ? 'Unsupported Lottie feature at ${error.jsonPath}'
                  : 'Failed to load — tap to retry',
            ),
          ),
        ),
      ),
    );
  }
}
```

---

## 2. Loading from Network or Bytes

`FastLottie.network` automatically cancels in-flight HTTP(S) downloads if the widget unmounts or its `uri` changes. `FastLottie.bytes` decodes raw JSON or gzip-compressed TGS bytes off the UI isolate on native platforms.

```dart
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart';

class NetworkAndBytesExample extends StatelessWidget {
  const NetworkAndBytesExample({
    super.key,
    required this.stickerBytes,
    this.cacheDirectoryPath,
  });

  /// Equal byte contents reuse the existing decoded composition across rebuilds.
  final Uint8List stickerBytes;

  /// Optional local directory path for bounded LRU caching of raw downloaded bytes on native.
  final String? cacheDirectoryPath;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        FastLottie.network(
          Uri.parse('https://example.com/sticker.tgs'),
          width: 128,
          height: 128,
          sourceCacheDirectory: cacheDirectoryPath,
          placeholderBuilder: (context) => const Icon(Icons.downloading),
          errorBuilder: (context, error, retry) => IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: retry,
          ),
        ),
        const SizedBox(width: 24),
        FastLottie.bytes(
          stickerBytes,
          width: 128,
          height: 128,
        ),
      ],
    );
  }
}
```

> `FastLottie.network` works out of the box on both native platforms (`dart:io` + bounded `.flbin` LRU) and Flutter Web (`fetch` + `AbortController`), coalescing concurrent requests for the same URL. Pass a custom `loader` (`FastLottieNetworkByteLoader`) if you need custom HTTP middleware.

---

## 3. Playback Controls & Timeline Scrubbing

Load a `FastLottieComposition` once in `initState`, then drive playback with a standard Flutter `AnimationController` for play/pause, replay, and manual scrubbing:

```dart
import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart';

class ControlledAnimationExample extends StatefulWidget {
  const ControlledAnimationExample({super.key});

  @override
  State<ControlledAnimationExample> createState() =>
      _ControlledAnimationExampleState();
}

class _ControlledAnimationExampleState extends State<ControlledAnimationExample>
    with SingleTickerProviderStateMixin {
  FastLottieComposition? _composition;
  AnimationController? _controller;
  Object? _error;

  @override
  void initState() {
    super.initState();
    unawaited(_load());
  }

  Future<void> _load() async {
    try {
      final composition = await FastLottieComposition.loadAsset(
        'assets/animation.json',
      );
      if (!mounted) return;
      final duration = composition.duration > Duration.zero
          ? composition.duration
          : const Duration(seconds: 1);
      final controller = AnimationController(vsync: this, duration: duration)
        ..repeat();
      setState(() {
        _composition = composition;
        _controller = controller;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error);
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) return Center(child: Text('Error: $_error'));
    final composition = _composition;
    final controller = _controller;
    if (composition == null || controller == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        FastLottie(
          composition: composition,
          controller: controller,
          width: 200,
          height: 200,
        ),
        AnimatedBuilder(
          animation: controller,
          builder: (context, _) => Slider(
            value: controller.value,
            onChanged: (value) {
              controller.stop();
              controller.value = value;
            },
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {
                if (controller.isAnimating) {
                  controller.stop();
                } else {
                  unawaited(controller.repeat());
                }
              },
              child: const Text('Play / Pause'),
            ),
            const SizedBox(width: 12),
            OutlinedButton(
              onPressed: () {
                unawaited(controller.forward(from: 0));
              },
              child: const Text('Play Once'),
            ),
          ],
        ),
      ],
    );
  }
}
```

---

## 4. Dense Sticker Grid (Shared Composition & Custom Raster Cache)

When displaying many animations at once (such as a sticker picker or reaction tray), compile each composition once outside `build()` and share a tuned `FastLottieRasterCache`. Identical stickers automatically share rendered strips and GPU textures:

```dart
import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart';

class StickerGridExample extends StatefulWidget {
  const StickerGridExample({super.key, this.diskCachePath});

  final String? diskCachePath;

  @override
  State<StickerGridExample> createState() => _StickerGridExampleState();
}

class _StickerGridExampleState extends State<StickerGridExample> {
  late final FastLottieRasterCache _thumbnails = FastLottieRasterCache(
    maximumBytes: 32 * 1024 * 1024, // 32 MiB GPU texture budget
    resolutionScale: 0.75,          // Scale down physical pixels for thumbnails
    maximumFrameRate: 30,           // Cap sampling rate without slowing playback
    framesPerStrip: null,           // Adaptive Mini-Strip size
    diskCacheDirectory: widget.diskCachePath,
  );

  FastLottieComposition? _sticker;

  @override
  void initState() {
    super.initState();
    unawaited(_loadSticker());
  }

  Future<void> _loadSticker() async {
    final composition = await FastLottieComposition.loadAsset(
      'assets/sticker.tgs',
    );
    if (!mounted) return;
    setState(() => _sticker = composition);
  }

  @override
  void dispose() {
    _thumbnails.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sticker = _sticker;
    if (sticker == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
      ),
      itemCount: 24,
      itemBuilder: (context, index) => FastLottie(
        composition: sticker,
        width: 80,
        height: 80,
        rasterCache: _thumbnails,
        // Use FastLottieRasterMode.poster to render only frame 0 on the same cache key.
        rasterMode: FastLottieRasterMode.animation,
      ),
    );
  }
}
```

---

## 5. Pausing Off-Screen Animations (`FastLottiePlaybackScope`)

In scrollable lists, tabs, or chat feeds, let the owning viewport inform descendants whether they are visible, near the viewport, or off-screen:

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';

class VisibilityAwareSticker extends StatelessWidget {
  const VisibilityAwareSticker({
    super.key,
    required this.composition,
    required this.isVisible,
    required this.isNearViewport,
  });

  final FastLottieComposition composition;
  final bool isVisible;
  final bool isNearViewport;

  @override
  Widget build(BuildContext context) {
    final playback = isVisible
        ? FastLottiePlayback.active
        : isNearViewport
            ? FastLottiePlayback.prewarm // Displays frame-0 poster, pauses ticker
            : FastLottiePlayback.hidden; // Preserves layout, releases cache lease

    return FastLottiePlaybackScope(
      playback: playback,
      child: FastLottie(
        composition: composition,
        width: 140,
        height: 140,
      ),
    );
  }
}
```

---

## 6. Vector Mode, Full-Loop Prewarming & Direct `Canvas`

### Vector Playback with Shared `FastLottiePictureCache`

Disable the raster pipeline when you want resolution-independent vector output or smooth subframes (`useFrameRate: false`):

```dart
// Create once in state and call `pictureCache.dispose()` when finished.
final pictureCache = FastLottiePictureCache();

FastLottie(
  composition: composition,
  width: 240,
  height: 240,
  usePipeline: false,
  useFrameRate: true, // Set false for subframe interpolation
  pictureCache: pictureCache,
);
```

### Full-Loop Raster Prewarming (`FastLottiePlayer` + `FastLottieView`)

For short looping hero animations where you want the lowest possible per-frame draw cost, pre-render every frame upfront and display the player with `FastLottieView`:

```dart
import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart';

class PrewarmedLoopExample extends StatefulWidget {
  const PrewarmedLoopExample({super.key, required this.composition});

  final FastLottieComposition composition;

  @override
  State<PrewarmedLoopExample> createState() => _PrewarmedLoopExampleState();
}

class _PrewarmedLoopExampleState extends State<PrewarmedLoopExample>
    with SingleTickerProviderStateMixin {
  late final FastLottiePlayer _player = FastLottiePlayer(widget.composition);
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.composition.duration > Duration.zero
        ? widget.composition.duration
        : const Duration(seconds: 1),
  )..repeat();

  double? _preparedDpr;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final dpr = MediaQuery.devicePixelRatioOf(context);
    if (_preparedDpr != dpr) {
      _preparedDpr = dpr;
      unawaited(_prepare(dpr));
    }
  }

  Future<void> _prepare(double dpr) async {
    try {
      await _player.prepareRaster(
        width: 160,
        height: 160,
        devicePixelRatio: dpr,
        maximumBytes: 32 * 1024 * 1024,
        fitBudget: true, // Scales down safely if 3x DPR would exceed the budget
      );
    } on StateError {
      // Cancelled because the widget was disposed or DPR changed mid-prepare.
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FastLottieView(
      player: _player,
      progress: _controller,
      width: 160,
      height: 160,
    );
  }
}
```

### Direct `Canvas` Painting

Draw directly inside your own `CustomPainter` (for game loops, overlays, or custom compositing):

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/rendering.dart';

class CustomLottiePainter extends CustomPainter {
  CustomLottiePainter({
    required this.player,
    required this.progress,
    required this.devicePixelRatio,
  });

  final FastLottiePlayer player;
  final double progress;
  final double devicePixelRatio;

  @override
  void paint(Canvas canvas, Size size) {
    player.draw(
      canvas,
      Offset.zero & size,
      progress,
      fit: BoxFit.contain,
      devicePixelRatio: devicePixelRatio,
    );
  }

  @override
  bool shouldRepaint(CustomLottiePainter oldDelegate) =>
      oldDelegate.player != player ||
      oldDelegate.progress != progress ||
      oldDelegate.devicePixelRatio != devicePixelRatio;
}
```

---

## 7. App Startup Configuration (Disk Cache & Web Wasm)

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Optional (native): enable persistent .flcache disk storage for the default pipeline.
  // Obtain a writable cache path (for example via path_provider) before setting it:
  // FastLottieRasterCache.defaultDiskDirectory = cacheDir.path;

  // Optional (Flutter Web JS builds): load standalone C Wasm kernels for main-thread
  // software rendering. Dedicated Web Workers load Wasm automatically.
  await ensureSimdReady();

  runApp(const MyApp());
}
```

---

## Further Reading

- [Package README](../README.md) — Overview, benchmarks, and API summary
- [Supported Features](../doc/supported-ops.md) — Complete Lottie / TGS operator support matrix
- [Architecture](../doc/architecture.md) — Compile-once pipeline, Mini-Strips, and `.flcache` internals
- [Shared Raster Cache & LoD](../doc/lod-cache.md) — Budgets, `resolutionScale`, and `maximumFrameRate`
- [Full-Loop Raster Preparation & DPR](../doc/dpr-raster.md) — Memory calculation for `prepareRaster`
- [Playback Tuning & Visibility](../doc/playback-experiments.md) — Progressive startup, deduplication, and `FastLottiePlaybackScope`
