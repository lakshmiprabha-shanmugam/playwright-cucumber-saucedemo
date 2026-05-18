import { When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage.js'


// ─── Actions ─────────────────────────────────────────────────────────────────

When('I go to the cart', async function () {
  this.checkoutPage = new CheckoutPage(this.page);
  await this.checkoutPage.goToCart();
});

When('I proceed to checkout', async function () {
  await this.checkoutPage.proceedToCheckout();
});

When('I enter first name {string} last name {string} zip {string}', async function (firstName, lastName, zip) {
  await this.checkoutPage.fillCustomerInfo(firstName, lastName, zip);
});

When('I click continue', async function () {
  await this.checkoutPage.clickContinue();
});

When('I click finish', async function () {
  await this.checkoutPage.clickFinish();
});

// ─── Assertions ──────────────────────────────────────────────────────────────

Then('I should see {string}', async function (expectedText) {
  await expect(this.checkoutPage.confirmationHeader).toBeVisible();
  await expect(this.checkoutPage.confirmationHeader).toHaveText(expectedText);
});

Then('I should see checkout error {string}', async function (expectedError) {
  await expect(this.checkoutPage.errorMessage).toBeVisible();
  await expect(this.checkoutPage.errorMessage).toContainText(expectedError);
});

Then('I should see {string} in the order summary', async function (productName) {
  const item = this.checkoutPage.getSummaryItemByName(productName);
  await expect(item).toBeVisible();
});

Then('I should see the payment information', async function () {
  await expect(this.checkoutPage.paymentInfo).toBeVisible();
});

Then('I should see the total price', async function () {
  await expect(this.checkoutPage.totalPrice).toBeVisible();
});