// ignore_for_file: avoid_print, implementation_imports
import 'dart:convert';

import 'package:fastlottie/decoding.dart';
import 'package:fastlottie/src/options.dart';
import 'package:fastlottie/src/raster_core.dart';
import 'package:fastlottie/src/simd_stub.dart'
    if (dart.library.ffi) 'package:fastlottie/src/simd_io.dart'
    if (dart.library.js_interop) 'package:fastlottie/src/simd_wasm.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

const _size = 128;
const _rounds = 192;
const _warmup = 64;

Future<RasterScene> _emoji(String id) async {
  final data = await rootBundle.load('assets/tgs/NotoEmoji/emoji_u$id.tgs');
  final json = jsonDecode(
    utf8.decode(
      decodeLottieBytes(
        data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
      ),
    ),
  );
  return RasterScene.compile(
    json as Map<String, dynamic>,
    const FastLottieOptions(),
  );
}

Map<String, num> _measure(
  List<RasterScene> resident,
  List<RasterScene> transient,
  void Function(RasterWorkspace, RasterScene) release,
) {
  final workspace = RasterWorkspace();
  final pixels = NativePixelBuffer(_size * _size);
  try {
    final watch = Stopwatch();
    final samples = <int>[];
    var checksum = 0;
    void render(RasterScene scene, int tick) {
      final length = (scene.end - scene.start).floor();
      renderSceneSoftware(
        scene,
        scene.start + tick % length,
        pixels,
        _size,
        _size,
        workspace,
      );
    }

    for (var tick = -_warmup; tick < _rounds; tick++) {
      final leaving = transient[tick % transient.length];
      watch
        ..reset()
        ..start();
      render(leaving, tick);
      release(workspace, leaving);
      for (var i = 0; i < resident.length; i++) {
        render(resident[i], tick + i * 13);
      }
      watch.stop();
      if (tick < 0) continue;
      samples.add(watch.elapsedTicks);
      // Sample outside the measured window to check comparable output.
      checksum =
          (checksum * 31 +
              pixels.typedList[(tick * 997) % pixels.typedList.length]) &
          0x7fffffff;
    }
    samples.sort();
    double percentile(double p) =>
        samples[(samples.length * p).ceil() - 1] * 1e6 / watch.frequency;
    return {
      'median_us': percentile(.5),
      'p95_us': percentile(.95),
      'coverage_bytes': workspace.retainedCoverageBytes,
      'checksum': checksum,
    };
  } finally {
    workspace.dispose();
    pixels.dispose();
  }
}

Future<void> _run() async {
  final resident = await Future.wait([
    for (final id in ['1f9cb', '1f41c', '1f426_200d_1f525', '1f393'])
      _emoji(id),
  ]);
  final transient = await Future.wait([
    for (final id in ['1f30b', '1f345', '1f389', '1f52e']) _emoji(id),
  ]);
  final results = <String, List<Map<String, num>>>{
    'reset_all': [],
    'release_scene': [],
  };
  for (var pass = 0; pass < 6; pass++) {
    final policies = results.keys.toList();
    for (final policy in pass.isEven ? policies : policies.reversed) {
      results[policy]!.add(
        _measure(
          resident.map((scene) => scene.fork()).toList(),
          transient.map((scene) => scene.fork()).toList(),
          policy == 'release_scene'
              ? (workspace, scene) => workspace.releaseScene(scene)
              : (workspace, _) => workspace.resetCaches(),
        ),
      );
      print(
        'FASTLOTTIE_SCENE_CACHE_SAMPLE:${jsonEncode({'policy': policy, 'pass': pass + 1, ...results[policy]!.last})}',
      );
    }
  }
  if (results.values
          .expand((runs) => runs)
          .map((run) => run['checksum'])
          .toSet()
          .length !=
      1) {
    throw StateError('Cache policies produced different pixels');
  }
  print(
    'FASTLOTTIE_SCENE_CACHE:${jsonEncode({'release': kReleaseMode, 'native': isSimdSupported, 'size': _size, 'rounds': _rounds})}',
  );
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const Directionality(
      textDirection: TextDirection.ltr,
      child: Center(child: Text('FastLottie scene cache benchmark')),
    ),
  );
  WidgetsBinding.instance.addPostFrameCallback((_) async {
    try {
      await _run();
    } catch (error, stack) {
      print('FASTLOTTIE_SCENE_CACHE_ERROR:$error\n$stack');
    }
  });
}
