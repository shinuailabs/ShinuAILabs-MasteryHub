# Part 03: Authentication

## 📚 Overview
Efficient authentication handling is crucial for test performance. Playwright supports storage state reuse.

---

## 🎯 Key Concepts

### 1. Basic Login

```typescript
test('login test', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### 2. Save Storage State

```typescript
// Save authentication state
test('save auth state', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('/dashboard');
  
  // Save storage state (cookies + localStorage)
  await page.context().storageState({ path: 'auth.json' });
});
```

### 3. Reuse Storage State

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'tests',
      dependencies: ['setup'],
      use: {
        storageState: 'auth.json',
      },
    },
  ],
});

// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'auth.json' });
});
```

### 4. Global Setup Authentication

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('#email', 'admin@example.com');
  await page.fill('#password', 'adminpass');
  await page.click('button[type="submit"]');
  
  await page.context().storageState({ path: 'admin-auth.json' });
  await browser.close();
}

export default globalSetup;

// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: 'admin-auth.json',
  },
});
```

### 5. Multiple Users

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'admin tests',
      dependencies: ['setup'],
      use: { storageState: 'admin-auth.json' },
      testMatch: /.*admin.*\.spec\.ts/,
    },
    {
      name: 'user tests',
      dependencies: ['setup'],
      use: { storageState: 'user-auth.json' },
      testMatch: /.*user.*\.spec\.ts/,
    },
  ],
});

// auth.setup.ts
import { test as setup } from '@playwright/test';

const users = [
  { email: 'admin@example.com', password: 'admin', file: 'admin-auth.json' },
  { email: 'user@example.com', password: 'user', file: 'user-auth.json' },
];

for (const user of users) {
  setup(`authenticate ${user.email}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.click('button[type="submit"]');
    await page.context().storageState({ path: user.file });
  });
}
```

### 6. API Authentication

```typescript
// Login via API (faster)
test('API login', async ({ page, request }) => {
  // Get token via API
  const response = await request.post('/api/login', {
    data: { email: 'user@example.com', password: 'password' }
  });
  const { token } = await response.json();
  
  // Set token in browser
  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('authToken', token);
  }, token);
  
  // Now navigate to protected page
  await page.goto('/dashboard');
});
```

### 7. OAuth/SSO Testing

```typescript
// Mock OAuth for testing
test('OAuth login', async ({ page }) => {
  // Intercept OAuth redirect
  await page.route('**/oauth/authorize**', async route => {
    // Simulate successful OAuth
    const url = new URL(route.request().url());
    const redirectUri = url.searchParams.get('redirect_uri');
    await route.fulfill({
      status: 302,
      headers: {
        'Location': `${redirectUri}?code=mock-auth-code`
      }
    });
  });
  
  // Mock token exchange
  await page.route('**/oauth/token', route => {
    route.fulfill({
      body: JSON.stringify({
        access_token: 'mock-token',
        token_type: 'Bearer'
      })
    });
  });
  
  await page.goto('/login');
  await page.click('button.oauth-login');
});
```

### 8. Session Management

```typescript
// Check if logged in
test('verify session', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Should not redirect to login
  await expect(page).not.toHaveURL('/login');
  
  // User info should be visible
  await expect(page.locator('.user-name')).toBeVisible();
});

// Test logout
test('logout', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('button.logout');
  
  await expect(page).toHaveURL('/login');
  
  // Try accessing protected page
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});
```

---

## 💻 Practice Exercises

1. Implement storage state reuse
2. Set up multiple user roles
3. Use API for authentication
4. Test logout functionality
5. Handle OAuth flows

---

## ✅ Best Practices

- ✅ Reuse authentication state
- ✅ Use API login when possible
- ✅ Test different user roles
- ✅ Store auth files in .gitignore
- ❌ Don't login in every test
- ❌ Avoid hardcoding credentials

---

## 📝 Quick Reference

```typescript
// Save state
await page.context().storageState({ path: 'auth.json' })

// Use state in config
use: { storageState: 'auth.json' }

// Setup project
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  { name: 'tests', dependencies: ['setup'], use: { storageState: 'auth.json' } }
]

// API login
const { token } = await request.post('/api/login', { data }).then(r => r.json())
await page.evaluate(t => localStorage.setItem('token', t), token)
```

