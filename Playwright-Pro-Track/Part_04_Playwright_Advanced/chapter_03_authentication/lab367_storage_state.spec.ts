/**
 * Lab 367: Storage State
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using storage state for auth:
 * 
 * - Save storage state
 * - Load storage state
 * - Cookies and localStorage
 * - Session management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Save storage state
 * 2. Load storage state
 * 3. Manage sessions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Save Storage State
test('save storage state', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // After login, save storage state
    await context.storageState({ path: 'auth.json' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Load Storage State
test('load storage state', async ({ browser }) => {
    // Create context with saved state
    const context = await browser.newContext({
        storageState: 'auth.json',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 3: Config-Based Storage State
test('config based storage state', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * use: {
     *   storageState: 'auth.json',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Project-Specific Storage State
test('project specific storage state', async ({ page }) => {
    /*
     * projects: [
     *   {
     *     name: 'logged-in',
     *     use: { storageState: 'auth.json' },
     *   },
     *   {
     *     name: 'logged-out',
     *     use: { storageState: undefined },
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Get Cookies
test('get cookies', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    const cookies = await context.cookies();
    console.log('Cookies:', cookies);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Set Cookies
test('set cookies', async ({ page, context }) => {
    await context.addCookies([
        {
            name: 'session',
            value: 'abc123',
            domain: 'playwright.dev',
            path: '/',
        },
    ]);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Clear Cookies
test('clear cookies', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Clear all cookies
    await context.clearCookies();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Local Storage
test('local storage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set localStorage
    await page.evaluate(() => {
        localStorage.setItem('token', 'abc123');
        localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }));
    });
    
    // Get localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('Token:', token);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Session Storage
test('session storage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set sessionStorage
    await page.evaluate(() => {
        sessionStorage.setItem('tempData', 'value');
    });
    
    // Get sessionStorage
    const data = await page.evaluate(() => sessionStorage.getItem('tempData'));
    console.log('Session data:', data);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Storage State Best Practices
test('storage state best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Save state after login
     * 2. Use in global setup
     * 3. Separate states for roles
     * 4. Don't commit auth files
     * 5. Refresh state periodically
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

