# TGS infinity grid — 2026-11-09

Example mở trực tiếp grid 4 cột. AssetManifest lấy 94 file TGS từ 4 pack đã có trong
`example/assets/tgs`, xen kẽ pack theo hàng. GridView.builder không có itemCount;
index dùng modulo 94 để lặp catalog vô hạn, không tải sticker từ network.

```sh
cd example
flutter run -d macos
```

UI hiện tại chỉ còn bộ chọn `fastlottie` / `lottie` cao 48 logical px và grid trong
SafeArea. Không có AppBar, pause, link comparison, thống kê store, nhãn/nền từng ô,
tooltip hay preview. Cell chờ loading để trống, lỗi hiển thị icon tĩnh. Gallery
không listen thống kê store nên các lượt loading/cache hit không rebuild header.

Padding sticker vẫn là (6, 18, 6, 18), spacing/cột không đổi. Header gọn hơn làm
viewport chứa nhiều hàng hơn: không so trực tiếp FPS snapshot UI cũ với UI mới;
khi đối chiếu hai renderer phải giữ cùng thiết bị, viewport, vị trí scroll và
trạng thái cache. Chưa chạy lại benchmark cho thay đổi UI này.
Kiểm chứng UI: 21 test example pass, analyze sạch; kiểm tra đổi engine, tiếp tục
animation khi cuộn/chạm và không có listener thống kê store trong gallery.
Đợt kiểm tra decode mới đã hot restart thành công trên Pixel, cache đủ 94 model
sau cuộn và không có Dart runtime error; xem [decode notes](tgs-decoding.md).

## Pipeline parsing

1. Chỉ tải asset khi cell được build. `scrollCacheExtent: 0`, không keepAlive cell
   ngoài viewport. Catalog chỉ là danh sách đường dẫn; không preload 94 animation.
2. Store coalesce các lease cùng asset/backend, gom tối đa 2 file mỗi worker.
   Mobile 1 worker đồng thời, platform khác 2; decode và publish UI có queue riêng
   được giới hạn. Scroll ra khỏi vùng nhìn thì bỏ job còn trong queue, kiểm tra
   lease sau đọc asset trước decode. Xem [pipeline decode](tgs-decoding.md).
3. Phát hiện gzip bằng magic 1F 8B, không dựa extension. `archive` dùng native zlib
   trên dart:io, verify gzip + giới hạn output 16 MiB/file; web có Dart fallback.
4. Giải nén, fused UTF-8 JSON decode, validate và compile đều chạy qua compute trên
   isolate native. Fused codec tránh chuỗi UTF-16 JSON trung gian. Payload input là
   compressed bytes nhỏ; kết quả typed graph chuyển về qua Isolate.exit, không
   gửi lại JSON string/map để UI parse lần nữa. Web compute chạy inline.
5. Paint, Path, Shader tạo lazy trên rendering isolate. Composition giữ template
   typed model, không giữ JSON map. Player fork node/state và buffer output riêng,
   dùng chung immutable keyframes/coordinates; tạo player không compile lại JSON.
6. LRU giữ tối đa 128 model / 32 MiB **source-size weight**. Đây không phải giới hạn
   heap native; model đang được lease được pin và có thể vượt budget tới khi release.
   Catalog hiện tại 26,513,872 byte JSON (<32 MiB).
   Quay lại sticker không inflate/parse lại, miễn model chưa bị evict. Hai backend
   có cache key riêng; switch engine không nhầm model native/reference.

Mỗi request chỉ parse engine đã chọn. Lỗi của một file không hủy model tốt khác
trong batch và không đổi engine; không có Auto fallback.

## Render và vòng đời

Stress mode và desktop default dùng vector trực tiếp ở DPR màn hình. Android/iOS
default hiện là LoD raster có budget, mọi cell vẫn chạy khi cuộn; xem `android-performance.md` cho trade-off và số đo trên Pixel 7a. Không
prewarm toàn bộ bitmap của 94 file. Cache model độc lập cache frame. Chỉ cell đang
sống có player; dispose khi ra viewport.
Một ticker chung cho grid chạy theo sample rate cần dùng của các consumer;
cache 30 FPS không còn được kéo ở 60/90 Hz. Painter chỉ notify khi sample đổi.
Reduced motion và TickerMode dừng clock, không rebuild grid mỗi tick.
Mobile có lifecycle observer. Scroll không điều khiển clock/cache ở mọi preset;
LoD không có listener scroll của gallery. Preset Mobile chỉ cập nhật nhóm 8 ô
đang phát trong khi cuộn. Giới hạn 30 FPS của preset này trì hoãn engine-frame
scheduling bằng timer thay vì chỉ gate notify.

Độ nét hiện chỉ theo `tgsLodScale`, không tự giảm theo số frame/budget từng clip;
xem [LoD cố định](lod-cache.md). Scale/FPS/strategy lấy từ cấu hình trong gallery;
các số đo phía dưới là snapshot trước cấu hình này.

Model parsing/caching nằm trong `example/lib/tgs/store.dart`, grid/clock trong
`example/lib/tgs/`, benchmark trong `example/lib/tgs_benchmark.dart`.

## Tập ops thực tế

Đã thêm: precomp với clip và start offset, shape/null parent, spatial position
Bézier (arc-length lookup), nonuniform scale/stroke, linear/radial gradient và
opacity stops, màu gradient động. Transform position/scale dùng temporal easing
chung; point properties có easing riêng theo component. Spatial segment trùng
start/end giữ nguyên điểm như baseline.

Đợt tiếp theo thêm trim simultaneous/individual, dash động, alpha/luma matte
thường/đảo, rectangle direction và morph đổi closure theo source rlottie.
**89/94** file render bằng fastlottie; **5/94** dùng baseline trong Auto:
expression (2), skew (2), effects (1). Ba nhóm này không có xử lý tương ứng trong
local rlottie-master, nên giữ ngoài phạm vi. [Danh sách từng file](tgs-audit.json),
[chi tiết feature và oracle](rlottie-features.md).

Không bỏ qua modifier hoặc giả vờ file đang chạy fastlottie. Core API vẫn throw
UnsupportedLottieException; chỉ example Auto thực hiện fallback có nhãn.

## Kiểm chứng

- Differential pixel: cả 89 file native × 8 frame = 712 samples, so với lottie 3.8.2.
  TGS có hàng trăm outline; gate mean RGBA error <0.65/255, channel lệch >12/255
  <1.6%, flat-region MAE <0.5/255 để tách sai khác AA khỏi màu/geometry nội vùng.
  Các test fixture cũ giữ gate AA <0.6%. Không dùng ngưỡng pixel để đo FPS.
- Worker test: cả 94 TGS parse ở isolate, chuyển model về UI và rasterize thành công
  bằng backend ghi trên ô. Test không chỉ kiểm tra header gzip.
- Oracle C++ rlottie tùy chọn: 12 case × 9 frame cho feature mới, gồm luma matte,
  rectangle winding và closure đổi theo segment mà baseline không đối chiếu đủ.
- Widget tests: 4 cột, build lazy, scroll quá catalog, quay lại cache hit, đổi backend
  thật, reduced motion, queue cancellation, LRU/pinned leases và disposal.
- Runtime: hot restart app đang chạy; thấy 4 cột với sticker thật. Cuộn tới item
  125–140 (vượt 94), quay lại đầu có cache hits và không còn pending parsing.

## Release benchmark trên corpus thật

Snapshot hiện tại: [tgs-features-benchmark-macos.json](tgs-features-benchmark-macos.json),
89 native + 5 fallback; phân tích đầy đủ ở [rlottie-features.md](rlottie-features.md).
Auto cold 94 file: 401.981 ms, baseline 317.698 ms. Warm cache: 0 extra decodes.
Scroll total p95: Auto 6.463 ms, lottie 12.096 ms; idle median tương đương
(Auto 2.721 ms, lottie 2.691 ms). Không kết luận thắng mọi workload/device.

```sh
python3 tool/run_benchmark.py --device macos --target lib/tgs_benchmark.dart \
  --output docs/tgs-features-benchmark-macos.json
```

### Snapshot trước khi mở rộng feature

Các số dưới đây thuộc snapshot 76 native + 18 fallback, giữ để tham khảo lịch sử.
Raw: [tgs-benchmark-macos.json](tgs-benchmark-macos.json), có source+asset SHA-256,
Flutter/Dart/OS, từng asset, backend và lý do fallback. Máy Apple M5, release/AOT,
viewport 800×600 logical, DPR 2. Có app debug khác đang mở; số frame là một lần đo,
không đại diện mọi thiết bị, và chưa có số Android/iOS/web.

| Phép đo | Kết quả |
| --- | ---: |
| Gzip inflate, median / p95 | 0.614 / 4.030 ms |
| Auto parse+validate+compile, median / p95 | 7.252 / 33.372 ms |
| lottie parse, median / p95 | 4.487 / 10.901 ms |
| Cold load 94 Auto, 2 jobs | 649.129 ms |
| Cold load 94 lottie, 2 jobs | 313.891 ms |
| Warm revisit 94 Auto | 0.021 ms, **0 extra decodes** |
| New native player fork, median / p95 | 0.123 / 0.504 ms |
| Fused JSON decode / UTF8→String→JSON, median | 1.569 / 2.100 ms |

Fused decode nhanh khoảng 1.34× so với cách decode qua String trên 12 file mẫu,
60 mẫu/strategy sau warmup, thứ tự luân phiên; không so con số này với streaming
JSON parser riêng của lottie. Fast compiler hiện cold chậm hơn parser lottie;
việc đưa compile ra khỏi UI isolate và cache template loại bỏ chi phí đó khi scroll
lại/tạo player. UI timer 2 ms có gap p95 7.889 ms, max 23.380 ms trong cold batch;
đây là event-loop jitter có scheduling/GC, không phải FrameTiming hay bảo đảm zero jank.

Warm grid, cùng 4 cột/vector/source FPS, model đã preload cho cả hai engine để chỉ
đo render và scroll. Auto gồm 76 native + 18 fallback; **không** gọi đây là benchmark
100% fastlottie. Store benchmark tăng lên 256 model / 64 MiB source weight để giữ
cả hai backend, khác budget production. Scroll driver đi 24 logical px/vsync.
Mỗi hàng bỏ 30 timing warmup, lấy 90 FrameTiming:

| Mode | Trạng thái | Total median | Total p95 |
| --- | --- | ---: | ---: |
| Auto | Idle | 2.752 ms | 5.403 ms |
| lottie | Idle | 3.294 ms | 6.509 ms |
| Auto | Scrolling | 3.257 ms | 7.750 ms |
| lottie | Scrolling | 3.483 ms | 10.523 ms |

Cold batch và warm scrolling là hai phép đo riêng. Chưa đo cold-scroll loading
FrameTiming liên tục hoặc retained heap trên điện thoại. Không suy từ số trên ra
claim parser luôn nhanh hơn baseline, FPS mọi thiết bị, hoặc bộ nhớ heap đúng bằng
source-size weight.

Kiểm chứng đợt feature mới: analyze sạch; **48 test package (có oracle native) +
11 test example pass**. Snapshot mới có fingerprint khớp source và TGS hiện tại;
hai snapshot trước là dữ liệu lịch sử, không gán cho source mới.
