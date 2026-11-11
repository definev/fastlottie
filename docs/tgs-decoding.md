# TGS loading and playback scheduling

The [comparison gallery](tgs-grid.md) reads bundled TGS assets through
`TgsStore`. The [Cupertino chat](../example/README.md) uses `NetworkTgsStore`
with separate download and decode queues. Both use `decodeTgsBatch` and load
the requested renderer explicitly.

On native platforms a decode worker inflates gzip, parses JSON, and compiles
a fastlottie composition. It also prepares the first player's pure Dart scene
state. The compiled model crosses the isolate boundary via `Isolate.exit`;
it does not need to be serialized and parsed again. Rendering handles such as
`Path` and `Picture` remain lazy. Flutter's web `compute` runs inline.

## Gallery

- `TgsStore` combines pending loads into batches of up to two assets. The
  gallery uses one decode job at a time on mobile and two elsewhere. Errors
  are reported per asset.
- The worker frees its slot as soon as the batch finishes. The gallery publishes
  at most one newly decoded visible model per frame. It bounds the decode and
  publication backlog at twice concurrency × batch size. Cached hits return
  immediately.
- Releasing the last lease can remove queued work. Already running decode can
  finish and warm the model cache. Disposing the store completes pending
  leases without waiting for a new frame.

## Network chat

- HTTP downloads can run independently of the decode queue. Releasing the
  last lease aborts an active download. Native downloads can use the raw
  `.tgsbin` disk cache before requesting data.
- The chat allows up to six concurrent HTTP fetches and two decode batches of
  up to two files. Preview requests can move ahead of queued thumbnails.
  Model publication to visible widgets is also limited to one per frame.

## Playback

`StickerClock` schedules work at the highest sample rate requested by its
active consumers. It stops when no consumer needs ticks. Raster hits can draw
without constructing a vector scene. The painter filters repeat samples and
still repaints when a raster result arrives or a cache entry is invalidated.

If a native decode job stalls only under a debugger, check whether new worker
isolates are being held at `PauseStart`. Try running from a terminal outside
the debugger to isolate the issue.
