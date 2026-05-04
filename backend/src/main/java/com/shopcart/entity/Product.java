package com.shopcart.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor 
@NoArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private BigDecimal price;
    
    private String description;
    
    private Long categoryId;

    // Bạn nên chọn một trong hai tên: inventoryQuantity hoặc stock để tránh nhầm lẫn
    @Column(name = "inventory_quantity")
    private Integer inventoryQuantity;

    // HÀM KHỞI TẠO PHẢI NẰM TRONG CẶP NGOẶC NHỌN CỦA CLASS
    public Product(Long id, String name, Long price, Integer inventoryQuantity) {
        this.id = id;
        this.name = name;
        this.price = java.math.BigDecimal.valueOf(price);
        this.inventoryQuantity = inventoryQuantity;
    }
    // Thêm constructor nhận BigDecimal để linh hoạt hơn
    public Product(Long id, String name, BigDecimal price, Integer inventoryQuantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.inventoryQuantity = inventoryQuantity;
    }
}