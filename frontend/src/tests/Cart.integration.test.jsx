import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CartComponent from '../components/CartComponent.jsx';
import * as cartService from '../services/cartService';

vi.mock('../services/cartService', () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateQuantity: vi.fn(),
  checkout: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('Cart Component Integration Tests', () => {

    test('TC1: Hiển thị giỏ hàng rỗng khi chưa có sản phẩm', async () => {

        cartService.getCart.mockResolvedValue({ items: [], total: 0 });

        render(<CartComponent userId="user01" />);

        await waitFor(() => {
            expect(screen.getByTestId('empty-cart-message'))
                .toBeInTheDocument();
        });
    });

        
    test('TC2: Hiển thị danh sách sản phẩm trong giỏ hàng', async () => {

        cartService.getCart.mockResolvedValue({
            items: [{ productName: 'Laptop', quantity: 2 }],
            total: 2000
        });

        render(<CartComponent userId="user01" />);

        await waitFor(() => {
            const item = screen.getByText(/Laptop/).closest('li');
            expect(item).toHaveTextContent('Laptop');
            expect(item).toHaveTextContent('2');
        });
    });

    test('TC3: Tăng số lượng sản phẩm', async () => {
        cartService.getCart.mockResolvedValue({
            items: [{ productId: 'P001', productName: 'Laptop', quantity: 1 }],
            total: 1000
        });

        cartService.updateQuantity.mockResolvedValue({ success: true });

        render(<CartComponent userId="user01" />);

        // Sử dụng regex để tìm "Laptop" vì text trong DOM là "Laptop - 1"
        await screen.findByText(/Laptop/i);

        // Đảm bảo nút tăng có tồn tại trong DOM
        const increaseBtn = screen.getByTestId('increase-btn-P001');
        fireEvent.click(increaseBtn);

        await waitFor(() => {
            expect(cartService.updateQuantity).toHaveBeenCalledWith("user01", "P001", expect.any(Number));
        });
    });

    test('TC4: Gửi request đặt hàng thành công', async () => {
        cartService.getCart.mockResolvedValue({
            items: [{ productId: 'P001', productName: 'Laptop', quantity: 1 }],
            total: 1000
        });

        cartService.checkout.mockResolvedValue({ success: true });

        render(<CartComponent userId="user01" />);

        // Phải đợi cho đến khi item hiện lên rồi mới bấm Checkout
        // để tránh việc nút checkout chưa được render hoặc bị disabled
        await screen.findByText(/Laptop/i);
        
        const checkoutBtn = await screen.findByTestId('checkout-btn');
        fireEvent.click(checkoutBtn);

        await waitFor(() => {
            expect(cartService.checkout).toHaveBeenCalled();
        });
    });

    test('TC5: Hiển thị lỗi khi API fail', async () => {
        // Giả lập API trả về lỗi
        cartService.getCart.mockRejectedValue(new Error('API Error'));

        render(<CartComponent userId="user01" />);

        // Dùng findByText để chờ thông báo lỗi xuất hiện (vì là bất đồng bộ)
        const errorMessage = await screen.findByText(/Error loading cart/i);
        expect(errorMessage).toBeInTheDocument();
    });

});