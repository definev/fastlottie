import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
// ignore: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'cache_dir.dart';
import 'clock.dart';
import 'gallery.dart';
import 'sheet.dart';
import 'pressure.dart';
import 'posters.dart';
import 'store.dart';
import 'rich_messages.dart';

/// A chat with a scrollable, five-column sticker picker backed 100% by the
/// ping-pong software RLE + LZ4 disk cache pipeline.
/// The 4-column scrolling comparison remains available at /gallery.
class TelegramStickerDemo extends StatefulWidget {
  const TelegramStickerDemo({super.key, this.catalog, this.store});
  final Future<List<String>>? catalog;
  final TgsStore? store;
  @override
  State<TelegramStickerDemo> createState() => _TelegramStickerDemoState();
}

class _TelegramStickerDemoState extends State<TelegramStickerDemo>
    with WidgetsBindingObserver {
  late final store =
      widget.store ??
      TgsStore(concurrency: 2, maximumEntries: 160, framePaced: true);
  late final Future<List<String>> catalog = _loadCatalog();
  StickerPosters? posters;
  Future<List<String>> _loadCatalog() async {
    final assetsFuture = widget.catalog ?? loadTgsCatalog(rootBundle);
    final loaded = await StickerPosters.load();
    if (!mounted) {
      loaded.dispose();
      return const [];
    }
    posters = loaded;
    return assetsFuture;
  }

  final clock = StickerClock();
  late final pressure = StickerPressure()..addListener(_pressureChanged);
  void _pressureChanged() {
    if (!mounted) return;
    sheet?.constrained = pressure.constrained;
    topicSheet.constrained = pressure.constrained;
    if (!pressure.constrained) topicSheet.resumePreparation();
    if (!pressure.constrained) sheet?.resumePreparation();
    _sync();
    setState(() {});
  }

  TgsRenderer renderer = TgsRenderer.fastlottie;
  final rasterCache = FastLottieRasterCache.pingPong(
    maximumBytes: 48 * 1024 * 1024,
    maximumCompressedMemoryBytes: 16 * 1024 * 1024,
    maximumDiskBytes: 128 * 1024 * 1024,
  );
  StickerSheet? sheet;
  late final topicSheet = StickerSheet(
    assets: topicEmojiAssets,
    pixelSize: 48,
    store: store,
    rasterCache: rasterCache,
    frameRate: stickerThumbnailFrameRate,
  );
  final sentStickers = <String>[];
  final messageScroll = ScrollController();
  void _sendSticker(String asset) {
    setState(() => sentStickers.add(asset));
    _sync();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !messageScroll.hasClients) return;
      // Reversed message list has a stable bottom at zero, even with variable
      // message heights or several taps before the next layout.
      messageScroll.animateTo(
        0,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    });
  }

  bool foreground = true;
  bool get reduced => MediaQuery.disableAnimationsOf(context);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    final life = WidgetsBinding.instance.lifecycleState;
    foreground =
        life == null ||
        life == AppLifecycleState.resumed ||
        life == AppLifecycleState.inactive;
    unawaited(attachExampleDiskCache(rasterCache));
  }

  void _sync() {
    final active = foreground && TickerMode.valuesOf(context).enabled;
    final fastEnabled =
        active &&
        renderer == TgsRenderer.fastlottie &&
        !reduced &&
        !pressure.constrained;
    clock.configure(
      playing: active,
      reducedMotion: reduced,
      maximumFrameRate: stickerThumbnailFrameRate,
    );
    sheet?.active = fastEnabled;
    topicSheet.active = fastEnabled;
    rasterCache.enabled = fastEnabled;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    foreground =
        state == AppLifecycleState.resumed ||
        state == AppLifecycleState.inactive;
    _sync();
  }

  void _createSheet(List<String> assets, int pixels) {
    if (sheet != null) return;
    sheet = StickerSheet(
      assets: assets,
      pixelSize: pixels,
      store: store,
      rasterCache: rasterCache,
      frameRate: stickerThumbnailFrameRate,
    )..constrained = pressure.constrained;
    _sync();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    pressure.dispose();
    messageScroll.dispose();
    sheet?.dispose();
    topicSheet.dispose();
    rasterCache.dispose();
    posters?.dispose();
    clock.dispose();
    if (widget.store == null) store.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Theme(
    data: ThemeData.dark(useMaterial3: true).copyWith(
      scaffoldBackgroundColor: const Color(0xff17171b),
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xffb382dc),
        brightness: Brightness.dark,
      ),
    ),
    child: Scaffold(
      body: SafeArea(
        child: FutureBuilder<List<String>>(
          future: catalog,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(child: Text('${snapshot.error}'));
            }
            final assets = snapshot.data;
            if (assets == null) return const SizedBox.shrink();
            if (assets.isEmpty) {
              return const Center(child: Text('No TGS assets'));
            }
            final slots = List.generate(
              stickerSheetCount,
              (i) => assets[i % assets.length],
              growable: false,
            );
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: SizedBox(
                    height: 52,
                    child: Row(
                      children: [
                        const Icon(
                          Icons.bookmark_rounded,
                          color: Color(0xffb382dc),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Saved Messages',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        DropdownButtonHideUnderline(
                          child: DropdownButton<TgsRenderer>(
                            value: renderer,
                            items: [
                              for (final r in TgsRenderer.values)
                                DropdownMenuItem(value: r, child: Text(r.name)),
                            ],
                            onChanged: (value) {
                              if (value == null) return;
                              setState(() => renderer = value);
                              _sync();
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Expanded(
                  child: RichMessageList(
                    sheet: topicSheet,
                    posters: posters!,
                    clock: clock,
                    store: store,
                    renderer: renderer,
                    still: reduced || pressure.constrained,
                    animateSent: !reduced,
                    rasterCache: rasterCache,
                    sentStickers: sentStickers,
                    controller: messageScroll,
                  ),
                ),
                SizedBox(
                  key: const ValueKey('sticker-picker-panel'),
                  height: MediaQuery.heightOf(context) * .3,
                  child: ColoredBox(
                    color: const Color(0xff232327),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        _createSheet(slots, stickerThumbnailPixels);
                        return RepaintBoundary(
                          child: GridView.builder(
                            key: const ValueKey('sticker-picker-grid'),
                            primary: false,
                            padding: const EdgeInsets.all(8),
                            scrollCacheExtent: const ScrollCacheExtent.pixels(0),
                            itemCount: slots.length,
                            addAutomaticKeepAlives: false,
                            addRepaintBoundaries: false,
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 5,
                                  crossAxisSpacing: 6,
                                  mainAxisSpacing: 6,
                                ),
                            itemBuilder: (context, i) => Semantics(
                              button: true,
                              label: 'Send sticker ${i + 1}',
                              child: GestureDetector(
                                key: ValueKey('send-sticker-$i'),
                                behavior: HitTestBehavior.opaque,
                                onTap: () => _sendSticker(slots[i]),
                                child: Padding(
                                  padding: const EdgeInsets.all(4),
                                  child: InlineSticker(
                                    asset: slots[i],
                                    label: 'Sticker ${i + 1}',
                                    sheet: sheet!,
                                    posters: posters!,
                                    clock: clock,
                                    store: store,
                                    renderer: renderer,
                                    still: reduced || pressure.constrained,
                                    size: constraints.maxWidth / 4.5,
                                    repaintBoundary: false,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    ),
  );
}
