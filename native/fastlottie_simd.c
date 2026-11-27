#include <math.h>
#include <stdint.h>
#include <string.h>

#if defined(_MSC_VER)
#include <intrin.h>
#endif

#if defined(__ARM_NEON) || defined(__ARM_NEON__)
#include <arm_neon.h>
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
#include <emmintrin.h>
#elif defined(__wasm_simd128__)
#include <wasm_simd128.h>
#endif

#if defined(_WIN32)
#define FL_EXPORT __declspec(dllexport)
#else
#define FL_EXPORT __attribute__((visibility("default")))
#endif

static int32_t fl_cancel_slots[256];

FL_EXPORT int32_t fastlottie_cancel_claim(int32_t slot) {
    int32_t idx = slot & 255;
#if defined(_MSC_VER)
    return _InterlockedCompareExchange((volatile long *)&fl_cancel_slots[idx], 1, 0) == 0;
#else
    int32_t available = 0;
    return __atomic_compare_exchange_n(&fl_cancel_slots[idx], &available, 1, 0,
                                       __ATOMIC_ACQ_REL, __ATOMIC_RELAXED);
#endif
}

FL_EXPORT void fastlottie_cancel_store(int32_t slot, int32_t token) {
    int32_t idx = slot & 255;
#if defined(_MSC_VER)
    _InterlockedExchange((volatile long *)&fl_cancel_slots[idx], (long)token);
#else
    __atomic_store_n(&fl_cancel_slots[idx], token, __ATOMIC_RELEASE);
#endif
}

FL_EXPORT int32_t fastlottie_cancel_load(int32_t slot) {
    int32_t idx = slot & 255;
#if defined(_MSC_VER)
    return (int32_t)_InterlockedOr((volatile long *)&fl_cancel_slots[idx], 0);
#else
    return __atomic_load_n(&fl_cancel_slots[idx], __ATOMIC_ACQUIRE);
#endif
}

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

FL_EXPORT void fastlottie_fill_solid_spans_v2(
    uint32_t* dst,
    int32_t dst_len,
    int32_t dstOriginX,
    int32_t dstOriginY,
    int32_t stride,
    const int32_t* data,
    int32_t spanCount,
    uint32_t srcPremul
) {
    if (!dst || dst_len <= 0 || stride <= 0 || !data || spanCount <= 0 || srcPremul == 0) return;

    const int32_t total = spanCount * 2;
    for (int32_t i = 0; i < total; i += 2) {
        uint32_t w0 = (uint32_t)data[i];
        uint32_t w1 = (uint32_t)data[i + 1];

        int32_t y = (int32_t)(w0 >> 16) - dstOriginY;
        int32_t x = (int32_t)(w0 & 0xFFFF) - dstOriginX;
        int32_t len = (int32_t)(w1 >> 8);
        uint32_t cov = (w1 & 0xFF) + 1;

        const int64_t row_off = (int64_t)y * stride + x;
        if (len <= 0 || row_off < 0 || row_off + len > dst_len) continue;

        uint32_t effSrc = cov == 256 ? srcPremul : scale_premul(srcPremul, cov);
        if (effSrc == 0) continue;

        uint32_t sa = effSrc >> 24;
        uint32_t* row = dst + row_off;

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

#if defined(__clang__) || defined(__GNUC__)
#define FL_ALWAYS_INLINE __attribute__((always_inline)) inline
#else
#define FL_ALWAYS_INLINE inline
#endif

static inline void store_src_over(uint32_t* dst, uint32_t s) {
    if (s == 0) return;
    const uint32_t sa = s >> 24;
    if (sa == 255) {
        *dst = s;
        return;
    }
    const uint32_t d = *dst;
    *dst = (d == 0) ? s : src_over_ia(s, d, 255 - sa);
}

#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
#define FL_HAS_SIMD4 1

static inline uint8x16_t fl_neon_alpha_indices(void) {
    static const uint8_t idx[16] = {
        3, 3, 3, 3, 7, 7, 7, 7, 11, 11, 11, 11, 15, 15, 15, 15
    };
    return vld1q_u8(idx);
}

static inline uint8x16_t fl_neon_scale255_u8x16(
    uint8x16_t px, uint8x16_t factor, uint16x8_t c128
) {
    uint16x8_t lo = vmlal_u8(c128, vget_low_u8(px), vget_low_u8(factor));
    uint16x8_t hi = vmlal_u8(c128, vget_high_u8(px), vget_high_u8(factor));
    lo = vaddq_u16(lo, vshrq_n_u16(lo, 8));
    hi = vaddq_u16(hi, vshrq_n_u16(hi, 8));
    return vcombine_u8(vshrn_n_u16(lo, 8), vshrn_n_u16(hi, 8));
}

static inline uint8x16_t fl_neon_scale256_u8x16(
    uint8x16_t px, uint8x8_t cov8, uint16x8_t c128
) {
    uint16x8_t lo = vmlal_u8(c128, vget_low_u8(px), cov8);
    uint16x8_t hi = vmlal_u8(c128, vget_high_u8(px), cov8);
    return vcombine_u8(vshrn_n_u16(lo, 8), vshrn_n_u16(hi, 8));
}

static inline void fl_neon_src_over_u8x16(
    uint32_t* dst, uint8x16_t s16, uint8x16_t alpha_idx, uint16x8_t c128
) {
    uint8x16_t ia16 = vmvnq_u8(vqtbl1q_u8(s16, alpha_idx));
    uint8x16_t d16 = vld1q_u8((const uint8_t*)dst);
    uint8x16_t scaled_d = fl_neon_scale255_u8x16(d16, ia16, c128);
    vst1q_u8((uint8_t*)dst, vaddq_u8(s16, scaled_d));
}

#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
#define FL_HAS_SIMD4 1

static inline __m128i fl_sse2_scale255_16(__m128i v, __m128i f, __m128i c128) {
    __m128i p = _mm_add_epi16(_mm_mullo_epi16(v, f), c128);
    return _mm_srli_epi16(_mm_add_epi16(p, _mm_srli_epi16(p, 8)), 8);
}

static inline __m128i fl_sse2_broadcast_alpha_16(__m128i px16) {
    return _mm_shufflehi_epi16(
        _mm_shufflelo_epi16(px16, _MM_SHUFFLE(3, 3, 3, 3)),
        _MM_SHUFFLE(3, 3, 3, 3)
    );
}

static inline void fl_sse2_src_over_u32x4(uint32_t* dst, __m128i s16) {
    const __m128i zero = _mm_setzero_si128();
    const __m128i c128 = _mm_set1_epi16(128);
    const __m128i c255 = _mm_set1_epi16(255);
    __m128i s_lo = _mm_unpacklo_epi8(s16, zero);
    __m128i s_hi = _mm_unpackhi_epi8(s16, zero);
    __m128i ia_lo = _mm_sub_epi16(c255, fl_sse2_broadcast_alpha_16(s_lo));
    __m128i ia_hi = _mm_sub_epi16(c255, fl_sse2_broadcast_alpha_16(s_hi));
    __m128i d16 = _mm_loadu_si128((const __m128i*)dst);
    __m128i d_lo = fl_sse2_scale255_16(_mm_unpacklo_epi8(d16, zero), ia_lo, c128);
    __m128i d_hi = fl_sse2_scale255_16(_mm_unpackhi_epi8(d16, zero), ia_hi, c128);
    __m128i out = _mm_add_epi8(s16, _mm_packus_epi16(d_lo, d_hi));
    _mm_storeu_si128((__m128i*)dst, out);
}

#elif defined(__wasm_simd128__)
#define FL_HAS_SIMD4 1

static inline v128_t fl_wasm_alpha_indices(void) {
    return wasm_i8x16_const(
        3, 3, 3, 3, 7, 7, 7, 7, 11, 11, 11, 11, 15, 15, 15, 15
    );
}

static inline v128_t fl_wasm_scale255_u8x16(v128_t px, v128_t f, v128_t c128) {
    v128_t lo = wasm_i16x8_add(
        wasm_i16x8_mul(wasm_u16x8_extend_low_u8x16(px), wasm_u16x8_extend_low_u8x16(f)),
        c128
    );
    v128_t hi = wasm_i16x8_add(
        wasm_i16x8_mul(wasm_u16x8_extend_high_u8x16(px), wasm_u16x8_extend_high_u8x16(f)),
        c128
    );
    lo = wasm_u16x8_shr(wasm_i16x8_add(lo, wasm_u16x8_shr(lo, 8)), 8);
    hi = wasm_u16x8_shr(wasm_i16x8_add(hi, wasm_u16x8_shr(hi, 8)), 8);
    return wasm_u8x16_narrow_i16x8(lo, hi);
}

static inline v128_t fl_wasm_scale256_u8x16(v128_t px, v128_t cov16, v128_t c128) {
    v128_t lo = wasm_u16x8_shr(
        wasm_i16x8_add(wasm_i16x8_mul(wasm_u16x8_extend_low_u8x16(px), cov16), c128),
        8
    );
    v128_t hi = wasm_u16x8_shr(
        wasm_i16x8_add(wasm_i16x8_mul(wasm_u16x8_extend_high_u8x16(px), cov16), c128),
        8
    );
    return wasm_u8x16_narrow_i16x8(lo, hi);
}

static inline void fl_wasm_src_over_u8x16(
    uint32_t* dst, v128_t s16, v128_t alpha_idx, v128_t c128
) {
    v128_t ia16 = wasm_v128_not(wasm_i8x16_swizzle(s16, alpha_idx));
    v128_t d16 = wasm_v128_load(dst);
    v128_t scaled_d = fl_wasm_scale255_u8x16(d16, ia16, c128);
    wasm_v128_store(dst, wasm_i8x16_add(s16, scaled_d));
}
#endif

static FL_ALWAYS_INLINE void composite_alpha_matte_impl(
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
    int is_dst_out
) {
#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
    const uint8x16_t alpha_idx = fl_neon_alpha_indices();
    const uint16x8_t c128 = vdupq_n_u16(128);
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
    const __m128i zero = _mm_setzero_si128();
    const __m128i c128 = _mm_set1_epi16(128);
    const __m128i c255 = _mm_set1_epi16(255);
#elif defined(__wasm_simd128__)
    const v128_t alpha_idx = fl_wasm_alpha_indices();
    const v128_t c128 = wasm_i16x8_splat(128);
#endif

    for (int32_t row = 0; row < bh; row++) {
        const uint32_t* tRow = layerBuf + (int64_t)row * bw;
        const uint32_t* mRow = matteBuf + (int64_t)row * bw;
        uint32_t* dRow = dst + ((int64_t)(by0 + row - dstOriginY) * dstStride) + (bx0 - dstOriginX);
        int32_t col = 0;

#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
        for (; col <= bw - 4; col += 4) {
            uint32x4_t t4 = vld1q_u32(tRow + col);
            if (vmaxvq_u32(t4) == 0) continue;
            uint8x16_t m16 = vreinterpretq_u8_u32(vld1q_u32(mRow + col));
            uint8x16_t factor16 = vqtbl1q_u8(m16, alpha_idx);
            if (is_dst_out) factor16 = vmvnq_u8(factor16);
            if (vmaxvq_u32(vreinterpretq_u32_u8(factor16)) == 0) continue;
            uint8x16_t masked16 = fl_neon_scale255_u8x16(
                vreinterpretq_u8_u32(t4), factor16, c128
            );
            fl_neon_src_over_u8x16(dRow + col, masked16, alpha_idx, c128);
        }
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
        for (; col <= bw - 4; col += 4) {
            __m128i t16 = _mm_loadu_si128((const __m128i*)(tRow + col));
            if (_mm_movemask_epi8(_mm_cmpeq_epi32(t16, zero)) == 0xFFFF) continue;
            __m128i m16 = _mm_loadu_si128((const __m128i*)(mRow + col));
            __m128i f_lo = fl_sse2_broadcast_alpha_16(_mm_unpacklo_epi8(m16, zero));
            __m128i f_hi = fl_sse2_broadcast_alpha_16(_mm_unpackhi_epi8(m16, zero));
            if (is_dst_out) {
                f_lo = _mm_sub_epi16(c255, f_lo);
                f_hi = _mm_sub_epi16(c255, f_hi);
            }
            if (_mm_movemask_epi8(_mm_cmpeq_epi16(_mm_or_si128(f_lo, f_hi), zero)) == 0xFFFF) {
                continue;
            }
            __m128i m_lo = fl_sse2_scale255_16(_mm_unpacklo_epi8(t16, zero), f_lo, c128);
            __m128i m_hi = fl_sse2_scale255_16(_mm_unpackhi_epi8(t16, zero), f_hi, c128);
            __m128i masked16 = _mm_packus_epi16(m_lo, m_hi);
            __m128i ia_lo = _mm_sub_epi16(c255, fl_sse2_broadcast_alpha_16(m_lo));
            __m128i ia_hi = _mm_sub_epi16(c255, fl_sse2_broadcast_alpha_16(m_hi));
            __m128i d16 = _mm_loadu_si128((const __m128i*)(dRow + col));
            __m128i d_lo = fl_sse2_scale255_16(_mm_unpacklo_epi8(d16, zero), ia_lo, c128);
            __m128i d_hi = fl_sse2_scale255_16(_mm_unpackhi_epi8(d16, zero), ia_hi, c128);
            __m128i out = _mm_add_epi8(masked16, _mm_packus_epi16(d_lo, d_hi));
            _mm_storeu_si128((__m128i*)(dRow + col), out);
        }
#elif defined(__wasm_simd128__)
        for (; col <= bw - 4; col += 4) {
            v128_t t16 = wasm_v128_load(tRow + col);
            if (!wasm_v128_any_true(t16)) continue;
            v128_t m16 = wasm_v128_load(mRow + col);
            v128_t factor16 = wasm_i8x16_swizzle(m16, alpha_idx);
            if (is_dst_out) factor16 = wasm_v128_not(factor16);
            if (!wasm_v128_any_true(factor16)) continue;
            v128_t masked16 = fl_wasm_scale255_u8x16(t16, factor16, c128);
            fl_wasm_src_over_u8x16(dRow + col, masked16, alpha_idx, c128);
        }
#endif

        for (; col < bw; col++) {
            uint32_t tPx = tRow[col];
            if (tPx == 0) continue;
            uint32_t mAlpha = mRow[col] >> 24;
            uint32_t factor = is_dst_out ? (255u - mAlpha) : mAlpha;
            if (factor == 0) continue;
            uint32_t masked = (factor == 255u) ? tPx : scale_premul_255(tPx, factor);
            store_src_over(dRow + col, masked);
        }
    }
}

FL_EXPORT void fastlottie_composite_matte(
    uint32_t* dst,
    int32_t dst_len,
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
    int32_t isLuma
) {
    if (!dst || dst_len <= 0 || dstStride <= 0 || !layerBuf || !matteBuf ||
        bw <= 0 || bh <= 0) {
        return;
    }
    const int64_t first_off = (int64_t)(by0 - dstOriginY) * dstStride + (bx0 - dstOriginX);
    const int64_t last_end = (int64_t)(by0 + bh - 1 - dstOriginY) * dstStride + (bx0 - dstOriginX) + bw;
    if (bx0 < dstOriginX || by0 < dstOriginY || first_off < 0 || last_end > dst_len) {
        return;
    }

    if (!isLuma) {
        if (isDstOut) {
            composite_alpha_matte_impl(
                dst, dstOriginX, dstOriginY, dstStride,
                layerBuf, matteBuf, bw, bh, bx0, by0, 1
            );
        } else {
            composite_alpha_matte_impl(
                dst, dstOriginX, dstOriginY, dstStride,
                layerBuf, matteBuf, bw, bh, bx0, by0, 0
            );
        }
        return;
    }

    for (int32_t row = 0; row < bh; row++) {
        const uint32_t* tRow = layerBuf + (int64_t)row * bw;
        const uint32_t* mRow = matteBuf + (int64_t)row * bw;
        uint32_t* dRow = dst + ((int64_t)(by0 + row - dstOriginY) * dstStride) + (bx0 - dstOriginX);

        for (int32_t col = 0; col < bw; col++) {
            uint32_t tPx = tRow[col];
            if (tPx == 0) continue;

            // Matte pixels are premultiplied (r = R_straight * mAlpha / 255),
            // so BT.601 luminance directly on premultiplied RGB yields
            // mAlpha * luma_straight, preserving AA and matte opacity.
            uint32_t mPx = mRow[col];
            uint32_t r = (mPx >> 16) & 0xFF;
            uint32_t g = (mPx >> 8) & 0xFF;
            uint32_t b = mPx & 0xFF;
            uint32_t lum = (19595 * r + 38470 * g + 7471 * b + 32768) >> 16;
            if (lum > 255) lum = 255;
            int32_t factor = isDstOut ? (int32_t)(255 - lum) : (int32_t)lum;

            if (factor <= 0) continue;
            uint32_t masked = (factor >= 255) ? tPx : scale_premul_255(tPx, (uint32_t)factor);
            store_src_over(dRow + col, masked);
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

static inline double fl_min3(double a, double b, double c) {
    double m = a < b ? a : b;
    return m < c ? m : c;
}

static inline double fl_max3(double a, double b, double c) {
    double m = a > b ? a : b;
    return m > c ? m : c;
}

static inline double fl_lum(double r, double g, double b) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    return 0.3 * r + 0.59 * g + 0.11 * b;
}

static inline double fl_sat(double r, double g, double b) {
    return fl_max3(r, g, b) - fl_min3(r, g, b);
}

static inline void fl_set_sat(
    double r, double g, double b, double sat,
    double *or_, double *og, double *ob
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double low = fl_min3(r, g, b);
    const double span = fl_sat(r, g, b);
    if (span == 0.0) {
        *or_ = 0.0;
        *og = 0.0;
        *ob = 0.0;
        return;
    }
    *or_ = (r - low) * sat / span;
    *og = (g - low) * sat / span;
    *ob = (b - low) * sat / span;
}

static inline void fl_set_lum(
    double r, double g, double b, double lum,
    double *or_, double *og, double *ob
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double delta = lum - fl_lum(r, g, b);
    const double low = fl_min3(r, g, b) + delta;
    const double high = fl_max3(r, g, b) + delta;
    double cr = r + delta, cg = g + delta, cb = b + delta;
    if (low < 0.0) {
        cr = lum + (cr - lum) * lum / (lum - low);
        cg = lum + (cg - lum) * lum / (lum - low);
        cb = lum + (cb - lum) * lum / (lum - low);
    }
    if (high > 1.0) {
        cr = lum + (cr - lum) * (1.0 - lum) / (high - lum);
        cg = lum + (cg - lum) * (1.0 - lum) / (high - lum);
        cb = lum + (cb - lum) * (1.0 - lum) / (high - lum);
    }
    *or_ = cr;
    *og = cg;
    *ob = cb;
}

static inline double fl_advanced_channel(double d, double s, int mode) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    if (mode == 6) {
        if (d == 0.0) return 0.0;
        if (s == 1.0) return 1.0;
        double v = d / (1.0 - s);
        return v < 1.0 ? v : 1.0;
    }
    if (mode == 7) {
        if (d == 1.0) return 1.0;
        if (s == 0.0) return 0.0;
        double v = (1.0 - d) / s;
        return 1.0 - (v < 1.0 ? v : 1.0);
    }
    if (s <= 0.5) return d - (1.0 - 2.0 * s) * d * (1.0 - d);
    const double curve = d <= 0.25 ? ((16.0 * d - 12.0) * d + 4.0) * d : sqrt(d);
    return d + (2.0 * s - 1.0) * (curve - d);
}

static inline uint32_t fl_premul_advanced(
    uint32_t sc, uint32_t dc, uint32_t sa, uint32_t da, uint32_t alpha, double overlap
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double v = ((double)sc * (double)(255 - da) +
                      (double)dc * (double)(255 - sa) +
                      (double)sa * (double)da * overlap) / 255.0;
    long r = lround(v);
    if (r < 0) return 0;
    if ((uint32_t)r > alpha) return alpha;
    return (uint32_t)r;
}

static inline uint32_t blend_advanced(
    uint32_t sr, uint32_t sg, uint32_t sb,
    uint32_t dr, uint32_t dg, uint32_t db,
    uint32_t sa, uint32_t da, uint32_t alpha, int mode
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double sr_f = (double)sr / (double)sa;
    const double sg_f = (double)sg / (double)sa;
    const double sb_f = (double)sb / (double)sa;
    const double dr_f = (double)dr / (double)da;
    const double dg_f = (double)dg / (double)da;
    const double db_f = (double)db / (double)da;
    double r, g, b;
    if (mode == 12) {
        double tr, tg, tb;
        fl_set_sat(sr_f, sg_f, sb_f, fl_sat(dr_f, dg_f, db_f), &tr, &tg, &tb);
        fl_set_lum(tr, tg, tb, fl_lum(dr_f, dg_f, db_f), &r, &g, &b);
    } else if (mode == 13) {
        double tr, tg, tb;
        fl_set_sat(dr_f, dg_f, db_f, fl_sat(sr_f, sg_f, sb_f), &tr, &tg, &tb);
        fl_set_lum(tr, tg, tb, fl_lum(dr_f, dg_f, db_f), &r, &g, &b);
    } else if (mode == 14) {
        fl_set_lum(sr_f, sg_f, sb_f, fl_lum(dr_f, dg_f, db_f), &r, &g, &b);
    } else if (mode == 15) {
        fl_set_lum(dr_f, dg_f, db_f, fl_lum(sr_f, sg_f, sb_f), &r, &g, &b);
    } else {
        r = fl_advanced_channel(dr_f, sr_f, mode);
        g = fl_advanced_channel(dg_f, sg_f, mode);
        b = fl_advanced_channel(db_f, sb_f, mode);
    }
    return (alpha << 24) |
        (fl_premul_advanced(sr, dr, sa, da, alpha, r) << 16) |
        (fl_premul_advanced(sg, dg, sa, da, alpha, g) << 8) |
        fl_premul_advanced(sb, db, sa, da, alpha, b);
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
    if (mode == 6 || mode == 7 || mode == 9 || (mode >= 12 && mode <= 15)) {
        return blend_advanced(sr, sg, sb, dr, dg, db, sa, da, a, mode);
    }
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

FL_EXPORT void fastlottie_blend_solid_v2(
    uint32_t *dst, int32_t dst_len, int32_t origin_x, int32_t origin_y,
    int32_t stride, const int32_t *spans, int32_t count,
    uint32_t color, int32_t mode
) {
    if (!dst || dst_len <= 0 || stride <= 0 || !spans || count <= 0 || color == 0) return;
    uint32_t prev_src = 0, prev_dst = 0, result = 0;
    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const uint32_t s = scale_premul(color, (run & 255) + 1);
        if (s == 0) continue;
        const int y = (int)(xy >> 16) - origin_y;
        const int x = (int)(xy & 65535) - origin_x;
        const int len = (int)(run >> 8);
        const int64_t row_off = (int64_t)y * stride + x;
        if (len <= 0 || row_off < 0 || row_off + len > dst_len) continue;
        uint32_t *row = dst + row_off;
        for (int p = 0; p < len; ++p) {
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
static inline int gradient_index(double t) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    // Treat non-finite transform results safely before converting to an index.
    return !(t > 0.0) ? 0 : (t >= 1.0 ? 1023 : (int)(t * 1023.0 + 0.5));
}

static inline int gradient_index_f32(float t) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    return !(t < 1.0f) ? 1023 : (!(t > 0.0f) ? 0 : (int)((double)t * 1023.0 + 0.5));
}

static inline void gradient_sqrt4(
    double s0, double s1, double s2, double s3, float out[4]
) {
#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
    float in[4] = {(float)s0, (float)s1, (float)s2, (float)s3};
    vst1q_f32(out, vsqrtq_f32(vld1q_f32(in)));
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
    __m128 q4 = _mm_set_ps((float)s3, (float)s2, (float)s1, (float)s0);
    _mm_storeu_ps(out, _mm_sqrt_ps(q4));
#elif defined(__wasm_simd128__)
    v128_t q4 = wasm_f32x4_make((float)s0, (float)s1, (float)s2, (float)s3);
    wasm_v128_store(out, wasm_f32x4_sqrt(q4));
#else
    out[0] = sqrtf((float)s0);
    out[1] = sqrtf((float)s1);
    out[2] = sqrtf((float)s2);
    out[3] = sqrtf((float)s3);
#endif
}

static inline void gradient_fill_solid_run(uint32_t* row, int len, uint32_t effSrc) {
    if (effSrc == 0) return;
    const uint32_t sa = effSrc >> 24;
    if (sa == 255) {
        int p = 0;
#if defined(__ARM_NEON) || defined(__ARM_NEON__)
        uint32x4_t val4 = vdupq_n_u32(effSrc);
        for (; p <= len - 4; p += 4) vst1q_u32(row + p, val4);
#elif defined(__SSE2__) || defined(_M_X64)
        __m128i val4 = _mm_set1_epi32((int)effSrc);
        for (; p <= len - 4; p += 4) _mm_storeu_si128((__m128i*)(row + p), val4);
#elif defined(__wasm_simd128__)
        v128_t val4 = wasm_i32x4_splat((int32_t)effSrc);
        for (; p <= len - 4; p += 4) wasm_v128_store(row + p, val4);
#endif
        for (; p < len; ++p) row[p] = effSrc;
    } else {
        const uint32_t ia = 255 - sa;
        int p = 0;
#if defined(__ARM_NEON) || defined(__ARM_NEON__)
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
                uint8x16_t out16 = vaddq_u8(
                    s16, vcombine_u8(vshrn_n_u16(term_lo, 8), vshrn_n_u16(term_hi, 8))
                );
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
                __m128i d_lo = fl_sse2_scale255_16(_mm_unpacklo_epi8(d16, zero), ia16, c128);
                __m128i d_hi = fl_sse2_scale255_16(_mm_unpackhi_epi8(d16, zero), ia16, c128);
                _mm_storeu_si128((__m128i*)(row + p), _mm_add_epi8(s16, _mm_packus_epi16(d_lo, d_hi)));
            }
        }
#elif defined(__wasm_simd128__)
        if (len >= 4) {
            v128_t s16 = wasm_i32x4_splat((int32_t)effSrc);
            v128_t ia16 = wasm_i8x16_splat((int8_t)ia);
            v128_t c128 = wasm_i16x8_splat(128);
            for (; p <= len - 4; p += 4) {
                v128_t d16 = wasm_v128_load(row + p);
                v128_t scaled = fl_wasm_scale255_u8x16(d16, ia16, c128);
                wasm_v128_store(row + p, wasm_i8x16_add(s16, scaled));
            }
        }
#endif
        for (; p < len; ++p) {
            const uint32_t d = row[p];
            row[p] = (d == 0) ? effSrc : src_over_ia(effSrc, d, ia);
        }
    }
}

static FL_ALWAYS_INLINE void gradient_store4_src_over_unscaled(
    uint32_t* dst, uint32_t c0, uint32_t c1, uint32_t c2, uint32_t c3
) {
    if ((c0 & c1 & c2 & c3) >= 0xFF000000U) {
        dst[0] = c0;
        dst[1] = c1;
        dst[2] = c2;
        dst[3] = c3;
        return;
    }
    if ((c0 | c1 | c2 | c3) == 0) return;
#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
    const uint32_t arr[4] = {c0, c1, c2, c3};
    fl_neon_src_over_u8x16(
        dst, vreinterpretq_u8_u32(vld1q_u32(arr)),
        fl_neon_alpha_indices(), vdupq_n_u16(128)
    );
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
    fl_sse2_src_over_u32x4(dst, _mm_set_epi32((int)c3, (int)c2, (int)c1, (int)c0));
#elif defined(__wasm_simd128__)
    fl_wasm_src_over_u8x16(
        dst, wasm_i32x4_make((int32_t)c0, (int32_t)c1, (int32_t)c2, (int32_t)c3),
        fl_wasm_alpha_indices(), wasm_i16x8_splat(128)
    );
#else
    store_src_over(dst + 0, c0);
    store_src_over(dst + 1, c1);
    store_src_over(dst + 2, c2);
    store_src_over(dst + 3, c3);
#endif
}

static FL_ALWAYS_INLINE void gradient_store4_src_over_scaled(
    uint32_t* dst,
    uint32_t c0, uint32_t c1, uint32_t c2, uint32_t c3,
    uint32_t opacity, uint32_t cov,
    int has_opacity, int has_cov
) {
    if ((c0 | c1 | c2 | c3) == 0) return;
#if defined(__aarch64__) && (defined(__ARM_NEON) || defined(__ARM_NEON__))
    const uint32_t arr[4] = {c0, c1, c2, c3};
    const uint16x8_t c128 = vdupq_n_u16(128);
    uint8x16_t s16 = vreinterpretq_u8_u32(vld1q_u32(arr));
    if (has_opacity) {
        s16 = fl_neon_scale255_u8x16(s16, vdupq_n_u8((uint8_t)opacity), c128);
    }
    if (has_cov) {
        s16 = fl_neon_scale256_u8x16(s16, vdup_n_u8((uint8_t)cov), c128);
    }
    fl_neon_src_over_u8x16(dst, s16, fl_neon_alpha_indices(), c128);
#elif defined(__SSE2__) || defined(_M_X64) || (defined(_M_IX86_FP) && _M_IX86_FP >= 2)
    const __m128i zero = _mm_setzero_si128();
    const __m128i c128 = _mm_set1_epi16(128);
    __m128i s16 = _mm_set_epi32((int)c3, (int)c2, (int)c1, (int)c0);
    __m128i s_lo = _mm_unpacklo_epi8(s16, zero);
    __m128i s_hi = _mm_unpackhi_epi8(s16, zero);
    if (has_opacity) {
        const __m128i op16 = _mm_set1_epi16((short)opacity);
        s_lo = fl_sse2_scale255_16(s_lo, op16, c128);
        s_hi = fl_sse2_scale255_16(s_hi, op16, c128);
    }
    if (has_cov) {
        const __m128i cov16 = _mm_set1_epi16((short)cov);
        s_lo = _mm_srli_epi16(_mm_add_epi16(_mm_mullo_epi16(s_lo, cov16), c128), 8);
        s_hi = _mm_srli_epi16(_mm_add_epi16(_mm_mullo_epi16(s_hi, cov16), c128), 8);
    }
    fl_sse2_src_over_u32x4(dst, _mm_packus_epi16(s_lo, s_hi));
#elif defined(__wasm_simd128__)
    const v128_t c128 = wasm_i16x8_splat(128);
    v128_t s16 = wasm_i32x4_make((int32_t)c0, (int32_t)c1, (int32_t)c2, (int32_t)c3);
    if (has_opacity) {
        s16 = fl_wasm_scale255_u8x16(s16, wasm_i8x16_splat((int8_t)opacity), c128);
    }
    if (has_cov) {
        s16 = fl_wasm_scale256_u8x16(s16, wasm_i16x8_splat((int16_t)cov), c128);
    }
    fl_wasm_src_over_u8x16(dst, s16, fl_wasm_alpha_indices(), c128);
#else
    if (has_opacity) {
        c0 = scale_premul_255(c0, opacity);
        c1 = scale_premul_255(c1, opacity);
        c2 = scale_premul_255(c2, opacity);
        c3 = scale_premul_255(c3, opacity);
    }
    if (has_cov) {
        c0 = scale_premul(c0, cov);
        c1 = scale_premul(c1, cov);
        c2 = scale_premul(c2, cov);
        c3 = scale_premul(c3, cov);
    }
    store_src_over(dst + 0, c0);
    store_src_over(dst + 1, c1);
    store_src_over(dst + 2, c2);
    store_src_over(dst + 3, c3);
#endif
}

static void gradient_linear_src_over(
    uint32_t* dst, int32_t dst_len, int32_t ox, int32_t oy, int32_t stride,
    const int32_t* spans, int32_t count, const uint32_t* lut,
    uint32_t opacity,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double gx = ex - sx, gy = ey - sy;
    const double len_sq = gx * gx + gy * gy;
    if (!(len_sq > 1e-12)) {
        const uint32_t c = (opacity == 255) ? lut[0] : scale_premul_255(lut[0], opacity);
        fastlottie_fill_solid_spans_v2(dst, dst_len, ox, oy, stride, spans, count, c);
        return;
    }
    const double inv_len_sq = 1.0 / len_sq;
    const double dtx = (ia * gx + ib * gy) * inv_len_sq;
    const int full_opacity = (opacity == 255);
    const uint32_t c_lo_base = full_opacity ? lut[0] : scale_premul_255(lut[0], opacity);
    const uint32_t c_hi_base = full_opacity ? lut[1023] : scale_premul_255(lut[1023], opacity);

    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const int x = xy & 65535, y = xy >> 16;
        const int len = run >> 8;
        const uint32_t cov = (run & 255) + 1;
        const int64_t row_off = (int64_t)(y - oy) * stride + x - ox;
        if (len <= 0 || row_off < 0 || row_off + len > dst_len) continue;
        uint32_t* row = dst + row_off;
        const double px = x + 0.5, py = y + 0.5;
        const double lx = ia * px + ic * py + itx;
        const double ly = ib * px + id * py + ity;
        double t = ((lx - sx) * gx + (ly - sy) * gy) * inv_len_sq;

        // Entire span stays clamped at an endpoint: fill as a solid run.
        if (t <= 0.0 && dtx <= 0.0) {
            const uint32_t eff = (cov == 256) ? c_lo_base : scale_premul(c_lo_base, cov);
            gradient_fill_solid_run(row, len, eff);
            continue;
        }
        if (t >= 1.0 && dtx >= 0.0) {
            const uint32_t eff = (cov == 256) ? c_hi_base : scale_premul(c_hi_base, cov);
            gradient_fill_solid_run(row, len, eff);
            continue;
        }

        int j = 0;
        if (full_opacity && cov == 256) {
            for (; j <= len - 4; j += 4) {
                const double t0 = t;
                const double t1 = t0 + dtx;
                const double t2 = t1 + dtx;
                const double t3 = t2 + dtx;
                t = t3 + dtx;
                int i0, i1, i2, i3;
                if (t0 > 0.0 && t0 < 1.0 && t3 > 0.0 && t3 < 1.0) {
                    i0 = (int)(t0 * 1023.0 + 0.5);
                    i1 = (int)(t1 * 1023.0 + 0.5);
                    i2 = (int)(t2 * 1023.0 + 0.5);
                    i3 = (int)(t3 * 1023.0 + 0.5);
                } else {
                    i0 = gradient_index(t0);
                    i1 = gradient_index(t1);
                    i2 = gradient_index(t2);
                    i3 = gradient_index(t3);
                }
                gradient_store4_src_over_unscaled(
                    row + j, lut[i0], lut[i1], lut[i2], lut[i3]
                );
            }
            for (; j < len; ++j) {
                store_src_over(row + j, lut[gradient_index(t)]);
                t += dtx;
            }
        } else if (full_opacity) {
            for (; j <= len - 4; j += 4) {
                const double t0 = t;
                const double t1 = t0 + dtx;
                const double t2 = t1 + dtx;
                const double t3 = t2 + dtx;
                t = t3 + dtx;
                gradient_store4_src_over_scaled(
                    row + j,
                    lut[gradient_index(t0)], lut[gradient_index(t1)],
                    lut[gradient_index(t2)], lut[gradient_index(t3)],
                    255, cov, 0, 1
                );
            }
            for (; j < len; ++j) {
                store_src_over(row + j, scale_premul(lut[gradient_index(t)], cov));
                t += dtx;
            }
        } else if (cov == 256) {
            for (; j <= len - 4; j += 4) {
                const double t0 = t;
                const double t1 = t0 + dtx;
                const double t2 = t1 + dtx;
                const double t3 = t2 + dtx;
                t = t3 + dtx;
                gradient_store4_src_over_scaled(
                    row + j,
                    lut[gradient_index(t0)], lut[gradient_index(t1)],
                    lut[gradient_index(t2)], lut[gradient_index(t3)],
                    opacity, 256, 1, 0
                );
            }
            for (; j < len; ++j) {
                store_src_over(row + j, scale_premul_255(lut[gradient_index(t)], opacity));
                t += dtx;
            }
        } else {
            for (; j <= len - 4; j += 4) {
                const double t0 = t;
                const double t1 = t0 + dtx;
                const double t2 = t1 + dtx;
                const double t3 = t2 + dtx;
                t = t3 + dtx;
                gradient_store4_src_over_scaled(
                    row + j,
                    lut[gradient_index(t0)], lut[gradient_index(t1)],
                    lut[gradient_index(t2)], lut[gradient_index(t3)],
                    opacity, cov, 1, 1
                );
            }
            for (; j < len; ++j) {
                uint32_t c = scale_premul_255(lut[gradient_index(t)], opacity);
                store_src_over(row + j, scale_premul(c, cov));
                t += dtx;
            }
        }
    }
}

static void gradient_radial_src_over(
    uint32_t* dst, int32_t dst_len, int32_t ox, int32_t oy, int32_t stride,
    const int32_t* spans, int32_t count, const uint32_t* lut,
    uint32_t opacity,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double gx = ex - sx, gy = ey - sy;
    const double radius = sqrt(gx * gx + gy * gy);
    const double inv = 1.0 / (radius > .001 ? radius : .001);
    const double nia = ia * inv;
    const double nib = ib * inv;
    const double nic = ic * inv;
    const double nid = id * inv;
    const double nitx = (itx - sx) * inv;
    const double nity = (ity - sy) * inv;
    const int full_opacity = (opacity == 255);
    const uint32_t c_end_raw = lut[1023];

    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const int x = xy & 65535, y = xy >> 16;
        const int len = run >> 8;
        const uint32_t cov = (run & 255) + 1;
        const int64_t row_off = (int64_t)(y - oy) * stride + x - ox;
        if (len <= 0 || row_off < 0 || row_off + len > dst_len) continue;
        uint32_t* row = dst + row_off;
        const double px = x + 0.5, py = y + 0.5;
        double dx = nia * px + nic * py + nitx;
        double dy = nib * px + nid * py + nity;
        const int vector_end = len & ~3;
        int j = 0;

        if (full_opacity && cov == 256) {
            for (; j < vector_end; j += 4) {
                const double s0 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s1 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s2 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s3 = dx * dx + dy * dy; dx += nia; dy += nib;
                if (s0 >= 1.0 && s1 >= 1.0 && s2 >= 1.0 && s3 >= 1.0) {
                    gradient_store4_src_over_unscaled(
                        row + j, c_end_raw, c_end_raw, c_end_raw, c_end_raw
                    );
                } else {
                    float t4[4];
                    gradient_sqrt4(s0, s1, s2, s3, t4);
                    gradient_store4_src_over_unscaled(
                        row + j,
                        lut[gradient_index_f32(t4[0])],
                        lut[gradient_index_f32(t4[1])],
                        lut[gradient_index_f32(t4[2])],
                        lut[gradient_index_f32(t4[3])]
                    );
                }
            }
            for (; j < len; ++j) {
                const double q = dx * dx + dy * dy;
                const int idx = !(q < 1.0) ? 1023 : gradient_index(sqrt(q));
                store_src_over(row + j, lut[idx]);
                dx += nia;
                dy += nib;
            }
        } else {
            const int has_op = !full_opacity;
            const int has_cov = (cov != 256);
            for (; j < vector_end; j += 4) {
                const double s0 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s1 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s2 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s3 = dx * dx + dy * dy; dx += nia; dy += nib;
                uint32_t c0, c1, c2, c3;
                if (s0 >= 1.0 && s1 >= 1.0 && s2 >= 1.0 && s3 >= 1.0) {
                    c0 = c1 = c2 = c3 = c_end_raw;
                } else {
                    float t4[4];
                    gradient_sqrt4(s0, s1, s2, s3, t4);
                    c0 = lut[gradient_index_f32(t4[0])];
                    c1 = lut[gradient_index_f32(t4[1])];
                    c2 = lut[gradient_index_f32(t4[2])];
                    c3 = lut[gradient_index_f32(t4[3])];
                }
                gradient_store4_src_over_scaled(
                    row + j, c0, c1, c2, c3, opacity, cov, has_op, has_cov
                );
            }
            for (; j < len; ++j) {
                const double q = dx * dx + dy * dy;
                const int idx = !(q < 1.0) ? 1023 : gradient_index(sqrt(q));
                uint32_t c = lut[idx];
                if (has_op) c = scale_premul_255(c, opacity);
                if (has_cov) c = scale_premul(c, cov);
                store_src_over(row + j, c);
                dx += nia;
                dy += nib;
            }
        }
    }
}

static inline uint32_t gradient_sample(
    const uint32_t *lut, double t, uint32_t opacity, uint32_t coverage
) {
    uint32_t src = lut[gradient_index(t)];
    if (opacity != 255) src = scale_premul_255(src, opacity);
    if (coverage != 256) src = scale_premul(src, coverage);
    return src;
}

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

static FL_ALWAYS_INLINE void gradient_store_blend(
    uint32_t *dst, uint32_t src, int mode, int specialize_multiply
) {
    *dst = specialize_multiply ? gradient_multiply(src, *dst) : blend_pixel(src, *dst, mode);
}

static FL_ALWAYS_INLINE void gradient_spans_blend_impl(
    uint32_t *dst, int32_t dst_len, int32_t ox, int32_t oy, int32_t stride,
    const int32_t *spans, int32_t count, const uint32_t *lut,
    uint32_t opacity, int32_t mode, int32_t radial, int specialize_multiply,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
#if defined(__clang__)
#pragma clang fp contract(off)
#endif
    const double gx = ex - sx, gy = ey - sy;
    const double len_sq = gx * gx + gy * gy;
    const double inv_len_sq = !radial && len_sq > 1e-12 ? 1.0 / len_sq : 0;
    const double dtx = (ia * gx + ib * gy) * inv_len_sq;
    double nia = 0, nib = 0, nic = 0, nid = 0, nitx = 0, nity = 0;
    if (radial) {
        const double radius = sqrt(len_sq);
        const double inv = 1.0 / (radius > .001 ? radius : .001);
        nia = ia * inv;
        nib = ib * inv;
        nic = ic * inv;
        nid = id * inv;
        nitx = (itx - sx) * inv;
        nity = (ity - sy) * inv;
    }
    const int full_opacity = (opacity == 255);

    for (int i = 0; i < count * 2; i += 2) {
        const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
        const int x = xy & 65535, y = xy >> 16;
        const int len = run >> 8;
        const uint32_t cov = (run & 255) + 1;
        const int64_t row_off = (int64_t)(y - oy) * stride + x - ox;
        if (len <= 0 || row_off < 0 || row_off + len > dst_len) continue;
        uint32_t *row = dst + row_off;
        const double px = x + .5, py = y + .5;
        if (!radial) {
            double t = 0;
            if (inv_len_sq != 0) {
                const double lx = ia * px + ic * py + itx;
                const double ly = ib * px + id * py + ity;
                t = ((lx - sx) * gx + (ly - sy) * gy) * inv_len_sq;
            }
            if (full_opacity && cov == 256) {
                for (int j = 0; j < len; ++j) {
                    gradient_store_blend(row + j, lut[gradient_index(t)], mode, specialize_multiply);
                    t += dtx;
                }
            } else {
                for (int j = 0; j < len; ++j) {
                    gradient_store_blend(row + j, gradient_sample(lut, t, opacity, cov), mode, specialize_multiply);
                    t += dtx;
                }
            }
        } else {
            double dx = nia * px + nic * py + nitx;
            double dy = nib * px + nid * py + nity;
            const int vector_end = len & ~3;
            const int unscaled = full_opacity && cov == 256;
            int j = 0;
            for (; j < vector_end; j += 4) {
                const double s0 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s1 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s2 = dx * dx + dy * dy; dx += nia; dy += nib;
                const double s3 = dx * dx + dy * dy; dx += nia; dy += nib;
                int idx[4];
                if (s0 >= 1.0 && s1 >= 1.0 && s2 >= 1.0 && s3 >= 1.0) {
                    idx[0] = idx[1] = idx[2] = idx[3] = 1023;
                } else {
                    float t4[4];
                    gradient_sqrt4(s0, s1, s2, s3, t4);
                    idx[0] = gradient_index_f32(t4[0]);
                    idx[1] = gradient_index_f32(t4[1]);
                    idx[2] = gradient_index_f32(t4[2]);
                    idx[3] = gradient_index_f32(t4[3]);
                }
                if (unscaled) {
                    for (int k = 0; k < 4; ++k) {
                        gradient_store_blend(row + j + k, lut[idx[k]], mode, specialize_multiply);
                    }
                } else {
                    for (int k = 0; k < 4; ++k) {
                        uint32_t c = lut[idx[k]];
                        if (!full_opacity) c = scale_premul_255(c, opacity);
                        if (cov != 256) c = scale_premul(c, cov);
                        gradient_store_blend(row + j + k, c, mode, specialize_multiply);
                    }
                }
            }
            for (; j < len; ++j) {
                const double q = dx * dx + dy * dy;
                const double t = !(q < 1.0) ? 1.0 : sqrt(q);
                const uint32_t c = unscaled ? lut[gradient_index(t)] : gradient_sample(lut, t, opacity, cov);
                gradient_store_blend(row + j, c, mode, specialize_multiply);
                dx += nia;
                dy += nib;
            }
        }
    }
}

FL_EXPORT void fastlottie_gradient_spans_v2(
    uint32_t *dst, int32_t dst_len, int32_t ox, int32_t oy, int32_t stride,
    const int32_t *spans, int32_t count, const uint32_t *lut,
    uint32_t opacity, int32_t mode, int32_t radial,
    double ia, double ib, double ic, double id, double itx, double ity,
    double sx, double sy, double ex, double ey
) {
    if (!dst || dst_len <= 0 || stride <= 0 || !spans || !lut || count <= 0 || opacity == 0) return;
    if (mode == 0) {
        if (!radial) {
            gradient_linear_src_over(
                dst, dst_len, ox, oy, stride, spans, count, lut, opacity,
                ia, ib, ic, id, itx, ity, sx, sy, ex, ey
            );
        } else {
            gradient_radial_src_over(
                dst, dst_len, ox, oy, stride, spans, count, lut, opacity,
                ia, ib, ic, id, itx, ity, sx, sy, ex, ey
            );
        }
    } else if (mode == 1) {
        gradient_spans_blend_impl(
            dst, dst_len, ox, oy, stride, spans, count, lut, opacity, 1, radial, 1,
            ia, ib, ic, id, itx, ity, sx, sy, ex, ey
        );
    } else {
        gradient_spans_blend_impl(
            dst, dst_len, ox, oy, stride, spans, count, lut, opacity, mode, radial, 0,
            ia, ib, ic, id, itx, ity, sx, sy, ex, ey
        );
    }
}
#undef FL_ALWAYS_INLINE
