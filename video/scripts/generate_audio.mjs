#!/usr/bin/env node
/**
 * Zero-dependency 48 kHz stereo procedural DSP synthesizer (V2 Studio Punch)
 * for the FastLottie dark high-impact launch trailers.
 * Generates:
 *   - public/audio/soundtrack_55s.wav (Full 55s Hero Launch Trailer, 132 BPM, frame-locked SFX)
 *   - public/audio/soundtrack_15s.wav (15s X/Twitter Autoplay Cut)
 */
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const BPM = 132;
const BEAT = 60 / BPM; // 0.454545s

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const softClip = (x) => Math.tanh(x * 1.15);

let seed = 0x1337beef;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
}

function createStereoBuffer(durationSec) {
  const n = Math.ceil(durationSec * SR);
  return { n, L: new Float32Array(n), R: new Float32Array(n) };
}

function addSample(buf, idx, l, r = l) {
  if (idx >= 0 && idx < buf.n) {
    buf.L[idx] += l;
    buf.R[idx] += r;
  }
}

function addKick(buf, t0, amp = 0.86, dur = 0.34, fStart = 158, fEnd = 41) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 28);
    phase += (2 * Math.PI * freq) / SR;
    const env = Math.exp(-t * 9.5) * Math.min(1, t / 0.0025);
    const click = Math.exp(-t * 170) * 0.36 * Math.sin(2 * Math.PI * 1900 * t);
    const s = (Math.sin(phase) + click) * env * amp;
    addSample(buf, start + i, s, s);
  }
}

function addSubBoom(buf, t0, amp = 1.0, dur = 1.45, fStart = 115, fEnd = 34) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 8.0);
    phase += (2 * Math.PI * freq) / SR;
    const env = Math.exp(-t * 2.4) * Math.min(1, t / 0.004);
    const grit = Math.tanh(Math.sin(phase) * 2.2) * 0.75 + Math.sin(phase * 0.5) * 0.35;
    const transient = rand() * Math.exp(-t * 36) * 0.28;
    const s = (grit + transient) * env * amp;
    addSample(buf, start + i, s, s);
  }
}

function addSnare(buf, t0, amp = 0.45, dur = 0.16, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const n = rand();
    lp += 0.32 * (n - lp);
    const hp = n - lp;
    const body = Math.sin(2 * Math.PI * (215 - 95 * Math.min(1, t * 14)) * t) * Math.exp(-t * 28);
    const env = Math.exp(-t * 20) * Math.min(1, t / 0.0015);
    const s = (hp * 0.85 + body * 0.55) * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

function addHat(buf, t0, amp = 0.18, dur = 0.045, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const n = rand();
    const hp = n - prev;
    prev = n * 0.85;
    const metal =
      Math.sin(2 * Math.PI * 5240 * t) * 0.18 +
      Math.sin(2 * Math.PI * 7810 * t) * 0.15;
    const env = Math.exp(-t * 68);
    const s = (hp * 0.7 + metal) * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

function addRiser(buf, t0, dur = 1.0, amp = 0.44, f0 = 140, f1 = 1700) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const freq = f0 * Math.pow(f1 / f0, u * u);
    phase += (2 * Math.PI * freq) / SR;
    const saw = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
    const n = rand();
    lp += (0.04 + 0.55 * u * u) * (n - lp);
    const env = Math.pow(u, 1.8) * (1 - Math.max(0, (u - 0.96) / 0.04));
    const s = (saw * 0.45 + (n - lp) * 0.55) * env * amp;
    const spread = Math.sin(u * Math.PI * 8) * 0.25;
    addSample(buf, start + i, s * (1 - spread), s * (1 + spread));
  }
}

function addWhoosh(buf, t0, dur = 0.26, amp = 0.34, panDir = 1) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const n = rand();
    const cut = 0.03 + 0.35 * Math.sin(u * Math.PI);
    lp += cut * (n - lp);
    const env = Math.sin(u * Math.PI) * Math.sin(u * Math.PI);
    const pan = (u * 2 - 1) * 0.7 * panDir;
    const gL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gR = Math.sin(((pan + 1) * Math.PI) / 4);
    addSample(buf, start + i, lp * env * amp * gL, lp * env * amp * gR);
  }
}

function addGlitch(buf, t0, dur = 0.14, amp = 0.42, baseHz = 320) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const u = i / len;
    const step = Math.floor(u * 9);
    const freq = baseHz * (1 + ((step * 37) % 7) * 0.33);
    const sq = Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
    const fm = Math.sin(2 * Math.PI * freq * 1.5 * t + 3.5 * Math.sin(2 * Math.PI * 85 * t));
    const env = Math.exp(-u * 3.5) * (step % 2 === 0 ? 1 : 0.45);
    const s = (sq * 0.35 + fm * 0.45 + rand() * 0.25) * env * amp;
    addSample(buf, start + i, s * (step % 2 ? 1.1 : 0.7), s * (step % 2 ? 0.7 : 1.1));
  }
}

function addTick(buf, t0, pitchHz = 1400, amp = 0.28) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.024 * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const s = (Math.sin(2 * Math.PI * pitchHz * t) * 0.7 + rand() * 0.3) * Math.exp(-t * 170) * amp;
    addSample(buf, start + i, s, s);
  }
}

function addGlassShatter(buf, t0, amp = 0.8) {
  addSubBoom(buf, t0, 0.98, 0.85, 135, 32);
  for (let k = 0; k < 28; k++) {
    const delay = (k < 6 ? k * 0.004 : 0.02 + Math.pow(k / 28, 1.7) * 0.38);
    const shardStart = Math.floor((t0 + delay) * SR);
    const freq = 2200 + ((k * 7919) % 6400);
    const pan = ((k % 2 === 0 ? 1 : -1) * (0.25 + ((k * 17) % 70) / 100));
    const gL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gR = Math.sin(((pan + 1) * Math.PI) / 4);
    const dur = 0.06 + (k % 5) * 0.04;
    const len = Math.floor(dur * SR);
    for (let i = 0; i < len; i++) {
      const t = i / SR;
      const s =
        (Math.sin(2 * Math.PI * freq * t) * 0.6 +
          Math.sin(2 * Math.PI * freq * 1.47 * t) * 0.3 +
          rand() * 0.35) *
        Math.exp(-t * (22 + (k % 4) * 8)) *
        (amp * 0.14);
      addSample(buf, shardStart + i, s * gL, s * gR);
    }
  }
}

function addBassNote(buf, t0, dur, freq, amp = 0.34, sidechainPeriod = BEAT) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let p1 = 0, p2 = 0, lpL = 0, lpR = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * freq) / SR;
    p2 += (2 * Math.PI * freq * 1.006) / SR;
    const saw1 = 2 * ((p1 / (2 * Math.PI)) % 1) - 1;
    const saw2 = 2 * ((p2 / (2 * Math.PI)) % 1) - 1;
    const sub = Math.sin(p1 * 0.5) * 0.5;
    const cut = 0.07 + 0.14 * Math.exp(-t * 5.0);
    lpL += cut * ((saw1 * 0.6 + saw2 * 0.4 + sub) - lpL);
    lpR += cut * ((saw2 * 0.6 + saw1 * 0.4 + sub) - lpR);
    const scPhase = (t % sidechainPeriod) / sidechainPeriod;
    const sc = sidechainPeriod > 0 ? Math.min(1, 0.15 + scPhase * 2.8) : 1;
    const env = Math.min(1, t / 0.008) * Math.min(1, (dur - t) / 0.025);
    addSample(buf, start + i, lpL * env * sc * amp, lpR * env * sc * amp);
  }
}

function addPad(buf, t0, dur, freqs, amp = 0.14) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.45) * Math.min(1, (dur - t) / 0.75);
    let sL = 0, sR = 0;
    for (let fIdx = 0; fIdx < freqs.length; fIdx++) {
      const f = freqs[fIdx];
      const v1 = Math.sin(2 * Math.PI * (f * 0.997) * t + fIdx);
      const v2 = Math.sin(2 * Math.PI * (f * 1.003) * t + fIdx * 2);
      const v3 = Math.sin(2 * Math.PI * f * 2 * t) * 0.2;
      sL += (v1 * 0.7 + v2 * 0.3 + v3);
      sR += (v2 * 0.7 + v1 * 0.3 + v3);
    }
    const norm = (amp / freqs.length) * env;
    addSample(buf, start + i, sL * norm, sR * norm);
  }
}

function addArpNote(buf, t0, freq, amp = 0.15, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.18 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    phase += (2 * Math.PI * freq) / SR;
    const wave = Math.sin(phase) * 0.65 + Math.sin(phase * 2) * 0.25 + Math.sin(phase * 3) * 0.1;
    const env = Math.exp(-t * 16) * Math.min(1, t / 0.002);
    const s = wave * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

function addChime(buf, t0, freq = 880, amp = 0.22) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.32 * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const s =
      (Math.sin(2 * Math.PI * freq * t) * 0.65 +
        Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.35) *
      Math.exp(-t * 12) *
      Math.min(1, t / 0.002) *
      amp;
    addSample(buf, start + i, s, s);
  }
}

function writeWav(filePath, buf) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const numChannels = 2;
  const bitsPerSample = 16;
  const byteRate = SR * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = buf.n * blockAlign;
  const out = Buffer.alloc(44 + dataSize);

  out.write('RIFF', 0);
  out.writeUInt32LE(36 + dataSize, 4);
  out.write('WAVE', 8);
  out.write('fmt ', 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(numChannels, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(byteRate, 28);
  out.writeUInt16LE(blockAlign, 32);
  out.writeUInt16LE(bitsPerSample, 34);
  out.write('data', 36);
  out.writeUInt32LE(dataSize, 40);

  let off = 44;
  for (let i = 0; i < buf.n; i++) {
    const l = Math.round(clamp(softClip(buf.L[i] * 0.88), -1, 1) * 32767);
    const r = Math.round(clamp(softClip(buf.R[i] * 0.88), -1, 1) * 32767);
    out.writeInt16LE(l, off);
    out.writeInt16LE(r, off + 2);
    off += 4;
  }
  fs.writeFileSync(filePath, out);
  console.log(`Wrote ${filePath} (${(out.length / 1024 / 1024).toFixed(2)} MiB, ${(buf.n / SR).toFixed(2)}s)`);
}

function buildFull55s() {
  const buf = createStereoBuffer(55.0);

  // S1: 0.00 - 5.20s — Dark analog drone + heartbeat slams + riser
  addPad(buf, 0.0, 5.1, [73.42, 110.0, 146.83], 0.14);
  addSubBoom(buf, 0.25, 0.8, 0.7, 95, 38);
  addSubBoom(buf, 1.55, 0.85, 0.8, 100, 36);
  addGlitch(buf, 3.25, 0.18, 0.45, 290);
  addSubBoom(buf, 3.45, 0.9, 0.75, 115, 40);
  addRiser(buf, 4.15, 1.05, 0.52, 150, 1900);

  // S2: 5.20 - 15.20s — Native Meltdown + 3.27 GiB glass shatter + dead silence
  addPad(buf, 5.2, 8.8, [73.42, 77.78, 110.0], 0.11);
  addGlitch(buf, 5.2, 0.16, 0.5, 410);
  addKick(buf, 5.2, 0.75);
  for (let t = 5.2; t < 8.1; t += BEAT * 0.5) addHat(buf, t, 0.15, 0.035, -0.3);
  addGlitch(buf, 6.45, 0.12, 0.35, 520);

  addWhoosh(buf, 8.05, 0.22, 0.36, 1);
  addGlitch(buf, 8.2, 0.18, 0.5, 350);
  addKick(buf, 8.2, 0.8);
  for (let t = 8.2; t < 10.9; t += BEAT * 0.5) addHat(buf, t, 0.17, 0.035, 0.3);

  addWhoosh(buf, 10.85, 0.22, 0.38, -1);
  addGlitch(buf, 11.0, 0.2, 0.52, 480);
  addGlitch(buf, 11.65, 0.22, 0.55, 640);
  let tickT = 11.95, step = 0.14, pitch = 900;
  while (tickT < 13.52) {
    addTick(buf, tickT, pitch, 0.3);
    tickT += step;
    step = Math.max(0.032, step * 0.84);
    pitch = Math.min(3400, pitch * 1.07);
  }
  addRiser(buf, 12.4, 1.18, 0.45, 220, 2200);
  addGlassShatter(buf, 13.6, 0.88);
  const silStart = Math.floor(14.58 * SR);
  const silEnd = Math.floor(15.19 * SR);
  for (let i = silStart; i < silEnd; i++) {
    const fade = i < silStart + 600 ? 1 - (i - silStart) / 600 : 0;
    buf.L[i] *= fade;
    buf.R[i] *= fade;
  }

  // S3 - S6: 15.20 - 41.60s — FULL 132 BPM DARK ELECTRONIC DROP!
  const dropT = 15.2, grooveEnd = 41.55;
  addSubBoom(buf, dropT, 1.0, 1.4, 140, 36);
  const bassSeq = [73.42, 73.42, 87.31, 65.41, 73.42, 73.42, 58.27, 65.41];
  const barDur = BEAT * 4;
  let barIdx = 0;
  for (let bt = dropT; bt < grooveEnd; bt += barDur) {
    const f = bassSeq[barIdx % bassSeq.length];
    const dur = Math.min(barDur, grooveEnd - bt);
    addBassNote(buf, bt, dur, f, 0.36, BEAT);
    if (barIdx % 2 === 0) {
      const chord = barIdx % 4 === 0 ? [146.83, 220.0, 261.63, 329.63] : [116.54, 174.61, 220.0, 261.63];
      addPad(buf, bt, Math.min(barDur * 2, grooveEnd - bt), chord, 0.13);
    }
    barIdx++;
  }

  let beatNum = 0;
  for (let t = dropT; t < grooveEnd; t += BEAT) {
    addKick(buf, t, 0.84, 0.32);
    if (beatNum % 2 === 1) addSnare(buf, t, 0.42, 0.15, beatNum % 4 === 1 ? -0.1 : 0.1);
    for (let sub = 0; sub < 4; sub++) {
      const ht = t + (sub * BEAT) / 4;
      if (ht < grooveEnd) addHat(buf, ht, sub === 2 ? 0.24 : sub === 0 ? 0.1 : 0.14, sub === 2 ? 0.065 : 0.038, sub % 2 === 0 ? -0.35 : 0.35);
    }
    if (t >= 26.55) {
      const arpNotes = [293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63, 293.66];
      for (let sub = 0; sub < 4; sub++) {
        const at = t + (sub * BEAT) / 4;
        if (at < grooveEnd) addArpNote(buf, at, arpNotes[(beatNum * 4 + sub) % arpNotes.length], 0.13, ((sub % 2) * 2 - 1) * 0.45);
      }
    }
    beatNum++;
  }

  addWhoosh(buf, 21.05, 0.25, 0.4, 1);
  addChime(buf, 22.15, 1174.66, 0.26);
  addChime(buf, 22.28, 1760.0, 0.22);
  addWhoosh(buf, 26.45, 0.26, 0.42, -1);
  addSubBoom(buf, 26.6, 0.72, 0.9, 130, 38);
  for (const [ct, dir, chimeHz] of [[34.4, 1, 880], [36.8, -1, 1046.5], [39.2, 1, 1174.66]]) {
    addWhoosh(buf, ct - 0.16, 0.22, 0.42, dir);
    addSubBoom(buf, ct, 0.65, 0.55, 120, 42);
    addChime(buf, ct + 0.08, chimeHz, 0.22);
  }

  // S7: 41.60 - 49.00s — Honesty Mic-Drop + Snare Roll + BOOM
  addWhoosh(buf, 41.45, 0.25, 0.35, -1);
  addPad(buf, 41.6, 5.7, [73.42, 110.0, 146.83], 0.11);
  addKick(buf, 41.6, 0.55, 0.28, 110, 42);
  addKick(buf, 42.5, 0.5, 0.28, 110, 42);
  addTick(buf, 43.6, 1100, 0.38);
  addKick(buf, 43.6, 0.65, 0.22, 120, 44);
  addRiser(buf, 45.2, 2.15, 0.62, 160, 2400);
  for (let i = 0; i < 16; i++) {
    const t = 45.3 + i * 0.125;
    if (t < 47.32) addSnare(buf, t, 0.2 + (i / 16) * 0.45, 0.11, ((i % 2) * 2 - 1) * 0.25);
  }
  for (let i = 0; i < 8; i++) {
    const t = 46.85 + i * 0.06;
    if (t < 47.34) addSnare(buf, t, 0.5 + (i / 8) * 0.25, 0.08, 0);
  }
  addSubBoom(buf, 47.4, 1.05, 1.8, 165, 32);
  addChime(buf, 47.42, 587.33, 0.25);
  addChime(buf, 47.42, 880.0, 0.22);

  // S8: 49.00 - 55.00s — Resonant Outro + crisp typing clicks
  addWhoosh(buf, 48.88, 0.22, 0.3, 1);
  addPad(buf, 49.0, 5.9, [146.83, 220.0, 293.66, 349.23, 440.0], 0.18);
  addKick(buf, 49.0, 0.65, 0.35);
  for (let i = 0; i < 12; i++) addTick(buf, 49.35 + i * 0.11, 2100 + (i % 3) * 280, 0.12);
  addChime(buf, 51.1, 1479.98, 0.18);
  addSubBoom(buf, 52.2, 0.55, 2.2, 95, 36);
  return buf;
}

function buildTeaser15s() {
  const buf = createStereoBuffer(15.0);
  addSubBoom(buf, 0.05, 0.9, 0.85, 140, 38);
  addRiser(buf, 1.8, 1.15, 0.5, 180, 2000);
  addGlassShatter(buf, 3.0, 0.78);
  const dropT = 4.6;
  addSubBoom(buf, dropT, 1.0, 1.2, 150, 36);
  addPad(buf, dropT, 10.2, [146.83, 220.0, 261.63, 329.63], 0.16);
  let b = 0;
  for (let t = dropT; t < 12.0; t += BEAT) {
    addKick(buf, t, 0.84, 0.3);
    if (b % 2 === 1) addSnare(buf, t, 0.42);
    for (let s = 0; s < 4; s++) {
      const ht = t + (s * BEAT) / 4;
      if (ht < 12.0) addHat(buf, ht, s === 2 ? 0.22 : 0.12);
    }
    b++;
  }
  addBassNote(buf, dropT, 3.6, 73.42, 0.36, BEAT);
  addBassNote(buf, dropT + 3.6, 3.8, 87.31, 0.36, BEAT);
  addWhoosh(buf, 7.85, 0.24, 0.4, 1);
  addChime(buf, 8.0, 1174.66, 0.24);
  addSubBoom(buf, 12.0, 0.95, 2.6, 145, 34);
  addChime(buf, 12.05, 880, 0.24);
  addChime(buf, 12.2, 1174.66, 0.2);
  return buf;
}

const outDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/audio');
writeWav(path.join(outDir, 'soundtrack_55s.wav'), buildFull55s());
writeWav(path.join(outDir, 'soundtrack_15s.wav'), buildTeaser15s());
