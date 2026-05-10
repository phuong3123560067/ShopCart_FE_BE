package com.shopcart.service;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;
@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * GET: Kiểm tra tồn kho
     * Nếu không thấy ID, ném NoSuchElementException để GlobalExceptionHandler trả về 404
     */
    public InventoryResponse getStock(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm ID: " + productId));

        return InventoryResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .stock(product.getStock())
                .status(product.getStatus())
                .build();
    }

    /**
     * PUT: Cập nhật số lượng kho
     * Bổ sung logic: Không cho phép nhập số âm & Tự động cập nhật trạng thái
     */
    @Transactional
    public InventoryResponse updateStock(Integer productId, Integer newStock) {
        // 1. Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại để cập nhật kho"));

        // 2. Chặn số âm
        if (newStock < 0) {
            throw new RuntimeException("Số lượng kho không được là số âm!");
        }

        // 3. Cập nhật và lưu
        product.setStock(newStock);

        // Tự động cập nhật status để tí nữa test Cart cho dễ
        if (newStock == 0) {
            product.setStatus("Inactive");
        } else {
            product.setStatus("Active");
        }

        productRepository.save(product);

        // 4. Trả về đúng DTO InventoryResponse gọn nhẹ
        return InventoryResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .stock(product.getStock())
                .status(product.getStatus())
                .build();
    }
}