import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

const _bundledTopics = <String>{
  'file_4798662.tgs',
  'file_4798663.tgs',
  'file_4798664.tgs',
  'file_4798665.tgs',
  'file_4798666.tgs',
  'file_4798668.tgs',
  'file_4798669.tgs',
  'file_4798671.tgs',
  'file_4798672.tgs',
  'file_4798673.tgs',
  'file_4798675.tgs',
  'file_4798676.tgs',
  'file_4798677.tgs',
  'file_4798678.tgs',
  'file_4798679.tgs',
  'file_4798682.tgs',
  'file_4798683.tgs',
  'file_4798684.tgs',
  'file_4798686.tgs',
  'file_4798687.tgs',
  'file_4798688.tgs',
  'file_4798689.tgs',
  'file_4798691.tgs',
  'file_4798692.tgs',
  'file_4798693.tgs',
  'file_4798694.tgs',
  'file_4798695.tgs',
  'file_4798696.tgs',
  'file_4798697.tgs',
  'file_4798698.tgs',
  'file_4798700.tgs',
  'file_4798701.tgs',
  'file_4798702.tgs',
  'file_4798703.tgs',
  'file_4798705.tgs',
  'file_4798706.tgs',
  'file_4798707.tgs',
  'file_4798708.tgs',
  'file_4798710.tgs',
  'file_4798713.tgs',
};

const _shortcodes = <String>[
  ':sparkles:',
  ':flame:',
  ':gift:',
  ':star:',
  ':rocket:',
  ':cart:',
  ':gem:',
  ':bolt:',
  ':crown:',
  ':coffee:',
  ':music:',
  ':camera:',
  ':trophy:',
  ':check:',
  ':bell:',
  ':pin:',
  ':smile:',
  ':wink:',
  ':cool:',
  ':laugh:',
  ':wow:',
  ':think:',
  ':love:',
  ':clap:',
  ':thumbsup:',
  ':sun:',
  ':moon:',
  ':cloud:',
  ':leaf:',
  ':cake:',
  ':pizza:',
  ':book:',
  ':lock:',
  ':key:',
  ':flag:',
  ':globe:',
  ':rainbow:',
  ':party:',
  ':heart:',
  ':magic:',
];

String _friendlyTitle(String packId) {
  switch (packId) {
    case 'Crocosaurus-1794222759141':
      return 'Crocosaurus';
    case 'HotCherry-1794222813220':
      return 'Hot Cherry';
    case 'HotHotHot-1794222825310':
      return 'Hot Hot Hot';
    case 'ViAndCaitlyn-1794222798837':
      return 'Vi & Caitlyn';
    case 'Topics-1794247486249':
      return 'Topics Emoji';
  }
  final dash = packId.indexOf('-');
  return dash > 0 ? packId.substring(0, dash) : packId;
}

class _Entry {
  _Entry(this.file, this.etag, this.bytesLen);
  final File file;
  final String etag;
  final int bytesLen;
  Uint8List? cached;
}

Future<void> main(List<String> args) async {
  var host = '127.0.0.1';
  var port = 8787;
  var delayMs = 0;
  var dirPath = 'example/assets/tgs';
  var includeAllTopics = false;

  for (var i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--host':
        if (i + 1 < args.length) host = args[++i];
      case '--port':
        if (i + 1 < args.length) port = int.parse(args[++i]);
      case '--delay-ms':
        if (i + 1 < args.length) delayMs = int.parse(args[++i]);
      case '--dir':
        if (i + 1 < args.length) dirPath = args[++i];
      case '--all-topics':
        includeAllTopics = true;
      case '--help':
        stdout.writeln(
          'Usage: dart run tool/tgs_server.dart '
          '[--host 127.0.0.1] [--port 8787] [--delay-ms 0] [--dir example/assets/tgs]',
        );
        return;
    }
  }

  final root = Directory(dirPath);
  if (!root.existsSync()) {
    stderr.writeln('Directory not found: ${root.absolute.path}');
    exitCode = 1;
    return;
  }

  final grouped = <String, List<File>>{};
  for (final entity in root.listSync(recursive: true, followLinks: false)) {
    if (entity is! File || !entity.path.endsWith('.tgs')) continue;
    final norm = entity.path.replaceAll('\\', '/');
    final parts = norm.split('/');
    if (parts.length < 2) continue;
    final pack = parts[parts.length - 2];
    final name = parts[parts.length - 1];
    if (pack.startsWith('Topics-') &&
        !includeAllTopics &&
        !_bundledTopics.contains(name)) {
      continue;
    }
    (grouped[pack] ??= []).add(entity);
  }

  final server = await HttpServer.bind(host, port);
  final baseUrl = 'http://$host:${server.port}';
  final packIds = grouped.keys.toList()..sort();
  final packsJson = <Map<String, dynamic>>[];
  final assets = <String, _Entry>{};
  final stickerOrderByPack = <List<String>>[];
  final emojiOrder = <String>[];

  for (final packId in packIds) {
    final files = grouped[packId]!..sort((a, b) => a.path.compareTo(b.path));
    final isEmoji = packId.startsWith('Topics-');
    final packTitle = _friendlyTitle(packId);
    final itemsJson = <Map<String, dynamic>>[];
    final ids = <String>[];
    for (var i = 0; i < files.length; i++) {
      final file = files[i];
      final bytes = file.readAsBytesSync();
      var hash = 0x811c9dc5;
      for (final b in bytes) {
        hash ^= b;
        hash = (hash * 0x01000193) & 0xFFFFFFFF;
      }
      final etag = '"${bytes.length.toRadixString(16)}-${hash.toRadixString(16)}"';
      final fileName = file.uri.pathSegments.last;
      final relPath = '/tgs/$packId/$fileName';
      final id = '$packId/$fileName';
      final shortcode = isEmoji
          ? (i < _shortcodes.length ? _shortcodes[i] : ':topic_${i + 1}:')
          : null;
      assets[relPath] = _Entry(file, etag, bytes.length)..cached = bytes;
      itemsJson.add(<String, dynamic>{
        'id': id,
        'packId': packId,
        'packTitle': packTitle,
        'fileName': fileName,
        'kind': isEmoji ? 'emoji' : 'sticker',
        'url': relPath,
        'bytes': bytes.length,
        'label': isEmoji ? shortcode!.replaceAll(':', '') : '$packTitle #${i + 1}',
        'shortcode': ?shortcode,
      });
      ids.add(id);
    }
    packsJson.add(<String, dynamic>{
      'id': packId,
      'title': packTitle,
      'kind': isEmoji ? 'emoji' : 'sticker',
      'items': itemsJson,
    });
    if (isEmoji) {
      emojiOrder.addAll(ids);
    } else {
      stickerOrderByPack.add(ids);
    }
  }

  final stickerOrder = <String>[];
  for (var row = 0; ; row++) {
    var found = false;
    for (final ids in stickerOrderByPack) {
      if (row < ids.length) {
        stickerOrder.add(ids[row]);
        found = true;
      }
    }
    if (!found) break;
  }

  final catalogBytes = utf8.encode(
    jsonEncode(<String, dynamic>{
      'baseUrl': baseUrl,
      'packs': packsJson,
      'stickerOrder': stickerOrder,
      'emojiOrder': emojiOrder,
    }),
  );

  var requests = 0;
  var tgsRequests = 0;
  var notModifiedResponses = 0;
  var abortedRequests = 0;
  var bytesServed = 0;

  stdout.writeln(
    'fastlottie TGS server listening on $baseUrl\n'
    '  Packs: ${packsJson.length} | Stickers: ${stickerOrder.length} | '
    'Emojis: ${emojiOrder.length} | Simulated delay: ${delayMs}ms\n'
    '  Android reverse tip: adb reverse tcp:${server.port} tcp:${server.port}\n'
    '  Flutter run flag:    --dart-define=TGS_SERVER_URL=$baseUrl',
  );

  late StreamSubscription<HttpRequest> sub;
  sub = server.listen((request) async {
    requests++;
    final path = request.uri.path;
    final response = request.response;
    response.headers.set('Access-Control-Allow-Origin', '*');

    try {
      if (path == '/health') {
        final payload = utf8.encode(
          jsonEncode(<String, dynamic>{
            'ok': true,
            'packs': packsJson.length,
            'stickers': stickerOrder.length,
            'emojis': emojiOrder.length,
            'requests': requests,
            'tgsRequests': tgsRequests,
            'notModifiedResponses': notModifiedResponses,
            'abortedRequests': abortedRequests,
            'bytesServed': bytesServed,
            'delayMs': delayMs,
          }),
        );
        response.headers.contentType = ContentType.json;
        response.contentLength = payload.length;
        response.add(payload);
        await response.close();
        return;
      }

      if (path == '/config') {
        final rawDelay = request.uri.queryParameters['delayMs'];
        final parsed = rawDelay == null ? null : int.tryParse(rawDelay);
        if (parsed != null && parsed >= 0) delayMs = parsed;
        final payload = utf8.encode(jsonEncode({'delayMs': delayMs}));
        response.headers.contentType = ContentType.json;
        response.contentLength = payload.length;
        response.add(payload);
        await response.close();
        return;
      }

      if (path == '/catalog') {
        response.headers.contentType = ContentType.json;
        response.contentLength = catalogBytes.length;
        response.add(catalogBytes);
        await response.close();
        stdout.writeln('[200] GET /catalog (${catalogBytes.length} B)');
        return;
      }

      final entry = assets[path];
      if (entry == null) {
        response.statusCode = HttpStatus.notFound;
        response.write('Not found: $path');
        await response.close();
        stdout.writeln('[404] GET $path');
        return;
      }

      if (delayMs > 0) {
        await Future<void>.delayed(Duration(milliseconds: delayMs));
      }

      final ifNoneMatch = request.headers.value(HttpHeaders.ifNoneMatchHeader);
      if (ifNoneMatch == entry.etag) {
        notModifiedResponses++;
        tgsRequests++;
        response.statusCode = HttpStatus.notModified;
        await response.close();
        stdout.writeln('[304] GET $path');
        return;
      }

      final bytes = entry.cached ??= await entry.file.readAsBytes();
      response.headers.set(
        HttpHeaders.contentTypeHeader,
        'application/x-tgsticker',
      );
      response.headers.set(HttpHeaders.etagHeader, entry.etag);
      response.headers.set(
        HttpHeaders.cacheControlHeader,
        'public, max-age=86400',
      );
      response.contentLength = bytes.length;
      response.add(bytes);
      await response.flush();
      await response.close();
      tgsRequests++;
      bytesServed += bytes.length;
      stdout.writeln(
        '[200] GET $path (${(bytes.length / 1024).toStringAsFixed(1)} KB)',
      );
    } on SocketException {
      abortedRequests++;
      stdout.writeln('[ABORT] $path (client closed socket)');
    } on HttpException {
      abortedRequests++;
      stdout.writeln('[ABORT] $path (http closed)');
    }
  });

  final sigDone = Completer<void>();
  late StreamSubscription<ProcessSignal> sigIntSub;
  sigIntSub = ProcessSignal.sigint.watch().listen((_) {
    if (!sigDone.isCompleted) sigDone.complete();
  });
  await sigDone.future;
  await sigIntSub.cancel();
  await sub.cancel();
  await server.close(force: true);
  stdout.writeln('\nServer stopped.');
}
