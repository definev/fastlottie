import 'dart:async';
import 'dart:js_interop';
import 'dart:ui_web' as ui_web;

import 'package:flutter/services.dart';
import 'package:web/web.dart' as web;

import 'isolate_stub.dart';
import 'raster_web_protocol.dart';
import 'simd_web.dart';

int browserRasterWorkerCount(int? override) {
  if (const bool.fromEnvironment('FASTLOTTIE_DISABLE_WEB_WORKER')) return 1;
  return override?.clamp(1, 2) ??
      (web.window.navigator.hardwareConcurrency >= 4 ? 2 : 1);
}

WorkerHandle? startBrowserRasterWorker(String name) {
  if (const bool.fromEnvironment('FASTLOTTIE_DISABLE_WEB_WORKER')) return null;
  try {
    final base = Uri.parse(web.document.baseURI);
    String url(String asset) =>
        base.resolve(ui_web.assetManager.getAssetUrl(asset)).toString();
    final worker = web.Worker(
      url(webWorkerAsset).toJS,
      web.WorkerOptions(name: name),
    );
    return _BrowserRasterWorker(worker, () async {
      final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
      return url(
        manifest.listAssets().contains(generatedWasmAsset)
            ? generatedWasmAsset
            : bundledWasmAsset,
      );
    });
  } catch (_) {
    return null;
  }
}

bool isBrowserRasterWorker(WorkerHandle handle) =>
    handle is _BrowserRasterWorker;
bool browserRasterWorkerUsesWasm(WorkerHandle handle) =>
    handle is _BrowserRasterWorker && handle.usesWasm;

final class _BrowserRasterWorker implements WorkerHandle {
  _BrowserRasterWorker(this._worker, Future<String> Function() wasmUrl) {
    _worker.onmessage = ((web.MessageEvent event) {
      try {
        final reply = WorkerMessage(event.data);
        if (reply.op == workerFailed) throw StateError(reply.s(1));
        if (!_ready) {
          if (reply.op != workerReady || reply.i(1) != webWorkerVersion) {
            throw StateError('Incompatible FastLottie Web Worker');
          }
          _ready = true;
          usesWasm = reply.b(2);
          _startup.cancel();
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
      final (data, transfer) = encodeWorkerMessage([
        workerInit,
        webWorkerVersion,
        url,
      ]);
      _worker.postMessage(data, transfer);
    } catch (error, stack) {
      _fail(error, stack);
    }
  }

  final web.Worker _worker;
  final _messages = StreamController<Object?>();
  final _queued = <Object?>[];
  late final Timer _startup;
  bool _ready = false;
  bool _disposed = false;
  bool usesWasm = false;

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
    _messages.addError(error, stack);
    dispose();
  }

  @override
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    _startup.cancel();
    _queued.clear();
    _worker.terminate();
    unawaited(_messages.close());
  }
}
