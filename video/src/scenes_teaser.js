import {
  W, H, C, FONT_MONO,
  clamp, lerp, norm, easeOutExpo,
  spring, cameraShake,
  drawBackdrop, drawCard, drawPill, drawKineticText, drawGlitchOverlay,
  drawSprite, drawShockwave, drawFlash, drawTopHud, drawFilmGrain,
} from './engine.js';

/**
 * 15-Second Ultra-Viral Dark High-Impact X / Twitter Autoplay Cut (V2 Studio Polish).
 *   0.0 - 3.0s : "24 STICKERS. 120 HZ." instant hook + 6x4 live flaming phoenix burst
 *   3.0 - 8.0s : Split-screen Apple M5 (lottie-ios 3.27 GiB RAM explosion vs FastLottie 209 MiB flatline!)
 *   8.0 - 12.0s: Real Pixel 7a 90 Hz (1.38 ms vs 100% jank on Native lottie-android)
 *  12.0 - 15.0s: FASTLOTTIE chrome-emerald specular lockup + GitHub handle
 */
export function renderTeaserFrame(ctx, frame, sprites) {
  const t = frame / 60;

  if (t < 3.0) {
    const shake = cameraShake(t, 0.05, 0.35, 16);
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawBackdrop(ctx, t, { accent: t > 2.2 ? C.red : C.blue, accentAlpha: 0.26, gridSpeed: 1.8 });

    for (let i = 0; i < 24; i++) {
      const col = i % 6, row = Math.floor(i / 6);
      drawSprite(ctx, sprites, 'phoenix', 100 + col * 295, 95 + row * 245, 165, t, {
        phase: i * 0.08, alpha: 0.36, frameWindow: [0, 26],
      });
    }
    const plate = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 680);
    plate.addColorStop(0, 'rgba(6,9,17,0.88)');
    plate.addColorStop(1, 'rgba(6,9,17,0)');
    ctx.fillStyle = plate;
    ctx.fillRect(0, 0, W, H);

    const p1 = spring(t - 0.05, { stiffness: 320, damping: 18 });
    drawKineticText(ctx, '24 STICKERS.  120 HZ.', W / 2, H * 0.43, {
      size: 132, weight: 900, color: C.text, scale: lerp(1.3, 1.0, p1), glow: C.blueGlow,
    });
    drawKineticText(ctx, 'NATIVE SWIFT vs FLUTTER FASTLOTTIE', W / 2, H * 0.59, {
      size: 42, weight: 800, color: C.blueBright, font: FONT_MONO, tracking: 0.08, alpha: clamp(spring(t - 0.45)),
    });
    if (t > 2.3) drawGlitchOverlay(ctx, t, norm(t, 2.3, 3.0) * 0.8);
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  if (t < 8.0) {
    const dt = t - 3.0;
    const shake = cameraShake(t, 3.0, 0.5, 24);
    ctx.save();
    ctx.translate(shake.x, shake.y);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    drawTopHud(ctx, 'APPLE M5 · 120 HZ · 24× STICKERS', 'RELEASE BENCHMARK', C.blueBright);

    drawCard(ctx, 64, 108, 864, 904, {
      fill: 'rgba(20, 9, 12, 0.94)', border: 'rgba(239, 68, 68, 0.6)', glow: 'rgba(239,68,68,0.28)', glowBlur: 46,
    });
    drawPill(ctx, 496, 174, 'NATIVE SWIFT · lottie-ios 4.6.1', {
      bg: 'rgba(239,68,68,0.2)', border: C.red, color: '#FCA5A5', fontSize: 22, dotColor: C.red,
    });
    drawKineticText(ctx, '0 CA / 24 MAIN-THREAD FALLBACK', 496, 238, { size: 24, weight: 800, color: C.redBright, font: FONT_MONO });
    const ram = lerp(180, 3271, easeOutExpo(norm(dt, 0, 0.85)));
    drawKineticText(ctx, ram >= 1000 ? `${(ram / 1000).toFixed(2)} GiB` : `${Math.round(ram)} MiB`, 496, 430, {
      size: 162, weight: 900, color: '#FFFFFF', glow: C.red, glowBlur: 55,
      glitchPx: dt < 0.7 ? (1 - dt / 0.7) * 16 : 0,
    });
    drawKineticText(ctx, 'PHYSICAL RAM', 496, 540, { size: 28, weight: 800, color: C.redBright, font: FONT_MONO, tracking: 0.1 });
    drawKineticText(ctx, '56.7% JANK  ·  72.2% CPU', 496, 620, { size: 38, weight: 900, color: '#FCA5A5', font: FONT_MONO });
    for (let i = 0; i < 6; i++) {
      drawSprite(ctx, sprites, 'phoenix', 110 + i * 130, 740, 120, t, { stutterFps: 6, phase: i * 0.12 });
    }

    const rEnter = spring(t - 4.6, { stiffness: 320, damping: 18 });
    ctx.save();
    ctx.globalAlpha = clamp(rEnter * 1.4);
    const rx = lerp(W + 120, 992, clamp(rEnter));
    drawCard(ctx, rx, 108, 864, 904, {
      fill: 'rgba(7, 16, 32, 0.94)', border: C.blueBright, glow: 'rgba(2,125,253,0.38)', glowBlur: 48,
    });
    drawPill(ctx, rx + 432, 174, 'FLUTTER + FASTLOTTIE', {
      bg: 'rgba(2,125,253,0.22)', border: C.blueBright, color: '#E0F2FE', fontSize: 22, dotColor: C.blue,
    });
    drawKineticText(ctx, '1× SHARED LZ4 STRIP CACHE', rx + 432, 238, { size: 24, weight: 800, color: C.blueBright, font: FONT_MONO });
    drawKineticText(ctx, '209 MiB', rx + 432, 430, { size: 162, weight: 900, color: C.blueBright, glow: C.blueGlow, glowBlur: 54 });
    drawKineticText(ctx, '15× LESS RAM  ·  5× LOWER CPU', rx + 432, 540, { size: 28, weight: 800, color: '#BAE6FD', font: FONT_MONO, tracking: 0.06 });
    drawKineticText(ctx, '0.0% JANK  ·  13.6% CPU', rx + 432, 620, { size: 40, weight: 900, color: '#FFFFFF', font: FONT_MONO });
    for (let i = 0; i < 6; i++) {
      drawSprite(ctx, sprites, 'phoenix', rx + 46 + i * 130, 740, 120, t, { phase: i * 0.12, frameWindow: [0, 26] });
    }
    ctx.restore();

    drawFlash(ctx, t, 3.0, { dur: 0.25, color: C.red, peak: 0.55 });
    drawFlash(ctx, t, 4.6, { dur: 0.25, color: C.blue, peak: 0.45 });
    ctx.restore();
    drawFilmGrain(ctx, t);
    return;
  }

  if (t < 12.0) {
    const dt = t - 8.0;
    drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.26, gridSpeed: 1.9 });
    drawTopHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', '16 UNIQUE LOTTIE STICKERS', C.blueBright);

    drawCard(ctx, 84, 146, 620, 784, { fill: 'rgba(7, 16, 30, 0.92)', border: 'rgba(84,197,248,0.52)', glow: 'rgba(2,125,253,0.26)' });
    for (let i = 0; i < 16; i++) {
      drawSprite(ctx, sprites, `emoji_${i}`, 128 + (i % 4) * 136, 224 + Math.floor(i / 4) * 150, 120, t, { phase: i * 0.18 });
    }
    drawKineticText(ctx, '16 STICKERS · 90.0 FPS LOCKED', 394, 875, { size: 22, weight: 800, color: C.blueBright, font: FONT_MONO });

    const rx = 780;
    const p = spring(dt, { stiffness: 300, damping: 18 });
    drawKineticText(ctx, '1.38 ms', rx, 310, {
      size: 168, weight: 900, color: C.blueBright, align: 'left', glow: C.blueGlow, scale: lerp(1.18, 1.0, p),
    });
    drawKineticText(ctx, 'MEDIAN FRAME TIME  ·  0.0% JANK (PREWARM)', rx, 425, { size: 29, weight: 800, color: C.text, align: 'left', font: FONT_MONO });

    drawCard(ctx, rx, 490, 1050, 440, { fill: 'rgba(11, 16, 28, 0.94)', border: 'rgba(148,197,255,0.14)' });
    const rows = [
      ['Flutter + FastLottie', '1.38 ms', '0.0–0.7% jank', C.blueBright, 0.12],
      ['Native C++ dotlottie-android', '10.96 ms', '62.9% jank', C.amber, 0.72],
      ['Native Kotlin lottie-android HW', '25.60 ms', '100% jank', C.redBright, 1.0],
    ];
    rows.forEach(([name, ms, jank, col, frac], idx) => {
      const y = 556 + idx * 124;
      const g = easeOutExpo(norm(dt, 0.2 + idx * 0.12, 0.95 + idx * 0.12));
      drawKineticText(ctx, name, rx + 36, y, { size: 24, weight: 800, color: C.text, align: 'left' });
      drawKineticText(ctx, `${ms}  ·  ${jank}`, rx + 1014, y, { size: 22, weight: 800, color: col, align: 'right', font: FONT_MONO });
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.roundRect(rx + 36, y + 26, Math.max(30, 978 * frac * g), 32, 8);
      ctx.fill();
    });
    drawFilmGrain(ctx, t);
    return;
  }

  const dt = t - 12.0;
  const p = spring(dt, { stiffness: 300, damping: 18 });
  drawBackdrop(ctx, t, { accent: C.blue, accentAlpha: 0.30, gridSpeed: 1.2 });
  drawShockwave(ctx, W / 2, H * 0.48, dt / 1.0, { color: C.blueBright, maxR: 1200, width: 22 });
  drawSprite(ctx, sprites, 'phoenix', W / 2 - 96, 148, 192, t, { glow: 'rgba(249,115,22,0.45)', frameWindow: [0, 26] });

  const grad = ctx.createLinearGradient(-480, -85, 480, 90);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.42, '#E0F2FE');
  grad.addColorStop(0.76, '#54C5F8');
  grad.addColorStop(1, '#027DFD');

  drawKineticText(ctx, 'FASTLOTTIE', W / 2, 476, {
    size: 188, weight: 900, color: grad, tracking: -0.04, scale: lerp(1.35, 1.0, p),
    glow: C.blueGlow, glowBlur: 56, sheenPos: norm(dt, 0.3, 1.4),
  });
  drawKineticText(ctx, 'Built in Dart. Faster than Native where it hurts.', W / 2, 616, { size: 46, weight: 800, color: C.text });
  drawPill(ctx, W / 2, 744, 'github.com/definev/fastlottie', {
    bg: 'rgba(2,125,253,0.20)', border: C.blueBright, color: '#E0F2FE', fontSize: 28, height: 62, padX: 36, dotColor: C.blue,
  });
  drawFlash(ctx, t, 12.0, { dur: 0.3, color: '#BAE6FD', peak: 0.65 });
  drawFilmGrain(ctx, t);
}
