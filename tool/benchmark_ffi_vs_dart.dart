// ignore_for_file: avoid_print
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:fastlottie/decoding.dart';
import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/platform/geometry_kernel_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/geometry_kernel_io.dart';
import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/platform/simd_io.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/scene/options.dart';

const _useNativeBezierFlag = bool.fromEnvironment(
  'FASTLOTTIE_NATIVE_BEZIER',
  defaultValue: true,
);

final class _FixtureSpec {
  const _FixtureSpec(this.name, this.path);
  final String name;
  final String path;
}

const _fixtures = <_FixtureSpec>[
  _FixtureSpec('icon', 'test/fixtures/icon.json'),
  _FixtureSpec('features', 'test/fixtures/features.json'),
  _FixtureSpec('many_shapes', 'test/fixtures/many_shapes.json'),
  _FixtureSpec('morph', 'test/fixtures/morph.json'),
  _FixtureSpec(
    'tgs_phoenix',
    'test/fixtures/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
  ),
  _FixtureSpec('tgs_seal', 'test/fixtures/tgs/NotoEmoji/emoji_u1f9ad.tgs'),
  _FixtureSpec('tgs_icecream', 'test/fixtures/tgs/NotoEmoji/emoji_u1f366.tgs'),
  _FixtureSpec('tgs_dancer', 'test/fixtures/tgs/NotoEmoji/emoji_u1f483.tgs'),
  _FixtureSpec('tgs_tiger', 'test/fixtures/tgs/NotoEmoji/emoji_u1f405.tgs'),
];

int _fnv1a32(Uint32List words, int count) {
  var h = 0x811c9dc5;
  for (var i = 0; i < count; i++) {
    final w = words[i];
    h ^= w & 0xff;
    h = (h * 0x01000193) & 0xffffffff;
    h ^= (w >>> 8) & 0xff;
    h = (h * 0x01000193) & 0xffffffff;
    h ^= (w >>> 16) & 0xff;
    h = (h * 0x01000193) & 0xffffffff;
    h ^= (w >>> 24) & 0xff;
    h = (h * 0x01000193) & 0xffffffff;
  }
  return h;
}

Map<String, dynamic> _loadDoc(String path) {
  final raw = File(path).readAsBytesSync();
  final decoded = decodeLottieBytes(raw);
  return jsonDecode(utf8.decode(decoded)) as Map<String, dynamic>;
}

Map<String, Object?> _benchRender({
  required String mode,
  required List<_FixtureSpec> fixtures,
  required List<int> sizes,
  required bool retainCoverage,
  required int sampleFrames,
  required int rounds,
}) {
  final preferNative = mode == 'ffi';
  final results = <String, Object?>{};

  for (final spec in fixtures) {
    final doc = _loadDoc(spec.path);
    final scene = RasterScene.compile(doc, const FastLottieOptions());
    final duration = math.max(1.0, scene.end - scene.start);
    final frames = List<double>.generate(
      sampleFrames,
      (i) => scene.start + (duration * i) / sampleFrames,
    );

    final sizeResults = <String, Object?>{};
    for (final size in sizes) {
      final pixels = NativePixelBuffer(size * size);
      final ws = RasterWorkspace(
        initialHeight: size,
        preferNative: preferNative,
        retainCoverage: retainCoverage,
        nativeStroke: preferNative,
      );

      final beforeKernel = readNativeKernelTelemetry();
      final beforeGeom = nativeGeometryKernelCalls;
      final beforeBezier = nativeBezierCalls;

      // Warmup
      for (final f in frames) {
        renderSceneSoftware(scene, f, pixels, size, size, ws);
      }

      final perRoundUs = <double>[];
      var checksum = 0x811c9dc5;
      for (var r = 0; r < rounds; r++) {
        final sw = Stopwatch()..start();
        for (var i = 0; i < frames.length; i++) {
          renderSceneSoftware(scene, frames[i], pixels, size, size, ws);
          if (r == 0) {
            checksum ^= _fnv1a32(pixels.typedList, size * size);
          }
        }
        sw.stop();
        perRoundUs.add(sw.elapsedMicroseconds / frames.length);
      }
      perRoundUs.sort();

      final afterKernel = readNativeKernelTelemetry();
      final afterGeom = nativeGeometryKernelCalls;
      final afterBezier = nativeBezierCalls;

      final medianUs = perRoundUs[perRoundUs.length ~/ 2];
      final meanUs = perRoundUs.reduce((a, b) => a + b) / perRoundUs.length;
      final p95Us = perRoundUs[((perRoundUs.length - 1) * 0.95).round()];

      sizeResults['${size}x$size'] = {
        'median_us': medianUs,
        'mean_us': meanUs,
        'p95_us': p95Us,
        'fps_median': medianUs > 0 ? 1e6 / medianUs : 0.0,
        'checksum': checksum.toRadixString(16).padLeft(8, '0'),
        'simd_calls': afterKernel.calls - beforeKernel.calls,
        'geometry_calls': afterGeom - beforeGeom,
        'bezier_calls': afterBezier - beforeBezier,
        'borrowed_coverage': ws.borrowedCoverageDraws,
        'copied_coverage': ws.copiedCoverageDraws,
        'fused_solid': ws.fusedNativeSolidDraws,
        'native_matte': ws.nativeMatteComposites,
      };

      ws.dispose();
      pixels.dispose();
    }
    scene.dispose();
    results[spec.name] = sizeResults;
  }

  return results;
}

Map<String, Object?> _benchCacheCodec({
  required String mode,
  required List<int> sizes,
  required int rounds,
}) {
  final useNative = mode == 'ffi';
  final doc = _loadDoc(
    'test/fixtures/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
  );
  final scene = RasterScene.compile(doc, const FastLottieOptions());
  final duration = math.max(1.0, scene.end - scene.start);
  const frameCount = 16;
  final results = <String, Object?>{};

  for (final size in sizes) {
    final frameBytes = size * size * 4;
    final pixels = NativePixelBuffer(size * size);
    final ws = RasterWorkspace(initialHeight: size);
    final rendered = <Uint8List>[];
    for (var i = 0; i < frameCount; i++) {
      final f = scene.start + (duration * i) / frameCount;
      renderSceneSoftware(scene, f, pixels, size, size, ws);
      rendered.add(Uint8List.fromList(Uint8List.sublistView(pixels.typedList)));
    }
    ws.dispose();
    pixels.dispose();

    final stats = BitstreamReadStats();
    final store = BitstreamStore(
      maximumRamBytes: 64 * 1024 * 1024,
      useNativeDecoder: useNative,
      useNativeEncoder: useNative,
      computeFingerprints: true,
      readStats: stats,
    );
    final scratch = Lz4Scratch();
    final dst = Uint8List(frameBytes);

    // Warmup
    for (var i = 0; i < frameCount; i++) {
      store.storeFrame(
        entryKey: 'bench_$size',
        width: size,
        height: size,
        totalFrames: frameCount,
        poster: false,
        frameIndex: i,
        srcBgra: rendered[i],
        scratch: scratch,
      );
      store.tryReadFrame(
        entryKey: 'bench_$size',
        width: size,
        height: size,
        totalFrames: frameCount,
        poster: false,
        frameIndex: i,
        dstBgra: dst,
      );
    }

    final encodeUs = <double>[];
    final decodeUs = <double>[];
    var totalCompressed = 0;

    for (var r = 0; r < rounds; r++) {
      var compressedBytes = 0;
      final swEnc = Stopwatch()..start();
      for (var i = 0; i < frameCount; i++) {
        final res = store.storeFrame(
          entryKey: 'bench_$size',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          srcBgra: rendered[i],
          scratch: scratch,
        );
        compressedBytes += res.compressedBytes;
      }
      swEnc.stop();
      encodeUs.add(swEnc.elapsedMicroseconds / frameCount);
      totalCompressed = compressedBytes;

      final swDec = Stopwatch()..start();
      for (var i = 0; i < frameCount; i++) {
        final ok = store.tryReadFrame(
          entryKey: 'bench_$size',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          dstBgra: dst,
        );
        if (!ok) throw StateError('Cache decode failed');
      }
      swDec.stop();
      decodeUs.add(swDec.elapsedMicroseconds / frameCount);
    }

    encodeUs.sort();
    decodeUs.sort();
    results['${size}x$size'] = {
      'frame_bytes': frameBytes,
      'avg_compressed_bytes': totalCompressed / frameCount,
      'encode_median_us': encodeUs[encodeUs.length ~/ 2],
      'decode_median_us': decodeUs[decodeUs.length ~/ 2],
      'native_encodes': stats.nativeEncodes,
      'dart_encodes': stats.dartEncodes,
      'native_decodes': stats.nativeDecodes,
      'dart_decodes': stats.dartDecodes,
    };
    store.dispose();
  }

  scene.dispose();
  return results;
}

void main(List<String> args) {
  var mode = 'both';
  var jsonOut = false;
  var rounds = 9;
  var sampleFrames = 24;
  for (final arg in args) {
    if (arg.startsWith('--mode=')) {
      mode = arg.substring('--mode='.length);
    } else if (arg == '--json') {
      jsonOut = true;
    } else if (arg.startsWith('--rounds=')) {
      rounds = int.parse(arg.substring('--rounds='.length));
    } else if (arg.startsWith('--frames=')) {
      sampleFrames = int.parse(arg.substring('--frames='.length));
    }
  }

  final modes = mode == 'both' ? ['ffi', 'dart'] : [mode];
  final report = <String, Object?>{
    'env': {
      'os': Platform.operatingSystem,
      'version': Platform.operatingSystemVersion,
      'dart_version': Platform.version,
      'is_simd_supported': isSimdSupported,
      'use_native_bezier_flag': _useNativeBezierFlag,
      'sample_frames': sampleFrames,
      'rounds': rounds,
    },
  };

  for (final m in modes) {
    report[m] = {
      'render_uncached': _benchRender(
        mode: m,
        fixtures: _fixtures,
        sizes: const [128, 256, 512],
        retainCoverage: false,
        sampleFrames: sampleFrames,
        rounds: rounds,
      ),
      'render_cached': _benchRender(
        mode: m,
        fixtures: _fixtures,
        sizes: const [128, 256],
        retainCoverage: true,
        sampleFrames: sampleFrames,
        rounds: rounds,
      ),
      'cache_codec': _benchCacheCodec(
        mode: m,
        sizes: const [128, 256],
        rounds: rounds * 2,
      ),
    };
  }

  if (jsonOut) {
    print(const JsonEncoder.withIndent('  ').convert(report));
    return;
  }

  print('FastLottie FFI vs Pure Dart Benchmark');
  print('Env: ${report['env']}');
  print(const JsonEncoder.withIndent('  ').convert(report));
}
