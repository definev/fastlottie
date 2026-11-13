# Benchmarks

Baseline được pin ở `lottie: 3.8.2` trong dev dependency và example. Source của
baseline đã được kiểm tra: package có cả drawingCommands và raster cache, vì vậy
benchmark so sánh cả ba chế độ cho mỗi renderer.
[Package lottie](https://pub.dev/packages/lottie).

Phép đo RAM giữa FastLottie, rlottie và ThorVG chạy riêng. Xem
[benchmark RAM](memory-benchmark.md) để so load, render nhiều instance và
bộ nhớ sau nhiều vòng tạo/hủy.

## Chạy lại

Từ root:

```sh
python3 tool/generate_fixtures.py
flutter test
flutter analyze
python3 tool/run_benchmark.py --device macos --output /tmp/fastlottie-macos.json
python3 tool/run_benchmark.py --device DEVICE_ID --output /tmp/fastlottie-device.json
```

Harness bắt buộc Flutter **release/AOT**. File JSON có thông tin Flutter/Dart/OS,
source SHA-256 (lib, benchmark và assets), ngày UTC, raw distributions. Script
reject kết quả nếu source thay đổi trong khi đo; full process log lưu cạnh JSON.

Fixture deterministic, project tự tạo: `static`, `icon`, `many_shapes` (100 nhóm
shape động), `morph` (8 path × 128 vertices). Mỗi file 256×256, 60 source frames.
Code đo nằm trong `example/lib/benchmark/`; asset trong `example/assets/`.

Kết quả đã lưu bên dưới thuộc source snapshot trước bản sửa DPR (xem SHA-256 trong
raw JSON), dùng raster resolution cố định 256×256 và DPR context=1 cho cả hai renderer.
Không dùng các số này để suy ra hiệu năng hoặc memory của cache Retina/DPR 2–3.
Xem [DPR và raster preparation](dpr-raster.md) để tính dung lượng hiện tại.

Benchmark hiện bật SIMD theo mặc định; `fast_scalar_uncached` chạy riêng cho
fixture `morph`. Các số scalar/SIMD bên dưới thuộc lần đo cũ.

Xem [các target TGS](../example/README.md#comparison-targets) để chạy workload
sticker. Các snapshot lịch sử gồm [TGS 76/94](tgs-benchmark-macos.json),
[TGS 89/94](rlottie-features.md#release-benchmark-sau-khi-mở-rộng) và
[các lần đo Android](android-performance.md).

## Các phép đo riêng biệt

- Parse/compile: 12 mẫu sau 2 warmup, thứ tự hai package luân phiên. fastlottie
  gồm validate và compile; `lottie` gồm parse model. Tạo drawable/player nằm ngoài
  timer draw, vì vậy đây chưa phải toàn bộ startup; raster preparation có timer riêng.
- CPU record: set frame, draw vào Canvas, endRecording; dispose picture sau timer.
  Cold = vòng đầu 60 frame, warm = 12 vòng tiếp. Baseline dùng FrameRate.composition (mặc định), giữ cả cơ chế alias frame tĩnh.
  Source frame hai bên khớp chính xác,
  kể cả việc baseline dùng op - 0.01. Cached baseline vẫn gọi setProgress như API
  thực tế; fastlottie có thể bỏ qua property update trên hit.
- Raster/readback wall: Picture.toImage + toByteData, 20 mẫu sau 4 warmup. Bao gồm
  GPU scheduling, readback và clock variation. Không diễn giải như raster thread
  time hoặc cộng thẳng vào CPU record để suy ra FPS.
- Visible FrameTiming: với many_shapes và morph, render 9 instances trong lưới
  420 logical pixels (co lại theo viewport). Dùng cùng model/player 9 lần mỗi
  frame; đây là workload shared-animation, không phải 9 player độc lập. Bỏ 45
  timing đầu, lấy 90 timing; build, raster, total và tỷ lệ vượt refresh budget.
  Vsync advance một source frame mỗi tick để cả hai renderer làm cùng lượng việc.
  Nếu không đủ mẫu trong 12 giây, JSON ghi unavailable và số mẫu quan sát được;
  không thay missing timing bằng số suy ra từ CPU benchmark.

Raster offscreen cache của cả hai dùng resolution 256×256, DPR context=1.
Visible grid có thể upscale cache trên màn hình DPR cao; số này dùng để so chi phí
cùng resolution, không để chứng minh độ sắc nét ở mọi kích thước.
`fast_raster` prewarm tất cả frame trước timer cold, chi phí ở `prepare_us`.
`lottie_raster` tạo frame lazily trong cold loop; không so cold của hai chế độ như
cùng startup. Warm là điểm so sánh công bằng hơn. Payload RGBA của animation động
là 15 MiB/renderer; static fastlottie chỉ dùng 256 KiB.

Static fixture vẫn bị ép draw trong CPU benchmark để đo chi phí lệnh. Widget
fastlottie dừng repaint khi composition tĩnh; widget `lottie` cũng có cơ chế bỏ
qua frame không đổi. Không dùng hàng static để suy ra mức tiết kiệm pin của widget.

## Đo nhanh compiler

`flutter test --no-pub tool/benchmark_compiler.dart` đo riêng
`FastLottieComposition.fromBytes` trên ba fixture JSON và ba sticker TGS.
Timer gồm giải nén (TGS), parse JSON và compile, không gồm đọc file, tính
`contentKey` hay render. Mỗi giá trị là median của 9 batch sau 3 batch làm nóng,
150 lần tải mỗi batch. Tool cũng in `contentKey` để đối chiếu trước và sau.
Đây là phép đo trong Flutter test; dùng harness release ở trên khi cần số
đại diện cho ứng dụng AOT.

## Cách diễn giải

Các số CPU vài microsecond dễ bị nhiễu; cần nhìn cả p95 và FrameTiming. Chế độ
cache có thể bị ảnh hưởng bởi warmup shader, clock, GPU, nhiệt và lịch OS. Chỉ có
một lần chạy cuối cho mỗi môi trường được lưu ở đây; chưa phải thống kê nhiều
thiết bị. Những file ngoài subset bị reject, không có số đo có ý nghĩa.

Picture cache giảm CPU nhưng vẫn raster vector; CPU nhanh hơn không tự động
nghĩa là tổng frame nhanh hơn. Raster prewarm là đường playback rẻ nhất khi frame
và resolution nằm trong budget. Đổi lại là latency khởi tạo, memory và giới hạn
resolution. Đo trên đúng workload và thiết bị khi chọn chế độ cache hoặc
so sánh SIMD với scalar.

<!-- MEASURED_RESULTS -->

## Kết quả đã đo

Môi trường: Apple M5, Version 27.2 (Build 26B123); Flutter release/AOT, lottie 3.8.2. Đo lúc 2026-11-09T11:13:00.688071Z. Raw: [benchmark-macos.json](benchmark-macos.json).

CPU record median, µs/frame; speedup = lottie / fastlottie (cùng cache mode).

| Fixture | Vector fast / lottie | Speedup | Picture fast / lottie | Raster fast / lottie |
| --- | ---: | ---: | ---: | ---: |
| static | 2.00 / 2.88 | 1.44× | 1.00 / 1.42 | 0.79 / 4.25 |
| icon | 5.62 / 8.38 | 1.49× | 2.46 / 4.62 | 2.29 / 4.00 |
| many_shapes | 49.83 / 90.46 | 1.82× | 6.75 / 14.62 | 0.79 / 9.58 |
| morph | 60.83 / 157.67 | 2.59× | 2.50 / 1.96 | 1.00 / 1.83 |

Visible FrameTiming **total median**, ms, 9 shared-animation instances. Đây là số thực trên UI+raster pipeline, khác với CPU record phía trên.

| Fixture | Mode | fastlottie | lottie | fast / lottie |
| --- | --- | ---: | ---: | ---: |
| many_shapes | uncached | 3.202 | 3.334 | 0.96× |
| many_shapes | picture | 2.821 | 3.509 | 0.80× |
| many_shapes | raster | 0.686 | 0.652 | 1.05× |
| morph | uncached | 2.389 | 2.207 | 1.08× |
| morph | picture | 1.079 | 1.726 | 0.63× |
| morph | raster | 0.593 | 0.705 | 0.84× |

Các mode fastlottie chậm hơn baseline >5% theo total median trong lần đo này: many_shapes/raster (1.05× thời gian), morph/uncached (1.08× thời gian). Không có bảo đảm thắng toàn bộ file hoặc GPU; các regression này vẫn được giữ trong bảng.

| Fixture | Parse+compile fast / parse lottie (µs median) | Prewarm raster fast (ms) | RGBA payload |
| --- | ---: | ---: | ---: |
| static | 38 / 34 | 0.22 | 0.25 MiB |
| icon | 70 / 53 | 10.26 | 15.00 MiB |
| many_shapes | 1247 / 1058 | 20.50 | 15.00 MiB |
| morph | 1074 / 2272 | 19.59 | 15.00 MiB |

SIMD morph: scalar 60.83 µs, Float32x4 56.12 µs (1.08× scalar/SIMD). Scalar là mặc định ở snapshot này. Một lần đo chưa chứng minh lợi ích SIMD ổn định trên toàn pipeline hoặc trên thiết bị khác.

Các số này xác nhận có lợi ích CPU ở subset đã đo, đồng thời cho thấy GPU/raster vẫn có thể chi phối. Raster prewarm nên dùng cho vòng lặp ngắn vừa budget; vector phù hợp khi cần subframe, resize linh hoạt hoặc tránh prewarm latency.
