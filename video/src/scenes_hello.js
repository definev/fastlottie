/**
 * Apple "hello"-inspired 1080p 60fps calligraphy ribbon animation for FastLottie.
 * Begins framed on the FastLottie logo's iconic blue cursive "L", then smoothly glides
 * out of the "L" tail to write "lottie" in one unbroken, curvature-weighted calligraphic
 * stream with physically accurate target-only 3D ribbon crossing shadows, luminous
 * cyan-to-royal-blue gradient shading, and an Apple studio specular light sweep.
 */
import {
  W, H, FPS, clamp, lerp, norm, easeOutCubic, easeOutExpo, easeInOutCubic,
} from './engine.js';
import { createLottieCalligraphy } from './hello_paths.js';

let cached = null;
function getAssets() {
  if (cached) return cached;
  const strokes = createLottieCalligraphy();

  // Main offscreen compositing canvas for the ribbon
  const ribbonCanvas = document.createElement('canvas');
  ribbonCanvas.width = W;
  ribbonCanvas.height = H;
  const ribbonCtx = ribbonCanvas.getContext('2d');

  // Dedicated scratch canvases for atomic target-isolated cast shadows (zero self-shadow artifacts!)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = W;
  shadowCanvas.height = H;
  const shadowCtx = shadowCanvas.getContext('2d');

  const casterCanvas = document.createElement('canvas');
  casterCanvas.width = W;
  casterCanvas.height = H;
  const casterCtx = casterCanvas.getContext('2d');

  const rawCasterCanvas = document.createElement('canvas');
  rawCasterCanvas.width = W;
  rawCasterCanvas.height = H;
  const rawCasterCtx = rawCasterCanvas.getContext('2d');

  // Ultra-subtle optical studio grain tile (prevents 8-bit H.264 banding)
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

  // Precompute exact sample index spans for every named calligraphy segment
  const tagRanges = {};
  const pts = strokes.main.points;
  for (let i = 0; i < pts.length; i++) {
    const tag = pts[i].tag;
    if (!tagRanges[tag]) tagRanges[tag] = { start: i, end: i };
    tagRanges[tag].end = i;
  }

  cached = {
    strokes, ribbonCanvas, ribbonCtx, shadowCanvas, shadowCtx,
    casterCanvas, casterCtx, rawCasterCanvas, rawCasterCtx, grainTile, tagRanges,
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

/**
 * Signature FastLottie cyan -> sky -> royal blue ribbon gradient matching docs/logo.svg.
 */
function makeRibbonGradient(ctx) {
  const g = ctx.createLinearGradient(960, 200, 920, 705);
  g.addColorStop(0.0, '#20E2F5');
  g.addColorStop(0.28, '#1ACBF0');
  g.addColorStop(0.58, '#1294EC');
  g.addColorStop(0.84, '#0673F6');
  g.addColorStop(1.0, '#0364F7');
  return g;
}

/**
 * Render a silky variable-width ribbon slice from fractional sample index i0 to i1.
 */
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
 * Cast a physically accurate 3D ribbon overlap shadow EXCLUSIVELY onto the specified
 * underneath ribbon target segments — completely preventing self-shadow crescents on
 * contiguous segments before the crossing!
 */
function compositeIsolatedShadow(assets, targetSpecs, casterPts, c0, c1, {
  shadowSpread = 16,
  blurSoft = 10,
  blurCore = 3.5,
  alphaCore = 0.26,
  alphaSoft = 0.26,
  offsetX = 0,
  offsetY = 3,
} = {}) {
  if (c1 <= c0 + 0.01) return;
  const {
    ribbonCtx: rctx,
    shadowCanvas, shadowCtx: sctx,
    casterCanvas, casterCtx: cctx,
    rawCasterCanvas, rawCasterCtx: rcctx,
  } = assets;

  // Step 1: Draw the solid unioned caster ribbon ONCE with zero blur (instant, uniform alpha)
  rcctx.clearRect(0, 0, W, H);
  strokeRibbonSlice(rcctx, casterPts, c0, c1, '#004EE0', {
    widthAdd: shadowSpread * 0.5,
    alpha: 1,
  });

  // Step 2: Feather the unioned silhouette in just 2 fast single-image Gaussian passes
  cctx.clearRect(0, 0, W, H);
  cctx.save();
  // Broad velvety cobalt ambient shadow
  cctx.filter = `blur(${blurSoft}px)`;
  cctx.globalAlpha = alphaSoft;
  cctx.drawImage(rawCasterCanvas, offsetX, offsetY);
  // Subtle crisp-soft contact edge right along the raised ribbon
  cctx.filter = `blur(${blurCore}px)`;
  cctx.globalAlpha = alphaCore;
  cctx.drawImage(rawCasterCanvas, offsetX * 0.4, offsetY * 0.4);
  cctx.restore();

  // Step 3: Mask ONLY onto the underneath target ribbon strand(s)
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

  // Step 4: Composite luminous sapphire-cobalt shadow onto the ribbon canvas
  rctx.drawImage(shadowCanvas, 0, 0);
}

/**
 * Render the complete progressive calligraphy ribbon onto ribbonCanvas.
 */
function renderRibbonLayer(assets, mainU, crossU, dotU, sheenT) {
  const { strokes, ribbonCanvas, ribbonCtx: rctx, tagRanges } = assets;
  rctx.clearRect(0, 0, W, H);

  const grad = makeRibbonGradient(rctx);
  const mainPts = strokes.main.points;
  const maxMainIdx = sampleIndexForU(mainPts, mainU);

  // Target-isolated self-crossings: each specifies EXACT underneath target span(s)
  // so shadows ONLY fall where the raised ribbon actually passes over an earlier strand!
  const crossings = [
    {
      // "l" descending front leg crossing OVER the ascending back stem
      start: tagRanges['l-descend-over'].start,
      end: tagRanges['l-bowl'].end,
      targets: [
        { pts: mainPts, start: tagRanges['l-entry'].start, end: tagRanges['l-ascend'].end },
      ],
      spread: 24,
      blurSoft: 10,
      blurCore: 3.5,
      alphaCore: 0.26,
      alphaSoft: 0.25,
      offsetX: 2,
      offsetY: 3,
    },
    {
      // "o" cursive top-right exit bridge crossing OVER the ascending right belly of "o"
      start: tagRanges['o-exit-over'].start,
      end: tagRanges['o-exit-over'].end,
      targets: [
        { pts: mainPts, start: tagRanges['o-right'].start, end: tagRanges['o-right'].end },
      ],
      spread: 18,
      blurSoft: 8,
      blurCore: 2.5,
      alphaCore: 0.22,
      alphaSoft: 0.20,
      offsetX: 0,
      offsetY: 4,
    },
    {
      // "e" descending front curve crossing OVER the diagonal entry of "e"
      start: tagRanges['e-descend-over'].start,
      end: tagRanges['e-bowl'].end,
      targets: [
        { pts: mainPts, start: tagRanges['e-entry'].start, end: tagRanges['e-entry'].end },
      ],
      spread: 22,
      blurSoft: 9,
      blurCore: 3,
      alphaCore: 0.24,
      alphaSoft: 0.22,
      offsetX: 2,
      offsetY: 3,
    },
  ];

  // Draw main stroke sequentially with physically isolated overlap shadows
  let cursor = 0;
  for (const cross of crossings) {
    if (maxMainIdx <= cursor) break;

    const preEnd = Math.min(maxMainIdx, cross.start);
    if (preEnd > cursor) {
      strokeRibbonSlice(rctx, mainPts, cursor, preEnd, grad);
      cursor = preEnd;
    }

    if (maxMainIdx > cross.start) {
      const overEnd = Math.min(maxMainIdx, cross.end);
      compositeIsolatedShadow(assets, cross.targets, mainPts, cross.start, overEnd, {
        shadowSpread: cross.spread,
        blurSoft: cross.blurSoft,
        blurCore: cross.blurCore,
        alphaCore: cross.alphaCore,
        alphaSoft: cross.alphaSoft,
        offsetX: cross.offsetX,
        offsetY: cross.offsetY,
      });
      strokeRibbonSlice(rctx, mainPts, cross.start, overEnd, grad);
      cursor = overEnd;
    }
  }

  if (maxMainIdx > cursor) {
    strokeRibbonSlice(rctx, mainPts, cursor, maxMainIdx, grad);
  }

  // --- FINISHING STROKE 2: Sweeping double-"tt" crossbar over both "t" stems ---
  if (crossU > 0) {
    const crossPts = strokes.crossbar.points;
    const crossIdx = sampleIndexForU(crossPts, crossU);
    compositeIsolatedShadow(
      assets,
      [
        { pts: mainPts, start: tagRanges['t1-up'].start, end: tagRanges['t1-down'].end },
        { pts: mainPts, start: tagRanges['t2-up'].start, end: tagRanges['t2-down'].end },
      ],
      crossPts,
      0,
      crossIdx,
      { shadowSpread: 16, blurSoft: 8, blurCore: 2.5, alphaCore: 0.20, alphaSoft: 0.18, offsetY: 5 }
    );
    strokeRibbonSlice(rctx, crossPts, 0, crossIdx, grad);
  }

  // --- FINISHING STROKE 3: Elastic calligraphic "i" dot ---
  if (dotU > 0) {
    const dotPts = strokes.idot.points;
    const popScale = dotU < 1
      ? lerp(0.32, 1.0, easeOutExpo(dotU)) * (1 + 0.09 * Math.sin(dotU * Math.PI))
      : 1.0;
    const dotIdx = sampleIndexForU(dotPts, clamp(dotU * 1.15, 0, 1));
    rctx.save();
    const cx = dotPts[0].x - 4;
    const cy = dotPts[0].y + 8;
    rctx.translate(cx, cy);
    rctx.scale(popScale, popScale);
    rctx.translate(-cx, -cy);
    strokeRibbonSlice(rctx, dotPts, 0, Math.max(1, dotIdx), grad);
    rctx.restore();
  }

  // --- APPLE STUDIO SPECULAR LIGHT SWEEP across the finished ribbon ---
  if (sheenT > 0 && sheenT < 1) {
    rctx.save();
    rctx.globalCompositeOperation = 'source-atop';
    const sweepX = lerp(-240, W + 300, easeInOutCubic(sheenT));
    const sheen = rctx.createLinearGradient(sweepX - 240, 180, sweepX + 240, 740);
    sheen.addColorStop(0.0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.40, 'rgba(255,255,255,0.20)');
    sheen.addColorStop(0.50, 'rgba(255,255,255,0.44)');
    sheen.addColorStop(0.60, 'rgba(255,255,255,0.18)');
    sheen.addColorStop(1.0, 'rgba(255,255,255,0)');
    rctx.fillStyle = sheen;
    rctx.fillRect(0, 0, W, H);
    rctx.restore();
  }

  return ribbonCanvas;
}

/**
 * Pristine Apple ceramic-white studio canvas with whisper-soft cool-cyan luminescence.
 */
function drawAppleStudioBackdrop(ctx, t, assets) {
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.44, 60, W * 0.5, H * 0.5, W * 0.72);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(0.62, '#F7F9FD');
  bg.addColorStop(1, '#EBF1F9');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const bloomAlpha = 0.055 * easeOutCubic(norm(t, 0.15, 2.2));
  if (bloomAlpha > 0.001) {
    const bloom = ctx.createRadialGradient(W * 0.5, H * 0.5, 40, W * 0.5, H * 0.5, W * 0.48);
    bloom.addColorStop(0, `rgba(26, 203, 240, ${bloomAlpha})`);
    bloom.addColorStop(0.55, `rgba(6, 115, 246, ${bloomAlpha * 0.45})`);
    bloom.addColorStop(1, 'rgba(6, 115, 246, 0)');
    ctx.fillStyle = bloom;
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

/**
 * Global handwriting time curve with subtle breathing pause right as the logo's "L"
 * completes, then flowing effortlessly into "ottie" and settling gracefully at the end.
 */
function penProgressCurve(x) {
  const c = clamp(x, 0, 1);
  if (c < 0.08) return 0.08 * easeInOutCubic(c / 0.08);
  if (c > 0.88) return 0.88 + 0.12 * easeOutCubic((c - 0.88) / 0.12);
  return c;
}

/**
 * Main 60fps renderer for the 6.8-second Apple "hello"-style "lottie" animation.
 *   0.00s - 0.22s: Pristine Apple studio beat
 *   0.22s - 1.25s: Framed warmly on the FastLottie logo's iconic blue cursive "L" drawing in
 *   1.25s - 3.95s: Ribbon flows smoothly out of "L" to write "ottie" as camera glides out to center
 *   3.88s - 4.34s: Confident sweeping double-"tt" crossbar with 3D stem shadows
 *   4.38s - 4.66s: Joyful calligraphic "i" dot spring reveal
 *   4.76s - 5.86s: Luminous studio specular light sweep across the finished ribbon
 *   5.86s - 6.80s: Serene Apple hero hold
 */
export function renderHelloFrame(ctx, frame) {
  const t = frame / FPS;
  const assets = getAssets();

  drawAppleStudioBackdrop(ctx, t, assets);

  const mainU = penProgressCurve(norm(t, 0.22, 3.95));
  const crossU = easeOutCubic(norm(t, 3.88, 4.34));
  const dotU = norm(t, 4.38, 4.66);
  const sheenT = norm(t, 4.76, 5.86);

  const ribbonCanvas = renderRibbonLayer(assets, mainU, crossU, dotU, sheenT);

  // Apple camera choreography: opens warmly centered on the "L" (1.22x), then
  // glides smoothly back to 1.00x dead-center as "ottie" unfolds across the stage!
  const camT = easeInOutCubic(norm(t, 0.95, 4.15));
  const camScale = lerp(1.20, 1.0, camT);
  const camShiftX = lerp(420, 0, camT);
  const camShiftY = lerp(24, 0, camT);

  ctx.save();
  ctx.translate(W * 0.5 + camShiftX, H * 0.5 + camShiftY);
  ctx.scale(camScale, camScale);
  ctx.translate(-W * 0.5, -H * 0.5);

  // Airy studio ambient drop shadow tinted cleanly in Lottie blue
  ctx.shadowColor = 'rgba(6, 115, 246, 0.14)';
  ctx.shadowBlur = 34;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(ribbonCanvas, 0, 0);

  // Second crisp pass for razor-sharp anti-aliased edges
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.drawImage(ribbonCanvas, 0, 0);
  ctx.restore();
}
