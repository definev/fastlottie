import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
// ignore: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';

import 'mobile_benchmark.dart' show cacheStats, cpuTicks, profile;
import 'tgs/cache_dir.dart';
import 'tgs/gallery.dart';
import 'tgs/store.dart';
import 'tgs/telegram_demo.dart';
import 'tgs_benchmark.dart' show stats;

Future<Map<String, dynamic>> profileTimings({
  ScrollController? scroll,
  double scrollDelta = -24,
}) async {
  final done = Completer<Map<String, dynamic>>();
  final build = <double>[],
      raster = <double>[],
      total = <double>[],
      vsync = <int>[];
  final watch = Stopwatch()..start();
  final startCpu = cpuTicks();
  var observed = 0;
  void timings(List<FrameTiming> batch) {
    if (done.isCompleted) return;
    for (final timing in batch) {
      if (observed++ < 30) continue;
      build.add(timing.buildDuration.inMicroseconds.toDouble());
      raster.add(timing.rasterDuration.inMicroseconds.toDouble());
      total.add(timing.totalSpan.inMicroseconds.toDouble());
      vsync.add(timing.timestampInMicroseconds(FramePhase.vsyncStart));
      if (vsync.length == 90) {
        done.complete({
          'samples': 90,
          'warmup_frames': 30,
          'build': stats(build),
          'raster': stats(raster),
          'total': stats(total),
          'submitted_frames_per_second':
              (vsync.length - 1) * 1000000 / (vsync.last - vsync.first),
          'cpu_ticks_including_warmup': startCpu == null
              ? null
              : cpuTicks()! - startCpu,
          'wall_us_including_warmup': watch.elapsedMicroseconds,
        });
        return;
      }
    }
  }

  SchedulerBinding.instance.addTimingsCallback(timings);
  final drag = scroll != null && scroll.hasClients
      ? scroll.position.drag(
          DragStartDetails(globalPosition: Offset.zero),
          () {},
        )
      : null;
  final ticker = Ticker((_) {
    drag?.update(
      DragUpdateDetails(
        globalPosition: Offset.zero,
        delta: Offset(0, scrollDelta),
        primaryDelta: scrollDelta,
      ),
    );
  })..start();
  try {
    return await done.future.timeout(
      const Duration(seconds: 25),
      onTimeout: () => {'timeout': true, 'observed': observed},
    );
  } finally {
    ticker.dispose();
    drag?.cancel();
    SchedulerBinding.instance.removeTimingsCallback(timings);
  }
}

Future<Map<String, dynamic>> benchmark() async {
  await clearExampleDiskCache();
  final assets = await loadTgsCatalog(rootBundle);
  final store = TgsStore();
  final leases = [for (final asset in assets) store.acquire(asset)];
  await Future.wait(leases.map((l) => l.future));
  for (final lease in leases) {
    lease.release();
  }
  final result = <String, dynamic>{
    'schema': 1,
    'release': kReleaseMode,
    'date_utc': DateTime.now().toUtc().toIso8601String(),
  };

  // 1. Direct vector (idle + scrolling)
  {
    final scroll = ScrollController();
    runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: AbsorbPointer(
          child: TgsGallery(
            key: const ValueKey('vector-r2'),
            store: store,
            catalog: Future.value(assets),
            initialWorkload: TgsWorkload.full,
            scrollController: scroll,
          ),
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 100));
    result['vector'] = {
      'idle': await profile(scroll),
      'scrolling': await profile(scroll, scrolling: true),
    };
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    scroll.dispose();
  }

  // 2. Ping-pong tight 2 MiB GPU budget (forces active eviction + LZ4/.flcache reload while scrolling)
  {
    await clearExampleDiskCache();
    final scroll = ScrollController();
    final cache = FastLottieRasterCache.pingPong(
      maximumBytes: 2 * 1024 * 1024,
      maximumFrameRate: 30,
      resolutionScale: 0.5,
      maximumCompressedMemoryBytes: 8 * 1024 * 1024,
      maximumDiskBytes: 32 * 1024 * 1024,
    );
    await attachExampleDiskCache(cache);
    runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: AbsorbPointer(
          child: _EvictionStressGrid(
            assets: assets,
            store: store,
            scroll: scroll,
            rasterCache: cache,
          ),
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 100));
    final coldIdle = await profileTimings(scroll: null);
    await Future<void>.delayed(const Duration(seconds: 6));
    final beforeScroll = cacheStats(cache);
    final scrolling = await profileTimings(scroll: scroll, scrollDelta: -24);
    final afterScroll = cacheStats(cache);
    result['pingpong_tight_2mib'] = {
      'cold_idle': coldIdle,
      'before_scroll': beforeScroll,
      'scrolling': scrolling,
      'after_scroll': afterScroll,
    };
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    cache.dispose();
    scroll.dispose();
  }

  // 2b. Ping-pong software RLE + LZ4 cache under 42 MiB GPU budget
  {
    await clearExampleDiskCache();
    final scroll = ScrollController();
    final cache = FastLottieRasterCache.pingPong(
      maximumBytes: 42 * 1024 * 1024,
      maximumFrameRate: 30,
      resolutionScale: 0.5,
      maximumCompressedMemoryBytes: 8 * 1024 * 1024,
      maximumDiskBytes: 32 * 1024 * 1024,
    );
    await attachExampleDiskCache(cache);
    runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: AbsorbPointer(
          child: _EvictionStressGrid(
            assets: assets,
            store: store,
            scroll: scroll,
            rasterCache: cache,
          ),
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 100));
    final coldIdle = await profileTimings(scroll: null);
    await Future<void>.delayed(const Duration(seconds: 6));
    final beforeScroll = cacheStats(cache);
    final scrolling = await profileTimings(scroll: scroll, scrollDelta: -24);
    final afterScroll = cacheStats(cache);
    result['pingpong_42mib'] = {
      'cold_idle': coldIdle,
      'before_scroll': beforeScroll,
      'scrolling': scrolling,
      'after_scroll': afterScroll,
    };
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
    cache.dispose();
    scroll.dispose();
  }

  // 3. TelegramStickerDemo idle + sticker sent (320px large sticker)
  {
    await clearExampleDiskCache();
    runApp(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: TelegramStickerDemo(
          catalog: Future.value(assets),
          store: store,
        ),
      ),
    );
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 2500));
    result['telegram_demo_idle'] = await profileTimings();
    // Scroll the 5-column picker grid while topic/sheet warm up
    final pickerEl = _findKey(
      WidgetsBinding.instance.rootElement,
      const Key('sticker-picker-grid'),
    );
    final pickerScrollable = _findType<ScrollableState>(pickerEl);
    result['telegram_demo_picker_scroll'] = await profilePositionTimings(
      pickerScrollable?.position,
      scrollDelta: -18,
    );
    // Tap sticker to send a 320px large vector sticker
    final buttonEl = _findKey(
      WidgetsBinding.instance.rootElement,
      const ValueKey('send-sticker-0'),
    );
    final gesture = buttonEl?.widget as GestureDetector?;
    gesture?.onTap?.call();
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 300));
    result['telegram_demo_with_sent_320px'] = await profileTimings();
    runApp(const SizedBox());
    await WidgetsBinding.instance.endOfFrame;
  }

  store.dispose();
  return result;
}

T? _findType<T extends State>(Element? root) {
  if (root == null) return null;
  if (root is StatefulElement && root.state is T) return root.state as T;
  T? match;
  root.visitChildren((child) {
    match ??= _findType<T>(child);
  });
  return match;
}

Future<Map<String, dynamic>> profilePositionTimings(
  ScrollPosition? position, {
  double scrollDelta = -24,
}) async {
  final done = Completer<Map<String, dynamic>>();
  final build = <double>[],
      raster = <double>[],
      total = <double>[],
      vsync = <int>[];
  final watch = Stopwatch()..start();
  final startCpu = cpuTicks();
  var observed = 0;
  void timings(List<FrameTiming> batch) {
    if (done.isCompleted) return;
    for (final timing in batch) {
      if (observed++ < 30) continue;
      build.add(timing.buildDuration.inMicroseconds.toDouble());
      raster.add(timing.rasterDuration.inMicroseconds.toDouble());
      total.add(timing.totalSpan.inMicroseconds.toDouble());
      vsync.add(timing.timestampInMicroseconds(FramePhase.vsyncStart));
      if (vsync.length == 90) {
        done.complete({
          'samples': 90,
          'warmup_frames': 30,
          'build': stats(build),
          'raster': stats(raster),
          'total': stats(total),
          'submitted_frames_per_second':
              (vsync.length - 1) * 1000000 / (vsync.last - vsync.first),
          'cpu_ticks_including_warmup': startCpu == null
              ? null
              : cpuTicks()! - startCpu,
          'wall_us_including_warmup': watch.elapsedMicroseconds,
        });
        return;
      }
    }
  }

  SchedulerBinding.instance.addTimingsCallback(timings);
  final drag = position?.drag(
    DragStartDetails(globalPosition: Offset.zero),
    () {},
  );
  final ticker = Ticker((_) {
    drag?.update(
      DragUpdateDetails(
        globalPosition: Offset.zero,
        delta: Offset(0, scrollDelta),
        primaryDelta: scrollDelta,
      ),
    );
  })..start();
  try {
    return await done.future.timeout(
      const Duration(seconds: 25),
      onTimeout: () => {'timeout': true, 'observed': observed},
    );
  } finally {
    ticker.dispose();
    drag?.cancel();
    SchedulerBinding.instance.removeTimingsCallback(timings);
  }
}

Element? _findKey(Element? root, Key key) {
  if (root == null) return null;
  if (root.widget.key == key) return root;
  Element? match;
  root.visitChildren((child) {
    match ??= _findKey(child, key);
  });
  return match;
}

class _EvictionStressGrid extends StatefulWidget {
  const _EvictionStressGrid({
    required this.assets,
    required this.store,
    required this.scroll,
    required this.rasterCache,
  });
  final List<String> assets;
  final TgsStore store;
  final ScrollController scroll;
  final FastLottieRasterCache rasterCache;
  @override
  State<_EvictionStressGrid> createState() => _EvictionStressGridState();
}

class _EvictionStressGridState extends State<_EvictionStressGrid> {
  final clock = _BenchClock();
  @override
  void dispose() {
    clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: GridView.builder(
        controller: widget.scroll,
        scrollCacheExtent: const ScrollCacheExtent.pixels(0),
        padding: const EdgeInsets.all(8),
        addAutomaticKeepAlives: false,
        addRepaintBoundaries: false,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemBuilder: (context, index) => _Cell(
          asset: widget.assets[index % widget.assets.length],
          store: widget.store,
          clock: clock,
          rasterCache: widget.rasterCache,
        ),
      ),
    ),
  );
}

class _BenchClock extends ChangeNotifier {
  _BenchClock() {
    _ticker = Ticker((elapsed) {
      us = elapsed.inMicroseconds;
      notifyListeners();
    })..start();
  }
  late final Ticker _ticker;
  int us = 0;
  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }
}

class _Cell extends StatefulWidget {
  const _Cell({
    required this.asset,
    required this.store,
    required this.clock,
    required this.rasterCache,
  });
  final String asset;
  final TgsStore store;
  final _BenchClock clock;
  final FastLottieRasterCache rasterCache;
  @override
  State<_Cell> createState() => _CellState();
}

class _CellState extends State<_Cell> {
  late TgsLease lease = widget.store.acquire(widget.asset);
  late Animation<double> progress;
  @override
  void initState() {
    super.initState();
    _initProgress();
  }

  void _initProgress() {
    final c = lease.ready?.fast;
    if (c != null) {
      progress = _ClockProgress(widget.clock, c.endFrame - c.startFrame, c.frameRate);
    } else {
      progress = const AlwaysStoppedAnimation(0);
    }
  }

  @override
  void didUpdateWidget(_Cell old) {
    super.didUpdateWidget(old);
    if (old.asset != widget.asset) {
      lease.release();
      lease = widget.store.acquire(widget.asset);
      _disposeProgress();
      _initProgress();
    }
  }

  void _disposeProgress() {
    if (progress is _ClockProgress) (progress as _ClockProgress).dispose();
  }

  @override
  void dispose() {
    _disposeProgress();
    lease.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = lease.ready?.fast;
    if (c == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.fromLTRB(6, 18, 6, 18),
      child: FastLottie(
        composition: c,
        controller: progress,
        cache: FastLottieCache.none,
        rasterCache: widget.rasterCache,
      ),
    );
  }
}

class _ClockProgress extends Animation<double> with ChangeNotifier {
  _ClockProgress(this.clock, this.frames, this.fps) {
    clock.addListener(_tick);
  }
  final _BenchClock clock;
  final double frames, fps;
  void _tick() => notifyListeners();
  @override
  double get value => ((clock.us / 1000000 * fps) % frames) / frames;
  @override
  AnimationStatus get status => AnimationStatus.forward;
  @override
  void addStatusListener(AnimationStatusListener listener) {}
  @override
  void removeStatusListener(AnimationStatusListener listener) {}
  @override
  void dispose() {
    clock.removeListener(_tick);
    super.dispose();
  }
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Use --release');
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('Preparing round2 benchmark…')),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      final payload = jsonEncode(await benchmark());
      for (var i = 0; i < payload.length; i += 512) {
        // ignore: avoid_print
        print(
          'FASTLOTTIE_CHUNK:${payload.substring(i, math.min(i + 512, payload.length))}',
        );
      }
      // ignore: avoid_print
      print('FASTLOTTIE_DONE');
      exit(0);
    } catch (error, stack) {
      // ignore: avoid_print
      print('FASTLOTTIE_ERROR:$error\n$stack');
      exit(1);
    }
  });
}
