/**
 * 18-Second Dark-to-Light Apple Keynote Viral Cut for FastLottie (1080p 60fps).
 *   0.00 -  2.45s : Matte Obsidian hook — "24 stickers. 120 Hz." + 24 live FastLottie phoenixes
 *   2.45 -  8.09s : Apple M5 split-screen — Dark Native Swift (3.27 GiB @ 2.45s) vs Ceramic FastLottie (209 MiB @ 4.45s)
 *   8.09 - 12.63s : Full Ceramic White — Pixel 7a 90 Hz (1.38 ms · 0.0% jank vs C++ & Kotlin)
 *  12.63 - 18.00s : Showstopper FL -> Fastlottie calligraphy unfold finale + slogan
 */
import {
  W, H, FONT_MONO,
  clamp, lerp, norm, easeOutExpo, easeOutCubic, easeInOutCubic,
  spring, drawKineticText, drawSprite,
} from './engine.js';
import {
  K,
  drawObsidianBackdrop, drawCeramicBackdrop,
  drawStudioCard, drawStudioPill, drawStudioHud,
  drawFastLottieMorph,
} from './brand_kit.js';

function makeBlueBrandGrad(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, K.cyan);
  g.addColorStop(0.55, K.blue);
  g.addColorStop(1, K.royal);
  return g;
}

export function renderTeaserFrame(ctx, frame, sprites) {
  const t = frame / 60;

  // =========================================================================
  // 0.00s - 2.45s : MATTE OBSIDIAN KEYNOTE HOOK
  // =========================================================================
  if (t < 2.45) {
    drawObsidianBackdrop(ctx, t, {
      accent: t > 1.75 ? K.red : K.blue,
      accentAlpha: t > 1.75 ? 0.16 : 0.14,
    });

    // 24 live phoenix sprites breathing softly in an airy perimeter grid
    const gridAlpha = 0.28 * easeOutCubic(norm(t, 0.0, 0.55));
    for (let i = 0; i < 24; i++) {
      const col = i % 6;
      const row = Math.floor(i / 6);
      drawSprite(ctx, sprites, 'phoenix', 100 + col * 295, 95 + row * 245, 160, t, {
        phase: i * 0.08, alpha: gridAlpha, frameWindow: [0, 26],
      });
    }

    // Soft center vignette plate for effortless mobile legibility
    const plate = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 720);
    plate.addColorStop(0, 'rgba(8, 11, 18, 0.90)');
    plate.addColorStop(0.7, 'rgba(8, 11, 18, 0.52)');
    plate.addColorStop(1, 'rgba(8, 11, 18, 0)');
    ctx.fillStyle = plate;
    ctx.fillRect(0, 0, W, H);

    const p1 = spring(t - 0.04, { stiffness: 280, damping: 22 });
    drawKineticText(ctx, '24 stickers.  120 Hz.', W / 2, H * 0.44, {
      size: 136, weight: 760, color: K.darkText, tracking: -0.006,
      scale: lerp(1.12, 1.0, clamp(p1)), alpha: clamp(p1 * 1.4),
    });

    const p2 = spring(t - 0.38, { stiffness: 240, damping: 22 });
    drawStudioPill(ctx, W / 2, H * 0.60, 'NATIVE SWIFT  vs  FLUTTER FASTLOTTIE', {
      light: false,
      bg: 'rgba(15, 22, 36, 0.92)',
      border: t > 1.75 ? K.redBorder : 'rgba(148, 197, 255, 0.24)',
      color: t > 1.75 ? '#FDA4AF' : '#BAE6FD',
      fontSize: 22, height: 50, padX: 28,
      logoBadge: true,
    });
    if (p2 < 1) {
      // Smooth reveal fade
      ctx.save();
      ctx.fillStyle = `rgba(8, 11, 18, ${1 - clamp(p2)})`;
      ctx.fillRect(W / 2 - 400, H * 0.60 - 36, 800, 72);
      ctx.restore();
    }
    return;
  }

  // =========================================================================
  // 2.45s - 8.09s : APPLE M5 SPLIT-SCREEN (DARK NATIVE vs CERAMIC FASTLOTTIE)
  // =========================================================================
  if (t < 8.09) {
    const dt = t - 2.45;
    drawObsidianBackdrop(ctx, t, {
      accent: t >= 4.45 ? K.blue : K.red,
      accentAlpha: 0.14,
      centerX: t >= 4.45 ? 0.72 : 0.28,
    });
    drawStudioHud(ctx, 'APPLE M5 · 120 HZ · 24× STICKERS', 'RELEASE BENCHMARK', {
      light: false, accent: K.cyan, showMiniLogo: true,
    });

    // LEFT: Dark Obsidian Native Swift Meltdown Card
    const lEnter = easeOutExpo(norm(dt, 0, 0.38));
    const lx = lerp(-60, 68, lEnter);
    drawStudioCard(ctx, lx, 112, 860, 896, {
      light: false,
      fill: K.redDarkBg,
      border: K.redBorder,
      shadowColor: 'rgba(225, 29, 72, 0.22)',
      shadowBlur: 44,
    });
    drawStudioPill(ctx, lx + 430, 178, 'NATIVE SWIFT · lottie-ios 4.6.1', {
      light: false, bg: 'rgba(225,29,72,0.18)', border: K.redBorder, color: '#FDA4AF',
      fontSize: 20, dotColor: K.redBright,
    });
    drawKineticText(ctx, '0 CA / 24 MAIN-THREAD FALLBACK', lx + 430, 240, {
      size: 22, weight: 700, color: '#FB7185', font: FONT_MONO, tracking: 0.04,
    });

    const ram = lerp(180, 3271, easeOutExpo(norm(dt, 0.05, 0.95)));
    drawKineticText(ctx, ram >= 1000 ? `${(ram / 1000).toFixed(2)} GiB` : `${Math.round(ram)} MiB`, lx + 430, 428, {
      size: 162, weight: 760, color: '#FFFFFF', tracking: 0.0,
    });
    drawKineticText(ctx, 'PHYSICAL RAM', lx + 430, 536, {
      size: 24, weight: 700, color: '#FB7185', font: FONT_MONO, tracking: 0.12,
    });
    drawKineticText(ctx, '56.7% JANK  ·  72.2% CPU', lx + 430, 616, {
      size: 34, weight: 700, color: '#FECDD3', font: FONT_MONO,
    });
    for (let i = 0; i < 6; i++) {
      drawSprite(ctx, sprites, 'phoenix', lx + 44 + i * 130, 738, 120, t, {
        stutterFps: 6, phase: i * 0.12,
      });
    }

    // RIGHT: Radiant Apple Ceramic White FastLottie Card sliding smoothly in at t = 4.45s!
    if (t >= 4.45) {
      const rSpring = spring(t - 4.45, { stiffness: 260, damping: 22 });
      const rx = lerp(W + 80, 992, clamp(rSpring));
      ctx.save();
      ctx.globalAlpha = clamp(rSpring * 1.5);
      drawStudioCard(ctx, rx, 112, 860, 896, {
        light: true,
        fill: '#F9FBFF',
        border: 'rgba(18, 148, 236, 0.34)',
        shadowColor: 'rgba(18, 148, 236, 0.28)',
        shadowBlur: 52,
      });
      drawStudioPill(ctx, rx + 430, 178, 'FLUTTER + FASTLOTTIE', {
        light: true, bg: K.blueSoftBg, border: K.blueBorder, color: K.blueText,
        fontSize: 20, logoBadge: true,
      });
      drawKineticText(ctx, '1× SHARED LZ4 STRIP CACHE', rx + 430, 240, {
        size: 22, weight: 700, color: K.inkMuted, font: FONT_MONO, tracking: 0.04,
      });
      const blueGrad = makeBlueBrandGrad(ctx, -260, -70, 260, 80);
      drawKineticText(ctx, '209 MiB', rx + 430, 428, {
        size: 162, weight: 760, color: blueGrad, tracking: 0.0,
      });
      drawKineticText(ctx, '15× LESS RAM  ·  5× LOWER CPU', rx + 430, 536, {
        size: 25, weight: 700, color: K.goldText, font: FONT_MONO, tracking: 0.05,
      });
      drawKineticText(ctx, '0.0% JANK  ·  13.6% CPU', rx + 430, 616, {
        size: 36, weight: 760, color: K.ink, font: FONT_MONO,
      });
      for (let i = 0; i < 6; i++) {
        drawSprite(ctx, sprites, 'phoenix', rx + 44 + i * 130, 738, 120, t, {
          phase: i * 0.12, frameWindow: [0, 26],
        });
      }
      ctx.restore();
    }
    return;
  }

  // =========================================================================
  // 8.09s - 12.63s : FULL APPLE CERAMIC WHITE — PIXEL 7a 90 HZ PROOF
  // =========================================================================
  if (t < 12.63) {
    const dt = t - 8.09;
    const enter = easeOutCubic(norm(dt, 0, 0.35));
    drawCeramicBackdrop(ctx, t, { goldBloom: 0.04, blueBloom: 0.055 });
    drawStudioHud(ctx, 'GOOGLE PIXEL 7a · ANDROID 17 · 90 HZ', '16 UNIQUE LOTTIE STICKERS', {
      light: true, showMiniLogo: true,
    });

    // Left: Crisp frosted ceramic 4x4 live sticker showcase
    drawStudioCard(ctx, 84, 134, 624, 804, {
      light: true, fill: K.lightCardStrong, border: K.blueBorder,
    });
    for (let i = 0; i < 16; i++) {
      drawSprite(ctx, sprites, `emoji_${i}`, 130 + (i % 4) * 136, 206 + Math.floor(i / 4) * 154, 122, t, {
        phase: i * 0.18,
      });
    }
    drawStudioPill(ctx, 396, 876, '16 STICKERS · 90.0 FPS LOCKED', {
      light: true, bg: K.blueSoftBg, border: K.blueBorder, color: K.blueText,
      fontSize: 18, height: 42, dotColor: K.blue,
    });

    // Right: Monumental 1.38 ms metric + clean horizontal comparison bars
    const rx = 782;
    const p = spring(dt, { stiffness: 280, damping: 21 });
    const blueGrad = makeBlueBrandGrad(ctx, 0, -70, 520, 70);
    drawKineticText(ctx, '1.38 ms', rx, 286, {
      size: 168, weight: 760, color: blueGrad, align: 'left', tracking: 0.0,
      scale: lerp(1.08, 1.0, clamp(p)), alpha: enter,
    });
    drawKineticText(ctx, 'MEDIAN FRAME TIME  ·  0.0% JANK (PREWARM)', rx, 396, {
      size: 26, weight: 700, color: K.inkSub, align: 'left', font: FONT_MONO, alpha: enter,
    });

    drawStudioCard(ctx, rx, 464, 1054, 474, { light: true, fill: K.lightCardStrong });
    const rows = [
      ['Flutter + FastLottie', '1.38 ms', '0.0–0.7% jank', K.blue, 0.10, true],
      ['Native C++ dotlottie-android', '10.96 ms', '62.9% jank', K.gold, 0.64, false],
      ['Native Kotlin lottie-android HW', '25.60 ms', '100% jank', K.red, 1.0, false],
    ];
    rows.forEach(([name, ms, jank, col, frac, isWinner], idx) => {
      const y = 532 + idx * 136;
      const g = easeOutExpo(norm(dt, 0.15 + idx * 0.10, 0.85 + idx * 0.10));
      drawKineticText(ctx, name, rx + 40, y, {
        size: 24, weight: isWinner ? 760 : 700, color: isWinner ? K.ink : K.inkSub, align: 'left',
      });
      drawKineticText(ctx, `${ms}  ·  ${jank}`, rx + 1014, y, {
        size: 22, weight: 700, color: isWinner ? K.blueText : col === K.gold ? K.goldText : K.red,
        align: 'right', font: FONT_MONO,
      });

      // Subtle neutral track behind bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.055)';
      ctx.beginPath();
      ctx.roundRect(rx + 40, y + 28, 974, 34, 10);
      ctx.fill();

      const bw = Math.max(36, 974 * frac * g);
      if (isWinner) {
        const bg = ctx.createLinearGradient(rx + 40, y, rx + 40 + bw, y);
        bg.addColorStop(0, K.cyan);
        bg.addColorStop(1, K.royal);
        ctx.fillStyle = bg;
      } else {
        ctx.fillStyle = col;
      }
      ctx.beginPath();
      ctx.roundRect(rx + 40, y + 28, bw, 34, 10);
      ctx.fill();
    });
    return;
  }

  // =========================================================================
  // 12.63s - 18.00s : APPLE "HELLO" FINALE — FL LOGO UNFOLDS INTO FASTLOTTIE!
  // =========================================================================
  const dt = t - 12.63;
  const fadeOutEnd = t > 17.50 ? 1 - easeInOutCubic(norm(t, 17.50, 18.00)) : 1;
  drawCeramicBackdrop(ctx, t, {
    goldBloom: 0.055 * easeOutCubic(norm(dt, 0, 1.2)),
    blueBloom: 0.060 * easeOutCubic(norm(dt, 0.4, 1.8)),
  });

  // Compact FL emblem reveals center-stage, then glides apart into the complete calligraphic
  // "Fastlottie" wordmark + specular sweep!
  const unfoldP = norm(dt, 0.04, 3.65);
  const settleScale = lerp(1.02, 0.88, easeInOutCubic(norm(dt, 0.8, 3.4)));
  ctx.save();
  ctx.globalAlpha = fadeOutEnd;
  drawFastLottieMorph(ctx, {
    mode: 'unfold',
    progress: unfoldP,
    cx: W / 2,
    cy: H * 0.45,
    scale: settleScale,
  });

  // Clean breathable slogan directly beneath
  const subP = spring(dt - 2.65, { stiffness: 220, damping: 22 });
  if (subP > 0.01) {
    drawKineticText(ctx, 'Faster than native — the Lottie renderer Flutter deserves', W / 2, lerp(H * 0.72, H * 0.695, clamp(subP)), {
      size: 42, weight: 600, color: K.inkSub, tracking: 0.0,
      alpha: clamp(subP) * fadeOutEnd,
    });
  }
  ctx.restore();
}
