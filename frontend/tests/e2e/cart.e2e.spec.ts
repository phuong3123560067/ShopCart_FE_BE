import { test, expect } from '@playwright/test';
import { CartPage } from '../page-object/CartPage'; // Import Class POM của bạn

test.describe('Cart E2E Tests - ShopCart System', () => {
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page); // Khởi tạo đối tượng
        await page.goto('http://localhost:5173');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('a) Luồng thêm sản phẩm vào giỏ hàng thành công', async () => {
        // Thay vì dùng locator phức tạp, gọi hàm từ POM[cite: 1]
        await cartPage.increaseQty('P001');
        const p001Qty = cartPage.getProductRow('P001').locator('[data-testid="quantity-value"]');
        await expect(p001Qty).toHaveText('2');

        await cartPage.addSampleProduct();
        await expect(cartPage.successToast).toContainText(/thành công/i);
        
        await cartPage.increaseQty('P999');
        const p999Qty = cartPage.getProductRow('P999').locator('[data-testid="quantity-value"]');
        await expect(p999Qty).toHaveText('2');

        await expect(cartPage.totalPrice).toBeVisible();
    });

    test('b) Hiển thị thông báo lỗi khi nhấn nút tăng quá tồn kho', async () => {
        await cartPage.addSampleProduct();
        
        // Vòng lặp gọn gàng hơn[cite: 1]
        for (let i = 0; i < 11; i++) {
            await cartPage.increaseQty('P999');
        }

        const qtyDisplay = cartPage.getProductRow('P999').locator('[data-testid="quantity-value"]');
        await expect(qtyDisplay).toHaveText('11');
        await expect(cartPage.inventoryError).toBeVisible();
    });
});