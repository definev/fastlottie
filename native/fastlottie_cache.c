#include <stddef.h>
#include <stdint.h>
#include <string.h>

#if defined(_WIN32)
#define FL_EXPORT __declspec(dllexport)
#else
#define FL_EXPORT __attribute__((visibility("default")))
#endif

#if defined(__aarch64__) && (defined(__ARM_FEATURE_CRC32) || defined(__ANDROID__))
#include <arm_acle.h>
#endif
#if defined(__aarch64__) && defined(__ANDROID__) && !defined(__ARM_FEATURE_CRC32)
#include <asm/hwcap.h>
#include <sys/auxv.h>
#define FL_RUNTIME_ARM_CRC32 1
#endif

#if (defined(__aarch64__) && defined(__ARM_FEATURE_CRC32)) || defined(FL_RUNTIME_ARM_CRC32)
#if defined(FL_RUNTIME_ARM_CRC32)
// Android's default arm64 target does not guarantee CRC instructions. Keep
// them in a separate function and check the kernel's CPU capability first.
__attribute__((target("crc")))
#endif
static uint32_t crc31_arm(const uint8_t *src, size_t count) {
    uint32_t crc = UINT32_MAX;
    while (count >= 8) {
        uint64_t value;
        memcpy(&value, src, sizeof value);
        crc = __crc32d(crc, value);
        src += 8;
        count -= 8;
    }
    while (count--) crc = __crc32b(crc, *src++);
    return (crc ^ UINT32_MAX) & 0x7fffffffu;
}
#endif

static uint32_t crc31(const uint8_t *src, size_t count,
                      const uint32_t *table) {
#if defined(__aarch64__) && defined(__ARM_FEATURE_CRC32)
    (void)table;
    return crc31_arm(src, count);
#else
#if defined(FL_RUNTIME_ARM_CRC32)
    if (count >= 8 && (getauxval(AT_HWCAP) & HWCAP_CRC32)) {
        return crc31_arm(src, count);
    }
#endif
    uint32_t crc = UINT32_MAX;
    while (count--) crc = table[(crc ^ *src++) & 255u] ^ (crc >> 8);
    return (crc ^ UINT32_MAX) & 0x7fffffffu;
#endif
}

static uint32_t read32le(const uint8_t *src) {
    return (uint32_t)src[0] | ((uint32_t)src[1] << 8) |
           ((uint32_t)src[2] << 16) | ((uint32_t)src[3] << 24);
}

static size_t hash4(uint32_t value) {
    return (value * UINT32_C(2654435761)) >> 18;
}

// Same match search, skip policy and raw cutoff as Lz4Codec.compressInto.
// Scratch has 16384 int32 slots. Every read/write stays inside its slice.
static size_t compress_frame(const uint8_t *src, size_t length,
                             uint8_t *dst, int32_t *hash) {
    size_t out = 0, anchor = 0;
    if (length >= 13) {
        for (size_t i = 0; i < 16384; ++i) hash[i] = -1;
        const size_t limit = length - 12, match_limit = length - 5;
        hash[hash4(read32le(src))] = 0;
        size_t ip = 1, forward_hash = hash4(read32le(src + ip));
        for (;;) {
            size_t step = 1, searches = 64, forward = ip, match;
            int32_t candidate;
            do {
                const size_t h = forward_hash;
                ip = forward;
                forward += step;
                step = searches++ >> 6;
                if (forward > limit) goto last_literals;
                forward_hash = hash4(read32le(src + forward));
                candidate = hash[h];
                hash[h] = (int32_t)ip;
            } while (candidate < 0 || ip - (size_t)candidate > 65535 ||
                     read32le(src + candidate) != read32le(src + ip));
            match = (size_t)candidate;
            while (ip > anchor && match > 0 && src[ip - 1] == src[match - 1]) {
                --ip;
                --match;
            }
            for (;;) {
                const size_t literals = ip - anchor, token_pos = out;
                if (out + 1 + literals / 255 + 1 + literals + 2 > length) return length;
                ++out;
                uint8_t token = (uint8_t)((literals >= 15 ? 15 : literals) << 4);
                if (literals >= 15) {
                    size_t extra = literals - 15;
                    while (extra >= 255) { dst[out++] = 255; extra -= 255; }
                    dst[out++] = (uint8_t)extra;
                }
                memcpy(dst + out, src + anchor, literals);
                out += literals;
                const size_t offset = ip - match;
                dst[out++] = (uint8_t)offset;
                dst[out++] = (uint8_t)(offset >> 8);
                size_t cursor = ip + 4, other = match + 4;
                // Compare words without unaligned loads or tail overreads.
                while (cursor + 8 <= match_limit) {
                    uint64_t a, b;
                    memcpy(&a, src + cursor, 8);
                    memcpy(&b, src + other, 8);
                    if (a != b) break;
                    cursor += 8;
                    other += 8;
                }
                while (cursor < match_limit && src[cursor] == src[other]) {
                    ++cursor;
                    ++other;
                }
                const size_t code = cursor - ip - 4;
                if (code >= 15) {
                    token |= 15;
                    size_t extra = code - 15;
                    if (out + extra / 255 + 1 >= length) return length;
                    while (extra >= 255) { dst[out++] = 255; extra -= 255; }
                    dst[out++] = (uint8_t)extra;
                } else {
                    token |= (uint8_t)code;
                }
                dst[token_pos] = token;
                ip = cursor;
                anchor = ip;
                if (ip > limit) goto last_literals;
                hash[hash4(read32le(src + ip - 2))] = (int32_t)(ip - 2);
                const size_t h = hash4(read32le(src + ip));
                candidate = hash[h];
                hash[h] = (int32_t)ip;
                if (candidate < 0 || ip - (size_t)candidate > 65535 ||
                    read32le(src + candidate) != read32le(src + ip)) {
                    ++ip;
                    forward_hash = hash4(read32le(src + ip));
                    break;
                }
                match = (size_t)candidate;
            }
        }
    }
last_literals:;
    const size_t literals = length - anchor;
    const size_t needed = 1 + (literals >= 15 ? (literals - 15) / 255 + 1 : 0) + literals;
    if (out + needed >= length) return length;
    if (literals >= 15) {
        dst[out++] = 0xf0;
        size_t extra = literals - 15;
        while (extra >= 255) { dst[out++] = 255; extra -= 255; }
        dst[out++] = (uint8_t)extra;
    } else {
        dst[out++] = (uint8_t)(literals << 4);
    }
    memcpy(dst + out, src + anchor, literals);
    return out + literals;
}

// Encodes only if smaller than raw. A raw result leaves dst unspecified and
// hashes src. Result packs CRC31 in the high word, stored length in the low
// word; stored length == input length identifies raw, as in the Dart store.
FL_EXPORT int64_t fastlottie_encode_cache_frame(
    const uint8_t *src, size_t length, uint8_t *dst, size_t capacity,
    int32_t *hash, const uint32_t *table
) {
    if (!length || length > 1024 * 1024 || capacity < length) return -1;
    const size_t stored = compress_frame(src, length, dst, hash);
    const uint32_t crc = crc31(stored == length ? src : dst, stored, table);
    return (int64_t)(((uint64_t)crc << 32) | stored);
}

// Expand an LZ4 extension length, rejecting truncation and output overflow.
static int extended_length(const uint8_t **src, const uint8_t *end,
                           size_t *length, size_t limit) {
    uint8_t extra;
    do {
        if (*src == end) return 0;
        extra = *(*src)++;
        if (extra > limit - *length) return 0;
        *length += extra;
    } while (extra == 255);
    return 1;
}

// Exact-size FLC1 payload decoder. Input and output must not alias. No
// overreads or overwrites beyond these slices, including on malformed blocks.
// 0x80000000 skips the checksum for payloads owned by the in-memory cache.
FL_EXPORT int32_t fastlottie_decode_cache_frame(
    const uint8_t *src, size_t src_offset, size_t src_len,
    uint8_t *dst, size_t dst_len, int32_t raw, uint32_t expected_crc,
    const uint32_t *table
) {
    // C is called only for positive lengths from validated Dart slices.
    if (!src_len || !dst_len) return 0;
    src += src_offset;
    if (expected_crc != 0x80000000u &&
        crc31(src, src_len, table) != expected_crc) return 0;
    if (raw) {
        if (src_len != dst_len) return 0;
        memcpy(dst, src, dst_len);
        return 1;
    }

    const uint8_t *end = src + src_len;
    size_t out = 0;
    while (src < end) {
        const uint8_t token = *src++;
        size_t lit = token >> 4;
        if (lit > dst_len - out) return 0;
        if (lit == 15 && !extended_length(&src, end, &lit, dst_len - out)) return 0;
        if (lit > (size_t)(end - src)) return 0;
        memcpy(dst + out, src, lit);
        src += lit;
        out += lit;
        if (src == end) break;

        if (end - src < 2) return 0;
        const size_t offset = (size_t)src[0] | ((size_t)src[1] << 8);
        src += 2;
        if (!offset || offset > out) return 0;

        size_t match = (token & 15u) + 4;
        if (match > dst_len - out) return 0;
        if (match == 19 && !extended_length(&src, end, &match, dst_len - out)) return 0;
        uint8_t *target = dst + out;
        if (offset == 1) {
            memset(target, target[-1], match);
        } else if (offset >= match) {
            memcpy(target, target - offset, match);
        } else {
            // Materialize one period, then double the available prefix. The
            // ranges in each memcpy are disjoint, even for tiny offsets.
            memcpy(target, target - offset, offset);
            for (size_t done = offset; done < match;) {
                const size_t count = done < match - done ? done : match - done;
                memcpy(target + done, target, count);
                done += count;
            }
        }
        out += match;
    }
    return out == dst_len;
}
