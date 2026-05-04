package com.shopcart.service;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.model.OrderStatus;

@ExtendWith(MockitoExtension.class) // Dùng Mockito thuần, không load Spring giúp test chạy cực nhanh
class OrderServiceTest {

    @InjectMocks
    private OrderService orderService; // Thổi code thật vào để test

    @Test
    @DisplayName("Nâng coverage cho hàm createOrder")
    void testCreateOrderLogic() {
        // 1. Chuẩn bị dữ liệu
        OrderRequest request = new OrderRequest();
        
        // 2. Chạy hàm thật
        OrderResponse response = orderService.createOrder(request);
        
        // 3. Kiểm tra kết quả để đảm bảo logic đúng
        assertNotNull(response);
        assertEquals(OrderStatus.PENDING, response.getStatus());
        assertEquals("ORD-123", response.getOrderId());
    }
}