part of '../raster/raster_core.dart';

// A diagnostic path only becomes a string when compilation fails.
final class _JsonPath {
  const _JsonPath(this.parent, this.segment);

  static const root = _JsonPath(null, null);
  static const layers = _JsonPath(root, 'layers');

  final _JsonPath? parent;
  final Object? segment;

  _JsonPath field(String name) => _JsonPath(this, name);
  _JsonPath index(int index) => _JsonPath(this, index);

  void _write(StringBuffer out) {
    final prefix = parent;
    if (prefix == null) {
      out.write(r'$');
      return;
    }
    prefix._write(out);
    final part = segment;
    if (part is int) {
      out.write('[$part]');
    } else {
      out.write('.$part');
    }
  }

  @override
  String toString() {
    final out = StringBuffer();
    _write(out);
    return out.toString();
  }
}

// The first sample determines the width; subsequent samples write in place.
typedef _TrackDecoder = Float32List Function(
  dynamic raw,
  _JsonPath path,
  Float32List? output,
  int offset,
  int width,
);

class _Compiler {
  _Compiler(this.options);
  static const double _maxFrameSpan = 36000;
  static const double _minFrameRate = 1e-3;
  static const double _maxFrameRate = 10000;
  static const int _maxCompiledCommands = 200000;
  static const int _maxGroupDepth = 64;
  static final Paint _lumaBackdropPaint = Paint()
    ..color = const Color(0xFF000000);

  final FastLottieOptions options;
  late double width, height, start, end, fps;
  late final Rect boundsRect = Rect.fromLTWH(0, 0, width, height);
  final layers = <_Layer>[];
  var commands = 1;
  bool hasStroke = false;
  late final bool isStatic = layers.every(
    (l) => l.isStatic && l.ip <= start && l.op >= end,
  );
  List<int>? _commandBudget;

  void _chargeCommands(int count, _JsonPath path) {
    commands += count;
    final budget = _commandBudget;
    if (budget != null) {
      budget[0] += count;
      if (budget[0] > _maxCompiledCommands) {
        fail(
          path,
          'Composition exceeds command budget ($_maxCompiledCommands)',
        );
      }
    } else if (commands > _maxCompiledCommands) {
      fail(path, 'Composition exceeds command budget ($_maxCompiledCommands)');
    }
  }

  void dispose() {}

  Never fail(_JsonPath path, String feature) =>
      throw UnsupportedLottieException(path.toString(), feature);
  Map<String, dynamic> map(dynamic value, _JsonPath path) {
    if (value is! Map<String, dynamic>) fail(path, 'Expected object');
    return value;
  }

  double number(dynamic value, _JsonPath path, [Object? segment]) {
    if (value is! num || !value.isFinite) {
      fail(switch (segment) {
        int i => path.index(i),
        String field => path.field(field),
        _ => path,
      }, 'Expected finite number');
    }
    return value.toDouble();
  }

  void check(Map<String, dynamic> m, _JsonPath path, Set<String> allowed) {
    for (final k in m.keys) {
      if (!allowed.contains(k)) fail(path.field(k), 'Unsupported field');
    }
  }

  void zero(Map<String, dynamic> m, String key, _JsonPath path) {
    if (m[key] != null && m[key] != 0 && m[key] != false) {
      fail(path.field(key), 'Unsupported nonzero $key');
    }
  }

  void empty(Map<String, dynamic> m, String key, _JsonPath path) {
    final value = m[key];
    if (value != null &&
        !(value is List && value.isEmpty) &&
        !(value is Map && value.isEmpty)) {
      fail(path.field(key), 'Unsupported $key');
    }
  }

  void compile(
    Map<String, dynamic> json, {
    Map<String, Map<String, dynamic>>? assetModels,
    Set<String> precompStack = const {},
    Map<(String, double, double), _Compiler>? precompTemplates,
    List<int>? commandBudget,
  }) {
    _commandBudget = commandBudget ?? <int>[1];
    check(json, _JsonPath.root, const {
      'v',
      'fr',
      'ip',
      'op',
      'w',
      'h',
      'nm',
      'ddd',
      'assets',
      'layers',
      'markers',
      'meta',
      'fonts',
      'chars',
      'slots',
      'tgs',
      'comps',
      'fitz',
      'props',
    });
    zero(json, 'ddd', _JsonPath.root);
    for (final key in ['fonts', 'chars', 'slots', 'props']) {
      empty(json, key, _JsonPath.root);
    }
    width = number(json['w'], _JsonPath.root.field('w'));
    height = number(json['h'], _JsonPath.root.field('h'));
    start = number(json['ip'], _JsonPath.root.field('ip'));
    end = number(json['op'], _JsonPath.root.field('op'));
    fps = number(json['fr'], _JsonPath.root.field('fr'));
    final frameSpan = end - start;
    if (width <= 0 ||
        height <= 0 ||
        fps < _minFrameRate ||
        fps > _maxFrameRate ||
        frameSpan <= 0 ||
        frameSpan > _maxFrameSpan) {
      fail(_JsonPath.root, 'Invalid bounds/timing');
    }
    final assets = assetModels ?? <String, Map<String, dynamic>>{};
    if (assetModels == null) {
      for (final field in ['assets', 'comps']) {
        final definitions = json[field] ?? [];
        if (definitions is! List) {
          fail(_JsonPath.root.field(field), 'Expected asset definitions');
        }
        for (final raw in definitions) {
          final definition = map(raw, _JsonPath.root.field(field));
          final id = definition['id'];
          if (id is! String) {
            fail(_JsonPath.root.field(field), 'Expected asset id');
          }
          assets[id] = definition;
        }
      }
    }
    final list = json['layers'];
    if (list is! List) fail(_JsonPath.layers, 'Expected layers');
    final precomps =
        precompTemplates ?? <(String, double, double), _Compiler>{};
    final paths = _ShapePathCompiler(this, list);
    final byId = <int, _Layer>{};
    final parents = <_Layer, int>{};
    final expressions = _ExpressionResolver(this);
    final setMattes = <_Layer, (int, _JsonPath)>{};
    for (var i = 0; i < list.length; i++) {
      final path = _JsonPath.layers.index(i);
      _chargeCommands(1, path);
      final m = map(list[i], path);
      check(m, path, const {
        'ddd',
        'ind',
        'ty',
        'nm',
        'sr',
        'st',
        'ip',
        'op',
        'ks',
        'shapes',
        'parent',
        'ao',
        'bm',
        'tt',
        'td',
        'tp',
        'masksProperties',
        'hasMask',
        'ef',
        'hd',
        'cl',
        'ln',
        'refId',
        'w',
        'h',
        'ct',
        'sw',
        'sh',
        'sc',
        'tm',
        'sy',
      });
      final bm = m['bm'] ?? 0;
      if (bm is! int || bm < 0 || bm > 16) {
        fail(path.field('bm'), 'Blend mode $bm');
      }
      for (final key in ['ddd', 'ao']) {
        zero(m, key, path);
      }
      if (m['hasMask'] != null &&
          m['hasMask'] is! bool &&
          m['hasMask'] != 0 &&
          m['hasMask'] != 1) {
        fail(path.field('hasMask'), 'Expected boolean hasMask');
      }
      final matteType = m['tt'] ?? 0;
      if (matteType is! int || matteType < 0 || matteType > 4) {
        fail(path.field('tt'), 'Matte type');
      }
      if (m['tp'] != null && m['tp'] != 0) {
        if (matteType == 0 ||
            i == 0 ||
            m['tp'] != (list[i - 1]['ind'] ?? (i - 1))) {
          fail(path.field('tp'), 'Unsupported nonzero tp');
        }
      }
      if (m['td'] != null && m['td'] != 0 && m['td'] != 1) {
        fail(path.field('td'), 'Matte source flag');
      }
      final masks = _compileMasks(
        m['masksProperties'],
        path.field('masksProperties'),
      );
      expressions.resolveLayer(m, path);
      final stretch = number(m['sr'] ?? 1, path.field('sr'));
      if (stretch == 0) {
        fail(path.field('sr'), 'Invalid zero time stretch');
      }
      final type = m['ty'];
      if (type != 4 && type != 3 && type != 0 && type != 1) {
        fail(path.field('ty'), 'Layer type $type');
      }
      final (fillEffect, setMatte) = _effects(m['ef'], path.field('ef'), list);
      final shadow = _innerShadow(m['sy'], path.field('sy'));
      if (shadow != null && fillEffect != null) {
        fail(path.field('ef'), 'Fill with Inner Shadow');
      }
      if (setMatte != null && (type != 4 || matteType != 0 || bm != 0)) {
        fail(
          setMatte.$2,
          'Set Matte requires a normal shape layer without a track matte',
        );
      }
      final transform = _transform(m['ks'], path.field('ks'));
      _Group? group;
      if (type == 4) {
        group = _group(m['shapes'], path.field('shapes'), paths);
      } else if (type == 1) {
        final sw = number(m['sw'] ?? 0, path.field('sw'));
        final sh = number(m['sh'] ?? 0, path.field('sh'));
        final sc = m['sc'];
        if (sc is! String || !sc.startsWith('#')) {
          fail(path.field('sc'), 'Invalid solid color');
        }
        final hex = sc.substring(1);
        final rgb = int.parse(hex, radix: 16);
        final r = ((rgb >> 16) & 0xff) / 255.0;
        final g = ((rgb >> 8) & 0xff) / 255.0;
        final b = (rgb & 0xff) / 255.0;
        final pos = Track.constant([sw * 0.5, sh * 0.5]);
        final size = Track.constant([sw, sh]);
        final radius = Track.constant([0.0]);
        final shape = _Shape(_Primitive(false, pos, size, radius, false));
        final color = Track.constant([r, g, b])..gamma = true;
        final opacity = Track.constant([100.0]);
        final width = Track.constant([1.0]);
        final style = _Style(
          [shape],
          color,
          opacity,
          width,
          false,
          false,
          1,
          1,
          4.0,
        );
        group = _Group([shape], [style], _Transform.identity());
      }
      _Compiler? child;
      if (type == 0) {
        final id = m['refId'];
        final asset = assets[id];
        if (id is! String || asset == null || asset['layers'] is! List) {
          fail(path.field('refId'), 'Missing precomposition');
        }
        if (precompStack.contains(id)) {
          fail(path.field('refId'), 'Cyclic precomposition');
        }
        final cw = number(m['w'] ?? width, path.field('w'));
        final ch = number(m['h'] ?? height, path.field('h'));
        final precompKey = (id, cw, ch);
        var template = precomps[precompKey];
        if (template == null) {
          template = _Compiler(options)
            ..compile(
              {
                'w': cw,
                'h': ch,
                'ip': 0,
                'op': end - start,
                'fr': fps,
                'layers': asset['layers'],
              },
              assetModels: assets,
              precompStack: {...precompStack, id},
              precompTemplates: precomps,
              commandBudget: _commandBudget,
            );
          precomps[precompKey] = template;
          child = template;
          commands += child.commands;
        } else {
          // Charge budget BEFORE cloning so diamond precomp DAGs fail fast
          // without exponential allocation.
          _chargeCommands(template.commands, path.field('refId'));
          child = _Fork().scene(template);
        }
        hasStroke |= child.hasStroke;
      }
      final timeRemap = m['tm'] != null
          ? _track(m['tm'], path.field('tm'), 1, [0])
          : null;
      final layer = _Layer(
        transform,
        group,
        number(m['ip'] ?? start, path.field('ip')),
        number(m['op'] ?? end, path.field('op')),
        m['hd'] == true,
        child: child,
        offset: number(m['st'] ?? 0, path.field('st')),
        stretch: stretch,
        timeRemap: timeRemap,
        matteType: setMatte == null ? matteType : 1,
        masks: masks,
        blendMode: bm,
        innerShadow: shadow,
        fillEffect: fillEffect,
        usesSetMatte: setMatte != null,
      );
      if (setMatte != null) setMattes[layer] = setMatte;
      layers.add(layer);
      final id = m['ind'] ?? i;
      if (id is! int || byId.containsKey(id)) {
        fail(path.field('ind'), 'Invalid/duplicate layer id');
      }
      byId[id] = layer;
      if (m['parent'] != null) {
        if (m['parent'] is! int) {
          fail(path.field('parent'), 'Invalid parent id');
        }
        parents[layer] = m['parent'];
      }
    }
    // Link only after all layers exist, so forward references are valid.
    _linkMattes(list, byId, setMattes);
    _linkParents(byId, parents);
  }

  List<_Mask>? _compileMasks(dynamic raw, _JsonPath path) {
    if (raw == null) return null;
    if (raw is! List) fail(path, 'Expected list');
    if (raw.isEmpty) return null;

    final masks = <_Mask>[];
    for (var i = 0; i < raw.length; i++) {
      final maskPath = path.index(i);
      final mask = map(raw[i], maskPath);
      check(mask, maskPath, const {'inv', 'mode', 'pt', 'o', 'x', 'nm'});
      final inverted = mask['inv'] == true;
      final mode = (mask['mode'] as String?) ?? 'a';
      if (!const {'a', 's', 'i', 'f', 'n'}.contains(mode)) {
        fail(maskPath.field('mode'), 'Unsupported mask mode $mode');
      }
      if (mask['pt'] == null) {
        fail(maskPath.field('pt'), 'Missing mask path');
      }
      final geometry = _parseBezierTrack(mask['pt'], maskPath.field('pt'));
      final opacity = mask['o'] != null
          ? _track(mask['o'], maskPath.field('o'), 1, [100])
          : Track.constant([100]);
      final expand = mask['x'] != null
          ? _track(mask['x'], maskPath.field('x'), 1, [0])
          : null;
      masks.add(_Mask(geometry, mode, opacity, inverted, expand: expand));
    }
    return masks;
  }

  void _linkMattes(
    List rawLayers,
    Map<int, _Layer> byId,
    Map<_Layer, (int, _JsonPath)> setMattes,
  ) {
    for (var i = 0; i < layers.length; i++) {
      final layer = layers[i];
      if (layer.matteType != 0 && !layer.usesSetMatte) {
        if (i == 0) {
          fail(
            _JsonPath.layers.index(i).field('tt'),
            'Missing preceding matte source',
          );
        }
        final source = layers[i - 1];
        if (source.matteType != 0) {
          fail(_JsonPath.layers.index(i).field('tt'), 'Chained matte');
        }
        layer.matte = source;
        source.isMatteSource = true;
        commands += 4;
      }
    }
    for (final entry in setMattes.entries) {
      final target = entry.key;
      final (id, at) = entry.value;
      final source = byId[id];
      if (source == null ||
          source.group == null ||
          source.hidden ||
          source != target && source.matteType != 0) {
        fail(
          at,
          'Set Matte requires a visible shape source without its own matte',
        );
      }
      // Set Matte samples a source without consuming its ordinary draw.
      // A self reference samples the layer before its own matte.
      target.matte = source;
      commands += 4;
    }
    for (var i = 0; i < layers.length; i++) {
      if (rawLayers[i]['td'] == 1 && !layers[i].isMatteSource) {
        fail(_JsonPath.layers.index(i).field('td'), 'Unpaired matte source');
      }
    }
  }

  void _linkParents(Map<int, _Layer> byId, Map<_Layer, int> parents) {
    for (final e in parents.entries) {
      final parent = byId[e.value];
      if (parent == null) {
        fail(_JsonPath.layers, 'Missing parent ${e.value}');
      }
      e.key.parent = parent;
    }
    for (final layer in layers) {
      final visited = <_Layer>{};
      for (_Layer? p = layer; p != null; p = p.parent) {
        if (!visited.add(p)) {
          fail(_JsonPath.layers, 'Cyclic parenting');
        }
      }
    }
  }

  Rect? worldBounds(double frame) {
    Rect? acc;
    for (var i = layers.length - 1; i >= 0; i--) {
      final layer = layers[i];
      if (layer.isMatteSource || !layer.visible(frame)) continue;
      if (layer.effectiveAlpha(frame, 255) == 0) continue;
      final matte = layer.matte;
      var lb = layer.worldBounds(frame);
      if (lb == null) continue;
      if (matte != null) {
        final isDstOut = layer.matteType == 2 || layer.matteType == 4;
        final matteActive =
            matte.visible(frame) && matte.effectiveAlpha(frame, 255) > 0;
        if (!matteActive) {
          if (!isDstOut) continue;
        } else if (!isDstOut) {
          final mb = matte.worldBounds(frame);
          if (mb == null) continue;
          lb = lb.intersect(mb);
          if (lb.isEmpty) continue;
        }
      }
      acc = _unionRect(acc, lb);
    }
    if (acc == null) return null;
    final clipped = acc.intersect(boundsRect);
    return clipped.isEmpty ? null : clipped;
  }

  void draw(Canvas canvas, double frame, [int alpha = 255]) {
    canvas.save();
    canvas.clipRect(boundsRect);
    final bounds = boundsRect;
    for (var i = layers.length - 1; i >= 0; i--) {
      final layer = layers[i];
      if (layer.isMatteSource || !layer.visible(frame)) continue;
      final layerAlpha = layer.effectiveAlpha(frame, alpha);
      if (layerAlpha == 0) continue;
      final matte = layer.matte;
      if (matte == null) {
        layer.draw(canvas, frame, alpha);
        continue;
      }
      final isDstOut = layer.matteType == 2 || layer.matteType == 4;
      final matteParentAlpha = layer.usesSetMatte ? 255 : alpha;
      final matteAlpha = matte.visible(frame)
          ? matte.effectiveAlpha(frame, matteParentAlpha)
          : 0;
      if (matteAlpha == 0) {
        // Invisible or transparent matte: dstIn erases target, dstOut leaves target intact.
        if (isDstOut) layer.draw(canvas, frame, alpha);
        continue;
      }
      final targetRaw = layer.worldBounds(frame);
      if (targetRaw == null) continue;
      final targetRect = targetRaw.inflate(1.0).intersect(bounds);
      if (targetRect.isEmpty) continue;
      final matteRaw = matte.worldBounds(frame);
      final matteRect = matteRaw != null
          ? matteRaw.inflate(1.0).intersect(bounds)
          : Rect.zero;
      if (!isDstOut) {
        if (matteRect.isEmpty || !targetRect.overlaps(matteRect)) continue;
      } else if (matteRect.isEmpty || !targetRect.overlaps(matteRect)) {
        layer.draw(canvas, frame, alpha);
        continue;
      }
      // Isolate the destination before masking; the source never appears as
      // ordinary artwork. Include both target and matte bounds so Skia/Impeller
      // never clips a curved mask/target contour at an arbitrary boundary.
      final layerBounds = _unionRect(
        targetRect,
        matteRect,
      )!.inflate(1.0).intersect(bounds);
      canvas.saveLayer(layerBounds, layer.contentPaint);
      layer.draw(canvas, frame, alpha);
      canvas.saveLayer(layerBounds, layer.mattePaint);
      if (layer.matteType >= 3) {
        // Composite the matte onto opaque black so ColorFilter.matrix sees
        // premultiplied RGB (mAlpha * straightRGB) with alpha == 1, preserving
        // subpixel anti-aliasing and matte opacity fades.
        canvas.drawRect(layerBounds, _lumaBackdropPaint);
      }
      matte.draw(
        canvas,
        frame,
        matteParentAlpha,
        alphaOnly: layer.matteType < 3,
      );
      canvas.restore();
      canvas.restore();
    }
    canvas.restore();
  }

  _Transform _transform(dynamic value, _JsonPath path) {
    final m = value == null ? <String, dynamic>{} : map(value, path);
    check(m, path, const {
      'ty',
      'nm',
      'mn',
      'ix',
      'hd',
      'a',
      'p',
      's',
      'r',
      'o',
      'sk',
      'sa',
      'rx',
      'ry',
      'rz',
      'or',
    });
    for (final key in ['rx', 'ry', 'rz', 'or']) {
      if (m[key] != null) fail(path.field(key), '3D transform');
    }
    final sk = _track(m['sk'], path.field('sk'), 1, [0]);
    final sa = _track(m['sa'], path.field('sa'), 1, [0]);
    Track? x, y;
    dynamic position = m['p'];
    if (position is Map && position['s'] == true) {
      final p = map(position, path.field('p'));
      check(p, path.field('p'), const {'s', 'x', 'y', 'ix'});
      x = _track(p['x'], path.field('p').field('x'), 1, [0]);
      y = _track(p['y'], path.field('p').field('y'), 1, [0]);
      position = null;
    }
    final result = _Transform(
      _track(m['a'], path.field('a'), 2, [0, 0]),
      _track(position, path.field('p'), 2, [0, 0]),
      _track(m['s'], path.field('s'), 2, [100, 100], z: 100),
      _track(m['r'], path.field('r'), 1, [0]),
      _track(m['o'], path.field('o'), 1, [100]),
      x,
      y,
      sk,
      sa,
    );
    return result;
  }

  (_FillEffect?, (int, _JsonPath)?) _effects(
    dynamic raw,
    _JsonPath path,
    List layers,
  ) {
    if (raw == null) return (null, null);
    if (raw is! List) fail(path, 'Expected effects array');
    _FillEffect? fill;
    (int, _JsonPath)? matte;
    for (var i = 0; i < raw.length; i++) {
      final at = path.index(i), effect = map(raw[i], path.index(i));
      check(effect, at, const {'ty', 'nm', 'np', 'mn', 'ix', 'en', 'ef'});
      final isFill = effect['ty'] == 21 && effect['mn'] == 'ADBE Fill';
      final isSetMatte =
          effect['ty'] == 28 && effect['mn'] == 'ADBE Set Matte3';
      final isControl =
          effect['ty'] == 5 && effect['mn'] == 'ADBE Layer Control';
      if (!isFill && !isSetMatte && !isControl) {
        fail(at, 'Unsupported visual effect');
      }
      if (effect['en'] == 0 || effect['en'] == false) continue;
      if (effect['en'] != null && effect['en'] != 1 && effect['en'] != true) {
        fail(at.field('en'), 'Invalid effect enabled flag');
      }
      if (isFill || isSetMatte) {
        if (fill != null || matte != null) fail(at, 'Multiple visual effects');
        final types = isFill
            ? const [10, 7, 2, 7, 0, 0, 0]
            : const [10, 7, 7, 7, 7, 7];
        final parameters = effect['ef'];
        if (parameters is! List || parameters.length != types.length) {
          fail(at.field('ef'), 'Invalid effect parameters');
        }
        Track parameter(int index, {int dimensions = 1}) {
          final p = at.field('ef').index(index);
          final value = map(parameters[index], p);
          check(value, p, const {'ty', 'nm', 'mn', 'ix', 'v'});
          if (value['ty'] != types[index] || value['v'] == null) {
            fail(p, 'Invalid effect parameter');
          }
          return _track(value['v'], p.field('v'), dimensions, []);
        }

        void require(int index, int expected) {
          final track = parameter(index);
          if (!track.isStatic || track.scalar(0) != expected) {
            fail(
              at.field('ef').index(index).field('v'),
              'Unsupported effect parameter value',
            );
          }
        }

        if (isFill) {
          for (final index in [0, 1, 3, 4, 5]) {
            require(index, 0);
          }
          fill = _FillEffect(parameter(2, dimensions: 3), parameter(6));
        } else {
          for (final (index, value) in [
            (1, 4),
            (2, 0),
            (3, 1),
            (4, 1),
            (5, 1),
          ]) {
            require(index, value);
          }
          final track = parameter(0);
          final id = track.scalar(0);
          final ref = at.field('ef').index(0).field('v');
          if (!track.isStatic || id <= 0 || id != id.roundToDouble()) {
            fail(ref, 'Expected a static layer index');
          }
          matte = (id.toInt(), ref);
        }
        continue;
      }
      final children = effect['ef'];
      if (children is! List || children.length != 1) {
        fail(at, 'Invalid layer control');
      }
      final control = map(children.single, at.field('ef').index(0));
      check(control, at.field('ef').index(0), const {
        'ty',
        'nm',
        'mn',
        'ix',
        'v',
      });
      if (control['ty'] != 10 || control['mn'] != 'ADBE Layer Control-0001') {
        fail(at, 'Unsupported effect control');
      }
      final track = _track(
        control['v'],
        at.field('ef').index(0).field('v'),
        1,
        [0],
      );
      final values = track.constant ?? track.keyframes!.values;
      for (final id in values) {
        if (id != id.roundToDouble() ||
            (id != 0 && !layers.any((l) => l['ind'] == id))) {
          fail(at, 'Missing layer control target');
        }
      }
    }
    return (fill, matte);
  }

  _InnerShadow? _innerShadow(dynamic raw, _JsonPath path) {
    if (raw == null || raw is List && raw.isEmpty) return null;
    if (raw is! List || raw.length != 1) {
      fail(path, 'Expected one Inner Shadow style');
    }
    final at = path.index(0);
    final style = map(raw.single, at);
    if (style['ty'] != 2) fail(at.field('ty'), 'Unsupported layer style');
    check(style, at, const {
      'ty',
      'nm',
      'mn',
      'c',
      'o',
      'a',
      's',
      'd',
      'ch',
      'bm',
      'no',
    });
    double scalar(String key, double fallback) {
      final track = _track(style[key], at.field(key), 1, [fallback]);
      if (!track.isStatic) fail(at.field(key), 'Animated Inner Shadow');
      return track.scalar(0);
    }

    for (final key in ['s', 'ch', 'no']) {
      if (scalar(key, 0) != 0) {
        fail(at.field(key), 'Unsupported Inner Shadow parameter');
      }
    }
    if (scalar('bm', 1) != 1) {
      fail(at.field('bm'), 'Inner Shadow requires Multiply');
    }
    final color = _track(style['c'], at.field('c'), 3, [0, 0, 0]);
    if (!color.isStatic) fail(at.field('c'), 'Animated Inner Shadow');
    final rgb = color.at(0);
    final opacity = (scalar('o', 100) * 255 / 100).round().clamp(0, 255);
    final angle = (scalar('a', 0) % 360) * math.pi / 180;
    final distance = scalar('d', 0);
    if (distance < 0) fail(at.field('d'), 'Negative Inner Shadow distance');
    if (distance == 0 || opacity == 0) return null;
    return _InnerShadow(
      // The local light angle points toward the light (Y up).
      -math.cos(angle) * distance,
      math.sin(angle) * distance,
      (opacity << 24) |
          ((rgb[0] * 255).round().clamp(0, 255) << 16) |
          ((rgb[1] * 255).round().clamp(0, 255) << 8) |
          (rgb[2] * 255).round().clamp(0, 255),
    );
  }

  _BezierGeometry _parseBezierTrack(dynamic rawKs, _JsonPath p) {
    bool? closed;
    Uint8List? closures;
    var varies = false;
    Float32List decode(
      dynamic raw,
      _JsonPath at,
      Float32List? output,
      int offset,
      int width,
    ) {
      if (raw is List && raw.length == 1 && raw.first is Map) {
        raw = raw.first;
      }
      final shape = map(raw, at);
      check(shape, at, const {'v', 'i', 'o', 'c'});
      final c = shape['c'];
      if (c is! bool) fail(at.field('c'), 'Expected closed flag');
      closed ??= c;
      varies |= c != closed;
      final key = at.parent?.segment;
      if (key is int) {
        final flags = closures ??= Uint8List((rawKs['k'] as List).length * 2);
        flags[key * 2 + (at.segment == 'e' ? 1 : 0)] = c ? 1 : 2;
      }
      final v = shape['v'], incoming = shape['i'], outgoing = shape['o'];
      if (v is PackedPointList &&
          incoming is PackedPointList &&
          outgoing is PackedPointList) {
        final count = v.length;
        if (count != incoming.length || count != outgoing.length) {
          fail(at, 'Invalid path topology');
        }
        final data = _trackValues(at, output, count * 6, width);
        final vxy = v.xy, ixy = incoming.xy, oxy = outgoing.xy;
        for (var n = 0; n < count; n++) {
          final p = n * 2;
          final index = offset + n * 6;
          data[index] = vxy[p];
          data[index + 1] = vxy[p + 1];
          data[index + 2] = ixy[p];
          data[index + 3] = ixy[p + 1];
          data[index + 4] = oxy[p];
          data[index + 5] = oxy[p + 1];
        }
        return data;
      }
      if (v is! List ||
          incoming is! List ||
          outgoing is! List ||
          v.length != incoming.length ||
          v.length != outgoing.length) {
        fail(at, 'Invalid path topology');
      }
      final length = v.length * 6;
      final data = _trackValues(at, output, length, width);
      void point(dynamic item, int index) {
        if (item is! List || item.length != 2) {
          fail(at, 'Expected 2D path point');
        }
        data[index] = number(item[0], at);
        data[index + 1] = number(item[1], at);
      }

      for (var n = 0; n < v.length; n++) {
        final index = offset + n * 6;
        point(v[n], index);
        point(incoming[n], index + 2);
        point(outgoing[n], index + 4);
      }
      return data;
    }

    final track = _track(rawKs, p, -1, [], decode: decode);
    final closureKeys = <(bool, bool)>[];
    final keyframes = track.keyframes;
    if (keyframes != null && varies) {
      final flags = closures!;
      final starts = List<bool>.filled(keyframes.count, false);
      var previous = closed!;
      for (var n = 0; n < starts.length; n++) {
        final start = n * 2 < flags.length ? flags[n * 2] : 0;
        final end = n * 2 < flags.length ? flags[n * 2 + 1] : 0;
        starts[n] = start == 0 ? previous : start == 1;
        previous = end == 0 ? starts[n] : end == 1;
      }
      for (var n = 0; n < starts.length; n++) {
        final end = n * 2 < flags.length ? flags[n * 2 + 1] : 0;
        closureKeys.add((
          starts[n],
          keyframes.isHold(n)
              ? starts[n]
              : end != 0
              ? end == 1
              : starts[math.min(n + 1, starts.length - 1)],
        ));
      }
    }
    _chargeCommands(track.valueCount ~/ 6, p);
    return _BezierGeometry(track, closed ?? true, closureKeys);
  }

  _Group _group(
    dynamic value,
    _JsonPath path,
    _ShapePathCompiler paths, [
    int depth = 0,
  ]) {
    if (depth > _maxGroupDepth) {
      fail(path, 'Shape group nesting exceeds $_maxGroupDepth');
    }
    if (value is! List) fail(path, 'Expected shape list');
    final sources = <_PathSource>[];
    final draws = <_Draw>[];
    _Transform? transform;
    for (var i = 0; i < value.length; i++) {
      final p = path.index(i);
      _chargeCommands(1, p);
      final m = map(value[i], p);
      final type = m['ty'];
      final bm = m['bm'] ?? 0;
      if (bm is! int || bm < 0 || bm > 16) {
        fail(p.field('bm'), 'Blend mode $bm');
      }
      final hidden = m['hd'] == true;
      switch (type) {
        case 'tr':
          if (transform != null || i != value.length - 1) {
            fail(p, 'Transform must be last and unique');
          }
          transform = _transform(m, p);
        case 'gr':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            'it',
            'np',
            'cix',
            'bm',
            'cl',
          });
          final group = _group(m['it'], p.field('it'), paths, depth + 1);
          if (!hidden) {
            sources.add(group);
            draws.add(group);
          }
        case 'sh':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            'ks',
            'ind',
            'd',
            'bm',
          });
          if (m['ks'] == null) fail(p.field('ks'), 'Missing path data');
          final geom = paths.geometry(m['ks'], p.field('ks'));
          if (!hidden) {
            sources.add(_Shape(geom));
          }
        case 'rc':
        case 'el':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            'p',
            's',
            'r',
            'd',
            'bm',
          });
          if (m['d'] != null && m['d'] != 1 && m['d'] != 2 && m['d'] != 3) {
            fail(p.field('d'), 'Path direction');
          }
          final pos = _track(m['p'], p.field('p'), 2, [
            0,
            0,
          ], separateEasing: true);
          final size = _track(m['s'], p.field('s'), 2, [
            0,
            0,
          ], separateEasing: true);
          final radius = _track(m['r'], p.field('r'), 1, [0]);
          commands += 8;
          if (!hidden) {
            sources.add(
              _Shape(_Primitive(type == 'el', pos, size, radius, m['d'] == 3)),
            );
          }
        case 'sr':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            'sy',
            'pt',
            'p',
            'r',
            'ir',
            'is',
            'or',
            'os',
            'd',
            'bm',
          });
          final starType = m['sy'] ?? 1;
          if (starType != 1 && starType != 2) {
            fail(p.field('sy'), 'PolyStar type $starType');
          }
          if (m['d'] != null && m['d'] != 1 && m['d'] != 2 && m['d'] != 3) {
            fail(p.field('d'), 'Path direction');
          }
          final points = _track(m['pt'], p.field('pt'), 1, [5]);
          final pos = _track(m['p'], p.field('p'), 2, [
            0,
            0,
          ], separateEasing: true);
          final rot = _track(m['r'], p.field('r'), 1, [0]);
          final outerRadius = _track(m['or'], p.field('or'), 1, [0]);
          final outerRoundness = _track(m['os'], p.field('os'), 1, [0]);
          final innerRadius = starType == 1
              ? (m['ir'] != null
                    ? _track(m['ir'], p.field('ir'), 1, [0])
                    : Track.constant([0.0]))
              : null;
          final innerRoundness = starType == 1
              ? (m['is'] != null
                    ? _track(m['is'], p.field('is'), 1, [0])
                    : Track.constant([0.0]))
              : null;
          commands += 12;
          if (!hidden) {
            sources.add(
              _Shape(
                _PolyStarGeometry(
                  starType == 1,
                  points,
                  pos,
                  rot,
                  outerRadius,
                  outerRoundness,
                  innerRadius,
                  innerRoundness,
                  m['d'] == 3,
                ),
              ),
            );
          }
        case 'tm':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            's',
            'e',
            'o',
            'm',
            'bm',
          });
          final mode = m['m'] ?? 1;
          if (mode != 1 && mode != 2) fail(p.field('m'), 'Trim mode');
          final trim = _Trim(
            [],
            _track(m['s'], p.field('s'), 1, [0]),
            _track(m['e'], p.field('e'), 1, [100]),
            _track(m['o'], p.field('o'), 1, [0]),
            mode == 2,
          );
          if (!hidden) {
            final shapes = <_Shape>[];
            void collect(List<_PathSource> items) {
              for (final source in items) {
                if (source is _Shape) shapes.add(source);
                if (source is _Group) collect(source.sources);
              }
            }

            collect(sources);
            trim.inputs.addAll(shapes.map((s) => s.content));
            for (var n = 0; n < shapes.length; n++) {
              shapes[n].content = _TrimPart(trim, n);
            }
          }
          commands++;
        case 'fl':
        case 'st':
        case 'gf':
        case 'gs':
          check(m, p, const {
            'ty',
            'nm',
            'mn',
            'ix',
            'hd',
            'c',
            'o',
            'r',
            'w',
            'lc',
            'lj',
            'ml',
            'ml2',
            'd',
            'bm',
            'g',
            's',
            'e',
            't',
            'h',
            'a',
          });
          final stroke = type == 'st' || type == 'gs';
          if (stroke) {
            hasStroke = true;
          }
          final dash = stroke ? _dash(m['d'], p.field('d')) : null;
          final rule = m['r'] ?? 1;
          if (rule != 1 && rule != 2) fail(p.field('r'), 'Fill rule');
          final cap = m['lc'] ?? 1, join = m['lj'] ?? 1;
          if (cap is! int ||
              cap < 1 ||
              cap > 3 ||
              join is! int ||
              join < 1 ||
              join > 3) {
            fail(p, 'Stroke cap/join');
          }
          final color = _track(m['c'], p.field('c'), 3, [
            0,
            0,
            0,
          ], shareFallback: false)..gamma = true;
          // Lottie also permits RGB components encoded in [0,255].
          final values = color.constant ?? color.keyframes!.values;
          for (var base = 0; base < values.length; base += 3) {
            if (values[base] > 1 ||
                values[base + 1] > 1 ||
                values[base + 2] > 1) {
              for (var channel = 0; channel < 3; channel++) {
                values[base + channel] /= 255;
              }
            }
          }
          final opacity = _track(m['o'], p.field('o'), 1, [100]);
          final width = _track(m['w'], p.field('w'), 1, [1]);
          if (!hidden) {
            draws.add(
              _Style(
                List.of(sources),
                color,
                opacity,
                width,
                stroke,
                rule == 2,
                cap,
                join,
                number(m['ml'] ?? 4, p.field('ml')),
                gradient: (type == 'gf' || type == 'gs')
                    ? _gradient(m, p)
                    : null,
                dash: dash,
              ),
            );
          }
          commands += 2;
        case 'mm':
          check(m, p, const {'ty', 'nm', 'mn', 'ix', 'hd', 'mm', 'bm', 'cix'});
          final mode = m['mm'] ?? 1;
          if (mode is! int || mode < 1 || mode > 5) {
            fail(p.field('mm'), 'Shape op mm mode $mode');
          }
          if (!hidden && sources.isNotEmpty) {
            final operands = sources.where((s) {
              return s is! _Group || s.hasPathContent;
            }).toList();
            // Some exports leave Intersect after a lone outline (or keep a
            // transform-only group in place of the removed operand). With no
            // second operand, preserve the remaining outline.
            final incomplete =
                operands.length == 1 && (mode == 4 || sources.length > 1);
            sources.clear();
            if (operands.isNotEmpty) {
              sources.add(
                incomplete ? operands.single : _MergePathSource(operands, mode),
              );
            }
          } else if (hidden) {
            sources.clear();
          }
          commands++;
        default:
          fail(p.field('ty'), 'Shape op $type');
      }
    }
    return _Group(sources, draws, transform ?? _Transform.identity());
  }

  _Dash? _dash(dynamic value, _JsonPath path) {
    if (value == null) return null;
    if (value is! List) fail(path, 'Expected dash array');
    final intervals = <Track>[];
    Track? offset;
    for (var i = 0; i < value.length; i++) {
      final at = path.index(i), m = map(value[i], path.index(i));
      check(m, at, const {'n', 'nm', 'v'});
      final track = _track(m['v'], at.field('v'), 1, [0]);
      final name = m['n'];
      if (name == 'o') {
        if (offset != null) fail(at, 'Duplicate dash offset');
        offset = track;
      } else if (name == (intervals.length.isEven ? 'd' : 'g')) {
        intervals.add(track);
      } else {
        fail(at.field('n'), 'Expected alternating dash/gap');
      }
    }
    if (intervals.isEmpty) return null;
    // rlottie repeats the last dash when its matching gap is omitted.
    if (intervals.length.isOdd) intervals.add(intervals.last);
    return _Dash(intervals, offset ?? Track.constant([0]));
  }

  _GradientSpec _gradient(Map<String, dynamic> m, _JsonPath path) {
    final g = map(m['g'], path.field('g'));
    check(g, path.field('g'), const {'p', 'k'});
    final count = g['p'];
    if (count is! int || count <= 0) {
      fail(path.field('g').field('p'), 'Invalid gradient stop count');
    }
    final stops = _track(
      g['k'],
      path.field('g').field('k'),
      -1,
      [],
      decode: (raw, at, output, offset, width) {
        if (raw is! List ||
            raw.length < count * 4 ||
            (raw.length - count * 4).isOdd) {
          fail(at, 'Invalid gradient stops');
        }
        final values = _trackValues(at, output, raw.length, width);
        for (var i = 0; i < raw.length; i++) {
          var value = number(raw[i], at);
          if (i < count * 4 && i % 4 != 0) {
            final v = (value * 255).round().clamp(0, 255) / 255;
            value = v <= .04045
                ? v / 12.92
                : math.pow((v + .055) / 1.055, 2.4).toDouble();
          }
          values[offset + i] = value;
        }
        return values;
      },
    );
    if (m['t'] != 1 && m['t'] != 2) fail(path.field('t'), 'Gradient type');
    return _GradientSpec(
      count,
      stops,
      _track(m['s'], path.field('s'), 2, [0, 0], separateEasing: true),
      _track(m['e'], path.field('e'), 2, [0, 0], separateEasing: true),
      m['t'] == 2,
      m['h'] == null ? null : _track(m['h'], path.field('h'), 1, [0]),
      m['a'] == null ? null : _track(m['a'], path.field('a'), 1, [0]),
    );
  }

  Track _track(
    dynamic value,
    _JsonPath path,
    int dimensions,
    List<double> fallback, {
    double z = 0,
    bool separateEasing = false,
    bool shareFallback = true,
    _TrackDecoder? decode,
  }) {
    if (value == null) {
      return shareFallback
          ? Track.canonicalConstant(fallback)
          : Track.constant(fallback);
    }
    final m = map(value, path);
    check(m, path, const {'a', 'k', 'ix', 'x', 'l'});
    if (m['a'] != null && m['a'] != 0 && m['a'] != 1) {
      fail(path.field('a'), 'Invalid animated flag');
    }
    if (m['x'] != null && m['x'] != '') fail(path.field('x'), 'Expressions');
    final kPath = path.field('k');
    final raw = m['k'];
    if (m['a'] != 1 &&
        !(raw is List &&
            raw.isNotEmpty &&
            raw.first is Map &&
            raw.first['t'] != null)) {
      return Track.constantValues(
        _decodeSample(raw, kPath, dimensions, z, decode, null, 0, 0),
      );
    }
    if (raw is! List || raw.isEmpty) fail(kPath, 'Expected keyframes');
    return _animatedTrack(raw, kPath, dimensions, z, separateEasing, decode);
  }

  Float32List _trackValues(
    _JsonPath path,
    Float32List? output,
    int length,
    int width,
  ) {
    if (output == null) return Float32List(length);
    if (length != width) {
      fail(path.parent!, 'Morph topology/component count changes');
    }
    return output;
  }

  Float32List _decodeSample(
    dynamic raw,
    _JsonPath path,
    int dimensions,
    double z,
    _TrackDecoder? decode,
    Float32List? output,
    int offset,
    int width,
  ) {
    if (decode != null) return decode(raw, path, output, offset, width);
    final data = output ?? Float32List(dimensions);
    if (raw is List) {
      if (raw.length < dimensions) {
        fail(path, 'Expected $dimensions components');
      }
      for (var i = 0; i < dimensions; i++) {
        data[offset + i] = number(raw[i], path, i);
      }
      if (dimensions == 2 && raw.length > 2 && number(raw[2], path) != z) {
        fail(path, 'Non-planar component');
      }
    } else {
      if (dimensions != 1) fail(path, 'Expected $dimensions components');
      data[offset] = number(raw, path, 0);
    }
    return data;
  }

  Track _animatedTrack(
    List raw,
    _JsonPath path,
    int dimensions,
    double z,
    bool separateEasing,
    _TrackDecoder? decode,
  ) {
    // Size the columns from keyframe headers only. Each sample is decoded once,
    // straight into its final slot after the first sample establishes width.
    final last = raw.last;
    final lastTime = last is Map<String, dynamic> ? last['t'] : null;
    final appendEnd =
        last is Map<String, dynamic> &&
        last['e'] != null &&
        last['h'] != 1 &&
        lastTime is num &&
        lastTime.toDouble() < end;
    final count = raw.length + (appendEnd ? 1 : 0);
    final times = Float64List(count);
    final metadata = Int32List(count * 3);
    var explicitEnds = 0, easedKeys = 0, hasTangents = false;
    for (final key in raw) {
      if (key is! Map<String, dynamic>) continue;
      if (key['e'] != null) explicitEnds++;
      if (key['i'] != null && key['o'] != null && key['h'] != 1) easedKeys++;
      hasTangents |= key['to'] != null;
    }
    final easing = Float64List(easedKeys * (separateEasing ? 8 : 4));
    final tangents = hasTangents ? Float32List(count * 4) : null;
    late final Float32List values;
    late final Float32List firstSample;
    late final int width, stride;
    var endIndex = count, easeIndex = 0;
    var previousValue = 0;
    for (var i = 0; i < raw.length; i++) {
      final at = path.index(i);
      final k = map(raw[i], at);
      check(k, at, const {'t', 's', 'e', 'h', 'i', 'o', 'to', 'ti', 'n'});
      final to = k['to'], ti = k['ti'];
      if (to != null) _writeTangent(to, 'to', dimensions, at, tangents, i * 4);
      if (ti != null) {
        _writeTangent(ti, 'ti', dimensions, at, tangents, i * 4 + 2);
      }
      if ((to == null) != (ti == null)) fail(at, 'Incomplete spatial tangents');

      final time = number(k['t'], at, 't');
      if (i != 0 && time <= times[i - 1]) {
        fail(at, 'Keyframe times must increase');
      }
      times[i] = time;
      final s = k['s'], e = k['e'];
      if (i == 0) {
        if (s == null) fail(at, 'Missing initial keyframe value');
        final first = _decodeSample(
          s,
          at.field('s'),
          dimensions,
          z,
          decode,
          null,
          0,
          0,
        );
        firstSample = first;
        width = first.length;
        stride = options.useSimd && width >= 32 ? (width + 3) & ~3 : width;
        values = Float32List((count + explicitEnds) * stride);
        values.setRange(0, width, first);
      } else {
        final offset = i * stride;
        if (s == null) {
          values.setRange(offset, offset + width, values, previousValue);
        } else {
          _decodeSample(
            s,
            at.field('s'),
            dimensions,
            z,
            decode,
            values,
            offset,
            width,
          );
        }
      }
      final hold = k['h'] == 1;
      var flags = (hold ? Keyframes.holdFlag : 0) | Keyframes.linearFlag;
      if (to != null) flags |= Keyframes.tangentFlag;
      previousValue = i * stride;
      if (e != null) {
        final offset = endIndex++ * stride;
        _decodeSample(
          e,
          at.field('e'),
          dimensions,
          z,
          decode,
          values,
          offset,
          width,
        );
        metadata[count + i] = previousValue = offset;
        flags |= Keyframes.endFlag;
      } else {
        metadata[count + i] = math.min(i + 1, count - 1) * stride;
      }
      metadata[2 * count + i] = easeIndex;
      if (!hold && k['o'] != null && k['i'] != null) {
        final out = map(k['o'], at.field('o')),
            inc = map(k['i'], at.field('i'));
        final ox = out['x'], oy = out['y'], ix = inc['x'], iy = inc['y'];
        final oxLength = _easeLength(ox, at), oyLength = _easeLength(oy, at);
        final ixLength = _easeLength(ix, at), iyLength = _easeLength(iy, at);
        final components = math.max(
          math.max(oxLength, oyLength),
          math.max(ixLength, iyLength),
        );
        if (components != 1 &&
            components != width &&
            !(dimensions == 2 && components == 3)) {
          fail(at, 'Easing component count');
        }
        if (!_easeMatches(oxLength, components) ||
            !_easeMatches(oyLength, components) ||
            !_easeMatches(ixLength, components) ||
            !_easeMatches(iyLength, components)) {
          fail(at, 'Easing component mismatch');
        }
        final n = math.min(
          separateEasing ? width : math.min(width, 1),
          components,
        );
        flags |= n << 4;
        for (var j = 0; j < n; j++) {
          final x1 = _easeValue(ox, j).clamp(0.0, 1.0);
          final y1 = _easeValue(oy, j);
          final x2 = _easeValue(ix, j).clamp(0.0, 1.0);
          final y2 = _easeValue(iy, j);
          easing[easeIndex++] = x1;
          easing[easeIndex++] = y1;
          easing[easeIndex++] = x2;
          easing[easeIndex++] = y2;
          if (x1 != y1 || x2 != y2) flags &= ~Keyframes.linearFlag;
        }
      }
      metadata[i] = flags;
    }
    if (count == 1) {
      return Track.constantValues(firstSample);
    }
    if (appendEnd) {
      final i = count - 1, offset = i * stride;
      times[i] = end;
      values.setRange(offset, offset + width, values, previousValue);
      metadata[i] = Keyframes.linearFlag;
      metadata[count + i] = offset;
      metadata[2 * count + i] = easeIndex;
    }
    return Track.animated(
      Keyframes(
        times,
        width,
        stride,
        metadata,
        values,
        easeIndex == easing.length
            ? easing
            : Float64List.sublistView(easing, 0, easeIndex),
        tangents,
        options.useSimd,
      ),
      options.useSimd,
    );
  }

  void _writeTangent(
    dynamic value,
    String name,
    int dimensions,
    _JsonPath at,
    Float32List? output,
    int offset,
  ) {
    if (value is! List || value.length < 2) {
      fail(at.field(name), 'Invalid spatial tangent');
    }
    if (dimensions != 2 && value.any((n) => n != 0)) {
      fail(at.field(name), 'Spatial tangent on non-position');
    }
    final x = number(value[0], at), y = number(value[1], at);
    if (output != null) {
      output[offset] = x;
      output[offset + 1] = y;
    }
  }

  // Easing controls are either scalars or JSON lists. Validate all components,
  // even when the track only uses the first control tuple.
  int _easeLength(dynamic value, _JsonPath at) {
    if (value is! List) {
      number(value, at);
      return 1;
    }
    for (final component in value) {
      number(component, at);
    }
    return value.length;
  }

  bool _easeMatches(int length, int count) => length == 1 || length == count;

  double _easeValue(dynamic value, int index) =>
      ((value is List ? value[value.length == 1 ? 0 : index] : value) as num)
          .toDouble();
}
