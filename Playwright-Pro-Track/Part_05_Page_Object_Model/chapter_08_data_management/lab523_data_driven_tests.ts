/**
 * Lab 523: Data-Driven Tests
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing data-driven tests:
 * 
 * - Parameterized tests
 * - Test data sets
 * - Dynamic test generation
 * - Data providers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create parameterized tests
 * 2. Use data providers
 * 3. Generate dynamic tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, Page } from '@playwright/test';

// Solution 1: Test Data Sets
interface LoginTestCase {
    username: string;
    password: string;
    expectedResult: 'success' | 'failure';
    errorMessage?: string;
}

const loginTestCases: LoginTestCase[] = [
    { username: 'valid_user', password: 'ValidPass123!', expectedResult: 'success' },
    { username: 'invalid_user', password: 'wrong', expectedResult: 'failure', errorMessage: 'Invalid credentials' },
    { username: '', password: 'password', expectedResult: 'failure', errorMessage: 'Username required' },
    { username: 'user', password: '', expectedResult: 'failure', errorMessage: 'Password required' },
];

// Solution 2: Parameterized Tests
for (const testCase of loginTestCases) {
    test(`login with ${testCase.username} - ${testCase.expectedResult}`, async ({ page }) => {
        await page.goto('/login');
        await page.fill('#username', testCase.username);
        await page.fill('#password', testCase.password);
        await page.click('#submit');
        
        if (testCase.expectedResult === 'success') {
            await expect(page).toHaveURL('/dashboard');
        } else {
            await expect(page.locator('.error')).toContainText(testCase.errorMessage!);
        }
    });
}

// Solution 3: Data Provider Pattern
class DataProvider {
    static validUsers() {
        return [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'user1', password: 'user123', role: 'user' },
            { username: 'user2', password: 'user456', role: 'user' },
        ];
    }
    
    static invalidEmails() {
        return [
            'invalid',
            'invalid@',
            '@invalid.com',
            'invalid@.com',
            'invalid@com',
        ];
    }
    
    static searchQueries() {
        return [
            { query: 'laptop', expectedResults: 10 },
            { query: 'phone', expectedResults: 15 },
            { query: 'nonexistent', expectedResults: 0 },
        ];
    }
}

// Solution 4: Using Data Provider
test.describe('Search functionality', () => {
    for (const { query, expectedResults } of DataProvider.searchQueries()) {
        test(`search for "${query}" returns ${expectedResults} results`, async ({ page }) => {
            await page.goto('/search');
            await page.fill('#search-input', query);
            await page.click('#search-btn');
            
            const results = page.locator('.search-result');
            await expect(results).toHaveCount(expectedResults);
        });
    }
});

// Solution 5: Dynamic Test Generation
interface ProductTestData {
    name: string;
    price: number;
    category: string;
}

function generateProductTests(products: ProductTestData[]) {
    for (const product of products) {
        test(`can add ${product.name} to cart`, async ({ page }) => {
            await page.goto(`/products?category=${product.category}`);
            await page.click(`text=${product.name}`);
            await page.click('#add-to-cart');
            
            await expect(page.locator('.cart-count')).toContainText('1');
        });
    }
}

// Solution 6: CSV-Based Data-Driven Tests
class CSVDataProvider {
    static async loadTestCases(filePath: string): Promise<Record<string, string>[]> {
        // Simulated CSV loading
        return [
            { input: 'test1', expected: 'result1' },
            { input: 'test2', expected: 'result2' },
        ];
    }
}

// Solution 7: Test Matrix
const browsers = ['chromium', 'firefox', 'webkit'];
const viewports = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' },
];

// Generate matrix tests
for (const viewport of viewports) {
    test.describe(`${viewport.name} viewport`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });
        
        test('homepage renders correctly', async ({ page }) => {
            await page.goto('/');
            await expect(page.locator('header')).toBeVisible();
        });
    });
}

// Solution 8: Export
export { DataProvider, CSVDataProvider, LoginTestCase, ProductTestData };

