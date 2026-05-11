package com.shopcart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "categories") // Đảm bảo tên bảng khớp với SQL của bạn
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    // Nếu bạn muốn có mối quan hệ 1-nhiều với Product
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
}