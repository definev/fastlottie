import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';

bool get isDiskCacheSupported => true;

int defaultWorkerCount([int? override]) {
  if (override != null) return override.clamp(1, 8);
  final cores = Platform.numberOfProcessors;
  if (cores <= 2) return 2;
  return math.min(4, math.max(2, cores ~/ 2));
}

String joinPath(String dir, String fileName) {
  if (dir.isEmpty) return fileName;
  final sep = Platform.pathSeparator;
  final clean = dir.endsWith('/') || dir.endsWith('\\')
      ? dir.substring(0, dir.length - 1)
      : dir;
  return '$clean$sep$fileName';
}

class PlatformFileEntry {
  const PlatformFileEntry({
    required this.path,
    required this.name,
    required this.size,
    required this.modifiedMs,
  });

  final String path;
  final String name;
  final int size;
  final int modifiedMs;
}

abstract interface class PlatformFileHandle {
  int get length;
  void truncate(int size);
  int readAt(int offset, Uint8List buffer, int count);
  bool readExactAt(int offset, Uint8List buffer, int count);
  void writeAt(int offset, Uint8List data, [int start = 0, int? end]);
  void flush();
  void close();
}

final class _IoFileHandle implements PlatformFileHandle {
  _IoFileHandle(this._raf);

  final RandomAccessFile _raf;

  @override
  int get length => _raf.lengthSync();

  @override
  void truncate(int size) {
    _raf.truncateSync(size);
  }

  @override
  int readAt(int offset, Uint8List buffer, int count) {
    if (count <= 0) return 0;
    _raf.setPositionSync(offset);
    return _raf.readIntoSync(buffer, 0, count);
  }

  @override
  bool readExactAt(int offset, Uint8List buffer, int count) {
    if (count == 0) return true;
    if (offset < 0 || count < 0 || count > buffer.length) return false;
    _raf.setPositionSync(offset);
    var total = 0;
    while (total < count) {
      final n = _raf.readIntoSync(buffer, total, count);
      if (n <= 0) return false;
      total += n;
    }
    return true;
  }

  @override
  void writeAt(int offset, Uint8List data, [int start = 0, int? end]) {
    final limit = end ?? data.length;
    if (limit <= start) return;
    _raf.setPositionSync(offset);
    _raf.writeFromSync(data, start, limit);
  }

  @override
  void flush() {
    _raf.flushSync();
  }

  @override
  void close() {
    _raf.closeSync();
  }
}

abstract final class PlatformDiskFs {
  static bool ensureDirectory(String path) {
    if (path.isEmpty) return false;
    try {
      final dir = Directory(path);
      if (!dir.existsSync()) dir.createSync(recursive: true);
      return true;
    } on FileSystemException {
      return false;
    }
  }

  static List<PlatformFileEntry> listFiles(
    String dirPath, {
    String suffix = '.flcache',
  }) {
    if (dirPath.isEmpty) return const [];
    try {
      final dir = Directory(dirPath);
      if (!dir.existsSync()) return const [];
      final entries = <PlatformFileEntry>[];
      for (final entity in dir.listSync(followLinks: false)) {
        if (entity is! File) continue;
        final name = entity.uri.pathSegments.lastWhere(
          (s) => s.isNotEmpty,
          orElse: () => '',
        );
        if (suffix.isNotEmpty && !name.endsWith(suffix)) continue;
        try {
          final stat = entity.statSync();
          entries.add(
            PlatformFileEntry(
              path: entity.path,
              name: name,
              size: stat.size,
              modifiedMs: stat.modified.millisecondsSinceEpoch,
            ),
          );
        } on FileSystemException {
          // Skip files deleted concurrently.
        }
      }
      return entries;
    } on FileSystemException {
      return const [];
    }
  }

  static PlatformFileHandle? openReadWrite(String path) {
    try {
      // FileMode.append opens O_RDWR | O_CREAT without truncating or forcing O_APPEND.
      final raf = File(path).openSync(mode: FileMode.append);
      return _IoFileHandle(raf);
    } on FileSystemException {
      return null;
    }
  }

  static bool exists(String path) {
    try {
      return File(path).existsSync();
    } on FileSystemException {
      return false;
    }
  }

  static int fileLength(String path) {
    try {
      final f = File(path);
      return f.existsSync() ? f.lengthSync() : 0;
    } on FileSystemException {
      return 0;
    }
  }

  static bool deleteFile(String path) {
    try {
      final f = File(path);
      if (f.existsSync()) f.deleteSync();
      return true;
    } on FileSystemException {
      return false;
    }
  }
}
