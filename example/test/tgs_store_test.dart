import 'dart:async';
import 'dart:io';
import 'dart:convert';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/store.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

class MemoryBundle extends CachingAssetBundle {
  final reads = <String>[];
  @override
  Future<ByteData> load(String key) async {
    reads.add(key);
    return ByteData(1);
  }
}

TgsModel model() => TgsModel(
  fast: FastLottieComposition.fromJson({
    'w': 16,
    'h': 16,
    'fr': 30,
    'ip': 0,
    'op': 60,
    'layers': [],
  }),
  sourceBytes: 10,
  inflateUs: 0,
  parseUs: 0,
);

void main() {
  testWidgets('worker batches advance ahead of bounded UI publications', (
    tester,
  ) async {
    final batches = <int>[];
    final store = TgsStore(
      bundle: MemoryBundle(),
      concurrency: 1,
      framePaced: true,
      batchDecoder: (requests) async {
        batches.add(requests.length);
        return [for (final _ in requests) TgsDecodeResult.success(model())];
      },
    );
    final leases = [for (var i = 0; i < 8; i++) store.acquire('$i')];
    await tester.idle();
    expect(batches, [2, 2]);
    expect(store.running, 0);
    expect(store.decodes, 4);
    expect(store.pendingPublications, 4);
    expect(store.queued, 4);
    expect(leases.every((l) => l.ready == null), isTrue);
    await tester.pump();
    expect(store.cached, 1);
    expect(batches, [2, 2]);
    expect(store.pendingPublications, 3);
    await tester.pump();
    expect(store.cached, 2);
    expect(batches, [2, 2, 2]);
    expect(store.pendingPublications, 4);
    for (var i = 0; i < 8; i++) {
      await tester.pump();
    }
    expect(leases.every((l) => l.ready != null), isTrue);
    expect(store.decodes, 8);
    expect(store.pendingPublications, 0);
    expect(batches, [2, 2, 2, 2]);
    for (final lease in leases) {
      lease.release();
    }
    store.dispose();
  });
  testWidgets('offscreen decoded models do not wait for a display frame', (
    tester,
  ) async {
    final store = TgsStore(
      bundle: MemoryBundle(),
      decoder: (_, _) async => model(),
      framePaced: true,
    );
    final a = store.acquire('a'), b = store.acquire('b');
    await tester.idle();
    expect(store.pendingPublications, 2);
    a.release();
    await tester.idle();
    expect(a.ready, isNotNull);
    expect(b.ready, isNull);
    expect(store.pendingPublications, 1);
    await tester.pump();
    expect(b.ready, isNotNull);
    b.release();
    store.dispose();
  });
  test(
    'a bad file does not discard other models in the same native batch',
    () async {
      final bytes = File('assets/icon.json').readAsBytesSync();
      final results = await decodeTgsBatch([
        (bytes, false),
        (Uint8List.fromList([0]), false),
        (bytes, true),
      ]);
      expect(results[0].model!.fast!.debugHasPreparedScene, isTrue);
      expect(results[0].error, isNull);
      expect(results[1].model, isNull);
      expect(results[1].error, isA<FormatException>());
      expect(results[2].model!.reference, isNotNull);
      expect(results[2].error, isNull);
    },
  );
  test(
    'failed decoder batches release slots so later jobs can complete',
    () async {
      var calls = 0;
      final store = TgsStore(
        bundle: MemoryBundle(),
        concurrency: 1,
        batchDecoder: (requests) async {
          if (calls++ == 0) throw StateError('worker failed');
          return [for (final _ in requests) TgsDecodeResult.success(model())];
        },
      );
      final a = store.acquire('a'),
          b = store.acquire('b'),
          c = store.acquire('c');
      await Future.wait([
        expectLater(a.future, throwsA(isA<StateError>())),
        expectLater(b.future, throwsA(isA<StateError>())),
      ]);
      expect(await c.future, isA<TgsModel>());
      expect(store.running, 0);
      expect(store.cached, 1);
      for (final lease in [a, b, c]) {
        lease.release();
      }
      store.dispose();
    },
  );
  testWidgets('disposing a frame-paced store releases publication waiters', (
    tester,
  ) async {
    final store = TgsStore(
      bundle: MemoryBundle(),
      decoder: (_, _) async => model(),
      framePaced: true,
    );
    final lease = store.acquire('a');
    final cancelled = expectLater(
      lease.future,
      throwsA(isA<TgsLoadCancelled>()),
    );
    await tester.idle();
    store.dispose();
    await tester.idle();
    await cancelled;
    expect(store.running, 0);
    lease.release();
    await tester.pump();
    expect(tester.takeException(), isNull);
  });
  testWidgets(
    'cold model publication is limited to one result per Flutter frame',
    (tester) async {
      final store = TgsStore(
        bundle: MemoryBundle(),
        decoder: (_, _) async => model(),
        framePaced: true,
        concurrency: 2,
      );
      final a = store.acquire('a'), b = store.acquire('b');
      await tester.idle();
      expect(a.ready, isNull);
      expect(b.ready, isNull);
      await tester.pump();
      expect([a.ready, b.ready].where((v) => v != null).length, 1);
      await tester.pump();
      expect(a.ready, isNotNull);
      expect(b.ready, isNotNull);
      a.release();
      b.release();
      store.dispose();
    },
  );
  test('fastlottie parse failures never switch to baseline', () {
    final j = jsonDecode(File('assets/icon.json').readAsStringSync());
    j['layers'][0]['ks']['o']['x'] = 'unsupportedScript()';
    final data = Uint8List.fromList(utf8.encode(jsonEncode(j)));
    expect(
      () => parseTgs((data, false)),
      throwsA(isA<UnsupportedLottieException>()),
    );
    expect(parseTgs((data, true)).reference, isNotNull);
  });
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'deduplicates leases, cancels queued work and reuses cached models',
    () async {
      final bundle = MemoryBundle();
      final jobs = <Completer<TgsModel>>[];
      final store = TgsStore(
        bundle: bundle,
        concurrency: 1,
        decoder: (bytes, reference) {
          final job = Completer<TgsModel>();
          jobs.add(job);
          return job.future;
        },
      );
      final a = store.acquire('a'),
          duplicate = store.acquire('a'),
          b = store.acquire('b');
      await Future<void>.delayed(Duration.zero);
      expect(jobs.length, 1);
      expect(store.running, 1);
      expect(store.queued, 1);
      expect(store.coalesced, 1);
      expect(bundle.reads, ['a']);
      b.release();
      await expectLater(b.future, throwsA(isA<TgsLoadCancelled>()));
      final parsed = model();
      jobs.single.complete(parsed);
      expect(await a.future, same(parsed));
      expect(await duplicate.future, same(parsed));
      a.release();
      duplicate.release();
      final hit = store.acquire('a');
      expect(hit.ready, same(parsed));
      expect(store.hits, 1);
      expect(store.decodes, 1);
      expect(store.queued, 0);
      hit.release();
      store.dispose();
    },
  );
  test('LRU limits respect pinned leases and renderer cache keys', () async {
    final store = TgsStore(
      bundle: MemoryBundle(),
      maximumEntries: 1,
      maximumSourceBytes: 15,
      decoder: (_, _) async => model(),
    );
    final a = store.acquire('a');
    await a.future;
    final b = store.acquire('b');
    await b.future;
    expect(store.cached, 2); // Both are still visible/pinned.
    a.release();
    expect(store.cached, 1);
    expect(store.sourceBytes, 10);
    b.release();
    final again = store.acquire('a');
    await again.future;
    again.release();
    expect(store.decodes, 3);
    expect(store.cached, 1);
    final baseline = store.acquire('a', reference: true);
    await baseline.future;
    expect(store.decodes, 4);
    baseline.release();
    store.dispose();
  });
  test(
    'dispose cancels pending leases without starting queued decodes',
    () async {
      final job = Completer<TgsModel>();
      var calls = 0;
      final store = TgsStore(
        bundle: MemoryBundle(),
        concurrency: 1,
        decoder: (_, _) {
          calls++;
          return job.future;
        },
      );
      final a = store.acquire('a'), b = store.acquire('b');
      await Future<void>.delayed(Duration.zero);
      store.dispose();
      await expectLater(a.future, throwsA(isA<TgsLoadCancelled>()));
      await expectLater(b.future, throwsA(isA<TgsLoadCancelled>()));
      expect(calls, 1);
      job.complete(model());
      await Future<void>.delayed(Duration.zero);
      expect(store.running, 0);
      a.release();
      b.release();
    },
  );
  test('every bundled TGS transfers from a worker and renders with its labelled backend', () async {
    final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
    final files = manifest
        .listAssets()
        .where(
          (path) => path.startsWith('assets/tgs/') && path.endsWith('.tgs'),
        )
        .map(File.new)
        .toList();
    expect(files.length, 1063);
    var native = 0, unsupported = 0;
    for (final file in files) {
      final TgsModel parsed;
      try {
        parsed = await decodeTgs(file.readAsBytesSync(), false);
      } on UnsupportedLottieException {
        unsupported++;
        continue;
      }
      final recorder = ui.PictureRecorder();
      final canvas = ui.Canvas(recorder);
      native++;
      final player = FastLottiePlayer(parsed.fast!);
      player.draw(canvas, const ui.Rect.fromLTWH(0, 0, 64, 64), .3);
      player.dispose();
      final picture = recorder.endRecording();
      final image = await picture.toImage(64, 64);
      image.dispose();
      picture.dispose();
    }
    expect(native, 775);
    expect(unsupported, 288);
  });
  test(
    'priority acquire jumps ahead of normal queue and promotes coalesced entries',
    () async {
      final order = <String>[];
      final bundle = MemoryBundle();
      final gates = <Completer<TgsModel>>[];
      final store = TgsStore(
        bundle: bundle,
        concurrency: 1,
        batchSize: 1,
        decoder: (bytes, reference) {
          final completer = Completer<TgsModel>();
          gates.add(completer);
          return completer.future;
        },
      );
      final a = store.acquire('a');
      await Future<void>.delayed(Duration.zero);
      // Fill the active slot and queue several normal items + a queued item to promote.
      final b = store.acquire('b');
      final c = store.acquire('c');
      final d = store.acquire('d', priority: true);
      final promoteC = store.acquire('c', priority: true);
      expect(bundle.reads, ['a']);
      expect(store.queued, 3);

      void track(TgsLease lease, String label) {
        lease.future.then((_) => order.add(label));
      }

      track(a, 'a');
      track(b, 'b');
      track(c, 'c');
      track(d, 'd');

      // Complete running batch repeatedly and record decode dequeue order via reads.
      for (var step = 0; step < 4; step++) {
        await Future<void>.delayed(Duration.zero);
        gates[step].complete(model());
        await Future<void>.delayed(Duration.zero);
      }

      // Promoting `c` after `d` puts `c` at front, followed by `d`, then FIFO `b`.
      expect(bundle.reads, ['a', 'c', 'd', 'b']);
      expect(order, ['a', 'c', 'd', 'b']);

      for (final lease in [a, b, c, d, promoteC]) {
        lease.release();
      }
      store.dispose();
    },
  );
}
