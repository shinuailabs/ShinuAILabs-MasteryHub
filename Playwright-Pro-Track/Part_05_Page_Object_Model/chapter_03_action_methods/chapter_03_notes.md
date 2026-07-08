# Part 03: Action Methods

## 📚 Overview
Action methods encapsulate user interactions, making tests readable and maintainable.

---

## 🎯 Key Concepts

### 1. Basic Action Methods

```typescript
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

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }
}
```

### 2. Composite Actions

```typescript
export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillShippingAddress(address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) {
    await this.page.getByLabel('Street').fill(address.street);
    await this.page.getByLabel('City').fill(address.city);
    await this.page.getByLabel('State').selectOption(address.state);
    await this.page.getByLabel('ZIP Code').fill(address.zip);
  }

  async fillPaymentInfo(payment: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) {
    await this.page.getByLabel('Card Number').fill(payment.cardNumber);
    await this.page.getByLabel('Expiry').fill(payment.expiry);
    await this.page.getByLabel('CVV').fill(payment.cvv);
  }

  async completeCheckout(address: any, payment: any) {
    await this.fillShippingAddress(address);
    await this.fillPaymentInfo(payment);
    await this.page.getByRole('button', { name: 'Place Order' }).click();
  }
}
```

### 3. Actions with Return Values

```typescript
export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getProductTitle(): Promise<string> {
    return await this.page.locator('.product-title').textContent() || '';
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.page.locator('.price').textContent();
    return parseFloat(priceText?.replace('$', '') || '0');
  }

  async getProductDetails(): Promise<{ title: string; price: number }> {
    return {
      title: await this.getProductTitle(),
      price: await this.getProductPrice(),
    };
  }

  async isInStock(): Promise<boolean> {
    return await this.page.locator('.in-stock').isVisible();
  }
}
```

### 4. Actions with Page Navigation

```typescript
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async goToLogin(): Promise<LoginPage> {
    await this.page.getByRole('link', { name: 'Login' }).click();
    return new LoginPage(this.page);
  }

  async goToProducts(): Promise<ProductListPage> {
    await this.page.getByRole('link', { name: 'Products' }).click();
    return new ProductListPage(this.page);
  }

  async search(query: string): Promise<SearchResultsPage> {
    await this.page.getByRole('searchbox').fill(query);
    await this.page.keyboard.press('Enter');
    return new SearchResultsPage(this.page);
  }
}
```

### 5. Parameterized Actions

```typescript
export class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectOption(fieldName: string, value: string) {
    await this.page.getByLabel(fieldName).selectOption(value);
  }

  async checkCheckbox(label: string, checked: boolean = true) {
    const checkbox = this.page.getByLabel(label);
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async fillField(fieldName: string, value: string) {
    await this.page.getByLabel(fieldName).fill(value);
  }

  async fillForm(data: Record<string, string>) {
    for (const [field, value] of Object.entries(data)) {
      await this.fillField(field, value);
    }
  }
}
```

### 6. Wait Actions

```typescript
export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('.dashboard-loaded');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDataRefresh() {
    await this.page.waitForResponse('**/api/dashboard/data');
  }

  async refreshAndWait() {
    await Promise.all([
      this.page.waitForResponse('**/api/dashboard/data'),
      this.page.getByRole('button', { name: 'Refresh' }).click(),
    ]);
  }
}
```

### 7. Error Handling Actions

```typescript
export class SafeActionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async safeClick(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.click({ timeout });
      return true;
    } catch (error) {
      console.log(`Failed to click: ${error}`);
      return false;
    }
  }

  async safeFill(locator: Locator, value: string): Promise<boolean> {
    try {
      await locator.fill(value);
      return true;
    } catch (error) {
      console.log(`Failed to fill: ${error}`);
      return false;
    }
  }

  async clickIfVisible(locator: Locator): Promise<boolean> {
    if (await locator.isVisible()) {
      await locator.click();
      return true;
    }
    return false;
  }
}
```

### 8. Async Action Chains

```typescript
export class WorkflowPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async completeWorkflow(): Promise<void> {
    await this.step1();
    await this.step2();
    await this.step3();
    await this.submitWorkflow();
  }

  private async step1() {
    await this.page.getByRole('button', { name: 'Start' }).click();
    await this.page.waitForSelector('.step-1-complete');
  }

  private async step2() {
    await this.page.getByLabel('Option').selectOption('value');
    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  private async step3() {
    await this.page.getByLabel('Confirm').check();
  }

  private async submitWorkflow() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
```

---

## 💻 Practice Exercises

1. Create basic action methods
2. Implement composite actions
3. Add return values to actions
4. Handle page navigation
5. Implement error handling

---

## ✅ Best Practices

- ✅ Use descriptive method names
- ✅ Keep actions atomic
- ✅ Return page objects for navigation
- ✅ Handle waits appropriately
- ❌ Don't mix actions and assertions
- ❌ Avoid overly complex methods

---

## 📝 Quick Reference

```typescript
// Basic action
async clickButton() {
  await this.button.click();
}

// With parameters
async fillField(value: string) {
  await this.input.fill(value);
}

// With return
async getText(): Promise<string> {
  return await this.element.textContent() || '';
}

// Navigation
async goToPage(): Promise<NextPage> {
  await this.link.click();
  return new NextPage(this.page);
}

// Composite
async completeForm(data: FormData) {
  await this.fillName(data.name);
  await this.fillEmail(data.email);
  await this.submit();
}
```

