package com.shopcart.dto;

import lombok.*;
import java.util.List;

@Data
@Builder 
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Integer userId; // THÊM DÒNG NÀY ĐỂ HẾT LỖI getUserId()
    private List<OrderItemRequest> items;
    private Long shippingFee;
    private String shippingAddress;
    private String phoneNumber;
}