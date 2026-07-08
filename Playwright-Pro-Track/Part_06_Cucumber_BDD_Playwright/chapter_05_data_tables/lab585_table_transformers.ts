/**
 * Lab 585: Data Table Transformers
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Transforming data tables:
 * 
 * - Custom transformers
 * - Type conversion
 * - Data mapping
 * - Validation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create transformers
 * 2. Convert types
 * 3. Map data
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable, defineParameterType } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Type Interfaces
interface User {
    name: string;
    email: string;
    age: number;
    active: boolean;
}

interface Product {
    name: string;
    price: number;
    quantity: number;
    category: string;
}

interface Order {
    id: string;
    date: Date;
    total: number;
    status: string;
}

// Solution 2: User Transformer
function transformToUsers(dataTable: DataTable): User[] {
    return dataTable.hashes().map(row => ({
        name: row['Name'],
        email: row['Email'],
        age: parseInt(row['Age']),
        active: row['Active'].toLowerCase() === 'true',
    }));
}

When('I create users:', async function (dataTable: DataTable) {
    const users = transformToUsers(dataTable);
    console.log('Transformed users:', users);
    
    for (const user of users) {
        // Use typed user object
        await this.page.fill('#name', user.name);
        await this.page.fill('#email', user.email);
        await this.page.fill('#age', String(user.age));
        
        if (user.active) {
            await this.page.check('#active');
        }
        
        await this.page.click('#save');
    }
    
    this.users = users;
});

// Solution 3: Product Transformer
function transformToProducts(dataTable: DataTable): Product[] {
    return dataTable.hashes().map(row => ({
        name: row['Product'],
        price: parseFloat(row['Price'].replace(/[$,]/g, '')),
        quantity: parseInt(row['Quantity']),
        category: row['Category'],
    }));
}

When('I add products to inventory:', async function (dataTable: DataTable) {
    const products = transformToProducts(dataTable);
    
    for (const product of products) {
        console.log(`Adding: ${product.name} - $${product.price} x ${product.quantity}`);
    }
    
    this.products = products;
});

// Solution 4: Order Transformer with Date
function transformToOrders(dataTable: DataTable): Order[] {
    return dataTable.hashes().map(row => ({
        id: row['Order ID'],
        date: new Date(row['Date']),
        total: parseFloat(row['Total'].replace(/[$,]/g, '')),
        status: row['Status'],
    }));
}

Then('I should see orders:', async function (dataTable: DataTable) {
    const expectedOrders = transformToOrders(dataTable);
    
    for (const order of expectedOrders) {
        const orderRow = this.page.locator(`[data-order-id="${order.id}"]`);
        await expect(orderRow).toBeVisible();
        await expect(orderRow.locator('.status')).toHaveText(order.status);
    }
});

// Solution 5: Generic Transformer Factory
function createTransformer<T>(mapping: Record<string, (value: string) => any>) {
    return (dataTable: DataTable): T[] => {
        return dataTable.hashes().map(row => {
            const result: any = {};
            for (const [key, transform] of Object.entries(mapping)) {
                const columnName = key.charAt(0).toUpperCase() + key.slice(1);
                result[key] = transform(row[columnName] || row[key] || '');
            }
            return result as T;
        });
    };
}

// Solution 6: Using Generic Transformer
const transformToEmployees = createTransformer<{
    name: string;
    salary: number;
    department: string;
    startDate: Date;
}>({
    name: (v) => v,
    salary: (v) => parseFloat(v.replace(/[$,]/g, '')),
    department: (v) => v,
    startDate: (v) => new Date(v),
});

When('I import employees:', async function (dataTable: DataTable) {
    const employees = transformToEmployees(dataTable);
    console.log('Employees:', employees);
    this.employees = employees;
});

// Solution 7: Validation Transformer
function transformWithValidation(dataTable: DataTable): User[] {
    const users = dataTable.hashes().map((row, index) => {
        // Validate required fields
        if (!row['Name']) {
            throw new Error(`Row ${index + 1}: Name is required`);
        }
        if (!row['Email'] || !row['Email'].includes('@')) {
            throw new Error(`Row ${index + 1}: Valid email is required`);
        }
        
        return {
            name: row['Name'],
            email: row['Email'],
            age: parseInt(row['Age']) || 0,
            active: row['Active']?.toLowerCase() === 'true',
        };
    });
    
    return users;
}

When('I create validated users:', async function (dataTable: DataTable) {
    try {
        const users = transformWithValidation(dataTable);
        this.users = users;
    } catch (error) {
        this.validationError = error;
    }
});

// Solution 8: Nested Object Transformer
interface Address {
    street: string;
    city: string;
    zip: string;
}

interface Customer {
    name: string;
    email: string;
    address: Address;
}

function transformToCustomers(dataTable: DataTable): Customer[] {
    return dataTable.hashes().map(row => ({
        name: row['Name'],
        email: row['Email'],
        address: {
            street: row['Street'],
            city: row['City'],
            zip: row['Zip'],
        },
    }));
}

When('I create customers with addresses:', async function (dataTable: DataTable) {
    const customers = transformToCustomers(dataTable);
    console.log('Customers:', JSON.stringify(customers, null, 2));
    this.customers = customers;
});

// Solution 9: Export
export { transformToUsers, transformToProducts, transformToOrders };

