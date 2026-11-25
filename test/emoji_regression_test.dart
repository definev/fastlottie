import 'dart:io';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show render;
import 'tgs_fixtures.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const size = 256;
  const rect = ui.Rect.fromLTWH(0, 0, size * 1.0, size * 1.0);

  test('anxious face keeps its eyes, eyebrows and mouth', () async {
    final file = File('$tgsCorpusPath/NotoEmoji/emoji_u1f630.tgs');
    final comp = FastLottieComposition.fromBytes(file.readAsBytesSync());
    final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
    final software = FastLottieSoftwareSession(
      comp,
      pixelWidth: size,
      pixelHeight: size,
    );
    addTearDown(player.dispose);
    addTearDown(software.dispose);
    // Interior points in both eyes, both eyebrows and the mouth, checked
    // against the original sticker rendered by rlottie at these frames.
    const features = [(88, 120), (165, 120), (72, 74), (184, 75), (128, 178)];
    final duration = comp.endFrame - comp.startFrame;
    for (final frame in [0.0, 45.0, 160.0, 0.0]) {
      final canvas = await render(
        (c) => player.draw(c, rect, frame / duration, useFrameRate: false),
      );
      final pixels = software.renderFrame(comp.startFrame + frame);
      for (final (x, y) in features) {
        final i = y * size + x;
        expect(
          pixels[i],
          0xff422b0d,
          reason: 'software at ($x, $y), frame $frame',
        );
        expect(canvas.sublist(4 * i, 4 * i + 4), [
          66,
          43,
          13,
          255,
        ], reason: 'Canvas at ($x, $y), frame $frame');
      }
    }
  });

  for (final (name, code, frames) in [
    ('bubble tea', '1f9cb', [0, 30, 70, 110, 140, 166, 191]),
    ('ant', '1f41c', [0, 16, 17, 100, 199, 200, 239]),
  ]) {
    test(
      '$name renders intact in Canvas and software across transitions',
      () async {
        final file = File('$tgsCorpusPath/NotoEmoji/emoji_u$code.tgs');
        final comp = FastLottieComposition.fromBytes(file.readAsBytesSync());
        final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
        addTearDown(player.dispose);
        final session = FastLottieSoftwareSession(
          comp,
          pixelWidth: size,
          pixelHeight: size,
        );
        addTearDown(session.dispose);
        final duration = comp.endFrame - comp.startFrame;
        for (final frame in frames) {
          final vector = await render(
            (canvas) => player.draw(canvas, rect, frame / duration),
          );
          final software = session.renderFrame(frame.toDouble());
          int vectorAlpha(int x, int y) => vector[(y * size + x) * 4 + 3];
          int softwareAlpha(int x, int y) => software[y * size + x] >>> 24;

          if (code == '1f9cb') {
            // Body is present whether the tea is full, draining, or empty.
            expect(
              vectorAlpha(110, 190),
              greaterThan(70),
              reason: 'frame $frame',
            );
            expect(
              softwareAlpha(110, 190),
              greaterThan(70),
              reason: 'frame $frame',
            );
          } else {
            // The large solid that supplies the mouth must be clipped to its mask.
            expect(vectorAlpha(10, 10), 0, reason: 'frame $frame');
            expect(softwareAlpha(10, 10), 0, reason: 'frame $frame');
            expect(
              softwareAlpha(115, 130),
              greaterThan(200),
              reason: 'frame $frame',
            );
          }

          var totalError = 0;
          for (var i = 0; i < software.length; i++) {
            final pixel = software[i];
            for (var channel = 0; channel < 4; channel++) {
              final shift = channel == 3 ? 24 : 16 - channel * 8;
              totalError +=
                  (((pixel >>> shift) & 255) - vector[i * 4 + channel]).abs();
            }
          }
          expect(
            totalError / vector.length,
            lessThan(2.0),
            reason: 'frame $frame',
          );
        }
      },
    );
  }
}
