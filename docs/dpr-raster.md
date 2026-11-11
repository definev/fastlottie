# Full-loop raster preparation and DPR

`FastLottiePlayer.prepareRaster` pre-renders all source frames, or just one for
a static composition. It is separate from the shared [ping-pong cache](lod-cache.md).
Pass the logical viewport size and the current `MediaQuery.devicePixelRatioOf(context)`.
With the default DPR of 1, sizes are treated as physical pixels.

```text
pixelWidth  = ceil(logicalWidth  × devicePixelRatio)
pixelHeight = ceil(logicalHeight × devicePixelRatio)
RGBA bytes  = pixelWidth × pixelHeight × cachedFrames × 4
```

A 60-frame animation at 256 × 256 logical pixels needs 15 MiB at DPR 1,
60 MiB at DPR 2, and 135 MiB at DPR 3. `prepareRaster` throws before allocating
if the payload exceeds `maximumBytes` (32 MiB by default). Engine overhead is
additional. `rasterSize` reports the rounded allocation; painting uses the
unrounded content extent so padding at fractional DPR does not stretch the image.

Prepare outside `build()` and prepare again when size or DPR changes. Pass the
player and the animation to `FastLottieView`; the owner disposes both. Use
vector playback or the shared cache when prewarming a whole loop is too costly.
