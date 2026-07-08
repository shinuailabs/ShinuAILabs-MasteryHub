# Part 08: Base Page Class

## 📚 Overview
A Base Page class provides common functionality shared across all page objects.

---

## 🎯 Key Concepts

### 1. Basic Base Page

```typescript
// pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

### 2. Extending Base Page

```typescript
// pages/LoginPage.ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### 3. Common Components in Base

```typescript
// pages/BasePage.ts
import { NavigationBar } from '../components/NavigationBar';
import { Footer } from '../components/Footer';

export abstract class BasePage {
  readonly page: Page;
  readonly nav: NavigationBar;
  readonly footer: Footer;

  constructor(page: Page) {
    this.page = page;
    this.nav = new NavigationBar(page);
    this.footer = new Footer(page);
  }

  async goToHome() {
    await this.nav.goToHome();
  }

  async goToProducts() {
    await this.nav.goToProducts();
  }

  async logout() {
    await this.nav.logout();
  }
}
```

### 4. Common Actions

```typescript
// pages/BasePage.ts
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Wait helpers
  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator: Locator) {
    await locator.waitFor({ state: 'hidden' });
  }

  // Scroll helpers
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // Alert handling
  async acceptAlert() {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async dismissAlert() {
    this.page.once('dialog', dialog => dialog.dismiss());
  }
}
```

### 5. Common Assertions

```typescript
// pages/BasePage.ts
import { expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  async expectTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  async expectText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }
}
```

### 6. Abstract Methods

```typescript
// pages/BasePage.ts
export abstract class BasePage {
  readonly page: Page;
  abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  // Abstract method - must be implemented
  abstract waitForPageReady(): Promise<void>;

  async goto() {
    await this.page.goto(this.url);
    await this.waitForPageReady();
  }
}

// pages/DashboardPage.ts
export class DashboardPage extends BasePage {
  readonly url = '/dashboard';

  async waitForPageReady() {
    await this.page.waitForSelector('.dashboard-loaded');
  }
}

// pages/ProfilePage.ts
export class ProfilePage extends BasePage {
  readonly url = '/profile';

  async waitForPageReady() {
    await this.page.waitForSelector('.profile-container');
  }
}
```

### 7. Utility Methods

```typescript
// pages/BasePage.ts
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Get text content
  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  // Get input value
  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  // Check if element exists
  async exists(locator: Locator): Promise<boolean> {
    return await locator.count() > 0;
  }

  // Get element count
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // Execute JavaScript
  async executeScript<T>(script: string): Promise<T> {
    return await this.page.evaluate(script);
  }

  // Refresh page
  async refresh() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }
}
```

### 8. Error Handling

```typescript
// pages/BasePage.ts
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async safeClick(locator: Locator): Promise<boolean> {
    try {
      await locator.click({ timeout: 5000 });
      return true;
    } catch (error) {
      console.error(`Failed to click: ${error}`);
      return false;
    }
  }

  async safeFill(locator: Locator, value: string): Promise<boolean> {
    try {
      await locator.fill(value);
      return true;
    } catch (error) {
      console.error(`Failed to fill: ${error}`);
      return false;
    }
  }

  async retryAction<T>(
    action: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await action();
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
    throw new Error('Retry failed');
  }
}
```

---

## 💻 Practice Exercises

1. Create a base page class
2. Add common components
3. Implement utility methods
4. Add abstract methods
5. Extend base page in page objects

---

## ✅ Best Practices

- ✅ Keep base page focused
- ✅ Use abstract methods for required implementations
- ✅ Include common components
- ✅ Add utility methods
- ❌ Don't add page-specific logic
- ❌ Avoid deep inheritance hierarchies

---

## 📝 Quick Reference

```typescript
// Base page
abstract class BasePage {
  readonly page: Page;
  abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  abstract waitForPageReady(): Promise<void>;

  async goto() {
    await this.page.goto(this.url);
  }
}

// Extending
class MyPage extends BasePage {
  readonly url = '/my-page';

  async waitForPageReady() {
    await this.page.waitForSelector('.loaded');
  }
}
```

