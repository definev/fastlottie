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
  'file_4798714.tgs',
  'file_4798715.tgs',
  'file_4798716.tgs',
  'file_4798718.tgs',
  'file_4798721.tgs',
  'file_4798722.tgs',
  'file_4798723.tgs',
  'file_4798724.tgs',
  'file_4798726.tgs',
  'file_4798727.tgs',
  'file_4798728.tgs',
  'file_4798729.tgs',
  'file_4798730.tgs',
  'file_4798731.tgs',
  'file_4798732.tgs',
  'file_4798733.tgs',
  'file_4798734.tgs',
  'file_4798735.tgs',
  'file_4798736.tgs',
  'file_4798737.tgs',
  'file_4798738.tgs',
  'file_4798739.tgs',
  'file_4798740.tgs',
  'file_4798741.tgs',
  'file_4798742.tgs',
  'file_4798743.tgs',
  'file_4798745.tgs',
  'file_4798746.tgs',
  'file_4798747.tgs',
  'file_4798748.tgs',
  'file_4798750.tgs',
  'file_4798751.tgs',
  'file_4798752.tgs',
  'file_4798753.tgs',
  'file_4798755.tgs',
  'file_4798756.tgs',
  'file_4798757.tgs',
  'file_4798758.tgs',
  'file_4798762.tgs',
  'file_4798764.tgs',
  'file_4798765.tgs',
  'file_4798766.tgs',
  'file_4798767.tgs',
  'file_4798768.tgs',
  'file_4798769.tgs',
  'file_4798770.tgs',
  'file_4798771.tgs',
  'file_4798772.tgs',
};

const _topicMetaByFile = <String, (String shortcode, String label)>{
  'file_4798661.tgs': (':newspaper:', 'Newspaper'),
  'file_4798662.tgs': (':studio_microphone:', 'Studio Microphone'),
  'file_4798663.tgs': (':zap:', 'Lightning Bolt'),
  'file_4798664.tgs': (':top:', 'TOP Arrow'),
  'file_4798665.tgs': (':bulb:', 'Light Bulb'),
  'file_4798666.tgs': (':cool:', 'COOL Button'),
  'file_4798667.tgs': (':memo:', 'Memo & Pencil'),
  'file_4798668.tgs': (':exclamation:', 'Red Exclamation'),
  'file_4798669.tgs': (':mag:', 'Magnifying Glass'),
  'file_4798670.tgs': (':calendar:', 'Calendar Dec 31'),
  'file_4798671.tgs': (':megaphone:', 'Megaphone'),
  'file_4798672.tgs': (':fire:', 'Fire Flame'),
  'file_4798673.tgs': (':file_folder:', 'Open Folder'),
  'file_4798674.tgs': (':heart:', 'Red Heart'),
  'file_4798675.tgs': (':question:', 'Red Question'),
  'file_4798676.tgs': (':chart_up:', 'Chart Increasing'),
  'file_4798677.tgs': (':chart_down:', 'Chart Decreasing'),
  'file_4798678.tgs': (':gem:', 'Diamond Gem'),
  'file_4798679.tgs': (':speaking_head:', 'Speaking Head'),
  'file_4798680.tgs': (':moneybag:', 'Money Bag'),
  'file_4798681.tgs': (':money_with_wings:', 'Money With Wings'),
  'file_4798682.tgs': (':interrobang:', 'Exclamation Question'),
  'file_4798683.tgs': (':coin:', 'Silver Coin'),
  'file_4798684.tgs': (':video_game:', 'Game Controller'),
  'file_4798685.tgs': (':currency_exchange:', 'Currency Exchange'),
  'file_4798686.tgs': (':iphone:', 'Smartphone'),
  'file_4798687.tgs': (':laptop:', 'Laptop Telegram'),
  'file_4798688.tgs': (':red_car:', 'Red Car'),
  'file_4798689.tgs': (':house:', 'House'),
  'file_4798690.tgs': (':cupid:', 'Heart With Arrow'),
  'file_4798691.tgs': (':tada:', 'Party Popper'),
  'file_4798692.tgs': (':checkered_flag:', 'Chequered Flag'),
  'file_4798693.tgs': (':bangbang:', 'Double Exclamation'),
  'file_4798694.tgs': (':trophy:', 'Trophy'),
  'file_4798695.tgs': (':clapper:', 'Clapper Board'),
  'file_4798696.tgs': (':musical_note:', 'Musical Note'),
  'file_4798697.tgs': (':underage:', 'No One Under 18'),
  'file_4798698.tgs': (':books:', 'Stack of Books'),
  'file_4798699.tgs': (':crown:', 'Gold Crown'),
  'file_4798700.tgs': (':soccer:', 'Soccer Ball'),
  'file_4798701.tgs': (':basketball:', 'Basketball'),
  'file_4798702.tgs': (':tv:', 'Television'),
  'file_4798703.tgs': (':eyes:', 'Eyes'),
  'file_4798704.tgs': (':lips:', 'Biting Lips'),
  'file_4798705.tgs': (':lipstick:', 'Lipstick'),
  'file_4798706.tgs': (':high_heel:', 'Red High Heel'),
  'file_4798707.tgs': (':luggage:', 'Leather Suitcase'),
  'file_4798708.tgs': (':beach_umbrella:', 'Beach Island'),
  'file_4798709.tgs': (':airplane:', 'Airplane'),
  'file_4798710.tgs': (':partly_sunny:', 'Sun Behind Cloud'),
  'file_4798711.tgs': (':unicorn:', 'Unicorn Rainbow'),
  'file_4798712.tgs': (':shopping_bags:', 'Shopping Bags'),
  'file_4798713.tgs': (':shopping_cart:', 'Shopping Cart'),
  'file_4798714.tgs': (':motor_boat:', 'Speedboat'),
  'file_4798715.tgs': (':handbag:', 'Handbag & Mirror'),
  'file_4798716.tgs': (':steam_locomotive:', 'Locomotive Train'),
  'file_4798717.tgs': (':camping:', 'Camping Tent'),
  'file_4798718.tgs': (':mountain:', 'Mountain Peak'),
  'file_4798719.tgs': (':robot:', 'Robot Face'),
  'file_4798720.tgs': (':mirror_ball:', 'Disco Mirror Ball'),
  'file_4798721.tgs': (':tickets:', 'Admission Tickets'),
  'file_4798722.tgs': (':pirate_flag:', 'Pirate Flag'),
  'file_4798723.tgs': (':ballot_box:', 'Ballot Box'),
  'file_4798724.tgs': (':strawberry:', 'Strawberry'),
  'file_4798725.tgs': (':telescope:', 'Telescope'),
  'file_4798726.tgs': (':mortar_board:', 'Graduation Cap'),
  'file_4798727.tgs': (':microscope:', 'Microscope'),
  'file_4798728.tgs': (':notes:', 'Musical Notes'),
  'file_4798729.tgs': (':microphone:', 'Handheld Microphone'),
  'file_4798730.tgs': (':dancer:', 'Woman Dancing'),
  'file_4798731.tgs': (':military_helmet:', 'Military Helmet'),
  'file_4798732.tgs': (':pouch:', 'Leather Pouch'),
  'file_4798733.tgs': (':man_dancing:', 'Man Dancing'),
  'file_4798734.tgs': (':nail_polish:', 'Nail Polish'),
  'file_4798735.tgs': (':test_tube:', 'Chemistry Flask'),
  'file_4798736.tgs': (':family:', 'Family Portrait'),
  'file_4798737.tgs': (':classical_building:', 'Classical Building'),
  'file_4798738.tgs': (':baby:', 'Baby Pacifier'),
  'file_4798739.tgs': (':pregnant_woman:', 'Pregnant Woman'),
  'file_4798740.tgs': (':abacus:', 'Abacus'),
  'file_4798741.tgs': (':printer:', 'Printer'),
  'file_4798742.tgs': (':police_officer:', 'Police Officer'),
  'file_4798743.tgs': (':stethoscope:', 'Stethoscope'),
  'file_4798744.tgs': (':pill:', 'Red & Yellow Pill'),
  'file_4798745.tgs': (':id_card:', 'ID Card'),
  'file_4798746.tgs': (':syringe:', 'Syringe'),
  'file_4798747.tgs': (':soap:', 'Soap & Bubbles'),
  'file_4798748.tgs': (':customs:', 'Customs Checkpoint'),
  'file_4798749.tgs': (':fish:', 'Blue Fish'),
  'file_4798750.tgs': (':art:', 'Artist Palette'),
  'file_4798751.tgs': (':performing_arts:', 'Performing Arts'),
  'file_4798752.tgs': (':plate_with_cutlery:', 'Plate & Cutlery'),
  'file_4798753.tgs': (':tophat:', 'Top Hat'),
  'file_4798754.tgs': (':crystal_ball:', 'Crystal Ball'),
  'file_4798755.tgs': (':tropical_drink:', 'Tropical Drink'),
  'file_4798756.tgs': (':birthday:', 'Birthday Cake'),
  'file_4798757.tgs': (':hamburger:', 'Cheeseburger'),
  'file_4798758.tgs': (':pizza:', 'Pizza Slice'),
  'file_4798759.tgs': (':coffee:', 'Coffee Cup'),
  'file_4798760.tgs': (':sushi:', 'Sushi Nigiri'),
  'file_4798761.tgs': (':speech_balloon:', 'Speech Balloon'),
  'file_4798762.tgs': (':christmas_tree:', 'Christmas Tree'),
  'file_4798763.tgs': (':microbe:', 'Green Microbe'),
  'file_4798764.tgs': (':writing_hand:', 'Writing Hand'),
  'file_4798765.tgs': (':star:', 'Glowing Star'),
  'file_4798766.tgs': (':jack_o_lantern:', 'Jack-O-Lantern'),
  'file_4798767.tgs': (':white_check_mark:', 'Check Mark Button'),
  'file_4798768.tgs': (':military_medal:', 'Military Medal'),
  'file_4798769.tgs': (':clown_face:', 'Clown Face'),
  'file_4798770.tgs': (':brain:', 'Brain'),
  'file_4798771.tgs': (':guide_dog:', 'Guide Dog'),
  'file_4798772.tgs': (':cat2:', 'Ginger Cat'),
};

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
      final meta = isEmoji ? _topicMetaByFile[fileName] : null;
      final shortcode = isEmoji
          ? (meta?.$1 ?? ':topic_${i + 1}:')
          : null;
      final label = isEmoji
          ? (meta?.$2 ?? shortcode!.replaceAll(':', ''))
          : '$packTitle #${i + 1}';
      assets[relPath] = _Entry(file, etag, bytes.length)..cached = bytes;
      itemsJson.add(<String, dynamic>{
        'id': id,
        'packId': packId,
        'packTitle': packTitle,
        'fileName': fileName,
        'kind': isEmoji ? 'emoji' : 'sticker',
        'url': relPath,
        'bytes': bytes.length,
        'label': label,
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
