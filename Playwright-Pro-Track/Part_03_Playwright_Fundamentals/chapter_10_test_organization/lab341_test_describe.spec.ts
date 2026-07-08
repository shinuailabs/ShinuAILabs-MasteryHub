/**
 * Lab 341: Test Describe Blocks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing tests with describe:
 * 
 * - test.describe()
 * - Nested describes
 * - Describe options
 * - Test grouping
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use describe blocks
 * 2. Nest describes
 * 3. Configure describe options
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Describe
test.describe('Homepage', () => {
    test('should have title', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('should have heading', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 2: Nested Describes
test.describe('Navigation', () => {
    test.describe('Header', () => {
        test('should have logo', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page.locator('nav')).toBeVisible();
        });
    });
    
    test.describe('Footer', () => {
        test('should have links', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page.locator('footer')).toBeVisible();
        });
    });
});

// Solution 3: Describe with Serial Mode
test.describe.serial('Sequential Tests', () => {
    test('first test', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('second test depends on first', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 4: Describe with Parallel Mode
test.describe.parallel('Parallel Tests', () => {
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 5: Describe with Configure
test.describe('Configured Tests', () => {
    test.describe.configure({ mode: 'serial', retries: 2 });
    
    test('test with retries', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 6: Skip Describe
test.describe.skip('Skipped Tests', () => {
    test('this test is skipped', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 7: Only Describe
// test.describe.only('Only These Tests', () => {
//     test('only this runs', async ({ page }) => {
//         await page.goto('https://playwright.dev');
//     });
// });

// Solution 8: Describe with Hooks
test.describe('Tests with Hooks', () => {
    test.beforeAll(async () => {
        console.log('Before all tests in describe');
    });
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test.afterEach(async () => {
        console.log('After each test');
    });
    
    test.afterAll(async () => {
        console.log('After all tests in describe');
    });
    
    test('test 1', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 9: Describe with Annotations
test.describe('Annotated Tests', () => {
    test('slow test', async ({ page }) => {
        test.slow();
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('fixme test', async ({ page }) => {
        test.fixme();
        // This test needs fixing
    });
});

// Solution 10: Describe Best Practices
test.describe('Best Practices', () => {
    /*
     * Best Practices:
     * 1. Group related tests
     * 2. Use meaningful names
     * 3. Keep nesting shallow
     * 4. Use hooks for common setup
     * 5. Use serial for dependent tests
     */
    
    test('example test', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

