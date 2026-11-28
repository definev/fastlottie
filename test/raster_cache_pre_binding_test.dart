import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fastlottie_test.dart' show fixture;

void main() {
  test('FastLottieRasterCache can be constructed and disposed before Flutter binding initialization', () {
    final cache = FastLottieRasterCache(workerCount: 1);
    expect(cache.entries, 0);
    expect(cache.bytes, 0);
    cache.dispose();
  });

  test('FastLottieRasterCache created before binding init lazily registers lifecycle observer once used', () async {
    // Create cache while binding is still uninitialized (e.g. before runApp()).
    final cache = FastLottieRasterCache(
      framesPerStrip: 1,
      maximumBytes: 16 * 1024 * 1024,
      disposalBatchSize: 1,
      workerCount: 1,
    );
    addTearDown(cache.dispose);

    // Now initialize Flutter binding as runApp() does.
    final binding = TestWidgetsFlutterBinding.ensureInitialized();

    final comps = List.generate(5, (i) {
      final json = fixture('static');
      json['layers'][0]['shapes'][0]['it'][0]['p'] = {
        'a': 0,
        'k': [10 + i * 5, 10],
      };
      return FastLottieComposition.fromJson(json);
    });

    final players = <FastLottiePlayer>[];
    for (var i = 0; i < 4; i++) {
      final player = FastLottiePlayer(comps[i], rasterCache: cache);
      players.add(player);
      final rec = ui.PictureRecorder();
      player.draw(ui.Canvas(rec), const ui.Rect.fromLTWH(0, 0, 1024, 1024), 0);
      rec.endRecording().dispose();
    }

    final deadline = DateTime.now().add(const Duration(seconds: 10));
    while (cache.pendingFrames > 0 && DateTime.now().isBefore(deadline)) {
      await Future<void>.delayed(const Duration(milliseconds: 10));
    }
    expect(cache.pendingFrames, 0);
    for (final p in players) {
      p.dispose();
    }

    // Evict one 4 MiB image to enqueue a deferred disposal.
    final extra = FastLottiePlayer(comps[4], rasterCache: cache);
    addTearDown(extra.dispose);
    final rec = ui.PictureRecorder();
    extra.draw(ui.Canvas(rec), const ui.Rect.fromLTWH(0, 0, 1024, 1024), 0);
    rec.endRecording().dispose();
    expect(cache.debugPendingDisposals, greaterThan(0));

    // Lifecycle pause notification must flush disposals, proving the observer
    // was lazily registered once the cache started being used.
    binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
    expect(cache.debugPendingDisposals, 0);
    expect(cache.debugDeadBytes, 0);
  });
}
