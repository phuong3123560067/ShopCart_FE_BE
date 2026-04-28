package com.shopcart.repository;

import com.shopcart.entity.ProductExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepositoryExample extends JpaRepository<ProductExample, Long> {
    // Để trống ở đây, Spring Boot tự lo hết
}