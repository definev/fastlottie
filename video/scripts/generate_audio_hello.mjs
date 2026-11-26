#!/usr/bin/env node
/**
 * Procedural Apple-minimalist warm crystalline audio soundscape for the 6.8s
 * FastLottie "hello"-style cursive "lottie" reveal video.
 *
 * Output: public/audio/soundtrack_hello_6_8s.wav (48kHz stereo 16-bit PCM)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'public/audio/soundtrack_hello_6_8s.wav');

const SR = 48000;
const DUR = 6.8;
const N = Math.floor(SR * DUR);

const L = new Float32Array(N);
const R = new Float32Array(N);

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// Smooth raised-cosine envelope
function envFade(t, t0, attack, hold, release) {
  if (t < t0) return 0;
  const dt = t - t0;
  if (dt < attack) return 0.5 - 0.5 * Math.cos(Math.PI * (dt / attack));
  if (dt < attack + hold) return 1;
  const rd = dt - attack - hold;
  if (rd < release) return 0.5 + 0.5 * Math.cos(Math.PI * (rd / release));
  return 0;
}

// Add a warm stereo pad voice with gentle detune & slow vibrato
function addPadNote(freq, t0, attack, hold, release, amp, pan = 0) {
  const start = Math.max(0, Math.floor(t0 * SR));
  const end = Math.min(N, Math.ceil((t0 + attack + hold + release) * SR));
  const gL = amp * Math.cos((pan + 1) * Math.PI * 0.25);
  const gR = amp * Math.sin((pan + 1) * Math.PI * 0.25);
  for (let i = start; i < end; i++) {
    const t = i / SR;
    const e = envFade(t, t0, attack, hold, release);
    const vib = 1 + 0.0018 * Math.sin(2 * Math.PI * 4.2 * t + freq * 0.01);
    const f = freq * vib;
    // Soft bell-warm additive wave (fundamental + gentle 2nd & 3rd partials)
    const sL =
      Math.sin(2 * Math.PI * f * t) * 0.72 +
      Math.sin(2 * Math.PI * (f * 2.001) * t + 0.4) * 0.20 +
      Math.sin(2 * Math.PI * (f * 3.002) * t + 1.1) * 0.06;
    const sR =
      Math.sin(2 * Math.PI * (f * 1.0012) * t + 0.2) * 0.72 +
      Math.sin(2 * Math.PI * (f * 1.999) * t + 0.9) * 0.20 +
      Math.sin(2 * Math.PI * (f * 2.998) * t + 1.7) * 0.06;
    L[i] += sL * e * gL;
    R[i] += sR * e * gR;
  }
}

// Add a delicate Apple-style glass celesta / kalimba chime ping
function addChime(freq, t0, decaySec, amp, pan = 0) {
  const start = Math.max(0, Math.floor(t0 * SR));
  const end = Math.min(N, Math.ceil((t0 + decaySec * 4.5) * SR));
  const gL = amp * Math.cos((pan + 1) * Math.PI * 0.25);
  const gR = amp * Math.sin((pan + 1) * Math.PI * 0.25);
  for (let i = start; i < end; i++) {
    const dt = i / SR - t0;
    const atk = Math.min(1, dt / 0.006);
    const e1 = Math.exp(-dt / decaySec);
    const e2 = Math.exp(-dt / (decaySec * 0.35));
    const e3 = Math.exp(-dt / (decaySec * 0.14));
    const sig =
      Math.sin(2 * Math.PI * freq * dt) * e1 * 0.72 +
      Math.sin(2 * Math.PI * freq * 2.0 * dt) * e2 * 0.22 +
      Math.sin(2 * Math.PI * freq * 3.98 * dt) * e3 * 0.08;
    const v = sig * atk;
    L[i] += v * gL;
    R[i] += v * gR;
  }
}

// Add a whisper-soft velvety silk ribbon air sweep (bandpass-filtered pink-ish noise)
function addSilkBrush(t0, dur, amp, sweepFreqStart, sweepFreqEnd) {
  const start = Math.max(0, Math.floor(t0 * SR));
  const end = Math.min(N, Math.ceil((t0 + dur) * SR));
  let seed = Math.floor(t0 * 10000 + 1337);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed / 0xffffffff) * 2 - 1;
  };
  // Simple resonant 2-pole filter state
  let y1L = 0, y2L = 0, y1R = 0, y2R = 0;
  for (let i = start; i < end; i++) {
    const u = (i - start) / Math.max(1, end - start);
    const env = Math.sin(Math.PI * u) * Math.pow(Math.sin(Math.PI * u), 0.35);
    const fc = sweepFreqStart + (sweepFreqEnd - sweepFreqStart) * u;
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
    L[i] += outL * env * amp;
    R[i] += outR * env * amp;
  }
}

// 1. Warm airy opening Cmaj9 pad (breathes in cleanly with the "L")
addPadNote(130.81, 0.05, 1.1, 3.6, 1.8, 0.14, 0.0);    // C3 root
addPadNote(261.63, 0.12, 1.0, 3.8, 1.7, 0.11, -0.22);  // C4
addPadNote(329.63, 0.25, 1.1, 3.6, 1.7, 0.095, 0.20);  // E4
addPadNote(392.00, 0.45, 1.1, 3.5, 1.7, 0.085, -0.32); // G4
addPadNote(493.88, 0.85, 1.2, 3.2, 1.6, 0.065, 0.34);  // B4 (luminous maj7)
addPadNote(587.33, 1.35, 1.2, 3.0, 1.6, 0.055, -0.18); // D5 (open 9th)

// 2. Delicate crystalline arpeggio notes tracking each cursive letter reveal!
addChime(523.25, 0.28, 0.55, 0.13, -0.38);  // "l" rise (C5)
addChime(659.25, 0.88, 0.50, 0.11, -0.22);  // "l" crossing (E5)
addChime(587.33, 1.52, 0.45, 0.10, -0.06);  // "o" loop (D5)
addChime(783.99, 2.22, 0.48, 0.11, 0.08);   // "t" #1 ascender (G5)
addChime(880.00, 2.74, 0.48, 0.11, 0.20);   // "t" #2 ascender (A5)
addChime(783.99, 3.22, 0.44, 0.10, 0.30);   // "i" stem (G5)
addChime(1046.50, 3.56, 0.62, 0.12, 0.38);  // "e" flourish (C6)

// 3. Signature Apple punctuation chimes for "tt" crossbar & "i" dot!
addChime(1174.66, 3.92, 0.42, 0.11, 0.12);  // "tt" crossbar sweep (D6)
addChime(1318.51, 4.40, 0.72, 0.15, 0.26);  // "i" dot joyful pop (E6)

// 4. Luminous finale shimmer chord synced with the studio specular sweep (4.76s - 5.86s)
addChime(1046.50, 4.82, 0.95, 0.10, -0.28); // C6
addChime(1567.98, 4.92, 1.05, 0.085, 0.28); // G6
addChime(2093.00, 5.04, 1.10, 0.055, 0.0);  // C7 whisper sparkle

// 5. Whisper-soft velvety ribbon glide texture
addSilkBrush(0.24, 3.65, 0.22, 720, 1480);
addSilkBrush(3.86, 0.46, 0.26, 1200, 2200); // crossbar whoosh
addSilkBrush(4.74, 1.10, 0.18, 1600, 2900); // specular sheen air

// Simple stereo schroeder-like early reflection wash for lush Apple studio space
const delayL = Math.floor(SR * 0.083);
const delayR = Math.floor(SR * 0.117);
const delayL2 = Math.floor(SR * 0.173);
const delayR2 = Math.floor(SR * 0.211);
for (let i = 0; i < N; i++) {
  if (i >= delayL) L[i] += R[i - delayL] * 0.26;
  if (i >= delayR) R[i] += L[i - delayR] * 0.26;
  if (i >= delayL2) L[i] += L[i - delayL2] * 0.14;
  if (i >= delayR2) R[i] += R[i - delayR2] * 0.14;
}

// Gentle soft limiter & clean fade-out tail
const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const tailFade = t > DUR - 0.55 ? clamp((DUR - t) / 0.55, 0, 1) : 1;
  const sL = Math.tanh(L[i] * 1.15) * 0.88 * tailFade;
  const sR = Math.tanh(R[i] * 1.15) * 0.88 * tailFade;
  pcm.writeInt16LE(Math.round(clamp(sL, -1, 1) * 32767), i * 4);
  pcm.writeInt16LE(Math.round(clamp(sR, -1, 1) * 32767), i * 4 + 2);
}

// Write standard 44-byte WAV header + PCM
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, Buffer.concat([header, pcm]));
console.log(`Generated ${OUT} (${DUR}s, ${(pcm.length / 1024).toFixed(1)} KiB)`);
