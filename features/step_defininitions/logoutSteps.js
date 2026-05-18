import {When, Then} from '@cucumber/cucumber'
import { expect } from 'playwright/test'
import { LogoutPage } from '../pages/LogoutPage.js'

When('I open the burger menu', async function () {
  this.logoutPage = new LogoutPage(this.page);
  await this.logoutPage.openMenu();
});

When('I click logout', async function () {
  await this.logoutPage.clickLogout();
});

When('I try to access the inventory page directly', async function () {
  await this.page.goto('https://www.saucedemo.com/inventory.html');
});

Then('I should be redirected to the login page', async function () {
  await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  await expect(this.logoutPage.usernameInput).toBeVisible();
});