package com.shopcart.controller;

import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse;
import com.shopcart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private static final Integer TEST_USER_ID = 1; 

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody CartItemRequest request) {
        CartResponse response = cartService.addToCart(TEST_USER_ID, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestHeader(value = "Authorization", required = false) String token) {
        return ResponseEntity.ok(cartService.getCartResponse(TEST_USER_ID));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateQuantity(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(TEST_USER_ID, request));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Integer productId) { // Đổi PathVariable sang Integer        
        return ResponseEntity.ok(cartService.removeFromCart(TEST_USER_ID, productId));
    }

    @PostMapping("/apply-coupon")
    public ResponseEntity<CartResponse> applyCoupon(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam String couponCode) {       
        return ResponseEntity.ok(cartService.applyCoupon(TEST_USER_ID, couponCode));
    }

    @DeleteMapping("/coupon")
    public ResponseEntity<CartResponse> removeCoupon(
            @RequestHeader(value = "Authorization", required = false) String token) {       
        return ResponseEntity.ok(cartService.removeCoupon(TEST_USER_ID));
    }
}