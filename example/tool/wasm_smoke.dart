import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

const _requireHook = bool.fromEnvironment('FASTLOTTIE_REQUIRE_WASM_HOOK');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await _checkRendering();
  await _checkMiniStrip();
  const result = 'FastLottie Wasm smoke test passed';
  debugPrint(result);
  runApp(
    const Directionality(textDirection: TextDirection.ltr, child: Text(result)),
  );
}

void _check(bool condition, String message) {
  if (!condition) throw StateError(message);
}

Future<void> _checkRendering() async {
  final icon = await FastLottieComposition.loadAsset('assets/icon.json');
  final early = FastLottieSoftwareSession(
    icon,
    pixelWidth: 64,
    pixelHeight: 64,
  );
  try {
    final expected = Uint32List.fromList(early.renderFrame(0));
    _check(
      expected[32 * 64 + 32] >>> 24 == 255 && expected[0] == 0,
      'Unexpected icon pixels',
    );

    if (_requireHook) {
      final assets = await AssetManifest.loadFromAssetBundle(rootBundle);
      _check(
        assets.listAssets().contains(
          'packages/fastlottie/fastlottie_simd.wasm',
        ),
        'Missing Wasm asset from the build hook',
      );
    }
    await ensureSimdReady();
    _check(isSimdSupported, 'Wasm FFI did not initialize');
    _check(
      listEquals(early.renderFrame(0), expected),
      'The early session changed after Wasm initialization',
    );
    _check(
      listEquals(
        // The smoke app exercises the testing API on both web compilers.
        // ignore: invalid_use_of_visible_for_testing_member
        debugRenderSoftwareFrame(icon, 0, pixelWidth: 64, pixelHeight: 64),
        Uint8List.sublistView(expected),
      ),
      'The rendered bytes do not match the frame',
    );
  } finally {
    early.dispose();
  }

  // Large coverage scratch allocations grow the Wasm heap while rendering.
  final wave = await FastLottieComposition.loadAsset(
    'assets/rlottie_material_wave.json',
  );
  for (final (name, composition) in [
    ('icon', icon),
    ('wave', wave),
    ('gradient', await _gradientIcon()),
  ]) {
    const size = 512;
    final wasm = FastLottieSoftwareSession(
      composition,
      pixelWidth: size,
      pixelHeight: size,
    );
    final dart = FastLottieSoftwareSession(
      composition,
      pixelWidth: size,
      pixelHeight: size,
      preferNative: false,
      retainCoverage: false,
    );
    try {
      for (final frame in [0.0, 7.0, 13.0, 0.0]) {
        final pixels = Uint32List.fromList(wasm.renderFrame(frame));
        _check(
          pixels.length == size * size &&
              listEquals(pixels, dart.renderFrame(frame)),
          '$name frame $frame differs from Dart',
        );
      }
    } finally {
      wasm.dispose();
      dart.dispose();
    }
  }
}

Future<FastLottieComposition> _gradientIcon() async {
  final document = jsonDecode(
    await rootBundle.loadString('assets/icon.json'),
  ) as Map<String, dynamic>;
  final items = document['layers'][0]['shapes'][0]['it'] as List<dynamic>;
  items[1] = {
    'ty': 'gf',
    't': 1,
    'o': {'a': 0, 'k': 100},
    's': {
      'a': 0,
      'k': [-55, 0],
    },
    'e': {
      'a': 0,
      'k': [55, 0],
    },
    'g': {
      'p': 2,
      'k': {
        'a': 0,
        'k': [0, 1, 0, 0, 1, 0, 0, 1],
      },
    },
  };
  return FastLottieComposition.fromJson(document);
}

Future<void> _checkMiniStrip() async {
  final icon = await FastLottieComposition.loadAsset('assets/icon.json');
  final cache = FastLottieRasterCache.miniStrip(stripFrames: 4, workerCount: 1);
  final player = FastLottiePlayer(
    icon,
    rasterCache: cache,
    cache: FastLottieCache.none,
  );
  ui.Picture draw(double progress) {
    final recorder = ui.PictureRecorder();
    player.draw(
      ui.Canvas(recorder),
      const ui.Rect.fromLTWH(0, 0, 64, 64),
      progress,
    );
    return recorder.endRecording();
  }

  try {
    draw(0).dispose();
    for (var i = 0; i < 200 && cache.pendingFrames > 0; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 5));
    }
    _check(cache.lastError == null, 'Raster cache error: ${cache.lastError}');
    _check(
      cache.pendingFrames == 0 && cache.vectorRasterizedFrames == 4,
      'The four-frame strip was not uploaded',
    );
    final hits = cache.hits;
    final picture = draw(2 / icon.frameCount);
    try {
      _check(cache.hits == hits + 1, 'The player did not draw a cached frame');
      final reference = FastLottieSoftwareSession(
        icon,
        pixelWidth: 64,
        pixelHeight: 64,
        preferNative: false,
      );
      final center = reference.renderFrame(2)[32 * 64 + 32];
      reference.dispose();
      final expectedRgba = ((center & 0xffffff) << 8) | (center >>> 24);
      final image = await picture.toImage(64, 64);
      try {
        final rgba = (await image.toByteData())!;
        _check(
          rgba.getUint32((32 * 64 + 32) * 4) == expectedRgba &&
              rgba.getUint32(0) == 0,
          'Wrong pixels in the cached frame',
        );
      } finally {
        image.dispose();
      }
    } finally {
      picture.dispose();
    }
  } finally {
    player.dispose();
    cache.dispose();
  }
}
