# Hai renderer, đủ bộ 94 TGS

Giao diện chỉ có **fastlottie** và **lottie**, mặc định fastlottie. Đã bỏ Auto và
menu workload. Preset workload còn trong code dành riêng cho benchmark/test cũ.
Parser chọn đúng engine được yêu cầu; fastlottie lỗi thì hiện lỗi, không parse lại
bằng lottie. Test riêng xác nhận lỗi expression không làm đổi backend.

Raw LoD giữ mọi animation đang thấy chạy cả khi kéo/fling. Scale/FPS lấy từ
cấu hình gallery; clock theo đúng sample rate cần dùng, xem
[cấu hình LoD](lod-cache.md) và [giảm render thừa](flutter-render-work.md). Không có
pause-on-scroll hoặc cap 8 ô/30 FPS trong chế độ mặc định. Vẫn tôn trọng
background, reduced motion và TickerMode. UI chỉ có selector renderer và grid;
không có preview hoặc nút pause. Thumbnail vẫn dùng LoD và cache bounded.

## Ops bổ sung

- Skew và skew axis động, kết hợp rotation, nonuniform scale và anchor; cache path
  và fork player tính cả hai track. Có differential test skew/axis động, seek ngược.
- Expression tham chiếu `content('name').transform.scale` và
  `content('group').content('stroke').opacity`, bao gồm tên Unicode escaped.
  Compiler resolve tới track nguồn trong layer, giữ keyframe/easing động. Giá trị
  `k` dự phòng khác track nguồn không được dùng thay cho expression. Tham chiếu
  trực tiếp chính property đọc track trước expression; vòng tham chiếu gián tiếp
  hoặc target thiếu/trùng tên bị từ chối. Không eval JavaScript mỗi frame.
- `ADBE Layer Control` với control con `ADBE Layer Control-0001`: validate kiểu,
  keyframes và layer ID. Đây là effect control dữ liệu, không phải visual filter;
  không cần saveLayer hay xử lý pixel thêm cho các file hiện có.

**94/94 file** được nhận và vẽ bằng fastlottie, không fallback. So ảnh với lottie
ở 8 frame/file = **752 samples** đã qua gate TGS hiện tại. Worker tests chuyển model
và raster cả 94 file; test khác kiểm tra expression bằng track tham chiếu mong đợi
vì baseline không có JavaScript evaluator. Audit cập nhật ở `tgs-audit.json`.

Phạm vi “đủ ops” ở mốc này là toàn bộ ops cần cho 94 TGS trong example. Không đồng
nghĩa hỗ trợ mọi chương trình JavaScript, mọi visual effect của After Effects,
text/image/3D hoặc mọi file Lottie. Những trường hợp ngoài compiler vẫn báo JSON
path, không âm thầm bỏ qua. Các báo cáo benchmark trước với 89 native + fallback,
hay pause-on-scroll, là snapshot lịch sử; chưa dùng chúng để kết luận FPS của bản này.
