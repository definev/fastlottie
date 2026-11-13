import 'dart:async';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';

import 'cache_dir.dart';
import 'clock.dart';
import 'network_server.dart';
import 'network_store.dart';
import 'pressure.dart';
import 'sheet.dart';
import 'store.dart';
import 'web_support_stub.dart'
    if (dart.library.js_interop) 'web_support.dart'
    as web_support;

enum ChatRendererMode { fastlottie, lottie }

enum _DrawerTab { all, pack, emoji }

@immutable
class ChatMessage {
  const ChatMessage.text({
    required this.id,
    required this.text,
    required this.isOutgoing,
    required this.timestamp,
    this.senderName,
  }) : sticker = null,
       reloadEpoch = 0;

  const ChatMessage.sticker({
    required this.id,
    required this.sticker,
    required this.isOutgoing,
    required this.timestamp,
    this.senderName,
    this.reloadEpoch = 0,
  }) : text = null;

  final String id;
  final String? text;
  final TgsRemoteItem? sticker;
  final bool isOutgoing;
  final DateTime timestamp;
  final String? senderName;
  final int reloadEpoch;

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
    if (cat == null || cat.emojis.isEmpty) return raw;
    final emojis = cat.emojis;
    final buf = StringBuffer();
    for (var i = 0; i < raw.length; i++) {
      final code = raw.codeUnitAt(i);
      final idx = code - puaBase;
      if (idx >= 0 && idx < emojis.length) {
        final emoji = emojis[idx];
        buf.write(emoji.shortcode ?? String.fromCharCode(code));
      } else {
        buf.writeCharCode(code);
      }
    }
    final expanded = buf.toString();
    if (cat.unicodeMap.isEmpty ||
        !TgsRemoteCatalog.couldContainEmojiOrShortcode(expanded)) {
      return expanded;
    }
    return expanded.replaceAllMapped(cat.emojiAndShortcodeRegex, (match) {
      final token = match.group(0)!;
      if (token.startsWith(':')) return token;
      final item = cat.findItem(token);
      return item?.shortcode ?? token;
    });
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
        return TextSpan(style: style, text: rawText);
      }
      return TextSpan(
        style: style,
        children: [
          TextSpan(text: value.composing.textBefore(rawText)),
          TextSpan(
            style: composingStyle,
            text: value.composing.textInside(rawText),
          ),
          TextSpan(text: value.composing.textAfter(rawText)),
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
          spans.add(TextSpan(text: textBuf.toString(), style: segStyle));
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
///   + isolate compile) feeding [FastLottieRasterCache.miniStrip] (or [FastLottieRasterCache.pingPong])
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
    this.rasterStrategy = FastLottieRasterStrategy.miniStrip,
    this.stripFrames,
  });

  final Uri? externalServerUri;
  final Future<TgsRemoteCatalog>? initialCatalog;
  final NetworkTgsStore? store;
  final bool isDark;
  final ValueChanged<bool>? onBrightnessChanged;
  final FastLottieRasterStrategy rasterStrategy;
  final int? stripFrames;

  @override
  State<CupertinoChatScreen> createState() => _CupertinoChatScreenState();
}

class _CupertinoChatScreenState extends State<CupertinoChatScreen>
    with WidgetsBindingObserver {
  late final NetworkTgsStore _store =
      widget.store ??
      NetworkTgsStore(
        httpConcurrency: 6,
        decodeConcurrency: 2,
        batchSize: 2,
        framePaced: true,
        // Visible cells stay pinned. This only bounds models that have
        // already scrolled off; compiling them again reads the disk cache.
        maximumEntries: 48,
      );

  late FastLottieRasterStrategy _rasterStrategy = widget.rasterStrategy;
  late FastLottieRasterCache _rasterCache = _createRasterCache(_rasterStrategy);

  FastLottieRasterCache _createRasterCache(FastLottieRasterStrategy strategy) =>
      switch (strategy) {
        FastLottieRasterStrategy.miniStrip => FastLottieRasterCache.miniStrip(
          maximumBytes: 48 * 1024 * 1024,
          maximumCompressedMemoryBytes: 16 * 1024 * 1024,
          maximumDiskBytes: 128 * 1024 * 1024,
          maximumFrameRate: stickerThumbnailFrameRate,
          stripFrames: widget.stripFrames,
        ),
        FastLottieRasterStrategy.pingPong => FastLottieRasterCache.pingPong(
          maximumBytes: 48 * 1024 * 1024,
          maximumCompressedMemoryBytes: 16 * 1024 * 1024,
          maximumDiskBytes: 128 * 1024 * 1024,
          maximumFrameRate: stickerThumbnailFrameRate,
        ),
      };

  final StickerClock _clock = StickerClock();
  late final StickerPressure _pressure = StickerPressure()
    ..addListener(_onPressureChanged);

  final ScrollController _messageScroll = ScrollController();
  final ScrollController _pickerScroll = ScrollController();
  late final EmojiComposerController _composerController =
      EmojiComposerController();
  late final EmojiShortcodeTextInputFormatter _shortcodeFormatter =
      EmojiShortcodeTextInputFormatter(() => _catalog);
  final FocusNode _composerFocus = FocusNode();
  final ValueNotifier<bool> _showScrollBottom = ValueNotifier<bool>(false);
  final ValueNotifier<bool> _hasDraft = ValueNotifier<bool>(false);

  LocalTgsServer? _embeddedServer;
  TgsRemoteCatalog? _catalog;
  StickerSheet? _stickerSheet;
  StickerSheet? _emojiSheet;
  final List<StickerSheet> _disposingSheets = <StickerSheet>[];
  final List<FastLottieRasterCache> _disposingCaches =
      <FastLottieRasterCache>[];
  Object? _bootError;
  bool _booting = true;

  ChatRendererMode _renderer = ChatRendererMode.fastlottie;
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
    WidgetsBinding.instance.addObserver(this);
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
      await ensureDefaultExampleDiskCache();
      await attachExampleDiskCache(_rasterCache);
      final urlCacheDir = await resolveUrlDiskCacheDirectory();
      if (urlCacheDir != null && _store.sourceCacheDirectory == null) {
        _store.attachSourceCacheDirectory(urlCacheDir);
      }

      TgsRemoteCatalog catalog;
      final explicitCatalog = widget.initialCatalog;
      if (explicitCatalog != null) {
        catalog = await explicitCatalog;
      } else if (kIsWeb) {
        catalog = await web_support.loadBundledTgsCatalog();
      } else {
        const defineUrl = String.fromEnvironment('TGS_SERVER_URL');
        final external =
            widget.externalServerUri ??
            (defineUrl.isNotEmpty ? Uri.tryParse(defineUrl) : null);
        if (external != null) {
          catalog = await fetchRemoteTgsCatalog(external);
        } else {
          final server = await LocalTgsServer.startFromBundle();
          if (!mounted) {
            await server.close(force: true);
            return;
          }
          _embeddedServer = server;
          catalog = server.catalog;
        }
      }

      if (!mounted) return;
      _setupCatalog(catalog);
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _bootError = error;
        _booting = false;
      });
    }
  }

  void _scheduleDisposeStale({
    StickerSheet? stickerSheet,
    StickerSheet? emojiSheet,
    FastLottieRasterCache? cache,
  }) {
    if (stickerSheet != null) {
      stickerSheet.active = false;
      _disposingSheets.add(stickerSheet);
    }
    if (emojiSheet != null) {
      emojiSheet.active = false;
      _disposingSheets.add(emojiSheet);
    }
    if (cache != null) {
      cache.enabled = false;
      _disposingCaches.add(cache);
    }
    if (stickerSheet == null && emojiSheet == null && cache == null) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (stickerSheet != null && _disposingSheets.remove(stickerSheet)) {
        stickerSheet.dispose();
      }
      if (emojiSheet != null && _disposingSheets.remove(emojiSheet)) {
        emojiSheet.dispose();
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
    final oldStickerSheet = _stickerSheet;
    final oldEmojiSheet = _emojiSheet;

    _catalog = catalog;
    _stickerSheet = StickerSheet(
      assets: [for (final item in catalog.stickers) item.urlString],
      pixelSize: stickerThumbnailPixels,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
      rasterStrategy: _rasterStrategy,
      stripFrames: widget.stripFrames,
    )..constrained = _pressure.constrained;

    _emojiSheet = StickerSheet(
      assets: [for (final item in catalog.emojis) item.urlString],
      pixelSize: 96,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
      rasterStrategy: _rasterStrategy,
      stripFrames: widget.stripFrames,
    )..constrained = _pressure.constrained;

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

    _syncPlayback(forceComposerNotify: !identical(oldEmojiSheet, _emojiSheet));
    setState(() {
      _booting = false;
      _bootError = null;
    });
    _scheduleDisposeStale(
      stickerSheet: oldStickerSheet,
      emojiSheet: oldEmojiSheet,
      cache: staleCache,
    );
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
        '${sc(':tada:', 0)} Welcome to the TGS chat demo! ${sc(':partying_face:', 0)}',
      ),
      (
        true,
        'This catalog has ${catalog.stickers.length} stickers and ${catalog.emojis.length} animated emoji. Try ${sc(':smile:', 0)} or ${sc(':fire:', 2)} in a message.',
      ),
      (
        false,
        'When you scroll quickly through the sticker tray, the HTTP queue (up to 6 concurrent requests) aborts sockets for stickers that leave the screen ${sc(':iphone:', 7)} while vector decoding stays isolated on a separate isolate ${sc(':exploding_head:', 0)}.',
      ),
      (
        true,
        'Grid thumbnails and inline emoji ${sc(':bulb:', 4)} ${sc(':heart_on_fire:', 0)} ${sc(':sparkles:', 0)} use Mini-Strip Ping-Pong RLE + LZ4 `.flcache` at 30 FPS.',
      ),
      (
        false,
        'Stickers sent directly to the chat skip the queue and render as vectors with Impeller, preserving sharpness and frame rate ${sc(':trophy:', 12)} ${sc(':thumbs_up:', 0)}',
      ),
    ];

    // Older messages above so the user can scroll up cleanly through chat history.
    const fillerTopics = <String>[
      'Open the picker to browse sticker packs and animated emoji.',
      'ETag, Cache-Control, and the `.tgsbin` disk cache make repeat visits network-free.',
      'Use the menu in the top-right corner to simulate 80 ms or 220 ms network latency and see the loading placeholders.',
      'Long-press any sticker or emoji in the tray to preview it at full size.',
      'Tap a sticker in the chat to replay its animation.',
      'The entire interface is built with Cupertino (`package:flutter/cupertino.dart`).',
    ];

    final topicCount = math.max(1, catalog.emojis.length);
    for (var i = 0; i < 16; i++) {
      final t = now.subtract(Duration(minutes: 30 - i));
      final emojiA = byIdx((i * 5) % topicCount);
      final emojiB = byIdx((40 + i * 3) % topicCount);
      _messages.add(
        ChatMessage.text(
          id: 'seed_${_messageSeq++}',
          text: '$emojiA ${fillerTopics[i % fillerTopics.length]} $emojiB',
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
            '${sc(':studio_microphone:', 0)} Try typing or pasting real emoji (${sc(':smile:', 0)} 😀 ${sc(':heart_eyes:', 0)} 😍 ${sc(':partying_face:', 0)} 🥳 ${sc(':heart_on_fire:', 0)} ❤️‍🔥 ${sc(':thumbs_up:', 0)} 👍) or shortcodes (${sc(':strawberry:', 40)} ${sc(':pizza:', 70)} ${sc(':cat2:', 87)}), or tap the smiley button below to open the picker! ${sc(':sparkles:', 3)}',
        isOutgoing: true,
        timestamp: now.subtract(const Duration(minutes: 1)),
      ),
    );
  }

  void _onPressureChanged() {
    if (!mounted) return;
    _stickerSheet?.constrained = _pressure.constrained;
    _emojiSheet?.constrained = _pressure.constrained;
    if (!_pressure.constrained) {
      _stickerSheet?.resumePreparation();
      _emojiSheet?.resumePreparation();
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

  void _onComposerTextChanged() {
    final nextHasDraft = _composerController.text.trim().isNotEmpty;
    if (nextHasDraft != _hasDraft.value) {
      _hasDraft.value = nextHasDraft;
    }
  }

  void _onComposerFocusChanged() {
    if (_composerFocus.hasFocus && _drawerOpen) {
      setState(() => _drawerOpen = false);
    }
  }

  void _syncPlayback({bool forceComposerNotify = false}) {
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
    _stickerSheet?.active = sheetEnabled;
    _emojiSheet?.active = sheetEnabled;
    _rasterCache.enabled = fastEnabled;
    final nextStill = _reduced || _pressure.constrained;
    final composerVisualChanged =
        forceComposerNotify ||
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
    if (oldWidget.rasterStrategy != widget.rasterStrategy ||
        oldWidget.stripFrames != widget.stripFrames) {
      final nextStrategy = widget.rasterStrategy;
      final force = oldWidget.stripFrames != widget.stripFrames;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          unawaited(_setRasterStrategy(nextStrategy, forceRebuild: force));
        }
      });
    }
  }

  Future<void> _setRasterStrategy(
    FastLottieRasterStrategy next, {
    bool forceRebuild = false,
  }) async {
    if (!mounted) return;
    if (!forceRebuild && _rasterStrategy == next) return;
    final oldCache = _rasterCache;
    final nextCache = _createRasterCache(next);
    oldCache.enabled = false;
    _rasterStrategy = next;
    _rasterCache = nextCache;
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

  void _toggleDrawer() {
    if (_drawerOpen) {
      setState(() => _drawerOpen = false);
      _composerFocus.requestFocus();
    } else {
      _composerFocus.unfocus();
      setState(() => _drawerOpen = true);
    }
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
    final textToSend = _composerController.toShortcodeText().trim();
    if (textToSend.isEmpty) return;
    _composerController.clear();
    setState(() {
      _messages.add(
        ChatMessage.text(
          id: 'msg_${_messageSeq++}',
          text: textToSend,
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
    _stickerSheet?.clearLoadedModels();
    _emojiSheet?.clearLoadedModels();
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
    _stickerSheet?.resumePreparation();
    _emojiSheet?.resumePreparation();
  }

  String get _strategyLabel => switch (_rasterStrategy) {
    FastLottieRasterStrategy.miniStrip =>
      widget.stripFrames != null
          ? 'Mini-Strip (K=${widget.stripFrames})'
          : 'Mini-Strip (Adaptive K)',
    FastLottieRasterStrategy.pingPong => 'Ping-Pong (K=1)',
  };

  Future<void> _showOptionsSheet() async {
    final server = _embeddedServer;
    await showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: const Text('Server & Cache Options'),
        message: Text(
          'Endpoint: ${_catalog?.baseUri ?? '-'}\n'
          'Cache: $_strategyLabel · IPC: ${_rasterCache.workerDispatches} | '
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
              'Renderer: ${_renderer == ChatRendererMode.fastlottie ? 'FastLottie (Hero Vector + ${_rasterStrategy == FastLottieRasterStrategy.miniStrip ? 'Mini-Strip' : 'PingPong'})' : 'Lottie Reference'}',
            ),
          ),
          if (_renderer == ChatRendererMode.fastlottie)
            CupertinoActionSheetAction(
              key: const ValueKey('toggle-raster-strategy-action'),
              onPressed: () {
                final next =
                    _rasterStrategy == FastLottieRasterStrategy.miniStrip
                    ? FastLottieRasterStrategy.pingPong
                    : FastLottieRasterStrategy.miniStrip;
                Navigator.of(ctx).pop();
                unawaited(_setRasterStrategy(next));
              },
              child: Text(
                _rasterStrategy == FastLottieRasterStrategy.miniStrip
                    ? 'Raster Strategy: Mini-Strip (Switch to Ping-Pong K=1)'
                    : 'Raster Strategy: Ping-Pong K=1 (Switch to Mini-Strip)',
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
              setState(() => _reducedMotionOverride = next);
              _syncPlayback();
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
            'Server: ${_catalog?.baseUri ?? '-'}\n'
            'HTTP Requests: ${s?.requests ?? '-'}\n'
            'HTTP TGS Served: ${s?.tgsRequests ?? _store.networkDownloads} '
            '(${((s?.bytesServed ?? _store.downloadedBytes) / 1024).toStringAsFixed(1)} KB)\n'
            'URL Disk Cache Hits: ${_store.diskSourceHits}\n'
            'RAM Model Hits: ${_store.hits}\n'
            'Aborted Sockets: ${_store.cancelledFetches}\n'
            'Strategy: $_strategyLabel\n'
            'GPU VRAM: ${(_rasterCache.gpuBytes / (1024 * 1024)).toStringAsFixed(2)} MiB '
            '(Resv ${(_rasterCache.reservedBytes / (1024 * 1024)).toStringAsFixed(2)})\n'
            'Worker Dispatches (IPC): ${_rasterCache.workerDispatches}\n'
            'Strip/Buffer Swaps: ${_rasterCache.pingPongSwaps}\n'
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
    WidgetsBinding.instance.removeObserver(this);
    _messageScroll.dispose();
    _pickerScroll.dispose();
    _composerController.dispose();
    _composerFocus.dispose();
    _showScrollBottom.dispose();
    _hasDraft.dispose();
    _pressure.dispose();
    _stickerSheet?.dispose();
    _emojiSheet?.dispose();
    for (final stale in _disposingSheets) {
      stale.dispose();
    }
    _disposingSheets.clear();
    _rasterCache.dispose();
    for (final stale in _disposingCaches) {
      stale.dispose();
    }
    _disposingCaches.clear();
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
          backgroundColor: palette.navBar,
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
                            onTap: () {
                              if (_composerFocus.hasFocus) {
                                _composerFocus.unfocus();
                              }
                              if (_drawerOpen) {
                                setState(() => _drawerOpen = false);
                              }
                            },
                            child: CupertinoScrollbar(
                              controller: _messageScroll,
                              child: ListView.builder(
                                key: const ValueKey('cupertino-message-list'),
                                controller: _messageScroll,
                                reverse: true,
                                physics: const BouncingScrollPhysics(
                                  parent: AlwaysScrollableScrollPhysics(),
                                ),
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
                                    clock: _clock,
                                    store: _store,
                                    renderer: _renderer,
                                    still: _reduced || _pressure.constrained,
                                    animateHero: !_reduced,
                                    palette: palette,
                                    onStickerLongPress: _showStickerPreview,
                                  );
                                },
                              ),
                            ),
                          ),
                          Positioned(
                            right: 12,
                            bottom: 12,
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
                                    key: const ValueKey('scroll-to-bottom-btn'),
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
                        onTabChanged: (idx) {
                          setState(() => _selectedTabIndex = idx);
                          if (_pickerScroll.hasClients) {
                            _pickerScroll.jumpTo(0);
                          }
                        },
                        scrollController: _pickerScroll,
                        stickerSheet: _stickerSheet!,
                        emojiSheet: _emojiSheet!,
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
                  final decoded = controller.toShortcodeText(selected);
                  Clipboard.setData(ClipboardData(text: decoded));
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
                  if (item.type == ContextMenuButtonType.copy) {
                    return item.copyWith(
                      onPressed: () {
                        final val = controller.value;
                        if (val.selection.isValid &&
                            !val.selection.isCollapsed) {
                          final selected = val.selection.textInside(val.text);
                          final decoded = controller.toShortcodeText(selected);
                          Clipboard.setData(ClipboardData(text: decoded));
                        }
                        editableTextState.hideToolbar();
                      },
                    );
                  }
                  if (item.type == ContextMenuButtonType.cut) {
                    return item.copyWith(
                      onPressed: () {
                        final val = controller.value;
                        if (val.selection.isValid &&
                            !val.selection.isCollapsed) {
                          final selected = val.selection.textInside(val.text);
                          final decoded = controller.toShortcodeText(selected);
                          Clipboard.setData(ClipboardData(text: decoded));
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
                child: CupertinoScrollbar(
                  controller: scrollController,
                  child: GridView.builder(
                    key: const ValueKey('sticker-picker-grid'),
                    controller: scrollController,
                    physics: const BouncingScrollPhysics(
                      parent: AlwaysScrollableScrollPhysics(),
                    ),
                    padding: const EdgeInsets.fromLTRB(8, 2, 8, 10),
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
                            ),
                          ),
                        ),
                      );
                    },
                  ),
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
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    required this.animateHero,
    required this.palette,
    required this.onStickerLongPress,
  });

  final ChatMessage message;
  final TgsRemoteCatalog catalog;
  final StickerSheet emojiSheet;
  final StickerClock clock;
  final TgsStoreBase store;
  final ChatRendererMode renderer;
  final bool still;
  final bool animateHero;
  final _Palette palette;
  final ValueChanged<TgsRemoteItem> onStickerLongPress;

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
                      store: store,
                      renderer: renderer,
                      animate: animateHero,
                      size: 220,
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
    final emojiScale = MediaQuery.textScalerOf(context).scale(16);
    final spans = _parseRichSpans(
      text,
      catalog,
      emojiScale * 1.45,
      message.isOutgoing
          ? CupertinoColors.white.withValues(alpha: 0.25)
          : palette.tilePlaceholder,
    );

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
    );
  }

  List<InlineSpan> _parseRichSpans(
    String text,
    TgsRemoteCatalog catalog,
    double emojiSize,
    Color placeholderColor,
  ) {
    final stickerOnly = _containsOnlyStickersAndWhitespace(text, catalog);
    final stickerSize = stickerOnly ? 40.0 : emojiSize;
    final spans = <InlineSpan>[];
    var cursor = 0;
    final regex = catalog.richMessageRegex;
    for (final match in regex.allMatches(text)) {
      final token = match.group(0)!;
      final item = catalog.findItem(token);
      if (item == null) continue;
      if (match.start > cursor) {
        spans.add(TextSpan(text: text.substring(cursor, match.start)));
      }
      spans.add(
        WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: InlineNetworkSticker(
            item: item,
            sheet: emojiSheet,
            clock: clock,
            store: store,
            renderer: renderer,
            still: still,
            size: stickerSize,
            placeholderColor: placeholderColor,
          ),
        ),
      );
      cursor = match.end;
    }
    if (cursor < text.length) {
      spans.add(TextSpan(text: text.substring(cursor)));
    }
    if (spans.isEmpty) {
      spans.add(TextSpan(text: text));
    }
    return spans;
  }

  bool _containsOnlyStickersAndWhitespace(
    String text,
    TgsRemoteCatalog catalog,
  ) {
    var cursor = 0;
    var foundSticker = false;
    final regex = catalog.richMessageRegex;
    for (final match in regex.allMatches(text)) {
      final token = match.group(0)!;
      final item = catalog.findItem(token);
      if (item == null) continue;
      if (text.substring(cursor, match.start).trim().isNotEmpty) return false;
      foundSticker = true;
      cursor = match.end;
    }
    return foundSticker && text.substring(cursor).trim().isEmpty;
  }
}

/// Inline emoji and sticker-grid thumbnail backed by [StickerSheet] +
/// [FastLottieRasterCache.miniStrip] + [NetworkTgsStore].
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

  @override
  State<InlineNetworkSticker> createState() => _InlineNetworkStickerState();
}

class _InlineNetworkStickerState extends State<InlineNetworkSticker> {
  bool _pinned = false;

  void _syncPin() {
    final shouldPin = widget.renderer == ChatRendererMode.fastlottie;
    if (shouldPin == _pinned) return;
    if (shouldPin) {
      widget.sheet.acquirePin(widget.item.urlString);
    } else {
      widget.sheet.releasePin(widget.item.urlString);
    }
    _pinned = shouldPin;
  }

  @override
  void initState() {
    super.initState();
    _syncPin();
  }

  @override
  void didUpdateWidget(InlineNetworkSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
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
    if (widget.renderer == ChatRendererMode.lottie) {
      return SizedBox.square(
        dimension: widget.size,
        child: _ReferenceNetworkCell(
          url: widget.item.urlString,
          store: widget.store,
          clock: widget.clock,
          animate: !effectiveStill,
          placeholderColor: widget.placeholderColor,
        ),
      );
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
        return CustomPaint(
          painter: _NetworkInlinePainter(
            url: widget.item.urlString,
            sheet: widget.sheet,
            clock: widget.clock,
            still: effectiveStill,
            devicePixelRatio: dpr,
            placeholderColor: widget.placeholderColor,
            repaint: listenable,
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
}

class _NetworkInlinePainter extends CustomPainter {
  _NetworkInlinePainter({
    required this.url,
    required this.sheet,
    required this.clock,
    required this.still,
    required this.devicePixelRatio,
    required this.placeholderColor,
    required Listenable repaint,
  }) : super(repaint: repaint);

  static final Paint _placeholderPaint = Paint();

  final String url;
  final StickerSheet sheet;
  final StickerClock clock;
  final bool still;
  final double devicePixelRatio;
  final Color placeholderColor;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final player = sheet.playerFor(url);
    if (player == null) {
      _drawPlaceholder(canvas, size);
      return;
    }
    final c = player.composition;
    final maxEdge = math.max(size.width, size.height);
    // Lock raster key size to `sheet.pixelSize` across all inline sizes
    // (header avatar, chat bubbles, 5-column picker) so consumers share one
    // entry without thrashing or dropping background decodes.
    final effectiveDpr = maxEdge <= 0
        ? devicePixelRatio
        : sheet.pixelSize / maxEdge;
    final targetPixels = maxEdge * devicePixelRatio;
    final filterQuality = (targetPixels - sheet.pixelSize).abs() > 1
        ? FilterQuality.low
        : null;
    final span = c.endFrame - c.startFrame;
    final frame = still || span <= 0
        ? 0.0
        : (((clock.microseconds + 1) / 1000000 * c.frameRate) % span).clamp(
            0.0,
            span > 1 ? span - 1 : 0.0,
          );
    final progress = c.isStatic || span <= 0 || still ? 0.0 : frame / span;
    player.draw(
      canvas,
      Offset.zero & size,
      progress,
      devicePixelRatio: math.max(0.1, effectiveDpr),
      filterQuality: filterQuality,
      coldFallback: still
          ? null
          : (c, target) => _drawPlaceholder(c, target.size, target.topLeft),
    );
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
  final bool animate;
  final double size;

  @override
  State<HeroNetworkSticker> createState() => _HeroNetworkStickerState();
}

class _HeroNetworkStickerState extends State<HeroNetworkSticker> {
  late TgsLease _lease;
  int _replayTick = 0;

  void _acquire() {
    _lease = widget.store.acquire(
      widget.item.urlString,
      reference: widget.renderer == ChatRendererMode.lottie,
      priority: true,
    );
  }

  void _retry() {
    _lease.release();
    setState(_acquire);
  }

  @override
  void initState() {
    super.initState();
    _acquire();
  }

  @override
  void didUpdateWidget(HeroNetworkSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.item.urlString != widget.item.urlString ||
        oldWidget.store != widget.store ||
        oldWidget.renderer != widget.renderer) {
      _lease.release();
      _acquire();
    }
  }

  @override
  void dispose() {
    _lease.release();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: widget.size,
    child: FutureBuilder<TgsModel>(
      future: _lease.future,
      initialData: _lease.ready,
      builder: (context, snapshot) {
        final model = _lease.ready;
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

        final effectiveAnimate =
            widget.animate && !MediaQuery.disableAnimationsOf(context);

        if (widget.renderer == ChatRendererMode.fastlottie &&
            model.fast != null) {
          return GestureDetector(
            onTap: effectiveAnimate
                ? () => setState(() => _replayTick++)
                : null,
            child: FastLottie(
              key: ValueKey('hero_${widget.item.id}_$_replayTick'),
              composition: model.fast!,
              width: widget.size,
              height: widget.size,
              animate: effectiveAnimate,
              repeat: true,
              useFrameRate: true,
              usePipeline: false,
              cache: FastLottieCache.unbounded,
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
      },
    ),
  );
}
