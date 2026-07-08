# Part 10: Test Organization

## 📚 Overview
Proper test organization improves maintainability, readability, and scalability of your test suite.

---

## 🎯 Key Concepts

### 1. Test Structure

```typescript
import { test, expect } from '@playwright/test';

// Single test
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

// Test with description
test('user can login @smoke', async ({ page }) => {
  // Test code
});
```

### 2. Test Groups (describe)

```typescript
test.describe('Authentication', () => {
  test('user can login', async ({ page }) => { });
  test('user can logout', async ({ page }) => { });
  test('user can reset password', async ({ page }) => { });
});

// Nested groups
test.describe('User Management', () => {
  test.describe('Admin', () => {
    test('can create user', async ({ page }) => { });
    test('can delete user', async ({ page }) => { });
  });
  
  test.describe('Regular User', () => {
    test('can view profile', async ({ page }) => { });
    test('can edit profile', async ({ page }) => { });
  });
});
```

### 3. Hooks

```typescript
test.describe('Dashboard', () => {
  test.beforeAll(async () => {
    // Run once before all tests in group
    console.log('Setup database');
  });
  
  test.afterAll(async () => {
    // Run once after all tests in group
    console.log('Cleanup database');
  });
  
  test.beforeEach(async ({ page }) => {
    // Run before each test
    await page.goto('/dashboard');
  });
  
  test.afterEach(async ({ page }) => {
    // Run after each test
    await page.screenshot({ path: 'after-test.png' });
  });
  
  test('shows welcome message', async ({ page }) => { });
  test('shows user stats', async ({ page }) => { });
});
```

### 4. Test Tags

```typescript
// Add tags to tests
test('login @smoke @auth', async ({ page }) => { });
test('checkout @e2e @payment', async ({ page }) => { });

// Run by tag
// npx playwright test --grep @smoke
// npx playwright test --grep-invert @slow

// Multiple tags
// npx playwright test --grep "@smoke|@critical"
```

### 5. Test Annotations

```typescript
// Skip test
test.skip('not implemented', async ({ page }) => { });

// Skip conditionally
test('firefox only', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox', 'Firefox only');
});

// Mark as failing
test.fail('known bug', async ({ page }) => { });

// Slow test (3x timeout)
test.slow('performance test', async ({ page }) => { });

// Focus on single test
test.only('debug this', async ({ page }) => { });

// Fixme
test.fixme('needs fix', async ({ page }) => { });
```

### 6. File Organization

```
tests/
├── auth/
│   ├── login.spec.ts
│   ├── logout.spec.ts
│   └── password-reset.spec.ts
├── dashboard/
│   ├── overview.spec.ts
│   └── settings.spec.ts
├── e2e/
│   ├── checkout.spec.ts
│   └── user-journey.spec.ts
├── fixtures/
│   └── test-data.ts
└── utils/
    └── helpers.ts
```

### 7. Custom Fixtures

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

type MyFixtures = {
  loggedInPage: Page;
  testUser: { email: string; password: string };
};

export const test = base.extend<MyFixtures>({
  testUser: async ({}, use) => {
    await use({
      email: 'test@example.com',
      password: 'password123'
    });
  },
  
  loggedInPage: async ({ page, testUser }, use) => {
    await page.goto('/login');
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.click('button[type="submit"]');
    await use(page);
  },
});

// Use in tests
test('dashboard shows user info', async ({ loggedInPage }) => {
  await expect(loggedInPage.locator('.user-name')).toBeVisible();
});
```

### 8. Test Steps

```typescript
test('complete checkout', async ({ page }) => {
  await test.step('Add item to cart', async () => {
    await page.goto('/products');
    await page.click('.add-to-cart');
  });
  
  await test.step('Go to checkout', async () => {
    await page.click('.cart-icon');
    await page.click('.checkout-btn');
  });
  
  await test.step('Fill shipping info', async () => {
    await page.fill('#address', '123 Main St');
    await page.fill('#city', 'New York');
  });
  
  await test.step('Complete payment', async () => {
    await page.fill('#card', '4242424242424242');
    await page.click('.pay-btn');
  });
  
  await expect(page.locator('.success')).toBeVisible();
});
```

### 9. Parameterized Tests

```typescript
// Test with different data
const users = [
  { role: 'admin', canDelete: true },
  { role: 'editor', canDelete: false },
  { role: 'viewer', canDelete: false },
];

for (const user of users) {
  test(`${user.role} delete permission`, async ({ page }) => {
    await page.goto(`/login?role=${user.role}`);
    const deleteBtn = page.locator('.delete-btn');
    
    if (user.canDelete) {
      await expect(deleteBtn).toBeVisible();
    } else {
      await expect(deleteBtn).toBeHidden();
    }
  });
}
```

---

## 💻 Practice Exercises

1. Organize tests by feature
2. Create custom fixtures
3. Use test steps for clarity
4. Implement parameterized tests
5. Use tags for test filtering

---

## ✅ Best Practices

- ✅ Group related tests with describe
- ✅ Use meaningful test names
- ✅ Keep tests independent
- ✅ Use fixtures for setup
- ❌ Don't share state between tests
- ❌ Avoid test interdependencies

---

## 📝 Quick Reference

```typescript
// Group
test.describe('Group', () => { })

// Hooks
test.beforeAll(async () => { })
test.beforeEach(async ({ page }) => { })
test.afterEach(async ({ page }) => { })
test.afterAll(async () => { })

// Annotations
test.skip()
test.only()
test.fail()
test.slow()

// Steps
await test.step('name', async () => { })

// Tags
test('name @tag', async () => { })
// npx playwright test --grep @tag
```

