import {When, Then} from '@cucumber/cucumber'
import { expect } from 'playwright/test'
import {  SortPage } from '../pages/SortPage.js'

// ─── Actions ─────────────────────────────────────────────────────────────────

When('I sort products by {string}', async function (option) {
  this.sortPage = new SortPage(this.page);
  await this.sortPage.sortBy(option);
});

// ─── Assertions ──────────────────────────────────────────────────────────────

Then('the first product should be {string}', async function (expectedName) {
  const firstName = await this.sortPage.getFirstProductName();
  expect(firstName.trim()).toBe(expectedName);
});

Then('the last product should be {string}', async function (expectedName) {
  const lastName = await this.sortPage.getLastProductName();
  expect(lastName.trim()).toBe(expectedName);
});

Then('there should be {string} products on the page', async function (expectedCount) {
  const count = await this.sortPage.getProductCount();
  expect(count).toBe(parseInt(expectedCount));
});