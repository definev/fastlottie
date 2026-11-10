#!/usr/bin/env python3
"""AOT microbenchmark of the actual private track/stroke kernels (no Flutter).

Extracts implementations verbatim, adds a deterministic driver, and compiles it
with the installed Dart SDK. --reference points at an unmodified source snapshot.
The checksum guards semantics across layouts. This measures kernels, not FPS.
"""
import argparse
import hashlib
import json
import platform
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TRACK_DRIVER = r'''
Object makeTrack(int width, int count, bool simd) {
  final keys = <_Key>[];
  for (var k = 0; k < count; k++) {
    final start = Float32List.fromList([
      for (var c = 0; c < width; c++) (k * 13 + c * 7) % 101 / 100.0,
    ]);
    final end = k.isEven ? Float32List.fromList([
      for (var c = 0; c < width; c++) (k * 17 + c * 3) % 101 / 100.0,
    ]) : null;
    keys.add(_Key(k * 3.25, start, end, k % 5 == 2,
      [if (k % 3 != 0) _Ease(.42, 0, .58, 1)]));
  }
  return _Track.animated(keys, simd);
}

double trackBatch(List<Object> tracks, int rounds) {
  var checksum = 0.0;
  for (var r = 0; r < rounds; r++) {
    // Exercise forward playback, wraparound, backwards seeks and endpoints.
    final frame = ((r * 37) % 41 - 4) * .83;
    for (final value in tracks) {
      final track = value as _Track;
      final out = track.at(frame);
      checksum += out[r % out.length];
    }
  }
  return checksum;
}

void main(List<String> args) {
  if (args.isNotEmpty && args[0] == 'memory') {
    final tracks = [for (var i = 0; i < 100000; i++) makeTrack(3, 8, false)];
    // The full list stays alive through an allocating playback pass.
    final checksum = trackBatch(tracks, 2);
    print(jsonEncode({'tracks': tracks.length, 'checksum': checksum,
      'rss_bytes': ProcessInfo.currentRss}));
    return;
  }
  final result = <String, Object>{};
  for (final spec in [(1, 8, false), (3, 8, false), (42, 8, false),
      (42, 8, true), (768, 8, true)]) {
    final tracks = [for (var i = 0; i < 256; i++) makeTrack(spec.$1, spec.$2, spec.$3)];
    trackBatch(tracks, 1024);
    final samples = <double>[];
    var checksum = 0.0;
    for (var sample = 0; sample < 15; sample++) {
      final watch = Stopwatch()..start();
      checksum = trackBatch(tracks, 4096);
      samples.add(watch.elapsedMicroseconds / (4096 * tracks.length));
    }
    samples.sort();
    result['track_${spec.$1}_${spec.$3 ? "simd" : "scalar"}'] = {
      'median_us': samples[7], 'p95_us': samples[14], 'checksum': checksum,
      'samples': samples,
    };
  }
  print(jsonEncode(result));
}
'''

STROKE_DRIVER = r'''
double strokeBatch(_PolyPath src, _PolyPath dst, int rounds STROKE_PARAMETER) {
  var checksum = 0.0;
  for (var r = 0; r < rounds; r++) {
    dst.clear();
    _expandStroke(src, 2.0 + r % 3, 1 + r % 3, 1 + r % 3, 4, .25,
      dst STROKE_ARGUMENT);
    for (var i = 0; i < dst.vertexCount; i++) {
      checksum += dst.vx[i] + dst.vy[i];
    }
  }
  return checksum;
}

void main() {
  final src = _PolyPath(initialVertices: 1024, initialContours: 64);
  final dst = _PolyPath(initialVertices: 4096, initialContours: 128);
  for (var c = 0; c < 64; c++) {
    src.beginContour(c.isEven);
    for (var v = 0; v < 7 + c % 9; v++) {
      src.addVertex(c * 4 + math.cos(v * .8) * 20,
        c * 3 + math.sin(v * .8) * 20);
    }
    src.endContour();
  }
  STROKE_LOCAL
  strokeBatch(src, dst, 4096 STROKE_ARGUMENT);
  final samples = <double>[];
  var checksum = 0.0;
  for (var sample = 0; sample < 15; sample++) {
    final watch = Stopwatch()..start();
    checksum = strokeBatch(src, dst, 4096 STROKE_ARGUMENT);
    samples.add(watch.elapsedMicroseconds / 4096);
  }
  samples.sort();
  print(jsonEncode({'stroke': {'median_us': samples[7], 'p95_us': samples[14],
    'checksum': checksum, 'samples': samples}}));
}
'''


def extract(root, kernel):
    if kernel == 'track':
        source = (root / 'lib/src/track.dart').read_text().split('\n', 1)[1]
        driver = TRACK_DRIVER
    else:
        source = (root / 'lib/src/rle_rasterizer.dart').read_text()
        poly = source[source.index('class _PolyPath {'):source.index('class _RleSpans {')]
        scratch = source[source.index('class _Float64Scratch {'):source.index('class _StaticTrimMetrics {')]
        start = source.find('class _StrokeScratch {')
        packed = start >= 0
        if not packed:
            start = source.index('void _expandStroke(')
        stroke = source[start:source.index('/// Deterministic content key')]
        source = poly + scratch + stroke + '\ndouble _hypot(double x, double y) => math.sqrt(x*x+y*y);\n'
        driver = STROKE_DRIVER.replace(' STROKE_PARAMETER', ', _StrokeScratch scratch' if packed else '')
        driver = driver.replace(' STROKE_ARGUMENT', ', scratch' if packed else '')
        driver = driver.replace('STROKE_LOCAL', 'final scratch = _StrokeScratch();' if packed else '')
    return "import 'dart:math' as math;\nimport 'dart:typed_data';\nimport 'dart:convert';\nimport 'dart:io';\n" + source + driver


def run(root, tmp):
    result = {}
    digest = hashlib.sha256()
    for kernel in ['track', 'stroke']:
        source = extract(root, kernel)
        digest.update(source.encode())
        dart = tmp / f'{kernel}.dart'
        binary = tmp / kernel
        dart.write_text(source)
        subprocess.run(['dart', 'compile', 'exe', str(dart), '-o', str(binary)],
                       check=True, stdout=subprocess.DEVNULL)
        result.update(json.loads(subprocess.check_output([str(binary)], text=True)))
        if kernel == 'track':
            result['memory'] = [json.loads(subprocess.check_output([str(binary), 'memory'], text=True))
                                for _ in range(3)]
    result['extracted_source_sha256'] = digest.hexdigest()
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--reference', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--candidate', type=Path, default=ROOT)
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='fastlottie-layout-') as directory:
        tmp = Path(directory)
        result = {'scope': 'Dart AOT kernels; RSS includes VM and allocator overhead',
                  'platform': platform.platform(),
                  'workload': '256 tracks, 8 keys, mixed holds/explicit ends/easing, repeated seeks; 64 stroke contours',
                  'dart': subprocess.check_output(['dart', '--version'], text=True).strip()}
        result['before'] = run(args.reference.resolve(), tmp)
        result['after'] = run(args.candidate.resolve(), tmp)
        for name in result['before']:
            if name in ['memory', 'extracted_source_sha256']:
                continue
            before = result['before'][name]['checksum']
            after = result['after'][name]['checksum']
            if before != after:
                raise SystemExit(f'{name}: checksum mismatch {before} != {after}')
        result['checksums_match'] = True
        args.output.write_text(json.dumps(result, indent=2) + '\n')
        print(f'Saved {args.output}')


if __name__ == '__main__':
    main()
