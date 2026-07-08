/**
 * Lab 314: Video Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording test videos:
 * 
 * - Video configuration
 * - Recording modes
 * - Video size
 * - Saving videos
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure video recording
 * 2. Use different modes
 * 3. Access recorded videos
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Video Recording Configuration
test('video recording configuration', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   video: 'on', // 'on', 'off', 'on-first-retry', 'retain-on-failure'
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Video On First Retry
test('video on first retry', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   video: 'on-first-retry',
     * }
     * 
     * Records video only when test is retried
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Video Retain On Failure
test('video retain on failure', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   video: 'retain-on-failure',
     * }
     * 
     * Keeps video only for failed tests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Video Size Configuration
test('video size configuration', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   video: {
     *     mode: 'on',
     *     size: { width: 1280, height: 720 },
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Access Video Path
test('access video path', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Close page to finalize video
    await page.close();
    
    // Get video path (if video recording is enabled)
    const video = page.video();
    if (video) {
        const path = await video.path();
        console.log('Video saved to:', path);
    }
});

// Solution 6: Save Video with Custom Name
test('save video with custom name', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Video is automatically saved to test-results
    // Custom naming via testInfo
    console.log('Test:', testInfo.title);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Video in Context
test('video in context', async ({ browser }) => {
    // Create context with video
    const context = await browser.newContext({
        recordVideo: {
            dir: 'videos/',
            size: { width: 1280, height: 720 },
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Close context to save video
    await context.close();
});

// Solution 8: Video Per Project
test('video per project', async ({ page }) => {
    /*
     * Configure per project in playwright.config.ts:
     * 
     * projects: [
     *   {
     *     name: 'chromium',
     *     use: { video: 'on' },
     *   },
     *   {
     *     name: 'firefox',
     *     use: { video: 'retain-on-failure' },
     *   },
     * ]
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Video Output Directory
test('video output directory', async ({ page }) => {
    /*
     * Configure output directory:
     * 
     * use: {
     *   video: {
     *     mode: 'on',
     *     dir: 'test-videos/',
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Video Best Practices
test('video best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use 'retain-on-failure' for CI
     * 2. Use 'on' for debugging
     * 3. Set appropriate video size
     * 4. Clean up old videos
     * 5. Attach videos to test reports
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

