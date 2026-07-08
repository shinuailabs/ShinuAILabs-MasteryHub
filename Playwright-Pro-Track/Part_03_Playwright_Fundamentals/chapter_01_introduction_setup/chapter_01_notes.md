# Part 01: Playwright Introduction & Setup

## 📚 Overview
Playwright is a modern end-to-end testing framework by Microsoft that supports multiple browsers and languages.

---

## 🎯 Key Concepts

### 1. What is Playwright?

```typescript
// Playwright Features:
// - Cross-browser testing (Chromium, Firefox, WebKit)
// - Auto-wait for elements
// - Network interception
// - Mobile emulation
// - Parallel test execution
// - Built-in test runner
// - Trace viewer for debugging
```

### 2. Installation

```bash
# Create new project
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test

# Install browsers
npx playwright install

# Install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 3. Project Structure

```
project/
├── tests/
│   ├── example.spec.ts
│   └── login.spec.ts
├── playwright.config.ts
├── package.json
└── node_modules/
```

### 4. Basic Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### 5. First Test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### 6. Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui

# Show report
npx playwright show-report
```

### 7. Test Annotations

```typescript
import { test, expect } from '@playwright/test';

// Skip test
test.skip('skipped test', async ({ page }) => {
  // This test is skipped
});

// Only run this test
test.only('focused test', async ({ page }) => {
  // Only this test runs
});

// Mark as failing
test.fail('expected to fail', async ({ page }) => {
  // Test is expected to fail
});

// Slow test (3x timeout)
test.slow('slow test', async ({ page }) => {
  // Has extended timeout
});

// Conditional skip
test('conditional', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Not supported in Firefox');
});
```

### 8. Test Hooks

```typescript
import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  console.log('Before all tests');
});

test.afterAll(async () => {
  console.log('After all tests');
});

test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
});

test('test 1', async ({ page }) => {
  // Test code
});
```

---

## 💻 Practice Exercises

1. Install Playwright in a new project
2. Configure playwright.config.ts
3. Write your first test
4. Run tests in different browsers
5. Use test hooks for setup

---

## ✅ Best Practices

- ✅ Use TypeScript for better IDE support
- ✅ Configure baseURL in config
- ✅ Enable traces for debugging
- ✅ Use meaningful test names
- ❌ Don't hardcode URLs
- ❌ Avoid test interdependencies

---

## 📝 Quick Reference

```bash
# Install
npm init playwright@latest

# Run tests
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui

# Show report
npx playwright show-report
```

