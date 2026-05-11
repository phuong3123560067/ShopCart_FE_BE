package com.shopcart.controller;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse;
import com.shopcart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(Authentication authentication, @RequestBody CartItemRequest request) {
        // Chỉ truyền authentication xuống, Service sẽ tự biết user là ai
        return ResponseEntity.ok(cartService.addToCart(authentication, request));
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCartResponse(authentication));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateQuantity(Authentication authentication, @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(authentication, request));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(Authentication authentication, @PathVariable Integer productId) {
        return ResponseEntity.ok(cartService.removeFromCart(authentication, productId));
    }

    @PostMapping("/apply-coupon")
    public ResponseEntity<CartResponse> applyCoupon(Authentication authentication, @RequestParam String couponCode) {
        return ResponseEntity.ok(cartService.applyCoupon(authentication, couponCode));
    }

    @DeleteMapping("/coupon")
    public ResponseEntity<CartResponse> removeCoupon(Authentication authentication) {
        return ResponseEntity.ok(cartService.removeCoupon(authentication));
    }
}