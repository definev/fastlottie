# Mở rộng feature theo rlottie — 2026-11-09

Ghi chú lịch sử cho mốc 89/94 sticker. Xem [ops được hỗ trợ](supported-ops.md)
cho phạm vi hiện tại.

Mục tiêu của đợt này là tăng coverage bộ 94 TGS đang có, dựa trên feature thực sự
được xử lý trong `rlottie-master`. Không nhúng C++/FFI vào runtime Flutter. Các
feature local rlottie không xử lý sẽ không được triển khai chỉ để tăng số accept.

## Phạm vi và nguồn đối chiếu

| Feature | Bằng chứng trong local source | Kết quả |
| --- | --- | --- |
| Trim simultaneous/individual | `src/lottie/lottiemodel.h`, `Trim::segment`; `src/lottie/lottieitem.cpp`, `Trim::update`/`processTrimItems` | `tm.m:1/2`, start/end/offset động, offset âm/vòng, nhiều path/nested group |
| Dash | `src/lottie/lottiemodel.cpp`, `Dash::getDashInfo`; `Stroke::updateContent` | `st`/`gs`, dash/gap/offset động, tự lặp dash cuối khi thiếu gap |
| Matte | `src/lottie/lottieitem.cpp`, `CompLayer::renderMatteLayer`; `src/vector/vbitmap.cpp`, `updateLuma` | `tt:1..4`, source liền trước target, alpha/luma thường/đảo |
| Rectangle direction | `Rect::updatePath`, `model::Shape::direction` | `rc.d:3`, kể cả bo góc; winding tạo hole |
| Morph đổi closure | `src/lottie/lottiemodel.h`, `PathData::lerp`/`Property<PathData>::value` | Cùng số vertex, closure theo segment start; chỉ nội suy closing cubic khi cả hai endpoint có cubic đó |
| Skew | `parseTransformObject` không xử lý `sk`/`sa` | Skip implementation, báo Unsupported |
| Expression | Property parser bỏ qua `x`, không có evaluator | Skip implementation, báo Unsupported |
| Effects | `parseLayer` bỏ qua `ef`, không có effect renderer tương ứng | Skip implementation, báo Unsupported |
| Merge paths | Parser ghi rõ chưa hỗ trợ `mm` | Tiếp tục báo Unsupported |

“Skip” ở đây là không triển khai feature. Core vẫn từ chối file có feature đó để
tránh báo thành công khi artwork bị thiếu; example Auto dùng fallback có nhãn.
Layer mask, repeater, polystar, time remap… có phần xử lý trong rlottie nhưng chưa
cần cho các file còn lại của corpus TGS này, nên chưa mở rộng trong đợt này.

## Ngữ nghĩa và hiệu năng

- Trim đo geometry trong local space, như rlottie. `m:1` áp khoảng lên từng shape;
  `m:2` dùng tổng chiều dài và thứ tự source. Input snapshot/alias tạo DAG trong
  compile để paint khai báo trước modifier cũng thấy path đã trim. PathMetric
  của geometry tĩnh được giữ trong player; trim full/empty không gọi đo chiều dài.
- Dash áp sau trim, reset phase cho từng contour, cache kết quả khi geometry và
  pattern không đổi. Clamp dash >=1 và gap >=0.1 tránh tạo vô số đoạn khi gần 0,
  phù hợp baseline Flutter. Không thêm SIMD cho PathMetric/native Canvas.
- Matte dùng source ngay trước target trong cùng composition; source không vẽ
  riêng vào stacking. Target cô lập bởi saveLayer rồi dùng dstIn/dstOut. Luma dùng
  RGB weights 0.299/0.587/0.114 sau unpremultiply như local `updateLuma`, kể cả khi
  opacity source nhỏ hơn 100. Không nhân thêm alpha source vào luma. Source alpha
  bằng 0 vẫn tạo mask rỗng. Chained matte và `tp` nonadjacent chưa hỗ trợ.
- Layer không có matte giữ đường vẽ trực tiếp. SaveLayer hiện dùng bounds của
  composition; chưa tối ưu xuống bounds artwork. Đây là chi phí thêm của matte.
- Closure không nội suy boolean. Ở segment đóng→mở, rlottie nội suy phần cubic
  chung và close bằng đoạn thẳng; khi tới key mở thì bỏ close. Ngoài key range
  dùng nguyên endpoint. Số vertex thay đổi vẫn bị từ chối.
- Các model mới thuần Dart, compile qua isolate được. Fork giữ alias chung trong
  mỗi player nhưng tách cursor, Path, Paint, metrics và output giữa các player.

## Coverage và độ đúng

Coverage từ **76 lên 89/94 native**, còn 5 fallback: `file_4786094.tgs` và
`file_4786135.tgs` có expression; `file_4786117.tgs` và `file_4786123.tgs` có skew;
`file_4764994.tgs` có effects. Audit: [tgs-audit.json](tgs-audit.json). Lý do là
feature đầu tiên compiler gặp; một file có thể còn chứa các feature khác.

- 89 TGS × 8 frame = **712 samples** so với lottie 3.8.2, gồm frame phân số/seek
  ngược. Gate global MAE <0.65/255, channel lệch >12/255 <1.6%, flat-region MAE
  <0.5/255. Các fixture đơn giản giữ gate 0.6%. Khi tăng từ 4 lên 8 frame, một frame
  `file_4786114` có 1.5495% channel lệch ở AA, global MAE 0.643 và flat-region MAE
  0.0278; đã kiểm tra ảnh/diff trước khi điều chỉnh AA gate từ 1.5% lên 1.6%.
- 13 test feature riêng: wrap/đảo start-end/empty-full, individual path order,
  nested group, dash gradient/offset âm, matte opacity/visibility/parent/precomp,
  luma pixel probes, fork từ worker, rectangle winding và invalid input.
- Oracle native **12 case × 9 frame = 108 samples** trực tiếp với rlottie:
  MAE <0.65/255 cho geometry, <1.2/255 cho composites; large-channel error <0.6%
  ở cả hai. RLE/bitmap của rlottie có integer coverage loss tới 6/255 qua nhiều
  lớp, nên không ép Flutter copy sai khác lượng tử hóa đó. Không gọi đây là
  pixel equality giữa hai rasterizer.
- Lottie 3.8.2 bỏ qua `rc.d`, không render luma matte; trước `precomp.st` cũng clamp
  child visibility về frame 0. Những case này có analytic/native oracle thay vì
  dùng output baseline thiếu feature làm đáp án.
- Resource audit mở rộng: **34/93** file local rlottie compile/fork được,
  [rlottie-corpus-audit.json](rlottie-corpus-audit.json). Chưa so pixel cả 34 file.
- Chạy đầy đủ: **48 test package với oracle native + 11 test example pass**;
  flutter analyze sạch. Test example parse/transfer/raster cả 94 asset bằng backend
  được ghi trên ô. Không chỉ kiểm tra compiler accept.
- Runtime macOS debug: hot restart thành công qua DTD, `get_runtime_errors` trả
  về `No runtime errors found`. Không kiểm tra UI trực tiếp ở đợt này vì Mac đang
  khóa; kiểm tra scroll bằng UI thuộc đợt triển khai trước.

## Chạy oracle native

Oracle chỉ là tool kiểm thử local, không phải dependency hoặc benchmark runtime.
Trên Apple Silicon, build scalar để tránh symbol NEON assembly ELF không link được
với Mach-O của local source; không sửa file trong rlottie-master:

```sh
cmake -S rlottie-master -B /tmp/fastlottie-rlottie-build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF \
  -DLOTTIE_MODULE=OFF -DLOTTIE_THREAD=OFF \
  -DCMAKE_POLICY_VERSION_MINIMUM=3.5 -DCMAKE_CXX_FLAGS=-U__ARM_NEON__
cmake --build /tmp/fastlottie-rlottie-build -j 6
c++ -std=c++14 -O2 -Irlottie-master/inc tool/render_rlottie.cpp \
  /tmp/fastlottie-rlottie-build/librlottie.a -o /tmp/fastlottie-render-rlottie
RLOTTIE_RENDERER=/tmp/fastlottie-render-rlottie flutter test
cd example
flutter test
```

Không có `RLOTTIE_RENDERER` thì chỉ skip oracle C++; pixel probes, differential
Flutter/TGS và các test còn lại vẫn chạy. Output oracle là RGBA premultiplied như
`dart:ui.ImageByteFormat.rawRgba`.

## Release benchmark sau khi mở rộng

Raw: [tgs-features-benchmark-macos.json](tgs-features-benchmark-macos.json).
Apple M5, macOS 27.2, Flutter revision 666d2c4e83, release/AOT, 800×600 logical,
DPR 2. Fingerprint source+asset: `472efc479c86c420e9815f9168ef4c742ca39f9b4751772aef6217d59dc85daf`.

| Đo | Kết quả |
| --- | ---: |
| Inflate median / p95 | 0.551 / 1.461 ms |
| Auto parse/validate/compile median / p95 | 5.351 / 17.747 ms |
| Lottie parse median / p95 | 4.370 / 19.579 ms |
| Cold load 94, Auto / lottie | 401.981 / 317.698 ms |
| Warm revisit 94 | 0.019 ms, 0 extra decodes |
| Player fork median / p95 | 0.149 / 0.503 ms |

Warm grid preload model, 4 cột, vector/source FPS; Auto gồm **89 native + 5 fallback**.
Mỗi profile bỏ 30 timing warmup, lấy 90 mẫu; scroll đi 24 logical px/vsync:

| Mode | Total median | Total p95 |
| --- | ---: | ---: |
| Auto idle | 2.721 ms | 5.157 ms |
| lottie idle | 2.691 ms | 5.999 ms |
| Auto scrolling | 3.375 ms | 6.463 ms |
| lottie scrolling | 3.700 ms | 12.096 ms |

Scrolling p95 Auto thấp hơn khoảng 46.6% trong lần đo này; idle median tương đương,
cold load Auto vẫn chậm hơn baseline. Không suy ra parser nhanh nhất, mọi frame
thắng baseline, retained heap thấp hơn hoặc FPS trên điện thoại. Chưa đo cold-scroll
loading hay Android/iOS/web. Các snapshot `tgs-benchmark-macos.json` và
`benchmark-macos.json` được giữ làm lịch sử, fingerprint của chúng khác source mới.
