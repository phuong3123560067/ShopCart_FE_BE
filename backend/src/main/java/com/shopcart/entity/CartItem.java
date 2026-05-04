package com.shopcart.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@AllArgsConstructor // Tạo Constructor: CartItem(String userId, Long productId, String productName, int quantity)
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String userId;
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal price;

    // Constructor bổ sung để khớp với Listing 2 trong hình
    public CartItem(String userId, Long productId, String productName, BigDecimal price, Integer quantity) {
        this.userId = userId;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }
}