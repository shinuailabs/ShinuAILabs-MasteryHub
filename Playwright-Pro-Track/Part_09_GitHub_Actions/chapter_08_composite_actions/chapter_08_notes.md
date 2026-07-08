# Part 08: Composite Actions

## 📚 Overview
Composite actions bundle multiple steps into a single reusable action.

---

## 🎯 Key Concepts

### 1. Basic Composite Action

```yaml
# .github/actions/setup-playwright/action.yml
name: 'Setup Playwright'
description: 'Install Node.js, dependencies, and Playwright browsers'

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
        
    - name: Install dependencies
      shell: bash
      run: npm ci
      
    - name: Install Playwright
      shell: bash
      run: npx playwright install --with-deps
```

### 2. Using Composite Action

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: ./.github/actions/setup-playwright
      
      - run: npx playwright test
```

### 3. Inputs and Outputs

```yaml
# .github/actions/playwright-test/action.yml
name: 'Playwright Test'
description: 'Run Playwright tests with configuration'

inputs:
  browser:
    description: 'Browser to test'
    required: false
    default: 'chromium'
  base-url:
    description: 'Base URL'
    required: true
  shards:
    description: 'Number of shards'
    required: false
    default: '1'
  shard-index:
    description: 'Current shard index'
    required: false
    default: '1'

outputs:
  result:
    description: 'Test result'
    value: ${{ steps.test.outputs.result }}

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
        
    - shell: bash
      run: npm ci
      
    - shell: bash
      run: npx playwright install --with-deps ${{ inputs.browser }}
      
    - id: test
      shell: bash
      env:
        BASE_URL: ${{ inputs.base-url }}
      run: |
        npx playwright test --project=${{ inputs.browser }} --shard=${{ inputs.shard-index }}/${{ inputs.shards }}
        echo "result=passed" >> $GITHUB_OUTPUT
```

### 4. Using Action with Inputs

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: ./.github/actions/playwright-test
        with:
          browser: chromium
          base-url: https://example.com
          shards: '4'
          shard-index: '1'
```

### 5. Environment Variables

```yaml
# action.yml
runs:
  using: 'composite'
  steps:
    - shell: bash
      env:
        CI: 'true'
        NODE_ENV: 'test'
      run: npm test
```

### 6. Conditional Steps

```yaml
runs:
  using: 'composite'
  steps:
    - shell: bash
      run: npm ci
      
    - if: ${{ inputs.install-browsers == 'true' }}
      shell: bash
      run: npx playwright install --with-deps
```

### 7. Working Directory

```yaml
runs:
  using: 'composite'
  steps:
    - shell: bash
      working-directory: ./app
      run: npm ci
      
    - shell: bash
      working-directory: ./app
      run: npm test
```

### 8. Complete Playwright Action

```yaml
# .github/actions/e2e-test/action.yml
name: 'E2E Test'
description: 'Complete E2E testing with Playwright'

inputs:
  browser:
    description: 'Browser'
    default: 'chromium'
  base-url:
    description: 'Base URL'
    required: true
  test-user:
    description: 'Test user email'
    required: false
  test-password:
    description: 'Test user password'
    required: false

outputs:
  report-path:
    description: 'Path to test report'
    value: ${{ steps.paths.outputs.report }}

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
        
    - name: Cache Playwright
      uses: actions/cache@v4
      with:
        path: ~/.cache/ms-playwright
        key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
        
    - shell: bash
      run: npm ci
      
    - shell: bash
      run: npx playwright install --with-deps ${{ inputs.browser }}
      
    - name: Run tests
      shell: bash
      env:
        BASE_URL: ${{ inputs.base-url }}
        TEST_USER: ${{ inputs.test-user }}
        TEST_PASSWORD: ${{ inputs.test-password }}
      run: npx playwright test --project=${{ inputs.browser }}
      
    - id: paths
      shell: bash
      run: echo "report=playwright-report" >> $GITHUB_OUTPUT
      
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-${{ inputs.browser }}
        path: playwright-report/
```

### 9. Publishing to Marketplace

```yaml
# action.yml (in repository root)
name: 'Playwright E2E Action'
description: 'Run Playwright E2E tests'
author: 'Your Name'
branding:
  icon: 'check-circle'
  color: 'green'

inputs:
  browser:
    description: 'Browser to test'
    default: 'chromium'

runs:
  using: 'composite'
  steps:
    - shell: bash
      run: npx playwright test --project=${{ inputs.browser }}
```

---

## 💻 Practice Exercises

1. Create basic composite action
2. Add inputs and outputs
3. Use caching in action
4. Handle conditionals
5. Create complete test action

---

## ✅ Best Practices

- ✅ Always specify `shell`
- ✅ Use meaningful names
- ✅ Provide default values
- ✅ Document inputs/outputs
- ❌ Don't hardcode paths
- ❌ Avoid complex logic

---

## 📝 Quick Reference

```yaml
# action.yml
name: 'Action Name'
description: 'Description'
inputs:
  input-name:
    description: 'Input description'
    required: false
    default: 'value'
outputs:
  output-name:
    value: ${{ steps.step-id.outputs.value }}
runs:
  using: 'composite'
  steps:
    - shell: bash
      run: command

# Usage
- uses: ./.github/actions/action-name
  with:
    input-name: value
```

