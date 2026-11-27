import 'dart:typed_data';

import 'package:archive/archive.dart';

Uint8List gunzipBytes(List<int> bytes, int maximumBytes) =>
    const GZipDecoder().decodeBytes(
      bytes,
      verify: true,
      throwOnError: true,
      maxOutputSize: maximumBytes,
    );
