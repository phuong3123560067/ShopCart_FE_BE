package com.shopcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopcart.dto.ProductResponse;
import com.shopcart.dto.ProductUpdateRequest;
import com.shopcart.service.ProductService;
import com.shopcart.config.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private JwtTokenProvider tokenProvider;

    @Test
    void testGetAllProducts_Success() throws Exception {
        when(productService.getAllActiveProducts()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllProducts_Exception() throws Exception {
        // Phủ nhánh catch(Exception e) -> 500 (Dòng 26 ProductController)
        when(productService.getAllActiveProducts()).thenThrow(new RuntimeException("Error"));
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testGetProductById_Success() throws Exception {
        ProductResponse response = ProductResponse.builder()
                .id(1).name("Laptop").price(BigDecimal.valueOf(1000)).build();

        when(productService.getProductById(1)).thenReturn(response);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    void testGetProductById_NotFound() throws Exception {
        // Phủ nhánh catch(Exception e) -> 404 (Dòng 36 ProductController)
        when(productService.getProductById(99)).thenThrow(new NoSuchElementException("Not Found"));
        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateProduct_Success() throws Exception {
        ProductUpdateRequest request = new ProductUpdateRequest();
        request.setName("New Name");
        ProductResponse res = ProductResponse.builder().name("New Name").build();

        when(productService.updateProduct(eq(1), any())).thenReturn(res);

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Name"));

        verify(productService).updateProduct(eq(1), any()); // Câu 5.1.2 c
    }
}