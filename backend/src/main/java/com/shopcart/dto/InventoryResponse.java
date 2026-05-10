package com.shopcart.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    private Integer productId;
    private String productName;
    private Integer stock;
    private String status;
}