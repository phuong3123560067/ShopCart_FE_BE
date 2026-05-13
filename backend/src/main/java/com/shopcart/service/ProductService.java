package com.shopcart.service;

import com.shopcart.dto.ProductResponse;
import com.shopcart.dto.ProductUpdateRequest;
import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .imageUrl(product.getImageUrl())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "Uncategorized")
                .build();
    }


    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByStatus("Active")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public ProductResponse getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm ID: " + id));
        return mapToResponse(product);
    }


    @Transactional
    public ProductResponse updateProduct(Integer id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sản phẩm với ID: " + id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getStatus() != null) product.setStatus(request.getStatus());

        if (product.getStock() != null && product.getStock() <= 0) {
            product.setStatus("Inactive");
        }

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    public List<ProductResponse> getFeaturedProducts() {

        return productRepository.findByStatus("Active")
                .stream()
                .filter(p -> p.getStock() > 10)
                .limit(4)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    public List<ProductResponse> getBestSellers() {

        return productRepository.findByStatus("Active")
                .stream()
                .sorted((p1, p2) -> p1.getStock().compareTo(p2.getStock()))
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}