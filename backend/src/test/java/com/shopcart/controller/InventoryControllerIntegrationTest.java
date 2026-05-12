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


    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Branch Coverage: Request body thiếu trường stock (Phủ vạch vàng if null)")
    void updateStock_MissingStockField() throws Exception {

        Map<String, Object> invalidBody = new HashMap<>();
        invalidBody.put("other_field", 123);

        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidBody)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStock_Success() throws Exception {
        Map<String, Integer> body = new HashMap<>();
        body.put("stock", 50);

        InventoryResponse res = InventoryResponse.builder().stock(50).build();
        when(inventoryService.updateStock(anyInt(), anyInt())).thenReturn(res);

        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Branch Coverage: Gửi JSON không có key stock để ép null")
    void updateStock_NullBranch() throws Exception {
        // Gửi nội dung rỗng để requestBody.get("stock") trả về null
        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }


    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Instruction Coverage: Ép ném RuntimeException để phủ ExceptionHandler")
    void updateStock_HandleException() throws Exception {

        when(inventoryService.updateStock(anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Lỗi ép phủ vạch đỏ"));

        mockMvc.perform(put("/api/inventory/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"stock\": 10}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Lỗi ép phủ vạch đỏ"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getStock_Ok() throws Exception {
        InventoryResponse res = InventoryResponse.builder().stock(10).build();
        when(inventoryService.getStock(1)).thenReturn(res);

        mockMvc.perform(get("/api/inventory/1"))
                .andExpect(status().isOk());
    }
}