/*package com.shopcart.service;

import com.shopcart.entity.ProductExample;
import org.springframework.stereotype.Service;

@Service
public class CartServiceExample {

    public String addToCart(ProductExample product, int quantity) {
        if (product == null) {
            return "ERROR_NOT_FOUND";
        }

        if (product.getInventoryQuantity() < quantity) {
            return "ERROR_OUT_OF_STOCK";
        }

        return "SUCCESS";
    }
}*/