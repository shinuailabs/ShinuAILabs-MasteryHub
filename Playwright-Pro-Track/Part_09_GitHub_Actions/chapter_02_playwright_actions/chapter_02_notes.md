# Part 02: Playwright with GitHub Actions

## 📚 Overview
Running Playwright tests in GitHub Actions provides automated browser testing in CI/CD.

---

## 🎯 Key Concepts

### 1. Basic Playwright Workflow

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Run tests
        run: npx playwright test
        
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 2. Using Playwright Container

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npx playwright test
```

### 3. Multi-Browser Testing

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-${{ matrix.browser }}
          path: playwright-report/
```

### 4. Sharded Testing

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-shard-${{ matrix.shard }}
          path: playwright-report/
```

### 5. Caching Dependencies

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
          
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

### 6. Environment Variables

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      CI: true
      BASE_URL: https://staging.example.com
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run tests
        env:
          TEST_USER: ${{ secrets.TEST_USER }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
        run: npx playwright test
```

### 7. Test Reports

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --reporter=html,junit
      
      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          
      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Playwright Tests
          path: test-results/junit.xml
          reporter: java-junit
```

### 8. Scheduled Runs

```yaml
name: Nightly Tests

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

---

## 💻 Practice Exercises

1. Create Playwright workflow
2. Set up multi-browser testing
3. Implement sharding
4. Configure caching
5. Add test reports

---

## ✅ Best Practices

- ✅ Use official Playwright container
- ✅ Cache browsers and dependencies
- ✅ Upload reports as artifacts
- ✅ Use sharding for large suites
- ❌ Don't skip browser installation
- ❌ Avoid headed mode in CI

---

## 📝 Quick Reference

```yaml
# Basic setup
- uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: 'npm'
- run: npm ci
- run: npx playwright install --with-deps
- run: npx playwright test

# Sharding
run: npx playwright test --shard=${{ matrix.shard }}/4

# Upload report
- uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

