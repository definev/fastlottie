# Demo sticker: 100 ô, chất lượng theo ngữ cảnh

Màn mặc định là `TelegramStickerDemo`: vùng sticker lớn phía trên, bảng hữu hạn
100 ô phía dưới, tất cả nằm trong viewport. Layout tự chọn số cột theo diện tích.
94 TGS thật được dùng hết; 6 ô lặp lại dùng chung atlas. Chạm thumbnail chọn sticker
lớn. Đây là demo lấy cảm hứng từ bố cục Telegram, không phải clone đầy đủ chat.
Vẫn chỉ có hai renderer fastlottie/lottie. Gallery cuộn cũ ở route `/gallery`.

## Đánh đổi chất lượng và công việc

Cấu hình ở `example/lib/tgs/sheet.dart`: `stickerThumbnailPixels = 56` (cạnh dài
physical px tối đa), `stickerThumbnailFrameRate = 30`, `stickerSheetBytes = 96 MiB`.
Kích thước ban đầu còn giới hạn ở 0.75 × cạnh ô × DPR, không tự thay đổi liên tục
hoặc giảm chất lượng từng clip khi cache đầy. Sticker lớn dùng vector ở 30 FPS.

`FastLottieAtlasLayout` tính chính xác bytes của cả vòng lặp, gồm gutter và khoảng
trống trang cuối. 94 clip có 7.146 sample, dùng 96.183.488 bytes tại 56 px (~91,73
MiB), dưới budget. Frame được đóng thành trang tối đa 32 sample/1024 px; hình có
1 pixel gutter trong suốt, clip riêng từng ô, bilinear sampling. Full loop tránh
vòng lặp evict/raster lại mãi. Atlas chỉ giữ metadata/texture, không giữ scene.

Một CustomPainter vẽ cả bảng, một clock 30 FPS. Sau chuẩn bị, mỗi thumbnail chỉ
lookup sample theo elapsed và drawImageRect; không evaluate geometry, parse JSON,
rebuild widget hay tạo texture mỗi tick. 6 bản sao dùng cùng texture và phase.
Không tuyên bố drawImageRect là một GPU draw call cho toàn bảng.

Chuẩn bị dùng một atlas job tại một thời điểm, hai model pin trước, cache model
4 entry. TGS vẫn inflate/parse/compile ở worker. UI ghi hình theo slice mềm 2 ms,
yield qua frame; một source frame phức tạp có thể vượt slice này. Chỉ một chuyển
Picture → Image đang chạy. Silhouette frame đầu được tạo offline và đóng gói sẵn, hiển thị cho tất cả
ô chưa có loop, kể cả file chưa decode; không render poster lại khi mở app.
Cold start phải chuẩn bị lại; chưa có disk cache. GPU/engine overhead, transient
Picture và compiled model nằm ngoài budget RGBA nói trên.

## Khi nghẽn: frame đầu và silhouette

`StickerPressure` nhận FrameTiming có sẵn, không thêm overlay FPS hay benchmark.
Nếu build hoặc raster >24 ms nhiều lần (điểm tăng khi chậm, giảm khi nhanh, ngưỡng6),
bảng chuyển về frame đầu bằng màu silhouette `srcIn`, bỏ subscription clock;
sticker lớn trong chat cũng chuyển frame0 silhouette. Chuẩn bị atlas dừng tại
điểm yield kế tiếp. Không có animation nền bị che bởi hình tĩnh.

Sau 5 giây cho chạy thử lại. Nếu tiếp tục nghẽn thì quay về silhouette. Đây là
heuristic frame pressure/cooldown, **không phải cảm biến nhiệt**, không khẳng định
hết thermal throttling. Lifecycle/TickerMode vẫn dừng clock/preparation khi ẩn;
không phụ thuộc scroll. Renderer lottie cũng giữ frame0 silhouette khi nghẽn,
nhưng vẫn dùng pipeline/package lottie riêng, không có fastlottie atlas.

## Kiểm chứng

- Atlas test: pixels bằng vector trực tiếp qua nhiều trang/loop, source ip khác0,
  step phân số, budget/cancellation, silhouette lấy alpha frame0, corpus vừa RAM.
- Geometry test: toàn bộ100 slot nằm trong viewport portrait/landscape và hit-test.
- Pressure test: spike đơn lẻ không trigger, overload/cooldown/retry/dispose.
- 33 test example pass; 16 test core cache/loading/atlas pass trước khi thêm test
  silhouette; suite atlas cuối 5/5 pass. Analyzer sạch.
- Pixel7a: debug hot restart thành công; atlas trước pressure đã hoàn tất94/94,
  errors rỗng và100ô hiển thị. Inject6 slow sample qua VM xác nhận cả thumbnail
  và chat chuyển silhouette. Không có Dart runtime error.
- Profile arm64 đã build/cài và khởi chạy trên Pixel. Không đo FPS/nhiệt trong
  lượt này; chưa khẳng định mục tiêu không nóng máy đã đạt.

## Silhouette có sẵn trước TGS decode

`assets/sticker_posters.png` + JSON là sprite sheet frame0 đã render offline cho
mọi TGS được khai báo trong pubspec. PNG ~126 KiB; decode thành một texture
600×600 (~1,37 MiB RGBA). Catalog và ảnh nhỏ được nạp trước khi mount bảng;
mọi ô chưa có atlas dùng ngay silhouette này, không cần inflate/compile TGS.
Giữ ảnh cho các file load lỗi nữa. Đây là hình đúng alpha frame0, không phải
placeholder hình chữ nhật hoặc shimmer chạy liên tục.

Tái tạo khi thêm/thay file TGS:
`flutter test --no-pub tool/generate_sticker_posters.dart` từ root repo.
Generator chỉ lấy các pack đã khai báo trong `example/pubspec.yaml`; pack mới
chưa khai báo không tự được thêm. Test kiểm tra mapping khớp toàn bộ catalog.
Silhouette là build artifact; không thêm renderer fallback. Frame0 trong suốt
thì silhouette cũng trong suốt đúng source. Bản silhouette lớn lúc quá tải vẫn
lấy từ renderer của sticker; sprite sheet phục vụ bảng thumbnail chưa load.

Bổ sung sprite sheet: 6 test poster/geometry/pressure pass, hot restart trên Pixel
không có Dart runtime error. Screenshot cold preparation xác nhận các ô chưa load
đều có silhouette, những ô đã sẵn sàng chuyển thành animation. Đã cài và mở lại
APK profile có sprite sheet trên Pixel7a. Analyzer và diff whitespace sạch.
