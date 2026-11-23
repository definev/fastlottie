import 'dart:ffi';
import 'dart:typed_data';

// Outside the CRC31 range, including zero as a valid checksum.
const _skipCacheCrc = 0x80000000;

@Native<
  Int32 Function(
    Pointer<Uint8>,
    Size,
    Size,
    Pointer<Uint8>,
    Size,
    Int32,
    Uint32,
    Pointer<Uint32>,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_decode_cache_frame',
  isLeaf: true,
)
external int _decode(
  Pointer<Uint8> src,
  int offset,
  int length,
  Pointer<Uint8> dst,
  int outputLength,
  int raw,
  int crc,
  Pointer<Uint32> table,
);

/// Returns null to use the Dart implementation if the code asset is absent or
/// the frame is too large for a short leaf call.
/// Pass a null CRC for a payload already trusted by the caller.
/// The cache owns the CRC table and keeps source and destination disjoint.
bool? decodeCacheFrameNative(
  Uint8List src,
  int offset,
  int length,
  Uint8List dst,
  int outputLength,
  bool raw,
  int? crc,
  Uint32List table,
) {
  if (_unavailable || outputLength > 256 * 1024 || length > 256 * 1024) {
    return null;
  }
  if (offset < 0 ||
      length <= 0 ||
      length > src.length - offset ||
      outputLength <= 0 ||
      outputLength > dst.length ||
      table.length != 256) {
    return false;
  }
  try {
    return _decode(
          src.address,
          offset,
          length,
          dst.address,
          outputLength,
          raw ? 1 : 0,
          crc ?? _skipCacheCrc,
          table.address,
        ) !=
        0;
  } on ArgumentError {
    _unavailable = true;
    return null;
  }
}

bool _unavailable = false;

@Native<
  Int64 Function(
    Pointer<Uint8>,
    Size,
    Pointer<Uint8>,
    Size,
    Pointer<Int32>,
    Pointer<Uint32>,
  )
>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_encode_cache_frame',
  isLeaf: true,
)
external int _encode(
  Pointer<Uint8> src,
  int length,
  Pointer<Uint8> dst,
  int capacity,
  Pointer<Int32> hash,
  Pointer<Uint32> table,
);

/// The cache supplies disjoint input/output and reusable hash/CRC scratch.
/// Null selects the Dart encoder on unsupported platforms or large frames.
({int length, int crc})? encodeCacheFrameNative(
  Uint8List src,
  int length,
  Uint8List dst,
  Int32List hash,
  Uint32List table,
) {
  if (_encoderUnavailable || length > 256 * 1024) return null;
  if (length <= 0 ||
      length > src.length ||
      length > dst.length ||
      hash.length != 16384 ||
      table.length != 256) {
    throw ArgumentError('Invalid native cache encode buffers');
  }
  try {
    final encoded = _encode(
      src.address,
      length,
      dst.address,
      dst.length,
      hash.address,
      table.address,
    );
    if (encoded < 0) return null;
    return (length: encoded & 0xffffffff, crc: encoded >>> 32);
  } on ArgumentError {
    _encoderUnavailable = true;
    return null;
  }
}

bool _encoderUnavailable = false;

@Native<Void Function(Pointer<Uint8>, Pointer<Uint8>, Pointer<Uint8>, Size)>(
  assetId: 'package:fastlottie/fastlottie_simd.dart',
  symbol: 'fastlottie_xor_bytes',
  isLeaf: true,
)
external void _xor(
  Pointer<Uint8> src1,
  Pointer<Uint8> src2,
  Pointer<Uint8> dst,
  int count,
);

void simdXorBytes(Uint8List src1, Uint8List src2, Uint8List dst, int count) {
  if (!_xorUnavailable &&
      count > 0 &&
      count <= src1.length &&
      count <= src2.length &&
      count <= dst.length) {
    try {
      _xor(src1.address, src2.address, dst.address, count);
      return;
    } on ArgumentError {
      _xorUnavailable = true;
    }
  }
  if ((src1.offsetInBytes | src2.offsetInBytes | dst.offsetInBytes) & 7 == 0) {
    final count64 = count ~/ 8;
    final u64Src1 = Uint64List.view(src1.buffer, src1.offsetInBytes, count64);
    final u64Src2 = Uint64List.view(src2.buffer, src2.offsetInBytes, count64);
    final u64Dst = Uint64List.view(dst.buffer, dst.offsetInBytes, count64);
    for (var i = 0; i < count64; i++) {
      u64Dst[i] = u64Src1[i] ^ u64Src2[i];
    }
    for (var i = count64 * 8; i < count; i++) {
      dst[i] = src1[i] ^ src2[i];
    }
  } else if ((src1.offsetInBytes | src2.offsetInBytes | dst.offsetInBytes) &
          3 ==
      0) {
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

bool _xorUnavailable = false;
