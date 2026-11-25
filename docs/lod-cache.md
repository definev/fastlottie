# Shared raster cache and LoD

`FastLottieRasterCache` retains up to two images per active animation
entry: the visible strip and a lookahead strip. `framesPerStrip: null`
selects an adaptive size; `framesPerStrip: 1` stores one frame per image. Static compositions and
`FastLottieRasterMode.poster` use a single image. A cold or rejected entry can
still draw through fastlottie's vector renderer.

The cache scales the fitted physical size by `resolutionScale`. At scale 0.5
it uses half the width and height, about one quarter of the pixels. Longer
clips do not change the scale. Widgets get DPR from `MediaQuery`; direct
`FastLottiePlayer.draw` callers can pass `devicePixelRatio`.

`maximumFrameRate` caps the number of timeline samples per second without
slowing playback. Omit it to use the source rate. Players can override the
shared cache's resolution and frame rate.

`maximumBytes` defaults to 32 MiB and limits retained image payload and
reservations. It does not measure total process or GPU memory. Compressed
frames in RAM and optional `.flcache` files on disk have separate budgets.
Entries in use are pinned; a player can retry admission after a cache
invalidation or when budget becomes available. Dispose a caller-owned cache
when its players are finished.

For the rendering and storage pipeline, see [architecture](architecture.md).
For prewarming all frames in one player instead, see [DPR and raster
preparation](dpr-raster.md).
