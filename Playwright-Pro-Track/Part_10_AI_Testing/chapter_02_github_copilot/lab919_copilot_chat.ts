/**
 * Lab 919: Copilot Chat for Testing
 *
 * CONCEPT:
 * Copilot Chat is an interactive AI assistant integrated into your IDE. Unlike
 * inline suggestions, Chat allows you to have conversations about code, ask
 * questions, request explanations, and get help with debugging.
 *
 * BULLET POINTS:
 * - Open with Ctrl+Shift+I (VS Code)
 * - Ask questions about code in natural language
 * - Request code generation with /generate
 * - Get explanations with /explain
 * - Fix issues with /fix
 * - Generate tests with /tests
 * - Use @workspace for project-wide context
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Using /explain command
// Select this code and ask Copilot Chat: "/explain"

async function retryOnFailure<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Example 2: Using /fix command
// This test has issues - select and use "/fix"

test('flaky test that needs fixing', async ({ page }) => {
  await page.goto('/dashboard');
  // Fixed: Added proper wait instead of hardcoded timeout
  await page.waitForSelector('[data-testid="dashboard-loaded"]');
  await expect(page.locator('[data-testid="user-stats"]')).toBeVisible();
});

// Example 3: Using /tests command
// Select this function and use "/tests" to generate tests

class CartService {
  private items: Map<string, number> = new Map();

  addItem(productId: string, quantity: number = 1): void {
    const current = this.items.get(productId) || 0;
    this.items.set(productId, current + quantity);
  }

  removeItem(productId: string): boolean {
    return this.items.delete(productId);
  }

  getTotal(): number {
    let total = 0;
    this.items.forEach((qty) => (total += qty));
    return total;
  }

  clear(): void {
    this.items.clear();
  }
}

// Copilot Chat generated tests for CartService:
test.describe('CartService', () => {
  let cart: CartService;

  test.beforeEach(() => {
    cart = new CartService();
  });

  test('should add item to cart', () => {
    cart.addItem('product-1');
    expect(cart.getTotal()).toBe(1);
  });

  test('should add multiple quantities', () => {
    cart.addItem('product-1', 3);
    expect(cart.getTotal()).toBe(3);
  });

  test('should remove item from cart', () => {
    cart.addItem('product-1');
    const removed = cart.removeItem('product-1');
    expect(removed).toBe(true);
    expect(cart.getTotal()).toBe(0);
  });

  test('should return false when removing non-existent item', () => {
    const removed = cart.removeItem('non-existent');
    expect(removed).toBe(false);
  });

  test('should clear all items', () => {
    cart.addItem('product-1', 2);
    cart.addItem('product-2', 3);
    cart.clear();
    expect(cart.getTotal()).toBe(0);
  });
});

/**
 * EXERCISE:
 * 1. Open Copilot Chat (Ctrl+Shift+I)
 * 2. Ask: "How do I test file uploads in Playwright?"
 * 3. Ask: "@workspace What testing patterns are used in this project?"
 * 4. Select a complex function and use /explain
 */

// Example 4: Chat prompts for common QA tasks
const copilotChatPrompts = {
  debugging: 'Why is this test flaky? How can I fix it?',
  generation: '/generate a test for user authentication with MFA',
  explanation: '/explain what this locator strategy does',
  optimization: 'How can I make this test run faster?',
  bestPractices: 'Is this test following Playwright best practices?',
  coverage: '@workspace What test coverage is missing for the auth module?',
};

/**
 * LEARNING:
 * - Use /commands for specific actions
 * - @workspace provides project-wide context
 * - Chat is great for learning and debugging
 * - Combine Chat with inline suggestions
 * - Ask follow-up questions for clarity
 *
 * ONE LINER:
 * "Copilot Chat is your AI QA mentor - ask questions, get answers, learn faster."
 */

export { retryOnFailure, CartService, copilotChatPrompts };

