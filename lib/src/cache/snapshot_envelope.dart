import 'dart:typed_data';

import 'lz4.dart';

// The high bit selects raw storage; otherwise this is a single LZ4 block.
// The compiled graph inside the envelope has its own version.
Uint8List packCompiledSnapshot(Uint8List bytes, Lz4Scratch scratch) {
  final compressed = scratch.ensureOutputCapacity(bytes.length);
  final length = Lz4Codec.compressInto(
    bytes,
    bytes.length,
    compressed,
    scratch.hashTable,
    abortAtLength: bytes.length,
  );
  final raw = length < 0 || length >= bytes.length;
  final out = Uint8List(4 + (raw ? bytes.length : length));
  ByteData.sublistView(out)
      .setUint32(0, bytes.length | (raw ? 0x80000000 : 0), Endian.little);
  out.setRange(4, out.length, raw ? bytes : compressed);
  return out;
}

Uint8List unpackCompiledSnapshot(Uint8List bytes) {
  if (bytes.length < 4) throw const FormatException('Truncated cached model');
  final header = ByteData.sublistView(bytes).getUint32(0, Endian.little);
  final size = header & 0x7fffffff;
  if (size < 24 || size > 64 << 20) {
    throw const FormatException('Invalid cached model size');
  }
  if (header & 0x80000000 != 0) {
    if (bytes.length != size + 4) {
      throw const FormatException('Invalid raw cached model');
    }
    return bytes.sublist(4);
  }
  final output = Uint8List(size);
  if (Lz4Codec.decompressInto(bytes, 4, bytes.length - 4, output, size) !=
      size) {
    throw const FormatException('Invalid compressed cached model');
  }
  return output;
}
