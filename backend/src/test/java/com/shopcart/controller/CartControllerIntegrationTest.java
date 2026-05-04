package com.shopcart.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.CartItemRequest;
import com.shopcart.dto.CartResponse;
import com.shopcart.service.CartService;

import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
// Thêm import cho get và delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*; 
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(CartController.class)
@DisplayName("Cart API Integration Tests")
class CartControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private CartService cartService;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        @WithMockUser
        @DisplayName("POST /api/cart/add - Thêm vào giỏ thành công")
        void testAddToCartSuccess() throws Exception {
        // SỬA: Thay "P001" bằng 1L
        CartItemRequest request = new CartItemRequest(1L, 2); 
        
        CartResponse mockResponse = CartResponse.builder()
                .success(true)
                .message("Them vao gio hang thanh cong")
                .cartTotal(30000000.0)
                .build();

        // Mock Service: Khi nhận bất kỳ tham số nào (any), trả về mockResponse
        when(cartService.addToCart(any(), any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/cart/add")
                .with(csrf()) // Hỗ trợ bảo mật nếu có Spring Security
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Them vao gio hang thanh cong"));
        }
        
        @Test
        @WithMockUser
        @DisplayName("GET /api/cart - Lấy giỏ hàng thành công")
        void testGetCartSuccess() throws Exception {
        CartResponse mockResponse = CartResponse.builder().success(true).build();
        when(cartService.getCart(any())).thenReturn(mockResponse);

        mockMvc.perform(get("/api/cart")
                .header("Authorization", "Bearer mock-token")) // THÊM DÒNG NÀY
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser
        @DisplayName("DELETE /api/cart/remove/{id} - Xóa sản phẩm thành công")
        void testRemoveFromCartSuccess() throws Exception {
                CartResponse mockResponse = CartResponse.builder()
                        .success(true)
                        .message("Removed")
                        .build();

                // SỬA: Mock nhận tham số Long thay vì anyString()
                when(cartService.removeFromCart(any(), any(Long.class))).thenReturn(mockResponse);

                // SỬA: Truyền ID là số "1" thay vì "P001"
                mockMvc.perform(delete("/api/cart/remove/1")
                        .with(csrf())
                        .header("Authorization", "Bearer mock-token"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.success").value(true))
                        .andExpect(jsonPath("$.message").value("Removed"));
        }

        @Test
        @WithMockUser
        @DisplayName("PUT /api/cart/update - Cập nhật số lượng thành công")
        void testUpdateQuantitySuccess() throws Exception {
        // SỬA: Thay "P001" (String) thành 1L (Long) để khớp với Constructor
        CartItemRequest request = new CartItemRequest(1L, 5); 
        
        CartResponse mockResponse = CartResponse.builder()
                .success(true)
                .message("Updated")
                .build();

        // Giữ nguyên logic mock
        when(cartService.updateQuantity(any(), any())).thenReturn(mockResponse);

        mockMvc.perform(put("/api/cart/update")
                .with(csrf())
                .header("Authorization", "Bearer mock-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        }
        
        @Test
        @DisplayName("Test áp dụng mã giảm giá thành công")
        void testApplyCouponSuccess() throws Exception {
                mockMvc.perform(post("/api/cart/apply-coupon")
                        .param("couponCode", "DISCOUNT10") // Đây là tham số giải quyết lỗi 400 của bạn
                        .header("Authorization", "Bearer mock-token")
                        .contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk());
        }


}