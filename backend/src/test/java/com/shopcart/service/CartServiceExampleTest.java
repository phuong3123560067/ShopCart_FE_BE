/*package com.shopcart.service;

import com.shopcart.entity.ProductExample;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CartServiceExampleTest {

    // Khởi tạo service để test
    CartServiceExample cartService = new CartServiceExample();

    @Test
    void testAddToCart_Success() {
        // Giả lập sản phẩm có 10 cái, mua 2 cái -> Thành công
        ProductExample p = new ProductExample(1L, "Laptop", 10);
        String result = cartService.addToCart(p, 2);
        assertEquals("SUCCESS", result);
    }

    @Test
    void testAddToCart_OutOfStock() {
        // Giả lập sản phẩm có 1 cái, mua 5 cái -> Báo lỗi hết hàng
        ProductExample p = new ProductExample(2L, "Chuột", 1);
        String result = cartService.addToCart(p, 5);
        assertEquals("ERROR_OUT_OF_STOCK", result);
    }

    @Test
    void testAddToCart_NotFound() {
        // Giả lập không tìm thấy sản phẩm (null) -> Báo lỗi không tồn tại
        String result = cartService.addToCart(null, 1);
        assertEquals("ERROR_NOT_FOUND", result);
    }
}*/