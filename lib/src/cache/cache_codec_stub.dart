import 'dart:typed_data';

bool? decodeCacheFrameNative(
  Uint8List src,
  int offset,
  int length,
  Uint8List dst,
  int outputLength,
  bool raw,
  int? crc,
  Uint32List table,
) => null;

({int length, int crc})? encodeCacheFrameNative(
  Uint8List src,
  int length,
  Uint8List dst,
  Int32List hash,
  Uint32List table,
) => null;
