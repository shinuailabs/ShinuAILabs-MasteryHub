/**
 * Lab 349: Test Info
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using TestInfo object:
 * 
 * - Test metadata
 * - Test status
 * - Attachments
 * - Output paths
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access test info
 * 2. Use test metadata
 * 3. Attach artifacts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Test Info
test('basic test info', async ({ page }, testInfo) => {
    console.log('Test title:', testInfo.title);
    console.log('Test file:', testInfo.file);
    console.log('Test line:', testInfo.line);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Project Info
test('project info', async ({ page }, testInfo) => {
    console.log('Project name:', testInfo.project.name);
    console.log('Project timeout:', testInfo.project.timeout);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Test Status
test.afterEach(async ({ page }, testInfo) => {
    console.log('Test status:', testInfo.status);
    console.log('Expected status:', testInfo.expectedStatus);
    console.log('Duration:', testInfo.duration, 'ms');
    
    if (testInfo.status !== testInfo.expectedStatus) {
        console.log('Test failed!');
    }
});

test('test status', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Retry Info
test('retry info', async ({ page }, testInfo) => {
    console.log('Retry attempt:', testInfo.retry);
    console.log('Max retries:', testInfo.project.retries);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Output Paths
test('output paths', async ({ page }, testInfo) => {
    console.log('Output dir:', testInfo.outputDir);
    
    // Get path for custom output
    const screenshotPath = testInfo.outputPath('screenshot.png');
    console.log('Screenshot path:', screenshotPath);
    
    await page.goto('https://playwright.dev');
    await page.screenshot({ path: screenshotPath });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Attach Files
test('attach files', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach screenshot
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Attach Text
test('attach text', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach text data
    await testInfo.attach('page-url', {
        body: page.url(),
        contentType: 'text/plain',
    });
    
    await testInfo.attach('page-html', {
        body: await page.content(),
        contentType: 'text/html',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Annotations
test('annotations', async ({ page }, testInfo) => {
    // Add annotations
    testInfo.annotations.push(
        { type: 'issue', description: 'https://github.com/issue/123' },
        { type: 'category', description: 'smoke' },
    );
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Set Timeout
test('set timeout', async ({ page }, testInfo) => {
    // Override timeout for this test
    testInfo.setTimeout(60000);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Snapshot Path
test('snapshot path', async ({ page }, testInfo) => {
    // Get snapshot path for visual comparison
    const snapshotPath = testInfo.snapshotPath('homepage.png');
    console.log('Snapshot path:', snapshotPath);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Test Errors
test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.errors.length > 0) {
        console.log('Test errors:');
        for (const error of testInfo.errors) {
            console.log('  -', error.message);
        }
    }
});

test('test errors', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Test Info Best Practices
test('test info best practices', async ({ page }, testInfo) => {
    /*
     * Best Practices:
     * 1. Use testInfo for debugging
     * 2. Attach relevant artifacts
     * 3. Add meaningful annotations
     * 4. Use output paths for files
     * 5. Check status in afterEach
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

