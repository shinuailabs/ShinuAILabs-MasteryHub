/**
 * Lab 589: Complex Data Tables
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling complex data tables:
 * 
 * - Nested data
 * - Multi-level tables
 * - Conditional data
 * - Dynamic columns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle nested data
 * 2. Process complex tables
 * 3. Transform structures
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Nested Object from Flat Table
interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface Customer {
    name: string;
    email: string;
    billing: Address;
    shipping: Address;
}

When('I create customer with addresses:', async function (dataTable: DataTable) {
    const data = dataTable.rowsHash();
    
    const customer: Customer = {
        name: data['Name'],
        email: data['Email'],
        billing: {
            street: data['Billing Street'],
            city: data['Billing City'],
            state: data['Billing State'],
            zip: data['Billing Zip'],
        },
        shipping: {
            street: data['Shipping Street'],
            city: data['Shipping City'],
            state: data['Shipping State'],
            zip: data['Shipping Zip'],
        },
    };
    
    console.log('Customer:', JSON.stringify(customer, null, 2));
    this.customer = customer;
});

// Solution 2: Array of Nested Objects
When('I create orders with items:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const orders: Map<string, any> = new Map();
    
    for (const row of rows) {
        const orderId = row['Order ID'];
        
        if (!orders.has(orderId)) {
            orders.set(orderId, {
                id: orderId,
                customer: row['Customer'],
                items: [],
            });
        }
        
        orders.get(orderId).items.push({
            product: row['Product'],
            quantity: parseInt(row['Quantity']),
            price: parseFloat(row['Price'].replace('$', '')),
        });
    }
    
    this.orders = Array.from(orders.values());
    console.log('Orders:', JSON.stringify(this.orders, null, 2));
});

// Solution 3: Conditional Data Processing
When('I process conditional data:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    
    const processed = rows.map(row => {
        const result: any = {
            name: row['Name'],
            type: row['Type'],
        };
        
        // Add type-specific fields
        switch (row['Type']) {
            case 'Individual':
                result.ssn = row['SSN/EIN'];
                result.dob = row['DOB'];
                break;
            case 'Business':
                result.ein = row['SSN/EIN'];
                result.incorporationDate = row['DOB']; // Reused column
                break;
        }
        
        // Handle optional fields
        if (row['Phone']) {
            result.phone = row['Phone'];
        }
        
        return result;
    });
    
    this.processedData = processed;
});

// Solution 4: Matrix/Grid Data
When('I set permissions matrix:', async function (dataTable: DataTable) {
    const raw = dataTable.raw();
    const roles = raw[0].slice(1); // First row minus first cell
    const permissions: Record<string, Record<string, boolean>> = {};
    
    for (let i = 1; i < raw.length; i++) {
        const permission = raw[i][0];
        permissions[permission] = {};
        
        for (let j = 0; j < roles.length; j++) {
            permissions[permission][roles[j]] = raw[i][j + 1] === 'Yes';
        }
    }
    
    console.log('Permissions:', permissions);
    this.permissions = permissions;
});

// Solution 5: Hierarchical Data
When('I create category hierarchy:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const categories: any[] = [];
    const categoryMap: Map<string, any> = new Map();
    
    for (const row of rows) {
        const category = {
            id: row['ID'],
            name: row['Name'],
            children: [],
        };
        
        categoryMap.set(row['ID'], category);
        
        if (row['Parent ID']) {
            const parent = categoryMap.get(row['Parent ID']);
            if (parent) {
                parent.children.push(category);
            }
        } else {
            categories.push(category);
        }
    }
    
    this.categoryHierarchy = categories;
});

// Solution 6: Time Series Data
When('I import time series data:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    
    const timeSeries = rows.map(row => ({
        date: new Date(row['Date']),
        open: parseFloat(row['Open']),
        high: parseFloat(row['High']),
        low: parseFloat(row['Low']),
        close: parseFloat(row['Close']),
        volume: parseInt(row['Volume'].replace(/,/g, '')),
    }));
    
    // Sort by date
    timeSeries.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    this.timeSeries = timeSeries;
});

// Solution 7: Key-Value with Types
When('I configure settings:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const settings: Record<string, any> = {};
    
    for (const row of rows) {
        const key = row['Setting'];
        const value = row['Value'];
        const type = row['Type'];
        
        switch (type) {
            case 'string':
                settings[key] = value;
                break;
            case 'number':
                settings[key] = parseFloat(value);
                break;
            case 'boolean':
                settings[key] = value.toLowerCase() === 'true';
                break;
            case 'array':
                settings[key] = value.split(',').map(v => v.trim());
                break;
            case 'json':
                settings[key] = JSON.parse(value);
                break;
        }
    }
    
    this.settings = settings;
});

// Solution 8: Comparison Table
Then('the changes should be:', async function (dataTable: DataTable) {
    const changes = dataTable.hashes();
    
    for (const change of changes) {
        const field = change['Field'];
        const oldValue = change['Old Value'];
        const newValue = change['New Value'];
        
        // Verify old value was changed to new value
        const historyEntry = this.changeHistory.find(
            (h: any) => h.field === field
        );
        
        expect(historyEntry).toBeDefined();
        expect(historyEntry.oldValue).toBe(oldValue);
        expect(historyEntry.newValue).toBe(newValue);
    }
});

// Solution 9: Export
export {};

