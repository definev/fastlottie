## Unreleased

- Organize renderer internals by responsibility and split the public entry
  point into focused libraries. Imports from `package:fastlottie/src/` need
  the new paths. The `fastlottie.dart` and `decoding.dart` entry points keep
  their exports.

- Add `FastLottie.asset` and `FastLottie.bytes` loading widgets with placeholder,
  error and retry builders. Share playback configuration and source lifecycle
  with the network widget; asset loading follows `DefaultAssetBundle`.
- Report invalid raster settings by parameter name, reject oversized prepared
  images before allocation, and remove unused frame-index aliases.

- Unify ping-pong and mini-strip configuration as `FastLottieRasterCache` with
  `framesPerStrip`: null selects adaptive strips, 1 selects single frames, and
  larger values select fixed strip sizes. Replace the strategy enum and named
  factories with this setting, and rename `pingPongSwaps` to `bufferSwaps`.
  Migrate `.pingPong(...)` to `(framesPerStrip: 1, ...)`, `.miniStrip(...)` to
  `(...)`, and `stripFrames` to `framesPerStrip`. The unnamed constructor now
  defaults to adaptive strips, matching the widget's existing default pipeline.

- Compare vector cache limits and compile options by value so equivalent widget
  settings retain their player state.
- Retain and dispose the FastLottieView repaint notifier with its widget state;
  reload network compositions when the response byte limit changes.

- Split software rasterization into focused parts and use named payload fields
  for Dart worker messages while preserving the version 3 browser wire format.
- Enforce import ordering and unawaited-future checks, with documentation checks
  on the public library entry points and their parts.

- Shared raster playback uses double-buffered ping-pong caching, worker
  rasterization and compressed RAM/disk storage.
- Precompositions support stretch and time remapping. Solid layers are supported.

- Schedule frames from live consumer sample rates; suppress duplicate
  painter samples, preserve fractional sampling, remove duplicate grid boundaries
  and avoid repeated raster admission scans while budget remains pinned/full.

- Prepare first-player state/static flags on decoding workers; lazy player scenes
  avoid graph forks on shared raster hits. Skip expression path allocation for
  expression-free layers.

- Animated skew/axis, compiled content-property expression references and Layer
  Control support.

- TGS/gzip detection, native background UTF-8 decode/compile and shared compiled
  templates; creating a player no longer recompiles the JSON model.
- Precomp, spatial position, nonuniform stroke and linear/radial gradient support.
- Trim paths (simultaneous/individual), animated stroke dashes, four adjacent
  matte modes, reversed rectangles and closure-changing morphs following rlottie.
  Pixel checks use a differential TGS suite and an optional native rlottie oracle.

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
  accounting, cancellation and shared playback.
