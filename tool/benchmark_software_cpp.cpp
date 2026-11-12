#include <iostream>
#include <fstream>
#include <vector>
#include <chrono>
#include <cmath>
#include <algorithm>
#include <numeric>
#include <iomanip>
#include <cstring>
#include <thorvg.h>
#include <rlottie.h>

using namespace std;
using namespace std::chrono;

struct FrameStats {
    double min_us;
    double median_us;
    double p95_us;
    double max_us;
    double mean_us;
    double fps;
    int samples;
};

FrameStats calcStats(vector<double>& times) {
    if (times.empty()) return {0,0,0,0,0,0,0};
    sort(times.begin(), times.end());
    double sum = accumulate(times.begin(), times.end(), 0.0);
    double mean = sum / times.size();
    double min_v = times.front();
    double max_v = times.back();
    double med = times[times.size() / 2];
    size_t p95_idx = min(times.size() - 1, (size_t)(times.size() * 0.95));
    double p95 = times[p95_idx];
    double fps = mean > 0.0 ? 1000000.0 / mean : 0.0;
    return {min_v, med, p95, max_v, mean, fps, (int)times.size()};
}

struct TestFixture {
    string key;
    string path;
    int width;
    int height;
    int warm_loops;
};

void runBenchmark(const vector<TestFixture>& fixtures, const string& outputPath) {
    ofstream out(outputPath);
    out << "{\n";
    out << "  \"engine\": \"cpp_backends\",\n";
    out << "  \"results\": {\n";

    for (size_t fi = 0; fi < fixtures.size(); ++fi) {
        const auto& fix = fixtures[fi];
        cout << "\n=======================================================\n";
        cout << "Benchmarking Fixture: " << fix.key << " (" << fix.width << "x" << fix.height << ")\n";
        cout << "Path: " << fix.path << "\n";
        cout << "=======================================================\n";

        // ----------------------------------------------------
        // 1. RLOTTIE BENCHMARK
        // ----------------------------------------------------
        cout << "--> Running rlottie...\n";
        vector<double> rParseTimes;
        for (int i = 0; i < 10; ++i) {
            auto t0 = high_resolution_clock::now();
            auto anim = rlottie::Animation::loadFromFile(fix.path, false);
            auto t1 = high_resolution_clock::now();
            rParseTimes.push_back(duration_cast<nanoseconds>(t1 - t0).count() / 1000.0);
        }
        FrameStats rParseStats = calcStats(rParseTimes);

        auto rAnim = rlottie::Animation::loadFromFile(fix.path);
        size_t totalFrames = rAnim ? rAnim->totalFrame() : 0;
        vector<uint32_t> rBuffer(fix.width * fix.height);

        // Cold run
        auto coldStart = high_resolution_clock::now();
        if (rAnim) {
            for (size_t f = 0; f < totalFrames; ++f) {
                memset(rBuffer.data(), 0, rBuffer.size() * sizeof(uint32_t));
                rAnim->renderSync(f, rlottie::Surface(rBuffer.data(), fix.width, fix.height, fix.width * 4));
            }
        }
        auto coldEnd = high_resolution_clock::now();
        double rColdTotalUs = duration_cast<nanoseconds>(coldEnd - coldStart).count() / 1000.0;
        double rColdPerFrameUs = totalFrames > 0 ? rColdTotalUs / totalFrames : 0.0;

        // Warm runs
        vector<double> rWarmFrameTimes;
        if (rAnim) {
            for (int loop = 0; loop < fix.warm_loops; ++loop) {
                for (size_t f = 0; f < totalFrames; ++f) {
                    memset(rBuffer.data(), 0, rBuffer.size() * sizeof(uint32_t));
                    auto t0 = high_resolution_clock::now();
                    rAnim->renderSync(f, rlottie::Surface(rBuffer.data(), fix.width, fix.height, fix.width * 4));
                    auto t1 = high_resolution_clock::now();
                    rWarmFrameTimes.push_back(duration_cast<nanoseconds>(t1 - t0).count() / 1000.0);
                }
            }
        }
        FrameStats rWarmStats = calcStats(rWarmFrameTimes);
        cout << "    rlottie: warm median = " << rWarmStats.median_us << " us/frame (" 
             << rWarmStats.fps << " FPS)\n";

        // ----------------------------------------------------
        // 2. THORVG BENCHMARK (Single-threaded: threads = 0)
        // ----------------------------------------------------
        cout << "--> Running ThorVG (single-threaded, threads=0)...\n";
        tvg::Initializer::init(0);

        vector<double> tvgParseTimes;
        for (int i = 0; i < 10; ++i) {
            auto t0 = high_resolution_clock::now();
            auto anim = unique_ptr<tvg::Animation>(tvg::Animation::gen());
            auto pic = anim->picture();
            pic->load(fix.path.c_str());
            auto t1 = high_resolution_clock::now();
            tvgParseTimes.push_back(duration_cast<nanoseconds>(t1 - t0).count() / 1000.0);
        }
        FrameStats tvgParseStats = calcStats(tvgParseTimes);

        vector<uint32_t> tvgBuffer(fix.width * fix.height);
        auto tvgCanvas = unique_ptr<tvg::SwCanvas>(tvg::SwCanvas::gen());
        tvgCanvas->target(tvgBuffer.data(), fix.width, fix.width, fix.height, tvg::ColorSpace::ARGB8888);
        auto tvgAnim = unique_ptr<tvg::Animation>(tvg::Animation::gen());
        auto tvgPic = tvgAnim->picture();
        tvgPic->load(fix.path.c_str());
        tvgPic->size(fix.width, fix.height);
        tvgCanvas->add(tvgPic);

        size_t tvgTotalFrames = (size_t)tvgAnim->totalFrame();

        // Cold run
        auto tvgColdStart = high_resolution_clock::now();
        for (size_t f = 0; f < tvgTotalFrames; ++f) {
            memset(tvgBuffer.data(), 0, tvgBuffer.size() * sizeof(uint32_t));
            tvgAnim->frame((float)f);
            tvgCanvas->update();
            tvgCanvas->draw();
            tvgCanvas->sync();
        }
        auto tvgColdEnd = high_resolution_clock::now();
        double tvgColdTotalUs = duration_cast<nanoseconds>(tvgColdEnd - tvgColdStart).count() / 1000.0;
        double tvgColdPerFrameUs = tvgTotalFrames > 0 ? tvgColdTotalUs / tvgTotalFrames : 0.0;

        // Warm runs
        vector<double> tvgWarmFrameTimes;
        for (int loop = 0; loop < fix.warm_loops; ++loop) {
            for (size_t f = 0; f < tvgTotalFrames; ++f) {
                memset(tvgBuffer.data(), 0, tvgBuffer.size() * sizeof(uint32_t));
                auto t0 = high_resolution_clock::now();
                tvgAnim->frame((float)f);
                tvgCanvas->update();
                tvgCanvas->draw();
                tvgCanvas->sync();
                auto t1 = high_resolution_clock::now();
                tvgWarmFrameTimes.push_back(duration_cast<nanoseconds>(t1 - t0).count() / 1000.0);
            }
        }
        FrameStats tvgWarmStats = calcStats(tvgWarmFrameTimes);
        cout << "    ThorVG (1-thread): warm median = " << tvgWarmStats.median_us << " us/frame (" 
             << tvgWarmStats.fps << " FPS)\n";

        tvg::Initializer::term();

        // ----------------------------------------------------
        // 3. THORVG BENCHMARK (Multi-threaded: threads = 4)
        // ----------------------------------------------------
        cout << "--> Running ThorVG (multi-threaded, threads=4)...\n";
        tvg::Initializer::init(4);
        auto tvgCanvasMt = unique_ptr<tvg::SwCanvas>(tvg::SwCanvas::gen());
        tvgCanvasMt->target(tvgBuffer.data(), fix.width, fix.width, fix.height, tvg::ColorSpace::ARGB8888);
        auto tvgAnimMt = unique_ptr<tvg::Animation>(tvg::Animation::gen());
        auto tvgPicMt = tvgAnimMt->picture();
        tvgPicMt->load(fix.path.c_str());
        tvgPicMt->size(fix.width, fix.height);
        tvgCanvasMt->add(tvgPicMt);

        // Warm runs MT
        vector<double> tvgMtWarmFrameTimes;
        for (int loop = 0; loop < fix.warm_loops; ++loop) {
            for (size_t f = 0; f < tvgTotalFrames; ++f) {
                memset(tvgBuffer.data(), 0, tvgBuffer.size() * sizeof(uint32_t));
                auto t0 = high_resolution_clock::now();
                tvgAnimMt->frame((float)f);
                tvgCanvasMt->update();
                tvgCanvasMt->draw();
                tvgCanvasMt->sync();
                auto t1 = high_resolution_clock::now();
                tvgMtWarmFrameTimes.push_back(duration_cast<nanoseconds>(t1 - t0).count() / 1000.0);
            }
        }
        FrameStats tvgMtWarmStats = calcStats(tvgMtWarmFrameTimes);
        cout << "    ThorVG (4-threads): warm median = " << tvgMtWarmStats.median_us << " us/frame (" 
             << tvgMtWarmStats.fps << " FPS)\n";
        tvg::Initializer::term();

        // Write JSON for this fixture
        out << "    \"" << fix.key << "\": {\n";
        out << "      \"width\": " << fix.width << ",\n";
        out << "      \"height\": " << fix.height << ",\n";
        out << "      \"total_frames\": " << totalFrames << ",\n";
        out << "      \"warm_loops\": " << fix.warm_loops << ",\n";
        out << "      \"rlottie\": {\n";
        out << "        \"parse_median_us\": " << rParseStats.median_us << ",\n";
        out << "        \"cold_frame_avg_us\": " << rColdPerFrameUs << ",\n";
        out << "        \"warm_median_us\": " << rWarmStats.median_us << ",\n";
        out << "        \"warm_min_us\": " << rWarmStats.min_us << ",\n";
        out << "        \"warm_p95_us\": " << rWarmStats.p95_us << ",\n";
        out << "        \"warm_mean_us\": " << rWarmStats.mean_us << ",\n";
        out << "        \"fps\": " << rWarmStats.fps << ",\n";
        out << "        \"samples\": " << rWarmStats.samples << "\n";
        out << "      },\n";
        out << "      \"thorvg_1thread\": {\n";
        out << "        \"parse_median_us\": " << tvgParseStats.median_us << ",\n";
        out << "        \"cold_frame_avg_us\": " << tvgColdPerFrameUs << ",\n";
        out << "        \"warm_median_us\": " << tvgWarmStats.median_us << ",\n";
        out << "        \"warm_min_us\": " << tvgWarmStats.min_us << ",\n";
        out << "        \"warm_p95_us\": " << tvgWarmStats.p95_us << ",\n";
        out << "        \"warm_mean_us\": " << tvgWarmStats.mean_us << ",\n";
        out << "        \"fps\": " << tvgWarmStats.fps << ",\n";
        out << "        \"samples\": " << tvgWarmStats.samples << "\n";
        out << "      },\n";
        out << "      \"thorvg_4threads\": {\n";
        out << "        \"warm_median_us\": " << tvgMtWarmStats.median_us << ",\n";
        out << "        \"warm_min_us\": " << tvgMtWarmStats.min_us << ",\n";
        out << "        \"warm_p95_us\": " << tvgMtWarmStats.p95_us << ",\n";
        out << "        \"warm_mean_us\": " << tvgMtWarmStats.mean_us << ",\n";
        out << "        \"fps\": " << tvgMtWarmStats.fps << ",\n";
        out << "        \"samples\": " << tvgMtWarmStats.samples << "\n";
        out << "      }\n";
        out << "    }" << (fi + 1 < fixtures.size() ? "," : "") << "\n";
    }

    out << "  }\n";
    out << "}\n";
    out.close();
    cout << "\nResults successfully written to: " << outputPath << endl;
}

int main(int argc, char** argv) {
    string outputPath = argc > 1 ? argv[1] : "docs/cpp_benchmark.json";

    vector<TestFixture> fixtures = {
        {"thorvg_segment", "example/assets/thorvg_segment.json", 256, 256, 8},
        {"thorvg_tween", "example/assets/thorvg_tween.json", 512, 512, 6},
        {"static", "example/assets/static.json", 256, 256, 12},
        {"icon", "example/assets/icon.json", 256, 256, 12},
        {"many_shapes", "example/assets/many_shapes.json", 256, 256, 8},
        {"morph", "example/assets/morph.json", 256, 256, 8},
        {"rlottie_gears", "example/assets/rlottie_gears.json", 128, 128, 10},
        {"rlottie_tile_grid", "example/assets/rlottie_tile_grid.json", 256, 256, 8},
        {"rlottie_material_wave", "example/assets/rlottie_material_wave.json", 256, 256, 10}
    };

    runBenchmark(fixtures, outputPath);
    return 0;
}
