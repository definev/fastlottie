// Fixed-point coverage using directly indexed cells and sparse row bitsets.
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

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
  if (!r || vertices < 2 || vertices > 512 || contours < 1 || contours > 64 ||
      x0 < 0 || y0 < 0 || x1 > 65535 || y1 > 65535 || x0 >= x1 || y0 >= y1 ||
      x1 - x0 > 128 || y1 - y0 > 128 || cap < 1) return -2;
  const int w = x1 - x0, h = y1 - y0;
  if (vertices * (w + h + 4) + w * h > 32768 ||
      (size_t)w * h > r->cell_cap || (size_t)((w + 63) / 64) * h > r->used_cap) return -2;
  int previous = 0;
  for (int i = 0; i < contours; ++i) {
    if (start[i] < previous || end[i] < start[i] || end[i] > vertices) return -2;
    previous = end[i];
  }
  return fl_dense_run(r, x, y, start, end, contours,
                      x0, y0, x1, y1, odd, out, cap, bounds);
}
