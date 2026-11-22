import 'dart:io';
import 'dart:typed_data';

const _maximumDiskBytes = 32 * 1024 * 1024;
int _sequence = 0;
Future<void> _writes = Future.value();
final _directories = <String, Map<String, int>>{};
final _accesses = <String, Map<String, DateTime>>{};

Future<Uint8List?> read(
  String? directory,
  String key, {
  int? maximumBytes,
}) async {
  if (directory == null) return null;
  try {
    final file = File('$directory/packs/$key');
    if (maximumBytes != null && await file.length() > maximumBytes) return null;
    final bytes = await file.readAsBytes();
    _accesses.putIfAbsent(directory, () => {})[key] = DateTime.now();
    return bytes;
  } on FileSystemException {
    return null;
  }
}

Future<void> write(String? directory, String key, Uint8List bytes) {
  if (directory == null) return Future.value();
  return _writes = _writes.then((_) async {
    final cache = Directory('$directory/packs');
    final temporary = File('${cache.path}/$key.tmp.$pid.${++_sequence}');
    try {
      await cache.create(recursive: true);
      await temporary.writeAsBytes(bytes);
      await temporary.rename('${cache.path}/$key');
      final accesses = _accesses.putIfAbsent(directory, () => {});
      var entries = _directories[directory];
      if (entries == null) {
        entries = {};
        await for (final file in cache.list(followLinks: false)) {
          if (file is! File || file.path.contains('.tmp.')) continue;
          final stat = await file.stat();
          final name = file.uri.pathSegments.last;
          if (stat.type != FileSystemEntityType.file) continue;
          entries[name] = stat.size;
          accesses.putIfAbsent(name, () => stat.modified);
        }
        _directories[directory] = entries;
      }
      entries[key] = bytes.length;
      accesses[key] = DateTime.now();
      var size = entries.values.fold(0, (sum, length) => sum + length);
      if (size <= _maximumDiskBytes) return;
      final order = entries.keys.toList()
        ..sort((a, b) {
          final metadataA =
              a.startsWith('catalog-') || a.startsWith('manifest-');
          final metadataB =
              b.startsWith('catalog-') || b.startsWith('manifest-');
          if (metadataA != metadataB) return metadataA ? 1 : -1;
          return accesses[a]!.compareTo(accesses[b]!);
        });
      for (final name in order) {
        if (size <= _maximumDiskBytes) break;
        try {
          await File('${cache.path}/$name').delete();
        } on FileSystemException {
          // Another process may already have removed an entry.
        }
        size -= entries.remove(name)!;
        accesses.remove(name);
      }
    } on FileSystemException {
      if (await temporary.exists()) {
        try {
          await temporary.delete();
        } on FileSystemException {
          // Another cache cleanup may already have removed it.
        }
      }
    }
  });
}

Future<void> clear(String? directory) {
  if (directory == null) return Future.value();
  return _writes = _writes.then((_) async {
    _directories.remove(directory);
    _accesses.remove(directory);
    try {
      await Directory('$directory/packs').delete(recursive: true);
    } on FileSystemException {
      // The cache may already be empty.
    }
  });
}
