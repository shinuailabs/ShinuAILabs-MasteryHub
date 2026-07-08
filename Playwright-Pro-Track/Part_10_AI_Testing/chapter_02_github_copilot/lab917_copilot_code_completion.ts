/**
 * Lab 917: Copilot Code Completion for Tests
 *
 * CONCEPT:
 * Copilot's code completion predicts and suggests code as you type. For testing,
 * it can complete entire test blocks, assertions, locators, and helper functions
 * based on context from your codebase and comments.
 *
 * BULLET POINTS:
 * - Inline suggestions appear as ghost text
 * - Context-aware: uses file content, imports, and comments
 * - Multi-line completions for complex code blocks
 * - Learns patterns from your existing tests
 * - Tab to accept, Esc to reject, Alt+] for alternatives
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Comment-driven completion
// Type this comment and Copilot suggests the implementation:

// Test that user can add product to cart and see updated cart count
test('add product to cart updates cart count', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-card"]:first-child');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});

// Example 2: Pattern-based completion
// After writing one test, Copilot learns the pattern:

test('remove product from cart updates cart count', async ({ page }) => {
  // Copilot suggests similar structure based on previous test
  await page.goto('/cart');
  await page.click('[data-testid="remove-item"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
});

// Example 3: Function signature completion
// Type function name and Copilot completes parameters and body:

async function fillShippingForm(
  page: Page,
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  }
) {
  await page.fill('[data-testid="street"]', address.street);
  await page.fill('[data-testid="city"]', address.city);
  await page.fill('[data-testid="zip"]', address.zip);
  await page.selectOption('[data-testid="country"]', address.country);
}

// Example 4: Assertion chain completion
test('product details page shows all information', async ({ page }) => {
  await page.goto('/products/123');

  // Type "await expect" and Copilot suggests relevant assertions:
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
  await expect(page.locator('[data-testid="add-to-cart"]')).toBeEnabled();
});

/**
 * EXERCISE:
 * 1. Write a comment describing a test scenario
 * 2. Press Enter and let Copilot suggest the test
 * 3. Modify the suggestion to match your needs
 * 4. Practice cycling through alternative suggestions
 */

// Exercise: Complete these tests with Copilot's help

// Test user registration with valid data
test('user registration with valid data', async ({ page }) => {
  // Let Copilot complete this test
  await page.goto('/register');
  await page.fill('[data-testid="email"]', 'newuser@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');
  await page.click('[data-testid="register-button"]');
  await expect(page).toHaveURL('/welcome');
});

/**
 * CODING QUESTIONS & SOLUTIONS:
 */

// Question 1: Create a helper that Copilot can learn from
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

// Question 2: Type-safe test data with Copilot completion
interface TestUser {
  email: string;
  password: string;
  name: string;
}

const testUsers: TestUser[] = [
  { email: 'admin@test.com', password: 'Admin123!', name: 'Admin User' },
  { email: 'user@test.com', password: 'User123!', name: 'Regular User' },
  { email: 'guest@test.com', password: 'Guest123!', name: 'Guest User' },
];

// Question 3: Copilot completes parameterized tests
for (const user of testUsers) {
  test(`login as ${user.name}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="user-name"]')).toContainText(
      user.name
    );
  });
}

/**
 * LEARNING:
 * - Good comments = better completions
 * - Consistent naming patterns help Copilot learn
 * - Type definitions improve suggestion accuracy
 * - Review completions for correctness
 * - Use Alt+] to see alternative suggestions
 *
 * ONE LINER:
 * "Write the comment, let Copilot write the code - then verify it's correct."
 */

export { fillShippingForm, waitForPageLoad, testUsers };

