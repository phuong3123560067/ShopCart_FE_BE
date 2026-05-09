package com.shopcart.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "final_price")
    private BigDecimal finalPrice; // Giá sau khi trừ coupon và cộng ship[cite: 9]

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    private String status = "Pending";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderDetail> details;
}