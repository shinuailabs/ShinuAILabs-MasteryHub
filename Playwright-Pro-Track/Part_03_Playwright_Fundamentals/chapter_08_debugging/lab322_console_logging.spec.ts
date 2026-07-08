/**
 * Lab 322: Console Logging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Logging for debugging:
 * 
 * - Console output
 * - Browser console
 * - Custom logging
 * - Log levels
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use console logging
 * 2. Capture browser console
 * 3. Create custom loggers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Console Log
test('basic console log', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Log test progress
    console.log('Page loaded');
    console.log('URL:', page.url());
    
    await expect(page).toHaveTitle(/Playwright/);
    console.log('Test passed');
});

// Solution 2: Log Page Info
test('log page info', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Log page information
    console.log('URL:', page.url());
    console.log('Title:', await page.title());
    console.log('Viewport:', page.viewportSize());
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Log Element Info
test('log element info', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Log element information
    console.log('Heading visible:', await heading.isVisible());
    console.log('Heading text:', await heading.textContent());
    console.log('Heading count:', await heading.count());
    
    await expect(heading).toBeVisible();
});

// Solution 4: Capture Browser Console
test('capture browser console', async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
        console.log(`Browser [${msg.type()}]: ${msg.text()}`);
    });
    
    await page.goto('https://playwright.dev');
    
    // Trigger console message
    await page.evaluate(() => {
        console.log('Hello from browser');
        console.warn('Warning message');
        console.error('Error message');
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Filter Console Messages
test('filter console messages', async ({ page }) => {
    // Capture only errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Browser error:', msg.text());
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Log Network Requests
test('log network requests', async ({ page }) => {
    // Log requests
    page.on('request', request => {
        console.log(`>> ${request.method()} ${request.url()}`);
    });
    
    // Log responses
    page.on('response', response => {
        console.log(`<< ${response.status()} ${response.url()}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Log Page Errors
test('log page errors', async ({ page }) => {
    // Capture page errors
    page.on('pageerror', error => {
        console.log('Page error:', error.message);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Structured Logging
test('structured logging', async ({ page }) => {
    const log = (action: string, details: object) => {
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            action,
            ...details,
        }));
    };
    
    log('navigate', { url: 'https://playwright.dev' });
    await page.goto('https://playwright.dev');
    
    log('verify', { element: 'title', expected: 'Playwright' });
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Debug Logger
test('debug logger', async ({ page }) => {
    const debug = (message: string, ...args: any[]) => {
        if (process.env.DEBUG) {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    };
    
    debug('Starting test');
    await page.goto('https://playwright.dev');
    
    debug('Page loaded', { url: page.url() });
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Log Test Steps
test('log test steps', async ({ page }) => {
    console.log('Step 1: Navigate to page');
    await page.goto('https://playwright.dev');
    
    console.log('Step 2: Verify title');
    await expect(page).toHaveTitle(/Playwright/);
    
    console.log('Step 3: Click link');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    console.log('Step 4: Verify navigation');
    await expect(page).toHaveURL(/.*intro/);
    
    console.log('All steps completed');
});

// Solution 11: Log Timing
test('log timing', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('https://playwright.dev');
    console.log(`Navigation took ${Date.now() - start}ms`);
    
    const clickStart = Date.now();
    await page.getByRole('link', { name: 'Get started' }).click();
    console.log(`Click took ${Date.now() - clickStart}ms`);
    
    console.log(`Total time: ${Date.now() - start}ms`);
});

// Solution 12: Logging Best Practices
test('logging best practices', async ({ page }) => {
    /*
     * Logging Best Practices:
     * 1. Log meaningful information
     * 2. Use structured logging
     * 3. Include timestamps
     * 4. Filter by log level
     * 5. Don't log sensitive data
     * 6. Clean up debug logs before commit
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

