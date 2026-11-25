import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:archive/archive.dart';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

import 'fastlottie_test.dart' show fixture, bytes, render;
import 'tgs_fixtures.dart';

typedef _Difference = ({double mae, double ratio, double interiorMae});

class _ReviewedDifferences {
  _ReviewedDifferences() {
    final samples = jsonDecode(
      File('test/tgs_reviewed_differences.json').readAsStringSync(),
    ) as List<dynamic>;
    for (final sample in samples.cast<Map<String, dynamic>>()) {
      final variant = sample['variant'] as String?;
      final label =
          '${sample['asset']}'
          '${variant == null ? '' : ' ($variant)'}';
      _limits[(label, (sample['sample'] as num).toDouble())] = (
        mae: (sample['mae'] as num).toDouble(),
        ratio: (sample['badRatio'] as num).toDouble(),
        interiorMae: (sample['interiorMae'] as num).toDouble(),
      );
    }
  }

  final _limits = <(String, double), _Difference>{};
  int accepted = 0;

  bool accepts(String label, double fraction, _Difference measured) {
    final limit = _limits[(label, fraction)];
    if (limit == null ||
        measured.mae > limit.mae ||
        measured.ratio > limit.ratio ||
        measured.interiorMae > limit.interiorMae) {
      return false;
    }
    accepted++;
    return true;
  }
}

Future<List<String>> _compareAgainstLottie(
  String label,
  List<int> raw, {
  required _ReviewedDifferences reviewed,
  required List<double> fractions,
  bool saveImagesOnFailure = false,
  String? fileName,
}) async {
  final c = FastLottieComposition.fromBytes(raw);
  final p = FastLottiePlayer(c, cache: FastLottieCache.none);
  final reference = LottieDrawable(
    LottieComposition.parseJsonBytes(raw),
    frameRate: FrameRate.max,
  )..enableMergePaths = true;
  final failures = <String>[];
  try {
    for (final fraction in fractions) {
      final frame = (c.endFrame - c.startFrame - 1) * fraction;
      final actual = await render(
        (canvas) => p.draw(
          canvas,
          const ui.Rect.fromLTWH(0, 0, 256, 256),
          frame / (c.endFrame - c.startFrame),
          useFrameRate: false,
        ),
      );
      reference.setProgress(frame / reference.composition.durationFrames);
      final expected = await render(
        (canvas) =>
            reference.draw(canvas, const ui.Rect.fromLTWH(0, 0, 256, 256)),
      );
      var error = 0, bad = 0, interiorError = 0, interiorChannels = 0;
      for (var i = 0; i < actual.length; i++) {
        final delta = (actual[i] - expected[i]).abs();
        error += delta;
        if (delta > 12) bad++;
      }
      // TGS artwork has hundreds of adjacent stroked paths. Assess AA edges
      // separately from interiors, where colours/geometry must still agree.
      for (var y = 1; y < 255; y++) {
        for (var x = 1; x < 255; x++) {
          final pos = (y * 256 + x) * 4;
          var flat = true;
          for (var dy = -1; dy <= 1 && flat; dy++) {
            for (var dx = -1; dx <= 1 && flat; dx++) {
              for (var channel = 0; channel < 4; channel++) {
                if ((expected[pos + channel] -
                            expected[((y + dy) * 256 + x + dx) * 4 + channel])
                        .abs() >
                    2) {
                  flat = false;
                  break;
                }
              }
            }
          }
          if (flat) {
            for (var channel = 0; channel < 4; channel++) {
              interiorError += (actual[pos + channel] - expected[pos + channel])
                  .abs();
              interiorChannels++;
            }
          }
        }
      }
      final mae = error / actual.length, ratio = bad / actual.length;
      final interiorMae = interiorError / interiorChannels;
      if (mae >= .65 || ratio >= .016 || interiorMae >= .5) {
        if (saveImagesOnFailure && fileName != null) {
          File('/tmp/tgs_actual_${fileName}_$fraction.rgba')
              .writeAsBytesSync(actual);
          File('/tmp/tgs_expected_${fileName}_$fraction.rgba')
              .writeAsBytesSync(expected);
        }
        // These sample positions have visually reviewed anti-aliasing differences.
        if (reviewed.accepts(label, fraction, (
          mae: mae,
          ratio: ratio,
          interiorMae: interiorMae,
        ))) {
          continue;
        }
        failures.add(
          '$label @ $fraction MAE=$mae bad=$ratio interior=$interiorMae',
        );
      }
    }
  } finally {
    p.dispose();
  }
  return failures;
}

List<int> _withoutRadialHighlights(List<int> raw) {
  final doc = jsonDecode(utf8.decode(raw));
  var changed = false;
  void visit(Object? value) {
    if (value is Map<String, dynamic>) {
      if ((value['ty'] == 'gf' || value['ty'] == 'gs') && value['t'] == 2) {
        final length = value['h'];
        if (length is Map && length['k'] != 0) {
          value.remove('h');
          value.remove('a');
          changed = true;
        }
      }
      for (final child in value.values) {
        visit(child);
      }
    } else if (value is List) {
      for (final child in value) {
        visit(child);
      }
    }
  }

  visit(doc);
  return changed ? utf8.encode(jsonEncode(doc)) : raw;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'gzip is detected by magic, verified, and bounded before JSON parsing',
    () {
      final raw = bytes(fixture('icon'));
      final compressed = const GZipEncoder().encode(raw);
      expect(decodeLottieBytes(compressed), raw);
      expect(
        FastLottieComposition.fromBytes(compressed).size,
        const ui.Size(256, 256),
      );
      expect(
        () => decodeLottieBytes(compressed, maximumBytes: raw.length - 1),
        throwsException,
      );
      expect(
        () => decodeLottieBytes(raw, maximumBytes: raw.length - 1),
        throwsFormatException,
      );
      final corrupt = compressed.toList();
      corrupt[corrupt.length - 8] ^=
          1; // Damage gzip CRC, leaving its JSON intact.
      expect(() => decodeLottieBytes(corrupt), throwsException);
      expect(
        () => decodeLottieBytes(compressed.sublist(0, 10)),
        throwsException,
      );
    },
  );
  test('background compilation preserves unsupported-op JSON paths', () async {
    final raw = fixture('icon');
    raw['layers'][0]['shapes'].add({'ty': 'zz'});
    await expectLater(
      FastLottieComposition.fromBytesAsync(bytes(raw)),
      throwsA(
        isA<UnsupportedLottieException>().having(
          (e) => e.jsonPath,
          'path',
          contains('.ty'),
        ),
      ),
    );
  });
  test(
    'compile on worker, fork players without JSON and render on UI',
    () async {
      final composition = await FastLottieComposition.fromBytesAsync(
        bytes(fixture('icon')),
      );
      final players = [
        FastLottiePlayer(composition),
        FastLottiePlayer(composition),
      ];
      final recorder = ui.PictureRecorder();
      final canvas = ui.Canvas(recorder);
      for (final p in players) {
        p.draw(canvas, const ui.Rect.fromLTWH(0, 0, 64, 64), .25);
        p.dispose();
      }
      recorder.endRecording().dispose();
    },
  );
  test('differential TGS rendering on all supported stickers', () async {
    final filter = Platform.environment['TGS_DIFF_FILTER'] ?? '';
    final files = tgsFixtures().where(
      (file) => tgsAssetPath(file).contains(filter),
    );
    final failures = <String>[];
    final reviewed = _ReviewedDifferences();
    var compared = 0;
    final dump = Platform.environment['TGS_DIFF_IMAGES'] == '1';
    for (final file in files) {
      final original = decodeLottieBytes(file.readAsBytesSync());
      try {
        FastLottieComposition.fromBytes(original);
      } on UnsupportedLottieException {
        continue;
      }
      // package:lottie 3.8.2 disables MergePaths (`mm`) due to an internal
      // initialization timing bug in `LottieDrawable`, and does not implement
      // layer blend modes (`bm: 1..16`) on Flutter Canvas. Skip differential
      // comparison against package:lottie for these stickers; they are verified
      // against Skia ground truth in `test/merge_paths_test.dart` and
      // `test/blend_mode_test.dart`. It also ignores cross-layer path
      // expressions, layer styles, and Fill/Set Matte effects. Dedicated tests
      // render the original assets and verify each operation on simple shapes.
      final jsonStr = utf8.decode(original, allowMalformed: true);
      if (jsonStr.contains('"ty":"mm"') ||
          RegExp(r'"bm":\s*[1-9]').hasMatch(jsonStr) ||
          (jsonStr.contains("thisComp.layer('") &&
              jsonStr.contains('.path;')) ||
          RegExp(r'"sy":\s*\[').hasMatch(jsonStr) ||
          RegExp(r'"mn":\s*"ADBE (Fill|Set Matte3)"').hasMatch(jsonStr)) {
        continue;
      }
      // package:lottie 3.8.2 draws centered radial gradients even when h/a
      // are authored. Compare the shared subset on both sides; focal gradients
      // are checked on the unmodified art in software_rasterizer_test.dart.
      final raw = _withoutRadialHighlights(original);
      final asset = tgsAssetPath(file);
      // The reference renderer clamps child frames to the root duration.
      const sharedSamples = {
        'NotoEmoji/emoji_u1f42c.tgs': [0.0, .1, .25, .75],
        'NotoEmoji/emoji_u1f994.tgs': [0.0, .1, .25, .6],
      };
      failures.addAll(
        await _compareAgainstLottie(
          asset,
          raw,
          reviewed: reviewed,
          fractions:
              sharedSamples[asset] ??
              const [0.0, .1, .6, .25, .9, .4, .75, .95],
          saveImagesOnFailure: dump,
          fileName: file.uri.pathSegments.last,
        ),
      );
      compared++;
    }
    // ignore: avoid_print
    print(
      'TGS_DIFF $compared compared, ${reviewed.accepted} reviewed samples, '
      '${failures.length} failed samples\n${failures.join('\n')}',
    );
    expect(failures, isEmpty);
  }, timeout: const Timeout(Duration(minutes: 5)));
  test('audit TGS support', () {
    var accepted = 0, rejected = 0;
    for (final file in tgsFixtures()) {
      try {
        final c = FastLottieComposition.fromBytes(file.readAsBytesSync());
        FastLottiePlayer(c).dispose();
        accepted++;
        // ignore: avoid_print
        print('TGS_ACCEPT ${file.path}');
      } on UnsupportedLottieException catch (e) {
        rejected++;
        // ignore: avoid_print
        print('TGS_REJECT ${file.path}: ${e.message}');
      }
    }
    // ignore: avoid_print
    print('TGS_AUDIT $accepted native, $rejected unsupported');
    expect(accepted, 881);
    expect(rejected, 0);
  });
}
