import { describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CheckoutPage from '../components/CheckoutPage'; 

describe('Checkout Integration Tests', () => {
    const mockCart = {
        items: [
        { name: 'Laptop Dell', price: 15000000, quantity: 2 },
        { name: 'Mouse Logitech', price: 500000, quantity: 1 },
        ]
    };

    // a) Test CheckoutSummary component
    test('TC1: Hiển thị đầy đủ danh sách sản phẩm trong tóm tắt giỏ hàng', async () => {
        render(<CheckoutPage cart={mockCart} />);
        
        // Kiểm tra xem có render đủ 2 dòng sản phẩm không
        const summaryItems = screen.getAllByTestId('summary-item');
        expect(summaryItems).toHaveLength(2);
        
        expect(screen.getByText(/Laptop Dell/i)).toBeInTheDocument();
        expect(screen.getByText(/Mouse Logitech/i)).toBeInTheDocument();
    });

    // b) Test PriceCalculator component
    test('TC2: Hiển thị tổng giá chính xác', async () => {
        render(<CheckoutPage cart={mockCart} />);
        
        await waitFor(() => {
        // 15.000.000 * 2 + 500.000 * 1 = 30.500.000
        expect(
            screen.getByTestId('subtotal-display')
        ).toHaveTextContent('30.500.000');
        });
    });

    // c) Test InventoryWarning component
    test('TC3: Hiển thị cảnh báo khi số lượng vượt quá tồn kho', async () => {
        render(<CheckoutPage cart={mockCart} />);
        
        // Tìm component cảnh báo dựa trên ID đã đặt trong code
        const warning = screen.queryByTestId('inventory-warning');
        
        // Nếu trong code Laptop Dell có tồn kho chỉ 1 cái nhưng trong cart có 2 cái thì sẽ hiển thị cảnh báo
        expect(warning).toBeInTheDocument();
        expect(warning).toHaveTextContent(/Cảnh báo/i);
    });
});