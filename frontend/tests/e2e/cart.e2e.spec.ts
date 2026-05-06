import { test, expect } from '@playwright/test';
import { CartPage } from '../page-object/CartPage';

test.describe('ShopCart System - E2E Tests', () => {
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page);
        
        // 1. Đi đến trang gốc (thường là Login)
        await page.goto('http://localhost:5173');
        
        // 2. Thực hiện đăng nhập thông qua phương thức đã định nghĩa trong POM
        // Sử dụng tài khoản test từ mock data của bạn
        await cartPage.login('test@gmail.com', '123');

        // 3. Đảm bảo PRODUCT_LIST đã được tải xong sau khi đăng nhập
        await page.waitForLoadState('networkidle');
    });

    test('a) Test complete add-to-cart flow', async () => {
        // Thêm sản phẩm ID 1 (Laptop Dell)
        const addBtn = cartPage.getAddBtn(1);
        await addBtn.waitFor({ state: 'visible' }); // Đợi nút xuất hiện để tránh Timeout
        await addBtn.click();

        // Kiểm tra thông báo và giỏ hàng
        await expect(cartPage.successToast).toBeVisible();
        await expect(cartPage.getCartItem(1)).toBeVisible();
        
        // Kiểm tra tổng tiền (Ví dụ: 20.000.000 VNĐ)
        await expect(cartPage.totalPrice).toContainText('20.000.000');
    });

    test('b) Test validation messages khi vượt tồn kho', async () => {
        // Sử dụng sản phẩm S24 Ultra (ID: 996) có stock là 3
        const productId = 996;
        const maxStock = 3;

        // 1. Thêm vào giỏ hàng
        await cartPage.getAddBtn(productId).click();

        // 2. Bấm tăng số lượng đến khi vượt mức 3
        for (let i = 0; i < maxStock; i++) {
            await cartPage.getIncreaseBtn(productId).click();
        }

        // 3. Kiểm tra thông báo lỗi validation hiện ra
        await expect(cartPage.inventoryError).toBeVisible();
        await expect(cartPage.inventoryError).toContainText(`chỉ còn ${maxStock} sản phẩm`);

        // 4. Số lượng trên UI không được vượt quá maxStock
        await expect(cartPage.getQtyValue(productId)).toHaveText(maxStock.toString());
    });

    test('c) Test UI elements interactions và navigation', async () => {
        // 1. Kiểm tra trạng thái nút của sản phẩm hết hàng (ID: 994)
        const outOfStockBtn = cartPage.getAddBtn(994);
        await expect(outOfStockBtn).toBeDisabled();
        await expect(outOfStockBtn).toHaveText('Hết hàng');

        // 2. Thêm sản phẩm và đi tới Checkout[cite: 5]
        await cartPage.getAddBtn(999).click();
        await cartPage.checkoutBtn.click();

        // 3. Kiểm tra chuyển hướng URL
        await expect(cartPage.page).toHaveURL(/.*checkout/);
    });
});