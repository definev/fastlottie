#!/usr/bin/env node
// Dual-target Web benchmark & 3-way pixel checksum verifier:
//   1. Dart WasmGC (dart2wasm) inline via `dart compile wasm`
//   2. JS Web Worker calling C-Wasm (fastlottie_worker.js + fastlottie_simd.wasm)
//   3. JS Web Worker Dart fallback (wasm=false)
//
// Run from repo root (Node 26+, or Node 24 with --experimental-wasm-exnref):
//   node tool/benchmark_web_targets.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';

const WORKER_ASSET = path.resolve('lib/src/wasm/fastlottie_worker.js');
const WASM_ASSET = path.resolve('lib/src/wasm/fastlottie_simd.wasm');

const WIDTH = 256;
const HEIGHT = 256;
const FRAMES = 30;
const ROUNDS = 4;
const CACHE_ITERS = 80;

function buildSyntheticStressScene() {
  // Exercises translucent solid fills, alpha matte, Multiply blend, and MergePaths.
  const layers = [
    {
      ty: 4,
      ind: 1,
      ip: 0,
      op: 30,
      st: 0,
      ks: {
        o: { a: 0, k: 85 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [110, 110], e: [150, 140], o: { x: [0.5], y: [0] }, i: { x: [0.5], y: [1] } },
            { t: 30, s: [150, 140] },
          ],
        },
      },
      td: 1,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [180, 180] } },
            { ty: 'fl', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    },
    {
      ty: 4,
      ind: 2,
      ip: 0,
      op: 30,
      st: 0,
      tt: 1,
      ks: { o: { a: 0, k: 80 } },
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', p: { a: 0, k: [128, 128] }, s: { a: 0, k: [200, 200] }, r: { a: 0, k: 24 } },
            { ty: 'fl', c: { a: 0, k: [0.15, 0.55, 0.95, 1] }, o: { a: 0, k: 75 } },
          ],
        },
      ],
    },
    {
      ty: 4,
      ind: 3,
      ip: 0,
      op: 30,
      st: 0,
      bm: 1,
      ks: { o: { a: 0, k: 70 } },
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', p: { a: 0, k: [120, 120] }, s: { a: 0, k: [170, 170] }, r: { a: 0, k: 0 } },
            { ty: 'fl', c: { a: 0, k: [0.9, 0.35, 0.25, 1] }, o: { a: 0, k: 70 } },
          ],
        },
        {
          ty: 'gr',
          it: [
            { ty: 'el', p: { a: 0, k: [148, 148] }, s: { a: 0, k: [130, 130] } },
            { ty: 'fl', c: { a: 0, k: [0.25, 0.85, 0.45, 1] }, o: { a: 0, k: 65 } },
          ],
        },
      ],
    },
    {
      ty: 4,
      ind: 4,
      ip: 0,
      op: 30,
      st: 0,
      ks: { o: { a: 0, k: 100 } },
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', p: { a: 0, k: [128, 128] }, s: { a: 0, k: [230, 230] }, r: { a: 0, k: 12 } },
            { ty: 'fl', c: { a: 0, k: [0.95, 0.92, 0.85, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    },
  ];
  return JSON.stringify({ v: '5.7.0', fr: 30, ip: 0, op: 30, w: 256, h: 256, layers });
}

function loadFixtures() {
  const paths = [
    'test/fixtures/icon.json',
    'test/fixtures/features.json',
    'test/fixtures/many_shapes.json',
    'test/fixtures/morph.json',
  ];
  const fixtures = paths.map(p => ({
    name: path.basename(p),
    json: fs.readFileSync(p, 'utf8'),
  }));
  fixtures.push({
    name: 'stress_matte_blend.json',
    json: buildSyntheticStressScene(),
  });
  return fixtures;
}

function hashBytes(u8) {
  let h = 0x811c9dc5;
  for (let i = 0; i < u8.length; i += 4) {
    const v = (u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24)) >>> 0;
    h = Math.imul(h ^ v, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const workerBridge = `
  const { parentPort, workerData } = require('node:worker_threads');
  globalThis.self = globalThis;
  globalThis.postMessage = (message, transfer) => parentPort.postMessage(message, transfer);
  globalThis.close = () => parentPort.close();
  require(workerData);
  parentPort.on('message', data => self.onmessage({ data }));
`;

function startWorker() {
  const worker = new Worker(workerBridge, { eval: true, workerData: WORKER_ASSET });
  function exchange(...messages) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => finish(reject, new Error('Worker timeout')), 30000);
      const onMessage = m => finish(resolve, m);
      const onError = e => finish(reject, e);
      function finish(cb, val) {
        clearTimeout(timeout);
        worker.off('message', onMessage);
        worker.off('error', onError);
        cb(val);
      }
      worker.once('message', onMessage);
      worker.once('error', onError);
      for (const m of messages) worker.postMessage(m);
    });
  }
  return { worker, exchange };
}

async function runDart2WasmBench(fixtures) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fastlottie-dart2wasm-'));
  try {
    const wasmOut = path.join(tmpDir, 'bench.wasm');
    const mjsOut = path.join(tmpDir, 'bench.mjs');
    execFileSync(
      'dart',
      ['compile', 'wasm', 'tool/benchmark_dart2wasm.dart', '-o', wasmOut],
      { stdio: ['ignore', 'pipe', 'inherit'] },
    );
    globalThis._benchPayload = JSON.stringify({
      fixtures,
      width: WIDTH,
      height: HEIGHT,
      frames: FRAMES,
      rounds: ROUNDS,
      cacheIters: CACHE_ITERS,
    });
    const mod = await import(pathToFileURL(mjsOut).href);
    const compiled = await mod.compile(fs.readFileSync(wasmOut));
    let captured = '';
    const origLog = console.log;
    console.log = (...args) => {
      captured += args.join(' ') + '\n';
    };
    try {
      const app = await compiled.instantiate();
      app.invokeMain();
    } finally {
      console.log = origLog;
    }
    const line = captured.trim().split('\n').pop();
    return JSON.parse(line);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function runJsWorkerBench(fixtures, useWasm) {
  const wasmBytes = useWasm
    ? fs.readFileSync(WASM_ASSET)
    : Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
  const results = [];
  for (const fx of fixtures) {
    const { worker, exchange } = startWorker();
    try {
      const ready = await exchange([
        -1,
        `data:application/wasm;base64,${wasmBytes.toString('base64')}`,
      ]);
      assert.equal(ready[1], useWasm, `Expected wasm=${useWasm}`);
      const doc = JSON.parse(fx.json);
      const start = doc.ip ?? 0;
      const span = Math.round((doc.op ?? 1) - start);
      const frameCount = span > 0 ? Math.min(span, FRAMES) : 1;
      const raw = new Uint8Array(Buffer.from(fx.json, 'utf8'));
      // Disable RAM cache to measure pure vector render + LZ4 compress every frame.
      await exchange(
        [0, null, 0, false],
        [1, 'scene', raw, true],
        [2, 1, 'e', 'scene', start, 0, WIDTH, HEIGHT, frameCount, false],
      );

      let reqId = 10;
      for (let f = 0; f < frameCount; f++) {
        await exchange([2, reqId++, 'e', 'scene', start + f, f, WIDTH, HEIGHT, frameCount, false]);
      }

      let totalRenderUs = 0;
      let totalKernelCalls = 0;
      let totalCopyBytes = 0;
      let hash0 = '';
      let hashLast = '';
      const t0 = performance.now();
      for (let r = 0; r < ROUNDS; r++) {
        for (let f = 0; f < frameCount; f++) {
          const rep = await exchange([
            2,
            reqId++,
            'e',
            'scene',
            start + f,
            f,
            WIDTH,
            HEIGHT,
            frameCount,
            false,
          ]);
          // repFrameReady: [0, id, entry, pixels, rendered, disk, ram, renderMicros, kernelCalls, copyBytes, ...]
          totalRenderUs += rep[7];
          totalKernelCalls += rep[8];
          totalCopyBytes += rep[9];
          if (r === ROUNDS - 1 && f === 0) hash0 = hashBytes(rep[3]);
          if (r === ROUNDS - 1 && f === frameCount - 1) hashLast = hashBytes(rep[3]);
        }
      }
      const wallUs = (performance.now() - t0) * 1000;
      const n = ROUNDS * frameCount;
      if (useWasm) {
        assert.ok(totalKernelCalls > 0, `JS worker wasm=true had 0 kernelCalls on ${fx.name}`);
      } else {
        assert.equal(totalKernelCalls, 0, `JS worker wasm=false had non-zero kernelCalls on ${fx.name}`);
      }
      results.push({
        name: fx.name,
        frames: frameCount,
        renderUsPerFrame: totalRenderUs / n,
        wallUsPerFrame: wallUs / n,
        kernelCallsPerFrame: totalKernelCalls / n,
        copyBytesPerFrame: totalCopyBytes / n,
        hash0,
        hashLast,
      });
    } finally {
      await worker.terminate();
    }
  }
  return { runtime: useWasm ? 'js_worker_cwasm' : 'js_worker_dart_fallback', results };
}

async function main() {
  const fixtures = loadFixtures();
  const dart2wasm = await runDart2WasmBench(fixtures);
  const jsWasm = await runJsWorkerBench(fixtures, true);
  const jsFallback = await runJsWorkerBench(fixtures, false);

  // Verify 3-way pixel checksum parity across ALL runtimes!
  for (let i = 0; i < fixtures.length; i++) {
    const a = dart2wasm.results[i];
    const b = jsWasm.results[i];
    const c = jsFallback.results[i];
    assert.equal(b.hash0, c.hash0, `hash0 mismatch wasm vs fallback on ${a.name}`);
    assert.equal(b.hashLast, c.hashLast, `hashLast mismatch wasm vs fallback on ${a.name}`);
    assert.equal(a.hash0, b.hash0, `hash0 mismatch dart2wasm vs js_worker on ${a.name}`);
    assert.equal(a.hashLast, b.hashLast, `hashLast mismatch dart2wasm vs js_worker on ${a.name}`);
  }

  console.log('\n=== Suite 1: Dart WasmGC (dart2wasm) Inline (256x256, realistic TFA) ===');
  console.log(
    'Fixture'.padEnd(26) +
    'Render(us/f)'.padStart(14) +
    'Store(us)'.padStart(12) +
    'Hit(us)'.padStart(10) +
    'LZ4(B)'.padStart(10) +
    '  HashLast',
  );
  for (const r of dart2wasm.results) {
    console.log(
      r.name.padEnd(26) +
      r.renderUsPerFrame.toFixed(1).padStart(14) +
      r.storeUsPerFrame.toFixed(1).padStart(12) +
      r.readUsPerFrame.toFixed(1).padStart(10) +
      String(r.compressedBytes).padStart(10) +
      `  0x${r.hashLast}`,
    );
  }

  console.log('\n=== Suite 2: JS Web Worker C-Wasm vs Dart Fallback (256x256) ===');
  console.log(
    'Fixture'.padEnd(26) +
    'WasmRnd(us)'.padStart(13) +
    'DartRnd(us)'.padStart(13) +
    'Speedup'.padStart(9) +
    'WasmWall'.padStart(11) +
    'Calls/f'.padStart(9) +
    '  HashLast',
  );
  for (let i = 0; i < fixtures.length; i++) {
    const w = jsWasm.results[i];
    const d = jsFallback.results[i];
    const ratio = w.renderUsPerFrame > 0 ? d.renderUsPerFrame / w.renderUsPerFrame : 0;
    console.log(
      w.name.padEnd(26) +
      w.renderUsPerFrame.toFixed(1).padStart(13) +
      d.renderUsPerFrame.toFixed(1).padStart(13) +
      `${ratio.toFixed(2)}x`.padStart(9) +
      w.wallUsPerFrame.toFixed(1).padStart(11) +
      w.kernelCallsPerFrame.toFixed(1).padStart(9) +
      `  0x${w.hashLast}`,
    );
  }
  console.log('\n3-way pixel checksum parity verified (dart2wasm === js_worker_cwasm === js_worker_dart_fallback).');
  if (process.argv.includes('--json')) {
    console.log('JSON_REPORT=' + JSON.stringify({ dart2wasm, jsWasm, jsFallback }));
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
