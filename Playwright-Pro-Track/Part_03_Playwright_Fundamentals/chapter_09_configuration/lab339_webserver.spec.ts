/**
 * Lab 339: Web Server Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring web server:
 * 
 * - webServer option
 * - Start command
 * - Port and URL
 * - Reuse server
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure web server
 * 2. Set up server options
 * 3. Handle server lifecycle
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Web Server
test('basic web server', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Web Server with URL
test('web server with URL', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   url: 'http://localhost:3000',
     *   reuseExistingServer: !process.env.CI,
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Reuse Existing Server
test('reuse existing server', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     *   reuseExistingServer: true, // Don't start if already running
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Server Timeout
test('server timeout', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     *   timeout: 120000, // 2 minutes to start
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Server Environment
test('server environment', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     *   env: {
     *     NODE_ENV: 'test',
     *     DATABASE_URL: 'test-db',
     *   },
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Server Working Directory
test('server working directory', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     *   cwd: './frontend', // Working directory
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Multiple Servers
test('multiple servers', async ({ page }) => {
    /*
     * webServer: [
     *   {
     *     command: 'npm run start:frontend',
     *     port: 3000,
     *   },
     *   {
     *     command: 'npm run start:backend',
     *     port: 4000,
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Server with Base URL
test('server with base URL', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     * },
     * use: {
     *   baseURL: 'http://localhost:3000',
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Server Stdout
test('server stdout', async ({ page }) => {
    /*
     * webServer: {
     *   command: 'npm run start',
     *   port: 3000,
     *   stdout: 'pipe', // 'pipe' | 'ignore'
     *   stderr: 'pipe',
     * },
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Web Server Best Practices
test('web server best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use reuseExistingServer for local dev
     * 2. Set appropriate timeout
     * 3. Use environment variables
     * 4. Configure baseURL
     * 5. Handle multiple servers
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

