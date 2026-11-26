import 'dart:async';

import '../scene/options.dart';

/// Web/stub fallback runs inline without spawning background isolates.
Future<T> runInCompilePool<T>(
  List<int> bytes,
  FastLottieOptions options,
  bool prepareForVector,
  T Function(List<int>, FastLottieOptions, bool) compile,
) => Future<T>.value(compile(bytes, options, prepareForVector));
