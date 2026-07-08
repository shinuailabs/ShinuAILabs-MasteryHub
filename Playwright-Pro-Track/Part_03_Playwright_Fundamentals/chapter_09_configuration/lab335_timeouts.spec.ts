/**
 * Lab 335: Timeouts Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring timeouts:
 * 
 * - Test timeout
 * - Action timeout
 * - Assertion timeout
 * - Navigation timeout
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure timeouts
 * 2. Override timeouts
 * 3. Handle timeout errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Test Timeout
test('test timeout', async ({ page }) => {
    /*
     * Configure test timeout:
     * 
     * export default defineConfig({
     *   timeout: 30000, // 30 seconds
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Override Test Timeout
test('override test timeout', async ({ page }) => {
    // Override timeout for this test
    test.setTimeout(60000); // 60 seconds
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Slow Test
test.slow('slow test', async ({ page }) => {
    // Triples the default timeout
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Assertion Timeout
test('assertion timeout', async ({ page }) => {
    /*
     * Configure assertion timeout:
     * 
     * export default defineConfig({
     *   expect: {
     *     timeout: 5000, // 5 seconds
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    
    // Override for specific assertion
    await expect(page).toHaveTitle(/Playwright/, { timeout: 10000 });
});

// Solution 5: Action Timeout
test('action timeout', async ({ page }) => {
    /*
     * Configure action timeout:
     * 
     * use: {
     *   actionTimeout: 10000, // 10 seconds
     * }
     */
    
    await page.goto('https://playwright.dev');
    
    // Override for specific action
    await page.getByRole('link', { name: 'Get started' }).click({ timeout: 5000 });
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: Navigation Timeout
test('navigation timeout', async ({ page }) => {
    /*
     * Configure navigation timeout:
     * 
     * use: {
     *   navigationTimeout: 30000, // 30 seconds
     * }
     */
    
    // Override for specific navigation
    await page.goto('https://playwright.dev', { timeout: 60000 });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Global Timeout
test('global timeout', async ({ page }) => {
    /*
     * Configure global timeout:
     * 
     * export default defineConfig({
     *   globalTimeout: 600000, // 10 minutes for all tests
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Timeout Per Project
test('timeout per project', async ({ page }) => {
    /*
     * Project-specific timeout:
     * 
     * projects: [
     *   {
     *     name: 'fast',
     *     timeout: 10000,
     *   },
     *   {
     *     name: 'slow',
     *     timeout: 60000,
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Timeout in Hooks
test.beforeEach(async ({ page }) => {
    // Set timeout for hook
    test.setTimeout(10000);
    await page.goto('https://playwright.dev');
});

test('timeout in hooks', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Timeout Best Practices
test('timeout best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Set reasonable default timeout
     * 2. Use test.slow() for known slow tests
     * 3. Override timeout for specific actions
     * 4. Don't set timeouts too high
     * 5. Investigate timeout failures
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

