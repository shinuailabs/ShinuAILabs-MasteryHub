/**
 * Lab 259: Test Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test hooks for setup/teardown:
 * 
 * - beforeAll / afterAll
 * - beforeEach / afterEach
 * - Hook scope
 * - Async hooks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use different hooks
 * 2. Understand hook scope
 * 3. Share state between hooks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: beforeEach Hook
test.describe('beforeEach Example', () => {
    test.beforeEach(async ({ page }) => {
        // Runs before EACH test
        console.log('Setting up test...');
        await page.goto('https://playwright.dev');
    });
    
    test('test 1', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await expect(page).toHaveURL('https://playwright.dev/');
    });
});

// Solution 2: afterEach Hook
test.describe('afterEach Example', () => {
    test.afterEach(async ({ page }) => {
        // Runs after EACH test
        console.log('Cleaning up test...');
        // Could clear cookies, reset state, etc.
    });
    
    test('test with cleanup', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 3: beforeAll Hook
test.describe('beforeAll Example', () => {
    test.beforeAll(async () => {
        // Runs ONCE before all tests in describe block
        console.log('One-time setup...');
        // Good for: database setup, API setup, etc.
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 4: afterAll Hook
test.describe('afterAll Example', () => {
    test.afterAll(async () => {
        // Runs ONCE after all tests in describe block
        console.log('One-time cleanup...');
        // Good for: database cleanup, closing connections
    });
    
    test('test with final cleanup', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 5: Combined Hooks
test.describe('All Hooks Combined', () => {
    test.beforeAll(async () => {
        console.log('1. beforeAll - runs once at start');
    });
    
    test.beforeEach(async ({ page }) => {
        console.log('2. beforeEach - runs before each test');
        await page.goto('https://playwright.dev');
    });
    
    test.afterEach(async () => {
        console.log('4. afterEach - runs after each test');
    });
    
    test.afterAll(async () => {
        console.log('5. afterAll - runs once at end');
    });
    
    test('test execution', async ({ page }) => {
        console.log('3. Test running...');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 6: Nested Describe Hooks
test.describe('Outer describe', () => {
    test.beforeEach(async ({ page }) => {
        console.log('Outer beforeEach');
    });
    
    test.describe('Inner describe', () => {
        test.beforeEach(async ({ page }) => {
            console.log('Inner beforeEach');
        });
        
        test('nested test', async ({ page }) => {
            // Both outer and inner beforeEach run
            await page.goto('https://playwright.dev');
        });
    });
});

// Solution 7: Sharing State with Hooks
test.describe('Sharing State', () => {
    let sharedData: string;
    
    test.beforeAll(async () => {
        // Setup shared data
        sharedData = 'Shared value';
    });
    
    test('access shared data', async ({ page }) => {
        console.log('Shared data:', sharedData);
        expect(sharedData).toBe('Shared value');
    });
});

// Solution 8: Async Hooks
test.describe('Async Hooks', () => {
    test.beforeEach(async ({ page }) => {
        // Can use async/await
        await page.goto('https://playwright.dev');
        
        // Wait for specific element
        await page.waitForSelector('h1');
    });
    
    test('page is ready', async ({ page }) => {
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });
});

// Solution 9: Hook with Test Info
test.describe('Hook with Test Info', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running: ${testInfo.title}`);
        console.log(`File: ${testInfo.file}`);
    });
    
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status === 'failed') {
            console.log(`Test failed: ${testInfo.title}`);
        }
    });
    
    test('test with info', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 10: Conditional Hooks
test.describe('Conditional Hooks', () => {
    test.beforeEach(async ({ page, browserName }) => {
        if (browserName === 'chromium') {
            console.log('Chrome-specific setup');
        }
        await page.goto('https://playwright.dev');
    });
    
    test('browser-specific test', async ({ page, browserName }) => {
        console.log(`Running on ${browserName}`);
    });
});

