# fastlottie example

The default Flutter target opens a Cupertino chat with a scrollable sticker
picker, animated emoji shortcodes, and full-size sticker messages. It starts an
embedded loopback HTTP server from the bundled stickers and Topics/Noto emoji
on native platforms. The options menu switches between `fastlottie` and
`lottie`, displays telemetry, and clears caches.

Run from `example/`:

```sh
flutter run -d macos
flutter run -d chrome
flutter test
```

Chrome loads TGS files directly from the bundled Flutter assets. Native targets
start an embedded HTTP server. Use `flutter run --profile -d <device-id>` on a
connected phone to check frame timings.

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

## Use a separate TGS server

From the repository root, run:

```sh
dart tool/tgs_server.dart --port 8787 --delay-ms 150
```

In another terminal, from `example/`:

```sh
flutter run -d macos --dart-define=TGS_SERVER_URL=http://127.0.0.1:8787
```

For a connected Android device, run `adb reverse tcp:8787 tcp:8787` before
launching and pass the same URL. The app reads the server's catalog and fetches
sticker bytes as needed. The download queue can cancel unused requests, and
raw TGS bytes and rendered frames use separate disk caches. With fastlottie,
picker thumbnails and inline emoji share a 30 FPS Mini-Strip Ping-Pong cache by
default (switchable to single-frame Ping-Pong `K=1` from the options menu);
large sticker messages use vector rendering.

## Comparison targets

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
