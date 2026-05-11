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

    public InventoryResponse getStock(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm ID: " + productId));

        return buildResponse(product);
    }

    @Transactional
    public InventoryResponse updateStock(Integer productId, Integer newStock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại để cập nhật kho"));

        // Logic chặn số âm để pass TC Negative
        if (newStock < 0) {
            throw new RuntimeException("Số lượng kho không được là số âm!");
        }

        product.setStock(newStock);
        product.setStatus(newStock == 0 ? "Inactive" : "Active");
        productRepository.save(product);

        return buildResponse(product);
    }

    private InventoryResponse buildResponse(Product product) {
        return InventoryResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .stock(product.getStock())
                .status(product.getStatus())
                .build();
    }
}