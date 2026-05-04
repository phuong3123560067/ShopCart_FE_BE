import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CartComponent from '../components/CartComponent.jsx';
import { VALID_CART, OUT_OF_STOCK_CART, EMPTY_CART, MOCK_PRODUCT_ADDTOCART } from './mockData/cart.mock';
import * as cartService from '../services/cartService';

// Mock API service
vi.mock('../services/cartService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('Cart Component Integration Tests', () => {
    
    // GIẢI PHÁP QUAN TRỌNG: Thiết lập giá trị mặc định trước mỗi Test Case
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Luôn giả lập addToCart thành công để tránh lỗi 'success' of undefined
        cartService.addToCart.mockResolvedValue({ 
            success: true, 
            message: 'Thành công' 
        });

        // Mặc định getCart trả về giỏ hàng hợp lệ (có thể ghi đè trong từng TC)
        cartService.getCart.mockResolvedValue(VALID_CART);
    });

    afterEach(() => {
        cleanup();
    });

    test('TC1: Hiển thị giỏ hàng rỗng khi chưa có sản phẩm', async () => {
        cartService.getCart.mockResolvedValue(EMPTY_CART); // Ghi đè mock cho TC này

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
        });
    });

    test('TC2: Hiển thị danh sách sản phẩm trong giỏ hàng', async () => {
        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText(/Laptop/)).toBeInTheDocument();
            expect(screen.getByTestId('quantity-value-P001')).toHaveTextContent('1');
        });
    });

    test('TC3: Tăng số lượng sản phẩm', async () => {
        let currentCart = { ...VALID_CART };
        cartService.getCart.mockImplementation(() => Promise.resolve(currentCart));
        
        cartService.updateQuantity.mockImplementation((userId, productId, newQty) => {
            currentCart = {
                ...currentCart,
                items: currentCart.items.map(item =>
                    item.productId === productId ? { ...item, quantity: newQty } : item
                )
            };
            return Promise.resolve({ success: true });
        });

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);
        await screen.findByText(/Laptop/i);

        const increaseBtn = screen.getByTestId('increase-qty-P001');
        fireEvent.click(increaseBtn);

        await waitFor(() => {
            expect(screen.getByTestId('quantity-value-P001')).toHaveTextContent('2');
        });
    });

    test('TC4: Chuyển hướng sang trang Checkout khi dữ liệu hợp lệ', async () => {
        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);

        await screen.findByText(/Laptop/i);
        const checkoutBtn = await screen.findByTestId('checkout-btn');
        fireEvent.click(checkoutBtn);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/checkout", { 
                state: { cartData: VALID_CART } 
            });
        });
    });

    test('TC5: Hiển thị lỗi tồn kho khi mở giỏ hàng có sẵn hàng hết kho', async () => {
        cartService.getCart.mockResolvedValue(OUT_OF_STOCK_CART); 

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);

        const checkoutBtn = await screen.findByTestId('checkout-btn');
        fireEvent.click(checkoutBtn);

        const errorMsg = await screen.findByTestId('inventory-error');
        expect(errorMsg).toHaveTextContent(/hết hàng/i);
    });

    test('TC6: Hiển thị lỗi khi API lấy dữ liệu giỏ hàng bị fail', async () => {
        cartService.getCart.mockRejectedValue(new Error('API Error'));

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);

        const errorMessage = await screen.findByText(/Error loading cart/i);
        expect(errorMessage).toBeInTheDocument();
    });

    // TC7: Test nút "Sản phẩm còn hàng"
    test('TC7: Thêm sản phẩm CÒN HÀNG thành công và hiển thị thông báo xanh', async () => {
        // Giả lập API trả về thành công
        cartService.addToCart.mockResolvedValue({
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công'
        });

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);
        
        // Tìm nút "Sản phẩm còn hàng" theo ID bạn đã đặt ở UI
        const addBtn = await screen.findByTestId('add-available-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // Kiểm tra xem Service có được gọi với đúng sản phẩm còn hàng không
            expect(cartService.addToCart).toHaveBeenCalledWith('user01', expect.objectContaining({ stock: 10 }));
            
            // Kiểm tra UI hiển thị thẻ thành công (success-toast)
            const successMsg = screen.getByTestId('success-toast');
            expect(successMsg).toHaveTextContent(/thành công/i);
        });
    });

    test('TC8: Thêm sản phẩm HẾT HÀNG thất bại và hiển thị thông báo đỏ', async () => {
        // Giả lập API trả về thất bại
        cartService.addToCart.mockResolvedValue({
            success: false,
            message: 'Sản phẩm đã hết hàng'
        });

        render(<BrowserRouter><CartComponent userId="user01" /></BrowserRouter>);
        
        // Tìm nút "Sản phẩm hết hàng" theo ID bạn đã đặt ở UI
        const addBtn = await screen.findByTestId('add-out-of-stock-btn');
        fireEvent.click(addBtn);

        await waitFor(() => {
            // Kiểm tra UI hiển thị thẻ lỗi (inventory-error)
            const errorMsg = screen.getByTestId('inventory-error');
            expect(errorMsg).toHaveTextContent(/hết hàng/i);
        });
    });
});