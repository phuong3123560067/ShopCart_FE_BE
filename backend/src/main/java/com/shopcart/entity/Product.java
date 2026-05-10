package com.shopcart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "stock", nullable = false)
    private Integer stock;
    @Builder.Default
    private String status = "Active";

    @Column(name = "image_url")
    private String imageUrl;

    // Quan hệ ManyToOne phải đi kèm với biến category như thế này:
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Constructor tùy chỉnh (nếu cần cho Test)
    public Product(Integer id, String name, BigDecimal price, Integer stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.status = "Active";
    }
}