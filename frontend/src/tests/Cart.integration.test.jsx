import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import CartComponent from '../components/CartComponent.jsx';
import { VALID_CART, OUT_OF_STOCK_CART, EMPTY_CART, MOCK_PRODUCT_ADDTOCART } from './mockData/cart.mock';
import * as cartService from '../services/cartService';
import * as inventoryService from '../services/inventoryService';

// Mock API service
vi.mock('../services/cartService');
vi.mock('../services/inventoryService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('Cart Component Integration Tests', () => {
    
    // GIẢI PHÁP QUAN TRỌNG: Thiết lập giá trị mặc định trước mỗi Test Case
    beforeEach(() => {
        vi.clearAllMocks();
    
        inventoryService.checkStock.mockResolvedValue({ available: true });

        cartService.addToCart.mockResolvedValue({ success: true, message: 'Thành công' });
        cartService.getCart.mockResolvedValue(VALID_CART);
        cartService.updateQuantity.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        cleanup();
    });

    test('TC1: Hiển thị giỏ hàng rỗng khi chưa có sản phẩm', async () => {
        cartService.getCart.mockResolvedValue(EMPTY_CART); // Ghi đè mock cho TC này

        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
        });
    });

    test('TC2: Hiển thị danh sách sản phẩm trong giỏ hàng', async () => {
        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);

        await waitFor(() => {
            // Tìm vùng chứa cụ thể của sản phẩm Laptop trong giỏ hàng bằng data-testid
            const cartItem = screen.getByTestId('cart-item-1'); 
            
            // Tìm trong giỏ hàng
            expect(within(cartItem).getByText(/Laptop Dell/i)).toBeInTheDocument();
            
            // Kiểm tra số lượng trong giỏ hàng
            expect(screen.getByTestId('quantity-value-1')).toHaveTextContent('1');
        });
    });

    test('TC3: Tăng số lượng sản phẩm', async () => {
        let currentCart = { ...VALID_CART };
        cartService.getCart.mockImplementation(() => Promise.resolve(currentCart));
        
        cartService.updateQuantity.mockImplementation((user_id, product_id, newQty) => {
            currentCart = {
                ...currentCart,
                items: currentCart.items.map(item =>
                    item.product_id === product_id ? { ...item, quantity: newQty } : item
                )
            };
            return Promise.resolve({ success: true });
        });

        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);
        const laptopRow = await screen.findByTestId('cart-item-1'); 
        
        const increaseBtn = within(laptopRow).getByTestId('increase-qty-1');
        fireEvent.click(increaseBtn);

        const qtyValue = await screen.findByTestId('quantity-value-1');
        expect(qtyValue).toHaveTextContent('2');

    });

    test('TC4: Chuyển hướng sang trang Checkout khi dữ liệu hợp lệ', async () => {
        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);

        await screen.findAllByText(/Laptop Dell/i); 
    
        // 2. Tìm nút Checkout và click
        const checkoutBtn = await screen.findByTestId('checkout-btn');
        fireEvent.click(checkoutBtn);

        // 3. Kiểm tra điều hướng
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/checkout", { 
                state: { cartData: VALID_CART } 
            });
        });
    });

    test('TC5: Hiển thị lỗi tồn kho khi mở giỏ hàng có sẵn hàng hết kho', async () => {
        // 1. Giả lập giỏ hàng chứa sản phẩm đã hết hàng (994 - Bàn phím cơ)
        cartService.getCart.mockResolvedValue(OUT_OF_STOCK_CART); 

        // 2. Ghi đè mock checkStock để trả về lỗi cho trường hợp này
        inventoryService.checkStock.mockResolvedValue({ 
            available: false, 
            message: 'Rất tiếc, các sản phẩm sau đã hết hàng hoặc không đủ số lượng: Bàn phím cơ Keychron K2 V2' 
        });

        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);

        await screen.findAllByText(/Bàn phím cơ/i);

        // 4. Thực hiện bấm Checkout
        const checkoutBtn = await screen.findByTestId('checkout-btn');
        fireEvent.click(checkoutBtn);

        // 5. Kiểm tra thông báo lỗi
        const errorMsg = await screen.findByTestId('inventory-error');
        expect(errorMsg).toHaveTextContent(/hết hàng/i);
    });

    test('TC6: Thêm sản phẩm CÒN HÀNG thành công và hiển thị thông báo xanh', async () => {
        // Giả lập API thêm vào giỏ hàng thành công
        cartService.addToCart.mockResolvedValue({
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công'
        });

        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);
        
        // Đợi danh sách sản phẩm hiển thị
        const addBtn = await screen.findByTestId('add-999-btn');
        fireEvent.click(addBtn);

        // Đợi và kiểm tra kết quả
        await waitFor(() => {
            // Kiểm tra service được gọi đúng tham số
            expect(cartService.addToCart).toHaveBeenCalledWith('user01', expect.objectContaining({ 
                product_id: 999,
                stock: 5 
            }));
            
            // Sử dụng findBy để đợi thông báo Toast xuất hiện trên UI
            return screen.findByTestId('success-toast');
        });

        const successMsg = screen.getByTestId('success-toast');
        expect(successMsg).toHaveTextContent(/thành công/i);
    });

    test('TC7: Nút thêm sản phẩm bị khóa khi hết hàng', async () => {
        render(<BrowserRouter><CartComponent user_id="user01" /></BrowserRouter>);
        
        // P994 (Bàn phím cơ) có stock: 0 trong PRODUCT_LIST
        const addBtn = await screen.findByTestId('add-994-btn');
        
        expect(addBtn).toBeDisabled(); // Kiểm tra nút bị khóa
        expect(addBtn).toHaveTextContent(/Hết hàng/i);
    });

    test('TC8: Hiển thị thông báo lỗi khi Service.getCart bị sập (Phủ khối catch)', async () => {
        // Giả lập Service trả về một Promise bị Reject (Lỗi)
        cartService.getCart.mockRejectedValue(new Error("Database Error"));

        render(
            <BrowserRouter>
                <CartComponent user_id="user01" />
            </BrowserRouter>
        );

        // Kiểm tra xem giao diện có hiện đúng câu thông báo lỗi không
        const errorMsg = await screen.findByText(/Lỗi tải giỏ hàng/i);
        expect(errorMsg).toBeInTheDocument();
    });

    test('TC9: Hiển thị giao diện giỏ hàng trống và nút quay lại mua sắm', async () => {
        // Giả lập Service trả về giỏ hàng không có sản phẩm nào
        cartService.getCart.mockResolvedValue({ items: [], total_price: 0 });

        render(
            <BrowserRouter>
                <CartComponent user_id="user01" />
            </BrowserRouter>
        );

        // Đợi và kiểm tra dòng chữ thông báo trống và không hiện nút thanh toán
        expect(await screen.findByText(/Giỏ hàng đang trống/i)).toBeInTheDocument();

        expect(await screen.queryByTestId('checkout-btn')).not.toBeInTheDocument();
    });
});