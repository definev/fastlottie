# Emoji Topics trong rich message và Sticker Picker dạng Grid 5 cột

Demo mặc định hiển thị giao diện Telegram Saved Messages gồm:
1. Message list ở nửa trên với 60 tin nhắn mock đa dạng nội dung.
2. 40 sticker động từ bộ Topics được chọn làm emoji động xen kẽ tự nhiên ngay trong văn bản.
3. Bảng chọn sticker (Sticker Picker) chiếm nửa màn hình phía dưới, dạng grid 5 cột cuộn mượt mà.
4. Khi chạm vào bất kỳ sticker nào trong bảng chọn, sticker đó sẽ được append vào cuối danh sách tin nhắn dưới dạng lottie lớn và tự động cuộn xuống tin nhắn mới nhất.

## Kiến trúc hiển thị & bộ nhớ

- **Rich messages & Inline emoji**: Sử dụng WidgetSpan với kích thước cố định theo TextScaler (1.35x), RepaintBoundary riêng biệt cho từng emoji. Render loop chia sẻ atlas (48px, 30 FPS, budget 48 MiB) nên không bao giờ tính lại layout hay parse JSON mỗi tick.
- **Bảng chọn Sticker Picker 5 cột**: GridView 5 cột lười (lazy), không giữ RepaintBoundary thừa, cuộn độc lập nửa màn hình dưới.
- **Silhouette Sprite Sheet**: Đã bundle offline 134 sticker (94 sticker bộ chính + 40 sticker Topics) vào một tấm sprite sheet duy nhất (~126 KiB). Các ô chưa kịp decode xong hoặc khi hệ thống gặp tải cao (pressure) lập tức hiển thị silhouette tĩnh mà không làm đơ UI.
