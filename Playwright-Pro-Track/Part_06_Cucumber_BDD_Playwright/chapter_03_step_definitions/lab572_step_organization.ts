/**
 * Lab 572: Step Organization
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing step definitions:
 * 
 * - File structure
 * - Grouping steps
 * - Shared steps
 * - Naming conventions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Organize step files
 * 2. Group related steps
 * 3. Share common steps
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Recommended File Structure
/*
 * features/
 * ├── step_definitions/
 * │   ├── common/
 * │   │   ├── navigation.steps.ts
 * │   │   ├── form.steps.ts
 * │   │   └── assertion.steps.ts
 * │   ├── auth/
 * │   │   ├── login.steps.ts
 * │   │   └── register.steps.ts
 * │   ├── products/
 * │   │   ├── search.steps.ts
 * │   │   └── cart.steps.ts
 * │   └── checkout/
 * │       ├── shipping.steps.ts
 * │       └── payment.steps.ts
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 2: Common Navigation Steps (navigation.steps.ts)
// These steps are used across multiple features

Given('I am on the {word} page', async function (pageName: string) {
    const routes: Record<string, string> = {
        home: '/',
        login: '/login',
        register: '/register',
        products: '/products',
        cart: '/cart',
    };
    await this.page.goto(routes[pageName] || `/${pageName}`);
});

When('I go back', async function () {
    await this.page.goBack();
});

When('I refresh the page', async function () {
    await this.page.reload();
});

// Solution 3: Common Form Steps (form.steps.ts)
When('I enter {string} in the {string} field', async function (value: string, field: string) {
    await this.page.fill(`[name="${field}"], #${field}`, value);
});

When('I submit the form', async function () {
    await this.page.click('button[type="submit"]');
});

When('I clear all form fields', async function () {
    const inputs = this.page.locator('input:not([type="hidden"])');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
        await inputs.nth(i).fill('');
    }
});

// Solution 4: Common Assertion Steps (assertion.steps.ts)
Then('I should see text {string}', async function (text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
});

Then('the page title should contain {string}', async function (text: string) {
    await expect(this.page).toHaveTitle(new RegExp(text));
});

Then('the URL should be {string}', async function (url: string) {
    await expect(this.page).toHaveURL(url);
});

// Solution 5: Feature-Specific Steps (login.steps.ts)
// These steps are specific to login feature

Given('I have valid login credentials', async function () {
    this.credentials = {
        username: 'testuser@example.com',
        password: 'TestPass123!',
    };
});

When('I login with my credentials', async function () {
    await this.page.fill('#username', this.credentials.username);
    await this.page.fill('#password', this.credentials.password);
    await this.page.click('#login-btn');
});

Then('I should be logged in successfully', async function () {
    await expect(this.page.locator('.user-menu')).toBeVisible();
    await expect(this.page).toHaveURL(/dashboard/);
});

// Solution 6: Feature-Specific Steps (cart.steps.ts)
Given('I have {int} items in my cart', async function (count: number) {
    // Setup cart state
    this.cartItemCount = count;
});

When('I add product {string} to cart', async function (productName: string) {
    await this.page.click(`[data-product="${productName}"] .add-to-cart`);
});

Then('my cart should have {int} items', async function (count: number) {
    await expect(this.page.locator('.cart-count')).toHaveText(String(count));
});

// Solution 7: Step Definition Index (index.ts)
/*
 * // step_definitions/index.ts
 * // Import all step definition files
 * 
 * import './common/navigation.steps';
 * import './common/form.steps';
 * import './common/assertion.steps';
 * import './auth/login.steps';
 * import './auth/register.steps';
 * import './products/search.steps';
 * import './products/cart.steps';
 * import './checkout/shipping.steps';
 * import './checkout/payment.steps';
 */

// Solution 8: Naming Conventions
/*
 * Step Definition Naming:
 * 
 * Files:
 * - Use kebab-case: login.steps.ts, user-profile.steps.ts
 * - Group by feature: auth/, products/, checkout/
 * 
 * Steps:
 * - Given: Setup state (I am, I have, there is)
 * - When: Actions (I click, I enter, I submit)
 * - Then: Assertions (I should see, should be, should have)
 * 
 * Parameters:
 * - Use descriptive names: {username}, {productName}
 * - Use built-in types: {int}, {string}, {float}
 */

// Solution 9: Export
export {};

