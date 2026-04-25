# 🛒 ShopCart Project - Hệ Thống Quản Lý Giỏ Hàng
---

## 📁 Cấu trúc Dự án (Project Structure)

Dự án được chia thành hai phần chính:

* **`Frontend/`**: Xây dựng bằng React, Vite, Tailwind CSS và Vitest.
* **`Backend/`**: Xây dựng bằng Spring Boot 3.x, PostgreSQL và JUnit 5.

---
## Quy tắc đặt tên nhánh (Naming Convention)
- Tên nhánh nên phản ánh đúng chức năng hoặc câu hỏi mà các bạn đang làm.
- main: Nhánh chính, chỉ chứa code đã chạy ổn định và hoàn thiện.
- feature/ten-chuc-nang: Dùng khi phát triển tính năng mới.
- test/ten-chuc-nang: Dùng khi tập trung viết Unit Test cho một phần nào đó.
- fix/ten-loi: Dùng khi cần sửa lỗi gấp.

## 🛠 Hướng dẫn truy cập và khởi chạy

Tùy thuộc vào phần bạn muốn làm việc, hãy di chuyển vào thư mục tương ứng: Mở folder frontend hoặc folder backend để làm

### 1. Phía Giao diện (Frontend) làm việc trên vs code
Xem hướng dẫn chi tiết về Testing và cấu trúc FE nằm trong file README.md trong folder frontend

### 2. Phía Máy chủ (Backend)
Xem hướng dẫn chi tiết về Testing và cấu trúc BE nằm trong file README.md trong folder backend
- Dependencies:
- Spring Web (Làm REST API)
- Spring Data JPA (Làm việc với DB)
- PostgreSQL Driver (DB chính)
- H2 Database (Để chạy Unit Test cho nhanh)
- Lombok (Để code gọn hơn, không phải viết Getter/Setter)
- Spring Security (Bảo mật)
- Validation (Để check dữ liệu đầu vào)
- Cài đặt Postman trên web và tạo tài khoản
- Backend sẽ sử dung H2 để có dữ liệu ảo mà không lưu vào DB để tiện cho test, PostgreSQL hiện tại sẽ tạm chưa được kết nối vào.
---

## 👥 Thành viên nhóm và Phân công (Waiting)

---

## 📝 Ghi chú chung
- **Database**: Sử dụng PostgreSQL (Cấu hình trong `application.properties` của Backend).
- **Security**: Hệ thống sử dụng JWT để xác thực giữa FE và BE.
- **CI/CD**: Toàn bộ dự án được kiểm tra tự động qua GitHub Actions mỗi khi có code mới được đẩy lên.