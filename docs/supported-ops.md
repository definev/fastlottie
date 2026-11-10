# Ops được hỗ trợ

Phạm vi hiện tại: shape animation 2D, JSON hoặc TGS/gzip. Core không tự động fallback;
`UnsupportedLottieException` chứa JSON path của feature không được hỗ trợ. Validate
cả hidden content. Không cần package `lottie` trong runtime dependencies.

| Nhóm | Hỗ trợ |
| --- | --- |
| Layer | Shape (`ty:4`), null (`ty:3`), precomp (`ty:0`) có clip/start offset, stacking, parent transform, hidden, ip/op; adjacent alpha/inverted-alpha/luma/inverted-luma matte (`tt:1..4`) |
| Group | `gr`, nested group, `tr`, style scope theo thứ tự Lottie; trim path `tm` simultaneous (`m:1`) / individual (`m:2`) |
| Geometry | `sh`: open/closed cubic Bézier; `rc`: rectangle + corner radius; `el`: ellipse |
| Paint | `fl`/`st`: solid RGB + opacity, fill rule, stroke width/cap/join/miter; `gf`/`gs`: linear/radial gradient, animated color/opacity stops; animated stroke dash/gap/offset |
| Transform | anchor, spatial position Bézier, split x/y, rotation, uniform/nonuniform scale, opacity, animated skew/axis; 2D |
| Keyframe | static, hold, linear, temporal cubic Bézier; point-property easing theo component, transform position/scale dùng easing chung |
| Morph | path cùng số vertex, interpolate cả v/i/o; closure có thể đổi theo keyframe với ngữ nghĩa segment của rlottie |
| Color | interpolate sRGB qua linear space; endpoint RGB quantized 8-bit như baseline |
| Playback | source FPS (default), fractional frames (opt-in), reverse seek, nonzero composition ip |
| Layout | contain/cover/none/scaleDown/fitWidth/fitHeight/fill; stroke theo Canvas transform như baseline hiện tại |

Nonuniform stroke scaling được so lại với source lottie 3.8.2: baseline cũng concat
Canvas matrix khi vẽ stroke. Vì vậy giới hạn uniform stroke của bản đầu đã được gỡ;
Canvas backend có cùng ngữ nghĩa. Rectangle và ellipse hỗ trợ direction đảo `d=3`.
Package lottie 3.8.2 bỏ qua rectangle direction và không render luma matte; các case
này dùng kiểm tra pixel trực tiếp và oracle C++ rlottie, không giả định baseline
hỗ trợ mọi feature. Xem `rlottie-features.md` để biết khác biệt cụ thể.

Các ops còn bị từ chối: image/text/font, 3D, layer mask, visual effects (Layer Control có hỗ trợ), blend mode,
repeater/merge/polystar, expression JavaScript ngoài cú pháp content-reference, slot, radial focal point,
time remap/stretch, chained/nonadjacent matte và morph thay số vertex. Shape/null layer st là metadata;
precomp dùng st để map child timeline. sr phải bằng 1. Parent opacity không nhân
vào child parented layer. Opacity áp trên từng paint, như mặc định baseline
`isApplyingOpacityToLayersEnabled=false`.

Example chỉ có fastlottie/lottie, không tự chuyển engine khi lỗi. Coverage **94/94
native**; expression tham chiếu content scale/opacity và Layer Control đã bổ sung.
Chi tiết ở `no-fallback.md`. Raw LoD vẫn chạy animation khi cuộn.

Các field metadata được allowlist; field mới không được biết cũng bị từ chối.
Đây là subset chủ đích; một file có các shape quen thuộc vẫn có thể bị từ chối
vì modifier, expression, hoặc dữ liệu asset khác ở root.

## Độ đúng

`test/fastlottie_test.dart` rasterize cùng frame bằng cả hai renderer. Bộ test
bao gồm 5 fixture tạo trong project và 5 file thực trong rlottie resource:
`gears`, `tile_grid_loading_animation`, `movie_loading`, `glow_loading`,
`loading_animation`. Có seek ngược, subframes, cubic easing, color, opacity,
parenting, fill rules, rounded rectangle, reverse ellipse, open path, sizing.

Ngưỡng differential: mean absolute RGBA error < 0.65/255; tỷ lệ channel lệch hơn
12/255 < 0.6%. Sai khác nhỏ ở antialiasing và integer rounding được cho phép.
Raster cache ở đúng pixel size được kiểm tra bằng equality byte với vector output.
Test corpus riêng compile toàn bộ resource và phân biệt accept/reject; chỉ những
file trong differential tests mới được khẳng định đã so hình với baseline.


Bộ TGS bổ sung: differential cả 94 file native × 8 frame (752 samples), global MAE
<0.65/255, large-channel error <1.6%, flat-region MAE <0.5/255 để tách AA của artwork
nhiều outline. Các fixture đơn giản giữ gate <0.6% như trước. Worker test parse và
raster cả 94 file bằng đúng backend tương ứng, không chỉ audit tên ops.
Oracle native tùy chọn kiểm tra 12 case × 9 frame trực tiếp với source rlottie.
`rlottie-corpus-audit.json` ghi 34/93 resource compile/fork được; đây không phải
khẳng định cả 34 đã có differential pixel tests.
