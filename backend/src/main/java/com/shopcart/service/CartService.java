package com.shopcart.service;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartItemResponse;
import com.shopcart.dto.CartResponse;
import com.shopcart.entity.Cart;
import com.shopcart.entity.CartItem;
import com.shopcart.entity.Product;
import com.shopcart.entity.User;
import com.shopcart.repository.CartItemRepository;
import com.shopcart.repository.CartRepository;
import com.shopcart.repository.ProductRepository;
import com.shopcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    // Hàm bổ trợ lấy UserId từ Authentication để dùng cho các logic dưới
    private Integer getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getUserId();
    }

    public CartResponse getCartResponse(Authentication authentication) {
        Integer userId = getUserIdFromAuth(authentication);
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

    @Transactional
    public CartResponse addToCart(Authentication authentication, CartItemRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng không hợp lệ");
        }

        Integer userId = getUserIdFromAuth(authentication);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(new CartItem(null, cart.getId(), product.getId(), 0));

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        if (product.getStock() < newQuantity) {
            throw new RuntimeException("Không đủ tồn kho. Hiện có: " + product.getStock());
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        CartResponse response = getCartResponse(authentication);
        response.setMessage("Đã thêm " + product.getName() + " vào giỏ hàng");
        return response;
    }

    @Transactional
    public CartResponse updateQuantity(Authentication authentication, CartItemRequest req) {
        Integer userId = getUserIdFromAuth(authentication);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Lỗi giỏ hàng"));

        CartItem ci = cartItemRepository.findByCartIdAndProductId(cart.getId(), req.getProductId())
                .orElseThrow(() -> new RuntimeException("Không có sản phẩm trong giỏ"));

        if (req.getQuantity() <= 0) {
            cartItemRepository.delete(ci);
        } else {
            Product p = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            if (p.getStock() < req.getQuantity()) throw new RuntimeException("Không đủ tồn kho");

            ci.setQuantity(req.getQuantity());
            cartItemRepository.save(ci);
        }

        CartResponse response = getCartResponse(authentication);
        response.setMessage("Cập nhật thành công");
        return response;
    }

    @Transactional
    public CartResponse removeFromCart(Authentication authentication, Integer productId) {
        Integer userId = getUserIdFromAuth(authentication);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        cartItemRepository.delete(item);

        CartResponse response = getCartResponse(authentication);
        response.setMessage("Xóa sản phẩm thành công");
        return response;
    }

    public CartResponse applyCoupon(Authentication authentication, String code) {
        CartResponse res = getCartResponse(authentication);
        BigDecimal total = res.getCartTotal();

        BigDecimal discount = BigDecimal.ZERO;
        if ("GIAM500K".equals(code) && total.compareTo(new BigDecimal("1000000")) >= 0) {
            discount = new BigDecimal("500000");
        }

        BigDecimal finalTotal = total.subtract(discount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) finalTotal = BigDecimal.ZERO;

        res.setDiscountAmount(discount);
        res.setCartTotal(finalTotal);
        res.setMessage(discount.compareTo(BigDecimal.ZERO) > 0 ? "Áp dụng mã thành công" : "Mã không khả dụng");
        return res;
    }

    public CartResponse removeCoupon(Authentication authentication) {
        CartResponse res = getCartResponse(authentication);
        res.setDiscountAmount(BigDecimal.ZERO);
        res.setMessage("Đã hủy mã giảm giá");
        return res;
    }


    public void checkout(Authentication authentication) {
        Integer userId = getUserIdFromAuth(authentication);
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        if (cartItemRepository.findByCartId(cart.getId()).isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống, không thể thanh toán");
        }

    }
}