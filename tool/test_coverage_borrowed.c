// Run: clang -O1 -g -fsanitize=address,undefined tool/test_coverage_borrowed.c \
//   native/fastlottie_coverage.c -o /tmp/coverage-test && /tmp/coverage-test
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern void *fl_dense_new(void);
extern void fl_dense_free(void *);
extern void fl_dense_trim(void *, int32_t);
extern int32_t fl_dense_reserve(void *, int32_t, int32_t);
extern int32_t fl_dense_raster(void *, const double *, const double *,
    const int32_t *, const int32_t *, int32_t, int32_t, int32_t, int32_t,
    int32_t, int32_t, int32_t *, int32_t, int32_t *);
extern int32_t fl_dense_raster_borrowed(void *, const double *, const double *,
    const int32_t *, const int32_t *, int32_t, int32_t, int32_t, int32_t,
    int32_t, int32_t, int32_t, int32_t *, int32_t, int32_t *);

static uint32_t random_state = 901;
static uint32_t random32(void) {
    random_state ^= random_state << 13;
    random_state ^= random_state >> 17;
    return random_state ^= random_state << 5;
}
static void check(int condition) { if (!condition) abort(); }

int main(void) {
    void *a = fl_dense_new(), *b = fl_dense_new();
    check(a && b);
    for (int iteration = 0; iteration < 10000; ++iteration) {
        const int nv = 3 + random32() % 80;
        const int w = 1 + random32() % 112, h = 1 + random32() % 112;
        const int odd = random32() & 1;
        const int32_t start = 0, end = nv;
        double *x = malloc((size_t)nv * sizeof(double));
        double *y = malloc((size_t)nv * sizeof(double));
        check(x && y);
        for (int i = 0; i < nv; ++i) {
            x[i] = (int)(random32() % 60000) / 256.0 - 50;
            y[i] = (int)(random32() % 60000) / 256.0 - 50;
        }
        const int capacity = w * h;
        int32_t *out_a = malloc((size_t)(capacity * 2 + 1) * sizeof(int32_t));
        int32_t *out_b = malloc((size_t)(capacity * 2 + 1) * sizeof(int32_t));
        int32_t bounds_a[4], bounds_b[4];
        check(out_a && out_b);
        out_a[capacity * 2] = out_b[capacity * 2] = 0x12345678;
        check(fl_dense_reserve(b, w, h));
        const int na = fl_dense_raster(a,x,y,&start,&end,1,0,0,w,h,odd,out_a,capacity,bounds_a);
        const int nb = fl_dense_raster_borrowed(b,x,y,&start,&end,nv,1,0,0,w,h,odd,out_b,capacity,bounds_b);
        check(na >= 0 && nb == na);
        check(!memcmp(out_a, out_b, (size_t)na * 8));
        check(!memcmp(bounds_a, bounds_b, sizeof(bounds_a)));
        if (na > 1) check(fl_dense_raster_borrowed(b,x,y,&start,&end,nv,1,0,0,w,h,odd,out_b,1,bounds_b) == -1);
        check(out_a[capacity * 2] == 0x12345678 && out_b[capacity * 2] == 0x12345678);
        const int32_t bad_start = -1;
        check(fl_dense_raster_borrowed(b,x,y,&bad_start,&end,nv,1,0,0,w,h,odd,out_b,capacity,bounds_b) == -2);
        fl_dense_trim(b, 0);
        check(fl_dense_raster_borrowed(b,x,y,&start,&end,nv,1,0,0,w,h,odd,out_b,capacity,bounds_b) == -2);
        free(x);free(y);free(out_a);free(out_b);
    }
    fl_dense_free(a);fl_dense_free(b);
    puts("10000 coverage draws: exact parity, output growth, trim, bounds passed");
}
