import { describe, test, expect, beforeEach } from 'vitest';
import * as cartService from '../services/cartService';
import { PRODUCT_AVAILABLE } from './mockData/cart.mock';

describe('Unit Test: cartService Logic', () => {
    
    test('Hàm addToCart phải thêm sản phẩm mới và tính đúng tiền', async () => {
        const product = { ...PRODUCT_AVAILABLE, price: 100000, stock: 10 };
        
        // Gọi hàm THẬT, không mock
        const result = await cartService.addToCart('user01', product);
        
        expect(result.success).toBe(true);
        expect(result.cartTotal).toBe(100000); // 1 sản phẩm * 100k
    });

    test('Hàm addToCart phải trả về lỗi nếu sản phẩm hết hàng', async () => {
        const outOfStockProduct = { productId: 'P000', stock: 0 };
        
        const result = await cartService.addToCart('user01', outOfStockProduct);
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('hết hàng');
    });
});