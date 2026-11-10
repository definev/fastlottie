import 'package:flutter/foundation.dart';

enum TgsItemKind { sticker, emoji }

/// All 88 natively supported Topics Emoji files (`Topics-1794247486249`),
/// verified pixel-differentially against `package:lottie` / native `rlottie`.
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
];

/// Visually verified shortcode & display label for all 112 Topics files (`661`–`772`).
const Map<String, ({String shortcode, String label})> topicEmojiMetadataByFile =
    <String, ({String shortcode, String label})>{
      'file_4798661.tgs': (shortcode: ':newspaper:', label: 'Newspaper'),
      'file_4798662.tgs': (
        shortcode: ':studio_microphone:',
        label: 'Studio Microphone',
      ),
      'file_4798663.tgs': (shortcode: ':zap:', label: 'Lightning Bolt'),
      'file_4798664.tgs': (shortcode: ':top:', label: 'TOP Arrow'),
      'file_4798665.tgs': (shortcode: ':bulb:', label: 'Light Bulb'),
      'file_4798666.tgs': (shortcode: ':cool:', label: 'COOL Button'),
      'file_4798667.tgs': (shortcode: ':memo:', label: 'Memo & Pencil'),
      'file_4798668.tgs': (shortcode: ':exclamation:', label: 'Red Exclamation'),
      'file_4798669.tgs': (shortcode: ':mag:', label: 'Magnifying Glass'),
      'file_4798670.tgs': (shortcode: ':calendar:', label: 'Calendar Dec 31'),
      'file_4798671.tgs': (shortcode: ':megaphone:', label: 'Megaphone'),
      'file_4798672.tgs': (shortcode: ':fire:', label: 'Fire Flame'),
      'file_4798673.tgs': (shortcode: ':file_folder:', label: 'Open Folder'),
      'file_4798674.tgs': (shortcode: ':heart:', label: 'Red Heart'),
      'file_4798675.tgs': (shortcode: ':question:', label: 'Red Question'),
      'file_4798676.tgs': (shortcode: ':chart_up:', label: 'Chart Increasing'),
      'file_4798677.tgs': (shortcode: ':chart_down:', label: 'Chart Decreasing'),
      'file_4798678.tgs': (shortcode: ':gem:', label: 'Diamond Gem'),
      'file_4798679.tgs': (shortcode: ':speaking_head:', label: 'Speaking Head'),
      'file_4798680.tgs': (shortcode: ':moneybag:', label: 'Money Bag'),
      'file_4798681.tgs': (
        shortcode: ':money_with_wings:',
        label: 'Money With Wings',
      ),
      'file_4798682.tgs': (
        shortcode: ':interrobang:',
        label: 'Exclamation Question',
      ),
      'file_4798683.tgs': (shortcode: ':coin:', label: 'Silver Coin'),
      'file_4798684.tgs': (shortcode: ':video_game:', label: 'Game Controller'),
      'file_4798685.tgs': (
        shortcode: ':currency_exchange:',
        label: 'Currency Exchange',
      ),
      'file_4798686.tgs': (shortcode: ':iphone:', label: 'Smartphone'),
      'file_4798687.tgs': (shortcode: ':laptop:', label: 'Laptop Telegram'),
      'file_4798688.tgs': (shortcode: ':red_car:', label: 'Red Car'),
      'file_4798689.tgs': (shortcode: ':house:', label: 'House'),
      'file_4798690.tgs': (shortcode: ':cupid:', label: 'Heart With Arrow'),
      'file_4798691.tgs': (shortcode: ':tada:', label: 'Party Popper'),
      'file_4798692.tgs': (
        shortcode: ':checkered_flag:',
        label: 'Chequered Flag',
      ),
      'file_4798693.tgs': (
        shortcode: ':bangbang:',
        label: 'Double Exclamation',
      ),
      'file_4798694.tgs': (shortcode: ':trophy:', label: 'Trophy'),
      'file_4798695.tgs': (shortcode: ':clapper:', label: 'Clapper Board'),
      'file_4798696.tgs': (shortcode: ':musical_note:', label: 'Musical Note'),
      'file_4798697.tgs': (shortcode: ':underage:', label: 'No One Under 18'),
      'file_4798698.tgs': (shortcode: ':books:', label: 'Stack of Books'),
      'file_4798699.tgs': (shortcode: ':crown:', label: 'Gold Crown'),
      'file_4798700.tgs': (shortcode: ':soccer:', label: 'Soccer Ball'),
      'file_4798701.tgs': (shortcode: ':basketball:', label: 'Basketball'),
      'file_4798702.tgs': (shortcode: ':tv:', label: 'Television'),
      'file_4798703.tgs': (shortcode: ':eyes:', label: 'Eyes'),
      'file_4798704.tgs': (shortcode: ':lips:', label: 'Biting Lips'),
      'file_4798705.tgs': (shortcode: ':lipstick:', label: 'Lipstick'),
      'file_4798706.tgs': (shortcode: ':high_heel:', label: 'Red High Heel'),
      'file_4798707.tgs': (shortcode: ':luggage:', label: 'Leather Suitcase'),
      'file_4798708.tgs': (shortcode: ':beach_umbrella:', label: 'Beach Island'),
      'file_4798709.tgs': (shortcode: ':airplane:', label: 'Airplane'),
      'file_4798710.tgs': (
        shortcode: ':partly_sunny:',
        label: 'Sun Behind Cloud',
      ),
      'file_4798711.tgs': (shortcode: ':unicorn:', label: 'Unicorn Rainbow'),
      'file_4798712.tgs': (shortcode: ':shopping_bags:', label: 'Shopping Bags'),
      'file_4798713.tgs': (shortcode: ':shopping_cart:', label: 'Shopping Cart'),
      'file_4798714.tgs': (shortcode: ':motor_boat:', label: 'Speedboat'),
      'file_4798715.tgs': (shortcode: ':handbag:', label: 'Handbag & Mirror'),
      'file_4798716.tgs': (
        shortcode: ':steam_locomotive:',
        label: 'Locomotive Train',
      ),
      'file_4798717.tgs': (shortcode: ':camping:', label: 'Camping Tent'),
      'file_4798718.tgs': (shortcode: ':mountain:', label: 'Mountain Peak'),
      'file_4798719.tgs': (shortcode: ':robot:', label: 'Robot Face'),
      'file_4798720.tgs': (
        shortcode: ':mirror_ball:',
        label: 'Disco Mirror Ball',
      ),
      'file_4798721.tgs': (shortcode: ':tickets:', label: 'Admission Tickets'),
      'file_4798722.tgs': (shortcode: ':pirate_flag:', label: 'Pirate Flag'),
      'file_4798723.tgs': (shortcode: ':ballot_box:', label: 'Ballot Box'),
      'file_4798724.tgs': (shortcode: ':strawberry:', label: 'Strawberry'),
      'file_4798725.tgs': (shortcode: ':telescope:', label: 'Telescope'),
      'file_4798726.tgs': (shortcode: ':mortar_board:', label: 'Graduation Cap'),
      'file_4798727.tgs': (shortcode: ':microscope:', label: 'Microscope'),
      'file_4798728.tgs': (shortcode: ':notes:', label: 'Musical Notes'),
      'file_4798729.tgs': (
        shortcode: ':microphone:',
        label: 'Handheld Microphone',
      ),
      'file_4798730.tgs': (shortcode: ':dancer:', label: 'Woman Dancing'),
      'file_4798731.tgs': (
        shortcode: ':military_helmet:',
        label: 'Military Helmet',
      ),
      'file_4798732.tgs': (shortcode: ':pouch:', label: 'Leather Pouch'),
      'file_4798733.tgs': (shortcode: ':man_dancing:', label: 'Man Dancing'),
      'file_4798734.tgs': (shortcode: ':nail_polish:', label: 'Nail Polish'),
      'file_4798735.tgs': (shortcode: ':test_tube:', label: 'Chemistry Flask'),
      'file_4798736.tgs': (shortcode: ':family:', label: 'Family Portrait'),
      'file_4798737.tgs': (
        shortcode: ':classical_building:',
        label: 'Classical Building',
      ),
      'file_4798738.tgs': (shortcode: ':baby:', label: 'Baby Pacifier'),
      'file_4798739.tgs': (
        shortcode: ':pregnant_woman:',
        label: 'Pregnant Woman',
      ),
      'file_4798740.tgs': (shortcode: ':abacus:', label: 'Abacus'),
      'file_4798741.tgs': (shortcode: ':printer:', label: 'Printer'),
      'file_4798742.tgs': (
        shortcode: ':police_officer:',
        label: 'Police Officer',
      ),
      'file_4798743.tgs': (shortcode: ':stethoscope:', label: 'Stethoscope'),
      'file_4798744.tgs': (shortcode: ':pill:', label: 'Red & Yellow Pill'),
      'file_4798745.tgs': (shortcode: ':id_card:', label: 'ID Card'),
      'file_4798746.tgs': (shortcode: ':syringe:', label: 'Syringe'),
      'file_4798747.tgs': (shortcode: ':soap:', label: 'Soap & Bubbles'),
      'file_4798748.tgs': (shortcode: ':customs:', label: 'Customs Checkpoint'),
      'file_4798749.tgs': (shortcode: ':fish:', label: 'Blue Fish'),
      'file_4798750.tgs': (shortcode: ':art:', label: 'Artist Palette'),
      'file_4798751.tgs': (
        shortcode: ':performing_arts:',
        label: 'Performing Arts',
      ),
      'file_4798752.tgs': (
        shortcode: ':plate_with_cutlery:',
        label: 'Plate & Cutlery',
      ),
      'file_4798753.tgs': (shortcode: ':tophat:', label: 'Top Hat'),
      'file_4798754.tgs': (shortcode: ':crystal_ball:', label: 'Crystal Ball'),
      'file_4798755.tgs': (
        shortcode: ':tropical_drink:',
        label: 'Tropical Drink',
      ),
      'file_4798756.tgs': (shortcode: ':birthday:', label: 'Birthday Cake'),
      'file_4798757.tgs': (shortcode: ':hamburger:', label: 'Cheeseburger'),
      'file_4798758.tgs': (shortcode: ':pizza:', label: 'Pizza Slice'),
      'file_4798759.tgs': (shortcode: ':coffee:', label: 'Coffee Cup'),
      'file_4798760.tgs': (shortcode: ':sushi:', label: 'Sushi Nigiri'),
      'file_4798761.tgs': (
        shortcode: ':speech_balloon:',
        label: 'Speech Balloon',
      ),
      'file_4798762.tgs': (
        shortcode: ':christmas_tree:',
        label: 'Christmas Tree',
      ),
      'file_4798763.tgs': (shortcode: ':microbe:', label: 'Green Microbe'),
      'file_4798764.tgs': (shortcode: ':writing_hand:', label: 'Writing Hand'),
      'file_4798765.tgs': (shortcode: ':star:', label: 'Glowing Star'),
      'file_4798766.tgs': (
        shortcode: ':jack_o_lantern:',
        label: 'Jack-O-Lantern',
      ),
      'file_4798767.tgs': (
        shortcode: ':white_check_mark:',
        label: 'Check Mark Button',
      ),
      'file_4798768.tgs': (
        shortcode: ':military_medal:',
        label: 'Military Medal',
      ),
      'file_4798769.tgs': (shortcode: ':clown_face:', label: 'Clown Face'),
      'file_4798770.tgs': (shortcode: ':brain:', label: 'Brain'),
      'file_4798771.tgs': (shortcode: ':guide_dog:', label: 'Guide Dog'),
      'file_4798772.tgs': (shortcode: ':cat2:', label: 'Ginger Cat'),
    };

final List<String> defaultEmojiShortcodes = List<String>.unmodifiable([
  for (final name in bundledTopicEmojiFileNames)
    topicEmojiMetadataByFile[name]!.shortcode,
]);

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
