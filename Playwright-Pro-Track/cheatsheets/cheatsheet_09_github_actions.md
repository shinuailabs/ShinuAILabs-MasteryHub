# 🎯 GitHub Actions Cheat Sheet

## Quick Reference Card

---

## 📄 Basic Workflow

```yaml
# .github/workflows/test.yml
name: Tests

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
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - run: npm ci
      - run: npm test
```

---

## 🎭 Playwright Workflow

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run tests
        run: npx playwright test
        
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🔀 Matrix Builds

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [16, 18, 20]
        browser: [chromium, firefox, webkit]
      fail-fast: false
      
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - run: npx playwright test --project=${{ matrix.browser }}
```

---

## 🔐 Secrets & Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      API_URL: ${{ vars.API_URL }}
      
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

---

## 📦 Caching

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Playwright browsers cache
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('**/package-lock.json') }}
```

---

## 📤 Artifacts

```yaml
# Upload
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      playwright-report/
      test-results/
    retention-days: 30

# Download
- uses: actions/download-artifact@v4
  with:
    name: test-results
```

---

## 🔄 Reusable Workflows

```yaml
# .github/workflows/reusable.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"

# Calling workflow
jobs:
  call-workflow:
    uses: ./.github/workflows/reusable.yml
    with:
      environment: production
```

---

## 🎯 Triggers

```yaml
on:
  push:
    branches: [main, develop]
    paths: ['src/**', 'tests/**']
    
  pull_request:
    types: [opened, synchronize]
    
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
    
  workflow_dispatch:  # Manual trigger
    inputs:
      environment:
        type: choice
        options: [dev, staging, prod]
```

---

*Keep this handy while coding!* 🚀
