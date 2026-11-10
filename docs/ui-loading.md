# Giảm công việc UI khi gallery load TGS

Theo yêu cầu không chạy benchmark trong đợt này. Những thay đổi dưới đây được
kiểm chứng bằng invariant/test chức năng, không dùng để tuyên bố FPS hay hết jank.

Pipeline hiện gom tối đa 2 file/worker và tách decode khỏi publish UI; xem
[tối ưu decode](tgs-decoding.md). Decode gzip, fused JSON parse và compile vẫn ở
`compute` trên native. Tuy nhiên,
trước đây tạo player vẫn clone cả scene trên UI; nhiều model hoàn thành còn có thể
làm nhiều cell khởi tạo trong cùng một frame. Mỗi cell loading có spinner riêng.
Compiler expression mới cũng duyệt mọi field và tạo chuỗi JSON path ngay cả khi
layer không có expression, gây cấp phát không cần thiết trong worker.

Đã sửa:

- Worker gọi `prepareForPlayback`: clone state cho player đầu tiên và tính trước
  static/path flags ở worker. Graph chỉ gồm Dart data, không tạo Path/Paint/Shader.
  UI lấy scene đã chuẩn bị bằng cách chuyển reference, không clone lại.
- Player tạo scene theo nhu cầu. Constructor/dispose không fork graph. Nếu raw LoD
  tìm được texture dùng chung, player mới không cần tạo scene. Điều này có ích khi
  cuộn quay lại các cell đã cache. Player khác vẫn có state riêng khi cần vẽ vector.
- Expression resolver chỉ chạy trên layer thực sự chứa expression. Precheck không
  tạo JSON path cho từng coordinate/key; vẫn validate expression/cycle như trước.
- Gallery bật `TgsStore.framePaced`: tối đa một kết quả cold được publish mỗi frame,
  có queue riêng với số model đang decode/chờ publish được giới hạn. Mobile một
  worker batch 2 file, được chạy tiếp trước khi UI publish hết. Warm cache trả ngay;
  không reparse hoặc qua cổng này. Dispose hoàn tất ngay các future chưa xong.
- Cell loading để trống; không có spinner/counter hoặc listener thống kê store
  trên UI gallery.

Hai renderer fastlottie/lottie, 94 TGS native, cấu hình FPS/LoD và animation chạy
khi scroll giữ nguyên trong đợt decode này. Không thêm pause hoặc tự fallback.

`prepareForPlayback` tốn thêm graph state trong worker trước khi player đầu dùng;
immutable keyframes vẫn được chia sẻ. Prepared scene được lấy ra khỏi composition
trước khi vẽ, template không bao giờ giữ native rendering handles. Method này nên
gọi trong worker; `fromBytesAsync`/`loadAsset` và TGS decoder của gallery làm tự động.

Giới hạn: native Path construction, Canvas recording và cache miss đầu tiên của
LoD vẫn cần UI/render isolate. Các thay đổi không làm toàn bộ lần vẽ đầu thành
công việc background. Web compute vẫn chạy cùng isolate theo cơ chế Flutter.

Tests thêm kiểm tra worker-return có scene chuẩn bị, constructor/dispose không
khởi tạo scene, texture hit không fork, một publication/frame và dispose không
để waiter treo. Bộ test hiện có vẫn kiểm tra transfer/raster đủ 94 TGS và so ảnh.
