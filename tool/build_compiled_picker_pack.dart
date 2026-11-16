// Use build_picker_pack_ios.sh for the release benchmark; direct invocations
// leave generated assets in example/assets for local diagnostics.
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/decoding.dart';
import 'package:fastlottie/src/bitstream_cache.dart';
import 'package:fastlottie/src/lz4.dart';
import 'package:fastlottie/src/options.dart';
import 'package:fastlottie/src/raster_core.dart';
import 'package:fastlottie/src/snapshot_envelope.dart';

void main(List<String> args) {
  if (args.length != 1 || !RegExp(r'^[a-f0-9]{64}$').hasMatch(args.single)) {
    throw ArgumentError('Expected the build compiler fingerprint (SHA-256)');
  }
  final bundled = File('example/pubspec.yaml')
      .readAsLinesSync()
      .map((line) => line.trim())
      .where((line) => line.startsWith('- assets/tgs/'))
      .map((line) => 'example/${line.substring(2)}')
      .toList();
  final files =
      Directory('example/assets/tgs')
          .listSync(recursive: true, followLinks: false)
          .whereType<File>()
          .where(
            (file) =>
                file.path.endsWith('.tgs') &&
                bundled.any(
                  (entry) => entry.endsWith('/')
                      ? file.path.startsWith(entry)
                      : file.path == entry,
                ),
          )
          .toList()
        ..sort((a, b) => a.path.compareTo(b.path));
  if (files.isEmpty) throw StateError('No bundled TGS files found');
  final output = File('example/assets/texture_picker_models.flp');
  final pending = File('${output.path}.tmp');
  final pack = pending.openSync(mode: FileMode.write);
  final index = <List<Object>>[];
  final scratch = Lz4Scratch();
  final json = const JsonCodec().fuse(utf8);
  var offset = 16, originalBytes = 0, rawBytes = 0;
  var unsupported = 0;
  try {
    pack.setPositionSync(offset);
    for (final file in files) {
      final source = file.readAsBytesSync();
      final RasterScene scene;
      final bytes = decodeLottieBytes(source);
      try {
        scene = RasterScene.compile(
          json.decode(bytes) as Map<String, dynamic>,
          const FastLottieOptions(),
        );
      } on UnsupportedLottieException {
        unsupported++;
        continue;
      }
      final snapshot = scene.snapshot(scene.contentKey, bytes.length);
      final payload = packCompiledSnapshot(snapshot, scratch);
      pack.writeFromSync(payload);
      index.add([
        '/${file.path.substring("example/assets/".length)}',
        offset,
        payload.length,
        source.length,
        BitstreamStore.crc31(source, 0, source.length),
        BitstreamStore.crc31(payload, 0, payload.length),
      ]);
      originalBytes += source.length;
      rawBytes += snapshot.length;
      offset += payload.length;
    }
    final header = ByteData(16)
      ..setUint32(0, 0x31504c46, Endian.little)
      ..setUint32(4, 1, Endian.little)
      ..setUint64(8, offset, Endian.little);
    pack
      ..setPositionSync(0)
      ..writeFromSync(header.buffer.asUint8List());
  } finally {
    pack.closeSync();
  }
  pending.renameSync(output.path);
  final metadata = jsonEncode({
    'version': 1,
    'compiler': args.single,
    'bytes': offset,
    'entries': index,
    'source_bytes': originalBytes,
    'uncompressed_bytes': rawBytes,
    'unsupported': unsupported,
  });
  File('${output.path}.json.tmp').writeAsStringSync(metadata);
  File('${output.path}.json.tmp').renameSync('${output.path}.json');
  stdout.writeln(
    'Compiled ${index.length}/${files.length} models, $originalBytes source bytes, '
    '$rawBytes graph bytes, $offset pack bytes, ${metadata.length} index bytes',
  );
}
