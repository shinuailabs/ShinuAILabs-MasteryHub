# Part 10: POM Best Practices

## 📚 Overview
Following best practices ensures your Page Object Model implementation is maintainable and scalable.

---

## 🎯 Key Concepts

### 1. Single Responsibility

```typescript
// ✅ Good: One page object per page
export class LoginPage {
  // Only login-related functionality
}

export class DashboardPage {
  // Only dashboard-related functionality
}

// ❌ Bad: Multiple pages in one class
export class AllPages {
  async login() { }
  async viewDashboard() { }
  async checkout() { }
}
```

### 2. Meaningful Names

```typescript
// ✅ Good: Descriptive names
export class ProductPage {
  readonly addToCartButton: Locator;
  readonly productTitle: Locator;
  readonly priceDisplay: Locator;

  async addProductToCart() { }
  async getProductPrice(): Promise<number> { }
}

// ❌ Bad: Generic names
export class Page1 {
  readonly btn1: Locator;
  readonly txt1: Locator;

  async click1() { }
  async getText1() { }
}
```

### 3. Encapsulation

```typescript
// ✅ Good: Hide implementation details
export class SearchPage {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly results: Locator;

  constructor(page: Page) {
    this.searchInput = page.getByRole('searchbox');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.results = page.locator('.search-results');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async getResultCount(): Promise<number> {
    return await this.results.locator('.result-item').count();
  }
}

// ❌ Bad: Exposing internals
export class SearchPage {
  public searchInput: Locator;  // Don't expose
  public searchButton: Locator;
}
```

### 4. DRY Principle

```typescript
// ✅ Good: Reusable components
// components/FormField.ts
export class FormField {
  constructor(private page: Page, private label: string) {}

  async fill(value: string) {
    await this.page.getByLabel(this.label).fill(value);
  }

  async getValue(): Promise<string> {
    return await this.page.getByLabel(this.label).inputValue();
  }
}

// pages/RegistrationPage.ts
export class RegistrationPage {
  readonly nameField: FormField;
  readonly emailField: FormField;

  constructor(page: Page) {
    this.nameField = new FormField(page, 'Name');
    this.emailField = new FormField(page, 'Email');
  }
}
```

### 5. Avoid Assertions in Page Objects

```typescript
// ✅ Good: Return values, assert in tests
export class CartPage {
  async getItemCount(): Promise<number> {
    return await this.items.count();
  }

  async getTotalPrice(): Promise<string> {
    return await this.total.textContent() || '';
  }
}

// In test
test('cart has items', async ({ cartPage }) => {
  expect(await cartPage.getItemCount()).toBe(3);
  expect(await cartPage.getTotalPrice()).toBe('$99.99');
});

// ⚠️ Acceptable: Expect methods for common assertions
export class CartPage {
  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }
}
```

### 6. Page Navigation

```typescript
// ✅ Good: Return new page objects
export class LoginPage {
  async login(email: string, password: string): Promise<DashboardPage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    return new DashboardPage(this.page);
  }
}

// Usage
const dashboard = await loginPage.login('user@example.com', 'password');
await dashboard.expectWelcomeMessage('John');
```

### 7. Consistent Structure

```typescript
// ✅ Good: Consistent page object structure
export class ProductPage {
  // 1. Page reference
  readonly page: Page;

  // 2. Locators
  readonly title: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  // 3. Constructor
  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.product-title');
    this.price = page.locator('.product-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
  }

  // 4. Navigation methods
  async goto(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  // 5. Action methods
  async addToCart() {
    await this.addToCartButton.click();
  }

  // 6. Getter methods
  async getTitle(): Promise<string> {
    return await this.title.textContent() || '';
  }

  // 7. Assertion methods (optional)
  async expectInStock() {
    await expect(this.page.locator('.in-stock')).toBeVisible();
  }
}
```

### 8. Error Handling

```typescript
// ✅ Good: Graceful error handling
export class SafePage {
  async safeClick(locator: Locator, options?: { timeout?: number }): Promise<boolean> {
    try {
      await locator.click({ timeout: options?.timeout ?? 5000 });
      return true;
    } catch (error) {
      console.warn(`Click failed: ${error}`);
      return false;
    }
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
}
```

### 9. Documentation

```typescript
/**
 * Page object for the checkout process.
 * Handles shipping, payment, and order confirmation.
 */
export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fills the shipping address form.
   * @param address - The shipping address details
   */
  async fillShippingAddress(address: ShippingAddress): Promise<void> {
    await this.page.getByLabel('Street').fill(address.street);
    await this.page.getByLabel('City').fill(address.city);
    await this.page.getByLabel('ZIP').fill(address.zip);
  }

  /**
   * Completes the checkout process.
   * @returns The order confirmation number
   */
  async completeCheckout(): Promise<string> {
    await this.page.getByRole('button', { name: 'Place Order' }).click();
    return await this.page.locator('.order-number').textContent() || '';
  }
}
```

---

## 💻 Practice Exercises

1. Refactor to single responsibility
2. Implement encapsulation
3. Apply DRY principle
4. Add proper documentation
5. Create consistent structure

---

## ✅ Best Practices Summary

- ✅ One page object per page
- ✅ Use meaningful names
- ✅ Encapsulate implementation
- ✅ Follow DRY principle
- ✅ Return page objects for navigation
- ✅ Keep consistent structure
- ✅ Document public methods
- ❌ Don't expose locators directly
- ❌ Avoid assertions in action methods
- ❌ Don't mix page logic

---

## 📝 Quick Reference

```typescript
// Structure
class PageObject {
  readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page) { }

  async goto() { }
  async action() { }
  async getValue(): Promise<T> { }
  async expectState() { }
}

// Navigation
async login(): Promise<NextPage> {
  // actions
  return new NextPage(this.page);
}

// Naming
// Pages: LoginPage, DashboardPage
// Methods: login(), addToCart(), getPrice()
// Locators: submitButton, emailInput
```

