## 🛒 ShopCart Backend - Hướng dẫn vận hành dự án
- **🛠️ 1. Các bước cài đặt**
- Sử dụng IntelliJ IDEA cho BE
- Java: 21
- Không cần tải spring boot vì pom.xml đã có đủ
- DB: PostgreSQL

## Quy tắc đặt tên nhánh (Naming Convention)
- Tên nhánh nên phản ánh đúng chức năng hoặc câu hỏi mà các bạn đang làm.
- main: Nhánh chính, chỉ chứa code đã chạy ổn định và hoàn thiện.
- feature/ten-chuc-nang: Dùng khi phát triển tính năng mới.
- test/ten-chuc-nang: Dùng khi tập trung viết Unit Test cho một phần nào đó.
- fix/ten-loi: Dùng khi cần sửa lỗi gấp.
## Tổng quan BE:
```
\-- backend/
    +-- src/
    |   +-- main/java/com/shopcart/
    |   |   +-- config/         -- [Spring Security, WebConfig]
    |   |   +-- controller/     -- [Nhận Request, trả Response]
    |   |   +-- service/        -- [Xử lý logic nghiệp vụ]
    |   |   +-- repository/     -- [Truy vấn Database]
    |   |   +-- entity/         -- [Ánh xạ bảng Database]
    |   |   +-- dto/            -- [Dữ liệu trao đổi với Front-end]
    |   |   +-- mapper/         -- [Chuyển đổi Entity <-> DTO]
    |   |   +-- exception/      -- [Xử lý lỗi hệ thống]
    |   +-- main/resources/
    |   |   +-- application.properties
    |   |   +-- data.sql        -- [Nạp dữ liệu mẫu cho H2]
    |   +-- test/java/com/shopcart/ -- [Vị trí đặt Mock và Unit Test]
```
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
- Đây là phần quan trọng nhất để đạt điểm cho Câu 2, 3, 4 trong đồ án
- Chạy tất cả bài Test:
```
 .\mvnw.cmd test
```
- Giải thích: Chạy toàn bộ Unit Test (với JUnit 5 + Mockito) và Integration Test.
- Chạy Test và Xuất báo cáo Coverage (Mục tiêu ≥ 85%):
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


- **4. Khi triển khai (Deploy)**
- Đóng gói sản phẩm (Build JAR):
```
.\mvnw.cmd clean package
```
- Giải thích: Tạo ra file .jar hoàn chỉnh để triển khai.
- Lưu ý: Lệnh này sẽ tự động chạy toàn bộ Test. Nếu có bất kỳ bài Test nào thất bại, Maven sẽ dừng quá trình đóng gói để đảm bảo an toàn.

- Trong file hiện có test mẫu, gõ câu lệnh sau để xem: 
```
.\mvnw.cmd test -Dtest=CartServiceExampleTest
```
- **5. Quy trình đề xuất cho thành viên Team**
- Để đảm bảo chất lượng code trước khi đẩy lên Git, các bạn nên thực hiện theo thứ tự:
```
mvn clean compile (Kiểm tra lỗi cú pháp).
mvn test (Đảm bảo logic đúng).
mvn jacoco:report (Kiểm tra xem đã đạt 85% coverage chưa)
```
- Cách dùng Lombok cực nhanh 
- Thay vì viết 50 dòng code, bảo các bạn chỉ cần thêm 3 dòng này trên đầu mỗi Class trong folder entity:
- @Data: Tự tạo Getter, Setter, toString, equals. 
- @NoArgsConstructor: Tạo constructor không tham số (Bắt buộc cho Hibernate). 
- @AllArgsConstructor: Tạo constructor đầy đủ tham số (Cực tiện khi viết Unit Test ở Câu 2).
- **6. Danh sách các API cần thiết để khớp với FE (Flow)**
1. Nhóm Xác thực (Auth API) – Phục vụ Câu 6.2 (Security) (Role: Admin, Customer)

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

- Lưu ý: Các API từ mục 2, 3, 4 bắt buộc phải đi kèm Token sau khi đăng nhập để chấm điểm Security Testing (Câu 6.2)
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
- 3.2. Khuyến mãi

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/coupons` | Tạo mã giảm giá mới(Dành cho quyền Admin để tạo "hiện trường" giả (mã hết lượt dùng, mã hợp lệ, mã không hợp lệ)) |
4. Nhóm Đơn hàng & Mua hàng (Order API) – Phục vụ Câu 2.2 & 3.2

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/orders` | Tạo đơn hàng (Trừ tồn kho) |
| **GET** | `/api/orders/{id}` | Xem chi tiết 1 đơn hàng |
5. Nhóm Kho hàng (Inventory API) – Phục vụ Câu 3.2.b

| Method | API Endpoint | Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/inventory/{productId}` | Kiểm tra số lượng tồn kho còn lại   |
|**PUT** | `/api/inventory/{productId}` | Cập nhật số lượng kho(Tạo điều kiện: Chỉnh kho về 0 để test case: "khi hết hàng" )  |
- **6.1. Luồng dữ liệu chuẩn (Flow)**
- Lưu ý kỹ thứ tự nhận dữ liệu này để không viết sai file:
- Request: Postman gửi JSON {"productId": 1, "quantity": 2}.
- DTO: CartRequestDTO nhận đống JSON đó ở tầng Controller.
- Service: Controller chuyển DTO này sang Service.
- Mapper: Service dùng Mapper đổi DTO thành Entity CartItem.
- Repository: Service gọi Repository lưu Entity vào Database.
- Response: Quay ngược lại, Service đổi Entity thành CartResponseDTO để trả về cho Front-end.
- **6.2. Thứ tự code**
- GIAI ĐOẠN 1: Xây dựng Core & API Sản phẩm (Lấy gốc)
- Mục tiêu: Thông tuyến từ Database lên API. Làm tiền đề để FE lấy danh sách sản phẩm.
- Các file cần có:
Cấu trúc dự án GĐ 1:
```
src/main/java/com/shopcart/
├── 📂 entity/        --> [Product.java]
├── 📂 repository/    --> [ProductRepository.java]
├── 📂 dto/           --> [ProductDTO.java]
└── 📂 controller/    --> [ProductController.java]
src/main/resources/
└── data.sql          --> [Lệnh INSERT sản phẩm mẫu]
```
- GIAI ĐOẠN 2: Logic Giỏ hàng & Unit Test (Giải quyết Câu 2 & 5)
- Mục tiêu: Xử lý nghiệp vụ thêm/sửa/xóa giỏ hàng và viết Test ngay.
- Cấu trúc dự án GĐ 2:

```
src/main/java/com/shopcart/
├── 📂 service/       --> [CartService.java]
└── 📂 controller/    --> [CartController.java]
src/test/java/com/shopcart/
└── 📂 service/       --> [CartServiceTest.java] <-- (Nơi đặt Mock @Mock)
```
- GIAI ĐOẠN 3: Đặt hàng & Integration Test (Giải quyết Câu 3 & 4)
Mục tiêu: Xử lý thanh toán, trừ tồn kho và test toàn diện API bằng MockMvc.
Cấu trúc dự án GĐ 3:
```
src/main/java/com/shopcart/
├── 📂 service/       --> [OrderService.java]
└── 📂 controller/    --> [OrderController.java]
src/test/java/com/shopcart/
└── 📂 controller/    --> [OrderControllerIntegrationTest.java] <-- (Dùng @MockBean)
```
