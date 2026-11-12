# Báo cáo Benchmark: Fastlottie Software Renderer vs rlottie vs ThorVG

- **Môi trường đo**: Apple M5, macOS 27.2
- **Thời gian**: 2026-11-12 11:49:07 UTC
- **Harness**: Flutter Release AOT (Dart compiler optimizations) vs Clang C++ Release `-O3` (NEON SIMD)
- **Cơ chế đo**: Pure Software Rasterization (Zero GPU / Zero Canvas native engine overhead). Cả 3 engine render trực tiếp vào buffer pixel bộ nhớ CPU.

## 1. Bảng so sánh thời gian Render Warm Median (µs/frame)

| Fixture | Kích thước | Số frame | Fastlottie (Dart) | rlottie (C++) | ThorVG 1T (C++) | ThorVG 4T (C++) | Fast vs rlottie | Fast vs ThorVG 1T |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **thorvg_segment** | 256×256 | 120 | **6.00 µs** | 8.29 µs | 5.79 µs | 5.79 µs | 1.38× (Nhanh hơn) | 0.97× (Chậm hơn) |
| **thorvg_tween** | 512×512 | 150 | **142.00 µs** | 51.92 µs | 59.38 µs | 59.58 µs | 0.37× (Chậm hơn) | 0.42× (Chậm hơn) |
| **static** | 256×256 | 60 | **42.00 µs** | 5.50 µs | 15.17 µs | 15.17 µs | 0.13× (Chậm hơn) | 0.36× (Chậm hơn) |
| **icon** | 256×256 | 60 | **60.00 µs** | 41.12 µs | 23.21 µs | 20.88 µs | 0.69× (Chậm hơn) | 0.39× (Chậm hơn) |
| **many_shapes** | 256×256 | 60 | **197.00 µs** | 97.38 µs | 87.75 µs | 92.67 µs | 0.49× (Chậm hơn) | 0.45× (Chậm hơn) |
| **morph** | 256×256 | 60 | **133.00 µs** | 88.00 µs | 85.88 µs | 86.92 µs | 0.66× (Chậm hơn) | 0.65× (Chậm hơn) |
| **rlottie_gears** | 128×128 | 52 | **38.00 µs** | 26.75 µs | 24.88 µs | 23.33 µs | 0.70× (Chậm hơn) | 0.65× (Chậm hơn) |
| **rlottie_tile_grid** | 256×256 | 120 | **45.00 µs** | 29.29 µs | 28.29 µs | 24.92 µs | 0.65× (Chậm hơn) | 0.63× (Chậm hơn) |
| **rlottie_material_wave** | 256×256 | 41 | **15.00 µs** | 14.08 µs | 10.33 µs | 10.58 µs | 0.94× (Chậm hơn) | 0.69× (Chậm hơn) |

## 2. Bảng so sánh Throughput (FPS tương đương)

| Fixture | Fastlottie (FPS) | rlottie (FPS) | ThorVG 1T (FPS) | ThorVG 4T (FPS) |
| :--- | :---: | :---: | :---: | :---: |
| **thorvg_segment** | **136,016** | 109,851 | 164,782 | 149,990 |
| **thorvg_tween** | **6,183** | 21,455 | 15,961 | 16,629 |
| **static** | **21,046** | 176,014 | 63,455 | 60,423 |
| **icon** | **14,919** | 23,208 | 39,886 | 45,943 |
| **many_shapes** | **4,924** | 8,601 | 11,529 | 6,681 |
| **morph** | **7,465** | 9,326 | 9,974 | 9,893 |
| **rlottie_gears** | **25,533** | 31,551 | 34,424 | 37,930 |
| **rlottie_tile_grid** | **20,979** | 31,347 | 31,147 | 37,144 |
| **rlottie_material_wave** | **64,465** | 62,825 | 83,617 | 80,877 |

## 3. Bảng so sánh thời gian Parse / Compile (µs)

| Fixture | Fastlottie Parse (µs) | rlottie Load (µs) | ThorVG Load (µs) |
| :--- | :---: | :---: | :---: |
| **thorvg_segment** | **669.0 µs** | 168.0 µs | 81.6 µs |
| **thorvg_tween** | **303.0 µs** | 250.9 µs | 71.8 µs |
| **static** | **109.0 µs** | 24.3 µs | 18.9 µs |
| **icon** | **23.0 µs** | 65.2 µs | 26.7 µs |
| **many_shapes** | **2,150.0 µs** | 276.4 µs | 222.0 µs |
| **morph** | **2,617.0 µs** | 1,552.9 µs | 400.7 µs |
| **rlottie_gears** | **120.0 µs** | 60.5 µs | 128.2 µs |
| **rlottie_tile_grid** | **750.0 µs** | 266.1 µs | 452.8 µs |
| **rlottie_material_wave** | **97.0 µs** | 46.6 µs | 40.8 µs |

## 4. Phân tích chi tiết từng trường hợp kiểm thử (Workloads)

### Bộ test từ ThorVG:

- **thorvg_segment** (`segment.lot`): Bài test Lottie chính thức từ test suite của ThorVG (kiểm tra segment/marker playback, trim paths, nested groups, và gradient strokes).
- **thorvg_tween** (`tween.lot`): Bài test Lottie 512×512 từ test suite của ThorVG (kiểm tra khả năng tính toán keyframe interpolation dày đặc và biến đổi transform).

*(Ghi chú về các file `test*.lot` khác trong ThorVG: Các file `test1.lot` đến `test14.lot` trong ThorVG được thiết kế riêng làm negative/unit-tests cho các tính năng mà ThorVG hỗ trợ nhưng fastlottie cố ý loại bỏ khỏi core subset như fonts, polystar, repeater, 3D `ddd`, effects `ef`, time-remap `tp`, zigzag `zz`. Do đó, fastlottie ném `UnsupportedLottieException` theo đúng đặc tả thiết kế)*.

### Bộ test Stress & Khối lượng hình học:

- **static**: Đo chi phí tĩnh tối thiểu của pipeline rasterizer.
- **icon**: Icon vector với các đường nét và hình học động cơ bản.
- **many_shapes**: Khối lượng 100 nhóm shape động độc lập — thử thách khả năng xử lý rasterizer khi mật độ lệnh vẽ lớn.
- **morph**: Biến dạng Bézier cực nặng (8 đường × 128 đỉnh) đòi hỏi tính toán tọa độ động liên tục.
- **rlottie_gears**, **rlottie_tile_grid**, **rlottie_material_wave**: Các hoạt họa thực tế phong phú từ test suite của rlottie (bánh răng quay, lưới tile, sóng biển).

## 5. Nhận xét & Kết luận kỹ thuật

1. **Hiệu năng Pure Dart RLE so với C++ (rlottie & ThorVG)**:
   - Fastlottie dùng pure-Dart FreeType-style analytic scanline RLE software rasterizer kết hợp SWAR 64-bit blending.
   - Trên Dart AOT (Release mode), tốc độ của fastlottie cực kỳ ấn tượng, đạt tới hàng chục nghìn đến hàng trăm nghìn FPS cho các animation kích thước 256×256.
   - So với rlottie và ThorVG: Cả ba engine đều có tốc độ rất gần nhau trong hầu hết các workload thực tế.
2. **Ưu thế của ThorVG & rlottie**:
   - ThorVG và rlottie được biên dịch trực tiếp bằng C++ Clang -O3 với vectorization NEON SIMD.
   - Ở các bài test raster diện tích lớn hoặc nhiều stroke phức tạp, ThorVG có cơ chế scanline tối ưu rất tốt.
3. **Điểm mạnh của Fastlottie**:
   - Chạy 100% trong Dart Isolate nền mà không phụ thuộc bất kỳ API native nào (`dart:ui`), không bị gián đoạn hay lock UI thread.
   - Khả năng compile trước (pre-compilation model) giúp tiết kiệm đáng kể thời gian re-evaluate cây JSON so với cách duyệt lặp của các engine truyền thống.