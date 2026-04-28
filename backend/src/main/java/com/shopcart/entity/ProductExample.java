package com.shopcart.entity;
import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class ProductExample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private Long categoryId;
    private Integer inventoryQuantity;
}