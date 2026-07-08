/**
 * Lab 566: Parameter Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using parameter types in steps:
 * 
 * - Built-in types
 * - Custom types
 * - Type transformers
 * - Complex parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in types
 * 2. Create custom types
 * 3. Transform parameters
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, defineParameterType } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Built-in Parameter Types
// {int} - Integer
Given('I have {int} products in my cart', async function (count: number) {
    this.cartCount = count;
    await expect(this.page.locator('.cart-item')).toHaveCount(count);
});

// {float} - Decimal number
Given('the product price is {float}', async function (price: number) {
    this.productPrice = price;
});

// {string} - Quoted string
When('I enter {string} in the search field', async function (query: string) {
    await this.page.fill('#search', query);
});

// {word} - Single word (no quotes)
When('I click the {word} button', async function (buttonName: string) {
    await this.page.click(`button#${buttonName}`);
});

// Solution 2: Custom Parameter Type - Color
defineParameterType({
    name: 'color',
    regexp: /red|green|blue|yellow|orange|purple/,
    transformer: (s) => s.toLowerCase(),
});

When('I select {color} as the theme color', async function (color: string) {
    await this.page.click(`[data-color="${color}"]`);
});

// Solution 3: Custom Parameter Type - Currency
defineParameterType({
    name: 'currency',
    regexp: /\$[\d,]+\.?\d*/,
    transformer: (s) => {
        return parseFloat(s.replace('$', '').replace(',', ''));
    },
});

Then('the total should be {currency}', async function (amount: number) {
    const totalText = await this.page.locator('.total').textContent();
    const actualAmount = parseFloat(totalText?.replace('$', '').replace(',', '') || '0');
    expect(actualAmount).toBeCloseTo(amount, 2);
});

// Solution 4: Custom Parameter Type - Date
defineParameterType({
    name: 'date',
    regexp: /\d{4}-\d{2}-\d{2}/,
    transformer: (s) => new Date(s),
});

Given('the order was placed on {date}', async function (date: Date) {
    this.orderDate = date;
});

// Solution 5: Custom Parameter Type - Boolean
defineParameterType({
    name: 'boolean',
    regexp: /true|false|yes|no|enabled|disabled/,
    transformer: (s) => {
        return ['true', 'yes', 'enabled'].includes(s.toLowerCase());
    },
});

When('notifications are {boolean}', async function (enabled: boolean) {
    if (enabled) {
        await this.page.check('#notifications');
    } else {
        await this.page.uncheck('#notifications');
    }
});

// Solution 6: Custom Parameter Type - User Role
defineParameterType({
    name: 'role',
    regexp: /admin|manager|editor|viewer|guest/,
    transformer: (s) => s.toLowerCase(),
});

Given('I am logged in as a {role}', async function (role: string) {
    const credentials: Record<string, { email: string; password: string }> = {
        admin: { email: 'admin@test.com', password: 'admin123' },
        manager: { email: 'manager@test.com', password: 'manager123' },
        editor: { email: 'editor@test.com', password: 'editor123' },
        viewer: { email: 'viewer@test.com', password: 'viewer123' },
        guest: { email: 'guest@test.com', password: 'guest123' },
    };
    
    const creds = credentials[role];
    this.currentRole = role;
    
    await this.page.goto('/login');
    await this.page.fill('#email', creds.email);
    await this.page.fill('#password', creds.password);
    await this.page.click('#login');
});

// Solution 7: Custom Parameter Type - Status
defineParameterType({
    name: 'status',
    regexp: /pending|processing|shipped|delivered|cancelled/,
    transformer: (s) => s.toLowerCase(),
});

Then('the order status should be {status}', async function (status: string) {
    await expect(this.page.locator('.order-status')).toHaveText(status, { ignoreCase: true });
});

// Solution 8: Custom Parameter Type - JSON
defineParameterType({
    name: 'json',
    regexp: /\{[^}]+\}/,
    transformer: (s) => JSON.parse(s),
});

When('I send request with data {json}', async function (data: object) {
    this.requestData = data;
});

// Solution 9: Export
export {};

