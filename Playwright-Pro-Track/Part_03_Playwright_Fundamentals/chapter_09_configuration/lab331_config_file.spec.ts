/**
 * Lab 331: Configuration File
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Playwright configuration file:
 * 
 * - playwright.config.ts
 * - Configuration options
 * - Project settings
 * - Global settings
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create config file
 * 2. Configure options
 * 3. Set up projects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Config Structure
test('basic config structure', async ({ page }) => {
    /*
     * playwright.config.ts:
     * 
     * import { defineConfig } from '@playwright/test';
     * 
     * export default defineConfig({
     *   testDir: './tests',
     *   timeout: 30000,
     *   retries: 0,
     *   use: {
     *     baseURL: 'https://playwright.dev',
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Test Directory
test('test directory', async ({ page }) => {
    /*
     * Configure test directory:
     * 
     * export default defineConfig({
     *   testDir: './tests',
     *   testMatch: '**\/*.spec.ts',
     *   testIgnore: '**\/skip-*.spec.ts',
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Timeout Configuration
test('timeout configuration', async ({ page }) => {
    /*
     * Configure timeouts:
     * 
     * export default defineConfig({
     *   timeout: 30000, // Test timeout
     *   expect: {
     *     timeout: 5000, // Assertion timeout
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Retries Configuration
test('retries configuration', async ({ page }) => {
    /*
     * Configure retries:
     * 
     * export default defineConfig({
     *   retries: process.env.CI ? 2 : 0,
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Reporter Configuration
test('reporter configuration', async ({ page }) => {
    /*
     * Configure reporters:
     * 
     * export default defineConfig({
     *   reporter: [
     *     ['html'],
     *     ['json', { outputFile: 'results.json' }],
     *     ['junit', { outputFile: 'results.xml' }],
     *   ],
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Use Options
test('use options', async ({ page }) => {
    /*
     * Configure use options:
     * 
     * export default defineConfig({
     *   use: {
     *     baseURL: 'https://playwright.dev',
     *     headless: true,
     *     viewport: { width: 1280, height: 720 },
     *     screenshot: 'only-on-failure',
     *     video: 'retain-on-failure',
     *     trace: 'retain-on-failure',
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Output Directory
test('output directory', async ({ page }) => {
    /*
     * Configure output:
     * 
     * export default defineConfig({
     *   outputDir: 'test-results',
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Parallel Execution
test('parallel execution', async ({ page }) => {
    /*
     * Configure parallelism:
     * 
     * export default defineConfig({
     *   workers: process.env.CI ? 1 : undefined,
     *   fullyParallel: true,
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Global Setup/Teardown
test('global setup teardown', async ({ page }) => {
    /*
     * Configure global setup:
     * 
     * export default defineConfig({
     *   globalSetup: './global-setup.ts',
     *   globalTeardown: './global-teardown.ts',
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Config Best Practices
test('config best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use defineConfig for type safety
     * 2. Use environment variables for CI
     * 3. Configure appropriate timeouts
     * 4. Set up multiple reporters
     * 5. Configure artifacts for debugging
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

