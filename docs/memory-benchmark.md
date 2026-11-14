# Benchmark RAM: FastLottie, rlottie và ThorVG

Để đo RAM của toàn bộ app example (chat, sticker picker, worker và cache),
xem [benchmark RAM của app example](chat-memory-benchmark.md).

Bộ đo này so **software renderer ghi vào buffer BGRA8888**, mỗi instance có
buffer riêng. Các process không dùng chung runtime. FastLottie chạy Flutter
release/AOT với kernel native; rlottie mặc định build `LOTTIE_THREAD=OFF`;
ThorVG software chạy không có worker. Có tùy chọn đo rlottie với pool và
ThorVG với bốn worker riêng.

## Chạy lại

Cần macOS, Flutter, Xcode/Clang, Python 3, CMake và Ninja. Đặt source rlottie
và ThorVG tương thích với bộ software benchmark tại `rlottie-master/` và
`thorvg-main/`. Runner tự build rlottie release trong thư mục tạm; ThorVG
dùng dylib release đã build từ snapshot tương ứng:

```sh
meson setup thorvg-main/build thorvg-main --buildtype=release \
  -Dengines=cpu -Dloaders=lottie -Dthreads=true -Dsimd=true -Dextra=
meson compile -C thorvg-main/build
python3 tool/run_memory_benchmark.py --output /tmp/renderer-memory.json
```

Nếu đã có `thorvg-main/build`, dùng bản release hiện có hoặc `meson setup
--reconfigure` với cùng tùy chọn. Runner build target Flutter trong bản sao
tạm, không ghi vào thư mục build của app đang phát triển. Dùng
`--work-dir /tmp/fastlottie-ram-build` để giữ bản build dùng lại. Có thể lọc
fixture và engine; ví dụ smoke test và phép so riêng về threading:

```sh
python3 tool/run_memory_benchmark.py --case icon --repeats 1 \
  --output /tmp/renderer-memory-smoke.json
python3 tool/run_memory_benchmark.py --case many-shapes-24 --case morph-churn \
  --engine rlottie-pool --engine thorvg-4w --output /tmp/renderer-memory-threaded.json
```

File JSON chứa từng mốc, physical footprint, RSS, đỉnh footprint do kernel ghi
nhận, cấu hình build, hash source và fixture, cùng median qua các lượt chạy.
Log của từng process nằm cạnh JSON. Runner xác thực thứ tự mốc và kiểm tra
frame giữa timeline có pixel alpha khác 0; đây không phải test ảnh khớp từng
byte giữa các engine.

## Phương pháp

Mỗi lượt dùng process mới. Runner đọc `proc_pid_rusage` khi chương trình con
dừng và chờ xác nhận ở các mốc sau:

1. **Baseline:** runtime/backend đã khởi động và giữ bytes JSON trong RAM.
2. **Loaded:** load hoặc compile model độc lập cho mỗi instance. rlottie
   tắt model cache; ThorVG nạp từ bộ nhớ với quyền sở hữu bản sao.
3. **Bound / first frame:** tạo session, chạm vào các page của buffer đích,
   sau đó render frame đầu tiên. Bước khởi tạo nội bộ có thể rơi vào các mốc
   khác nhau tùy engine; nên so warm khi cần cùng trạng thái.
4. **Warm:** render hai vòng cùng dãy frame nguyên. Bài test có 1 hoặc 24
   instance; bài churn chạy 10 vòng với 16 instance của `morph`.
5. **Released / settled:** hủy canvas và buffer, bỏ tham chiếu model; chờ ít
   nhất 400 ms ở mốc cuối. Backend vẫn khởi tạo. Runner không ép Dart GC hay
   bắt allocator trả page về OS.

Chỉ số chính là **physical footprint** của macOS. Đọc cùng hai cách: RAM
tuyệt đối là tổng chi phí process, còn **Δ baseline** là phần tăng thêm của
workload trong chính process đó. Peak là đỉnh toàn vòng đời process do kernel
báo, không phải tổng các mốc. RSS cũng được lưu để chẩn đoán nhưng không
dùng làm bảng xếp hạng. Tham khảo
[Apple: Measuring memory usage](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use)
và [cấu trúc rusage trong XNU](https://github.com/apple/darwin-xnu/blob/main/bsd/sys/resource.h).

Bộ này không chạy Flutter widget, worker, mini-strip, texture GPU hoặc cache
đĩa. Mỗi session FastLottie trong phép đo vẫn có workspace riêng cho cache
coverage và trạng thái playback. Mặt phẳng cell native dùng chung một cái trên
isolate, vì các session raster tuần tự. Scratch cho matte và precomp xoay chỉ
được cấp khi cần, theo đúng vùng ảnh hưởng. Pipeline widget thực cũng dùng lại
workspace trên worker. Đọc số 24 session như phép đo scaling của API render,
không suy ra RAM của 24 sticker trên màn hình. Một số fixture có sai khác
anti-alias hoặc alpha giữa các engine. RAM cao hơn baseline sau dispose có thể
là heap đã commit, runtime cache hoặc GC chưa chạy; bài churn cho biết xu hướng
tăng nhưng không tự nó chứng minh rò rỉ.

## Kết quả M5

Apple M5 arm64, macOS 27.2, Flutter 3.51 release/AOT, rlottie 0.2, ThorVG
1.2.0. Mỗi ô là median của 3 process độc lập. Đơn vị **MiB**. Bảng warm
hiển thị phần tăng so với baseline của chính process, đã gồm buffer đích.

| Workload | Buffer đích | FastLottie | rlottie | ThorVG |
| --- | ---: | ---: | ---: | ---: |
| `icon` · 1 × 256² | 0.25 | 1.56 | 0.48 | 0.50 |
| `morph` · 1 × 256² | 0.25 | 4.12 | 0.59 | 0.80 |
| `tween` · 1 × 512² | 1.00 | 7.34 | 1.31 | 1.36 |
| `many-shapes-24` · 24 × 256² | 6.00 | 41.75 | 16.92 | 21.53 |
| `tween-24` · 24 × 512² | 24.00 | 48.75 | 25.98 | 27.36 |

Cột FastLottie được đo lại sau khi scratch matte không còn cấp phát sẵn và
mặt phẳng cell native được dùng chung. Cột rlottie và ThorVG giữ median của
lần đo trước trên cùng máy.

- Baseline FastLottie khoảng **63–65 MiB**, gồm Flutter/Dart đã khởi động;
  hai process C++ khoảng **1,1–1,5 MiB**. Ví dụ `tween-24` dùng tổng cộng
  khoảng **112,1 / 27,3 / 28,7 MiB** khi warm theo thứ tự FastLottie /
  rlottie / ThorVG.
- Với `many-shapes-24`, FastLottie đã tăng **29,8 MiB ngay sau load/compile**,
  trước khi tạo buffer đích, so với **2,7 / 3,0 MiB**. Đây là footprint giai
  đoạn load, có thể gồm bộ nhớ tạm của parser và compiler. Thay đổi scratch
  không đụng phần này.
- Với `tween-24`, FastLottie tăng **31,7 MiB** ở mốc bound và **48,8 MiB**
  khi warm, so với **35,8 / 72,6 MiB** trước đó. Cả ba engine đều dùng
  **24 MiB** cho buffer đích. Phần còn lại chủ yếu là scene Dart đã compile
  (khoảng **8,2 MiB** lúc load) và heap phát sinh khi chạy frame, chưa được
  GC trả về trước mốc warm. Sau dispose, delta settled của `tween-24` còn
  **12,5 MiB**, so với **36,3 MiB** ở lần đo trước.
- Ở `many-shapes-24`, tùy chọn threaded dùng **17,50 MiB** trên baseline
  với rlottie pool (serial **16,92**) và **21,89 MiB** với ThorVG 4 worker
  (serial **21,53**). Mốc load threaded của ThorVG có thể gồm việc nạp
  bất đồng bộ; số warm được lấy sau khi mọi canvas đã sync.

| 16 × morph 256², 10 vòng | Peak tuyệt đối | Sau vòng 1, Δ | Sau vòng 10, Δ | Sau settle, Δ |
| --- | ---: | ---: | ---: | ---: |
| fastlottie | 100.56 | 34.52 | 4.72 | 4.73 |
| rlottie | 12.91 | 7.38 | 6.94 | 6.94 |
| thorvg | 14.25 | 8.84 | 9.72 | 12.47 |

Footprint FastLottie giảm mạnh sau vòng đầu và dao động khoảng **3,6–6,7 MiB**
sau các vòng 4–10. Bài test này không thấy FastLottie tăng đều sau mỗi lần
dispose. Số churn là lần đo trước khi đổi scratch và cell plane. Mốc settle
vẫn đo RAM của cả process; nó không phải số byte object còn sống, và không
thay thế một bài leak test của widget trên thiết bị thật.
