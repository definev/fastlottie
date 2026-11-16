#include <math.h>
#include <stdint.h>

#ifndef FL_EXPORT
#if defined(_WIN32)
#define FL_EXPORT __declspec(dllexport)
#else
#define FL_EXPORT __attribute__((visibility("default")))
#endif
#endif

#if defined(__clang__)
#pragma clang fp contract(off)
#elif defined(__GNUC__)
#pragma GCC optimize ("fp-contract=off")
#elif defined(_MSC_VER)
#pragma fp_contract(off)
#endif

typedef struct {
  double *x, *y;
  int32_t start, count, capacity, remaining;
} FLPolyline;

static int vertex(FLPolyline *out, double x, double y) {
  const int32_t n = out->count;
  if (n > out->start &&
      fabs(x - out->x[n - 1]) + fabs(y - out->y[n - 1]) < 1e-7) return 0;
  if (n >= out->capacity) return -1;
  out->x[n] = x;
  out->y[n] = y;
  out->count = n + 1;
  return 0;
}

// Same subdivision, tolerance and rounding order as _PolyPath.addCubic.
// Budget exhaustion falls back to Dart; a leaf call never grows memory.
static int cubic(FLPolyline *out, double x0, double y0, double x1,
                 double y1, double x2, double y2, double x3, double y3,
                 double flatness_sq, int depth) {
  if (--out->remaining < 0) return -2;
  if (depth >= 10) return vertex(out, x3, y3);
  const double dx1 = x1 - (2.0 * x0 + x3) / 3.0;
  const double dy1 = y1 - (2.0 * y0 + y3) / 3.0;
  const double dx2 = x2 - (x0 + 2.0 * x3) / 3.0;
  const double dy2 = y2 - (y0 + 2.0 * y3) / 3.0;
  const double d1 = dx1 * dx1 + dy1 * dy1;
  const double d2 = dx2 * dx2 + dy2 * dy2;
  // A finite JSON number can overflow when stored in a Float32 track.
  // Leave exceptional coordinates to Dart (whose math.max propagates NaN).
  if (isnan(d1) || isnan(d2)) return -2;
  if ((d1 > d2 ? d1 : d2) * 0.5625 <= flatness_sq)
    return vertex(out, x3, y3);
  const double x01 = (x0 + x1) * 0.5, y01 = (y0 + y1) * 0.5;
  const double x12 = (x1 + x2) * 0.5, y12 = (y1 + y2) * 0.5;
  const double x23 = (x2 + x3) * 0.5, y23 = (y2 + y3) * 0.5;
  const double x012 = (x01 + x12) * 0.5, y012 = (y01 + y12) * 0.5;
  const double x123 = (x12 + x23) * 0.5, y123 = (y12 + y23) * 0.5;
  const double mx = (x012 + x123) * 0.5, my = (y012 + y123) * 0.5;
  const int result = cubic(out, x0, y0, x01, y01, x012, y012, mx, my,
                           flatness_sq, depth + 1);
  if (result) return result;
  return cubic(out, mx, my, x123, y123, x23, y23, x3, y3,
               flatness_sq, depth + 1);
}

FL_EXPORT int32_t fl_flatten_bezier(
    const float *pts, int32_t count, int32_t closing_curve,
    double *x, double *y, int32_t start, int32_t capacity,
    double flatness_sq, int32_t transform,
    double a, double b, double c, double d, double tx, double ty) {
  if (!pts || !x || !y || count < 1 || count > 128 || start < 0 ||
      capacity < start || capacity - start > 8192) return -2;
  FLPolyline out = {x, y, start, start, capacity, 8192};
  double lx = pts[0], ly = pts[1];
  int result = vertex(&out, transform ? a * lx + c * ly + tx : lx,
                           transform ? b * lx + d * ly + ty : ly);
  if (result) return result;
  const int limit = closing_curve ? count : count - 1;
  for (int step = 1; step <= limit; ++step) {
    const int p = (step - 1) * 6, k = (step % count) * 6;
    const double ox = pts[p + 4], oy = pts[p + 5];
    const double ix = pts[k + 2], iy = pts[k + 3];
    const double nx = pts[k], ny = pts[k + 1];
    if (fabs(ox) <= 1e-4 && fabs(oy) <= 1e-4 &&
        fabs(ix) <= 1e-4 && fabs(iy) <= 1e-4) {
      result = vertex(&out, transform ? a * nx + c * ny + tx : nx,
                            transform ? b * nx + d * ny + ty : ny);
    } else {
      const double x1 = (double)pts[p] + ox, y1 = (double)pts[p + 1] + oy;
      const double x2 = nx + ix, y2 = ny + iy;
      if (transform) {
        result = cubic(&out,
          a * lx + c * ly + tx, b * lx + d * ly + ty,
          a * x1 + c * y1 + tx, b * x1 + d * y1 + ty,
          a * x2 + c * y2 + tx, b * x2 + d * y2 + ty,
          a * nx + c * ny + tx, b * nx + d * ny + ty, flatness_sq, 0);
      } else {
        result = cubic(&out, lx, ly, x1, y1, x2, y2, nx, ny, flatness_sq, 0);
      }
    }
    if (result) return result;
    lx = nx;
    ly = ny;
  }
  return out.count;
}

typedef struct {
  FLPolyline points;
  int32_t *starts, *ends;
  int32_t contours, contour_capacity;
  double hw, sagitta, miter_sq;
  int32_t cap, join;
} FLStroke;

static int stroke_begin(FLStroke *out) {
  if (out->contours == out->contour_capacity)
    return -1;
  out->points.start = out->points.count;
  out->starts[out->contours] = out->points.count;
  return 0;
}

static void stroke_end(FLStroke *out) {
  FLPolyline *p = &out->points;
  if (p->count - p->start > 1 &&
      fabs(p->x[p->count - 1] - p->x[p->start]) +
              fabs(p->y[p->count - 1] - p->y[p->start]) <
          1e-7)
    --p->count;
  if (p->count > p->start)
    out->ends[out->contours++] = p->count;
}

static int stroke_arc(FLStroke *out, double cx, double cy, double nx0,
                      double ny0, double nx1, double ny1, int depth) {
  if (--out->points.remaining < 0)
    return -2;
  double mx = nx0 + nx1, my = ny0 + ny1;
  const double len_sq = mx * mx + my * my;
  if (len_sq > 1e-12 && depth < 5) {
    const double inv_len = 1.0 / sqrt(len_sq);
    mx *= inv_len;
    my *= inv_len;
    const double sagitta = out->hw * (1.0 - (nx0 * mx + ny0 * my));
    if (depth < 2 || sagitta > out->sagitta) {
      int r = stroke_arc(out, cx, cy, nx0, ny0, mx, my, depth + 1);
      if (r)
        return r;
      r = vertex(&out->points, cx + out->hw * mx, cy + out->hw * my);
      if (r)
        return r;
      return stroke_arc(out, cx, cy, mx, my, nx1, ny1, depth + 1);
    }
  }
  return depth == 0
             ? vertex(&out->points, cx + out->hw * nx1, cy + out->hw * ny1)
             : 0;
}

static int stroke_emit_arc(FLStroke *out, double cx, double cy, double nx0,
                           double ny0, double nx1, double ny1) {
  const int r = stroke_arc(out, cx, cy, nx0, ny0, nx1, ny1, 0);
  return r ? r : vertex(&out->points, cx + out->hw * nx1, cy + out->hw * ny1);
}

static int stroke_join(FLStroke *out, const double *tx, const double *ty,
                       int s0, int s1, double vx, double vy, int reversed) {
  const double sign = reversed ? -1.0 : 1.0;
  const double u0x = tx[s0] * sign, u0y = ty[s0] * sign;
  const double u1x = tx[s1] * sign, u1y = ty[s1] * sign;
  const double n0x = -u0y, n0y = u0x, n1x = -u1y, n1y = u1x;
  const double dot = u0x * u1x + u0y * u1y;
  const double cross = u0x * u1y - u0y * u1x;
  const double hw = out->hw;
  const double ax = vx + hw * n0x, ay = vy + hw * n0y;
  const double bx = vx + hw * n1x, by = vy + hw * n1y;
  if (fabs(cross) < 1e-4 && dot > 0)
    return vertex(&out->points, (ax + bx) * 0.5, (ay + by) * 0.5);
  if (cross >= 0) {
    int r = vertex(&out->points, ax, ay);
    if (r)
      return r;
    r = vertex(&out->points, vx, vy);
    if (r)
      return r;
    return vertex(&out->points, bx, by);
  }
  if (out->join == 1 && 1.0 + dot > 1e-6 &&
      2.0 <= out->miter_sq * (1.0 + dot)) {
    const double scale = hw / (1.0 + dot);
    return vertex(&out->points, vx + (n0x + n1x) * scale,
                  vy + (n0y + n1y) * scale);
  }
  int r = vertex(&out->points, ax, ay);
  if (r)
    return r;
  if (out->join == 2) {
    if (dot < -0.999) {
      r = stroke_emit_arc(out, vx, vy, n0x, n0y, u0x, u0y);
      if (r)
        return r;
      return stroke_emit_arc(out, vx, vy, u0x, u0y, n1x, n1y);
    }
    return stroke_emit_arc(out, vx, vy, n0x, n0y, n1x, n1y);
  }
  return vertex(&out->points, bx, by);
}

// Matches _expandStroke, including its duplicate thresholds and arc order.
// All storage is borrowed. Negative results leave partial output to be ignored.
// Input, output, and arc work are bounded so the FFI call can remain a leaf.
FL_EXPORT int64_t fl_expand_stroke(
    const double *sx, const double *sy, int32_t vertices, const int32_t *starts,
    const int32_t *ends, const uint8_t *closed, int32_t contours, double hw,
    int32_t cap, int32_t join, double miter, double flatness, double *scratch,
    double *x, double *y, int32_t vertex_capacity, int32_t *out_starts,
    int32_t *out_ends, int32_t contour_capacity) {
  if (!sx || !sy || !starts || !ends || !closed || !scratch || !x || !y ||
      !out_starts || !out_ends || vertices < 0 || vertices > 1024 ||
      contours < 0 || contours > 128 || vertex_capacity < 0 ||
      vertex_capacity > 8192 || contour_capacity < 0 ||
      contour_capacity > 256 || !isfinite(hw) || hw <= 0 || hw > 1e100 ||
      !isfinite(miter) || fabs(miter) > 1e100 || !isfinite(flatness))
    return -2;
  FLStroke out = {{x, y, 0, 0, vertex_capacity, 8192},
                  out_starts,
                  out_ends,
                  0,
                  contour_capacity,
                  hw,
                  fmax(0.12, flatness * 0.5),
                  miter * miter,
                  cap,
                  join};
  double *px = scratch, *py = scratch + vertices;
  double *tx = scratch + vertices * 2, *ty = scratch + vertices * 3;
  // Avoid non-finite intermediate normals while retaining the Dart fallback.
  for (int i = 0; i < vertices; ++i)
    if (!isfinite(sx[i]) || !isfinite(sy[i]) || fabs(sx[i]) > 1e100 ||
        fabs(sy[i]) > 1e100)
      return -2;
#define FL_STROKE_TRY(expr)                                                    \
  do {                                                                         \
    const int r = (expr);                                                      \
    if (r)                                                                     \
      return r;                                                                \
  } while (0)
#define FL_STROKE_VERTEX(a, b) FL_STROKE_TRY(vertex(&out.points, (a), (b)))
#define FL_STROKE_ARC(a, b, c, d, e, f)                                        \
  FL_STROKE_TRY(stroke_emit_arc(&out, (a), (b), (c), (d), (e), (f)))
  int previous_end = 0;
  for (int k = 0; k < contours; ++k) {
    const int start = starts[k], end = ends[k];
    if (start < previous_end || end < start || end > vertices)
      return -2;
    previous_end = end;
    int n = 0;
    for (int i = start; i < end; ++i) {
      if (n == 0 || fabs(sx[i] - px[n - 1]) + fabs(sy[i] - py[n - 1]) >= 1e-6) {
        px[n] = sx[i];
        py[n++] = sy[i];
      }
    }
    if (closed[k] == 1 && n > 1 &&
        fabs(px[0] - px[n - 1]) + fabs(py[0] - py[n - 1]) < 1e-6)
      --n;
    if (!n)
      continue;
    if (n == 1) {
      const double cx = px[0], cy = py[0];
      if (cap == 2) {
        FL_STROKE_TRY(stroke_begin(&out));
        FL_STROKE_VERTEX(cx + hw, cy);
        FL_STROKE_ARC(cx, cy, 1, 0, 0, 1);
        FL_STROKE_ARC(cx, cy, 0, 1, -1, 0);
        FL_STROKE_ARC(cx, cy, -1, 0, 0, -1);
        FL_STROKE_ARC(cx, cy, 0, -1, 1, 0);
        stroke_end(&out);
      } else if (cap == 3) {
        FL_STROKE_TRY(stroke_begin(&out));
        FL_STROKE_VERTEX(cx - hw, cy - hw);
        FL_STROKE_VERTEX(cx + hw, cy - hw);
        FL_STROKE_VERTEX(cx + hw, cy + hw);
        FL_STROKE_VERTEX(cx - hw, cy + hw);
        stroke_end(&out);
      }
      continue;
    }
    const int segments = closed[k] == 1 ? n : n - 1;
    for (int s = 0; s < segments; ++s) {
      const int next = (s + 1) % n;
      const double dx = px[next] - px[s], dy = py[next] - py[s];
      const double len = sqrt(dx * dx + dy * dy);
      tx[s] = len > 1e-9 ? dx / len : 0;
      ty[s] = len > 1e-9 ? dy / len : 0;
    }
    FL_STROKE_TRY(stroke_begin(&out));
    if (closed[k] == 1) {
      for (int v = 0; v < n; ++v)
        FL_STROKE_TRY(stroke_join(&out, tx, ty, (v - 1 + segments) % segments,
                                  v, px[v], py[v], 0));
      stroke_end(&out);
      FL_STROKE_TRY(stroke_begin(&out));
      for (int v = n - 1; v >= 0; --v)
        FL_STROKE_TRY(stroke_join(
            &out, tx, ty, v, (v - 1 + segments) % segments, px[v], py[v], 1));
    } else {
      const double s0x = px[0] + hw * -ty[0], s0y = py[0] + hw * tx[0];
      FL_STROKE_VERTEX(cap == 3 ? s0x - hw * tx[0] : s0x,
                       cap == 3 ? s0y - hw * ty[0] : s0y);
      for (int v = 1; v < n - 1; ++v)
        FL_STROKE_TRY(stroke_join(&out, tx, ty, v - 1, v, px[v], py[v], 0));
      const int last = segments - 1;
      const double ex = px[n - 1], ey = py[n - 1], ux = tx[last], uy = ty[last];
      const double plus_x = ex + hw * -uy, plus_y = ey + hw * ux;
      const double minus_x = ex - hw * -uy, minus_y = ey - hw * ux;
      if (cap == 3) {
        FL_STROKE_VERTEX(plus_x + hw * ux, plus_y + hw * uy);
        FL_STROKE_VERTEX(minus_x + hw * ux, minus_y + hw * uy);
      } else if (cap == 2) {
        FL_STROKE_VERTEX(plus_x, plus_y);
        FL_STROKE_ARC(ex, ey, -uy, ux, ux, uy);
        FL_STROKE_ARC(ex, ey, ux, uy, uy, -ux);
      } else {
        FL_STROKE_VERTEX(plus_x, plus_y);
        FL_STROKE_VERTEX(minus_x, minus_y);
      }
      for (int v = n - 2; v >= 1; --v)
        FL_STROKE_TRY(stroke_join(&out, tx, ty, v, v - 1, px[v], py[v], 1));
      const double ax = px[0], ay = py[0], u0x = tx[0], u0y = ty[0];
      const double ax_minus = ax - hw * -u0y, ay_minus = ay - hw * u0x;
      if (cap == 3) {
        FL_STROKE_VERTEX(ax_minus - hw * u0x, ay_minus - hw * u0y);
      } else if (cap == 2) {
        FL_STROKE_VERTEX(ax_minus, ay_minus);
        FL_STROKE_ARC(ax, ay, u0y, -u0x, -u0x, -u0y);
        FL_STROKE_ARC(ax, ay, -u0x, -u0y, -u0y, u0x);
      } else {
        FL_STROKE_VERTEX(ax_minus, ay_minus);
      }
    }
    stroke_end(&out);
  }
#undef FL_STROKE_ARC
#undef FL_STROKE_VERTEX
#undef FL_STROKE_TRY
  return ((int64_t)out.contours << 32) | (uint32_t)out.points.count;
}
