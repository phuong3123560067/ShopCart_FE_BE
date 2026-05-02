import { test, expect } from '@playwright/test';
import { CartPage } from '../page-object/CartPage';
import { CheckoutPage } from '../page-object/CheckoutPage'; // Import cả 2 trang[cite: 2]

test.describe('Purchase E2E Tests - ShopCart System', () => {
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        
        await page.goto('http://localhost:5173');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await cartPage.addSampleProduct();
    });

    test('b) Kiểm tra tính toán chi phí: Subtotal, Discount, Shipping', async ({ page }) => {
        // Sử dụng hành động từ Class
        await cartPage.goToCheckout();
        await expect(page).toHaveURL(/.*checkout/);

        // Kiểm tra Subtotal thông qua locator đã khai báo trong CheckoutPage[cite: 4]
        // (Lưu ý: Nếu CheckoutPage chưa có subtotalPrice, bạn có thể thêm vào constructor của nó)
        const subtotal = page.locator('[data-testid="subtotal-price"]');
        await expect(subtotal).toContainText('20,100,000'); 

        // Áp dụng mã giảm giá bằng hàm[cite: 2, 4]
        await checkoutPage.applyDiscount('GIAM10');

        await expect(page.locator('[data-testid="discount-amount"]')).toContainText('2,010,000');
        await expect(checkoutPage.finalTotal).toContainText('18,120,000');
    });

    test('a) Luồng hoàn chỉnh từ Giỏ hàng đến Thanh toán', async ({ page }) => {
        await cartPage.goToCheckout();
        await checkoutPage.confirmOrder(); // Gọi hàm confirmOrder[cite: 2, 4]

        await expect(page).toHaveURL(/.*order-confirmation/);
        await expect(checkoutPage.successHeader).toContainText(/thành công/i);
    });
});