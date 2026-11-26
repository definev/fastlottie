import {
  W, H, C, FONT_SANS, FONT_MONO,
  clamp, lerp, norm, easeOutExpo, easeOutCubic, easeInOutCubic, easeOutBack,
  spring, hash, cameraShake, hexAlpha,
  drawBackdrop, drawCard, drawPill, drawKineticText, drawGlitchOverlay,
  drawSprite, drawShockwave, drawFlash, drawTopHud, drawFilmGrain,
} from './engine.js';

// =========================================================================
// SCENE 1 (0.00s - 5.20s): THE DOGMA
// =========================================================================
function renderScene1(ctx, t, sprites) {
  const pulse = 0.10 + 0.03 * Math.sin(t * 3.5);
  drawBackdrop(ctx, t, { accent: t > 3.3 ? C.red : C.blue, accentAlpha: pulse, gridSpeed: 0.45, gridY: 0.72 });

  if (t < 3.38) {
    const fadeOut = t > 3.15 ? 1 - norm(t, 3.15, 3.38) : 1;
    const glitch = t > 3.18 ? norm(t, 3.18, 3.35) * 16 : 0;

    const p1 = spring(t - 0.25, { stiffness: 280, damping: 20 });
    const y1 = lerp(H * 0.42 + 40, H * 0.39, p1);
    drawKineticText(ctx, 'EVERYONE KNOWS THE RULE.', W / 2, y1, {
      size: 58, weight: 700, color: C.muted, tracking: 0.08, alpha: clamp(p1) * fadeOut, glitchPx: glitch,
    });

    if (t >= 1.50) {
      const p2 = spring(t - 1.55, { stiffness: 320, damping: 19 });
      const scale2 = lerp(1.16, 1.0, clamp(p2));
      drawKineticText(ctx, 'CROSS-PLATFORM IS ALWAYS', W / 2, H * 0.51, {
        size: 98, weight: 900, color: C.text, scale: scale2, alpha: clamp(p2) * fadeOut, glitchPx: glitch * 1.4,
      });
      drawKineticText(ctx, 'SLOWER THAN NATIVE.', W / 2, H * 0.625, {
        size: 112, weight: 900, color: C.text, scale: scale2, alpha: clamp(p2) * fadeOut,
        glow: 'rgba(255,255,255,0.22)', glitchPx: glitch * 1.6,
      });
      // Razor-sharp crimson laser line sweeping cleanly under "SLOWER THAN NATIVE."
      const lineP = easeOutExpo(norm(t, 1.85, 2.35));
      const lw = 1040 * lineP;
      ctx.save();
      ctx.globalAlpha = fadeOut;
      ctx.fillStyle = C.red;
      ctx.shadowColor = C.redGlow;
      ctx.shadowBlur = 18;
      ctx.fillRect(W / 2 - lw / 2, H * 0.695, lw, 5);
      ctx.restore();
    }
    if (glitch > 0) drawGlitchOverlay(ctx, t, glitch / 16);
    drawFilmGrain(ctx, t);
    return;
  }

  // Phase B (3.38 - 5.20s): "...UNTIL YOU PUT 16 STICKERS ON 90 HZ." + 4x4 sticker burst!
  const dt = t - 3.45;
  const p = spring(dt, { stiffness: 340, damping: 18 });
  const shake = cameraShake(t, 3.45, 0.35, 16);

  ctx.save();
  ctx.translate(shake.x, shake.y);

  if (t > 3.95) {
    const burst = easeOutExpo(norm(t, 3.95, 5.15));
    const gridSize = 148;
    const gap = 36;
    const totalW = 4 * gridSize + 3 * gap;
    const totalH = 4 * gridSize + 3 * gap;
    const ox = (W - totalW) / 2;
    const oy = (H - totalH) / 2;
    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const delay = (i % 4) * 0.03 + row * 0.03;
      const sp = easeOutBack(norm(t, 3.98 + delay, 4.45 + delay));
      const tx = ox + col * (gridSize + gap);
      const ty = oy + row * (gridSize + gap);
      drawSprite(ctx, sprites, `emoji_${i}`, lerp(W / 2 - gridSize / 2, tx, sp), lerp(H / 2 - gridSize / 2, ty, sp), gridSize * (0.4 + 0.6 * sp), t, {
        phase: i * 0.17, alpha: 0.30 + 0.35 * burst,
      });
    }
  }

  const plate = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 700);
  plate.addColorStop(0, 'rgba(7,7,10,0.90)');
  plate.addColorStop(1, 'rgba(7,7,10,0)');
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, W, H);

  drawKineticText(ctx, '...UNTIL YOU PUT', W / 2, H * 0.39, {
    size: 56, weight: 700, color: C.redBright, tracking: 0.08, alpha: clamp(p),
  });
  drawKineticText(ctx, '16 STICKERS ON 90 HZ.', W / 2, H * 0.52, {
    size: 118, weight: 900, color: C.text, scale: lerp(1.22, 1.0, clamp(p)),
    glow: C.redGlow, glowBlur: 36, glitchPx: t > 4.6 ? (t - 4.6) * 14 : 0,
  });

  if (t > 4.55) drawGlitchOverlay(ctx, t, norm(t, 4.55, 5.2) * 0.85);
  ctx.restore();
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 2 (5.20s - 15.20s): THE NATIVE MELTDOWN
// =========================================================================
function renderScene2(ctx, t, sprites) {
  // 14.60 - 15.20s: CRISP CRT POWER-OFF SNAP -> TOTAL DEAD SILENCE!
  if (t >= 14.60) {
    ctx.fillStyle = '#030305';
    ctx.fillRect(0, 0, W, H);
    const snap = norm(t, 14.60, 14.74);
    if (snap < 1) {
      const h = Math.max(2, (1 - easeOutExpo(snap)) * 28);
      const w = (1 - snap * 0.7) * W;
      ctx.fillStyle = `rgba(255,255,255,${(1 - snap) * 0.85})`;
      ctx.fillRect(W / 2 - w / 2, H / 2 - h / 2, w, h);
    }
    return;
  }

  // Sub-scene 2A (5.20 - 8.20s): Pixel 7a Native Kotlin lottie-android HW Async -> 100% DROPPED FRAMES
  if (t < 8.20) {
    const dt = t - 5.20;
    const shake = cameraShake(t, 5.20, 0.3, 12);
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawBackdrop(ctx, t, { accent: C.red, accentAlpha: 0.22, gridSpeed: 0.9 });
    drawTopHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', '16 UNIQUE LOTTIE STICKERS', C.red);

    const enter = easeOutExpo(norm(dt, 0, 0.4));
    const cardX = lerp(-120, 96, enter);
    drawCard(ctx, cardX, 118, 810, 868, {
      fill: 'rgba(18, 10, 14, 0.92)', border: 'rgba(239, 68, 68, 0.44)', glow: 'rgba(239, 68, 68, 0.25)', glowBlur: 44,
    });
    drawPill(ctx, cardX + 274, 184, 'NATIVE KOTLIN · lottie-android 6.7.1', {
      bg: 'rgba(239,68,68,0.16)', border: 'rgba(239,68,68,0.55)', color: C.redBright, fontSize: 18, dotColor: C.red,
    });
    drawKineticText(ctx, 'HW ASYNC · SHARED COMPOSITION', cardX + 46, 248, {
      size: 22, weight: 700, color: C.muted, align: 'left', font: FONT_MONO, tracking: 0.04,
    });

    const pctVal = Math.min(100.0, easeOutCubic(norm(dt, 0.15, 0.85)) * 100.0);
    drawKineticText(ctx, `${pctVal.toFixed(0)}%`, cardX + 44, 396, {
      size: 176, weight: 900, color: C.red, align: 'left', glow: C.redGlow, glowBlur: 44,
      glitchPx: dt > 1.2 && dt < 1.45 ? 10 : 0,
    });
    drawKineticText(ctx, 'FRAMES OVER 11.11 ms BUDGET', cardX + 48, 512, {
      size: 32, weight: 800, color: C.text, align: 'left', tracking: 0.02,
    });

    // Live HWUI Frame-Time Bar Chart
    const gx = cardX + 46, gy = 582, gw = 718, gh = 236;
    drawCard(ctx, gx, gy, gw, gh, { radius: 14, fill: 'rgba(7,7,10,0.88)', border: 'rgba(255,255,255,0.08)', topSheen: false });
    const budgetY = gy + gh - (11.11 / 38) * (gh - 28) - 10;
    const bars = 42, bw = (gw - 28) / bars;
    for (let i = 0; i < bars; i++) {
      const sample = 18 + hash(i * 3.7 + Math.floor(t * 14)) * 16.5;
      const bh = Math.min(gh - 22, (sample / 38) * (gh - 28));
      ctx.fillStyle = sample > 26 ? '#FF2A55' : C.red;
      ctx.fillRect(gx + 14 + i * bw, gy + gh - 10 - bh, bw - 3, bh);
    }
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx + 10, budgetY);
    ctx.lineTo(gx + gw - 10, budgetY);
    ctx.stroke();
    ctx.restore();
    drawCard(ctx, gx + gw - 182, budgetY - 30, 168, 26, {
      radius: 6, fill: 'rgba(7,7,10,0.92)', border: 'rgba(250,204,21,0.55)', lineWidth: 1, topSheen: false,
    });
    drawKineticText(ctx, '11.11 ms BUDGET', gx + gw - 22, budgetY - 17, {
      size: 15, weight: 800, color: '#FACC15', align: 'right', font: FONT_MONO,
    });

    drawKineticText(ctx, 'FRAME TIME: 25.6 ms MED  ·  34.3 ms p95', cardX + 48, 876, {
      size: 22, weight: 700, color: C.redBright, align: 'left', font: FONT_MONO,
    });
    drawKineticText(ctx, 'GPU RenderNode mode hits the exact same 100% wall.', cardX + 48, 924, {
      size: 21, weight: 600, color: C.muted, align: 'left',
    });

    // Right: Stuttering 4x4 grid with live fluctuating FPS counter!
    const rx = lerp(W + 80, 984, enter);
    drawCard(ctx, rx, 118, 840, 868, { fill: 'rgba(14, 14, 20, 0.90)', border: 'rgba(239, 68, 68, 0.38)' });
    const liveFps = 29 + Math.floor(hash(Math.floor(t * 7)) * 11);
    drawPill(ctx, rx + 420, 174, `${liveFps} FPS  ·  TARGET 90 FPS`, {
      bg: 'rgba(239,68,68,0.18)', border: 'rgba(239,68,68,0.55)', color: '#FCA5A5', fontSize: 19, dotColor: C.red,
    });
    const cell = 158, gap = 22, gox = rx + (840 - (4 * cell + 3 * gap)) / 2, goy = 232;
    for (let i = 0; i < 16; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const sx = gox + col * (cell + gap), sy = goy + row * (cell + gap);
      const dropped = (Math.floor(t * 8) + i * 3) % 5 === 0;
      if (dropped) {
        drawCard(ctx, sx - 6, sy - 6, cell + 12, cell + 12, {
          radius: 14, fill: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.55)', lineWidth: 1.5, topSheen: false,
        });
      }
      drawSprite(ctx, sprites, `emoji_${i}`, sx, sy, cell, t, { phase: i * 0.19, stutterFps: 8 });
    }
    if (dt > 1.2 && dt < 1.4) drawGlitchOverlay(ctx, t, 0.6);
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  // Sub-scene 2B (8.20 - 11.00s): Pure Native C++ dotlottie-android + live 24-instance ThorVG matrix!
  if (t < 11.00) {
    const dt = t - 8.20;
    const shake = cameraShake(t, 8.20, 0.25, 11);
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawBackdrop(ctx, t, { accent: C.amber, accentAlpha: 0.18, gridSpeed: 0.85 });
    drawTopHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', 'PURE NATIVE C++ BASELINE', C.amber);

    drawPill(ctx, W / 2, 148, 'dotlottie-android 0.18.0 · C++ THORVG (NO FLUTTER)', {
      bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.5)', color: '#FCD34D', fontSize: 22, dotColor: C.amber,
    });

    const p1 = spring(dt - 0.05, { stiffness: 260, damping: 19 });
    const p2 = spring(dt - 0.22, { stiffness: 260, damping: 19 });

    // Panel Left: 62.9% JANK
    const lx = 110, ly = lerp(310, 218, clamp(p1));
    drawCard(ctx, lx, ly, 810, 720, { fill: 'rgba(20, 14, 12, 0.92)', border: 'rgba(239, 68, 68, 0.42)', glow: 'rgba(239,68,68,0.2)' });
    drawKineticText(ctx, '16 UNIQUE STICKERS', lx + 48, ly + 64, { size: 24, weight: 700, color: C.muted, align: 'left', font: FONT_MONO });
    drawKineticText(ctx, `${(62.9 * easeOutCubic(norm(dt, 0.1, 0.75))).toFixed(1)}%`, lx + 44, ly + 225, {
      size: 162, weight: 900, color: C.redBright, align: 'left', glow: C.redGlow,
    });
    drawKineticText(ctx, 'FRAMES OVER 11.11 ms', lx + 48, ly + 338, { size: 34, weight: 800, color: C.text, align: 'left' });
    drawKineticText(ctx, '12.4 ms MED  ·  15.7 ms p95 FRAME TIME', lx + 48, ly + 398, { size: 22, weight: 600, color: C.muted, align: 'left', font: FONT_MONO });
    for (let i = 0; i < 4; i++) {
      drawSprite(ctx, sprites, `emoji_${i + 4}`, lx + 56 + i * 180, ly + 490, 144, t, { phase: i * 0.25, stutterFps: 11 });
    }

    // Panel Right: 668.3 ms COLD LOAD + 6x4 live ThorVG instance loader grid!
    const rx = 1000, ry = lerp(310, 218, clamp(p2));
    drawCard(ctx, rx, ry, 810, 720, { fill: 'rgba(20, 16, 10, 0.92)', border: 'rgba(245, 158, 11, 0.48)', glow: 'rgba(245,158,11,0.2)' });
    drawKineticText(ctx, '24× SHARED STICKER', rx + 48, ry + 64, { size: 24, weight: 700, color: C.muted, align: 'left', font: FONT_MONO });
    const loadProg = easeInOutCubic(norm(dt, 0.2, 2.25));
    const loadVal = (668.3 * loadProg).toFixed(1);
    drawKineticText(ctx, `${loadVal} ms`, rx + 44, ry + 225, {
      size: 136, weight: 900, color: '#FBBF24', align: 'left', glow: 'rgba(245,158,11,0.45)', font: FONT_MONO,
    });
    drawKineticText(ctx, 'COLD LOAD FREEZE', rx + 48, ry + 338, { size: 34, weight: 800, color: C.text, align: 'left' });
    drawKineticText(ctx, '24× THORVG INSTANCES  ·  64.1% JANK', rx + 48, ry + 398, { size: 22, weight: 600, color: C.muted, align: 'left', font: FONT_MONO });

    // 6x4 amber loader matrix visibly stepping 1/24 .. 24/24!
    const loaded = Math.min(24, Math.floor(loadProg * 24));
    const cw = 108, ch = 46, cgap = 12;
    for (let i = 0; i < 24; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      const bx = rx + 48 + col * (cw + cgap), by = ry + 455 + row * (ch + cgap);
      const done = i < loaded, cur = i === loaded;
      drawCard(ctx, bx, by, cw, ch, {
        radius: 8,
        fill: cur ? C.amber : done ? 'rgba(245,158,11,0.24)' : 'rgba(255,255,255,0.04)',
        border: cur ? '#FDE68A' : done ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.1)',
        lineWidth: 1.2, topSheen: false,
      });
      drawKineticText(ctx, `#${String(i + 1).padStart(2, '0')}`, bx + cw / 2, by + ch / 2, {
        size: 16, weight: 800, color: cur ? '#09090B' : done ? '#FCD34D' : C.dim, font: FONT_MONO,
      });
    }
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  // Sub-scene 2C (11.00 - 14.60s): APPLE lottie-ios 4.6.1 FALLBACK -> 3.27 GiB RAM DETONATION!!
  const dt = t - 11.00;
  const exploded = t >= 13.60;
  const rampShake = dt > 1.0 && !exploded ? cameraShake(t, t - 0.01, 0.5, (dt - 1.0) * 6.5) : { x: 0, y: 0, rot: 0 };
  const boomShake = exploded ? cameraShake(t, 13.60, 0.65, 36) : { x: 0, y: 0, rot: 0 };

  ctx.save();
  ctx.translate(W / 2 + rampShake.x + boomShake.x, H / 2 + rampShake.y + boomShake.y);
  ctx.rotate(boomShake.rot);
  ctx.translate(-W / 2, -H / 2);

  drawBackdrop(ctx, t, {
    accent: C.red,
    accentAlpha: exploded ? 0.40 : 0.14 + norm(dt, 0.6, 2.6) * 0.2,
    gridSpeed: exploded ? 0.2 : 1.1,
  });

  // Rising crimson memory-pressure tide climbing from bottom edge until detonation!
  const spinP = norm(t, 11.90, 13.60);
  const tideH = (exploded ? 1.0 : Math.pow(spinP, 1.5)) * H;
  const tideGrad = ctx.createLinearGradient(0, H - tideH, 0, H);
  tideGrad.addColorStop(0, exploded ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.16)');
  tideGrad.addColorStop(1, 'rgba(239,68,68,0.03)');
  ctx.fillStyle = tideGrad;
  ctx.fillRect(0, H - tideH, W, tideH);
  if (spinP > 0.02 && !exploded) {
    ctx.fillStyle = 'rgba(239,68,68,0.75)';
    ctx.fillRect(0, H - tideH, W, 2);
  }

  drawTopHud(ctx, 'APPLE M5 · 120 HZ', 'NATIVE SWIFT · lottie-ios 4.6.1 · 24× STICKERS', C.red);

  for (let i = 0; i < 24; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    drawSprite(ctx, sprites, 'phoenix', 210 + col * 260, 150 + row * 210, 145, t, {
      stutterFps: 7, alpha: exploded ? 0.14 : 0.22,
    });
  }

  const fellBack = t >= 11.65;
  const badgeGlitch = t >= 11.50 && t <= 11.95 ? 14 : 0;
  drawPill(
    ctx, W / 2, 210,
    fellBack ? 'FALLBACK · 0 CA / 24 MAIN THREAD' : 'CORE ANIMATION (.automatic)',
    {
      bg: fellBack ? 'rgba(239, 68, 68, 0.28)' : 'rgba(56, 189, 248, 0.16)',
      border: fellBack ? C.red : C.cyan,
      color: fellBack ? '#FCA5A5' : '#BAE6FD',
      fontSize: 24, dotColor: fellBack ? C.red : C.cyan, height: 54, padX: 30,
    }
  );
  if (badgeGlitch > 0) drawGlitchOverlay(ctx, t, 0.75);

  const ramMb = exploded ? 3271.4 : lerp(120, 3271.4, Math.pow(spinP, 1.85));
  const ramLabel = ramMb >= 1000 ? `${(ramMb / 1000).toFixed(2)} GiB` : `${Math.round(ramMb)} MiB`;
  const scale = exploded ? lerp(1.38, 1.08, easeOutExpo(norm(t, 13.60, 14.25))) : 0.92 + spinP * 0.18;

  drawKineticText(ctx, 'PHYSICAL RAM', W / 2, 365, {
    size: 28, weight: 700, color: C.redBright, font: FONT_MONO, tracking: 0.14,
  });
  drawKineticText(ctx, ramLabel, W / 2, 545, {
    size: 215, weight: 900, color: exploded ? '#FFFFFF' : C.redBright, scale,
    glow: C.red, glowBlur: exploded ? 72 : 36,
    glitchPx: exploded ? Math.max(0, 22 * (1 - norm(t, 13.60, 14.35))) : spinP * 8,
  });
  drawKineticText(
    ctx,
    exploded ? '56.7% JANK  ·  116.1 ms p95  ·  72.2% CPU' : 'ALLOCATING 24× LAYER BACKINGS...',
    W / 2, 735,
    { size: exploded ? 36 : 26, weight: 800, color: exploded ? '#FCA5A5' : C.muted, font: FONT_MONO, tracking: 0.04 }
  );

  if (exploded) {
    const sdt = t - 13.60;
    drawShockwave(ctx, W / 2, 545, sdt / 0.75, { color: C.red, maxR: 1300, width: 26 });
    ctx.save();
    for (let k = 0; k < 44; k++) {
      const ang = hash(k * 9.1) * Math.PI * 2;
      const spd = 480 + hash(k * 3.7) * 1450;
      const px = W / 2 + Math.cos(ang) * spd * sdt;
      const py = 545 + Math.sin(ang) * spd * sdt + 320 * sdt * sdt;
      const sz = 14 + hash(k * 5.3) * 34;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ang + sdt * (hash(k * 2.1) * 8 - 4));
      ctx.fillStyle = k % 3 === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(239,68,68,0.8)';
      ctx.globalAlpha = clamp(1 - sdt / 0.85);
      ctx.beginPath();
      ctx.moveTo(0, -sz);
      ctx.lineTo(sz * 0.65, sz * 0.4);
      ctx.lineTo(-sz * 0.45, sz * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    drawFlash(ctx, t, 13.60, { dur: 0.35, color: '#FF3B30', peak: 0.68 });
  }
  ctx.restore();
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 3 (15.20s - 21.20s): THE REVEAL — MEET FASTLOTTIE!
// =========================================================================
function renderScene3(ctx, t, sprites) {
  const dt = t - 15.20;
  const shake = cameraShake(t, 15.20, 0.4, 22);
  const beatPulse = Math.pow(Math.max(0, 1 - ((dt % (60 / 132)) / 0.22)), 2);

  ctx.save();
  ctx.translate(shake.x, shake.y);
  drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.25 + beatPulse * 0.15, gridSpeed: 1.6, gridY: 0.64 });

  drawShockwave(ctx, W / 2, H / 2, dt / 1.1, { color: C.blue, maxR: 1350, width: 28 });
  drawShockwave(ctx, W / 2, H / 2, (dt - 0.12) / 1.0, { color: C.blueBright, maxR: 1100, width: 14 });

  // Clean orbiting halo of REAL 60fps FastLottie stickers strictly framing behind logo & pills!
  const orbitCount = 12;
  const orbitP = easeOutExpo(norm(dt, 0.05, 0.95));
  const stickers = [];
  for (let i = 0; i < orbitCount; i++) {
    const ang = (i / orbitCount) * Math.PI * 2 + dt * 0.55;
    const x = W / 2 + Math.cos(ang) * 795 * orbitP;
    const y = H / 2 + Math.sin(ang) * 410 * orbitP;
    const depth = (Math.sin(ang) + 1) / 2;
    const size = lerp(102, 166, depth) * (0.4 + 0.6 * orbitP);
    const name = i % 3 === 0 ? 'phoenix' : `emoji_${(i * 3) % 16}`;
    stickers.push({ x, y, size, depth, name, i });
  }
  stickers.sort((a, b) => a.depth - b.depth);
  for (const s of stickers) {
    drawSprite(ctx, sprites, s.name, s.x - s.size / 2, s.y - s.size / 2, s.size, t, {
      phase: s.i * 0.23,
      alpha: lerp(0.38, 0.90, s.depth),
      glow: s.name === 'phoenix' ? 'rgba(249, 115, 22, 0.35)' : null,
      frameWindow: s.name === 'phoenix' ? [0, 26] : null,
    });
  }

  const halo = ctx.createRadialGradient(W / 2, H * 0.52, 80, W / 2, H * 0.52, 650);
  halo.addColorStop(0, 'rgba(6,9,17,0.88)');
  halo.addColorStop(0.68, 'rgba(6,9,17,0.52)');
  halo.addColorStop(1, 'rgba(6,9,17,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  const pEyebrow = spring(dt - 0.12, { stiffness: 260, damping: 18 });
  if (pEyebrow > 0.01) {
    ctx.save();
    ctx.globalAlpha = clamp(pEyebrow);
    drawPill(ctx, W / 2, H * 0.34, 'OPEN-SOURCE FLUTTER LOTTIE ENGINE', {
      bg: 'rgba(6, 20, 42, 0.94)', border: 'rgba(84, 197, 248, 0.62)', color: C.blueBright, fontSize: 20, dotColor: C.blue,
    });
    ctx.restore();
  }

  const pTitle = spring(dt, { stiffness: 310, damping: 17 });
  const titleScale = lerp(1.65, 1.0, pTitle) * (1 + beatPulse * 0.016);
  const grad = ctx.createLinearGradient(-520, -90, 520, 95);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.42, '#E0F2FE');
  grad.addColorStop(0.76, '#54C5F8');
  grad.addColorStop(1, '#027DFD');

  // Sweeping specular sheen across FASTLOTTIE letters!
  const sheenPos = ((dt - 0.8) % 2.4) / 1.1;
  drawKineticText(ctx, 'FASTLOTTIE', W / 2, H * 0.495, {
    size: 196, weight: 900, color: grad, tracking: -0.04, scale: titleScale,
    glow: C.blueGlow, glowBlur: 56, alpha: clamp(pTitle * 1.4),
    sheenPos: dt > 0.8 ? sheenPos : null,
  });

  const pSub = spring(dt - 0.55, { stiffness: 240, damping: 20 });
  drawKineticText(ctx, 'WRITTEN IN DART.  ENGINEERED LIKE A GAME ENGINE.', W / 2, H * 0.635, {
    size: 36, weight: 800, color: C.text, tracking: 0.08, alpha: clamp(pSub),
  });

  const pills = [
    ['DIRECT UTF-8 PARSER', 0.95],
    ['NATIVE LZ4 STRIP CACHE', 1.15],
    ['ZERO PLATFORMVIEW', 1.35],
  ];
  for (let i = 0; i < pills.length; i++) {
    const [label, delay] = pills[i];
    const sp = spring(dt - delay, { stiffness: 260, damping: 19 });
    if (sp > 0.01) {
      ctx.save();
      ctx.globalAlpha = clamp(sp);
      drawPill(ctx, W / 2 + (i - 1) * 390, lerp(H * 0.77 + 30, H * 0.75, sp), label, {
        bg: 'rgba(10, 18, 34, 0.96)', border: 'rgba(84,197,248,0.28)', color: '#E0F2FE', fontSize: 18,
      });
      ctx.restore();
    }
  }

  drawFlash(ctx, t, 15.20, { dur: 0.32, color: '#BAE6FD', peak: 0.65 });
  ctx.restore();
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 4 (21.20s - 26.60s): DART AOT vs KOTLIN vs SWIFT LIVE PARSE RACE
// =========================================================================
function renderScene4(ctx, t) {
  const dt = t - 21.20;
  drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.18, gridSpeed: 1.25 });
  drawTopHud(ctx, 'DIRECT UTF-8 BYTE PARSER', 'ARM64 RELEASE · MEDIAN PARSE TIME', C.blueBright);

  ctx.save();
  ctx.font = `600 16px ${FONT_MONO}`;
  ctx.fillStyle = 'rgba(84, 197, 248, 0.09)';
  const tokens = ['{"v":"5.5.2"', '"fr":60', '"ks":{"p":', '[0.42,1.0]', '"ty":"sh"', '0x7B 0x22', 'Float32List', 'UTF-8'];
  for (let c = 0; c < 14; c++) {
    const x = 60 + c * 138;
    const y = ((t * (110 + (c % 4) * 45) + c * 170) % (H + 160)) - 80;
    ctx.fillText(tokens[c % tokens.length], x, y);
  }
  ctx.restore();

  const pHead = spring(dt, { stiffness: 280, damping: 20 });
  drawKineticText(ctx, 'THEY SAID DART CAN’T BEAT SWIFT OR KOTLIN.', W / 2, lerp(116, 148, pHead), {
    size: 56, weight: 900, color: C.text, alpha: clamp(pHead),
  });
  drawKineticText(ctx, 'ZERO-DOM BYTE PARSING  ·  LOWER IS FASTER', W / 2, 214, {
    size: 23, weight: 700, color: C.blueBright, font: FONT_MONO, tracking: 0.08,
  });

  const raceStart = 0.55;
  const fmtUs = (us) => (us >= 1000 ? `${(us / 1000).toFixed(2)} ms` : `${Math.round(us)} µs`);

  const drawRaceCard = (x, title, badge, badgeColor, rows, heroMult) => {
    drawCard(ctx, x, 266, 845, 706, {
      fill: 'rgba(10, 16, 28, 0.93)', border: hexAlpha(badgeColor, 0.38), glow: hexAlpha(badgeColor, 0.18),
    });
    drawKineticText(ctx, title, x + 44, 328, { size: 32, weight: 800, color: C.text, align: 'left' });
    drawPill(ctx, x + 685, 328, badge, {
      bg: hexAlpha(badgeColor, 0.16), border: hexAlpha(badgeColor, 0.52), color: badgeColor, fontSize: 18, height: 38,
    });

    const mScale = spring(dt - 1.05, { stiffness: 280, damping: 17 });
    drawKineticText(ctx, heroMult, x + 44, 428, {
      size: 74, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow, scale: lerp(0.85, 1.0, clamp(mScale)),
    });

    const maxTrackW = 505;
    let ry = 530;
    for (let idx = 0; idx < rows.length; idx++) {
      const r = rows[idx];
      drawKineticText(ctx, r.name, x + 44, ry, { size: 20, weight: 700, color: C.muted, align: 'left', font: FONT_MONO });

      const fastFrac = r.fast / r.nat;
      const fastP = easeOutExpo(norm(dt, raceStart + idx * 0.15, raceStart + idx * 0.15 + 0.52));
      const natP = easeOutCubic(norm(dt, raceStart + idx * 0.15, raceStart + idx * 0.15 + 1.95));

      // FastLottie bar + live ticking µs stopwatch + DONE ✓ lock!
      const fy = ry + 26;
      const fw = Math.max(20, maxTrackW * fastFrac * fastP);
      ctx.fillStyle = C.blue;
      ctx.shadowColor = C.blueGlow;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(x + 44, fy, fw, 26, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      const fastTick = fmtUs(r.fast * fastP);
      const locked = fastP > 0.98 ? ' ✓' : '';
      drawKineticText(ctx, `FastLottie  ${fastTick}${locked}`, x + 58 + fw, fy + 14, {
        size: 19, weight: 800, color: C.blueBright, align: 'left', font: FONT_MONO,
      });

      // Native bar + live ticking µs stopwatch
      const ny = ry + 60;
      const nw = Math.max(22, maxTrackW * natP);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.78)';
      ctx.beginPath();
      ctx.roundRect(x + 44, ny, nw, 26, 7);
      ctx.fill();
      drawKineticText(ctx, `${r.natName}  ${fmtUs(r.nat * natP)}`, x + 58 + nw, ny + 14, {
        size: 19, weight: 700, color: '#FCA5A5', align: 'left', font: FONT_MONO,
      });
      ry += 140;
    }
  };

  drawRaceCard(96, 'vs Native Kotlin (Pixel 7a)', 'lottie-android 6.7.1', C.blueBright, [
    { name: 'Simple Icon  ·  17.5×', fast: 43, nat: 751, natName: 'Kotlin' },
    { name: 'Complex Sticker  ·  5.5×', fast: 1511, nat: 8345, natName: 'Kotlin' },
    { name: 'Heavy Phoenix  ·  3.0×', fast: 12102, nat: 35878, natName: 'Kotlin' },
  ], '2× – 17.5× FASTER');

  drawRaceCard(979, 'vs Native Swift (Apple M5)', 'lottie-ios 4.6.1', C.indigo, [
    { name: 'Complex Sticker  ·  10.3×', fast: 537, nat: 5533, natName: 'Swift' },
    { name: 'Shape Morph  ·  8.2×', fast: 691, nat: 5683, natName: 'Swift' },
    { name: 'Heavy Phoenix  ·  4.9×', fast: 6527, nat: 31997, natName: 'Swift' },
  ], '4.2× – 10.3× FASTER');

  drawShockwave(ctx, W / 2, H / 2, (dt - 0.95) / 0.85, { color: C.blue, maxR: 1200, width: 10 });
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 5 (26.60s - 34.40s): THE 90 HZ / 120 HZ SPLIT-SCREEN MASSACRE!
// =========================================================================
function renderScene5(ctx, t, sprites) {
  const dt = t - 26.60;
  const enter = easeOutExpo(norm(dt, 0, 0.45));

  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  const gLeft = ctx.createRadialGradient(W * 0.25, H * 0.5, 50, W * 0.25, H * 0.5, 640);
  gLeft.addColorStop(0, 'rgba(239, 68, 68, 0.16)');
  gLeft.addColorStop(1, 'rgba(7, 7, 10, 0)');
  ctx.fillStyle = gLeft;
  ctx.fillRect(0, 0, W / 2, H);

  const gRight = ctx.createRadialGradient(W * 0.75, H * 0.5, 50, W * 0.75, H * 0.5, 680);
  gRight.addColorStop(0, 'rgba(2, 125, 253, 0.25)');
  gRight.addColorStop(1, 'rgba(6, 9, 17, 0)');
  ctx.fillStyle = gRight;
  ctx.fillRect(W / 2, 0, W / 2, H);

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.20)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 82);
  ctx.lineTo(W / 2, H - 56);
  ctx.stroke();
  drawPill(ctx, W / 2, 118, 'VS', {
    bg: '#0E172A', border: 'rgba(148,197,255,0.34)', color: C.text, fontSize: 22, height: 46, padX: 22,
  });
  ctx.restore();

  drawTopHud(ctx, 'HEAD-TO-HEAD · 16 UNIQUE STICKERS', 'GOOGLE PIXEL 7a · 90 HZ (11.11 ms BUDGET)', C.blueBright);

  // LEFT: NATIVE ANDROID
  const lx = lerp(-120, 68, enter);
  const natFps = 31 + Math.floor(hash(Math.floor(t * 6)) * 12);
  drawKineticText(ctx, 'NATIVE ANDROID', lx + 8, 126, { size: 34, weight: 900, color: C.redBright, align: 'left', tracking: 0.03 });
  drawPill(ctx, lx + 742, 126, `${natFps} FPS ↓`, {
    bg: 'rgba(239,68,68,0.22)', border: C.red, color: '#FCA5A5', fontSize: 18, height: 34, padX: 16,
  });
  drawKineticText(ctx, 'lottie-android HW (Kotlin)  ·  dotlottie (C++)', lx + 8, 168, {
    size: 18, weight: 600, color: C.muted, align: 'left', font: FONT_MONO,
  });

  drawCard(ctx, lx, 198, 820, 502, { fill: 'rgba(18, 10, 14, 0.88)', border: 'rgba(239, 68, 68, 0.38)' });
  const sCell = 108, sGap = 14, sOx = lx + (820 - (4 * sCell + 3 * sGap)) / 2, sOy = 214;
  for (let i = 0; i < 16; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    drawSprite(ctx, sprites, `emoji_${i}`, sOx + col * (sCell + sGap), sOy + row * (sCell + sGap), sCell, t, {
      phase: i * 0.21, stutterFps: 8,
    });
  }

  drawCard(ctx, lx, 718, 820, 290, { fill: 'rgba(12, 8, 10, 0.94)', border: 'rgba(239, 68, 68, 0.42)' });
  const bgY = 718 + 205 - (11.11 / 34) * 165;
  for (let i = 0; i < 48; i++) {
    const ms = 14.5 + hash(i * 4.1 + Math.floor(t * 16)) * 18.5;
    const bh = Math.min(170, (ms / 34) * 165);
    ctx.fillStyle = ms > 24 ? '#FF2A55' : C.red;
    ctx.fillRect(lx + 24 + i * 16.1, 718 + 205 - bh, 12.5, bh);
  }
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx + 20, bgY);
  ctx.lineTo(lx + 800, bgY);
  ctx.stroke();
  ctx.restore();
  drawCard(ctx, lx + 706, bgY - 27, 94, 24, {
    radius: 6, fill: 'rgba(7,7,10,0.92)', border: 'rgba(250,204,21,0.55)', lineWidth: 1, topSheen: false,
  });
  drawKineticText(ctx, '11.11 ms', lx + 792, bgY - 15, {
    size: 14, weight: 800, color: '#FACC15', align: 'right', font: FONT_MONO,
  });
  drawKineticText(ctx, '11.4 – 25.6 ms', lx + 30, 960, { size: 46, weight: 900, color: C.redBright, align: 'left' });
  drawKineticText(ctx, '62.9% – 100% JANK', lx + 790, 962, { size: 32, weight: 900, color: C.red, align: 'right', font: FONT_MONO });

  // RIGHT: FLUTTER + FASTLOTTIE
  const rx = lerp(W + 120, W / 2 + 72, enter);
  drawKineticText(ctx, 'FLUTTER + FASTLOTTIE', rx + 8, 126, {
    size: 34, weight: 900, color: C.blueBright, align: 'left', tracking: 0.03, glow: C.blueGlow,
  });
  drawPill(ctx, rx + 716, 126, '90.0 FPS LOCKED', {
    bg: 'rgba(2,125,253,0.22)', border: C.blueBright, color: '#E0F2FE', fontSize: 17, height: 34, padX: 14,
  });
  drawKineticText(ctx, 'p95: 2.30 ms on Pixel 7a  ·  0.27 ms med on Apple M5', rx + 8, 168, {
    size: 18, weight: 700, color: '#BAE6FD', align: 'left', font: FONT_MONO,
  });

  drawCard(ctx, rx, 198, 820, 502, { fill: 'rgba(7, 15, 29, 0.90)', border: 'rgba(84, 197, 248, 0.56)', glow: 'rgba(2, 125, 253, 0.28)', glowBlur: 40 });
  const rOx = rx + (820 - (4 * sCell + 3 * sGap)) / 2;
  for (let i = 0; i < 16; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    drawSprite(ctx, sprites, `emoji_${i}`, rOx + col * (sCell + sGap), sOy + row * (sCell + sGap), sCell, t, {
      phase: i * 0.21, stutterFps: 0,
    });
  }

  drawCard(ctx, rx, 718, 820, 290, { fill: 'rgba(6, 12, 24, 0.95)', border: 'rgba(84, 197, 248, 0.50)' });
  for (let i = 0; i < 48; i++) {
    const ms = 1.15 + hash(i * 7.3 + Math.floor(t * 28)) * 0.95;
    const bh = Math.max(8, (ms / 34) * 165);
    ctx.fillStyle = C.blueBright;
    ctx.fillRect(rx + 24 + i * 16.1, 718 + 205 - bh, 12.5, bh);
  }
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rx + 20, bgY);
  ctx.lineTo(rx + 800, bgY);
  ctx.stroke();
  ctx.restore();
  drawKineticText(ctx, '11.11 ms', rx + 792, bgY - 14, { size: 15, weight: 700, color: '#FACC15', align: 'right', font: FONT_MONO });
  drawKineticText(ctx, '1.38 ms', rx + 30, 960, { size: 54, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow });
  drawKineticText(ctx, '0.0% JANK (PREWARM)', rx + 790, 962, { size: 28, weight: 900, color: C.blueBright, align: 'right', font: FONT_MONO });

  if (dt > 2.2) {
    const sp = spring(dt - 2.2, { stiffness: 300, damping: 18 });
    ctx.save();
    ctx.globalAlpha = clamp(sp);
    drawPill(ctx, W / 2, H - 34, '6× – 8× FASTER FRAMES THAN NATIVE ANDROID', {
      bg: 'rgba(6, 22, 46, 0.98)', border: C.blueBright, color: '#E0F2FE', fontSize: 20, height: 44, padX: 30, dotColor: C.blue,
    });
    ctx.restore();
  }

  drawFlash(ctx, t, 26.60, { dur: 0.22, color: C.blue, peak: 0.36 });
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 6 (34.40s - 41.60s): HOW IT CHEATS PHYSICS (3 RAPID FLASH CARDS)
// =========================================================================
function renderScene6(ctx, t, sprites) {
  // Card 1 (34.40 - 36.80s): CONTENT-KEY DEDUP + glowing vector convergence traces!
  if (t < 36.80) {
    const dt = t - 34.40;
    drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.24, gridSpeed: 1.8 });
    drawTopHud(ctx, 'ARCHITECTURE · 01 / 03', 'PIXEL 7a · 24× SHARED STICKER', C.blueBright);

    drawPill(ctx, W / 2, 134, '01 · CONTENT-KEY DEDUPLICATION', {
      bg: 'rgba(2,125,253,0.18)', border: C.blueBright, color: C.blueBright, fontSize: 22, dotColor: C.blue,
    });

    const collapse = dt < 0.9 ? easeInOutCubic(norm(dt, 0.05, 0.85)) : 1 - easeOutBack(norm(dt, 1.05, 1.85));
    const cx = 480, cy = 545;

    // Subtle Flutter sky convergence traces connecting the 24 positions to the 1× center core
    ctx.save();
    ctx.strokeStyle = hexAlpha(C.blueBright, 0.16 + collapse * 0.24);
    ctx.lineWidth = 1.25;
    for (let i = 0; i < 24; i++) {
      const gx = 128 + (i % 6) * 124 + 54;
      const gy = 285 + Math.floor(i / 6) * 130 + 54;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(cx + 15, cy + 15);
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
        glow: i === 0 && collapse > 0.6 ? C.blueBright : null,
        frameWindow: [0, 26],
      });
    }
    if (collapse > 0.7) {
      drawShockwave(ctx, cx + 15, cy + 15, (dt - 0.8) / 0.7, { color: C.blueBright, maxR: 380, width: 12 });
    }

    const p = spring(dt, { stiffness: 280, damping: 18 });
    const rx = lerp(1120, 960, clamp(p));
    drawKineticText(ctx, '24× STICKERS.', rx, 370, { size: 96, weight: 900, color: C.text, align: 'left' });
    drawKineticText(ctx, '1× RENDER.', rx, 485, { size: 110, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow });
    drawCard(ctx, rx, 565, 840, 250, { fill: 'rgba(8, 17, 32, 0.92)', border: 'rgba(84, 197, 248, 0.44)' });
    drawKineticText(ctx, '25.7 ms', rx + 40, 646, { size: 86, weight: 900, color: C.text, align: 'left', font: FONT_MONO });
    drawKineticText(ctx, 'COLD LOAD ON PIXEL 7a', rx + 40, 718, { size: 24, weight: 700, color: C.blueBright, align: 'left', font: FONT_MONO });
    drawKineticText(ctx, '26× faster than Native C++ dotlottie (668 ms)', rx + 40, 768, { size: 23, weight: 600, color: C.muted, align: 'left' });
    drawFlash(ctx, t, 34.40, { dur: 0.18, color: C.blue, peak: 0.32 });
    drawFilmGrain(ctx, t);
    return;
  }

  // Card 2 (36.80 - 39.20s): NATIVE LZ4 STRIPS — Hydraulic Flutter Sky Press Crushing 3.27 GiB -> 209 MiB!
  if (t < 39.20) {
    const dt = t - 36.80;
    drawBackdrop(ctx, t, { accent: C.blueBright, accentAlpha: 0.22, gridSpeed: 1.8 });
    drawTopHud(ctx, 'ARCHITECTURE · 02 / 03', 'APPLE M5 · 120 HZ', C.blueBright);

    drawPill(ctx, W / 2, 134, '02 · NATIVE LZ4 STRIP CACHE', {
      bg: 'rgba(84,197,248,0.16)', border: C.blueBright, color: '#E0F2FE', fontSize: 22, dotColor: C.blueBright,
    });

    const crush = easeOutExpo(norm(dt, 0.2, 1.05));
    const leftX = 160, baseLineY = 860, redH = 560;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.84)';
    ctx.shadowColor = C.redGlow;
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.roundRect(leftX, baseLineY - redH, 230, redH, 16);
    ctx.fill();
    ctx.shadowBlur = 0;
    drawKineticText(ctx, '3.27 GiB', leftX + 115, baseLineY - redH - 42, { size: 44, weight: 900, color: C.redBright, font: FONT_MONO });
    drawKineticText(ctx, 'lottie-ios (auto)', leftX + 115, baseLineY + 42, { size: 24, weight: 700, color: C.muted });

    const rightX = 480;
    const blueH = lerp(560, 44, crush);
    ctx.fillStyle = C.blueBright;
    ctx.shadowColor = C.blueGlow;
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.roundRect(rightX, baseLineY - blueH, 230, blueH, 12);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Crisp glowing compression caliper line riding on top of the shrinking bar!
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rightX - 18, baseLineY - blueH - 6, 266, 3);
    const mbVal = Math.round(lerp(3271, 209, crush));
    drawKineticText(ctx, `${mbVal} MiB`, rightX + 115, baseLineY - blueH - 48, {
      size: 48, weight: 900, color: C.blueBright, font: FONT_MONO, glow: C.blueGlow,
    });
    drawKineticText(ctx, 'FastLottie', rightX + 115, baseLineY + 42, { size: 26, weight: 800, color: C.blueBright });

    const rx = 860;
    const p = spring(dt, { stiffness: 280, damping: 18 });
    drawKineticText(ctx, '15× LESS RAM.', rx, 370, {
      size: 108, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow, scale: lerp(1.18, 1.0, clamp(p)),
    });
    drawKineticText(ctx, '17.7 µs DECODE.', rx, 488, { size: 70, weight: 900, color: C.text, align: 'left', font: FONT_MONO });
    drawCard(ctx, rx, 575, 930, 206, { fill: 'rgba(8, 17, 32, 0.92)', border: 'rgba(84, 197, 248, 0.44)' });
    drawKineticText(ctx, '5× LOWER CPU vs lottie-ios (13.6% vs 72.2%)', rx + 40, 646, { size: 25, weight: 800, color: '#E0F2FE', align: 'left', font: FONT_MONO });
    drawKineticText(ctx, '2.2× LOWER CPU vs C++ dotlottie (27.0% vs 59.3%)', rx + 40, 718, { size: 25, weight: 800, color: C.blueBright, align: 'left', font: FONT_MONO });

    drawFlash(ctx, t, 36.80, { dur: 0.18, color: C.blueBright, peak: 0.3 });
    drawFilmGrain(ctx, t);
    return;
  }

  // Card 3 (39.20 - 41.60s): ZERO PLATFORMVIEW TAX — Cracking + Sparks + Falling +164 MiB Anchor!
  const dt = t - 39.20;
  drawBackdrop(ctx, t, { accent: C.indigo, accentAlpha: 0.22, gridSpeed: 1.8 });
  drawTopHud(ctx, 'ARCHITECTURE · 03 / 03', 'PIXEL 7a · TOTAL PSS MEMORY', C.indigo);

  drawPill(ctx, W / 2, 134, '03 · ZERO PLATFORMVIEW TAX', {
    bg: 'rgba(99,102,241,0.20)', border: C.indigo, color: '#E0E7FF', fontSize: 22, dotColor: C.indigo,
  });

  const dropP = easeInOutCubic(norm(dt, 0.45, 1.45));
  const lx = 110;
  drawKineticText(ctx, 'LIGHTER THAN PURE', lx, 330, { size: 78, weight: 900, color: C.text, align: 'left' });
  drawKineticText(ctx, 'NATIVE KOTLIN.', lx, 424, { size: 96, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow });
  drawKineticText(ctx, 'FLUTTER ENGINE INCLUDED.', lx, 502, { size: 32, weight: 800, color: '#C7D2FE', align: 'left', font: FONT_MONO, tracking: 0.06 });

  const bx = 970, maxW = 790;
  const bars = [
    { label: 'Flutter + FastLottie', val: 249.5, max: 550, color: C.blueBright, note: 'incl. Flutter engine & GL/EGL' },
    { label: 'Native Kotlin lottie-android HW', val: 373.7, max: 550, color: '#F97316', note: '+124 MiB heavier than FastLottie' },
    { label: 'Flutter lottie_native (PlatformView)', val: 537.7, max: 550, color: C.red, note: '537.7 MiB total', splitAt: 373.7 },
  ];
  let by = 290;
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i];
    const grow = easeOutExpo(norm(dt, 0.1 + i * 0.12, 0.8 + i * 0.12));
    drawKineticText(ctx, b.label, bx, by, { size: 24, weight: 700, color: C.text, align: 'left' });
    const fullW = (b.val / b.max) * maxW * grow;
    if (!b.splitAt) {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(bx, by + 28, fullW, 56, 12);
      ctx.fill();
      drawKineticText(ctx, `${b.val.toFixed(1)} MiB`, bx + fullW + 18, by + 56, { size: 30, weight: 900, color: b.color, align: 'left', font: FONT_MONO });
      drawKineticText(ctx, b.note, bx, by + 108, { size: 19, weight: 600, color: C.muted, align: 'left', font: FONT_MONO });
    } else {
      const baseW = (b.splitAt / b.max) * maxW * grow;
      const taxW = fullW - baseW;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.beginPath();
      ctx.roundRect(bx, by + 28, baseW, 56, 12);
      ctx.fill();
      // Sparks bursting at the shear fracture point (dt 0.45 - 0.85)
      if (dt > 0.45 && dt < 0.95) {
        const spT = (dt - 0.45) / 0.5;
        for (let s = 0; s < 10; s++) {
          const ang = -Math.PI * 0.8 + hash(s * 7.1) * Math.PI * 1.6;
          const dist = spT * (70 + hash(s * 3.3) * 90);
          ctx.fillStyle = `rgba(254, 240, 138, ${1 - spT})`;
          ctx.fillRect(bx + baseW + Math.cos(ang) * dist, by + 56 + Math.sin(ang) * dist, 5, 5);
        }
      }
      ctx.save();
      ctx.translate(bx + baseW + 6, by + 28 + dropP * 270);
      ctx.rotate(dropP * 0.28);
      ctx.globalAlpha = 1 - dropP * 0.72;
      ctx.fillStyle = C.red;
      ctx.shadowColor = C.redGlow;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.roundRect(0, 0, Math.max(40, taxW), 56, 12);
      ctx.fill();
      drawKineticText(ctx, '+164 MiB TAX', taxW / 2, 28, { size: 20, weight: 900, color: '#FFFFFF', font: FONT_MONO });
      ctx.restore();
      drawKineticText(ctx, 'PlatformView adds +164 MiB tax — FastLottie pays zero.', bx, by + 108, {
        size: 19, weight: 700, color: C.redBright, align: 'left', font: FONT_MONO,
      });
    }
    by += 205;
  }

  drawCard(ctx, lx, 595, 760, 175, { fill: 'rgba(10, 17, 34, 0.92)', border: 'rgba(84, 197, 248, 0.44)' });
  drawKineticText(ctx, 'NO ANDROIDVIEW · NO UIKITVIEW', lx + 36, 654, { size: 28, weight: 900, color: C.blueBright, align: 'left', font: FONT_MONO });
  drawKineticText(ctx, 'Direct Flutter texture composition at 120 Hz.', lx + 36, 714, { size: 24, weight: 600, color: C.muted, align: 'left' });

  drawFlash(ctx, t, 39.20, { dur: 0.18, color: C.indigo, peak: 0.28 });
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 7 (41.60s - 49.00s): THE HONESTY MIC-DROP!!
// =========================================================================
function renderScene7(ctx, t, sprites) {
  const dt = t - 41.60;

  if (t < 43.60) {
    drawBackdrop(ctx, t, { accent: '#94A3B8', accentAlpha: 0.08, gridSpeed: 0.18 });
    const p = spring(dt, { stiffness: 220, damping: 22 });
    drawKineticText(ctx, 'WAIT.', W / 2, H * 0.34, { size: 46, weight: 800, color: C.muted, tracking: 0.14, alpha: clamp(p) });
    drawKineticText(ctx, 'DOES FASTLOTTIE BEAT APPLE CORE ANIMATION', W / 2, H * 0.48, { size: 62, weight: 800, color: C.text, alpha: clamp(spring(dt - 0.25)) });
    drawKineticText(ctx, 'ON A SINGLE SIMPLE ICON?', W / 2, H * 0.58, { size: 76, weight: 900, color: C.text, alpha: clamp(spring(dt - 0.4)) });
    drawFilmGrain(ctx, t);
    return;
  }

  if (t < 45.15) {
    const dtb = t - 43.60;
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, W, H);
    const p = spring(dtb, { stiffness: 420, damping: 24 });
    drawKineticText(ctx, 'NO.', W / 2, H * 0.43, { size: 210, weight: 900, color: '#FFFFFF', scale: lerp(1.2, 1.0, p) });
    drawKineticText(ctx, 'NOTHING DOES.', W / 2, H * 0.60, { size: 74, weight: 800, color: C.muted, alpha: clamp(spring(dtb - 0.25)) });
    drawKineticText(ctx, 'lottie-ios Core Animation on simple icons: 1–4% app CPU · 36 MiB RAM (offloaded to WindowServer)', W / 2, H * 0.78, {
      size: 22, weight: 600, color: C.dim, font: FONT_MONO, alpha: clamp(spring(dtb - 0.35)),
    });
    drawFilmGrain(ctx, t);
    return;
  }

  if (t < 47.40) {
    const dtc = t - 45.15;
    const tension = norm(dtc, 0, 2.25);
    const shake = cameraShake(t, t - 0.01, 0.5, tension * 9);
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.12 + tension * 0.26, gridSpeed: 0.6 + tension * 2.5 });

    drawKineticText(ctx, 'DOES IT CRUSH EVERYTHING', W / 2, H * 0.33, { size: 78, weight: 900, color: C.text });
    drawKineticText(ctx, 'WHEN YOUR APP ACTUALLY GETS HARD?', W / 2, H * 0.44, { size: 70, weight: 900, color: C.blueBright, glow: C.blueGlow });

    const items = [
      ['16+ LIVE STICKERS', 0.35, -490],
      ['COMPLEX MASKS & MATTES', 0.80, -160],
      ['90 & 120 HZ LOCKED', 1.25, 175],
      ['ZERO MEMORY CLIFFS', 1.65, 485],
    ];
    for (const [label, delay, ox] of items) {
      const sp = spring(dtc - delay, { stiffness: 360, damping: 18 });
      const freshHit = Math.max(0, 1 - (dtc - delay) / 0.25);
      if (sp > 0.01) {
        drawPill(ctx, W / 2 + ox, lerp(H * 0.66 + 40, H * 0.63, sp), label, {
          bg: freshHit > 0.3 ? 'rgba(84,197,248,0.45)' : 'rgba(2,125,253,0.20)',
          border: freshHit > 0.3 ? '#FFFFFF' : C.blueBright,
          color: '#FFFFFF', fontSize: 20, height: 50, padX: 22,
        });
      }
    }
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  // Phase 7D (47.40 - 49.00s): COLOSSAL FINAL BOOM — "EVERY. SINGLE. TIME."
  const dtd = t - 47.40;
  const shake = cameraShake(t, 47.40, 0.55, 34);
  ctx.save();
  ctx.translate(shake.x, shake.y);
  drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.40, gridSpeed: 2.8 });
  drawShockwave(ctx, W / 2, H / 2, dtd / 0.9, { color: C.blueBright, maxR: 1500, width: 34 });
  drawShockwave(ctx, W / 2, H / 2, (dtd - 0.1) / 0.85, { color: '#FFFFFF', maxR: 1200, width: 14 });

  for (let i = 0; i < 24; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    drawSprite(ctx, sprites, 'phoenix', 100 + col * 295, 95 + row * 245, 165, t, {
      phase: i * 0.09, alpha: 0.36, glow: C.blueGlow, frameWindow: [0, 26],
    });
  }

  const plate = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 740);
  plate.addColorStop(0, 'rgba(5, 10, 22, 0.88)');
  plate.addColorStop(1, 'rgba(5, 10, 22, 0)');
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, W, H);

  const p = spring(dtd, { stiffness: 360, damping: 16 });
  drawKineticText(ctx, 'EVERY.', W / 2, H * 0.31, {
    size: 168, weight: 900, color: '#FFFFFF', scale: lerp(1.5, 1.0, p), glow: C.blueGlow, glowBlur: 44,
  });
  drawKineticText(ctx, 'SINGLE.', W / 2, H * 0.51, {
    size: 168, weight: 900, color: C.blueBright, scale: lerp(1.5, 1.0, spring(dtd - 0.08, { stiffness: 360, damping: 16 })), glow: C.blue, glowBlur: 52,
  });
  drawKineticText(ctx, 'TIME.', W / 2, H * 0.71, {
    size: 176, weight: 900, color: '#FFFFFF', scale: lerp(1.5, 1.0, spring(dtd - 0.16, { stiffness: 360, damping: 16 })), glow: C.blueBright, glowBlur: 44,
  });

  drawFlash(ctx, t, 47.40, { dur: 0.36, color: '#BAE6FD', peak: 0.72 });
  ctx.restore();
  drawFilmGrain(ctx, t);
}

// =========================================================================
// SCENE 8 (49.00s - 55.00s): LIVE TYPED DART CODE + ICONIC FINAL LOCKUP
// =========================================================================
function renderScene8(ctx, t, sprites) {
  const dt = t - 49.00;
  const fadeOutEnd = t > 54.35 ? 1 - norm(t, 54.35, 55.0) : 1;

  ctx.save();
  drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.22, gridSpeed: 0.65 });

  if (t < 52.20) {
    const enter = spring(dt, { stiffness: 250, damping: 20 });
    const exit = t > 51.75 ? 1 - norm(t, 51.75, 52.20) : 1;
    ctx.globalAlpha = clamp(enter) * exit;

    const cx = 130, cy = lerp(310, 236, enter);
    drawCard(ctx, cx, cy, 980, 494, {
      radius: 24, fill: 'rgba(10, 16, 28, 0.96)', border: 'rgba(84, 197, 248, 0.46)', glow: 'rgba(2, 125, 253, 0.26)', glowBlur: 48,
    });
    const dots = ['#EF4444', '#F59E0B', '#22C55E'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = dots[i];
      ctx.beginPath();
      ctx.arc(cx + 42 + i * 28, cy + 38, 8.5, 0, Math.PI * 2);
      ctx.fill();
    }
    drawKineticText(ctx, 'sticker_grid.dart', cx + 490, cy + 38, { size: 19, weight: 600, color: C.muted, font: FONT_MONO });
    ctx.strokeStyle = 'rgba(148,197,255,0.10)';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 72);
    ctx.lineTo(cx + 980, cy + 72);
    ctx.stroke();

    // Live character-by-character typing animation with blinking Flutter Sky cursor!
    const lines = [
      [{ text: 'FastLottie', color: '#54C5F8' }, { text: '.asset(', color: '#E2E8F0' }],
      [{ text: "  'assets/phoenix.json'", color: '#FDE047' }, { text: ',', color: '#94A3B8' }],
      [{ text: '  width: ', color: '#93C5FD' }, { text: '256', color: '#C084FC' }, { text: ',', color: '#94A3B8' }],
      [{ text: ')', color: '#E2E8F0' }],
    ];
    const totalChars = lines.reduce((acc, l) => acc + l.reduce((a, s) => a + s.text.length, 0), 0);
    let charsBudget = Math.floor(norm(dt, 0.15, 1.55) * totalChars);
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
    // Blinking Flutter Sky terminal caret
    if (Math.floor(t * 4) % 2 === 0 || dt < 1.6) {
      ctx.fillStyle = C.blueBright;
      ctx.fillRect(cursorX + 4, cursorY - 22, 14, 44);
    }

    const rx = 1200;
    drawCard(ctx, rx, cy, 580, 494, {
      radius: 24, fill: 'rgba(8, 16, 30, 0.94)', border: 'rgba(84, 197, 248, 0.48)', glow: 'rgba(2, 125, 253, 0.28)',
    });
    drawSprite(ctx, sprites, 'phoenix', rx + 100, cy + 56, 380, t, {
      glow: 'rgba(249, 115, 22, 0.42)', frameWindow: [0, 26],
    });

    drawPill(ctx, W / 2, 855, 'DROP-IN FLUTTER WIDGET  ·  ZERO NATIVE SETUP  ·  JSON & TGS', {
      bg: 'rgba(2, 125, 253, 0.20)', border: C.blueBright, color: '#E0F2FE', fontSize: 24, height: 58, padX: 34,
    });
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  // Phase 8B (52.20 - 55.00s): FINAL ICONIC BRAND LOCKUP
  const dtb = t - 52.20;
  const p = spring(dtb, { stiffness: 260, damping: 20 });
  ctx.globalAlpha = fadeOutEnd;

  drawShockwave(ctx, W / 2, H * 0.44, dtb / 1.2, { color: C.blue, maxR: 960, width: 12 });
  drawSprite(ctx, sprites, 'phoenix', W / 2 - 96, 165, 192, t, {
    alpha: clamp(p), glow: 'rgba(249, 115, 22, 0.45)', frameWindow: [0, 26],
  });

  const grad = ctx.createLinearGradient(-480, -85, 480, 90);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.42, '#E0F2FE');
  grad.addColorStop(0.76, '#54C5F8');
  grad.addColorStop(1, '#027DFD');

  drawKineticText(ctx, 'FASTLOTTIE', W / 2, 490, {
    size: 184, weight: 900, color: grad, tracking: -0.04, scale: lerp(1.18, 1.0, p),
    glow: C.blueGlow, glowBlur: 54, sheenPos: norm(dtb, 0.35, 1.5),
  });
  drawKineticText(ctx, 'Native-defying Lottie for Flutter.', W / 2, 622, {
    size: 46, weight: 700, color: C.text, alpha: clamp(spring(dtb - 0.2)),
  });
  drawPill(ctx, W / 2, 742, 'github.com/definev/fastlottie', {
    bg: 'rgba(2, 125, 253, 0.18)', border: 'rgba(84, 197, 248, 0.65)', color: C.blueBright,
    fontSize: 30, height: 64, padX: 38, dotColor: C.blue,
  });
  drawKineticText(
    ctx,
    'Benchmarked in Release on Pixel 7a (90 Hz) & Apple M5 (120 Hz) · vs Kotlin, Swift & C++ Native',
    W / 2, 986,
    { size: 19, weight: 600, color: C.muted, font: FONT_MONO }
  );

  ctx.restore();
  drawFilmGrain(ctx, t);
}

export function renderIntroFrame(ctx, frame, sprites) {
  const t = frame / 60;
  if (t < 5.20) return renderScene1(ctx, t, sprites);
  if (t < 15.20) return renderScene2(ctx, t, sprites);
  if (t < 21.20) return renderScene3(ctx, t, sprites);
  if (t < 26.60) return renderScene4(ctx, t);
  if (t < 34.40) return renderScene5(ctx, t, sprites);
  if (t < 41.60) return renderScene6(ctx, t, sprites);
  if (t < 49.00) return renderScene7(ctx, t, sprites);
  return renderScene8(ctx, t, sprites);
}
