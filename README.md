<p align="center">
  <img src="doc/logo.svg" alt="FastLottie logo" width="148" />
</p>

<h1 align="center">FastLottie</h1>

<p align="center">
  <strong>Faster than native — the Lottie renderer Flutter deserves</strong>
</p>

<p align="center">
  A high-performance 2D Lottie (<code>.json</code>) and Telegram sticker (<code>.tgs</code>) renderer for Flutter — powered by a compile-once UTF-8 byte parser, off-UI C/Wasm software rasterization, LZ4 strip caching, and zero PlatformView overhead.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#performance-at-a-glance">Benchmarks</a> ·
  <a href="#usage-guide">Usage Guide</a> ·
  <a href="doc/supported-ops.md">Supported Features</a> ·
  <a href="doc/architecture.md">Architecture</a>
</p>

---

## Why FastLottie?

Most Lottie players re-evaluate vector trees on the UI thread or wrap native views with heavy PlatformView overhead. **FastLottie** takes a different approach:

- **Compile once, off the UI thread** — Parses `.json` and gzip-compressed `.tgs` directly from UTF-8 bytes into an immutable columnar `TypedData` scene graph with `Float32x4` SIMD interpolation. Multiple widgets share one compiled composition without re-parsing.
- **Off-UI C / Wasm raster pipeline** — Persistent background isolates (with C/NEON/SSE2 kernels via Dart Native Assets) and Web Workers (with bundled C Wasm kernels) rasterize frames into double-buffered **Mini-Strips**. The Flutter UI thread only draws a cached texture (`canvas.drawImageRect`).
- **Automatic deduplication & bounded memory** — Identical animations share raster buffers and GPU textures automatically. Frames are compressed with LZ4 + 16×16 tile deduplication in bounded RAM and optional `.flcache` disk storage, and duplicate GPU uploads are skipped using a 64-bit content fingerprint with zero host pixel RAM.
- **Zero PlatformView tax** — Renders directly into Flutter's own compositing pipeline at 90–120 Hz. No `AndroidView`, no `UiKitView`, no extra native setup.
- **Coalesced playback & accessibility** — Repeating `FastLottie` widgets share a single vsync `Ticker`, skip redundant repaints on high-refresh displays, and respect system reduced-motion settings automatically.
- **Fail-fast diagnostics** — Features outside the supported 2D subset throw `UnsupportedLottieException` with the exact JSON path instead of silently misrendering.

### Performance at a Glance

Release-build head-to-head measurements against native platform players:

| Workload | FastLottie (Flutter) | Native / Alternative Baseline | Result |
| :--- | :--- | :--- | :--- |
| **16 unique stickers @ 90 Hz** *(Pixel 7a, 11.11 ms budget)* | **1.38 ms** med · 2.30 ms p95 · **0.0% jank** *(prewarm)* · **249.5 MiB** PSS | `dotlottie-android 0.18.0` (C++): 12.4 ms med, 62.9% jank<br>`lottie-android 6.7.1` (Kotlin HW): 25.6 ms med, 100% jank, 373.7 MiB PSS<br>`lottie_native` (PlatformView): 537.7 MiB PSS | **6×–18× faster frames**, lighter than pure Kotlin (incl. Flutter engine) |
| **24× shared sticker @ 120 Hz** *(Apple M5)* | **209 MiB** RAM · **13.6% CPU** · **0.0% jank** | `lottie-ios 4.6.1` (Swift `.automatic` fallback): 3.27 GiB RAM, 72.2% CPU, 56.7% jank | **15× less RAM**, **5× lower CPU** |
| **24× shared sticker cold load** *(Pixel 7a)* | **25.7 ms** | `dotlottie-android 0.18.0` (C++): 668.3 ms | **26× faster cold load** |
| **UTF-8 parse & compile** *(ARM64 release)* | **43 µs – 12.1 ms** *(Pixel 7a)*<br>**537 µs – 6.5 ms** *(Apple M5)* | `lottie-android 6.7.1` (Kotlin): 751 µs – 35.9 ms<br>`lottie-ios 4.6.1` (Swift): 5.5 ms – 32.0 ms | **2×–17.5× faster** vs Kotlin<br>**4.2×–10.3× faster** vs Swift |

---

## Quick Start

### 1. Add the dependency

```sh
flutter pub add fastlottie
```

Or add it directly to your `pubspec.yaml`:

```yaml
dependencies:
  fastlottie: ^1.0.0
```

### 2. Declare your animation assets

Both standard Lottie `.json` and Telegram gzip-compressed `.tgs` files work out of the box:

```yaml
flutter:
  assets:
    - assets/sticker.tgs
    - assets/animation.json
```

### 3. Render in one line

```dart
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';

class StickerExample extends StatelessWidget {
  const StickerExample({super.key});

  @override
  Widget build(BuildContext context) {
    return FastLottie.asset(
      'assets/sticker.tgs',
      width: 128,
      height: 128,
    );
  }
}
```

That's all you need. `FastLottie.asset` loads and compiles the file off the UI isolate on native platforms, autoplays in a loop, and uses the shared off-UI raster pipeline by default.

---

## Usage Guide

### 1. Loading from Assets, Bytes, or Network

Use the built-in loading widgets for single animations. All three share the same playback and layout parameters, plus `placeholderBuilder` and `errorBuilder`:

```dart
// From a Flutter asset (uses DefaultAssetBundle unless `bundle` is provided)
FastLottie.asset(
  'assets/animation.json',
  width: 160,
  height: 160,
  placeholderBuilder: (context) => const SizedBox.shrink(),
  errorBuilder: (context, error, retry) => GestureDetector(
    onTap: retry,
    child: const Text('Failed to load — tap to retry'),
  ),
);

// From in-memory JSON or TGS bytes (treat the list as immutable; pass a new list to reload)
FastLottie.bytes(
  stickerBytes,
  width: 128,
  height: 128,
);

// From an HTTP(S) URL (cancels in-flight downloads automatically on dispose or URI change)
FastLottie.network(
  Uri.parse('https://example.com/sticker.tgs'),
  width: 128,
  height: 128,
  sourceCacheDirectory: rawCacheDir.path, // Optional raw download cache on native
  placeholderBuilder: (context) => const SizedBox.shrink(),
  errorBuilder: (context, error, retry) => GestureDetector(
    onTap: retry,
    child: const Text('Retry'),
  ),
);
```

> **Note on network loading:** Direct HTTP(S) fetching works out of the box on native platforms (`dart:io`). On Flutter Web, pass a custom `loader` callback (`FastLottieNetworkByteLoader`). Loading results that arrive after a widget is disposed or its source changes are automatically ignored.

### 2. Controlling Playback

`FastLottie` autoplays and loops by default (`animate: true`, `repeat: true`), and pauses automatically at frame 0 when the user enables reduced motion (`MediaQuery.disableAnimationsOf(context)`).

- Play once: `repeat: false`
- Display static frame 0: `animate: false`
- Control layout: `fit: BoxFit.contain`, `alignment: Alignment.center`
- Drive progress yourself: pass any `Animation<double>` (such as an `AnimationController`) to `controller`:

```dart
class ControlledSticker extends StatefulWidget {
  const ControlledSticker({super.key, required this.composition});

  final FastLottieComposition composition;

  @override
  State<ControlledSticker> createState() => _ControlledStickerState();
}

class _ControlledStickerState extends State<ControlledSticker>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.composition.duration,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _controller.forward(from: 0),
      child: FastLottie(
        composition: widget.composition,
        controller: _controller,
        width: 160,
        height: 160,
      ),
    );
  }
}
```

### 3. Sharing One Composition Across Multiple Widgets

When the same animation appears multiple times on screen (chat reactions, sticker packs, repeated icons), compile it **once** outside `build()` and pass the shared `FastLottieComposition` to each widget:

```dart
// Load and compile once (runs off the UI isolate on native platforms)
final composition = await FastLottieComposition.loadAsset('assets/sticker.tgs');
// Or from bytes / network:
// final composition = await FastLottieComposition.fromBytesAsync(bytes);
// final composition = await FastLottieComposition.loadNetwork(uri);

// Reuse freely across as many widgets as you want — zero re-parsing, shared raster cache
Row(
  children: [
    FastLottie(composition: composition, width: 96, height: 96),
    FastLottie(composition: composition, width: 96, height: 96),
    FastLottie(composition: composition, width: 96, height: 96),
  ],
);
```

### 4. Tuning the Shared Raster Cache (Grids, Thumbnails & Disk Cache)

By default, widgets share an internal double-buffered raster cache (`32 MiB` GPU budget, adaptive strip sizing, progressive first-frame startup, and 64-bit fingerprint upload deduplication).

To enable persistent `.flcache` disk caching for the default pipeline, set the directory once at startup:

```dart
FastLottieRasterCache.defaultDiskDirectory = cacheDirectory.path;
```

To customize the memory budget, resolution, frame rate, or strip size for a specific section of your app (such as a dense thumbnail picker), create your own `FastLottieRasterCache` in the owning state and **dispose it** when no longer used:

```dart
// Create once in the owner and call `thumbnails.dispose()` in `dispose()`.
final thumbnails = FastLottieRasterCache(
  maximumBytes: 32 * 1024 * 1024,    // GPU texture budget (default: 32 MiB)
  resolutionScale: 0.5,               // Half width & height (1/4 pixels)
  maximumFrameRate: 30,               // Cap sample rate without slowing playback
  framesPerStrip: null,               // null = adaptive, 1 = single frame, 4 = 4-frame strips
  diskCacheDirectory: cacheDir.path,  // Optional persistent .flcache directory
);

FastLottie(
  composition: composition,
  width: 64,
  height: 64,
  rasterCache: thumbnails,
  // Use `FastLottieRasterMode.poster` to show only frame 0 using the same cache key.
  rasterMode: FastLottieRasterMode.animation,
);
```

### 5. Pausing Off-Screen Animations (`FastLottiePlaybackScope`)

In scrollable feeds, tabs, or sticker pickers, wrap items in `FastLottiePlaybackScope` to control playback without per-tick `RenderBox` layout polling:

```dart
FastLottiePlaybackScope(
  playback: isVisible
      ? FastLottiePlayback.active
      : isNearViewport
          ? FastLottiePlayback.prewarm // Paints a frame-0 poster, pauses ticker
          : FastLottiePlayback.hidden, // Keeps layout size, releases cache lease
  child: FastLottie(
    composition: composition,
    width: 128,
    height: 128,
  ),
);
```

### 6. Choosing a Rendering Mode (Raster vs. Vector vs. Direct Canvas)

FastLottie offers three rendering tiers depending on your workload:

| Mode | How to Enable | Best For |
| :--- | :--- | :--- |
| **Shared Raster Pipeline** *(Default)* | `usePipeline: true` | Chat feeds, sticker grids, and multiple simultaneous animations with bounded VRAM. |
| **Vector Playback** | `usePipeline: false` *(optional `pictureCache: FastLottiePictureCache()`)* | Crisp arbitrary scaling, ultra-sharp hero animations, or subframe scrubbing (`useFrameRate: false`). |
| **Full-Loop Prewarm / Direct Canvas** | `FastLottiePlayer` + `prepareRaster(...)` or `player.draw(...)` | Short loops needing minimal draw overhead, or custom `CustomPainter` integration. |

**Vector mode with shared picture cache:**

```dart
// Reuse recorded ui.Picture display lists across scroll lifecycles (dispose when done).
final pictureCache = FastLottiePictureCache();

FastLottie(
  composition: composition,
  width: 240,
  height: 240,
  usePipeline: false,
  pictureCache: pictureCache,
);
```

**Direct `Canvas` drawing & full-loop raster prewarming:**

```dart
final player = FastLottiePlayer(composition);

// Option A: Draw directly inside a CustomPainter
player.draw(canvas, rect, progress, devicePixelRatio: dpr);

// Option B: Pre-render every frame of a short loop upfront, then display with FastLottieView
await player.prepareRaster(
  width: 128,
  height: 128,
  devicePixelRatio: MediaQuery.devicePixelRatioOf(context),
);
// Display: FastLottieView(player: player, progress: controller, width: 128, height: 128)

// Always dispose caller-owned players when finished
player.dispose();
```

### 7. Flutter Web Support

On Web, `FastLottieRasterCache` automatically starts dedicated Web Workers (**2** workers when the browser reports ≥ 4 logical cores, otherwise **1**; override with `workerCount: 1`). Each worker maintains its own compiled scenes and share of the LZ4 budget, runs the bundled standalone C Wasm kernels when available, and transfers completed pixel strips back to Flutter.

- Serve the worker script from the **same origin** as your app; if Web Workers are unavailable, raster jobs fall back inline automatically.
- For direct main-thread software rendering in JavaScript builds, call `await ensureSimdReady();` after `WidgetsFlutterBinding.ensureInitialized()` to load the C Wasm kernels. Flutter `--wasm` keeps inline rasterization in Dart memory by default (pass `enableOnDartWasm: true` only to opt in; browser worker acceleration works independently).

---

## Supported Lottie Features & Error Handling

FastLottie supports a comprehensive 2D Lottie & Telegram TGS subset:

- **Layers:** Shape, null, solid, precomp (with start offset, stretch, and animated time remapping), parenting, 17 layer blend modes, alpha/luma track mattes (normal & inverted), and layer masks (Add, Subtract, Intersect, Difference, inverted, opacity, expansion).
- **Shapes & Modifiers:** Cubic Bézier paths (with morphing), rectangles, ellipses, stars/polygons, nested groups, simultaneous & individual trim paths, and boolean merge paths.
- **Paint & Effects:** Solid fills/strokes, linear & radial gradients (with animated stops & focal points), animated stroke dashes, sharp Inner Shadow, `ADBE Fill`, `ADBE Set Matte3`, `ADBE Layer Control`, and compiled property/path expressions.

Out-of-scope features (such as text/fonts, embedded raster images, 3D layers, repeaters, and arbitrary JavaScript expressions) fail fast with `UnsupportedLottieException` so you can catch them explicitly:

```dart
try {
  final composition = await FastLottieComposition.loadAsset('assets/anim.json');
} on UnsupportedLottieException catch (e) {
  debugPrint('Unsupported feature (${e.jsonPath}): ${e.message}');
}
```

See [Supported Features](doc/supported-ops.md) for the complete specification.

---

## Documentation

- [Architecture](doc/architecture.md) — End-to-end pipeline, worker sharding, Mini-Strips, and `.flcache` format
- [Supported Features](doc/supported-ops.md) — Complete list of supported Lottie / TGS operators and constraints
- [Shared Raster Cache & LoD](doc/lod-cache.md) — Memory budgets, `resolutionScale`, and `maximumFrameRate`
- [Full-Loop Raster Preparation & DPR](doc/dpr-raster.md) — Memory math and usage guide for `prepareRaster`
- [Playback Tuning & Visibility](doc/playback-experiments.md) — Progressive startup, 64-bit upload deduplication, and `FastLottiePlaybackScope`
- [Native Raster & Warm Playback](doc/native-playback.md) — Native C/SIMD kernels and 16×16 tile playback
- [Data Layout & SIMD](doc/data-layout.md) — Columnar `TypedData` tracks and `Float32x4` interpolation
- [Minimal Example](example/README.md) — Smallest runnable Flutter integration

## Development

Run static analysis and tests from the package root:

```sh
flutter analyze
flutter test
```

## License

Licensed under the [Apache License 2.0](LICENSE).
