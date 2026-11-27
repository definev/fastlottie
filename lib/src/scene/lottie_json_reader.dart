import 'dart:convert';
import 'dart:typed_data';

/// Compact unboxed storage for Lottie Bezier vertex/tangent arrays (`[[x,y], ...]`).
/// Replaces `N + 1` boxed `List`s and `2N` boxed `double`s with a single `Float32List`.
final class PackedPointList {
  PackedPointList(this.xy, this.length);

  final Float32List xy;
  final int length;
}

/// Lottie-specialized UTF-8 JSON parser.
///
/// Decodes UTF-8 JSON bytes directly without allocating an intermediate UTF-16
/// document string, interns common Lottie field names, packs Bezier `v`/`i`/`o`
/// `[[x, y], ...]` arrays into flat [PackedPointList] slabs, and packs flat
/// numeric arrays into unboxed `Float32List` / `Float64List` views.
Map<String, dynamic> parseLottieJsonBytes(Uint8List bytes) {
  final parser = _LottieUtf8JsonParser(bytes);
  final root = parser.parseRoot();
  if (root is! Map<String, dynamic>) {
    throw const FormatException('Expected JSON object at root');
  }
  return root;
}

final class _LottieUtf8JsonParser {
  _LottieUtf8JsonParser(this._b) : _len = _b.length;

  static const int _maxDepth = 256;

  final Uint8List _b;
  final int _len;
  int _pos = 0;
  int _depth = 0;

  static const _pow10 = <double>[
    1e0,
    1e1,
    1e2,
    1e3,
    1e4,
    1e5,
    1e6,
    1e7,
    1e8,
    1e9,
    1e10,
    1e11,
    1e12,
    1e13,
    1e14,
    1e15,
  ];

  // Reusable scratch buffer for growing packed arrays without extra intermediates.
  Float32List _f32Scratch = Float32List(256);
  Float64List _f64Scratch = Float64List(64);

  Object? parseRoot() {
    // Skip optional UTF-8 BOM.
    if (_len >= 3 && _b[0] == 0xEF && _b[1] == 0xBB && _b[2] == 0xBF) {
      _pos = 3;
    }
    _skipWs();
    final value = _parseValue(null);
    _skipWs();
    if (_pos != _len) {
      throw FormatException('Unexpected trailing character at $_pos');
    }
    return value;
  }

  void _skipWs() {
    final b = _b;
    final len = _len;
    var p = _pos;
    while (p < len) {
      final c = b[p];
      if (c != 0x20 && c != 0x09 && c != 0x0A && c != 0x0D) break;
      p++;
    }
    _pos = p;
  }

  Object? _parseValue(String? parentKey) {
    if (_pos >= _len) {
      throw FormatException('Unexpected end of JSON at $_pos');
    }
    final c = _b[_pos];
    if (c == 0x7B) return _parseObject(); // '{'
    if (c == 0x5B) return _parseArray(parentKey); // '['
    if (c == 0x22) return _parseString(intern: false); // '"'
    if (c == 0x74) return _parseTrue(); // 't'
    if (c == 0x66) return _parseFalse(); // 'f'
    if (c == 0x6E) return _parseNull(); // 'n'
    if ((c >= 0x30 && c <= 0x39) || c == 0x2D) return _parseNumber();
    throw FormatException('Unexpected byte $c at $_pos');
  }

  Map<String, dynamic> _parseObject() {
    if (++_depth > _maxDepth) {
      throw FormatException('JSON nesting depth exceeds $_maxDepth at $_pos');
    }
    _pos++; // '{'
    _skipWs();
    final map = <String, dynamic>{};
    if (_pos < _len && _b[_pos] == 0x7D) {
      _pos++;
      _depth--;
      return map;
    }
    while (true) {
      if (_pos >= _len || _b[_pos] != 0x22) {
        throw FormatException('Expected object key at $_pos');
      }
      final key = _parseString(intern: true);
      _skipWs();
      if (_pos >= _len || _b[_pos] != 0x3A) {
        throw FormatException('Expected ":" at $_pos');
      }
      _pos++;
      _skipWs();
      map[key] = _parseValue(key);
      _skipWs();
      if (_pos >= _len) {
        throw FormatException('Unterminated object at $_pos');
      }
      final sep = _b[_pos];
      if (sep == 0x2C) {
        _pos++;
        _skipWs();
        continue;
      }
      if (sep == 0x7D) {
        _pos++;
        _depth--;
        return map;
      }
      throw FormatException('Expected "," or "}" at $_pos');
    }
  }

  Object _parseArray(String? parentKey) {
    if (++_depth > _maxDepth) {
      throw FormatException('JSON nesting depth exceeds $_maxDepth at $_pos');
    }
    final startPos = _pos;
    _pos++; // '['
    _skipWs();
    if (_pos < _len && _b[_pos] == 0x5D) {
      _pos++;
      _depth--;
      return <dynamic>[];
    }

    // Fast path 1: Bezier 2D point list `[[x0,y0], [x1,y1], ...]` under v/i/o.
    if ((parentKey == 'v' || parentKey == 'i' || parentKey == 'o') &&
        _pos < _len &&
        _b[_pos] == 0x5B) {
      final packed = _tryParsePackedPoints();
      if (packed != null) {
        _depth--;
        return packed;
      }
      // Fallback to generic array parser on malformed/unexpected shape data.
      _pos = startPos + 1;
      _skipWs();
    }

    // Fast path 2: Flat numeric array `[n0, n1, ...]` (coordinates, colors,
    // easing tuples, gradient stops, tangents).
    final firstByte = _pos < _len ? _b[_pos] : 0;
    if ((firstByte >= 0x30 && firstByte <= 0x39) || firstByte == 0x2D) {
      final numeric = _tryParseNumericArray(
        preferFloat32:
            parentKey == 'k' ||
            parentKey == 's' ||
            parentKey == 'e' ||
            parentKey == 'to' ||
            parentKey == 'ti',
      );
      if (numeric != null) {
        _depth--;
        return numeric;
      }
      _pos = startPos + 1;
      _skipWs();
    }

    final list = <dynamic>[];
    while (true) {
      list.add(_parseValue(null));
      _skipWs();
      if (_pos >= _len) {
        throw FormatException('Unterminated array at $_pos');
      }
      final sep = _b[_pos];
      if (sep == 0x2C) {
        _pos++;
        _skipWs();
        continue;
      }
      if (sep == 0x5D) {
        _pos++;
        _depth--;
        return list;
      }
      throw FormatException('Expected "," or "]" at $_pos');
    }
  }

  PackedPointList? _tryParsePackedPoints() {
    var count = 0;
    var buf = _f32Scratch;
    final b = _b;
    final len = _len;
    while (true) {
      if (_pos >= len || b[_pos] != 0x5B) return null; // '['
      _pos++;
      _skipWs();
      final x = _tryParseDoubleFast();
      if (x == null) return null;
      _skipWs();
      if (_pos >= len || b[_pos] != 0x2C) return null; // ','
      _pos++;
      _skipWs();
      final y = _tryParseDoubleFast();
      if (y == null) return null;
      _skipWs();
      if (_pos >= len || b[_pos] != 0x5D) return null; // ']'
      _pos++;

      final idx = count * 2;
      if (idx + 2 > buf.length) {
        final next = Float32List(buf.length * 2);
        next.setRange(0, idx, buf);
        buf = _f32Scratch = next;
      }
      buf[idx] = x;
      buf[idx + 1] = y;
      count++;

      _skipWs();
      if (_pos >= len) return null;
      final sep = b[_pos];
      if (sep == 0x2C) {
        _pos++;
        _skipWs();
        continue;
      }
      if (sep == 0x5D) {
        _pos++;
        final out = Float32List(count * 2);
        out.setRange(0, count * 2, buf);
        return PackedPointList(out, count);
      }
      return null;
    }
  }

  List<double>? _tryParseNumericArray({required bool preferFloat32}) {
    var count = 0;
    var buf64 = _f64Scratch;
    final b = _b;
    final len = _len;
    while (true) {
      final v = _tryParseDoubleFast();
      if (v == null) return null;
      if (count >= buf64.length) {
        final next = Float64List(buf64.length * 2);
        next.setRange(0, count, buf64);
        buf64 = _f64Scratch = next;
      }
      buf64[count++] = v;
      _skipWs();
      if (_pos >= len) return null;
      final sep = b[_pos];
      if (sep == 0x2C) {
        _pos++;
        _skipWs();
        continue;
      }
      if (sep == 0x5D) {
        _pos++;
        if (preferFloat32 && count >= 4) {
          final out = Float32List(count);
          for (var i = 0; i < count; i++) {
            out[i] = buf64[i];
          }
          return out;
        }
        final out = Float64List(count);
        out.setRange(0, count, buf64);
        return out;
      }
      return null;
    }
  }

  /// Fast unboxed double parser for numeric array fast paths.
  /// Returns null (without throwing) if the token is not a valid JSON number.
  double? _tryParseDoubleFast() {
    final b = _b;
    final len = _len;
    var p = _pos;
    if (p >= len) return null;
    final start = p;
    var neg = false;
    if (b[p] == 0x2D) {
      neg = true;
      p++;
      if (p >= len) return null;
    }
    final first = b[p];
    if (first < 0x30 || first > 0x39) return null;
    var mantissa = 0;
    var digits = 0;
    if (first == 0x30) {
      p++;
      if (p < len && b[p] >= 0x30 && b[p] <= 0x39) return null;
    } else {
      while (p < len) {
        final d = b[p] - 0x30;
        if (d < 0 || d > 9) break;
        if (digits < 15) {
          mantissa = mantissa * 10 + d;
        }
        digits++;
        p++;
      }
    }
    var fracDigits = 0;
    var overflow = digits > 15;
    if (p < len && b[p] == 0x2E) {
      p++;
      final fracStart = p;
      while (p < len) {
        final d = b[p] - 0x30;
        if (d < 0 || d > 9) break;
        if (digits < 15) {
          mantissa = mantissa * 10 + d;
          fracDigits++;
        } else {
          overflow = true;
        }
        digits++;
        p++;
      }
      if (p == fracStart) return null;
    }
    if (p < len && (b[p] == 0x65 || b[p] == 0x45)) {
      // Scientific notation: scan full token and use exact double.parse.
      p++;
      if (p < len && (b[p] == 0x2B || b[p] == 0x2D)) p++;
      final expStart = p;
      while (p < len && b[p] >= 0x30 && b[p] <= 0x39) {
        p++;
      }
      if (p == expStart) return null;
      _pos = p;
      return double.tryParse(String.fromCharCodes(b, start, p));
    }
    _pos = p;
    if (overflow) {
      return double.tryParse(String.fromCharCodes(b, start, p));
    }
    final value = fracDigits == 0
        ? mantissa.toDouble()
        : mantissa / _pow10[fracDigits];
    return neg ? -value : value;
  }

  num _parseNumber() {
    final b = _b;
    final len = _len;
    var p = _pos;
    final start = p;
    var neg = false;
    if (b[p] == 0x2D) {
      neg = true;
      p++;
      if (p >= len) throw FormatException('Invalid number at $start');
    }
    final first = b[p];
    if (first < 0x30 || first > 0x39) {
      throw FormatException('Invalid number at $start');
    }
    var intVal = 0;
    var digits = 0;
    if (first == 0x30) {
      p++;
      if (p < len && b[p] >= 0x30 && b[p] <= 0x39) {
        throw FormatException('Leading zero in number at $start');
      }
    } else {
      while (p < len) {
        final d = b[p] - 0x30;
        if (d < 0 || d > 9) break;
        if (digits < 15) intVal = intVal * 10 + d;
        digits++;
        p++;
      }
    }
    var isFloat = false;
    var fracDigits = 0;
    var overflow = digits > 15;
    if (p < len && b[p] == 0x2E) {
      isFloat = true;
      p++;
      final fracStart = p;
      while (p < len) {
        final d = b[p] - 0x30;
        if (d < 0 || d > 9) break;
        if (digits < 15) {
          intVal = intVal * 10 + d;
          fracDigits++;
        } else {
          overflow = true;
        }
        digits++;
        p++;
      }
      if (p == fracStart) throw FormatException('Invalid fraction at $start');
    }
    if (p < len && (b[p] == 0x65 || b[p] == 0x45)) {
      isFloat = true;
      overflow = true;
      p++;
      if (p < len && (b[p] == 0x2B || b[p] == 0x2D)) p++;
      final expStart = p;
      while (p < len && b[p] >= 0x30 && b[p] <= 0x39) {
        p++;
      }
      if (p == expStart) throw FormatException('Invalid exponent at $start');
    }
    _pos = p;
    if (!isFloat && !overflow) {
      if (neg && intVal == 0) return -0.0;
      return neg ? -intVal : intVal;
    }
    if (overflow) {
      final str = String.fromCharCodes(b, start, p);
      return isFloat ? double.parse(str) : int.parse(str);
    }
    final value = fracDigits == 0
        ? intVal.toDouble()
        : intVal / _pow10[fracDigits];
    return neg ? -value : value;
  }

  String _parseString({required bool intern}) {
    final b = _b;
    final len = _len;
    _pos++; // '"'
    final start = _pos;
    var p = start;
    var ascii = true;
    while (p < len) {
      final c = b[p];
      if (c == 0x22) {
        _pos = p + 1;
        final strLen = p - start;
        if (strLen == 0) return '';
        if (intern && ascii) {
          final hit = _internKey(b, start, strLen);
          if (hit != null) return hit;
        }
        if (ascii) {
          return String.fromCharCodes(b, start, p);
        }
        return utf8.decode(Uint8List.sublistView(b, start, p));
      }
      if (c == 0x5C) {
        // Escaped string: delegate to Dart's exact JSON string decoder on the
        // minimal raw slice to guarantee full RFC 8259 / surrogate parity.
        return _parseEscapedString(start - 1);
      }
      if (c < 0x20) {
        throw FormatException('Unescaped control character in string at $p');
      }
      if (c >= 0x80) ascii = false;
      p++;
    }
    throw FormatException('Unterminated string at $start');
  }

  String _parseEscapedString(int quoteStart) {
    final b = _b;
    final len = _len;
    var p = quoteStart + 1;
    while (p < len) {
      final c = b[p];
      if (c == 0x5C) {
        p += 2;
        continue;
      }
      if (c == 0x22) {
        _pos = p + 1;
        final raw = utf8.decode(Uint8List.sublistView(b, quoteStart, _pos));
        return jsonDecode(raw) as String;
      }
      p++;
    }
    throw FormatException('Unterminated escaped string at $quoteStart');
  }

  bool _parseTrue() {
    if (_pos + 4 <= _len &&
        _b[_pos + 1] == 0x72 &&
        _b[_pos + 2] == 0x75 &&
        _b[_pos + 3] == 0x65) {
      _pos += 4;
      return true;
    }
    throw FormatException('Invalid token at $_pos');
  }

  bool _parseFalse() {
    if (_pos + 5 <= _len &&
        _b[_pos + 1] == 0x61 &&
        _b[_pos + 2] == 0x6C &&
        _b[_pos + 3] == 0x73 &&
        _b[_pos + 4] == 0x65) {
      _pos += 5;
      return false;
    }
    throw FormatException('Invalid token at $_pos');
  }

  Null _parseNull() {
    if (_pos + 4 <= _len &&
        _b[_pos + 1] == 0x75 &&
        _b[_pos + 2] == 0x6C &&
        _b[_pos + 3] == 0x6C) {
      _pos += 4;
      return null;
    }
    throw FormatException('Invalid token at $_pos');
  }

  static String? _internKey(Uint8List b, int s, int len) {
    if (len == 1) {
      return switch (b[s]) {
        0x76 => 'v',
        0x69 => 'i',
        0x6F => 'o',
        0x63 => 'c',
        0x74 => 't',
        0x73 => 's',
        0x65 => 'e',
        0x61 => 'a',
        0x6B => 'k',
        0x78 => 'x',
        0x79 => 'y',
        0x70 => 'p',
        0x72 => 'r',
        0x77 => 'w',
        0x68 => 'h',
        0x64 => 'd',
        0x67 => 'g',
        0x6C => 'l',
        0x6E => 'n',
        0x6D => 'm',
        _ => null,
      };
    }
    if (len == 2) {
      final pair = (b[s] << 8) | b[s + 1];
      return switch (pair) {
        0x7479 => 'ty',
        0x6E6D => 'nm',
        0x6D6E => 'mn',
        0x6978 => 'ix',
        0x6B73 => 'ks',
        0x6974 => 'it',
        0x746F => 'to',
        0x7469 => 'ti',
        0x6864 => 'hd',
        0x626D => 'bm',
        0x7474 => 'tt',
        0x7464 => 'td',
        0x7470 => 'tp',
        0x6970 => 'ip',
        0x6F70 => 'op',
        0x6672 => 'fr',
        0x7374 => 'st',
        0x7372 => 'sr',
        0x746D => 'tm',
        0x6566 => 'ef',
        0x7379 => 'sy',
        0x7074 => 'pt',
        0x6C63 => 'lc',
        0x6C6A => 'lj',
        0x6D6C => 'ml',
        0x6D6D => 'mm',
        0x6972 => 'ir',
        0x6973 => 'is',
        0x6F72 => 'or',
        0x6F73 => 'os',
        0x7377 => 'sw',
        0x7368 => 'sh',
        0x7363 => 'sc',
        0x616F => 'ao',
        0x636C => 'cl',
        0x6C6E => 'ln',
        0x6E70 => 'np',
        0x656E => 'en',
        0x6964 => 'id',
        0x736B => 'sk',
        0x7361 => 'sa',
        0x6368 => 'ch',
        0x6E6F => 'no',
        _ => null,
      };
    }
    if (len == 3) {
      final tri = (b[s] << 16) | (b[s + 1] << 8) | b[s + 2];
      return switch (tri) {
        0x646464 => 'ddd',
        0x696E64 => 'ind',
        0x636978 => 'cix',
        0x696E76 => 'inv',
        0x6D6C32 => 'ml2',
        0x746773 => 'tgs',
        _ => null,
      };
    }
    if (len == 6 && b[s] == 0x6C && b[s + 1] == 0x61 && b[s + 5] == 0x73) {
      if (b[s + 2] == 0x79 && b[s + 3] == 0x65 && b[s + 4] == 0x72) {
        return 'layers';
      }
    }
    if (len == 6 && b[s] == 0x73 && b[s + 1] == 0x68 && b[s + 5] == 0x73) {
      if (b[s + 2] == 0x61 && b[s + 3] == 0x70 && b[s + 4] == 0x65) {
        return 'shapes';
      }
    }
    if (len == 6 && b[s] == 0x61 && b[s + 1] == 0x73 && b[s + 5] == 0x73) {
      if (b[s + 2] == 0x73 && b[s + 3] == 0x65 && b[s + 4] == 0x74) {
        return 'assets';
      }
    }
    if (len == 6 && b[s] == 0x70 && b[s + 1] == 0x61 && b[s + 5] == 0x74) {
      if (b[s + 2] == 0x72 && b[s + 3] == 0x65 && b[s + 4] == 0x6E) {
        return 'parent';
      }
    }
    if (len == 5 && b[s] == 0x72 && b[s + 1] == 0x65 && b[s + 4] == 0x64) {
      if (b[s + 2] == 0x66 && b[s + 3] == 0x49) return 'refId';
    }
    if (len == 4 &&
        b[s] == 0x6D &&
        b[s + 1] == 0x6F &&
        b[s + 2] == 0x64 &&
        b[s + 3] == 0x65) {
      return 'mode';
    }
    return null;
  }
}
