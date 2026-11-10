# Fastlottie — kế hoạch và tiêu chí

Mục tiêu: giảm tối đa chi phí render Lottie trong Flutter bằng giới hạn ops,
compile trước, bỏ qua dữ liệu tĩnh và tái sử dụng frame. Baseline: `lottie` 3.8.2.

## Các bước

1. Compile JSON sang model có kiểu, validate ops trước khi render.
2. Geometry tĩnh tạo một lần; properties keyframe dùng cursor + binary search khi seek.
   Temporal cubic Bézier, hold, linear; path morph cùng topology.
3. Canvas backend dùng rasterizer Flutter; cache LRU `ui.Picture` có giới hạn số frame
   và tổng số lệnh ước tính. Có chế độ cache off để đo engine thực.
4. Widget nhận Animation<double>, repaint trực tiếp, không rebuild theo mỗi tick;
   hỗ trợ autoplay, asset loading, sizing, vòng đời và reduced motion của Flutter.
5. Differential pixel tests với `lottie`, test rejection, cache/seek/disposal.
6. Benchmark release trên cùng JSON, frame, size: parse/compile, cold draw, warm
   loop, lottie cache off và drawing cache; raster riêng. Lưu raw JSON trong docs.
7. Thử SIMD nội suy path với scalar đối chứng; chỉ bật mặc định nếu AOT giúp ích.

## Tiêu chí hoàn thành

- Public API chạy được trong app example; flutter analyze và test pass.
- Unsupported op báo lỗi có JSON path, không bỏ qua khiến render sai.
- So sánh pixel cho mỗi nhóm ops, kể cả easing, seek, parent, opacity.
- Benchmark thực chạy trong Flutter release, ghi môi trường và giới hạn kết luận.
- Không hứa nhanh hơn mọi file/mọi thiết bị; lưu các regression và trade-off.

## Học từ rlottie (source trong repo)

- `src/lottie/lottiemodel.h`: phân biệt static/animated property, cache data.
- `src/lottie/lottieitem.cpp:159`: early-out nếu frame/view không thay đổi.
- `src/lottie/lottieitem.cpp:1202`: chỉ tạo lại local path khi geometry đổi.
- `src/vector/vinterpolator.cpp`: temporal Bézier cần solve x(t), không dùng t thẳng.
- `src/vector/vdrawhelper_neon.cpp`, `vdrawhelper_sse2.cpp`: SIMD pixel blending
  CPU; backend Flutter không copy bitmap qua FFI mỗi frame. Thử SIMD ở morph
  coordinates, không tự viết software rasterizer khi chưa có profile chứng minh.

Implementation độc lập; không copy source C++ của rlottie.


## Trạng thái triển khai — 2026-11-09

Các bước 1–7 đã triển khai và kiểm chứng trên macOS ARM64. SIMD tồn tại ở dạng
opt-in vì lợi ích whole-pipeline chưa ổn định; mặc định scalar. Đã bổ sung raster
prewarm explicit có RGBA budget để giảm tối đa chi phí phát vòng lặp ngắn.

- `flutter analyze`: no issues.
- `flutter test`: 25 tests pass (differential pixel, real resources, corpus audit,
  seek, cache limits, raster cancellation/disposal, widget lifecycle/static/reduced motion).
- Release benchmark: 4 fixture, đủ 6 mode fast/lottie × vector/picture/raster;
  morph thêm SIMD. many_shapes/morph có đủ 90 FrameTiming mẫu cho mỗi mode.
- `docs/benchmark-macos.json`: raw measurements + môi trường + source fingerprint.
  Fingerprint đã đối chiếu với source hiện tại; `docs/benchmarks.md` có đầy đủ
  median và các regression, không chỉ liệt kê speedup.
- `docs/corpus-audit.json`: 5/93 file resource của rlottie được nhận trong subset;
  cả 5 đã có differential tests; các file còn lại báo feature/path không hỗ trợ.
- Chưa có benchmark Android/iOS: Pixel 7a đã disconnect trước khi chạy. Harness
  có thể chạy lại bằng device id khi có thiết bị, không cần đổi renderer.

Trade-off giữ lại: parse/compile có thể chậm hơn baseline; vector raster vẫn có
regression trên một số scene; cache tăng memory/startup work. Không có claim thắng
mọi file, mọi device, hoặc hỗ trợ toàn bộ Lottie. Đây là implementation subset đã
đo được, kèm công cụ để quyết định các tối ưu tiếp theo bằng số liệu.

Runtime smoke: example macOS debug build đã chạy; VM service kết nối thành công,
hot reload succeeded, `get_runtime_errors` trả về `No runtime errors found`.

## Mốc TGS infinity grid

Example hiện mở grid 4 cột, lặp 94 TGS đã có trong 4 pack. Decode/compile chạy qua
isolate với 2 job, coalesce request, LRU model và fork player từ typed template.
Đã bổ sung precomp/spatial position/nonuniform stroke/gradient; 76 native, 18
fallback có nhãn, Strict mode không tự bỏ qua ops. Chi tiết và giới hạn ở
`tgs-grid.md`; coverage ở `tgs-audit.json`; release run và source+asset fingerprint
ở `tgs-benchmark-macos.json`. Kết quả JSON-fixture trước đó là snapshot lịch sử,
không tự đổi số theo source mới.

Runtime đã hot restart app macOS đang chạy, inspect đúng TgsGallery, cuộn thực
qua item 125–140 rồi về đầu; cache hits tăng và không có runtime errors. Release
TGS benchmark có đủ 90 samples cho cả 4 profile Auto/lottie × idle/scrolling.

## Mốc feature theo rlottie

- Đối chiếu local source trước khi mở rộng: trim, dash, alpha/luma matte có xử lý;
  skew/expression/effects không có, giữ ngoài phạm vi.
- Hoàn tất trim m:1/2, dash động, tt:1..4, rectangle direction và morph đổi closure.
  Typed model vẫn chuyển isolate được, player giữ state/metrics riêng.
- TGS tăng từ 76 lên **89/94** native; 5 file còn lại thuộc ba nhóm đã skip.
  Audit hiện tại: `tgs-audit.json`; resource compile audit: `rlottie-corpus-audit.json`.
- Differential 712 TGS samples với lottie; oracle native 108 samples cho ngữ nghĩa
  feature mới. Không mở rộng đến toàn bộ ops rlottie khi corpus chưa cần.
- Release snapshot mới: `tgs-features-benchmark-macos.json`; snapshot trước giữ
  nguyên để tránh gán số benchmark cũ cho source mới. Xem `rlottie-features.md`.

## Mốc Android / LoD

Đối chiếu trên Pixel 7a thực bằng release: workload vector còn tốn cả UI và raster,
không lấy số macOS làm kết luận cho mobile. Thêm shared raster cache có budget,
poster, LoD 0.5×DPR + cap/cycle, giữ mọi cell ở source FPS khi idle. Preview vector
đúng DPR. LoD/Mobile tạm dừng animation khi cuộn; lifecycle/reduced-motion dừng
clock/cache work. Các mode stress/full-DPR cache/Mobile 8/30 vẫn có để đối chiếu.
Raw, nhiệt và giới hạn phép đo ở `android-performance.md` / `tgs-android-*.json`.
