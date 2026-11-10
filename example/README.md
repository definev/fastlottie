# fastlottie example

Android also includes a **TGS Compose** launcher: a native 4-column gallery using
`lottie-compose` and the same bundled stickers. See [Compose notes](../docs/compose-tgs.md)
for build, launch commands and rendering differences.

Run `flutter run --profile -d <mobile-device-id>` on a connected phone.
The default screen is an infinite 4-column grid of the 94 bundled TGS stickers.
The catalog repeats; cells outside the viewport are disposed. Decode micro-batches
up to two files per worker and publishes at most one visible model per frame.
See [decoding notes](../docs/tgs-decoding.md).

On Android/iOS, raw LoD animates every visible sticker while scrolling.
Thumbnail quality uses one fixed `tgsLodScale` and a 64 MiB shared raster cache.
Clip length never lowers the scale. FPS/strategy come from the gallery configuration.
See [LoD configuration](../docs/lod-cache.md).
Scrolling and tapping never pause the default LoD grid. The shared clock follows
visible sample rates, so a 30 FPS cache does not keep requesting display-rate
frames. See [render scheduling notes](../docs/flutter-render-work.md).

The screen contains only a fixed 48 px renderer selector and the grid: no app
bar, counters, cell labels/backgrounds, loading animations, or preview gestures.

The only renderer choices are `fastlottie` and `lottie`. All 94 bundled TGS files
render natively with fastlottie. Fastlottie errors are shown directly, with no
automatic baseline fallback. Playback workload presets remain internal to test
and benchmark entry points; they are not additional UI modes.

See [project TGS notes](../docs/tgs-grid.md) for pipeline, memory/cache limits,
coverage and measured performance.

```sh
flutter test
```

Release parsing and scrolling benchmark, from the repository root:

```sh
python3 tool/run_benchmark.py --device macos --target lib/tgs_benchmark.dart \
  --output docs/tgs-features-benchmark-macos.json
```

Physical Android vector/LoD comparison:

```sh
python3 tool/run_benchmark.py --device 3C091JEHN14062 \
  --target lib/mobile_benchmark.dart --output docs/tgs-android-lod-benchmark.json
```

Default launch now opens the finite Telegram-style 100-sticker demo. Tap a
thumbnail for a detailed vector preview; the selector still offers only
fastlottie/lottie. The previous scrolling gallery is at `/gallery`. Thumbnail
pixels, FPS and memory budget are in `lib/tgs/sheet.dart`. Sustained frame pressure
switches the sheet and chat preview to first-frame silhouettes with a timed retry.
See [the design and limitations](../docs/telegram-sticker-sheet.md).

The chat area now contains rich message bubbles with inline animated Topics
emoji, bold text, struck-through prices and natural line wrapping. Six selected
Topics files share a dedicated atlas; unready/overloaded emoji show bundled
silhouettes. See [inline emoji notes](../docs/inline-topic-emoji.md).
