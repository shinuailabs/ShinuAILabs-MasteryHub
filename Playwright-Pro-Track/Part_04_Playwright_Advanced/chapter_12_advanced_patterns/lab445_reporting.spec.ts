/**
 * Lab 445: Test Reporting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating test reports:
 * 
 * - Built-in reporters
 * - Custom reporters
 * - Report formats
 * - CI integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure reporters
 * 2. Generate reports
 * 3. Customize report output
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Test with Annotations
test('test with annotations', async ({ page }, testInfo) => {
    testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/issue/123',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Test with Attachments
test('test with attachments', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach screenshot
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Test with Custom Data
test('test with custom data', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach custom data
    await testInfo.attach('test-data', {
        body: JSON.stringify({ url: page.url(), timestamp: Date.now() }),
        contentType: 'application/json',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Test with Steps
test('test with steps', async ({ page }, testInfo) => {
    await test.step('Navigate to page', async () => {
        await page.goto('https://playwright.dev');
    });
    
    await test.step('Verify title', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    await test.step('Check visibility', async () => {
        await expect(page.locator('body')).toBeVisible();
    });
});

// Solution 5: Nested Steps
test('nested steps', async ({ page }) => {
    await test.step('Setup', async () => {
        await test.step('Navigate', async () => {
            await page.goto('https://playwright.dev');
        });
        
        await test.step('Wait for load', async () => {
            await page.waitForLoadState('networkidle');
        });
    });
    
    await test.step('Verify', async () => {
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 6: Test Duration Tracking
test('duration tracking', async ({ page }, testInfo) => {
    const startTime = Date.now();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    const duration = Date.now() - startTime;
    console.log('Test duration:', duration, 'ms');
    
    testInfo.annotations.push({
        type: 'duration',
        description: `${duration}ms`,
    });
});

// Solution 7: Error Reporting
test('error reporting', async ({ page }, testInfo) => {
    try {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    } catch (error) {
        // Attach error details
        await testInfo.attach('error-details', {
            body: JSON.stringify({
                message: (error as Error).message,
                stack: (error as Error).stack,
            }),
            contentType: 'application/json',
        });
        throw error;
    }
});

// Solution 8: Video and Trace
test('video and trace', async ({ page }, testInfo) => {
    // Configure in playwright.config.ts:
    // video: 'on-first-retry'
    // trace: 'on-first-retry'
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    console.log('Output dir:', testInfo.outputDir);
});

// Solution 9: Multiple Reporters
/*
 * Configure in playwright.config.ts:
 * reporter: [
 *   ['list'],
 *   ['html', { outputFolder: 'playwright-report' }],
 *   ['json', { outputFile: 'test-results.json' }],
 *   ['junit', { outputFile: 'junit-results.xml' }],
 * ]
 */
test('multiple reporters test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Reporting Best Practices
test('reporting best practices', async ({ page }, testInfo) => {
    /*
     * Reporting Best Practices:
     * 
     * Annotations:
     * - Link to issues/tickets
     * - Add test categories
     * - Include metadata
     * 
     * Attachments:
     * - Screenshots on failure
     * - Network logs
     * - Custom data
     * 
     * Steps:
     * - Break down complex tests
     * - Improve readability
     * - Aid debugging
     * 
     * Reporters:
     * - HTML for local development
     * - JSON for CI processing
     * - JUnit for CI integration
     */
    
    testInfo.annotations.push({
        type: 'category',
        description: 'smoke',
    });
    
    await test.step('Navigate and verify', async () => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

