package com.shopcart.controller;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.service.InventoryService;
import com.shopcart.config.JwtTokenProvider; // Quan trọng
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventoryController.class)
@AutoConfigureMockMvc(addFilters = false)
public class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InventoryService inventoryService;

    @MockitoBean
    private JwtTokenProvider tokenProvider;

    @Test
    void testUpdateStock_API_Success() throws Exception {
        InventoryResponse res = InventoryResponse.builder()
                .productId(1)
                .stock(50)
                .build();

        when(inventoryService.updateStock(eq(1), anyInt())).thenReturn(res);

        String jsonRequest = "{\"stock\": 50}";

        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(50));
    }
}