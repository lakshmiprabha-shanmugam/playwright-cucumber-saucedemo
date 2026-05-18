import { Then, Before } from '@cucumber/cucumber'
import { expect } from 'playwright/test'
import { AccessibilityPage } from '../pages/AccessibilityPage.js'

Before({ tags: '@accessibility' }, async function () {
  this.a11yPage = new AccessibilityPage(this.page);
});

Then('the page should have no accessibility violations', async function () {
  const violations = await this.a11yPage.checkAccessibility();

  if (violations.length > 0) {
    const report = this.a11yPage.formatViolations(violations);
    this.attach(report, 'text/plain');
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }

  expect(
    violations.length,
    `Found ${violations.length} accessibility violation(s):\n\n` +
    this.a11yPage.formatViolations(violations)
  ).toBe(0);
});

Then('I should be able to tab through the login form', async function () {
  await this.page.keyboard.press('Tab');
  const focused = await this.page.evaluate(() => document.activeElement.tagName);
  expect(['INPUT', 'BUTTON', 'A']).toContain(focused);
});

Then('the username field should be focusable', async function () {
  await this.page.focus('[data-test="username"]');
  const isFocused = await this.page.evaluate(
    () => document.activeElement.getAttribute('data-test') === 'username'
  );
  expect(isFocused).toBe(true);
});

Then('the password field should be focusable', async function () {
  await this.page.focus('[data-test="password"]');
  const isFocused = await this.page.evaluate(
    () => document.activeElement.getAttribute('data-test') === 'password'
  );
  expect(isFocused).toBe(true);
});

Then('the login button should be focusable', async function () {
  await this.page.focus('[data-test="login-button"]');
  const isFocused = await this.page.evaluate(
    () => document.activeElement.getAttribute('data-test') === 'login-button'
  );
  expect(isFocused).toBe(true);
});

Then('all images should have alt text', async function () {
  const violations = await this.a11yPage.checkImagesHaveAltText();

  if (violations.length > 0) {
    this.attach(violations.join('\n'), 'text/plain');
  }

  expect(
    violations.length,
    `Found ${violations.length} image(s) missing alt text:\n${violations.join('\n')}`
  ).toBe(0);
});

Then('the page should have a main heading', async function () {
  const headings = await this.a11yPage.checkHeadingStructure();
  const h1s      = headings.filter(h => h.level === 'H1');

  this.attach(
    `Headings found:\n${headings.map(h => `${h.level}: ${h.text}`).join('\n')}`,
    'text/plain'
  );

  expect(h1s.length, 'Page should have exactly one H1 heading').toBeGreaterThanOrEqual(1);
});
