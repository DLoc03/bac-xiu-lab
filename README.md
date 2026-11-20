# Blog nhật ký Bạc Xỉu

Blog nhật ký cá nhân của **Bạc Xỉu Lười** — chạy tĩnh trên GitHub Pages: https://dloc03.github.io/bac-xiu-lab/

- Giao diện: Mẫu 02 "Quán Nhỏ" — Liquid Glass nhẹ, tông bạc xỉu (sữa – cà phê – đá), cột hồ sơ tác giả + danh sách bài.
- Danh sách bài có **phân trang 4 bài/trang** và lọc theo chủ đề.
- Mỗi bài: ngắn kiểu nhật ký, **đúng 1 ảnh** — ảnh đó cũng là ảnh đại diện khi chia sẻ lên mạng xã hội (og:image của trang bài).

## Cấu trúc

- `index.html` + `assets/` — trang chủ (đọc `data/posts.json`).
- `data/posts.json` — mục lục bài viết (tiêu đề, ngày, chủ đề, tag, đoạn tóm tắt, ảnh).
- `posts/<slug>.md` — nội dung Markdown gốc của từng bài.
- `post/<slug>/index.html` — trang tĩnh riêng cho từng bài, có sẵn thẻ og để chia sẻ đẹp.
- `assets/images/` — ảnh đã tối ưu của các bài.

## Cách đăng bài mới

Chỉ chủ blog viết. Quy trình: gửi nội dung thô + 1 ảnh cho trợ lý → trợ lý soạn file Markdown, xử lý ảnh (thu về tối đa ~1600px, đổi WebP/JPEG chất lượng ~80, xóa EXIF, mục tiêu ≤ 350 KB/ảnh, báo cáo dung lượng trước/sau), tạo trang bài + cập nhật `posts.json` → chủ blog duyệt → đẩy lên repo → GitHub Pages tự cập nhật.
