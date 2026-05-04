package com.shopcart.service;

import org.springframework.stereotype.Service;
import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.model.OrderStatus; // Import Enum của bạn

@Service
public class OrderService {

    public OrderResponse createOrder(OrderRequest request) {
        return OrderResponse.builder()
                .orderId("ORD-123")
                .status(OrderStatus.PENDING) // Đổi từ "PENDING" sang OrderStatus.PENDING
                .message("Đơn hàng đã được tạo thành công")
                .build();
    }
}