package com.shopcart.dto;

import com.shopcart.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderId;
    private OrderStatus status; // Kiểu Enum thay vì String
    private String message;
    private Long totalPrice; // Thêm trường này nếu Test yêu cầu
}