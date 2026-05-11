package com.shopcart.repository;

import com.shopcart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Tìm các sản phẩm có status là Active để hiển thị cho khách hàng
    List<Product> findByStatus(String status);
}