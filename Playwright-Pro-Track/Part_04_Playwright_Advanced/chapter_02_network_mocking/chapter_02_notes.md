# Part 02: Network Mocking

## 📚 Overview
Network mocking allows intercepting and modifying network requests for testing edge cases and isolating tests.

---

## 🎯 Key Concepts

### 1. Route Interception

```typescript
// Intercept and modify response
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock User' }])
  });
});

await page.goto('/users');
// Page will show mocked data
```

### 2. Mock Responses

```typescript
// Mock with JSON
await page.route('**/api/data', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true }),
    headers: { 'Content-Type': 'application/json' }
  });
});

// Mock with file
await page.route('**/api/users', route => {
  route.fulfill({ path: './mocks/users.json' });
});

// Mock error response
await page.route('**/api/data', route => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Server Error' })
  });
});
```

### 3. Modify Requests

```typescript
// Modify request before sending
await page.route('**/api/**', async route => {
  const headers = {
    ...route.request().headers(),
    'X-Custom-Header': 'test-value'
  };
  await route.continue({ headers });
});

// Modify POST body
await page.route('**/api/submit', async route => {
  const postData = route.request().postDataJSON();
  postData.timestamp = Date.now();
  await route.continue({ postData: JSON.stringify(postData) });
});
```

### 4. Modify Responses

```typescript
// Intercept and modify response
await page.route('**/api/users', async route => {
  const response = await route.fetch();
  const json = await response.json();
  
  // Modify data
  json.users = json.users.map(user => ({
    ...user,
    name: user.name.toUpperCase()
  }));
  
  await route.fulfill({
    response,
    body: JSON.stringify(json)
  });
});
```

### 5. Abort Requests

```typescript
// Block specific requests
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// Block analytics
await page.route('**/analytics/**', route => route.abort());
await page.route('**/tracking/**', route => route.abort());

// Block with specific error
await page.route('**/api/slow', route => {
  route.abort('timedout');
});
```

### 6. URL Patterns

```typescript
// Glob patterns
await page.route('**/api/**', handler);           // Any API path
await page.route('**/*.css', handler);            // All CSS files
await page.route('**/users/*', handler);          // /users/anything

// Regex patterns
await page.route(/\/api\/users\/\d+/, handler);   // /api/users/123
await page.route(/\.(png|jpg|gif)$/, handler);    // Image files

// Function predicate
await page.route(
  url => url.pathname.startsWith('/api/'),
  handler
);
```

### 7. Wait for Requests

```typescript
// Wait for specific request
const [request] = await Promise.all([
  page.waitForRequest('**/api/submit'),
  page.click('button[type="submit"]')
]);
console.log('Request URL:', request.url());
console.log('Request method:', request.method());

// Wait for response
const [response] = await Promise.all([
  page.waitForResponse('**/api/submit'),
  page.click('button[type="submit"]')
]);
const data = await response.json();
```

### 8. HAR Recording

```typescript
// Record network to HAR file
await page.routeFromHAR('network.har', {
  update: true  // Record mode
});
await page.goto('/');
// ... perform actions
await page.close();

// Replay from HAR file
await page.routeFromHAR('network.har');
await page.goto('/');
// Network requests will be served from HAR
```

### 9. Testing Scenarios

```typescript
// Test loading state
test('shows loading spinner', async ({ page }) => {
  await page.route('**/api/data', async route => {
    await new Promise(r => setTimeout(r, 2000));  // Delay
    await route.fulfill({ body: '[]' });
  });
  
  await page.goto('/');
  await expect(page.locator('.spinner')).toBeVisible();
});

// Test error handling
test('shows error message', async ({ page }) => {
  await page.route('**/api/data', route => {
    route.fulfill({ status: 500 });
  });
  
  await page.goto('/');
  await expect(page.locator('.error')).toHaveText('Failed to load');
});

// Test empty state
test('shows empty state', async ({ page }) => {
  await page.route('**/api/items', route => {
    route.fulfill({ body: JSON.stringify([]) });
  });
  
  await page.goto('/items');
  await expect(page.locator('.empty-state')).toBeVisible();
});
```

---

## 💻 Practice Exercises

1. Mock API responses
2. Test error scenarios
3. Block unnecessary requests
4. Modify request headers
5. Use HAR recording

---

## ✅ Best Practices

- ✅ Mock external APIs
- ✅ Test error scenarios
- ✅ Block analytics in tests
- ✅ Use HAR for complex mocking
- ❌ Don't mock everything
- ❌ Avoid flaky timing-based mocks

---

## 📝 Quick Reference

```typescript
// Mock response
await page.route('**/api/**', route => {
  route.fulfill({ body: JSON.stringify(data) })
})

// Modify request
await page.route('**/api/**', route => {
  route.continue({ headers: newHeaders })
})

// Abort request
await page.route('**/*.png', route => route.abort())

// Wait for request/response
await page.waitForRequest('**/api/data')
await page.waitForResponse('**/api/data')

// HAR
await page.routeFromHAR('file.har')
```

