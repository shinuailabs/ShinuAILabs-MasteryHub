# Part 02: Locator Strategies in POM

## 📚 Overview
Effective locator strategies in Page Objects ensure maintainable and resilient tests.

---

## 🎯 Key Concepts

### 1. Locator Declaration

```typescript
export class ProductPage {
  readonly page: Page;
  
  // Declare locators as readonly properties
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize in constructor
    this.productTitle = page.locator('.product-title');
    this.productPrice = page.locator('.product-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.quantityInput = page.getByLabel('Quantity');
  }
}
```

### 2. Role-Based Locators

```typescript
export class NavigationPage {
  readonly page: Page;
  
  // Prefer role-based locators
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly contactLink: Locator;
  readonly searchInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.searchInput = page.getByRole('searchbox');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }
}
```

### 3. Test ID Locators

```typescript
export class CheckoutPage {
  readonly page: Page;
  
  // Use test IDs for complex elements
  readonly cartSummary: Locator;
  readonly paymentForm: Locator;
  readonly orderTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartSummary = page.getByTestId('cart-summary');
    this.paymentForm = page.getByTestId('payment-form');
    this.orderTotal = page.getByTestId('order-total');
  }
}
```

### 4. Dynamic Locators

```typescript
export class ProductListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method that returns locator based on parameter
  getProductByName(name: string): Locator {
    return this.page.locator('.product-card').filter({ hasText: name });
  }

  getProductByIndex(index: number): Locator {
    return this.page.locator('.product-card').nth(index);
  }

  getProductPrice(productName: string): Locator {
    return this.getProductByName(productName).locator('.price');
  }
}
```

### 5. Chained Locators

```typescript
export class TablePage {
  readonly page: Page;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('table.data-table');
  }

  // Chain locators for specific elements
  getRow(index: number): Locator {
    return this.table.locator('tbody tr').nth(index);
  }

  getCell(row: number, col: number): Locator {
    return this.getRow(row).locator('td').nth(col);
  }

  getRowByText(text: string): Locator {
    return this.table.locator('tbody tr').filter({ hasText: text });
  }

  getCellInRow(rowText: string, colIndex: number): Locator {
    return this.getRowByText(rowText).locator('td').nth(colIndex);
  }
}
```

### 6. Locator Getters

```typescript
export class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Use getters for computed locators
  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  get errorMessages(): Locator {
    return this.page.locator('.error-message');
  }

  getFieldError(fieldName: string): Locator {
    return this.page.locator(`[data-field="${fieldName}"] .error`);
  }
}
```

### 7. Locator Groups

```typescript
export class DashboardPage {
  readonly page: Page;
  
  // Group related locators
  readonly sidebar = {
    container: this.page.locator('.sidebar'),
    menuItems: this.page.locator('.sidebar .menu-item'),
    collapseButton: this.page.locator('.sidebar .collapse-btn'),
  };

  readonly header = {
    logo: this.page.locator('.header .logo'),
    userMenu: this.page.locator('.header .user-menu'),
    notifications: this.page.locator('.header .notifications'),
  };

  constructor(page: Page) {
    this.page = page;
  }
}

// Usage
await dashboardPage.sidebar.menuItems.first().click();
await dashboardPage.header.userMenu.click();
```

### 8. Frame Locators

```typescript
export class EmbedPage {
  readonly page: Page;
  readonly iframe: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.iframe = page.frameLocator('#embed-frame');
  }

  // Locators within frame
  get frameTitle(): Locator {
    return this.iframe.locator('.title');
  }

  get frameButton(): Locator {
    return this.iframe.getByRole('button', { name: 'Submit' });
  }

  async clickFrameButton() {
    await this.frameButton.click();
  }
}
```

### 9. Locator Best Practices

```typescript
export class BestPracticesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ✅ Good: Role-based
  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  // ✅ Good: Label-based
  get emailInput(): Locator {
    return this.page.getByLabel('Email');
  }

  // ✅ Good: Test ID for complex elements
  get dataGrid(): Locator {
    return this.page.getByTestId('data-grid');
  }

  // ❌ Avoid: Brittle CSS selectors
  // get button(): Locator {
  //   return this.page.locator('div.container > div:nth-child(2) > button');
  // }

  // ❌ Avoid: XPath when not necessary
  // get input(): Locator {
  //   return this.page.locator('//input[@class="form-control"]');
  // }
}
```

---

## 💻 Practice Exercises

1. Create locators using roles
2. Implement dynamic locators
3. Use chained locators
4. Group related locators
5. Handle frame locators

---

## ✅ Best Practices

- ✅ Prefer role-based locators
- ✅ Use test IDs for complex elements
- ✅ Create dynamic locator methods
- ✅ Group related locators
- ❌ Avoid brittle CSS paths
- ❌ Don't use index-based selection

---

## 📝 Quick Reference

```typescript
// Role-based
page.getByRole('button', { name: 'Submit' })

// Label-based
page.getByLabel('Email')

// Test ID
page.getByTestId('submit-btn')

// Dynamic
getProduct(name: string): Locator {
  return this.page.locator('.product').filter({ hasText: name })
}

// Chained
this.table.locator('tr').nth(0).locator('td').nth(1)

// Frame
this.page.frameLocator('#iframe').locator('button')
```

