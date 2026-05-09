-- 1. Tạm thời tắt kiểm tra khóa ngoại để xóa dữ liệu sạch sẽ
SET REFERENTIAL_INTEGRITY FALSE;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET REFERENTIAL_INTEGRITY TRUE;

-- 2. Chèn dữ liệu vào bảng cha (categories)
INSERT INTO categories (id, name) VALUES (1, 'Laptop');
INSERT INTO categories (id, name) VALUES (2, 'Smartphone');
INSERT INTO categories (id, name) VALUES (3, 'Accessories'); 

-- 3. Chèn dữ liệu vào bảng con (products)
INSERT INTO products (product_id, name, price, description, category_id, stock, status) 
VALUES (1, 'Dell G15', 25000000, 'Máy tính mới', 1, 50, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status) 
VALUES (2, 'iPhone 16 Pro', 32000000, 'Điện thoại Apple cao cấp', 2, 40, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status) 
VALUES (3, 'Tai nghe Sony WH-1000XM5', 8500000, 'Tai nghe chống ồn', 3, 100, 'Active');

INSERT INTO products (product_id, name, price, description, category_id, stock, status)
VALUES (4, 'Chuột Logitech G Pro', 1250000, 'Chuột gaming', 3, 80, 'Active');