import 'package:fastlottie_example/tgs/fast_scroll_physics.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('FastBouncingScrollPhysics preserves initial release velocity and glides farther', () {
    const fast = FastBouncingScrollPhysics(
      parent: AlwaysScrollableScrollPhysics(),
    );
    const standard = BouncingScrollPhysics(
      parent: AlwaysScrollableScrollPhysics(),
    );

    final metrics = FixedScrollMetrics(
      minScrollExtent: 0,
      maxScrollExtent: 100000,
      pixels: 100,
      viewportDimension: 800,
      axisDirection: AxisDirection.down,
      devicePixelRatio: 2.0,
    );

    final fastSim = fast.createBallisticSimulation(metrics, 3000.0);
    final standardSim = standard.createBallisticSimulation(metrics, 3000.0);

    expect(fastSim, isNotNull);
    expect(standardSim, isNotNull);
    expect(fastSim!.dx(0.0), closeTo(3000.0, 1e-6));
    expect(fastSim.x(10.0), greaterThan(standardSim!.x(10.0)));
  });

  test(
    'FastBouncingScrollPhysics bounces smoothly back into bounds at edges',
    () {
      const fast = FastBouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      );

      final nearTop = FixedScrollMetrics(
        minScrollExtent: 0,
        maxScrollExtent: 2000,
        pixels: 10,
        viewportDimension: 800,
        axisDirection: AxisDirection.down,
        devicePixelRatio: 2.0,
      );

      final sim = fast.createBallisticSimulation(nearTop, -4000.0);
      expect(sim, isNotNull);
      expect(sim!.x(0.05), lessThan(0.0));
      expect(sim.x(3.0), closeTo(0.0, 1.0));
    },
  );

  test('FastBouncingScrollPhysics preserves configuration across applyTo and shouldUpdate', () {
    const base = FastBouncingScrollPhysics(drag: 0.20, maxVelocity: 16000.0);
    final merged = base.applyTo(const AlwaysScrollableScrollPhysics());

    expect(merged.drag, 0.20);
    expect(merged.maxFlingVelocity, 16000.0);
    expect(merged.parent, isA<AlwaysScrollableScrollPhysics>());
    expect(
      base.shouldUpdate(const FastBouncingScrollPhysics(drag: 0.24)),
      isTrue,
    );
    expect(
      base.shouldUpdate(
        const FastBouncingScrollPhysics(drag: 0.20, maxVelocity: 16000.0),
      ),
      isFalse,
    );
  });
}
