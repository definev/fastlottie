part of 'player.dart';

/// Shared bounded cache of resolution-independent vector [ui.Picture] frames.
///
/// Direct vector players (`usePipeline: false`, `rasterCache: null`) can attach
/// a caller-owned [FastLottiePictureCache] so scrolling a sticker out of view
/// and back reuses already-recorded frames instead of re-forking the scene and
/// re-recording display lists on the UI thread.
class FastLottiePictureCache {
  /// Creates a bounded vector picture cache.
  ///
  /// [maximumCompositions] bounds how many unpinned compositions remain warm in
  /// memory. [maximumCommands] bounds the cumulative estimated vector command
  /// weight across unpinned cached frames.
  FastLottiePictureCache({
    this.maximumCompositions = 24,
    this.maximumCommands = 8 * 1000 * 1000,
  }) : assert(maximumCompositions >= 0),
       assert(maximumCommands >= 0) {
    RangeError.checkNotNegative(maximumCompositions, 'maximumCompositions');
    RangeError.checkNotNegative(maximumCommands, 'maximumCommands');
  }

  /// Maximum retained compositions (active plus unpinned LRU).
  final int maximumCompositions;

  /// Soft estimated command budget across cached frames; unpinned compositions
  /// are evicted oldest-first when exceeded.
  final int maximumCommands;

  final _entries = <String, _PictureEntry>{};
  final _unpinned = LinkedHashSet<_PictureEntry>.identity();
  int _totalFrames = 0;
  int _totalCommands = 0;
  int _hits = 0;
  int _misses = 0;
  bool _disposed = false;

  /// Whether this cache has been disposed.
  bool get isDisposed => _disposed;

  /// Number of compositions currently retained (pinned and unpinned).
  int get entries => _entries.length;

  /// Total cached vector frames across all retained compositions.
  int get cachedFrames => _totalFrames;

  /// Total estimated vector command weight across all retained frames.
  int get cachedCommands => _totalCommands;

  /// Cumulative picture cache hits across players sharing this cache.
  int get hits => _hits;

  /// Cumulative picture cache misses across players sharing this cache.
  int get misses => _misses;

  _PictureEntry _acquire(
    FastLottiePlayer player,
    String key,
    int commandsPerFrame,
  ) {
    final entry = _entries.putIfAbsent(
      key,
      () => _PictureEntry(key, math.max(1, commandsPerFrame)),
    );
    if (entry.users.add(player) && entry.users.length == 1) {
      _unpinned.remove(entry);
    }
    return entry;
  }

  void _release(FastLottiePlayer player) {
    final entry = player._pictureEntry;
    if (entry == null) return;
    player._pictureEntry = null;
    if (_disposed || entry.retired) return;
    entry.users.remove(player);
    if (entry.users.isEmpty) {
      if (entry.pictures.isEmpty ||
          maximumCompositions == 0 ||
          maximumCommands == 0) {
        _evict(entry);
      } else {
        _unpinned.add(entry);
        _trim();
      }
    }
  }

  ui.Picture? _lookup(_PictureEntry entry, double frame) {
    if (_disposed || entry.retired) return null;
    final picture = entry.pictures.remove(frame);
    if (picture == null) {
      _misses++;
      return null;
    }
    entry.pictures[frame] = picture;
    _hits++;
    return picture;
  }

  void _store(
    _PictureEntry entry,
    double frame,
    ui.Picture picture,
    FastLottieCache limits,
  ) {
    if (_disposed || entry.retired) {
      picture.dispose();
      return;
    }
    final previous = entry.pictures.remove(frame);
    if (previous != null) {
      previous.dispose();
      _totalFrames--;
      entry.cachedCommands -= entry.commandsPerFrame;
      _totalCommands -= entry.commandsPerFrame;
    }
    entry.pictures[frame] = picture;
    _totalFrames++;
    entry.cachedCommands += entry.commandsPerFrame;
    _totalCommands += entry.commandsPerFrame;

    while (entry.pictures.length > limits.maximumFrames ||
        entry.cachedCommands > limits.maximumCommands) {
      final oldestKey = entry.pictures.keys.first;
      entry.pictures.remove(oldestKey)!.dispose();
      _totalFrames--;
      entry.cachedCommands -= entry.commandsPerFrame;
      _totalCommands -= entry.commandsPerFrame;
    }
    _trim();
  }

  void _trim() {
    while (_unpinned.isNotEmpty &&
        (_entries.length > maximumCompositions ||
            _totalCommands > maximumCommands)) {
      final victim = _unpinned.first;
      _unpinned.remove(victim);
      _evict(victim);
    }
  }

  void _evict(_PictureEntry entry) {
    if (entry.retired) return;
    entry.retired = true;
    _entries.remove(entry.key);
    _unpinned.remove(entry);
    _totalFrames -= entry.pictures.length;
    _totalCommands -= entry.cachedCommands;
    entry.dispose();
  }

  /// Disposes all unpinned entries immediately, keeping active players intact.
  void evictUnpinned() {
    if (_disposed) return;
    for (final entry in _unpinned.toList(growable: false)) {
      _evict(entry);
    }
  }

  /// Clears all cached pictures across both active and unpinned compositions.
  void clear() {
    if (_disposed) return;
    for (final entry in _entries.values.toList(growable: false)) {
      if (entry.users.isEmpty) {
        _evict(entry);
      } else {
        _totalFrames -= entry.pictures.length;
        _totalCommands -= entry.cachedCommands;
        for (final picture in entry.pictures.values) {
          picture.dispose();
        }
        entry.pictures.clear();
        entry.cachedCommands = 0;
      }
    }
  }

  /// Disposes every retained [ui.Picture] and detaches all entries.
  void dispose() {
    if (_disposed) return;
    _disposed = true;
    for (final entry in _entries.values) {
      entry.retired = true;
      for (final user in entry.users) {
        if (identical(user._pictureEntry, entry)) {
          user._pictureEntry = null;
        }
      }
      entry.users.clear();
      entry.dispose();
    }
    _entries.clear();
    _unpinned.clear();
    _totalFrames = 0;
    _totalCommands = 0;
  }
}

final class _PictureEntry {
  _PictureEntry(this.key, this.commandsPerFrame);

  final String key;
  final int commandsPerFrame;
  final pictures = <double, ui.Picture>{};
  final users = Set<FastLottiePlayer>.identity();
  int cachedCommands = 0;
  bool retired = false;

  void dispose() {
    for (final picture in pictures.values) {
      picture.dispose();
    }
    pictures.clear();
    cachedCommands = 0;
  }
}
