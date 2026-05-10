package com.shopcart.repository;

import com.shopcart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Để trống ở đây, Spring Boot tự lo hết
}