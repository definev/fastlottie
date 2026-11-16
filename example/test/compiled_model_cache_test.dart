import 'dart:convert';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/decoder.dart';
import 'package:fastlottie_example/tgs/network_store.dart';
import 'package:flutter_test/flutter_test.dart';

Uint8List _source(int width) => Uint8List.fromList(
  utf8.encode(
    jsonEncode({
      'w': width,
      'h': 16,
      'fr': 30,
      'ip': 0,
      'op': 60,
      'layers': [],
    }),
  ),
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const url = 'http://example.test/a.tgs';
  test(
    'restores after model eviction and invalidates on changed source',
    () async {
      var source = _source(16);
      final store = NetworkTgsStore(
        framePaced: false,
        maximumEntries: 0,
        maximumCompiledBytes: 4096,
        fetcher: (uri, {cancelToken, sourceCacheDirectory}) async =>
            FastLottieNetworkFetchResult(source, fromDiskCache: true),
      );
      addTearDown(store.dispose);
      Future<FastLottieComposition> load() async {
        final lease = store.acquire(url);
        try {
          return (await lease.future).fast!;
        } finally {
          lease.release();
        }
      }

      final a = await load();
      expect(store.cached, 0);
      expect(store.compiledBytes, inInclusiveRange(1, 4096));
      final b = await load();
      expect(store.snapshotHits, 1);
      expect(store.snapshotEncodes, 1);
      expect(identical(a, b), isFalse);
      expect(a.contentKey, b.contentKey);
      source = _source(21);
      expect((await load()).width, 21);
      expect(store.snapshotHits, 1);
      expect(store.snapshotEncodes, 2);
      store.evictCompiledSnapshots();
      expect(store.compiledBytes, 0);
      expect((await load()).contentKey, isNot(a.contentKey));
      expect(store.snapshotHits, 1);
      expect(store.snapshotEncodes, 3);
      await store.clearMemoryAndUrlDiskCache();
      expect(store.compiledBytes, 0);
      await load();
      expect(store.snapshotHits, 1);
    },
  );

  test(
    'an invalid snapshot falls back to source and replaces the blob',
    () async {
      final source = _source(19);
      final invalid = Uint8List(4);
      final results = await decodeTgsSnapshotBatch([(source, false, invalid)]);
      expect(results.single.model!.fast!.width, 19);
      expect(results.single.snapshotHit, isFalse);
      final replacement = results.single.compiledSnapshot;
      expect(replacement, isNotNull);
      final restored = await decodeTgsSnapshotBatch([
        (source, false, replacement),
      ]);
      expect(restored.single.snapshotHit, isTrue);
      expect(
        restored.single.model!.fast!.contentKey,
        results.single.model!.fast!.contentKey,
      );
    },
  );

  test('budget evicts snapshots without blocking normal decode', () async {
    final encoded = await decodeTgsSnapshotBatch([(_source(16), false, null)]);
    final one = encoded.single.compiledSnapshot!.length + _source(16).length;
    final store = NetworkTgsStore(
      framePaced: false,
      maximumEntries: 0,
      maximumCompiledBytes: one,
      fetcher: (uri, {cancelToken, sourceCacheDirectory}) async =>
          FastLottieNetworkFetchResult(_source(16), fromDiskCache: false),
    );
    addTearDown(store.dispose);
    for (final key in [url, 'http://example.test/b.tgs', url]) {
      final lease = store.acquire(key);
      expect((await lease.future).fast!.width, 16);
      lease.release();
      expect(store.compiledBytes, one);
    }
    expect(store.snapshotHits, 0);
    expect(store.snapshotEvictions, 2);
  });

  test(
    'memory pressure prevents an in-flight decode from retaining a blob',
    () async {
      final store = NetworkTgsStore(
        framePaced: false,
        maximumEntries: 0,
        maximumCompiledBytes: 4096,
        fetcher: (uri, {cancelToken, sourceCacheDirectory}) async =>
            FastLottieNetworkFetchResult(_source(16), fromDiskCache: false),
      );
      addTearDown(store.dispose);
      final lease = store.acquire(url);
      while (store.runningDecodes == 0) {
        await Future<void>.delayed(Duration.zero);
      }
      store.evictCompiledSnapshots();
      expect((await lease.future).fast!.width, 16);
      lease.release();
      expect(store.snapshotEncodes, 1);
      expect(store.compiledBytes, 0);
      final next = store.acquire(url);
      await next.future;
      next.release();
      expect(store.snapshotHits, 0);
      expect(store.compiledBytes, inInclusiveRange(1, 4096));
    },
  );
}
