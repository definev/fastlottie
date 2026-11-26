import 'dart:typed_data';

import 'src/platform/gzip_stub.dart'
    if (dart.library.io) 'src/platform/gzip_io.dart';

/// Detects TGS/gzip by its signature, returning UTF-8 JSON bytes.
/// Uses native `dart:io` streaming zlib on native platforms with zip-bomb
/// enforcement, falling back to `package:archive` on web.
Uint8List decodeLottieBytes(
  List<int> bytes, {
  int maximumBytes = 16 * 1024 * 1024,
}) {
  if (maximumBytes <= 0) {
    throw ArgumentError.value(maximumBytes, 'maximumBytes');
  }
  if (bytes.length >= 2 && bytes[0] == 0x1f && bytes[1] == 0x8b) {
    return gunzipBytes(bytes, maximumBytes);
  }
  if (bytes.length > maximumBytes) {
    throw const FormatException('Lottie JSON exceeds decode budget');
  }
  return bytes is Uint8List ? bytes : Uint8List.fromList(bytes);
}
