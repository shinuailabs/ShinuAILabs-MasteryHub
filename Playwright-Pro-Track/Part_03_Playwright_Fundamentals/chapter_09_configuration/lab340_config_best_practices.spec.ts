/**
 * Lab 340: Configuration Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for configuration:
 * 
 * - Organization
 * - Environment handling
 * - CI/CD configuration
 * - Maintenance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply configuration best practices
 * 2. Organize configuration
 * 3. Handle environments
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Use defineConfig
test('use defineConfig', async ({ page }) => {
    /*
     * Always use defineConfig for type safety:
     * 
     * import { defineConfig } from '@playwright/test';
     * 
     * export default defineConfig({
     *   // Configuration with IntelliSense
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Environment-Based Configuration
test('environment based configuration', async ({ page }) => {
    /*
     * export default defineConfig({
     *   retries: process.env.CI ? 2 : 0,
     *   workers: process.env.CI ? 1 : undefined,
     *   reporter: process.env.CI
     *     ? [['github'], ['html']]
     *     : [['list'], ['html']],
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Sensible Defaults
test('sensible defaults', async ({ page }) => {
    /*
     * export default defineConfig({
     *   timeout: 30000,
     *   expect: { timeout: 5000 },
     *   use: {
     *     actionTimeout: 10000,
     *     navigationTimeout: 30000,
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Artifact Configuration
test('artifact configuration', async ({ page }) => {
    /*
     * use: {
     *   screenshot: 'only-on-failure',
     *   video: 'retain-on-failure',
     *   trace: 'retain-on-failure',
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Project Organization
test('project organization', async ({ page }) => {
    /*
     * projects: [
     *   // Setup project
     *   { name: 'setup', testMatch: /global.setup\.ts/ },
     *   
     *   // Browser projects
     *   { name: 'chromium', dependencies: ['setup'], use: { ...devices['Desktop Chrome'] } },
     *   { name: 'firefox', dependencies: ['setup'], use: { ...devices['Desktop Firefox'] } },
     *   
     *   // Mobile projects
     *   { name: 'mobile', use: { ...devices['iPhone 12'] } },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Reporter Configuration
test('reporter configuration', async ({ page }) => {
    /*
     * reporter: [
     *   ['list'],
     *   ['html', { open: 'never' }],
     *   ['json', { outputFile: 'test-results/results.json' }],
     *   ['junit', { outputFile: 'test-results/results.xml' }],
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Web Server Configuration
test('web server configuration', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   url: 'http://localhost:3000',
     *   reuseExistingServer: !process.env.CI,
     *   timeout: 120000,
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Global Setup
test('global setup', async ({ page }) => {
    /*
     * globalSetup: require.resolve('./global-setup'),
     * globalTeardown: require.resolve('./global-teardown'),
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Test Organization
test('test organization', async ({ page }) => {
    /*
     * testDir: './tests',
     * testMatch: '**\/*.spec.ts',
     * testIgnore: ['**\/fixtures/**', '**\/helpers/**'],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Complete Configuration Example
test('complete configuration example', async ({ page }) => {
    /*
     * import { defineConfig, devices } from '@playwright/test';
     * 
     * export default defineConfig({
     *   testDir: './tests',
     *   timeout: 30000,
     *   expect: { timeout: 5000 },
     *   fullyParallel: true,
     *   forbidOnly: !!process.env.CI,
     *   retries: process.env.CI ? 2 : 0,
     *   workers: process.env.CI ? 1 : undefined,
     *   reporter: [['html'], ['list']],
     *   
     *   use: {
     *     baseURL: process.env.BASE_URL || 'http://localhost:3000',
     *     trace: 'retain-on-failure',
     *     screenshot: 'only-on-failure',
     *     video: 'retain-on-failure',
     *   },
     *   
     *   projects: [
     *     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     *     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
     *     { name: 'webkit', use: { ...devices['Desktop Safari'] } },
     *   ],
     *   
     *   webServer: {
     *     command: 'npm run start',
     *     url: 'http://localhost:3000',
     *     reuseExistingServer: !process.env.CI,
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

