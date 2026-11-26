/**
 * Core 1080p 60fps Dark-Mode Motion-Graphics Engine (Flutter Blue Edition) for FastLottie.
 * Midnight obsidian canvas (#060911), official Flutter Blue (#027DFD / #54C5F8) & crimson telemetry,
 * Outfit geometric display + JetBrains Mono typography, subtle optical grain, spring physics,
 * RGB glitch splits, specular wordmark sweep, and live FastLottie-rendered sprite sheets.
 */

export const W = 1920;
export const H = 1080;
export const FPS = 60;

export const FONT_SANS = '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
export const FONT_MONO = '"JetBrains Mono", "SF Mono", Menlo, ui-monospace, monospace';

export const C = {
  bg: '#060911',
  bgCard: '#0B1220',
  bgCardBorder: 'rgba(148, 197, 255, 0.12)',
  text: '#F8FAFC',
  muted: '#94A3B8',
  dim: '#475569',
  // Official Flutter Brand Blues (Primary)
  blue: '#027DFD',
  blueBright: '#54C5F8',
  blueLight: '#E0F2FE',
  blueDeep: '#01579B',
  blueGlow: 'rgba(2, 125, 253, 0.54)',
  skyGlow: 'rgba(84, 197, 248, 0.46)',
  cyan: '#38BDF8',
  indigo: '#818CF8',
  // Contrast / Failure Accents
  red: '#EF4444',
  redBright: '#F87171',
  redGlow: 'rgba(239, 68, 68, 0.52)',
  amber: '#F59E0B',
  purple: '#818CF8',
};

export const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const norm = (t, t0, t1) => clamp((t - t0) / Math.max(1e-6, t1 - t0), 0, 1);

export const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function spring(t, { stiffness = 240, damping = 18 } = {}) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness);
  const zeta = damping / (2 * w0);
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

export function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function hexAlpha(hex, alpha) {
  if (!hex || !hex.startsWith('#')) return hex;
  const h = hex.slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function cameraShake(t, triggerT, duration = 0.45, intensity = 18) {
  const dt = t - triggerT;
  if (dt < 0 || dt > duration) return { x: 0, y: 0, rot: 0 };
  const decay = Math.pow(1 - dt / duration, 2.2);
  const step = Math.floor(t * 60);
  return {
    x: (hash(step * 1.37) * 2 - 1) * intensity * decay,
    y: (hash(step * 2.91 + 17) * 2 - 1) * intensity * decay,
    rot: (hash(step * 4.13 + 91) * 2 - 1) * 0.009 * (intensity / 18) * decay,
  };
}

// Pre-generated subtle organic film-grain tile (kills flat digital banding!)
let grainPattern = null;
function getGrainCanvas() {
  if (grainPattern) return grainPattern;
  const c = document.createElement('canvas');
  c.width = 160;
  c.height = 160;
  const g = c.getContext('2d');
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(hash(i * 0.37) * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 10; // Ultra-subtle organic 4% film grain
  }
  g.putImageData(img, 0, 0);
  grainPattern = c;
  return c;
}

export function drawFilmGrain(ctx, t) {
  const tile = getGrainCanvas();
  const pat = ctx.createPattern(tile, 'repeat');
  if (!pat) return;
  const step = Math.floor(t * 24);
  const ox = Math.floor(hash(step * 3.1) * 160);
  const oy = Math.floor(hash(step * 7.3) * 160);
  ctx.save();
  ctx.translate(-ox, -oy);
  ctx.fillStyle = pat;
  ctx.fillRect(ox, oy, W + 160, H + 160);
  ctx.restore();
}

// Deep obsidian studio backdrop + crisp architectural hairlines + subtle 3D horizon grid
export function drawBackdrop(ctx, t, {
  accent = C.blue,
  accentAlpha = 0.16,
  gridSpeed = 1.0,
  gridY = 0.66,
  tilt = 1.0,
  reticles = true,
} = {}) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Ambient studio key light
  const g1 = ctx.createRadialGradient(W * 0.5, H * 0.38, 40, W * 0.5, H * 0.42, W * 0.62);
  g1.addColorStop(0, hexAlpha(accent, accentAlpha));
  g1.addColorStop(0.55, hexAlpha(accent, accentAlpha * 0.24));
  g1.addColorStop(1, 'rgba(6,9,17,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Perspective precision floor grid
  if (gridSpeed > 0) {
    ctx.save();
    const horizon = H * gridY;
    ctx.beginPath();
    ctx.rect(0, horizon, W, H - horizon);
    ctx.clip();

    ctx.strokeStyle = hexAlpha(accent, 0.14);
    ctx.lineWidth = 1.15;
    const cols = 18;
    for (let i = -cols; i <= cols; i++) {
      const bx = W * 0.5 + i * 195 * tilt;
      const tx = W * 0.5 + i * 24 * tilt;
      ctx.beginPath();
      ctx.moveTo(tx, horizon);
      ctx.lineTo(bx, H + 40);
      ctx.stroke();
    }
    const rows = 14;
    const scroll = (t * gridSpeed * 1.4) % 1;
    for (let r = 0; r < rows; r++) {
      const u = (r + scroll) / rows;
      const y = horizon + Math.pow(u, 2.15) * (H - horizon + 20);
      ctx.strokeStyle = hexAlpha(accent, 0.04 + u * 0.16);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    const fade = ctx.createLinearGradient(0, horizon, 0, horizon + 130);
    fade.addColorStop(0, C.bg);
    fade.addColorStop(1, 'rgba(6,9,17,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, horizon, W, 135);
    ctx.restore();
  }

  // Subtle corner technical registration reticles (+) for bespoke studio craft
  if (reticles) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.25;
    for (const [px, py] of [[44, 34], [W - 44, 34], [44, H - 34], [W - 44, H - 34]]) {
      ctx.beginPath();
      ctx.moveTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px, py + 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Crisp subtle vignette
  const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.34, W * 0.5, H * 0.5, W * 0.68);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.56)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// Sleek dark architectural surface with subtle top-edge specular hairline highlight
export function drawCard(ctx, x, y, w, h, {
  radius = 18,
  fill = 'rgba(14, 16, 22, 0.90)',
  border = 'rgba(255,255,255,0.11)',
  glow = null,
  glowBlur = 32,
  lineWidth = 1.5,
  topSheen = true,
} = {}) {
  ctx.save();
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = glowBlur;
  }
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = border;
  ctx.stroke();

  // Crisp subtle top specular edge highlight (Linear / Apple hardware feel)
  if (topSheen && w > 120 && h > 60) {
    const sheen = ctx.createLinearGradient(x + radius, y, x + w - radius, y);
    sheen.addColorStop(0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.22)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = sheen;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + radius, y + 1);
    ctx.lineTo(x + w - radius, y + 1);
    ctx.stroke();
  }
  ctx.restore();
}

// Pill badge
export function drawPill(ctx, cx, cy, text, {
  bg = 'rgba(2,125,253,0.16)',
  border = 'rgba(84,197,248,0.52)',
  color = C.blueBright,
  fontSize = 20,
  mono = true,
  padX = 22,
  height = 44,
  dotColor = null,
} = {}) {
  ctx.save();
  ctx.font = `700 ${fontSize}px ${mono ? FONT_MONO : FONT_SANS}`;
  const tw = ctx.measureText(text).width;
  const dotExtra = dotColor ? 22 : 0;
  const w = tw + padX * 2 + dotExtra;
  const x = cx - w / 2;
  const y = cy - height / 2;
  drawCard(ctx, x, y, w, height, { radius: height / 2, fill: bg, border, lineWidth: 1.5, topSheen: false });
  if (dotColor) {
    ctx.fillStyle = dotColor;
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x + padX + 5, cy, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX + dotExtra, cy + 1);
  ctx.restore();
}

// Ultra-crisp kinetic text with chromatic RGB split + optional specular sheen sweep!
export function drawKineticText(ctx, text, x, y, {
  size = 96,
  weight = 800,
  color = C.text,
  align = 'center',
  font = FONT_SANS,
  tracking = -0.03,
  glow = null,
  glowBlur = 28,
  glitchPx = 0,
  alpha = 1,
  scale = 1,
  sheenPos = null, // 0..1 sweeps a bright specular highlight across the wordmark!
} = {}) {
  if (alpha <= 0.005) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.translate(x, y);
  if (scale !== 1) ctx.scale(scale, scale);
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${(size * tracking).toFixed(1)}px`;
  }

  if (glitchPx > 0.5) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255, 45, 85, 0.85)';
    ctx.fillText(text, -glitchPx, -glitchPx * 0.25);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.fillText(text, glitchPx, glitchPx * 0.25);
    ctx.globalCompositeOperation = 'source-over';
  }

  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = glowBlur;
  }
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);

  if (sheenPos !== null && sheenPos >= -0.2 && sheenPos <= 1.2) {
    ctx.shadowBlur = 0;
    const tw = ctx.measureText(text).width;
    const left = align === 'center' ? -tw / 2 : align === 'right' ? -tw : 0;
    const sx = left + sheenPos * tw;
    const sg = ctx.createLinearGradient(sx - 150, -size * 0.4, sx + 150, size * 0.4);
    sg.addColorStop(0, 'rgba(255,255,255,0)');
    sg.addColorStop(0.5, 'rgba(255,255,255,0.75)');
    sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg;
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
}

export function drawGlitchOverlay(ctx, t, intensity = 0.5) {
  if (intensity <= 0.01) return;
  ctx.save();
  const step = Math.floor(t * 60);
  const count = Math.floor(8 * intensity);
  for (let i = 0; i < count; i++) {
    const h = 3 + hash(step * 11 + i * 3.1) * 24 * intensity;
    const y = hash(step * 7 + i * 9.7) * H;
    const x = (hash(step * 19 + i * 5.3) - 0.5) * 240 * intensity;
    ctx.fillStyle = i % 2 === 0
      ? `rgba(239,68,68,${0.18 * intensity})`
      : `rgba(56,189,248,${0.14 * intensity})`;
    ctx.fillRect(Math.max(0, x), y, W, h);
  }
  ctx.restore();
}

export function drawSprite(ctx, sprites, name, x, y, size, timeSec, {
  speed = 1.0,
  phase = 0,
  stutterFps = 0,
  alpha = 1,
  rotation = 0,
  glow = null,
  frameWindow = null,
} = {}) {
  const sp = sprites[name];
  if (!sp || !sp.img || alpha <= 0.005) return;
  let effectiveT = timeSec * speed + phase;
  if (stutterFps > 0) {
    const q = Math.floor(effectiveT * stutterFps);
    const hiccup = (q % 5 === 3) ? q - 1 : q;
    effectiveT = hiccup / stutterFps;
  }
  let fIdx;
  if (frameWindow) {
    const [f0, f1] = frameWindow;
    const span = Math.max(1, f1 - f0);
    const pos = ((effectiveT * 18) % (span * 2) + span * 2) % (span * 2);
    fIdx = f0 + Math.round(pos <= span ? pos : span * 2 - pos);
  } else {
    const cycleSec = sp.frames >= 50 ? 2.8 : 1.5;
    fIdx = ((Math.floor((effectiveT / cycleSec) * sp.frames) % sp.frames) + sp.frames) % sp.frames;
  }
  const col = fIdx % sp.cols;
  const row = Math.floor(fIdx / sp.cols);

  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.translate(x + size / 2, y + size / 2);
  if (rotation) ctx.rotate(rotation);
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = 24;
  }
  ctx.drawImage(sp.img, col * sp.frameSize, row * sp.frameSize, sp.frameSize, sp.frameSize, -size / 2, -size / 2, size, size);
  ctx.restore();
}

export async function loadSprites() {
  const res = await fetch('/public/sprites/manifest.json');
  const manifest = await res.json();
  const out = {};
  await Promise.all(
    Object.entries(manifest).map(
      ([name, meta]) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            out[name] = { ...meta, img };
            resolve();
          };
          img.onerror = reject;
          img.src = meta.src;
        })
    )
  );
  return out;
}

export function drawShockwave(ctx, cx, cy, progress, { color = C.blue, maxR = 1100, width = 18 } = {}) {
  if (progress <= 0 || progress >= 1) return;
  const p = easeOutExpo(progress);
  const r = 30 + p * maxR;
  const alpha = Math.pow(1 - progress, 1.8);
  ctx.save();
  ctx.strokeStyle = hexAlpha(color, alpha * 0.85);
  ctx.lineWidth = Math.max(1, width * (1 - p));
  ctx.shadowColor = color;
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawFlash(ctx, t, triggerT, { dur = 0.24, color = '#FFFFFF', peak = 0.55 } = {}) {
  const dt = t - triggerT;
  if (dt < 0 || dt > dur) return;
  const a = peak * Math.pow(1 - dt / dur, 2.2);
  ctx.save();
  ctx.fillStyle = hexAlpha(color, a);
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

export function drawTopHud(ctx, leftLabel, rightLabel, accent = C.blueBright, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `600 17px ${FONT_MONO}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(76, 52, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.textAlign = 'left';
  ctx.fillText(leftLabel, 92, 53);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.48)';
  ctx.fillText(rightLabel, W - 76, 53);
  // Subtle full-width 1px HUD hairline
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(72, 74, W - 144, 1);
  ctx.restore();
}
