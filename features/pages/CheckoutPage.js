export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Cart page
    this.checkoutButton     = page.locator('[data-test="checkout"]');

    // Checkout step one — customer info
    this.firstNameInput     = page.locator('[data-test="firstName"]');
    this.lastNameInput      = page.locator('[data-test="lastName"]');
    this.zipCodeInput       = page.locator('[data-test="postalCode"]');
    this.continueButton     = page.locator('[data-test="continue"]');
    this.errorMessage       = page.locator('[data-test="error"]');

    // Checkout step two — order summary
    this.finishButton       = page.locator('[data-test="finish"]');
    this.summaryItems       = page.locator('.cart_item');
    this.paymentInfo        = page.locator('[data-test="payment-info-value"]');
    this.totalPrice         = page.locator('.summary_total_label');

    // Checkout complete
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async goToCart() {
    await this.page.locator('.shopping_cart_link').click();
    await this.page.waitForURL(/cart/);
  }

  async proceedToCheckout() {
    await this.checkoutButton.waitFor({ state: 'visible' });
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout-step-one/);
  }

  async fillCustomerInfo(firstName, lastName, zip) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zip);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickFinish() {
    await this.finishButton.waitFor({ state: 'visible' });
    await this.finishButton.click();
    await this.page.waitForURL(/checkout-complete/);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  getSummaryItemByName(productName) {
    return this.summaryItems.filter({ hasText: productName });
  }
}