# Bố cục dữ liệu: SoA ở nơi có lợi

Bước tối ưu này dựa trên cách dữ liệu được đọc: tìm segment chỉ cần thời gian,
nội suy cần toàn bộ vector của hai đầu, còn render cần giữ thứ tự scene. Không
chuyển mọi object thành SoA.

Census ngày 11/11/2026 của 1.087 file `example/assets/tgs/**/*.tgs`: 50.389
property động, 342.517 key; không có end tường minh trong corpus này. 453 file có
stroke. Track hai key phổ biến nhất (8.594 track), kế đến bốn key (7.095) và ba
key (6.441). Vì nhiều track nhỏ, giảm số object/buffer giữ lại quan trọng hơn
việc tách từng tọa độ thành một mảng riêng.

| Vùng | Bố cục | Quyết định |
| --- | --- | --- |
| Keyframe runtime | `_Keyframes`: thời gian `Float64List`, ba cột metadata trong `Int32List`, slab giá trị `Float32List` | Thay `List<_Key>` và các buffer nhỏ được giữ lại sau compile |
| Giá trị vector/morph | Các component của một key liền nhau | Consumer đọc cả vector; stride làm tròn tới 4 floats khi bật SIMD, bỏ padding khi hash |
| Temporal easing | Các tuple `(x1,y1,x2,y2)` Float64 liền nhau | Bốn control luôn được đọc cùng nhau; không tách thành bốn cột |
| Spatial curve/tangent | Payload tùy chọn | Track không có tangent không cấp phát hai mảng này |
| Stroke software | Scratch SoA x/y/tx/ty riêng cho từng workspace | Tái dùng qua contour/frame, tăng capacity theo lũy thừa hai; normal suy ra từ tangent |
| Polygon, scanline cells | SoA có sẵn | Giữ nguyên |
| RLE spans, pixel BGRA | AoS đóng gói có sẵn | Các field được đọc cùng nhau; phù hợp SWAR và truyền ảnh |
| Scene graph, cache entries | Object có sẵn | Giữ thứ tự layer, matte, alias DAG, ownership và eviction |

Compiler đọc header để tính kích thước buffer, sau đó ghi trực tiếp keyframe
và easing vào các cột `TypedData`. Fork chia sẻ toàn bộ `_Keyframes`; cursor, last-frame
memo và output vẫn riêng cho player. Không thêm public interface hoặc dependency.
Các mảng chỉ được ghi trong compile (bao gồm chuẩn hóa RGB), sau đó chỉ đọc.

Times và easing giữ Float64; tọa độ giữ Float32 như trước. End bị thiếu trỏ tới
start của key kế tiếp, không sao chép dữ liệu. End tường minh được lưu riêng để
bảo toàn discontinuity và chuỗi hash cache cũ. Hold, component easing, spatial
Bézier, gamma và scalar tail SIMD vẫn được xử lý. Test khóa content key của ba
fixture trước đổi layout để phát hiện việc vô tình làm mất hiệu lực cache đĩa.

## Đo và kiểm tra

`tool/benchmark_data_layout.py` trích nguyên implementation của track, polygon và
stroke từ hai snapshot, thêm driver rồi biên dịch Dart AOT. Không có bản sao
kernel cần bảo trì. Driver kiểm tra checksum hai phiên bản bằng nhau, đo 15 batch
và chạy ba process riêng cho RSS. RSS gồm VM/allocator và là stress test 100.000
track RGB × 8 key, không phải số byte heap của một sticker hay toàn bộ ứng dụng.

```sh
python3 tool/benchmark_data_layout.py \
  --reference /absolute/path/to/before-snapshot \
  --candidate /absolute/path/to/after-snapshot \
  --output /tmp/fastlottie-layout-kernels.json
python3 tool/run_benchmark.py --output /tmp/fastlottie-layout-release.json
flutter test
dart analyze lib test/packed_track_test.dart
```

Driver track dùng 256 track × 8 key, implicit/explicit end, hold, linear/eased,
forward/backward seeks và endpoints; 4.096 vòng/batch. Stroke dùng 64 contour,
các cap/join và scratch giữ lại giữa các vòng. Đây là benchmark kernel, không
suy ra FPS. `debugRenderSoftwareFrame` tạo workspace mới mỗi lần nên không dùng
để đo lợi ích scratch giữ lại của worker.

Apple M5, macOS 27.2, Dart/Flutter release AOT. Raw samples:
[kernels](data-layout-kernels.json), [release trước](data-layout-release-before.json),
[release sau](data-layout-release-after.json). Hai snapshot dùng cùng compiler
ngoài các thay đổi layout, cùng fixtures và benchmark runner.

| Kernel | Trước | Sau | Thay đổi |
| --- | ---: | ---: | ---: |
| Track scalar, 1 giá trị (ns/sample) | 13,8 | 12,8 | −7% |
| Track scalar, 3 giá trị (ns/sample) | 14,0 | 14,0 | ~0% |
| Track scalar, 42 giá trị (ns/sample) | 28,7 | 32,4 | +13% |
| Track SIMD, 42 giá trị (ns/sample) | 21,5 | 22,1 | +3% |
| Track SIMD, 768 giá trị (ns/sample) | 135,4 | 138,6 | +2% |
| Stroke, 64 contour (µs/batch iteration) | 39,9 | 33,5 | −16% |
| RSS stress track (MiB, median 3 process) | 257,5 | 120,3 | −53% |

Lợi ích chính của keyframe packing là memory; chi phí lookup theo offset có thể
làm một số vector nội suy chậm hơn. Chênh lệch vài ns còn dao động giữa các lượt
chạy. Lợi ích stroke đến từ scratch tái sử dụng; chỉ có bốn buffer tăng capacity
khi gặp contour lớn hơn, thay vì sáu danh sách mới cho mỗi contour.

| Flutter release fixture | Parse + compile trước → sau (µs median) | Uncached warm record trước → sau (µs/frame median) |
| --- | ---: | ---: |
| static | 26 → 23 | 1,88 → 1,75 |
| icon | 25 → 22 | 2,13 → 1,92 |
| many_shapes | 1177 → 1111 | 52,00 → 44,83 |
| morph | 1338 → 1189 | 18,42 → 17,21 |

Đây là một cặp lượt đo trên máy phát triển. `morph` settled record gần như
không đổi (18,75 → 18,92 µs); một số lượt visible FrameTiming thiếu mẫu do
surface không hoạt động. Không suy rộng số này thành cải thiện GPU, FPS hay
hiệu năng mobile. `flutter test`: 95 pass, 3 skip; differential test so 959 TGS
với lottie và không có mẫu vượt ngưỡng. `flutter analyze`: không có lỗi.

## Cơ hội tiếp theo

Có thể gom cột visibility `ip/op/flags` và lập draw list bỏ permanent hidden/null
layer. Cần đo trước: phần lớn scene nhỏ, còn thứ tự matte và parent chain vẫn
quan trọng. Cache world transform/ancestor chain có thể hiệu quả hơn việc đổi
layout object đơn thuần. Chưa thay đổi vùng này.
