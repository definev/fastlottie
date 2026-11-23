// Run from the repository root with:
// flutter test --no-pub tool/build_emoji_posters.dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:crypto/crypto.dart';
import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/worker/raster_worker.dart'
    show resolveWorkerSourceIndex;
import 'package:flutter_test/flutter_test.dart';

// The publishing tool shares the example's pure-Dart pack metadata.
// ignore: avoid_relative_lib_imports
import '../example/lib/tgs/network_server_types.dart';

const _edge = 96;
const _sampleRate = 30;
const _imagesPerPage = 32;
const _assetRoot = 'example/assets';
const _output = '$_assetRoot/emoji_posters';
const _manifestDir = '$_output/manifests';
const _sourceArchive = 'build/pack_server/sources';

Future<Uint8List> _encodePng(Uint8List pixels, int width, int height) async {
  final ready = Completer<ui.Image>();
  ui.decodeImageFromPixels(
    pixels,
    width,
    height,
    ui.PixelFormat.bgra8888,
    ready.complete,
  );
  final image = await ready.future;
  try {
    final data = (await image.toByteData(format: ui.ImageByteFormat.png))!;
    return Uint8List.sublistView(data);
  } finally {
    image.dispose();
  }
}

Future<(double, Uint8List)> _renderPoster(
  FastLottieComposition composition,
  int edge, {
  double? progress,
}) async {
  final scale = edge / math.max(composition.width, composition.height);
  final width = math.max(1, (composition.width * scale - 1e-4).ceil());
  final height = math.max(1, (composition.height * scale - 1e-4).ceil());
  final span = composition.endFrame - composition.startFrame;
  final step = math.max(1.0, composition.frameRate / _sampleRate);
  final lastSample = math.max(0, ((span - 1) / step + 1e-7).floor());
  final session = FastLottieSoftwareSession(
    composition,
    pixelWidth: width,
    pixelHeight: height,
  );
  try {
    final pixels = Uint8List.sublistView(session.pixels);
    var chosen = progress == null ? 0 : (progress * span / step).round();
    var bestCoverage = -1;
    for (var sample = 0; progress == null && sample <= lastSample; sample++) {
      final source = resolveWorkerSourceIndex(
        sample,
        composition.frameCount,
        step,
      );
      session.renderFrame(composition.startFrame + source);
      var coverage = 0;
      for (var index = 3; index < pixels.length; index += 4) {
        coverage += pixels[index];
      }
      if (coverage > bestCoverage) {
        bestCoverage = coverage;
        chosen = sample;
      }
      if (coverage >= width * height * 255 * .025) break;
    }
    if (progress == null && bestCoverage <= 0) {
      throw StateError('No visible sample in composition');
    }
    final source = resolveWorkerSourceIndex(
      chosen,
      composition.frameCount,
      step,
    );
    session.renderFrame(composition.startFrame + source);
    return (
      span > 0 ? chosen * step / span : 0.0,
      await _encodePng(pixels, width, height),
    );
  } finally {
    session.dispose();
  }
}

void _publishJson(String path, Object data) {
  final temporary = File('$path.tmp')..writeAsStringSync(jsonEncode(data));
  temporary.renameSync(path);
}

void main() {
  test('Publish bundled sticker and emoji packs', () async {
    final declarations = File('example/pubspec.yaml')
        .readAsLinesSync()
        .map((line) => line.trim())
        .where((line) => line.startsWith('- assets/tgs/'))
        .map((line) => 'example/${line.substring(2)}');
    final files = [
      for (final path in declarations)
        if (path.endsWith('/'))
          ...Directory(path)
              .listSync()
              .whereType<File>()
              .where((file) => file.path.endsWith('.tgs'))
        else
          File(path),
    ]..sort((a, b) => a.path.compareTo(b.path));
    expect(files, isNotEmpty);

    Directory(_manifestDir).createSync(recursive: true);
    Directory(_sourceArchive).createSync(recursive: true);
    final packs = <String, List<Map<String, Object?>>>{};
    final oldIndex = File('$_output/objects.json');
    final objects = oldIndex.existsSync()
        ? (jsonDecode(oldIndex.readAsStringSync()) as Map<String, dynamic>).map(
            (key, value) =>
                MapEntry(key, Map<String, Object>.from(value as Map)),
          )
        : <String, Map<String, Object>>{};
    final page = BytesBuilder();
    final pending = <(String, int, int)>[];
    void flushPage() {
      if (pending.isEmpty) return;
      final data = page.takeBytes();
      final hash = sha256.convert(data).toString();
      final file = File('$_output/$hash.bin');
      if (!file.existsSync()) file.writeAsBytesSync(data);
      for (final (key, offset, length) in pending) {
        objects[key] = {
          'page': '$hash.bin',
          'offset': offset,
          'length': length,
        };
      }
      pending.clear();
    }

    String addPoster(Uint8List png) {
      final path = '/objects/${sha256.convert(png)}.png';
      if (objects.containsKey(path) || pending.any((e) => e.$1 == path)) {
        return path;
      }
      pending.add((path, page.length, png.length));
      page.add(png);
      if (pending.length == _imagesPerPage) flushPage();
      return path;
    }

    for (final file in files) {
      final id = file.path.substring('$_assetRoot/tgs/'.length);
      final [packId, fileName] = id.split('/');
      final kind = isEmojiPackId(packId)
          ? TgsItemKind.emoji
          : TgsItemKind.sticker;
      final items = packs.putIfAbsent(packId, () => []);
      final source = file.readAsBytesSync();
      final composition = FastLottieComposition.fromBytes(source);
      final (progress, png) = await _renderPoster(
        composition,
        kind == TgsItemKind.emoji ? _edge : 112,
      );
      final poster = addPoster(png);
      final largePoster = kind == TgsItemKind.sticker
          ? addPoster(
              (await _renderPoster(composition, 256, progress: progress)).$2,
            )
          : null;
      final tgs = '/objects/${sha256.convert(source)}.tgs';
      final asset = 'assets/tgs/$id';
      final archived = File('$_sourceArchive/${tgs.split('/').last}');
      if (!archived.existsSync()) archived.writeAsBytesSync(source);
      objects[tgs] = {'asset': asset, 'length': source.length};
      final meta =
          topicEmojiMetadataByFile[fileName] ??
          notoEmojiMetadataByFile[fileName];
      final title = friendlyPackTitle(packId);
      final shortcode = kind == TgsItemKind.emoji
          ? meta?.shortcode ?? ':emoji_${items.length + 1}:'
          : null;
      final item = <String, Object?>{
        'id': id,
        'packId': packId,
        'packTitle': title,
        'fileName': fileName,
        'kind': kind.name,
        'url': tgs,
        'bytes': source.length,
        'label': shortcode == null
            ? '$title #${items.length + 1}'
            : meta?.label ?? shortcode.replaceAll(':', ''),
        'shortcode': ?shortcode,
        'animated': !composition.isStatic,
        'poster': {'url': poster, 'progress': progress},
        if (largePoster != null)
          'largePoster': {'url': largePoster, 'progress': progress},
      };
      item['revision'] = sha256
          .convert(utf8.encode(jsonEncode(item)))
          .toString();
      items.add(item);
    }
    flushPage();
    final catalog = <Map<String, Object?>>[];
    for (final MapEntry(key: id, value: items) in packs.entries) {
      final title = friendlyPackTitle(id);
      final kind = items.first['kind'];
      final revision = sha256
          .convert(utf8.encode(jsonEncode(items)))
          .toString();
      final path = '/manifests/$revision.json';
      final manifest = {
        'id': id,
        'title': title,
        'kind': kind,
        'revision': revision,
        'items': items,
      };
      _publishJson('$_output$path', manifest);
      catalog.add({
        'id': id,
        'title': title,
        'kind': kind,
        'revision': revision,
        'cover': items.first['poster'],
        'count': items.length,
        'manifest': path,
      });
    }
    _publishJson('$_output/objects.json', objects);
    _publishJson('$_output/catalog.json', {'version': 1, 'packs': catalog});
  }, timeout: const Timeout(Duration(minutes: 3)));
}
