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
  getProductRow(product_id: string) {
    return this.page.locator(`[data-testid="cart-item-${product_id}"]`);
  }

  async addAvailableProduct() {
    await this.addAvailableBtn.click();
  }

  async addOutOfStockProduct() {
    await this.addOutOfStockBtn.click();
  }

  async increaseQty(product_id: string) {
    const row = this.getProductRow(product_id);
    await row.locator(`[data-testid="increase-qty-${product_id}"]`).click();
  }

  async decreaseQty(product_id: string) {
    const row = this.getProductRow(product_id);
    await row.locator(`[data-testid="decrease-btn-${product_id}"]`).click();
  }

  async goToCheckout() {
    await this.checkoutBtn.click();
  }
}