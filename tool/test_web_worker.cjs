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

async function smoke(asset) {
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

  try {
    const wasm = fs.readFileSync('lib/src/wasm/fastlottie_simd.wasm').toString('base64');
    const ready = await exchange([-1, 3, `data:application/wasm;base64,${wasm}`]);
    assert.deepEqual(ready, [-2, 3, true]);

    const width = 32;
    const height = 24;
    const frameBytes = width * height * 4;
    const rowBytes = width * 4;
    const icon = new Uint8Array(fs.readFileSync('example/assets/icon.json'));
    const frameRequest = [2, 101, 'entry', 'scene', 2, 2, width, height, 60, false];
    const frame = await exchange([0, null, 1048576], [1, 'scene', icon, true], frameRequest);
    assert.deepEqual(frame.slice(0, 3), [0, 101, 'entry']);
    assert.equal(frame[3].length, frameBytes);
    assert.ok(frame[3].some(byte => byte !== 0), 'The rendered frame is empty');

    const strip = await exchange([5, 102, 'entry', 'scene', 1, 3, 0, 1, width, height, 60, false]);
    const stripHeight = height * 3 + 2;
    assert.deepEqual(strip.slice(0, 5), [4, 102, 'entry', 1, 3]);
    assert.deepEqual(strip.slice(10, 12), [width, stripHeight]);
    assert.equal(strip[5].length, rowBytes * stripHeight);
    const secondSlot = frameBytes + rowBytes;
    assert.deepEqual(strip[5].subarray(secondSlot, secondSlot + frameBytes), frame[3]);

    assert.deepEqual(await exchange([4]), [2, '', 0]);
    assert.deepEqual(await exchange(frameRequest), [3, 101, 'scene']);
    return [frame[3], strip[5]];
  } finally {
    await worker.terminate();
  }
}

async function main() {
  const actual = await smoke(path.resolve('lib/src/wasm/fastlottie_worker.js'));
  const baseline = process.argv[2];
  if (baseline) assert.deepEqual(actual, await smoke(path.resolve(baseline)));
  console.log('Browser worker protocol and frame/strip pixel checks passed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
