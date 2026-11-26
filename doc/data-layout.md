# Data Layout: Selective Structure-of-Arrays (SoA)

This optimization pass is driven by actual memory-access patterns: segment
lookup only touches timestamps, interpolation reads the full vector at both
endpoints, and rendering must preserve scene draw order. Not every object is
converted to SoA.

A census on 2026-11-11 across 1,087 TGS files in the measurement corpus found
50,389 animated properties and 342,517 keyframes, with no explicit end values in
the corpus. 453 files contain strokes. Two-keyframe tracks are the most common
(8,594 tracks), followed by four-keyframe (7,095) and three-keyframe (6,441)
tracks. Because most tracks are small, reducing the number of retained heap
objects and buffers matters more than splitting every coordinate into separate
arrays.

| Area | Layout | Decision |
| --- | --- | --- |
| Runtime keyframes | `Keyframes`: `Float64List` times, three metadata columns in `Int32List`, `Float32List` value slab | Replaces `List<_Key>` and small per-key buffers retained after compilation |
| Vector/morph values | Components of each keyframe stored contiguously | Consumers read the entire vector; stride is rounded to 4 floats when SIMD is enabled, with padding excluded from hashing |
| Temporal easing | Contiguous `Float64` `(x1, y1, x2, y2)` tuples | All four control values are always read together; not split into four columns |
| Spatial curve/tangents | Optional payload | Tracks without spatial tangents do not allocate these two arrays |
| Software strokes | Per-workspace SoA `x`/`y`/`tx`/`ty` scratch buffers | Reused across contours/frames, growing by powers of two; normals derived from tangents |
| Polygons, scanline cells | Existing SoA | Kept as-is |
| RLE spans, BGRA pixels | Existing packed AoS | Fields are read together; well suited to SWAR and image transfer |
| Scene graph, cache entries | Existing objects | Preserves layer order, mattes, alias DAG, ownership, and eviction |

The compiler reads headers to size buffers up front, then writes keyframes and
easing directly into `TypedData` columns. Forking shares the entire `Keyframes`
object; cursor, last-frame memo, and output buffers remain per-player. No public
API or dependencies were added. Arrays are written only during compilation
(including RGB normalization) and are read-only afterward.

Times and easing remain `Float64`; coordinates remain `Float32` as before.
Omitted end values point directly to the next key's start without duplicating
data. Explicit end values are stored separately to preserve discontinuities and
existing cache hash keys. Hold keyframes, per-component easing, spatial Béziers,
gamma correction, and SIMD scalar tails are all preserved. Tests lock the
content keys of three fixtures from before the layout change to catch accidental
disk-cache invalidation.

## Benchmarks and Verification

`tool/benchmark_data_layout.py` extracts the exact track, polygon, and stroke
implementations from two snapshots, wraps them in a driver, and compiles to Dart
AOT — with no separate kernel copy to maintain. The driver checks that checksums
match across both versions, measures 15 batches, and runs three separate
processes for RSS. RSS includes VM/allocator overhead and is a stress test of
100,000 RGB tracks × 8 keyframes, not the heap footprint of a single sticker or
typical app.

```sh
python3 tool/benchmark_data_layout.py \
  --reference /absolute/path/to/before-snapshot \
  --candidate /absolute/path/to/after-snapshot \
  --output /tmp/fastlottie-layout-kernels.json
python3 tool/run_benchmark.py --output /tmp/fastlottie-layout-release.json
flutter test
dart analyze lib test/packed_track_test.dart
```

The track driver runs 256 tracks × 8 keyframes covering implicit/explicit ends,
hold, linear/eased segments, forward/backward seeks, and endpoints across 4,096
iterations per batch. The stroke driver runs 64 contours with caps/joins and
reused scratch buffers across iterations. These are kernel microbenchmarks and
do not translate directly into FPS. `debugRenderSoftwareFrame` allocates a new
workspace per call and is not used to measure the worker's retained-scratch
gains.

Apple M5, macOS 27.2, Dart/Flutter release AOT. Raw samples:
[kernels](data-layout-kernels.json),
[release before](data-layout-release-before.json),
[release after](data-layout-release-after.json). Both snapshots use the same
compiler aside from the layout changes, along with identical fixtures and
benchmark runners.

| Kernel | Before | After | Change |
| --- | ---: | ---: | ---: |
| Track scalar, 1 value (ns/sample) | 13.8 | 12.8 | −7% |
| Track scalar, 3 values (ns/sample) | 14.0 | 14.0 | ~0% |
| Track scalar, 42 values (ns/sample) | 28.7 | 32.4 | +13% |
| Track SIMD, 42 values (ns/sample) | 21.5 | 22.1 | +3% |
| Track SIMD, 768 values (ns/sample) | 135.4 | 138.6 | +2% |
| Stroke, 64 contours (µs/batch iteration) | 39.9 | 33.5 | −16% |
| RSS track stress test (MiB, median of 3 processes) | 257.5 | 120.3 | −53% |

The primary win of keyframe packing is memory; offset-based lookup can make some
vector interpolations slightly slower, and single-nanosecond deltas vary across
runs. Stroke gains come from scratch reuse: only four buffers grow when a
larger contour appears, rather than allocating six new lists per contour.

| Flutter release fixture | Parse + compile before → after (µs median) | Uncached warm record before → after (µs/frame median) |
| --- | ---: | ---: |
| `static` | 26 → 23 | 1.88 → 1.75 |
| `icon` | 25 → 22 | 2.13 → 1.92 |
| `many_shapes` | 1177 → 1111 | 52.00 → 44.83 |
| `morph` | 1338 → 1189 | 18.42 → 17.21 |

These figures represent a single pair of runs on a development machine. `morph`
settled record was effectively unchanged (18.75 → 18.92 µs), and some visible
`FrameTiming` runs lacked samples when the surface was inactive. Do not
extrapolate these figures to GPU, FPS, or mobile performance. `flutter test`:
95 passed, 3 skipped; differential tests compared 959 TGS files against `lottie`
with zero samples exceeding threshold. `flutter analyze`: no errors.

## Future Opportunities

Visibility columns (`ip`/`op`/`flags`) could be packed and a draw list built to
skip permanently hidden or null layers. Measure first: most scenes are small,
and matte ordering and parent chains still matter. Caching world transforms or
ancestor chains may yield larger gains than object layout changes alone. This
area has not been changed yet.
