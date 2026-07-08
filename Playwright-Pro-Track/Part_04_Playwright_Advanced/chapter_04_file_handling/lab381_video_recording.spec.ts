/**
 * Lab 381: Video Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording test videos:
 * 
 * - Video options
 * - Video path
 * - Video size
 * - Retention
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Record test video
 * 2. Configure options
 * 3. Save video
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Enable Video Recording
test('enable video recording', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * use: {
     *   video: 'on',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Video on Failure
test('video on failure', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * use: {
     *   video: 'on-first-retry',
     * }
     * 
     * Or:
     * use: {
     *   video: 'retain-on-failure',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Video with Size
test('video with size', async ({ page }) => {
    /*
     * In playwright.config.ts:
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

// Solution 4: Video in Context
test('video in context', async ({ browser }) => {
    const context = await browser.newContext({
        recordVideo: {
            dir: 'videos/',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close(); // Video saved on close
});

// Solution 5: Video with Custom Size
test('video with custom size', async ({ browser }) => {
    const context = await browser.newContext({
        recordVideo: {
            dir: 'videos/',
            size: { width: 800, height: 600 },
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Get Video Path
test('get video path', async ({ browser }) => {
    const context = await browser.newContext({
        recordVideo: { dir: 'videos/' },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Get video path
    const videoPath = await page.video()?.path();
    console.log('Video path:', videoPath);
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Save Video with Name
test('save video with name', async ({ browser }) => {
    const context = await browser.newContext({
        recordVideo: { dir: 'videos/' },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    
    // Close context to finalize video
    await context.close();
    
    // Video is saved with auto-generated name
});

// Solution 8: Video Retention Policy
test('video retention policy', async ({ page }) => {
    /*
     * Video retention options:
     * 
     * 'off' - No video
     * 'on' - Always record
     * 'retain-on-failure' - Keep only on failure
     * 'on-first-retry' - Record on retry
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Video in Test Info
test('video in test info', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    // Access video from test info
    // const video = testInfo.attachments.find(a => a.name === 'video');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Video Recording Best Practices
test('video recording best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use retain-on-failure
     * 2. Set appropriate size
     * 3. Clean up old videos
     * 4. Use for debugging
     * 5. Configure in CI/CD
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

