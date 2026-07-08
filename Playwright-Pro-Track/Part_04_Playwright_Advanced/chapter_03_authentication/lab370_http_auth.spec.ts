/**
 * Lab 370: HTTP Authentication
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * HTTP authentication methods:
 * 
 * - Basic auth
 * - Digest auth
 * - HTTP credentials
 * - Auth headers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use HTTP basic auth
 * 2. Configure credentials
 * 3. Handle auth dialogs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: HTTP Credentials in Context
test('HTTP credentials in context', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'user',
            password: 'pass',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: HTTP Credentials in Config
test('HTTP credentials in config', async ({ page }) => {
    /*
     * playwright.config.ts:
     * 
     * use: {
     *   httpCredentials: {
     *     username: 'user',
     *     password: 'pass',
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Credentials from Environment
test('credentials from environment', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: process.env.HTTP_USER || 'user',
            password: process.env.HTTP_PASS || 'pass',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 4: Origin-Specific Credentials
test('origin specific credentials', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'user',
            password: 'pass',
            origin: 'https://example.com',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Send Credentials Immediately
test('send credentials immediately', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'user',
            password: 'pass',
            send: 'always', // Send without waiting for 401
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Basic Auth in URL
test('basic auth in URL', async ({ page }) => {
    // Note: Not recommended for security reasons
    // await page.goto('https://user:pass@example.com');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Authorization Header
test('authorization header', async ({ page }) => {
    await page.setExtraHTTPHeaders({
        'Authorization': 'Basic ' + Buffer.from('user:pass').toString('base64'),
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Bearer Token Header
test('bearer token header', async ({ page }) => {
    await page.setExtraHTTPHeaders({
        'Authorization': 'Bearer your-token-here',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Custom Auth Header
test('custom auth header', async ({ page }) => {
    await page.setExtraHTTPHeaders({
        'X-API-Key': 'your-api-key',
        'X-Auth-Token': 'your-auth-token',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: HTTP Auth Best Practices
test('HTTP auth best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use environment variables
     * 2. Don't hardcode credentials
     * 3. Use origin-specific credentials
     * 4. Prefer httpCredentials over URL
     * 5. Use secure connections (HTTPS)
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

