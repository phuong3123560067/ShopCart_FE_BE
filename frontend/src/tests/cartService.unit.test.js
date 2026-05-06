import { describe, test, expect, beforeEach, vi } from 'vitest';
import * as cartService from '../services/cartService';
import { PRODUCT_AVAILABLE, SHIPPING } from './mockData/cart.mock';

describe('Unit Test: cartService Logic', () => {
    
    beforeEach(async () => {
        vi.clearAllMocks();
        await cartService.clearCart('user01');
    });

    test('TC1: addToCart thêm sản phẩm mới thành công', async () => {
        const product = { ...PRODUCT_AVAILABLE, price: 100000, stock: 10 };
        const result = await cartService.addToCart('user01', product);
        
        expect(result.success).toBe(true);
        expect(result.cartTotal).toBe(100000); 
    });

    test('TC2: addToCart phải trả về lỗi nếu hết hàng', async () => {
        const outOfStockProduct = { ...PRODUCT_AVAILABLE, product_id: 'P000', stock: 0 };
        const result = await cartService.addToCart('user01', outOfStockProduct);
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('hết hàng');
    });

    test('TC3: updateQuantity tính đúng phí vận chuyển', async () => {
        const product = { ...PRODUCT_AVAILABLE, price: 50000, stock: 20 };
        const user_id = 'user01';
        
        await cartService.addToCart(user_id, product);
        const result = await cartService.updateQuantity(user_id, product.product_id, 2);
        
        expect(result.success).toBe(true);
        // (2 * 50.000) + 30.000 = 130.000[cite: 4, 7]
        const expectedTotal = 100000 + SHIPPING.DEFAULT; 
        expect(result.newTotal).toBe(expectedTotal); 
    });

    test('TC4: updateQuantity xóa sản phẩm khi số lượng là 0', async () => {
        const user_id = 'user01';
        await cartService.addToCart(user_id, PRODUCT_AVAILABLE);
        const result = await cartService.updateQuantity(user_id, PRODUCT_AVAILABLE.product_id, 0);
        
        expect(result.success).toBe(true);
        expect(result.newTotal).toBe(0);
        
        const finalCart = await cartService.getCart(user_id);
        expect(finalCart.items.length).toBe(0);
    });

    test('TC5: clearCart reset hoàn toàn dữ liệu về EMPTY_CART', async () => {
        const user_id = 'user01';
        await cartService.addToCart(user_id, PRODUCT_AVAILABLE);
        
        const result = await cartService.clearCart(user_id);
        
        expect(result.success).toBe(true);
        const finalCart = await cartService.getCart(user_id);
        expect(finalCart.items).toEqual([]);
        expect(finalCart.total_price).toBe(0);
    });

    // Case bổ sung để phủ dòng 22-25: Vượt quá tồn kho khi thêm mới[cite: 5, 8]
    test('TC6: addToCart trả về lỗi nếu số lượng thêm vào vượt quá stock', async () => {
        const product = { product_id: 'P123', price: 100, stock: 2 };
        const user_id = 'user01';
        
        // Thêm lần 1 (ok)
        await cartService.addToCart(user_id, product);
        // Thêm lần 2 (ok, tổng qty = 2)
        await cartService.addToCart(user_id, product);
        // Thêm lần 3 (Lỗi vì stock chỉ có 2)
        const result = await cartService.addToCart(user_id, product);
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('Vượt quá tồn kho');
    });

    // Case bổ sung để phủ dòng 47: Update quantity thành công cho sản phẩm đã có[cite: 5, 8]
    test('TC7: updateQuantity cập nhật số lượng hợp lệ cho sản phẩm có sẵn', async () => {
        const user_id = 'user01';
        const product = { product_id: 'P999', price: 100000, stock: 10 };
        await cartService.addToCart(user_id, product);
        
        // Cập nhật từ 1 lên 5 (nhánh thành công dòng 47)[cite: 5, 8]
        const result = await cartService.updateQuantity(user_id, 'P999', 5);
        
        expect(result.success).toBe(true);
        const cart = await cartService.getCart(user_id);
        expect(cart.items[0].quantity).toBe(5);
    });
});