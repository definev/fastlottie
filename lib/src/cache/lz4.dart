import 'dart:math' as math;
import 'dart:typed_data';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');
const _isWasm = bool.fromEnvironment('dart.tool.dart2wasm');

/// Pure-Dart LZ4 block compressor and bounds-checked decompressor.
///
/// Designed for repeated per-frame raster buffers: callers can reuse
/// [Lz4Scratch] across frames for zero heap allocations on worker isolates.
class Lz4Scratch {
  Lz4Scratch({int initialOutputCapacity = defaultOutputCapacity})
    : hashTable = Int32List(Lz4Codec._hashTableSize),
      outputBuffer = Uint8List(initialOutputCapacity);

  static const int defaultOutputCapacity = 128 * 1024;
  static const int defaultSoftLimit = 512 * 1024;

  final Int32List hashTable;
  Uint8List outputBuffer;
  int _smallUseCount = 0;

  Uint8List ensureOutputCapacity(int minBytes) {
    if (outputBuffer.length >= minBytes) return outputBuffer;
    var next = outputBuffer.length;
    while (next < minBytes) {
      next = next * 2;
    }
    _smallUseCount = 0;
    return outputBuffer = Uint8List(next);
  }

  /// Releases oversized temporary output buffers after repeated small encodes.
  void recordOutputUse(int neededBytes, {int softLimit = defaultSoftLimit}) {
    if (outputBuffer.length <= softLimit) {
      _smallUseCount = 0;
      return;
    }
    if (neededBytes <= defaultOutputCapacity) {
      if (++_smallUseCount >= 16) {
        outputBuffer = Uint8List(defaultOutputCapacity);
        _smallUseCount = 0;
      }
    } else {
      _smallUseCount = 0;
    }
  }

  /// Immediately shrinks an expanded [outputBuffer] back to [targetCapacity].
  void shrinkScratch([int targetCapacity = defaultOutputCapacity]) {
    _smallUseCount = 0;
    if (outputBuffer.length > targetCapacity) {
      outputBuffer = Uint8List(targetCapacity);
    }
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
  static const int _zeroChunkBytes = 65536;
  static const int _debruijn64 = (0x03F79D71 << 32) | 0xB4CB0A89;
  static final Uint8List _ctz64 = () {
    final t = Uint8List(64);
    for (var bit = 0; bit < 64; bit++) {
      t[((1 << bit) * _debruijn64) >>> 58] = bit;
    }
    return t;
  }();
  static final Uint8List _zeroBytes = Uint8List(_zeroChunkBytes);
  static final Int32List _negOneHashTable = Int32List(_hashTableSize)
    ..fillRange(0, _hashTableSize, -1);
  // Private monomorphic U8List scratch buffers for dart2wasm so compressInto
  // stays 100% monomorphic (direct WasmArray<WasmI8> access, zero _BoxedInt
  // allocations) even when callers pass Uint8List views elsewhere in the app.
  static Uint8List _wasmSrcScratch = Uint8List(0);
  static Uint8List _wasmDstScratch = Uint8List(0);

  static void _zeroFillBytes(Uint8List dst, int start, int end) {
    var off = start;
    while (off < end) {
      final next = off + _zeroChunkBytes;
      dst.setRange(off, next < end ? next : end, _zeroBytes);
      off = next;
    }
  }

  @pragma('vm:prefer-inline')
  static int _readU32LE(Uint8List src, int i) =>
      src[i] | (src[i + 1] << 8) | (src[i + 2] << 16) | (src[i + 3] << 24);

  static int maxCompressedLength(int inputLength) =>
      inputLength + (inputLength ~/ 255) + 16;

  static int _hash4(int v) =>
      ((v * 2654435761) & 0xFFFFFFFF) >>> (32 - _hashLog);

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
    if (_isWasm) {
      var sBuf = _wasmSrcScratch;
      if (sBuf.length < srcLength) {
        sBuf = _wasmSrcScratch = Uint8List(srcLength);
      }
      sBuf.setRange(0, srcLength, src, 0);
      var dBuf = _wasmDstScratch;
      if (dBuf.length < dst.length) {
        dBuf = _wasmDstScratch = Uint8List(dst.length);
      }
      final written = _compressIntoWasmMono(
        sBuf,
        srcLength,
        dBuf,
        dst.length,
        hashTable,
        maxAbort,
      );
      if (written > 0) {
        dst.setRange(0, written, dBuf, 0);
      }
      return written;
    }

    var out = 0;
    var anchor = 0;

    if (srcLength >= _mfLimit + 1) {
      hashTable.setRange(0, _hashTableSize, _negOneHashTable);
      final srcBd = ByteData.sublistView(src, 0, srcLength);
      final mflimit = srcLength - _mfLimit;
      final matchLimit = srcLength - _lastLiterals;
      final matchLimit8 = matchLimit - 8;
      final matchLimit4 = matchLimit - 4;

      var ip = 0;
      hashTable[_hash4(srcBd.getUint32(0, Endian.little))] = 0;
      ip = 1;
      var forwardVal = srcBd.getUint32(ip, Endian.little);
      var forwardH = _hash4(forwardVal);
      final isHostLittle = !_isWeb && Endian.host == Endian.little;
      final ctz64 = !_isWeb ? _ctz64 : null;

      outer:
      while (true) {
        var step = 1;
        var searchMatchNb = 1 << _skipTrigger;
        var forwardIp = ip;
        int matchIdx;
        int ipVal;

        do {
          final h = forwardH;
          ip = forwardIp;
          ipVal = forwardVal;
          forwardIp += step;
          step = searchMatchNb >> _skipTrigger;
          searchMatchNb++;
          if (forwardIp > mflimit) break outer;

          forwardVal = srcBd.getUint32(forwardIp, Endian.little);
          forwardH = _hash4(forwardVal);
          matchIdx = hashTable[h];
          hashTable[h] = ip;
        } while (matchIdx < 0 ||
            (ip - matchIdx) > _maxDistance ||
            srcBd.getUint32(matchIdx, Endian.little) != ipVal);

        // Catch up backwards while ip > anchor and matchIdx > 0 match.
        while (ip > anchor &&
            matchIdx > 0 &&
            src[ip - 1] == src[matchIdx - 1]) {
          ip--;
          matchIdx--;
        }

        // Write literals [anchor .. ip) + match.
        while (true) {
          final litLength = ip - anchor;
          final tokenPos = out;
          // Worst-case token + extra len + literals + 2B offset check
          if (tokenPos + 1 + (litLength ~/ 255) + 1 + litLength + 2 >
              maxAbort) {
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
          if (litLength >= 8) {
            dst.setRange(out, out + litLength, src, anchor);
            out += litLength;
          } else {
            for (var i = 0; i < litLength; i++) {
              dst[out++] = src[anchor + i];
            }
          }

          // Encode match offset (little-endian).
          final offset = ip - matchIdx;
          dst[out++] = offset & 0xFF;
          dst[out++] = (offset >> 8) & 0xFF;

          // Count extra match bytes beyond MINMATCH (64-bit / 32-bit word step).
          var mCur = matchIdx + _minMatch;
          var iCur = ip + _minMatch;
          if (!_isWeb) {
            var matchedTail = false;
            while (iCur <= matchLimit8) {
              final diff =
                  srcBd.getUint64(iCur, Endian.host) ^
                  srcBd.getUint64(mCur, Endian.host);
              if (diff != 0) {
                if (isHostLittle) {
                  final lsb = diff & -diff;
                  iCur += ctz64![(lsb * _debruijn64) >>> 58] >>> 3;
                  matchedTail = true;
                }
                break;
              }
              iCur += 8;
              mCur += 8;
            }
            if (!matchedTail) {
              while (iCur < matchLimit && src[iCur] == src[mCur]) {
                iCur++;
                mCur++;
              }
            }
          } else {
            while (iCur <= matchLimit4 &&
                srcBd.getUint32(iCur, Endian.little) ==
                    srcBd.getUint32(mCur, Endian.little)) {
              iCur += 4;
              mCur += 4;
            }
            while (iCur < matchLimit && src[iCur] == src[mCur]) {
              iCur++;
              mCur++;
            }
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
          hashTable[_hash4(srcBd.getUint32(ip - 2, Endian.little))] = ip - 2;
          final nextIpVal = srcBd.getUint32(ip, Endian.little);
          final h = _hash4(nextIpVal);
          matchIdx = hashTable[h];
          hashTable[h] = ip;
          if (matchIdx < 0 ||
              (ip - matchIdx) > _maxDistance ||
              srcBd.getUint32(matchIdx, Endian.little) != nextIpVal) {
            ip++;
            forwardVal = srcBd.getUint32(ip, Endian.little);
            forwardH = _hash4(forwardVal);
            break;
          }
        }
      }
    }

    // Encode last literals [anchor .. srcLength).
    final lastLiterals = srcLength - anchor;
    final needed =
        1 +
        (lastLiterals >= 15 ? ((lastLiterals - 15) ~/ 255) + 1 : 0) +
        lastLiterals;
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

  /// Monomorphic `U8List` LZ4 block compressor for dart2wasm. Only called with
  /// [_wasmSrcScratch] / [_wasmDstScratch] so every element load/store compiles
  /// to direct WasmGC array instructions with zero `_BoxedInt` allocation.
  static int _compressIntoWasmMono(
    Uint8List src,
    int srcLength,
    Uint8List dst,
    int dstLimit,
    Int32List hashTable,
    int maxAbort,
  ) {
    var out = 0;
    var anchor = 0;

    if (srcLength >= _mfLimit + 1) {
      hashTable.setRange(0, _hashTableSize, _negOneHashTable);
      final mflimit = srcLength - _mfLimit;
      final matchLimit = srcLength - _lastLiterals;
      final matchLimit4 = matchLimit - 4;

      var ip = 0;
      hashTable[_hash4(_readU32LE(src, 0))] = 0;
      ip = 1;
      var forwardVal = _readU32LE(src, ip);
      var forwardH = _hash4(forwardVal);

      outer:
      while (true) {
        var step = 1;
        var searchMatchNb = 1 << _skipTrigger;
        var forwardIp = ip;
        int matchIdx;
        int ipVal;

        do {
          final h = forwardH;
          ip = forwardIp;
          ipVal = forwardVal;
          forwardIp += step;
          step = searchMatchNb >> _skipTrigger;
          searchMatchNb++;
          if (forwardIp > mflimit) break outer;

          forwardVal = _readU32LE(src, forwardIp);
          forwardH = _hash4(forwardVal);
          matchIdx = hashTable[h];
          hashTable[h] = ip;
        } while (matchIdx < 0 ||
            (ip - matchIdx) > _maxDistance ||
            _readU32LE(src, matchIdx) != ipVal);

        while (ip > anchor &&
            matchIdx > 0 &&
            src[ip - 1] == src[matchIdx - 1]) {
          ip--;
          matchIdx--;
        }

        while (true) {
          final litLength = ip - anchor;
          final tokenPos = out;
          if (tokenPos + 1 + (litLength ~/ 255) + 1 + litLength + 2 >
              maxAbort) {
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
          if (litLength >= 8) {
            dst.setRange(out, out + litLength, src, anchor);
            out += litLength;
          } else {
            for (var i = 0; i < litLength; i++) {
              dst[out++] = src[anchor + i];
            }
          }

          final offset = ip - matchIdx;
          dst[out++] = offset & 0xFF;
          dst[out++] = (offset >> 8) & 0xFF;

          var mCur = matchIdx + _minMatch;
          var iCur = ip + _minMatch;
          while (iCur <= matchLimit4 &&
              _readU32LE(src, iCur) == _readU32LE(src, mCur)) {
            iCur += 4;
            mCur += 4;
          }
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

          hashTable[_hash4(_readU32LE(src, ip - 2))] = ip - 2;
          final nextIpVal = _readU32LE(src, ip);
          final h = _hash4(nextIpVal);
          matchIdx = hashTable[h];
          hashTable[h] = ip;
          if (matchIdx < 0 ||
              (ip - matchIdx) > _maxDistance ||
              _readU32LE(src, matchIdx) != nextIpVal) {
            ip++;
            forwardVal = _readU32LE(src, ip);
            forwardH = _hash4(forwardVal);
            break;
          }
        }
      }
    }

    final lastLiterals = srcLength - anchor;
    final needed =
        1 +
        (lastLiterals >= 15 ? ((lastLiterals - 15) ~/ 255) + 1 : 0) +
        lastLiterals;
    if (out + needed > maxAbort || out + needed > dstLimit) return -1;

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
          if (ip >= ipEnd) {
            throw const FormatException('Truncated LZ4 literal len');
          }
          final add = src[ip++];
          litLen += add;
          if (add != 255) break;
        }
      }
      if (ip + litLen > ipEnd || op + litLen > dstLength) {
        throw const FormatException('LZ4 literal out of bounds');
      }
      if (litLen >= 8) {
        dst.setRange(op, op + litLen, src, ip);
        ip += litLen;
        op += litLen;
      } else {
        final litEnd = op + litLen;
        while (op < litEnd) {
          dst[op++] = src[ip++];
        }
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
          if (ip >= ipEnd) {
            throw const FormatException('Truncated LZ4 match len');
          }
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
        if (matchLen >= 8) {
          dst.setRange(op, endOp, dst, matchPos);
        } else {
          for (var k = 0; k < matchLen; k++) {
            dst[op + k] = dst[matchPos + k];
          }
        }
        op = endOp;
      } else if (offset == 4) {
        // Fast path for repeated 32-bit pixels (transparent edges / flat fills).
        final b0 = dst[matchPos];
        final b1 = dst[matchPos + 1];
        final b2 = dst[matchPos + 2];
        final b3 = dst[matchPos + 3];
        if ((b0 | b1 | b2 | b3) == 0) {
          _zeroFillBytes(dst, op, endOp);
          op = endOp;
        } else if (matchLen <= 32) {
          final quadEnd = op + (matchLen & ~3);
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
        } else {
          final startOp = op;
          // Seed 16 bytes, then double with disjoint native setRange (memmove).
          for (var k = 0; k < 16; k += 4) {
            dst[op + k] = b0;
            dst[op + k + 1] = b1;
            dst[op + k + 2] = b2;
            dst[op + k + 3] = b3;
          }
          var done = 16;
          while (done < matchLen) {
            final rem = matchLen - done;
            final count = done < rem ? done : rem;
            dst.setRange(startOp + done, startOp + done + count, dst, startOp);
            done += count;
          }
          op = endOp;
        }
      } else if (offset == 1) {
        final v = dst[matchPos];
        if (v == 0) {
          _zeroFillBytes(dst, op, endOp);
          op = endOp;
        } else if (matchLen <= 32) {
          while (op < endOp) {
            dst[op++] = v;
          }
        } else {
          final startOp = op;
          for (var k = 0; k < 16; k++) {
            dst[startOp + k] = v;
          }
          var done = 16;
          while (done < matchLen) {
            final rem = matchLen - done;
            final count = done < rem ? done : rem;
            dst.setRange(startOp + done, startOp + done + count, dst, startOp);
            done += count;
          }
          op = endOp;
        }
      } else if (matchLen > 32) {
        final startOp = op;
        var done = 0;
        final seed = offset >= 16
            ? offset
            : ((16 + offset - 1) ~/ offset) * offset;
        final seedLimit = seed < matchLen ? seed : matchLen;
        while (done < seedLimit) {
          dst[startOp + done] = dst[matchPos + done];
          done++;
        }
        while (done < matchLen) {
          final rem = matchLen - done;
          final count = done < rem ? done : rem;
          dst.setRange(startOp + done, startOp + done + count, dst, startOp);
          done += count;
        }
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
    assert(written >= 0, 'Unexpected LZ4 output capacity shortfall');
    if (written == 0) return Uint8List(0);
    return Uint8List(written)..setRange(0, written, dst);
  }

  static Uint8List decompress(Uint8List src, int expectedLength) {
    final dst = Uint8List(math.max(0, expectedLength));
    decompressInto(src, 0, src.length, dst, expectedLength);
    return dst;
  }
}
