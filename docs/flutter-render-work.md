# Giảm công việc render duy trì của Flutter

Đợt này tối ưu theo code và kiểm tra chức năng trên mobile, không chạy benchmark
FPS/nhiệt để suy ra phần trăm giảm nhiệt. Native Compose và Flutter dùng pipeline
khác nhau; không quy toàn bộ chênh lệch nhiệt quan sát được cho một nguyên nhân.

## Công việc thừa đã xác định

Gallery đặt `tgsRasterFrameRate = 30`, nhưng raw LoD trước đây cấp progress theo
source FPS và clock không có giới hạn. 79/94 TGS có source FPS 60, 15 file có FPS 30.
Vì vậy 60 update/giây có thể vẫn trỏ tới 30 ảnh cache/giây; ticker còn xin engine
frame theo display vsync. Dù một tick không đổi bitmap, việc xin thêm frame vẫn
có chi phí engine/composition/raster. Không gọi việc thông báo ít hơn là đủ để
ngừng scheduling.

`FastLottie`/`FastLottieView` cũng nghe trực tiếp mọi tick từ Animation, chưa lọc
sample đã hiển thị. Grid lại thêm RepaintBoundary bên ngoài boundary có sẵn của
cả hai renderer. Khi cache đầy các entry đang dùng được pin, player bị từ chối
cache vẫn thử cấp chỗ và duyệt lại các entry ở mỗi lần paint.

## Thay đổi

- `StickerProgress` đăng ký tốc độ cần dùng với `StickerClock`. Clock chạy theo
  tốc độ cao nhất của consumer đang sống, có xét cap cấu hình; consumer cuối rời
  viewport thì dừng ticker. Cache 30 FPS dùng progress 30 FPS ngay từ đầu; mode
  vector/baseline vẫn theo FPS nguồn. Bỏ consumer 60 FPS sẽ trả clock về 30 khi
  các consumer còn lại chỉ cần 30, không để clock ở display vsync.
- Timer xin frame sau vsync liền trước sample, tránh xin sớm và sinh frame trùng.
  Timeline vẫn theo elapsed của vsync, không chậm animation theo số callback.
- Painter lọc theo cùng hàm resolve sample mà player dùng khi draw. Các tick cùng
  source/raster frame không mark paint lại. Invalidation/cache-ready vẫn repaint;
  `useFrameRate: false` vẫn vẽ subframe. Gate của painter không tự đổi scheduling
  policy của AnimationController do caller sở hữu.
- Giữ vị trí sample phân số (ví dụ 60→24 FPS có step 2.5) qua normalized progress,
  chỉ floor khi vẽ geometry; không mất sample vì floor hai lần.
- Grid bỏ boundary tự thêm; giữ boundary có sẵn của renderer để isolate canvas.
- Cache memoize admission thất bại theo player/size/budget generation. Chỉ thử lại
  khi size thay đổi, clear, eviction hoặc entry hết user làm budget có thể dùng
  lại. Không đổi LoD hoặc vượt budget. Warm hits không tạo thêm scene.
- Giữ scale 0.5, cache sampling 30, budget 64 MiB và cấu hình worker hiện có.
  Mọi cell đang thấy vẫn animate khi cuộn; không có scroll → clock/cache gating.

Cache vẫn reserve cả cycle. Clip không vừa budget vẫn vẽ vector bằng fastlottie;
việc giảm vòng quét admission không tự loại bỏ chi phí vector/raster của clip đó.
Cold raster miss/Path/Canvas vẫn cần UI/render isolate. Chưa kết luận ngang nhiệt
Compose hay hết thermal throttle chỉ từ các thay đổi scheduling.

## Kiểm chứng

64 test core (có rlottie oracle) và 28 test example pass; analyzer sạch. Regression
cases kiểm tra hai tick cùng cache frame không repaint, clear cache vẫn repaint,
subframe vẫn repaint, admission không thử lặp khi budget pin/full và thử lại sau
release, clock đổi theo consumer rates, sample step 2.5, timeline/lifecycle và
animation tiếp tục khi scroll. Các gate ảnh/TGS 94×8 vẫn pass.

Android manifest giữ MainActivity là launcher đầu tiên để `flutter run` mở đúng
Flutter; icon TGS Compose vẫn mở Activity native riêng.

Đã hot restart bản debug trên Pixel, không có Dart runtime error. Khi kiểm tra
tiếp, thiết bị ở Dozing/keyguard: không có consumer animation, cache chưa raster,
store decode 4 model rồi dừng tại publication bound đúng thiết kế. Vì máy vẫn khóa
chưa kiểm chứng render foreground hoặc mức giảm nhiệt; không dùng snapshot này
làm số đo FPS/năng lượng. Bản profile cuối đã build cho arm64. Pixel ngắt USB trước lượt cài bản cuối
(sau bổ sung tolerance 1 microsecond và regression test); APK hiện ở
`example/build/app/outputs/flutter-apk/app-profile.apk`. Cần nối lại thiết bị để
cài và kiểm tra render foreground/nhiệt.

Lượt chạy sau khi Pixel nối lại: đã cài APK profile arm64 cuối, cold-start
MainActivity và xác nhận grid Flutter hiển thị trên màn hình máy thật. Log gần
nhất không ghi nhận E/flutter/Unhandled Exception. Chưa đo lại nhiệt/FPS.
