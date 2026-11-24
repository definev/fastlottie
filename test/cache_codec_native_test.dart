import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/cache_codec_io.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final table = Uint32List.fromList([
    for (var i = 0; i < 256; i++)
      (() {
        var crc = i;
        for (var bit = 0; bit < 8; bit++) {
          crc = (crc & 1) == 0 ? crc >>> 1 : (crc >>> 1) ^ 0xedb88320;
        }
        return crc;
      })(),
  ]);
  bool? decode(Uint8List src, Uint8List dst, int? crc) =>
      decodeCacheFrameNative(
        src,
        0,
        src.length,
        dst,
        dst.length,
        false,
        crc,
        table,
      );

  test('native strip checksum matches Dart for a pixel buffer view', () {
    final bytes = Uint8List(96 * (4 * 96 + 3) * 4 + 5);
    final pixels = Uint8List.sublistView(bytes, 3, bytes.length - 2);
    final random = Random(30);
    for (var i = 0; i < pixels.length; i++) {
      pixels[i] = random.nextInt(256);
    }
    final expected = BitstreamStore.crc31(pixels, 0, pixels.length);
    expect(cacheCrc31Native(pixels, table), expected);
    expect(BitstreamStore.stripCrc31(pixels), expected);
  });

  test('native FLC1 encode preserves Dart payload and CRC', () {
    final rng = Random(609);
    final scratch = Lz4Scratch();
    final nativeDst = Uint8List(256 * 1024 + 9);
    for (final length in [
      ...List.generate(40, (i) => i + 1),
      270,
      525,
      4096,
      96 * 96 * 4,
      112 * 112 * 4,
      65535,
      65536,
      256 * 1024,
    ]) {
      for (final period in [1, 3, 4, 7, 257, length]) {
        final pattern = List.generate(period, (_) => rng.nextInt(256));
        final source = Uint8List(length + 3);
        final src = Uint8List.sublistView(source, 3);
        for (var i = 0; i < length; i++) {
          src[i] = pattern[i % period];
        }
        final dartDst = scratch.ensureOutputCapacity(length);
        final written = Lz4Codec.compressInto(
          src,
          length,
          dartDst,
          scratch.hashTable,
          abortAtLength: length,
        );
        final expectedLength = written < 0 ? length : written;
        final expected = expectedLength == length ? src : dartDst;
        nativeDst.fillRange(0, length + 9, 0xa5);
        final dst = Uint8List.sublistView(nativeDst, 5, 5 + length);
        final result = encodeCacheFrameNative(
          src,
          length,
          dst,
          scratch.hashTable,
          table,
        );
        expect(
          result?.length,
          expectedLength,
          reason: 'length=$length period=$period',
        );
        expect(result?.crc, BitstreamStore.crc31(expected, 0, expectedLength));
        if (expectedLength < length) {
          expect(
            dst.take(expectedLength),
            orderedEquals(expected.take(expectedLength)),
          );
        }
        expect(nativeDst.take(5), everyElement(0xa5));
        expect(nativeDst.skip(length + 5).take(4), everyElement(0xa5));
      }
    }
  });

  test('native encoder matches Dart on mixed data and reuses scratch safely', () {
    final rng = Random(6071);
    final scratch = Lz4Scratch();
    for (var iteration = 0; iteration < 180; iteration++) {
      final length = 1 + rng.nextInt(128 * 1024);
      final src = Uint8List(length);
      for (var i = 0; i < length; i++) {
        src[i] = i > 256 && rng.nextInt(5) != 0
            ? src[i - 1 - rng.nextInt(256)]
            : rng.nextInt(256);
      }
      // Repeat long stretches amid noise to exercise literal and match lengths.
      if (iteration.isEven && length > 2000) {
        for (var i = 1024; i < length; i++) {
          if (i % 4000 < 3000) src[i] = src[i - 1024];
        }
      }
      final dst = scratch.ensureOutputCapacity(length);
      final written = Lz4Codec.compressInto(
        src,
        length,
        dst,
        scratch.hashTable,
        abortAtLength: length,
      );
      final expectedLength = written < 0 ? length : written;
      final expected = Uint8List.fromList(
        (expectedLength == length ? src : dst).sublist(0, expectedLength),
      );
      final native = encodeCacheFrameNative(
        src,
        length,
        dst,
        scratch.hashTable,
        table,
      )!;
      expect(native.length, expectedLength, reason: 'iteration $iteration');
      expect(native.crc, BitstreamStore.crc31(expected, 0, expectedLength));
      if (native.length < length) {
        expect(dst.take(native.length), orderedEquals(expected));
        expect(Lz4Codec.decompress(dst.sublist(0, native.length), length), src);
      }
    }
  });

  test('native encode falls back above its leaf-call limit', () {
    final length = 256 * 1024 + 4;
    final src = Uint8List(length)..fillRange(0, length, 0x37);
    final scratch = Lz4Scratch();
    expect(
      encodeCacheFrameNative(
        src,
        length,
        Uint8List(length),
        scratch.hashTable,
        table,
      ),
      isNull,
    );
    final stats = BitstreamReadStats();
    final store = BitstreamStore(
      maximumRamBytes: length,
      useNativeEncoder: true,
      readStats: stats,
    );
    addTearDown(store.dispose);
    store.storeFrame(
      entryKey: 'large',
      width: 1,
      height: length ~/ 4,
      totalFrames: 1,
      poster: false,
      frameIndex: 0,
      srcBgra: src,
      scratch: scratch,
    );
    final dst = Uint8List(length);
    expect(
      store.tryReadFrame(
        entryKey: 'large',
        width: 1,
        height: length ~/ 4,
        totalFrames: 1,
        poster: false,
        frameIndex: 0,
        dstBgra: dst,
      ),
      isTrue,
    );
    expect(dst, src);
    expect(stats.nativeEncodes, 0);
    expect(stats.dartEncodes, 1);
  });

  test('a frame stays readable after the preceding frame is evicted', () {
    const size = 96;
    const frameBytes = size * size * 4;
    final random = Random(53);
    final first = Uint8List.fromList(
      List.generate(frameBytes, (_) => random.nextInt(256)),
    );
    final next = Uint8List.fromList(first)..[0] ^= 0xff;
    final scratch = Lz4Scratch();
    final cache = BitstreamStore(maximumRamBytes: frameBytes + 16);
    addTearDown(cache.dispose);

    for (final (index, pixels) in [(0, first), (1, next)]) {
      cache.storeFrame(
        entryKey: 'animation',
        width: size,
        height: size,
        totalFrames: 8,
        poster: false,
        frameIndex: index,
        srcBgra: pixels,
        scratch: scratch,
      );
    }

    final output = Uint8List(frameBytes);
    bool read(int index) => cache.tryReadFrame(
      entryKey: 'animation',
      width: size,
      height: size,
      totalFrames: 8,
      poster: false,
      frameIndex: index,
      dstBgra: output,
    );

    expect(read(1), isTrue);
    expect(output, next);
    expect(read(0), isFalse);
    expect(cache.ramBytes, frameBytes);
  });

  test('native FLC1 decode matches Dart for raw, LZ4, slices and overlap matches', () {
    final rng = Random(829);
    for (final length in [
      1,
      4,
      12,
      13,
      15,
      270,
      525,
      4096,
      96 * 96 * 4,
      112 * 112 * 4,
      65536,
    ]) {
      for (final period in [1, 3, 4, 7, 257, length]) {
        final pattern = List.generate(period, (_) => rng.nextInt(256));
        final expected = Uint8List.fromList([
          for (var i = 0; i < length; i++) pattern[i % period],
        ]);
        for (final raw in [false, true]) {
          final payload = raw ? expected : Lz4Codec.compress(expected);
          final source = Uint8List(payload.length + 13)
            ..setRange(7, 7 + payload.length, payload);
          final output = Uint8List(length + 10)
            ..fillRange(0, length + 10, 0xa5);
          final view = Uint8List.sublistView(output, 3, length + 3);
          expect(
            decodeCacheFrameNative(
              source,
              7,
              payload.length,
              view,
              length,
              raw,
              BitstreamStore.crc31(payload, 0, payload.length),
              table,
            ),
            isTrue,
            reason:
                'native decoder must be available; length=$length period=$period',
          );
          expect(view, orderedEquals(expected));
          expect(output.take(3), everyElement(0xa5));
          expect(output.skip(length + 3), everyElement(0xa5));
        }
      }
    }
  });

  test('native decoder rejects corrupt CRC before writing and bounds malformed LZ4', () {
    final pixels = Uint8List(512)..fillRange(0, 512, 0x33);
    final valid = Lz4Codec.compress(pixels);
    final output = Uint8List(pixels.length)..fillRange(0, pixels.length, 0xa5);
    expect(
      decode(valid, output, BitstreamStore.crc31(valid, 0, valid.length) ^ 1),
      isFalse,
    );
    expect(decode(valid, output, 0), isFalse);
    expect(output, everyElement(0xa5));
    expect(decode(valid, output, null), isTrue);
    expect(output, pixels);
    final rng = Random(1829);
    for (var i = 0; i < 2000; i++) {
      final data = i < valid.length
          ? Uint8List.sublistView(valid, 0, i)
          : Uint8List.fromList(
              List.generate(1 + rng.nextInt(80), (_) => rng.nextInt(256)),
            );
      final size = 1 + rng.nextInt(512);
      final guarded = Uint8List(size + 4)..fillRange(0, size + 4, 0xa5);
      final dst = Uint8List.sublistView(guarded, 2, size + 2);
      Uint8List? expected;
      try {
        expected = Lz4Codec.decompress(data, size);
      } on FormatException {
        // Compare rejection after computing a valid CRC for the malformed block.
      }
      for (final crc in [BitstreamStore.crc31(data, 0, data.length), null]) {
        expect(decode(data, dst, crc), expected != null);
        if (expected != null) expect(dst, orderedEquals(expected));
        expect(guarded.take(2), everyElement(0xa5));
        expect(guarded.skip(size + 2), everyElement(0xa5));
      }
    }
  });

  test('file residency avoids repeat opens across a 25-asset working set', () {
    for (final limit in [16, 32]) {
      final directory = Directory.systemTemp.createTempSync('texture-cache-');
      final stats = BitstreamReadStats();
      final cache = BitstreamStore(
        diskCacheDirectory: directory.path,
        maximumRamBytes: 0,
        maximumOpenFiles: limit,
        useNativeDecoder: true,
        readStats: stats,
      );
      try {
        final scratch = Lz4Scratch();
        final source = Uint8List(16 * 16 * 4);
        for (var i = 0; i < 25; i++) {
          source.fillRange(0, source.length, i + 1);
          cache.storeFrame(
            entryKey: 'asset$i',
            width: 16,
            height: 16,
            totalFrames: 1,
            poster: false,
            frameIndex: 0,
            srcBgra: source,
            scratch: scratch,
          );
        }
        cache.closeOpenFiles();
        final target = Uint8List(source.length);
        for (var pass = 0; pass < 2; pass++) {
          final before = stats.fileOpens;
          for (var i = 0; i < 25; i++) {
            expect(
              cache.tryReadFrame(
                entryKey: 'asset$i',
                width: 16,
                height: 16,
                totalFrames: 1,
                poster: false,
                frameIndex: 0,
                dstBgra: target,
              ),
              isTrue,
            );
            expect(target, everyElement(i + 1));
          }
          expect(stats.fileOpens - before, pass == 0 || limit == 16 ? 25 : 0);
        }
        expect(stats.ramHits, 0);
        expect(stats.diskHits, 50);
        expect(stats.nativeDecodes, 50);
        expect(stats.dartDecodes, 0);
      } finally {
        cache.dispose();
        directory.deleteSync(recursive: true);
      }
    }
  });
}
