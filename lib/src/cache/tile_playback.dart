import 'dart:math' as math;
import 'dart:typed_data';

/// A cursor describes pixels in a caller-owned buffer. Invalidate it before
/// changing that buffer or using it for anything other than this playback.
final class TilePlaybackCursor {
  Object? _page;
  int _frame = -1;

  void invalidate() {
    _page = null;
    _frame = -1;
  }
}

/// Independent frames in a small playback page share exact 16×16 pixel tiles.
/// The per-frame index supports seeking directly, without replaying deltas.
final class TilePlaybackPage {
  TilePlaybackPage._(
    this.width,
    this.height,
    this.firstFrame,
    this._slots,
    this._index,
    this._tiles,
    this.bytes,
    this._frameCrcs,
  );

  static const tileSize = 16;
  static const maxFrames = 4;
  static const maxPixels = 256 * 256;
  final int width, height, firstFrame;
  final Uint8List _slots;
  static const _absent = 255;
  final Uint16List _index;
  final List<Uint8List> _tiles;
  final Object _identity = Object();
  final int bytes;
  final Int32List _frameCrcs;

  bool contains(int frame) {
    final index = frame - firstFrame;
    return index >= 0 && index < maxFrames && _slots[index] != _absent;
  }

  int crcOf(int frame) {
    final index = frame - firstFrame;
    if (index >= 0 && index < maxFrames) {
      final slot = _slots[index];
      if (slot != _absent) {
        return _frameCrcs[slot];
      }
    }
    return 0;
  }

  int _offset(int frame) => _slots[frame - firstFrame] * _tileCount;
  late final int _columns = (width + tileSize - 1) ~/ tileSize;
  late final int _tileCount = _columns * ((height + tileSize - 1) ~/ tileSize);

  /// Return null if a page is dense or costs more than the admission budget.
  /// The reader fills [scratch] with one complete, verified BGRA frame.
  static TilePlaybackPage? build({
    required int width,
    required int height,
    required int firstFrame,
    required List<int> frames,
    required int maxBytes,
    required Uint8List scratch,
    required bool Function(int frame, Uint8List scratch) readFrame,
    int Function(int frame)? getCrc,
  }) {
    final pixels = width * height;
    final frameCount = frames.length;
    if (width <= 0 ||
        height <= 0 ||
        pixels > maxPixels ||
        frameCount < 2 ||
        frameCount > maxFrames ||
        scratch.length < pixels * 4) {
      return null;
    }
    final columns = (width + tileSize - 1) ~/ tileSize;
    final tileCount = columns * ((height + tileSize - 1) ~/ tileSize);
    final index = Uint16List(frameCount * tileCount);
    final slots = Uint8List(maxFrames)..fillRange(0, maxFrames, _absent);
    final frameCrcs = Int32List(maxFrames);
    final Uint32List words;
    if (scratch.offsetInBytes & 3 == 0) {
      words = Uint32List.sublistView(scratch, 0, pixels * 4);
    } else {
      final aligned = Uint8List(pixels * 4)..setRange(0, pixels * 4, scratch);
      words = Uint32List.sublistView(aligned, 0, pixels * 4);
    }
    final tiles = <Uint32List>[];
    final hashes = <(int, int, int), List<int>>{};
    // Include conservative object and index overhead in the RAM budget.
    var bytes = 128 + index.lengthInBytes;
    var changed = 0;
    for (var f = 0; f < frameCount; f++) {
      final frame = frames[f];
      final relative = frame - firstFrame;
      if (relative < 0 ||
          relative >= maxFrames ||
          slots[relative] != _absent ||
          !readFrame(frame, scratch)) {
        return null;
      }
      slots[relative] = f;
      frameCrcs[f] = getCrc?.call(frame) ?? 0;
      for (var t = 0; t < tileCount; t++) {
        final x = (t % columns) * tileSize;
        final y = (t ~/ columns) * tileSize;
        final w = math.min(tileSize, width - x);
        final h = math.min(tileSize, height - y);
        var hash = 0x811c9dc5;
        for (var row = 0; row < h; row++) {
          final start = (y + row) * width + x;
          for (var col = 0; col < w; col++) {
            hash = ((hash ^ words[start + col]) * 0x01000193) & 0xffffffff;
          }
        }
        final candidates = hashes.putIfAbsent((w, h, hash), () => []);
        var id = -1;
        for (final candidate in candidates) {
          final tile = tiles[candidate];
          var equal = true;
          for (var row = 0; row < h && equal; row++) {
            final start = (y + row) * width + x;
            for (var col = 0; col < w; col++) {
              if (tile[row * w + col] != words[start + col]) {
                equal = false;
                break;
              }
            }
          }
          if (equal) {
            id = candidate;
            break;
          }
        }
        if (id < 0) {
          bytes += w * h * 4 + 48;
          if (bytes > maxBytes) return null;
          final tile = Uint32List(w * h);
          for (var row = 0; row < h; row++) {
            tile.setRange(row * w, (row + 1) * w, words, (y + row) * width + x);
          }
          id = tiles.length;
          candidates.add(id);
          tiles.add(tile);
        }
        index[f * tileCount + t] = id;
        if (f > 0 && index[(f - 1) * tileCount + t] != id) changed++;
      }
    }
    if (changed * 3 > (frameCount - 1) * tileCount) return null;
    return TilePlaybackPage._(
      width,
      height,
      firstFrame,
      slots,
      index,
      [for (final tile in tiles) tile.buffer.asUint8List()],
      bytes,
      frameCrcs,
    );
  }

  void read(int frame, Uint8List dst, TilePlaybackCursor? cursor) {
    final count = _tileCount;
    final offset = _offset(frame);
    final before = identical(cursor?._page, _identity)
        ? _offset(cursor!._frame)
        : -1;
    if (before == offset) return;
    // External buffers and mini-strip slots are normally aligned. Byte copies
    // also allow callers to use a view at an unaligned byte offset.
    for (var t = 0; t < count; t++) {
      final id = _index[offset + t];
      if (before >= 0 && _index[before + t] == id) continue;
      final x = (t % _columns) * tileSize;
      final y = (t ~/ _columns) * tileSize;
      final w = math.min(tileSize, width - x);
      final h = math.min(tileSize, height - y);
      final src = _tiles[id];
      for (var row = 0; row < h; row++) {
        final dest = ((y + row) * width + x) * 4;
        dst.setRange(dest, dest + w * 4, src, row * w * 4);
      }
    }
    if (cursor != null) {
      cursor
        .._page = _identity
        .._frame = frame;
    }
  }
}
