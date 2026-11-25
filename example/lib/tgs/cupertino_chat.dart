import 'dart:async';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/rendering.dart' show RenderAbstractViewport;
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';

import 'cache_dir.dart';
import 'clock.dart';
import 'emoji_posters.dart';
import 'fast_scroll_physics.dart';
import 'network_server.dart';
import 'network_store.dart';
import 'pack_assets.dart';
import 'pressure.dart';
import 'sheet.dart';
import 'store.dart';

part 'chat_memory_workload.dart';

enum ChatRendererMode { fastlottie, lottie }

const _enableEmojiPosters = bool.fromEnvironment(
  'CHAT_EMOJI_POSTERS',
  defaultValue: true,
);

/// Benchmark-only override; the regular demo keeps its existing hero policy.
class HeroStickerCacheScope extends InheritedWidget {
  const HeroStickerCacheScope({
    super.key,
    required this.cache,
    required super.child,
  });

  final FastLottieCache cache;

  @override
  bool updateShouldNotify(HeroStickerCacheScope oldWidget) =>
      cache != oldWidget.cache;
}

final _opaqueChatHeader = true;

enum _DrawerTab { all, pack, emoji }

@immutable
class ChatMessage {
  const ChatMessage.text({
    required this.id,
    required this.text,
    required this.isOutgoing,
    required this.timestamp,
    this.senderName,
    this.inlineItems = const {},
  }) : sticker = null,
       reloadEpoch = 0;

  const ChatMessage.sticker({
    required this.id,
    required this.sticker,
    required this.isOutgoing,
    required this.timestamp,
    this.senderName,
    this.reloadEpoch = 0,
  }) : text = null,
       inlineItems = const {};

  final String id;
  final String? text;
  final TgsRemoteItem? sticker;

  /// UTF-16 offsets, lengths and immutable descriptors of sent custom emoji.
  final Map<int, (int, TgsRemoteItem)> inlineItems;
  final bool isOutgoing;
  final DateTime timestamp;
  final String? senderName;
  final int reloadEpoch;

  static final _inlineItemsExpando = Expando<Map<int, (int, TgsRemoteItem)>>(
    'inline_items',
  );

  Map<int, (int, TgsRemoteItem)> resolveInlineItems(TgsRemoteCatalog catalog) {
    if (inlineItems.isNotEmpty) return inlineItems;
    final cached = _inlineItemsExpando[this];
    if (cached != null) return cached;
    final rawText = text;
    if (rawText == null || rawText.isEmpty) return const {};
    final result = <int, (int, TgsRemoteItem)>{};
    for (final match in catalog.richMessageRegex.allMatches(rawText)) {
      if (catalog.findItem(match[0]!) case final item?) {
        result[match.start] = (match.end - match.start, item);
      }
    }
    return _inlineItemsExpando[this] = result;
  }

  ChatMessage withReloadEpoch(int nextEpoch) => sticker != null
      ? ChatMessage.sticker(
          id: id,
          sticker: sticker,
          isOutgoing: isOutgoing,
          timestamp: timestamp,
          senderName: senderName,
          reloadEpoch: nextEpoch,
        )
      : this;
}

/// Visual artwork inside Noto TGS emojis occupies ~86% of the square canvas
/// (`512x512` / `1024x1024` with margins), so static OS emoji glyphs are scaled
/// by this factor to match animated emoji size visually.
const double _notoVisualFillRatio = 0.86;

double _normalizedStaticEmojiFontSize(double boxSize) =>
    boxSize * _notoVisualFillRatio;

double _telegramEmojiBoxSize({
  required int emojiOnlyCount,
  required double inlineSize,
  required double textScaleFactor,
}) => switch (emojiOnlyCount) {
  1 => 48.0 * textScaleFactor,
  2 => 42.0 * textScaleFactor,
  3 => 36.0 * textScaleFactor,
  _ => inlineSize,
};

List<InlineSpan> _buildStaticEmojiTextSpans(
  String text,
  TextStyle? baseStyle,
  double emojiBoxSize,
) {
  if (text.isEmpty) return const [];
  final matches = unicodeEmojiRegex.allMatches(text);
  if (matches.isEmpty) {
    return [TextSpan(text: text, style: baseStyle)];
  }
  final emojiStyle = (baseStyle ?? const TextStyle()).copyWith(
    fontSize: _normalizedStaticEmojiFontSize(emojiBoxSize),
    height: 1.0,
  );
  final spans = <InlineSpan>[];
  var cursor = 0;
  for (final match in matches) {
    if (match.start > cursor) {
      spans.add(
        TextSpan(text: text.substring(cursor, match.start), style: baseStyle),
      );
    }
    spans.add(TextSpan(text: match.group(0)!, style: emojiStyle));
    cursor = match.end;
  }
  if (cursor < text.length) {
    spans.add(TextSpan(text: text.substring(cursor), style: baseStyle));
  }
  return spans;
}

/// A Cupertino-ready [TextEditingController] that displays animated TGS emojis
/// inline inside [CupertinoTextField] using single-character UTF-16 BMP tokens
/// (`U+E000 + emojiIndex`) paired with [WidgetSpan].
///
/// Because each custom emoji occupies exactly ONE UTF-16 code unit,
/// `value.text.length` strictly matches `RenderEditable`'s `plainText.length`,
/// guaranteeing correct caret navigation, drag selection, and single-tap backspace.
class EmojiComposerController extends TextEditingController {
  EmojiComposerController({
    super.text,
    this.catalog,
    this.sheet,
    this.clock,
    this.store,
    this.renderer = ChatRendererMode.fastlottie,
    this.still = false,
    this.emojiSize = 21,
  });

  /// Base code point in the Unicode Basic Multilingual Plane (BMP) Private Use Area (PUA).
  static const int puaBase = 0xE000;

  TgsRemoteCatalog? catalog;
  StickerSheet? sheet;
  StickerClock? clock;
  TgsStoreBase? store;
  ChatRendererMode renderer;
  bool still;
  double emojiSize;

  /// Returns the 1-character UTF-16 PUA string for the given [item], or null if
  /// the item is not found in [catalog.emojis].
  String? charForEmoji(TgsRemoteItem item) {
    final cat = catalog;
    if (cat == null) return null;
    final idx = cat.emojis.indexOf(item);
    if (idx < 0) return null;
    return String.fromCharCode(puaBase + idx);
  }

  /// Converts any PUA emoji tokens in [sourceText] (or [text]) as well as any
  /// raw Unicode emojis into human-readable shortcodes (e.g. `\uE000` or `😀` -> `:smile:`).
  String toShortcodeText([String? sourceText]) {
    final raw = sourceText ?? text;
    final cat = catalog;
    if (cat == null) return raw;
    return cat.toShortcodeText(raw);
  }

  /// Converts PUA tokens (`\uE000`) and shortcodes (`:smile:`) in [sourceText] (or [text])
  /// into their real Unicode emojis (e.g. `😀`), falling back to shortcodes if no
  /// Unicode representation exists (e.g. `:studio_microphone:`).
  String toEmojiText([String? sourceText]) {
    final raw = sourceText ?? text;
    final cat = catalog;
    if (cat == null) return raw;
    return cat.toEmojiText(raw);
  }

  /// Converts human-readable shortcodes (e.g. `:studio_microphone:`) and raw
  /// Unicode emojis (e.g. `😀`, `🔥`, `❤️‍🔥`) in [sourceText] into single-character
  /// PUA tokens (`\uE000`).
  String decodeShortcodes(String sourceText) {
    final cat = catalog;
    if (cat == null || cat.emojis.isEmpty) return sourceText;
    if (!TgsRemoteCatalog.couldContainEmojiOrShortcode(sourceText)) {
      return sourceText;
    }
    final emojis = cat.emojis;
    return sourceText.replaceAllMapped(cat.emojiAndShortcodeRegex, (match) {
      final token = match.group(0)!;
      final item = cat.findItem(token);
      if (item != null) {
        final idx = emojis.indexOf(item);
        if (idx >= 0) {
          return String.fromCharCode(puaBase + idx);
        }
      }
      return token;
    });
  }

  @override
  TextSpan buildTextSpan({
    required BuildContext context,
    TextStyle? style,
    required bool withComposing,
  }) {
    assert(
      !value.composing.isValid || !withComposing || value.isComposingRangeValid,
    );
    final hasComposing = withComposing && value.isComposingRangeValid;
    final composingStyle = hasComposing
        ? style?.merge(const TextStyle(decoration: TextDecoration.underline))
        : null;

    final rawText = value.text;
    if (rawText.isEmpty) {
      return TextSpan(style: style, text: '');
    }

    final cat = catalog;
    final sh = sheet;
    final clk = clock;
    final st = store;

    // Fallback if sheets or catalog aren't loaded yet.
    if (cat == null ||
        sh == null ||
        clk == null ||
        st == null ||
        cat.emojis.isEmpty) {
      if (!hasComposing) {
        return TextSpan(
          style: style,
          children: _buildStaticEmojiTextSpans(rawText, style, emojiSize),
        );
      }
      return TextSpan(
        style: style,
        children: [
          ..._buildStaticEmojiTextSpans(
            value.composing.textBefore(rawText),
            style,
            emojiSize,
          ),
          ..._buildStaticEmojiTextSpans(
            value.composing.textInside(rawText),
            composingStyle,
            emojiSize,
          ),
          ..._buildStaticEmojiTextSpans(
            value.composing.textAfter(rawText),
            style,
            emojiSize,
          ),
        ],
      );
    }

    final emojis = cat.emojis;
    final emojiCount = emojis.length;

    List<InlineSpan> buildSpanList(String segment, TextStyle? segStyle) {
      if (segment.isEmpty) return const [];
      final spans = <InlineSpan>[];
      final textBuf = StringBuffer();

      void flushText() {
        if (textBuf.isNotEmpty) {
          spans.addAll(
            _buildStaticEmojiTextSpans(textBuf.toString(), segStyle, emojiSize),
          );
          textBuf.clear();
        }
      }

      for (var i = 0; i < segment.length; i++) {
        final code = segment.codeUnitAt(i);
        final idx = code - puaBase;
        if (idx >= 0 && idx < emojiCount) {
          flushText();
          final item = emojis[idx];
          spans.add(
            WidgetSpan(
              alignment: PlaceholderAlignment.middle,
              baseline: TextBaseline.alphabetic,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 1.5),
                child: InlineNetworkSticker(
                  item: item,
                  sheet: sh,
                  clock: clk,
                  store: st,
                  renderer: renderer,
                  still: still,
                  size: emojiSize,
                  placeholderColor: const Color(0xff232636),
                  repaintBoundary: true,
                ),
              ),
            ),
          );
        } else {
          textBuf.writeCharCode(code);
        }
      }
      flushText();
      return spans;
    }

    if (!hasComposing) {
      final children = buildSpanList(rawText, style);
      return TextSpan(style: style, children: children);
    }

    final before = value.composing.textBefore(rawText);
    final inside = value.composing.textInside(rawText);
    final after = value.composing.textAfter(rawText);

    final children = <InlineSpan>[
      ...buildSpanList(before, style),
      ...buildSpanList(inside, composingStyle),
      ...buildSpanList(after, style),
    ];

    return TextSpan(style: style, children: children);
  }
}

/// Automatically collapses typed `:shortcode:` tokens (e.g. `:studio_microphone:`)
/// and typed / pasted Unicode emojis (e.g. `😀`, `🔥`, `❤️`) into their corresponding
/// 1-character UTF-16 PUA emoji token as soon as entered, adjusting selection
/// offsets accurately.
class EmojiShortcodeTextInputFormatter extends TextInputFormatter {
  EmojiShortcodeTextInputFormatter(this.getCatalog);

  final TgsRemoteCatalog? Function() getCatalog;

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (newValue.isComposingRangeValid && !newValue.composing.isCollapsed) {
      return newValue;
    }
    final text = newValue.text;
    if (!TgsRemoteCatalog.couldContainEmojiOrShortcode(text)) {
      return newValue;
    }
    final catalog = getCatalog();
    if (catalog == null || catalog.emojis.isEmpty) {
      return newValue;
    }

    final matches = catalog.emojiAndShortcodeRegex.allMatches(text).toList();
    if (matches.isEmpty) {
      return newValue;
    }

    bool hasMatch = false;
    for (final m in matches) {
      if (catalog.findItem(m.group(0)!) != null) {
        hasMatch = true;
        break;
      }
    }
    if (!hasMatch) {
      return newValue;
    }

    final buffer = StringBuffer();
    var cursor = 0;
    var selectionStart = newValue.selection.start;
    var selectionEnd = newValue.selection.end;

    for (final match in matches) {
      final token = match.group(0)!;
      final item = catalog.findItem(token);
      if (item == null) continue;
      final idx = catalog.emojis.indexOf(item);
      if (idx < 0) continue;

      buffer.write(text.substring(cursor, match.start));

      final puaChar = String.fromCharCode(
        EmojiComposerController.puaBase + idx,
      );
      buffer.write(puaChar);

      final delta = 1 - (match.end - match.start);
      if (selectionStart >= match.end) {
        selectionStart += delta;
      } else if (selectionStart > match.start) {
        selectionStart = buffer.length;
      }
      if (selectionEnd >= match.end) {
        selectionEnd += delta;
      } else if (selectionEnd > match.start) {
        selectionEnd = buffer.length;
      }

      cursor = match.end;
    }

    if (cursor < text.length) {
      buffer.write(text.substring(cursor));
    }

    final transformedText = buffer.toString();
    return TextEditingValue(
      text: transformedText,
      selection: TextSelection(
        baseOffset: selectionStart.clamp(0, transformedText.length),
        extentOffset: selectionEnd.clamp(0, transformedText.length),
      ),
    );
  }
}

class _Palette {
  const _Palette({
    required this.brightness,
    required this.background,
    required this.navBar,
    required this.composerBar,
    required this.fieldFill,
    required this.fieldBorder,
    required this.drawerBackground,
    required this.tilePlaceholder,
    required this.incomingBubble,
    required this.incomingBorder,
    required this.outgoingBubbleTop,
    required this.outgoingBubbleBottom,
    required this.textPrimary,
    required this.textSecondary,
    required this.outgoingText,
    required this.accent,
    required this.pillActive,
    required this.pillInactive,
    required this.separator,
  });

  final Brightness brightness;
  final Color background;
  final Color navBar;
  final Color composerBar;
  final Color fieldFill;
  final Color fieldBorder;
  final Color drawerBackground;
  final Color tilePlaceholder;
  final Color incomingBubble;
  final Color incomingBorder;
  final Color outgoingBubbleTop;
  final Color outgoingBubbleBottom;
  final Color textPrimary;
  final Color textSecondary;
  final Color outgoingText;
  final Color accent;
  final Color pillActive;
  final Color pillInactive;
  final Color separator;

  static const dark = _Palette(
    brightness: Brightness.dark,
    background: Color(0xff0f1016),
    navBar: Color(0xd8181a24),
    composerBar: Color(0xf0151721),
    fieldFill: Color(0xff222534),
    fieldBorder: Color(0xff32364a),
    drawerBackground: Color(0xff14161f),
    tilePlaceholder: Color(0xff1e2130),
    incomingBubble: Color(0xff1d202c),
    incomingBorder: Color(0xff2c3042),
    outgoingBubbleTop: Color(0xff635bff),
    outgoingBubbleBottom: Color(0xff4a43db),
    textPrimary: Color(0xfff4f5fb),
    textSecondary: Color(0xff9aa1b8),
    outgoingText: Color(0xffffffff),
    accent: Color(0xff746dff),
    pillActive: Color(0xff5e5ce6),
    pillInactive: Color(0xff232636),
    separator: Color(0xff262938),
  );

  static const light = _Palette(
    brightness: Brightness.light,
    background: Color(0xfff2f4f8),
    navBar: Color(0xe6ffffff),
    composerBar: Color(0xf5f9fafc),
    fieldFill: Color(0xffffffff),
    fieldBorder: Color(0xffd7dce6),
    drawerBackground: Color(0xffeceff5),
    tilePlaceholder: Color(0xffe1e6f0),
    incomingBubble: Color(0xffffffff),
    incomingBorder: Color(0xffe1e5ee),
    outgoingBubbleTop: Color(0xff5856d6),
    outgoingBubbleBottom: Color(0xff4240c4),
    textPrimary: Color(0xff161822),
    textSecondary: Color(0xff6a7188),
    outgoingText: Color(0xffffffff),
    accent: Color(0xff5856d6),
    pillActive: Color(0xff5856d6),
    pillInactive: Color(0xffdfe3ec),
    separator: Color(0xffd5dae4),
  );
}

/// Complete pure-Cupertino chat screen powered by HTTP `.tgs` delivery:
/// - Auto-starts an embedded local HTTP `.tgs` server (or connects to `--dart-define=TGS_SERVER_URL`).
/// - Uses [NetworkTgsStore] (bounded HTTP queue + socket abort on scroll + raw `.tgsbin` disk cache
///   + isolate compile) feeding [FastLottieRasterCache]
///   for the 5-column picker & inline emojis.
/// - Renders sent/received large sticker messages at zero trade-off direct vector quality (`usePipeline: false`,
///   [FastLottieCache.unbounded]).
class CupertinoChatScreen extends StatefulWidget {
  const CupertinoChatScreen({
    super.key,
    this.externalServerUri,
    this.initialCatalog,
    this.store,
    this.isDark = true,
    this.onBrightnessChanged,
    this.framesPerStrip,
    this.rasterWorkerCount,
    this.memoryWorkload,
  });

  final Uri? externalServerUri;
  final Future<TgsRemoteCatalog>? initialCatalog;
  final NetworkTgsStore? store;
  final bool isDark;
  final ValueChanged<bool>? onBrightnessChanged;
  final int? framesPerStrip;
  final int? rasterWorkerCount;
  final ChatMemoryWorkload? memoryWorkload;

  @override
  State<CupertinoChatScreen> createState() => _CupertinoChatScreenState();
}

class _CupertinoChatScreenState extends State<CupertinoChatScreen>
    with WidgetsBindingObserver {
  late final NetworkTgsStore _store;

  NetworkTgsStore _createStore() => NetworkTgsStore(
    httpConcurrency: 6,
    decodeConcurrency: 2,
    batchSize: 2,
    framePaced: true,
    // Visible cells stay pinned. This only bounds models that have
    // already scrolled off; compiling them again reads the disk cache.
    maximumEntries: widget.memoryWorkload?.modelCacheEntries ?? 8,
    modelCacheObserver: widget.memoryWorkload?.modelCacheObserver,
    maximumCompiledBytes: widget.memoryWorkload?.compiledCacheBytes ?? 0,
    fetcher: _packAssets.fetch,
  );

  // Longer strips amortize uploads for the inline emoji visible during a fling.
  int? get _preferredStripSize =>
      widget.framesPerStrip ?? (_android ? 6 : null);
  late int? _framesPerStrip =
      widget.memoryWorkload?.framesPerStrip ?? _preferredStripSize;
  late FastLottieRasterCache _rasterCache = _createRasterCache(_framesPerStrip);

  bool get _android =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  int get _rasterWorkerCount => widget.rasterWorkerCount ?? (_android ? 2 : 1);

  FastLottieRasterCache _createRasterCache(int? framesPerStrip) =>
      FastLottieRasterCache(
        maximumBytes: 8 * 1024 * 1024,
        maximumInFlight: _rasterWorkerCount == 1 ? 2 : 4,
        maximumCompressedMemoryBytes: 2 * 1024 * 1024,
        maximumDiskBytes: 128 * 1024 * 1024,
        maximumFrameRate: stickerThumbnailFrameRate,
        framesPerStrip: framesPerStrip,
        adaptiveStripBudget: _android,
        progressiveFirstFrame: !_android,
        workerCount: _rasterWorkerCount,
        allowUiVectorFallback: true,
      );

  final StickerClock _clock = StickerClock();
  final StickerPlaybackBudget _playbackBudget = StickerPlaybackBudget();
  late final StickerPressure _pressure = StickerPressure()
    ..addListener(_onPressureChanged);

  late final ScrollController _messageScroll = ScrollController(
    onAttach: (position) {
      position.isScrollingNotifier.addListener(_syncMessageScrollWork);
      _syncMessageScrollWork();
    },
    onDetach: (position) {
      position.isScrollingNotifier.removeListener(_syncMessageScrollWork);
      _rasterCache.inFlightLimit = null;
    },
  );
  final ScrollController _pickerScroll = ScrollController();
  late final EmojiComposerController _composerController =
      EmojiComposerController();
  late final EmojiShortcodeTextInputFormatter _shortcodeFormatter =
      EmojiShortcodeTextInputFormatter(() => _catalog);
  late final FocusNode _composerFocus = FocusNode(
    debugLabel: 'composer_field',
    onKeyEvent: _handleComposerFocusKeyEvent,
  );
  final ValueNotifier<bool> _showScrollBottom = ValueNotifier<bool>(false);
  final ValueNotifier<bool> _hasDraft = ValueNotifier<bool>(false);

  LocalTgsServer? _embeddedServer;
  TgsRemoteCatalog? _catalog;
  StickerSheet? _stickerSheet;
  StickerSheet? _emojiSheet;
  StickerSheet? _pickerEmojiSheet;
  Iterable<StickerSheet> get _sheets =>
      [_stickerSheet, _emojiSheet, _pickerEmojiSheet].nonNulls;

  final _packAssets = PackAssets();
  late final _posters = PackPosterCache(_packAssets);
  final List<StickerSheet> _disposingSheets = <StickerSheet>[];
  final List<FastLottieRasterCache> _disposingCaches =
      <FastLottieRasterCache>[];
  Object? _bootError;
  bool _booting = true;

  late ChatRendererMode _renderer =
      widget.memoryWorkload?.renderer ?? ChatRendererMode.fastlottie;
  late bool _isDark = widget.isDark;
  bool? _reducedMotionOverride;
  bool _foreground = true;
  bool _drawerOpen = false;
  int _selectedTabIndex = 0; // 0 = All, 1..N = Sticker Packs, last = Emoji
  int _cacheEpoch = 0;
  int _messageSeq = 0;
  final List<ChatMessage> _messages = <ChatMessage>[];

  _Palette get _palette => _isDark ? _Palette.dark : _Palette.light;
  bool get _reduced =>
      _reducedMotionOverride ?? MediaQuery.disableAnimationsOf(context);

  @override
  void initState() {
    super.initState();
    HardwareKeyboard.instance.addHandler(_handleGlobalKeyEvent);
    WidgetsBinding.instance.addObserver(this);
    _store = widget.store ?? _createStore();
    final life = WidgetsBinding.instance.lifecycleState;
    _foreground =
        life == null ||
        life == AppLifecycleState.resumed ||
        life == AppLifecycleState.inactive;

    _messageScroll.addListener(_onMessageScroll);
    _composerController.addListener(_onComposerTextChanged);
    _composerFocus.addListener(_onComposerFocusChanged);
    unawaited(_bootstrap());
  }

  Future<void> _bootstrap() async {
    setState(() {
      _booting = true;
      _bootError = null;
    });
    try {
      final workload = widget.memoryWorkload;
      final String? urlCacheDir;
      if (workload == null) {
        await ensureDefaultExampleDiskCache();
        await attachExampleDiskCache(_rasterCache);
        urlCacheDir = await resolveUrlDiskCacheDirectory();
      } else {
        _rasterCache.attachDiskDirectory(workload.rasterCachePath);
        FastLottieRasterCache.defaultDiskDirectory = workload.rasterCachePath;
        urlCacheDir = workload.urlCachePath;
      }
      if (urlCacheDir != null && _store.sourceCacheDirectory == null) {
        _store.attachSourceCacheDirectory(urlCacheDir);
      }
      _packAssets.cacheDirectory = urlCacheDir;

      TgsRemoteCatalog catalog;
      final explicitCatalog = widget.initialCatalog;
      const defineUrl = String.fromEnvironment('TGS_SERVER_URL');
      final external =
          widget.externalServerUri ??
          (defineUrl.isNotEmpty ? Uri.tryParse(defineUrl) : null);
      if (explicitCatalog != null) {
        catalog = await explicitCatalog;
      } else if (external != null) {
        final cached = await _packAssets.cachedCatalog(external);
        if (!mounted) return;
        if (cached != null && workload == null) {
          _setupCatalog(cached);
          _prewarmChatPosters(cached);
          unawaited(_refreshCatalog(external, cached));
          return;
        }
        try {
          catalog = await _packAssets.catalog(external);
        } on FastLottieNetworkException catch (error) {
          if (error.statusCode != 404 || kIsWeb) rethrow;
          catalog = await fetchRemoteTgsCatalog(external);
        }
      } else if (kIsWeb) {
        catalog = await _packAssets.catalog(PackAssets.bundleOrigin);
      } else {
        final server = await LocalTgsServer.startFromBundle();
        if (!mounted) {
          await server.close(force: true);
          return;
        }
        _embeddedServer = server;
        catalog = server.catalog;
      }

      if (!mounted) return;
      _setupCatalog(catalog);
      _prewarmChatPosters(catalog);
      if (workload != null) unawaited(workload._run(this, catalog));
    } catch (error) {
      widget.memoryWorkload?.onError(error);
      if (!mounted) return;
      setState(() {
        _bootError = error;
        _booting = false;
      });
    }
  }

  Future<void> _refreshCatalog(Uri origin, TgsRemoteCatalog previous) async {
    try {
      final next = await _packAssets.catalog(origin);
      if (!mounted || !identical(_catalog, previous)) return;
      final revisions = previous.packs.map((pack) => (pack.id, pack.revision));
      if (listEquals(revisions.toList(), [
        for (final pack in next.packs) (pack.id, pack.revision),
      ])) {
        return;
      }
      final draft = previous.toShortcodeText(_composerController.text);
      _composerController.value = TextEditingValue(
        text: draft,
        selection: TextSelection.collapsed(offset: draft.length),
      );
      _setupCatalog(next);
      _prewarmChatPosters(next);
      if (_drawerOpen) _prewarmPickerPosters(_selectedTabIndex);
    } on Exception {
      // The mounted catalog continues to work while the server is offline.
    } on TypeError {
      // Keep the current revision when the remote manifest is incompatible.
    }
  }

  void _scheduleDisposeStale({
    List<StickerSheet> sheets = const [],
    FastLottieRasterCache? cache,
  }) {
    for (final sheet in sheets) {
      sheet.active = false;
      _disposingSheets.add(sheet);
    }
    if (cache != null) {
      cache.enabled = false;
      _disposingCaches.add(cache);
    }
    if (sheets.isEmpty && cache == null) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      for (final sheet in sheets) {
        if (_disposingSheets.remove(sheet)) sheet.dispose();
      }
      if (cache != null && _disposingCaches.remove(cache)) {
        cache.dispose();
      }
    });
  }

  void _setupCatalog(
    TgsRemoteCatalog catalog, {
    FastLottieRasterCache? staleCache,
  }) {
    final staleSheets = _sheets.toList();

    _catalog = catalog;
    _stickerSheet = StickerSheet(
      assets: [for (final item in catalog.stickers) item.urlString],
      // At 112 px, three-frame strips force many visible tiles down to one
      // frame per upload. Smaller thumbnails leave room for more lookahead.
      pixelSize: _android ? 96 : stickerThumbnailPixels,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
      framesPerStrip: _framesPerStrip,
      posterCache: _enableEmojiPosters ? _posters : null,
      playbackBudget: _playbackBudget,
    )..constrained = _pressure.constrained;

    final emojiAssets = [for (final item in catalog.emojis) item.urlString];
    StickerSheet createEmojiSheet(int pixels) => StickerSheet(
      assets: emojiAssets,
      pixelSize: pixels,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
      framesPerStrip: _framesPerStrip,
      posterCache: _enableEmojiPosters ? _posters : null,
      playbackBudget: _playbackBudget,
    )..constrained = _pressure.constrained;

    // Each player holds one raster size. The two Android surfaces use
    // independent players backed by the same store and raster cache.
    _emojiSheet = createEmojiSheet(_android ? 64 : 96);
    _pickerEmojiSheet = _android ? createEmojiSheet(96) : null;

    _composerController.catalog = catalog;
    _composerController.clock = _clock;
    _composerController.store = _store;
    _composerController.renderer = _renderer;
    _composerController.still = _reduced || _pressure.constrained;
    if (TgsRemoteCatalog.couldContainEmojiOrShortcode(
      _composerController.text,
    )) {
      final decoded = _composerController.decodeShortcodes(
        _composerController.text,
      );
      if (decoded != _composerController.text) {
        _composerController.value = TextEditingValue(
          text: decoded,
          selection: TextSelection.collapsed(offset: decoded.length),
        );
      }
    }

    if (_messages.isEmpty) {
      _seedInitialConversation(catalog);
    }

    _syncPlayback();
    setState(() {
      _booting = false;
      _bootError = null;
    });
    _scheduleDisposeStale(sheets: staleSheets, cache: staleCache);
  }

  void _seedInitialConversation(TgsRemoteCatalog catalog) {
    final now = DateTime.now();
    String sc(String code, [int fallbackIdx = 0]) =>
        catalog.shortcodeMap[code]?.shortcode ??
        (fallbackIdx < catalog.emojis.length
            ? (catalog.emojis[fallbackIdx].shortcode ?? '')
            : '');
    String byIdx(int idx) => idx < catalog.emojis.length
        ? (catalog.emojis[idx].shortcode ?? '')
        : '';

    final earlierSamples = <(bool outgoing, String text)>[
      (
        false,
        '${sc(':party_popper:', 0)} Welcome to the TGS chat demo! ${sc(':partying_face:', 0)}',
      ),
      (
        true,
        'This catalog has ${catalog.stickers.length} stickers and ${catalog.emojis.length} animated emoji. Try ${sc(':smile:', 0)} or ${sc(':burn:', 2)} in a message.',
      ),
      (
        false,
        'When you scroll quickly through the sticker tray, the HTTP queue (up to 6 concurrent requests) aborts sockets for stickers that leave the screen ${sc(':rocket:', 7)} while vector decoding stays isolated on a separate isolate ${sc(':exploding_head:', 0)}.',
      ),
      (
        true,
        'Grid thumbnails and inline emoji ${sc(':light_bulb:', 4)} ${sc(':heart_on_fire:', 0)} ${sc(':sparkles:', 0)} use double-buffered strip rasterization + LZ4 `.flcache` at 30 FPS.',
      ),
      (
        false,
        'Stickers sent directly to the chat skip the queue and render as vectors with Impeller, preserving sharpness and frame rate ${sc(':trophy_1f3c6:', 12)} ${sc(':thumbs_up:', 0)}',
      ),
    ];

    // Older messages above so the user can scroll up cleanly through chat history.
    const fillerMessages = <String>[
      'Open the picker to browse sticker packs and animated emoji.',
      'ETag, Cache-Control, and the `.tgsbin` disk cache make repeat visits network-free.',
      'Use the menu in the top-right corner to simulate 80 ms or 220 ms network latency and see the loading placeholders.',
      'Long-press any sticker or emoji in the tray to preview it at full size.',
      'Tap a sticker in the chat to replay its animation.',
      'The entire interface is built with Cupertino (`package:flutter/cupertino.dart`).',
    ];

    final emojiCount = math.max(1, catalog.emojis.length);
    for (var i = 0; i < 16; i++) {
      final t = now.subtract(Duration(minutes: 30 - i));
      final emojiA = byIdx((i * 5) % emojiCount);
      final emojiB = byIdx((40 + i * 3) % emojiCount);
      _messages.add(
        ChatMessage.text(
          id: 'seed_${_messageSeq++}',
          text: '$emojiA ${fillerMessages[i % fillerMessages.length]} $emojiB',
          isOutgoing: i.isOdd,
          timestamp: t,
          senderName: i.isEven ? 'FastLottie Bot' : null,
        ),
      );
    }

    for (var i = 0; i < earlierSamples.length; i++) {
      _messages.add(
        ChatMessage.text(
          id: 'seed_main_${_messageSeq++}',
          text: earlierSamples[i].$2,
          isOutgoing: earlierSamples[i].$1,
          timestamp: now.subtract(Duration(minutes: 8 - i)),
          senderName: earlierSamples[i].$1 ? null : 'FastLottie Bot',
        ),
      );
    }

    if (widget.memoryWorkload == null) {
      _seedStressMessages(catalog, now);
    }

    // Place the initial Hero `.tgs` sticker directly in the visible chat viewport.
    if (catalog.stickers.isNotEmpty) {
      _messages.add(
        ChatMessage.sticker(
          id: 'seed_sticker_${_messageSeq++}',
          sticker: catalog.stickers.first,
          isOutgoing: false,
          timestamp: now.subtract(const Duration(minutes: 2)),
          senderName: 'FastLottie Bot',
        ),
      );
    }

    _messages.add(
      ChatMessage.text(
        id: 'seed_welcome_${_messageSeq++}',
        text:
            '${sc(':musical_notes:', 0)} Try typing or pasting real emoji (${sc(':smile:', 0)} 😀 ${sc(':heart_eyes:', 0)} 😍 ${sc(':partying_face:', 0)} 🥳 ${sc(':heart_on_fire:', 0)} ❤️‍🔥 ${sc(':thumbs_up:', 0)} 👍) or shortcodes (${sc(':strawberry_1f353:', 40)} ${sc(':pizza_1f355:', 70)} ${sc(':smile_cat:', 87)}), or tap the smiley button below to open the picker! ${sc(':sparkles:', 3)}',
        isOutgoing: true,
        timestamp: now.subtract(const Duration(minutes: 1)),
      ),
    );
  }

  void _seedStressMessages(TgsRemoteCatalog catalog, DateTime now) {
    const batches = 20, emojisPerMessage = 12;
    for (var batch = 0; batch < batches; batch++) {
      final outgoing = batch.isOdd;
      final timestamp = now.subtract(Duration(seconds: 180 - batch * 2));
      if (catalog.stickers.isNotEmpty) {
        // Spread the samples across packs rather than loading one pack only.
        final index = batch * catalog.stickers.length ~/ batches;
        _messages.add(
          ChatMessage.sticker(
            id: 'stress_sticker_${_messageSeq++}',
            sticker: catalog.stickers[index],
            isOutgoing: outgoing,
            timestamp: timestamp,
            senderName: outgoing ? null : 'Stress Test',
          ),
        );
      }
      if (catalog.emojis.isEmpty) continue;
      // Use the chat's emoji tokens so aliases cannot collapse distinct assets.
      final tokens = List.generate(emojisPerMessage, (slot) {
        final index = (batch * emojisPerMessage + slot) % catalog.emojis.length;
        return String.fromCharCode(EmojiComposerController.puaBase + index);
      });
      _messages.add(
        ChatMessage.text(
          id: 'stress_emoji_${_messageSeq++}',
          text: tokens.join(' '),
          isOutgoing: !outgoing,
          timestamp: timestamp.add(const Duration(seconds: 1)),
          senderName: outgoing ? 'Stress Test' : null,
        ),
      );
    }
  }

  void _onPressureChanged() {
    if (!mounted) return;
    final constrained = _pressure.constrained;
    for (final sheet in _sheets) {
      sheet.constrained = constrained;
      if (!constrained) sheet.resumePreparation();
    }
    _syncPlayback();
    setState(() {});
  }

  void _onMessageScroll() {
    if (!_messageScroll.hasClients) return;
    final show = _messageScroll.offset > 180;
    if (show != _showScrollBottom.value) {
      _showScrollBottom.value = show;
    }
  }

  void _syncMessageScrollWork() {
    if (_rasterWorkerCount <= 1) return;
    final scrolling = _messageScroll.positions.any(
      (position) => position.isScrollingNotifier.value,
    );
    _rasterCache.inFlightLimit = scrolling ? 1 : null;
  }

  void _onComposerTextChanged() {
    final nextHasDraft = _composerController.text.trim().isNotEmpty;
    if (nextHasDraft != _hasDraft.value) {
      _hasDraft.value = nextHasDraft;
    }
  }

  void _onComposerFocusChanged() {
    if (_composerFocus.hasFocus && _drawerOpen) {
      setState(() => _drawerOpen = false);
      _syncPlayback();
    }
  }

  bool _tryCopyOrCutComposerSelection({required bool isCut}) {
    final val = _composerController.value;
    if (!val.selection.isValid || val.selection.isCollapsed) {
      return false;
    }
    final selected = val.selection.textInside(val.text);
    final emojiText = _composerController.toEmojiText(selected);
    Clipboard.setData(ClipboardData(text: emojiText));
    // Asynchronous double-write safeguard against native AppKit overwriting
    Future.delayed(const Duration(milliseconds: 30), () {
      Clipboard.setData(ClipboardData(text: emojiText));
    });
    if (isCut) {
      final nextText =
          val.selection.textBefore(val.text) +
          val.selection.textAfter(val.text);
      _composerController.value = TextEditingValue(
        text: nextText,
        selection: TextSelection.collapsed(offset: val.selection.start),
      );
    }
    return true;
  }

  KeyEventResult _handleComposerFocusKeyEvent(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final isMetaOrControl =
        HardwareKeyboard.instance.isMetaPressed ||
        HardwareKeyboard.instance.isControlPressed;
    if (!isMetaOrControl) return KeyEventResult.ignored;

    if (event.logicalKey == LogicalKeyboardKey.keyC) {
      if (_tryCopyOrCutComposerSelection(isCut: false)) {
        return KeyEventResult.handled;
      }
    } else if (event.logicalKey == LogicalKeyboardKey.keyX) {
      if (_tryCopyOrCutComposerSelection(isCut: true)) {
        return KeyEventResult.handled;
      }
    }
    return KeyEventResult.ignored;
  }

  bool _handleGlobalKeyEvent(KeyEvent event) {
    if (event is! KeyDownEvent) return false;
    final isMetaOrControl =
        HardwareKeyboard.instance.isMetaPressed ||
        HardwareKeyboard.instance.isControlPressed;
    if (!isMetaOrControl) return false;

    if (!_composerFocus.hasFocus) return false;

    if (event.logicalKey == LogicalKeyboardKey.keyC) {
      return _tryCopyOrCutComposerSelection(isCut: false);
    } else if (event.logicalKey == LogicalKeyboardKey.keyX) {
      return _tryCopyOrCutComposerSelection(isCut: true);
    }
    return false;
  }

  void _syncPlayback() {
    final active = _foreground && TickerMode.valuesOf(context).enabled;
    final sheetEnabled =
        active &&
        _renderer == ChatRendererMode.fastlottie &&
        !_pressure.constrained;
    final fastEnabled = sheetEnabled && !_reduced;
    _clock.configure(
      playing: active,
      reducedMotion: _reduced,
      maximumFrameRate: stickerThumbnailFrameRate,
    );
    for (final sheet in _sheets) {
      sheet.active = sheetEnabled;
    }
    _rasterCache.enabled = fastEnabled;
    final nextStill = _reduced || _pressure.constrained;
    final composerVisualChanged =
        !identical(_composerController.sheet, _emojiSheet) ||
        _composerController.renderer != _renderer ||
        _composerController.still != nextStill;
    _composerController.catalog = _catalog;
    _composerController.sheet = _emojiSheet;
    _composerController.clock = _clock;
    _composerController.store = _store;
    _composerController.renderer = _renderer;
    _composerController.still = nextStill;
    if (composerVisualChanged && _composerController.text.isNotEmpty) {
      if (WidgetsBinding.instance.schedulerPhase ==
          SchedulerPhase.persistentCallbacks) {
        scheduleMicrotask(() {
          if (!mounted) return;
          // ignore: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member
          _composerController.notifyListeners();
        });
      } else {
        // ignore: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member
        _composerController.notifyListeners();
      }
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncPlayback();
  }

  @override
  void didUpdateWidget(CupertinoChatScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isDark != widget.isDark) {
      _isDark = widget.isDark;
    }
    if (oldWidget.framesPerStrip != widget.framesPerStrip ||
        oldWidget.rasterWorkerCount != widget.rasterWorkerCount) {
      final nextFrames = widget.framesPerStrip ?? _preferredStripSize;
      final force =
          oldWidget.framesPerStrip != widget.framesPerStrip ||
          oldWidget.rasterWorkerCount != widget.rasterWorkerCount;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          unawaited(_setFramesPerStrip(nextFrames, forceRebuild: force));
        }
      });
    }
  }

  Future<void> _setFramesPerStrip(
    int? next, {
    bool forceRebuild = false,
  }) async {
    if (!mounted) return;
    if (!forceRebuild && _framesPerStrip == next) return;
    final oldCache = _rasterCache;
    final nextCache = _createRasterCache(next);
    oldCache.enabled = false;
    _framesPerStrip = next;
    _rasterCache = nextCache;
    _syncMessageScrollWork();
    final cat = _catalog;
    if (cat != null) {
      _setupCatalog(cat, staleCache: oldCache);
    } else {
      setState(() {});
      _scheduleDisposeStale(cache: oldCache);
    }
    _syncPlayback();
    await attachExampleDiskCache(nextCache);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _foreground =
        state == AppLifecycleState.resumed ||
        state == AppLifecycleState.inactive;
    _syncPlayback();
  }

  @override
  void didHaveMemoryPressure() {
    _store.evictCompiledSnapshots();
    _posters.clearIdle();
    _rasterCache.evictUnpinned();
  }

  void _toggleDrawer() {
    if (_drawerOpen) {
      setState(() => _drawerOpen = false);
      _composerFocus.requestFocus();
      _rasterCache.evictUnpinned();
      _stickerSheet?.clearLoadedModels();
    } else {
      _composerFocus.unfocus();
      _prewarmPickerPosters(_selectedTabIndex);
      setState(() => _drawerOpen = true);
    }
    _syncPlayback();
  }

  void _dismissPicker() {
    if (_composerFocus.hasFocus) _composerFocus.unfocus();
    if (_drawerOpen) {
      setState(() => _drawerOpen = false);
      _rasterCache.evictUnpinned();
      _stickerSheet?.clearLoadedModels();
    }
    _syncPlayback();
  }

  void _selectPickerTab(int index) {
    _rasterCache.evictUnpinned();
    _prewarmPickerPosters(index);
    setState(() => _selectedTabIndex = index);
    if (_pickerScroll.hasClients) _pickerScroll.jumpTo(0);
  }

  void _prewarmChatPosters(TgsRemoteCatalog catalog) {
    final sheet = _emojiSheet;
    final cache = sheet?.posterCache;
    if (sheet == null ||
        cache == null ||
        _renderer != ChatRendererMode.fastlottie) {
      return;
    }
    final posters = <PackPoster>{
      if (catalog.emojis.isNotEmpty) ?catalog.emojis.first.poster,
    };
    for (final message in _messages.reversed.take(4)) {
      if (message.sticker case final item?) {
        final poster = item.largePoster ?? item.poster;
        if (poster != null) posters.add(poster);
        if (posters.length >= 6) break;
        continue;
      }
      final text = message.text;
      if (text == null) continue;
      for (final token in catalog.richMessageRegex.allMatches(text)) {
        final item = catalog.findItem(token.group(0)!);
        if (item?.poster case final poster?) {
          posters.add(poster);
        }
        if (posters.length >= 6) break;
      }
      if (posters.length >= 6) break;
    }
    cache.prewarm(posters);
  }

  void _prewarmPickerPosters(int index) {
    final sheet = _emojiSheet;
    final cache = sheet?.posterCache;
    final catalog = _catalog;
    if (sheet == null ||
        cache == null ||
        catalog == null ||
        _renderer != ChatRendererMode.fastlottie) {
      return;
    }
    final tabs = _buildTabs(catalog);
    final tab = tabs[index.clamp(0, tabs.length - 1)];
    cache.prewarm([for (final item in tab.$4.take(5)) ?item.poster]);
  }

  void _setReducedMotion(bool reduced) {
    setState(() => _reducedMotionOverride = reduced);
    _syncPlayback();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_messageScroll.hasClients) return;
      if (_reduced) {
        _messageScroll.jumpTo(0);
        return;
      }
      _messageScroll.animateTo(
        0,
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
      );
    });
  }

  void _sendTextMessage() {
    final raw = _composerController.text.trim();
    if (raw.isEmpty) return;
    final text = StringBuffer();
    final inlineItems = <int, (int, TgsRemoteItem)>{};
    final catalog = _catalog;
    var cursor = 0;
    for (final match
        in catalog?.richMessageRegex.allMatches(raw) ?? const <RegExpMatch>[]) {
      final item = catalog?.findItem(match[0]!);
      if (item == null) continue;
      text.write(raw.substring(cursor, match.start));
      final label = item.shortcode ?? item.unicode ?? item.label;
      inlineItems[text.length] = (label.length, item);
      text.write(label);
      cursor = match.end;
    }
    text.write(raw.substring(cursor));
    _composerController.clear();
    setState(() {
      _messages.add(
        ChatMessage.text(
          id: 'msg_${_messageSeq++}',
          text: text.toString(),
          inlineItems: Map.unmodifiable(inlineItems),
          isOutgoing: true,
          timestamp: DateTime.now(),
        ),
      );
    });
    _scrollToBottom();
  }

  void _sendSticker(TgsRemoteItem item) {
    setState(() {
      _messages.add(
        ChatMessage.sticker(
          id: 'msg_${_messageSeq++}',
          sticker: item,
          isOutgoing: true,
          timestamp: DateTime.now(),
          reloadEpoch: _cacheEpoch,
        ),
      );
    });
    _syncPlayback();
    _scrollToBottom();
  }

  void _insertEmojiShortcode(TgsRemoteItem item) {
    final char = _composerController.charForEmoji(item);
    if (char == null) return;
    final value = _composerController.value;
    final selection = value.selection;
    final insertText = char;
    final text = value.text;
    if (selection.isValid &&
        selection.start >= 0 &&
        selection.end <= text.length) {
      final nextText = text.replaceRange(
        selection.start,
        selection.end,
        insertText,
      );
      _composerController.value = TextEditingValue(
        text: nextText,
        selection: TextSelection.collapsed(
          offset: selection.start + insertText.length,
        ),
      );
    } else {
      final nextText = '$text$insertText';
      _composerController.value = TextEditingValue(
        text: nextText,
        selection: TextSelection.collapsed(offset: nextText.length),
      );
    }
  }

  Future<void> _clearAllCaches() async {
    _posters.clearIdle();
    await _packAssets.clearDisk();
    for (final sheet in _sheets) {
      sheet.clearLoadedModels();
    }
    await _store.clearMemoryAndUrlDiskCache();
    _rasterCache.clear();
    await clearExampleDiskCache();
    if (!mounted) return;
    setState(() {
      _cacheEpoch++;
      for (var i = 0; i < _messages.length; i++) {
        if (_messages[i].sticker != null) {
          _messages[i] = _messages[i].withReloadEpoch(_cacheEpoch);
        }
      }
    });
    for (final sheet in _sheets) {
      sheet.resumePreparation();
    }
  }

  String get _multiFrameActionLabel {
    final count = _preferredStripSize;
    return count != null && count > 1
        ? 'Use $count frames per strip'
        : 'Use adaptive strips';
  }

  String get _stripLabel => _framesPerStrip == null
      ? 'Adaptive strips'
      : 'Frames per strip: $_framesPerStrip';

  Future<void> _showOptionsSheet() async {
    final server = _embeddedServer;
    await showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: const Text('Server & Cache Options'),
        message: Text(
          'Endpoint: ${_catalog?.baseUri ?? '-'}\n'
          'Cache: $_stripLabel · IPC: ${_rasterCache.workerDispatches} | '
          'GPU: ${(_rasterCache.gpuBytes / (1024 * 1024)).toStringAsFixed(1)} MiB\n'
          'Net DL: ${_store.networkDownloads} | URL Disk Hits: ${_store.diskSourceHits} | '
          'Aborted: ${_store.cancelledFetches}',
        ),
        actions: <CupertinoActionSheetAction>[
          if (server != null) ...[
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulatedLatency = Duration.zero;
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Network latency: 0 ms (Local)${server.simulatedLatency.inMilliseconds == 0 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulatedLatency = const Duration(milliseconds: 80);
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Network latency: 80 ms (Fast 4G)${server.simulatedLatency.inMilliseconds == 80 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulatedLatency = const Duration(milliseconds: 220);
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Network latency: 220 ms (Slow 3G)${server.simulatedLatency.inMilliseconds == 220 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulateFailure = !server.simulateFailure;
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Simulate HTTP 503 errors: ${server.simulateFailure ? 'ON' : 'OFF'}',
              ),
            ),
          ],
          CupertinoActionSheetAction(
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() {
                _renderer = _renderer == ChatRendererMode.fastlottie
                    ? ChatRendererMode.lottie
                    : ChatRendererMode.fastlottie;
              });
              _syncPlayback();
            },
            child: Text(
              'Renderer: ${_renderer == ChatRendererMode.fastlottie ? 'FastLottie (Hero Vector + Raster Cache)' : 'Lottie Reference'}',
            ),
          ),
          if (_renderer == ChatRendererMode.fastlottie)
            CupertinoActionSheetAction(
              key: const ValueKey('toggle-strip-size-action'),
              onPressed: () {
                final next = _framesPerStrip == 1
                    ? (_preferredStripSize == 1 ? null : _preferredStripSize)
                    : 1;
                Navigator.of(ctx).pop();
                unawaited(_setFramesPerStrip(next));
              },
              child: Text(
                _framesPerStrip == 1
                    ? _multiFrameActionLabel
                    : 'Use one frame per strip',
              ),
            ),
          CupertinoActionSheetAction(
            onPressed: () {
              final next = !_isDark;
              setState(() => _isDark = next);
              widget.onBrightnessChanged?.call(next);
              Navigator.of(ctx).pop();
            },
            child: Text(
              _isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            ),
          ),
          CupertinoActionSheetAction(
            onPressed: () {
              final next = !_reduced;
              Navigator.of(ctx).pop();
              _setReducedMotion(next);
            },
            child: Text(
              'Reduce Motion: ${_reduced ? 'ON (Static)' : 'OFF (Animated)'}',
            ),
          ),
          CupertinoActionSheetAction(
            onPressed: () {
              Navigator.of(ctx).pop();
              unawaited(_showTelemetryDialog());
            },
            child: const Text('View Server & Cache Telemetry'),
          ),
          CupertinoActionSheetAction(
            isDestructiveAction: true,
            onPressed: () {
              Navigator.of(ctx).pop();
              unawaited(_clearAllCaches());
            },
            child: const Text('Clear URL Cache & .flcache (Reload over HTTP)'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.of(ctx).pop(),
          child: const Text('Close'),
        ),
      ),
    );
  }

  Future<void> _showTelemetryDialog() async {
    final s = _embeddedServer?.stats.value;
    await showCupertinoDialog<void>(
      context: context,
      builder: (ctx) => CupertinoAlertDialog(
        title: const Text('Network & Raster Telemetry'),
        content: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(
            'GZip & Compile Time: ${((_store.inflateUs + _store.compileUs) / 1000).toStringAsFixed(2)} ms\n'
            'Server: ${_catalog?.baseUri ?? '-'}\n'
            'HTTP Requests: ${s?.requests ?? '-'}\n'
            'HTTP TGS Served: ${s?.tgsRequests ?? _store.networkDownloads} '
            '(${((s?.bytesServed ?? _store.downloadedBytes) / 1024).toStringAsFixed(1)} KB)\n'
            'URL Disk Cache Hits: ${_store.diskSourceHits}\n'
            'RAM Model Hits: ${_store.hits}\n'
            'Aborted Sockets: ${_store.cancelledFetches}\n'
            'Buffering: $_stripLabel\n'
            'GPU VRAM: ${(_rasterCache.gpuBytes / (1024 * 1024)).toStringAsFixed(2)} MiB '
            '(Resv ${(_rasterCache.reservedBytes / (1024 * 1024)).toStringAsFixed(2)})\n'
            'Worker Dispatches (IPC): ${_rasterCache.workerDispatches}\n'
            'Strip/Buffer Swaps: ${_rasterCache.bufferSwaps}\n'
            'Cache Hits / Misses: ${_rasterCache.hits} / ${_rasterCache.misses}\n'
            'LZ4 .flcache Hits: ${_rasterCache.compressedCacheHits}\n'
            'Vector RLE Frames: ${_rasterCache.vectorRasterizedFrames}',
          ),
        ),
        actions: <CupertinoDialogAction>[
          CupertinoDialogAction(
            isDefaultAction: true,
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _showStickerPreview(TgsRemoteItem item) async {
    await showCupertinoDialog<void>(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => CupertinoAlertDialog(
        title: Text(item.packTitle),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            SizedBox(
              width: 180,
              height: 180,
              child: HeroNetworkSticker(
                item: item,
                posters: _enableEmojiPosters ? _posters : null,
                store: _store,
                renderer: _renderer,
                animate: !_reduced,
                size: 180,
                placeholderColor: _palette.tilePlaceholder,
                borderColor: _palette.incomingBorder,
                accentColor: _palette.accent,
                secondaryTextColor: _palette.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${item.label}${item.unicode != null ? ' (${item.unicode})' : ''}${item.shortcode != null ? ' · ${item.shortcode}' : ''}',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: _palette.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              '${item.fileName} · ${(item.bytes / 1024).toStringAsFixed(1)} KB',
              style: TextStyle(fontSize: 12, color: _palette.textSecondary),
            ),
            const SizedBox(height: 2),
            Text(
              item.relativePath,
              style: TextStyle(fontSize: 11, color: _palette.textSecondary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        actions: <CupertinoDialogAction>[
          CupertinoDialogAction(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close'),
          ),
          if (item.kind == TgsItemKind.sticker)
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () {
                Navigator.of(ctx).pop();
                _sendSticker(item);
              },
              child: const Text('Send Sticker'),
            ),
          if (item.kind == TgsItemKind.emoji)
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () {
                Navigator.of(ctx).pop();
                _insertEmojiShortcode(item);
              },
              child: Text(
                'Insert ${item.unicode != null ? '${item.unicode} ' : ''}${item.shortcode ?? 'Emoji'}',
              ),
            ),
        ],
      ),
    );
  }

  void _showMessageOptions(ChatMessage message) {
    final raw = message.text;
    if (raw == null || raw.isEmpty) return;
    final cat = _catalog;
    final emojiText = cat != null ? cat.toEmojiText(raw) : raw;
    final shortcodeText = cat != null ? cat.toShortcodeText(raw) : raw;
    showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: Text(emojiText, maxLines: 2, overflow: TextOverflow.ellipsis),
        actions: [
          CupertinoActionSheetAction(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: emojiText));
              Navigator.of(ctx).pop();
            },
            child: const Text('Copy (Emoji)'),
          ),
          if (shortcodeText != emojiText)
            CupertinoActionSheetAction(
              onPressed: () {
                Clipboard.setData(ClipboardData(text: shortcodeText));
                Navigator.of(ctx).pop();
              },
              child: const Text('Copy (Shortcode)'),
            ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.of(ctx).pop(),
          child: const Text('Cancel'),
        ),
      ),
    );
  }

  List<(_DrawerTab kind, String id, String label, List<TgsRemoteItem> items)>
  _buildTabs(TgsRemoteCatalog catalog) => [
    (_DrawerTab.all, '__all__', 'All', catalog.stickers),
    (_DrawerTab.emoji, '__emoji__', 'Emoji', catalog.emojis),
    for (final pack in catalog.emojiPacks)
      (_DrawerTab.emoji, pack.id, pack.title, pack.items),
    for (final pack in catalog.stickerPacks)
      (_DrawerTab.pack, pack.id, pack.title, pack.items),
  ];

  @override
  void dispose() {
    HardwareKeyboard.instance.removeHandler(_handleGlobalKeyEvent);
    WidgetsBinding.instance.removeObserver(this);
    _messageScroll.dispose();
    _pickerScroll.dispose();
    _composerController.dispose();
    _composerFocus.dispose();
    _showScrollBottom.dispose();
    _hasDraft.dispose();
    _pressure.dispose();
    for (final sheet in _sheets) {
      sheet.dispose();
    }
    for (final stale in _disposingSheets) {
      stale.dispose();
    }
    _disposingSheets.clear();
    _posters.dispose();
    _packAssets.dispose();
    _rasterCache.dispose();
    for (final stale in _disposingCaches) {
      stale.dispose();
    }
    _disposingCaches.clear();
    _playbackBudget.dispose();
    _clock.dispose();
    if (widget.store == null) {
      _store.dispose();
    }
    unawaited(_embeddedServer?.close(force: true));
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final palette = _palette;
    final catalog = _catalog;

    return CupertinoTheme(
      data: CupertinoThemeData(
        brightness: palette.brightness,
        primaryColor: palette.accent,
        scaffoldBackgroundColor: palette.background,
      ),
      child: CupertinoPageScaffold(
        backgroundColor: palette.background,
        navigationBar: CupertinoNavigationBar(
          automaticallyImplyLeading: false,
          backgroundColor: _opaqueChatHeader
              ? Color.alphaBlend(palette.navBar, palette.background)
              : palette.navBar,
          border: Border(
            bottom: BorderSide(color: palette.separator, width: 0.5),
          ),
          leading: _HeaderAvatar(
            catalog: catalog,
            emojiSheet: _emojiSheet,
            clock: _clock,
            store: _store,
            renderer: _renderer,
            still: _reduced || _pressure.constrained,
            palette: palette,
          ),
          middle: Align(
            alignment: Alignment.centerLeft,
            child: _HeaderStatus(
              catalog: catalog,
              store: _store,
              server: _embeddedServer,
              renderer: _renderer,
              palette: palette,
            ),
          ),
          trailing: CupertinoButton(
            key: const ValueKey('chat-options-button'),
            padding: EdgeInsets.zero,
            minimumSize: const Size.square(32),
            onPressed: _showOptionsSheet,
            child: Icon(
              CupertinoIcons.ellipsis_circle,
              size: 24,
              color: palette.accent,
            ),
          ),
        ),
        child: SafeArea(
          top: true,
          bottom: true,
          child: _booting
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CupertinoActivityIndicator(radius: 14),
                      const SizedBox(height: 12),
                      Text(
                        'Starting local HTTP TGS server…',
                        style: TextStyle(
                          fontSize: 14,
                          color: palette.textSecondary,
                        ),
                      ),
                    ],
                  ),
                )
              : _bootError != null || catalog == null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          CupertinoIcons.wifi_slash,
                          size: 40,
                          color: palette.textSecondary,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Could not connect to the TGS server:\n$_bootError',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: palette.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 16),
                        CupertinoButton.filled(
                          onPressed: _bootstrap,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                )
              : Column(
                  children: [
                    Expanded(
                      child: Stack(
                        children: [
                          GestureDetector(
                            behavior: HitTestBehavior.translucent,
                            onTap: _dismissPicker,
                            child: ListView.builder(
                              key: const ValueKey('cupertino-message-list'),
                              controller: _messageScroll,
                              reverse: true,
                              physics: const FastBouncingScrollPhysics(
                                parent: AlwaysScrollableScrollPhysics(),
                              ),
                              scrollCacheExtent:
                                  const ScrollCacheExtent.pixels(0),
                              addAutomaticKeepAlives: false,
                              padding: const EdgeInsets.fromLTRB(
                                12,
                                12,
                                12,
                                12,
                              ),
                              itemCount: _messages.length,
                              itemBuilder: (context, visualIndex) {
                                final index =
                                    _messages.length - 1 - visualIndex;
                                final msg = _messages[index];
                                return _ChatMessageRow(
                                  key: ValueKey(
                                    '${msg.id}_${msg.reloadEpoch}',
                                  ),
                                  message: msg,
                                  catalog: catalog,
                                  emojiSheet: _emojiSheet!,
                                  posters: _enableEmojiPosters
                                      ? _posters
                                      : null,
                                  clock: _clock,
                                  store: _store,
                                  renderer: _renderer,
                                  still: _reduced || _pressure.constrained,
                                  animateHero: !_reduced,
                                  palette: palette,
                                  onStickerLongPress: _showStickerPreview,
                                  onMessageLongPress: _showMessageOptions,
                                );
                              },
                            ),
                          ),
                          Positioned(
                            right: 12,
                            bottom: 12,
                            child: RepaintBoundary(
                              child: ValueListenableBuilder<bool>(
                                valueListenable: _showScrollBottom,
                                builder: (context, visible, _) => IgnorePointer(
                                  ignoring: !visible,
                                  child: AnimatedOpacity(
                                    duration: _reduced
                                        ? Duration.zero
                                        : const Duration(milliseconds: 160),
                                    opacity: visible ? 1 : 0,
                                    child: CupertinoButton(
                                      key: const ValueKey(
                                        'scroll-to-bottom-btn',
                                      ),
                                      padding: EdgeInsets.zero,
                                      minimumSize: const Size.square(38),
                                      onPressed: _scrollToBottom,
                                      child: Container(
                                        width: 38,
                                        height: 38,
                                        decoration: BoxDecoration(
                                          color: palette.composerBar,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: palette.fieldBorder,
                                            width: 0.7,
                                          ),
                                        ),
                                        child: Icon(
                                          CupertinoIcons.chevron_down,
                                          size: 18,
                                          color: palette.textPrimary,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    _ComposerBar(
                      controller: _composerController,
                      focusNode: _composerFocus,
                      drawerOpen: _drawerOpen,
                      hasDraftListenable: _hasDraft,
                      palette: palette,
                      formatter: _shortcodeFormatter,
                      onToggleDrawer: _toggleDrawer,
                      onSend: _sendTextMessage,
                    ),
                    if (_drawerOpen)
                      _StickerPickerDrawer(
                        key: const ValueKey('sticker-picker-panel'),
                        catalog: catalog,
                        tabs: _buildTabs(catalog),
                        selectedTabIndex: _selectedTabIndex,
                        onTabChanged: _selectPickerTab,
                        scrollController: _pickerScroll,
                        stickerSheet: _stickerSheet!,
                        emojiSheet: _pickerEmojiSheet ?? _emojiSheet!,
                        clock: _clock,
                        store: _store,
                        renderer: _renderer,
                        still: _reduced || _pressure.constrained,
                        palette: palette,
                        onStickerTap: _sendSticker,
                        onEmojiTap: _insertEmojiShortcode,
                        onItemLongPress: _showStickerPreview,
                      ),
                  ],
                ),
        ),
      ),
    );
  }
}

class _HeaderAvatar extends StatelessWidget {
  const _HeaderAvatar({
    required this.catalog,
    required this.emojiSheet,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    required this.palette,
  });

  final TgsRemoteCatalog? catalog;
  final StickerSheet? emojiSheet;
  final StickerClock clock;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final bool still;
  final _Palette palette;

  @override
  Widget build(BuildContext context) {
    final hasBadge =
        catalog != null && catalog!.emojis.isNotEmpty && emojiSheet != null;
    return Container(
      width: 34,
      height: 34,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [palette.outgoingBubbleTop, palette.outgoingBubbleBottom],
        ),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: hasBadge
            ? InlineNetworkSticker(
                item: catalog!.emojis.first,
                sheet: emojiSheet!,
                clock: clock,
                store: store,
                renderer: renderer,
                still: still,
                size: 24,
                placeholderColor: CupertinoColors.white.withValues(alpha: 0.2),
              )
            : const Icon(
                CupertinoIcons.bolt_fill,
                size: 18,
                color: CupertinoColors.white,
              ),
      ),
    );
  }
}

class _HeaderStatus extends StatelessWidget {
  const _HeaderStatus({
    required this.catalog,
    required this.store,
    required this.server,
    required this.renderer,
    required this.palette,
  });

  final TgsRemoteCatalog? catalog;
  final NetworkTgsStore store;
  final LocalTgsServer? server;
  final ChatRendererMode renderer;
  final _Palette palette;

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: Listenable.merge([store, if (server != null) server!.stats]),
    builder: (context, _) {
      final subtitle = catalog == null
          ? 'Connecting…'
          : store.inFlightDownloads > 0 || store.queuedDownloads > 0
          ? 'HTTP loading ${store.inFlightDownloads + store.queuedDownloads} · ${catalog!.baseUri.authority}'
          : 'HTTP ${catalog!.baseUri.authority} · DL ${store.networkDownloads} · Disk ${store.diskSourceHits}';
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            renderer == ChatRendererMode.fastlottie
                ? 'FastLottie Network'
                : 'Lottie Baseline',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: palette.textPrimary,
            ),
          ),
          Text(
            subtitle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w400,
              color: palette.textSecondary,
            ),
          ),
        ],
      );
    },
  );
}

class _ComposerBar extends StatelessWidget {
  const _ComposerBar({
    required this.controller,
    required this.focusNode,
    required this.drawerOpen,
    required this.hasDraftListenable,
    required this.palette,
    required this.onToggleDrawer,
    required this.onSend,
    this.formatter,
  });

  final EmojiComposerController controller;
  final FocusNode focusNode;
  final bool drawerOpen;
  final ValueListenable<bool> hasDraftListenable;
  final _Palette palette;
  final VoidCallback onToggleDrawer;
  final VoidCallback onSend;
  final TextInputFormatter? formatter;

  @override
  Widget build(BuildContext context) => Container(
    decoration: BoxDecoration(
      color: palette.composerBar,
      border: Border(top: BorderSide(color: palette.separator, width: 0.5)),
    ),
    padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        CupertinoButton(
          key: const ValueKey('composer-picker-toggle'),
          padding: const EdgeInsets.all(6),
          minimumSize: const Size.square(36),
          onPressed: onToggleDrawer,
          child: Icon(
            drawerOpen ? CupertinoIcons.keyboard : CupertinoIcons.smiley,
            size: 26,
            color: drawerOpen ? palette.accent : palette.textSecondary,
          ),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: Actions(
            actions: {
              CopySelectionTextIntent: CallbackAction<CopySelectionTextIntent>(
                onInvoke: (intent) {
                  final val = controller.value;
                  if (!val.selection.isValid || val.selection.isCollapsed) {
                    return null;
                  }
                  final selected = val.selection.textInside(val.text);
                  final decoded = controller.toEmojiText(selected);
                  Clipboard.setData(ClipboardData(text: decoded));
                  Future.delayed(const Duration(milliseconds: 30), () {
                    Clipboard.setData(ClipboardData(text: decoded));
                  });
                  if (intent.collapseSelection) {
                    final nextText =
                        val.selection.textBefore(val.text) +
                        val.selection.textAfter(val.text);
                    controller.value = TextEditingValue(
                      text: nextText,
                      selection: TextSelection.collapsed(
                        offset: val.selection.start,
                      ),
                    );
                  }
                  return null;
                },
              ),
            },
            child: CupertinoTextField(
              key: const ValueKey('chat-composer-field'),
              controller: controller,
              focusNode: focusNode,
              minLines: 1,
              maxLines: 5,
              strutStyle: const StrutStyle(
                fontSize: 15,
                height: 1.4,
                forceStrutHeight: true,
              ),
              inputFormatters: [?formatter],
              contextMenuBuilder: (context, editableTextState) {
                final buttonItems = editableTextState.contextMenuButtonItems;
                final modifiedItems = buttonItems.map((item) {
                  final isCopy =
                      item.type == ContextMenuButtonType.copy ||
                      item.kind == ContextMenuButtonKind.copy ||
                      item.label?.toLowerCase() == 'copy';
                  if (isCopy) {
                    return item.copyWith(
                      onPressed: () {
                        final val = controller.value;
                        if (val.selection.isValid &&
                            !val.selection.isCollapsed) {
                          final selected = val.selection.textInside(val.text);
                          final decoded = controller.toEmojiText(selected);
                          Clipboard.setData(ClipboardData(text: decoded));
                          Future.delayed(const Duration(milliseconds: 30), () {
                            Clipboard.setData(ClipboardData(text: decoded));
                          });
                        }
                        editableTextState.hideToolbar();
                      },
                    );
                  }
                  final isCut =
                      item.type == ContextMenuButtonType.cut ||
                      item.kind == ContextMenuButtonKind.cut ||
                      item.label?.toLowerCase() == 'cut';
                  if (isCut) {
                    return item.copyWith(
                      onPressed: () {
                        final val = controller.value;
                        if (val.selection.isValid &&
                            !val.selection.isCollapsed) {
                          final selected = val.selection.textInside(val.text);
                          final decoded = controller.toEmojiText(selected);
                          Clipboard.setData(ClipboardData(text: decoded));
                          Future.delayed(const Duration(milliseconds: 30), () {
                            Clipboard.setData(ClipboardData(text: decoded));
                          });
                          final nextText =
                              val.selection.textBefore(val.text) +
                              val.selection.textAfter(val.text);
                          controller.value = TextEditingValue(
                            text: nextText,
                            selection: TextSelection.collapsed(
                              offset: val.selection.start,
                            ),
                          );
                        }
                        editableTextState.hideToolbar();
                      },
                    );
                  }
                  return item;
                }).toList();
                return CupertinoAdaptiveTextSelectionToolbar.buttonItems(
                  anchors: editableTextState.contextMenuAnchors,
                  buttonItems: modifiedItems,
                );
              },
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => onSend(),
              placeholder: 'Message or insert animated emoji…',
              placeholderStyle: TextStyle(
                color: palette.textSecondary.withValues(alpha: 0.75),
                fontSize: 15,
              ),
              style: TextStyle(color: palette.textPrimary, fontSize: 15),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
              decoration: BoxDecoration(
                color: palette.fieldFill,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: palette.fieldBorder, width: 0.7),
              ),
            ),
          ),
        ),
        const SizedBox(width: 6),
        ValueListenableBuilder<bool>(
          valueListenable: hasDraftListenable,
          builder: (context, canSend, _) => CupertinoButton(
            key: const ValueKey('composer-send-button'),
            padding: EdgeInsets.zero,
            minimumSize: const Size.square(36),
            onPressed: canSend ? onSend : null,
            child: AnimatedContainer(
              duration: MediaQuery.disableAnimationsOf(context)
                  ? Duration.zero
                  : const Duration(milliseconds: 140),
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: canSend ? palette.accent : palette.pillInactive,
                shape: BoxShape.circle,
              ),
              child: Icon(
                CupertinoIcons.arrow_up,
                size: 19,
                color: canSend
                    ? CupertinoColors.white
                    : palette.textSecondary.withValues(alpha: 0.55),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

class _StickerPickerDrawer extends StatelessWidget {
  const _StickerPickerDrawer({
    super.key,
    required this.catalog,
    required this.tabs,
    required this.selectedTabIndex,
    required this.onTabChanged,
    required this.scrollController,
    required this.stickerSheet,
    required this.emojiSheet,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    required this.palette,
    required this.onStickerTap,
    required this.onEmojiTap,
    required this.onItemLongPress,
  });

  final TgsRemoteCatalog catalog;
  final List<
    (_DrawerTab kind, String id, String label, List<TgsRemoteItem> items)
  >
  tabs;
  final int selectedTabIndex;
  final ValueChanged<int> onTabChanged;
  final ScrollController scrollController;
  final StickerSheet stickerSheet;
  final StickerSheet emojiSheet;
  final StickerClock clock;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final bool still;
  final _Palette palette;
  final ValueChanged<TgsRemoteItem> onStickerTap;
  final ValueChanged<TgsRemoteItem> onEmojiTap;
  final ValueChanged<TgsRemoteItem> onItemLongPress;

  @override
  Widget build(BuildContext context) {
    final safeIndex = selectedTabIndex.clamp(0, tabs.length - 1);
    final activeTab = tabs[safeIndex];
    final isEmojiTab = activeTab.$1 == _DrawerTab.emoji;
    final items = activeTab.$4;
    final sheet = isEmojiTab ? emojiSheet : stickerSheet;
    final deferStickerRasterDuringFling =
        !isEmojiTab &&
        !kIsWeb &&
        defaultTargetPlatform == TargetPlatform.android;
    final panelHeight = math.min(
      310.0,
      math.max(220.0, MediaQuery.sizeOf(context).height * 0.34),
    );

    return Container(
      height: panelHeight,
      decoration: BoxDecoration(
        color: palette.drawerBackground,
        border: Border(top: BorderSide(color: palette.separator, width: 0.5)),
      ),
      child: Column(
        children: [
          SizedBox(
            height: 42,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              itemCount: tabs.length,
              separatorBuilder: (_, _) => const SizedBox(width: 6),
              itemBuilder: (context, idx) {
                final selected = idx == safeIndex;
                final tab = tabs[idx];
                return GestureDetector(
                  key: ValueKey('picker-tab-${tab.$2}'),
                  onTap: () => onTabChanged(idx),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: selected
                          ? palette.pillActive
                          : palette.pillInactive,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(
                      '${tab.$3} (${tab.$4.length})',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: selected
                            ? CupertinoColors.white
                            : palette.textSecondary,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) => RepaintBoundary(
                child: GridView.builder(
                  key: const ValueKey('sticker-picker-grid'),
                  controller: scrollController,
                  physics: const FastBouncingScrollPhysics(
                    parent: AlwaysScrollableScrollPhysics(),
                  ),
                  padding: const EdgeInsets.fromLTRB(8, 2, 8, 10),
                  scrollCacheExtent: const ScrollCacheExtent.pixels(0),
                  addAutomaticKeepAlives: false,
                  addRepaintBoundaries: false,
                  itemCount: items.length,
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 5,
                        crossAxisSpacing: 6,
                        mainAxisSpacing: 6,
                      ),
                  itemBuilder: (context, index) {
                    final item = items[index];
                    return Semantics(
                      button: true,
                      label: isEmojiTab
                          ? 'Insert emoji ${item.label}'
                          : 'Send sticker ${item.label}',
                      child: GestureDetector(
                        key: ValueKey(
                          isEmojiTab
                              ? 'picker-emoji-$index'
                              : 'send-sticker-$index',
                        ),
                        behavior: HitTestBehavior.opaque,
                        onTap: () => isEmojiTab
                            ? onEmojiTap(item)
                            : onStickerTap(item),
                        onLongPress: () => onItemLongPress(item),
                        child: Padding(
                          padding: const EdgeInsets.all(4),
                          child: InlineNetworkSticker(
                            item: item,
                            sheet: sheet,
                            clock: clock,
                            store: store,
                            renderer: renderer,
                            still: still,
                            size: constraints.maxWidth / 4.8,
                            placeholderColor: palette.tilePlaceholder,
                            repaintBoundary: false,
                            deferRasterNearFlingExit:
                                deferStickerRasterDuringFling,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatMessageRow extends StatelessWidget {
  const _ChatMessageRow({
    super.key,
    required this.message,
    required this.catalog,
    required this.emojiSheet,
    required this.posters,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    required this.animateHero,
    required this.palette,
    required this.onStickerLongPress,
    this.onMessageLongPress,
  });

  final ChatMessage message;
  final TgsRemoteCatalog catalog;
  final StickerSheet emojiSheet;
  final PackPosterCache? posters;
  final StickerClock clock;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final bool still;
  final bool animateHero;
  final _Palette palette;
  final ValueChanged<TgsRemoteItem> onStickerLongPress;
  final ValueChanged<ChatMessage>? onMessageLongPress;

  String _formatTime(DateTime t) {
    final h = t.hour.toString().padLeft(2, '0');
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    final align = message.isOutgoing
        ? Alignment.centerRight
        : Alignment.centerLeft;

    if (message.sticker != null) {
      final item = message.sticker!;
      return Align(
        alignment: align,
        child: Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Column(
            crossAxisAlignment: message.isOutgoing
                ? CrossAxisAlignment.end
                : CrossAxisAlignment.start,
            children: [
              if (!message.isOutgoing && message.senderName != null)
                Padding(
                  padding: const EdgeInsets.only(left: 4, bottom: 4),
                  child: Text(
                    message.senderName!,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: palette.accent,
                    ),
                  ),
                ),
              Stack(
                children: [
                  GestureDetector(
                    onLongPress: () => onStickerLongPress(item),
                    child: HeroNetworkSticker(
                      key: ValueKey('sent-sticker-${message.id}'),
                      item: item,
                      posters: posters,
                      store: store,
                      renderer: renderer,
                      animate: animateHero,
                      size: 160,
                      placeholderColor: palette.tilePlaceholder,
                      borderColor: palette.incomingBorder,
                      accentColor: palette.accent,
                      secondaryTextColor: palette.textSecondary,
                    ),
                  ),
                  Positioned(
                    right: 6,
                    bottom: 4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0x88000000),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _formatTime(message.timestamp),
                            style: const TextStyle(
                              fontSize: 11,
                              color: CupertinoColors.white,
                            ),
                          ),
                          if (message.isOutgoing) ...[
                            const SizedBox(width: 3),
                            const Icon(
                              CupertinoIcons.checkmark_alt,
                              size: 12,
                              color: CupertinoColors.white,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

    final text = message.text ?? '';
    final maxWidth = MediaQuery.sizeOf(context).width * 0.78;
    final textScaleFactor = MediaQuery.textScalerOf(context).scale(16) / 16.0;
    final inlineEmojiSize = 16.0 * textScaleFactor * 1.45;
    final (:spans, :isJumboEmojiOnly) = _parseRichSpans(
      text,
      catalog,
      inlineEmojiSize,
      textScaleFactor,
      message.isOutgoing
          ? CupertinoColors.white.withValues(alpha: 0.25)
          : palette.tilePlaceholder,
    );

    if (isJumboEmojiOnly) {
      return Align(
        alignment: align,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onLongPress: onMessageLongPress != null
                ? () => onMessageLongPress!(message)
                : null,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: message.isOutgoing
                    ? CrossAxisAlignment.end
                    : CrossAxisAlignment.start,
                children: [
                  if (!message.isOutgoing && message.senderName != null)
                    Padding(
                      padding: const EdgeInsets.only(left: 4, bottom: 4),
                      child: Text(
                        message.senderName!,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: palette.accent,
                        ),
                      ),
                    ),
                  Text.rich(TextSpan(children: spans)),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 7,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0x88000000),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _formatTime(message.timestamp),
                          style: const TextStyle(
                            fontSize: 11,
                            color: CupertinoColors.white,
                          ),
                        ),
                        if (message.isOutgoing) ...[
                          const SizedBox(width: 3),
                          const Icon(
                            CupertinoIcons.checkmark_alt,
                            size: 12,
                            color: CupertinoColors.white,
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final bubbleRadius = BorderRadius.only(
      topLeft: const Radius.circular(18),
      topRight: const Radius.circular(18),
      bottomLeft: Radius.circular(message.isOutgoing ? 18 : 6),
      bottomRight: Radius.circular(message.isOutgoing ? 6 : 18),
    );

    return Align(
      alignment: align,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onLongPress: onMessageLongPress != null
              ? () => onMessageLongPress!(message)
              : null,
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.fromLTRB(13, 9, 13, 8),
            decoration: BoxDecoration(
              color: message.isOutgoing ? null : palette.incomingBubble,
              gradient: message.isOutgoing
                  ? LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        palette.outgoingBubbleTop,
                        palette.outgoingBubbleBottom,
                      ],
                    )
                  : null,
              borderRadius: bubbleRadius,
              border: message.isOutgoing
                  ? null
                  : Border.all(color: palette.incomingBorder, width: 0.7),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!message.isOutgoing && message.senderName != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 3),
                    child: Text(
                      message.senderName!,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: palette.accent,
                      ),
                    ),
                  ),
                Text.rich(
                  TextSpan(children: spans),
                  style: TextStyle(
                    fontSize: 16,
                    height: 1.35,
                    color: message.isOutgoing
                        ? palette.outgoingText
                        : palette.textPrimary,
                  ),
                ),
                const SizedBox(height: 3),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _formatTime(message.timestamp),
                      style: TextStyle(
                        fontSize: 11,
                        color: message.isOutgoing
                            ? CupertinoColors.white.withValues(alpha: 0.72)
                            : palette.textSecondary,
                      ),
                    ),
                    if (message.isOutgoing) ...[
                      const SizedBox(width: 3),
                      Icon(
                        CupertinoIcons.checkmark_alt,
                        size: 13,
                        color: CupertinoColors.white.withValues(alpha: 0.85),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  ({List<InlineSpan> spans, bool isJumboEmojiOnly}) _parseRichSpans(
    String text,
    TgsRemoteCatalog catalog,
    double emojiSize,
    double textScaleFactor,
    Color placeholderColor,
  ) {
    final references = message.resolveInlineItems(catalog);
    final tokens =
        <({TgsRemoteItem? item, String? text, String? staticEmoji})>[];
    var emojiOnly = true;
    var emojiCount = 0;

    void appendTextGap(String gap) {
      if (gap.isEmpty) return;
      var gapCursor = 0;
      for (final match in unicodeEmojiRegex.allMatches(gap)) {
        if (match.start > gapCursor) {
          final plain = gap.substring(gapCursor, match.start);
          if (plain.trim().isNotEmpty) emojiOnly = false;
          tokens.add((item: null, text: plain, staticEmoji: null));
        }
        tokens.add((item: null, text: null, staticEmoji: match.group(0)!));
        emojiCount++;
        gapCursor = match.end;
      }
      if (gapCursor < gap.length) {
        final tail = gap.substring(gapCursor);
        if (tail.trim().isNotEmpty) emojiOnly = false;
        tokens.add((item: null, text: tail, staticEmoji: null));
      }
    }

    var cursor = 0;
    for (final MapEntry(key: start, value: (length, item))
        in references.entries) {
      if (start > cursor) {
        appendTextGap(text.substring(cursor, start));
      }
      tokens.add((item: item, text: null, staticEmoji: null));
      emojiCount++;
      cursor = start + length;
    }
    if (cursor < text.length) {
      appendTextGap(text.substring(cursor));
    }

    final isJumboEmojiOnly = emojiOnly && emojiCount >= 1 && emojiCount <= 3;
    final targetSize = isJumboEmojiOnly
        ? _telegramEmojiBoxSize(
            emojiOnlyCount: emojiCount,
            inlineSize: emojiSize,
            textScaleFactor: textScaleFactor,
          )
        : emojiSize;
    final horizontalPad = isJumboEmojiOnly ? 2.0 : 1.5;

    final spans = <InlineSpan>[];
    for (final token in tokens) {
      if (token.item case final item?) {
        spans.add(
          WidgetSpan(
            alignment: PlaceholderAlignment.middle,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: horizontalPad),
              child: InlineNetworkSticker(
                item: item,
                sheet: emojiSheet,
                clock: clock,
                store: store,
                renderer: renderer,
                still: still,
                size: targetSize,
                placeholderColor: placeholderColor,
                deferRasterNearFlingExit: true,
              ),
            ),
          ),
        );
      } else if (token.staticEmoji case final emoji?) {
        spans.add(
          WidgetSpan(
            alignment: PlaceholderAlignment.middle,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: horizontalPad),
              child: _InlineStaticEmoji(emoji: emoji, size: targetSize),
            ),
          ),
        );
      } else if (token.text case final plain?) {
        if (!isJumboEmojiOnly || plain.trim().isNotEmpty) {
          spans.add(TextSpan(text: plain));
        }
      }
    }
    if (spans.isEmpty) {
      spans.add(TextSpan(text: text));
    }
    return (spans: spans, isJumboEmojiOnly: isJumboEmojiOnly);
  }
}

/// Renders a static OS emoji inside a square box matching [InlineNetworkSticker]
/// so animated and static fallback emojis align and scale identically.
class _InlineStaticEmoji extends StatelessWidget {
  const _InlineStaticEmoji({required this.emoji, required this.size});

  final String emoji;
  final double size;

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: size,
    child: Center(
      child: Text(
        emoji,
        textScaler: TextScaler.noScaling,
        style: TextStyle(
          fontSize: _normalizedStaticEmojiFontSize(size),
          height: 1.0,
        ),
      ),
    ),
  );
}

/// Inline emoji and sticker-grid thumbnail backed by [StickerSheet] +
/// [FastLottieRasterCache] + [NetworkTgsStore].
class InlineNetworkSticker extends StatefulWidget {
  const InlineNetworkSticker({
    super.key,
    required this.item,
    required this.sheet,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    this.size = 24,
    this.placeholderColor = const Color(0xff232636),
    this.repaintBoundary = true,
    this.deferRasterNearFlingExit = false,
  });

  final TgsRemoteItem item;
  final StickerSheet sheet;
  final StickerClock clock;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final bool still;
  final double size;
  final Color placeholderColor;
  final bool repaintBoundary;

  /// Reuses the current image when a vertical fling is about to carry this
  /// emoji out of its viewport.
  final bool deferRasterNearFlingExit;

  @override
  State<InlineNetworkSticker> createState() => _InlineNetworkStickerState();
}

class _InlineNetworkStickerState extends State<InlineNetworkSticker> {
  bool _pinned = false;
  EmojiPosterLease? _poster;
  ScrollPosition? _scrollPosition;
  RenderAbstractViewport? _viewport;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncScrollPosition();
  }

  void _syncScrollPosition() {
    _scrollPosition = widget.deferRasterNearFlingExit
        ? Scrollable.maybeOf(context, axis: Axis.vertical)?.position
        : null;
    _viewport = null;
  }

  bool _shouldDeferRaster(Size size) {
    final position = _scrollPosition;
    if (position == null || !position.isScrollingNotifier.value) return false;
    // ScrollPosition exposes the activity to ScrollPosition subclasses.
    // ignore: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member
    final activity = position.activity;
    if (activity is! BallisticScrollActivity) return false;
    final velocity = activity.velocity;
    if (velocity.abs() < 600) return false;

    final box = context.findRenderObject();
    if (box is! RenderBox || !box.attached) return false;
    final viewport = _viewport ??= RenderAbstractViewport.maybeOf(box);
    if (viewport == null || !viewport.attached) return false;
    final bounds = viewport.paintBounds;
    final top = box.localToGlobal(Offset.zero, ancestor: viewport).dy;
    final movesUp =
        (velocity > 0) == (position.axisDirection == AxisDirection.down);
    final distance = movesUp
        ? top + size.height - bounds.top
        : bounds.bottom - top;
    // Leave enough time for several raster and upload slots under load.
    return distance <= velocity.abs() * .12;
  }

  void _syncPin() {
    final staticPoster =
        !widget.item.animated &&
        widget.sheet.posterCache != null &&
        widget.item.poster != null;
    final shouldPin =
        widget.renderer == ChatRendererMode.fastlottie && !staticPoster;
    if (shouldPin == _pinned) return;
    if (shouldPin) {
      widget.sheet.acquirePin(widget.item.urlString);
    } else {
      widget.sheet.releasePin(widget.item.urlString);
    }
    _pinned = shouldPin;
  }

  void _syncPoster() {
    final cache = widget.sheet.posterCache;
    final poster =
        widget.renderer == ChatRendererMode.fastlottie || !widget.item.animated
        ? widget.item.poster
        : null;
    if (poster?.uri == _poster?.uri) return;
    _poster?.release();
    _poster = poster == null ? null : cache?.acquire(poster);
  }

  Widget _reference(bool still) => SizedBox.square(
    dimension: widget.size,
    child: _ReferenceNetworkCell(
      url: widget.item.urlString,
      store: widget.store,
      clock: widget.clock,
      animate: !still,
      placeholderColor: widget.placeholderColor,
    ),
  );

  @override
  void initState() {
    super.initState();
    _syncPoster();
    _syncPin();
  }

  @override
  void didUpdateWidget(InlineNetworkSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.deferRasterNearFlingExit != widget.deferRasterNearFlingExit) {
      _syncScrollPosition();
    }
    if (oldWidget.sheet.posterCache != widget.sheet.posterCache) {
      _poster?.release();
      _poster = null;
    }
    _syncPoster();
    if (oldWidget.item.urlString != widget.item.urlString ||
        oldWidget.sheet != widget.sheet) {
      if (_pinned) {
        oldWidget.sheet.releasePin(oldWidget.item.urlString);
        _pinned = false;
      }
    }
    _syncPin();
  }

  @override
  void dispose() {
    _poster?.release();
    if (_pinned) {
      widget.sheet.releasePin(widget.item.urlString);
      _pinned = false;
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveStill =
        widget.still || MediaQuery.disableAnimationsOf(context);
    if (widget.renderer == ChatRendererMode.lottie &&
        (widget.item.animated || _poster == null)) {
      return _reference(effectiveStill);
    }

    final dpr = MediaQuery.devicePixelRatioOf(context);
    final listenable = widget.sheet.listenableFor(
      widget.item.urlString,
      widget.clock,
    );

    final paint = ValueListenableBuilder<Object?>(
      valueListenable: widget.sheet.errorListenableFor(widget.item.urlString),
      builder: (context, error, _) {
        if (error != null) {
          final poster = _poster;
          if (poster != null) {
            return ValueListenableBuilder(
              valueListenable: poster,
              builder: (context, image, child) {
                if (image != null) {
                  return GestureDetector(
                    onTap: () => widget.sheet.retryAsset(widget.item.urlString),
                    child: RawImage(image: image, fit: BoxFit.contain),
                  );
                }
                return child!;
              },
              child: _errorPlaceholder(error),
            );
          }
          return _errorPlaceholder(error);
        }
        return CustomPaint(
          painter: _NetworkInlinePainter(
            url: widget.item.urlString,
            sheet: widget.sheet,
            clock: widget.clock,
            still: effectiveStill,
            devicePixelRatio: dpr,
            placeholderColor: widget.placeholderColor,
            poster: _poster,
            pose: _poster == null ? null : widget.item.poster,
            deferRaster: _scrollPosition == null ? null : _shouldDeferRaster,
            repaint: _poster == null
                ? listenable
                : Listenable.merge([listenable, _poster]),
          ),
        );
      },
    );

    return Semantics(
      label: widget.item.label,
      image: true,
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: widget.size,
          child: widget.repaintBoundary ? RepaintBoundary(child: paint) : paint,
        ),
      ),
    );
  }

  Widget _errorPlaceholder(Object error) {
    if (error is UnsupportedLottieException) {
      return const SizedBox.shrink();
    }
    return GestureDetector(
      onTap: () => widget.sheet.retryAsset(widget.item.urlString),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: widget.placeholderColor,
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Center(
          child: Icon(
            CupertinoIcons.refresh,
            size: 16,
            color: CupertinoColors.systemRed,
          ),
        ),
      ),
    );
  }
}

class _NetworkInlinePainter extends CustomPainter {
  _NetworkInlinePainter({
    required this.url,
    required this.sheet,
    required this.clock,
    required this.still,
    required this.devicePixelRatio,
    required this.placeholderColor,
    required this.poster,
    required this.pose,
    required this.deferRaster,
    required Listenable repaint,
  }) : super(repaint: repaint);

  static final Paint _placeholderPaint = Paint();

  final String url;
  final StickerSheet sheet;
  final StickerClock clock;
  final bool still;
  final double devicePixelRatio;
  final Color placeholderColor;
  final EmojiPosterLease? poster;
  final PackPoster? pose;
  final bool Function(Size)? deferRaster;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final player = sheet.playerFor(url);
    if (still && _drawPoster(canvas, Offset.zero & size)) return;
    if (player == null) {
      if (!_drawPoster(canvas, Offset.zero & size)) {
        _drawPlaceholder(canvas, size);
      }
      return;
    }
    final maxEdge = math.max(size.width, size.height);
    final targetPixels = maxEdge * devicePixelRatio;
    final rasterPixels = sheet.pixelSize;
    final effectiveDpr = maxEdge <= 0
        ? devicePixelRatio
        : rasterPixels / maxEdge;
    final filterQuality = (targetPixels - rasterPixels).abs() > 1
        ? FilterQuality.low
        : null;
    final progress = sheet.progressFor(url, clock, still: still, poster: pose);
    player.draw(
      canvas,
      Offset.zero & size,
      progress,
      devicePixelRatio: math.max(0.1, effectiveDpr),
      filterQuality: filterQuality,
      requestRaster:
          still ||
          player.composition.isStatic ||
          !(deferRaster?.call(size) ?? false),
      coldFallback: still
          ? null
          : (c, target) {
              if (!_drawPoster(c, Offset.zero & size)) {
                _drawPlaceholder(c, target.size, target.topLeft);
              }
            },
    );
  }

  bool _drawPoster(Canvas canvas, Rect target) {
    final image = poster?.value;
    if (image == null) return false;
    paintImage(
      canvas: canvas,
      rect: target,
      image: image,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.low,
    );
    return true;
  }

  void _drawPlaceholder(
    Canvas canvas,
    Size size, [
    Offset origin = Offset.zero,
  ]) {
    final r = math.min(size.width, size.height) * 0.28;
    _placeholderPaint.color = placeholderColor;
    canvas.drawRRect(
      RRect.fromRectAndRadius(origin & size, Radius.circular(r)),
      _placeholderPaint,
    );
  }

  @override
  bool shouldRepaint(_NetworkInlinePainter old) =>
      old.url != url ||
      old.sheet != sheet ||
      old.clock != clock ||
      old.still != still ||
      old.poster != poster ||
      old.pose != pose ||
      old.deferRaster != deferRaster ||
      old.devicePixelRatio != devicePixelRatio ||
      old.placeholderColor != placeholderColor;
}

class _ReferenceNetworkCell extends StatefulWidget {
  const _ReferenceNetworkCell({
    required this.url,
    required this.store,
    required this.clock,
    required this.animate,
    required this.placeholderColor,
  });

  final String url;
  final TgsStoreBase store;
  final StickerClock clock;
  final bool animate;
  final Color placeholderColor;

  @override
  State<_ReferenceNetworkCell> createState() => _ReferenceNetworkCellState();
}

class _ReferenceNetworkCellState extends State<_ReferenceNetworkCell> {
  late TgsLease _lease;

  @override
  void initState() {
    super.initState();
    _lease = widget.store.acquire(widget.url, reference: true);
  }

  @override
  void didUpdateWidget(_ReferenceNetworkCell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.url != widget.url || oldWidget.store != widget.store) {
      _lease.release();
      _lease = widget.store.acquire(widget.url, reference: true);
    }
  }

  @override
  void dispose() {
    _lease.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<TgsModel>(
    future: _lease.future,
    initialData: _lease.ready,
    builder: (context, snapshot) {
      final model = _lease.ready;
      if (model == null || model.reference == null) {
        return DecoratedBox(
          decoration: BoxDecoration(
            color: widget.placeholderColor,
            borderRadius: BorderRadius.circular(10),
          ),
        );
      }
      return Lottie(
        composition: model.reference!,
        animate: widget.animate,
        repeat: true,
        frameRate: FrameRate.composition,
        fit: BoxFit.contain,
      );
    },
  );
}

/// Hero network sticker message rendered directly with Impeller vector display
/// lists ([FastLottieCache.unbounded], `usePipeline: false`) at full FPS.
class HeroNetworkSticker extends StatefulWidget {
  const HeroNetworkSticker({
    super.key,
    required this.item,
    required this.store,
    required this.renderer,
    required this.placeholderColor,
    required this.borderColor,
    required this.accentColor,
    required this.secondaryTextColor,
    this.posters,
    this.animate = true,
    this.size = 220,
  });

  final TgsRemoteItem item;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final Color placeholderColor;
  final Color borderColor;
  final Color accentColor;
  final Color secondaryTextColor;
  final PackPosterCache? posters;
  final bool animate;
  final double size;

  @override
  State<HeroNetworkSticker> createState() => _HeroNetworkStickerState();
}

class _HeroNetworkStickerState extends State<HeroNetworkSticker>
    with SingleTickerProviderStateMixin {
  TgsLease? _lease;
  EmojiPosterLease? _poster;
  late final AnimationController _timeline = AnimationController(vsync: this);
  bool _hasTimeline = false;
  int _replayTick = 0;

  void _acquire() {
    if (!widget.item.animated &&
        widget.posters != null &&
        widget.item.poster != null) {
      return;
    }
    _lease = widget.store.acquire(
      widget.item.urlString,
      reference: widget.renderer == ChatRendererMode.lottie,
      priority: true,
    );
  }

  void _retry() {
    _lease?.release();
    setState(_acquire);
  }

  @override
  void initState() {
    super.initState();
    _acquirePoster();
    _acquire();
  }

  void _acquirePoster() {
    final poster = widget.item.largePoster ?? widget.item.poster;
    _poster = poster == null ? null : widget.posters?.acquire(poster);
  }

  @override
  void didUpdateWidget(HeroNetworkSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.posters != widget.posters ||
        oldWidget.item.poster != widget.item.poster ||
        oldWidget.item.largePoster != widget.item.largePoster) {
      _poster?.release();
      _acquirePoster();
    }
    if (oldWidget.item.urlString != widget.item.urlString ||
        oldWidget.store != widget.store ||
        oldWidget.renderer != widget.renderer ||
        oldWidget.posters != widget.posters ||
        oldWidget.item.animated != widget.item.animated) {
      _lease?.release();
      _lease = null;
      if (_hasTimeline) {
        _timeline.stop();
        _timeline.duration = null;
      }
      _acquire();
    }
  }

  @override
  void dispose() {
    if (_hasTimeline) _timeline.dispose();
    _poster?.release();
    _lease?.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: widget.size,
    child: FutureBuilder<TgsModel>(
      future: _lease?.future,
      initialData: _lease?.ready,
      builder: (context, snapshot) {
        final model = _lease?.ready;
        final effectiveAnimate =
            widget.animate && !MediaQuery.disableAnimationsOf(context);
        final poster = _poster;
        if (_hasTimeline && !effectiveAnimate && _timeline.isAnimating) {
          _timeline.stop();
        }
        Widget render() {
          if (snapshot.hasError) {
            if (snapshot.error is UnsupportedLottieException) {
              return const SizedBox.shrink();
            }
            return DecoratedBox(
              decoration: BoxDecoration(
                color: widget.placeholderColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: widget.borderColor),
              ),
              child: Center(
                child: CupertinoButton(
                  onPressed: _retry,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        CupertinoIcons.refresh_circled,
                        size: 32,
                        color: widget.accentColor,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Download failed · Tap to retry',
                        style: TextStyle(
                          fontSize: 12,
                          color: widget.secondaryTextColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
          if (model == null) {
            return DecoratedBox(
              decoration: BoxDecoration(
                color: widget.placeholderColor.withValues(alpha: 0.65),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CupertinoActivityIndicator(radius: 12),
                    const SizedBox(height: 8),
                    Text(
                      'Loading ${(widget.item.bytes / 1024).toStringAsFixed(0)} KB…',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: widget.secondaryTextColor,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          if (widget.renderer == ChatRendererMode.fastlottie &&
              model.fast != null) {
            final progress =
                (widget.item.largePoster ?? widget.item.poster)?.progress;
            Animation<double>? controller;
            if (poster != null && progress != null && !model.fast!.isStatic) {
              _hasTimeline = true;
              if (_timeline.duration != model.fast!.duration) {
                _timeline.duration = model.fast!.duration;
                _timeline.value = progress;
              }
              if (!_timeline.isAnimating && effectiveAnimate) {
                _timeline.repeat();
              }
              controller = _timeline;
            }
            return GestureDetector(
              onTap: effectiveAnimate
                  ? () {
                      if (controller != null) _timeline.value = progress!;
                      setState(() => _replayTick++);
                    }
                  : null,
              child: FastLottie(
                key: ValueKey('hero_${widget.item.id}_$_replayTick'),
                composition: model.fast!,
                controller: controller,
                width: widget.size,
                height: widget.size,
                animate: effectiveAnimate,
                repeat: true,
                useFrameRate: true,
                usePipeline: false,
                cache:
                    context
                        .dependOnInheritedWidgetOfExactType<
                          HeroStickerCacheScope
                        >()
                        ?.cache ??
                    FastLottieCache.unbounded,
              ),
            );
          }

          if (widget.renderer == ChatRendererMode.lottie &&
              model.reference != null) {
            return Lottie(
              composition: model.reference!,
              animate: effectiveAnimate,
              repeat: true,
              frameRate: FrameRate.composition,
              fit: BoxFit.contain,
            );
          }

          return const SizedBox.shrink();
        }

        if (poster == null || (model != null && effectiveAnimate)) {
          return render();
        }
        return ValueListenableBuilder(
          valueListenable: poster,
          builder: (context, image, _) {
            if (image != null) {
              return RawImage(image: image, fit: BoxFit.contain);
            }
            if (poster.finished) return render();
            return ColoredBox(color: widget.placeholderColor);
          },
        );
      },
    ),
  );
}
