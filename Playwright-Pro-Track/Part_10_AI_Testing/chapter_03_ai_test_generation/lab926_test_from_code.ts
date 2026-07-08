/**
 * Lab 926: AI Test Generation from Source Code
 *
 * CONCEPT:
 * AI can analyze source code and generate corresponding tests. This is useful
 * for adding tests to existing code, ensuring coverage, and understanding
 * code behavior through test documentation.
 *
 * BULLET POINTS:
 * - Generate unit tests from functions
 * - Create integration tests from API endpoints
 * - Analyze code paths for coverage
 * - Identify testable scenarios from code
 * - Generate mocks and stubs automatically
 */

import { test, expect } from '@playwright/test';

// Example 1: Source code to analyze
class ShoppingCart {
  private items: Map<string, { quantity: number; price: number }> = new Map();
  private discount: number = 0;

  addItem(productId: string, price: number, quantity: number = 1): void {
    const existing = this.items.get(productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(productId, { quantity, price });
    }
  }

  removeItem(productId: string): boolean {
    return this.items.delete(productId);
  }

  updateQuantity(productId: string, quantity: number): boolean {
    const item = this.items.get(productId);
    if (!item) return false;
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return true;
  }

  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Invalid discount percentage');
    }
    this.discount = percentage;
  }

  getTotal(): number {
    let total = 0;
    this.items.forEach(({ quantity, price }) => {
      total += quantity * price;
    });
    return total * (1 - this.discount / 100);
  }

  getItemCount(): number {
    let count = 0;
    this.items.forEach(({ quantity }) => {
      count += quantity;
    });
    return count;
  }
}

// AI-Generated Tests from Code Analysis:
test.describe('ShoppingCart - AI Generated Tests', () => {
  let cart: ShoppingCart;

  test.beforeEach(() => {
    cart = new ShoppingCart();
  });

  // Tests for addItem method
  test.describe('addItem', () => {
    test('should add new item to empty cart', () => {
      cart.addItem('prod-1', 10.99, 1);
      expect(cart.getItemCount()).toBe(1);
      expect(cart.getTotal()).toBe(10.99);
    });

    test('should increase quantity for existing item', () => {
      cart.addItem('prod-1', 10.99, 1);
      cart.addItem('prod-1', 10.99, 2);
      expect(cart.getItemCount()).toBe(3);
    });

    test('should handle multiple different items', () => {
      cart.addItem('prod-1', 10.0, 1);
      cart.addItem('prod-2', 20.0, 2);
      expect(cart.getItemCount()).toBe(3);
      expect(cart.getTotal()).toBe(50.0);
    });
  });

  // Tests for removeItem method
  test.describe('removeItem', () => {
    test('should remove existing item', () => {
      cart.addItem('prod-1', 10.99, 1);
      const result = cart.removeItem('prod-1');
      expect(result).toBe(true);
      expect(cart.getItemCount()).toBe(0);
    });

    test('should return false for non-existent item', () => {
      const result = cart.removeItem('non-existent');
      expect(result).toBe(false);
    });
  });

  // Tests for updateQuantity method
  test.describe('updateQuantity', () => {
    test('should update quantity of existing item', () => {
      cart.addItem('prod-1', 10.0, 1);
      const result = cart.updateQuantity('prod-1', 5);
      expect(result).toBe(true);
      expect(cart.getItemCount()).toBe(5);
    });

    test('should remove item when quantity is zero', () => {
      cart.addItem('prod-1', 10.0, 1);
      cart.updateQuantity('prod-1', 0);
      expect(cart.getItemCount()).toBe(0);
    });

    test('should return false for non-existent item', () => {
      const result = cart.updateQuantity('non-existent', 5);
      expect(result).toBe(false);
    });
  });

  // Tests for applyDiscount method
  test.describe('applyDiscount', () => {
    test('should apply valid discount', () => {
      cart.addItem('prod-1', 100.0, 1);
      cart.applyDiscount(10);
      expect(cart.getTotal()).toBe(90.0);
    });

    test('should throw error for negative discount', () => {
      expect(() => cart.applyDiscount(-10)).toThrow('Invalid discount percentage');
    });

    test('should throw error for discount over 100', () => {
      expect(() => cart.applyDiscount(150)).toThrow('Invalid discount percentage');
    });
  });

  // Tests for getTotal method
  test.describe('getTotal', () => {
    test('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });

    test('should calculate total correctly', () => {
      cart.addItem('prod-1', 10.0, 2);
      cart.addItem('prod-2', 5.0, 3);
      expect(cart.getTotal()).toBe(35.0);
    });
  });
});

/**
 * EXERCISE:
 * 1. Take a class from your codebase
 * 2. Ask AI to generate comprehensive tests
 * 3. Review for missing edge cases
 * 4. Add integration tests if needed
 *
 * LEARNING:
 * - AI analyzes code structure for test generation
 * - Generated tests cover happy paths and error cases
 * - Review for domain-specific scenarios
 * - Use as starting point, not final tests
 *
 * ONE LINER:
 * "AI reads your code and writes tests - you verify they test what matters."
 */

export { ShoppingCart };

