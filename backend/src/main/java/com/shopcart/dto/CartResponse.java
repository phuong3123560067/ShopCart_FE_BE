package com.shopcart.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse { // Đảm bảo CÓ từ khóa 'class' ở đây
    private boolean success;
    private String message;
    private Double cartTotal;
    private Double discountAmount;
    private Integer itemsCount;
    private BigDecimal price;
    private String productName;
    private Integer quantity;
}