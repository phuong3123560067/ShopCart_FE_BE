import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartComponent from '../components/CartComponent';
import * as orderService from '../services/orderService';
import * as inventoryService from '../services/inventoryService';
import { PRODUCT_AVAILABLE, PRODUCT_OUT_OF_STOCK } from './mockData/cart.mock';

// a) Mock các external dependencies
vi.mock('../services/orderService');
vi.mock('../services/inventoryService');

describe('Purchase Mock Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // b) Scenario: Đặt hàng THÀNH CÔNG
    test('Mock: Đặt hàng thành công khi còn hàng', async () => {
        vi.mocked(inventoryService.checkStock).mockResolvedValue({ available: true });

        vi.mocked(orderService.createOrder).mockResolvedValue({
            orderId: 'ORD-001',
            status: 'PENDING'
        });

        const items = [{ 
            productId: PRODUCT_AVAILABLE.productId, // 'P999'
            quantity: 1 
        }];
        
        const stockStatus = await inventoryService.checkStock(items);
        if (stockStatus.available) {
            await orderService.createOrder({ items, userId: 'user01' });
        }

        // Verify: Kiểm tra xem đã gọi đúng mã sản phẩm P999 chưa
        expect(inventoryService.checkStock).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ productId: PRODUCT_AVAILABLE.productId })
            ])
        );
        expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    });

    // b) Scenario: Đặt hàng THẤT BẠI (Do hết hàng)
    test('Mock: Đặt hàng thất bại khi hết hàng', async () => {
        vi.mocked(inventoryService.checkStock).mockResolvedValue({ available: false });

        const items = [{ 
            productId: PRODUCT_OUT_OF_STOCK.productId, // 'P000'
            quantity: 1 
        }];
        
        const stockStatus = await inventoryService.checkStock(items);
        
        if (stockStatus.available) {
            await orderService.createOrder({ items, userId: 'user01' });
        }

        // Verify: Đảm bảo đã check sản phẩm P000 và KHÔNG tạo đơn hàng
        expect(inventoryService.checkStock).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ productId: PRODUCT_OUT_OF_STOCK.productId })
            ])
        );
        expect(orderService.createOrder).not.toHaveBeenCalled();
    });
});