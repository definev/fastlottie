import 'package:archive/archive.dart';
import 'package:flutter/foundation.dart';

/// Detects TGS/gzip by its signature, returning UTF-8 JSON bytes.
/// Uses archive's native zlib backend on dart:io, with a Dart fallback on web.
Uint8List decodeLottieBytes(
  List<int> bytes, {
  int maximumBytes = 16 * 1024 * 1024,
}) {
  if (maximumBytes <= 0) {
    throw ArgumentError.value(maximumBytes, 'maximumBytes');
  }
  if (bytes.length >= 2 && bytes[0] == 0x1f && bytes[1] == 0x8b) {
    return const GZipDecoder().decodeBytes(
      bytes,
      verify: !kIsWeb,
      throwOnError: true,
      maxOutputSize: maximumBytes,
    );
  }
  if (bytes.length > maximumBytes) {
    throw const FormatException('Lottie JSON exceeds decode budget');
  }
  return bytes is Uint8List ? bytes : Uint8List.fromList(bytes);
}
