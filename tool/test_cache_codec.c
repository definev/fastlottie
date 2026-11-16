// Standalone cache codec stress test. Run with ASan and UBSan:
// clang -O1 -g -fsanitize=address,undefined tool/test_cache_codec.c \
//   native/fastlottie_cache.c -o /tmp/fastlottie-cache-test
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

extern int64_t fastlottie_encode_cache_frame(
    const uint8_t *, size_t, uint8_t *, size_t, int32_t *, const uint32_t *);
extern int32_t fastlottie_decode_cache_frame(
    const uint8_t *, size_t, size_t, uint8_t *, size_t, int32_t, uint32_t,
    const uint32_t *);

static uint32_t state = 419;
static uint32_t random32(void) {
    state ^= state << 13;
    state ^= state >> 17;
    return state ^= state << 5;
}

static void check(int condition) {
    if (!condition) abort();
}

int main(void) {
    uint32_t table[256];
    int32_t hash[16384];
    for (unsigned i = 0; i < 256; ++i) {
        uint32_t c = i;
        for (unsigned j = 0; j < 8; ++j) c = c & 1 ? (c >> 1) ^ 0xedb88320u : c >> 1;
        table[i] = c;
    }
    for (unsigned iteration = 0; iteration < 20000; ++iteration) {
        const size_t n = iteration < 100 ? iteration + 1 : 1 + random32() % (256 * 1024);
        uint8_t *src = malloc(n), *dst = malloc(n), *decoded = malloc(n);
        check(src && dst && decoded);
        for (size_t i = 0; i < n; ++i) {
            src[i] = (uint8_t)random32();
            if (i >= 7 && (iteration & 3u) != 0 && random32() % 8 != 0) src[i] = src[i - 7];
            if ((iteration & 3u) == 1) src[i] = (uint8_t)(iteration % 255);
        }
        const int64_t result = fastlottie_encode_cache_frame(src, n, dst, n, hash, table);
        check(result >= 0);
        const size_t stored = (uint32_t)result;
        check(stored > 0 && stored <= n);
        const uint8_t *payload = stored == n ? src : dst;
        check(fastlottie_decode_cache_frame(payload, 0, stored, decoded, n,
              stored == n, (uint32_t)((uint64_t)result >> 32), table));
        check(memcmp(src, decoded, n) == 0);
        // Random malformed blocks with correct CRC exercise decoder bounds.
        const size_t bad_len = 1 + random32() % n;
        uint32_t crc = UINT32_MAX;
        for (size_t i = 0; i < bad_len; ++i) crc = table[(crc ^ src[i]) & 255u] ^ (crc >> 8);
        fastlottie_decode_cache_frame(src, 0, bad_len, decoded, n, 0,
            (crc ^ UINT32_MAX) & 0x7fffffffu, table);
        free(src);
        free(dst);
        free(decoded);
    }
    puts("20000 encoded frames and malformed blocks: ASan/UBSan passed");
}
