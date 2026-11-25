import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:fastlottie/src/cache/bitstream_cache.dart';
import 'package:fastlottie/src/cache/lz4.dart';
import 'package:fastlottie/src/cache/tile_playback.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  const width = 53, height = 45, totalFrames = 4;

  List<Uint8List> makeFrames({required bool sparse}) {
    final rng = Random(42);
    final base = Uint8List.fromList(
      List.generate(width * height * 4, (_) => rng.nextInt(256)),
    );
    return List.generate(totalFrames, (i) {
      if (!sparse) {
        return Uint8List.fromList(
          List.generate(base.length, (_) => rng.nextInt(256)),
        );
      }
      final result = Uint8List.fromList(base);
      // Both the full top-left tile and a non-square tile at the bottom-right.
      result[i * 4] = i;
      result[result.length - 4] = 100 + i;
      return result;
    });
  }

  void storeFrames(
    BitstreamStore store,
    List<Uint8List> frames, [
    List<int>? indices,
  ]) {
    final scratch = Lz4Scratch();
    for (final i in indices ?? [0, 1, 2, 3]) {
      store.storeFrame(
        entryKey: 'clip',
        width: width,
        height: height,
        totalFrames: totalFrames,
        poster: false,
        frameIndex: i,
        srcBgra: frames[i],
        scratch: scratch,
      );
    }
  }

  bool prepare(BitstreamStore store, [int frame = 0]) =>
      store.preparePlaybackPage(
        entryKey: 'clip',
        width: width,
        height: height,
        totalFrames: totalFrames,
        frameIndex: frame,
      );

  bool read(
    BitstreamStore store,
    int frame,
    Uint8List dst, [
    TilePlaybackCursor? cursor,
  ]) => store.tryReadFrame(
    entryKey: 'clip',
    width: width,
    height: height,
    totalFrames: totalFrames,
    poster: false,
    frameIndex: frame,
    dstBgra: dst,
    cursor: cursor,
  );

  test(
    'warm pages deduplicate and seek exactly with a reused or fresh target',
    () {
      final store = BitstreamStore(maximumRamBytes: 512 * 1024);
      addTearDown(store.dispose);
      final frames = makeFrames(sparse: true);
      storeFrames(store, frames);
      final before = store.ramBytes;
      expect(prepare(store), isTrue);
      expect(store.ramBytes, lessThan(before));

      final cursor = TilePlaybackCursor();
      final backing = Uint8List(frames.first.length + 3)..[0] = 37;
      final dst = Uint8List.sublistView(backing, 1, 1 + frames.first.length);
      for (final f in [0, 1, 3, 3, 2, 0]) {
        expect(read(store, f, dst, cursor), isTrue);
        expect(dst, frames[f]);
      }
      expect(backing[0], 37);
      expect(backing.last, 0);
      final fresh = Uint8List(dst.length);
      expect(read(store, 3, fresh), isTrue);
      expect(fresh, frames[3]);

      store.maximumRamBytes = 0;
      expect(store.ramBytes, 0);
      expect(read(store, 0, dst, cursor), isFalse);
      store.maximumRamBytes = 512 * 1024;
      storeFrames(store, frames);
      expect(read(store, 2, dst), isTrue);
      expect(dst, frames[2]);
    },
  );

  test('sampled playback can promote a page with missing source frames', () {
    final store = BitstreamStore(maximumRamBytes: 512 * 1024);
    addTearDown(store.dispose);
    final frames = makeFrames(sparse: true);
    storeFrames(store, frames, [0, 2]);
    expect(prepare(store, 2), isTrue);

    final cursor = TilePlaybackCursor();
    final dst = Uint8List(frames.first.length);
    expect(read(store, 2, dst, cursor), isTrue);
    expect(dst, frames[2]);
    expect(read(store, 0, dst, cursor), isTrue);
    expect(dst, frames[0]);

    expect(read(store, 1, dst, cursor), isFalse);
    storeFrames(store, frames, [1]);
    expect(read(store, 1, dst, cursor), isTrue);
    expect(dst, frames[1]);
    expect(read(store, 2, dst, cursor), isTrue);
    expect(dst, frames[2]);
  });

  test('dense pages keep their full-frame entries under the shared budget', () {
    final store = BitstreamStore(maximumRamBytes: 512 * 1024);
    addTearDown(store.dispose);
    final frames = makeFrames(sparse: false);
    storeFrames(store, frames);
    final before = store.ramBytes;
    expect(prepare(store), isFalse);
    expect(store.ramBytes, before);
    final dst = Uint8List(frames.first.length);
    expect(read(store, 2, dst), isTrue);
    expect(dst, frames[2]);
    store.evictEntryRam('clip');
    expect(store.ramBytes, 0);
  });

  test('TilePlaybackPage.build handles unaligned scratch views accurately', () {
    final frames = makeFrames(sparse: true);
    final backing = Uint8List(width * height * 4 + 3);
    final unalignedScratch = Uint8List.sublistView(
      backing,
      1,
      1 + width * height * 4,
    );
    expect(unalignedScratch.offsetInBytes & 3, isNot(0));

    final page = TilePlaybackPage.build(
      width: width,
      height: height,
      firstFrame: 0,
      frames: const [0, 1, 2, 3],
      maxBytes: 512 * 1024,
      scratch: unalignedScratch,
      readFrame: (f, dst) {
        dst.setAll(0, frames[f]);
        return true;
      },
    );
    expect(page, isNotNull);

    final out = Uint8List(width * height * 4);
    for (var f = 0; f < totalFrames; f++) {
      page!.read(f, out, null);
      expect(out, frames[f]);
    }
  });

  test('BitstreamStore shares .flcache across poster and animation modes', () {
    final tempDir = Directory.systemTemp.createTempSync('fastlottie_poster_');
    addTearDown(() {
      if (tempDir.existsSync()) tempDir.deleteSync(recursive: true);
    });
    final frames = makeFrames(sparse: false);
    final scratch = Lz4Scratch();
    final key = formatBitstreamEntryKey(
      'shared_key',
      width,
      height,
      totalFrames,
    );

    final store1 = BitstreamStore(diskCacheDirectory: tempDir.path);
    store1.storeFrame(
      entryKey: key,
      width: width,
      height: height,
      totalFrames: totalFrames,
      poster: true,
      frameIndex: 0,
      srcBgra: frames[0],
      scratch: scratch,
    );
    store1.dispose();

    final store2 = BitstreamStore(diskCacheDirectory: tempDir.path);
    addTearDown(store2.dispose);
    final dst = Uint8List(width * height * 4);
    expect(
      store2.tryReadFrame(
        entryKey: key,
        width: width,
        height: height,
        totalFrames: totalFrames,
        poster: false,
        frameIndex: 0,
        dstBgra: dst,
      ),
      isTrue,
    );
    expect(dst, frames[0]);
    expect(store2.recoveredCorruptions, 0);
  });

  test(
    'BitstreamStore retries tile promotion after partial page completes',
    () {
      final store = BitstreamStore(maximumRamBytes: 512 * 1024);
      addTearDown(store.dispose);
      final denseFrames = makeFrames(sparse: false);
      final sparseFrames = makeFrames(sparse: true);
      // Store two incompatible frames first so partial page build returns null,
      // then replace with a complete sparse 4-frame window.
      storeFrames(store, [denseFrames[0], denseFrames[1]], [0, 1]);
      expect(prepare(store, 0), isFalse);

      storeFrames(store, sparseFrames, [0, 1, 2, 3]);
      expect(prepare(store, 0), isTrue);
    },
  );
}
