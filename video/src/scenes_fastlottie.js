/**
 * Complete Apple "hello"-inspired 1080p 60fps calligraphy reveal for "Fastlottie":
 *   1. Exact stylized 2-tone golden lightning bolt "F" from docs/logo.svg strikes in
 *      with calligraphic sweep energy.
 *   2. Warm solar-gold cursive "a s t" flows seamlessly out from beneath the "F" blade
 *      with velvety amber 3D self-crossing shadows and a sweeping "t" crossbar.
 *   3. Luminous Lottie cyan-to-royal-blue cursive "l o t t i e" blooms from the iconic
 *      logo "L" with velvety cobalt-blue feathered 3D shadows, double-"tt" crossbar,
 *      and joyful "i" dot.
 *   4. Studio specular light sweep glides smoothly across the complete "Fastlottie" mark.
 */
import {
  W, H, FPS, clamp, lerp, norm, easeOutCubic, easeOutExpo, easeInOutCubic,
} from './engine.js';
import {
  F_STAGE_TRANSFORM_ALIGNED as F_STAGE_TRANSFORM,
  LOGO_F_OUTER_D,
  LOGO_F_FACET_D,
  createFastLottieCalligraphy,
} from './fastlottie_paths.js';

let cached = null;
function getAssets() {
  if (cached) return cached;
  const strokes = createFastLottieCalligraphy();

  const makeCanvas = () => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    return [c, c.getContext('2d')];
  };

  const [wordCanvas, wordCtx] = makeCanvas();
  const [fCanvas, fCtx] = makeCanvas();
  const [fMaskCanvas, fMaskCtx] = makeCanvas();
  const [astCanvas, astCtx] = makeCanvas();
  const [lottieCanvas, lottieCtx] = makeCanvas();
  const [shadowCanvas, shadowCtx] = makeCanvas();
  const [casterCanvas, casterCtx] = makeCanvas();
  const [rawCasterCanvas, rawCasterCtx] = makeCanvas();

  // Ultra-subtle optical ceramic grain tile
  const grainTile = document.createElement('canvas');
  grainTile.width = 160;
  grainTile.height = 160;
  const gctx = grainTile.getContext('2d');
  const gimg = gctx.createImageData(160, 160);
  for (let i = 0; i < gimg.data.length; i += 4) {
    const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const v = Math.floor((s - Math.floor(s)) * 255);
    gimg.data[i] = v;
    gimg.data[i + 1] = v;
    gimg.data[i + 2] = v;
    gimg.data[i + 3] = 5;
  }
  gctx.putImageData(gimg, 0, 0);

  const indexTags = (pts) => {
    const map = {};
    for (let i = 0; i < pts.length; i++) {
      const tag = pts[i].tag;
      if (!map[tag]) map[tag] = { start: i, end: i };
      map[tag].end = i;
    }
    return map;
  };

  cached = {
    strokes,
    fOuterPath: new Path2D(LOGO_F_OUTER_D),
    fFacetPath: new Path2D(LOGO_F_FACET_D),
    astTags: indexTags(strokes.ast.points),
    lottieTags: indexTags(strokes.lottieMain.points),
    wordCanvas, wordCtx,
    fCanvas, fCtx,
    fMaskCanvas, fMaskCtx,
    astCanvas, astCtx,
    lottieCanvas, lottieCtx,
    shadowCanvas, shadowCtx,
    casterCanvas, casterCtx,
    rawCasterCanvas, rawCasterCtx,
    grainTile,
  };
  return cached;
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
  const frac = (u - prev) / Math.max(1e-6, next - prev);
  return (lo - 1) + clamp(frac, 0, 1);
}

// Luminous golden-amber gradient for "a s t" matching F's exact logo palette
function makeGoldRibbonGradient(ctx) {
  const g = ctx.createLinearGradient(580, 380, 550, 675);
  g.addColorStop(0.0, '#FCD616');
  g.addColorStop(0.38, '#F8C310');
  g.addColorStop(0.76, '#E8A106');
  g.addColorStop(1.0, '#DC9003');
  return g;
}

// Luminous cyan -> sky -> royal blue gradient for "l o t t i e" matching docs/logo.svg
function makeBlueRibbonGradient(ctx) {
  const g = ctx.createLinearGradient(1320, 330, 1280, 675);
  g.addColorStop(0.0, '#20E2F5');
  g.addColorStop(0.28, '#1ACBF0');
  g.addColorStop(0.58, '#1294EC');
  g.addColorStop(0.84, '#0673F6');
  g.addColorStop(1.0, '#0364F7');
  return g;
}

function strokeRibbonSlice(ctx, points, i0, i1, fillStyle, {
  widthAdd = 0,
  offsetX = 0,
  offsetY = 0,
  roundStart = true,
  roundEnd = true,
  alpha = 1,
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
  for (let i = startIdx + 1; i <= endIdx; i += 2) {
    if (i > i0 && i < i1) {
      const p = points[i];
      samples.push({
        x: p.x + offsetX,
        y: p.y + offsetY,
        r: (p.width + widthAdd) * 0.5,
      });
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

/**
 * Velvety feathered target-isolated 3D ribbon overlap shadow (harmonious color,
 * zero muddy black, zero hard staircase steps, zero self-shadow artifacts).
 */
function compositeIsolatedShadow(destCtx, assets, targetSpecs, casterPts, c0, c1, {
  color = '#004EE0',
  shadowSpread = 12,
  blurSoft = 8,
  blurCore = 2.8,
  alphaCore = 0.25,
  alphaSoft = 0.24,
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
  strokeRibbonSlice(rcctx, casterPts, c0, c1, color, {
    widthAdd: shadowSpread * 0.45,
    alpha: 1,
  });

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
    if (t.end > t.start + 0.01) {
      strokeRibbonSlice(sctx, t.pts, t.start, t.end, '#000000');
    }
  }
  sctx.globalCompositeOperation = 'source-in';
  sctx.drawImage(casterCanvas, 0, 0);
  sctx.restore();

  destCtx.drawImage(shadowCanvas, 0, 0);
}

/**
 * Render the exact 2-tone stylized golden lightning bolt "F" from docs/logo.svg,
 * revealed smoothly along its calligraphic lightning centerline!
 */
function renderStylizedF(assets, fU) {
  const { fCanvas, fCtx, fMaskCanvas, fMaskCtx, fOuterPath, fFacetPath, strokes } = assets;
  fCtx.clearRect(0, 0, W, H);
  if (fU <= 0) return fCanvas;

  const { scale, tx, ty } = F_STAGE_TRANSFORM;

  // 1. Paint complete 2-tone logo F cleanly onto fCanvas
  fCtx.save();
  fCtx.translate(tx, ty);
  fCtx.scale(scale, scale);

  const amberGrad = fCtx.createLinearGradient(420, 32, 115, 670);
  amberGrad.addColorStop(0.0, '#F3B216');
  amberGrad.addColorStop(0.36, '#E6A40C');
  amberGrad.addColorStop(0.68, '#D98E03');
  amberGrad.addColorStop(1.0, '#D48801');
  fCtx.fillStyle = amberGrad;
  fCtx.fill(fOuterPath);

  fCtx.save();
  fCtx.clip(fOuterPath);
  const brightGrad = fCtx.createLinearGradient(385, 68, 105, 680);
  brightGrad.addColorStop(0.0, '#FCD514');
  brightGrad.addColorStop(0.48, '#FDCE0F');
  brightGrad.addColorStop(0.78, '#F0AE04');
  brightGrad.addColorStop(1.0, '#DE9302');
  fCtx.fillStyle = brightGrad;
  fCtx.fill(fFacetPath);
  fCtx.restore();
  fCtx.restore();

  // 2. If still revealing, mask F progressively with a silky feathered stroke along F's centerline
  if (fU < 0.999) {
    const fPts = strokes.fReveal.points;
    const fIdx = sampleIndexForU(fPts, fU);
    fMaskCtx.clearRect(0, 0, W, H);
    fMaskCtx.save();
    fMaskCtx.translate(tx, ty);
    fMaskCtx.scale(scale, scale);
    strokeRibbonSlice(fMaskCtx, fPts, 0, fIdx, '#000000', {
      widthAdd: 48,
      roundStart: true,
      roundEnd: true,
    });
    fMaskCtx.restore();

    fCtx.save();
    fCtx.globalCompositeOperation = 'destination-in';
    fCtx.drawImage(fMaskCanvas, 0, 0);
    fCtx.restore();
  }

  return fCanvas;
}

/**
 * Render the warm solar-gold cursive "a s t" ribbon with velvety warm-amber shadows.
 */
function renderAstLayer(assets, astU, astCrossU) {
  const { strokes, astCanvas, astCtx, astTags } = assets;
  astCtx.clearRect(0, 0, W, H);
  if (astU <= 0 && astCrossU <= 0) return astCanvas;

  const goldGrad = makeGoldRibbonGradient(astCtx);
  const pts = strokes.ast.points;
  const maxIdx = sampleIndexForU(pts, astU);

  const crossings = [
    {
      // Subtle velvety warm-amber depth where "s" exit glides forward cleanly across its lower smile
      start: astTags['s-exit'].start,
      end: astTags['s-exit'].end,
      targets: [
        { pts, start: astTags['s-belly'].start, end: astTags['s-foot'].end },
      ],
      color: '#C26B00',
      spread: 9,
      blurSoft: 6,
      blurCore: 2.2,
      alphaCore: 0.16,
      alphaSoft: 0.14,
      offsetX: 0.5,
      offsetY: 2.5,
    },
  ];

  let cursor = 0;
  for (const cross of crossings) {
    if (maxIdx <= cursor) break;
    const preEnd = Math.min(maxIdx, cross.start);
    if (preEnd > cursor) {
      strokeRibbonSlice(astCtx, pts, cursor, preEnd, goldGrad);
      cursor = preEnd;
    }
    if (maxIdx > cross.start) {
      const overEnd = Math.min(maxIdx, cross.end);
      compositeIsolatedShadow(astCtx, assets, cross.targets, pts, cross.start, overEnd, {
        color: cross.color,
        shadowSpread: cross.spread,
        blurSoft: cross.blurSoft,
        blurCore: cross.blurCore,
        alphaCore: cross.alphaCore,
        alphaSoft: cross.alphaSoft,
        offsetX: cross.offsetX,
        offsetY: cross.offsetY,
      });
      strokeRibbonSlice(astCtx, pts, cross.start, overEnd, goldGrad);
      cursor = overEnd;
    }
  }
  if (maxIdx > cursor) {
    strokeRibbonSlice(astCtx, pts, cursor, maxIdx, goldGrad);
  }

  // Sweeping golden crossbar for "t" in "Fast"
  if (astCrossU > 0) {
    const cPts = strokes.astCrossbar.points;
    const cIdx = sampleIndexForU(cPts, astCrossU);
    compositeIsolatedShadow(
      astCtx,
      assets,
      [{ pts, start: astTags['ft-up'].start, end: astTags['ft-down'].end }],
      cPts,
      0,
      cIdx,
      {
        color: '#C26B00',
        shadowSpread: 11,
        blurSoft: 6.5,
        blurCore: 2.2,
        alphaCore: 0.22,
        alphaSoft: 0.18,
        offsetX: 0,
        offsetY: 4,
      }
    );
    strokeRibbonSlice(astCtx, cPts, 0, cIdx, goldGrad);
  }

  return astCanvas;
}

/**
 * Render the luminous Lottie cyan->royal-blue "l o t t i e" ribbon with velvety
 * cobalt-blue feathered 3D shadows.
 */
function renderLottieLayer(assets, mainU, crossU, dotU) {
  const { strokes, lottieCanvas, lottieCtx, lottieTags } = assets;
  lottieCtx.clearRect(0, 0, W, H);
  if (mainU <= 0 && crossU <= 0 && dotU <= 0) return lottieCanvas;

  const blueGrad = makeBlueRibbonGradient(lottieCtx);
  const pts = strokes.lottieMain.points;
  const maxIdx = sampleIndexForU(pts, mainU);

  const crossings = [
    {
      start: lottieTags['l-descend-over'].start,
      end: lottieTags['l-bowl'].end,
      targets: [{ pts, start: lottieTags['l-entry'].start, end: lottieTags['l-ascend'].end }],
      spread: 16,
      blurSoft: 8.5,
      blurCore: 2.8,
      alphaCore: 0.26,
      alphaSoft: 0.25,
      offsetX: 1.5,
      offsetY: 2.5,
    },
    {
      start: lottieTags['o-exit-over'].start,
      end: lottieTags['o-exit-over'].end,
      targets: [{ pts, start: lottieTags['o-right'].start, end: lottieTags['o-right'].end }],
      spread: 12,
      blurSoft: 6.5,
      blurCore: 2.2,
      alphaCore: 0.22,
      alphaSoft: 0.20,
      offsetX: 0,
      offsetY: 3,
    },
    {
      start: lottieTags['e-descend-over'].start,
      end: lottieTags['e-bowl'].end,
      targets: [{ pts, start: lottieTags['e-entry'].start, end: lottieTags['e-entry'].end }],
      spread: 14,
      blurSoft: 7.5,
      blurCore: 2.5,
      alphaCore: 0.24,
      alphaSoft: 0.22,
      offsetX: 1.5,
      offsetY: 2.5,
    },
  ];

  let cursor = 0;
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
        color: '#004EE0',
        shadowSpread: cross.spread,
        blurSoft: cross.blurSoft,
        blurCore: cross.blurCore,
        alphaCore: cross.alphaCore,
        alphaSoft: cross.alphaSoft,
        offsetX: cross.offsetX,
        offsetY: cross.offsetY,
      });
      strokeRibbonSlice(lottieCtx, pts, cross.start, overEnd, blueGrad);
      cursor = overEnd;
    }
  }
  if (maxIdx > cursor) {
    strokeRibbonSlice(lottieCtx, pts, cursor, maxIdx, blueGrad);
  }

  // Double-"tt" crossbar with velvety cobalt shadow
  if (crossU > 0) {
    const cPts = strokes.lottieCrossbar.points;
    const cIdx = sampleIndexForU(cPts, crossU);
    compositeIsolatedShadow(
      lottieCtx,
      assets,
      [
        { pts, start: lottieTags['t1-up'].start, end: lottieTags['t1-down'].end },
        { pts, start: lottieTags['t2-up'].start, end: lottieTags['t2-down'].end },
      ],
      cPts,
      0,
      cIdx,
      {
        color: '#004EE0',
        shadowSpread: 11,
        blurSoft: 6.5,
        blurCore: 2.2,
        alphaCore: 0.20,
        alphaSoft: 0.18,
        offsetX: 0,
        offsetY: 4,
      }
    );
    strokeRibbonSlice(lottieCtx, cPts, 0, cIdx, blueGrad);
  }

  // Elastic calligraphic "i" dot
  if (dotU > 0) {
    const dPts = strokes.lottieDot.points;
    const popScale = dotU < 1
      ? lerp(0.32, 1.0, easeOutExpo(dotU)) * (1 + 0.09 * Math.sin(dotU * Math.PI))
      : 1.0;
    const dIdx = sampleIndexForU(dPts, clamp(dotU * 1.15, 0, 1));
    lottieCtx.save();
    const cx = dPts[0].x - 3;
    const cy = dPts[0].y + 5;
    lottieCtx.translate(cx, cy);
    lottieCtx.scale(popScale, popScale);
    lottieCtx.translate(-cx, -cy);
    strokeRibbonSlice(lottieCtx, dPts, 0, Math.max(1, dIdx), blueGrad);
    lottieCtx.restore();
  }

  return lottieCanvas;
}

/**
 * Pristine Apple ceramic-white studio backdrop with whisper-soft warm-gold & cool-cyan
 * dual ambient luminescence echoing the Fastlottie brand palette.
 */
function drawAppleStudioBackdrop(ctx, t, assets) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.46, 60, W * 0.5, H * 0.5, W * 0.72);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(0.64, '#F8FAFD');
  bg.addColorStop(1, '#ECF1F9');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Whisper-soft warm gold glow behind "Fast"
  const goldBloom = 0.045 * easeOutCubic(norm(t, 0.2, 1.6));
  if (goldBloom > 0.001) {
    const g = ctx.createRadialGradient(W * 0.26, H * 0.50, 30, W * 0.26, H * 0.50, W * 0.34);
    g.addColorStop(0, `rgba(252, 206, 20, ${goldBloom})`);
    g.addColorStop(1, 'rgba(252, 206, 20, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Whisper-soft cyan-blue glow behind "lottie"
  const blueBloom = 0.052 * easeOutCubic(norm(t, 2.3, 4.2));
  if (blueBloom > 0.001) {
    const b = ctx.createRadialGradient(W * 0.66, H * 0.49, 40, W * 0.66, H * 0.49, W * 0.42);
    b.addColorStop(0, `rgba(26, 203, 240, ${blueBloom})`);
    b.addColorStop(0.55, `rgba(6, 115, 246, ${blueBloom * 0.4})`);
    b.addColorStop(1, 'rgba(6, 115, 246, 0)');
    ctx.fillStyle = b;
    ctx.fillRect(0, 0, W, H);
  }

  const pat = ctx.createPattern(assets.grainTile, 'repeat');
  if (pat) {
    ctx.save();
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

function penFlowCurve(x, easeStart = 0.08, easeEnd = 0.12) {
  const c = clamp(x, 0, 1);
  if (c < easeStart) return easeStart * easeInOutCubic(c / easeStart);
  if (c > 1 - easeEnd) return (1 - easeEnd) + easeEnd * easeOutCubic((c - (1 - easeEnd)) / easeEnd);
  return c;
}

/**
 * Main 60fps renderer for the 8.2-second complete Apple "hello"-style "Fastlottie" reveal.
 *   0.00s - 0.18s: Pristine Apple ceramic studio opening beat
 *   0.18s - 0.88s: Stylized 2-tone golden lightning bolt "F" strikes/sweeps in
 *   0.78s - 2.48s: Warm golden cursive "a -> s -> t" flows smoothly out from behind "F"
 *   2.36s - 2.66s: Swift golden crossbar crosses "t"
 *   2.46s - 5.26s: Luminous Lottie blue cursive "l -> o -> t -> t -> i -> e" flows seamlessly
 *   5.18s - 5.62s: Confident sweeping double-"tt" crossbar
 *   5.66s - 5.94s: Elastic calligraphic "i" dot pop
 *   6.04s - 7.18s: Luminous Apple specular light sweep across the complete "Fastlottie" mark
 *   7.18s - 8.20s: Serene Apple hero hold
 */
export function renderFastLottieFrame(ctx, frame) {
  const t = frame / FPS;
  const assets = getAssets();

  drawAppleStudioBackdrop(ctx, t, assets);

  // Stroke progress timelines
  const fU = easeOutCubic(norm(t, 0.18, 0.88));
  const astU = penFlowCurve(norm(t, 0.78, 2.48), 0.10, 0.14);
  const astCrossU = easeOutCubic(norm(t, 2.36, 2.66));
  const lottieU = penFlowCurve(norm(t, 2.46, 5.26), 0.08, 0.12);
  const lottieCrossU = easeOutCubic(norm(t, 5.18, 5.62));
  const lottieDotU = norm(t, 5.66, 5.94);
  const sheenT = norm(t, 6.04, 7.18);

  // Render individual layers cleanly
  const fCanvas = renderStylizedF(assets, fU);
  const astCanvas = renderAstLayer(assets, astU, astCrossU);
  const lottieCanvas = renderLottieLayer(assets, lottieU, lottieCrossU, lottieDotU);

  // Composite unified wordmark onto wordCanvas:
  //   1. "a s t" (emerges from behind F's blade)
  //   2. Stylized "F" (sits cleanly ON TOP of "a"'s entry, matching exact logo layering!)
  //   3. "l o t t i e" (picks up cleanly after "t"'s exit)
  const { wordCanvas, wordCtx } = assets;
  wordCtx.clearRect(0, 0, W, H);
  wordCtx.drawImage(astCanvas, 0, 0);
  wordCtx.drawImage(fCanvas, 0, 0);
  wordCtx.drawImage(lottieCanvas, 0, 0);

  // Unified Apple studio specular sweep across the complete "Fastlottie" wordmark
  if (sheenT > 0 && sheenT < 1) {
    wordCtx.save();
    wordCtx.globalCompositeOperation = 'source-atop';
    const sweepX = lerp(-240, W + 320, easeInOutCubic(sheenT));
    const sheen = wordCtx.createLinearGradient(sweepX - 240, 220, sweepX + 240, 740);
    sheen.addColorStop(0.0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.40, 'rgba(255,255,255,0.22)');
    sheen.addColorStop(0.50, 'rgba(255,255,255,0.46)');
    sheen.addColorStop(0.60, 'rgba(255,255,255,0.18)');
    sheen.addColorStop(1.0, 'rgba(255,255,255,0)');
    wordCtx.fillStyle = sheen;
    wordCtx.fillRect(0, 0, W, H);
    wordCtx.restore();
  }

  // Serene Apple camera choreography:
  //   Opens warmly centered on "F" / "Fast" (1.26x), glides seamlessly right & out to 1.00x
  //   dead-center on the full "Fastlottie" wordmark as "lottie" unfolds!
  const camT = easeInOutCubic(norm(t, 0.70, 5.45));
  const camScale = lerp(1.26, 1.0, camT);
  const camShiftX = lerp(490, 0, camT);
  const camShiftY = lerp(10, 0, camT);

  ctx.save();
  ctx.translate(W * 0.5 + camShiftX, H * 0.5 + camShiftY);
  ctx.scale(camScale, camScale);
  ctx.translate(-W * 0.5, -H * 0.5);

  // Subtle airy tinted floating studio shadows (warm amber under Fast, luminous blue under lottie)
  ctx.save();
  ctx.shadowColor = 'rgba(210, 130, 8, 0.14)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 14;
  ctx.drawImage(astCanvas, 0, 0);
  ctx.drawImage(fCanvas, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(6, 115, 246, 0.14)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 14;
  ctx.drawImage(lottieCanvas, 0, 0);
  ctx.restore();

  // Final razor-sharp composite pass with specular sheen
  ctx.drawImage(wordCanvas, 0, 0);
  ctx.restore();
}
