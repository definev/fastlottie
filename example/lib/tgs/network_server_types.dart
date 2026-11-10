import 'package:flutter/foundation.dart';

enum TgsItemKind { sticker, emoji }

const List<String> bundledTopicEmojiFileNames = <String>[
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
];

const List<String> defaultEmojiShortcodes = <String>[
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

String friendlyPackTitle(String packId) {
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
  final raw = dash > 0 ? packId.substring(0, dash) : packId;
  return raw.replaceAllMapped(
    RegExp(r'(?<=[a-z])(?=[A-Z])'),
    (_) => ' ',
  );
}

@immutable
class TgsRemoteItem {
  const TgsRemoteItem({
    required this.id,
    required this.packId,
    required this.packTitle,
    required this.fileName,
    required this.kind,
    required this.relativePath,
    required this.uri,
    required this.bytes,
    required this.label,
    this.shortcode,
  });

  factory TgsRemoteItem.fromJson(
    Map<String, dynamic> json,
    Uri baseUri,
  ) {
    final relativePath = json['url'] as String;
    final resolved = baseUri.resolve(relativePath);
    final kindStr = json['kind'] as String? ?? 'sticker';
    return TgsRemoteItem(
      id: json['id'] as String,
      packId: json['packId'] as String,
      packTitle: json['packTitle'] as String,
      fileName: json['fileName'] as String,
      kind: kindStr == 'emoji' ? TgsItemKind.emoji : TgsItemKind.sticker,
      relativePath: relativePath,
      uri: resolved,
      bytes: (json['bytes'] as num?)?.toInt() ?? 0,
      label: json['label'] as String? ?? (json['fileName'] as String),
      shortcode: json['shortcode'] as String?,
    );
  }

  final String id;
  final String packId;
  final String packTitle;
  final String fileName;
  final TgsItemKind kind;
  final String relativePath;
  final Uri uri;
  final int bytes;
  final String label;
  final String? shortcode;

  String get urlString => uri.toString();

  Map<String, dynamic> toJson() => <String, dynamic>{
    'id': id,
    'packId': packId,
    'packTitle': packTitle,
    'fileName': fileName,
    'kind': kind.name,
    'url': relativePath,
    'bytes': bytes,
    'label': label,
    if (shortcode != null) 'shortcode': shortcode,
  };
}

@immutable
class TgsRemotePack {
  const TgsRemotePack({
    required this.id,
    required this.title,
    required this.kind,
    required this.items,
  });

  factory TgsRemotePack.fromJson(
    Map<String, dynamic> json,
    Uri baseUri,
  ) => TgsRemotePack(
    id: json['id'] as String,
    title: json['title'] as String,
    kind: (json['kind'] as String?) == 'emoji'
        ? TgsItemKind.emoji
        : TgsItemKind.sticker,
    items: [
      for (final raw in json['items'] as List<dynamic>)
        TgsRemoteItem.fromJson(raw as Map<String, dynamic>, baseUri),
    ],
  );

  final String id;
  final String title;
  final TgsItemKind kind;
  final List<TgsRemoteItem> items;

  Map<String, dynamic> toJson() => <String, dynamic>{
    'id': id,
    'title': title,
    'kind': kind.name,
    'items': [for (final item in items) item.toJson()],
  };
}

class TgsRemoteCatalog {
  TgsRemoteCatalog({
    required this.baseUri,
    required this.packs,
    required this.stickers,
    required this.emojis,
  }) : shortcodeMap = {
         for (final emoji in emojis)
           if (emoji.shortcode != null) emoji.shortcode!: emoji,
       };

  factory TgsRemoteCatalog.fromJson(
    Map<String, dynamic> json,
    Uri baseUri,
  ) {
    final packs = [
      for (final raw in json['packs'] as List<dynamic>)
        TgsRemotePack.fromJson(raw as Map<String, dynamic>, baseUri),
    ];
    final byId = <String, TgsRemoteItem>{
      for (final pack in packs)
        for (final item in pack.items) item.id: item,
    };
    final stickers = <TgsRemoteItem>[
      for (final id in json['stickerOrder'] as List<dynamic>? ?? const [])
        if (byId.containsKey(id)) byId[id as String]!,
    ];
    if (stickers.isEmpty) {
      for (final pack in packs) {
        if (pack.kind == TgsItemKind.sticker) {
          stickers.addAll(pack.items);
        }
      }
    }
    final emojis = <TgsRemoteItem>[
      for (final id in json['emojiOrder'] as List<dynamic>? ?? const [])
        if (byId.containsKey(id)) byId[id as String]!,
    ];
    if (emojis.isEmpty) {
      for (final pack in packs) {
        if (pack.kind == TgsItemKind.emoji) {
          emojis.addAll(pack.items);
        }
      }
    }
    return TgsRemoteCatalog(
      baseUri: baseUri,
      packs: packs,
      stickers: stickers,
      emojis: emojis,
    );
  }

  final Uri baseUri;
  final List<TgsRemotePack> packs;
  final List<TgsRemoteItem> stickers;
  final List<TgsRemoteItem> emojis;
  final Map<String, TgsRemoteItem> shortcodeMap;

  List<TgsRemotePack> get stickerPacks =>
      packs.where((p) => p.kind == TgsItemKind.sticker).toList(growable: false);

  Map<String, dynamic> toJson() => <String, dynamic>{
    'baseUrl': baseUri.toString(),
    'packs': [for (final pack in packs) pack.toJson()],
    'stickerOrder': [for (final item in stickers) item.id],
    'emojiOrder': [for (final item in emojis) item.id],
  };
}

@immutable
class LocalTgsServerStats {
  const LocalTgsServerStats({
    this.requests = 0,
    this.tgsRequests = 0,
    this.notModifiedResponses = 0,
    this.abortedRequests = 0,
    this.bytesServed = 0,
    this.delayMs = 0,
    this.lastPath = '',
  });

  final int requests;
  final int tgsRequests;
  final int notModifiedResponses;
  final int abortedRequests;
  final int bytesServed;
  final int delayMs;
  final String lastPath;

  LocalTgsServerStats copyWith({
    int? requests,
    int? tgsRequests,
    int? notModifiedResponses,
    int? abortedRequests,
    int? bytesServed,
    int? delayMs,
    String? lastPath,
  }) => LocalTgsServerStats(
    requests: requests ?? this.requests,
    tgsRequests: tgsRequests ?? this.tgsRequests,
    notModifiedResponses: notModifiedResponses ?? this.notModifiedResponses,
    abortedRequests: abortedRequests ?? this.abortedRequests,
    bytesServed: bytesServed ?? this.bytesServed,
    delayMs: delayMs ?? this.delayMs,
    lastPath: lastPath ?? this.lastPath,
  );
}
