import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';

/// Serves a snapshot exported by build_emoji_posters.dart using only Dart I/O.
class PackServer {
  PackServer._(this._server, this._catalog, this._objects, this._manifests)
    : baseUri = Uri(
        scheme: 'http',
        host: _server.address.address,
        port: _server.port,
      );

  final HttpServer _server;
  final _Resource _catalog;
  final Map<String, _Resource> _objects, _manifests;

  final Uri baseUri;

  static Future<PackServer> start(
    Directory assets, {
    String host = '127.0.0.1',
    int port = 8787,
    Duration animationDelay = Duration.zero,
    Directory? sourceArchive,
  }) async {
    final directory = '${assets.path}/emoji_posters';
    final catalog = File('$directory/catalog.json').readAsBytesSync();
    final index = jsonDecode(
      File('$directory/objects.json').readAsStringSync(),
    ) as Map<String, dynamic>;
    final pages = <String, Uint8List>{};
    final objects = <String, _Resource>{};
    final objectPath = RegExp(r'^/objects/([0-9a-f]{64})\.(png|tgs)$');
    for (final MapEntry(key: path, value: value) in index.entries) {
      final match = objectPath.firstMatch(path);
      if (match == null) throw FormatException('Invalid object path $path');
      final Uint8List bytes;
      final length = value['length'] as int;
      if (match[2] == 'png') {
        final page = value['page'] as String;
        if (!RegExp(r'^[0-9a-f]{64}\.bin$').hasMatch(page)) {
          throw FormatException('Invalid poster page $page');
        }
        final data = pages.putIfAbsent(
          page,
          () => File('$directory/$page').readAsBytesSync(),
        );
        final start = value['offset'] as int;
        bytes = Uint8List.sublistView(data, start, start + length);
      } else {
        final asset = value['asset'] as String;
        final segments = asset.split('/');
        if (segments.length != 4 ||
            !asset.startsWith('assets/tgs/') ||
            segments.any(
              (part) => part == '.' || part == '..' || part.contains('\\'),
            )) {
          throw FormatException('Invalid TGS location $asset');
        }
        final source = File('${assets.path}/${asset.substring(7)}');
        final archived = sourceArchive == null
            ? null
            : File('${sourceArchive.path}/${path.split('/').last}');
        bytes = archived != null && archived.existsSync()
            ? archived.readAsBytesSync()
            : source.readAsBytesSync();
      }
      if (bytes.length != length ||
          sha256.convert(bytes).toString() != match[1]) {
        throw FormatException(
          'Content changed without a new revision for $path',
        );
      }
      objects[path] = (
        bytes: bytes,
        type: match[2] == 'png' ? 'image/png' : 'application/x-tgsticker',
        tag: '"${match[1]}"',
      );
    }

    final manifests = <String, _Resource>{};
    for (final file in Directory(
      '$directory/manifests',
    ).listSync().whereType<File>()) {
      final name = file.uri.pathSegments.last;
      if (!RegExp(r'^[0-9a-f]{64}\.json$').hasMatch(name)) continue;
      final bytes = file.readAsBytesSync();
      manifests['/manifests/$name'] = _jsonResource(bytes);
    }
    final document = jsonDecode(utf8.decode(catalog)) as Map;
    for (final summary in document['packs'] as List) {
      final manifest = manifests[summary['manifest']];
      if (manifest == null) {
        throw FormatException('Missing pack ${summary['id']}');
      }
      final pack = jsonDecode(utf8.decode(manifest.bytes)) as Map;
      if (pack['id'] != summary['id'] ||
          pack['revision'] != summary['revision']) {
        throw FormatException(
          'Manifest revision mismatch for ${summary['id']}',
        );
      }
      for (final item in pack['items'] as List) {
        if (!objects.containsKey(item['url']) ||
            !objects.containsKey(item['poster']['url']) ||
            (item['largePoster'] != null &&
                !objects.containsKey(item['largePoster']['url']))) {
          throw FormatException('Missing asset for ${item['id']}');
        }
      }
    }

    final server = await HttpServer.bind(host, port);
    final packServer = PackServer._(
      server,
      _jsonResource(catalog),
      objects,
      manifests,
    );
    server.listen(
      (request) => unawaited(packServer._serve(request, animationDelay)),
    );
    return packServer;
  }

  Future<void> _serve(HttpRequest request, Duration animationDelay) async {
    final response = request.response;
    response.headers
      ..set('Access-Control-Allow-Origin', '*')
      ..set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
      ..set('Access-Control-Allow-Headers', 'If-None-Match')
      ..set('Access-Control-Expose-Headers', 'ETag');
    try {
      if (request.method == 'OPTIONS') {
        response.statusCode = HttpStatus.noContent;
        return;
      }
      if (request.method != 'GET' && request.method != 'HEAD') {
        response.headers.set('Allow', 'GET, HEAD, OPTIONS');
        response.statusCode = HttpStatus.methodNotAllowed;
        return;
      }
      final path = request.uri.path;
      final isCatalog = path == '/v1/catalog';
      final resource = isCatalog
          ? _catalog
          : _objects[path] ?? _manifests[path];
      if (resource == null) {
        response.statusCode = HttpStatus.notFound;
        return;
      }
      response.headers
        ..set(HttpHeaders.etagHeader, resource.tag)
        ..set(
          HttpHeaders.cacheControlHeader,
          isCatalog
              ? 'public, no-cache'
              : 'public, max-age=31536000, immutable',
        );
      final tags = request.headers.value(HttpHeaders.ifNoneMatchHeader);
      if (tags != null &&
          tags.split(',').any((tag) {
            final value = tag.trim();
            return value == '*' ||
                value == resource.tag ||
                value == 'W/${resource.tag}';
          })) {
        response.statusCode = HttpStatus.notModified;
        return;
      }
      if (path.endsWith('.tgs') && animationDelay > Duration.zero) {
        await Future<void>.delayed(animationDelay);
      }
      response.headers.set(HttpHeaders.contentTypeHeader, resource.type);
      response.contentLength = resource.bytes.length;
      if (request.method == 'GET') response.add(resource.bytes);
    } on IOException {
      // The client can leave the viewport while media is being sent.
    } finally {
      try {
        await response.close();
      } on IOException {
        // The client can leave the viewport while media is being sent.
      }
    }
  }

  Future<void> close() => _server.close(force: true);
}

typedef _Resource = ({Uint8List bytes, String type, String tag});

_Resource _jsonResource(Uint8List bytes) => (
  bytes: bytes,
  type: 'application/json; charset=utf-8',
  tag: '"${sha256.convert(bytes)}"',
);

Future<void> main(List<String> args) async {
  var host = '127.0.0.1';
  var port = 8787;
  var assets = 'example/assets';
  var delay = Duration.zero;
  for (var i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--host':
        host = args[++i];
      case '--port':
        port = int.parse(args[++i]);
      case '--assets':
        assets = args[++i];
      case '--delay-ms':
        delay = Duration(milliseconds: int.parse(args[++i]));
      default:
        throw ArgumentError('Unknown argument ${args[i]}');
    }
  }
  final server = await PackServer.start(
    Directory(assets),
    host: host,
    port: port,
    animationDelay: delay,
    sourceArchive: Directory('build/pack_server/sources'),
  );
  stdout.writeln('Pack catalog at ${server.baseUri}/v1/catalog');
}
