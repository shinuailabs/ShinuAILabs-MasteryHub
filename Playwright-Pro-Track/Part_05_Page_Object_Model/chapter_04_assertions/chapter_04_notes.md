# Part 04: Assertions in POM

## 📚 Overview
Assertions in Page Objects can be handled in tests or encapsulated in page objects for reusability.

---

## 🎯 Key Concepts

### 1. Assertions in Tests

```typescript
// pages/LoginPage.ts
export class LoginPage {
  readonly page: Page;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorMessage = page.locator('.error-message');
    this.successMessage = page.locator('.success-message');
  }
}

// tests/login.spec.ts
test('shows error on invalid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('invalid@email.com', 'wrongpass');
  
  // Assertions in test
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
});
```

### 2. Assertion Methods in Page Objects

```typescript
// pages/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userStats: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('.welcome');
    this.userStats = page.locator('.stats');
  }

  // Assertion methods
  async expectWelcomeMessage(name: string) {
    await expect(this.welcomeMessage).toHaveText(`Welcome, ${name}!`);
  }

  async expectStatsVisible() {
    await expect(this.userStats).toBeVisible();
  }

  async expectUrl() {
    await expect(this.page).toHaveURL('/dashboard');
  }
}

// Usage
test('dashboard displays correctly', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.expectUrl();
  await dashboard.expectWelcomeMessage('John');
  await dashboard.expectStatsVisible();
});
```

### 3. Verification Methods

```typescript
export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Return boolean for flexible assertions
  async isProductInStock(): Promise<boolean> {
    return await this.page.locator('.in-stock').isVisible();
  }

  async hasDiscount(): Promise<boolean> {
    return await this.page.locator('.discount-badge').isVisible();
  }

  async getPrice(): Promise<number> {
    const text = await this.page.locator('.price').textContent();
    return parseFloat(text?.replace('$', '') || '0');
  }
}

// Usage
test('product availability', async ({ page }) => {
  const productPage = new ProductPage(page);
  
  expect(await productPage.isProductInStock()).toBe(true);
  expect(await productPage.hasDiscount()).toBe(false);
  expect(await productPage.getPrice()).toBeGreaterThan(0);
});
```

### 4. Expect Methods Pattern

```typescript
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart-item');
    this.totalPrice = page.locator('.total-price');
    this.emptyMessage = page.locator('.empty-cart');
  }

  // Expect methods with descriptive names
  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectTotalPrice(price: string) {
    await expect(this.totalPrice).toHaveText(price);
  }

  async expectCartEmpty() {
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.cartItems).toHaveCount(0);
  }

  async expectCartNotEmpty() {
    await expect(this.emptyMessage).toBeHidden();
    await expect(this.cartItems).not.toHaveCount(0);
  }
}
```

### 5. Soft Assertions

```typescript
export class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateFormFields() {
    // Soft assertions - continue even if one fails
    await expect.soft(this.page.getByLabel('Name')).toBeVisible();
    await expect.soft(this.page.getByLabel('Email')).toBeVisible();
    await expect.soft(this.page.getByLabel('Phone')).toBeVisible();
    await expect.soft(this.page.getByRole('button', { name: 'Submit' })).toBeEnabled();
  }

  async validateAllErrors(expectedErrors: string[]) {
    const errors = this.page.locator('.error-message');
    
    for (const error of expectedErrors) {
      await expect.soft(errors).toContainText(error);
    }
  }
}
```

### 6. Custom Assertion Helpers

```typescript
// helpers/assertions.ts
import { Locator, expect } from '@playwright/test';

export async function expectVisible(locator: Locator, message?: string) {
  await expect(locator, message).toBeVisible();
}

export async function expectText(locator: Locator, text: string) {
  await expect(locator).toHaveText(text);
}

export async function expectCount(locator: Locator, count: number) {
  await expect(locator).toHaveCount(count);
}

// Usage in page object
import { expectVisible, expectText } from '../helpers/assertions';

export class HomePage {
  async verifyHeader() {
    await expectVisible(this.header, 'Header should be visible');
    await expectText(this.title, 'Welcome');
  }
}
```

### 7. State Verification

```typescript
export class UserProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUserProfile(user: {
    name: string;
    email: string;
    role: string;
  }) {
    await expect(this.page.getByTestId('user-name')).toHaveText(user.name);
    await expect(this.page.getByTestId('user-email')).toHaveText(user.email);
    await expect(this.page.getByTestId('user-role')).toHaveText(user.role);
  }

  async verifyEditMode() {
    await expect(this.page.getByLabel('Name')).toBeEditable();
    await expect(this.page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  }

  async verifyViewMode() {
    await expect(this.page.getByLabel('Name')).not.toBeEditable();
    await expect(this.page.getByRole('button', { name: 'Edit' })).toBeVisible();
  }
}
```

### 8. Assertion Chaining

```typescript
export class OrderPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyOrderComplete(orderId: string, total: string) {
    // Chain multiple assertions
    await expect(this.page).toHaveURL(/\/order\/confirmation/);
    await expect(this.page.locator('.order-id')).toHaveText(orderId);
    await expect(this.page.locator('.order-total')).toHaveText(total);
    await expect(this.page.locator('.success-icon')).toBeVisible();
  }
}
```

---

## 💻 Practice Exercises

1. Add assertion methods to page objects
2. Create verification methods
3. Implement soft assertions
4. Build custom assertion helpers
5. Test state verification

---

## ✅ Best Practices

- ✅ Use descriptive assertion method names
- ✅ Group related assertions
- ✅ Use soft assertions for multiple checks
- ✅ Return booleans for flexible testing
- ❌ Don't over-assert in page objects
- ❌ Avoid assertions in action methods

---

## 📝 Quick Reference

```typescript
// Assertion method
async expectVisible() {
  await expect(this.element).toBeVisible();
}

// Verification method
async isVisible(): Promise<boolean> {
  return await this.element.isVisible();
}

// Soft assertion
await expect.soft(locator).toBeVisible();

// Multiple assertions
async verifyState(data: Data) {
  await expect(this.name).toHaveText(data.name);
  await expect(this.email).toHaveText(data.email);
}
```

