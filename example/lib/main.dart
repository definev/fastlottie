import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';

import 'tgs/cupertino_chat.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ensureSimdReady();
  runApp(const FastLottieCupertinoApp());
}

class FastLottieCupertinoApp extends StatefulWidget {
  const FastLottieCupertinoApp({super.key, this.memoryWorkload});

  final ChatMemoryWorkload? memoryWorkload;

  @override
  State<FastLottieCupertinoApp> createState() => _FastLottieCupertinoAppState();
}

class _FastLottieCupertinoAppState extends State<FastLottieCupertinoApp> {
  bool _isDark = true;

  static final _webQuery = kIsWeb
      ? Uri.base.queryParameters
      : const <String, String>{};

  static int? _positiveOption(String name) {
    final value = int.tryParse(_webQuery[name] ?? '');
    return value != null && value > 0 ? value : null;
  }

  @override
  Widget build(BuildContext context) => CupertinoApp(
    debugShowCheckedModeBanner: false,
    title: 'FastLottie Cupertino Network Chat',
    theme: CupertinoThemeData(
      brightness: _isDark ? Brightness.dark : Brightness.light,
      primaryColor: const Color(0xff635bff),
    ),
    home: CupertinoChatScreen(
      isDark: _isDark,
      memoryWorkload: widget.memoryWorkload,
      rasterWorkerCount: _positiveOption('workers'),
      framesPerStrip: _positiveOption('strip'),
      onBrightnessChanged: (next) => setState(() => _isDark = next),
    ),
  );
}
