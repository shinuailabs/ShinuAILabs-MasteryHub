/**
 * Lab 573: Step Definition Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for step definitions:
 * 
 * - Keep steps simple
 * - Avoid duplication
 * - Use page objects
 * - Handle errors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Refactor steps
 * 3. Improve maintainability
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Keep Steps Simple and Focused
// BAD: Step does too much
When('I login and navigate to products and add item to cart', async function () {
    // Too many actions in one step!
});

// GOOD: Single responsibility
When('I login with valid credentials', async function () {
    await this.loginPage.login(this.credentials.username, this.credentials.password);
});

When('I navigate to products page', async function () {
    await this.page.goto('/products');
});

When('I add first item to cart', async function () {
    await this.page.click('.product:first-child .add-to-cart');
});

// Solution 2: Use Descriptive Step Text
// BAD: Vague step
Then('it should work', async function () {
    // What should work?
});

// GOOD: Clear and specific
Then('the login should be successful', async function () {
    await expect(this.page.locator('.user-menu')).toBeVisible();
});

Then('I should see welcome message {string}', async function (message: string) {
    await expect(this.page.locator('.welcome')).toHaveText(message);
});

// Solution 3: Avoid Implementation Details in Steps
// BAD: Exposes implementation
When('I click on the button with id login-btn', async function () {
    await this.page.click('#login-btn');
});

// GOOD: Business language
When('I click the login button', async function () {
    await this.page.click('#login-btn');
});

// Solution 4: Use Page Objects
// BAD: Direct page interactions
When('I fill login form', async function () {
    await this.page.fill('#username', 'user');
    await this.page.fill('#password', 'pass');
    await this.page.click('#submit');
});

// GOOD: Delegate to page object
When('I submit login form', async function () {
    await this.loginPage.submitForm();
});

// Solution 5: Handle Errors Gracefully
When('I try to access restricted page', async function () {
    try {
        await this.page.goto('/admin');
        this.accessGranted = true;
    } catch (error) {
        this.accessGranted = false;
        this.accessError = error;
    }
});

Then('access should be denied', async function () {
    expect(this.accessGranted).toBe(false);
});

// Solution 6: Use World for Shared State
// BAD: Global variables
let sharedData: any;

// GOOD: Use World context
Given('I have test data', async function () {
    this.testData = {
        user: 'testuser',
        product: 'Test Product',
    };
});

When('I use the test data', async function () {
    await this.page.fill('#user', this.testData.user);
});

// Solution 7: Parameterize Steps
// BAD: Duplicate steps
When('I click the submit button', async function () {
    await this.page.click('#submit');
});

When('I click the cancel button', async function () {
    await this.page.click('#cancel');
});

// GOOD: Single parameterized step
When('I click the {word} button', async function (buttonName: string) {
    await this.page.click(`#${buttonName}`);
});

// Solution 8: Add Meaningful Assertions
// BAD: No assertion
Then('the page loads', async function () {
    await this.page.waitForLoadState();
});

// GOOD: Verify expected state
Then('the dashboard page should load', async function () {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.page.locator('.dashboard-content')).toBeVisible();
});

// Solution 9: Document Complex Steps
/**
 * Completes the checkout process with the given payment method.
 * This step handles the entire checkout flow including:
 * - Filling shipping information
 * - Selecting payment method
 * - Confirming order
 * 
 * @param paymentMethod - The payment method to use (credit-card, paypal, etc.)
 */
When('I complete checkout with {string} payment', async function (paymentMethod: string) {
    await this.checkoutPage.fillShippingInfo(this.shippingAddress);
    await this.checkoutPage.selectPayment(paymentMethod);
    await this.checkoutPage.confirmOrder();
});

// Solution 10: Best Practices Summary
/*
 * Step Definition Best Practices:
 * 
 * 1. Keep steps simple and focused
 * 2. Use business language, not technical
 * 3. Delegate to page objects
 * 4. Use World for shared state
 * 5. Parameterize similar steps
 * 6. Handle errors gracefully
 * 7. Add meaningful assertions
 * 8. Document complex logic
 * 9. Organize steps by feature
 * 10. Avoid duplication
 */

// Solution 11: Export
export {};

