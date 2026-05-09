package com.shopcart.repository;

import com.shopcart.entity.Cart;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

// Đổi từ Long thành Integer để khớp với Cart Entity mới
public interface CartRepository extends JpaRepository<Cart, Integer> { 
    Optional<Cart> findByUserId(Integer userId);
    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.userId = :userId")
    void deleteByUserId(Integer userId);
}