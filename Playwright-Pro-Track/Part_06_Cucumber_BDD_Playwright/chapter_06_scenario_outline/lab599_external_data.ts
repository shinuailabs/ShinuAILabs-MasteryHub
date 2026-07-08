/**
 * Lab 599: External Data Sources
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using external data with outlines:
 * 
 * - JSON data files
 * - CSV data files
 * - Database data
 * - API data
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Load external data
 * 2. Transform data
 * 3. Use in tests
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Solution 1: Load JSON Test Data
interface TestUser {
    email: string;
    password: string;
    role: string;
    expectedAccess: string[];
}

function loadTestUsers(): TestUser[] {
    const dataPath = path.join(__dirname, '../data/users.json');
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
    // Default test data
    return [
        { email: 'admin@test.com', password: 'admin123', role: 'admin', expectedAccess: ['dashboard', 'users', 'settings'] },
        { email: 'user@test.com', password: 'user123', role: 'user', expectedAccess: ['dashboard'] },
    ];
}

Given('I load test users from external source', async function () {
    this.testUsers = loadTestUsers();
});

// Solution 2: Load CSV Test Data
function loadCSVData(filename: string): Record<string, string>[] {
    const dataPath = path.join(__dirname, `../data/${filename}`);
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    
    const content = fs.readFileSync(dataPath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    });
}

Given('I load products from CSV', async function () {
    this.products = loadCSVData('products.csv');
});

// Solution 3: Load Environment-Specific Data
function loadEnvironmentData(env: string): Record<string, any> {
    const envFile = path.join(__dirname, `../data/env.${env}.json`);
    if (fs.existsSync(envFile)) {
        return JSON.parse(fs.readFileSync(envFile, 'utf-8'));
    }
    
    // Default configuration
    return {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3000/api',
        timeout: 30000,
    };
}

Given('I configure for {string} environment', async function (env: string) {
    this.envConfig = loadEnvironmentData(env);
    this.baseUrl = this.envConfig.baseUrl;
});

// Solution 4: Dynamic Data Generation
interface GeneratedUser {
    email: string;
    password: string;
    name: string;
}

function generateTestUser(index: number): GeneratedUser {
    const timestamp = Date.now();
    return {
        email: `test.user.${index}.${timestamp}@example.com`,
        password: `TestPass${index}!`,
        name: `Test User ${index}`,
    };
}

Given('I generate {int} test users', async function (count: number) {
    this.generatedUsers = Array.from({ length: count }, (_, i) => 
        generateTestUser(i + 1)
    );
});

// Solution 5: Load Data from API
Given('I fetch test data from API', async function () {
    try {
        const response = await this.page.request.get('/api/test-data');
        if (response.ok()) {
            this.apiTestData = await response.json();
        }
    } catch (error) {
        console.log('API not available, using default data');
        this.apiTestData = { users: [], products: [] };
    }
});

// Solution 6: Data Provider Pattern
class TestDataProvider {
    private static instance: TestDataProvider;
    private data: Map<string, any[]> = new Map();
    
    static getInstance(): TestDataProvider {
        if (!TestDataProvider.instance) {
            TestDataProvider.instance = new TestDataProvider();
        }
        return TestDataProvider.instance;
    }
    
    loadData(key: string, loader: () => any[]): any[] {
        if (!this.data.has(key)) {
            this.data.set(key, loader());
        }
        return this.data.get(key)!;
    }
    
    getData(key: string): any[] {
        return this.data.get(key) || [];
    }
    
    clearData(): void {
        this.data.clear();
    }
}

Given('I initialize test data provider', async function () {
    this.dataProvider = TestDataProvider.getInstance();
    
    // Load various data sets
    this.dataProvider.loadData('users', loadTestUsers);
    this.dataProvider.loadData('products', () => loadCSVData('products.csv'));
});

// Solution 7: Parameterized Data Selection
When('I use test data set {string}', async function (dataSet: string) {
    const dataSets: Record<string, () => any[]> = {
        'valid-users': () => loadTestUsers().filter(u => u.role !== 'guest'),
        'admin-users': () => loadTestUsers().filter(u => u.role === 'admin'),
        'all-products': () => loadCSVData('products.csv'),
        'active-products': () => loadCSVData('products.csv').filter(p => p['status'] === 'active'),
    };
    
    const loader = dataSets[dataSet];
    if (loader) {
        this.currentDataSet = loader();
    } else {
        throw new Error(`Unknown data set: ${dataSet}`);
    }
});

// Solution 8: Data Iteration
When('I iterate through loaded data', async function () {
    for (const item of this.currentDataSet || []) {
        console.log('Processing:', item);
        // Process each item
    }
});

Then('all data items should be processed', async function () {
    expect(this.currentDataSet?.length).toBeGreaterThan(0);
});

// Solution 9: Export
export { loadTestUsers, loadCSVData, loadEnvironmentData, TestDataProvider };

