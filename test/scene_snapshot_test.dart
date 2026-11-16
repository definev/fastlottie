import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/raster_core.dart' show RasterWorkspace;
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('unused snapshot scenes stay lazy across cache release and forks', () {
    final original = FastLottieComposition.fromJson(fixture('morph'));
    final blob = debugEncodeCompiledComposition(original);
    final restored = debugDecodeCompiledComposition(
      blob,
      deferPlayback: true,
    ).composition;
    final first = debugTakePreparedRasterScene(restored)!;
    final second = debugForkRasterScene(restored);
    final workspace = RasterWorkspace();
    try {
      expect(first.debugHasPlaybackState, isFalse);
      expect(second.debugHasPlaybackState, isFalse);
      workspace.releaseScene(first);
      expect(first.debugHasPlaybackState, isFalse);
      final session = FastLottieSoftwareSession(
        restored,
        pixelWidth: 96,
        pixelHeight: 96,
        usePreparedScene: true,
      );
      try {
        session.renderFrame(28.5);
        expect(first.debugHasPlaybackState, isFalse);
        expect(second.debugHasPlaybackState, isFalse);
      } finally {
        session.dispose();
      }
    } finally {
      workspace.dispose();
    }
  });
  test('deferred metadata rejects incompatible and truncated snapshots', () {
    final original = FastLottieComposition.fromJson(fixture('morph'));
    final blob = debugEncodeCompiledComposition(original);
    final header = ByteData.sublistView(blob);
    final metadataOffset = 24 + header.getUint32(20, Endian.little);
    for (final corrupt in [
      Uint8List.fromList(blob.sublist(0, metadataOffset)),
      Uint8List.fromList(blob)..[4] = 1,
      Uint8List.fromList(blob.sublist(0, blob.length - 1)),
      (() {
        final copy = Uint8List.fromList(blob);
        ByteData.sublistView(copy)
            .setFloat64(metadataOffset, double.nan, Endian.little);
        return copy;
      })(),
    ]) {
      expect(
        () => debugDecodeCompiledComposition(corrupt, deferPlayback: true),
        throwsFormatException,
      );
    }
  });
  test(
    'restored first scene stays independent of later players and workers',
    () {
      for (final (name, deferred) in [
        for (final name in ['icon', 'features', 'many_shapes', 'morph'])
          for (final deferred in [false, true]) (name, deferred),
      ]) {
        final original = FastLottieComposition.fromJson(fixture(name));
        final blob = debugEncodeCompiledComposition(original);
        final restored = debugDecodeCompiledComposition(
          blob,
          directPlayback: true,
          deferPlayback: deferred,
        ).composition;
        expect(restored.debugHasPreparedScene, isTrue);
        final first = FastLottieSoftwareSession(
          restored,
          pixelWidth: 96,
          pixelHeight: 96,
          usePreparedScene: true,
        );
        expect(restored.debugHasPreparedScene, isFalse);
        final second = FastLottieSoftwareSession(
          restored,
          pixelWidth: 96,
          pixelHeight: 96,
          usePreparedScene: true,
        );
        final reference = FastLottieSoftwareSession(
          original,
          pixelWidth: 96,
          pixelHeight: 96,
        );
        try {
          for (final (a, b) in [
            (0.0, 59.0),
            (28.5, 14.0),
            (59.0, 0.0),
            (0.0, 28.5),
          ]) {
            final expected = Uint32List.fromList(reference.renderFrame(a));
            expect(first.renderFrame(a), expected);
            second.renderFrame(b);
            expect(first.renderFrame(a), expected);
            expect(second.renderFrame(a), expected);
          }
          expect(debugEncodeCompiledComposition(restored), blob);
          expect(
            debugForkRasterScene(restored).contentKey,
            original.contentKey,
          );
          restored.prepareForPlayback();
          expect(restored.debugHasPreparedScene, isTrue);
          final third = FastLottieSoftwareSession(
            restored,
            pixelWidth: 96,
            pixelHeight: 96,
            usePreparedScene: true,
          );
          try {
            expect(third.renderFrame(28.5), reference.renderFrame(28.5));
          } finally {
            third.dispose();
          }
        } finally {
          first.dispose();
          second.dispose();
          reference.dispose();
        }
      }
    },
  );
  test(
    'compiled snapshot preserves keys, samples, options and player state',
    () {
      for (final simd in [false, true]) {
        for (final name in [
          'static',
          'icon',
          'features',
          'many_shapes',
          'morph',
        ]) {
          final composition = FastLottieComposition.fromJson(
            fixture(name),
            options: FastLottieOptions(useSimd: simd),
          )..prepareForPlayback();
          final snapshot = debugEncodeCompiledComposition(
            composition,
            sourceBytes: 12345,
          );
          final restored = debugDecodeCompiledComposition(snapshot);
          expect(restored.sourceBytes, 12345);
          expect(restored.composition.options.useSimd, simd);
          expect(restored.composition.contentKey, composition.contentKey);
          final a = FastLottieSoftwareSession(
            composition,
            pixelWidth: 112,
            pixelHeight: 112,
          );
          final b = FastLottieSoftwareSession(
            restored.composition,
            pixelWidth: 112,
            pixelHeight: 112,
          );
          try {
            for (final frame in [0.0, 28.5, 59.0, 14.0, 0.0]) {
              expect(
                a.renderFrame(frame),
                orderedEquals(b.renderFrame(frame)),
                reason: '$name frame $frame',
              );
            }
            expect(
              debugEncodeCompiledComposition(
                restored.composition,
                sourceBytes: 12345,
              ),
              snapshot,
            );
          } finally {
            a.dispose();
            b.dispose();
          }
        }
      }
    },
  );
  test(
    'snapshot restores independent graphs and rejects incompatible storage',
    () {
      final composition = FastLottieComposition.fromJson(fixture('morph'));
      final snapshot = debugEncodeCompiledComposition(composition);
      final a = debugDecodeCompiledComposition(snapshot).composition
        ..prepareForPlayback();
      final b = debugDecodeCompiledComposition(snapshot).composition
        ..prepareForPlayback();
      final first = FastLottieSoftwareSession(
        a,
        pixelWidth: 96,
        pixelHeight: 96,
      );
      final second = FastLottieSoftwareSession(
        b,
        pixelWidth: 96,
        pixelHeight: 96,
      );
      try {
        final pixels = Uint32List.fromList(first.renderFrame(28.5));
        second.renderFrame(59);
        expect(first.renderFrame(28.5), pixels);
        expect(second.renderFrame(28.5), pixels);
      } finally {
        first.dispose();
        second.dispose();
      }
      for (final size in [0, 12, snapshot.length - 1]) {
        expect(
          () => debugDecodeCompiledComposition(
            Uint8List.fromList(snapshot.sublist(0, size)),
          ),
          throwsFormatException,
        );
      }
      final wrong = Uint8List.fromList(snapshot)..[4] = 12;
      expect(
        () => debugDecodeCompiledComposition(wrong),
        throwsFormatException,
      );
    },
  );
}
