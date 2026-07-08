/**
 * Lab 584: Data Table Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using DataTable methods:
 * 
 * - raw()
 * - rows()
 * - hashes()
 * - rowsHash()
 * - transpose()
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use different methods
 * 2. Parse table data
 * 3. Transform data
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: raw() - Returns all rows as string[][]
When('I see the raw table data:', async function (dataTable: DataTable) {
    const raw = dataTable.raw();
    console.log('Raw data:', raw);
    // Example output:
    // [
    //   ['Name', 'Email'],
    //   ['John', 'john@test.com'],
    //   ['Jane', 'jane@test.com']
    // ]
    
    this.rawTableData = raw;
});

// Solution 2: rows() - Returns rows without header
When('I process the following items:', async function (dataTable: DataTable) {
    const rows = dataTable.rows();
    console.log('Rows (no header):', rows);
    // Example output:
    // [
    //   ['John', 'john@test.com'],
    //   ['Jane', 'jane@test.com']
    // ]
    
    for (const [name, email] of rows) {
        console.log(`Processing: ${name} - ${email}`);
    }
});

// Solution 3: hashes() - Returns array of objects
When('I create users from table:', async function (dataTable: DataTable) {
    const users = dataTable.hashes();
    console.log('Hashes:', users);
    // Example output:
    // [
    //   { Name: 'John', Email: 'john@test.com' },
    //   { Name: 'Jane', Email: 'jane@test.com' }
    // ]
    
    for (const user of users) {
        await this.page.click('#add-user');
        await this.page.fill('#name', user['Name']);
        await this.page.fill('#email', user['Email']);
        await this.page.click('#save');
    }
    
    this.createdUsers = users;
});

// Solution 4: rowsHash() - Returns key-value object
When('I fill form with:', async function (dataTable: DataTable) {
    const formData = dataTable.rowsHash();
    console.log('Rows Hash:', formData);
    // Example output:
    // {
    //   'Name': 'John Doe',
    //   'Email': 'john@test.com',
    //   'Phone': '555-1234'
    // }
    
    for (const [field, value] of Object.entries(formData)) {
        const selector = `[name="${field.toLowerCase().replace(' ', '_')}"]`;
        await this.page.fill(selector, value);
    }
});

// Solution 5: transpose() - Swap rows and columns
When('I read transposed data:', async function (dataTable: DataTable) {
    const transposed = dataTable.transpose();
    console.log('Transposed:', transposed.raw());
    // Original:
    // | Name  | John | Jane |
    // | Email | j@t  | ja@t |
    // 
    // Transposed:
    // | Name  | Email |
    // | John  | j@t   |
    // | Jane  | ja@t  |
    
    this.transposedData = transposed.hashes();
});

// Solution 6: Combining Methods
When('I verify table structure:', async function (dataTable: DataTable) {
    const raw = dataTable.raw();
    const headers = raw[0];
    const dataRows = dataTable.rows();
    
    console.log('Headers:', headers);
    console.log('Data rows:', dataRows.length);
    
    // Verify each row has correct number of columns
    for (const row of dataRows) {
        expect(row.length).toBe(headers.length);
    }
});

// Solution 7: Custom Transformation
When('I process products:', async function (dataTable: DataTable) {
    const products = dataTable.hashes().map(row => ({
        name: row['Product'],
        quantity: parseInt(row['Quantity']),
        price: parseFloat(row['Price'].replace('$', '')),
    }));
    
    console.log('Transformed products:', products);
    // [
    //   { name: 'Laptop', quantity: 1, price: 999 },
    //   { name: 'Mouse', quantity: 2, price: 25 }
    // ]
    
    this.products = products;
});

// Solution 8: Filtering Table Data
Then('I should see only active users:', async function (dataTable: DataTable) {
    const users = dataTable.hashes();
    const activeUsers = users.filter(u => u['Status'] === 'Active');
    
    console.log('Active users:', activeUsers.length);
    
    for (const user of activeUsers) {
        await expect(this.page.locator(`text=${user['Name']}`)).toBeVisible();
    }
});

// Solution 9: Aggregating Table Data
Then('the total should match:', async function (dataTable: DataTable) {
    const items = dataTable.hashes();
    const total = items.reduce((sum, item) => {
        const price = parseFloat(item['Price'].replace('$', ''));
        const qty = parseInt(item['Quantity']);
        return sum + (price * qty);
    }, 0);
    
    console.log('Calculated total:', total);
    
    const displayedTotal = await this.page.locator('.total').textContent();
    expect(parseFloat(displayedTotal?.replace('$', '') || '0')).toBe(total);
});

// Solution 10: Export
export {};

