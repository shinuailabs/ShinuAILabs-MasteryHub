/**
 * Lab 347: Parallel Execution
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Parallel test execution:
 * 
 * - Workers configuration
 * - Parallel mode
 * - Serial mode
 * - Isolation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure parallel execution
 * 2. Use serial mode
 * 3. Handle test isolation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Fully Parallel
test.describe.parallel('Parallel Tests', () => {
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
    
    test('test 3', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('nav')).toBeVisible();
    });
});

// Solution 2: Serial Execution
test.describe.serial('Serial Tests', () => {
    test('step 1 - setup', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('step 2 - depends on step 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
    
    test('step 3 - depends on step 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('nav')).toBeVisible();
    });
});

// Solution 3: Configure Mode
test.describe('Configured Mode', () => {
    test.describe.configure({ mode: 'parallel' });
    
    test('parallel test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('parallel test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 4: Workers Configuration
test('workers configuration', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   workers: 4, // Fixed number
     *   // or
     *   workers: '50%', // Percentage of CPUs
     *   // or
     *   workers: process.env.CI ? 1 : undefined, // CI vs local
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Fully Parallel Config
test('fully parallel config', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   fullyParallel: true, // All tests run in parallel
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Test Isolation
test.describe('Test Isolation', () => {
    // Each test gets fresh browser context
    test('isolated test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        // This test's state doesn't affect other tests
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('isolated test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        // Fresh context, no shared state
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 7: Shared State Warning
test.describe('Shared State', () => {
    let sharedData: string;
    
    test.beforeAll(async () => {
        // Shared state - use carefully!
        sharedData = 'shared';
    });
    
    test('test using shared state', async ({ page }) => {
        console.log('Shared data:', sharedData);
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 8: CLI Parallel Options
test('CLI parallel options', async ({ page }) => {
    /*
     * Run with specific workers:
     * npx playwright test --workers=4
     * 
     * Run single worker:
     * npx playwright test --workers=1
     * 
     * Run with percentage:
     * npx playwright test --workers=50%
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Project Parallelism
test('project parallelism', async ({ page }) => {
    /*
     * Projects run in parallel by default
     * Tests within project can be parallel or serial
     * 
     * projects: [
     *   { name: 'chromium' }, // Runs in parallel
     *   { name: 'firefox' },  // with other projects
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Parallel Best Practices
test('parallel best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Design tests for isolation
     * 2. Avoid shared mutable state
     * 3. Use serial for dependent tests
     * 4. Reduce workers in CI
     * 5. Monitor resource usage
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

