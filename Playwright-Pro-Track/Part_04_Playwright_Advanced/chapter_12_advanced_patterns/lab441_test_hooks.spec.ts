/**
 * Lab 441: Test Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding test hooks:
 * 
 * - beforeAll / afterAll
 * - beforeEach / afterEach
 * - Hook scopes
 * - Hook ordering
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use test hooks
 * 2. Understand hook scopes
 * 3. Manage test lifecycle
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: beforeEach Hook
test.describe('beforeEach example', () => {
    test.beforeEach(async ({ page }) => {
        console.log('Running before each test');
        await page.goto('https://playwright.dev');
    });
    
    test('first test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('second test', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });
});

// Solution 2: afterEach Hook
test.describe('afterEach example', () => {
    test.afterEach(async ({ page }) => {
        console.log('Running after each test');
        // Cleanup actions
    });
    
    test('test with cleanup', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 3: beforeAll Hook
test.describe('beforeAll example', () => {
    let sharedData: string;
    
    test.beforeAll(async () => {
        console.log('Running once before all tests');
        sharedData = 'Shared setup data';
    });
    
    test('first test uses shared data', async ({ page }) => {
        expect(sharedData).toBe('Shared setup data');
        await page.goto('https://playwright.dev');
    });
    
    test('second test uses shared data', async ({ page }) => {
        expect(sharedData).toBe('Shared setup data');
        await page.goto('https://playwright.dev');
    });
});

// Solution 4: afterAll Hook
test.describe('afterAll example', () => {
    const resources: string[] = [];
    
    test.beforeEach(async () => {
        resources.push('resource');
    });
    
    test.afterAll(async () => {
        console.log('Cleaning up all resources');
        resources.length = 0;
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 5: Nested Hooks
test.describe('outer describe', () => {
    test.beforeEach(async () => {
        console.log('Outer beforeEach');
    });
    
    test.describe('inner describe', () => {
        test.beforeEach(async () => {
            console.log('Inner beforeEach');
        });
        
        test('nested test', async ({ page }) => {
            // Both outer and inner beforeEach run
            await page.goto('https://playwright.dev');
        });
    });
});

// Solution 6: Hook with Fixtures
test.describe('hooks with fixtures', () => {
    test.beforeEach(async ({ page, context }) => {
        // Access fixtures in hooks
        await context.addCookies([{
            name: 'test',
            value: 'value',
            domain: 'playwright.dev',
            path: '/',
        }]);
        await page.goto('https://playwright.dev');
    });
    
    test('test with cookie', async ({ context }) => {
        const cookies = await context.cookies();
        expect(cookies.some(c => c.name === 'test')).toBeTruthy();
    });
});

// Solution 7: Conditional Hooks
test.describe('conditional hooks', () => {
    const shouldSetup = true;
    
    test.beforeEach(async ({ page }) => {
        if (shouldSetup) {
            await page.goto('https://playwright.dev');
        }
    });
    
    test('conditional setup test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 8: Error Handling in Hooks
test.describe('error handling in hooks', () => {
    test.beforeEach(async ({ page }) => {
        try {
            await page.goto('https://playwright.dev');
        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    });
    
    test('test with error handling', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 9: Hook Execution Order
test.describe('hook execution order', () => {
    test.beforeAll(async () => {
        console.log('1. beforeAll');
    });
    
    test.beforeEach(async () => {
        console.log('2. beforeEach');
    });
    
    test.afterEach(async () => {
        console.log('4. afterEach');
    });
    
    test.afterAll(async () => {
        console.log('5. afterAll');
    });
    
    test('test execution', async ({ page }) => {
        console.log('3. Test body');
        await page.goto('https://playwright.dev');
    });
});

// Solution 10: Hook Best Practices
test.describe('hook best practices', () => {
    /*
     * Best Practices:
     * 1. Use beforeAll for expensive setup
     * 2. Use beforeEach for test isolation
     * 3. Always clean up in afterEach/afterAll
     * 4. Keep hooks focused
     * 5. Handle errors properly
     */
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test('best practices test', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

