import 'dart:math' as math;
import 'dart:typed_data';

import '../platform/simd_stub.dart'
    if (dart.library.ffi) '../platform/simd_io.dart'
    if (dart.library.js_interop) '../platform/simd_wasm.dart';
import 'scanline_rasterizer.dart';

const _isWeb = bool.fromEnvironment('dart.library.js_interop');

/// 64-bit SWAR premultiplied BGRA8888 (`(A << 24) | (R << 16) | (G << 8) | B`) blenders.
abstract final class SwarBlender {
  static const int _zeroChunkPixels = 16384;
  static final Uint32List _zeroU32 = Uint32List(_zeroChunkPixels);

  /// Fast zero-fill for pixel buffers. Uses chunked `setRange` (native `memmove`
  /// in Dart VM, `array.copy` in dart2wasm, and `TypedArray.set` in dart2js),
  /// which is 10x-195x faster than `Uint32List.fillRange(0, count, 0)`.
  static void clearPixels(Uint32List dst, int count) {
    if (count <= 0) return;
    if (count <= _zeroChunkPixels) {
      dst.setRange(0, count, _zeroU32);
      return;
    }
    var offset = 0;
    while (offset < count) {
      final end = offset + _zeroChunkPixels;
      dst.setRange(offset, end < count ? end : count, _zeroU32);
      offset = end;
    }
  }

  /// Exact 16.16 fixed-point reciprocal table for un-premultiplying `0..255`
  /// channels by `alpha` (`1..255`): `((c * _invAlphaLut[a]) >> 16) == (c * 255) ~/ a`.
  static final Uint32List _invAlphaLut = () {
    final lut = Uint32List(256);
    for (var a = 1; a < 256; a++) {
      lut[a] = ((255 << 16) + a - 1) ~/ a;
    }
    return lut;
  }();

  static int inverseAlpha(int alpha) => _invAlphaLut[alpha];

  static NativePixelBuffer allocateInverseAlphaTable() =>
      NativePixelBuffer(_invAlphaLut.length)..typedList.setAll(0, _invAlphaLut);

  static int premulBgra(int a, int r, int g, int b) {
    if (a == 0) return 0;
    if (a == 255) return (0xFF << 24) | (r << 16) | (g << 8) | b;
    final pr = (r * a + 127) ~/ 255;
    final pg = (g * a + 127) ~/ 255;
    final pb = (b * a + 127) ~/ 255;
    return (a << 24) | (pr << 16) | (pg << 8) | pb;
  }

  static int scalePremul(int premul, int factor256) {
    if (factor256 >= 256) return premul;
    if (factor256 <= 0 || premul == 0) return 0;
    final rb =
        ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
    final ag =
        ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
    return rb | ag;
  }

  static int blendSrcOver(int srcPremul, int dstPremul) {
    if (srcPremul == 0) return dstPremul;
    final sa = srcPremul >>> 24;
    if (sa == 255 || dstPremul == 0) return srcPremul;
    final ia = 255 - sa;
    final rb0 = (dstPremul & 0x00FF00FF) * ia + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((dstPremul >> 8) & 0x00FF00FF) * ia + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return srcPremul + (rb | ag);
  }

  static int scalePremul255(int premul, int factor255) {
    if (factor255 >= 255) return premul;
    if (factor255 <= 0 || premul == 0) return 0;
    final rb0 = (premul & 0x00FF00FF) * factor255 + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((premul >> 8) & 0x00FF00FF) * factor255 + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return rb | ag;
  }

  static void fillSolidSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    RleSpans spans,
    int srcPremul, [
    NativePixelBuffer? nativeDst,
  ]) {
    if (srcPremul == 0 || spans.spanCount == 0) return;
    if (nativeDst != null &&
        simdFillSolidSpans(
          nativeDst,
          dstOriginX,
          dstOriginY,
          stride,
          spans.buffer,
          spans.spanCount,
          srcPremul,
        )) {
      return;
    }
    final count = spans.spanCount * 2;
    final data = spans.data;
    final fullSa = srcPremul >>> 24;
    final canUseDst4 =
        !_isWeb && fullSa == 255 && (dst.offsetInBytes & 15) == 0;
    final canUseDst64 = !_isWeb && (dst.offsetInBytes & 7) == 0;
    Int32x4List? dst4;
    Uint64List? dst64;
    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final y = (w0 >>> 16) - dstOriginY;
      final x = (w0 & 0xFFFF) - dstOriginX;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final effSrc = cov == 256 ? srcPremul : scalePremul(srcPremul, cov);
      if (effSrc == 0) continue;
      final sa = effSrc >>> 24;
      final row = y * stride + x;
      final end = row + len;
      if (sa == 255) {
        if (canUseDst4 && len >= 8) {
          dst4 ??= Int32x4List.view(
            dst.buffer,
            dst.offsetInBytes,
            dst.length >>> 2,
          );
          final v4 = Int32x4(effSrc, effSrc, effSrc, effSrc);
          var p = row;
          final alignEnd = (p + 3) & ~3;
          while (p < alignEnd) {
            dst[p++] = effSrc;
          }
          var q = p >>> 2;
          final qEnd = end >>> 2;
          while (q < qEnd) {
            dst4[q++] = v4;
          }
          p = q << 2;
          while (p < end) {
            dst[p++] = effSrc;
          }
        } else {
          var p = row;
          final end4 = end - 3;
          while (p < end4) {
            dst[p] = effSrc;
            dst[p + 1] = effSrc;
            dst[p + 2] = effSrc;
            dst[p + 3] = effSrc;
            p += 4;
          }
          while (p < end) {
            dst[p++] = effSrc;
          }
        }
      } else {
        final ia = 255 - sa;
        if (fullSa == 255 && len == 1) {
          final d = dst[row];
          dst[row] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
        } else if (canUseDst64 && len >= 4) {
          dst64 ??= Uint64List.view(
            dst.buffer,
            dst.offsetInBytes,
            dst.length >>> 1,
          );
          _blendRun64(dst, dst64, row, end, effSrc, ia);
        } else {
          for (var p = row; p < end; p++) {
            final d = dst[p];
            dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
          }
        }
      }
    }
  }

  static void _blendRun64(
    Uint32List dst,
    Uint64List dst64,
    int row,
    int end,
    int effSrc,
    int ia,
  ) {
    var p = row;
    if ((p & 1) != 0) {
      final d = dst[p];
      dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
      p++;
    }
    var q = p >>> 1;
    final qEnd = end >>> 1;
    final effSrc64 = (effSrc << 32) | effSrc;
    const mask = (0x00FF00FF << 32) | 0x00FF00FF;
    const bias = (0x00800080 << 32) | 0x00800080;
    const agMask = (0xFF00FF00 << 32) | 0xFF00FF00;
    final qEnd2 = qEnd - 1;
    while (q < qEnd2) {
      final d0 = dst64[q];
      final d1 = dst64[q + 1];
      if ((d0 | d1) == 0) {
        dst64[q] = effSrc64;
        dst64[q + 1] = effSrc64;
        q += 2;
        continue;
      }
      final rb0 = (d0 & mask) * ia + bias;
      final rb1 = (d1 & mask) * ia + bias;
      final ag0 = ((d0 >>> 8) & mask) * ia + bias;
      final ag1 = ((d1 >>> 8) & mask) * ia + bias;
      final r0 = ((rb0 + ((rb0 >>> 8) & mask)) >>> 8) & mask;
      final r1 = ((rb1 + ((rb1 >>> 8) & mask)) >>> 8) & mask;
      final a0 = (ag0 + ((ag0 >>> 8) & mask)) & agMask;
      final a1 = (ag1 + ((ag1 >>> 8) & mask)) & agMask;
      dst64[q] = effSrc64 + (r0 | a0);
      dst64[q + 1] = effSrc64 + (r1 | a1);
      q += 2;
    }
    while (q < qEnd) {
      final d0 = dst64[q];
      if (d0 == 0) {
        dst64[q++] = effSrc64;
      } else {
        final rb0 = (d0 & mask) * ia + bias;
        final rb = ((rb0 + ((rb0 >>> 8) & mask)) >>> 8) & mask;
        final ag0 = ((d0 >>> 8) & mask) * ia + bias;
        final ag = (ag0 + ((ag0 >>> 8) & mask)) & agMask;
        dst64[q++] = effSrc64 + (rb | ag);
      }
    }
    p = q << 1;
    if (p < end) {
      final d = dst[p];
      dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
    }
  }

  static void _fillSolidRun(
    Uint32List dst,
    Int32x4List? dst4,
    Uint64List? dst64,
    int row,
    int len,
    int effSrc,
  ) {
    if (effSrc == 0 || len <= 0) return;
    final end = row + len;
    final sa = effSrc >>> 24;
    if (sa == 255) {
      if (dst4 != null && len >= 8) {
        var p = row;
        final alignEnd = (p + 3) & ~3;
        while (p < alignEnd) {
          dst[p++] = effSrc;
        }
        var q = p >>> 2;
        final qEnd = end >>> 2;
        final v4 = Int32x4(effSrc, effSrc, effSrc, effSrc);
        while (q < qEnd) {
          dst4[q++] = v4;
        }
        p = q << 2;
        while (p < end) {
          dst[p++] = effSrc;
        }
      } else {
        var p = row;
        final end4 = end - 3;
        while (p < end4) {
          dst[p] = effSrc;
          dst[p + 1] = effSrc;
          dst[p + 2] = effSrc;
          dst[p + 3] = effSrc;
          p += 4;
        }
        while (p < end) {
          dst[p++] = effSrc;
        }
      }
    } else {
      final ia = 255 - sa;
      if (dst64 != null && len >= 4) {
        _blendRun64(dst, dst64, row, end, effSrc, ia);
      } else {
        for (var p = row; p < end; p++) {
          final d = dst[p];
          dst[p] = d == 0 ? effSrc : _srcOverWithIa(effSrc, d, ia);
        }
      }
    }
  }

  static int _srcOverWithIa(int s, int d, int ia) {
    final rb0 = (d & 0x00FF00FF) * ia + 0x00800080;
    final rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    final ag0 = ((d >> 8) & 0x00FF00FF) * ia + 0x00800080;
    final ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return s + (rb | ag);
  }

  static void fillLinearGradientSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    RleSpans spans,
    Uint32List lut1024,
    int opacity255,
    double ia,
    double ib,
    double ic,
    double id,
    double itx,
    double ity,
    double sx,
    double sy,
    double ex,
    double ey,
  ) {
    if (opacity255 == 0 || spans.spanCount == 0) return;
    final gx = ex - sx;
    final gy = ey - sy;
    final lenSq = gx * gx + gy * gy;
    if (lenSq <= 1e-12) {
      var c = lut1024[0];
      if (opacity255 < 255) c = scalePremul255(c, opacity255);
      fillSolidSpans(dst, dstOriginX, dstOriginY, stride, spans, c);
      return;
    }
    final invLenSq = 1.0 / lenSq;
    final dtx = (ia * gx + ib * gy) * invLenSq;
    final count = spans.spanCount * 2;
    final data = spans.data;
    final fullOpacity = opacity255 >= 255;
    final cLoBase = fullOpacity
        ? lut1024[0]
        : scalePremul255(lut1024[0], opacity255);
    final cHiBase = fullOpacity
        ? lut1024[1023]
        : scalePremul255(lut1024[1023], opacity255);
    Int32x4List? dst4;
    Uint64List? dst64;

    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final wy = w0 >>> 16;
      final wx = w0 & 0xFFFF;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final py = wy + 0.5;
      final px = wx + 0.5;
      final lx = ia * px + ic * py + itx;
      final ly = ib * px + id * py + ity;
      var t = ((lx - sx) * gx + (ly - sy) * gy) * invLenSq;
      final row = (wy - dstOriginY) * stride + (wx - dstOriginX);

      // Entire span stays clamped at an endpoint: fill as a solid run.
      if (t <= 0.0 && dtx <= 0.0) {
        final eff = cov == 256 ? cLoBase : scalePremul(cLoBase, cov);
        if (!_isWeb) {
          if (dst4 == null && (dst.offsetInBytes & 15) == 0 && len >= 8) {
            dst4 = Int32x4List.view(
              dst.buffer,
              dst.offsetInBytes,
              dst.length >>> 2,
            );
          }
          if (dst64 == null && (dst.offsetInBytes & 7) == 0 && len >= 4) {
            dst64 = Uint64List.view(
              dst.buffer,
              dst.offsetInBytes,
              dst.length >>> 1,
            );
          }
        }
        _fillSolidRun(dst, dst4, dst64, row, len, eff);
        continue;
      }
      if (t >= 1.0 && dtx >= 0.0) {
        final eff = cov == 256 ? cHiBase : scalePremul(cHiBase, cov);
        if (!_isWeb) {
          if (dst4 == null && (dst.offsetInBytes & 15) == 0 && len >= 8) {
            dst4 = Int32x4List.view(
              dst.buffer,
              dst.offsetInBytes,
              dst.length >>> 2,
            );
          }
          if (dst64 == null && (dst.offsetInBytes & 7) == 0 && len >= 4) {
            dst64 = Uint64List.view(
              dst.buffer,
              dst.offsetInBytes,
              dst.length >>> 1,
            );
          }
        }
        _fillSolidRun(dst, dst4, dst64, row, len, eff);
        continue;
      }

      final end = row + len;
      var p = row;
      if (cov == 256 && fullOpacity) {
        final end4 = end - 3;
        while (p < end4) {
          final t0 = t;
          final t1 = t0 + dtx;
          final t2 = t1 + dtx;
          final t3 = t2 + dtx;
          t = t3 + dtx;
          final int i0, i1, i2, i3;
          if (t0 > 0.0 && t0 < 1.0 && t3 > 0.0 && t3 < 1.0) {
            i0 = (t0 * 1023.0 + 0.5).toInt();
            i1 = (t1 * 1023.0 + 0.5).toInt();
            i2 = (t2 * 1023.0 + 0.5).toInt();
            i3 = (t3 * 1023.0 + 0.5).toInt();
          } else {
            i0 = t0 <= 0.0
                ? 0
                : (t0 >= 1.0 ? 1023 : (t0 * 1023.0 + 0.5).toInt());
            i1 = t1 <= 0.0
                ? 0
                : (t1 >= 1.0 ? 1023 : (t1 * 1023.0 + 0.5).toInt());
            i2 = t2 <= 0.0
                ? 0
                : (t2 >= 1.0 ? 1023 : (t2 * 1023.0 + 0.5).toInt());
            i3 = t3 <= 0.0
                ? 0
                : (t3 >= 1.0 ? 1023 : (t3 * 1023.0 + 0.5).toInt());
          }
          final c0 = lut1024[i0];
          final c1 = lut1024[i1];
          final c2 = lut1024[i2];
          final c3 = lut1024[i3];
          if ((c0 & c1 & c2 & c3) >= 0xFF000000) {
            dst[p] = c0;
            dst[p + 1] = c1;
            dst[p + 2] = c2;
            dst[p + 3] = c3;
          } else {
            dst[p] = blendSrcOver(c0, dst[p]);
            dst[p + 1] = blendSrcOver(c1, dst[p + 1]);
            dst[p + 2] = blendSrcOver(c2, dst[p + 2]);
            dst[p + 3] = blendSrcOver(c3, dst[p + 3]);
          }
          p += 4;
        }
        while (p < end) {
          final clamped = t <= 0.0
              ? 0
              : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          dst[p] = blendSrcOver(lut1024[clamped], dst[p]);
          t += dtx;
          p++;
        }
      } else if (fullOpacity) {
        while (p < end) {
          final clamped = t <= 0.0
              ? 0
              : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          dst[p] = blendSrcOver(scalePremul(lut1024[clamped], cov), dst[p]);
          t += dtx;
          p++;
        }
      } else if (cov == 256) {
        while (p < end) {
          final clamped = t <= 0.0
              ? 0
              : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          dst[p] = blendSrcOver(
            scalePremul255(lut1024[clamped], opacity255),
            dst[p],
          );
          t += dtx;
          p++;
        }
      } else {
        while (p < end) {
          final clamped = t <= 0.0
              ? 0
              : (t >= 1.0 ? 1023 : (t * 1023.0 + 0.5).toInt());
          final c = scalePremul(
            scalePremul255(lut1024[clamped], opacity255),
            cov,
          );
          dst[p] = blendSrcOver(c, dst[p]);
          t += dtx;
          p++;
        }
      }
    }
  }

  static void fillRadialGradientSpans(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int stride,
    RleSpans spans,
    Uint32List lut1024,
    int opacity255,
    double ia,
    double ib,
    double ic,
    double id,
    double itx,
    double ity,
    double sx,
    double sy,
    double ex,
    double ey,
  ) {
    if (opacity255 == 0 || spans.spanCount == 0) return;
    final rx = ex - sx;
    final ry = ey - sy;
    final radius = math.max(0.001, math.sqrt(rx * rx + ry * ry));
    final invRadius = 1.0 / radius;
    // Normalize affine step into unit-radius space so t = sqrt(dSq) directly.
    final nia = ia * invRadius;
    final nib = ib * invRadius;
    final nic = ic * invRadius;
    final nid = id * invRadius;
    final nitx = (itx - sx) * invRadius;
    final nity = (ity - sy) * invRadius;
    final stepSq = nia * nia + nib * nib;
    final step2 = 2.0 * stepSq;
    final count = spans.spanCount * 2;
    final data = spans.data;
    final modulateAlpha = opacity255 < 255;
    final cEndRaw = lut1024[1023];
    final cEndOpaque = cEndRaw >= 0xFF000000;

    for (var i = 0; i < count; i += 2) {
      final w0 = data[i];
      final w1 = data[i + 1];
      final wy = w0 >>> 16;
      final wx = w0 & 0xFFFF;
      final len = w1 >>> 8;
      final cov = (w1 & 0xFF) + 1;
      final py = wy + 0.5;
      final px = wx + 0.5;
      final dx0 = nia * px + nic * py + nitx;
      final dy0 = nib * px + nid * py + nity;
      // 2nd-order forward differencing of D^2(k) = (dx0 + k*nia)^2 + (dy0 + k*nib)^2.
      var dSq = dx0 * dx0 + dy0 * dy0;
      var step1 = 2.0 * (dx0 * nia + dy0 * nib) + stepSq;
      final row = (wy - dstOriginY) * stride + (wx - dstOriginX);
      final end = row + len;
      var p = row;
      if (cov == 256 && !modulateAlpha) {
        final simdEnd = end - 3;
        while (p < simdEnd) {
          final s0 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s1 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s2 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s3 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          if (s0 >= 1.0 && s1 >= 1.0 && s2 >= 1.0 && s3 >= 1.0) {
            if (cEndOpaque) {
              dst[p] = cEndRaw;
              dst[p + 1] = cEndRaw;
              dst[p + 2] = cEndRaw;
              dst[p + 3] = cEndRaw;
            } else if (cEndRaw != 0) {
              dst[p] = blendSrcOver(cEndRaw, dst[p]);
              dst[p + 1] = blendSrcOver(cEndRaw, dst[p + 1]);
              dst[p + 2] = blendSrcOver(cEndRaw, dst[p + 2]);
              dst[p + 3] = blendSrcOver(cEndRaw, dst[p + 3]);
            }
            p += 4;
            continue;
          }
          final t4 = Float32x4(s0, s1, s2, s3).sqrt();
          final t0 = t4.x, t1 = t4.y, t2 = t4.z, t3 = t4.w;
          final c0 = lut1024[t0 >= 1.0 ? 1023 : (t0 * 1023.0 + 0.5).toInt()];
          final c1 = lut1024[t1 >= 1.0 ? 1023 : (t1 * 1023.0 + 0.5).toInt()];
          final c2 = lut1024[t2 >= 1.0 ? 1023 : (t2 * 1023.0 + 0.5).toInt()];
          final c3 = lut1024[t3 >= 1.0 ? 1023 : (t3 * 1023.0 + 0.5).toInt()];
          if ((c0 & c1 & c2 & c3) >= 0xFF000000) {
            dst[p] = c0;
            dst[p + 1] = c1;
            dst[p + 2] = c2;
            dst[p + 3] = c3;
          } else {
            dst[p] = blendSrcOver(c0, dst[p]);
            dst[p + 1] = blendSrcOver(c1, dst[p + 1]);
            dst[p + 2] = blendSrcOver(c2, dst[p + 2]);
            dst[p + 3] = blendSrcOver(c3, dst[p + 3]);
          }
          p += 4;
        }
        while (p < end) {
          final q = dSq > 0.0 ? dSq : 0.0;
          final clamped = q >= 1.0
              ? 1023
              : (math.sqrt(q) * 1023.0 + 0.5).toInt();
          dst[p] = blendSrcOver(lut1024[clamped], dst[p]);
          dSq += step1;
          step1 += step2;
          p++;
        }
      } else {
        final simdEnd = end - 3;
        while (p < simdEnd) {
          final s0 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s1 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s2 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          final s3 = dSq > 0.0 ? dSq : 0.0;
          dSq += step1;
          step1 += step2;
          int c0, c1, c2, c3;
          if (s0 >= 1.0 && s1 >= 1.0 && s2 >= 1.0 && s3 >= 1.0) {
            c0 = c1 = c2 = c3 = cEndRaw;
          } else {
            final t4 = Float32x4(s0, s1, s2, s3).sqrt();
            final t0 = t4.x, t1 = t4.y, t2 = t4.z, t3 = t4.w;
            c0 = lut1024[t0 >= 1.0 ? 1023 : (t0 * 1023.0 + 0.5).toInt()];
            c1 = lut1024[t1 >= 1.0 ? 1023 : (t1 * 1023.0 + 0.5).toInt()];
            c2 = lut1024[t2 >= 1.0 ? 1023 : (t2 * 1023.0 + 0.5).toInt()];
            c3 = lut1024[t3 >= 1.0 ? 1023 : (t3 * 1023.0 + 0.5).toInt()];
          }
          if (modulateAlpha) {
            c0 = scalePremul255(c0, opacity255);
            c1 = scalePremul255(c1, opacity255);
            c2 = scalePremul255(c2, opacity255);
            c3 = scalePremul255(c3, opacity255);
          }
          if (cov < 256) {
            c0 = scalePremul(c0, cov);
            c1 = scalePremul(c1, cov);
            c2 = scalePremul(c2, cov);
            c3 = scalePremul(c3, cov);
          }
          dst[p] = blendSrcOver(c0, dst[p]);
          dst[p + 1] = blendSrcOver(c1, dst[p + 1]);
          dst[p + 2] = blendSrcOver(c2, dst[p + 2]);
          dst[p + 3] = blendSrcOver(c3, dst[p + 3]);
          p += 4;
        }
        while (p < end) {
          final q = dSq > 0.0 ? dSq : 0.0;
          final clamped = q >= 1.0
              ? 1023
              : (math.sqrt(q) * 1023.0 + 0.5).toInt();
          var c = lut1024[clamped];
          if (modulateAlpha) c = scalePremul255(c, opacity255);
          if (cov < 256) c = scalePremul(c, cov);
          dst[p] = blendSrcOver(c, dst[p]);
          dSq += step1;
          step1 += step2;
          p++;
        }
      }
    }
  }

  // Round x / 255 without integer division (0 <= x <= 255 * 255).
  static int div255(int x) {
    final biased = x + 128;
    return (biased + (biased >> 8)) >> 8;
  }

  static int _blendChannel(int sc, int dc, int sa, int da, int mode) {
    // Keep the entire premultiplied result in a single numerator, so rounding
    // happens once. These are the blend equations in premultiplied form.
    final linear = sc * (255 - da) + dc * (255 - sa);
    final overlap = switch (mode) {
      1 => sc * dc,
      3 => 2 * dc <= da ? 2 * sc * dc : sa * da - 2 * (sa - sc) * (da - dc),
      4 => math.min(sc * da, dc * sa),
      5 => math.max(sc * da, dc * sa),
      8 => 2 * sc <= sa ? 2 * sc * dc : sa * da - 2 * (sa - sc) * (da - dc),
      10 => (sc * da - dc * sa).abs(),
      11 => sc * da + dc * sa - 2 * sc * dc,
      _ => sc * da,
    };
    return div255(linear + overlap);
  }

  static int blendPixel(int src, int dst, int mode) {
    if (src == 0) return dst;
    if (dst == 0) return src;

    final sa = src >>> 24, da = dst >>> 24;
    final sr = (src >>> 16) & 255, dr = (dst >>> 16) & 255;
    final sg = (src >>> 8) & 255, dg = (dst >>> 8) & 255;
    final sb = src & 255, db = dst & 255;

    if (mode == 16) {
      return (math.min(255, sa + da) << 24) |
          (math.min(255, sr + dr) << 16) |
          (math.min(255, sg + dg) << 8) |
          math.min(255, sb + db);
    }
    final a = sa + da - div255(sa * da);
    if (usesAdvancedBlend(mode)) {
      return _advancedBlend(sr, sg, sb, dr, dg, db, sa, da, a, mode);
    }
    if (mode == 2) {
      // Screen simplifies to s + d - s*d for premultiplied channels.
      return (a << 24) |
          ((sr + dr - div255(sr * dr)) << 16) |
          ((sg + dg - div255(sg * dg)) << 8) |
          (sb + db - div255(sb * db));
    }
    return (a << 24) |
        (_blendChannel(sr, dr, sa, da, mode) << 16) |
        (_blendChannel(sg, dg, sa, da, mode) << 8) |
        _blendChannel(sb, db, sa, da, mode);
  }

  // W3C Compositing and Blending Level 1, §10. The overlap color is
  // computed in straight RGB; the result is composed in premultiplied RGB.
  static bool usesAdvancedBlend(int mode) =>
      mode == 6 || mode == 7 || mode == 9 || (mode >= 12 && mode <= 15);

  static int _advancedBlend(
    int sr,
    int sg,
    int sb,
    int dr,
    int dg,
    int db,
    int sa,
    int da,
    int alpha,
    int mode,
  ) {
    final s = (sr / sa, sg / sa, sb / sa);
    final d = (dr / da, dg / da, db / da);
    final (r, g, b) = switch (mode) {
      12 => _setLum(_setSat(s, _sat(d)), _lum(d)),
      13 => _setLum(_setSat(d, _sat(s)), _lum(d)),
      14 => _setLum(s, _lum(d)),
      15 => _setLum(d, _lum(s)),
      _ => (
        _advancedChannel(d.$1, s.$1, mode),
        _advancedChannel(d.$2, s.$2, mode),
        _advancedChannel(d.$3, s.$3, mode),
      ),
    };
    int premul(int s, int d, double overlap) =>
        ((s * (255 - da) + d * (255 - sa) + sa * da * overlap) / 255)
            .round()
            .clamp(0, alpha);
    return (alpha << 24) |
        (premul(sr, dr, r) << 16) |
        (premul(sg, dg, g) << 8) |
        premul(sb, db, b);
  }

  static double _advancedChannel(double d, double s, int mode) {
    if (mode == 6) return d == 0 ? 0 : (s == 1 ? 1 : math.min(1, d / (1 - s)));
    if (mode == 7) {
      return d == 1 ? 1 : (s == 0 ? 0 : 1 - math.min(1, (1 - d) / s));
    }
    if (s <= .5) return d - (1 - 2 * s) * d * (1 - d);
    final curve = d <= .25 ? ((16 * d - 12) * d + 4) * d : math.sqrt(d);
    return d + (2 * s - 1) * (curve - d);
  }

  static double _lum((double, double, double) c) =>
      .3 * c.$1 + .59 * c.$2 + .11 * c.$3;

  static double _sat((double, double, double) c) =>
      math.max(c.$1, math.max(c.$2, c.$3)) -
      math.min(c.$1, math.min(c.$2, c.$3));

  static (double, double, double) _setSat(
    (double, double, double) c,
    double sat,
  ) {
    final low = math.min(c.$1, math.min(c.$2, c.$3));
    final span = _sat(c);
    if (span == 0) return (0, 0, 0);
    return (
      (c.$1 - low) * sat / span,
      (c.$2 - low) * sat / span,
      (c.$3 - low) * sat / span,
    );
  }

  static (double, double, double) _setLum(
    (double, double, double) c,
    double lum,
  ) {
    final delta = lum - _lum(c);
    final low = math.min(c.$1, math.min(c.$2, c.$3)) + delta;
    final high = math.max(c.$1, math.max(c.$2, c.$3)) + delta;
    double clip(double v) {
      v += delta;
      if (low < 0) v = lum + (v - lum) * lum / (lum - low);
      if (high > 1) v = lum + (v - lum) * (1 - lum) / (high - lum);
      return v;
    }

    return (clip(c.$1), clip(c.$2), clip(c.$3));
  }

  static int _blendMultiply(int src, int dst) {
    if (src == 0) return dst;
    if (dst == 0) return src;
    final sa = src >>> 24, da = dst >>> 24;
    final invSa = 255 - sa, invDa = 255 - da;
    final sr = (src >>> 16) & 255, dr = (dst >>> 16) & 255;
    final sg = (src >>> 8) & 255, dg = (dst >>> 8) & 255;
    final sb = src & 255, db = dst & 255;
    final a = sa + da - div255(sa * da);
    final r = div255(sr * invDa + dr * invSa + sr * dr);
    final g = div255(sg * invDa + dg * invSa + sg * dg);
    final b = div255(sb * invDa + db * invSa + sb * db);
    return (a << 24) | (r << 16) | (g << 8) | b;
  }

  static int _blendScreen(int src, int dst) {
    if (src == 0) return dst;
    if (dst == 0) return src;
    final sa = src >>> 24, da = dst >>> 24;
    final sr = (src >>> 16) & 255, dr = (dst >>> 16) & 255;
    final sg = (src >>> 8) & 255, dg = (dst >>> 8) & 255;
    final sb = src & 255, db = dst & 255;
    return ((sa + da - div255(sa * da)) << 24) |
        ((sr + dr - div255(sr * dr)) << 16) |
        ((sg + dg - div255(sg * dg)) << 8) |
        (sb + db - div255(sb * db));
  }

  static void blendSolidSpans(
    Uint32List dst,
    int originX,
    int originY,
    int stride,
    RleSpans spans,
    int color,
    int mode,
    NativePixelBuffer? nativeDst,
  ) {
    if (color == 0) return;
    if (nativeDst != null &&
        !usesAdvancedBlend(mode) &&
        nativeBlendSolid(
          nativeDst,
          originX,
          originY,
          stride,
          spans.buffer,
          spans.spanCount,
          color,
          mode,
        )) {
      return;
    }
    final data = spans.data;
    final count = spans.spanCount * 2;
    var prevSrc = 0, prevDst = 0, result = 0;
    if (mode == 1) {
      for (var i = 0; i < count; i += 2) {
        final xy = data[i], run = data[i + 1];
        final src = scalePremul(color, (run & 255) + 1);
        if (src == 0) continue;
        final start = ((xy >>> 16) - originY) * stride + (xy & 65535) - originX;
        final end = start + (run >>> 8);
        for (var p = start; p < end; p++) {
          final d = dst[p];
          if (src != prevSrc || d != prevDst) {
            prevSrc = src;
            prevDst = d;
            result = _blendMultiply(src, d);
          }
          dst[p] = result;
        }
      }
      return;
    }
    if (mode == 2) {
      for (var i = 0; i < count; i += 2) {
        final xy = data[i], run = data[i + 1];
        final src = scalePremul(color, (run & 255) + 1);
        if (src == 0) continue;
        final start = ((xy >>> 16) - originY) * stride + (xy & 65535) - originX;
        final end = start + (run >>> 8);
        for (var p = start; p < end; p++) {
          final d = dst[p];
          if (src != prevSrc || d != prevDst) {
            prevSrc = src;
            prevDst = d;
            result = _blendScreen(src, d);
          }
          dst[p] = result;
        }
      }
      return;
    }
    for (var i = 0; i < count; i += 2) {
      final xy = data[i], run = data[i + 1];
      final src = scalePremul(color, (run & 255) + 1);
      if (src == 0) continue;
      final start = ((xy >>> 16) - originY) * stride + (xy & 65535) - originX;
      final end = start + (run >>> 8);
      for (var p = start; p < end; p++) {
        final d = dst[p];
        if (src != prevSrc || d != prevDst) {
          prevSrc = src;
          prevDst = d;
          result = blendPixel(src, d, mode);
        }
        dst[p] = result;
      }
    }
  }

  static void compositeBlended(
    Uint32List dst,
    int dstOriginX,
    int dstOriginY,
    int dstStride,
    Uint32List src,
    int srcOriginX,
    int srcOriginY,
    int srcStride,
    int w,
    int h,
    int blendMode,
  ) {
    // Solid shapes and RLE interiors frequently repeat the same pixel pair.
    // Reuse the last result across runs and rows without allocating a LUT.
    var prevSrc = 0, prevDst = 0, result = 0;
    var dstRow = dstOriginY * dstStride + dstOriginX;
    var srcRow = srcOriginY * srcStride + srcOriginX;
    if (blendMode == 1) {
      for (var y = 0; y < h; y++, dstRow += dstStride, srcRow += srcStride) {
        for (var x = 0; x < w; x++) {
          final s = src[srcRow + x];
          if (s == 0) continue;
          final d = dst[dstRow + x];
          if (d == 0) {
            dst[dstRow + x] = s;
            continue;
          }
          if (s != prevSrc || d != prevDst) {
            prevSrc = s;
            prevDst = d;
            result = _blendMultiply(s, d);
          }
          dst[dstRow + x] = result;
        }
      }
      return;
    }
    if (blendMode == 2) {
      for (var y = 0; y < h; y++, dstRow += dstStride, srcRow += srcStride) {
        for (var x = 0; x < w; x++) {
          final s = src[srcRow + x];
          if (s == 0) continue;
          final d = dst[dstRow + x];
          if (d == 0) {
            dst[dstRow + x] = s;
            continue;
          }
          if (s != prevSrc || d != prevDst) {
            prevSrc = s;
            prevDst = d;
            result = _blendScreen(s, d);
          }
          dst[dstRow + x] = result;
        }
      }
      return;
    }
    for (var y = 0; y < h; y++, dstRow += dstStride, srcRow += srcStride) {
      for (var x = 0; x < w; x++) {
        final s = src[srcRow + x];
        if (s == 0) continue;
        final d = dst[dstRow + x];
        if (d == 0) {
          dst[dstRow + x] = s;
          continue;
        }
        if (s != prevSrc || d != prevDst) {
          prevSrc = s;
          prevDst = d;
          result = blendPixel(s, d, blendMode);
        }
        dst[dstRow + x] = result;
      }
    }
  }
}
