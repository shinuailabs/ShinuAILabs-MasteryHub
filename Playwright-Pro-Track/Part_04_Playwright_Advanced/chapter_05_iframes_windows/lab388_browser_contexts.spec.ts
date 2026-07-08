/**
 * Lab 388: Browser Contexts
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with browser contexts:
 * 
 * - Context isolation
 * - Multiple contexts
 * - Context options
 * - Context sharing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create isolated contexts
 * 2. Configure context options
 * 3. Share data between contexts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Create New Context
test('create new context', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 2: Context with Options
test('context with options', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Custom User Agent',
        locale: 'en-US',
        timezoneId: 'America/New_York',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 3: Isolated Contexts
test('isolated contexts', async ({ browser }) => {
    // Context 1
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    // Context 2 - completely isolated
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Cookies/storage are isolated
    await context1.addCookies([{
        name: 'test',
        value: 'context1',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    const cookies1 = await context1.cookies();
    const cookies2 = await context2.cookies();
    
    expect(cookies1.length).toBeGreaterThan(cookies2.length);
    
    await context1.close();
    await context2.close();
});

// Solution 4: Context with Geolocation
test('context with geolocation', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Context with Proxy
test('context with proxy', async ({ browser }) => {
    /*
     * const context = await browser.newContext({
     *     proxy: {
     *         server: 'http://proxy.example.com:8080',
     *         username: 'user',
     *         password: 'pass',
     *     },
     * });
     */
    
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Context with Extra Headers
test('context with extra headers', async ({ browser }) => {
    const context = await browser.newContext({
        extraHTTPHeaders: {
            'X-Custom-Header': 'custom-value',
            'Accept-Language': 'en-US',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Context with Offline Mode
test('context with offline mode', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Go offline
    await context.setOffline(true);
    
    // Go back online
    await context.setOffline(false);
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Multiple Pages in Context
test('multiple pages in context', async ({ browser }) => {
    const context = await browser.newContext();
    
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    await page3.goto('https://playwright.dev/docs/api/class-page');
    
    // All pages share cookies/storage
    expect(context.pages().length).toBe(3);
    
    await context.close();
});

// Solution 9: Context Events
test('context events', async ({ browser }) => {
    const context = await browser.newContext();
    
    context.on('page', page => {
        console.log('New page created:', page.url());
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 10: Context Best Practices
test('context best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use contexts for isolation
     * 2. Close contexts after use
     * 3. Configure options at creation
     * 4. Use for multi-user tests
     * 5. Share browser, isolate contexts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

