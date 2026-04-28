# 🛒 ShopCart-Frontend
---
- Áp dụng quy tắc TDD (viết test trước, viết code sau)
- FE làm việc trên Vs code
## Quy tắc đặt tên nhánh (Naming Convention)
- Tên nhánh nên phản ánh đúng chức năng hoặc câu hỏi mà các bạn đang làm.
- main: Nhánh chính, chỉ chứa code đã chạy ổn định và hoàn thiện.
- feature/ten-chuc-nang: Dùng khi phát triển tính năng mới.
- test/ten-chuc-nang: Dùng khi tập trung viết Unit Test cho một phần nào đó.
- fix/ten-loi: Dùng khi cần sửa lỗi gấp.
##  1. Hướng dẫn cài đặt & Khởi chạy

| Lệnh | Mục đích | Kết quả mong đợi |
| :--- | :--- | :--- |
| `npm install` | Cài đặt toàn bộ thư viện cần thiết (React, Vitest, Tailwind...) | Tạo thư mục `node_modules` chứa các gói phụ thuộc. |
| `npm run dev` | Khởi chạy môi trường phát triển (Local Development) | Web chạy tại `http://localhost:5173`, hỗ trợ Hot Reload khi sửa code. |

---

##  2. Quy trình Kiểm thử (Testing)
Theo thứ tự sau: Xong 2.1 ->2.2->2.3

### 2.1 Unit & Integration Test (Vitest)
- **Lệnh:** `npm run test`
- **Mục đích:** Kiểm tra tính đúng đắn của các hàm logic (Utils) và các Component riêng lẻ. 
- **Đặc điểm:** Chạy ở chế độ *Watch Mode*, tự động kiểm tra lại mỗi khi mã nguồn thay đổi.
- Lệnh này dùng để test để kiểm tra Pass bao nhiêu, Fail bao nhiêu của 1 file

### 2.2 Độ bao phủ mã nguồn (Coverage Report)
- **Lệnh:** `npm run coverage`
- **Mục đích:** Đo lường tỉ lệ phần trăm mã nguồn đã được kiểm thử của toàn bộ file trong folder /src
- **Yêu cầu:** Đạt **≥ 80%** tổng số dòng code (theo tiêu chí 8.2.1).
- **Lưu ý về kết quả**: Hệ thống được cấu hình để chỉ xuất báo cáo Coverage khi và chỉ khi toàn bộ bài test đạt trạng thái PASS. Nếu có lỗi logic tồn tại (FAIL), báo cáo sẽ không được khởi tạo. 
- **Báo cáo Vitest:** Xem tại thư mục `coverage/index.html` (theo tiêu chí 8.2.2)
- Trên project hiện tại có file example.test.ts, có thể chạy thử lệnh và xem thử kết quả.
### 2.3 End-to-End Test (Playwright)
- **Lệnh:** `npm run test:e2e`
- **Mục đích:** Giả lập hành vi người dùng thật trên trình duyệt (Chrome/Edge) để kiểm tra luồng mua hàng toàn diện (từ chọn hàng đến thanh toán).
- **Yêu cầu:** Playwright E2E tests chạy thành công trên ít nhất 2 trình duyệt (theo tiêu chí 8.2.3).
- **Báo cáo Playwright:** Xem tại `playwright-report/index.html` (theo tiêu chí 8.2.2)
---
##  3. Triển khai sau khi đã có link API chính thức từ BE
- Chạy các câu lệnh sau trước khi deloy

| Lệnh | Mục đích | Kết quả mong đợi |
| :--- | :--- | :--- |
| `npm run build` | Gom toàn bộ mã nguồn và tối ưu hóa dung lượng thành các file tĩnh để sẵn sàng đưa lên Hosting. | Tạo thư mục dist/ chứa sản phẩm cuối cùng đã được nén gọn. |
| `npm run preview` | Chạy thử sản phẩm sau khi đóng gói ngay tại máy cá nhân để kiểm tra lỗi trước khi triển khai thực tế. | Đảm bảo bản build hoạt động ổn định, không lỗi hiển thị hay đường dẫn. |
##  4. Hướng dẫn flow chuẩn cho code
**Tóm tắt sơ đồ luồng dữ liệu (Data Flow)**:
- Logic lõi (Utils) ➔ Giao tiếp API (Services) ➔ Giao diện (Components) ➔ Kiểm thử hệ thống (E2E)
- Có thể thiết kế giao diện (UI) sau khi xong giai đoạn 2
- **Giai đoạn 1**: Logic & Unit Test (Utils)
- Làm phần này đầu tiên để lấy điểm Câu 2.1 & 2.2 và đảm bảo Coverage ≥ 90%.

```
src/
├── utils/
│   ├── cartUtils.ts          <-- Viết logic validate & tính tổng Cart 
│   └── priceUtils.ts         <-- Viết logic tính giá Purchase (coupon, ship)
└── tests/
    ├── utils/
        ├── cartUtils.test.ts # [CÂU 2.1] Test logic validate và tính tổng
        └── priceUtils.test.ts# [CÂU 2.2] Test logic tính giá và coupon

```
- **Giai đoạn 2**: Giao tiếp & Giả lập (Services & Mocking)
- Làm phần này để giải quyết Câu 4.1 & 4.2.
- Tạo các dữ liệu giả của file index.ts trong folder mockData, để khi test chỉ cần gọi ra mà không cần tạo dữ liệu giả nhiều lần ở các file test khác nhau
```
src/
├── services/
│   ├── cartService.ts        # addToCart interface [cite: 65]
│   ├── orderService.ts       # createOrder interface [cite: 71]
│   └── inventoryService.ts   # checkStock interface [cite: 71]
└── tests/
    ├── mockData/
    ├── service/
        ├── cartService.test.ts      # [CÂU 4.1] Mock API cho Cart Service
        └── orderService.test.ts     # [CÂU 4.2] Mock API cho Order Service

```
- **Giai đoạn 3** Giao diện & Tích hợp (Components & Hooks)
- Làm phần này cho Câu 3.1 & 3.2. File này nhận dữ liệu từ Services và dùng Utils để hiển thị.
```
src/
├── components/
│   ├── Cart/
│   │   └── Cart.tsx          # Test rendering & user interactions [cite: 48]
│   ├── Checkout/
│       ├── CheckoutSummary.tsx # Test hiển thị dữ liệu giỏ hàng [cite: 56]
│       ├── PriceCalculator.tsx # Tính toán giá thời gian thực [cite: 57]
│       └── InventoryWarning.tsx# Cảnh báo khi sắp hết hàng 
│    
├── hooks/                    # Custom hooks để quản lý state giỏ hàng
└── tests/
    ├── components/
        ├── cart.integration.test.tsx      # Test Component + API Service 
        └── checkout.integration.test.tsx  # Test tích hợp Checkout components 
```   
- **Giai đoạn 4**: Automation (E2E)
- Làm sau cùng khi web đã chạy để giải quyết Câu 5.1 & 5.2.
```
├── e2e/
│   ├── pages/                # Page Object Model (POM) [cite: 80, 94]
│   │   ├── CartPage.ts
│   │   └── PurchasePage.ts
│   ├── cart.spec.ts          # Test add-to-cart flow & validation 
│   └── purchase.spec.ts      # Test checkout flow & tính giá [cite: 98, 99]
├── playwright.config.ts      # Cấu hình browsers: Chromium, Firefox, WebKit 
└── vitest.config.ts          # Cấu hình Vitest cho dự án [cite: 14]
```
🛠 Tóm tắt:
- src/utils/: Nhận "con số" (số lượng, giá gốc) để tính toán đúng/sai.
- src/services/: Nhận "yêu cầu" từ Component để gửi lên server qua Axios.
- src/components/: Nhận "kết quả" từ Services và dùng Utils để hiển thị giao diện cho người dùng.
- src/tests/: Nhận "toàn bộ logic" từ các folder trên để thực hiện kiểm thử.