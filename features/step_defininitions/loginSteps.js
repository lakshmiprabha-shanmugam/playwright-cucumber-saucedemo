import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert/strict'
import { LoginPage } from '../pages/LoginPage.js'

//Background
Given("I am on the login page", async function () {
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate();
});

//Actions
When("I enter username {string}", async function (username) {
    await this.loginPage.usernameInput.fill(username)
})
When("I enter password {string}", async function (password) {
    await this.loginPage.passwordInput.fill(password)
})
When("I click on login button", async function () {
    await this.loginPage.loginButton.click()
})
//Assertions
Then("user should see the products page", async function () {
    assert.match(this.page.url(), /inventory/);
})
Then("user should see the error {string}", async function (msg) {
   try{ const errorText = await this.loginPage.errorMessage.textContent();
    console.log("Display error message:", errorText)
    assert.match(errorText ?? '', new RegExp(msg));
   } catch (error) {
    console.log("Error validation failed:", error.message);
    throw error;
   }
})



