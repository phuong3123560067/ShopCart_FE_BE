import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartComponent from '../components/CartComponent';
import * as cartService from '../services/cartService';

// 1. Mock toàn bộ file service với factory function để tránh lỗi undefined
vi.mock('../services/cartService', () => ({
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateQuantity: vi.fn(),
    checkout: vi.fn()
}));

describe('Cart Mock Tests', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        // Giả lập getCart luôn trả về dữ liệu để Component không bị đứng ở màn hình Loading mãi mãi
        cartService.getCart.mockResolvedValue({ items: [], total: 0 });
    });

    // --- Câu a & b: Test trường hợp THÀNH CÔNG ---
    test('Mock: Thêm sản phẩm thành công và verify mock calls', async () => {
        // Thiết lập kết quả giả định trả về Thành công
        cartService.addToCart.mockResolvedValue({
            success: true,
            message: 'Them vao gio hang thanh cong',
            cartTotal: 30000000
        });

        render(<CartComponent userId="user01" />);

        // Đợi nút xuất hiện (để vượt qua trạng thái loading ban đầu)
        const addBtn = await screen.findByTestId('add-to-cart-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // Xác minh (Verify) xem hàm addToCart đã được gọi đúng với userId "user01" chưa
            expect(cartService.addToCart).toHaveBeenCalledWith(
                'user01',
                expect.objectContaining({
                    productId: expect.any(String)
                })
            );
            
            // Dùng toBeDefined thay cho toBeInTheDocument để tránh lỗi thư viện
            expect(screen.getByText(/thanh cong/i)).toBeDefined();
        });
    });

    // --- Câu b: Test trường hợp THẤT BẠI (Failed Response) ---
    test('Mock: Thêm sản phẩm thất bại và hiển thị lỗi', async () => {
        // Thiết lập kết quả giả định trả về Thất bại
        cartService.addToCart.mockResolvedValue({
            success: false,
            message: 'Sản phẩm đã hết hàng'
        });

        render(<CartComponent userId="user01" />);

        const addBtn = await screen.findByTestId('add-to-cart-btn');
        fireEvent.click(addBtn);

        const errorMsg = await screen.findByText(/hết hàng/i);

        expect(errorMsg).toBeDefined();
        expect(cartService.addToCart).toHaveBeenCalled();
    });
});