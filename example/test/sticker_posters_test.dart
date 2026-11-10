import 'package:fastlottie_example/tgs/gallery.dart';
import 'package:fastlottie_example/tgs/posters.dart';
import 'package:fastlottie_example/tgs/rich_messages.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('bundled silhouettes cover every TGS without decoding a TGS', () async {
    final posters = await StickerPosters.load();
    try {
      final catalog = await loadTgsCatalog(rootBundle);
      expect(posters.sources.keys.toSet(), {...catalog, ...topicEmojiAssets});
      expect(posters.image.width, 600);
      expect(posters.image.height, 840);
      for (final rect in posters.sources.values) {
        expect(rect.right, lessThanOrEqualTo(posters.image.width));
        expect(rect.bottom, lessThanOrEqualTo(posters.image.height));
      }
    } finally {
      posters.dispose();
    }
  });
}
