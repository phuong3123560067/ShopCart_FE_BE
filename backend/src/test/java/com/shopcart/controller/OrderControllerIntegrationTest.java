package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.OrderItemRequest;
import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.model.OrderStatus;
import com.shopcart.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc // Đã gỡ addFilters = false
@DisplayName("Order Controller Integration Tests - Security & Logic")
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Security: Customer đặt hàng - Thành công (201)")
    void testCreateOrder_AsCustomer_Success() throws Exception {
        OrderRequest request = OrderRequest.builder()
                .items(List.of(new OrderItemRequest(1L, 2, 15000000L)))
                .shippingFee(50000L)
                .build();

        OrderResponse mockResponse = OrderResponse.builder()
                .orderId("ORD-001")
                .status(OrderStatus.PENDING)
                .totalPrice(30050000L)
                .build();

        when(orderService.createOrder(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value("ORD-001"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Security: Admin cố tình đặt hàng - Bị chặn (403)")
    void testCreateOrder_AsAdmin_Forbidden() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Security: Chưa đăng nhập đặt hàng - Bị chặn (401)")
    void testCreateOrder_Unauthenticated_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}