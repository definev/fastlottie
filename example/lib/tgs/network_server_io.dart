import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'network_server_types.dart';

typedef _BytesSupplier = Future<Uint8List> Function();

final class _ServedAsset {
  _ServedAsset({
    required this.item,
    required this.loadBytes,
  });

  final TgsRemoteItem item;
  final _BytesSupplier loadBytes;
  Uint8List? cachedBytes;
  String? cachedEtag;

  Future<(Uint8List, String)> resolve() async {
    var bytes = cachedBytes;
    if (bytes == null) {
      bytes = await loadBytes();
      cachedBytes = bytes;
    }
    var etag = cachedEtag;
    if (etag == null) {
      var hash = 0x811c9dc5;
      for (final b in bytes) {
        hash ^= b;
        hash = (hash * 0x01000193) & 0xFFFFFFFF;
      }
      etag = '"${bytes.length.toRadixString(16)}-${hash.toRadixString(16)}"';
      cachedEtag = etag;
    }
    return (bytes, etag);
  }
}

/// Local HTTP `.tgs` asset server serving grouped packs, emoji shortcodes,
/// ETag revalidation, and configurable simulated latency for network testing.
class LocalTgsServer {
  LocalTgsServer._(
    this._server,
    this.baseUri,
    this.catalog,
    this._assetsByPath,
    Duration simulatedLatency,
  ) : _simulatedLatency = simulatedLatency,
      _stats = ValueNotifier<LocalTgsServerStats>(
        LocalTgsServerStats(delayMs: simulatedLatency.inMilliseconds),
      ) {
    _sub = _server.listen(_handleRequest);
  }

  final HttpServer _server;
  final Uri baseUri;
  final TgsRemoteCatalog catalog;
  final Map<String, _ServedAsset> _assetsByPath;
  final ValueNotifier<LocalTgsServerStats> _stats;
  late final StreamSubscription<HttpRequest> _sub;

  Duration _simulatedLatency;
  bool simulateFailure = false;
  bool _closed = false;

  ValueListenable<LocalTgsServerStats> get stats => _stats;

  Duration get simulatedLatency => _simulatedLatency;
  set simulatedLatency(Duration value) {
    _simulatedLatency = value;
    _stats.value = _stats.value.copyWith(delayMs: value.inMilliseconds);
  }

  static Future<LocalTgsServer> startFromBundle({
    AssetBundle? bundle,
    String host = '127.0.0.1',
    int port = 0,
    Duration simulatedLatency = Duration.zero,
  }) async {
    final assets = bundle ?? rootBundle;
    final manifest = await AssetManifest.loadFromAssetBundle(assets);
    final paths =
        manifest
            .listAssets()
            .where((p) => p.startsWith('assets/tgs/') && p.endsWith('.tgs'))
            .toList()
          ..sort();

    final server = await HttpServer.bind(host, port);
    final baseUri = Uri.parse('http://$host:${server.port}');
    final built = await _buildCatalogFromPaths(
      paths: paths,
      baseUri: baseUri,
      bytesForPath: (path) async {
        final data = await assets.load(path);
        return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
      },
      sizeForPath: (path) async {
        final data = await assets.load(path);
        return data.lengthInBytes;
      },
      extractPackAndFile: (path) {
        final segments = path.split('/');
        return (segments[2], segments[3]);
      },
    );
    return LocalTgsServer._(
      server,
      baseUri,
      built.$1,
      built.$2,
      simulatedLatency,
    );
  }

  static Future<LocalTgsServer> startFromDirectoryPath(
    String directoryPath, {
    String host = '127.0.0.1',
    int port = 0,
    Duration simulatedLatency = Duration.zero,
    bool restrictTopicsToBundled = true,
  }) async {
    final dir = Directory(directoryPath);
    if (!dir.existsSync()) {
      throw ArgumentError('TGS directory does not exist: $directoryPath');
    }
    final allowedTopics = restrictTopicsToBundled
        ? bundledTopicEmojiFileNames.toSet()
        : null;
    final files = <File>[];
    for (final entity in dir.listSync(recursive: true, followLinks: false)) {
      if (entity is! File || !entity.path.endsWith('.tgs')) continue;
      final normalized = entity.path.replaceAll('\\', '/');
      final parts = normalized.split('/');
      if (parts.length < 2) continue;
      final pack = parts[parts.length - 2];
      final fileName = parts[parts.length - 1];
      if (pack.startsWith('Topics-') &&
          allowedTopics != null &&
          !allowedTopics.contains(fileName)) {
        continue;
      }
      files.add(entity);
    }
    files.sort((a, b) => a.path.compareTo(b.path));

    final server = await HttpServer.bind(host, port);
    final baseUri = Uri.parse('http://$host:${server.port}');
    final byKey = <String, File>{};
    final keys = <String>[];
    for (final file in files) {
      final normalized = file.path.replaceAll('\\', '/');
      final parts = normalized.split('/');
      final key = '${parts[parts.length - 2]}/${parts[parts.length - 1]}';
      byKey[key] = file;
      keys.add(key);
    }
    final built = await _buildCatalogFromPaths(
      paths: keys,
      baseUri: baseUri,
      bytesForPath: (key) => byKey[key]!.readAsBytes(),
      sizeForPath: (key) => byKey[key]!.length(),
      extractPackAndFile: (key) {
        final parts = key.split('/');
        return (parts[0], parts[1]);
      },
    );
    return LocalTgsServer._(
      server,
      baseUri,
      built.$1,
      built.$2,
      simulatedLatency,
    );
  }

  static Future<(TgsRemoteCatalog, Map<String, _ServedAsset>)>
  _buildCatalogFromPaths({
    required List<String> paths,
    required Uri baseUri,
    required Future<Uint8List> Function(String key) bytesForPath,
    required Future<int> Function(String key) sizeForPath,
    required (String, String) Function(String key) extractPackAndFile,
  }) async {
    final grouped = <String, List<(String key, String fileName)>>{};
    for (final path in paths) {
      final (packId, fileName) = extractPackAndFile(path);
      (grouped[packId] ??= []).add((path, fileName));
    }

    final sortedPackIds = grouped.keys.toList()..sort();
    final packs = <TgsRemotePack>[];
    final assetMap = <String, _ServedAsset>{};
    final stickerPackLists = <List<TgsRemoteItem>>[];
    final emojis = <TgsRemoteItem>[];

    for (final packId in sortedPackIds) {
      final entries = grouped[packId]!..sort((a, b) => a.$2.compareTo(b.$2));
      final isEmoji = packId.startsWith('Topics-');
      final packTitle = friendlyPackTitle(packId);
      final items = <TgsRemoteItem>[];
      for (var i = 0; i < entries.length; i++) {
        final (key, fileName) = entries[i];
        final relativePath = '/tgs/$packId/$fileName';
        final size = await sizeForPath(key);
        final shortcode = isEmoji
            ? (i < defaultEmojiShortcodes.length
                  ? defaultEmojiShortcodes[i]
                  : ':topic_${i + 1}:')
            : null;
        final label = isEmoji
            ? (shortcode?.replaceAll(':', '') ?? 'emoji_${i + 1}')
            : '$packTitle #${i + 1}';
        final item = TgsRemoteItem(
          id: '$packId/$fileName',
          packId: packId,
          packTitle: packTitle,
          fileName: fileName,
          kind: isEmoji ? TgsItemKind.emoji : TgsItemKind.sticker,
          relativePath: relativePath,
          uri: baseUri.resolve(relativePath),
          bytes: size,
          label: label,
          shortcode: shortcode,
        );
        items.add(item);
        assetMap[relativePath] = _ServedAsset(
          item: item,
          loadBytes: () => bytesForPath(key),
        );
      }
      packs.add(
        TgsRemotePack(
          id: packId,
          title: packTitle,
          kind: isEmoji ? TgsItemKind.emoji : TgsItemKind.sticker,
          items: items,
        ),
      );
      if (isEmoji) {
        emojis.addAll(items);
      } else {
        stickerPackLists.add(items);
      }
    }

    // Interleave stickers across packs so browsing All showcases every style quickly.
    final stickers = <TgsRemoteItem>[];
    for (var row = 0; ; row++) {
      var added = false;
      for (final list in stickerPackLists) {
        if (row < list.length) {
          stickers.add(list[row]);
          added = true;
        }
      }
      if (!added) break;
    }

    return (
      TgsRemoteCatalog(
        baseUri: baseUri,
        packs: packs,
        stickers: stickers,
        emojis: emojis,
      ),
      assetMap,
    );
  }

  Future<void> _handleRequest(HttpRequest request) async {
    if (_closed) {
      try {
        await request.response.close();
      } catch (_) {}
      return;
    }
    final path = request.uri.path;
    final current = _stats.value;
    _stats.value = current.copyWith(
      requests: current.requests + 1,
      lastPath: path,
    );

    final response = request.response;
    response.headers.set('Access-Control-Allow-Origin', '*');

    try {
      if (path == '/health') {
        final s = _stats.value;
        _writeJson(response, <String, dynamic>{
          'ok': true,
          'packs': catalog.packs.length,
          'stickers': catalog.stickers.length,
          'emojis': catalog.emojis.length,
          'requests': s.requests,
          'tgsRequests': s.tgsRequests,
          'notModifiedResponses': s.notModifiedResponses,
          'abortedRequests': s.abortedRequests,
          'bytesServed': s.bytesServed,
          'delayMs': s.delayMs,
        });
        await response.close();
        return;
      }

      if (path == '/config') {
        final delayParam = request.uri.queryParameters['delayMs'];
        if (delayParam != null) {
          final parsed = int.tryParse(delayParam);
          if (parsed != null && parsed >= 0) {
            simulatedLatency = Duration(milliseconds: parsed);
          }
        }
        final failParam = request.uri.queryParameters['fail'];
        if (failParam != null) {
          simulateFailure = failParam == '1' || failParam == 'true';
        }
        _writeJson(response, <String, dynamic>{
          'delayMs': _simulatedLatency.inMilliseconds,
          'simulateFailure': simulateFailure,
        });
        await response.close();
        return;
      }

      if (path == '/catalog') {
        _writeJson(response, catalog.toJson());
        await response.close();
        return;
      }

      final served = _assetsByPath[path];
      if (served == null) {
        response.statusCode = HttpStatus.notFound;
        response.write('Not found: $path');
        await response.close();
        return;
      }

      final latency = _simulatedLatency;
      if (latency > Duration.zero) {
        await Future<void>.delayed(latency);
        if (_closed) return;
      }

      if (simulateFailure) {
        response.statusCode = HttpStatus.serviceUnavailable;
        response.write('Simulated network failure for $path');
        await response.close();
        return;
      }

      final (bytes, etag) = await served.resolve();
      final ifNoneMatch = request.headers.value(HttpHeaders.ifNoneMatchHeader);
      if (ifNoneMatch == etag) {
        response.statusCode = HttpStatus.notModified;
        await response.close();
        final s = _stats.value;
        _stats.value = s.copyWith(
          tgsRequests: s.tgsRequests + 1,
          notModifiedResponses: s.notModifiedResponses + 1,
        );
        return;
      }

      response.headers.set(
        HttpHeaders.contentTypeHeader,
        'application/x-tgsticker',
      );
      response.headers.set(HttpHeaders.etagHeader, etag);
      response.headers.set(
        HttpHeaders.cacheControlHeader,
        'public, max-age=86400',
      );
      response.contentLength = bytes.length;
      response.add(bytes);
      await response.flush();
      await response.close();

      final s = _stats.value;
      _stats.value = s.copyWith(
        tgsRequests: s.tgsRequests + 1,
        bytesServed: s.bytesServed + bytes.length,
      );
    } on SocketException {
      final s = _stats.value;
      _stats.value = s.copyWith(abortedRequests: s.abortedRequests + 1);
    } on HttpException {
      final s = _stats.value;
      _stats.value = s.copyWith(abortedRequests: s.abortedRequests + 1);
    } catch (_) {
      try {
        response.statusCode = HttpStatus.internalServerError;
        await response.close();
      } catch (_) {}
    }
  }

  void _writeJson(HttpResponse response, Map<String, dynamic> body) {
    final encoded = utf8.encode(jsonEncode(body));
    response.headers.contentType = ContentType.json;
    response.contentLength = encoded.length;
    response.add(encoded);
  }

  Future<void> close({bool force = false}) async {
    if (_closed) return;
    _closed = true;
    await _sub.cancel();
    await _server.close(force: force);
    _stats.dispose();
  }
}

Future<TgsRemoteCatalog> fetchRemoteTgsCatalog(
  Uri baseUri, {
  Duration timeout = const Duration(seconds: 5),
}) async {
  final client = HttpClient()..connectionTimeout = timeout;
  try {
    final catalogUri = baseUri.resolve('/catalog');
    final request = await client.getUrl(catalogUri).timeout(timeout);
    request.headers.set(HttpHeaders.connectionHeader, 'close');
    request.headers.set(HttpHeaders.acceptHeader, 'application/json');
    final response = await request.close().timeout(timeout);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      await response.drain<void>();
      throw HttpException(
        'Catalog HTTP ${response.statusCode}',
        uri: catalogUri,
      );
    }
    final text = await utf8.decodeStream(response).timeout(timeout);
    final decoded = jsonDecode(text) as Map<String, dynamic>;
    return TgsRemoteCatalog.fromJson(decoded, baseUri);
  } finally {
    client.close(force: true);
  }
}
