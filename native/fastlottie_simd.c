#include <math.h>
#include <stdint.h>
#include <string.h>

#if defined(__ARM_NEON) || defined(__ARM_NEON__)
#include <arm_neon.h>
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
#include <emmintrin.h>
#endif

#if defined(_WIN32)
#define FL_EXPORT __declspec(dllexport)
#else
#define FL_EXPORT __attribute__((visibility("default")))
#endif

static inline uint32_t scale_premul(uint32_t premul, uint32_t factor256) {
    if (factor256 >= 256) return premul;
    if (factor256 <= 0 || premul == 0) return 0;
    uint32_t rb = ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
    uint32_t ag = ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
    return rb | ag;
}

static inline uint32_t scale_premul_255(uint32_t premul, uint32_t factor255) {
    if (factor255 >= 255) return premul;
    if (factor255 <= 0 || premul == 0) return 0;
    uint32_t rb0 = (premul & 0x00FF00FF) * factor255 + 0x00800080;
    uint32_t rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    uint32_t ag0 = ((premul >> 8) & 0x00FF00FF) * factor255 + 0x00800080;
    uint32_t ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return rb | ag;
}

static inline uint32_t src_over_ia(uint32_t s, uint32_t d, uint32_t ia) {
    uint32_t rb0 = (d & 0x00FF00FF) * ia + 0x00800080;
    uint32_t rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
    uint32_t ag0 = ((d >> 8) & 0x00FF00FF) * ia + 0x00800080;
    uint32_t ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
    return s + (rb | ag);
}

static inline uint32_t blend_src_over(uint32_t s, uint32_t d) {
    if (s == 0) return d;
    uint32_t sa = s >> 24;
    if (sa == 255 || d == 0) return s;
    return src_over_ia(s, d, 255 - sa);
}

FL_EXPORT void fastlottie_clear_pixels(uint32_t* dst, int32_t count) {
    if (dst && count > 0) {
        memset(dst, 0, (size_t)count * sizeof(uint32_t));
    }
}

FL_EXPORT void fastlottie_fill_solid_spans(
    uint32_t* dst,
    int32_t dstOriginX,
    int32_t dstOriginY,
    int32_t stride,
    const int32_t* data,
    int32_t spanCount,
    uint32_t srcPremul
) {
    if (!dst || !data || spanCount <= 0 || srcPremul == 0) return;

    const int32_t total = spanCount * 2;
    for (int32_t i = 0; i < total; i += 2) {
        uint32_t w0 = (uint32_t)data[i];
        uint32_t w1 = (uint32_t)data[i + 1];

        int32_t y = (int32_t)(w0 >> 16) - dstOriginY;
        int32_t x = (int32_t)(w0 & 0xFFFF) - dstOriginX;
        int32_t len = (int32_t)(w1 >> 8);
        uint32_t cov = (w1 & 0xFF) + 1;

        uint32_t effSrc = cov == 256 ? srcPremul : scale_premul(srcPremul, cov);
        if (effSrc == 0) continue;

        uint32_t sa = effSrc >> 24;
        uint32_t* row = dst + ((int64_t)y * stride + x);

        if (sa == 255) {
            int32_t p = 0;
#if defined(__ARM_NEON)
            uint32x4_t val4 = vdupq_n_u32(effSrc);
            for (; p <= len - 4; p += 4) {
                vst1q_u32(row + p, val4);
            }
#elif defined(__SSE2__) || defined(_M_X64)
            __m128i val4 = _mm_set1_epi32((int)effSrc);
            for (; p <= len - 4; p += 4) {
                _mm_storeu_si128((__m128i*)(row + p), val4);
            }
#endif
            for (; p < len; p++) {
                row[p] = effSrc;
            }
        } else {
            uint32_t ia = 255 - sa;
            int32_t p = 0;
#if defined(__ARM_NEON)
            if (len >= 4) {
                uint8x16_t s16 = vreinterpretq_u8_u32(vdupq_n_u32(effSrc));
                uint8x8_t ia8 = vdup_n_u8((uint8_t)ia);
                uint16x8_t c128 = vdupq_n_u16(128);

                for (; p <= len - 4; p += 4) {
                    uint8x16_t d16 = vld1q_u8((const uint8_t*)(row + p));
                    
                    uint16x8_t prod_lo = vmlal_u8(c128, vget_low_u8(d16), ia8);
                    uint16x8_t prod_hi = vmlal_u8(c128, vget_high_u8(d16), ia8);

                    uint16x8_t term_lo = vaddq_u16(prod_lo, vshrq_n_u16(prod_lo, 8));
                    uint16x8_t term_hi = vaddq_u16(prod_hi, vshrq_n_u16(prod_hi, 8));

                    uint8x8_t res_lo = vshrn_n_u16(term_lo, 8);
                    uint8x8_t res_hi = vshrn_n_u16(term_hi, 8);

                    uint8x16_t out16 = vaddq_u8(s16, vcombine_u8(res_lo, res_hi));
                    vst1q_u8((uint8_t*)(row + p), out16);
                }
            }
#elif defined(__SSE2__) || defined(_M_X64)
            if (len >= 4) {
                __m128i s16 = _mm_set1_epi32((int)effSrc);
                __m128i ia16 = _mm_set1_epi16((short)ia);
                __m128i c128 = _mm_set1_epi16(128);
                __m128i zero = _mm_setzero_si128();

                for (; p <= len - 4; p += 4) {
                    __m128i d16 = _mm_loadu_si128((const __m128i*)(row + p));
                    __m128i d_lo = _mm_unpacklo_epi8(d16, zero);
                    __m128i d_hi = _mm_unpackhi_epi8(d16, zero);

                    __m128i prod_lo = _mm_add_epi16(_mm_mullo_epi16(d_lo, ia16), c128);
                    __m128i prod_hi = _mm_add_epi16(_mm_mullo_epi16(d_hi, ia16), c128);

                    __m128i term_lo = _mm_add_epi16(prod_lo, _mm_srli_epi16(prod_lo, 8));
                    __m128i term_hi = _mm_add_epi16(prod_hi, _mm_srli_epi16(prod_hi, 8));

                    __m128i res_lo = _mm_srli_epi16(term_lo, 8);
                    __m128i res_hi = _mm_srli_epi16(term_hi, 8);

                    __m128i res8 = _mm_packus_epi16(res_lo, res_hi);
                    __m128i out16 = _mm_add_epi8(s16, res8);
                    _mm_storeu_si128((__m128i*)(row + p), out16);
                }
            }
#endif
            for (; p < len; p++) {
                uint32_t d = row[p];
                row[p] = (d == 0) ? effSrc : src_over_ia(effSrc, d, ia);
            }
        }
    }
}

FL_EXPORT void fastlottie_composite_matte(
    uint32_t* dst,
    int32_t dstOriginX,
    int32_t dstOriginY,
    int32_t dstStride,
    const uint32_t* layerBuf,
    const uint32_t* matteBuf,
    int32_t bw,
    int32_t bh,
    int32_t bx0,
    int32_t by0,
    int32_t isDstOut,
    int32_t isLuma,
    const uint32_t* invAlphaLut
) {
    if (!dst || !layerBuf || !matteBuf || bw <= 0 || bh <= 0) return;

    for (int32_t row = 0; row < bh; row++) {
        int64_t srcRow = (int64_t)row * bw;
        int64_t dstRow = ((int64_t)(by0 + row - dstOriginY) * dstStride) + (bx0 - dstOriginX);

        for (int32_t col = 0; col < bw; col++) {
            uint32_t tPx = layerBuf[srcRow + col];
            if (tPx == 0) continue;

            uint32_t mPx = matteBuf[srcRow + col];
            uint32_t mAlpha = mPx >> 24;
            int32_t factor;

            if (!isLuma) {
                factor = isDstOut ? (255 - mAlpha) : mAlpha;
            } else {
                if (mAlpha == 0) {
                    factor = isDstOut ? 255 : 0;
                } else {
                    uint32_t r = (mPx >> 16) & 0xFF;
                    uint32_t g = (mPx >> 8) & 0xFF;
                    uint32_t b = mPx & 0xFF;
                    if (mAlpha != 255 && invAlphaLut) {
                        uint32_t inv = invAlphaLut[mAlpha];
                        r = (r * inv) >> 16;
                        g = (g * inv) >> 16;
                        b = (b * inv) >> 16;
                    }
                    uint32_t lum = (19595 * r + 38470 * g + 7471 * b) >> 16;
                    if (lum > 255) lum = 255;
                    factor = isDstOut ? (255 - lum) : lum;
                }
            }

            if (factor <= 0) continue;
            uint32_t masked = (factor >= 255) ? tPx : scale_premul_255(tPx, factor);
            dst[dstRow + col] = blend_src_over(masked, dst[dstRow + col]);
        }
    }
}

/* Keep these integer equations in sync with _SwarBlender.blendPixel. */
static inline uint32_t blend_div255(uint32_t x) {
    x += 128;
    return (x + (x >> 8)) >> 8;
}

static inline uint32_t blend_channel(int sc, int dc, int sa, int da, int mode) {
    const int linear = sc * (255 - da) + dc * (255 - sa);
    const int s = sc * da, d = dc * sa, product = sc * dc;
    int overlap;
    switch (mode) {
        case 1: overlap = product; break;
        case 3:
        case 8:
            overlap = (mode == 3 ? 2 * dc <= da : 2 * sc <= sa)
                ? 2 * product : sa * da - 2 * (sa - sc) * (da - dc);
            break;
        case 4: overlap = s < d ? s : d; break;
        case 5: overlap = s > d ? s : d; break;
        case 10: overlap = s > d ? s - d : d - s; break;
        case 11: overlap = s + d - 2 * product; break;
        default: overlap = s; break;
    }
    return blend_div255((uint32_t)(linear + overlap));
}

static inline uint32_t blend_sat255(uint32_t x) { return x > 255 ? 255 : x; }

/* Hard Inner Shadow. src is a tightly packed, isolated layer plane.
 * Only RGB changes, so an in-place call may still read the original alpha. */
FL_EXPORT void fastlottie_inner_shadow(
    uint32_t* dst, int32_t dst_offset, int32_t dst_stride,
    const uint32_t* src, int32_t sw, int32_t sh,
    int32_t x0, int32_t y0, int32_t w, int32_t h,
    int32_t step_x, int32_t step_y, int32_t wx, int32_t wy,
    uint32_t tint, uint32_t opacity
) {
    const uint32_t r = (tint >> 16) & 255, g = (tint >> 8) & 255, b = tint & 255;
    for (int y = 0; y < h; ++y) {
        const int ya = y0 + y + step_y, yb = ya + 1;
        const uint32_t* a = ya >= 0 && ya < sh ? src + ya * sw : NULL;
        const uint32_t* b_row = yb >= 0 && yb < sh ? src + yb * sw : NULL;
        const uint32_t* base = src + (y0 + y) * sw + x0;
        uint32_t* out = dst + dst_offset + y * dst_stride;
        for (int x = 0; x < w; ++x) {
            uint32_t p = base[x];
            if (!p) continue;
            const int xa = x0 + x + step_x, xb = xa + 1;
            const int va = xa >= 0 && xa < sw, vb = xb >= 0 && xb < sw;
            const uint32_t aa = a && va ? a[xa] >> 24 : 0;
            const uint32_t ab = a && vb ? a[xb] >> 24 : 0;
            const uint32_t ba = b_row && va ? b_row[xa] >> 24 : 0;
            const uint32_t bb = b_row && vb ? b_row[xb] >> 24 : 0;
            if ((aa & ab & ba & bb) != 255) {
                const uint32_t edge = 255 - ((
                    (aa * (256 - wx) + ab * wx) * (256 - wy) +
                    (ba * (256 - wx) + bb * wx) * wy + 32768) >> 16);
                if (edge) {
                    p = (p & 0xff000000) |
                        (blend_div255(((p >> 16) & 255) * (255 - blend_div255(r * edge))) << 16) |
                        (blend_div255(((p >> 8) & 255) * (255 - blend_div255(g * edge))) << 8) |
                        blend_div255((p & 255) * (255 - blend_div255(b * edge)));
                }
            }
            out[x] = src == dst ? p : blend_src_over(scale_premul_255(p, opacity), out[x]);
        }
    }
}

static inline uint32_t blend_pixel(uint32_t src, uint32_t dst, int mode) {
    if (src == 0) return dst;
    if (dst == 0) return src;
    const uint32_t sa = src >> 24, da = dst >> 24;
    const uint32_t sr = (src >> 16) & 255, dr = (dst >> 16) & 255;
    const uint32_t sg = (src >> 8) & 255, dg = (dst >> 8) & 255;
    const uint32_t sb = src & 255, db = dst & 255;
    if (mode == 16) {
        return (blend_sat255(sa + da) << 24) |
            (blend_sat255(sr + dr) << 16) |
            (blend_sat255(sg + dg) << 8) | blend_sat255(sb + db);
    }
    const uint32_t a = sa + da - blend_div255(sa * da);
    if (mode == 2) {
        return (a << 24) |
            ((sr + dr - blend_div255(sr * dr)) << 16) |
            ((sg + dg - blend_div255(sg * dg)) << 8) |
            (sb + db - blend_div255(sb * db));
    }
    return (a << 24) |
        (blend_channel(sr, dr, sa, da, mode) << 16) |
        (blend_channel(sg, dg, sa, da, mode) << 8) |
        blend_channel(sb, db, sa, da, mode);
}

FL_EXPORT void fastlottie_blend_rect(
    uint32_t *dst, int32_t dst_offset, int32_t dst_stride,
    const uint32_t *src, int32_t width, int32_t height, int32_t mode
) {
#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
    if (mode == 1) {
        const uint8_t indices[16] = {3,3,3,3, 7,7,7,7, 11,11,11,11, 15,15,15,15};
        const uint8x16_t alpha_indices = vld1q_u8(indices);
        const uint16x8_t bias = vdupq_n_u16(128);
        for (int y = 0; y < height; ++y) {
            uint32_t *d = dst + dst_offset + (int64_t)y * dst_stride;
            const uint32_t *s = src + (int64_t)y * width;
            int x = 0;
            for (; x <= width - 4; x += 4) {
                const uint8x16_t a = vreinterpretq_u8_u32(vld1q_u32(s + x));
                const uint8x16_t b = vreinterpretq_u8_u32(vld1q_u32(d + x));
                const uint8x16_t inv_sa = vmvnq_u8(vqtbl1q_u8(a, alpha_indices));
                const uint8x16_t inv_da = vmvnq_u8(vqtbl1q_u8(b, alpha_indices));
                const uint8x8_t al = vget_low_u8(a), ah = vget_high_u8(a);
                const uint8x8_t bl = vget_low_u8(b), bh = vget_high_u8(b);
                uint16x8_t lo = vmlal_u8(bias, al, bl);
                uint16x8_t hi = vmlal_u8(bias, ah, bh);
                lo = vmlal_u8(lo, al, vget_low_u8(inv_da));
                hi = vmlal_u8(hi, ah, vget_high_u8(inv_da));
                lo = vmlal_u8(lo, bl, vget_low_u8(inv_sa));
                hi = vmlal_u8(hi, bh, vget_high_u8(inv_sa));
                lo = vaddq_u16(lo, vshrq_n_u16(lo, 8));
                hi = vaddq_u16(hi, vshrq_n_u16(hi, 8));
                const uint8x16_t result =
                    vcombine_u8(vshrn_n_u16(lo, 8), vshrn_n_u16(hi, 8));
                vst1q_u32(d + x, vreinterpretq_u32_u8(result));
            }
            for (; x < width; ++x) d[x] = blend_pixel(s[x], d[x], 1);
        }
        return;
    }
#endif
#if defined(__ARM_NEON) || defined(__ARM_NEON__)
    // For Screen, the same premultiplied equation applies to all four
    // channels, including alpha, so blend four BGRA pixels at a time.
    if (mode == 2) {
        const uint16x8_t bias = vdupq_n_u16(128);
        for (int y = 0; y < height; ++y) {
            uint32_t *d = dst + dst_offset + (int64_t)y * dst_stride;
            const uint32_t *s = src + (int64_t)y * width;
            int x = 0;
            for (; x <= width - 4; x += 4) {
                const uint8x16_t a = vreinterpretq_u8_u32(vld1q_u32(s + x));
                const uint8x16_t b = vreinterpretq_u8_u32(vld1q_u32(d + x));
                uint16x8_t lo = vmlal_u8(bias, vget_low_u8(a), vget_low_u8(b));
                uint16x8_t hi = vmlal_u8(bias, vget_high_u8(a), vget_high_u8(b));
                lo = vaddq_u16(lo, vshrq_n_u16(lo, 8));
                hi = vaddq_u16(hi, vshrq_n_u16(hi, 8));
                const uint8x16_t product =
                    vcombine_u8(vshrn_n_u16(lo, 8), vshrn_n_u16(hi, 8));
                const uint8x16_t result = vsubq_u8(vaddq_u8(a, b), product);
                vst1q_u32(d + x, vreinterpretq_u32_u8(result));
            }
            for (; x < width; ++x) d[x] = blend_pixel(s[x], d[x], 2);
        }
        return;
    }
#endif
    uint32_t prev_src = 0, prev_dst = 0, result = 0;
    for (int y = 0; y < height; ++y) {
        uint32_t *dst_row = dst + dst_offset + (int64_t)y * dst_stride;
        const uint32_t *src_row = src + (int64_t)y * width;
        for (int x = 0; x < width; ++x) {
            const uint32_t s = src_row[x];
            if (s == 0) continue;
            const uint32_t d = dst_row[x];
            if (s != prev_src || d != prev_dst) {
                prev_src = s;
                prev_dst = d;
                result = blend_pixel(s, d, mode);
            }
            dst_row[x] = result;
        }
    }
}

FL_EXPORT void fastlottie_blend_solid(
    uint32_t *dst, int32_t origin_x, int32_t origin_y, int32_t stride,
    const int32_t *spans, int32_t count, uint32_t color, int32_t mode
) {
    uint32_t prev_src = 0, prev_dst = 0, result = 0;
    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const uint32_t s = scale_premul(color, (run & 255) + 1);
        if (s == 0) continue;
        const int y = (int)(xy >> 16) - origin_y;
        const int x = (int)(xy & 65535) - origin_x;
        uint32_t *row = dst + (int64_t)y * stride + x;
        for (uint32_t p = 0; p < (run >> 8); ++p) {
            const uint32_t d = row[p];
            if (s != prev_src || d != prev_dst) {
                prev_src = s;
                prev_dst = d;
                result = blend_pixel(s, d, mode);
            }
            row[p] = result;
        }
    }
}

/* Dart's radial loop uses float32 sqrt for groups of four, and double
 * precision for the tail. Preserve that rounding and the span phase here. */
static inline uint32_t gradient_sample(
    const uint32_t *lut, double t, uint32_t opacity, uint32_t coverage
) {
    // Treat non-finite transform results safely before converting to an index.
    const int index = !(t > 0) ? 0 : t >= 1 ? 1023 : (int)(t * 1023.0 + 0.5);
    uint32_t src = lut[index];
    if (opacity != 255) src = scale_premul_255(src, opacity);
    if (coverage != 256) src = scale_premul(src, coverage);
    return src;
}

/* Specialize Multiply so the compiler folds its blend-mode switches
 * outside the pixel loop. Other modes keep the shared sampling loop. */
#if defined(__clang__) || defined(__GNUC__)
#define FL_GRAD_INLINE __attribute__((always_inline)) inline
#else
#define FL_GRAD_INLINE inline
#endif
static inline uint32_t gradient_multiply(uint32_t s, uint32_t d) {
    if (s == 0) return d;
    if (d == 0) return s;
    const uint32_t sa = s >> 24, da = d >> 24;
    const uint32_t a = sa + da - blend_div255(sa * da);
    return (a << 24) |
        (blend_channel((s >> 16) & 255, (d >> 16) & 255, sa, da, 1) << 16) |
        (blend_channel((s >> 8) & 255, (d >> 8) & 255, sa, da, 1) << 8) |
        blend_channel(s & 255, d & 255, sa, da, 1);
}

static FL_GRAD_INLINE void gradient_store(
    uint32_t *dst, uint32_t src, int mode, int specialize_multiply
) {
    *dst = specialize_multiply ? gradient_multiply(src, *dst) :
        mode == 0 ? blend_src_over(src, *dst) : blend_pixel(src, *dst, mode);
}

static FL_GRAD_INLINE void gradient_spans_impl(
    uint32_t *dst, int32_t ox, int32_t oy, int32_t stride,
    const int32_t *spans, int32_t count, const uint32_t *lut,
    uint32_t opacity, int32_t mode, int32_t radial, int specialize_multiply,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    if (count <= 0 || opacity == 0) return;

    const double gx = ex - sx, gy = ey - sy;
    const double len_sq = gx * gx + gy * gy;
    const double inv_len_sq = !radial && len_sq > 1e-12 ? 1.0 / len_sq : 0;
    const double dtx = (ia * gx + ib * gy) * inv_len_sq;
    double nia = 0, nib = 0, nic = 0, nid = 0, nitx = 0, nity = 0, step_sq = 0;
    if (radial) {
        const double radius = sqrt(len_sq);
        const double inv = 1.0 / (radius > .001 ? radius : .001);
        nia = ia * inv;
        nib = ib * inv;
        nic = ic * inv;
        nid = id * inv;
        nitx = (itx - sx) * inv;
        nity = (ity - sy) * inv;
        step_sq = nia * nia + nib * nib;
    }
    const double step2 = 2.0 * step_sq;

    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const int x = xy & 65535, y = xy >> 16;
        const int len = run >> 8;
        const uint32_t cov = (run & 255) + 1;
        uint32_t *row = dst + (int64_t)(y - oy) * stride + x - ox;
        const double px = x + .5, py = y + .5;
        if (!radial) {
            double t = 0;
            if (inv_len_sq != 0) {
                const double lx = ia * px + ic * py + itx;
                const double ly = ib * px + id * py + ity;
                t = ((lx - sx) * gx + (ly - sy) * gy) * inv_len_sq;
            }
            for (int j = 0; j < len; ++j) {
                gradient_store(row + j, gradient_sample(lut, t, opacity, cov), mode, specialize_multiply);
                t += dtx;
            }
        } else {
            const double dx = nia * px + nic * py + nitx;
            const double dy = nib * px + nid * py + nity;
            double dsq = dx * dx + dy * dy;
            double step1 = 2.0 * (dx * nia + dy * nib) + step_sq;
            const int vector_end = len & ~3;
            for (int j = 0; j < len; ++j) {
                const double q = dsq > 0 ? dsq : 0;
                const double t = q >= 1 ? 1 : j < vector_end ? sqrtf((float)q) : sqrt(q);
                gradient_store(row + j, gradient_sample(lut, t, opacity, cov), mode, specialize_multiply);
                dsq += step1;
                step1 += step2;
            }
        }
    }
}


FL_EXPORT void fastlottie_gradient_spans(
    uint32_t *dst, int32_t ox, int32_t oy, int32_t stride,
    const int32_t *spans, int32_t count, const uint32_t *lut,
    uint32_t opacity, int32_t mode, int32_t radial,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
    if (count <= 0 || opacity == 0) return;
#define GRADIENT_SPANS(m, specialized) gradient_spans_impl(dst, ox, oy, stride, spans, count, \
    lut, opacity, m, radial, specialized, ia, ib, ic, id, itx, ity, sx, sy, ex, ey)
    if (mode == 1) {
        GRADIENT_SPANS(1, 1);
    } else {
        GRADIENT_SPANS(mode, 0);
    }
#undef GRADIENT_SPANS
}
#undef FL_GRAD_INLINE
