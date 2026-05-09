package com.shopcart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer id;

    @Column(name = "product_id")
    private Integer productId;

    private Integer quantity;

    @Column(name = "price_at_purchase")
    private BigDecimal priceAtPurchase; // Giá tại thời điểm mua[cite: 9]
}