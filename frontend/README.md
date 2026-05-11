# 🛒 ShopCart-Frontend
---

##  1. Hướng dẫn cài đặt & Khởi chạy

| Lệnh | Mục đích | Kết quả mong đợi |
| :--- | :--- | :--- |
| `npm install` | Cài đặt toàn bộ thư viện cần thiết (React, Vitest, Tailwind...) | Tạo thư mục `node_modules` chứa các gói phụ thuộc. |
| `npm run dev` | Khởi chạy môi trường phát triển (Local Development) | Web chạy tại `http://localhost:5173`, hỗ trợ Hot Reload khi sửa code. |

---

##  2. Quy trình Kiểm thử (Testing)

### 2.1 Unit & Integration Test (Vitest)
- **Lệnh:** `npm run test`
- **Mục đích:** Kiểm tra tính đúng đắn của các hàm logic (Utils) và các Component riêng lẻ. 
- **Đặc điểm:** Chạy ở chế độ *Watch Mode*, tự động kiểm tra lại mỗi khi mã nguồn thay đổi.
- Lệnh này dùng để test để kiểm tra Pass bao nhiêu, Fail bao nhiêu của 1 file

### 2.2 Độ bao phủ mã nguồn (Coverage Report)
- **Lệnh:** `npm run coverage`
- **Mục đích:** Đo lường tỉ lệ phần trăm mã nguồn đã được kiểm thử của toàn bộ file trong folder /src
- **Yêu cầu:** Đạt **≥ 80%** tổng số dòng code.
- **Lưu ý về kết quả**: Hệ thống được cấu hình để chỉ xuất báo cáo Coverage khi và chỉ khi toàn bộ bài test đạt trạng thái PASS. Nếu có lỗi logic tồn tại (FAIL), báo cáo sẽ không được khởi tạo. 
- **Báo cáo Vitest:** Xem tại thư mục `coverage/index.html`

### 2.3 End-to-End Test (Playwright)
- **Lệnh:** `npm run test:e2e`
- **Mục đích:** Giả lập hành vi người dùng thật trên trình duyệt (Chrome/Edge) để kiểm tra luồng mua hàng toàn diện (từ chọn hàng đến thanh toán).
- **Yêu cầu:** Playwright E2E tests chạy thành công trên ít nhất 2 trình duyệt 
- **Báo cáo Playwright:** Xem tại `playwright-report/index.html` 
---