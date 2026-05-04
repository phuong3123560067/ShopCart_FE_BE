package com.shopcart.dto;

import lombok.*;
import java.util.List;

@Data
@Builder // Bắt buộc có dòng này để hết lỗi đỏ .items()
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private List<OrderItemRequest> items;
    private Long shippingFee;
}