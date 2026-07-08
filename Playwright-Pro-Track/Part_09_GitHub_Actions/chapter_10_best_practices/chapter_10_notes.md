# Part 10: GitHub Actions Best Practices

## 📚 Overview
Following best practices ensures efficient, secure, and maintainable GitHub Actions workflows.

---

## 🎯 Key Concepts

### 1. Security Best Practices

```yaml
# ✅ Pin action versions with SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

# ✅ Use secrets for sensitive data
env:
  API_KEY: ${{ secrets.API_KEY }}

# ✅ Limit permissions
permissions:
  contents: read
  pull-requests: write

# ❌ Don't use @master or @main
- uses: actions/checkout@main  # Bad

# ❌ Don't echo secrets
- run: echo ${{ secrets.API_KEY }}  # Bad
```

### 2. Performance Optimization

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # ✅ Use caching
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      # ✅ Use npm ci instead of npm install
      - run: npm ci

      # ✅ Run tests in parallel
      - run: npx playwright test --workers=4

      # ✅ Use sharding for large test suites
      - run: npx playwright test --shard=${{ matrix.shard }}/4
```

### 3. Workflow Organization

```yaml
# ✅ Use descriptive names
name: E2E Tests - Playwright

# ✅ Group related jobs
jobs:
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  e2e-tests:
    name: E2E Tests
    needs: [lint, unit-tests]
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test
```

### 4. Error Handling

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # ✅ Continue on error for non-critical steps
      - name: Optional step
        continue-on-error: true
        run: npm run optional-check

      # ✅ Always upload artifacts
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/

      # ✅ Handle specific failures
      - name: Notify on failure
        if: failure()
        run: ./notify-team.sh
```

### 5. Timeout and Concurrency

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # ✅ Set timeout

    # ✅ Control concurrency
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
      cancel-in-progress: true

    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### 6. Reusability

```yaml
# ✅ Use reusable workflows
jobs:
  test:
    uses: ./.github/workflows/playwright-tests.yml
    with:
      browser: chromium
    secrets: inherit

# ✅ Use composite actions for common steps
- uses: ./.github/actions/setup-playwright

# ✅ Use matrix for variations
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
```

### 7. Documentation

```yaml
# ✅ Document workflow purpose
name: CI Pipeline
# This workflow runs on every push and PR
# It performs linting, testing, and builds

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    # Run Playwright E2E tests across browsers
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Install dependencies and browsers
      - run: npm ci
      - run: npx playwright install --with-deps

      # Run tests with HTML reporter
      - run: npx playwright test
```

### 8. Conditional Execution

```yaml
jobs:
  # ✅ Skip unnecessary jobs
  test:
    if: |
      !contains(github.event.head_commit.message, '[skip ci]') &&
      !contains(github.event.head_commit.message, '[skip tests]')
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  # ✅ Deploy only on main
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### 9. Resource Management

```yaml
# ✅ Clean up resources
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

    # ✅ Use post-job cleanup
    services:
      postgres:
        image: postgres:15
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

# ✅ Limit artifact retention
- uses: actions/upload-artifact@v4
  with:
    name: report
    path: report/
    retention-days: 7
```

### 10. Monitoring

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

      # ✅ Add status checks
      - name: Report status
        if: always()
        run: |
          echo "Job status: ${{ job.status }}"
          echo "Duration: ${{ github.run_number }}"
```

---

## 💻 Practice Exercises

1. Implement security practices
2. Optimize workflow performance
3. Add error handling
4. Set up concurrency
5. Create reusable components

---

## ✅ Best Practices Summary

- ✅ Pin action versions
- ✅ Use secrets for credentials
- ✅ Set minimal permissions
- ✅ Cache dependencies
- ✅ Use timeouts
- ✅ Handle errors gracefully
- ✅ Document workflows
- ❌ Don't use @main/@master
- ❌ Don't hardcode secrets
- ❌ Avoid unlimited retention

---

## 📝 Quick Reference

```yaml
# Security
permissions:
  contents: read
uses: action@sha

# Performance
cache: 'npm'
--shard=${{ matrix.shard }}/4

# Error handling
if: always()
if: failure()
continue-on-error: true

# Concurrency
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Timeout
timeout-minutes: 30
```