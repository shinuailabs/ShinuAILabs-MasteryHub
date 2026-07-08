/**
 * Lab 319: Test Artifacts
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing test artifacts:
 * 
 * - Attachments
 * - Output directory
 * - Artifact types
 * - Cleanup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Attach artifacts to tests
 * 2. Configure output directory
 * 3. Manage artifact lifecycle
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';

// Solution 1: Attach Screenshot
test('attach screenshot', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Take screenshot and attach
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Attach Text
test('attach text', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach text content
    await testInfo.attach('page-url', {
        body: page.url(),
        contentType: 'text/plain',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Attach JSON
test('attach JSON', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach JSON data
    const data = { url: page.url(), title: await page.title() };
    await testInfo.attach('page-info', {
        body: JSON.stringify(data, null, 2),
        contentType: 'application/json',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Attach File
test('attach file', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Save screenshot to file
    const screenshotPath = testInfo.outputPath('screenshot.png');
    await page.screenshot({ path: screenshotPath });
    
    // Attach file
    await testInfo.attach('screenshot-file', {
        path: screenshotPath,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Output Path
test('output path', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Get output path for test
    const outputDir = testInfo.outputDir;
    const outputPath = testInfo.outputPath('custom-file.txt');
    
    console.log('Output dir:', outputDir);
    console.log('Output path:', outputPath);
    
    // Write to output path
    fs.writeFileSync(outputPath, 'Test output');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Multiple Attachments
test('multiple attachments', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach multiple items
    await testInfo.attach('url', {
        body: page.url(),
        contentType: 'text/plain',
    });
    
    await testInfo.attach('title', {
        body: await page.title(),
        contentType: 'text/plain',
    });
    
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Attach HTML
test('attach HTML', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Attach page HTML
    const html = await page.content();
    await testInfo.attach('page-html', {
        body: html,
        contentType: 'text/html',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Attach Video
test('attach video', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Video is automatically attached if configured
    // Manual attachment:
    const video = page.video();
    if (video) {
        await page.close();
        const path = await video.path();
        await testInfo.attach('video', {
            path: path,
            contentType: 'video/webm',
        });
    }
});

// Solution 9: Artifact Configuration
test('artifact configuration', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * outputDir: 'test-results',
     * 
     * use: {
     *   screenshot: 'only-on-failure',
     *   video: 'retain-on-failure',
     *   trace: 'retain-on-failure',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Artifact Best Practices
test('artifact best practices', async ({ page }, testInfo) => {
    /*
     * Best Practices:
     * 1. Attach relevant data for debugging
     * 2. Use appropriate content types
     * 3. Clean up old artifacts
     * 4. Configure retention policies
     * 5. Include artifacts in CI reports
     */
    
    await page.goto('https://playwright.dev');
    
    // Attach useful debugging info
    await testInfo.attach('test-info', {
        body: JSON.stringify({
            title: testInfo.title,
            project: testInfo.project.name,
            retry: testInfo.retry,
        }, null, 2),
        contentType: 'application/json',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

