# TGS gallery bằng Jetpack Compose

Android example có thêm launcher **TGS Compose**, mở
`com.example.fastlottie_example.compose.ComposeTgsActivity`. Activity extends
`ComponentActivity`, hiển thị bằng Compose và `lottie-compose:6.7.1`; Activity này
không tạo FlutterEngine. Launcher Flutter hiện có vẫn mở `MainActivity`.

## Giao diện và dữ liệu

- Header tĩnh cao 48 dp ghi `lottie-compose`, không có counter, spinner, nhãn ô,
  nút pause hoặc preview.
- `LazyVerticalGrid` 4 cột, spacing và padding ngoài 8 dp, ô vuông, padding sticker
  (6, 18, 6, 18) dp như Flutter.
- Dùng chính 94 TGS đã đóng gói dưới `flutter_assets/assets/tgs`, không copy asset
  sang bộ riêng. Sort pack/file và round-robin từng pack giống Dart catalog.
- Index modulo catalog để lặp, tối đa `Int.MAX_VALUE - 3` item (chia hết cho 4 để
  tránh overflow khi tính số hàng); chỉ compose/load các ô gần viewport.
- Mỗi cell có drawable/progress riêng, dùng chung composition đã parse. Progress
  được đọc trong lambda draw; không đọc mỗi frame tại cấp grid.
- Loop ở source frame rate, giữ animation khi kéo/fling. Activity pause hoặc system
  animator disabled thì ngừng playback; resume không reset về đầu. Không nối
  `isScrollInProgress` vào animation clock.

Native renderer vẽ vector ở độ phân giải màn hình với `RenderMode.AUTOMATIC` của
Lottie. Trang này chưa áp dụng raster LoD/cache frame của fastlottie. Cùng layout
và asset không đồng nghĩa cùng raster quality/FPS cap; cần ghi rõ cấu hình khi
đối chiếu FPS. Chưa chạy benchmark hiệu năng cho trang Compose.

## Loader

`TgsCompositionStore` do Activity sở hữu. Asset IO, gzip và JSON parse chạy trên
`Dispatchers.IO`, semaphore giới hạn 1 job parse. Request cùng path coalesce; ô
ra viewport hủy request còn chờ. Job đã bắt đầu hoàn thành để giữ model warm.
LRU 128 model/32 MiB source-size weight; lease còn sống được pin. Activity destroy
hủy scope và bỏ cache, không giữ reference tới Activity trong worker.

Nhận gzip qua magic bytes, stream qua GZIPInputStream và Lottie JSON reader,
không inflate ra String/JSON object trung gian. Output được chặn 16 MiB/file;
drain đến EOF để kiểm tra trailer/CRC. Null Lottie cache key tránh cache thứ hai.
Lỗi chỉ hiển thị dấu `!` tĩnh trong cell và ghi asset/error vào log `ComposeTgs`.

## Chạy

```sh
cd example
flutter build apk --profile
adb install -r build/app/outputs/flutter-apk/app-profile.apk
adb shell am start -n com.example.fastlottie_example/.compose.ComposeTgsActivity
```

Có thể chọn icon **TGS Compose** trên launcher. Để mở bản Flutter:

```sh
adb shell am start -n com.example.fastlottie_example/.MainActivity
```

Nếu muốn một phiên native từ process mới, force-stop cùng package trước khi mở
Compose để FlutterEngine từ phiên Flutter trước không còn trong process.

## Kiểm tra

```sh
cd example/android
./gradlew :app:testDebugUnitTest :app:connectedDebugAndroidTest :app:assembleProfile
```

Unit tests kiểm tra raw/gzip detection, inflated-size limit kể cả skip, CRC lỗi,
catalog interleave và stream decode cả 94 asset. Instrumentation tests dùng native
Lottie parser cho đủ 94 file, kiểm tra bounds/timeline hợp lệ, coalescing/cache reuse
và job lỗi không giữ semaphore. Kiểm tra UI trên điện thoại riêng với build profile.

Dependencies được ghim: Compose BOM 2026.01.01 (compatible compileSdk 36 của Flutter
example), compiler plugin khớp Kotlin 2.4.20, activity-compose 1.10.1. Tham khảo
[Compose compiler setup](https://developer.android.com/develop/ui/compose/setup-compose-dependencies-and-compiler)
và [Lottie Compose](https://github.com/airbnb/lottie/blob/master/android-compose.md).

Đã kiểm chứng: build debug/profile thành công; 5 unit test và 2 instrumentation
test trên Pixel 7a / Android 17 pass (0 failures), native Lottie parse đủ 94 TGS.
Đã cài APK profile, cold-start `ComposeTgsActivity` và xác nhận grid hiển thị trên
máy thật. Không chạy benchmark FPS trong đợt này.
