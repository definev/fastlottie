# Giới hạn cache vector của sticker lớn

Bài A/B dùng cùng bản release của [benchmark RAM app example](chat-memory-benchmark.md).
Cả hai cấu hình dùng Mini-Strip mặc định cho picker và emoji. Sticker lớn vẫn
vẽ vector, cùng kích thước và frame rate gốc. Biến duy nhất là cache `ui.Picture`
của mỗi sticker lớn: `unbounded` hoặc `bounded-12` (tối đa 12 frame và 100.000
lệnh vẽ; đây không phải giới hạn theo byte). App demo mặc định giữ `unbounded`.

Build lại target `lib/chat_memory_benchmark.dart` theo hướng dẫn benchmark RAM,
rồi chạy từ thư mục gốc:

```sh
python3 tool/run_chat_memory_benchmark.py --platform macos --mode mini-strip \
  --hero-cache unbounded --hero-cache bounded-12 --output /tmp/hero-cache-macos.json
python3 tool/run_chat_memory_benchmark.py --platform android --mode mini-strip \
  --android-device "$ANDROID_SERIAL" --hero-cache unbounded --hero-cache bounded-12 \
  --output /tmp/hero-cache-android.json
```

Mỗi cấu hình chạy ba process mới trên mỗi thiết bị, xen kẽ thứ tự. Workload mở
và cuộn picker, soạn 24 emoji, gửi 12 sticker, đóng picker, chạy thêm năm vòng
mở/cuộn/đóng, bật Reduce Motion rồi hủy chat. Android lấy tổng PSS; Mac lấy
physical footprint. Mỗi mốc lấy median của ba mẫu trong lúc app vẫn phát
animation. Đỉnh Mac do kernel ghi; đỉnh Android chỉ là mẫu PSS cao nhất đã lấy.

Frame timing dùng `FrameTiming` của Flutter. Mỗi mốc tóm tắt các frame đã được
Flutter chuyển tới callback từ sau lần xác nhận mốc trước đến lúc bắt đầu đo
RAM ở mốc hiện tại. Callback gửi theo lô nên biên không khớp chính xác từng
frame. Build và raster p95 được tính riêng; tỷ lệ vượt ngân sách đếm frame có
một trong hai giai đoạn vượt chu kỳ refresh của màn hình. Tỷ lệ này không phải
phép đếm frame bị bỏ trên màn hình.

## Kết quả 14/11/2026

Mac M5/macOS 27.2 ở 120 Hz và Pixel 7a/Android 17 ở 90 Hz, Flutter release
3.51.0-0.1.pre. Đủ 12 process, 144 mốc và 432 mẫu bộ nhớ. Lượt bị app khác
che cửa sổ được chạy lại. Android thermal status 1–2; không thấy cơ chế giảm
tải của chat bật ở các mốc được giữ lại. Sau khi đóng picker có 4 sticker lớn
được mount trên Mac và 5 trên Pixel, như nhau giữa hai cấu hình.

Bảng ghi median của ba process, theo thứ tự `unbounded` → `bounded-12`:

| Chỉ số | Mac M5 | Pixel 7a |
| --- | ---: | ---: |
| RAM sau khi gửi 12 sticker | 476,5 → 467,7 MiB | 517,6 → 525,2 MiB |
| RAM sau khi đóng picker | 475,0 → 465,8 MiB | 522,5 → 521,5 MiB |
| RAM sau 5 vòng mở/cuộn/đóng | 456,9 → 446,8 MiB | 539,8 → 531,3 MiB |
| Đỉnh RAM | 540,2 → 524,5 MiB | 550,1 → 543,8 MiB |
| Build p95 sau khi đóng picker | 0,71 → 2,06 ms | 3,37 → 6,95 ms |
| Raster p95 sau khi đóng picker | 2,08 → 2,08 ms | 7,11 → 6,73 ms |
| Build p95 trong đoạn đến mốc vòng 5 | 1,55 → 2,10 ms | 7,62 → 12,85 ms |
| Frame vượt ngân sách trong đoạn đến mốc vòng 5 | 0,28% → 0,14% | 2,48% → 7,25% |

Trên Mac, mọi lượt cache giới hạn đều thấp hơn sau khi đóng picker: khoảng
460–469 MiB so với 474–483 MiB. Trên Pixel, hai khoảng này chồng nhau:
520–532 MiB so với 516–535 MiB. Native Heap của Pixel giảm khoảng 18 MiB,
nhưng `Graphics` và `Private Other` tăng khoảng 9–10 MiB mỗi nhóm ở mốc đó.
Các nhóm là median độc lập và không thể hiện chi phí chính xác của từng
`ui.Picture`. Bộ đếm cache ảnh picker chỉ chênh khoảng 1 MiB trên Pixel.

Mức giảm tổng RAM nhỏ, trong khi việc ghi lại các frame vector đã bị loại làm
tăng chi phí build. Ở đoạn cuộn lặp trên Pixel, p95 build vượt ngân sách
11,11 ms của màn hình 90 Hz. Giữ `unbounded` làm mặc định; nếu cần tối ưu
tiếp, ưu tiên đo chi phí đồ họa của render target/texture và thử thu hồi cache
khi đóng picker, kèm frame timing lúc mở lại.
