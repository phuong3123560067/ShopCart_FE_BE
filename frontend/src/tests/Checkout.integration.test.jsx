import { describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CheckoutPage from '../components/CheckoutPage'; 
import { MemoryRouter } from 'react-router-dom';
import { VALID_CART, OUT_OF_STOCK_CART, PRODUCT_OUT_OF_STOCK , PRODUCT_AVAILABLE} from './mockData/cart.mock';

describe('Checkout Integration Tests', () => {
    // Hàm render chuẩn: Luôn bọc data vào key cartData
    const renderCheckout = (data) => {
        return render(
            <MemoryRouter initialEntries={[{ pathname: '/checkout', state: { cartData: data } }]}>
                <CheckoutPage />
            </MemoryRouter>
        );
    };

    test('TC1: Hiển thị đầy đủ danh sách sản phẩm', async () => {
        renderCheckout(VALID_CART);
        
        const summaryItems = await screen.findAllByTestId('summary-item');
        expect(summaryItems).toHaveLength(2);
        expect(screen.getByText(/Laptop Dell/i)).toBeInTheDocument();
    });

    test('TC2: Hiển thị tổng giá chính xác', async () => {
        renderCheckout(VALID_CART);

        await waitFor(() => {
            expect(screen.getByTestId('subtotal-price')).toHaveTextContent('21,000,000');
        });
    });

    test('TC3: Hiển thị cảnh báo khi đơn hàng có sản phẩm vượt quá tồn kho', async () => {
        renderCheckout(OUT_OF_STOCK_CART);

        await waitFor(() => {
            // Tìm thẻ lỗi dựa trên data-testid đã đặt trong CheckoutPage
            const warning = screen.queryByTestId('inventory-warning');
            expect(warning).toBeInTheDocument();
            
            expect(warning).toHaveTextContent(/Cảnh báo|hết hàng/i);
        });
    });
});