# fastlottie

Fastlottie renders a subset of 2D Lottie animations in Flutter from JSON or
Telegram's gzip-compressed TGS format. It compiles each composition once so
players can share the model and keep their own playback state. Unsupported
features throw `UnsupportedLottieException` with a JSON path. See the
[supported features](docs/supported-ops.md).

For a single animation, use the loading widgets directly. Declare asset files
in your app's `pubspec.yaml`:

```dart
FastLottie.asset('assets/sticker.tgs', width: 128, height: 128);
FastLottie.bytes(stickerBytes, width: 128, height: 128);
```

Asset, bytes, and network widgets accept the same playback and layout options,
plus `placeholderBuilder` and `errorBuilder`. The error builder receives
`(context, error, retry)`. Assets use the nearest `DefaultAssetBundle` unless
`bundle` is supplied. Keep byte lists immutable; supply a new list to reload.
Compilation runs off the UI isolate on native platforms. Loading results that
arrive after a source change or removal are ignored; network requests are also
cancelled.

When multiple players share an animation, load the composition once outside
`build()` and pass it to each player:

```dart
import 'package:fastlottie/fastlottie.dart';

final composition = await FastLottieComposition.loadAsset('assets/sticker.tgs');
final sticker = FastLottie(composition: composition, width: 128, height: 128);
```

`FastLottie` autoplays by default; pass an `Animation<double>` as `controller`
to drive progress yourself. `loadAsset` and `fromBytesAsync` decode and compile
on a worker isolate on native platforms. For HTTP(S) on native, use
`FastLottie.network(uri)`; it cancels in-flight downloads when the widget is
removed or the URI changes. Use `FastLottieComposition.loadNetwork(uri)` when
you need to reuse the compiled result.

The widget uses a shared double-buffered raster cache by default. Long animations
start with one sampled frame and switch to strips as playback advances. The
cache retains up to two images per animated entry. To control the budget,
thumbnail resolution, or sampling rate, pass a shared cache of your own:

```dart
// Create once in the owner and dispose the cache when no players use it.
final thumbnails = FastLottieRasterCache(
  maximumBytes: 32 * 1024 * 1024,
  resolutionScale: 0.5,
  maximumFrameRate: 30,
);
final thumbnail = FastLottie(
  composition: composition,
  width: 64,
  height: 64,
  rasterCache: thumbnails,
);
```

`framesPerStrip` controls the shared double-buffered pipeline: omit it (or use
`null`) for adaptive strips, set it to `1` for one frame per buffer, or set it to
`4` for strips of up to four frames. Each choice shares the same worker and
compressed-cache implementation.

Raster caches default to a 1 MiB host budget for skipping uploads of identical
frames or strips. See [playback tuning](docs/playback-experiments.md) for the
startup and deduplication settings, and how to provide visibility state.

Set `usePipeline: false` for vector playback with picture caching. For direct
canvas drawing, own a `FastLottiePlayer`, call `draw(canvas, rect, progress)`,
and dispose it when finished. See [cache options](docs/lod-cache.md) and
[full-loop raster preparation](docs/dpr-raster.md).

On web, raster caches start dedicated workers automatically: two on browsers
that report at least four logical processors, otherwise one. Each worker keeps
its own compiled scenes and share of the LZ4 budget, uses the standalone C Wasm
kernels when available, and transfers completed pixel strips back to Flutter.
Set `workerCount: 1` on the raster cache to use one browser worker. Serve the
worker script from the same origin as the app; when workers are unavailable,
raster jobs run inline. Native builds continue to use Dart isolates.

For direct software rendering on the main thread, `ensureSimdReady()` enables
the C Wasm kernels in JavaScript builds. Flutter `--wasm` keeps inline
rasterization in Dart by default. Use `enableOnDartWasm: true` only to opt into
the inline C kernel path. Worker acceleration is independent of this setting.

See the [package example](example/README.md) for a minimal Flutter integration.
Run `flutter analyze` and `flutter test` from the package root.

[Architecture](docs/architecture.md) · [Cache settings](docs/lod-cache.md)
