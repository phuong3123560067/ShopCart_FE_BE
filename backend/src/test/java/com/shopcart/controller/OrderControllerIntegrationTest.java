package com.shopcart.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import com.shopcart.model.OrderStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.OrderItemRequest;
import com.shopcart.dto.OrderRequest;
import com.shopcart.dto.OrderResponse;
import com.shopcart.service.InventoryService;
import com.shopcart.service.OrderService;

@WebMvcTest(OrderController.class)
@DisplayName("Order API Integration Tests")
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private InventoryService inventoryService; // Cần thiết vì Order có liên quan đến kho

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    @DisplayName("POST /api/orders - Tạo đơn hàng thành công")
    void testCreateOrder() throws Exception {
        // 1. Chuẩn bị DTO đặt hàng[cite: 2]
        OrderRequest request = OrderRequest.builder()
                .items(List.of(new OrderItemRequest("P001", 2, 15000000L)))
                .shippingFee(50000L)
                .build();

        // 2. Giả lập Response trả về sau khi tạo đơn[cite: 1]
        OrderResponse mockResponse = OrderResponse.builder()
                .orderId("ORD-001")
                .status(OrderStatus.PENDING)
                .totalPrice(30050000L)
                .build();

        when(orderService.createOrder(any())).thenReturn(mockResponse);

        // 3. Gọi API và kiểm tra HTTP Status 201 Created[cite: 1]
        mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated()) // Kiểm tra mã trạng thái thành công cho việc tạo mới[cite: 1]
                .andExpect(jsonPath("$.orderId").value("ORD-001"))
                .andExpect(jsonPath("$.totalPrice").value(30050000));
    }
}