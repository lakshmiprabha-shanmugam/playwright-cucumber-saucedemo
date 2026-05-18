export class LogoutPage {
  constructor(page) {
    this.page          = page;
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn');
    this.logoutLink    = page.locator('#logout_sidebar_link');
    this.usernameInput = page.locator('#user-name');
  }

  async openMenu() {
    await this.burgerMenuBtn.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async logout() {
    await this.openMenu();
    await this.clickLogout();
  }
}

