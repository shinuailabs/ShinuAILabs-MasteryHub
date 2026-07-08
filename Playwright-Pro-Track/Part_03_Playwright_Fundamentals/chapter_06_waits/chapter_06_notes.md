# Part 06: Waits

## 📚 Overview
Playwright has built-in auto-waiting, but sometimes explicit waits are needed for complex scenarios.

---

## 🎯 Key Concepts

### 1. Auto-Waiting

```typescript
// Playwright auto-waits for:
// - Element to be attached to DOM
// - Element to be visible
// - Element to be stable (not animating)
// - Element to be enabled
// - Element to receive events

// These actions auto-wait:
await page.click('button');        // Waits for button
await page.fill('input', 'text');  // Waits for input
await page.check('input');         // Waits for checkbox

// Assertions also auto-wait:
await expect(page.locator('.msg')).toBeVisible();
```

### 2. Wait for Selector

```typescript
// Wait for element to appear
await page.waitForSelector('.loading-complete');

// Wait for element to be hidden
await page.waitForSelector('.spinner', { state: 'hidden' });

// Wait for element to be detached
await page.waitForSelector('.modal', { state: 'detached' });

// With timeout
await page.waitForSelector('.element', { timeout: 10000 });
```

### 3. Wait for Load State

```typescript
// DOM content loaded
await page.waitForLoadState('domcontentloaded');

// Full page load
await page.waitForLoadState('load');

// Network idle (no requests for 500ms)
await page.waitForLoadState('networkidle');

// After navigation
await page.goto('/page');
await page.waitForLoadState('networkidle');
```

### 4. Wait for URL

```typescript
// Wait for exact URL
await page.waitForURL('https://example.com/dashboard');

// Wait for URL pattern
await page.waitForURL('**/dashboard');
await page.waitForURL(/\/dashboard/);

// Wait with function
await page.waitForURL(url => url.searchParams.has('success'));
```

### 5. Wait for Function

```typescript
// Wait for condition in page context
await page.waitForFunction(() => {
  return document.querySelector('.loaded') !== null;
});

// With arguments
await page.waitForFunction(
  (selector) => document.querySelector(selector)?.textContent === 'Ready',
  '.status'
);

// Polling interval
await page.waitForFunction(
  () => window.dataLoaded === true,
  { polling: 100 }  // Check every 100ms
);
```

### 6. Wait for Response

```typescript
// Wait for specific response
const response = await page.waitForResponse('**/api/users');
const data = await response.json();

// Wait with predicate
const response = await page.waitForResponse(
  response => response.url().includes('/api/') && response.status() === 200
);

// Wait for response after action
const [response] = await Promise.all([
  page.waitForResponse('**/api/submit'),
  page.getByRole('button', { name: 'Submit' }).click()
]);
```

### 7. Wait for Request

```typescript
// Wait for request to be made
const request = await page.waitForRequest('**/api/users');
console.log(request.method());

// Wait with predicate
const request = await page.waitForRequest(
  request => request.url().includes('/api/') && request.method() === 'POST'
);
```

### 8. Wait for Event

```typescript
// Wait for download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download' }).click()
]);
await download.saveAs('file.pdf');

// Wait for dialog
page.on('dialog', async dialog => {
  await dialog.accept();
});
await page.getByRole('button', { name: 'Delete' }).click();

// Wait for popup
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open' }).click()
]);
```

### 9. Timeout Configuration

```typescript
// Global timeout in config
// playwright.config.ts
export default defineConfig({
  timeout: 30000,  // Test timeout
  expect: {
    timeout: 5000  // Assertion timeout
  }
});

// Per-test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // ...
});

// Per-action timeout
await page.click('button', { timeout: 10000 });
await expect(page.locator('.slow')).toBeVisible({ timeout: 15000 });
```

---

## 💻 Practice Exercises

1. Use auto-waiting effectively
2. Wait for network responses
3. Handle loading states
4. Configure timeouts
5. Wait for custom conditions

---

## ✅ Best Practices

- ✅ Rely on auto-waiting when possible
- ✅ Use assertions for waiting
- ✅ Wait for specific conditions
- ✅ Set appropriate timeouts
- ❌ Don't use page.waitForTimeout()
- ❌ Avoid arbitrary sleep times

---

## 📝 Quick Reference

```typescript
// Selector
await page.waitForSelector('.element')
await page.waitForSelector('.element', { state: 'hidden' })

// Load state
await page.waitForLoadState('networkidle')

// URL
await page.waitForURL('/path')

// Function
await page.waitForFunction(() => condition)

// Response
await page.waitForResponse('**/api/data')

// Event
await page.waitForEvent('download')

// Timeout
await action({ timeout: 10000 })
```

