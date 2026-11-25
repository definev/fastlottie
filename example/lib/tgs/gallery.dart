import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';

import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';

import 'cache_dir.dart';
import 'clock.dart';
import 'store.dart';

enum TgsRenderer { fastlottie, lottie }

enum TgsWorkload { full, cached, mobile, lod }

// Thumbnail resolution relative to the fitted size × DPR.
const tgsLodScale = .5;
const tgsRasterFrameRate = 30.0;

Future<List<String>> loadTgsCatalog(AssetBundle bundle) async {
  final manifest = await AssetManifest.loadFromAssetBundle(bundle);
  final assets =
      manifest
          .listAssets()
          .where(
            (p) =>
                p.startsWith('assets/tgs/') &&
                !p.contains('/Topics-') &&
                !p.contains('/NotoEmoji/') &&
                p.endsWith('.tgs'),
          )
          .toList()
        ..sort();
  final packs = <String, List<String>>{};
  for (final path in assets) {
    (packs[path.split('/')[2]] ??= []).add(path);
  }
  final result = <String>[];
  for (var row = 0; ; row++) {
    var found = false;
    for (final pack in packs.values) {
      if (row < pack.length) {
        result.add(pack[row]);
        found = true;
      }
    }
    if (!found) break;
  }
  return result;
}

class TgsGallery extends StatefulWidget {
  const TgsGallery({
    super.key,
    this.store,
    this.catalog,
    this.initialRenderer = TgsRenderer.fastlottie,
    this.scrollController,
    this.initialWorkload,
    this.framesPerStrip,
    this.onRasterCacheCreated,
  });
  final TgsStore? store;
  final Future<List<String>>? catalog;
  final TgsRenderer initialRenderer;
  final ScrollController? scrollController;
  final TgsWorkload? initialWorkload;
  final int? framesPerStrip;
  final ValueChanged<FastLottieRasterCache>? onRasterCacheCreated;
  @override
  State<TgsGallery> createState() => _TgsGalleryState();
}

class _TgsGalleryState extends State<TgsGallery> with WidgetsBindingObserver {
  late final TgsStore store =
      widget.store ??
      TgsStore(concurrency: _mobilePlatform ? 1 : 2, framePaced: true);
  late final Future<List<String>> catalog =
      widget.catalog ?? loadTgsCatalog(rootBundle);
  late final StickerClock clock = StickerClock();
  late TgsRenderer renderer = widget.initialRenderer;
  bool get _mobilePlatform =>
      defaultTargetPlatform == TargetPlatform.android ||
      defaultTargetPlatform == TargetPlatform.iOS;
  late TgsWorkload workload = widget.initialWorkload ?? TgsWorkload.lod;
  late int? framesPerStrip = widget.framesPerStrip;
  late FastLottieRasterCache rasterCache;
  final List<FastLottieRasterCache> _disposingCaches = [];
  late final ScrollController scroll =
      widget.scrollController ?? ScrollController();
  bool foreground = true;
  int activeStart = 0;
  bool get mobile => workload == TgsWorkload.mobile;
  bool get lod => workload == TgsWorkload.lod;
  bool get reduced => MediaQuery.disableAnimationsOf(context);
  double? get playbackFrameRate => mobile
      ? 30
      : renderer == TgsRenderer.fastlottie && workload != TgsWorkload.full
      ? rasterCache.maximumFrameRate
      : null;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    final life = WidgetsBinding.instance.lifecycleState;
    foreground =
        life == null ||
        life == AppLifecycleState.resumed ||
        life == AppLifecycleState.inactive;
    _createRasterCache();
  }

  void _createRasterCache() {
    rasterCache = FastLottieRasterCache(
      maximumFrameRate: tgsRasterFrameRate,
      resolutionScale: lod ? tgsLodScale : 1,
      framesPerStrip: framesPerStrip,
    );
    unawaited(attachExampleDiskCache(rasterCache));
    widget.onRasterCacheCreated?.call(rasterCache);
  }

  void _setFramesPerStrip(int? next) {
    if (framesPerStrip == next) return;
    final previous = rasterCache;
    previous.enabled = false;
    setState(() {
      framesPerStrip = next;
      _createRasterCache();
      _syncPlayback();
    });
    _disposingCaches.add(previous);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_disposingCaches.remove(previous)) {
        previous.dispose();
      }
    });
  }

  void _syncPlayback() {
    final enabled = foreground && TickerMode.valuesOf(context).enabled;
    clock.configure(
      playing: enabled,
      reducedMotion: reduced,
      maximumFrameRate: mobile ? 30 : null,
    );
    rasterCache.enabled =
        enabled &&
        !reduced &&
        renderer == TgsRenderer.fastlottie &&
        workload != TgsWorkload.full;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    foreground =
        state == AppLifecycleState.resumed ||
        state == AppLifecycleState.inactive;
    _syncPlayback();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncPlayback();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    clock.dispose();
    rasterCache.dispose();
    for (final stale in _disposingCaches) {
      stale.dispose();
    }
    _disposingCaches.clear();
    if (widget.scrollController == null) scroll.dispose();
    if (widget.store == null) store.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Column(
        children: [
          SizedBox(
            height: 48,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonHideUnderline(
                  child: DropdownButton<TgsRenderer>(
                    value: renderer,
                    items: [
                      for (final r in TgsRenderer.values)
                        DropdownMenuItem(value: r, child: Text(r.name)),
                    ],
                    onChanged: (r) {
                      setState(() => renderer = r!);
                      _syncPlayback();
                    },
                  ),
                ),
                if (renderer == TgsRenderer.fastlottie &&
                    workload != TgsWorkload.full) ...[
                  const SizedBox(width: 12),
                  Flexible(
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        key: const ValueKey('gallery-strip-size-dropdown'),
                        isExpanded: true,
                        value: framesPerStrip ?? 0,
                        items: [
                          const DropdownMenuItem(
                            value: 0,
                            child: Text(
                              'Adaptive',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const DropdownMenuItem(
                            value: 1,
                            child: Text(
                              '1 frame',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (widget.framesPerStrip case final int count
                              when count > 1)
                            DropdownMenuItem(
                              value: count,
                              child: Text(
                                '$count frames',
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                        ],
                        onChanged: (next) {
                          if (next != null) {
                            _setFramesPerStrip(next == 0 ? null : next);
                          }
                        },
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          Expanded(
            child: FutureBuilder<List<String>>(
              future: catalog,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(child: Text('${snapshot.error}'));
                }
                final assets = snapshot.data;
                if (assets == null) {
                  return const SizedBox.shrink();
                }
                if (assets.isEmpty) {
                  return const Center(child: Text('No .tgs assets found'));
                }
                return LayoutBuilder(
                  builder: (context, constraints) {
                    final cellWidth = (constraints.maxWidth - 40) / 4;
                    final itemWidth = cellWidth - 12;
                    final itemHeight = cellWidth - 36;
                    final grid = GridView.builder(
                      key: const ValueKey('tgs-grid'),
                      controller: scroll,
                      padding: const EdgeInsets.all(8),
                      addAutomaticKeepAlives: false,
                      // Both renderers already isolate their own canvas.
                      addRepaintBoundaries: false,
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 4,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                      itemBuilder: (context, index) => StickerCell(
                        key: ValueKey(index),
                        index: index,
                        asset: assets[index % assets.length],
                        store: store,
                        clock: clock,
                        renderer: renderer,
                        itemWidth: itemWidth,
                        itemHeight: itemHeight,
                        animate:
                            !reduced &&
                            (!mobile ||
                                (index >= activeStart &&
                                    index < activeStart + 8)),
                        maximumFrameRate: playbackFrameRate,
                        rasterCache: workload == TgsWorkload.full
                            ? null
                            : rasterCache,
                      ),
                    );
                    if (!mobile) return grid;
                    final rowExtent = (constraints.maxWidth - 40) / 4 + 8;
                    return NotificationListener<ScrollNotification>(
                      onNotification: (notification) {
                        if (notification.depth == 0 &&
                            (notification is ScrollUpdateNotification ||
                                notification is ScrollEndNotification)) {
                          final first =
                              (notification.metrics.pixels.clamp(
                                        0.0,
                                        double.infinity,
                                      ) /
                                      rowExtent)
                                  .floor() *
                              4;
                          if (first != activeStart) {
                            setState(() => activeStart = first);
                          }
                        }
                        return false;
                      },
                      child: grid,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    ),
  );
}

class StickerCell extends StatefulWidget {
  const StickerCell({
    super.key,
    required this.index,
    required this.asset,
    required this.store,
    required this.clock,
    required this.renderer,
    this.itemWidth,
    this.itemHeight,
    this.animate = true,
    this.maximumFrameRate,
    this.rasterCache,
    this.padding = const EdgeInsets.fromLTRB(6, 18, 6, 18),
    this.silhouette = false,
  });
  final int index;
  final String asset;
  final TgsStore store;
  final StickerClock clock;
  final TgsRenderer renderer;
  final double? itemWidth, itemHeight;
  final bool animate;
  final double? maximumFrameRate;
  final FastLottieRasterCache? rasterCache;
  final EdgeInsets padding;
  final bool silhouette;
  @override
  State<StickerCell> createState() => _StickerCellState();
}

class _StickerCellState extends State<StickerCell> {
  late TgsLease lease;
  void load() => lease = widget.store.acquire(
    widget.asset,
    reference: widget.renderer == TgsRenderer.lottie,
  );
  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  void didUpdateWidget(StickerCell old) {
    super.didUpdateWidget(old);
    if (old.asset != widget.asset ||
        old.store != widget.store ||
        (old.renderer == TgsRenderer.lottie) !=
            (widget.renderer == TgsRenderer.lottie)) {
      lease.release();
      load();
    }
  }

  @override
  void dispose() {
    lease.release();
    super.dispose();
  }

  Widget _buildContent(TgsModel model) {
    final wrongBackend =
        (model.fast != null) != (widget.renderer == TgsRenderer.fastlottie);
    if (wrongBackend) {
      return const Center(child: Icon(Icons.error_outline));
    }
    final sticker = _AnimatedSticker(
      model: model,
      clock: widget.clock,
      width: widget.itemWidth,
      height: widget.itemHeight,
      animate: widget.animate && !widget.silhouette,
      maximumFrameRate: widget.maximumFrameRate,
      rasterCache: widget.rasterCache,
    );
    return Padding(
      padding: widget.padding,
      child: widget.silhouette
          ? ColorFiltered(
              colorFilter: const ColorFilter.mode(
                Color(0xff77717f),
                BlendMode.srcIn,
              ),
              child: sticker,
            )
          : sticker,
    );
  }

  @override
  Widget build(BuildContext context) {
    final ready = lease.ready;
    if (ready != null) return _buildContent(ready);
    return FutureBuilder<TgsModel>(
      future: lease.future,
      initialData: lease.ready,
      builder: (context, snapshot) {
        final model = lease.ready;
        if (snapshot.hasError) {
          return const Center(child: Icon(Icons.error_outline));
        }
        if (model == null) return const SizedBox.shrink();
        return _buildContent(model);
      },
    );
  }
}

class _AnimatedSticker extends StatefulWidget {
  const _AnimatedSticker({
    required this.model,
    required this.clock,
    this.width,
    this.height,
    required this.animate,
    this.maximumFrameRate,
    this.rasterCache,
  });
  final TgsModel model;
  final StickerClock clock;
  final double? width, height;
  final bool animate;
  final double? maximumFrameRate;
  final FastLottieRasterCache? rasterCache;
  @override
  State<_AnimatedSticker> createState() => _AnimatedStickerState();
}

class _AnimatedStickerState extends State<_AnimatedSticker> {
  late Animation<double> progress;
  void create() =>
      progress = !widget.animate || (widget.model.fast?.isStatic ?? false)
      ? const AlwaysStoppedAnimation(0)
      : StickerProgress(
          widget.clock,
          widget.model.frames,
          widget.model.frameRate,
          maximumFrameRate: widget.maximumFrameRate,
        );
  void releaseProgress() {
    if (progress is StickerProgress) (progress as StickerProgress).dispose();
  }

  @override
  void initState() {
    super.initState();
    create();
  }

  @override
  void didUpdateWidget(_AnimatedSticker old) {
    super.didUpdateWidget(old);
    if (old.model != widget.model ||
        old.clock != widget.clock ||
        old.animate != widget.animate ||
        old.maximumFrameRate != widget.maximumFrameRate) {
      releaseProgress();
      create();
    }
  }

  @override
  void dispose() {
    releaseProgress();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.model.fast != null
      ? FastLottiePlaybackScope(
          playback: widget.animate
              ? FastLottiePlayback.active
              : FastLottiePlayback.prewarm,
          child: FastLottie(
            composition: widget.model.fast!,
            controller: progress,
            width: widget.width,
            height: widget.height,
            cache: FastLottieCache.none,
            rasterCache: widget.rasterCache,
            rasterMode: widget.animate
                ? FastLottieRasterMode.animation
                : FastLottieRasterMode.poster,
            maximumFrameRate: widget.maximumFrameRate,
            usePipeline: widget.rasterCache != null,
          ),
        )
      : Lottie(
          composition: widget.model.reference!,
          controller: progress,
          width: widget.width,
          height: widget.height,
          frameRate: FrameRate.composition,
          fit: BoxFit.contain,
          renderCache: widget.rasterCache == null ? null : RenderCache.raster,
        );
}
