# Part 09: Configuration

## 📚 Overview
Playwright configuration controls test execution, browser settings, reporters, and more.

---

## 🎯 Key Concepts

### 1. Basic Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
});
```

### 2. Browser Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### 3. Use Options

```typescript
export default defineConfig({
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',
    
    // Browser options
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifacts
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Geolocation
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation'],
  },
});
```

### 4. Reporters

```typescript
export default defineConfig({
  // Single reporter
  reporter: 'html',
  
  // Multiple reporters
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  
  // CI reporter
  reporter: process.env.CI ? 'dot' : 'list',
});
```

### 5. Test Retries

```typescript
export default defineConfig({
  // Global retries
  retries: 2,
  
  // Per-project retries
  projects: [
    {
      name: 'chromium',
      retries: 1,
    },
  ],
});

// Per-test retries
test('flaky test', async ({ page }) => {
  test.info().annotations.push({ type: 'retries', description: '3' });
  // Or use test.describe.configure
});

test.describe.configure({ retries: 3 });
```

### 6. Parallel Execution

```typescript
export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of workers
  workers: 4,
  // workers: '50%',  // 50% of CPU cores
  
  // Disable parallel in CI
  workers: process.env.CI ? 1 : undefined,
});

// Serial execution for specific tests
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
  test('first', async ({ page }) => { });
  test('second', async ({ page }) => { });
});
```

### 7. Global Setup/Teardown

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});

// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login and save state
  await page.goto('http://localhost:3000/login');
  await page.fill('#email', 'admin@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;
```

### 8. Environment Variables

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
});

// .env file (use dotenv)
// BASE_URL=https://staging.example.com

// In test
test('env test', async ({ page }) => {
  const apiKey = process.env.API_KEY;
});
```

### 9. Web Server

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  // Multiple servers
  webServer: [
    {
      command: 'npm run start:frontend',
      url: 'http://localhost:3000',
    },
    {
      command: 'npm run start:api',
      url: 'http://localhost:4000',
    },
  ],
});
```

---

## 💻 Practice Exercises

1. Configure multiple browsers
2. Set up reporters
3. Configure parallel execution
4. Implement global setup
5. Use environment variables

---

## ✅ Best Practices

- ✅ Use environment variables for URLs
- ✅ Configure appropriate timeouts
- ✅ Enable artifacts for CI
- ✅ Use global setup for auth
- ❌ Don't hardcode credentials
- ❌ Avoid too many retries

---

## 📝 Quick Reference

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
  },
});
```

