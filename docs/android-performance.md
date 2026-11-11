# Android gallery measurements

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
