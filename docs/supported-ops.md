# Ops được hỗ trợ

Fastlottie hỗ trợ một phần Lottie 2D ở định dạng JSON và TGS/gzip. Compiler
validate cả layer ẩn. Feature ngoài phạm vi báo `UnsupportedLottieException`
kèm JSON path; core không tự chuyển sang renderer khác.

| Nhóm | Hỗ trợ |
| --- | --- |
| Layer | Shape (`ty:4`), null (`ty:3`), solid (`ty:1`), precomp (`ty:0`); stacking, parent transform, hidden, ip/op; alpha/luma matte thường hoặc đảo từ layer liền trước (`tt:1..4`) |
| Precomp | Child timeline dùng start offset `st` và stretch `sr` khác 0; `tm` tĩnh hoặc động ánh xạ thời gian tính theo giây và thay thế phép tính offset/stretch |
| Group | `gr`, nested group, `tr`, style theo thứ tự Lottie; trim path simultaneous (`m:1`) và individual (`m:2`) |
| Geometry | `sh`: open/closed cubic Bézier; `rc`: rectangle + corner radius; `el`: ellipse; `sr`: star & regular polygon (points, inner/outer radius & roundness); `rc`, `el` và `sr` hỗ trợ hướng đảo `d:3` |
| Paint | `fl`/`st`: solid RGB, opacity, fill rule, stroke width/cap/join/miter; `gf`/`gs`: linear/radial gradient với stop màu/opacity động; stroke dash/gap/offset động |
| Transform | Anchor, spatial position Bézier, split x/y, rotation, scale đều hoặc không đều, opacity, skew/axis động; 2D |
| Keyframe | Static, hold, linear, temporal cubic Bézier; easing theo component trên một số point property |
| Morph | Cùng số vertex; nội suy v/i/o; closure có thể đổi tại keyframe |
| Controls | `ADBE Layer Control`; expression tham chiếu scale hoặc opacity qua `content(...)` trong cùng layer |
| Playback | Source FPS, cap FPS của cache, subframe (opt-in), seek ngược, composition ip khác 0 |
| Layout | contain/cover/none/scaleDown/fitWidth/fitHeight/fill; Canvas transform áp dụng cả lên stroke |

Expression được resolve sang track đã compile; compiler từ chối target thiếu,
trùng tên hoặc tham chiếu vòng gián tiếp. Parent opacity không nhân vào child
qua quan hệ parent. Opacity thường áp dụng trên từng paint.

Các feature ngoài phạm vi gồm image/text/font, 3D, layer mask, visual effects,
blend mode, repeater/merge, JavaScript tùy ý, slot, radial focal point,
matte không liền kề hoặc nối chuỗi, và morph đổi số vertex. Compiler chỉ nhận
các field đã biết; một file dùng shape quen thuộc vẫn có thể bị từ chối vì
feature ở layer, modifier hoặc asset khác.

## Kiểm tra coverage

- Cả 94 sticker trong [gallery so sánh](tgs-grid.md) dùng được fastlottie.
  Bộ này khác catalog chat, vốn có thêm Topics và Noto emoji.
- `test/tgs_test.dart` audit 1.063 TGS được khai báo trong example: 959 được
  chấp nhận, 104 bị từ chối. Differential test so các file được chấp nhận với
  `lottie` 3.8.2; một số artwork cần ngưỡng hoặc sample riêng do khác biệt
  giữa renderer.
- Pixel probes và [oracle rlottie tùy chọn](rlottie-features.md#chạy-oracle-native)
  kiểm tra các feature mà baseline Flutter không xử lý đầy đủ, như luma matte
  và rectangle direction.
