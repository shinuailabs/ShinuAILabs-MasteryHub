/**
 * Lab 594: Scenario Outline Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing steps for outlines:
 * 
 * - Parameter handling
 * - Type conversion
 * - Dynamic assertions
 * - Reusable steps
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle outline parameters
 * 2. Convert types
 * 3. Create dynamic assertions
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Basic Parameter Steps
When('I enter username {string}', async function (username: string) {
    if (username) {
        await this.page.fill('#username', username);
    }
});

When('I enter password {string}', async function (password: string) {
    if (password) {
        await this.page.fill('#password', password);
    }
});

Then('I should see {string}', async function (expectedText: string) {
    await expect(this.page.locator(`text=${expectedText}`)).toBeVisible();
});

// Solution 2: Numeric Parameter Steps
When('I add {int} of {string} at ${float} each', async function (
    quantity: number,
    product: string,
    price: number
) {
    this.cartItem = { product, quantity, price };
    
    await this.page.fill('#product-search', product);
    await this.page.click('.search-result:first-child');
    await this.page.fill('#quantity', String(quantity));
    await this.page.click('#add-to-cart');
});

Then('the subtotal should be ${float}', async function (expected: number) {
    const subtotal = this.cartItem.quantity * this.cartItem.price;
    expect(subtotal).toBeCloseTo(expected, 2);
});

Then('with {int}% tax, the total should be ${float}', async function (
    taxRate: number,
    expectedTotal: number
) {
    const subtotal = this.cartItem.quantity * this.cartItem.price;
    const total = subtotal * (1 + taxRate / 100);
    expect(total).toBeCloseTo(expectedTotal, 2);
});

// Solution 3: Role-Based Steps
Given('I am logged in as {string}', async function (role: string) {
    const credentials: Record<string, { email: string; password: string }> = {
        admin: { email: 'admin@test.com', password: 'admin123' },
        editor: { email: 'editor@test.com', password: 'editor123' },
        viewer: { email: 'viewer@test.com', password: 'viewer123' },
    };
    
    const creds = credentials[role];
    if (!creds) {
        throw new Error(`Unknown role: ${role}`);
    }
    
    this.currentRole = role;
    await this.page.goto('/login');
    await this.page.fill('#email', creds.email);
    await this.page.fill('#password', creds.password);
    await this.page.click('#login');
});

When('I navigate to {string}', async function (path: string) {
    await this.page.goto(path);
});

Then('I should see access {string}', async function (access: string) {
    if (access === 'granted') {
        await expect(this.page.locator('.access-denied')).toBeHidden();
    } else {
        await expect(this.page.locator('.access-denied')).toBeVisible();
    }
});

// Solution 4: Status Transition Steps
Given('an order with status {string}', async function (status: string) {
    this.order = {
        id: `ORD-${Date.now()}`,
        status: status,
    };
});

When('I perform action {string}', async function (action: string) {
    const transitions: Record<string, Record<string, string>> = {
        pending: { confirm: 'confirmed', cancel: 'cancelled' },
        confirmed: { ship: 'shipped', cancel: 'cancelled' },
        shipped: { deliver: 'delivered' },
    };
    
    const newStatus = transitions[this.order.status]?.[action];
    if (newStatus) {
        this.order.status = newStatus;
    } else {
        throw new Error(`Invalid transition: ${this.order.status} -> ${action}`);
    }
});

Then('the order status should be {string}', async function (expectedStatus: string) {
    expect(this.order.status).toBe(expectedStatus);
});

// Solution 5: Search Steps with Count
When('I search for {string} in {string}', async function (query: string, category: string) {
    await this.page.selectOption('#category', category);
    await this.page.fill('#search', query);
    await this.page.click('#search-btn');
    await this.page.waitForSelector('.search-results');
});

Then('I should see {int} results', async function (count: number) {
    await expect(this.page.locator('.search-result')).toHaveCount(count);
});

Then('results should be sorted by {string}', async function (sortBy: string) {
    const selectedSort = await this.page.locator('#sort-select').inputValue();
    expect(selectedSort).toBe(sortBy);
});

// Solution 6: Feature Flag Steps
Given('feature {string} is {word}', async function (feature: string, state: string) {
    this.featureFlags = this.featureFlags || {};
    this.featureFlags[feature] = state === 'enabled';
});

When('I access the feature', async function () {
    // Feature access is checked in the Then step
});

Then('I should {word} the feature', async function (visibility: string) {
    const shouldSee = visibility === 'see';
    // Check based on feature flag state
    for (const [feature, enabled] of Object.entries(this.featureFlags || {})) {
        if (shouldSee && enabled) {
            await expect(this.page.locator(`[data-feature="${feature}"]`)).toBeVisible();
        } else if (!shouldSee && !enabled) {
            await expect(this.page.locator(`[data-feature="${feature}"]`)).toBeHidden();
        }
    }
});

// Solution 7: Export
export {};

