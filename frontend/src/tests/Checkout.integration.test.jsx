import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CheckoutPage from '../components/CheckoutPage';
import SuccessPage from '../components/SuccessPage';
import * as orderService from '../services/orderService';
import * as inventoryService from '../services/inventoryService';
import { MemoryRouter } from 'react-router-dom';
import { VALID_CART, OUT_OF_STOCK_CART } from './mockData/cart.mock';

// Giả lập hàm điều hướng
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

// Giả lập service
vi.mock('../services/orderService');
vi.mock('../services/inventoryService');

describe('Checkout Integration Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock các hàm inventory
        inventoryService.initializeInventory.mockImplementation(() => {});
        inventoryService.decreaseStockAfterPurchase.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Hàm render
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
            expect(screen.getByTestId('subtotal-price')).toHaveTextContent('21.000.000');
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

    test('TC4: Áp dụng mã giảm giá GIAM10 thành công', async () => {
        renderCheckout(VALID_CART);
        
        const input = screen.getByPlaceholderText(/Nhập mã/i);
        const applyBtn = screen.getByText('Áp dụng');

        // Giả lập nhập mã và click
        fireEvent.change(input, { target: { value: 'GIAM10' } });
        fireEvent.click(applyBtn);

        // Kiểm tra thông báo thành công và tiền giảm có nhảy không
        expect(screen.getByText(/thành công/i)).toBeInTheDocument();
        expect(screen.getByTestId('discount-amount')).not.toHaveTextContent('-0 VNĐ');
    });

    test('TC5: Hoàn tất đặt hàng, hiển thị mã đơn và có thể nhấn Tiếp tục mua sắm', async () => {
        // Mock API trả về mã đơn hàng ORD-123
        const mockOrder_id = 'ORD-123';
        vi.mocked(orderService.createOrder).mockResolvedValue({ 
            order_id: mockOrder_id 
        });

        // Mock trừ tồn kho
        const decreaseStockSpy = vi.spyOn(inventoryService, 'decreaseStockAfterPurchase');

        renderCheckout(VALID_CART);
        
        // Nhấn nút "Xác nhận đặt hàng ngay"
        const confirmBtn = screen.getByTestId('confirm-checkout');
        fireEvent.click(confirmBtn);

        // 3. Kiểm tra hệ thống chuyển hướng sang trang SuccessPage (đường dẫn /order-confirmation)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
                "/order-confirmation", 
                expect.objectContaining({ 
                    state: { order_id: mockOrder_id } 
                })
            );
        });

        // Kiểm tra có gọi trừ tồn kho không
        expect(decreaseStockSpy).toHaveBeenCalledWith(VALID_CART.items);

        // 4. Test nút "Tiếp tục mua sắm"
        render(
            <MemoryRouter initialEntries={[{ pathname: '/order-confirmation', state: { order_id: mockOrder_id } }]}>
                <SuccessPage />
            </MemoryRouter>
        );

        // Kiểm tra mã đơn hàng có hiện đúng ORD-123 không
        expect(screen.getByText(mockOrder_id)).toBeInTheDocument();

        // Kiểm tra nút "Tiếp tục mua sắm" có hoạt động không
        const continueBtn = screen.getByText(/Tiếp tục mua sắm/i);
        fireEvent.click(continueBtn);
        
        // Kiểm tra xem nó có quay lại trang giỏ hàng (hoặc trang chủ) không
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    test('TC6: Quay lại trang giỏ hàng khi nhấn nút Quay lại', () => {
        renderCheckout(VALID_CART);
        const backBtn = screen.getByText(/quay lại giỏ hàng/i);
        
        fireEvent.click(backBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    test('TC7: Hiển thị thông báo khi không có dữ liệu giỏ hàng', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/checkout', state: null }]}>
                <CheckoutPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/Không có dữ liệu thanh toán/i)).toBeInTheDocument();
    });

    test('TC8: Xử lý mã giảm giá không hợp lệ', () => {
        renderCheckout(VALID_CART);
        const input = screen.getByPlaceholderText(/Nhập mã/i);
        const applyBtn = screen.getByText('Áp dụng');

        fireEvent.change(input, { target: { value: 'SAI_MA' } });
        fireEvent.click(applyBtn);

        expect(screen.getByText(/Mã giảm giá không hợp lệ/i)).toBeInTheDocument();
        expect(screen.getByTestId('discount-amount')).toHaveTextContent('-0 VNĐ');
    });

    test('TC9: Xử lý mã không đủ điều kiện đơn hàng tối thiểu', () => {
        // Tạo giỏ hàng giá trị thấp (ví dụ 50.000đ)
        const lowValueCart = { ...VALID_CART, items: [{ name: 'Pin', price: 50000, quantity: 1 }] };
        renderCheckout(lowValueCart);
        
        const input = screen.getByPlaceholderText(/Nhập mã/i);
        fireEvent.change(input, { target: { value: 'GIAM10' } }); // Giả sử mã này yêu cầu minOrder cao hơn
        fireEvent.click(screen.getByText('Áp dụng'));

        expect(screen.getByText(/Đơn hàng phải từ/i)).toBeInTheDocument();
    });

    test('TC10: Kiểm tra hành động rê chuột', () => {
        renderCheckout(VALID_CART);
        const confirmBtn = screen.getByTestId('confirm-checkout');

        // Giả lập hành động hover để kích hoạt onMouseEnter/onMouseLeave
        fireEvent.mouseEnter(confirmBtn);
        expect(confirmBtn.style.backgroundColor).toBe('rgb(47, 133, 90)');

        fireEvent.mouseLeave(confirmBtn);
        expect(confirmBtn.style.backgroundColor).toBe('rgb(56, 161, 105)');
    });

    test('TC11: Hiển thị thông báo khi nhập mã giảm giá linh tinh', async () => {
        renderCheckout(VALID_CART);
        const input = screen.getByPlaceholderText(/Nhập mã/i);
        const applyBtn = screen.getByText('Áp dụng');

        fireEvent.change(input, { target: { value: 'LUA_DAO_100K' } });
        fireEvent.click(applyBtn);

        // Dòng này giúp phủ nhánh báo lỗi promo không tồn tại
        expect(screen.getByText(/Mã giảm giá không hợp lệ/i)).toBeInTheDocument();
    });

    test('TC12: Hiển thị alert khi đặt hàng thất bại từ phía server', async () => {
        // Giả lập window.alert vì trong code bạn dùng alert()
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        
        // Mock createOrder trả về success: false
        vi.mocked(orderService.createOrder).mockResolvedValue({ 
            success: false, 
            message: 'Lỗi kết nối server' 
        });

        renderCheckout(VALID_CART);
        const confirmBtn = screen.getByTestId('confirm-checkout');
        
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Lỗi kết nối server'));
        });
        
        alertMock.mockRestore();
    });

});