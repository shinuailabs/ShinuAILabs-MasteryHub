# Part 06: Fixtures with POM

## 📚 Overview
Fixtures provide a way to set up and inject page objects into tests automatically.

---

## 🎯 Key Concepts

### 1. Basic Page Object Fixture

```typescript
// fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
```

### 2. Using Fixtures in Tests

```typescript
// tests/login.spec.ts
import { test, expect } from '../fixtures/test-fixtures';

test('login with fixture', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(loginPage.page).toHaveURL('/dashboard');
});

test('dashboard with fixture', async ({ dashboardPage }) => {
  // dashboardPage is automatically created
  await dashboardPage.goto();
  await dashboardPage.expectWelcomeMessage('John');
});
```

### 3. Fixtures with Setup

```typescript
// fixtures/test-fixtures.ts
export const test = base.extend<MyFixtures>({
  // Fixture with navigation
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();  // Navigate before test
    await use(loginPage);
  },
  
  // Fixture with authentication
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password');
    await use(page);
  },
  
  // Dashboard after login
  loggedInDashboard: async ({ authenticatedPage }, use) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await use(dashboard);
  },
});
```

### 4. Worker-Scoped Fixtures

```typescript
// fixtures/test-fixtures.ts
type WorkerFixtures = {
  apiClient: APIClient;
};

export const test = base.extend<MyFixtures, WorkerFixtures>({
  // Worker-scoped: shared across tests in same worker
  apiClient: [async ({}, use) => {
    const client = new APIClient();
    await client.authenticate();
    await use(client);
    await client.cleanup();
  }, { scope: 'worker' }],
  
  // Test-scoped: new instance per test
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

### 5. Fixture Dependencies

```typescript
// fixtures/test-fixtures.ts
export const test = base.extend<MyFixtures>({
  // Base fixture
  basePage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
  
  // Depends on basePage
  homePage: async ({ basePage }, use) => {
    const homePage = new HomePage(basePage);
    await use(homePage);
  },
  
  // Depends on homePage
  productPage: async ({ homePage }, use) => {
    await homePage.nav.goToProducts();
    const productPage = new ProductPage(homePage.page);
    await use(productPage);
  },
});
```

### 6. Parameterized Fixtures

```typescript
// fixtures/test-fixtures.ts
type MyFixtures = {
  userRole: 'admin' | 'user' | 'guest';
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  userRole: ['user', { option: true }],  // Default value, can be overridden
  
  authenticatedPage: async ({ page, userRole }, use) => {
    const credentials = {
      admin: { email: 'admin@test.com', password: 'admin123' },
      user: { email: 'user@test.com', password: 'user123' },
      guest: { email: 'guest@test.com', password: 'guest123' },
    };
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials[userRole].email, credentials[userRole].password);
    await use(page);
  },
});

// Usage
test.describe('admin tests', () => {
  test.use({ userRole: 'admin' });
  
  test('admin can delete', async ({ authenticatedPage }) => {
    // Logged in as admin
  });
});
```

### 7. Fixture with Cleanup

```typescript
// fixtures/test-fixtures.ts
export const test = base.extend<MyFixtures>({
  testUser: async ({ request }, use) => {
    // Setup: Create test user
    const response = await request.post('/api/users', {
      data: { email: `test-${Date.now()}@example.com`, password: 'test123' }
    });
    const user = await response.json();
    
    await use(user);
    
    // Cleanup: Delete test user
    await request.delete(`/api/users/${user.id}`);
  },
  
  productPage: async ({ page, testUser }, use) => {
    // Use test user in page
    await page.goto(`/users/${testUser.id}/products`);
    await use(new ProductPage(page));
  },
});
```

### 8. Multiple Page Fixtures

```typescript
// fixtures/test-fixtures.ts
type MultiPageFixtures = {
  adminPage: Page;
  userPage: Page;
  adminDashboard: DashboardPage;
  userDashboard: DashboardPage;
};

export const test = base.extend<MultiPageFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // Login as admin
    await use(page);
    await context.close();
  },
  
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // Login as user
    await use(page);
    await context.close();
  },
  
  adminDashboard: async ({ adminPage }, use) => {
    await use(new DashboardPage(adminPage));
  },
  
  userDashboard: async ({ userPage }, use) => {
    await use(new DashboardPage(userPage));
  },
});
```

---

## 💻 Practice Exercises

1. Create page object fixtures
2. Implement fixture dependencies
3. Add setup and cleanup
4. Use parameterized fixtures
5. Create multi-page fixtures

---

## ✅ Best Practices

- ✅ Use fixtures for common setup
- ✅ Clean up resources after tests
- ✅ Use worker scope for expensive setup
- ✅ Keep fixtures focused
- ❌ Don't create circular dependencies
- ❌ Avoid complex fixture chains

---

## 📝 Quick Reference

```typescript
// Define fixtures
export const test = base.extend<MyFixtures>({
  pageObject: async ({ page }, use) => {
    await use(new PageObject(page));
  },
});

// With setup
pageObject: async ({ page }, use) => {
  const po = new PageObject(page);
  await po.goto();
  await use(po);
},

// With cleanup
fixture: async ({}, use) => {
  const resource = await setup();
  await use(resource);
  await cleanup(resource);
},

// Worker scope
fixture: [async ({}, use) => {
  await use(value);
}, { scope: 'worker' }],

// Parameterized
option: ['default', { option: true }],
```

