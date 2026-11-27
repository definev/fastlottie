import 'dart:math' as math;
import 'dart:typed_data';

import '../platform/platform_stub.dart'
    if (dart.library.io) '../platform/platform_io.dart';
import 'cache_codec_stub.dart' if (dart.library.ffi) 'cache_codec_io.dart';
import 'lz4.dart';
import 'tile_playback.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');
const _isWasm = bool.fromEnvironment('dart.tool.dart2wasm');
const _isJs = _isWeb && !_isWasm;

/// Deterministic filename-safe cache key for `(contentKey, pixelSize, sourceFrameCount)`.
///
/// Keyed by the composition's source frame count (`1` when static, else
/// `composition.frameCount`) rather than the consumer's `maximumFrameRate` step
/// or `poster` mode, so poster (`frame 0`), 24 FPS, 30 FPS, and 60 FPS players
/// at the same pixel resolution share one `.flcache` file and RAM LRU slots.
String formatBitstreamEntryKey(
  String contentKey,
  int width,
  int height,
  int sourceFrameCount, [
  bool poster = false,
]) => '${contentKey}_${width}x${height}_f$sourceFrameCount';

typedef _RamKey = (String, int);

/// Optional worker-local cache counters for experiments. A file open may come
/// from a read or a write; RAM hits exclude decoded tile pages.
final class BitstreamReadStats {
  int ramHits = 0, diskHits = 0, fileOpens = 0, fileEvictions = 0;
  int nativeDecodes = 0, dartDecodes = 0;
  int nativeEncodes = 0, dartEncodes = 0;
}

final class _RamFrame {
  _RamFrame({
    required this.payload,
    required this.isRaw,
    required this.crc31,
    this.fpHi = 0,
    this.fpLo = 0,
    this.lastUsed = 0,
  });

  final Uint8List payload;
  final bool isRaw;
  final int crc31;
  int fpHi;
  int fpLo;
  int lastUsed;
}

final class _OpenFlCacheFile {
  _OpenFlCacheFile({
    required this.entryKey,
    required this.path,
    required this.handle,
    required this.width,
    required this.height,
    required this.frameCount,
    required this.uncompressedFrameBytes,
    required this.poster,
    required this.completed,
    required this.writtenCount,
    required this.fileBytes,
    required this.offsets,
    required this.lengths,
    required this.metas,
  });

  final String entryKey;
  final String path;
  PlatformFileHandle handle;
  final int width;
  final int height;
  final int frameCount;
  final int uncompressedFrameBytes;
  final bool poster;
  bool completed;
  int writtenCount;
  int fileBytes;
  final Uint64List offsets;
  final Uint32List lengths;
  final Uint32List metas;

  int get payloadStart =>
      BitstreamStore.headerSize + frameCount * BitstreamStore.slotSize;
}

/// Worker-local compressed frame store combining an O(1) bounded compressed-RAM
/// LRU and append-only `*.flcache` disk files (`FLC1`) with CRC31 verification.
///
/// Each `.flcache` file has:
/// - 32-byte `FLC1` header (`magic`, `version`, `width`, `height`, `frameCount`,
///   `flags`, `writtenCount`, `uncompressedFrameBytes`)
/// - `frameCount * 16`-byte frame index (`uint64 offset`, `uint32 storedLen`,
///   `uint32 (isRaw << 31) | crc31`)
/// - Append-only LZ4 (or raw when incompressible) premultiplied BGRA8888 frames.
class BitstreamStore {
  BitstreamStore({
    String? diskCacheDirectory,
    this._maximumRamBytes = 4 * 1024 * 1024,
    this.maximumDiskBytes = 128 * 1024 * 1024,
    this.maximumOpenFiles = 16,
    this.useNativeDecoder = true,
    this.useNativeEncoder = true,
    this.computeFingerprints = true,
    this.readStats,
  }) : _diskDir = (diskCacheDirectory == null || diskCacheDirectory.isEmpty)
           ? null
           : diskCacheDirectory {
    if (_diskDir != null && isDiskCacheSupported) {
      PlatformDiskFs.ensureDirectory(_diskDir!);
    }
  }

  static const int magic = 0x464C4331; // 'FLC1'
  // Version 2 invalidates pixels cached before the blend and mask fixes.
  static const int version = 2;
  static const int headerSize = 32;
  static const int slotSize = 16;
  // Each open file keeps a dense index in RAM as well as on disk.
  static const int _maximumIndexBytes = 256 * 1024;
  static const int flagCompleted = 1 << 0;
  static const int flagPoster = 1 << 1;

  static final Uint32List _crcTable = _buildCrc32Table();
  static final Uint32List _crcSlice8 = _buildCrc32Slice8(_crcTable);
  // Private monomorphic U8List scratch for dart2wasm so CRC31 / secondary hash
  // never dispatch through polymorphic Uint8List (which boxes every byte read
  // into a heap _BoxedInt when Uint8List views exist elsewhere in the app).
  static Uint8List _wasmReadScratch = Uint8List(0);

  static Uint32List _buildCrc32Table() {
    final table = Uint32List(256);
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var k = 0; k < 8; k++) {
        c = (c & 1) != 0 ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  }

  static Uint32List _buildCrc32Slice8(Uint32List t0) {
    final flat = Uint32List(2048);
    flat.setRange(0, 256, t0);
    for (var i = 0; i < 256; i++) {
      var c = t0[i];
      for (var s = 1; s < 8; s++) {
        c = t0[c & 0xFF] ^ (c >>> 8);
        flat[(s << 8) | i] = c;
      }
    }
    return flat;
  }

  static int crc31(Uint8List data, int offset, int length) {
    var crc = 0xFFFFFFFF;
    final t = _crcSlice8;
    var i = offset;
    final end = offset + length;
    if (length >= 16) {
      if (_isWasm) {
        var buf = _wasmReadScratch;
        if (buf.length < length) {
          buf = _wasmReadScratch = Uint8List(length);
        }
        buf.setRange(0, length, data, offset);
        var p = 0;
        final end8 = length & ~7;
        while (p < end8) {
          final lo =
              (buf[p] |
                  (buf[p + 1] << 8) |
                  (buf[p + 2] << 16) |
                  (buf[p + 3] << 24)) ^
              crc;
          final hi =
              buf[p + 4] |
              (buf[p + 5] << 8) |
              (buf[p + 6] << 16) |
              (buf[p + 7] << 24);
          crc =
              t[1792 + (lo & 0xFF)] ^
              t[1536 + ((lo >>> 8) & 0xFF)] ^
              t[1280 + ((lo >>> 16) & 0xFF)] ^
              t[1024 + ((lo >>> 24) & 0xFF)] ^
              t[768 + (hi & 0xFF)] ^
              t[512 + ((hi >>> 8) & 0xFF)] ^
              t[256 + ((hi >>> 16) & 0xFF)] ^
              t[(hi >>> 24) & 0xFF];
          p += 8;
        }
        while (p < length) {
          crc = t[(crc ^ buf[p++]) & 0xFF] ^ (crc >>> 8);
        }
        return (crc ^ 0xFFFFFFFF) & 0x7FFFFFFF;
      } else {
        final bd = ByteData.sublistView(data, offset, end);
        var p = 0;
        final end8 = length & ~7;
        while (p < end8) {
          final lo = bd.getUint32(p, Endian.little) ^ crc;
          final hi = bd.getUint32(p + 4, Endian.little);
          crc =
              t[1792 + (lo & 0xFF)] ^
              t[1536 + ((lo >>> 8) & 0xFF)] ^
              t[1280 + ((lo >>> 16) & 0xFF)] ^
              t[1024 + ((lo >>> 24) & 0xFF)] ^
              t[768 + (hi & 0xFF)] ^
              t[512 + ((hi >>> 8) & 0xFF)] ^
              t[256 + ((hi >>> 16) & 0xFF)] ^
              t[(hi >>> 24) & 0xFF];
          p += 8;
        }
        i = offset + p;
      }
    }
    while (i < end) {
      crc = t[(crc ^ data[i++]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) & 0x7FFFFFFF;
  }

  static int _mul32(int a, int b) {
    if (!_isJs) return (a * b) & 0xFFFFFFFF;
    final lo = (a & 0xFFFF) * b;
    final hi = ((a >>> 16) * b) & 0xFFFF;
    return (lo + (hi << 16)) & 0xFFFFFFFF;
  }

  static int _rotl32(int x, int r) =>
      ((x << r) | (x >>> (32 - r))) & 0xFFFFFFFF;

  static int _secondaryHash32(
    Uint8List data,
    int offset,
    int length,
    bool isRaw,
  ) {
    var h = (0x9E3779B1 ^ length ^ (isRaw ? 0x517CC1B7 : 0)) & 0xFFFFFFFF;
    var i = offset;
    final end = offset + length;
    if (_isWasm && length >= 16) {
      var buf = _wasmReadScratch;
      if (buf.length < length) {
        buf = _wasmReadScratch = Uint8List(length);
      }
      buf.setRange(0, length, data, offset);
      final end4 = length & ~3;
      var p = 0;
      while (p < end4) {
        final word =
            buf[p] |
            (buf[p + 1] << 8) |
            (buf[p + 2] << 16) |
            (buf[p + 3] << 24);
        h = _mul32(
          _rotl32((h + _mul32(word, 0xC2B2AE3D)) & 0xFFFFFFFF, 17),
          0x27D4EB2F,
        );
        p += 4;
      }
      while (p < length) {
        h = _mul32(
          _rotl32((h + _mul32(buf[p], 0x165667B1)) & 0xFFFFFFFF, 11),
          0x9E3779B1,
        );
        p++;
      }
      h ^= h >>> 15;
      h = _mul32(h, 0x85EBCA77);
      h ^= h >>> 13;
      h = _mul32(h, 0xC2B2AE3D);
      h ^= h >>> 16;
      return h;
    }
    if (!_isWasm && length >= 16) {
      final bd = ByteData.sublistView(data, offset, end);
      final end4 = length & ~3;
      var p = 0;
      while (p < end4) {
        final word = bd.getUint32(p, Endian.little);
        h = _mul32(
          _rotl32((h + _mul32(word, 0xC2B2AE3D)) & 0xFFFFFFFF, 17),
          0x27D4EB2F,
        );
        p += 4;
      }
      i = offset + p;
    } else {
      final end4 = offset + (length & ~3);
      while (i < end4) {
        final word =
            data[i] |
            (data[i + 1] << 8) |
            (data[i + 2] << 16) |
            (data[i + 3] << 24);
        h = _mul32(
          _rotl32((h + _mul32(word, 0xC2B2AE3D)) & 0xFFFFFFFF, 17),
          0x27D4EB2F,
        );
        i += 4;
      }
    }
    while (i < end) {
      h = _mul32(
        _rotl32((h + _mul32(data[i], 0x165667B1)) & 0xFFFFFFFF, 11),
        0x9E3779B1,
      );
      i++;
    }
    h ^= h >>> 15;
    h = _mul32(h, 0x85EBCA77);
    h ^= h >>> 13;
    h = _mul32(h, 0xC2B2AE3D);
    h ^= h >>> 16;
    return h;
  }

  /// Combines a frame's CRC31 and an independent 32-bit multiplicative hash of
  /// its stored payload into a JS-safe 64-bit `(fpHi, fpLo)` fingerprint.
  /// Never returns `(0, 0)`, which is reserved for absent/disabled fingerprints.
  static (int, int) frameFingerprint(
    int crc31,
    Uint8List data,
    int offset,
    int length,
    bool isRaw,
  ) {
    final fpHi = (crc31 & 0x7FFFFFFF) | (isRaw ? 0x80000000 : 0);
    var fpLo = _secondaryHash32(data, offset, length, isRaw);
    if (fpHi == 0 && fpLo == 0) fpLo = 1;
    return (fpHi, fpLo);
  }

  /// Folds one slot's 64-bit fingerprint into a running strip fingerprint.
  static (int, int) mixStripFingerprint(
    int hi,
    int lo,
    int slotHi,
    int slotLo,
  ) {
    var nextHi = _rotl32(_mul32((hi ^ slotHi) & 0xFFFFFFFF, 0x85EBCA77), 13);
    var nextLo = _rotl32(_mul32((lo ^ slotLo) & 0xFFFFFFFF, 0xC2B2AE3D), 17);
    nextHi = _mul32((nextHi + nextLo) & 0xFFFFFFFF, 0x27D4EB2F);
    nextLo = _mul32((nextLo ^ (nextHi >>> 16)) & 0xFFFFFFFF, 0x165667B1);
    return (nextHi, nextLo);
  }

  /// Finalizes a multi-slot strip fingerprint, avoiding the `(0, 0)` sentinel.
  static (int, int) finalizeStripFingerprint(int hi, int lo, int count) {
    var nextHi = (hi ^ count) & 0xFFFFFFFF;
    var nextLo = (lo + _mul32(count, 0x9E3779B1)) & 0xFFFFFFFF;
    nextHi ^= nextHi >>> 15;
    nextHi = _mul32(nextHi, 0x85EBCA77);
    nextHi ^= nextHi >>> 13;
    nextLo ^= nextLo >>> 16;
    nextLo = _mul32(nextLo, 0xC2B2AE3D);
    nextLo ^= nextLo >>> 15;
    if (nextHi == 0 && nextLo == 0) nextLo = 1;
    return (nextHi, nextLo);
  }

  String? _diskDir;
  int _maximumRamBytes;
  int get maximumRamBytes => _maximumRamBytes;
  set maximumRamBytes(int value) {
    _maximumRamBytes = value;
    _makeRamRoom(0);
  }

  final int maximumOpenFiles;
  int maximumDiskBytes;

  /// Experimental FLC1 decode into caller-owned bytes. Unsupported targets
  /// and frames above the native leaf-call limit keep the Dart path.
  final bool useNativeDecoder;

  /// Experimental byte-compatible LZ4/CRC encoder for short VM leaf calls.
  /// Unsupported targets and frames above 256 KiB use the Dart encoder.
  final bool useNativeEncoder;

  /// Whether to compute 64-bit upload deduplication fingerprints on cache hits/writes.
  bool computeFingerprints;

  final BitstreamReadStats? readStats;

  final _ramLru = <_RamKey, _RamFrame>{};
  final _ramFramesByEntry = <String, Set<int>>{};
  final _entryRamBytes = <String, int>{};
  final _entryTotalFrames = <String, int>{};
  final _oversizedEntries = <String>{};
  int _ramBytes = 0;
  int _ramClock = 0;
  final _tilePages = <_RamKey, TilePlaybackPage>{};
  final _attemptedPages = <_RamKey>{};
  int _tileBytes = 0;
  Uint8List? _tileScratch;
  int lastFrameFpHi = 0;
  int lastFrameFpLo = 0;
  static const int _defaultIoScratchBytes = 64 * 1024;
  static const int _softIoScratchLimit = 512 * 1024;

  final _openFiles = <String, _OpenFlCacheFile>{};
  final _headerScratch = Uint8List(headerSize);
  final _slotScratch = Uint8List(slotSize);
  Uint8List _ioScratch = Uint8List(_defaultIoScratchBytes);
  int _smallIoCount = 0;

  int recoveredCorruptions = 0;
  int get ramBytes => _ramBytes + _tileBytes;

  /// True when every frame of [entryKey] can be read back without the
  /// compiled scene, either from compressed RAM or a completed disk file.
  bool hasAllFrames(String entryKey, int totalFrames) {
    if (totalFrames <= 0) return false;
    final cached = _ramFramesByEntry[entryKey];
    if (cached != null && cached.length >= totalFrames) return true;
    final file = _openFiles[entryKey];
    if (file != null &&
        file.completed &&
        file.frameCount == totalFrames &&
        file.writtenCount >= totalFrames) {
      return true;
    }
    var available = 0;
    for (var f = 0; f < totalFrames; f++) {
      if ((cached != null && cached.contains(f)) ||
          (_tilePages[(entryKey, f ~/ TilePlaybackPage.maxFrames)]?.contains(
                f,
              ) ??
              false)) {
        available++;
      } else {
        break;
      }
    }
    return available >= totalFrames;
  }

  String? get diskCacheDirectory => _diskDir;

  void setDiskDirectory(String? dir) {
    final next = (dir == null || dir.isEmpty) ? null : dir;
    if (next == _diskDir) return;
    closeOpenFiles();
    _diskDir = next;
    if (next != null && isDiskCacheSupported) {
      PlatformDiskFs.ensureDirectory(next);
    }
  }

  Uint8List _ensureIoScratch(int needed) {
    if (_ioScratch.length >= needed) return _ioScratch;
    var next = _ioScratch.length;
    while (next < needed) {
      next *= 2;
    }
    _smallIoCount = 0;
    return _ioScratch = Uint8List(next);
  }

  void _recordIoUse(int usedBytes) {
    if (_ioScratch.length <= _softIoScratchLimit) {
      _smallIoCount = 0;
      return;
    }
    if (usedBytes <= _defaultIoScratchBytes) {
      if (++_smallIoCount >= 16) {
        _ioScratch = Uint8List(_defaultIoScratchBytes);
        _smallIoCount = 0;
      }
    } else {
      _smallIoCount = 0;
    }
  }

  void shrinkScratch([int targetCapacity = _defaultIoScratchBytes]) {
    _smallIoCount = 0;
    if (_ioScratch.length > targetCapacity) {
      _ioScratch = Uint8List(targetCapacity);
    }
  }

  _OpenFlCacheFile? _lookupOpenFile(
    String entryKey,
    int width,
    int height,
    int frameCount,
    bool poster,
  ) {
    final existing = _openFiles.remove(entryKey);
    if (existing == null) return null;
    if (existing.width == width &&
        existing.height == height &&
        existing.frameCount == frameCount) {
      _openFiles[entryKey] = existing;
      return existing;
    }
    try {
      existing.handle.close();
    } catch (_) {}
    return null;
  }

  /// Tries to read and decode `[frameIndex]` from compressed RAM or disk `.flcache`
  /// into `dstBgra[0 .. width * height * 4)`. Returns `true` on valid cache hit.
  bool tryReadFrame({
    required String entryKey,
    required int width,
    required int height,
    required int totalFrames,
    required bool poster,
    required int frameIndex,
    required Uint8List dstBgra,
    TilePlaybackCursor? cursor,
  }) {
    lastFrameFpHi = 0;
    lastFrameFpLo = 0;
    final expectedBytes = width * height * 4;
    if (frameIndex < 0 ||
        frameIndex >= totalFrames ||
        dstBgra.length < expectedBytes) {
      return false;
    }

    final pageKey = (entryKey, frameIndex ~/ TilePlaybackPage.maxFrames);
    final page = _tilePages.remove(pageKey);
    if (page != null) {
      _tilePages[pageKey] = page;
      if (page.width == width &&
          page.height == height &&
          page.contains(frameIndex)) {
        page.lastUsed = ++_ramClock;
        page.read(frameIndex, dstBgra, cursor);
        if (computeFingerprints) {
          final (fpHi, fpLo) = page.fingerprintOf(frameIndex);
          lastFrameFpHi = fpHi;
          lastFrameFpLo = fpLo;
        }
        return true;
      }
    }
    cursor?.invalidate();

    // 1. Hot compressed-RAM LRU check.
    final ramKey = (entryKey, frameIndex);
    final ram = _ramLru.remove(ramKey);
    if (ram != null) {
      ram.lastUsed = ++_ramClock;
      _ramLru[ramKey] = ram;
      if (_decodePayload(
        ram.payload,
        0,
        ram.payload.length,
        ram.isRaw,
        dstBgra,
        expectedBytes,
      )) {
        readStats?.ramHits++;
        if (computeFingerprints) {
          if (ram.fpHi == 0 && ram.fpLo == 0) {
            final (fpHi, fpLo) = frameFingerprint(
              ram.crc31,
              ram.payload,
              0,
              ram.payload.length,
              ram.isRaw,
            );
            ram.fpHi = fpHi;
            ram.fpLo = fpLo;
          }
          lastFrameFpHi = ram.fpHi;
          lastFrameFpLo = ram.fpLo;
        }
        return true;
      }
      _removeRamKey(ramKey);
    }

    // 2. Disk `.flcache` check.
    final dir = _diskDir;
    if (dir == null || !isDiskCacheSupported) return false;
    final file = _openOrCreateFile(
      entryKey: entryKey,
      width: width,
      height: height,
      frameCount: totalFrames,
      poster: poster,
      createIfMissing: false,
    );
    if (file == null) return false;

    final offset = file.offsets[frameIndex];
    if (offset == 0) return false;
    final storedLen = file.lengths[frameIndex];
    final meta = file.metas[frameIndex];
    final isRaw = (meta >>> 31) != 0;
    final expectedCrc = meta & 0x7FFFFFFF;
    if (offset < file.payloadStart ||
        storedLen <= 0 ||
        storedLen > expectedBytes) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    final buf = _ensureIoScratch(storedLen);
    try {
      if (offset > file.handle.length - storedLen ||
          !file.handle.readExactAt(offset, buf, storedLen)) {
        _clearCorruptSlot(file, frameIndex);
        return false;
      }
    } catch (_) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    if (!_decodePayload(
      buf,
      0,
      storedLen,
      isRaw,
      dstBgra,
      expectedBytes,
      expectedCrc: expectedCrc,
    )) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    // Warm compressed RAM LRU on disk hit for repeated loops.
    var fpHi = 0;
    var fpLo = 0;
    if (computeFingerprints) {
      (fpHi, fpLo) = frameFingerprint(expectedCrc, buf, 0, storedLen, isRaw);
    }
    _putRam(
      ramKey: ramKey,
      bytes: buf,
      start: 0,
      length: storedLen,
      isRaw: isRaw,
      crc31: expectedCrc,
      fpHi: fpHi,
      fpLo: fpLo,
    );
    _recordIoUse(storedLen);
    lastFrameFpHi = fpHi;
    lastFrameFpLo = fpLo;
    readStats?.diskHits++;
    return true;
  }

  /// Compile a hot RAM page after replying to the current playback request.
  /// Cold frames, disk layout and first-frame latency use the existing path.
  bool preparePlaybackPage({
    required String entryKey,
    required int width,
    required int height,
    required int totalFrames,
    required int frameIndex,
  }) {
    const size = TilePlaybackPage.maxFrames;
    final pixels = width * height;
    if (frameIndex < 0 ||
        frameIndex >= totalFrames ||
        pixels > TilePlaybackPage.maxPixels ||
        pixels < 16 * 16 ||
        maximumRamBytes <= 0) {
      return false;
    }
    final first = (frameIndex ~/ size) * size;
    final end = math.min(first + size, totalFrames);
    if (end - first < 2) return false;
    final key = (entryKey, first ~/ size);
    if (_tilePages.containsKey(key) || _attemptedPages.contains(key)) {
      return false;
    }

    var originalBytes = 0;
    final frames = <int>[];
    for (var f = first; f < end; f++) {
      final frame = _ramLru[(entryKey, f)];
      if (frame != null) {
        originalBytes += frame.payload.length;
        frames.add(f);
      }
    }
    if (frames.length < 2) return false;
    final expectedBytes = pixels * 4;
    var scratch = _tileScratch;
    if (scratch == null || scratch.length < expectedBytes) {
      scratch = _tileScratch = Uint8List(expectedBytes);
    }
    final page = TilePlaybackPage.build(
      width: width,
      height: height,
      firstFrame: first,
      frames: frames,
      maxBytes: math.min(maximumRamBytes ~/ 8, originalBytes * 2),
      scratch: scratch,
      readFrame: (f, dst) {
        final ram = _ramLru[(entryKey, f)]!;
        return _decodePayload(
          ram.payload,
          0,
          ram.payload.length,
          ram.isRaw,
          dst,
          expectedBytes,
        );
      },
      getFingerprint: (f) {
        final ram = _ramLru[(entryKey, f)];
        if (ram == null) return (0, 0);
        if (computeFingerprints && ram.fpHi == 0 && ram.fpLo == 0) {
          final (fpHi, fpLo) = frameFingerprint(
            ram.crc31,
            ram.payload,
            0,
            ram.payload.length,
            ram.isRaw,
          );
          ram.fpHi = fpHi;
          ram.fpLo = fpLo;
        }
        return (ram.fpHi, ram.fpLo);
      },
    );
    if (page == null) {
      // Only blacklist a complete page that failed tile admission; partial pages
      // may succeed once the remaining frames of the window arrive.
      if (frames.length == end - first) {
        _attemptedPages.add(key);
        if (_attemptedPages.length > 128) {
          _attemptedPages.remove(_attemptedPages.first);
        }
      }
      return false;
    }
    for (final frame in frames) {
      _removeRamKey((entryKey, frame));
    }
    _makeRamRoom(page.bytes);
    page.lastUsed = ++_ramClock;
    _tilePages[key] = page;
    _tileBytes += page.bytes;
    return true;
  }

  /// Compresses `srcBgra[0 .. width * height * 4)` via LZ4 and saves into RAM LRU
  /// and (when enabled) append-only `<entryKey>.flcache`.
  ({int compressedBytes, int entryDiskBytes, int crc31, int fpHi, int fpLo})
  storeFrame({
    required String entryKey,
    required int width,
    required int height,
    required int totalFrames,
    required bool poster,
    required int frameIndex,
    required Uint8List srcBgra,
    required Lz4Scratch scratch,
  }) {
    final expectedBytes = width * height * 4;
    if (frameIndex < 0 ||
        frameIndex >= totalFrames ||
        srcBgra.length < expectedBytes) {
      return (
        compressedBytes: 0,
        entryDiskBytes: 0,
        crc31: 0,
        fpHi: 0,
        fpLo: 0,
      );
    }

    final pageKey = (entryKey, frameIndex ~/ TilePlaybackPage.maxFrames);
    _attemptedPages.remove(pageKey);
    if (_tilePages[pageKey]?.contains(frameIndex) ?? false) {
      _removeTilePage(pageKey);
    }

    final maxOut = Lz4Codec.maxCompressedLength(expectedBytes);
    final dst = scratch.ensureOutputCapacity(maxOut);
    final native = useNativeEncoder && expectedBytes > 0
        ? encodeCacheFrameNative(
            srcBgra,
            expectedBytes,
            dst,
            scratch.hashTable,
            _crcTable,
          )
        : null;
    final int written;
    if (native != null) {
      written = native.length;
      readStats?.nativeEncodes++;
    } else {
      written = Lz4Codec.compressInto(
        srcBgra,
        expectedBytes,
        dst,
        scratch.hashTable,
        abortAtLength: expectedBytes,
      );
      readStats?.dartEncodes++;
    }
    final bool isRaw;
    final Uint8List srcPayload;
    final int payloadLen;
    if (written < 0 || written >= expectedBytes) {
      isRaw = true;
      srcPayload = srcBgra;
      payloadLen = expectedBytes;
    } else {
      isRaw = false;
      srcPayload = dst;
      payloadLen = written;
    }
    final check = native?.crc ?? crc31(srcPayload, 0, payloadLen);
    var fpHi = 0;
    var fpLo = 0;
    if (computeFingerprints) {
      (fpHi, fpLo) = frameFingerprint(check, srcPayload, 0, payloadLen, isRaw);
    }
    lastFrameFpHi = fpHi;
    lastFrameFpLo = fpLo;

    _putRam(
      ramKey: (entryKey, frameIndex),
      totalFrames: totalFrames,
      bytes: srcPayload,
      start: 0,
      length: payloadLen,
      isRaw: isRaw,
      crc31: check,
      fpHi: fpHi,
      fpLo: fpLo,
    );
    scratch.recordOutputUse(maxOut);

    var diskSize = 0;
    final dir = _diskDir;
    if (dir != null && isDiskCacheSupported) {
      final file = _openOrCreateFile(
        entryKey: entryKey,
        width: width,
        height: height,
        frameCount: totalFrames,
        poster: poster,
        createIfMissing: true,
        minimumPayloadBytes: payloadLen,
      );
      if (file != null) {
        diskSize = _appendFrameToDisk(
          file,
          frameIndex,
          srcPayload,
          payloadLen,
          isRaw,
          check,
        );
      }
    }
    return (
      compressedBytes: payloadLen,
      entryDiskBytes: diskSize,
      crc31: check,
      fpHi: fpHi,
      fpLo: fpLo,
    );
  }

  bool deleteDiskEntry(String entryKey) {
    final open = _openFiles.remove(entryKey);
    if (open != null) {
      try {
        open.handle.close();
      } catch (_) {}
    }
    final dir = _diskDir;
    if (dir == null || !isDiskCacheSupported) return false;
    return PlatformDiskFs.deleteFile(joinPath(dir, '$entryKey.flcache'));
  }

  void evictEntryRam(String entryKey) {
    for (final key in _tilePages.keys.where((k) => k.$1 == entryKey).toList()) {
      _removeTilePage(key);
    }
    _attemptedPages.removeWhere((key) => key.$1 == entryKey);
    _oversizedEntries.remove(entryKey);
    _entryTotalFrames.remove(entryKey);
    _entryRamBytes.remove(entryKey);
    final frames = _ramFramesByEntry.remove(entryKey);
    if (frames == null) return;
    for (final frameIndex in frames) {
      final evicted = _ramLru.remove((entryKey, frameIndex));
      if (evicted != null) {
        _ramBytes -= evicted.payload.length;
      }
    }
  }

  void closeOpenFiles() {
    for (final open in _openFiles.values) {
      try {
        open.handle.close();
      } catch (_) {}
    }
    _openFiles.clear();
  }

  void clearRam() {
    _ramLru.clear();
    _ramFramesByEntry.clear();
    _entryRamBytes.clear();
    _entryTotalFrames.clear();
    _oversizedEntries.clear();
    _ramBytes = 0;
    _tilePages.clear();
    _attemptedPages.clear();
    _tileBytes = 0;
    _tileScratch = null;
    shrinkScratch();
  }

  void dispose() {
    closeOpenFiles();
    clearRam();
  }

  bool _decodePayload(
    Uint8List src,
    int offset,
    int length,
    bool isRaw,
    Uint8List dstBgra,
    int expectedBytes, {
    int? expectedCrc,
  }) {
    if (useNativeDecoder) {
      final decoded = decodeCacheFrameNative(
        src,
        offset,
        length,
        dstBgra,
        expectedBytes,
        isRaw,
        expectedCrc,
        _crcTable,
      );
      if (decoded != null) {
        readStats?.nativeDecodes++;
        return decoded;
      }
    }
    readStats?.dartDecodes++;
    if (expectedCrc != null && crc31(src, offset, length) != expectedCrc) {
      return false;
    }
    if (isRaw) {
      if (length != expectedBytes) return false;
      dstBgra.setRange(0, expectedBytes, src, offset);
      return true;
    }
    try {
      final decoded = Lz4Codec.decompressInto(
        src,
        offset,
        length,
        dstBgra,
        expectedBytes,
      );
      assert(decoded == expectedBytes);
      return true;
    } on FormatException {
      return false;
    }
  }

  void _putRam({
    required _RamKey ramKey,
    int totalFrames = 0,
    required Uint8List bytes,
    required int start,
    required int length,
    required bool isRaw,
    required int crc31,
    required int fpHi,
    required int fpLo,
  }) {
    if (maximumRamBytes <= 0 || length > maximumRamBytes) return;
    final entryKey = ramKey.$1;
    if (totalFrames > 0) {
      _entryTotalFrames[entryKey] = totalFrames;
    }
    _removeRamKey(ramKey);
    // Estimate whether this entry can fit its full loop BEFORE evicting others:
    // if even with this incoming frame it exceeds shard RAM, mark it oversized
    // immediately so it self-evicts instead of cannibalizing complete short loops.
    final prevSet = _ramFramesByEntry[entryKey];
    final nextCount = (prevSet?.length ?? 0) + 1;
    final nextBytes = (_entryRamBytes[entryKey] ?? 0) + length;
    _updateOversizedFlag(entryKey, nextCount, nextBytes);
    final isOversized = _oversizedEntries.contains(entryKey);
    if (isOversized) {
      // Evict only oversized entries' frames; never cannibalize smaller loops
      // that can fit completely in RAM just to buffer an un-cacheable stream.
      _evictOversizedFor(length);
      if (ramBytes + length > maximumRamBytes) return;
    } else {
      _makeRamRoom(length, protectedEntry: entryKey);
    }
    final copy = Uint8List(length)..setRange(0, length, bytes, start);
    final frame = _RamFrame(
      payload: copy,
      isRaw: isRaw,
      crc31: crc31,
      fpHi: fpHi,
      fpLo: fpLo,
      lastUsed: ++_ramClock,
    );
    _ramLru[ramKey] = frame;
    final set = (_ramFramesByEntry[entryKey] ??= <int>{})..add(ramKey.$2);
    _ramBytes += length;
    final updatedEntryBytes = (_entryRamBytes[entryKey] ?? 0) + length;
    _entryRamBytes[entryKey] = updatedEntryBytes;
    _updateOversizedFlag(entryKey, set.length, updatedEntryBytes);
  }

  void _updateOversizedFlag(String entryKey, int cachedCount, int entryBytes) {
    final total = _entryTotalFrames[entryKey] ?? 0;
    if (total > 0 && cachedCount >= 1 && cachedCount < total) {
      final estimatedLoopBytes = (entryBytes * total) ~/ cachedCount;
      // On frame 1 require a 1.25x margin (frame 0 can be denser/lighter);
      // from frame 2 onward use the direct loop estimate.
      final threshold = cachedCount == 1
          ? (maximumRamBytes * 5) ~/ 4
          : maximumRamBytes;
      if (estimatedLoopBytes > threshold) {
        _oversizedEntries.add(entryKey);
        return;
      }
    }
    _oversizedEntries.remove(entryKey);
  }

  void _removeTilePage(_RamKey key) {
    final removed = _tilePages.remove(key);
    if (removed != null) _tileBytes -= removed.bytes;
  }

  void _evictOversizedFor(int added) {
    while (ramBytes + added > maximumRamBytes && _oversizedEntries.isNotEmpty) {
      String? victimEntry;
      for (final candidate in _oversizedEntries) {
        final frames = _ramFramesByEntry[candidate];
        if (frames != null && frames.isNotEmpty) {
          victimEntry = candidate;
          break;
        }
      }
      if (victimEntry == null) {
        _oversizedEntries.clear();
        break;
      }
      _removeRamKey((victimEntry, _ramFramesByEntry[victimEntry]!.first));
    }
  }

  void _makeRamRoom(int added, {String? protectedEntry}) {
    while (ramBytes + added > maximumRamBytes) {
      // Scan/loop-resistant eviction: evict frames from un-cacheable giant
      // loops before cannibalizing smaller loops that can warm completely and
      // release their compiled scenes.
      var evictedOversized = false;
      if (_oversizedEntries.isNotEmpty) {
        String? victimEntry;
        for (final candidate in _oversizedEntries) {
          final frames = _ramFramesByEntry[candidate];
          if (frames == null || frames.isEmpty) continue;
          if (candidate != protectedEntry) {
            victimEntry = candidate;
            break;
          }
          victimEntry ??= candidate;
        }
        if (victimEntry != null) {
          final frames = _ramFramesByEntry[victimEntry];
          if (frames != null && frames.isNotEmpty) {
            _removeRamKey((victimEntry, frames.first));
            evictedOversized = true;
          } else {
            _oversizedEntries.remove(victimEntry);
          }
        }
      }
      if (evictedOversized) continue;

      final hasRam = _ramLru.isNotEmpty;
      final hasTile = _tilePages.isNotEmpty;
      if (hasRam && hasTile) {
        if (_ramLru.values.first.lastUsed <= _tilePages.values.first.lastUsed) {
          _removeRamKey(_ramLru.keys.first);
        } else {
          _removeTilePage(_tilePages.keys.first);
        }
      } else if (hasRam) {
        _removeRamKey(_ramLru.keys.first);
      } else if (hasTile) {
        _removeTilePage(_tilePages.keys.first);
      } else {
        break;
      }
    }
  }

  void _removeRamKey(_RamKey ramKey) {
    final removed = _ramLru.remove(ramKey);
    if (removed == null) return;
    final entryKey = ramKey.$1;
    _ramBytes -= removed.payload.length;
    final remaining = (_entryRamBytes[entryKey] ?? 0) - removed.payload.length;
    final set = _ramFramesByEntry[entryKey];
    if (set != null) {
      set.remove(ramKey.$2);
      if (set.isEmpty) {
        _ramFramesByEntry.remove(entryKey);
        _entryRamBytes.remove(entryKey);
        _oversizedEntries.remove(entryKey);
      } else {
        _entryRamBytes[entryKey] = remaining > 0 ? remaining : 0;
        _updateOversizedFlag(entryKey, set.length, _entryRamBytes[entryKey]!);
      }
    } else {
      _entryRamBytes.remove(entryKey);
      _oversizedEntries.remove(entryKey);
    }
  }

  _OpenFlCacheFile? _openOrCreateFile({
    required String entryKey,
    required int width,
    required int height,
    required int frameCount,
    required bool poster,
    required bool createIfMissing,
    int minimumPayloadBytes = 1,
  }) {
    // Leave room for the frame payload. Check before multiplying or
    // opening a file, since frameCount comes from the authored composition.
    if (maximumDiskBytes <= headerSize + minimumPayloadBytes) return null;
    final maxIndexBytes = math.min(
      _maximumIndexBytes,
      maximumDiskBytes - headerSize - minimumPayloadBytes,
    );
    if (frameCount <= 0 || frameCount > maxIndexBytes ~/ slotSize) return null;
    final existing = _lookupOpenFile(
      entryKey,
      width,
      height,
      frameCount,
      poster,
    );
    if (existing != null) return existing;

    final dir = _diskDir;
    if (dir == null) return null;
    final path = joinPath(dir, '$entryKey.flcache');
    if (!createIfMissing && !PlatformDiskFs.exists(path)) return null;

    final maxOpen = math.max(1, maximumOpenFiles);
    while (_openFiles.length >= maxOpen) {
      final oldestKey = _openFiles.keys.first;
      final victim = _openFiles.remove(oldestKey);
      readStats?.fileEvictions++;
      try {
        victim?.handle.close();
      } catch (_) {}
    }

    final handle = PlatformDiskFs.openReadWrite(path);
    if (handle == null) return null;
    readStats?.fileOpens++;

    final expectedBytes = width * height * 4;
    final payloadStart = headerSize + frameCount * slotSize;

    try {
      final len = handle.length;
      if (len >= payloadStart &&
          handle.readExactAt(0, _headerScratch, headerSize)) {
        final bd = ByteData.sublistView(_headerScratch);
        final fileMagic = bd.getUint32(0, Endian.little);
        final fileVersion = bd.getUint32(4, Endian.little);
        final fw = bd.getInt32(8, Endian.little);
        final fh = bd.getInt32(12, Endian.little);
        final fCount = bd.getInt32(16, Endian.little);
        final flags = bd.getUint32(20, Endian.little);
        final fUncomp = bd.getUint32(28, Endian.little);

        if (fileMagic == magic &&
            fileVersion == version &&
            fw == width &&
            fh == height &&
            fCount == frameCount &&
            fUncomp == expectedBytes) {
          final indexBytesLen = frameCount * slotSize;
          final idxBuf = _ensureIoScratch(indexBytesLen);
          if (handle.readExactAt(headerSize, idxBuf, indexBytesLen)) {
            final ibd = ByteData.sublistView(idxBuf, 0, indexBytesLen);
            final offsets = Uint64List(frameCount);
            final lengths = Uint32List(frameCount);
            final metas = Uint32List(frameCount);
            var validCount = 0;
            var wipedSlots = false;
            var maxEnd = payloadStart;
            for (var i = 0; i < frameCount; i++) {
              final s = i * slotSize;
              final off = ibd.getUint64(s, Endian.little);
              final l = ibd.getUint32(s + 8, Endian.little);
              final m = ibd.getUint32(s + 12, Endian.little);
              if (off == 0) continue;
              if (off >= payloadStart &&
                  l > 0 &&
                  l <= expectedBytes &&
                  off <= len - l) {
                offsets[i] = off;
                lengths[i] = l;
                metas[i] = m;
                validCount++;
                maxEnd = math.max(maxEnd, off + l);
              } else {
                // Wipe out-of-bounds truncated slot.
                recoveredCorruptions++;
                wipedSlots = true;
                _slotScratch.fillRange(0, slotSize, 0);
                handle.writeAt(headerSize + s, _slotScratch, 0, slotSize);
              }
            }
            if (maxEnd < len) {
              // Trim dangling incomplete frame tail left by an interrupted write.
              recoveredCorruptions++;
              handle.truncate(maxEnd);
            }
            final completed =
                (flags & flagCompleted) != 0 && validCount == frameCount;
            if (wipedSlots) {
              final nextFlags =
                  (flags & ~flagCompleted) | (completed ? flagCompleted : 0);
              final hbd = ByteData.sublistView(_headerScratch);
              hbd.setUint32(0, nextFlags, Endian.little);
              hbd.setUint32(4, validCount, Endian.little);
              handle.writeAt(20, _headerScratch, 0, 8);
            }
            final opened = _OpenFlCacheFile(
              entryKey: entryKey,
              path: path,
              handle: handle,
              width: width,
              height: height,
              frameCount: frameCount,
              uncompressedFrameBytes: expectedBytes,
              poster: poster,
              completed: completed,
              writtenCount: validCount,
              fileBytes: maxEnd,
              offsets: offsets,
              lengths: lengths,
              metas: metas,
            );
            _openFiles[entryKey] = opened;
            return opened;
          }
        }
        // Header mismatch or corrupt existing file.
        recoveredCorruptions++;
        if (!createIfMissing) {
          handle.close();
          PlatformDiskFs.deleteFile(path);
          return null;
        }
      } else if (!createIfMissing) {
        recoveredCorruptions++;
        handle.close();
        PlatformDiskFs.deleteFile(path);
        return null;
      }

      // Initialize clean `.flcache` header + empty index table.
      handle.truncate(0);
      _headerScratch.fillRange(0, headerSize, 0);
      final hbd = ByteData.sublistView(_headerScratch);
      hbd.setUint32(0, magic, Endian.little);
      hbd.setUint32(4, version, Endian.little);
      hbd.setInt32(8, width, Endian.little);
      hbd.setInt32(12, height, Endian.little);
      hbd.setInt32(16, frameCount, Endian.little);
      hbd.setUint32(20, poster ? flagPoster : 0, Endian.little);
      hbd.setUint32(24, 0, Endian.little);
      hbd.setUint32(28, expectedBytes, Endian.little);
      handle.writeAt(0, _headerScratch, 0, headerSize);

      final indexBytesLen = frameCount * slotSize;
      final zeroIdx = _ensureIoScratch(indexBytesLen);
      zeroIdx.fillRange(0, indexBytesLen, 0);
      handle.writeAt(headerSize, zeroIdx, 0, indexBytesLen);

      final created = _OpenFlCacheFile(
        entryKey: entryKey,
        path: path,
        handle: handle,
        width: width,
        height: height,
        frameCount: frameCount,
        uncompressedFrameBytes: expectedBytes,
        poster: poster,
        completed: false,
        writtenCount: 0,
        fileBytes: payloadStart,
        offsets: Uint64List(frameCount),
        lengths: Uint32List(frameCount),
        metas: Uint32List(frameCount),
      );
      _openFiles[entryKey] = created;
      return created;
    } catch (_) {
      recoveredCorruptions++;
      try {
        handle.close();
      } catch (_) {}
      PlatformDiskFs.deleteFile(path);
      return null;
    }
  }

  int _appendFrameToDisk(
    _OpenFlCacheFile file,
    int frameIndex,
    Uint8List payload,
    int payloadLen,
    bool isRaw,
    int check,
  ) {
    // Already recorded on disk? Return current file size without duplicating.
    if (file.offsets[frameIndex] != 0) {
      return file.fileBytes;
    }
    try {
      final writeOffset = math.max(file.payloadStart, file.handle.length);
      file.handle.writeAt(writeOffset, payload, 0, payloadLen);

      final meta = (isRaw ? (1 << 31) : 0) | (check & 0x7FFFFFFF);
      final sbd = ByteData.sublistView(_slotScratch);
      sbd.setUint64(0, writeOffset, Endian.little);
      sbd.setUint32(8, payloadLen, Endian.little);
      sbd.setUint32(12, meta, Endian.little);
      file.handle.writeAt(
        headerSize + frameIndex * slotSize,
        _slotScratch,
        0,
        slotSize,
      );

      file.offsets[frameIndex] = writeOffset;
      file.lengths[frameIndex] = payloadLen;
      file.metas[frameIndex] = meta;
      file.writtenCount++;
      file.fileBytes = writeOffset + payloadLen;

      final nowComplete = file.writtenCount >= file.frameCount;
      final flags =
          (file.poster ? flagPoster : 0) | (nowComplete ? flagCompleted : 0);
      file.completed = nowComplete;
      final hbd = ByteData.sublistView(_headerScratch);
      hbd.setUint32(0, flags, Endian.little);
      hbd.setUint32(4, file.writtenCount, Endian.little);
      file.handle.writeAt(20, _headerScratch, 0, 8);
      return file.fileBytes;
    } catch (_) {
      recoveredCorruptions++;
      return file.fileBytes;
    }
  }

  void _clearCorruptSlot(_OpenFlCacheFile file, int frameIndex) {
    recoveredCorruptions++;
    if (file.offsets[frameIndex] != 0) {
      file.offsets[frameIndex] = 0;
      file.lengths[frameIndex] = 0;
      file.metas[frameIndex] = 0;
      if (file.writtenCount > 0) file.writtenCount--;
    }
    file.completed = false;
    try {
      _slotScratch.fillRange(0, slotSize, 0);
      file.handle.writeAt(
        headerSize + frameIndex * slotSize,
        _slotScratch,
        0,
        slotSize,
      );
      final hbd = ByteData.sublistView(_headerScratch);
      hbd.setUint32(0, file.poster ? flagPoster : 0, Endian.little);
      hbd.setUint32(4, file.writtenCount, Endian.little);
      file.handle.writeAt(20, _headerScratch, 0, 8);
    } catch (_) {}
  }
}
