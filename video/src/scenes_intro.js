/**
 * 68-Second 4-Act Dark-to-Light Apple Keynote Launch Film for FastLottie (1080p 60fps).
 *
 *   ACT I  ( 0.00 - 19.00s) · OBSIDIAN STUDIO : The Dogma & Native Meltdown -> 3.27 GiB -> Breath
 *   ACT II (19.00 - 25.60s) · CERAMIC WHITE   : Light breaks — FL unfolds into calligraphic Fastlottie!
 *   ACT III(25.60 - 51.05s) · CERAMIC WHITE   : Exact 14-bar 132 BPM Proofs (Parse Race, 90 Hz Split, 3 Arch Cards)
 *   ACT IV (51.05 - 68.00s) · CONTRAST FINALE : Full-Circle Crescendo, Live Dart Code, Pure Minimalist Outro!
 */
import {
  W, H, FONT_MONO,
  clamp, lerp, norm, easeOutExpo, easeOutCubic, easeInOutCubic, easeOutBack,
  spring, hash, hexAlpha,
  drawKineticText, drawSprite,
} from './engine.js';
import {
  K,
  drawObsidianBackdrop, drawCeramicBackdrop,
  drawStudioCard, drawStudioPill, drawStudioHud,
  drawCompactLogo, drawFastLottieMorph,
} from './brand_kit.js';

function makeBlueGrad(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, K.cyan);
  g.addColorStop(0.55, K.blue);
  g.addColorStop(1, K.royal);
  return g;
}

function makeGoldGrad(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, K.goldBright);
  g.addColorStop(0.55, K.gold);
  g.addColorStop(1, K.goldDeep);
  return g;
}

function makeBrandDualGrad(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, K.gold);
  g.addColorStop(0.45, K.cyan);
  g.addColorStop(1, K.royal);
  return g;
}

// =========================================================================
// SCENE 1 (0.00s - 6.80s): THE DOGMA (Restrained Matte Obsidian)
// =========================================================================
function renderScene1(ctx, t, sprites) {
  drawObsidianBackdrop(ctx, t, {
    accent: t > 4.20 ? K.red : K.blue,
    accentAlpha: t > 4.20 ? 0.16 : 0.10,
  });

  if (t < 4.20) {
    const fadeOut = t > 3.85 ? 1 - easeInOutCubic(norm(t, 3.85, 4.20)) : 1;
    const p1 = spring(t - 0.22, { stiffness: 240, damping: 22 });
    drawKineticText(ctx, 'Everyone knows the rule.', W / 2, lerp(H * 0.41 + 24, H * 0.39, clamp(p1)), {
      size: 54, weight: 600, color: K.darkMuted, tracking: 0.0, alpha: clamp(p1) * fadeOut,
    });

    if (t >= 1.42) {
      const p2 = spring(t - 1.45, { stiffness: 260, damping: 22 });
      const s2 = lerp(1.06, 1.0, clamp(p2));
      drawKineticText(ctx, 'Cross-platform is always', W / 2, H * 0.515, {
        size: 96, weight: 700, color: K.darkText, tracking: -0.005, scale: s2, alpha: clamp(p2) * fadeOut,
      });
      drawKineticText(ctx, 'slower than native.', W / 2, H * 0.625, {
        size: 108, weight: 760, color: '#FFFFFF', tracking: -0.006, scale: s2, alpha: clamp(p2) * fadeOut,
      });

      const lineP = easeOutExpo(norm(t, 1.78, 2.35));
      const lw = 860 * lineP;
      ctx.save();
      ctx.globalAlpha = fadeOut;
      ctx.fillStyle = K.redBright;
      ctx.beginPath();
      ctx.roundRect(W / 2 - lw / 2, H * 0.70, lw, 4, 2);
      ctx.fill();
      ctx.restore();
    }
    return;
  }

  // Phase B (4.20 - 6.80s): "...until you put 16 stickers on 90 Hz." + clean 4x4 bloom
  const dt = t - 4.24;
  const p = spring(dt, { stiffness: 280, damping: 22 });

  if (t > 4.62) {
    const gridSize = 144;
    const gap = 36;
    const totalW = 4 * gridSize + 3 * gap;
    const totalH = 4 * gridSize + 3 * gap;
    const ox = (W - totalW) / 2;
    const oy = (H - totalH) / 2;
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const delay = (col + row) * 0.035;
      const sp = easeOutBack(norm(t, 4.65 + delay, 5.15 + delay));
      const tx = ox + col * (gridSize + gap);
      const ty = oy + row * (gridSize + gap);
      drawSprite(ctx, sprites, `emoji_${i}`, lerp(W / 2 - gridSize / 2, tx, sp), lerp(H / 2 - gridSize / 2, ty, sp), gridSize * (0.45 + 0.55 * sp), t, {
        phase: i * 0.17, alpha: 0.42 * clamp(sp),
      });
    }
  }

  const plate = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 720);
  plate.addColorStop(0, 'rgba(8, 11, 18, 0.92)');
  plate.addColorStop(0.68, 'rgba(8, 11, 18, 0.54)');
  plate.addColorStop(1, 'rgba(8, 11, 18, 0)');
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, W, H);

  drawKineticText(ctx, '...until you put', W / 2, H * 0.39, {
    size: 54, weight: 700, color: '#FDA4AF', tracking: 0.0, alpha: clamp(p),
  });
  drawKineticText(ctx, '16 stickers on 90 Hz.', W / 2, H * 0.525, {
    size: 118, weight: 760, color: '#FFFFFF', tracking: -0.006,
    scale: lerp(1.10, 1.0, clamp(p)), alpha: clamp(p),
  });
}

// =========================================================================
// SCENE 2 (6.80s - 19.00s): THE NATIVE MELTDOWN (Surgical Dark Hardware Studio)
// =========================================================================
function renderScene2(ctx, t, sprites) {
  // 18.35 - 19.00s : PURE MATTE BLACK BREATH (before light breaks!)
  if (t >= 18.35) {
    ctx.fillStyle = '#05070C';
    ctx.fillRect(0, 0, W, H);
    return;
  }

  // Sub-scene 2A (6.80 - 10.40s): Pixel 7a Native Kotlin lottie-android HW -> 100% OVER BUDGET
  if (t < 10.40) {
    const dt = t - 6.80;
    drawObsidianBackdrop(ctx, t, { accent: K.red, accentAlpha: 0.15, centerX: 0.30 });
    drawStudioHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', '16 UNIQUE LOTTIE STICKERS', {
      light: false, accent: K.redBright,
    });

    const enter = easeOutExpo(norm(dt, 0, 0.42));
    const cardX = lerp(-60, 88, enter);
    drawStudioCard(ctx, cardX, 118, 820, 868, {
      light: false, fill: K.redDarkBg, border: K.redBorder,
    });
    drawStudioPill(ctx, cardX + 276, 184, 'NATIVE KOTLIN · lottie-android 6.7.1', {
      light: false, bg: 'rgba(225,29,72,0.18)', border: K.redBorder, color: '#FDA4AF',
      fontSize: 18, dotColor: K.redBright,
    });
    drawKineticText(ctx, 'HW ASYNC · SHARED COMPOSITION', cardX + 48, 248, {
      size: 20, weight: 700, color: K.darkMuted, align: 'left', font: FONT_MONO, tracking: 0.04,
    });

    const pctVal = Math.min(100, easeOutCubic(norm(dt, 0.12, 0.85)) * 100);
    drawKineticText(ctx, `${pctVal.toFixed(0)}%`, cardX + 44, 392, {
      size: 172, weight: 760, color: K.redBright, align: 'left', tracking: 0.0,
    });
    drawKineticText(ctx, 'frames over 11.11 ms budget', cardX + 48, 504, {
      size: 32, weight: 700, color: K.darkText, align: 'left', tracking: 0.0,
    });

    // Clean HWUI frame-time chart
    const gx = cardX + 48, gy = 576, gw = 724, gh = 240;
    drawStudioCard(ctx, gx, gy, gw, gh, {
      light: false, radius: 16, fill: 'rgba(8, 10, 16, 0.90)', border: 'rgba(255,255,255,0.08)', shadowBlur: 0,
    });
    const budgetY = gy + gh - (11.11 / 38) * (gh - 28) - 10;
    const bars = 42, bw = (gw - 28) / bars;
    for (let i = 0; i < bars; i++) {
      const sample = 18 + hash(i * 3.7 + Math.floor(t * 14)) * 16.5;
      const bh = Math.min(gh - 22, (sample / 38) * (gh - 28));
      ctx.fillStyle = sample > 26 ? '#F43F5E' : '#E11D48';
      ctx.beginPath();
      ctx.roundRect(gx + 14 + i * bw, gy + gh - 10 - bh, bw - 3.5, bh, 3);
      ctx.fill();
    }
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = K.goldBright;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx + 12, budgetY);
    ctx.lineTo(gx + gw - 12, budgetY);
    ctx.stroke();
    ctx.restore();
    drawKineticText(ctx, '11.11 ms BUDGET', gx + gw - 20, budgetY - 16, {
      size: 15, weight: 700, color: K.goldBright, align: 'right', font: FONT_MONO,
    });

    drawKineticText(ctx, 'FRAME TIME: 25.6 ms MED  ·  34.3 ms p95', cardX + 48, 874, {
      size: 21, weight: 700, color: '#FDA4AF', align: 'left', font: FONT_MONO,
    });
    drawKineticText(ctx, 'GPU RenderNode mode hits the exact same 100% wall.', cardX + 48, 922, {
      size: 20, weight: 500, color: K.darkMuted, align: 'left',
    });

    // Right: Stuttering 4x4 grid
    const rx = lerp(W + 60, 984, enter);
    drawStudioCard(ctx, rx, 118, 848, 868, {
      light: false, fill: K.darkCard, border: 'rgba(244, 63, 94, 0.28)',
    });
    const liveFps = 29 + Math.floor(hash(Math.floor(t * 7)) * 11);
    drawStudioPill(ctx, rx + 424, 174, `${liveFps} FPS  ·  TARGET 90 FPS`, {
      light: false, bg: 'rgba(225,29,72,0.18)', border: K.redBorder, color: '#FDA4AF',
      fontSize: 19, dotColor: K.redBright,
    });
    const cell = 158, gap = 22, gox = rx + (848 - (4 * cell + 3 * gap)) / 2, goy = 232;
    for (let i = 0; i < 16; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const sx = gox + col * (cell + gap), sy = goy + row * (cell + gap);
      const dropped = (Math.floor(t * 8) + i * 3) % 5 === 0;
      if (dropped) {
        ctx.fillStyle = 'rgba(225,29,72,0.10)';
        ctx.strokeStyle = 'rgba(244,63,94,0.45)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.roundRect(sx - 6, sy - 6, cell + 12, cell + 12, 16);
        ctx.fill();
        ctx.stroke();
      }
      drawSprite(ctx, sprites, `emoji_${i}`, sx, sy, cell, t, { phase: i * 0.19, stutterFps: 8 });
    }
    return;
  }

  // Sub-scene 2B (10.40 - 14.20s): Pure Native C++ dotlottie-android
  if (t < 14.20) {
    const dt = t - 10.40;
    drawObsidianBackdrop(ctx, t, { accent: K.amber, accentAlpha: 0.12 });
    drawStudioHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', 'PURE NATIVE C++ BASELINE', {
      light: false, accent: K.amber,
    });

    drawStudioPill(ctx, W / 2, 148, 'dotlottie-android 0.18.0 · C++ THORVG (NO FLUTTER)', {
      light: false, bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.45)',
      color: '#FDE68A', fontSize: 21, dotColor: K.amber,
    });

    const p1 = spring(dt - 0.04, { stiffness: 250, damping: 21 });
    const p2 = spring(dt - 0.18, { stiffness: 250, damping: 21 });

    // Panel Left: 62.9% JANK
    const lx = 104, ly = lerp(280, 214, clamp(p1));
    drawStudioCard(ctx, lx, ly, 820, 728, { light: false, fill: K.redDarkBg, border: K.redBorder });
    drawKineticText(ctx, '16 UNIQUE STICKERS', lx + 48, ly + 62, {
      size: 22, weight: 700, color: K.darkMuted, align: 'left', font: FONT_MONO,
    });
    drawKineticText(ctx, `${(62.9 * easeOutCubic(norm(dt, 0.1, 0.75))).toFixed(1)}%`, lx + 44, ly + 220, {
      size: 162, weight: 760, color: K.redBright, align: 'left', tracking: 0.0,
    });
    drawKineticText(ctx, 'frames over 11.11 ms', lx + 48, ly + 332, {
      size: 34, weight: 700, color: K.darkText, align: 'left', tracking: 0.0,
    });
    drawKineticText(ctx, '12.4 ms MED  ·  15.7 ms p95 FRAME TIME', lx + 48, ly + 392, {
      size: 21, weight: 600, color: K.darkMuted, align: 'left', font: FONT_MONO,
    });
    for (let i = 0; i < 4; i++) {
      drawSprite(ctx, sprites, `emoji_${i + 4}`, lx + 56 + i * 180, ly + 492, 144, t, {
        phase: i * 0.25, stutterFps: 11,
      });
    }

    // Panel Right: 668.3 ms COLD LOAD + clean 6x4 tile ripple
    const rx = 996, ry = lerp(280, 214, clamp(p2));
    drawStudioCard(ctx, rx, ry, 820, 728, {
      light: false, fill: 'rgba(22, 18, 12, 0.92)', border: 'rgba(245, 158, 11, 0.38)',
    });
    drawKineticText(ctx, '24× SHARED STICKER', rx + 48, ry + 62, {
      size: 22, weight: 700, color: K.darkMuted, align: 'left', font: FONT_MONO,
    });
    const loadProg = easeInOutCubic(norm(dt, 0.18, 2.10));
    drawKineticText(ctx, `${(668.3 * loadProg).toFixed(1)} ms`, rx + 44, ry + 220, {
      size: 132, weight: 760, color: K.goldBright, align: 'left', font: FONT_MONO, tracking: 0.0,
    });
    drawKineticText(ctx, 'cold load freeze', rx + 48, ry + 332, {
      size: 34, weight: 700, color: K.darkText, align: 'left', tracking: 0.0,
    });
    drawKineticText(ctx, '24× THORVG INSTANCES  ·  64.1% JANK', rx + 48, ry + 392, {
      size: 21, weight: 600, color: K.darkMuted, align: 'left', font: FONT_MONO,
    });

    const loaded = Math.min(24, Math.floor(loadProg * 24));
    const cw = 110, ch = 46, cgap = 12;
    for (let i = 0; i < 24; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      const bx = rx + 48 + col * (cw + cgap), by = ry + 458 + row * (ch + cgap);
      const done = i < loaded, cur = i === loaded;
      ctx.fillStyle = cur ? K.goldBright : done ? 'rgba(245,158,11,0.22)' : 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = cur ? '#FEF08A' : done ? 'rgba(245,158,11,0.52)' : 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bx, by, cw, ch, 9);
      ctx.fill();
      ctx.stroke();
      drawKineticText(ctx, `#${String(i + 1).padStart(2, '0')}`, bx + cw / 2, by + ch / 2, {
        size: 16, weight: 700, color: cur ? '#09090B' : done ? '#FDE68A' : K.darkDim, font: FONT_MONO,
      });
    }
    return;
  }

  // Sub-scene 2C (14.20 - 18.35s): APPLE M5 lottie-ios FALLBACK -> 3.27 GiB MEMORY TIDE
  const dt = t - 14.20;
  const exploded = t >= 16.70;
  const spinP = norm(t, 15.00, 16.70);

  drawObsidianBackdrop(ctx, t, {
    accent: K.red,
    accentAlpha: exploded ? 0.30 : 0.12 + spinP * 0.16,
  });

  // Ominous rising crimson memory tide
  const tideH = (exploded ? 1.0 : Math.pow(spinP, 1.45)) * H;
  const tideGrad = ctx.createLinearGradient(0, H - tideH, 0, H);
  tideGrad.addColorStop(0, exploded ? 'rgba(225,29,72,0.20)' : 'rgba(225,29,72,0.14)');
  tideGrad.addColorStop(1, 'rgba(225,29,72,0.02)');
  ctx.fillStyle = tideGrad;
  ctx.fillRect(0, H - tideH, W, tideH);
  if (spinP > 0.02 && !exploded) {
    ctx.fillStyle = 'rgba(244,63,94,0.72)';
    ctx.fillRect(0, H - tideH, W, 2);
  }

  drawStudioHud(ctx, 'APPLE M5 · 120 HZ', 'NATIVE SWIFT · lottie-ios 4.6.1 · 24× STICKERS', {
    light: false, accent: K.redBright,
  });

  for (let i = 0; i < 24; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    drawSprite(ctx, sprites, 'phoenix', 210 + col * 260, 150 + row * 210, 145, t, {
      stutterFps: 7, alpha: exploded ? 0.12 : 0.18,
    });
  }

  const fellBack = t >= 14.80;
  drawStudioPill(
    ctx, W / 2, 210,
    fellBack ? 'FALLBACK · 0 CA / 24 MAIN THREAD' : 'CORE ANIMATION (.automatic)',
    {
      light: false,
      bg: fellBack ? 'rgba(225, 29, 72, 0.24)' : 'rgba(18, 148, 236, 0.16)',
      border: fellBack ? K.redBright : K.cyan,
      color: fellBack ? '#FDA4AF' : '#BAE6FD',
      fontSize: 22, dotColor: fellBack ? K.redBright : K.cyan, height: 52, padX: 28,
    }
  );

  const ramMb = exploded ? 3271.4 : lerp(120, 3271.4, Math.pow(spinP, 1.85));
  const ramLabel = ramMb >= 1000 ? `${(ramMb / 1000).toFixed(2)} GiB` : `${Math.round(ramMb)} MiB`;
  const scale = exploded ? lerp(1.14, 1.04, easeOutExpo(norm(t, 16.70, 17.45))) : 0.94 + spinP * 0.10;

  drawKineticText(ctx, 'PHYSICAL RAM', W / 2, 368, {
    size: 26, weight: 700, color: '#FB7185', font: FONT_MONO, tracking: 0.14,
  });
  drawKineticText(ctx, ramLabel, W / 2, 540, {
    size: 214, weight: 760, color: exploded ? '#FFFFFF' : '#FDA4AF', tracking: 0.005, scale,
  });
  drawKineticText(
    ctx,
    exploded ? '56.7% JANK  ·  116.1 ms p95  ·  72.2% CPU' : 'ALLOCATING 24× LAYER BACKINGS...',
    W / 2, 726,
    { size: exploded ? 34 : 24, weight: 700, color: exploded ? '#FECDD3' : K.darkMuted, font: FONT_MONO, tracking: 0.04 }
  );
}

// =========================================================================
// SCENE 3 (19.00s - 25.60s): LIGHT BREAKS — FL UNFOLDS INTO FASTLOTTIE!
// =========================================================================
function renderScene3(ctx, t, sprites) {
  const dt = t - 19.00;
  // Radiant Ceramic White studio blooming cleanly out of the black silence!
  drawCeramicBackdrop(ctx, t, {
    goldBloom: 0.055 * easeOutCubic(norm(dt, 0.1, 1.6)),
    blueBloom: 0.060 * easeOutCubic(norm(dt, 0.4, 2.0)),
  });

  // Soft perimeter ring of real 60fps FastLottie stickers gliding serenely behind the typography
  const orbitCount = 10;
  const orbitP = easeOutExpo(norm(dt, 0.55, 2.2));
  for (let i = 0; i < orbitCount; i++) {
    const ang = (i / orbitCount) * Math.PI * 2 + dt * 0.28;
    const x = W / 2 + Math.cos(ang) * 845 * orbitP;
    const y = H / 2 + Math.sin(ang) * 448 * orbitP;
    const depth = (Math.sin(ang) + 1) / 2;
    const size = lerp(88, 134, depth) * (0.5 + 0.5 * orbitP);
    const name = i % 3 === 0 ? 'phoenix' : `emoji_${(i * 3) % 16}`;
    drawSprite(ctx, sprites, name, x - size / 2, y - size / 2, size, t, {
      phase: i * 0.23,
      alpha: lerp(0.18, 0.42, depth) * orbitP,
      frameWindow: name === 'phoenix' ? [0, 26] : null,
    });
  }

  // Soft white center clarity veil so the calligraphic mark shines with Apple purity
  const veil = ctx.createRadialGradient(W / 2, H * 0.48, 120, W / 2, H * 0.48, 760);
  veil.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
  veil.addColorStop(0.65, 'rgba(249, 251, 255, 0.58)');
  veil.addColorStop(1, 'rgba(249, 251, 255, 0)');
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  // THE CENTERPIECE: Compact FL logo glides open into full calligraphic Fastlottie!
  const unfoldP = norm(dt, 0.08, 4.45);
  const heroScale = lerp(1.04, 0.90, easeInOutCubic(norm(dt, 1.0, 4.1)));
  drawFastLottieMorph(ctx, {
    mode: 'unfold',
    progress: unfoldP,
    cx: W / 2,
    cy: H * 0.455,
    scale: heroScale,
  });

  // Pure minimalist slogan directly beneath — zero badge clutter
  const pSub = spring(dt - 3.20, { stiffness: 215, damping: 22 });
  drawKineticText(
    ctx,
    'Faster than native — the Lottie renderer Flutter deserves',
    W / 2,
    lerp(H * 0.725, H * 0.70, clamp(pSub)),
    { size: 42, weight: 600, color: K.inkSub, tracking: 0.0, alpha: clamp(pSub) }
  );

  // Smooth fade from black silence into light (0.00 - 0.28s)
  if (dt < 0.28) {
    ctx.fillStyle = `rgba(5, 7, 12, ${1 - easeOutCubic(dt / 0.28)})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// =========================================================================
// SCENE 4 (25.60s - 32.87s): UTF-8 BYTE PARSE RACE (Ceramic Light + Solar Gold!)
// =========================================================================
function renderScene4(ctx, t) {
  const dt = t - 25.60;
  drawCeramicBackdrop(ctx, t, { goldBloom: 0.065, blueBloom: 0.03, goldX: 0.5, blueX: 0.85 });
  drawStudioHud(ctx, 'DIRECT UTF-8 BYTE PARSER', 'ARM64 RELEASE · MEDIAN PARSE TIME', {
    light: true, showMiniLogo: true,
  });

  const pHead = spring(dt, { stiffness: 240, damping: 22 });
  drawKineticText(ctx, 'They said Dart can’t beat Swift or Kotlin.', W / 2, lerp(128, 148, clamp(pHead)), {
    size: 58, weight: 760, color: K.ink, tracking: -0.005, alpha: clamp(pHead),
  });
  drawKineticText(ctx, 'ZERO-DOM BYTE PARSING  ·  LOWER IS FASTER', W / 2, 214, {
    size: 21, weight: 700, color: K.goldText, font: FONT_MONO, tracking: 0.08, alpha: clamp(pHead),
  });

  const raceStart = 0.50;
  const fmtUs = (us) => (us >= 1000 ? `${(us / 1000).toFixed(2)} ms` : `${Math.round(us)} µs`);

  const drawRaceCard = (x, title, badge, rows, heroMult) => {
    drawStudioCard(ctx, x, 266, 848, 712, { light: true, fill: K.lightCardStrong });
    drawKineticText(ctx, title, x + 44, 328, { size: 30, weight: 700, color: K.ink, align: 'left', tracking: 0.0 });
    drawStudioPill(ctx, x + 692, 328, badge, {
      light: true, bg: 'rgba(15,23,42,0.04)', border: K.lightCardBorder, color: K.inkMuted, fontSize: 17, height: 36,
    });

    const mScale = spring(dt - 0.95, { stiffness: 240, damping: 20 });
    const gGrad = makeGoldGrad(ctx, 0, -34, 460, 36);
    drawKineticText(ctx, heroMult, x + 44, 426, {
      size: 72, weight: 760, color: gGrad, align: 'left', tracking: -0.005,
      scale: lerp(0.92, 1.0, clamp(mScale)),
    });

    const maxTrackW = 452;
    let ry = 532;
    for (let idx = 0; idx < rows.length; idx++) {
      const r = rows[idx];
      drawKineticText(ctx, r.name, x + 44, ry, {
        size: 19, weight: 700, color: K.inkSub, align: 'left', font: FONT_MONO,
      });

      const fastFrac = r.fast / r.nat;
      const fastP = easeOutExpo(norm(dt, raceStart + idx * 0.14, raceStart + idx * 0.14 + 0.52));
      const natP = easeOutCubic(norm(dt, raceStart + idx * 0.14, raceStart + idx * 0.14 + 1.90));

      // FastLottie bar (Solar Gold gradient!) + live µs counter + ✓ lock
      const fy = ry + 26;
      const fw = Math.max(22, maxTrackW * fastFrac * fastP);
      const fg = ctx.createLinearGradient(x + 44, fy, x + 44 + fw, fy);
      fg.addColorStop(0, K.goldBright);
      fg.addColorStop(1, K.goldDeep);
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.roundRect(x + 44, fy, fw, 26, 7);
      ctx.fill();
      const locked = fastP > 0.98 ? ' ✓' : '';
      drawKineticText(ctx, `FastLottie  ${fmtUs(r.fast * fastP)}${locked}`, x + 58 + fw, fy + 14, {
        size: 19, weight: 700, color: K.goldText, align: 'left', font: FONT_MONO,
      });

      // Native bar (clean muted coral-rose)
      const ny = ry + 60;
      const nw = Math.max(24, maxTrackW * natP);
      ctx.fillStyle = 'rgba(225, 29, 72, 0.72)';
      ctx.beginPath();
      ctx.roundRect(x + 44, ny, nw, 26, 7);
      ctx.fill();
      drawKineticText(ctx, `${r.natName}  ${fmtUs(r.nat * natP)}`, x + 58 + nw, ny + 14, {
        size: 19, weight: 700, color: K.red, align: 'left', font: FONT_MONO,
      });
      ry += 140;
    }
  };

  drawRaceCard(92, 'vs Native Kotlin (Pixel 7a)', 'lottie-android 6.7.1', [
    { name: 'Simple Icon  ·  17.5×', fast: 43, nat: 751, natName: 'Kotlin' },
    { name: 'Complex Sticker  ·  5.5×', fast: 1511, nat: 8345, natName: 'Kotlin' },
    { name: 'Heavy Phoenix  ·  3.0×', fast: 12102, nat: 35878, natName: 'Kotlin' },
  ], '2× – 17.5× FASTER');

  drawRaceCard(980, 'vs Native Swift (Apple M5)', 'lottie-ios 4.6.1', [
    { name: 'Complex Sticker  ·  10.3×', fast: 537, nat: 5533, natName: 'Swift' },
    { name: 'Shape Morph  ·  8.2×', fast: 691, nat: 5683, natName: 'Swift' },
    { name: 'Heavy Phoenix  ·  4.9×', fast: 6527, nat: 31997, natName: 'Swift' },
  ], '4.2× – 10.3× FASTER');
}

// =========================================================================
// SCENE 5 (32.87s - 40.15s): 90 HZ SPLIT-SCREEN (DARK NATIVE vs LIGHT FASTLOTTIE!)
// =========================================================================
function renderScene5(ctx, t, sprites) {
  const dt = t - 32.87;
  const enter = easeOutExpo(norm(dt, 0, 0.45));

  // Literal dark-vs-light studio split down the middle!
  ctx.fillStyle = K.darkBg;
  ctx.fillRect(0, 0, W / 2, H);
  ctx.save();
  ctx.beginPath();
  ctx.rect(W / 2, 0, W / 2, H);
  ctx.clip();
  drawCeramicBackdrop(ctx, t, { goldBloom: 0.02, blueBloom: 0.065, blueX: 0.78 });
  ctx.restore();

  // Crisp divider line & VS badge
  ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.fillRect(W / 2 - 1, 78, 2, H - 130);
  drawStudioPill(ctx, W / 2, 126, 'VS', {
    light: true, bg: '#FFFFFF', border: K.lightCardBorder, color: K.ink, fontSize: 20, height: 44, padX: 20,
  });

  // Dual-tone top HUD
  ctx.save();
  ctx.font = `600 16px ${FONT_MONO}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = K.redBright;
  ctx.beginPath();
  ctx.arc(76, 48, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(248, 250, 252, 0.75)';
  ctx.textAlign = 'left';
  ctx.fillText('HEAD-TO-HEAD · 16 UNIQUE STICKERS', 92, 49);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.62)';
  ctx.textAlign = 'right';
  ctx.fillText('GOOGLE PIXEL 7a · 90 HZ (11.11 ms BUDGET)', W - 76, 49);
  ctx.restore();

  // LEFT HALF: DARK NATIVE ANDROID
  const lx = lerp(-80, 68, enter);
  const natFps = 31 + Math.floor(hash(Math.floor(t * 6)) * 12);
  drawKineticText(ctx, 'Native Android', lx + 6, 122, {
    size: 36, weight: 700, color: '#FDA4AF', align: 'left', tracking: 0.0,
  });
  drawStudioPill(ctx, lx + 738, 122, `${natFps} FPS ↓`, {
    light: false, bg: 'rgba(225,29,72,0.22)', border: K.redBorder, color: '#FDA4AF',
    fontSize: 17, height: 36, padX: 16,
  });
  drawKineticText(ctx, 'lottie-android HW (Kotlin)  ·  dotlottie (C++)', lx + 6, 164, {
    size: 17, weight: 600, color: K.darkMuted, align: 'left', font: FONT_MONO,
  });

  drawStudioCard(ctx, lx, 196, 824, 502, { light: false, fill: K.redDarkBg, border: K.redBorder });
  const sCell = 108, sGap = 14, sOx = lx + (824 - (4 * sCell + 3 * sGap)) / 2, sOy = 212;
  for (let i = 0; i < 16; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    drawSprite(ctx, sprites, `emoji_${i}`, sOx + col * (sCell + sGap), sOy + row * (sCell + sGap), sCell, t, {
      phase: i * 0.21, stutterFps: 8,
    });
  }

  drawStudioCard(ctx, lx, 716, 824, 290, { light: false, fill: 'rgba(12, 10, 14, 0.94)', border: K.redBorder });
  const bgY = 716 + 205 - (11.11 / 34) * 165;
  for (let i = 0; i < 48; i++) {
    const ms = 14.5 + hash(i * 4.1 + Math.floor(t * 16)) * 18.5;
    const bh = Math.min(170, (ms / 34) * 165);
    ctx.fillStyle = ms > 24 ? '#F43F5E' : '#E11D48';
    ctx.beginPath();
    ctx.roundRect(lx + 24 + i * 16.2, 716 + 205 - bh, 12.5, bh, 3);
    ctx.fill();
  }
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = K.goldBright;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx + 20, bgY);
  ctx.lineTo(lx + 804, bgY);
  ctx.stroke();
  ctx.restore();
  drawKineticText(ctx, '11.11 ms', lx + 796, bgY - 14, { size: 14, weight: 700, color: K.goldBright, align: 'right', font: FONT_MONO });
  drawKineticText(ctx, '11.4 – 25.6 ms', lx + 30, 958, { size: 44, weight: 760, color: K.redBright, align: 'left', tracking: 0.0 });
  drawKineticText(ctx, '62.9% – 100% JANK', lx + 794, 960, { size: 28, weight: 700, color: '#FDA4AF', align: 'right', font: FONT_MONO });

  // RIGHT HALF: RADIANT CERAMIC LIGHT FLUTTER + FASTLOTTIE
  const rx = lerp(W + 80, W / 2 + 68, enter);
  drawCompactLogo(ctx, rx + 22, 122, 34, { shadow: false });
  drawKineticText(ctx, 'Flutter + FastLottie', rx + 50, 122, {
    size: 36, weight: 760, color: K.ink, align: 'left', tracking: -0.004,
  });
  drawStudioPill(ctx, rx + 718, 122, '90.0 FPS LOCKED', {
    light: true, bg: K.blueSoftBg, border: K.blueBorder, color: K.blueText,
    fontSize: 16, height: 36, padX: 14, dotColor: K.blue,
  });
  drawKineticText(ctx, 'p95: 2.30 ms on Pixel 7a  ·  0.27 ms med on Apple M5', rx + 6, 164, {
    size: 17, weight: 600, color: K.inkMuted, align: 'left', font: FONT_MONO,
  });

  drawStudioCard(ctx, rx, 196, 824, 502, { light: true, fill: K.lightCardStrong, border: K.blueBorder });
  const rOx = rx + (824 - (4 * sCell + 3 * sGap)) / 2;
  for (let i = 0; i < 16; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    drawSprite(ctx, sprites, `emoji_${i}`, rOx + col * (sCell + sGap), sOy + row * (sCell + sGap), sCell, t, {
      phase: i * 0.21, stutterFps: 0,
    });
  }

  drawStudioCard(ctx, rx, 716, 824, 290, { light: true, fill: K.lightCardStrong, border: K.blueBorder });
  for (let i = 0; i < 48; i++) {
    const ms = 1.15 + hash(i * 7.3 + Math.floor(t * 28)) * 0.95;
    const bh = Math.max(8, (ms / 34) * 165);
    ctx.fillStyle = K.blue;
    ctx.beginPath();
    ctx.roundRect(rx + 24 + i * 16.2, 716 + 205 - bh, 12.5, bh, 3);
    ctx.fill();
  }
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rx + 20, bgY);
  ctx.lineTo(rx + 804, bgY);
  ctx.stroke();
  ctx.restore();
  drawKineticText(ctx, '11.11 ms', rx + 796, bgY - 14, { size: 14, weight: 700, color: K.goldText, align: 'right', font: FONT_MONO });
  const bGrad = makeBlueGrad(ctx, 0, -24, 220, 24);
  drawKineticText(ctx, '1.38 ms', rx + 30, 958, { size: 52, weight: 760, color: bGrad, align: 'left', tracking: -0.005 });
  drawKineticText(ctx, '0.0% JANK (PREWARM)', rx + 794, 960, { size: 26, weight: 700, color: K.blueText, align: 'right', font: FONT_MONO });

  if (dt > 2.0) {
    const sp = spring(dt - 2.0, { stiffness: 250, damping: 22 });
    ctx.save();
    ctx.globalAlpha = clamp(sp);
    drawStudioPill(ctx, W / 2, H - 36, '6× – 8× FASTER FRAMES THAN NATIVE ANDROID', {
      light: true, bg: '#FFFFFF', border: K.blueBorder, color: K.ink, fontSize: 19, height: 46, padX: 30, logoBadge: true,
    });
    ctx.restore();
  }
}

// =========================================================================
// SCENE 6 (40.15s - 51.05s): 3 CERAMIC KEYNOTE ARCHITECTURE CARDS (2 bars each!)
// =========================================================================
function renderScene6(ctx, t, sprites) {
  // Card 1 (40.15 - 43.78s): 01 · CONTENT-KEY DEDUPLICATION
  if (t < 43.78) {
    const dt = t - 40.15;
    drawCeramicBackdrop(ctx, t, { goldBloom: 0.045, blueBloom: 0.055 });
    drawStudioHud(ctx, 'ARCHITECTURE · 01 / 03', 'PIXEL 7a · 24× SHARED STICKER', { light: true, showMiniLogo: true });

    drawStudioPill(ctx, W / 2, 134, '01 · CONTENT-KEY DEDUPLICATION', {
      light: true, bg: K.blueSoftBg, border: K.blueBorder, color: K.blueText, fontSize: 20, dotColor: K.blue,
    });

    const collapse = dt < 0.9 ? easeInOutCubic(norm(dt, 0.05, 0.85)) : 1 - easeOutBack(norm(dt, 1.05, 1.85));
    const cx = 486, cy = 548;

    // Clean luminous orbital traces pulling 24 instances into 1 shared cache entry
    ctx.save();
    ctx.strokeStyle = hexAlpha(K.blue, 0.14 + collapse * 0.24);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 24; i++) {
      const gx = 128 + (i % 6) * 124 + 54;
      const gy = 285 + Math.floor(i / 6) * 130 + 54;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo((gx + cx) / 2, (gy + cy) / 2 - 22, cx + 10, cy + 10);
      ctx.stroke();
    }
    ctx.restore();

    for (let i = 0; i < 24; i++) {
      const gx = 128 + (i % 6) * 124;
      const gy = 285 + Math.floor(i / 6) * 130;
      const x = lerp(gx, cx - 95, clamp(collapse));
      const y = lerp(gy, cy - 95, clamp(collapse));
      const sz = lerp(108, 220, clamp(collapse));
      drawSprite(ctx, sprites, 'phoenix', x, y, sz, t, {
        alpha: collapse > 0.85 && i > 0 ? 0.08 : 0.96,
        frameWindow: [0, 26],
      });
    }

    const p = spring(dt, { stiffness: 250, damping: 22 });
    const rx = lerp(1040, 960, clamp(p));
    drawKineticText(ctx, '24× stickers.', rx, 366, { size: 96, weight: 760, color: K.ink, align: 'left', tracking: -0.006 });
    const bGrad = makeBlueGrad(ctx, 0, -50, 560, 50);
    drawKineticText(ctx, '1× render.', rx, 478, { size: 112, weight: 760, color: bGrad, align: 'left', tracking: 0.0 });
    drawStudioCard(ctx, rx, 564, 840, 250, { light: true, fill: K.lightCardStrong, border: K.goldBorder });
    drawKineticText(ctx, '25.7 ms', rx + 40, 646, { size: 84, weight: 760, color: K.goldText, align: 'left', font: FONT_MONO, tracking: -0.005 });
    drawKineticText(ctx, 'COLD LOAD ON PIXEL 7a', rx + 40, 718, { size: 22, weight: 700, color: K.ink, align: 'left', font: FONT_MONO });
    drawKineticText(ctx, '26× faster than Native C++ dotlottie (668 ms)', rx + 40, 768, { size: 22, weight: 600, color: K.inkMuted, align: 'left' });
    return;
  }

  // Card 2 (43.78 - 47.42s): 02 · NATIVE LZ4 STRIP CACHE
  if (t < 47.42) {
    const dt = t - 43.78;
    drawCeramicBackdrop(ctx, t, { goldBloom: 0.035, blueBloom: 0.06 });
    drawStudioHud(ctx, 'ARCHITECTURE · 02 / 03', 'APPLE M5 · 120 HZ', { light: true, showMiniLogo: true });

    drawStudioPill(ctx, W / 2, 134, '02 · NATIVE LZ4 STRIP CACHE', {
      light: true, bg: K.blueSoftBg, border: K.blueBorder, color: K.blueText, fontSize: 20, dotColor: K.cyan,
    });

    const crush = easeOutExpo(norm(dt, 0.18, 1.05));
    const leftX = 164, baseLineY = 860, redH = 540;
    ctx.fillStyle = 'rgba(225, 29, 72, 0.80)';
    ctx.beginPath();
    ctx.roundRect(leftX, baseLineY - redH, 232, redH, 18);
    ctx.fill();
    drawKineticText(ctx, '3.27 GiB', leftX + 116, baseLineY - redH - 42, { size: 42, weight: 760, color: K.red, font: FONT_MONO });
    drawKineticText(ctx, 'lottie-ios (auto)', leftX + 116, baseLineY + 42, { size: 22, weight: 700, color: K.inkMuted });

    const rightX = 480;
    const blueH = lerp(540, 44, crush);
    const bg = ctx.createLinearGradient(rightX, baseLineY - blueH, rightX, baseLineY);
    bg.addColorStop(0, K.cyan);
    bg.addColorStop(1, K.royal);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(rightX, baseLineY - blueH, 232, blueH, 12);
    ctx.fill();
    // Clean metallic caliper bar
    ctx.fillStyle = K.ink;
    ctx.beginPath();
    ctx.roundRect(rightX - 16, baseLineY - blueH - 7, 264, 3, 2);
    ctx.fill();

    const mbVal = Math.round(lerp(3271, 209, crush));
    drawKineticText(ctx, `${mbVal} MiB`, rightX + 116, baseLineY - blueH - 46, {
      size: 46, weight: 760, color: K.blueText, font: FONT_MONO,
    });
    drawKineticText(ctx, 'FastLottie', rightX + 116, baseLineY + 42, { size: 24, weight: 700, color: K.ink });

    const rx = 860;
    const bGrad = makeBlueGrad(ctx, 0, -50, 760, 50);
    drawKineticText(ctx, '15× less RAM.', rx, 366, { size: 108, weight: 760, color: bGrad, align: 'left', tracking: 0.0 });
    drawKineticText(ctx, '17.7 µs decode.', rx, 482, { size: 70, weight: 700, color: K.ink, align: 'left', font: FONT_MONO, tracking: -0.005 });
    drawStudioCard(ctx, rx, 574, 930, 210, { light: true, fill: K.lightCardStrong, border: K.blueBorder });
    drawKineticText(ctx, '5× LOWER CPU vs lottie-ios (13.6% vs 72.2%)', rx + 40, 646, { size: 24, weight: 700, color: K.ink, align: 'left', font: FONT_MONO });
    drawKineticText(ctx, '2.2× LOWER CPU vs C++ dotlottie (27.0% vs 59.3%)', rx + 40, 718, { size: 24, weight: 700, color: K.blueText, align: 'left', font: FONT_MONO });
    return;
  }

  // Card 3 (47.42 - 51.05s): 03 · ZERO PLATFORMVIEW TAX
  const dt = t - 47.42;
  drawCeramicBackdrop(ctx, t, { goldBloom: 0.04, blueBloom: 0.05 });
  drawStudioHud(ctx, 'ARCHITECTURE · 03 / 03', 'PIXEL 7a · TOTAL PSS MEMORY', { light: true, showMiniLogo: true });

  drawStudioPill(ctx, W / 2, 134, '03 · ZERO PLATFORMVIEW TAX', {
    light: true, bg: K.goldSoftBg, border: K.goldBorder, color: K.goldText, fontSize: 20, dotColor: K.gold,
  });

  const dropP = easeInOutCubic(norm(dt, 0.45, 1.45));
  const lx = 104;
  drawKineticText(ctx, 'Lighter than pure', lx, 330, { size: 76, weight: 700, color: K.ink, align: 'left', tracking: -0.005 });
  const bGrad = makeBlueGrad(ctx, 0, -45, 620, 45);
  drawKineticText(ctx, 'Native Kotlin.', lx, 424, { size: 96, weight: 760, color: bGrad, align: 'left', tracking: -0.006 });
  drawKineticText(ctx, 'FLUTTER ENGINE INCLUDED.', lx, 502, { size: 28, weight: 700, color: K.goldText, align: 'left', font: FONT_MONO, tracking: 0.06 });

  const bx = 950, maxW = 790;
  const bars = [
    { label: 'Flutter + FastLottie', val: 249.5, max: 550, color: K.blue, note: 'incl. Flutter engine & GL/EGL', winner: true },
    { label: 'Native Kotlin lottie-android HW', val: 373.7, max: 550, color: K.gold, note: '+124 MiB heavier than FastLottie' },
    { label: 'Flutter lottie_native (PlatformView)', val: 537.7, max: 550, color: K.red, note: 'PlatformView adds +164 MiB tax — FastLottie pays zero.', splitAt: 373.7 },
  ];
  let by = 290;
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i];
    const grow = easeOutExpo(norm(dt, 0.1 + i * 0.12, 0.8 + i * 0.12));
    drawKineticText(ctx, b.label, bx, by, { size: 23, weight: 700, color: K.ink, align: 'left' });
    const fullW = (b.val / b.max) * maxW * grow;
    if (!b.splitAt) {
      if (b.winner) {
        const g = ctx.createLinearGradient(bx, by, bx + fullW, by);
        g.addColorStop(0, K.cyan);
        g.addColorStop(1, K.royal);
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = b.color;
      }
      ctx.beginPath();
      ctx.roundRect(bx, by + 28, fullW, 56, 12);
      ctx.fill();
      drawKineticText(ctx, `${b.val.toFixed(1)} MiB`, bx + fullW + 18, by + 56, {
        size: 28, weight: 760, color: b.winner ? K.blueText : K.goldText, align: 'left', font: FONT_MONO,
      });
      drawKineticText(ctx, b.note, bx, by + 108, { size: 18, weight: 600, color: K.inkMuted, align: 'left', font: FONT_MONO });
    } else {
      const baseW = (b.splitAt / b.max) * maxW * grow;
      const taxW = fullW - baseW;
      ctx.fillStyle = 'rgba(225, 29, 72, 0.25)';
      ctx.beginPath();
      ctx.roundRect(bx, by + 28, baseW, 56, 12);
      ctx.fill();

      ctx.save();
      ctx.translate(bx + baseW + 6, by + 28 + dropP * 220);
      ctx.rotate(dropP * 0.18);
      ctx.globalAlpha = 1 - dropP * 0.82;
      ctx.fillStyle = K.red;
      ctx.beginPath();
      ctx.roundRect(0, 0, Math.max(40, taxW), 56, 12);
      ctx.fill();
      drawKineticText(ctx, '+164 MiB TAX', taxW / 2, 28, { size: 19, weight: 760, color: '#FFFFFF', font: FONT_MONO });
      ctx.restore();
      drawKineticText(ctx, b.note, bx, by + 108, { size: 18, weight: 700, color: K.red, align: 'left', font: FONT_MONO });
    }
    by += 205;
  }

  drawStudioCard(ctx, lx, 595, 760, 175, { light: true, fill: K.lightCardStrong, border: K.blueBorder });
  drawKineticText(ctx, 'NO ANDROIDVIEW · NO UIKITVIEW', lx + 36, 654, { size: 26, weight: 760, color: K.blueText, align: 'left', font: FONT_MONO });
  drawKineticText(ctx, 'Direct Flutter texture composition at 120 Hz.', lx + 36, 714, { size: 23, weight: 600, color: K.inkSub, align: 'left' });
}

// =========================================================================
// SCENE 7 (51.05s - 60.85s): FULL-CIRCLE KEYNOTE CRESCENDO (White -> Black -> White!)
// =========================================================================
function renderScene7(ctx, t, sprites) {
  const dt = t - 51.05;

  // 51.05 - 53.85s : Confident Full-Circle Callback ("SO MUCH FOR THE RULE.")
  if (t < 53.85) {
    drawCeramicBackdrop(ctx, t, { goldBloom: 0.03, blueBloom: 0.035 });
    const p = spring(dt, { stiffness: 220, damping: 22 });
    drawKineticText(ctx, 'SO MUCH FOR THE RULE.', W / 2, H * 0.34, {
      size: 28, weight: 700, color: K.goldText, font: FONT_MONO, tracking: 0.14, alpha: clamp(p),
    });
    drawKineticText(ctx, 'One pure Flutter engine.', W / 2, H * 0.475, {
      size: 76, weight: 700, color: K.ink, tracking: -0.005, alpha: clamp(spring(dt - 0.18)),
    });
    const bGrad = makeBlueGrad(ctx, -460, -35, 460, 35);
    drawKineticText(ctx, 'Zero native compromises.', W / 2, H * 0.59, {
      size: 82, weight: 760, color: bGrad, tracking: -0.005, alpha: clamp(spring(dt - 0.34)),
    });
    return;
  }

  // 53.85 - 56.00s : HIGH-CONTRAST OBSIDIAN POWER BEAT ("Faster. Lighter. Smoother.")
  if (t < 56.00) {
    const dtb = t - 53.85;
    drawObsidianBackdrop(ctx, t, { accent: K.blue, accentAlpha: 0.14 });
    const p = spring(dtb, { stiffness: 360, damping: 24 });
    drawKineticText(ctx, 'Faster.', W / 2, H * 0.41, {
      size: 186, weight: 760, color: '#FFFFFF', tracking: -0.006, scale: lerp(1.08, 1.0, clamp(p)),
    });
    const dual = makeBrandDualGrad(ctx, -380, -30, 380, 30);
    drawKineticText(ctx, 'Lighter.  Smoother.', W / 2, H * 0.59, {
      size: 82, weight: 700, color: dual, tracking: -0.004, alpha: clamp(spring(dtb - 0.22)),
    });
    const lineW = 360 * easeOutExpo(norm(dtb, 0.26, 0.78));
    const lg = makeBrandDualGrad(ctx, W / 2 - 180, 0, W / 2 + 180, 0);
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.roundRect(W / 2 - lineW / 2, H * 0.695, lineW, 4, 2);
    ctx.fill();
    return;
  }

  // 56.00 - 58.95s : Return to Ceramic White — Building Energy
  if (t < 58.95) {
    const dtc = t - 56.00;
    drawCeramicBackdrop(ctx, t, { goldBloom: 0.045, blueBloom: 0.055 });
    drawKineticText(ctx, 'Built for the workloads', W / 2, H * 0.33, {
      size: 76, weight: 760, color: K.ink, tracking: -0.005,
    });
    const bGrad = makeBlueGrad(ctx, -500, -30, 500, 30);
    drawKineticText(ctx, 'that break every other renderer.', W / 2, H * 0.445, {
      size: 70, weight: 760, color: bGrad, tracking: -0.005,
    });

    const items = [
      ['16+ LIVE STICKERS', 0.22, -500, K.gold],
      ['COMPLEX MASKS & MATTES', 0.56, -165, K.cyan],
      ['90 & 120 HZ LOCKED', 0.90, 175, K.blue],
      ['ZERO MEMORY CLIFFS', 1.24, 495, K.royal],
    ];
    for (const [label, delay, ox, dot] of items) {
      const sp = spring(dtc - delay, { stiffness: 300, damping: 20 });
      if (sp > 0.01) {
        ctx.save();
        ctx.globalAlpha = clamp(sp);
        drawStudioPill(ctx, W / 2 + ox, lerp(H * 0.66 + 32, H * 0.635, clamp(sp)), label, {
          light: true, bg: '#FFFFFF', border: K.blueBorder, color: K.ink,
          fontSize: 19, height: 50, padX: 22, dotColor: dot,
        });
        ctx.restore();
      }
    }
    return;
  }

  // 58.95 - 60.85s : MONUMENTAL CERAMIC CRESCENDO — "Every. Single. Time."
  const dtd = t - 58.95;
  drawCeramicBackdrop(ctx, t, { goldBloom: 0.065, blueBloom: 0.075 });

  for (let i = 0; i < 24; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    drawSprite(ctx, sprites, 'phoenix', 100 + col * 295, 95 + row * 245, 160, t, {
      phase: i * 0.09, alpha: 0.24, frameWindow: [0, 26],
    });
  }

  const plate = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 740);
  plate.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  plate.addColorStop(0.7, 'rgba(248, 251, 255, 0.65)');
  plate.addColorStop(1, 'rgba(248, 251, 255, 0)');
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, W, H);

  const p1 = spring(dtd, { stiffness: 320, damping: 20 });
  const p2 = spring(dtd - 0.08, { stiffness: 320, damping: 20 });
  const p3 = spring(dtd - 0.16, { stiffness: 320, damping: 20 });
  drawKineticText(ctx, 'Every.', W / 2, H * 0.30, {
    size: 164, weight: 760, color: K.ink, tracking: 0.0, scale: lerp(1.18, 1.0, clamp(p1)),
  });
  const dual = makeBrandDualGrad(ctx, -380, -60, 380, 60);
  drawKineticText(ctx, 'Single.', W / 2, H * 0.505, {
    size: 168, weight: 760, color: dual, tracking: 0.0, scale: lerp(1.18, 1.0, clamp(p2)),
  });
  drawKineticText(ctx, 'Time.', W / 2, H * 0.71, {
    size: 172, weight: 760, color: K.ink, tracking: 0.0, scale: lerp(1.18, 1.0, clamp(p3)),
  });
}

// =========================================================================
// SCENE 8 (60.85s - 68.00s): CLEAN DART CODE + PURE MINIMALIST OUTRO!
// =========================================================================
function renderScene8(ctx, t, sprites) {
  const dt = t - 60.85;
  drawCeramicBackdrop(ctx, t, { goldBloom: 0.05, blueBloom: 0.055 });

  // Phase 8A (60.85 - 64.35s): Crisp Light macOS Code Window + Live Phoenix Preview
  if (t < 64.35) {
    const enter = spring(dt, { stiffness: 240, damping: 22 });
    const exit = t > 63.95 ? 1 - easeInOutCubic(norm(t, 63.95, 64.35)) : 1;
    ctx.save();
    ctx.globalAlpha = clamp(enter) * exit;

    const cx = 130, cy = lerp(290, 232, clamp(enter));
    drawStudioCard(ctx, cx, cy, 980, 496, { light: true, fill: '#FFFFFF', border: K.lightCardBorder });
    const dots = ['#FF5F56', '#FFBD2E', '#27C93F'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = dots[i];
      ctx.beginPath();
      ctx.arc(cx + 42 + i * 28, cy + 38, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    drawKineticText(ctx, 'sticker_grid.dart', cx + 490, cy + 38, { size: 18, weight: 600, color: K.inkMuted, font: FONT_MONO });
    ctx.fillStyle = K.inkHairline;
    ctx.fillRect(cx, cy + 72, 980, 1);

    const lines = [
      [{ text: 'FastLottie', color: K.blueText }, { text: '.asset(', color: K.ink }],
      [{ text: "  'assets/phoenix.json'", color: '#B45309' }, { text: ',', color: K.inkMuted }],
      [{ text: '  width: ', color: '#0369A1' }, { text: '256', color: '#7C3AED' }, { text: ',', color: K.inkMuted }],
      [{ text: ')', color: K.ink }],
    ];
    const totalChars = lines.reduce((acc, l) => acc + l.reduce((a, s) => a + s.text.length, 0), 0);
    let charsBudget = Math.floor(norm(dt, 0.12, 1.45) * totalChars);
    let cursorX = cx + 56, cursorY = cy + 160;

    ctx.font = `600 42px ${FONT_MONO}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    lines.forEach((segs, li) => {
      const ly = cy + 160 + li * 74;
      let lx = cx + 56;
      for (const seg of segs) {
        if (charsBudget <= 0) break;
        const slice = seg.text.slice(0, charsBudget);
        charsBudget -= slice.length;
        ctx.fillStyle = seg.color;
        ctx.fillText(slice, lx, ly);
        lx += ctx.measureText(slice).width;
        cursorX = lx;
        cursorY = ly;
      }
    });
    if (Math.floor(t * 4) % 2 === 0 || dt < 1.5) {
      ctx.fillStyle = K.blue;
      ctx.fillRect(cursorX + 4, cursorY - 22, 12, 44);
    }

    const rx = 1200;
    drawStudioCard(ctx, rx, cy, 584, 496, { light: true, fill: '#FFFFFF', border: K.blueBorder });
    drawSprite(ctx, sprites, 'phoenix', rx + 102, cy + 58, 380, t, { frameWindow: [0, 26] });

    drawStudioPill(ctx, W / 2, 855, 'DROP-IN FLUTTER WIDGET  ·  ZERO NATIVE SETUP  ·  JSON & TGS', {
      light: true, bg: '#FFFFFF', border: K.blueBorder, color: K.ink, fontSize: 22, height: 56, padX: 34, logoBadge: true,
    });
    ctx.restore();
    return;
  }

  // Phase 8B (64.35 - 68.00s): ULTRA-CLEAN APPLE OUTRO — PURE FASTLOTTIE + SLOGAN
  const dtb = t - 64.35;
  const enter = spring(dtb, { stiffness: 220, damping: 23 });
  const fadeOutEnd = t > 67.45 ? 1 - easeInOutCubic(norm(t, 67.45, 68.0)) : 1;

  ctx.save();
  ctx.globalAlpha = clamp(enter * 1.4) * fadeOutEnd;

  // Monumental centered calligraphic Fastlottie wordmark with studio specular sheen
  drawFastLottieMorph(ctx, {
    mode: 'static',
    cx: W / 2,
    cy: lerp(H * 0.48, H * 0.445, clamp(enter)),
    scale: lerp(0.92, 0.86, clamp(enter)),
    sheenT: norm(dtb, 0.35, 1.65),
    alpha: clamp(enter * 1.4),
  });

  // Clean breathable slogan directly beneath
  const subP = spring(dtb - 0.32, { stiffness: 210, damping: 22 });
  drawKineticText(ctx, 'Faster than native — the Lottie renderer Flutter deserves', W / 2, lerp(H * 0.72, H * 0.695, clamp(subP)), {
    size: 42, weight: 600, color: K.inkSub, tracking: 0.0, alpha: clamp(subP),
  });
  ctx.restore();
}

export function renderIntroFrame(ctx, frame, sprites) {
  const t = frame / 60;
  if (t < 6.80) return renderScene1(ctx, t, sprites);
  if (t < 19.00) return renderScene2(ctx, t, sprites);
  if (t < 25.60) return renderScene3(ctx, t, sprites);
  if (t < 32.87) return renderScene4(ctx, t);
  if (t < 40.15) return renderScene5(ctx, t, sprites);
  if (t < 51.05) return renderScene6(ctx, t, sprites);
  if (t < 60.85) return renderScene7(ctx, t, sprites);
  return renderScene8(ctx, t, sprites);
}
