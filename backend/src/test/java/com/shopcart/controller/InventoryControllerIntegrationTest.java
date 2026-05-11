package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.InventoryResponse;
import com.shopcart.service.InventoryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventoryService inventoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Security: Admin truy cập kho - Thành công")
    void getStock_AsAdmin_Success() throws Exception {
        InventoryResponse res = InventoryResponse.builder().stock(50).build();
        when(inventoryService.getStock(1)).thenReturn(res);

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Security: Customer truy cập kho - Bị chặn (403)")
    void getStock_AsCustomer_Forbidden() throws Exception {
        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Logic: Admin cập nhật kho với số âm - 400 Bad Request")
    void updateStock_ApiNegative() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("stock", -10);

        when(inventoryService.updateStock(anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Số lượng kho không được là số âm!"));

        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }
}