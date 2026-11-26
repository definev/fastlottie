#!/usr/bin/env node
/**
 * Zero-dependency 48 kHz stereo procedural DSP synthesizer (Keynote × 132 BPM Edition)
 * for FastLottie's Dark-to-Light launch trailers.
 *
 * Features:
 *   - Tight 132 BPM launch-trailer electronic drive for benchmark & architecture sections
 *   - Grid-locked rhythmic turnarounds, pickups, and harmonic bridges (Dm <-> Gsus4 <-> Cmaj9 <-> A7sus4)
 *   - Luminous reverse glass swells, warm Keynote sub-blooms, and harp glisses on every dark->light reveal
 *   - Dedicated stereo early-reflection studio bus for Apple glass chimes & calligraphy silk sweeps
 *
 * Generates:
 *   - public/audio/soundtrack_55s.wav (Full 55s Hero Launch Film)
 *   - public/audio/soundtrack_15s.wav (15s X/Twitter Autoplay Cut)
 */
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000;
const BPM = 132;
const BEAT = 60 / BPM; // 0.45454545s

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const softClip = (x) => Math.tanh(x * 1.08);

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

function addKick(buf, t0, amp = 0.82, dur = 0.34, fStart = 152, fEnd = 42) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 28);
    phase += (2 * Math.PI * freq) / SR;
    const env = Math.exp(-t * 9.5) * Math.min(1, t / 0.0025);
    const click = Math.exp(-t * 175) * 0.30 * Math.sin(2 * Math.PI * 1850 * t);
    const s = (Math.sin(phase) + click) * env * amp;
    addSample(buf, start + i, s, s);
  }
}

// Soft low-pass heartbeat kick for smooth tempo transitions (zero harsh club click)
function addMutedPulseKick(buf, t0, amp = 0.46, dur = 0.28, fStart = 104, fEnd = 46) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 22);
    phase += (2 * Math.PI * freq) / SR;
    const atk = t < 0.009 ? 0.5 - 0.5 * Math.cos((Math.PI * t) / 0.009) : 1;
    const env = Math.exp(-t * 9.8) * atk;
    const body = Math.sin(phase) * 0.85 + Math.sin(phase * 2) * 0.10 * Math.exp(-t * 28);
    const s = body * env * amp;
    addSample(buf, start + i, s, s);
  }
}

// Velvety Keynote downbeat bloom when Ceramic Light breaks out of Obsidian darkness
function addWarmSubBloom(buf, t0, freq = 65.41, dur = 1.75, amp = 0.62) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const glide = 1 + 0.14 * Math.exp(-t * 14);
    p1 += (2 * Math.PI * freq * glide) / SR;
    p2 += (2 * Math.PI * freq * 2.0 * glide) / SR;
    const atk = t < 0.018 ? 0.5 - 0.5 * Math.cos((Math.PI * t) / 0.018) : 1;
    const tail = Math.min(1, (dur - t) / 0.25);
    const env = Math.exp(-t * 1.95) * atk * tail;
    const body = Math.tanh((Math.sin(p1) * 0.78 + Math.sin(p2) * 0.28) * 1.15);
    const s = body * env * amp;
    addSample(buf, start + i, s, s);
  }
}

function addSubBoom(buf, t0, amp = 0.92, dur = 1.4, fStart = 112, fEnd = 36) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 8.2);
    phase += (2 * Math.PI * freq) / SR;
    const env = Math.exp(-t * 2.5) * Math.min(1, t / 0.004);
    const body = Math.tanh(Math.sin(phase) * 1.8) * 0.78 + Math.sin(phase * 0.5) * 0.32;
    const s = body * env * amp;
    addSample(buf, start + i, s, s);
  }
}

function addSnare(buf, t0, amp = 0.40, dur = 0.15, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const n = rand();
    lp += 0.34 * (n - lp);
    const hp = n - lp;
    const body = Math.sin(2 * Math.PI * (215 - 90 * Math.min(1, t * 14)) * t) * Math.exp(-t * 28);
    const env = Math.exp(-t * 21) * Math.min(1, t / 0.0015);
    const s = (hp * 0.80 + body * 0.55) * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

// Tight studio percussion tom for rhythmic turnaround fills
function addPercTom(buf, t0, fStart = 195, fEnd = 96, amp = 0.38, pan = 0) {
  const start = Math.floor(t0 * SR);
  const dur = 0.22;
  const len = Math.floor(dur * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const freq = fEnd + (fStart - fEnd) * Math.exp(-t * 24);
    phase += (2 * Math.PI * freq) / SR;
    const atk = Math.min(1, t / 0.0025);
    const env = Math.exp(-t * 14.5) * atk;
    const tap = Math.sin(2 * Math.PI * 1150 * t) * Math.exp(-t * 110) * 0.22;
    const s = (Math.sin(phase) * 0.86 + Math.sin(phase * 2) * 0.14 + tap) * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

// Crisp glass-wood rim accent for Keynote rhythmic pickups
function addRimPerc(buf, t0, amp = 0.24, pitchHz = 960, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.065 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const atk = Math.min(1, t / 0.0012);
    const body =
      Math.sin(2 * Math.PI * pitchHz * t) * 0.56 +
      Math.sin(2 * Math.PI * (pitchHz * 2.13) * t) * 0.28 +
      rand() * 0.18 * Math.exp(-t * 140);
    const env = Math.exp(-t * 68) * atk;
    const s = body * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

function addHat(buf, t0, amp = 0.16, dur = 0.042, pan = 0) {
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
    const metal = Math.sin(2 * Math.PI * 5240 * t) * 0.15 + Math.sin(2 * Math.PI * 7810 * t) * 0.12;
    const env = Math.exp(-t * 70);
    const s = (hp * 0.72 + metal) * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

function addRiser(buf, t0, dur = 1.0, amp = 0.38, f0 = 150, f1 = 1650) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const freq = f0 * Math.pow(f1 / f0, u * u);
    phase += (2 * Math.PI * freq) / SR;
    const wave = Math.sin(phase) * 0.65 + Math.sin(phase * 2) * 0.25;
    const n = rand();
    lp += (0.04 + 0.50 * u * u) * (n - lp);
    const env = Math.pow(u, 1.8) * (1 - Math.max(0, (u - 0.96) / 0.04));
    const s = (wave * 0.50 + (n - lp) * 0.50) * env * amp;
    const spread = Math.sin(u * Math.PI * 6) * 0.22;
    addSample(buf, start + i, s * (1 - spread), s * (1 + spread));
  }
}

// Luminous reverse glass-harp & air swell that inhales magnetically right up to tEnd!
function addReverseGlassSwell(buf, tEnd, dur = 0.56, freqs = [196.0, 293.66, 392.0, 493.88, 783.99], amp = 0.34) {
  const start = Math.floor((tEnd - dur) * SR);
  const len = Math.floor(dur * SR);
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < len; i++) {
    const u = i / Math.max(1, len);
    const t = i / SR;
    // Smooth musical inhale + crisp 8ms anti-click release right at tEnd
    const rel = u > 0.982 ? Math.max(0, (1 - u) / 0.018) : 1;
    const env = Math.pow(u, 1.75) * rel;
    let toneL = 0;
    let toneR = 0;
    for (let k = 0; k < freqs.length; k++) {
      const f = freqs[k] * (1 + 0.008 * u);
      const v1 = Math.sin(2 * Math.PI * (f * 0.9985) * t + k * 0.9);
      const v2 = Math.sin(2 * Math.PI * (f * 1.0015) * t + k * 1.7);
      const sh = Math.sin(2 * Math.PI * (f * 2.0) * t) * 0.24 * u;
      toneL += (v1 * 0.68 + v2 * 0.32 + sh);
      toneR += (v2 * 0.68 + v1 * 0.32 + sh);
    }
    toneL /= freqs.length;
    toneR /= freqs.length;
    // Opening silky air filter
    const cut = 0.03 + 0.30 * u * u;
    const nL = rand();
    const nR = rand();
    lpL += cut * (nL - lpL);
    lpR += cut * (nR - lpR);
    const airL = (nL - lpL) * 0.26;
    const airR = (nR - lpR) * 0.26;
    const sL = (toneL * 0.85 + airL) * env * amp;
    const sR = (toneR * 0.85 + airR) * env * amp;
    addSample(buf, start + i, sL, sR);
  }
}

// Rising tonal synth-chord bridge swell into a major drop
function addTonalBridgeSwell(buf, t0, dur, fBase, freqs, amp = 0.24) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let pSub = 0;
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < len; i++) {
    const u = i / Math.max(1, len);
    const t = i / SR;
    const rel = u > 0.96 ? Math.max(0, (1 - u) / 0.04) : 1;
    const env = Math.pow(u, 1.35) * rel;
    // Rising filtered saw pedal on dominant root
    pSub += (2 * Math.PI * fBase) / SR;
    const saw = 2 * ((pSub / (2 * Math.PI)) % 1) - 1;
    const sub = Math.sin(pSub) * 0.65 + saw * (0.25 + 0.45 * u);
    let chordL = 0;
    let chordR = 0;
    for (let k = 0; k < freqs.length; k++) {
      const f = freqs[k];
      const v1 = Math.sin(2 * Math.PI * (f * 0.998) * t + k);
      const v2 = Math.sin(2 * Math.PI * (f * 1.002) * t + k * 1.5);
      chordL += v1 * 0.65 + v2 * 0.35;
      chordR += v2 * 0.65 + v1 * 0.35;
    }
    chordL /= freqs.length;
    chordR /= freqs.length;
    const cut = 0.03 + 0.34 * u * u;
    const rawL = sub * 0.55 + chordL * 0.55;
    const rawR = sub * 0.55 + chordR * 0.55;
    lpL += cut * (rawL - lpL);
    lpR += cut * (rawR - lpR);
    addSample(buf, start + i, lpL * env * amp, lpR * env * amp);
  }
}

function addWhoosh(buf, t0, dur = 0.28, amp = 0.30, panDir = 1) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const u = i / len;
    const n = rand();
    const cut = 0.03 + 0.34 * Math.sin(u * Math.PI);
    lp += cut * (n - lp);
    const env = Math.sin(u * Math.PI) * Math.sin(u * Math.PI);
    const pan = (u * 2 - 1) * 0.65 * panDir;
    const gL = Math.cos(((pan + 1) * Math.PI) / 4);
    const gR = Math.sin(((pan + 1) * Math.PI) / 4);
    addSample(buf, start + i, lp * env * amp * gL, lp * env * amp * gR);
  }
}

function addTick(buf, t0, pitchHz = 1400, amp = 0.24) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.024 * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const s = (Math.sin(2 * Math.PI * pitchHz * t) * 0.72 + rand() * 0.22) * Math.exp(-t * 170) * amp;
    addSample(buf, start + i, s, s);
  }
}

function addBassNote(buf, t0, dur, freq, amp = 0.33, sidechainPeriod = BEAT) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let p1 = 0, p2 = 0, lpL = 0, lpR = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    p1 += (2 * Math.PI * freq) / SR;
    p2 += (2 * Math.PI * freq * 1.005) / SR;
    const saw1 = 2 * ((p1 / (2 * Math.PI)) % 1) - 1;
    const saw2 = 2 * ((p2 / (2 * Math.PI)) % 1) - 1;
    const sub = Math.sin(p1 * 0.5) * 0.55;
    const cut = 0.065 + 0.13 * Math.exp(-t * 5.0);
    lpL += cut * ((saw1 * 0.55 + saw2 * 0.35 + sub) - lpL);
    lpR += cut * ((saw2 * 0.55 + saw1 * 0.35 + sub) - lpR);
    const scPhase = (t % sidechainPeriod) / sidechainPeriod;
    const sc = sidechainPeriod > 0 ? Math.min(1, 0.16 + scPhase * 2.8) : 1;
    const env = Math.min(1, t / 0.008) * Math.min(1, (dur - t) / 0.028);
    addSample(buf, start + i, lpL * env * sc * amp, lpR * env * sc * amp);
  }
}

function addPad(buf, t0, dur, freqs, amp = 0.15, attackSec = 0.45, releaseSec = 0.75) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const a = t < attackSec ? 0.5 - 0.5 * Math.cos((Math.PI * t) / attackSec) : 1;
    const rem = dur - t;
    const r = rem < releaseSec ? 0.5 - 0.5 * Math.cos((Math.PI * Math.max(0, rem)) / releaseSec) : 1;
    const env = a * r;
    let sL = 0, sR = 0;
    for (let fIdx = 0; fIdx < freqs.length; fIdx++) {
      const f = freqs[fIdx];
      const v1 = Math.sin(2 * Math.PI * (f * 0.998) * t + fIdx);
      const v2 = Math.sin(2 * Math.PI * (f * 1.002) * t + fIdx * 2);
      const v3 = Math.sin(2 * Math.PI * f * 2 * t) * 0.18;
      sL += v1 * 0.7 + v2 * 0.3 + v3;
      sR += v2 * 0.7 + v1 * 0.3 + v3;
    }
    const norm = (amp / freqs.length) * env;
    addSample(buf, start + i, sL * norm, sR * norm);
  }
}

function addArpNote(buf, t0, freq, amp = 0.14, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(0.18 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    phase += (2 * Math.PI * freq) / SR;
    const wave = Math.sin(phase) * 0.68 + Math.sin(phase * 2) * 0.24 + Math.sin(phase * 3) * 0.08;
    const env = Math.exp(-t * 16) * Math.min(1, t / 0.002);
    const s = wave * env * amp;
    addSample(buf, start + i, s * gL, s * gR);
  }
}

// Luminous Apple glass celesta chime for calligraphic Fastlottie moments
function addGlassChime(buf, t0, freq, decaySec = 0.55, amp = 0.15, pan = 0) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(decaySec * 4.2 * SR);
  const gL = Math.cos(((pan + 1) * Math.PI) / 4);
  const gR = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < len; i++) {
    const dt = i / SR;
    const atk = Math.min(1, dt / 0.005);
    const sig =
      Math.sin(2 * Math.PI * freq * dt) * Math.exp(-dt / decaySec) * 0.72 +
      Math.sin(2 * Math.PI * freq * 2.0 * dt) * Math.exp(-dt / (decaySec * 0.35)) * 0.22 +
      Math.sin(2 * Math.PI * freq * 3.98 * dt) * Math.exp(-dt / (decaySec * 0.14)) * 0.06;
    const v = sig * atk * amp;
    addSample(buf, start + i, v * gL, v * gR);
  }
}

// Radiant upward harp/celesta chord glissando right on a Ceramic Light downbeat!
function addHarpGliss(buf, t0, freqs, stepSec = 0.030, decaySec = 0.85, amp = 0.125, panStart = -0.45, panEnd = 0.45) {
  const n = Math.max(1, freqs.length - 1);
  for (let i = 0; i < freqs.length; i++) {
    const pan = panStart + (panEnd - panStart) * (i / n);
    addGlassChime(buf, t0 + i * stepSec, freqs[i], decaySec, amp * (0.92 + 0.14 * (i / n)), pan);
  }
}

// Velvety silk ribbon brush texture synced to calligraphy writing
function addSilkBrush(buf, t0, dur, amp, fStart, fEnd) {
  const start = Math.floor(t0 * SR);
  const len = Math.floor(dur * SR);
  let y1L = 0, y2L = 0, y1R = 0, y2R = 0;
  for (let i = 0; i < len; i++) {
    const u = i / Math.max(1, len);
    const env = Math.sin(Math.PI * u) * Math.pow(Math.sin(Math.PI * u), 0.35);
    const fc = fStart + (fEnd - fStart) * u;
    const r = 0.965;
    const w = (2 * Math.PI * fc) / SR;
    const a1 = -2 * r * Math.cos(w);
    const a2 = r * r;
    const xL = rand() * 0.04;
    const xR = rand() * 0.04;
    const outL = xL - a1 * y1L - a2 * y2L;
    const outR = xR - a1 * y1R - a2 * y2R;
    y2L = y1L; y1L = outL;
    y2R = y1R; y1R = outR;
    addSample(buf, start + i, outL * env * amp, outR * env * amp);
  }
}

// Synced crystalline arpeggio flourish over an FL -> Fastlottie unfold window
function addCalligraphyChimeSequence(buf, tStart, durSec, intensity = 1.0) {
  const notes = [
    [0.03, 523.25, 0.60, 0.14, -0.42], // F lightning strike (C5)
    [0.12, 783.99, 0.56, 0.12, -0.32], // L emblem bloom (G5)
    [0.24, 659.25, 0.50, 0.10, -0.24], // FL glide open (E5)
    [0.34, 587.33, 0.48, 0.11, -0.18], // "a" (D5)
    [0.46, 659.25, 0.48, 0.11, -0.08], // "s" (E5)
    [0.57, 783.99, 0.50, 0.12, 0.04],  // "t" + crossbar (G5)
    [0.67, 880.00, 0.50, 0.12, 0.16],  // "o-t-t" (A5)
    [0.78, 1046.50, 0.60, 0.14, 0.28], // "tt" crossbar (C6)
    [0.85, 1318.51, 0.78, 0.15, 0.36], // "i" dot pop (E6)
    [0.91, 1567.98, 0.94, 0.11, 0.10], // specular sheen sparkle (G6)
  ];
  for (const [frac, hz, dec, amp, pan] of notes) {
    addGlassChime(buf, tStart + frac * durSec, hz, dec, amp * intensity, pan);
  }
  addSilkBrush(buf, tStart + 0.04 * durSec, durSec * 0.22, 0.20 * intensity, 840, 1620);
  addSilkBrush(buf, tStart + 0.22 * durSec, durSec * 0.62, 0.22 * intensity, 760, 1860);
  addSilkBrush(buf, tStart + 0.82 * durSec, durSec * 0.24, 0.18 * intensity, 1500, 2900);
}

// Mix a dedicated lush stereo studio-reflection bus into main buf (keeps kicks/subs razor-dry!)
function mixWithStudioSpace(mainBuf, fxBuf) {
  const d1L = Math.floor(SR * 0.067);
  const d1R = Math.floor(SR * 0.097);
  const d2L = Math.floor(SR * 0.149);
  const d2R = Math.floor(SR * 0.193);
  const d3L = Math.floor(SR * 0.257);
  const d3R = Math.floor(SR * 0.311);
  let lpL = 0;
  let lpR = 0;
  for (let i = 0; i < mainBuf.n; i++) {
    let wetL = 0;
    let wetR = 0;
    if (i >= d1L) wetL += fxBuf.R[i - d1L] * 0.28;
    if (i >= d1R) wetR += fxBuf.L[i - d1R] * 0.28;
    if (i >= d2L) wetL += fxBuf.L[i - d2L] * 0.17;
    if (i >= d2R) wetR += fxBuf.R[i - d2R] * 0.17;
    if (i >= d3L) wetL += fxBuf.R[i - d3L] * 0.10;
    if (i >= d3R) wetR += fxBuf.L[i - d3R] * 0.10;
    // Silky warm high-frequency damping on reflections
    lpL += 0.32 * (wetL - lpL);
    lpR += 0.32 * (wetR - lpR);
    mainBuf.L[i] += fxBuf.L[i] + lpL;
    mainBuf.R[i] += fxBuf.R[i] + lpR;
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

  const fadeOutSamples = Math.floor(0.45 * SR);
  let off = 44;
  for (let i = 0; i < buf.n; i++) {
    const rem = buf.n - 1 - i;
    const endFade = rem < fadeOutSamples ? rem / fadeOutSamples : 1;
    const l = Math.round(clamp(softClip(buf.L[i] * 0.88 * endFade), -1, 1) * 32767);
    const r = Math.round(clamp(softClip(buf.R[i] * 0.88 * endFade), -1, 1) * 32767);
    out.writeInt16LE(l, off);
    out.writeInt16LE(r, off + 2);
    off += 4;
  }
  fs.writeFileSync(filePath, out);
  console.log(`Wrote ${filePath} (${(out.length / 1024 / 1024).toFixed(2)} MiB, ${(buf.n / SR).toFixed(2)}s)`);
}

function buildFull55s() {
  const buf = createStereoBuffer(68.0);
  const fx = createStereoBuffer(68.0); // Dedicated crystalline Keynote stereo space bus

  // =========================================================================
  // ACT I (0.00 - 18.35s): Restrained Obsidian Tension + Native Meltdown
  // =========================================================================
  addPad(buf, 0.0, 6.75, [73.42, 110.0, 146.83], 0.13);
  addSubBoom(buf, 0.22, 0.65, 0.7, 92, 38);
  addSubBoom(buf, 1.45, 0.74, 0.8, 98, 36);
  addSubBoom(buf, 4.24, 0.82, 0.75, 112, 40);
  // 2-beat rhythmic tension pickup locking Scene 1 (Dogma @ 0-6.80s) -> Scene 2 (Meltdown @ 6.80s)
  addRiser(buf, 5.75, 1.03, 0.42, 150, 1750);
  for (let k = 0; k < 4; k++) {
    const pt = 6.80 - (4 - k) * (BEAT * 0.5);
    addMutedPulseKick(buf, pt, 0.24 + k * 0.08, 0.22);
    addRimPerc(buf, pt, 0.14 + k * 0.05, 760 + k * 110, k % 2 === 0 ? -0.22 : 0.22);
  }

  // Scene 2A (6.80 - 10.40s): Pixel 7a Kotlin 100% jank
  addPad(buf, 6.80, 10.8, [73.42, 77.78, 110.0], 0.10);
  addKick(buf, 6.80, 0.72);
  for (let t = 6.80; t < 9.85; t += BEAT * 0.5) addHat(buf, t, 0.13, 0.035, -0.3);
  // Crisp 2-step turnaround into Scene 2B (10.40s)
  addPercTom(buf, 10.40 - BEAT, 185, 96, 0.30, -0.25);
  addSnare(buf, 10.40 - BEAT * 0.5, 0.28, 0.12, 0.25);
  addWhoosh(buf, 10.22, 0.22, 0.30, 1);

  // Scene 2B (10.40 - 14.20s): Pure C++ dotlottie-android
  addKick(buf, 10.40, 0.76);
  for (let t = 10.40; t < 13.85; t += BEAT * 0.5) addHat(buf, t, 0.15, 0.035, 0.3);
  addPercTom(buf, 14.20 - BEAT * 0.5, 175, 92, 0.28, -0.2);
  addWhoosh(buf, 14.02, 0.22, 0.32, -1);

  // Scene 2C (14.20 - 18.35s): Apple M5 fallback -> 3.27 GiB
  addTick(buf, 14.80, 1650, 0.32); // Core Animation fallback snap
  let tickT = 15.02, step = 0.14, pitch = 900;
  while (tickT < 16.65) {
    addTick(buf, tickT, pitch, 0.26);
    tickT += step;
    step = Math.max(0.032, step * 0.84);
    pitch = Math.min(3200, pitch * 1.07);
  }
  addRiser(buf, 15.50, 1.18, 0.42, 220, 2100);
  addSubBoom(buf, 16.70, 0.96, 1.15, 132, 32);

  // Smooth exponential blackout decay (18.28 - 18.40s) -> crisp dramatic breath (18.40 - 18.54s)
  const decayStart = Math.floor(18.28 * SR);
  const decayEnd = Math.floor(18.40 * SR);
  const breathEnd = Math.floor(18.54 * SR);
  for (let i = decayStart; i < breathEnd; i++) {
    const fade = i < decayEnd ? Math.pow(1 - (i - decayStart) / (decayEnd - decayStart), 1.6) : 0;
    buf.L[i] *= fade;
    buf.R[i] *= fade;
  }

  // =========================================================================
  // BRIDGE I -> II (18.545 - 19.000s): 1-BEAT KEYNOTE PICKUP INTO LIGHT BREAK!
  // Exact 132 BPM upbeat cadence ("1 . & a | ONE!") lifting monotonically from dark Dm -> Gsus4 -> Cmaj9!
  // =========================================================================
  const lightT = 19.00;
  addMutedPulseKick(buf, lightT - BEAT, 0.20, 0.22, 92, 48);
  addReverseGlassSwell(fx, lightT, BEAT * 1.05, [196.0, 293.66, 392.0, 493.88, 783.99], 0.42);
  addMutedPulseKick(buf, lightT - BEAT * 0.5, 0.24, 0.16, 98, 48);
  addRimPerc(buf, lightT - BEAT * 0.5, 0.20, 920, -0.22);
  addGlassChime(fx, lightT - BEAT * 0.5, 783.99, 0.36, 0.13, -0.25);
  addRimPerc(buf, lightT - BEAT * 0.25, 0.24, 1180, 0.22);
  addGlassChime(fx, lightT - BEAT * 0.25, 987.77, 0.34, 0.15, 0.25);

  // =========================================================================
  // ACT II (19.00 - 25.60s): LIGHT BREAKS — FastLottie Opening + 2-Bar Tempo Bridge!
  // =========================================================================
  addWarmSubBloom(buf, lightT, 65.41, 1.85, 0.62);
  addMutedPulseKick(buf, lightT, 0.42, 0.26, 108, 48);
  addHarpGliss(fx, lightT, [261.63, 329.63, 392.0, 493.88, 587.33, 659.25], 0.030, 0.82, 0.12, -0.45, 0.45);
  addPad(buf, lightT, 4.35, [130.81, 261.63, 329.63, 392.0, 493.88], 0.17, 0.20, 0.85);

  // Calligraphy FL -> Fastlottie unfold chimes (19.08 - 23.45s) in lush studio space
  addCalligraphyChimeSequence(fx, 19.08, 4.37, 1.12);
  addWhoosh(fx, 19.98, 0.42, 0.14, 1);

  // -------------------------------------------------------------------------
  // BRIDGE II -> III (21.964 - 25.600s): EXACT 2-BAR (8-BEAT) 132 BPM BUILD!
  // Anchored backwards from dropT = 25.600s so Act II hands off seamlessly into Act III!
  // -------------------------------------------------------------------------
  const dropT = 25.60;
  const barMinus2 = dropT - BEAT * 8; // 21.9636s
  const barMinus1 = dropT - BEAT * 4; // 23.7818s

  for (let k = 0; k < 4; k++) {
    const bt = barMinus2 + k * BEAT;
    addMutedPulseKick(buf, bt, 0.24 + k * 0.065, 0.24, 102, 46);
    addHat(buf, bt + BEAT * 0.5, 0.075 + k * 0.02, 0.038, k % 2 === 0 ? -0.32 : 0.32);
    if (k === 1 || k === 3) {
      addRimPerc(buf, bt, 0.12 + k * 0.03, 980, k === 1 ? -0.18 : 0.18);
    }
  }
  // Harmonic pivot pad from Cmaj9 -> A7sus4 (dominant V of D minor)
  addPad(buf, barMinus2 + BEAT * 2, BEAT * 5.8, [110.0, 164.81, 196.0, 293.66, 329.63], 0.15, 0.55, 0.35);

  // Bar -1 (23.782 - 25.600s): Crisp 4-beat launch build + dominant A pedal + 16th-note turnaround fill!
  addTonalBridgeSwell(buf, barMinus1, BEAT * 3.82, 55.0, [220.0, 293.66, 329.63, 440.0], 0.36);
  addRiser(buf, barMinus1 + BEAT * 0.5, BEAT * 3.32, 0.40, 220, 1850);

  for (let k = 0; k < 2; k++) {
    const bt = barMinus1 + k * BEAT;
    addMutedPulseKick(buf, bt, 0.52 + k * 0.08, 0.26, 118, 46);
    if (k === 1) addSnare(buf, bt, 0.26, 0.13, 0.12);
    for (let s = 0; s < 4; s++) {
      addHat(buf, bt + (s * BEAT) / 4, (s === 2 ? 0.14 : 0.08) * (0.8 + k * 0.35), 0.036, s % 2 ? 0.32 : -0.32);
    }
  }
  const bMinus2 = barMinus1 + BEAT * 2;
  addKick(buf, bMinus2, 0.62, 0.24, 136, 45);
  addSnare(buf, bMinus2, 0.30, 0.12, -0.15);
  addKick(buf, bMinus2 + BEAT * 0.5, 0.66, 0.22, 142, 45);
  addSnare(buf, bMinus2 + BEAT * 0.5, 0.36, 0.12, 0.15);
  addHat(buf, bMinus2 + BEAT * 0.25, 0.15, 0.036, -0.3);
  addHat(buf, bMinus2 + BEAT * 0.75, 0.18, 0.036, 0.3);

  const bMinus1 = barMinus1 + BEAT * 3;
  const fillFreqs = [220, 196, 172, 152];
  for (let s = 0; s < 4; s++) {
    const ft = bMinus1 + (s * BEAT) / 4;
    addSnare(buf, ft, 0.36 + s * 0.07, 0.085, ((s % 2) * 2 - 1) * 0.22);
    addPercTom(buf, ft, fillFreqs[s], fillFreqs[s] * 0.55, 0.26 + s * 0.05, ((s % 2) * 2 - 1) * -0.25);
  }
  addReverseGlassSwell(fx, dropT - 0.065, BEAT * 1.05, [293.66, 440.0, 587.33, 880.0], 0.26);

  // =========================================================================
  // ACT III (25.60 - 51.05s): EXACT 14-BAR (56-BEAT) 132 BPM BENCHMARK GROOVE!
  // Every visual cut (25.60, 32.87, 40.15, 43.78, 47.42, 51.05s) lands on an exact bar downbeat!
  // =========================================================================
  const grooveEnd = dropT + BEAT * 55; // 50.600s (clean 1-beat brake into Scene 7A @ 51.055s!)
  addSubBoom(buf, dropT, 0.95, 1.2, 138, 36);
  addGlassChime(fx, dropT, 587.33, 0.55, 0.16, -0.25);
  addGlassChime(fx, dropT + 0.03, 1174.66, 0.55, 0.13, 0.25);

  const bassSeq = [73.42, 73.42, 87.31, 65.41, 73.42, 73.42, 58.27, 65.41];
  const barDur = BEAT * 4;
  let barIdx = 0;
  for (let bt = dropT; bt < grooveEnd - 0.01; bt += barDur) {
    const f = bassSeq[barIdx % bassSeq.length];
    const dur = Math.min(barDur, grooveEnd - bt);
    addBassNote(buf, bt, dur, f, 0.35, BEAT);
    if (barIdx % 2 === 0) {
      const chord = barIdx % 4 === 0 ? [146.83, 220.0, 261.63, 329.63] : [116.54, 174.61, 220.0, 261.63];
      addPad(buf, bt, Math.min(barDur * 2, grooveEnd - bt), chord, 0.12);
    }
    barIdx++;
  }

  let beatNum = 0;
  for (let t = dropT; t < grooveEnd - 0.01; t += BEAT) {
    addKick(buf, t, 0.80, 0.32);
    if (beatNum % 2 === 1) addSnare(buf, t, 0.38, 0.15, beatNum % 4 === 1 ? -0.1 : 0.1);
    for (let sub = 0; sub < 4; sub++) {
      const ht = t + (sub * BEAT) / 4;
      if (ht < grooveEnd - 0.01) {
        addHat(buf, ht, sub === 2 ? 0.21 : sub === 0 ? 0.09 : 0.13, sub === 2 ? 0.06 : 0.036, sub % 2 === 0 ? -0.35 : 0.35);
      }
    }
    if (t >= 32.85) {
      const arpNotes = [293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 329.63, 293.66];
      for (let sub = 0; sub < 4; sub++) {
        const at = t + (sub * BEAT) / 4;
        if (at < grooveEnd - 0.01) {
          addArpNote(buf, at, arpNotes[(beatNum * 4 + sub) % arpNotes.length], 0.12, ((sub % 2) * 2 - 1) * 0.45);
        }
      }
    }
    beatNum++;
  }
  // Crisp 1-beat brake turnaround into Act IV ("SO MUCH FOR THE RULE." @ 51.05s)
  addSnare(buf, grooveEnd, 0.44, 0.16, 0);
  addWhoosh(buf, grooveEnd + 0.08, 0.38, 0.28, -1);

  // Exact bar-locked visual cue accents across Act III
  addGlassChime(fx, 26.55, 1174.66, 0.42, 0.16, -0.2);
  addGlassChime(fx, 26.68, 1760.0, 0.40, 0.14, 0.2);
  addWhoosh(buf, 32.70, 0.26, 0.36, -1);
  addSubBoom(buf, 32.87, 0.72, 0.85, 128, 38);
  for (const [ct, dir, chimeHz] of [[40.15, 1, 880], [43.78, -1, 1046.5], [47.42, 1, 1174.66]]) {
    addWhoosh(buf, ct - 0.16, 0.22, 0.36, dir);
    addSubBoom(buf, ct, 0.62, 0.55, 118, 42);
    addGlassChime(fx, ct + 0.04, chimeHz, 0.48, 0.16, dir * 0.2);
  }

  // =========================================================================
  // ACT IV (51.05 - 68.00s): Full-Circle Crescendo + Code + Minimalist Outro
  // =========================================================================
  addPad(buf, 51.05, 2.75, [130.81, 196.0, 261.63], 0.10, 0.18, 0.35);
  addMutedPulseKick(buf, 51.05, 0.50, 0.26, 108, 42);

  // 53.85s: Obsidian Power Beat ("Faster. Lighter. Smoother.")
  addTick(buf, 53.85, 1120, 0.30);
  addKick(buf, 53.85, 0.64, 0.24, 122, 42);
  addGlassChime(fx, 53.86, 1046.50, 0.55, 0.12, 0);

  // 56.00 - 58.95s: Kinetic build into "Every. Single. Time."
  addRiser(buf, 56.05, 2.84, 0.52, 160, 2300);
  for (let i = 0; i < 20; i++) {
    const t = 56.15 + i * 0.125;
    if (t < 58.35) addSnare(buf, t, 0.16 + (i / 20) * 0.38, 0.10, ((i % 2) * 2 - 1) * 0.25);
  }
  for (let i = 0; i < 9; i++) {
    const t = 58.36 + i * 0.06;
    if (t < 58.88) addSnare(buf, t, 0.44 + (i / 9) * 0.22, 0.08, 0);
  }
  addSubBoom(buf, 58.95, 0.98, 1.7, 158, 34);
  addHarpGliss(fx, 58.95, [523.25, 659.25, 783.99, 1046.5], 0.045, 0.78, 0.16, -0.35, 0.35);

  // 60.85 - 64.35s: Clean Dart code typing ticks + warm crystalline pad
  addWhoosh(buf, 60.72, 0.22, 0.26, 1);
  addPad(buf, 60.85, 7.10, [130.81, 261.63, 329.63, 392.0, 493.88], 0.17, 0.35, 1.25);
  for (let i = 0; i < 12; i++) addTick(buf, 61.02 + i * 0.105, 2200 + (i % 3) * 260, 0.10);

  // Bridge 8A -> 8B Outro (63.90 - 64.35s): Reverse crystalline swell + 2-note Keynote lift
  const outroT = 64.35;
  addReverseGlassSwell(fx, outroT, 0.44, [261.63, 392.0, 493.88, 783.99], 0.24);
  addGlassChime(fx, outroT - 0.22, 783.99, 0.35, 0.09, -0.2);
  addGlassChime(fx, outroT - 0.11, 987.77, 0.32, 0.10, 0.2);

  // 64.35 - 68.00s: Pure FastLottie Minimalist Outro + Specular Sweep shimmer (64.70 - 66.00s)
  addWarmSubBloom(buf, outroT, 65.41, 2.4, 0.50);
  addHarpGliss(fx, outroT, [523.25, 659.25, 783.99, 1046.5], 0.038, 1.15, 0.12, -0.38, 0.38);
  addSilkBrush(fx, 64.68, 1.35, 0.20, 1450, 2850);
  addGlassChime(fx, 65.15, 1318.51, 1.25, 0.12, -0.18);
  addGlassChime(fx, 65.50, 1567.98, 1.45, 0.11, 0.20);

  mixWithStudioSpace(buf, fx);
  return buf;
}

function buildTeaser15s() {
  const buf = createStereoBuffer(18.0);
  const fx = createStereoBuffer(18.0);

  // =========================================================================
  // 0.00 - 2.45s: Matte Obsidian Hook + 2-beat rhythmic tension pickup -> 2.45s
  // =========================================================================
  addSubBoom(buf, 0.04, 0.82, 0.80, 132, 38);
  addRiser(buf, 1.53, 0.90, 0.42, 180, 1850);
  for (let k = 0; k < 4; k++) {
    const pt = 2.45 - (4 - k) * (BEAT * 0.5);
    addMutedPulseKick(buf, pt, 0.22 + k * 0.08, 0.20);
    addRimPerc(buf, pt, 0.14 + k * 0.05, 800 + k * 110, k % 2 === 0 ? -0.2 : 0.2);
  }

  // =========================================================================
  // 2.45 - 4.45s: Apple M5 Native Swift 3.27 GiB shock -> 1-Beat Pickup into FastLottie!
  // =========================================================================
  addSubBoom(buf, 2.45, 0.86, 0.85, 128, 36);
  for (let i = 0; i < 7; i++) addTick(buf, 2.60 + i * 0.16, 1150 + i * 210, 0.20);

  const dropT = 4.45;
  const preDrop = dropT - BEAT; // 3.995s
  for (let s = 0; s < 4; s++) {
    const ft = preDrop + (s * BEAT) / 4;
    addSnare(buf, ft, 0.28 + s * 0.08, 0.09, ((s % 2) * 2 - 1) * 0.22);
    addPercTom(buf, ft, 210 - s * 18, 105 - s * 10, 0.22 + s * 0.05, ((s % 2) * 2 - 1) * -0.2);
  }
  addReverseGlassSwell(fx, dropT - 0.02, BEAT * 0.92, [293.66, 440.0, 587.33, 880.0], 0.24);

  // =========================================================================
  // 4.45 - 11.723s: EXACT 4-BAR (16-BEAT) 132 BPM Launch Groove!
  //   Bars 1-2 (4.450 - 8.086s): Apple M5 FastLottie Split-Screen
  //   Bars 3-4 (8.086 - 11.723s): Pixel 7a 90 Hz Proof
  // =========================================================================
  const pixelT = dropT + BEAT * 8; // 8.086s
  const grooveEnd = dropT + BEAT * 16; // 11.723s
  addSubBoom(buf, dropT, 0.92, 1.0, 145, 36);
  addGlassChime(fx, dropT, 587.33, 0.50, 0.16, -0.22);
  addGlassChime(fx, dropT + 0.03, 1174.66, 0.50, 0.13, 0.22);
  addPad(buf, dropT, grooveEnd - dropT + 0.35, [146.83, 220.0, 261.63, 329.63], 0.14, 0.20, 0.45);

  let b = 0;
  for (let t = dropT; t < grooveEnd - 0.01; t += BEAT) {
    addKick(buf, t, 0.80, 0.30);
    if (b % 2 === 1) addSnare(buf, t, 0.38);
    for (let s = 0; s < 4; s++) {
      const ht = t + (s * BEAT) / 4;
      if (ht < grooveEnd - 0.01) {
        addHat(buf, ht, s === 2 ? 0.20 : 0.11, 0.04, s % 2 ? 0.3 : -0.3);
      }
    }
    b++;
  }
  addBassNote(buf, dropT, pixelT - dropT, 73.42, 0.35, BEAT);
  addBassNote(buf, pixelT, grooveEnd - pixelT, 87.31, 0.35, BEAT);
  addWhoosh(buf, pixelT - 0.16, 0.22, 0.34, 1);
  addGlassChime(fx, pixelT + 0.02, 1174.66, 0.48, 0.16, 0.15);

  // =========================================================================
  // BRIDGE INTO FINALE (11.723 - 12.632s): EXACT 2-BEAT TURNAROUND + REVERSE SWELL!
  // Smoothly resolves 132 BPM Dm groove -> Gsus4 bridge swell -> Luminous Cmaj9 FastLottie Finale!
  // =========================================================================
  const finaleT = grooveEnd + BEAT * 2; // 12.632s
  addTonalBridgeSwell(buf, grooveEnd, BEAT * 1.96, 98.0, [196.0, 293.66, 392.0, 493.88], 0.32);
  addReverseGlassSwell(fx, finaleT, BEAT * 1.75, [196.0, 293.66, 392.0, 493.88, 783.99], 0.40);
  // Exact 132 BPM 2-beat cadence: Beat 17 kick -> 17.5 tom -> Beat 18 snare -> 18.5 G5 lift -> 18.75 B5 lift -> Finale!
  addMutedPulseKick(buf, grooveEnd, 0.58, 0.24, 118, 46);
  addRimPerc(buf, grooveEnd, 0.22, 860, -0.25);
  addPercTom(buf, grooveEnd + BEAT * 0.5, 195, 102, 0.34, 0.25);
  addSnare(buf, grooveEnd + BEAT, 0.34, 0.13, 0);
  addRimPerc(buf, finaleT - BEAT * 0.5, 0.22, 960, -0.20);
  addGlassChime(fx, finaleT - BEAT * 0.5, 783.99, 0.38, 0.13, -0.24);
  addRimPerc(buf, finaleT - BEAT * 0.25, 0.24, 1180, 0.20);
  addGlassChime(fx, finaleT - BEAT * 0.25, 987.77, 0.36, 0.15, 0.24);

  // =========================================================================
  // 12.63 - 18.00s: Luminous Apple Ceramic Finale — FL -> Fastlottie Calligraphy Unfold!
  // =========================================================================
  addWarmSubBloom(buf, finaleT, 65.41, 1.85, 0.60);
  addMutedPulseKick(buf, finaleT, 0.38, 0.24, 106, 48);
  addHarpGliss(fx, finaleT, [261.63, 329.63, 392.0, 493.88, 587.33, 659.25], 0.030, 0.85, 0.12, -0.45, 0.45);
  addPad(buf, finaleT, 5.32, [130.81, 261.63, 329.63, 392.0, 493.88], 0.18, 0.20, 1.20);
  addCalligraphyChimeSequence(fx, finaleT + 0.04, 3.65, 1.18);
  addWhoosh(fx, finaleT + 0.86, 0.38, 0.14, 1);

  mixWithStudioSpace(buf, fx);
  return buf;
}

const outDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/audio');
writeWav(path.join(outDir, 'soundtrack_55s.wav'), buildFull55s());
writeWav(path.join(outDir, 'soundtrack_15s.wav'), buildTeaser15s());
