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
