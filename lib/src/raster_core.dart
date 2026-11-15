// Scene compilation and rasterization shared by Flutter and the browser worker.
import 'dart:convert';

import 'dart:math' as math;
import 'dart:typed_data';

import '../decoding.dart';
import 'bitstream_cache.dart';
import 'isolate_stub.dart' if (dart.library.isolate) 'isolate_io.dart';
import 'lz4.dart';
import 'options.dart';
import 'raster_no_canvas.dart'
    if (dart.library.ui) 'raster_flutter_canvas.dart';
import 'simd_stub.dart'
    if (dart.library.ffi) 'simd_io.dart'
    if (dart.library.js_interop) 'simd_wasm.dart';
import 'tile_playback.dart';

part 'compiler.dart';
part 'expressions.dart';
part 'track.dart';
part 'scene.dart';
part 'fork.dart';
part 'gradient.dart';
part 'path_ops.dart';
part 'rle_rasterizer.dart';
part 'raster_worker.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');

// Browser workers ship as a separate precompiled asset. Keep its pixel
// algorithm aligned with the Flutter web host, including inline fallback.
const defaultFuseFillTransforms =
    _isWeb || bool.fromEnvironment('FASTLOTTIE_FUSED_FILL', defaultValue: true);

final class RasterScene {
  RasterScene._(this._compiler);

  factory RasterScene.compile(
    Map<String, dynamic> document,
    FastLottieOptions options,
  ) => RasterScene._(_Compiler(options)..compile(document));

  final _Compiler _compiler;
  double get width => _compiler.width;
  double get height => _compiler.height;
  double get start => _compiler.start;
  double get end => _compiler.end;
  double get fps => _compiler.fps;
  int get commands => _compiler.commands;
  bool get isStatic => _compiler.isStatic;
  String get contentKey {
    final key = _computeCompositionContentKey(_compiler);
    // Device-space flattening can alter edge pixels, so it uses a separate
    // cache namespace from the original rasterizer.
    return defaultFuseFillTransforms ? '${key}_fused1' : key;
  }

  RasterScene fork({bool warm = false}) =>
      RasterScene._(_Fork(warm: warm).scene(_compiler));

  void draw(Object canvas, double frame) =>
      _compiler.draw(canvas as Canvas, frame);
}

void renderSceneSoftware(
  RasterScene scene,
  double frame,
  NativePixelBuffer pixels,
  int width,
  int height,
  RasterWorkspace workspace,
) => _renderSceneSoftware(
  scene._compiler,
  frame,
  pixels,
  width,
  height,
  workspace,
);
