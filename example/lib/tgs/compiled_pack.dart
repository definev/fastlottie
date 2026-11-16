import 'dart:convert';

export 'compiled_pack_stub.dart' if (dart.library.io) 'compiled_pack_io.dart';

/// Experimental build-owned pack. The compiler fingerprint is supplied by the
/// build command, and source length/CRC is checked again on the decode worker.
/// This is not a format for downloaded or user-supplied compiled models.
class CompiledModelPack {
  CompiledModelPack._(this.path, this.bytes, this.entries);

  factory CompiledModelPack.fromIndex(
    String path,
    String index, {
    String? compiler,
  }) {
    final data = jsonDecode(index) as Map<String, dynamic>;
    final expected = compiler ??
        (const String.fromEnvironment('FASTLOTTIE_PACK_COMPILER').isNotEmpty
            ? const String.fromEnvironment('FASTLOTTIE_PACK_COMPILER')
            : data['compiler'] as String?);
    if (expected == null ||
        expected.isEmpty ||
        data['compiler'] != expected ||
        data['version'] != 1) {
      throw const FormatException('Incompatible compiled model pack');
    }
    final size = data['bytes'] as int;
    if (size < 16) throw const FormatException('Invalid compiled pack size');
    final entries = <String, PackedModelRef>{};
    var previousEnd = 16;
    for (final row in data['entries'] as List) {
      final values = row as List;
      final key = values[0] as String;
      final offset = values[1] as int, length = values[2] as int;
      final sourceLength = values[3] as int, sourceCrc = values[4] as int;
      final payloadCrc = values[5] as int;
      if (!key.startsWith('/tgs/') ||
          entries.containsKey(key) ||
          offset < previousEnd ||
          length < 4 ||
          length > 64 << 20 ||
          offset > size - length ||
          sourceLength <= 0 ||
          sourceCrc < 0 ||
          sourceCrc > 0x7fffffff ||
          payloadCrc < 0 ||
          payloadCrc > 0x7fffffff) {
        throw const FormatException('Invalid compiled pack entry');
      }
      entries[key] = (
        path: path,
        offset: offset,
        length: length,
        sourceLength: sourceLength,
        sourceCrc: sourceCrc,
        payloadCrc: payloadCrc,
      );
      previousEnd = offset + length;
    }
    if (entries.isEmpty || previousEnd != size) {
      throw const FormatException('Invalid compiled pack directory');
    }
    return CompiledModelPack._(path, size, Map.unmodifiable(entries));
  }

  final String path;
  final int bytes;
  final Map<String, PackedModelRef> entries;

  PackedModelRef? lookup(String url) => entries[Uri.parse(url).path];
}

typedef PackedModelRef = ({
  String path,
  int offset,
  int length,
  int sourceLength,
  int sourceCrc,
  int payloadCrc,
});
