/**
 * Hand-crafted continuous calligraphy paths and stylized Logo "F" & "L" geometry
 * for the complete Apple "hello"-style "Fastlottie" reveal video (1920 x 1080).
 *
 * Strict shared typographic grid across all 10 letters:
 *   - Capital "F" top edge:              y = 324  (bottom razor tip y = 734)
 *   - Lowercase "l" ascender top:        y = 340  (exact docs/logo.svg #ribbon-stroke!)
 *   - All 3 "t" ascender peaks:          y = 402 / 402 / 399
 *   - All 5 x-height letters (a,s,o,i,e): y = 520
 *   - All 9 baseline bowls:              y = 668
 *   - Unified ribbon stroke width:       34px (~21° italic slant throughout)
 */
import {
  buildCalligraphyStroke,
  MAIN_STROKE_SEGMENTS as RAW_LOTTIE_MAIN,
  CROSSBAR_SEGMENTS as RAW_LOTTIE_CROSS,
  IDOT_SEGMENTS as RAW_LOTTIE_DOT,
} from './hello_paths.js';

function chain(start, items) {
  const segs = [];
  let cur = start;
  for (const item of items) {
    const [p1, p2, p3, meta = {}] = item;
    segs.push({ p0: cur, p1, p2, p3, ...meta });
    cur = p3;
  }
  return segs;
}

// ============================================================================
// 0. EXACT STYLIZED LOGO "F" LIGHTNING BOLT (from docs/logo.svg)
//    scale = 0.618, tx = 68, ty = 304
//    -> Top edge:           y = 324
//    -> Middle-right point: (302, 480)
//    -> Bottom razor tip:   (83, 734)
// ============================================================================
export const F_STAGE_TRANSFORM_ALIGNED = {
  scale: 0.618,
  tx: 68,
  ty: 304,
};

export const LOGO_F_OUTER_D =
  'M 508 32 L 368 32 C 278 32 207 77.6 179 140 L 74 374 ' +
  'C 71.9 378.68 73 382 79 382 L 130 382 C 144 382 149 389.75 144 402 ' +
  'L 24 696 L 378 284 L 250 284 C 236 284 231 275 237 262 ' +
  'L 272 184 C 298 128 336 105 396 105 L 464 105 ' +
  'C 471 105 476.5 102.2 480 94.4 Z';

export const LOGO_F_FACET_D =
  'M 530 67 L 382 67 C 304 67 236 111.6 208 174 L 132.75 341.7 ' +
  'L 230 341.7 L 24 696 L 530 696 Z';

export const LOGO_F_REVEAL_CENTERLINE = chain(
  [512, 68],
  [
    [[416, 68], [284, 64], [220, 158], { tag: 'f-arch', w0: 1.0, w1: 1.0 }],
    [[182, 232], [136, 316], [108, 368], { tag: 'f-left', w0: 1.05, w1: 1.12 }],
    [[174, 354], [254, 332], [336, 312], { tag: 'f-mid', w0: 1.20, w1: 1.15 }],
    [[242, 434], [126, 570], [20, 706], { tag: 'f-blade', w0: 1.12, w1: 0.72 }],
  ]
);

// ============================================================================
// 1. GOLDEN CURSIVE STROKE: "a" -> "s" -> "t" (airy Apple kerning matching "lottie"!)
//    Baseline: y = 668 | x-height: y = 520 | "t" peak: y = 402
//    Spacious, relaxed letter pitch (~110-130px) matching "o -> t -> t -> i -> e"
// ============================================================================
export const FAST_AST_SEGMENTS = chain(
  // Starts cleanly at 1-o'clock shoulder so "a" oval closes seamlessly
  [440, 532],
  [
    // --- LETTER "a" (centered ~372, airy oval + slanted stem + wide exit valley) ---
    [[396, 504], [332, 526], [312, 586], { tag: 'a-left', w0: 0.94, w1: 1.02 }],
    [[296, 634], [322, 668], [368, 668], { tag: 'a-bottom', w0: 1.02, w1: 1.0 }],
    [[414, 668], [442, 616], [456, 526], { tag: 'a-right', w0: 0.96, w1: 0.94, pauseEnd: 26 }],
    [[440, 580], [426, 624], [428, 648], { tag: 'a-stem', w0: 1.0, w1: 1.02 }],
    [[430, 662], [448, 668], [486, 668], { tag: 'a-bowl', w0: 1.02, w1: 0.96 }],

    // --- LETTER "s" (centered ~578, generous breathing gap from "a" & open valley to "t") ---
    [[532, 668], [568, 598], [596, 514], { tag: 's-up', w0: 0.92, w1: 0.90, pauseEnd: 30 }],
    [[628, 552], [642, 600], [616, 644], { tag: 's-belly', w0: 0.98, w1: 1.03 }],
    [[596, 668], [560, 668], [542, 652], { tag: 's-foot', w0: 1.0, w1: 0.88, pauseEnd: 18 }],
    // Relaxed, airy flush-baseline valley sweeping smoothly into "t"
    [[568, 668], [628, 670], [682, 668], { tag: 's-exit', w0: 0.88, w1: 0.96 }],

    // --- LETTER "t" (stem at ~736, peak y=402 aligned on same ruler as lottie's "tt"!) ---
    [[720, 664], [762, 548], [794, 402], { tag: 'ft-up', w0: 0.94, w1: 0.93, pauseEnd: 34 }],
    [[768, 480], [742, 568], [738, 620], { tag: 'ft-down', w0: 1.0, w1: 1.02 }],
    [[734, 650], [752, 668], [782, 668], { tag: 'ft-bowl', w0: 1.02, w1: 0.96 }],
    // Crisp graceful exit flick with generous air before blue "l"
    [[800, 668], [812, 656], [820, 642], { tag: 'ft-exit', w0: 0.90, w1: 0.72 }],
  ]
);

// Sweeping golden crossbar for "t" in "Fast" (aligned with lottie's "tt" crossbar height)
export const FAST_T_CROSSBAR_SEGMENTS = chain(
  [712, 496],
  [
    [[752, 490], [792, 485], [830, 480], { tag: 'ft-crossbar', w0: 0.78, w1: 0.84 }],
  ]
);

// ============================================================================
// 2. LUMINOUS BLUE CURSIVE STROKE: "l" (exact docs/logo.svg Bezier) -> "o t t i e"
//    L_SCALE = 0.632, L_OX = 724, L_OY = 228.1
//    -> Baseline y = 668.0 | x-height y = 520 | "tt" peaks y = 402 / 399
//    -> Blue "l" starts at x = 852.5 (crisp 32px gap after gold "t" at 820!)
//    -> Blue "e" ends at x = 1829 (balanced 83px left / 91px right margins!)
// ============================================================================
const L_SCALE = 0.632;
const L_OX = 724;
const L_OY = 668 - 696 * L_SCALE; // 228.128

function mapLottie(pt) {
  return [
    Math.round((L_OX + pt[0] * L_SCALE) * 10) / 10,
    Math.round((L_OY + pt[1] * L_SCALE) * 10) / 10,
  ];
}

function mapLottieSegs(segs) {
  return segs.map((seg) => ({
    ...seg,
    p0: mapLottie(seg.p0),
    p1: mapLottie(seg.p1),
    p2: mapLottie(seg.p2),
    p3: mapLottie(seg.p3),
  }));
}

export const LOTTIE_MAIN_MAPPED = mapLottieSegs(RAW_LOTTIE_MAIN);
export const LOTTIE_CROSS_MAPPED = mapLottieSegs(RAW_LOTTIE_CROSS);
export const LOTTIE_DOT_MAPPED = mapLottieSegs(RAW_LOTTIE_DOT);

export function createFastLottieCalligraphy() {
  return {
    fReveal: buildCalligraphyStroke(LOGO_F_REVEAL_CENTERLINE, {
      samplesPerSeg: 100,
      curvatureSlowdown: 8.0,
      baseWidth: 168,
    }),
    ast: buildCalligraphyStroke(FAST_AST_SEGMENTS, {
      samplesPerSeg: 120,
      curvatureSlowdown: 17.0,
      baseWidth: 34,
    }),
    astCrossbar: buildCalligraphyStroke(FAST_T_CROSSBAR_SEGMENTS, {
      samplesPerSeg: 60,
      curvatureSlowdown: 6.0,
      baseWidth: 29,
    }),
    lottieMain: buildCalligraphyStroke(LOTTIE_MAIN_MAPPED, {
      samplesPerSeg: 120,
      curvatureSlowdown: 18.0,
      baseWidth: 34,
    }),
    lottieCrossbar: buildCalligraphyStroke(LOTTIE_CROSS_MAPPED, {
      samplesPerSeg: 70,
      curvatureSlowdown: 8.0,
      baseWidth: 30,
    }),
    lottieDot: buildCalligraphyStroke(LOTTIE_DOT_MAPPED, {
      samplesPerSeg: 24,
      curvatureSlowdown: 4.0,
      baseWidth: 32,
    }),
  };
}
