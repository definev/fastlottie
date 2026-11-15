part of 'raster_core.dart';

// Both supported reference forms traverse named content groups.
final _contentReferenceSegments = RegExp(r"content\('([^']*)'\)");

/// Resolves the supported property expressions in compiler-owned JSON.
///
/// One instance per composition reuses the diagnostic scratch path across
/// layers. Resolution happens before tracks are compiled; it never evaluates
/// JavaScript or runs during playback. Shape path references are left intact
/// for [_ShapePathCompiler], which shares compiled geometry instead of JSON.
class _ExpressionResolver {
  _ExpressionResolver(this._compiler);

  final _Compiler _compiler;
  final _segments = <Object>[];

  void resolveLayer(Map<String, dynamic> layer, _JsonPath path) {
    _walk(
      layer,
      layer['shapes'] is List ? layer['shapes'] : const [],
      path,
      _segments,
    );
  }

  static final _positionExpression = RegExp(
    r"^var \$bm_rt;\s*\$bm_rt\s*=\s*transform\.[xy]Position;\s*$",
  );
  static final _contentExpression = RegExp(
    r"^var \$bm_rt;\s*\$bm_rt\s*=\s*((?:content\('[^']*'\)\.)+)(transform\.scale|transform\.rotation|opacity);\s*$",
  );
  static final _escapedName = RegExp(r'[\\"\x00-\x1f]');

  // Visit each container once. The scratch path is shared across the layers;
  // only an expression needs its own diagnostic path.
  void _walk(
    dynamic value,
    List roots,
    _JsonPath layerPath,
    List<Object> segments, {
    bool shapePath = false,
    Set<Object>? resolving,
  }) {
    if (value is Map<String, dynamic>) {
      final expression = value['x'];
      if (expression is String && expression.isNotEmpty) {
        if (shapePath && _ShapePathCompiler.reference.hasMatch(expression)) {
          return;
        }
        var path = layerPath;
        for (final segment in segments) {
          path = segment is int
              ? path.index(segment)
              : path.field(segment as String);
        }
        if (_resolveProperty(
          value,
          expression,
          roots,
          path,
          resolving ?? Set<Object>.identity(),
        )) {
          return;
        }
      }
      for (final key in value.keys) {
        final child = value[key];
        if (child is! Map<String, dynamic> && child is! List) continue;
        segments.add(key);
        _walk(
          child,
          roots,
          layerPath,
          segments,
          shapePath: key == 'ks' && value['ty'] == 'sh',
          resolving: resolving,
        );
        segments.removeLast();
      }
    } else if (value is List) {
      for (var i = 0; i < value.length; i++) {
        final child = value[i];
        if (child is! Map<String, dynamic> && child is! List) continue;
        segments.add(i);
        _walk(child, roots, layerPath, segments, resolving: resolving);
        segments.removeLast();
      }
    }
  }

  // Returns true when the authored property should be used as-is.
  bool _resolveProperty(
    Map<String, dynamic> value,
    String expression,
    List roots,
    _JsonPath path,
    Set<Object> resolving,
  ) {
    if (!resolving.add(value)) {
      _compiler.fail(path, 'Cyclic expression reference');
    }
    try {
      if (_positionExpression.hasMatch(expression)) {
        value.remove('x');
        return true;
      }
      final at = path.field('x');
      final match = _contentExpression.firstMatch(expression);
      if (match == null) _compiler.fail(at, 'Unsupported expression syntax');
      var scope = roots;
      Map<String, dynamic>? target;
      for (final nameMatch in _contentReferenceSegments.allMatches(match[1]!)) {
        final raw = nameMatch[1]!;
        final name = _escapedName.hasMatch(raw) ? jsonDecode('"$raw"') : raw;
        target = _uniqueMatch(scope, 'nm', name);
        if (target == null) {
          _compiler.fail(at, 'Missing/ambiguous content reference');
        }
        scope = target['it'] is List ? target['it'] : const [];
      }
      final property = switch (match[2]) {
        'transform.scale' => _uniqueMatch(scope, 'ty', 'tr')?['s'],
        'transform.rotation' => _uniqueMatch(scope, 'ty', 'tr')?['r'],
        _ => target?['o'],
      };
      final source = _compiler.map(property, at);
      if (identical(source, value)) {
        // A direct self read uses the authored, pre-expression value.
        value.remove('x');
        return true;
      }
      _walk(source, roots, at, <Object>[], resolving: resolving);
      value
        ..clear()
        ..addAll(source);
      return false;
    } finally {
      resolving.remove(value);
    }
  }

  Map<String, dynamic>? _uniqueMatch(List scope, String key, String value) {
    Map<String, dynamic>? found;
    for (final node in scope) {
      if (node is! Map<String, dynamic> || node[key] != value) continue;
      if (found != null) return null;
      found = node;
    }
    return found;
  }
}

/// Links raw shape paths in a single composition before they reach either
/// renderer. Only the source geometry is shared: each shape keeps its own
/// transform, styles and modifiers, and samples the same composition frame.
class _ShapePathCompiler {
  _ShapePathCompiler(this.compiler, this.layers);

  static final reference = RegExp(
    r"^var \$bm_rt;\s*\$bm_rt\s*=\s*thisComp\.layer\('([^']*)'\)\.((?:content\('[^']*'\)\.)+)path;\s*$",
  );

  final _Compiler compiler;
  final List<dynamic> layers;
  final _geometry = Map<Map<String, dynamic>, _BezierGeometry>.identity();
  final _resolving = Set<Map<String, dynamic>>.identity();

  _BezierGeometry geometry(dynamic raw, _JsonPath path) {
    final property = compiler.map(raw, path);
    final cached = _geometry[property];
    if (cached != null) return cached;
    final expression = property['x'];
    final match = expression is String
        ? reference.firstMatch(expression)
        : null;
    if (match == null) {
      return _geometry[property] = compiler._parseBezierTrack(property, path);
    }
    final at = path.field('x');
    compiler.check(property, path, const {'a', 'k', 'ix', 'x', 'l'});
    if (property['a'] != null && property['a'] != 0 && property['a'] != 1) {
      compiler.fail(path.field('a'), 'Invalid animated flag');
    }
    if (!_resolving.add(property)) {
      compiler.fail(at, 'Cyclic path reference');
    }
    try {
      final (source, sourcePath) = _target(match, at);
      return _geometry[property] = geometry(source, sourcePath);
    } finally {
      _resolving.remove(property);
    }
  }

  (Map<String, dynamic>, _JsonPath) _target(RegExpMatch match, _JsonPath at) {
    var (node, path) = _named(layers, match[1]!, _JsonPath.layers, at, 'layer');
    if (node['ty'] != 4) {
      compiler.fail(at, 'Path reference needs a shape layer');
    }
    var items = node['shapes'];
    path = path.field('shapes');
    for (final name in _contentReferenceSegments.allMatches(match[2]!)) {
      (node, path) = _named(items, name[1]!, path, at, 'content');
      items = node['ty'] == 'gr' ? node['it'] : null;
      if (items != null) path = path.field('it');
    }
    final property = node['ks'];
    if (node['ty'] != 'sh' || property is! Map<String, dynamic>) {
      compiler.fail(at, 'Path reference needs a Bézier path');
    }
    return (property, path.field('ks'));
  }

  (Map<String, dynamic>, _JsonPath) _named(
    dynamic items,
    String name,
    _JsonPath path,
    _JsonPath at,
    String kind,
  ) {
    if (items is List) {
      Map<String, dynamic>? found;
      var index = 0;
      for (var i = 0; i < items.length; i++) {
        final item = items[i];
        if (item is Map<String, dynamic> && item['nm'] == name) {
          if (found != null) {
            compiler.fail(at, 'Ambiguous $kind reference: $name');
          }
          found = item;
          index = i;
        }
      }
      if (found != null) return (found, path.index(index));
    }
    compiler.fail(at, 'Missing $kind reference: $name');
  }
}
