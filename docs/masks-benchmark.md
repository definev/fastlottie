# Layer Masks Benchmark & Analysis

## 1. Tổng quan

Tính năng **Layer Masks** (`hasMask: true`, `masksProperties`: mode Add `'a'`, Subtract `'s'`, Intersect `'i'`, Difference `'f'`, None `'n'`, đảo `inv`, và độ mờ `o`) đã được tích hợp hoàn chỉnh vào cả 2 pipeline của `fastlottie`:

1. **Vector Canvas Tier (`ui.Canvas`)**:
   - Tối ưu đường thẳng siêu tốc (Zero-Allocation Fast-Path clipper) cho single non-inverted Add mask (`canvas.clipPath(mask.path(frame))`).
   - Hỗ trợ đa mask và các chế độ phức tạp (Subtract, Intersect, Difference, Invert) thông qua toán tử Boolean path topology `Path.combine`.
   - Cắt tỉa (cull) không gian bounding box `worldBounds` bằng giao điểm của bounds layer và bounds mask, giúp loại bỏ các layer ngoài viewport trước khi vẽ.

2. **Background Software RLE Rasterizer (`_PolyPath` + FreeType Scanline RLE)**:
   - Flatten mask cubic Bézier trực tiếp theo dung sai screen-space flatness tolerance (`flatnessSq`).
   - Rasterize mask polygons thành `_RleSpans` device-space coverage.
   - Siêu tối ưu bounding box: siết chặt `(effClipX0..effClipX1, effClipY0..effClipY1)` theo bounds của mask, loại bỏ các pixel thừa ngoài vùng cắt trước khi chạy scanline rasterizer.
   - Kết hợp mượt mà với incoming `clipMask` (từ precomps lồng nhau) thông qua `_RleSpans.intersect`.
   - Zero-allocation trong render loop nhờ workspace pooling theo đệ quy độ sâu (`_acquireMaskPoly`, `_acquireMaskSpans`, `_acquireIntersectMaskSpans`).

---

## 2. Kết quả đo đạc thực tế (Benchmark Results)

Đo trên môi trường macOS Apple Silicon (ARM64), kích thước viewport chuẩn 256×256:

| Mục tiêu kiểm thử | Parse & Compile (Mean / Median) | Vector Canvas Record (Mean / FPS) | Software RLE Rasterizer (Mean / FPS) |
|---|---|---|---|
| **Masked Solid Layer (Static)** | 72.8 µs / 69.0 µs | **4.7 µs** (~214,000 FPS) | **232.2 µs** (~4,307 FPS) |
| **Masked Shape Layer (Static)** | 55.1 µs / 50.0 µs | **5.8 µs** (~171,000 FPS) | **247.1 µs** (~4,048 FPS) |
| **Masked Solid Layer (Animated Mask)** | 32.7 µs / 26.0 µs | **7.9 µs** (~126,000 FPS) | **143.2 µs** (~6,984 FPS) |
| **Real TGS: `emoji_u1f308` (Rainbow)** | 332.8 µs / 255.0 µs | **20.8 µs** (~48,200 FPS) | **336.7 µs** (~2,970 FPS) |
| **Real TGS: `emoji_u1f483` (Dancer)** | 6,063.1 µs / 5,797.0 µs | **60.1 µs** (~16,650 FPS) | **1,009.1 µs** (~991 FPS) |

---

## 3. Tác động tới Corpus Telegram TGS

- **Tổng số sticker audit**: 1.063 files
- **Trước khi có Layer Masks**: 959 native, 104 unsupported
- **Sau khi có Layer Masks**: **995 native, 68 unsupported**
- **Số lượng sticker được unlock ngay lập tức**: **+36 stickers** (giảm 34.6% tổng số file unsupported trước đó)!
- **Độ chính xác pixel (Differential Testing)**:
  - 100% các file masked stickers (`emoji_u1f308`, `emoji_u1f31b`, `emoji_u1f37e`, toàn bộ 6 biến thể màu da của `emoji_u1f483`, toàn bộ 6 biến thể của `emoji_u1faf6`, v.v.) đạt 0 failed samples so sánh với `package:lottie 3.8.2`.
