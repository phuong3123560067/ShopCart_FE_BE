package com.shopcart.controller;

import com.shopcart.entity.ProductExample;
import com.shopcart.repository.ProductRepositoryExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private ProductRepositoryExample productRepository;

    @GetMapping("/test-data")
    public List<ProductExample> getTestData() {
        return productRepository.findAll();
    }
}