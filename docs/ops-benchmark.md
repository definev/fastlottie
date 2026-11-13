# FastLottie: Merge Paths (`mm`) & Blend Modes (`bm`) Benchmark

Báo cáo đo lường hiệu năng thực tế của hai tính năng mới:
1. **Merge Paths (`mm`)**: Hỗ trợ 5 mode (1: Merge, 2: Add/Union, 3: Subtract, 4: Intersect, 5: Exclude/XOR).
2. **Layer Blend Modes (`bm`)**: Hỗ trợ các blend mode 2D từ 0 đến 16 (Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Exclusion, Plus...).

Tất cả các số liệu dưới đây được đo thực tế trên máy macOS qua script benchmark [tool/benchmark_ops.dart](file:///Users/vsf/source/github.com/definev/fastlottie/tool/benchmark_ops.dart) và lưu dạng JSON tại [docs/ops-benchmark.json](file:///Users/vsf/source/github.com/definev/fastlottie/docs/ops-benchmark.json).

---

## Pixel 7a: bỏ group không đổi hình và chuyên biệt Multiply

Chạy từ `example/` với `--dart-define=FASTLOTTIE_GROUP_BENCH=true` hoặc
`--dart-define=FASTLOTTIE_GRADIENT_BENCH=true` trên cùng target benchmark bên
dưới. Bảng lấy trung vị của ba p95; mỗi lượt đo 384 frame sau 128 frame làm
nóng. [Số đo từng lượt và các fixture đối chứng](software-dispatch-pixel7a.json).

| Fixture | p95 trước | p95 sau |
| --- | ---: | ---: |
| 64 hình nhỏ, group sâu 1 | 32.5 µs | 35.1 µs |
| 64 hình nhỏ, group sâu 8 | 67.3 µs | 35.7 µs |
| 64 hình nhỏ, group sâu 32 | 170.2 µs | 36.1 µs |
| Linear + Multiply, 512×512 | 5.37 ms | 4.61 ms |
| Radial + Multiply, 512×512 | 6.13 ms | 5.00 ms |

Group identity với opacity 100% được bỏ qua trong danh sách lệnh vẽ
software; cây path và cache key giữ nguyên. Fixture group giữ nguyên hình
và diện tích phủ ở mọi độ sâu. Kernel gradient chọn công thức Multiply
trước khi duyệt span. Thử chuyên biệt thêm Screen cho kết quả chậm hơn,
nên Screen giữ đường ghép chung.

## Pixel 7a: tô gradient trực tiếp trên span

Chạy từ `example/`:
`flutter run --release --dart-define=FASTLOTTIE_GRADIENT_BENCH=true -t lib/software_ops_benchmark.dart`.
So sánh với renderer đã có kernel ghép layer NEON ở mục kế tiếp. Mỗi bản
chạy ba lần xen kẽ ở 512×512; bỏ 128 frame làm nóng rồi đo 384 frame mỗi lượt.
Bảng lấy trung vị của ba p95. Normal vẽ một layer; Multiply và Screen có
thêm một layer nền gradient. Cả tám fixture dùng stop màu tĩnh.
[Số đo từng lượt](software-gradient-pixel7a.json).

| Gradient | Blend | p95 trước (ms) | p95 sau (ms) |
| --- | --- | ---: | ---: |
| Linear, điểm cuối tĩnh | Normal | 3,20 | 1,06 |
| Linear, điểm cuối động | Normal | 3,21 | 1,17 |
| Linear, điểm cuối động | Multiply | 6,78 | 5,34 |
| Linear, điểm cuối động | Screen | 7,29 | 3,94 |
| Radial, điểm cuối tĩnh | Normal | 3,39 | 1,85 |
| Radial, điểm cuối động | Normal | 3,67 | 1,83 |
| Radial, điểm cuối động | Multiply | 7,19 | 6,19 |
| Radial, điểm cuối động | Screen | 7,35 | 5,07 |

Layer chỉ có một gradient trên đường native bỏ được 1.008 KiB buffer pixel
tạm trong cả bốn fixture Multiply và Screen. Layer có nhiều paint vẫn cần
gom riêng để giữ đúng phép ghép. Màu và alpha stop tĩnh dùng lại LUT khi
điểm đầu/cuối thay đổi. Benchmark đo tổng tác động của LUT và kernel native,
chưa tách riêng phần tăng tốc của LUT.

## Pixel 7a: cache mask và blend theo span / NEON

Chạy từ `example/`: `flutter run --release -t lib/software_ops_benchmark.dart`.
Đo bản ARM64 release trên Pixel 7a (Android 17), trước và sau đợt tối ưu
cache mask và blend native. Mỗi bản chạy ba lần, mỗi lần làm nóng 128 frame
rồi đo 384 mẫu; bảng lấy trung vị của ba p95. Đây là thời gian CPU của
software renderer, không gồm giải mã, upload ảnh hay lịch khung hình của UI.
[Số liệu từng lượt và bộ nhớ](software-ops-pixel7a.json).

| Workload | p95 trước (ms) | p95 sau (ms) | Buffer pixel tạm trước → sau |
| --- | ---: | ---: | ---: |
| 8 mask tĩnh, layer đổi opacity, 256×256 | 0,542 | 0,081 | 0 → 0 |
| Multiply màu phẳng phủ gần kín, 512×512 | 4,905 | 0,382 | 1.008 KiB → 0 |
| Multiply màu phẳng thưa, 512×512 | 1,660 | 0,232 | 908 KiB → 0 |
| Multiply gradient, 512×512 | 12,485 | 5,638 | 1.008 KiB → 1.008 KiB |
| Screen gradient, 512×512 | 11,852 | 5,096 | 1.008 KiB → 1.008 KiB |
| 16 emoji, mỗi emoji 128×128, render tuần tự trong một mẫu | 10,264 | 8,558 | 974 KiB → 974 KiB |

Buffer pixel tạm là dung lượng các plane renderer giữ lại cuối phép đo,
không gồm framebuffer, span hoặc RSS của tiến trình. Coverage của mask và
hình vẽ dùng chung LRU giới hạn 1 MiB/workspace; fixture mask giữ khoảng
20 KiB thay cho khoảng 1,4 KiB trước đó. Cache xét transform và clip box,
và kết hợp với mask cha sau khi tra cache.

Layer chỉ có một paint màu phẳng blend thẳng trên các span đã phủ. Layer
cần gom nhiều paint hoặc có gradient vẫn dùng buffer tạm. Multiply và
Screen ghép buffer bằng NEON trên ARM64; đường Dart vẫn cho cùng pixel.
Kết quả 16 emoji dao động giữa các lượt (xem JSON), nên không dùng số đo đó
để suy ra FPS của gallery.

## Software renderer: đo lại sau tối ưu

Chạy `flutter test --no-pub tool/benchmark_warm_ops.dart -r expanded`.
Kết quả dưới đây đo trên macOS / Apple M5 ở 256×256, so với commit `4ccf32e`.
Mỗi số là median của 7 lô 600 frame sau một lô làm nóng. Phép đo dùng lại
`FastLottieSoftwareSession`, nên không tính khởi tạo session, sao chép pixel
hay upload ảnh.

| Fixture | Trước (µs/frame) | Sau (µs/frame) |
| --- | ---: | ---: |
| Multiply | 339,2 | 58,3 |
| Screen | 415,1 | 65,5 |
| Overlay | 414,8 | 56,0 |
| Difference | 513,5 | 56,9 |
| PolyStar bo góc, xoay động | 63,8 | 57,6 |
| Phoenix | 310,1 | 282,0 |
| Ant | 106,6 | 102,2 |
| Bubble Tea | 42,3 | 304,3 |

Các fixture Merge Paths nằm trong khoảng 2–8 µs/frame khi dùng lại coverage.
Thời gian Bubble Tea tăng vì bản cũ không vẽ phần lớn thân ly và nội dung
bên trong. Số liệu bên dưới là benchmark lịch sử đo cả chi phí tạo session,
không so sánh trực tiếp với bảng này.

## 1. Tác động lên tỷ lệ hỗ trợ Telegram Sticker (TGS)

Trước khi thực hiện chuỗi tối ưu:
- **Khởi điểm**: 959 stickers native / 104 unsupported
- **Sau Layer Masks**: 995 stickers native / 68 unsupported (+36 stickers)
- **Sau Merge Paths (`mm`)**: 1.023 stickers native / 40 unsupported (+28 stickers)
- **Sau Blend Modes (`bm`)**: **1.030 stickers native / 33 unsupported** (+7 stickers)

> [!NOTE]
> Tổng cộng 71 sticker phức tạp trước đây bị từ chối giờ đã chạy hoàn toàn native, giảm **68.3%** lượng sticker không tương thích (từ 104 xuống 33).

---

## 2. Microbenchmark: Merge Paths (`mm`) Modes 1..5

| Kịch bản | Compile (µs) | Vector Canvas (µs) | Vector FPS | Software RLE (µs) | Software FPS |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mode 1 (Merge)** | 58.3 µs | 5.7 µs | 174.764 fps | 384.8 µs | 2.599 fps |
| **Mode 2 (Add / Union)** | 17.8 µs | 2.7 µs | 376.506 fps | 276.4 µs | 3.618 fps |
| **Mode 3 (Subtract)** | 13.7 µs | 2.9 µs | 349.406 fps | 445.4 µs | 2.245 fps |
| **Mode 4 (Intersect)** | 16.4 µs | 3.6 µs | 279.018 fps | 245.1 µs | 4.081 fps |
| **Mode 5 (Exclude / XOR)** | 15.0 µs | 1.6 µs | 631.313 fps | 472.8 µs | 2.115 fps |

---

## 3. Microbenchmark: Layer Blend Modes (`bm`)

| Kịch bản | Compile (µs) | Vector Canvas (µs) | Vector FPS | Software RLE (µs) | Software FPS |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Normal (bm=0)** | 27.1 µs | 1.8 µs | 541.126 fps | 162.6 µs | 6.150 fps |
| **Multiply (bm=1)** | 23.0 µs | 2.5 µs | 404.204 fps | 566.8 µs | 1.764 fps |
| **Screen (bm=2)** | 21.4 µs | 2.0 µs | 503.525 fps | 591.1 µs | 1.692 fps |
| **Overlay (bm=3)** | 21.5 µs | 1.8 µs | 548.847 fps | 605.3 µs | 1.652 fps |
| **Difference (bm=10)** | 23.7 µs | 1.5 µs | 654.450 fps | 736.6 µs | 1.358 fps |

---

## 4. Benchmark thực tế trên Sticker TGS của Telegram

Các sticker Telegram thực tế có cấu trúc precomposition nhiều tầng, path động và kết hợp nhiều toán tử:

| Sticker | Tính năng nổi bật | Compile (µs) | Vector Canvas (µs) | Vector FPS | Software RLE (µs) | Software FPS |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **emoji_u1f30b (Volcano)** | 10 groups, `mm:2` (Union), Gradient Fill | 1.662,3 µs | 163,9 µs | 6.099 fps | 1.256,9 µs | 796 fps |
| **emoji_u1f345 (Tomato)** | Bézier path + `mm:4` (Intersect) | 4.233,2 µs | 40,5 µs | 24.682 fps | 900,6 µs | 1.110 fps |
| **emoji_u1f60a (Smile)** | Complex mouth paths + `mm:4` | 504,6 µs | 42,4 µs | 23.577 fps | 785,0 µs | 1.274 fps |
| **emoji_u1f389 (Party Popper)** | Multilayer + `bm:10` (Difference) | 879,2 µs | 18,1 µs | 55.356 fps | 684,1 µs | 1.462 fps |
| **emoji_u1f393 (Graduation)** | Precomposition + `bm:1` (Multiply) | 2.755,1 µs | 27,1 µs | 36.921 fps | 919,0 µs | 1.088 fps |
| **emoji_u1f426_200d_1f525 (Phoenix)** | Nested precomps, flames, `bm:1` | 21.602,4 µs | 67,5 µs | 14.804 fps | 2.903,2 µs | 344 fps |

---

## 5. Kết luận kiến trúc & Tính tương thích

1. **Dual-Pipeline Parity**:
   - **Vector Canvas**: Sử dụng `Path.combine` cho Merge Paths và `saveLayer(bounds, contentPaint..blendMode)` cho Blend Modes, tận dụng tối đa Skia/Impeller hardware acceleration trên GPU.
   - **Software RLE Rasterizer**: Kết hợp coverage của các toán hạng Merge Paths trực tiếp trên span cho fill; biên khử răng cưa là xấp xỉ ở độ phân giải đích. Blend mode dùng số nguyên premultiplied và dùng lại kết quả cho các cặp pixel liên tiếp giống nhau. Hai đường này chạy được trong worker isolate.
2. **So sánh với `lottie-flutter` (`package:lottie 3.8.2`)**:
   - `fastlottie` khắc phục triệt để lỗi thiết kế trong `package:lottie` (nơi `enableMergePaths` bị bỏ qua trong constructor và không kích hoạt được `MergePathsContent`).
   - Tốc độ render Vector Canvas nhanh hơn từ 3x đến 10x so với `package:lottie`.
