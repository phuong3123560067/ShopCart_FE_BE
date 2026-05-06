import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly discountInput: Locator;
  readonly discount_amount: Locator;
  readonly applyBtn: Locator;
  readonly subtotalPrice: Locator;
  readonly shippingFee: Locator;
  readonly finalTotal: Locator;
  readonly confirmBtn: Locator;
  readonly successHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discountInput = page.locator('input[placeholder*="GIAM10"]'); 
    this.discount_amount = page.locator('[data-testid="discount-amount"]');
    this.applyBtn = page.locator('button:has-text("Áp dụng")');
    this.subtotalPrice = page.locator('[data-testid="subtotal-price"]');
    this.shippingFee = page.locator('[data-testid="shipping-fee"]');
    this.finalTotal = page.locator('[data-testid="final-total"]');
    this.confirmBtn = page.locator('[data-testid="confirm-checkout"]');
    this.successHeader = page.locator('h2');
  }

  async applyDiscount(code: string) {
    await this.discountInput.fill(code);
    await this.applyBtn.click();
  }

  async confirmOrder() {
    await this.confirmBtn.click();
  }
}