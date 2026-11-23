import 'package:fastlottie/fastlottie.dart';
// ignore: implementation_imports
import 'package:fastlottie/src/cache/lz4.dart';
// ignore: implementation_imports
import 'package:fastlottie/src/cache/snapshot_envelope.dart';
import 'package:flutter/foundation.dart';
import 'package:lottie/lottie.dart';

class TgsModel {
  TgsModel({
    this.fast,
    this.reference,
    required this.sourceBytes,
    required this.inflateUs,
    required this.parseUs,
    this.prepareUs = 0,
  });
  final FastLottieComposition? fast;
  final LottieComposition? reference;
  final int sourceBytes, inflateUs, parseUs, prepareUs;
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
    fast = FastLottieComposition.fromBytes(json);
  }
  final compileUs = sw.elapsedMicroseconds;
  fast?.prepareForPlayback();
  final totalUs = sw.elapsedMicroseconds;
  return TgsModel(
    fast: fast,
    reference: reference,
    sourceBytes: json.length,
    inflateUs: inflateUs,
    parseUs: totalUs,
    prepareUs: totalUs - compileUs,
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
  const TgsDecodeResult.success(
    TgsModel value, {
    this.compiledSnapshot,
    this.snapshotHit = false,
    this.snapshotEncodeUs = 0,
  }) : model = value,
       error = null,
       stackTrace = null;
  const TgsDecodeResult.failure(Object value, StackTrace stack)
    : model = null,
      error = value,
      stackTrace = stack,
      compiledSnapshot = null,
      snapshotHit = false,
      snapshotEncodeUs = 0;
  final TgsModel? model;
  final Object? error;
  final StackTrace? stackTrace;
  final Uint8List? compiledSnapshot;
  final bool snapshotHit;
  final int snapshotEncodeUs;
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

typedef TgsSnapshotRequest = (Uint8List, bool, Uint8List?);

TgsDecodeResult? _tryRestoreSnapshot(Uint8List snapshot, Stopwatch sw) {
  try {
    // ignore: invalid_use_of_visible_for_testing_member
    final decoded = debugDecodeCompiledComposition(
      unpackCompiledSnapshot(snapshot),
    );
    final restoreUs = sw.elapsedMicroseconds;
    decoded.composition.prepareForPlayback();
    final totalUs = sw.elapsedMicroseconds;
    return TgsDecodeResult.success(
      TgsModel(
        fast: decoded.composition,
        sourceBytes: decoded.sourceBytes,
        inflateUs: 0,
        parseUs: totalUs,
        prepareUs: totalUs - restoreUs,
      ),
      snapshotHit: true,
    );
  } on FormatException {
    // The snapshot is an optimization; the original TGS is still available.
    return null;
  }
}

// The caller validates source identity before supplying a trusted RAM blob.
List<TgsDecodeResult> _parseSnapshotBatch(List<TgsSnapshotRequest> requests) {
  final scratch = Lz4Scratch();
  return [
    for (final request in requests)
      (() {
        if (request.$2) return _parseOne((request.$1, true));
        try {
          final sw = Stopwatch()..start();
          final snapshot = request.$3;
          if (snapshot != null) {
            final restored = _tryRestoreSnapshot(snapshot, sw);
            if (restored != null) return restored;
          }
          final model = parseTgs((request.$1, false));
          sw.reset();
          Uint8List? encoded;
          try {
            // ignore: invalid_use_of_visible_for_testing_member
            final blob = debugEncodeCompiledComposition(
              model.fast!,
              sourceBytes: model.sourceBytes,
            );
            encoded = packCompiledSnapshot(blob, scratch);
          } on UnsupportedError {
            // A valid source can be too large for the RAM format.
          }
          return TgsDecodeResult.success(
            model,
            compiledSnapshot: encoded,
            snapshotEncodeUs: sw.elapsedMicroseconds,
          );
        } catch (error, stack) {
          return TgsDecodeResult.failure(error, stack);
        }
      })(),
  ];
}

Future<List<TgsDecodeResult>> decodeTgsSnapshotBatch(
  List<TgsSnapshotRequest> requests,
) => compute(
  _parseSnapshotBatch,
  requests,
  debugLabel: 'tgs.restore-or-compile',
);
