# Android performance measurements

## Chat sticker picker baseline

Use the Git tag `baseline/pixel7a-chat-picker-2026-11-24` for the Cupertino chat
picker's **All** tab. Measurements used a Pixel 7a on Android 17, a Flutter
arm64 profile build with Impeller Vulkan, a 90 Hz display and the default
30 FPS thumbnail configuration. Both cold and warm runs restarted the app.
Cold runs cleared benchmark app data first. Warm runs reused its disk cache.
Android reported thermal status 2 at the start and end of every run.

| All tab, first 20 stickers | Cold, two runs | Warm, two runs |
| --- | ---: | ---: |
| Flutter frames/s during settled playback | 90.1 | 90.2 |
| New raster frames painted/s per sticker, median | 30.0 | 29.9–30.0 |
| Poster ready, p95 across stickers | 68–98 ms | 68–79 ms |
| First painted raster, p95 across stickers | 562–737 ms | 476.5–520 ms |
| Process CPU, % of one core during settled playback | 190–201% | 188–202% |
| Total process PSS with the picker open | 365.4–366.8 MiB | 353.3–358.0 MiB |

The probe observed 6 seconds of chat, opened All, observed the first 10 seconds
and then sampled settled playback for 15 seconds. Startup times run from the
first observed mount of each tile. A sticker advances when the raster sample
index painted by its player changes between observed Flutter frames. PSS comes
from Android `dumpsys meminfo` after the settled phase.

For the bottom check, the probe scrolled to the end over 350 ms and sampled
only tiles intersecting the viewport. All 14 visible stickers painted 30.0 new
frames/s in the final 8-second window. The previous warm reference at
`6b29df1` measured 87.4 Flutter frames/s, 5.8 new frames/s per sticker
and 341.1 MiB PSS in one run. [Per-run measurements](chat-picker-pixel7a.json)

## Historical gallery measurements

These Pixel 7a / Android 17 captures use Flutter release with Impeller Vulkan.
They record older gallery and cache policies. The current gallery uses
[ping-pong LoD](lod-cache.md); the default app opens the
[network chat](../example/README.md).

| Snapshot | Workload |
| --- | --- |
| [Vector baseline](tgs-android-vector-before.json) | Uncached vectors at source FPS |
| [Initial mobile preset](tgs-android-mobile-initial.json) | Eight active cells at up to 30 FPS, before poster caching and clock throttling |
| [Initial LoD](tgs-android-lod-initial.json) | Early LoD; the section labelled Mobile also used the LoD cache, so it is not a valid Mobile result |
| [Mobile benchmark](tgs-android-mobile-benchmark.json) | Later capture; use the fingerprint, mode counters and thermal metadata in the file when interpreting it |

To rerun the current vector/LoD harness from the repository root:

```sh
python3 tool/run_benchmark.py --device <device-id> \
  --target lib/mobile_benchmark.dart --output /tmp/fastlottie-android.json
```

The harness preloads the sticker models, records build/raster/total frame
timings and cache counters, and captures Android thermal state when available.
The vsync probe drives frames during the stress pass; `natural_idle` leaves
scheduling to the app. Submitted frames per second come from vsync timestamps,
not the reciprocal of a single frame's total duration. Compare runs under
similar thermal conditions; these short runs do not measure power use.
