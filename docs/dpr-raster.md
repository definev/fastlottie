# Sửa raster cache theo DPR — 2026-11-09

Lỗi ban đầu: demo chuẩn bị bitmap 256×256 pixel và vẽ vào 256×256 logical pixel.
Trên DPR 2, màn hình cần 512×512 pixel nên bitmap bị upscale, mất chi tiết.

`prepareRaster` nhận `width`, `height` logical (cả kích thước lẻ), thêm
`devicePixelRatio` mặc định 1 để tương thích với các caller cũ. Caller có thể truyền
kích thước pixel trực tiếp với DPR 1 như trước. Kích thước cấp phát:

```
pixelWidth  = ceil(logicalWidth  × devicePixelRatio)
pixelHeight = ceil(logicalHeight × devicePixelRatio)
RGBA bytes  = pixelWidth × pixelHeight × frameCount × 4
```

Canvas raster dùng scale theo logical size × DPR chưa làm tròn; source rect khi
draw cũng dùng content extent này. Phần padding dưới một pixel ở cạnh ảnh do ceil
không bị stretch vào viewport. Vì vậy DPR/kích thước lẻ không đổi aspect ratio
stroke hoặc kích thước hình. `rasterSize` cho biết allocation pixel thực và
`rasterBytes` tính cả padding.

Demo theo dõi MediaQuery.devicePixelRatioOf trong didChangeDependencies; thay
player khi DPR, kích thước, composition hoặc budget đổi. Mọi player cũ được
dispose; cancellation của prepare đã lỗi thời được xử lý cả khi đổi liên tiếp
trong một frame hoặc unmount.

Budget mặc định của API vẫn 32 MiB. Demo chủ động dùng 64 MiB: animation 60 frame
ở 256 logical px/DPR 2 cần 60 MiB, DPR 3 cần 135 MiB. Nếu vượt budget, demo dùng
picture cache ở độ phân giải hiển thị; không âm thầm hạ resolution hoặc phóng
bitmap cache từ DPR cũ.

Kiểm tra: test pixel so raster với vector tại DPR 1.5/2/3, kích thước lẻ/DPR 1.25;
test allocation/budget và input DPR không hợp lệ; widget tests cho đổi DPR,
resize, thay composition, fallback/recovery và cancellation khi unmount.
Benchmark cũ giữ nguyên như dữ liệu lịch sử ở DPR 1; chưa đo lại HiDPI.

Kết quả kiểm chứng: `flutter analyze` sạch; 28 test package và 3 test example pass.
Example macOS debug build chạy, hot reload thành công, không có runtime errors.
