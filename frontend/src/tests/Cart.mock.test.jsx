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
        cartService.addToCart.mockResolvedValue({
            success: true,
            message: 'Thêm vào giỏ hàng thành công',
            cartTotal: VALID_CART.total
        });

        cartService.getCart.mockResolvedValue(VALID_CART);

        render(
            <BrowserRouter><CartComponent userId="user01" /></BrowserRouter>
        );

        // 2. Tìm nút bấm theo ID sản phẩm có trong PRODUCT_LIST (P999 - iPhone)
        const addBtn = await screen.findByTestId('add-P999-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // 3. Xác minh Service được gọi đúng với object sản phẩm P999
            expect(cartService.addToCart).toHaveBeenCalledWith(
                'user01',
                expect.objectContaining({
                    productId: 'P999'
                })
            );
            
            // 4. Kiểm tra Toast thành công
            expect(screen.getByTestId('success-toast')).toHaveTextContent(/thành công/i);       
        });
    });

    //--- Câu b: Test trường hợp THẤT BẠI (Failed Response) ---
    test('Mock: Thêm sản phẩm thất bại và hiển thị lỗi', async () => {
        // 1. Thiết lập kết quả giả định trả về Thất bại
        cartService.addToCart.mockResolvedValue({
            success: false,
            message: 'Sản phẩm đã hết hàng'
        });

        render(
            <BrowserRouter><CartComponent userId="user01" /></BrowserRouter>
        );

        // 2. Chọn một sản phẩm còn hàng trong danh sách nhưng mock API trả về lỗi (để nút không bị disabled)
        // Ví dụ dùng P998 (MacBook) có stock: 8
        const addBtn = await screen.findByTestId('add-P998-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // 3. Xác minh Service được gọi đúng với mã P998
            expect(cartService.addToCart).toHaveBeenCalledWith(
                'user01',
                expect.objectContaining({
                    productId: 'P998'
                })
            );
            
            // 4. Kiểm tra Toast lỗi hiển thị đúng (inventory-error)
            expect(screen.getByTestId('inventory-error')).toHaveTextContent(/hết hàng/i);       
        });
    });
});