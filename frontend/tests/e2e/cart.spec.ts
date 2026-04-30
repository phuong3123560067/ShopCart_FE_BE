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

        // 2. Kiểm tra message thành công (Khớp với code React bạn đã sửa)
        // Dùng regex /cong/i để an toàn cho cả có dấu và không dấu
        await expect(page.getByText(/thành công/i)).toBeVisible();

        // 3. Kiểm tra UI giỏ hàng cập nhật (ví dụ: Tên sản phẩm xuất hiện)
        await expect(page.getByText('Sản phẩm mới')).toBeVisible();
        
        // 4. Kiểm tra tổng tiền có hiển thị
        const total = page.getByTestId('total-price');
        await expect(total).toContainText('USD');
    });

    // b) Test validation messages khi vượt tồn kho (0.25 điểm)
    test('Hiển thị thông báo lỗi khi sản phẩm trong kho đã hết', async ({ page }) => {
        // Giả lập tình huống: Thêm sản phẩm vào giỏ trước
        await page.getByTestId('add-to-cart-btn').click();
        
        /* 
           Kịch bản: Nhấn Thanh toán ngay. 
           Nếu inventoryService.checkStock trả về false (hết hàng),
           React sẽ setMessage("Rất tiếc, sản phẩm trong kho đã hết!")
        */
        const checkoutBtn = page.getByTestId('checkout-btn');
        await checkoutBtn.click();

        // Kiểm tra thông báo lỗi từ hàm handleCheckout
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