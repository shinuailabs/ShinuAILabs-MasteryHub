/**
 * Lab 591: Data Table Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for data tables:
 * 
 * - Readability
 * - Maintainability
 * - Performance
 * - Common patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Improve readability
 * 3. Optimize performance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/*
 * Best Practice 1: Use Meaningful Column Names
 * 
 * BAD:
 * | col1 | col2 | col3 |
 * 
 * GOOD:
 * | Product Name | Price | Quantity |
 */

/*
 * Best Practice 2: Keep Tables Focused
 * 
 * BAD: One table with too many columns
 * | Name | Email | Phone | Address | City | State | Zip | Country | ... |
 * 
 * GOOD: Split into logical groups
 * Personal Info:
 * | Name | Email | Phone |
 * 
 * Address:
 * | Street | City | State | Zip |
 */

// Solution 1: Focused Table Steps
When('I enter personal information:', async function (dataTable: DataTable) {
    const data = dataTable.rowsHash();
    await this.page.fill('#name', data['Name']);
    await this.page.fill('#email', data['Email']);
    await this.page.fill('#phone', data['Phone']);
});

When('I enter address information:', async function (dataTable: DataTable) {
    const data = dataTable.rowsHash();
    await this.page.fill('#street', data['Street']);
    await this.page.fill('#city', data['City']);
    await this.page.fill('#state', data['State']);
    await this.page.fill('#zip', data['Zip']);
});

/*
 * Best Practice 3: Use Consistent Formatting
 * 
 * BAD: Inconsistent values
 * | Price  |
 * | $10    |
 * | 20.00  |
 * | 30 USD |
 * 
 * GOOD: Consistent format
 * | Price  |
 * | $10.00 |
 * | $20.00 |
 * | $30.00 |
 */

// Solution 2: Consistent Data Handling
When('I verify prices:', async function (dataTable: DataTable) {
    const items = dataTable.hashes();
    
    for (const item of items) {
        // Always parse consistently
        const price = parseFloat(item['Price'].replace(/[$,]/g, ''));
        expect(price).toBeGreaterThan(0);
    }
});

/*
 * Best Practice 4: Avoid Hardcoded Test Data in Tables
 * 
 * BAD: Hardcoded IDs that may change
 * | User ID | Name |
 * | 12345   | John |
 * 
 * GOOD: Use descriptive references
 * | User Type | Name |
 * | admin     | John |
 */

// Solution 3: Reference-Based Data
When('I assign roles:', async function (dataTable: DataTable) {
    const assignments = dataTable.hashes();
    
    for (const assignment of assignments) {
        // Look up actual ID from reference
        const userId = this.testUsers[assignment['User Type']]?.id;
        const roleId = this.roles[assignment['Role']]?.id;
        
        await this.page.request.post('/api/assignments', {
            data: { userId, roleId },
        });
    }
});

/*
 * Best Practice 5: Use Tables for Data, Not Actions
 * 
 * BAD: Actions in table
 * | Action | Target |
 * | click  | button |
 * | fill   | input  |
 * 
 * GOOD: Data in table, actions in step
 * When I fill the form with:
 * | Field | Value |
 */

// Solution 4: Data-Focused Tables
When('I configure the following settings:', async function (dataTable: DataTable) {
    const settings = dataTable.rowsHash();
    
    // Actions are in the step, data comes from table
    for (const [setting, value] of Object.entries(settings)) {
        await this.page.fill(`#setting-${setting}`, value);
    }
    
    await this.page.click('#save-settings');
});

/*
 * Best Practice 6: Validate Table Structure
 */

// Solution 5: Table Validation
When('I create products:', async function (dataTable: DataTable) {
    // Validate required columns
    const headers = dataTable.raw()[0];
    const required = ['Name', 'Price', 'Category'];
    
    for (const col of required) {
        if (!headers.includes(col)) {
            throw new Error(`Missing required column: ${col}`);
        }
    }
    
    // Process validated data
    const products = dataTable.hashes();
    this.products = products;
});

/*
 * Best Practice 7: Use Type Transformers
 */

// Solution 6: Type-Safe Processing
interface Product {
    name: string;
    price: number;
    quantity: number;
    active: boolean;
}

function transformProduct(row: Record<string, string>): Product {
    return {
        name: row['Name'],
        price: parseFloat(row['Price'].replace('$', '')),
        quantity: parseInt(row['Quantity']),
        active: row['Active'].toLowerCase() === 'yes',
    };
}

When('I import products:', async function (dataTable: DataTable) {
    const products: Product[] = dataTable.hashes().map(transformProduct);
    
    // Now we have typed data
    for (const product of products) {
        console.log(`${product.name}: $${product.price.toFixed(2)}`);
    }
});

/*
 * Best Practice 8: Document Complex Tables
 */

// Solution 7: Documented Table Processing
/**
 * Processes a permission matrix table.
 * 
 * Expected table format:
 * | Permission    | Admin | Editor | Viewer |
 * | Create        | Yes   | Yes    | No     |
 * | Read          | Yes   | Yes    | Yes    |
 * | Update        | Yes   | Yes    | No     |
 * | Delete        | Yes   | No     | No     |
 * 
 * @param dataTable - The permission matrix
 * @returns Permission map by role
 */
When('I set permission matrix:', async function (dataTable: DataTable) {
    const raw = dataTable.raw();
    const roles = raw[0].slice(1);
    const permissions: Record<string, Record<string, boolean>> = {};
    
    for (let i = 1; i < raw.length; i++) {
        const permission = raw[i][0];
        permissions[permission] = {};
        
        for (let j = 0; j < roles.length; j++) {
            permissions[permission][roles[j]] = raw[i][j + 1] === 'Yes';
        }
    }
    
    this.permissions = permissions;
});

// Solution 8: Export
export {};

