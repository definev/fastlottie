import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

import 'compiled_pack.dart';

/// Open only for a decoder batch; no handles or whole-pack buffers cross isolates.
class CompiledPackReader {
  RandomAccessFile? _file;
  String? _path;
  int _length = 0;

  Uint8List? read(PackedModelRef entry) {
    try {
      return _read(entry);
    } on FileSystemException {
      close();
      return null;
    } on FormatException {
      close();
      return null;
    }
  }

  Uint8List _read(PackedModelRef entry) {
    if (_path != entry.path) {
      close();
      _file = File(entry.path).openSync();
      _length = _file!.lengthSync();
      final header = _file!.readSync(16);
      final data = ByteData.sublistView(header);
      if (header.length != 16 ||
          data.getUint32(0, Endian.little) != 0x31504c46 ||
          data.getUint32(4, Endian.little) != 1 ||
          data.getUint64(8, Endian.little) != _length) {
        throw const FormatException('Invalid compiled pack header');
      }
      _path = entry.path;
    }
    final file = _file!;
    if (entry.offset < 16 ||
        entry.length < 4 ||
        entry.length > 64 << 20 ||
        entry.offset > _length - entry.length) {
      throw const FormatException('Invalid compiled pack range');
    }
    file.setPositionSync(entry.offset);
    final result = file.readSync(entry.length);
    if (result.length != entry.length) {
      throw const FormatException('Truncated compiled pack');
    }
    return result;
  }

  void close() {
    _file?.closeSync();
    _file = null;
    _path = null;
  }
}

/// Discovers and loads the precompiled `.flp` pack if present on disk or in assets.
Future<CompiledModelPack?> loadDefaultCompiledPack({String? compiler}) async {
  const customPath = String.fromEnvironment('FASTLOTTIE_PACK_PATH');
  final candidates = [
    if (customPath.isNotEmpty) customPath,
    'assets/texture_picker_models.flp',
    'example/assets/texture_picker_models.flp',
  ];
  for (final p in candidates) {
    final packFile = File(p);
    final jsonFile = File('$p.json');
    if (packFile.existsSync() && jsonFile.existsSync()) {
      try {
        final index = jsonFile.readAsStringSync();
        return CompiledModelPack.fromIndex(
          packFile.absolute.path,
          index,
          compiler: compiler,
        );
      } catch (e) {
        debugPrint('Error loading pack from $p: $e');
      }
    }
  }

  try {
    final index = await rootBundle.loadString(
      'assets/texture_picker_models.flp.json',
    );
    final dir = await getApplicationSupportDirectory();
    final localPack = File('${dir.path}/texture_picker_models.flp');
    if (!localPack.existsSync() || localPack.lengthSync() == 0) {
      final data = await rootBundle.load('assets/texture_picker_models.flp');
      final bytes = data.buffer.asUint8List(
        data.offsetInBytes,
        data.lengthInBytes,
      );
      await localPack.writeAsBytes(bytes, flush: true);
    }
    return CompiledModelPack.fromIndex(
      localPack.path,
      index,
      compiler: compiler,
    );
  } catch (_) {
    // Pack not in bundle
  }
  return null;
}

