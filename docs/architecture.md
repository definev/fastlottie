# Kiến trúc và Lựa chọn Thiết kế Chi tiết (`fastlottie`)

`fastlottie` biên dịch scene Lottie/TGS trong Dart và có hai đường kết xuất. Software worker dùng kernel native khi khả dụng, với Dart làm fallback. Xem [native raster và warm playback](native-playback.md).
1. **Background Software Rasterizer Pipeline (Telegram-style)**: Quét dòng fixed-point RLE, giữ coverage của shape tĩnh và blend BGRA8888 trên worker isolate. RAM cache có thể chia sẻ tile giữa các frame của page đã warm; disk cache `.flcache` (`FLC1`) vẫn lưu LZ4 theo từng frame. Trên UI Isolate chỉ giữ cặp texture GPU double-buffer (`renderingImage` / `backgroundImage`) để hoán đổi con trỏ $O(1)$.
2. **Direct Flutter Canvas & Picture/Prewarmed Engine**: Vẽ vector trực tiếp lên `ui.Canvas`, lưu display list `ui.Picture` có giới hạn LRU, hoặc dựng trước toàn bộ chuỗi `List<ui.Image>` qua `prepareRaster`.

---

## 1. Sơ đồ Kiến trúc Tổng thể

```mermaid
flowchart TB
    subgraph Ingest["1. Tải & Giải mã (Ingest & Decode)"]
        SRC[".json / .tgs (GZip) / Network URI"]
        NET["network_io.dart\nHttpClient + FastLottieCancelToken\nCache đĩa nguyên bản (.tgsbin, 128-bit hash)\nAtomic rename (.tmp.$pid.$seq)"]
        DEC["decoding.dart: decodeLottieBytes()\nPhát hiện GZip magic (0x1f 0x8b)\nGiới hạn 16 MiB chống Zip-bomb"]
        SRC --> NET --> DEC
    end

    subgraph Compile["2. Biên dịch & Chuẩn hóa (Off-UI Isolate via compute)"]
        COMP["compiler.dart: _Compiler\nFail-fast whitelist schema check\nBiên dịch tĩnh Expression & Layer Control\nXây dựng DAG (_Layer, _Group, _Style, _Trim)"]
        TRACK["track.dart: _Keyframes & _Track\nĐóng gói Columnar TypedData (times, metadata, values, easing)\nPad stride bội số 4 cho Float32x4 SIMD (mặc định bật)\nBảng LUT sRGB <-> Linear & _SpatialCurve (129 mẫu)"]
        HASH["rle_rasterizer.dart: _ContentKeyHasher\nBăm 128-bit định danh toàn bộ cây scene\n(contentKey độc lập Isolate/phiên chạy)"]
        FORK["fork.dart: _Fork(warm: true)\nNhân bản trạng thái mutable (_cursor, output buffer)\nChia sẻ 100% _Keyframes bất biến, 0 đối tượng dart:ui"]
        DEC -->|"json.fuse(utf8)"| COMP
        COMP --> TRACK
        COMP --> HASH
        COMP --> FORK
    end

    subgraph Runtime["3. Điều phối trên UI Isolate (Player & Widget Layer)"]
        WIDGET["widget.dart: FastLottie / FastLottieNetwork / FastLottieView\nRepaintBoundary + _FastPainter + _FrameRepaint\nChỉ thông báo vẽ lại khi mẫu frame thực sự đổi"]
        PLAYER["fastlottie.dart: FastLottiePlayer.draw()\nTính toán BoxFit + DPR + Frame Quantization"]
        FORK -->|"Isolate.exit (Zero-copy)"| WIDGET
        WIDGET --> PLAYER
    end

    subgraph Paths["4. Ba Đường ống Kết xuất (3 Rendering Tiers)"]
        direction TB
        TIER1["Tier A: Prewarmed GPU Frames\n(prepareRaster)\nList<ui.Image> giữ toàn bộ frame trên GPU\nNgân sách mặc định 32 MiB"]
        TIER2["Tier B (Mặc định): Shared Ping-Pong Pipeline\n(raster_cache.dart + ping_pong.dart)\nDouble-buffered ui.Image (renderingImage / backgroundImage)\nNgân sách VRAM 32 MiB + Hàng đợi giải phóng theo lô"]
        TIER3["Tier C (Fallback / Vector): Direct Canvas + LRU ui.Picture\n(scene.dart + path_ops.dart + gradient.dart)\nVẽ trực tiếp hoặc lưu tối đa 120 ui.Picture / 100k lệnh"]
        
        PLAYER -->|"1. Nếu đã gọi prepareRaster"| TIER1
        PLAYER -->|"2. Mặc định (usePipeline: true)"| TIER2
        PLAYER -->|"3. Khi cache miss lạnh / useFrameRate: false / vượt ngân sách"| TIER3
    end

    subgraph WorkerPool["5. Sharded Background Worker Pool (worker_pool.dart)"]
        SHARD["Sharding theo FNV-1a(entryKey) % workerCount\n(2..4 persistent Isolates, giao tiếp bằng TransferableTypedData)"]
        BITSTREAM["bitstream_cache.dart: BitstreamStore\nL1: Compressed RAM LRU (chia theo worker)\nL2: File đĩa append-only .flcache (Header FLC1 + Index + CRC31)"]
        LZ4["lz4.dart: Lz4Codec & Lz4Scratch\nNén/Giải nén LZ4 thuần Dart, 0 cấp phát bộ nhớ\nFast-path cho pixel 32-bit lặp lại (offset == 4)"]
        SWRAST["rle_rasterizer.dart: _renderSceneSoftware()\nLàm phẳng Bézier thích ứng -> _PolyPath (SoA)\n_expandStroke & _applyDash -> _FtScanlineRasterizer (24.8 fixed-point)\n_RleSpans -> _SwarBlender (64-bit SWAR Premultiplied BGRA8888)"]
        
        TIER2 <-->|"Yêu cầu frame / Nhận BGRA8888\nui.decodeImageFromPixels"| SHARD
        SHARD --> BITSTREAM
        BITSTREAM <-->|"Cache Hit/Store"| LZ4
        BITSTREAM -->|"Cache Miss"| SWRAST
        SWRAST -->|"Ghi kết quả BGRA"| BITSTREAM
    end
```

---

## 2. Vòng đời Hoạt động của Ping-Pong Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant Ticker as AnimationController (UI)
    participant Repaint as _FrameRepaint
    participant Player as FastLottiePlayer
    participant PP as _PingPongCoordinator
    participant Pool as _RasterWorkerPool (Host)
    participant Worker as Worker Isolate (Shard k)
    participant Store as BitstreamStore + LZ4
    participant RLE as _FtScanlineRasterizer + SWAR

    Ticker->>Repaint: tick() (ví dụ: 60Hz/120Hz)
    Repaint->>Player: _relativeSample(progress)
    Note over Repaint: Nếu cùng frame mẫu (vd clip 30fps)<br/>-> Bỏ qua, KHÔNG markNeedsPaint!
    Repaint->>Player: paint() -> player.draw(canvas, frame=N)
    Player->>PP: lookup(player, pixelSize, relative)

    alt Trường hợp 1: Front-Buffer Hit (renderingFrameIndex == N)
        PP-->>Player: Trả về renderingImage (O(1))
        PP->>PP: _ensurePrefetch(N + 1)
    else Trường hợp 2: Back-Buffer Hit (backgroundFrameIndex == N)
        Note over PP: Hoán đổi con trỏ O(1):<br/>renderingImage = backgroundImage<br/>Đẩy ảnh cũ vào _disposalQueue
        PP-->>Player: Trả về renderingImage mới
        PP->>PP: _ensurePrefetch(N + 1)
    else Trường hợp 3: Cache Miss (Startup hoặc nhảy frame)
        PP->>PP: _requestFrame(entry, N)
        PP-->>Player: Trả về renderingImage cũ (nếu có) hoặc null (để Tier C vẽ vector)
    end

    PP->>Pool: renderFrame(entryKey, chỉ số frame nguồn từ mẫu N hoặc N+1)
    Pool->>Worker: Send [_opRenderFrame] (Shard = FNV1a(entryKey) % W)
    
    Worker->>Store: tryReadFrame(entryKey, frameIndex)
    alt Hit trong Compressed RAM LRU hoặc file .flcache
        Store->>Store: Kiểm tra CRC31 + Lz4Codec.decompressInto(dstBgra)
        Store-->>Worker: BGRA8888 bytes
    else Miss hoàn toàn
        Worker->>RLE: _renderSceneSoftware(scene, frame, px, w, h, ws)
        RLE-->>Worker: Premultiplied BGRA8888 pixels
        Worker->>Store: storeFrame() -> Nén LZ4 + CRC31 -> Lưu RAM LRU & Append vào .flcache
    end

    Worker-->>Pool: TransferableTypedData (BGRA8888) + thống kê RAM/Disk
    Pool-->>PP: _WorkerFrameResult
    PP->>PP: Kiểm tra nếu frame đã lỗi thời (staled) -> Bỏ qua GPU upload!
    PP->>PP: ui.decodeImageFromPixels(bgra8888)
    PP->>PP: _onImageDecoded() -> Cập nhật Front/Back buffer & gọi _notifyUsers()
```

---

## 3. Phân tích Lựa chọn Kiến trúc Chi tiết

### 3.1. Kiến trúc Single-Library (`part` / `part of`) & Trừu tượng hóa Nền tảng
- **Tổ chức `part` trong `lib/fastlottie.dart`**: Toàn bộ 11 module cốt lõi (`compiler.dart`, `track.dart`, `scene.dart`, `widget.dart`, `fork.dart`, `gradient.dart`, `path_ops.dart`, `raster_cache.dart`, `rle_rasterizer.dart`, `worker_pool.dart`, `ping_pong.dart`) thuộc cùng một library. Cách tổ chức này cho phép các lớp nội bộ truy cập trực tiếp trường private (`_cursor`, `_matrix`, `_values`, `_rasterEntry`) mà không cần mở public API hoặc tạo wrapper trung gian, giúp trình biên dịch AOT của Dart inline tối đa các hàm trên hot-path.
- **Conditional Imports cho Đa nền tảng (Native IO vs Web)**:
  - `isolate_io.dart` / `isolate_stub.dart`: Trên Native sử dụng `Isolate.spawn` và `TransferableTypedData` (chuyển vùng nhớ BGRA8888 zero-copy từ worker về UI); trên Web fallback về `StreamController` nội cục.
  - `platform_io.dart` / `platform_stub.dart`: Cung cấp `RandomAccessFile` đồng bộ (`PlatformFileHandle`) cho worker isolate đọc/ghi trực tiếp theo offset trong file `.flcache`.
  - `network_io.dart` / `network_stub.dart`: Quản lý tải HTTP/HTTPS với khả năng hủy tức thì qua `FastLottieCancelToken` (`request.abort()`, `socket.destroy()`) khi widget bị hủy hoặc cuộn khỏi màn hình, kèm bộ nhớ đệm file nguyên bản `.tgsbin` ghi nguyên tử qua file tạm `.tmp.$pid.$seq`.

### 3.2. Compiler "Fail-Fast", Biên dịch Tĩnh Expressions & Đồ thị Modifier DAG
- **Kiểm tra Whitelist nghiêm ngặt (`_Compiler.check`)**: Thay vì âm thầm bỏ qua các thuộc tính không hỗ trợ gây sai lệch hình ảnh, `_Compiler` đối chiếu từng trường JSON với các tập trường `const Set<String>` và kiểm tra các cờ (`ddd`, `ao`, `bm`, `hasMask` phải bằng `0`/`false`). Mọi tính năng ngoài phạm vi đều ném `UnsupportedLottieException` kèm đường dẫn JSON chính xác (`$.layers[i]...`).
- **Biên dịch tĩnh Expressions (`_walkExpressions`)**: Các biểu thức After Effects tham chiếu chéo thuộc tính như `$bm_rt = content('...').transform.scale`, `transform.rotation`, `opacity` hoặc `transform.xPosition`/`yPosition` được giải quyết ngay trong pha compile bằng Regex, kiểm tra chu trình (`resolving` set) và **nối thẳng (rewire) dữ liệu keyframe của nguồn vào đích**. Không có bộ thông dịch JavaScript nào chạy ở mỗi frame.
- **Đồ thị phi chu trình (DAG) cho Trim Paths (`_Shape` & `_TrimPart`)**: Trong chuẩn Lottie, một modifier `tm` (`_Trim`) có thể tác động lên các shape đã được khai báo và bắt vào `_Style` ở phía trên hoặc nằm trong nhóm lồng nhau. Compiler bọc mọi hình học trong lớp vỏ đại diện `_Shape`. Khi gặp `tm`, compiler đóng băng danh sách nội dung gốc vào `trim.inputs`, rồi thay thế nội dung của từng `_Shape` bằng `_TrimPart(trim, n)`. Đồ thị sau biên dịch là một DAG thuần Dart, không chứa đối tượng `dart:ui` và không cần duyệt lại cây layer lúc vẽ.

### 3.3. Bố cục Dữ liệu Kiểu Cột (Columnar Layout) & Nội suy SIMD trong `_Track`
Xem thêm số đo chi tiết tại [data-layout.md](data-layout.md).
- **Ghi trực tiếp vào các cột keyframe**: Compiler đọc header để tính kích thước buffer rồi giải mã giá trị và easing vào các mảng `TypedData` của `_Keyframes`:
  1. `Float64List times`: Cột thời gian tách rời. Tìm kiếm nhị phân chỉ đọc mảng này trong L1 cache mà không chạm vào dữ liệu tọa độ.
  2. **Con trỏ thời gian `_cursor` $O(1)$**: `_Track.at(frame)` lưu lại chỉ số đoạn keyframe của lần lấy mẫu trước. Khi phát tuần tự, phép kiểm tra `frame >= times[_cursor] && frame < times[_cursor + 1]` trúng ngay trong $O(1)$ mà không cần binary search.
  3. `Int32List metadata`: Đóng gói 3 cột có độ dài `count` nối tiếp nhau:
     - `[0 .. count)`: Cờ bit (`holdFlag = 1`, `endFlag = 2`, `tangentFlag = 4`, `linearFlag = 8`) và số lượng đường cong easing (`easeCount = flags >> 4`).
     - `[count .. 2*count)`: `endOffset` đã giải quyết sẵn (nếu keyframe không có `e` riêng, nó trỏ thẳng tới `start` của keyframe kế tiếp mà không nhân đôi dữ liệu).
     - `[2*count .. 3*count)`: `easeOffset` trỏ vào mảng `Float64List easing`.
  4. `Float32List values` & **Nội suy `Float32x4` SIMD**: Giá trị của mỗi keyframe được xếp liền nhau theo vector. Mặc định `FastLottieOptions(useSimd: true)` được **bật**: với các track có `width >= 32` floats (như hình thái học Bézier nhiều đỉnh) và dùng chung easing, `stride` được làm tròn lên bội số của 4 (`(width + 3) & ~3`) và nội suy 4 số thực mỗi nhịp qua `Float32x4List` kèm vòng lặp xử lý phần dư vô hướng (scalar tail).
- **Giải phương trình Bézier & Không gian màu**:
  - **Temporal Easing**: Giải $x(t) = \text{fraction}$ bằng **Bracketed Newton-Raphson** (tối đa 16 bước, tự động thu hẹp khoảng `[lo, hi]` và chia đôi khi đạo hàm ở hai đầu quá phẳng) trước khi tính $y(t)$.
  - **Spatial Tangents (`_SpatialCurve`)**: Tính trước bảng 129 mẫu độ dài cung bằng toán học thuần Dart, cho phép nội suy theo khoảng cách thực mà không cần gọi `ui.Path.computeMetrics()`.
  - **Nội suy màu Gamma-correct**: Sử dụng bảng tra tĩnh `_srgbToLinear` (256 phần tử) và `_linearToSrgb` (4.097 phần tử có nội suy tuyến tính phần lẻ) để nội suy màu trong không gian tuyến tính với chi phí $O(1)$ thay vì gọi `math.pow()` mỗi frame.

### 3.4. Mẫu Thiết kế Template-Fork (`_Fork`) & Định danh Nội dung (`contentKey`)
- **An toàn Isolate & Zero Re-parse**: `FastLottieComposition._template` là cây `_Compiler` bất biến, hoàn toàn không chứa đối tượng `dart:ui` (`Path`, `Paint`, `Shader`), nhờ đó `fromBytesAsync` / `loadAsset` / `loadNetwork` có thể giải nén GZip, parse JSON (`json.fuse(utf8)`) và biên dịch trên worker rồi trả thẳng đồ thị đối tượng về UI isolate qua `Isolate.exit` (không cần serialize lại sang JSON).
- **Khởi động trước trên Worker (`prepareForPlayback`)**: Ngay trên worker giải mã, `prepareForPlayback()` tính sẵn khóa băm `contentKey` và tạo trước một bản sao `_preparedScene = _Fork(warm: true).scene(_template)`, đồng thời đánh giá (prime) toàn bộ các cờ `late final bool isStatic`, `isPathStatic`, `isSpatialStatic`, `isTranslationOnly`, `isSpatialIdentity`.
- **Chia sẻ Bộ nhớ & Khởi tạo Lazy**:
  - Player đầu tiên cần vẽ vector nhận ngay `_preparedScene`. Các player tiếp theo gọi `_Fork().scene(_template)` để tạo các node trạng thái nhẹ (chỉ cấp phát `_cursor` và `Float32List output` riêng), nhưng **chia sẻ 100% `_Keyframes` và `constant`**.
  - Khi một player vẽ qua `FastLottieRasterCache` (chế độ mặc định), thuộc tính `_scene` của player là lazy — nếu frame đã có trong cache raster, player **thậm chí không cần fork cây scene trên UI isolate**.
- **Băm định danh nội dung 128-bit (`_ContentKeyHasher`)**: Duyệt toàn bộ cấu trúc `_Compiler` (kích thước, tốc độ khung hình, các layer, transform, track, hình học, style, gradient, dash, precomp) bằng 4 thanh ghi trạng thái 32-bit nhân xoay để sinh ra chuỗi hex 32 ký tự `contentKey` hoàn toàn tất định giữa mọi Isolate, phiên chạy ứng dụng và nền tảng (IO/Web).

### 3.5. Ba Đường ống Kết xuất (3 Rendering Tiers) trong `FastLottiePlayer.draw`
Khi `FastLottiePlayer.draw()` được gọi, nó lựa chọn đường ống theo thứ tự ưu tiên:

1. **Tier A — Prewarmed GPU Frames (`prepareRaster`)**:
   - Dựng trước toàn bộ các frame nguồn (hoặc 1 frame nếu `composition.isStatic`) thành mảng `List<ui.Image>` ở độ phân giải vật lý `ceil(width * DPR) × ceil(height * DPR)`.
   - Kiểm tra ngân sách bộ nhớ RGBA trước khi cấp phát (mặc định `32 MiB`, có thể cấu hình). Giữ riêng kích thước nội dung thực `_rasterSize` chưa làm tròn để không làm méo pixel cuối khi DPR lẻ.
   - Khi vẽ chỉ tốn một lệnh `canvas.drawImageRect` với `FilterQuality.none`.

2. **Tier B (Mặc định khi `usePipeline: true`) — Shared Ping-Pong Pipeline (`FastLottieRasterCache`)**:
   - Mặc định widget `FastLottie` tự động mượn một instance `FastLottieRasterCache.pingPong` dùng chung có đếm tham chiếu qua `_DefaultPingPongScope`.
   - **Double-Buffered `ui.Image`**: Mỗi `_RasterEntry` (định danh bởi `(contentKey, pixelSize, poster, rateKey)`) chỉ giữ tối đa **2 texture GPU** tại một thời điểm: `renderingImage` (front buffer đang vẽ) và `backgroundImage` (back buffer chứa frame kế tiếp `(index + 1) % total` đã được worker giải mã trước).
   - Khi sang frame kế tiếp, `_PingPongCoordinator.lookup` chỉ thực hiện hoán đổi con trỏ `renderingImage = backgroundImage` trong $O(1)$ và phát lệnh prefetch cho frame tiếp theo.
   - **Deduplication nhiều Player**: Nếu nhiều widget trên màn hình phát cùng một sticker ở cùng kích thước và tốc độ, tất cả đều gắn vào cùng một `_RasterEntry`, dùng chung cặp texture GPU và chỉ tốn 1 luồng giải mã.
   - **Quản lý Ngân sách VRAM $O(1)$ & Bảo vệ Poster (`reservedPosterBytes`)**: Tách biệt danh sách LRU của animation (`_unpinnedAnims`) và poster 1-frame (`_unpinnedPosters`). Trước khi thu hồi bộ nhớ, `_acquire` kiểm tra tính khả thi trong $O(1)$. Nếu toàn bộ ngân sách đang bị các player hiển thị ghim (pinned), nó từ chối ngay và ghi nhận `_rasterRejectedGeneration` để không quét lặp lại ở các frame sau cho tới khi có entry được nhả.
   - **Giải phóng `ui.Image` theo lô (`_disposalQueue`)**: Các texture cũ bị thay thế không gọi `dispose()` ngay trong nhịp vẽ mà được đẩy vào hàng đợi để xả theo lô (`disposalBatchSize = 8`) trong `addPostFrameCallback`, tránh gây khựng driver GPU khi cuộn nhanh.
   - **Chống tràn hàng đợi (Backpressure & Latest-Desire-Wins)**: Mỗi `_RasterEntry` chỉ có tối đa 1 tác vụ đang chạy (`inFlightFrameIndex`) và 1 vị trí chờ (`pendingFrameIndex`). Nếu người dùng tua hoặc cuộn nhanh, frame mới nhất sẽ ghi đè `pendingFrameIndex`. Khi worker trả kết quả về nhưng frame đó đã lỗi thời (và không phải là lookahead kế tiếp), coordinator **bỏ qua luôn bước `ui.decodeImageFromPixels`** để không tốn băng thông upload lên GPU.
   - Khi front buffer đã có ảnh hợp lệ đầu tiên, nếu frame mới chưa kịp về, player tiếp tục vẽ `renderingImage` hiện tại thay vì rơi về vẽ vector gây giật cục trên UI isolate.

3. **Tier C — Direct Vector Canvas & Bounded LRU `ui.Picture` (`FastLottieCache`)**:
   - Được sử dụng khi `usePipeline: false`, khi `useFrameRate: false` (vẽ subframe nội suy mượt), khi vượt ngân sách VRAM của `rasterCache`, hoặc ở frame đầu tiên khi cache lạnh chưa có `coldFallback`.
   - Nếu không dùng `rasterCache` và `useFrameRate: true`, player lưu tối đa `maximumFrames = 120` đối tượng `ui.Picture` (display list độc lập độ phân giải) trong giới hạn độ phức tạp `maximumCommands = 100000`.
   - Tối ưu hóa trực tiếp trên `Canvas`:
     - **Phân cấp `_Transform`**: Tách biệt `isSpatialIdentity` (bỏ qua hoàn toàn `canvas.save()`/`transform()`), `isTranslationOnly` (chỉ gọi `canvas.translate(dx, dy)`), và ma trận đầy đủ.
     - **Primitive Fast-Path**: Hình chữ nhật và hình chữ nhật bo góc đơn lẻ không có nét đứt gọi thẳng `canvas.drawRect` / `canvas.drawRRect` mà không tạo `ui.Path`.
     - **Tách cờ `isPathStatic` và `isStatic`**: Đường dẫn của nhóm/shape không bị dựng lại khi chỉ có màu sắc hoặc độ mờ thay đổi. Các phép đo `ui.PathMetric` trong `_Trim` và `_Dash` được lưu đệm và tái sử dụng khi hình học gốc đứng yên dù thông số cắt/nét đứt chuyển động.
     - **Cắt tỉa Matte bằng `worldBounds`**: Chỉ những layer có `matte` mới dùng hai lệnh `canvas.saveLayer` (`BlendMode.dstIn` / `dstOut`, kèm `ColorFilter.matrix` cho Luma matte). Trước khi gọi `saveLayer`, `_Compiler.draw` tính giao điểm khung bao thế giới (`worldBounds`) giữa target và matte: nếu không giao nhau (với `dstIn`) thì bỏ qua hoàn toàn; nếu giao nhau thì chỉ cấp phát `saveLayer` đúng bằng vùng bao hợp nhỏ nhất (mở rộng 1px cho khử răng cưa).

### 3.6. Trình Kết xuất Phần mềm Thuần Dart (`rle_rasterizer.dart`)
Vì các đối tượng `dart:ui` (`Canvas`, `Path`, `Picture`) không thể khởi tạo hay sử dụng trên Background Isolate thông thường của Dart, `fastlottie` cài đặt một trình kết xuất đồ họa vector 2D phần mềm hoàn chỉnh để chạy trên `_RasterWorkerPool`:
1. **Làm phẳng Bézier thích ứng theo tỷ lệ màn hình (`_PolyPath`)**:
   - Từ ma trận affine hiện hành, tính hệ số phóng đại thực tế `maxScale` để chọn sai số phẳng `localFlatness = (0.25 / maxScale).clamp(0.005, 1.5)`.
   - Chia đôi đệ quy De Casteljau (`addCubic`, độ sâu tối đa 10) vào cấu trúc **Struct-of-Arrays (`_PolyPath`)** (`Float64List vx, vy`, `Int32List contourStart, contourEnd`, `Uint8List contourClosed`).
   - Các đường dẫn tĩnh (`src.isPathStatic`) chỉ được làm phẳng một lần và lưu trong `ws.staticPaths` của từng worker.
2. **Mở rộng nét vẽ (`_expandStroke`) & Nét đứt (`_applyDash`)**:
   - Sử dụng bộ đệm tái sử dụng `_StrokeScratch` (SoA `x, y, tx, ty`) để mở rộng đa giác nét vẽ với đầy đủ `butt`/`round`/`square` cap và `miter`/`round`/`bevel` join.
   - Tại các góc gấp phía trong (inner crease), đường bao đi xuyên qua tâm đỉnh `(vx, vy)` để quy tắc lấp đầy `NonZero` không tạo vết khuyết.
3. **Bộ quét dòng kiểu FreeType (`_FtScanlineRasterizer` & `_RleSpans`)**:
   - Chuyển đổi tọa độ sang số nguyên điểm cố định **24.8 fixed-point** (256 subpixels/pixel).
   - Cắt các cạnh đa giác qua lưới ô pixel, tích lũy độ che phủ (`_cellCover`) và diện tích hình thang (`_cellArea`) vào danh sách liên kết tĩnh theo từng hàng (`_rowHead`, `_cellX`, `_cellNext`), chỉ dọn dẹp dải dòng thực sự bị chạm tới (`_dirtyMinY .. _dirtyMaxY`).
   - Pha quét (`sweep`) hỗ trợ cả quy tắc `NonZero` và `EvenOdd`, xuất ra danh sách đoạn ngang nén **Run-Length Encoding (`_RleSpans`)**, tự động gộp các pixel liền kề có cùng độ che phủ (`cov` từ `1..256`). Mỗi span được đóng gói vào đúng 2 từ 32-bit: `word0 = (y << 16) | x` và `word1 = (len << 8) | (cov - 1)`.
4. **Bộ pha trộn 64-bit SWAR (`_SwarBlender`)**:
   - Dùng kỹ thuật **SWAR (SIMD Within A Register)** để nhân alpha và trộn `SrcOver` đồng thời hai cặp kênh `R+B` (`0x00FF00FF`) và `A+G` (`0xFF00FF00`) trên số nguyên premultiplied BGRA8888.
   - Với các span đặc (`sa == 255`) dài $\ge 8$ pixels, gọi thẳng `dst.fillRange()` của VM.
   - Với **Linear & Radial Gradient**: Tạo bảng tra 1024 màu premultiplied BGRA8888 (`_evalGradientLut`, cache lại nếu gradient tĩnh). Trên mỗi span ngang của Linear Gradient, tọa độ chiếu $t$ chỉ cần cộng thêm một bước nhảy hằng số `t += dtx` cho từng pixel.
   - Với **Matte & Precomp**: Chỉ rasterize phần diện tích giao nhau thực tế (`mx0..mx1, my0..my1` cho `dstIn`) trên các bộ đệm tạm tái sử dụng theo độ sâu (`_acquireScratch`).

### 3.7. Lưu trữ Bitstream Hai Tầng (`BitstreamStore`), LZ4 & Sharded Worker Pool
- **Sharding không khóa theo `FNV-1a(entryKey) % workerCount` (`_RasterWorkerPool`)**:
  - Pool khởi tạo `2..4` Worker Isolates bền vững (tùy số nhân CPU). Mọi yêu cầu cho cùng một `entryKey` luôn được định tuyến về cùng một shard.
  - Nhờ đó, mỗi file `.flcache` trên đĩa thuộc quyền đọc/ghi độc quyền của duy nhất một Worker Isolate, **không cần khóa file (file lock)** liên luồng, trong khi Host vẫn quản lý tổng dung lượng đĩa `_diskLru` (mặc định `128 MiB`) và ưu tiên giữ lại các file đang có player hoạt động (`activeKeys`).
- **Bộ nén LZ4 thuần Dart không cấp phát bộ nhớ (`Lz4Codec` & `Lz4Scratch`)**:
  - Tái sử dụng bảng băm 16.384 phần tử (`_hashLog = 14`) và buffer đầu ra qua `Lz4Scratch`.
  - Hỗ trợ dừng sớm (`abortAtLength: expectedBytes`): nếu frame không thể nén nhỏ hơn kích thước gốc, bộ nén dừng ngay và lưu thẳng byte BGRA8888 thô (`isRaw = true`).
  - Trong `decompressInto`, có **fast-path cho `offset == 4`**: các vùng nền trong suốt (`0x00000000`) hoặc mảng màu phẳng lặp lại chu kỳ 4 byte (1 pixel BGRA) được lấp nhanh bằng `dst.fillRange` hoặc vòng lặp 4 byte.
- **Định dạng File `.flcache` (`FLC1`) Chịu lỗi & Tự phục hồi**:
  - Cấu trúc file `<entryKey>.flcache`:
    - **Header 32 bytes** (Little-Endian): `magic = 0x464C4331 ('FLC1')`, `version = 1`, `width`, `height`, `frameCount`, `flags` (`bit 0 = Completed`, `bit 1 = Poster`), `writtenCount`, `uncompressedFrameBytes`.
    - **Bảng chỉ mục Frame (`frameCount * 16` bytes)**: Mỗi slot gồm `uint64 offset`, `uint32 storedLen`, và `uint32 meta = (isRaw << 31) | crc31`.
    - **Payload Append-Only**: Các khối frame nén LZ4 (hoặc Raw) được ghi nối tiếp ngay khi từng frame được render (hỗ trợ ghi nhảy cóc không cần theo thứ tự).
  - **Cơ chế tự chữa lỗi (Self-healing)**: Mỗi frame được bảo vệ bằng mã kiểm tra **CRC31** (31 bit thấp của CRC32). Khi mở file hoặc đọc frame, nếu phát hiện slot trỏ vượt quá độ dài file (do ứng dụng bị đóng đột ngột lúc đang ghi) hoặc sai CRC31, `BitstreamStore` tự động xóa slot hỏng về `0`, cắt bỏ phần đuôi thừa (`handle.truncate(maxEnd)`), tăng `recoveredCorruptions` và cho phép vẽ lại riêng frame đó mà không làm hỏng toàn bộ file cache.

### 3.8. Tầng Widget & Bộ lọc Thông báo Vẽ lại (`_FrameRepaint`)
- `FastLottie` quản lý `FastLottiePlayer` và `AnimationController` nội bộ (hoặc nhận `controller` ngoài), bọc `CustomPaint` trong `RepaintBoundary`.
- `FastLottieView` dành cho trường hợp caller tự quản lý vòng đời `player` (ví dụ khi dùng `prepareRaster`).
- `FastLottieNetwork` (hoặc `FastLottie.network`) tự động tải, lưu cache nguồn, biên dịch trên background isolate và hủy socket ngay khi widget unmount hoặc đổi URI.
- **Giảm thiểu Repaint thừa (`_FrameRepaint`)**:
  - Nhịp tick của `AnimationController` không bao giờ gọi `setState()`.
  - `_FrameRepaint._tick()` tính chỉ số frame mẫu đã lượng tử hóa theo FPS của composition và `maximumFrameRate`. Nếu màn hình chạy ở 120Hz nhưng animation là 30 FPS, các nhịp tick rơi vào cùng một mẫu frame (`sample == _last`) sẽ bị chặn lại, không gọi `notifyListeners()` và không kích hoạt `CustomPainter.paint()`.
  - Khi composition tĩnh (`composition.isStatic`) hoặc hệ thống bật `MediaQuery.disableAnimations`, ticker tự động dừng hoàn toàn (`_controller.stop()`).

---

## 4. Bảng Ánh xạ Module Mã nguồn

| File mã nguồn | Vai trò kiến trúc cốt lõi |
| :--- | :--- |
| `lib/fastlottie.dart` | Public API: `FastLottieComposition`, `FastLottiePlayer`, `FastLottieCache`, `FastLottieOptions`, điều phối 3 tầng render trong `draw()`. |
| `lib/decoding.dart` | `decodeLottieBytes()`: Phát hiện chữ ký GZip (`0x1f 0x8b`) cho `.tgs` và giải nén an toàn với giới hạn `maximumBytes` (16 MiB). |
| `lib/src/compiler.dart` | `_Compiler`: Kiểm tra schema fail-fast, biên dịch tĩnh expressions & Layer Control, dựng cây layer, precomp, matte, trim. |
| `lib/src/track.dart` | `_Keyframes`, `_Track`, `_SpatialCurve`: Lưu trữ keyframe dạng cột, con trỏ $O(1)$, Newton-Raphson easing, SIMD `Float32x4`, LUT sRGB. |
| `lib/src/scene.dart` | `_Transform`, `_Layer`, `_Group`, `_BezierGeometry`, `_Primitive`, `_Style`: Cây scene vector, tối ưu hóa ma trận và tính khung bao `worldBounds`. |
| `lib/src/path_ops.dart` | `_Shape`, `_TrimPart`, `_Trim`, `_Dash`: Đồ thị alias DAG cho Trim Paths và Stroke Dash kèm bộ nhớ đệm `ui.PathMetric`. |
| `lib/src/gradient.dart` | `_GradientSpec`: Hợp nhất các mốc màu/alpha bằng insertion sort tại chỗ và tạo `ui.Shader` cho đường vẽ `Canvas`. |
| `lib/src/fork.dart` | `_Fork`: Nhân bản trạng thái mutable của scene cho mỗi player, dùng chung `_Keyframes` bất biến và làm nóng các cờ tĩnh. |
| `lib/src/rle_rasterizer.dart` | `_FtScanlineRasterizer`, `_SwarBlender`, `_renderSceneSoftware`, `_ContentKeyHasher`: Trình kết xuất phần mềm RLE + SWAR thuần Dart và băm nội dung 128-bit. |
| `lib/src/raster_cache.dart` | `FastLottieRasterCache`, `_RasterEntry`: Quản lý ngân sách VRAM, kiểm tra admission $O(1)$, bảo vệ poster và xả `ui.Image` theo lô. |
| `lib/src/ping_pong.dart` | `_PingPongCoordinator`: Điều phối cặp `renderingImage` / `backgroundImage`, lookahead prefetch và chống tràn hàng đợi. |
| `lib/src/worker_pool.dart` | `_RasterWorkerPool`, `_softwareWorkerEntry`: Pool các Isolate phân mảnh theo FNV-1a và quản lý LRU đĩa `.flcache` toàn cục. |
| `lib/src/bitstream_cache.dart` | `BitstreamStore`: Cache frame nén trong RAM (LRU) và định dạng file `.flcache` (`FLC1`) kèm kiểm tra/phục hồi lỗi CRC31. |
| `lib/src/lz4.dart` | `Lz4Codec`, `Lz4Scratch`: Bộ nén và giải nén LZ4 thuần Dart tối ưu cho buffer pixel BGRA8888 (fast-path `offset == 4`). |
| `lib/src/widget.dart` | `FastLottie`, `FastLottieView`, `FastLottieNetwork`, `_FrameRepaint`, `_DefaultPingPongScope` (singleton ref-counted). |
| `lib/src/isolate_io.dart` / `isolate_stub.dart` | Giao tiếp Worker Isolate qua `SendPort`/`ReceivePort` và `TransferableTypedData` (hoặc fallback trên Web). |
| `lib/src/platform_io.dart` / `platform_stub.dart` | Truy cập file ngẫu nhiên đồng bộ (`PlatformFileHandle`) và quản lý thư mục cho `.flcache`. |
| `lib/src/network_io.dart` / `network_stub.dart` / `network_types.dart` | Tải mạng HTTP/HTTPS có hỗ trợ hủy tức thì (`FastLottieCancelToken`) và cache đĩa nguyên bản `.tgsbin`. |

---

## 5. Lộ trình Tối ưu hóa Hiệu năng, Nhiệt lượng & Tài nguyên

Phần này tổng hợp 12 hướng tiếp cận tối ưu hóa chuyên sâu cho `fastlottie`, kết hợp đồng thời 3 mục tiêu:
1. **Giảm nhiệt lượng & tiêu thụ pin (Thermal & Power Efficiency)**: Giảm số chu kỳ CPU/GPU đánh thức trên mỗi giây, cắt bỏ công việc thừa khi vùng vẽ không đổi hoặc khuất tầm nhìn.
2. **Tận dụng tài nguyên phần cứng & bộ nhớ đệm tốt hơn (Resource Utilization)**: Khử cấp phát tạm thời, chia sẻ khung hình chuẩn hóa giữa các tốc độ phát khác nhau và điều phối hàng đợi ưu tiên hai làn.
3. **Tối ưu thuật toán & cấu trúc dữ liệu (Algorithmic & SIMD Optimization)**: Loại bỏ hàm lượng giác đắt đỏ, cắt tỉa sớm theo khung bao (Early AABB Clip Culling), sai phân tiến kết hợp SIMD `Float32x4` và toán học nguyên không phép chia.

### 5.1. Ma trận Tổng hợp 12 Hướng Tối ưu

| Mã | Hạng mục tối ưu | Nhóm mục tiêu | Trạng thái | Tác động chính |
| :---: | :--- | :--- | :---: | :--- |
| **#1** | **Sub-tree Static Layer Memoization** trong `_RasterWorkspace` | Giảm nhiệt / Thuật toán | Đề xuất | Tránh vẽ lại các nền tĩnh bên dưới các lớp động ở mỗi frame trên Worker Isolate. |
| **#2** | **Adaptive Frame Deduplication (Bitwise Hash / Dirty-Rect Skip)** | Giảm nhiệt / GPU | Đề xuất | Phát hiện hai frame liên tiếp có đầu ra pixel giống hệt nhau để tái sử dụng `ui.Image` mà không gọi `decodeImageFromPixels`. |
| **#3** | **Loại bỏ lượng giác (`atan2`/`acos`/`cos`/`sin`) trong `_expandStroke`** | Thuật toán / Giảm nhiệt | **Đã triển khai** | Thay bằng đệ quy chia đôi pháp tuyến đơn vị (Recursive Unit-Normal Bisection) dựa trên sai số dây cung (sagitta), giảm ~3–4× chi phí CPU khi mở rộng nét vẽ tròn (`round join`/`round cap`). |
| **#4** | **Cắt tỉa sớm theo khung bao (`Early Bounding-Box Clip Culling`) trong `_renderStyleInto`** | Thuật toán / Giảm nhiệt | **Đã triển khai** | Kiểm tra giao cắt giữa `style.drawBounds(frame)` (sau biến đổi affine) với vùng clip hiện tại trước khi làm phẳng đường cong Bézier, cắt nét đứt hay mở rộng độ dày nét, đồng thời thu hẹp vùng quét scanline. |
| **#5** | **Hàng đợi Ưu tiên 2 Làn (2-Lane Priority Queue) trong `_PingPongCoordinator`** | Tài nguyên / Độ trễ | **Đã triển khai** | Tách biệt hàng đợi khung hình hiện tại (`_highPriorityQueue`, `isPrefetch: false`) và hàng đợi dự đoán (`_lowPriorityQueue`, `isPrefetch: true`), hỗ trợ thăng cấp tại chỗ và ưu tiên loại bỏ prefetch trước khi đầy tải. |
| **#6** | **Chuẩn hóa Khóa Cache theo Khung hình Nguồn (`Canonical Source-Frame Indexing`)** | Tài nguyên / Đĩa & RAM | **Đã triển khai** | Định danh `.flcache` và mục LRU RAM theo `sourceFrameCount` thay vì số lượng mẫu phụ thuộc FPS, giúp chế độ `poster`, `24fps`, `30fps`, `60fps` dùng chung duy nhất một file `.flcache` và các frame nén LZ4 trong RAM. |
| **#7** | **Nén Spans Đen/Trong suốt (Sparse Tile / Row-Directory) trước LZ4** | Tài nguyên / Băng thông | Đề xuất | Ghi trực tiếp danh sách span hoặc chỉ số dòng có điểm ảnh khác `0` cho các sticker thưa, giảm lượng dữ liệu phải quét qua LZ4 và `decodeImageFromPixels`. |
| **#8** | **Gộp biến đổi Affine ngay trong bước Flatten Bézier (`Fused Transform + Flatten`)** | Thuật toán / Bộ nhớ | Đề xuất | Biến đổi các điểm điều khiển Bézier sang không gian thiết bị trước khi chia nhỏ De Casteljau cho các style chỉ tô đặc (`fill` không có `dash`/`stroke`), bỏ qua bước copy qua `_workPolyB`. |
| **#9** | **Sai phân tiến bậc 2 + SIMD `Float32x4` cho Radial Gradient & Luma Matte nguyên không phép chia** | Thuật toán / SIMD | **Đã triển khai** | Dùng sai phân tiến bậc 2 ($\Delta^2 D^2 = 2(\text{nia}^2 + \text{nib}^2)$) kết hợp `Float32x4.sqrt()` xử lý 4 pixel/nhịp cho Radial Gradient, và bảng nghịch đảo `_invAlphaLut` 16.16 fixed-point kết hợp hệ số nguyên BT.601 cho Luma Matte. |
| **#10** | **Tự động điều chỉnh FPS theo kích thước hiển thị (Perceptual Screen-Size FPS Scaling)** | Giảm nhiệt / Pin | Đề xuất | Hạ tần số lấy mẫu hợp lý khi diện tích hiển thị vật lý rất nhỏ (ví dụ icon `< 32×32` logical px) mà mắt người không phân biệt được chuyển động dưới pixel. |
| **#11** | **Tự động đóng băng Ticker khi khuất tầm nhìn (`Visibility / Viewport Gating`)** | Giảm nhiệt / Pin | Đề xuất | Tạm dừng `AnimationController` khi `RenderBox` nằm ngoài viewport cuộn hoặc bị che khuất hoàn toàn. |
| **#12** | **Chế độ Nén Delta-Frame (XOR + LZ4) cho Chuỗi Khung hình Liên tiếp** | Tài nguyên / RAM | Đề xuất | XOR hai khung hình liên tiếp trước khi đưa vào LZ4 cho các cảnh có phần nền lớn đứng yên để tăng tỷ lệ nén trong RAM. |

---

### 5.2. Chi tiết Thiết kế các Tối ưu Đã Triển khai (#3, #4, #5, #6, #9)

#### 1. Tối ưu #3: Khử hàm lượng giác trong `_expandStroke` bằng Đệ quy Chia đôi Pháp tuyến Đơn vị (`lib/src/rle_rasterizer.dart`)
- **Vấn đề trước đây**: Mỗi khớp nối tròn (`join == 2`) và đầu mút tròn (`cap == 2`) gọi `math.atan2` hai lần, `math.acos` một lần và vòng lặp `math.cos` + `math.sin` cho từng điểm chia cung tròn. Trên các sticker nhiều nét vẽ cong, các lệnh siêu việt (transcendental functions) này chiếm tỷ trọng lớn chu kỳ CPU trên Worker Isolate.
- **Giải pháp**:
  - Vì `_expandStroke` đã tính sẵn tiếp tuyến đơn vị `(tx[s], ty[s])` và pháp tuyến đơn vị `(n0x, n0y)`, `(n1x, n1y)` cho từng đoạn thẳng, hàm `addNormalArc` thực hiện chia đôi trực tiếp hai pháp tuyến đơn vị:
    $$\vec{m} = \frac{\vec{n}_0 + \vec{n}_1}{\|\vec{n}_0 + \vec{n}_1\|}$$
  - Sai số dây cung (sagitta) của cung tròn bán kính $hw$ được tính thuần túy bằng tích vô hướng:
    $$\text{sagitta} = hw \cdot (1 - (\vec{n}_0 \cdot \vec{m}))$$
  - Nếu $\text{sagitta} > \text{sagittaTol}$ (hoặc ở các mức chia cơ sở `depth < 2`), cung được chia đôi đệ quy về hai phía $(\vec{n}_0 \to \vec{m})$ và $(\vec{m} \to \vec{n}_1)$ mà **không cần bất kỳ lệnh `atan2`, `acos`, `cos`, `sin` nào**.
  - Các đầu mút tròn (`cap == 2`) được biểu diễn bằng 2 cung 90° qua đỉnh tiếp tuyến $\vec{u}$, và chấm tròn đơn điểm (`n == 1 && cap == 2`) được dựng từ 4 góc phần tư đơn vị.

#### 2. Tối ưu #4: Cắt tỉa sớm theo Khung bao (`Early Bounding-Box Clip Culling`) trong `_renderStyleInto` (`lib/src/rle_rasterizer.dart`)
- **Vấn đề trước đây**: `_renderStyleInto` luôn làm phẳng toàn bộ đường cong Bézier (`_appendSourceLocal`), tính độ dài cắt nét đứt (`_applyDash`), mở rộng đa giác nét vẽ (`_expandStroke`) và biến đổi toàn bộ đỉnh sang tọa độ thiết bị trước khi bộ quét scanline cắt bỏ các cạnh nằm ngoài vùng clip `(clipX0, clipY0, clipX1, clipY1)`.
- **Giải pháp**:
  - Ngay đầu `_renderStyleInto`, gọi `style.drawBounds(frame)` để lấy khung bao cục bộ (đã tính cả độ nở `strokeWidth` và `miterLimit`), sau đó ánh xạ qua ma trận affine `(ma, mb, mc, md, mtx, mty)` sang khung bao thiết bị `(bx0, by0, bx1, by1)` (cộng biên an toàn `2px` cho khử răng cưa).
  - Giao cắt `(bx0, by0, bx1, by1)` với `(clipX0, clipY0, clipX1, clipY1)` thành `(effClipX0, effClipY0, effClipX1, effClipY1)`.
  - Nếu `effClipX0 >= effClipX1 || effClipY0 >= effClipY1`, hàm thoát ngay lập tức với chi phí $O(1)$, bỏ qua toàn bộ quá trình chia nhỏ Bézier, dash, stroke và scanline.
  - Nếu còn giao cắt, truyền khung thu hẹp `(effClipX0, effClipY0, effClipX1, effClipY1)` vào `rasterizePolyPath` để giảm số dòng quét phải khởi tạo và duyệt.

#### 3. Tối ưu #5: Hàng đợi Ưu tiên 2 Làn (`2-Lane Priority Queue`) trong `_PingPongCoordinator` (`lib/src/ping_pong.dart`)
- **Vấn đề trước đây**: Các yêu cầu vẽ khung hình đang cần hiển thị ngay (`renderingImage == null`) và các yêu cầu nạp trước cho khung hình kế tiếp (`lookahead prefetch`) nằm chung trong một hàng đợi FIFO `_pendingQueue`. Khi nhiều sticker cuộn vào màn hình cùng lúc, các tác vụ prefetch của sticker trước làm trễ khung hình đầu tiên của các sticker sau, và khi chạm ngưỡng `maximumPendingFrames`, cả yêu cầu hiển thị tức thời cũng có thể bị từ chối như prefetch.
- **Giải pháp**:
  - Tách `_pendingQueue` thành hai hàng đợi `Queue<_RasterEntry>`:
    - `_highPriorityQueue`: Dành cho các mục cần hiển thị ngay (`isPrefetch: false`, gắn cờ `entry.queuedHighPriority = true`).
    - `_lowPriorityQueue`: Dành cho các mục nạp trước (`isPrefetch: true`).
  - `_pumpQueue()` luôn lấy từ `_highPriorityQueue` trước; chỉ khi làn ưu tiên cao rỗng mới lấy từ `_lowPriorityQueue`.
  - **Thăng cấp tại chỗ (In-place Promotion)**: Nếu một mục đang nằm chờ trong `_lowPriorityQueue` nhưng bước sang frame mới cần hiển thị ngay (`!isPrefetch`), nó được chuyển thẳng sang `_highPriorityQueue`.
  - **Chống tràn thông minh (Priority Eviction)**: Khi tổng số mục chờ đạt `maximumPendingFrames`, nếu có một yêu cầu ưu tiên cao mới đến, bộ điều phối sẽ loại bỏ mục cũ nhất trong `_lowPriorityQueue` để nhường chỗ thay vì làm rơi khung hình đang cần vẽ.

#### 4. Tối ưu #6: Chuẩn hóa Khóa Cache theo Khung hình Nguồn (`Canonical Source-Frame Indexing`) (`lib/src/bitstream_cache.dart`, `lib/src/raster_cache.dart`, `lib/src/ping_pong.dart`)
- **Vấn đề trước đây**: Khóa định danh của `BitstreamStore` và tên file `.flcache` sử dụng `entry.frames` (số mẫu phụ thuộc vào `maximumFrameRate` và chế độ `poster`) cùng hậu tố `_p`. Do đó, cùng một composition ở cùng kích thước pixel nhưng hiển thị ở chế độ `poster` (1 frame), `30 FPS` và `60 FPS` bị tách thành 3 file `.flcache` riêng biệt và phải rasterize lại frame 0 nhiều lần.
- **Giải pháp**:
  - Bổ sung trường `sourceFrames` trên `_RasterEntry` (`1` nếu composition tĩnh, ngược lại là `max(1, composition.frameCount)`).
  - Hàm `formatBitstreamEntryKey` định danh khóa chuẩn hóa `${contentKey}_${width}x${height}_f$sourceFrameCount`.
  - Khi gửi yêu cầu tới `_RasterWorkerPool.renderFrame`, `_PingPongCoordinator` ánh xạ chỉ số mẫu `frameIndex` (`0 .. entry.frames - 1`) sang chỉ số khung hình nguồn chuẩn hóa `sourceIndex = _sourceIndexForSample(entry, frameIndex)` (`0 .. entry.sourceFrames - 1`), trong khi vẫn giữ các con trỏ trạng thái giao diện (`renderingFrameIndex`, `backgroundFrameIndex`, `inFlightFrameIndex`) theo không gian mẫu của từng entry.
  - Kết quả: Chế độ `poster`, `24 FPS`, `30 FPS` và `60 FPS` ở cùng độ phân giải dùng chung khóa RAM/đĩa và tái sử dụng các frame nguồn trùng nhau.

#### 5. Tối ưu #9: Sai phân tiến bậc 2 + SIMD `Float32x4` cho Radial Gradient & Luma Matte nguyên không phép chia (`lib/src/rle_rasterizer.dart`)
- **Radial Gradient (`_SwarBlender.fillRadialGradientSpans`)**:
  - Thay vì nhân ma trận nghịch đảo và nhân `invRadius` cho từng pixel, các hệ số bước nhảy `(nia, nib, nic, nid, nitx, nity)` được chuẩn hóa sẵn theo `invRadius = 1.0 / radius` ngay đầu hàm.
  - Bình phương khoảng cách $D^2(k) = (dx_0 + k \cdot \text{nia})^2 + (dy_0 + k \cdot \text{nib})^2$ dọc theo mỗi span ngang được cập nhật bằng sai phân tiến bậc 2 chỉ với 2 phép cộng mỗi pixel:
    $$D^2 \leftarrow D^2 + \text{step}_1, \quad \text{step}_1 \leftarrow \text{step}_1 + \text{step}_2 \quad (\text{với } \text{step}_2 = 2(\text{nia}^2 + \text{nib}^2))$$
  - Với các span dài $\ge 4$ pixel, 4 giá trị $D^2$ liên tiếp được nạp vào thanh ghi SIMD `Float32x4` và khai căn đồng thời bằng một lệnh phần cứng `Float32x4.sqrt()`.
- **Luma Matte nguyên không phép chia (`_renderCompilerInto` & `_SwarBlender._invAlphaLut`)**:
  - Thay thế 3 phép chia nguyên `(r * 255) ~/ mAlpha` và biểu thức dấu phẩy động `(0.299 * r + 0.587 * g + 0.114 * b).toInt()` ở mỗi điểm ảnh bằng bảng tra nghịch đảo 16.16 fixed-point `_invAlphaLut[mAlpha] = ((255 << 16) + mAlpha - 1) ~/ mAlpha` (khớp tuyệt đối `(c * 255) ~/ mAlpha` với mọi $c \in [0, 255], \alpha \in [1, 255]$) kết hợp hệ số nguyên BT.601 (`19595`, `38470`, `7471`):
    ```dart
    final inv = _SwarBlender._invAlphaLut[mAlpha];
    r = (r * inv) >>> 16;
    g = (g * inv) >>> 16;
    b = (b * inv) >>> 16;
    final lum = ((19595 * r + 38470 * g + 7471 * b) >>> 16).clamp(0, 255);
    ```

---

## 6. Kiến trúc Mini-Strip ($K$-Frame Strip Ping-Pong) (`lib/src/raster_cache.dart`, `lib/src/ping_pong.dart`, `lib/src/worker_pool.dart`)

`FastLottieRasterCache.miniStrip` mở rộng mô hình Double-Buffered Ping-Pong truyền thống ($K = 1$) thành **Double-Buffered Strip Ping-Pong**, đóng gói tối đa $K$ khung hình liên tiếp theo chiều dọc vào một `ui.Image` duy nhất:

1. **Bố cục Strip Dọc & Zero-Copy SublistView**:
   - Trên `_softwareWorkerEntry` ([`lib/src/worker_pool.dart`](file:///Users/vsf/source/github.com/definev/fastlottie/lib/src/worker_pool.dart)), toàn bộ strip gồm $m \le K$ khung hình được cấp phát liên tục trên một buffer duy nhất có chiều cao $H_{\text{strip}} = m \cdot H + (m - 1) \cdot \text{padY}$.
   - Mỗi slot $j \in [0, m - 1]$ tương ứng trực tiếp với hai lát cắt `Uint8List.sublistView` / `Uint32List.sublistView` không sao chép trung gian: `BitstreamStore.tryReadFrame` giải nén LZ4 trực tiếp vào slot nếu có trong cache, hoặc `_renderSceneSoftware` kết xuất trực tiếp vào lát cắt đó.
   - Chiều dọc luôn chèn **1 dòng đệm trong suốt (`padY = 1`)** giữa hai slot liền kề khi $m > 1$, triệt tiêu hiện tượng rò màu biên (texture bleeding) khi GPU lấy mẫu nội suy song tuyến (`FilterQuality.low`).
   - Toàn bộ strip $m$ khung hình chỉ cần **1 thông điệp IPC**, **1 `TransferableTypedData`**, và **1 lệnh GPU `ui.decodeImageFromPixels`**.

2. **Chọn $K$ Thích ứng theo Working-Set & Hạ cấp Động (Adaptive $K$-Sizing & Dynamic Demotion)**:
   - `_resolveStripFrames` tự động chọn $K$ theo dung lượng byte của mỗi khung hình ($W \times H \times 4$) và ngân sách khả dụng của mục nhập (`entryBudget`):
     - $\le 64\text{ KiB}$: $K = 4$ (hoặc gom toàn bộ clip nếu $\text{totalFrames} \le 6$).
     - $\le 256\text{ KiB}$: $K = 4$.
     - $\le 1\text{ MiB}$: $K = 2$.
     - $> 1\text{ MiB}$ hoặc tĩnh/poster: $K = 1$.
   - Tự động chặn chiều cao strip $\le 4096\text{ px}$ để tương thích mọi giới hạn phần cứng texture trên di động.
   - **Tỉ lệ hóa theo tập đang hoạt động & hạ cấp động (`_demoteEntry`)**: Khi tập entry đang được ghim (`users.isNotEmpty`) vượt nửa ngân sách (tối thiểu 4 entry), `_acquire` giới hạn `entryBudget` theo phần công bằng $\lfloor \text{budget} / (\text{pinnedCount} + 1) \rfloor$. Nếu entry mới vẫn thiếu chỗ sau khi xả hết LRU chưa ghim, thay vì từ chối về Vector, bộ điều phối hạ cấp vòng tròn các entry đang giữ $K > 1$ ($K \to \lfloor K/2 \rfloor \to 1$, bỏ qua các bước 1-buffer $\to$ 2-buffer tiết kiệm ít hơn 1 frame) và khớp lại thế hệ `stripGeneration` để bỏ qua upload texture quá kích thước trước đó mà vẫn giữ nguyên kết quả LZ4/đĩa.
   - Khi $\text{totalFrames} \le K$, hệ thống chỉ giữ duy nhất **1 buffer VRAM**, giúp các vòng lặp tiếp theo chạy hoàn toàn với **0 IPC, 0 GPU upload và 0 texture swap**.

3. **Vẽ lát cắt `srcRect` và Bảo toàn định dạng `.flcache`**:
   - `_PingPongCoordinator.lookup` trả về `(image, entry, slotOffsetY)` với `slotOffsetY = (index - renderingStripStart) * (ph + 1)` để [`FastLottiePlayer.draw`](file:///Users/vsf/source/github.com/definev/fastlottie/lib/fastlottie.dart) cắt đúng khung cần vẽ bằng một lệnh `canvas.drawImageRect`.
   - Khi chuyển sang khung kế tiếp trong cùng strip, UI hit trực tiếp tại chỗ và phát prefetch cho strip tiếp theo `(renderingStripStart + renderingStripCount) % totalFrames`, kéo dài cửa sổ thời gian chuẩn bị cho Worker lên $K \times$ thời lượng khung hình.
   - Do `BitstreamStore` lưu và lập chỉ mục theo **từng frame nguồn chuẩn hóa** (Tối ưu #6), `FastLottieRasterCache.miniStrip` và `FastLottieRasterCache.pingPong` dùng chung 100% file `.flcache` trên đĩa và dữ liệu LZ4 trong RAM giữa các phiên làm việc.
