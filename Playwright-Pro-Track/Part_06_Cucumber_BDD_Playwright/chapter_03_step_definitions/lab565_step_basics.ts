/**
 * Lab 565: Step Definition Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating step definitions:
 * 
 * - Given/When/Then functions
 * - Step matching
 * - Parameters
 * - Async handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic steps
 * 2. Match step text
 * 3. Handle async operations
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Basic Given Step
Given('I am on the home page', async function () {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
});

Given('I am logged in', async function () {
    await this.page.goto('/login');
    await this.page.fill('#username', 'testuser');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    await expect(this.page.locator('.user-menu')).toBeVisible();
});

// Solution 2: Basic When Step
When('I click the login button', async function () {
    await this.page.click('#login-btn');
});

When('I navigate to {string}', async function (path: string) {
    await this.page.goto(path);
});

When('I fill in {string} with {string}', async function (field: string, value: string) {
    await this.page.fill(`[name="${field}"]`, value);
});

// Solution 3: Basic Then Step
Then('I should see {string}', async function (text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
});

Then('I should be on the {string} page', async function (pageName: string) {
    await expect(this.page).toHaveURL(new RegExp(pageName.toLowerCase()));
});

Then('the page title should be {string}', async function (title: string) {
    await expect(this.page).toHaveTitle(title);
});

// Solution 4: Steps with Multiple Parameters
Given('I have {int} items in my cart worth {string}', async function (count: number, total: string) {
    this.cartItemCount = count;
    this.cartTotal = total;
});

When('I search for {string} in {string} category', async function (query: string, category: string) {
    await this.page.selectOption('#category', category);
    await this.page.fill('#search', query);
    await this.page.click('#search-btn');
});

// Solution 5: Steps with World Context
Given('I am logged in as {string}', async function (userType: string) {
    const credentials: Record<string, { username: string; password: string }> = {
        admin: { username: 'admin@test.com', password: 'admin123' },
        customer: { username: 'customer@test.com', password: 'customer123' },
    };
    
    const creds = credentials[userType];
    this.currentUser = userType;
    
    await this.page.goto('/login');
    await this.page.fill('#username', creds.username);
    await this.page.fill('#password', creds.password);
    await this.page.click('#login-btn');
});

// Solution 6: Steps with Assertions
Then('I should see {int} search results', async function (count: number) {
    await expect(this.page.locator('.search-result')).toHaveCount(count);
});

Then('the first result should contain {string}', async function (text: string) {
    await expect(this.page.locator('.search-result').first()).toContainText(text);
});

Then('the error message should be {string}', async function (message: string) {
    await expect(this.page.locator('.error-message')).toHaveText(message);
});

// Solution 7: Steps with Waiting
When('I wait for the page to load', async function () {
    await this.page.waitForLoadState('networkidle');
});

When('I wait for {string} to be visible', async function (selector: string) {
    await this.page.locator(selector).waitFor({ state: 'visible' });
});

Then('the loading spinner should disappear', async function () {
    await this.page.locator('.loading-spinner').waitFor({ state: 'hidden' });
});

// Solution 8: Export
export {};

