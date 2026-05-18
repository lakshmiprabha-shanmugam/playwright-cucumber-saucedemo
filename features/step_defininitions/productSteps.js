import {When, Then} from '@cucumber/cucumber'
import { expect } from 'playwright/test'
import { ProductPage } from '../pages/ProductPage.js'
// ─── Actions ─────────────────────────────────────────────────────────────────

When('I click on product {string}', async function (productName) {
  this.productPage = new ProductPage(this.page);
  await this.productPage.clickProduct(productName);
});

When('I click the back button', async function () {
  await this.productPage.clickBackButton();
});

When('I add the product to cart from detail page', async function () {
  await this.productPage.addToCartFromDetail();
});

When('I remove the product from cart on detail page', async function () {
  await this.productPage.removeFromCartOnDetail();
});

// ─── Assertions ──────────────────────────────────────────────────────────────

Then('I should be on the product detail page', async function () {
  await expect(this.page).toHaveURL(/inventory-item/);
});

Then('I should be on the products page', async function () {
  await expect(this.page).toHaveURL(/inventory/);
  await expect(this.productPage.pageTitle).toHaveText('Products');
});

Then('the product name should be {string}', async function (expectedName) {
  await expect(this.productPage.detailName).toBeVisible();
  await expect(this.productPage.detailName).toHaveText(expectedName);
});

Then('the product price should be {string}', async function (expectedPrice) {
  await expect(this.productPage.detailPrice).toBeVisible();
  await expect(this.productPage.detailPrice).toHaveText(expectedPrice);
});

Then('I should see a product description', async function () {
  await expect(this.productPage.detailDesc).toBeVisible();
  const text = await this.productPage.detailDesc.innerText();
  expect(text.trim().length).toBeGreaterThan(0);
});

Then('the button should say {string}', async function (expectedLabel) {
  if (expectedLabel.toLowerCase() === 'remove') {
    await expect(this.productPage.removeBtn).toBeVisible();
  } else {
    await expect(this.productPage.addToCartBtn).toBeVisible();
  }
});

Then('the cart badge should not be visible', async function () {
  await expect(this.productPage.cartBadge).toBeHidden();
});