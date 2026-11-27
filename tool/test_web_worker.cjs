// Run from the repository root: node tool/test_web_worker.cjs [baseline-worker.js]
// Runs the bundled browser worker with real transferable buffers and C Wasm.
const assert = require('node:assert/strict');
const fs = require('node:fs');
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

const WORKER_VERSION = 5;
const WORKER_ASSET = 'lib/src/wasm/fastlottie_worker_v5.js';
const WASM_ASSET = 'lib/src/wasm/fastlottie_simd_v2.wasm';

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
    const ready = await exchange([-1, WORKER_VERSION, `data:application/wasm;base64,${wasm}`]);
    assert.deepEqual(ready, [-2, WORKER_VERSION, expectedWasm]);

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

async function testVersionAndAbiMismatch(asset, expectedPixels) {
  // 1. Outdated host handshake version must be rejected immediately.
  const { worker, exchange } = startWorker(asset);
  try {
    const wasm = fs.readFileSync(WASM_ASSET).toString('base64');
    const failed = await exchange([-1, WORKER_VERSION - 1, `data:application/wasm;base64,${wasm}`]);
    assert.equal(failed[0], -3);
  } finally {
    await worker.terminate();
  }

  // 2. Incompatible Wasm module (missing ABI version / v2 exports) must fall
  // back cleanly to Dart rasterization and match the Wasm pixel output.
  const emptyWasm = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
  const fallback = await smoke(asset, emptyWasm, false);
  assert.deepEqual(fallback, expectedPixels);
}

async function main() {
  const asset = path.resolve(WORKER_ASSET);
  const actual = await smoke(asset);
  await testVersionAndAbiMismatch(asset, actual);
  const baseline = process.argv[2];
  if (baseline) assert.deepEqual(actual, await smoke(path.resolve(baseline)));
  console.log('Browser worker protocol, ABI fallback, and frame/strip pixel checks passed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
