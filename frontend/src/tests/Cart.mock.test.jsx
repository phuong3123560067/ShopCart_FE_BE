import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartComponent from '../components/CartComponent';
import * as cartService from '../services/cartService';
import { VALID_CART, EMPTY_CART, MOCK_PRODUCT_ADDTOCART } from './mockData/cart.mock';

vi.mock('../services/cartService');

describe('Cart Mock Tests', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        cartService.getCart.mockResolvedValue(EMPTY_CART);
    });

    // --- Câu a & b: Test trường hợp THÀNH CÔNG ---
    test('Mock: Thêm sản phẩm thành công và verify mock calls', async () => {
        // Thiết lập kết quả giả định trả về Thành công
        cartService.addToCart.mockResolvedValue({
            success: true,
            message: 'Thêm vào giỏ hàng thành công',
            cartTotal: VALID_CART.total
        });

        cartService.getCart.mockResolvedValue(VALID_CART);

        render(
        <BrowserRouter><CartComponent userId="user01" /></BrowserRouter>
        );

        const addBtn = await screen.findByTestId('add-available-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // Xác minh (Verify) xem hàm addToCart đã được gọi đúng với userId "user01" chưa
            expect(cartService.addToCart).toHaveBeenCalledWith(
                'user01',
                expect.objectContaining({
                    productId: 'P999'
                })
            );
            
            expect(screen.getByTestId('success-toast')).toHaveTextContent(/thành công/i);       
        });
    });

    //--- Câu b: Test trường hợp THẤT BẠI (Failed Response) ---
    test('Mock: Thêm sản phẩm thất bại và hiển thị lỗi', async () => {
        // Thiết lập kết quả giả định trả về Thất bại
        cartService.addToCart.mockResolvedValue({
            success: false,
            message: 'Sản phẩm đã hết hàng'
        });

        render(
        <BrowserRouter><CartComponent userId="user01" /></BrowserRouter>
        );

        const addBtn = await screen.findByTestId('add-out-of-stock-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // Xác minh (Verify) xem hàm addToCart đã được gọi đúng với userId "user01" chưa
            expect(cartService.addToCart).toHaveBeenCalledWith(
                'user01',
                expect.objectContaining({
                    productId: 'P000'
                })
            );
            
            expect(screen.getByTestId('inventory-error')).toHaveTextContent(/hết hàng/i);       
        });
    });
});