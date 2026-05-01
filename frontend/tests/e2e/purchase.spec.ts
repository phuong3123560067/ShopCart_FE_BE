import { test, expect } from '@playwright/test';
import CheckoutPage from './page/CheckoutPage';

test.describe('Purchase E2E Tests', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        
        // Bước 1: Vào trang chủ để thiết lập localStorage
        await page.goto('http://localhost:5173');

        // Bước 2: Bơm dữ liệu mẫu vào giỏ hàng
        // Giá 100.000 x số lượng 2 = 200.000đ
        await page.evaluate(() => {
            const mockCart = [{ id: 'P999', name: 'Áo thể thao', price: 100000, quantity: 2 }];
            localStorage.setItem('cart', JSON.stringify(mockCart));
            localStorage.setItem('token', 'mock-token'); // Giả lập đã đăng nhập
        });

        // Bước 3: Chuyển hướng sang trang thanh toán
        await page.goto('http://localhost:5173/checkout');
    });

    // --- Câu b: Test tính giá chính xác (0.25 điểm) ---
    test('Nên hiển thị đúng các thành phần giá tiền', async ({ page }) => {
        // Kiểm tra Tạm tính: 100k * 2 = 200k
        await expect(page.getByTestId('subtotal-display')).toContainText('200.000');

        // Kiểm tra phí ship (giả sử mặc định trong code là 30.000đ)
        await expect(page.getByTestId('shipping-display')).toContainText('30.000');

        // Tổng cộng: 200.000 + 30.000 = 230.000đ
        await expect(page.getByTestId('total-display')).toContainText('230.000');
    });

    // --- Câu a: Test complete checkout flow (0.25 điểm) ---
    test('Nên đặt hàng thành công khi điền đầy đủ thông tin', async ({ page }) => {
        // Điền địa chỉ (sử dụng Page Object Model bạn đã tạo)
        await checkoutPage.fillInfo('123 Đường ABC, TP.HCM');

        // Nhấn nút đặt hàng
        await checkoutPage.placeOrder();

        // Kiểm tra thông báo thành công
        // Lưu ý: data-testid hoặc text phải khớp với component Success của bạn
        await expect(page.getByText(/Đặt hàng thành công/i)).toBeVisible();
        
        // Kiểm tra URL thay đổi sang trang xác nhận
        await expect(page).toHaveURL(/\/order-confirmation/);
    });
});