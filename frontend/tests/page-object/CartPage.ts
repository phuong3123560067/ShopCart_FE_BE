import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly addSampleBtn: Locator;
  readonly checkoutBtn: Locator;
  readonly successToast: Locator;
  readonly inventoryError: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addSampleBtn = page.locator('[data-testid="add-to-cart-btn"]');
    this.checkoutBtn = page.locator('[data-testid="checkout-btn"]');
    this.successToast = page.locator('[data-testid="success-toast"]');
    this.inventoryError = page.locator('[data-testid="inventory-error"]');
    this.totalPrice = page.locator('[data-testid="total-price"]');
  }

  // Lấy dòng sản phẩm cụ thể theo ID
  getProductRow(productId: string) {
    return this.page.locator(`[data-testid="cart-item-${productId}"]`);
  }

  async addSampleProduct() {
    await this.addSampleBtn.click();
  }

  async increaseQty(productId: string) {
    const row = this.getProductRow(productId);
    await row.locator('[data-testid="increase-qty-btn"]').click();
  }

  async goToCheckout() {
    await this.checkoutBtn.click();
  }
}