/**
 * Lab 569: Reusable Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating reusable step definitions:
 * 
 * - Generic steps
 * - Parameterized steps
 * - Step composition
 * - Shared utilities
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic steps
 * 2. Parameterize steps
 * 3. Compose steps
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Generic Navigation Steps
Given('I am on the {string} page', async function (pageName: string) {
    const pages: Record<string, string> = {
        'home': '/',
        'login': '/login',
        'register': '/register',
        'dashboard': '/dashboard',
        'profile': '/profile',
        'settings': '/settings',
        'products': '/products',
        'cart': '/cart',
        'checkout': '/checkout',
    };
    
    const path = pages[pageName.toLowerCase()] || `/${pageName.toLowerCase()}`;
    await this.page.goto(path);
});

When('I navigate to the {string} page', async function (pageName: string) {
    await this.page.click(`a[href*="${pageName.toLowerCase()}"]`);
});

// Solution 2: Generic Form Steps
When('I fill in the {string} field with {string}', async function (fieldName: string, value: string) {
    const selectors = [
        `#${fieldName}`,
        `[name="${fieldName}"]`,
        `[data-testid="${fieldName}"]`,
        `input[placeholder*="${fieldName}" i]`,
    ];
    
    for (const selector of selectors) {
        const element = this.page.locator(selector);
        if (await element.count() > 0) {
            await element.fill(value);
            return;
        }
    }
    
    throw new Error(`Field "${fieldName}" not found`);
});

When('I clear the {string} field', async function (fieldName: string) {
    await this.page.fill(`[name="${fieldName}"]`, '');
});

// Solution 3: Generic Click Steps
When('I click the {string} button', async function (buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
});

When('I click the {string} link', async function (linkText: string) {
    await this.page.click(`a:has-text("${linkText}")`);
});

When('I click on {string}', async function (text: string) {
    await this.page.click(`text=${text}`);
});

// Solution 4: Generic Selection Steps
When('I select {string} from the {string} dropdown', async function (option: string, dropdown: string) {
    await this.page.selectOption(`[name="${dropdown}"]`, { label: option });
});

When('I check the {string} checkbox', async function (label: string) {
    await this.page.check(`input[aria-label="${label}"], label:has-text("${label}") input`);
});

When('I uncheck the {string} checkbox', async function (label: string) {
    await this.page.uncheck(`input[aria-label="${label}"], label:has-text("${label}") input`);
});

// Solution 5: Generic Visibility Steps
Then('I should see {string}', async function (text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
});

Then('I should not see {string}', async function (text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeHidden();
});

Then('the {string} element should be visible', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('the {string} element should be hidden', async function (selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
});

// Solution 6: Generic Value Steps
Then('the {string} field should contain {string}', async function (fieldName: string, value: string) {
    await expect(this.page.locator(`[name="${fieldName}"]`)).toHaveValue(value);
});

Then('the {string} field should be empty', async function (fieldName: string) {
    await expect(this.page.locator(`[name="${fieldName}"]`)).toHaveValue('');
});

// Solution 7: Generic Wait Steps
When('I wait for {int} seconds', async function (seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
});

When('I wait for the page to load', async function () {
    await this.page.waitForLoadState('networkidle');
});

When('I wait for {string} to appear', async function (text: string) {
    await this.page.locator(`text=${text}`).waitFor({ state: 'visible' });
});

// Solution 8: Generic Count Steps
Then('I should see {int} {string} elements', async function (count: number, selector: string) {
    await expect(this.page.locator(selector)).toHaveCount(count);
});

// Solution 9: Generic URL Steps
Then('the URL should contain {string}', async function (text: string) {
    await expect(this.page).toHaveURL(new RegExp(text));
});

Then('I should be redirected to {string}', async function (url: string) {
    await expect(this.page).toHaveURL(url);
});

// Solution 10: Generic Screenshot Step
When('I take a screenshot named {string}', async function (name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
});

// Solution 11: Export
export {};

