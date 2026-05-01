import { test, expect } from '@playwright/test';

test.describe('Cart E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Đi tới trang giỏ hàng (hoặc trang login tùy logic của bạn)
        await page.goto('http://localhost:5173'); 
        // Giả sử userId đã được fix cứng hoặc login tự động để vào CartComponent
    });

    // a) Test complete add-to-cart flow (0.25 điểm)
    test('Người dùng có thể thêm sản phẩm và kiểm tra giỏ hàng', async ({ page }) => {
        // 1. Nhấn nút thêm nhanh sản phẩm mẫu
        const addBtn = page.getByTestId('add-to-cart-btn');
        await addBtn.click();

        // 2. Kiểm tra message thành công
        await expect(page.getByText(/thành công/i)).toBeVisible();

        // 3. Kiểm tra UI giỏ hàng cập nhật (ví dụ: Tên sản phẩm xuất hiện)
        await expect(page.getByText('Sản phẩm mới')).toBeVisible();
        
        // 4. Kiểm tra tổng tiền có hiển thị
        const total = page.getByTestId('total-price');
        await expect(total).toContainText('USD');
    });

    // b) Test validation messages khi vượt tồn kho (0.25 điểm)
    // Trường hợp 1: Mua 1 cái -> Thành công
    test('Nên thanh toán thành công khi mua số lượng ít', async ({ page }) => {
        await page.getByTestId('add-to-cart-btn').click();
        
        // Nhấn thanh toán (mặc định số lượng là 1)
        await page.getByTestId('checkout-btn').click();

        // Kiểm tra thông báo thành công
        await expect(page.getByText(/Đặt hàng thành công/i)).toBeVisible();
    });

    // Trường hợp 2: Mua 11 cái -> Báo lỗi (Thỏa mãn yêu cầu 6.1.2b)
    test('Nên hiện thông báo lỗi khi mua quá số lượng tồn kho', async ({ page }) => {
        // 1. Thêm sản phẩm vào giỏ trước
        await page.getByTestId('add-to-cart-btn').click();

        // 2. Nhấn nút tăng số lượng (+) cho đến khi đạt 11
        const increaseBtn = page.getByTestId('increase-btn-P999'); 
        
        for (let i = 0; i < 10; i++) {
            await increaseBtn.click();
        }

        // 3. Nhấn thanh toán
        await page.getByTestId('checkout-btn').click();

        // 4. Kiểm tra thông báo lỗi
        await expect(page.getByText(/Rất tiếc, sản phẩm trong kho đã hết/i)).toBeVisible();
    });

    // c) Test UI interactions (Tăng/Giảm số lượng)
    test('Người dùng có thể tăng số lượng sản phẩm trong giỏ', async ({ page }) => {
        await page.getByTestId('add-to-cart-btn').click();
        
        // Tìm nút tăng số lượng của sản phẩm P999
        const increaseBtn = page.getByTestId('increase-btn-P999');
        await increaseBtn.click();

        // Kiểm tra số lượng hiển thị cập nhật lên 2 (dựa trên cấu trúc code React của bạn)
        await expect(page.getByText('Số lượng: 2')).toBeVisible();
    });
});