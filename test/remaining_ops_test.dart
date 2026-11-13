import 'dart:convert';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

import 'fastlottie_test.dart' show fixture, bytes, render, compare;
import 'path_ops_test.dart' show animated, constant;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('animated skew and axis with nonuniform scale match baseline on reverse seeks', () async {
    final j = fixture('static');
    final t = j['layers'][0]['shapes'][0]['it'].last;
    t['sk'] = animated(-25, 30);
    t['sa'] = animated(20, 65);
    t['s'] = constant([80, 120]);
    t['a'] = constant([30, 20]);
    await compare(j, [0, 15, 45, 59, 10, 0]);
  });
  test('content scale expression uses animated source rather than authored fallback', () async {
    final j = fixture('static');
    j['layers'][0]['shapes'][0]['nm'] = 'Target';
    final source = j['layers'][0]['shapes'][0]['it'].last;
    source['s'] = animated([60, 80], [140, 110]);
    j['layers'][0]['shapes'][1]['it'].last['s'] = {
      'a': 0,
      'k': [100, 100],
      'x': "var \$bm_rt;\n\$bm_rt = content('Target').transform.scale;",
    };
    final expected = jsonDecode(jsonEncode(j)) as Map<String, dynamic>;
    expected['layers'][0]['shapes'][1]['it'].last['s'] = source['s'];
    final player = FastLottiePlayer(
      FastLottieComposition.fromJson(j),
      cache: FastLottieCache.none,
    );
    final baseline = LottieDrawable(
      LottieComposition.parseJsonBytes(bytes(expected)),
      frameRate: FrameRate.max,
    );
    for (final frame in [0, 15, 45, 59, 5]) {
      baseline.setProgress(frame / 60);
      final actual = await render(
        (c) => player.draw(
          c,
          const ui.Rect.fromLTWH(0, 0, 256, 256),
          frame / 60,
          useFrameRate: false,
        ),
      );
      final reference = await render(
        (c) => baseline.draw(c, const ui.Rect.fromLTWH(0, 0, 256, 256)),
      );
      var sum = 0;
      for (var i = 0; i < actual.length; i++) {
        sum += (actual[i] - reference[i]).abs();
      }
      expect(sum / actual.length, lessThan(.65));
    }
    player.dispose();
  });
  test('direct self opacity reads pre-expression track; unknown scripts remain explicit errors', () async {
    final j = fixture('static');
    final group = j['layers'][0]['shapes'][0];
    group['nm'] = 'Shape 2';
    final stroke = group['it'][2];
    stroke['nm'] = 'Stroke 1';
    stroke['o'] = animated(20, 90)..['x'] = "var \$bm_rt;\n\$bm_rt = content('Shape 2').content('Stroke 1').opacity;";
    await compare(j, [0, 15, 59, 0]);
    stroke['o']['x'] = 'arbitraryJavaScript()';
    expect(
      () => FastLottieComposition.fromJson(j),
      throwsA(isA<UnsupportedLottieException>()),
    );
  });
  test('escaped names and chained content expressions match baked tracks', () {
    final json = fixture('static');
    final shapes = json['layers'][0]['shapes'] as List;
    final source = shapes[0]..['nm'] = 'Sourcé';
    final alias = shapes[1]..['nm'] = 'Alias';
    final track = animated([60, 80], [140, 110]);
    final sourceTransform = source['it'].last;
    final aliasTransform = alias['it'].last;
    sourceTransform['s'] = track;
    Map<String, dynamic> expression(String name) => {
      ...constant([100, 100]),
      'x': "var \$bm_rt;\n\$bm_rt = content('$name').transform.scale;",
    };
    aliasTransform['s'] = expression(r'Sourc\u00e9');
    final layerTransform = json['layers'][0]['ks'];
    layerTransform['s'] = expression('Alias');
    final before = jsonEncode(json);
    final actual = FastLottieComposition.fromJson(json);
    expect(jsonEncode(json), before);
    aliasTransform['s'] = layerTransform['s'] = track;
    expect(actual.contentKey, FastLottieComposition.fromJson(json).contentKey);
  });

  test('cyclic content expressions still report the expression chain', () {
    final json = fixture('static');
    final shapes = json['layers'][0]['shapes'] as List;
    for (var i = 0; i < 2; i++) {
      final shape = shapes[i]..['nm'] = 'Group $i';
      shape['it'].last['s'] = {
        ...constant([100, 100]),
        'x':
            "var \$bm_rt;\n\$bm_rt = content('Group ${1 - i}').transform.scale;",
      };
    }
    expect(
      () => FastLottieComposition.fromJson(json),
      throwsA(
        isA<UnsupportedLottieException>()
            .having((e) => e.jsonPath, 'path', contains('.s.x.x'))
            .having((e) => e.message, 'message', contains('Cyclic expression')),
      ),
    );
  });

  test('layer controls validate references without altering pixels', () async {
    final j = fixture('static');
    j['layers'][0]['ef'] = [
      {
        'ty': 5,
        'mn': 'ADBE Layer Control',
        'ef': [
          {'ty': 10, 'mn': 'ADBE Layer Control-0001', 'v': constant(1)},
        ],
      },
    ];
    await compare(j, [0]);
    j['layers'][0]['ef'][0]['ef'][0]['v'] = constant(9999);
    expect(
      () => FastLottieComposition.fromJson(j),
      throwsA(isA<UnsupportedLottieException>()),
    );
  });
}
