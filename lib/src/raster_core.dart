// Scene compilation and rasterization shared by Flutter and the browser worker.
import 'dart:convert';

import 'dart:math' as math;
import 'dart:typed_data';

import '../decoding.dart';
import 'bitstream_cache.dart';
import 'geometry_kernel_stub.dart'
    if (dart.library.ffi) 'geometry_kernel_io.dart';
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
part 'scene_snapshot.dart';
part 'gradient.dart';
part 'path_ops.dart';
part 'rle_rasterizer.dart';
part 'raster_worker.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');

// Browser workers ship as a separate precompiled asset. Keep its pixel
// algorithm aligned with the Flutter web host, including inline fallback.
const defaultFuseFillTransforms =
    _isWeb || bool.fromEnvironment('FASTLOTTIE_FUSED_FILL', defaultValue: true);
const _useNativeBezier = bool.fromEnvironment(
  'FASTLOTTIE_NATIVE_BEZIER',
  defaultValue: true,
);

typedef _SnapshotMetadata = ({
  double width,
  double height,
  double start,
  double end,
  double fps,
  int commands,
  FastLottieOptions options,
  bool isStatic,
  String key,
  int sourceBytes,
});

final class RasterScene {
  RasterScene._(_Compiler compiler)
    : _compilerState = compiler,
      _snapshot = null,
      _metadata = null,
      _deferredPlayback = false;

  RasterScene._snapshotTemplate(
    Uint8List bytes,
    _SnapshotMetadata metadata, [
    this._deferredPlayback = false,
  ]) : _compilerState = null,
       _snapshot = bytes,
       _metadata = metadata;

  factory RasterScene.compile(
    Map<String, dynamic> document,
    FastLottieOptions options,
  ) => RasterScene._(_Compiler(options)..compile(document));

  _Compiler? _compilerState;
  _Compiler get _compiler =>
      _compilerState ??= _SceneSnapshot.decode(_snapshot!, warm: true).compiler;
  final Uint8List? _snapshot;
  final _SnapshotMetadata? _metadata;
  final bool _deferredPlayback;
  bool get debugHasPlaybackState => _compilerState != null;
  double get width => _metadata?.width ?? _compiler.width;
  double get height => _metadata?.height ?? _compiler.height;
  double get start => _metadata?.start ?? _compiler.start;
  double get end => _metadata?.end ?? _compiler.end;
  double get fps => _metadata?.fps ?? _compiler.fps;
  int get commands => _metadata?.commands ?? _compiler.commands;
  FastLottieOptions get options => _metadata?.options ?? _compiler.options;
  bool get isStatic => _metadata?.isStatic ?? _compiler.isStatic;
  String get contentKey {
    final metadata = _metadata;
    if (metadata != null) return metadata.key;
    final key = _computeCompositionContentKey(_compiler);
    // Device-space flattening can alter edge pixels, so it uses a separate
    // cache namespace from the original rasterizer.
    return defaultFuseFillTransforms ? '${key}_fused1' : key;
  }

  RasterScene fork({bool warm = false}) => _snapshot == null
      ? RasterScene._(_Fork(warm: warm).scene(_compiler))
      : _deferredPlayback
      ? RasterScene._snapshotTemplate(_snapshot, _metadata!, true)
      : restoreSnapshot(_snapshot, warm: warm).scene;

  /// A restored scene can be the first player's graph. Its template stores
  /// only trusted bytes and metadata; later forks restore fresh player state.
  RasterScene snapshotTemplate(Uint8List bytes, String key, int sourceBytes) =>
      RasterScene._snapshotTemplate(bytes, (
        width: width,
        height: height,
        start: start,
        end: end,
        fps: fps,
        commands: commands,
        options: options,
        isStatic: isStatic,
        key: key,
        sourceBytes: sourceBytes,
      ));

  /// Internal experiment: trusted RAM snapshots and build-owned benchmark packs.
  Uint8List snapshot(String key, int sourceBytes) =>
      _metadata?.key == key && _metadata?.sourceBytes == sourceBytes
      ? Uint8List.fromList(_snapshot!)
      : _SceneSnapshot.encode(_compiler, key, sourceBytes);

  /// Trusted snapshot metadata permits handing bytes to a worker before the
  /// first mutable playback graph is constructed there.
  static ({RasterScene scene, String key, int sourceBytes}) deferSnapshot(
    Uint8List bytes,
  ) {
    final header = _SceneSnapshot.header(bytes);
    return (
      scene: RasterScene._snapshotTemplate(bytes, header.metadata, true),
      key: header.metadata.key,
      sourceBytes: header.metadata.sourceBytes,
    );
  }

  static ({RasterScene scene, String key, int sourceBytes}) restoreSnapshot(
    Uint8List bytes, {
    bool warm = false,
  }) {
    final decoded = _SceneSnapshot.decode(bytes, warm: warm);
    return (
      scene: RasterScene._(decoded.compiler),
      key: decoded.key,
      sourceBytes: decoded.sourceBytes,
    );
  }

  void draw(Object canvas, double frame) =>
      _compiler.draw(canvas as Canvas, frame);
}

/// Draw into caller-owned pixels. [rowStride] is in pixels (not bytes) and
/// defaults to [width]. The allocation must hold rowStride * height pixels.
void renderSceneSoftware(
  RasterScene scene,
  double frame,
  NativePixelBuffer pixels,
  int width,
  int height,
  RasterWorkspace workspace, {
  int? rowStride,
}) => _renderSceneSoftware(
  scene._compiler,
  frame,
  pixels,
  width,
  height,
  workspace,
  rowStride: rowStride,
);
