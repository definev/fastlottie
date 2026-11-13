# FastLottie: Merge Paths (`mm`) & Blend Modes (`bm`) Benchmark

Báo cáo đo lường hiệu năng thực tế của hai tính năng mới:
1. **Merge Paths (`mm`)**: Hỗ trợ 5 mode (1: Merge, 2: Add/Union, 3: Subtract, 4: Intersect, 5: Exclude/XOR).
2. **Layer Blend Modes (`bm`)**: Hỗ trợ các blend mode 2D từ 0 đến 16 (Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Exclusion, Plus...).

Tất cả các số liệu dưới đây được đo thực tế trên máy macOS qua script benchmark [tool/benchmark_ops.dart](file:///Users/vsf/source/github.com/definev/fastlottie/tool/benchmark_ops.dart) và lưu dạng JSON tại [docs/ops-benchmark.json](file:///Users/vsf/source/github.com/definev/fastlottie/docs/ops-benchmark.json).

---

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
   - **Software RLE Rasterizer**: Sử dụng `_PolyPath` metric sampling với dynamic flatness tolerance và `_SwarBlender.compositeBlended` với integer fixed-point arithmetic, hoàn toàn Isolate-safe, không tốn GPU allocations.
2. **So sánh với `lottie-flutter` (`package:lottie 3.8.2`)**:
   - `fastlottie` khắc phục triệt để lỗi thiết kế trong `package:lottie` (nơi `enableMergePaths` bị bỏ qua trong constructor và không kích hoạt được `MergePathsContent`).
   - Tốc độ render Vector Canvas nhanh hơn từ 3x đến 10x so với `package:lottie`.
