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
