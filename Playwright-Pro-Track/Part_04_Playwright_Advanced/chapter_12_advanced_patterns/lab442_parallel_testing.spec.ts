/**
 * Lab 442: Parallel Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running tests in parallel:
 * 
 * - Worker processes
 * - Parallel configuration
 * - Test isolation
 * - Resource management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure parallel execution
 * 2. Understand worker isolation
 * 3. Manage shared resources
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Default Parallel Execution
test('parallel test 1', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('parallel test 2', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await expect(page).toHaveTitle(/Installation/);
});

test('parallel test 3', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/api/class-page');
    await expect(page).toHaveTitle(/Page/);
});

// Solution 2: Serial Execution
test.describe.configure({ mode: 'serial' });

test.describe('serial tests', () => {
    test.describe.configure({ mode: 'serial' });
    
    let counter = 0;
    
    test('first serial test', async ({ page }) => {
        counter++;
        expect(counter).toBe(1);
        await page.goto('https://playwright.dev');
    });
    
    test('second serial test', async ({ page }) => {
        counter++;
        expect(counter).toBe(2);
        await page.goto('https://playwright.dev');
    });
});

// Solution 3: Parallel in Describe
test.describe('parallel describe', () => {
    test.describe.configure({ mode: 'parallel' });
    
    test('parallel A', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('parallel B', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 4: Worker Isolation
test.describe('worker isolation', () => {
    // Each worker has its own browser instance
    test('worker test 1', async ({ page, browserName }) => {
        console.log('Browser:', browserName);
        await page.goto('https://playwright.dev');
    });
    
    test('worker test 2', async ({ page, browserName }) => {
        console.log('Browser:', browserName);
        await page.goto('https://playwright.dev');
    });
});

// Solution 5: Limiting Workers
// Configure in playwright.config.ts: workers: 2
test('limited workers test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Fully Parallel Mode
test.describe('fully parallel', () => {
    test.describe.configure({ mode: 'parallel' });
    
    for (let i = 0; i < 5; i++) {
        test(`parallel test ${i}`, async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    }
});

// Solution 7: Test Isolation
test.describe('test isolation', () => {
    test('isolated test 1', async ({ page, context }) => {
        // Each test gets fresh page and context
        await page.goto('https://playwright.dev');
        await context.addCookies([{
            name: 'test1',
            value: 'value1',
            domain: 'playwright.dev',
            path: '/',
        }]);
    });
    
    test('isolated test 2', async ({ context }) => {
        // This test won't see cookies from test 1
        const cookies = await context.cookies();
        const test1Cookie = cookies.find(c => c.name === 'test1');
        expect(test1Cookie).toBeUndefined();
    });
});

// Solution 8: Parallel with Shared Setup
test.describe('shared setup', () => {
    let sharedData: string;
    
    test.beforeAll(async () => {
        // Runs once per worker
        sharedData = `Worker data: ${Date.now()}`;
    });
    
    test('test using shared data 1', async ({ page }) => {
        console.log(sharedData);
        await page.goto('https://playwright.dev');
    });
    
    test('test using shared data 2', async ({ page }) => {
        console.log(sharedData);
        await page.goto('https://playwright.dev');
    });
});

// Solution 9: Retries with Parallel
test.describe('retries with parallel', () => {
    test.describe.configure({ retries: 2 });
    
    test('flaky test', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 10: Parallel Testing Best Practices
test('parallel testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Ensure test isolation
     * 2. Don't share mutable state
     * 3. Use appropriate worker count
     * 4. Handle flaky tests with retries
     * 5. Use serial mode when needed
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

