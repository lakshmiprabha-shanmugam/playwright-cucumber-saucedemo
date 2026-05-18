import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CartPage }          from '../pages/CartPage.js';
import { LoginPage }         from '../pages/LoginPage.js';
import { LogoutPage }        from '../pages/LogoutPage.js';
import { CheckoutPage }      from '../pages/CheckoutPage.js';
import { ProductPage }       from '../pages/ProductPage.js';
import { SortPage }          from '../pages/SortPage.js';
import { AccessibilityPage } from '../pages/AccessibilityPage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

setDefaultTimeout(60 * 1000);

const BROWSER_NAME = (process.env.BROWSER || 'chromium').toLowerCase();
const BROWSERS     = { chromium, firefox, webkit };
const AUTH_FILE    = path.join(__dirname, `../../auth-${BROWSER_NAME}.json`);

let browser;

BeforeAll(async function () {
  browser = await BROWSERS[BROWSER_NAME].launch({ headless: false });

  const context = await browser.newContext();
  const page    = await context.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL(/inventory/);
  await context.storageState({ path: AUTH_FILE });
  await context.close();
});

Before({ tags: 'not @api' }, async function (scenario) {
  const tags         = scenario.pickle.tags.map(t => t.name);
  const isLogoutTest = tags.includes('@logout') ||
    scenario.pickle.name.toLowerCase().includes('logout');

  this.context = await browser.newContext({
    storageState : isLogoutTest ? undefined : AUTH_FILE,
    viewport     : { width: 1280, height: 720 },
  });

  this.page = await this.context.newPage();

  if (!isLogoutTest) {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  this.loginPage    = new LoginPage(this.page);
  this.cartPage     = new CartPage(this.page);
  this.logoutPage   = new LogoutPage(this.page);
  this.checkoutPage = new CheckoutPage(this.page);
  this.productPage  = new ProductPage(this.page);
  this.sortPage     = new SortPage(this.page);
  this.a11yPage     = new AccessibilityPage(this.page);
  this.scenarioName = scenario.pickle.name;
});

After({ tags: 'not @api' }, async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
    this.attach(`Browser: ${BROWSER_NAME}`, 'text/plain');
    this.attach(`Failed at URL: ${this.page.url()}`, 'text/plain');
  }
  await this.context.close();
});

AfterAll(async function () {
  if (fs.existsSync(AUTH_FILE)) fs.unlinkSync(AUTH_FILE);
  await browser.close();
});
