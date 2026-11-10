import 'dart:convert';
import 'dart:ui' as ui;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

/// One bundled texture, decoded independently of every compressed TGS/model.
class StickerPosters {
  StickerPosters._(this.image, this.sources);
  final ui.Image image;
  final Map<String, Rect> sources;
  final _paint = Paint()..filterQuality = FilterQuality.low;

  static Future<StickerPosters> load({AssetBundle? bundle}) async {
    final assets = bundle ?? rootBundle;
    final data = await assets.load('assets/sticker_posters.json');
    final metadata = jsonDecode(
      utf8.decode(
        data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
      ),
    ) as Map<String, dynamic>;
    final bytes = await assets.load('assets/sticker_posters.png');
    final codec = await ui.instantiateImageCodec(
      bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes),
    );
    try {
      final frame = await codec.getNextFrame();
      final edge = metadata['edge'] as int;
      final stride = metadata['stride'] as int;
      final columns = metadata['columns'] as int;
      return StickerPosters._(frame.image, {
        for (final entry
            in (metadata['assets'] as Map<String, dynamic>).entries)
          entry.key: Rect.fromLTWH(
            ((entry.value as int) % columns * stride + 2).toDouble(),
            ((entry.value as int) ~/ columns * stride + 2).toDouble(),
            edge.toDouble(),
            edge.toDouble(),
          ),
      });
    } finally {
      codec.dispose();
    }
  }

  void draw(Canvas canvas, String asset, Rect destination) {
    final source = sources[asset];
    if (source == null) return;
    final fitted = applyBoxFit(BoxFit.contain, source.size, destination.size);
    canvas.drawImageRect(
      image,
      source,
      Alignment.center.inscribe(fitted.destination, destination),
      _paint,
    );
  }

  void dispose() => image.dispose();
}
