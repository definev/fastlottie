/**
 * Hand-crafted continuous calligraphy paths and curvature-aware pen kinematics
 * for the Apple "hello"-inspired "lottie" ribbon animation, originating directly
 * from the FastLottie logo's iconic blue cursive "L".
 *
 * Coordinate space: 1920 x 1080
 *   - Ascender ("l" apex):    y ≈ 210
 *   - "t" stem peaks:         y ≈ 276 / 270
 *   - "tt" crossbar:          y ≈ 424 -> 394
 *   - "i" dot:                y ≈ 352
 *   - x-height ("o","i","e"): y ≈ 462
 *   - Baseline bowls:         y ≈ 696
 *   - Italic slant:           ~21° forward
 */

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  return {
    x: uu * u * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + tt * t * p3[0],
    y: uu * u * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + tt * t * p3[1],
  };
}

function cubicDeriv1(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]),
    y: 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]),
  };
}

function cubicDeriv2(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: 6 * u * (p2[0] - 2 * p1[0] + p0[0]) + 6 * t * (p3[0] - 2 * p2[0] + p1[0]),
    y: 6 * u * (p2[1] - 2 * p1[1] + p0[1]) + 6 * t * (p3[1] - 2 * p2[1] + p1[1]),
  };
}

/**
 * Sample connected cubic Bezier segments into a dense arc-length & human-kinematics
 * time-parameterized polyline (2/3 power law: naturally slows in high-curvature loops
 * and peaks, glides smoothly through sweeping verticals and connectors).
 */
export function buildCalligraphyStroke(segments, {
  samplesPerSeg = 140,
  curvatureSlowdown = 18.0,
  baseWidth = 52,
} = {}) {
  const raw = [];
  let totalArc = 0;

  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];
    const w0 = seg.w0 ?? 1.0;
    const w1 = seg.w1 ?? 1.0;
    for (let k = 0; k <= samplesPerSeg; k++) {
      if (si > 0 && k === 0) continue;
      const t = k / samplesPerSeg;
      const pt = cubicPoint(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const d1 = cubicDeriv1(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const d2 = cubicDeriv2(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const speed = Math.hypot(d1.x, d1.y) + 1e-4;
      const cross = Math.abs(d1.x * d2.y - d1.y * d2.x);
      const curvature = cross / (speed * speed * speed);

      // Subtle Apple-style calligraphic stroke modulation (slightly fuller on downstrokes)
      const angle = Math.atan2(d1.y, d1.x);
      const downBias = Math.sin(angle);
      const wMod = (w0 + (w1 - w0) * t) * (1 + 0.05 * downBias);

      if (raw.length > 0) {
        const prev = raw[raw.length - 1];
        totalArc += Math.hypot(pt.x - prev.x, pt.y - prev.y);
      }

      raw.push({
        x: pt.x,
        y: pt.y,
        tx: d1.x / speed,
        ty: d1.y / speed,
        s: totalArc,
        curvature: Math.min(curvature, 0.08),
        width: baseWidth * wMod,
        tag: seg.tag,
        segIndex: si,
        pauseHere: k === samplesPerSeg ? (seg.pauseEnd || 0) : 0,
      });
    }
  }

  let totalTime = 0;
  raw[0].time = 0;
  for (let i = 1; i < raw.length; i++) {
    const ds = raw[i].s - raw[i - 1].s;
    const kMid = 0.5 * (raw[i].curvature + raw[i - 1].curvature);
    const speedFactor = 1.0 / (1.0 + curvatureSlowdown * Math.pow(kMid, 0.65));
    const dt = ds / Math.max(0.28, speedFactor) + raw[i].pauseHere;
    totalTime += dt;
    raw[i].time = totalTime;
  }

  for (let i = 0; i < raw.length; i++) {
    raw[i].u = raw[i].time / Math.max(1e-6, totalTime);
  }

  return { points: raw, totalArc, totalTime };
}

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

// Exact Bezier geometry of "#ribbon-stroke" from docs/logo.svg (760x720 space):
//   M 184 447
//   C 173 536, 222 602, 291 602
//   C 381 602, 470 493, 552 401
//   C 634 309, 696 194, 696 125
//   C 696 88, 679 66, 646 66
//   C 599 66, 554 122, 519 207
//   C 484 292, 460 391, 460 491
//   C 460 558, 506 603, 586 603
//   C 632 603, 686 578, 728 529
//
// Uniform affine mapping into 1920x1080 "lottie" canvas so baseline y=603 -> 696,
// top apex y=66 -> 205, and bottom-right bowl x=586 -> 572 (exact uniform scale!):
const LOGO_L_SCALE = 491 / 537; // 0.9143389
const LOGO_L_OX = 572 - 586 * LOGO_L_SCALE; // 36.20
const LOGO_L_OY = 696 - 603 * LOGO_L_SCALE; // 144.65

function mapLogoL([x, y]) {
  return [
    Math.round((LOGO_L_OX + x * LOGO_L_SCALE) * 10) / 10,
    Math.round((LOGO_L_OY + y * LOGO_L_SCALE) * 10) / 10,
  ];
}

// Exact de Casteljau right-half subdivision of cubic (p0,p1,p2,p3) from t in [0,1] to 1
// so trimming the hidden-behind-F start of segment 1 preserves 100% identical curve geometry!
function splitCubicTail(p0, p1, p2, p3, t) {
  const mix = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const a = mix(p0, p1);
  const b = mix(p1, p2);
  const c = mix(p2, p3);
  const d = mix(a, b);
  const e = mix(b, c);
  const f = mix(d, e);
  return [f, e, c, p3];
}

// Start cleanly at t = 0.22 of logo segment 1 (right where the ribbon emerges cleanly from behind F)
const [L_START, L_E1, L_E2, L_E3] = splitCubicTail(
  [184, 447], [173, 536], [222, 602], [291, 602], 0.22
);

// ============================================================================
// 1. MAIN CONTINUOUS CURSIVE STROKE: "l" (exact docs/logo.svg Bezier) -> "o" -> "t" -> "t" -> "i" -> "e"
// ============================================================================
export const MAIN_STROKE_SEGMENTS = chain(
  mapLogoL(L_START),
  [
    // --- LETTER "l" (100% exact Bezier geometry of #ribbon-stroke from docs/logo.svg) ---
    [mapLogoL(L_E1), mapLogoL(L_E2), mapLogoL(L_E3), { tag: 'l-entry', w0: 0.88, w1: 1.0 }],
    [mapLogoL([381, 602]), mapLogoL([470, 493]), mapLogoL([552, 401]), { tag: 'l-ascend', w0: 1.0, w1: 0.99 }],
    [mapLogoL([634, 309]), mapLogoL([696, 194]), mapLogoL([696, 125]), { tag: 'l-loop-up', w0: 0.99, w1: 0.97 }],
    [mapLogoL([696, 88]), mapLogoL([679, 66]), mapLogoL([646, 66]), { tag: 'l-apex', w0: 0.97, w1: 0.97 }],
    [mapLogoL([599, 66]), mapLogoL([554, 122]), mapLogoL([519, 207]), { tag: 'l-descend-top', w0: 0.97, w1: 0.99 }],
    // Descending FRONT leg passing OVER the ascending stem (logo's signature 3D overlap!)
    [mapLogoL([484, 292]), mapLogoL([460, 391]), mapLogoL([460, 491]), { tag: 'l-descend-over', w0: 1.0, w1: 1.02 }],
    [mapLogoL([460, 558]), mapLogoL([506, 603]), mapLogoL([586, 603]), { tag: 'l-bowl', w0: 1.02, w1: 1.0 }],
    [mapLogoL([632, 603]), mapLogoL([686, 578]), mapLogoL([728, 529]), { tag: 'l-tail', w0: 1.0, w1: 0.94 }],

    // --- CONNECTOR "l" -> "o" (C1-tangent continuous continuation straight out of logo's L tail,
    //     hugging cleanly along the outside-left shoulder of "o" so "o"'s center stays wide open!) ---
    // Outgoing tangent at mapLogoL([728, 529]) = (701.8, 628.4) is (38.4, -44.8) -> p1 collinear!
    [[740, 584], [790, 464], [890, 474], { tag: 'o-approach', w0: 0.94, w1: 0.91, pauseEnd: 28 }],

    // --- LETTER "o" (generous, open counter + airy cursive top-right bridge) ---
    [[844, 456], [778, 482], [752, 566], { tag: 'o-left', w0: 0.96, w1: 1.02 }],
    [[730, 636], [764, 696], [830, 696], { tag: 'o-bottom', w0: 1.02, w1: 1.0 }],
    [[896, 696], [948, 626], [938, 534], { tag: 'o-right', w0: 1.0, w1: 0.96 }],
    // Airy top-right cursive loop closing cleanly into high bridge toward "t"
    [[930, 478], [900, 460], [882, 480], { tag: 'o-top-close', w0: 0.95, w1: 0.90 }],
    [[870, 496], [890, 526], [950, 518], { tag: 'o-exit-over', w0: 0.90, w1: 0.93 }],

    // --- LETTER "t" #1 (confident tall ascender) ---
    [[1008, 508], [1064, 398], [1110, 276], { tag: 't1-up', w0: 0.93, w1: 0.93, pauseEnd: 38 }],
    [[1072, 398], [1028, 536], [1020, 616], { tag: 't1-down', w0: 1.0, w1: 1.02 }],
    [[1014, 668], [1042, 696], [1090, 696], { tag: 't1-bowl', w0: 1.02, w1: 0.98 }],

    // --- LETTER "t" #2 (harmonious slightly varied twin) ---
    [[1146, 696], [1214, 504], [1278, 270], { tag: 't2-up', w0: 0.93, w1: 0.93, pauseEnd: 38 }],
    [[1240, 394], [1196, 536], [1188, 616], { tag: 't2-down', w0: 1.0, w1: 1.02 }],
    [[1182, 668], [1210, 696], [1260, 696], { tag: 't2-bowl', w0: 1.02, w1: 0.98 }],

    // --- LETTER "i" (crisp x-height stem) ---
    [[1314, 696], [1360, 594], [1396, 468], { tag: 'i-up', w0: 0.93, w1: 0.93, pauseEnd: 34 }],
    [[1374, 540], [1356, 606], [1354, 642], { tag: 'i-down', w0: 1.0, w1: 1.02 }],
    [[1352, 678], [1378, 696], [1422, 696], { tag: 'i-bowl', w0: 1.02, w1: 0.98 }],

    // --- LETTER "e" (generous open counter + joyful Apple cursive flourish) ---
    [[1482, 696], [1572, 640], [1634, 562], { tag: 'e-entry', w0: 0.96, w1: 0.93 }],
    [[1672, 514], [1648, 456], [1582, 456], { tag: 'e-top', w0: 0.93, w1: 0.96 }],
    [[1516, 456], [1476, 522], [1480, 604], { tag: 'e-descend-over', w0: 1.0, w1: 1.03 }],
    [[1484, 666], [1532, 696], [1594, 696], { tag: 'e-bowl', w0: 1.03, w1: 0.98 }],
    [[1654, 696], [1708, 656], [1748, 596], { tag: 'e-exit', w0: 0.96, w1: 0.80 }],
  ]
);

// ============================================================================
// 2. FINISHING STROKE: SLEEK SWEPT DOUBLE-"tt" CROSSBAR
// ============================================================================
export const CROSSBAR_SEGMENTS = chain(
  [970, 424],
  [
    [[1072, 412], [1208, 398], [1330, 386], { tag: 'tt-crossbar', w0: 0.78, w1: 0.84 }],
  ]
);

// ============================================================================
// 3. FINISHING STROKE: AIRY CALLIGRAPHIC "i" DOT
// ============================================================================
export const IDOT_SEGMENTS = chain(
  [1440, 344],
  [
    [[1437, 350], [1433, 358], [1430, 364], { tag: 'i-dot', w0: 0.90, w1: 0.90 }],
  ]
);

export function createLottieCalligraphy() {
  return {
    main: buildCalligraphyStroke(MAIN_STROKE_SEGMENTS, {
      samplesPerSeg: 140,
      curvatureSlowdown: 18.0,
      baseWidth: 52,
    }),
    crossbar: buildCalligraphyStroke(CROSSBAR_SEGMENTS, {
      samplesPerSeg: 80,
      curvatureSlowdown: 8.0,
      baseWidth: 46,
    }),
    idot: buildCalligraphyStroke(IDOT_SEGMENTS, {
      samplesPerSeg: 24,
      curvatureSlowdown: 4.0,
      baseWidth: 48,
    }),
  };
}
