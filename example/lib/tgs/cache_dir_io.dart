import 'dart:io';

import 'package:path_provider/path_provider.dart';

String? _cachedPath;
String? _cachedUrlPath;
bool _resolved = false;
bool _urlResolved = false;

Future<String?> _resolveSubdir(String folderName) async {
  try {
    final base = await getTemporaryDirectory();
    final sep = Platform.pathSeparator;
    final clean = base.path.endsWith(sep)
        ? base.path.substring(0, base.path.length - 1)
        : base.path;
    final dir = Directory('$clean$sep$folderName');
    if (!dir.existsSync()) dir.createSync(recursive: true);
    return dir.path;
  } catch (_) {
    // MissingPluginException in widget tests or unsupported platforms.
    return null;
  }
}

Future<String?> resolveExampleDiskCacheDirectory() async {
  if (_resolved) return _cachedPath;
  _resolved = true;
  _cachedPath = await _resolveSubdir('fastlottie_cache');
  return _cachedPath;
}

Future<String?> resolveExampleUrlDiskCacheDirectory() async {
  if (_urlResolved) return _cachedUrlPath;
  _urlResolved = true;
  _cachedUrlPath = await _resolveSubdir('fastlottie_url_cache');
  return _cachedUrlPath;
}

Future<void> _clearSubdir(
  String folderName,
  void Function(String) onReset,
) async {
  try {
    final base = await getTemporaryDirectory();
    final sep = Platform.pathSeparator;
    final clean = base.path.endsWith(sep)
        ? base.path.substring(0, base.path.length - 1)
        : base.path;
    final dir = Directory('$clean$sep$folderName');
    if (dir.existsSync()) dir.deleteSync(recursive: true);
    dir.createSync(recursive: true);
    onReset(dir.path);
  } catch (_) {}
}

Future<void> clearExampleDiskCacheDirectory() =>
    _clearSubdir('fastlottie_cache', (path) {
      _cachedPath = path;
      _resolved = true;
    });

Future<void> clearExampleUrlDiskCacheDirectory() =>
    _clearSubdir('fastlottie_url_cache', (path) {
      _cachedUrlPath = path;
      _urlResolved = true;
    });
