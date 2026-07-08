/**
 * Lab 918: Copilot Test Generation
 *
 * CONCEPT:
 * GitHub Copilot can generate complete test suites from comments, function
 * signatures, or existing code patterns. This dramatically speeds up test
 * creation while maintaining consistency with your testing standards.
 *
 * BULLET POINTS:
 * - Generate tests from descriptive comments
 * - Create test suites from user stories
 * - Auto-generate edge cases and negative tests
 * - Maintain consistent test structure
 * - Generate data-driven tests automatically
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Generate test suite from feature description
// Comment: "Test suite for shopping cart functionality"

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login as test user
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
  });

  test('should add item to empty cart', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should increase quantity of existing item', async ({ page }) => {
    await page.goto('/cart');
    await page.click('[data-testid="increase-qty"]');
    await expect(page.locator('[data-testid="item-qty"]')).toHaveValue('2');
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart');
    await page.click('[data-testid="remove-item"]');
    await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
  });

  test('should apply valid coupon code', async ({ page }) => {
    await page.goto('/cart');
    await page.fill('[data-testid="coupon-input"]', 'SAVE10');
    await page.click('[data-testid="apply-coupon"]');
    await expect(page.locator('[data-testid="discount"]')).toContainText('10%');
  });

  test('should show error for invalid coupon', async ({ page }) => {
    await page.goto('/cart');
    await page.fill('[data-testid="coupon-input"]', 'INVALID');
    await page.click('[data-testid="apply-coupon"]');
    await expect(page.locator('[data-testid="coupon-error"]')).toBeVisible();
  });
});

// Example 2: Generate negative tests from positive test
// Comment: "Generate negative test cases for login"

test.describe('Login - Negative Cases', () => {
  test('should show error for empty email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email is required');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email');
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
  });
});

// Example 3: Generate data-driven tests
const searchTestCases = [
  { query: 'laptop', expectedResults: 10 },
  { query: 'phone', expectedResults: 15 },
  { query: 'nonexistent', expectedResults: 0 },
  { query: '', expectedResults: 0 },
];

test.describe('Search Functionality', () => {
  for (const { query, expectedResults } of searchTestCases) {
    test(`search for "${query}" returns ${expectedResults} results`, async ({ page }) => {
      await page.goto('/search');
      await page.fill('[data-testid="search-input"]', query);
      await page.click('[data-testid="search-button"]');

      if (expectedResults === 0) {
        await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
      } else {
        await expect(page.locator('[data-testid="result-item"]')).toHaveCount(expectedResults);
      }
    });
  }
});

/**
 * EXERCISE:
 * 1. Write a comment describing a checkout flow
 * 2. Let Copilot generate the test suite
 * 3. Add edge cases that Copilot might have missed
 */

/**
 * LEARNING:
 * - Descriptive comments generate better tests
 * - Copilot learns from existing test patterns
 * - Always review generated tests for completeness
 * - Add edge cases manually if needed
 * - Use data-driven approach for similar tests
 *
 * ONE LINER:
 * "Copilot generates the test skeleton - you add the domain expertise."
 */

