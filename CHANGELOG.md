## Unreleased

- Cupertino chat is the default Flutter example. It loads stickers and
  animated emoji over HTTP, with a separate asset gallery for benchmarks.
- Shared raster playback uses double-buffered ping-pong caching, worker
  rasterization and compressed RAM/disk storage.
- Precompositions support stretch and time remapping. Solid layers are supported.

- Schedule gallery frames from live consumer sample rates; suppress duplicate
  painter samples, preserve fractional sampling, remove duplicate grid boundaries
  and avoid repeated raster admission scans while budget remains pinned/full.

- Native Android TGS Compose launcher using lottie-compose, matching 4-column
  gallery geometry/catalog, background bounded streaming decode and shared models.

- Micro-batch gallery decoding (up to two files per native worker) with ownership
  transfer, bounded prefetch independent of UI publications, per-file failures,
  prompt lease cancellation on dispose, and constant-time model cache counters.

- Prepare first-player state/static flags on decoding workers; lazy player scenes
  avoid graph forks on shared raster hits. Skip expression path allocation for
  expression-free layers. Gallery cold results publish at most once per frame,
  with static loading placeholders.

- Two explicit renderer choices only: fastlottie/lottie, without automatic fallback.
- Animated skew/axis, compiled content-property expression references and Layer
  Control support; all 94 stickers in the comparison gallery render natively.
- Raw LoD keeps every visible animation playing while scrolling.

- The gallery benchmark uses a fixed resolution scale and a bounded cache.
  Workload presets remain internal; background and reduced motion suspend playback.
- Physical Pixel 7a release harness with separate UI/raster timings, cache/CPU
  counters, thermal metadata and deterministic benchmark cleanup.

- TGS/gzip detection, native background UTF-8 decode/compile and shared compiled
  templates; creating a player no longer recompiles the JSON model.
- Example infinity grid with 4 columns, 94 bundled TGS assets, bounded/coalesced
  loading, two worker jobs and a shared visibility-scoped animation clock.
- Precomp, spatial position, nonuniform stroke and linear/radial gradient support.
- Trim paths (simultaneous/individual), animated stroke dashes, four adjacent
  matte modes, reversed rectangles and closure-changing morphs following rlottie.
  Pixel checks use a differential TGS suite and an optional native rlottie oracle.
- Release TGS parsing/cache and warm-grid measurements against lottie 3.8.2.

- Raster preparation accepts logical sizes and an explicit device pixel ratio,
  rounds physical allocations up without stretching fractional content, and
  accounts for the actual pixel allocation in its memory budget.

## 0.1.0

- Compiled 2D shape renderer with temporal easing, path morphing, fill/stroke,
  nested groups, parenting, and explicit unsupported-feature diagnostics.
- Bounded vector picture cache and optional budgeted raster prewarming.
- Animation-driven widgets, asset loading, source FPS and subframe playback.
- Opt-in Float32x4 morph interpolation; scalar remains the default.
- Differential tests against lottie 3.8.2 and release benchmark harness.

- Add complete-loop texture atlases with cooperative preparation, exact RGBA
  accounting, cancellation and shared playback. Add a finite 100-slot sticker
  demo with a detailed preview and first-frame silhouette overload handling.
- Add rich message bubbles with inline animated Topics emoji, shared emoji
  atlases, text scaling, and static silhouette handling under frame pressure.
