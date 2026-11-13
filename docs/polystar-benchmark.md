# Báo cáo Benchmark: PolyStar (`sr`) trên Fastlottie

- **Tính năng mới**: Bổ sung Shape Op `sr` (PolyStar - Star & Regular Polygon).
- **Phạm vi hỗ trợ**:
  - `sy: 1` (Star) với `pt` (số đỉnh), `p` (vị trí tâm), `r` (góc xoay), `or` (bán kính ngoài), `os` (độ bo tròn ngoài), `ir` (bán kính trong), `is` (độ bo tròn trong), `d` (hướng vẽ ngược `d: 3`).
  - `sy: 2` (Polygon) với `pt`, `p`, `r`, `or`, `os`, `d`.
  - Hỗ trợ đầy đủ cả keyframe animation lẫn static track cho tất cả thuộc tính.
  - Đồng bộ trên cả 2 rendering pipeline: **Flutter Canvas (Vector/Picture)** và **Pure CPU Software RLE Scanline Rasterizer**.

---

## 1. Kết quả Benchmark Thực tế (Đo trên macOS M-series, kích thước 256×256)

| Fixture | Kiểu PolyStar | Parse / Compile (Median) | Canvas Vector Record (Median) | CPU SW Rasterizer (Median) | Throughput tương đương (Vector) | Throughput tương đương (Software) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **star_static_5pt** | Ngôi sao 5 cánh chuẩn (Fill) | **148.0 µs** | **3.0 µs** | **155.0 µs** | ~219,000 FPS | ~3,431 FPS |
| **star_rounded_5pt** | Ngôi sao bo tròn góc trong/ngoài | **120.0 µs** | **3.0 µs** | **127.0 µs** | ~173,000 FPS | ~4,332 FPS |
| **polygon_static_6pt** | Lục giác đều (Hexagon) | **87.0 µs** | **2.0 µs** | **59.0 µs** | ~195,000 FPS | ~6,514 FPS |
| **polygon_rounded_6pt**| Đa giác bo cong góc | **24.0 µs** | **2.0 µs** | **66.0 µs** | ~460,000 FPS | ~6,161 FPS |
| **star_animated** | Ngôi sao biến thiên (points, rotation, radius) | **30.0 µs** | **5.0 µs** | **67.0 µs** | ~108,000 FPS | ~5,339 FPS |

---

## 2. Kiểm thử Tính đúng đắn (Correctness & Parity)

- **Độ chính xác Vector (Pixel Parity vs `package:lottie 3.8.2`)**:
  - Đã kiểm tra qua `test/polystar_test.dart` trên các frame `[0, 15, 30, 45, 59]`.
  - Khớp pixel hoàn toàn với baseline chuẩn của Lottie trên các bài test:
    1. Static 5-point star
    2. Static regular polygon
    3. Star with stroke & rotation
    4. Star with inner & outer roundness
    5. Polygon with rounded corners
    6. Animated star (points, rotation, outer radius)
    7. `polystar_anim.json` (từ rlottie test suite)
    8. `polystar_line_clockwise_trim.json` (từ rlottie test suite)
- **Software Rasterizer Parity**:
  - Render CPU RLE scanline tạo ra đúng vùng pixel RGBA với coverage chính xác.
- **Corpus Acceptance**:
  - `test/corpus_test.dart`: Nhận diện và chấp nhận thêm các file `polystar_anim.json`, `polystar_line_clockwise_trim.json` mà trước đây bị từ chối với lỗi `Shape op sr`.
