import 'dart:io';
import 'dart:typed_data';

final class _BoundedBytesSink implements Sink<List<int>> {
  _BoundedBytesSink(this.maximumBytes);

  final int maximumBytes;
  final _builder = BytesBuilder(copy: false);
  int _total = 0;

  @override
  void add(List<int> chunk) {
    _total += chunk.length;
    if (_total > maximumBytes) {
      throw const FormatException('GZip payload exceeds decode budget');
    }
    _builder.add(chunk);
  }

  @override
  void close() {}

  Uint8List takeBytes() => _builder.takeBytes();
}

/// Native zlib gzip decompression with streaming zip-bomb enforcement.
Uint8List gunzipBytes(List<int> bytes, int maximumBytes) {
  if (bytes.length < 18) {
    throw const FormatException('Truncated gzip payload');
  }
  final expectedIsize =
      bytes[bytes.length - 4] |
      (bytes[bytes.length - 3] << 8) |
      (bytes[bytes.length - 2] << 16) |
      (bytes[bytes.length - 1] << 24);
  final sink = _BoundedBytesSink(maximumBytes);
  final decoder = gzip.decoder.startChunkedConversion(sink);
  const chunkSize = 32 * 1024;
  try {
    if (bytes is Uint8List) {
      for (var off = 0; off < bytes.length; off += chunkSize) {
        final end = off + chunkSize < bytes.length
            ? off + chunkSize
            : bytes.length;
        decoder.add(Uint8List.sublistView(bytes, off, end));
      }
    } else {
      for (var off = 0; off < bytes.length; off += chunkSize) {
        final end = off + chunkSize < bytes.length
            ? off + chunkSize
            : bytes.length;
        decoder.add(bytes.sublist(off, end));
      }
    }
    decoder.close();
  } on FormatException {
    rethrow;
  } catch (error) {
    throw FormatException('Invalid gzip payload: $error');
  }
  final out = sink.takeBytes();
  if ((out.length & 0xFFFFFFFF) != expectedIsize) {
    throw const FormatException('Truncated or corrupt gzip payload');
  }
  return out;
}
