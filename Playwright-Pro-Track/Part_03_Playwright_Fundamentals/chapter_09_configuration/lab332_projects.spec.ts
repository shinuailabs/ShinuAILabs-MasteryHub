/**
 * Lab 332: Projects Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring projects:
 * 
 * - Multiple browsers
 * - Device emulation
 * - Project dependencies
 * - Project-specific settings
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure multiple projects
 * 2. Set up device emulation
 * 3. Configure dependencies
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Multiple Browser Projects
test('multiple browser projects', async ({ page }) => {
    /*
     * Configure multiple browsers:
     * 
     * import { devices } from '@playwright/test';
     * 
     * export default defineConfig({
     *   projects: [
     *     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     *     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
     *     { name: 'webkit', use: { ...devices['Desktop Safari'] } },
     *   ],
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Mobile Device Projects
test('mobile device projects', async ({ page }) => {
    /*
     * Configure mobile devices:
     * 
     * projects: [
     *   { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
     *   { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Project-Specific Settings
test('project specific settings', async ({ page }) => {
    /*
     * Project-specific configuration:
     * 
     * projects: [
     *   {
     *     name: 'chromium',
     *     use: {
     *       ...devices['Desktop Chrome'],
     *       screenshot: 'on',
     *       video: 'on',
     *     },
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Project Dependencies
test('project dependencies', async ({ page }) => {
    /*
     * Configure dependencies:
     * 
     * projects: [
     *   { name: 'setup', testMatch: /global.setup\.ts/ },
     *   {
     *     name: 'chromium',
     *     dependencies: ['setup'],
     *     use: { ...devices['Desktop Chrome'] },
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Project Test Directory
test('project test directory', async ({ page }) => {
    /*
     * Project-specific test directory:
     * 
     * projects: [
     *   {
     *     name: 'smoke',
     *     testDir: './tests/smoke',
     *   },
     *   {
     *     name: 'regression',
     *     testDir: './tests/regression',
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Project Timeout
test('project timeout', async ({ page }) => {
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

// Solution 7: Project Retries
test('project retries', async ({ page }) => {
    /*
     * Project-specific retries:
     * 
     * projects: [
     *   {
     *     name: 'stable',
     *     retries: 0,
     *   },
     *   {
     *     name: 'flaky',
     *     retries: 3,
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Run Specific Project
test('run specific project', async ({ page }) => {
    /*
     * Run specific project:
     * npx playwright test --project=chromium
     * 
     * Run multiple projects:
     * npx playwright test --project=chromium --project=firefox
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Project Grep
test('project grep', async ({ page }) => {
    /*
     * Project-specific test filter:
     * 
     * projects: [
     *   {
     *     name: 'smoke',
     *     grep: /@smoke/,
     *   },
     *   {
     *     name: 'regression',
     *     grepInvert: /@smoke/,
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Projects Best Practices
test('projects best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test on multiple browsers
     * 2. Include mobile devices
     * 3. Use dependencies for setup
     * 4. Separate smoke and regression
     * 5. Configure appropriate timeouts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

