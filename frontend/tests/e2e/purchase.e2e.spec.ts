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
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        // Giả sử hàm này thêm sản phẩm trị giá 20.100.000 VNĐ
        await cartPage.addAvailableProduct(); 
    });

    test('b) Kiểm tra tính toán chi phí: Subtotal, Discount, Final Total', async ({ page }) => {
        await cartPage.goToCheckout();
        await expect(page).toHaveURL(/.*checkout/);

        // Kiểm tra Tạm tính
        await expect(checkoutPage.subtotalPrice).toContainText('21,100,000');

        // Kiểm tra Phí ship
        await expect(checkoutPage.shippingFee).toContainText('30,000');

        // Áp dụng mã giảm giá
        await checkoutPage.applyDiscount('GIAM10');

        // Kiểm tra số tiền giảm (10% của 21.100.000 = 2.110.000)
        await expect(checkoutPage.discountAmount).toContainText('2,110,000');
        
        // Kiểm tra Tổng thanh toán cuối cùng (21.100.000 - 2.110.000 = 19.020.000)
        await expect(checkoutPage.finalTotal).toContainText('19,020,000');
    });

    test('a) Luồng hoàn chỉnh từ Giỏ hàng đến Xác nhận đơn hàng', async ({ page }) => {
        await cartPage.goToCheckout();
        
        // Thực hiện xác nhận đơn hàng
        await checkoutPage.confirmOrder();

        // Kiểm tra chuyển hướng đến trang thành công
        await expect(page).toHaveURL(/.*order-confirmation/);
        await expect(checkoutPage.successHeader).toContainText(/thành công/i);
    });
});