import { describe, test, expect } from 'vitest';
import * as orderService from '../services/orderService';
import { USERS, VALID_CART } from './mockData/cart.mock';

describe('Unit Test: orderService Logic', () => {
    
    test('TC1: createOrder tạo đơn hàng thành công từ giỏ hàng', async () => {
        const mockUser = USERS[0];
        const mockCart = { ...VALID_CART, user_id: mockUser.id };

        const result = await orderService.createOrder(mockCart);

        expect(result.success).toBe(true);
        expect(result.orderData.user_id).toBe(mockUser.id);
        expect(result.orderData.items.length).toBe(VALID_CART.items.length);
        
        expect(result.orderData.total_price).toBe(VALID_CART.total_price);
    });

    test('TC2: createOrder trả về lỗi nếu giỏ hàng trống', async () => {
        const emptyCart = { items: [], total_price: 0, user_id: 'user01' };
        
        const result = await orderService.createOrder(emptyCart);
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('trống');
    });
});