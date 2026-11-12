#include <cstdint>
#include <fstream>
#include <iostream>
#include <iterator>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

#if defined(MEMORY_THORVG)
#include <thorvg.h>
#elif defined(MEMORY_RLOTTIE)
#include <rlottie.h>
#else
#error Define exactly one renderer.
#endif

namespace {
void checkpoint(const char *phase, int cycle, int visible = -1) {
  std::cout << "FASTLOTTIE_RAM {\"phase\":\"" << phase
            << "\",\"cycle\":" << cycle;
  if (visible >= 0)
    std::cout << ",\"visible_pixels\":" << visible;
  std::cout << "}" << std::endl;
  std::string acknowledgement;
  if (!std::getline(std::cin, acknowledgement) || acknowledgement != "continue")
    throw std::runtime_error("Missing acknowledgement");
}

#if defined(MEMORY_THORVG)
void check(tvg::Result result) {
  if (result != tvg::Result::Success)
    throw std::runtime_error("ThorVG error " +
                             std::to_string(static_cast<int>(result)));
}

struct Backend {
  explicit Backend(int threads) { check(tvg::Initializer::init(threads)); }
  ~Backend() { tvg::Initializer::term(); }
};
using Model = tvg::Animation;

std::unique_ptr<Model> load(const std::string &json, int) {
  auto anim = std::unique_ptr<Model>(tvg::Animation::gen());
  if (!anim)
    throw std::runtime_error("Could not create ThorVG animation");
  // Memory load, copied ownership. This does not use a path-based loader cache.
  check(
      anim->picture()->load(json.data(), json.size(), "lottie", nullptr, true));
  return anim;
}
#else
struct Backend {
  explicit Backend(int) { rlottie::configureModelCacheSize(0); }
};
using Model = rlottie::Animation;

std::unique_ptr<Model> load(const std::string &json, int index) {
  auto anim = Model::loadFromData(json, std::to_string(index), "", false);
  if (!anim)
    throw std::runtime_error("Could not load rlottie animation");
  return anim;
}
#endif

class Surface {
public:
  Surface(Model &model, int size)
      : model(model), size(size), pixels(static_cast<size_t>(size) * size) {
    for (size_t p = 0; p < pixels.size(); p += 1024)
      pixels[p] = 0xff000000;
#if defined(MEMORY_THORVG)
    canvas.reset(tvg::SwCanvas::gen(tvg::EngineOption::None));
    if (!canvas)
      throw std::runtime_error("Could not create ThorVG software canvas");
    check(canvas->target(pixels.data(), size, size, size,
                         tvg::ColorSpace::ARGB8888));
    check(model.picture()->size(size, size));
    check(canvas->add(model.picture()));
#endif
  }

  void render(int frame) {
#if defined(MEMORY_THORVG)
    auto result = model.frame(static_cast<float>(frame));
    if (result != tvg::Result::InsufficientCondition)
      check(result);
    result = canvas->update();
    if (result != tvg::Result::InsufficientCondition)
      check(result);
    check(canvas->draw(true));
    check(canvas->sync());
#else
    model.renderSync(
        frame, rlottie::Surface(pixels.data(), size, size, size * 4), false);
#endif
  }

  int visiblePixels() const {
    int visible = 0;
    for (auto pixel : pixels)
      if ((pixel >> 24) != 0)
        ++visible;
    return visible;
  }

private:
  Model &model;
  int size;
  std::vector<uint32_t> pixels;
#if defined(MEMORY_THORVG)
  std::unique_ptr<tvg::SwCanvas> canvas;
#endif
};

void runCycle(const std::string &json, int count, int size, int frames,
              int cycle) {
  std::vector<std::unique_ptr<Model>> models;
  models.reserve(count);
  for (int i = 0; i < count; i++) {
    auto anim = load(json, i);
    const auto available = anim->totalFrame();
    if (available < frames)
      throw std::runtime_error("Fixture has too few frames");
    models.push_back(std::move(anim));
  }
  checkpoint("loaded", cycle);
  std::vector<std::unique_ptr<Surface>> surfaces;
  surfaces.reserve(count);
  for (auto &model : models)
    surfaces.push_back(std::make_unique<Surface>(*model, size));
  checkpoint("bound", cycle);
  for (auto &surface : surfaces)
    surface->render(0);
  checkpoint("first_frame", cycle);
  for (int loop = 0; loop < 2; loop++) {
    for (int f = 0; f < frames; f++) {
      for (auto &surface : surfaces)
        surface->render(f);
    }
  }
  surfaces.front()->render(frames / 2);
  checkpoint("warm", cycle, surfaces.front()->visiblePixels());
  // Canvas/targets are destroyed before their animations.
}
} // namespace

int main(int argc, char **argv) {
  try {
    if (argc != 7)
      throw std::invalid_argument(
          "Expected JSON, count, size, frames, cycles, workers");
    const int count = std::stoi(argv[2]), size = std::stoi(argv[3]);
    const int frames = std::stoi(argv[4]), cycles = std::stoi(argv[5]);
    if (count < 1 || size < 1 || frames < 1 || cycles < 1)
      throw std::invalid_argument(
          "Instances, size, frames and cycles must be positive");
    std::ifstream input(argv[1], std::ios::binary);
    const std::string json{std::istreambuf_iterator<char>(input), {}};
    if (json.empty())
      throw std::runtime_error("Empty fixture");
    Backend backend(std::stoi(argv[6]));
    checkpoint("baseline", 0);
    for (int cycle = 1; cycle <= cycles; cycle++) {
      runCycle(json, count, size, frames, cycle);
      checkpoint("released", cycle);
    }
    checkpoint("settled", cycles);
  } catch (const std::exception &error) {
    std::cerr << error.what() << '\n';
    return 1;
  }
}
