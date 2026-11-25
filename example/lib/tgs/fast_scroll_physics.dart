import 'package:flutter/gestures.dart' show kMaxFlingVelocity;
import 'package:flutter/physics.dart';
import 'package:flutter/widgets.dart';

/// Bouncing scroll physics tuned for a smoother, longer glide on fast flings
/// while keeping initial release velocity 1:1 with the user's finger.
class FastBouncingScrollPhysics extends BouncingScrollPhysics {
  /// Creates bouncing scroll physics with reduced exponential friction.
  ///
  /// The [drag] coefficient controls velocity retention after 1 second
  /// (standard iOS [BouncingScrollSimulation] uses `0.135`; values closer to
  /// `1.0` glide farther, while `0.24` gives roughly 40% extra glide without
  /// feeling icy).
  const FastBouncingScrollPhysics({
    this.drag = 0.24,
    this.maxVelocity = kMaxFlingVelocity * 2.0,
    super.decelerationRate,
    super.parent,
  }) : assert(drag > 0.0 && drag < 1.0);

  /// Exponential drag factor passed to [FrictionSimulation].
  final double drag;

  /// Upper bound on fling velocity magnitudes.
  final double maxVelocity;

  @override
  FastBouncingScrollPhysics applyTo(ScrollPhysics? ancestor) {
    return FastBouncingScrollPhysics(
      drag: drag,
      maxVelocity: maxVelocity,
      decelerationRate: decelerationRate,
      parent: buildParent(ancestor),
    );
  }

  @override
  bool shouldUpdate(covariant FastBouncingScrollPhysics old) {
    return drag != old.drag ||
        maxVelocity != old.maxVelocity ||
        super.shouldUpdate(old);
  }

  @override
  double get maxFlingVelocity => switch (decelerationRate) {
    ScrollDecelerationRate.fast => kMaxFlingVelocity * 8.0,
    ScrollDecelerationRate.normal => maxVelocity,
  };

  @override
  Simulation? createBallisticSimulation(
    ScrollMetrics position,
    double velocity,
  ) {
    final Tolerance tolerance = toleranceFor(position);
    final bool isStationary = velocity.abs() < tolerance.velocity;
    final bool isRubberBand = isStationary && position.outOfRange;

    if (!isStationary || position.outOfRange) {
      return _FastBouncingScrollSimulation(
        spring: isRubberBand ? BouncingScrollPhysics.rubberBandSpring : spring,
        position: position.pixels,
        velocity: velocity,
        leadingExtent: position.minScrollExtent,
        trailingExtent: position.maxScrollExtent,
        drag: drag,
        tolerance: tolerance,
        constantDeceleration: switch (decelerationRate) {
          ScrollDecelerationRate.fast => 1400,
          ScrollDecelerationRate.normal => 0,
        },
      );
    }
    return null;
  }
}

class _FastBouncingScrollSimulation extends Simulation {
  _FastBouncingScrollSimulation({
    required double position,
    required double velocity,
    required this.leadingExtent,
    required this.trailingExtent,
    required this.spring,
    required double drag,
    double constantDeceleration = 0,
    super.tolerance,
  }) : assert(leadingExtent <= trailingExtent) {
    if (position < leadingExtent) {
      _springSimulation = _underscrollSimulation(position, velocity);
      _springTime = double.negativeInfinity;
    } else if (position > trailingExtent) {
      _springSimulation = _overscrollSimulation(position, velocity);
      _springTime = double.negativeInfinity;
    } else {
      _frictionSimulation = FrictionSimulation(
        drag,
        position,
        velocity,
        constantDeceleration: constantDeceleration,
      );
      final double finalX = _frictionSimulation.finalX;
      if (velocity > 0.0 && finalX > trailingExtent) {
        _springTime = _frictionSimulation.timeAtX(trailingExtent);
        _springSimulation = _overscrollSimulation(
          trailingExtent,
          _frictionSimulation
              .dx(_springTime)
              .clamp(
                -BouncingScrollSimulation.maxSpringTransferVelocity,
                BouncingScrollSimulation.maxSpringTransferVelocity,
              ),
        );
        assert(_springTime.isFinite);
      } else if (velocity < 0.0 && finalX < leadingExtent) {
        _springTime = _frictionSimulation.timeAtX(leadingExtent);
        _springSimulation = _underscrollSimulation(
          leadingExtent,
          _frictionSimulation
              .dx(_springTime)
              .clamp(
                -BouncingScrollSimulation.maxSpringTransferVelocity,
                BouncingScrollSimulation.maxSpringTransferVelocity,
              ),
        );
        assert(_springTime.isFinite);
      } else {
        _springTime = double.infinity;
      }
    }
  }

  final double leadingExtent;
  final double trailingExtent;
  final SpringDescription spring;

  late FrictionSimulation _frictionSimulation;
  late Simulation _springSimulation;
  late double _springTime;
  double _timeOffset = 0.0;

  Simulation _underscrollSimulation(double x, double dx) {
    return ScrollSpringSimulation(spring, x, leadingExtent, dx);
  }

  Simulation _overscrollSimulation(double x, double dx) {
    return ScrollSpringSimulation(spring, x, trailingExtent, dx);
  }

  Simulation _simulation(double time) {
    final Simulation simulation;
    if (time > _springTime) {
      _timeOffset = _springTime.isFinite ? _springTime : 0.0;
      simulation = _springSimulation;
    } else {
      _timeOffset = 0.0;
      simulation = _frictionSimulation;
    }
    return simulation..tolerance = tolerance;
  }

  @override
  double x(double time) => _simulation(time).x(time - _timeOffset);

  @override
  double dx(double time) => _simulation(time).dx(time - _timeOffset);

  @override
  bool isDone(double time) => _simulation(time).isDone(time - _timeOffset);
}
