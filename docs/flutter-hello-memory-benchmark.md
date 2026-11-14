# RAM nền của Flutter Hello World trên Mac M5

Đo ngày 14/11/2026, Mac M5 16 GiB, macOS 27.2, Flutter
3.51.0-0.1.pre/Dart 3.15 dev. App được tạo riêng bằng `flutter create --empty`,
build release/AOT. Giữ nguyên template của SDK hiện tại: `MaterialApp`,
`Scaffold`, `Center`, `Text('Hello World!')`, dependency `material_ui` 1.1.0.
Không có FastLottie, asset TGS, server HTTP hoặc plugin đo trong app.

Cửa sổ mặc định 800 × 600 logical px, như app example. Khởi động ba process
mới, đo physical footprint qua `proc_pid_rusage` ở giây thứ 5, 10 và 30 kể
từ lúc gọi mở app. Mỗi mốc lấy ba mẫu cách nhau ít nhất 500 ms. Mỗi ô median
là median của median từng process. Đơn vị MiB:

| Thời gian từ lúc mở | Median footprint | Min–max của ba lượt |
| --- | ---: | ---: |
| 5 giây | 67,2 | 66,2–135,1 |
| 10 giây | 66,1 | 58,5–76,6 |
| 30 giây | **60,7** | **56,0–66,2** |

Đỉnh footprint do kernel ghi nhận: median **153,7 MiB**, khoảng 153,5–162,9
MiB. RSS ở mốc 30 giây: median **90,5 MiB**, khoảng 88,3–100,9 MiB. Đỉnh
khởi động và RSS có phạm vi/cách tính khác footprint khi app đã ổn định.

Đây là mốc nền của một cửa sổ Flutter tĩnh đã render chữ, không phải phép đo
riêng Dart runtime. Không ép GC. Footprint giảm trong thời gian app rảnh;
phép đo này chưa phân loại nguyên nhân giảm theo allocator/driver/OS.

Để đối chiếu, [benchmark chat](chat-memory-benchmark.md) đo Mini-Strip ở mốc
chat ban đầu là 272,5 MiB và sau khi đóng picker là 468,2 MiB. Chênh với Hello
World ở giây 30 lần lượt khoảng 212 và 407 MiB. Các số này thuộc những lượt
đo khác nhau, với workload khác nhau, nên chỉ dùng làm mốc tham khảo; không
coi phép trừ là chi phí chính xác của thư viện FastLottie.

## Chạy lại

Từ thư mục gốc repo:

```sh
flutter create --empty --platforms=android,macos --org com.example \
  --project-name flutter_hello_ram build/flutter-hello-ram-2026-11-14/app
(cd build/flutter-hello-ram-2026-11-14/app && flutter build macos --release)
caffeinate -di python3 build/flutter-hello-ram-2026-11-14/measure.py --platform macos
```

Giữ cửa sổ ở phía trước trong thời gian đo. Source app, lockfile, binary,
script đo và JSON thô nằm trong `build/flutter-hello-ram-2026-11-14/`.
APK release cũng đã build; lượt Android bị che bởi bảng thông báo đã bị
loại. Theo yêu cầu tiếp theo của người dùng, kết quả chỉ gồm Mac.

## Bổ sung: Hello World có animation liên tục

Cùng SDK/release/cửa sổ, thêm RotationTransition cho dòng chữ. Ba process ở
giây 30: median **131,2 MiB**, range 130,5–131,2 MiB. Mức 60,7 MiB ở trên
là màn hình tĩnh đã rảnh, không phải baseline cho chat tự phát.
Xem [phân tích Graphics và tối ưu Mac](chat-graphics-memory-macos.md).
