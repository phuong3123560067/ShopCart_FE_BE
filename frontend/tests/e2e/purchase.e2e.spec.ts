import { test, expect } from '@playwright/test';
import { CartPage } from '../page-object/CartPage';
import { CheckoutPage } from '../page-object/CheckoutPage';

test.describe('Purchase E2E Tests - ShopCart System', () => {
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        
        await page.goto('http://localhost:5173');
        
        // Đăng nhập thật để đồng nhất luồng
        await cartPage.login('test@gmail.com', '123'); 
        
        // Thêm Laptop Dell (ID: 1, Giá 20.000.000)[cite: 14]
        await cartPage.getAddBtn(1).click();
        await expect(cartPage.successToast).toBeVisible();
        
        // Đi đến trang Checkout
        await cartPage.goToCheckout();
    });

    test('b) Kiểm tra tính toán chi phí: Subtotal, Discount, Final Total', async () => {
        // Laptop Dell: 20.000.000
        await expect(checkoutPage.subtotalPrice).toContainText('20.000.000');
        
        // Phí ship mặc định: 30.000
        await expect(checkoutPage.shippingFee).toContainText('30.000');

        // Áp dụng mã GIAM10 (Giảm 10% của 20M = 2M)
        await checkoutPage.applyDiscount('GIAM10');
        await expect(checkoutPage.discountAmount).toContainText('2.000.000')
        
        // Tổng: 20M - 2M + 30k = 18.030.000
        await expect(checkoutPage.finalTotal).toContainText('18.030.000');
    });

    test('a) Test complete checkout flow', async ({ page }) => {
        // Nhấn nút xác nhận thanh toán
        await checkoutPage.confirmBtn.click();

        // Kiểm tra chuyển hướng và thông báo thành công
        await expect(page).toHaveURL(/.*order-confirmation/);
        await expect(page.locator('h2')).toContainText(/thành công/i);
    });
});