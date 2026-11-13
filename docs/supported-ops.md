# Ops được hỗ trợ

Fastlottie hỗ trợ một phần Lottie 2D ở định dạng JSON và TGS/gzip. Compiler
validate cả layer ẩn. Feature ngoài phạm vi báo `UnsupportedLottieException`
kèm JSON path; core không tự chuyển sang renderer khác.

| Nhóm | Hỗ trợ |
| --- | --- |
| Layer | Shape (`ty:4`), null (`ty:3`), solid (`ty:1`), precomp (`ty:0`); stacking, parent transform, hidden, ip/op; blend modes 2D ở cấp layer (`bm:0..16`); alpha/luma matte thường hoặc đảo từ layer liền trước (`tt:1..4`); layer masks (`hasMask`, `masksProperties`: Add `'a'`, Subtract `'s'`, Intersect `'i'`, Difference `'f'`, None `'n'`, đảo `inv`, opacity và expansion `x`) |
| Precomp | Child timeline dùng start offset `st` và stretch `sr` khác 0; `tm` tĩnh hoặc động ánh xạ thời gian tính theo giây và thay thế phép tính offset/stretch |
| Group | `gr`, nested group, `tr`, style theo thứ tự Lottie; trim path simultaneous (`m:1`) và individual (`m:2`); merge paths (`mm:1..5`: Merge, Add/Union, Subtract/Difference, Intersect, Exclude/XOR) |
| Layer style | Một Inner Shadow sắc cạnh (`sy[0].ty:2`): tham số tĩnh, Multiply, không blur/choke/noise. Áp trên alpha của layer sau transform, giữ nguyên alpha khi đổi màu bóng. |
| Layer effects | `ADBE Fill` (`ef.ty:21`): thay RGB của toàn layer và nhân alpha, màu/opacity có thể animate; không chọn mask, invert hay feather. `ADBE Set Matte3` (`ef.ty:28`): ghép alpha không đảo từ shape layer theo `ind` tĩnh trong cùng composition, giữ lượt vẽ bình thường của nguồn; hỗ trợ tham chiếu chính layer đó, không nối chuỗi. |
| Geometry | `sh`: open/closed cubic Bézier; `rc`: rectangle + corner radius; `el`: ellipse; `sr`: star & regular polygon (points, inner/outer radius & roundness); `rc`, `el` và `sr` hỗ trợ hướng đảo `d:3` |
| Paint | `fl`/`st`: solid RGB, opacity, fill rule, stroke width/cap/join/miter; `gf`/`gs`: linear/radial gradient với stop màu/opacity động và radial focal point (`h`/`a`); stroke dash/gap/offset động |
| Transform | Anchor, spatial position Bézier, split x/y, rotation, scale đều hoặc không đều, opacity, skew/axis động; 2D |
| Keyframe | Static, hold, linear, temporal cubic Bézier; easing theo component trên một số point property |
| Morph | Cùng số vertex; nội suy v/i/o; closure có thể đổi tại keyframe |
| Controls | `ADBE Layer Control`; expression tham chiếu scale, rotation hoặc opacity qua `content(...)` trong cùng layer; tham chiếu Bézier path theo tên qua `thisComp.layer(...).content(...).path` trong cùng composition |
| Playback | Source FPS, cap FPS của cache, subframe (opt-in), seek ngược, composition ip khác 0 |
| Layout | contain/cover/none/scaleDown/fitWidth/fitHeight/fill; Canvas transform áp dụng cả lên stroke |

Với software RLE, boolean Merge Paths (mode 2–5) được tính trên coverage của
fill. Biên khử răng cưa có thể khác Canvas; stroke và trim vẫn dựa vào contour.
Intersect chỉ có một toán hạng giữ nguyên path còn lại, như trong một số
sticker Noto đã bake hình học.
Software RLE áp dụng cả 17 layer blend mode. Các mode 6, 7, 9 và 12–15
dùng công thức Dart; blend mode ở cấp shape/group chưa được áp dụng.
Mask expansion dùng một dải biên tròn trong tọa độ của mask, kết hợp với
coverage gốc. Opacity của một mask clip đơn áp dụng sau khi ghép các paint
trong layer.

Expression được resolve sang track đã compile; compiler từ chối target thiếu,
trùng tên hoặc tham chiếu vòng. Path tham chiếu dùng hình học nguồn tại cùng
frame của composition, giữ transform, paint và modifier của đích.
Parent opacity không nhân vào child
qua quan hệ parent. Opacity thường áp dụng trên từng paint.

Các feature ngoài phạm vi gồm image/text/font, 3D, các visual effect ngoài bảng,
repeater, JavaScript tùy ý, slot,
matte không liền kề hoặc nối chuỗi, và morph đổi số vertex. Compiler chỉ nhận
các field đã biết; một file dùng shape quen thuộc vẫn có thể bị từ chối vì
feature ở layer, modifier hoặc asset khác.

## Kiểm tra coverage

- Cả 94 sticker trong [gallery so sánh](tgs-grid.md) dùng được fastlottie.
  Bộ này khác catalog chat, vốn có thêm Topics và Noto emoji.
- `test/tgs_test.dart` audit cả 1.063 TGS được khai báo trong example đều compile.
  Differential test so phần tính năng chung với
  `lottie` 3.8.2; một số artwork cần ngưỡng hoặc sample riêng do khác biệt
  giữa renderer. `test/path_reference_test.dart` kiểm tra riêng các path reference.
- Pixel probes và [oracle rlottie tùy chọn](rlottie-features.md#chạy-oracle-native)
  kiểm tra các feature mà baseline Flutter không xử lý đầy đủ, như luma matte
  và rectangle direction.
