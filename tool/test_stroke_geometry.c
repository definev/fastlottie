// clang -O1 -g -fsanitize=address,undefined tool/test_stroke_geometry.c \
//   native/fastlottie_geometry.c -lm -o /tmp/stroke-test && /tmp/stroke-test
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

extern int64_t fl_expand_stroke(const double *, const double *, int32_t,
                                const int32_t *, const int32_t *,
                                const uint8_t *, int32_t, double, int32_t,
                                int32_t, double, double, double *, double *,
                                double *, int32_t, int32_t *, int32_t *,
                                int32_t);

static uint32_t state = 26134;
static uint32_t random32(void) {
  state ^= state << 13;
  state ^= state >> 17;
  return state ^= state << 5;
}
static void check(int value) {
  if (!value)
    abort();
}

int main(void) {
  for (int sample = 0; sample < 20000; ++sample) {
    const int n = 1 + random32() % 128;
    const int capacity = random32() % 8193;
    const int contours = random32() % 3;
    double *sx = malloc((size_t)n * sizeof(double));
    double *sy = malloc((size_t)n * sizeof(double));
    double *scratch = malloc((size_t)(n * 4 + 2) * sizeof(double));
    double *x = malloc((size_t)(capacity + 2) * sizeof(double));
    double *y = malloc((size_t)(capacity + 2) * sizeof(double));
    int32_t *starts = malloc((size_t)(contours + 2) * sizeof(int32_t));
    int32_t *ends = malloc((size_t)(contours + 2) * sizeof(int32_t));
    check(sx && sy && scratch && x && y && starts && ends);
    for (int i = 0; i < n; ++i) {
      sx[i] = (int32_t)random32() / 1000000.0;
      sy[i] = (int32_t)random32() / 1000000.0;
      if (i && sample % 3 == 0 && i % 3 == 0) {
        sx[i] = sx[i - 1];
        sy[i] = sy[i - 1];
      }
    }
    if (sample % 17 == 0)
      sx[0] = INFINITY;
    int32_t a = sample % 29 == 0 ? -1 : 0, b = n;
    uint8_t closed = random32() & 1;
    scratch[0] = scratch[n * 4 + 1] = x[0] = x[capacity + 1] = y[0] =
        y[capacity + 1] = 26134;
    starts[0] = starts[contours + 1] = ends[0] = ends[contours + 1] = 26134;
    const int64_t result = fl_expand_stroke(
        sx, sy, n, &a, &b, &closed, 1, .001 + (random32() % 1000) / 10.0,
        1 + random32() % 3, 1 + random32() % 3, 4, .25, scratch + 1, x + 1,
        y + 1, capacity, starts + 1, ends + 1, contours);
    check(
        result == -1 || result == -2 ||
        ((uint32_t)result <= (uint32_t)capacity && (result >> 32) <= contours));
    check(scratch[0] == 26134 && scratch[n * 4 + 1] == 26134 && x[0] == 26134 &&
          x[capacity + 1] == 26134 && y[0] == 26134 &&
          y[capacity + 1] == 26134 && starts[0] == 26134 &&
          starts[contours + 1] == 26134 && ends[0] == 26134 &&
          ends[contours + 1] == 26134);
    free(sx);
    free(sy);
    free(scratch);
    free(x);
    free(y);
    free(starts);
    free(ends);
  }
  puts("20000 bounded stroke calls: buffers, guards, capacity and invalid "
       "inputs passed");
}
