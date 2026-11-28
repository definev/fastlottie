// Run from the repository root:
//   node tool/test_web_worker.cjs [--bundled | --worker <path>] [--baseline <path>]
// By default compiles tool/web_worker_main.dart into a temp directory so feature
// PRs verify live JS worker behavior without committing noisy minified JS diffs.
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const bridge = `
  const { parentPort, workerData } = require('node:worker_threads');
  globalThis.self = globalThis;
  globalThis.postMessage = (message, transfer) => parentPort.postMessage(message, transfer);
  globalThis.close = () => parentPort.close();
  require(workerData);
  parentPort.on('message', data => self.onmessage({ data }));
`;

const WORKER_ASSET = 'lib/src/wasm/fastlottie_worker.js';
const WASM_ASSET = 'lib/src/wasm/fastlottie_simd.wasm';

function startWorker(asset) {
  const worker = new Worker(bridge, { eval: true, workerData: asset });
  function exchange(...messages) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        finish(reject, new Error('Timed out waiting for a worker reply'));
      }, 5000);
      const onMessage = message => finish(resolve, message);
      const onError = error => finish(reject, error);
      function finish(callback, value) {
        clearTimeout(timeout);
        worker.off('message', onMessage);
        worker.off('error', onError);
        callback(value);
      }
      worker.once('message', onMessage);
      worker.once('error', onError);
      for (const message of messages) worker.postMessage(message);
    });
  }
  return { worker, exchange };
}

async function smoke(asset, wasmBytes = fs.readFileSync(WASM_ASSET), expectedWasm = true) {
  const { worker, exchange } = startWorker(asset);

  try {
    const wasm = wasmBytes.toString('base64');
    const ready = await exchange([-1, `data:application/wasm;base64,${wasm}`]);
    assert.deepEqual(ready, [-2, expectedWasm]);

    const width = 32;
    const height = 24;
    const frameBytes = width * height * 4;
    const rowBytes = width * 4;
    const icon = new Uint8Array(fs.readFileSync('test/fixtures/icon.json'));
    const frameRequest = [2, 101, 'entry', 'scene', 2, 2, width, height, 60, false];
    const frame = await exchange([0, null, 1048576, true], [1, 'scene', icon, true], frameRequest);
    assert.deepEqual(frame.slice(0, 3), [0, 101, 'entry']);
    assert.equal(frame[3].length, frameBytes);
    assert.ok(frame[3].some(byte => byte !== 0), 'The rendered frame is empty');
    assert.ok(frame[11] !== 0 || frame[12] !== 0, 'Expected non-zero 64-bit frame fingerprint');

    // Render a larger opaque frame first so the worker's reusable pixel buffer
    // holds non-zero bytes where the subsequent strip's padding rows will sit.
    const dirty = await exchange([2, 100, 'dirty', 'scene', 2, 2, width, height * 3 + 2, 60, false]);
    assert.ok(dirty[3].some(byte => byte !== 0));

    const strip = await exchange([5, 102, 'entry', 'scene', 1, 3, 0, 1, width, height, 60, false]);
    const stripHeight = height * 3 + 2;
    assert.deepEqual(strip.slice(0, 5), [4, 102, 'entry', 1, 3]);
    assert.deepEqual(strip.slice(10, 12), [width, stripHeight]);
    assert.equal(strip[5].length, rowBytes * stripHeight);
    assert.ok(strip[16] !== 0 || strip[17] !== 0, 'Expected non-zero 64-bit strip fingerprint');
    const secondSlot = frameBytes + rowBytes;
    assert.deepEqual(strip[5].subarray(secondSlot, secondSlot + frameBytes), frame[3]);
    // Verify 1px transparent gutter rows between adjacent slots are zeroed.
    for (let j = 1; j < 3; j++) {
      const padStart = (j * (height + 1) - 1) * rowBytes;
      const padRow = strip[5].subarray(padStart, padStart + rowBytes);
      assert.ok(padRow.every(byte => byte === 0), `Padding row ${j} must be transparent`);
    }

    // Disabling upload deduplication suppresses worker fingerprints.
    const noFp = await exchange(
      [0, null, 1048576, false],
      [5, 103, 'entry', 'scene', 1, 3, 0, 1, width, height, 60, false],
    );
    assert.equal(noFp[16], 0);
    assert.equal(noFp[17], 0);

    assert.deepEqual(await exchange([4]), [2, '', 0]);
    assert.deepEqual(await exchange(frameRequest), [3, 101, 'scene']);
    return [frame[3], strip[5]];
  } finally {
    await worker.terminate();
  }
}

async function testInvalidInitAndAbiFallback(asset, expectedPixels) {
  // 1. Invalid worker init message must be rejected cleanly.
  const { worker, exchange } = startWorker(asset);
  try {
    const wasm = fs.readFileSync(WASM_ASSET).toString('base64');
    const failed = await exchange([-99, `data:application/wasm;base64,${wasm}`]);
    assert.equal(failed[0], -3);
  } finally {
    await worker.terminate();
  }

  // 2. Incompatible Wasm module (missing required exports) must fall
  // back cleanly to Dart rasterization and match the Wasm pixel output.
  const emptyWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
  const fallback = await smoke(asset, emptyWasm, false);
  assert.deepEqual(fallback, expectedPixels);
}

function makeRectLayer(ind, x, y, w, h, rgba, opacity, extra = {}) {
  return {
    ty: 4,
    ind,
    ip: 0,
    op: 10,
    st: 0,
    ks: { o: { a: 0, k: opacity } },
    shapes: [
      {
        ty: 'gr',
        it: [
          { ty: 'rc', p: { a: 0, k: [x, y] }, s: { a: 0, k: [w, h] }, r: { a: 0, k: 0 } },
          { ty: 'fl', c: { a: 0, k: rgba }, o: { a: 0, k: 100 } },
        ],
      },
    ],
    ...extra,
  };
}

function buildMatteScene(tt) {
  return Buffer.from(JSON.stringify({
    v: '5.7.0',
    fr: 30,
    ip: 0,
    op: 5,
    w: 64,
    h: 64,
    layers: [
      makeRectLayer(1, 32, 32, 44, 44, [0.9, 0.6, 0.2, 1.0], 85, { td: 1 }),
      makeRectLayer(2, 26, 26, 48, 48, [0.15, 0.55, 0.95, 1.0], 90, { tt }),
      makeRectLayer(3, 32, 32, 64, 64, [0.2, 0.2, 0.25, 1.0], 100),
    ],
  }));
}

function buildBlendScene(bm) {
  // Two-shape top layer forces isolated layer plane -> exercises fastlottie_blend_rect;
  // single-shape middle layer exercises fastlottie_blend_solid_v2.
  return Buffer.from(JSON.stringify({
    v: '5.7.0',
    fr: 30,
    ip: 0,
    op: 5,
    w: 64,
    h: 64,
    layers: [
      {
        ty: 4,
        ind: 1,
        ip: 0,
        op: 5,
        st: 0,
        bm,
        ks: { o: { a: 0, k: 82 } },
        shapes: [
          {
            ty: 'gr',
            it: [
              { ty: 'rc', p: { a: 0, k: [28, 28] }, s: { a: 0, k: [36, 36] }, r: { a: 0, k: 0 } },
              { ty: 'fl', c: { a: 0, k: [0.85, 0.35, 0.2, 1.0] }, o: { a: 0, k: 100 } },
            ],
          },
          {
            ty: 'gr',
            it: [
              { ty: 'el', p: { a: 0, k: [38, 38] }, s: { a: 0, k: [28, 28] } },
              { ty: 'fl', c: { a: 0, k: [0.2, 0.75, 0.55, 1.0] }, o: { a: 0, k: 75 } },
            ],
          },
        ],
      },
      makeRectLayer(2, 34, 30, 42, 42, [0.3, 0.45, 0.9, 1.0], 70, { bm }),
      makeRectLayer(3, 32, 32, 60, 60, [0.45, 0.55, 0.65, 1.0], 100),
    ],
  }));
}

async function renderSceneWithWorker(asset, wasmBytes, expectedWasm, scenes) {
  const { worker, exchange } = startWorker(asset);
  try {
    const ready = await exchange([
      -1,
      `data:application/wasm;base64,${wasmBytes.toString('base64')}`,
    ]);
    assert.deepEqual(ready, [-2, expectedWasm]);

    const results = [];
    let reqId = 500;
    let configured = false;
    for (const [name, bytes, w, h, frame] of scenes) {
      const msgs = [];
      if (!configured) {
        msgs.push([0, null, 0, false]);
        configured = true;
      }
      msgs.push([1, name, new Uint8Array(bytes), true]);
      msgs.push([2, reqId++, `e_${name}`, name, frame, frame, w, h, 30, false]);
      const rep = await exchange(...msgs);
      assert.equal(rep[0], 0, `${name} render failed: ${JSON.stringify(rep)}`);
      const kernelCalls = rep[8];
      if (expectedWasm) {
        assert.ok(kernelCalls > 0, `${name} expected Wasm kernelCalls > 0, got ${kernelCalls}`);
      } else {
        assert.equal(kernelCalls, 0, `${name} fallback expected kernelCalls == 0, got ${kernelCalls}`);
      }
      results.push([name, Buffer.from(rep[3]), kernelCalls]);
    }
    return results;
  } finally {
    await worker.terminate();
  }
}

async function testWasmKernelParity(asset) {
  const scenes = [
    ['icon', fs.readFileSync('test/fixtures/icon.json'), 64, 64, 5],
    ['features', fs.readFileSync('test/fixtures/features.json'), 64, 64, 5],
    ['many_shapes', fs.readFileSync('test/fixtures/many_shapes.json'), 64, 64, 5],
    ['morph', fs.readFileSync('test/fixtures/morph.json'), 64, 64, 15],
  ];
  for (const tt of [1, 2, 3, 4]) {
    scenes.push([`matte_tt${tt}`, buildMatteScene(tt), 64, 64, 0]);
  }
  for (let bm = 0; bm <= 16; bm++) {
    scenes.push([`blend_bm${bm}`, buildBlendScene(bm), 64, 64, 0]);
  }
  const wasmBytes = fs.readFileSync(WASM_ASSET);
  const emptyWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
  const wasmOut = await renderSceneWithWorker(asset, wasmBytes, true, scenes);
  const dartOut = await renderSceneWithWorker(asset, emptyWasm, false, scenes);
  for (let i = 0; i < scenes.length; i++) {
    const [name, wasmPx] = wasmOut[i];
    const [, dartPx] = dartOut[i];
    assert.ok(wasmPx.some(b => b !== 0), `${name} rendered empty`);
    assert.deepEqual(wasmPx, dartPx, `C-Wasm vs Dart pixel mismatch on ${name}`);
  }
}

function parseArgs(argv) {
  let bundled = false;
  let workerPath = null;
  let baseline = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--bundled') {
      bundled = true;
    } else if (arg === '--worker') {
      workerPath = argv[++i];
      if (!workerPath) throw new Error('Missing value for --worker');
    } else if (arg === '--baseline') {
      baseline = argv[++i];
      if (!baseline) throw new Error('Missing value for --baseline');
    } else if (!arg.startsWith('-') && baseline == null) {
      baseline = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return { bundled, workerPath, baseline };
}

function buildTempWorker() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fastlottie-worker-test-'));
  const output = path.join(dir, 'worker.js');
  try {
    execFileSync(
      'dart',
      ['run', 'tool/build_web_worker.dart', '--output', output],
      { stdio: ['ignore', 'pipe', 'inherit'] },
    );
    return { dir, output };
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}

async function main() {
  const { bundled, workerPath, baseline } = parseArgs(process.argv.slice(2));
  let tempBuild = null;
  const asset = workerPath
    ? path.resolve(workerPath)
    : bundled
      ? path.resolve(WORKER_ASSET)
      : (tempBuild = buildTempWorker()).output;
  try {
    const actual = await smoke(asset);
    await testInvalidInitAndAbiFallback(asset, actual);
    await testWasmKernelParity(asset);
    if (baseline) assert.deepEqual(actual, await smoke(path.resolve(baseline)));
    console.log('Browser worker protocol, ABI fallback, C-Wasm SIMD/matte/blend parity, and frame/strip pixel checks passed.');
  } finally {
    if (tempBuild) fs.rmSync(tempBuild.dir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
