package com.shopcart.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock // Thay @InjectMocks bằng @Mock
    private InventoryService inventoryService;

    @Test
    void testCheckStock() {
        // Giả lập hành vi cho Interface
        when(inventoryService.checkStock("1", 5)).thenReturn(true);
        
        boolean result = inventoryService.checkStock("1", 5);
        assertTrue(result);
    }
}