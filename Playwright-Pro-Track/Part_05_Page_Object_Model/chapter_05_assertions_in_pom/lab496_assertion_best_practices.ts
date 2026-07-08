/**
 * Lab 496: Assertion Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for assertions in POM:
 *
 * - Assertion placement
 * - Meaningful messages
 * - Assertion granularity
 * - Performance considerations
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply assertion best practices
 * 2. Write meaningful assertions
 * 3. Optimize assertion performance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Assertion Placement
class AssertionPlacementPage {
    readonly page: Page;
    readonly form: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
        this.submitButton = page.locator('#submit');
        this.successMessage = page.locator('.success');
    }

    // GOOD: Assertions in dedicated methods
    async assertFormSubmitted() {
        await expect(this.successMessage).toBeVisible();
    }

    // GOOD: Precondition assertions
    async assertFormReady() {
        await expect(this.form).toBeVisible();
        await expect(this.submitButton).toBeEnabled();
    }

    // BAD: Assertions mixed with actions
    // async submitForm() {
    //     await expect(this.form).toBeVisible(); // Don't mix
    //     await this.submitButton.click();
    // }
}

// Solution 2: Meaningful Assertions
class MeaningfulAssertionsPage {
    readonly page: Page;
    readonly userGreeting: Locator;
    readonly cartCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userGreeting = page.locator('.greeting');
        this.cartCount = page.locator('.cart-count');
    }

    // GOOD: Descriptive assertion methods
    async assertUserLoggedInAs(username: string) {
        await expect(this.userGreeting).toContainText(`Welcome, ${username}`);
    }

    async assertCartHasItems(count: number) {
        await expect(this.cartCount).toHaveText(String(count));
    }

    // BAD: Generic assertion
    // async assertText(text: string) {
    //     await expect(this.userGreeting).toHaveText(text);
    // }
}

// Solution 3: Assertion Granularity
class AssertionGranularityPage {
    readonly page: Page;
    readonly product: Locator;

    constructor(page: Page) {
        this.page = page;
        this.product = page.locator('.product');
    }

    // GOOD: Focused assertions
    async assertProductName(name: string) {
        await expect(this.product.locator('.name')).toHaveText(name);
    }

    async assertProductPrice(price: string) {
        await expect(this.product.locator('.price')).toHaveText(price);
    }

    // GOOD: Composite assertion when needed
    async assertProductDetails(name: string, price: string) {
        await this.assertProductName(name);
        await this.assertProductPrice(price);
    }
}

// Solution 4: Performance Optimized Assertions
class PerformanceAssertionsPage {
    readonly page: Page;
    readonly elements: Locator;

    constructor(page: Page) {
        this.page = page;
        this.elements = page.locator('.element');
    }

    // GOOD: Use appropriate timeouts
    async assertQuickElement() {
        await expect(this.elements.first()).toBeVisible({ timeout: 2000 });
    }

    // GOOD: Batch assertions when possible
    async assertAllElementsVisible() {
        const count = await this.elements.count();
        // Use Promise.all for parallel assertions
        await Promise.all(
            Array.from({ length: count }, (_, i) =>
                expect(this.elements.nth(i)).toBeVisible()
            )
        );
    }
}

// Solution 5: Assertion Error Messages
class ErrorMessageAssertionsPage {
    readonly page: Page;
    readonly status: Locator;

    constructor(page: Page) {
        this.page = page;
        this.status = page.locator('.status');
    }

    // GOOD: Custom error context
    async assertStatus(expected: string, context: string) {
        const actual = await this.status.textContent();
        expect(actual, `${context}: Expected status "${expected}" but got "${actual}"`).toBe(expected);
    }
}

// Solution 6: Best Practices Summary
/*
 * Assertion Best Practices:
 *
 * DO:
 * - Use dedicated assertion methods
 * - Write descriptive method names
 * - Use appropriate timeouts
 * - Keep assertions focused
 * - Add context to errors
 *
 * DON'T:
 * - Mix assertions with actions
 * - Use generic assertion methods
 * - Use excessive timeouts
 * - Assert too many things at once
 * - Ignore assertion failures
 */

// Solution 7: Export
export {
    AssertionPlacementPage,
    MeaningfulAssertionsPage,
    AssertionGranularityPage,
    PerformanceAssertionsPage,
    ErrorMessageAssertionsPage,
};
