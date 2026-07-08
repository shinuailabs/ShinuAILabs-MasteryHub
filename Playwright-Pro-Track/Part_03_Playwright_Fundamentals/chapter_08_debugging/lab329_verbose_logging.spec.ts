/**
 * Lab 329: Verbose Logging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Enabling verbose logging:
 * 
 * - DEBUG environment variable
 * - Log categories
 * - Custom logging
 * - Log analysis
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Enable verbose logging
 * 2. Filter log categories
 * 3. Analyze logs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Enable All Logs
test('enable all logs', async ({ page }) => {
    /*
     * Enable all Playwright logs:
     * DEBUG=pw:* npx playwright test
     * 
     * Windows:
     * set DEBUG=pw:* && npx playwright test
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: API Logs
test('API logs', async ({ page }) => {
    /*
     * Enable API logs:
     * DEBUG=pw:api npx playwright test
     * 
     * Shows all Playwright API calls
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Browser Logs
test('browser logs', async ({ page }) => {
    /*
     * Enable browser logs:
     * DEBUG=pw:browser npx playwright test
     * 
     * Shows browser process output
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Protocol Logs
test('protocol logs', async ({ page }) => {
    /*
     * Enable protocol logs:
     * DEBUG=pw:protocol npx playwright test
     * 
     * Shows CDP/WebSocket messages
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Multiple Log Categories
test('multiple log categories', async ({ page }) => {
    /*
     * Enable multiple categories:
     * DEBUG=pw:api,pw:browser npx playwright test
     * 
     * Or use wildcard:
     * DEBUG=pw:* npx playwright test
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Save Logs to File
test('save logs to file', async ({ page }) => {
    /*
     * Save logs to file:
     * DEBUG=pw:api npx playwright test 2>&1 | tee playwright.log
     * 
     * Or redirect:
     * DEBUG=pw:api npx playwright test > playwright.log 2>&1
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Custom Logger
test('custom logger', async ({ page }) => {
    const logger = {
        log: (message: string) => {
            console.log(`[${new Date().toISOString()}] ${message}`);
        },
        error: (message: string) => {
            console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
        },
    };
    
    logger.log('Starting test');
    await page.goto('https://playwright.dev');
    
    logger.log('Page loaded');
    await expect(page).toHaveTitle(/Playwright/);
    
    logger.log('Test completed');
});

// Solution 8: Action Logger
test('action logger', async ({ page }) => {
    const logAction = async (action: string, fn: () => Promise<void>) => {
        console.log(`Starting: ${action}`);
        const start = Date.now();
        await fn();
        console.log(`Completed: ${action} (${Date.now() - start}ms)`);
    };
    
    await logAction('navigate', () => page.goto('https://playwright.dev'));
    await logAction('click', () => page.getByRole('link', { name: 'Get started' }).click());
    await logAction('verify', () => expect(page).toHaveURL(/.*intro/));
});

// Solution 9: Request Logger
test('request logger', async ({ page }) => {
    page.on('request', request => {
        console.log(`[REQ] ${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
        console.log(`[RES] ${response.status()} ${response.url()}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Console Logger
test('console logger', async ({ page }) => {
    page.on('console', msg => {
        const type = msg.type().toUpperCase();
        console.log(`[CONSOLE:${type}] ${msg.text()}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Test Info Logger
test('test info logger', async ({ page }, testInfo) => {
    console.log('Test Info:', {
        title: testInfo.title,
        file: testInfo.file,
        project: testInfo.project.name,
        retry: testInfo.retry,
        timeout: testInfo.timeout,
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Verbose Logging Best Practices
test('verbose logging best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use DEBUG=pw:api for API debugging
     * 2. Save logs to file for analysis
     * 3. Use custom loggers for structure
     * 4. Log timing information
     * 5. Filter logs by category
     * 6. Clean up verbose logs in CI
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

