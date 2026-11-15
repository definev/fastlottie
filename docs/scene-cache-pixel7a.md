# Scene cache eviction on Pixel 7a

The software worker used to clear every scene's geometry caches when one compiled scene left the worker. It now releases only entries owned by that scene. Coverage, path, trim and gradient tables keep their existing per-worker limits. The public API, scratch buffers and disk cache format are unchanged.

## Raster workload with frequent eviction

Pixel 7a, Android 17, Flutter ARM64 release with native raster kernels. Four TGS emoji remain in one workspace; each round renders one of four rotating emoji, evicts it, and renders the four resident emoji. Both policies run in the same build, in alternating order, with 64 warm-up rounds followed by 192 measured rounds per pass. The sampled pixel checksum matched across all passes.

| Time per round, median of six passes | Clear workspace | Release one scene | Change |
| --- | ---: | ---: | ---: |
| Median | 2.87 ms | 1.79 ms | −38% |
| p95 | 4.03 ms | 2.63 ms | −35% |

This isolates a workload with one eviction every five renders. It omits isolate transfers, compressed cache, image upload, and UI. It does not estimate CPU savings or FPS for the chat. [Raw samples](scene-cache-kernel-pixel7a.json).

To reproduce from `example/`, run `flutter run --release -d <device> -t lib/scene_cache_benchmark.dart` and collect `FASTLOTTIE_SCENE_CACHE_SAMPLE` output.

## Chat workload

The release [chat benchmark](chat-memory-benchmark.md) runs Mini-Strip with the existing budgets and unbounded `ui.Picture` cache for large stickers. The baseline uses renderer source from `028e801`; both builds use the same example source. Each run starts a fresh process and cache. Runs are ordered before, after, after, before. PSS is one sample per checkpoint, which is taken after settling. Frame timing spans the interval between checkpoints; it is not isolated to the scroll gesture.

| Checkpoint, median of two runs per build | PSS before → after | Build p95 before → after | Raster p95 before → after |
| --- | ---: | ---: | ---: |
| After sticker scroll | 466.4 → 438.6 MiB | 8.05 → 8.76 ms | 4.67 → 3.71 ms |
| After emoji scroll | 470.0 → 444.4 MiB | 8.80 → 8.60 ms | 5.69 → 4.71 ms |
| Picker closed | 548.7 → 519.4 MiB | 3.34 → 3.88 ms | 6.69 → 6.84 ms |
| After five picker cycles | 549.4 → 522.9 MiB | 8.45 → 9.86 ms | 6.84 → 6.59 ms |

At these four checkpoints, both candidate runs had lower PSS than both baseline runs. PSS covers the whole process; it does not measure the size of the geometry cache. Frame timings were mixed, and after five picker cycles the fraction of frames beyond the refresh budget rose from 3.15% to 4.06%. The first run started at thermal status 0 and finished at 1; the other runs started and finished at 1. This is an exploratory comparison: CPU during scrolling, time to first image, sustained power and performance on iPhone were not measured. [Per-run checkpoints](scene-cache-chat-pixel7a.json).

The cache lifetime, software parity, Mini-Strip and related tests passed. The full suite still has the existing TGS Canvas comparison failure: the same 38 asset/frame comparisons fail on the baseline. The iOS release build also passed without code signing.
