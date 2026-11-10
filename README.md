# fastlottie

A small Lottie/TGS renderer for Flutter, optimized for repeated 2D shape animations.
Compiles properties and geometry once, retains static paths, and uses bounded
picture caching. Explicit raster prewarming offers cheaper repeated playback at
the cost of startup work and memory.

This package supports a deliberate subset of Lottie. Unsupported features throw
`UnsupportedLottieException` with their JSON path. See [supported ops](docs/supported-ops.md).

For a mobile sticker grid, opt into the shared raster/LoD cache rather than
replaying every vector on every loop. The example defaults to LoD on Android/iOS:
all visible stickers retain source FPS, thumbnails use a lower pixel resolution,
with a minimal renderer selector and grid UI. See [Android measurements](docs/android-performance.md).

```dart
import 'package:fastlottie/fastlottie.dart';

// Load once, outside build(). Declare the JSON or .tgs in your app's assets.
final composition = await FastLottieComposition.loadAsset('assets/sticker.tgs');

// Autoplay at the composition FPS. Optionally provide an Animation<double>.
FastLottie(composition: composition, width: 128, height: 128);
```

For the lowest repeated playback cost, pre-render at the actual pixel resolution:

```dart
final player = FastLottiePlayer(composition, cache: FastLottieCache.none);
final dpr = MediaQuery.devicePixelRatioOf(context);
await player.prepareRaster(
  width: 128, // Logical size, matching the widget below.
  height: 128,
  devicePixelRatio: dpr,
  maximumBytes: 64 * 1024 * 1024,
);

FastLottieView(player: player, progress: animationController,
  width: 128, height: 128);
// Owner must dispose player and animationController when removed.
```

A 60-frame cache displayed at 256×256 logical pixels needs 15 MiB of RGBA at
DPR 1, or 60 MiB at DPR 2, plus engine overhead. Physical dimensions are rounded
up; `player.rasterSize` reports the allocated pixel resolution. Prepare outside
`build` (e.g. from `didChangeDependencies` after obtaining the display size), and
prepare again when size or DPR changes. Omitting DPR preserves explicit physical
pixel calls with DPR 1.

Prewarming rejects allocations beyond the budget (32 MiB by default). The example
uses a 64 MiB budget and falls back to sharp picture rendering if the full-resolution
raster cache would exceed it. For long animations, use vector
rendering, or tune `FastLottieCache(maximumFrames: ..., maximumCommands: ...)`.
Subframe rendering uses `useFrameRate: false` and bypasses raster/frame insertion.

Low-level drawing is available through `FastLottiePlayer.draw(canvas, rect,
progress)`. Dispose the player when done. Each player owns its own render state.

```sh
flutter test
flutter analyze
cd example
flutter run -d macos
```

The example opens an infinite **4-column TGS grid** using the 94 bundled stickers.
It builds visible cells lazily and parses/compiles off the UI isolate in batches
of up to two files, with one worker at a time on mobile. A bounded publication
queue feeds UI independently. See [decoding notes](docs/tgs-decoding.md).
All 94 bundled stickers render directly with fastlottie. The renderer selector has
exactly two choices: `fastlottie` and `lottie`; parsing never switches engines on
failure. Raw LoD keeps every visible animation running while scrolling.
See [coverage and expression scope](docs/no-fallback.md).
Trim paths, animated dashes, alpha/luma mattes and closure-changing morphs follow
the local rlottie feature scope. See [implementation notes](docs/rlottie-features.md).
The gallery UI contains only the renderer selector and grid.

See [TGS pipeline, coverage and measurements](docs/tgs-grid.md).
`FastLottieComposition.fromBytes` detects gzip/TGS automatically;
`fromBytesAsync` and `loadAsset` move decoding/compilation off the UI isolate on native.
Players share immutable compiled data and fork their mutable render state instead
of compiling JSON again.
Release measurements, methodology and trade-offs are in
[docs/benchmarks.md](docs/benchmarks.md). Run the same harness with:

```sh
python3 tool/run_benchmark.py --device macos --output docs/benchmark-macos.json
# Or pass a connected Android device id via --device.
```

[Plan](docs/plan.md) · [Architecture and SIMD decisions](docs/architecture.md)
