import 'package:fastlottie_example/tgs/pressure.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets(
    'pressure ignores isolated spikes, cools down without ticking, retries',
    (tester) async {
      final pressure = StickerPressure();
      var changes = 0;
      pressure.addListener(() => changes++);
      for (var i = 0; i < 20; i++) {
        pressure.observe(true);
        pressure.observe(false);
      }
      expect(pressure.constrained, isFalse);
      for (var i = 0; i < 6; i++) {
        pressure.observe(true);
      }
      expect(pressure.constrained, isTrue);
      expect(changes, 1);
      await tester.pump(const Duration(seconds: 4));
      expect(pressure.constrained, isTrue);
      await tester.pump(const Duration(seconds: 1));
      expect(pressure.constrained, isFalse);
      expect(changes, 2);
      for (var i = 0; i < 6; i++) {
        pressure.observe(true);
      }
      expect(pressure.constrained, isTrue);
      pressure.dispose();
      await tester.pump(const Duration(seconds: 6));
      expect(changes, 3);
      await tester.pumpWidget(const SizedBox());
    },
  );
}
