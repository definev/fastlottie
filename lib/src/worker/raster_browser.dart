import 'dart:async';
import 'dart:developer' as developer;
import 'dart:js_interop';
import 'dart:ui_web' as ui_web;

import 'package:flutter/services.dart';
import 'package:web/web.dart' as web;

import '../platform/isolate_stub.dart';
import '../platform/simd_web.dart';
import 'raster_web_protocol.dart';
import 'web_worker_url.dart';

int browserRasterWorkerCount(int? override) {
  if (const bool.fromEnvironment('FASTLOTTIE_DISABLE_WEB_WORKER')) return 1;
  return override?.clamp(1, 2) ??
      (web.window.navigator.hardwareConcurrency >= 4 ? 2 : 1);
}

(web.Worker, String?) _createBrowserWorker(
  Uri pageUri,
  Uri workerUri,
  String name,
) {
  final workerUrl = workerUri.toString();
  if (!isCrossOriginWorkerUri(pageUri, workerUri)) {
    try {
      return (web.Worker(workerUrl.toJS, web.WorkerOptions(name: name)), null);
    } catch (_) {
      // Fall back to a same-origin Blob shim if direct construction is blocked
      // (for example, opaque origins or cross-origin asset redirects).
    }
  }
  final shim = buildCrossOriginWorkerShim(workerUrl);
  final blob = web.Blob(
    [shim.toJS].toJS,
    web.BlobPropertyBag(type: 'application/javascript'),
  );
  final blobUrl = web.URL.createObjectURL(blob);
  try {
    final worker = web.Worker(blobUrl.toJS, web.WorkerOptions(name: name));
    return (worker, blobUrl);
  } catch (_) {
    web.URL.revokeObjectURL(blobUrl);
    rethrow;
  }
}

WorkerHandle? startBrowserRasterWorker(String name) {
  if (const bool.fromEnvironment('FASTLOTTIE_DISABLE_WEB_WORKER')) return null;
  try {
    final baseUri = web.document.baseURI;
    final pageHref = web.window.location.href;
    final pageUri = Uri.parse(pageHref.isNotEmpty ? pageHref : baseUri);
    Uri assetUri(String asset) =>
        resolveBrowserAssetUri(baseUri, ui_web.assetManager.getAssetUrl(asset));
    final (worker, blobUrl) = _createBrowserWorker(
      pageUri,
      assetUri(webWorkerAsset),
      name,
    );
    return _BrowserRasterWorker(worker, () async {
      final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
      return assetUri(
        manifest.listAssets().contains(generatedWasmAsset)
            ? generatedWasmAsset
            : bundledWasmAsset,
      ).toString();
    }, blobUrl);
  } catch (error, stack) {
    _logFallback(error, stack);
    return null;
  }
}

void _logFallback(Object error, StackTrace? stack) {
  developer.log(
    'FastLottie Web Worker unavailable. Rasterizing inline.',
    name: 'fastlottie',
    error: error,
    stackTrace: stack,
  );
}

bool isBrowserRasterWorker(WorkerHandle handle) =>
    handle is _BrowserRasterWorker;
bool browserRasterWorkerUsesWasm(WorkerHandle handle) =>
    handle is _BrowserRasterWorker && handle.usesWasm;

final class _BrowserRasterWorker implements WorkerHandle {
  _BrowserRasterWorker(
    this._worker,
    Future<String> Function() wasmUrl, [
    this._blobUrl,
  ]) {
    _worker.onmessage = ((web.MessageEvent event) {
      try {
        final reply = WorkerMessage(event.data);
        if (reply.op == workerFailed) throw StateError(reply.s(1));
        if (!_ready) {
          if (reply.op != workerReady) {
            throw StateError('Incompatible FastLottie Web Worker');
          }
          _ready = true;
          usesWasm = reply.b(1);
          _startup.cancel();
          _revokeBlobUrl();
          for (final request in _queued) {
            _send(request);
          }
          _queued.clear();
        } else {
          _messages.add(reply.decodeReply());
        }
      } catch (error, stack) {
        _fail(error, stack);
      }
    }).toJS;
    _worker.onerror = ((web.Event event) {
      event.preventDefault();
      _fail(StateError('FastLottie Web Worker failed to load or run'));
    }).toJS;
    _worker.onmessageerror = ((web.MessageEvent _) {
      _fail(StateError('Could not deserialize a FastLottie Web Worker reply'));
    }).toJS;
    _startup = Timer(const Duration(seconds: 5), () {
      _fail(TimeoutException('FastLottie Web Worker startup'));
    });
    unawaited(_initialize(wasmUrl));
  }

  Future<void> _initialize(Future<String> Function() wasmUrl) async {
    try {
      final url = await wasmUrl();
      if (_disposed) return;
      final (data, transfer) = encodeWorkerMessage([workerInit, url]);
      _worker.postMessage(data, transfer);
    } catch (error, stack) {
      _fail(error, stack);
    }
  }

  final web.Worker _worker;
  String? _blobUrl;
  final _messages = StreamController<Object?>();
  final _queued = <Object?>[];
  late final Timer _startup;
  bool _ready = false;
  bool _disposed = false;
  bool usesWasm = false;

  void _revokeBlobUrl() {
    final url = _blobUrl;
    if (url != null) {
      _blobUrl = null;
      web.URL.revokeObjectURL(url);
    }
  }

  @override
  Stream<Object?> get messages => _messages.stream;

  void _send(Object? request) {
    final (data, transfer) = encodeRequest(request);
    _worker.postMessage(data, transfer);
  }

  @override
  void send(Object? request) {
    if (_disposed) return;
    if (!_ready) {
      _queued.add(request);
      return;
    }
    try {
      _send(request);
    } catch (error, stack) {
      _fail(error, stack);
    }
  }

  void _fail(Object error, [StackTrace? stack]) {
    if (_disposed) return;
    _logFallback(error, stack);
    _messages.addError(error, stack);
    dispose();
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _startup.cancel();
    _revokeBlobUrl();
    _queued.clear();
    _worker.terminate();
    unawaited(_messages.close());
  }
}
