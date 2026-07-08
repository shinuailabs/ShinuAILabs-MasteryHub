/**
 * Lab 547: BDD Overview - Step Definitions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Step definitions connect Gherkin to code:
 * 
 * - Given steps (preconditions)
 * - When steps (actions)
 * - Then steps (assertions)
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page, Browser, chromium, expect } from '@playwright/test';

let browser: Browser;
let page: Page;

// Hooks
Before(async function () {
    browser = await chromium.launch();
    page = await browser.newPage();
});

After(async function () {
    await browser.close();
});

// Given Steps
Given('the application is running', async function () {
    // Verify application is accessible
    const response = await page.goto('http://localhost:3000');
    expect(response?.status()).toBe(200);
});

Given('I am on the login page', async function () {
    await page.goto('http://localhost:3000/login');
    await expect(page.locator('form#login')).toBeVisible();
});

Given('I have a valid user account', async function () {
    // This could set up test data or verify user exists
    this.validUser = {
        username: 'testuser',
        password: 'password123',
    };
});

// When Steps
When('I enter my username {string}', async function (username: string) {
    await page.fill('#username', username);
});

When('I enter my password {string}', async function (password: string) {
    await page.fill('#password', password);
});

When('I click the login button', async function () {
    await page.click('button[type="submit"]');
});

When('I click the login button without entering credentials', async function () {
    await page.click('button[type="submit"]');
});

When('I check the {string} checkbox', async function (label: string) {
    await page.check(`input[aria-label="${label}"]`);
});

// Then Steps
Then('I should be redirected to the dashboard', async function () {
    await expect(page).toHaveURL(/.*dashboard/);
});

Then('I should see a welcome message', async function () {
    await expect(page.locator('.welcome-message')).toBeVisible();
});

Then('I should see an error message {string}', async function (message: string) {
    await expect(page.locator('.error-message')).toHaveText(message);
});

Then('I should remain on the login page', async function () {
    await expect(page).toHaveURL(/.*login/);
});

Then('I should see validation errors', async function () {
    await expect(page.locator('.validation-error')).toHaveCount(2);
});

Then('the username field should show {string}', async function (message: string) {
    await expect(page.locator('#username-error')).toHaveText(message);
});

Then('the password field should show {string}', async function (message: string) {
    await expect(page.locator('#password-error')).toHaveText(message);
});

Then('I should be logged in', async function () {
    await expect(page.locator('.user-menu')).toBeVisible();
});

Then('my session should persist after closing the browser', async function () {
    // Check for remember me cookie
    const cookies = await page.context().cookies();
    const rememberCookie = cookies.find(c => c.name === 'remember_token');
    expect(rememberCookie).toBeDefined();
});

export { page, browser };

