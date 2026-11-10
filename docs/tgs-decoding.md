# Pipeline decode TGS theo batch nhỏ

Gallery dùng `TgsStore` để đọc asset và cache model; `decoder.dart` chỉ xử lý
bytes → model. Imports từ `store.dart` vẫn dùng được vì file export decoder.
Hai renderer được chọn rõ ràng, không tự chuyển engine khi parse lỗi.

## Worker và chuyển dữ liệu

Store gom các acquire trong cùng lượt build bằng một microtask, tối đa 2 file
mỗi batch. Android/iOS giữ 1 worker đồng thời; các platform khác mặc định 2.
Chỉ đọc asset đang được yêu cầu, không preload 94 file. Asset bytes vẫn là view
của ByteData, không tạo thêm bản sao trên UI.

Mỗi worker giải nén/verify gzip, parse JSON, compile và chuẩn bị scene thuần Dart
cho cả batch. Native `compute` dùng `Isolate.run` và chuyển kết quả bằng
`Isolate.exit`, giữ đường chuyển graph không copy. Không giữ isolate sống lâu
để gửi lại graph mutable qua SendPort cho từng file.

Batch 2 file có thể giảm số lần spawn khi nhiều cell cùng cần load; batch chưa
đủ vẫn chạy ngay, không có timer đợi gom thêm. Kết quả file đầu phải chờ file
thứ hai trong batch, đổi lại có ít worker startup hơn. Chưa benchmark mức giảm
thời gian thực tế. Một file lỗi được trả riêng, không bỏ model tốt cùng batch.

## Tách decode khỏi publish UI

Worker được trả slot ngay khi decode xong, không giữ slot để chờ display frame.
Kết quả đã compile nằm trong queue riêng; mỗi frame publish tối đa một model còn
được cell dùng. Model offscreen được cache ngay, không chờ frame để rebuild UI.

Số entry đang decode/chờ publish được chặn ở `2 × concurrency × batchSize`:
mobile mặc định tối đa 4 entry. Nếu chưa đủ chỗ cho batch tiếp theo thì chờ publish
hoặc release; tránh mất batching thành chuỗi worker 1 file và tránh backlog model
không giới hạn khi display chậm/ngừng frame. Cache model vẫn 128 entries/32 MiB
source-size weight, pinned leases như trước; đây không phải giới hạn toàn bộ heap.

LRU giữ bộ đếm cached/source bytes thay vì duyệt lại map mỗi lần query. Khi chưa
vượt budget không copy danh sách key để trim. Không schedule thống kê notification
khi không có listener; UI gallery hiện không hiển thị các thống kê này.

Queue chưa chạy bị hủy khi mất lease; kiểm tra lease lần nữa sau đọc asset và
trước decode. Worker đã chạy vẫn được hoàn thành và cache kết quả. Dispose hoàn
tất ngay tất cả future chưa xong (kể cả đang đọc asset/worker pause), hủy publication
callback và giải phóng references; không chờ một frame mới để thoát.

API `decoder:` cũ giữ giới hạn concurrency theo từng file cho test/caller hiện có.
`batchDecoder:` nhận danh sách request và trả kết quả theo cùng thứ tự; một lỗi
worker/batch phải trả slot cho các job sau. Decoder không tạo native rendering
handle; lần vẽ Path/Canvas đầu vẫn ở UI/render isolate.

## Debugger

Batching không vượt qua `PauseStart` do debugger. Không đặt cờ VM hoặc tự resume
breakpoint trong mã ứng dụng. Xem [chẩn đoán worker pause](tgs-debugger-pause.md).
Web compute vẫn inline theo Flutter; thay đổi này không tạo web worker.

## Kiểm chứng

25 test example pass, analyzer sạch. Tests kiểm tra batching/prefetch tối đa 4,
publish một model/frame, file lỗi trong batch thật gồm cả hai backend, worker lỗi
không chặn job sau, cache reuse/LRU, dispose không chờ decoder, scroll vẫn chạy
animation, và transfer/render đủ 94 TGS. Không chạy benchmark FPS trong đợt này.

Kiểm tra chức năng trực tiếp trên Pixel 7a: hot restart thành công, viewport đầu
cache 32 model, sau cuộn cache đủ 94, `decodes = 94`, `running/queued/pending = 0`,
batchSize 2/concurrency 1. Không có Dart runtime error; gallery đã hiển thị sticker.
Android vẫn có log SurfaceComposerClient release-buffer như các phiên trước;
không dùng kiểm tra này để kết luận FPS hay hết nhiệt/throttle.
