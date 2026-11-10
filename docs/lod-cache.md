# LoD cố định

Chất lượng không gian chỉ có một tham số: `tgsLodScale` trong
`example/lib/tgs/gallery.dart`. Giữ giá trị đang cấu hình trong code.

```text
pixel raster = kích thước nội dung hiển thị × DPR × tgsLodScale
```

Scale 0.2 dùng 20% mỗi chiều, khoảng 4% số pixel so với raster đầy đủ. Số frame,
độ dài clip và cache còn trống không tự thay đổi scale. Đã bỏ API
`maximumEntryBytes` và tính toán tự giảm nét theo budget từng clip.

Cache chung vẫn giới hạn 64 MiB RGBA/reservation. Reserve đủ cycle để tránh xóa
frame liên tục giữa các vòng lặp; số frame chỉ ảnh hưởng khả năng nhận cache và
bộ nhớ. Entry đang dùng được pin; entry không còn dùng có thể bị evict. Nếu không
đủ budget, player vẽ vector bằng cùng renderer. Đây không phải giới hạn toàn bộ
heap/GPU memory.

FPS cache lấy từ `tgsRasterFrameRate`; strategy giữ cấu hình trong gallery.
Giới hạn FPS cache chỉ lấy mẫu timeline, không làm
animation chạy chậm. Với incremental, frame chưa cache vẫn vẽ vector trong lúc
chờ raster, nên scale cố định áp dụng cho ảnh đã cache.

Cache key vẫn cần composition, kích thước pixel, animation/poster và frame để
không dùng nhầm ảnh. Không còn thêm chiều budget từng clip để quyết định độ nét.

Sau khi chỉnh các hằng số cần restart app để tạo lại cache. Chưa chạy benchmark
hiệu năng cho thay đổi này; các số đo cũ thuộc cấu hình cũ.

Scroll không điều khiển clock hoặc bật/tắt raster cache ở bất kỳ preset nào.
LoD không có listener scroll của gallery. Preset Mobile chỉ dùng scroll để cập
nhật cửa sổ 8 ô đang phát ngay khi đổi hàng; không chờ kết thúc scroll để chạy lại.
Clock/cache chỉ chịu lifecycle, TickerMode và reduced motion như trước.
Clock lấy tốc độ cần từ các consumer; progress của raster cache khớp tốc độ lấy
mẫu để không repaint một bitmap nhiều lần. Xem [render work](flutter-render-work.md).

Kiểm chứng cache trước đó: 8 test raster cache và 21 test example pass. Đợt bỏ
scroll-clock: 9 test gallery pass, analyzer sạch; test kiểm tra clock/cache tiếp
tục hoạt động khi kéo/fling, cùng việc cập nhật active window. Hot restart trên
Pixel 7a thành công.
