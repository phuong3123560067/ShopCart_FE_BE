package com.shopcart.service;

public interface InventoryService {
    boolean checkStock(String productId, Integer quantity);
}