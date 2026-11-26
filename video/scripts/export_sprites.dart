import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/src/platform/simd_stub.dart'
    if (dart.library.io) 'package:fastlottie/src/platform/simd_io.dart';
import 'package:fastlottie/src/raster/raster_core.dart';
import 'package:fastlottie/src/scene/options.dart';

/// Exports real animated sprite sheets directly from FastLottie's software
/// rasterizer into `video/public/sprites/*.png` via ffmpeg.
Future<void> main(List<String> args) async {
  final fixturesDir = args.isNotEmpty
      ? args[0]
      : '/Users/vsf/.gemini/antigravity/brain/795c4b2a-578b-413c-a964-86451ea37aab/scratch/matrix/fixtures';
  final outDir = Directory('video/public/sprites')..createSync(recursive: true);

  final specs =
      <({String name, String file, int frameSize, int cols, int rows})>[
        (
          name: 'phoenix',
          file: 'tgs_phoenix.json',
          frameSize: 256,
          cols: 10,
          rows: 6,
        ),
        (name: 'morph', file: 'morph.json', frameSize: 256, cols: 6, rows: 6),
        for (var i = 0; i < 16; i++)
          (
            name: 'emoji_$i',
            file: 'emoji_$i.json',
            frameSize: 160,
            cols: 6,
            rows: 4,
          ),
      ];

  final ws = RasterWorkspace();
  final manifest = <String, dynamic>{};

  for (final s in specs) {
    final file = File('$fixturesDir/${s.file}');
    if (!file.existsSync()) {
      stderr.writeln('Skipping missing fixture: ${file.path}');
      continue;
    }
    final bytes = file.readAsBytesSync();
    final scene = RasterScene.compileBytes(bytes, const FastLottieOptions());
    final totalFrames = s.cols * s.rows;
    final sheetW = s.cols * s.frameSize;
    final sheetH = s.rows * s.frameSize;
    final sheetRgba = Uint8List(sheetW * sheetH * 4);
    final pixelBuf = NativePixelBuffer(s.frameSize * s.frameSize);

    final span = (scene.end - scene.start).abs() < 1e-3
        ? 1.0
        : (scene.end - scene.start);
    for (var f = 0; f < totalFrames; f++) {
      final frameNo = scene.start + (f / totalFrames) * span;
      renderSceneSoftware(
        scene,
        frameNo,
        pixelBuf,
        s.frameSize,
        s.frameSize,
        ws,
      );

      final col = f % s.cols;
      final row = f ~/ s.cols;
      final ox = col * s.frameSize;
      final oy = row * s.frameSize;
      final src = pixelBuf.typedList;

      for (var y = 0; y < s.frameSize; y++) {
        final srcRow = y * s.frameSize;
        final dstRow = ((oy + y) * sheetW + ox) * 4;
        for (var x = 0; x < s.frameSize; x++) {
          final px = src[srcRow + x];
          final a = (px >>> 24) & 0xFF;
          if (a == 0) continue;
          int r = (px >>> 16) & 0xFF;
          int g = (px >>> 8) & 0xFF;
          int b = px & 0xFF;
          // Unpremultiply BGRA8888 -> straight RGBA8888
          if (a < 255) {
            r = ((r * 255 + (a >> 1)) ~/ a).clamp(0, 255);
            g = ((g * 255 + (a >> 1)) ~/ a).clamp(0, 255);
            b = ((b * 255 + (a >> 1)) ~/ a).clamp(0, 255);
          }
          final di = dstRow + x * 4;
          sheetRgba[di] = r;
          sheetRgba[di + 1] = g;
          sheetRgba[di + 2] = b;
          sheetRgba[di + 3] = a;
        }
      }
    }

    pixelBuf.dispose();
    scene.dispose();

    final outPng = '${outDir.path}/${s.name}.png';
    final proc = await Process.start('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-s',
      '${sheetW}x$sheetH',
      '-i',
      'pipe:0',
      '-compression_level',
      '6',
      outPng,
    ]);
    proc.stdin.add(sheetRgba);
    await proc.stdin.close();
    final rc = await proc.exitCode;
    if (rc != 0) {
      throw StateError('ffmpeg failed ($rc) for ${s.name}');
    }
    manifest[s.name] = {
      'src': '/public/sprites/${s.name}.png',
      'cols': s.cols,
      'rows': s.rows,
      'frames': totalFrames,
      'frameSize': s.frameSize,
      'fps': scene.fps,
    };
    stdout.writeln('Exported $outPng (${sheetW}x$sheetH, $totalFrames frames)');
  }

  File('${outDir.path}/manifest.json')
      .writeAsStringSync(const JsonEncoder.withIndent('  ').convert(manifest));
  stdout.writeln('All ${manifest.length} FastLottie sprite sheets exported!');
}
