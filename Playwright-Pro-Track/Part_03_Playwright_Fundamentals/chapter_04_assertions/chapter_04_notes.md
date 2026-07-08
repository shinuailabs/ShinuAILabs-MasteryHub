# Part 04: Assertions

## 📚 Overview
Assertions verify that the application behaves as expected. Playwright provides auto-retrying assertions.

---

## 🎯 Key Concepts

### 1. Page Assertions

```typescript
import { test, expect } from '@playwright/test';

// Title
await expect(page).toHaveTitle('Home Page');
await expect(page).toHaveTitle(/Home/);

// URL
await expect(page).toHaveURL('https://example.com/home');
await expect(page).toHaveURL(/\/home$/);

// Screenshot comparison
await expect(page).toHaveScreenshot('homepage.png');
```

### 2. Locator Assertions

```typescript
// Visibility
await expect(page.getByRole('button')).toBeVisible();
await expect(page.getByRole('button')).toBeHidden();
await expect(page.getByRole('button')).not.toBeVisible();

// Enabled/Disabled
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('button')).toBeDisabled();

// Editable
await expect(page.getByLabel('Email')).toBeEditable();

// Focused
await expect(page.getByLabel('Email')).toBeFocused();

// Attached to DOM
await expect(page.locator('.modal')).toBeAttached();
```

### 3. Text Assertions

```typescript
// Has text (substring)
await expect(page.locator('.message')).toHaveText('Welcome');
await expect(page.locator('.message')).toHaveText(/Welcome/);

// Contains text
await expect(page.locator('.message')).toContainText('Welcome');

// Multiple elements
await expect(page.locator('.item')).toHaveText(['Item 1', 'Item 2', 'Item 3']);

// Empty
await expect(page.locator('.message')).toBeEmpty();
await expect(page.locator('.message')).not.toBeEmpty();
```

### 4. Attribute Assertions

```typescript
// Has attribute
await expect(page.locator('input')).toHaveAttribute('type', 'email');
await expect(page.locator('input')).toHaveAttribute('required');

// Has class
await expect(page.locator('.btn')).toHaveClass('btn btn-primary');
await expect(page.locator('.btn')).toHaveClass(/primary/);

// Has ID
await expect(page.locator('form')).toHaveId('login-form');

// Has CSS
await expect(page.locator('.error')).toHaveCSS('color', 'rgb(255, 0, 0)');
```

### 5. Value Assertions

```typescript
// Input value
await expect(page.getByLabel('Email')).toHaveValue('user@example.com');
await expect(page.getByLabel('Email')).toHaveValue(/example\.com/);

// Multiple values (for multi-select)
await expect(page.getByLabel('Colors')).toHaveValues(['red', 'blue']);

// Checkbox/Radio checked
await expect(page.getByLabel('Remember me')).toBeChecked();
await expect(page.getByLabel('Remember me')).not.toBeChecked();
```

### 6. Count Assertions

```typescript
// Element count
await expect(page.locator('.item')).toHaveCount(5);
await expect(page.locator('.item')).toHaveCount(0);

// At least one
const items = page.locator('.item');
expect(await items.count()).toBeGreaterThan(0);
```

### 7. Generic Assertions

```typescript
// Equality
expect(value).toBe(5);
expect(value).toEqual({ name: 'John' });

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeGreaterThanOrEqual(5);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(0.3, 5);

// Strings
expect(value).toContain('hello');
expect(value).toMatch(/hello/);

// Arrays
expect(array).toContain('item');
expect(array).toHaveLength(3);
```

### 8. Soft Assertions

```typescript
// Soft assertions don't stop test on failure
await expect.soft(page.locator('.title')).toHaveText('Welcome');
await expect.soft(page.locator('.subtitle')).toHaveText('Hello');

// Test continues even if above fail
await page.getByRole('button').click();

// Check if any soft assertions failed
expect(test.info().errors).toHaveLength(0);
```

### 9. Custom Timeout

```typescript
// Override default timeout
await expect(page.locator('.slow-element')).toBeVisible({ timeout: 10000 });

// Polling assertions
await expect(async () => {
  const response = await page.request.get('/api/status');
  expect(response.status()).toBe(200);
}).toPass({ timeout: 30000 });

// Configure default timeout
test.use({ expect: { timeout: 10000 } });
```

---

## 💻 Practice Exercises

1. Assert page title and URL
2. Verify element visibility
3. Check form values
4. Use soft assertions
5. Handle async assertions

---

## ✅ Best Practices

- ✅ Use auto-retrying assertions
- ✅ Be specific with assertions
- ✅ Use soft assertions for multiple checks
- ✅ Set appropriate timeouts
- ❌ Don't use arbitrary waits
- ❌ Avoid asserting implementation details

---

## 📝 Quick Reference

```typescript
// Page
await expect(page).toHaveTitle('Title')
await expect(page).toHaveURL('/path')

// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()

// Text
await expect(locator).toHaveText('text')
await expect(locator).toContainText('text')

// Value
await expect(locator).toHaveValue('value')
await expect(locator).toBeChecked()

// Attributes
await expect(locator).toHaveAttribute('attr', 'value')
await expect(locator).toHaveClass('class')

// Count
await expect(locator).toHaveCount(5)

// Negation
await expect(locator).not.toBeVisible()
```

