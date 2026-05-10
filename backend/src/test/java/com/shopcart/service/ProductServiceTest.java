package com.shopcart.service;

import com.shopcart.dto.ProductResponse;
import com.shopcart.dto.ProductUpdateRequest;
import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product activeProduct;

    @BeforeEach
    void setUp() {
        activeProduct = new Product();
        activeProduct.setId(1);
        activeProduct.setName("Test Product");
        activeProduct.setPrice(BigDecimal.valueOf(100));
        activeProduct.setStock(20);
        activeProduct.setStatus("Active");
    }

    @Test
    void testGetAllActiveProducts() {
        when(productRepository.findByStatus("Active")).thenReturn(Arrays.asList(activeProduct));
        List<ProductResponse> result = productService.getAllActiveProducts();
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> productService.getProductById(99));
    }

    @Test
    void testUpdateProduct_FullUpdate() {
        ProductUpdateRequest request = new ProductUpdateRequest();
        request.setName("New Name");
        request.setStock(0); // Test logic tự động chuyển Inactive

        when(productRepository.findById(1)).thenReturn(Optional.of(activeProduct));
        when(productRepository.save(any(Product.class))).thenReturn(activeProduct);

        ProductResponse result = productService.updateProduct(1, request);

        assertEquals("New Name", activeProduct.getName());
        assertEquals("Inactive", activeProduct.getStatus()); // Đã phủ dòng 63-65 trong ProductService.java
    }

    @Test
    void testGetFeaturedProducts() {
        Product p1 = new Product(); p1.setStock(15); p1.setStatus("Active");
        Product p2 = new Product(); p2.setStock(5); p2.setStatus("Active"); // Sẽ bị loại bởi filter stock > 10

        when(productRepository.findByStatus("Active")).thenReturn(Arrays.asList(p1, p2));

        List<ProductResponse> result = productService.getFeaturedProducts();
        assertEquals(1, result.size());
    }

    @Test
    void testGetBestSellers() {
        Product p1 = new Product(); p1.setStock(50); p1.setStatus("Active");
        Product p2 = new Product(); p2.setStock(10); p2.setStatus("Active");

        when(productRepository.findByStatus("Active")).thenReturn(Arrays.asList(p1, p2));

        List<ProductResponse> result = productService.getBestSellers();
        // Kiểm tra logic sort tăng dần theo stock (dòng 82 ProductService.java)
        assertEquals(10, result.get(0).getStock());
    }
    @Test
    void testUpdateProduct_PartialUpdate() {
        // Chỉ update name, các trường khác để null để phủ các dòng check null if(request.get... != null)
        ProductUpdateRequest request = new ProductUpdateRequest();
        request.setName("Partial Update");

        when(productRepository.findById(1)).thenReturn(Optional.of(activeProduct));
        when(productRepository.save(any(Product.class))).thenReturn(activeProduct);

        productService.updateProduct(1, request);

        assertEquals("Partial Update", activeProduct.getName());
        assertEquals(BigDecimal.valueOf(100), activeProduct.getPrice()); // Price vẫn giữ nguyên
    }

    @Test
    void testMapToResponse_WithCategoryNull() {
        activeProduct.setCategory(null); // Phủ nhánh "Uncategorized" dòng 29
        when(productRepository.findById(1)).thenReturn(Optional.of(activeProduct));

        ProductResponse res = productService.getProductById(1);
        assertEquals("Uncategorized", res.getCategoryName());
    }
}