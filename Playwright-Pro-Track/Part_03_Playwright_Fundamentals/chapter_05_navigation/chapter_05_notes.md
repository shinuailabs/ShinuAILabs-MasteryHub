# Part 05: Navigation

## 📚 Overview
Navigation methods control browser navigation - going to URLs, handling redirects, and managing history.

---

## 🎯 Key Concepts

### 1. Basic Navigation

```typescript
// Go to URL
await page.goto('https://example.com');

// With options
await page.goto('https://example.com', {
  waitUntil: 'domcontentloaded',  // or 'load', 'networkidle'
  timeout: 30000
});

// Relative URL (uses baseURL from config)
await page.goto('/login');

// Navigate and wait for specific element
await page.goto('/dashboard');
await page.waitForSelector('.dashboard-loaded');
```

### 2. Wait Until Options

```typescript
// Wait for DOM content loaded
await page.goto('/page', { waitUntil: 'domcontentloaded' });

// Wait for load event
await page.goto('/page', { waitUntil: 'load' });

// Wait for network idle (no requests for 500ms)
await page.goto('/page', { waitUntil: 'networkidle' });

// Wait for commit (navigation started)
await page.goto('/page', { waitUntil: 'commit' });
```

### 3. Navigation Actions

```typescript
// Reload page
await page.reload();
await page.reload({ waitUntil: 'networkidle' });

// Go back
await page.goBack();
await page.goBack({ waitUntil: 'load' });

// Go forward
await page.goForward();

// Get current URL
const url = page.url();
```

### 4. Wait for Navigation

```typescript
// Wait for navigation after click
await Promise.all([
  page.waitForNavigation(),
  page.getByRole('link', { name: 'Next' }).click()
]);

// Or use waitForURL
await page.getByRole('link', { name: 'Next' }).click();
await page.waitForURL('**/page-2');

// Wait for specific URL pattern
await page.waitForURL(/\/dashboard/);
await page.waitForURL(url => url.pathname === '/dashboard');
```

### 5. Handle Redirects

```typescript
// Follow redirects automatically
await page.goto('/old-page');  // Redirects to /new-page
expect(page.url()).toContain('/new-page');

// Wait for final URL
await page.goto('/login');
await page.fill('#email', 'user@example.com');
await page.fill('#password', 'password');
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard');
```

### 6. New Pages and Popups

```typescript
// Handle new tab/window
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open in new tab' }).click()
]);
await newPage.waitForLoadState();
await expect(newPage).toHaveTitle('New Page');

// Handle multiple pages
const pages = context.pages();
for (const p of pages) {
  console.log(await p.title());
}
```

### 7. Frames

```typescript
// Get frame by name
const frame = page.frame('frame-name');

// Get frame by URL
const frame = page.frame({ url: /\/frame-content/ });

// Frame locator (recommended)
const frameLocator = page.frameLocator('#my-iframe');
await frameLocator.getByRole('button').click();

// Nested frames
const nested = page.frameLocator('#outer').frameLocator('#inner');
await nested.getByText('Click me').click();
```

### 8. Wait for Load State

```typescript
// Wait for load state
await page.waitForLoadState('domcontentloaded');
await page.waitForLoadState('load');
await page.waitForLoadState('networkidle');

// After navigation
await page.goto('/page');
await page.waitForLoadState('networkidle');

// After click
await page.getByRole('button').click();
await page.waitForLoadState('load');
```

### 9. URL Assertions

```typescript
// Assert current URL
await expect(page).toHaveURL('https://example.com/dashboard');
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveURL(url => url.searchParams.has('id'));

// Check URL parts
const url = new URL(page.url());
expect(url.pathname).toBe('/dashboard');
expect(url.searchParams.get('id')).toBe('123');
```

---

## 💻 Practice Exercises

1. Navigate between pages
2. Handle redirects
3. Work with frames
4. Handle new tabs/popups
5. Wait for navigation events

---

## ✅ Best Practices

- ✅ Use baseURL in config
- ✅ Wait for appropriate load state
- ✅ Use waitForURL after navigation
- ✅ Handle popups with waitForEvent
- ❌ Don't use fixed timeouts
- ❌ Avoid networkidle for fast tests

---

## 📝 Quick Reference

```typescript
// Navigate
await page.goto('/path')
await page.reload()
await page.goBack()
await page.goForward()

// Wait
await page.waitForURL('/path')
await page.waitForLoadState('load')
await page.waitForNavigation()

// Frames
page.frameLocator('#iframe')

// New pages
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]')
])

// URL
page.url()
await expect(page).toHaveURL('/path')
```

