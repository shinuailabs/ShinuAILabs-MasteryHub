/**
 * Lab 258: Browser Contexts
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding browser contexts:
 * 
 * - Isolated browser sessions
 * - Multiple contexts
 * - Context options
 * - Use cases
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create browser contexts
 * 2. Use context options
 * 3. Test with multiple contexts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, chromium } from '@playwright/test';

// Solution 1: Default Context
test('default context', async ({ page }) => {
    // Each test gets a fresh context by default
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Creating New Context
test('creating new context', async ({ browser }) => {
    // Create a new context
    const context = await browser.newContext();
    
    // Create a page in the context
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Clean up
    await context.close();
});

// Solution 3: Context with Options
test('context with options', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        locale: 'fr-FR',
        timezoneId: 'Europe/Paris',
        geolocation: { latitude: 48.8566, longitude: 2.3522 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 4: Multiple Contexts (Multi-User Testing)
test('multiple contexts for multi-user', async ({ browser }) => {
    // User 1 context
    const user1Context = await browser.newContext();
    const user1Page = await user1Context.newPage();
    
    // User 2 context
    const user2Context = await browser.newContext();
    const user2Page = await user2Context.newPage();
    
    // Both users navigate independently
    await user1Page.goto('https://playwright.dev');
    await user2Page.goto('https://playwright.dev');
    
    // Contexts are isolated - cookies, storage not shared
    
    await user1Context.close();
    await user2Context.close();
});

// Solution 5: Context with Storage State
test('context with storage state', async ({ browser }) => {
    // Create context with saved state
    const context = await browser.newContext({
        storageState: {
            cookies: [
                {
                    name: 'session',
                    value: 'abc123',
                    domain: 'example.com',
                    path: '/',
                }
            ],
            origins: []
        }
    });
    
    const page = await context.newPage();
    // Page now has the cookie set
    
    await context.close();
});

// Solution 6: Mobile Context
test('mobile context', async ({ browser }) => {
    const iPhone = {
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
    };
    
    const context = await browser.newContext(iPhone);
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 7: Context with HTTP Credentials
test('context with HTTP auth', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'user',
            password: 'pass',
        }
    });
    
    const page = await context.newPage();
    // Will auto-authenticate for HTTP Basic Auth
    
    await context.close();
});

// Solution 8: Incognito-like Context
test('fresh context like incognito', async ({ browser }) => {
    // Each newContext() is like incognito
    // No shared cookies, localStorage, etc.
    
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    // These are completely isolated
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await context1.close();
    await context2.close();
});

// Solution 9: Context Events
test('context events', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Listen for new pages
    context.on('page', page => {
        console.log('New page opened:', page.url());
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 10: Reusing Context Across Tests
test.describe('Shared context tests', () => {
    test.use({
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
    });
    
    test('test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
    
    test('test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

