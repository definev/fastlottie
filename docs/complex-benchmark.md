# Benchmark render animation phức tạp

Bộ đo release/AOT phát các animation có sẵn trong repo bằng FastLottie và
Lottie 3.8.2. Mỗi tổ hợp fixture, renderer, cache và số player chạy trong một
process mới. Asset được đọc từ bundle để có thể chạy offline trên cùng dữ liệu.

| Fixture | Asset | Tải chính | Timeline |
| --- | --- | --- | --- |
| `path-morph` | Crocosaurus `croc_16`, sticker `4786097` | Hình học Bézier động và precomp | 172 frame ở 60 FPS |
| `gradients` | Hot Hot Hot `4786133` | Nhiều gradient fill/stroke và precomp | 97 frame ở 60 FPS |
| `track-mattes` | Vi & Caitlyn `hug`, sticker `4786123` | Track matte, nhiều path và compositing | 90 frame ở 30 FPS |
| `keyframes` | `thorvg_tween.json` | Nội suy keyframe và transform | 150 frame ở 30 FPS |

Một player render ở giữa màn hình. Cảnh 3×3 có chín player độc lập dùng chung
composition và phát lệch pha. Cả hai dùng cùng mặt vẽ tối đa 360 logical px.
Runner ghi kích thước ô theo pixel vật lý, DPR và refresh rate. Hai chế độ là
vector không cache và picture cache mặc định của mỗi package. Ở chế độ
picture, FastLottie áp dụng giới hạn trên từng player, còn Lottie chia sẻ
drawing commands theo composition. Đọc kết quả theo chính sách cache tương ứng.

## Chạy trên Pixel 7a

Từ root, build APK riêng rồi chạy qua ADB. Giữ màn hình bật và app ở foreground.

```sh
(
  cd example
  ORG_GRADLE_PROJECT_fastlottieBenchmarkSuffix=.complexbench flutter build apk \
    --release --target-platform android-arm64 -t lib/complex_benchmark.dart
)
adb devices -l
python3 tool/run_complex_benchmark.py --android-device "$ANDROID_SERIAL" \
  --output build/benchmarks/complex-pixel7a.json
```

Mặc định có 96 process. Cảnh lưới chạy năm vòng tạo, phát và hủy player trong
mỗi process. Kết quả được lưu sau từng process. Để kiểm tra nhanh một fixture
với cả hai renderer, chạy:

```sh
python3 tool/run_complex_benchmark.py --android-device "$ANDROID_SERIAL" \
  --fixture track-mattes --cache vector --instances 9 --cycles 2 --repeats 1 \
  --output build/benchmarks/complex-pixel7a-smoke.json
```

`ANDROID_SERIAL` là ID ở cột đầu của `adb devices -l`. Có thể lặp lại các cờ
lọc fixture, renderer, cache và instances. Thêm `--edge 240` để thử ở kích thước
nhỏ hơn và giữ nguyên kích thước khi đối chiếu hai renderer.

Trên macOS, build `flutter build macos --release -t lib/complex_benchmark.dart`
từ `example/`, rồi chạy runner với `--platform macos` và `--output` riêng. Giữ
cửa sổ benchmark hiển thị trong lúc đo.

## Số đo

- **Tải và frame đầu.** Đo thời gian giải nén, parse/compile, tạo player và
  `FrameTiming` của frame đầu. Timer parse chạy sau khi lấy bytes từ bundle.
- **Render ổn định.** Sau frame đầu, harness chạy một vòng warmup rồi đo một
  vòng đầy đủ. Mỗi tick tiến đúng một frame nguồn để hai renderer nhận cùng
  chuỗi frame. File JSON lưu CPU paint, Flutter build/raster/total, p50/p95/p99,
  các frame vượt ngân sách theo refresh rate và FPS Flutter đã gửi. Tốc độ phát
  trong bài đo có thể khác FPS do tác giả animation đặt.
- **Bộ nhớ.** Lấy mẫu ở baseline, sau khi load composition, sau frame đầu,
  sau vòng đo, sau mỗi lần hủy player và sau khi bỏ composition. Android đo
  PSS (kèm RSS và `Graphics` từ `dumpsys meminfo`), macOS đo physical footprint
  (kèm đỉnh do kernel ghi nhận). Báo cáo giữ số tuyệt đối, chênh lệch với baseline,
  đỉnh trong các mẫu và chênh lệch sau vòng hủy đầu/cuối. Các mốc Android là mẫu
  tại checkpoint, nên có thể bỏ lỡ đỉnh tức thời. Allocator và GC có thể giữ
  bộ nhớ sau khi hủy player.
- **Kiểm tra đầu ra.** Sau mọi phép đo, harness đọc lại ba frame ở kích thước
  96×96 và kiểm tra pixel có alpha cùng checksum có thay đổi. Số checksum được
  lưu theo renderer để chẩn đoán. Phép kiểm tra này xác nhận có nội dung động
  và không đặt ngưỡng pixel parity giữa hai renderer.

JSON lưu mọi frame và mẫu bộ nhớ, mã băm của source, asset và binary, cùng
trạng thái nhiệt Android đầu/cuối mỗi process. Các cột `p95_*` trong `summary`
là median của p95 vòng đo đầu tiên qua các process. Dùng cùng thiết bị,
refresh rate, DPR và điều kiện nhiệt khi so sánh các lần chạy.
