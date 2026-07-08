/**
 * Lab 921: Copilot for Test Refactoring
 *
 * CONCEPT:
 * Copilot can help refactor tests to improve maintainability, reduce duplication,
 * and follow best practices. Use Copilot Chat to analyze code and suggest
 * improvements, or let inline suggestions guide refactoring.
 *
 * BULLET POINTS:
 * - Use /fix to improve problematic code
 * - Ask Chat for refactoring suggestions
 * - Extract common patterns into helpers
 * - Convert to Page Object Model
 * - Improve assertion specificity
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Before refactoring - duplicated code
// Ask Copilot: "Refactor these tests to reduce duplication"

// BEFORE:
test.describe('Before Refactoring', () => {
  test('test 1 - login and check dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'user@test.com');
    await page.fill('#password', 'pass123');
    await page.click('#submit');
    await expect(page).toHaveURL('/dashboard');
  });

  test('test 2 - login and check profile', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'user@test.com');
    await page.fill('#password', 'pass123');
    await page.click('#submit');
    await page.click('#profile-link');
    await expect(page).toHaveURL('/profile');
  });
});

// AFTER: Copilot-suggested refactoring
test.describe('After Refactoring', () => {
  async function login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('#submit');
  }

  test.beforeEach(async ({ page }) => {
    await login(page, 'user@test.com', 'pass123');
  });

  test('should show dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to profile', async ({ page }) => {
    await page.click('#profile-link');
    await expect(page).toHaveURL('/profile');
  });
});

// Example 2: Convert to Page Object Model
// Ask Copilot: "Convert this test to use Page Object Model"

// BEFORE: Inline locators
test('checkout flow - before POM', async ({ page }) => {
  await page.goto('/cart');
  await page.click('[data-testid="checkout-btn"]');
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.fill('[data-testid="cvv"]', '123');
  await page.click('[data-testid="pay-btn"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});

// AFTER: Page Object Model
class CheckoutPagePOM {
  constructor(private page: Page) {}

  readonly checkoutButton = () => this.page.locator('[data-testid="checkout-btn"]');
  readonly cardNumber = () => this.page.locator('[data-testid="card-number"]');
  readonly expiry = () => this.page.locator('[data-testid="expiry"]');
  readonly cvv = () => this.page.locator('[data-testid="cvv"]');
  readonly payButton = () => this.page.locator('[data-testid="pay-btn"]');
  readonly successMessage = () => this.page.locator('[data-testid="success"]');

  async startCheckout() {
    await this.checkoutButton().click();
  }

  async fillPaymentDetails(card: string, exp: string, cvv: string) {
    await this.cardNumber().fill(card);
    await this.expiry().fill(exp);
    await this.cvv().fill(cvv);
  }

  async completePayment() {
    await this.payButton().click();
    await this.successMessage().waitFor({ state: 'visible' });
  }
}

test('checkout flow - with POM', async ({ page }) => {
  const checkout = new CheckoutPagePOM(page);
  await page.goto('/cart');
  await checkout.startCheckout();
  await checkout.fillPaymentDetails('4111111111111111', '12/25', '123');
  await checkout.completePayment();
  await expect(checkout.successMessage()).toBeVisible();
});

// Example 3: Improve flaky test
// Ask Copilot: "/fix this flaky test"

// BEFORE: Flaky
test.skip('flaky test - before fix', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('.load-data'); // Might not be ready
  await expect(page.locator('.data-table')).toBeVisible();
});

// AFTER: Stable
test('stable test - after fix', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  const loadButton = page.locator('.load-data');
  await expect(loadButton).toBeEnabled();
  await loadButton.click();
  await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 });
});

/**
 * EXERCISE:
 * 1. Find a test with duplicated code
 * 2. Ask Copilot Chat to suggest refactoring
 * 3. Implement the suggested changes
 * 4. Verify tests still pass
 *
 * LEARNING:
 * - Copilot recognizes common refactoring patterns
 * - Use Chat for complex refactoring decisions
 * - Always run tests after refactoring
 * - Incremental refactoring is safer
 *
 * ONE LINER:
 * "Let Copilot spot the patterns, you make the refactoring decisions."
 */

export { CheckoutPagePOM };

