# iPhone 16 Instruments measurements — 15 November 2026

One usable Power Profiler pass measured the release chat across 19 marked intervals. Active scrolling had the highest CPU load; Reduce Motion reduced CPU use to about 1% of one core. Instruments recorded nominal thermal state throughout this 115.49-second trace. GPU utilization could not be measured: Power Profiler exposed GPU power impact, while dedicated GPU captures failed to finalize over the Wi-Fi device connection.

## Environment and method

- iPhone 16, iOS 27.0.1 (24A446), 1179 × 2556 physical pixels, DPR 3.
- Xcode/Instruments 27.2 (27B52); Flutter 3.51.0-0.1.pre, framework 666d2c4e83.
- Source commit `028e801`; benchmark-only changes add phase signposts, automatic progression, telemetry and thermal-state sampling. No renderer optimizations were made.
- Release/AOT build, default Mini-Strip renderer and unbounded large-sticker picture cache. iOS keeps its existing 48 MiB image and 16 MiB compressed cache budgets.
- Fresh process and temporary source/raster cache directories; bundled fixtures are served locally on the phone. The workload includes 23 seeded messages, then sends 24 emoji in a text message plus 12 sticker messages, reaching 36 messages.
- Three seconds of settling precede each checkpoint; each checkpoint then dwells for approximately four seconds. Scrolling is separately signposted. The post-scroll checkpoints measure stationary animated playback, not scrolling.
- CPU is the duration-weighted mean of Instruments `ProcessCPUUsage`, restricted to the target PID and signpost interval. **100% = one fully occupied core**; multiple threads can exceed 100%. GPU values come from Instruments’ own `Summary: Process Power Impact` aggregation for the same interval.
- The GPU column is an **Instruments power-impact score**, not utilization percentage, milliseconds or watts. Thermal is the device-wide state, not a temperature or an app-attributed heat measurement. Apple documents these distinctions in [Power Profiler](https://developer.apple.com/documentation/xcode/measuring-your-app-s-power-use-with-power-profiler).
- Xcode selected `localNetwork`. Instruments reported a connected charger throughout; system battery-power readings are therefore unsuitable for energy comparisons. One complete telemetry pass recorded brightness 0.2613, Low Power Mode off, the app active at every sample, and no fetch, raster or asset errors. This telemetry pass is separate from the usable Power Profiler trace.

## Results

| Scenario | Window (s) | Mean CPU (% of one core) | GPU power impact | Thermal |
| --- | ---: | ---: | ---: | --- |
| Idle animated chat | 4.03 | 55.6 | 0.5 | Nominal |
| Sticker picker open | 4.02 | 81.0 | 0.5 | Nominal |
| Active sticker scrolling | 2.63 | 228.1 | 0.7 | Nominal |
| Sticker picker after scrolling | 4.03 | 84.5 | 0.5 | Nominal |
| Emoji picker open | 4.01 | 77.3 | 0.5 | Nominal |
| Active emoji scrolling | 6.32 | 176.3 | 0.4 | Nominal |
| Emoji picker after scrolling | 4.03 | 78.5 | 0.6 | Nominal |
| Compose 24 animated emoji | 4.02 | 109.9 | 0.5 | Nominal |
| After sending 12 stickers, picker open | 4.05 | 83.2 | 0.5 | Nominal |
| Picker closed, sticker messages visible | 4.04 | 34.7 | 0.5 | Nominal |
| Cycle 1: emoji scrolling | 1.90 | 243.7 | 0.5 | Nominal |
| After picker cycle 1 | 4.04 | 36.1 | 0.6 | Nominal |
| Cycle 2: sticker scrolling | 1.91 | 218.0 | 0.5 | Nominal |
| Cycle 3: emoji scrolling | 1.91 | 242.6 | 0.7 | Nominal |
| Cycle 4: sticker scrolling | 1.90 | 213.7 | 0.5 | Nominal |
| Cycle 5: emoji scrolling | 1.90 | 305.8 | 0.2 | Nominal |
| After picker cycle 5 | 4.04 | 35.2 | 0.6 | Nominal |
| Reduce Motion | 4.05 | 1.1 | 0.0 | Nominal |
| Chat disposed (clipped) | 3.40 | 0.7 | 0.0 | Nominal |

## Interpretation and limits

The first sticker and emoji scroll windows averaged 228.1% and 176.3% CPU. Later picker cycles reached 305.8% in one short emoji-scroll interval. These are interval means, not instantaneous peaks. The sticker-scroll call tree includes Dart raster workers and LZ4 compression; the trace supports investigating worker rasterization/compression and cache churn before changing the GPU renderer. No performance fix is established by this profiling pass.

Closing the picker reduced CPU from 83.2% to 34.7% after sending stickers. With Reduce Motion enabled it fell to 1.1%, and after disposal to 0.7%. GPU power impact was 0.0 in both latter windows. Small GPU-score differences between animated scenarios should not be treated as a precise ranking.

Nominal state for about two minutes does not establish sustained thermal behavior. A later pass used 10-second windows and launched with Metal HUD logging enabled. It started in fair state and stayed fair through the start of picker cycle 2, the last checkpoint retrieved. Its trace did not finalize and is excluded from the table.

Capture attempts included Game Performance, Metal System Trace, Activity Monitor plus GPU, and Power Profiler. The lightest pilot disconnected after 2.07 seconds. Detailed GPU passes stalled in remote collection/saving, and the usable Power Profiler trace has zero rows in the Metal GPU-state and per-frame tables. Consequently, GPU utilization %, per-frame GPU time, long-duration thermal transitions, and repeatability remain unmeasured. USB was unavailable; testing stopped at the user’s request to use current results.

## Artifacts

- Machine-readable measurements: [iphone16-instruments.json](iphone16-instruments.json).
- Usable raw trace: `build/instruments-iphone16-2026-11-15/mini-strip-1.trace` (local, ignored by Git).
- Exported XML, CPU call tree, complete second-workload telemetry and partial later-pass telemetry are alongside the trace. Incomplete `.trace` bundles in that directory are failed attempts, not results.
- Reusable target: `example/lib/instruments_benchmark.dart`; summarizer: `tool/summarize_iphone_instruments.py`.

## Reproduce

Use a stable device connection, keep the app foregrounded, and allow the phone to return to nominal state before comparable repeated runs. Build and install the benchmark, then record:

```sh
cd example
flutter build ios --release -t lib/instruments_benchmark.dart
cd ..
xcrun devicectl device install app --device "$IPHONE_UDID" example/build/ios/iphoneos/Runner.app
xcrun xctrace record --device "$IPHONE_UDID" --template "Power Profiler" \
  --instrument "Points of Interest" --time-limit 195s --no-prompt \
  --env FL_INSTRUMENTS_MODE=mini-strip --env FL_INSTRUMENTS_DWELL=10 \
  --env FL_INSTRUMENTS_STARTUP=6 --output /tmp/fastlottie-iphone.trace \
  --launch -- com.example.fastlottieExample
python3 tool/summarize_iphone_instruments.py /tmp/fastlottie-iphone.trace \
  --output /tmp/fastlottie-iphone-summary.json
```

Retrieve workload telemetry before the next benchmark launch (each launch replaces its renderer’s JSON file):

```sh
xcrun devicectl device copy from --device "$IPHONE_UDID" \
  --domain-type appDataContainer --domain-identifier com.example.fastlottieExample \
  --source Documents/instruments-mini-strip.json \
  --destination /tmp/fastlottie-iphone-workload.json
```

Other supported renderer modes are `ping-pong` and `lottie`; they were not profiled in this session. Rebuild the normal app with `flutter build ios --release -t lib/main.dart` after profiling.

## Validation

Release iOS benchmark and normal demo builds passed. Targeted Dart analysis passed. The example test suite had 39 passes and one failure: `tgs_store_test.dart` expected 959 native/104 unsupported fixtures but observed all 1063 as native. The same failure was reproduced from an untouched `git archive HEAD` checkout; it is pre-existing and was not modified as part of profiling.
