/**
 * Lab 552: Cucumber Expressions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Cucumber expressions for step matching:
 * 
 * - Parameter types
 * - Custom parameters
 * - Optional text
 * - Alternative text
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in parameters
 * 2. Create custom parameters
 * 3. Use optional/alternative text
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, defineParameterType } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './lab548_cucumber_setup';

// Solution 1: Built-in Parameter Types
// {int} - matches integers
Given('I have {int} items in my cart', async function (this: CustomWorld, count: number) {
    this.cartItemCount = count;
});

// {float} - matches decimal numbers
Given('the price is {float} dollars', async function (this: CustomWorld, price: number) {
    this.price = price;
});

// {string} - matches quoted strings
When('I search for {string}', async function (this: CustomWorld, query: string) {
    await this.page.fill('#search', query);
    await this.page.click('#search-btn');
});

// {word} - matches single word without quotes
When('I click the {word} button', async function (this: CustomWorld, buttonName: string) {
    await this.page.click(`button#${buttonName}`);
});

// Solution 2: Custom Parameter Types
defineParameterType({
    name: 'color',
    regexp: /red|green|blue|yellow/,
    transformer: (s) => s,
});

When('I select {color} as the background', async function (this: CustomWorld, color: string) {
    await this.page.click(`[data-color="${color}"]`);
});

// Custom parameter for currency
defineParameterType({
    name: 'currency',
    regexp: /\$[\d,]+\.?\d*/,
    transformer: (s) => parseFloat(s.replace('$', '').replace(',', '')),
});

Then('the total should be {currency}', async function (this: CustomWorld, amount: number) {
    const total = await this.page.locator('.total').textContent();
    const actualAmount = parseFloat(total?.replace('$', '') || '0');
    expect(actualAmount).toBe(amount);
});

// Custom parameter for user type
defineParameterType({
    name: 'userType',
    regexp: /admin|customer|guest/,
    transformer: (s) => s,
});

Given('I am logged in as {userType}', async function (this: CustomWorld, userType: string) {
    const credentials: Record<string, { username: string; password: string }> = {
        admin: { username: 'admin@test.com', password: 'admin123' },
        customer: { username: 'customer@test.com', password: 'customer123' },
        guest: { username: 'guest@test.com', password: 'guest123' },
    };
    
    const creds = credentials[userType];
    await this.page.goto('/login');
    await this.page.fill('#username', creds.username);
    await this.page.fill('#password', creds.password);
    await this.page.click('#login-btn');
});

// Solution 3: Optional Text
// (s) makes 's' optional - matches "item" or "items"
Then('I should have {int} item(s) in cart', async function (this: CustomWorld, count: number) {
    await expect(this.page.locator('.cart-item')).toHaveCount(count);
});

// Optional word
When('I (quickly )add to cart', async function (this: CustomWorld) {
    await this.page.click('.add-to-cart');
});

// Solution 4: Alternative Text
// word1/word2 matches either word
When('I click/tap the submit button', async function (this: CustomWorld) {
    await this.page.click('button[type="submit"]');
});

When('I accept/agree to the terms', async function (this: CustomWorld) {
    await this.page.check('#terms');
});

// Solution 5: Anonymous Parameters
// {}, matches anything
Given('I am on the {} page', async function (this: CustomWorld, pageName: string) {
    await this.page.goto(`/${pageName.toLowerCase()}`);
});

// Solution 6: Regular Expressions (alternative to Cucumber Expressions)
Given(/^I wait for (\d+) seconds?$/, async function (this: CustomWorld, seconds: string) {
    await this.page.waitForTimeout(parseInt(seconds) * 1000);
});

Then(/^the element "([^"]*)" should (not )?be visible$/, async function (
    this: CustomWorld,
    selector: string,
    not: string | undefined
) {
    if (not) {
        await expect(this.page.locator(selector)).toBeHidden();
    } else {
        await expect(this.page.locator(selector)).toBeVisible();
    }
});

// Solution 7: Export
export {};

