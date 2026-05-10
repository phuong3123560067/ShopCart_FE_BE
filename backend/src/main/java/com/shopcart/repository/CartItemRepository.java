package com.shopcart.repository;
import com.shopcart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);
    List<CartItem> findByCartId(Integer cartId);
    void deleteByCartId(Integer cartId);
}