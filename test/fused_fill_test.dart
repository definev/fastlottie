import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter_test/flutter_test.dart';

import 'path_ops_test.dart' show animated, constant, fill, scene, stroke, trim;

Map<String, dynamic> morphFill({bool stroked = false, bool trimmed = false}) {
  Map<String, dynamic> shape(double offset) => {
    'v': [
      [30 + offset, 35],
      [180, 60 + offset],
      [145, 185],
    ],
    'i': [
      [-10, 20],
      [-20, -40],
      [30, 0],
    ],
    'o': [
      [40, -30],
      [0, 50],
      [-40, 0],
    ],
    'c': true,
  };
  final json = scene([
    {'ty': 'sh', 'ks': animated(shape(0), shape(25))},
    stroked ? stroke() : fill([.2, .7, .9]),
    if (trimmed) trim(constant(10), constant(80), constant(0)),
  ]);
  final transform = json['layers'][0]['ks'];
  transform['s'] = constant([110, 70]);
  transform['r'] = animated(-10, 20);
  transform['sk'] = constant(12);
  return json;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('fused animated fill stays within antialias tolerance across transforms and reverse seeks', () {
    for (final native in [false, true]) {
      final composition = FastLottieComposition.fromJson(morphFill());
      final fused = FastLottieSoftwareSession(
        composition,
        pixelWidth: 127,
        pixelHeight: 105,
        fuseFillTransforms: true,
        preferNative: native,
      );
      final baseline = FastLottieSoftwareSession(
        composition,
        pixelWidth: 127,
        pixelHeight: 105,
        preferNative: native,
        fuseFillTransforms: false,
      );
      try {
        for (final frame in [0.0, 12.5, 59.0, 31.0, 0.0]) {
          final a = Uint8List.sublistView(fused.renderFrame(frame));
          final b = Uint8List.sublistView(baseline.renderFrame(frame));
          var sum = 0;
          for (var i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]).abs();
          }
          expect(sum / a.length, lessThan(.5));
          expect(a.any((v) => v != 0), isTrue);
        }
        expect(fused.fusedFillDraws, greaterThan(0));
      } finally {
        fused.dispose();
        baseline.dispose();
      }
    }
  });
  test('stroke and trim bypass fused fill with exact pixels', () {
    for (final json in [morphFill(stroked: true), morphFill(trimmed: true)]) {
      final composition = FastLottieComposition.fromJson(json);
      final fused = FastLottieSoftwareSession(
        composition,
        pixelWidth: 128,
        pixelHeight: 128,
        fuseFillTransforms: true,
      );
      final baseline = FastLottieSoftwareSession(
        composition,
        pixelWidth: 128,
        pixelHeight: 128,
        fuseFillTransforms: false,
      );
      try {
        for (final frame in [0.0, 25.0, 59.0]) {
          expect(
            fused.renderFrame(frame),
            orderedEquals(baseline.renderFrame(frame)),
          );
        }
        expect(fused.fusedFillDraws, 0);
      } finally {
        fused.dispose();
        baseline.dispose();
      }
    }
  });
}
