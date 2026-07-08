/**
 * Lab 550: Given-When-Then Pattern
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding Given-When-Then:
 * 
 * - Given: Setup/preconditions
 * - When: Actions/events
 * - Then: Assertions/outcomes
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write Given steps
 * 2. Write When steps
 * 3. Write Then steps
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './lab548_cucumber_setup';

// Solution 1: Given Steps - Setup Preconditions
// Given steps set up the initial state

Given('I am logged in as a customer', async function (this: CustomWorld) {
    // Navigate to login
    await this.page.goto('/login');
    // Perform login
    await this.page.fill('#username', 'customer@test.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    // Verify logged in
    await expect(this.page.locator('.user-menu')).toBeVisible();
});

Given('I have an empty shopping cart', async function (this: CustomWorld) {
    // Clear cart via API or UI
    await this.page.evaluate(() => {
        localStorage.removeItem('cart');
    });
    await this.page.reload();
});

Given('I am viewing product {string}', async function (this: CustomWorld, productName: string) {
    await this.page.goto(`/products?search=${productName}`);
    await this.page.click(`.product-card:has-text("${productName}")`);
    await expect(this.page.locator('.product-title')).toHaveText(productName);
});

Given('I have {string} in my cart', async function (this: CustomWorld, productName: string) {
    // Add product to cart
    await this.page.goto(`/products?search=${productName}`);
    await this.page.click(`.product-card:has-text("${productName}") .add-to-cart`);
});

Given('I have items worth {string} in my cart', async function (this: CustomWorld, total: string) {
    // Set up cart with specific total
    this.expectedTotal = total;
});

// Solution 2: When Steps - Perform Actions
// When steps describe the action being taken

When('I click {string}', async function (this: CustomWorld, buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
});

When('I navigate to product {string}', async function (this: CustomWorld, productName: string) {
    await this.page.goto(`/products?search=${productName}`);
    await this.page.click(`.product-card:has-text("${productName}")`);
});

When('I add special instructions:', async function (this: CustomWorld, docString: string) {
    await this.page.fill('#special-instructions', docString);
    this.specialInstructions = docString;
});

When('I add the following products to cart:', async function (this: CustomWorld, dataTable: any) {
    const products = dataTable.hashes();
    for (const product of products) {
        await this.page.goto(`/products?search=${product.Product}`);
        await this.page.fill('#quantity', product.Quantity);
        await this.page.click('.add-to-cart');
    }
});

When('I apply discount code {string}', async function (this: CustomWorld, code: string) {
    await this.page.fill('#discount-code', code);
    await this.page.click('#apply-discount');
});

When('I click remove on {string}', async function (this: CustomWorld, productName: string) {
    await this.page.click(`.cart-item:has-text("${productName}") .remove-btn`);
});

// Solution 3: Then Steps - Verify Outcomes
// Then steps verify the expected outcome

Then('the cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
    await expect(this.page.locator('.cart-item')).toHaveCount(count);
});

Then('the cart total should be {string}', async function (this: CustomWorld, total: string) {
    await expect(this.page.locator('.cart-total')).toHaveText(total);
});

Then('the shipping should still be free', async function (this: CustomWorld) {
    await expect(this.page.locator('.shipping-cost')).toHaveText('Free');
});

Then('the item should have special instructions', async function (this: CustomWorld) {
    await expect(this.page.locator('.special-instructions')).toBeVisible();
});

Then('I should see discount of {string}', async function (this: CustomWorld, discount: string) {
    await expect(this.page.locator('.discount-amount')).toHaveText(discount);
});

Then('the final total should be {string}', async function (this: CustomWorld, finalTotal: string) {
    await expect(this.page.locator('.final-total')).toHaveText(finalTotal);
});

Then('the cart should be empty', async function (this: CustomWorld) {
    await expect(this.page.locator('.empty-cart-message')).toBeVisible();
});

Then('my cart should be saved', async function (this: CustomWorld) {
    await expect(this.page.locator('.saved-cart-confirmation')).toBeVisible();
});

Then('I should see a confirmation message', async function (this: CustomWorld) {
    await expect(this.page.locator('.confirmation-message')).toBeVisible();
});

// Solution 4: Export
export {};

