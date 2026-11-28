import 'dart:typed_data';

bool get isDiskCacheSupported => false;

bool get isFlutterTestEnvironment => const bool.fromEnvironment('FLUTTER_TEST');

int defaultWorkerCount([int? override]) => 1;

String joinPath(String dir, String fileName) {
  if (dir.isEmpty) return fileName;
  final sep = dir.endsWith('/') || dir.endsWith('\\') ? '' : '/';
  return '$dir$sep$fileName';
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

abstract final class PlatformDiskFs {
  static bool ensureDirectory(String path) => false;

  static List<PlatformFileEntry> listFiles(
    String dirPath, {
    String suffix = '.flcache',
  }) => const [];

  static PlatformFileHandle? openReadWrite(String path) => null;

  static bool exists(String path) => false;

  static int fileLength(String path) => 0;

  static Future<List<PlatformFileEntry>> listFilesAsync(
    String dirPath, {
    String suffix = '.flcache',
  }) => Future<List<PlatformFileEntry>>.value(const []);

  static Future<bool> deleteFileAsync(String path) => Future<bool>.value(false);

  static bool deleteFile(String path) => false;
}
