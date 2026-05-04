import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly addAvailableBtn: Locator;
  readonly addOutOfStockBtn: Locator;
  readonly checkoutBtn: Locator;
  readonly successToast: Locator;
  readonly inventoryError: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAvailableBtn = page.locator('[data-testid="add-available-btn"]');
    this.addOutOfStockBtn = page.locator('[data-testid="add-out-of-stock-btn"]');
    this.checkoutBtn = page.locator('[data-testid="checkout-btn"]');
    this.successToast = page.locator('[data-testid="success-toast"]');
    this.inventoryError = page.locator('[data-testid="inventory-error"]');
    this.totalPrice = page.locator('[data-testid="total-price"]');
  }

  // Lấy dòng sản phẩm cụ thể theo ID
  getProductRow(productId: string) {
    return this.page.locator(`[data-testid="cart-item-${productId}"]`);
  }

  async addAvailableProduct() {
    await this.addAvailableBtn.click();
  }

  async addOutOfStockProduct() {
    await this.addOutOfStockBtn.click();
  }

  async increaseQty(productId: string) {
    const row = this.getProductRow(productId);
    await row.locator(`[data-testid="increase-qty-${productId}"]`).click();
  }

  async decreaseQty(productId: string) {
    const row = this.getProductRow(productId);
    await row.locator(`[data-testid="decrease-btn-${productId}"]`).click();
  }

  async goToCheckout() {
    await this.checkoutBtn.click();
  }
}