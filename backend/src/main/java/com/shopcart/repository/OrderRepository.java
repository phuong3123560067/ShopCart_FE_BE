package com.shopcart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shopcart.entity.Order; // Đảm bảo bạn đã tạo Entity Order

@Repository
// Sửa Long -> Integer
public interface OrderRepository extends JpaRepository<Order, Integer> {
}