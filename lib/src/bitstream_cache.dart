import 'dart:math' as math;
import 'dart:typed_data';

import 'lz4.dart';
import 'platform_stub.dart' if (dart.library.io) 'platform_io.dart';

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

final class _RamFrame {
  _RamFrame({
    required this.ramKey,
    required this.entryKey,
    required this.payload,
    required this.isRaw,
    required this.crc31,
  });

  final String ramKey;
  final String entryKey;
  final Uint8List payload;
  final bool isRaw;
  final int crc31;
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
    this.maximumRamBytes = 4 * 1024 * 1024,
    this.maximumOpenFiles = 16,
  }) : _diskDir = (diskCacheDirectory == null || diskCacheDirectory.isEmpty)
           ? null
           : diskCacheDirectory {
    if (_diskDir != null && isDiskCacheSupported) {
      PlatformDiskFs.ensureDirectory(_diskDir!);
    }
  }

  static const int magic = 0x464C4331; // 'FLC1'
  static const int version = 1;
  static const int headerSize = 32;
  static const int slotSize = 16;
  static const int flagCompleted = 1 << 0;
  static const int flagPoster = 1 << 1;

  static final Uint32List _crcTable = _buildCrc32Table();

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

  static int crc31(Uint8List data, int offset, int length) {
    var crc = 0xFFFFFFFF;
    final end = offset + length;
    final table = _crcTable;
    for (var i = offset; i < end; i++) {
      crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) & 0x7FFFFFFF;
  }

  String? _diskDir;
  int maximumRamBytes;
  final int maximumOpenFiles;

  final _ramLru = <String, _RamFrame>{};
  final _ramKeysByEntry = <String, Set<String>>{};
  int _ramBytes = 0;

  final _openFiles = <String, _OpenFlCacheFile>{};
  final _headerScratch = Uint8List(headerSize);
  final _slotScratch = Uint8List(slotSize);
  Uint8List _ioScratch = Uint8List(64 * 1024);

  int recoveredCorruptions = 0;
  int get ramBytes => _ramBytes;
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
    return _ioScratch = Uint8List(next);
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
  }) {
    final expectedBytes = width * height * 4;
    if (frameIndex < 0 ||
        frameIndex >= totalFrames ||
        dstBgra.length < expectedBytes) {
      return false;
    }

    // 1. Hot compressed-RAM LRU check.
    final ramKey = '$entryKey#$frameIndex';
    final ram = _ramLru.remove(ramKey);
    if (ram != null) {
      _ramLru[ramKey] = ram;
      if (_decodePayload(
        ram.payload,
        0,
        ram.payload.length,
        ram.isRaw,
        ram.crc31,
        dstBgra,
        expectedBytes,
      )) {
        return true;
      }
      _removeRamKey(ramKey);
    }

    // 2. Disk `.flcache` check.
    final dir = _diskDir;
    if (dir == null || !isDiskCacheSupported) return false;
    final path = joinPath(dir, '$entryKey.flcache');
    if (!_openFiles.containsKey(entryKey) && !PlatformDiskFs.exists(path)) {
      return false;
    }
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
    final payloadStart = file.payloadStart;
    final currentLen = file.handle.length;

    if (offset < payloadStart ||
        storedLen <= 0 ||
        storedLen > expectedBytes ||
        offset + storedLen > currentLen) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    final buf = _ensureIoScratch(storedLen);
    if (!file.handle.readExactAt(offset, buf, storedLen)) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    if (!_decodePayload(
      buf,
      0,
      storedLen,
      isRaw,
      expectedCrc,
      dstBgra,
      expectedBytes,
    )) {
      _clearCorruptSlot(file, frameIndex);
      return false;
    }

    // Warm compressed RAM LRU on disk hit for repeated loops.
    _putRam(
      ramKey: ramKey,
      entryKey: entryKey,
      bytes: buf,
      start: 0,
      length: storedLen,
      isRaw: isRaw,
      crc31: expectedCrc,
    );
    return true;
  }

  /// Compresses `srcBgra[0 .. width * height * 4)` via LZ4 and saves into RAM LRU
  /// and (when enabled) append-only `<entryKey>.flcache`.
  ({int compressedBytes, int entryDiskBytes}) storeFrame({
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
      return (compressedBytes: 0, entryDiskBytes: 0);
    }

    final maxOut = Lz4Codec.maxCompressedLength(expectedBytes);
    final dst = scratch.ensureOutputCapacity(maxOut);
    final written = Lz4Codec.compressInto(
      srcBgra,
      expectedBytes,
      dst,
      scratch.hashTable,
      abortAtLength: expectedBytes,
    );
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
    final check = crc31(srcPayload, 0, payloadLen);
    final ramKey = '$entryKey#$frameIndex';
    _putRam(
      ramKey: ramKey,
      entryKey: entryKey,
      bytes: srcPayload,
      start: 0,
      length: payloadLen,
      isRaw: isRaw,
      crc31: check,
    );

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
    return (compressedBytes: payloadLen, entryDiskBytes: diskSize);
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
    final keys = _ramKeysByEntry.remove(entryKey);
    if (keys == null) return;
    for (final k in keys) {
      final evicted = _ramLru.remove(k);
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
    _ramKeysByEntry.clear();
    _ramBytes = 0;
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
    int expectedCrc,
    Uint8List dstBgra,
    int expectedBytes,
  ) {
    if (crc31(src, offset, length) != expectedCrc) return false;
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
      return decoded == expectedBytes;
    } on FormatException {
      return false;
    }
  }

  void _putRam({
    required String ramKey,
    required String entryKey,
    required Uint8List bytes,
    required int start,
    required int length,
    required bool isRaw,
    required int crc31,
  }) {
    if (maximumRamBytes <= 0 || length > maximumRamBytes) return;
    _removeRamKey(ramKey);
    while (_ramBytes + length > maximumRamBytes && _ramLru.isNotEmpty) {
      final oldestKey = _ramLru.keys.first;
      _removeRamKey(oldestKey);
    }
    final copy = Uint8List.fromList(bytes.sublist(start, start + length));
    final frame = _RamFrame(
      ramKey: ramKey,
      entryKey: entryKey,
      payload: copy,
      isRaw: isRaw,
      crc31: crc31,
    );
    _ramLru[ramKey] = frame;
    (_ramKeysByEntry[entryKey] ??= <String>{}).add(ramKey);
    _ramBytes += length;
  }

  void _removeRamKey(String ramKey) {
    final removed = _ramLru.remove(ramKey);
    if (removed == null) return;
    _ramBytes -= removed.payload.length;
    final set = _ramKeysByEntry[removed.entryKey];
    if (set != null) {
      set.remove(ramKey);
      if (set.isEmpty) _ramKeysByEntry.remove(removed.entryKey);
    }
  }

  _OpenFlCacheFile? _openOrCreateFile({
    required String entryKey,
    required int width,
    required int height,
    required int frameCount,
    required bool poster,
    required bool createIfMissing,
  }) {
    final existing = _openFiles.remove(entryKey);
    if (existing != null) {
      if (existing.width == width &&
          existing.height == height &&
          existing.frameCount == frameCount &&
          existing.poster == poster) {
        _openFiles[entryKey] = existing;
        return existing;
      }
      try {
        existing.handle.close();
      } catch (_) {}
    }

    final dir = _diskDir;
    if (dir == null) return null;
    final path = joinPath(dir, '$entryKey.flcache');
    if (!createIfMissing && !PlatformDiskFs.exists(path)) return null;

    while (_openFiles.length >= maximumOpenFiles) {
      final oldestKey = _openFiles.keys.first;
      final victim = _openFiles.remove(oldestKey);
      try {
        victim?.handle.close();
      } catch (_) {}
    }

    final handle = PlatformDiskFs.openReadWrite(path);
    if (handle == null) return null;

    final expectedBytes = width * height * 4;
    final payloadStart = headerSize + frameCount * slotSize;

    try {
      final len = handle.length;
      if (len >= payloadStart && handle.readExactAt(0, _headerScratch, headerSize)) {
        final bd = ByteData.sublistView(_headerScratch);
        final fileMagic = bd.getUint32(0, Endian.little);
        final fileVersion = bd.getUint32(4, Endian.little);
        final fw = bd.getInt32(8, Endian.little);
        final fh = bd.getInt32(12, Endian.little);
        final fCount = bd.getInt32(16, Endian.little);
        final flags = bd.getUint32(20, Endian.little);
        final fUncomp = bd.getUint32(28, Endian.little);
        final isPoster = (flags & flagPoster) != 0;

        if (fileMagic == magic &&
            fileVersion == version &&
            fw == width &&
            fh == height &&
            fCount == frameCount &&
            isPoster == poster &&
            fUncomp == expectedBytes) {
          final indexBytesLen = frameCount * slotSize;
          final idxBuf = _ensureIoScratch(indexBytesLen);
          if (handle.readExactAt(headerSize, idxBuf, indexBytesLen)) {
            final ibd = ByteData.sublistView(idxBuf, 0, indexBytesLen);
            final offsets = Uint64List(frameCount);
            final lengths = Uint32List(frameCount);
            final metas = Uint32List(frameCount);
            var validCount = 0;
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
                  off + l <= len) {
                offsets[i] = off;
                lengths[i] = l;
                metas[i] = m;
                validCount++;
                maxEnd = math.max(maxEnd, off + l);
              } else {
                // Wipe out-of-bounds truncated slot.
                recoveredCorruptions++;
                _slotScratch.fillRange(0, slotSize, 0);
                handle.writeAt(headerSize + s, _slotScratch, 0, slotSize);
              }
            }
            if (maxEnd < len) {
              // Trim dangling incomplete frame tail left by an interrupted write.
              recoveredCorruptions++;
              handle.truncate(maxEnd);
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
              completed:
                  (flags & flagCompleted) != 0 && validCount == frameCount,
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
