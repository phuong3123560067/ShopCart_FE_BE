package com.shopcart.service;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    @Mock
    private ProductRepository productRepository; // Mock Repository theo câu 5.2.2a

    @InjectMocks
    private InventoryService inventoryService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1);
        product.setName("Sản phẩm Test");
        product.setStock(10);
        product.setStatus("Active");
    }

    @Test
    void testUpdateStock_Success() {
        // Given
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // When
        InventoryResponse response = inventoryService.updateStock(1, 20);

        // Then
        assertThat(response.getStock()).isEqualTo(20);
        assertThat(response.getStatus()).isEqualTo("Active");
        verify(productRepository, times(1)).save(any(Product.class)); // Verify interaction theo câu 5.2.2c
    }

    @Test
    void testUpdateStock_SetToZero_StatusInactive() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        InventoryResponse response = inventoryService.updateStock(1, 0);

        assertThat(response.getStock()).isEqualTo(0);
        assertThat(response.getStatus()).isEqualTo("Inactive");
    }

    @Test
    void testUpdateStock_NegativeValue_ThrowsException() {
        // Given
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateStock(1, -5);
        });

        assertThat(exception.getMessage()).isEqualTo("Số lượng kho không được là số âm!");
    }
}