/**
 * Lab 342: Test Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using test hooks:
 * 
 * - beforeAll / afterAll
 * - beforeEach / afterEach
 * - Hook scope
 * - Hook order
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use test hooks
 * 2. Understand hook scope
 * 3. Handle hook errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: beforeEach Hook
test.describe('beforeEach Hook', () => {
    test.beforeEach(async ({ page }) => {
        // Runs before each test
        await page.goto('https://playwright.dev');
    });
    
    test('test 1', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 2: afterEach Hook
test.describe('afterEach Hook', () => {
    test.afterEach(async ({ page }, testInfo) => {
        // Runs after each test
        console.log(`Test "${testInfo.title}" finished`);
        
        // Take screenshot on failure
        if (testInfo.status !== testInfo.expectedStatus) {
            await page.screenshot({ path: `failure-${testInfo.title}.png` });
        }
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 3: beforeAll Hook
test.describe('beforeAll Hook', () => {
    test.beforeAll(async () => {
        // Runs once before all tests
        console.log('Setting up test suite');
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 4: afterAll Hook
test.describe('afterAll Hook', () => {
    test.afterAll(async () => {
        // Runs once after all tests
        console.log('Cleaning up test suite');
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 5: Multiple Hooks
test.describe('Multiple Hooks', () => {
    test.beforeAll(async () => {
        console.log('1. beforeAll');
    });
    
    test.beforeEach(async ({ page }) => {
        console.log('2. beforeEach');
        await page.goto('https://playwright.dev');
    });
    
    test.afterEach(async () => {
        console.log('4. afterEach');
    });
    
    test.afterAll(async () => {
        console.log('5. afterAll');
    });
    
    test('test', async ({ page }) => {
        console.log('3. test');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 6: Hook with Fixtures
test.describe('Hook with Fixtures', () => {
    test.beforeEach(async ({ page, context }) => {
        // Access fixtures in hooks
        console.log('Browser:', context.browser()?.browserType().name());
        await page.goto('https://playwright.dev');
    });
    
    test('test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 7: Hook with Test Info
test.describe('Hook with Test Info', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log('Running:', testInfo.title);
        console.log('Project:', testInfo.project.name);
        await page.goto('https://playwright.dev');
    });
    
    test('test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 8: Nested Hooks
test.describe('Outer', () => {
    test.beforeEach(async () => {
        console.log('Outer beforeEach');
    });
    
    test.describe('Inner', () => {
        test.beforeEach(async () => {
            console.log('Inner beforeEach');
        });
        
        test('test', async ({ page }) => {
            // Outer beforeEach runs first, then Inner
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
});

// Solution 9: Hook Timeout
test.describe('Hook Timeout', () => {
    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000); // Set timeout for hook
        await page.goto('https://playwright.dev');
    });
    
    test('test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 10: Hook Best Practices
test.describe('Hook Best Practices', () => {
    /*
     * Best Practices:
     * 1. Use beforeEach for common setup
     * 2. Use afterEach for cleanup
     * 3. Use beforeAll for expensive setup
     * 4. Handle errors in hooks
     * 5. Keep hooks focused
     */
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test('test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

