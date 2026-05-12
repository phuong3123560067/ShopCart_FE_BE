## 🛒 ShopCart Backend - Hướng dẫn vận hành dự án
- **🛠️ 1. Các bước cài đặt**
- Java: 21
- DB: H2
## Tổng quan BE:

- **2. Các câu lệnh Maven quan trọng**

- **A. Khởi tạo và Kiểm tra (Initialization)Sử dụng khi mới clone dự án hoặc sau khi có thay đổi trong file pom.xml.**
- Lệnh: 
```
.\mvnw.cmd clean compile
```
- Giải thích: 
- * clean: Xóa thư mục target/ (dữ liệu build cũ).
- compile: Tải tất cả thư viện (dependencies) về máy và biên dịch mã nguồn.

- **B. Kiểm thử và Đo độ bao phủ (Testing & Coverage)**
- Chạy tất cả bài Test:
```
 .\mvnw.cmd test
```
- Giải thích: Chạy toàn bộ Unit Test (với JUnit 5 + Mockito) và Integration Test.
- Chạy Test và Xuất báo cáo Coverage
```
.\mvnw.cmd test jacoco:report
```
- Giải thích: Chạy test và kích hoạt plugin JaCoCo để đo độ bao phủ.
- Kết quả: Sau khi chạy xong, hãy mở file sau để xem báo cáo:target/site/jacoco/index.html (chuột phải chọn open in-> browser tại index.html để xem report bằng trình duyệt)
- Chạy một file Test cụ thể:
```
.\mvnw.cmd test -Dtest=CartServiceTest
```
- Giải thích: Chỉ chạy các bài test trong một file duy nhất để tiết kiệm thời gian khi đang sửa logic.

- **C. Vận hành và Đóng gói (Running & Packaging)Chạy Server Backend:**
```
.\mvnw.cmd spring-boot:run
```
- Giải thích: Khởi động ứng dụng tại cổng mặc định (port 3000). 
http://localhost:3000
- **3. Cách test trực tiếp trên Postman**
- chạy lệnh 
```
.\mvnw.cmd spring-boot:run và mở postman
```


| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Đăng ký tài khoản |
| **POST** | `/api/auth/login` | Đăng nhập |
2. Nhóm Sản phẩm (Product API)

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/products` | Lấy danh sách sản phẩm(Customer) |
| **GET** | `/api/products/{id}` | Xem chi tiết sản phẩm(Customer) |
| **PUT** | `/api/products/{id}` | Cập nhật thông tin(Admin): Thay đổi status thành Inactive để test case: "Không thể thêm sản phẩm ngừng kinh doanh vào giỏ" |

3. Nhóm Giỏ hàng (Cart API) & Khuyến mãi – Phục vụ Câu 2.1 & 3.1
- 3.1. Nhóm Giỏ hàng (Cart API)

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/cart/add` | Thêm vào giỏ (Xử lý cộng dồn & kiểm kho)  |
| **GET** | `/api/cart` | Xem nội dung giỏ hàng |
| **PUT** | `/api/cart/update` | Cập nhật số lượng sản phẩm |
| **DELETE** | `/api/cart/remove/{id}` | Xóa sản phẩm khỏi giỏ |
| **POST** | `/api/cart/apply-coupon` | Customer gọi để sử dụng mã :Áp dụng mã giảm giá vào giỏ( Kiểm tra expiry_date, usage_limit. Trả về discount_amount để hiển thị tạm tính.)|
| **DELETE** | `/api/cart/coupon` | Hủy áp dụng mã |

4. Nhóm Đơn hàng & Mua hàng (Order API) 

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/orders` | Tạo đơn hàng (Trừ tồn kho) |
| **GET** | `/api/orders/{id}` | Xem chi tiết 1 đơn hàng |
5. Nhóm Kho hàng (Inventory API)

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/inventory/{product_id}` | Kiểm tra số lượng tồn kho còn lại   |
|**PUT** | `/api/inventory/{product_id}` | Cập nhật số lượng kho(Tạo điều kiện: Chỉnh kho về 0 để test case: "khi hết hàng" )  |
