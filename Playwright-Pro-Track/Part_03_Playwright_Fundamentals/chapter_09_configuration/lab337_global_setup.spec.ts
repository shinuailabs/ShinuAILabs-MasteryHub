/**
 * Lab 337: Global Setup and Teardown
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Global setup and teardown:
 * 
 * - globalSetup
 * - globalTeardown
 * - Shared state
 * - Authentication setup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create global setup
 * 2. Create global teardown
 * 3. Share state between tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Global Setup Configuration
test('global setup configuration', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   globalSetup: './global-setup.ts',
     *   globalTeardown: './global-teardown.ts',
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Global Setup File
test('global setup file', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * import { FullConfig } from '@playwright/test';
     * 
     * async function globalSetup(config: FullConfig) {
     *   console.log('Running global setup');
     *   // Setup code here
     * }
     * 
     * export default globalSetup;
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Global Teardown File
test('global teardown file', async ({ page }) => {
    /*
     * global-teardown.ts:
     * 
     * import { FullConfig } from '@playwright/test';
     * 
     * async function globalTeardown(config: FullConfig) {
     *   console.log('Running global teardown');
     *   // Cleanup code here
     * }
     * 
     * export default globalTeardown;
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Authentication Setup
test('authentication setup', async ({ page }) => {
    /*
     * global-setup.ts for auth:
     * 
     * import { chromium, FullConfig } from '@playwright/test';
     * 
     * async function globalSetup(config: FullConfig) {
     *   const browser = await chromium.launch();
     *   const page = await browser.newPage();
     *   
     *   await page.goto('https://example.com/login');
     *   await page.fill('#username', 'user');
     *   await page.fill('#password', 'pass');
     *   await page.click('button[type="submit"]');
     *   
     *   await page.context().storageState({ path: 'auth.json' });
     *   await browser.close();
     * }
     * 
     * export default globalSetup;
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Use Storage State
test('use storage state', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * use: {
     *   storageState: 'auth.json',
     * }
     * 
     * Tests will use saved authentication
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Environment Variables in Setup
test('environment variables in setup', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup(config: FullConfig) {
     *   process.env.TEST_START_TIME = Date.now().toString();
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Database Setup
test('database setup', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup(config: FullConfig) {
     *   // Seed database
     *   await seedDatabase();
     *   
     *   // Create test data
     *   await createTestUsers();
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Server Setup
test('server setup', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup(config: FullConfig) {
     *   // Start server
     *   const server = await startServer();
     *   process.env.SERVER_PORT = server.port.toString();
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Cleanup in Teardown
test('cleanup in teardown', async ({ page }) => {
    /*
     * global-teardown.ts:
     * 
     * async function globalTeardown(config: FullConfig) {
     *   // Clean up test data
     *   await cleanupDatabase();
     *   
     *   // Stop server
     *   await stopServer();
     *   
     *   // Remove temp files
     *   await removeTempFiles();
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Global Setup Best Practices
test('global setup best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Keep setup fast
     * 2. Handle errors gracefully
     * 3. Clean up in teardown
     * 4. Use for authentication
     * 5. Use for database seeding
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

