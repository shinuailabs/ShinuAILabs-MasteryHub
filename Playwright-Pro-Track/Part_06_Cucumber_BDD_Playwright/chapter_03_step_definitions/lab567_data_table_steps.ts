/**
 * Lab 567: Data Table Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling data tables in steps:
 * 
 * - Table methods
 * - Row/column access
 * - Key-value pairs
 * - Complex tables
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Parse data tables
 * 2. Access table data
 * 3. Handle complex tables
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Raw Table Data
When('I see the following items:', async function (dataTable: DataTable) {
    // raw() returns string[][]
    const raw = dataTable.raw();
    console.log('Raw data:', raw);
    // [['Item', 'Price'], ['Apple', '$1.00'], ['Banana', '$0.50']]
});

// Solution 2: Rows (excluding header)
When('I add the following products:', async function (dataTable: DataTable) {
    // rows() returns string[][] without header row
    const rows = dataTable.rows();
    
    for (const [product, quantity] of rows) {
        await this.page.fill('#product-search', product);
        await this.page.click('.search-result:first-child');
        await this.page.fill('#quantity', quantity);
        await this.page.click('#add-to-cart');
    }
});

// Solution 3: Hashes (array of objects)
When('I create users with the following details:', async function (dataTable: DataTable) {
    // hashes() returns array of objects with header as keys
    const users = dataTable.hashes();
    // [{ Name: 'John', Email: 'john@test.com' }, ...]
    
    for (const user of users) {
        await this.page.click('#add-user');
        await this.page.fill('#name', user['Name']);
        await this.page.fill('#email', user['Email']);
        await this.page.fill('#role', user['Role']);
        await this.page.click('#save-user');
    }
});

// Solution 4: Rows Hash (key-value pairs)
When('I fill in the form with:', async function (dataTable: DataTable) {
    // rowsHash() returns object with first column as keys
    const data = dataTable.rowsHash();
    // { 'First Name': 'John', 'Last Name': 'Doe', ... }
    
    for (const [field, value] of Object.entries(data)) {
        const selector = `[name="${field.toLowerCase().replace(' ', '_')}"]`;
        await this.page.fill(selector, value);
    }
});

// Solution 5: Transpose
When('I verify the product details:', async function (dataTable: DataTable) {
    // transpose() swaps rows and columns
    const transposed = dataTable.transpose();
    const data = transposed.rowsHash();
    
    for (const [field, expected] of Object.entries(data)) {
        const actual = await this.page.locator(`[data-field="${field}"]`).textContent();
        expect(actual).toBe(expected);
    }
});

// Solution 6: Complex Table with Verification
Then('I should see the following order summary:', async function (dataTable: DataTable) {
    const expected = dataTable.hashes();
    
    for (let i = 0; i < expected.length; i++) {
        const row = expected[i];
        const rowLocator = this.page.locator('.order-item').nth(i);
        
        await expect(rowLocator.locator('.product-name')).toHaveText(row['Product']);
        await expect(rowLocator.locator('.quantity')).toHaveText(row['Quantity']);
        await expect(rowLocator.locator('.price')).toHaveText(row['Price']);
    }
});

// Solution 7: Table with Optional Fields
When('I update settings:', async function (dataTable: DataTable) {
    const settings = dataTable.rowsHash();
    
    if (settings['Theme']) {
        await this.page.selectOption('#theme', settings['Theme']);
    }
    
    if (settings['Language']) {
        await this.page.selectOption('#language', settings['Language']);
    }
    
    if (settings['Notifications']) {
        const enabled = settings['Notifications'].toLowerCase() === 'enabled';
        if (enabled) {
            await this.page.check('#notifications');
        } else {
            await this.page.uncheck('#notifications');
        }
    }
    
    await this.page.click('#save-settings');
});

// Solution 8: Table for API Requests
When('I send a request with headers:', async function (dataTable: DataTable) {
    const headers = dataTable.rowsHash();
    
    this.requestHeaders = headers;
    
    const response = await this.page.request.get('/api/data', {
        headers: headers,
    });
    
    this.response = response;
});

// Solution 9: Table for Assertions
Then('the response should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    const responseBody = await this.response.json();
    
    for (const [key, value] of Object.entries(expected)) {
        expect(responseBody[key]).toBe(value);
    }
});

// Solution 10: Export
export {};

