part of '../raster/raster_core.dart';

/// Deterministic content key for a compiled composition across isolates/sessions/web.
String _computeCompositionContentKey(_Compiler c) {
  final seen = Map<_Compiler, (int, int, int, int)>.identity();
  final (h1, h2, h3, h4) = _ContentKeyHasher.hash(c, seen);
  String hex32(int v) => (v & 0xFFFFFFFF).toRadixString(16).padLeft(8, '0');
  return '${hex32(h1)}${hex32(h2)}${hex32(h3)}${hex32(h4)}';
}

final class _ContentKeyHasher {
  _ContentKeyHasher(this._seen);

  final Map<_Compiler, (int, int, int, int)> _seen;
  final ByteData _floatBuf = ByteData(8);
  int _h1 = 0x811C9DC5;
  int _h2 = 0x9E3779B9;
  int _h3 = 0x85EBCA6B;
  int _h4 = 0xC2B2AE35;

  static (int, int, int, int) hash(
    _Compiler c,
    Map<_Compiler, (int, int, int, int)> seen,
  ) {
    final cached = seen[c];
    if (cached != null) return cached;
    final hasher = _ContentKeyHasher(seen);
    hasher._mixCompiler(c);
    final digest = (hasher._h1, hasher._h2, hasher._h3, hasher._h4);
    seen[c] = digest;
    return digest;
  }

  static int _mul32(int a, int b) {
    // Native Dart multiplies integers modulo 2^64. The low 32 bits are
    // identical, including when the product overflows the signed range.
    // dart2js numbers cannot represent those products exactly.
    if (!_isWeb &&
        !const bool.fromEnvironment('FASTLOTTIE_SPLIT_HASH_MULTIPLY')) {
      return (a * b) & 0xFFFFFFFF;
    }
    final lo = (a & 0xFFFF) * b;
    final hi = ((a >>> 16) * b) & 0xFFFF;
    return (lo + (hi << 16)) & 0xFFFFFFFF;
  }

  void _mixInt(int v) {
    final x = v & 0xFFFFFFFF;
    _h1 = _mul32(_h1 ^ x, 0x01000193);
    _h2 = _mul32((_h2 + x) & 0xFFFFFFFF, 0x85EBCA6B);
    _h2 ^= _h2 >>> 16;
    _h3 = _mul32(_h3 ^ x, 0xC2B2AE35);
    _h3 ^= _h3 >>> 13;
    _h4 = _mul32((_h4 + _h1 + x) & 0xFFFFFFFF, 0x27D4EB2F);
  }

  void _mixDouble(double d) {
    _floatBuf.setFloat64(0, d == 0.0 ? 0.0 : d, Endian.little);
    _mixInt(_floatBuf.getUint32(0, Endian.little));
    _mixInt(_floatBuf.getUint32(4, Endian.little));
  }

  void _mixTrack(Track t) {
    _mixInt(t.gamma ? 1 : 0);
    final cnst = t.constant;
    if (cnst != null) {
      _mixInt(cnst.length);
      _mixFloatRange(cnst, 0, cnst.length);
      return;
    }
    final data = t.keyframes!;
    _mixInt(data.count);
    final values = data.values;
    final controls = data.easing;
    final w = data.width;
    for (var key = 0; key < data.count; key++) {
      _mixDouble(data.times[key]);
      _mixInt(data.isHold(key) ? 1 : 0);
      _mixInt(w);
      _mixFloatRange(values, key * data.stride, w);
      if (data.hasEnd(key)) {
        _mixInt(w);
        _mixFloatRange(values, data.endOffset(key), w);
      }
      final easeCount = data.easeCount(key);
      _mixInt(easeCount);
      final easeStart = data.easeOffset(key);
      for (var i = easeStart; i < easeStart + 4 * easeCount; i++) {
        _mixDouble(controls[i]);
      }
      if (data.hasTangents(key)) {
        _mixFloatRange(data.tangents!, key * 4, 4);
      }
    }
  }

  void _mixFloatRange(Float32List values, int start, int length) {
    if (_isWeb ||
        const bool.fromEnvironment('FASTLOTTIE_SPLIT_HASH_MULTIPLY')) {
      for (var i = 0; i < length; i++) {
        _mixDouble(values[start + i]);
      }
      return;
    }
    final buf = _floatBuf;
    var h1 = _h1, h2 = _h2, h3 = _h3, h4 = _h4;
    final end = start + length;
    for (var i = start; i < end; i++) {
      final v = values[i];
      buf.setFloat64(0, v == 0.0 ? 0.0 : v, Endian.little);
      final lo = buf.getUint32(0, Endian.little);
      h1 = ((h1 ^ lo) * 0x01000193) & 0xFFFFFFFF;
      h2 = (((h2 + lo) & 0xFFFFFFFF) * 0x85EBCA6B) & 0xFFFFFFFF;
      h2 ^= h2 >>> 16;
      h3 = ((h3 ^ lo) * 0xC2B2AE35) & 0xFFFFFFFF;
      h3 ^= h3 >>> 13;
      h4 = (((h4 + h1 + lo) & 0xFFFFFFFF) * 0x27D4EB2F) & 0xFFFFFFFF;

      final hi = buf.getUint32(4, Endian.little);
      h1 = ((h1 ^ hi) * 0x01000193) & 0xFFFFFFFF;
      h2 = (((h2 + hi) & 0xFFFFFFFF) * 0x85EBCA6B) & 0xFFFFFFFF;
      h2 ^= h2 >>> 16;
      h3 = ((h3 ^ hi) * 0xC2B2AE35) & 0xFFFFFFFF;
      h3 ^= h3 >>> 13;
      h4 = (((h4 + h1 + hi) & 0xFFFFFFFF) * 0x27D4EB2F) & 0xFFFFFFFF;
    }
    _h1 = h1;
    _h2 = h2;
    _h3 = h3;
    _h4 = h4;
  }

  void _mixTransform(_Transform t) {
    _mixTrack(t.anchor);
    _mixTrack(t.position);
    _mixTrack(t.scale);
    _mixTrack(t.rotation);
    _mixTrack(t.opacity);
    if (t.x != null) _mixTrack(t.x!);
    if (t.y != null) _mixTrack(t.y!);
    if (t.skew != null) _mixTrack(t.skew!);
    if (t.skewAxis != null) _mixTrack(t.skewAxis!);
  }

  void _mixSource(_PathSource s) {
    if (s is _Shape) {
      _mixSource(s.content);
    } else if (s is _BezierGeometry) {
      _mixInt(s.closed ? 1 : 2);
      _mixInt(s.closures.length);
      for (final cl in s.closures) {
        _mixInt((cl.$1 ? 1 : 0) | (cl.$2 ? 2 : 0));
      }
      _mixTrack(s.track);
    } else if (s is _Primitive) {
      _mixInt(s.ellipse ? 3 : 4);
      _mixInt(s.reverse ? 1 : 0);
      _mixTrack(s.position);
      _mixTrack(s.size);
      _mixTrack(s.radius);
    } else if (s is _PolyStarGeometry) {
      _mixInt(s.isStar ? 7 : 8);
      _mixInt(s.reverse ? 1 : 0);
      _mixTrack(s.points);
      _mixTrack(s.position);
      _mixTrack(s.rotation);
      _mixTrack(s.outerRadius);
      _mixTrack(s.outerRoundness);
      if (s.innerRadius != null) _mixTrack(s.innerRadius!);
      if (s.innerRoundness != null) _mixTrack(s.innerRoundness!);
    } else if (s is _TrimPart) {
      _mixInt(5 + s.index);
      if (s.index >= 0 && s.index < s.trim.inputs.length) {
        _mixSource(s.trim.inputs[s.index]);
      }
      _mixTrack(s.trim.start);
      _mixTrack(s.trim.end);
      _mixTrack(s.trim.offset);
      _mixInt(s.trim.individual ? 1 : 0);
    } else if (s is _Group) {
      _mixInt(6);
      _mixTransform(s.transform);
      for (final sub in s.sources) {
        _mixSource(sub);
      }
    } else if (s is _MergePathSource) {
      _mixInt(9 + s.mode);
      if (s.mode != 1) _mixInt(0x424f4f4c); // Coverage boolean raster revision.
      for (final sub in s.sources) {
        _mixSource(sub);
      }
    }
  }

  void _mixDraw(_Draw d) {
    if (d is _Group) {
      _mixInt(7);
      _mixTransform(d.transform);
      for (final sub in d.draws) {
        _mixDraw(sub);
      }
    } else if (d is _Style) {
      _mixInt(8);
      _mixInt(
        (d.stroke ? 1 : 0) | (d.evenOdd ? 2 : 0) | (d.cap << 4) | (d.join << 8),
      );
      _mixDouble(d.miter);
      _mixTrack(d.color);
      _mixTrack(d.opacity);
      _mixTrack(d.width);
      for (final s in d.sources) {
        _mixSource(s);
      }
      final g = d.gradient;
      if (g != null) {
        _mixInt(g.count);
        _mixInt(g.radial ? 1 : 0);
        _mixTrack(g.stops);
        _mixTrack(g.start);
        _mixTrack(g.end);
        if (g.hasFocalPoint) {
          _mixInt(0x666f6361); // Radial focal point.
          _mixTrack(g.highlightLength!);
          _mixInt(g.highlightAngle == null ? 0 : 1);
          if (g.highlightAngle != null) _mixTrack(g.highlightAngle!);
        }
      }
      final dash = d.dash;
      if (dash != null) {
        _mixTrack(dash.offset);
        for (final iv in dash.intervals) {
          _mixTrack(iv);
        }
      }
    }
  }

  void _mixCompiler(_Compiler comp) {
    _mixDouble(comp.width);
    _mixDouble(comp.height);
    _mixDouble(comp.start);
    _mixDouble(comp.end);
    _mixDouble(comp.fps);
    _mixInt(comp.layers.length);
    for (final l in comp.layers) {
      _mixDouble(l.ip);
      _mixDouble(l.op);
      _mixDouble(l.offset);
      if (l.stretch != 1.0) {
        _mixInt(0x53545243);
        _mixDouble(l.stretch);
      }
      if (l.timeRemap != null) {
        _mixInt(0x54524d50);
        _mixTrack(l.timeRemap!);
      }
      if (l.parent != null) {
        _mixInt(0x50524e54);
        _mixInt(comp.layers.indexOf(l.parent!));
      }
      _mixInt((l.hidden ? 1 : 0) | (l.matteType << 2) | (l.blendMode << 6));
      if (l.blendMode != 0) _mixInt(0x424c454e); // Blend raster revision.
      if (l.usesSetMatte) {
        _mixInt(0x534d4154);
        _mixInt(comp.layers.indexOf(l.matte!));
      }
      final fill = l.fillEffect;
      if (fill != null) {
        _mixInt(0x46494c4c);
        _mixTrack(fill.color);
        _mixTrack(fill.opacity);
      }
      final shadow = l.innerShadow;
      if (shadow != null) {
        _mixInt(0x53484457); // Inner Shadow.
        _mixDouble(shadow.dx);
        _mixDouble(shadow.dy);
        _mixInt(shadow.argb);
      }
      _mixTransform(l.transform);
      final masks = l.masks;
      if (masks != null && masks.isNotEmpty) {
        _mixInt(0x4d41534b);
        _mixInt(masks.length);
        for (final mask in masks) {
          _mixInt(mask.mode.codeUnitAt(0));
          _mixInt(mask.inverted ? 1 : 0);
          _mixSource(mask.geometry);
          _mixTrack(mask.opacity);
          final expand = mask.expand;
          if (expand != null) _mixTrack(expand);
        }
      }
      final g = l.group;
      if (g != null) _mixDraw(g);
      final ch = l.child;
      if (ch != null) {
        final (c1, c2, c3, c4) = _ContentKeyHasher.hash(ch, _seen);
        _mixInt(c1);
        _mixInt(c2);
        _mixInt(c3);
        _mixInt(c4);
      }
    }
  }
}
