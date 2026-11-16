// clang -O1 -g -fsanitize=address,undefined tool/test_geometry.c \
//   native/fastlottie_geometry.c -lm -o /tmp/geometry-test && /tmp/geometry-test
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

extern int32_t fl_flatten_bezier(const float *, int32_t, int32_t, double *,
    double *, int32_t, int32_t, double, int32_t,
    double, double, double, double, double, double);

static uint32_t state = 7181;
static uint32_t random32(void) {
  state ^= state << 13; state ^= state >> 17; return state ^= state << 5;
}
static void check(int value) { if (!value) abort(); }

int main(void) {
  for (int i = 0; i < 20000; ++i) {
    const int n = 1 + random32() % 128;
    const int capacity = random32() % 8193;
    float *p = malloc((size_t)n * 6 * sizeof(float));
    double *x = malloc((size_t)(capacity + 2) * sizeof(double));
    double *y = malloc((size_t)(capacity + 2) * sizeof(double));
    check(p && x && y);
    for (int j = 0; j < n * 6; ++j) p[j] = (int32_t)random32() / 1000000.0f;
    x[0] = x[capacity + 1] = y[0] = y[capacity + 1] = 7181;
    const int result = fl_flatten_bezier(p,n,random32()&1,x,y,1,capacity+1,
        0.0625,random32()&1,.3,-.6,.1,.9,14,-3);
    check(result == -1 || result == -2 || (result >= 1 && result <= capacity+1));
    check(x[0] == 7181 && x[capacity+1] == 7181 &&
          y[0] == 7181 && y[capacity+1] == 7181);
    free(p);free(x);free(y);
  }
  puts("20000 bounded geometry calls: guards, output growth, work fallback passed");
}
