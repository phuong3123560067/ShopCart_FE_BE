import { Page, Locator, expect } from '@playwright/test';

export default class CheckoutPage {
    readonly page: Page;
    readonly addressInput: Locator;
    readonly checkoutBtn: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
    this.page = page;
    this.addressInput = page.getByTestId('address-input');
    this.checkoutBtn = page.getByTestId('place-order-btn');
    this.successMessage = page.getByText(/Đặt hàng thành công/i);
    }

    async fillInfo(address: string) {
    await this.addressInput.fill(address);
    }

    async placeOrder() {
    await this.checkoutBtn.click();
    }
}