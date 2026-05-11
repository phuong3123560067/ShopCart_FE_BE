package com.shopcart.service;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("InventoryService Unit Tests - Full Coverage")
class InventoryServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    @DisplayName("Lấy tồn kho: Thành công")
    void getStock_Success() {
        Product product = new Product();
        product.setId(1);
        product.setName("Laptop");
        product.setStock(10);
        product.setStatus("Active");

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        InventoryResponse response = inventoryService.getStock(1);

        assertEquals(10, response.getStock());
        assertEquals("Laptop", response.getProductName());
    }

    @Test
    @DisplayName("Lấy tồn kho: Thất bại - Sản phẩm không tồn tại")
    void getStock_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> inventoryService.getStock(99));
    }

    @Test
    @DisplayName("Cập nhật kho: Thành công và tự động Active")
    void updateStock_Success_Active() {
        Product product = new Product();
        product.setId(1);
        product.setStock(5);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        InventoryResponse response = inventoryService.updateStock(1, 20);

        assertEquals(20, response.getStock());
        assertEquals("Active", product.getStatus());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("Cập nhật kho: Thành công và tự động Inactive khi stock = 0")
    void updateStock_Success_Inactive() {
        Product product = new Product();
        product.setId(1);
        product.setStock(5);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        InventoryResponse response = inventoryService.updateStock(1, 0);

        assertEquals(0, response.getStock());
        assertEquals("Inactive", product.getStatus());
    }

    @Test
    @DisplayName("Cập nhật kho: Thất bại - Số lượng âm (Phủ vạch đỏ logic)")
    void updateStock_NegativeError() {
        Product product = new Product();
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> inventoryService.updateStock(1, -5));
        assertEquals("Số lượng kho không được là số âm!", ex.getMessage());
    }
}