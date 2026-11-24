part of 'cupertino_chat.dart';

/// Opt-in driver for the release app memory benchmark. Normal app launches do
/// not construct this object. Checkpoints keep playback running while the host
/// samples the OS process; no GC or synchronous UI-thread pause is involved.
class ChatMemoryWorkload {
  ChatMemoryWorkload({
    required this.mode,
    required this.rasterCachePath,
    required this.urlCachePath,
    required this.checkpoint,
    required this.onError,
    required this.onComplete,
    this.onScroll,
    this.modelCacheEntries,
    this.modelCacheObserver,
    this.compiledCacheBytes = 0,
  });

  final String mode, rasterCachePath, urlCachePath;
  final Future<void> Function(String phase) checkpoint;
  final void Function(Object error) onError;
  final Future<void> Function() onComplete;
  final Future<void> Function(bool active)? onScroll;
  final int? modelCacheEntries;
  final int compiledCacheBytes;
  final ModelCacheObserver? modelCacheObserver;
  Map<String, Object?> Function()? snapshot;
  Map<String, int> Function()? modelCounters;

  ChatRendererMode get renderer =>
      mode == 'lottie' ? ChatRendererMode.lottie : ChatRendererMode.fastlottie;
  int? get framesPerStrip => mode == 'ping-pong' ? 1 : null;

  Future<void> _run(
    _CupertinoChatScreenState state,
    TgsRemoteCatalog catalog,
  ) async {
    Map<String, Object?> telemetry() {
      final cache = state._rasterCache;
      final store = state._store;
      final view = View.of(state.context);
      final inline = <InlineNetworkSticker>[];
      var heroes = 0;
      void visit(Element element) {
        final widget = element.widget;
        if (widget is InlineNetworkSticker) inline.add(widget);
        if (widget is HeroNetworkSticker) heroes++;
        element.visitChildren(visit);
      }

      (state.context as Element).visitChildren(visit);
      return {
        'mode': mode,
        'opaque_header': _opaqueChatHeader,
        'gpu_budget_bytes': cache.maximumBytes,
        'compressed_budget_bytes': cache.maximumCompressedMemoryBytes,
        'view_physical_width': view.physicalSize.width,
        'view_physical_height': view.physicalSize.height,
        'device_pixel_ratio': view.devicePixelRatio,
        'sticker_count': catalog.stickers.length,
        'emoji_count': catalog.emojis.length,
        'messages': state._messages.length,
        'inline_widgets': inline.length,
        'hero_widgets': heroes,
        'picker_open': state._drawerOpen,
        'selected_tab': state._selectedTabIndex,
        'picker_offset': state._pickerScroll.hasClients
            ? state._pickerScroll.offset
            : null,
        'pressure_constrained': state._pressure.constrained,
        'reduced_motion': state._reduced,
        'gpu_cache_bytes': cache.gpuBytes,
        'reserved_bytes': cache.reservedBytes,
        'compressed_ram_bytes': cache.compressedRamBytes,
        'disk_bytes': cache.diskBytes,
        'cache_entries': cache.entries,
        'worker_dispatches': cache.workerDispatches,
        'strip_swaps': cache.bufferSwaps,
        'raster_error': cache.lastError?.toString(),
        'sticker_errors': state._stickerSheet?.errors.length,
        'emoji_errors':
            (state._emojiSheet?.errors.length ?? 0) +
            (state._pickerEmojiSheet?.errors.length ?? 0),
        'sticker_players': state._stickerSheet?.activePlayers,
        'emoji_players':
            (state._emojiSheet?.activePlayers ?? 0) +
            (state._pickerEmojiSheet?.activePlayers ?? 0),
        'cached_models': store.cached,
        'model_cache_entries': store.maximumEntries,
        'model_decodes': store.decodes,
        'model_hits': store.hits,
        'model_coalesced': store.coalesced,
        'compiled_cache_bytes': store.compiledBytes,
        'compiled_cache_limit': store.maximumCompiledBytes,
        'snapshot_hits': store.snapshotHits,
        'snapshot_encodes': store.snapshotEncodes,
        'snapshot_encode_us': store.snapshotEncodeUs,
        'snapshot_evictions': store.snapshotEvictions,
        'source_bytes': store.sourceBytes,
        'network_downloads': store.networkDownloads,
        'disk_source_hits': store.diskSourceHits,
        'fetch_errors': store.fetchErrors,
        'running_decodes': store.runningDecodes,
        'queued_decodes': store.queuedDecodes,
        'store_busy': store.isBusy,
      };
    }

    snapshot = telemetry;
    modelCounters = () => {
      'decodes': state._store.decodes,
      'hits': state._store.hits,
      'coalesced': state._store.coalesced,
      'disk_source_hits': state._store.diskSourceHits,
      'decoded_models': state._store.decodedModels,
      'inflate_us': state._store.inflateUs,
      'compile_us': state._store.compileUs,
      'prepare_us': state._store.prepareUs,
      'snapshot_hits': state._store.snapshotHits,
      'snapshot_encodes': state._store.snapshotEncodes,
      'snapshot_encode_us': state._store.snapshotEncodeUs,
    };
    Future<void> mark(String phase) async {
      await Future<void>.delayed(const Duration(seconds: 3));
      await checkpoint(phase);
    }

    Future<void> scrollPicker(int steps) async {
      await onScroll?.call(true);
      for (var step = 0; step < steps; step++) {
        if (!state._pickerScroll.hasClients) {
          throw StateError('Picker has no scroll position');
        }
        final position = state._pickerScroll.position;
        final next = math.min(position.maxScrollExtent, position.pixels + 240);
        await state._pickerScroll.animateTo(
          next,
          duration: const Duration(milliseconds: 180),
          curve: Curves.linear,
        );
        await Future<void>.delayed(const Duration(milliseconds: 120));
      }
      await onScroll?.call(false);
    }

    try {
      await mark('chat_idle');
      state._toggleDrawer();
      await mark('picker_open');
      await scrollPicker(12);
      await mark('sticker_scroll');
      state._selectPickerTab(1);
      await mark('emoji_open');
      await scrollPicker(20);
      await mark('emoji_scroll');
      for (final item in catalog.emojis.take(24)) {
        state._insertEmojiShortcode(item);
      }
      await mark('composer_24_emoji');
      state._sendTextMessage();
      state._selectPickerTab(0);
      for (final item in catalog.stickers.take(12)) {
        state._sendSticker(item);
        await Future<void>.delayed(const Duration(milliseconds: 250));
      }
      await mark('sent_12_stickers');
      state._dismissPicker();
      await mark('picker_closed');
      for (var cycle = 1; cycle <= 5; cycle++) {
        state._toggleDrawer();
        await Future<void>.delayed(const Duration(milliseconds: 250));
        state._selectPickerTab(cycle.isOdd ? 1 : 0);
        await Future<void>.delayed(const Duration(milliseconds: 250));
        await scrollPicker(6);
        state._dismissPicker();
        if (cycle == 1 || cycle == 5) await mark('churn_$cycle');
      }
      state._setReducedMotion(true);
      await mark('reduced_motion');
      snapshot = () => {'mode': mode, 'chat_disposed': true};
      modelCounters = null;
      runApp(const SizedBox.shrink());
      await mark('disposed');
      await onComplete();
    } catch (error) {
      onError(error);
    }
  }
}
