# fastlottie

Fastlottie renders a subset of 2D Lottie animations in Flutter from JSON or
Telegram's gzip-compressed TGS format. It compiles each composition once so
players can share the model and keep their own playback state. Unsupported
features throw `UnsupportedLottieException` with a JSON path. See the
[supported features](docs/supported-ops.md).

Load the composition once outside `build()`. Declare the file in your app's
`pubspec.yaml` assets.

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

The widget uses a shared ping-pong raster cache by default. It renders on demand
and retains up to two images per animated cache entry. To control the budget,
thumbnail resolution, or sampling rate, pass a shared cache of your own:

```dart
// Create once in the owner and dispose the cache when no players use it.
final thumbnails = FastLottieRasterCache.pingPong(
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

Set `usePipeline: false` for vector playback with picture caching. For direct
canvas drawing, own a `FastLottiePlayer`, call `draw(canvas, rect, progress)`,
and dispose it when finished. See [cache options](docs/lod-cache.md) and
[full-loop raster preparation](docs/dpr-raster.md).

On web, call `await ensureSimdReady()` after
`WidgetsFlutterBinding.ensureInitialized()` and before creating raster caches
to enable the Wasm software renderer. `isSimdSupported` reports whether it
loaded; the renderer falls back to Dart if the module cannot load. This works
with both JavaScript and `--wasm` Flutter web builds.

To run the Cupertino sticker chat:

```sh
cd example
flutter run -d macos
```

See the [example guide](example/README.md) for the local TGS server, renderer
comparison, and other entry points. For development, run `flutter analyze`
and `flutter test` from the root, and `flutter test` from `example/`.

[Architecture](docs/architecture.md) · [Benchmarks](docs/benchmarks.md)
