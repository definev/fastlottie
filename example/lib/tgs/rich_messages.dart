import 'dart:math' as math;

import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/material.dart'; // ignore: deprecated_member_use
import 'package:lottie/lottie.dart';

import 'clock.dart';
import 'gallery.dart';
import 'posters.dart';
import 'sheet.dart';
import 'store.dart';

const topicEmojiAssets = [
  'assets/tgs/Topics-1794247486249/file_4798662.tgs',
  'assets/tgs/Topics-1794247486249/file_4798663.tgs',
  'assets/tgs/Topics-1794247486249/file_4798664.tgs',
  'assets/tgs/Topics-1794247486249/file_4798665.tgs',
  'assets/tgs/Topics-1794247486249/file_4798666.tgs',
  'assets/tgs/Topics-1794247486249/file_4798668.tgs',
  'assets/tgs/Topics-1794247486249/file_4798669.tgs',
  'assets/tgs/Topics-1794247486249/file_4798671.tgs',
  'assets/tgs/Topics-1794247486249/file_4798672.tgs',
  'assets/tgs/Topics-1794247486249/file_4798673.tgs',
  'assets/tgs/Topics-1794247486249/file_4798675.tgs',
  'assets/tgs/Topics-1794247486249/file_4798676.tgs',
  'assets/tgs/Topics-1794247486249/file_4798677.tgs',
  'assets/tgs/Topics-1794247486249/file_4798678.tgs',
  'assets/tgs/Topics-1794247486249/file_4798679.tgs',
  'assets/tgs/Topics-1794247486249/file_4798682.tgs',
  'assets/tgs/Topics-1794247486249/file_4798683.tgs',
  'assets/tgs/Topics-1794247486249/file_4798684.tgs',
  'assets/tgs/Topics-1794247486249/file_4798686.tgs',
  'assets/tgs/Topics-1794247486249/file_4798687.tgs',
  'assets/tgs/Topics-1794247486249/file_4798688.tgs',
  'assets/tgs/Topics-1794247486249/file_4798689.tgs',
  'assets/tgs/Topics-1794247486249/file_4798691.tgs',
  'assets/tgs/Topics-1794247486249/file_4798692.tgs',
  'assets/tgs/Topics-1794247486249/file_4798693.tgs',
  'assets/tgs/Topics-1794247486249/file_4798694.tgs',
  'assets/tgs/Topics-1794247486249/file_4798695.tgs',
  'assets/tgs/Topics-1794247486249/file_4798696.tgs',
  'assets/tgs/Topics-1794247486249/file_4798697.tgs',
  'assets/tgs/Topics-1794247486249/file_4798698.tgs',
  'assets/tgs/Topics-1794247486249/file_4798700.tgs',
  'assets/tgs/Topics-1794247486249/file_4798701.tgs',
  'assets/tgs/Topics-1794247486249/file_4798702.tgs',
  'assets/tgs/Topics-1794247486249/file_4798703.tgs',
  'assets/tgs/Topics-1794247486249/file_4798705.tgs',
  'assets/tgs/Topics-1794247486249/file_4798706.tgs',
  'assets/tgs/Topics-1794247486249/file_4798707.tgs',
  'assets/tgs/Topics-1794247486249/file_4798708.tgs',
  'assets/tgs/Topics-1794247486249/file_4798710.tgs',
  'assets/tgs/Topics-1794247486249/file_4798713.tgs',
];

/// WidgetSpan reserves fixed inline metrics; only the emoji canvas repaints
/// using background-decoded ping-pong `ui.Image` buffers and `StickerPosters`
/// fallback while cold frames decode off the UI isolate.
class InlineSticker extends StatefulWidget {
  const InlineSticker({
    super.key,
    required this.asset,
    required this.label,
    required this.sheet,
    required this.posters,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    this.size = 24,
    this.repaintBoundary = true,
  });
  final String asset, label;
  final StickerSheet sheet;
  final StickerPosters posters;
  final StickerClock clock;
  final TgsStore store;
  final TgsRenderer renderer;
  final bool still, repaintBoundary;
  final double size;

  @override
  State<InlineSticker> createState() => _InlineStickerState();
}

class _InlineStickerState extends State<InlineSticker> {
  bool _pinned = false;

  void _syncPin() {
    final shouldPin = widget.renderer == TgsRenderer.fastlottie && !widget.still;
    if (shouldPin == _pinned) return;
    if (shouldPin) {
      widget.sheet.acquirePin(widget.asset);
    } else {
      widget.sheet.releasePin(widget.asset);
    }
    _pinned = shouldPin;
  }

  @override
  void initState() {
    super.initState();
    _syncPin();
  }

  @override
  void didUpdateWidget(InlineSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.asset != widget.asset || oldWidget.sheet != widget.sheet) {
      if (_pinned) {
        oldWidget.sheet.releasePin(oldWidget.asset);
        _pinned = false;
      }
    }
    _syncPin();
  }

  @override
  void dispose() {
    if (_pinned) {
      widget.sheet.releasePin(widget.asset);
      _pinned = false;
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Semantics(
    label: widget.label,
    image: true,
    child: ExcludeSemantics(
      child: SizedBox.square(
        dimension: widget.size,
        child: widget.renderer == TgsRenderer.fastlottie
            ? _buildFastPaint(context)
            : StickerCell(
                index: -1,
                asset: widget.asset,
                store: widget.store,
                clock: widget.clock,
                renderer: widget.renderer,
                animate: !widget.still,
                silhouette: widget.still,
                maximumFrameRate: 30,
                padding: EdgeInsets.zero,
              ),
      ),
    ),
  );

  Widget _buildFastPaint(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    final paint = CustomPaint(
      painter: _InlinePainter(
        widget.asset,
        widget.sheet,
        widget.posters,
        widget.clock,
        widget.still,
        dpr,
      ),
    );
    return widget.repaintBoundary ? RepaintBoundary(child: paint) : paint;
  }
}

class _InlinePainter extends CustomPainter {
  _InlinePainter(
    this.asset,
    this.sheet,
    this.posters,
    this.clock,
    this.still,
    this.devicePixelRatio,
  ) : super(
        repaint: still ? null : sheet.listenableFor(asset, clock),
      );
  final String asset;
  final StickerSheet sheet;
  final StickerPosters posters;
  final StickerClock clock;
  final bool still;
  final double devicePixelRatio;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    if (still) {
      posters.draw(canvas, asset, Offset.zero & size);
      return;
    }
    final player = sheet.playerFor(asset);
    if (player == null) {
      posters.draw(canvas, asset, Offset.zero & size);
      return;
    }
    final c = player.composition;
    final maxEdge = math.max(size.width, size.height);
    final effectiveDpr = maxEdge <= 0
        ? devicePixelRatio
        : math.min(devicePixelRatio, sheet.pixelSize / maxEdge);
    final span = c.endFrame - c.startFrame;
    final frame = span <= 0
        ? 0.0
        : (((clock.microseconds + 1) / 1000000 * c.frameRate) % span)
              .clamp(0.0, span > 1 ? span - 1 : 0.0);
    final progress = c.isStatic || span <= 0 ? 0.0 : frame / span;
    player.draw(
      canvas,
      Offset.zero & size,
      progress,
      devicePixelRatio: math.max(0.1, effectiveDpr),
      coldFallback: posters.sources.containsKey(asset)
          ? (c, target) => posters.draw(c, asset, target)
          : null,
    );
  }

  @override
  bool shouldRepaint(_InlinePainter old) =>
      old.asset != asset ||
      old.sheet != sheet ||
      old.posters != posters ||
      old.clock != clock ||
      old.still != still ||
      old.devicePixelRatio != devicePixelRatio;
}

/// Dedicated hero TGS message renderer with zero quality/FPS trade-offs.
/// Renders via direct Impeller vector display lists ([FastLottieCache.unbounded])
/// on its own vsync-locked [AnimationController], bypassed from any shared
/// ping-pong software worker pool or 30fps thumbnail clock.
class SentSticker extends StatefulWidget {
  const SentSticker({
    super.key,
    required this.asset,
    required this.store,
    required this.posters,
    required this.renderer,
    this.animate = true,
    this.size = 320,
  });

  final String asset;
  final TgsStore store;
  final StickerPosters posters;
  final TgsRenderer renderer;
  final bool animate;
  final double size;

  @override
  State<SentSticker> createState() => _SentStickerState();
}

class _SentStickerState extends State<SentSticker> {
  late TgsLease _lease;

  void _acquire() {
    _lease = widget.store.acquire(
      widget.asset,
      reference: widget.renderer == TgsRenderer.lottie,
      priority: true,
    );
  }

  @override
  void initState() {
    super.initState();
    _acquire();
  }

  @override
  void didUpdateWidget(SentSticker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.asset != widget.asset ||
        oldWidget.store != widget.store ||
        (oldWidget.renderer == TgsRenderer.lottie) !=
            (widget.renderer == TgsRenderer.lottie)) {
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
          return const Center(child: Icon(Icons.error_outline));
        }
        if (model == null) {
          return CustomPaint(
            painter: _PosterPainter(widget.posters, widget.asset),
          );
        }
        if (widget.renderer == TgsRenderer.fastlottie && model.fast != null) {
          return FastLottie(
            composition: model.fast!,
            width: widget.size,
            height: widget.size,
            animate: widget.animate,
            repeat: true,
            useFrameRate: true,
            usePipeline: false,
            cache: FastLottieCache.unbounded,
          );
        }
        if (widget.renderer == TgsRenderer.lottie && model.reference != null) {
          return Lottie(
            composition: model.reference!,
            animate: widget.animate,
            repeat: true,
            frameRate: FrameRate.composition,
            fit: BoxFit.contain,
          );
        }
        return CustomPaint(
          painter: _PosterPainter(widget.posters, widget.asset),
        );
      },
    ),
  );
}

class _PosterPainter extends CustomPainter {
  const _PosterPainter(this.posters, this.asset);
  final StickerPosters posters;
  final String asset;

  @override
  void paint(Canvas canvas, Size size) {
    if (!size.isEmpty) {
      posters.draw(canvas, asset, Offset.zero & size);
    }
  }

  @override
  bool shouldRepaint(_PosterPainter old) =>
      old.posters != posters || old.asset != asset;
}

class RichMessageList extends StatelessWidget {
  const RichMessageList({
    super.key,
    required this.sheet,
    required this.posters,
    required this.clock,
    required this.store,
    required this.renderer,
    required this.still,
    this.animateSent,
    this.rasterCache,
    this.sentStickers = const [],
    this.controller,
  });
  final StickerSheet sheet;
  final StickerPosters posters;
  final StickerClock clock;
  final TgsStore store;
  final TgsRenderer renderer;
  final bool still;
  final bool? animateSent;
  final FastLottieRasterCache? rasterCache;
  final List<String> sentStickers;
  final ScrollController? controller;

  @override
  Widget build(BuildContext context) {
    final scaled = MediaQuery.textScalerOf(context).scale(18);
    InlineSpan emoji(int index, String label) => WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: InlineSticker(
        asset: topicEmojiAssets[index],
        label: label,
        sheet: sheet,
        posters: posters,
        clock: clock,
        store: store,
        renderer: renderer,
        still: still,
        size: scaled * 1.35,
      ),
    );
    const bold = TextStyle(fontWeight: FontWeight.w700);
    final messages = <List<InlineSpan>>[
      [
        emoji(0, 'Special offer'),
        const TextSpan(text: ' MẶT HÀNG VỪA GIẢM GIÁ\n\n', style: bold),
        emoji(1, 'Product'),
        const TextSpan(text: ' Item: '),
        emoji(2, 'Service plan'),
        const TextSpan(text: ' GÓI PREMIUM 30 NGÀY\n', style: bold),
        emoji(3, 'Original price'),
        const TextSpan(text: ' Was: '),
        const TextSpan(
          text: '\$19.99\n',
          style: TextStyle(decoration: TextDecoration.lineThrough),
        ),
        emoji(0, 'Discounted price'),
        const TextSpan(text: ' Sale price: '),
        const TextSpan(text: '\$14.99\n', style: bold),
        emoji(4, 'Stock'),
        const TextSpan(text: ' In stock: '),
        const TextSpan(text: '3\n\n', style: bold),
        emoji(5, 'Cart'),
        const TextSpan(text: ' This is a demo message. Animated emoji '),
        emoji(2, 'Animated emoji'),
        const TextSpan(
          text: ' renders smoothly inline, and text wraps naturally.',
        ),
      ],
      [
        const TextSpan(text: 'You can insert '),
        emoji(3, 'First emoji'),
        const TextSpan(
          text: ' anywhere in the sentence, including consecutive emoji ',
        ),
        emoji(0, 'Second emoji'),
        emoji(1, 'Third emoji'),
        emoji(5, 'Fourth emoji'),
        const TextSpan(text: '\nChữ đậm ', style: bold),
        const TextSpan(
          text: 'and regular text stay within the same paragraph.',
        ),
      ],
    ];
    final total = demoMessageCount + sentStickers.length;
    return ListView.builder(
      key: const ValueKey('rich-message-list'),
      controller: controller,
      reverse: true,
      scrollCacheExtent: const ScrollCacheExtent.pixels(0),
      addAutomaticKeepAlives: false,
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
      itemCount: total,
      itemBuilder: (context, visualIndex) {
        final index = total - 1 - visualIndex;
        if (index >= demoMessageCount) {
          return Align(
            key: ValueKey('sent-sticker-${index - demoMessageCount}'),
            alignment: Alignment.centerRight,
            child: SentSticker(
              asset: sentStickers[index - demoMessageCount],
              store: store,
              posters: posters,
              renderer: renderer,
              animate: animateSent ?? !still,
              size: 320,
            ),
          );
        }
        return Align(
          key: ValueKey('message-$index'),
          alignment: index.isEven
              ? Alignment.centerLeft
              : Alignment.centerRight,
          child: Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xff252529),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text.rich(
              TextSpan(
                children: index < messages.length
                    ? messages[index]
                    : [
                        emoji(index % topicEmojiAssets.length, 'Emoji'),
                        TextSpan(text: ' ${demoMessageTexts[index - 2]}'),
                        const TextSpan(text: '\n'),
                        TextSpan(
                          text: [
                            'Note',
                            'Saved',
                            'See you',
                            'New update',
                          ][index % 4],
                          style: bold,
                        ),
                        const TextSpan(text: ' '),
                        emoji(
                          (index + 2) % topicEmojiAssets.length,
                          'Emoji động',
                        ),
                      ],
              ),
              style: const TextStyle(
                fontSize: 18,
                height: 1.35,
                color: Color(0xfff5f3f7),
              ),
            ),
          ),
        );
      },
    );
  }
}

const demoMessageCount = 60;
// The first two messages above exercise rich formatting; these 58 messages
// provide distinct content and varied wrapping for a realistic scroll history.
const demoMessageTexts = [
  "Good morning! Starting the day with a fresh cup of coffee.",
  "Design review moved to 9:30 AM, please be on time.",
  "I just uploaded the updated chat mockup to the shared drive.",
  "How about trying the new noodle place around the corner for lunch?",
  "Table booked for four at 12:00 PM under Alex.",
  "This longer paragraph tests how inline emoji flow between sentences without distorting line height or clipping text.",
  "Rain is expected later this afternoon, bring an umbrella.",
  "Shopping list: artisan bread, milk, organic eggs, and berries.",
  "The book you recommended was fascinating, finished chapter one already.",
  "Let's relax and catch a nice movie tonight.",
  "Weekend train tickets are confirmed, departing at 7:00 AM sharp.",
  "I will arrive ten minutes early to collect the boarding passes.",
  "Remember to fully charge your camera batteries before the trip.",
  "First stop on our route is the scenic riverbank park.",
  "Captured a breathtaking sunset photo by the lake!",
  "The new photo album features both wide landscapes and portraits.",
  "Thank you so much for helping organize yesterday's meetup.",
  "The birthday cake was just delivered to the lobby.",
  "Does everyone prefer dark chocolate or strawberry cream?",
  "Keeping the background music low so we can chat comfortably.",
  "Trying out an authentic homemade curry recipe this week.",
  "The soup needs to simmer for another twenty minutes.",
  "Don't forget to garnish with fresh herbs before serving.",
  "The workspace feels much calmer after a quick tidy-up.",
  "Finally found the wireless earbuds hidden in the drawer.",
  "The succulent by the window just sprouted a tiny new leaf.",
  "Morning jogging session scheduled at the park at 6:00 AM.",
  "Completed a solid five-kilometer run today.",
  "Take a breather, grab some water, and rest up.",
  "Next week's training plan includes two swimming sessions.",
  "This acoustic playlist is perfect for quiet reading sessions.",
  "Downloaded the entire road trip playlist for offline listening.",
  "Anyone up for a board game night this Friday?",
  "The rules are super easy to pick up, beginners welcome.",
  "What a close match, blue team took the victory at the last second!",
  "Heading over to the post office tomorrow to send a package.",
  "Shipping address and contact details have been double-checked.",
  "Included a handwritten postcard inside the gift parcel.",
  "Tracking notification will arrive via email this afternoon.",
  "Package received safely, thank you so much!",
  "Goals for the upcoming month: read more, walk daily, sleep early.",
  "Learned several interesting idioms from today's lesson.",
  "Color-coding my notes makes review sessions much faster.",
  "Testing this sentence with larger typography to verify dynamic text wrapping.",
  "Emoji can sit at the beginning, middle, or right next to an emphasized keyword.",
  "The community library is hosting a used book exchange this weekend.",
  "Bringing three classic mystery novels to swap.",
  "Would you like to visit the modern art gallery afterwards?",
  "The exhibition stays open until 8:00 PM with a lounge area.",
  "The cafe next door serves wonderful lemon tarts.",
  "Pinning the location so we can easily navigate back later.",
  "Testing a brand new animated sticker set for messaging.",
  "Scroll the bottom tray to browse through the sticker collection.",
  "Tap any sticker to send it as an individual animated message.",
  "You can send multiple stickers in a row, each forming a new bubble.",
  "The conversation history is fully retained when switching renderers.",
  "Scroll up through previous messages, then try sending another sticker.",
  "Reached the end of the history. Pick a sticker below to reply!",
];
