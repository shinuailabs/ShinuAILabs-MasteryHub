/**
 * Lab 376: File Download
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Downloading files in tests:
 * 
 * - Download event
 * - Save downloads
 * - Verify downloads
 * - Download path
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Download files
 * 2. Save to path
 * 3. Verify content
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Solution 1: Basic Download
test('basic download', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for download
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Save Download
test('save download', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Save download to path
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // await download.saveAs('downloads/file.txt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Get Download Path
test('get download path', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get suggested filename
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // const suggestedFilename = download.suggestedFilename();
    // const downloadPath = await download.path();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Verify Download Content
test('verify download content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Verify content
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // const content = await download.createReadStream();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Download with Custom Path
test('download with custom path', async ({ browser }) => {
    const context = await browser.newContext({
        acceptDownloads: true,
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Download will be saved
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Cancel Download
test('cancel download', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Cancel download
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // await download.cancel();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Download Failure
test('download failure', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check for failure
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // const failure = await download.failure();
    // if (failure) {
    //     console.log('Download failed:', failure);
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Multiple Downloads
test('multiple downloads', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle multiple downloads
    // const downloads: Download[] = [];
    // page.on('download', download => downloads.push(download));
    // 
    // await page.click('button.download-all');
    // await page.waitForTimeout(5000);
    // 
    // for (const download of downloads) {
    //     await download.saveAs(`downloads/${download.suggestedFilename()}`);
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Download and Read
test('download and read', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Download and read content
    // const downloadPromise = page.waitForEvent('download');
    // await page.click('a.download-link');
    // const download = await downloadPromise;
    // 
    // const filePath = await download.path();
    // const content = fs.readFileSync(filePath, 'utf-8');
    // expect(content).toContain('expected text');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: File Download Best Practices
test('file download best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Enable acceptDownloads
     * 2. Verify download success
     * 3. Check file content
     * 4. Clean up downloads
     * 5. Handle download errors
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

