# Part 07: Reusable Workflows

## 📚 Overview
Reusable workflows enable sharing workflow logic across repositories and reducing duplication.

---

## 🎯 Key Concepts

### 1. Creating Reusable Workflow

```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests

on:
  workflow_call:
    inputs:
      browser:
        description: 'Browser to test'
        required: false
        type: string
        default: 'chromium'
      base-url:
        description: 'Base URL for tests'
        required: true
        type: string
    secrets:
      TEST_USER:
        required: false
      TEST_PASSWORD:
        required: false

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps ${{ inputs.browser }}
      - name: Run tests
        env:
          BASE_URL: ${{ inputs.base-url }}
          TEST_USER: ${{ secrets.TEST_USER }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
        run: npx playwright test --project=${{ inputs.browser }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Calling Reusable Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    uses: ./.github/workflows/playwright-tests.yml
    with:
      browser: chromium
      base-url: https://staging.example.com
    secrets:
      TEST_USER: ${{ secrets.TEST_USER }}
      TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

### 3. Cross-Repository Workflow

```yaml
# Calling workflow from another repository
jobs:
  test:
    uses: org/shared-workflows/.github/workflows/playwright.yml@main
    with:
      browser: chromium
      base-url: https://example.com
    secrets: inherit  # Pass all secrets
```

### 4. Input Types

```yaml
on:
  workflow_call:
    inputs:
      string-input:
        type: string
        required: true
      boolean-input:
        type: boolean
        default: false
      number-input:
        type: number
        default: 4
      choice-input:
        type: string
        default: 'chromium'
```

### 5. Outputs from Reusable Workflow

```yaml
# Reusable workflow
on:
  workflow_call:
    outputs:
      test-result:
        description: 'Test result'
        value: ${{ jobs.test.outputs.result }}

jobs:
  test:
    runs-on: ubuntu-latest
    outputs:
      result: ${{ steps.test.outputs.result }}
    steps:
      - id: test
        run: echo "result=passed" >> $GITHUB_OUTPUT

# Calling workflow
jobs:
  run-tests:
    uses: ./.github/workflows/tests.yml
    
  report:
    needs: run-tests
    runs-on: ubuntu-latest
    steps:
      - run: echo "Result: ${{ needs.run-tests.outputs.test-result }}"
```

### 6. Secrets Handling

```yaml
# Pass specific secrets
jobs:
  test:
    uses: ./.github/workflows/tests.yml
    secrets:
      API_KEY: ${{ secrets.API_KEY }}
      
# Pass all secrets
jobs:
  test:
    uses: ./.github/workflows/tests.yml
    secrets: inherit
```

### 7. Matrix with Reusable Workflow

```yaml
jobs:
  test:
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    uses: ./.github/workflows/playwright-tests.yml
    with:
      browser: ${{ matrix.browser }}
      base-url: https://example.com
    secrets: inherit
```

### 8. Conditional Reusable Workflow

```yaml
jobs:
  test-staging:
    if: github.ref == 'refs/heads/develop'
    uses: ./.github/workflows/tests.yml
    with:
      base-url: https://staging.example.com
    secrets: inherit

  test-production:
    if: github.ref == 'refs/heads/main'
    uses: ./.github/workflows/tests.yml
    with:
      base-url: https://example.com
    secrets: inherit
```

### 9. Complete Example

```yaml
# .github/workflows/reusable-e2e.yml
name: E2E Tests

on:
  workflow_call:
    inputs:
      environment:
        type: string
        required: true
      shards:
        type: number
        default: 4
    secrets:
      TEST_CREDENTIALS:
        required: true

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
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run tests
        env:
          TEST_CREDENTIALS: ${{ secrets.TEST_CREDENTIALS }}
        run: npx playwright test --shard=${{ matrix.shard }}/${{ inputs.shards }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-${{ matrix.shard }}
          path: playwright-report/
```

---

## 💻 Practice Exercises

1. Create reusable workflow
2. Add inputs and secrets
3. Call from another workflow
4. Use outputs
5. Implement matrix calling

---

## ✅ Best Practices

- ✅ Use meaningful input names
- ✅ Provide default values
- ✅ Document inputs/outputs
- ✅ Use `secrets: inherit` carefully
- ❌ Don't hardcode values
- ❌ Avoid circular dependencies

---

## 📝 Quick Reference

```yaml
# Define reusable
on:
  workflow_call:
    inputs:
      name:
        type: string
        required: true
    secrets:
      SECRET:
        required: true
    outputs:
      result:
        value: ${{ jobs.job.outputs.result }}

# Call reusable
jobs:
  job:
    uses: ./.github/workflows/reusable.yml
    with:
      name: value
    secrets: inherit
```

