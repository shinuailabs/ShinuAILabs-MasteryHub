/**
 * Lab 316: Screenshot on Failure
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Automatic failure screenshots:
 * 
 * - Configuration
 * - Attachment to reports
 * - Custom failure handling
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure failure screenshots
 * 2. Access failure screenshots
 * 3. Custom failure handling
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Screenshot Configuration
test('screenshot configuration', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   screenshot: 'only-on-failure', // 'on', 'off', 'only-on-failure'
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Screenshot Always On
test('screenshot always on', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   screenshot: 'on',
     * }
     * 
     * Takes screenshot after every test
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Screenshot Only On Failure
test('screenshot only on failure', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   screenshot: 'only-on-failure',
     * }
     * 
     * Takes screenshot only when test fails
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Custom Failure Screenshot
test('custom failure screenshot', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    try {
        // This might fail
        await expect(page.locator('.non-existent')).toBeVisible({ timeout: 1000 });
    } catch (error) {
        // Take custom screenshot on failure
        await page.screenshot({
            path: `screenshots/failure-${testInfo.title}.png`,
            fullPage: true,
        });
        throw error;
    }
});

// Solution 5: Attach Screenshot to Report
test('attach screenshot to report', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Take screenshot
    const screenshot = await page.screenshot();
    
    // Attach to test report
    await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Screenshot in AfterEach
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Take screenshot on failure
        const screenshot = await page.screenshot();
        await testInfo.attach('failure-screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});

test('test with afterEach screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Full Page Failure Screenshot
test('full page failure screenshot', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   screenshot: {
     *     mode: 'only-on-failure',
     *     fullPage: true,
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Screenshot Output Directory
test('screenshot output directory', async ({ page }) => {
    /*
     * Screenshots are saved to test-results by default
     * 
     * Configure output directory:
     * outputDir: 'test-results',
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Screenshot Per Project
test('screenshot per project', async ({ page }) => {
    /*
     * Configure per project:
     * 
     * projects: [
     *   {
     *     name: 'chromium',
     *     use: { screenshot: 'on' },
     *   },
     *   {
     *     name: 'firefox',
     *     use: { screenshot: 'only-on-failure' },
     *   },
     * ]
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Screenshot Best Practices
test('screenshot best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use 'only-on-failure' for CI
     * 2. Use 'on' for debugging
     * 3. Enable full page screenshots
     * 4. Attach to test reports
     * 5. Clean up old screenshots
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

