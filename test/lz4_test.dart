import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/src/bitstream_cache.dart';
import 'package:fastlottie/src/lz4.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('LZ4 round-trips empty, tiny, repetitive, and mixed pixel payloads', () {
    final scratch = Lz4Scratch();

    // Empty
    expect(Lz4Codec.decompress(Lz4Codec.compress(Uint8List(0)), 0), isEmpty);

    // Small < 13 bytes
    for (final len in [1, 4, 12, 13, 15, 270, 525, 4096]) {
      final src = Uint8List.fromList([
        for (var i = 0; i < len; i++) (i * 37) & 0xFF,
      ]);
      final compressed = Lz4Codec.compress(src, scratch: scratch);
      expect(
        Lz4Codec.decompress(compressed, src.length),
        src,
        reason: 'len=$len',
      );
    }

    // Synthetic BGRA8888 frame (64x64 with transparent margins + repeated solid stripe)
    final pixels = Uint32List(128 * 128);
    for (var y = 16; y < 112; y++) {
      for (var x = 16; x < 112; x++) {
        pixels[y * 128 + x] = y < 64 ? 0xFFFF2244 : 0x80204060;
      }
    }
    final raw = pixels.buffer.asUint8List();
    final compressed = Lz4Codec.compress(raw, scratch: scratch);
    expect(compressed.length, lessThan(raw.length ~/ 10));
    final restored = Lz4Codec.decompress(compressed, raw.length);
    expect(restored, raw);
  });

  test(
    'LZ4 handles pseudo-random incompressible data and aborts when larger',
    () {
      final rng = math.Random(42);
      final raw = Uint8List.fromList([
        for (var i = 0; i < 8192; i++) rng.nextInt(256),
      ]);
      final scratch = Lz4Scratch(initialOutputCapacity: raw.length + 128);

      // Full compress + decompress still round-trips.
      final full = Lz4Codec.compress(raw, scratch: scratch);
      expect(Lz4Codec.decompress(full, raw.length), raw);

      // abortAtLength triggers early -1 bailout when incompressible.
      final dst = Uint8List(raw.length + 64);
      final aborted = Lz4Codec.compressInto(
        raw,
        raw.length,
        dst,
        scratch.hashTable,
        abortAtLength: raw.length,
      );
      expect(aborted, -1);
    },
  );

  test(
    'LZ4 rejects truncated or corrupt payloads cleanly with FormatException',
    () {
      final raw = Uint8List(1024)..fillRange(0, 1024, 0xAA);
      final valid = Lz4Codec.compress(raw);

      // Truncated stream -> unexpected length or truncated token
      expect(
        () =>
            Lz4Codec.decompress(valid.sublist(0, valid.length - 1), raw.length),
        throwsFormatException,
      );

      // Invalid backward offset beyond output start
      final badOffset = Uint8List.fromList([
        0x00,
        0x05,
        0x00,
      ]); // 0 lits, offset=5
      expect(() => Lz4Codec.decompress(badOffset, 64), throwsFormatException);

      // Output length mismatch
      expect(
        () => Lz4Codec.decompress(valid, raw.length + 1),
        throwsFormatException,
      );
    },
  );

  test('verify ui.PixelFormat.bgra8888 premultiplied byte order matches (a<<24)|(r<<16)|(g<<8)|b on little-endian', () async {
    final buf = Uint32List(1);
    // Test distinct B=0x11, G=0x22, R=0x33, A=0xFF (opaque so no unpremul/premul change)
    buf[0] = (0xFF << 24) | (0x33 << 16) | (0x22 << 8) | 0x11;
    final bytes = buf.buffer.asUint8List();
    expect(bytes[0], 0x11); // B
    expect(bytes[1], 0x22); // G
    expect(bytes[2], 0x33); // R
    expect(bytes[3], 0xFF); // A

    ui.Image? img;
    ui.decodeImageFromPixels(bytes, 1, 1, ui.PixelFormat.bgra8888, (decoded) {
      img = decoded;
    });
    while (img == null) {
      await Future<void>.delayed(Duration.zero);
    }
    final rgba = await img!.toByteData(format: ui.ImageByteFormat.rawRgba);
    img!.dispose();
    final out = rgba!.buffer.asUint8List();
    // Expect R=0x33, G=0x22, B=0x11, A=0xFF
    expect(out, [0x33, 0x22, 0x11, 0xFF]);
  });

  test(
    'Lz4Scratch shrinks oversized output buffer after sustained small uses',
    () {
      final scratch = Lz4Scratch();
      expect(scratch.outputBuffer.length, Lz4Scratch.defaultOutputCapacity);

      // Spike beyond soft limit.
      final huge = scratch.ensureOutputCapacity(2 * 1024 * 1024);
      expect(huge.length, greaterThan(Lz4Scratch.defaultSoftLimit));
      scratch.recordOutputUse(2 * 1024 * 1024);
      expect(
        scratch.outputBuffer.length,
        greaterThan(Lz4Scratch.defaultSoftLimit),
      );

      // Fifteen small uses preserve buffer capacity to avoid thrashing.
      for (var i = 0; i < 15; i++) {
        scratch.recordOutputUse(32 * 1024);
        expect(
          scratch.outputBuffer.length,
          greaterThan(Lz4Scratch.defaultSoftLimit),
        );
      }

      // Sixteenth consecutive small use trims back to defaultOutputCapacity.
      scratch.recordOutputUse(32 * 1024);
      expect(scratch.outputBuffer.length, Lz4Scratch.defaultOutputCapacity);

      // Explicit shrinkScratch resets immediately as well.
      scratch.ensureOutputCapacity(1024 * 1024);
      expect(
        scratch.outputBuffer.length,
        greaterThan(Lz4Scratch.defaultSoftLimit),
      );
      scratch.shrinkScratch();
      expect(scratch.outputBuffer.length, Lz4Scratch.defaultOutputCapacity);
    },
  );

  test('BitstreamStore indexes RAM LRU via record keys, evicts cleanly, and trims scratch', () {
    final tempDir = Directory.systemTemp.createTempSync(
      'fastlottie_bitstream_',
    );
    addTearDown(() {
      if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
    });

    final store = BitstreamStore(
      diskCacheDirectory: tempDir.path,
      maximumRamBytes: 512 * 1024,
    );
    addTearDown(store.dispose);
    final scratch = Lz4Scratch();

    const w = 32;
    const h = 32;
    const frameBytes = w * h * 4;
    final srcA0 = Uint8List(frameBytes)..fillRange(0, frameBytes, 0x2A);
    final srcA1 = Uint8List(frameBytes)..fillRange(0, frameBytes, 0x3B);
    final srcB0 = Uint8List(frameBytes)..fillRange(0, frameBytes, 0x4C);

    final stA0 = store.storeFrame(
      entryKey: 'entryA',
      width: w,
      height: h,
      totalFrames: 4,
      poster: false,
      frameIndex: 0,
      srcBgra: srcA0,
      scratch: scratch,
    );
    final stA1 = store.storeFrame(
      entryKey: 'entryA',
      width: w,
      height: h,
      totalFrames: 4,
      poster: false,
      frameIndex: 1,
      srcBgra: srcA1,
      scratch: scratch,
    );
    final stB0 = store.storeFrame(
      entryKey: 'entryB',
      width: w,
      height: h,
      totalFrames: 4,
      poster: false,
      frameIndex: 0,
      srcBgra: srcB0,
      scratch: scratch,
    );

    expect(
      store.ramBytes,
      stA0.compressedBytes + stA1.compressedBytes + stB0.compressedBytes,
    );

    // Evicting entryA RAM frees both frames of entryA without touching entryB.
    store.evictEntryRam('entryA');
    expect(store.ramBytes, stB0.compressedBytes);

    // Clear RAM and verify warm open-file disk read populates dst accurately.
    store.clearRam();
    expect(store.ramBytes, 0);

    final out = Uint8List(frameBytes);
    expect(
      store.tryReadFrame(
        entryKey: 'entryA',
        width: w,
        height: h,
        totalFrames: 4,
        poster: false,
        frameIndex: 1,
        dstBgra: out,
      ),
      isTrue,
    );
    expect(out, srcA1);
    expect(store.ramBytes, stA1.compressedBytes);

    // Close open file handles and verify disk reopen path still works.
    store.closeOpenFiles();
    store.clearRam();
    out.fillRange(0, frameBytes, 0);
    expect(
      store.tryReadFrame(
        entryKey: 'entryA',
        width: w,
        height: h,
        totalFrames: 4,
        poster: false,
        frameIndex: 0,
        dstBgra: out,
      ),
      isTrue,
    );
    expect(out, srcA0);
  });
}
