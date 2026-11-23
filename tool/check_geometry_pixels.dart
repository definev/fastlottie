// Record the scalar implementation, then compare the candidate byte for byte:
// flutter test tool/check_geometry_pixels.dart --dart-define=GEOMETRY_PIXELS=record
// flutter test tool/check_geometry_pixels.dart --dart-define=FASTLOTTIE_NATIVE_BEZIER=true
// Add --dart-define=GEOMETRY_BORROW_COVERAGE=true to check the combined path.
// Add --dart-define=FASTLOTTIE_NATIVE_STROKE=true to check stroke expansion.
// ignore_for_file: avoid_print, invalid_use_of_visible_for_testing_member
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/platform/geometry_kernel_io.dart' as geometry;
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('exact software pixels across the accepted bundled corpus', () {
    const record = String.fromEnvironment('GEOMETRY_PIXELS') == 'record';
    const borrowCoverage = bool.fromEnvironment('GEOMETRY_BORROW_COVERAGE');
    const restoreSnapshot = bool.fromEnvironment('GEOMETRY_SNAPSHOT');
    const nativeStroke = bool.fromEnvironment('FASTLOTTIE_NATIVE_STROKE');
    if (record) {
      expect(borrowCoverage, isFalse, reason: 'Record the scalar control');
      expect(const bool.fromEnvironment('FASTLOTTIE_NATIVE_BEZIER'), isFalse);
      expect(restoreSnapshot, isFalse);
      expect(nativeStroke, isFalse);
    }
    final directory = Directory('build/geometry-scalar-pixels')
      ..createSync(recursive: true);
    final paths =
        Directory('example/assets/tgs')
            .listSync(recursive: true)
            .whereType<File>()
            .where((f) => f.path.endsWith('.tgs'))
            .toList()
          ..sort((a, b) => a.path.compareTo(b.path));
    var accepted = 0, rejected = 0, borrowedDraws = 0, copiedDraws = 0;
    for (var index = 0; index < paths.length; index++) {
      final file = paths[index];
      FastLottieComposition composition;
      try {
        composition = FastLottieComposition.fromBytes(file.readAsBytesSync());
      } on UnsupportedLottieException {
        rejected++;
        continue;
      }
      if (restoreSnapshot) {
        final expectedKey = composition.contentKey;
        final blob = debugEncodeCompiledComposition(composition);
        composition = debugDecodeCompiledComposition(blob).composition;
        expect(
          debugForkRasterScene(composition).contentKey,
          expectedKey,
          reason: file.path,
        );
      }
      final output = BytesBuilder(copy: false);
      final session = FastLottieSoftwareSession(
        composition,
        pixelWidth: 112,
        pixelHeight: 112,
        borrowGeometry: borrowCoverage,
        nativeStroke: nativeStroke,
      );
      try {
        for (final progress in [0.0, .6, .25, .9, 0.0]) {
          final frame =
              composition.startFrame +
              (composition.endFrame - composition.startFrame - 1) * progress;
          session.renderFrame(frame);
          output.add(Uint8List.fromList(Uint8List.sublistView(session.pixels)));
        }
      } finally {
        borrowedDraws += session.borrowedCoverageDraws;
        copiedDraws += session.copiedCoverageDraws;
        session.dispose();
      }
      final snapshot = File('${directory.path}/$index.bgra.gz');
      final pixels = output.takeBytes();
      if (record) {
        snapshot.writeAsBytesSync(gzip.encode(pixels));
      } else {
        final expected = gzip.decode(snapshot.readAsBytesSync());
        if (pixels.length != expected.length) {
          fail('Length changed: ${file.path}');
        }
        for (var i = 0; i < pixels.length; i++) {
          if (pixels[i] != expected[i]) {
            fail('${file.path} pixel byte $i: ${pixels[i]} != ${expected[i]}');
          }
        }
      }
      accepted++;
    }
    print(
      'GEOMETRY_PIXELS $accepted accepted, $rejected rejected, '
      '${accepted * 5} frames ${record ? "recorded" : "identical"}',
    );
    expect(accepted, 1084);
    expect(rejected, 3);
    if (const bool.fromEnvironment('FASTLOTTIE_NATIVE_BEZIER')) {
      print(
        'Native Bezier calls: ${geometry.nativeBezierCalls}; '
        'fallbacks: ${geometry.nativeBezierFallbacks}',
      );
      expect(geometry.nativeBezierCalls, greaterThan(0));
    }
    if (nativeStroke) {
      print('Native stroke calls: ${geometry.nativeStrokeCalls}');
      expect(geometry.nativeStrokeCalls, greaterThan(0));
    }
    if (borrowCoverage) {
      print('Coverage: $borrowedDraws borrowed; $copiedDraws copied');
      expect(borrowedDraws, greaterThan(0));
      expect(
        copiedDraws,
        greaterThan(0),
        reason: 'Large draws use the fallback',
      );
    }
  }, timeout: const Timeout(Duration(minutes: 5)));
}
