package com.shopcart.controller;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<?> getStock(@PathVariable Integer productId) {
        try {
            InventoryResponse stock = inventoryService.getStock(productId);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateStock(
            @PathVariable Integer productId,
            @RequestBody Map<String, Integer> requestBody) {
        try {
            Integer stock = requestBody.get("stock");
            if (stock == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thiếu giá trị 'stock' trong JSON Body!");
            }
            InventoryResponse updated = inventoryService.updateStock(productId, stock);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            // Trả về lỗi: "Số lượng kho không được là số âm!"
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}