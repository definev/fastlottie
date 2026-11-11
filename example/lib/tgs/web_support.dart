import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/services.dart';

import 'network_server_types.dart';

Future<FastLottieNetworkFetchResult> Function(
  Uri uri, {
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
})
get networkByteFetcher => fetchBundledTgsBytes;

Future<TgsRemoteCatalog> loadBundledTgsCatalog({AssetBundle? bundle}) async {
  final assets = bundle ?? rootBundle;
  final manifest = await AssetManifest.loadFromAssetBundle(assets);
  final paths =
      manifest
          .listAssets()
          .where(
            (path) => path.startsWith('assets/tgs/') && path.endsWith('.tgs'),
          )
          .toList()
        ..sort();

  final grouped = <String, List<String>>{};
  for (final path in paths) {
    final segments = path.split('/');
    if (segments.length < 4) continue;
    (grouped[segments[2]] ??= <String>[]).add(path);
  }

  final packs = <TgsRemotePack>[];
  final stickerPackLists = <List<TgsRemoteItem>>[];
  final topicEmojis = <TgsRemoteItem>[];
  final otherEmojis = <TgsRemoteItem>[];
  for (final packId in grouped.keys.toList()..sort()) {
    final pathsInPack = grouped[packId]!;
    final isEmoji = isEmojiPackId(packId);
    final title = friendlyPackTitle(packId);
    final items = <TgsRemoteItem>[];
    for (var i = 0; i < pathsInPack.length; i++) {
      final path = pathsInPack[i];
      final fileName = path.split('/').last;
      final meta = isEmoji
          ? topicEmojiMetadataByFile[fileName] ??
                notoEmojiMetadataByFile[fileName]
          : null;
      final shortcode = isEmoji
          ? (meta?.shortcode ?? ':emoji_${i + 1}:')
          : null;
      items.add(
        TgsRemoteItem(
          id: '$packId/$fileName',
          packId: packId,
          packTitle: title,
          fileName: fileName,
          kind: isEmoji ? TgsItemKind.emoji : TgsItemKind.sticker,
          relativePath: path,
          uri: Uri(scheme: 'asset', host: 'bundle', path: '/$path'),
          bytes: 0,
          label: isEmoji
              ? (meta?.label ?? shortcode!.replaceAll(':', ''))
              : '$title #${i + 1}',
          shortcode: shortcode,
        ),
      );
    }

    packs.add(
      TgsRemotePack(
        id: packId,
        title: title,
        kind: isEmoji ? TgsItemKind.emoji : TgsItemKind.sticker,
        items: items,
      ),
    );
    if (isEmoji) {
      if (packId.startsWith('Topics-')) {
        topicEmojis.addAll(items);
      } else {
        otherEmojis.addAll(items);
      }
    } else {
      stickerPackLists.add(items);
    }
  }

  final stickers = <TgsRemoteItem>[];
  for (var row = 0; ; row++) {
    var added = false;
    for (final pack in stickerPackLists) {
      if (row < pack.length) {
        stickers.add(pack[row]);
        added = true;
      }
    }
    if (!added) break;
  }

  return TgsRemoteCatalog(
    baseUri: Uri(scheme: 'asset', host: 'bundle'),
    packs: packs,
    stickers: stickers,
    emojis: <TgsRemoteItem>[...topicEmojis, ...otherEmojis],
  );
}

Future<FastLottieNetworkFetchResult> fetchBundledTgsBytes(
  Uri uri, {
  FastLottieCancelToken? cancelToken,
  String? sourceCacheDirectory,
}) async {
  if (cancelToken?.isCancelled ?? false) {
    throw const FastLottieNetworkCancelledException();
  }
  final path = uri.pathSegments.join('/');
  if (!path.startsWith('assets/tgs/')) {
    throw ArgumentError.value(uri, 'uri', 'Expected a bundled TGS asset URI');
  }
  final data = await rootBundle.load(path);
  if (cancelToken?.isCancelled ?? false) {
    throw const FastLottieNetworkCancelledException();
  }
  return FastLottieNetworkFetchResult(
    Uint8List.view(data.buffer, data.offsetInBytes, data.lengthInBytes),
    fromDiskCache: false,
  );
}
