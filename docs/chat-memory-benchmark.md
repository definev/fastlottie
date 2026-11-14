# RAM của app example trên Mac M5 và Pixel 7a

Bộ đo chạy màn hình chat Cupertino thật của app example với Flutter release/AOT,
server HTTP nhúng, 94 sticker và 969 emoji. Ba cấu hình dùng chung workload:
FastLottie Mini-Strip (K tự động), FastLottie Ping-Pong (K=1) và Lottie 3.8.2.

Xem thêm [bài A/B giới hạn cache vector của sticker lớn](chat-hero-cache-benchmark.md).
Mốc tham khảo tối thiểu: [Flutter Hello World trên Mac M5](flutter-hello-memory-benchmark.md).

## Chạy lại

Build các target riêng từ thư mục gốc của repo. Cấu hình macOS dưới đây giữ app
trong sandbox và cấp quyền mở socket cho server HTTP nhúng và kênh benchmark.
Tạo container cache nếu `path_provider` trả về đường dẫn chưa tồn tại. APK dùng
package riêng, nên không ghi đè bản demo trên Pixel.

```sh
chat_config=$(mktemp -t fastlottie-chat-ram)
cat > "$chat_config" <<'EOF'
CODE_SIGN_ENTITLEMENTS = Runner/ChatMemoryBenchmark.entitlements
PRODUCT_BUNDLE_IDENTIFIER = com.example.fastlottieExample.chatram
EOF
mkdir -p "$HOME/Library/Containers/com.example.fastlottieExample.chatram/Data/Library/Caches/com.example.fastlottieExample.chatram"
(
  cd example
  XCODE_XCCONFIG_FILE="$chat_config" flutter build macos --release -t lib/chat_memory_benchmark.dart
  ORG_GRADLE_PROJECT_fastlottieBenchmarkSuffix=.chatram flutter build apk \
    --release --target-platform android-arm64 -t lib/chat_memory_benchmark.dart
)
rm "$chat_config"
python3 tool/run_chat_memory_benchmark.py --platform macos --output /tmp/chat-ram-macos.json
# Set ANDROID_SERIAL to the device ID printed by adb devices.
python3 tool/run_chat_memory_benchmark.py --platform android \
  --android-device "$ANDROID_SERIAL" --output /tmp/chat-ram-android.json
```

Giữ app ở foreground và màn hình Android bật trong lúc đo. Runner mặc định đo
3 process độc lập mỗi chế độ, đổi thứ tự giữa các lượt và tạo cache đĩa mới mỗi
lần. Có thể dùng `--mode mini-strip --repeats 1` để kiểm tra nhanh. JSON lưu từng
mẫu, cấu hình môi trường và telemetry theo mốc; log Android lưu kết quả
`dumpsys meminfo` nguyên bản.

## Cách đọc số liệu

- **macOS:** physical footprint từ `proc_pid_rusage`, cộng thêm đỉnh toàn vòng
  đời process do kernel ghi nhận. [Tài liệu Apple](https://developer.apple.com/documentation/xcode/gathering-information-about-memory-use).
- **Android:** `TOTAL PSS` của process. Đỉnh Android là mẫu cao nhất đã lấy,
  nên có thể bỏ lỡ đỉnh tức thời. [Tài liệu Android](https://developer.android.com/tools/dumpsys).

Hai chỉ số có cách tính khác nhau; hãy so các chế độ **trong cùng thiết bị**.
Mỗi mốc chờ 3 giây rồi lấy 3 mẫu cách nhau ít nhất 500 ms, giữ animation chạy.
Mỗi ô là median của median từng lượt, đơn vị MiB. `Chat ban đầu` gồm cả nội
dung mẫu đã render. Cuộn sticker tối đa 12 bước và cuộn emoji 20 bước, mỗi bước
240 logical px. Sau đó soạn và gửi một tin 24 emoji, gửi thêm 12 sticker, rồi
đóng picker bằng thao tác trên vùng chat để bàn phím không bật. Chạy tiếp 5
vòng mở, cuộn, đóng picker, xen kẽ tab emoji và sticker. Cuối cùng bật Reduce
Motion rồi hủy màn hình chat trong khi Flutter engine và process vẫn chạy.

Telemetry `gpu_cache_bytes` chỉ là ảnh do cache FastLottie quản lý. Nó không
bao gồm tất cả tài nguyên đồ họa của Flutter, driver hoặc Lottie. Không ép GC
và không dùng kết quả sau dispose để kết luận có hoặc không có rò rỉ.

## Kết quả

Mac M5 · physical footprint (MiB):

| Kịch bản | Mini-Strip | Ping-Pong K=1 | Lottie |
| --- | ---: | ---: | ---: |
| Chat ban đầu | 272.5 | 268.5 | 353.3 |
| Mở picker sticker | 327.2 | 319.2 | 398.1 |
| Cuộn sticker | 431.8 | 372.0 | 452.8 |
| Mở picker emoji | 416.0 | 354.0 | 410.5 |
| Cuộn emoji | 433.7 | 368.4 | 400.3 |
| Soạn 24 emoji | 467.5 | 445.3 | 474.1 |
| Gửi 12 sticker | 462.9 | 420.2 | 325.9 |
| Đóng picker | 468.2 | 420.5 | 310.6 |
| Sau vòng mở, cuộn, đóng thứ 1 | 460.8 | 401.3 | 313.9 |
| Sau vòng mở, cuộn, đóng thứ 5 | 470.0 | 404.4 | 317.2 |
| Bật Reduce Motion | 355.1 | 286.4 | 223.7 |
| Hủy màn hình chat | 244.9 | 223.7 | 209.1 |
| Đỉnh do kernel ghi nhận | 543.5 | 494.4 | 671.1 |

Pixel 7a · PSS (MiB):

| Kịch bản | Mini-Strip | Ping-Pong K=1 | Lottie |
| --- | ---: | ---: | ---: |
| Chat ban đầu | 317.5 | 314.0 | 356.3 |
| Mở picker sticker | 387.4 | 379.3 | 467.8 |
| Cuộn sticker | 420.3 | 429.8 | 515.4 |
| Mở picker emoji | 433.2 | 435.2 | 489.1 |
| Cuộn emoji | 430.4 | 420.1 | 539.4 |
| Soạn 24 emoji | 476.8 | 463.7 | 604.0 |
| Gửi 12 sticker | 501.5 | 503.2 | 462.5 |
| Đóng picker | 505.7 | 507.0 | 466.4 |
| Sau vòng mở, cuộn, đóng thứ 1 | 525.2 | 522.0 | 417.8 |
| Sau vòng mở, cuộn, đóng thứ 5 | 523.4 | 519.7 | 402.3 |
| Bật Reduce Motion | 517.6 | 514.5 | 378.2 |
| Hủy màn hình chat | 450.9 | 484.3 | 373.8 |
| Đỉnh trong các mẫu | 527.7 | 552.9 | 606.3 |

- **Mac:** K=1 giảm khoảng 65 MiB khi cuộn emoji và 49 MiB ở đỉnh so với
  Mini-Strip. Sau khi đóng picker, cache ảnh của app giữ 47,0 MiB với
  Mini-Strip và 20,3 MiB với K=1; cả hai giữ khoảng 16 MiB RAM nén. Lottie
  xuống 311 MiB sau khi đóng picker, nhưng có đỉnh toàn lượt cao nhất (671 MiB).
- **Pixel:** Khi soạn 24 emoji, FastLottie dùng ít hơn Lottie khoảng 127–140
  MiB PSS. Sau khi đóng picker, hai chế độ FastLottie đều quanh 506–507 MiB,
  dù cache ảnh chỉ ghi nhận 29,6 MiB với Mini-Strip và 6,7 MiB với K=1.
  `Graphics` do Android báo ở mốc này là 257,6 và 240,4 MiB; đây là ước tính
  của hệ điều hành và bao gồm tài nguyên ngoài cache FastLottie.
- **Sau khi đóng picker:** FastLottie giữ cao hơn chat ban đầu khoảng
  138–196 MiB (median delta ghép theo từng process). Sau 5 vòng mở, cuộn,
  đóng, chênh với vòng 1 từ −5 đến +12 MiB theo median của từng cấu hình
  FastLottie. Hủy màn hình giảm 180–227 MiB trên Mac và 35–67 MiB PSS
  trên Pixel, so với mốc vòng 5. Do RAM Pixel vẫn cao hơn trước workload,
  bước tiếp theo hữu ích là profile vòng đời tài nguyên đồ họa sau dispose
  và đo lại với giới hạn cache thấp hơn, kèm frame timing.

## Môi trường và giới hạn

Đo ngày 14/11/2026 từ revision `4288c79` cùng bộ chạy benchmark mới, Flutter
3.51.0-0.1.pre, Dart 3.15.0 dev. Mac M5 có 16 GiB RAM, macOS 27.2; view
1600 × 1200 physical px, DPR 2. Pixel 7a chạy Android 17; view 1080 × 2400,
DPR 2.44375. Cả hai dùng số raster worker mặc định là 4, giới hạn GPU cache
48 MiB, RAM nén 16 MiB và cache đĩa 128 MiB. Chỉ các widget được list/grid
mount mới render; gửi 12 sticker không có nghĩa cả 12 luôn hiển thị cùng lúc.

Pixel đang sạc và nóng: thermal status 3–4 ở đầu lượt, 4 ở cuối lượt. Giữ
cơ chế giảm tải (`StickerPressure`) của app hoạt động. Lottie kích hoạt chế độ
này ở nhiều mốc trên Pixel, nên một số animation bị tạm dừng; FastLottie
không kích hoạt ở các mốc lấy mẫu. Đây là phép đo hành vi app ở điều kiện đã
ghi nhận, không phải so renderer với số animation hoạt động luôn bằng nhau.
Nên chạy lại trên điện thoại nguội để kiểm tra mức độ lặp lại của số liệu.

Một lượt Mini-Strip trên Mac bị gián đoạn khi cửa sổ mất hiển thị, có hàng
decode chưa hoàn tất ở một số mốc và tổng thời gian tăng từ khoảng 80 lên
157 giây. Lượt này bị loại và chạy bù bằng cùng binary; dữ liệu gốc vẫn giữ
trong bộ log để đối chiếu.

## Kiểm tra

`flutter analyze` cho các file Dart liên quan không báo lỗi. Cả hai bản
release build thành công. Chín test của `network_chat_test.dart` pass. Bộ
test cache/store mở rộng có 20 test pass và một lỗi kỳ vọng cũ:
`tgs_store_test.dart` đòi 959 fixture hỗ trợ và 104 không hỗ trợ, trong khi
1063 fixture đều được hỗ trợ. Lỗi này cũng tái hiện trên `HEAD` chưa sửa đổi.

## Cấu hình Mac mới

Các bảng trên là cấu hình 48 MiB/4 worker ban đầu. macOS hiện mặc định dùng
cấu hình giảm RAM, 160 px và vẫn tự phát; xem
[kết quả Graphics trên Mac](chat-graphics-memory-macos.md).
Build với `--dart-define=CHAT_COMPACT=false` để tái tạo cấu hình cũ.
