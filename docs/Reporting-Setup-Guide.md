# Playwright Cucumber – HTML & Allure Reporting Setup Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [HTML Report Setup](#html-report-setup)
4. [Allure Report Setup](#allure-report-setup)
5. [Running Reports](#running-reports)
6. [NPM Scripts Reference](#npm-scripts-reference)
7. [Report Output Locations](#report-output-locations)
8. [Troubleshooting](#troubleshooting)

---

## 1. Overview

This project uses two types of test reports:

| Report Type | Tool | Purpose |
|-------------|------|---------|
| HTML Report | Cucumber built-in | Quick pass/fail overview with step details |
| Allure Report | Allure + allure-cucumberjs | Rich interactive report with graphs, timelines, and screenshots |

---

## 2. Prerequisites

- Node.js installed
- Project uses `"type": "module"` in `package.json`
- Allure CLI installed (via `allure-commandline` npm package)

---

## 3. HTML Report Setup

### Step 1 – No extra packages needed

The HTML formatter is built into `@cucumber/cucumber`. No additional install required.

### Step 2 – Create the reports folder

Before running tests, create the output folder:

```
reports/
  html/
  json/
```

Run this once in PowerShell:

```powershell
New-Item -ItemType Directory -Force reports/html, reports/json
```

### Step 3 – Add the format flag to your test command

Add `--format html:<output-path>` to your Cucumber command:

```
cucumber-js --format html:reports/html/report-chromium.html
```

### Step 4 – View the report

After the test run, open the file in your browser:

```
reports/html/report-chromium.html
```

Double-click the file in File Explorer, or right-click → Open with → Browser.

### What the HTML report shows

- Total scenarios passed / failed / skipped
- Each scenario with all steps expanded
- Error messages on failed steps
- Screenshots attached on failure

---

## 4. Allure Report Setup

### Step 1 – Install required packages

```powershell
npm install --save-dev allure-cucumberjs allure-commandline
```

Verify installation:

```powershell
Test-Path node_modules/allure-cucumberjs    # should return True
Test-Path node_modules/allure-commandline   # should return True
```

### Step 2 – Create the allure-results folder

```powershell
New-Item -ItemType Directory -Force reports/allure-results
```

### Step 3 – Add the Allure formatter to your test command

```
cucumber-js --format allure-cucumberjs/reporter --format-options "{\"resultsDir\":\"reports/allure-results\"}"
```

You can combine this with the HTML formatter in one command:

```
cucumber-js
  --format html:reports/html/report-chromium.html
  --format allure-cucumberjs/reporter
  --format-options "{\"resultsDir\":\"reports/allure-results\"}"
```

### Step 4 – Generate the Allure HTML report

After the test run, convert the raw results into an HTML report:

```powershell
npx allure generate reports/allure-results --clean -o reports/allure-report
```

### Step 5 – Open the Allure report

```powershell
npx allure open reports/allure-report
```

This opens the report in your default browser automatically.

### Step 6 – OR use allure:serve (skips the generate step)

```powershell
npx allure serve reports/allure-results
```

This spins up a local server and opens the report directly — useful during development.

### What the Allure report shows

- Dashboard with pass/fail/broken/skipped counts
- Graphs and trend charts
- Timeline view of parallel test execution
- Each scenario with steps, attachments, and duration
- Screenshots embedded on failure
- Categorised failures

---

## 5. Running Reports

### Full test run with both reports in one command

```powershell
npm run report
```

This runs: `npm test` → `allure:generate` → `allure:open`

### Individual commands

```powershell
# Run all tests (not API), generate HTML + Allure results
npm test

# Run only smoke tests
npm run test:smoke

# Run only accessibility tests
npm run test:accessibility

# Run API tests
npm run test:api

# Generate Allure HTML from results
npm run allure:generate

# Open generated Allure report
npm run allure:open

# Serve Allure report live (no generate step needed)
npm run allure:serve
```

---

## 6. NPM Scripts Reference

| Script | Command | Output |
|--------|---------|--------|
| `npm test` | All tests except @api | `reports/html/report-chromium.html` |
| `npm run test:smoke` | @smoke tests only | `reports/html/report-smoke.html` |
| `npm run test:regression` | @regression tests only | `reports/html/report-regression.html` |
| `npm run test:accessibility` | @accessibility tests only | `reports/html/report-accessibility.html` |
| `npm run test:api` | @api tests only | `reports/html/report-api.html` |
| `npm run test:all` | All tests | `reports/html/report-all.html` |
| `npm run allure:generate` | Generate Allure report | `reports/allure-report/` |
| `npm run allure:open` | Open Allure report | Opens browser |
| `npm run allure:serve` | Serve Allure live | Opens browser |
| `npm run report` | test + generate + open | Full workflow |

---

## 7. Report Output Locations

```
playwright-cucumber/
  reports/
    html/
      report-chromium.html       ← main HTML report
      report-smoke.html
      report-regression.html
      report-accessibility.html
      report-api.html
      report-all.html
    json/
      report-chromium.json       ← JSON (used by Allure)
    allure-results/              ← raw Allure data (auto-generated)
    allure-report/               ← final Allure HTML report
      index.html                 ← open this in browser
```

---

## 8. Troubleshooting

### HTML report is empty or not created

**Cause:** The `reports/html/` folder did not exist before the test ran.

**Fix:** The `pretest` script creates folders automatically. If running manually:
```powershell
New-Item -ItemType Directory -Force reports/html, reports/json, reports/allure-results
```

### Allure report shows no data

**Cause:** Tests were not run before generating the report, or `resultsDir` path is wrong.

**Fix:** Always run tests first, then generate:
```powershell
npm test
npm run allure:generate
npm run allure:open
```

### `allure` command not found

**Cause:** `allure-commandline` not installed, or using global allure instead of local.

**Fix:** Always use `npx allure` (not just `allure`) to use the local version:
```powershell
npx allure generate reports/allure-results --clean -o reports/allure-report
```

### Tags not working in PowerShell

**Cause:** PowerShell treats `@` as a special character.

**Fix:** Always wrap tags in quotes:
```powershell
# Wrong
npx cucumber-js --tags @smoke

# Correct
npx cucumber-js --tags "@smoke"
```

---

*Document version: 1.0 | Project: playwright-cucumber*
