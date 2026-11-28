import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/testing.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'moon_fixtures.dart';

Future<Uint8List> render(void Function(Canvas) draw, {int size = 256}) async {
  final recorder = ui.PictureRecorder();
  draw(Canvas(recorder));
  final picture = recorder.endRecording();
  final image = await picture.toImage(size, size);
  final data = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
  image.dispose();
  picture.dispose();
  return data!.buffer.asUint8List();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final fixtures = {'emoji_u1f31a': bytes1f31a, 'emoji_u1f31d': bytes1f31d};

  for (final entry in fixtures.entries) {
    final name = entry.key;
    final bytes = entry.value;
    test('$name software vs vector differential across all frames', () async {
      final comp = FastLottieComposition.fromBytes(bytes);

      const size = 256;
      const rect = Rect.fromLTWH(0, 0, size * 1.0, size * 1.0);
      final duration = comp.endFrame - comp.startFrame;

      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      final session = FastLottieSoftwareSession(
        comp,
        pixelWidth: size,
        pixelHeight: size,
      );
      addTearDown(player.dispose);
      addTearDown(session.dispose);

      var maxMae = 0.0;
      var maxBad = 0.0;
      var worstFrame = 0.0;

      for (var f = 0.0; f < duration; f += 2.0) {
        final progress = f / duration;
        final vector = await render(
          (c) => player.draw(c, rect, progress, useFrameRate: false),
          size: size,
        );
        final software = session.renderFrame(comp.startFrame + f);

        var error = 0, bad = 0;
        for (var i = 0; i < size * size; i++) {
          final vr = vector[i * 4];
          final vg = vector[i * 4 + 1];
          final vb = vector[i * 4 + 2];
          final va = vector[i * 4 + 3];

          final sp = software[i];
          final sa = (sp >>> 24) & 0xff;
          final sr = (sp >>> 16) & 0xff;
          final sg = (sp >>> 8) & 0xff;
          final sb = sp & 0xff;

          final dr = (vr - sr).abs();
          final dg = (vg - sg).abs();
          final db = (vb - sb).abs();
          final da = (va - sa).abs();
          final d = dr + dg + db + da;
          error += d;
          if (d > 60) bad++;
        }
        final mae = error / (size * size * 4);
        final badFraction = bad / (size * size);
        if (mae > maxMae) {
          maxMae = mae;
          worstFrame = f;
        }
        if (badFraction > maxBad) maxBad = badFraction;

        if (badFraction > 0.05) {
          // ignore: avoid_print
          print(
            '$name SOFTWARE MISMATCH at frame $f: MAE=$mae, badFraction=$badFraction',
          );
        }
      }
      // ignore: avoid_print
      print(
        'Software vs Vector $name: max MAE=$maxMae at frame $worstFrame, max badFraction=$maxBad',
      );
      expect(maxMae, lessThan(0.5));
      expect(maxBad, lessThan(0.01));
    });
  }
}
