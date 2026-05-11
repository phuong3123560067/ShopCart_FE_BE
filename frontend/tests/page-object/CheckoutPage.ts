import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly discountInput: Locator;
  readonly applyBtn: Locator;
  readonly discountAmount: Locator;
  readonly subtotalPrice: Locator;
  readonly shippingFee: Locator;
  readonly finalTotal: Locator;
  readonly confirmBtn: Locator;
  readonly inventoryError: Locator;

  constructor(page: Page) {
    this.page = page;
    // Login
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginBtn = page.locator('button[type="submit"]');

    // Checkout
    this.discountInput = page.locator('input[placeholder*="Nhập mã"]'); 
    this.applyBtn = page.locator('button:has-text("Áp dụng")');
    this.discountAmount = page.locator('[data-testid="discount-amount"]');
    this.subtotalPrice = page.locator('[data-testid="subtotal-price"]');
    this.shippingFee = page.locator('[data-testid="shipping-fee"]');
    this.finalTotal = page.locator('[data-testid="final-total"]');
    this.confirmBtn = page.locator('[data-testid="confirm-checkout"]');
    this.inventoryError = page.locator('[data-testid="inventory-error"]');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginBtn.click();
  }

  async applyDiscount(code: string) {
    await this.discountInput.fill(code);
    await this.applyBtn.click();
  }
}