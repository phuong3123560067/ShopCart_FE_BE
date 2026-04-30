import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly checkoutBtn: Locator;
  readonly cartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Dùng data-testid đã có trong code của bạn để selector chuẩn nhất
    this.addToCartBtn = page.getByTestId('add-to-cart-btn');
    this.checkoutBtn = page.getByTestId('checkout-btn');
    this.cartMessage = page.locator('.message'); // Tùy chỉnh theo class thực tế của bạn
  }

  async goto() {
    await this.page.goto('http://localhost:5173');
  }

  async addProductToCart() {
    await this.addToCartBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async verifyMessage(text: string) {
    const regex = new RegExp(text, 'i');
    const locator = this.page.getByText(regex);
    
    // Đợi cho element xuất hiện trong DOM
    await locator.waitFor({ state: 'attached', timeout: 10000 });
    
    // Sau đó mới kiểm tra nó có hiển thị (visible) không
    await expect(locator).toBeVisible();
}
}