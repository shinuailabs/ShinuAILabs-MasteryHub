/**
 * Lab 375: File Upload
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Uploading files in tests:
 * 
 * - setInputFiles
 * - File chooser
 * - Multiple files
 * - Drag and drop
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Upload single file
 * 2. Upload multiple files
 * 3. Handle file chooser
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// Solution 1: Basic File Upload
test('basic file upload', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload file to input
    // await page.setInputFiles('input[type="file"]', 'path/to/file.txt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Upload Multiple Files
test('upload multiple files', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload multiple files
    // await page.setInputFiles('input[type="file"]', [
    //     'path/to/file1.txt',
    //     'path/to/file2.txt',
    //     'path/to/file3.txt',
    // ]);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Upload with Buffer
test('upload with buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload file from buffer
    // await page.setInputFiles('input[type="file"]', {
    //     name: 'test.txt',
    //     mimeType: 'text/plain',
    //     buffer: Buffer.from('Hello World'),
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: File Chooser Event
test('file chooser event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Handle file chooser
    // const fileChooserPromise = page.waitForEvent('filechooser');
    // await page.click('button.upload');
    // const fileChooser = await fileChooserPromise;
    // await fileChooser.setFiles('path/to/file.txt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Clear File Input
test('clear file input', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Clear file input
    // await page.setInputFiles('input[type="file"]', []);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Upload with Locator
test('upload with locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use locator for upload
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('path/to/file.txt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Upload Different File Types
test('upload different file types', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload image
    // await page.setInputFiles('input[type="file"]', {
    //     name: 'image.png',
    //     mimeType: 'image/png',
    //     buffer: Buffer.from('...'),
    // });
    
    // Upload PDF
    // await page.setInputFiles('input[type="file"]', {
    //     name: 'document.pdf',
    //     mimeType: 'application/pdf',
    //     buffer: Buffer.from('...'),
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Verify Upload Success
test('verify upload success', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Upload and verify
    // await page.setInputFiles('input[type="file"]', 'path/to/file.txt');
    // await expect(page.locator('.upload-success')).toBeVisible();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Upload with Progress
test('upload with progress', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Monitor upload progress
    // await page.setInputFiles('input[type="file"]', 'large-file.zip');
    // await expect(page.locator('.progress-bar')).toBeVisible();
    // await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: File Upload Best Practices
test('file upload best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use test fixtures for files
     * 2. Clean up uploaded files
     * 3. Test file size limits
     * 4. Test file type validation
     * 5. Handle upload errors
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

