# TGS loading kẹt ở worker trong phiên profile Android

Kiểm tra trực tiếp phiên Pixel 7a ngày 2026-11-09 qua VM Service cho thấy:

- Main isolate có `pauseEvent.kind = Resume`.
- Worker `tgs.inflate-parse-compile` có `pauseEvent.kind = PauseStart`, timestamp
  giữ từ lúc worker được tạo; chưa chạy callback decode.
- VM flag `pause_isolates_on_start = true`, `modified = true`.
- Không ghi nhận Dart runtime error tại thời điểm kiểm tra.

Gallery giới hạn một decode job trên Android. Job đầu bị giữ trước khi chạy nên
`await decoder(...)` không hoàn tất và toàn bộ job sau nằm chờ. `framePaced`
chỉ áp dụng sau decoder, vì vậy không phải điểm chờ của job đang quan sát.

Đã sửa trạng thái phiên bằng VM Service, cả hai RPC đều trả `Success`:

```text
setFlag(name: pause_isolates_on_start, value: false)
resume(isolateId: <worker đang PauseStart>)
```

Sau đó phiên app/DTD kết thúc nên chưa xác nhận được trạng thái gallery load
hoàn tất. Chưa xác định client/tool nào đã bật flag; không quy kết cho compiler
hay hệ điều hành dựa vào hiện tượng loading trống.

Nếu tái diễn khi chạy từ IDE, kiểm tra debugger có tự pause isolate mới và có
resume worker hay không. Chạy profile từ terminal ngoài phiên debugger để cô
lập cấu hình IDE:

```sh
cd example
flutter run --profile -d 3C091JEHN14062 -t lib/main.dart
```

Không thêm workaround đổi cờ debugger vào mã sản phẩm. Không cần sửa parser,
tăng concurrency hoặc đưa decoding về UI isolate cho lỗi pause này.
