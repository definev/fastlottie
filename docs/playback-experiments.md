# Playback optimization experiments

Progressive startup, fused fill, and duplicate upload detection are on by
default. Playback gating applies when the owner supplies a scope. The paths
have regression coverage; device-wide CPU, battery, and latency gains have
yet to be established.

## Timeline sampling for dense grids

The raster cache always requests the sample for the caller's current progress.
When a worker is late, the front image remains visible and the next completed
request can jump over intermediate samples. Flutter's own frame rate can remain
stable while the animation therefore appears jerky.

The cache does not slow the timeline to replay missed samples. Dense grids can
spread initial phases across the Mini-Strip width to distribute worker requests.
The example sticker sheet uses one shared clock and preserves its configured
30 FPS regardless of visible asset count. `StickerPlaybackBudget.qualityScale`
can lower the rate only as an explicit application choice; density alone never
changes the sampling rate.

## Progressive first image

```dart
final cache = FastLottieRasterCache.miniStrip(
  progressiveFirstFrame: false, // Optional: start with a complete strip.
);
```

For a long clip, the first request renders only the current sample. Holding that
sample does not prefetch. A subsequent advance returns to the regular strip grid
and can reuse the cached first source frame. Short clips that fit in one strip
retain their single-upload full-loop behavior. Reservation still budgets the
normal strips, so lower initial GPU payload does not increase cache admission.
Transitions, reverse seeks, pending seeks and size changes are covered in
`test/mini_strip_test.dart`. Startup can add an upload/job to continuous playback.

## Owner-controlled visibility

```dart
FastLottiePlaybackScope(
  playback: visible
      ? FastLottiePlayback.active
      : nearViewport
          ? FastLottiePlayback.prewarm
          : FastLottiePlayback.hidden,
  child: FastLottie(composition: composition, rasterCache: cache),
);
```

The owner supplies visibility/occlusion on layout, scroll or screen changes.
There is no per-tick RenderBox scan. Prewarm paints a frame-zero poster. Hidden
preserves the widget's dimensions, detaches repaint listeners, stops its owned
ticker and releases its player/cache lease. Already dispatched jobs can finish;
queued work with no users is canceled. Shared entries used by visible widgets
remain valid. External controllers are not stopped; their owners manage them.
The scope applies to FastLottie (including loaded network widgets), not a
caller-owned FastLottieView/player. An ancestor hiding a network widget does not
cancel loading. Gallery demonstrates active/prewarm integration; the application
still owns viewport policy. Tests: `test/playback_scope_test.dart`.

## Fused Bézier fill

Enabled by default on native and web. Use
`--dart-define=FASTLOTTIE_FUSED_FILL=false` to disable it on native. A plain animated
Bézier fill transforms control points before subdivision into device space.
Static fills keep the retained-polyline path; stroke, dash, trim, boolean sources
and grouped sources use the original path. Device flatness is 0.25 px. Different
subdivision can alter antialiased edge pixels, so this experiment has its own
content-key suffix and does not overwrite the baseline disk cache.

`FastLottieSoftwareSession(fuseFillTransforms: true)` provides the direct A/B
surface. Tests compare against the original renderer with a bounded image error
and require exact fallback pixels for stroke/trim. No speedup is claimed yet.
Flutter web and its bundled browser worker both use fused fill. The native build
flag does not change the web renderer.

## Exact duplicate uploads

```dart
final cache = FastLottieRasterCache.miniStrip(
  maximumDuplicateFrameBytes: 0, // Optional: disable comparison.
);
```

The default 1 MiB host RAM budget retains at most the last accepted pixel buffer per
entry, bounded globally. Compare full frame/strip dimensions and every byte;
there is no hash collision risk. Only a texture still installed as a front/back
buffer may be cloned. Clone handles have independent disposal; cache accounting
conservatively counts both handles. Release, demotion and eviction discard the
retained comparison data. Inspect `duplicateFrameBytes` and `skippedImageUploads`.
The budget covers retained comparison data, not temporary in-flight upload bytes.

Rasterization, LZ4 and IPC still happen. This saves image creation/upload only,
and byte comparison/copy on the host can lose on rapidly changing content. It
cannot share an individual slot between different Mini-Strips. Set the budget to zero if measurement shows comparison costs outweigh the
uploads saved.

## Measurement and checks

`example/lib/worker_queue_benchmark.dart` alternates progressive startup on/off
for eight visible tiles. It measures from their first layout to the first draw
using a raster image on the Flutter canvas, not GPU presentation. Each tile is
48 logical px, rasterized at DPR 2; all fit in the 192×96 viewport. New cache per
trial, four pairs in one process, no disk. It also compares six seconds of
continuous playback with 16 entries, 30 sample ticks/s, in false/true/true/false
order. CPU ticks are reported on Android/Linux only.

The same executable finishes with a six-second dense-sheet workload: 60
distinct compositions, staggered Mini-Strip phases and 30 sample ticks/s.
Each draw requests the sample at the actual elapsed wall time. It reports
exact-target hit rate, queue work, late host ticks, worker render time, transfer
bytes and image decode p95. These offscreen draws do not measure display
presentation or guarantee that every requested sample becomes visible.

On the Pixel 7a quality-first profile, the benchmark uses eight workers, 16
in-flight jobs, three-frame strips and full-strip startup. The same profile is
selected by the Android example picker. It preserves 30 FPS sampling; it does
not invoke `qualityScale` automatically.

```sh
cd example
flutter run --release -d <android-device> -t lib/worker_queue_benchmark.dart \
  --dart-define=DENSE_ONLY=true --dart-define=DENSE_WORKERS=8 \
  --dart-define=DENSE_IN_FLIGHT=16 --dart-define=DENSE_STRIP_FRAMES=3 \
  --dart-define=DENSE_PROGRESSIVE=false
```

Three process starts on a Pixel 7a running Android 17 on 17 November 2026,
after removing sequential playback, each requested 10,800 samples across
60 distinct 128×128 raster entries. Thermal status was 2 before measurement
and reached 3 after the final run:

| Run | Exact-target hit rate | Late host ticks | Image decode p95 |
| --- | ---: | ---: | ---: |
| 1 | 3.80% | 70 | 68.992 ms |
| 2 | 97.73% | 0 | 6.809 ms |
| 3 | 11.31% | 71 | 72.448 ms |

The variability prevents a stable 30 FPS claim from these runs. The middle
sample establishes that high exact-target availability is possible, not that it
is sustained. These hit rates are not display FPS and are not directly comparable
to the sequential-presentation fractions previously measured with a slowing
timeline.

```sh
cd example
flutter run --release -d macos -t lib/worker_queue_benchmark.dart
```

Run fresh processes in alternating order to verify the tradeoffs on target phones. Compare first raster paint p95, exact-frame hit rate, stale frame time,
CPU and peak memory. First raster paint timing includes Flutter scheduling and
does not isolate worker execution. The visible benchmark intentionally does not
advance playback; the separate playback test does.

Correctness: root and example suites retain the known baseline TGS comparison
and fixture-count failures; analyzer is clean. New tests cover startup/seek,
visibility/listener lifecycle, fused geometry/fallback and duplicate lifecycle.

## macOS release result (15 November 2026)

[Recorded samples](playback-experiments-macos.json), one ARM64 process, native
raster enabled. These samples predate the default change; fused fill and
duplicate detection were off for both variants. Four visible-startup pairs
alternate order. Median of trial p95:
**7.985 ms baseline vs 7.975 ms progressive** — effectively unchanged, with a
19.445 ms cold baseline trial. Rasterized source frames before first paint fall
from **32 to 8** for eight tiles; retained GPU image payload falls from
**1,188,864 to 294,912 bytes**. Cache reservation is unchanged.

Two continuous-playback pairs (false/true/true/false), 2,880 lookups per run:

| Metric | Baseline (both runs) | Progressive (both runs) |
| --- | ---: | ---: |
| Exact raster hits | 2,878 (99.93%) | 2,862 (99.38%) |
| Worker dispatches | 761 | 777 |
| Source frames rasterized | 1,611 | 1,611 |
| Compressed hits | 1,376 | 1,392 |

Each progressive player has an additional miss when first advancing from its
bootstrap frame into a full strip. No further difference in exact-hit counts
appeared in these runs. This establishes reduced startup work but **does not
establish faster visible startup** and shows a continuous-playback tradeoff.
Set `progressiveFirstFrame: false` to prioritize uninterrupted playback on the
first advance. No release speed measurements were made for
fused fill or duplicate detection; visibility has lifecycle tests only.
