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
       // Thêm sản phẩm còn hàng (P999)
        await cartPage.addAvailableProduct();
        
        // Kiểm tra thông báo xanh hiện lên
        await expect(cartPage.successToast).toBeVisible();
        await expect(cartPage.successToast).toContainText(/thành công/i);

        // Kiểm tra dòng sản phẩm P999 xuất hiện trong danh sách
        const p999Row = cartPage.getProductRow('P999');
        await expect(p999Row).toBeVisible();

        // Kiểm tra UI: Số lượng mặc định là 1[cite: 5]
        const qty = p999Row.locator('[data-testid^="quantity-value"]');
        await expect(qty).toHaveText('1');

        // Kiểm tra tính toán: Tổng tiền cập nhật chính xác (100,000 VNĐ)[cite: 5]
        await expect(cartPage.totalPrice).toContainText('21.100.000');
    });

    test('b) Hiển thị thông báo lỗi khi thêm sản phẩm hết hàng và giỏ hàng không thay đổi', async () => {
        // 1. Thêm sản phẩm hết hàng (P000)
        await cartPage.addOutOfStockProduct();

        // 2. Kiểm tra thông báo lỗi xuất hiện
        await expect(cartPage.inventoryError).toBeVisible();
        await expect(cartPage.inventoryError).toContainText(/hết hàng/i);

        // Tìm tất cả các hàng (row) sản phẩm đang hiển thị
        const cartItems = cartPage.page.locator('[data-testid^="cart-item-"]');
        
        // Kiểm tra xem số lượng dòng sản phẩm có đúng là 2 không
        await expect(cartItems).toHaveCount(2); 

        // 4. Kiểm tra thẻ "Giỏ hàng trống" KHÔNG ĐƯỢC hiển thị
        const emptyMsg = cartPage.page.locator('[data-testid="empty-cart-message"]');
        await expect(emptyMsg).not.toBeVisible();   
    });

    test('c) Tương tác tăng số lượng và chuyển hướng Checkout', async () => {
        await cartPage.addAvailableProduct();
        
        // Tương tác UI: Bấm nút tăng giảm số lượng
        await cartPage.increaseQty('P999');
        await cartPage.decreaseQty('P001');

        // Kiểm tra logic: Số lượng và tổng tiền
        const qtynew = cartPage.getProductRow('P999').locator('[data-testid^="quantity-value"]');
        await expect(qtynew).toHaveText('2');

        const qtyold = cartPage.getProductRow('P001').locator('[data-testid^="quantity-value"]');
        await expect(qtyold).not.toBeVisible();   

        await expect(cartPage.totalPrice).toContainText('1.200.000');

        // Tương tác UI: Chuyển hướng trang
        await cartPage.goToCheckout();

        // Kiểm tra kết quả: URL thay đổi sang trang thanh toán[cite: 5]
        await expect(cartPage.page).toHaveURL(/.*checkout/);
    });
});