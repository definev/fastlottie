# Supported Operations

FastLottie supports a 2D subset of Lottie animations in JSON and gzip-compressed
Telegram TGS formats. The compiler validates hidden layers as well. Features
outside this subset throw `UnsupportedLottieException` with a JSON path; the
core renderer does not silently fall back to another renderer.

| Category | Supported |
| --- | --- |
| Layer | Shape (`ty:4`), null (`ty:3`), solid (`ty:1`), precomp (`ty:0`); stacking, parent transform, hidden, `ip`/`op`; 2D layer-level blend modes (`bm:0..16`); normal and inverted alpha/luma mattes from the immediately preceding layer (`tt:1..4`); layer masks (`hasMask`, `masksProperties`: Add `'a'`, Subtract `'s'`, Intersect `'i'`, Difference `'f'`, None `'n'`, invert `inv`, opacity, and expansion `x`) |
| Precomp | Child timeline with start offset `st` and non-zero stretch `sr`; static or animated time remapping `tm` (in seconds) replacing offset/stretch calculation |
| Group | `gr`, nested groups, `tr`, Lottie-order styles; simultaneous (`m:1`) and individual (`m:2`) trim paths; merge paths (`mm:1..5`: Merge, Add/Union, Subtract/Difference, Intersect, Exclude/XOR) |
| Layer style | Single sharp-edged Inner Shadow (`sy[0].ty:2`): static parameters, Multiply, no blur/choke/noise. Applied to the transformed layer's alpha, preserving alpha while tinting the shadow. |
| Layer effects | `ADBE Fill` (`ef.ty:21`): replaces the entire layer's RGB and multiplies alpha, with optional animated color/opacity; no mask selection, invert, or feather. `ADBE Set Matte3` (`ef.ty:28`): non-inverted alpha matte from a shape layer referenced by static `ind` in the same composition while keeping the source's normal draw pass; self-reference supported, chaining not supported. |
| Geometry | `sh`: open/closed cubic Bézier; `rc`: rectangle + corner radius; `el`: ellipse; `sr`: star & regular polygon (points, inner/outer radius & roundness); reversed direction `d:3` supported on `rc`, `el`, and `sr` |
| Paint | `fl`/`st`: solid RGB, opacity, fill rule, stroke width/cap/join/miter; `gf`/`gs`: linear/radial gradients with animated color/opacity stops and radial focal point (`h`/`a`); animated stroke dash/gap/offset |
| Transform | Anchor, spatial Bézier position, split x/y, rotation, uniform or non-uniform scale, opacity, animated skew/axis; 2D |
| Keyframe | Static, hold, linear, temporal cubic Bézier; per-component easing on supported point properties |
| Morph | Matching vertex count; `v`/`i`/`o` interpolation; path closure may change at keyframes |
| Controls | `ADBE Layer Control`; expressions referencing `scale`, `rotation`, or `opacity` via `content(...)` within the same layer; Bézier path references by name via `thisComp.layer(...).content(...).path` within the same composition |
| Playback | Source FPS, cache FPS cap, subframe rendering (opt-in), reverse seek, non-zero composition `ip` |
| Layout | `contain`/`cover`/`none`/`scaleDown`/`fitWidth`/`fitHeight`/`fill`; Canvas transform also scales strokes |

In the software RLE rasterizer, boolean Merge Paths (modes 2–5) are evaluated on
fill coverage, and exact polygon boolean operations (`polygon_boolean.dart`)
compute merged contours whenever Merge Paths feed strokes or downstream Trim
Paths so software output matches Canvas. An Intersect with a single operand
keeps the remaining path as-is, matching baked geometry found in some Noto
stickers.
Software RLE supports all 17 layer blend modes. Modes 6, 7, 9, and 12–15 use
Dart formulas; shape/group-level blend modes are not applied.
Mask expansion uses a circular boundary band in mask coordinates combined with
the original coverage. Opacity on a single clip mask is applied after
compositing the layer's paints.

Expressions are resolved into compiled tracks at compile time; the compiler
rejects missing, duplicate, or cyclic targets. Path references share the source
geometry at the same composition frame while keeping the target's own transform,
paints, and modifiers.
Parent opacity is not inherited by children through parenting; opacity is
normally applied per paint.

Out-of-scope features include images/text/fonts, 3D, visual effects outside the
table above, repeaters, arbitrary JavaScript, slots, non-adjacent or chained
mattes, and morphs with changing vertex counts. The compiler uses a strict
whitelist of known fields; a file using familiar shapes may still be rejected if
another layer, modifier, or asset uses an unsupported feature.

## Coverage Verification

- Run `flutter test` to verify the renderer against the package fixtures.
  `test/tgs_test.dart` validates compilation and compares rendered output
  against `lottie` 3.8.2 using the [bundled TGS corpus](../test/fixtures/README.md).
- `test/path_reference_test.dart` tests path references.
  `test/rlottie_features_test.dart` adds comparisons against `rlottie` when a
  native oracle is available.
