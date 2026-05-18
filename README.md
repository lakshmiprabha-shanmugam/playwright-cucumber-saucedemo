# Playwright Cucumber Test Suite

End-to-end test automation framework for [SauceDemo](https://www.saucedemo.com) built with **Playwright** and **Cucumber (BDD)**, featuring HTML and Allure reporting.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.60.0 | Browser automation |
| [@cucumber/cucumber](https://cucumber.io) | ^12.8.3 | BDD test runner |
| [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) | ^2.2.2 | Accessibility testing |
| [allure-cucumberjs](https://allurereport.org) | ^3.8.0 | Allure reporting |
| Node.js | 18+ | Runtime |

---

## Project Structure

```
playwright-cucumber/
├── features/
│   ├── hooks/
│   │   └── hooks.js                  # Browser setup/teardown, auth state
│   ├── pages/                        # Page Object Models
│   │   ├── LoginPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── LogoutPage.js
│   │   ├── ProductPage.js
│   │   ├── SortPage.js
│   │   ├── AccessibilityPage.js
│   │   └── ApiContext.js
│   ├── step_defininitions/           # Cucumber step definitions
│   │   ├── loginSteps.js
│   │   ├── cartSteps.js
│   │   ├── checkoutSteps.js
│   │   ├── logoutSteps.js
│   │   ├── productSteps.js
│   │   ├── sortSteps.js
│   │   ├── accessibilitySteps.js
│   │   └── apiSteps.js
│   ├── login.feature
│   ├── cart.feature
│   ├── checkout.feature
│   ├── logout.feature
│   ├── product.feature
│   ├── sort.feature
│   ├── accessibility.feature
│   └── api.feature
├── reports/
│   ├── html/                         # Cucumber HTML reports
│   ├── json/                         # JSON reports (Allure input)
│   ├── allure-results/               # Raw Allure data
│   └── allure-report/                # Generated Allure HTML report
├── docs/
│   └── Reporting-Setup-Guide.md
├── cucumber.js                       # Cucumber configuration
├── package.json
└── README.md
```

---

## Features Covered

| Feature | Tag | Scenarios |
|---------|-----|-----------|
| Login / Logout | `@smoke` `@regression` | Valid login, invalid login, logout, session |
| Shopping Cart | `@smoke` `@regression` | Add, remove, persist items |
| Product Detail | `@smoke` `@regression` | View product, add from detail page |
| Checkout | `@smoke` `@regression` | Full checkout flow |
| Sort | `@smoke` `@regression` | Sort by name, price |
| Accessibility | `@accessibility` | Section 508 / WCAG 2.0 AA checks |
| API | `@api` | GET, POST, PUT, PATCH, DELETE via reqres.in |

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd playwright-cucumber
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

### 4. (API tests only) Set the reqres.in API key

API tests require a free API key from [https://app.reqres.in/api-keys](https://app.reqres.in/api-keys).

**PowerShell:**
```powershell
$env:REQRES_API_KEY = "your-api-key-here"
```

**bash/zsh:**
```bash
export REQRES_API_KEY="your-api-key-here"
```

---

## Running Tests

> **Note:** Always wrap tags in quotes in PowerShell — `@` is a reserved character.

### Run all UI tests (excludes API)

```powershell
npm test
```

### Run by tag

```powershell
npm run test:smoke        # @smoke scenarios
npm run test:regression   # @regression scenarios
npm run test:accessibility # @accessibility scenarios
npm run test:api          # @api scenarios only
npm run test:all          # everything
```

### Run a single feature file

```powershell
npx cucumber-js features/cart.feature
npx cucumber-js features/login.feature
```

### Run in headed mode (watch the browser)

Change `headless: false` in [features/hooks/hooks.js](features/hooks/hooks.js):

```js
browser = await chromium.launch({ headless: false });
```

---

## Reports

### HTML Report

Generated automatically after every test run.

```powershell
npm test
# Open: reports/html/report-chromium.html
```

### Allure Report

```powershell
# Full workflow: run tests + generate + open
npm run report

# Or step by step
npm test                    # run tests
npm run allure:generate     # build the report
npm run allure:open         # open in browser

# Live server (no generate step needed)
npm run allure:serve
```

### Report locations

| Report | Location |
|--------|----------|
| HTML (main) | `reports/html/report-chromium.html` |
| HTML (smoke) | `reports/html/report-smoke.html` |
| HTML (accessibility) | `reports/html/report-accessibility.html` |
| Allure | `reports/allure-report/index.html` |

---

## Accessibility Testing

Accessibility scenarios use [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) and check against **Section 508** and **WCAG 2.0 AA** standards.

```powershell
npm run test:accessibility
```

Pages tested:
- Login page
- Products / Inventory page
- Cart page
- Checkout page
- Product detail page

---

## CI / GitHub Actions

Add this to `.github/workflows/test.yml`:

```yaml
name: Playwright Cucumber Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run tests
        run: npm test

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: html-report
          path: reports/html/
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `require is not defined` | File uses CommonJS in ES Module project | Replace `require()` with `import` |
| `@tag` not recognised in PowerShell | `@` is reserved in PowerShell | Wrap in quotes: `--tags "@smoke"` |
| `Cannot find module '../pages/X'` | Missing `.js` extension | Add `.js` to all import paths |
| `Multiple step definitions match` | Duplicate step text across files | Remove the duplicate step definition |
| Report folder empty | Folder didn't exist before test run | `pretest` script creates it automatically |
| API tests fail | Missing `REQRES_API_KEY` env var | Set the key before running `npm run test:api` |

---

## Author

**lakshmiprabha-shanmugam**

---

*Built with Playwright + Cucumber on Node.js*
