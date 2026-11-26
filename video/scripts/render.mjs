#!/usr/bin/env node
/**
 * Zero-dependency 1080p 60fps lossless Canvas -> FFmpeg video renderer & preview server.
 *
 * Usage:
 *   node scripts/render.mjs --cut=intro     -> out/fastlottie_intro.mp4 (55s, 1080p 60fps)
 *   node scripts/render.mjs --cut=teaser    -> out/fastlottie_teaser_15s.mp4 (15s, 1080p 60fps)
 *   node scripts/render.mjs --preview       -> starts interactive browser studio on localhost
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const isPreview = args.includes('--preview');
const cutArg = (args.find((a) => a.startsWith('--cut=')) || '--cut=intro').split('=')[1];

const CUTS = {
  intro: {
    fps: 60,
    durationSec: 68,
    totalFrames: 68 * 60,
    audio: path.join(ROOT, 'public/audio/soundtrack_55s.wav'),
    out: path.join(ROOT, 'out/fastlottie_intro.mp4'),
  },
  teaser: {
    fps: 60,
    durationSec: 18,
    totalFrames: 18 * 60,
    audio: path.join(ROOT, 'public/audio/soundtrack_15s.wav'),
    out: path.join(ROOT, 'out/fastlottie_teaser_15s.mp4'),
  },
  hello: {
    fps: 60,
    durationSec: 6.8,
    totalFrames: Math.round(6.8 * 60),
    audio: path.join(ROOT, 'public/audio/soundtrack_hello_6_8s.wav'),
    out: path.join(ROOT, 'out/fastlottie_hello.mp4'),
  },
  fastlottie: {
    fps: 60,
    durationSec: 8.2,
    totalFrames: Math.round(8.2 * 60),
    audio: path.join(ROOT, 'public/audio/soundtrack_fastlottie_8_2s.wav'),
    out: path.join(ROOT, 'out/fastlottie_wordmark.mp4'),
  },
};

const cut = CUTS[cutArg];
if (!cut) {
  console.error(`Unknown cut "${cutArg}". Use --cut=intro, --cut=teaser, --cut=hello, or --cut=fastlottie`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.wav': 'audio/wav',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

function serveStatic(reqPath, res) {
  const clean = reqPath === '/' ? '/index.html' : reqPath.split('?')[0];
  const full = path.resolve(ROOT, '.' + clean);
  if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(full);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(full).pipe(res);
}

let ff = null;
let chrome = null;
let framesReceived = 0;
let startTime = Date.now();
let resolveDone;
const donePromise = new Promise((r) => {
  resolveDone = r;
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'POST' && url.pathname === '/frame') {
    const chunks = [];
    for await (const ch of req) chunks.push(ch);
    const buf = Buffer.concat(chunks);
    if (ff && ff.stdin.writable) {
      if (!ff.stdin.write(buf)) {
        await once(ff.stdin, 'drain');
      }
    }
    framesReceived++;
    if (framesReceived % 180 === 0 || framesReceived === cut.totalFrames) {
      const elapsed = (Date.now() - startTime) / 1000;
      const fps = framesReceived / Math.max(0.01, elapsed);
      const pct = ((framesReceived / cut.totalFrames) * 100).toFixed(1);
      console.log(
        `  [${cutArg}] ${framesReceived}/${cut.totalFrames} (${pct}%) — ${fps.toFixed(1)} render fps (${elapsed.toFixed(1)}s)`
      );
    }
    res.writeHead(200);
    res.end('ok');
    return;
  }
  if (req.method === 'POST' && url.pathname === '/done') {
    res.writeHead(200);
    res.end('bye');
    resolveDone();
    return;
  }
  if (req.method === 'POST' && url.pathname === '/error') {
    const chunks = [];
    for await (const ch of req) chunks.push(ch);
    console.error('BROWSER ERROR:', Buffer.concat(chunks).toString('utf8'));
    res.writeHead(200);
    res.end('logged');
    process.exit(1);
  }
  serveStatic(url.pathname, res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

if (isPreview) {
  console.log(`\nFastLottie Video Studio running at ${baseUrl}/?cut=${cutArg}`);
  console.log('Press Ctrl+C to stop.\n');
} else {
  fs.mkdirSync(path.dirname(cut.out), { recursive: true });
  console.log(`\nRendering "${cutArg}" (${cut.totalFrames} frames @ ${cut.fps}fps, 1920x1080) -> ${cut.out}`);

  const ffArgs = [
    '-y',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', '1920x1080',
    '-r', String(cut.fps),
    '-i', 'pipe:0',
    '-i', cut.audio,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-tune', 'film',
    '-crf', '19',
    '-maxrate', '12M',
    '-bufsize', '24M',
    '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709',
    '-color_trc', 'bt709',
    '-colorspace', 'bt709',
    '-c:a', 'aac',
    '-b:a', '256k',
    '-shortest',
    '-movflags', '+faststart',
    cut.out,
  ];
  ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffStderr = '';
  ff.stderr.on('data', (d) => {
    ffStderr += d.toString();
  });

  const chromeBin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const profileDir = `/tmp/fastlottie_video_chrome_${process.pid}`;
  fs.mkdirSync(profileDir, { recursive: true });
  startTime = Date.now();
  chrome = spawn(
    chromeBin,
    [
      '--headless=new',
      '--window-size=1920,1080',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      `--user-data-dir=${profileDir}`,
      `${baseUrl}/?render=1&cut=${cutArg}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );
  chrome.stderr.on('data', (d) => {
    const s = d.toString();
    if (s.includes('CONSOLE') || s.includes('ERROR') || s.includes('Uncaught')) {
      process.stderr.write(s);
    }
  });

  await donePromise;
  ff.stdin.end();
  const [ffCode] = await once(ff, 'close');
  chrome.kill('SIGTERM');
  await Promise.race([once(chrome, 'close'), new Promise((r) => setTimeout(r, 1200))]);
  try {
    fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 80 });
  } catch {}
  server.close();

  if (ffCode !== 0) {
    console.error(`FFmpeg exited with code ${ffCode}:\n${ffStderr.slice(-2000)}`);
    process.exit(ffCode);
  }
  const stat = fs.statSync(cut.out);
  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Done! ${cut.out} (${(stat.size / 1024 / 1024).toFixed(2)} MiB) in ${totalSec}s`);
}
