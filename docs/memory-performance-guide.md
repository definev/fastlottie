# Chọn RAM và hiệu năng cho FastLottie

Dùng kích thước ảnh và số animation hoạt động để tính ngân sách cache; dùng
phép đo release để chọn worker và kiểm tra tổng RAM. Không suy ra RAM process
chỉ từ `maximumBytes`. Guide này bám implementation hiện tại và số đo
[Mac M5](chat-graphics-memory-macos.md), ngày 14/11/2026.

Ưu tiên của chat: tự phát, hero vector 160 logical px, giữ nét Retina,
thumbnail 112/96 physical px. Các khoảng dự phòng dưới đây là **heuristic
để bắt đầu thử**, chưa phải cấu hình được benchmark riêng cho mọi thiết bị.
Đơn vị: 1 MiB = 1.048.576 byte; 150 MB thập phân chỉ bằng 143,1 MiB.

## 1. Tính ảnh trước, rồi mới chọn cache

Với ảnh raster đã fit theo aspect ratio:

```text
w = ceil(fittedLogicalWidth  × DPR × resolutionScale)
h = ceil(fittedLogicalHeight × DPR × resolutionScale)
F = 4 × w × h                         // byte BGRA một frame
```

Dùng kích thước nội dung đã fit, không mặc định lấy cả hộp widget nếu ảnh
không vuông. Raster ở đúng physical size, scale = 1, tránh upsample do thiếu
pixel; đây là điểm bắt đầu để giữ nét, không bảo đảm pixel-identical với vector.

Ví dụ hero 160 logical px trên DPR 2 cần ảnh 320 px nếu raster. Giảm từ
220 xuống 160 làm diện tích bằng `(160/220)² = 52,9%`, tức giảm 47,1% số
pixel **của ảnh đó**. Nó không giảm 47,1% RAM toàn app hoặc RAM model vector.
Hero hiện tại vẽ vector nên không có hai buffer raster 320² dành riêng cho hero.

Scale 0,75 giữ 56,25% pixel; scale 0,5 giữ 25%. Không hạ scale chỉ để đạt
ngân sách khi chưa so cạnh nét/chữ nhỏ ở kích thước hiển thị thực. Trong chat,
`StickerSheet` khóa kích thước physical dùng chung giữa avatar, emoji và picker;
112/96 px là chính sách của example, không phải mặc định của mọi FastLottie widget.

## 2. Công thức Mini-Strip / Ping-Pong

Một entry dùng K frame trên mỗi strip, có 1 hàng pixel trong suốt giữa frame:

```text
S = 4 × w × (K × h + K − 1)           // byte mỗi strip
B = 1 nếu clip chỉ có ≤ K sample; ngược lại B = 2
C_entry = B × S
C_active = tổng C_entry của các entry đang dùng
```

Poster/static: một frame, một buffer. K=1 là ping-pong thông thường.
Với clip dài, hai buffer là frame/strip hiện tại và phần đọc trước.
Đây là công thức reservation/payload trong code, chưa gồm mipmap, alignment,
copy/upload đang chạy hoặc tài nguyên driver.

| Kích thước physical | K=1, hai buffer | K=2, hai buffer | K=4, hai buffer |
| --- | ---: | ---: | ---: |
| 64 × 64 | 0,031 MiB | 0,063 MiB | 0,126 MiB |
| 96 × 96 | 0,070 MiB | 0,141 MiB | 0,283 MiB |
| 112 × 112 | 0,096 MiB | 0,192 MiB | 0,385 MiB |
| 320 × 320 | 0,781 MiB | 1,565 MiB | 3,132 MiB |

**Đếm entry độc nhất, không đếm widget.** Cùng contentKey, kích thước,
poster/animation và rate key dùng chung ảnh trong cùng cache. Cùng sticker
ở kích thước hoặc sampling rate khác tạo entry khác. Dùng một cache chung cho
một nhóm có cùng vòng đời, tạo ngoài `build()`, dispose sau các consumer.

Ví dụ có 20 emoji 96² và 10 thumbnail 112², tất cả khác nhau, clip dài:

| K | C_active | Ngân sách khởi điểm có 25% dự phòng |
| --- | ---: | ---: |
| 1 | 2,36 MiB | 3 MiB |
| 2 | 4,75 MiB | 6 MiB |
| 4 | 9,52 MiB | 12 MiB |

25% là chỗ cho entry mới vào viewport và một ít cache vừa rời màn hình, không
phải hệ số chuyển sang Graphics của OS. Có thể dùng 20–30% làm khởi điểm.
Nếu số entry thay đổi lớn, tính bằng tập hoạt động lớn nhất, chẳng hạn picker
và 24 emoji trong composer cùng lúc.

```text
maximumBytes khởi điểm = C_active × (1 + dự phòng)
Giới hạn khả thi tối thiểu = tổng buffer cần thiết khi mọi animation dùng K=1
```

Dưới mức tối thiểu, một số entry bị từ chối. Widget thường có thể fallback
vector; painter inline của example có thể hiện placeholder khi chưa có ảnh.
Cache quá nhỏ vì thế có thể tăng CPU hoặc làm chất lượng hiển thị xấu đi.

Để `stripFrames` không truyền (`null`) cho Mini-Strip tự chọn K và giảm K khi
cần. Hiện code thường chọn K=4 cho frame ≤256 KiB, K=2 cho frame ≤1 MiB,
K=1 cho frame lớn hơn; clip rất ngắn và giới hạn chiều cao strip có ngoại lệ.
**Ép K cố định làm mất khả năng giảm K tự động**, nên chỉ ép khi cần A/B hoặc
đã tính đủ ngân sách. K=1 tiết kiệm ảnh nhưng tăng tần suất dispatch/upload.

## 3. Công thức cho worker và thời gian chờ

Giả sử các entry đang chạy đều đặn, không seek và đủ nhanh để đuổi kịp playback:

```text
λ ≈ Σ(f_i / K_i)                    // strip job/giây
CPU cần ≈ Σ[(f_i / K_i) × t_cpu_i]  // ms CPU mỗi giây
ρ ≈ CPU cần / (1000 × W)             // tải trung bình trên W worker
L95 = p95(queue + đọc/render strip + transfer + upload)
T_lookahead ≈ K / f                  // giây playback trong một strip
```

Muốn đọc trước theo kịp, thử giữ `L95 < T_lookahead`; mục tiêu dự phòng có thể
là `< 0,7 × T_lookahead`. Ví dụ 30 FPS/K=4 cho khoảng 133 ms; K=1 chỉ 33 ms.
Đây là mô hình ổn định, không mô tả frame đầu, seek, lúc cuộn liên tục hoặc
shard quá tải. Worker được chia theo key, nên tổng tải thấp vẫn có thể có một
worker bận hơn các worker khác.

Chọn worker nhỏ nhất đủ tải. Với `t_cpu` đo bằng ms/job:

```text
W khởi điểm = ceil(Σ λ_i × t_cpu_i / (1000 × ρ_mục_tiêu))
ρ_mục_tiêu thử ban đầu = 0,6–0,7
```

Nếu chưa có thời gian CPU từng job: bắt đầu W=1, đo 1 → 2 → 4 lần lượt.
Tăng W khi queue và thời gian có ảnh tăng liên tục, rồi giữ cấu hình nhỏ nhất
đạt yêu cầu. Không dùng wall time gồm queue/upload làm `t_cpu`, cũng không lấy
`FrameTiming.rasterDuration` thay cho thời gian worker.

`maximumInFlight` giới hạn job đang chờ kết quả/upload, không phải số thread.
Thử 2 khi W=1, rồi 4 nếu pipeline thiếu việc và RAM cho phép. Tăng lên chỉ khi
latency giảm; quá nhiều có thể tạo đỉnh RAM mà không tăng throughput.

```text
Pixel tạm đang luân chuyển ~ J × S_trung_bình × a
```

J là số job cùng lúc. Hệ số a phụ thuộc copy/transfer/backend, phải đo; không
mặc định a=1. Buffer scratch và scene của mỗi worker còn có chi phí riêng.

K lớn giảm số job, **không chia lượng pixel xử lý/upload mỗi giây cho K**:
ở trạng thái ổn định vẫn khoảng `Σ(4 × w × h × f)`, cộng gutters/overhead.
Lợi ích chính là giảm chi phí mỗi lần gọi, gom công việc và tăng lookahead.

## 4. FPS, cache nén, model và overscan

| Núm chỉnh | Tác động mong đợi | Giới hạn cần nhớ |
| --- | --- | --- |
| FPS 60 → 30 | Khoảng nửa số sample cần xử lý/giây | Không giảm nửa hai buffer K=1; thay đổi độ mượt chuyển động |
| K 4 → 1 | Payload ảnh gần còn 1/4 | Job/upload thường tăng gần 4 lần, dễ giữ frame cũ |
| Worker 4 → 1 | Ít isolate, workspace, bản scene hơn | Chậm cold render nếu một worker không đủ |
| Cache nén 16 → 2 MiB | Giảm frame nén giữ trong RAM | Tăng disk read hoặc render lại khi miss |
| Model cache 48 → 8 | Giảm model đã rời viewport | Model đang pin vẫn vượt 8; có chi phí parse/compile lại |
| Giảm overscan | Ít widget/model/animation đang mount | Ít thời gian chuẩn bị trước khi item xuất hiện |
| Giảm cache Picture | Ít display list vector giữ lại | Ghi lại lệnh vẽ thường xuyên, tăng build CPU |

`maximumCompressedMemoryBytes` là ngân sách **tổng** chia cho worker, không
nhân nó thêm W. Nó không bao gồm scene, scratch, playback buffers hay heap.
Cache đĩa 128 MiB cũng không đồng nghĩa process dùng thêm 128 MiB RAM; I/O,
page cache và buffer đọc vẫn có chi phí. Đo cả cold và warm disk.

Với clip dài D giây, FPS hiệu dụng f, frame F byte:

```text
Lưu full-loop chưa nén ≈ ceil(D × f) × F
Lưu full-loop nén ≈ tổng kích thước frame/block nén thực tế
```

Không giả định hệ số LZ4 cố định: độ phức tạp và alpha thay đổi theo asset.
Ping-pong/Mini-Strip không cần giữ toàn bộ frame RGBA của cả clip.

Nếu cuộn bị lộ placeholder, chọn overscan theo tốc độ và thời gian chuẩn bị:

```text
E ≈ v_scroll × L_ready95 + margin  // logical px mỗi phía
```

Ví dụ cuộn 1.000 logical px/s, cần 80 ms để có ảnh thì cần ít nhất khoảng
80 px chuẩn bị trước, cộng margin. Với grid n cột, viewport cao H, bước hàng
r (cell + spacing), ước lượng mount ở giữa danh sách:

```text
N_mount ≈ n × [ceil((H + 2E) / r) + 1]
```

Chuyển số này sang entry độc nhất rồi tính lại C_active. Đừng mặc định E=0
là tốt nhất: đây là cấu hình ít RAM đã đo, nhưng có thể cần thêm một hàng để
cuộn mượt. Kiểm tra accessibility khi thay đổi vùng cache: Flutter cũng dùng
vùng này cho implicit accessibility scrolling trên iOS.
[Tài liệu scrollCacheExtent](https://api.flutter.dev/flutter/widgets/ScrollView/scrollCacheExtent.html).

## 5. Tổng RAM: dùng công thức có hiệu chuẩn

```text
M_process ≈ B_render + C_images + C_compressed + H_models_workers + O_peak
```

Các phần phải không trùng nhau: B_render là nền Flutter/UI/graphics không
bao gồm cache đã cộng, H là model/worker/heap còn lại, O là phần cấp phát tạm
và overhead đồ họa. Công thức này là mô hình lập ngân sách, không phải một
phép cộng chính xác các nhóm OS. Nếu baseline đã chứa worker/cache thì chỉ
cộng phần tăng thêm. Không cộng gpuBytes vào tổng footprint đã đo.

Surface có thể dự toán riêng để hiểu diện tích màn hình:

```text
M_surface ≈ số surface × width_physical × height_physical × bytes_per_pixel
```

Mac lượt đo hiện tại: 3 × 1600 × 1200 × 8 / 2²⁰ ≈ 43,95 MiB. Đây đã nằm
trong baseline/tổng OS. Mipmap, upload, blur và driver không có hệ số duy nhất
để nhân với `gpuBytes` cho ra toàn bộ Graphics.

Để hiệu chuẩn cho sản phẩm: đo màn hình thật có cùng text, layout, kích thước,
DPR và cadence render, rồi tăng từng nhóm sticker/cache/worker. Dùng delta
của nhiều lượt, không dùng phép trừ Hello World để gán mọi phần dư cho thư viện.

Mac hiện tại: Hello World động 131,2 MiB; chat cấu hình 160 px khoảng
239–285 MiB tùy workload, đỉnh median 337 MiB. Hello World tĩnh 60,7 MiB
không đại diện cho app render liên tục. Target 150 MiB chỉ để lại khoảng
19 MiB so với Hello World động trong phép đo này; đó là dấu hiệu budget rất
chặt, **không phải bằng chứng 150 MiB bất khả thi trên mọi Flutter app**.

Phân biệt target steady-state với peak. Nếu 150 MiB là giới hạn cả peak thì
cần tối ưu cả parse/upload/cold start; cache steady-state nhỏ chưa đủ.

## 6. Cấu hình dùng ngay và cách điều chỉnh

Cấu hình cache đã được đo trong chat Mac (kết quả còn phụ thuộc các thay đổi UI):

```dart
// Thuộc owner của cả nhóm thumbnail; tạo một lần, dispose khi nhóm kết thúc.
final thumbnails = FastLottieRasterCache.miniStrip(
  maximumBytes: 6 * 1024 * 1024,
  maximumCompressedMemoryBytes: 2 * 1024 * 1024,
  maximumDiskBytes: 128 * 1024 * 1024,
  workerCount: 1,
  maximumInFlight: 2,
  maximumFrameRate: 30,
  // Không truyền stripFrames: cho phép chọn và giảm K tự động.
  // Gắn thư mục disk cache bằng diskCacheDirectory hoặc attachDiskDirectory.
);
```

Ở widget thường, truyền cache này và chọn physical size bằng DPR/scale.
Ở example, `StickerSheet`/painter khóa 112/96 px để nhiều consumer chia sẻ.
Không copy scale 0,5 từ ví dụ khác nếu chưa kiểm tra kích thước đích.

Hero ít và lớn: bắt đầu bằng vector để giữ nét và FPS gốc:

```dart
FastLottie(
  composition: composition,
  width: 160,
  height: 160,
  usePipeline: false,
  useFrameRate: true,
  cache: FastLottieCache.unbounded, // Chính sách hero đã đo trong chat.
);
```

Unbounded chỉ phù hợp khi tập hero mount nhỏ và được dispose đúng vòng đời.
Nó giữ display list theo frame, không phải toàn bộ ảnh RGBA. Nếu số hero/độ
phức tạp tăng, thử giới hạn `maximumFrames`/`maximumCommands` rồi đo lại.
Bài thử giới hạn 12 frame trước đây chỉ giảm RAM ít và làm build tăng; không
mặc định cache nhỏ hơn sẽ làm app tốt hơn. `maximumFrameRate` hiện áp dụng
sampling của raster pipeline, không phải một núm cap FPS cho hero vector.

Trình tự tuning cho từng màn hình:

1. Chốt chất lượng: size/DPR, hero vector, thumbnail resolution và FPS.
2. Đếm tập entry lớn nhất cùng hoạt động; tính C_active cho K=1/2/4.
3. Chọn ngân sách đủ tập đó cộng dự phòng; dùng K tự động.
4. Đo W=1/J=2; chỉ tăng worker/job khi thời gian có ảnh hoặc queue không đạt.
5. Nếu cuộn bị placeholder, tăng overscan nhỏ và tính lại entry/cache.
6. Nếu RAM vẫn cao nhưng cache đã nhỏ, profile model/heap và graphics nền;
   không tiếp tục bóp ảnh tới mức fallback liên tục.

## 7. Điều kiện để giữ một cấu hình

Đo release, cửa sổ thực sự hiển thị, cùng workload, process mới ít nhất 3 lượt.
So riêng cold cache và warm cache; không ép GC để làm đẹp số. Ghi steady-state,
peak và mức sau 5–10 vòng mở/cuộn/đóng. Giữ kích thước cửa sổ/DPR và nhiệt độ
thiết bị tương đương. Profile mode/DevTools dùng để tìm nguyên nhân, không
trộn RAM của profile/debug vào bảng release.

```text
T_display = 1000 / refreshHz  // ms: 60Hz → 16,67; 120Hz → 8,33
```

Kiểm tra p95/p99 build và raster **riêng từng giai đoạn** dưới ngân sách;
đếm tỷ lệ vượt ngân sách và quan sát cuộn/chuyển tab. Hai giai đoạn được
pipeline, không cộng hai p95 rồi coi đó là tỷ lệ dropped frame.
[Flutter performance profiling](https://docs.flutter.dev/perf/ui-performance).

Còn phải kiểm tra sticker: thời gian ảnh đầu p95, thời gian giữ frame cũ,
placeholder, frame thực sự đổi/giây và độ nét. UI 120 FPS vẫn có thể đang
vẽ lại một ảnh sticker cũ. Cache hits/misses và `pendingFrames` là tín hiệu
chẩn đoán, không phải số dropped frame; tính delta trong cùng khoảng đo,
đừng so các bộ đếm tích lũy có thời lượng khác nhau.

Giữ cấu hình RAM thấp nhất **trong các cấu hình cùng đạt tiêu chuẩn chất lượng
và độ mượt**. Với Mac hiện tại, 6/2 MiB, 1 worker, 2 job và hero vector 160
là điểm đã đo; các bước 8–12 MiB, 2 worker hay thêm overscan cần A/B riêng.

Nguồn implementation: [raster_cache.dart](../lib/src/raster_cache.dart),
[worker_pool.dart](../lib/src/worker_pool.dart),
[FastLottiePlayer](../lib/fastlottie.dart),
[chat example](../example/lib/tgs/cupertino_chat.dart).
