import 'dart:async';
import 'dart:convert';
import 'dart:typed_data' show BytesBuilder;

import 'package:crypto/crypto.dart';
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import 'network_server_types.dart';
import 'pack_disk_stub.dart' if (dart.library.io) 'pack_disk_io.dart' as disk;

const _directory = 'assets/emoji_posters';
const _catalogPath = '/v1/catalog';
const _limit = Duration(seconds: 8);

/// Loads the same manifest contract from bundled assets and from a pack server.
/// Callers pass asset references and share cache and cancellation policy.
class PackAssets {
  PackAssets({AssetBundle? bundle}) : _bundle = bundle ?? rootBundle;

  final AssetBundle _bundle;
  http.Client? _client;
  http.Client get _http => _client ??= http.Client();
  final _pages = <String, Future<ByteData>>{};
  late final _objects = _loadBundledObjects();
  final _remoteAnimation = <Completer<void>>{};
  final _abortRequests = <void Function()>{};
  int _runningAnimations = 0;
  bool _disposed = false;
  String? cacheDirectory;

  static final bundleOrigin = Uri(scheme: 'asset', host: 'bundle');
  static final _objectPath = RegExp(r'^/objects/([0-9a-f]{64})\.(png|tgs)$');

  Future<Map<String, dynamic>> _loadBundledObjects() async =>
      jsonDecode(await _bundle.loadString('$_directory/objects.json'))
          as Map<String, dynamic>;

  String _catalogKey(Uri origin) =>
      'catalog-${sha256.convert(utf8.encode(origin.resolve(_catalogPath).toString()))}';

  Future<Map<String, dynamic>?> _cachedDescriptor(Uri origin) async {
    final bytes = await disk.read(cacheDirectory, _catalogKey(origin));
    try {
      return bytes == null
          ? null
          : jsonDecode(utf8.decode(bytes)) as Map<String, dynamic>;
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    }
  }

  /// Opens the last complete catalog without making any network requests.
  Future<TgsRemoteCatalog?> cachedCatalog(Uri origin) async {
    final saved = await _cachedDescriptor(origin);
    if (saved == null) return null;
    try {
      return await _catalogFromDescriptor(
        origin,
        saved['catalog'] as Map<String, dynamic>,
        cacheOnly: true,
      );
    } on FormatException {
      return null;
    } on TypeError {
      return null;
    }
  }

  Future<TgsRemoteCatalog> catalog(Uri origin) async {
    Map<String, dynamic>? descriptor;
    if (origin.scheme == 'asset') {
      descriptor = jsonDecode(
        await _bundle.loadString('$_directory/catalog.json'),
      ) as Map<String, dynamic>;
    } else {
      final uri = origin.resolve(_catalogPath);
      final key = _catalogKey(origin);
      final previous = await _cachedDescriptor(origin);
      try {
        final response = await _download(
          uri,
          etag: previous?['etag'] as String?,
        );
        if (response.status == 304 && previous != null) {
          descriptor = previous['catalog'] as Map<String, dynamic>;
        } else if (response.status == 200) {
          descriptor =
              jsonDecode(utf8.decode(response.bytes)) as Map<String, dynamic>;
          final result = await _catalogFromDescriptor(origin, descriptor);
          await disk.write(
            cacheDirectory,
            key,
            Uint8List.fromList(
              utf8.encode(
                jsonEncode({'etag': response.etag, 'catalog': descriptor}),
              ),
            ),
          );
          return result;
        } else {
          throw FastLottieNetworkException(
            uri,
            'Pack catalog unavailable',
            statusCode: response.status,
          );
        }
      } on Exception {
        if (previous == null) rethrow;
        descriptor = previous['catalog'] as Map<String, dynamic>;
      }
    }
    return _catalogFromDescriptor(origin, descriptor);
  }

  Future<TgsRemoteCatalog> _catalogFromDescriptor(
    Uri origin,
    Map<String, dynamic> descriptor, {
    bool cacheOnly = false,
  }) async {
    if (descriptor['version'] != 1) {
      throw const FormatException('Unknown pack catalog version');
    }
    final summaries = descriptor['packs'] as List;
    final packs = <TgsRemotePack>[];
    const concurrency = 4;
    for (var start = 0; start < summaries.length; start += concurrency) {
      packs.addAll(
        await Future.wait([
          for (final summary in summaries.skip(start).take(concurrency))
            _manifest(
              origin,
              summary as Map<String, dynamic>,
              cacheOnly: cacheOnly,
            ),
        ]),
      );
    }
    return TgsRemoteCatalog.fromPacks(origin, packs);
  }

  Future<TgsRemotePack> _manifest(
    Uri origin,
    Map<String, dynamic> summary, {
    required bool cacheOnly,
  }) async {
    final uri = origin.resolve(summary['manifest'] as String);
    final revision = summary['revision'] as String;
    final key = 'manifest-${sha256.convert(utf8.encode(uri.toString()))}';
    final bundled = origin.scheme == 'asset';
    final cached = bundled ? null : await disk.read(cacheDirectory, key);
    if (cacheOnly && cached == null) {
      throw const FormatException('Cached pack manifest is missing');
    }
    final bytes =
        cached ??
        (bundled
            ? Uint8List.sublistView(
                await _bundle.load('$_directory${uri.path}'),
              )
            : (await _download(uri)).bytes);
    final json = jsonDecode(utf8.decode(bytes)) as Map<String, dynamic>;
    if (json['id'] != summary['id'] || json['revision'] != revision) {
      throw const FormatException('Pack manifest revision mismatch');
    }
    final pack = TgsRemotePack.fromJson(json, origin);
    if (!bundled && cached == null) {
      await disk.write(cacheDirectory, key, bytes);
    }
    return pack;
  }

  Future<FastLottieNetworkFetchResult> fetch(
    Uri uri, {
    FastLottieCancelToken? cancelToken,
    String? sourceCacheDirectory,
  }) async {
    if (_disposed) throw const FastLottieNetworkCancelledException();
    _checkCancelled(cancelToken);
    final object = _objectPath.firstMatch(uri.path);
    if (uri.scheme == 'asset') {
      final Uint8List bytes;
      if (object != null) {
        final files = await _objects;
        final entry = files[uri.path] as Map<String, dynamic>?;
        if (entry == null) throw FormatException('Unknown bundled object $uri');
        if (entry['asset'] case final String asset) {
          bytes = Uint8List.sublistView(await _bundle.load(asset));
        } else {
          final page = entry['page'] as String;
          final load = _pages.remove(page) ?? _bundle.load('$_directory/$page');
          _pages[page] = load;
          // All interleaves five sticker packs. Keep one page per pack so
          // the next row can reuse the pages just read for the previous row.
          if (_pages.length > 5) _pages.remove(_pages.keys.first);
          final data = await load;
          final offset = entry['offset'] as int;
          bytes = Uint8List.sublistView(
            data,
            offset,
            offset + (entry['length'] as int),
          );
        }
      } else {
        bytes = Uint8List.sublistView(
          await _bundle.load(uri.pathSegments.join('/')),
        );
      }
      _checkCancelled(cancelToken);
      return FastLottieNetworkFetchResult(bytes, fromDiskCache: false);
    }
    if (object == null && !kIsWeb) {
      return FastLottieComposition.fetchNetworkBytes(
        uri,
        cancelToken: cancelToken,
        sourceCacheDirectory: sourceCacheDirectory,
      );
    }
    final digest = object?[1];
    final limit = object?[2] == 'png' ? 1024 * 1024 : 16 * 1024 * 1024;
    if (digest != null) {
      final cached = await disk.read(
        cacheDirectory,
        digest,
        maximumBytes: limit,
      );
      _checkCancelled(cancelToken);
      if (cached != null && sha256.convert(cached).toString() == digest) {
        return FastLottieNetworkFetchResult(cached, fromDiskCache: true);
      }
    }
    final isAnimation = object?[2] == 'tgs';
    if (isAnimation) await _takeAnimationSlot(cancelToken);
    final Uint8List bytes;
    try {
      bytes = (await _download(
        uri,
        cancelToken: cancelToken,
        maximumBytes: limit,
      )).bytes;
    } finally {
      if (isAnimation) _releaseAnimationSlot();
    }
    if (digest != null) {
      if (sha256.convert(bytes).toString() != digest) {
        throw FormatException('Downloaded content does not match $uri');
      }
      unawaited(disk.write(cacheDirectory, digest, bytes));
    }
    return FastLottieNetworkFetchResult(bytes, fromDiskCache: false);
  }

  // Keep transport capacity available for the independently bounded poster
  // queue. No animation transfer occupies a slot on disk or bundle hits.
  Future<void> _takeAnimationSlot(FastLottieCancelToken? token) async {
    _checkCancelled(token);
    if (_runningAnimations < 4) {
      _runningAnimations++;
      return;
    }
    final slot = Completer<void>();
    _remoteAnimation.add(slot);
    void cancel() {
      if (_remoteAnimation.remove(slot)) {
        slot.completeError(const FastLottieNetworkCancelledException());
      }
    }

    token?.addCancelListener(cancel);
    try {
      await slot.future;
    } finally {
      token?.removeCancelListener(cancel);
    }
  }

  void _releaseAnimationSlot() {
    if (_remoteAnimation.isEmpty) {
      _runningAnimations--;
    } else {
      final next = _remoteAnimation.first;
      _remoteAnimation.remove(next);
      next.complete();
    }
  }

  Future<({Uint8List bytes, int status, String? etag})> _download(
    Uri uri, {
    FastLottieCancelToken? cancelToken,
    int maximumBytes = 2 * 1024 * 1024,
    String? etag,
  }) async {
    if (_disposed) throw const FastLottieNetworkCancelledException();
    final aborted = Completer<void>();
    Timer? timer;
    void abort() {
      timer?.cancel();
      if (!aborted.isCompleted) aborted.complete();
    }

    _abortRequests.add(abort);
    timer = Timer(_limit, abort);
    cancelToken?.addCancelListener(abort);
    try {
      _checkCancelled(cancelToken);
      final request = http.AbortableRequest(
        'GET',
        uri,
        abortTrigger: aborted.future,
      );
      if (etag != null) request.headers['If-None-Match'] = etag;
      final response = await _http.send(request);
      final status = response.statusCode;
      final validator = response.headers['etag'];
      if (status == 304 && etag != null) {
        await response.stream.drain<void>();
        return (bytes: Uint8List(0), status: status, etag: validator);
      }
      if (response.statusCode != 200) {
        abort();
        throw FastLottieNetworkException(
          uri,
          'Pack resource unavailable',
          statusCode: response.statusCode,
        );
      }
      final bytes = BytesBuilder(copy: false);
      await for (final chunk in response.stream) {
        if (bytes.length + chunk.length > maximumBytes) {
          abort();
          throw FormatException('Pack resource exceeds byte limit $uri');
        }
        bytes.add(chunk);
      }
      _checkCancelled(cancelToken);
      return (bytes: bytes.takeBytes(), status: status, etag: validator);
    } on http.RequestAbortedException {
      _checkCancelled(cancelToken);
      throw FastLottieNetworkException(uri, 'Pack resource timed out');
    } finally {
      timer.cancel();
      _abortRequests.remove(abort);
      cancelToken?.removeCancelListener(abort);
    }
  }

  void clearIdle() => _pages.clear();

  Future<void> clearDisk() => disk.clear(cacheDirectory);

  void dispose() {
    _disposed = true;
    for (final abort in _abortRequests) {
      abort();
    }
    _abortRequests.clear();
    for (final request in _remoteAnimation) {
      request.completeError(const FastLottieNetworkCancelledException());
    }
    _remoteAnimation.clear();
    _client?.close();
    clearIdle();
  }
}

void _checkCancelled(FastLottieCancelToken? token) {
  if (token?.isCancelled ?? false) {
    throw const FastLottieNetworkCancelledException();
  }
}
