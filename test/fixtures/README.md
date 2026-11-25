# Renderer test fixtures

Run `flutter test` from the package root. The 881 TGS fixtures cover decoding,
compilation and rendering. The JSON animations at this directory's root are
synthetic FastLottie fixtures.

## Animated Noto Emoji

The artwork in `tgs/NotoEmoji/` is by Google and is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original assets
are available from [Google Animated Noto Emoji](https://googlefonts.github.io/noto-emoji-files/?view=docs).
The Lottie JSON files were gzip-compressed and stored with the `.tgs` extension
for testing.

All fixtures are excluded from the pub.dev package by `.pubignore`.
