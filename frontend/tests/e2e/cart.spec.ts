import { test } from '@playwright/test';
import { CartPage } from './page/CartPage';

test.describe('E2E: Giỏ hàng và Thanh toán', () => {
  test('Người dùng có thể thêm sản phẩm và thanh toán thành công', async ({ page }) => {
    const cartPage = new CartPage(page);

    // 1. Đi tới trang web
    await cartPage.goto();

    // 2. Thêm sản phẩm
    await cartPage.addProductToCart();
    await cartPage.verifyMessage('thành công');

    // 3. Thanh toán
    await cartPage.proceedToCheckout();
    
    // 4. Kiểm tra kết quả cuối cùng (trường hợp còn hàng)
    await cartPage.verifyMessage('Đặt hàng thành công');
  });
});