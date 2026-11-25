# Native raster and warm playback

The Flutter widget and direct Canvas player keep their existing interfaces. The
background software worker prepares geometry from the compiled composition and
rasterizes into a reusable premultiplied BGRA buffer. Both single frames and
mini-strip slots use the same pipeline.

- On native platforms the build hook bundles the coverage and blend kernels.
  Coverage uses fixed-point cells with a per-row bitset and exact incremental
  stepping on long edges. The workspace is capped at 262,144 cells per draw;
  oversized draws or unavailable native code use the Dart scanline. Masks,
  gradients and the final composition order still use the existing renderer.
- Native Bézier flattening is available for experiments with
  `--dart-define=FASTLOTTIE_NATIVE_BEZIER=true`. It borrows the sampled track
  and polygon output for one bounded contour call. The subdivision, affine
  arithmetic and duplicate-point rule match Dart; output growth happens in
  Dart, and oversized work or missing native code uses the original path.
  It leaves the Web renderer unchanged.
- The experimental software workspace can also expand strokes in one bounded
  native call, including round caps and joins. It borrows reusable geometry
  columns and falls back to Dart when limits are exceeded.
- A style whose path, stroke/dash and transform chain are constant can reuse
  its coverage before applying paint and the clip mask. The cache key includes
  the resolved transform and clip rectangle. Cache limits are 1 MiB and 256
  entries per worker; changing geometry continues through the live path.
  When the worker releases or replaces a compiled scene, it drops only that
  scene's coverage, flattened paths, trim lengths and gradient tables. The
  workspace still shares scratch buffers and applies the same cache limits.
- Native requests for a first raster image wait on the host until their worker
  is available. Leaving the viewport or seeking can remove or replace a queued
  request before it reaches the worker. Entries with an image can still queue
  ahead for playback.
- A warm page with two to four resident frames at up to 65,536 pixels per frame
  can be rebuilt in RAM as a dictionary of identical 16×16 tiles plus an index
  per frame. A page can include only the frames sampled by a lower playback
  rate; other frame requests still use the normal cache. A single-frame worker
  can reuse unchanged tiles in its persistent
  buffer, even when seeking within a page. Mini-strip slots materialize the
  frame independently. Dense pages and pages outside the memory budget keep
  their original full-frame entries. The worker attempts this after replying
  to a cache hit, so the initial raster request and the FLC1 disk format are
  unaffected.

The live renderer still evaluates the scene in Dart; it does not require a
separate asset format. Batch FFI and offline pack files are potential extensions.
An experiment grouping solid draws into a native batch did not improve the M5
benchmark and was left out of the default implementation. Flutter still
uploads a complete frame or mini-strip. A native texture presenter and the
comparison of end-to-end frame timings against ThorVG need device measurements.

For correctness coverage, run:

```sh
flutter test test/software_native_parity_test.dart test/tile_playback_test.dart \
  test/software_rasterizer_test.dart test/mini_strip_test.dart \
  test/raster_scene_cache_test.dart
```

The software parity test compares the native pipeline with the Dart fallback
across dimensions and non-monotonic frame access. The tile tests check
materialization, seek, and RAM admission and eviction.
