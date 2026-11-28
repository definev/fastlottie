part of '../raster/raster_core.dart';

// A private, versioned RAM representation of the immutable compiler graph.
// No player state, native objects, source JSON, or derived geometry is stored.
// References preserve shared paths/precomps. Parent/matte links are fixed up
// after constructing the DAG. Only process-owned or fingerprinted build-owned
// blobs are accepted; this is not a loader for downloaded compiled content.
class _SceneSnapshot {
  static const magic = 0x314d4c46, version = 3;
  static const maxBytes = 64 << 20;

  static Uint8List encode(_Compiler compiler, String key, int sourceBytes) {
    final ids = Map<Object, int>.identity();
    final records = <List<Object>>[];
    int ref(Object? value) {
      if (value == null) return 0;
      final known = ids[value];
      if (known != null) return known;
      final id = records.length + 1;
      ids[value] = id;
      records.add([]);
      List<int> refs(Iterable<Object> values) => values.map(ref).toList();
      final List<Object> fields;
      switch (value) {
        case Track v:
          fields = [
            1,
            v.gamma,
            v.simd,
            ref(v.keyframes),
            v.constant ?? Float32List(0),
          ];
        case Keyframes v:
          fields = [
            2,
            v.width,
            v.stride,
            v.simdValues != null,
            v.times,
            v.metadata,
            v.values,
            v.easing,
            v.tangents ?? Float32List(0),
          ];
        case _Transform v:
          fields = [
            3,
            ref(v.anchor),
            ref(v.position),
            ref(v.scale),
            ref(v.rotation),
            ref(v.opacity),
            ref(v.x),
            ref(v.y),
            ref(v.skew),
            ref(v.skewAxis),
          ];
        case _Group v:
          fields = [4, refs(v.sources), refs(v.draws), ref(v.transform)];
        case _Shape v:
          fields = [5, ref(v.content)];
        case _TrimPart v:
          fields = [6, ref(v.trim), v.index];
        case _MergePathSource v:
          fields = [7, refs(v.sources), v.mode];
        case _BezierGeometry v:
          fields = [
            8,
            ref(v.track),
            v.closed,
            v.reverse,
            Uint8List.fromList([
              for (final (a, b) in v.closures) (a ? 1 : 0) | (b ? 2 : 0),
            ]),
          ];
        case _Primitive v:
          fields = [
            9,
            v.ellipse,
            v.reverse,
            ref(v.position),
            ref(v.size),
            ref(v.radius),
          ];
        case _PolyStarGeometry v:
          fields = [
            10,
            v.isStar,
            v.reverse,
            ref(v.points),
            ref(v.position),
            ref(v.rotation),
            ref(v.outerRadius),
            ref(v.outerRoundness),
            ref(v.innerRadius),
            ref(v.innerRoundness),
          ];
        case _Style v:
          fields = [
            11,
            refs(v.sources),
            ref(v.color),
            ref(v.opacity),
            ref(v.width),
            v.stroke,
            v.evenOdd,
            v.cap,
            v.join,
            v.miter,
            ref(v.gradient),
            ref(v.dash),
          ];
        case _GradientSpec v:
          fields = [
            12,
            v.count,
            ref(v.stops),
            ref(v.start),
            ref(v.end),
            v.radial,
            ref(v.highlightLength),
            ref(v.highlightAngle),
          ];
        case _Trim v:
          fields = [
            13,
            refs(v.inputs),
            ref(v.start),
            ref(v.end),
            ref(v.offset),
            v.individual,
          ];
        case _Dash v:
          fields = [14, refs(v.intervals), ref(v.offset)];
        case _Mask v:
          fields = [
            15,
            ref(v.geometry),
            v.mode.codeUnitAt(0),
            ref(v.opacity),
            v.inverted,
            ref(v.expand),
          ];
        case _Layer v:
          fields = [
            16,
            ref(v.transform),
            ref(v.group),
            v.ip,
            v.op,
            v.hidden,
            ref(v.child),
            v.offset,
            v.stretch,
            ref(v.timeRemap),
            v.matteType,
            refs(v.masks ?? []),
            v.masks != null,
            v.blendMode,
            ref(v.innerShadow),
            ref(v.fillEffect),
            v.usesSetMatte,
            ref(v.parent),
            ref(v.matte),
            v.isMatteSource,
          ];
        case _Compiler v:
          fields = [
            17,
            v.options.useSimd,
            v.width,
            v.height,
            v.start,
            v.end,
            v.fps,
            v.commands,
            v.hasStroke,
            refs(v.layers),
          ];
        case _InnerShadow v:
          fields = [18, v.dx, v.dy, v.argb];
        case _FillEffect v:
          fields = [19, ref(v.color), ref(v.opacity)];
        default:
          throw StateError(
            'Unsupported scene snapshot node ${value.runtimeType}',
          );
      }
      records[id - 1] = fields;
      return id;
    }

    final root = ref(compiler), text = utf8.encode(key);
    final out = _SnapshotWriter();
    out.u32(magic);
    out.u32(version);
    out.u32(records.length);
    out.u32(root);
    out.u32(sourceBytes);
    out.u32(text.length);
    out.raw(text);
    for (final value in [
      compiler.width,
      compiler.height,
      compiler.start,
      compiler.end,
      compiler.fps,
    ]) {
      out.field(value);
    }
    out.u32(compiler.commands);
    out.u32(compiler.options.useSimd ? 1 : 0);
    out.u32(compiler.isStatic ? 1 : 0);
    final directory = out.position;
    for (var i = 0; i <= records.length; i++) {
      out.u32(0);
    }
    for (var i = 0; i < records.length; i++) {
      out.data.setUint32(directory + i * 4, out.position, Endian.little);
      for (final field in records[i]) {
        out.field(field);
      }
    }
    out.data.setUint32(
      directory + records.length * 4,
      out.position,
      Endian.little,
    );
    return Uint8List.fromList(out.bytes.sublist(0, out.position));
  }

  static ({_SnapshotMetadata metadata, List<int> offsets, int root}) header(
    Uint8List bytes,
  ) {
    if (bytes.offsetInBytes != 0 || bytes.length > maxBytes) {
      throw const FormatException('Invalid trusted scene snapshot storage');
    }
    final input = _SnapshotReader(bytes, 0, bytes.length);
    if (input.u32() != magic || input.u32() != version) {
      throw const FormatException('Incompatible trusted scene snapshot');
    }
    final count = input.u32(),
        root = input.u32(),
        sourceBytes = input.u32(),
        keySize = input.u32();
    if (count < 1 ||
        count > 1000000 ||
        root < 1 ||
        root > count ||
        keySize > 256) {
      throw const FormatException('Invalid scene snapshot header');
    }
    final key = utf8.decode(input.take(keySize));
    final width = input.doubleValue(),
        height = input.doubleValue(),
        start = input.doubleValue(),
        end = input.doubleValue(),
        fps = input.doubleValue();
    final commands = input.u32(), simd = input.flag(), isStatic = input.flag();
    if (!width.isFinite ||
        !height.isFinite ||
        !start.isFinite ||
        !end.isFinite ||
        !fps.isFinite ||
        width <= 0 ||
        height <= 0 ||
        fps <= 0 ||
        end <= start) {
      throw const FormatException('Invalid scene snapshot metadata');
    }
    final _SnapshotMetadata metadata = (
      width: width,
      height: height,
      start: start,
      end: end,
      fps: fps,
      commands: commands,
      options: FastLottieOptions(useSimd: simd),
      isStatic: isStatic,
      key: key,
      sourceBytes: sourceBytes,
    );
    input.need((count + 1) * 4);
    final offsets =
        !_isWasm && input.position % 4 == 0 && Endian.host == Endian.little
        ? bytes.buffer.asUint32List(input.position, count + 1)
        : List<int>.generate(
            count + 1,
            (i) => input.data.getUint32(input.position + i * 4, Endian.little),
            growable: false,
          );
    input.position += (count + 1) * 4;
    if (offsets.first < input.position || offsets.last != bytes.length) {
      throw const FormatException('Invalid scene snapshot directory');
    }
    for (var i = 0; i < count; i++) {
      if (offsets[i] >= offsets[i + 1]) {
        throw const FormatException('Invalid scene snapshot offsets');
      }
    }
    return (metadata: metadata, offsets: offsets, root: root);
  }

  static ({_Compiler compiler, String key, int sourceBytes}) decode(
    Uint8List bytes, {
    bool warm = false,
  }) {
    final data = header(bytes);
    final decoder = _SnapshotDecoder(
      bytes,
      data.offsets,
      data.offsets.length - 1,
    );
    final compiler = decoder._get<_Compiler>(data.root);
    // Resolving a parent can append a layer that was not in a visible list.
    for (var i = 0; i < decoder._links.length; i++) {
      final (layer, parent, matte) = decoder._links[i];
      layer.parent = parent == 0 ? null : decoder._get<_Layer>(parent);
      layer.matte = matte == 0 ? null : decoder._get<_Layer>(matte);
    }
    if (warm) {
      for (final node in decoder._memo) {
        if (node != null) _primeSceneNode(node);
      }
    }
    return (
      compiler: compiler,
      key: data.metadata.key,
      sourceBytes: data.metadata.sourceBytes,
    );
  }
}

// One cursor and generic field methods serve the whole restore. Child records
// save/restore the cursor, avoiding a reader, ByteData view and helper closures
// for every node in the graph.
class _SnapshotDecoder {
  _SnapshotDecoder(Uint8List bytes, this._offsets, int count)
    : _input = _SnapshotReader(bytes, 0, bytes.length),
      _memo = List<Object?>.filled(count + 1, null),
      _visiting = Uint8List(count + 1);

  final _SnapshotReader _input;
  final List<int> _offsets;
  final List<Object?> _memo;
  final Uint8List _visiting;
  final _links = <(_Layer, int, int)>[];

  T read<T extends Object>() => _get<T>(_input.u32());
  T? optional<T extends Object>() {
    final id = _input.u32();
    return id == 0 ? null : _get<T>(id);
  }

  List<T> list<T extends Object>() {
    final count = _input.u32();
    _input.need(count * 4);
    if (count == 0) return <T>[];
    final result = List<T>.filled(count, read<T>(), growable: false);
    for (var i = 1; i < count; i++) {
      result[i] = read<T>();
    }
    return result;
  }

  T _get<T extends Object>(int id) {
    if (id <= 0 || id >= _memo.length) {
      throw const FormatException('Invalid scene reference');
    }
    final known = _memo[id];
    if (known != null) return known as T;
    if (_visiting[id] != 0) {
      throw const FormatException('Cyclic scene snapshot');
    }
    _visiting[id] = 1;
    final parentPosition = _input.position, parentEnd = _input.end;
    _input.position = _offsets[id - 1];
    _input.end = _offsets[id];
    try {
      final Object value;
      switch (_input.u32()) {
        case 1:
          final gamma = _input.flag(),
              simd = _input.flag(),
              data = optional<Keyframes>();
          final constant = _input.f32();
          value =
              (data == null
                    ? Track.constantValues(constant)
                    : Track.animated(data, simd))
                ..gamma = gamma;
        case 2:
          final width = _input.u32(),
              stride = _input.u32(),
              simd = _input.flag();
          final times = _input.f64();
          final metadata = _input.i32(),
              values = _input.f32(),
              easing = _input.f64(),
              tangents = _input.f32();
          if (stride < width ||
              metadata.length != times.length * 3 ||
              values.length < times.length * stride) {
            throw const FormatException('Invalid snapshot keyframes');
          }
          // Packed values have 16-byte alignment in the blob.
          value = Keyframes(
            times,
            width,
            stride,
            metadata,
            values,
            easing,
            tangents.isEmpty ? null : tangents,
            simd,
          );
        case 3:
          value = _Transform(
            read(),
            read(),
            read(),
            read(),
            read(),
            optional(),
            optional(),
            optional(),
            optional(),
          );
        case 4:
          value = _Group(list(), list(), read());
        case 5:
          value = _Shape(read());
        case 6:
          value = _TrimPart(read(), _input.u32());
        case 7:
          value = _MergePathSource(list(), _input.u32());
        case 8:
          final track = read<Track>(),
              closed = _input.flag(),
              reverse = _input.flag(),
              flags = _input.u8();
          value = _BezierGeometry(track, closed, [
            for (final f in flags) (f & 1 != 0, f & 2 != 0),
          ], reverse);
        case 9:
          final ellipse = _input.flag(), reverse = _input.flag();
          value = _Primitive(ellipse, read(), read(), read(), reverse);
        case 10:
          final star = _input.flag(), reverse = _input.flag();
          value = _PolyStarGeometry(
            star,
            read(),
            read(),
            read(),
            read(),
            read(),
            optional(),
            optional(),
            reverse,
          );
        case 11:
          value = _Style(
            list(),
            read(),
            read(),
            read(),
            _input.flag(),
            _input.flag(),
            _input.u32(),
            _input.u32(),
            _input.doubleValue(),
            gradient: optional(),
            dash: optional(),
          );
        case 12:
          value = _GradientSpec(
            _input.u32(),
            read(),
            read(),
            read(),
            _input.flag(),
            optional(),
            optional(),
          );
        case 13:
          value = _Trim(list(), read(), read(), read(), _input.flag());
        case 14:
          value = _Dash(list(), read());
        case 15:
          value = _Mask(
            read(),
            String.fromCharCode(_input.u32()),
            read(),
            _input.flag(),
            expand: optional(),
          );
        case 16:
          final transform = read<_Transform>(), group = optional<_Group>();
          final ip = _input.doubleValue(),
              op = _input.doubleValue(),
              hidden = _input.flag();
          final child = optional<_Compiler>(),
              offset = _input.doubleValue(),
              stretch = _input.doubleValue();
          final remap = optional<Track>(),
              matteType = _input.u32(),
              masks = list<_Mask>(),
              hasMasks = _input.flag();
          final layer = _Layer(
            transform,
            group,
            ip,
            op,
            hidden,
            child: child,
            offset: offset,
            stretch: stretch,
            timeRemap: remap,
            matteType: matteType,
            masks: hasMasks ? masks : null,
            blendMode: _input.u32(),
            innerShadow: optional(),
            fillEffect: optional(),
            usesSetMatte: _input.flag(),
          );
          _links.add((layer, _input.u32(), _input.u32()));
          layer.isMatteSource = _input.flag();
          value = layer;
        case 17:
          value = _Compiler(FastLottieOptions(useSimd: _input.flag()))
            ..width = _input.doubleValue()
            ..height = _input.doubleValue()
            ..start = _input.doubleValue()
            ..end = _input.doubleValue()
            ..fps = _input.doubleValue()
            ..commands = _input.u32()
            ..hasStroke = _input.flag()
            ..layers.addAll(list());
        case 18:
          value = _InnerShadow(
            _input.doubleValue(),
            _input.doubleValue(),
            _input.u32(),
          );
        case 19:
          value = _FillEffect(read(), read());
        default:
          throw const FormatException('Unknown scene snapshot node');
      }
      if (_input.position != _input.end) {
        throw const FormatException('Invalid scene snapshot record');
      }
      _memo[id] = value;
      _visiting[id] = 0;
      return value as T;
    } finally {
      _input.position = parentPosition;
      _input.end = parentEnd;
    }
  }
}

class _SnapshotWriter {
  Uint8List bytes = Uint8List(4096);
  late ByteData data = ByteData.sublistView(bytes);
  int position = 0;
  void ensure(int n) {
    if (position + n <= bytes.length) return;
    if (position + n > _SceneSnapshot.maxBytes) {
      throw UnsupportedError('Compiled scene exceeds snapshot size limit');
    }
    var cap = bytes.length;
    while (cap < position + n) {
      cap *= 2;
    }
    final next = Uint8List(cap)..setRange(0, position, bytes);
    bytes = next;
    data = ByteData.sublistView(bytes);
  }

  void u32(int value) {
    ensure(4);
    data.setUint32(position, value, Endian.little);
    position += 4;
  }

  void raw(List<int> value) {
    ensure(value.length);
    bytes.setRange(position, position + value.length, value);
    position += value.length;
  }

  void field(Object v) {
    if (v is bool) {
      u32(v ? 1 : 0);
    } else if (v is int) {
      u32(v);
    } else if (v is double) {
      ensure(8);
      data.setFloat64(position, v, Endian.little);
      position += 8;
    } else if (v is TypedData) {
      final length = switch (v) {
        Float32List x => x.length,
        Float64List x => x.length,
        Int32List x => x.length,
        Uint8List x => x.length,
        _ => throw StateError('snapshot data'),
      };
      u32(length);
      final aligned = (position + 15) & ~15;
      ensure(aligned - position);
      position = aligned;
      if (Endian.host != Endian.little) {
        throw UnsupportedError('Scene snapshots require little endian');
      }
      raw(v.buffer.asUint8List(v.offsetInBytes, v.lengthInBytes));
    } else if (v is List<int>) {
      u32(v.length);
      for (final id in v) {
        u32(id);
      }
    } else {
      throw StateError('Invalid snapshot field');
    }
  }
}

class _SnapshotReader {
  _SnapshotReader(this.bytes, this.position, this.end)
    : data = ByteData.sublistView(bytes);
  final Uint8List bytes;
  final ByteData data;
  int end, position;
  void need(int n) {
    assert(n >= 0);
    if (n > end - position) {
      throw const FormatException('Truncated scene snapshot');
    }
  }

  int u32() {
    need(4);
    final n = data.getUint32(position, Endian.little);
    position += 4;
    return n;
  }

  bool flag() {
    final n = u32();
    if (n > 1) throw const FormatException('Invalid snapshot flag');
    return n == 1;
  }

  double doubleValue() {
    need(8);
    final n = data.getFloat64(position, Endian.little);
    position += 8;
    return n;
  }

  Uint8List take(int n) {
    need(n);
    final start = position;
    position += n;
    if (_isWasm) {
      return Uint8List(n)..setRange(0, n, bytes, start);
    }
    return Uint8List.sublistView(bytes, start, start + n);
  }

  (int, int) array(int size) {
    final n = u32();
    position = (position + 15) & ~15;
    need(n * size);
    final at = position;
    position += n * size;
    return (at, n);
  }

  Float32List f32() {
    final (at, n) = array(4);
    if (_isWasm) {
      final out = Float32List(n);
      for (var i = 0; i < n; i++) {
        out[i] = data.getFloat32(at + (i << 2), Endian.host);
      }
      return out;
    }
    return bytes.buffer.asFloat32List(at, n);
  }

  Float64List f64() {
    final (at, n) = array(8);
    if (_isWasm) {
      final out = Float64List(n);
      for (var i = 0; i < n; i++) {
        out[i] = data.getFloat64(at + (i << 3), Endian.host);
      }
      return out;
    }
    return bytes.buffer.asFloat64List(at, n);
  }

  Int32List i32() {
    final (at, n) = array(4);
    if (_isWasm) {
      final out = Int32List(n);
      for (var i = 0; i < n; i++) {
        out[i] = data.getInt32(at + (i << 2), Endian.host);
      }
      return out;
    }
    return bytes.buffer.asInt32List(at, n);
  }

  Uint8List u8() {
    final (at, n) = array(1);
    if (_isWasm) {
      return Uint8List(n)..setRange(0, n, bytes, at);
    }
    return bytes.buffer.asUint8List(at, n);
  }
}
