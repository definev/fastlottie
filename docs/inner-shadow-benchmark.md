# Inner Shadow sắc cạnh

Apple M5, macOS, Flutter Release AOT, native software bật. Mỗi phép đo
render tất cả source frame trực tiếp vào buffer, không dùng cache frame.
Harness luân phiên bản gốc và bản chỉ bỏ `sy`, bỏ 4 lượt warmup và lấy
median của 20 lượt. Scratch là tổng dung lượng buffer pixel tạm giữ lại
lớn nhất quan sát ở cuối một lượt; không gồm output và các buffer coverage.

| Sticker | Kích thước | Không bóng (µs/frame) | Có bóng (µs/frame) | Scratch không/có bóng (KiB) |
| --- | ---: | ---: | ---: | ---: |
| halo | 96² | 86 | 85 | 61 / 61 |
| halo | 256² | 429 | 427 | 415 / 415 |
| scrunched_eyes | 96² | 75 | 92 | 61 / 92 |
| scrunched_eyes | 256² | 374 | 479 | 415 / 622 |
| scream | 96² | 139 | 136 | 61 / 61 |
| scream | 256² | 663 | 643 | 419 / 419 |

Ở `halo` và `scream`, style chỉ xuất hiện ở layer dùng làm alpha matte,
nên có thể bỏ qua bước tô bóng; sai khác thời gian nhỏ không chứng minh
tăng tốc. Ở `scrunched_eyes`, bóng xuất hiện trên layer nhìn thấy: tăng
khoảng 17 µs/frame tại 96² và 104 µs/frame tại 256² trên máy này.

Chạy lại từ thư mục `example`:

```sh
flutter run -d macos --release -t lib/inner_shadow_benchmark.dart
```
