/**
 * Lab 254: Playwright Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring Playwright:
 * 
 * - playwright.config.ts options
 * - Browser configuration
 * - Test settings
 * - Reporter setup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure test settings
 * 2. Set up browsers
 * 3. Configure reporters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

/*
 * Solution 1: Basic Configuration
 * 
 * // playwright.config.ts
 * import { defineConfig } from '@playwright/test';
 * 
 * export default defineConfig({
 *     testDir: './tests',
 *     fullyParallel: true,
 *     forbidOnly: !!process.env.CI,
 *     retries: process.env.CI ? 2 : 0,
 *     workers: process.env.CI ? 1 : undefined,
 *     reporter: 'html',
 * });
 */

/*
 * Solution 2: Use Options
 * 
 * use: {
 *     baseURL: 'http://localhost:3000',
 *     trace: 'on-first-retry',
 *     screenshot: 'only-on-failure',
 *     video: 'retain-on-failure',
 *     headless: true,
 *     viewport: { width: 1280, height: 720 },
 *     ignoreHTTPSErrors: true,
 *     locale: 'en-US',
 *     timezoneId: 'America/New_York',
 * }
 */

/*
 * Solution 3: Browser Projects
 * 
 * projects: [
 *     {
 *         name: 'chromium',
 *         use: { ...devices['Desktop Chrome'] },
 *     },
 *     {
 *         name: 'firefox',
 *         use: { ...devices['Desktop Firefox'] },
 *     },
 *     {
 *         name: 'webkit',
 *         use: { ...devices['Desktop Safari'] },
 *     },
 *     {
 *         name: 'Mobile Chrome',
 *         use: { ...devices['Pixel 5'] },
 *     },
 *     {
 *         name: 'Mobile Safari',
 *         use: { ...devices['iPhone 12'] },
 *     },
 * ]
 */

// Solution 4: Using Configuration in Tests
test('configuration is applied', async ({ page, baseURL }) => {
    // baseURL from config is available
    console.log('Base URL:', baseURL);
    
    // Navigate using relative path (uses baseURL)
    // await page.goto('/login');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

/*
 * Solution 5: Timeout Configuration
 * 
 * // Global timeout
 * timeout: 30000,
 * 
 * // Expect timeout
 * expect: {
 *     timeout: 5000,
 * },
 * 
 * // Action timeout
 * use: {
 *     actionTimeout: 10000,
 *     navigationTimeout: 30000,
 * }
 */

/*
 * Solution 6: Reporter Configuration
 * 
 * reporter: [
 *     ['list'],
 *     ['html', { open: 'never' }],
 *     ['json', { outputFile: 'results.json' }],
 *     ['junit', { outputFile: 'results.xml' }],
 * ]
 */

/*
 * Solution 7: Web Server Configuration
 * 
 * webServer: {
 *     command: 'npm run start',
 *     url: 'http://localhost:3000',
 *     reuseExistingServer: !process.env.CI,
 *     timeout: 120000,
 * }
 */

/*
 * Solution 8: Global Setup/Teardown
 * 
 * globalSetup: require.resolve('./global-setup'),
 * globalTeardown: require.resolve('./global-teardown'),
 * 
 * // global-setup.ts
 * async function globalSetup() {
 *     // Setup database, start services, etc.
 * }
 * export default globalSetup;
 */

// Solution 9: Test-Specific Configuration
test.describe('Custom Configuration', () => {
    test.use({
        viewport: { width: 1920, height: 1080 },
        locale: 'fr-FR',
    });
    
    test('uses custom viewport', async ({ page }) => {
        const viewport = page.viewportSize();
        expect(viewport?.width).toBe(1920);
    });
});

/*
 * Solution 10: Complete Configuration Example
 * 
 * import { defineConfig, devices } from '@playwright/test';
 * 
 * export default defineConfig({
 *     testDir: './tests',
 *     fullyParallel: true,
 *     forbidOnly: !!process.env.CI,
 *     retries: process.env.CI ? 2 : 0,
 *     workers: process.env.CI ? 1 : undefined,
 *     reporter: [['html'], ['list']],
 *     
 *     use: {
 *         baseURL: 'http://localhost:3000',
 *         trace: 'on-first-retry',
 *         screenshot: 'only-on-failure',
 *     },
 *     
 *     projects: [
 *         { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
 *         { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
 *     ],
 *     
 *     webServer: {
 *         command: 'npm run start',
 *         url: 'http://localhost:3000',
 *     },
 * });
 */

