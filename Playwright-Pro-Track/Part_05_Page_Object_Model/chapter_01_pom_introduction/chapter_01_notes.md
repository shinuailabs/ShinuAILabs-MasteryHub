# Part 01: Page Object Model Introduction

## 📚 Overview
Page Object Model (POM) is a design pattern that creates an abstraction layer between tests and page elements.

---

## 🎯 Key Concepts

### 1. What is POM?

```typescript
// Without POM - Hard to maintain
test('login test', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
});

// With POM - Clean and maintainable
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
});
```

### 2. Benefits of POM

```typescript
// 1. Reusability - Use same page object in multiple tests
// 2. Maintainability - Change locator in one place
// 3. Readability - Tests read like user actions
// 4. Separation of concerns - Tests vs page structure
// 5. Reduced duplication - DRY principle
```

### 3. Basic Page Object

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### 4. Using Page Objects

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});

test('invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('wrong@example.com', 'wrongpass');
  
  await expect(loginPage.errorMessage).toBeVisible();
});
```

### 5. Project Structure

```
project/
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ProfilePage.ts
│   └── index.ts
├── tests/
│   ├── login.spec.ts
│   ├── dashboard.spec.ts
│   └── profile.spec.ts
├── fixtures/
│   └── test-fixtures.ts
└── playwright.config.ts
```

### 6. Page Object with Assertions

```typescript
// pages/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userStats: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('.welcome-message');
    this.userStats = page.locator('.user-stats');
  }

  async expectWelcomeMessage(name: string) {
    await expect(this.welcomeMessage).toContainText(`Welcome, ${name}`);
  }

  async expectStatsVisible() {
    await expect(this.userStats).toBeVisible();
  }
}
```

### 7. Page Navigation

```typescript
// pages/LoginPage.ts
export class LoginPage {
  // ... locators

  async login(email: string, password: string): Promise<DashboardPage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    // Return next page object
    return new DashboardPage(this.page);
  }
}

// Usage
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  const dashboardPage = await loginPage.login('user@example.com', 'password');
  await dashboardPage.expectWelcomeMessage('John');
});
```

### 8. Base Page Class

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

// pages/LoginPage.ts
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  // ... extends BasePage functionality
}
```

---

## 💻 Practice Exercises

1. Create a basic page object
2. Implement login page object
3. Add page navigation methods
4. Create base page class
5. Use page objects in tests

---

## ✅ Best Practices

- ✅ One page object per page
- ✅ Use meaningful method names
- ✅ Return page objects for navigation
- ✅ Keep locators in page objects
- ❌ Don't put assertions in page objects (debatable)
- ❌ Avoid exposing page internals

---

## 📝 Quick Reference

```typescript
// Page Object Structure
class PageName {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator('selector');
  }

  async action() {
    await this.element.click();
  }
}

// Usage
const pageObject = new PageName(page);
await pageObject.action();
```

