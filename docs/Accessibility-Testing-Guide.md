# Accessibility Testing Guide — axe-playwright

---

## Table of Contents

1. [Overview](#overview)
2. [What is axe-playwright](#what-is-axe-playwright)
3. [Accessibility Standards Covered](#accessibility-standards-covered)
4. [Installation](#installation)
5. [Project File Structure](#project-file-structure)
6. [How It Works](#how-it-works)
7. [AccessibilityPage — Page Object](#accessibilitypage--page-object)
8. [Step Definitions](#step-definitions)
9. [Feature File](#feature-file)
10. [Running Accessibility Tests](#running-accessibility-tests)
11. [Understanding Violations Output](#understanding-violations-output)
12. [Violation Impact Levels](#violation-impact-levels)
13. [Adding a New Accessibility Scenario](#adding-a-new-accessibility-scenario)
14. [Troubleshooting](#troubleshooting)

---

## 1. Overview

This project includes automated accessibility testing using **axe-playwright**, which integrates the industry-standard **axe-core** engine into Playwright + Cucumber tests.

Accessibility tests check that pages are usable by people with disabilities — screen reader users, keyboard-only users, and those with visual impairments.

---

## 2. What is axe-playwright

| Component | Role |
|-----------|------|
| **axe-core** | The accessibility rules engine — maintained by Deque Systems |
| **axe-playwright** | Wrapper that injects axe-core into a Playwright page and runs audits |

**axe-core** checks for common accessibility issues such as:
- Missing alt text on images
- Form inputs without labels
- Poor colour contrast
- Missing page headings
- Elements not keyboard-accessible
- Missing ARIA attributes

---

## 3. Accessibility Standards Covered

This project tests against three standards:

| Standard | Description |
|----------|-------------|
| `section508` | US federal law — requires government websites to be accessible |
| `wcag2a` | WCAG 2.0 Level A — minimum accessibility requirements |
| `wcag2aa` | WCAG 2.0 Level AA — recommended standard (used by most organisations) |

These are configured in [AccessibilityPage.js](../features/pages/AccessibilityPage.js):

```js
runOnly: {
  type: 'tag',
  values: ['section508', 'wcag2a', 'wcag2aa'],
}
```

---

## 4. Installation

### Install the package

```powershell
npm install --save-dev axe-playwright
```

### Verify installation

```powershell
Test-Path node_modules/axe-playwright   # should return True
```

### package.json entry

```json
"devDependencies": {
  "axe-playwright": "^2.2.2"
}
```

---

## 5. Project File Structure

```
playwright-cucumber/
├── features/
│   ├── pages/
│   │   └── AccessibilityPage.js          # Page object — axe-core logic
│   ├── step_defininitions/
│   │   └── accessibilitySteps.js         # Cucumber step definitions
│   └── accessibility.feature             # BDD scenarios
```

---

## 6. How It Works

The accessibility check happens in three steps every time a scenario runs:

```
1. injectAxe(page)
   └── Loads axe-core JavaScript library into the browser page

2. window.axe.run(document, options)
   └── axe-core scans the entire DOM and returns violations

3. violations.length === 0 ?
   └── Pass → scenario passes
   └── Fail → violation details attached to report + screenshot taken
```

---

## 7. AccessibilityPage — Page Object

**File:** [features/pages/AccessibilityPage.js](../features/pages/AccessibilityPage.js)

### Methods

#### `checkAccessibility(options)`

Injects axe-core and runs a full audit against Section 508, WCAG 2.0 A and AA rules.

```js
const violations = await this.a11yPage.checkAccessibility();
```

Returns an array of violation objects. Empty array = no violations.

#### `formatViolations(violations)`

Converts the raw violations array into a human-readable string for attaching to the test report.

```
Rule    : select-name
Impact  : CRITICAL
Desc    : Ensure select element has an accessible name
Help    : https://dequeuniversity.com/rules/axe/4.11/select-name
Nodes   :
    Element : select
    HTML    : <select class="product_sort_container">...</select>
    Fix     : Element does not have a label
```

#### `checkImagesHaveAltText()`

Scans all `<img>` elements on the page and returns a list of any missing `alt` attributes.

```js
const violations = await this.a11yPage.checkImagesHaveAltText();
// Returns: ["Image missing alt attribute: /static/img/sauce-backpack.jpg"]
```

#### `checkHeadingStructure()`

Returns all heading elements (`h1`–`h6`) found on the page with their level and text.

```js
const headings = await this.a11yPage.checkHeadingStructure();
// Returns: [{ level: 'H1', text: 'Products' }, { level: 'H2', text: '...' }]
```

#### `checkKeyboardNavigation(selectors)`

Checks whether each given CSS selector can receive keyboard focus.

```js
const results = await this.a11yPage.checkKeyboardNavigation([
  '[data-test="username"]',
  '[data-test="login-button"]'
]);
// Returns: [{ selector: '...', focusable: true }, ...]
```

---

## 8. Step Definitions

**File:** [features/step_defininitions/accessibilitySteps.js](../features/step_defininitions/accessibilitySteps.js)

### Available steps

| Step | What it checks |
|------|---------------|
| `Then the page should have no accessibility violations` | Full axe-core audit (Section 508 + WCAG 2.0 A/AA) |
| `Then all images should have alt text` | Every `<img>` has an `alt` attribute |
| `Then the page should have a main heading` | At least one `<h1>` exists on the page |
| `Then I should be able to tab through the login form` | Tab key moves focus to a form element |
| `Then the username field should be focusable` | Username input can receive focus |
| `Then the password field should be focusable` | Password input can receive focus |
| `Then the login button should be focusable` | Login button can receive focus |

### Before hook

A `Before` hook tagged `@accessibility` initialises `this.a11yPage` for every accessibility scenario:

```js
Before({ tags: '@accessibility' }, async function () {
  this.a11yPage = new AccessibilityPage(this.page);
});
```

This means you do **not** need to set up `AccessibilityPage` manually inside each step — it is ready automatically.

### On failure behaviour

When violations are found, the step automatically:
1. Formats the full violation details as text
2. Attaches the text to the Cucumber/Allure report
3. Takes a full-page screenshot and attaches it
4. Fails the scenario with a clear message

---

## 9. Feature File

**File:** [features/accessibility.feature](../features/accessibility.feature)

```gherkin
@accessibility
Feature: Section 508 Accessibility

  Background:
    Given I am on the login page

  @accessibility @smoke
  Scenario: Login page has no accessibility violations
    Then the page should have no accessibility violations

  @accessibility @smoke
  Scenario: Products page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Cart page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Checkout page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Product detail page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I click on product "Sauce Labs Backpack"
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Login page keyboard navigation works
    Then I should be able to tab through the login form
    And the username field should be focusable
    And the password field should be focusable
    And the login button should be focusable

  @accessibility @regression
  Scenario: Images have alt text on products page
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then all images should have alt text

  @accessibility @regression
  Scenario: Page has correct heading structure
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then the page should have a main heading
```

### Tags used

| Tag | Meaning |
|-----|---------|
| `@accessibility` | Marks as an accessibility test — run with `--tags "@accessibility"` |
| `@smoke` | Core checks — login and products page |
| `@regression` | Extended checks — cart, checkout, keyboard, images, headings |

---

## 10. Running Accessibility Tests

### Run all accessibility scenarios

```powershell
npm run test:accessibility
```

### Run only smoke accessibility tests

```powershell
npx cucumber-js --tags "@accessibility and @smoke"
```

### Run only regression accessibility tests

```powershell
npx cucumber-js --tags "@accessibility and @regression"
```

### Run a single feature file

```powershell
npx cucumber-js features/accessibility.feature
```

> **Note:** Always wrap tags in quotes in PowerShell — `@` is a reserved character.

---

## 11. Understanding Violations Output

When a violation is found, the report shows:

```
Rule    : select-name
Impact  : CRITICAL
Desc    : Ensure select element has an accessible name
Help    : https://dequeuniversity.com/rules/axe/4.11/select-name
Nodes   :
    Element : select
    HTML    : <select class="product_sort_container">...</select>
    Fix     : Fix any of the following:
              Element does not have an implicit (wrapped) <label>
              Element does not have an explicit <label>
              aria-label attribute does not exist or is empty
```

| Field | Description |
|-------|-------------|
| `Rule` | The axe rule ID that was violated |
| `Impact` | Severity — CRITICAL, SERIOUS, MODERATE, or MINOR |
| `Desc` | What the rule checks |
| `Help` | Link to the full rule explanation on Deque University |
| `Element` | CSS selector identifying the failing element |
| `HTML` | The actual HTML of the failing element |
| `Fix` | Suggested ways to fix the issue |

---

## 12. Violation Impact Levels

| Impact | Meaning | Action |
|--------|---------|--------|
| `CRITICAL` | Completely blocks access for disabled users | Must fix |
| `SERIOUS` | Severely impacts accessibility | Should fix |
| `MODERATE` | Causes significant difficulty | Fix where possible |
| `MINOR` | Best practice violation | Fix when convenient |

---

## 13. Adding a New Accessibility Scenario

### Step 1 — Add a scenario to the feature file

```gherkin
@accessibility @regression
Scenario: Checkout confirmation page has no accessibility violations
  Given I am logged in as "standard_user" with password "secret_sauce"
  When I complete a full checkout
  Then the page should have no accessibility violations
```

### Step 2 — Reuse existing steps or add new ones

The step `Then the page should have no accessibility violations` already exists — no new step definition needed unless the navigation steps don't exist yet.

### Step 3 — Run and review

```powershell
npx cucumber-js features/accessibility.feature
```

If violations are found, the report will show exactly which elements failed and how to fix them.

---

## 14. Troubleshooting

### `injectAxe is not a function`

**Cause:** Wrong import or axe-playwright not installed.

**Fix:**
```js
import { injectAxe } from 'axe-playwright';  // correct ESM import
```

### `window.axe is not defined`

**Cause:** `injectAxe()` was not called before `window.axe.run()`.

**Fix:** Always call `injectAxe(page)` before running any axe checks. The `checkAccessibility()` method in `AccessibilityPage.js` already does this automatically.

### Violations found on SauceDemo pages

Some violations on SauceDemo are **real bugs in the website** (not in your test code), such as:
- The sort `<select>` missing a `<label>` — CRITICAL
- Missing H1 heading on the Products page — detected by heading structure check

These are expected findings. Your test code is correct — it has found genuine accessibility issues.

### `require is not defined` error

**Cause:** Using CommonJS `require()` in an ES Module project.

**Fix:** Use `import` instead:
```js
// Wrong
const { injectAxe } = require('axe-playwright');

// Correct
import { injectAxe } from 'axe-playwright';
```

---

*Document version: 1.0 | Project: playwright-cucumber-saucedemo*
