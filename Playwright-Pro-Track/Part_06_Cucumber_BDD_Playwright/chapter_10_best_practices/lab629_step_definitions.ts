/**
 * Lab 629: Step Definition Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Writing maintainable step definitions:
 * 
 * - Reusable steps
 * - Parameterization
 * - Avoid duplication
 * - Clear naming
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create reusable steps
 * 2. Use parameters effectively
 * 3. Organize step files
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/*
 * Best Practice 1: Use Generic, Reusable Steps
 * 
 * BAD:
 * When('I click the login button', ...)
 * When('I click the submit button', ...)
 * When('I click the save button', ...)
 * 
 * GOOD:
 */
When('I click the {string} button', async function (buttonText: string) {
    await this.page.getByRole('button', { name: buttonText }).click();
});

When('I click on {string}', async function (text: string) {
    await this.page.getByText(text).click();
});

/*
 * Best Practice 2: Use Cucumber Expressions with Types
 */
Given('I am on the {word} page', async function (pageName: string) {
    const routes: Record<string, string> = {
        login: '/login',
        home: '/',
        dashboard: '/dashboard',
        settings: '/settings',
    };
    
    const path = routes[pageName] || `/${pageName}`;
    await this.page.goto(path);
});

/*
 * Best Practice 3: Handle Multiple Input Formats
 */
When('I fill in {string} with {string}', async function (field: string, value: string) {
    // Support multiple selector formats
    const selectors = [
        `[name="${field}"]`,
        `#${field}`,
        `[data-testid="${field}"]`,
        `[placeholder="${field}"]`,
    ];
    
    for (const selector of selectors) {
        const element = this.page.locator(selector);
        if (await element.count() > 0) {
            await element.fill(value);
            return;
        }
    }
    
    // Fallback to label
    await this.page.getByLabel(field).fill(value);
});

/*
 * Best Practice 4: Use Data Tables for Multiple Fields
 */
When('I fill in the form with:', async function (dataTable: DataTable) {
    const data = dataTable.rowsHash();
    
    for (const [field, value] of Object.entries(data)) {
        await this.page.getByLabel(field).fill(value);
    }
});

/*
 * Best Practice 5: Create Domain-Specific Steps
 */
Given('I am logged in as {word}', async function (userType: string) {
    const users: Record<string, { email: string; password: string }> = {
        admin: { email: 'admin@test.com', password: 'admin123' },
        user: { email: 'user@test.com', password: 'user123' },
        guest: { email: 'guest@test.com', password: 'guest123' },
    };
    
    const user = users[userType];
    if (!user) throw new Error(`Unknown user type: ${userType}`);
    
    await this.page.goto('/login');
    await this.page.fill('#email', user.email);
    await this.page.fill('#password', user.password);
    await this.page.click('#login-btn');
    await this.page.waitForURL('**/dashboard');
});

/*
 * Best Practice 6: Flexible Assertions
 */
Then('I should see {string}', async function (text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
});

Then('I should not see {string}', async function (text: string) {
    await expect(this.page.getByText(text)).not.toBeVisible();
});

Then('the {string} should be {string}', async function (element: string, state: string) {
    const locator = this.page.locator(`[data-testid="${element}"]`);
    
    switch (state) {
        case 'visible':
            await expect(locator).toBeVisible();
            break;
        case 'hidden':
            await expect(locator).toBeHidden();
            break;
        case 'enabled':
            await expect(locator).toBeEnabled();
            break;
        case 'disabled':
            await expect(locator).toBeDisabled();
            break;
        default:
            throw new Error(`Unknown state: ${state}`);
    }
});

/*
 * Best Practice 7: Store and Reuse Values
 */
When('I remember the {string} as {string}', async function (selector: string, key: string) {
    const value = await this.page.locator(selector).textContent();
    this.storedValues = this.storedValues || {};
    this.storedValues[key] = value;
});

Then('the {string} should match the stored {string}', async function (selector: string, key: string) {
    const actual = await this.page.locator(selector).textContent();
    const expected = this.storedValues[key];
    expect(actual).toBe(expected);
});

/*
 * Best Practice 8: Wait for Conditions
 */
When('I wait for the page to load', async function () {
    await this.page.waitForLoadState('networkidle');
});

When('I wait for {string} to appear', async function (selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
});

/*
 * Best Practice 9: Handle Async Operations
 */
When('I wait for the API response', async function () {
    await this.page.waitForResponse(response => 
        response.url().includes('/api/') && response.status() === 200
    );
});

/*
 * Best Practice 10: Document Complex Steps
 */
/**
 * Completes the checkout process with the given payment method.
 * This step handles the entire checkout flow including:
 * - Reviewing cart
 * - Entering shipping info
 * - Selecting payment method
 * - Confirming order
 */
When('I complete checkout with {string} payment', async function (paymentMethod: string) {
    // Review cart
    await this.page.click('[data-testid="checkout-btn"]');
    
    // Shipping (assuming pre-filled)
    await this.page.click('[data-testid="continue-shipping"]');
    
    // Payment
    await this.page.click(`[data-testid="payment-${paymentMethod}"]`);
    await this.page.click('[data-testid="continue-payment"]');
    
    // Confirm
    await this.page.click('[data-testid="place-order"]');
    await this.page.waitForURL('**/order-confirmation');
});

// Export
export {};

