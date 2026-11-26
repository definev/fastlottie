// Fixed-point coverage using directly indexed cells and sparse row bitsets.
#include <stdint.h>
#include <stdlib.h>
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

#if defined(_MSC_VER) && !defined(__clang__)
#include <intrin.h>
static int fl_ctz(uint64_t v) {
  unsigned long i;
  _BitScanForward64(&i, v);
  return (int)i;
}
#else
static int fl_ctz(uint64_t v) { return __builtin_ctzll(v); }
#endif

typedef struct {
  int32_t cover, area;
} FLCell;
typedef struct {
  FLCell *cells;
  uint64_t *used;
  size_t cell_cap, used_cap;
  int x0, y0, x1, y1, w, words, ymin, ymax;
  int32_t *out;
  int cap, n, minx, miny, maxx, maxy;
} FLDense;

FL_EXPORT void *fl_dense_new(void) { return calloc(1, sizeof(FLDense)); }
FL_EXPORT void fl_dense_free(void *s) {
  FLDense *r = s;
  if (r) {
    free(r->cells);
    free(r->used);
    free(r);
  }
}

// Release a cell plane that outgrew a 256x256 clip. The next raster reallocates.
FL_EXPORT void fl_dense_trim(void *s, int32_t max_cells) {
  FLDense *r = s;
  if (!r)
    return;
  if ((int64_t)r->cell_cap > max_cells) {
    free(r->cells);
    r->cells = NULL;
    r->cell_cap = 0;
  }
  size_t max_used = max_cells > 0 ? ((size_t)max_cells + 63) / 64 : 0;
  if (r->used_cap > max_used) {
    free(r->used);
    r->used = NULL;
    r->used_cap = 0;
  }
}

static inline void fl_mark(FLDense *r, int y, int x, int f1, int f2, int d) {
  if (!d || x >= r->x1)
    return;
  if (x < r->x0) {
    x = r->x0;
    f1 = f2 = 0;
  }
  int i = x - r->x0, j = y - r->y0;
  uint64_t *word = r->used + (size_t)j * r->words + (i >> 6);
  FLCell *cell = r->cells + (size_t)j * r->w + i;
  uint64_t bit = UINT64_C(1) << (i & 63);
  int area = (f1 + f2) * d;
  if (*word & bit) {
    cell->cover = (int32_t)((uint32_t)cell->cover + d);
    cell->area = (int32_t)((uint32_t)cell->area + area);
  } else {
    *word |= bit;
    cell->cover = d;
    cell->area = area;
    if (y < r->ymin)
      r->ymin = y;
    if (y > r->ymax)
      r->ymax = y;
  }
}

static void fl_row(FLDense *r, int ey, int x1, int y1, int x2, int y2) {
  int delta = y2 - y1;
  if (!delta || ey < r->y0 || ey >= r->y1)
    return;
  int ex1 = x1 >> 8, ex2 = x2 >> 8;
  if (ex1 == ex2) {
    fl_mark(r, ey, ex1, x1 - ex1 * 256, x2 - ex1 * 256, delta);
    return;
  }
  int dx = x2 - x1, fx = x1 - ex1 * 256, fy = y1;
  if (x2 > x1) {
    if (ex1 < r->x0) {
      if (ex2 < r->x0) {
        fl_mark(r, ey, r->x0, 0, 0, delta);
        return;
      }
      int cross = y1 + ((int64_t)(r->x0 * 256 - x1) * delta) / dx;
      fl_mark(r, ey, r->x0, 0, 0, cross - fy);
      fy = cross;
      ex1 = r->x0;
      fx = 0;
    }
    while (ex1 < ex2 && ex1 < r->x1) {
      int ny = y1 + ((int64_t)((ex1 + 1) * 256 - x1) * delta) / dx;
      fl_mark(r, ey, ex1, fx, 256, ny - fy);
      fy = ny;
      fx = 0;
      ++ex1;
    }
    if (ex1 < r->x1)
      fl_mark(r, ey, ex1, fx, x2 - ex2 * 256, y2 - fy);
  } else {
    if (ex1 >= r->x1) {
      if (ex2 >= r->x1)
        return;
      fy = y1 + ((int64_t)(r->x1 * 256 - x1) * delta) / dx;
      ex1 = r->x1 - 1;
      fx = 256;
    }
    while (ex1 > ex2 && ex1 >= r->x0) {
      int ny = y1 + ((int64_t)(ex1 * 256 - x1) * delta) / dx;
      fl_mark(r, ey, ex1, fx, 0, ny - fy);
      fy = ny;
      fx = 256;
      --ex1;
    }
    if (ex1 < r->x0)
      fl_mark(r, ey, r->x0, 0, 0, y2 - fy);
    else
      fl_mark(r, ey, ex1, fx, x2 - ex2 * 256, y2 - fy);
  }
}

// Walk long edges with an exact quotient/remainder step. The boundary is
// always between the edge's endpoints, so the sign of the quotient is fixed.
// This is the same truncation as (boundary - start) * dx / dy at each row.
typedef struct {
  int q, step_q;
  uint32_t r, step_r, divisor;
} FLStep;

static inline FLStep fl_step(uint64_t first, uint64_t step, uint32_t divisor) {
  return (FLStep){(int)(first / divisor), (int)(step / divisor),
                  first % divisor, step % divisor, divisor};
}

static inline void fl_advance(FLStep *s) {
  s->q += s->step_q;
  s->r += s->step_r;
  if (s->r >= s->divisor) {
    s->r -= s->divisor;
    ++s->q;
  }
}

static void fl_edge(FLDense *r, int x1, int y1, int x2, int y2) {
  int dy = y2 - y1;
  if (!dy)
    return;
  int ey1 = y1 >> 8, ey2 = y2 >> 8;
  if ((ey1 < r->y0 && ey2 < r->y0) || (ey1 >= r->y1 && ey2 >= r->y1))
    return;
  if (ey1 == ey2) {
    fl_row(r, ey1, x1, y1 - ey1 * 256, x2, y2 - ey1 * 256);
    return;
  }
  int dx = x2 - x1, x = x1, y = y1;
  if (dy > 0) {
    if (ey1 < r->y0) {
      y = r->y0 * 256;
      x = x1 + ((int64_t)(y - y1) * dx) / dy;
      ey1 = r->y0;
    }
    const int limit = ey2 < r->y1 ? ey2 : r->y1;
    if (dx == 0) {
      const int ex = x1 >> 8, fx = x1 - ex * 256;
      while (ey1 < limit) {
        const int ny = (ey1 + 1) * 256;
        fl_mark(r, ey1++, ex, fx, fx, ny - y);
        y = ny;
      }
    } else if (limit - ey1 >= 5) {
      const uint32_t magnitude = dx < 0 ? -dx : dx;
      const int sign = dx < 0 ? -1 : 1;
      FLStep step = fl_step((uint64_t)((ey1 + 1) * 256 - y1) * magnitude,
                            (uint64_t)256 * magnitude, dy);
      while (ey1 < limit) {
        const int ny = (ey1 + 1) * 256, nx = x1 + sign * step.q;
        fl_row(r, ey1++, x, y - (ny - 256), nx, 256);
        fl_advance(&step);
        x = nx;
        y = ny;
      }
    } else {
      while (ey1 < limit) {
        const int ny = (ey1 + 1) * 256,
                  nx = x1 + ((int64_t)(ny - y1) * dx) / dy;
        fl_row(r, ey1++, x, y - (ny - 256), nx, 256);
        x = nx;
        y = ny;
      }
    }
    if (ey1 < r->y1)
      fl_row(r, ey1, x, y - ey1 * 256, x2, y2 - ey1 * 256);
  } else {
    if (ey1 >= r->y1) {
      y = r->y1 * 256;
      x = x1 + ((int64_t)(y - y1) * dx) / dy;
      ey1 = r->y1 - 1;
    }
    if (ey1 == ey2) {
      if (ey1 >= r->y0)
        fl_row(r, ey1, x, y - ey1 * 256, x2, y2 - ey1 * 256);
      return;
    }
    int nx = x1 + ((int64_t)(ey1 * 256 - y1) * dx) / dy;
    if (ey1 >= r->y0)
      fl_row(r, ey1, x, y - ey1 * 256, nx, 0);
    x = nx;
    --ey1;
    const int limit = ey2 > r->y0 - 1 ? ey2 : r->y0 - 1;
    if (dx == 0) {
      const int ex = x1 >> 8, fx = x1 - ex * 256;
      while (ey1 > limit)
        fl_mark(r, ey1--, ex, fx, fx, -256);
    } else if (ey1 - limit >= 5) {
      const uint32_t magnitude = dx < 0 ? -dx : dx;
      const int sign = dx < 0 ? -1 : 1;
      FLStep step = fl_step((uint64_t)(y1 - ey1 * 256) * magnitude,
                            (uint64_t)256 * magnitude, -dy);
      while (ey1 > limit) {
        nx = x1 + sign * step.q;
        fl_row(r, ey1--, x, 256, nx, 0);
        fl_advance(&step);
        x = nx;
      }
    } else {
      while (ey1 > limit) {
        nx = x1 + ((int64_t)(ey1 * 256 - y1) * dx) / dy;
        fl_row(r, ey1--, x, 256, nx, 0);
        x = nx;
      }
    }
    if (ey1 >= r->y0)
      fl_row(r, ey1, x, 256, x2, y2 - ey1 * 256);
  }
}

static inline int fl_fixed(double v) {
  if (!(v >= -1.7976931348623157e308 && v <= 1.7976931348623157e308))
    return 0;
  if (v > 1048576.0)
    v = 1048576.0;
  if (v < -1048576.0)
    v = -1048576.0;
  double fixed = v * 256.0;
  int whole = (int)fixed;
  double fraction = fixed - whole;
  return whole + (fraction >= 0.5) - (fraction <= -0.5);
}

static inline int fl_cov(int64_t area, int odd) {
  int64_t cov = area >> 9;
  if (cov < 0)
    cov = -cov;
  if (!odd)
    return cov >= 256 ? 256 : (int)cov;
  cov &= 511;
  return cov > 256 ? (int)(512 - cov) : (int)cov;
}

static inline void fl_span(FLDense *r, int y, int x, int len, int cov) {
  if (!cov || len <= 0 || r->n > r->cap)
    return;
  int idx = r->n * 2;
  if (r->n && (uint32_t)r->out[idx - 2] >> 16 == (uint32_t)y) {
    uint32_t a = r->out[idx - 2], b = r->out[idx - 1];
    if ((int)((a & 65535) + (b >> 8)) == x && (int)(b & 255) == cov - 1) {
      r->out[idx - 1] = (int32_t)(((b >> 8) + len) * 256 + (cov - 1));
      if (x + len > r->maxx)
        r->maxx = x + len;
      return;
    }
  }
  if (r->n == r->cap) {
    ++r->n;
    return;
  }
  r->out[idx] = (int32_t)(((uint32_t)y << 16) | x);
  r->out[idx + 1] = len * 256 + (cov - 1);
  ++r->n;
  if (x < r->minx)
    r->minx = x;
  if (x + len > r->maxx)
    r->maxx = x + len;
  if (y < r->miny)
    r->miny = y;
  if (y + 1 > r->maxy)
    r->maxy = y + 1;
}

// Allocation is separate so bounded leaf callers can reserve before borrowing
// Dart storage. The general raster call keeps its existing growth behavior.
FL_EXPORT int32_t fl_dense_reserve(void *state, int32_t width, int32_t height) {
  FLDense *r = state;
  if (!r || width <= 0 || height <= 0 || width > 65535 || height > 65535) return 0;
  const size_t nc = (size_t)width * height;
  const size_t nw = (size_t)((width + 63) / 64) * height;
  if (nc > 262144) return 0;
  if (nc > r->cell_cap) {
    FLCell *p = realloc(r->cells, nc * sizeof(FLCell));
    if (!p)
      return 0;
    r->cells = p;
    r->cell_cap = nc;
  }
  if (nw > r->used_cap) {
    uint64_t *p = realloc(r->used, nw * sizeof(uint64_t));
    if (!p)
      return 0;
    r->used = p;
    r->used_cap = nw;
  }
  return 1;
}

static int32_t fl_dense_run(FLDense *r, const double *x, const double *y,
                           const int32_t *start, const int32_t *end,
                           int32_t contours, int32_t x0, int32_t y0,
                           int32_t x1, int32_t y1, int32_t odd,
                           int32_t *out, int32_t cap, int32_t *bounds) {
  r->x0 = x0;
  r->y0 = y0;
  r->x1 = x1;
  r->y1 = y1;
  r->w = x1 - x0;
  r->words = (r->w + 63) / 64;
  const size_t nw = (size_t)r->words * (y1 - y0);
  memset(r->used, 0, nw * sizeof(uint64_t));
  r->ymin = y1;
  r->ymax = y0 - 1;
  r->out = out;
  r->cap = cap;
  r->n = 0;
  r->minx = r->miny = 0x7fffffff;
  r->maxx = r->maxy = 0;
  for (int k = 0; k < contours; ++k) {
    int a = start[k], b = end[k];
    if (b - a < 2)
      continue;
    int sx = fl_fixed(x[a]), sy = fl_fixed(y[a]), ax = sx, ay = sy;
    for (int i = a + 1; i < b; ++i) {
      int bx = fl_fixed(x[i]), by = fl_fixed(y[i]);
      fl_edge(r, ax, ay, bx, by);
      ax = bx;
      ay = by;
    }
    fl_edge(r, ax, ay, sx, sy);
  }
  for (int cy = r->ymin; cy <= r->ymax; ++cy) {
    int col = x0;
    int64_t cover = 0;
    const uint64_t *mask = r->used + (size_t)(cy - y0) * r->words;
    const FLCell *row = r->cells + (size_t)(cy - y0) * r->w;
    for (int w = 0; w < r->words; ++w) {
      uint64_t word = mask[w];
      while (word) {
        int ix = w * 64 + fl_ctz(word), cx = x0 + ix;
        word &= word - 1;
        if (cx > col && cover)
          fl_span(r, cy, col, cx - col, fl_cov(cover * 512, odd));
        cover += row[ix].cover;
        fl_span(r, cy, cx, 1, fl_cov(cover * 512 - row[ix].area, odd));
        col = cx + 1;
      }
    }
    if (cover && col < x1)
      fl_span(r, cy, col, x1 - col, fl_cov(cover * 512, odd));
  }
  if (r->n > r->cap)
    return -1;
  bounds[0] = r->minx;
  bounds[1] = r->miny;
  bounds[2] = r->maxx;
  bounds[3] = r->maxy;
  return r->n;
}

static inline uint32_t fl_scale_premul(uint32_t premul, uint32_t factor256) {
  if (factor256 >= 256) return premul;
  if (!factor256 || !premul) return 0;
  uint32_t rb = ((((premul & 0x00FF00FF) * factor256) + 0x00800080) >> 8) & 0x00FF00FF;
  uint32_t ag = ((((premul >> 8) & 0x00FF00FF) * factor256) + 0x00800080) & 0xFF00FF00;
  return rb | ag;
}

static inline uint32_t fl_src_over(uint32_t src, uint32_t dst) {
  if (!src) return dst;
  const uint32_t alpha = src >> 24;
  if (alpha == 255 || !dst) return src;
  const uint32_t inverse = 255 - alpha;
  uint32_t rb0 = (dst & 0x00FF00FF) * inverse + 0x00800080;
  uint32_t rb = ((rb0 + ((rb0 >> 8) & 0x00FF00FF)) >> 8) & 0x00FF00FF;
  uint32_t ag0 = ((dst >> 8) & 0x00FF00FF) * inverse + 0x00800080;
  uint32_t ag = (ag0 + ((ag0 >> 8) & 0x00FF00FF)) & 0xFF00FF00;
  return src + (rb | ag);
}

static void fl_fill_solid(const int32_t *spans, int32_t count,
                          uint32_t *dst, int32_t origin_x, int32_t origin_y,
                          int32_t stride, uint32_t color) {
  if (!dst || !color) return;
  for (int32_t i = 0; i < count * 2; i += 2) {
    const uint32_t xy = (uint32_t)spans[i], run = (uint32_t)spans[i + 1];
    const uint32_t src = fl_scale_premul(color, (run & 255) + 1);
    if (!src) continue;
    const int32_t y = (int32_t)(xy >> 16) - origin_y;
    const int32_t x = (int32_t)(xy & 65535) - origin_x;
    const int32_t len = (int32_t)(run >> 8);
    uint32_t *row = dst + (int64_t)y * stride + x;
    const uint32_t sa = src >> 24;

    if (sa == 255) {
      int32_t p = 0;
#if defined(__ARM_NEON) || defined(__ARM_NEON__)
      uint32x4_t val4 = vdupq_n_u32(src);
      for (; p <= len - 4; p += 4) {
        vst1q_u32(row + p, val4);
      }
#elif defined(__SSE2__) || defined(_M_X64)
      __m128i val4 = _mm_set1_epi32((int)src);
      for (; p <= len - 4; p += 4) {
        _mm_storeu_si128((__m128i*)(row + p), val4);
      }
#endif
      for (; p < len; ++p) {
        row[p] = src;
      }
    } else {
      const uint32_t ia = 255 - sa;
      int32_t p = 0;
#if defined(__ARM_NEON) || defined(__ARM_NEON__)
      if (len >= 4) {
        uint8x16_t s16 = vreinterpretq_u8_u32(vdupq_n_u32(src));
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
        __m128i s16 = _mm_set1_epi32((int)src);
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
      for (; p < len; ++p) {
        row[p] = fl_src_over(src, row[p]);
      }
    }
  }
}

// Negative result: -1 asks the caller to grow the output, -2 falls back to the
// Dart scanline (unsupported bounds or allocation failure).
FL_EXPORT int32_t fl_dense_raster(void *state, const double *x, const double *y,
                                  const int32_t *start, const int32_t *end,
                                  int32_t contours, int32_t x0, int32_t y0,
                                  int32_t x1, int32_t y1, int32_t odd,
                                  int32_t *out, int32_t cap, int32_t *bounds) {
  if (x0 < 0 || y0 < 0 || x1 > 65535 || y1 > 65535 || x0 >= x1 || y0 >= y1 ||
      !fl_dense_reserve(state, x1 - x0, y1 - y0)) return -2;
  return fl_dense_run(state, x, y, start, end, contours,
                      x0, y0, x1, y1, odd, out, cap, bounds);
}

// No allocation or retained pointers. Bound contour indexing, clip and estimated
// edge/sweep work before calling from a VM leaf. Complex draws keep the regular
// call, which can cooperate with GC while native code runs.
FL_EXPORT int32_t fl_dense_raster_borrowed(
    void *state, const double *x, const double *y,
    const int32_t *start, const int32_t *end, int32_t vertices, int32_t contours,
    int32_t x0, int32_t y0, int32_t x1, int32_t y1, int32_t odd,
    int32_t *out, int32_t cap, int32_t *bounds) {
  FLDense *r = state;
  if (!r || vertices < 2 || vertices > 1024 || contours < 1 || contours > 128 ||
      x0 < 0 || y0 < 0 || x1 > 65535 || y1 > 65535 || x0 >= x1 || y0 >= y1 ||
      x1 - x0 > 384 || y1 - y0 > 384 || cap < 1) return -2;
  const int w = x1 - x0, h = y1 - y0;
  if (vertices * (w + h + 4) + w * h > 196608 ||
      (size_t)w * h > r->cell_cap || (size_t)((w + 63) / 64) * h > r->used_cap) return -2;
  int previous = 0;
  for (int i = 0; i < contours; ++i) {
    if (start[i] < previous || end[i] < start[i] || end[i] > vertices) return -2;
    previous = end[i];
  }
  return fl_dense_run(r, x, y, start, end, contours,
                      x0, y0, x1, y1, odd, out, cap, bounds);
}

// Common mobile path: coverage generation and normal solid compositing cross
// the Dart FFI boundary once. The same bounded contract as the borrowed
// raster call keeps this leaf-safe and allocation-free.
FL_EXPORT int32_t fl_dense_raster_solid_borrowed(
    void *state, const double *x, const double *y,
    const int32_t *start, const int32_t *end, int32_t vertices, int32_t contours,
    int32_t x0, int32_t y0, int32_t x1, int32_t y1, int32_t odd,
    int32_t *out, int32_t cap, int32_t *bounds, uint32_t *dst,
    int32_t origin_x, int32_t origin_y, int32_t stride, uint32_t color) {
  FLDense *r = state;
  if (!r || !dst || vertices < 2 || vertices > 1024 || contours < 1 || contours > 128 ||
      x0 < 0 || y0 < 0 || x1 > 65535 || y1 > 65535 || x0 >= x1 || y0 >= y1 ||
      x1 - x0 > 384 || y1 - y0 > 384 || cap < 1 || stride <= 0) return -2;
  const int w = x1 - x0, h = y1 - y0;
  if (vertices * (w + h + 4) + w * h > 196608 ||
      (size_t)w * h > r->cell_cap || (size_t)((w + 63) / 64) * h > r->used_cap) return -2;
  int previous = 0;
  for (int i = 0; i < contours; ++i) {
    if (start[i] < previous || end[i] < start[i] || end[i] > vertices) return -2;
    previous = end[i];
  }
  const int32_t count = fl_dense_run(r, x, y, start, end, contours,
                                     x0, y0, x1, y1, odd, out, cap, bounds);
  if (count >= 0) fl_fill_solid(out, count, dst, origin_x, origin_y, stride, color);
  return count;
}
