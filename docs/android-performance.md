> Current configuration: fixed `tgsLodScale = 0.2`, cache sampling up to 48 FPS,
> incremental rasterization, no per-clip adaptive resolution. Animations continue
> during scroll. Only fastlottie/lottie are selectable, with minimal gallery UI.
> See [current LoD configuration](lod-cache.md). Measurements and policy details
> below describe earlier snapshots, not this configuration.

# Android: grid nóng máy, raster cache và LoD

Đo trên Pixel 7a / Android 17, Impeller Vulkan, Flutter revision 666d2c4e83.
Các kết quả macOS trước đây không đại diện cho mobile. Người dùng báo khoảng
25 FPS ngay khi đứng yên; bản release cũng có chi phí UI/raster cao.

## Nguyên nhân trong cấu hình cũ

Grid phát mọi sticker đang thấy ở source FPS, `FastLottieCache.none`. Hàng chục
scene Bézier/gradient/matte được chạy lại liên tục. Parsing đã ở worker và model
đã cache, nên không giải quyết được tải render duy trì. Picture/RepaintBoundary
giữ lệnh vẽ, vẫn còn chi phí raster: Impeller Android có thể rasterize lại toàn
screen khi engine nhận frame mới. Bộ đếm chỉ ngừng notify listener cũng chưa đủ
để ngừng Ticker xin engine frame ở display vsync.

Tham khảo: [Flutter profiling](https://docs.flutter.dev/perf/ui-performance),
[saveLayer và frame cost](https://docs.flutter.dev/perf/best-practices).
Source package lottie 3.8.2, `lib/src/lottie.dart`, cũng mô tả việc schedule frame
và reraster trên Impeller trong `_ThrottledTicker`/`skipUnchangedFrames`.

Lúc kiểm tra đầu, Android báo thermal status 3 và cooling CPU hoạt động. Status 3
là severe throttling, 4 là critical theo [PowerManager](https://developer.android.com/reference/android/os/PowerManager).
Không quy toàn bộ 25 FPS cho debug, và không dùng thời gian một frame để suy ra
FPS bằng `1000 / totalSpan`: UI, raster, presentation có pipeline/chờ khác nhau.

## Các chế độ trong example

| Mode | Số animation | Temporal | Spatial/cache |
| --- | --- | --- | --- |
| LoD — mặc định Android/iOS | Mọi cell đang sống | Source FPS | Bắt đầu 0.5×DPR, tự giảm thêm theo budget 2 MiB/cycle/clip, shared 64 MiB |
| Mobile | Tối đa 8 cell | ≤30 FPS, đúng wall-clock | Đúng DPR, incremental cache; cell khác là poster có cache |
| All · raster cache | Mọi cell | Source FPS | Đúng DPR, incremental cache, 64 MiB; clip không vừa budget vẫn vẽ vector |
| Stress | Mọi cell | Source FPS | Vector, cache frame tắt; giữ workload cũ để đối chiếu |

LoD chỉ giảm chi tiết không gian của thumbnail khi idle. Không đổi tốc độ animation, source
frame selection hoặc tự giảm 60 xuống 30 FPS. Cache bắt đầu ở nửa kích thước pixel
theo DPR: 160×160 → 80×80 là 1/4 pixel/frame. Nếu cả cycle vượt 2 MiB thì giảm
đồng đều hai chiều để vừa; clip dài thường có LoD thấp hơn clip ngắn. Bitmap được
phóng lên bằng bilinear filtering. Đây là lựa chọn chất lượng có chủ đích trong
grid, tách biệt với raster đúng DPR ở chế độ thường.

Chạm sticker mở preview vector ở độ nét đầy đủ, không dùng LoD; grid tạm dừng
trong lúc preview mở. Nhấn giữ trong Mobile chọn nhóm hàng chạy animation.
LoD và Mobile tạm dừng animation khi kéo/fling, tiếp tục ở viewport mới khi dừng
cuộn. LoD vẫn capture ảnh độ phân giải thấp cho cell mới trong lúc cuộn; Mobile
tạm dừng cả queue incremental.
Lifecycle background, TickerMode, reduced motion và Pause dừng clock/công việc
cache; không có ticker khi không còn consumer. Mobile dùng timer để trì hoãn cả
việc schedule engine frame, ngoài gate thông báo ở ≤30 FPS.

## Cache mới trong core

`FastLottieRasterCache` được dùng chung bởi nhiều player/widget, có hai strategy:

- `incremental` (mặc định): miss vẫn vẽ vector; queue có giới hạn, tối đa một request
  raster mới mỗi Flutter frame. Hủy request chờ khi player ra viewport. Hợp với
  render đúng DPR, tránh prewarm hàng chục cycle cùng lúc.
- `onDemand` (LoD): miss ghi một Picture, tạo GPU image handle bằng `toImageSync`,
  rồi draw image ngay. Không vẽ thêm một lượt vector đúng DPR trước khi texture
  sẵn sàng. GPU thực sự rasterize bất đồng bộ; API không có nghĩa là chờ GPU trên
  UI isolate. Xem [Picture.toImageSync](https://api.flutter.dev/flutter/dart-ui/Picture/toImageSync.html).

Cache giữ source frame đã thấy, chỉ render lại khi frame/size/LoD đổi. Key gồm
composition identity, pixel content extent và animation/poster mode. Reserve trọn
cycle trước khi admit, tránh LRU nhỏ liên tục xóa frame ngay trước vòng lặp sau.
Entry chưa được player dùng có thể bị evict; entry đang sống được pin. Poster chỉ
reserve một frame; Mobile dành 8 MiB trong cùng budget cho poster, tránh hàng đứng
yên tiếp tục reraster vector. Mọi Path/Paint/image còn nằm trên UI/render isolate.

Budget là retained RGBA payload/reservation, không phải toàn bộ process/GPU heap:
model, native geometry, driver overhead và tối đa một image đang xử lý khi eviction
là chi phí thêm. Fallback lottie có cache riêng tối đa 50 MB do package quản lý.
Nếu không admit được hoặc cache lỗi thì giữ vector fallback; không allocate vượt
budget để cố cache mọi clip. Scale/memory policy cần chọn theo kích thước viewport.

```dart
final raster = FastLottieRasterCache(
  maximumBytes: 64 * 1024 * 1024,
  resolutionScale: .2, // Fixed spatial quality; no per-clip byte cap.
  maximumFrameRate: 48,
  strategy: FastLottieRasterStrategy.incremental,
);

FastLottie(
  composition: composition,
  rasterCache: raster,
  cache: FastLottieCache.none,
);
// Owner gọi raster.dispose() khi không dùng nữa.
```

Caller low-level `player.draw` truyền DPR thực qua `devicePixelRatio`; widget tự
lấy DPR từ MediaQuery. Full-resolution default vẫn là scale 1, source FPS, không
có raster cache trừ khi caller opt in. `prepareRaster` cũ vẫn hoạt động riêng.

## Kiểm chứng và chạy lại

```sh
RLOTTIE_RENDERER=/tmp/fastlottie-render-rlottie flutter test
cd example
flutter test
flutter run --release -d 3C091JEHN14062
```

Test cache bao gồm byte equality đúng DPR, fractional sampling steps, shared
players, whole-cycle admission/pinning/eviction, cancellation, disposal trong lúc
GPU làm việc, static repaint, poster và LoD output so với bitmap tham chiếu có
bilinear upscale. Widget test kiểm tra 4 cột vô hạn, đổi workload, 30 FPS, lifecycle,
pause khi cuộn và preview không dùng LoD. Không gọi hạ temporal FPS là tăng FPS
animation ở cùng workload.

```sh
python3 tool/run_benchmark.py --device 3C091JEHN14062 \
  --target lib/mobile_benchmark.dart --output docs/tgs-android-lod-benchmark.json
```

Harness preload 94 model, đo cold/warm, số frame submit theo vsync timestamps,
UI/raster/total riêng, process CPU ticks, cache hits/bytes và Android thermal state.
Warm chờ 12 giây không đồng nghĩa cache đã đủ; dùng counters để kiểm tra. Probe
vsync chủ động stress pipeline; `natural_idle` bỏ ticker probe, cho thấy lịch chạy
thật của app. Scroll dùng continuous drag 24 logical px/frame. Sau mỗi lần đo,
harness force-stop riêng example để Android không khởi chạy lại Activity sau
`exit()` rồi tiếp tục nung máy. Không đổi thiết lập thermal/charging của máy.

Các snapshot:

- `tgs-android-vector-before.json`: workload cũ trên Android, release.
- `tgs-android-mobile-initial.json`: thử giới hạn 8/30 trước khi cache poster/throttle
  engine frames; còn raster cao. Đây là snapshot lịch sử, không phải bản LoD cuối.
- `tgs-android-lod-benchmark.json`: bản LoD, có fingerprint source+assets và nhiệt
  trước/sau. Không trộn số ở các lần nhiệt khác nhau thành một kết luận speedup.
- `tgs-android-lod-initial.json`: LoD ban đầu trước tối ưu cuộn. Counter cho thấy
  đoạn được gắn nhãn Mobile đã dùng cache LoD, nên đoạn Mobile này **không hợp lệ**.
  Harness cuối dùng root keys riêng, khóa tương tác và kiểm tra policy cache trước
  khi đo; không dùng đoạn sai nhãn để kết luận hiệu năng Mobile.

Không khẳng định đã hạ nhiệt vật lý qua một lần chạy ngắn khi máy đang sạc và đã
throttle. Cần theo dõi tải ổn định nhiều phút trên cùng điều kiện nhiệt để đánh giá
pin/nhiệt; số CPU/frame là bằng chứng giảm công việc, không phải phép đo watt.
