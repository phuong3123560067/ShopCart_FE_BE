package com.shopcart.controller;

import com.shopcart.dto.InventoryResponse;
import com.shopcart.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<InventoryResponse> getStock(@PathVariable Integer productId) {
        return ResponseEntity.ok(inventoryService.getStock(productId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryResponse> updateStock(
            @PathVariable Integer productId,
            @RequestBody Map<String, Integer> requestBody) {

        Integer stock = requestBody.get("stock");
        if (stock == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(inventoryService.updateStock(productId, stock));
    }

    @ExceptionHandler({RuntimeException.class, IllegalArgumentException.class})
    public ResponseEntity<String> handleLogicErrors(RuntimeException ex) {
        return ResponseEntity.status(400).body(ex.getMessage());
    }
}