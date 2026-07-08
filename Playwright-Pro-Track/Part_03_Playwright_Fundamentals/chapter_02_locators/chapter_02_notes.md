# Part 02: Locators

## 📚 Overview
Locators are the foundation of Playwright tests - they find elements on the page for interaction and assertions.

---

## 🎯 Key Concepts

### 1. Recommended Locators

```typescript
// Role-based (most recommended)
page.getByRole('button', { name: 'Submit' });
page.getByRole('link', { name: 'Home' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('checkbox', { name: 'Remember me' });

// Text-based
page.getByText('Welcome');
page.getByText('Welcome', { exact: true });

// Label-based (for form elements)
page.getByLabel('Email');
page.getByLabel('Password');

// Placeholder-based
page.getByPlaceholder('Enter your email');

// Alt text (for images)
page.getByAltText('Company logo');

// Title attribute
page.getByTitle('Close dialog');

// Test ID (for custom attributes)
page.getByTestId('submit-button');
```

### 2. CSS Selectors

```typescript
// Basic CSS
page.locator('button');
page.locator('.submit-btn');
page.locator('#login-form');
page.locator('[data-testid="submit"]');

// Attribute selectors
page.locator('[type="submit"]');
page.locator('[name="email"]');
page.locator('[href="/login"]');

// Combinators
page.locator('form button');        // Descendant
page.locator('form > button');      // Direct child
page.locator('input + button');     // Adjacent sibling
page.locator('.form-group ~ .btn'); // General sibling

// Pseudo-classes
page.locator('button:first-child');
page.locator('li:nth-child(2)');
page.locator('input:not([disabled])');
```

### 3. XPath Selectors

```typescript
// Basic XPath
page.locator('//button');
page.locator('//button[@type="submit"]');
page.locator('//input[@name="email"]');

// Text matching
page.locator('//button[text()="Submit"]');
page.locator('//button[contains(text(), "Submit")]');

// Axes
page.locator('//div[@class="form"]//button');  // Descendant
page.locator('//label/following-sibling::input'); // Sibling
page.locator('//button/parent::div');  // Parent
```

### 4. Filtering Locators

```typescript
// Filter by text
page.locator('button').filter({ hasText: 'Submit' });

// Filter by another locator
page.locator('.card').filter({ has: page.locator('.price') });

// Filter by not having
page.locator('.item').filter({ hasNot: page.locator('.sold-out') });

// Chain filters
page.locator('.product')
  .filter({ hasText: 'Sale' })
  .filter({ has: page.locator('.in-stock') });
```

### 5. Locator Methods

```typescript
// Get nth element
page.locator('.item').nth(0);      // First
page.locator('.item').nth(-1);     // Last
page.locator('.item').first();
page.locator('.item').last();

// Get all elements
const items = page.locator('.item');
const count = await items.count();
const all = await items.all();

// Get by index in loop
for (let i = 0; i < await items.count(); i++) {
  await items.nth(i).click();
}
```

### 6. Chaining Locators

```typescript
// Chain locators
page.locator('.form').locator('button');
page.locator('.sidebar').getByRole('link', { name: 'Home' });

// Multiple levels
page.locator('.card')
  .filter({ hasText: 'Product' })
  .locator('.price');

// Within frame
page.frameLocator('#iframe').locator('button');
```

### 7. Locator Strictness

```typescript
// Strict mode (default) - fails if multiple matches
await page.locator('button').click();  // Error if multiple buttons

// Get specific element
await page.locator('button').first().click();
await page.locator('button').nth(2).click();

// Check count before action
const buttons = page.locator('button');
expect(await buttons.count()).toBe(1);
await buttons.click();
```

### 8. Best Locator Strategies

```typescript
// Priority order (best to worst):
// 1. getByRole - accessible and resilient
page.getByRole('button', { name: 'Submit' });

// 2. getByLabel - for form inputs
page.getByLabel('Email');

// 3. getByPlaceholder - for inputs
page.getByPlaceholder('Enter email');

// 4. getByText - for static text
page.getByText('Welcome');

// 5. getByTestId - for custom test attributes
page.getByTestId('submit-btn');

// 6. CSS/XPath - last resort
page.locator('.submit-btn');
```

---

## 💻 Practice Exercises

1. Use role-based locators
2. Filter locators by text
3. Chain multiple locators
4. Handle multiple elements
5. Use test IDs effectively

---

## ✅ Best Practices

- ✅ Prefer role-based locators
- ✅ Use getByTestId for complex elements
- ✅ Keep locators simple and readable
- ✅ Avoid brittle selectors
- ❌ Don't use auto-generated selectors
- ❌ Avoid index-based selection

---

## 📝 Quick Reference

```typescript
// Role-based
page.getByRole('button', { name: 'Submit' })

// Text-based
page.getByText('Welcome')
page.getByLabel('Email')
page.getByPlaceholder('Enter email')

// Test ID
page.getByTestId('submit-btn')

// CSS
page.locator('.class')
page.locator('#id')

// Filter
locator.filter({ hasText: 'text' })

// Multiple
locator.first()
locator.nth(0)
locator.count()
```

