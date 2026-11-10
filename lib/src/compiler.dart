part of '../fastlottie.dart';

final _allowedFields = <String, Set<String>>{};

class _Compiler {
  _Compiler(this.options);
  final FastLottieOptions options;
  late double width, height, start, end, fps;
  late final Rect boundsRect = Rect.fromLTWH(0, 0, width, height);
  final layers = <_Layer>[];
  var commands = 1;
  bool hasStroke = false;
  late final bool isStatic = layers.every(
    (l) => l.isStatic && l.ip <= start && l.op >= end,
  );

  Never fail(String path, String feature) =>
      throw UnsupportedLottieException(path, feature);
  Map<String, dynamic> map(dynamic value, String path) {
    if (value is! Map<String, dynamic>) fail(path, 'Expected object');
    return value;
  }

  double number(dynamic value, String path) {
    if (value is! num || !value.isFinite) fail(path, 'Expected finite number');
    return value.toDouble();
  }

  void check(Map<String, dynamic> m, String path, String fields) {
    final allowed = _allowedFields.putIfAbsent(
      fields,
      () => fields.split(' ').toSet(),
    );
    for (final k in m.keys) {
      if (!allowed.contains(k)) fail('$path.$k', 'Unsupported field');
    }
  }

  void zero(Map<String, dynamic> m, String key, String path) {
    if (m[key] != null && m[key] != 0 && m[key] != false) {
      fail('$path.$key', 'Unsupported nonzero $key');
    }
  }

  void empty(Map<String, dynamic> m, String key, String path) {
    final value = m[key];
    if (value != null &&
        !(value is List && value.isEmpty) &&
        !(value is Map && value.isEmpty)) {
      fail('$path.$key', 'Unsupported $key');
    }
  }

  void compile(
    Map<String, dynamic> json, {
    Map<String, Map<String, dynamic>>? assetModels,
    Set<String> precompStack = const {},
  }) {
    check(
      json,
      r'$',
      'v fr ip op w h nm ddd assets layers markers meta fonts chars slots tgs comps fitz',
    );
    zero(json, 'ddd', r'$');
    for (final key in ['fonts', 'chars', 'slots']) {
      empty(json, key, r'$');
    }
    width = number(json['w'], r'$.w');
    height = number(json['h'], r'$.h');
    start = number(json['ip'], r'$.ip');
    end = number(json['op'], r'$.op');
    fps = number(json['fr'], r'$.fr');
    if (width <= 0 || height <= 0 || fps <= 0 || end <= start) {
      fail(r'$', 'Invalid bounds/timing');
    }
    final assets = assetModels ?? <String, Map<String, dynamic>>{};
    if (assetModels == null) {
      for (final field in ['assets', 'comps']) {
        final definitions = json[field] ?? [];
        if (definitions is! List) {
          fail('\$.$field', 'Expected asset definitions');
        }
        for (final raw in definitions) {
          final definition = map(raw, '\$.$field');
          final id = definition['id'];
          if (id is! String) fail('\$.$field', 'Expected asset id');
          assets[id] = definition;
        }
      }
    }
    final list = json['layers'];
    if (list is! List) fail(r'$.layers', 'Expected layers');
    final byId = <int, _Layer>{};
    final parents = <_Layer, int>{};
    for (var i = 0; i < list.length; i++) {
      final path = '\$.layers[$i]';
      final m = map(list[i], path);
      check(
        m,
        path,
        'ddd ind ty nm sr st ip op ks shapes parent ao bm tt td tp masksProperties hasMask ef hd cl ln refId w h',
      );
      for (final key in ['ddd', 'ao', 'bm', 'tp', 'hasMask']) {
        zero(m, key, path);
      }
      final matteType = m['tt'] ?? 0;
      if (matteType is! int || matteType < 0 || matteType > 4) {
        fail('$path.tt', 'Matte type');
      }
      if (m['td'] != null && m['td'] != 0 && m['td'] != 1) {
        fail('$path.td', 'Matte source flag');
      }
      for (final key in ['masksProperties']) {
        empty(m, key, path);
      }
      _controls(m['ef'], '$path.ef', list);
      if (_hasExpression(m)) {
        _resolveContentExpressions(
          m,
          m['shapes'] is List ? m['shapes'] : [],
          path,
          <Object>{},
        );
      }
      if ((m['sr'] ?? 1) != 1) {
        fail(path, 'Time stretch/start offset');
      }
      final type = m['ty'];
      if (type != 4 && type != 3 && type != 0) {
        fail('$path.ty', 'Layer type $type');
      }
      final transform = _transform(m['ks'], '$path.ks');
      final group = type == 4 ? _group(m['shapes'], '$path.shapes') : null;
      _Compiler? child;
      if (type == 0) {
        final id = m['refId'];
        final asset = assets[id];
        if (id is! String || asset == null || asset['layers'] is! List) {
          fail('$path.refId', 'Missing precomposition');
        }
        if (precompStack.contains(id)) {
          fail('$path.refId', 'Cyclic precomposition');
        }
        child = _Compiler(options)
          ..compile(
            {
              'w': m['w'] ?? width,
              'h': m['h'] ?? height,
              'ip': 0,
              'op': end - start,
              'fr': fps,
              'layers': asset['layers'],
            },
            assetModels: assets,
            precompStack: {...precompStack, id},
          );
        commands += child.commands;
        hasStroke |= child.hasStroke;
      }
      final layer = _Layer(
        transform,
        group,
        number(m['ip'] ?? start, '$path.ip'),
        number(m['op'] ?? end, '$path.op'),
        m['hd'] == true,
        child: child,
        offset: number(m['st'] ?? 0, '$path.st'),
        matteType: matteType,
      );
      layers.add(layer);
      final id = m['ind'] ?? i;
      if (id is! int || byId.containsKey(id)) {
        fail('$path.ind', 'Invalid/duplicate layer id');
      }
      byId[id] = layer;
      if (m['parent'] != null) {
        if (m['parent'] is! int) fail('$path.parent', 'Invalid parent id');
        parents[layer] = m['parent'];
      }
    }
    for (var i = 0; i < layers.length; i++) {
      final layer = layers[i];
      if (layer.matteType != 0) {
        if (i == 0) fail('\$.layers[$i].tt', 'Missing preceding matte source');
        final source = layers[i - 1];
        if (source.matteType != 0) {
          fail('\$.layers[$i].tt', 'Chained matte');
        }
        layer.matte = source;
        source.isMatteSource = true;
        commands += 4;
      }
    }
    for (var i = 0; i < layers.length; i++) {
      if (list[i]['td'] == 1 && !layers[i].isMatteSource) {
        fail('\$.layers[$i].td', 'Unpaired matte source');
      }
    }
    for (final e in parents.entries) {
      final parent = byId[e.value];
      if (parent == null) fail(r'$.layers', 'Missing parent ${e.value}');
      e.key.parent = parent;
    }
    for (final layer in layers) {
      final visited = <_Layer>{};
      for (_Layer? p = layer; p != null; p = p.parent) {
        if (!visited.add(p)) fail(r'$.layers', 'Cyclic parenting');
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
      final matteAlpha = matte.visible(frame)
          ? matte.effectiveAlpha(frame, alpha)
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
      final layerBounds = _unionRect(targetRect, matteRect)!
          .inflate(1.0)
          .intersect(bounds);
      canvas.saveLayer(layerBounds, layer.contentPaint);
      layer.draw(canvas, frame, alpha);
      canvas.saveLayer(layerBounds, layer.mattePaint);
      matte.draw(canvas, frame, alpha);
      canvas.restore();
      canvas.restore();
    }
    canvas.restore();
  }

  _Transform _transform(dynamic value, String path) {
    final m = value == null ? <String, dynamic>{} : map(value, path);
    check(m, path, 'ty nm mn ix hd a p s r o sk sa rx ry rz or');
    for (final key in ['rx', 'ry', 'rz', 'or']) {
      if (m[key] != null) fail('$path.$key', '3D transform');
    }
    final sk = _track(m['sk'], '$path.sk', 1, [0]);
    final sa = _track(m['sa'], '$path.sa', 1, [0]);
    _Track? x, y;
    dynamic position = m['p'];
    if (position is Map && position['s'] == true) {
      final p = map(position, '$path.p');
      check(p, '$path.p', 's x y ix');
      x = _track(p['x'], '$path.p.x', 1, [0]);
      y = _track(p['y'], '$path.p.y', 1, [0]);
      position = null;
    }
    final result = _Transform(
      _track(m['a'], '$path.a', 2, [0, 0]),
      _track(position, '$path.p', 2, [0, 0]),
      _track(m['s'], '$path.s', 2, [100, 100], z: 100),
      _track(m['r'], '$path.r', 1, [0]),
      _track(m['o'], '$path.o', 1, [100]),
      x,
      y,
      sk,
      sa,
    );
    return result;
  }

  void _controls(dynamic raw, String path, List layers) {
    if (raw == null) return;
    if (raw is! List) fail(path, 'Expected effects array');
    for (var i = 0; i < raw.length; i++) {
      final at = '$path[$i]', effect = map(raw[i], '$path[$i]');
      check(effect, at, 'ty nm np mn ix en ef');
      if (effect['ty'] != 5 || effect['mn'] != 'ADBE Layer Control') {
        fail(at, 'Unsupported visual effect');
      }
      final children = effect['ef'];
      if (children is! List || children.length != 1) {
        fail(at, 'Invalid layer control');
      }
      final control = map(children.single, '$at.ef[0]');
      check(control, '$at.ef[0]', 'ty nm mn ix v');
      if (control['ty'] != 10 || control['mn'] != 'ADBE Layer Control-0001') {
        fail(at, 'Unsupported effect control');
      }
      final track = _track(control['v'], '$at.ef[0].v', 1, [0]);
      final values = track.constant != null
          ? [track.constant!]
          : [
              for (final k in track.keys) ...[
                k.start,
                if (k.end != null) k.end!,
              ],
            ];
      for (final value in values) {
        final id = value[0];
        if (id != id.roundToDouble() ||
            (id != 0 && !layers.any((l) => l['ind'] == id))) {
          fail(at, 'Missing layer control target');
        }
      }
    }
  }

  void _resolveContentExpressions(
    dynamic value,
    List roots,
    String path,
    Set<Object> resolving,
  ) {
    if (value is Map<String, dynamic>) {
      final expression = value['x'];
      if (expression is String && expression.isNotEmpty) {
        if (!resolving.add(value)) fail(path, 'Cyclic expression reference');
        final match = RegExp(
          r"^var \$bm_rt;\s*\$bm_rt\s*=\s*((?:content\('[^']*'\)\.)+)(transform\.scale|opacity);\s*$",
        ).firstMatch(expression);
        if (match == null) fail('$path.x', 'Unsupported expression syntax');
        var scope = roots;
        Map<String, dynamic>? target;
        for (final nameMatch in RegExp(
          r"content\('([^']*)'\)",
        ).allMatches(match.group(1)!)) {
          final name = jsonDecode('"${nameMatch.group(1)}"');
          final found = scope
              .whereType<Map<String, dynamic>>()
              .where((n) => n['nm'] == name)
              .toList();
          if (found.length != 1) {
            fail('$path.x', 'Missing/ambiguous content reference');
          }
          target = found.single;
          scope = target['it'] is List ? target['it'] : [];
        }
        dynamic property;
        if (match.group(2) == 'transform.scale') {
          final transforms = scope
              .whereType<Map<String, dynamic>>()
              .where((n) => n['ty'] == 'tr')
              .toList();
          if (transforms.length == 1) property = transforms.single['s'];
        } else {
          property = target?['o'];
        }
        final source = map(property, '$path.x');
        if (identical(source, value)) {
          // A direct self read uses this property's authored, pre-expression value.
          value.remove('x');
          resolving.remove(value);
          return;
        }
        _resolveContentExpressions(source, roots, '$path.x', resolving);
        final replacement = Map<String, dynamic>.of(source);
        value
          ..clear()
          ..addAll(replacement);
        resolving.remove(value);
      }
      for (final key in value.keys.toList()) {
        _resolveContentExpressions(value[key], roots, '$path.$key', resolving);
      }
    } else if (value is List) {
      for (var i = 0; i < value.length; i++) {
        _resolveContentExpressions(value[i], roots, '$path[$i]', resolving);
      }
    }
  }

  bool _hasExpression(dynamic value) {
    if (value is Map) {
      if (value['x'] is String && (value['x'] as String).isNotEmpty) {
        return true;
      }
      for (final child in value.values) {
        if ((child is Map || child is List) && _hasExpression(child)) {
          return true;
        }
      }
    } else if (value is List) {
      for (final child in value) {
        if ((child is Map || child is List) && _hasExpression(child)) {
          return true;
        }
      }
    }
    return false;
  }

  _Group _group(dynamic value, String path) {
    if (value is! List) fail(path, 'Expected shape list');
    final sources = <_PathSource>[];
    final draws = <_Draw>[];
    var transform = _Transform.identity();
    var sawTransform = false;
    for (var i = 0; i < value.length; i++) {
      final p = '$path[$i]';
      final m = map(value[i], p);
      final type = m['ty'];
      zero(m, 'bm', p);
      final hidden = m['hd'] == true;
      switch (type) {
        case 'tr':
          if (sawTransform || i != value.length - 1) {
            fail(p, 'Transform must be last and unique');
          }
          sawTransform = true;
          transform = _transform(m, p);
        case 'gr':
          check(m, p, 'ty nm mn ix hd it np cix bm cl');
          final group = _group(m['it'], '$p.it');
          if (!hidden) {
            sources.add(group);
            draws.add(group);
          }
        case 'sh':
          check(m, p, 'ty nm mn ix hd ks ind d bm');
          bool? closed;
          final closures = <String, bool>{};
          List<double> decode(dynamic raw, String at) {
            if (raw is List && raw.length == 1 && raw.first is Map) {
              raw = raw.first;
            }
            final shape = map(raw, at);
            check(shape, at, 'v i o c');
            if (shape['c'] is! bool) fail('$at.c', 'Expected closed flag');
            closed ??= shape['c'];
            closures[at] = shape['c'];
            final v = shape['v'], incoming = shape['i'], outgoing = shape['o'];
            if (v is! List ||
                incoming is! List ||
                outgoing is! List ||
                v.isEmpty ||
                v.length != incoming.length ||
                v.length != outgoing.length) {
              fail(at, 'Invalid path topology');
            }
            final data = <double>[];
            for (var n = 0; n < v.length; n++) {
              for (final item in [v[n], incoming[n], outgoing[n]]) {
                if (item is! List || item.length != 2) {
                  fail(at, 'Expected 2D path point');
                }
                data.add(number(item[0], at));
                data.add(number(item[1], at));
              }
            }
            return data;
          }
          if (m['ks'] == null) fail('$p.ks', 'Missing path data');
          final track = _track(m['ks'], '$p.ks', -1, [], decode: decode);
          final closureKeys = <(bool, bool)>[];
          if (closures.values.any((c) => c != closed)) {
            final starts = <bool>[], ends = <bool?>[];
            var previous = closed!;
            for (var n = 0; n < track.keys.length; n++) {
              final at = '$p.ks.k[$n]';
              final start = closures['$at.s'] ?? previous;
              final end = closures['$at.e'];
              starts.add(start);
              ends.add(end);
              previous = end ?? start;
            }
            for (var n = 0; n < starts.length; n++) {
              closureKeys.add((
                starts[n],
                track.keys[n].hold
                    ? starts[n]
                    : ends[n] ?? starts[math.min(n + 1, starts.length - 1)],
              ));
            }
          }
          commands +=
              (track.constant?.length ?? track.keys.first.start.length) ~/ 6;
          if (!hidden) {
            sources.add(_Shape(_BezierGeometry(track, closed!, closureKeys)));
          }
        case 'rc':
        case 'el':
          check(m, p, 'ty nm mn ix hd p s r d bm');
          if (m['d'] != null && m['d'] != 1 && m['d'] != 2 && m['d'] != 3) {
            fail('$p.d', 'Path direction');
          }
          final pos = _track(m['p'], '$p.p', 2, [0, 0], separateEasing: true);
          final size = _track(m['s'], '$p.s', 2, [0, 0], separateEasing: true);
          final radius = _track(m['r'], '$p.r', 1, [0]);
          commands += 8;
          if (!hidden) {
            sources.add(
              _Shape(_Primitive(type == 'el', pos, size, radius, m['d'] == 3)),
            );
          }
        case 'tm':
          check(m, p, 'ty nm mn ix hd s e o m bm');
          final mode = m['m'] ?? 1;
          if (mode != 1 && mode != 2) fail('$p.m', 'Trim mode');
          final trim = _Trim(
            [],
            _track(m['s'], '$p.s', 1, [0]),
            _track(m['e'], '$p.e', 1, [100]),
            _track(m['o'], '$p.o', 1, [0]),
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
          check(m, p, 'ty nm mn ix hd c o r w lc lj ml d bm g s e t h a');
          final stroke = type == 'st' || type == 'gs';
          if (stroke) {
            hasStroke = true;
          }
          final dash = stroke ? _dash(m['d'], '$p.d') : null;
          final rule = m['r'] ?? 1;
          if (rule != 1 && rule != 2) fail('$p.r', 'Fill rule');
          final cap = m['lc'] ?? 1, join = m['lj'] ?? 1;
          if (cap is! int ||
              cap < 1 ||
              cap > 3 ||
              join is! int ||
              join < 1 ||
              join > 3) {
            fail(p, 'Stroke cap/join');
          }
          final color = _track(m['c'], '$p.c', 3, [0, 0, 0])..gamma = true;
          // Lottie also permits RGB components encoded in [0,255].
          final values = color.constant != null
              ? [color.constant!]
              : [
                  for (final key in color.keys) ...[
                    key.start,
                    if (key.end != null) key.end!,
                  ],
                ];
          for (final value in values) {
            if (value.any((c) => c > 1)) {
              for (var channel = 0; channel < 3; channel++) {
                value[channel] /= 255;
              }
            }
          }
          final opacity = _track(m['o'], '$p.o', 1, [100]);
          final width = _track(m['w'], '$p.w', 1, [1]);
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
                number(m['ml'] ?? 4, '$p.ml'),
                gradient: (type == 'gf' || type == 'gs')
                    ? _gradient(m, p)
                    : null,
                dash: dash,
              ),
            );
          }
          commands += 2;
        default:
          fail('$p.ty', 'Shape op $type');
      }
    }
    return _Group(sources, draws, transform);
  }

  _Dash? _dash(dynamic value, String path) {
    if (value == null) return null;
    if (value is! List) fail(path, 'Expected dash array');
    final intervals = <_Track>[];
    _Track? offset;
    for (var i = 0; i < value.length; i++) {
      final at = '$path[$i]', m = map(value[i], '$path[$i]');
      check(m, at, 'n nm v');
      final track = _track(m['v'], '$at.v', 1, [0]);
      final name = m['n'];
      if (name == 'o') {
        if (offset != null) fail(at, 'Duplicate dash offset');
        offset = track;
      } else if (name == (intervals.length.isEven ? 'd' : 'g')) {
        intervals.add(track);
      } else {
        fail('$at.n', 'Expected alternating dash/gap');
      }
    }
    if (intervals.isEmpty) return null;
    // rlottie repeats the last dash when its matching gap is omitted.
    if (intervals.length.isOdd) intervals.add(intervals.last);
    return _Dash(intervals, offset ?? _Track.constant([0]));
  }

  _GradientSpec _gradient(Map<String, dynamic> m, String path) {
    final g = map(m['g'], '$path.g');
    check(g, '$path.g', 'p k');
    final count = g['p'];
    if (count is! int || count <= 0) {
      fail('$path.g.p', 'Invalid gradient stop count');
    }
    final stops = _track(
      g['k'],
      '$path.g.k',
      -1,
      [],
      decode: (raw, at) {
        if (raw is! List ||
            raw.length < count * 4 ||
            (raw.length - count * 4).isOdd) {
          fail(at, 'Invalid gradient stops');
        }
        final values = raw.map((v) => number(v, at)).toList();
        for (var i = 0; i < count; i++) {
          for (var j = 1; j <= 3; j++) {
            final v = (values[i * 4 + j] * 255).round().clamp(0, 255) / 255;
            values[i * 4 + j] = v <= .04045
                ? v / 12.92
                : math.pow((v + .055) / 1.055, 2.4).toDouble();
          }
        }
        return values;
      },
    );
    if (m['t'] != 1 && m['t'] != 2) fail('$path.t', 'Gradient type');
    for (final field in ['h', 'a']) {
      final track = _track(m[field], '$path.$field', 1, [0]);
      if (!track.isStatic || track.constant![0] != 0) {
        fail('$path.$field', 'Radial gradient focal point');
      }
    }
    return _GradientSpec(
      count,
      stops,
      _track(m['s'], '$path.s', 2, [0, 0], separateEasing: true),
      _track(m['e'], '$path.e', 2, [0, 0], separateEasing: true),
      m['t'] == 2,
    );
  }

  _Track _track(
    dynamic value,
    String path,
    int dimensions,
    List<double> fallback, {
    double z = 0,
    bool separateEasing = false,
    List<double> Function(dynamic, String)? decode,
  }) {
    if (value == null) return _Track.constant(fallback);
    final m = map(value, path);
    check(m, path, 'a k ix x l');
    if (m['a'] != null && m['a'] != 0 && m['a'] != 1) {
      fail('$path.a', 'Invalid animated flag');
    }
    if (m['x'] != null && m['x'] != '') fail('$path.x', 'Expressions');
    List<double> unpack(dynamic raw, String at) {
      if (decode != null) return decode(raw, at);
      final list = raw is List ? raw : [raw];
      if (list.length < dimensions) fail(at, 'Expected $dimensions components');
      final result = <double>[];
      for (var i = 0; i < dimensions; i++) {
        result.add(number(list[i], '$at[$i]'));
      }
      if (dimensions == 2 && list.length > 2 && number(list[2], at) != z) {
        fail(at, 'Non-planar component');
      }
      return result;
    }

    final raw = m['k'];
    if (m['a'] != 1 &&
        !(raw is List &&
            raw.isNotEmpty &&
            raw.first is Map &&
            raw.first['t'] != null)) {
      return _Track.constant(unpack(raw, '$path.k'));
    }
    if (raw is! List || raw.isEmpty) fail('$path.k', 'Expected keyframes');
    final keys = <_Key>[];
    for (var i = 0; i < raw.length; i++) {
      final at = '$path.k[$i]';
      final k = map(raw[i], at);
      check(k, at, 't s e h i o to ti n');
      Float32List? tangent(String name) {
        if (k[name] == null) return null;
        final v = k[name];
        if (v is! List || v.length < 2) {
          fail('$at.$name', 'Invalid spatial tangent');
        }
        if (dimensions != 2 && v.any((n) => n != 0)) {
          fail('$at.$name', 'Spatial tangent on non-position');
        }
        if (v.length > 2 && v[2] != 0) fail('$at.$name', 'Non-planar tangent');
        return Float32List.fromList([number(v[0], at), number(v[1], at)]);
      }

      final spatialOut = tangent('to'), spatialIn = tangent('ti');
      if ((spatialOut == null) != (spatialIn == null)) {
        fail(at, 'Incomplete spatial tangents');
      }
      final time = number(k['t'], '$at.t');
      if (keys.isNotEmpty && time <= keys.last.time) {
        fail(at, 'Keyframe times must increase');
      }
      final startValue = k['s'] != null
          ? unpack(k['s'], '$at.s')
          : (keys.isNotEmpty
                ? (keys.last.end ?? keys.last.start).toList()
                : null);
      if (startValue == null) fail(at, 'Missing initial keyframe value');
      final endValue = k['e'] != null
          ? Float32List.fromList(unpack(k['e'], '$at.e'))
          : null;
      if (keys.isNotEmpty && keys.first.start.length != startValue.length ||
          endValue != null && endValue.length != startValue.length) {
        fail(at, 'Morph topology/component count changes');
      }
      final eases = <_Ease>[];
      if (k['o'] != null && k['i'] != null && k['h'] != 1) {
        final out = map(k['o'], '$at.o'), inc = map(k['i'], '$at.i');
        List<double> components(dynamic a) =>
            (a is List ? a : [a]).map((v) => number(v, at)).toList();
        final ox = components(out['x']), oy = components(out['y']);
        final ix = components(inc['x']), iy = components(inc['y']);
        final count = [
          ox.length,
          oy.length,
          ix.length,
          iy.length,
        ].reduce(math.max);
        if (count != 1 &&
            count != startValue.length &&
            !(dimensions == 2 && count == 3)) {
          fail(at, 'Easing component count');
        }
        for (final c in [ox, oy, ix, iy]) {
          if (c.length != 1 && c.length != count) {
            fail(at, 'Easing component mismatch');
          }
        }
        for (var j = 0; j < math.min(count, startValue.length); j++) {
          final x1 = ox[j % ox.length], x2 = ix[j % ix.length];
          if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
            fail(at, 'Nonmonotonic temporal easing');
          }
          eases.add(_Ease(x1, oy[j % oy.length], x2, iy[j % iy.length]));
        }
      }
      if (!separateEasing && eases.length > 1) {
        eases.removeRange(1, eases.length);
      }
      keys.add(
        _Key(
          time,
          Float32List.fromList(startValue),
          endValue,
          k['h'] == 1,
          eases,
          to: spatialOut,
          ti: spatialIn,
        ),
      );
    }
    final last = keys.last;
    if (last.end != null && !last.hold && last.time < end) {
      keys.add(_Key(end, last.end!, null, false, const []));
    }
    for (var i = 0; i < keys.length - 1; i++) {
      final key = keys[i];
      final target = key.end ?? keys[i + 1].start;
      if (!key.hold &&
          (key.start[0] != target[0] ||
              (key.start.length > 1 && key.start[1] != target[1])) &&
          key.to != null &&
          key.ti != null &&
          [...key.to!, ...key.ti!].any((v) => v != 0)) {
        key.spatial = _SpatialCurve(
          key.start,
          key.end ?? keys[i + 1].start,
          key.to!,
          key.ti!,
        );
      }
    }
    if (keys.length == 1) return _Track.constant(keys.first.start.toList());
    return _Track.animated(keys, options.useSimd);
  }
}
