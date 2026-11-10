// Local correctness oracle, not linked into the Flutter package.
// Build against rlottie-master; see docs/rlottie-features.md.
#include <rlottie.h>
#include <cstdint>
#include <cstdlib>
#include <fstream>
#include <vector>

int main(int argc, char **argv) {
    if (argc != 6) return 2; // input.json frame width height output.rgba
    auto animation = rlottie::Animation::loadFromFile(argv[1]);
    if (!animation) return 3;
    const auto width = std::strtoul(argv[3], nullptr, 10);
    const auto height = std::strtoul(argv[4], nullptr, 10);
    if (!width || !height || width > 4096 || height > 4096) return 4;
    std::vector<uint32_t> pixels(width * height);
    animation->renderSync(std::strtoul(argv[2], nullptr, 10),
                         rlottie::Surface(pixels.data(), width, height, width * 4));
    std::ofstream output(argv[5], std::ios::binary);
    // Reorder premultiplied ARGB32 to RGBA, matching dart:ui's rawRgba.
    for (const auto pixel : pixels) {
        const uint32_t alpha = pixel >> 24;
        for (int shift : {16, 8, 0}) {
            const uint32_t channel = (pixel >> shift) & 255;
            output.put(static_cast<char>(channel));
        }
        output.put(static_cast<char>(alpha));
    }
    return output ? 0 : 5;
}
