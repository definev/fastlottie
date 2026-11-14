# Giảm RAM đồ họa trên Mac M5

Đo 14/11/2026, Mac M5 16 GiB, macOS 27.2, Flutter
3.51.0-0.1.pre (666d2c4e831, engine content hash
9bbca0aa0a9b4ef9de36ba7cf82d007b0468a85f), release/AOT,
Impeller MetalSDF. Cửa sổ 800 × 600 logical, DPR 2. SDK có thay đổi local
ở rendering/object.dart (semantics); giữ nguyên giữa các phép thử.

**Chưa đạt 150 MiB khi tự phát.** Cấu hình được giữ lại đạt median
243,8 MiB sau đóng picker, giảm 47,7% so với lượt đối chứng 466,4 MiB.
Không dùng Reduce Motion hay che cửa sổ để đạt con số thấp.

Xem [guide công thức RAM/hiệu năng](memory-performance-guide.md) để chọn ngân sách theo workload.

## Thay đổi được giữ lại

Mặc định trên macOS; Android/web giữ cấu hình cũ, chưa được đo lại:

- Sticker tin nhắn 160 × 160 logical px thay cho 220 × 220. Vẫn vẽ vector,
  full DPR (320 × 320 physical ở DPR 2), FPS gốc và tự phát.
- Giữ nguyên thumbnail sticker 112 physical px, emoji 96 physical px.
  Không giữ phép thử thumbnail 80/64 hoặc hero raster 256 px/30 FPS.
- Giới hạn payload/reservation ảnh FastLottie từ 48 xuống 6 MiB,
  RAM nén từ 16 xuống 2 MiB; cache đĩa vẫn 128 MiB.
- Một raster worker thay cho bốn, tối đa hai job đang chạy thay cho tám.
- Store giới hạn mục tiêu 8 model thay cho 48; model đang được dùng luôn
  được pin và có thể vượt giới hạn này.
- Scroll cache extent = 0 ở list/grid, không mount sẵn nội dung ngoài
  viewport. Cache đĩa phục vụ việc nạp lại khi cuộn.
- Header dùng màu opaque đã blend với nền để bỏ backdrop blur.

Đây là thay đổi kích thước và blur có chủ đích. Chất lượng vector và
độ phân giải thumbnail giữ nguyên; không khẳng định mọi người dùng không
nhận thấy khác biệt. Việc bỏ overscan có thể làm thumbnail mới vào màn hình
hiện placeholder trong lúc load, đặc biệt khi cuộn nhanh hoặc mạng chậm.

## Kết quả

Physical footprint, MiB. Cấu hình cuối: median của 3 process mới, mỗi mốc
3 mẫu cách nhau 500 ms. Đối chứng và phép bỏ blur: 1 process mới mỗi cấu hình,
dùng để chẩn đoán; không phải A/B đủ 3 cặp. Workload như
[benchmark chat](chat-memory-benchmark.md), gồm server HTTP nhúng và toàn bộ
catalog 94 sticker, 969 emoji. Không ép GC.

| Mốc | Đối chứng | Chỉ bỏ blur | Cấu hình 160 px |
| --- | ---: | ---: | ---: |
| Chat ban đầu | 294,0 | 248,8 | 239,4 |
| Cuộn sticker | 413,3 | 403,9 | 255,0 |
| Cuộn emoji | 421,8 | 416,9 | 257,2 |
| Soạn 24 emoji | 502,0 | 446,5 | 284,9 |
| Gửi 12 sticker | 463,0 | 441,2 | 250,0 |
| Đóng picker | 466,4 | 443,1 | 243,8 |
| Sau 5 vòng mở/cuộn/đóng | 478,5 | 454,7 | 254,8 |
| Reduce Motion (chỉ đối chiếu) | 445,1 | 391,4 | 147,3 |
| Hủy chat | 257,7 | 213,8 | 122,2 |
| Đỉnh toàn process | 542,1 | 510,3 | 337,2 |

Cấu hình cuối sau đóng picker: 237,4–250,4 MiB. Khi soạn 24 emoji:
283,7–300,2 MiB. Đỉnh: 331,0–337,3 MiB. Không thấy StickerPressure
kích hoạt tại các checkpoint. Có 3 hero được mount sau đóng picker so với
4 ở đối chứng; kích thước hero và overscan đã thay đổi nên đây là so
cấu hình sản phẩm, không phải so renderer với cùng số widget.

Median build/raster p95 sau đóng picker: 0,57/1,55 ms (đối chứng
0,69/2,39 ms). Sau vòng 5: 1,60/1,41 ms (đối chứng 1,67/2,48 ms).
Đều dưới chu kỳ màn hình 120 Hz (8,33 ms). FrameTiming của Flutter không
đếm số frame sticker thực sự đổi và không đủ để kết luận không có placeholder
hoặc animation giữ frame cũ trong lúc chờ worker.

## Graphics tăng vì đâu?

Cột Graphics trước đó thuộc Android. Trên Mac dùng footprint -w và vmmap.
Ở đối chứng sau đóng picker, snapshot footprint khoảng 478 MiB gồm:

| Nhóm OS | MiB xấp xỉ |
| --- | ---: |
| Owned physical footprint (unmapped) (graphics) | 193 |
| IOAccelerator (graphics) | 31 |
| IOSurface | 44 |
| Untagged | 119 |
| Malloc Small | 76 |

Snapshot này lấy sau mẫu proc_pid_rusage nên tổng không khớp đúng 466,4 MiB.
Cột Swapped của footprint là phần đã nằm trong Dirty, không cộng lại.
Không cộng gpu_cache_bytes thêm vào các nhóm OS: đó là phép tính payload
ảnh ở tầng app, đã được phản ánh trong tài nguyên process.

Bằng chứng xác nhận:

1. **Surface màn hình có chi phí cố định theo diện tích.** SDK dùng
   BGRA10_XR/8 byte mỗi pixel khi Impeller bật wide gamut trên Apple Silicon.
   Ba surface 1600 × 1200 × 8 tương ứng 43,95 MiB, khớp nhóm IOSurface
   khoảng 44 MiB khi animation chạy. Số surface có thể dao động.
2. **Blur tạo render pass/buffer phụ.** Chỉ chuyển header sang opaque làm
   IOAccelerator sau đóng picker giảm khoảng 31 xuống 9 MiB; tổng giảm
   khoảng 23 MiB trong hai lượt chẩn đoán. Không quy toàn bộ delta cho một
   texture vì heap và driver cũng dao động.
3. **Cache ảnh không phải toàn bộ RAM graphics.** Cache 48 MiB cộng RAM
   nén 16 MiB, các model/scenes của worker, texture mới upload và resources
   của Flutter/Metal cùng tồn tại. decodeImageFromPixels đi qua buffer upload
   và texture; engine còn tạo mip levels. Giới hạn app chỉ đếm width × height
   × 4 của ảnh giữ lại/reservation, không phải giới hạn process hoặc driver.
4. **Render liên tục có baseline khác màn hình tĩnh.** Hello World thêm
   RotationTransition quay một dòng chữ, cùng SDK/release/cửa sổ, đo 3
   process: ở giây 30 median **131,2 MiB**, range **130,5–131,2 MiB**.
   Snapshot gồm khoảng 45 MiB graphics unmapped, 44 MiB IOSurface, 8 MiB
   IOAccelerator. Hello World tĩnh trước đó 60,7 MiB không phải baseline
   thích hợp cho chat tự phát.
5. **Backend swap không tự giải quyết.** Cùng binary, tắt Impeller qua
   FLTEnableImpeller: đối chứng Skia 520,6 MiB sau đóng picker; cấu hình
   compact cũ + Skia 315,8 MiB. Không giữ thay đổi này. Thử Skia cache
   8 MiB chưa hoàn tất workload nên loại khỏi kết quả.

Không có Metal allocation capture gắn label/call stack từng texture, nên
chưa quy được toàn bộ 193 MiB unmapped cho một loại tài nguyên hay chứng
minh engine leak. Phép đo này xác định các thành phần và tác động cấu hình,
không xác nhận tất cả Graphics là “tăng bất thường”.

## Mục tiêu 150 MiB

Mục tiêu hiện còn thiếu khoảng 94 MiB ở chat sau đóng picker và 135 MiB
khi soạn nhiều emoji. Chỉ giảm cache app tiếp chưa có bằng chứng đủ đạt
150 MiB, vì Hello World động trên SDK này đã khoảng 131 MiB.
Hướng tiếp theo là Metal allocation capture và A/B engine/SDK với hỗ trợ
surface SDR chính thức, kèm kiểm tra màu, độ nét và frame pacing.
Không dùng private API hoặc hạ DPR toàn cửa sổ trong thay đổi này.

## Chạy lại

macOS demo mặc định dùng cấu hình mới:

```sh
cd example
flutter run -d macos --release
# Đối chứng cũ:
flutter run -d macos --release --dart-define=CHAT_COMPACT=false
```

Target benchmark dùng entitlement/bundle riêng như tài liệu benchmark chat.
Khi build, dùng --dart-define=CHAT_COMPACT=true cho cấu hình mới,
false cho đối chứng. --dart-define=CHAT_OPAQUE_HEADER=true chỉ bỏ blur
khi CHAT_COMPACT=false.

```sh
python3 tool/run_chat_memory_benchmark.py --platform macos --mode mini-strip \
  --repeats 3 --macos-foreground --output /tmp/chat-compact.json
# Thêm --macos-vmmap cho lượt chẩn đoán phân nhóm; nó làm thay đổi thời gian đo.
```

--macos-foreground đưa cửa sổ ra trước mỗi 2 giây. Lượt opaque ban đầu bị
che, có 0 frame ở checkpoint, đã loại. Lượt Skia8 dừng vì picker không còn
scroll position, cũng loại. Raw JSON, snapshots footprint/vmmap, binary
các biến thể, Hello World động và script nằm tại
build/graphics-memory-2026-11-14/. sharp160.json là dữ liệu 3 lượt cuối.
Các số lịch sử vẫn giữ nguyên trong tài liệu cũ.

Validation: release build, analyze các file thay đổi, 9 network_chat_test
với CHAT_COMPACT=true. Release entitlement cấp network.server để server
sticker loopback của app demo hoạt động như target benchmark.
