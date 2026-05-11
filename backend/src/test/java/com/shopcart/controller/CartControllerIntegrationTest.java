package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse;
import com.shopcart.service.CartService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Cart Controller Integration Tests - Full Coverage")
class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    @Autowired
    private ObjectMapper objectMapper;

    // --- PHẦN 1: SECURITY TESTS (Đã có của bạn) ---

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Security: Customer thêm sản phẩm thành công")
    void testAddToCart_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).message("Added").build();
        when(cartService.addToCart(any(), any(CartItemRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/cart/add")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\": 1, \"quantity\": 1}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Security: Admin bị chặn (403)")
    void testAddToCart_AsAdmin_Forbidden() throws Exception {
        mockMvc.perform(post("/api/cart/add")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\": 1, \"quantity\": 1}"))
                .andExpect(status().isForbidden());
    }

    // --- PHẦN 2: LOGIC TESTS (Bổ sung để tăng Coverage) ---

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Logic: Lấy thông tin giỏ hàng (GET)")
    void testGetCart_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).build();
        when(cartService.getCartResponse(any())).thenReturn(mockResponse);

        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Logic: Cập nhật số lượng (PUT)")
    void testUpdateQuantity_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).message("Updated").build();
        when(cartService.updateQuantity(any(), any(CartItemRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(put("/api/cart/update")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\": 1, \"quantity\": 5}"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Logic: Xóa sản phẩm khỏi giỏ (DELETE)")
    void testRemoveFromCart_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).build();
        when(cartService.removeFromCart(any(), anyInt())).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/cart/remove/1")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Logic: Áp dụng mã giảm giá")
    void testApplyCoupon_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).message("Coupon applied").build();
        when(cartService.applyCoupon(any(), anyString())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/cart/apply-coupon")
                        .param("couponCode", "DISCOUNT10")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Logic: Hủy mã giảm giá (DELETE)")
    void testRemoveCoupon_Success() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).message("Coupon removed").build();
        when(cartService.removeCoupon(any())).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/cart/coupon")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    // --- PHẦN 3: EDGE CASES (Trường hợp biên) ---

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Edge Case: Thêm sản phẩm nhưng thiếu Body")
    void testAddToCart_BadRequest() throws Exception {
        mockMvc.perform(post("/api/cart/add")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("")) // Body trống
                .andExpect(status().isBadRequest());
    }
}