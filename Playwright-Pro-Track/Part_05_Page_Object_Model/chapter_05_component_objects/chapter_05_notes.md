# Part 05: Component Objects

## 📚 Overview
Component Objects represent reusable UI components that appear across multiple pages.

---

## 🎯 Key Concepts

### 1. What are Component Objects?

```typescript
// Components are reusable UI elements
// - Navigation bar
// - Footer
// - Search box
// - Modal dialogs
// - Data tables
// - Form fields

// Component Object encapsulates component behavior
// Can be used across multiple page objects
```

### 2. Basic Component Object

```typescript
// components/NavigationBar.ts
import { Page, Locator } from '@playwright/test';

export class NavigationBar {
  readonly page: Page;
  readonly container: Locator;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartIcon: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('nav.main-nav');
    this.logo = this.container.locator('.logo');
    this.homeLink = this.container.getByRole('link', { name: 'Home' });
    this.productsLink = this.container.getByRole('link', { name: 'Products' });
    this.cartIcon = this.container.locator('.cart-icon');
    this.userMenu = this.container.locator('.user-menu');
  }

  async goToHome() {
    await this.homeLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartIcon.locator('.count').textContent();
    return parseInt(text || '0');
  }
}
```

### 3. Using Components in Pages

```typescript
// pages/HomePage.ts
import { Page } from '@playwright/test';
import { NavigationBar } from '../components/NavigationBar';
import { Footer } from '../components/Footer';

export class HomePage {
  readonly page: Page;
  readonly nav: NavigationBar;
  readonly footer: Footer;
  readonly heroSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = new NavigationBar(page);
    this.footer = new Footer(page);
    this.heroSection = page.locator('.hero');
  }

  async goto() {
    await this.page.goto('/');
  }
}

// Usage
test('navigate from home', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.nav.goToProducts();
});
```

### 4. Modal Component

```typescript
// components/Modal.ts
export class Modal {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page, selector: string = '.modal') {
    this.page = page;
    this.container = page.locator(selector);
    this.title = this.container.locator('.modal-title');
    this.closeButton = this.container.locator('.close-btn');
    this.confirmButton = this.container.getByRole('button', { name: 'Confirm' });
    this.cancelButton = this.container.getByRole('button', { name: 'Cancel' });
  }

  async isOpen(): Promise<boolean> {
    return await this.container.isVisible();
  }

  async close() {
    await this.closeButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getTitle(): Promise<string> {
    return await this.title.textContent() || '';
  }
}
```

### 5. Table Component

```typescript
// components/DataTable.ts
export class DataTable {
  readonly page: Page;
  readonly table: Locator;
  readonly headers: Locator;
  readonly rows: Locator;

  constructor(page: Page, selector: string = 'table') {
    this.page = page;
    this.table = page.locator(selector);
    this.headers = this.table.locator('thead th');
    this.rows = this.table.locator('tbody tr');
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getColumnHeaders(): Promise<string[]> {
    return await this.headers.allTextContents();
  }

  getRow(index: number): Locator {
    return this.rows.nth(index);
  }

  getCell(row: number, col: number): Locator {
    return this.rows.nth(row).locator('td').nth(col);
  }

  async getCellText(row: number, col: number): Promise<string> {
    return await this.getCell(row, col).textContent() || '';
  }

  getRowByText(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async clickRowAction(rowText: string, action: string) {
    await this.getRowByText(rowText)
      .getByRole('button', { name: action })
      .click();
  }
}
```

### 6. Form Component

```typescript
// components/SearchForm.ts
export class SearchForm {
  readonly page: Page;
  readonly container: Locator;
  readonly input: Locator;
  readonly submitButton: Locator;
  readonly clearButton: Locator;

  constructor(page: Page, selector: string = '.search-form') {
    this.page = page;
    this.container = page.locator(selector);
    this.input = this.container.getByRole('searchbox');
    this.submitButton = this.container.getByRole('button', { name: 'Search' });
    this.clearButton = this.container.locator('.clear-btn');
  }

  async search(query: string) {
    await this.input.fill(query);
    await this.submitButton.click();
  }

  async clear() {
    await this.clearButton.click();
  }

  async getValue(): Promise<string> {
    return await this.input.inputValue();
  }
}
```

### 7. Dropdown Component

```typescript
// components/Dropdown.ts
export class Dropdown {
  readonly page: Page;
  readonly trigger: Locator;
  readonly menu: Locator;
  readonly items: Locator;

  constructor(page: Page, triggerSelector: string) {
    this.page = page;
    this.trigger = page.locator(triggerSelector);
    this.menu = this.trigger.locator('..').locator('.dropdown-menu');
    this.items = this.menu.locator('.dropdown-item');
  }

  async open() {
    if (!await this.menu.isVisible()) {
      await this.trigger.click();
    }
  }

  async close() {
    if (await this.menu.isVisible()) {
      await this.trigger.click();
    }
  }

  async selectItem(text: string) {
    await this.open();
    await this.items.filter({ hasText: text }).click();
  }

  async getItems(): Promise<string[]> {
    await this.open();
    return await this.items.allTextContents();
  }
}
```

### 8. Component Composition

```typescript
// pages/ProductListPage.ts
import { DataTable } from '../components/DataTable';
import { SearchForm } from '../components/SearchForm';
import { Pagination } from '../components/Pagination';

export class ProductListPage {
  readonly page: Page;
  readonly search: SearchForm;
  readonly table: DataTable;
  readonly pagination: Pagination;

  constructor(page: Page) {
    this.page = page;
    this.search = new SearchForm(page, '.product-search');
    this.table = new DataTable(page, '.product-table');
    this.pagination = new Pagination(page);
  }

  async searchProducts(query: string) {
    await this.search.search(query);
  }

  async getProductCount(): Promise<number> {
    return await this.table.getRowCount();
  }

  async goToPage(pageNum: number) {
    await this.pagination.goToPage(pageNum);
  }
}
```

---

## 💻 Practice Exercises

1. Create navigation component
2. Build modal component
3. Implement data table component
4. Create form components
5. Compose components in pages

---

## ✅ Best Practices

- ✅ Keep components focused
- ✅ Make components reusable
- ✅ Use composition over inheritance
- ✅ Pass selectors for flexibility
- ❌ Don't duplicate component code
- ❌ Avoid page-specific logic in components

---

## 📝 Quick Reference

```typescript
// Component class
class Component {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page, selector: string) {
    this.page = page;
    this.container = page.locator(selector);
  }
}

// Use in page
class PageObject {
  readonly component: Component;

  constructor(page: Page) {
    this.component = new Component(page, '.selector');
  }
}

// Usage
await page.component.action();
```

