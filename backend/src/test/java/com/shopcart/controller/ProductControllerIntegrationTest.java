package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.ProductResponse;
import com.shopcart.dto.ProductUpdateRequest;
import com.shopcart.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Product Security & Logic Tests")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Security: Xem chi tiết sản phẩm - Cho phép tất cả (PermitAll)")
    void testGetProductById_PermitAll() throws Exception {
        ProductResponse response = ProductResponse.builder().id(1).name("Laptop").price(BigDecimal.valueOf(1000)).build();
        when(productService.getProductById(1)).thenReturn(response);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Security: Admin cập nhật sản phẩm - Thành công (200)")
    void testUpdateProduct_AsAdmin_Success() throws Exception {
        ProductUpdateRequest request = new ProductUpdateRequest();
        request.setName("New Name");
        when(productService.updateProduct(eq(1), any())).thenReturn(ProductResponse.builder().name("New Name").build());

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("Security: Customer cập nhật sản phẩm - Bị chặn (403)")
    void testUpdateProduct_AsCustomer_Forbidden() throws Exception {
        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Hack\"}"))
                .andExpect(status().isForbidden()); // Trả về 403 Forbidden
    }
    @Test
    @DisplayName("Controller: Lấy tất cả sản phẩm - Thành công")
    void testGetAllProducts_Success() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Controller: Lấy sản phẩm - Thất bại (404)")
    void testGetProduct_NotFound() throws Exception {
        when(productService.getProductById(999)).thenThrow(new RuntimeException("Không tìm thấy sản phẩm"));

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Không tìm thấy sản phẩm"));
    }

    @Test
    @DisplayName("Controller: Cập nhật sản phẩm - Lỗi BadRequest (400)")
    @WithMockUser(roles = "ADMIN")
    void testUpdateProduct_BadRequest() throws Exception {
        ProductUpdateRequest request = new ProductUpdateRequest();
        when(productService.updateProduct(eq(1), any())).thenThrow(new RuntimeException("Dữ liệu không hợp lệ"));

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Dữ liệu không hợp lệ"));
    }
}