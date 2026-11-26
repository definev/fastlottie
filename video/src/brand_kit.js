/**
 * Shared Apple Keynote Brand Kit & Morphing "FL <-> Fastlottie" Choreography Engine.
 *
 * Unifies:
 *   - Matte Obsidian Studio (Act I Meltdown & Honesty Blackout)
 *   - Radiant Ceramic White Studio (Act II Reveal, Act III Proof & Architecture, Act IV Finale)
 *   - Exact docs/logo.svg "FL" emblem (2-tone golden lightning "F" + Bezier blue ribbon "L")
 *   - Silky morph choreography:
 *       * "unfold": compact FL logo glides apart as golden "ast" and blue "ottie" write out into Fastlottie
 *       * "fold":   calligraphic Fastlottie smoothly retracts into the iconic compact FL emblem lockup
 */
import {
  W, H, FONT_SANS, FONT_MONO,
  clamp, lerp, norm, easeOutExpo, easeOutCubic, easeInOutCubic,
  hexAlpha,
} from './engine.js';
import {
  F_STAGE_TRANSFORM_ALIGNED,
  LOGO_F_OUTER_D,
  LOGO_F_FACET_D,
  createFastLottieCalligraphy,
} from './fastlottie_paths.js';
import { buildCalligraphyStroke } from './hello_paths.js';

export const K = {
  // Obsidian Dark Stage (Act I & Honesty Blackout)
  darkBg: '#080B12',
  darkBgInner: '#101624',
  darkCard: 'rgba(15, 20, 32, 0.90)',
  darkCardBorder: 'rgba(255, 255, 255, 0.10)',
  darkText: '#F8FAFC',
  darkMuted: '#94A3B8',
  darkDim: '#64748B',

  // Apple Ceramic White Studio (Act II, III, IV)
  lightBgCenter: '#FFFFFF',
  lightBgMid: '#F7F9FD',
  lightBgEdge: '#EBF1F9',
  lightCard: 'rgba(255, 255, 255, 0.88)',
  lightCardStrong: 'rgba(255, 255, 255, 0.95)',
  lightCardBorder: 'rgba(15, 23, 42, 0.085)',
  lightCardShadow: 'rgba(15, 35, 80, 0.075)',
  ink: '#0F172A',
  inkSub: '#334155',
  inkMuted: '#64748B',
  inkHairline: 'rgba(15, 23, 42, 0.09)',

  // FastLottie Brand Duality (from docs/logo.svg)
  goldBright: '#FCD514',
  gold: '#F0AE04',
  goldDeep: '#D48801',
  goldText: '#B45309',
  goldSoftBg: 'rgba(250, 204, 21, 0.14)',
  goldBorder: 'rgba(234, 158, 4, 0.42)',

  cyan: '#1FE0F4',
  blue: '#1294EC',
  royal: '#0364F7',
  blueText: '#0369A1',
  blueSoftBg: 'rgba(18, 148, 236, 0.10)',
  blueBorder: 'rgba(18, 148, 236, 0.34)',

  // Surgical Native-Failure Telemetry Coral/Crimson
  red: '#E11D48',
  redBright: '#F43F5E',
  redSoftBg: 'rgba(225, 29, 72, 0.10)',
  redDarkBg: 'rgba(28, 12, 18, 0.92)',
  redBorder: 'rgba(244, 63, 94, 0.42)',
  amber: '#F59E0B',
};

// Exact docs/logo.svg "#ribbon-stroke" segments in native 760x720 logo coordinates
function chain(start, items) {
  const segs = [];
  let cur = start;
  for (const [p1, p2, p3, meta = {}] of items) {
    segs.push({ p0: cur, p1, p2, p3, ...meta });
    cur = p3;
  }
  return segs;
}

const COMPACT_L_SEGMENTS = chain(
  [184, 447],
  [
    [[173, 536], [222, 602], [291, 602], { tag: 'cl-entry' }],
    [[381, 602], [470, 493], [552, 401], { tag: 'cl-ascend' }],
    [[634, 309], [696, 194], [696, 125], { tag: 'cl-loop-up' }],
    [[696, 88], [679, 66], [646, 66], { tag: 'cl-apex' }],
    [[599, 66], [554, 122], [519, 207], { tag: 'cl-descend-top' }],
    [[484, 292], [460, 391], [460, 491], { tag: 'cl-descend-over' }],
    [[460, 558], [506, 603], [586, 603], { tag: 'cl-bowl' }],
    [[632, 603], [686, 578], [728, 529], { tag: 'cl-tail' }],
  ]
);

let brandCache = null;
function getBrandAssets() {
  if (brandCache) return brandCache;

  const makeCanvas = (w = W, h = H) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return [c, c.getContext('2d')];
  };

  const strokes = createFastLottieCalligraphy();
  const compactL = buildCalligraphyStroke(COMPACT_L_SEGMENTS, {
    samplesPerSeg: 70,
    curvatureSlowdown: 14.0,
    baseWidth: 68,
  });

  const indexTags = (pts) => {
    const map = {};
    for (let i = 0; i < pts.length; i++) {
      const tag = pts[i].tag;
      if (!map[tag]) map[tag] = { start: i, end: i };
      map[tag].end = i;
    }
    return map;
  };

  // Pre-render exact full-res crisp FL emblem once onto a 760x720 canvas for super-fast badge/lockup draws!
  const [logoCanvas, logoCtx] = makeCanvas(760, 720);
  const fOuterPath = new Path2D(LOGO_F_OUTER_D);
  const fFacetPath = new Path2D(LOGO_F_FACET_D);

  // Subtle ceramic grain tiles (light + dark)
  const makeGrain = (alphaByte) => {
    const [gc, gctx] = makeCanvas(160, 160);
    const img = gctx.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const v = Math.floor((s - Math.floor(s)) * 255);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = alphaByte;
    }
    gctx.putImageData(img, 0, 0);
    return gc;
  };

  const [wordCanvas, wordCtx] = makeCanvas();
  const [fCanvas, fCtx] = makeCanvas();
  const [fMaskCanvas, fMaskCtx] = makeCanvas();
  const [astCanvas, astCtx] = makeCanvas();
  const [lottieCanvas, lottieCtx] = makeCanvas();
  const [shadowCanvas, shadowCtx] = makeCanvas();
  const [casterCanvas, casterCtx] = makeCanvas();
  const [rawCasterCanvas, rawCasterCtx] = makeCanvas();
  const [emblemTmp, emblemTmpCtx] = makeCanvas(760, 720);
  const [emblemShad, emblemShadCtx] = makeCanvas(760, 720);

  brandCache = {
    strokes,
    compactL,
    compactLTags: indexTags(compactL.points),
    astTags: indexTags(strokes.ast.points),
    lottieTags: indexTags(strokes.lottieMain.points),
    fOuterPath,
    fFacetPath,
    logoCanvas, logoCtx,
    emblemTmp, emblemTmpCtx,
    emblemShad, emblemShadCtx,
    wordCanvas, wordCtx,
    fCanvas, fCtx,
    fMaskCanvas, fMaskCtx,
    astCanvas, astCtx,
    lottieCanvas, lottieCtx,
    shadowCanvas, shadowCtx,
    casterCanvas, casterCtx,
    rawCasterCanvas, rawCasterCtx,
    lightGrain: makeGrain(5),
    darkGrain: makeGrain(9),
  };

  // Pre-bake full emblem at u=1 for static/badge use
  renderCompactLogoCanvas(brandCache, 1, 1);
  return brandCache;
}

function sampleIndexForU(points, u) {
  if (u <= 0) return 0;
  if (u >= 1) return points.length - 1;
  let lo = 0;
  let hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].u < u) lo = mid + 1;
    else hi = mid;
  }
  if (lo === 0) return 0;
  const prev = points[lo - 1].u;
  const next = points[lo].u;
  return (lo - 1) + clamp((u - prev) / Math.max(1e-6, next - prev), 0, 1);
}

function strokeRibbonSlice(ctx, points, i0, i1, fillStyle, {
  widthAdd = 0,
  offsetX = 0,
  offsetY = 0,
  roundStart = true,
  roundEnd = true,
  alpha = 1,
  step = 2,
} = {}) {
  const startIdx = Math.max(0, Math.floor(i0));
  const endIdx = Math.min(points.length - 1, Math.floor(i1));
  if (i1 <= i0 + 0.01) return;

  const getPt = (fi) => {
    const a = Math.max(0, Math.min(points.length - 1, Math.floor(fi)));
    const b = Math.min(points.length - 1, a + 1);
    const f = clamp(fi - a, 0, 1);
    const pa = points[a];
    const pb = points[b];
    return {
      x: lerp(pa.x, pb.x, f) + offsetX,
      y: lerp(pa.y, pb.y, f) + offsetY,
      r: (lerp(pa.width, pb.width, f) + widthAdd) * 0.5,
    };
  };

  const samples = [getPt(i0)];
  for (let i = startIdx + 1; i <= endIdx; i += step) {
    if (i > i0 && i < i1) {
      const p = points[i];
      samples.push({ x: p.x + offsetX, y: p.y + offsetY, r: (p.width + widthAdd) * 0.5 });
    }
  }
  samples.push(getPt(i1));
  if (samples.length < 2) return;

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = fillStyle;
  for (let k = 0; k < samples.length - 1; k++) {
    const a = samples[k];
    const b = samples[k + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy);
    if (d < 0.05) continue;
    const nx = -dy / d;
    const ny = dx / d;
    ctx.beginPath();
    ctx.moveTo(a.x + nx * a.r, a.y + ny * a.r);
    ctx.lineTo(b.x + nx * b.r, b.y + ny * b.r);
    ctx.lineTo(b.x - nx * b.r, b.y - ny * b.r);
    ctx.lineTo(a.x - nx * a.r, a.y - ny * a.r);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (roundStart) {
    const s = samples[0];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (roundEnd) {
    const e = samples[samples.length - 1];
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function compositeIsolatedShadow(destCtx, assets, targetSpecs, casterPts, c0, c1, {
  color = '#004EE0',
  shadowSpread = 12,
  blurSoft = 8,
  blurCore = 2.6,
  alphaCore = 0.24,
  alphaSoft = 0.23,
  offsetX = 1.5,
  offsetY = 3,
} = {}) {
  if (c1 <= c0 + 0.01) return;
  const {
    shadowCanvas, shadowCtx: sctx,
    casterCanvas, casterCtx: cctx,
    rawCasterCanvas, rawCasterCtx: rcctx,
  } = assets;

  rcctx.clearRect(0, 0, W, H);
  strokeRibbonSlice(rcctx, casterPts, c0, c1, color, { widthAdd: shadowSpread * 0.45, alpha: 1 });

  cctx.clearRect(0, 0, W, H);
  cctx.save();
  cctx.filter = `blur(${blurSoft}px)`;
  cctx.globalAlpha = alphaSoft;
  cctx.drawImage(rawCasterCanvas, offsetX, offsetY);
  cctx.filter = `blur(${blurCore}px)`;
  cctx.globalAlpha = alphaCore;
  cctx.drawImage(rawCasterCanvas, offsetX * 0.4, offsetY * 0.4);
  cctx.restore();

  sctx.clearRect(0, 0, W, H);
  sctx.save();
  sctx.globalCompositeOperation = 'source-over';
  for (const t of targetSpecs) {
    if (t.end > t.start + 0.01) strokeRibbonSlice(sctx, t.pts, t.start, t.end, '#000000');
  }
  sctx.globalCompositeOperation = 'source-in';
  sctx.drawImage(casterCanvas, 0, 0);
  sctx.restore();

  destCtx.drawImage(shadowCanvas, 0, 0);
}

/**
 * Draw the exact 2-tone golden lightning bolt "F" onto any ctx at given (tx, ty, scale),
 * with optional calligraphic sweep reveal fU in [0, 1].
 */
function paintBoltF(ctx, assets, { tx, ty, scale, fU = 1 }) {
  if (fU <= 0) return;
  const { fOuterPath, fFacetPath, strokes, fCanvas, fCtx, fMaskCanvas, fMaskCtx } = assets;

  const paintDirect = (targetCtx) => {
    targetCtx.save();
    targetCtx.translate(tx, ty);
    targetCtx.scale(scale, scale);

    const amberGrad = targetCtx.createLinearGradient(420, 32, 115, 670);
    amberGrad.addColorStop(0.0, '#F3B216');
    amberGrad.addColorStop(0.36, '#E6A40C');
    amberGrad.addColorStop(0.68, '#D98E03');
    amberGrad.addColorStop(1.0, '#D48801');
    targetCtx.fillStyle = amberGrad;
    targetCtx.fill(fOuterPath);

    targetCtx.save();
    targetCtx.clip(fOuterPath);
    const brightGrad = targetCtx.createLinearGradient(385, 68, 105, 680);
    brightGrad.addColorStop(0.0, '#FCD514');
    brightGrad.addColorStop(0.48, '#FDCE0F');
    brightGrad.addColorStop(0.78, '#F0AE04');
    brightGrad.addColorStop(1.0, '#DE9302');
    targetCtx.fillStyle = brightGrad;
    targetCtx.fill(fFacetPath);
    targetCtx.restore();
    targetCtx.restore();
  };

  if (fU >= 0.999) {
    paintDirect(ctx);
    return;
  }

  fCtx.clearRect(0, 0, W, H);
  paintDirect(fCtx);

  const fPts = strokes.fReveal.points;
  const fIdx = sampleIndexForU(fPts, fU);
  fMaskCtx.clearRect(0, 0, W, H);
  fMaskCtx.save();
  fMaskCtx.translate(tx, ty);
  fMaskCtx.scale(scale, scale);
  strokeRibbonSlice(fMaskCtx, fPts, 0, fIdx, '#000000', { widthAdd: 52 });
  fMaskCtx.restore();

  fCtx.save();
  fCtx.globalCompositeOperation = 'destination-in';
  fCtx.drawImage(fMaskCanvas, 0, 0);
  fCtx.restore();

  ctx.drawImage(fCanvas, 0, 0);
}

/**
 * Render exact docs/logo.svg compact "FL" emblem onto assets.logoCanvas (760x720)
 * with independent reveal progress fU (gold F) and lU (blue L).
 */
function renderCompactLogoCanvas(assets, fU = 1, lU = 1) {
  const { logoCanvas, logoCtx, compactL, compactLTags, emblemTmp, emblemTmpCtx, emblemShad, emblemShadCtx, fOuterPath, fFacetPath } = assets;
  logoCtx.clearRect(0, 0, 760, 720);

  // 1. Blue Bezier ribbon "L" (exact #ribbon-stroke from docs/logo.svg)
  if (lU > 0) {
    const pts = compactL.points;
    const maxIdx = sampleIndexForU(pts, lU);
    const g = logoCtx.createLinearGradient(695, 55, 275, 635);
    g.addColorStop(0.0, '#1FE0F4');
    g.addColorStop(0.28, '#1ACBF0');
    g.addColorStop(0.58, '#1294EC');
    g.addColorStop(0.86, '#0673F6');
    g.addColorStop(1.0, '#0364F7');

    const overStart = compactLTags['cl-descend-over'].start;
    const preEnd = Math.min(maxIdx, overStart);
    if (preEnd > 0) {
      strokeRibbonSlice(logoCtx, pts, 0, preEnd, g, { roundStart: false, roundEnd: lU < 0.99 });
    }
    if (maxIdx > overStart) {
      // Velvety cobalt overlap shadow strictly onto under-pass
      emblemTmpCtx.clearRect(0, 0, 760, 720);
      strokeRibbonSlice(emblemTmpCtx, pts, overStart, maxIdx, '#004EE0', { widthAdd: 12 });
      emblemShadCtx.clearRect(0, 0, 760, 720);
      emblemShadCtx.save();
      strokeRibbonSlice(emblemShadCtx, pts, 0, compactLTags['cl-ascend'].end, '#000000', { roundStart: false });
      emblemShadCtx.globalCompositeOperation = 'source-in';
      emblemShadCtx.filter = 'blur(8px)';
      emblemShadCtx.globalAlpha = 0.34;
      emblemShadCtx.drawImage(emblemTmp, -2, 8);
      emblemShadCtx.restore();
      logoCtx.drawImage(emblemShad, 0, 0);

      // Raised descending pass
      strokeRibbonSlice(logoCtx, pts, overStart, maxIdx, g, { roundStart: true, roundEnd: lU < 0.99 });
    }

    // Soft cast shadow from golden F onto the left edge of blue L
    if (fU > 0.25) {
      emblemTmpCtx.clearRect(0, 0, 760, 720);
      emblemTmpCtx.save();
      emblemTmpCtx.fillStyle = '#004EE0';
      emblemTmpCtx.fill(fOuterPath);
      emblemTmpCtx.restore();

      emblemShadCtx.clearRect(0, 0, 760, 720);
      emblemShadCtx.save();
      emblemShadCtx.drawImage(logoCanvas, 0, 0);
      emblemShadCtx.globalCompositeOperation = 'source-in';
      emblemShadCtx.filter = 'blur(9px)';
      emblemShadCtx.globalAlpha = 0.28 * clamp((fU - 0.25) / 0.5);
      emblemShadCtx.drawImage(emblemTmp, 6, 10);
      emblemShadCtx.restore();
      logoCtx.drawImage(emblemShad, 0, 0);
    }
  }

  // 2. Golden lightning bolt "F" (exact #bolt-outline + inner facet from docs/logo.svg)
  if (fU > 0) {
    logoCtx.save();
    const amber = logoCtx.createLinearGradient(420, 32, 115, 670);
    amber.addColorStop(0.0, '#F3B216');
    amber.addColorStop(0.36, '#E6A40C');
    amber.addColorStop(0.68, '#D98E03');
    amber.addColorStop(1.0, '#D48801');
    logoCtx.fillStyle = amber;
    logoCtx.fill(fOuterPath);
    logoCtx.save();
    logoCtx.clip(fOuterPath);
    const bright = logoCtx.createLinearGradient(385, 68, 105, 680);
    bright.addColorStop(0.0, '#FCD514');
    bright.addColorStop(0.48, '#FDCE0F');
    bright.addColorStop(0.78, '#F0AE04');
    bright.addColorStop(1.0, '#DE9302');
    logoCtx.fillStyle = bright;
    logoCtx.fill(fFacetPath);
    logoCtx.restore();
    logoCtx.restore();
  }

  return logoCanvas;
}

/**
 * Draw the crisp compact FL emblem centered at (cx, cy) with height = size.
 */
export function drawCompactLogo(ctx, cx, cy, size, { alpha = 1, shadow = true } = {}) {
  if (alpha <= 0.005) return;
  const assets = getBrandAssets();
  const scale = size / 720;
  const w = 760 * scale;
  const h = 720 * scale;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);
  if (shadow) {
    ctx.shadowColor = 'rgba(15, 45, 110, 0.14)';
    ctx.shadowBlur = Math.max(10, size * 0.14);
    ctx.shadowOffsetY = Math.max(4, size * 0.055);
  }
  ctx.drawImage(assets.logoCanvas, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
}

/**
 * Render the complete golden "ast" + blue "lottie" wordmark layers for arbitrary
 * morph / draw parameters.
 */
function buildWordmarkLayers(assets, {
  fU = 1,
  astU = 1,
  astCrossU = 1,
  lottieU = 1,
  lottieCrossU = 1,
  lottieDotU = 1,
  morphSplit = 1, // 0 = compact FL centered together, 1 = expanded full Fastlottie positions!
  astAlpha = 1,
  ottieAlpha = 1,
}) {
  const { strokes, astCanvas, astCtx, astTags, lottieCanvas, lottieCtx, lottieTags, wordCanvas, wordCtx } = assets;

  // Compact FL center positions vs Expanded Fastlottie positions:
  //   Expanded F: tx = 68, ty = 304, scale = 0.618
  //   Compact FL centered at (960, 508) at scale 0.618:
  //     compactTx = 960 - 380 * 0.618 = 725.2, compactTy = 508 - 360 * 0.618 = 285.5
  //   Expanded L (in lottieMain) maps logo SVG [x,y] via:
  //     x_exp = 746.9 + x_svg * 0.578, y_exp = 319.5 + y_svg * 0.578
  //   Notice L's horizontal shift from compact (tx=725.2) to expanded (tx=746.9) is a super gentle +22px,
  //   while F glides smoothly LEFT from 725.2 -> 68 (-657px) to open space for "a s t"!
  //   To make BOTH F and L part symmetrically from dead-center:
  //     Place compact FL centered slightly right at x=960 (tx_compact = 725),
  //     F slides gracefully LEFT (725 -> 68), L glides gently RIGHT (725 -> 747) & settles cleanly!
  const fTx = lerp(708, F_STAGE_TRANSFORM_ALIGNED.tx, morphSplit);
  const fTy = lerp(296, F_STAGE_TRANSFORM_ALIGNED.ty, morphSplit);
  const fScale = lerp(0.618, F_STAGE_TRANSFORM_ALIGNED.scale, morphSplit);

  // L sits cleanly beside F in exact docs/logo.svg proportions at morphSplit = 0,
  // then glides gently right as "ast" & "ottie" unfurl into Fastlottie!
  const lDx = lerp(18, 0, morphSplit);
  const lDy = lerp(-18, 0, morphSplit);

  // 1. Golden "a s t" ribbon
  astCtx.clearRect(0, 0, W, H);
  if ((astU > 0 || astCrossU > 0) && astAlpha > 0.005) {
    const goldGrad = astCtx.createLinearGradient(580, 380, 550, 675);
    goldGrad.addColorStop(0.0, '#FCD616');
    goldGrad.addColorStop(0.38, '#F8C310');
    goldGrad.addColorStop(0.76, '#E8A106');
    goldGrad.addColorStop(1.0, '#DC9003');

    const pts = strokes.ast.points;
    const maxIdx = sampleIndexForU(pts, astU);
    const sStart = astTags['s-exit'].start;
    const preEnd = Math.min(maxIdx, sStart);
    if (preEnd > 0) strokeRibbonSlice(astCtx, pts, 0, preEnd, goldGrad);
    if (maxIdx > sStart) {
      const overEnd = Math.min(maxIdx, astTags['s-exit'].end);
      compositeIsolatedShadow(astCtx, assets, [{ pts, start: astTags['s-belly'].start, end: astTags['s-foot'].end }], pts, sStart, overEnd, {
        color: '#C26B00', shadowSpread: 9, blurSoft: 6, blurCore: 2.2, alphaCore: 0.16, alphaSoft: 0.14, offsetX: 0.5, offsetY: 2.5,
      });
      strokeRibbonSlice(astCtx, pts, sStart, overEnd, goldGrad);
      if (maxIdx > overEnd) strokeRibbonSlice(astCtx, pts, overEnd, maxIdx, goldGrad);
    }

    if (astCrossU > 0) {
      const cPts = strokes.astCrossbar.points;
      const cIdx = sampleIndexForU(cPts, astCrossU);
      compositeIsolatedShadow(astCtx, assets, [{ pts, start: astTags['ft-up'].start, end: astTags['ft-down'].end }], cPts, 0, cIdx, {
        color: '#C26B00', shadowSpread: 11, blurSoft: 6.5, blurCore: 2.2, alphaCore: 0.22, alphaSoft: 0.18, offsetX: 0, offsetY: 4,
      });
      strokeRibbonSlice(astCtx, cPts, 0, cIdx, goldGrad);
    }
  }

  // 2. Luminous Blue "l o t t i e" ribbon
  lottieCtx.clearRect(0, 0, W, H);
  if (lottieU > 0 || lottieCrossU > 0 || lottieDotU > 0) {
    const blueGrad = lottieCtx.createLinearGradient(1320, 330, 1280, 675);
    blueGrad.addColorStop(0.0, '#20E2F5');
    blueGrad.addColorStop(0.28, '#1ACBF0');
    blueGrad.addColorStop(0.58, '#1294EC');
    blueGrad.addColorStop(0.84, '#0673F6');
    blueGrad.addColorStop(1.0, '#0364F7');

    const pts = strokes.lottieMain.points;
    const maxIdx = sampleIndexForU(pts, lottieU);
    const lTailEnd = lottieTags['l-tail'].end;

    // Draw "l" (always full opacity, shifts gently with morphSplit)
    const lMax = Math.min(maxIdx, lTailEnd);
    const lCrossStart = lottieTags['l-descend-over'].start;
    const lPre = Math.min(lMax, lCrossStart);
    if (lPre > 0) strokeRibbonSlice(lottieCtx, pts, 0, lPre, blueGrad);
    if (lMax > lCrossStart) {
      const lOverEnd = Math.min(lMax, lottieTags['l-bowl'].end);
      compositeIsolatedShadow(lottieCtx, assets, [{ pts, start: lottieTags['l-entry'].start, end: lottieTags['l-ascend'].end }], pts, lCrossStart, lOverEnd, {
        color: '#004EE0', shadowSpread: 15, blurSoft: 8.5, blurCore: 2.8, alphaCore: 0.26, alphaSoft: 0.25, offsetX: 1.5, offsetY: 2.5,
      });
      strokeRibbonSlice(lottieCtx, pts, lCrossStart, lOverEnd, blueGrad);
      if (lMax > lOverEnd) strokeRibbonSlice(lottieCtx, pts, lOverEnd, lMax, blueGrad);
    }

    // Draw "o t t i e" (can fade gracefully during fold!)
    if (maxIdx > lTailEnd && ottieAlpha > 0.005) {
      lottieCtx.save();
      lottieCtx.globalAlpha = clamp(ottieAlpha, 0, 1);
      const crossings = [
        {
          start: lottieTags['o-exit-over'].start,
          end: lottieTags['o-exit-over'].end,
          targets: [{ pts, start: lottieTags['o-right'].start, end: lottieTags['o-right'].end }],
          spread: 12, blurSoft: 6.5, blurCore: 2.2, alphaCore: 0.22, alphaSoft: 0.20, offsetX: 0, offsetY: 3,
        },
        {
          start: lottieTags['e-descend-over'].start,
          end: lottieTags['e-bowl'].end,
          targets: [{ pts, start: lottieTags['e-entry'].start, end: lottieTags['e-entry'].end }],
          spread: 14, blurSoft: 7.5, blurCore: 2.5, alphaCore: 0.24, alphaSoft: 0.22, offsetX: 1.5, offsetY: 2.5,
        },
      ];
      let cursor = lTailEnd;
      for (const cross of crossings) {
        if (maxIdx <= cursor) break;
        const preEnd = Math.min(maxIdx, cross.start);
        if (preEnd > cursor) {
          strokeRibbonSlice(lottieCtx, pts, cursor, preEnd, blueGrad);
          cursor = preEnd;
        }
        if (maxIdx > cross.start) {
          const overEnd = Math.min(maxIdx, cross.end);
          compositeIsolatedShadow(lottieCtx, assets, cross.targets, pts, cross.start, overEnd, {
            color: '#004EE0', shadowSpread: cross.spread, blurSoft: cross.blurSoft, blurCore: cross.blurCore,
            alphaCore: cross.alphaCore, alphaSoft: cross.alphaSoft, offsetX: cross.offsetX, offsetY: cross.offsetY,
          });
          strokeRibbonSlice(lottieCtx, pts, cross.start, overEnd, blueGrad);
          cursor = overEnd;
        }
      }
      if (maxIdx > cursor) strokeRibbonSlice(lottieCtx, pts, cursor, maxIdx, blueGrad);

      if (lottieCrossU > 0) {
        const cPts = strokes.lottieCrossbar.points;
        const cIdx = sampleIndexForU(cPts, lottieCrossU);
        compositeIsolatedShadow(lottieCtx, assets, [
          { pts, start: lottieTags['t1-up'].start, end: lottieTags['t1-down'].end },
          { pts, start: lottieTags['t2-up'].start, end: lottieTags['t2-down'].end },
        ], cPts, 0, cIdx, {
          color: '#004EE0', shadowSpread: 11, blurSoft: 6.5, blurCore: 2.2, alphaCore: 0.20, alphaSoft: 0.18, offsetX: 0, offsetY: 4,
        });
        strokeRibbonSlice(lottieCtx, cPts, 0, cIdx, blueGrad);
      }

      if (lottieDotU > 0) {
        const dPts = strokes.lottieDot.points;
        const popScale = lottieDotU < 1
          ? lerp(0.32, 1.0, easeOutExpo(lottieDotU)) * (1 + 0.09 * Math.sin(lottieDotU * Math.PI))
          : 1.0;
        const dIdx = sampleIndexForU(dPts, clamp(lottieDotU * 1.15, 0, 1));
        lottieCtx.save();
        const cx = dPts[0].x - 3;
        const cy = dPts[0].y + 5;
        lottieCtx.translate(cx, cy);
        lottieCtx.scale(popScale, popScale);
        lottieCtx.translate(-cx, -cy);
        strokeRibbonSlice(lottieCtx, dPts, 0, Math.max(1, dIdx), blueGrad);
        lottieCtx.restore();
      }
      lottieCtx.restore();
    }
  }

  // 3. Composite unified wordCanvas
  wordCtx.clearRect(0, 0, W, H);
  // Blue L + ottie first (so in compact FL state, golden F sits crisply IN FRONT of blue L!)
  wordCtx.drawImage(lottieCanvas, lDx, lDy);
  // Golden "ast"
  if (astAlpha > 0.005) {
    wordCtx.save();
    wordCtx.globalAlpha = clamp(astAlpha, 0, 1);
    wordCtx.drawImage(astCanvas, 0, 0);
    wordCtx.restore();
  }
  // Golden stylized F on top!
  paintBoltF(wordCtx, assets, { tx: fTx, ty: fTy, scale: fScale, fU });

  return { wordCanvas, wordCtx };
}

/**
 * Draw the signature "FL <-> Fastlottie" choreography cleanly at any (cx, cy, scale)!
 *
 * mode = 'unfold' (t in [0, 1]):
 *   0.00 - 0.24 : Compact FL emblem sweeps in center-stage (gold F + blue logo L)
 *   0.22 - 0.56 : FL smoothly glides apart into Fastlottie layout
 *   0.32 - 0.66 : Golden "a s t" writes fluently (+ t crossbar)
 *   0.46 - 0.86 : Blue "o t t i e" unspools effortlessly from L's tail (+ tt crossbar & i dot)
 *   0.82 - 1.00 : Luminous Apple studio specular sheen glides across the finished mark
 *
 * mode = 'fold' (t in [0, 1]):
 *   0.00 - 0.16 : Finished Fastlottie catches a soft specular glint
 *   0.14 - 0.52 : "ast" & "ottie" gently retract/fade as F & L glide cleanly together
 *   0.52 - 1.00 : Locks serenely into the iconic compact FL emblem!
 *
 * mode = 'static':
 *   Draws the complete finished Fastlottie calligraphy wordmark cleanly (with optional sheenT).
 */
export function drawFastLottieMorph(ctx, {
  mode = 'unfold',
  progress = 1,
  cx = W / 2,
  cy = H / 2,
  scale = 1.0,
  sheenT = -1,
  alpha = 1,
  shadow = true,
} = {}) {
  if (alpha <= 0.005) return;
  const assets = getBrandAssets();
  const p = clamp(progress, 0, 1);
  const lTailU = assets.strokes.lottieMain.points[assets.lottieTags['l-tail'].end].u;

  let params;
  let internalSheen = sheenT;

  if (mode === 'static') {
    params = {
      fU: 1, astU: 1, astCrossU: 1, lottieU: 1, lottieCrossU: 1, lottieDotU: 1,
      morphSplit: 1, astAlpha: 1, ottieAlpha: 1,
    };
  } else if (mode === 'unfold') {
    const fU = easeOutCubic(norm(p, 0.0, 0.20));
    const lIntroU = easeOutCubic(norm(p, 0.04, 0.26)) * lTailU;
    const morphSplit = easeInOutCubic(norm(p, 0.22, 0.56));
    const astU = easeInOutCubic(norm(p, 0.30, 0.62));
    const astCrossU = easeOutCubic(norm(p, 0.58, 0.67));
    const ottieProgress = easeInOutCubic(norm(p, 0.44, 0.80));
    const lottieU = p < 0.26 ? lIntroU : lerp(lTailU, 1.0, ottieProgress);
    const lottieCrossU = easeOutCubic(norm(p, 0.78, 0.85));
    const lottieDotU = norm(p, 0.84, 0.90);
    if (sheenT < 0) internalSheen = norm(p, 0.84, 1.0);
    params = {
      fU, astU, astCrossU, lottieU, lottieCrossU, lottieDotU,
      morphSplit, astAlpha: 1, ottieAlpha: 1,
    };
  } else {
    // mode === 'fold': Fastlottie gracefully folds back into compact FL emblem!
    const retract = easeInOutCubic(norm(p, 0.14, 0.52));
    const morphSplit = 1 - easeInOutCubic(norm(p, 0.20, 0.68));
    const letterFade = 1 - easeOutCubic(norm(p, 0.14, 0.46));
    if (sheenT < 0) internalSheen = norm(p, 0.0, 0.26);
    params = {
      fU: 1,
      astU: lerp(1, 0.05, retract),
      astCrossU: lerp(1, 0, norm(p, 0.10, 0.30)),
      lottieU: lerp(1, lTailU, retract),
      lottieCrossU: lerp(1, 0, norm(p, 0.10, 0.28)),
      lottieDotU: lerp(1, 0, norm(p, 0.08, 0.24)),
      morphSplit,
      astAlpha: letterFade,
      ottieAlpha: letterFade,
    };
  }

  const { wordCanvas, wordCtx } = buildWordmarkLayers(assets, params);

  // Specular Apple studio sweep
  if (internalSheen > 0 && internalSheen < 1) {
    wordCtx.save();
    wordCtx.globalCompositeOperation = 'source-atop';
    const sweepX = lerp(-240, W + 320, easeInOutCubic(internalSheen));
    const sg = wordCtx.createLinearGradient(sweepX - 240, 220, sweepX + 240, 740);
    sg.addColorStop(0.0, 'rgba(255,255,255,0)');
    sg.addColorStop(0.40, 'rgba(255,255,255,0.22)');
    sg.addColorStop(0.50, 'rgba(255,255,255,0.48)');
    sg.addColorStop(0.60, 'rgba(255,255,255,0.18)');
    sg.addColorStop(1.0, 'rgba(255,255,255,0)');
    wordCtx.fillStyle = sg;
    wordCtx.fillRect(0, 0, W, H);
    wordCtx.restore();
  }

  // Draw centered at (cx, cy) with scale
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  // Wordmark visual center sits at (960, 520)
  if (shadow) {
    ctx.shadowColor = 'rgba(12, 52, 130, 0.12)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;
  }
  ctx.drawImage(wordCanvas, -960, -520);
  if (shadow) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(wordCanvas, -960, -520);
  }
  ctx.restore();
}

// ============================================================================
// APPLE KEYNOTE BACKDROPS, CARDS, PILLS & HUD (DARK OBSIDIAN + CERAMIC LIGHT)
// ============================================================================

export function drawCeramicBackdrop(ctx, t, {
  goldBloom = 0.045,
  blueBloom = 0.052,
  goldX = 0.25,
  blueX = 0.72,
} = {}) {
  const assets = getBrandAssets();
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 60, W * 0.5, H * 0.5, W * 0.74);
  bg.addColorStop(0, K.lightBgCenter);
  bg.addColorStop(0.62, K.lightBgMid);
  bg.addColorStop(1, K.lightBgEdge);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (goldBloom > 0.001) {
    const g = ctx.createRadialGradient(W * goldX, H * 0.48, 30, W * goldX, H * 0.48, W * 0.36);
    g.addColorStop(0, `rgba(252, 206, 20, ${goldBloom})`);
    g.addColorStop(1, 'rgba(252, 206, 20, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  if (blueBloom > 0.001) {
    const b = ctx.createRadialGradient(W * blueX, H * 0.50, 40, W * blueX, H * 0.50, W * 0.42);
    b.addColorStop(0, `rgba(26, 203, 240, ${blueBloom})`);
    b.addColorStop(0.55, `rgba(6, 115, 246, ${blueBloom * 0.38})`);
    b.addColorStop(1, 'rgba(6, 115, 246, 0)');
    ctx.fillStyle = b;
    ctx.fillRect(0, 0, W, H);
  }

  const pat = ctx.createPattern(assets.lightGrain, 'repeat');
  if (pat) {
    ctx.save();
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

export function drawObsidianBackdrop(ctx, t, {
  accent = K.red,
  accentAlpha = 0.14,
  centerX = 0.5,
  centerY = 0.44,
} = {}) {
  const assets = getBrandAssets();
  const bg = ctx.createRadialGradient(W * centerX, H * centerY, 40, W * 0.5, H * 0.5, W * 0.72);
  bg.addColorStop(0, K.darkBgInner);
  bg.addColorStop(1, K.darkBg);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (accentAlpha > 0.001) {
    const glow = ctx.createRadialGradient(W * centerX, H * centerY, 30, W * centerX, H * centerY, W * 0.52);
    glow.addColorStop(0, hexAlpha(accent, accentAlpha));
    glow.addColorStop(0.55, hexAlpha(accent, accentAlpha * 0.25));
    glow.addColorStop(1, 'rgba(8,11,18,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  const pat = ctx.createPattern(assets.darkGrain, 'repeat');
  if (pat) {
    ctx.save();
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

export function drawStudioCard(ctx, x, y, w, h, {
  light = true,
  radius = 24,
  fill = null,
  border = null,
  shadowColor = null,
  shadowBlur = 40,
  shadowOffsetY = 16,
  lineWidth = 1.25,
} = {}) {
  ctx.save();
  ctx.shadowColor = shadowColor || (light ? K.lightCardShadow : 'rgba(0, 0, 0, 0.45)');
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetY = shadowOffsetY;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill || (light ? K.lightCard : K.darkCard);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = border || (light ? K.lightCardBorder : K.darkCardBorder);
  ctx.stroke();

  // Whisper-clean top specular rim
  if (w > 120 && h > 60) {
    const sheen = ctx.createLinearGradient(x + radius, y, x + w - radius, y);
    const rim = light ? '255,255,255' : '255,255,255';
    const peak = light ? 0.85 : 0.16;
    sheen.addColorStop(0, `rgba(${rim},0)`);
    sheen.addColorStop(0.5, `rgba(${rim},${peak})`);
    sheen.addColorStop(1, `rgba(${rim},0)`);
    ctx.strokeStyle = sheen;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + radius, y + 1);
    ctx.lineTo(x + w - radius, y + 1);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawStudioPill(ctx, cx, cy, text, {
  light = true,
  bg = null,
  border = null,
  color = null,
  fontSize = 19,
  mono = true,
  padX = 24,
  height = 44,
  dotColor = null,
  logoBadge = false,
} = {}) {
  ctx.save();
  ctx.font = `700 ${fontSize}px ${mono ? FONT_MONO : FONT_SANS}`;
  const tw = ctx.measureText(text).width;
  const iconExtra = logoBadge ? 34 : dotColor ? 20 : 0;
  const w = tw + padX * 2 + iconExtra;
  const x = cx - w / 2;
  const y = cy - height / 2;

  drawStudioCard(ctx, x, y, w, height, {
    light,
    radius: height / 2,
    fill: bg || (light ? 'rgba(255, 255, 255, 0.90)' : 'rgba(18, 24, 38, 0.92)'),
    border: border || (light ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.14)'),
    shadowBlur: light ? 18 : 20,
    shadowOffsetY: light ? 6 : 8,
    lineWidth: 1.25,
  });

  if (logoBadge) {
    drawCompactLogo(ctx, x + padX + 10, cy, height * 0.56, { shadow: false });
  } else if (dotColor) {
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x + padX + 5, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = color || (light ? K.ink : K.darkText);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX + iconExtra, cy + 1);
  ctx.restore();
}

export function drawStudioHud(ctx, leftLabel, rightLabel, {
  light = true,
  accent = K.blue,
  showMiniLogo = false,
  alpha = 1,
} = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `600 16px ${FONT_MONO}`;
  ctx.textBaseline = 'middle';

  let textX = 94;
  if (showMiniLogo) {
    drawCompactLogo(ctx, 84, 52, 26, { shadow: false });
    textX = 108;
  } else {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(78, 52, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = light ? 'rgba(15, 23, 42, 0.72)' : 'rgba(248, 250, 252, 0.74)';
  ctx.textAlign = 'left';
  ctx.fillText(leftLabel, textX, 53);

  ctx.textAlign = 'right';
  ctx.fillStyle = light ? 'rgba(15, 23, 42, 0.44)' : 'rgba(248, 250, 252, 0.46)';
  ctx.fillText(rightLabel, W - 76, 53);

  ctx.fillStyle = light ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(72, 74, W - 144, 1);
  ctx.restore();
}
