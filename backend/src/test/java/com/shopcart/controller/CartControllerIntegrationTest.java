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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
// Thêm import cho get và delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*; 
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

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
    @WithMockUser(username = "testuser", roles = {"USER"}) // giả lập người dùng
    @DisplayName("POST /api/cart/add - Thêm vào giỏ thành công")
    void testAddToCartSuccess() throws Exception {
        // 1. Giả định dữ liệu đầu vào và kết quả mong muốn
        CartItemRequest request = new CartItemRequest(1, 2);      
        CartResponse mockResponse = CartResponse.builder()
                .success(true)
                .message("Them vao gio hang thanh cong")
                .cartTotal(new BigDecimal("30000000")) 
                .build();

        // 2. Ra lệnh cho máy: "Khi gọi Service, hãy trả về outputFake"
        when(cartService.addToCart(any(Integer.class), any(CartItemRequest.class))).thenReturn(mockResponse);
        // 3. Giả vờ bấm nút gửi yêu cầu lên Server
        mockMvc.perform(post("/api/cart/add")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                // 4. Chốt đơn: Nếu kết quả trả về là 'true' thì bài Test ĐẠT
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

        // SỬA: Mock nhận (Integer, Integer) thay vì any() và Long.class
        when(cartService.removeFromCart(any(Integer.class), any(Integer.class))).thenReturn(mockResponse);

        // API vẫn nhận "/1" nhưng Mockito cần biết đó là Integer
        mockMvc.perform(delete("/api/cart/remove/1")
                .with(csrf())
                .header("Authorization", "Bearer mock-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    @DisplayName("Test áp dụng mã giảm giá thành công")
    void testApplyCouponSuccess() throws Exception {
        CartResponse mockResponse = CartResponse.builder()
                .success(true)
                .message("Coupon applied")
                .build();

        // SỬA: Lỗi (String, String) -> (Integer, String). Dùng anyInt() cho userId
        when(cartService.applyCoupon(anyInt(), anyString())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/cart/apply-coupon")
                .param("couponCode", "DISCOUNT10") 
                .with(csrf())
                .header("Authorization", "Bearer mock-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/cart/update - Cập nhật số lượng thành công")
    void testUpdateQuantitySuccess() throws Exception {
        // SỬA: 1L (Long) thành 1 (Integer)
        CartItemRequest request = new CartItemRequest(1, 5); 
        
        CartResponse mockResponse = CartResponse.builder()
                .success(true)
                .message("Updated")
                .build();

        when(cartService.updateQuantity(any(Integer.class), any(CartItemRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(put("/api/cart/update")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
