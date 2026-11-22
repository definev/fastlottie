# fastlottie example

The default Flutter target opens a Cupertino chat with a scrollable sticker
picker, animated emoji shortcodes, and full-size sticker messages. It starts an
embedded loopback HTTP server from the bundled stickers and Topics/Noto emoji
on native platforms. The options menu switches between `fastlottie` and
`lottie`, displays telemetry, and clears caches.

The chat history includes a stress section with 20 full-size sticker messages
interleaved with 20 emoji-only messages (12 animated emoji each, 240 total).
Scroll up past the welcome message to browse it. Open the picker at the same
time to stress the shared thumbnail cache alongside the chat's vector stickers.
The memory benchmark keeps its original seed conversation.

Run from `example/`:

```sh
flutter run -d macos
flutter run -d chrome
flutter test
```

Chrome loads TGS files directly from the bundled Flutter assets. Native targets
start an embedded HTTP server. Use `flutter run --profile -d <device-id>` on a
connected phone to check frame timings.

The chat and picker display a pre-rendered custom PNG while FastLottie
prepares playback. The same pack contract works with built-in assets and
the Dart pack server. Regenerate manifests and posters from the repository
root after changing bundled TGS files or the rasterizer.

```sh
flutter test --no-pub tool/build_emoji_posters.dart
```

Set `--dart-define=CHAT_EMOJI_POSTERS=false` to benchmark the TGS-only path.

## Test the Wasm raster backend

Web builds use the bundled FastLottie Wasm module when the hook does not
produce one. To rebuild the module from the C sources, use a Flutter SDK
that supports data asset hooks and put Zig on `PATH`. From `example/`, run:

```sh
FLUTTER_DART_DATA_ASSETS=true flutter build web --wasm
```

To run the browser smoke test against the hook output in debug mode:

```sh
FLUTTER_DART_DATA_ASSETS=true flutter build web --debug --wasm \
  -t tool/wasm_smoke.dart \
  --dart-define=FASTLOTTIE_REQUIRE_WASM_HOOK=true \
  --dart-define=FASTLOTTIE_REQUIRE_WEB_WORKER=true \
  --output=build/wasm-smoke
python3 -m http.server 8080 --directory build/wasm-smoke
```

Open `http://localhost:8080` in Chrome. The page reports success after
checking the generated asset, raster pixel parity, and mini-strip playback via
a dedicated worker using the C Wasm kernels. Omit `--wasm` and `--debug` to
check the release JavaScript build.
To test the bundled module, disable `enable-dart-data-assets` in the Flutter
configuration and omit the `FASTLOTTIE_REQUIRE_WASM_HOOK` define. To regenerate
the bundled module, run `dart run tool/build_wasm.dart` from the repository root.

The worker is a separate `dart2js` entry point and is bundled with the package.
After changing the worker, scene compiler, or raster code, regenerate it from
the repository root with `dart run tool/build_web_worker.dart`. Pass `--check`
to verify the bundled script matches the current source and SDK. To measure the
inline fallback, build with `--dart-define=FASTLOTTIE_DISABLE_WEB_WORKER=true`.

From the repository root, `node tool/test_web_worker.cjs` checks the bundled
worker's version handshake, frame and strip replies, pixel consistency, and
cache clearing without a browser. Pass a previous `fastlottie_worker.js` path
to compare its output pixels with the current bundle.

On the web chat demo, use `?workers=1&strip=4` or `?workers=2&strip=4` to compare
pool sizes with the same mini-strip length. Without the query parameters,
FastLottie chooses the worker count and strip length automatically.

## Run the Dart pack server

From the repository root, run:

```sh
dart run tool/pack_server.dart --port 8787 --delay-ms 800
```

In another terminal, from `example/`:

```sh
flutter run -d macos --dart-define=TGS_SERVER_URL=http://127.0.0.1:8787
```

Replace `macos` with `chrome` to try the same server from the browser. On a
connected Android device, run `adb reverse tcp:8787 tcp:8787` and pass the same
URL. The artificial delay applies to TGS downloads, so a cold poster can
appear before the animation.

- `/v1/catalog` lists pack revisions and supports `If-None-Match`.
- `/manifests/<revision>.json` lists item revisions, posters, poster
  progress and animation sources.
- `/objects/<sha256>.png` and `/objects/<sha256>.tgs` serve immutable bytes.

The generator publishes the catalog after writing the objects and manifests.
Keep `build/pack_server/sources/` alongside the publication history when
serving older revisions after changing a TGS source. The server validates
hashes and references on startup. Restart it after publishing a new catalog.

The native client opens a complete cached catalog and refreshes it in the
background. Its 32 MiB disk cache keeps downloaded media by hash. Posters
share a bounded decode queue across the picker, inline emoji and large
stickers. Web uses browser HTTP caching. The original `tool/tgs_server.dart`
and `/catalog` remain available for testing legacy clients.

## Comparison targets

For release memory measurements of the chat itself on macOS and Android, see
[the chat memory benchmark](../docs/chat-memory-benchmark.md).
For CPU, GPU power impact, and thermal state on a physical iPhone 16, see
[the Instruments benchmark](../docs/iphone16-instruments.md).

Run the release harness from the repository root. Write new runs to a separate
output file to preserve the measured snapshots:

| Target (relative to `example/`) | Workload |
| --- | --- |
| `lib/benchmark.dart` | Synthetic fixtures: compile, vector, picture and full-loop raster |
| `lib/tgs_benchmark.dart` | TGS loading and scrolling, fastlottie vs lottie |
| `lib/mobile_benchmark.dart` | Mobile grid: vector vs LoD |
| `lib/round2_benchmark.dart` | Vector grid and ping-pong cache stress at two budgets |

```sh
python3 tool/run_benchmark.py --device macos --target lib/tgs_benchmark.dart \
  --output /tmp/fastlottie-tgs-benchmark.json
```

See [the gallery](../docs/tgs-grid.md) for its fixture corpus and
[benchmarks](../docs/benchmarks.md) for how to read the results. Android also
ships a separate [TGS Compose launcher](../docs/compose-tgs.md).

## macOS memory profile

The macOS chat now uses a 6 MiB image budget, 2 MiB compressed cache, one raster
worker, and 160 logical-pixel vector stickers. Thumbnail resolution and autoplay
are preserved. The header is opaque and lists do not prebuild offscreen cells.
Use `--dart-define=CHAT_COMPACT=false` to compare with the previous profile.
Android and web retain their previous defaults.
See [measurements and tradeoffs](../docs/chat-graphics-memory-macos.md).
