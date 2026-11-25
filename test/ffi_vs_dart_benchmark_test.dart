// ignore_for_file: avoid_print
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:flutter_test/flutter_test.dart';

int _maxChannelDiff(Uint32List a, Uint32List b) {
  var maxDiff = 0;
  for (var i = 0; i < a.length; i++) {
    final pa = a[i];
    final pb = b[i];
    if (pa == pb) continue;
    for (var shift = 0; shift < 32; shift += 8) {
      final d = ((pa >>> shift) & 0xff) - ((pb >>> shift) & 0xff);
      final abs = d < 0 ? -d : d;
      if (abs > maxDiff) maxDiff = abs;
    }
  }
  return maxDiff;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const cases = <(String name, String path)>[
    ('icon', 'test/fixtures/icon.json'),
    ('features', 'test/fixtures/features.json'),
    ('many_shapes', 'test/fixtures/many_shapes.json'),
    ('morph', 'test/fixtures/morph.json'),
    ('tgs_phoenix', 'test/fixtures/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs'),
    ('tgs_seal', 'test/fixtures/tgs/NotoEmoji/emoji_u1f9ad.tgs'),
    ('tgs_icecream', 'test/fixtures/tgs/NotoEmoji/emoji_u1f366.tgs'),
  ];

  test('FFI vs pure Dart software session parity and timing (256x256)', () {
    const size = 256;
    const sampleFrames = 12;
    const rounds = 3;

    for (final (name, path) in cases) {
      final bytes = File(path).readAsBytesSync();
      final comp = FastLottieComposition.fromBytes(bytes);
      final duration = math.max(1.0, comp.endFrame - comp.startFrame);
      final frames = List<double>.generate(
        sampleFrames,
        (i) => comp.startFrame + (duration * i) / sampleFrames,
      );

      final nativeSession = FastLottieSoftwareSession(
        comp,
        pixelWidth: size,
        pixelHeight: size,
        preferNative: true,
        retainCoverage: false,
        nativeStroke: true,
      );
      final dartSession = FastLottieSoftwareSession(
        comp,
        pixelWidth: size,
        pixelHeight: size,
        preferNative: false,
        retainCoverage: false,
        nativeStroke: false,
      );

      try {
        var maxDiff = 0;
        for (final frame in frames) {
          final d = _maxChannelDiff(
            nativeSession.renderFrame(frame),
            dartSession.renderFrame(frame),
          );
          if (d > maxDiff) maxDiff = d;
        }
        expect(maxDiff, lessThanOrEqualTo(1), reason: '$name max channel diff');

        final swNative = Stopwatch()..start();
        for (var r = 0; r < rounds; r++) {
          for (final frame in frames) {
            nativeSession.renderFrame(frame);
          }
        }
        swNative.stop();

        final swDart = Stopwatch()..start();
        for (var r = 0; r < rounds; r++) {
          for (final frame in frames) {
            dartSession.renderFrame(frame);
          }
        }
        swDart.stop();

        final nativeUs = swNative.elapsedMicroseconds / (rounds * sampleFrames);
        final dartUs = swDart.elapsedMicroseconds / (rounds * sampleFrames);
        final speedup = nativeUs > 0 ? dartUs / nativeUs : 0.0;
        print(
          '[JIT $size] $name: FFI=${nativeUs.toStringAsFixed(1)} us/frame, '
          'Dart=${dartUs.toStringAsFixed(1)} us/frame, '
          'speedup=${speedup.toStringAsFixed(2)}x '
          '(borrowed=${nativeSession.borrowedCoverageDraws}, '
          'fusedSolid=${nativeSession.fusedNativeSolidDraws}, '
          'matte=${nativeSession.nativeMatteComposites})',
        );
      } finally {
        nativeSession.dispose();
        dartSession.dispose();
      }
    }
  }, skip: !isSimdSupported);

  test('BitstreamStore native FFI vs pure Dart LZ4/CRC31 codec parity and timing', () {
    const size = 256;
    const frameBytes = size * size * 4;
    const frameCount = 12;
    const rounds = 6;

    final bytes = File(
      'test/fixtures/tgs/NotoEmoji/emoji_u1f426_200d_1f525.tgs',
    ).readAsBytesSync();
    final comp = FastLottieComposition.fromBytes(bytes);
    final duration = math.max(1.0, comp.endFrame - comp.startFrame);
    final session = FastLottieSoftwareSession(
      comp,
      pixelWidth: size,
      pixelHeight: size,
    );
    final rawFrames = <Uint8List>[];
    try {
      for (var i = 0; i < frameCount; i++) {
        final frame = comp.startFrame + (duration * i) / frameCount;
        final px = session.renderFrame(frame);
        rawFrames.add(Uint8List.fromList(Uint8List.sublistView(px)));
      }
    } finally {
      session.dispose();
    }

    final nativeStats = BitstreamReadStats();
    final nativeStore = BitstreamStore(
      maximumRamBytes: 64 * 1024 * 1024,
      useNativeDecoder: true,
      useNativeEncoder: true,
      readStats: nativeStats,
    );
    final dartStats = BitstreamReadStats();
    final dartStore = BitstreamStore(
      maximumRamBytes: 64 * 1024 * 1024,
      useNativeDecoder: false,
      useNativeEncoder: false,
      readStats: dartStats,
    );
    addTearDown(nativeStore.dispose);
    addTearDown(dartStore.dispose);

    final scratch = Lz4Scratch();
    final dstNative = Uint8List(frameBytes);
    final dstDart = Uint8List(frameBytes);

    for (var i = 0; i < frameCount; i++) {
      final rN = nativeStore.storeFrame(
        entryKey: 'codec',
        width: size,
        height: size,
        totalFrames: frameCount,
        poster: false,
        frameIndex: i,
        srcBgra: rawFrames[i],
        scratch: scratch,
      );
      final rD = dartStore.storeFrame(
        entryKey: 'codec',
        width: size,
        height: size,
        totalFrames: frameCount,
        poster: false,
        frameIndex: i,
        srcBgra: rawFrames[i],
        scratch: scratch,
      );
      expect(rN.crc31, rD.crc31);
      expect(rN.compressedBytes, rD.compressedBytes);
      expect(
        nativeStore.tryReadFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          dstBgra: dstNative,
        ),
        isTrue,
      );
      expect(
        dartStore.tryReadFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          dstBgra: dstDart,
        ),
        isTrue,
      );
      expect(dstNative, orderedEquals(rawFrames[i]));
      expect(dstDart, orderedEquals(rawFrames[i]));
    }

    final swNativeEnc = Stopwatch()..start();
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < frameCount; i++) {
        nativeStore.storeFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          srcBgra: rawFrames[i],
          scratch: scratch,
        );
      }
    }
    swNativeEnc.stop();

    final swDartEnc = Stopwatch()..start();
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < frameCount; i++) {
        dartStore.storeFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          srcBgra: rawFrames[i],
          scratch: scratch,
        );
      }
    }
    swDartEnc.stop();

    final swNativeDec = Stopwatch()..start();
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < frameCount; i++) {
        nativeStore.tryReadFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          dstBgra: dstNative,
        );
      }
    }
    swNativeDec.stop();

    final swDartDec = Stopwatch()..start();
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < frameCount; i++) {
        dartStore.tryReadFrame(
          entryKey: 'codec',
          width: size,
          height: size,
          totalFrames: frameCount,
          poster: false,
          frameIndex: i,
          dstBgra: dstDart,
        );
      }
    }
    swDartDec.stop();

    final nEncUs = swNativeEnc.elapsedMicroseconds / (rounds * frameCount);
    final dEncUs = swDartEnc.elapsedMicroseconds / (rounds * frameCount);
    final nDecUs = swNativeDec.elapsedMicroseconds / (rounds * frameCount);
    final dDecUs = swDartDec.elapsedMicroseconds / (rounds * frameCount);
    print(
      '[JIT 256x256 LZ4+CRC31] Encode: FFI=${nEncUs.toStringAsFixed(1)} us vs Dart=${dEncUs.toStringAsFixed(1)} us (${(dEncUs / nEncUs).toStringAsFixed(2)}x) '
      '[native=${nativeStats.nativeEncodes}, dart=${dartStats.dartEncodes}]',
    );
    print(
      '[JIT 256x256 LZ4+CRC31] Decode: FFI=${nDecUs.toStringAsFixed(1)} us vs Dart=${dDecUs.toStringAsFixed(1)} us (${(dDecUs / nDecUs).toStringAsFixed(2)}x) '
      '[native=${nativeStats.nativeDecodes}, dart=${dartStats.dartDecodes}]',
    );
    expect(nativeStats.nativeEncodes, greaterThan(0));
    expect(nativeStats.nativeDecodes, greaterThan(0));
    expect(dartStats.dartEncodes, greaterThan(0));
    expect(dartStats.dartDecodes, greaterThan(0));
  }, skip: !isSimdSupported);
}
