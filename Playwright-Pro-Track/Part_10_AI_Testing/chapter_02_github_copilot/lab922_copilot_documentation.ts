/**
 * Lab 922: Copilot for Test Documentation
 *
 * CONCEPT:
 * Copilot can generate comprehensive documentation for your tests including
 * JSDoc comments, README files, test plans, and inline explanations. Good
 * documentation improves maintainability and team collaboration.
 *
 * BULLET POINTS:
 * - Generate JSDoc comments with /doc command
 * - Create README documentation
 * - Add inline comments explaining complex logic
 * - Generate test case descriptions
 * - Document test data and fixtures
 */

import { test, expect, Page, TestInfo } from '@playwright/test';

/**
 * Authentication helper for test automation
 *
 * @description Handles user authentication flows for e2e tests
 * @example
 * ```typescript
 * const auth = new AuthHelper(page);
 * await auth.loginAs('admin');
 * ```
 */
class AuthHelper {
  /**
   * Creates an instance of AuthHelper
   * @param page - Playwright Page object
   */
  constructor(private page: Page) {}

  /**
   * Logs in a user with the specified role
   *
   * @param role - User role ('admin' | 'user' | 'guest')
   * @returns Promise that resolves when login is complete
   * @throws Error if login fails or role is invalid
   *
   * @example
   * ```typescript
   * await auth.loginAs('admin');
   * // User is now logged in as admin
   * ```
   */
  async loginAs(role: 'admin' | 'user' | 'guest'): Promise<void> {
    const credentials = this.getCredentials(role);
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email"]', credentials.email);
    await this.page.fill('[data-testid="password"]', credentials.password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForURL('/dashboard');
  }

  /**
   * Gets credentials for a specific role
   * @param role - User role
   * @returns Credentials object with email and password
   * @private
   */
  private getCredentials(role: string): { email: string; password: string } {
    const credentialsMap: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@test.com', password: 'AdminPass123!' },
      user: { email: 'user@test.com', password: 'UserPass123!' },
      guest: { email: 'guest@test.com', password: 'GuestPass123!' },
    };
    return credentialsMap[role] || credentialsMap.guest;
  }
}

/**
 * @fileoverview E2E tests for the checkout flow
 * @description Tests cover the complete purchase journey from cart to confirmation
 *
 * Test Coverage:
 * - Guest checkout
 * - Registered user checkout
 * - Payment processing
 * - Order confirmation
 *
 * Prerequisites:
 * - Test products must exist in database
 * - Payment gateway must be in test mode
 *
 * @see {@link https://docs.example.com/testing/checkout} for test plan
 */

test.describe('Checkout Flow', () => {
  /**
   * Test: Complete checkout as guest user
   *
   * @description Verifies that users can complete purchase without account
   *
   * Steps:
   * 1. Add product to cart
   * 2. Proceed to checkout
   * 3. Enter shipping details
   * 4. Complete payment
   * 5. Verify confirmation
   *
   * Expected: Order confirmation displayed with order number
   */
  test('guest user can complete checkout', async ({ page }) => {
    // Step 1: Add product to cart
    await page.goto('/products/1');
    await page.click('[data-testid="add-to-cart"]');

    // Step 2: Proceed to checkout
    await page.goto('/cart');
    await page.click('[data-testid="checkout-button"]');

    // Step 3: Enter shipping details
    await page.fill('[data-testid="email"]', 'guest@example.com');
    await page.fill('[data-testid="address"]', '123 Test St');

    // Step 4: Complete payment
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.click('[data-testid="pay-button"]');

    // Step 5: Verify confirmation
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });
});

/**
 * Test data documentation
 *
 * @description Test data used across checkout tests
 */
const testData = {
  /** Valid test credit card (Stripe test card) */
  validCard: '4111111111111111',
  /** Card that triggers decline */
  declinedCard: '4000000000000002',
  /** Card that requires 3D Secure */
  threeDSecureCard: '4000000000003220',
};

/**
 * EXERCISE:
 * 1. Select a function and use Copilot's /doc command
 * 2. Generate README documentation for your test suite
 * 3. Add inline comments to complex test logic
 *
 * LEARNING:
 * - Good documentation helps team collaboration
 * - JSDoc enables IDE intellisense
 * - Document test prerequisites and data
 * - Keep documentation close to code
 *
 * ONE LINER:
 * "Document once with Copilot, benefit forever with maintainable tests."
 */

export { AuthHelper, testData };

