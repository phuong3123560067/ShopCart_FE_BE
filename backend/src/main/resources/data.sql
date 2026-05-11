-- data.sql
SET REFERENTIAL_INTEGRITY FALSE;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE roles;
TRUNCATE TABLE users;
SET REFERENTIAL_INTEGRITY TRUE;

INSERT INTO categories (id, name) VALUES (1, 'Laptop');
INSERT INTO categories (id, name) VALUES (2, 'Smartphone');
INSERT INTO categories (id, name) VALUES (3, 'Accessories');

-- data.sql
INSERT INTO roles (role_id, role_name) VALUES (1, 'ADMIN');
INSERT INTO roles (role_id, role_name) VALUES (2, 'CUSTOMER');

INSERT INTO users (email, password, full_name, role_id)
VALUES ('admin@shopcart.com', 'admin123', 'System Administrator', 1);

INSERT INTO users (email, password, full_name, role_id)
VALUES ('user@gmail.com', 'user123', 'Nguyen Van A', 2);

-- Chú ý: Thêm .00 vào giá tiền để khớp với BigDecimal trong Java
INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (1, 'Dell G15', 25000000.00, 'Máy tính mới', 1, 50, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (2, 'iPhone 16 Pro', 32000000.00, 'Điện thoại Apple cao cấp', 2, 40, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (3, 'Tai nghe Sony WH-1000XM5', 8500000.00, 'Tai nghe chống ồn', 3, 100, 'Active');

-- Chèn 50 user mẫu để test
-- data.sql
SET REFERENTIAL_INTEGRITY FALSE;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE roles;
TRUNCATE TABLE users;
SET REFERENTIAL_INTEGRITY TRUE;

INSERT INTO categories (id, name) VALUES (1, 'Laptop');
INSERT INTO categories (id, name) VALUES (2, 'Smartphone');
INSERT INTO categories (id, name) VALUES (3, 'Accessories');

-- data.sql
INSERT INTO roles (role_id, role_name) VALUES (1, 'ADMIN');
INSERT INTO roles (role_id, role_name) VALUES (2, 'CUSTOMER');

INSERT INTO users (email, password, full_name, role_id)
VALUES ('admin@shopcart.com', 'admin123', 'System Administrator', 1);

INSERT INTO users (email, password, full_name, role_id)
VALUES ('user@gmail.com', 'user123', 'Nguyen Van A', 2);

-- Chú ý: Thêm .00 vào giá tiền để khớp với BigDecimal trong Java
INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (1, 'Dell G15', 25000000.00, 'Máy tính mới', 1, 50, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (2, 'iPhone 16 Pro', 32000000.00, 'Điện thoại Apple cao cấp', 2, 40, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (3, 'Tai nghe Sony WH-1000XM5', 8500000.00, 'Tai nghe chống ồn', 3, 100, 'Active');

-- Chèn 50 user mẫu để test
INSERT INTO users (email, password, full_name, role_id)
SELECT
    'user' || seq || '@gmail.com',
    'user123',
    'Test User ' || seq,
    2
FROM system_range(1, 50) AS t(seq);

-- Đảm bảo sản phẩm có đủ số lượng lớn để không bị báo hết hàng (Stock) khi 50 user cùng mua
UPDATE products SET stock = 100000 WHERE product_id = 1;