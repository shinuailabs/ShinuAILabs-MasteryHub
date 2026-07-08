# Part 11: Parallel Execution & Sharding

## 📚 Overview
Playwright supports parallel test execution and sharding to speed up test runs across multiple machines.

---

## 🎯 Key Concepts

### 1. Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of parallel workers
  workers: 4,
  
  // Or percentage of CPU cores
  workers: '50%',
});
```

### 2. Worker Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Different workers for CI vs local
  workers: process.env.CI ? 1 : undefined,
  
  // Limit workers
  workers: Math.max(1, Math.floor(require('os').cpus().length / 2)),
});

// Command line override
// npx playwright test --workers=4
```

### 3. Test Isolation

```typescript
// Each test gets fresh context
test('test 1', async ({ page }) => {
  // Fresh browser context
  await page.goto('/');
});

test('test 2', async ({ page }) => {
  // Another fresh browser context
  await page.goto('/');
});

// Tests in same file run in same worker by default
// But get separate browser contexts
```

### 4. Serial Execution

```typescript
// Force serial execution for specific tests
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
  test('step 1', async ({ page }) => {
    // Runs first
  });
  
  test('step 2', async ({ page }) => {
    // Runs after step 1
  });
  
  test('step 3', async ({ page }) => {
    // Runs after step 2
  });
});
```

### 5. Parallel in Describe

```typescript
// Parallel within describe block
test.describe.configure({ mode: 'parallel' });

test.describe('parallel tests', () => {
  test('test A', async ({ page }) => { });
  test('test B', async ({ page }) => { });
  test('test C', async ({ page }) => { });
});
```

### 6. Sharding

```bash
# Split tests across machines
# Machine 1
npx playwright test --shard=1/3

# Machine 2
npx playwright test --shard=2/3

# Machine 3
npx playwright test --shard=3/3
```

### 7. CI Sharding Example

```yaml
# GitHub Actions
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test --shard=${{ matrix.shard }}/4
```

### 8. Merge Shard Reports

```bash
# Run shards and save reports
npx playwright test --shard=1/3 --reporter=blob
npx playwright test --shard=2/3 --reporter=blob
npx playwright test --shard=3/3 --reporter=blob

# Merge reports
npx playwright merge-reports ./blob-report --reporter=html
```

### 9. Worker Fixtures

```typescript
// Shared state within worker
import { test as base } from '@playwright/test';

const test = base.extend<{}, { workerData: string }>({
  workerData: [async ({}, use) => {
    // Setup once per worker
    const data = await expensiveSetup();
    await use(data);
    // Cleanup after worker finishes
    await cleanup(data);
  }, { scope: 'worker' }]
});

test('uses worker data', async ({ workerData }) => {
  console.log(workerData);
});
```

### 10. Parallelism Best Practices

```typescript
// playwright.config.ts
export default defineConfig({
  // Full parallel for independent tests
  fullyParallel: true,
  
  // Reasonable worker count
  workers: process.env.CI ? 2 : 4,
  
  // Retry flaky tests
  retries: process.env.CI ? 2 : 0,
  
  // Fail fast in CI
  maxFailures: process.env.CI ? 10 : undefined,
});

// Avoid shared state
test.beforeEach(async ({ page }) => {
  // Each test starts fresh
  await page.goto('/');
});

// Use API for test data setup
test.beforeEach(async ({ request }) => {
  // Create isolated test data
  await request.post('/api/test-data', {
    data: { userId: `user-${Date.now()}` }
  });
});
```

---

## 💻 Practice Exercises

1. Configure parallel execution
2. Set up test sharding
3. Implement serial tests
4. Create worker fixtures
5. Merge shard reports

---

## ✅ Best Practices

- ✅ Keep tests independent
- ✅ Use appropriate worker count
- ✅ Shard in CI for speed
- ✅ Merge reports after sharding
- ❌ Don't share state between tests
- ❌ Avoid too many workers

---

## 📝 Quick Reference

```typescript
// Config
export default defineConfig({
  fullyParallel: true,
  workers: 4,
})

// Serial mode
test.describe.configure({ mode: 'serial' })

// Parallel mode
test.describe.configure({ mode: 'parallel' })
```

```bash
# Workers
npx playwright test --workers=4

# Sharding
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3

# Merge reports
npx playwright merge-reports ./blob-report
```

