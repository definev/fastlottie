import 'dart:async';
import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:lottie/lottie.dart';

import 'cache_dir.dart';
import 'clock.dart';
import 'network_server.dart';
import 'network_store.dart';
import 'pressure.dart';
import 'sheet.dart';
import 'store.dart';

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
///   + isolate compile) feeding [FastLottieRasterCache.pingPong] for the 5-column picker & inline emojis.
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
  });

  final Uri? externalServerUri;
  final Future<TgsRemoteCatalog>? initialCatalog;
  final NetworkTgsStore? store;
  final bool isDark;
  final ValueChanged<bool>? onBrightnessChanged;

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
        maximumEntries: 180,
      );

  final FastLottieRasterCache _rasterCache = FastLottieRasterCache.pingPong(
    maximumBytes: 48 * 1024 * 1024,
    maximumCompressedMemoryBytes: 16 * 1024 * 1024,
    maximumDiskBytes: 128 * 1024 * 1024,
    maximumFrameRate: stickerThumbnailFrameRate,
  );

  final StickerClock _clock = StickerClock();
  late final StickerPressure _pressure = StickerPressure()
    ..addListener(_onPressureChanged);

  final ScrollController _messageScroll = ScrollController();
  final ScrollController _pickerScroll = ScrollController();
  final TextEditingController _composerController = TextEditingController();
  final FocusNode _composerFocus = FocusNode();
  final ValueNotifier<bool> _showScrollBottom = ValueNotifier<bool>(false);
  final ValueNotifier<bool> _hasDraft = ValueNotifier<bool>(false);

  LocalTgsServer? _embeddedServer;
  TgsRemoteCatalog? _catalog;
  StickerSheet? _stickerSheet;
  StickerSheet? _emojiSheet;
  Object? _bootError;
  bool _booting = true;

  ChatRendererMode _renderer = ChatRendererMode.fastlottie;
  late bool _isDark = widget.isDark;
  bool _foreground = true;
  bool _drawerOpen = false;
  int _selectedTabIndex = 0; // 0 = All, 1..N = Sticker Packs, last = Emoji
  int _cacheEpoch = 0;
  int _messageSeq = 0;
  final List<ChatMessage> _messages = <ChatMessage>[];

  _Palette get _palette => _isDark ? _Palette.dark : _Palette.light;
  bool get _reduced => MediaQuery.disableAnimationsOf(context);

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

  void _setupCatalog(TgsRemoteCatalog catalog) {
    _stickerSheet?.dispose();
    _emojiSheet?.dispose();

    _catalog = catalog;
    _stickerSheet = StickerSheet(
      assets: [for (final item in catalog.stickers) item.urlString],
      pixelSize: stickerThumbnailPixels,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
    )..constrained = _pressure.constrained;

    _emojiSheet = StickerSheet(
      assets: [for (final item in catalog.emojis) item.urlString],
      pixelSize: 72,
      store: _store,
      rasterCache: _rasterCache,
      frameRate: stickerThumbnailFrameRate,
    )..constrained = _pressure.constrained;

    if (_messages.isEmpty) {
      _seedInitialConversation(catalog);
    }

    _syncPlayback();
    setState(() {
      _booting = false;
      _bootError = null;
    });
  }

  void _seedInitialConversation(TgsRemoteCatalog catalog) {
    final now = DateTime.now();
    String sc(int idx) => idx < catalog.emojis.length
        ? (catalog.emojis[idx].shortcode ?? '')
        : '';

    final earlierSamples = <(bool outgoing, String text)>[
      (
        false,
        '${sc(0)} Chào mừng đến với màn hình chat TGS qua HTTP local server!',
      ),
      (
        true,
        'Mọi file `.tgs` (cả emoji trong tin nhắn ${sc(1)} ${sc(2)} và bộ sticker) đều được tải qua mạng từ local HTTP server.',
      ),
      (
        false,
        'Khi cuộn nhanh ở khay sticker: HTTP queue (tối đa 6 luồng) tự abort socket những sticker vừa cuộn khỏi màn hình ${sc(7)} và giữ giải mã vector tách biệt trên Isolate.',
      ),
      (
        true,
        'Thumbnail ở grid & emoji nội tuyến ${sc(4)} ${sc(37)} chạy qua Ping-Pong RLE + LZ4 `.flcache` ở 30 FPS.',
      ),
      (
        false,
        'Còn sticker gửi thẳng vào khung chat sẽ nhảy hàng đợi ưu tiên và render bằng Vector Impeller trực tiếp, không đánh đổi độ nét hay FPS ${sc(12)}',
      ),
    ];

    // Older messages above so the user can scroll up cleanly through chat history.
    const fillerTopics = <String>[
      'HTTP GET /catalog trả về 5 bộ pack và 40 emoji động.',
      'ETag + Cache-Control + URL `.tgsbin` disk cache giúp lần mở lại 0ms mạng.',
      'Trong menu góc phải bạn có thể giả lập mạng chậm 80ms / 220ms để quan sát loading placeholder.',
      'Nhấn giữ bất kỳ sticker nào trong khay để xem trước kích thước lớn.',
      'Nhấn vào sticker đã gửi trong khung chat để replay hiệu ứng.',
      'Toàn bộ UI được dựng hoàn toàn bằng Cupertino (`package:flutter/cupertino.dart`).',
    ];

    for (var i = 0; i < 16; i++) {
      final t = now.subtract(Duration(minutes: 30 - i));
      final emojiA = sc(i % math.max(1, catalog.emojis.length));
      final emojiB = sc((i + 5) % math.max(1, catalog.emojis.length));
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
            '${sc(5)} Thử gõ tin nhắn kèm emoji từ tab Emoji, hoặc chạm nút ${sc(16)} bên dưới để mở khay sticker và gửi thử ngay nhé! ${sc(3)}',
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

  void _syncPlayback() {
    final active = _foreground && TickerMode.valuesOf(context).enabled;
    final fastEnabled =
        active &&
        _renderer == ChatRendererMode.fastlottie &&
        !_reduced &&
        !_pressure.constrained;
    _clock.configure(
      playing: active,
      reducedMotion: _reduced,
      maximumFrameRate: stickerThumbnailFrameRate,
    );
    _stickerSheet?.active = fastEnabled;
    _emojiSheet?.active = fastEnabled;
    _rasterCache.enabled = fastEnabled;
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
      _messageScroll.animateTo(
        0,
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
      );
    });
  }

  void _sendTextMessage() {
    final trimmed = _composerController.text.trim();
    if (trimmed.isEmpty) return;
    _composerController.clear();
    setState(() {
      _messages.add(
        ChatMessage.text(
          id: 'msg_${_messageSeq++}',
          text: trimmed,
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
    final code = item.shortcode;
    if (code == null || code.isEmpty) return;
    final value = _composerController.value;
    final selection = value.selection;
    final insertText = '$code ';
    final text = value.text;
    if (selection.isValid && selection.start >= 0 && selection.end <= text.length) {
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
      final nextText =
          text.isEmpty || text.endsWith(' ') || text.endsWith('\n')
          ? '$text$insertText'
          : '$text $insertText';
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

  Future<void> _showOptionsSheet() async {
    final server = _embeddedServer;
    await showCupertinoModalPopup<void>(
      context: context,
      builder: (ctx) => CupertinoActionSheet(
        title: const Text('Tuỳ chọn Server & Bộ nhớ đệm'),
        message: Text(
          'Endpoint: ${_catalog?.baseUri ?? '-'}\n'
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
                'Độ trễ mạng: 0 ms (Local)${server.simulatedLatency.inMilliseconds == 0 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulatedLatency = const Duration(milliseconds: 80);
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Độ trễ mạng: 80 ms (Fast 4G)${server.simulatedLatency.inMilliseconds == 80 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulatedLatency = const Duration(milliseconds: 220);
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Độ trễ mạng: 220 ms (Slow 3G)${server.simulatedLatency.inMilliseconds == 220 ? ' ✓' : ''}',
              ),
            ),
            CupertinoActionSheetAction(
              onPressed: () {
                server.simulateFailure = !server.simulateFailure;
                Navigator.of(ctx).pop();
                setState(() {});
              },
              child: Text(
                'Giả lập lỗi HTTP 503: ${server.simulateFailure ? 'Đang BẬT' : 'Đang TẮT'}',
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
              'Renderer: ${_renderer == ChatRendererMode.fastlottie ? 'FastLottie (Hero Vector + PingPong)' : 'Lottie Reference'}',
            ),
          ),
          CupertinoActionSheetAction(
            onPressed: () {
              final next = !_isDark;
              setState(() => _isDark = next);
              widget.onBrightnessChanged?.call(next);
              Navigator.of(ctx).pop();
            },
            child: Text(_isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'),
          ),
          CupertinoActionSheetAction(
            onPressed: () {
              Navigator.of(ctx).pop();
              unawaited(_showTelemetryDialog());
            },
            child: const Text('Xem chi tiết Telemetry Server & Cache'),
          ),
          CupertinoActionSheetAction(
            isDestructiveAction: true,
            onPressed: () {
              Navigator.of(ctx).pop();
              unawaited(_clearAllCaches());
            },
            child: const Text('Xoá sạch URL Cache & .flcache (Tải lại từ HTTP)'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.of(ctx).pop(),
          child: const Text('Đóng'),
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
            'PingPong GPU: ${(_rasterCache.gpuBytes / (1024 * 1024)).toStringAsFixed(2)} MiB\n'
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
                animate: true,
                size: 180,
                placeholderColor: _palette.tilePlaceholder,
                borderColor: _palette.incomingBorder,
                accentColor: _palette.accent,
                secondaryTextColor: _palette.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
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
            child: const Text('Đóng'),
          ),
          if (item.kind == TgsItemKind.sticker)
            CupertinoDialogAction(
              isDefaultAction: true,
              onPressed: () {
                Navigator.of(ctx).pop();
                _sendSticker(item);
              },
              child: const Text('Gửi Sticker'),
            ),
        ],
      ),
    );
  }

  List<(_DrawerTab kind, String id, String label, List<TgsRemoteItem> items)>
  _buildTabs(TgsRemoteCatalog catalog) => [
    (_DrawerTab.all, '__all__', 'Tất cả', catalog.stickers),
    (_DrawerTab.emoji, '__emoji__', 'Emoji', catalog.emojis),
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
    _rasterCache.dispose();
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
          border: Border(bottom: BorderSide(color: palette.separator, width: 0.5)),
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
                        'Đang khởi tạo Local HTTP TGS Server…',
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
                          'Không thể kết nối TGS Server:\n$_bootError',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: palette.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 16),
                        CupertinoButton.filled(
                          onPressed: _bootstrap,
                          child: const Text('Thử lại'),
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
                                    key: ValueKey('${msg.id}_${msg.reloadEpoch}'),
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
                                  duration: const Duration(milliseconds: 160),
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
    listenable: Listenable.merge([
      store,
      if (server != null) server!.stats,
    ]),
    builder: (context, _) {
      final subtitle = catalog == null
          ? 'Connecting…'
          : store.inFlightDownloads > 0 || store.queuedDownloads > 0
          ? 'HTTP tải ${store.inFlightDownloads + store.queuedDownloads} · ${catalog!.baseUri.authority}'
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
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final bool drawerOpen;
  final ValueListenable<bool> hasDraftListenable;
  final _Palette palette;
  final VoidCallback onToggleDrawer;
  final VoidCallback onSend;

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
          child: CupertinoTextField(
            key: const ValueKey('chat-composer-field'),
            controller: controller,
            focusNode: focusNode,
            minLines: 1,
            maxLines: 5,
            textInputAction: TextInputAction.send,
            onSubmitted: (_) => onSend(),
            placeholder: 'Nhắn tin hoặc chèn emoji động…',
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
        const SizedBox(width: 6),
        ValueListenableBuilder<bool>(
          valueListenable: hasDraftListenable,
          builder: (context, canSend, _) => CupertinoButton(
            key: const ValueKey('composer-send-button'),
            padding: EdgeInsets.zero,
            minimumSize: const Size.square(36),
            onPressed: canSend ? onSend : null,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 140),
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
  final List<(_DrawerTab kind, String id, String label, List<TgsRemoteItem> items)>
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
                      color: selected ? palette.pillActive : palette.pillInactive,
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
                    scrollCacheExtent: const ScrollCacheExtent.pixels(0),
                    addAutomaticKeepAlives: false,
                    addRepaintBoundaries: false,
                    itemCount: items.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
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
      message.isOutgoing ? CupertinoColors.white.withValues(alpha: 0.25) : palette.tilePlaceholder,
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

  static final RegExp _tokenRegex = RegExp(r':[a-z0-9_]+:');

  List<InlineSpan> _parseRichSpans(
    String text,
    TgsRemoteCatalog catalog,
    double emojiSize,
    Color placeholderColor,
  ) {
    final spans = <InlineSpan>[];
    var cursor = 0;
    for (final match in _tokenRegex.allMatches(text)) {
      final token = match.group(0)!;
      final item = catalog.shortcodeMap[token];
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
            size: emojiSize,
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
}

/// Inline emoji and sticker-grid thumbnail backed by [StickerSheet] +
/// [FastLottieRasterCache.pingPong] + [NetworkTgsStore].
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
    if (widget.renderer == ChatRendererMode.lottie) {
      return SizedBox.square(
        dimension: widget.size,
        child: _ReferenceNetworkCell(
          url: widget.item.urlString,
          store: widget.store,
          clock: widget.clock,
          animate: !widget.still,
          placeholderColor: widget.placeholderColor,
        ),
      );
    }

    final dpr = MediaQuery.devicePixelRatioOf(context);
    final listenable = widget.sheet.listenableFor(
      widget.item.urlString,
      widget.clock,
    );

    final paint = ListenableBuilder(
      listenable: widget.sheet,
      builder: (context, _) {
        final error = widget.sheet.errorFor(widget.item.urlString);
        if (error != null) {
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
            still: widget.still,
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
    final effectiveDpr = maxEdge <= 0
        ? devicePixelRatio
        : math.min(devicePixelRatio, sheet.pixelSize / maxEdge);
    final span = c.endFrame - c.startFrame;
    final frame = still || span <= 0
        ? 0.0
        : (((clock.microseconds + 1) / 1000000 * c.frameRate) % span)
              .clamp(0.0, span > 1 ? span - 1 : 0.0);
    final progress = c.isStatic || span <= 0 || still ? 0.0 : frame / span;
    player.draw(
      canvas,
      Offset.zero & size,
      progress,
      devicePixelRatio: math.max(0.1, effectiveDpr),
      coldFallback: (c, target) => _drawPlaceholder(c, target.size, target.topLeft),
    );
  }

  void _drawPlaceholder(Canvas canvas, Size size, [Offset origin = Offset.zero]) {
    final r = math.min(size.width, size.height) * 0.28;
    canvas.drawRRect(
      RRect.fromRectAndRadius(origin & size, Radius.circular(r)),
      Paint()..color = placeholderColor,
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
                      'Tải thất bại · Chạm để thử lại',
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
                    'Đang tải ${(widget.item.bytes / 1024).toStringAsFixed(0)} KB…',
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

        if (widget.renderer == ChatRendererMode.fastlottie && model.fast != null) {
          return GestureDetector(
            onTap: () => setState(() => _replayTick++),
            child: FastLottie(
              key: ValueKey('hero_${widget.item.id}_$_replayTick'),
              composition: model.fast!,
              width: widget.size,
              height: widget.size,
              animate: widget.animate,
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
            animate: widget.animate,
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
