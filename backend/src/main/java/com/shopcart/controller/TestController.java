package com.shopcart.controller;

import com.shopcart.entity.Product;
import com.shopcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/test-data")
    public List<Product> getTestData() {
        return productRepository.findAll();
    }
}