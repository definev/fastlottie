// ignore_for_file: invalid_use_of_visible_for_testing_member, implementation_imports
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fastlottie/fastlottie.dart';
import 'package:fastlottie/src/bitstream_cache.dart';
import 'package:fastlottie/src/lz4.dart';
import 'package:fastlottie/src/snapshot_envelope.dart';
import 'package:fastlottie_example/tgs/compiled_pack.dart';
import 'package:fastlottie_example/tgs/network_store.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'pack survives model eviction and falls back on source or pack changes',
    () async {
      final source = File('assets/icon.json').readAsBytesSync();
      final composition = FastLottieComposition.fromBytes(source);
      final payload = packCompiledSnapshot(
        debugEncodeCompiledComposition(composition, sourceBytes: source.length),
        Lz4Scratch(),
      );
      final temporary = Directory.systemTemp.createTempSync('fastlottie-pack-');
      addTearDown(() => temporary.deleteSync(recursive: true));
      final file = File('${temporary.path}/models.flp');
      final header = ByteData(16)
        ..setUint32(0, 0x31504c46, Endian.little)
        ..setUint32(4, 1, Endian.little)
        ..setUint64(8, 16 + payload.length, Endian.little);
      final packed = Uint8List(16 + payload.length)
        ..setRange(0, 16, header.buffer.asUint8List())
        ..setRange(16, 16 + payload.length, payload);
      file.writeAsBytesSync(packed);
      final index = jsonEncode({
        'version': 1,
        'compiler': 'test',
        'bytes': packed.length,
        'entries': [
          [
            '/tgs/icon.tgs',
            16,
            payload.length,
            source.length,
            BitstreamStore.crc31(source, 0, source.length),
            BitstreamStore.crc31(payload, 0, payload.length),
          ],
        ],
      });
      final pack = CompiledModelPack.fromIndex(
        file.path,
        index,
        compiler: 'test',
      );
      expect(
        () => CompiledModelPack.fromIndex(file.path, index, compiler: 'old'),
        throwsFormatException,
      );
      expect(
        () => NetworkTgsStore(compiledPack: pack, maximumCompiledBytes: 1),
        throwsArgumentError,
      );
      var current = source;
      final store = NetworkTgsStore(
        compiledPack: pack,
        directPackPlayback: true,
        deferredPackPlayback: true,
        maximumEntries: 0,
        framePaced: false,
        fetcher: (_, {cancelToken, sourceCacheDirectory}) async =>
            FastLottieNetworkFetchResult(current, fromDiskCache: true),
      );
      addTearDown(store.dispose);
      Future<FastLottieComposition> load() async {
        final lease = store.acquire('http://localhost/tgs/icon.tgs');
        try {
          return (await lease.future).fast!;
        } finally {
          lease.release();
        }
      }

      final restored = await load();
      expect(restored.contentKey, composition.contentKey);
      expect(debugTakePreparedRasterScene(restored), isNotNull);
      expect(debugTakePreparedRasterScene(restored), isNull);
      expect((await load()).contentKey, composition.contentKey);
      expect(store.cached, 0);
      expect(store.packHits, 2);
      expect(store.directPlaybackModels, 2);
      expect(store.deferredPlaybackModels, 2);
      expect(store.packFallbacks, 0);
      expect(store.packReadBytes, payload.length * 2);
      expect(store.snapshotEncodes, 0);
      current = Uint8List.fromList(
        utf8.encode(utf8.decode(source).replaceFirst('"w":256', '"w":257')),
      );
      expect(current.length, source.length);
      final changedKey = FastLottieComposition.fromBytes(current).contentKey;
      expect(changedKey, isNot(composition.contentKey));
      expect((await load()).contentKey, changedKey);
      expect(store.packHits, 2);
      expect(store.packFallbacks, 1);
      current = source;
      file.writeAsBytesSync(
        Uint8List.fromList(packed)..[packed.length - 1] ^= 1,
      );
      expect((await load()).contentKey, composition.contentKey);
      expect(store.packFallbacks, 2);
      file.writeAsBytesSync([0]);
      expect((await load()).contentKey, composition.contentKey);
      expect(store.packFallbacks, 3);
      file.deleteSync();
      expect((await load()).contentKey, composition.contentKey);
      expect(store.packFallbacks, 4);
      expect(store.directPlaybackModels, 2);
      expect(store.deferredPlaybackModels, 2);
    },
  );
}
