import 'dart:io';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie_example/tgs/gallery.dart';
import 'package:fastlottie_example/tgs/store.dart';
// ignore: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lottie/lottie.dart';

class GridBundle extends CachingAssetBundle {
  @override
  Future<ByteData> load(String key) async => ByteData(1);
}

TgsStore createStore() {
  final bytes = File('assets/icon.json').readAsBytesSync();
  final fast = FastLottieComposition.fromBytes(bytes);
  final baseline = LottieComposition.parseJsonBytes(bytes);
  return TgsStore(
    bundle: GridBundle(),
    decoder: (_, reference) async => TgsModel(
      fast: reference ? null : fast,
      reference: reference ? baseline : null,
      sourceBytes: bytes.length,
      inflateUs: 0,
      parseUs: 0,
    ),
  );
}

Future<List<String>> catalog() =>
    Future.value(List.generate(94, (i) => 'assets/tgs/Pack/$i.tgs'));
Future<void> ready(WidgetTester tester) async {
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 20));
  await tester.pump();
}

void main() {
  test('only two explicit renderer modes exist', () {
    expect(TgsRenderer.values, [TgsRenderer.fastlottie, TgsRenderer.lottie]);
  });
  testWidgets('raw LoD keeps every animation running during a scroll gesture', (
    tester,
  ) async {
    final store = createStore();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      MaterialApp(
        home: TgsGallery(
          store: store,
          catalog: catalog(),
          initialWorkload: TgsWorkload.lod,
        ),
      ),
    );
    await ready(tester);
    final first = tester.widget<StickerCell>(find.byType(StickerCell).first);
    final gesture = await tester.startGesture(
      tester.getCenter(find.byKey(const ValueKey('tgs-grid'))),
    );
    await gesture.moveBy(const Offset(0, -60));
    await tester.pump();
    final before = first.clock.microseconds;
    await tester.pump(const Duration(milliseconds: 100));
    expect(first.clock.microseconds, greaterThan(before));
    expect(first.rasterCache!.enabled, isTrue);
    expect(
      tester
          .widgetList<StickerCell>(find.byType(StickerCell))
          .every((c) => c.animate),
      isTrue,
    );
    await gesture.up();
    await tester.pumpWidget(const SizedBox());
  });
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'catalog contains all bundled TGS files interleaved across packs',
    () async {
      final assets = await loadTgsCatalog(rootBundle);
      expect(assets.length, 94);
      expect(assets.toSet().length, 94);
      expect(assets.take(4).map((p) => p.split('/')[2]).toSet().length, 4);
    },
  );
  testWidgets(
    '4 columns build lazily beyond the catalog and reuse parsed models on return',
    (tester) async {
      tester.view.physicalSize = const Size(400, 700);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final store = createStore();
      addTearDown(store.dispose);
      await tester.pumpWidget(
        MaterialApp(
          home: TgsGallery(store: store, catalog: catalog()),
        ),
      );
      await ready(tester);
      final grid = tester.widget<GridView>(
        find.byKey(const ValueKey('tgs-grid')),
      );
      expect(
        (grid.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount)
            .crossAxisCount,
        4,
      );
      expect(
        (grid.childrenDelegate as SliverChildBuilderDelegate).childCount,
        isNull,
      );
      expect(find.byType(StickerCell).evaluate().length, lessThanOrEqualTo(32));
      expect(store.decodes, lessThan(94));
      final firstCell = tester.widget<StickerCell>(
        find.byType(StickerCell).first,
      );
      expect(firstCell.rasterCache, isNotNull);
      expect(
        firstCell.rasterCache!.strategy,
        FastLottieRasterStrategy.miniStrip,
      );
      expect(firstCell.rasterCache!.resolutionScale, tgsLodScale);
      final clock = firstCell.clock;
      final scroll = tester.state<ScrollableState>(
        find.descendant(
          of: find.byKey(const ValueKey('tgs-grid')),
          matching: find.byType(Scrollable),
        ),
      );
      scroll.position.jumpTo(20000);
      await ready(tester);
      expect(
        tester.widget<StickerCell>(find.byType(StickerCell).first).index,
        greaterThan(94),
      );
      expect(find.byType(StickerCell).evaluate().length, lessThanOrEqualTo(32));
      scroll.position.jumpTo(0);
      await ready(tester);
      expect(store.hits, greaterThan(0));
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
      await tester.pump();
      expect(clock.hasConsumers, isFalse);
      expect(store.queued, 0);
    },
  );
  testWidgets('strategy switch recreates rasterCache between miniStrip and pingPong cleanly', (
    tester,
  ) async {
    final store = createStore();
    addTearDown(store.dispose);
    final createdCaches = <FastLottieRasterCache>[];
    await tester.pumpWidget(
      MaterialApp(
        home: TgsGallery(
          store: store,
          catalog: catalog(),
          onRasterCacheCreated: createdCaches.add,
        ),
      ),
    );
    await ready(tester);
    expect(createdCaches.single.strategy, FastLottieRasterStrategy.miniStrip);
    final dropdown = tester.widget<DropdownButton<FastLottieRasterStrategy>>(
      find.byKey(const ValueKey('gallery-strategy-dropdown')),
    );
    dropdown.onChanged!(FastLottieRasterStrategy.pingPong);
    await ready(tester);
    expect(createdCaches.length, 2);
    expect(createdCaches.last.strategy, FastLottieRasterStrategy.pingPong);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });
  testWidgets('renderer switch replaces the actual backend', (tester) async {
    final store = createStore();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      MaterialApp(
        home: TgsGallery(store: store, catalog: catalog()),
      ),
    );
    await ready(tester);
    expect(find.byType(FastLottie), findsWidgets);
    final dropdown = tester.widget<DropdownButton<TgsRenderer>>(
      find.byType(DropdownButton<TgsRenderer>),
    );
    dropdown.onChanged!(TgsRenderer.lottie);
    await ready(tester);
    expect(find.byType(FastLottie), findsNothing);
    expect(find.byType(Lottie), findsWidgets);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });
  testWidgets('reduced motion keeps loaded stickers still', (tester) async {
    final store = createStore();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      MaterialApp(
        builder: (context, child) => MediaQuery(
          data: MediaQuery.of(context).copyWith(disableAnimations: true),
          child: child!,
        ),
        home: TgsGallery(store: store, catalog: catalog()),
      ),
    );
    await ready(tester);
    expect(tester.hasRunningAnimations, isFalse);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets(
    'mobile limits active cells, preserves stress mode and suspends in background',
    (tester) async {
      final store = createStore();
      addTearDown(store.dispose);
      await tester.pumpWidget(
        MaterialApp(
          home: TgsGallery(
            store: store,
            catalog: catalog(),
            initialWorkload: TgsWorkload.mobile,
          ),
        ),
      );
      await ready(tester);
      List<StickerCell> cells() =>
          tester.widgetList<StickerCell>(find.byType(StickerCell)).toList();
      expect(cells().where((c) => c.animate).length, 8);
      final clock = cells().first.clock;
      final cache = cells().first.rasterCache!;
      expect(cache.maximumFrameRate, tgsRasterFrameRate);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
      final stopped = clock.microseconds;
      await tester.pump(const Duration(seconds: 2));
      expect(clock.microseconds, stopped);
      expect(cache.enabled, isFalse);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(clock.microseconds, greaterThan(stopped));
      await tester.pumpWidget(const SizedBox());
      expect(clock.hasConsumers, isFalse);
    },
  );
  testWidgets(
    'LoD has bare animated cells and tapping keeps the grid running',
    (tester) async {
      final store = createStore();
      addTearDown(store.dispose);
      await tester.pumpWidget(
        MaterialApp(
          home: TgsGallery(
            store: store,
            catalog: catalog(),
            initialWorkload: TgsWorkload.lod,
          ),
        ),
      );
      await ready(tester);
      final cells = tester
          .widgetList<StickerCell>(find.byType(StickerCell))
          .toList();
      expect(cells.where((c) => c.animate).length, greaterThan(8));
      expect(cells.first.maximumFrameRate, tgsRasterFrameRate);
      expect(cells.first.clock.effectiveFrameRate, tgsRasterFrameRate);
      expect(cells.first.rasterCache!.resolutionScale, tgsLodScale);
      expect(cells.first.rasterCache!.maximumFrameRate, tgsRasterFrameRate);
      await tester.tap(find.byType(StickerCell).first);
      await tester.pump();
      expect(find.byType(AlertDialog), findsNothing);
      final before = cells.first.clock.microseconds;
      await tester.pump(const Duration(milliseconds: 100));
      expect(cells.first.clock.microseconds, greaterThan(before));
      expect(cells.first.rasterCache!.enabled, isTrue);
      expect(find.byType(AppBar), findsNothing);
      expect(find.byType(IconButton), findsNothing);
      expect(
        find.byWidgetPredicate(
          (widget) =>
              widget is ListenableBuilder &&
              identical(widget.listenable, store),
        ),
        findsNothing,
      );
      final cellsFinder = find.byType(StickerCell);
      for (final type in [Text, Tooltip, DecoratedBox, GestureDetector]) {
        expect(
          find.descendant(of: cellsFinder, matching: find.byType(type)),
          findsNothing,
        );
      }
      expect(find.byType(DropdownButton<TgsRenderer>), findsOneWidget);
      await tester.pumpWidget(const SizedBox());
    },
  );

  for (final workload in [TgsWorkload.mobile]) {
    testWidgets(
      '$workload keeps the clock and cache running while scrolling the active window',
      (tester) async {
        final store = createStore();
        addTearDown(store.dispose);
        await tester.pumpWidget(
          MaterialApp(
            home: TgsGallery(
              store: store,
              catalog: catalog(),
              initialWorkload: workload,
            ),
          ),
        );
        await ready(tester);
        final first = tester.widget<StickerCell>(
          find.byType(StickerCell).first,
        );
        final gesture = await tester.startGesture(
          tester.getCenter(find.byKey(const ValueKey('tgs-grid'))),
        );
        await gesture.moveBy(const Offset(0, -300));
        await tester.pump();
        final before = first.clock.microseconds;
        await tester.pump(const Duration(milliseconds: 100));
        expect(first.clock.microseconds, greaterThan(before));
        expect(first.rasterCache!.enabled, isTrue);
        await gesture.up();
        final scrollable = tester.state<ScrollableState>(
          find.descendant(
            of: find.byKey(const ValueKey('tgs-grid')),
            matching: find.byType(Scrollable),
          ),
        );
        for (
          var i = 0;
          i < 100 && scrollable.position.isScrollingNotifier.value;
          i++
        ) {
          final beforeFrame = first.clock.microseconds;
          await tester.pump(const Duration(milliseconds: 50));
          expect(first.clock.microseconds, greaterThan(beforeFrame));
          expect(first.rasterCache!.enabled, isTrue);
        }
        expect(scrollable.position.isScrollingNotifier.value, isFalse);
        final active = tester
            .widgetList<StickerCell>(find.byType(StickerCell))
            .where((c) => c.animate)
            .toList();
        expect(
          active.length,
          workload == TgsWorkload.mobile
              ? lessThanOrEqualTo(8)
              : greaterThan(8),
        );
        expect(active.first.index, greaterThan(0));
        await tester.pumpWidget(const SizedBox());
      },
    );
  }
}
