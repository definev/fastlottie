import 'package:fastlottie/fastlottie.dart';
// Keep compatible with Flutter versions before the cupertino_ui split.
// ignore: deprecated_member_use
import 'package:flutter/cupertino.dart';

import 'tgs/cupertino_chat.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ensureSimdReady();
  runApp(const FastLottieCupertinoApp());
}

class FastLottieCupertinoApp extends StatefulWidget {
  const FastLottieCupertinoApp({super.key});

  @override
  State<FastLottieCupertinoApp> createState() => _FastLottieCupertinoAppState();
}

class _FastLottieCupertinoAppState extends State<FastLottieCupertinoApp> {
  bool _isDark = true;

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
      onBrightnessChanged: (next) => setState(() => _isDark = next),
    ),
  );
}
