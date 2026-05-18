import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'playwright/test'
import { CartPage } from '../pages/CartPage.js'
import { LoginPage } from '../pages/LoginPage.js';


//Backgroun
Given("I am logged in as {string} with password {string}", async function (username, password) {

    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate();
    await this.loginPage.usernameInput.fill(username)
    await this.loginPage.passwordInput.fill(password)
    await this.loginPage.loginButton.click()
    await expect(this.page).toHaveURL(/inventory/);
    this.cartPage = new CartPage(this.page);

})
//Action
When('I add {string} to the cart', async function (productName) {
    await this.cartPage.addToCart(productName);
})
When('I remove {string} from the product list', async function(productName) {
    await this.cartPage.removeFromProductList(productName)
})
When('I navigate to the cart page', async function () {
    await this.cartPage.goToCart();
    await expect(this.page).toHaveURL(/cart/)
})
When('I go back to the product page', async function () {
    await this.cartPage.goBackToProducts();
    await expect(this.page).toHaveURL(/inventory/)
})
//Assertions
Then('the cart badge should show {string}', async function(expectedCount) {
    expect(this.cartPage.cartBadge).toBeVisible();
    await expect(this.cartPage.cartBadge).toHaveText(expectedCount)
})
Then('the cart button should not be visible', async function () {
    await expect(this.cartPage.cartBadge).toBeHidden();

})

Then('the button for {string} should say {string}', async function (productName, expectedLabel) {
    const btn = this.cartPage.getButtonForProduct(productName);
    await expect(btn).toHaveText(new RegExp(expectedLabel, 'i'));
});
