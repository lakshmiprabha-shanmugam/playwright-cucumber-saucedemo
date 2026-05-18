# Git & GitHub Actions Setup Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Git Setup](#git-setup)
3. [Project .gitignore](#project-gitignore)
4. [Pushing to GitHub](#pushing-to-github)
5. [GitHub Actions Workflow](#github-actions-workflow)
6. [Workflow Step-by-Step Explanation](#workflow-step-by-step-explanation)
7. [Viewing Results on GitHub](#viewing-results-on-github)
8. [Downloading Test Reports from GitHub](#downloading-test-reports-from-github)
9. [Common Git Commands](#common-git-commands)
10. [Troubleshooting](#troubleshooting)

---

## 1. Overview

This project uses:

| Tool | Purpose |
|------|---------|
| **Git** | Version control — tracks all code changes |
| **GitHub** | Remote repository — stores and shares the code |
| **GitHub Actions** | CI/CD — automatically runs tests on every push or pull request |

The workflow is:

```
Write code → git commit → git push → GitHub Actions runs tests automatically → Reports uploaded as artifacts
```

---

## 2. Git Setup

### Initialize a fresh Git repository for this project

Since this project lives inside a larger folder structure, a dedicated Git repo was created specifically inside the `playwright-cucumber/` folder:

```powershell
cd playwright-cucumber
git init
git checkout -b main
```

**Why `git init` here?**
- Creates an independent `.git/` folder inside `playwright-cucumber/`
- Keeps this project isolated from any parent Git repos
- Gives a clean history with only test automation commits

### Configure your Git identity (first time only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## 3. Project .gitignore

The `.gitignore` file tells Git which files and folders to **never commit**.

**File: `.gitignore`**

```
node_modules/
reports/
auth-*.json
.env
```

| Entry | Why it is ignored |
|-------|------------------|
| `node_modules/` | Installed packages — too large, recreated by `npm install` |
| `reports/` | Generated test output — not source code |
| `auth-*.json` | Browser session state files — contain login tokens, must not be shared |
| `.env` | Environment variables — may contain API keys and secrets |

---

## 4. Pushing to GitHub

### Step 1 — Stage all files

```powershell
git add .
```

Check what will be committed (should not show `node_modules` or `reports`):

```powershell
git status --short
```

### Step 2 — Commit

```powershell
git commit -m "Initial commit: Playwright Cucumber SauceDemo test suite"
```

### Step 3 — Add the remote repository

```powershell
git remote add origin https://github.com/lakshmiprabha-shanmugam/playwright-cucumber-saucedemo.git
```

Verify the remote was added:

```powershell
git remote -v
```

### Step 4 — Push to GitHub

```powershell
git push -u origin main
```

The `-u` flag sets `origin/main` as the default upstream — future pushes only need `git push`.

---

## 5. GitHub Actions Workflow

**File: `.github/workflows/playwright-cucumber.yml`**

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
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Create report directories
        run: mkdir -p reports/html reports/json reports/allure-results

      - name: Run tests
        run: npm test

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: html-report
          path: reports/html/

      - name: Generate Allure report
        if: always()
        run: npm run allure:generate

      - name: Upload Allure report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report
          path: reports/allure-report/
```

### When does the workflow run?

| Trigger | When |
|---------|------|
| `push` to `main` | Every time code is pushed directly to the main branch |
| `pull_request` to `main` | Every time a PR is opened or updated targeting main |

---

## 6. Workflow Step-by-Step Explanation

| Step | What it does | Why |
|------|-------------|-----|
| `Checkout code` | Downloads the repo code onto the GitHub runner | Runner starts empty — needs the code |
| `Setup Node.js` | Installs Node 20, caches `npm` dependencies | Speeds up future runs by caching packages |
| `Install dependencies` | Runs `npm install` | Installs `@cucumber/cucumber`, `playwright`, `axe-playwright`, etc. |
| `Install Playwright browsers` | Downloads Chromium + system dependencies | Playwright needs the actual browser binary to run tests |
| `Create report directories` | `mkdir -p reports/html reports/json reports/allure-results` | Prevents report write errors if folders don't exist |
| `Run tests` | Runs `npm test` | Executes all non-API Cucumber scenarios |
| `Upload HTML report` | Saves `reports/html/` as a downloadable artifact | Makes the report available even after the runner shuts down |
| `Generate Allure report` | Runs `npm run allure:generate` | Converts raw Allure results into HTML |
| `Upload Allure report` | Saves `reports/allure-report/` as a downloadable artifact | Makes the Allure report downloadable |

### `if: always()`

The upload steps use `if: always()` — this means the reports are uploaded **even when tests fail**. Without this, a failed test run would prevent the report from being saved.

---

## 7. Viewing Results on GitHub

1. Go to your repository: `https://github.com/lakshmiprabha-shanmugam/playwright-cucumber-saucedemo`
2. Click the **Actions** tab
3. Click on any workflow run to see details
4. Green tick = all tests passed, Red cross = one or more tests failed
5. Click individual steps to expand and read the logs

---

## 8. Downloading Test Reports from GitHub

After a workflow run completes:

1. Go to **Actions** tab on GitHub
2. Click the workflow run you want
3. Scroll to the bottom — find the **Artifacts** section
4. Click **html-report** or **allure-report** to download the zip file
5. Extract the zip and open `index.html` (Allure) or `report-chromium.html` (HTML) in your browser

---

## 9. Common Git Commands

### Daily workflow

```powershell
# Check what changed
git status

# See full diff of changes
git diff

# Stage specific files
git add features/cart.feature
git add features/step_defininitions/cartSteps.js

# Stage everything
git add .

# Commit
git commit -m "Add cart scenarios"

# Push to GitHub
git push
```

### Branching

```powershell
# Create a new branch
git checkout -b feature/add-wishlist-tests

# Switch between branches
git checkout main

# Push a new branch to GitHub
git push -u origin feature/add-wishlist-tests

# Merge a branch into main
git checkout main
git merge feature/add-wishlist-tests
```

### Checking history

```powershell
# View commit history
git log --oneline

# See what changed in a specific commit
git show <commit-hash>
```

---

## 10. Troubleshooting

### Push rejected — remote has changes you don't have locally

```
! [rejected] main -> main (fetch first)
```

**Fix:**
```powershell
git pull origin main --rebase
git push
```

### Accidentally committed node_modules

**Fix:** Remove from tracking without deleting the folder:
```powershell
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
git push
```

Then make sure `node_modules/` is in `.gitignore`.

### GitHub Actions fails at "Install Playwright browsers"

**Cause:** Missing `--with-deps` flag — Ubuntu needs system libraries for Chromium.

**Fix:** Ensure the workflow step is:
```yaml
run: npx playwright install chromium --with-deps
```

### GitHub Actions fails at "Run tests" — `REQRES_API_KEY` missing

**Cause:** API tests need the env variable but it is not set in GitHub.

**Fix:** Add a GitHub Actions secret:
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `REQRES_API_KEY`, Value: your key
4. Update the workflow step:

```yaml
- name: Run tests
  run: npm test
  env:
    REQRES_API_KEY: ${{ secrets.REQRES_API_KEY }}
```

### Workflow not triggering

**Cause:** The `.github/workflows/` file was not pushed, or the branch name doesn't match.

**Fix:** Confirm the file exists on GitHub and the `branches` list matches your branch name (`main` not `master`).

---

*Document version: 1.0 | Project: playwright-cucumber-saucedemo*
