import 'dart:ffi';
import 'dart:typed_data';

// Use a value outside the CRC31 range so zero still verifies a checksum.
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

// Covers up to 512×512 RGBA frames (1 MiB), including 96–128pt @ 3× mobile
// stickers (288×288 = 324 KiB) and 256pt @ 2× desktop heroes.
const int nativeCacheMaxBytes = 1024 * 1024;

/// Returns null to use the Dart implementation if the code asset is absent or
/// the frame exceeds [nativeCacheMaxBytes].
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
  if (_unavailable ||
      outputLength > nativeCacheMaxBytes ||
      length > nativeCacheMaxBytes) {
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
  if (_encoderUnavailable || length > nativeCacheMaxBytes) return null;
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
