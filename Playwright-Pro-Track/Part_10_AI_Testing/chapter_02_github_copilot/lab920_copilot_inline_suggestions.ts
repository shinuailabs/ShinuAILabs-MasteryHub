/**
 * Lab 920: Copilot Inline Suggestions Mastery
 *
 * CONCEPT:
 * Inline suggestions are Copilot's real-time code completions that appear as
 * ghost text while you type. Mastering inline suggestions means knowing when
 * to accept, reject, or modify them for maximum productivity.
 *
 * BULLET POINTS:
 * - Ghost text appears in gray as you type
 * - Tab accepts the full suggestion
 * - Ctrl+Right accepts word by word
 * - Alt+] cycles to next suggestion
 * - Esc dismisses the suggestion
 * - Better context = better suggestions
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Accepting partial suggestions
// Type "async function login" and accept word by word with Ctrl+Right

async function loginUser(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', email);
  await page.fill('[data-testid="password"]', password);
  await page.click('[data-testid="submit"]');
  await page.waitForURL('/dashboard');
}

// Example 2: Cycling through suggestions
// Type "test('should" and use Alt+] to see alternatives:
// - "test('should login successfully'..."
// - "test('should display error message'..."
// - "test('should redirect to dashboard'..."

test('should login successfully with valid credentials', async ({ page }) => {
  await loginUser(page, 'user@example.com', 'password123');
  await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
});

// Example 3: Context-aware suggestions
// Copilot uses surrounding code for better suggestions

class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Copilot suggests locators based on property names:
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
    this.quantityInput = page.locator('[data-testid="quantity"]');
  }

  // Type "async add" and Copilot suggests based on class context:
  async addToCart(quantity: number = 1): Promise<void> {
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
  }

  // Type "async get" and Copilot suggests getters:
  async getPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async getTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }
}

// Example 4: Multi-line suggestions
// Type a comment and let Copilot generate multiple lines:

// Verify all product details are displayed correctly
test('product page displays all details', async ({ page }) => {
  const productPage = new ProductPage(page);
  await page.goto('/products/123');

  await expect(productPage.productTitle).toBeVisible();
  await expect(productPage.productPrice).toBeVisible();
  await expect(productPage.addToCartButton).toBeEnabled();
  await expect(productPage.quantityInput).toHaveValue('1');
});

/**
 * EXERCISE:
 * 1. Create a new Page Object class
 * 2. Type property names and let Copilot suggest locators
 * 3. Type method signatures and accept suggestions
 * 4. Practice partial acceptance with Ctrl+Right
 */

// Exercise: Complete this Page Object with Copilot
class CheckoutPage {
  readonly page: Page;
  readonly shippingForm: Locator;
  readonly paymentForm: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingForm = page.locator('[data-testid="shipping-form"]');
    this.paymentForm = page.locator('[data-testid="payment-form"]');
    this.placeOrderButton = page.locator('[data-testid="place-order"]');
    this.orderConfirmation = page.locator('[data-testid="order-confirmation"]');
  }

  async fillShippingDetails(address: Record<string, string>): Promise<void> {
    await this.page.fill('[data-testid="street"]', address.street);
    await this.page.fill('[data-testid="city"]', address.city);
    await this.page.fill('[data-testid="zip"]', address.zip);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderConfirmation.waitFor({ state: 'visible' });
  }
}

/**
 * LEARNING:
 * - Use descriptive names for better suggestions
 * - Accept partially when suggestion is close but not perfect
 * - Cycle through alternatives for different approaches
 * - Context from imports and types improves accuracy
 * - Dismiss and retype if suggestions are off-track
 *
 * ONE LINER:
 * "Master Tab, Ctrl+Right, and Alt+] - these three shortcuts unlock Copilot's full potential."
 */

export { loginUser, ProductPage, CheckoutPage };

