import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:lottie/lottie.dart';
// The pinned Lottie baseline exposes this context only through src.
// ignore: implementation_imports
import 'package:lottie/src/lottie_drawable.dart' show RenderCacheContext;

const _manifest = 'assets/complex_benchmark_fixtures.json';
const _port = 18789;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kReleaseMode) throw StateError('Use a Flutter release build');

  final key = GlobalKey();
  final surface = _Surface();
  runApp(
    Center(
      child: SizedBox.expand(
        child: CustomPaint(key: key, painter: _Painter(surface)),
      ),
    ),
  );
  await WidgetsBinding.instance.endOfFrame;
  final box = key.currentContext!.findRenderObject()! as RenderBox;
  final view = ui.PlatformDispatcher.instance.views.single;
  final control = await _Control.start();
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    control.fail(details.exception, details.stack);
  };
  try {
    final config = await control.configuration.future;
    await _run(config, control, surface, box, view);
    control.done = true;
  } catch (error, stack) {
    control.fail(error, stack);
  }
}

typedef _Configuration = ({
  String fixture,
  String renderer,
  String cache,
  int instances,
  int edge,
  int cycles,
});

class _Control {
  final configuration = Completer<_Configuration>();
  Completer<void>? _acknowledged;
  Map<String, Object?>? _checkpoint;
  int _sequence = 0;
  bool done = false;
  String? error;
  Map<String, Object?>? probe;

  static Future<_Control> start() async {
    final control = _Control();
    final server = await HttpServer.bind(InternetAddress.loopbackIPv4, _port);
    server.listen(control._respond);
    return control;
  }

  void fail(Object exception, StackTrace? stack) {
    error ??= '$exception\n${stack ?? ''}';
    stderr.writeln(error);
  }

  Future<void> _respond(HttpRequest request) async {
    final response = request.response;
    final args = request.uri.queryParameters;
    try {
      switch (request.uri.path) {
        case '/configure':
          if (configuration.isCompleted) {
            throw StateError('Benchmark already configured');
          }
          final config = (
            fixture: args['fixture']!,
            renderer: args['renderer']!,
            cache: args['cache']!,
            instances: int.parse(args['instances']!),
            edge: int.parse(args['edge']!),
            cycles: int.parse(args['cycles']!),
          );
          if (!['fastlottie', 'lottie'].contains(config.renderer) ||
              !['vector', 'picture'].contains(config.cache) ||
              ![1, 9].contains(config.instances) ||
              config.edge < 1 ||
              config.cycles < 1) {
            throw ArgumentError('Invalid benchmark configuration: $config');
          }
          configuration.complete(config);
        case '/continue':
          if (args['sequence'] != '$_sequence' || _acknowledged == null) {
            throw StateError('Wrong checkpoint acknowledgement');
          }
          final pending = _acknowledged!;
          _acknowledged = null;
          pending.complete();
        case '/status':
          break;
        default:
          response.statusCode = HttpStatus.notFound;
      }
    } catch (exception) {
      response.statusCode = HttpStatus.badRequest;
      response.write(exception);
      await response.close();
      return;
    }
    response.headers.contentType = ContentType.json;
    response.write(
      jsonEncode({
        'pid': pid,
        'sequence': _sequence,
        'checkpoint': _checkpoint,
        'error': error,
        'done': done,
        'probe': probe,
      }),
    );
    await response.close();
  }

  Future<void> checkpoint(
    String phase,
    int cycle, [
    Map<String, Object?> values = const {},
  ]) async {
    _checkpoint = {'phase': phase, 'cycle': cycle, ...values};
    _sequence++;
    final pending = Completer<void>();
    _acknowledged = pending;
    await pending.future.timeout(const Duration(minutes: 2));
  }
}

Future<void> _run(
  _Configuration config,
  _Control control,
  _Surface surface,
  RenderBox box,
  ui.FlutterView view,
) async {
  final manifest = jsonDecode(await rootBundle.loadString(_manifest)) as Map;
  final asset = manifest[config.fixture] as String?;
  if (asset == null) throw ArgumentError('Unknown fixture: ${config.fixture}');
  final edge = math.min(box.size.shortestSide, config.edge.toDouble());
  final refresh = view.display.refreshRate;
  final dpr = view.devicePixelRatio;
  await control.checkpoint('baseline', 0, {
    'asset': asset,
    'window_logical': [box.size.width, box.size.height],
    'surface_edge_logical': edge,
    'cell_edge_physical': edge * dpr / (config.instances == 1 ? 1 : 3),
    'dpr': dpr,
    'refresh_hz': refresh,
  });
  await _measurePlayback(config, control, surface, box, view, asset, edge);
  await Future<void>.delayed(const Duration(milliseconds: 650));
  await control.checkpoint('settled', config.cycles);

  // Readback allocates images and synchronizes the GPU. Do it after all samples.
  final (model, _) = await _load(asset, config.renderer);
  control.probe = await _probe(model, config, box, dpr, surface.frameCount);
}

Future<(Object, Map<String, int>)> _load(String asset, String renderer) async {
  final source = await rootBundle.load(asset);
  final bytes = source.buffer.asUint8List(
    source.offsetInBytes,
    source.lengthInBytes,
  );
  final timer = Stopwatch()..start();
  final decoded = decodeLottieBytes(bytes);
  final inflateUs = timer.elapsedMicroseconds;
  final model = renderer == 'fastlottie'
      ? FastLottieComposition.fromBytes(decoded)
      : LottieComposition.parseJsonBytes(decoded);
  return (
    model,
    {
      'source_bytes': bytes.length,
      'json_bytes': decoded.length,
      'inflate_us': inflateUs,
      'parse_compile_us': timer.elapsedMicroseconds - inflateUs,
    },
  );
}

Future<void> _measurePlayback(
  _Configuration config,
  _Control control,
  _Surface surface,
  RenderBox box,
  ui.FlutterView view,
  String asset,
  double edge,
) async {
  final (model, loadStats) = await _load(asset, config.renderer);
  final (frameCount, frameRate) = switch (model) {
    FastLottieComposition c => (c.frameCount, c.frameRate),
    LottieComposition c => (
      (c.durationFrames + .01 - 1e-7).ceil(),
      c.frameRate,
    ),
    _ => throw StateError('No loaded composition'),
  };
  if (frameCount < 2) throw StateError('Expected an animated composition');
  await control.checkpoint('loaded', 0, {
    ...loadStats,
    'source_frames': frameCount,
    'source_fps': frameRate,
  });

  surface.edge = edge;
  surface.frameCount = frameCount;
  final refresh = view.display.refreshRate;
  final dpr = view.devicePixelRatio;
  for (var cycle = 1; cycle <= config.cycles; cycle++) {
    final timer = Stopwatch()..start();
    surface.slots = _createSlots(model, config, box, dpr, config.instances);
    final createUs = timer.elapsedMicroseconds;
    try {
      final first = await surface.measure(1);
      await control.checkpoint('first_frame', cycle, {
        'create_players_us': createUs,
        'timing': _statistics(first, refresh),
      });
      final steady = await surface.measure(2 * frameCount, skip: frameCount);
      await control.checkpoint('steady', cycle, {
        'timing': _statistics(steady, refresh),
        'frames': [for (final frame in steady) frame.toJson()],
        if (config.renderer == 'fastlottie')
          'cache': [for (final slot in surface.slots) slot.cacheStats!()],
      });
    } finally {
      for (final slot in surface.slots) {
        slot.dispose();
      }
      surface.slots = [];
      surface.repaint();
      await WidgetsBinding.instance.endOfFrame;
    }
    await Future<void>.delayed(const Duration(milliseconds: 650));
    await control.checkpoint('released', cycle);
  }
}

typedef _Slot = ({
  void Function(Canvas, Rect, int) draw,
  VoidCallback dispose,
  Map<String, int> Function()? cacheStats,
});

List<_Slot> _createSlots(
  Object model,
  _Configuration config,
  RenderBox box,
  double dpr,
  int count,
) => [
  for (var i = 0; i < count; i++)
    switch (model) {
      FastLottieComposition c => _fastSlot(c, config.cache, dpr),
      LottieComposition c => _lottieSlot(c, config.cache, box, dpr),
      _ => throw StateError('No loaded composition'),
    },
];

_Slot _fastSlot(FastLottieComposition composition, String cache, double dpr) {
  final player = FastLottiePlayer(
    composition,
    cache: cache == 'picture' ? const FastLottieCache() : FastLottieCache.none,
  );
  final span = composition.endFrame - composition.startFrame;
  return (
    draw: (canvas, rect, frame) =>
        player.draw(canvas, rect, frame / span, devicePixelRatio: dpr),
    dispose: player.dispose,
    cacheStats: () => {
      'pictures': player.cachedFrames,
      'hits': player.cacheHits,
      'misses': player.cacheMisses,
    },
  );
}

_Slot _lottieSlot(
  LottieComposition composition,
  String cache,
  RenderBox box,
  double dpr,
) {
  final drawable = LottieDrawable(
    composition,
    frameRate: FrameRate.composition,
  );
  final config = cache == 'picture' ? RenderCache.drawingCommands : null;
  final owner = Object();
  final handle = config?.acquire(owner);
  final context = handle == null
      ? null
      : RenderCacheContext(
          cache: handle,
          renderBox: box,
          devicePixelRatio: dpr,
        );
  return (
    draw: (canvas, rect, frame) {
      drawable.setProgress(frame / composition.durationFrames);
      drawable.draw(canvas, rect, fit: BoxFit.contain, renderCache: context);
    },
    dispose: () => config?.release(owner),
    cacheStats: null,
  );
}

Future<Map<String, Object?>> _probe(
  Object model,
  _Configuration config,
  RenderBox box,
  double dpr,
  int frameCount,
) async {
  final slot = _createSlots(model, config, box, dpr, 1).single;
  try {
    const edge = 96;
    final samples = <Map<String, int>>[];
    for (final frame in [0, frameCount ~/ 3, 2 * frameCount ~/ 3]) {
      final recorder = ui.PictureRecorder();
      slot.draw(Canvas(recorder), const Rect.fromLTWH(0, 0, 96, 96), frame);
      final picture = recorder.endRecording();
      try {
        final image = await picture.toImage(edge, edge);
        try {
          final pixels = (await image.toByteData())!;
          var visible = 0;
          var checksum = 0x811c9dc5;
          for (var i = 0; i < pixels.lengthInBytes; i += 4) {
            if (pixels.getUint8(i + 3) != 0) visible++;
            checksum =
                ((checksum ^ pixels.getUint32(i)) * 0x01000193) & 0xffffffff;
          }
          samples.add({
            'frame': frame,
            'visible_pixels': visible,
            'checksum': checksum,
          });
        } finally {
          image.dispose();
        }
      } finally {
        picture.dispose();
      }
    }
    if (samples.every((s) => s['visible_pixels'] == 0) ||
        samples.map((s) => s['checksum']).toSet().length < 2) {
      throw StateError('Fixture produced no visible animation: $samples');
    }
    return {'edge': edge, 'samples': samples};
  } finally {
    slot.dispose();
  }
}

typedef _Frame = ({ui.FrameTiming timing, int paintUs});

extension on _Frame {
  Map<String, int> toJson() => {
    'number': timing.frameNumber,
    'vsync_us': timing.timestampInMicroseconds(ui.FramePhase.vsyncStart),
    'paint_us': paintUs,
    'build_us': timing.buildDuration.inMicroseconds,
    'raster_us': timing.rasterDuration.inMicroseconds,
    'total_us': timing.totalSpan.inMicroseconds,
  };
}

Map<String, Object?> _statistics(List<_Frame> frames, double refresh) {
  final budget = 1000000 / refresh;
  final values = [for (final frame in frames) frame.toJson()];
  return {
    'samples': frames.length,
    for (final metric in ['paint_us', 'build_us', 'raster_us', 'total_us'])
      metric: _percentiles([for (final value in values) value[metric]!]),
    'budget_us': budget,
    'over_budget_total': values.where((v) => v['total_us']! > budget).length,
    'over_budget_stage': values
        .where((v) => v['build_us']! > budget || v['raster_us']! > budget)
        .length,
    if (frames.length > 1)
      'submitted_fps':
          (frames.length - 1) *
          1000000 /
          (values.last['vsync_us']! - values.first['vsync_us']!),
  };
}

Map<String, int> _percentiles(List<int> values) {
  values.sort();
  return {
    for (final p in [50, 95, 99])
      'p$p': values[(values.length * p / 100).ceil() - 1],
  };
}

class _Surface extends ChangeNotifier {
  List<_Slot> slots = [];
  double edge = 0;
  int frameCount = 0;
  int _step = 0;
  Map<int, int>? _paintTimes;

  void repaint() => notifyListeners();

  Future<List<_Frame>> measure(int count, {int skip = 0}) async {
    final completed = Completer<List<_Frame>>();
    final paintTimes = _paintTimes = <int, int>{};
    final frames = <_Frame>[];
    final scheduler = SchedulerBinding.instance;
    void onTimings(List<ui.FrameTiming> batch) {
      for (final timing in batch) {
        final paintUs = paintTimes.remove(timing.frameNumber);
        if (paintUs == null) continue;
        frames.add((timing: timing, paintUs: paintUs));
        if (frames.length == count) completed.complete(frames.sublist(skip));
      }
    }

    var next = 0;
    late final Ticker ticker;
    ticker = Ticker((_) {
      _step = next++;
      if (next == count) ticker.stop();
      repaint();
    });
    scheduler.addTimingsCallback(onTimings);
    ticker.start();
    try {
      return await completed.future.timeout(
        const Duration(seconds: 45),
        onTimeout: () {
          throw StateError(
            'FrameTiming timeout: ${frames.length}/$count matched frames',
          );
        },
      );
    } finally {
      ticker.dispose();
      scheduler.removeTimingsCallback(onTimings);
      _paintTimes = null;
    }
  }

  void paint(Canvas canvas, Size size) {
    canvas.drawColor(const Color(0xffeeeeee), BlendMode.src);
    if (slots.isEmpty) return;
    final columns = slots.length == 1 ? 1 : 3;
    final cell = edge / columns;
    final left = (size.width - edge) / 2;
    final top = (size.height - edge) / 2;
    final timer = Stopwatch()..start();
    for (var i = 0; i < slots.length; i++) {
      final rect = Rect.fromLTWH(
        left + (i % columns) * cell,
        top + (i ~/ columns) * cell,
        cell,
        cell,
      );
      final frame = (_step + i * frameCount ~/ slots.length) % frameCount;
      canvas.save();
      canvas.clipRect(rect);
      slots[i].draw(canvas, rect, frame);
      canvas.restore();
    }
    final frameNumber = ui.PlatformDispatcher.instance.frameData.frameNumber;
    _paintTimes?[frameNumber] = timer.elapsedMicroseconds;
  }
}

class _Painter extends CustomPainter {
  _Painter(this.surface) : super(repaint: surface);
  final _Surface surface;

  @override
  void paint(Canvas canvas, Size size) => surface.paint(canvas, size);

  @override
  bool shouldRepaint(_Painter oldDelegate) => oldDelegate.surface != surface;
}
