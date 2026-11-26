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

## Progressive first image

```dart
final cache = FastLottieRasterCache(
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
cancel loading. The application owns viewport policy. Tests: `test/playback_scope_test.dart`.

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

## Duplicate upload skipping (64-bit fingerprint)

```dart
final cache = FastLottieRasterCache(
  deduplicateImageUploads: false, // Optional: always upload decoded buffers.
);
```

Enabled by default. For each cached frame payload, the worker computes a JS-safe
64-bit content fingerprint `(fpHi, fpLo)` combining its CRC31 with an
independent 32-bit multiplicative hash of the stored payload (cached in RAM and
tile pages). For multi-frame strips, the worker folds its $K$ per-slot
fingerprints in $O(K)$ without rescanning the uncompressed BGRA buffer.

On the UI isolate, the coordinator retains only the last `(fpHi, fpLo)` pair and
a non-owning reference to each entry's active front/back `ui.Image` (no pixel
buffers are retained on the host). When a newly delivered buffer matches the
same entry's active front/back dimensions and 64-bit fingerprint, the host
clones the existing `ui.Image` handle (`image.clone()`) and skips
`ui.decodeImageFromPixels`. Matching is probabilistic (~2^-64 collision rate per
strip transition), not byte-for-byte. Clone handles dispose independently, and
release, demotion, and eviction drop the reference. Inspect
`skippedImageUploads`.

Rasterization, LZ4, and IPC still happen; this saves image creation/upload only,
and cannot share an individual slot between different Mini-Strips. Setting
`deduplicateImageUploads: false` also disables fingerprint computation on the
worker.
