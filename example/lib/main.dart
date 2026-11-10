import 'dart:async';

import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';

import 'tgs/cache_dir.dart';
import 'tgs/cupertino_chat.dart';

void main() => runApp(const FastLottieCupertinoApp());

class FastLottieCupertinoApp extends StatefulWidget {
  const FastLottieCupertinoApp({super.key});

  @override
  State<FastLottieCupertinoApp> createState() => _FastLottieCupertinoAppState();
}

class _FastLottieCupertinoAppState extends State<FastLottieCupertinoApp> {
  bool _isDark = true;

  @override
  Widget build(BuildContext context) => CupertinoApp(
    debugShowCheckedModeBanner: false,
    title: 'FastLottie Cupertino Network Chat',
    theme: CupertinoThemeData(
      brightness: _isDark ? Brightness.dark : Brightness.light,
      primaryColor: const Color(0xff635bff),
    ),
    home: CupertinoChatScreen(
      isDark: _isDark,
      onBrightnessChanged: (next) => setState(() => _isDark = next),
    ),
  );
}

class RasterPreview extends StatefulWidget {
  const RasterPreview({
    super.key,
    required this.composition,
    required this.controller,
    this.width = 256,
    this.height = 256,
    this.maximumRasterBytes = 64 * 1024 * 1024,
  }) : assert(width > 0),
       assert(height > 0),
       assert(maximumRasterBytes >= 0);
  final FastLottieComposition composition;
  final Animation<double> controller;
  final double width, height;
  final int maximumRasterBytes;
  @override
  State<RasterPreview> createState() => _RasterPreviewState();
}

class _RasterPreviewState extends State<RasterPreview> {
  FastLottieRasterCache? rasterCache;
  FastLottiePlayer? player;
  double? devicePixelRatio;
  bool rasterFitsBudget = false;

  void prepare() {
    final oldPlayer = player;
    final oldCache = rasterCache;
    final dpr = devicePixelRatio!;
    final pixelWidth = (widget.width * dpr).ceil();
    final pixelHeight = (widget.height * dpr).ceil();
    final bufferCount = widget.composition.isStatic ? 1 : 2;
    final requiredBytes = pixelWidth * pixelHeight * 4 * bufferCount;
    rasterFitsBudget = requiredBytes <= widget.maximumRasterBytes;

    final nextCache = FastLottieRasterCache.pingPong(
      maximumBytes: widget.maximumRasterBytes,
    );
    unawaited(attachExampleDiskCache(nextCache));
    final nextPlayer = FastLottiePlayer(
      widget.composition,
      cache: FastLottieCache.none,
      rasterCache: nextCache,
    );
    rasterCache = nextCache;
    player = nextPlayer;
    oldPlayer?.dispose();
    oldCache?.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final dpr = MediaQuery.devicePixelRatioOf(context);
    if (dpr != devicePixelRatio) {
      devicePixelRatio = dpr;
      prepare();
    }
  }

  @override
  void didUpdateWidget(RasterPreview old) {
    super.didUpdateWidget(old);
    if (old.composition != widget.composition ||
        old.width != widget.width ||
        old.height != widget.height ||
        old.maximumRasterBytes != widget.maximumRasterBytes) {
      prepare();
    }
  }

  @override
  void dispose() {
    final previousPlayer = player;
    final previousCache = rasterCache;
    player = null;
    rasterCache = null;
    previousPlayer?.dispose();
    previousCache?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(
        rasterFitsBudget
            ? 'fastlottie · ping-pong raster cache'
            : 'fastlottie · vector fallback (raster budget exceeded)',
      ),
      SizedBox(
        width: widget.width,
        height: widget.height,
        child: FastLottieView(player: player!, progress: widget.controller),
      ),
    ],
  );
}
