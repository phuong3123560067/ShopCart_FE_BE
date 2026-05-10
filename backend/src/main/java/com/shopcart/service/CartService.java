package com.shopcart.service;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartItemResponse;
import com.shopcart.dto.CartResponse;
import com.shopcart.entity.Cart;
import com.shopcart.entity.CartItem;
import com.shopcart.entity.Product;
import com.shopcart.repository.CartItemRepository;
import com.shopcart.repository.CartRepository;
import com.shopcart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor // Tự động tạo Constructor cho các final field (thay @Autowired)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public CartResponse getCartResponse(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            return cartRepository.save(newCart);
        });

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product p = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + item.getProductId()));
            
            BigDecimal subTotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(subTotal);

            itemResponses.add(CartItemResponse.builder()
                    .productId(p.getId())
                    .productName(p.getName())
                    .price(p.getPrice())
                    .quantity(item.getQuantity())
                    .subTotal(subTotal)
                    .build());
        }

        return CartResponse.builder()
                .success(true)
                .message("Lấy thông tin giỏ hàng thành công")
                .cartTotal(total)
                .itemsCount(itemResponses.size())
                .items(itemResponses)
                .discountAmount(BigDecimal.ZERO)
                .build();
    }

    @Transactional // Thêm Transactional để đảm bảo tính toàn vẹn dữ liệu
    public CartResponse addToCart(Integer userId, CartItemRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng không hợp lệ");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Kiểm tra tồn kho (Nên cộng dồn cả số lượng đang có trong giỏ để kiểm tra)
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCartId(cart.getId());
                    newItem.setProductId(product.getId());
                    newItem.setQuantity(0);
                    return newItem;     
                });

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        if (product.getStock() < newQuantity) {
            throw new RuntimeException("Không đủ tồn kho. Hiện có: " + product.getStock());
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        CartResponse response = getCartResponse(userId);
        response.setMessage("Đã thêm " + product.getName() + " vào giỏ hàng");
        return response;
    }

    @Transactional
    public CartResponse updateQuantity(Integer userId, CartItemRequest req) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Lỗi giỏ hàng"));
                
        CartItem ci = cartItemRepository.findByCartIdAndProductId(cart.getId(), req.getProductId())
                .orElseThrow(() -> new RuntimeException("Không có sản phẩm trong giỏ"));

        if (req.getQuantity() <= 0) {
            cartItemRepository.delete(ci);
        } else {
            // Kiểm tra stock trước khi update
            Product p = productRepository.findById(req.getProductId()).get();
            if (p.getStock() < req.getQuantity()) throw new RuntimeException("Không đủ tồn kho");
            
            ci.setQuantity(req.getQuantity());
            cartItemRepository.save(ci);
        }

        CartResponse response = getCartResponse(userId);
        response.setMessage("Cập nhật thành công");
        return response;
    }

    @Transactional
    public CartResponse removeFromCart(Integer userId, Integer productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        cartItemRepository.delete(item);

        CartResponse response = getCartResponse(userId);
        response.setMessage("Xóa sản phẩm thành công");
        return response;
    }

    public CartResponse applyCoupon(Integer userId, String code) {
        CartResponse res = getCartResponse(userId);
        BigDecimal total = res.getCartTotal();
        
        BigDecimal discount = BigDecimal.ZERO;
        if ("GIAM500K".equals(code) && total.compareTo(new BigDecimal("1000000")) >= 0) {
            discount = new BigDecimal("500000");
        }

        // Đảm bảo cartTotal sau giảm giá không âm
        BigDecimal finalTotal = total.subtract(discount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) finalTotal = BigDecimal.ZERO;

        res.setDiscountAmount(discount);
        res.setCartTotal(finalTotal);
        res.setMessage(discount.compareTo(BigDecimal.ZERO) > 0 ? "Áp dụng mã thành công" : "Mã không khả dụng");
        return res;
    }

    public CartResponse removeCoupon(Integer userId) {
        CartResponse res = getCartResponse(userId);
        res.setDiscountAmount(BigDecimal.ZERO);
        res.setMessage("Đã hủy mã giảm giá");
        return res;
    }

    public void checkout(Integer cartId) {
        if (cartItemRepository.findByCartId(cartId).isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống, không thể thanh toán");
        }
    }
}