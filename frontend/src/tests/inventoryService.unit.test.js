import { describe, test, expect } from 'vitest';
import * as inventoryService from '../services/inventoryService';

describe('Inventory Service Unit Tests', () => {
    test('Nên trả về available: false khi số lượng vượt tồn kho (Phủ dòng đỏ)', async () => {
        const items = [{ name: 'Sản phẩm lỗi', quantity: 10, stock: 5 }];
        const result = await inventoryService.checkStock(items);
        
        expect(result.available).toBe(false);
        expect(result.message).toContain('không đủ số lượng');
    });

    test('Nên trả về available: true khi đủ tồn kho', async () => {
        const items = [{ name: 'Sản phẩm tốt', quantity: 2, stock: 5 }];
        const result = await inventoryService.checkStock(items);
        
        expect(result.available).toBe(true);
    });
});