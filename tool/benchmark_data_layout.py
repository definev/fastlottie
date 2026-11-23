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

KEY_OBJECT_DRIVER = r'''
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
'''

PACKED_TRACK_DRIVER = r'''
Object makeTrack(int width, int count, bool simd) {
  final stride = simd && width >= 32 ? (width + 3) & ~3 : width;
  final times = Float64List(count);
  final metadata = Int32List(count * 3);
  final values = Float32List((count + (count + 1) ~/ 2) * stride);
  final easing = Float64List((count - (count + 2) ~/ 3) * 4);
  var endIndex = count, easeIndex = 0;
  for (var k = 0; k < count; k++) {
    times[k] = k * 3.25;
    final hasEnd = k.isEven, hasEase = k % 3 != 0;
    metadata[k] = (k % 5 == 2 ? _Keyframes.holdFlag : 0) |
        (hasEnd ? _Keyframes.endFlag : 0) |
        (hasEase ? 1 << 4 : _Keyframes.linearFlag);
    final endOffset = (hasEnd ? endIndex++ : math.min(k + 1, count - 1)) * stride;
    metadata[count + k] = endOffset;
    metadata[2 * count + k] = easeIndex;
    if (hasEase) {
      easing[easeIndex++] = .42;
      easing[easeIndex++] = 0;
      easing[easeIndex++] = .58;
      easing[easeIndex++] = 1;
    }
    for (var c = 0; c < width; c++) {
      values[k * stride + c] = (k * 13 + c * 7) % 101 / 100.0;
      if (hasEnd) values[endOffset + c] = (k * 17 + c * 3) % 101 / 100.0;
    }
  }
  return _Track.animated(_Keyframes(
    times, width, stride, metadata, values,
    easing, null, simd,
  ), simd);
}
'''

TRACK_DRIVER = r'''
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
    src = root / 'lib/src'
    if kernel == 'track':
        track = src / 'scene/track.dart'
        source = track.read_text() if track.exists() else (src / 'track.dart').read_text()
        source = ''.join(line for line in source.splitlines(keepends=True)
                         if not line.startswith(('import ', 'part of ')))
        driver = (KEY_OBJECT_DRIVER if 'class _Key {' in source else PACKED_TRACK_DRIVER) + TRACK_DRIVER
        if 'class Track {' in source:
            driver = driver.replace('_Keyframes', 'Keyframes').replace('_Track', 'Track')
    else:
        raster = src / 'raster' if (src / 'raster').is_dir() else src
        geometry_path = raster / 'raster_geometry.dart'
        if geometry_path.exists():
            geometry = geometry_path.read_text()
            paths = (raster / 'path_flattening.dart').read_text()
            poly = geometry[geometry.index('class PolyPath {' if raster != src else 'class _PolyPath {'):]
            scratch = geometry[geometry.index('class Float64Scratch {' if raster != src else 'class _Float64Scratch {'):
                               geometry.index('/// Struct-of-arrays polyline')]
            stroke = paths[paths.index('class _StrokeScratch {'):]
        else:
            geometry = (src / 'rle_rasterizer.dart').read_text()
            poly_end = geometry.find('typedef _CoverageKey')
            if poly_end < 0:
                poly_end = geometry.index('class _RleSpans {')
            poly = geometry[geometry.index('class _PolyPath {'):poly_end]
            scratch_start = geometry.find('class _Float64Scratch {')
            scratch = ''
            if scratch_start >= 0:
                scratch_end = geometry.find('class _StaticTrimMetrics {')
                if scratch_end < 0:
                    scratch_end = geometry.index('/// Struct-of-arrays polyline')
                scratch = geometry[scratch_start:scratch_end]
            stroke_start = geometry.find('class _StrokeScratch {')
            if stroke_start < 0:
                stroke_start = geometry.index('void _expandStroke(')
            stroke = geometry[stroke_start:geometry.index('/// Deterministic content key')]
        packed = 'class _StrokeScratch {' in stroke
        source = poly + scratch + stroke + '\ndouble _hypot(double x, double y) => math.sqrt(x*x+y*y);\n'
        if 'expandStrokeNative(' in stroke:
            adapters = src / 'platform' if (src / 'platform').is_dir() else src
            stub = (adapters / 'geometry_kernel_stub.dart').read_text()
            source += stub[stub.index('const nativeStrokePointLimit'):]
        driver = STROKE_DRIVER.replace(' STROKE_PARAMETER', ', _StrokeScratch scratch' if packed else '')
        driver = driver.replace(' STROKE_ARGUMENT', ', scratch' if packed else '')
        driver = driver.replace('STROKE_LOCAL', 'final scratch = _StrokeScratch();' if packed else '')
        if raster != src:
            driver = driver.replace('_PolyPath', 'PolyPath')
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
