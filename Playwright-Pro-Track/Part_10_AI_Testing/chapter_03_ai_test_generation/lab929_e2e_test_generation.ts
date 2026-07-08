/**
 * Lab 929: AI E2E Test Generation
 *
 * CONCEPT:
 * AI can generate complete end-to-end test scenarios that cover user journeys
 * from start to finish. These tests validate that all components work together
 * correctly in real-world usage patterns.
 *
 * BULLET POINTS:
 * - Generate complete user journey tests
 * - Cover critical business flows
 * - Include setup and teardown
 * - Handle multi-step processes
 * - Test cross-feature interactions
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: AI-generated E2E test for e-commerce checkout
test.describe('E-Commerce Checkout Journey', () => {
  test('complete purchase as new user', async ({ page }) => {
    // Step 1: Browse products
    await page.goto('/');
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();

    // Step 2: Search for product
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.click('[data-testid="search-button"]');
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

    // Step 3: Select product
    await page.click('[data-testid="product-card"]:first-child');
    await expect(page.locator('[data-testid="product-details"]')).toBeVisible();

    // Step 4: Add to cart
    await page.selectOption('[data-testid="quantity"]', '2');
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-notification"]')).toBeVisible();

    // Step 5: View cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-items"]')).toHaveCount(1);

    // Step 6: Proceed to checkout
    await page.click('[data-testid="checkout-button"]');

    // Step 7: Register as new user
    await page.click('[data-testid="register-link"]');
    await page.fill('[data-testid="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');
    await page.click('[data-testid="register-button"]');

    // Step 8: Fill shipping details
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="address"]', '123 Test Street');
    await page.fill('[data-testid="city"]', 'Test City');
    await page.fill('[data-testid="zip"]', '12345');
    await page.click('[data-testid="continue-to-payment"]');

    // Step 9: Enter payment details
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="expiry"]', '12/25');
    await page.fill('[data-testid="cvv"]', '123');
    await page.click('[data-testid="place-order"]');

    // Step 10: Verify order confirmation
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });
});

// Example 2: AI-generated user journey with Page Objects
class HomePage {
  constructor(private page: Page) {}
  async searchProduct(query: string) {
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.click('[data-testid="search-button"]');
  }
}

class ProductPage {
  constructor(private page: Page) {}
  async addToCart(quantity: number = 1) {
    await this.page.selectOption('[data-testid="quantity"]', quantity.toString());
    await this.page.click('[data-testid="add-to-cart"]');
  }
}

class CheckoutPage {
  constructor(private page: Page) {}
  async fillShipping(details: Record<string, string>) {
    for (const [field, value] of Object.entries(details)) {
      await this.page.fill(`[data-testid="${field}"]`, value);
    }
  }
  async fillPayment(card: { number: string; expiry: string; cvv: string }) {
    await this.page.fill('[data-testid="card-number"]', card.number);
    await this.page.fill('[data-testid="expiry"]', card.expiry);
    await this.page.fill('[data-testid="cvv"]', card.cvv);
  }
  async placeOrder() {
    await this.page.click('[data-testid="place-order"]');
  }
}

// Example 3: E2E test with Page Objects
test('checkout with page objects', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  await page.goto('/');
  await homePage.searchProduct('laptop');
  await page.click('[data-testid="product-card"]:first-child');
  await productPage.addToCart(1);
  await page.goto('/checkout');
  await checkoutPage.fillShipping({
    'first-name': 'John',
    'last-name': 'Doe',
    address: '123 Test St',
    city: 'Test City',
    zip: '12345',
  });
  await checkoutPage.fillPayment({
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
  });
  await checkoutPage.placeOrder();
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
});

/**
 * EXERCISE:
 * 1. Identify a critical user journey in your app
 * 2. Use AI to generate the E2E test
 * 3. Refactor to use Page Objects
 * 4. Add error handling scenarios
 *
 * LEARNING:
 * - E2E tests validate complete user journeys
 * - Use Page Objects for maintainability
 * - Cover happy path and error scenarios
 * - Include setup and cleanup
 *
 * ONE LINER:
 * "AI maps user journeys to test code - ensuring your critical flows always work."
 */

export { HomePage, ProductPage, CheckoutPage };

