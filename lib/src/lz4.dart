import 'dart:math' as math;
import 'dart:typed_data';

/// Pure-Dart LZ4 block compressor and bounds-checked decompressor.
///
/// Designed for repeated per-frame raster buffers: callers can reuse
/// [Lz4Scratch] across frames for zero heap allocations on worker isolates.
class Lz4Scratch {
  Lz4Scratch({int initialOutputCapacity = 128 * 1024})
    : hashTable = Int32List(Lz4Codec._hashTableSize),
      outputBuffer = Uint8List(initialOutputCapacity);

  final Int32List hashTable;
  Uint8List outputBuffer;

  Uint8List ensureOutputCapacity(int minBytes) {
    if (outputBuffer.length >= minBytes) return outputBuffer;
    var next = outputBuffer.length;
    while (next < minBytes) {
      next = next * 2;
    }
    return outputBuffer = Uint8List(next);
  }
}

abstract final class Lz4Codec {
  static const int _minMatch = 4;
  static const int _mfLimit = 12;
  static const int _lastLiterals = 5;
  static const int _hashLog = 14;
  static const int _hashTableSize = 1 << _hashLog;
  static const int _maxDistance = 65535;
  static const int _skipTrigger = 6;

  static int maxCompressedLength(int inputLength) =>
      inputLength + (inputLength ~/ 255) + 16;

  static int _hash4(int v) => ((v * 2654435761) & 0xFFFFFFFF) >>> (32 - _hashLog);

  static int _readU32LE(Uint8List b, int i) =>
      b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24);

  /// Compresses [src] `[0..srcLength)` into [dst].
  ///
  /// Returns compressed byte length (`>= 1`), or `-1` if output reaches
  /// [abortAtLength] (e.g. `srcLength`, indicating raw storage is smaller).
  static int compressInto(
    Uint8List src,
    int srcLength,
    Uint8List dst,
    Int32List hashTable, {
    int abortAtLength = -1,
  }) {
    if (srcLength < 0 || srcLength > src.length) {
      throw RangeError.range(srcLength, 0, src.length, 'srcLength');
    }
    if (srcLength == 0) return 0;

    final maxAbort = abortAtLength >= 0 ? abortAtLength : dst.length;
    var out = 0;
    var anchor = 0;

    if (srcLength >= _mfLimit + 1) {
      hashTable.fillRange(0, _hashTableSize, -1);
      final mflimit = srcLength - _mfLimit;
      final matchLimit = srcLength - _lastLiterals;

      var ip = 0;
      hashTable[_hash4(_readU32LE(src, 0))] = 0;
      ip = 1;
      var forwardH = _hash4(_readU32LE(src, ip));

      outer:
      while (true) {
        var step = 1;
        var searchMatchNb = 1 << _skipTrigger;
        var forwardIp = ip;
        int matchIdx;

        do {
          final h = forwardH;
          ip = forwardIp;
          forwardIp += step;
          step = searchMatchNb >> _skipTrigger;
          searchMatchNb++;
          if (forwardIp > mflimit) break outer;

          forwardH = _hash4(_readU32LE(src, forwardIp));
          matchIdx = hashTable[h];
          hashTable[h] = ip;
        } while (matchIdx < 0 ||
            (ip - matchIdx) > _maxDistance ||
            _readU32LE(src, matchIdx) != _readU32LE(src, ip));

        // Catch up backwards while ip > anchor and matchIdx > 0 match.
        while (ip > anchor && matchIdx > 0 && src[ip - 1] == src[matchIdx - 1]) {
          ip--;
          matchIdx--;
        }

        // Write literals [anchor .. ip) + match.
        while (true) {
          final litLength = ip - anchor;
          final tokenPos = out;
          // Worst-case token + extra len + literals + 2B offset check
          if (tokenPos + 1 + (litLength ~/ 255) + 1 + litLength + 2 > maxAbort) {
            return -1;
          }
          out++;
          var token = (litLength >= 15 ? 15 : litLength) << 4;
          if (litLength >= 15) {
            var rem = litLength - 15;
            while (rem >= 255) {
              dst[out++] = 255;
              rem -= 255;
            }
            dst[out++] = rem;
          }
          // Copy literals.
          for (var i = 0; i < litLength; i++) {
            dst[out++] = src[anchor + i];
          }

          // Encode match offset (little-endian).
          final offset = ip - matchIdx;
          dst[out++] = offset & 0xFF;
          dst[out++] = (offset >> 8) & 0xFF;

          // Count extra match bytes beyond MINMATCH.
          var mCur = matchIdx + _minMatch;
          var iCur = ip + _minMatch;
          while (iCur < matchLimit && src[iCur] == src[mCur]) {
            iCur++;
            mCur++;
          }
          final matchCode = (iCur - ip) - _minMatch;
          if (matchCode >= 15) {
            token |= 15;
            var rem = matchCode - 15;
            final extraBytes = (rem ~/ 255) + 1;
            if (out + extraBytes >= maxAbort) return -1;
            while (rem >= 255) {
              dst[out++] = 255;
              rem -= 255;
            }
            dst[out++] = rem;
          } else {
            token |= matchCode;
          }
          dst[tokenPos] = token;

          ip = iCur;
          anchor = ip;

          if (ip > mflimit) break outer;

          // Fill hash table at ip - 2 before trying chained match.
          hashTable[_hash4(_readU32LE(src, ip - 2))] = ip - 2;
          final h = _hash4(_readU32LE(src, ip));
          matchIdx = hashTable[h];
          hashTable[h] = ip;
          if (matchIdx < 0 ||
              (ip - matchIdx) > _maxDistance ||
              _readU32LE(src, matchIdx) != _readU32LE(src, ip)) {
            ip++;
            forwardH = _hash4(_readU32LE(src, ip));
            break;
          }
        }
      }
    }

    // Encode last literals [anchor .. srcLength).
    final lastLiterals = srcLength - anchor;
    final needed = 1 + (lastLiterals >= 15 ? ((lastLiterals - 15) ~/ 255) + 1 : 0) + lastLiterals;
    if (out + needed > maxAbort || out + needed > dst.length) return -1;

    if (lastLiterals >= 15) {
      dst[out++] = 0xF0;
      var rem = lastLiterals - 15;
      while (rem >= 255) {
        dst[out++] = 255;
        rem -= 255;
      }
      dst[out++] = rem;
    } else {
      dst[out++] = lastLiterals << 4;
    }
    dst.setRange(out, out + lastLiterals, src, anchor);
    out += lastLiterals;
    return out;
  }

  /// Decompresses LZ4 block bytes `src[srcOffset .. srcOffset + srcLength)` into
  /// `dst[0 .. dstLength)`. Returns bytes written, throwing [FormatException]
  /// on corrupt/truncated input or output overflow.
  static int decompressInto(
    Uint8List src,
    int srcOffset,
    int srcLength,
    Uint8List dst,
    int dstLength,
  ) {
    if (srcOffset < 0 ||
        srcLength < 0 ||
        srcOffset + srcLength > src.length ||
        dstLength < 0 ||
        dstLength > dst.length) {
      throw RangeError('Invalid LZ4 slice bounds');
    }
    if (srcLength == 0) {
      if (dstLength != 0) throw const FormatException('Empty LZ4 block');
      return 0;
    }

    var ip = srcOffset;
    final ipEnd = srcOffset + srcLength;
    var op = 0;

    while (ip < ipEnd) {
      final token = src[ip++];
      var litLen = token >> 4;
      if (litLen == 15) {
        while (true) {
          if (ip >= ipEnd) throw const FormatException('Truncated LZ4 literal len');
          final add = src[ip++];
          litLen += add;
          if (add != 255) break;
        }
      }
      if (ip + litLen > ipEnd || op + litLen > dstLength) {
        throw const FormatException('LZ4 literal out of bounds');
      }
      if (litLen > 0) {
        dst.setRange(op, op + litLen, src, ip);
        ip += litLen;
        op += litLen;
      }

      if (ip >= ipEnd) break;

      if (ip + 2 > ipEnd) {
        throw const FormatException('Truncated LZ4 match offset');
      }
      final offset = src[ip] | (src[ip + 1] << 8);
      ip += 2;
      if (offset <= 0 || offset > op) {
        throw const FormatException('Invalid LZ4 match offset');
      }

      var matchLen = (token & 0x0F) + _minMatch;
      if ((token & 0x0F) == 15) {
        while (true) {
          if (ip >= ipEnd) throw const FormatException('Truncated LZ4 match len');
          final add = src[ip++];
          matchLen += add;
          if (add != 255) break;
        }
      }
      if (op + matchLen > dstLength) {
        throw const FormatException('LZ4 match out of output bounds');
      }

      var matchPos = op - offset;
      final endOp = op + matchLen;
      if (offset >= matchLen) {
        dst.setRange(op, endOp, dst, matchPos);
        op = endOp;
      } else if (offset == 4) {
        // Fast path for repeated 32-bit pixels (transparent edges / flat fills).
        final b0 = dst[matchPos];
        final b1 = dst[matchPos + 1];
        final b2 = dst[matchPos + 2];
        final b3 = dst[matchPos + 3];
        if (b0 == 0 && b1 == 0 && b2 == 0 && b3 == 0) {
          dst.fillRange(op, endOp, 0);
          op = endOp;
        } else {
          final quadEnd = op + ((matchLen) & ~3);
          while (op < quadEnd) {
            dst[op] = b0;
            dst[op + 1] = b1;
            dst[op + 2] = b2;
            dst[op + 3] = b3;
            op += 4;
          }
          while (op < endOp) {
            dst[op++] = dst[matchPos++];
          }
        }
      } else if (offset == 1) {
        dst.fillRange(op, endOp, dst[matchPos]);
        op = endOp;
      } else {
        while (op < endOp) {
          dst[op++] = dst[matchPos++];
        }
      }
    }

    if (op != dstLength) {
      throw FormatException('LZ4 decoded $op bytes, expected $dstLength');
    }
    return op;
  }

  /// Convenience compressing [src] cleanly to a minimal tightly-sized buffer.
  static Uint8List compress(Uint8List src, {Lz4Scratch? scratch}) {
    final s = scratch ?? Lz4Scratch();
    final dst = s.ensureOutputCapacity(maxCompressedLength(src.length));
    final written = compressInto(src, src.length, dst, s.hashTable);
    if (written < 0) {
      throw StateError('Unexpected LZ4 output capacity shortfall');
    }
    return Uint8List.fromList(dst.sublist(0, written));
  }

  static Uint8List decompress(Uint8List src, int expectedLength) {
    final dst = Uint8List(math.max(0, expectedLength));
    decompressInto(src, 0, src.length, dst, expectedLength);
    return dst;
  }
}
