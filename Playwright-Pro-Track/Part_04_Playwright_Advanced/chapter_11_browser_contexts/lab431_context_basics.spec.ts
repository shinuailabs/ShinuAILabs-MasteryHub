/**
 * Lab 431: Browser Context Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding browser contexts:
 * 
 * - What is a browser context
 * - Context isolation
 * - Creating contexts
 * - Context options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create browser contexts
 * 2. Understand isolation
 * 3. Configure context options
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Default Context
test('default context', async ({ page, context }) => {
    // Each test gets a fresh context by default
    await page.goto('https://playwright.dev');
    
    console.log('Context pages:', context.pages().length);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Creating New Context
test('creating new context', async ({ browser }) => {
    // Create a new isolated context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Clean up
    await context.close();
});

// Solution 3: Multiple Contexts
test('multiple contexts', async ({ browser }) => {
    // Create two isolated contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Contexts are isolated - cookies, storage, etc. are separate
    console.log('Context 1 pages:', context1.pages().length);
    console.log('Context 2 pages:', context2.pages().length);
    
    await context1.close();
    await context2.close();
});

// Solution 4: Context with Viewport
test('context with viewport', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
    expect(viewport?.height).toBe(1080);
    
    await context.close();
});

// Solution 5: Context with User Agent
test('context with user agent', async ({ browser }) => {
    const customUserAgent = 'Custom User Agent String';
    
    const context = await browser.newContext({
        userAgent: customUserAgent,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toBe(customUserAgent);
    
    await context.close();
});

// Solution 6: Context with Locale
test('context with locale', async ({ browser }) => {
    const context = await browser.newContext({
        locale: 'de-DE',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const locale = await page.evaluate(() => navigator.language);
    expect(locale).toBe('de-DE');
    
    await context.close();
});

// Solution 7: Context with Timezone
test('context with timezone', async ({ browser }) => {
    const context = await browser.newContext({
        timezoneId: 'Europe/Paris',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const timezone = await page.evaluate(() => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    
    expect(timezone).toBe('Europe/Paris');
    
    await context.close();
});

// Solution 8: Context with Geolocation
test('context with geolocation', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 48.8566, longitude: 2.3522 }, // Paris
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const position = await page.evaluate(() => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => resolve(null)
            );
        });
    });
    
    console.log('Geolocation:', position);
    
    await context.close();
});

// Solution 9: Context with Color Scheme
test('context with color scheme', async ({ browser }) => {
    const context = await browser.newContext({
        colorScheme: 'dark',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const isDarkMode = await page.evaluate(() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    expect(isDarkMode).toBeTruthy();
    
    await context.close();
});

// Solution 10: Context Basics Best Practices
test('context basics best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use fresh contexts for isolation
     * 2. Configure viewport for consistency
     * 3. Set locale and timezone as needed
     * 4. Clean up contexts after use
     * 5. Use context options for test scenarios
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

