package com.shopcart.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartResponse {
    private boolean success;
    private String message;
    private BigDecimal cartTotal;
    private int itemsCount;
    private BigDecimal discountAmount;
    private List<CartItemResponse> items;

}