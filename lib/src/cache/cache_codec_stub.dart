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

void simdXorBytes(Uint8List src1, Uint8List src2, Uint8List dst, int count) {
  // dart2js supports 32-bit typed views for aligned payloads.
  if ((src1.offsetInBytes | src2.offsetInBytes | dst.offsetInBytes) & 3 == 0) {
    final count32 = count ~/ 4;
    final u32Src1 = Uint32List.view(src1.buffer, src1.offsetInBytes, count32);
    final u32Src2 = Uint32List.view(src2.buffer, src2.offsetInBytes, count32);
    final u32Dst = Uint32List.view(dst.buffer, dst.offsetInBytes, count32);
    for (var i = 0; i < count32; i++) {
      u32Dst[i] = u32Src1[i] ^ u32Src2[i];
    }
    for (var i = count32 * 4; i < count; i++) {
      dst[i] = src1[i] ^ src2[i];
    }
  } else {
    for (var i = 0; i < count; i++) {
      dst[i] = src1[i] ^ src2[i];
    }
  }
}
