# TGS comparison gallery

`TgsGallery` is the asset-backed widget used by the Flutter benchmark targets.
It shows a four-column grid and repeats 94 stickers from the Crocosaurus,
Hot Cherry, Hot Hot Hot, and Vi & Caitlyn packs. The catalog interleaves packs
and excludes Topics and Noto emoji. The default Flutter example opens the
[Cupertino chat](../example/README.md) instead.

The gallery offers explicit `fastlottie` and `lottie` renderers. Load errors
stay with the selected renderer. The grid builds cells lazily and releases
model leases when cells leave the viewport. See
[batch decoding and playback scheduling](tgs-decoding.md).

The LoD preset uses the [shared ping-pong cache](lod-cache.md) at half the
fitted physical size and up to 30 FPS. Visible stickers keep playing during
scroll. The benchmark and test code can also select full vector playback,
full-resolution caching, or a mobile preset with up to eight active cells.
Lifecycle, TickerMode, and reduced motion control playback.

For historical runs and commands to reproduce the current workload, see
[benchmarks](benchmarks.md) and [Android measurements](android-performance.md).
