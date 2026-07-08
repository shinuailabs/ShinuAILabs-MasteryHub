# Part 01: API Testing

## 📚 Overview
Playwright can test APIs directly without browser overhead, perfect for backend testing and test setup.

---

## 🎯 Key Concepts

### 1. API Request Context

```typescript
import { test, expect, request } from '@playwright/test';

test('API test', async ({ request }) => {
  // GET request
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  
  const users = await response.json();
  expect(users.length).toBeGreaterThan(0);
});
```

### 2. HTTP Methods

```typescript
test('CRUD operations', async ({ request }) => {
  // GET
  const getResponse = await request.get('/api/users/1');
  
  // POST
  const postResponse = await request.post('/api/users', {
    data: { name: 'John', email: 'john@example.com' }
  });
  
  // PUT
  const putResponse = await request.put('/api/users/1', {
    data: { name: 'John Updated' }
  });
  
  // PATCH
  const patchResponse = await request.patch('/api/users/1', {
    data: { email: 'new@example.com' }
  });
  
  // DELETE
  const deleteResponse = await request.delete('/api/users/1');
});
```

### 3. Request Options

```typescript
const response = await request.post('/api/data', {
  // Request body
  data: { key: 'value' },
  
  // Headers
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
  },
  
  // Query parameters
  params: { page: 1, limit: 10 },
  
  // Form data
  form: { username: 'john', password: 'secret' },
  
  // Multipart form
  multipart: {
    file: { name: 'file.txt', mimeType: 'text/plain', buffer: Buffer.from('content') }
  },
  
  // Timeout
  timeout: 30000,
  
  // Ignore HTTPS errors
  ignoreHTTPSErrors: true
});
```

### 4. Response Handling

```typescript
test('handle response', async ({ request }) => {
  const response = await request.get('/api/users');
  
  // Status
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  expect(response.statusText()).toBe('OK');
  
  // Headers
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
  
  // Body
  const json = await response.json();
  const text = await response.text();
  const buffer = await response.body();
  
  // URL
  expect(response.url()).toContain('/api/users');
});
```

### 5. Authentication

```typescript
// Create authenticated context
const apiContext = await request.newContext({
  baseURL: 'https://api.example.com',
  extraHTTPHeaders: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
  },
});

// Use in tests
test('authenticated request', async () => {
  const response = await apiContext.get('/api/protected');
  expect(response.ok()).toBeTruthy();
});

// Login and get token
test('login flow', async ({ request }) => {
  const loginResponse = await request.post('/api/login', {
    data: { email: 'user@example.com', password: 'password' }
  });
  const { token } = await loginResponse.json();
  
  // Use token for subsequent requests
  const response = await request.get('/api/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
});
```

### 6. API + UI Testing

```typescript
test('create via API, verify in UI', async ({ page, request }) => {
  // Create user via API
  const response = await request.post('/api/users', {
    data: { name: 'Test User', email: 'test@example.com' }
  });
  const user = await response.json();
  
  // Verify in UI
  await page.goto(`/users/${user.id}`);
  await expect(page.locator('.user-name')).toHaveText('Test User');
});

test('setup via API, test UI', async ({ page, request }) => {
  // Setup test data via API
  await request.post('/api/products', {
    data: { name: 'Test Product', price: 99.99 }
  });
  
  // Test UI
  await page.goto('/products');
  await expect(page.locator('.product-card')).toContainText('Test Product');
});
```

### 7. Response Assertions

```typescript
test('API assertions', async ({ request }) => {
  const response = await request.get('/api/users');
  
  // Status assertions
  expect(response.status()).toBe(200);
  expect(response.status()).not.toBe(404);
  
  // JSON assertions
  const data = await response.json();
  expect(data).toHaveProperty('users');
  expect(data.users).toBeInstanceOf(Array);
  expect(data.users[0]).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String)
  });
  
  // Schema validation (with external library)
  // expect(data).toMatchSchema(userSchema);
});
```

### 8. Error Handling

```typescript
test('handle errors', async ({ request }) => {
  // 404 Not Found
  const notFound = await request.get('/api/users/999999');
  expect(notFound.status()).toBe(404);
  
  // 400 Bad Request
  const badRequest = await request.post('/api/users', {
    data: { invalid: 'data' }
  });
  expect(badRequest.status()).toBe(400);
  const error = await badRequest.json();
  expect(error.message).toBeDefined();
  
  // 401 Unauthorized
  const unauthorized = await request.get('/api/protected');
  expect(unauthorized.status()).toBe(401);
});
```

---

## 💻 Practice Exercises

1. Test CRUD API endpoints
2. Handle authentication
3. Combine API and UI tests
4. Validate response schemas
5. Test error scenarios

---

## ✅ Best Practices

- ✅ Use API for test setup
- ✅ Validate response structure
- ✅ Test error scenarios
- ✅ Use environment variables for URLs
- ❌ Don't hardcode tokens
- ❌ Avoid testing third-party APIs

---

## 📝 Quick Reference

```typescript
// GET
await request.get('/api/users')

// POST
await request.post('/api/users', { data: {} })

// PUT/PATCH/DELETE
await request.put('/api/users/1', { data: {} })
await request.delete('/api/users/1')

// Response
response.status()
response.ok()
await response.json()

// Headers
headers: { 'Authorization': 'Bearer token' }
```

