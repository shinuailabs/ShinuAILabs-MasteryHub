# Part 09: Playwright Integration

## 📚 Overview
Deep integration of Playwright with Cucumber enables powerful browser automation with BDD syntax.

---

## 🎯 Key Concepts

### 1. Enhanced World Class

```typescript
// support/world.ts
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  
  // Page objects
  loginPage?: LoginPage;
  dashboardPage?: DashboardPage;
  
  // Test data
  testData: Record<string, any> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  async launchBrowser(browserType: string = 'chromium') {
    const browsers = { chromium, firefox, webkit };
    const launcher = browsers[browserType] || chromium;
    
    this.browser = await launcher.launch({
      headless: process.env.HEADLESS !== 'false'
    });
  }

  async createContext(options?: Parameters<Browser['newContext']>[0]) {
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ...options
    });
    this.page = await this.context.newPage();
  }

  async cleanup() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(PlaywrightWorld);
```

### 2. Browser Configuration Hooks

```typescript
// support/hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import { PlaywrightWorld } from './world';

let browser: Browser;

BeforeAll(async function() {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });
});

Before(async function(this: PlaywrightWorld) {
  this.browser = browser;
  this.context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: process.env.RECORD_VIDEO ? {
      dir: 'videos/'
    } : undefined
  });
  this.page = await this.context.newPage();
});

After(async function(this: PlaywrightWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  await this.context?.close();
});

AfterAll(async function() {
  await browser?.close();
});
```

### 3. Page Object Integration

```typescript
// support/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

// step-definitions/login.steps.ts
import { LoginPage } from '../support/pages/LoginPage';

Given('I am on the login page', async function(this: PlaywrightWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When('I login with {string} and {string}', async function(
  this: PlaywrightWorld, email: string, password: string
) {
  await this.loginPage!.login(email, password);
});
```

### 4. API Testing Integration

```typescript
// support/api-client.ts
import { APIRequestContext } from '@playwright/test';

export class APIClient {
  constructor(private request: APIRequestContext) {}

  async createUser(data: any) {
    const response = await this.request.post('/api/users', { data });
    return response.json();
  }

  async deleteUser(id: string) {
    await this.request.delete(`/api/users/${id}`);
  }
}

// support/hooks.ts
Before(async function(this: PlaywrightWorld) {
  const apiContext = await this.browser.newContext();
  this.apiRequest = await apiContext.request;
  this.apiClient = new APIClient(this.apiRequest);
});

// step-definitions/api.steps.ts
Given('a user exists with email {string}', async function(
  this: PlaywrightWorld, email: string
) {
  const user = await this.apiClient.createUser({ email });
  this.testData.userId = user.id;
});

After({ tags: '@creates-user' }, async function(this: PlaywrightWorld) {
  if (this.testData.userId) {
    await this.apiClient.deleteUser(this.testData.userId);
  }
});
```

### 5. Authentication with Storage State

```typescript
// support/auth.ts
import { Browser } from '@playwright/test';
import * as fs from 'fs';

export async function setupAuth(browser: Browser) {
  const authFile = 'auth.json';
  
  if (fs.existsSync(authFile)) {
    return;
  }
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('/dashboard');
  
  await context.storageState({ path: authFile });
  await context.close();
}

// support/hooks.ts
Before({ tags: '@authenticated' }, async function(this: PlaywrightWorld) {
  this.context = await this.browser.newContext({
    storageState: 'auth.json'
  });
  this.page = await this.context.newPage();
});
```

### 6. Network Mocking

```typescript
// step-definitions/mock.steps.ts
Given('the API returns {int} products', async function(
  this: PlaywrightWorld, count: number
) {
  const products = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 9.99
  }));
  
  await this.page.route('**/api/products', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(products)
    });
  });
});

Given('the API returns an error', async function(this: PlaywrightWorld) {
  await this.page.route('**/api/**', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    });
  });
});
```

### 7. Tracing

```typescript
// support/hooks.ts
Before(async function(this: PlaywrightWorld, scenario) {
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
});

After(async function(this: PlaywrightWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    const tracePath = `traces/${scenario.pickle.name.replace(/\s+/g, '_')}.zip`;
    await this.context.tracing.stop({ path: tracePath });
    
    const traceBuffer = await fs.promises.readFile(tracePath);
    this.attach(traceBuffer, 'application/zip');
  } else {
    await this.context.tracing.stop();
  }
});
```

---

## 💻 Practice Exercises

1. Create enhanced world class
2. Integrate page objects
3. Set up API testing
4. Implement authentication
5. Add network mocking

---

## ✅ Best Practices

- ✅ Use page objects with Cucumber
- ✅ Share browser instance
- ✅ Implement proper cleanup
- ✅ Use storage state for auth
- ❌ Don't create browser per scenario
- ❌ Avoid hardcoded waits

---

## 📝 Quick Reference

```typescript
// World class
class PlaywrightWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

// Page object in steps
this.loginPage = new LoginPage(this.page);
await this.loginPage.login(email, password);

// Storage state
context = await browser.newContext({
  storageState: 'auth.json'
});

// Network mock
await page.route('**/api/**', route => {
  route.fulfill({ status: 200, body: '{}' });
});
```

