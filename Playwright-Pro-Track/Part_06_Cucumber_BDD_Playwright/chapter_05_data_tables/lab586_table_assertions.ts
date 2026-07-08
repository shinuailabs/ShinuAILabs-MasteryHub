/**
 * Lab 586: Data Table Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using data tables for assertions:
 * 
 * - Verifying table data
 * - Comparing expected vs actual
 * - Partial matching
 * - Order verification
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert table data
 * 2. Compare values
 * 3. Verify order
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Verify Exact Table Match
Then('the table should contain exactly:', async function (dataTable: DataTable) {
    const expected = dataTable.hashes();
    const rows = this.page.locator('table tbody tr');
    
    // Verify row count
    await expect(rows).toHaveCount(expected.length);
    
    // Verify each row
    for (let i = 0; i < expected.length; i++) {
        const row = rows.nth(i);
        for (const [column, value] of Object.entries(expected[i])) {
            const cell = row.locator(`td[data-column="${column}"]`);
            await expect(cell).toHaveText(value);
        }
    }
});

// Solution 2: Verify Table Contains (Partial Match)
Then('the table should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.hashes();
    
    for (const expectedRow of expected) {
        // Find row that matches all expected values
        let found = false;
        const rows = this.page.locator('table tbody tr');
        const count = await rows.count();
        
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            let matches = true;
            
            for (const [column, value] of Object.entries(expectedRow)) {
                const cellText = await row.locator(`td[data-column="${column}"]`).textContent();
                if (cellText?.trim() !== value) {
                    matches = false;
                    break;
                }
            }
            
            if (matches) {
                found = true;
                break;
            }
        }
        
        expect(found).toBe(true);
    }
});

// Solution 3: Verify Table Order
Then('the results should be in order:', async function (dataTable: DataTable) {
    const expected = dataTable.rows();
    const rows = this.page.locator('.result-item');
    
    for (let i = 0; i < expected.length; i++) {
        const [expectedName] = expected[i];
        const actualName = await rows.nth(i).locator('.name').textContent();
        expect(actualName?.trim()).toBe(expectedName);
    }
});

// Solution 4: Verify Key-Value Pairs
Then('the details should show:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    
    for (const [label, value] of Object.entries(expected)) {
        const row = this.page.locator(`.detail-row:has-text("${label}")`);
        await expect(row.locator('.value')).toHaveText(value);
    }
});

// Solution 5: Verify Numeric Values
Then('the prices should be:', async function (dataTable: DataTable) {
    const expected = dataTable.hashes();
    
    for (const item of expected) {
        const productRow = this.page.locator(`[data-product="${item['Product']}"]`);
        const priceText = await productRow.locator('.price').textContent();
        const actualPrice = parseFloat(priceText?.replace('$', '') || '0');
        const expectedPrice = parseFloat(item['Price'].replace('$', ''));
        
        expect(actualPrice).toBeCloseTo(expectedPrice, 2);
    }
});

// Solution 6: Verify Table Not Contains
Then('the table should not contain:', async function (dataTable: DataTable) {
    const excluded = dataTable.hashes();
    
    for (const excludedRow of excluded) {
        const selector = Object.entries(excludedRow)
            .map(([col, val]) => `td[data-column="${col}"]:has-text("${val}")`)
            .join(' ~ ');
        
        await expect(this.page.locator(`tr:has(${selector})`)).toHaveCount(0);
    }
});

// Solution 7: Verify Column Values
Then('the {string} column should contain:', async function (column: string, dataTable: DataTable) {
    const expected = dataTable.raw().flat();
    const cells = this.page.locator(`td[data-column="${column}"]`);
    const count = await cells.count();
    
    const actual: string[] = [];
    for (let i = 0; i < count; i++) {
        const text = await cells.nth(i).textContent();
        actual.push(text?.trim() || '');
    }
    
    expect(actual).toEqual(expect.arrayContaining(expected));
});

// Solution 8: Verify Sorted Order
Then('the table should be sorted by {string} {word}:', async function (
    column: string,
    order: string,
    dataTable: DataTable
) {
    const expected = dataTable.rows().map(r => r[0]);
    const cells = this.page.locator(`td[data-column="${column}"]`);
    const count = await cells.count();
    
    const actual: string[] = [];
    for (let i = 0; i < count; i++) {
        const text = await cells.nth(i).textContent();
        actual.push(text?.trim() || '');
    }
    
    if (order === 'descending') {
        expect(actual).toEqual(expected);
    } else {
        expect(actual).toEqual(expected);
    }
});

// Solution 9: Verify Row Count by Criteria
Then('there should be {int} rows where:', async function (count: number, dataTable: DataTable) {
    const criteria = dataTable.rowsHash();
    
    let matchingRows = 0;
    const rows = this.page.locator('table tbody tr');
    const totalRows = await rows.count();
    
    for (let i = 0; i < totalRows; i++) {
        const row = rows.nth(i);
        let matches = true;
        
        for (const [column, value] of Object.entries(criteria)) {
            const cellText = await row.locator(`td[data-column="${column}"]`).textContent();
            if (cellText?.trim() !== value) {
                matches = false;
                break;
            }
        }
        
        if (matches) matchingRows++;
    }
    
    expect(matchingRows).toBe(count);
});

// Solution 10: Export
export {};

