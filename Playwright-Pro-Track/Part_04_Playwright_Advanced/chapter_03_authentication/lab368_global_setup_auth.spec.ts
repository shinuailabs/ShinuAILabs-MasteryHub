/**
 * Lab 368: Global Setup Authentication
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Authentication in global setup:
 * 
 * - Login once
 * - Save state
 * - Reuse across tests
 * - Multiple users
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create global setup for auth
 * 2. Save authentication state
 * 3. Use in tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Global Setup File
test('global setup file', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * import { chromium, FullConfig } from '@playwright/test';
     * 
     * async function globalSetup(config: FullConfig) {
     *   const browser = await chromium.launch();
     *   const page = await browser.newPage();
     *   
     *   // Login
     *   await page.goto('https://example.com/login');
     *   await page.fill('#username', 'user');
     *   await page.fill('#password', 'pass');
     *   await page.click('button[type="submit"]');
     *   
     *   // Save state
     *   await page.context().storageState({ path: 'auth.json' });
     *   await browser.close();
     * }
     * 
     * export default globalSetup;
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Config with Global Setup
test('config with global setup', async ({ page }) => {
    /*
     * playwright.config.ts:
     * 
     * export default defineConfig({
     *   globalSetup: require.resolve('./global-setup'),
     *   use: {
     *     storageState: 'auth.json',
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Multiple User Setup
test('multiple user setup', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup(config: FullConfig) {
     *   // Admin user
     *   await loginAndSave('admin', 'adminpass', 'admin-auth.json');
     *   
     *   // Regular user
     *   await loginAndSave('user', 'userpass', 'user-auth.json');
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Project Dependencies
test('project dependencies', async ({ page }) => {
    /*
     * playwright.config.ts:
     * 
     * projects: [
     *   { name: 'setup', testMatch: /global.setup\.ts/ },
     *   {
     *     name: 'chromium',
     *     dependencies: ['setup'],
     *     use: { storageState: 'auth.json' },
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Setup Project
test('setup project', async ({ page }) => {
    /*
     * tests/auth.setup.ts:
     * 
     * import { test as setup } from '@playwright/test';
     * 
     * setup('authenticate', async ({ page }) => {
     *   await page.goto('https://example.com/login');
     *   await page.fill('#username', 'user');
     *   await page.fill('#password', 'pass');
     *   await page.click('button[type="submit"]');
     *   
     *   await page.context().storageState({ path: 'auth.json' });
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Environment-Based Auth
test('environment based auth', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * const username = process.env.TEST_USERNAME;
     * const password = process.env.TEST_PASSWORD;
     * 
     * await page.fill('#username', username);
     * await page.fill('#password', password);
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Auth with API
test('auth with API', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * import { request } from '@playwright/test';
     * 
     * async function globalSetup() {
     *   const context = await request.newContext();
     *   const response = await context.post('/api/login', {
     *     data: { username: 'user', password: 'pass' },
     *   });
     *   const { token } = await response.json();
     *   
     *   // Save token for tests
     *   process.env.AUTH_TOKEN = token;
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Conditional Auth
test('conditional auth', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup() {
     *   if (process.env.SKIP_AUTH) {
     *     return;
     *   }
     *   // Perform authentication
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Auth Validation
test('auth validation', async ({ page }) => {
    /*
     * global-setup.ts:
     * 
     * async function globalSetup() {
     *   // Login
     *   await page.goto('/login');
     *   await page.fill('#username', 'user');
     *   await page.fill('#password', 'pass');
     *   await page.click('button[type="submit"]');
     *   
     *   // Validate login success
     *   await page.waitForURL('/dashboard');
     *   
     *   // Save state
     *   await page.context().storageState({ path: 'auth.json' });
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Global Setup Auth Best Practices
test('global setup auth best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Login once in global setup
     * 2. Use environment variables
     * 3. Validate login success
     * 4. Handle auth failures
     * 5. Support multiple users
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

