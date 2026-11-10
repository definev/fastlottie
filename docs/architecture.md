# Architecture và vòng đời

```
JSON bytes → validate/compile → typed tracks + scene → Canvas
                                  ↓                ↓
                       static Path cache      bounded LRU Picture
                                                   ↓ optional explicit prewarm
                                            budgeted raster frames
```

`FastLottieComposition` giữ template typed model thuần Dart; JSON map dùng tạm trong
compile và không được giữ lại. Native `fromBytesAsync`/`loadAsset` inflate gzip/TGS,
parse bằng fused JSON UTF-8 codec và compile qua compute. Paint/Path/Shader tạo lazy
khi draw, nên template có thể chuyển từ isolate về UI mà không chứa native handle.

Mỗi player fork scene nodes, cursor và buffer output riêng, dùng chung immutable
keyframes/coordinates. Player mới không parse/compile lại JSON; template không bao
giờ được dùng để draw trực tiếp. Cache model TGS nằm ở example, có bounded LRU,
coalesced leases và tối đa hai worker jobs. Xem `tgs-grid.md` để biết coverage,
fallback có nhãn, scope memory budget và số đo thực.

`_Track` dùng các cột thời gian, cờ và offset riêng cho keyframe động. Binary
search chỉ đọc cột thời gian khi frame ra khỏi segment hiện tại. Giá trị
`Float32List` được gom theo vector để nội suy tuần tự và dùng chung giữa player;
chỉ cursor và buffer output là riêng. Easing solve x(t) bằng bracketed Newton
trước khi tính y(t). Geometry tĩnh tạo Path một lần, geometry động chỉ tạo lại
khi frame thay đổi. Static flags được memoize. Path của group không bị
invalidated chỉ vì màu/opacity động. Xem [bố cục dữ liệu và số đo](data-layout.md).

Trim dùng alias geometry trong bước compile để modifier tác động cả paint đã bắt
path trước đó và geometry trong nested group. Mỗi modifier giữ input snapshot,
tạo DAG thuần Dart; fork giữ lại shared references trong DAG. Player tạo và cache
PathMetric lazy, tái sử dụng khi geometry tĩnh dù trim động. Full/empty trim không
đo chiều dài. Dash cache path riêng và chỉ invalidate khi geometry hoặc pattern đổi.
Matte nối source liền trước với target, source không vẽ trong stacking thông thường;
chỉ target có matte dùng hai saveLayer với dstIn/dstOut, luma thêm ColorFilter.
Layer thường vẫn vẽ trực tiếp. Chi tiết scope/oracle ở `rlottie-features.md`.

Backend dùng Canvas Flutter và rasterizer của engine. Không có FFI, upload bitmap
CPU mỗi tick, hoặc bản C++ rlottie nhúng vào package. Ý tưởng static/dirty flags,
frame reuse và temporal Bézier được học từ rlottie (xem `plan.md`); implementation
Dart độc lập, không copy code C++.

`FastLottieRasterCache` là cache ảnh dùng chung theo composition identity/pixel size,
reserve trọn cycle trước khi admit và pin entry đang dùng. Strategy incremental
chỉ tạo tối đa một frame mới mỗi Flutter frame; onDemand trả GPU image handle ngay
và để engine rasterize bất đồng bộ, phù hợp thumbnail LoD. Pixel scale/per-entry
budget là opt-in, độc lập temporal FPS. Widget tự lấy DPR; low-level caller truyền
DPR vào draw. Cache poster dùng một frame. Player là Listenable để nhận ảnh async
hoặc cache invalidation ngay cả khi composition tĩnh. Xem `android-performance.md`.

## Ba lựa chọn render

- `FastLottieCache.none`: render vector trực tiếp; ít bộ nhớ, hữu ích với animation
  dài hoặc không lặp.
- Mặc định: LRU `ui.Picture`, tối đa 120 frame và 100000 scene-complexity units.
  Cache key là source frame ở kích thước composition; resize không tạo bản sao.
  Hết budget thì evict LRU. Nếu vòng lặp lớn hơn budget, có thể cache thrash;
  đo workload rồi tăng budget hoặc tắt cache. Đây là budget **ước tính lệnh**, không
  phải giới hạn byte native. Flutter raster work vẫn còn trên cache hit.
- `prepareRaster(width,height,devicePixelRatio,maximumBytes)`: nhận kích thước logical
  và DPR explicit (mặc định 1 để tương thích với lời gọi truyền pixel trực tiếp).
  Sau khi hoàn tất mỗi draw chỉ drawImageRect. Static composition dùng một image.
  RGBA payload = ceil(width × DPR) × ceil(height × DPR) × frameCount × 4; reject trước khi
  allocate nếu vượt budget, mặc định 32 MiB. Engine/GPU overhead ngoài payload.
  Truyền kích thước hiển thị logical và DPR hiện tại.
  Cấp phát image bằng kích thước pixel làm tròn lên, nhưng giữ riêng content extent
  chưa làm tròn để tránh kéo giãn hình ở DPR/kích thước lẻ. `rasterSize` trả về pixel
  allocation thực; `rasterBytes` tính theo allocation này.
  Image sampling dùng nearest-neighbor; nên chuẩn bị đúng pixel size để giữ hình sắc nét.
  Tăng kích thước hiển thị vượt resolution cache có thể giảm chất lượng.

App mẫu quan sát DPR qua `MediaQuery` trong `didChangeDependencies`, chuẩn bị lại
player khi DPR/layout/composition đổi, và dispose player cũ. Budget demo 64 MiB:
nếu raster đúng độ phân giải vượt budget thì dùng picture cache, không hạ resolution.

`prepareRaster` là async, replace cache atomically sau khi xong; dispose/clear hoặc
lần prepare mới cancel lần đang chạy, dispose mọi image tạm. Caller xử lý Future
error. `clearCache` giải phóng picture và raster; `dispose` idempotent. Không có
cache process-wide giữ animation vô hạn.

`FastLottie` sở hữu player và AnimationController mặc định; nhận controller ngoài
nếu cần. Painter listen trực tiếp animation, tick không rebuild widget. Composition tĩnh không subscribe repaint animation
và không khởi chạy autoplay ticker. Autoplay
tôn trọng MediaQuery.disableAnimations; controller ngoài do caller quản lý.
`FastLottieView` nhận player do caller sở hữu, dùng cho raster prewarm hoặc điều
khiển vòng đời chi tiết; caller dispose player và controller.

## SIMD

`FastLottieOptions(useSimd:true)` bật Float32x4 nội suy những vector >=32 floats
và dùng chung temporal easing. Có scalar tail, không dùng SIMD cho component easing
khác nhau. Các pixel tests so SIMD với `lottie`. Benchmark có mode
`fast_simd_uncached` để đo tác động trên cả render pipeline. Mặc định tắt: không
suy diễn từ việc có SIMD instruction sang cải thiện tổng thời gian frame.
Các kernel NEON/SSE của rlottie nằm ở CPU pixel blending; backend Flutter đã
chuyển raster cho engine nên port các kernel đó chưa có lợi ích được chứng minh.
