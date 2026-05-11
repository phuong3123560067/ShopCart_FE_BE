package com.shopcart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shopcart.entity.Coupon;

@Repository 
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    // JpaRepository đã bao gồm sẵn hàm save(), findAll(), findById(),...
    Optional<Coupon> findByCode(String code);
}