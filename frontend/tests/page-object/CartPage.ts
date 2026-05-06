import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // Các Locators cho Login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;

  // Các Locators cho Cart
  readonly successToast: Locator;
  readonly inventoryError: Locator;
  readonly totalPrice: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Khởi tạo locator cho trang Login
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginBtn = page.locator('button[type="submit"]');

    // Khởi tạo locator cho trang Cart
    this.successToast = page.locator('[data-testid="success-toast"]');
    this.inventoryError = page.locator('[data-testid="inventory-error"]');
    this.totalPrice = page.locator('[data-testid="total-price"]');
    this.checkoutBtn = page.locator('[data-testid="checkout-btn"]');
  }

  // Phương thức đăng nhập đồng nhất
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginBtn.click();
    // Đợi đến khi chuyển hướng sang trang cart thành công
    await this.page.waitForURL('**/cart', { timeout: 10000 });
  }
  // Locator linh động cho từng sản phẩm trong danh sách bán
  getAddBtn(product_id: string | number) {
    return this.page.locator(`[data-testid="add-${product_id}-btn"]`);
  }

  // Locator cho sản phẩm trong giỏ hàng
  getCartItem(product_id: string | number) {
    return this.page.locator(`[data-testid="cart-item-${product_id}"]`);
  }

  getQtyValue(product_id: string | number) {
    return this.page.locator(`[data-testid="quantity-value-${product_id}"]`);
  }

  getIncreaseBtn(product_id: string | number) {
    return this.page.locator(`[data-testid="increase-qty-${product_id}"]`);
  }    

  async goToCheckout() {
    await this.checkoutBtn.click();
  }
}