import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/foundation.dart';
import 'package:lottie/lottie.dart';

class TgsModel {
  TgsModel({
    this.fast,
    this.reference,
    required this.sourceBytes,
    required this.inflateUs,
    required this.parseUs,
  });
  final FastLottieComposition? fast;
  final LottieComposition? reference;
  final int sourceBytes, inflateUs, parseUs;
  double get frameRate => fast?.frameRate ?? reference!.frameRate;
  double get frames => fast != null
      ? fast!.endFrame - fast!.startFrame
      : reference!.durationFrames + .01;
}

TgsModel parseTgs((Uint8List, bool) request) {
  final sw = Stopwatch()..start();
  final json = decodeLottieBytes(request.$1);
  final inflateUs = sw.elapsedMicroseconds;
  sw.reset();
  FastLottieComposition? fast;
  LottieComposition? reference;
  if (request.$2) {
    reference = LottieComposition.parseJsonBytes(json);
  } else {
    fast = FastLottieComposition.fromBytes(json)..prepareForPlayback();
  }
  return TgsModel(
    fast: fast,
    reference: reference,
    sourceBytes: json.length,
    inflateUs: inflateUs,
    parseUs: sw.elapsedMicroseconds,
  );
}

typedef TgsDecodeRequest = (Uint8List, bool);

typedef TgsDecoder = Future<TgsModel> Function(Uint8List bytes, bool reference);
Future<TgsModel> decodeTgs(Uint8List bytes, bool reference) => compute(
  parseTgs,
  (bytes, reference),
  debugLabel: 'tgs.inflate-parse-compile',
);

/// One file can fail without discarding the other models in its worker batch.
class TgsDecodeResult {
  const TgsDecodeResult.success(TgsModel value)
    : model = value,
      error = null,
      stackTrace = null;
  const TgsDecodeResult.failure(Object value, StackTrace stack)
    : model = null,
      error = value,
      stackTrace = stack;
  final TgsModel? model;
  final Object? error;
  final StackTrace? stackTrace;
}

typedef TgsBatchDecoder = Future<List<TgsDecodeResult>> Function(
  List<TgsDecodeRequest> requests,
);

List<TgsDecodeResult> _parseTgsBatch(List<TgsDecodeRequest> requests) => [
  for (final request in requests) _parseOne(request),
];

TgsDecodeResult _parseOne(TgsDecodeRequest request) {
  try {
    return TgsDecodeResult.success(parseTgs(request));
  } catch (error, stack) {
    return TgsDecodeResult.failure(error, stack);
  }
}

/// A short-lived native worker transfers the whole compiled batch with
/// Isolate.exit. Keeping the worker alive would require copying mutable graphs.
Future<List<TgsDecodeResult>> decodeTgsBatch(List<TgsDecodeRequest> requests) =>
    compute(_parseTgsBatch, requests, debugLabel: 'tgs.inflate-parse-compile');
