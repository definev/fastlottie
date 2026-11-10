// Run: flutter test --no-pub tool/generate_sticker_posters.dart
// Regenerate whenever the bundled TGS catalog changes.
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('generate bundled first-frame silhouette sheet', () async {
    final bundled = File('example/pubspec.yaml')
        .readAsLinesSync()
        .map((line) => line.trim())
        .where((line) => line.startsWith('- assets/tgs/'))
        .map((line) => 'example/${line.substring(2)}')
        .toList();
    final files =
        Directory('example/assets/tgs')
            .listSync(recursive: true)
            .whereType<File>()
            .where(
              (f) =>
                  f.path.endsWith('.tgs') &&
                  bundled.any(
                    (entry) => entry.endsWith('/')
                        ? f.path.startsWith(entry)
                        : f.path == entry,
                  ),
            )
            .toList()
          ..sort((a, b) => a.path.compareTo(b.path));
    const edge = 56, stride = 60, columns = 10;
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final metadata = <String, Object>{};
    for (var i = 0; i < files.length; i++) {
      final c = FastLottieComposition.fromBytes(files[i].readAsBytesSync());
      final player = FastLottiePlayer(c, cache: FastLottieCache.none);
      final rect = Rect.fromLTWH(
        (i % columns * stride + 2).toDouble(),
        (i ~/ columns * stride + 2).toDouble(),
        edge.toDouble(),
        edge.toDouble(),
      );
      canvas.saveLayer(
        rect,
        Paint()
          ..colorFilter = const ColorFilter.mode(
            Color(0xff77717f),
            BlendMode.srcIn,
          ),
      );
      canvas.clipRect(rect);
      player.draw(canvas, rect, 0);
      canvas.restore();
      player.dispose();
      metadata[files[i].path.substring('example/'.length)] = i;
    }
    final picture = recorder.endRecording();
    final image = await picture.toImage(
      columns * stride,
      ((files.length + columns - 1) ~/ columns) * stride,
    );
    try {
      final png = await image.toByteData(format: ui.ImageByteFormat.png);
      File('example/assets/sticker_posters.png')
          .writeAsBytesSync(png!.buffer.asUint8List());
      File('example/assets/sticker_posters.json').writeAsStringSync(
        jsonEncode({
          'edge': edge,
          'stride': stride,
          'columns': columns,
          'assets': metadata,
        }),
      );
    } finally {
      image.dispose();
      picture.dispose();
    }
  });
}
